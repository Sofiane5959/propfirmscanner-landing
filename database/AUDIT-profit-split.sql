-- =============================================================================
-- AUDIT — partages de profits incoherents sur les 350 firmes
-- =============================================================================
-- A coller dans supabase.com -> SQL Editor -> New query -> Run.
-- Ne modifie rien.
--
-- UNE SEULE REQUETE, VOLONTAIREMENT. La version precedente en enchainait
-- trois : l'editeur SQL de Supabase n'affiche que le dernier jeu de
-- resultats, donc les deux premiers — dont le plus important, « maximum
-- inferieur au taux de base » — etaient invisibles. La colonne « probleme »
-- remplace ce decoupage.
--
-- Origine : le diagnostic du 3 septembre 2026 a montre futureselite avec
-- profit_split = 90 et max_profit_split = 80, soit un maximum INFERIEUR au
-- taux de base. La page annoncait « jusqu'a 80 % » sur une firme qui en donne
-- 90. Cause : le taux de base a ete corrige par un RUN-*.sql, max_profit_split
-- est restee a sa valeur de seed.
-- =============================================================================

select
  case
    when profit_split is not null
     and max_profit_split is not null
     and max_profit_split < profit_split      then '1. MAXIMUM SOUS LE TAUX DE BASE'
    when profit_split is null
     and max_profit_split is not null         then '2. MAXIMUM SANS TAUX DE BASE'
    when profit_split     not between 20 and 100
      or max_profit_split not between 20 and 100
                                              then '3. VALEUR HORS BORNES'
  end                                         as probleme,
  slug,
  name,
  profit_split                                as base,
  max_profit_split                            as maximum
from prop_firms
where (profit_split is not null and max_profit_split is not null
       and max_profit_split < profit_split)
   or (profit_split is null and max_profit_split is not null)
   or (profit_split     not between 20 and 100)
   or (max_profit_split not between 20 and 100)
order by probleme, slug;


-- =============================================================================
-- COMMENT LIRE
-- =============================================================================
-- 1. MAXIMUM SOUS LE TAUX DE BASE — toujours une erreur, et la seule des
--    trois qui fait mentir la page : elle sous-vend la firme.
--
-- 2. MAXIMUM SANS TAUX DE BASE — la page n'a pas de chiffre a afficher.
--    Deja vu le 3 septembre 2026 : darwinex-zero (maximum 15) et giimer
--    (maximum 10). Attention avant de « corriger » : 15 % et 10 % sont
--    plausibles pour ces deux-la, dont le modele n'est pas un partage de
--    profits classique. Verifier a la source avant d'ecrire quoi que ce soit.
--
-- 3. VALEUR HORS BORNES — un partage se lit en pourcentage. Sous 20 ou
--    au-dessus de 100, c'est souvent une fraction (0.9) ou un taux de
--    commission d'affiliation range dans la mauvaise colonne.


-- =============================================================================
-- CORRECTION — cas 1 uniquement, et seulement apres avoir lu la sortie
-- =============================================================================
-- Regle sure quand une firme n'a pas de palier documente au-dessus de son
-- taux de base : le maximum vaut le taux de base. Elle ne convient PAS aux
-- firmes qui ont un vrai plan de scaling (FTMO 80 -> 90, The5ers 80 -> 100,
-- Hantec 80 -> 95) : celles-la sont deja correctes et sont exclues.
--
-- Decommenter pour appliquer.
--
-- update prop_firms
--    set max_profit_split = profit_split,
--        updated_at       = now()
--  where profit_split is not null
--    and max_profit_split is not null
--    and max_profit_split < profit_split
--    and slug not in ('ftmo', 'the5ers', 'hantec-trader');
