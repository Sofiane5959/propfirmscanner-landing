// =============================================================================
// FICHE FIRME — MISE EN FORME DE LA NOUVELLE PAGE        lib/firm-profile.ts
// =============================================================================
// Fonctions pures pour components/prop-firm/profile. Elles mettent en forme la
// fiche (lib/firm-sheet.ts) ; aucune n'ajoute une information qui n'y est pas.
// Une valeur absente avec un statut devient une cellule « statut » ; une
// valeur absente sans statut disparait.
//
// Hierarchie des regles (contrat du 19 septembre 2026) :
//   firme → programme → plan (taille + variante) → phase → regles.
// Les phases viennent des lignes du plan, jamais d'une liste fixe.
// =============================================================================

import {
  type FirmSheet,
  type SheetOption,
  type SheetPhase,
  type SheetPlan,
  type SheetProgramme,
  type SheetRegle,
  type Statut,
  QUESTIONS_GABARIT,
  faqItems,
  formatPartage,
  meaningMaxLoss,
  money,
  pct,
} from './firm-sheet'

/** « How do payouts work? », la 4e question du gabarit. */
const QUESTION_RETRAITS = QUESTIONS_GABARIT[3]
/** « Does the promotional code apply to every account? », la 5e. */
const QUESTION_PROMO = QUESTIONS_GABARIT[4]
/** « Is [Firm] suitable for beginners? », la 1re. */
const QUESTION_DEBUTANTS = QUESTIONS_GABARIT[0]
const PREFIXE_REMISE = 'Before any discount — '

/** Ce qu'affiche une case : un texte, ou le statut qui explique son absence. */
export type Cellule = { texte: string; statut?: undefined } | { texte?: undefined; statut: StatutManquant }
export type StatutManquant = Exclude<Statut, 'confirmed'>

/**
 * Ce qui n'est pas sur ne s'affiche pas (consigne du 19 septembre 2026) : une
 * valeur « needs_confirmation » ou « source_conflict » disparait de la page,
 * comme si elle etait vide. « not_published » et « not_applicable » sont des
 * faits et restent affiches.
 */
const INCERTAINS: ReadonlySet<Statut> = new Set<Statut>(['needs_confirmation', 'source_conflict'])
export const estIncertain = (statut: Statut | null | undefined) => Boolean(statut && INCERTAINS.has(statut))

/**
 * La fiche telle que la page publique peut l'afficher : une offre non confirmee
 * par le partenaire (21 septembre 2026, SCANNED inactif au checkout) est retiree,
 * et la page se comporte comme une firme sans promotion. Un seul point de
 * decision : toutes les sections recoivent cette fiche.
 */
export function ficheAffichable(sheet: FirmSheet): FirmSheet {
  return sheet.offre && sheet.offre.statut !== 'confirmed' ? { ...sheet, offre: null } : sheet
}

export function cellule(valeur: string | null | undefined, statut: Statut | null | undefined): Cellule | null {
  if (estIncertain(statut)) return null
  if (statut && statut !== 'confirmed') return { statut }
  return valeur == null || valeur === '' ? null : { texte: valeur }
}

/** Le suffixe de prix d'un plan : « monthly » pour un abonnement mensuel. */
export function intervallePrix(plan: Pick<SheetPlan, 'facturation' | 'intervalle'>): 'monthly' | null {
  return plan.facturation === 'subscription' && plan.intervalle === 'monthly' ? 'monthly' : null
}

/** Le plan le moins cher de la firme, pour « From $X » quand il n'y a pas d'offre. */
export function planLeMoinsCher(programmes: SheetProgramme[]): SheetPlan | null {
  let meilleur: SheetPlan | null = null
  for (const p of programmes) {
    for (const pl of p.plans) {
      if (pl.prix != null && (meilleur?.prix == null || pl.prix < meilleur.prix)) meilleur = pl
    }
  }
  return meilleur
}

/** Les plateformes a afficher : les selectionnables, sinon la liste simple. */
export function plateformesAffichees(sheet: FirmSheet): string[] {
  if (sheet.plateformesDetail.length > 0) {
    return sheet.plateformesDetail.filter((p) => p.selectionnable).map((p) => p.nom)
  }
  return sheet.plateformes
}

/** Les options d'achat d'un programme, groupees par type, dans l'ordre du tableur. */
export function optionsParType(options: SheetOption[], programmeSlug: string): [SheetOption['type'], SheetOption[]][] {
  const groupes = new Map<SheetOption['type'], SheetOption[]>()
  for (const o of options) {
    if (o.programmes.length > 0 && !o.programmes.includes(programmeSlug)) continue
    groupes.set(o.type, [...(groupes.get(o.type) ?? []), o])
  }
  return Array.from(groupes.entries())
}

// -----------------------------------------------------------------------------
// PHASES
// -----------------------------------------------------------------------------
/**
 * Le nom d'une phase, deduit des phases que le plan possede reellement :
 * « Evaluation 1 » seulement s'il existe une « Evaluation 2 », « Instant
 * funded » pour un programme sans evaluation.
 */
export function libellePhase(phase: SheetPhase, plan: SheetPlan, programme: SheetProgramme): string {
  const deuxEtapes = plan.phases.some((ph) => ph.phase === 'evaluation_2')
  switch (phase.phase) {
    case 'evaluation':
      return deuxEtapes ? 'Evaluation 1' : 'Evaluation'
    case 'evaluation_2':
      return 'Evaluation 2'
    case 'funded':
      return programme.type === 'instant' ? 'Instant funded' : 'Funded'
  }
}

/** « Evaluation → Funded », dans l'ordre du plan. */
export function parcoursPhases(plan: SheetPlan, programme: SheetProgramme, ordonnees: SheetPhase[]): string {
  return ordonnees.map((ph) => libellePhase(ph, plan, programme)).join(' → ')
}

// -----------------------------------------------------------------------------
// REGLES D'UNE PHASE
// -----------------------------------------------------------------------------
// Libelles et definitions GENERIQUES : identiques pour toutes les firmes, ils
// definissent la regle sans rien affirmer sur la firme.
export interface LigneRegle {
  cle: string
  libelle: string
  /** La valeur, ou null quand un statut la remplace. */
  valeur: string | null
  statut: Statut
  sens: string
}

export function reglesDePhase(phase: SheetPhase, devise: string): LigneRegle[] {
  const st = phase.statuts ?? {}
  const finance = phase.phase === 'funded'
  const argent = (n: number | null) => (n == null ? null : money(n, devise))

  const perteJour =
    phase.perteJour === 'aucune' ? 'None' : typeof phase.perteJour === 'number' ? money(phase.perteJour, devise) : null
  const regularite =
    phase.regularite === 'aucune' ? 'None' : typeof phase.regularite === 'number' ? pct(phase.regularite) : null

  const lignes: { cle: string; libelle: string; valeur: string | null; statut?: Statut; sens: string }[] = [
    { cle: 'objectifProfit', libelle: 'Profit objective', valeur: argent(phase.objectifProfit), statut: st.objectifProfit, sens: 'Profit to reach to pass this phase.' },
    {
      cle: 'perteMax',
      libelle: 'Maximum loss',
      valeur:
        phase.perteMax == null ? null : `${money(phase.perteMax, devise)}${phase.typePerteMax ? ` · ${phase.typePerteMax}` : ''}`,
      statut: st.perteMax,
      sens: meaningMaxLoss(phase.typePerteMax),
    },
    {
      cle: 'perteJour',
      libelle: 'Daily loss',
      valeur: perteJour,
      statut: st.perteJour,
      sens:
        phase.perteJour === 'aucune'
          ? 'No daily limit in this phase; the maximum loss still applies.'
          : 'Losing more than this in a single day breaches the account.',
    },
    {
      cle: 'joursMin',
      libelle: 'Minimum days',
      // 0 jour minimum : la firme dit « no minimum », la page dit « None » comme ailleurs.
      valeur: phase.joursMin == null ? null : phase.joursMin === 0 ? 'None' : String(phase.joursMin),
      statut: st.joursMin,
      sens: finance ? 'Trading days required before a payout request.' : 'Trading days required before the phase can be passed.',
    },
    {
      cle: 'regularite',
      libelle: 'Consistency',
      valeur: regularite,
      statut: st.regularite,
      sens:
        phase.regularite === 'aucune'
          ? 'No consistency rule in this phase.'
          : 'Caps the share of total profit a single day may represent, as the firm calculates it.',
    },
    {
      cle: 'maxContrats',
      libelle: 'Maximum positions',
      valeur: phase.maxContrats == null ? null : String(phase.maxContrats),
      statut: st.maxContrats,
      sens: 'Largest position size allowed at the same time.',
    },
    { cle: 'partage', libelle: 'Profit split', valeur: formatPartage(phase, devise), statut: st.partage, sens: 'Your share of the profit you withdraw.' },
    { cle: 'plafondRetrait', libelle: 'Payout cap per request', valeur: argent(phase.plafondRetrait), statut: st.plafondRetrait, sens: 'The most a single payout request can be.' },
    { cle: 'retraitMinimum', libelle: 'Minimum payout per request', valeur: argent(phase.retraitMinimum), statut: st.retraitMinimum, sens: 'The smallest amount a payout request can be.' },
  ]
  return lignes
    .filter((l) => !estIncertain(l.statut))
    .filter((l) => l.valeur != null || (l.statut && l.statut !== 'confirmed'))
    .map((l) => ({
      cle: l.cle,
      libelle: l.libelle,
      valeur: l.statut && l.statut !== 'confirmed' ? null : l.valeur,
      statut: l.statut ?? 'confirmed',
      sens: l.sens,
    }))
}

// Definitions valables quelle que soit la phase, pour le tableau comparatif.
const SENS_COMPARATIF: Record<string, string> = {
  objectifProfit: 'Profit to reach to pass the phase.',
  perteMax: 'Reaching this loss breaches the account. The type says how the limit moves.',
  perteJour: 'Losing more than this in a single day breaches the account. None: no daily limit.',
  joursMin: 'Trading days required before passing, or before a payout once funded.',
  regularite: 'Caps the share of total profit a single day may represent. None: no such rule.',
  maxContrats: 'Largest position size allowed at the same time.',
  partage: 'Your share of the profit you withdraw.',
  plafondRetrait: 'The most a single payout request can be.',
  retraitMinimum: 'The smallest amount a payout request can be.',
}

export interface TableauRegles {
  colonnes: { cle: SheetPhase['phase']; libelle: string }[]
  lignes: {
    cle: string
    libelle: string
    sens: string
    /** Par phase : la valeur, le statut qui la remplace, ou null (ne s'applique pas). */
    cellules: ({ valeur: string | null; statut: Statut } | null)[]
  }[]
}

/**
 * Toutes les phases du plan cote a cote : une colonne par phase reellement
 * presente, une ligne par regle publiee dans au moins une phase.
 */
export function tableauRegles(plan: SheetPlan, programme: SheetProgramme, ordonnees: SheetPhase[]): TableauRegles {
  const parPhase = ordonnees.map((ph) => reglesDePhase(ph, plan.devise))
  const ordre = Object.keys(SENS_COMPARATIF)
  const cles = ordre.filter((cle) => parPhase.some((lignes) => lignes.some((l) => l.cle === cle)))
  return {
    colonnes: ordonnees.map((ph) => ({ cle: ph.phase, libelle: libellePhase(ph, plan, programme) })),
    lignes: cles.map((cle) => {
      const premiere = parPhase.flat().find((l) => l.cle === cle)!
      return {
        cle,
        libelle: premiere.libelle,
        sens: SENS_COMPARATIF[cle],
        cellules: parPhase.map((lignes) => {
          const l = lignes.find((x) => x.cle === cle)
          return l ? { valeur: l.valeur, statut: l.statut } : null
        }),
      }
    }),
  }
}

function versCellule(l: LigneRegle | undefined): Cellule | null {
  if (!l) return null
  return l.statut !== 'confirmed' ? { statut: l.statut } : l.valeur != null ? { texte: l.valeur } : null
}

/** Les six chiffres du resume de selection, chacun pris dans la phase ou il s'applique. */
export function lignesSelection(plan: SheetPlan): { libelle: string; valeur: Cellule }[] {
  const evaluation = plan.phases.find((ph) => ph.phase === 'evaluation') ?? null
  const finance = plan.phases.find((ph) => ph.phase === 'funded') ?? null
  const premiere = evaluation ?? finance
  const trouver = (ph: SheetPhase | null, cle: string) =>
    ph ? versCellule(reglesDePhase(ph, plan.devise).find((l) => l.cle === cle)) : null

  const lignes: { libelle: string; valeur: Cellule | null }[] = [
    { libelle: 'Profit target', valeur: trouver(evaluation, 'objectifProfit') },
    {
      libelle: 'Maximum loss',
      valeur: premiere?.perteMax != null ? { texte: money(premiere.perteMax, plan.devise) } : trouver(premiere, 'perteMax'),
    },
    { libelle: 'Daily loss', valeur: trouver(premiere, 'perteJour') },
    { libelle: 'Maximum positions', valeur: trouver(premiere, 'maxContrats') },
    { libelle: 'Profit split', valeur: trouver(finance, 'partage') },
    { libelle: 'Payout cap', valeur: trouver(finance, 'plafondRetrait') },
  ]
  return lignes.filter((l): l is { libelle: string; valeur: Cellule } => l.valeur != null)
}

// -----------------------------------------------------------------------------
// CARTES TRADING, FEES ET PAYOUTS — filtrees par la selection
// -----------------------------------------------------------------------------
/** Une regle s'applique si son programme, sa taille et sa phase correspondent a la selection. */
export function regleApplicable(r: SheetRegle, programme: SheetProgramme, plan: SheetPlan): boolean {
  if (r.programmes.length > 0 && !r.programmes.includes(programme.slug)) return false
  if (r.tailles.length > 0 && !r.tailles.includes(plan.taille)) return false
  if (r.phase && !plan.phases.some((ph) => ph.phase === r.phase)) return false
  return true
}

/**
 * Les regles d'une carte pour la selection. Les regles bloquantes, puis celles
 * qui portent une reserve, passent en tete : ce sont elles qui changent une
 * decision. L'ordre du tableur est garde a l'interieur de chaque groupe.
 */
export function reglesDeCarte(
  sheet: FirmSheet,
  carte: SheetRegle['carte'],
  programme: SheetProgramme,
  plan: SheetPlan
): SheetRegle[] {
  const poids = (r: SheetRegle) => (r.bloquante ? 0 : r.statut !== 'confirmed' ? 1 : 2)
  // Quand le tableur designe des regles essentielles, seules celles-la s'affichent.
  const tri = sheet.regles.some((r) => r.essentielle)
  return sheet.regles
    .map((r, i) => ({ r, i }))
    .filter(
      ({ r }) =>
        r.carte === carte &&
        (!tri || r.essentielle) &&
        !estIncertain(r.statut) &&
        regleApplicable(r, programme, plan)
    )
    .sort((a, b) => poids(a.r) - poids(b.r) || a.i - b.i)
    .map(({ r }) => r)
}

/**
 * La FAQ de la nouvelle page. Comme faqItems, sauf « How do payouts work? » :
 * recomposee depuis les champs structures (prestataire, methodes, plafonds par
 * plan) plutot que depuis le paragraphe libre de l'onglet Conditions.
 */
export function faqProfil(sheet: FirmSheet): { question: string; reponse: string }[] {
  // 22/09 : une FAQ redigee dans le tableur remplace la FAQ generee. Ses
  // questions s'affichent telles quelles, dans l'ordre de l'onglet.
  const redigees = sheet.faq.filter((q) => q.question && q.reponse)
  if (redigees.length > 0) {
    return redigees.map((q) => ({
      question: q.question.replace(/\[Firm\]/g, sheet.nom),
      reponse: q.reponse.replace(/\[Firm\]/g, sheet.nom),
    }))
  }
  const items = faqItems(sheet)
  const plafonds = sheet.programmes.some((p) => p.plans.some((pl) => pl.phases.some((ph) => ph.plafondRetrait != null)))
  const morceaux = [
    sheet.prestataireRetrait
      ? `Payouts are paid through ${sheet.prestataireRetrait}${
          sheet.methodesRetrait.length > 0 ? ` (${sheet.methodesRetrait.join(', ')})` : ''
        }.`
      : sheet.methodesRetrait.length > 0
        ? `Payout methods: ${sheet.methodesRetrait.join(', ')}.`
        : null,
    plafonds ? 'Each request is capped by program and account size: the configurator shows the cap for your plan.' : null,
    sheet.regles.some((r) => r.carte === 'payouts')
      ? 'Review times, minimums and eligibility conditions are listed in the Payouts card above.'
      : null,
  ].filter(Boolean)
  // Code promo : sans portee verifiee, on dit ce qu'il donne, sans commenter
  // l'incertitude (le prix affiche garde son « ≈ »).
  const o = sheet.offre
  const reponsePromo =
    o && o.portee === 'non_confirmee'
      ? `Code ${o.code} gives ${pct(o.remise)} off. Enter it at checkout; the configurator shows the price with the code applied.`
      : null

  // Regles du 21/09 : la FAQ ne repete ni le configurateur ni le verdict, et ne
  // suggere aucune remise que la page n'affiche pas. La reponse generee pour les
  // debutants ne faisait que renvoyer vers ces deux sections : elle sort, sauf si
  // le tableur en donne une.
  const debutantsSaisie = sheet.faq.some((q) => q.question === QUESTION_DEBUTANTS && q.reponse)
  const questionDebutants = QUESTION_DEBUTANTS.replace(/\[Firm\]/g, sheet.nom)

  // La question des retraits existe des que la fiche sait qui paie et comment,
  // meme si l'onglet Conditions est vide ; elle garde sa place, apres le partage.
  const avecRetraits =
    morceaux.length > 0 && !items.some((q) => q.question === QUESTION_RETRAITS)
      ? (() => {
          const i = items.findIndex((q) => q.question === QUESTIONS_GABARIT[2].replace(/\[Firm\]/g, sheet.nom))
          const ajout = { question: QUESTION_RETRAITS, reponse: '' }
          return i >= 0 ? [...items.slice(0, i + 1), ajout, ...items.slice(i + 1)] : [...items, ajout]
        })()
      : items

  return avecRetraits
    .filter((q) => debutantsSaisie || q.question !== questionDebutants)
    .map((q) =>
      !sheet.offre && q.reponse.startsWith(PREFIXE_REMISE)
        ? { ...q, reponse: `Public prices — ${q.reponse.slice(PREFIXE_REMISE.length)}` }
        : q
    )
    .map((q) =>
      q.question === QUESTION_RETRAITS && morceaux.length > 0
        ? { question: q.question, reponse: morceaux.join(' ') }
        : q.question === QUESTION_PROMO && reponsePromo
          ? { question: q.question, reponse: reponsePromo }
          : q
    )
}

export interface LigneFrais {
  libelle: string
  valeur: string
  note: string | null
}

/** Carte Fees : reset et activation du plan, puis les couts propres au programme. */
export function fraisDeSelection(sheet: FirmSheet, programme: SheetProgramme, plan: SheetPlan): LigneFrais[] {
  const lignes: LigneFrais[] = []
  if (plan.fraisReset != null) lignes.push({ libelle: 'Reset after a breach', valeur: money(plan.fraisReset, plan.devise), note: null })
  if (plan.fraisActivation != null) {
    lignes.push({
      libelle: 'Funded account activation',
      valeur: plan.fraisActivation === 0 ? 'None' : money(plan.fraisActivation, plan.devise),
      note: null,
    })
  }
  for (const c of sheet.couts) {
    if (c.programmes.length > 0 && !c.programmes.includes(programme.slug)) continue
    lignes.push({ libelle: c.libelle, valeur: c.montant ?? '—', note: c.note })
  }
  return lignes
}

/** Carte Payouts : partage, plafond et minimum de la phase financee du plan choisi. */
export function retraitsDeSelection(plan: SheetPlan): { libelle: string; valeur: Cellule }[] {
  const finance = plan.phases.find((ph) => ph.phase === 'funded')
  if (!finance) return []
  const lignes = reglesDePhase(finance, plan.devise)
  const garder: [string, string][] = [
    ['partage', 'Profit split'],
    ['plafondRetrait', 'Cap per request'],
    ['retraitMinimum', 'Minimum per request'],
  ]
  return garder
    .map(([cle, libelle]) => ({ libelle, valeur: versCellule(lignes.find((l) => l.cle === cle)) }))
    .filter((l): l is { libelle: string; valeur: Cellule } => l.valeur != null)
}
