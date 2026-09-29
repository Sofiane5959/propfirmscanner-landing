// GENERE PAR scripts/firms_build.py — ne pas modifier a la main.
// L'offre de chaque fiche, telle que l'onglet Offre la decrit. Source des
// remises annoncees dans les listes ; la fiche complete reste data/firms/<slug>.json.

export interface OffreFiche {
  nom: string
  logoUrl: string | null
  code: string
  /** Fraction : 0.5 pour 50 %. */
  remise: number
  expireLe: string | null
  accroche: string | null
  /** Deux ou trois mots pour ce que l'offre donne en plus : « +1 free reset ». */
  bonus: string | null
  /** Le code vaut sur tous les plans : le prix remise peut etre calcule. */
  surTousLesPlans: boolean
  /** Taux d'une campagne datee, qui remplace `remise` jusqu'a `campagneFin`. */
  remiseCampagne: number | null
  campagneFin: string | null
  statut: string
}

export const OFFRES_FICHES: Record<string, OffreFiche> = {
  'blueberry-funded': {
    nom: 'Blueberry Funded',
    logoUrl: 'https://blueberryfunded.com/favicon.ico',
    code: 'SCANNED',
    remise: 0.3,
    expireLe: null,
    accroche: null,
    bonus: null,
    surTousLesPlans: true,
    remiseCampagne: null,
    campagneFin: null,
    statut: 'confirmed',
  },
  'earn2trade': {
    nom: 'Earn2Trade',
    logoUrl: 'https://www.earn2trade.com/apple-touch-icon.png',
    code: 'SCANNED',
    remise: 0.5,
    expireLe: null,
    accroche: 'One free reset comes with it: a second attempt, nothing more to pay. Until Sep 30.',
    bonus: '+1 free reset',
    surTousLesPlans: true,
    remiseCampagne: 0.6,
    campagneFin: '2026-10-01T05:00:00+00:00',
    statut: 'confirmed',
  },
  'futureselite': {
    nom: 'FuturesElite',
    logoUrl: 'https://cdn.prod.website-files.com/690a53b4dc85f8bf1d3328d4/690a53b4dc85f8bf1d332987_Webclip.svg',
    code: 'SCANNED',
    remise: 0.2,
    expireLe: null,
    accroche: null,
    bonus: null,
    surTousLesPlans: false,
    remiseCampagne: null,
    campagneFin: null,
    statut: 'confirmed',
  },
}
