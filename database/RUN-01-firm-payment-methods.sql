-- =============================================================================
-- MOYENS DE PAIEMENT NORMALISES — SCHEMA
-- =============================================================================
-- A coller dans supabase.com -> SQL Editor -> New query -> Run.
--
-- ADDITIF : aucune table existante n'est modifiee, aucune colonne supprimee.
-- `prop_firms.payout_methods` reste ecrite et lue en repli.
--
-- Idempotent : `if not exists` partout, rejouable sans casse.
--
-- POURQUOI DEUX FLUX DANS UNE SEULE TABLE
--
-- Payer la firme et etre paye par elle n'empruntent pas les memes rails :
-- FuturesElite encaisse par carte et reverse par Rise. Une liste unique
-- melangeait les deux et ne pouvait pas dire lequel etait lequel.
--
-- POURQUOI UNE LIGNE PAR METHODE
--
-- CLAUDE.md documente trois pannes dues au mismatch TEXT / `string[]` sur
-- `platforms`. Une ligne par methode supprime la question : plus de tableau a
-- serialiser, plus de format a deviner a la lecture.
-- =============================================================================


-- 1. Prerequis : la cle etrangere exige que `slug` soit unique.
--    L'index existe deja en pratique ; on le declare pour que le script
--    fonctionne aussi sur une base fraiche.
create unique index if not exists prop_firms_slug_key on prop_firms (slug);


-- 2. La table
create table if not exists firm_payment_methods (
  id           uuid primary key default gen_random_uuid(),

  -- Cle etrangere reelle, contrairement aux sept tables precedentes qui se
  -- contentent d'un `firm_slug` libre. C'est une amelioration assumee : une
  -- ligne orpheline y est aujourd'hui possible, ici non.
  firm_slug    text not null references prop_firms (slug) on update cascade on delete cascade,

  -- 'purchase' : ce avec quoi on ACHETE une evaluation.
  -- 'payout'   : ce par quoi la firme VERSE les gains.
  flow         text not null check (flow in ('purchase', 'payout')),

  name         text not null,
  kind         text check (kind in ('card', 'bank', 'crypto', 'wallet', 'provider', 'other')),

  -- Le prestataire derriere la methode, quand il differe du nom affiche :
  -- « Visa » passe par un PSP, « Rise » est a la fois nom et prestataire.
  provider     text,

  note         text,
  lead_time    text,     -- « 1 a 3 jours apres approbation »
  availability text,     -- restriction geographique ou de compte

  source_url   text,
  verified_at  timestamptz,

  -- Meme convention que les sept autres tables : une methode non confirmee
  -- s'affiche marquee, elle ne disparait pas.
  confidence   text not null default 'verified'
               check (confidence in ('verified', 'needs_confirmation', 'unknown')),

  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- Rise peut exister dans les deux flux sans etre confondu.
  unique (firm_slug, flow, name)
);


-- 3. Index
create index if not exists firm_payment_methods_firm_idx
  on firm_payment_methods (firm_slug, flow, sort_order);

-- Recherche des methodes publiables : celles qui sont verifiees.
create index if not exists firm_payment_methods_verified_idx
  on firm_payment_methods (firm_slug, confidence)
  where confidence = 'verified';


-- 4. `updated_at` tenu par la base, pas par l'appelant.
create or replace function firm_payment_methods_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists firm_payment_methods_touch_trg on firm_payment_methods;
create trigger firm_payment_methods_touch_trg
  before update on firm_payment_methods
  for each row execute function firm_payment_methods_touch();


-- 5. Lecture publique, comme les sept autres tables.
alter table firm_payment_methods enable row level security;

drop policy if exists lecture_publique on firm_payment_methods;
create policy lecture_publique on firm_payment_methods for select using (true);

grant select on firm_payment_methods to anon, authenticated;


-- 6. Controle
select to_regclass('public.firm_payment_methods') as table_creee,
       (select count(*) from pg_indexes
         where tablename = 'firm_payment_methods')  as nb_index,
       (select count(*) from information_schema.table_constraints
         where table_name = 'firm_payment_methods'
           and constraint_type = 'FOREIGN KEY')     as nb_cles_etrangeres;

-- ATTENDU : firm_payment_methods | 4 | 1
--   (cle primaire, contrainte unique, et les deux index crees au bloc 3)
