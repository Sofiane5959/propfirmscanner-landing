-- =============================================================================
-- AUDIT DES LIENS D'AFFILIATION — LECTURE SEULE
-- =============================================================================
-- Aucune de ces requetes ne modifie quoi que ce soit.
--
-- A savoir d'emblee : aucune requete ne peut detecter le defaut d'Instant
-- Funding. Son lien etait bien forme, il portait simplement l'identifiant d'un
-- autre partenaire. Seule la comparaison avec le panneau du partenaire le
-- revele. Les requetes ci-dessous couvrent les defauts qui, eux, se voient
-- dans la donnee. La requete 5 sert a organiser la verification manuelle, qui
-- reste la seule methode fiable.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Domaine du lien affilie different du domaine du site officiel
-- -----------------------------------------------------------------------------
-- C'est le second defaut d'Instant Funding : affiliate_url sur .com, website_url
-- sur .io. Un ecart est parfois normal (reseau d'affiliation tiers : cxclick,
-- quanttekel, dnafunded...), mais chaque ligne merite un coup d'oeil.
select slug, name,
       substring(affiliate_url from 'https?://([^/?]+)') as domaine_affilie,
       substring(website_url   from 'https?://([^/?]+)') as domaine_site
from prop_firms
where affiliate_url is not null and affiliate_url <> '#'
  and website_url   is not null and website_url   <> '#'
  and replace(substring(affiliate_url from 'https?://([^/?]+)'), 'www.', '')
   <> replace(substring(website_url   from 'https?://([^/?]+)'), 'www.', '')
order by slug;


-- -----------------------------------------------------------------------------
-- 2. Lien "affilie" qui ne porte aucun parametre d'affiliation
-- -----------------------------------------------------------------------------
-- Une URL sans query string ne rapporte rien : le clic part, la commission non.
select slug, name, affiliate_url
from prop_firms
where affiliate_url is not null and affiliate_url <> '#'
  and affiliate_url !~ '[?&](partner|ref|aff|afmc|a_pid|a_bid|sl|bta|campaign|linkId|sourceId|tenantId|utm_source)='
order by slug;


-- -----------------------------------------------------------------------------
-- 3. Meme jeton d'affiliation sur plusieurs firmes
-- -----------------------------------------------------------------------------
-- Signature d'un copier-coller : deux firmes qui partagent le meme identifiant.
with jetons as (
  select slug, name, affiliate_url,
         substring(affiliate_url from '[?&](?:partner|ref|aff|afmc|a_pid|sl|bta)=([A-Za-z0-9_-]+)') as jeton
  from prop_firms
  where affiliate_url is not null and affiliate_url <> '#'
)
select jeton, count(*) as firmes, string_agg(slug, ', ' order by slug) as concernees
from jetons
where jeton is not null
group by jeton
having count(*) > 1
order by firmes desc;


-- -----------------------------------------------------------------------------
-- 4. Coherence du couple code / pourcentage de remise
-- -----------------------------------------------------------------------------
-- Un pourcentage sans code fait afficher une remise que le visiteur ne peut pas
-- obtenir ; un code sans pourcentage empeche le prix barre de s'afficher.
-- Le bandeau d'offres se declenche sur discount_percent > 0 uniquement.
select slug, name, discount_code, discount_percent, discount_expires_at,
       case
         when discount_percent > 0 and discount_code is null then 'remise annoncee sans code'
         when discount_code is not null and coalesce(discount_percent, 0) = 0 then 'code sans pourcentage'
         when discount_expires_at is not null and discount_expires_at < now() then 'promotion expiree, toujours affichee'
       end as probleme
from prop_firms
where (discount_percent > 0 and discount_code is null)
   or (discount_code is not null and coalesce(discount_percent, 0) = 0)
   or (discount_expires_at is not null and discount_expires_at < now())
order by slug;


-- -----------------------------------------------------------------------------
-- 5. Liste de verification manuelle
-- -----------------------------------------------------------------------------
-- La seule methode qui aurait attrape Instant Funding. Pour chaque ligne :
-- ouvrir le panneau partenaire, relever l'identifiant, le comparer a celui-ci.
-- Trier par clics decroissants revient a commencer par ce qui coute le plus cher.
select f.slug, f.name, f.affiliate_url, f.discount_code,
       count(c.*) filter (where c.is_prefetch = false) as clics_reels
from prop_firms f
left join affiliate_clicks c on c.firm_slug = f.slug
where f.affiliate_url is not null and f.affiliate_url <> '#'
group by f.slug, f.name, f.affiliate_url, f.discount_code
order by clics_reels desc, f.slug;
