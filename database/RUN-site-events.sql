-- =============================================================================
-- SITE_EVENTS — ce qui se passe AVANT le clic sortant (30 septembre 2026)
-- =============================================================================
-- Pourquoi : affiliate_clicks mesure les sorties. Tout ce qui se joue avant est
-- invisible — et c'est la que se perd l'argent. Un visiteur qui copie SCANNED
-- puis ouvre le site du partenaire a la main est, aujourd'hui, un visiteur qui
-- n'a rien fait. Sans ce chiffre, impossible de dire si une page convertit mal
-- ou si le partenaire mange l'attribution.
--
-- Ce que la table recoit, depuis /api/signal :
--   code_copie   le visiteur a copie un code promo (intention la plus nette) ;
--   fiche_vue    il a ouvert une fiche firme (le denominateur du taux) ;
--   plan_choisi  il a change de programme ou de taille dans le configurateur.
--
-- Ce qu'elle ne recoit PAS : aucun identifiant de visiteur, aucun cookie,
-- aucune IP en clair. Seulement l'empreinte d'IP, avec le meme sel que
-- affiliate_clicks, pour pouvoir recouper sans jamais reconstituer l'IP.
-- C'est ce qui permet de se passer de banniere de consentement.
--
-- A executer une fois. Sans elle, /api/signal echoue en silence : les boutons
-- continuent de fonctionner, seule la mesure manque.
-- =============================================================================

begin;

create table if not exists public.site_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  event       text not null check (event in ('code_copie', 'fiche_vue', 'plan_choisi')),
  firm_slug   text not null,
  code        text,
  plan        text,
  placement   text,

  locale      text,
  path        text,
  country     text,
  region      text,

  ip_hash     text,
  user_agent  text,
  referrer    text,
  is_bot      boolean not null default false
);

comment on table public.site_events is
  'Gestes mesures avant la sortie : code copie, fiche vue, plan choisi. '
  'Ecrite par /api/signal avec la cle de service. Aucun identifiant de visiteur.';

-- Les trois lectures du tableau de bord : par firme, par jour, par evenement.
create index if not exists site_events_firm_date_idx
  on public.site_events (firm_slug, created_at desc);
create index if not exists site_events_event_date_idx
  on public.site_events (event, created_at desc);
create index if not exists site_events_date_idx
  on public.site_events (created_at desc);

-- Ferme par defaut : seule la cle de service ecrit, seuls les admins lisent.
alter table public.site_events enable row level security;

-- L'admin est identifie par son uuid, comme dans /admin/analytics : le site
-- n'a pas de colonne de role. Si un jour il y en a une, remplacer cette
-- politique plutot que d'ajouter une seconde.
drop policy if exists "site_events: lecture admin" on public.site_events;
create policy "site_events: lecture admin" on public.site_events
  for select
  using (auth.uid() = '6d573ff4-b6ac-481e-b024-d54e7977f96f'::uuid);

commit;


-- Controle : la table existe, elle est vide, et le public n'y accede pas.
select count(*) as lignes from public.site_events;
select policyname, cmd from pg_policies where tablename = 'site_events';
