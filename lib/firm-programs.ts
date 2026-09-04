// =============================================================================
// LECTURE DES PROGRAMMES — lib/firm-programs.ts
// =============================================================================
// Charge, pour une firme, la structure normalisée introduite par
// `database/RUN-program-schema.sql` : programmes, plans par phase, promotions,
// paliers de bundle, plateformes et règles.
//
// POURQUOI CE FICHIER EXISTE
//
// Les sept tables ont été créées et remplies avant que le moindre code ne les
// lise. Résultat concret : les 27 plans FuturesElite étaient en base et la
// fiche continuait d'afficher les 4 anciens challenges, parce que la page
// interroge `prop_firm_challenges` et rien d'autre. Des données importées que
// personne ne lit ne changent rien à ce que voit le visiteur.
//
// REPLI
//
// `loadFirmPrograms` renvoie `null` quand la firme n'a aucune ligne dans
// `firm_programs`. La page retombe alors sur `prop_firm_challenges` exactement
// comme avant : les ~349 autres fiches ne bougent pas.
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js'

export type Phase = 'evaluation' | 'evaluation_2' | 'evaluation_3' | 'sim_funded' | 'live'

/** Les cinq niveaux imposés par le brief. Un booléen ne pouvait pas les porter. */
export type Severity =
  | 'hard_breach'
  | 'temporary_pause'
  | 'payout_adjustment'
  | 'eligibility_condition'
  | 'restriction'
  | 'allowed'
  | 'informational'
  | 'payout_condition'
  | 'needs_confirmation'

export interface ProgramPlan {
  phase: Phase
  /** Distingue deux offres de meme taille : Standard et Swing, 8/5 et 10/5. */
  variant_key: string | null
  variant_label: string | null
  account_type: string | null
  target_variant: string | null
  /** La devise appartient au plan : FTMO facture en EUR, The5ers en USD. */
  currency: string | null
  platform: string | null
  post_pass_fee: number | null
  /** Distincte de consistency_rule : FTMO l'applique au 1-Step seulement. */
  best_day_rule: number | null
  minimum_profitable_days: number | null
  leverage: string | null
  time_limit: string | null
  overnight_rule: string | null
  weekend_rule: string | null
  payout_eligible: boolean | null
  scaling_note: string | null
  refund_note: string | null
  editorial_note: string | null
  account_size: number
  regular_price: number | null
  profit_target: number | null
  maximum_loss_limit: number | null
  daily_loss_limit: number | null
  drawdown_type: string | null
  buffer: number | null
  /** 'none' | 'amount' | 'not_stated' — distingue « pas de buffer » de « inconnu ». */
  buffer_status: string | null
  max_contracts: number | null
  contract_scaling: boolean | null
  minimum_trading_days: number | null
  /** Fraction : 0.4 = 40 %. */
  consistency_rule: number | null
  profit_split: number | null
  payout_cap: number | null
  minimum_payout: number | null
  days_between_payouts: number | null
  reset_fee: number | null
  activation_fee: number | null
  news_trading_status: string | null
  news_trading_note: string | null
  scalping_status: string | null
  scalping_note: string | null
  source_url: string | null
  verified_at: string | null
  confidence: string | null
}

export interface Program {
  slug: string
  name: string
  /** cfd | futures | stocks — sans lui, Futures et CFD se melangeaient. */
  market: string
  program_family: string | null
  /** active | promotional | beta | legacy | unverified | discontinued */
  status: string
  kind: string
  evaluation_steps: number | null
  summary: string | null
  sort_order: number
  max_funded_accounts: number | null
  max_funded_note: string | null
  source_url: string | null
  verified_at: string | null
  plans: ProgramPlan[]
}

export interface Promotion {
  program_slug: string | null
  account_size: number | null
  eligible_variants: string[] | null
  eligible_markets: string[] | null
  checkout_verified: boolean | null
  affiliate_exclusive: boolean | null
  stacking_rule: string | null
  code: string | null
  label: string | null
  discount_type: string
  discount_value: number
  starts_at: string | null
  expires_at: string | null
  verified_at: string | null
  source_url: string | null
  status: string
  is_public: boolean
  editorial_note: string | null
}

export interface BundleStep {
  program_slug: string
  account_number: number
  discount_percent: number | null
  status: string | null
  note: string | null
}

export interface PlatformRow {
  name: string
  configurator_status: string | null
  checkout_surcharge: string | null
  note: string | null
}

export interface FirmRule {
  /** null = regle de toute la firme. Renseigne = regle propre au programme. */
  program_slug: string | null
  scope: string
  title: string
  detail: string | null
  severity: Severity | null
  confidence: string | null
  source_url: string | null
}

export interface FirmProgramData {
  programs: Program[]
  promotions: Promotion[]
  bundles: BundleStep[]
  platforms: PlatformRow[]
  rules: FirmRule[]
}

/**
 * Charge la structure programmes d'une firme.
 *
 * Renvoie `null` — et non un objet vide — quand la firme n'en a pas, pour que
 * l'appelant puisse distinguer « pas de programmes » de « base injoignable » et
 * garder l'affichage historique dans les deux cas.
 */
export async function loadFirmPrograms(
  supabase: SupabaseClient,
  firmSlug: string
): Promise<FirmProgramData | null> {
  const { data: programs, error } = await supabase
    .from('firm_programs')
    .select('*')
    .eq('firm_slug', firmSlug)
    .order('sort_order', { ascending: true })

  // Table absente, droits manquants, base injoignable : dans tous les cas on
  // rend la main pour que la page serve sa version historique plutôt qu'une
  // section vide.
  if (error || !programs || programs.length === 0) return null

  const ids = (programs as { id: string }[]).map((p) => p.id)

  const [plansRes, promosRes, bundlesRes, platformsRes, rulesRes] = await Promise.all([
    supabase
      .from('firm_program_plans')
      .select('*')
      .in('program_id', ids)
      .order('account_size', { ascending: true }),
    supabase.from('firm_promotions').select('*').eq('firm_slug', firmSlug).eq('status', 'active'),
    supabase.from('firm_program_bundles').select('*').eq('firm_slug', firmSlug).order('account_number', { ascending: true }),
    supabase.from('firm_platforms').select('*').eq('firm_slug', firmSlug).order('sort_order', { ascending: true }),
    supabase.from('firm_rules').select('*').eq('firm_slug', firmSlug).order('sort_order', { ascending: true }),
  ])

  const plansByProgram = new Map<string, ProgramPlan[]>()
  for (const row of (plansRes.data || []) as (ProgramPlan & { program_id: string })[]) {
    const list = plansByProgram.get(row.program_id) || []
    list.push(row)
    plansByProgram.set(row.program_id, list)
  }

  return {
    programs: (programs as (Program & { id: string })[]).map((p) => ({
      ...p,
      plans: plansByProgram.get(p.id) || [],
    })),
    promotions: (promosRes.data || []) as Promotion[],
    bundles: (bundlesRes.data || []) as BundleStep[],
    platforms: (platformsRes.data || []) as PlatformRow[],
    rules: (rulesRes.data || []) as FirmRule[],
  }
}

// -----------------------------------------------------------------------------
// Prix
// -----------------------------------------------------------------------------

export interface PriceResult {
  regular: number | null
  final: number | null
  promotion: Promotion | null
  /** Une meilleure offre publique existe et bat le code partenaire retenu. */
  betterPublic: Promotion | null
}

function isLive(p: Promotion, now: Date): boolean {
  if (p.status !== 'active') return false
  if (p.starts_at && new Date(p.starts_at) > now) return false
  // `expires_at` nul veut dire « expiration inconnue », jamais « permanent ».
  // On laisse l'offre active, mais la page le signale.
  if (p.expires_at && new Date(p.expires_at) < now) return false
  return true
}

/**
 * Prix à payer aujourd'hui pour un programme et une taille.
 *
 * Le brief est explicite : ne jamais présenter le code partenaire comme le
 * meilleur prix tant qu'il produit un panier plus cher. On retient donc la
 * meilleure remise réellement applicable, et on expose séparément l'offre
 * publique quand elle bat le code partenaire — la page peut alors le dire.
 */
export function priceFor(
  promotions: Promotion[],
  programSlug: string,
  accountSize: number,
  regular: number | null,
  now: Date = new Date(),
  variantKey: string | null = null
): PriceResult {
  const applicable = promotions.filter(
    (p) =>
      isLive(p, now) &&
      (p.program_slug === null || p.program_slug === programSlug) &&
      (p.account_size === null || Number(p.account_size) === accountSize) &&
      // La promotion 20 % de FTMO ne vaut que pour le 1-Step 100K Standard :
      // sans ce filtre elle s'appliquait a toutes les variantes.
      (!p.eligible_variants || p.eligible_variants.length === 0 ||
       (variantKey !== null && p.eligible_variants.includes(variantKey)))
  )

  if (regular === null || applicable.length === 0) {
    return { regular, final: regular, promotion: null, betterPublic: null }
  }

  const value = (p: Promotion) =>
    p.discount_type === 'percent' ? regular * Number(p.discount_value) : Number(p.discount_value)

  // Pas de cumul : FuturesElite ne documente aucun empilement de remises.
  const best = applicable.reduce((a, b) => (value(b) > value(a) ? b : a))
  const bestPublic = applicable.filter((p) => p.is_public).reduce<Promotion | null>(
    (a, b) => (a === null || value(b) > value(a) ? b : a),
    null
  )

  const final = Math.round((regular - value(best)) * 100) / 100

  return {
    regular,
    final,
    promotion: best,
    betterPublic: bestPublic && !best.is_public && value(bestPublic) > value(best) ? bestPublic : null,
  }
}

/** Marches distincts, dans l'ordre d'affichage des programmes. */
export function marketsOf(data: FirmProgramData): string[] {
  return Array.from(new Set(data.programs.map((p) => p.market || 'cfd')))
}

/** Variantes d'un programme. `[null]` quand il n'en a pas. */
export function variantsOf(program: Program): { key: string | null; label: string }[] {
  const seen = new Map<string, { key: string | null; label: string }>()
  for (const pl of program.plans) {
    const key = pl.variant_key ?? null
    const id = key ?? ''
    if (!seen.has(id)) seen.set(id, { key, label: pl.variant_label || pl.account_type || '' })
  }
  return Array.from(seen.values())
}

/** Regles qui s'appliquent au programme choisi, plus celles de la firme. */
export function rulesFor(data: FirmProgramData, programSlug: string): FirmRule[] {
  return data.rules.filter((r) => !r.program_slug || r.program_slug === programSlug)
}

/** Les phases d'evaluation d'une variante, dans l'ordre. */
export function evaluationPhases(program: Program, size: number, variantKey: string | null): ProgramPlan[] {
  const order: Phase[] = ['evaluation', 'evaluation_2', 'evaluation_3']
  return order
    .map((ph) => planFor(program, ph, size, variantKey))
    .filter((p): p is ProgramPlan => p !== null)
}

/** Tailles proposées par un programme, toutes phases confondues. */
export function sizesOf(program: Program, variantKey?: string | null): number[] {
  // Array.from plutot que le spread : la cible TypeScript du projet n active
  // pas downlevelIteration, et [...new Set()] ne compile pas.
  const plans = variantKey === undefined
    ? program.plans
    : program.plans.filter((p) => (p.variant_key ?? null) === variantKey)
  return Array.from(new Set(plans.map((p) => Number(p.account_size)))).sort((a, b) => a - b)
}

/** Le plan d'une phase pour une taille donnée, ou null s'il n'existe pas. */
export function planFor(
  program: Program,
  phase: Phase,
  size: number,
  variantKey?: string | null
): ProgramPlan | null {
  return (
    program.plans.find(
      (p) =>
        p.phase === phase &&
        Number(p.account_size) === size &&
        (variantKey === undefined || (p.variant_key ?? null) === variantKey)
    ) || null
  )
}

/**
 * Prix régulier d'une taille.
 *
 * Il vit sur la ligne d'évaluation pour les programmes évalués, et sur la ligne
 * financée pour Instant, qui n'a pas d'évaluation.
 */
export function regularPriceFor(
  program: Program,
  size: number,
  variantKey?: string | null
): number | null {
  const evaluation = planFor(program, 'evaluation', size, variantKey)
  if (evaluation?.regular_price != null) return Number(evaluation.regular_price)
  const funded = planFor(program, 'sim_funded', size, variantKey)
  return funded?.regular_price != null ? Number(funded.regular_price) : null
}

/** Devise du plan choisi. Annoncer USD sur un prix affiche en EUR serait faux. */
export function currencyFor(
  program: Program,
  size: number,
  variantKey?: string | null
): string {
  const p = planFor(program, 'evaluation', size, variantKey) || planFor(program, 'sim_funded', size, variantKey)
  return p?.currency || 'USD'
}
