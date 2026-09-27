// GENERE PAR scripts/firms_build.py — ne pas modifier a la main.
// Une entree par fiche data/firms/<slug>.json. Une firme presente ici est
// rendue par la page universelle ; les autres gardent leur rendu actuel.

import type { FirmSheet } from '@/lib/firm-sheet'

import fiche_blueberry_funded from './blueberry-funded.json'
import fiche_earn2trade from './earn2trade.json'
import fiche_ftmo from './ftmo.json'
import fiche_futureselite from './futureselite.json'
import fiche_the5ers from './the5ers.json'

export const FIRM_SHEETS: Record<string, FirmSheet> = {
  'blueberry-funded': fiche_blueberry_funded as unknown as FirmSheet,
  'earn2trade': fiche_earn2trade as unknown as FirmSheet,
  'ftmo': fiche_ftmo as unknown as FirmSheet,
  'futureselite': fiche_futureselite as unknown as FirmSheet,
  'the5ers': fiche_the5ers as unknown as FirmSheet,
}
