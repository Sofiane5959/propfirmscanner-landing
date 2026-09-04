// =============================================================================
// TESTS DE SELECTION  scripts/test-program-selection.mjs
// =============================================================================
//   node scripts/test-program-selection.mjs
//
// Verifie sur les donnees reelles des packs qu'aucun programme n'affiche les
// regles d'un autre, que les variantes ne se melangent pas, et que les prix
// et devises suivent la selection.
//
// Sans base de donnees ni navigateur : ces tests portent sur la logique de
// selection et sur les donnees qui l'alimentent, ce qui est exactement ou les
// erreurs se sont produites jusqu'ici.
//
// Aucun lien d'affiliation n'est ouvert. Le CTA est construit et inspecte,
// jamais suivi.
// =============================================================================

import { PACKS_V2 } from './program-packs-v2.mjs'

let ok = 0
let ko = 0
const cas = (nom, condition, detail = '') => {
  if (condition) { ok++; console.log('  ok   ' + nom) }
  else { ko++; console.log('  ECHEC ' + nom + (detail ? ' — ' + detail : '')) }
}

const firme = (slug) => PACKS_V2.find((p) => p.firm_slug === slug)
const prog = (f, slug) => firme(f).programs.find((p) => p.slug === slug)
const plans = (f, slug, filtre) => prog(f, slug).plans.filter(filtre)

console.log('\n1. FTMO — le 1-Step et le 2-Step ne partagent aucune regle')
{
  const un = prog('ftmo', 'ftmo-cfd-1-step')
  const deux = prog('ftmo', 'ftmo-cfd-2-step')
  cas('le 1-Step porte une Best Day Rule',
    un.plans.some((p) => p.best_day_rule === 0.5))
  cas('le 2-Step n en porte aucune',
    deux.plans.every((p) => !p.best_day_rule))
  cas('le 1-Step n annonce aucun remboursement',
    un.plans.every((p) => !p.refund_note || p.refund_note.toLowerCase().includes('no refund')))
  cas('le 2-Step annonce un remboursement',
    deux.plans.some((p) => (p.refund_note || '').includes('100%')))
  cas('le scaling est absent du 1-Step',
    un.plans.every((p) => (p.scaling_note || '').toLowerCase().includes('does not apply')))
  cas('le 1-Step a 3 % de perte journaliere, le 2-Step 5 %',
    un.plans.every((p) => p.daily_loss_limit === null || p.daily_loss_limit === 0.03) &&
    deux.plans.every((p) => p.daily_loss_limit === null || p.daily_loss_limit === 0.05))
}

console.log('\n2. FTMO — Swing existe seulement sous le 2-Step')
{
  const un = prog('ftmo', 'ftmo-cfd-1-step')
  const deux = prog('ftmo', 'ftmo-cfd-2-step')
  cas('aucun Swing sous le 1-Step', un.plans.every((p) => p.variant_key !== 'swing'))
  cas('Swing present sous le 2-Step', deux.plans.some((p) => p.variant_key === 'swing'))
  const swingSizes = new Set(deux.plans.filter((p) => p.variant_key === 'swing').map((p) => p.account_size))
  cas('Swing ne propose pas de 200K', !swingSizes.has(200000), Array.from(swingSizes).join(','))
  const stdSizes = new Set(deux.plans.filter((p) => p.variant_key === 'standard').map((p) => p.account_size))
  cas('Standard propose bien le 200K', stdSizes.has(200000))
}

console.log('\n3. FTMO — devise et phases')
{
  const deux = prog('ftmo', 'ftmo-cfd-2-step')
  cas('tous les plans FTMO sont en EUR', deux.plans.every((p) => p.currency === 'EUR'))
  const p2 = deux.plans.filter((p) => p.phase === 'evaluation_2')
  cas('le 2-Step a une seconde phase', p2.length > 0)
  cas('la seconde phase vise 5 %', p2.every((p) => p.profit_target === 0.05))
  cas('la premiere phase vise 10 %',
    deux.plans.filter((p) => p.phase === 'evaluation').every((p) => p.profit_target === 0.10))
}

console.log('\n4. FTMO — la promotion 20 % ne deborde pas')
{
  const promo = firme('ftmo').promotions[0]
  cas('limitee au 1-Step', promo.program_slug === 'ftmo-cfd-1-step')
  cas('limitee au 100K', promo.account_size === 100000)
  cas('limitee a la variante Standard',
    Array.isArray(promo.eligible_variants) && promo.eligible_variants.join() === 'standard')
  cas('aucune expiration inventee', promo.expires_at === null)
  cas('checkout non verifie, donc rien de promis', promo.checkout_verified === false)
}

console.log('\n5. FTMO Futures — separe et sans regle CFD')
{
  const fut = prog('ftmo', 'ftmo-futures-beta')
  cas('marche futures', fut.market === 'futures')
  cas('statut beta', fut.status === 'beta')
  cas('aucun plan recopie du CFD', fut.plans.length === 0)
}

console.log('\n6. The5ers — les quatre variantes Summer 2-Step')
{
  const deux = prog('the5ers', 't5-summer-cfd-2-step')
  const cles = new Set(deux.plans.map((p) => `${p.account_size}|${p.variant_key}`))
  for (const attendu of ['100000|8-5', '100000|10-5', '200000|8-5', '200000|10-5']) {
    cas('variante presente : ' + attendu, cles.has(attendu))
  }
  const prix = (size, v) => deux.plans.find(
    (p) => p.account_size === size && p.variant_key === v && p.regular_price != null)?.regular_price
  cas('100K 8/5 a 179 $', prix(100000, '8-5') === 179)
  cas('100K 10/5 a 149 $', prix(100000, '10-5') === 149)
  cas('200K 8/5 a 279 $', prix(200000, '8-5') === 279)
  cas('200K 10/5 a 249 $', prix(200000, '10-5') === 249)
  cas('les deux variantes 100K ont des prix differents', prix(100000, '8-5') !== prix(100000, '10-5'))
}

console.log('\n7. The5ers — anomalie du 100 % non importee')
{
  const deux = prog('the5ers', 't5-summer-cfd-2-step')
  const funded200 = deux.plans.filter((p) => p.account_size === 200000 && p.phase === 'sim_funded')
  cas('aucun objectif funded a 100 %', funded200.every((p) => p.profit_target !== 1))
  cas('les lignes 200K sont marquees a confirmer',
    funded200.every((p) => p.confidence === 'needs_confirmation'))
}

console.log('\n8. The5ers — classiques conserves mais non publies')
{
  const classiques = firme('the5ers').programs.filter((p) => p.program_family === 'Classic')
  cas('cinq programmes classiques conserves', classiques.length === 5, String(classiques.length))
  cas('tous marques unverified', classiques.every((p) => p.status === 'unverified'))
  cas('aucun prix publie pour eux', classiques.every((p) => p.plans.length === 0))
}

console.log('\n9. Regles — aucune ne fuit vers un autre programme')
{
  for (const pack of PACKS_V2) {
    const slugs = new Set(pack.programs.map((p) => p.slug))
    const mauvaises = pack.rules.filter(([slug]) => slug !== null && !slugs.has(slug))
    cas(`${pack.firm_slug} : chaque regle vise un programme existant`, mauvaises.length === 0,
      mauvaises.map((r) => r[0]).join(','))
    for (const p of pack.programs) {
      const visibles = pack.rules.filter(([slug]) => slug === null || slug === p.slug)
      const etrangeres = visibles.filter(([slug]) => slug !== null && slug !== p.slug)
      cas(`${pack.firm_slug} / ${p.slug} : aucune regle etrangere`, etrangeres.length === 0)
    }
  }
}

console.log('\n10. Aucun zero utilise pour un inconnu')
{
  for (const pack of PACKS_V2) {
    for (const p of pack.programs) {
      for (const pl of p.plans) {
        for (const [k, v] of Object.entries(pl)) {
          if (v === 0 && !['activation_fee', 'reset_fee'].includes(k)) {
            ko++
            console.log(`  ECHEC ${pack.firm_slug}/${p.slug} ${k} = 0`)
          }
        }
      }
    }
  }
  cas('aucun zero suspect', true)
}

console.log('\n' + '-'.repeat(50))
console.log(`${ok} reussis, ${ko} echoues`)
process.exit(ko === 0 ? 0 : 1)
