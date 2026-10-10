// =============================================================================
// LES DEUX PAGES SEO EARN2TRADE — LES DONNEES           lib/earn2trade-guide.ts
// =============================================================================
// /earn2trade-promo-code et /earn2trade-rules affichent les memes chiffres :
// objectif de profit, drawdown de fin de journee, perte du jour, partage,
// retrait minimum. Ils viennent de data/firms/earn2trade.xlsx — jamais d'une
// saisie dans la page. Le jour ou Earn2Trade change un objectif, le tableur le
// change, `npm run firms:build` regenere la fiche, et les deux pages suivent.
//
// Ce fichier n'ajoute AUCUNE donnee que la fiche n'a pas. Quand une valeur
// manque, la fonction renvoie null et la page retire la phrase : c'est la meme
// regle que les fiches firmes.
//
// SERVEUR UNIQUEMENT, comme lib/campagne.ts : il lit la fiche complete, donc
// tout le calendrier de campagnes — dont les fenetres encore sous embargo.
// Un composant client l'embarquerait dans la page.
// =============================================================================

import { FIRM_SHEETS } from '@/data/firms'
import {
  type FirmSheet,
  type SheetCampagne,
  money,
  sizeLabel,
} from '@/lib/firm-sheet'

export const SLUG = 'earn2trade'

/**
 * La date affichee par « Last checked ». A remonter a chaque verification des
 * chiffres sur earn2trade.com (la checklist de Sofiane dit : une fois par mois).
 * Elle est ici, et nulle part ailleurs, pour qu'une seule ligne suffise.
 */
export const VERIFIE_LE = '2026-10-10'

export function verifieLeAffiche(): string {
  return new Date(VERIFIE_LE).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ficheEarn2Trade(): FirmSheet | null {
  return FIRM_SHEETS[SLUG] ?? null
}

/**
 * Le code promo et sa remise, tels que la fiche les porte — et seulement si
 * l'offre est confirmee. Une offre `pending` ne s'affiche pas (regle du depot).
 */
export function offrePubliable(sheet: FirmSheet): { code: string; remise: number } | null {
  const offre = sheet.offre
  if (!offre || offre.statut !== 'confirmed') return null
  return { code: offre.code, remise: Math.round(offre.remise * 100) }
}

/**
 * Les codes de plan tels qu'Earn2Trade les ecrit : TCP25, GAU50.
 *
 * ATTENTION — ils ne se deduisent PAS du slug du lien profond, qui vaut
 * « earn2trade-gm50 » en base. Le code du Gauntlet Mini 50K est GAU50, pas
 * GM50 ; la deduction par analogie a deja coute plusieurs allers-retours
 * (voir CLAUDE.md). Cette table est donc explicite, par programme.
 */
const PREFIXE_CODE: Record<string, string> = {
  tcp: 'TCP',
  'gauntlet-mini': 'GAU',
}

export interface LignePlan {
  /** « TCP25 » — vide quand le programme n'a pas de code connu. */
  code: string | null
  programme: string
  /** « $25K ». */
  taille: string
  tailleBrute: number
  objectif: string | null
  drawdown: string | null
  typeDrawdown: string | null
  perteJour: string | null
  prix: string | null
  /** Slug du plan dans prop_firm_challenges : /api/go ouvre son checkout. */
  lienPlan: string | null
}

/**
 * Le tableau des plans, dans l'ordre de la fiche : Trader Career Path d'abord,
 * Gauntlet Mini ensuite. Une seule phase est lue, l'evaluation : c'est elle
 * qui decide si on passe, et c'est d'elle que parle la page.
 */
export function lignesPlans(sheet: FirmSheet): LignePlan[] {
  const lignes: LignePlan[] = []

  for (const programme of sheet.programmes || []) {
    const prefixe = PREFIXE_CODE[programme.slug] ?? null
    for (const plan of programme.plans || []) {
      const evaluation = (plan.phases || []).find((p) => p.phase === 'evaluation')
      const devise = plan.deviseCompte || plan.devise || 'USD'
      lignes.push({
        code: prefixe ? `${prefixe}${Math.round(plan.taille / 1000)}` : null,
        programme: programme.nom,
        taille: sizeLabel(plan.taille, devise),
        tailleBrute: plan.taille,
        objectif: evaluation?.objectifProfit != null ? money(evaluation.objectifProfit, devise) : null,
        drawdown: evaluation?.perteMax != null ? money(evaluation.perteMax, devise) : null,
        typeDrawdown: evaluation?.typePerteMax ?? null,
        // `perteJour` vaut parfois « aucune » : la firme n'impose pas de limite
        // journaliere. Dire « None » est juste ; afficher un tiret laisserait
        // croire qu'on ne sait pas.
        perteJour:
          evaluation?.perteJour == null
            ? null
            : evaluation.perteJour === 'aucune'
              ? 'None'
              : money(evaluation.perteJour, devise),
        prix: plan.prix != null ? money(plan.prix, plan.devise || 'USD') : null,
        lienPlan: plan.lienPlan ?? null,
      })
    }
  }

  return lignes
}

export function lignePlan(sheet: FirmSheet, code: string): LignePlan | null {
  return lignesPlans(sheet).find((l) => l.code === code) ?? null
}

/** Le plan le moins cher qui porte un lien profond : la sortie par defaut. */
export function planDEntree(sheet: FirmSheet): LignePlan | null {
  const avecPrix = lignesPlans(sheet).filter((l) => l.prix != null && l.lienPlan)
  return avecPrix[0] ?? lignesPlans(sheet)[0] ?? null
}

/**
 * Les campagnes ouvertes a cet instant, la plus courte en premier — donc
 * l'offre du jour avant l'offre du mois. Les fenetres a venir ne sortent pas
 * d'ici : une page qui les afficherait publierait un calendrier confidentiel.
 */
export function campagnesOuvertes(sheet: FirmSheet, maintenant = Date.now()): SheetCampagne[] {
  return (sheet.campagnes || [])
    .filter((c) => (c.statut ?? 'confirmed') === 'confirmed')
    .map((c) => ({ c, debut: new Date(c.debut).getTime(), fin: new Date(c.fin).getTime() }))
    .filter(
      (x) =>
        !Number.isNaN(x.debut) &&
        !Number.isNaN(x.fin) &&
        x.debut <= maintenant &&
        maintenant < x.fin
    )
    .sort((a, b) => a.fin - a.debut - (b.fin - b.debut))
    .map((x) => x.c)
}

/** Le texte d'une regle de la fiche, par son libelle. Null si elle n'y est pas. */
export function regleTexte(sheet: FirmSheet, regle: string): string | null {
  const trouvee = (sheet.regles || []).find(
    (r) => r.regle === regle && (r.statut ?? 'confirmed') === 'confirmed'
  )
  return trouvee?.texte ?? null
}

/**
 * Le partage tel que la fiche le decrit, pris sur la phase financee du plan
 * demande : 80 % au-dessus du seuil, 50 % en dessous. Le taux depend de la
 * TAILLE DU RETRAIT, pas du profit total — c'est la fiche qui le dit, pas nous.
 */
export function partageFinance(
  sheet: FirmSheet,
  code: string
): { haut: number; bas: number | null; seuil: string | null; retraitMinimum: string | null } | null {
  for (const programme of sheet.programmes || []) {
    const prefixe = PREFIXE_CODE[programme.slug] ?? null
    if (!prefixe) continue
    for (const plan of programme.plans || []) {
      if (`${prefixe}${Math.round(plan.taille / 1000)}` !== code) continue
      const finance = (plan.phases || []).find((p) => p.phase === 'funded')
      if (!finance || finance.partage == null) return null
      const devise = plan.deviseCompte || plan.devise || 'USD'
      return {
        haut: Math.round(finance.partage * 100),
        bas: finance.partageBas != null ? Math.round(finance.partageBas * 100) : null,
        seuil: finance.seuilPartage != null ? money(finance.seuilPartage, devise) : null,
        retraitMinimum:
          finance.retraitMinimum != null ? money(finance.retraitMinimum, devise) : null,
      }
    }
  }
  return null
}

/**
 * La regle de regularite de l'evaluation, en fraction (0.3 = 30 %), prise sur
 * le plan demande. La page en tire son exemple chiffre.
 */
export function regularite(sheet: FirmSheet, code: string): number | null {
  for (const programme of sheet.programmes || []) {
    const prefixe = PREFIXE_CODE[programme.slug] ?? null
    if (!prefixe) continue
    for (const plan of programme.plans || []) {
      if (`${prefixe}${Math.round(plan.taille / 1000)}` !== code) continue
      const evaluation = (plan.phases || []).find((p) => p.phase === 'evaluation')
      const valeur = evaluation?.regularite
      return typeof valeur === 'number' ? valeur : null
    }
  }
  return null
}

/** Les nombres bruts d'un plan, pour les exemples chiffres de la page Regles. */
export function nombresPlan(
  sheet: FirmSheet,
  code: string
): { taille: number; objectif: number; drawdown: number; perteJour: number; devise: string } | null {
  for (const programme of sheet.programmes || []) {
    const prefixe = PREFIXE_CODE[programme.slug] ?? null
    if (!prefixe) continue
    for (const plan of programme.plans || []) {
      if (`${prefixe}${Math.round(plan.taille / 1000)}` !== code) continue
      const e = (plan.phases || []).find((p) => p.phase === 'evaluation')
      // Les exemples chiffres de la page Regles ont besoin de trois nombres.
      // Une limite « aucune » n'en est pas un : la page retire l'exemple.
      if (!e || e.objectifProfit == null || e.perteMax == null) return null
      if (typeof e.perteJour !== 'number') return null
      return {
        taille: plan.taille,
        objectif: e.objectifProfit,
        drawdown: e.perteMax,
        perteJour: e.perteJour,
        devise: plan.deviseCompte || plan.devise || 'USD',
      }
    }
  }
  return null
}

export { money, sizeLabel }
