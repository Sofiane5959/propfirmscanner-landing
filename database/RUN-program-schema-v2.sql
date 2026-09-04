-- =============================================================================
-- SCHEMA PROGRAMMES v2 — couche variante, marches, familles, i18n
-- =============================================================================
-- A coller dans supabase.com -> SQL Editor -> New query -> Run.
-- Prerequis : RUN-program-schema.sql doit avoir ete passe.
--
-- POURQUOI CETTE MIGRATION
--
-- La v1 s'arretait a `Firme -> Programme -> (Phase, Taille)`. Trois choses
-- devenaient impossibles :
--
--   1. FTMO Standard et Swing existent a la MEME taille dans le MEME programme.
--      La cle unique (program_id, phase, account_size) les faisait entrer en
--      collision : la seconde ecrasait la premiere.
--   2. The5ers vend le Summer 2-Step 100K en deux variantes, 8/5 et 10/5, a
--      des prix differents. Meme collision.
--   3. FTMO facture en EUR, The5ers en USD. La devise vivait au niveau firme.
--
-- La v2 ajoute une cle `variant_key` au plan, et deplace devise, type de compte
-- et plateforme au niveau du plan. Elle ajoute aussi `market` et
-- `program_family`, sans lesquels FTMO Futures Beta et le Summer Plan ne
-- peuvent pas etre separes de leurs voisins.
--
-- ADDITIVE. Aucune colonne supprimee, aucune renommee. Les lignes existantes
-- prennent `variant_key = null` et continuent de fonctionner a l'identique.
-- Idempotent : rejouable sans casse.
-- =============================================================================


-- =============================================================================
-- 1. PROGRAMMES — marche, famille, statut, traductions
-- =============================================================================
alter table firm_programs add column if not exists market         text not null default 'cfd';
alter table firm_programs add column if not exists program_family text;
-- active | promotional | beta | legacy | temporarily_unavailable | unverified | discontinued
alter table firm_programs add column if not exists status         text not null default 'active';
-- Meme mecanique que prop_firms.translations : les colonnes portent l'anglais,
-- translations[locale] se superpose. Les sept tables de la v1 etaient
-- monolingues, et c'est de la que venaient les « Evaluation » anglais sur les
-- pages espagnoles.
alter table firm_programs add column if not exists translations   jsonb;


-- =============================================================================
-- 2. PLANS — la couche variante
-- =============================================================================
-- Identifie la variante a l'interieur d'un programme et d'une taille.
-- null = programme sans variante, comportement v1 inchange.
alter table firm_program_plans add column if not exists variant_key    text;
alter table firm_program_plans add column if not exists variant_label  text;
-- Standard, Swing, ...
alter table firm_program_plans add column if not exists account_type   text;
-- « 8/5 », « 10/5 » : deux jeux d'objectifs pour une meme taille.
alter table firm_program_plans add column if not exists target_variant text;
-- La devise appartient au plan : FTMO vend en EUR, The5ers en USD.
alter table firm_program_plans add column if not exists currency       text not null default 'USD';
alter table firm_program_plans add column if not exists platform       text;

-- Frais payes APRES la reussite, distincts du prix d'entree.
alter table firm_program_plans add column if not exists post_pass_fee  numeric;
alter table firm_program_plans add column if not exists refund_note    text;
alter table firm_program_plans add column if not exists scaling_note   text;

-- Regles de phase que la v1 ne pouvait pas porter.
alter table firm_program_plans add column if not exists leverage                text;
alter table firm_program_plans add column if not exists time_limit              text;
alter table firm_program_plans add column if not exists minimum_profitable_days integer;
-- Distincte de consistency_rule : FTMO applique une Best Day Rule au 1-Step et
-- AUCUNE consistency au 2-Step. Les confondre melangeait les deux produits.
alter table firm_program_plans add column if not exists best_day_rule           numeric;
alter table firm_program_plans add column if not exists overnight_rule          text;
alter table firm_program_plans add column if not exists weekend_rule            text;
alter table firm_program_plans add column if not exists payout_eligible         boolean;
alter table firm_program_plans add column if not exists translations            jsonb;

-- Une evaluation en deux phases a besoin de deux lignes. L'enumeration v1
-- n'acceptait qu'un seul 'evaluation', si bien que l'objectif de phase 2 du
-- FTMO 2-Step (5 %) n'avait nulle part ou vivre.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'firm_program_plans_phase_check') then
    alter table firm_program_plans drop constraint firm_program_plans_phase_check;
  end if;
  alter table firm_program_plans add constraint firm_program_plans_phase_check
    check (phase in ('evaluation', 'evaluation_2', 'evaluation_3', 'sim_funded', 'live'));
end $$;

-- La cle unique doit inclure la variante, sinon Standard et Swing se
-- remplacent l'un l'autre a taille egale.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'firm_program_plans_program_id_phase_account_size_key'
  ) then
    alter table firm_program_plans
      drop constraint firm_program_plans_program_id_phase_account_size_key;
  end if;
end $$;

-- `coalesce` dans un index unique : deux lignes sans variante restent en
-- conflit, ce qui est le comportement v1 voulu.
create unique index if not exists firm_program_plans_variant_key
  on firm_program_plans (program_id, phase, account_size, coalesce(variant_key, ''));


-- =============================================================================
-- 3. REGLES — rattachement au programme, a la variante et a la phase
-- =============================================================================
-- null = regle de toute la firme. Renseigne = regle propre a ce programme.
-- Sans cela, une regle du 1-Step s'affichait sous le 2-Step.
alter table firm_rules add column if not exists program_slug      text;
alter table firm_rules add column if not exists variant_key       text;
alter table firm_rules add column if not exists phase             text;
alter table firm_rules add column if not exists rule_type         text;
alter table firm_rules add column if not exists calculation_basis text;
alter table firm_rules add column if not exists reset_time        text;
alter table firm_rules add column if not exists translations      jsonb;

-- Sept consequences, pas cinq. « Daily Pause » n'est pas une cloture, et un
-- ajustement de payout n'est pas une restriction de trading.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'firm_rules_severity_check') then
    alter table firm_rules drop constraint firm_rules_severity_check;
  end if;
  alter table firm_rules add constraint firm_rules_severity_check
    check (severity in ('hard_breach', 'temporary_pause', 'payout_adjustment',
                        'eligibility_condition', 'restriction', 'allowed',
                        'informational', 'payout_condition', 'needs_confirmation'));
end $$;

-- La cle unique doit tenir compte du programme : deux programmes peuvent avoir
-- une regle du meme titre avec un contenu different.
do $$
begin
  if exists (select 1 from pg_constraint where conname = 'firm_rules_firm_slug_scope_title_key') then
    alter table firm_rules drop constraint firm_rules_firm_slug_scope_title_key;
  end if;
end $$;

create unique index if not exists firm_rules_scope_key
  on firm_rules (firm_slug, coalesce(program_slug, ''), scope, title);


-- =============================================================================
-- 4. PROMOTIONS — eligibilite fine
-- =============================================================================
alter table firm_promotions add column if not exists eligible_markets   text[];
alter table firm_promotions add column if not exists eligible_variants  text[];
-- Le brief FTMO impose de limiter la promotion 20 % au seul 1-Step 100K.
alter table firm_promotions add column if not exists stacking_rule      text;
-- Tant que ce drapeau est faux, la page ne promet aucun prerempli au checkout.
alter table firm_promotions add column if not exists checkout_verified  boolean not null default false;
alter table firm_promotions add column if not exists affiliate_exclusive boolean not null default false;


-- =============================================================================
-- 5. Droits et index
-- =============================================================================
create index if not exists firm_programs_market_idx on firm_programs (firm_slug, market, sort_order);
create index if not exists firm_plans_variant_idx   on firm_program_plans (program_id, variant_key);
create index if not exists firm_rules_program_idx   on firm_rules (firm_slug, program_slug);


-- =============================================================================
-- CONTROLE
-- =============================================================================
select 'firm_programs' as t, count(*) filter (where market is not null) as market_ok, count(*) as total
from firm_programs
union all
select 'firm_program_plans', count(*) filter (where currency is not null), count(*) from firm_program_plans
union all
select 'firm_rules', count(*) filter (where severity is not null), count(*) from firm_rules;

-- Attendu : aucune ligne perdue, currency renseignee partout (defaut USD),
-- et la contrainte de severite accepte desormais les sept consequences.
select conname from pg_constraint where conname = 'firm_rules_severity_check';
select indexname from pg_indexes
where indexname in ('firm_program_plans_variant_key', 'firm_rules_scope_key');
