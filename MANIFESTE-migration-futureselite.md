# Manifeste de migration FuturesElite — séquence unique et faisant autorité

9 septembre 2026. **Aucun SQL exécuté. Aucun déploiement.**

Ce document remplace toutes les listes d'exécution antérieures.

---

## Le principe : ne rien supposer

Tu as raison de ne pas présumer que `RUN-futureselite-programs.sql` ou
`RUN-futureselite.sql` ont été passés. Ils ont été **régénérés sept fois** cette
semaine, et rien dans le dépôt ne dit quelle version est en base.

`database/PREFLIGHT-futureselite.sql` répond à la question au lieu de la
supposer. Une seule requête en lecture seule, dix-huit colonnes : cinq pour le
schéma, six pour les données, six pour les textes périmés, une pour la
sauvegarde.

**Six textes servent de preuve d'exécution.** Ils n'existent que dans
l'ancienne version des fichiers :

| Colonne | Texte cherché | `PERIME` signifie |
|---|---|---|
| `t1_plafond_nitro` | `maximum 3 Nitro` | `RUN-futureselite-programs.sql` non passé |
| `t2_drawdown_groupe` | `End-of-day drawdown on Elite, Nitro and Instant` | `RUN-futureselite.sql` non passé |
| `t3_verdict` | `An evaluation with no daily loss limit` | idem |
| `t4_sept_plateformes` | `seven platforms` | idem |
| `t5_90_pour_les_quatre` | `all four settle at a 90%` | idem |
| `t6_grilles_non_publiques` | `price lists are not public` | idem |

C'est plus fiable qu'un journal de migration : la donnée elle-même dit ce
qu'elle contient.

---

## Manifeste d'exécution

Dans cet ordre exact. `RUN-03` reste le **dernier** avant déploiement.

| # | Fichier | Tables et colonnes | Déjà exécuté ? | Preuve | Attendu | Retour arrière |
|---|---|---|---|---|---|---|
| 0 | `PREFLIGHT-futureselite.sql` | — lecture seule | s/o | — | 18 colonnes de diagnostic | s/o |
| 1 | `RUN-00-sauvegarde-avant-migration.sql` | crée 9 tables `fe_sauv_20260908_*` | **à vérifier** | `z1_sauvegarde` = `presente` | 9 lignes de compteurs | `drop table fe_sauv_20260908_*` |
| 2 | `RUN-program-schema.sql` | crée les 7 tables | **à vérifier** | `s1_tables_programmes` = `ok` | 7 tables | additif, ne rien défaire |
| 3 | `RUN-program-schema-v2.sql` | `firm_programs.market`, `.status`, `firm_program_plans.variant_key`, `.currency` | **à vérifier** | `s2_schema_v2` = `ok` | `firm_rules_severity_check` | additif |
| 4 | `RUN-futureselite-programs.sql` | 7 `delete`+`insert` : 4 programmes, 27 plans, 16 promotions, 25 bundles, 8 plateformes, 33 règles, 5 paliers live. Ajoute défensivement `scope_confidence` | **probablement partiel** | `d1_marche` = `futures`, `d5_remise_partenaire` = `0.30`, `t1` = `ok` | voir postflight | `ROLLBACK-futureselite.sql` |
| 5 | `RUN-futureselite.sql` | `update prop_firms` 37 colonnes + 4 `prop_firm_challenges` | **probablement non** | `t2` à `t6` = `ok`, `c1_split_de_base` = 80 | voir postflight | `ROLLBACK-futureselite.sql` |
| 6 | `RUN-04-promotion-scope-confidence.sql` | ajoute `firm_promotions.scope_confidence` + classe les lignes | non | `s4_confiance_portee` = `ok` | SCANNED `unconfirmed`, 15 SUMMER `restricted` | `drop column scope_confidence` |
| 7 | `RUN-01-firm-payment-methods.sql` | crée `firm_payment_methods` | non | `s3_moyens_paiement` = `ok` | table, 1 FK, 4 index | `drop table firm_payment_methods` |
| 8 | `RUN-02-futureselite-payments.sql` | 3 lignes `payout` | non | `v10` du postflight | 3 lignes, aucune `purchase` | `delete … where firm_slug = 'futureselite'` |
| 9 | `RUN-03-page-model-status.sql` | ajoute `prop_firms.page_model_status`, met FuturesElite à `active` | non | `s5_statut_de_page` = `ok` | `legacy` 349, `active` 1 | `update … set page_model_status = 'legacy'` |
| 10 | `POSTFLIGHT-futureselite.sql` | — lecture seule | s/o | — | `v01` à `v12` tous `ok` | s/o |
| 11 | **Déploiement du code** | — | — | — | — | retirer `active` |

### Fichiers écartés

`RUN-futureselite-correctif-market.sql`, `RUN-futureselite-correctif-4.sql` et
`RUN-futureselite-trustpilot.sql` étaient des rustines ciblées, écrites quand
on ignorait si les fichiers complets étaient passés. **Ils sont désormais
inutiles** : les étapes 4 et 5 contiennent leurs corrections. Les passer ne
casserait rien — ils sont idempotents — mais ils ne servent plus à rien.

Ne pas les jouer évite de se demander plus tard lequel faisait autorité.

### Si le préflight dit qu'une étape est déjà faite

Toutes les migrations sont idempotentes : les rejouer redonne le même état.
L'étape 1 est la seule exception — **ne pas rejouer la sauvegarde** après une
migration, elle sauvegarderait l'état corrigé et détruirait le point de retour.

---

## Le postflight

`database/POSTFLIGHT-futureselite.sql`. **Trois blocs**, à passer un par un.

Il était d'abord écrit en une seule requête, et cela le rendait fragile :
Postgres résout les noms de colonnes et de tables à l'**analyse**, avant
d'exécuter quoi que ce soit. Une seule référence manquante — `scope_confidence`
tant que `RUN-04` n'est pas passé — faisait échouer la requête entière, et les
onze autres contrôles ne disaient plus rien.

Or lancer la vérification trop tôt est un geste naturel. Une vérification qui
s'effondre au lieu de rapporter est une mauvaise vérification.

- **Bloc 1** — prérequis. Ne lit que le catalogue système, fonctionne sur une
  base vierge, et nomme le fichier manquant.
- **Bloc 2** — les onze contrôles de données. Les colonnes optionnelles sont
  lues par `to_jsonb(...) ->> 'colonne'`, qui rend `NULL` pour une clé absente
  au lieu de lever une erreur.
- **Bloc 3** — les moyens de paiement, isolés parce qu'une **table** absente ne
  se contourne pas comme une colonne.

Les douze contrôles :

    v01_4_programmes            4 programmes
    v02_15_selections           15 SELECTIONS COMMERCIALES (pas 27 phases)
    v03_27_phases               27 lignes de phase
    v04_marche_futures          market = futures ET is_futures = true
    v05_six_plateformes         6 selectionnables
    v06_instant_80              Instant a 0.8 sur ses 3 tailles
    v07_autres_90               Elite, Nitro, Prime a 0.9
    v08_aucune_generalisation   aucune affirmation de firme sur perte/drawdown
    v09_nitro_non_resolu        max_funded_accounts NULL, conflit conserve
    v10_paiements_normalises    firm_payment_methods renseignee
    v11_statut_actif            page_model_status = active
    v12_entrees_validateur      SCANNED 30 % unconfirmed, levier NULL,
                                cost_timeline NULL, split de base 80

### Ce que le SQL ne peut pas prouver

`validateFirmPageModel` s'exécute sur le **modèle**, pas sur la base : il lit
des textes éditoriaux et les confronte aux données. `v12` vérifie ses entrées,
pas son verdict.

Le verdict se prend en local, après migration :

    npm run model:report        doit finir « 0 erreur(s) »
    npm run test:capabilities   54 assertions vertes

Les deux lisent les mêmes fixtures que le SQL généré : un écart entre base et
fixtures apparaîtrait dans `v01` à `v12`.

---

## Portée de promotion — l'inconnu cesse de valoir universel

### Audit préalable, comme demandé

`firm_promotions` porte quinze colonnes plus cinq ajoutées en v2. **Aucune ne
peut exprimer la confiance de portée** :

- `verified_at` dit **quand** la ligne a été relevée, pas ce qui a été établi ;
- `checkout_verified` dit si le **tunnel de paiement** a été testé — autre
  question ;
- les quatre colonnes de portée disent **quelle** est la restriction, pas si
  son absence a été vérifiée.

Le plus petit ajout possible est donc une colonne : `RUN-04`.

    scope_confidence text not null default 'unconfirmed'
      check (scope_confidence in ('universal_verified', 'restricted', 'unconfirmed'))

Le défaut est `unconfirmed` **délibérément** : une ligne déjà en base ne doit
pas se mettre à revendiquer une universalité que personne n'a vérifiée.

### Les trois états

| État | Signification | FuturesElite |
|---|---|---|
| `universal_verified` | l'absence de restriction est confirmée par la source | aucune |
| `restricted` | la portée est bornée par un champ explicite | 15 lignes SUMMER |
| `unconfirmed` | la portée n'est pas établie | **SCANNED** |

SCANNED est `unconfirmed` parce que ton relevé du 7 septembre est explicite :
`exact_program_and_size_eligibility_confirmed` vaut **faux**, et
`expiry_confirmed` aussi.

### Ce que le modèle fait de cet état

Le code reste **affiché** — il est réel et rapporté. Mais :

- `offer.scopeConfidence` porte l'état, et `offer.expiryUnknown` la date ;
- la mention change : *« Code SCANNED is reported to work; eligibility per
  program and size is not confirmed. Check the total at checkout. »* ;
- `PROMO_SCOPE_UNCONFIRMED` et `PROMO_EXPIRY_UNKNOWN` sont émis en
  avertissement — visibles, non bloquants ;
- toute formulation du type *applies to all programs*, *best deal* ou *lowest
  price* devient une **erreur bloquante** tant que la portée n'est pas
  `universal_verified`.

Quand plusieurs plans donnent des confiances différentes, **la plus faible
l'emporte** : une offre n'est confirmée que si elle l'est partout.

---

## Rapport de mode ombre

La section finale ne dit plus « capacités à couvrir » : elle porte un tableau
d'état à sept colonnes — capacité, implémentée, testée, validée sur chacune des
trois firmes, reste à faire. Les huit capacités sont marquées implémentées et
testées.

Le tableau des sélections commerciales porte désormais une colonne
**confiance de portée** par sélection, et la provenance de chaque offre est
listée sous le tableau.

Ce qui reste ouvert pour FTMO et The5ers y est nommé pour ce que c'est : du
**contenu éditorial**, pas une capacité manquante.

---

## Vérifications

    npm run test:capabilities      54 assertions, toutes vertes
    npm run validator:regressions  14 assertions, toutes vertes
    npm run model:report           54 assertions, toutes vertes
    npm run test:programs         152 assertions, toutes vertes
    npx tsc --noEmit              propre, hors les deux erreurs vitest documentées
    npm run build                 ✓ Compiled successfully, puis l'échec d'environnement connu

FuturesElite reste à **zéro erreur bloquante**, avec deux nouveaux
avertissements — portée et expiration de SCANNED — qui sont exactement ce que
tu demandais de rendre visible.

FTMO et The5ers restent `legacy`. Leur contenu éditorial n'a pas été touché.

---

## Ce que j'attends

1. le manifeste et son ordre ;
2. l'écartement des trois rustines ;
3. `scope_confidence` comme plus petit ajout possible ;
4. `PROMO_SCOPE_UNCONFIRMED` en avertissement plutôt qu'en erreur — l'offre
   reste affichable, elle ne revendique simplement plus rien.

Rien ne sera exécuté ni déployé avant ta réponse.
