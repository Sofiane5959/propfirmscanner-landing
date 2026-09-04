// =============================================================================
// GENERATEUR DU SCHEMA PROGRAMMES  scripts/build-program-schema.mjs
// =============================================================================
//   node scripts/build-program-schema.mjs
//
// Ecrit :
//   database/RUN-program-schema.sql        le schema (DDL), additif
//   database/RUN-futureselite-programs.sql les donnees FuturesElite
//
// POURQUOI UN NOUVEAU SCHEMA PLUTOT QU'UNE REFONTE
//
// `prop_firm_challenges` porte une ligne PLATE par challenge : elle n'a pas de
// notion de phase, et confond donc l'objectif d'evaluation et le partage du
// compte finance. Elle est aussi lue par les 350 fiches, /compare, /best-for et
// le tableau de bord. La modifier en profondeur casserait tout le site pour une
// seule firme.
//
// Ces tables sont donc ADDITIVES et retro-compatibles : rien n'est supprime,
// rien n'est renomme. Une fiche qui n'a pas de ligne dans `firm_programs`
// continue de lire `prop_firm_challenges` exactement comme avant.
//
// Regle du brief tenue partout : jamais zero pour un inconnu. Un champ non
// applicable vaut NULL et porte un statut explicite (`buffer_status`,
// `confidence`, `scalping_status`...).
// =============================================================================

import { writeFile } from 'node:fs/promises'
import {
  FUTURESELITE_PROGRAMS, FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION,
  FUTURESELITE_BUNDLES, FUTURESELITE_PLATFORMS, FUTURESELITE_RULES,
  FUTURESELITE_LIVE_TIERS, FUTURESELITE_META,
  SCALPING_STATUS, SCALPING_NOTE, NEWS_STATUS, NEWS_NOTE_FUNDED,
} from './futureselite-programs.mjs'

const S = (v) => (v === null || v === undefined || v === '' ? 'null' : "'" + String(v).replace(/'/g, "''") + "'")
const N = (v) => (v === null || v === undefined ? 'null' : String(v))
const B = (v) => (v === null || v === undefined ? 'null' : String(Boolean(v)))
const D = (v) => (v === null || v === undefined ? 'null' : `timestamptz '${v}'`)

// -----------------------------------------------------------------------------
// DDL
// -----------------------------------------------------------------------------
const DDL = `-- =============================================================================
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
`

// -----------------------------------------------------------------------------
// Donnees FuturesElite
// -----------------------------------------------------------------------------
const F = FUTURESELITE_META.firm_slug
const V = FUTURESELITE_META.verified_at

function buildData() {
  const L = []
  L.push('-- =============================================================================')
  L.push('-- FUTURESELITE — PROGRAMMES, PRIX, PROMOTIONS ET REGLES')
  L.push('-- =============================================================================')
  L.push('-- Prerequis : avoir passe database/RUN-program-schema.sql.')
  L.push('--')
  L.push(`-- Source : classeur du ${V}, releve sur le configurateur et la FAQ officiels.`)
  L.push('-- L onglet Account Plans etait desaligne (valeurs tassees vers la gauche) ;')
  L.push('-- l affectation utilisee ici a ete reconstruite puis validee, et elle est')
  L.push('-- documentee dans scripts/futureselite-programs.mjs.')
  L.push('--')
  L.push('-- Idempotent : les lignes sont effacees puis reinserees.')
  L.push('-- =============================================================================')
  L.push('')
  L.push('')
  L.push('-- 1. Table rase pour cette firme uniquement')
  L.push(`delete from firm_program_plans where program_id in (select id from firm_programs where firm_slug = ${S(F)});`)
  for (const t of ['firm_programs', 'firm_promotions', 'firm_program_bundles', 'firm_platforms', 'firm_rules', 'firm_live_tiers']) {
    L.push(`delete from ${t} where firm_slug = ${S(F)};`)
  }
  L.push('')
  L.push('')
  L.push('-- 2. Les quatre programmes')
  L.push('insert into firm_programs (firm_slug, slug, name, kind, evaluation_steps, summary, sort_order, max_funded_accounts, max_funded_note, source_url, verified_at) values')
  L.push(FUTURESELITE_PROGRAMS.map((p) =>
    `  (${S(F)}, ${S(p.slug)}, ${S(p.name)}, ${S(p.kind)}, ${N(p.evaluation_steps)}, ${S(p.summary)}, ${N(p.sort_order)}, ${N(p.max_funded_accounts)}, ${S(p.max_funded_note)}, ${S(p.source_url)}, ${D(V)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 3. Les plans, une ligne par programme x phase x taille')
  L.push('--    L evaluation et le compte finance sont des lignes distinctes : ils ne')
  L.push('--    peuvent plus se melanger a l affichage.')
  const planRows = []
  for (const p of FUTURESELITE_PROGRAMS) {
    for (const pl of p.plans) {
      const news = NEWS_STATUS[pl.phase] ?? null
      planRows.push('  (' + [
        `(select id from firm_programs where firm_slug = ${S(F)} and slug = ${S(p.slug)})`,
        S(pl.phase), N(pl.account_size), N(pl.regular_price ?? null),
        N(pl.profit_target ?? null), N(pl.maximum_loss_limit ?? null), N(pl.daily_loss_limit ?? null),
        S(pl.drawdown_type ?? null), N(pl.buffer ?? null), S(pl.buffer_status ?? 'not_stated'),
        N(pl.max_contracts ?? null), B(pl.contract_scaling ?? null),
        N(pl.minimum_trading_days ?? null), N(pl.consistency_rule ?? null),
        N(pl.profit_split ?? null), N(pl.payout_cap ?? null), N(pl.minimum_payout ?? null),
        N(pl.days_between_payouts ?? null), N(pl.reset_fee ?? null), N(pl.activation_fee ?? null),
        S(news), S(pl.phase === 'sim_funded' ? NEWS_NOTE_FUNDED : null),
        S(SCALPING_STATUS), S(SCALPING_NOTE),
        S(p.source_url), D(V), S('verified'),
      ].join(', ') + ')')
    }
  }
  L.push('insert into firm_program_plans (program_id, phase, account_size, regular_price,')
  L.push('  profit_target, maximum_loss_limit, daily_loss_limit, drawdown_type, buffer,')
  L.push('  buffer_status, max_contracts, contract_scaling, minimum_trading_days,')
  L.push('  consistency_rule, profit_split, payout_cap, minimum_payout, days_between_payouts,')
  L.push('  reset_fee, activation_fee, news_trading_status, news_trading_note,')
  L.push('  scalping_status, scalping_note, source_url, verified_at, confidence) values')
  L.push(planRows.join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 4. Promotions')
  L.push('--    SUMMER varie de 25 a 35 % selon le programme ET la taille : une remise')
  L.push('--    au niveau firme ne pouvait pas l exprimer.')
  L.push('--    SCANNED donne 20 %, donc MOINS que l offre publique partout. is_public')
  L.push('--    a false permet au rendu de ne jamais l annoncer comme le meilleur prix.')
  const promos = [...FUTURESELITE_PROMOTIONS, FUTURESELITE_PARTNER_PROMOTION]
  L.push('insert into firm_promotions (firm_slug, program_slug, account_size, code, label,')
  L.push('  discount_type, discount_value, starts_at, expires_at, verified_at, source_url,')
  L.push('  status, is_public, editorial_note) values')
  L.push(promos.map((p) =>
    `  (${S(F)}, ${S(p.program_slug)}, ${N(p.account_size)}, ${S(p.code)}, ${S(p.label)}, ${S(p.discount_type)}, ${N(p.discount_value)}, ${D(p.starts_at)}, ${D(p.expires_at)}, ${D(p.verified_at)}, ${S(p.source_url)}, ${S(p.status)}, ${B(p.is_public)}, ${S(p.editorial_note)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 5. Bundle & Save — capacite d ACHAT, distincte du plafond FINANCE')
  L.push('insert into firm_program_bundles (firm_slug, program_slug, account_number, discount_percent, status, note, source_url, verified_at) values')
  L.push(FUTURESELITE_BUNDLES.map((b) =>
    `  (${S(F)}, ${S(b.program_slug)}, ${N(b.account_number)}, ${N(b.discount_percent)}, ${S(b.status)}, ${S(b.note)}, ${S(b.source_url)}, ${D(b.verified_at)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 6. Plateformes')
  L.push('insert into firm_platforms (firm_slug, name, configurator_status, checkout_surcharge, note, sort_order) values')
  L.push(FUTURESELITE_PLATFORMS.map((p) =>
    `  (${S(F)}, ${S(p.name)}, ${S(p.configurator_status)}, ${S(p.checkout_surcharge)}, ${S(p.note)}, ${N(p.sort_order)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 7. Regles')
  L.push('insert into firm_rules (firm_slug, scope, title, detail, severity, confidence, source_url, verified_at, sort_order) values')
  L.push(FUTURESELITE_RULES.map((r, i) =>
    `  (${S(F)}, ${S(r.scope)}, ${S(r.title)}, ${S(r.detail)}, ${S(r.severity)}, ${S(r.confidence)}, ${S(r.source_url)}, ${D(r.verified_at)}, ${N(i + 1)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 8. Bareme du compte live')
  L.push('insert into firm_live_tiers (firm_slug, account_size, conversion_cap, loss_floor, cushion, daily_minimum, max_mini, max_micro) values')
  L.push(FUTURESELITE_LIVE_TIERS.map((t) =>
    `  (${S(F)}, ${N(t.account_size)}, ${N(t.conversion_cap)}, ${N(t.loss_floor)}, ${N(t.cushion)}, ${N(t.daily_minimum)}, ${N(t.max_mini)}, ${N(t.max_micro)})`
  ).join(',\n') + ';')
  L.push('')
  L.push('')
  L.push('-- 9. CONTROLE')
  const nbPlans = FUTURESELITE_PROGRAMS.reduce((s, p) => s + p.plans.length, 0)
  L.push(`-- Attendu : ${FUTURESELITE_PROGRAMS.length} programmes, ${nbPlans} plans, ${promos.length} promotions,`)
  L.push(`--           ${FUTURESELITE_BUNDLES.length} paliers de bundle, ${FUTURESELITE_PLATFORMS.length} plateformes,`)
  L.push(`--           ${FUTURESELITE_RULES.length} regles, ${FUTURESELITE_LIVE_TIERS.length} paliers live.`)
  L.push('select p.name, pl.phase, pl.account_size, pl.regular_price, pl.profit_target,')
  L.push('       pl.maximum_loss_limit, pl.daily_loss_limit, pl.drawdown_type, pl.buffer_status,')
  L.push('       pl.max_contracts, pl.minimum_trading_days, pl.consistency_rule,')
  L.push('       pl.profit_split, pl.payout_cap, pl.reset_fee')
  L.push(`from firm_program_plans pl join firm_programs p on p.id = pl.program_id`)
  L.push(`where p.firm_slug = ${S(F)}`)
  L.push('order by p.sort_order, pl.phase desc, pl.account_size;')
  return L.join('\n') + '\n'
}

await writeFile('database/RUN-program-schema.sql', DDL, 'utf8')
await writeFile('database/RUN-futureselite-programs.sql', buildData(), 'utf8')

const nbPlans = FUTURESELITE_PROGRAMS.reduce((s, p) => s + p.plans.length, 0)
console.log('database/RUN-program-schema.sql        7 tables, additif')
console.log(`database/RUN-futureselite-programs.sql ${FUTURESELITE_PROGRAMS.length} programmes · ${nbPlans} plans · ` +
  `${FUTURESELITE_PROMOTIONS.length + 1} promotions · ${FUTURESELITE_BUNDLES.length} paliers · ` +
  `${FUTURESELITE_PLATFORMS.length} plateformes · ${FUTURESELITE_RULES.length} regles`)
