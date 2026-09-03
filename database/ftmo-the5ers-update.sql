-- =============================================================================
-- FTMO et THE5ERS — mise a jour du listing
-- =============================================================================
-- Source : dossier_ftmo_the5ers.md, releve du 3 septembre 2026.
--
-- Le dossier hierarchise ses sources, et cette migration suit cette hierarchie
-- a la lettre : seul ce qui vient des pages officielles de la firme est ecrit.
-- Ce qui vient de PropFirmMatch ou de TheTrustedProp reste en commentaire, en
-- fin de fichier, avec la raison. C'est la regle du projet : ne jamais publier
-- un chiffre non verifie contre la source officielle.
--
-- PREREQUIS : database/shared-01-schema-provenance.sql, qui cree les colonnes
-- utilisees ici (price_currency, data_verified_at, rating_checked_at,
-- source_url, discount_status). Ce fichier ne contient que des donnees FTMO et
-- The5ers, il ne depend d aucune autre firme.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- ETAPE 0 — SAUVEGARDE. Exporter en CSV avant d aller plus loin.
-- -----------------------------------------------------------------------------
select * from prop_firms where slug in ('ftmo', 'the5ers');
select * from prop_firm_challenges where firm_slug in ('ftmo', 'the5ers');


-- =============================================================================
-- FTMO
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 2. Identite et statut  (source : ftmo.com)
-- -----------------------------------------------------------------------------
update prop_firms set
  founded_year       = 2015,
  headquarters       = 'Bureaux Quadrio, Purkynova 2121/3, 110 00 Prague, Republique tcheque',
  price_currency     = 'EUR',
  -- FTMO n agit pas comme courtier et n accepte aucun depot : trading simule.
  is_regulated       = false,
  regulation_details = null,
  -- 4,8/5 affiche sur ftmo.com le 3 septembre 2026. Note Trustpilot, collectee
  -- par Trustpilot : la page la credite comme telle.
  trustpilot_rating  = 4.8,
  rating_checked_at  = timestamptz '2026-09-03',
  data_verified_at   = timestamptz '2026-09-03',
  data_verified_by   = 'PropFirmScanner',
  source_url         = 'https://ftmo.com/fr/trading-objectives/',
  -- Le drawdown differe selon le produit : glissant en fin de journee sur le
  -- 1-Step, fixe sur le 2-Step. La base disait "Static" pour les deux, ce qui
  -- est faux pour la moitie de l offre. Le detail vit au niveau du challenge ;
  -- au niveau firme on ne resume plus a tort.
  drawdown_type      = 'Varie selon le produit : glissant (1-Step) ou fixe (2-Step)',
  time_limit         = 'Aucune limite de temps, sur les deux produits',
  min_price          = 79,
  max_price          = 599,
  country            = 'Czech Republic',
  max_allocation     = '$200,000',
  -- Colonnes tableau : stockees en JSON texte, comme le reste de la table.
  -- TradingView est volontairement absent : le dossier dit "en cours
  -- d integration", donc pas disponible aujourd hui.
  platforms          = '["MetaTrader 4","MetaTrader 5","cTrader"]',
  assets             = '["Forex CFD","Metals","Indices","Energy","Crypto","Commodities","Stocks"]',
  payout_methods     = '["Bank transfer","Crypto","Skrill","Mastercard","Visa Direct"]',
  -- La distinction Standard / Swing est officielle et souvent mal rapportee :
  -- pendant l evaluation aucune restriction, quel que soit le type de compte.
  -- C est sur le compte finance que Standard restreint, et Swing n existe pas
  -- sur le 1-Step.
  special_features   = '["No time limit on either product","During the evaluation there are no news, overnight or weekend restrictions","Funded Standard account: news trading and overnight or weekend holding are restricted","Funded Swing account: none of those restrictions, 2-Step only","The best-day rule applies to the 1-Step only, and breaching it is not a failure"]',
  updated_at         = now()
where slug = 'ftmo';

-- 2b. La remise orpheline
-- discount_percent valait 19 sans aucun discount_code : la page annoncait une
-- reduction que le visiteur ne pouvait pas obtenir. La promotion reelle du
-- 3 septembre est -20 % sur le seul 1-Step 100K, donc elle ne se represente pas
-- au niveau firme. Elle est portee par discounted_price sur ce challenge.
update prop_firms set
  discount_percent = null,
  discount_code    = null,
  discount_status  = 'expired'
where slug = 'ftmo';


-- -----------------------------------------------------------------------------
-- 3. Programmes FTMO  (source : ftmo.com/fr/trading-objectives/)
-- -----------------------------------------------------------------------------
-- Remplacement complet : les lignes existantes ne distinguaient pas les deux
-- produits. Dans une transaction, comme pour Instant Funding.
begin;

delete from prop_firm_challenges where firm_slug = 'ftmo';

insert into prop_firm_challenges (
  id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss,
  phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, price,
  discounted_price, payout_frequency_description, consistency_rule, allows_ea,
  allows_scalping, allows_news_trading, billing_period, risk_unit
) values
  -- 1-Step : perte journaliere 3 %, drawdown GLISSANT, aucun jour minimum,
  -- regle du meilleur jour <= 50 % du profit des jours positifs.
  -- Depasser cette regle n est PAS une infraction : on continue a trader
  -- jusqu a repasser sous le seuil. C est une condition de validation.
  (gen_random_uuid(), 'ftmo-1-step-10k', 'FTMO 1-Step 10K', 'FTMO', 'ftmo', '$10K', '1 step', 10, 3, 10, null,
   'Glissant en fin de journee', 'Trailing', 79, null,
   null,
   'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation : il faut continuer jusqu a repasser dessous.',
   true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-25k', 'FTMO 1-Step 25K', 'FTMO', 'ftmo', '$25K', '1 step', 10, 3, 10, null,
   'Glissant en fin de journee', 'Trailing', 199, null, null,
   'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation.',
   true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-50k', 'FTMO 1-Step 50K', 'FTMO', 'ftmo', '$50K', '1 step', 10, 3, 10, null,
   'Glissant en fin de journee', 'Trailing', 319, null, null,
   'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation.',
   true, true, true, 'one-time', 'percent'),
  -- Promotion -20 % en cours sur cette taille uniquement, soit 399,20 EUR.
  (gen_random_uuid(), 'ftmo-1-step-100k', 'FTMO 1-Step 100K', 'FTMO', 'ftmo', '$100K', '1 step', 10, 3, 10, null,
   'Glissant en fin de journee', 'Trailing', 499, 399.20, null,
   'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation.',
   true, true, true, 'one-time', 'percent'),

  -- 2-Step : perte journaliere 5 %, drawdown FIXE, 4 jours de trading minimum
  -- dans chaque phase, aucune regle de regularite.
  (gen_random_uuid(), 'ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5,
   'Fixe (statique)', 'Static', 250, null, null,
   'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.',
   true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', 'FTMO', 'ftmo', '$10K', '2 steps', 10, 5, 10, 5,
   'Fixe (statique)', 'Static', 99, null, null,
   'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.',
   true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5,
   'Fixe (statique)', 'Static', 279, null, null,
   'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.',
   true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', 'FTMO', 'ftmo', '$50K', '2 steps', 10, 5, 10, 5,
   'Fixe (statique)', 'Static', 379, null, null,
   'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.',
   true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', 'FTMO', 'ftmo', '$100K', '2 steps', 10, 5, 10, 5,
   'Fixe (statique)', 'Static', 599, null, null,
   'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.',
   true, true, true, 'one-time', 'percent');

-- Doit renvoyer 9.
select count(*) as lignes_ftmo from prop_firm_challenges where firm_slug = 'ftmo';

commit;


-- =============================================================================
-- THE5ERS
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 4. Identite et statut  (source : mentions legales officielles)
-- -----------------------------------------------------------------------------
update prop_firms set
  founded_year       = 2016,
  headquarters       = 'Enstar House, 168 Praed Street, Londres W2 1RH, Royaume-Uni',
  price_currency     = 'USD',
  -- FIVE PERCENT ONLINE LTD, societe britannique n 12553363. Aucun regulateur
  -- financier : la firme se decrit elle-meme hors du champ des autorites.
  is_regulated       = false,
  regulation_details = 'FIVE PERCENT ONLINE LTD, societe britannique n 12553363. Aucune licence de regulateur financier. Environnement de trading entierement simule, les fonds d evaluation sont fictifs.',
  -- Correction : la base portait 4,8. Le releve officiel du 3 septembre donne
  -- 4,7. Note Trustpilot, creditee comme telle sur la page.
  trustpilot_rating  = 4.7,
  rating_checked_at  = timestamptz '2026-09-03',
  data_verified_at   = timestamptz '2026-09-03',
  data_verified_by   = 'PropFirmScanner',
  source_url         = 'https://the5ers.com/faqs/',
  drawdown_type      = 'Varie selon le programme',
  time_limit         = 'Aucune limite de temps',
  country            = 'United Kingdom',
  max_allocation     = '$4,000,000',
  platforms          = '["MetaTrader 5","cTrader"]',
  -- Liste officielle de 31 territoires interdits. Il n existe pas de colonne
  -- dediee, or l exclusion des Etats-Unis est le filtre le plus decisif pour un
  -- acheteur : elle ferme l un des plus gros marches. Elle figure donc ici, et
  -- la liste complete merite sa propre colonne.
  special_features   = '["US traders are not accepted","Simulated trading environment: evaluation funds are not real capital","Part of the 5% Group, alongside Trade The Pool, Trade Delicious, TSG Brokers and The5ers Futures","Maximum funded capital $4,000,000","31 restricted territories, including the United States and Israel"]',
  updated_at         = now()
where slug = 'the5ers';


-- -----------------------------------------------------------------------------
-- 5. Programmes The5ers — un seul est source officiellement
-- -----------------------------------------------------------------------------
-- Le dossier est explicite : les regles des programmes Growth, High Stakes et
-- Bootcamp viennent de TheTrustedProp, une analyse concurrente, et ne sont PAS
-- confirmees sur le site officiel. Seul le Summer Plan 1 Step l est.
--
-- On ne publie donc que celui-la. C est volontairement conservateur, et ca a
-- une consequence commerciale a assumer : voir la note (A) en fin de fichier.
begin;

delete from prop_firm_challenges where firm_slug = 'the5ers';

insert into prop_firm_challenges (
  id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss,
  phase1_profit_target, drawdown_type, max_loss_type, profit_split, price,
  discounted_price, payout_frequency_description, consistency_rule, allows_ea,
  allows_scalping, allows_news_trading, billing_period, risk_unit
) values
  (gen_random_uuid(), 'the5ers-summer-plan-1-step-100k', 'The5ers Summer Plan 1 Step 100K',
   'The5ers', 'the5ers', '$100K', '1 step', 6, 3, 10,
   'Statique', 'Static',
   -- 75 %, pas "jusqu a 100 %". Le 100 % est un plafond atteignable, pas un
   -- taux de depart, et la communication generale de la firme entretient
   -- l ambiguite.
   75, 249, null,
   'Retrait minimum 250 $, plafond 2 000 $. Remboursement des frais a partir du 3e retrait. Bonus 10 %.',
   'Regularite 50 % par jour. Duree illimitee. 2 comptes actifs maximum.',
   true, true, true, 'one-time', 'percent');

-- Doit renvoyer 1.
select count(*) as lignes_the5ers from prop_firm_challenges where firm_slug = 'the5ers';

commit;

-- 5b. min_price suit ce qui est publie.
-- Voir la note (A) : c est le point a arbitrer.
update prop_firms set min_price = 249 where slug = 'the5ers';


-- -----------------------------------------------------------------------------
-- 6. Verification
-- -----------------------------------------------------------------------------
select slug, name, min_price, price_currency, founded_year, trustpilot_rating,
       rating_checked_at, data_verified_at, discount_code, discount_percent
from prop_firms where slug in ('ftmo', 'the5ers');

select firm_slug, name, account_size, price, discounted_price, max_daily_loss,
       max_drawdown, drawdown_type, profit_split
from prop_firm_challenges where firm_slug in ('ftmo', 'the5ers') order by firm_slug, price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- (A) THE5ERS, min_price = 249
--     C est le seul prix officiellement source. Les entrees a 22 $ (Bootcamp
--     20K) et 39 $ (High Stakes 5K) viennent de TheTrustedProp. Consequence :
--     The5ers apparait nettement plus chere qu elle ne l est, sur la page
--     comparative comme dans le classement "les moins chers". Trois issues :
--       - laisser 249 et publier peu mais sur ;
--       - verifier les prix sur the5ers.com/high-stakes/ et /bootcamp/ puis
--         inserer les programmes complets ;
--       - garder l ancien 95, qui n est source nulle part.
--     La deuxieme est la bonne. A arbitrer.
--
-- (B) FTMO, partage des profits
--     80 % de base, 90 % via scaling, certaines sources annoncent 90 % d emblee
--     sur le 1-Step. Non confirme sur les pages officielles consultees.
--     profit_split reste null : mieux vaut une case vide qu un chiffre faux.
--     A prendre sur ftmo.com/fr/recompense-croissante-et-plan-de-scaling/
--
-- (C) THE5ERS, les trois autres programmes
--     Growth / Hyper Growth, High Stakes Classic, Bootcamp : regles et prix
--     issus de TheTrustedProp. Non publies.
--
-- (D) Commissions The5ers
--     TheTrustedProp : forex/metaux 4 $/lot, indices 2 $/lot, crypto gratuit.
--     PropFirmMatch  : crypto 0,06 %/lot, indices gratuit.
--     Les deux versions sont incompatibles. Rien n est ecrit.
--
-- (E) Retrait minimum The5ers : 150 $ (TheTrustedProp) contre 250 $ (Summer
--     Plan officiel). Seul le 250 $ est ecrit, sur le challenge concerne.
--
-- (F) Chiffres declaratifs non ecrits
--     FTMO : 4,5 M de clients, 650 M$ de recompenses, 140 pays, 300 employes.
--     The5ers : 262 000 traders finances, 171 employes, 80 M$ verses.
--     Ce sont des declarations de la firme sur elle-meme. Publiables uniquement
--     avec la mention "selon FTMO" / "selon The5ers", jamais comme des faits
--     verifies. C est exactement la faute des "6 400 traders finances" retires
--     de la page Earn2Trade.
--
-- (G) Levier et commissions FTMO, CEO des deux firmes, acquisition d OANDA
--     Source PropFirmMatch, un concurrent. Non ecrit.
--
-- (H) Degradation des retraits The5ers (delais 10-15 jours, avis 1 etoile en
--     hausse). Observation d un tiers sur une periode donnee. Si elle est
--     publiee, elle doit etre attribuee a TheTrustedProp et datee. Pas un fait
--     permanent, donc pas une colonne de donnees.
--
-- (I) THE5ERS, discount_code = 'GDSWCVRTE7'
--     Deja en base, origine inconnue, absent du dossier. Non verifie contre le
--     panneau partenaire. A confirmer ou retirer — voir le cas Funding Pips,
--     ou un identifiant d affiliation etait range dans discount_code.
--
-- (J) FTMO Futures (beta, anglais seulement) et The5ers Futures : produits
--     distincts avec leurs propres regles. Ne pas melanger aux lignes ci-dessus.
