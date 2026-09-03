-- =============================================================================
-- FTMO — TOUT EN UN
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
select * from prop_firms where slug = 'ftmo';
select * from prop_firm_challenges where firm_slug = 'ftmo';


-- 2. Colonnes necessaires (sans effet si elles existent deja)
alter table prop_firms add column if not exists price_currency text default 'USD';
alter table prop_firms add column if not exists data_verified_at timestamptz;
alter table prop_firms add column if not exists data_verified_by text;
alter table prop_firms add column if not exists source_url text;
alter table prop_firms add column if not exists rating_checked_at timestamptz;
alter table prop_firms add column if not exists discount_status text;
alter table prop_firms add column if not exists discount_starts_at timestamptz;


-- 3. La firme : identite, contenu editorial, listes
update prop_firms set
  name                 = 'FTMO',
  founded_year         = 2015,
  headquarters         = 'Bureaux Quadrio, Purkyňova 2121/3, 110 00 Prague, République tchèque',
  country              = 'Czech Republic',
  price_currency       = 'EUR',
  is_regulated         = false,
  regulation_details   = null,
  trustpilot_rating    = 4.8,
  min_price            = 79,
  max_price            = 599,
  max_allocation       = '200 000 $',
  is_futures           = false,
  drawdown_type        = 'Variable selon le produit : glissant (1-Step) ou fixe (2-Step)',
  time_limit           = 'Aucune limite de temps, sur les deux produits',
  payout_frequency     = null,
  source_url           = 'https://ftmo.com/fr/trading-objectives/',
  platforms            = '["MetaTrader 4","MetaTrader 5","cTrader"]',
  assets               = '{"CFD sur forex","Métaux","Indices","Énergie","Crypto","Matières premières","Actions"}'::text[],
  payout_methods       = '{"Virement bancaire","Crypto","Skrill","Mastercard","Visa Direct"}'::text[],
  included_items       = '{"MetaTrader 4, MetaTrader 5 et cTrader","Tableau de bord FTMO et métriques de performance","Nouvel essai gratuit après un échec en phase de vérification"}'::text[],
  pros                 = '{"En activité depuis 2015, l’un des plus longs historiques du secteur","Aucune limite de temps, ni sur le 1-Step ni sur le 2-Step","Le 1-Step n’impose aucun jour de trading minimum","Dépasser la règle du meilleur jour ne fait pas échouer l’évaluation","Le compte Swing lève les restrictions d’actualités et de week-end une fois financé","Prix en euros, à partir de 79 €"}'::text[],
  cons                 = '{"Capital financé plafonné à 200 000 $, faible face aux spécialistes des futures","Le 2-Step exige 4 jours de trading dans chaque phase","Le compte financé Standard restreint les annonces et les positions de nuit","Swing n’existe pas sur le 1-Step","Partage des profits et conditions de scaling non confirmés sur les pages consultées"}'::text[],
  special_features     = '{"Deux produits aux règles réellement différentes","1-Step : perte journalière de 3 % et drawdown glissant en fin de journée","2-Step : perte journalière de 5 % et drawdown fixe","La règle du meilleur jour ne s’applique qu’au 1-Step","Aucune restriction d’actualités, de nuit ou de week-end pendant l’évaluation","Paiement par carte, Apple Pay, Google Pay, PayPal, Revolut Pay, Skrill, virement ou crypto"}'::text[],
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"FTMO vend deux produits qu’il faut distinguer avant d’acheter. Le 1-Step est plus souple sur le calendrier mais plus strict au quotidien ; le 2-Step fait l’inverse. Le capital plafonne à 200 000 $.","points":["Un parcours sans contrainte de calendrier : le 1-Step n’impose aucun jour minimum","Une limite journalière confortable : 5 % sur le 2-Step, contre 3 % sur le 1-Step","La liberté de garder vos positions la nuit et le week-end, avec le compte Swing","Un opérateur installé depuis 2015, avec MT4, MT5 et cTrader"]}'::jsonb,
  program_guide        = '{"title":"Deux produits, deux logiques","intro":"Les deux mènent à un compte financé. La différence tient au calendrier et à la tolérance quotidienne.","options":[{"name":"1-Step","badge":"Une seule phase","summary":"Un objectif de 10 %, aucun jour minimum, mais une limite journalière de 3 % et un drawdown qui suit vos plus hauts.","points":["Objectif de 10 %","Perte journalière de 3 %","Drawdown glissant en fin de journée","Meilleur jour ≤ 50 % du profit des jours positifs"]},{"name":"2-Step","badge":"Deux phases","summary":"Objectif de 10 % puis 5 %, une limite journalière plus large à 5 % et un drawdown fixe, contre 4 jours de trading minimum par phase.","points":["Objectif de 10 % puis 5 %","Perte journalière de 5 %","Drawdown fixe","4 jours de trading minimum dans chaque phase"]}]}'::jsonb,
  key_rules            = '{"title":"Les règles qui décident","intro":"Quatre points que la plupart des comparateurs rapportent mal.","rules":[{"title":"La perte journalière diffère selon le produit","detail":"3 % sur le 1-Step, 5 % sur le 2-Step. Plusieurs sites annoncent 5 % pour les deux : c’est faux."},{"title":"Le drawdown aussi","detail":"Le 1-Step utilise un drawdown glissant recalculé chaque jour à minuit : il monte avec votre plus haut solde de clôture et ne redescend jamais. Le 2-Step est en drawdown fixe."},{"title":"Dépasser la règle du meilleur jour n’est pas une infraction","detail":"Sur le 1-Step, votre meilleure journée doit rester sous 50 % du profit des jours positifs. Au-dessus, vous continuez simplement à trader jusqu’à repasser dessous. C’est une condition de validation, pas un couperet."},{"title":"Standard et Swing ne se distinguent que sur le compte financé","detail":"Pendant l’évaluation, aucune restriction sur les annonces macro ni sur les positions de nuit ou de week-end. Sur le compte financé, le Standard restreint les deux ; le Swing ne restreint rien. Swing n’existe pas sur le 1-Step."}],"more":["Aucune limite de temps sur les deux produits","Aucun jour minimum sur le 1-Step","4 jours de trading minimum par phase sur le 2-Step","Plateformes MT4, MT5 et cTrader","Prix affichés en euros"]}'::jsonb,
  journey              = '{"title":"Ce qui se passe après le paiement","intro":"Le parcours diffère selon le produit choisi.","steps":[{"title":"Évaluation","detail":"Une phase sur le 1-Step, deux sur le 2-Step. Aucune restriction sur les annonces, les positions de nuit ou de week-end à ce stade."},{"title":"Vérification","detail":"Uniquement sur le 2-Step : un second objectif de 5 %, avec les mêmes limites de risque."},{"title":"Compte FTMO","detail":"Le compte financé. C’est ici que le type Standard ou Swing change quelque chose : le Standard restreint les annonces et les positions de nuit, le Swing non."},{"title":"Retraits et scaling","detail":"Un plan de croissance existe, mais ses conditions exactes ne sont pas confirmées sur les pages consultées. À vérifier avant de s’engager dessus."}]}'::jsonb,
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'ftmo';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'ftmo';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'ftmo-1-step-10k', 'FTMO 1-Step 10K', 'FTMO', 'ftmo', '$10K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', null, 79, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-25k', 'FTMO 1-Step 25K', 'FTMO', 'ftmo', '$25K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', null, 199, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-50k', 'FTMO 1-Step 50K', 'FTMO', 'ftmo', '$50K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', null, 319, null, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-100k', 'FTMO 1-Step 100K', 'FTMO', 'ftmo', '$100K', '1 step', 10, 3, 10, null, 'Glissant en fin de journée', 'Trailing', null, 499, 399.2, null, 'Meilleur jour ≤ 50 % du profit des jours positifs. Dépasser le seuil ne fait pas échouer l’évaluation : il faut continuer jusqu’à repasser dessous. Aucun jour de trading minimum.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 250, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', 'FTMO', 'ftmo', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 99, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 279, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', 'FTMO', 'ftmo', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 379, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', 'FTMO', 'ftmo', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 599, null, null, 'Aucune règle de régularité. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros
from prop_firms where slug = 'ftmo';

-- Attendu : 9 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'ftmo' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- PARTAGE DES PROFITS. 80 % de base, 90 % via le scaling selon les
-- sources, certaines annonçant 90 % d’emblée sur le 1-Step. Non confirmé
-- sur les pages officielles consultées. profit_split reste null : mieux
-- vaut une case vide qu’un chiffre faux.
--
-- LEVIER, COMMISSIONS, CEO, ACQUISITION D’OANDA. Source PropFirmMatch, un
-- concurrent. Non écrits.
--
-- CHIFFRES DÉCLARATIFS. 4,5 M de clients, 650 M$ de récompenses, 140 pays,
-- 300 employés. Déclarations de la firme sur elle-même, publiables
-- uniquement avec la mention « selon FTMO ».
--
-- FICHE D’INTAKE. PropFirmScanner_FTMO_PREFILLED.xlsx porte 37 mentions TO
-- VERIFY : profit split, objectifs, pertes, jours minimum, règle de
-- régularité, frais de reset, remboursement, entité juridique, taux
-- d’affiliation. Elle est préremplie depuis les mêmes sources que le
-- dossier, pas confirmée par FTMO. À leur envoyer telle quelle.
--
-- TRADINGVIEW. La fiche d’intake le liste comme plateforme disponible, le
-- dossier le donne « en cours d’intégration » en août 2026. Conflit non
-- résolu : non écrit dans platforms.
--
-- FTMO FUTURES existe en bêta avec ses propres règles. Ne pas mélanger aux
-- lignes ci-dessus.
