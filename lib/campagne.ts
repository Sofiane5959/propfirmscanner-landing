// =============================================================================
// LA CAMPAGNE EN COURS                                        lib/campagne.ts
// =============================================================================
// Choisit l'offre datee a mettre en avant sur tout le site. Elle vient des
// fiches (data/firms/<slug>.xlsx, onglet Offre) : rien n'est ecrit ici.
//
// Sont retenues les offres qui sont A LA FOIS :
//   - confirmees par le partenaire (statut « confirmed ») ;
//   - munies d'une date de fin encore a venir — une offre permanente n'a rien
//     d'urgent, elle n'a donc pas sa place dans un bandeau a compte a rebours ;
//   - porteuses d'un code et d'un pourcentage.
// La plus forte remise gagne. A egalite, celle qui se termine le plus tot.
// =============================================================================

import { OFFRES_FICHES } from '@/data/firms/offres'
import { buildAffiliateUrl } from '@/lib/affiliate'
import type { Campagne } from '@/components/CampagneRail'

export function campagneEnCours(locale: string, maintenant = Date.now()): Campagne | null {
  const candidates = Object.entries(OFFRES_FICHES)
    .map(([slug, offre]) => {
      if (offre.statut !== 'confirmed') return null
      // Seule une campagne datee a sa place dans un bandeau a compte a rebours.
      if (offre.remiseCampagne == null || !offre.campagneFin) return null
      const fin = new Date(offre.campagneFin).getTime()
      if (Number.isNaN(fin) || fin <= maintenant) return null
      return { slug, offre: { ...offre, remise: offre.remiseCampagne, expireLe: offre.campagneFin }, fin }
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((a, b) => b.offre.remise - a.offre.remise || a.fin - b.fin)

  const gagnante = candidates[0]
  if (!gagnante) return null
  const { slug, offre } = gagnante
  return {
    slug,
    nom: offre.nom,
    logoUrl: offre.logoUrl,
    code: offre.code,
    remise: offre.remise,
    accroche: offre.accroche,
    finLe: offre.expireLe as string,
    // Meme sortie que les boutons des fiches : /api/go, avec son propre
    // placement pour que les clics du bandeau se mesurent a part. C'est le
    // tunnel qui choisit la destination — y compris le choix de checkout que
    // le partenaire exige pour appliquer le coupon (voir optionParDefaut).
    href: buildAffiliateUrl(slug, { placement: 'campagne_rail', locale }),
  }
}
