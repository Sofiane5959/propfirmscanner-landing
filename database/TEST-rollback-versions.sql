-- =============================================================================
-- TEST DU RETOUR EN ARRIERE ET DE L'IMMUABILITE
-- =============================================================================
-- A passer APRES `RUN-05-firm-page-versions.sql`, avant toute publication
-- reelle. Il ecrit, puis efface tout ce qu'il a ecrit.
--
-- CE QU'IL PROUVE
--
--   1. une version `draft` ne peut pas etre publiee directement
--   2. une version `validated` s'active, et devient la version servie
--   3. TOUTE colonne d'une version publiee est immuable — y compris une
--      colonne ajoutee apres l'ecriture du declencheur
--   4. les trois champs de cycle de vie restent, eux, mobiles
--   5. une version publiee ne peut pas etre supprimee
--   6. publier une v2 archive la v1, sans la detruire
--   7. le retour en arriere restaure l'instantane a l'identique, octet a octet
--   8. une firme ne peut pas activer la version d'une AUTRE firme
--   9. une version de schema hors borne est refusee
--  10. la numerotation est serialisee par firme
--  11. une firme n'a JAMAIS deux versions `published`
--  12. les fonctions ont un `search_path` fige et restent reservees au service
--  13. le retrait, par `deactivate_firm_version` UNIQUEMENT, met le pointeur a
--      NULL *et* archive l'ancienne version — et la firme peut republier
--
-- POURQUOI UNE FIRME JETABLE PLUTOT QU'UNE VRAIE
--
-- Tester sur `futureselite` ecrirait de vraies versions et laisserait des
-- numeros consommes. Le test cree donc sa propre firme, `__test_publication__`,
-- et la supprime a la fin. Rien d'autre en base n'est touche.
--
-- POURQUOI L'INSERT EST DYNAMIQUE
--
-- `prop_firms` porte 113 colonnes et je n'ai pas la liste de celles qui sont
-- NOT NULL sans defaut. Les deviner produirait un `23502` au lieu d'un test.
-- Le bloc lit donc `information_schema` et remplit ce qu'il faut, comme le
-- fait deja `ROLLBACK-futureselite.sql`.
-- =============================================================================

create temporary table resultat_test (
  num integer, intitule text, verdict text
) on commit drop;

do $$
declare
  v_slug        text := '__test_publication__';
  v1            uuid;
  v2            uuid;
  v_active      uuid;
  v_colonnes    text := '';
  v_valeurs     text := '';
  c             record;
  n             integer := 0;

  -- La deuxieme firme jetable, pour prouver qu'une version ne traverse pas.
  v_slug2       text := '__test_publication_2__';
  v_etrangere   uuid;

  -- L'instantane complet de la v1, capture avant qu'elle soit archivee.
  v_snap        jsonb;
  v_numeros     integer[];
  v_troisieme   uuid;
  v_quatrieme   uuid;
  v_publiees    integer;
begin
  -- Chaque controle ENREGISTRE son verdict au lieu de lever. Un test doit
  -- rapporter, pas s'arreter au premier ecart : c'est la lecon du postflight
  -- qui s'effondrait sur une seule colonne absente.
  ---------------------------------------------------------------------------
  -- Preparation : une firme jetable
  ---------------------------------------------------------------------------
  delete from prop_firms where slug = v_slug;

  for c in
    select column_name, data_type
      from information_schema.columns
     where table_schema = 'public' and table_name = 'prop_firms'
       and is_nullable = 'NO' and column_default is null
       and column_name not in ('slug')
     order by ordinal_position
  loop
    v_colonnes := v_colonnes || ', ' || quote_ident(c.column_name);
    v_valeurs  := v_valeurs || ', ' || case
      when c.data_type in ('integer', 'bigint', 'smallint', 'numeric', 'real', 'double precision') then '0'
      when c.data_type = 'boolean'   then 'false'
      when c.data_type = 'uuid'      then 'gen_random_uuid()'
      when c.data_type = 'ARRAY'     then '''{}'''
      when c.data_type = 'jsonb'     then '''{}''::jsonb'
      when c.data_type = 'json'      then '''{}''::json'
      when c.data_type like 'timestamp%' then 'now()'
      when c.data_type = 'date'      then 'current_date'
      else quote_literal('test')
    end;
  end loop;

  execute format('insert into prop_firms (slug%s) values (%L%s)', v_colonnes, v_slug, v_valeurs);

  delete from prop_firms where slug = v_slug2;
  execute format('insert into prop_firms (slug%s) values (%L%s)', v_colonnes, v_slug2, v_valeurs);

  ---------------------------------------------------------------------------
  -- 1. Un brouillon ne se publie pas
  ---------------------------------------------------------------------------
  insert into firm_page_versions
    (firm_slug, page_model_json, summary_model_json, validation_report_json, source_hash, status)
  values
    (v_slug, '{"v":1}', '{"v":1}', '{"errors":[],"publishable":true}', 'sha256:aaa', 'draft')
  returning id into v1;

  n := 1;
  begin
    perform activate_firm_version(v1, 'test');
    insert into resultat_test values (n, 'un brouillon ne peut pas etre publie', 'ECHEC : accepte');
  exception when others then
    insert into resultat_test values (n, 'un brouillon ne peut pas etre publie', 'ok');
  end;

  ---------------------------------------------------------------------------
  -- 2. Une version validee s'active
  ---------------------------------------------------------------------------
  update firm_page_versions set status = 'validated' where id = v1;
  perform activate_firm_version(v1, 'test');

  select active_page_version_id into v_active from prop_firms where slug = v_slug;
  n := 2;
  insert into resultat_test values (n, 'une version validee devient la version servie',
    case when v_active = v1
         and (select status from firm_page_versions where id = v1) = 'published'
         and (select published_at from firm_page_versions where id = v1) is not null
      then 'ok' else 'ECHEC' end);

  -- L'instantane COMPLET de la v1, capture pendant qu'elle est en ligne. Le
  -- test 8 le comparera a ce que le retour en arriere restaure. Comparer
  -- champ par champ laisserait passer ce qu'on a oublie de comparer ; un
  -- `to_jsonb` de la ligne entiere ne laisse rien passer.
  select to_jsonb(v) - 'status' - 'published_at' - 'archived_at'
    into v_snap
    from firm_page_versions v where v.id = v1;

  ---------------------------------------------------------------------------
  -- 3. Le contenu d'une version publiee est fige
  ---------------------------------------------------------------------------
  n := 3;
  begin
    update firm_page_versions set page_model_json = '{"v":"falsifie"}' where id = v1;
    insert into resultat_test values (n, 'le contenu publie est immuable', 'ECHEC : modifie');
  exception when others then
    insert into resultat_test values (n, 'le contenu publie est immuable', 'ok');
  end;

  n := 4;
  begin
    update firm_page_versions set status = 'draft' where id = v1;
    insert into resultat_test values (n, 'une version publiee ne redevient pas modifiable', 'ECHEC : rouverte');
  exception when others then
    insert into resultat_test values (n, 'une version publiee ne redevient pas modifiable', 'ok');
  end;

  ---------------------------------------------------------------------------
  -- 4. Une version publiee ne se supprime pas
  ---------------------------------------------------------------------------
  n := 5;
  begin
    delete from firm_page_versions where id = v1;
    insert into resultat_test values (n, 'une version publiee ne se supprime pas', 'ECHEC : supprimee');
  exception when others then
    insert into resultat_test values (n, 'une version publiee ne se supprime pas', 'ok');
  end;

  ---------------------------------------------------------------------------
  -- 4 bis. L'IMMUABILITE PORTE SUR LA LIGNE ENTIERE
  ---------------------------------------------------------------------------
  -- Le declencheur enumerait les colonnes a proteger. Les quatre suivantes
  -- n'etaient pas dans la liste, et passaient donc sans bruit.
  n := 6;
  begin
    update firm_page_versions set model_schema_version = 2 where id = v1;
    insert into resultat_test values (n, 'model_schema_version est immuable apres publication', 'ECHEC : modifie');
  exception when others then
    insert into resultat_test values (n, 'model_schema_version est immuable apres publication', 'ok');
  end;

  n := 7;
  begin
    update firm_page_versions set verified_at = now() where id = v1;
    insert into resultat_test values (n, 'verified_at est immuable apres publication', 'ECHEC : modifie');
  exception when others then
    insert into resultat_test values (n, 'verified_at est immuable apres publication', 'ok');
  end;

  n := 8;
  begin
    update firm_page_versions set created_at = now() - interval '1 year' where id = v1;
    insert into resultat_test values (n, 'created_at est immuable apres publication', 'ECHEC : modifie');
  exception when others then
    insert into resultat_test values (n, 'created_at est immuable apres publication', 'ok');
  end;

  n := 9;
  begin
    update firm_page_versions set created_by = 'un autre auteur' where id = v1;
    insert into resultat_test values (n, 'created_by est immuable apres publication', 'ECHEC : modifie');
  exception when others then
    insert into resultat_test values (n, 'created_by est immuable apres publication', 'ok');
  end;

  -- LA PREUVE QUI COMPTE : une colonne qui n'existait pas quand le declencheur
  -- a ete ecrit. C'est la difference entre « ces champs-la sont proteges » et
  -- « tout est protege sauf le cycle de vie ».
  alter table firm_page_versions add column __test_colonne_future text;
  n := 10;
  begin
    update firm_page_versions set __test_colonne_future = 'ajoutee apres coup' where id = v1;
    insert into resultat_test values (n, 'une colonne ajoutee plus tard est protegee aussi', 'ECHEC : modifiee');
  exception when others then
    insert into resultat_test values (n, 'une colonne ajoutee plus tard est protegee aussi', 'ok');
  end;
  alter table firm_page_versions drop column __test_colonne_future;

  -- Et le cycle de vie, lui, doit rester mobile : sans quoi plus rien ne
  -- s'archive ni ne se republie, et l'immuabilite deviendrait une paralysie.
  n := 11;
  begin
    update firm_page_versions
       set status = 'archived', archived_at = now()
     where id = v1;
    update firm_page_versions
       set status = 'published', archived_at = null, published_at = now()
     where id = v1;
    insert into resultat_test values (n, 'les trois champs de cycle de vie restent mobiles', 'ok');
  exception when others then
    insert into resultat_test values (n, 'les trois champs de cycle de vie restent mobiles',
      'ECHEC : ' || sqlerrm);
  end;

  ---------------------------------------------------------------------------
  -- 5. Une v2 prend la main, la v1 est archivee et non detruite
  ---------------------------------------------------------------------------
  insert into firm_page_versions
    (firm_slug, page_model_json, summary_model_json, validation_report_json, source_hash, status)
  values
    (v_slug, '{"v":2}', '{"v":2}', '{"errors":[],"publishable":true}', 'sha256:bbb', 'validated')
  returning id into v2;

  n := 12;
  insert into resultat_test values (n, 'la numerotation est automatique et croissante',
    case when (select version_number from firm_page_versions where id = v1) = 1
          and (select version_number from firm_page_versions where id = v2) = 2
      then 'ok' else 'ECHEC' end);

  perform activate_firm_version(v2, 'test');
  select active_page_version_id into v_active from prop_firms where slug = v_slug;

  n := 13;
  insert into resultat_test values (n, 'publier une v2 archive la v1 sans la detruire',
    case when v_active = v2
          and (select status from firm_page_versions where id = v1) = 'archived'
          and (select page_model_json ->> 'v' from firm_page_versions where id = v1) = '1'
      then 'ok' else 'ECHEC' end);

  ---------------------------------------------------------------------------
  -- 6. LE RETOUR EN ARRIERE
  ---------------------------------------------------------------------------
  perform rollback_firm_version(v_slug, 1);
  select active_page_version_id into v_active from prop_firms where slug = v_slug;

  n := 14;
  insert into resultat_test values (n, 'le retour en arriere restaure la v1',
    case when v_active = v1
          and (select status from firm_page_versions where id = v1) = 'published'
          and (select status from firm_page_versions where id = v2) = 'archived'
      then 'ok' else 'ECHEC' end);

  -- Comparaison de la LIGNE ENTIERE, hors statut et horodatages de cycle de
  -- vie. Tout le reste — les trois JSON, l'empreinte, le schema, l'auteur, la
  -- date de verification — doit etre identique a l'octet pres.
  n := 15;
  insert into resultat_test values (n, 'le retour en arriere restaure l instantane a l identique',
    case when (select to_jsonb(v) - 'status' - 'published_at' - 'archived_at'
                 from firm_page_versions v where v.id = v1) = v_snap
      then 'ok'
      else 'ECHEC : ' || coalesce((
        select string_agg(cle, ', ')
          from jsonb_each(v_snap) s(cle, valeur)
         where (select to_jsonb(v) from firm_page_versions v where v.id = v1) -> cle
               is distinct from valeur), 'difference non localisee') end);

  n := 16;
  begin
    perform rollback_firm_version(v_slug, 1);
    insert into resultat_test values (n, 'revenir a la version deja active est refuse', 'ECHEC : accepte');
  exception when others then
    insert into resultat_test values (n, 'revenir a la version deja active est refuse', 'ok');
  end;

  ---------------------------------------------------------------------------
  -- 7. UNE VERSION NE TRAVERSE PAS D'UNE FIRME A L'AUTRE
  ---------------------------------------------------------------------------
  -- La RPC ne peut pas se tromper : elle lit `firm_slug` sur la version et
  -- met a jour cette firme-la. Mais une RPC est du code applicatif. Un UPDATE
  -- direct, un script de maintenance, une migration ecrite un soir de hate
  -- passent a cote. C'est la BASE qui doit refuser.
  insert into firm_page_versions
    (firm_slug, page_model_json, summary_model_json, validation_report_json, source_hash, status)
  values
    (v_slug2, '{"v":"etrangere"}', '{"v":"etrangere"}', '{"errors":[]}', 'sha256:zzz', 'validated')
  returning id into v_etrangere;

  n := 17;
  begin
    update prop_firms set active_page_version_id = v_etrangere where slug = v_slug;
    -- La contrainte est DEFERRABLE : sans ce forcage elle ne serait verifiee
    -- qu'au commit, donc bien apres la fin de ce test.
    set constraints all immediate;
    insert into resultat_test values (n, 'une version d une autre firme ne peut pas etre activee',
      'ECHEC : acceptee');
  exception when others then
    insert into resultat_test values (n, 'une version d une autre firme ne peut pas etre activee', 'ok');
  end;
  set constraints all deferred;

  -- L'etat n'a pas bouge : la sous-transaction a ete annulee.
  select active_page_version_id into v_active from prop_firms where slug = v_slug;
  n := 18;
  insert into resultat_test values (n, 'la tentative croisee laisse la version active intacte',
    case when v_active = v1 then 'ok' else 'ECHEC' end);

  ---------------------------------------------------------------------------
  -- 8. LA VERSION DE SCHEMA
  ---------------------------------------------------------------------------
  n := 19;
  insert into resultat_test values (n, 'model_schema_version vaut 1 par defaut',
    case when (select model_schema_version from firm_page_versions where id = v1) = 1
      then 'ok' else 'ECHEC' end);

  n := 20;
  begin
    insert into firm_page_versions
      (firm_slug, page_model_json, summary_model_json, validation_report_json,
       source_hash, model_schema_version)
    values (v_slug2, '{}', '{}', '{}', 'sha256:x', 0);
    insert into resultat_test values (n, 'un schema hors borne est refuse', 'ECHEC : accepte');
  exception when others then
    insert into resultat_test values (n, 'un schema hors borne est refuse', 'ok');
  end;

  ---------------------------------------------------------------------------
  -- 9. LA NUMEROTATION SOUS CONCURRENCE
  ---------------------------------------------------------------------------
  -- CE QUE CE SCRIPT PEUT PROUVER, ET CE QU'IL NE PEUT PAS
  --
  -- Deux sessions simultanees ne sont pas simulables depuis un seul script :
  -- il faudrait `dblink` ou `pg_background`, absents d'une base Supabase par
  -- defaut. Le dire franchement vaut mieux qu'un test qui pretendrait le
  -- contraire.
  --
  -- Ce qui EST prouve ici, et qui est ce dont depend la correction :
  --   a. le verrou par firme est bien pose avant la lecture du maximum ;
  --   b. vingt insertions donnent vingt numeros distincts et contigus ;
  --   c. un numero impose en double est refuse par la contrainte.
  --
  -- Sans (a), deux transactions liraient le meme maximum et l'une echouerait
  -- sur (c) : l'integrite serait sauve, mais au prix d'une publication perdue.
  -- Le verrou transforme une collision en attente.
  n := 21;
  insert into resultat_test values (n, 'le verrou par firme precede la lecture du maximum',
    case when (select prosrc from pg_proc where proname = 'firm_page_versions_number')
              like '%pg_advisory_xact_lock%'
          and position('pg_advisory_xact_lock' in
                (select prosrc from pg_proc where proname = 'firm_page_versions_number'))
              < position('max(version_number)' in
                (select prosrc from pg_proc where proname = 'firm_page_versions_number'))
      then 'ok' else 'ECHEC' end);

  insert into firm_page_versions
    (firm_slug, page_model_json, summary_model_json, validation_report_json, source_hash)
  select v_slug2, '{}', '{}', '{}', 'sha256:n' || i
    from generate_series(1, 20) as i;

  select array_agg(version_number order by version_number)
    into v_numeros
    from firm_page_versions where firm_slug = v_slug2;

  n := 22;
  insert into resultat_test values (n, 'vingt-et-un numeros distincts et contigus',
    case when v_numeros = (select array_agg(i) from generate_series(1, 21) as i)
      then 'ok' else 'ECHEC : ' || array_to_string(v_numeros, ',') end);

  n := 23;
  begin
    -- Le filet, si un chemin d'ecriture contournait le declencheur.
    insert into firm_page_versions
      (firm_slug, version_number, page_model_json, summary_model_json,
       validation_report_json, source_hash)
    values (v_slug2, 1, '{}', '{}', '{}', 'sha256:doublon');
    insert into resultat_test values (n, 'un numero impose en double est refuse', 'ECHEC : accepte');
  exception when unique_violation then
    insert into resultat_test values (n, 'un numero impose en double est refuse', 'ok');
  end;

  ---------------------------------------------------------------------------
  -- 9 bis. UNE SEULE VERSION PUBLIEE PAR FIRME
  ---------------------------------------------------------------------------
  -- A ce point la v1 est publiee et la v2 archivee. Publier la v2 « a la
  -- main », sans passer par les fonctions qui archivent d'abord, doit etre
  -- refuse par la base elle-meme et non par l'ordonnancement du code.
  n := 24;
  begin
    update firm_page_versions set status = 'published', published_at = now()
     where id = v2;
    insert into resultat_test values (n, 'deux versions publiees pour une meme firme sont refusees',
      'ECHEC : acceptees');
  exception when unique_violation then
    insert into resultat_test values (n, 'deux versions publiees pour une meme firme sont refusees', 'ok');
  when others then
    insert into resultat_test values (n, 'deux versions publiees pour une meme firme sont refusees',
      'ECHEC : ' || sqlerrm);
  end;

  select count(*) into v_publiees
    from firm_page_versions where firm_slug = v_slug and status = 'published';
  n := 25;
  insert into resultat_test values (n, 'exactement une version publiee subsiste',
    case when v_publiees = 1 then 'ok' else 'ECHEC : ' || v_publiees end);

  -- Le retour en arriere doit continuer de fonctionner AVEC cet index. Les
  -- deux fonctions archivent avant de publier, en deux instructions : aucun
  -- instant n'a deux lignes publiees.
  perform rollback_firm_version(v_slug, 2);
  select count(*) into v_publiees
    from firm_page_versions where firm_slug = v_slug and status = 'published';
  n := 26;
  insert into resultat_test values (n, 'le retour en arriere passe malgre l index unique partiel',
    case when v_publiees = 1
          and (select active_page_version_id from prop_firms where slug = v_slug) = v2
          and (select status from firm_page_versions where id = v1) = 'archived'
      then 'ok' else 'ECHEC' end);

  -- Et une troisieme activation, par la fonction, toujours sans collision.
  insert into firm_page_versions
    (firm_slug, page_model_json, summary_model_json, validation_report_json, source_hash, status)
  values
    (v_slug, '{"v":3}', '{"v":3}', '{"errors":[]}', 'sha256:ccc', 'validated')
  returning id into v_troisieme;
  perform activate_firm_version(v_troisieme, 'test');

  select count(*) into v_publiees
    from firm_page_versions where firm_slug = v_slug and status = 'published';
  n := 27;
  insert into resultat_test values (n, 'une troisieme activation garde une seule publiee',
    case when v_publiees = 1
          and (select status from firm_page_versions where id = v2) = 'archived'
      then 'ok' else 'ECHEC : ' || v_publiees end);

  ---------------------------------------------------------------------------
  -- 9 ter. LE CHEMIN DE RECHERCHE DES FONCTIONS
  ---------------------------------------------------------------------------
  -- `security definer` execute avec les droits du PROPRIETAIRE. Sans
  -- `search_path` fige, l'appelant choisit ou les noms non qualifies se
  -- resolvent, et la fonction ecrit chez lui avec des droits qui ne sont pas
  -- les siens.
  n := 28;
  insert into resultat_test values (n, 'les trois fonctions security definer ont un search_path fixe',
    case when (select count(*) from pg_proc
                where proname in ('activate_firm_version', 'rollback_firm_version',
                                  'deactivate_firm_version')
                  and prosecdef
                  -- Un `like` plutot qu'une egalite : Postgres normalise la
                  -- chaine stockee, et un test qui depend de son formatage
                  -- exact echouerait un jour sans rien apprendre.
                  and exists (select 1 from unnest(proconfig) cfg
                               where cfg like 'search_path=%public%')) = 3
      then 'ok'
      else 'ECHEC : ' || coalesce((
        select string_agg(proname, ', ') from pg_proc
         where proname in ('activate_firm_version', 'rollback_firm_version',
                           'deactivate_firm_version')
           and not exists (select 1 from unnest(coalesce(proconfig, '{}'::text[])) cfg
                            where cfg like 'search_path=%public%')), 'aucune') end);

  n := 29;
  insert into resultat_test values (n, 'les trois fonctions de declenchement aussi',
    case when (select count(*) from pg_proc
                where proname in ('firm_page_versions_immutable', 'firm_page_versions_number',
                                  'firm_page_versions_no_delete')
                  and exists (select 1 from unnest(proconfig) cfg
                               where cfg like 'search_path=%public%')) = 3
      then 'ok' else 'ECHEC' end);

  n := 30;
  insert into resultat_test values (n, 'l execution reste reservee a service_role',
    case when not exists (
           select 1 from pg_proc p
            where p.proname in ('activate_firm_version', 'rollback_firm_version',
                                'deactivate_firm_version')
              and (has_function_privilege('anon', p.oid, 'execute')
                   or has_function_privilege('authenticated', p.oid, 'execute')))
      then 'ok' else 'ECHEC : anon ou authenticated peut executer' end);

  ---------------------------------------------------------------------------
  -- 10. Le retrait
  ---------------------------------------------------------------------------
  -- `deactivate_firm_version` est le SEUL moyen autorise. Un
  -- `update prop_firms set active_page_version_id = null` retirerait le
  -- pointeur en laissant la version `published` : elle occuperait la place
  -- unique de l'index partiel, et la publication suivante echouerait.
  perform deactivate_firm_version(v_slug);
  select active_page_version_id into v_active from prop_firms where slug = v_slug;

  n := 31;
  insert into resultat_test values (n,
    'apres desactivation : pointeur nul ET ancienne version archivee',
    case when v_active is null
          and (select status from firm_page_versions where id = v_troisieme) = 'archived'
          and (select archived_at from firm_page_versions where id = v_troisieme) is not null
          and (select count(*) from firm_page_versions
                where firm_slug = v_slug and status = 'published') = 0
      then 'ok'
      else 'ECHEC : pointeur=' || coalesce(v_active::text, 'null')
           || ' statut=' || coalesce((select status from firm_page_versions
                                       where id = v_troisieme), 'introuvable')
           || ' publiees=' || (select count(*) from firm_page_versions
                                where firm_slug = v_slug and status = 'published') end);

  -- La consequence pratique : une firme desactivee doit pouvoir republier. Si
  -- le retrait avait laisse une ligne `published` orpheline, cette activation
  -- echouerait sur l'index unique partiel.
  insert into firm_page_versions
    (firm_slug, page_model_json, summary_model_json, validation_report_json, source_hash, status)
  values
    (v_slug, '{"v":4}', '{"v":4}', '{"errors":[]}', 'sha256:ddd', 'validated')
  returning id into v_quatrieme;

  n := 32;
  begin
    perform activate_firm_version(v_quatrieme, 'test');
    insert into resultat_test values (n, 'une firme desactivee peut republier',
      case when (select active_page_version_id from prop_firms where slug = v_slug) = v_quatrieme
            and (select count(*) from firm_page_versions
                  where firm_slug = v_slug and status = 'published') = 1
        then 'ok' else 'ECHEC' end);
  exception when others then
    insert into resultat_test values (n, 'une firme desactivee peut republier',
      'ECHEC : ' || sqlerrm);
  end;

  -- Et on redesactive, pour que le nettoyage puisse supprimer les lignes.
  perform deactivate_firm_version(v_slug);
  select active_page_version_id into v_active from prop_firms where slug = v_slug;

  n := 33;
  insert into resultat_test values (n, 'le retrait ramene la fiche au rendu historique',
    case when v_active is null
          and (select count(*) from firm_page_versions where firm_slug = v_slug) = 4
      then 'ok' else 'ECHEC' end);

  n := 34;
  insert into resultat_test values (n, 'les quatre versions survivent au retrait',
    case when (select count(*) from firm_page_versions
                where firm_slug = v_slug and status = 'archived') = 4
      then 'ok' else 'ECHEC' end);

  ---------------------------------------------------------------------------
  -- Nettoyage. Toutes les versions sont `archived` — le retrait s'en est
  -- charge —, donc supprimables : le verrou ne porte que sur `published`, et
  -- c'est exactement ce qu'il faut.
  ---------------------------------------------------------------------------
  delete from firm_page_versions where firm_slug in (v_slug, v_slug2);
  delete from prop_firms where slug in (v_slug, v_slug2);

  insert into resultat_test values (99, 'nettoyage : les deux firmes de test ont disparu',
    case when not exists (select 1 from prop_firms where slug in (v_slug, v_slug2))
          and not exists (select 1 from firm_page_versions where firm_slug in (v_slug, v_slug2))
      then 'ok' else 'ECHEC' end);
end $$;

select num, intitule, verdict from resultat_test order by num;

-- =============================================================================
-- ATTENDU : trente-cinq lignes, toutes a 'ok'.
--
-- Une seule 'ECHEC' interdit la publication : le retour en arriere serait alors
-- une intention, pas une garantie.
--
-- Si le bloc leve au lieu de rapporter, la transaction du script est annulee
-- et la firme de test n'existe pas : aucun nettoyage manuel a faire.
-- =============================================================================
