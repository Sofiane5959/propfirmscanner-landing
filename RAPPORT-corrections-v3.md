# Corrections v3 — les trois points structurels

9 septembre 2026. **Aucun SQL exécuté. Aucun déploiement. FTMO et The5ers
intouchés.** Le candidat FuturesElite est inchangé.

---

## 1. Immuabilité générique

`model_schema_version`, `verified_at`, `created_at` et `created_by` n'étaient pas
protégés. Tu as raison, et le vrai problème n'était pas ces quatre colonnes :
c'était la **liste**. Une liste d'exclusion oubliée est un trou silencieux — rien
ne signale qu'une colonne nouvelle n'est pas protégée, on le découvre le jour où
une version publiée a changé sans qu'on sache comment.

```sql
create or replace function firm_page_versions_champs_de_cycle()
returns text[] language sql immutable as $$
  select array['status', 'published_at', 'archived_at']::text[];
$$;
```

```diff
-    if new.page_model_json      is distinct from old.page_model_json
-    or new.summary_model_json   is distinct from old.summary_model_json
-    or new.validation_report_json is distinct from old.validation_report_json
-    or new.source_hash          is distinct from old.source_hash
-    or new.firm_slug            is distinct from old.firm_slug
-    or new.version_number       is distinct from old.version_number then
+    if (to_jsonb(new) - cycle) is distinct from (to_jsonb(old) - cycle) then
       raise exception
-        'Version % de % : le contenu d''une version % est immuable.',
-        old.version_number, old.firm_slug, old.status;
+        'Version % de % : le contenu d''une version % est immuable. Champs modifies : %.',
+        old.version_number, old.firm_slug, old.status,
+        (select coalesce(string_agg(cle, ', '), 'aucun')
+           from jsonb_each(to_jsonb(new) - cycle) e(cle, valeur)
+          where (to_jsonb(old) - cycle) -> cle is distinct from valeur);
     end if;
```

Le défaut est désormais « immuable » ; l'exception doit être écrite. Le message
nomme les champs modifiés, sinon un refus générique n'apprendrait rien.

Les règles de transition sont inchangées : `published ⇄ archived`, rien ne
redevient `draft` ni `validated`.

---

## 2. `search_path` figé

Ajouté aux trois fonctions `security definer` **et** aux trois fonctions de
déclenchement :

```sql
set search_path = public, pg_temp
```

`pg_temp` est **en dernier**, jamais devant : sinon une table temporaire créée
par l'appelant masquerait la vraie.

Toutes les tables des corps de fonction sont en plus qualifiées `public.` — la
fonction ne dépend alors plus du tout du chemin, et le `set` devient une seconde
barrière plutôt que la seule.

`REVOKE ... from public, anon, authenticated` et `GRANT EXECUTE ... to
service_role` sont conservés à l'identique.

---

## 3. Une seule version publiée par firme

```sql
create unique index if not exists firm_page_versions_one_published_per_firm
  on public.firm_page_versions (firm_slug)
  where status = 'published';
```

Vérifié : les deux fonctions archivent bien l'ancienne **avant** de publier la
nouvelle, en deux instructions distinctes — `activate_firm_version` archive
`v_precedente`, `rollback_firm_version` archive l'active. Aucun instant n'a deux
lignes publiées, donc l'index ne gêne ni l'une ni l'autre.

Ce que l'index ajoute, c'est de rendre l'état impossible **hors** de ces
fonctions : un `UPDATE` direct, une reprise manuelle après incident, un script de
maintenance.

---

## Un piège fermé au passage

`create table if not exists` ne fait rien quand la table existe. Une base où une
version antérieure du fichier serait passée aurait gardé une table sans
`model_schema_version` ni `unique (firm_slug, id)`, et la contrainte composite
aurait échoué sur une erreur peu parlante.

Un bloc « 1 bis » ajoute la colonne et les deux contraintes si elles manquent, et
les contraintes sont **nommées** dans le `CREATE TABLE` pour que les deux chemins
— table neuve, table mise à niveau — produisent le même nom.

---

## Requête de contrôle

Attendu :

```
firm_page_versions | 6 | 3 | 1 | 1 | ok | ok | ok | ok | ok | 6
```

Six index — clé primaire, les deux unicités, les deux index de lecture, et
l'unicité partielle sur `published`. Six fonctions à `search_path` figé.

---

## Les tests

`database/TEST-rollback-versions.sql` passe de 20 à **35 contrôles**. Les quinze
nouveaux :

| # | Contrôle |
|---|---|
| 6 | `model_schema_version` est immuable après publication |
| 7 | `verified_at` est immuable après publication |
| 8 | `created_at` est immuable après publication |
| 9 | `created_by` est immuable après publication |
| 10 | **une colonne ajoutée plus tard est protégée aussi** |
| 11 | les trois champs de cycle de vie restent mobiles |
| 24 | deux versions publiées pour une même firme sont refusées |
| 25 | exactement une version publiée subsiste |
| 26 | le retour en arrière passe malgré l'index unique partiel |
| 27 | une troisième activation garde une seule publiée |
| 28 | les trois fonctions `security definer` ont un `search_path` fixe |
| 29 | les trois fonctions de déclenchement aussi |
| 30 | l'exécution reste réservée à `service_role` |
| 31 | après désactivation : pointeur nul **et** ancienne version archivée |
| 32 | une firme désactivée peut republier |

Le test 10 est celui qui compte. Il ajoute réellement une colonne
(`__test_colonne_future`), tente de la modifier sur une version publiée, puis la
supprime. C'est la différence entre « ces champs-là sont protégés » et « tout est
protégé sauf le cycle de vie ».

Le test 11 est son garde-fou : sans lui, une immuabilité trop large paralyserait
l'archivage et la republication.

Le test 26 exerce le rollback **avec** l'index en place, et le 27 enchaîne une
troisième activation — la séquence complète v1 → v2 → v1 → v3 ne laisse jamais
deux lignes publiées.

---

## Résultats

```
npm run publication:candidate    35 assertions vertes, 0 erreur de validation
npm run test:readers             35 assertions vertes
npm run test:capabilities        61 assertions vertes
npm run model:report             54 assertions vertes
npm run validator:regressions    14 assertions vertes
npm run test:programs           152 assertions vertes
npx tsc --noEmit                 propre, hors les deux erreurs vitest documentées
npm run build                    ✓ Compiled successfully, puis l'échec d'environnement connu
```

Contrôle structurel des deux fichiers SQL : délimiteurs `$$` appariés (18 et 2),
blocs `begin`/`end` équilibrés (16 sous-blocs, 16 gestionnaires d’exception dans
le fichier de test), aucune apostrophe non fermée.

### Ce que je n'ai pas pu faire, et que tu dois savoir

**Les 35 contrôles SQL n'ont pas été exécutés.** Ni PostgreSQL ni Docker ne sont
installés sur cette machine — je l'ai vérifié plutôt que de le supposer. Ils sont
écrits et relus, pas passés. C'est `TEST-rollback-versions.sql`, à l'étape 12 de
la séquence, qui les fera parler.

Les six suites JavaScript, elles, ont réellement tourné.

---

## Le candidat FuturesElite

**Inchangé.** Aucune de ces trois corrections ne touche la structure de la
version : `model_schema_version` y figurait déjà, et l'immuabilité comme
l'unicité portent sur la table, pas sur le JSON.

SCANNED reste **30 %**, portée `unconfirmed`, expiration inconnue, les quinze
prix marqués `estimated` avec vérification au checkout, et aucune offre sur les
cartes. Empreinte identique :
`sha256:619df46f…`

---

## Ordre d'exécution

Inchangé. `RUN-05` à l'étape 11, `TEST-rollback-versions.sql` à l'étape 12,
attendu **35 lignes `ok`**, puis les variables Vercel et le déploiement.

L'étape 18 s'écrit désormais d'une seule façon :

```sql
select deactivate_firm_version('futureselite');
```
