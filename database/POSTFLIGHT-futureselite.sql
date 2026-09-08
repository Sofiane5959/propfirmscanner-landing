-- =============================================================================
-- POSTFLIGHT — PREUVE APRES MIGRATION
-- =============================================================================
-- LECTURE SEULE. Trois blocs, a passer DANS L'ORDRE, un par un.
--
-- POURQUOI TROIS BLOCS ET NON UNE REQUETE
--
-- La version precedente referencait `scope_confidence`, `page_model_status` et
-- `firm_payment_methods` directement. Postgres resout les noms de colonnes et
-- de tables a l'ANALYSE, avant d'executer quoi que ce soit : une seule
-- reference manquante faisait echouer la requete entiere, et les onze autres
-- controles ne disaient plus rien.
--
-- Or lancer cette requete trop tot est un geste naturel. Une verification qui
-- s'effondre au lieu de rapporter est une mauvaise verification.
--
-- Le bloc 1 ne lit que le catalogue systeme : il fonctionne toujours.
-- Le bloc 2 contourne les colonnes optionnelles par `to_jsonb`, qui rend NULL
-- pour une cle absente au lieu de lever une erreur.
-- Le bloc 3 est isole parce qu'une TABLE absente ne peut pas se contourner de
-- la meme facon.
-- =============================================================================


-- =============================================================================
-- BLOC 1 — PREREQUIS. Toujours executable, meme sur une base vierge.
-- =============================================================================
select
  case when to_regclass('public.firm_programs') is null
       then 'A FAIRE : RUN-program-schema.sql' else 'ok' end        as p1_tables,
  case when not exists (select 1 from information_schema.columns
                        where table_name = 'firm_programs' and column_name = 'market')
       then 'A FAIRE : RUN-program-schema-v2.sql' else 'ok' end     as p2_schema_v2,
  case when not exists (select 1 from information_schema.columns
                        where table_name = 'firm_promotions' and column_name = 'scope_confidence')
       then 'A FAIRE : RUN-04' else 'ok' end                        as p3_scope_confidence,
  case when to_regclass('public.firm_payment_methods') is null
       then 'A FAIRE : RUN-01' else 'ok' end                        as p4_paiements,
  case when not exists (select 1 from information_schema.columns
                        where table_name = 'prop_firms' and column_name = 'page_model_status')
       then 'A FAIRE : RUN-03' else 'ok' end                        as p5_page_model_status;

-- ATTENDU : les cinq a 'ok'.
-- Tant qu'une seule dit 'A FAIRE', les blocs 2 et 3 renverront des ECHEC
-- legitimes : la migration correspondante n'a pas encore eu lieu.


-- =============================================================================
-- BLOC 2 — LES ONZE CONTROLES DE DONNEES
-- =============================================================================
-- Executable meme si RUN-03 et RUN-04 n'ont pas ete passes : les colonnes
-- optionnelles sont lues par `to_jsonb`, qui rend NULL pour une cle absente.

with
programmes as (
  select * from firm_programs where firm_slug = 'futureselite'
),
phases as (
  select pl.*, pr.slug as prog
  from firm_program_plans pl
  join programmes pr on pr.id = pl.program_id
),
-- Une SELECTION COMMERCIALE = programme + variante + taille. Les phases en
-- sont les enfants, jamais des cartes independantes.
selections as (
  select distinct prog, coalesce(variant_key, '') as v, account_size from phases
),
firme as (
  select f.*, to_jsonb(f) as j from prop_firms f where f.slug = 'futureselite'
),
promo_partenaire as (
  select p.*, to_jsonb(p) as j
  from firm_promotions p
  where p.firm_slug = 'futureselite' and p.is_public = false
  limit 1
)
select
  case when (select count(*) from programmes) = 4
       then 'ok' else 'ECHEC ' || (select count(*) from programmes) end          as v01_4_programmes,

  case when (select count(*) from selections) = 15
       then 'ok' else 'ECHEC ' || (select count(*) from selections) end          as v02_15_selections,

  case when (select count(*) from phases) = 27
       then 'ok' else 'ECHEC ' || (select count(*) from phases) end              as v03_27_phases,

  case when (select count(distinct market) from programmes) = 1
        and (select min(market) from programmes) = 'futures'
        and (select is_futures from firme) = true
       then 'ok' else 'ECHEC ' || coalesce((select string_agg(distinct market, ',') from programmes), 'aucun') end
                                                                                 as v04_marche_futures,

  case when (select count(*) from firm_platforms
             where firm_slug = 'futureselite' and configurator_status = 'selectable') = 6
       then 'ok' else 'ECHEC' end                                                as v05_six_plateformes,

  case when (select count(*) from phases
             where prog = 'instant' and phase = 'sim_funded' and profit_split <> 0.8) = 0
        and (select count(*) from phases where prog = 'instant' and phase = 'sim_funded') = 3
       then 'ok' else 'ECHEC' end                                                as v06_instant_80,

  case when (select count(*) from phases
             where prog in ('elite', 'nitro', 'prime')
               and phase = 'sim_funded' and profit_split <> 0.9) = 0
       then 'ok' else 'ECHEC' end                                                as v07_autres_90,

  -- Aucune affirmation de firme sur la perte journaliere ou le drawdown : ces
  -- deux regles different par programme et par phase.
  case when (select array_to_string(pros, ' ') || ' ' || coalesce(description, '') from firme)
            !~* '(no daily loss limit(?!( on| except))|End-of-day drawdown on Elite, Nitro and Instant|all four settle at a 90)'
       then 'ok' else 'ECHEC' end                                                as v08_aucune_generalisation,

  case when (select max_funded_accounts from programmes where slug = 'nitro') is null
        and exists (select 1 from firm_rules
                    where firm_slug = 'futureselite' and detail ilike '%MAX 4 FUNDED%')
        and not exists (select 1 from firm_rules
                        where firm_slug = 'futureselite' and detail ilike '%maximum 3 Nitro%')
       then 'ok' else 'ECHEC' end                                                as v09_nitro_non_resolu,

  -- `to_jsonb` : la cle absente rend NULL, la requete ne casse pas.
  case when (select j ->> 'page_model_status' from firme) = 'active'
       then 'ok'
       else 'ECHEC ' || coalesce((select j ->> 'page_model_status' from firme), 'colonne absente') end
                                                                                 as v11_statut_actif,

  case when (select j ->> 'scope_confidence' from promo_partenaire) = 'unconfirmed'
        and (select discount_value from promo_partenaire) = 0.30
        and (select leverage_forex from firme) is null
        and (select cost_timeline from firme) is null
        and (select profit_split from firme) = 80
       then 'ok'
       else 'ECHEC scope=' || coalesce((select j ->> 'scope_confidence' from promo_partenaire), 'colonne absente')
            || ' remise=' || coalesce((select discount_value::text from promo_partenaire), 'aucune')
            || ' split=' || coalesce((select profit_split::text from firme), 'null') end
                                                                                 as v12_entrees_validateur,

  (select data_verified_at::date from firme)                                     as info_verifie_le,
  (select payout_methods from firme)                                             as info_repli_paiement;


-- =============================================================================
-- BLOC 3 — LES MOYENS DE PAIEMENT
-- =============================================================================
-- A passer SEULEMENT si le bloc 1 dit `p4_paiements = ok`.
--
-- Une table absente ne se contourne pas comme une colonne : Postgres refuse la
-- requete a l'analyse. Ce controle est donc isole plutot que de faire tomber
-- les onze autres.

select
  case when (select count(*) from firm_payment_methods
             where firm_slug = 'futureselite' and flow = 'payout') >= 1
       then 'ok' else 'ECHEC' end                                                as v10_paiements_normalises,
  (select count(*) from firm_payment_methods
   where firm_slug = 'futureselite' and flow = 'payout')                         as nb_payout,
  (select count(*) from firm_payment_methods
   where firm_slug = 'futureselite' and flow = 'purchase')                       as nb_purchase;

-- ATTENDU : ok | 3 | 0
-- Aucune ligne `purchase` : les moyens d'achat ne sont pas documentes
-- publiquement, et une ligne inventee se retrouverait sur la fiche.


-- =============================================================================
-- RESULTAT ATTENDU, UNE FOIS TOUTES LES MIGRATIONS PASSEES
-- =============================================================================
--   Bloc 1 : p1..p5 tous 'ok'
--   Bloc 2 : v01..v09, v11, v12 tous 'ok'
--            info_verifie_le      2026-09-07
--            info_repli_paiement  {Rise}
--   Bloc 3 : v10 'ok', 3 payout, 0 purchase
--
-- Toute colonne a 'ECHEC' bloque le deploiement.
--
-- LE CONTROLE QUE CE FICHIER NE PEUT PAS FAIRE
--
-- `validateFirmPageModel` s'execute sur le MODELE, pas sur la base : il lit
-- des textes editoriaux et les confronte aux donnees structurees. `v12` verifie
-- ses ENTREES, pas son verdict.
--
-- Le verdict se prend en local, apres la migration :
--
--     npm run model:report        -> doit finir « 0 erreur(s) »
--     npm run test:capabilities   -> 54 assertions vertes
--
-- Les deux lisent les memes fixtures que le SQL genere, donc un ecart entre la
-- base et les fixtures se verrait dans v01 a v12.
