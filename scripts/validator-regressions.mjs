// =============================================================================
// REGRESSIONS HISTORIQUES  scripts/validator-regressions.mjs
// =============================================================================
//   npm run validator:regressions
//
// Les six phrases qui ont atteint la production cette semaine, rejouees contre
// `validateFirmPageModel`. Chacune DOIT produire une erreur bloquante.
//
// Chaque cas se teste dans les deux sens :
//   - la phrase FAUTIVE injectee dans le modele correct -> erreur attendue ;
//   - le texte ACTUEL, corrige                          -> aucune erreur.
//
// Le second sens compte autant que le premier : un validateur qui bloque tout
// serait aussi inutile qu'un validateur qui ne bloque rien.
//
// Un troisieme groupe verifie les FAUX POSITIFS : un numero de rue, un code
// postal, une annee de fondation ne sont pas des regles de produit et ne
// doivent jamais bloquer une publication.
// =============================================================================

import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import {
  FUTURESELITE_PROGRAMS, FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION,
  FUTURESELITE_PLATFORMS, FUTURESELITE_RULES, FUTURESELITE_BUNDLES, FUTURESELITE_LIVE_TIERS,
} from './futureselite-programs.mjs'
import { FUTURESELITE } from './firm-content.mjs'

// -----------------------------------------------------------------------------
// Compilation
// -----------------------------------------------------------------------------
const dir = mkdtempSync(join(tmpdir(), 'val-'))
try {
  execSync(
    `npx tsc lib/firm-page-model.ts lib/validate-firm-page-model.ts --outDir "${dir}" ` +
    `--module esnext --target es2022 --skipLibCheck --noResolve`,
    { stdio: 'pipe' }
  )
} catch {
  // Alias `@/` non resoluble hors bundler ; les imports sont `import type`,
  // donc effaces a l'emission. On verifie le fichier produit.
}
for (const f of ['firm-page-model.js', 'validate-firm-page-model.js']) {
  if (!existsSync(join(dir, f))) {
    console.error('Compilation incomplete : ' + f)
    process.exit(1)
  }
}
const { buildFirmPageModel } = await import(pathToFileURL(join(dir, 'firm-page-model.js')).href)
const { validateFirmPageModel, extractClaims } =
  await import(pathToFileURL(join(dir, 'validate-firm-page-model.js')).href)

// -----------------------------------------------------------------------------
// Le modele reel
// -----------------------------------------------------------------------------
const programData = {
  programs: FUTURESELITE_PROGRAMS.map((p) => ({
    slug: p.slug, name: p.name, market: p.market, program_family: null,
    status: p.status, kind: p.kind, evaluation_steps: p.evaluation_steps ?? null,
    summary: p.summary ?? null, sort_order: p.sort_order ?? 0,
    max_funded_accounts: p.max_funded_accounts ?? null,
    max_funded_note: p.max_funded_note ?? null,
    source_url: p.source_url ?? null, verified_at: null,
    plans: p.plans.map((pl) => ({
      variant_key: null, currency: 'USD', confidence: null,
      buffer: null, buffer_status: null, contract_scaling: null,
      news_trading_status: null, news_trading_note: null,
      scalping_status: null, scalping_note: null,
      source_url: null, verified_at: null, editorial_note: null,
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
    verified_at: null, source_url: null, ...p,
  })),
  bundles: FUTURESELITE_BUNDLES,
  platforms: FUTURESELITE_PLATFORMS,
  rules: FUTURESELITE_RULES,
  liveTiers: FUTURESELITE_LIVE_TIERS,
}

const firmBase = {
  slug: FUTURESELITE.slug,
  data_verified_at: FUTURESELITE.verified_at ?? null,
  ...FUTURESELITE.scalars, ...FUTURESELITE.arrays, ...FUTURESELITE.json,
}

const MAINTENANT = { now: Date.parse('2026-09-07T12:00:00Z') }
const modeleDe = (patch = {}) =>
  buildFirmPageModel({ ...firmBase, ...patch }, programData, MAINTENANT)

// -----------------------------------------------------------------------------
// Harnais
// -----------------------------------------------------------------------------
let ok = 0
let ko = 0
const cas = (nom, condition, detail = '') => {
  if (condition) { ok++; console.log('  ok    ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}

/** Injecte une phrase fautive et exige un blocage. */
function bloque(nom, patch, codesAttendus) {
  const r = validateFirmPageModel(modeleDe(patch))
  const codes = r.errors.map((e) => e.code)
  const trouve = codesAttendus.some((c) => codes.includes(c))
  cas(nom, trouve && !r.publishable,
    trouve ? '' : `codes obtenus : ${codes.join(', ') || 'aucun'}`)
}

// -----------------------------------------------------------------------------
// LES SIX REGRESSIONS
// -----------------------------------------------------------------------------
console.log('')
console.log('LES SIX REGRESSIONS HISTORIQUES — chacune doit bloquer')
console.log('-'.repeat(76))

// 1. « All four settle at a 90% profit split » — Instant paie 80 %.
bloque('1. 90 % generalise alors qu Instant paie 80 %',
  { description: 'FuturesElite sells simulated futures accounts across four programs. All four settle at a 90% profit split, and payouts can be requested daily.' },
  ['FACT_NOT_UNIVERSAL_IN_TEXT', 'EDITORIAL_CONTRADICTS_DATA'])

// 2. « No daily loss limit » en atout de firme — Prime en a une.
bloque('2. absence de limite journaliere generalisee alors que Prime en a une',
  { pros: ['End-of-day drawdown, with no daily loss limit at all', 'No activation fee'] },
  ['FACT_NOT_UNIVERSAL_IN_TEXT', 'EDITORIAL_CONTRADICTS_DATA'])

// 3. « seven platforms » — six sont selectionnables.
bloque('3. sept plateformes alors que six sont selectionnables',
  { description: 'A futures prop firm. Seven platforms are available to choose from at purchase.' },
  ['EDITORIAL_CONTRADICTS_DATA'])

// 4. « maximum 3 Nitro » — la valeur est disputee, donc null.
bloque('4. plafond Nitro chiffre alors que la valeur est disputee',
  { cons: ['Maximum 3 Nitro funded accounts', 'No financial regulator licence'] },
  ['EDITORIAL_CONTRADICTS_DATA', 'FACT_NOT_UNIVERSAL_IN_TEXT'])

// 5. Les jours d Elite generalises a la firme.
bloque('5. jours minimum d Elite generalises a la firme',
  { cons: ['3 minimum trading days in evaluation, 6 once funded'] },
  ['FACT_NOT_UNIVERSAL_IN_TEXT', 'EDITORIAL_CONTRADICTS_DATA'])

// 6. Drawdown de fin de journee attribue a Nitro, qui passe en trailing.
bloque('6. drawdown de fin de journee groupant des programmes qui different',
  { pros: ['End-of-day drawdown on all four programs'] },
  ['FACT_NOT_UNIVERSAL_IN_TEXT', 'EDITORIAL_CONTRADICTS_DATA'])

// -----------------------------------------------------------------------------
// LE TEXTE ACTUEL NE DOIT PAS BLOQUER
// -----------------------------------------------------------------------------
console.log('')
console.log('LE TEXTE CORRIGE — aucune erreur attendue')
console.log('-'.repeat(76))
{
  const r = validateFirmPageModel(modeleDe())
  cas('le contenu FuturesElite actuel est publiable', r.publishable,
    r.errors.map((e) => `${e.code} @ ${e.field} : ${e.message}`).join(' | '))
  console.log(`        ${r.errors.length} erreur(s), ${r.warnings.length} avertissement(s), ${r.notices.length} note(s)`)
}

// -----------------------------------------------------------------------------
// FAUX POSITIFS — un nombre n est pas forcement une regle de produit
// -----------------------------------------------------------------------------
console.log('')
console.log('FAUX POSITIFS — ces nombres ne doivent rien bloquer')
console.log('-'.repeat(76))
{
  const innocents = [
    ['adresse', 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italy, no. 03095010595.'],
    ['annee de fondation', 'The firm was founded in 2021 and has grown since.'],
    ['annee dans un recit', 'Between 2019 and 2024 the futures prop sector expanded considerably.'],
    ['numero de version', 'The platform runs on Tradovate and NinjaTrader 8.'],
    ['classement', 'It ranks among the top 10 futures firms we track.'],
  ]
  for (const [nom, texte] of innocents) {
    const claims = extractClaims(texte)
    const chiffres = claims.filter((c) => typeof c.value === 'number')
    cas(`aucun chiffre capte : ${nom}`, chiffres.length === 0,
      chiffres.map((c) => `${c.kind}=${c.value} (${c.raw})`).join(', '))
  }

  // Et le tout injecte dans le modele ne doit pas bloquer la publication.
  const r = validateFirmPageModel(modeleDe({
    description: innocents.map(([, t]) => t).join('\n\n'),
  }))
  const bloquants = r.errors.filter((e) =>
    e.field.startsWith('narrative.about') &&
    (e.code === 'EDITORIAL_CONTRADICTS_DATA' || e.code === 'FACT_NOT_UNIVERSAL_IN_TEXT'))
  cas('un texte sans regle de produit ne bloque pas', bloquants.length === 0,
    bloquants.map((e) => e.message).join(' | '))
}

// -----------------------------------------------------------------------------
// LES CHIFFRES LEGITIMES DOIVENT PASSER
// -----------------------------------------------------------------------------
console.log('')
console.log('CHIFFRES LEGITIMES — nommes et exacts, ils passent')
console.log('-'.repeat(76))
{
  const r = validateFirmPageModel(modeleDe({
    pros: [
      // Nomme le programme ET donne la bonne valeur.
      'Instant pays a 80% profit split with no evaluation to pass',
      'Elite requires 3 trading days to complete its evaluation',
    ],
  }))
  const bloquants = r.errors.filter((e) => e.field.startsWith('narrative.strengths'))
  cas('une valeur exacte et attribuee a son programme passe', bloquants.length === 0,
    bloquants.map((e) => `${e.code} : ${e.message}`).join(' | '))
}

rmSync(dir, { recursive: true, force: true })
console.log('')
console.log('-'.repeat(76))
console.log(`${ok} reussis, ${ko} echoues`)
process.exit(ko === 0 ? 0 : 1)
