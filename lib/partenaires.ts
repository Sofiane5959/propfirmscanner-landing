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
