-- =============================================================================
-- DIAGNOSTIC — QUELLE SOURCE FOURNIT CHAQUE VALEUR ERRONEE ?
-- =============================================================================
-- LECTURE SEULE. Aucun insert, aucun update, aucun delete.
-- A coller dans supabase.com -> SQL Editor.
--
-- ATTENTION : l'editeur Supabase n'affiche que le resultat de la DERNIERE
-- requete. Chaque bloc ci-dessous est numerote : execute-les UN PAR UN, ou
-- decommente un seul bloc a la fois.
--
-- Chaque requete repond a une question precise : d'ou vient la valeur que la
-- page affiche ? Les colonnes `attendu` disent ce que le SQL corrige ecrirait.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. LA REMISE : pourquoi l'Elite 25K est-il a 76 $ ?
-- -----------------------------------------------------------------------------
-- 95 x 0,80 = 76. Un prix a 76 prouve une remise de 20 %, donc l'ancienne
-- ligne SCANNED. Le SQL corrige la porte a 30 % : 95 x 0,70 = 66,50.
--
-- Si `discount_value` vaut 0.20 -> RUN-futureselite-programs.sql n'est pas passe.

select p.code,
       p.discount_value,
       0.30                                   as attendu,
       p.is_public,
       p.label,
       p.program_slug,
       p.account_size,
       p.verified_at
from   firm_promotions p
where  p.firm_slug = 'futureselite'
  and  p.is_public = false;


-- -----------------------------------------------------------------------------
-- 2. LES TEXTES : « sept plateformes », « pas publiques », date de verification
-- -----------------------------------------------------------------------------
-- Ces trois-la vivent dans prop_firms, pas dans firm_programs. Ils prouvent si
-- RUN-futureselite.sql est passe.
--
-- Attendu apres correction :
--   platforms                 -> 6 entrees, dont WealthCharts et DeepChart,
--                                SANS Volumetrica ni DeepCharts
--   description               -> contient « six platforms », jamais « seven »
--   cons                      -> ne contient plus « not public »
--   data_verified_at          -> 2026-09-07
--   cost_timeline             -> NULL
--   value_strip               -> renseigne
--   profit_split              -> 80  (Instant), max_profit_split -> 90

select f.data_verified_at,
       timestamptz '2026-09-07'                       as date_attendue,
       f.profit_split,
       80                                             as split_attendu,
       f.max_profit_split,
       f.platforms,
       array_length(string_to_array(f.platforms, ','), 1) as nb_plateformes,
       f.description   like '%seven platforms%'       as description_perimee,
       f.description   like '%all four settle at a 90%%' as description_90_partout,
       array_to_string(f.cons, ' ') like '%not public%' as cons_perime,
       (f.cost_timeline is null)                      as cost_timeline_retiree,
       (f.value_strip   is not null)                  as bande_de_faits_presente,
       f.leverage_forex
from   prop_firms f
where  f.slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 3. LA TRADUCTION ECRASE-T-ELLE L'ANGLAIS ?
-- -----------------------------------------------------------------------------
-- Hypothese 4 du diagnostic. La page anglaise lit les colonnes de base ; le
-- bloc `translations` ne s'applique qu'aux locales non anglaises.
--
-- Si `cles_traduites` ne contient PAS 'en', la traduction ne peut pas etre en
-- cause sur /prop-firm/futureselite.

select jsonb_object_keys(f.translations) as cles_traduites,
       (f.translations ? 'en')           as une_surcouche_anglaise_existe
from   prop_firms f
where  f.slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 4. LES PLATEFORMES : deux sources possibles
-- -----------------------------------------------------------------------------
-- `prop_firms.platforms` (colonne TEXT) alimente la bande du haut.
-- `firm_platforms` alimente la structure normalisee.
-- Si les deux divergent, la page peut afficher sept entrees venues de la
-- premiere pendant que la seconde en porte huit dont six selectionnables.

select 'prop_firms.platforms' as source, f.platforms as valeur, null::text as statut
from   prop_firms f where f.slug = 'futureselite'
union all
select 'firm_platforms', p.name, p.configurator_status
from   firm_platforms p where p.firm_slug = 'futureselite'
order  by 1, 2;


-- -----------------------------------------------------------------------------
-- 5. INSTANT : 90 % ou 80 % ? trailing equity ou fin de journee ?
-- -----------------------------------------------------------------------------
-- Les valeurs normalisees sont dans firm_program_plans. Si elles sont deja
-- correctes ici, l'erreur affichee vient des colonnes de prop_firms (bloc 2),
-- pas de la structure programmes.

select pr.name                as programme,
       pl.phase,
       pl.account_size,
       pl.profit_split,
       pl.drawdown_type,
       pl.daily_loss_limit,
       pl.consistency_rule,
       pl.minimum_trading_days
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite'
  and  pr.slug in ('instant', 'prime', 'nitro')
order  by pr.sort_order, pl.phase desc, pl.account_size;


-- -----------------------------------------------------------------------------
-- 6. LA SECTION « What you will pay » et le bloc de regles
-- -----------------------------------------------------------------------------
-- La section s'efface quand la colonne est NULL. Si elle s'affiche encore,
-- c'est que la colonne porte toujours l'ancien contenu.

select (f.cost_timeline is null)                     as section_couts_retiree,
       f.key_rules -> 'rules' -> 0 ->> 'category'    as premiere_categorie_attendue_non_null,
       jsonb_array_length(f.key_rules -> 'rules')    as nb_regles,
       (f.verdict_card ? 'counterPoints')            as second_groupe_du_verdict,
       f.journey -> 'steps'                          as etapes_du_parcours
from   prop_firms f
where  f.slug = 'futureselite';


-- -----------------------------------------------------------------------------
-- 7. RECAPITULATIF EN UNE LIGNE — a executer en dernier
-- -----------------------------------------------------------------------------
-- Repond directement : quel fichier manque ?

select
  case when exists (
    select 1 from firm_promotions
    where firm_slug = 'futureselite' and is_public = false and discount_value = 0.30
  ) then 'passe' else 'MANQUANT' end          as run_futureselite_programs_sql,
  case when exists (
    select 1 from prop_firms
    where slug = 'futureselite'
      and data_verified_at = timestamptz '2026-09-07'
      and cost_timeline is null
  ) then 'passe' else 'MANQUANT' end          as run_futureselite_sql,
  (select leverage_forex from prop_firms where slug = 'futureselite')
                                              as levier_forex_a_effacer;
