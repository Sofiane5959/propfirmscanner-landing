# Corrections 1 à 6 — couche de publication immuable

9 septembre 2026. **Aucun SQL exécuté. Aucun déploiement. FTMO et The5ers
intouchés.**

---

## 1. Diff du schéma

Tout est dans `database/RUN-05-firm-page-versions.sql`, additif.

### Ajouté à `firm_page_versions`

```sql
  model_schema_version   integer not null default 1
                         check (model_schema_version >= 1),

  unique (firm_slug, version_number),
  unique (firm_slug, id)          -- ← nouvelle : la clé que référence la FK composite
```

`unique (firm_slug, id)` est redondante avec la clé primaire et pourtant
indispensable : sans elle, Postgres ne peut pas exprimer « cette firme pointe
vers **sa** version ».

### Remplacé sur `prop_firms`

```diff
-alter table prop_firms add constraint prop_firms_active_page_version_fk
-  foreign key (active_page_version_id)
-  references firm_page_versions (id)
-  on delete set null;
+alter table prop_firms add constraint prop_firms_active_version_meme_firme_fk
+  foreign key (slug, active_page_version_id)
+  references firm_page_versions (firm_slug, id)
+  on update cascade
+  on delete restrict
+  deferrable initially deferred;
```

Quatre décisions, chacune pour une raison :

- **composite** : une clé sur `active_page_version_id` seul laissait passer FTMO
  pointant vers une version de FuturesElite. La RPC l'empêchait — mais une RPC
  est du code applicatif, et un `UPDATE` direct passait à côté. C'est la base
  qui refuse désormais.
- **MATCH SIMPLE** (le défaut) : quand `active_page_version_id` est `NULL`, la
  contrainte est satisfaite sans vérification. C'est exactement ce qu'il faut,
  `NULL` signifiant « rendu historique ».
- **`on delete restrict`** remplace `on delete set null`, qui était un défaut :
  supprimer une version aurait fait retomber une fiche publiée sur les données
  mutables, en silence. Il faut maintenant la retirer d'abord — une décision,
  pas un effet de bord.
- **`deferrable initially deferred`** : sans cela, renommer un slug serait
  impossible, la cascade vers `firm_page_versions.firm_slug` et la mise à jour
  de `prop_firms.slug` ne pouvant pas être simultanées.

### Remplacé — l'attribution du numéro

```diff
 create or replace function firm_page_versions_number()
 returns trigger language plpgsql as $$
 begin
   if new.version_number is null then
+    perform pg_advisory_xact_lock(hashtext('firm_page_versions:' || new.firm_slug));
+
     select coalesce(max(version_number), 0) + 1
       into new.version_number
       from firm_page_versions
      where firm_slug = new.firm_slug;
   end if;
   return new;
 end $$;
```

Tu avais raison : `max + 1` plus une contrainte unique n'est pas une solution.
Deux transactions lisent `max = 3`, calculent 4, et **l'une des deux publications
échoue** sur un `23505` que l'appelant devrait interpréter et rejouer. La
contrainte protège l'intégrité en cassant une publication valide.

`pg_advisory_xact_lock` sérialise **par firme**, avant la lecture du maximum. La
seconde transaction attend, lit 4, obtient 5 : les deux aboutissent. Le verrou
est transactionnel — relâché au commit ou au rollback, rien à libérer. Publier
FuturesElite n'attend jamais après FTMO ; une collision de `hashtext` ferait
attendre l'une après l'autre, sans conséquence.

La contrainte unique **reste** : le verrou coordonne, la contrainte prouve.

### Requête de contrôle

Attendu : `firm_page_versions | 5 | 3 | 1 | 1 | ok | ok | ok` — cinq index, trois
déclencheurs, la colonne active, la colonne de schéma, la FK composite présente,
l'ancienne FK simple retirée, le verrou en place.

---

## 2. Comportement exact des lecteurs

`readActiveFirmPage` ne rend plus `null` : elle rend un des trois cas. C'était le
défaut que tu as vu — `null` disait à la fois « pas de version » et « version
illisible », et les deux menaient au rendu historique.

| Cas | Condition | Retour | La route fait |
|---|---|---|---|
| **aucune version** | `active_page_version_id` est `NULL` ou absent | `{ kind: 'none' }` | rendu historique **légitime** — aucune requête n'est même émise |
| **version valide** | ligne lue, `published`, `firm_slug` concordant, schéma dans `[1,1]`, JSON avec `identity` | `{ kind: 'ok', version }` | `<FirmPage model={version.model} />`, sans reconstruction |
| **version illisible** | identifiant présent mais un seul des points ci-dessus manque | `{ kind: 'unreadable', cause, firmSlug, versionId, detail }` | `console.error('[publication]', …)` puis `throw PublicationUnavailableError` |

Six causes distinctes, toutes journalisées nommément :

`query_failed` · `version_missing` · `not_published` · `firm_mismatch` ·
`schema_unsupported` · `payload_invalid`

**Pourquoi lever plutôt que 404 ou legacy.** Un 404 serait un soft 404 mis en
cache par l'ISR. Le rendu historique serait un mensonge : la fiche reviendrait
aux données mutables le jour où la couche compte, sans un mot. Lever produit un
500 non mis en cache — le même choix, et pour la même raison, que celui déjà fait
quelques lignes plus haut pour une panne Supabase.

Une réserve que je préfère dire : App Router ne permet pas à un composant serveur
de renvoyer un **503**. Le 500 est ce que la plateforme offre de plus proche.

**Prévisualisation** — mêmes refus que la production, et c'est délibéré :
relire une version que le public refusera validerait une version morte. La route
affiche la cause au lieu de rendre. L'API rend **422**, pas 404 : la ligne
existe, c'est son contenu qui est refusé.

**Résumés** — `readActiveFirmSummaries` rend `{ summaries, unreadable }`. Sans
la seconde liste, l'appelant compléterait ces firmes depuis la donnée vivante en
croyant qu'elles ne sont pas migrées, et le repli silencieux serait revenu par la
porte des listes après avoir été fermé sur la fiche. Une requête en panne déclare
**toutes** les firmes illisibles — elle ne dit pas « aucune migrée », elle ne dit
rien.

### Version de schéma

`lib/publication/schema.ts` : `MODEL_SCHEMA_VERSION = 1` (ce qu'on écrit),
`MIN_SUPPORTED_SCHEMA = 1`, `MAX_SUPPORTED_SCHEMA = 1` (ce qu'on lit).

L'intervalle est **distinct** de la version d'écriture, et c'est ce qui rend la
migration possible sans interruption :

1. `MODEL_SCHEMA_VERSION = 2`, `MAX = 2`, `MIN` reste à 1 — le lecteur accepte
   les deux ;
2. déployer : les versions 1 en ligne continuent d'être servies ;
3. republier chaque firme active, une par une, par l'activation atomique ;
4. vérifier qu'aucune version active ne porte encore le schéma 1 ;
5. **alors seulement** `MIN = 2`, et déployer.

On n'incrémente pas pour un ajout optionnel — le critère n'est pas « le modèle a
changé » mais « une version déjà écrite serait désormais mal lue ». Conséquence
assumée : les versions archivées en schéma 1 deviennent irrestaurables après
l'étape 5. Restaurer un instantané que le rendu ne sait plus interpréter servirait
une page fausse.

---

## 3. La contradiction promotionnelle

Le candidat présentait quinze prix remisés comme acquis alors que
`exact_program_and_size_eligibility_confirmed` vaut **faux**. Tu as raison, et
c'était la contradiction la plus visible du lot.

**Choix retenu : marquer comme estimations.** L'autre option — n'appliquer la
remise qu'aux sélections testées — donnerait zéro sélection : aucune n'est
confirmée.

Un prix n'est garanti que si **deux** choses sont établies pour cette sélection :
`scope_confidence = 'universal_verified'` **et** `checkout_verified = true`. Les
deux colonnes disent des choses différentes, et il faut les deux.

```json
"futures|elite||25000": { "list": 95, "final": 66.5, "estimated": true }
```

Le drapeau est porté par la **ligne**, pas par l'offre : la portée peut être
confirmée sur un plan et pas sur un autre. `offer.priceBasis` résume —
`verified` / `estimated` / `mixed`. Ici : `estimated`, 15 sur 15.

**Le rendu suit.** Un prix estimé ne se met plus en forme comme un prix acquis :
le tarif barré à côté d'un montant net dit « voici ce que vous paierez ». Le
tarif public reste affiché — il est certain, lui —, le montant remisé devient

> **$95** · ≈ $66.50 with SCANNED — estimate, verify at checkout

La mention :

> Code SCANNED is reported to work; eligibility per program and size is not
> confirmed. **Discounted figures on this page are estimates** — check the total
> at checkout.

**Trois nouvelles erreurs bloquantes** (`PROMO_PRICE_NOT_GUARANTEED`) : un prix
non marqué sous portée non confirmée ; un `priceBasis` qui contredit ses lignes ;
une mention muette sur l'estimation. L'interdiction de « all programs », « best
deal », « lowest price » reste en place.

SCANNED reste **30 %**, `unconfirmed`, expiration inconnue. Rien de cela n'a été
« corrigé » — c'est la donnée, et c'est la page qui s'y conforme.

---

## 4. Le point 6, conservé

`summaryFromPageModel` : une offre de portée `unconfirmed` n'apparaît pas sur les
cartes ni sur `/compare`. Le code reste sur la fiche complète avec sa réserve ;
une carte n'a pas la place de la porter, donc elle n'annonce rien.

Candidat : fiche `SCANNED`, carte `null`. Testé dans les deux sens.

---

## 5. Les tests

```
npm run publication:candidate    35 assertions vertes, 0 erreur de validation
npm run test:readers             35 assertions vertes
npm run test:capabilities        61 assertions vertes
npm run model:report             54 assertions vertes
npm run validator:regressions    14 assertions vertes
npm run test:programs           152 assertions vertes
npx tsc --noEmit                 propre, hors les deux erreurs vitest documentées
```

`database/TEST-rollback-versions.sql` — 20 contrôles, exécutable, auto-vérifiant,
et il crée puis supprime **deux** firmes jetables.

### Les six preuves exigées

| Exigence | Où | Comment |
|---|---|---|
| une version active illisible ne déclenche **jamais** le legacy | `test:readers`, cas 3 | neuf situations d'échec ; aucune ne rend `none` ; la route est relue pour vérifier qu'elle lève |
| une version d'une **autre firme** ne peut pas être activée | `test:readers` cas 3 et 5 ; `TEST-rollback` 11–12 | `UPDATE` direct + `set constraints all immediate` → refus par la base ; l'état actif reste intact |
| une version de **schéma inconnu** est refusée | `test:readers` cas 3 et 5 ; candidat ; `TEST-rollback` 13–14 | schéma 2, absent, `null`, `'1'`, `1.5`, `0` |
| deux publications **concurrentes** n'ont pas le même numéro | `TEST-rollback` 15–17 | le verrou précède la lecture du maximum ; 21 numéros distincts et contigus ; un doublon imposé est refusé |
| une promotion `unconfirmed` ne devient pas **implicitement universelle** | candidat | 15/15 estimées ; `priceBasis` ; mention ; aucun « all programs » ; **deux falsifications délibérées** vérifient que le validateur bloque |
| un rollback restaure **exactement** le snapshot | `TEST-rollback` 8–9 | `to_jsonb` de la ligne entière, capturé avant archivage, comparé après restauration — et la diff nomme le champ fautif |

### Ce que je ne peux pas prouver, et je préfère le dire

Deux sessions Postgres simultanées ne sont pas simulables depuis un script SQL :
il faudrait `dblink` ou `pg_background`, absents d'une base Supabase par défaut.
Le test prouve ce dont dépend la correction — le verrou est posé **avant** la
lecture du maximum, la numérotation est contiguë, un doublon imposé est rejeté —
mais il n'exerce pas la course elle-même.

Le test 9 de la version précédente comparait trois champs choisis à la main.
Il laissait passer ce que j'avais oublié de comparer. Il compare maintenant la
ligne entière, hors statut et horodatages de cycle de vie.

---

## 6. Nouveau candidat FuturesElite

`database/futureselite-version-1.json`, produit par `npm run publication:candidate`.

```
empreinte des sources      sha256:619df46ff9217fc5f81b50c1398237fd2ee7b8ebee288911139a85f39830123a
schéma de modèle           1 (lu de 1 à 1)
vérifiée le                2026-09-07
marché                     futures
programmes                   4
sélections commerciales     15
lignes de phase             27
plateformes sélectionnables  6
faits de firme               2   (écartés : 3)
règles critiques             9
code promo                   SCANNED (portée : unconfirmed)
base des prix remisés        estimated (15 estimations sur 15)
lien sortant                 /api/go/futureselite?placement=hero&locale=en
```

Résumé figé : futures · 95–569 USD · 80–90 % · 6 plateformes · **aucune offre sur
carte**.

L'empreinte est inchangée — normal, et c'est une bonne nouvelle : aucune donnée
source n'a bougé. Seule la façon de les présenter a changé.

---

## 7. Rapport de validation

**0 erreur bloquante. Publiable : oui.** 8 avertissements, 3 remarques.

| Code | Champ | Niveau |
|---|---|---|
| `PROMO_SCOPE_UNCONFIRMED` | `offer.scopeConfidence` | avertissement |
| `PROMO_EXPIRY_UNKNOWN` | `offer.expiryUnknown` | avertissement |
| `SOURCE_CONFLICT_OPEN` ×6 | Scalping · News trading, funded · Prime 150K maximum loss · Instant 25K availability · Nitro funded accounts · Prime evaluation length | avertissement |
| `FACT_REJECTED` ×3 | `firmFacts` | remarque |

`PROMO_PRICE_NOT_GUARANTEED` **n'apparaît pas** — parce que les quinze prix sont
correctement marqués. Deux falsifications délibérées, dans le script, vérifient
qu'il apparaîtrait sinon.

---

## 8. Ordre final d'exécution

| # | Action | Fichier / commande | Attendu | Retour arrière |
|---|---|---|---|---|
| 0 | diagnostic | `PREFLIGHT-futureselite.sql` | 18 colonnes | — |
| 1 | sauvegarde | `RUN-00-sauvegarde-avant-migration.sql` | 9 tables | `drop table fe_sauv_*` |
| 2–9 | les données | manifeste, étapes 2 à 9 | postflight vert | `ROLLBACK-futureselite.sql` |
| 10 | vérifier | `POSTFLIGHT-futureselite.sql`, 3 blocs | `v01`–`v12` ok | — |
| **11** | **la couche** | **`RUN-05-firm-page-versions.sql`** | `firm_page_versions \| 5 \| 3 \| 1 \| 1 \| ok \| ok \| ok` | pied du fichier |
| **12** | **prouver** | **`TEST-rollback-versions.sql`** | **20 lignes `ok`** | rien à défaire |
| 13 | variable Vercel | `PUBLICATION_SECRET` | — | — |
| 14 | déployer | GitHub Desktop | — | version précédente |
| 15 | préparer | `POST /api/publication` `{"action":"stage","slug":"futureselite"}` | version 1 `validated` | invisible |
| 16 | relire | `/en/prop-firm/futureselite/preview` | bandeau rouge, schéma 1 | — |
| 17 | **publier** | `{"action":"publish","acceptWarnings":true}` | `step: 10-activation` | étape 18 |
| 18 | *si besoin* | `{"action":"deactivate"}` | rendu historique | — |

**L'étape 11 doit passer avant l'étape 14.** Le code déployé lit
`model_schema_version` et la contrainte composite ; déployer avant créerait une
fenêtre où chaque fiche migrée serait `unreadable`, donc en 500. Dans l'état
actuel aucune firme n'a de version active, donc la fenêtre serait vide — mais
compter là-dessus serait fragile.

**L'étape 14 reste sans effet visible** : sans version active, les 350 fiches
empruntent le chemin historique. Le premier changement visible est l'étape 17, et
il se défait par l'étape 18 — `select deactivate_firm_version('futureselite');`,
sans déploiement. C'est le **seul** moyen autorisé : un `UPDATE` qui mettrait
`active_page_version_id` à `NULL` laisserait la version au statut `published`,
elle occuperait la place unique de l'index partiel, et la publication suivante
échouerait sur une violation d'unicité.

`acceptWarnings` est nécessaire à l'étape 17 : les huit avertissements sont réels
et assumés. Sans lui, la publication est refusée, et c'est voulu.

---

## Ce que je n'ai pas fait

Aucun SQL exécuté, aucun déploiement. FTMO et The5ers intouchés — ni données, ni
contenu éditorial, ni statut. Aucune colonne dépréciée. `/compare` n'est pas
basculé. La page n'a pas été redessinée : seul le bloc de prix change de forme,
et parce que sa forme précédente affirmait quelque chose de faux.
