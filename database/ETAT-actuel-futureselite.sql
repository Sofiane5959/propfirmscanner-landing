-- =============================================================================
-- OU EN EST LA BASE ? — FUTURESELITE
-- =============================================================================
-- LECTURE SEULE. A passer avant toute autre chose, pour savoir dans quel etat
-- se trouve la firme apres l'echec du rollback.
--
-- L'editeur Supabase enveloppe chaque script dans une transaction : le rollback
-- ayant echoue sur `42601`, RIEN n'a ete applique — ni les `delete` du debut,
-- ni la restauration. La base est donc restee exactement comme elle etait
-- juste avant que tu lances le rollback.
--
-- Cette requete te dit laquelle des trois situations tu occupes.
-- =============================================================================

select
  -- Etat des migrations
  case when exists (
    select 1 from firm_promotions
    where firm_slug = 'futureselite' and is_public = false and discount_value = 0.30
  ) then 'passe' else 'non passe' end                       as migration_1_programs,

  case when exists (
    select 1 from prop_firms
    where slug = 'futureselite' and payout_methods @> array['Rise']
  ) then 'passe' else 'non passe' end                       as migration_2_prop_firms,

  -- Les quatre corrections, une par une
  case when exists (
    select 1 from firm_rules
    where firm_slug = 'futureselite' and detail ilike '%maximum 3 Nitro%'
  ) then 'A CORRIGER' else 'ok' end                         as c1_plafond_nitro,

  case when (select verdict_card::text from prop_firms where slug = 'futureselite')
            ilike '%An evaluation with no daily loss limit%'
       then 'A CORRIGER' else 'ok' end                      as c2_verdict,

  case when exists (
    select 1 from prop_firms
    where slug = 'futureselite'
      and array_to_string(pros, ' ') ilike '%End-of-day drawdown on Elite%'
  ) then 'A CORRIGER' else 'ok' end                         as c3_drawdown,

  case when exists (
    select 1 from prop_firms
    where slug = 'futureselite' and payout_methods @> array['Rise']
  ) then 'ok' else 'A CORRIGER' end                         as c4_prestataire,

  -- La sauvegarde est-elle toujours la ?
  case when to_regclass('public.fe_sauv_20260908_prop_firm') is null
       then 'ABSENTE' else 'presente' end                   as sauvegarde;

-- COMMENT LIRE LE RESULTAT
--
--   migration_1 et migration_2 = « non passe », les quatre corrections en
--   « A CORRIGER » : tu n'as pas encore joue les migrations. Passe-les dans
--   l'ordre, rien d'autre a faire.
--
--   migration_1 = « passe », migration_2 = « non passe » : le premier fichier
--   est passe, le second non. Passe le second.
--
--   les deux « passe » et les quatre corrections en « ok » : tout est en
--   place. Recharge la fiche deux fois et dis-le-moi.
--
--   « sauvegarde : ABSENTE » : il faudra rejouer
--   RUN-00-sauvegarde-avant-migration.sql avant toute nouvelle migration.
