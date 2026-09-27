-- GENERE PAR scripts/firms_build.py a partir de data/firms/the5ers.xlsx.
-- NE PAS MODIFIER A LA MAIN : corriger le tableur, puis relancer
--   npm run firms:build
-- `npm run firms:check` echoue si ce fichier ne correspond plus a la fiche.
-- Fiche : data/firms/the5ers.json (sha256:df2ca130ae7781daf50769ce614843a88c5162de1323fcc5e2bd6b9d3ed00755)
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
from prop_firms where slug = 'the5ers';

begin;

do $ctrl$
begin
  if not exists (select 1 from prop_firms where slug = 'the5ers') then
    raise exception 'prop_firms : aucune firme the5ers';
  end if;
end
$ctrl$;

-- 2. Projection de la fiche.
update prop_firms set
  name = 'The5ers',
  logo_url = 'https://the5ers.com/wp-content/uploads/2023/01/favicon.png',
  country = 'Israel',
  trustpilot_rating = 4.7,
  trustpilot_reviews = 38563,
  has_instant_funding = true,
  platforms = 'MetaTrader 5, cTrader, TradingView, BlackArrow',
  price_currency = 'USD',
  min_price = 19,
  max_price = 850,
  profit_split = 50,
  max_profit_split = 80,
  discount_code = null,
  discount_percent = null,
  discount_expires_at = null,
  updated_at = now()
where slug = 'the5ers';

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
    update prop_firms set platforms_list = string_to_array('MetaTrader 5, cTrader, TradingView, BlackArrow', ', ') where slug = 'the5ers';
  else
    update prop_firms set platforms_list = 'MetaTrader 5, cTrader, TradingView, BlackArrow' where slug = 'the5ers';
  end if;
end
$plat$;

-- 3. Controle : chaque colonne porte la valeur de la fiche, sinon tout est annule.
do $verif$
declare r prop_firms%rowtype;
begin
  select * into r from prop_firms where slug = 'the5ers';
  if r.name is distinct from 'The5ers'
     or r.logo_url is distinct from 'https://the5ers.com/wp-content/uploads/2023/01/favicon.png'
     or r.country is distinct from 'Israel'
     or (r.trustpilot_rating is null or abs(r.trustpilot_rating::numeric - 4.7) > 0.001)
     or (r.trustpilot_reviews is null or abs(r.trustpilot_reviews::numeric - 38563) > 0.001)
     or r.has_instant_funding is distinct from true
     or r.platforms is distinct from 'MetaTrader 5, cTrader, TradingView, BlackArrow'
     or r.price_currency is distinct from 'USD'
     or (r.min_price is null or abs(r.min_price::numeric - 19) > 0.001)
     or (r.max_price is null or abs(r.max_price::numeric - 850) > 0.001)
     or (r.profit_split is null or abs(r.profit_split::numeric - 50) > 0.001)
     or (r.max_profit_split is null or abs(r.max_profit_split::numeric - 80) > 0.001)
     or r.discount_code is not null
     or r.discount_percent is not null
     or r.discount_expires_at is not null then
    raise exception 'Controle echoue : prop_firms the5ers ne correspond pas a la fiche';
  end if;
end
$verif$;

commit;

-- 4. Etat apres (lecture seule).
select slug, name, logo_url, country, trustpilot_rating, trustpilot_reviews, has_instant_funding, platforms, price_currency, min_price, max_price, profit_split, max_profit_split, discount_code, discount_percent, discount_expires_at
from prop_firms where slug = 'the5ers';
