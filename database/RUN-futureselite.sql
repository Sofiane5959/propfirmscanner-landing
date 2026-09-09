-- =============================================================================
-- FUTURESELITE — TOUT EN UN
-- =============================================================================
-- Un seul copier-coller. Aucun prerequis. Toutes les commandes sont
-- idempotentes : rejouable sans casse.
--
-- OU LE COLLER : supabase.com -> ton projet -> SQL Editor -> New query
--                -> coller -> Run.
--
-- Ce fichier remplit AUSSI les colonnes editoriales JSONB (journey, key_rules,
-- program_guide, cost_timeline, verdict_card, pros, cons). Ce sont elles qui
-- donnent son epaisseur a la page : une section disparait quand sa colonne est
-- NULL. Sans elles, la page reste vide meme apres un import reussi.
-- =============================================================================


-- 1. SAUVEGARDE — lis cette sortie avant de continuer
select * from prop_firms where slug = 'futureselite';
select * from prop_firm_challenges where firm_slug = 'futureselite';


-- 2. Colonnes necessaires (sans effet si elles existent deja)
alter table prop_firms add column if not exists price_currency text default 'USD';
alter table prop_firms add column if not exists data_verified_at timestamptz;
alter table prop_firms add column if not exists data_verified_by text;
alter table prop_firms add column if not exists source_url text;
alter table prop_firms add column if not exists rating_checked_at timestamptz;
alter table prop_firms add column if not exists discount_status text;
alter table prop_firms add column if not exists discount_starts_at timestamptz;
alter table prop_firms add column if not exists max_profit_split integer;
alter table prop_firms add column if not exists translations jsonb;
alter table prop_firms add column if not exists restricted_countries text[];


-- 3. La firme : identite, contenu editorial, listes
update prop_firms set
  name                 = 'FuturesElite',
  category_badge       = 'Futures only',
  headline             = 'Four routes to a funded futures account, evaluation or instant',
  verdict              = 'A futures prop firm built around choice: Elite and Prime run classic evaluations, Nitro targets faster payouts, and Instant funds you the day you buy. Each program carries its own loss limits, consistency rule and payout conditions, so the right one depends less on price than on how you actually trade.',
  description          = 'FuturesElite sells simulated futures accounts across four programs. Elite and Prime are evaluation routes with a one-time fee and no deadline to pass. Nitro and Instant shorten or remove the evaluation entirely, Instant funding you from purchase with no objective to reach. Elite, Nitro and Prime settle at a 90% profit split; Instant pays 80%. Payouts can be requested daily once an account is funded, subject to each program’s own minimum days.

It suits futures traders who already have a method and want to choose the rule set that fits it, rather than accept one. Loss limits are dollar amounts rather than percentages, drawdown is calculated at the end of the day on the evaluation programs, and six platforms are selectable at purchase, including Tradovate, NinjaTrader and Quantower.

The caveat matters more than the pricing. Quantum SRL holds no financial regulator licence, and every account is simulated: performance is hypothetical throughout. The live trading program exists but is a risk-team decision, not an entitlement earned at a fixed number of payouts.',
  website_url          = 'https://futureselite.com',
  affiliate_url        = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  headquarters         = 'Corso G. Matteotti 61, Latina 04100, Italy',
  country              = 'Italy',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italy, no. 03095010595. No financial regulator licence. Demo accounts, hypothetical performance.',
  profit_split         = 80,
  max_profit_split     = 90,
  min_price            = 95,
  max_price            = 569,
  is_futures           = true,
  leverage_forex       = null,
  drawdown_type        = 'End of day',
  time_limit           = 'No time limit',
  payout_frequency     = 'on demand, daily once funded',
  source_url           = 'https://futureselite.com',
  logo_url             = 'https://www.google.com/s2/favicons?domain=futureselite.com&sz=128',
  platforms            = 'Tradovate, NinjaTrader, Quantower, ATAS, WealthCharts, DeepChart',
  assets               = '{"Futures"}'::text[],
  payout_methods       = '{"Rise"}'::text[],
  included_items       = '{"Trading journal and analytics dashboard","No activation fee on the funded account","Six platforms to choose from in the configurator"}'::text[],
  pros                 = '{"90% profit split on Elite, Nitro and Prime; 80% on Instant","Drawdown type differs by program and phase — see the rules table","No daily loss limit on Elite, Nitro and Instant — Prime has one in both phases","No funded consistency rule on Elite and Nitro","No activation fee to unlock the funded account","Payouts available every day once funded","Bundle discounts: the fifth account is free"}'::text[],
  cons                 = '{"No financial regulator licence","Demo accounts, hypothetical performance","Minimum days differ by program; Elite needs 6 profitable days above a size-based threshold before a payout","Per-request payout cap, from $1,000 to $3,000 by account size"}'::text[],
  special_features     = '{"Profit split up to 90% — 80% on Instant","Drawdown type is stated per program and per phase","Prime carries a daily loss limit and a 40% funded consistency rule","No activation fee on the funded account","Bundle discounts: the fifth account is free","Instant accounts available, with no evaluation"}'::text[],
  verdict_card         = '{"title":"Who it suits, and who it does not","body":"FuturesElite bets on generous terms once you are funded: up to a 90% split, daily payouts, and no funded consistency rule on Elite and Nitro. In exchange, the firm is young and is a proprietary trading company rather than a regulated broker.","points":["A high split and frequent payouts, with no waiting period","Elite or Nitro evaluations without a daily loss limit, which leaves room to breathe","A funded account that opens with no activation fee","The option to stack up to ten accounts in parallel"],"counterPoints":["You want a regulated broker: Quantum SRL holds no financial regulator licence.","You want real capital: every account is simulated, and performance stays hypothetical.","You run fully automated systems: AI and bots are prohibited.","You want to withdraw a whole balance at once: each request is capped by account size.","You need a guaranteed route to live trading: it is a risk-team decision, not an entitlement."]}'::jsonb,
  program_guide        = null,
  value_strip          = '[{"title":"Futures only","sub":"Simulated accounts, one-time fee, no monthly subscription"},{"title":"No activation fee","sub":"True on all four programs; reset is optional"},{"title":"No time limit to pass","sub":"No deadline on any evaluation program"},{"title":"Daily payout requests","sub":"Once the program’s own minimum days are met"}]'::jsonb,
  key_rules            = '{"title":"The rules that decide it","intro":"Grouped by what they cost you: losing the account, blocking a payout, or limiting how you trade.","rules":[{"category":"Account-failure rules","title":"Maximum Loss Limit","detail":"Breaching it ends the account. It is the only hard risk boundary on Elite, Nitro and Instant, which carry no daily loss limit; Prime adds one in both phases. Elite and Instant recalculate it once a day on the closing balance, so a floating loss does not trip it until the day closes, while Nitro switches to a trailing-equity calculation once funded.","severity":"hard_breach"},{"category":"Account-failure rules","title":"Positions must close before 16:55 EST","detail":"Overnight holding is not allowed and automatic liquidation may occur. The session runs 18:00 EST to 16:55 EST the following day.","severity":"hard_breach"},{"category":"Account-failure rules","title":"30 days without a trade closes a live account","detail":"Inactivity on a live account is permanent closure, not a suspension.","severity":"hard_breach"},{"category":"Passing or payout blockers","title":"Minimum trading days","detail":"Two counts, not one figure: three trading days to complete the Elite evaluation, then six profitable days before a payout can be requested. They apply to different phases and both hold.","severity":"payout_condition"},{"category":"Passing or payout blockers","title":"Consistency rules differ by program","detail":"Elite and Nitro drop it once funded. Prime keeps a 40% rule on the funded account, and Instant starts at 20%. The Elite sales page shows 40% and 50% side by side without saying which applies.","severity":"payout_condition"},{"category":"Passing or payout blockers","title":"Per-request payout cap","detail":"From $1,000 on a 25K up to $3,000 on a 150K, with a $500 minimum on Elite. Payouts can be requested daily once eligible, through Rise, after KYC.","severity":"payout_condition"},{"category":"Trading restrictions","title":"No fully automated trading","detail":"AI systems and bots are not permitted. Semi-automated assistance is not defined by the firm.","severity":"restriction"},{"category":"Trading restrictions","title":"A stop order is required on every live position","detail":"Applies to live accounts. Protective stops are a stated trader responsibility, not a recommendation.","severity":"restriction"},{"category":"Trading restrictions","title":"How many accounts you can hold at once","detail":"Ten funded accounts overall and five combined across Elite, Custom, Instant and Nitro. The Nitro-only cap is disputed between official sources, so no figure is published here. Buying a bundle does not raise the overall limits.","severity":"restriction"}],"more":["No activation fee on the funded account; reset fees run $79 to $229 by size","No profit buffer required","No time limit to pass, and a one-time fee rather than a subscription","Six platforms selectable at purchase, including Tradovate and NinjaTrader","The fifth account in a bundle is free","Exchange market data and commissions are the trader’s cost on a live account"]}'::jsonb,
  journey              = null,
  cost_timeline        = null,
  translations         = null,
  data_verified_at     = timestamptz '2026-09-07',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'futureselite';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'futureselite';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'futureselite-elite-25k', 'Elite $25K', 'FuturesElite', 'futureselite', '$25K', '1 step', 1000, null, 1250, null, 'End of Day', 'End of Day', 90, 95, null, 'Once funded: 90% split, $1,000 payout cap, payouts available daily, 6 profitable days above $100, no buffer. Reset $79.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite', '$50K', '1 step', 2000, null, 3000, null, 'End of Day', 'End of Day', 90, 153, null, 'Once funded: 90% split, $2,000 payout cap, payouts available daily, 6 profitable days above $150, no buffer. Reset $89.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite', '$100K', '1 step', 3000, null, 6000, null, 'End of Day', 'End of Day', 90, 293, null, 'Once funded: 90% split, $2,500 payout cap, payouts available daily, 6 profitable days above $250, no buffer. Reset $159.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite', '$150K', '1 step', 4500, null, 9000, null, 'End of Day', 'End of Day', 90, 353, null, 'Once funded: 90% split, $3,000 payout cap, payouts available daily, 6 profitable days above $350, no buffer. Reset $229.', 'Minimum trading days, consistency rule, daily loss limit and funded consistency all differ by program. Select a program above to see the rules that apply to it. Fully automated trading and bots are not permitted. The configurator lists scalping as not allowed, without defining it. News trading is allowed during the evaluation and restricted once funded, without a stated event window.', false, null, null, 'one-time', 'usd');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros,
       ((translations -> 'fr') is not null) as a_une_traduction_fr
from prop_firms where slug = 'futureselite';

-- Attendu : 4 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'futureselite' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- LE CODE PROMO. SCANNED donne −20 %, confirmé par e-mail par
-- FuturesElite. Mais un coupon SUMMER s’active seul et donne −25 % : sur
-- l’Elite 25K, 71,25 $ contre 76,00 $. Annoncer le code ferait payer plus
-- cher. discount_code et discount_percent restent nuls, l’UPDATE est
-- préparé en commentaire.
--
-- NITRO, PRIME, INSTANT. Les trois programmes existent mais leur grille
-- est derrière une authentification. Ils ne figurent pas dans
-- program_guide : une option sans prix ni challenge donne un bouton mort
-- dans le configurateur. Nitro : paiements quotidiens, pas de perte
-- journalière. Prime : le moins cher, jusqu’à 10 comptes, 1,5 M$ cumulés.
-- Instant : aucune évaluation, 80 % de partage.
--
-- RÈGLE DE RÉGULARITÉ. La page affiche 40 % et 50 % côte à côte sans dire
-- laquelle s’applique. Décrite en toutes lettres, sans chiffre inventé.
--
-- LOGO. logo_url pointait sur /logos/futureselite.png, fichier jamais créé
-- : la production répondait 404 et la tuile était vide. Corrigé vers la
-- favicon du domaine futureselite.com, qui répond. Leur équipe indique de
-- prendre le logo officiel sur leur profil X : le jour où le fichier
-- existe dans public/logos/, repointer logo_url dessus. Ne jamais pointer
-- une colonne sur un fichier absent.
--
-- TRUSTPILOT. Les compteurs de leur page d’accueil affichent tous zéro. La
-- fiche montrait pourtant « 4,3 — 25 avis », un couple venu du seed
-- initial et rattaché à aucune source. Vérification tentée le 5 septembre
-- 2026 : Trustpilot répond par un contrôle anti-robot, qui n’a pas été
-- contourné. Faute de source, la note est retirée par
-- database/RUN-futureselite-trustpilot.sql. La remettre demande un relevé
-- manuel.
--
-- PRÉSÉLECTION DU PLAN PAR URL. Leur application ne lit que aff, ref,
-- coupon et type. Aucun paramètre de taille. Le lien préremplit
-- l’affiliation et le coupon ; le visiteur choisit son plan sur place.
