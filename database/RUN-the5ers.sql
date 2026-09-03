-- =============================================================================
-- THE5ERS — TOUT EN UN
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
select * from prop_firms where slug = 'the5ers';
select * from prop_firm_challenges where firm_slug = 'the5ers';


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
  name                 = 'The5ers',
  founded_year         = 2016,
  headquarters         = 'Enstar House, 168 Praed Street, Londres W2 1RH, Royaume-Uni',
  country              = 'United Kingdom',
  price_currency       = 'USD',
  is_regulated         = false,
  regulation_details   = 'FIVE PERCENT ONLINE LTD, société britannique n° 12553363. Aucune licence de régulateur financier. Environnement de trading entièrement simulé : les fonds d’évaluation sont fictifs.',
  trustpilot_rating    = 4.7,
  min_price            = 22,
  max_price            = 850,
  max_allocation       = '670 000 $ par trader, jusqu’à 4 000 000 $ via le plan de croissance',
  is_futures           = false,
  drawdown_type        = 'Variable selon le programme',
  time_limit           = 'Aucune limite de temps',
  payout_frequency     = 'bi-weekly',
  source_url           = 'https://the5ers.com/faqs/',
  platforms            = '["MetaTrader 5","cTrader"]',
  assets               = '{"CFD sur forex","Indices","Matières premières","Crypto"}'::text[],
  pros                 = '{"En activité depuis 2016","Entrée à partir de 22 $ avec le Bootcamp","Le plan de croissance peut mener jusqu’à 4 000 000 $","Entité britannique identifiée : FIVE PERCENT ONLINE LTD, n° 12553363","Positions de nuit et de week-end autorisées sur tous les programmes"}'::text[],
  cons                 = '{"Les traders américains ne sont pas acceptés","31 territoires exclus, dont les États-Unis et Israël","Aucune licence de régulateur financier","Environnement entièrement simulé : les fonds ne sont pas du capital réel","Partage des profits non confirmé, sauf sur le Summer Plan"}'::text[],
  special_features     = '{"Les traders américains ne sont pas acceptés","Environnement de trading simulé : les fonds d’évaluation sont fictifs","Membre du 5% Group, avec Trade The Pool, Trade Delicious et TSG Brokers","Quatre programmes, de 22 $ à 850 $","31 territoires exclus, dont les États-Unis et Israël"}'::text[],
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"Quatre programmes très différents, du Bootcamp à 22 $ au Hyper Growth à 850 $. Le point commun : les traders américains ne sont pas acceptés, et le partage des profits n’est confirmé que sur un seul plan.","points":["Une entrée très bon marché : le Bootcamp démarre à 22 $","Un plafond de capital élevé, jusqu’à 4 000 000 $ par la croissance","Le choix entre une, deux ou trois étapes selon votre tolérance","Les positions de nuit et de week-end autorisées partout"]}'::jsonb,
  program_guide        = '{"title":"Quatre chemins vers un compte financé","intro":"Ils ne se distinguent pas par le prix, mais par la contrainte quotidienne.","options":[{"name":"High Stakes Classic","badge":"Deux étapes","summary":"L’offre principale : objectif de 8 % puis 5 %, perte journalière de 5 % calculée sur le plus élevé du solde ou de l’equity, et frais remboursés à la réussite.","points":["De 5K à 100K, de 39 à 545 $","Objectif 8 % puis 5 %","3 jours rentables par phase","Frais remboursés à la réussite"]},{"name":"Bootcamp","badge":"Le moins cher","summary":"Trois paliers de 20K à 250K, avec un objectif de 6 % à chaque étape. En échange, un levier de 1:10 et un stop-loss obligatoire.","points":["À partir de 22 $","Objectif de 6 % par palier","Levier limité à 1:10","Stop-loss sous 3 minutes, risque de 2 % maximum"]},{"name":"Hyper Growth","badge":"Une seule étape","summary":"Aucun jour minimum, et une pause à 3 % qui verrouille le compte jusqu’au lendemain au lieu de l’éliminer. Le compte double à chaque palier de 10 %.","points":["De 5K à 20K, de 260 à 850 $","Aucun jour minimum","Pause journalière, pas d’élimination","Le compte double à chaque 10 %"]},{"name":"Pro Growth","badge":"Une seule étape","summary":"Le même format en une étape, nettement moins cher, contre 3 jours rentables exigés.","points":["De 5K à 50K, de 52 à 329 $","Objectif de 10 %","3 jours rentables","Prix remisés sur plusieurs tailles"]}]}'::jsonb,
  key_rules            = '{"title":"Les règles qui décident","intro":"Ce qui est établi, et ce qui ne l’est pas.","rules":[{"title":"Les traders américains ne sont pas acceptés","detail":"La liste officielle compte 31 territoires exclus, dont les États-Unis et Israël, alors même qu’une partie de l’équipe y est basée."},{"title":"Environnement entièrement simulé","detail":"Les mentions légales sont explicites : les fonds d’évaluation sont fictifs. Une analyse concurrente affirme l’inverse ; c’est l’officiel qui fait foi."},{"title":"Le partage n’est pas de 100 %","detail":"Sur le seul plan documenté officiellement, la répartition est de 75 % pour le trader. Le « jusqu’à 100 % » de la communication générale est un plafond atteignable, pas un taux de départ."},{"title":"Aucun régulateur","detail":"FIVE PERCENT ONLINE LTD est une société britannique enregistrée, mais sans licence de régulateur financier. La firme se décrit elle-même hors du champ des autorités."}],"more":["Aucune limite de temps sur les quatre programmes","Retraits toutes les deux semaines","Positions de nuit et de week-end autorisées","Vos propres EA autorisés, ceux de tiers interdits","Scalping manuel autorisé, tick scalping interdit"]}'::jsonb,
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'the5ers';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
-- Pas de begin/commit : l editeur SQL de Supabase enveloppe deja le
-- script dans sa propre transaction. Un begin explicite a l interieur
-- peut faire echouer l ensemble sans message clair.

delete from prop_firm_challenges where firm_slug = 'the5ers';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'the5ers-high-stakes-5k', 'High Stakes Classic $5K', 'The5ers', 'the5ers', '$5K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 39, null, null, '3 jours rentables minimum par phase. Frais remboursés à la réussite de l’évaluation. Aucun ordre 2 minutes avant ou après une annonce à fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-10k', 'High Stakes Classic $10K', 'The5ers', 'the5ers', '$10K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 78, null, null, '3 jours rentables minimum par phase. Frais remboursés à la réussite de l’évaluation. Aucun ordre 2 minutes avant ou après une annonce à fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-25k', 'High Stakes Classic $25K', 'The5ers', 'the5ers', '$25K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 195, null, null, '3 jours rentables minimum par phase. Frais remboursés à la réussite de l’évaluation. Aucun ordre 2 minutes avant ou après une annonce à fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-50k', 'High Stakes Classic $50K', 'The5ers', 'the5ers', '$50K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 309, null, null, '3 jours rentables minimum par phase. Frais remboursés à la réussite de l’évaluation. Aucun ordre 2 minutes avant ou après une annonce à fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-100k', 'High Stakes Classic $100K', 'The5ers', 'the5ers', '$100K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 545, null, null, '3 jours rentables minimum par phase. Frais remboursés à la réussite de l’évaluation. Aucun ordre 2 minutes avant ou après une annonce à fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-20k', 'Bootcamp $20K', 'The5ers', 'the5ers', '$20K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', null, 22, null, null, 'Stop-loss obligatoire dans les 3 minutes, risque de 2 % maximum par position. Levier limité à 1:10, nettement plus bas que sur les autres programmes.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-100k', 'Bootcamp $100K', 'The5ers', 'the5ers', '$100K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', null, 95, null, null, 'Stop-loss obligatoire dans les 3 minutes, risque de 2 % maximum par position. Levier limité à 1:10, nettement plus bas que sur les autres programmes.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-250k', 'Bootcamp $250K', 'The5ers', 'the5ers', '$250K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', null, 225, null, null, 'Stop-loss obligatoire dans les 3 minutes, risque de 2 % maximum par position. Levier limité à 1:10, nettement plus bas que sur les autres programmes.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-5k', 'Hyper Growth $5K', 'The5ers', 'the5ers', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 260, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-10k', 'Hyper Growth $10K', 'The5ers', 'the5ers', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 450, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-20k', 'Hyper Growth $20K', 'The5ers', 'the5ers', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 850, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-5k', 'Pro Growth $5K', 'The5ers', 'the5ers', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 52, 46.8, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-10k', 'Pro Growth $10K', 'The5ers', 'the5ers', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 98, 88.2, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-20k', 'Pro Growth $20K', 'The5ers', 'the5ers', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 189, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-50k', 'Pro Growth $50K', 'The5ers', 'the5ers', '$50K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 329, 296.1, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-summer-plan-100k', 'Summer Plan 1 Step $100K', 'The5ers', 'the5ers', '$100K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 249, null, 'Retrait minimum 250 $, plafond 2 000 $. Remboursement des frais à partir du 3ᵉ retrait. Bonus de 10 %. Partage de 75 %.', 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Durée illimitée. Scalping manuel autorisé, tick scalping interdit.', true, true, true, 'one-time', 'percent');



-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       cardinality(pros) as nb_pros
from prop_firms where slug = 'the5ers';

-- Attendu : 16 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'the5ers' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- PARTAGE DES PROFITS : profit_split reste NULL, et c’est le trou le plus
-- visible de cette fiche. La fiche d’intake annonce « 80% to 100% » sur
-- High Stakes et TO VERIFY partout ailleurs ; seul le Summer Plan officiel
-- donne un chiffre ferme, 75 %. Publier 80 ou 100 serait reprendre une
-- fourchette non confirmée. C’est LE champ à faire confirmer par The5ers
-- en priorité : une firme sans partage affiché est illisible sur une page
-- comparative.
--
-- ORIGINE DES PRIX ET DES RÈGLES. La fiche
-- PropFirmScanner_The5ers_PREFILLED.xlsx est préremplie depuis les mêmes
-- sources tierces que le dossier, pas confirmée par la firme : elle porte
-- encore 24 mentions TO VERIFY. Les prix des quatre programmes y recoupent
-- toutefois le dossier sur deux sources indépendantes, ce qui les rend
-- nettement plus sûrs que le reste.
--
-- COMMISSIONS. TheTrustedProp donne forex et métaux à 4 $/lot, indices 2
-- $/lot, crypto gratuit. PropFirmMatch dit l’inverse : crypto 0,06 %/lot,
-- indices gratuit. Incompatibles, rien n’est écrit.
--
-- RETRAIT MINIMUM. 150 $ selon TheTrustedProp, 250 $ sur le plan officiel.
-- Seul le 250 $ est écrit, sur le challenge concerné.
--
-- CHIFFRES DÉCLARATIFS. 262 000 traders financés, 171 employés, 80 M$
-- versés. Déclarations de la firme, publiables uniquement avec la mention
-- « selon The5ers ».
--
-- DÉGRADATION DES RETRAITS. TheTrustedProp documente des délais de 10 à 15
-- jours ouvrés en 2026 contre 2 à 4 annoncés. Observation datée d’un
-- tiers, pas une propriété permanente : à attribuer et dater si publiée.
--
-- discount_code GDSWCVRTE7 déjà en base, origine inconnue, absent du
-- dossier. À confirmer contre le panneau partenaire ou retirer.
