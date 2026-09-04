-- =============================================================================
-- SCHEMA PROGRAMMES — additif, retro-compatible
-- =============================================================================
-- A coller dans supabase.com -> SQL Editor -> New query -> Run.
--
-- Ce script NE TOUCHE PAS a prop_firm_challenges. Il ajoute six tables que le
-- code lit en priorite, avec repli automatique sur l'existant : une firme sans
-- ligne dans firm_programs s'affiche exactement comme aujourd'hui.
--
-- Idempotent : rejouable sans casse.
-- =============================================================================


-- 1. Un programme d'une firme (Elite, Nitro, Prime, Instant...)
create table if not exists firm_programs (
  id                  uuid primary key default gen_random_uuid(),
  firm_slug           text not null,
  slug                text not null,
  name                text not null,
  -- 'evaluation' : il faut passer une evaluation. 'instant' : finance a l'achat.
  kind                text not null default 'evaluation',
  evaluation_steps    integer,
  summary             text,
  sort_order          integer not null default 0,
  -- Plafond de comptes FINANCES actifs. A ne jamais confondre avec le nombre
  -- de comptes qu'un bundle permet d'ACHETER.
  max_funded_accounts integer,
  max_funded_note     text,
  source_url          text,
  verified_at         timestamptz,
  confidence          text default 'verified',
  editorial_note      text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (firm_slug, slug)
);

-- 2. Une ligne par (programme, phase, taille de compte).
--    C'est la separation que prop_firm_challenges ne savait pas exprimer :
--    l'evaluation et le compte finance ne se melangent plus jamais.
create table if not exists firm_program_plans (
  id                   uuid primary key default gen_random_uuid(),
  program_id           uuid not null references firm_programs(id) on delete cascade,
  phase                text not null check (phase in ('evaluation', 'sim_funded', 'live')),
  account_size         numeric not null,
  -- Prix REGULIER, stable. Les promotions vivent dans firm_promotions.
  regular_price        numeric,
  profit_target        numeric,
  maximum_loss_limit   numeric,
  daily_loss_limit     numeric,
  drawdown_type        text,
  buffer               numeric,
  -- 'none' | 'amount' | 'not_stated' : distingue « pas de buffer » de
  -- « buffer inconnu ». Un buffer a 0 aurait confondu les deux.
  buffer_status        text default 'not_stated',
  max_contracts        integer,
  contract_scaling     boolean,
  minimum_trading_days integer,
  -- Fraction : 0.4 = 40 %.
  consistency_rule     numeric,
  profit_split         numeric,
  payout_cap           numeric,
  minimum_payout       numeric,
  days_between_payouts integer,
  reset_fee            numeric,
  activation_fee       numeric,
  -- 'allowed' | 'restricted' | 'prohibited' | 'needs_confirmation'
  -- Un booleen ne pouvait pas porter « With restrictions ».
  news_trading_status  text,
  news_trading_note    text,
  scalping_status      text,
  scalping_note        text,
  source_url           text,
  verified_at          timestamptz,
  confidence           text default 'verified',
  editorial_note       text,
  unique (program_id, phase, account_size)
);

-- 3. Promotions. Regulier et promo sont deux enregistrements distincts.
create table if not exists firm_promotions (
  id             uuid primary key default gen_random_uuid(),
  firm_slug      text not null,
  -- null = toute la firme. Renseigne = promotion propre a un programme.
  program_slug   text,
  -- null = toutes les tailles. SUMMER varie de 25 a 35 % selon la taille :
  -- c'est precisement ce qu'une remise au niveau firme ne savait pas dire.
  account_size   numeric,
  code           text,
  label          text,
  discount_type  text not null default 'percent' check (discount_type in ('percent', 'amount')),
  discount_value numeric not null,
  starts_at      timestamptz,
  -- null = expiration inconnue. JAMAIS « permanent ».
  expires_at     timestamptz,
  verified_at    timestamptz,
  source_url     text,
  status         text not null default 'active' check (status in ('active', 'expired', 'pending', 'inactive')),
  -- Distingue une offre publique d'un code partenaire. Sert a ne jamais
  -- presenter un code partenaire comme le meilleur prix quand il ne l'est pas.
  is_public      boolean not null default true,
  editorial_note text
);

-- 4. Bundle & Save : capacite d'ACHAT.
create table if not exists firm_program_bundles (
  id               uuid primary key default gen_random_uuid(),
  firm_slug        text not null,
  program_slug     text not null,
  account_number   integer not null,
  discount_percent numeric,
  status           text check (status in ('paid', 'free')),
  note             text,
  source_url       text,
  verified_at      timestamptz,
  unique (firm_slug, program_slug, account_number)
);

-- 5. Plateformes proposees, avec le supplement affiche au checkout.
create table if not exists firm_platforms (
  id                   uuid primary key default gen_random_uuid(),
  firm_slug            text not null,
  name                 text not null,
  configurator_status  text,
  checkout_surcharge   text,
  note                 text,
  sort_order           integer not null default 0,
  unique (firm_slug, name)
);

-- 6. Regles hors cartes de prix, avec un niveau de gravite explicite.
create table if not exists firm_rules (
  id          uuid primary key default gen_random_uuid(),
  firm_slug   text not null,
  scope       text not null,
  title       text not null,
  detail      text,
  -- Le brief impose ces cinq niveaux, et interdit la coche verte sur
  -- « With restrictions » ou « Scalping: No ».
  severity    text check (severity in ('hard_breach', 'restriction', 'payout_condition', 'allowed', 'needs_confirmation')),
  confidence  text default 'verified',
  source_url  text,
  verified_at timestamptz,
  sort_order  integer not null default 0,
  unique (firm_slug, scope, title)
);

-- 7. Bareme du compte live (conversion, plancher de perte, coussin).
create table if not exists firm_live_tiers (
  id             uuid primary key default gen_random_uuid(),
  firm_slug      text not null,
  account_size   numeric not null,
  conversion_cap numeric,
  loss_floor     numeric,
  cushion        numeric,
  daily_minimum  numeric,
  max_mini       integer,
  max_micro      integer,
  unique (firm_slug, account_size)
);


-- Index de lecture : la fiche interroge toujours par firm_slug.
create index if not exists firm_programs_firm_idx   on firm_programs (firm_slug, sort_order);
create index if not exists firm_plans_program_idx   on firm_program_plans (program_id, phase);
create index if not exists firm_promotions_firm_idx on firm_promotions (firm_slug, status);
create index if not exists firm_bundles_firm_idx    on firm_program_bundles (firm_slug, program_slug, account_number);
create index if not exists firm_platforms_firm_idx  on firm_platforms (firm_slug, sort_order);
create index if not exists firm_rules_firm_idx      on firm_rules (firm_slug, scope);
create index if not exists firm_live_tiers_firm_idx on firm_live_tiers (firm_slug, account_size);


-- Lecture publique, ecriture reservee au service. Meme posture que les autres
-- tables du catalogue : la fiche firme est publique.
alter table firm_programs        enable row level security;
alter table firm_program_plans   enable row level security;
alter table firm_promotions      enable row level security;
alter table firm_program_bundles enable row level security;
alter table firm_platforms       enable row level security;
alter table firm_rules           enable row level security;
alter table firm_live_tiers      enable row level security;

do $$
declare t text;
begin
  foreach t in array array['firm_programs', 'firm_program_plans', 'firm_promotions',
                           'firm_program_bundles', 'firm_platforms', 'firm_rules',
                           'firm_live_tiers']
  loop
    if not exists (select 1 from pg_policies where tablename = t and policyname = 'lecture publique') then
      execute format('create policy %L on %I for select using (true)', 'lecture publique', t);
    end if;
  end loop;
end $$;


-- CONTROLE
select table_name, (select count(*) from information_schema.columns c
                    where c.table_name = t.table_name) as nb_colonnes
from information_schema.tables t
where table_name in ('firm_programs', 'firm_program_plans', 'firm_promotions',
                     'firm_program_bundles', 'firm_platforms', 'firm_rules',
                     'firm_live_tiers')
order by table_name;
