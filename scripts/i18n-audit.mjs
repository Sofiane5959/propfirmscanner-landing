// =============================================================================
// SENTINELLE DE TRADUCTION — scripts/i18n-audit.mjs
// =============================================================================
//   node scripts/i18n-audit.mjs          rapport complet
//   node scripts/i18n-audit.mjs --strict sort en erreur si une regression
//
// POURQUOI CE FICHIER EXISTE
//
// Rien dans ce projet ne traduit automatiquement. Les traductions sont des
// donnees statiques ecrites a la main, a trois endroits qui s'ignorent :
//
//   1. messages/<locale>.json        interface partagee (next-intl)
//   2. objets COPY / translations    dans les composants, en dur
//   3. prop_firms.translations       contenu editorial des firmes, en base
//
// Ajouter une page ajoute des chaines ANGLAISES, et rien ne le signale :
// ni TypeScript, qui ne voit qu'un objet, ni le build, qui compile tres bien
// une page monolingue. C'est ainsi que 384 chaines visibles se sont accumulees
// sans qu'aucune alerte ne se declenche, jusqu'a ce qu'un visiteur portugais
// tombe sur une fiche entierement anglaise le 3 septembre 2026.
//
// Ce script est la reponse : il rend le manque VISIBLE et CHIFFRE, et le
// bloque en CI avec --strict.
// =============================================================================

import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const LOCALES = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi']
const STRICT = process.argv.includes('--strict')

const rouge = (s) => `\x1b[31m${s}\x1b[0m`
const vert = (s) => `\x1b[32m${s}\x1b[0m`
const gras = (s) => `\x1b[1m${s}\x1b[0m`

let problemes = 0

// -----------------------------------------------------------------------------
// Outil : isole le litteral d'objet qui suit une position donnee
// -----------------------------------------------------------------------------
function objetA(src, depuis) {
  const start = src.indexOf('{', depuis)
  if (start < 0) return null
  let d = 0
  for (let j = start; j < src.length; j++) {
    if (src[j] === '{') d++
    else if (src[j] === '}') {
      d--
      if (d === 0) return src.slice(start, j + 1)
    }
  }
  return null
}

function clesDeLocale(bloc, loc) {
  const m = new RegExp(`(?:^|[,{\\s])${loc}\\s*:\\s*\\{`).exec(bloc)
  if (!m) return 0
  const sous = objetA(bloc, m.index + m[0].length - 1)
  if (!sous) return 0
  return (sous.match(/^\s{4,}[a-zA-Z_]\w*\s*:/gm) || []).length
}

function fichiers(motif) {
  try {
    return execSync(`grep -rl "${motif}" --include=*.tsx --include=*.ts app components lib`,
      { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
  } catch {
    return []
  }
}

// -----------------------------------------------------------------------------
// 1. messages/<locale>.json — l'interface partagee
// -----------------------------------------------------------------------------
console.log(gras('\n1. messages/<locale>.json'))
function aplati(o, prefixe = '', sortie = []) {
  for (const [k, v] of Object.entries(o)) {
    const cle = prefixe ? `${prefixe}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) aplati(v, cle, sortie)
    else sortie.push(cle)
  }
  return sortie
}
const parLocale = {}
for (const loc of LOCALES) {
  const p = `messages/${loc}.json`
  parLocale[loc] = existsSync(p) ? aplati(JSON.parse(readFileSync(p, 'utf8'))) : []
}
const ref = new Set(parLocale.en)
for (const loc of LOCALES) {
  const manquantes = [...ref].filter((k) => !parLocale[loc].includes(k))
  const enTrop = parLocale[loc].filter((k) => !ref.has(k))
  const ok = manquantes.length === 0 && enTrop.length === 0
  if (!ok) problemes++
  console.log(`   ${loc.padEnd(3)} ${String(parLocale[loc].length).padStart(4)} cles  ` +
    (ok ? vert('complet')
        : rouge(`${manquantes.length} manquante(s)`) +
          (enTrop.length ? `, ${enTrop.length} en trop` : '')))
  if (manquantes.length) console.log('       ' + manquantes.slice(0, 5).join(', '))
}

// -----------------------------------------------------------------------------
// 2. Dictionnaires ecrits en dur dans les composants
// -----------------------------------------------------------------------------
console.log(gras('\n2. Dictionnaires dans les composants'))
const avecDico = fichiers('const translations: Record<Locale\\|const COPY = {')
let dicosIncomplets = 0
for (const f of avecDico) {
  const src = readFileSync(f, 'utf8')
  const i = Math.max(src.indexOf('const translations: Record<Locale'), src.indexOf('const COPY'))
  if (i < 0) continue
  const bloc = objetA(src, i)
  if (!bloc) continue
  const counts = Object.fromEntries(LOCALES.map((l) => [l, clesDeLocale(bloc, l)]))
  const attendu = counts.en
  const trous = LOCALES.filter((l) => counts[l] < attendu)
  if (trous.length) {
    dicosIncomplets++
    problemes++
    console.log('   ' + rouge('✗') + ' ' + f.replace('app/[locale]/', ''))
    console.log('     ' + trous.map((l) => `${l}:${counts[l]}/${attendu}`).join('  '))
  }
}
if (!dicosIncomplets) console.log('   ' + vert(`✓ ${avecDico.length} dictionnaires complets dans les 7 langues`))

// -----------------------------------------------------------------------------
// 3. Chaines visibles ecrites en dur, qui ne traversent aucun dictionnaire
// -----------------------------------------------------------------------------
console.log(gras('\n3. Texte visible non traduisible'))
const ANGLAIS = /\b(?:the|and|or|your|you|for|with|from|all|new|best|free|see|get|find|more|no|not|is|are|to|of|in|on|at|by|prop|firm|firms|trading|account|profit|split|payout|rules|price|compare|deals|verified|review|search|sort|filter|show|next|back|start|now|why|how|what|which|our|this|that)\b/i
let enDur = 0
const parFichier = []
for (const f of fichiers('export default')) {
  let src
  try { src = readFileSync(f, 'utf8') } catch { continue }
  const trouve = []
  for (const m of src.matchAll(/>\s*([A-Z][A-Za-z][^<>{}\n]{3,60})\s*</g)) {
    const t = m[1].trim()
    if (ANGLAIS.test(t) && !/^[A-Z0-9_\s]+$/.test(t)) trouve.push(t)
  }
  for (const m of src.matchAll(/(?:placeholder|aria-label|title|alt)="([^"{}]{4,60})"/g)) {
    if (ANGLAIS.test(m[1])) trouve.push(m[1])
  }
  if (trouve.length) { enDur += trouve.length; parFichier.push([f, trouve.length]) }
}
parFichier.sort((a, b) => b[1] - a[1])
console.log(`   ${enDur === 0 ? vert('✓ aucune') : rouge(enDur + ' chaines')} sur ${parFichier.length} fichiers`)
for (const [f, n] of parFichier.slice(0, 8)) {
  console.log(`     ${String(n).padStart(4)}  ${f.replace('app/[locale]/', '')}`)
}
if (parFichier.length > 8) console.log(`     ... et ${parFichier.length - 8} autres fichiers`)
if (enDur) problemes++

// -----------------------------------------------------------------------------
// 4. Contenu editorial des firmes
// -----------------------------------------------------------------------------
console.log(gras('\n4. Contenu editorial des firmes (bundles translations)'))
try {
  const { ALL_FIRMS } = await import('./firm-content.mjs')
  const { BUNDLES } = await import('./firm-translations/index.mjs')
  const aTraduire = LOCALES.filter((l) => l !== 'en')
  for (const firme of ALL_FIRMS) {
    // Le francais vit dans firm-content.mjs (bloc `fr`), les autres langues
    // dans firm-translations/<locale>.mjs. Il faut regarder les deux.
    const presents = aTraduire.filter((l) =>
      (firme[l] && Object.keys(firme[l]).length) ||
      (BUNDLES[l]?.[firme.slug] && Object.keys(BUNDLES[l][firme.slug]).length))
    const absents = aTraduire.filter((l) => !presents.includes(l))
    const ok = absents.length === 0
    if (!ok) problemes++
    console.log(`   ${ok ? vert('✓') : rouge('✗')} ${firme.slug.padEnd(16)} ` +
      (ok ? vert('7/7') : `${presents.length + 1}/7 — manque ${absents.join(', ')}`))
  }
} catch (e) {
  console.log('   (firm-content.mjs illisible : ' + e.message + ')')
}

// -----------------------------------------------------------------------------
console.log(gras('\nRESULTAT'))
if (problemes === 0) {
  console.log(vert('   Aucun trou de traduction.\n'))
} else {
  console.log(rouge(`   ${problemes} categorie(s) de trous.`))
  console.log('   Corrige-les, ou lance sans --strict pour un simple rapport.\n')
}
if (STRICT && problemes > 0) process.exit(1)
