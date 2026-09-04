// =============================================================================
// PACKS v2 — FTMO et The5ers  scripts/program-packs-v2.mjs
// =============================================================================
// Source : Official_Data_Audit_FTMO_The5ers_2026-09-04.md, relevé sur les sites
// officiels le 4 septembre 2026.
//
// Ce que la v2 permet et que la v1 ne permettait pas :
//   - `variant_key` : Standard et Swing coexistent à la même taille, et les
//     variantes 8/5 et 10/5 du Summer 2-Step 100K aussi ;
//   - `market` : les Futures ne sont plus mélangés aux CFD ;
//   - `program_family` : le Summer Plan reste distinct des programmes classiques ;
//   - `currency` par plan : FTMO facture en EUR, The5ers en USD ;
//   - `phase: 'evaluation_2'` : le second objectif du FTMO 2-Step a enfin une ligne.
//
// Règles tenues : jamais zéro pour un inconnu, jamais une règle d'un programme
// sous un autre, jamais une promotion présentée comme permanente.
// =============================================================================

const V = '2026-09-04'
const FTMO_CMP = 'https://ftmo.com/fr/comparison-table/'
const FTMO_OBJ = 'https://ftmo.com/fr/trading-objectives/'
const T5 = 'https://the5ers.com/'

const plan = (o) => ({ currency: 'USD', ...o })

// =============================================================================
// FTMO
// =============================================================================
// La table de comparaison officielle oppose 1-Step et 2-Step ligne par ligne.
// Deux differences sont celles que les fiches melangent le plus souvent :
// le remboursement et le plan de scaling n'existent QUE sur le 2-Step, la
// Best Day Rule QUE sur le 1-Step.
const ftmoEval = (extra) => plan({
  phase: 'evaluation', currency: 'EUR',
  maximum_loss_limit: 0.10, time_limit: 'Unlimited',
  news_trading_status: 'allowed',
  ...extra,
})

export const FTMO_V2 = {
  firm_slug: 'ftmo',
  verified_at: V,
  programs: [
    {
      slug: 'ftmo-cfd-1-step', name: 'FTMO Challenge 1-Step', market: 'cfd',
      program_family: 'CFD', status: 'active',
      kind: 'evaluation', evaluation_steps: 1, sort_order: 1,
      summary: 'One phase, a 10% target and the highest split of the range. In exchange, a 3% daily loss, a trailing drawdown and a Best Day Rule.',
      source_url: FTMO_CMP,
      plans: [
        ...[10000, 25000, 50000, 100000, 200000].map((s, i) => ftmoEval({
          account_size: s, variant_key: 'standard', variant_label: 'Standard',
          account_type: 'Standard',
          regular_price: [79, 199, 319, 499, 999][i],
          profit_target: 0.10, daily_loss_limit: 0.03,
          drawdown_type: 'End-of-day trailing',
          minimum_trading_days: null,
          // Best Day Rule, pas consistency : elle ne fait pas echouer
          // l'evaluation, elle conditionne sa validation.
          best_day_rule: 0.50, consistency_rule: null,
          profit_split: 0.90,
          refund_note: 'No refund is advertised on the 1-Step.',
          scaling_note: 'The Scaling Plan does not apply to the 1-Step.',
          confidence: 'verified',
        })),
        ...[10000, 25000, 50000, 100000, 200000].map((s) => plan({
          phase: 'sim_funded', currency: 'EUR', account_size: s,
          variant_key: 'standard', variant_label: 'Standard', account_type: 'Standard',
          profit_split: 0.90, maximum_loss_limit: 0.10, daily_loss_limit: 0.03,
          drawdown_type: 'End-of-day trailing',
          scaling_note: 'The Scaling Plan does not apply to the 1-Step.',
          confidence: 'verified',
        })),
      ],
    },
    {
      slug: 'ftmo-cfd-2-step', name: 'FTMO Challenge 2-Step', market: 'cfd',
      program_family: 'CFD', status: 'active',
      kind: 'evaluation', evaluation_steps: 2, sort_order: 2,
      summary: 'Two phases, 10% then 5%, with a wider 5% daily loss and a static drawdown. The only route with a fee refund and the Scaling Plan.',
      source_url: FTMO_CMP,
      plans: [
        // Standard
        ...[10000, 25000, 50000, 100000, 200000].map((s, i) => ftmoEval({
          account_size: s, variant_key: 'standard', variant_label: 'Standard',
          account_type: 'Standard',
          regular_price: [89, 250, 345, 540, 1080][i],
          profit_target: 0.10, daily_loss_limit: 0.05,
          drawdown_type: 'Static',
          minimum_trading_days: 4,
          best_day_rule: null, consistency_rule: null,
          profit_split: 0.80,
          refund_note: '100% of the fee is refunded, subject to conditions.',
          scaling_note: '+25% every four active months, up to $2,000,000 combined.',
          confidence: 'verified',
        })),
        ...[10000, 25000, 50000, 100000, 200000].map((s) => plan({
          phase: 'evaluation_2', currency: 'EUR', account_size: s,
          variant_key: 'standard', variant_label: 'Standard', account_type: 'Standard',
          profit_target: 0.05, maximum_loss_limit: 0.10, daily_loss_limit: 0.05,
          drawdown_type: 'Static', minimum_trading_days: 4, time_limit: 'Unlimited',
          confidence: 'verified',
        })),
        // Swing — n'existe QUE sur le 2-Step, et pas en 200K.
        ...[10000, 25000, 50000, 100000].map((s, i) => ftmoEval({
          account_size: s, variant_key: 'swing', variant_label: 'Swing',
          account_type: 'Swing',
          regular_price: [99, 279, 379, 599][i],
          profit_target: 0.10, daily_loss_limit: 0.05,
          drawdown_type: 'Static', minimum_trading_days: 4,
          best_day_rule: null, consistency_rule: null, profit_split: 0.80,
          overnight_rule: 'Allowed, including on the funded account.',
          weekend_rule: 'Allowed, including on the funded account.',
          refund_note: '100% of the fee is refunded, subject to conditions.',
          scaling_note: '+25% every four active months, up to $2,000,000 combined.',
          confidence: 'verified',
        })),
        ...[10000, 25000, 50000, 100000].map((s) => plan({
          phase: 'evaluation_2', currency: 'EUR', account_size: s,
          variant_key: 'swing', variant_label: 'Swing', account_type: 'Swing',
          profit_target: 0.05, maximum_loss_limit: 0.10, daily_loss_limit: 0.05,
          drawdown_type: 'Static', minimum_trading_days: 4, time_limit: 'Unlimited',
          confidence: 'verified',
        })),
        ...[10000, 25000, 50000, 100000, 200000].map((s) => plan({
          phase: 'sim_funded', currency: 'EUR', account_size: s,
          variant_key: 'standard', variant_label: 'Standard', account_type: 'Standard',
          profit_split: 0.80, maximum_loss_limit: 0.10, daily_loss_limit: 0.05,
          drawdown_type: 'Static',
          scaling_note: '+25% every four active months, up to $2,000,000 combined. Requires 10% net simulated profit, two processed rewards and a positive balance at scale-up.',
          confidence: 'verified',
        })),
        ...[10000, 25000, 50000, 100000].map((s) => plan({
          phase: 'sim_funded', currency: 'EUR', account_size: s,
          variant_key: 'swing', variant_label: 'Swing', account_type: 'Swing',
          profit_split: 0.80, maximum_loss_limit: 0.10, daily_loss_limit: 0.05,
          drawdown_type: 'Static',
          overnight_rule: 'Allowed.', weekend_rule: 'Allowed.',
          scaling_note: '+25% every four active months, up to $2,000,000 combined.',
          confidence: 'verified',
        })),
      ],
    },
    {
      slug: 'ftmo-futures-beta', name: 'FTMO Futures (Beta)', market: 'futures',
      program_family: 'Futures', status: 'beta',
      kind: 'evaluation', evaluation_steps: null, sort_order: 3,
      summary: 'A separate futures product, in beta. Its catalogue and rules are not yet verified, and no CFD rule applies to it.',
      source_url: 'https://ftmo.com/en/futures/',
      // Aucun plan : le brief interdit de recopier les regles CFD dans les
      // Futures. Un programme sans plan s'affiche comme « verification en
      // cours » plutot que d'inventer une grille.
      plans: [],
    },
  ],
  // La promotion 20 % ne vaut QUE pour le 1-Step 100K. Le brief l'exige.
  promotions: [{
    program_slug: 'ftmo-cfd-1-step', account_size: 100000, variant_key: 'standard',
    code: null, label: 'Public offer',
    discount_type: 'percent', discount_value: 0.20,
    starts_at: null, expires_at: null, verified_at: V,
    source_url: 'https://ftmo.com/fr/', status: 'active', is_public: true,
    eligible_markets: ['cfd'], eligible_variants: ['standard'],
    stacking_rule: 'Not documented; assume no stacking.',
    checkout_verified: false, affiliate_exclusive: false,
    editorial_note: 'Observed on the 1-Step $100K only. Not extended to other products without confirmation. No expiry published.',
  }],
  platforms: [], bundles: [], live_tiers: [],
  rules: [
    ['ftmo-cfd-1-step', 'consistency', 'Best Day Rule', 'Your best day must stay under 50% of the profit from winning days. Going over does not fail the evaluation: you keep trading until you are back under.', 'eligibility_condition', 'verified', FTMO_OBJ],
    ['ftmo-cfd-1-step', 'cost', 'No refund', 'FTMO advertises no fee refund on the 1-Step. The 2-Step refund conditions do not apply here.', 'informational', 'verified', FTMO_CMP],
    ['ftmo-cfd-1-step', 'scaling', 'No Scaling Plan', 'The Scaling Plan is a 2-Step feature. It does not apply to the 1-Step.', 'informational', 'verified', FTMO_CMP],
    ['ftmo-cfd-2-step', 'consistency', 'No consistency rule', 'The 2-Step has no Best Day Rule. That rule belongs to the 1-Step.', 'allowed', 'verified', FTMO_CMP],
    ['ftmo-cfd-2-step', 'cost', 'Fee refund', '100% of the challenge fee is refunded, subject to conditions.', 'eligibility_condition', 'verified', FTMO_CMP],
    ['ftmo-cfd-2-step', 'scaling', 'Scaling Plan', '+25% every four active months, up to $2,000,000 combined. Requires 10% net simulated profit, two processed rewards and a positive balance at scale-up.', 'eligibility_condition', 'verified', 'https://ftmo.com/fr/recompense-croissante-et-plan-de-scaling/'],
    [null, 'structure', 'No time limit', 'Neither route has a deadline to pass.', 'allowed', 'verified', FTMO_CMP],
    [null, 'pricing', 'A second price seen on the 100K', 'A value of €439 was also visible on the 2-Step $100K alongside €540. Its scope is unconfirmed and it is not published here.', 'informational', 'needs_confirmation', FTMO_CMP],
    [null, 'market', 'Futures is a separate product', 'FTMO Futures is in beta with its own rules. No CFD rule on this page applies to it.', 'informational', 'needs_confirmation', 'https://ftmo.com/en/futures/'],
  ],
}

// =============================================================================
// THE5ERS
// =============================================================================
export const THE5ERS_V2 = {
  firm_slug: 'the5ers',
  verified_at: V,
  programs: [
    {
      slug: 't5-summer-cfd-1-step', name: 'Summer Plan CFD 1-Step', market: 'cfd',
      program_family: 'Summer Plan', status: 'promotional',
      kind: 'evaluation', evaluation_steps: 1, sort_order: 1,
      summary: 'A promotional one-phase plan on a $100K account, with a 50% daily consistency rule and a 75% split.',
      source_url: T5,
      plans: [
        plan({ phase: 'evaluation', account_size: 100000, regular_price: 249,
          profit_target: 0.10, maximum_loss_limit: 0.06, daily_loss_limit: 0.03,
          consistency_rule: 0.50, leverage: '1:100', time_limit: 'Unlimited',
          confidence: 'verified',
          editorial_note: 'Consistency is measured per day on this plan.' }),
        plan({ phase: 'sim_funded', account_size: 100000,
          profit_split: 0.75, maximum_loss_limit: 0.06, daily_loss_limit: 0.03,
          minimum_payout: 250, payout_cap: 2000, leverage: '1:100',
          refund_note: 'The fee is refunded at the third payout. A 10% bonus is advertised.',
          confidence: 'verified' }),
      ],
    },
    {
      slug: 't5-summer-cfd-2-step', name: 'Summer Plan CFD 2-Step', market: 'cfd',
      program_family: 'Summer Plan', status: 'promotional',
      kind: 'evaluation', evaluation_steps: 2, sort_order: 2,
      summary: 'Four promotional variants: two target sets, 8/5 and 10/5, on $100K and $200K. The cheaper variant asks for the higher first target.',
      source_url: T5,
      plans: [
        // 100K
        plan({ phase: 'evaluation', account_size: 100000, variant_key: '8-5', variant_label: '8% / 5%', target_variant: '8/5',
          regular_price: 179, profit_target: 0.08, maximum_loss_limit: 0.10, daily_loss_limit: 0.03,
          minimum_trading_days: 1, consistency_rule: null, leverage: '1:100', time_limit: 'Unlimited', confidence: 'verified' }),
        plan({ phase: 'evaluation_2', account_size: 100000, variant_key: '8-5', variant_label: '8% / 5%', target_variant: '8/5',
          profit_target: 0.05, maximum_loss_limit: 0.10, daily_loss_limit: 0.03, minimum_trading_days: 1, confidence: 'verified' }),
        plan({ phase: 'sim_funded', account_size: 100000, variant_key: '8-5', variant_label: '8% / 5%', target_variant: '8/5',
          profit_split: 0.80, consistency_rule: 0.50, minimum_payout: 250, payout_cap: 2000, leverage: '1:100',
          refund_note: 'The fee is refunded at the third payout.', confidence: 'verified' }),

        plan({ phase: 'evaluation', account_size: 100000, variant_key: '10-5', variant_label: '10% / 5%', target_variant: '10/5',
          regular_price: 149, profit_target: 0.10, maximum_loss_limit: 0.10, daily_loss_limit: 0.03,
          minimum_trading_days: 1, consistency_rule: null, leverage: '1:100', time_limit: 'Unlimited', confidence: 'verified' }),
        plan({ phase: 'evaluation_2', account_size: 100000, variant_key: '10-5', variant_label: '10% / 5%', target_variant: '10/5',
          profit_target: 0.05, maximum_loss_limit: 0.10, daily_loss_limit: 0.03, minimum_trading_days: 1, confidence: 'verified' }),
        plan({ phase: 'sim_funded', account_size: 100000, variant_key: '10-5', variant_label: '10% / 5%', target_variant: '10/5',
          profit_split: 0.80, consistency_rule: 0.50, minimum_payout: 250, payout_cap: 2000, leverage: '1:100',
          refund_note: 'The fee is refunded at the third payout.', confidence: 'verified' }),

        // 200K
        plan({ phase: 'evaluation', account_size: 200000, variant_key: '8-5', variant_label: '8% / 5%', target_variant: '8/5',
          regular_price: 279, profit_target: 0.08, maximum_loss_limit: 0.10, daily_loss_limit: 0.03,
          minimum_trading_days: 1, consistency_rule: null, leverage: '1:100', time_limit: 'Unlimited', confidence: 'verified' }),
        plan({ phase: 'evaluation_2', account_size: 200000, variant_key: '8-5', variant_label: '8% / 5%', target_variant: '8/5',
          profit_target: 0.05, maximum_loss_limit: 0.10, daily_loss_limit: 0.03, minimum_trading_days: 1, confidence: 'verified' }),
        plan({ phase: 'sim_funded', account_size: 200000, variant_key: '8-5', variant_label: '8% / 5%', target_variant: '8/5',
          profit_split: 0.80, consistency_rule: 0.50, minimum_payout: 250, payout_cap: 3000, leverage: '1:100',
          refund_note: 'The fee is refunded at the third payout.',
          confidence: 'needs_confirmation',
          editorial_note: 'The source site displays 100% as the funded scaling target on the $200K variants. That looks like a rendering fault and is not imported as a rule.' }),

        plan({ phase: 'evaluation', account_size: 200000, variant_key: '10-5', variant_label: '10% / 5%', target_variant: '10/5',
          regular_price: 249, profit_target: 0.10, maximum_loss_limit: 0.10, daily_loss_limit: 0.03,
          minimum_trading_days: 1, consistency_rule: null, leverage: '1:100', time_limit: 'Unlimited', confidence: 'verified' }),
        plan({ phase: 'evaluation_2', account_size: 200000, variant_key: '10-5', variant_label: '10% / 5%', target_variant: '10/5',
          profit_target: 0.05, maximum_loss_limit: 0.10, daily_loss_limit: 0.03, minimum_trading_days: 1, confidence: 'verified' }),
        plan({ phase: 'sim_funded', account_size: 200000, variant_key: '10-5', variant_label: '10% / 5%', target_variant: '10/5',
          profit_split: 0.80, consistency_rule: 0.50, minimum_payout: 250, payout_cap: 3000, leverage: '1:100',
          refund_note: 'The fee is refunded at the third payout.',
          confidence: 'needs_confirmation',
          editorial_note: 'Same rendering anomaly on the funded scaling target for the $200K variants.' }),
      ],
    },
    {
      slug: 't5-summer-futures', name: 'Summer Plan Futures', market: 'futures',
      program_family: 'Summer Plan', status: 'promotional',
      kind: 'evaluation', evaluation_steps: 1, sort_order: 3,
      summary: 'A futures plan with an end-of-day maximum loss, contract limits per size and tighter overnight limits. Passing in a single day is possible.',
      source_url: T5,
      plans: [
        ...[[25000, 69, 2, 20, 1, 10], [50000, 120, 4, 40, 1, 10],
            [100000, 189, 8, 80, 2, 20], [150000, 219, 12, 120, 3, 30]].flatMap(
          ([size, price, mini, micro, onMini, onMicro]) => [
            plan({ phase: 'evaluation', account_size: size, regular_price: price,
              profit_target: 0.06, maximum_loss_limit: 0.04,
              drawdown_type: 'End of day', max_contracts: mini,
              time_limit: 'Unlimited',
              activation_fee: 0,
              scaling_note: 'Scaling up to $500,000.',
              refund_note: 'The fee is refunded at the third payout.',
              editorial_note: `Contract limits: ${mini} mini / ${micro} micro. Overnight: ${onMini} mini / ${onMicro} micro.`,
              confidence: 'verified' }),
            plan({ phase: 'sim_funded', account_size: size,
              profit_target: 0.04, maximum_loss_limit: 0.04,
              drawdown_type: 'End of day', max_contracts: mini,
              overnight_rule: `${onMini} mini / ${onMicro} micro overnight.`,
              scaling_note: 'Scaling up to $500,000.',
              confidence: 'verified' }),
          ]),
      ],
    },
    // Programmes classiques : conserves, marques `unverified`. Le brief
    // interdit de les supprimer avant verification du checkout.
    ...[['t5-high-stakes', 'High Stakes', 4], ['t5-bootcamp', 'Bootcamp', 5],
        ['t5-pro-growth', 'Pro Growth', 6], ['t5-hyper-growth', 'Hyper Growth', 7],
        ['t5-stock-trading', 'Stock Trading', 8]].map(([slug, name, order]) => ({
      slug, name, market: slug === 't5-stock-trading' ? 'stocks' : 'cfd',
      program_family: 'Classic', status: 'unverified',
      kind: 'evaluation', evaluation_steps: null, sort_order: order,
      summary: 'Listed as a classic programme. Its availability at checkout has not been reverified since the Summer Plan launched, so no price or rule is published here.',
      source_url: T5,
      plans: [],
    })),
  ],
  promotions: [],
  platforms: [], bundles: [], live_tiers: [],
  rules: [
    [null, 'promotion', 'Summer Plan expiry', 'No expiry date is published for the Summer Plan. It is a promotional catalogue, not a permanent one.', 'informational', 'needs_confirmation', T5],
    [null, 'catalogue', 'Classic programmes', 'High Stakes, Bootcamp, Pro Growth, Hyper Growth and Stock Trading are listed without prices or rules until their availability at checkout is reverified.', 'informational', 'needs_confirmation', T5],
    ['t5-summer-futures', 'consistency', 'Consistency per position, 40%', 'The futures plan advertises a 40% consistency measured per position. That is not the usual best-day rule, and its exact definition has not been obtained.', 'eligibility_condition', 'needs_confirmation', T5],
    ['t5-summer-cfd-2-step', 'anomaly', 'Funded scaling target shown as 100%', 'The source site displays 100% as the funded scaling target on the $200K variants. Treated as an unresolved rendering anomaly, not as a rule.', 'informational', 'needs_confirmation', T5],
    [null, 'promotion', 'Code GDSWCVRTE7', 'A code is present in our database with unknown origin, scope and validity. It is not published until confirmed to be a discount code, a referral code, or both.', 'informational', 'needs_confirmation', T5],
    [null, 'account', 'Account limits', 'Summer CFD 1-Step allows a maximum of two active accounts. Summer CFD 2-Step allows two $100K accounts or one $200K account.', 'restriction', 'verified', T5],
  ],
}

export const PACKS_V2 = [FTMO_V2, THE5ERS_V2]
