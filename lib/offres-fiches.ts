// =============================================================================
// L'OFFRE DES FICHES, APPLIQUEE AUX LISTES                lib/offres-fiches.ts
// =============================================================================
// Une firme servie par sa fiche (data/firms/<slug>.xlsx) a deux sources
// d'offre : le tableur, qui se met a jour au deploiement, et prop_firms, qui
// attend qu'un SQL soit execute. Quand les deux divergent, le visiteur voit un
// bandeau a 60 % au-dessus d'une carte a 50 %.
//
// Le tableur gagne, pour les firmes qui en ont un : c'est la source editable,
// c'est elle qui porte les campagnes datees, et elle revient toute seule au
// taux permanent a l'expiration. La base reste la source pour les ~340 autres
// firmes, qui n'ont pas de fiche.
//
// La lecture passe par data/firms/offres.ts, genere : quelques lignes par
// firme, assez leger pour les composants client. Les fiches completes pesent
// 300 Ko et restent cote serveur.
//
// Rien n'est ecrit ici : tout vient des fiches.
// =============================================================================

import { OFFRES_FICHES } from '@/data/firms/offres'
import { offreDuJour } from '@/lib/firm-profile'

export interface OffreListe {
  discount_code: string | null
  discount_percent: number | null
  discount_expires_at: string | null
}

/** L'offre en vigueur de chaque fiche, a cet instant. */
export function offresDesFiches(maintenant = Date.now()): Record<string, OffreListe> {
  const par_slug: Record<string, OffreListe> = {}
  for (const [slug, brute] of Object.entries(OFFRES_FICHES)) {
    if (brute.statut !== 'confirmed') continue
    const offre = offreDuJour(brute, maintenant)
    const fin = offre.expireLe ? new Date(offre.expireLe).getTime() : null
    if (fin != null && !Number.isNaN(fin) && fin <= maintenant) continue
    par_slug[slug] = {
      discount_code: offre.code,
      discount_percent: Math.round(offre.remise * 100),
      discount_expires_at: offre.expireLe,
    }
  }
  return par_slug
}

/**
 * Recopie ces offres sur les lignes de prop_firms, pour que les cartes, les
 * filtres et les tris disent la meme chose que les fiches. Les firmes sans
 * fiche ressortent telles quelles.
 */
export function appliquerOffresDesFiches<T extends { slug: string }>(
  firms: T[],
  maintenant = Date.now()
): T[] {
  const offres = offresDesFiches(maintenant)
  return firms.map((f) => (offres[f.slug] ? { ...f, ...offres[f.slug] } : f))
}
