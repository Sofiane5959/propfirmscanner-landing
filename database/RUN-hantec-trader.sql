-- =============================================================================
-- HANTEC TRADER — TOUT EN UN
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
select * from prop_firms where slug = 'hantec-trader';
select * from prop_firm_challenges where firm_slug = 'hantec-trader';


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
  name                 = 'Hantec Trader',
  website_url          = 'https://htrader.hmarkets.com/',
  affiliate_url        = 'https://myhtrader.hmarkets.com/purchasechallenge?affiliateId=2766',
  founded_year         = 2023,
  headquarters         = 'Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Mauritius',
  country              = 'Mauritius',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'Hantec Trader Limited, Mauritius company no. C191400. Unregulated: a proprietary trading company. Partner broker: Hantec Markets Limited / Hantec Markets Mauritius.',
  profit_split         = 80,
  max_profit_split     = 95,
  min_price            = 13,
  max_price            = 2139,
  is_futures           = false,
  drawdown_type        = 'Daily loss measured on the higher of balance or equity at the previous day’s close. Overall drawdown trailing or static depending on the programme.',
  time_limit           = 'No time limit, except Instant24: 24 hours from your first trade',
  payout_frequency     = 'on request, decided within 24 business hours',
  source_url           = 'https://htrader.hmarkets.com/',
  logo_url             = '/logos/hantec-trader.png',
  platforms            = 'MetaTrader 4, MetaTrader 5',
  assets               = '{"Forex","Indices","Commodities","Metals","Crypto"}'::text[],
  payout_methods       = '{"Bank transfer","Cryptocurrency","E-wallets"}'::text[],
  restricted_countries = '{"Afghanistan","Australia","Belgium","Congo (Brazzaville)","Congo (Kinshasa)","Czech Republic","Egypt","Germany","Haiti","Iran","Israel","Jordan","Kosovo","Laos","Libya","Malaysia","Myanmar","North Korea","Pakistan","Puerto Rico","Qatar","Romania","Russia","Serbia","Somalia","South Sudan","Taiwan","Thailand","United States","Uzbekistan","Vietnam","Yemen"}'::text[],
  included_items       = '{"MetaTrader 4 and MetaTrader 5","Seven programmes, from instant funding to three steps","95% split add-on available on six programmes"}'::text[],
  pros                 = '{"Seven programmes covering instant, one, two and three steps","Entry from $13 with Instant24","80% split, raised to 95% with the add-on on six programmes","No time limit, except Instant24 by design","Payout decision within 24 business hours for eligible requests","Identified partner broker: Hantec Markets"}'::text[],
  cons                 = '{"Unregulated: a proprietary trading company, not a broker","US traders are not accepted","32 excluded territories, including Germany, Belgium and Australia","News trading is restricted by default, except on Instant24","Scalping can trigger a profit adjustment beyond a threshold","Leverage capped at 1:1 on crypto"}'::text[],
  special_features     = '{"80% split, raised to 95% with the 95% Reward Share add-on","Seven programmes, from Instant24 over 24 hours to Endurance over three steps","Daily loss measured on the higher of the previous day’s balance or equity","News Trading add-on to lift the restriction around releases","Leverage 1:50 on forex, 1:15 on indices and commodities, 1:10 on metals","US traders are not accepted"}'::text[],
  verdict_card         = '{"title":"Who it suits, and who it does not","body":"Hantec Trader offers seven programmes covering almost every profile, from instant funding at $13 to a three-step route. The split starts at 80% and rises to 95% with a paid add-on. In exchange, the firm is unregulated and closes an unusual number of markets.","points":["A choice of seven routes, from instant funding to three steps","A very cheap entry: Instant24 starts at $13","A split raised to 95% if you take the add-on","An identified partner broker, backed by the Hantec Markets group"]}'::jsonb,
  program_guide        = '{"title":"Seven programmes, three families","intro":"The choice starts with the format: funded straight away, or an evaluation over one, two or three steps.","options":[{"name":"Instant Funding","badge":"Funded immediately","summary":"No evaluation, no target. The trade-off is the price: $43 on a 1K, up to $2,139 on a 50K.","points":["From 1K to 50K","No profit target","6% daily loss","6% trailing overall drawdown"]},{"name":"Instant Lite","badge":"Funded, cheaper","summary":"The same idea at a fifth of the price, against a tighter daily loss and 5 winning days per payout cycle.","points":["From 1K to 100K, from $19","3% daily loss","5% overall drawdown","5 winning days per payout cycle"]},{"name":"Instant24","badge":"Twenty-four hours","summary":"The cheapest format in the catalogue: the account lives 24 hours from your first trade. It is also the only programme where news trading is free.","points":["From 2K to 100K, from $13","24 hours from the first trade","2% daily loss","News trading allowed"]},{"name":"Express","badge":"One step","summary":"A single 10% phase, with no minimum days, and a 6% trailing overall drawdown.","points":["From 2K to 200K, from $39","10% target","No minimum days","6% trailing drawdown"]},{"name":"Enhanced","badge":"Two steps","summary":"10% then 5% targets, with the widest daily limit in the catalogue and a static drawdown.","points":["From 5K to 200K, from $59","10% then 5% target","5% daily loss","3 winning days per step"]},{"name":"EnhancedX","badge":"Two steps, no minimum days","summary":"Lower targets than Enhanced, 8% then 4%, and no minimum days, against a tighter daily limit.","points":["From 5K to 200K, from $59","8% then 4% target","4% daily loss","No minimum days"]},{"name":"Endurance","badge":"Three steps","summary":"Three 6% steps, the most gradual route and the cheapest at equal capital: $29 for a 5K.","points":["From 5K to 200K, from $29","6% target at each step","8% static drawdown","3 days per step"]}]}'::jsonb,
  key_rules            = '{"title":"The rules that decide it","intro":"Four points sent directly by the firm, two of which corrected our previous page.","rules":[{"title":"The split is 80%, not 95%","detail":"The standard rate is 80%. The 95% comes from the paid \"95% Reward Share\" add-on, available on Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced and Express."},{"title":"News trading is restricted by default","detail":"During the evaluation it is free on Express, Enhanced, EnhancedX and Endurance. On a funded Hantec Trader account, opening or closing a position within 3 minutes of a high-impact release is forbidden unless you take the News Trading add-on. Instant Funding and Instant Lite follow the same restriction; Instant24 is the only one that allows it freely."},{"title":"Scalping is bounded by a threshold, not banned","detail":"If net profits from positions held under 3 minutes account for 30% or more of total net profit over the evaluation period, the activity is classed as scalping and can lead to a profit adjustment or a trading restriction."},{"title":"The daily loss is measured on the previous day","detail":"Across all seven programmes, the daily limit is measured on the higher of balance or equity at the previous day’s close. The overall drawdown trails on the instant programmes and Express, and is static on Endurance, Enhanced and EnhancedX."}],"more":["Leverage 1:50 on forex, 1:15 on indices and commodities","Leverage 1:10 on metals, 1:1 on crypto","MetaTrader 4 and MetaTrader 5","Payout decision within 24 business hours for eligible requests","Payouts by bank transfer, crypto or e-wallet"]}'::jsonb,
  journey              = '{"title":"What happens after you pay","intro":"The route depends on which programme family you picked.","steps":[{"title":"Instant funding","detail":"On Instant Funding, Instant Lite and Instant24 there is no evaluation: the account is live from purchase, with its own risk limits."},{"title":"Evaluation","detail":"On Express, a single 10% phase. On Enhanced and EnhancedX, two phases. On Endurance, three 6% steps. No time limit on those four programmes."},{"title":"Hantec Trader account","detail":"Once funded, the news restriction applies within 3 minutes of high-impact releases, unless you hold the News Trading add-on, and except on Instant24."},{"title":"Payouts","detail":"Decision within 24 business hours for eligible requests; how fast the funds land depends on the method. 80% split, or 95% with the add-on."}]}'::jsonb,
  translations         = '{"fr":{"headquarters":"Suite 201, The Catalyst Silicon Avenue, 40 Cybercity, 72201 Ebène, Maurice","regulation_details":"Hantec Trader Limited, société mauricienne n° C191400. Non régulée : société de trading propriétaire. Courtier partenaire : Hantec Markets Limited / Hantec Markets Mauritius.","drawdown_type":"Perte journalière calculée sur le plus élevé du solde ou de l’equity à la clôture de la veille. Drawdown global glissant ou statique selon le programme.","time_limit":"Aucune limite de temps, sauf Instant24 : 24 heures à partir du premier trade","payout_frequency":"sur demande, avec décision sous 24 heures ouvrées","assets":["Forex","Indices","Matières premières","Métaux","Crypto"],"payout_methods":["Virement bancaire","Cryptomonnaie","Portefeuilles électroniques"],"restricted_countries":["Afghanistan","Allemagne","Australie","Belgique","Congo (Brazzaville)","Congo (Kinshasa)","Corée du Nord","Égypte","États-Unis","Haïti","Iran","Israël","Jordanie","Kosovo","Laos","Libye","Malaisie","Myanmar","Ouzbékistan","Pakistan","Porto Rico","Qatar","République tchèque","Roumanie","Russie","Serbie","Somalie","Soudan du Sud","Taïwan","Thaïlande","Viêt Nam","Yémen"],"included_items":["MetaTrader 4 et MetaTrader 5","Sept programmes, de l’instantané au trois étapes","Add-on 95 % de partage disponible sur six programmes"],"pros":["Sept programmes couvrant l’instantané, une, deux et trois étapes","Entrée à partir de 13 $ avec Instant24","Partage de 80 %, porté à 95 % avec l’add-on sur six programmes","Aucune limite de temps, sauf Instant24 par construction","Décision de retrait sous 24 heures ouvrées pour les demandes éligibles","Courtier partenaire identifié : Hantec Markets"],"cons":["Non régulée : société de trading propriétaire, pas un courtier","Les traders américains ne sont pas acceptés","32 territoires exclus, dont l’Allemagne, la Belgique et l’Australie","Le trading d’actualités est restreint par défaut, sauf Instant24","Le scalping peut entraîner un ajustement des profits au-delà d’un seuil","Levier limité à 1:1 sur la crypto"],"special_features":["Partage de 80 %, porté à 95 % avec l’add-on 95% Reward Share","Sept programmes, de Instant24 en 24 heures à Endurance en trois étapes","Perte journalière calculée sur le plus élevé du solde ou de l’equity de la veille","Add-on News Trading pour lever la restriction autour des annonces","Levier 1:50 sur le forex, 1:15 sur indices et matières premières, 1:10 sur métaux","Les traders américains ne sont pas acceptés"],"verdict_card":{"title":"Pour qui, et pour qui pas","body":"Hantec Trader propose sept programmes qui couvrent presque tous les profils, de l’instantané à 13 $ au parcours en trois étapes. Le partage démarre à 80 % et monte à 95 % avec un add-on payant. En contrepartie, la firme n’est pas régulée et ferme un nombre inhabituel de marchés.","points":["Un choix de sept parcours, du financement instantané au trois étapes","Une entrée très bon marché : Instant24 démarre à 13 $","Un partage porté à 95 % si vous prenez l’add-on","Un courtier partenaire identifié, adossé au groupe Hantec Markets"]},"program_guide":{"title":"Sept programmes, trois familles","intro":"Le choix se fait d’abord sur le format : financé tout de suite, ou évaluation en une, deux ou trois étapes.","options":[{"name":"Instant Funding","badge":"Financé immédiatement","summary":"Aucune évaluation, aucun objectif. La contrepartie est le prix : 43 $ sur un 1K, jusqu’à 2 139 $ sur un 50K.","points":["De 1K à 50K","Aucun objectif de profit","Perte journalière de 6 %","Drawdown global glissant de 6 %"]},{"name":"Instant Lite","badge":"Financé, moins cher","summary":"La même logique à un cinquième du prix, contre une perte journalière plus serrée et 5 jours rentables par cycle de retrait.","points":["De 1K à 100K, à partir de 19 $","Perte journalière de 3 %","Drawdown global de 5 %","5 jours rentables par cycle de retrait"]},{"name":"Instant24","badge":"Vingt-quatre heures","summary":"Le format le moins cher du catalogue : le compte vit 24 heures à partir du premier trade. C’est aussi le seul programme où le trading d’actualités est libre.","points":["De 2K à 100K, à partir de 13 $","24 heures depuis le premier trade","Perte journalière de 2 %","Trading d’actualités autorisé"]},{"name":"Express","badge":"Une étape","summary":"Une seule phase à 10 %, sans jour minimum, avec un drawdown global glissant de 6 %.","points":["De 2K à 200K, à partir de 39 $","Objectif de 10 %","Aucun jour minimum","Drawdown glissant de 6 %"]},{"name":"Enhanced","badge":"Deux étapes","summary":"Objectif de 10 % puis 5 %, avec la limite journalière la plus large du catalogue et un drawdown statique.","points":["De 5K à 200K, à partir de 59 $","Objectif 10 % puis 5 %","Perte journalière de 5 %","3 jours rentables par étape"]},{"name":"EnhancedX","badge":"Deux étapes, sans jour minimum","summary":"Des objectifs plus bas que Enhanced, 8 % puis 4 %, et aucun jour minimum, contre une limite journalière plus serrée.","points":["De 5K à 200K, à partir de 59 $","Objectif 8 % puis 4 %","Perte journalière de 4 %","Aucun jour minimum"]},{"name":"Endurance","badge":"Trois étapes","summary":"Trois paliers à 6 %, le chemin le plus progressif et le moins cher à capital égal : 29 $ pour un 5K.","points":["De 5K à 200K, à partir de 29 $","Objectif de 6 % à chaque étape","Drawdown statique de 8 %","3 jours par étape"]}]},"key_rules":{"title":"Les règles qui décident","intro":"Quatre points communiqués directement par la firme, dont deux qui corrigeaient notre fiche précédente.","rules":[{"title":"Le partage est de 80 %, pas de 95 %","detail":"Le taux standard est de 80 %. Les 95 % s’obtiennent avec l’add-on payant « 95% Reward Share », disponible sur Instant Funding, Instant Lite, Instant24, Endurance, EnhancedX, Enhanced et Express."},{"title":"Le trading d’actualités est restreint par défaut","detail":"Pendant l’évaluation, il est libre sur Express, Enhanced, EnhancedX et Endurance. Sur un compte Hantec Trader financé, ouvrir ou fermer une position dans les 3 minutes autour d’une annonce à fort impact est interdit, sauf à prendre l’add-on News Trading. Instant Funding et Instant Lite suivent la même restriction ; Instant24 est le seul à l’autoriser librement."},{"title":"Le scalping est encadré par un seuil, pas interdit","detail":"Si les profits nets issus de positions tenues moins de 3 minutes représentent 30 % ou plus du profit net total sur la période d’évaluation, l’activité est qualifiée de scalping et peut entraîner un ajustement des profits ou une restriction de trading."},{"title":"La perte journalière se calcule sur la veille","detail":"Sur les sept programmes, la limite journalière est mesurée sur le plus élevé du solde ou de l’equity à la clôture de la veille. Le drawdown global, lui, est glissant sur les programmes instantanés et Express, statique sur Endurance, Enhanced et EnhancedX."}],"more":["Levier 1:50 sur le forex, 1:15 sur indices et matières premières","Levier 1:10 sur les métaux, 1:1 sur la crypto","MetaTrader 4 et MetaTrader 5","Décision de retrait sous 24 heures ouvrées pour les demandes éligibles","Retraits par virement, crypto ou portefeuille électronique"]},"journey":{"title":"Ce qui se passe après le paiement","intro":"Le parcours dépend de la famille de programme choisie.","steps":[{"title":"Financement immédiat","detail":"Sur Instant Funding, Instant Lite et Instant24, il n’y a pas d’évaluation : le compte est actif dès l’achat, avec ses limites de risque propres."},{"title":"Évaluation","detail":"Sur Express, une seule phase à 10 %. Sur Enhanced et EnhancedX, deux phases. Sur Endurance, trois paliers à 6 %. Aucune limite de temps sur ces quatre programmes."},{"title":"Compte Hantec Trader","detail":"Une fois financé, la restriction d’actualités s’applique dans les 3 minutes autour des annonces à fort impact, sauf add-on News Trading, et sauf sur Instant24."},{"title":"Retraits","detail":"Décision sous 24 heures ouvrées pour les demandes éligibles ; le délai d’arrivée des fonds dépend du moyen choisi. Partage de 80 %, ou 95 % avec l’add-on."}]}}}'::jsonb,
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'hantec-trader';


-- 3b. Effacer le code promo existant
-- La base portait discount_code = Axtpvm6z7 a 5 %. Ce n est pas un code que
-- le visiteur peut saisir au checkout : c est un jeton technique. Efface.
-- Aucun code ne le remplace : les cinq codes de la firme sont publics, sans
-- attribution, et les publier inviterait a acheter hors du lien affilie.
-- A remplacer des que Hantec fournit un code dedie a PropFirmScanner.
update prop_firms set
  discount_code    = null,
  discount_percent = null,
  discount_status  = 'none'
where slug = 'hantec-trader';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'hantec-trader';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'hantec-instant-funding-1k', 'Instant Funding $1K', 'Hantec Trader', 'hantec-trader', '$1K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 80, 43, null, null, 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-funding-2k', 'Instant Funding $2K', 'Hantec Trader', 'hantec-trader', '$2K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 80, 86, null, null, 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-funding-5k', 'Instant Funding $5K', 'Hantec Trader', 'hantec-trader', '$5K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 80, 214, null, null, 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-funding-10k', 'Instant Funding $10K', 'Hantec Trader', 'hantec-trader', '$10K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 80, 428, null, null, 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-funding-25k', 'Instant Funding $25K', 'Hantec Trader', 'hantec-trader', '$25K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 80, 1069, null, null, 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-funding-50k', 'Instant Funding $50K', 'Hantec Trader', 'hantec-trader', '$50K', 'Instant', 6, 6, null, null, 'Glissant sur le solde', 'Trailing', 80, 2139, null, null, 'No profit target, no minimum days. 80% split, raised to 95% with the add-on. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-1k', 'Instant Lite $1K', 'Hantec Trader', 'hantec-trader', '$1K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 19, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-2k', 'Instant Lite $2K', 'Hantec Trader', 'hantec-trader', '$2K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 39, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-5k', 'Instant Lite $5K', 'Hantec Trader', 'hantec-trader', '$5K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 79, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-10k', 'Instant Lite $10K', 'Hantec Trader', 'hantec-trader', '$10K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 129, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-25k', 'Instant Lite $25K', 'Hantec Trader', 'hantec-trader', '$25K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 239, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-50k', 'Instant Lite $50K', 'Hantec Trader', 'hantec-trader', '$50K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 369, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant-lite-100k', 'Instant Lite $100K', 'Hantec Trader', 'hantec-trader', '$100K', 'Instant Lite', 5, 3, null, null, 'Glissant sur le solde', 'Trailing', 80, 699, null, null, '5 winning days per payout cycle. No profit target. News restricted within 3 minutes of high-impact releases, unless you hold the News Trading add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant24-2k', 'Instant24 $2K', 'Hantec Trader', 'hantec-trader', '$2K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 80, 13, null, null, 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant24-5k', 'Instant24 $5K', 'Hantec Trader', 'hantec-trader', '$5K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 80, 17, null, null, 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant24-10k', 'Instant24 $10K', 'Hantec Trader', 'hantec-trader', '$10K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 80, 38, null, null, 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant24-25k', 'Instant24 $25K', 'Hantec Trader', 'hantec-trader', '$25K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 80, 89, null, null, 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant24-50k', 'Instant24 $50K', 'Hantec Trader', 'hantec-trader', '$50K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 80, 190, null, null, 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-instant24-100k', 'Instant24 $100K', 'Hantec Trader', 'hantec-trader', '$100K', 'Instant 24h', 3, 2, null, null, 'Glissant sur le solde', 'Trailing', 80, 299, null, null, 'The account lives 24 hours from the first trade. No profit target. The only programme where news trading is free.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-endurance-5k', 'Endurance $5K', 'Hantec Trader', 'hantec-trader', '$5K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 80, 29, null, null, '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-endurance-10k', 'Endurance $10K', 'Hantec Trader', 'hantec-trader', '$10K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 80, 59, null, null, '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-endurance-25k', 'Endurance $25K', 'Hantec Trader', 'hantec-trader', '$25K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 80, 109, null, null, '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-endurance-50k', 'Endurance $50K', 'Hantec Trader', 'hantec-trader', '$50K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 80, 189, null, null, '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-endurance-100k', 'Endurance $100K', 'Hantec Trader', 'hantec-trader', '$100K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 80, 299, null, null, '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-endurance-200k', 'Endurance $200K', 'Hantec Trader', 'hantec-trader', '$200K', '3 steps', 8, 4, 6, 6, 'Statique', 'Static', 80, 499, null, null, '3 trading days per step. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhancedx-5k', 'EnhancedX $5K', 'Hantec Trader', 'hantec-trader', '$5K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 80, 59, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhancedx-10k', 'EnhancedX $10K', 'Hantec Trader', 'hantec-trader', '$10K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 80, 99, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhancedx-25k', 'EnhancedX $25K', 'Hantec Trader', 'hantec-trader', '$25K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 80, 219, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhancedx-50k', 'EnhancedX $50K', 'Hantec Trader', 'hantec-trader', '$50K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 80, 359, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhancedx-100k', 'EnhancedX $100K', 'Hantec Trader', 'hantec-trader', '$100K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 80, 599, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhancedx-200k', 'EnhancedX $200K', 'Hantec Trader', 'hantec-trader', '$200K', '2 steps', 8, 4, 8, 4, 'Statique', 'Static', 80, 1169, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhanced-5k', 'Enhanced $5K', 'Hantec Trader', 'hantec-trader', '$5K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 80, 59, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhanced-10k', 'Enhanced $10K', 'Hantec Trader', 'hantec-trader', '$10K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 80, 99, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhanced-25k', 'Enhanced $25K', 'Hantec Trader', 'hantec-trader', '$25K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 80, 219, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhanced-50k', 'Enhanced $50K', 'Hantec Trader', 'hantec-trader', '$50K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 80, 359, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhanced-100k', 'Enhanced $100K', 'Hantec Trader', 'hantec-trader', '$100K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 80, 599, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-enhanced-200k', 'Enhanced $200K', 'Hantec Trader', 'hantec-trader', '$200K', '2 steps', 10, 5, 10, 5, 'Statique', 'Static', 80, 1169, null, null, 'Enhanced: 3 winning days per step. EnhancedX: no minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-2k', 'Express $2K', 'Hantec Trader', 'hantec-trader', '$2K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 39, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-5k', 'Express $5K', 'Hantec Trader', 'hantec-trader', '$5K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 59, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-10k', 'Express $10K', 'Hantec Trader', 'hantec-trader', '$10K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 99, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-25k', 'Express $25K', 'Hantec Trader', 'hantec-trader', '$25K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 199, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-50k', 'Express $50K', 'Hantec Trader', 'hantec-trader', '$50K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 319, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-100k', 'Express $100K', 'Hantec Trader', 'hantec-trader', '$100K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 529, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'hantec-express-200k', 'Express $200K', 'Hantec Trader', 'hantec-trader', '$200K', '1 step', 6, 5, 10, null, 'Glissant sur le solde', 'Trailing', 80, 999, null, null, 'No minimum days. News free during the evaluation, restricted once funded unless you hold the add-on.', true, true, true, 'one-time', 'percent');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros,
       ((translations -> 'fr') is not null) as a_une_traduction_fr
from prop_firms where slug = 'hantec-trader';

-- Attendu : 44 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'hantec-trader' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- SOURCE. E-mail de Desiree Almeida, Partnership Manager de Hantec Trader,
-- 3 septembre 2026. Source de première main : la firme décrit sa propre
-- offre. Aucun recoupement de tiers n’a été nécessaire.
--
-- DEUX CORRECTIONS DEMANDEES PAR LA FIRME. Le partage affiché était faux :
-- il est de 80 %, et non de 95 %, les 95 % nécessitant un add-on payant.
-- Les règles d’actualités étaient également inexactes : elles varient par
-- programme et par stade.
--
-- CODE PROMO : AUCUN AFFICHÉ, VOLONTAIREMENT. La firme fournit cinq codes
-- publics et conditionnels — NEW35, INSTANT20, SAVE20, SAVE15, SAVE10.
-- Aucun n’appartient à PropFirmScanner : n’importe qui les trouve
-- ailleurs, ils ne portent aucune attribution, et les publier revient à
-- inviter le visiteur à acheter sans passer par le lien affilié.
-- discount_code et discount_percent restent nuls jusqu’à ce que Hantec
-- fournisse un code dédié, comme FuturesElite l’a fait avec SCANNED. C’est
-- la demande à adresser à Desiree Almeida.
--
-- discount_code valait « Axtpvm6z7 » à 5 % : un jeton technique, pas un
-- code que le visiteur peut saisir. Remplacé.
--
-- LOGO. Corrigé. logo_url pointait sur une favicon Google du domaine «
-- hantectrader.com », qui n’est pas le leur : la requête renvoyait une
-- image vide. Le logo officiel fourni par la firme est servi depuis
-- public/logos/hantec-trader.png (256 x 256, H orange sur fond noir).
--
-- PROGRAMME D’AFFILIATION. 10 % à 15 % selon le palier (Silver, Gold,
-- Platinum), cookie de 30 jours, paiement à la demande dès 50 $.
-- L’affiliate_url en base porte affiliateId=2766 ; à confirmer que c’est
-- bien le tien dans le portail affilié.
--
-- LEVIER. Forex 1:50, indices et matières premières 1:15, métaux 1:10,
-- crypto 1:1. Identique sur les sept programmes. Non stocké faute de
-- colonne dédiée : figure dans key_rules.more.
--
-- PAYS RESTREINTS. Les 32 territoires sont désormais écrits dans
-- restricted_countries, colonne créée par l’étape 2 de ce script et
-- affichée derrière un dépliant sur la page. Les plus notables —
-- États-Unis, Allemagne, Belgique, Australie — restent aussi dans cons, où
-- ils sont vus sans clic.
