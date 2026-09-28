-- DIAGNOSTIC — lecture seule. Aucune ecriture, aucune modification.
--
-- Pourquoi la section « Similar firms » de FuturesElite n'affiche qu'une carte.
-- La page ne retient une firme que si elle est futures, listee
-- (listing_status = 'listed') et dotee d'un lien affilie actif (affiliate_url
-- renseigne et different de '#'). Cette requete liste toutes les firmes
-- futures et dit, pour chacune, ce qui lui manque.
--
-- A lancer dans l'editeur SQL de Supabase, puis m'envoyer le resultat.

select
  name,
  slug,
  listing_status,
  trustpilot_rating,
  (affiliate_url is not null and affiliate_url <> '#') as lien_affilie_actif,
  case
    when listing_status is distinct from 'listed'
      and (affiliate_url is null or affiliate_url = '#') then 'non listee + pas de lien affilie'
    when listing_status is distinct from 'listed' then 'non listee'
    when affiliate_url is null or affiliate_url = '#' then 'pas de lien affilie'
    else 'retenue'
  end as statut_pour_similar_firms
from prop_firms
where is_futures = true
  and slug <> 'futureselite'
order by
  (listing_status = 'listed' and affiliate_url is not null and affiliate_url <> '#') desc,
  trustpilot_rating desc nulls last,
  name;
