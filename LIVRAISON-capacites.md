# Livraison — les huit capacités génériques

8 septembre 2026. **Aucun SQL exécuté. Aucun déploiement. FTMO et The5ers
restent `legacy`.**

Point de restauration : `30bce53`.

---

## Une réponse avant tout : aucun changement de schéma n'est nécessaire

Tu demandais d'inspecter si `firm_promotions` peut représenter les portées
avant d'en proposer une nouvelle table. **Elle le peut déjà**, avec quatre
colonnes existantes :

    program_slug        cible un programme
    account_size        cible une taille
    eligible_variants   cible une ou plusieurs variantes
    eligible_markets    cible un ou plusieurs marchés

Ces quatre dimensions sont exactement l'identité commerciale
`firme + marché + programme + variante + taille`. Un champ nul veut dire
« toutes ». **Aucune table d'applicabilité, aucune relation vers un plan.**

Un identifiant de plan commercial explicite en base serait additif et
possible, mais il serait redondant aujourd'hui : la combinaison des quatre
colonnes le désigne déjà sans ambiguïté.

---

## Les huit capacités

### 1. La devise appartient au plan

`PlanRow.currency` est la devise native, jamais supposée. Le rendu formate avec
la devise du plan sélectionné.

Les fourchettes sont **séparées par devise** : `model.priceRanges` rend une
entrée par devise. Mélanger 95 USD et 155 EUR produirait un nombre qui ne veut
rien dire, et aucun taux de change n'est une donnée vérifiée de ce projet.

    futureselite   USD 95–569
    ftmo           EUR 79–1080
    the5ers        USD 69–279

### 2. La variante est une dimension de sélection

Ordre générique : **marché → programme → variante → taille**. Chaque sélecteur
disparaît quand il n'offre qu'un choix.

Le marché n'apparaît que pour The5ers, et il **filtre les programmes**. La
variante n'apparaît que sur FTMO 2-Step et The5ers Summer.

Avant, FTMO 2-Step affichait deux boutons « 100K » identiques à des prix
différents.

### 3. Identité commerciale

`planId(market, programSlug, variantKey, accountSize)`.

Les phases restent **enfants** de la sélection : 15 sélections commerciales
portent 27 lignes de phase chez FuturesElite, et un test échoue si les phases
deviennent des cartes indépendantes.

### 4. Firmes multi-marchés

| Firme | Type |
|---|---|
| FuturesElite | `Futures prop firm` |
| FTMO | `CFD prop firm` |
| The5ers | **`CFD & Futures prop firm`** |

The5ers ne porte **aucun** fait « X only » : le libellé de type porte
l'information à sa place.

`MARKET_MISMATCH` ne bloque plus que sur un **désaccord de métadonnée** —
`prop_firms.is_futures` contredisant les marchés des programmes. Vendre
plusieurs marchés produit une note `MULTI_MARKET`, pas une erreur. Un test
force `is_futures = true` sur FTMO et vérifie que le blocage revient.

### 5. Structures d'évaluation dynamiques

Seules les phases présentes sont rendues, dans un ordre déterministe :
`evaluation → evaluation_2 → sim_funded`. La table de règles adapte ses
colonnes aux phases réelles.

Couvert par les tests : FuturesElite une étape, FuturesElite Instant sans
évaluation, FTMO deux étapes, FTMO une étape, The5ers deux étapes.

### 6. Portée des promotions

`promotionForSelection(selection, promotions, now)` — un seul point de
résolution, avec un score de spécificité : chaque champ de portée non nul
restreint et augmente le score. La portée la plus étroite l'emporte.

Vérifié : une promotion Standard ne s'applique pas au Swing, une promotion 100K
ne s'applique pas au 200K, une promotion expirée ou à venir ne se résout
jamais, deux promotions à égalité produisent une **ambiguïté** que le
validateur bloque (`PROMO_AMBIGUOUS`), et l'absence de promotion applicable
renvoie `null`.

**Aucune valeur héritée ne comble le vide** : FTMO n'invente pas de code depuis
`prop_firms.discount_code` alors que des promotions normalisées existent sans
qu'aucune ne s'applique.

### 7. Offre absente

`offer = null` est un état valide. FTMO et The5ers y sont : aucun prix barré,
aucun pourcentage, aucun bouton de copie, un CTA neutre qui reste suivi par
`/api/go`.

### 8. Mode ombre

`RAPPORT-mode-ombre.md` régénéré. Il liste désormais les **sélections
commerciales**, pas des lignes de phase présentées comme des plans : marché,
programme, variante, taille, phases, devise, prix, promotion résolue. Plus la
provenance de chaque offre, les erreurs et les avertissements restants.

---

## Résultats

    npm run test:capabilities      54 assertions, toutes vertes
    npm run validator:regressions  14 assertions, toutes vertes
    npm run model:report           54 assertions, toutes vertes
    npm run test:programs         152 assertions, toutes vertes
    npx tsc --noEmit              propre, hors les deux erreurs vitest documentées
    npm run build                 ✓ Compiled successfully, puis l'échec d'environnement connu

### Non-régression de FuturesElite

    ok  4 programmes
    ok  15 selections commerciales
    ok  27 lignes de phase
    ok  SCANNED a 30 %
    ok  prix remise coherent sur chaque plan
    ok  zero erreur bloquante

### Repli sans `page_model_status`

Tu demandais de vérifier qu'une colonne absente ne peut ni faire échouer une
requête, ni produire une page blanche. **Vérifié et testé :**

- la requête utilise `select('*')` et **ne nomme jamais** `page_model_status` —
  une colonne absente ne peut donc pas la faire échouer ;
- `page_model_status` absente ou nulle → `servieParLeModele` renvoie `false` →
  ancien rendu ;
- `validated` → ancien rendu également : la fiche est prête, pas basculée ;
- seul `active` déclenche le nouveau rendu.

Sept assertions couvrent ces cas.

---

## Ordre d'exécution — inchangé et impératif

    1. database/RUN-01-firm-payment-methods.sql
    2. database/RUN-02-futureselite-payments.sql
    3. database/RUN-03-page-model-status.sql
    4. déploiement du code

Le repli est explicite et testé, donc déployer avant `RUN-03` ne casse rien —
mais **FuturesElite reviendrait à l'ancien rendu** jusqu'à ce que la colonne
existe et vaille `active`. L'ordre reste donc celui-ci.

---

## Fichiers

**Créés** : `scripts/capability-tests.mjs`.

**Modifiés** : `lib/firm-page-model.ts` (identité commerciale, devise par plan,
marchés multiples, fourchettes par devise, `promotionForSelection`),
`lib/validate-firm-page-model.ts` (`MARKET_MISMATCH` restreint,
`PROMO_AMBIGUOUS`, note `MULTI_MARKET`),
`components/prop-firm/FirmPage.tsx` (sélecteurs marché et variante, devise du
plan), `scripts/shadow-report.mjs` (sélections commerciales, provenance),
`package.json`.

**FuturesElite n'a pas été redessinée** : deux sélecteurs conditionnels ont été
ajoutés, et ils ne s'affichent pas pour elle — un seul marché, une seule
variante par programme.

---

## Ce qui reste ouvert

FTMO sort à 10 erreurs bloquantes, The5ers à 13. Elles ne viennent plus des
capacités manquantes, mais du **contenu éditorial** de ces deux fiches : des
chiffres écrits à la main que le validateur confronte désormais aux données.
C'est précisément ce qu'il doit faire, et c'est le travail de l'étape suivante.

Je m'arrête là, comme convenu. Aucune des deux n'est activée.
