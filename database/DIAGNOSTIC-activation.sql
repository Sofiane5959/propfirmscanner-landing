-- =============================================================================
-- DIAGNOSTIC D'ACTIVATION — ETAT REEL, RIEN D'AUTRE
-- =============================================================================
-- LECTURE SEULE. Aucun insert, update, delete, alter. Rien n'est modifie.
--
-- Repond aux questions 1, 2, 3, 6, 7 et 8 par la donnee elle-meme, plutot que
-- par ce qu'un document affirme.
--
-- POURQUOI TOUT PASSE PAR DU SQL DYNAMIQUE
--
-- Postgres resout les noms de tables et de colonnes a l'ANALYSE, avant
-- d'executer quoi que ce soit. Une seule reference manquante — `firm_programs`
-- si `RUN-program-schema` n'est pas passe, `firm_page_versions` si `RUN-05` ne
-- l'est pas — ferait echouer la requete ENTIERE, et les autres controles ne
-- diraient plus rien.
--
-- C'est exactement ce qui s'est produit avec le `42703` sur `scope_confidence`.
-- Un diagnostic qui s'effondre au lieu de rapporter est un mauvais diagnostic :
-- il est le plus utile precisement quand la base est incomplete.
--
-- Chaque controle s'execute donc par `execute`, apres avoir verifie que sa
-- cible existe. Sur une base vierge, ce fichier rend « non fait » partout au
-- lieu de lever.
-- =============================================================================

create temporary table diagnostic (
  etape text, question text, constat text, verdict text
) on commit drop;

do $$
declare
  r      record;
  txt    text;
  n      integer;
  b      boolean;
begin
  ---------------------------------------------------------------------------
  -- ETAPE 1 — Les migrations de donnees FuturesElite
  ---------------------------------------------------------------------------
  if to_regclass('public.firm_programs') is null then
    insert into diagnostic values ('1', 'migrations de donnees FuturesElite',
      'la table firm_programs n''existe pas', 'NON FAIT');
  else
    execute $q$
      select coalesce(count(*), 0) from firm_programs where firm_slug = 'futureselite'
    $q$ into n;

    execute $q$
      select coalesce(string_agg(distinct market, ', '), 'aucun')
        from firm_programs where firm_slug = 'futureselite'
    $q$ into txt;

    insert into diagnostic values ('1a', 'programmes FuturesElite (attendu 4)',
      n || ' programme(s), marche = ' || txt,
      case when n = 4 and txt = 'futures' then 'FAIT' else 'INCOMPLET' end);

    if to_regclass('public.firm_program_plans') is not null then
      execute $q$
        select count(*) from firm_program_plans pl
          join firm_programs pr on pr.id = pl.program_id
         where pr.firm_slug = 'futureselite'
      $q$ into n;
      insert into diagnostic values ('1b', 'lignes de phase (attendu 27)',
        n || ' ligne(s)', case when n = 27 then 'FAIT' else 'INCOMPLET' end);
    end if;

    if to_regclass('public.firm_platforms') is not null then
      execute $q$
        select count(*) from firm_platforms
         where firm_slug = 'futureselite' and configurator_status = 'selectable'
      $q$ into n;
      insert into diagnostic values ('1c', 'plateformes selectionnables (attendu 6)',
        n || '', case when n = 6 then 'FAIT' else 'INCOMPLET' end);
    end if;
  end if;

  -- Les six textes perimes. Ils n'existent que dans l'ANCIENNE version des
  -- fichiers : leur presence prouve que `RUN-futureselite.sql` n'est pas passe
  -- dans sa version courante. C'est plus fiable qu'un journal de migration —
  -- la donnee dit elle-meme ce qu'elle contient.
  -- La recherche porte sur `to_jsonb(f)::text`, c'est-a-dire la LIGNE ENTIERE
  -- serialisee, et non sur une colonne nommee. Deux raisons :
  --
  --   - `pros` et `cons` sont des tableaux, `description` du texte ; une seule
  --     expression ne peut pas caster les deux sans echouer sur l'autre ;
  --   - un texte perime deplace dans une autre colonne resterait trouve.
  --
  -- On perd le nom de la colonne fautive. C'est un echange volontaire :
  -- savoir QUE le texte est encore la suffit a decider, et le chercher
  -- colonne par colonne ferait echouer le diagnostic sur un cast.
  for r in
    select * from (values
      ('End-of-day drawdown on Elite, Nitro and Instant'),
      ('seven platforms'),
      ('all four settle at a 90'),
      ('price lists are not public'),
      ('An evaluation with no daily loss limit'),
      ('maximum 3 Nitro')
    ) as t(marqueur)
  loop
    execute format(
      'select exists (select 1 from prop_firms f
                       where f.slug = %L and to_jsonb(f)::text ilike %L)',
      'futureselite', '%' || r.marqueur || '%')
    into b;
    insert into diagnostic values ('1d',
      'texte perime : « ' || r.marqueur || ' »',
      case when b then 'ENCORE PRESENT' else 'absent' end,
      case when b then 'NON FAIT' else 'FAIT' end);
  end loop;

  -- `to_jsonb` la aussi : une colonne absente rend NULL au lieu de lever.
  execute $q$
    select (to_jsonb(f) ->> 'data_verified_at')::date::text
      from prop_firms f where f.slug = 'futureselite'
  $q$ into txt;
  insert into diagnostic values ('1e', 'date de verification (attendu 2026-09-07)',
    coalesce(txt, 'nulle'), case when txt = '2026-09-07' then 'FAIT' else 'NON FAIT' end);

  ---------------------------------------------------------------------------
  -- ETAPE 2 — Le postflight
  ---------------------------------------------------------------------------
  -- Un postflight est une LECTURE : il ne laisse aucune trace en base. Savoir
  -- s'il a ete passe est donc impossible retrospectivement — mais sans objet,
  -- puisque ce fichier recalcule ses controles a l'instant.
  insert into diagnostic values ('2', 'postflight FuturesElite',
    'un postflight ne laisse aucune trace ; les lignes 1a a 1e ci-dessus ' ||
    'rejouent ses controles maintenant',
    'SANS OBJET');

  ---------------------------------------------------------------------------
  -- ETAPE 3 — RUN-05
  ---------------------------------------------------------------------------
  if to_regclass('public.firm_page_versions') is null then
    insert into diagnostic values ('3', 'RUN-05 execute ?',
      'la table firm_page_versions n''existe pas', 'NON FAIT');
  else
    select count(*) into n from pg_indexes where tablename = 'firm_page_versions';
    insert into diagnostic values ('3a', 'index sur firm_page_versions (attendu 6)',
      n || '', case when n = 6 then 'FAIT' else 'INCOMPLET' end);

    select count(*) into n from pg_trigger
      where tgrelid = 'firm_page_versions'::regclass and not tgisinternal;
    insert into diagnostic values ('3b', 'declencheurs (attendu 3)',
      n || '', case when n = 3 then 'FAIT' else 'INCOMPLET' end);

    select count(*) into n from pg_proc
      where proname in ('activate_firm_version', 'rollback_firm_version',
                        'deactivate_firm_version', 'firm_page_versions_champs_de_cycle');
    insert into diagnostic values ('3c', 'fonctions de publication (attendu 4)',
      n || '', case when n = 4 then 'FAIT' else 'INCOMPLET' end);

    select exists (select 1 from pg_constraint
                    where conname = 'prop_firms_active_version_meme_firme_fk') into b;
    insert into diagnostic values ('3d', 'contrainte composite meme-firme',
      case when b then 'presente' else 'absente' end,
      case when b then 'FAIT' else 'NON FAIT' end);

    select exists (select 1 from pg_indexes
                    where indexname = 'firm_page_versions_one_published_per_firm') into b;
    insert into diagnostic values ('3e', 'index une-seule-publiee-par-firme',
      case when b then 'present' else 'absent' end,
      case when b then 'FAIT' else 'NON FAIT' end);

    select exists (select 1 from information_schema.columns
                    where table_name = 'prop_firms'
                      and column_name = 'active_page_version_id') into b;
    insert into diagnostic values ('3f', 'colonne prop_firms.active_page_version_id',
      case when b then 'presente' else 'absente' end,
      case when b then 'FAIT' else 'NON FAIT' end);
  end if;

  ---------------------------------------------------------------------------
  -- ETAPE 4 — Le test de retour en arriere
  ---------------------------------------------------------------------------
  -- Le test cree deux firmes jetables et les SUPPRIME a la fin. Par
  -- construction, il ne laisse rien : son passage n'est pas verifiable apres
  -- coup. La seule preuve est la sortie a l'ecran, au moment ou on le lance.
  --
  -- Ce controle-ci ne verifie donc qu'une chose : qu'aucun residu ne traine,
  -- ce qui signalerait un test interrompu en cours de route.
  if to_regclass('public.firm_page_versions') is null then
    insert into diagnostic values ('4', 'TEST-rollback-versions',
      'table absente : le test ne peut pas avoir tourne', 'NON FAIT');
  else
    execute $q$
      select count(*) from prop_firms where slug like '\_\_test\_publication%'
    $q$ into n;
    insert into diagnostic values ('4', 'residus du test de retour en arriere',
      case when n = 0 then 'aucun residu'
           else n || ' firme(s) de test encore en base' end,
      case when n = 0 then 'A RELANCER POUR PREUVE' else 'TEST INTERROMPU' end);
  end if;

  ---------------------------------------------------------------------------
  -- ETAPES 6, 7, 8 — Les versions FuturesElite
  ---------------------------------------------------------------------------
  if to_regclass('public.firm_page_versions') is null then
    insert into diagnostic values ('6-8', 'versions FuturesElite',
      'table absente', 'NON FAIT');
  else
    execute $q$
      select count(*) from firm_page_versions where firm_slug = 'futureselite'
    $q$ into n;
    insert into diagnostic values ('6a', 'versions FuturesElite, tous statuts',
      n || '', case when n > 0 then 'FAIT' else 'NON FAIT' end);

    execute $q$
      select coalesce(string_agg(version_number || ':' || status ||
                                 ' (schema ' || model_schema_version || ')', ', '
                                 order by version_number), 'aucune')
        from firm_page_versions where firm_slug = 'futureselite'
    $q$ into txt;
    insert into diagnostic values ('6b', 'detail des versions', txt,
      case when txt like '%validated%' or txt like '%published%'
           then 'FAIT' else 'NON FAIT' end);

    execute $q$
      select coalesce(active_page_version_id::text, 'NULL')
        from prop_firms where slug = 'futureselite'
    $q$ into txt;
    insert into diagnostic values ('7', 'prop_firms.active_page_version_id', txt,
      case when txt = 'NULL' then 'NON FAIT' else 'FAIT' end);

    execute $q$
      select case
        when (select active_page_version_id from prop_firms where slug = 'futureselite') is null
          then 'aucun pointeur : la fiche est servie par le rendu historique'
        else coalesce((
          select 'version ' || v.version_number || ', statut ' || v.status ||
                 ', schema ' || v.model_schema_version || ', firme ' || v.firm_slug
            from firm_page_versions v
            join prop_firms f on f.active_page_version_id = v.id
           where f.slug = 'futureselite'), 'pointeur orphelin')
      end
    $q$ into txt;
    insert into diagnostic values ('8', 'la version pointee est-elle publiee et en schema 1 ?',
      txt,
      case when txt like '%statut published%' and txt like '%schema 1%'
             and txt like '%firme futureselite%'
           then 'FAIT' else 'NON FAIT' end);
  end if;
end $$;

select etape, question, constat, verdict from diagnostic order by etape;

-- =============================================================================
-- COMMENT LIRE
-- =============================================================================
-- FAIT                    l'etape est reellement passee, la donnee le prouve
-- INCOMPLET               passee, mais le compte ne correspond pas a l'attendu
-- NON FAIT                l'etape reste a faire
-- SANS OBJET              rien a verifier : le controle est rejoue ici meme
-- A RELANCER POUR PREUVE  ne laisse aucune trace ; seule sa sortie fait foi
--
-- Aucune ligne de ce fichier n'ecrit en base.
-- =============================================================================
