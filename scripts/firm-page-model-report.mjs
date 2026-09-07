// =============================================================================
// RAPPORT DE PROVENANCE + TESTS SEMANTIQUES  scripts/firm-page-model-report.mjs
// =============================================================================
//   npm run model:report
//
// Compile `lib/firm-page-model.ts` puis l'execute sur les donnees reelles de
// FuturesElite. Le rapport n'est donc pas redige a la main : il sort du modele
// lui-meme, et devient faux le jour ou le modele change sans qu'on le regenere.
//
// Les tests semantiques portent sur l'objet REELLEMENT construit, pas sur les
// fixtures : c'est la difference entre « la base contient 80 % » et « la page
// affichera 80 % ».
//
// Aucune base, aucun navigateur, aucun lien d'affiliation ouvert.
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
// 1. Compiler le modele. `import type` est efface, donc le fichier se compile
//    seul, sans resoudre l'alias `@/`.
// -----------------------------------------------------------------------------
const dir = mkdtempSync(join(tmpdir(), 'fpm-'))
// `--noResolve` : l'alias `@/` n'est pas resoluble hors du bundler Next, et
// l'import du modele est `import type`, donc efface a l'emission. On ignore
// donc le code de sortie et on verifie le fichier produit, plutot que de
// dupliquer une configuration de chemins qui divergerait de tsconfig.json.
try {
  execSync(
    `npx tsc lib/firm-page-model.ts --outDir "${dir}" --module esnext --target es2022 ` +
    `--skipLibCheck --noResolve`,
    { stdio: 'pipe' }
  )
} catch {
  // Les erreurs de resolution sont attendues ; l'emission a lieu quand meme.
}
if (!existsSync(join(dir, 'firm-page-model.js'))) {
  console.error('La compilation n a rien produit. Le type-check du projet, lui, doit rester propre.')
  process.exit(1)
}
const { buildFirmPageModel } = await import(pathToFileURL(join(dir, 'firm-page-model.js')).href)

// -----------------------------------------------------------------------------
// 2. Reconstituer ce que la base servirait, a partir des memes fixtures que le
//    SQL. Les valeurs par defaut recopiees ici sont celles que le generateur
//    ecrit dans les INSERT ; les diverger silencieusement rendrait le rapport
//    faux, donc elles sont explicites.
// -----------------------------------------------------------------------------
const programData = {
  programs: FUTURESELITE_PROGRAMS.map((p) => ({
    slug: p.slug,
    name: p.name,
    // Lu depuis le fixture, jamais suppose : c'est precisement l'ecart qui
    // faisait annoncer « cfd prop firm » en production.
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

// Les trois blocs deviennent des colonnes de `prop_firms` : `scalars` en
// colonnes simples, `arrays` en TEXT[]/TEXT, `json` en JSONB. Les oublier
// donnait un modele sans regles critiques ni verdict — c'est exactement ce que
// le rapport a signale au premier passage.
const firm = {
  slug: FUTURESELITE.slug,
  data_verified_at: FUTURESELITE.verified_at ?? null,
  ...FUTURESELITE.scalars,
  ...FUTURESELITE.arrays,
  ...FUTURESELITE.json,
}

const model = buildFirmPageModel(firm, programData, { now: Date.parse('2026-09-07T12:00:00Z') })

// -----------------------------------------------------------------------------
// 3. Le rapport de provenance
// -----------------------------------------------------------------------------
console.log('')
console.log('RAPPORT DE PROVENANCE — FirmPageModel, pilote FuturesElite')
console.log('='.repeat(78))
console.log('champ du modele'.padEnd(38) + 'table'.padEnd(24) + 'colonne')
console.log('-'.repeat(78))
for (const [champ, p] of Object.entries(model.provenance)) {
  console.log(champ.padEnd(38) + p.table.padEnd(24) + p.column)
}

console.log('')
console.log('CONTENU CONSTRUIT')
console.log('-'.repeat(78))
console.log(`  programmes vendables       ${model.programs.length}`)
console.log(`  plans                      ${model.programs.reduce((n, p) => n + p.plans.length, 0)}`)
console.log(`  plan par defaut            ${model.defaultPlanId}`)
console.log(`  faits de firme             ${model.firmFacts.length}`)
for (const f of model.firmFacts) console.log(`      - ${f.label} (${f.detail})`)
console.log(`  plateformes                ${model.catalogue.platforms.length} dont ` +
  `${model.catalogue.platforms.filter((p) => p.selectable).length} selectionnables`)
console.log(`  regles critiques           ${model.rules.critical.length}`)
console.log(`  regles detaillees          ${model.rules.complete.length}`)
console.log(`  paliers de bundle          ${model.bundles.length}`)
console.log(`  paliers live               ${model.liveTiers.length}`)
console.log(`  code promo                 ${model.offer?.code ?? 'aucun'}`)
console.log(`  plans avec avertissement   ${Object.keys(model.offer?.betterPublicOfferByPlanId ?? {}).length}`)

// -----------------------------------------------------------------------------
// 4. Tests semantiques, sur le modele construit
// -----------------------------------------------------------------------------
let ok = 0
let ko = 0
const cas = (nom, condition, detail = '') => {
  if (condition) { ok++; console.log('  ok   ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}

const prog = (slug) => model.programs.find((p) => p.slug === slug)
const phases = (slug, phase) =>
  prog(slug).plans.flatMap((pl) => pl.phases.filter((ph) => ph.phase === phase))

console.log('')
console.log('TESTS SEMANTIQUES SUR LE MODELE')
console.log('-'.repeat(78))

cas('Instant est toujours a 80 %',
  phases('instant', 'sim_funded').every((p) => p.profitSplit === 0.8))
cas('Instant est en fin de journee',
  phases('instant', 'sim_funded').every((p) => p.drawdownType === 'End of Day'))
cas('Instant demarre a 20 % de regularite',
  phases('instant', 'sim_funded').every((p) => p.consistencyRule === 0.2))
cas('Nitro finance est en Trailing Equity',
  phases('nitro', 'sim_funded').every((p) => p.drawdownType === 'Trailing Equity'))
cas('Prime porte une limite journaliere dans les deux phases',
  phases('prime', 'evaluation').every((p) => p.dailyLoss != null) &&
  phases('prime', 'sim_funded').every((p) => p.dailyLoss != null))
cas('Prime garde 40 % de regularite une fois finance',
  phases('prime', 'sim_funded').every((p) => p.consistencyRule === 0.4))
cas('Elite et Nitro paient 90 %',
  ['elite', 'nitro'].every((s) => phases(s, 'sim_funded').every((p) => p.profitSplit === 0.9)))

const selectionnables = model.catalogue.platforms.filter((p) => p.selectable)
cas('six plateformes selectionnables', selectionnables.length === 6, String(selectionnables.length))
cas('les plateformes marketing ne sont pas selectionnables',
  model.catalogue.platforms.filter((p) => !p.selectable).length === 2)

cas('SCANNED vaut 30 %',
  model.offer?.code === 'SCANNED' &&
  Object.values(model.offer.percentByPlanId).every((v) => v === 30))
cas('l offre ne promet aucun preremplissage',
  !/pre-?fill|automatic/i.test(model.offer?.disclosure ?? ''))
cas('trois plans seulement portent l avertissement de prix',
  Object.keys(model.offer?.betterPublicOfferByPlanId ?? {}).length === 3,
  Object.keys(model.offer?.betterPublicOfferByPlanId ?? {}).join(', '))

// LE test structurel : aucun fait de firme ne peut venir d'un seul programme.
console.log('')
for (const fait of model.firmFacts) {
  const suspects = []
  // Un fait de firme doit rester vrai si l'on retire n'importe quel programme.
  for (const p of model.programs) {
    const sansLui = model.programs.filter((x) => x.slug !== p.slug)
    if (sansLui.length === 0) continue
    // Le split ne peut etre un fait de firme que si tous les programmes le partagent.
    if (/profit split/i.test(fait.label)) {
      const splits = new Set(
        model.programs.flatMap((x) =>
          x.plans.flatMap((pl) => pl.phases.filter((ph) => ph.phase === 'sim_funded').map((ph) => ph.profitSplit))
        )
      )
      if (splits.size > 1) suspects.push('split non partage : ' + Array.from(splits).join('/'))
    }
    if (/daily loss/i.test(fait.label)) {
      const valeurs = new Set(
        model.programs.flatMap((x) => x.plans.flatMap((pl) => pl.phases.map((ph) => ph.dailyLoss === null)))
      )
      if (valeurs.size > 1) suspects.push('limite journaliere non partagee')
    }
    if (/drawdown/i.test(fait.label)) {
      const valeurs = new Set(
        model.programs.flatMap((x) => x.plans.flatMap((pl) => pl.phases.map((ph) => ph.drawdownType)))
      )
      if (valeurs.size > 1) suspects.push('drawdown non partage : ' + Array.from(valeurs).join('/'))
    }
  }
  cas(`fait de firme legitime : « ${fait.label} »`, suspects.length === 0,
    Array.from(new Set(suspects)).join(' | '))
}

// Les quatre tables autrefois jetees atteignent maintenant le modele.
console.log('')
cas('firm_rules atteint le modele', model.rules.complete.length > 0, String(model.rules.complete.length))
cas('firm_platforms atteint le modele', model.catalogue.platforms.some((p) => !p.selectable))
cas('firm_program_bundles atteint le modele', model.bundles.length > 0, String(model.bundles.length))
cas('firm_live_tiers atteint le modele', model.liveTiers.length > 0, String(model.liveTiers.length))

// -----------------------------------------------------------------------------
// 5. Hierarchie : 4 programmes -> 15 plans -> 27 phases
// -----------------------------------------------------------------------------
console.log('')
console.log('HIERARCHIE')
console.log('-'.repeat(78))
{
  const nbPlans = model.programs.reduce((n, p) => n + p.plans.length, 0)
  const nbPhases = model.programs.reduce(
    (n, p) => n + p.plans.reduce((m, pl) => m + pl.phases.length, 0), 0)
  cas('4 programmes', model.programs.length === 4, String(model.programs.length))
  cas('15 variantes commerciales', nbPlans === 15, String(nbPlans))
  cas('27 phases imbriquees', nbPhases === 27, String(nbPhases))
  // Le piege : aplatir les phases donnerait 27 cartes au lieu de 15.
  cas('les phases restent imbriquees, jamais promues en plans',
    model.programs.every((p) => p.plans.every((pl) => Array.isArray(pl.phases) && pl.phases.length >= 1)) &&
    nbPhases > nbPlans)
  cas('chaque plan porte au plus une phase par type',
    model.programs.every((p) => p.plans.every((pl) => {
      const types = pl.phases.map((ph) => ph.phase)
      return new Set(types).size === types.length
    })))
}

// -----------------------------------------------------------------------------
// 6. Faits universels : une absence n'est jamais une confirmation
// -----------------------------------------------------------------------------
console.log('')
console.log('FAITS UNIVERSELS — VALEURS NULLES ET PROGRAMMES INCOMPLETS')
console.log('-'.repeat(78))
{
  const clone = () => JSON.parse(JSON.stringify(programData))
  const faits = (d) => buildFirmPageModel(firm, d, { now: Date.parse('2026-09-07T12:00:00Z') })
    .firmFacts.map((f) => f.label)

  // a) Un seul frais d'activation inconnu suffit a retirer le fait.
  const a = clone()
  a.programs[0].plans[0].activation_fee = null
  cas('un activation_fee nul retire « No activation fee »',
    !faits(a).includes('No activation fee'), faits(a).join(', '))

  // b) Une valeur differente aussi.
  const b = clone()
  b.programs[1].plans[0].activation_fee = 25
  cas('un activation_fee non nul retire le fait', !faits(b).includes('No activation fee'))

  // c) Une ligne a confirmer ne peut pas fonder une affirmation de firme.
  const c = clone()
  c.programs[2].plans[0].confidence = 'needs_confirmation'
  cas('une ligne needs_confirmation retire le fait',
    !faits(c).includes('No activation fee'), faits(c).join(', '))

  // d) Un programme dont aucune ligne ne repond ne vaut pas accord tacite.
  //
  // On vise Prime, qui garde ses lignes d'evaluation et reste donc ACHETABLE :
  // vider entierement un programme le sortirait du calcul, ce qui est le
  // comportement voulu mais ne teste pas la meme chose. Un programme vendable
  // mais muet sur une phase ne doit pas etre compte comme d'accord.
  const d = clone()
  const iPrime = d.programs.findIndex((p) => p.slug === 'prime')
  d.programs[iPrime].plans = d.programs[iPrime].plans.filter((p) => p.phase !== 'sim_funded')
  const modeleD = buildFirmPageModel(firm, d, { now: Date.parse('2026-09-07T12:00:00Z') })
  cas('un programme sans phase financee ne confirme aucun split',
    !modeleD.firmFacts.some((f) => /profit split/i.test(f.label)))

  // e) Un marche divergent retire « Futures only » meme si la firme le dit.
  const e = clone()
  e.programs[0].market = 'cfd'
  cas('un marche divergent retire « Futures only »',
    !faits(e).some((l) => /only/i.test(l)), faits(e).join(', '))

  // f) Sans confirmation de la fiche, le marche seul ne suffit pas.
  const modeleF = buildFirmPageModel({ ...firm, is_futures: null }, clone(),
    { now: Date.parse('2026-09-07T12:00:00Z') })
  cas('sans is_futures, le marche n est pas promu en fait de firme',
    !modeleF.firmFacts.some((l) => /only/i.test(l.label)))

  // g) Chaque rejet porte sa raison.
  cas('chaque fait ecarte est motive',
    model.firmFactsRejected.every((r) => typeof r.raison === 'string' && r.raison.length > 0),
    model.firmFactsRejected.map((r) => `${r.label}: ${r.raison}`).join(' | '))
}

// -----------------------------------------------------------------------------
// 7. Les regles critiques viennent de firm_rules, pas de prop_firms
// -----------------------------------------------------------------------------
console.log('')
console.log('SOURCE DES REGLES CRITIQUES')
console.log('-'.repeat(78))
{
  cas('la provenance designe firm_rules',
    model.provenance['rules.critical'].table === 'firm_rules',
    model.provenance['rules.critical'].table)
  cas('trois categories au plus, trois regles chacune',
    new Set(model.rules.critical.map((r) => r.category)).size === 3 &&
    model.rules.critical.length <= 9, String(model.rules.critical.length))
  const titresCritiques = new Set(model.rules.critical.map((r) => r.title))
  const titresComplets = new Set(model.rules.complete.map((r) => r.title))
  cas('chaque regle critique existe dans firm_rules',
    Array.from(titresCritiques).every((t) => titresComplets.has(t)))
  // Repli : une firme sans lignes normalisees garde son ancien bloc.
  const sansRegles = buildFirmPageModel(firm, { ...programData, rules: [] },
    { now: Date.parse('2026-09-07T12:00:00Z') })
  cas('repli sur prop_firms.key_rules quand firm_rules est vide',
    sansRegles.provenance['rules.critical'].table === 'prop_firms' &&
    sansRegles.rules.critical.length > 0)
}

rmSync(dir, { recursive: true, force: true })
console.log('')
console.log('-'.repeat(78))
console.log(`${ok} reussis, ${ko} echoues`)
process.exit(ko === 0 ? 0 : 1)
