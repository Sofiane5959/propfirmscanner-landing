// =============================================================================
// PLAN SELECTIONNE — lib/selected-plan.ts
// =============================================================================
// Un objet unique, dérivé de la sélection, que TOUTES les sections de la page
// consomment. C'est la « source unique de vérité » du brief.
//
// POURQUOI IL FAUT UN OBJET, ET PAS DES PROPS EPARPILLEES
//
// Le bas de la fiche FuturesElite restait en version Elite après avoir choisi
// Nitro, parce que chaque section lisait ses propres colonnes au niveau de la
// FIRME. Tant que les sections lisent des sources différentes, une seule d'entre
// elles suit la sélection. Ici elles lisent toutes le même objet : si une
// section n'est pas à jour, c'est visible immédiatement.
// =============================================================================

import {
  type FirmProgramData, type Program, type ProgramPlan, type Promotion,
  type PriceResult, priceFor, planFor, regularPriceFor, currencyFor,
  evaluationPhases, rulesFor, type FirmRule,
} from './firm-programs'

export interface SelectedPlan {
  program: Program
  variantKey: string | null
  variantLabel: string | null
  accountSize: number
  currency: string
  /** Les phases d'évaluation, dans l'ordre. Vide sur un produit instantané. */
  evaluationPhases: ProgramPlan[]
  funded: ProgramPlan | null
  /** La phase qui porte les règles d'entrée : première évaluation, ou financé. */
  entry: ProgramPlan | null
  price: PriceResult
  promotion: Promotion | null
  /** Règles de la firme plus celles de ce programme. Jamais d'un autre. */
  rules: FirmRule[]
  /** Aucun plan publié : vérification en cours, on ne devine pas. */
  pending: boolean
}

export function buildSelectedPlan(
  data: FirmProgramData,
  program: Program,
  variantKey: string | null,
  accountSize: number | undefined,
  now: Date = new Date()
): SelectedPlan {
  const pending = program.plans.length === 0
  const size = accountSize ?? 0

  const phases = pending ? [] : evaluationPhases(program, size, variantKey)
  const funded = pending ? null : planFor(program, 'sim_funded', size, variantKey)
  const regular = pending ? null : regularPriceFor(program, size, variantKey)
  const price = priceFor(data.promotions, program.slug, size, regular, now, variantKey)

  const variantLabel =
    phases[0]?.variant_label ?? funded?.variant_label ?? null

  return {
    program,
    variantKey,
    variantLabel,
    accountSize: size,
    currency: pending ? 'USD' : currencyFor(program, size, variantKey),
    evaluationPhases: phases,
    funded,
    entry: phases[0] ?? funded ?? null,
    price,
    promotion: price.promotion,
    rules: rulesFor(data, program.slug),
    pending,
  }
}

// -----------------------------------------------------------------------------
// Regles critiques
// -----------------------------------------------------------------------------

export type CriticalSeverity = 'breach' | 'payout_condition' | 'restriction' | 'allowed' | 'needs_confirmation'

export interface CriticalRule {
  label: string
  value: string
  severity: CriticalSeverity
  note?: string | null
}

const pct = (v: number | null | undefined) =>
  v === null || v === undefined ? null : Math.round(Number(v) * 100) + '%'

/**
 * Les cinq règles les plus susceptibles de clôturer le compte ou de bloquer un
 * retrait, pour CETTE configuration.
 *
 * L'ordre suit le brief : perte maximale, perte journalière, régularité,
 * taille maximale, premier retrait. Un champ absent est remplacé par le
 * suivant disponible plutôt que d'afficher une ligne vide.
 */
export function criticalRules(sel: SelectedPlan): CriticalRule[] {
  const p = sel.entry
  const f = sel.funded
  if (!p) return []

  const money = (v: number | null | undefined) =>
    v === null || v === undefined ? null : formatAmount(v, sel.currency)

  const candidats: (CriticalRule | null)[] = [
    p.maximum_loss_limit !== null
      ? {
          label: 'Maximum loss',
          value: asAmountOrPercent(p.maximum_loss_limit, sel.currency),
          severity: 'breach',
          note: p.drawdown_type,
        }
      : null,
    p.daily_loss_limit !== null
      ? {
          label: 'Daily loss limit',
          value: asAmountOrPercent(p.daily_loss_limit, sel.currency),
          severity: 'breach',
        }
      : null,
    // Best Day Rule et consistency sont deux regles differentes : la premiere
    // conditionne la validation, la seconde peut bloquer un retrait.
    p.best_day_rule !== null
      ? { label: 'Best Day Rule', value: pct(p.best_day_rule) ?? '—', severity: 'payout_condition' }
      : p.consistency_rule !== null
        ? { label: 'Consistency rule', value: pct(p.consistency_rule) ?? '—', severity: 'payout_condition' }
        : f?.consistency_rule != null
          ? { label: 'Consistency once funded', value: pct(f.consistency_rule) ?? '—', severity: 'payout_condition' }
          : null,
    p.max_contracts !== null
      ? { label: 'Maximum contracts', value: String(p.max_contracts), severity: 'restriction' }
      : p.leverage
        ? { label: 'Leverage', value: p.leverage, severity: 'restriction' }
        : null,
    f?.minimum_trading_days != null
      ? {
          label: sel.evaluationPhases.length === 0
            ? 'Minimum qualifying trading days before payout'
            : 'Minimum trading days before payout',
          value: String(f.minimum_trading_days),
          severity: 'payout_condition',
        }
      : p.minimum_trading_days !== null
        ? { label: 'Minimum trading days', value: String(p.minimum_trading_days), severity: 'payout_condition' }
        : null,
  ]

  // Remplacants, dans l'ordre, quand l'un des cinq manque.
  const secours: (CriticalRule | null)[] = [
    p.buffer_status === 'amount' && p.buffer !== null
      ? { label: 'Payout buffer', value: money(p.buffer) ?? '—', severity: 'payout_condition' }
      : null,
    f?.payout_cap != null
      ? { label: 'Payout cap', value: money(f.payout_cap) ?? '—', severity: 'payout_condition' }
      : null,
    p.news_trading_status
      ? {
          label: 'News trading',
          value: humanise(p.news_trading_status),
          severity: p.news_trading_status === 'allowed' ? 'allowed'
            : p.news_trading_status === 'needs_confirmation' ? 'needs_confirmation' : 'restriction',
          note: p.news_trading_note,
        }
      : null,
    p.scalping_status
      ? {
          label: 'Scalping',
          value: humanise(p.scalping_status),
          severity: p.scalping_status === 'needs_confirmation' ? 'needs_confirmation' : 'restriction',
          note: p.scalping_note,
        }
      : null,
    p.scaling_note ? { label: 'Scaling', value: p.scaling_note, severity: 'allowed' } : null,
  ]

  const retenues = candidats.filter((c): c is CriticalRule => c !== null)
  for (const s of secours) {
    if (retenues.length >= 5) break
    if (s) retenues.push(s)
  }
  return retenues.slice(0, 5)
}

// -----------------------------------------------------------------------------
// Verdict de compatibilite
// -----------------------------------------------------------------------------

export interface Suitability {
  goodFit: string[]
  considerElse: string[]
}

/**
 * Deux listes courtes, dérivées de la configuration choisie.
 *
 * Elles changent avec le programme et la taille : c'est ce que le brief exige
 * quand il interdit de réutiliser un verdict générique pour tous les comptes.
 */
export function suitabilityFor(sel: SelectedPlan): Suitability {
  const good: string[] = []
  const other: string[] = []
  const p = sel.entry
  const f = sel.funded
  if (!p) return { goodFit: good, considerElse: other }

  if (sel.evaluationPhases.length === 0) {
    good.push('you want a funded account immediately, without passing an evaluation')
  } else if (sel.evaluationPhases.length === 1) {
    good.push('you prefer a single evaluation phase rather than two')
  } else {
    other.push(`you dislike multi-phase evaluations — this one has ${sel.evaluationPhases.length}`)
  }

  if (p.daily_loss_limit === null) good.push('you want no daily loss limit hanging over each session')
  else other.push(`you trade volatile sessions — the daily limit is ${pct(p.daily_loss_limit) ?? p.daily_loss_limit}`)

  if (p.best_day_rule !== null) other.push('you tend to make most of your profit on one strong day')
  if (p.consistency_rule !== null) other.push('you dislike consistency requirements during the evaluation')
  if (f?.consistency_rule != null && p.consistency_rule === null) {
    good.push('you accept a consistency rule once funded but not during the evaluation')
  }

  if (f?.profit_split != null) {
    const s = Math.round(Number(f.profit_split) * 100)
    if (s >= 90) good.push(`you want a high profit split — this plan pays ${s}%`)
    else other.push(`you expect more than ${s}% of the profit`)
  }

  if (p.time_limit && /unlimited|no time|aucune/i.test(p.time_limit)) {
    good.push('you want no deadline to pass the evaluation')
  }
  if (p.minimum_trading_days !== null && p.minimum_trading_days > 3) {
    other.push(`you want to finish fast — this plan asks for ${p.minimum_trading_days} trading days`)
  }
  if (p.max_contracts !== null) {
    good.push(`you trade within ${p.max_contracts} contracts`)
  }

  return { goodFit: good.slice(0, 4), considerElse: other.slice(0, 4) }
}

// -----------------------------------------------------------------------------
// Outils de mise en forme
// -----------------------------------------------------------------------------

const SYMBOLE: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' }

export function formatAmount(v: number, currency = 'USD'): string {
  return (SYMBOLE[currency] ?? '$') + Number(v).toLocaleString('en-US')
}

/**
 * Une même colonne porte tantôt un pourcentage, tantôt un montant : FTMO écrit
 * 0.10 pour 10 %, FuturesElite 1000 pour 1 000 $. On tranche sur la magnitude,
 * jamais sur le nom de la firme.
 */
export function asAmountOrPercent(v: number | null, currency = 'USD'): string {
  if (v === null) return '—'
  const n = Number(v)
  return n > 0 && n <= 1 ? Math.round(n * 100) + '%' : formatAmount(n, currency)
}

export function humanise(status: string): string {
  return status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
