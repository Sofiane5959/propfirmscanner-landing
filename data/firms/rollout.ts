// =============================================================================
// BASCULE DU PILOTE FirmProfilePage                    data/firms/rollout.ts
// =============================================================================
// Une firme listee ici, dans une langue listee, est rendue par la nouvelle page
// universelle (components/prop-firm/profile/FirmProfilePage). Retirer sa ligne
// remet, au deploiement suivant, la page qu'elle avait avant :
// UniversalFirmPage si elle a une fiche, sinon l'ancien rendu.
//
// Ecrit a la main : ce n'est pas une donnee de firme, xlsx_to_firm.py n'y
// touche pas.
//
// TOUTES est le joker : la fiche sert alors chaque langue. Decision de Sofiane
// le 27/09/2026 — mieux vaut la nouvelle page en anglais sur /fr que l'ancienne
// page, meme traduite. Le contenu des fiches et les libelles du composant sont
// en anglais : /fr, /de, /es… affichent donc une page anglaise tant que la
// traduction n'est pas faite.
// =============================================================================

export const TOUTES = '*'

export const FIRM_PROFILE_ROLLOUT: Readonly<Record<string, readonly string[]>> = {
  futureselite: [TOUTES],
  ftmo: [TOUTES],
  earn2trade: [TOUTES],
  the5ers: [TOUTES],
  'blueberry-funded': [TOUTES],
}

export function profilActif(slug: string, locale: string): boolean {
  const langues = FIRM_PROFILE_ROLLOUT[slug]
  if (!langues) return false
  return langues.includes(TOUTES) || langues.includes(locale)
}
