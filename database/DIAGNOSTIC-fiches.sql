-- =============================================================================
-- DIAGNOSTIC — quelles fiches sont reellement remplies en base
-- =============================================================================
-- A coller dans supabase.com -> ton projet -> SQL Editor -> New query -> Run.
-- Ne modifie rien. Une seule requete, une ligne par firme.
--
-- Ce qu'il faut lire : la colonne « etat ».
--   REMPLIE  -> le RUN-<slug>.sql correspondant a bien ete execute
--   VIDE     -> il ne l'a pas ete, ou il a echoue et tout a ete annule
--
-- Le 3 septembre 2026, la page live de ftmo et de the5ers renvoyait
-- verdict_card = null et key_rules = null apres regeneration ISR, alors que
-- hantec-trader et futureselite renvoyaient les deux blocs remplis. Cette
-- requete confirme cote base ce que la page laissait deja voir.
-- =============================================================================

select
  f.slug,
  case
    when f.verdict_card is not null
     and f.key_rules    is not null
     and f.journey      is not null then 'REMPLIE'
    else 'VIDE'
  end                                                     as etat,
  (f.verdict_card  is not null)                           as verdict_card,
  (f.program_guide is not null)                           as program_guide,
  (f.key_rules     is not null)                           as key_rules,
  (f.journey       is not null)                           as journey,
  (f.cost_timeline is not null)                           as cost_timeline,
  f.profit_split,
  f.max_profit_split,
  f.min_price,
  f.max_price,
  f.price_currency,
  cardinality(f.pros)                                     as nb_pros,
  cardinality(f.restricted_countries)                     as nb_pays_exclus,
  f.logo_url,
  f.data_verified_at,
  (select count(*) from prop_firm_challenges c
    where c.firm_slug = f.slug)                           as nb_programmes
from prop_firms f
where f.slug in ('ftmo', 'the5ers', 'hantec-trader', 'futureselite', 'earn2trade')
order by etat, f.slug;


-- Attendu apres avoir passe RUN-ftmo.sql et RUN-the5ers.sql :
--
--   slug            etat     ... nb_programmes
--   earn2trade      REMPLIE                ...
--   ftmo            REMPLIE                 14
--   futureselite    REMPLIE                  4
--   hantec-trader   REMPLIE                 44
--   the5ers         REMPLIE                 16
--
-- Si ftmo ou the5ers ressort VIDE, c'est que le script n'a pas ete execute
-- ou qu'il a echoue. L'editeur SQL de Supabase enveloppe chaque script dans
-- sa propre transaction : une seule instruction en erreur annule TOUT le
-- fichier, y compris les instructions correctes qui la precedent. Le message
-- d'erreur et son numero de LIGNE sont donc l'information utile — c'est ce
-- qu'il faut me renvoyer.
