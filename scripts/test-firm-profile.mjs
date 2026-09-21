// Garde-fous de la page firme universelle (components/prop-firm/profile).
//
//   node scripts/test-firm-profile.mjs
//
// 1. Aucun texte metier dans les composants : ni nom de firme, ni programme,
//    ni code promo, ni slug, ni montant ecrit en dur.
// 2. Aucune couleur ecrite en dur : tout passe par les jetons Tailwind du site.
// 3. Aucune branche sur un slug.
// 4. La bascule du pilote est une liste de slugs et de langues, rien d'autre.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const RACINE = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const DOSSIER = join(RACINE, 'components/prop-firm/profile')
const FICHES = join(RACINE, 'data/firms')

let reussis = 0
const echecs = []
const cas = (nom, ok, detail = '') => (ok ? reussis++ : echecs.push(`${nom}${detail ? ` — ${detail}` : ''}`))

const sources = readdirSync(DOSSIER)
  .filter((f) => /\.(ts|tsx)$/.test(f))
  .map((f) => ({ f, code: readFileSync(join(DOSSIER, f), 'utf8') }))
// Les commentaires peuvent citer une firme en exemple ; le code, non.
const sansCommentaires = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')

// Vocabulaire du MODELE (types de programme, phases) : il peut coincider avec
// un slug de programme sans etre un texte metier.
const VOCABULAIRE_MODELE = new Set(['evaluation', 'instant', 'funded'])

// Termes metier tires de toutes les fiches presentes.
const termes = new Set()
for (const f of readdirSync(FICHES).filter((x) => x.endsWith('.json'))) {
  const fiche = JSON.parse(readFileSync(join(FICHES, f), 'utf8'))
  termes.add(fiche.slug)
  termes.add(fiche.nom)
  if (fiche.offre?.code) termes.add(fiche.offre.code)
  for (const p of fiche.programmes) {
    termes.add(p.slug)
    termes.add(p.nom)
  }
}

for (const { f, code } of sources) {
  const c = sansCommentaires(code)
  for (const t of termes) {
    if (VOCABULAIRE_MODELE.has(t.toLowerCase())) continue
    const motif = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    cas(`${f} ne contient pas « ${t} »`, !motif.test(c))
  }
  cas(`${f} : aucun montant en dur`, !/['"`][^'"`\n]*\$\s?\d/.test(c), (c.match(/['"`][^'"`\n]*\$\s?\d[^'"`\n]*/) || [''])[0])
  cas(`${f} : aucune couleur hexadecimale`, !/#[0-9a-fA-F]{3,8}\b/.test(c), (c.match(/#[0-9a-fA-F]{3,8}\b/) || [''])[0])
  cas(`${f} : aucune couleur Tailwind hors jetons`, !/\b(?:bg|text|border|ring|fill)-(?:emerald|green|gray|slate|zinc|orange|amber|blue)-\d{2,3}\b/.test(c))
  cas(`${f} : aucune branche sur un slug`, !/slug\s*[!=]==?\s*['"`]/.test(c))
}

const rollout = readFileSync(join(RACINE, 'data/firms/rollout.ts'), 'utf8')
cas('rollout.ts exporte une liste slug → langues', /FIRM_PROFILE_ROLLOUT:\s*Readonly<Record<string, readonly string\[\]>>/.test(rollout))

const route = readFileSync(join(RACINE, 'app/[locale]/prop-firm/[slug]/page.tsx'), 'utf8')
cas('la route ne passe par FirmProfilePage que via profilActif', /FIRM_SHEETS\[firm\.slug\] && profilActif\(firm\.slug, locale\)/.test(route))
cas('la route garde UniversalFirmPage pour le retour arriere', route.includes('<UniversalFirmPage'))
cas('la route garde l\'ancien rendu pour le retour arriere', route.includes('<PropFirmPageClient'))

// Offre : rien ne s'affiche sans confirmation du partenaire (21 septembre 2026).
const page = readFileSync(join(DOSSIER, 'FirmProfilePage.tsx'), 'utf8')
cas('FirmProfilePage filtre l\'offre avant toute section', /const sheet = ficheAffichable\(ficheBrute\)/.test(page))
for (const f of readdirSync(FICHES).filter((x) => x.endsWith('.json'))) {
  const fiche = JSON.parse(readFileSync(join(FICHES, f), 'utf8'))
  if (!fiche.offre) continue
  cas(`${f} : statut d'offre renseigne`, ['confirmed', 'needs_confirmation'].includes(fiche.offre.statut), String(fiche.offre.statut))
}

console.log('\n' + '-'.repeat(60))
for (const e of echecs) console.log('ECHEC :', e)
console.log(`${reussis} reussis, ${echecs.length} echoues`)
process.exit(echecs.length ? 1 : 0)
