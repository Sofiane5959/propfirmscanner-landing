-- =============================================================================
-- SAUVEGARDE AVANT MIGRATION — FUTURESELITE
-- =============================================================================
-- A PASSER EN PREMIER, avant RUN-futureselite-programs.sql.
--
-- POURQUOI CE FICHIER EXISTE
--
-- L'editeur SQL de Supabase enveloppe un script dans une transaction : si une
-- commande echoue, tout le fichier est annule. Cela protege d'une migration
-- CASSEE, pas d'une migration REUSSIE qui ecrirait de mauvaises valeurs.
--
-- Or les deux fichiers de migration commencent par des `delete` : sans copie
-- prealable, l'ancien contenu de FuturesElite n'existe plus nulle part. Ce
-- script en fait une copie, et lui seul rend le retour en arriere possible.
--
-- Il est ADDITIF : il ne cree que des tables `_sauv_20260908`, ne modifie
-- aucune ligne existante, et ne touche aucune autre firme.
--
-- Rejouable : chaque table est supprimee puis recreee.
-- =============================================================================

-- 1. Les sept tables normalisees, filtrees sur la seule firme concernee.
drop table if exists fe_sauv_20260908_programs;
create table fe_sauv_20260908_programs as
  select * from firm_programs where firm_slug = 'futureselite';

drop table if exists fe_sauv_20260908_plans;
create table fe_sauv_20260908_plans as
  select pl.* from firm_program_plans pl
  join firm_programs pr on pr.id = pl.program_id
  where pr.firm_slug = 'futureselite';

drop table if exists fe_sauv_20260908_promotions;
create table fe_sauv_20260908_promotions as
  select * from firm_promotions where firm_slug = 'futureselite';

drop table if exists fe_sauv_20260908_bundles;
create table fe_sauv_20260908_bundles as
  select * from firm_program_bundles where firm_slug = 'futureselite';

drop table if exists fe_sauv_20260908_platforms;
create table fe_sauv_20260908_platforms as
  select * from firm_platforms where firm_slug = 'futureselite';

drop table if exists fe_sauv_20260908_rules;
create table fe_sauv_20260908_rules as
  select * from firm_rules where firm_slug = 'futureselite';

drop table if exists fe_sauv_20260908_live_tiers;
create table fe_sauv_20260908_live_tiers as
  select * from firm_live_tiers where firm_slug = 'futureselite';

-- 2. La ligne de `prop_firms` et la grille a plat.
drop table if exists fe_sauv_20260908_prop_firm;
create table fe_sauv_20260908_prop_firm as
  select * from prop_firms where slug = 'futureselite';

drop table if exists fe_sauv_20260908_challenges;
create table fe_sauv_20260908_challenges as
  select * from prop_firm_challenges where firm_slug = 'futureselite';

-- 3. Controle : chaque compteur doit correspondre a ce que la base contient
--    AUJOURD'HUI, avant migration. Note-les : ce sont eux qu'un retour en
--    arriere doit restituer.
select 'programs'     as table_sauvee, count(*) from fe_sauv_20260908_programs
union all select 'plans',        count(*) from fe_sauv_20260908_plans
union all select 'promotions',   count(*) from fe_sauv_20260908_promotions
union all select 'bundles',      count(*) from fe_sauv_20260908_bundles
union all select 'platforms',    count(*) from fe_sauv_20260908_platforms
union all select 'rules',        count(*) from fe_sauv_20260908_rules
union all select 'live_tiers',   count(*) from fe_sauv_20260908_live_tiers
union all select 'prop_firms',   count(*) from fe_sauv_20260908_prop_firm
union all select 'challenges',   count(*) from fe_sauv_20260908_challenges
order by 1;
