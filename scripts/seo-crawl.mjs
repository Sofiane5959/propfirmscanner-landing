// Verification SEO — crawl des routes indexables d'un serveur local.
//   node scripts/seo-crawl.mjs [http://localhost:3999]
// Sortie non nulle si un controle echoue, pour usage en CI.
//
// Aucune dependance : le depot n'a pas de lanceur de tests, et en ajouter un
// est une decision qui n'a pas encore ete prise.

const BASE = process.argv[2] || 'http://localhost:3999'
const PROD = 'https://www.propfirmscanner.org'
const TRANSLATED = ['en', 'fr']
const OTHER = ['de', 'es', 'pt', 'ar', 'hi']
// Data-driven routes are only meaningful against a real database: without
// Supabase the firm page renders "Prop Firm Not Found" and inherits the
// layout's metadata. Pass --with-data to include them when crawling an
// environment that has one.
const DATA_PATHS = ['/prop-firm/earn2trade', '/compare/ftmo-vs-fundednext']
const PATHS = ['/', '/compare', '/deals', '/blog', '/faq', '/about', '/glossary', '/contact',
  ...(process.argv.includes('--with-data') ? DATA_PATHS : [])]

const attr = (html, re) => (html.match(re) || [])[1] ?? null
const failures = []
const check = (ok, label, detail) => {
  if (!ok) failures.push(`${label} — ${detail}`)
  return ok
}

async function get(url) {
  const r = await fetch(url, { redirect: 'manual' })
  return { status: r.status, location: r.headers.get('location'), html: r.status < 300 ? await r.text() : '' }
}

for (const path of PATHS) {
  for (const loc of ['en', ...TRANSLATED.slice(1), ...OTHER]) {
    const url = loc === 'en' ? `${BASE}${path}` : `${BASE}/${loc}${path === '/' ? '' : path}`
    const { status, html } = await get(url)
    if (status !== 200) { check(false, url, `statut ${status}`); continue }

    // 1. lang et dir cote serveur
    const tag = (html.match(/<html[^>]*>/) || [''])[0]
    const lang = attr(tag, /lang="([a-z-]+)"/)
    const dir = attr(tag, /dir="([a-z]+)"/)
    check(lang === loc, url, `html lang="${lang}" attendu "${loc}"`)
    check(dir === (loc === 'ar' ? 'rtl' : 'ltr'), url, `html dir="${dir}"`)

    // 2. canonical : absolu, en www, jamais prefixe /en
    const canonical = attr(html, /rel="canonical" href="([^"]+)"/)
    check(!!canonical, url, 'canonical absent')
    if (canonical) {
      check(canonical === PROD || canonical.startsWith(`${PROD}/`), url, `canonical hors ${PROD} : ${canonical}`)
      check(!/\/en(\/|$)/.test(new URL(canonical).pathname), url, `canonical prefixe /en : ${canonical}`)
      // auto-referentiel pour les locales traduites
      if (TRANSLATED.includes(loc)) {
        // Next serialises the root canonical without a trailing slash.
        const expected = loc === 'en' ? (path === '/' ? PROD : `${PROD}${path}`) : `${PROD}/${loc}${path === '/' ? '' : path}`
        check(canonical === expected, url, `canonical non auto-referentiel : ${canonical} attendu ${expected}`)
      }
    }

    // 3. hreflang : uniquement les traductions reelles, jamais /en, reciproques
    const alts = [...html.matchAll(/rel="alternate" hrefLang="([a-z-]+)" href="([^"]+)"/gi)]
    const langs = alts.map(m => m[1].toLowerCase()).sort()
    if (alts.length) {
      check(JSON.stringify(langs) === JSON.stringify([...TRANSLATED, 'x-default'].sort()),
            url, `hreflang = ${langs.join(',')}`)
      for (const [, l, href] of alts) {
        check(!/\/en(\/|$)/.test(new URL(href).pathname), url, `hreflang ${l} prefixe /en : ${href}`)
      }
    }
  }
}

// 4. les routes /en doivent rediriger, pas repondre 200
for (const path of PATHS) {
  const { status } = await get(`${BASE}/en${path === '/' ? '' : path}`)
  check(status >= 300 && status < 400, `${BASE}/en${path}`, `statut ${status}, une redirection etait attendue`)
}

console.log(failures.length === 0
  ? `OK — tous les controles passent (${PATHS.length} chemins x 7 locales)`
  : `${failures.length} echec(s) :\n  ` + failures.join('\n  '))
process.exit(failures.length ? 1 : 0)
