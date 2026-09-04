// =============================================================================
// GENERATEUR v2  scripts/build-program-packs-v2.mjs
// =============================================================================
//   node scripts/build-program-packs-v2.mjs
//
// Ecrit database/RUN-<slug>-programs-v2.sql pour chaque pack de
// scripts/program-packs-v2.mjs.
//
// Prerequis : RUN-program-schema.sql PUIS RUN-program-schema-v2.sql.
// =============================================================================

import { writeFile } from 'node:fs/promises'
import { PACKS_V2 } from './program-packs-v2.mjs'

const S = (v) => (v === null || v === undefined || v === '' ? 'null' : "'" + String(v).replace(/'/g, "''") + "'")
const N = (v) => (v === null || v === undefined ? 'null' : String(v))
const B = (v) => (v === null || v === undefined ? 'null' : String(Boolean(v)))
const D = (v) => (v === null || v === undefined ? 'null' : `timestamptz '${v}'`)
const A = (v) => (!v || !v.length ? 'null' : "'{" + v.map((x) => JSON.stringify(String(x))).join(',').replace(/'/g, "''") + "}'::text[]")

const PLAN_COLS = [
  'program_id', 'phase', 'account_size', 'variant_key', 'variant_label', 'account_type',
  'target_variant', 'currency', 'platform', 'regular_price', 'post_pass_fee',
  'profit_target', 'maximum_loss_limit', 'daily_loss_limit', 'drawdown_type',
  'buffer', 'buffer_status', 'max_contracts', 'contract_scaling',
  'minimum_trading_days', 'minimum_profitable_days', 'consistency_rule', 'best_day_rule',
  'profit_split', 'payout_cap', 'minimum_payout', 'days_between_payouts',
  'reset_fee', 'activation_fee', 'leverage', 'time_limit',
  'news_trading_status', 'overnight_rule', 'weekend_rule', 'payout_eligible',
  'scaling_note', 'refund_note', 'source_url', 'verified_at', 'confidence', 'editorial_note',
]

function build(pack) {
  const F = pack.firm_slug
  const V = pack.verified_at
  const L = []
  const nbPlans = pack.programs.reduce((s, p) => s + p.plans.length, 0)
  const sansPlan = pack.programs.filter((p) => p.plans.length === 0)

  L.push('-- =============================================================================')
  L.push(`-- ${F.toUpperCase()} — PROGRAMMES v2 (marches, familles, variantes)`)
  L.push('-- =============================================================================')
  L.push('-- Prerequis : RUN-program-schema.sql PUIS RUN-program-schema-v2.sql.')
  L.push(`-- Source : audit officiel du ${V}.`)
  L.push('--')
  L.push('-- Ce fichier n efface et ne reinsere QUE les lignes de cette firme.')
  L.push('-- prop_firm_challenges n est pas touchee : l ancien configurateur reste')
  L.push('-- disponible en repli tant que ces programmes ne couvrent pas tout.')
  L.push('-- =============================================================================')
  L.push('')
  L.push('')
  L.push('-- 1. Table rase pour cette firme')
  L.push(`delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = ${S(F)});`)
  for (const t of ['firm_programs', 'firm_promotions', 'firm_rules']) {
    L.push(`delete from ${t} where firm_slug = ${S(F)};`)
  }
  L.push('')
  L.push('')
  L.push(`-- 2. ${pack.programs.length} programmes`)
  if (sansPlan.length) {
    L.push(`-- Dont ${sansPlan.length} sans aucun plan : ${sansPlan.map((p) => p.name).join(', ')}.`)
    L.push('-- Un programme sans plan s affiche comme « verification en cours ». C est')
    L.push('-- voulu : recopier les regles d un produit voisin serait pire que le vide.')
  }
  L.push('insert into firm_programs (firm_slug, slug, name, market, program_family, status,')
  L.push('  kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note,')
  L.push('  source_url, verified_at) values')
  L.push(pack.programs.map((p) =>
    `  (${S(F)}, ${S(p.slug)}, ${S(p.name)}, ${S(p.market)}, ${S(p.program_family)}, ${S(p.status)}, ${S(p.kind)}, ${N(p.evaluation_steps)}, ${S(p.summary)}, ${N(p.sort_order)}, ${N(p.max_funded_accounts ?? null)}, ${S(p.max_funded_note ?? null)}, ${S(p.source_url)}, ${D(V)})`
  ).join(',\n') + ';')

  if (nbPlans) {
    L.push('')
    L.push('')
    L.push(`-- 3. ${nbPlans} plans — une ligne par programme x variante x phase x taille`)
    const rows = []
    for (const p of pack.programs) {
      for (const pl of p.plans) {
        rows.push('  (' + [
          `(select id from firm_programs where firm_slug = ${S(F)} and slug = ${S(p.slug)})`,
          S(pl.phase), N(pl.account_size), S(pl.variant_key ?? null), S(pl.variant_label ?? null),
          S(pl.account_type ?? null), S(pl.target_variant ?? null), S(pl.currency ?? 'USD'),
          S(pl.platform ?? null), N(pl.regular_price ?? null), N(pl.post_pass_fee ?? null),
          N(pl.profit_target ?? null), N(pl.maximum_loss_limit ?? null), N(pl.daily_loss_limit ?? null),
          S(pl.drawdown_type ?? null), N(pl.buffer ?? null), S(pl.buffer_status ?? 'not_stated'),
          N(pl.max_contracts ?? null), B(pl.contract_scaling ?? null),
          N(pl.minimum_trading_days ?? null), N(pl.minimum_profitable_days ?? null),
          N(pl.consistency_rule ?? null), N(pl.best_day_rule ?? null),
          N(pl.profit_split ?? null), N(pl.payout_cap ?? null), N(pl.minimum_payout ?? null),
          N(pl.days_between_payouts ?? null), N(pl.reset_fee ?? null), N(pl.activation_fee ?? null),
          S(pl.leverage ?? null), S(pl.time_limit ?? null),
          S(pl.news_trading_status ?? null), S(pl.overnight_rule ?? null), S(pl.weekend_rule ?? null),
          B(pl.payout_eligible ?? null), S(pl.scaling_note ?? null), S(pl.refund_note ?? null),
          S(p.source_url), D(V), S(pl.confidence ?? 'verified'), S(pl.editorial_note ?? null),
        ].join(', ') + ')')
      }
    }
    L.push(`insert into firm_program_plans (${PLAN_COLS.join(', ')}) values`)
    L.push(rows.join(',\n') + ';')
  }

  if (pack.promotions.length) {
    L.push('')
    L.push('')
    L.push(`-- 4. ${pack.promotions.length} promotion(s), limitees a leurs variantes eligibles`)
    L.push('insert into firm_promotions (firm_slug, program_slug, account_size, code, label,')
    L.push('  discount_type, discount_value, starts_at, expires_at, verified_at, source_url,')
    L.push('  status, is_public, eligible_markets, eligible_variants, stacking_rule,')
    L.push('  checkout_verified, affiliate_exclusive, editorial_note) values')
    L.push(pack.promotions.map((p) =>
      `  (${S(F)}, ${S(p.program_slug)}, ${N(p.account_size)}, ${S(p.code)}, ${S(p.label)}, ${S(p.discount_type)}, ${N(p.discount_value)}, ${D(p.starts_at)}, ${D(p.expires_at)}, ${D(p.verified_at)}, ${S(p.source_url)}, ${S(p.status)}, ${B(p.is_public)}, ${A(p.eligible_markets)}, ${A(p.eligible_variants)}, ${S(p.stacking_rule)}, ${B(p.checkout_verified)}, ${B(p.affiliate_exclusive)}, ${S(p.editorial_note)})`
    ).join(',\n') + ';')
  }

  if (pack.rules.length) {
    L.push('')
    L.push('')
    L.push(`-- 5. ${pack.rules.length} regles. program_slug null = regle de toute la firme.`)
    L.push('--    Renseigne = regle propre a ce programme, jamais affichee sous un autre.')
    L.push('insert into firm_rules (firm_slug, program_slug, scope, title, detail, severity,')
    L.push('  confidence, source_url, verified_at, sort_order) values')
    L.push(pack.rules.map((r, i) => {
      const [program_slug, scope, title, detail, severity, confidence, source_url] = r
      return `  (${S(F)}, ${S(program_slug)}, ${S(scope)}, ${S(title)}, ${S(detail)}, ${S(severity)}, ${S(confidence)}, ${S(source_url)}, ${D(V)}, ${N(i + 1)})`
    }).join(',\n') + ';')
  }

  L.push('')
  L.push('')
  L.push('-- 6. CONTROLE')
  L.push(`-- Attendu : ${pack.programs.length} programmes, ${nbPlans} plans, ${pack.promotions.length} promo, ${pack.rules.length} regles.`)
  L.push('select p.name, p.market, p.status, pl.variant_label, pl.phase, pl.account_size,')
  L.push('       pl.regular_price, pl.currency, pl.profit_target, pl.daily_loss_limit,')
  L.push('       pl.best_day_rule, pl.consistency_rule, pl.profit_split')
  L.push('from firm_programs p left join firm_program_plans pl on pl.program_id = p.id')
  L.push(`where p.firm_slug = ${S(F)}`)
  L.push('order by p.sort_order, pl.variant_key nulls first, pl.account_size, pl.phase;')
  return L.join('\n') + '\n'
}

for (const pack of PACKS_V2) {
  const out = `database/RUN-${pack.firm_slug}-programs-v2.sql`
  await writeFile(out, build(pack), 'utf8')
  const nbPlans = pack.programs.reduce((s, p) => s + p.plans.length, 0)
  const variants = new Set()
  for (const p of pack.programs) for (const pl of p.plans) variants.add(`${p.slug}|${pl.variant_key ?? ''}`)
  console.log(`${out.padEnd(44)} ${pack.programs.length} programmes · ${String(nbPlans).padStart(2)} plans · ` +
    `${variants.size} variantes · ${pack.rules.length} regles`)
}
