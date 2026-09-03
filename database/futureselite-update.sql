-- =============================================================================
-- FUTURESELITE — affiliation, code promo et programme Elite
-- =============================================================================
-- Releve du 3 septembre 2026, depuis futureselite.com et app.futureselite.com.
--
-- La firme EXISTE DEJA en base : slug 'futureselite', name 'FuturesElite',
-- listing_status 'listed', mais sans aucun lien d affiliation. C est donc une
-- mise a jour, pas une creation.
--
-- A ne pas confondre avec 'fundedelite' (FundedElite), une firme differente,
-- egalement listee, avec son propre identifiant d affiliation.
--
-- PREREQUIS : database/shared-01-schema-provenance.sql
-- =============================================================================


-- -----------------------------------------------------------------------------
-- ETAPE 0 — SAUVEGARDE. Exporter en CSV avant d aller plus loin.
-- -----------------------------------------------------------------------------
select * from prop_firms where slug in ('futureselite', 'fundedelite');
select * from prop_firm_challenges where firm_slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 1. Identite  (source : futureselite.com, mentions legales)
-- -----------------------------------------------------------------------------
update prop_firms set
  name               = 'FuturesElite',
  website_url        = 'https://futureselite.com',
  -- L identifiant d affiliation ET le code promo dans la meme URL. Verifie :
  -- ?coupon=scanned active bien le code, la page confirme
  -- "Coupon SCANNED successfully activated" et applique -20 %.
  affiliate_url      = 'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned',
  price_currency     = 'USD',
  -- Quantum SRL, societe italienne. Aucun regulateur financier.
  -- Le site precise lui-meme : comptes de demonstration, performances
  -- hypothetiques, aucun conseil en investissement.
  is_regulated       = false,
  regulation_details = 'Quantum SRL, Corso G. Matteotti 61, Latina 04100, Italie, n 03095010595. Aucune licence de regulateur financier. Comptes de demonstration : les performances sont hypothetiques.',
  headquarters       = 'Corso G. Matteotti 61, Latina 04100, Italie',
  country            = 'Italy',
  is_futures         = true,
  platforms          = '["Tradovate","NinjaTrader","Quantower","ATAS","Volumetrica","DeepCharts","WealthCharts"]',
  assets             = '["Futures"]',
  drawdown_type      = 'End of Day',
  time_limit         = 'Aucune limite de temps',
  profit_split       = 90,
  min_price          = 95,
  max_price          = 353,
  special_features   = '["90% profit split on the Elite programme","End-of-day drawdown, no daily loss limit","No consistency rule once funded","No activation fee to unlock the funded account","Bundle discounts: the fifth account is free","Instant accounts available with no evaluation"]',
  data_verified_at   = timestamptz '2026-09-03',
  data_verified_by   = 'PropFirmScanner',
  source_url         = 'https://futureselite.com',
  updated_at         = now()
where slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 2. Le code promo — A ARBITRER, volontairement laisse vide
-- -----------------------------------------------------------------------------
-- SCANNED donne -20 %. Mais en visitant la page sans aucun parametre, un
-- coupon "SUMMER" s active tout seul et donne -25 %.
--
-- Constate sur l Elite 25K, prix de base 95 $ :
--     SUMMER  (automatique, tout visiteur)  ->  71,25 $
--     SCANNED (ton code)                    ->  76,00 $
--
-- Annoncer "-20 % avec SCANNED" ferait donc payer tes visiteurs PLUS CHER que
-- s ils venaient directement, et la page afficherait 76 $ quand le prix reel
-- est 71,25 $. C est la regle du projet : ne rien promettre au visiteur que le
-- partenaire ne tient pas.
--
-- Le lien affilie ci-dessus porte quand meme ?coupon=scanned : l attribution
-- est preservee, et si SUMMER expire — le nom suggere une campagne saisonniere
-- et nous sommes en septembre — SCANNED reprend la main automatiquement.
--
-- Decommenter le jour ou SUMMER a disparu, ou si SCANNED passe au-dessus :
-- update prop_firms set
--   discount_code    = 'SCANNED',
--   discount_percent = 20,
--   discount_status  = 'active'
-- where slug = 'futureselite';

-- En attendant, on s assure qu aucune remise fantome ne s affiche.
update prop_firms set
  discount_code    = null,
  discount_percent = null
where slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 3. Programme ELITE  (source : app.futureselite.com/dashboard/choose-plan)
-- -----------------------------------------------------------------------------
-- Seul programme dont j ai pu relever les parametres complets. NITRO, PRIME et
-- INSTANT existent mais leur grille tarifaire est derriere une authentification
-- que je n ai pas franchie — voir la note (B).
--
-- Prix HORS remise : le prix affiche varie selon le coupon actif, donc on
-- stocke le tarif de base et la remise se calcule a l affichage.
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
   'Une fois finance : 90 % de partage, plafond de retrait 1 000 $, retraits possibles tous les jours, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum, regle de regularite. Aucune regle de regularite une fois finance. Frais de reset 79 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-50k', 'Elite $50K', 'FuturesElite', 'futureselite',
   '$50K', '1 step', 2000, null, 3000, 'End of Day', 'Trailing', 90, 153, null,
   'Une fois finance : 90 % de partage, plafond de retrait 2 000 $, retraits possibles tous les jours, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum, regle de regularite. Aucune regle de regularite une fois finance. Frais de reset 89 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-100k', 'Elite $100K', 'FuturesElite', 'futureselite',
   '$100K', '1 step', 3000, null, 6000, 'End of Day', 'Trailing', 90, 293, null,
   'Une fois finance : 90 % de partage, plafond de retrait 2 500 $, retraits possibles tous les jours, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum, regle de regularite. Aucune regle de regularite une fois finance. Frais de reset 159 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd'),
  (gen_random_uuid(), 'futureselite-elite-150k', 'Elite $150K', 'FuturesElite', 'futureselite',
   '$150K', '1 step', 4500, null, 9000, 'End of Day', 'Trailing', 90, 353, null,
   'Une fois finance : 90 % de partage, plafond de retrait 3 000 $, retraits possibles tous les jours, 6 jours de trading minimum, aucun buffer.',
   'Evaluation : 3 jours de trading minimum, regle de regularite. Aucune regle de regularite une fois finance. Frais de reset 229 $, aucun frais d activation.',
   true, true, true, 'one-time', 'usd');

-- Doit renvoyer 4.
select count(*) as lignes_futureselite from prop_firm_challenges where firm_slug = 'futureselite';

commit;


-- -----------------------------------------------------------------------------
-- 4. Verification
-- -----------------------------------------------------------------------------
select slug, name, min_price, price_currency, profit_split, affiliate_url,
       discount_code, discount_percent, is_regulated, data_verified_at
from prop_firms where slug = 'futureselite';

select name, account_size, price, max_drawdown, phase1_profit_target, profit_split, risk_unit
from prop_firm_challenges where firm_slug = 'futureselite' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- (A) LE CODE PROMO. Voir la section 2 : SCANNED (-20 %) est actuellement
--     moins avantageux que SUMMER (-25 %), applique automatiquement a tout
--     visiteur. Rien n est annonce tant que ce n est pas arbitre.
--
-- (B) NITRO, PRIME, INSTANT. Les trois programmes existent — visibles a l
--     etape "ACCOUNT TYPE" — mais leur grille est derriere une authentification.
--     Ce que la page publique en dit, sans chiffres exploitables :
--       NITRO   : paiements quotidiens, pas de regle de regularite une fois
--                 finance, pas de perte journaliere
--       PRIME   : le moins cher, jusqu a 10 comptes groupes, validation en un
--                 jour, jusqu a 1,5 M$ en cumulant 10 x 150K
--       INSTANT : aucune evaluation, 80 % de partage, drawdown de fin de journee
--     Pour les saisir il faut relever les prix depuis un compte connecte.
--
-- (C) REGLE DE REGULARITE. La page affiche deux valeurs cote a cote, "40%" et
--     "50%", sans indiquer laquelle s applique ni a quoi. Ambigu, donc decrit
--     en toutes lettres dans consistency_rule sans chiffre invente. A confirmer.
--
-- (D) SELECTION DU PLAN PAR URL. Tu voulais que le lien preselectionne le type
--     de compte et la taille. Le bundle JS ne lit que aff, ref, coupon et type,
--     et type=nitro m a renvoye vers /auth/login. Aucun parametre de taille n a
--     ete trouve. Le lien preremplit donc l affiliation et le coupon, mais le
--     visiteur choisit son plan sur place. A demander au partenaire : existe-t-il
--     un parametre de plan et de taille ?
--
-- (E) CHIFFRES DE LA PAGE D ACCUEIL. Total verse, plus gros retrait, delai moyen
--     et note Trustpilot s affichent tous a zero sur leur propre site
--     ($0.0M+, $0, 0hrs, 0.0). Non repris.
--
-- (F) TRUSTPILOT. Aucune note exploitable relevee. trustpilot_rating reste
--     inchange plutot que d ecrire un zero qui ferait passer la firme pour mal
--     notee alors qu elle n est simplement pas mesuree.
