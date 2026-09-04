// =============================================================================
// GENERATEUR MULTI-FIRMES  scripts/build-program-packs.mjs
// =============================================================================
//   node scripts/build-program-packs.mjs
//
// Ecrit un database/RUN-<slug>-programs.sql par firme decrite dans
// scripts/program-packs.mjs, dans le schema normalise cree par
// database/RUN-program-schema.sql.
//
// Prerequis : avoir passe RUN-program-schema.sql une fois. Les sept tables
// sont partagees par toutes les firmes ; ce script n insere que des donnees.
// =============================================================================

import { writeFile } from 'node:fs/promises'
import { PACKS } from './program-packs.mjs'

const S = (v) => (v === null || v === undefined || v === '' ? 'null' : "'" + String(v).replace(/'/g, "''") + "'")
const N = (v) => (v === null || v === undefined ? 'null' : String(v))
const B = (v) => (v === null || v === undefined ? 'null' : String(Boolean(v)))
const D = (v) => (v === null || v === undefined ? 'null' : `timestamptz '${v}'`)

function build(pack) {
  const F = pack.firm_slug
  const V = pack.verified_at
  const L = []
  const nbPlans = pack.programs.reduce((s, p) => s + p.plans.length, 0)

  L.push('-- =============================================================================')
  L.push(`-- ${F.toUpperCase()} — PROGRAMMES, PRIX, PROMOTIONS ET REGLES`)
  L.push('-- =============================================================================')
  L.push('-- Prerequis : database/RUN-program-schema.sql doit avoir ete passe une fois.')
  L.push('--')
  L.push(`-- Source : classeur du ${V}. Les classeurs tassent leurs valeurs vers la`)
  L.push('-- gauche quand un champ est vide ; les valeurs ont donc ete recopiees apres')
  L.push('-- controle semantique, et tout champ au placement ambigu porte')
  L.push("-- confidence = 'needs_confirmation' plutot qu une affirmation.")
  L.push('--')
  L.push('-- Idempotent : les lignes de cette firme sont effacees puis reinserees.')
  L.push('-- Aucune autre firme n est touchee.')
  L.push('-- =============================================================================')
  L.push('')
  L.push('')
  L.push('-- 1. Table rase pour cette firme uniquement')
  L.push(`delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = ${S(F)});`)
  for (const t of ['firm_programs', 'firm_promotions', 'firm_program_bundles', 'firm_platforms', 'firm_rules', 'firm_live_tiers']) {
    L.push(`delete from ${t} where firm_slug = ${S(F)};`)
  }
  L.push('')
  L.push('')
  L.push(`-- 2. Les ${pack.programs.length} programmes`)
  L.push('insert into firm_programs (firm_slug, slug, name, kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note, source_url, verified_at) values')
  L.push(pack.programs.map((p) =>
    `  (${S(F)}, ${S(p.slug)}, ${S(p.name)}, ${S(p.kind)}, ${N(p.evaluation_steps)}, ${S(p.summary)}, ${N(p.sort_order)}, ${N(p.max_funded_accounts ?? null)}, ${S(p.max_funded_note ?? null)}, ${S(p.source_url)}, ${D(V)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push(`-- 3. Les ${nbPlans} plans, une ligne par programme x phase x taille`)
  const rows = []
  for (const p of pack.programs) {
    for (const pl of p.plans) {
      rows.push('  (' + [
        `(select id from firm_programs where firm_slug = ${S(F)} and slug = ${S(p.slug)})`,
        S(pl.phase), N(pl.account_size), N(pl.regular_price ?? null),
        N(pl.profit_target ?? null), N(pl.maximum_loss_limit ?? null), N(pl.daily_loss_limit ?? null),
        S(pl.drawdown_type ?? null), N(pl.buffer ?? null), S(pl.buffer_status ?? 'not_stated'),
        N(pl.max_contracts ?? null), B(pl.contract_scaling ?? null),
        N(pl.minimum_trading_days ?? null), N(pl.consistency_rule ?? null),
        N(pl.profit_split ?? null), N(pl.payout_cap ?? null), N(pl.minimum_payout ?? null),
        N(pl.days_between_payouts ?? null), N(pl.reset_fee ?? null), N(pl.activation_fee ?? null),
        S(pl.news_trading_status ?? null), S(pl.news_trading_note ?? null),
        S(pl.scalping_status ?? null), S(pl.scalping_note ?? null),
        S(p.source_url), D(V), S(pl.confidence ?? 'verified'), S(pl.editorial_note ?? null),
      ].join(', ') + ')')
    }
  }
  L.push('insert into firm_program_plans (program_id, phase, account_size, regular_price,')
  L.push('  profit_target, maximum_loss_limit, daily_loss_limit, drawdown_type, buffer,')
  L.push('  buffer_status, max_contracts, contract_scaling, minimum_trading_days,')
  L.push('  consistency_rule, profit_split, payout_cap, minimum_payout, days_between_payouts,')
  L.push('  reset_fee, activation_fee, news_trading_status, news_trading_note,')
  L.push('  scalping_status, scalping_note, source_url, verified_at, confidence, editorial_note) values')
  L.push(rows.join(',\n') + ';')

  if (pack.promotions.length) {
    L.push('')
    L.push('')
    L.push(`-- 4. ${pack.promotions.length} promotion(s), datees et jamais qualifiees de permanentes`)
    L.push('insert into firm_promotions (firm_slug, program_slug, account_size, code, label,')
    L.push('  discount_type, discount_value, starts_at, expires_at, verified_at, source_url,')
    L.push('  status, is_public, editorial_note) values')
    L.push(pack.promotions.map((p) =>
      `  (${S(F)}, ${S(p.program_slug)}, ${N(p.account_size)}, ${S(p.code)}, ${S(p.label)}, ${S(p.discount_type)}, ${N(p.discount_value)}, ${D(p.starts_at)}, ${D(p.expires_at)}, ${D(p.verified_at)}, ${S(p.source_url)}, ${S(p.status)}, ${B(p.is_public)}, ${S(p.editorial_note)})`
    ).join(',\n') + ';')
  }

  if (pack.platforms.length) {
    L.push('')
    L.push('')
    L.push('-- 5. Plateformes')
    L.push('insert into firm_platforms (firm_slug, name, configurator_status, checkout_surcharge, note, sort_order) values')
    L.push(pack.platforms.map((p) =>
      `  (${S(F)}, ${S(p.name)}, ${S(p.configurator_status)}, ${S(p.checkout_surcharge)}, ${S(p.note)}, ${N(p.sort_order)})`
    ).join(',\n') + ';')
  }

  if (pack.rules.length) {
    L.push('')
    L.push('')
    L.push(`-- 6. ${pack.rules.length} regles, avec leur niveau de gravite`)
    L.push('insert into firm_rules (firm_slug, scope, title, detail, severity, confidence, source_url, verified_at, sort_order) values')
    L.push(pack.rules.map((r, i) => {
      const [scope, title, detail, severity, confidence, source_url] = r
      return `  (${S(F)}, ${S(scope)}, ${S(title)}, ${S(detail)}, ${S(severity)}, ${S(confidence)}, ${S(source_url)}, ${D(V)}, ${N(i + 1)})`
    }).join(',\n') + ';')
  }

  L.push('')
  L.push('')
  L.push('-- 7. CONTROLE')
  L.push(`-- Attendu : ${pack.programs.length} programmes, ${nbPlans} plans, ${pack.promotions.length} promotion(s), ${pack.rules.length} regles.`)
  L.push('select p.name, pl.phase, pl.account_size, pl.regular_price, pl.profit_target,')
  L.push('       pl.maximum_loss_limit, pl.daily_loss_limit, pl.profit_split, pl.confidence')
  L.push('from firm_program_plans pl join firm_programs p on p.id = pl.program_id')
  L.push(`where p.firm_slug = ${S(F)}`)
  L.push('order by p.sort_order, pl.account_size;')
  return L.join('\n') + '\n'
}

for (const pack of PACKS) {
  const out = `database/RUN-${pack.firm_slug}-programs.sql`
  await writeFile(out, build(pack), 'utf8')
  const nbPlans = pack.programs.reduce((s, p) => s + p.plans.length, 0)
  const aConfirmer = pack.programs.reduce(
    (s, p) => s + p.plans.filter((x) => x.confidence === 'needs_confirmation').length, 0)
  console.log(`${out.padEnd(46)} ${pack.programs.length} programmes · ${String(nbPlans).padStart(2)} plans ` +
    `(${aConfirmer} a confirmer) · ${pack.promotions.length} promo · ${pack.rules.length} regles`)
}
