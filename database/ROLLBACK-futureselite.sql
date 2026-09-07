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
--    Un `delete` + `insert` casserait les cles etrangeres qui la referencent
--    (favoris, clics d'affiliation, comparaisons). On remet donc les colonnes
--    une par une, sur la ligne existante.
update prop_firms f set
  name = s.name, headline = s.headline, verdict = s.verdict,
  description = s.description, category_badge = s.category_badge,
  website_url = s.website_url, affiliate_url = s.affiliate_url,
  logo_url = s.logo_url, headquarters = s.headquarters, country = s.country,
  price_currency = s.price_currency, is_regulated = s.is_regulated,
  regulation_details = s.regulation_details,
  profit_split = s.profit_split, max_profit_split = s.max_profit_split,
  min_price = s.min_price, max_price = s.max_price,
  is_futures = s.is_futures, drawdown_type = s.drawdown_type,
  time_limit = s.time_limit, payout_frequency = s.payout_frequency,
  leverage_forex = s.leverage_forex,
  platforms = s.platforms, assets = s.assets,
  included_items = s.included_items, pros = s.pros, cons = s.cons,
  special_features = s.special_features,
  value_strip = s.value_strip, key_rules = s.key_rules,
  journey = s.journey, cost_timeline = s.cost_timeline,
  verdict_card = s.verdict_card, program_guide = s.program_guide,
  translations = s.translations,
  discount_code = s.discount_code, discount_percent = s.discount_percent,
  discount_note = s.discount_note, discount_expires_at = s.discount_expires_at,
  trustpilot_rating = s.trustpilot_rating, trustpilot_reviews = s.trustpilot_reviews,
  data_verified_at = s.data_verified_at, data_verified_by = s.data_verified_by,
  source_url = s.source_url,
  updated_at = now()
from fe_sauv_20260908_prop_firm s
where f.slug = 'futureselite';

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
