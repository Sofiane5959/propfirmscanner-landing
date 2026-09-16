// =============================================================================
// FICHE FIRME — MISE EN FORME DE LA NOUVELLE PAGE        lib/firm-profile.ts
// =============================================================================
// Fonctions pures pour components/prop-firm/profile. Elles mettent en forme la
// fiche (lib/firm-sheet.ts) ; aucune n'ajoute une information qui n'y est pas.
// Une valeur absente avec un statut devient une cellule « statut » ; une
// valeur absente sans statut disparait.
// =============================================================================

import {
  type FirmSheet,
  type SheetOption,
  type SheetPhase,
  type SheetPlan,
  type SheetProgramme,
  type Statut,
  meaningMaxLoss,
  money,
  pct,
} from './firm-sheet'

/** Ce qu'affiche une case : un texte, ou le statut qui explique son absence. */
export type Cellule = { texte: string; statut?: undefined } | { texte?: undefined; statut: StatutManquant }
export type StatutManquant = Exclude<Statut, 'confirmed'>

export function cellule(valeur: string | null | undefined, statut: Statut | null | undefined): Cellule | null {
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
// REGLES D'UNE PHASE
// -----------------------------------------------------------------------------
// Libelles et definitions GENERIQUES : identiques pour toutes les firmes, ils
// definissent la regle sans rien affirmer sur la firme.
export interface LigneRegle {
  cle: string
  libelle: string
  valeur: Cellule
  sens: string
}

export function reglesDePhase(phase: SheetPhase, devise: string): LigneRegle[] {
  const st = phase.statuts ?? {}
  const finance = phase.phase === 'funded'
  const argent = (n: number | null) => (n == null ? null : money(n, devise))

  const perteJour =
    phase.perteJour === 'aucune' ? 'None' : typeof phase.perteJour === 'number' ? money(phase.perteJour, devise) : null
  const regularite =
    phase.regularite === 'aucune'
      ? 'None'
      : typeof phase.regularite === 'number'
        ? pct(phase.regularite)
        : null

  const lignes: (Omit<LigneRegle, 'valeur'> & { valeur: Cellule | null })[] = [
    {
      cle: 'objectifProfit',
      libelle: 'Profit objective',
      valeur: cellule(argent(phase.objectifProfit), st.objectifProfit),
      sens: 'Profit to reach to pass this phase.',
    },
    {
      cle: 'perteMax',
      libelle: 'Maximum loss',
      valeur: cellule(
        phase.perteMax == null
          ? null
          : `${money(phase.perteMax, devise)}${phase.typePerteMax ? ` · ${phase.typePerteMax}` : ''}`,
        st.perteMax
      ),
      sens: meaningMaxLoss(phase.typePerteMax),
    },
    {
      cle: 'perteJour',
      libelle: 'Daily loss',
      valeur: cellule(perteJour, st.perteJour),
      sens:
        phase.perteJour === 'aucune'
          ? 'No daily limit in this phase; the maximum loss still applies.'
          : 'Losing more than this in a single day breaches the account.',
    },
    {
      cle: 'joursMin',
      libelle: 'Minimum days',
      valeur: cellule(phase.joursMin == null ? null : String(phase.joursMin), st.joursMin),
      sens: finance
        ? 'Trading days required before a payout request.'
        : 'Trading days required before the phase can be passed.',
    },
    {
      cle: 'regularite',
      libelle: 'Consistency',
      valeur: cellule(regularite, st.regularite),
      sens:
        phase.regularite === 'aucune'
          ? 'No consistency rule in this phase.'
          : 'Caps the share of total profit a single day may represent, as the firm calculates it.',
    },
    {
      cle: 'maxContrats',
      libelle: 'Maximum positions/contracts',
      valeur: cellule(phase.maxContrats == null ? null : String(phase.maxContrats), st.maxContrats),
      sens: 'Largest position size allowed at the same time.',
    },
    {
      cle: 'partage',
      libelle: 'Profit split',
      valeur: cellule(phase.partage == null ? null : pct(phase.partage), st.partage),
      sens: 'Your share of the profit you withdraw.',
    },
    {
      cle: 'plafondRetrait',
      libelle: 'Payout cap per request',
      valeur: cellule(argent(phase.plafondRetrait), st.plafondRetrait),
      sens: 'The most a single payout request can be.',
    },
    {
      cle: 'retraitMinimum',
      libelle: 'Minimum payout per request',
      valeur: cellule(argent(phase.retraitMinimum), st.retraitMinimum),
      sens: 'The smallest amount a payout request can be.',
    },
  ]
  return lignes.filter((l): l is LigneRegle => l.valeur != null)
}

/** Les chiffres du resume de selection, chacun pris dans la phase ou il s'applique. */
export function lignesSelection(plan: SheetPlan): { libelle: string; valeur: Cellule }[] {
  const devise = plan.devise
  const evaluation = plan.phases.find((ph) => ph.phase === 'evaluation') ?? null
  const finance = plan.phases.find((ph) => ph.phase === 'funded') ?? null
  const premiere = plan.phases[0] ?? null
  const trouver = (ph: SheetPhase | null, cle: string) =>
    ph ? reglesDePhase(ph, devise).find((l) => l.cle === cle)?.valeur ?? null : null

  const lignes: { libelle: string; valeur: Cellule | null }[] = [
    { libelle: 'Profit target', valeur: trouver(evaluation, 'objectifProfit') },
    { libelle: 'Max drawdown', valeur: premiere?.perteMax != null ? { texte: money(premiere.perteMax, devise) } : trouver(premiere, 'perteMax') },
    { libelle: 'Daily loss', valeur: trouver(premiere, 'perteJour') },
    { libelle: 'Max contracts', valeur: trouver(premiere, 'maxContrats') },
    { libelle: 'Profit split', valeur: trouver(finance, 'partage') },
    { libelle: 'Payout cap', valeur: trouver(finance, 'plafondRetrait') },
  ]
  return lignes.filter((l): l is { libelle: string; valeur: Cellule } => l.valeur != null)
}
