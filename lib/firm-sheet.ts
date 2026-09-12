// =============================================================================
// FICHE DE FIRME                                              lib/firm-sheet.ts
// =============================================================================
// La forme de data/firms/<slug>.json, produit par scripts/xlsx_to_firm.py a
// partir du tableur MODELE-propfirm.xlsx rempli pour une firme.
//
// C'est la SEULE source de la page universelle. Les fonctions ici mettent en
// forme ce que contient la fiche, ou le recombinent (FAQ, meta description) ;
// aucune n'ajoute une information qui n'y serait pas.
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
  /** Petite phrase au-dessus du nom, dans « How do you want to be funded? ». */
  accroche: string | null
  /** Une phrase vraie de CE programme, dans « Which program fits you? ». */
  resume: string | null
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

/** Une etape de « From evaluation to your first payout ». */
export interface SheetEtape {
  etape: 'evaluation' | 'funded' | 'payout'
  titre: string
  texte: string
}

/** Une ligne de « What you will actually pay ». Le montant est un texte : « $95 – $569 », « None ». */
export interface SheetCout {
  libelle: string
  montant: string | null
  note: string | null
}

export const ETAPE_LABEL: Record<SheetEtape['etape'], string> = {
  evaluation: 'Evaluation',
  funded: 'Funded',
  payout: 'Payout',
}

export interface FirmSheet {
  slug: string
  nom: string
  logoUrl: string | null
  marches: string[]
  /** 1 a 2 phrases, en haut de page sous le nom. */
  resume: string | null
  /** Le texte developpe, dans la section « About [Firm] ». */
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
  /** Onglets facultatifs : vides, leurs sections n'existent pas. */
  parcours: SheetEtape[]
  couts: SheetCout[]
  conditions: { trading: string | null; commission: string | null; retraits: string | null }
  verdict: {
    texte: string | null
    pourQui: string[]
    pasPour: string[]
    /** « Strengths » */
    pointsForts: string[]
    /** « Things to know » */
    limites: string[]
  }
  faq: { question: string; reponse: string }[]
}

/** Une firme proposee en fin de page. Construite par la route, depuis la base. */
export interface SimilarFirm {
  id: string
  name: string
  href: string
  logoUrl: string | null
  rating: number | null
  minPrice: number | null
  /** Code promo actif, s'il y en a un. */
  code: string | null
  /** Remise du code, en pourcentage entier (20 = 20 %), comme prop_firms.discount_percent. */
  remise: number | null
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

/**
 * Le titre de la carte des actifs. Chez une firme 100 % futures, « Forex » ou
 * « Crypto » designent des contrats futures ; « Tradable assets » laissait
 * croire a du forex au comptant.
 */
export function assetsLabel(marches: string[]): string {
  return marches.length === 1 && marches[0] === 'futures' ? 'Futures markets' : 'Tradable assets'
}

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

/** Les paragraphes d'un texte saisi dans une cellule : une ligne vide les separe. */
export function paragraphs(texte: string | null): string[] {
  return (texte ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/**
 * La meta description d'une firme servie par sa fiche : la premiere phrase de
 * sa presentation, puis ce que la page couvre. 160 caracteres au plus — au-dela
 * Google coupe, et l'ancien verdict en faisait pres de 400.
 */
export function sheetMetaDescription(sheet: FirmSheet): string {
  const source = sheet.presentation ?? sheet.resume ?? ''
  const premiere = source.match(/^[\s\S]*?[.!?](\s|$)/)?.[0].trim() ?? ''
  const suite = `Fees, trading rules, profit split and promo codes for ${sheet.nom}.`
  const texte = premiere ? `${premiere} ${suite}` : suite
  if (texte.length <= 160) return texte
  const coupe = texte.slice(0, 157)
  return `${coupe.slice(0, coupe.lastIndexOf(' '))}…`
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

export function promoSelection(
  programmes: SheetProgramme[]
): { programme: SheetProgramme; plan: SheetPlan } | null {
  for (const programme of programmes) {
    const plan = programme.plans.find((p) => p.cartePromo)
    if (plan) return { programme, plan }
  }
  return null
}

/** L'accroche d'un programme : celle du tableur, sinon son type. Jamais une promesse. */
export function programmeTagline(programme: SheetProgramme): string {
  return programme.accroche ?? (programme.type === 'instant' ? 'No evaluation' : 'Evaluation')
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

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------
// Les cinq questions du gabarit HTML. Une reponse saisie dans le tableur est
// toujours prioritaire. Sans reponse saisie, elle est RECOMPOSEE a partir des
// autres onglets, comme le gabarit l'indique (« Answer using the selected
// programme and native currency », « Answer that preserves programme
// differences »…). Rien n'est ajoute : une question dont les donnees manquent
// n'est pas affichee.
export const QUESTIONS_GABARIT = [
  'Is [Firm] suitable for beginners?',
  'How much does [Firm] cost?',
  'What profit split does [Firm] offer?',
  'How do payouts work?',
  'Does the promotional code apply to every account?',
]

function fourchette(valeurs: number[], formater: (n: number) => string): string | null {
  if (valeurs.length === 0) return null
  const min = Math.min(...valeurs)
  const max = Math.max(...valeurs)
  return min === max ? formater(min) : `${formater(min)} to ${formater(max)}`
}

function reponsesRecomposees(sheet: FirmSheet): Record<string, string | null> {
  const programmes = sheet.programmes.filter((p) => p.plans.length > 0)

  // « the account configurator above » : la section s'appelait « Build your
  // account » dans une version precedente, et la FAQ y renvoyait encore.
  const debutants =
    programmes.length > 0
      ? `${sheet.nom} offers ${programmes.length} programme${programmes.length > 1 ? 's' : ''}: ` +
        `${programmes.map((p) => p.nom).join(', ')}. Their rules and costs differ, so compare them in ` +
        `the account configurator above and see who we recommend ${sheet.nom} for.`
      : null

  const couts = programmes
    .map((p) => {
      const devise = p.plans[0]?.devise ?? 'USD'
      const prix = p.plans.map((pl) => pl.prix).filter((x): x is number => x != null)
      const f = fourchette(prix, (n) => money(n, devise))
      return f ? `${p.nom}: ${f}` : null
    })
    .filter((x): x is string => x != null)

  const partages = programmes
    .map((p) => {
      const valeurs = p.plans
        .flatMap((pl) => pl.phases)
        .filter((ph) => ph.phase === 'funded' && ph.partage != null)
        .map((ph) => ph.partage as number)
      const f = fourchette(valeurs, pct)
      return f ? `${p.nom}: ${f}` : null
    })
    .filter((x): x is string => x != null)

  const o = sheet.offre
  let promo: string | null = null
  if (o) {
    if (o.portee === 'universelle_verifiee') {
      promo = `Yes. Code ${o.code} gives ${pct(o.remise)} off every account.`
    } else if (o.portee === 'restreinte' && (o.programmesEligibles.length > 0 || o.taillesEligibles.length > 0)) {
      const noms = o.programmesEligibles
        .map((slug) => programmes.find((p) => p.slug === slug)?.nom ?? slug)
        .join(', ')
      const tailles = o.taillesEligibles.map((t) => `${t / 1000}K`).join(', ')
      promo = `No. Code ${o.code} gives ${pct(o.remise)} off ${[noms, tailles].filter(Boolean).join(' · ')} only.`
    } else {
      promo =
        `Code ${o.code} gives ${pct(o.remise)} off. Its eligibility on each programme and account size is not ` +
        `confirmed, so check the total at checkout before paying.`
    }
  }

  return {
    [QUESTIONS_GABARIT[0]]: debutants,
    [QUESTIONS_GABARIT[1]]: couts.length > 0 ? `Before any discount — ${couts.join('; ')}.` : null,
    [QUESTIONS_GABARIT[2]]: partages.length > 0 ? `Once funded — ${partages.join('; ')}.` : null,
    [QUESTIONS_GABARIT[3]]: sheet.conditions.retraits,
    [QUESTIONS_GABARIT[4]]: promo,
  }
}

export function faqItems(sheet: FirmSheet): { question: string; reponse: string }[] {
  const recomposees = reponsesRecomposees(sheet)
  const saisies = new Map(sheet.faq.map((q) => [q.question, q.reponse]))
  const items: { question: string; reponse: string }[] = []

  for (const question of QUESTIONS_GABARIT) {
    const reponse = saisies.get(question) || recomposees[question]
    if (reponse) items.push({ question: withFirmName(question, sheet.nom), reponse: withFirmName(reponse, sheet.nom) })
  }
  // Les questions ajoutees dans le tableur, apres celles du gabarit.
  for (const q of sheet.faq) {
    if (!QUESTIONS_GABARIT.includes(q.question) && q.reponse) {
      items.push({ question: withFirmName(q.question, sheet.nom), reponse: withFirmName(q.reponse, sheet.nom) })
    }
  }
  return items
}
