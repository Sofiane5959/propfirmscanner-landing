// =============================================================================
// L'ORDRE DES PARTENAIRES                                    lib/partenaires.ts
// =============================================================================
// Qui ouvre la liste /compare, et dans quel ordre. Choix commercial de Sofiane
// (28 septembre 2026) : Earn2Trade, FuturesElite, FundingPips, Blueberry
// Funded. Le tri habituel reprend juste apres — un code promo en cours, puis
// un lien d'affiliation sans code, puis le reste.
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
  'funding-pips',
  'blueberry-funded',
]

/** Rang d'une firme dans cette liste ; les autres viennent apres. */
export function rangPartenaire(slug: string): number {
  const rang = PARTENAIRES_EN_TETE.indexOf(slug)
  return rang === -1 ? PARTENAIRES_EN_TETE.length : rang
}
