// =============================================================================
// CAPACITES D'UNE FICHE — lib/firm-capabilities.ts
// =============================================================================
// Ce que la page peut afficher pour une firme se DEDUIT de ses données, jamais
// d'un test sur son slug. `if (firm.slug === 'futureselite')` est exactement ce
// que CLAUDE.md interdit et ce que ce module remplace.
//
// UN DEFAUT D'ARCHITECTURE QUE CE MODULE CORRIGE
//
// Le câblage précédent était exclusif :
//
//     programData ? <ProgramExplorer/> : <ChallengeSelector/>
//
// Earn2Trade tire son sélecteur de flux de données de `firm.checkout_options`,
// lu par ChallengeSelector. Le jour où Earn2Trade aurait reçu des lignes dans
// `firm_programs`, elle aurait donc PERDU ce sélecteur sans que rien ne le
// signale. Les deux capacités sont indépendantes : une firme peut avoir des
// programmes normalisés ET des options de checkout, et doit garder les deux.
// =============================================================================

import type { FirmProgramData } from './firm-programs'

export interface FirmCapabilities {
  /** Des programmes normalisés existent : le configurateur générique s'affiche. */
  hasPrograms: boolean
  /** Plus d'un programme : le sélecteur de programme a un sens. */
  hasMultiplePrograms: boolean
  /** Plusieurs marchés : CFD, Futures, actions. */
  hasMarketSelection: boolean
  /** Au moins un programme propose plusieurs variantes à taille égale. */
  hasVariantSelection: boolean
  /** Au moins un programme a une phase d'évaluation. */
  hasEvaluation: boolean
  /** Au moins un programme est financé dès l'achat. */
  hasInstantFunding: boolean
  /** Options de checkout héritées : flux de données, plateforme payante. */
  hasCheckoutOptions: boolean
  /** Paliers d'achat groupé. */
  hasBundleDiscounts: boolean
  /** Une liste de plateformes est publiée. */
  hasPlatformList: boolean
  /** Au moins un plan porte des frais d'activation non nuls. */
  hasActivationFee: boolean
  /** Au moins un plan porte des frais de reset. */
  hasResetFee: boolean
  /** Au moins un plan décrit une progression. */
  hasScalingLadder: boolean
  /** Au moins un plan décrit un remboursement. */
  hasRefund: boolean
  /** Au moins un plan porte un buffer chiffré. */
  hasBuffer: boolean
  /** Une promotion active existe. */
  hasPromotion: boolean
  /** Au moins un fait est marqué à confirmer : la page doit le dire. */
  hasUnverifiedFacts: boolean
  /** Au moins un programme est publié sans plan : vérification en cours. */
  hasPendingPrograms: boolean
}

const VIDE: FirmCapabilities = {
  hasPrograms: false, hasMultiplePrograms: false, hasMarketSelection: false,
  hasVariantSelection: false, hasEvaluation: false, hasInstantFunding: false,
  hasCheckoutOptions: false, hasBundleDiscounts: false, hasPlatformList: false,
  hasActivationFee: false, hasResetFee: false, hasScalingLadder: false,
  hasRefund: false, hasBuffer: false, hasPromotion: false,
  hasUnverifiedFacts: false, hasPendingPrograms: false,
}

export function deriveCapabilities(
  data: FirmProgramData | null,
  firm: { checkout_options?: unknown } | null
): FirmCapabilities {
  const hasCheckoutOptions = Boolean(
    firm?.checkout_options &&
    typeof firm.checkout_options === 'object' &&
    Object.keys(firm.checkout_options as Record<string, unknown>).length > 0
  )

  if (!data || data.programs.length === 0) {
    return { ...VIDE, hasCheckoutOptions }
  }

  const plans = data.programs.flatMap((p) => p.plans)
  const marches = new Set(data.programs.map((p) => p.market || 'cfd'))
  const variantes = data.programs.some(
    (p) => new Set(p.plans.map((x) => x.variant_key ?? '')).size > 1
  )

  return {
    hasPrograms: true,
    hasMultiplePrograms: data.programs.length > 1,
    hasMarketSelection: marches.size > 1,
    hasVariantSelection: variantes,
    hasEvaluation: plans.some((p) => p.phase.startsWith('evaluation')),
    hasInstantFunding: data.programs.some(
      (p) => p.kind === 'instant' || (p.plans.length > 0 && !p.plans.some((x) => x.phase.startsWith('evaluation')))
    ),
    hasCheckoutOptions,
    hasBundleDiscounts: data.bundles.length > 0,
    hasPlatformList: data.platforms.length > 0,
    // Un zero est une valeur verifiee, pas une absence : on ne compte que les
    // frais reellement non nuls.
    hasActivationFee: plans.some((p) => p.activation_fee !== null && Number(p.activation_fee) > 0),
    hasResetFee: plans.some((p) => p.reset_fee !== null && Number(p.reset_fee) > 0),
    hasScalingLadder: plans.some((p) => Boolean(p.scaling_note)),
    hasRefund: plans.some((p) => Boolean(p.refund_note)),
    hasBuffer: plans.some((p) => p.buffer_status === 'amount' && p.buffer !== null),
    hasPromotion: data.promotions.some((p) => p.status === 'active'),
    hasUnverifiedFacts:
      plans.some((p) => p.confidence === 'needs_confirmation') ||
      data.rules.some((r) => r.confidence === 'needs_confirmation'),
    hasPendingPrograms: data.programs.some((p) => p.plans.length === 0),
  }
}
