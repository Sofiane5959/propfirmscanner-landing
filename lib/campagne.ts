// =============================================================================
// LA CAMPAGNE EN COURS                                        lib/campagne.ts
// =============================================================================
// Choisit l'offre datee a mettre en avant sur tout le site. Elle vient des
// fiches (data/firms/<slug>.xlsx) : rien n'est ecrit ici.
//
// Deux sources, dans cet ordre :
//   1. l'onglet Campagnes — un calendrier de fenetres, la plus courte d'abord.
//      C'est ce qui porte les offres du jour (Earn2Trade, octobre 2026) ;
//   2. a defaut, l'offre elle-meme, quand elle porte un taux de campagne et une
//      date de fin.
// La plus forte remise gagne entre firmes. A egalite, celle qui finit le plus
// tot.
//
// CE FICHIER NE DOIT ETRE IMPORTE QUE PAR DU CODE SERVEUR. Il lit les fiches
// completes, donc tout le calendrier : un composant client l'embarquerait dans
// la page, et les offres a venir — souvent sous embargo — se liraient dans le
// code source. Aujourd'hui : app/[locale]/layout.tsx et compare/page.tsx.
// =============================================================================

import { FIRM_SHEETS } from '@/data/firms'
import { campagneActive } from '@/lib/firm-profile'
import { buildAffiliateUrl } from '@/lib/affiliate'
import type { Campagne } from '@/components/CampagneRail'

interface Candidate {
  slug: string
  nom: string
  logoUrl: string | null
  code: string
  remise: number
  /** Le meilleur taux de la fenetre, quand elle en a plusieurs. */
  remiseMax: number | null
  /** Le plan qui donne ce meilleur taux : c'est la que mene le bouton. */
  planMax: string | null
  accroche: string | null
  bonus: string | null
  fin: number
}

/**
 * Le meilleur taux d'une campagne a paliers, et le plan qui le porte.
 *
 * Une campagne peut donner -70 % sur deux plans et -50 % sur les autres
 * (Black Friday Earn2Trade). Le bandeau annonce alors « up to 70% », et il
 * doit mener a l'un des deux plans concernes — sinon le visiteur tape sur
 * 70 % et arrive sur un checkout a 50 %.
 */
function meilleurPalier(
  fenetre: { remise: number | null; remisesParPlan?: Record<string, number> | null },
  taux: number
): { remiseMax: number | null; planMax: string | null } {
  const paliers = Object.entries(fenetre.remisesParPlan ?? {})
  if (paliers.length === 0) return { remiseMax: null, planMax: null }
  const [plan, max] = paliers.reduce((a, b) => (b[1] > a[1] ? b : a))
  return max > taux ? { remiseMax: max, planMax: plan } : { remiseMax: null, planMax: null }
}

export function campagneEnCours(locale: string, maintenant = Date.now()): Campagne | null {
  const candidates: Candidate[] = []

  for (const [slug, sheet] of Object.entries(FIRM_SHEETS)) {
    const offre = sheet.offre
    if (!offre || offre.statut !== 'confirmed') continue

    // 1. Le calendrier : une fenetre ouverte maintenant.
    const fenetre = campagneActive(sheet, maintenant)
    if (fenetre) {
      const taux = fenetre.remise ?? offre.remise
      candidates.push({
        slug,
        nom: sheet.nom,
        logoUrl: sheet.logoUrl,
        code: offre.code,
        remise: taux,
        ...meilleurPalier(fenetre, taux),
        accroche: fenetre.detail,
        bonus: fenetre.titre,
        fin: new Date(fenetre.fin).getTime(),
      })
      continue
    }

    // 2. Sinon, l'offre elle-meme, si elle porte une campagne datee.
    if (offre.remiseCampagne == null || !offre.campagneFin) continue
    const fin = new Date(offre.campagneFin).getTime()
    if (Number.isNaN(fin) || fin <= maintenant) continue
    candidates.push({
      slug,
      nom: sheet.nom,
      logoUrl: sheet.logoUrl,
      code: offre.code,
      remise: offre.remiseCampagne,
      remiseMax: null,
      planMax: null,
      accroche: offre.accroche,
      bonus: offre.bonus,
      fin,
    })
  }

  candidates.sort((a, b) => b.remise - a.remise || a.fin - b.fin)
  const gagnante = candidates[0]
  if (!gagnante) return null

  return {
    slug: gagnante.slug,
    nom: gagnante.nom,
    logoUrl: gagnante.logoUrl,
    code: gagnante.code,
    remise: gagnante.remise,
    remiseMax: gagnante.remiseMax,
    accroche: gagnante.accroche,
    bonus: gagnante.bonus,
    finLe: new Date(gagnante.fin).toISOString(),
    // Meme sortie que les boutons des fiches : /api/go, avec son propre
    // placement pour que les clics du bandeau se mesurent a part. C'est le
    // tunnel qui choisit la destination — y compris le choix de checkout que
    // le partenaire exige pour appliquer le coupon (voir optionParDefaut).
    // Le plan qui porte le meilleur taux quand il y en a un : « up to 70% »
    // doit ouvrir un checkout a 70 %. Sinon, le tunnel choisit comme d'habitude.
    href: buildAffiliateUrl(gagnante.slug, {
      placement: 'campagne_rail',
      locale,
      challenge: gagnante.planMax ?? undefined,
    }),
  }
}
