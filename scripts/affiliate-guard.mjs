// Garde anti-clic artificiel.
//   node scripts/affiliate-guard.mjs [http://localhost:3999]
// Sortie non nulle si un controle echoue.
//
// Trois familles de verification :
//   1. source  — aucun next/link ne pointe vers /api/go (le routeur le
//                prechargerait, ce qui a produit l'essentiel des lignes
//                historiques d'affiliate_clicks)
//   2. rendu   — le HTML servi ne declenche aucune requete automatique vers
//                /api/go (pas de img/script/iframe/link, uniquement des ancres)
//   3. route   — /api/go repond 204 aux requetes speculatives et ne redirige
//                que sur une vraie navigation
//
// Aucune dependance : le depot n'a pas de lanceur de tests.

import { readdir, readFile } from 'node:fs/promises'
import { request as httpRequest } from 'node:http'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://localhost:3999'
const failures = []
const check = (ok, label, detail) => { if (!ok) failures.push(`${label} — ${detail}`) }

// ---------------------------------------------------------------- 1. source
async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(e.name)) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) await walk(p, out)
    else if (e.name.endsWith('.tsx')) out.push(p)
  }
  return out
}

for (const file of await walk('.')) {
  const src = await readFile(file, 'utf8')
  if (!src.includes('api/go')) continue
  // variables dont la definition contient /api/go, sur plusieurs lignes
  const apiVars = new Set()
  for (const m of src.matchAll(/(?:const|let)\s+(\w+)\s*(?::[^=]*)?=/g)) {
    if (src.slice(m.index + m[0].length, m.index + m[0].length + 320).split(';')[0].includes('api/go')) {
      apiVars.add(m[1])
    }
  }
  for (const m of src.matchAll(/<Link\b[^>]*?>/gs)) {
    const blob = m[0]
    const href = (blob.match(/href=\{([^}]*)\}/) || [])[1]?.trim()
    const risky = blob.includes('api/go') || (href && apiVars.has(href))
    check(!risky, file, `<Link> vers /api/go a la ligne ${src.slice(0, m.index).split('\n').length} — le routeur le prechargerait`)
  }
}

// ------------------------------------------------------- 2. rendu des pages
const PAGES = ['/', '/compare', '/deals', '/prop-firm/earn2trade', '/fr/prop-firm/earn2trade']
for (const path of PAGES) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  if (res.status !== 200) continue
  const html = await res.text()
  // toute balise qui declencherait une requete au chargement
  for (const tag of html.matchAll(/<(img|script|iframe|link|source|video|audio)\b[^>]*>/gi)) {
    check(!/\/api\/go\//.test(tag[0]), `${BASE}${path}`,
      `<${tag[1]}> charge /api/go au rendu : ${tag[0].slice(0, 90)}`)
  }
  // les sorties affiliees doivent etre des ancres
  const anchors = [...html.matchAll(/<a\b[^>]*href="\/api\/go\/[^"]*"[^>]*>/gi)]
  for (const a of anchors) {
    check(/rel="[^"]*noopener/i.test(a[0]), `${BASE}${path}`, `ancre /api/go sans rel noopener : ${a[0].slice(0, 90)}`)
  }
}

// ------------------------------------------------------------- 3. la route
//
// node:http et non fetch : undici impose son propre Sec-Fetch-Mode (il ecrit
// 'cors' meme si on demande 'navigate'), donc fetch ne peut pas imiter une
// navigation de navigateur. Le test echouait sur un artefact de son client,
// pas sur le comportement de la route.
function rawGet(url, headers) {
  const u = new URL(url)
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      { hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: 'GET', headers },
      (res) => { res.resume(); resolve({ status: res.statusCode, headers: res.headers }) }
    )
    req.on('error', reject)
    req.end()
  })
}
const TARGET = `${BASE}/api/go/earn2trade?source=test-guard`
const SPECULATIVE = [
  { 'Next-Router-Prefetch': '1', RSC: '1' },
  { RSC: '1' },
  { Purpose: 'prefetch' },
  { 'Sec-Purpose': 'prefetch' },
  { 'Sec-Purpose': 'prefetch;prerender' },
  { 'X-Purpose': 'prefetch' },
  { 'Sec-Fetch-Mode': 'cors', 'Sec-Fetch-Dest': 'empty' },
  { 'Sec-Fetch-Mode': 'no-cors', 'Sec-Fetch-Dest': 'image' },
]
for (const headers of SPECULATIVE) {
  const res = await rawGet(TARGET, { ...headers, 'User-Agent': 'Mozilla/5.0 Chrome/128' })
  check(res.status === 204, 'route /api/go', `${JSON.stringify(headers)} -> ${res.status}, 204 attendu`)
  check((res.headers['cache-control'] || '').includes('no-store'), 'route /api/go',
    `${JSON.stringify(headers)} sans Cache-Control: no-store`)
}

// Une vraie navigation doit toujours passer. On lit le statut sans suivre la
// redirection : on ne navigue jamais vers le partenaire depuis un test.
const real = await rawGet(TARGET, {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
})
check(real.status >= 300 && real.status < 400, 'route /api/go',
  `navigation reelle -> ${real.status}, une redirection etait attendue`)

console.log(failures.length === 0
  ? 'OK — aucun clic affilie ne peut naitre d un rendu, d un prefetch ou d une metadata'
  : `${failures.length} echec(s) :\n  ` + failures.join('\n  '))
process.exit(failures.length ? 1 : 0)
