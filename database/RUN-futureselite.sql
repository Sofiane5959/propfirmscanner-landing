-- =============================================================================
-- FUTURESELITE — TOUT EN UN
-- =============================================================================
-- Un seul copier-coller. Aucun prerequis, aucun autre fichier a passer avant.
-- Toutes les commandes sont idempotentes : rejouable sans casse.
--
-- OU LE COLLER : supabase.com -> ton projet -> SQL Editor -> New query
--                -> coller -> Run.
--
-- Ce que ca corrige sur la page FuturesElite, aujourd hui quasi vide :
--   affiliate_url  null  -> ton lien avec aff + code SCANNED preremplis
--   profit_split   null  -> 90
--   platforms      null  -> les 7 plateformes
--   headquarters   null  -> Quantum SRL, Latina, Italie
--   is_futures     false -> true   (c est une firme futures)
--   min_price      99    -> 95     (prix reel de l Elite 25K)
--   0 challenge          -> 4 tailles, donc un configurateur qui s affiche
--
-- Releve du 3 septembre 2026 sur futureselite.com et app.futureselite.com.
-- Code SCANNED confirme par le Risk Team FuturesElite par email le meme jour.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. SAUVEGARDE — lis cette sortie avant de continuer
-- -----------------------------------------------------------------------------
select * from prop_firms where slug = 'futureselite';
select * from prop_firm_challenges where firm_slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 2. Colonnes necessaires  (sans effet si elles existent deja)
-- -----------------------------------------------------------------------------
alter table prop_firms add column if not exists price_currency    text default 'USD';
alter table prop_firms add column if not exists data_verified_at  timestamptz;
alter table prop_firms add column if not exists data_verified_by  text;
alter table prop_firms add column if not exists source_url        text;
alter table prop_firms add column if not exists rating_checked_at timestamptz;
alter table prop_firms add column if not exists discount_status   text;
alter table prop_firms add column if not exists discount_starts_at timestamptz;


-- -----------------------------------------------------------------------------
-- 3. La firme
-- -----------------------------------------------------------------------------
update prop_firms set
  name               = 'FuturesElite',
  website_url        = 'https://futureselite.com',
  -- Ton identifiant d affiliation ET le code, dans la meme URL. Verifie en
  -- direct : la page repond "Coupon SCANNED successfully activated" et applique
  -- -20 %. Le visiteur n a rien a taper.
  affiliate_url      = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  is_futures         = true,
  price_currency     = 'USD',
  profit_split       = 90,
  min_price          = 95,
  max_price          = 353,
  headquarters       = 'Corso G. Matteotti 61, Latina 04100, Italie',
  country            = 'Italy',
  -- Quantum SRL. Aucun regulateur financier. Le site precise lui-meme que les
  -- comptes sont des demonstrations et les performances hypothetiques.
  is_regulated       = false,
  regulation_details = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n 03095010595. Aucune licence de regulateur financier. Comptes de demonstration, performances hypothetiques.',
  platforms          = '["Tradovate","NinjaTrader","Quantower","ATAS","Volumetrica","DeepCharts","WealthCharts"]',
  assets             = '["Futures"]',
  drawdown_type      = 'End of Day',
  time_limit         = 'Aucune limite de temps',
  special_features   = '["90% profit split on the Elite programme","End-of-day drawdown, no daily loss limit","No consistency rule once funded","No activation fee to unlock the funded account","Bundle discounts: the fifth account is free","Instant accounts available with no evaluation"]',
  data_verified_at   = timestamptz '2026-09-03',
  data_verified_by   = 'PropFirmScanner',
  source_url         = 'https://futureselite.com',
  updated_at         = now()
where slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 4. Le code promo — LIS AVANT DE DECOMMENTER
-- -----------------------------------------------------------------------------
-- SCANNED donne -20 %, confirme par email par FuturesElite.
--
-- MAIS : en arrivant sur leur page sans aucun parametre, un coupon "SUMMER"
-- s active tout seul et donne -25 %. Constate sur l Elite 25K, base 95 $ :
--       SUMMER  (automatique, tout visiteur)  ->  71,25 $
--       SCANNED (ton code)                    ->  76,00 $
--
-- Annoncer "-20 % avec SCANNED" ferait donc payer 4,75 $ de plus a quelqu un
-- qui passe par toi, et ta page afficherait 76 $ quand le prix reel est 71,25 $.
--
-- Le lien de l etape 3 porte deja coupon=scanned : ton attribution est
-- preservee quoi qu il arrive, et si SUMMER expire, SCANNED reprend la main.
--
-- Decommente ces trois lignes le jour ou SUMMER a disparu, ou si tu preferes
-- annoncer ton code malgre tout :
--
-- update prop_firms set discount_code = 'SCANNED', discount_percent = 20,
--        discount_status = 'active'
-- where slug = 'futureselite';

-- En attendant : aucune remise fantome affichee.
update prop_firms set discount_code = null, discount_percent = null
where slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 5. Le programme Elite — c est ce qui fait apparaitre le configurateur
-- -----------------------------------------------------------------------------
-- Prix HORS remise : la remise se calcule a l affichage, elle n est pas figee.
begin;

delete from prop_firm_challenges where firm_slug = 'futureselite';

insert into prop_firm_challenges (
  id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss,
  phase1_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price,
  payout_frequency_description, consistency_rule, allows_ea, allows_scalping,
  allows_news_trading, billing_period, risk_unit
) values
  (gen_random_uuid(), 'futureselite-elite-25k', 'Elite $25K', 'FuturesElite', 'futureselite',
   '$25K', '1 step', 1000, null, 1250, 'End of Day', 'Trailing', 90, 95, null,
   'Une fois finance : 90 % de partage, plafond de retrait 1 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum. Aucune regle de regularite une fois finance. Reset 79 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite',
   '$50K', '1 step', 2000, null, 3000, 'End of Day', 'Trailing', 90, 153, null,
   'Une fois finance : 90 % de partage, plafond de retrait 2 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum. Aucune regle de regularite une fois finance. Reset 89 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite',
   '$100K', '1 step', 3000, null, 6000, 'End of Day', 'Trailing', 90, 293, null,
   'Une fois finance : 90 % de partage, plafond de retrait 2 500 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum. Aucune regle de regularite une fois finance. Reset 159 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite',
   '$150K', '1 step', 4500, null, 9000, 'End of Day', 'Trailing', 90, 353, null,
   'Une fois finance : 90 % de partage, plafond de retrait 3 000 $, retrait possible chaque jour, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum. Aucune regle de regularite une fois finance. Reset 229 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd');

commit;


-- -----------------------------------------------------------------------------
-- 6. CONTROLE — ces deux requetes disent si ca a marche
-- -----------------------------------------------------------------------------
-- Attendu : is_futures = true, profit_split = 90, min_price = 95,
--           affiliate_url renseigne, platforms renseigne.
select slug, is_futures, profit_split, min_price, price_currency,
       affiliate_url, platforms, headquarters, data_verified_at
from prop_firms where slug = 'futureselite';

-- Attendu : 4 lignes, de 95 a 353.
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'futureselite' order by price;


-- =============================================================================
-- CE QUI RESTE A FAIRE, ET QUE CE FICHIER NE PEUT PAS FAIRE
-- =============================================================================
--
-- LE LOGO. logo_url pointe encore sur une favicon Google. Leur Risk Team te
-- dit de prendre le logo sur leur profil X. Telecharge-le, mets-le dans
-- public/logos/futureselite.png, puis :
--     update prop_firms set logo_url = '/logos/futureselite.png'
--     where slug = 'futureselite';
--
-- NITRO, PRIME, INSTANT. Les trois autres programmes existent mais leur grille
-- tarifaire est derriere l authentification de leur dashboard. Depuis ton
-- compte connecte, releve les prix par taille et je les ajoute.
--   NITRO   : paiements quotidiens, pas de perte journaliere
--   PRIME   : le moins cher, jusqu a 10 comptes groupes, 1,5 M$ cumules
--   INSTANT : aucune evaluation, 80 % de partage
--
-- REGLE DE REGULARITE. Leur page affiche "40%" et "50%" cote a cote sans dire
-- laquelle s applique. Decrite en toutes lettres, sans chiffre invente.
--
-- PRESELECTION DU PLAN PAR URL. Leur application ne lit que aff, ref, coupon et
-- type. Aucun parametre de taille trouve, et type=nitro renvoie vers la page de
-- connexion. Le lien preremplit donc l affiliation et le coupon ; le visiteur
-- choisit son plan sur place. A demander au partenaire, ils repondent vite.
--
-- TRUSTPILOT. Les compteurs de leur propre page d accueil affichent tous zero
-- ($0.0M verse, 0.0 de note). trustpilot_rating est laisse tel quel plutot que
-- d ecrire un zero qui les ferait passer pour mal notes.
