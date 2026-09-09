# Couche de publication immuable — les onze livrables

9 septembre 2026. **Aucun SQL exécuté. Aucun déploiement. FTMO et The5ers
intouchés.**

Ce document remplace le manifeste de migration comme séquence faisant autorité.
Le manifeste reste valable pour ce qu'il décrit — remplir les tables — mais il
ne suffisait pas : il menait à une fiche *validée à un instant*, pas à une fiche
*qui reste validée*.

---

## Le problème, énoncé une fois

Les pages publiques lisent des données vivantes. Une fiche validée lundi
régresse mercredi dès qu'une ligne change, sans que personne n'ait publié quoi
que ce soit.

Six corrections cette semaine l'ont montré : un chiffre corrigé dans une
colonne, un texte éditorial resté en arrière, et la page servait les deux. À
chaque fois j'ai corrigé le champ. À chaque fois le suivant est revenu.

`page_model_status = 'active'` ne réglait rien, et c'est important de le dire
franchement : **c'est une colonne mutable**. La mettre à `active` n'affirmait
rien sur ce que la page servirait à la requête suivante, puisque le modèle était
reconstruit à chaque fois depuis huit tables vivantes.

La chaîne devient :

```
donnée canonique modifiable
  → FirmPageModel
  → FirmSummaryModel
  → validation
  → version immuable
  → activation atomique
  → rendu public
```

Aucune autre porte.

---

## 1. Migration de schéma — `database/RUN-05-firm-page-versions.sql`

Additif. Une table, une colonne, trois déclencheurs, quatre index, une politique
RLS, trois fonctions.

| Colonne | Rôle |
|---|---|
| `id` | uuid |
| `firm_slug` | FK vers `prop_firms.slug`, `on update cascade on delete cascade` |
| `version_number` | attribué **par la base**, croissant par firme |
| `page_model_json` | ce que la fiche rend |
| `summary_model_json` | ce que `/compare` et les cartes rendent |
| `validation_report_json` | le verdict au moment de la création, conservé |
| `source_hash` | empreinte déterministe des données sources |
| `verified_at` | date de vérification éditoriale |
| `created_at`, `created_by` | qui a publié, et quand |
| `status` | `draft` \| `validated` \| `published` \| `archived` |
| `published_at`, `archived_at` | |

Contrainte d'unicité `(firm_slug, version_number)`.

**`prop_firms.active_page_version_id`** est la seule colonne qui décide de ce
que le public voit. Elle est distincte de `listing_status` (référencement) et de
`page_model_status` (métadonnée de migration). `on delete set null` : supprimer
une version ne casse jamais la ligne de firme, la fiche retombe sur le rendu
historique.

Le numéro est attribué par déclencheur plutôt que par l'appelant : deux
publications simultanées ne peuvent pas se donner le même numéro.

RLS : `lecture_publiee` ne laisse sortir que `status = 'published'`. Un
brouillon est invisible du client anonyme, quel que soit le code applicatif.

---

## 2. Transaction de publication — `lib/publication/publish.ts`

`publishFirmVersion(supabase, slug, actor, options)`. Dix étapes.

| # | Étape | Échec |
|---|---|---|
| 1 | lire `prop_firms` en `select('*')` | firme introuvable |
| 2 | lire les programmes normalisés | aucun programme |
| 3 | calculer l'empreinte des **sources** | — |
| 4 | construire le `FirmPageModel` | exception du constructeur |
| 5 | construire le lien sortant `/api/go/` | — |
| 6 | construire le `FirmSummaryModel` **depuis le modèle** | — |
| 7 | valider, CTA compris | — |
| 8 | refuser si erreur, ou si avertissement non assumé | **bloque** |
| 9 | écrire la version en `validated` | erreur d'insertion |
| 10 | activer atomiquement (RPC) | la version active **ne change pas** |

Le partage des rôles est net, et c'est ce qui rend la garantie tenable :

- **TypeScript** construit et valide — Postgres ne sait pas le faire ;
- **Postgres** bascule — le client Supabase ne sait pas ouvrir de transaction,
  et l'activation touche deux tables.

Tout ce qui peut échouer se produit **avant** l'appel à la fonction, et cet
appel est la dernière étape. C'est la traduction directe de « ne jamais changer
la version active si une étape échoue ».

`acceptWarnings` ne porte que sur les avertissements. **Aucune dérogation sur
les erreurs** : en ouvrir une viderait la couche de son seul intérêt.

`dryRun` construit et valide sans rien écrire. `stageOnly` écrit sans activer.

---

## 3. Règles d'immuabilité

Appliquées par déclencheur, pas par convention.

**Le contenu d'une version `published` ou `archived` ne change plus.**
`page_model_json`, `summary_model_json`, `validation_report_json`,
`source_hash`, `firm_slug` et `version_number` sont figés. Toute tentative lève.

**Les transitions permises :**

```
draft → validated → published ⇄ archived
```

Rien ne redevient `draft` ni `validated` après publication : ce serait rouvrir à
l'édition un contenu déjà servi.

`archived → published` **est** permis, et c'est délibéré : c'est le retour en
arrière. Une version archivée a été validée, son rapport est figé avec elle,
donc la restaurer ne revalide rien. Le contenu, lui, reste intouché — c'est le
déclencheur qui le garantit, pas la fonction qui l'appelle.

**Une version publiée ne se supprime pas**, elle s'archive. Sans ce verrou,
`active_page_version_id` deviendrait `null` en silence et la fiche basculerait
sur le rendu historique sans que personne ne l'ait décidé.

> Une première version du fichier désarmait le déclencheur le temps du retour en
> arrière, par `session_replication_role`. C'était doublement mauvais : Supabase
> ne donne pas le superutilisateur que cela demande, et un verrou qu'on désarme
> pour ses propres besoins n'est plus un verrou. La transition est donc
> autorisée franchement, et le contenu reste protégé dans tous les cas.

---

## 4. Lecteur de fiche — `lib/publication/read.ts`

`readActiveFirmPage(supabase, firm)` lit `page_model_json` **tel quel**.

Aucun appel à `buildFirmPageModel`. C'est le point entier : reconstruire à
chaque requête, c'est relire la donnée vivante, et donc pouvoir régresser entre
deux visites.

La requête part de `prop_firms.active_page_version_id`, **pas** de « la dernière
ligne `published` ». Ce n'est pas équivalent : la colonne décide, le statut
décrit. Chercher la plus récente ferait basculer la fiche sur une version que
personne n'a activée — exactement le comportement dont on sort.

Une erreur de lecture rend `null`, donc rendu historique. Servir la page
complète d'hier vaut mieux qu'un 500.

`app/[locale]/prop-firm/[slug]/page.tsx` : `servieParLeModele` a disparu,
`buildFirmPageModel` n'y est plus importé.

---

## 5. Lecteur de résumés

`readActiveFirmSummaries(supabase, slugs)` rend une `Map` des résumés figés,
en une requête, par jointure sur `active_page_version_id`.

**Préparé, non branché.** Aucune route ne l'appelle : basculer `/compare` d'un
bloc demanderait de publier 350 versions le même jour. Les deux chemins
coexistent, l'appelant complétera avec `buildFirmSummaryModel` pour les firmes
sans version.

`summaryFromPageModel(model, ctaHref)` a été ajouté à `lib/firm-summary-model.ts` :
le résumé est dérivé du **modèle figé**, dans le même geste que la fiche. Une
carte et une fiche ne peuvent donc plus annoncer deux prix différents.

Deux décisions y méritent d'être relues :

- la fourchette retient la **devise majoritaire** — la fiche garde les devises
  séparées, mais une carte n'a qu'une ligne, et « 95–1 100 » en mélangeant USD
  et EUR serait faux ;
- une offre de portée `unconfirmed` **n'apparaît pas** sur la carte. Le code
  reste sur la fiche avec sa réserve ; une carte n'a pas la place de la porter,
  donc elle n'annonce rien. C'est pourquoi le candidat FuturesElite montre
  « offre sur carte : aucune » alors que SCANNED est bien sur la fiche.

---

## 6. Prévisualisation

Deux surfaces, trois verrous indépendants.

- `GET /api/publication?slug=…&version=…` — le JSON d'une version, publiée ou
  non. `Bearer PUBLICATION_SECRET`.
- `/[locale]/prop-firm/[slug]/preview` — la version rendue par le **composant
  réel**, avec un bandeau rouge non dissimulable. Relire un JSON ne dit pas si
  la page tient debout.

Les verrous :

1. `notFound()` sans cookie `publication_preview` valide — la route se comporte
   comme si elle n'existait pas, plutôt que d'annoncer un 401 qui la désigne ;
2. `readDraftFirmPage` refuse un client qui n'est pas de service ;
3. la politique RLS ne laisse sortir que `published`.

Le premier suffirait la plupart des jours. Les trois existent parce qu'un
brouillon servi à un visiteur serait précisément la régression que cette couche
doit rendre impossible — et parce qu'une politique RLS se modifie un jour
d'urgence.

`noStore()` : aucune mise en cache. Une version relue est par définition en
mouvement, et l'ISR servirait une copie périmée — ce qui a fait chercher trois
bugs inexistants la semaine dernière.

**Un secret absent refuse tout.** L'inverse transformerait un oubli de
configuration en porte ouverte.

---

## 7. FuturesElite version 1 — `database/futureselite-version-1.json`

Produit par `npm run publication:candidate`, à partir des mêmes fonctions que la
transaction et des mêmes fixtures que le SQL. **Pas écrit à la main** : un
candidat rédigé à la main serait une quatrième source de vérité.

```
empreinte des sources      sha256:619df46ff9217fc5f81b50c1398237fd2ee7b8ebee288911139a85f39830123a
vérifiée le                2026-09-07
marché                     futures
programmes                   4
sélections commerciales     15
lignes de phase             27
plateformes sélectionnables  6
faits de firme               2   (écartés : 3)
règles critiques             9
code promo                   SCANNED (portée : unconfirmed)
lien sortant                 /api/go/futureselite?placement=hero&locale=en
```

Résumé figé : futures · 95–569 USD · 80–90 % · 6 plateformes · aucune offre sur
carte.

Tout ce que le brief exigeait est vérifié par assertion, pas par relecture :
marché futures sans mélange, 4 programmes, 15 sélections, 27 phases, six
plateformes, Instant à 80 %, Elite/Nitro/Prime à 90 %, plafond Nitro non résolu,
SCANNED à 30 % avec ses limites de vérification conservées, aucune
généralisation sur le drawdown, CTA tracké.

**24 assertions vertes, 0 en échec.**

---

## 8. Rapport de validation

Figé dans la version, conservé tel quel — donc lisible dans deux ans.

**0 erreur bloquante. Publiable : oui.**

8 avertissements :

| Code | Champ |
|---|---|
| `PROMO_SCOPE_UNCONFIRMED` | `offer.scopeConfidence` |
| `PROMO_EXPIRY_UNKNOWN` | `offer.expiryUnknown` |
| `SOURCE_CONFLICT_OPEN` ×6 | Scalping · News trading, funded · Prime 150K maximum loss · Instant 25K availability · Nitro funded accounts · Prime evaluation length |

3 remarques `FACT_REJECTED` : trois faits de firme écartés faute d'être vrais
pour **tous** les programmes achetables. La bande courte est explicable, chaque
rejet porte sa raison.

Ces huit avertissements sont exactement ce que tu demandais de rendre visible.
Publier les assume explicitement (`acceptWarnings`), et le rapport garde la
trace de cette décision.

---

## 9. Empreinte des sources — `lib/publication/source-hash.ts`

`sha256` sur une forme canonique des **entrées**, pas du modèle. Hacher le
modèle ne dirait rien : une évolution du constructeur changerait l'empreinte
sans qu'aucune donnée ait bougé.

Trois sources de bruit neutralisées : ordre des clés (tri récursif), ordre des
lignes (tri par identité naturelle), colonnes de tenue de registre et UUID
(`updated_at`, `id`, `program_id`… exclus — les UUID sont régénérés à chaque
`delete` + `insert`, donc rejouer une migration produirait une dérive fantôme).

`data_verified_at` et `verified_at` ne sont **pas** exclus : une date de
vérification est un fait éditorial, sa modification doit produire une nouvelle
version.

> Le premier tri était incomplet et le test l'a attrapé. Les 25 lignes de
> `firm_program_bundles` ne portent que `program_slug` parmi les clés naturelles
> connues : cinq se retrouvaient ex æquo, et un tri stable leur laissait l'ordre
> d'arrivée. Deux lectures de la même table dans un ordre différent donnaient
> deux empreintes. Le tri est maintenant **total**, départagé par la
> sérialisation canonique de la ligne — ce qui couvre aussi les tables ajoutées
> plus tard.

L'ordre des tableaux de scalaires (`pros`, `cons`, liste de plateformes) **est**
significatif : il se voit sur la page, donc le modifier doit produire une
nouvelle version. Les deux comportements sont testés.

`hasDrifted(version, hashActuel)` ne bloque rien et ne déclenche rien : une
dérive est normale, c'est le travail éditorial en cours. Elle signale seulement
qu'une republication ferait une différence — l'information qui manquait.

---

## 10. Test de retour en arrière — `database/TEST-rollback-versions.sql`

Exécutable, auto-vérifiant, et il ne laisse rien : il crée sa propre firme
jetable `__test_publication__` et la supprime à la fin. Rien d'autre n'est
touché.

L'INSERT est composé dynamiquement depuis `information_schema` : `prop_firms`
porte 113 colonnes et deviner lesquelles sont `NOT NULL` sans défaut produirait
un `23502` au lieu d'un test.

Treize contrôles, chacun **rapportant** son verdict au lieu de lever — la leçon
du postflight qui s'effondrait sur une seule colonne absente :

1. un brouillon ne peut pas être publié
2. une version validée devient la version servie
3. le contenu publié est immuable
4. une version publiée ne redevient pas modifiable
5. une version publiée ne se supprime pas
6. la numérotation est automatique et croissante
7. publier une v2 archive la v1 sans la détruire
8. **le retour en arrière restaure la v1**
9. la v1 restaurée a exactement son contenu d'origine
10. revenir à la version déjà active est refusé
11. le retrait ramène la fiche au rendu historique
12. les deux versions survivent au retrait
13. nettoyage : la firme de test a disparu

`activateFirmVersion(supabase, firmSlug, versionNumber)` côté TypeScript appelle
`rollback_firm_version`. Aucune revalidation, par construction.

---

## 11. Ordre exact d'exécution et de déploiement

`RUN-05` est **additif et indépendant** : il ne touche aucune table existante
sauf pour ajouter une colonne. Il peut passer avant que les données de
FuturesElite soient complètes.

| # | Action | Fichier | Attendu | Retour arrière |
|---|---|---|---|---|
| 0 | diagnostic | `PREFLIGHT-futureselite.sql` | 18 colonnes | — |
| 1 | sauvegarde | `RUN-00-sauvegarde-avant-migration.sql` | 9 tables | `drop table fe_sauv_*` |
| 2–9 | les données | manifeste de migration, étapes 2 à 9 | postflight vert | `ROLLBACK-futureselite.sql` |
| 10 | vérifier | `POSTFLIGHT-futureselite.sql`, 3 blocs | `v01`–`v12` ok | — |
| **11** | **la couche** | **`RUN-05-firm-page-versions.sql`** | `firm_page_versions \| 4 \| 3 \| 1` | voir en pied du fichier |
| **12** | **prouver** | **`TEST-rollback-versions.sql`** | **13 lignes `ok`** | rien à défaire |
| 13 | variables Vercel | `PUBLICATION_SECRET` | — | — |
| 14 | déployer le code | GitHub Desktop | — | version précédente |
| 15 | préparer la v1 | `POST /api/publication` `{"action":"stage"}` | version 1 `validated` | invisible |
| 16 | relire | `/en/prop-firm/futureselite/preview` | bandeau rouge | — |
| 17 | **publier** | `{"action":"publish","acceptWarnings":true}` | `step: 10-activation` | étape 18 |
| 18 | *si besoin* | `{"action":"deactivate"}` | rendu historique | — |

**L'étape 14 est sans effet visible.** Sans version active, les 350 fiches
empruntent le chemin historique, inchangé. Le premier changement visible est
l'étape 17, et il se défait par l'étape 18 — `select
deactivate_firm_version('futureselite');`, sans déploiement. C'est le **seul**
moyen autorisé : un `UPDATE` qui mettrait `active_page_version_id` à `NULL`
laisserait la version au statut `published` et bloquerait la publication
suivante.

`acceptWarnings` est nécessaire à l'étape 17 : les huit avertissements du §8
sont réels et assumés. Sans lui, la publication est refusée — c'est voulu.

### Vérifications passées

```
npm run publication:candidate    24 assertions vertes, 0 erreur de validation
npm run model:report             54 assertions vertes
npm run test:capabilities        54 assertions vertes
npm run validator:regressions    14 assertions vertes
npm run test:programs           152 assertions vertes
npx tsc --noEmit                 propre, hors les deux erreurs vitest documentées
```

---

## Ce que je n'ai pas fait

- aucun SQL exécuté, aucun déploiement ;
- FTMO et The5ers intouchés — ni données, ni contenu éditorial, ni statut ;
- aucune redéfinition de la page ;
- aucune colonne dépréciée : `page_model_status` reste en base comme métadonnée
  de migration, elle n'autorise simplement plus rien seule ;
- `/compare` n'est pas basculé — le lecteur de résumés existe, aucune route ne
  l'appelle.

## Ce sur quoi j'attends ta réponse

1. le candidat version 1 et ses 24 assertions ;
2. les huit avertissements assumés plutôt que corrigés avant publication ;
3. l'ordre des étapes 11 à 17, et notamment `RUN-05` **après** le postflight ;
4. le choix de masquer une offre `unconfirmed` sur les cartes tout en la gardant
   sur la fiche.

Rien ne sera exécuté ni déployé avant.
