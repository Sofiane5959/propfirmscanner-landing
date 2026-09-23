// =============================================================================
// BASCULE DU PILOTE FirmProfilePage                    data/firms/rollout.ts
// =============================================================================
// Une firme listee ici, dans une langue listee, est rendue par la nouvelle page
// universelle (components/prop-firm/profile/FirmProfilePage). Retirer sa ligne
// remet, au deploiement suivant, la page qu'elle avait avant :
// UniversalFirmPage si elle a une fiche, sinon l'ancien rendu.
//
// Ecrit a la main : ce n'est pas une donnee de firme, xlsx_to_firm.py n'y
// touche pas. Pilote : FuturesElite, anglais seulement, apres validation des
// captures.
// =============================================================================

export const FIRM_PROFILE_ROLLOUT: Readonly<Record<string, readonly string[]>> = {
  futureselite: ['en'],
  // 23/09/2026 : FTMO passe sur la nouvelle page pour l'apercu palette-2c.
  // Attention, cette bascule vaut aussi en production des que la branche est
  // fusionnee dans main.
  ftmo: ['en'],
}

export function profilActif(slug: string, locale: string): boolean {
  return FIRM_PROFILE_ROLLOUT[slug]?.includes(locale) ?? false
}
