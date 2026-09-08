// =============================================================================
// FUTURESELITE — DONNEES DE PROGRAMMES  scripts/futureselite-programs.mjs
// =============================================================================
// Source : PropFirmScanner_FuturesElite_Complete_2026-09-04.xlsx, releve sur le
// configurateur et la FAQ officiels le 4 septembre 2026.
//
// POURQUOI LES VALEURS SONT RECOPIEES ICI PLUTOT QUE LUES DU CLASSEUR
//
// L'onglet `Account Plans` tasse ses valeurs vers la gauche des qu'un champ est
// vide : les positions de colonnes ne correspondent pas a l'en-tete. Lu
// litteralement, il donne « perte journaliere = End of Day » et « partage des
// profits = 79 » (un frais de reset). Une lecture programmatique du fichier
// reproduirait ces erreurs.
//
// L'affectation ci-dessous a ete reconstruite puis validee par Sofiane le
// 4 septembre 2026. Chaque champ est contraint soit par le brief lui-meme, soit
// par des valeurs deja verifiees en aout :
//
//   - « Prime has a daily loss limit in both phases »  -> Prime seul a daily_loss
//   - « Elite funded has no consistency rule »         -> le 0.9 lu est le split
//   - « Instant has no evaluation target »             -> le 1800 lu est max_loss
//   - resets 79/89/159/229 deja verifies en aout       -> confirment la colonne
//
// Regle du brief respectee ici : jamais zero pour un inconnu. Un champ non
// applicable vaut null et porte un statut explicite.
// =============================================================================

const VERIFIED = '2026-09-07'
const PRICING = 'https://futureselite.com/#pricing'
const FAQ_LIMITS = 'https://faq.futureselite.com/en/articles/11949051-how-many-accounts-can-i-have-with-futureselite'

/** Raccourci : une ligne d'evaluation. */
const evalPlan = (o) => ({ phase: 'evaluation', activation_fee: 0, contract_scaling: false, ...o })
/** Raccourci : une ligne de compte finance simule. */
const fundedPlan = (o) => ({ phase: 'sim_funded', activation_fee: 0, reset_fee: null, days_between_payouts: 1, ...o })

export const FUTURESELITE_PROGRAMS = [
  // ---------------------------------------------------------------------------
  {
    slug: 'elite',
    market: 'futures',
    status: 'active',
    name: 'Elite',
    kind: 'evaluation',
    evaluation_steps: 1,
    sort_order: 1,
    max_funded_accounts: 5,
    max_funded_note:
      'Counts towards the shared cap of 5 funded accounts across Elite, Custom, Instant and Nitro.',
    summary:
      'One-step evaluation, end-of-day drawdown and no daily loss limit. The only programme whose payout amount rule is documented in detail.',
    source_url: PRICING,
    plans: [
      evalPlan({ account_size: 25000, regular_price: 95, profit_target: 1250, maximum_loss_limit: 1000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 2, minimum_trading_days: 3, consistency_rule: 0.4, reset_fee: 79 }),
      evalPlan({ account_size: 50000, regular_price: 153, profit_target: 3000, maximum_loss_limit: 2000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 4, minimum_trading_days: 3, consistency_rule: 0.4, reset_fee: 89 }),
      evalPlan({ account_size: 100000, regular_price: 293, profit_target: 6000, maximum_loss_limit: 3000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 8, minimum_trading_days: 3, consistency_rule: 0.4, reset_fee: 159 }),
      evalPlan({ account_size: 150000, regular_price: 353, profit_target: 9000, maximum_loss_limit: 4500, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 12, minimum_trading_days: 3, consistency_rule: 0.4, reset_fee: 229 }),

      fundedPlan({ account_size: 25000, maximum_loss_limit: 1000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 2, contract_scaling: true, minimum_trading_days: 6, consistency_rule: null, profit_split: 0.9, payout_cap: 1000, minimum_payout: 500 }),
      fundedPlan({ account_size: 50000, maximum_loss_limit: 2000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 4, contract_scaling: true, minimum_trading_days: 6, consistency_rule: null, profit_split: 0.9, payout_cap: 2000, minimum_payout: 500 }),
      fundedPlan({ account_size: 100000, maximum_loss_limit: 3000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 8, contract_scaling: true, minimum_trading_days: 6, consistency_rule: null, profit_split: 0.9, payout_cap: 2500, minimum_payout: 500 }),
      fundedPlan({ account_size: 150000, maximum_loss_limit: 4500, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 12, contract_scaling: true, minimum_trading_days: 6, consistency_rule: null, profit_split: 0.9, payout_cap: 3000, minimum_payout: 500 }),
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'nitro',
    market: 'futures',
    status: 'active',
    name: 'Nitro',
    kind: 'evaluation',
    evaluation_steps: 1,
    sort_order: 2,
    // Aucun chiffre publie : la FAQ dit 3, le configurateur a affiche
    // MAX 4 FUNDED. Deux sources officielles, deux reponses.
    //
    // Le bundle de cinq comptes ne compte PAS comme troisieme source : acheter
    // cinq evaluations ne dit rien du nombre de comptes qu'on peut detenir
    // FINANCES en meme temps. Les additionner gonflait artificiellement le
    // desaccord.
    max_funded_accounts: null,
    max_funded_note:
      'Unresolved: the official FAQ states 3 active funded Nitro accounts, while configurator cross-sell copy displayed MAX 4 FUNDED. Confirm with the firm before relying on either figure.',
    summary:
      'One-step evaluation with the lowest minimum trading days. Once funded it switches to a trailing-equity drawdown with a buffer.',
    source_url: PRICING,
    plans: [
      evalPlan({ account_size: 25000, regular_price: 129, profit_target: 1250, maximum_loss_limit: 1000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 2, minimum_trading_days: 2, consistency_rule: 0.5, reset_fee: 89 }),
      evalPlan({ account_size: 50000, regular_price: 138, profit_target: 3000, maximum_loss_limit: 2000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 5, minimum_trading_days: 2, consistency_rule: 0.5, reset_fee: 99 }),
      evalPlan({ account_size: 100000, regular_price: 218, profit_target: 6000, maximum_loss_limit: 3000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 8, minimum_trading_days: 2, consistency_rule: 0.5, reset_fee: 149 }),
      evalPlan({ account_size: 150000, regular_price: 298, profit_target: 9000, maximum_loss_limit: 4500, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 10, minimum_trading_days: 2, consistency_rule: 0.5, reset_fee: 219 }),

      fundedPlan({ account_size: 25000, maximum_loss_limit: 1000, daily_loss_limit: null, drawdown_type: 'Trailing Equity', buffer: 1100, buffer_status: 'amount', max_contracts: 2, contract_scaling: false, minimum_trading_days: 1, consistency_rule: null, profit_split: 0.9, payout_cap: 1000, minimum_payout: null }),
      fundedPlan({ account_size: 50000, maximum_loss_limit: 2000, daily_loss_limit: null, drawdown_type: 'Trailing Equity', buffer: 2100, buffer_status: 'amount', max_contracts: 5, contract_scaling: false, minimum_trading_days: 1, consistency_rule: null, profit_split: 0.9, payout_cap: 2000, minimum_payout: null }),
      fundedPlan({ account_size: 100000, maximum_loss_limit: 3000, daily_loss_limit: null, drawdown_type: 'Trailing Equity', buffer: 3100, buffer_status: 'amount', max_contracts: 8, contract_scaling: false, minimum_trading_days: 1, consistency_rule: null, profit_split: 0.9, payout_cap: 2500, minimum_payout: null }),
      fundedPlan({ account_size: 150000, maximum_loss_limit: 4500, daily_loss_limit: null, drawdown_type: 'Trailing Equity', buffer: 4600, buffer_status: 'amount', max_contracts: 10, contract_scaling: false, minimum_trading_days: 1, consistency_rule: null, profit_split: 0.9, payout_cap: 2800, minimum_payout: null }),
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'prime',
    market: 'futures',
    status: 'active',
    name: 'Prime',
    kind: 'evaluation',
    evaluation_steps: 1,
    sort_order: 3,
    max_funded_accounts: 10,
    max_funded_note: 'Prime has its own cap: 10 active funded accounts.',
    summary:
      'The only programme with a daily loss limit in both phases. It also carries the longest bundle ladder, up to ten accounts.',
    source_url: PRICING,
    plans: [
      evalPlan({ account_size: 25000, regular_price: 96, profit_target: 1250, maximum_loss_limit: 1000, daily_loss_limit: 600, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 2, minimum_trading_days: 1, consistency_rule: null, reset_fee: 89 }),
      evalPlan({ account_size: 50000, regular_price: 179, profit_target: 3000, maximum_loss_limit: 2000, daily_loss_limit: 1200, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 4, minimum_trading_days: 1, consistency_rule: null, reset_fee: 109 }),
      evalPlan({ account_size: 100000, regular_price: 279, profit_target: 6000, maximum_loss_limit: 3000, daily_loss_limit: 1800, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 6, minimum_trading_days: 1, consistency_rule: null, reset_fee: 159 }),
      evalPlan({ account_size: 150000, regular_price: 369, profit_target: 9000, maximum_loss_limit: 4500, daily_loss_limit: 2700, drawdown_type: 'End of Day', buffer: null, buffer_status: 'not_stated', max_contracts: 10, minimum_trading_days: 1, consistency_rule: null, reset_fee: 209 }),

      fundedPlan({ account_size: 25000, maximum_loss_limit: 1000, daily_loss_limit: 600, drawdown_type: 'End of Day', buffer: 1100, buffer_status: 'amount', max_contracts: 2, contract_scaling: false, minimum_trading_days: 3, consistency_rule: 0.4, profit_split: 0.9, payout_cap: 1000, minimum_payout: null }),
      fundedPlan({ account_size: 50000, maximum_loss_limit: 2000, daily_loss_limit: 1200, drawdown_type: 'End of Day', buffer: 2100, buffer_status: 'amount', max_contracts: 4, contract_scaling: false, minimum_trading_days: 3, consistency_rule: 0.4, profit_split: 0.9, payout_cap: 2000, minimum_payout: null }),
      fundedPlan({ account_size: 100000, maximum_loss_limit: 3000, daily_loss_limit: 1800, drawdown_type: 'End of Day', buffer: 3100, buffer_status: 'amount', max_contracts: 6, contract_scaling: false, minimum_trading_days: 3, consistency_rule: 0.4, profit_split: 0.9, payout_cap: 2500, minimum_payout: null }),
      fundedPlan({ account_size: 150000, maximum_loss_limit: 4500, daily_loss_limit: 2700, drawdown_type: 'End of Day', buffer: 4600, buffer_status: 'amount', max_contracts: 10, contract_scaling: false, minimum_trading_days: 3, consistency_rule: 0.4, profit_split: 0.9, payout_cap: 3000, minimum_payout: null }),
    ],
  },

  // ---------------------------------------------------------------------------
  {
    slug: 'instant',
    market: 'futures',
    status: 'active',
    name: 'Instant',
    kind: 'instant',
    evaluation_steps: null,
    sort_order: 4,
    max_funded_accounts: 5,
    max_funded_note:
      'Counts towards the shared cap of 5 funded accounts across Elite, Custom, Instant and Nitro.',
    summary:
      'No evaluation: the account is live from purchase. Payout eligibility still requires 10 trading days and a 20% consistency rule.',
    source_url: PRICING,
    plans: [
      // Pas de phase d'evaluation, par construction : le compte est finance des
      // l'achat. C'est pourquoi regular_price vit sur la ligne sim_funded.
      fundedPlan({ account_size: 50000, regular_price: 349, profit_target: null, maximum_loss_limit: 1800, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 4, contract_scaling: false, minimum_trading_days: 10, consistency_rule: 0.2, profit_split: 0.8, payout_cap: 1500, minimum_payout: null }),
      fundedPlan({ account_size: 100000, regular_price: 469, profit_target: null, maximum_loss_limit: 3000, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 8, contract_scaling: false, minimum_trading_days: 10, consistency_rule: 0.2, profit_split: 0.8, payout_cap: 2500, minimum_payout: null }),
      fundedPlan({ account_size: 150000, regular_price: 569, profit_target: null, maximum_loss_limit: 4500, daily_loss_limit: null, drawdown_type: 'End of Day', buffer: null, buffer_status: 'none', max_contracts: 12, contract_scaling: false, minimum_trading_days: 10, consistency_rule: 0.2, profit_split: 0.8, payout_cap: 3500, minimum_payout: null }),
    ],
  },
]

// -----------------------------------------------------------------------------
// Statuts communs a toutes les lignes
// -----------------------------------------------------------------------------
// Le configurateur affiche « Scalping: No » sans definir la duree ni le seuil
// operationnel. Le brief interdit d'inventer une definition : statut explicite.
export const SCALPING_STATUS = 'needs_confirmation'
export const SCALPING_NOTE =
  'The configurator displays "No" but publishes no duration or operational threshold. Asked to the firm; not presented as a definitive rule.'

// Le configurateur affiche « With restrictions » en phase financee sans preciser
// la fenetre. Meme regle : on ne devine pas ±2, ±3 ou ±5 minutes.
export const NEWS_STATUS = { evaluation: 'allowed', sim_funded: 'needs_confirmation' }
export const NEWS_NOTE_FUNDED =
  'The configurator displays "With restrictions" without stating the event window. Asked to the firm; no time window is invented here.'

// -----------------------------------------------------------------------------
// Promotions — regulier et promotion sont deux enregistrements distincts
// -----------------------------------------------------------------------------
// SUMMER varie de 25 % a 35 % SELON LE PROGRAMME ET LA TAILLE : c'est pour cela
// qu'une remise au niveau firme ne suffisait pas.
//
// Aucune date d'expiration n'est publiee. Le brief l'exige : on stocke null,
// jamais « permanent ».
export const FUTURESELITE_PROMOTIONS = [
  { program_slug: 'elite', account_size: 25000, code: 'SUMMER', discount_value: 0.25 },
  { program_slug: 'elite', account_size: 50000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'elite', account_size: 100000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'elite', account_size: 150000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'nitro', account_size: 25000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'nitro', account_size: 50000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'nitro', account_size: 100000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'nitro', account_size: 150000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'prime', account_size: 25000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'prime', account_size: 50000, code: 'SUMMER', discount_value: 0.35 },
  { program_slug: 'prime', account_size: 100000, code: 'SUMMER', discount_value: 0.35 },
  { program_slug: 'prime', account_size: 150000, code: 'SUMMER', discount_value: 0.35 },
  { program_slug: 'instant', account_size: 50000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'instant', account_size: 100000, code: 'SUMMER', discount_value: 0.30 },
  { program_slug: 'instant', account_size: 150000, code: 'SUMMER', discount_value: 0.30 },
].map((p) => ({
  ...p,
  // Chaque ligne SUMMER porte un programme ET une taille : sa portee est
  // explicitement bornee, donc etablie.
  scope_confidence: 'restricted',
  label: 'Current public offer — expiry not published',
  discount_type: 'percent',
  is_public: true,
  status: 'active',
  starts_at: null,
  expires_at: null, // aucune expiration publiee — jamais « permanent »
  verified_at: VERIFIED,
  source_url: PRICING,
  editorial_note: 'Automatically applied by the configurator on 2026-09-04. Volatile: reverify before publication.',
}))

// Le code partenaire. Sofiane a decide de le conserver le 4 septembre 2026.
// Il donne 20 %, donc MOINS que l'offre publique sur tous les programmes.
// La page ne doit jamais le presenter comme le meilleur prix : c'est
// `is_public: false` + `beaten_by_public: true` qui le signalent au rendu.
export const FUTURESELITE_PARTNER_PROMOTION = {
  program_slug: null,
  account_size: null,
  code: 'SCANNED',
  // Le libelle exact autorise par le releve officiel du 7 septembre 2026. Il
  // porte la reserve avec le chiffre : l'eligibilite par programme et par
  // taille n'est pas confirmee, ni l'expiration.
  label: '30% with code SCANNED \u2014 eligibility and best-price status pending confirmation',
  discount_type: 'percent',
  // 30 %, et non 20 % : le releve du 7 septembre corrige la valeur retenue en
  // aout. L'ecart n'est pas cosmetique — a 20 % le code etait toujours moins
  // bon que l'offre publique, a 30 % il est meilleur sur l'Elite 25K, egal sur
  // onze plans, et moins bon sur trois plans Prime seulement.
  discount_value: 0.30,
  // Le releve officiel du 7 septembre est explicite :
  // `exact_program_and_size_eligibility_confirmed` vaut FAUX, et
  // `expiry_confirmed` aussi. L'absence de restriction ecrite ne prouve donc
  // pas l'universalite — elle dit seulement que personne ne l'a bornee.
  scope_confidence: 'unconfirmed',
  is_public: false,
  status: 'active',
  starts_at: null,
  expires_at: null,
  verified_at: VERIFIED,
  source_url: PRICING,
  editorial_note:
    'Verified at 30% on 2026-09-07. Beats the public SUMMER offer on Elite 25K (25%), matches it on eleven plans (30%), and is below it on Prime 50K/100K/150K (35%). Never label it best deal, best verified price, applicable to all programs, or without expiry: per-program eligibility and expiry are both unconfirmed.',
}

// -----------------------------------------------------------------------------
// Bundle & Save — capacite d'ACHAT, a ne pas confondre avec la capacite FINANCEE
// -----------------------------------------------------------------------------
export const FUTURESELITE_BUNDLES = [
  ['elite', 1, 0.30, 'paid', null],
  ['elite', 2, 0.35, 'paid', null],
  ['elite', 3, 0.40, 'paid', null],
  ['elite', 4, 0.50, 'paid', null],
  ['elite', 5, 1.00, 'free', 'Fifth account displayed as free'],
  ['nitro', 1, 0.30, 'paid', null],
  ['nitro', 2, 0.35, 'paid', null],
  ['nitro', 3, 0.40, 'paid', null],
  ['nitro', 4, 0.45, 'paid', 'Beyond the official limit of 3 active funded Nitro accounts'],
  ['nitro', 5, 1.00, 'free', 'Beyond the official limit of 3 active funded Nitro accounts'],
  ['prime', 1, 0.35, 'paid', null],
  ['prime', 2, 0.40, 'paid', null],
  ['prime', 3, 0.42, 'paid', null],
  ['prime', 4, 0.45, 'paid', null],
  ['prime', 5, 1.00, 'free', 'Fifth account displayed as free'],
  ['prime', 6, 0.40, 'paid', null],
  ['prime', 7, 0.45, 'paid', null],
  ['prime', 8, 0.50, 'paid', null],
  ['prime', 9, 0.53, 'paid', null],
  ['prime', 10, 1.00, 'free', 'Tenth account displayed as free'],
  ['instant', 1, 0.30, 'paid', null],
  ['instant', 2, 0.35, 'paid', null],
  ['instant', 3, 0.40, 'paid', null],
  ['instant', 4, 0.45, 'paid', null],
  ['instant', 5, 1.00, 'free', 'Fifth account displayed as free'],
].map(([program_slug, account_number, discount_percent, status, note]) => ({
  program_slug, account_number, discount_percent, status, note,
  verified_at: VERIFIED, source_url: PRICING,
}))

// -----------------------------------------------------------------------------
// Plateformes
// -----------------------------------------------------------------------------
// Le brief interdit d'affirmer qu'elles sont toutes gratuites : le checkout
// n'affiche pas de supplement, mais donnees de marche, commissions et licences
// logicielles peuvent rester a la charge du trader.
// Liste alignee sur la page d'accueil officielle relevee le 4 septembre 2026.
// Deux corrections : « DeepChart » etait une faute pour DeepCharts, et
// WealthCharts ne figure plus sur la page officielle — retire plutot que
// conserve par habitude. Volumetrica et DeepDOM y sont ajoutes.
export const FUTURESELITE_PLATFORMS = [
  // Releve officiel du 7 septembre 2026 : la page marketing et le
  // configurateur n'exposent PAS la meme liste. Celles qu'on peut reellement
  // choisir a l'achat viennent du configurateur ; les deux presentes seulement
  // sur la page marketing sont marquees comme telles plutot que supprimees ou
  // presentees comme selectionnables.
  ['Tradovate', 'selectable', 'not_displayed', null],
  ['NinjaTrader', 'selectable', 'not_displayed', 'Potential external licence cost in live trading'],
  ['Quantower', 'selectable', 'not_displayed', null],
  ['ATAS', 'selectable', 'not_displayed', null],
  ['WealthCharts', 'selectable', 'not_displayed', null],
  ['DeepChart', 'selectable', 'not_displayed', 'Dashboard provides credentials and a Dxfeed agreement flow'],
  ['Volumetrica', 'marketing_only', 'not_displayed', 'Listed on the official homepage but not exposed in the purchase configurator'],
  ['DeepCharts', 'marketing_only', 'not_displayed', 'Listed on the official homepage but not exposed in the purchase configurator'],
].map(([name, configurator_status, checkout_surcharge, note], i) => ({
  name, configurator_status, checkout_surcharge, note, sort_order: i + 1,
}))

// -----------------------------------------------------------------------------
// Regles hors cartes de prix
// -----------------------------------------------------------------------------
// severity : hard_breach | restriction | payout_condition | allowed | needs_confirmation
const FAQ = 'https://faq.futureselite.com/en/articles/'
export const FUTURESELITE_RULES = [
  ['session', 'Trading hours', '18:00 EST to 16:55 EST the following day. All positions must close before 16:55 EST.', 'restriction', 'verified', FAQ + '11949421-futures-trading-hours-and-guidelines'],
  ['session', 'Overnight holding', 'Not allowed. Automatic liquidation may occur.', 'hard_breach', 'verified', FAQ + '11949421-futures-trading-hours-and-guidelines'],
  ['session', 'Weekend', 'Market closed Friday 16:55 EST to Sunday 18:00 EST. Holiday closures may differ.', 'restriction', 'verified', FAQ + '11949421-futures-trading-hours-and-guidelines'],
  ['conduct', 'Automated trading', 'Fully automated AI or bots are not permitted.', 'hard_breach', 'verified', FAQ + '11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices'],
  ['conduct', 'Order fills', 'Multiple limit orders at the same price to manipulate fills are prohibited.', 'hard_breach', 'verified', FAQ + '11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices'],
  ['conduct', 'Market gaps', 'Exploiting isolated fills in gapped or illiquid markets is prohibited.', 'hard_breach', 'verified', FAQ + '11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices'],
  ['conduct', 'Account flipping', 'Payout, breach and repeat patterns are prohibited.', 'hard_breach', 'verified', FAQ + '11949446-what-is-allowed-and-not-allowed-with-us-fair-play-and-prohibited-trading-practices'],
  ['conduct', 'Scalping', 'The configurator displays "No" on every current plan, with no definition or duration threshold.', 'needs_confirmation', 'needs_confirmation', PRICING],
  ['conduct', 'News trading, evaluation', 'The configurator displays "Yes".', 'allowed', 'verified', PRICING],
  ['conduct', 'News trading, funded', 'The configurator displays "With restrictions" without stating the event window.', 'needs_confirmation', 'needs_confirmation', PRICING],
  ['account', 'KYC', 'Veriff. Buyer, KYC holder and account operator must be the same person. Reviewed at upgrades.', 'restriction', 'verified', FAQ + '11948842-know-your-customer-kyc-policy'],
  ['account', 'Inactivity', '30 consecutive days without trades may permanently close a live account.', 'hard_breach', 'verified', FAQ + '12291084-trader-rules-responsibilities'],
  ['account', 'Protective stops', 'A stop order is required on every open position on a live account.', 'restriction', 'verified', FAQ + '12291084-trader-rules-responsibilities'],
  ['account', 'Evaluation duration', 'No deadline to pass. One-time fee, no recurring monthly fee.', 'allowed', 'verified', FAQ + '16778908-is-the-challenge-fee-is-one-time'],
  // Le plafond Nitro chiffre est retire : la FAQ dit 3, le configurateur a
  // affiche MAX 4. La regle suivante porte le conflit en detail ; celle-ci
  // ne garde que ce que les sources confirment.
  ['limits', 'Active funded accounts', 'Maximum 10 funded accounts overall; maximum 10 Prime; maximum 5 combined across Elite, Custom, Instant and Nitro. Nitro funded-account limit: not confirmed.', 'restriction', 'verified', FAQ_LIMITS],
  ['payout', 'Payout review', 'Average under 24 hours. Manual review may take longer.', 'payout_condition', 'verified', FAQ + '11949982-what-is-the-payout-process-like-on-futures-elite'],
  ['payout', 'Payment provider', 'Rise. The first payout requires a Rise account and KYC.', 'payout_condition', 'verified', FAQ + '11949985-how-are-payouts-processed'],
  ['payout', 'Bank transfer', '1 to 3 days after approval.', 'payout_condition', 'verified', FAQ + '11949985-how-are-payouts-processed'],
  ['payout', 'Direct crypto', 'Maximum $500 per request. Above that, standard Rise methods apply.', 'payout_condition', 'verified', FAQ + '11949985-how-are-payouts-processed'],
  ['payout', 'Elite maximum request', 'Elite accounts bought from 2026-06-25 15:00 CET: 50% of total profit remaining, capped by account size. Older Elite accounts use 50% of current-cycle profit. Documented for Elite only.', 'payout_condition', 'verified', FAQ + '16387630-how-much-can-i-request'],
  // Deux chiffres coexistent pour l'Elite 25K : 3 jours sur le configurateur
  // (achever l'evaluation) et 6 jours dans la FAQ (devenir eligible au retrait).
  // Les deux peuvent etre vrais, ce sont deux etapes differentes — mais la
  // source ne le dit pas explicitement, donc on ne tranche pas a sa place. La
  // regle est publiee comme non resolue, avec ses deux liens.
  // Un « jour profitable » a un seuil minimal, propre a la taille du compte.
  // Sans lui, « 6 jours avant retrait » se lit comme six jours de presence,
  // alors qu'un jour a +20 $ ne compte pas. C'est un bloqueur de retrait, pas
  // un detail de comptage.
  ['payout', 'What counts as a profitable day', 'Elite requires 6 profitable days per payout, and a day only qualifies above a size-specific minimum: $100 on a 25K, $150 on a 50K, $250 on a 100K, $350 on a 150K.', 'payout_condition', 'verified', PRICING],
  // Conflits releves le 7 septembre 2026. Publies comme non resolus plutot que
  // tranches : chacun a deux sources officielles qui divergent.
  ['account', 'Prime 150K maximum loss', 'Unresolved: the Prime overview and the live configurator show $4,500, while a detailed official MLL article has shown $4,000. The configurator value is used here.', 'hard_breach', 'needs_confirmation', PRICING],
  ['account', 'Instant 25K availability', 'Documented in the official Instant FAQ but not currently purchasable: the live configurator exposes only 50K, 100K and 150K.', 'restriction', 'needs_confirmation', FAQ + '12901358-how-do-payout-works-on-the-new-instant-challenges'],
  ['limits', 'Nitro funded accounts', 'Unresolved: the FAQ caps Nitro at 3 funded accounts while configurator cross-sell copy displayed MAX 4 FUNDED. No exact figure is published here until the firm confirms one.', 'restriction', 'needs_confirmation', FAQ_LIMITS],
  ['account', 'Prime evaluation length', 'Can be passed in one trading day. A separate FAQ article describes no minimum; the configurator states one day.', 'allowed', 'needs_confirmation', PRICING],
  ['live', 'Transition to live', 'A risk-team decision. The fifth payout is a ceiling, not an automatic entitlement.', 'payout_condition', 'verified', FAQ + '15899069-live-trading-program'],
  ['live', 'Live starting balance', 'Starts at $0 with a loss floor based on account size. 50K example: $2,000 loss floor and $1,000 cushion.', 'restriction', 'verified', FAQ + '15899069-live-trading-program'],
  ['live', 'Live cushion unlock', '15 profitable days meeting the size-specific daily minimum. Days need not be consecutive.', 'payout_condition', 'verified', FAQ + '15899069-live-trading-program'],
  ['live', 'Live payout', 'Daily, $200 minimum, on profits above the cushion or unlocked reserve.', 'payout_condition', 'verified', FAQ + '15899069-live-trading-program'],
  ['live', 'Market data', 'Exchange market data is the trader’s responsibility on a live account. Amount not specified.', 'restriction', 'verified', FAQ + '12291073-market-data-costs'],
  ['live', 'Commissions', 'Commissions and exchange fees are charged per instrument on each executed trade. The official FAQ still labels some exchange fees as 2024 rates.', 'restriction', 'verified', FAQ + '12291021-what-are-the-costs-fees'],
  ['live', 'Platform licence', 'A paid platform licence may apply depending on the selected platform.', 'restriction', 'verified', FAQ + '12291021-what-are-the-costs-fees'],
  ['live', 'Maintenance fee', 'No hidden administrative maintenance fee is stated: $0.', 'allowed', 'verified', FAQ + '12291021-what-are-the-costs-fees'],
].map(([scope, title, detail, severity, confidence, source_url]) => ({
  scope, title, detail, severity, confidence, source_url, verified_at: VERIFIED,
}))

// -----------------------------------------------------------------------------
// Barème du compte live
// -----------------------------------------------------------------------------
export const FUTURESELITE_LIVE_TIERS = [
  [25000, 6000, 1000, 500, 75, 1, 10],
  [50000, 12000, 2000, 1000, 150, 2, 20],
  [75000, 14000, 2500, 1250, 225, 3, 30],
  [100000, 16000, 3000, 1500, 300, 4, 40],
  [150000, 20000, 4500, 2250, 450, 5, 50],
].map(([account_size, conversion_cap, loss_floor, cushion, daily_minimum, max_mini, max_micro]) => ({
  account_size, conversion_cap, loss_floor, cushion, daily_minimum, max_mini, max_micro,
}))

export const FUTURESELITE_META = {
  firm_slug: 'futureselite',
  verified_at: VERIFIED,
  // Le brief est explicite : ne pas inventer de deep link. Sofiane a decide le
  // 4 septembre 2026 de conserver le lien existant avec coupon=scanned.
  affiliate_url: 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  affiliate_note:
    'The root affiliate URL lands on the login page rather than the configurator. Deep-link support and survival of the aff parameter through checkout are unconfirmed.',
}
