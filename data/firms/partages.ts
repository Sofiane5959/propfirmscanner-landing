// GENERE PAR scripts/firms_build.py — ne pas modifier a la main.
// Le partage des profits de chaque fiche : ou la firme commence, ou elle
// plafonne. Source des deux chiffres affiches par les cartes.

export interface PartageFiche {
  profitSplit: number | null
  maxProfitSplit: number | null
}

export const PARTAGES_FICHES: Record<string, PartageFiche> = {
  'blueberry-funded': { profitSplit: 80, maxProfitSplit: 85 },
  'earn2trade': { profitSplit: 50, maxProfitSplit: 80 },
  'ftmo': { profitSplit: 80, maxProfitSplit: 90 },
  'futureselite': { profitSplit: 80, maxProfitSplit: 90 },
  'the5ers': { profitSplit: 50, maxProfitSplit: 80 },
}
