// =============================================================================
// CORRECTIF CONSOLIDE FUTURESELITE      scripts/build-correctif-futureselite.mjs
// =============================================================================
//   npm run build:correctif
//
// Ecrit database/RUN-06-correctif-futureselite.sql : UN SEUL fichier a passer.
//
// POURQUOI UN GENERATEUR PLUTOT QU'UN FICHIER ECRIT A LA MAIN
//
// Recopier le contenu de `RUN-futureselite-programs.sql` et de
// `RUN-futureselite.sql` dans un troisieme fichier creerait une source
// concurrente : trois endroits ou corriger un prix, et deux occasions
// d'oublier. C'est exactement le probleme dont on sort.
//
// Le correctif est donc ASSEMBLE a partir des deux fichiers existants, qui
// sont eux-memes generes depuis les fixtures. La chaine reste :
//
//   scripts/futureselite-programs.mjs ┐
//   scripts/firm-content.mjs          ┴─> les deux RUN ─> le correctif
//
// Regenerer suffit a propager une correction jusqu'ici.
//
// CE QUE L'ASSEMBLAGE AJOUTE
//
//   - un controle AVANT qui refuse de tourner si l'etat ne s'y prete pas ;
//   - un controle APRES qui leve si le resultat n'est pas exactement l'attendu,
//     ce qui annule TOUTE la transaction ;
//   - le retrait des `select` d'inspection des deux fichiers : l'editeur
//     Supabase ne montre que le dernier jeu de resultats, donc les garder
//     n'apporterait rien et masquerait le rapport final.
// =============================================================================

import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'

// -----------------------------------------------------------------------------
// VERSION DU CORRECTIF
// -----------------------------------------------------------------------------
// A incrementer des que le SQL produit change. Le numero seul ne prouve rien —
// c'est l'empreinte plus bas qui identifie le contenu — mais il donne un nom
// court a une version, ce qu'une empreinte ne fait pas.
//
//   1  premier assemblage
//   2  projections heritees : max_price, Elite a 90, End of Day, translations
//   3  program_guide et journey a null, allows_* en false/null/null, garde de
//      nullabilite, controles etendus
//   4  format de `raise` remis en litteral (42601 sur la garde de nullabilite)
//   5  en-tete : numero de version et empreinte du corps
//   6  controle du partage par programme : Instant a 80, les trois autres a 90
const VERSION = 6

// -----------------------------------------------------------------------------
// 1. Regenerer les deux sources, pour ne jamais consolider une version perimee
// -----------------------------------------------------------------------------
execSync('node scripts/build-program-schema.mjs', { stdio: 'pipe' })
execSync('node scripts/build-firm-content.mjs', { stdio: 'pipe' })

// -----------------------------------------------------------------------------
// 2. Ne garder que les instructions qui ECRIVENT
// -----------------------------------------------------------------------------
/**
 * Decoupe un fichier SQL en instructions et retire les `select` de tete.
 *
 * Le suivi des apostrophes est necessaire : les colonnes editoriales JSONB
 * contiennent des points-virgules dans leur texte, et un decoupage naif
 * couperait au milieu d'une chaine. Aucun des deux fichiers n'utilise de
 * delimiteur `$$`, ce qui est verifie plus bas.
 */
function instructionsEcrivantes(sql) {
  const lignes = sql.split('\n')
  const sorties = []
  let courante = []
  let dansUneChaine = false

  for (const ligne of lignes) {
    // Un commentaire de ligne entier, hors instruction : on le jette.
    if (courante.length === 0 && /^\s*(--|$)/.test(ligne)) continue

    courante.push(ligne)

    for (let i = 0; i < ligne.length; i++) {
      const ch = ligne[i]
      if (ch === "'") {
        // `''` est une apostrophe echappee, pas une fin de chaine.
        if (dansUneChaine && ligne[i + 1] === "'") { i++; continue }
        dansUneChaine = !dansUneChaine
      } else if (!dansUneChaine && ch === '-' && ligne[i + 1] === '-') {
        break // commentaire de fin de ligne
      }
    }

    if (!dansUneChaine && /;\s*(--.*)?$/.test(ligne)) {
      const instruction = courante.join('\n')
      const premierMot = instruction.trim().split(/\s+/)[0].toLowerCase()
      if (premierMot !== 'select') sorties.push(instruction)
      courante = []
    }
  }
  if (courante.length > 0) sorties.push(courante.join('\n'))
  return sorties
}

const SOURCES = [
  ['database/RUN-futureselite-programs.sql', 'LES PROGRAMMES, LES PLANS, LES PROMOTIONS, LES REGLES'],
  ['database/RUN-futureselite.sql', 'LES COLONNES EDITORIALES ET LA DATE DE VERIFICATION'],
]

for (const [chemin] of SOURCES) {
  const brut = readFileSync(chemin, 'utf8')
  if (brut.includes('$$')) {
    console.error(`${chemin} contient un delimiteur $$ : le decoupage par instruction n est plus sur.`)
    process.exit(1)
  }
}

// -----------------------------------------------------------------------------
// 3. Assembler
// -----------------------------------------------------------------------------
const L = []
const p = (...l) => L.push(...l)

p(
  '-- =============================================================================',
  `-- CORRECTIF FUTURESELITE — VERSION ${VERSION}`,
  '-- =============================================================================',
  '-- GENERE PAR scripts/build-correctif-futureselite.mjs. NE PAS EDITER A LA MAIN.',
  '--',
  '-- COMMENT IDENTIFIER CE FICHIER',
  '--',
  `--   version         ${VERSION}`,
  '--   empreinte       __SHA256_DU_CORPS__',
  '--',
  '-- L empreinte couvre le CORPS — de `begin;` jusqu a la fin —, pas l en-tete,',
  '-- qui la contient et ne peut donc pas se hacher lui-meme. La verifier :',
  '--',
  "--   sed -n '/^begin;/,$p' RUN-06-correctif-futureselite.sql | sha256sum",
  '--',
  '-- Une empreinte differente de celle ci-dessus signifie un fichier different.',
  '-- Ne pas l executer sans avoir demande lequel fait autorite.',
  '--',
  '-- Un seul fichier a passer. Il assemble, dans cet ordre :',
  '--   database/RUN-futureselite-programs.sql   les programmes et leurs plans',
  '--   database/RUN-futureselite.sql            les colonnes editoriales',
  '--',
  '-- Ces deux fichiers restent la source ; ce correctif n en est que le montage.',
  '-- Corriger un prix se fait dans les fixtures, puis `npm run build:correctif`.',
  '--',
  '-- CE QU IL CORRIGE, ET POURQUOI',
  '--',
  '-- Le diagnostic du 9 septembre 2026 a montre un etat a moitie migre :',
  '--',
  '--   market = cfd sur les 4 programmes  -> une version anterieure du fichier',
  '--                                         omettait la colonne, le defaut de',
  '--                                         schema s appliquait',
  '--   « seven platforms »                -> RUN-futureselite.sql jamais passe',
  '--   « all four settle at a 90 »           dans sa version courante',
  '--   « price lists are not public »',
  '--   data_verified_at = 2026-09-03      -> attendu 2026-09-07',
  '--',
  '-- Une deuxieme passe a montre que les tables NORMALISEES n etaient pas les',
  '-- seules en cause : les projections HERITEES reinjectaient leurs propres',
  '-- contradictions, corrigees a la source depuis :',
  '--',
  '--   max_price = 353          -> 569. 353 etait le plus cher des quatre plans',
  '--                               ELITE ; la gamme va jusqu a l Instant 150K',
  '--   Elite a profit_split 80  -> 90. Le 13e element de la ligne manquait, donc',
  '--                               le taux de la FIRME s appliquait a un',
  '--                               programme qui paie 90 %',
  '--   End of day + Trailing    -> les deux colonnes refletent desormais la meme',
  '--                               donnee normalisee ; Elite est End of Day aux',
  '--                               deux phases, Nitro finance est Trailing Equity',
  '--   EA/scalping/news a true  -> false, null, null. Les trois etaient faux,',
  '--                               mais de trois manieres differentes : les bots',
  '--                               sont interdits sans reserve, le scalping n est',
  '--                               pas defini, le news depend de la phase. Mettre',
  '--                               `false` partout serait le mensonge symetrique',
  '--                               de `true` partout. La precision vit dans le',
  '--                               texte de consistency',
  '--   program_guide, journey   -> null. Le premier annoncait quatre programmes',
  '--                               et n en decrivait qu un ; le second affirmait',
  '--                               un parcours evaluation -> finance, faux pour',
  '--                               Instant, et la disparition de la regle de',
  '--                               regularite, faux pour Prime',
  '--   translations             -> vide. Les six bundles datent d avant les',
  '--                               corrections et affirmaient encore sept',
  '--                               plateformes et 90 % pour les quatre, dans',
  '--                               cinq langues. Chaque locale retombe sur',
  '--                               l anglais corrige',
  '--',
  '-- Le `market = cfd` n est pas visible sur la page actuelle — le rendu',
  '-- historique lit `is_futures` — mais il aurait bloque la publication :',
  '-- `marketMetadataAgrees` serait faux, donc l erreur MARKET_MISMATCH.',
  '--',
  '-- TRANSACTIONNEL',
  '--',
  '-- `BEGIN;` ouvre la transaction, `COMMIT;` ne vient qu APRES le controle',
  '-- final. Le controle leve deliberement si le resultat n est pas exactement',
  '-- l attendu : le COMMIT n est alors jamais atteint. Soit la migration est',
  '-- entierement correcte, soit rien n a change.',
  '--',
  '-- L editeur SQL Supabase enveloppe deja le script dans sa propre',
  '-- transaction, donc le `BEGIN;` explicite y produit un AVERTISSEMENT',
  '-- « there is already a transaction in progress ». C est un avertissement,',
  '-- pas une erreur, et le fichier reste correct sous psql ou tout autre',
  '-- client qui, lui, ne suppose rien.',
  '--',
  '-- CE QU IL NE FAIT PAS',
  '--',
  '-- Aucune version n est creee ni publiee. `firm_page_versions` et',
  '-- `active_page_version_id` ne sont pas touches : la fiche continue d etre',
  '-- servie par le rendu historique jusqu a une publication explicite.',
  '-- FTMO et The5ers ne sont pas touches : chaque instruction est filtree sur',
  '-- `futureselite`.',
  '-- =============================================================================',
  '',
  '',
  'begin;',
  '',
  '',
  '-- -----------------------------------------------------------------------------',
  '-- CONTROLE AVANT — refuse de tourner si l etat ne s y prete pas',
  '-- -----------------------------------------------------------------------------',
  'do $ctrl$',
  'declare',
  '  v_actif uuid;',
  '  n integer;',
  '  r record;',
  'begin',
  "  if not exists (select 1 from prop_firms where slug = 'futureselite') then",
  "    raise exception 'ARRET : la firme futureselite n''existe pas.';",
  '  end if;',
  '',
  "  if to_regclass('public.firm_programs') is null then",
  "    raise exception 'ARRET : RUN-program-schema.sql n''a pas ete passe.';",
  '  end if;',
  '',
  '  if not exists (select 1 from information_schema.columns',
  "                  where table_name = 'firm_programs' and column_name = 'market') then",
  "    raise exception 'ARRET : RUN-program-schema-v2.sql n''a pas ete passe.';",
  '  end if;',
  '',
  '  -- LES TROIS COLONNES D AUTORISATION DOIVENT POUVOIR PORTER NULL.',
  '  --',
  '  -- `allows_scalping` et `allows_news_trading` sont ecrites a NULL, parce que',
  "  -- la donnee est respectivement non definie et dependante de la phase. Un",
  '  -- booleen ne sait dire ni l un ni l autre, et `false` mentirait autant que',
  '  -- `true` : « news trading interdit » est faux, il est autorise en evaluation.',
  '  --',
  "  -- Si ces colonnes n acceptent pas NULL, le script s ARRETE. Retomber sur",
  '  -- `false` serait choisir une valeur fausse pour eviter une erreur — ce qui',
  '  -- est precisement le mecanisme dont on sort.',
  '  select count(*) into n from information_schema.columns',
  "   where table_schema = 'public' and table_name = 'prop_firm_challenges'",
  "     and column_name in ('allows_ea', 'allows_scalping', 'allows_news_trading');",
  '  if n <> 3 then',
  "    raise exception 'ARRET : prop_firm_challenges ne porte pas les trois colonnes d''autorisation (%/3).', n;",
  '  end if;',
  '',
  '  for r in',
  '    select column_name, is_nullable from information_schema.columns',
  "     where table_schema = 'public' and table_name = 'prop_firm_challenges'",
  "       and column_name in ('allows_scalping', 'allows_news_trading')",
  '  loop',
  "    if r.is_nullable = 'NO' then",
  '      -- Le format de `raise` doit etre un LITTERAL : plpgsql refuse une',
  "      -- concatenation par `||` a cet endroit, avec un 42601 peu parlant.",
  '      raise exception',
  "        'ARRET : prop_firm_challenges.% est NOT NULL, or cette colonne doit porter NULL. Le scalping n''est pas defini et le news trading depend de la phase : aucune valeur booleenne n''est vraie. Rendre la colonne nullable, puis rejouer.',",
  '        r.column_name;',
  '    end if;',
  '  end loop;',
  '',
  '  -- LE CONTROLE QUI COMPTE.',
  '  --',
  '  -- Corriger la donnee canonique sous une version PUBLIEE ne casserait rien',
  '  -- immediatement — la fiche sert un instantane fige, pas ces tables. Mais',
  "  -- l'instantane cesserait de correspondre a ses sources, et la prochaine",
  '  -- republication changerait la page sans que personne ne sache pourquoi.',
  '  --',
  '  -- Si une version est active, la retirer est une DECISION, pas un effet de',
  '  -- bord de cette migration.',
  '  -- `to_jsonb` : si RUN-05 n\'a pas ete passe la cle est absente et rend NULL,',
  '  -- au lieu de faire echouer le bloc sur une colonne inconnue.',
  "  select (to_jsonb(f) ->> 'active_page_version_id')::uuid into v_actif",
  "    from prop_firms f where f.slug = 'futureselite';",
  '  if v_actif is not null then',
  '    raise exception',
  "      'ARRET : une version est active (%). Retire-la d''abord par '' select deactivate_firm_version(''futureselite'') ''.',",
  '      v_actif;',
  '  end if;',
  '',
  "  select count(*) into n from firm_programs where firm_slug = 'futureselite';",
  "  raise notice 'Avant : % programme(s), marche = %', n,",
  "    coalesce((select string_agg(distinct market, ', ') from firm_programs",
  "               where firm_slug = 'futureselite'), 'aucun');",
  'end $ctrl$;',
  '',
)

for (const [chemin, titre] of SOURCES) {
  const instructions = instructionsEcrivantes(readFileSync(chemin, 'utf8'))
  p(
    '',
    '-- -----------------------------------------------------------------------------',
    `-- ${titre}`,
    `-- Assemble depuis ${chemin} (${instructions.length} instructions).`,
    '-- -----------------------------------------------------------------------------',
    '',
    ...instructions,
    '',
  )
}

p(
  '',
  '-- -----------------------------------------------------------------------------',
  '-- CONTROLE APRES — leve si le resultat n est pas exactement l attendu',
  '-- -----------------------------------------------------------------------------',
  '-- Une exception ici annule TOUTE la transaction, y compris les ecritures',
  '-- ci-dessus. C est voulu : une migration a moitie appliquee est precisement',
  "-- l'etat qu'on vient de passer une semaine a demeler.",
  'do $verif$',
  'declare',
  '  ecarts text[] := array[]::text[];',
  '  n integer;',
  '  txt text;',
  'begin',
  "  select count(*) into n from firm_programs where firm_slug = 'futureselite';",
  "  if n <> 4 then ecarts := ecarts || format('programmes = %s au lieu de 4', n); end if;",
  '',
  "  select string_agg(distinct market, ', ') into txt",
  "    from firm_programs where firm_slug = 'futureselite';",
  "  if txt is distinct from 'futures' then",
  "    ecarts := ecarts || format('marche = %s au lieu de futures', coalesce(txt, 'aucun'));",
  '  end if;',
  '',
  '  select count(*) into n from firm_program_plans pl',
  '    join firm_programs pr on pr.id = pl.program_id',
  "   where pr.firm_slug = 'futureselite';",
  "  if n <> 27 then ecarts := ecarts || format('lignes de phase = %s au lieu de 27', n); end if;",
  '',
  '  -- Une SELECTION COMMERCIALE = programme + variante + taille. Les phases en',
  '  -- sont les enfants : 27 lignes pour 15 selections, et jamais 27 cartes.',
  "  select count(*) into n from (",
  "    select distinct pr.slug, coalesce(pl.variant_key, ''), pl.account_size",
  '      from firm_program_plans pl',
  '      join firm_programs pr on pr.id = pl.program_id',
  "     where pr.firm_slug = 'futureselite') s;",
  "  if n <> 15 then ecarts := ecarts || format('selections = %s au lieu de 15', n); end if;",
  '',
  '  select count(*) into n from firm_platforms',
  "   where firm_slug = 'futureselite' and configurator_status = 'selectable';",
  "  if n <> 6 then ecarts := ecarts || format('plateformes = %s au lieu de 6', n); end if;",
  '',
  "  select (data_verified_at)::date::text into txt",
  "    from prop_firms where slug = 'futureselite';",
  "  if txt is distinct from '2026-09-07' then",
  "    ecarts := ecarts || format('date de verification = %s au lieu de 2026-09-07', coalesce(txt, 'nulle'));",
  '  end if;',
  '',
  '  -- Les trois textes perimes. La recherche porte sur la LIGNE serialisee :',
  '  -- `pros` et `cons` sont des tableaux, `description` du texte, et un seul',
  '  -- cast ne peut pas convenir aux deux.',
  '  for txt in select unnest(array[',
  "        'seven platforms', 'all four settle at a 90', 'price lists are not public'])",
  '  loop',
  '    if exists (select 1 from prop_firms f',
  "               where f.slug = 'futureselite' and to_jsonb(f)::text ilike '%' || txt || '%') then",
  "      ecarts := ecarts || format('texte perime encore present : %s', txt);",
  '    end if;',
  '  end loop;',
  '',
  '  -- LE PARTAGE PAR PROGRAMME, dans les tables normalisees.',
  '  --',
  "  -- « Elite a 90 » etait deja controle sur la projection heritee, mais rien",
  "  -- ne verifiait Instant. Or c'est precisement l'ecart que la page affirmait",
  '  -- a tort : « all four settle at a 90 % » alors qu Instant paie 80. Le',
  '  -- controle porte donc sur les deux, et sur la phase financee seule.',
  '  select count(*) into n from firm_program_plans pl',
  '    join firm_programs pr on pr.id = pl.program_id',
  "   where pr.firm_slug = 'futureselite' and pr.slug = 'instant'",
  "     and pl.phase = 'sim_funded' and pl.profit_split = 0.8;",
  "  if n <> 3 then ecarts := ecarts || format('Instant a 80 %% : %s phase(s) financee(s) sur 3', n); end if;",
  '',
  '  select count(*) into n from firm_program_plans pl',
  '    join firm_programs pr on pr.id = pl.program_id',
  "   where pr.firm_slug = 'futureselite' and pr.slug in ('elite', 'nitro', 'prime')",
  "     and pl.phase = 'sim_funded' and pl.profit_split is distinct from 0.9;",
  "  if n <> 0 then ecarts := ecarts || format('%s phase(s) financee(s) Elite/Nitro/Prime hors 90 %%', n); end if;",
  '',
  '  -- LES PROJECTIONS HERITEES. Corriger les tables normalisees ne suffisait',
  '  -- pas : ces colonnes-ci alimentent /compare, les cartes et le',
  '  -- configurateur historique, et elles portaient leurs propres',
  '  -- contradictions.',
  "  select min_price into n from prop_firms where slug = 'futureselite';",
  "  if n is distinct from 95 then ecarts := ecarts || format('min_price = %s au lieu de 95', n); end if;",
  '',
  "  select max_price into n from prop_firms where slug = 'futureselite';",
  "  if n is distinct from 569 then ecarts := ecarts || format('max_price = %s au lieu de 569', n); end if;",
  '',
  '  -- Les traductions sont mises de cote : chaque locale doit retomber sur',
  "  -- l'anglais corrige plutot que servir des chiffres d'avant le 7 septembre.",
  "  if exists (select 1 from prop_firms where slug = 'futureselite'",
  "               and translations is not null and translations::text <> '{}') then",
  "    ecarts := ecarts || 'translations non vide : des traductions perimees seraient servies';",
  '  end if;',
  '',
  '  -- Aucun Elite a 80 %. Les quatre phases sim_funded d Elite portent 0,9, et',
  '  -- le texte de payout le dit deja : la colonne ne peut pas dire l inverse.',
  '  select count(*) into n from prop_firm_challenges',
  "   where firm_slug = 'futureselite' and name ilike 'Elite%' and profit_split is distinct from 90;",
  "  if n <> 0 then ecarts := ecarts || format('%s ligne(s) Elite hors 90 %%', n); end if;",
  '',
  '  -- Aucune contradiction fin-de-journee / trailing sur une meme ligne.',
  '  select count(*) into n from prop_firm_challenges',
  "   where firm_slug = 'futureselite'",
  "     and ((drawdown_type ilike '%end of day%' and max_loss_type ilike '%trailing%')",
  "       or (drawdown_type ilike '%trailing%' and max_loss_type ilike '%end of day%'));",
  "  if n <> 0 then ecarts := ecarts || format('%s ligne(s) End of Day/Trailing contradictoires', n); end if;",
  '',
  '  -- LES VALEURS EXACTES, et pas seulement l absence de `true`.',
  '  --',
  '  -- Verifier « aucun true » laisserait passer `false` partout, qui est le',
  '  -- mensonge symetrique. Chaque colonne est donc controlee pour ce qu elle',
  '  -- doit dire :',
  '  --   allows_ea            false  interdiction etablie, sans reserve',
  '  --   allows_scalping      NULL   terme non defini, conflit de sources ouvert',
  '  --   allows_news_trading  NULL   depend de la phase, la colonne n en a pas',
  '  select count(*) into n from prop_firm_challenges',
  "   where firm_slug = 'futureselite' and allows_ea is distinct from false;",
  "  if n <> 0 then ecarts := ecarts || format('%s ligne(s) ou allows_ea n''est pas false', n); end if;",
  '',
  '  select count(*) into n from prop_firm_challenges',
  "   where firm_slug = 'futureselite' and allows_scalping is not null;",
  "  if n <> 0 then ecarts := ecarts || format('%s ligne(s) ou allows_scalping n''est pas NULL', n); end if;",
  '',
  '  select count(*) into n from prop_firm_challenges',
  "   where firm_slug = 'futureselite' and allows_news_trading is not null;",
  "  if n <> 0 then ecarts := ecarts || format('%s ligne(s) ou allows_news_trading n''est pas NULL', n); end if;",
  '',
  '  -- LES BLOCS EDITORIAUX RETIRES.',
  '  --',
  "  -- `is null` et non `= 'null'::jsonb` : un JSON null n est pas un NULL SQL,",
  '  -- et le generateur ecrivait le premier en croyant ecrire le second. La',
  '  -- section aurait disparu du rendu tout en restant en base, invisible a',
  '  -- tout controle.',
  "  if exists (select 1 from prop_firms where slug = 'futureselite'",
  '               and program_guide is not null) then',
  "    ecarts := ecarts || 'program_guide non nul : le bloc ne decrit qu Elite sur quatre programmes';",
  '  end if;',
  '',
  "  if exists (select 1 from prop_firms where slug = 'futureselite'",
  '               and journey is not null) then',
  "    ecarts := ecarts || 'journey non nul : le parcours affirme une evaluation que Instant n a pas';",
  '  end if;',
  '',
  '  -- SCANNED : 30 %, portee non confirmee. C est ce qui fait marquer les',
  '  -- quinze prix comme des estimations plutot que comme des prix fermes.',
  '  select count(*) into n from firm_promotions',
  "   where firm_slug = 'futureselite' and code = 'SCANNED'",
  '     and is_public = false and discount_value = 0.30',
  "     and coalesce(to_jsonb(firm_promotions) ->> 'scope_confidence', 'unconfirmed') = 'unconfirmed';",
  '  if n < 1 then',
  "    ecarts := ecarts || 'SCANNED absent, ou pas a 0.30, ou portee confirmee a tort';",
  '  end if;',
  '',
  '  -- Aucune version creee : cette migration ne publie rien.',
  "  if to_regclass('public.firm_page_versions') is not null then",
  "    execute $q$ select count(*) from firm_page_versions where firm_slug = 'futureselite' $q$",
  '      into n;',
  "    if n <> 0 then ecarts := ecarts || format('%s version(s) creee(s) : ce fichier ne doit en creer aucune', n); end if;",
  '',
  "    execute $q$ select count(*) from prop_firms",
  "                 where slug = 'futureselite' and active_page_version_id is not null $q$ into n;",
  "    if n <> 0 then ecarts := ecarts || 'un pointeur actif a ete pose : ce fichier ne doit rien publier'; end if;",
  '  end if;',
  '',
  '  if array_length(ecarts, 1) > 0 then',
  '    raise exception',
  "      'CORRECTIF ANNULE — % ecart(s) : %. Aucune modification n''a ete conservee.',",
  "      array_length(ecarts, 1), array_to_string(ecarts, ' | ');",
  '  end if;',
  '',
  "  raise notice 'Correctif applique : 4 programmes futures, 15 selections, 27 phases, 6 plateformes.';",
  'end $verif$;',
  '',
  '',
  '-- -----------------------------------------------------------------------------',
  '-- COMMIT — jamais atteint si le controle ci-dessus a leve',
  '-- -----------------------------------------------------------------------------',
  'commit;',
  '',
  '',
  '-- -----------------------------------------------------------------------------',
  '-- RAPPORT FINAL — lit l etat COMMIS',
  '-- -----------------------------------------------------------------------------',
  'select',
  "  (select count(*) from firm_programs where firm_slug = 'futureselite')            as programmes,",
  "  (select string_agg(distinct market, ', ') from firm_programs",
  "    where firm_slug = 'futureselite')                                              as marche,",
  '  (select count(*) from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id',
  "    where pr.firm_slug = 'futureselite')                                           as lignes_de_phase,",
  "  (select count(*) from (select distinct pr.slug, coalesce(pl.variant_key, ''), pl.account_size",
  '                           from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id',
  "                          where pr.firm_slug = 'futureselite') s)                   as selections,",
  '  (select count(*) from firm_platforms',
  "    where firm_slug = 'futureselite' and configurator_status = 'selectable')       as plateformes,",
  "  (select (data_verified_at)::date from prop_firms where slug = 'futureselite')    as verifie_le,",
  "  (select discount_value from firm_promotions",
  "    where firm_slug = 'futureselite' and code = 'SCANNED' limit 1)                 as remise_scanned,",
  "  (select to_jsonb(p) ->> 'scope_confidence' from firm_promotions p",
  "    where p.firm_slug = 'futureselite' and p.code = 'SCANNED' limit 1)             as portee_scanned,",
  "  (select min_price || '-' || max_price from prop_firms",
  "    where slug = 'futureselite')                                                   as fourchette_heritee,",
  "  (select count(*) from prop_firm_challenges",
  "    where firm_slug = 'futureselite' and profit_split = 90)                        as elite_a_90,",
  '  (select count(*) from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id',
  "    where pr.firm_slug = 'futureselite' and pr.slug = 'instant'",
  "      and pl.phase = 'sim_funded' and pl.profit_split = 0.8)                       as instant_a_80,",
  "  (select case when translations is null then 'vide' else 'PRESENTE' end",
  "     from prop_firms where slug = 'futureselite')                                  as traductions,",
  "  (select distinct allows_ea::text || ' / '",
  "          || coalesce(allows_scalping::text, 'NULL') || ' / '",
  "          || coalesce(allows_news_trading::text, 'NULL')",
  "     from prop_firm_challenges where firm_slug = 'futureselite')                   as ea_scalping_news,",
  "  (select case when program_guide is null and journey is null then 'nuls'",
  "               else 'PRESENTS' end",
  "     from prop_firms where slug = 'futureselite')                                  as guide_et_parcours,",
  "  (select coalesce(active_page_version_id::text, 'NULL')",
  "     from prop_firms where slug = 'futureselite')                                  as version_active;",
  '',
  '-- ATTENDU :',
  '--   programmes            4',
  '--   marche                futures',
  '--   lignes_de_phase      27',
  '--   selections           15',
  '--   plateformes           6',
  '--   verifie_le           2026-09-07',
  '--   remise_scanned       0.30',
  '--   portee_scanned       unconfirmed',
  '--   fourchette_heritee   95-569',
  '--   elite_a_90            4',
  '--   instant_a_80          3',
  '--   traductions          vide',
  '--   ea_scalping_news     false / NULL / NULL',
  '--   guide_et_parcours    nuls',
  '--   version_active       NULL',
  '',
  '-- La derniere colonne DOIT rester NULL : ce correctif ne publie rien.',
  '',
)

// -----------------------------------------------------------------------------
// 4. Empreinte du corps, puis ecriture
// -----------------------------------------------------------------------------
// Le corps commence a `begin;`. Il ne contient ni date ni compteur, donc deux
// generations des memes sources donnent la meme empreinte : c'est ce qui la
// rend utile pour dire « ce fichier-ci, pas celui d avant ».
const brut = L.join('\n')
const debutDuCorps = brut.indexOf('\nbegin;\n')
if (debutDuCorps < 0) {
  console.error('Le corps ne commence pas par `begin;` : l empreinte serait fausse.')
  process.exit(1)
}
const corps = brut.slice(debutDuCorps + 1)
const empreinte = createHash('sha256').update(corps, 'utf8').digest('hex')

const sortie = 'database/RUN-06-correctif-futureselite.sql'
writeFileSync(sortie, brut.replace('__SHA256_DU_CORPS__', empreinte), 'utf8')

const nb = SOURCES.map(([c]) => instructionsEcrivantes(readFileSync(c, 'utf8')).length)
console.log('')
console.log(`${sortie}   version ${VERSION}`)
console.log(`  empreinte du corps  ${empreinte}`)
console.log(`  ${nb[0]} instructions depuis RUN-futureselite-programs.sql`)
console.log(`  ${nb[1]} instructions depuis RUN-futureselite.sql`)
console.log(`  ${readFileSync(sortie, 'utf8').split('\n').length} lignes, ` +
  `1 controle avant, 1 controle apres, 1 rapport`)
console.log('')
