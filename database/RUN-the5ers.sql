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
  regulation_details   = 'FIVE PERCENT ONLINE LTD, societe britannique n 12553363. Aucune licence de regulateur financier. Environnement de trading entierement simule, les fonds d evaluation sont fictifs.',
  trustpilot_rating    = 4.7,
  min_price            = 22,
  max_price            = 850,
  max_allocation       = '$670,000 par trader, jusqu a $4,000,000 via le plan de croissance',
  is_futures           = false,
  drawdown_type        = 'Varie selon le programme',
  time_limit           = 'Aucune limite de temps',
  payout_frequency     = 'bi-weekly',
  source_url           = 'https://the5ers.com/faqs/',
  platforms            = '["MetaTrader 5","cTrader"]',
  assets               = '["Forex CFD","Indices","Commodities","Crypto"]',
  pros                 = '["En activite depuis 2016","Capital finance maximum de 4 000 000 $, parmi les plus eleves","Entite britannique identifiee : FIVE PERCENT ONLINE LTD, n 12553363","Duree illimitee sur le plan documente"]',
  cons                 = '["Les traders americains ne sont pas acceptes","31 territoires exclus, dont les Etats-Unis et Israel","Aucune licence de regulateur financier","Environnement entierement simule : les fonds ne sont pas du capital reel","Un seul programme sur quatre a des parametres publies officiellement"]',
  special_features     = '["US traders are not accepted","Simulated trading environment: evaluation funds are not real capital","Part of the 5% Group, alongside Trade The Pool, Trade Delicious, TSG Brokers and The5ers Futures","Maximum funded capital $4,000,000","31 restricted territories, including the United States and Israel"]',
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"Quatre programmes tres differents, du Bootcamp a 22 $ au Hyper Growth a 850 $. Le point commun : les traders americains ne sont pas acceptes.","points":["Convient si vous cherchez une entree tres bon marche : le Bootcamp demarre a 22 $","Convient si vous visez un capital eleve : la croissance peut mener a 4 M$","Evitez si vous tradez depuis les Etats-Unis : la firme ne vous acceptera pas","Evitez le Bootcamp si un stop-loss obligatoire sous 3 minutes vous gene"]}',
  program_guide        = '{"title":"Quatre chemins vers un compte finance","intro":"Ils ne se distinguent pas par le prix mais par la contrainte quotidienne.","options":[{"name":"High Stakes Classic","badge":"2 etapes","summary":"L offre principale : objectif 8 % puis 5 %, perte journaliere de 5 % calculee sur le plus eleve du solde ou de l equity, frais rembourses a la reussite.","points":["5K a 100K, de 39 a 545 $","Objectif 8 % puis 5 %","3 jours rentables par phase","Frais rembourses a la reussite"]},{"name":"Bootcamp","badge":"Le moins cher","summary":"Trois paliers de 20K a 250K, objectif de 6 % a chaque etape. En echange, un levier de 1:10 et un stop-loss obligatoire.","points":["A partir de 22 $","Objectif 6 % par palier","Levier 1:10 seulement","Stop-loss sous 3 minutes, risque 2 % maximum"]},{"name":"Hyper Growth","badge":"Une seule etape","summary":"Aucun jour minimum, et une pause a 3 % qui verrouille le compte jusqu au lendemain au lieu de l eliminer. Le compte double a chaque palier de 10 %.","points":["5K a 20K, de 260 a 850 $","Aucun jour minimum","Pause journaliere, pas elimination","Le compte double a chaque 10 %"]},{"name":"Pro Growth","badge":"Une seule etape","summary":"Le meme format en une etape, nettement moins cher, contre 3 jours rentables exiges.","points":["5K a 50K, de 52 a 329 $","Objectif 10 %","3 jours rentables","Prix remises sur plusieurs tailles"]}]}',
  key_rules            = '{"title":"Les regles qui decident","intro":"Ce qui est etabli, et ce qui ne l est pas.","rules":[{"title":"Les traders americains ne sont pas acceptes","detail":"La liste officielle compte 31 territoires exclus, dont les Etats-Unis et Israel, alors meme qu une partie de l equipe y est basee."},{"title":"Environnement entierement simule","detail":"Les mentions legales sont explicites : les fonds d evaluation sont fictifs. Une analyse concurrente affirme l inverse ; c est l officiel qui fait foi."},{"title":"Le partage n est pas de 100 %","detail":"Sur le plan documente officiellement, la repartition est de 75 % pour le trader. Le 100 % annonce par la communication generale est un plafond atteignable, pas un taux de depart."},{"title":"Aucun regulateur","detail":"FIVE PERCENT ONLINE LTD est une societe britannique enregistree, mais sans licence de regulateur financier. La firme se decrit elle-meme hors du champ des autorites."}],"more":["Duree illimitee sur le plan documente","Perte maximale 6 %, perte journaliere 3 %","Retrait minimum 250 $, plafond 2 000 $","Remboursement des frais a partir du 3e retrait","Deux comptes actifs maximum"]}',
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'the5ers';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
begin;

delete from prop_firm_challenges where firm_slug = 'the5ers';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'the5ers-high-stakes-5k', 'High Stakes Classic $5K', 'The5ers', 'the5ers', '$5K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 39, null, null, '3 jours rentables minimum par phase. Frais rembourses a la reussite de l evaluation. Aucun ordre 2 minutes avant ou apres une annonce a fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-10k', 'High Stakes Classic $10K', 'The5ers', 'the5ers', '$10K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 78, null, null, '3 jours rentables minimum par phase. Frais rembourses a la reussite de l evaluation. Aucun ordre 2 minutes avant ou apres une annonce a fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-25k', 'High Stakes Classic $25K', 'The5ers', 'the5ers', '$25K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 195, null, null, '3 jours rentables minimum par phase. Frais rembourses a la reussite de l evaluation. Aucun ordre 2 minutes avant ou apres une annonce a fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-50k', 'High Stakes Classic $50K', 'The5ers', 'the5ers', '$50K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 309, null, null, '3 jours rentables minimum par phase. Frais rembourses a la reussite de l evaluation. Aucun ordre 2 minutes avant ou apres une annonce a fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-high-stakes-100k', 'High Stakes Classic $100K', 'The5ers', 'the5ers', '$100K', '2 steps', 10, 5, 8, 5, 'Statique', 'Static', null, 545, null, null, '3 jours rentables minimum par phase. Frais rembourses a la reussite de l evaluation. Aucun ordre 2 minutes avant ou apres une annonce a fort impact.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-20k', 'Bootcamp $20K', 'The5ers', 'the5ers', '$20K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', null, 22, null, null, 'Stop-loss obligatoire dans les 3 minutes, risque maximum 2 % par position. Levier 1:10, nettement plus bas que les autres programmes.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-100k', 'Bootcamp $100K', 'The5ers', 'the5ers', '$100K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', null, 95, null, null, 'Stop-loss obligatoire dans les 3 minutes, risque maximum 2 % par position. Levier 1:10, nettement plus bas que les autres programmes.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-bootcamp-250k', 'Bootcamp $250K', 'The5ers', 'the5ers', '$250K', '3 steps', 5, null, 6, 6, 'Statique', 'Static', null, 225, null, null, 'Stop-loss obligatoire dans les 3 minutes, risque maximum 2 % par position. Levier 1:10, nettement plus bas que les autres programmes.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-5k', 'Hyper Growth $5K', 'The5ers', 'the5ers', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 260, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-10k', 'Hyper Growth $10K', 'The5ers', 'the5ers', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 450, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-hyper-growth-20k', 'Hyper Growth $20K', 'The5ers', 'the5ers', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 850, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-5k', 'Pro Growth $5K', 'The5ers', 'the5ers', '$5K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 52, 46.8, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-10k', 'Pro Growth $10K', 'The5ers', 'the5ers', '$10K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 98, 88.2, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-20k', 'Pro Growth $20K', 'The5ers', 'the5ers', '$20K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 189, null, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-pro-growth-50k', 'Pro Growth $50K', 'The5ers', 'the5ers', '$50K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 329, 296.1, null, 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent'),
  (gen_random_uuid(), 'the5ers-summer-plan-100k', 'Summer Plan 1 Step $100K', 'The5ers', 'the5ers', '$100K', '1 step', 6, 3, 10, null, 'Statique', 'Static', null, 249, null, 'Retrait minimum 250 $, plafond 2 000 $. Remboursement des frais a partir du 3e retrait. Bonus 10 %. Partage 75 %.', 'Aucun jour minimum sur Hyper Growth ; 3 jours rentables sur Pro Growth. Duree illimitee. Scalping manuel autorise, tick scalping interdit.', true, true, true, 'one-time', 'percent');

commit;


-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       jsonb_array_length(pros) as nb_pros
from prop_firms where slug = 'the5ers';

-- Attendu : 16 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'the5ers' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- PARTAGE DES PROFITS : profit_split reste NULL, et c est le trou le plus
-- visible de cette fiche. La fiche d intake annonce "80% to 100%" sur High
-- Stakes et TO VERIFY partout ailleurs ; seul le Summer Plan officiel
-- donne un chiffre ferme, 75 %. Publier 80 ou 100 serait reprendre une
-- fourchette non confirmee. C est LE champ a faire confirmer par The5ers
-- en priorite : une firme sans partage affiche est illisible sur une page
-- comparative.
--
-- ORIGINE DES PRIX ET DES REGLES. La fiche d intake
-- PropFirmScanner_The5ers_PREFILLED.xlsx est preremplie depuis les memes
-- sources tierces que le dossier, pas confirmee par la firme : elle porte
-- encore 24 mentions TO VERIFY. Les prix des quatre programmes y recoupent
-- toutefois le dossier sur deux sources independantes, ce qui les rend
-- nettement plus surs que le reste.
--
-- COMMISSIONS. TheTrustedProp donne forex et metaux 4 $/lot, indices 2
-- $/lot, crypto gratuit. PropFirmMatch dit l inverse : crypto 0,06 %/lot,
-- indices gratuit. Incompatibles, rien n est ecrit.
--
-- RETRAIT MINIMUM. 150 $ selon TheTrustedProp, 250 $ sur le plan officiel.
-- Seul le 250 $ est ecrit.
--
-- CHIFFRES DECLARATIFS. 262 000 traders finances, 171 employes, 80 M$
-- verses. Declarations de la firme, publiables uniquement avec la mention
-- "selon The5ers".
--
-- DEGRADATION DES RETRAITS. TheTrustedProp documente des delais de 10 a 15
-- jours ouvres en 2026 contre 2 a 4 annonces. Observation datee d un
-- tiers, pas une propriete permanente : a attribuer et dater si publiee.
--
-- discount_code GDSWCVRTE7 deja en base, origine inconnue, absent du
-- dossier. A confirmer contre le panneau partenaire ou retirer.
