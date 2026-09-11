// GENERE PAR scripts/xlsx_to_firm.py — ne pas modifier a la main.
// Une entree par fiche data/firms/<slug>.json. Une firme presente ici est
// rendue par la page universelle ; les autres gardent leur rendu actuel.

import type { FirmSheet } from '@/lib/firm-sheet'

import fiche_futureselite from './futureselite.json'

export const FIRM_SHEETS: Record<string, FirmSheet> = {
  'futureselite': fiche_futureselite as unknown as FirmSheet,
}
