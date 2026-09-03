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
  headquarters         = 'Bureaux Quadrio, Purkynova 2121/3, 110 00 Prague, Republique tcheque',
  country              = 'Czech Republic',
  price_currency       = 'EUR',
  is_regulated         = false,
  regulation_details   = null,
  trustpilot_rating    = 4.8,
  min_price            = 79,
  max_price            = 599,
  max_allocation       = '$200,000',
  is_futures           = false,
  drawdown_type        = 'Varie selon le produit : glissant (1-Step) ou fixe (2-Step)',
  time_limit           = 'Aucune limite de temps, sur les deux produits',
  payout_frequency     = null,
  source_url           = 'https://ftmo.com/fr/trading-objectives/',
  platforms            = '["MetaTrader 4","MetaTrader 5","cTrader"]',
  assets               = '{"Forex CFD","Metals","Indices","Energy","Crypto","Commodities","Stocks"}'::text[],
  payout_methods       = '{"Bank transfer","Crypto","Skrill","Mastercard","Visa Direct"}'::text[],
  included_items       = '{"MetaTrader 4, MetaTrader 5 and cTrader","FTMO trading platform and metrics dashboard","Free retry after a failed Verification phase"}'::text[],
  pros                 = '{"Operating since 2015, one of the longest records in the sector","No time limit on either the 1-Step or the 2-Step","The 1-Step has no minimum trading days","Best-day rule on the 1-Step is a condition to meet, not a breach","Swing account removes news and weekend restrictions once funded","Prices in euros, from 79 EUR"}'::text[],
  cons                 = '{"Maximum funded capital is 200,000 USD, low against futures specialists","The 2-Step requires 4 trading days in each phase","Standard funded account restricts news trading and overnight holding","Swing is not available on the 1-Step","Profit split and scaling terms are not confirmed on the pages consulted"}'::text[],
  special_features     = '{"Two distinct products with genuinely different rules","1-Step: 3% daily loss and an end-of-day trailing drawdown","2-Step: 5% daily loss and a fixed drawdown","The best-day rule applies to the 1-Step only","No news, overnight or weekend restrictions during the evaluation","Payment by card, Apple Pay, Google Pay, PayPal, Revolut Pay, Skrill, bank transfer or crypto"}'::text[],
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"FTMO vend deux produits qu''il faut distinguer avant d''acheter. Le 1-Step est plus souple sur le calendrier mais plus strict au quotidien ; le 2-Step est l''inverse.","points":["Le 1-Step convient si vous ne pouvez pas trader regulierement : aucun jour minimum","Le 2-Step convient si vous supportez mal une limite journaliere serree : 5 % contre 3 %","Evitez le 1-Step si un drawdown qui monte et ne redescend jamais vous gene","Evitez FTMO si vous visez plus de 200 000 $ de capital"]}'::jsonb,
  program_guide        = '{"title":"Deux produits, deux logiques","intro":"Les deux menent a un compte finance. La difference tient au calendrier et a la tolerance quotidienne.","options":[{"name":"1-Step","badge":"Une seule phase","summary":"Un objectif de 10 %, aucun jour minimum, mais une limite journaliere de 3 % et un drawdown qui suit vos plus hauts.","points":["Objectif 10 %","Perte journaliere 3 %","Drawdown glissant en fin de journee","Meilleur jour <= 50 % du profit des jours positifs"]},{"name":"2-Step","badge":"Deux phases","summary":"Objectif de 10 % puis 5 %, une limite journaliere plus large a 5 % et un drawdown fixe, contre 4 jours de trading minimum par phase.","points":["Objectif 10 % puis 5 %","Perte journaliere 5 %","Drawdown fixe","4 jours de trading minimum dans chaque phase"]}]}'::jsonb,
  key_rules            = '{"title":"Les regles qui decident","intro":"Trois points que la plupart des comparateurs rapportent mal.","rules":[{"title":"La perte journaliere differe selon le produit","detail":"3 % sur le 1-Step, 5 % sur le 2-Step. Plusieurs sites annoncent 5 % pour les deux : c''est faux."},{"title":"Le drawdown aussi","detail":"Le 1-Step utilise un drawdown glissant recalcule chaque jour a minuit : il monte avec votre plus haut solde de cloture et ne redescend jamais. Le 2-Step est en drawdown fixe."},{"title":"Depasser la regle du meilleur jour n''est pas une infraction","detail":"Sur le 1-Step, votre meilleure journee doit rester sous 50 % du profit des jours positifs. Au-dessus, vous continuez simplement a trader jusqu a repasser dessous. C''est une condition de validation, pas un couperet."},{"title":"Standard et Swing ne se distinguent que sur le compte finance","detail":"Pendant l''evaluation, aucune restriction sur les annonces macro ni sur les positions overnight ou week-end. Sur le compte finance, le Standard restreint les deux ; le Swing ne restreint rien. Swing n''existe pas sur le 1-Step."}],"more":["Aucune limite de temps sur les deux produits","Aucun jour minimum sur le 1-Step","4 jours de trading minimum par phase sur le 2-Step","Plateformes MT4, MT5 et cTrader","Prix affiches en euros"]}'::jsonb,
  journey              = '{"title":"Ce qui se passe apres le paiement","intro":"Le parcours differe selon le produit choisi.","steps":[{"title":"Evaluation","detail":"Une phase sur le 1-Step, deux sur le 2-Step. Aucune restriction sur les annonces, l''overnight ou le week-end a ce stade."},{"title":"Verification","detail":"Uniquement sur le 2-Step : un second objectif de 5 %, avec les memes limites de risque."},{"title":"FTMO Account","detail":"Le compte finance. C''est ici que le type Standard ou Swing change quelque chose : le Standard restreint les annonces et les positions de nuit, le Swing non."},{"title":"Retraits et scaling","detail":"Un plan de croissance existe, mais ses conditions exactes ne sont pas confirmees sur les pages consultees. A verifier avant de s''engager dessus."}]}'::jsonb,
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
  (gen_random_uuid(), 'ftmo-1-step-10k', 'FTMO 1-Step 10K', 'FTMO', 'ftmo', '$10K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', null, 79, null, null, 'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation : il faut continuer jusqu a repasser dessous.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-25k', 'FTMO 1-Step 25K', 'FTMO', 'ftmo', '$25K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', null, 199, null, null, 'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation : il faut continuer jusqu a repasser dessous.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-50k', 'FTMO 1-Step 50K', 'FTMO', 'ftmo', '$50K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', null, 319, null, null, 'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation : il faut continuer jusqu a repasser dessous.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-1-step-100k', 'FTMO 1-Step 100K', 'FTMO', 'ftmo', '$100K', '1 step', 10, 3, 10, null, 'Glissant en fin de journee', 'Trailing', null, 499, 399.2, null, 'Meilleur jour <= 50 % du profit des jours positifs. Depasser le seuil ne fait pas echouer l evaluation : il faut continuer jusqu a repasser dessous.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-standard-25k', 'FTMO 2-Step Standard 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 250, null, null, 'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-10k', 'FTMO 2-Step Swing 10K', 'FTMO', 'ftmo', '$10K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 99, null, null, 'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-25k', 'FTMO 2-Step Swing 25K', 'FTMO', 'ftmo', '$25K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 279, null, null, 'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-50k', 'FTMO 2-Step Swing 50K', 'FTMO', 'ftmo', '$50K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 379, null, null, 'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'ftmo-2-step-swing-100k', 'FTMO 2-Step Swing 100K', 'FTMO', 'ftmo', '$100K', '2 steps', 10, 5, 10, 5, 'Fixe (statique)', 'Static', null, 599, null, null, 'Aucune regle de regularite. 4 jours de trading minimum dans chaque phase.', true, true, true, 'one-time', 'percent');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       jsonb_array_length(pros) as nb_pros
from prop_firms where slug = 'ftmo';

-- Attendu : 9 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'ftmo' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- PARTAGE DES PROFITS. 80 % de base, 90 % via scaling selon les sources,
-- certaines annoncant 90 % d emblee sur le 1-Step. Non confirme sur les
-- pages officielles consultees. profit_split reste null : mieux vaut une
-- case vide qu un chiffre faux.
--
-- LEVIER, COMMISSIONS, CEO, ACQUISITION D OANDA. Source PropFirmMatch, un
-- concurrent. Non ecrit.
--
-- CHIFFRES DECLARATIFS. 4,5 M de clients, 650 M$ de recompenses, 140 pays,
-- 300 employes. Declarations de la firme sur elle-meme, publiables
-- uniquement avec la mention "selon FTMO".
--
-- FREQUENCE DES RETRAITS, FRAIS DE RESET, REMBOURSEMENT, ENTITE JURIDIQUE.
-- Non trouves.
--
-- FTMO FUTURES existe en beta avec ses propres regles. Ne pas melanger aux
-- lignes ci-dessus.
--
-- FICHE D INTAKE. PropFirmScanner_FTMO_PREFILLED.xlsx porte 37 mentions TO
-- VERIFY : profit split, objectifs, pertes, jours minimum, regle de
-- regularite, frais de reset, remboursement, entite juridique, taux d
-- affiliation. Elle est preremplie depuis les memes sources que le
-- dossier, pas confirmee par FTMO. A leur envoyer telle quelle.
--
-- TRADINGVIEW. La fiche d intake le liste comme plateforme disponible, le
-- dossier le donne "en cours d integration" en aout 2026. Conflit non
-- resolu : non ecrit dans platforms.
--
-- CEO Otakar Suffner et les 78 pays restreints figurent dans la fiche mais
-- proviennent de PropFirmMatch. Non ecrits.
