// =============================================================================
// FICHES FIGEES POUR L'ANCIENNE PAGE                data/firms/legacy/index.ts
// =============================================================================
// Copie exacte, prise sur `main` le 20 septembre 2026, du JSON que lit
// UniversalFirmPage dans les langues qui ne sont pas encore basculees sur
// FirmProfilePage (data/firms/rollout.ts). Le tableur a depuis ete restructure
// pour la nouvelle page ; sans cette copie, /fr et les autres langues auraient
// perdu des lignes (couts, points forts).
//
// Ecrit a la main, jamais regenere. A supprimer, avec UniversalFirmPage, quand
// toutes les langues de la firme passent sur FirmProfilePage.
// =============================================================================

import type { FirmSheet } from '@/lib/firm-sheet'
import futureselite from './futureselite.json'

export const LEGACY_SHEETS: Record<string, FirmSheet> = {
  futureselite: futureselite as unknown as FirmSheet,
}
