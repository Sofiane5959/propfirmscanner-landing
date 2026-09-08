-- =============================================================================
-- RETOUR EN ARRIERE — FUTURESELITE
-- =============================================================================
-- A NE PASSER QUE si une requete de verification donne un resultat incorrect.
--
-- PREREQUIS ABSOLU : RUN-00-sauvegarde-avant-migration.sql doit avoir ete
-- passe AVANT les migrations. Sans les tables `fe_sauv_20260908_*`, ce fichier
-- ne peut rien restaurer — il echouera d'ailleurs des la premiere commande,
-- ce qui vaut mieux qu'un effacement silencieux.
--
-- Portee : `futureselite` uniquement. Aucune autre firme n'est touchee.
--
-- L'editeur Supabase enveloppe le tout dans une transaction : si une commande
-- echoue, rien n'est applique et la base reste dans l'etat post-migration.
-- =============================================================================

-- 0. Garde-fou : sans sauvegarde, on s'arrete ici plutot que de vider les
--    tables sans pouvoir les remplir.
do $$
begin
  if to_regclass('public.fe_sauv_20260908_programs') is null then
    raise exception
      'Aucune sauvegarde trouvee. Passe RUN-00-sauvegarde-avant-migration.sql AVANT toute migration. Rien n a ete modifie.';
  end if;
end $$;

-- 1. Vider l'etat courant de la firme, dans l'ordre des dependances.
delete from firm_program_plans
where  program_id in (select id from firm_programs where firm_slug = 'futureselite');
delete from firm_programs        where firm_slug = 'futureselite';
delete from firm_promotions      where firm_slug = 'futureselite';
delete from firm_program_bundles where firm_slug = 'futureselite';
delete from firm_platforms       where firm_slug = 'futureselite';
delete from firm_rules           where firm_slug = 'futureselite';
delete from firm_live_tiers      where firm_slug = 'futureselite';
delete from prop_firm_challenges where firm_slug = 'futureselite';

-- 2. Restaurer. Les programmes d'abord : les plans referencent leur `id`.
insert into firm_programs        select * from fe_sauv_20260908_programs;
insert into firm_program_plans   select * from fe_sauv_20260908_plans;
insert into firm_promotions      select * from fe_sauv_20260908_promotions;
insert into firm_program_bundles select * from fe_sauv_20260908_bundles;
insert into firm_platforms       select * from fe_sauv_20260908_platforms;
insert into firm_rules           select * from fe_sauv_20260908_rules;
insert into firm_live_tiers      select * from fe_sauv_20260908_live_tiers;
insert into prop_firm_challenges select * from fe_sauv_20260908_challenges;

-- 3. Restaurer la ligne de `prop_firms`.
--
--    POURQUOI CE BLOC EST DYNAMIQUE
--
--    La version precedente listait les colonnes a la main. Elle en avait
--    oublie une — `payout_methods` — parce que la migration en a gagne une
--    apres l'ecriture du rollback. Une liste ecrite a la main derive
--    fatalement de la migration qu'elle est censee annuler.
--
--    Ce bloc lit donc les colonnes REELLEMENT communes aux deux tables et les
--    restaure toutes. Il ne peut plus rater une colonne ajoutee plus tard.
--
--    `id`, `slug` et `created_at` sont exclus : ils identifient la ligne. Un
--    `delete` + `insert` aurait ete plus simple mais casserait les cles
--    etrangeres qui referencent cette firme — favoris, clics d'affiliation,
--    comparaisons enregistrees. Un retour en arriere ne doit pas couter plus
--    cher que le probleme qu'il repare.
do $$
declare
  colonnes text;
begin
  select string_agg(format('%I = s.%I', c.column_name, c.column_name), ', ')
    into colonnes
  from   information_schema.columns c
  join   information_schema.columns b
         on  b.table_name   = 'fe_sauv_20260908_prop_firm'
         and b.table_schema = 'public'
         and b.column_name  = c.column_name
  where  c.table_name   = 'prop_firms'
    and  c.table_schema = 'public'
    -- `updated_at` est EXCLUE de la liste dynamique parce qu'elle est
    -- assignee explicitement plus bas. Sans cette exclusion, Postgres voit
    -- deux affectations de la meme colonne et refuse la requete :
    --   42601 multiple assignments to same column "updated_at"
    --
    -- On la met a `now()` plutot que de restaurer l'ancienne valeur : la
    -- ligne vient reellement d'etre modifiee, et le dire est plus utile
    -- que de faire croire qu'elle n'a pas bouge depuis la migration.
    and  c.column_name not in ('id', 'slug', 'created_at', 'updated_at');

  if colonnes is null then
    raise exception 'Aucune colonne commune trouvee. Sauvegarde incomplete : rien restaure.';
  end if;

  execute format(
    'update prop_firms f set %s, updated_at = now() from fe_sauv_20260908_prop_firm s where f.slug = %L',
    colonnes, 'futureselite'
  );

  raise notice 'prop_firms restauree.';
end $$;

-- 4. Controle : ces compteurs doivent redonner EXACTEMENT ceux notes lors de
--    la sauvegarde.
select 'programs'   as objet, count(*) from firm_programs        where firm_slug = 'futureselite'
union all select 'plans',      count(*) from firm_program_plans pl
                                        join firm_programs pr on pr.id = pl.program_id
                                        where pr.firm_slug = 'futureselite'
union all select 'promotions', count(*) from firm_promotions      where firm_slug = 'futureselite'
union all select 'bundles',    count(*) from firm_program_bundles where firm_slug = 'futureselite'
union all select 'platforms',  count(*) from firm_platforms       where firm_slug = 'futureselite'
union all select 'rules',      count(*) from firm_rules           where firm_slug = 'futureselite'
union all select 'live_tiers', count(*) from firm_live_tiers      where firm_slug = 'futureselite'
union all select 'challenges', count(*) from prop_firm_challenges where firm_slug = 'futureselite'
order by 1;

-- 5. Une fois le retour valide et la cause comprise, les tables de sauvegarde
--    peuvent etre supprimees. NE PAS le faire avant : ce sont elles qui
--    autorisent un second essai.
--
--   drop table fe_sauv_20260908_programs, fe_sauv_20260908_plans,
--              fe_sauv_20260908_promotions, fe_sauv_20260908_bundles,
--              fe_sauv_20260908_platforms, fe_sauv_20260908_rules,
--              fe_sauv_20260908_live_tiers, fe_sauv_20260908_prop_firm,
--              fe_sauv_20260908_challenges;
