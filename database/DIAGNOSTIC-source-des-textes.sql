-- =============================================================================
-- D'OU VIENT CHAQUE TEXTE ENCORE VISIBLE
-- =============================================================================
-- LECTURE SEULE. Aucun insert, update, delete, alter.
--
-- Ne suppose pas que RUN-06 a ete passe : il le PROUVE, valeur par valeur.
--
-- POURQUOI IL NOMME LA COLONNE
--
-- Le diagnostic precedent cherchait les textes perimes dans `to_jsonb(f)::text`,
-- soit la ligne entiere serialisee. Il repondait « encore present » sans dire
-- OU, ce qui suffisait a decider mais pas a corriger.
--
-- Celui-ci parcourt les cles une par une avec `jsonb_each`. Il n'a besoin
-- d'aucune liste de colonnes ecrite a la main — donc aucune colonne ne peut
-- lui echapper — et il rend le nom exact de celle qui porte le texte.
--
-- Tout passe par du SQL dynamique : une table absente ferait echouer la
-- requete a l'ANALYSE, avant d'executer quoi que ce soit, et les autres
-- controles ne diraient plus rien.
-- =============================================================================

create temporary table diag (
  bloc text, sujet text, valeur text, attendu text, verdict text
) on commit drop;

do $diag$
declare
  r     record;
  txt   text;
  n     integer;
  ligne jsonb;
begin
  ---------------------------------------------------------------------------
  -- A. LES COLONNES QUE LE COMPOSANT HISTORIQUE LIT DIRECTEMENT
  ---------------------------------------------------------------------------
  execute $q$ select to_jsonb(f) from prop_firms f where f.slug = 'futureselite' $q$
    into ligne;

  if ligne is null then
    insert into diag values ('A', 'la firme', 'introuvable', 'une ligne', 'ECHEC');
    return;
  end if;

  for r in
    select * from (values
      ('data_verified_at', '2026-09-07', 'la date « reviewed on » du composant'),
      ('min_price',        '95',         'la borne basse de « Price range »'),
      ('max_price',        '569',        'la borne haute de « Price range »'),
      ('profit_split',     null,         'le « Profit split » de la bande de faits'),
      ('max_profit_split', null,         'la borne haute du meme fait')
    ) as t(cle, attendu, role)
  loop
    txt := ligne ->> r.cle;
    -- Les timestamps sont compares sur leur seule date.
    if r.cle = 'data_verified_at' and txt is not null then txt := left(txt, 10); end if;
    insert into diag values ('A', r.cle || ' — ' || r.role,
      coalesce(txt, 'NULL'),
      coalesce(r.attendu, '(informatif)'),
      case when r.attendu is null then 'INFO'
           when txt = r.attendu then 'ok'
           else 'PERIME' end);
  end loop;

  -- Les trois blocs editoriaux. `jsonb_typeof` distingue le NULL SQL du JSON
  -- null : le generateur ecrivait le second en croyant ecrire le premier, et
  -- un controle `is null` repondait alors faux.
  for r in
    select * from (values
      ('program_guide', 'la section « Four programmes »'),
      ('journey',       'la section parcours'),
      ('cost_timeline', 'la section des couts'),
      ('translations',  'la surcouche par locale')
    ) as t(cle, role)
  loop
    insert into diag values ('A', r.cle || ' — ' || r.role,
      case
        when not (ligne ? r.cle)          then 'colonne absente'
        when ligne -> r.cle = 'null'::jsonb then 'JSON null (pas un NULL SQL)'
        when ligne ->> r.cle is null       then 'NULL'
        else 'PRESENT (' || left(ligne ->> r.cle, 40) || '…)'
      end,
      'NULL',
      case when ligne ->> r.cle is null and ligne -> r.cle is distinct from 'null'::jsonb
           then 'ok' else 'PERIME' end);
  end loop;

  ---------------------------------------------------------------------------
  -- B. LES TEXTES PERIMES, ET LA COLONNE QUI LES PORTE
  ---------------------------------------------------------------------------
  -- `jsonb_each` sur la ligne entiere : aucune liste de colonnes a tenir, donc
  -- aucune colonne oubliee. La cle rendue EST le nom de la colonne.
  for r in
    select * from (values
      ('seven platforms'),
      ('Seven platforms'),
      ('all four settle at a 90'),
      ('price lists are not public'),
      ('An evaluation with no daily loss limit'),
      ('End-of-day drawdown on Elite, Nitro and Instant'),
      ('sept plateformes'),
      ('ne sont pas publiques')
    ) as t(marqueur)
  loop
    select string_agg(cle, ', ' order by cle) into txt
      from jsonb_each(ligne) e(cle, valeur)
     where valeur::text ilike '%' || r.marqueur || '%';

    insert into diag values ('B', 'texte : « ' || r.marqueur || ' »',
      coalesce('porte par ' || txt, 'absent'),
      'absent',
      case when txt is null then 'ok' else 'PERIME' end);
  end loop;

  ---------------------------------------------------------------------------
  -- C. LES PROJECTIONS HERITEES — prop_firm_challenges
  ---------------------------------------------------------------------------
  if to_regclass('public.prop_firm_challenges') is null then
    insert into diag values ('C', 'prop_firm_challenges', 'table absente', 'presente', 'ECHEC');
  else
    execute $q$ select count(*) from prop_firm_challenges where firm_slug = 'futureselite' $q$
      into n;
    insert into diag values ('C', 'lignes', n::text, '4',
      case when n = 4 then 'ok' else 'ECART' end);

    execute $q$
      select string_agg(distinct coalesce(profit_split::text, 'NULL'), ', ')
        from prop_firm_challenges where firm_slug = 'futureselite'
    $q$ into txt;
    insert into diag values ('C', 'profit_split (Elite paie 90 une fois finance)',
      coalesce(txt, 'aucune'), '90', case when txt = '90' then 'ok' else 'PERIME' end);

    execute $q$
      select string_agg(distinct coalesce(drawdown_type, 'NULL') || ' / ' ||
                                 coalesce(max_loss_type, 'NULL'), ' | ')
        from prop_firm_challenges where firm_slug = 'futureselite'
    $q$ into txt;
    insert into diag values ('C', 'drawdown_type / max_loss_type',
      coalesce(txt, 'aucune'), 'End of Day / End of Day',
      case when txt = 'End of Day / End of Day' then 'ok' else 'PERIME' end);

    -- Nullabilite reelle des trois colonnes d'autorisation : c'est ce qui
    -- decide si NULL est ecrivable, et le correctif s'arrete si ce n'est pas
    -- le cas plutot que de retomber sur une valeur inventee.
    for r in
      select column_name, is_nullable from information_schema.columns
       where table_schema = 'public' and table_name = 'prop_firm_challenges'
         and column_name in ('allows_ea', 'allows_scalping', 'allows_news_trading')
       order by column_name
    loop
      insert into diag values ('C', r.column_name || ' — nullable ?',
        r.is_nullable, 'YES pour scalping et news',
        case when r.column_name = 'allows_ea' then 'INFO'
             when r.is_nullable = 'YES' then 'ok' else 'BLOQUANT' end);
    end loop;

    execute $q$
      select string_agg(distinct coalesce(allows_ea::text, 'NULL') || ' / ' ||
                                 coalesce(allows_scalping::text, 'NULL') || ' / ' ||
                                 coalesce(allows_news_trading::text, 'NULL'), ' | ')
        from prop_firm_challenges where firm_slug = 'futureselite'
    $q$ into txt;
    insert into diag values ('C', 'allows_ea / scalping / news',
      coalesce(txt, 'aucune'), 'false / NULL / NULL',
      case when txt = 'false / NULL / NULL' then 'ok' else 'PERIME' end);
  end if;

  ---------------------------------------------------------------------------
  -- D. LA PROMOTION
  ---------------------------------------------------------------------------
  -- Le composant historique lit le code depuis les promotions NORMALISEES,
  -- pas depuis prop_firms.discount_code. Les deux sont rapportes : le premier
  -- est la source reelle, le second explique l'absence de prix barre au niveau
  -- firme.
  insert into diag values ('D', 'prop_firms.discount_code',
    coalesce(ligne ->> 'discount_code', 'NULL'), '(informatif)', 'INFO');

  if to_regclass('public.firm_promotions') is null then
    insert into diag values ('D', 'firm_promotions', 'table absente', 'presente', 'ECHEC');
  else
    execute $q$
      select string_agg(code || ' = ' || discount_value ||
                        ' [' || coalesce(to_jsonb(p) ->> 'scope_confidence', 'colonne absente') ||
                        ', public=' || is_public || ']', ' | ' order by code)
        from firm_promotions p where p.firm_slug = 'futureselite' and p.is_public = false
    $q$ into txt;
    insert into diag values ('D', 'promotions partenaires',
      coalesce(txt, 'aucune'), 'SCANNED = 0.30 [unconfirmed, public=false]',
      case when txt like 'SCANNED = 0.30 [unconfirmed%' then 'ok' else 'ECART' end);
  end if;

  ---------------------------------------------------------------------------
  -- E. LA COUCHE DE PUBLICATION
  ---------------------------------------------------------------------------
  insert into diag values ('E', 'prop_firms.active_page_version_id',
    coalesce(ligne ->> 'active_page_version_id', 'NULL'),
    'NULL tant qu''aucune version n''est publiee', 'INFO');

  if to_regclass('public.firm_page_versions') is null then
    insert into diag values ('E', 'firm_page_versions', 'table absente', 'presente', 'ECHEC');
  else
    execute $q$
      select coalesce(string_agg(version_number || ':' || status ||
                                 ' (schema ' || model_schema_version || ')',
                                 ', ' order by version_number), 'aucune')
        from firm_page_versions where firm_slug = 'futureselite'
    $q$ into txt;
    insert into diag values ('E', 'versions FuturesElite', txt,
      'aucune avant validation des donnees', 'INFO');
  end if;

  ---------------------------------------------------------------------------
  -- F. LE VERDICT
  ---------------------------------------------------------------------------
  select count(*) into n from diag where verdict = 'PERIME';
  insert into diag values ('F', 'RUN-06 a-t-il ete execute ?',
    case when n = 0 then 'oui : aucune valeur perimee'
         else 'NON : ' || n || ' valeur(s) encore perimee(s)' end,
    'oui', case when n = 0 then 'ok' else 'NON EXECUTE' end);
end $diag$;

select bloc, sujet, valeur, attendu, verdict from diag order by bloc, sujet;


-- =============================================================================
-- COMMENT LIRE
-- =============================================================================
-- ok           la valeur est celle attendue apres RUN-06
-- PERIME       la valeur d'avant RUN-06 : le correctif n'a pas ete passe, ou
--              a ete annule par son propre controle final
-- ECART        present mais different de l'attendu
-- BLOQUANT     une colonne qui doit accepter NULL ne l'accepte pas ; le
--              correctif s'arretera dessus, deliberement
-- INFO         rapporte, sans attendu
--
-- La ligne F tranche la question 1 : si elle dit NON EXECUTE, RUN-06 n'a pas
-- pris, et aucune publication ne doit avoir lieu.
--
-- Aucune ligne de ce fichier n'ecrit en base.
-- =============================================================================
