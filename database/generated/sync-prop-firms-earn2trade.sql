-- GENERE PAR scripts/firms_build.py a partir de data/firms/earn2trade.xlsx.
-- NE PAS MODIFIER A LA MAIN : corriger le tableur, puis relancer
--   npm run firms:build
-- `npm run firms:check` echoue si ce fichier ne correspond plus a la fiche.
-- Fiche : data/firms/earn2trade.json (sha256:51490cb0ec378948f706c0da7814d6ab951f94c814324709b101a757476f02ed)
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
from prop_firms where slug = 'earn2trade';

begin;

-- VERROU : cette firme n'est pas encore publiee (ni dans data/firms/rollout.ts,
-- ni dans data/firms/legacy). Ses copies prop_firms ne doivent pas changer avant
-- la publication de sa page : ce bloc annule tout. Il disparait tout seul du
-- fichier genere des que la firme est activee dans rollout.ts.
do $garde$
begin
  raise exception 'earn2trade n''est pas encore publiee : ce SQL ne doit pas etre execute.';
end
$garde$;

do $ctrl$
begin
  if not exists (select 1 from prop_firms where slug = 'earn2trade') then
    raise exception 'prop_firms : aucune firme earn2trade';
  end if;
end
$ctrl$;

-- 2. Projection de la fiche.
update prop_firms set
  name = 'Earn2Trade',
  logo_url = 'https://www.earn2trade.com/apple-touch-icon.png',
  country = 'United States',
  trustpilot_rating = 4.6,
  trustpilot_reviews = 4995,
  is_futures = true,
  has_instant_funding = false,
  platforms = 'NinjaTrader, Finamark, R | Trader Pro, Tradovate, TradingView, BlackArrow One',
  price_currency = 'USD',
  min_price = 150,
  max_price = 550,
  profit_split = 50,
  max_profit_split = 80,
  discount_code = 'SCANNED',
  discount_percent = 50,
  discount_expires_at = null,
  updated_at = now()
where slug = 'earn2trade';

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
    update prop_firms set platforms_list = string_to_array('NinjaTrader, Finamark, R | Trader Pro, Tradovate, TradingView, BlackArrow One', ', ') where slug = 'earn2trade';
  else
    update prop_firms set platforms_list = 'NinjaTrader, Finamark, R | Trader Pro, Tradovate, TradingView, BlackArrow One' where slug = 'earn2trade';
  end if;
end
$plat$;

-- 3. Controle : chaque colonne porte la valeur de la fiche, sinon tout est annule.
do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'earn2trade';
  if r.name is distinct from 'Earn2Trade'
     or r.logo_url is distinct from 'https://www.earn2trade.com/apple-touch-icon.png'
     or r.country is distinct from 'United States'
     or (r.trustpilot_rating is null or abs(r.trustpilot_rating::numeric - 4.6) > 0.001)
     or (r.trustpilot_reviews is null or abs(r.trustpilot_reviews::numeric - 4995) > 0.001)
     or r.is_futures is distinct from true
     or r.has_instant_funding is distinct from false
     or r.platforms is distinct from 'NinjaTrader, Finamark, R | Trader Pro, Tradovate, TradingView, BlackArrow One'
     or r.price_currency is distinct from 'USD'
     or (r.min_price is null or abs(r.min_price::numeric - 150) > 0.001)
     or (r.max_price is null or abs(r.max_price::numeric - 550) > 0.001)
     or (r.profit_split is null or abs(r.profit_split::numeric - 50) > 0.001)
     or (r.max_profit_split is null or abs(r.max_profit_split::numeric - 80) > 0.001)
     or r.discount_code is distinct from 'SCANNED'
     or (r.discount_percent is null or abs(r.discount_percent::numeric - 50) > 0.001)
     or r.discount_expires_at is not null then
    raise exception 'Controle echoue : prop_firms earn2trade ne correspond pas a la fiche';
  end if;
end
$verif$;

commit;

-- 4. Etat apres (lecture seule).
select slug, name, logo_url, country, trustpilot_rating, trustpilot_reviews, is_futures, has_instant_funding, platforms, price_currency, min_price, max_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'earn2trade';
