# Six corrections factuelles — 8 septembre 2026

Aucune restructuration. Aucun SQL exécuté.

## D'abord, une erreur de ma part

J'ai écrit hier que la bannière promotionnelle était absente de la fiche.
**C'est faux.** Elle y est, en haut : `VERIFIED DEALS · 10% OFF · 95AD5431`,
avec son propre bouton de copie, trois centimètres au-dessus de l'offre
FuturesElite. Je l'ai vue sur la capture mobile ci-jointe.

Ma recherche portait sur « Top deals », le libellé que tu avais employé. Le
composant s'appelle `PromoTicker` et affiche « VERIFIED DEALS ». J'ai conclu à
une absence à partir d'un mot-clé, au lieu de regarder la page.

Corrigé : `PromoTicker` ne se rend plus sur les routes `/prop-firm/`. Le filtre
porte sur la route, pas sur une firme — toutes les fiches sont concernées, et
le bandeau reste partout ailleurs.

## Les six corrections

### 1. `Italy · cfd prop firm` → `Italy · Futures prop firm`

Déjà visible en production : tu as passé `RUN-futureselite-correctif-market.sql`.
Mesuré à `2026-09-08T20:01:32Z` — `cfd prop firm` : **0**, `Futures prop firm` : **2**.

La correction du mapping va plus loin que ce cas. Le modèle utilisait une
capitalisation improvisée qui laissait passer n'importe quelle valeur de
colonne en texte visible. Il y a maintenant une table de libellés, et **un
marché inconnu ne produit aucun libellé** plutôt qu'un mot brut. Un test le
vérifie en forçant `market: 'crypto'`.

### 2. Plafond Nitro

La règle `Active funded accounts` disait « maximum 3 Nitro ». Elle dit
maintenant : *« Nitro funded-account limit: not confirmed. »*

L'explication du conflit reste intégralement, dans la règle dédiée : FAQ à 3,
copie du configurateur à MAX 4. Trois tests verrouillent l'ensemble — plus
aucun « maximum 3 Nitro », mention « not confirmed » présente, et les deux
sources du désaccord toujours citées.

### 3. Drawdown d'Instant

Vérifié sur les données de phase : les trois tailles Instant portent
`End of Day` en `sim_funded`, ce que le relevé officiel du 7 septembre
confirme (`end_of_day_trailing`).

Mais tu as raison sur le principe, et j'ai supprimé la formulation fautive.
`pros` disait « End-of-day drawdown on Elite, Nitro and Instant » — une phrase
rédigée à la main qui *groupe* trois programmes. Elle dit maintenant que le
type de drawdown diffère par programme et par phase, et renvoie à la table.
Nitro le prouve : `End of Day` en évaluation, `Trailing Equity` une fois
financé. Un test échoue si une affirmation de drawdown groupe à nouveau
plusieurs programmes.

### 4. Résumé de sélection

Huit valeurs, toutes déjà présentes dans le modèle : objectif de profit, perte
maximale, perte journalière, type de drawdown, jours minimum, contrats maximum,
partage financé, plafond de retrait.

Deux choix : les règles d'entrée sont lues sur la phase que le visiteur
affronte **en premier** (l'évaluation, ou le compte financé sur un produit
instantané), et le gain sur la phase financée. Et **une ligne sans valeur ne
s'affiche pas** — une colonne de « Not stated » n'aide personne à décider.

### 5. Bande d'information

Quatre entrées ajoutées : Market, Payment provider, Trading model, Payout
frequency.

`Rise` est ajouté à `payout_methods` — vérifié par la règle « Payment provider »
de la FAQ paiements. `Trading model: Simulated` **n'est pas écrit à la main** :
il se dérive du nom de phase `sim_funded`, donc d'une donnée structurée. Un
test remplace les phases par `live` et vérifie que le modèle cesse alors
d'annoncer « Simulated ».

### 6. Verdict

« An evaluation with no daily loss limit » devient **« Elite or Nitro
evaluations without a daily loss limit »**, parce que Prime en a une dans les
deux phases.

## Preuves

### Production, avant redéploiement — `2026-09-08T20:01:32Z`

| Chaîne | Occurrences | Lecture |
|---|---|---|
| `cfd prop firm` | **0** | correction 1 déjà en ligne |
| `Futures prop firm` | **2** | idem |
| `maximum 3 Nitro` | 2 | attend le SQL régénéré |
| `An evaluation with no daily loss` | 2 | attend le SQL régénéré |
| `Trading model` | 0 | attend le déploiement |

### Captures

Jointes : **1440 px** et **390 px**, sur l'URL de production.

Ce qu'elles montrent déjà : `30% OFF`, `SCANNED` avec `Copy code`, `Claim deal`,
`Elite $25K` à **66,50 $** barré de **95 $**, `Italy · Futures prop firm`, les
six plateformes sélectionnables listées en entier, et les deux faits de firme
— `No activation fee` et `Futures only`.

Une observation au passage : la capture est prise sur la locale française
(titre et navigation en français) alors que le corps est en anglais. Le pilote
lit `firm`, les colonnes de base, et **ignore `translations`** — c'était le
périmètre convenu, anglais seulement. Un visiteur francophone voit donc une
fiche anglaise dans une coquille française. À traiter quand tu élargiras le
pilote.

### Vérifications

    npm run model:report      54 assertions, toutes vertes
    npm run test:programs    152 assertions, toutes vertes
    npx tsc --noEmit         propre, hors les deux erreurs `vitest` documentées
    npm run build            ✓ Compiled successfully, puis l'échec d'environnement connu

Un test s'est révélé mal écrit : il cherchait « 3 active funded Nitro » dans
les règles alors que le libellé réel est « caps Nitro at 3 funded accounts ».
C'était le test qui était faux, pas la donnée — recadré.

## Ce que tu dois exécuter

**Un seul fichier**, régénéré avec les corrections 2, 3 et 6 :

    database/RUN-futureselite-programs.sql   (33 règles, plafond Nitro non confirmé)
    database/RUN-futureselite.sql            (37 colonnes, verdict et atouts corrigés)

Même ordre que la dernière fois. La sauvegarde `fe_sauv_20260908_*` couvre
toujours le retour en arrière si besoin.

Puis déploie : les corrections 4 et 5 sont dans le composant, ainsi que le
retrait du bandeau.

Ensuite, dis-le-moi et je reprends les captures avec Elite, Nitro, Prime et
Instant sélectionnés séparément — je n'ai pas voulu les faire maintenant, elles
montreraient un état intermédiaire.

`PILOTE_MODELE = new Set(['futureselite'])` reste inchangé.
