// =============================================================================
// CANDIDAT DE PUBLICATION — VERSION 1        scripts/publication-candidate.mjs
// =============================================================================
//   npm run publication:candidate
//
// Produit le contenu EXACT que `publishFirmVersion` ecrirait dans
// `firm_page_versions` pour FuturesElite : modele detaille, resume, rapport de
// validation, empreinte des sources.
//
// Le candidat n'est donc pas redige a la main. Il sort des memes fonctions que
// la transaction de publication, appliquees aux memes fixtures que le SQL
// genere. Un candidat ecrit a la main serait une quatrieme source de verite —
// celle-la meme dont on sort.
//
// AUCUNE ECRITURE EN BASE. Le fichier produit sert la relecture.
// =============================================================================

import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  FUTURESELITE_PROGRAMS, FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION,
  FUTURESELITE_PLATFORMS, FUTURESELITE_RULES, FUTURESELITE_BUNDLES, FUTURESELITE_LIVE_TIERS,
} from './futureselite-programs.mjs'
import { FUTURESELITE } from './firm-content.mjs'

// -----------------------------------------------------------------------------
// 1. Compiler les quatre modules. `import type` est efface a l'emission, donc
//    l'alias `@/` n'a pas besoin d'etre resolu.
// -----------------------------------------------------------------------------
const dir = mkdtempSync(join(tmpdir(), 'pubcand-'))
const SOURCES = [
  'lib/firm-page-model.ts',
  'lib/validate-firm-page-model.ts',
  'lib/firm-summary-model.ts',
  'lib/publication/source-hash.ts',
  'lib/publication/schema.ts',
]
try {
  execSync(
    `npx tsc ${SOURCES.join(' ')} --outDir "${dir}" --module esnext --target es2022 ` +
    `--skipLibCheck --noResolve`,
    { stdio: 'pipe' }
  )
} catch {
  // Les erreurs de resolution d'alias sont attendues ; l'emission a lieu.
}

// `--noResolve` met les sorties a plat sauf quand un sous-dossier existe. On
// cherche donc les deux emplacements plutot que de supposer.
const chemin = (nom) => {
  for (const candidat of [join(dir, nom), join(dir, 'publication', nom), join(dir, 'lib', nom)]) {
    if (existsSync(candidat)) return candidat
  }
  console.error(`Compilation incomplete : ${nom} introuvable sous ${dir}`)
  process.exit(1)
}

const { buildFirmPageModel } = await import(pathToFileURL(chemin('firm-page-model.js')).href)
const { validateFirmPageModel, validateCta } = await import(pathToFileURL(chemin('validate-firm-page-model.js')).href)
const { summaryFromPageModel } = await import(pathToFileURL(chemin('firm-summary-model.js')).href)
const { sourceHash } = await import(pathToFileURL(chemin('source-hash.js')).href)
const { MODEL_SCHEMA_VERSION, isSupportedSchema, MIN_SUPPORTED_SCHEMA, MAX_SUPPORTED_SCHEMA } =
  await import(pathToFileURL(chemin('schema.js')).href)

// -----------------------------------------------------------------------------
// 2. Les memes entrees que le SQL genere
// -----------------------------------------------------------------------------
const programData = {
  programs: FUTURESELITE_PROGRAMS.map((p) => ({
    slug: p.slug,
    name: p.name,
    market: p.market,
    program_family: null,
    status: p.status,
    kind: p.kind,
    evaluation_steps: p.evaluation_steps ?? null,
    summary: p.summary ?? null,
    sort_order: p.sort_order ?? 0,
    max_funded_accounts: p.max_funded_accounts ?? null,
    max_funded_note: p.max_funded_note ?? null,
    source_url: p.source_url ?? null,
    verified_at: null,
    plans: p.plans.map((pl) => ({
      variant_key: pl.variant_key ?? null,
      currency: pl.currency ?? 'USD',
      confidence: pl.confidence ?? null,
      buffer: null, buffer_status: null, contract_scaling: null,
      news_trading_status: null, news_trading_note: null,
      scalping_status: null, scalping_note: null,
      source_url: null, verified_at: null,
      editorial_note: null,
      profit_target: null, maximum_loss_limit: null, daily_loss_limit: null,
      drawdown_type: null, max_contracts: null, minimum_trading_days: null,
      consistency_rule: null, profit_split: null, payout_cap: null,
      minimum_payout: null, days_between_payouts: null,
      reset_fee: null, activation_fee: null, regular_price: null,
      ...pl,
    })),
  })),
  promotions: [...FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION].map((p) => ({
    eligible_variants: null, eligible_markets: null, checkout_verified: null,
    affiliate_exclusive: null, stacking_rule: null, editorial_note: null,
    verified_at: null, source_url: null,
    ...p,
  })),
  bundles: FUTURESELITE_BUNDLES,
  platforms: FUTURESELITE_PLATFORMS,
  rules: FUTURESELITE_RULES,
  liveTiers: FUTURESELITE_LIVE_TIERS,
}

const firm = {
  slug: FUTURESELITE.slug,
  data_verified_at: FUTURESELITE.verified_at ?? null,
  ...FUTURESELITE.scalars,
  ...FUTURESELITE.arrays,
  ...FUTURESELITE.json,
}

// -----------------------------------------------------------------------------
// 3. Les memes etapes que `publishFirmVersion`, dans le meme ordre
// -----------------------------------------------------------------------------
const MAINTENANT = Date.parse('2026-09-07T12:00:00Z')
const hash = sourceHash(firm, programData)
const model = buildFirmPageModel(firm, programData, { now: MAINTENANT })

// `buildAffiliateUrl` n'est pas importe : il depend de l'environnement Next.
// La forme est celle que `validateCta` exige, et le validateur la controle
// juste apres — donc l'ecart eventuel se verrait plutot que de passer.
const ctaHref = '/api/go/futureselite?placement=hero&locale=en'
const summary = summaryFromPageModel(model, ctaHref)

const validation = validateFirmPageModel(model)
const ctaIssue = validateCta(ctaHref)
if (ctaIssue) {
  validation.errors.push(ctaIssue)
  validation.publishable = false
}

// -----------------------------------------------------------------------------
// 4. Determinisme de l'empreinte — la propriete qui la rend utile
// -----------------------------------------------------------------------------
const hash2 = sourceHash(firm, programData)
// Memes donnees, cles d'objet dans un autre ordre : l'empreinte doit tenir.
const melange = JSON.parse(JSON.stringify({ firm, programData }))
// Sont inverses : l'ordre des cles d'objet, et l'ordre des LIGNES (tableaux
// d'objets). Pas l'ordre des tableaux de scalaires — `pros`, `cons`, la liste
// de plateformes : leur ordre est un choix editorial, il se voit sur la page,
// et le modifier DOIT produire une nouvelle version. Une empreinte qui
// l'ignorerait laisserait passer un remaniement de contenu.
const inverse = (v) => {
  if (Array.isArray(v)) {
    const elements = v.map(inverse)
    const lignes = elements.length > 0 &&
      elements.every((e) => e !== null && typeof e === 'object' && !Array.isArray(e))
    return lignes ? elements.reverse() : elements
  }
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).reverse().map(([k, x]) => [k, inverse(x)]))
  }
  return v
}
const hash3 = sourceHash(inverse(melange.firm), inverse(melange.programData))

// Une donnee reellement differente doit, elle, changer l'empreinte.
const modifie = JSON.parse(JSON.stringify(programData))
modifie.programs[0].plans[0].regular_price = 999999
const hash4 = sourceHash(firm, modifie)

// Le bruit de tenue de registre ne doit RIEN changer.
const bruite = JSON.parse(JSON.stringify(firm))
bruite.updated_at = new Date().toISOString()
bruite.id = 'un-uuid-tout-neuf'
const hash5 = sourceHash(bruite, programData)

// -----------------------------------------------------------------------------
// 5. Le fichier candidat
// -----------------------------------------------------------------------------
const candidat = {
  _lisez_moi:
    'Contenu que publishFirmVersion ecrirait dans firm_page_versions pour futureselite. ' +
    'Produit par scripts/publication-candidate.mjs. Ne pas editer a la main : ' +
    'un candidat modifie ne correspondrait plus a ce que la transaction ecrira.',
  firm_slug: 'futureselite',
  version_number: 1,
  status: 'validated',
  source_hash: hash,
  model_schema_version: MODEL_SCHEMA_VERSION,
  verified_at: model.identity.verifiedAt,
  page_model_json: model,
  summary_model_json: summary,
  validation_report_json: {
    ...validation,
    generatedAt: new Date(MAINTENANT).toISOString(),
    acceptedWarnings: false,
  },
}
const sortie = 'database/futureselite-version-1.json'
writeFileSync(sortie, JSON.stringify(candidat, null, 2) + '\n', 'utf8')

// -----------------------------------------------------------------------------
// 6. Rapport
// -----------------------------------------------------------------------------
const t = (n) => String(n).padStart(3)
console.log('')
console.log('CANDIDAT DE PUBLICATION — futureselite, version 1')
console.log('='.repeat(78))
console.log(`  empreinte des sources      ${hash}`)
console.log(`  schema de modele           ${MODEL_SCHEMA_VERSION} ` +
  `(lu de ${MIN_SUPPORTED_SCHEMA} a ${MAX_SUPPORTED_SCHEMA})`)
console.log(`  verifiee le                ${model.identity.verifiedAt ?? 'non renseignee'}`)
console.log(`  fichier                    ${sortie}`)

console.log('')
console.log('CE QUE LA VERSION FIGE')
console.log('-'.repeat(78))
const selections = model.programs.flatMap((p) => p.plans)
const phasesTotal = selections.reduce((n, pl) => n + pl.phases.length, 0)
console.log(`  marche                    ${model.identity.markets.join(', ')}`)
console.log(`  type de firme             ${model.identity.firmType}`)
console.log(`  programmes            ${t(model.programs.length)}`)
console.log(`  selections commerciales${t(selections.length)}`)
console.log(`  lignes de phase       ${t(phasesTotal)}`)
console.log(`  plateformes selectionnables${t(model.catalogue.platforms.filter((p) => p.selectable).length)}`)
console.log(`  faits de firme        ${t(model.firmFacts.length)}` +
  `   (ecartes : ${model.firmFactsRejected.length})`)
console.log(`  regles critiques      ${t(model.rules.critical.length)}`)
console.log(`  code promo                ${model.offer?.code ?? 'aucun'} ` +
  `(portee : ${model.offer?.scopeConfidence ?? '—'})`)
console.log(`  base des prix remises     ${model.offer?.priceBasis ?? '—'} ` +
  `(${Object.values(model.offer?.priceByPlanId ?? {}).filter((p) => p.estimated).length} estimations ` +
  `sur ${Object.keys(model.offer?.priceByPlanId ?? {}).length})`)
console.log(`  lien sortant              ${ctaHref}`)

console.log('')
console.log('RESUME FIGE — ce que /compare et les cartes serviront')
console.log('-'.repeat(78))
console.log(`  marche                    ${summary.market}`)
console.log(`  prix                      ${summary.priceRange
  ? `${summary.priceRange.min}–${summary.priceRange.max} ${summary.priceRange.currency}`
  : 'aucun'}`)
console.log(`  partage                   ${summary.profitSplit
  ? `${summary.profitSplit.min}–${summary.profitSplit.max} %` : 'aucun'}`)
console.log(`  offre sur carte           ${summary.offer ? `${summary.offer.code} ${summary.offer.percent} %` : 'aucune'}`)
console.log(`  plateformes           ${t(summary.platformCount)}`)

console.log('')
console.log('RAPPORT DE VALIDATION')
console.log('-'.repeat(78))
console.log(`  erreurs bloquantes    ${t(validation.errors.length)}`)
for (const e of validation.errors) console.log(`      ERREUR  ${e.code}  ${e.field}\n              ${e.message}`)
console.log(`  avertissements        ${t(validation.warnings.length)}`)
for (const w of validation.warnings) console.log(`      avert.  ${w.code}  ${w.field}\n              ${w.message}`)
console.log(`  remarques             ${t(validation.notices.length)}`)
for (const n of validation.notices) console.log(`      note    ${n.code}  ${n.field}`)
console.log('')
console.log(`  PUBLIABLE : ${validation.publishable ? 'oui' : 'NON'}`)

// -----------------------------------------------------------------------------
// 7. Assertions
// -----------------------------------------------------------------------------
let ok = 0, ko = 0
const cas = (nom, condition, detail = '') => {
  if (condition) { ok++; console.log('  ok    ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}

console.log('')
console.log('ASSERTIONS SUR LE CANDIDAT')
console.log('-'.repeat(78))

// L'empreinte
cas('empreinte stable sur deux appels', hash === hash2)
cas('empreinte insensible a l ordre des cles et des lignes', hash === hash3)
cas('empreinte sensible a l ordre editorial des listes',
  sourceHash({ ...firm, pros: [...(firm.pros ?? [])].reverse() }, programData) !== hash)
cas('empreinte insensible a updated_at et aux uuid', hash === hash5)
cas('empreinte sensible a un prix modifie', hash !== hash4)
cas('empreinte prefixee par son algorithme', hash.startsWith('sha256:'))

// Le contenu exige par le brief
const phasesDe = (slug, phase) =>
  model.programs.find((p) => p.slug === slug).plans
    .flatMap((pl) => pl.phases.filter((ph) => ph.phase === phase))

cas('marche futures, sans melange', model.identity.markets.join(',') === 'futures')
cas('4 programmes', model.programs.length === 4, `${model.programs.length}`)
cas('15 selections commerciales', selections.length === 15, `${selections.length}`)
cas('27 lignes de phase', phasesTotal === 27, `${phasesTotal}`)
cas('6 plateformes selectionnables',
  model.catalogue.platforms.filter((p) => p.selectable).length === 6)
cas('Instant a 80 %', phasesDe('instant', 'sim_funded').every((p) => p.profitSplit === 0.8))
cas('Elite, Nitro, Prime a 90 %',
  ['elite', 'nitro', 'prime'].every((s) => phasesDe(s, 'sim_funded').every((p) => p.profitSplit === 0.9)))
cas('plafond Nitro non resolu',
  model.programs.find((p) => p.slug === 'nitro').maxFundedAccounts === null)
cas('SCANNED a 30 %, portee non confirmee',
  model.offer?.code === 'SCANNED' && model.offer?.scopeConfidence === 'unconfirmed')
cas('lien sortant tracke', ctaHref.startsWith('/api/go/'))
cas('aucune generalisation sur le drawdown',
  !model.firmFacts.some((f) => /drawdown|daily loss/i.test(f.label + ' ' + (f.detail ?? ''))))

// LES TROIS AFFIRMATIONS QUE LA PAGE PORTAIT, ET QUE LE MODELE DOIT REFUSER.
//
// Il ne suffit pas qu'elles soient absentes : elles doivent avoir ete ECARTEES,
// avec la raison. Une absence peut venir d'une donnee manquante ; un rejet
// motive prouve que la regle a joue.
const texteDesFaits = model.firmFacts
  .map((f) => `${f.label} ${f.detail ?? ''}`).join(' ')
const ecarte = (motif) =>
  model.firmFactsRejected.find((f) => new RegExp(motif, 'i').test(f.label))

cas('aucun partage unique au niveau firme',
  !/\b(80|90)\s*%/.test(texteDesFaits), texteDesFaits)
cas('« profit split » est ecarte, avec sa raison',
  !!ecarte('profit split')?.raison, JSON.stringify(ecarte('profit split') ?? null))
cas('la raison nomme les deux valeurs divergentes',
  /0\.9/.test(ecarte('profit split')?.raison ?? '') &&
  /0\.8/.test(ecarte('profit split')?.raison ?? ''))

cas('aucun fait « no daily loss limit »',
  !/no daily loss/i.test(texteDesFaits))
cas('« daily loss limit » est ecarte, avec sa raison',
  !!ecarte('daily loss')?.raison, JSON.stringify(ecarte('daily loss') ?? null))

cas('aucun fait « end-of-day drawdown »',
  !/end.of.day|end of day/i.test(texteDesFaits))
cas('« drawdown » est ecarte, avec sa raison',
  !!ecarte('drawdown')?.raison, JSON.stringify(ecarte('drawdown') ?? null))
cas('la raison du drawdown nomme les deux types',
  /End of Day/i.test(ecarte('drawdown')?.raison ?? '') &&
  /Trailing/i.test(ecarte('drawdown')?.raison ?? ''))

// CE QUE LA PAGE AFFICHERA POUR L'ELITE 25K.
//
// Les ingredients sont controles ici ; le gabarit qui les assemble est relu
// dans le composant, pour qu'un changement de formulation d'un cote sans
// l'autre se voie.
{
  const id = 'futures|elite||25000'
  const prix = model.offer?.priceByPlanId[id]
  cas('Elite 25K : tarif 95, estimation 66.50, marquee estimee',
    prix?.list === 95 && prix?.final === 66.5 && prix?.estimated === true,
    JSON.stringify(prix ?? null))
  cas('la remise appliquee est bien 30 %',
    model.offer?.percentByPlanId[id] === 30)

  const { readFileSync } = await import('node:fs')
  const composant = readFileSync('components/prop-firm/FirmPage.tsx', 'utf8')
  cas('le composant rend « estimate, verify at checkout » sur une estimation',
    /prix\.estimated \? \(/.test(composant) &&
    composant.includes('— estimate, verify at checkout'))
  cas('le prix barre est reserve au cas NON estime',
    composant.indexOf('prix.estimated ? (') < composant.indexOf('<s className='))
}

// POINT 4 — UNE PROMOTION `unconfirmed` NE DEVIENT PAS UNIVERSELLE
const lignesPrix = Object.values(model.offer?.priceByPlanId ?? {})
cas('les 15 prix remises sont marques comme estimations',
  lignesPrix.length === 15 && lignesPrix.every((p) => p.estimated === true),
  `${lignesPrix.filter((p) => p.estimated).length}/${lignesPrix.length}`)
cas('priceBasis dit « estimated »', model.offer?.priceBasis === 'estimated')
cas('la mention previent le visiteur',
  /estimate/i.test(model.offer?.disclosure ?? ''))
cas('la mention ne promet pas d applicabilite generale',
  !/applies to all|all programs|best deal|best price|lowest price/i.test(
    `${model.offer?.label ?? ''} ${model.offer?.disclosure ?? ''}`))
cas('aucun texte editorial ne revendique « all programs »',
  ![...model.narrative.about, ...model.narrative.strengths, ...model.narrative.limits]
    .some((t) => /applies to all|all programs|best deal|lowest price/i.test(t)))
cas('un prix ferme sous portee non confirmee serait bloquant', (() => {
  const falsifie = JSON.parse(JSON.stringify(model))
  const premier = Object.keys(falsifie.offer.priceByPlanId)[0]
  falsifie.offer.priceByPlanId[premier].estimated = false
  falsifie.offer.priceBasis = 'mixed'
  const v = validateFirmPageModel(falsifie)
  return v.errors.some((e) => e.code === 'PROMO_PRICE_NOT_GUARANTEED') && !v.publishable
})())
cas('une mention muette sur l estimation serait bloquante', (() => {
  const falsifie = JSON.parse(JSON.stringify(model))
  falsifie.offer.disclosure = `Enter ${falsifie.offer.code} at checkout.`
  const v = validateFirmPageModel(falsifie)
  return v.errors.some((e) => e.code === 'PROMO_PRICE_NOT_GUARANTEED')
})())

// POINT 2 — LA VERSION DE SCHEMA
cas('le candidat porte sa version de schema',
  candidat.model_schema_version === MODEL_SCHEMA_VERSION)
cas('la version ecrite est dans l intervalle lisible',
  isSupportedSchema(MODEL_SCHEMA_VERSION))
cas('un schema inconnu est refuse',
  !isSupportedSchema(MAX_SUPPORTED_SCHEMA + 1) &&
  !isSupportedSchema(MIN_SUPPORTED_SCHEMA - 1) &&
  !isSupportedSchema(null) && !isSupportedSchema('1') && !isSupportedSchema(1.5))

// Le resume ne peut pas contredire la fiche
cas('resume et fiche donnent le meme marche', summary.market === model.identity.markets[0])
cas('resume et fiche donnent la meme fourchette de prix',
  !summary.priceRange ||
  model.priceRanges.some((r) =>
    r.currency === summary.priceRange.currency &&
    r.min === summary.priceRange.min && r.max === summary.priceRange.max))
cas('resume n annonce pas une offre de portee non confirmee',
  model.offer?.scopeConfidence === 'unconfirmed' ? summary.offer === null : true)
cas('resume marque la firme canonique', summary.canonical === true)
// POINT 6 — le choix conserve : la reserve vit sur la fiche, pas sur la carte.
cas('la fiche porte le code, la carte ne le porte pas',
  model.offer?.code === 'SCANNED' && summary.offer === null)

// La version elle-meme
cas('les trois JSON sont presents',
  !!candidat.page_model_json && !!candidat.summary_model_json && !!candidat.validation_report_json)
cas('le rapport de validation est fige avec la version',
  candidat.validation_report_json.errors.length === validation.errors.length)
cas('le candidat est validated, pas published', candidat.status === 'validated')

console.log('')
console.log('-'.repeat(78))
console.log(`  ${ok} assertion(s) verte(s), ${ko} en echec, ` +
  `${validation.errors.length} erreur(s) de validation.`)
console.log('')

process.exit(ko > 0 || !validation.publishable ? 1 : 0)
