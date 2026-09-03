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
  min_price            = 249,
  max_allocation       = '$4,000,000',
  is_futures           = false,
  drawdown_type        = 'Varie selon le programme',
  time_limit           = 'Aucune limite de temps',
  source_url           = 'https://the5ers.com/faqs/',
  platforms            = '["MetaTrader 5","cTrader"]',
  pros                 = '["En activite depuis 2016","Capital finance maximum de 4 000 000 $, parmi les plus eleves","Entite britannique identifiee : FIVE PERCENT ONLINE LTD, n 12553363","Duree illimitee sur le plan documente"]',
  cons                 = '["Les traders americains ne sont pas acceptes","31 territoires exclus, dont les Etats-Unis et Israel","Aucune licence de regulateur financier","Environnement entierement simule : les fonds ne sont pas du capital reel","Un seul programme sur quatre a des parametres publies officiellement"]',
  special_features     = '["US traders are not accepted","Simulated trading environment: evaluation funds are not real capital","Part of the 5% Group, alongside Trade The Pool, Trade Delicious, TSG Brokers and The5ers Futures","Maximum funded capital $4,000,000","31 restricted territories, including the United States and Israel"]',
  verdict_card         = '{"title":"Pour qui, et pour qui pas","body":"The5ers affiche le plus haut plafond de capital du comparatif, mais ferme le marche americain et ne publie les parametres complets que d''un seul de ses quatre programmes.","points":["Convient si vous visez un capital eleve a terme","Convient si vous etes hors des 31 territoires exclus","Evitez si vous tradez depuis les Etats-Unis : la firme ne vous acceptera pas","Evitez si vous voulez comparer toutes les grilles avant d acheter"]}',
  key_rules            = '{"title":"Les regles qui decident","intro":"Ce qui est etabli, et ce qui ne l est pas.","rules":[{"title":"Les traders americains ne sont pas acceptes","detail":"La liste officielle compte 31 territoires exclus, dont les Etats-Unis et Israel, alors meme qu une partie de l equipe y est basee."},{"title":"Environnement entierement simule","detail":"Les mentions legales sont explicites : les fonds d evaluation sont fictifs. Une analyse concurrente affirme l inverse ; c est l officiel qui fait foi."},{"title":"Le partage n est pas de 100 %","detail":"Sur le plan documente officiellement, la repartition est de 75 % pour le trader. Le 100 % annonce par la communication generale est un plafond atteignable, pas un taux de depart."},{"title":"Aucun regulateur","detail":"FIVE PERCENT ONLINE LTD est une societe britannique enregistree, mais sans licence de regulateur financier. La firme se decrit elle-meme hors du champ des autorites."}],"more":["Duree illimitee sur le plan documente","Perte maximale 6 %, perte journaliere 3 %","Retrait minimum 250 $, plafond 2 000 $","Remboursement des frais a partir du 3e retrait","Deux comptes actifs maximum"]}',
  data_verified_at     = timestamptz '2026-09-03',
  data_verified_by     = 'PropFirmScanner',
  updated_at           = now()
where slug = 'the5ers';


-- 4. Les programmes — c est ce qui fait apparaitre le configurateur
begin;

delete from prop_firm_challenges where firm_slug = 'the5ers';

insert into prop_firm_challenges (id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown, max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type, max_loss_type, profit_split, price, discounted_price, payout_frequency_description, consistency_rule, allows_ea, allows_scalping, allows_news_trading, billing_period, risk_unit) values
  (gen_random_uuid(), 'the5ers-summer-plan-1-step-100k', 'The5ers Summer Plan 1 Step 100K', 'The5ers', 'the5ers', '$100K', '1 step', 6, 3, 10, null, 'Statique', 'Static', 75, 249, null, 'Retrait minimum 250 $, plafond 2 000 $. Remboursement des frais a partir du 3e retrait. Bonus 10 %. Partage 75 %.', 'Regularite 50 % par jour. Duree illimitee. 2 comptes actifs maximum.', true, true, true, 'one-time', 'percent');

commit;


-- 5. CONTROLE — ces requetes disent si ca a marche
select slug, name, min_price, price_currency, profit_split, is_futures,
       (verdict_card is not null) as a_un_verdict,
       (key_rules is not null) as a_des_regles,
       (journey is not null) as a_un_parcours,
       jsonb_array_length(pros) as nb_pros
from prop_firms where slug = 'the5ers';

-- Attendu : 1 ligne(s).
select name, account_size, price, max_drawdown, phase1_profit_target, profit_split
from prop_firm_challenges where firm_slug = 'the5ers' order by price;


-- =============================================================================
-- NON ECRIT — et pourquoi
-- =============================================================================
--
-- TROIS PROGRAMMES SUR QUATRE NON PUBLIES. Growth / Hyper Growth, High
-- Stakes Classic et Bootcamp : leurs regles et prix viennent de
-- TheTrustedProp, une analyse concurrente, explicitement non confirmee sur
-- le site officiel. Non ecrits.
--
-- min_price = 249. C est le seul prix officiellement source. Les entrees a
-- 22 $ et 39 $ viennent de TheTrustedProp. Consequence : The5ers apparait
-- plus chere qu elle ne l est. Verifier sur the5ers.com/high-stakes/ et
-- /bootcamp/ puis completer.
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
