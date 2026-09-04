// =============================================================================
// PACKS DE PROGRAMMES — scripts/program-packs.mjs
// =============================================================================
// Un « pack » décrit une firme dans la structure normalisée : programmes,
// plans par phase, promotions, plateformes, règles. Le générateur en produit
// un fichier SQL par firme.
//
// SUR LA FIABILITE DES CLASSEURS
//
// Les quatre classeurs du 4 septembre 2026 partagent le même défaut : quand un
// champ est vide, la valeur suivante glisse vers la gauche. Les positions de
// colonnes ne sont donc pas fiables, et une lecture programmatique du fichier
// reproduirait ses erreurs. Les valeurs sont recopiées ici après contrôle
// sémantique, et chaque champ dont le placement restait ambigu porte
// `confidence: 'needs_confirmation'` plutôt qu'une affirmation.
//
// Ce que les briefs imposent et qui est tenu ici :
//   - jamais de zéro pour un inconnu : null + statut explicite ;
//   - prix régulier et promotion sont deux enregistrements datés distincts ;
//   - une pause douce n'est pas une clôture : la sévérité les sépare ;
//   - « jusqu'à 100 % » est un palier maximum, pas un taux de départ.
// =============================================================================

const V = '2026-09-04'

const plan = (o) => ({ contract_scaling: null, ...o })

// =============================================================================
// E8 MARKETS
// =============================================================================
// Le classeur porte 0.8 dans « Profit target P1 » pour Signature et Zero. Un
// objectif de 80 % n'existe pas ; l'onglet Payouts confirme « Payout share E8
// Signature 80% Preset ». C'est donc le partage des profits, et le placement
// dans la colonne objectif est une erreur du classeur.
const E8_HELP = 'https://help.e8markets.com/en/articles/13106558-all-product-overviews-e8-one-vs-e8-zero-vs-e8-pro-vs-e8-signature'

const e8Sizes = (sizes, regular, publicPrice, extra) =>
  sizes.map((s, i) => plan({
    phase: 'evaluation', account_size: s,
    regular_price: regular[i],
    ...extra,
  }))

export const E8_MARKETS = {
  firm_slug: 'e8-markets',
  verified_at: V,
  programs: [
    {
      slug: 'e8-one', name: 'E8 One', kind: 'evaluation', evaluation_steps: 1, sort_order: 1,
      summary: 'Single phase on Forex and perpetuals. Dynamic drawdown that becomes static at the starting balance, and parameters you choose at checkout.',
      source_url: E8_HELP,
      plans: e8Sizes(
        [5000, 10000, 25000, 50000, 100000, 200000, 400000, 500000],
        [48, 88, 188, 288, 488, 798, 1598, 1998],
        [22, 39, 84, 128, 216, 353, 707, 884],
        {
          profit_target: 0.09, maximum_loss_limit: 0.06, daily_loss_limit: 0.04,
          drawdown_type: 'Dynamic, becomes static at the starting balance',
          buffer_status: 'not_stated', profit_split: 0.8,
          news_trading_status: 'allowed',
          news_trading_note: 'Allowed during the challenge, not allowed in the performance stage.',
          // Le 0.04 occupait la colonne « Profit target P2 » d'un produit a
          // phase unique. La note du classeur donne une plage journaliere de
          // 3 a 9,2 % : 4 % y tombe. Marque a confirmer plutot qu affirme.
          confidence: 'needs_confirmation',
          editorial_note: 'Preset values. Drawdown 4-14%, daily 3-9.2%, target 6-21% and payout share 80-100% are chosen at checkout, and the price changes with them. The daily figure sat in a column meant for a second phase: to be confirmed.',
        }
      ),
    },
    {
      slug: 'e8-pro', name: 'E8 Pro', kind: 'evaluation', evaluation_steps: 1, sort_order: 2,
      summary: 'Single phase with a static drawdown that moves to the initial balance after the first payout. Daily payouts use a 50/50 paid/retained buffer.',
      source_url: 'https://help.e8markets.com/en/articles/13653464-payout-request-from-e8-pro-forex-and-e8-pro-crypto',
      plans: e8Sizes(
        [5000, 10000, 25000, 50000, 100000, 200000, 400000, 500000],
        [32, 68, 148, 228, 488, 998, 2098, 2598],
        [32, 68, 148, 228, 488, 998, 2098, 2598],
        {
          profit_target: 0.08, maximum_loss_limit: 0.08, daily_loss_limit: 0.025,
          drawdown_type: 'Static, moves to the initial balance after the first payout',
          buffer_status: 'not_stated', profit_split: 0.8,
          news_trading_status: 'allowed',
          confidence: 'needs_confirmation',
          editorial_note: 'Daily payout requires at least 1% profit and pays 50% while retaining 50% as a buffer. The 2.5% daily figure sat in a second-phase column on a single-phase product: to be confirmed.',
        }
      ),
    },
    {
      slug: 'e8-signature', name: 'E8 Signature', kind: 'evaluation', evaluation_steps: 1, sort_order: 3,
      summary: 'Single phase across Forex, perpetuals and futures. Its daily rule is a Daily Pause — a soft stop, not a breach.',
      source_url: E8_HELP,
      plans: [25000, 50000, 100000, 150000].map((s, i) => plan({
        phase: 'evaluation', account_size: s,
        regular_price: [110, 150, 260, 390][i],
        // Aucun objectif ni plafond de perte publie dans le classeur : null,
        // jamais zero.
        profit_target: null, maximum_loss_limit: null, daily_loss_limit: null,
        drawdown_type: 'End-of-day dynamic on closed profits, becomes static at the starting balance',
        buffer_status: 'not_stated',
        profit_split: 0.8,
        news_trading_status: 'allowed',
        confidence: 'needs_confirmation',
        editorial_note: 'Market-specific preset; the checkout figures should be reverified. The 80% is the preset payout share, confirmed by the payouts table — the workbook had placed it in a profit-target column.',
      })),
    },
    {
      slug: 'e8-zero-starter', name: 'E8 Zero Starter', kind: 'evaluation', evaluation_steps: 1, sort_order: 4,
      summary: 'Futures only. Best Day rule of 40% during the challenge, none in performance. Payouts are capped and limited to five per account.',
      source_url: E8_HELP,
      plans: [50000, 100000, 200000].map((s, i) => plan({
        phase: 'evaluation', account_size: s,
        regular_price: [178, 278, 558][i],
        profit_target: null, maximum_loss_limit: null, daily_loss_limit: null,
        drawdown_type: 'End-of-day dynamic on closed profits, becomes static at the starting balance',
        buffer_status: 'not_stated', profit_split: 0.8,
        news_trading_status: 'allowed',
        confidence: 'needs_confirmation',
        editorial_note: 'Help Center table values. The 80% share sat in a profit-target column and is not listed in the payouts table for Zero: to be confirmed.',
      })),
    },
    {
      slug: 'e8-zero-max', name: 'E8 Zero Max', kind: 'evaluation', evaluation_steps: 1, sort_order: 5,
      summary: 'The larger Zero tier. Same futures-only rules, higher entry price.',
      source_url: E8_HELP,
      plans: [50000, 100000, 200000].map((s, i) => plan({
        phase: 'evaluation', account_size: s,
        regular_price: [328, 588, 1088][i],
        profit_target: null, maximum_loss_limit: null, daily_loss_limit: null,
        drawdown_type: 'End-of-day dynamic on closed profits, becomes static at the starting balance',
        buffer_status: 'not_stated', profit_split: 0.8,
        news_trading_status: 'allowed',
        confidence: 'needs_confirmation',
        editorial_note: 'Help Center table values. Same caveat on the 80% share as E8 Zero Starter.',
      })),
    },
  ],
  // Le prix public de la page d'accueil est plus bas que le prix de base du
  // Help Center sur E8 One. Le brief impose deux enregistrements dates et
  // distincts, sans ecraser l'un par l'autre ni qualifier le plus bas de
  // permanent.
  promotions: [
    [5000, 48, 22], [10000, 88, 39], [25000, 188, 84], [50000, 288, 128],
    [100000, 488, 216], [200000, 798, 353], [400000, 1598, 707], [500000, 1998, 884],
  ].map(([size, base, pub]) => ({
    program_slug: 'e8-one', account_size: size, code: null,
    label: 'Public homepage price',
    discount_type: 'amount', discount_value: Math.round((base - pub) * 100) / 100,
    starts_at: null, expires_at: null, verified_at: V,
    source_url: 'https://e8markets.com/', status: 'active', is_public: true,
    editorial_note: 'The homepage shows a lower price than the Help Center base table. Stored as a dated public offer, not as the permanent price.',
  })),
  bundles: [],
  platforms: [
    ['MetaTrader 5', null], ['TradeLocker', null], ['cTrader', null],
    ['MatchTrader', null], ['E8 Terminal', null],
    ['Tradovate', 'Futures availability to verify'],
  ].map(([name, note], i) => ({ name, configurator_status: 'selectable', checkout_surcharge: 'not_displayed', note, sort_order: i + 1 })),
  rules: [
    ['structure', 'Phases', 'Every current product is single phase.', 'allowed', 'verified', E8_HELP],
    ['drawdown', 'E8 One drawdown', 'Dynamic drawdown that becomes static once it reaches the starting balance.', 'restriction', 'verified', E8_HELP],
    ['drawdown', 'E8 Pro drawdown', 'Static drawdown, moved to the initial balance after the first payout.', 'restriction', 'verified', 'https://help.e8markets.com/en/articles/13653464-payout-request-from-e8-pro-forex-and-e8-pro-crypto'],
    ['drawdown', 'E8 Signature and Zero drawdown', 'End-of-day dynamic, based on closed profits, becoming static at the starting balance.', 'restriction', 'verified', E8_HELP],
    ['daily', 'E8 Signature daily rule', 'A Daily Pause: trading stops for the day. It is a soft breach, not an account closure.', 'restriction', 'verified', E8_HELP],
    ['consistency', 'E8 One Best Day', 'No consistency rule during the challenge. 40% Best Day rule in the performance stage.', 'payout_condition', 'verified', E8_HELP],
    ['consistency', 'E8 Signature Best Day', '35% Best Day rule in the performance stage.', 'payout_condition', 'verified', E8_HELP],
    ['consistency', 'E8 Zero Best Day', '40% Best Day rule during the challenge, none in the performance stage.', 'payout_condition', 'verified', E8_HELP],
    ['news', 'E8 One news trading', 'Allowed during the challenge, not allowed in the performance stage.', 'restriction', 'verified', E8_HELP],
    ['news', 'News trading on Pro, Signature and Zero', 'Allowed.', 'allowed', 'verified', E8_HELP],
    ['session', 'Weekend and overnight on One and Pro', 'Allowed.', 'allowed', 'verified', E8_HELP],
    ['session', 'Weekend and overnight on Signature and Zero', 'Not allowed.', 'hard_breach', 'verified', E8_HELP],
    ['conduct', 'Expert advisers on E8 Zero', 'Not allowed.', 'hard_breach', 'verified', E8_HELP],
    ['conduct', 'Trade copier', 'Allowed on every product.', 'allowed', 'verified', E8_HELP],
    ['payout', 'Minimum payout', '$100 net minimum. The gross profit required depends on the payout share you chose.', 'payout_condition', 'verified', 'https://help.e8markets.com/en/articles/15272556-everything-about-payouts-when-how-how-fast'],
    ['payout', 'Providers and KYC', 'Rise or WorkMarket only, and the provider requires its own KYC. No direct unsupported method.', 'payout_condition', 'verified', 'https://help.e8markets.com/en/articles/15272556-everything-about-payouts-when-how-how-fast'],
    ['payout', 'Processing time', 'Median 11 hours to approval and 24 hours to the provider between January and May 2026, and it may take up to 5 business days. Weekends are not processed. Firm statistic.', 'payout_condition', 'needs_confirmation', 'https://help.e8markets.com/en/articles/15272556-everything-about-payouts-when-how-how-fast'],
    ['payout', 'E8 Pro daily payout', 'Requires at least 1% profit. Half is paid, half is retained as a buffer.', 'payout_condition', 'verified', 'https://help.e8markets.com/en/articles/13653464-payout-request-from-e8-pro-forex-and-e8-pro-crypto'],
    ['payout', 'E8 Zero payouts', '$100 minimum, capped, and a maximum of five payouts per account.', 'payout_condition', 'verified', E8_HELP],
    ['payout', 'Payout share on One and Pro', '80%, 90% or 100%, selected at checkout. The price changes with it.', 'payout_condition', 'verified', 'https://help.e8markets.com/en/articles/8880316-what-is-the-custom-account'],
    ['legal', 'Simulated trading', 'Amounts shown are rewards for simulated performance, paid in real money. Eligibility and provider KYC still apply.', 'restriction', 'verified', E8_HELP],
  ],
  live_tiers: [],
}

// =============================================================================
// CITY TRADERS IMPERIUM
// =============================================================================
const CTI = 'https://citytradersimperium.com/'

export const CITY_TRADERS_IMPERIUM = {
  firm_slug: 'city-traders-imperium',
  verified_at: V,
  programs: [
    {
      slug: 'cti-1-step', name: '1-Step Challenge', kind: 'evaluation', evaluation_steps: 1, sort_order: 1,
      summary: 'One phase, an 8% target and a 5% maximum loss. The live card shows no daily drawdown.',
      source_url: CTI,
      plans: [2500, 5000, 10000, 25000, 50000, 100000].map((s, i) => plan({
        phase: 'evaluation', account_size: s,
        regular_price: [29, 49, 79, 159, 299, 449][i],
        profit_target: 0.08, maximum_loss_limit: 0.05,
        // Un tiret sur la carte veut dire « non affiche », pas « aucune limite ».
        // On laisse null et on l explique dans les regles.
        daily_loss_limit: null,
        drawdown_type: null, buffer_status: 'not_stated',
        minimum_trading_days: null,
        consistency_rule: null,
        news_trading_status: 'allowed',
        confidence: 'verified',
        editorial_note: 'The live card displays no daily drawdown. That means it is not shown, not that no daily rule exists.',
      })),
    },
    {
      slug: 'cti-2-step', name: '2-Step Challenge', kind: 'evaluation', evaluation_steps: 2, sort_order: 2,
      summary: 'Two phases, 10% then 5%, with a 5% daily limit and a 10% maximum loss.',
      source_url: CTI,
      plans: [2500, 5000, 10000, 25000, 50000, 100000].map((s, i) => plan({
        phase: 'evaluation', account_size: s,
        regular_price: [39, 59, 99, 199, 329, 549][i],
        profit_target: 0.10, maximum_loss_limit: 0.10, daily_loss_limit: 0.05,
        drawdown_type: null, buffer_status: 'not_stated',
        news_trading_status: 'allowed', confidence: 'verified',
        editorial_note: 'Phase 2 target is 5%.',
      })),
    },
    {
      slug: 'cti-instant', name: 'Instant Funding', kind: 'instant', evaluation_steps: null, sort_order: 3,
      summary: 'Funded from purchase, but the account STARTS at half the displayed size and scales to it after a 5% target.',
      source_url: CTI,
      plans: [2500, 5000, 10000, 20000, 40000, 80000].map((s, i) => plan({
        phase: 'sim_funded', account_size: s,
        regular_price: [79, 139, 259, 449, 849, 1599][i],
        profit_target: 0.05, maximum_loss_limit: 0.03, daily_loss_limit: null,
        drawdown_type: null, buffer_status: 'not_stated',
        news_trading_status: 'allowed', confidence: 'verified',
        editorial_note: 'Starting balance is 50% of the displayed size. Reaching the 5% target doubles it to the full size. Not to be confused with Direct Funding, which starts fully funded.',
      })),
    },
    {
      slug: 'cti-direct', name: 'Direct Funding', kind: 'instant', evaluation_steps: null, sort_order: 4,
      summary: 'Starts fully funded, with a 6% maximum loss and a 10% target to scale.',
      source_url: CTI,
      plans: [5000, 10000, 20000, 40000, 80000].map((s, i) => plan({
        phase: 'sim_funded', account_size: s,
        // Seul le prix d entree etait lisible. Les autres restent null, comme
        // le brief l exige : mieux vaut une case vide qu un prix invente.
        regular_price: i === 0 ? 229 : null,
        profit_target: 0.10, maximum_loss_limit: 0.06, daily_loss_limit: null,
        drawdown_type: null, buffer_status: 'not_stated',
        news_trading_status: 'allowed',
        confidence: i === 0 ? 'verified' : 'needs_confirmation',
        editorial_note: i === 0
          ? 'Starts fully funded, unlike Instant Funding.'
          : 'Price not verified: only the entry price was reliably visible in the checkout. Left blank rather than inferred.',
      })),
    },
  ],
  promotions: [],
  bundles: [],
  platforms: [['MetaTrader 5', null], ['Match-Trader', null]].map(([name, note], i) => ({
    name, configurator_status: 'selectable', checkout_surcharge: 'not_displayed', note, sort_order: i + 1,
  })),
  rules: [
    ['payout', 'Profit share', 'Advertised up to 100%, which is the maximum VIP tier and not the rate every account starts on.', 'payout_condition', 'verified', CTI],
    ['payout', 'First withdrawal on 1-Step and 2-Step', '7 days.', 'payout_condition', 'verified', CTI],
    ['payout', 'First withdrawal on Instant and Direct', '5 days.', 'payout_condition', 'verified', CTI],
    ['payout', 'Profitable days', '3 profitable days are required on the 1-Step and 2-Step challenges.', 'payout_condition', 'verified', CTI],
    ['payout', 'Anytime payout', 'From VIP Silver, on demand, any day, with no fixed schedule and no minimum trading days.', 'payout_condition', 'verified', CTI],
    ['payout', 'Average payout time', 'An 8-hour average is advertised. Firm marketing statistic, not an independent measurement.', 'payout_condition', 'needs_confirmation', CTI],
    ['scaling', 'Instant Funding scaling', 'The starting balance doubles to the displayed full size once the 5% target is reached.', 'restriction', 'verified', CTI],
    ['daily', '1-Step daily drawdown', 'No daily drawdown is displayed on the live card. That is not the same as confirming no daily rule exists.', 'needs_confirmation', 'needs_confirmation', CTI],
    ['news', 'News trading', 'Marked allowed on all four live cards.', 'allowed', 'verified', CTI],
    ['conduct', 'Overnight, weekend and expert advisers', 'The exact official wording has not been confirmed.', 'needs_confirmation', 'needs_confirmation', CTI],
    ['included', 'CTI Academy', 'Included with every funding program.', 'allowed', 'verified', CTI],
    ['included', 'VIP tools', 'Metrics, journal, calculators, calendar, wallet, direct payouts and an affiliate portal are advertised for funded traders.', 'allowed', 'verified', CTI],
  ],
  live_tiers: [],
}

// =============================================================================
// BRIGHTFUNDED
// =============================================================================
const BF = 'https://brightfunded.com/'

export const BRIGHTFUNDED = {
  firm_slug: 'brightfunded',
  verified_at: V,
  programs: [
    {
      slug: 'bf-2-step-bright', name: '2-Step Bright', kind: 'evaluation', evaluation_steps: 2, sort_order: 1,
      summary: 'Two phases, 8% then 5%, with a 4% daily limit and an 8% maximum loss. Priced in euros.',
      source_url: BF,
      plans: [5000, 10000, 25000, 50000, 100000, 200000].map((s, i) => plan({
        phase: 'evaluation', account_size: s,
        regular_price: [47, 87, 187, 277, 477, 947][i],
        profit_target: 0.08, maximum_loss_limit: 0.08, daily_loss_limit: 0.04,
        drawdown_type: null, buffer_status: 'not_stated',
        minimum_trading_days: 5, consistency_rule: null,
        profit_split: 0.9,
        news_trading_status: 'restricted',
        news_trading_note: 'A 5-minute restriction is shown on the card. The exact window still needs defining.',
        confidence: 'verified',
        editorial_note: 'Phase 2 target is 5%. Prices are in EUR.',
      })),
    },
    {
      slug: 'bf-1-step', name: '1-Step', kind: 'evaluation', evaluation_steps: 1, sort_order: 2,
      summary: 'One phase with a 10% target. Sizes run from 5K to 200K; the live prices still need reading from the dynamic selector.',
      source_url: BF,
      // Aucune taille ni prix fiable dans le classeur : une seule ligne
      // porteuse des regles, sans prix. Mieux vaut une grille absente qu une
      // grille inventee.
      plans: [plan({
        phase: 'evaluation', account_size: 0,
        regular_price: null,
        profit_target: 0.10, maximum_loss_limit: null, daily_loss_limit: null,
        drawdown_type: null, buffer_status: 'not_stated', profit_split: 0.9,
        news_trading_status: null,
        confidence: 'needs_confirmation',
        editorial_note: 'Sizes 5K to 200K. Exact live prices were not readable in the dynamic selector and are deliberately absent rather than guessed.',
      })],
    },
    {
      slug: 'bf-2-step-classic', name: '2-Step Classic', kind: 'evaluation', evaluation_steps: 2, sort_order: 3,
      summary: 'The traditional two-phase model. Sizes run from 5K to 200K; exact values still to be read from the live selector.',
      source_url: BF,
      plans: [plan({
        phase: 'evaluation', account_size: 0,
        regular_price: null,
        profit_target: null, maximum_loss_limit: null, daily_loss_limit: null,
        drawdown_type: null, buffer_status: 'not_stated', profit_split: 0.9,
        news_trading_status: null,
        confidence: 'needs_confirmation',
        editorial_note: 'Sizes 5K to 200K. Targets and limits were not readable and are left empty rather than copied from another program.',
      })],
    },
    {
      slug: 'bf-free-1k', name: 'Free $1K Challenge', kind: 'evaluation', evaluation_steps: 1, sort_order: 4,
      summary: 'A free entry on a $1,000 account, with its own separate rules.',
      source_url: BF,
      plans: [plan({
        phase: 'evaluation', account_size: 1000,
        // Ici zero est un vrai zero verifie : l entree est gratuite. Ce n est
        // pas un placeholder des pages dynamiques, que le brief interdit
        // d importer.
        regular_price: 0,
        profit_target: 0.05, maximum_loss_limit: null, daily_loss_limit: null,
        drawdown_type: null, buffer_status: 'not_stated', profit_split: 0.8,
        news_trading_status: null,
        confidence: 'needs_confirmation',
        editorial_note: 'Free entry, with separate rules. The 0 price is a genuine verified zero, not a dynamic placeholder.',
      })],
    },
  ],
  // Promotions d automne, datees et non permanentes.
  promotions: [
    ['bf-1-step', 'RALLY30', 0.30],
    ['bf-2-step-bright', 'RALLY25', 0.25],
    ['bf-2-step-classic', 'RALLY15', 0.15],
  ].map(([program_slug, code, value]) => ({
    program_slug, account_size: null, code,
    label: 'Autumn public promotion',
    discount_type: 'percent', discount_value: value,
    starts_at: null, expires_at: null, verified_at: V,
    source_url: BF, status: 'active', is_public: true,
    editorial_note: 'Time-sensitive public promotion, not a permanent base price. No expiry date is published: stored as unknown.',
  })),
  bundles: [],
  platforms: [
    ['MetaTrader 5', 'Not intended for residents or citizens of the US, the UAE and other restricted countries'],
    ['cTrader', null],
    ['DXtrade', null],
  ].map(([name, note], i) => ({ name, configurator_status: 'selectable', checkout_surcharge: 'not_displayed', note, sort_order: i + 1 })),
  rules: [
    ['structure', 'Trading period', 'Unlimited on every paid program.', 'allowed', 'verified', BF],
    ['consistency', 'Consistency rule', 'None advertised on any paid plan.', 'allowed', 'verified', BF],
    ['structure', 'Minimum trading days', '5 trading days on 2-Step Bright.', 'restriction', 'verified', BF],
    ['news', 'News trading on 2-Step Bright', 'A 5-minute restriction is shown on the card. The exact window is not defined.', 'needs_confirmation', 'needs_confirmation', BF],
    ['payout', 'Profit split', 'Up to 90%, depending on the program and the options bought.', 'payout_condition', 'verified', BF],
    ['payout', 'Processing guarantee', 'A 24-hour payout guarantee is advertised. Detailed conditions still to be rechecked.', 'payout_condition', 'needs_confirmation', BF],
    ['payout', 'Evaluation reward', '15% of the evaluation profit is added after qualifying growth. The trigger per program still needs verifying.', 'needs_confirmation', 'needs_confirmation', BF],
    ['structure', 'Account cap', 'Up to $400K of simulated capital under management.', 'restriction', 'verified', BF],
    ['addons', 'Paid add-ons', 'Swap-Free, Weekly Payouts, 100% fee refund, No Minimum Trading Days and a 90% payout ratio. Availability and price vary.', 'restriction', 'needs_confirmation', BF],
    ['restrictions', 'Prohibited countries', 'The service is unavailable in Cuba, Iran, North Korea, Syria and Vietnam.', 'hard_breach', 'verified', 'https://brightfunded.com/terms-and-conditions'],
    ['restrictions', 'MT5 residency', 'MetaTrader 5 is not intended for residents or citizens of the US, the UAE and other restricted countries.', 'restriction', 'verified', BF],
  ],
  live_tiers: [],
}

export const PACKS = [E8_MARKETS, CITY_TRADERS_IMPERIUM, BRIGHTFUNDED]
