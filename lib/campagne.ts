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
  accroche: string | null
  bonus: string | null
  fin: number
}

export function campagneEnCours(locale: string, maintenant = Date.now()): Campagne | null {
  const candidates: Candidate[] = []

  for (const [slug, sheet] of Object.entries(FIRM_SHEETS)) {
    const offre = sheet.offre
    if (!offre || offre.statut !== 'confirmed') continue

    // 1. Le calendrier : une fenetre ouverte maintenant.
    const fenetre = campagneActive(sheet, maintenant)
    if (fenetre) {
      candidates.push({
        slug,
        nom: sheet.nom,
        logoUrl: sheet.logoUrl,
        code: offre.code,
        remise: fenetre.remise ?? offre.remise,
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
    accroche: gagnante.accroche,
    bonus: gagnante.bonus,
    finLe: new Date(gagnante.fin).toISOString(),
    // Meme sortie que les boutons des fiches : /api/go, avec son propre
    // placement pour que les clics du bandeau se mesurent a part. C'est le
    // tunnel qui choisit la destination — y compris le choix de checkout que
    // le partenaire exige pour appliquer le coupon (voir optionParDefaut).
    href: buildAffiliateUrl(gagnante.slug, { placement: 'campagne_rail', locale }),
  }
}
