import { type SheetOffre, type SheetPlan, isEstimate, money } from '@/lib/firm-sheet'
import { intervallePrix } from '@/lib/firm-profile'
import { COPY } from './copy'

type PlanPrix = Pick<SheetPlan, 'devise' | 'facturation' | 'intervalle'>

/** « $150 », ou « $150/month » pour un abonnement mensuel. */
export function prixPlan(montant: number, plan: PlanPrix): string {
  return `${money(montant, plan.devise)}${intervallePrix(plan) === 'monthly' ? COPY.price.monthly : ''}`
}

/** Un prix remise : « ≈ » tant que la portee du code n'est pas verifiee au paiement. */
export function prixRemise(montant: number, plan: PlanPrix, offre: SheetOffre): string {
  return `${isEstimate(offre) ? '≈ ' : ''}${prixPlan(montant, plan)}`
}
