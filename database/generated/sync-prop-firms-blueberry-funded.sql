-- GENERE PAR scripts/firms_build.py a partir de data/firms/blueberry-funded.xlsx.
-- NE PAS MODIFIER A LA MAIN : corriger le tableur, puis relancer
--   npm run firms:build
-- `npm run firms:check` echoue si ce fichier ne correspond plus a la fiche.
-- Fiche : data/firms/blueberry-funded.json (sha256:a21dac6ff1d0b0656a7e0cbb6af4fedb0d18fda85b16f87eb3262234c5e9dd14)
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
select slug, name, logo_url, country, trustpilot_rating, trustpilot_reviews, is_futures, has_instant_funding, platforms, price_currency, min_price, max_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'blueberry-funded';

begin;

do $ctrl$
begin
  if not exists (select 1 from prop_firms where slug = 'blueberry-funded') then
    raise exception 'prop_firms : aucune firme blueberry-funded';
  end if;
end
$ctrl$;

-- 2. Projection de la fiche.
update prop_firms set
  name = 'Blueberry Funded',
  logo_url = 'https://blueberryfunded.com/favicon.ico',
  country = 'Saint Vincent and the Grenadines',
  trustpilot_rating = null,
  trustpilot_reviews = null,
  is_futures = false,
  has_instant_funding = true,
  platforms = 'MetaTrader 5, TradeLocker',
  price_currency = 'USD',
  min_price = 25,
  max_price = 2800,
  profit_split = 80,
  max_profit_split = 85,
  discount_code = 'SCANNED',
  discount_percent = 30,
  discount_expires_at = null,
  updated_at = now()
where slug = 'blueberry-funded';

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
    update prop_firms set platforms_list = string_to_array('MetaTrader 5, TradeLocker', ', ') where slug = 'blueberry-funded';
  else
    update prop_firms set platforms_list = 'MetaTrader 5, TradeLocker' where slug = 'blueberry-funded';
  end if;
end
$plat$;

-- 3. Controle : chaque colonne porte la valeur de la fiche, sinon tout est annule.
do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'blueberry-funded';
  if r.name is distinct from 'Blueberry Funded'
     or r.logo_url is distinct from 'https://blueberryfunded.com/favicon.ico'
     or r.country is distinct from 'Saint Vincent and the Grenadines'
     or r.trustpilot_rating is not null
     or r.trustpilot_reviews is not null
     or r.is_futures is distinct from false
     or r.has_instant_funding is distinct from true
     or r.platforms is distinct from 'MetaTrader 5, TradeLocker'
     or r.price_currency is distinct from 'USD'
     or (r.min_price is null or abs(r.min_price::numeric - 25) > 0.001)
     or (r.max_price is null or abs(r.max_price::numeric - 2800) > 0.001)
     or (r.profit_split is null or abs(r.profit_split::numeric - 80) > 0.001)
     or (r.max_profit_split is null or abs(r.max_profit_split::numeric - 85) > 0.001)
     or r.discount_code is distinct from 'SCANNED'
     or (r.discount_percent is null or abs(r.discount_percent::numeric - 30) > 0.001)
     or r.discount_expires_at is not null then
    raise exception 'Controle echoue : prop_firms blueberry-funded ne correspond pas a la fiche';
  end if;
end
$verif$;

commit;

-- 4. Etat apres (lecture seule).
select slug, name, logo_url, country, trustpilot_rating, trustpilot_reviews, is_futures, has_instant_funding, platforms, price_currency, min_price, max_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'blueberry-funded';
