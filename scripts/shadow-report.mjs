// =============================================================================
// MODE OMBRE  scripts/shadow-report.mjs
// =============================================================================
//   npm run shadow:report
//
// Construit le modele de FuturesElite, FTMO et The5ers a partir des fixtures,
// le passe au validateur, et signale les capacites generiques manquantes.
//
// RIEN N'EST RENDU. Aucune de ces fiches ne change de comportement : le but
// est de savoir ce qui casserait AVANT de basculer, pas apres.
//
// Ce que le rapport cherche, dans l'ordre d'importance :
//   - une devise autre que l'USD                    (FTMO facture en EUR)
//   - des variantes commerciales sur une meme taille (Swing, Summer 8/5 et 10/5)
//   - un marche autre que futures                   (FTMO et The5ers sont CFD)
//   - des structures d'evaluation differentes       (1-Step, 2-Step, instant)
//   - l'agregation plateformes et regles
//   - le calcul des promotions
// =============================================================================

import { execSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { PACKS_V2 } from './program-packs-v2.mjs'
import {
  FUTURESELITE_PROGRAMS, FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION,
  FUTURESELITE_PLATFORMS, FUTURESELITE_RULES, FUTURESELITE_BUNDLES, FUTURESELITE_LIVE_TIERS,
} from './futureselite-programs.mjs'
import * as CONTENU from './firm-content.mjs'

// -----------------------------------------------------------------------------
const dir = mkdtempSync(join(tmpdir(), 'shadow-'))
try {
  execSync(
    `npx tsc lib/firm-page-model.ts lib/validate-firm-page-model.ts --outDir "${dir}" ` +
    `--module esnext --target es2022 --skipLibCheck --noResolve`,
    { stdio: 'pipe' }
  )
} catch { /* alias @/ non resoluble, imports de type effaces */ }
for (const f of ['firm-page-model.js', 'validate-firm-page-model.js']) {
  if (!existsSync(join(dir, f))) { console.error('Compilation incomplete : ' + f); process.exit(1) }
}
const { buildFirmPageModel } = await import(pathToFileURL(join(dir, 'firm-page-model.js')).href)
const { validateFirmPageModel } = await import(pathToFileURL(join(dir, 'validate-firm-page-model.js')).href)

const MAINTENANT = { now: Date.parse('2026-09-08T12:00:00Z') }
const DEFAUT_PLAN = {
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
}
const DEFAUT_PROMO = {
  eligible_variants: null, eligible_markets: null, checkout_verified: null,
  affiliate_exclusive: null, stacking_rule: null, editorial_note: null,
  verified_at: null, source_url: null, is_public: true, status: 'active',
  program_slug: null, account_size: null, starts_at: null, expires_at: null,
  discount_type: 'percent', label: null, code: null,
}

// -----------------------------------------------------------------------------
// Les trois firmes
// -----------------------------------------------------------------------------
function depuisPack(pack) {
  return {
    programs: pack.programs.map((p) => ({
      slug: p.slug, name: p.name, market: p.market ?? 'cfd',
      program_family: p.program_family ?? null, status: p.status ?? 'active',
      kind: p.kind ?? 'evaluation', evaluation_steps: p.evaluation_steps ?? null,
      summary: p.summary ?? null, sort_order: p.sort_order ?? 0,
      max_funded_accounts: p.max_funded_accounts ?? null,
      max_funded_note: p.max_funded_note ?? null,
      source_url: p.source_url ?? null, verified_at: null,
      plans: (p.plans ?? []).map((pl) => ({ ...DEFAUT_PLAN, ...pl })),
    })),
    promotions: (pack.promotions ?? []).map((p) => ({ ...DEFAUT_PROMO, ...p })),
    bundles: pack.bundles ?? [],
    platforms: pack.platforms ?? [],
    // Les packs v2 portent les regles en tuples [slug, scope, title, ...].
    rules: (pack.rules ?? []).map((r) =>
      Array.isArray(r)
        ? { program_slug: r[0], scope: r[1], title: r[2], detail: r[3],
            severity: r[4], confidence: r[5], source_url: r[6] ?? null }
        : r
    ),
    liveTiers: pack.liveTiers ?? [],
  }
}

const FIRMES = [
  {
    slug: 'futureselite',
    contenu: CONTENU.FUTURESELITE,
    data: {
      programs: FUTURESELITE_PROGRAMS.map((p) => ({
        slug: p.slug, name: p.name, market: p.market, program_family: null,
        status: p.status, kind: p.kind, evaluation_steps: p.evaluation_steps ?? null,
        summary: p.summary ?? null, sort_order: p.sort_order ?? 0,
        max_funded_accounts: p.max_funded_accounts ?? null,
        max_funded_note: p.max_funded_note ?? null,
        source_url: p.source_url ?? null, verified_at: null,
        plans: p.plans.map((pl) => ({ ...DEFAUT_PLAN, ...pl })),
      })),
      promotions: [...FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION]
        .map((p) => ({ ...DEFAUT_PROMO, ...p })),
      bundles: FUTURESELITE_BUNDLES, platforms: FUTURESELITE_PLATFORMS,
      rules: FUTURESELITE_RULES, liveTiers: FUTURESELITE_LIVE_TIERS,
    },
  },
  ...PACKS_V2.map((pack) => ({
    slug: pack.firm_slug,
    contenu: CONTENU[pack.firm_slug.toUpperCase().replace(/[^A-Z0-9]/g, '')] ?? null,
    data: depuisPack(pack),
  })),
]

// -----------------------------------------------------------------------------
// Rapport
// -----------------------------------------------------------------------------
const L = []
const dire = (s = '') => { L.push(s); console.log(s) }

dire('# Rapport mode ombre — aucune fiche modifiee')
dire('')
dire(`Genere le ${new Date(MAINTENANT.now).toISOString().slice(0, 10)} par \`npm run shadow:report\`.`)
dire('')

const capacites = new Map()
const marque = (cap, firme, detail) => {
  if (!capacites.has(cap)) capacites.set(cap, [])
  capacites.get(cap).push(`${firme} : ${detail}`)
}

for (const f of FIRMES) {
  const c = f.contenu
  const firm = c
    ? { slug: f.slug, data_verified_at: c.verified_at ?? null,
        ...c.scalars, ...(c.arrays ?? {}), ...(c.json ?? {}) }
    : { slug: f.slug, name: f.slug }

  let model
  try {
    model = buildFirmPageModel(firm, f.data, MAINTENANT)
  } catch (e) {
    dire(`## ${f.slug}`)
    dire('')
    dire(`**Le modele ne se construit pas** : ${e.message}`)
    dire('')
    continue
  }
  const v = validateFirmPageModel(model)

  dire(`## ${f.slug}`)
  dire('')
  const nbPlans = model.programs.reduce((n, p) => n + p.plans.length, 0)
  const nbPhases = model.programs.reduce((n, p) => n + p.plans.reduce((m, pl) => m + pl.phases.length, 0), 0)
  dire(`| | |`)
  dire(`|---|---|`)
  dire(`| Programmes | ${model.programs.length} |`)
  dire(`| Plans | ${nbPlans} |`)
  dire(`| Phases | ${nbPhases} |`)
  dire(`| Marche | ${model.identity.firmType ?? '—'} |`)
  dire(`| Faits de firme | ${model.firmFacts.length} |`)
  dire(`| Plateformes | ${model.catalogue.platforms.length} |`)
  dire(`| Regles detaillees | ${model.rules.complete.length} |`)
  dire(`| Code promo | ${model.offer?.code ?? '—'} |`)
  dire(`| **Erreurs bloquantes** | **${v.errors.length}** |`)
  dire(`| Avertissements | ${v.warnings.length} |`)
  dire('')

  if (v.errors.length > 0) {
    dire('Erreurs :')
    dire('')
    for (const e of v.errors.slice(0, 12)) dire(`- \`${e.code}\` **${e.field}** — ${e.message}`)
    if (v.errors.length > 12) dire(`- … et ${v.errors.length - 12} autres`)
    dire('')
  }

  // --- Capacites generiques ------------------------------------------------
  const devises = new Set(model.programs.flatMap((p) => p.plans.map((pl) => pl.currency)))
  if (devises.size > 1 || !devises.has('USD')) {
    marque('Devise non USD', f.slug, Array.from(devises).join(', '))
  }
  const variantes = model.programs.flatMap((p) => p.plans.filter((pl) => pl.variantKey))
  if (variantes.length > 0) {
    marque('Variantes commerciales', f.slug,
      `${variantes.length} plans portent une variante (${Array.from(new Set(variantes.map((v) => v.variantKey))).join(', ')})`)
  }
  // Deux plans de meme taille dans un meme programme : le cas The5ers.
  for (const p of model.programs) {
    const parTaille = new Map()
    for (const pl of p.plans) parTaille.set(pl.accountSize, (parTaille.get(pl.accountSize) ?? 0) + 1)
    const multiples = Array.from(parTaille.entries()).filter(([, n]) => n > 1)
    if (multiples.length > 0) {
      marque('Plusieurs variantes pour une meme taille', f.slug,
        `${p.slug} : ${multiples.map(([t, n]) => `${t} x${n}`).join(', ')}`)
    }
  }
  const marches = new Set(model.programs.map((p) => p.market))
  if (marches.size > 1) marque('Marches multiples dans une firme', f.slug, Array.from(marches).join(', '))
  else if (!marches.has('futures') && marches.size === 1) {
    marque('Marche non futures', f.slug, Array.from(marches)[0])
  }
  const structures = new Set(model.programs.map((p) => `${p.kind}/${p.evaluationSteps ?? '?'}`))
  if (structures.size > 1) marque('Structures d evaluation multiples', f.slug, Array.from(structures).join(', '))
  const phases = new Set(model.programs.flatMap((p) => p.plans.flatMap((pl) => pl.phases.map((ph) => ph.phase))))
  if (phases.has('evaluation_2')) marque('Seconde phase d evaluation', f.slug, 'evaluation_2 presente')
  if (model.catalogue.platforms.length === 0) marque('Plateformes absentes', f.slug, 'aucune ligne')
  if (!model.offer) marque('Aucune promotion resolue', f.slug, 'offer = null')
}

dire('## Capacites generiques a couvrir')
dire('')
if (capacites.size === 0) dire('Aucune : les trois firmes tiennent dans le modele actuel.')
else {
  for (const [cap, cas] of Array.from(capacites.entries())) {
    dire(`**${cap}**`)
    dire('')
    for (const c of cas) dire(`- ${c}`)
    dire('')
  }
}

dire('---')
dire('')
dire('Aucune fiche n\'a ete modifiee. FTMO et The5ers restent servies par')
dire('l\'ancien rendu : `page_model_status` vaut `legacy` pour elles.')

writeFileSync('RAPPORT-mode-ombre.md', L.join('\n') + '\n', 'utf8')
rmSync(dir, { recursive: true, force: true })
console.log('')
console.log('RAPPORT-mode-ombre.md ecrit')
