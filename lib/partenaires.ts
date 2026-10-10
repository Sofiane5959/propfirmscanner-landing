// =============================================================================
// L'ORDRE DES PARTENAIRES                                    lib/partenaires.ts
// =============================================================================
// Qui ouvre la liste /compare, et dans quel ordre. Choix commercial de Sofiane
// (28 septembre 2026) : Earn2Trade, FuturesElite, FTMO, Blueberry Funded.
// Le tri habituel reprend juste apres — un code promo en cours, puis un lien
// d'affiliation sans code, puis le reste.
//
// FTMO a pris la place de FundingPips le meme jour, a la demande de Sofiane.
// Elle n'a pas de code promo : elle passe donc devant des firmes qui en ont
// un, ce que le tri ne ferait pas de lui-meme. FundingPips, elle, retrouve sa
// place a l'anciennete, dans le groupe des codes en cours.
//
// Ce sont les slugs de prop_firms, pas les noms affiches : FundingPips y est
// « funding-pips ». Un slug inconnu de la base est ignore sans rien casser, et
// une firme absente de cette liste garde sa place habituelle.
//
// Pour changer l'ordre, changer cette liste : c'est le seul endroit.
// =============================================================================

export const PARTENAIRES_EN_TETE: readonly string[] = [
  'earn2trade',
  'futureselite',
  'ftmo',
  'blueberry-funded',
]

/** Rang d'une firme dans cette liste ; les autres viennent apres. */
export function rangPartenaire(slug: string): number {
  const rang = PARTENAIRES_EN_TETE.indexOf(slug)
  return rang === -1 ? PARTENAIRES_EN_TETE.length : rang
}

// =============================================================================
// LES PAGES-GUIDES D'UN PARTENAIRE
// =============================================================================
// Certaines firmes ont une page dediee a leur code promo, redigee pour la
// recherche (« earn2trade promo code »). La carte /compare y renvoie : c'est le
// lien interne qui dit a Google quelle page traite du sujet, et au visiteur
// qu'il peut lire les regles avant de payer.
//
// Une table, pas une condition dans le composant : la carte /compare sert les
// 350 firmes du catalogue, et la regle du depot interdit d'y ecrire le nom
// d'une firme. Une firme absente de cette table n'affiche simplement rien.
// =============================================================================

export interface GuidePartenaire {
  /** Chemin sans prefixe de langue — localePath() ajoute la locale. */
  chemin: string
  libelle: string
}

export const GUIDES_PARTENAIRES: Record<string, GuidePartenaire> = {
  earn2trade: { chemin: '/earn2trade-promo-code', libelle: 'Promo code guide' },
}

export function guidePartenaire(slug: string): GuidePartenaire | null {
  return GUIDES_PARTENAIRES[slug] ?? null
}
