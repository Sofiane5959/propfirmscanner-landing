-- =============================================================================
-- DIAGNOSTIC — le code promo est-il prerempli dans chaque lien sortant ?
-- LECTURE SEULE : aucun INSERT, UPDATE ni DELETE. A executer dans Supabase.
-- =============================================================================
-- Tous les boutons du site sortent par /api/go/[slug]. Le tunnel redirige vers,
-- dans l'ordre : le lien du plan choisi (prop_firm_challenges.affiliate_url),
-- sinon le lien du plan d'entree quand la firme a un code, sinon
-- prop_firms.affiliate_url, sinon le site de la firme.
--
-- Le code n'arrive donc prerempli que si CE lien le contient deja. Ces deux
-- requetes listent les liens qui ne le contiennent pas.
-- =============================================================================

-- 1. Firmes avec un code actif dont le lien principal ne contient pas ce code.
select
  f.slug,
  f.name,
  f.discount_code,
  f.discount_percent,
  f.affiliate_url,
  case
    when f.affiliate_url is null or f.affiliate_url = '#' then 'aucun lien affilie'
    else 'lien sans le code'
  end as probleme
from prop_firms f
where coalesce(f.listing_status, 'listed') = 'listed'
  and f.discount_code is not null
  and f.discount_code <> ''
  and (f.discount_expires_at is null or f.discount_expires_at > now())
  and (
    f.affiliate_url is null
    or f.affiliate_url = '#'
    or position(lower(f.discount_code) in lower(f.affiliate_url)) = 0
  )
order by f.name;

-- 2. Liens de plans (utilises par le configurateur et par le tunnel) qui ne
--    portent pas le code de leur firme.
select
  c.firm_slug,
  c.slug as plan,
  c.name as nom_plan,
  f.discount_code,
  c.affiliate_url
from prop_firm_challenges c
join prop_firms f on f.slug = c.firm_slug
where coalesce(f.listing_status, 'listed') = 'listed'
  and f.discount_code is not null
  and f.discount_code <> ''
  and (f.discount_expires_at is null or f.discount_expires_at > now())
  and c.affiliate_url is not null
  and c.affiliate_url <> '#'
  and position(lower(f.discount_code) in lower(c.affiliate_url)) = 0
order by c.firm_slug, c.slug;

-- 3. Pour information : firmes qui ont un lien affilie mais aucun code en base.
--    Leurs liens ne peuvent rien preremplir tant qu'un code n'est pas saisi.
select f.slug, f.name, f.affiliate_url
from prop_firms f
where coalesce(f.listing_status, 'listed') = 'listed'
  and f.affiliate_url is not null
  and f.affiliate_url <> '#'
  and (f.discount_code is null or f.discount_code = '')
order by f.name;
