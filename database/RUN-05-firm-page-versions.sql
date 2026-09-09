-- =============================================================================
-- COUCHE DE PUBLICATION IMMUABLE
-- =============================================================================
-- ADDITIF. Aucune table existante n'est modifiee, sauf l'ajout d'une colonne
-- de reference sur `prop_firms`. Aucune colonne n'est supprimee.
--
-- LE PROBLEME QUE CETTE TABLE RESOUT
--
-- Les pages publiques lisent aujourd'hui des donnees VIVANTES : huit tables
-- normalisees plus une trentaine de colonnes editoriales. Une fiche validee
-- lundi regresse mercredi des qu'une ligne change, sans que personne ne
-- l'ait publiee.
--
-- C'est exactement ce qui s'est produit cette semaine, six fois : un chiffre
-- corrige dans une colonne, un texte editorial reste en arriere, et la page a
-- servi les deux.
--
-- Une version publiee fige donc l'ETAT COMPLET d'une fiche au moment ou elle a
-- passe la validation. La donnee canonique reste modifiable : c'est le plan de
-- travail. Le public ne lit plus que des versions.
--
-- POURQUOI PAS `page_model_status`
--
-- `page_model_status = 'active'` est une colonne MUTABLE : la mettre a 'active'
-- ne prouve rien sur ce que la page servira ensuite. Elle reste utile comme
-- metadonnee de migration, mais elle n'autorise plus rien a elle seule.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. La table des versions
-- -----------------------------------------------------------------------------
create table if not exists firm_page_versions (
  id                     uuid primary key default gen_random_uuid(),

  firm_slug              text not null
                         references prop_firms (slug) on update cascade on delete cascade,

  -- Croissant par firme, jamais reutilise. Voir le trigger d'attribution.
  version_number         integer not null,

  -- L'etat fige. `page_model_json` est ce que la page publique rend ;
  -- `summary_model_json` ce que /compare, /best-for et les cartes rendent.
  page_model_json        jsonb not null,
  summary_model_json     jsonb not null,

  -- Le verdict du validateur au moment de la creation, conserve tel quel.
  -- Une version publiee garde donc la trace de ses avertissements — portee de
  -- promotion non confirmee, conflits de sources ouverts — meme des annees
  -- plus tard.
  validation_report_json jsonb not null,

  -- Empreinte deterministe des donnees canoniques ayant produit cette version.
  -- Deux constructions des memes donnees donnent le meme hash : c'est ce qui
  -- permet de savoir si la donnee de travail a bouge depuis la publication.
  source_hash            text not null,

  -- La forme du JSON, pas son contenu.
  --
  -- Un instantane ne change plus jamais ; le code qui le rend, si. Sans ce
  -- numero, un champ renomme se manifesterait par un `undefined` au milieu
  -- d'une fiche : une page a moitie vide, servie sans un mot. Le lecteur
  -- REFUSE une version hors de l'intervalle qu'il sait interpreter.
  --
  -- Politique d'incrementation et procedure de migration : lib/publication/schema.ts
  model_schema_version   integer not null default 1
                         constraint firm_page_versions_model_schema_version_check
                         check (model_schema_version >= 1),

  verified_at            timestamptz,
  created_at             timestamptz not null default now(),
  created_by             text,

  status                 text not null default 'draft'
                         check (status in ('draft', 'validated', 'published', 'archived')),

  published_at           timestamptz,
  archived_at            timestamptz,

  unique (firm_slug, version_number),

  -- Redondant avec la cle primaire, et pourtant indispensable : c'est la cle
  -- que la contrainte composite de `prop_firms` reference. Sans elle, Postgres
  -- ne peut pas garantir qu'une firme pointe vers SA propre version.
  constraint firm_page_versions_firm_slug_id_key unique (firm_slug, id)
);


-- -----------------------------------------------------------------------------
-- 1 bis. Mise a niveau d'une table deja creee
-- -----------------------------------------------------------------------------
-- `create table if not exists` ne fait RIEN quand la table existe deja. Une
-- base ou une version anterieure de ce fichier serait passee garderait donc une
-- table sans `model_schema_version` et sans `unique (firm_slug, id)` — et la
-- contrainte composite plus bas echouerait sur une erreur peu parlante.
--
-- Ce bloc rend le fichier reellement rejouable : sur une base vierge il ne fait
-- rien, sur une base a moitie migree il complete.
alter table firm_page_versions
  add column if not exists model_schema_version integer not null default 1;

do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'firm_page_versions'::regclass
       and conname = 'firm_page_versions_model_schema_version_check'
  ) then
    alter table firm_page_versions
      add constraint firm_page_versions_model_schema_version_check
      check (model_schema_version >= 1);
  end if;

  -- La cle que reference la contrainte composite de `prop_firms`. Redondante
  -- avec la cle primaire, et pourtant indispensable : sans elle, Postgres ne
  -- peut pas exprimer « cette firme pointe vers SA version ».
  if not exists (
    select 1 from pg_constraint
     where conrelid = 'firm_page_versions'::regclass
       and conname = 'firm_page_versions_firm_slug_id_key'
  ) then
    alter table firm_page_versions
      add constraint firm_page_versions_firm_slug_id_key unique (firm_slug, id);
  end if;
end $$;


-- -----------------------------------------------------------------------------
-- 2. La reference de version active
-- -----------------------------------------------------------------------------
-- Une colonne distincte de `listing_status` ET de `page_model_status` :
--   listing_status      la fiche est-elle publiquement listee (SEO)
--   page_model_status   metadonnee de migration, informative
--   active_page_version_id  CE QUE LE PUBLIC LIT — la seule qui decide
alter table prop_firms
  add column if not exists active_page_version_id uuid;

-- LA CONTRAINTE COMPOSITE
--
-- Une cle etrangere sur `active_page_version_id` seul laissait passer une
-- absurdite : FTMO pointant vers une version de FuturesElite. La RPC
-- l'empechait, mais une RPC est du code applicatif — un UPDATE direct, un
-- script de maintenance, une migration ecrite un soir de hate passaient a
-- cote. La base doit le refuser elle-meme.
--
-- `(slug, active_page_version_id)` doit donc exister dans
-- `firm_page_versions (firm_slug, id)`. Une firme ne peut plus servir que ses
-- propres versions, quel que soit le chemin d'ecriture.
--
-- MATCH SIMPLE, le defaut : quand `active_page_version_id` est NULL, la
-- contrainte est satisfaite sans verification. C'est exactement ce qu'il faut,
-- puisque NULL signifie « rendu historique ».
--
-- DEFERRABLE INITIALLY DEFERRED : la verification a lieu au COMMIT, pas a
-- l'instruction. Sans cela, renommer un slug serait impossible — la cascade
-- vers `firm_page_versions.firm_slug` et la mise a jour de `prop_firms.slug`
-- ne peuvent pas etre simultanees, et l'une des deux verrait un etat
-- transitoire incoherent.
--
-- `on delete restrict` remplace l'ancien `on delete set null`, qui etait un
-- defaut : il aurait fait retomber une fiche publiee sur les donnees mutables
-- en silence. Desormais, supprimer une version encore active est refuse. Il
-- faut la retirer d'abord — `deactivate_firm_version` —, ce qui est une
-- decision, pas un effet de bord. `on update cascade` suit les renommages de
-- slug, propages par la meme transaction.
do $$
begin
  -- L'ancienne contrainte simple est remplacee, pas conservee : la garder en
  -- plus n'ajouterait rien et laisserait son `on delete set null` en travers.
  if exists (
    select 1 from pg_constraint where conname = 'prop_firms_active_page_version_fk'
  ) then
    alter table prop_firms drop constraint prop_firms_active_page_version_fk;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'prop_firms_active_version_meme_firme_fk'
  ) then
    alter table prop_firms add constraint prop_firms_active_version_meme_firme_fk
      foreign key (slug, active_page_version_id)
      references firm_page_versions (firm_slug, id)
      on update cascade
      on delete restrict
      deferrable initially deferred;
  end if;
end $$;

comment on column prop_firms.active_page_version_id is
  'Version immuable servie au public. NULL = rendu historique. Seule cette colonne autorise la publication ; page_model_status ne fait que documenter l''avancement de la migration.';


-- -----------------------------------------------------------------------------
-- 3. Immuabilite
-- -----------------------------------------------------------------------------
-- Une version publiee ne se modifie plus. La seule transition autorisee est
-- `published` -> `archived`, et elle ne touche que le statut et sa date.
--
-- Sans ce verrou, « immuable » ne serait qu'une intention : rien n'empecherait
-- un UPDATE de reecrire le JSON d'une version deja servie.

-- LES SEULS CHAMPS QUI BOUGENT ENCORE APRES PUBLICATION
--
-- Le cycle de vie, et rien d'autre. Tout le reste de la ligne est fige.
create or replace function firm_page_versions_champs_de_cycle()
returns text[] language sql immutable as $$
  select array['status', 'published_at', 'archived_at']::text[];
$$;

-- POURQUOI UNE COMPARAISON GENERIQUE PLUTOT QU'UNE LISTE
--
-- La premiere version enumerait les colonnes a proteger : les trois JSON,
-- l'empreinte, le slug, le numero. Elle laissait donc passer tout ce qui
-- n'etait pas dans la liste — `model_schema_version`, `verified_at`,
-- `created_at`, `created_by` — et surtout TOUTE COLONNE AJOUTEE PLUS TARD.
--
-- Une liste d'exclusion oubliee est un trou silencieux : rien ne signale
-- qu'une colonne nouvelle n'est pas protegee, on le decouvre le jour ou une
-- version publiee a change sans qu'on sache comment.
--
-- La comparaison porte donc sur la LIGNE ENTIERE, moins les trois champs de
-- cycle de vie. Le defaut est desormais « immuable », et l'exception doit etre
-- ecrite explicitement. Une colonne ajoutee demain est protegee sans que
-- personne n'ait a y penser.
create or replace function firm_page_versions_immutable()
returns trigger language plpgsql
set search_path = public, pg_temp as $$
declare
  cycle text[] := public.firm_page_versions_champs_de_cycle();
begin
  if old.status in ('published', 'archived') then
    if (to_jsonb(new) - cycle) is distinct from (to_jsonb(old) - cycle) then
      raise exception
        'Version % de % : le contenu d''une version % est immuable. Champs modifies : %.',
        old.version_number, old.firm_slug, old.status,
        (select coalesce(string_agg(cle, ', '), 'aucun')
           from jsonb_each(to_jsonb(new) - cycle) e(cle, valeur)
          where (to_jsonb(old) - cycle) -> cle is distinct from valeur);
    end if;

    -- Les seules transitions permises apres publication :
    --   published -> archived   une version plus recente prend la main
    --   archived  -> published  retour en arriere
    --
    -- Rien ne peut redevenir `draft` ou `validated` : ce serait rouvrir a
    -- l'edition un contenu deja servi, et l'immuabilite ne tiendrait plus.
    if new.status is distinct from old.status
       and new.status not in ('published', 'archived') then
      raise exception
        'Version % de % : transition % -> % interdite. Une version publiee ne redevient pas modifiable.',
        old.version_number, old.firm_slug, old.status, new.status;
    end if;
  end if;

  -- Seule une version validee — ou deja passee par la — peut etre publiee.
  -- `archived` est admis parce qu'une version archivee A ete validee : son
  -- rapport de validation est fige avec elle. C'est ce qui rend le retour en
  -- arriere instantane, sans revalidation.
  if new.status = 'published' and old.status not in ('validated', 'published', 'archived') then
    raise exception
      'Version % de % : seule une version « validated » peut etre publiee (statut actuel : %).',
      old.version_number, old.firm_slug, old.status;
  end if;

  return new;
end $$;

drop trigger if exists firm_page_versions_immutable_trg on firm_page_versions;
create trigger firm_page_versions_immutable_trg
  before update on firm_page_versions
  for each row execute function firm_page_versions_immutable();


-- Une version publiee ne se supprime pas : elle s'archive. Sans quoi
-- `active_page_version_id` deviendrait NULL en silence et la fiche
-- basculerait sur le rendu historique sans que personne ne l'ait decide.
create or replace function firm_page_versions_no_delete()
returns trigger language plpgsql
set search_path = public, pg_temp as $$
begin
  if old.status = 'published' then
    raise exception
      'Version % de % : une version publiee ne se supprime pas, elle s''archive.',
      old.version_number, old.firm_slug;
  end if;
  return old;
end $$;

drop trigger if exists firm_page_versions_no_delete_trg on firm_page_versions;
create trigger firm_page_versions_no_delete_trg
  before delete on firm_page_versions
  for each row execute function firm_page_versions_no_delete();


-- -----------------------------------------------------------------------------
-- 4. Numerotation
-- -----------------------------------------------------------------------------
-- POURQUOI `max + 1` NE SUFFIT PAS
--
-- Deux transactions concurrentes lisent toutes deux `max = 3`, calculent 4, et
-- l'une des deux echoue sur la contrainte d'unicite. La contrainte protege bien
-- l'integrite — jamais deux versions 4 —, mais elle la protege en FAISANT
-- ECHOUER une publication par ailleurs valide, avec une erreur `23505` que
-- l'appelant devrait interpreter et rejouer. Un verrou pose apres coup n'est
-- pas un verrou.
--
-- `pg_advisory_xact_lock` serialise les insertions PAR FIRME, avant la lecture
-- du maximum. La deuxieme transaction attend, lit `max = 4`, et obtient 5. Les
-- deux publications aboutissent, dans un ordre determine par la base.
--
-- Le verrou est transactionnel : il est relache au COMMIT ou au ROLLBACK, sans
-- rien a liberer a la main. Sa portee est la firme, pas la table : publier
-- FuturesElite n'attend jamais apres FTMO. Une collision de `hashtext` entre
-- deux slugs ferait attendre l'une apres l'autre — sans consequence, et sans
-- jamais compromettre la correction.
--
-- La contrainte `unique (firm_slug, version_number)` reste : le verrou est la
-- coordination, la contrainte est la preuve. Un chemin d'ecriture qui
-- contournerait le declencheur se heurterait encore a elle.
create or replace function firm_page_versions_number()
returns trigger language plpgsql
set search_path = public, pg_temp as $$
begin
  if new.version_number is null then
    perform pg_advisory_xact_lock(hashtext('firm_page_versions:' || new.firm_slug));

    select coalesce(max(version_number), 0) + 1
      into new.version_number
      from firm_page_versions
     where firm_slug = new.firm_slug;
  end if;
  return new;
end $$;

drop trigger if exists firm_page_versions_number_trg on firm_page_versions;
create trigger firm_page_versions_number_trg
  before insert on firm_page_versions
  for each row execute function firm_page_versions_number();


-- -----------------------------------------------------------------------------
-- 5. Index
-- -----------------------------------------------------------------------------
create index if not exists firm_page_versions_firm_idx
  on public.firm_page_versions (firm_slug, version_number desc);

-- La lecture publique : la version publiee d'une firme, retrouvee vite.
create index if not exists firm_page_versions_published_idx
  on public.firm_page_versions (firm_slug, published_at desc)
  where status = 'published';

-- UNE SEULE VERSION PUBLIEE PAR FIRME, IMPOSEE PAR LA BASE
--
-- `activate_firm_version` archive l'ancienne avant de publier la nouvelle, et
-- `rollback_firm_version` fait de meme. Mais c'est de l'ORDONNANCEMENT dans du
-- code applicatif : un UPDATE direct, une reprise manuelle apres incident, un
-- script de maintenance laisseraient deux lignes `published` pour la meme
-- firme sans que rien ne proteste.
--
-- L'etat serait alors ambigu au pire endroit : `active_page_version_id` dirait
-- laquelle est servie, le statut en designerait deux, et le premier a lire
-- « la derniere publiee » servirait la mauvaise.
--
-- L'index unique partiel rend cet etat impossible. Il ne gene aucune des deux
-- fonctions : toutes deux archivent AVANT de publier, en deux instructions
-- distinctes, donc aucun instant n'a deux lignes publiees.
create unique index if not exists firm_page_versions_one_published_per_firm
  on public.firm_page_versions (firm_slug)
  where status = 'published';

create index if not exists prop_firms_active_version_idx
  on public.prop_firms (active_page_version_id)
  where active_page_version_id is not null;


-- -----------------------------------------------------------------------------
-- 6. RLS — meme convention que les huit autres tables
-- -----------------------------------------------------------------------------
alter table firm_page_versions enable row level security;

-- Le public ne lit QUE les versions publiees. Un brouillon ne doit jamais
-- sortir : c'est la garantie demandee au point 5 du brief.
drop policy if exists lecture_publiee on firm_page_versions;
create policy lecture_publiee on firm_page_versions
  for select using (status = 'published');

grant select on firm_page_versions to anon, authenticated;

-- L'ecriture passe par la cle de service, jamais par le client.


-- -----------------------------------------------------------------------------
-- 7. Controle
-- -----------------------------------------------------------------------------
select to_regclass('public.firm_page_versions')                        as table_creee,
       (select count(*) from pg_indexes
         where tablename = 'firm_page_versions')                       as nb_index,
       (select count(*) from pg_trigger
         where tgrelid = 'firm_page_versions'::regclass
           and not tgisinternal)                                       as nb_triggers,
       (select count(*) from information_schema.columns
         where table_name = 'prop_firms'
           and column_name = 'active_page_version_id')                 as colonne_active,
       (select count(*) from information_schema.columns
         where table_name = 'firm_page_versions'
           and column_name = 'model_schema_version')                   as colonne_schema,
       -- La garantie que la base impose elle-meme : une firme ne peut pointer
       -- que vers ses propres versions.
       case when exists (
              select 1 from pg_constraint
               where conname = 'prop_firms_active_version_meme_firme_fk'
                 and contype = 'f' and array_length(conkey, 1) = 2)
            then 'ok' else 'ABSENTE' end                               as fk_composite,
       -- L'ancienne cle simple, avec son `on delete set null`, doit avoir
       -- disparu : elle aurait fait retomber une fiche publiee sur les donnees
       -- mutables en silence.
       case when exists (
              select 1 from pg_constraint
               where conname = 'prop_firms_active_page_version_fk')
            then 'ENCORE LA' else 'ok' end                             as fk_simple_retiree,
       -- Le verrou par firme, sans lequel `max + 1` fait echouer une
       -- publication concurrente au lieu de l'ordonner.
       case when (select prosrc from pg_proc
                   where proname = 'firm_page_versions_number')
                 like '%pg_advisory_xact_lock%'
            then 'ok' else 'ABSENT' end                                as verrou_par_firme,
       -- Une seule ligne `published` par firme, impose par la base et non par
       -- l'ordonnancement des fonctions.
       case when exists (
              select 1 from pg_indexes
               where indexname = 'firm_page_versions_one_published_per_firm')
            then 'ok' else 'ABSENT' end                                as une_seule_publiee,
       -- L'immuabilite compare la ligne ENTIERE : une colonne ajoutee demain
       -- est protegee sans que personne n'ait a y penser.
       case when (select prosrc from pg_proc
                   where proname = 'firm_page_versions_immutable')
                 like '%to_jsonb(new) - cycle%'
            then 'ok' else 'LISTE MANUELLE' end                        as immuabilite_generique,
       -- Les cinq fonctions, dont les trois `security definer`, ont un chemin
       -- de recherche fige.
       (select count(*) from pg_proc
         where proname in ('activate_firm_version', 'rollback_firm_version',
                           'deactivate_firm_version', 'firm_page_versions_immutable',
                           'firm_page_versions_number', 'firm_page_versions_no_delete')
           and exists (select 1 from unnest(proconfig) c
                        where c like 'search_path=%public%'))            as nb_search_path_figes;

-- ATTENDU : firm_page_versions | 6 | 3 | 1 | 1 | ok | ok | ok | ok | ok | 6
--
-- 6 index : cle primaire, les deux contraintes d'unicite, les deux index de
-- lecture, et l'unicite partielle sur `published`. La deuxieme unicite
-- `(firm_slug, id)` n'est pas decorative : c'est la cle referencee par la
-- contrainte composite.


-- -----------------------------------------------------------------------------
-- RETOUR EN ARRIERE
-- -----------------------------------------------------------------------------
-- Retirer une firme de la couche de publication, sans rien supprimer :
--
--   select deactivate_firm_version('futureselite');
--
--   -- la fiche retombe immediatement sur le rendu historique.
--
-- C'EST LE SEUL MOYEN AUTORISE. Ne jamais ecrire :
--
--   update prop_firms set active_page_version_id = null where slug = '...';
--
-- Cet UPDATE parait equivalent et ne l'est pas : il retire le pointeur mais
-- laisse la version au statut `published`. La ligne devient orpheline — plus
-- personne ne la sert, et pourtant elle occupe la place unique que l'index
-- partiel `firm_page_versions_one_published_per_firm` reserve a la version
-- publiee de cette firme.
--
-- La publication SUIVANTE echouerait donc sur une violation d'unicite, pour
-- une raison invisible depuis le message d'erreur. `deactivate_firm_version`
-- fait les deux gestes dans la meme transaction : pointeur a NULL, ET ancienne
-- version archivee.
--
-- Defaire entierement (le code doit alors etre redeploye) :
--   alter table prop_firms drop constraint if exists prop_firms_active_version_meme_firme_fk;
--   alter table prop_firms drop column if exists active_page_version_id;
--   drop trigger if exists firm_page_versions_no_delete_trg on firm_page_versions;
--   drop trigger if exists firm_page_versions_immutable_trg on firm_page_versions;
--   drop function if exists activate_firm_version(uuid, text);
--   drop function if exists rollback_firm_version(text, integer);
--   drop function if exists deactivate_firm_version(text);
--   drop function if exists firm_page_versions_champs_de_cycle();
--   drop table if exists firm_page_versions;


-- -----------------------------------------------------------------------------
-- 8. Activation atomique
-- -----------------------------------------------------------------------------
-- POURQUOI CETTE FONCTION EXISTE
--
-- Publier touche DEUX tables : le statut de la version, et la reference active
-- sur la firme. Le client Supabase ne sait pas ouvrir de transaction : deux
-- appels successifs laisseraient une fenetre ou la version est `published`
-- sans etre servie, ou l'inverse.
--
-- Le partage des roles est donc net :
--   TypeScript construit le modele et le valide — Postgres ne sait pas le faire ;
--   Postgres bascule — TypeScript ne sait pas le faire atomiquement.

-- POURQUOI UN `search_path` FIXE SUR CES TROIS FONCTIONS
--
-- `security definer` fait executer le corps avec les droits du PROPRIETAIRE,
-- pas de l'appelant. Sans `search_path` fixe, l'appelant choisit ou les noms
-- non qualifies se resolvent : un schema place devant `public`, une table
-- `firm_page_versions` qui lui appartient, et la fonction ecrit chez lui avec
-- les droits du proprietaire.
--
-- `set search_path = public, pg_temp` fige la resolution a la definition.
-- `pg_temp` est place EN DERNIER, jamais devant : sinon une table temporaire
-- creee par l'appelant masquerait la vraie.
--
-- Les tables sont en plus qualifiees `public.` : la fonction ne depend alors
-- plus du tout du chemin, et le `set` devient une ceinture par-dessus les
-- bretelles.
create or replace function activate_firm_version(p_version_id uuid, p_actor text default null)
returns table (firm_slug text, version_number integer, previous_version_id uuid)
language plpgsql security definer
set search_path = public, pg_temp as $$
declare
  v record;
  v_precedente uuid;
begin
  -- `for update` : deux publications simultanees de la meme firme se mettent
  -- en file au lieu de s'ecraser.
  select * into v from public.firm_page_versions where id = p_version_id for update;

  if v is null then
    raise exception 'Version % introuvable.', p_version_id;
  end if;

  if v.status not in ('validated', 'published') then
    raise exception
      'Version % de % : statut « % ». Seule une version validee se publie.',
      v.version_number, v.firm_slug, v.status;
  end if;

  select active_page_version_id into v_precedente
    from public.prop_firms where slug = v.firm_slug for update;

  -- L'ancienne version est archivee, jamais supprimee : c'est ce qui rend le
  -- retour en arriere possible.
  if v_precedente is not null and v_precedente <> p_version_id then
    update public.firm_page_versions
       set status = 'archived', archived_at = now()
     where id = v_precedente and status = 'published';
  end if;

  update public.firm_page_versions
     set status = 'published',
         published_at = coalesce(published_at, now()),
         created_by = coalesce(created_by, p_actor)
   where id = p_version_id;

  update public.prop_firms
     set active_page_version_id = p_version_id
   where slug = v.firm_slug;

  return query select v.firm_slug, v.version_number, v_precedente;
end $$;


-- Le retour en arriere : republier une version deja archivee.
--
-- Volontairement une fonction distincte, et non un drapeau sur la precedente :
-- un retour arriere n'est pas une publication. Il ne revalide rien — la
-- version cible avait deja ete validee quand elle a ete creee, et c'est tout
-- l'interet de figer le rapport de validation avec elle.
create or replace function rollback_firm_version(p_firm_slug text, p_version_number integer)
returns table (restored_id uuid, restored_number integer, replaced_id uuid)
language plpgsql security definer
set search_path = public, pg_temp as $$
declare
  v_cible uuid;
  v_active uuid;
begin
  select id into v_cible
    from public.firm_page_versions
   where firm_slug = p_firm_slug and version_number = p_version_number
   for update;

  if v_cible is null then
    raise exception 'Version % de % introuvable.', p_version_number, p_firm_slug;
  end if;

  select active_page_version_id into v_active
    from public.prop_firms where slug = p_firm_slug for update;

  if v_active = v_cible then
    raise exception 'Version % de % est deja active.', p_version_number, p_firm_slug;
  end if;

  if v_active is not null then
    update public.firm_page_versions
       set status = 'archived', archived_at = now()
     where id = v_active and status = 'published';
  end if;

  -- `archived` -> `published`. Le trigger d'immuabilite l'autorise parce que le
  -- CONTENU ne bouge pas : seul le statut change. Une version archivee a deja
  -- ete validee, et son rapport de validation est fige avec elle — c'est
  -- exactement ce qui permet de revenir en arriere sans rien revalider.
  --
  -- Aucun desarmement de trigger : `session_replication_role` demande le
  -- superutilisateur, que Supabase ne donne pas, et un verrou qu'on desarme
  -- pour ses propres besoins n'est plus un verrou.
  update public.firm_page_versions
     set status = 'published', archived_at = null, published_at = now()
   where id = v_cible;

  update public.prop_firms set active_page_version_id = v_cible where slug = p_firm_slug;

  return query select v_cible, p_version_number, v_active;
end $$;


-- Le retrait pur : la fiche retombe sur le rendu historique.
--
-- LE SEUL MOYEN AUTORISE DE DESACTIVER UNE FIRME.
--
-- Un `update prop_firms set active_page_version_id = null` ferait la moitie du
-- travail : il retirerait le pointeur en laissant la version `published`. Cette
-- ligne orpheline occuperait la place unique que l'index partiel reserve a la
-- version publiee de la firme, et la publication suivante echouerait sur une
-- violation d'unicite — sans que le message n'explique pourquoi.
--
-- Les deux gestes sont donc indissociables, et dans cet ordre : pointeur a
-- NULL, puis archivage. Ils vivent dans la meme transaction.
create or replace function deactivate_firm_version(p_firm_slug text)
returns uuid
language plpgsql security definer
set search_path = public, pg_temp as $$
declare v_active uuid;
begin
  select active_page_version_id into v_active
    from public.prop_firms where slug = p_firm_slug for update;

  update public.prop_firms set active_page_version_id = null where slug = p_firm_slug;

  if v_active is not null then
    update public.firm_page_versions
       set status = 'archived', archived_at = now()
     where id = v_active and status = 'published';
  end if;

  return v_active;
end $$;


revoke all on function activate_firm_version(uuid, text)      from public, anon, authenticated;
revoke all on function rollback_firm_version(text, integer)   from public, anon, authenticated;
revoke all on function deactivate_firm_version(text)          from public, anon, authenticated;
-- `service_role` uniquement : ces trois fonctions changent ce que le public voit.
grant execute on function activate_firm_version(uuid, text)    to service_role;
grant execute on function rollback_firm_version(text, integer) to service_role;
grant execute on function deactivate_firm_version(text)        to service_role;
