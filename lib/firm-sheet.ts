// =============================================================================
// FICHE DE FIRME                                              lib/firm-sheet.ts
// =============================================================================
// La forme de data/firms/<slug>.json, produit par scripts/xlsx_to_firm.py a
// partir du tableur MODELE-propfirm.xlsx rempli pour une firme.
//
// C'est la SEULE source de la page universelle : ce qui n'est pas dans la
// fiche ne s'affiche pas, et aucune fonction ici ne complete un vide.
// =============================================================================

export type PhaseKey = 'evaluation' | 'evaluation_2' | 'funded'

export interface SheetPhase {
  phase: PhaseKey
  objectifProfit: number | null
  perteMax: number | null
  typePerteMax: string | null
  /** Montant, « aucune » quand la firme dit qu'il n'y en a pas, null quand elle ne publie rien. */
  perteJour: number | 'aucune' | null
  joursMin: number | null
  /** Fraction (0.4 = 40 %), « aucune », « non confirmee », ou null. */
  regularite: number | 'aucune' | 'non confirmee' | null
  maxContrats: number | null
  /** Fraction : 0.9 = 90 %. */
  partage: number | null
}

export interface SheetPlan {
  taille: number
  variante: string | null
  devise: string
  prix: number | null
  /** Le plan affiche dans la carte « MOST POPULAR PLAN ». */
  cartePromo: boolean
  phases: SheetPhase[]
}

export interface SheetProgramme {
  slug: string
  nom: string
  marche: string
  type: 'evaluation' | 'instant'
  plans: SheetPlan[]
}

export interface SheetOffre {
  code: string
  /** Fraction : 0.3 = 30 %. */
  remise: number
  portee: 'universelle_verifiee' | 'restreinte' | 'non_confirmee'
  checkoutVerifie: boolean
  programmesEligibles: string[]
  taillesEligibles: number[]
  expireLe: string | null
}

export interface FirmSheet {
  slug: string
  nom: string
  logoUrl: string | null
  marches: string[]
  presentation: string | null
  anneeCreation: number | null
  pays: string | null
  ceoFondateur: string | null
  actifs: string[]
  plateformes: string[]
  moyensPaiement: string[]
  levier: string | null
  stylesTrading: string[]
  programmes: SheetProgramme[]
  offre: SheetOffre | null
  conditions: { trading: string | null; commission: string | null; retraits: string | null }
  verdict: { texte: string | null; pourQui: string[]; pasPour: string[] }
  faq: { question: string; reponse: string }[]
}

// -----------------------------------------------------------------------------
// MISE EN FORME
// -----------------------------------------------------------------------------
export const PHASE_LABEL: Record<PhaseKey, string> = {
  evaluation: 'Evaluation',
  evaluation_2: 'Evaluation 2',
  funded: 'Funded',
}

const ORDRE_PHASE: Record<PhaseKey, number> = { evaluation: 0, evaluation_2: 1, funded: 2 }

export function orderedPhases(phases: SheetPhase[]): SheetPhase[] {
  return [...phases].sort((a, b) => ORDRE_PHASE[a.phase] - ORDRE_PHASE[b.phase])
}

const MARCHE_LABEL: Record<string, string> = {
  futures: 'Futures',
  cfd: 'CFD',
  stocks: 'Stocks',
  crypto: 'Crypto',
}

export function marketsLabel(marches: string[]): string {
  return marches.map((m) => MARCHE_LABEL[m] ?? m).join(' & ')
}

/** « Firm type » : deduit des marches, jamais saisi a part. */
export const firmType = marketsLabel

export function money(n: number, devise: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: devise || 'USD',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n)
}

/** « $25K » : la taille est un libelle, pas un prix. */
export function sizeLabel(n: number, devise: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: devise || 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}

export function pct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

export function withFirmName(texte: string, nom: string): string {
  return texte.replace(/\[Firm\]/g, nom)
}

// -----------------------------------------------------------------------------
// OFFRE
// -----------------------------------------------------------------------------
export function discounted(prix: number, remise: number): number {
  return Math.round(prix * (1 - remise) * 100) / 100
}

/** Un prix remise n'est certain que si la portee ET le paiement sont verifies. */
export function isEstimate(offre: SheetOffre): boolean {
  return !(offre.portee === 'universelle_verifiee' && offre.checkoutVerifie)
}

export function offerApplies(offre: SheetOffre, programmeSlug: string, taille: number): boolean {
  const programmeOk =
    offre.programmesEligibles.length === 0 || offre.programmesEligibles.includes(programmeSlug)
  const tailleOk = offre.taillesEligibles.length === 0 || offre.taillesEligibles.includes(taille)
  return programmeOk && tailleOk
}

/** La mention sous le code. Elle dit ce qui est etabli, et seulement cela. */
export function offerNotice(offre: SheetOffre, nomsProgrammes: Record<string, string>): string {
  const parties: string[] = []
  parties.push(isEstimate(offre) ? 'Estimated price — verify at checkout.' : 'Discount verified at checkout.')

  if (offre.portee === 'universelle_verifiee') {
    parties.push('Valid on every account.')
  } else if (
    offre.portee === 'restreinte' &&
    (offre.programmesEligibles.length > 0 || offre.taillesEligibles.length > 0)
  ) {
    const programmes = offre.programmesEligibles.map((slug) => nomsProgrammes[slug] ?? slug).join(', ')
    const tailles = offre.taillesEligibles.map((t) => `${t / 1000}K`).join(', ')
    parties.push(`Valid on ${[programmes, tailles].filter(Boolean).join(' · ')} only.`)
  } else {
    parties.push('Eligibility by programme and account size is not confirmed.')
  }

  parties.push(offre.expireLe ? `Expires ${offre.expireLe}.` : 'No published expiry.')
  return parties.join(' ')
}

export function promoSelection(
  programmes: SheetProgramme[]
): { programme: SheetProgramme; plan: SheetPlan } | null {
  for (const programme of programmes) {
    const plan = programme.plans.find((p) => p.cartePromo)
    if (plan) return { programme, plan }
  }
  return null
}

// -----------------------------------------------------------------------------
// TABLEAU « RULES BY PHASE »
// -----------------------------------------------------------------------------
// La colonne « Meaning » est GENERIQUE : un texte par regle, identique pour
// toutes les firmes, qui definit la regle sans rien affirmer sur la firme.
// Decision du 11 septembre 2026 : rien a remplir par firme.
export interface RuleRow {
  label: string
  value: string
  meaning: string
}

function meaningMaxLoss(type: string | null): string {
  switch ((type ?? '').toLowerCase()) {
    case 'end of day':
      return 'The limit is updated from the end-of-day balance.'
    case 'trailing equity':
      return 'The limit trails the highest equity reached, including open profit.'
    case 'trailing intraday':
      return 'The limit trails the highest balance reached during the session.'
    case 'static':
      return 'The limit stays fixed from the starting balance.'
    default:
      return 'Reaching this loss breaches the account.'
  }
}

export function ruleRows(phase: SheetPhase, devise: string): RuleRow[] {
  const finance = phase.phase === 'funded'
  const lignes: { label: string; value: string | null; meaning: string }[] = [
    {
      label: 'Profit objective',
      value: phase.objectifProfit != null ? money(phase.objectifProfit, devise) : null,
      meaning: 'Profit to reach to pass this phase.',
    },
    {
      label: 'Maximum loss',
      value:
        phase.perteMax != null
          ? `${money(phase.perteMax, devise)}${phase.typePerteMax ? ` · ${phase.typePerteMax}` : ''}`
          : null,
      meaning: meaningMaxLoss(phase.typePerteMax),
    },
    {
      label: 'Daily loss',
      value:
        phase.perteJour == null ? null : phase.perteJour === 'aucune' ? 'None' : money(phase.perteJour, devise),
      meaning:
        phase.perteJour === 'aucune'
          ? 'No daily limit in this phase; the maximum loss still applies.'
          : 'Losing more than this in a single day breaches the account.',
    },
    {
      label: 'Minimum days',
      value: phase.joursMin != null ? String(phase.joursMin) : null,
      meaning: finance
        ? 'Trading days required before a payout request.'
        : 'Trading days required before the phase can be passed.',
    },
    {
      label: 'Consistency',
      value:
        phase.regularite == null
          ? null
          : phase.regularite === 'aucune'
            ? 'None'
            : phase.regularite === 'non confirmee'
              ? 'Unconfirmed'
              : pct(phase.regularite),
      meaning:
        phase.regularite === 'aucune'
          ? 'No consistency rule in this phase.'
          : phase.regularite === 'non confirmee'
            ? 'Not confirmed by the firm; check its rules before trading.'
            : 'Caps the share of total profit a single day may represent, as the firm calculates it.',
    },
    {
      label: 'Maximum positions/contracts',
      value: phase.maxContrats != null ? String(phase.maxContrats) : null,
      meaning: 'Largest position size allowed at the same time.',
    },
  ]
  return lignes.filter((l): l is RuleRow => l.value != null)
}
