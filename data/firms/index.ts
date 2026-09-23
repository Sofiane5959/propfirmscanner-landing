// GENERE PAR scripts/firms_build.py — ne pas modifier a la main.
// Une entree par fiche data/firms/<slug>.json. Une firme presente ici est
// rendue par la page universelle ; les autres gardent leur rendu actuel.

import type { FirmSheet } from '@/lib/firm-sheet'

import fiche_earn2trade from './earn2trade.json'
import fiche_ftmo from './ftmo.json'
import fiche_futureselite from './futureselite.json'

export const FIRM_SHEETS: Record<string, FirmSheet> = {
  'earn2trade': fiche_earn2trade as unknown as FirmSheet,
  'ftmo': fiche_ftmo as unknown as FirmSheet,
  'futureselite': fiche_futureselite as unknown as FirmSheet,
}
