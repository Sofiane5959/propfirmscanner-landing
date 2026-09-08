-- =============================================================================
-- PREFLIGHT — ETAT DE PRODUCTION AVANT TOUTE ECRITURE
-- =============================================================================
-- LECTURE SEULE. Aucun insert, update, delete, alter.
--
-- A passer EN PREMIER, avant tout autre fichier.
--
-- POURQUOI
--
-- Le manifeste ne suppose pas qu'un fichier a ete execute : il le VERIFIE.
-- `RUN-futureselite-programs.sql` et `RUN-futureselite.sql` ont ete regeneres
-- plusieurs fois, et rien ne prouve laquelle des versions est en base — ni
-- meme si l'une l'a ete.
--
-- Cette requete unique repond a « ou en suis-je », colonne par colonne. Chaque
-- resultat 'A FAIRE' designe un fichier a passer.
-- =============================================================================

select
  -- ---------------------------------------------------------------- schema --
  case when to_regclass('public.firm_programs') is null
       then 'A FAIRE : RUN-program-schema.sql' else 'ok' end            as s1_tables_programmes,

  case when not exists (
         select 1 from information_schema.columns
         where table_name = 'firm_programs' and column_name = 'market')
       then 'A FAIRE : RUN-program-schema-v2.sql' else 'ok' end         as s2_schema_v2,

  case when to_regclass('public.firm_payment_methods') is null
       then 'A FAIRE : RUN-01' else 'ok' end                            as s3_moyens_paiement,

  case when not exists (
         select 1 from information_schema.columns
         where table_name = 'firm_promotions' and column_name = 'scope_confidence')
       then 'A FAIRE : RUN-04' else 'ok' end                            as s4_confiance_portee,

  case when not exists (
         select 1 from information_schema.columns
         where table_name = 'prop_firms' and column_name = 'page_model_status')
       then 'A FAIRE : RUN-03' else 'ok' end                            as s5_statut_de_page,

  -- ------------------------------------------------------------- donnees ---
  -- Le marche : c'est lui qui produisait « cfd prop firm ».
  coalesce((select string_agg(distinct market, ', ')
            from firm_programs where firm_slug = 'futureselite'),
           'aucun programme')                                           as d1_marche,

  coalesce((select count(*)::text from firm_programs
            where firm_slug = 'futureselite'), '0')                     as d2_programmes,

  coalesce((select count(*)::text from firm_program_plans pl
            join firm_programs pr on pr.id = pl.program_id
            where pr.firm_slug = 'futureselite'), '0')                  as d3_lignes_de_phase,

  coalesce((select count(*)::text from firm_platforms
            where firm_slug = 'futureselite'
              and configurator_status = 'selectable'), '0')             as d4_plateformes_selectionnables,

  coalesce((select discount_value::text from firm_promotions
            where firm_slug = 'futureselite' and is_public = false
            limit 1), 'aucune')                                         as d5_remise_partenaire,

  coalesce((select count(*)::text from firm_rules
            where firm_slug = 'futureselite'), '0')                     as d6_regles,

  -- ------------------------------------------------ textes encore perimes --
  case when exists (select 1 from firm_rules
                    where firm_slug = 'futureselite'
                      and detail ilike '%maximum 3 Nitro%')
       then 'PERIME' else 'ok' end                                      as t1_plafond_nitro,

  case when (select array_to_string(pros, ' ') from prop_firms where slug = 'futureselite')
            ilike '%End-of-day drawdown on Elite, Nitro and Instant%'
       then 'PERIME' else 'ok' end                                      as t2_drawdown_groupe,

  case when (select verdict_card::text from prop_firms where slug = 'futureselite')
            ilike '%An evaluation with no daily loss limit%'
       then 'PERIME' else 'ok' end                                      as t3_verdict,

  case when (select description from prop_firms where slug = 'futureselite')
            ilike '%seven platforms%'
       then 'PERIME' else 'ok' end                                      as t4_sept_plateformes,

  case when (select description from prop_firms where slug = 'futureselite')
            ilike '%all four settle at a 90%%'
       then 'PERIME' else 'ok' end                                      as t5_90_pour_les_quatre,

  case when (select array_to_string(cons, ' ') from prop_firms where slug = 'futureselite')
            ilike '%price lists are not public%'
       then 'PERIME' else 'ok' end                                      as t6_grilles_non_publiques,

  -- ---------------------------------------------------------- colonnes ------
  (select profit_split from prop_firms where slug = 'futureselite')     as c1_split_de_base,
  (select leverage_forex from prop_firms where slug = 'futureselite')   as c2_levier_forex,
  (select data_verified_at::date from prop_firms where slug = 'futureselite') as c3_verifie_le,
  case when (select cost_timeline from prop_firms where slug = 'futureselite') is null
       then 'retiree' else 'PRESENTE' end                               as c4_section_couts,
  (select payout_methods from prop_firms where slug = 'futureselite')   as c5_repli_paiement,

  -- ------------------------------------------------------- sauvegardes ------
  case when to_regclass('public.fe_sauv_20260908_prop_firm') is null
       then 'ABSENTE' else 'presente' end                               as z1_sauvegarde;


-- =============================================================================
-- COMMENT LIRE
-- =============================================================================
--
-- s1..s5   'ok' = le schema est en place. 'A FAIRE : X' = passer X.
--
-- d1       attendu apres migration : 'futures'. 'cfd' = RUN-futureselite-programs
--          n'est pas passe, ou l'est dans une version qui n'ecrivait pas `market`.
-- d2       attendu 4      d3 attendu 27      d4 attendu 6      d6 attendu 33
-- d5       attendu 0.30. Une valeur de 0.20 designe l'ancienne version.
--
-- t1..t6   'PERIME' = RUN-futureselite.sql ou RUN-futureselite-programs.sql
--          n'est pas passe dans sa version courante. Ces six textes sont le
--          moyen le plus sur de le savoir : ils n'existent que dans l'ancienne.
--
-- c1       attendu 80     c2 attendu NULL    c3 attendu 2026-09-07
-- c4       attendu 'retiree'                 c5 attendu {Rise}
--
-- z1       'ABSENTE' = passer RUN-00 avant toute migration, sinon aucun retour
--          en arriere n'est possible.
