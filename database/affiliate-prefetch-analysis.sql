-- =============================================================================
-- ANALYSE DE L'HISTORIQUE affiliate_clicks — LECTURE SEULE
-- =============================================================================
-- Aucune de ces requetes ne modifie quoi que ce soit. L'UPDATE est en
-- commentaire en fin de fichier et ne doit etre passe qu'apres validation
-- du motif.
--
-- Contexte : le bandeau d'offres (PromoTicker, monte dans le layout racine)
-- rendait ses liens sortants avec next/link. Le routeur App Router les
-- prechargeait des leur entree dans le viewport, sur CHAQUE page du site.
-- Signature attendue : un meme ip_hash touchant plusieurs firmes differentes
-- dans la meme seconde, avec source = 'banner'.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Ampleur : repartition par source, avant / apres le correctif
-- -----------------------------------------------------------------------------
-- click_id est NULL sur tout ce qui precede le tunnel d'attribution.
select
  coalesce(source, 'unknown')                as source,
  count(*)                                   as total,
  count(*) filter (where click_id is null)   as avant_correctif,
  count(*) filter (where click_id is not null) as apres_correctif,
  count(distinct firm_slug)                  as firmes,
  count(distinct ip_hash)                    as visiteurs_distincts,
  min(created_at)::date                      as premier,
  max(created_at)::date                      as dernier
from affiliate_clicks
group by 1
order by total desc;


-- -----------------------------------------------------------------------------
-- 2. Detection : plusieurs firmes touchees par le meme ip_hash dans la meme seconde
-- -----------------------------------------------------------------------------
-- C'est le motif a valider. Un humain ne clique pas trois offres differentes
-- dans la meme seconde ; un prechargement de bandeau, si.
select
  date_trunc('second', created_at)                        as seconde,
  ip_hash,
  count(*)                                                as lignes,
  count(distinct firm_slug)                               as firmes_distinctes,
  string_agg(distinct source, ', ')                       as sources,
  string_agg(distinct firm_slug, ', ')                    as firmes
from affiliate_clicks
where click_id is null
group by 1, 2
having count(distinct firm_slug) > 1
order by firmes_distinctes desc, seconde desc
limit 100;


-- -----------------------------------------------------------------------------
-- 3. Combien de lignes le motif capturerait-il au total ?
-- -----------------------------------------------------------------------------
-- A comparer aux 963 lignes annoncees par le dashboard avant correctif.
with rafales as (
  select date_trunc('second', created_at) as seconde, ip_hash
  from affiliate_clicks
  where click_id is null
  group by 1, 2
  having count(distinct firm_slug) > 1
)
select
  (select count(*) from affiliate_clicks)                    as total_table,
  (select count(*) from affiliate_clicks where click_id is null) as avant_correctif,
  count(c.*)                                                 as capturees_par_le_motif,
  round(100.0 * count(c.*)
        / nullif((select count(*) from affiliate_clicks where click_id is null), 0), 1)
                                                             as pct_de_l_historique
from rafales r
join affiliate_clicks c
  on c.ip_hash = r.ip_hash
 and date_trunc('second', c.created_at) = r.seconde
 and c.click_id is null;


-- -----------------------------------------------------------------------------
-- 4. Controle de sensibilite : ce que le motif laisserait passer
-- -----------------------------------------------------------------------------
-- Les lignes source='banner' NON capturees (un seul deal visible, ou un seul
-- ip_hash isole). A regarder avant de valider : si ce nombre est eleve, le
-- motif est trop etroit et sous-estime le bruit.
select count(*) as banner_non_capturees
from affiliate_clicks c
where c.click_id is null
  and c.source = 'banner'
  and not exists (
    select 1
    from affiliate_clicks o
    where o.ip_hash = c.ip_hash
      and o.click_id is null
      and date_trunc('second', o.created_at) = date_trunc('second', c.created_at)
      and o.firm_slug <> c.firm_slug
  );


-- =============================================================================
-- 5. MARQUAGE — NE PAS PASSER AVANT VALIDATION DU MOTIF
-- =============================================================================
-- Decommenter seulement apres avoir regarde les requetes 2, 3 et 4.
-- Aucune suppression : on marque, on n'efface pas.
--
-- update affiliate_clicks c
-- set is_prefetch = true
-- from (
--   select date_trunc('second', created_at) as seconde, ip_hash
--   from affiliate_clicks
--   where click_id is null
--   group by 1, 2
--   having count(distinct firm_slug) > 1
-- ) r
-- where c.ip_hash = r.ip_hash
--   and date_trunc('second', c.created_at) = r.seconde
--   and c.click_id is null;
