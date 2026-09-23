-- GENERE PAR scripts/firms_build.py a partir de data/firms/ftmo.xlsx.
-- NE PAS MODIFIER A LA MAIN : corriger le tableur, puis relancer
--   npm run firms:build
-- `npm run firms:check` echoue si ce fichier ne correspond plus a la fiche.
-- Fiche : data/firms/ftmo.json (sha256:7cb7ae7ac9dfc996a33f2fc7d232557fd2556708458f3f21f1e6f057ebbdffb2)
--
-- Recopie dans prop_firms les colonnes lues par /compare, /deals, le bandeau
-- des offres, /best-for, le quiz, les favoris et les cartes Similar firms.
-- Aucune autre table n'est touchee. Une valeur absente de la fiche s'ecrit null.
-- L'offre n'est recopiee que si la fiche la dit confirmee.
--
-- A executer dans l'editeur SQL de Supabase. Tout ou rien : si le controle
-- final echoue, la transaction est annulee et rien n'est modifie.

-- 1. Etat avant (lecture seule). L'editeur Supabase n'affiche que le resultat
--    de la DERNIERE requete : executer d'abord ce select SEUL (le selectionner,
--    puis Run) et exporter le resultat, qui sert au retour arriere. Ensuite
--    seulement, executer le fichier entier.
select slug, name, logo_url, country, trustpilot_rating, trustpilot_reviews, has_instant_funding, platforms, price_currency, min_price, max_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'ftmo';

begin;

-- VERROU : cette firme n'est pas encore publiee (ni dans data/firms/rollout.ts,
-- ni dans data/firms/legacy). Ses copies prop_firms ne doivent pas changer avant
-- la publication de sa page : ce bloc annule tout. Il disparait tout seul du
-- fichier genere des que la firme est activee dans rollout.ts.
do $garde$
begin
  raise exception 'ftmo n''est pas encore publiee : ce SQL ne doit pas etre execute.';
end
$garde$;

do $ctrl$
begin
  if not exists (select 1 from prop_firms where slug = 'ftmo') then
    raise exception 'prop_firms : aucune firme ftmo';
  end if;
end
$ctrl$;

-- 2. Projection de la fiche.
update prop_firms set
  name = 'FTMO',
  logo_url = 'https://ftmo.com/app/themes/ftmo-com/public/images/favicon/apple-touch-icon.png',
  country = 'Czech Republic',
  trustpilot_rating = 4.8,
  trustpilot_reviews = 52781,
  has_instant_funding = false,
  platforms = 'MetaTrader 4, MetaTrader 5, cTrader, TradingView, NinjaTrader, Tradovate',
  price_currency = null,
  min_price = null,
  max_price = null,
  profit_split = 80,
  max_profit_split = 90,
  discount_code = null,
  discount_percent = null,
  discount_expires_at = null,
  updated_at = now()
where slug = 'ftmo';

-- platforms_list est prioritaire sur platforms dans /compare : il recoit la
-- meme liste, au format de sa colonne (liste a virgules ou tableau).
do $plat$
declare t text;
begin
  select data_type into t from information_schema.columns
   where table_schema = 'public' and table_name = 'prop_firms' and column_name = 'platforms_list';
  if t is null then
    return;
  elsif t = 'ARRAY' then
    update prop_firms set platforms_list = string_to_array('MetaTrader 4, MetaTrader 5, cTrader, TradingView, NinjaTrader, Tradovate', ', ') where slug = 'ftmo';
  else
    update prop_firms set platforms_list = 'MetaTrader 4, MetaTrader 5, cTrader, TradingView, NinjaTrader, Tradovate' where slug = 'ftmo';
  end if;
end
$plat$;

-- 3. Controle : chaque colonne porte la valeur de la fiche, sinon tout est annule.
do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'ftmo';
  if r.name is distinct from 'FTMO'
     or r.logo_url is distinct from 'https://ftmo.com/app/themes/ftmo-com/public/images/favicon/apple-touch-icon.png'
     or r.country is distinct from 'Czech Republic'
     or (r.trustpilot_rating is null or abs(r.trustpilot_rating::numeric - 4.8) > 0.001)
     or (r.trustpilot_reviews is null or abs(r.trustpilot_reviews::numeric - 52781) > 0.001)
     or r.has_instant_funding is distinct from false
     or r.platforms is distinct from 'MetaTrader 4, MetaTrader 5, cTrader, TradingView, NinjaTrader, Tradovate'
     or r.price_currency is not null
     or r.min_price is not null
     or r.max_price is not null
     or (r.profit_split is null or abs(r.profit_split::numeric - 80) > 0.001)
     or (r.max_profit_split is null or abs(r.max_profit_split::numeric - 90) > 0.001)
     or r.discount_code is not null
     or r.discount_percent is not null
     or r.discount_expires_at is not null then
    raise exception 'Controle echoue : prop_firms ftmo ne correspond pas a la fiche';
  end if;
end
$verif$;

commit;

-- 4. Etat apres (lecture seule).
select slug, name, logo_url, country, trustpilot_rating, trustpilot_reviews, has_instant_funding, platforms, price_currency, min_price, max_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'ftmo';
