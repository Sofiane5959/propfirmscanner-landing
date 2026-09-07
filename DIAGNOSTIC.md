# Pourquoi la production sert encore l'ancienne version

7 septembre 2026. Mesuré sur `https://www.propfirmscanner.org/prop-firm/futureselite`
avec contournement du cache ISR. Aucun changement de code.

## Réponse : cause 1. Le SQL corrigé n'a pas été exécuté.

Les causes 2, 3 et 4 sont écartées par la mesure.

---

## Commit déployé : `b9313bc` (07/09, 22:24, « llll »)

C'est bien le dernier commit, et il est poussé — `main...origin/main`, aucun
fichier non commité.

**Preuve.** `codeAuto: (c: string)` n'existe que dans `b9313bc` : il vaut 0 dans
`6dd04d1`, `7c9d803` et `d4e4f84`. Or la production sert le texte produit par
cette fonction et plus l'ancienne chaîne :

| Chaîne cherchée en production | Occurrences |
|---|---|
| `Code applied automatically` | **0** |
| `and enter it at checkout` | **1** |
| `Payment page pre-filled` | **0** |
| `Check the selected plan and enter` | **1** |
| `Two-step configurator` | **0** |
| `Account configurator` | **1** |
| `Select Nitro` | **0** |
| `id="platforms"` / `id="about"` | **1** / **1** |

Toutes ces chaînes viennent du **code**, pas de la base. Elles sont à jour.
**La cause 2 est écartée : le déploiement contient les changements de
composants.**

## Ce que la base sert encore

| Chaîne | Occurrences | Source |
|---|---|---|
| `seven platforms` / `Seven platforms` | 2 / 2 | `prop_firms.description`, `included_items` |
| `WealthCharts` | 4 | `prop_firms.platforms` (ancienne liste) |
| `not public` | 2 | `prop_firms.cons` |
| `3 September` | 1 | `prop_firms.data_verified_at` |
| `7 September` | **0** | — |
| `What you will pay` | 2 | `prop_firms.cost_timeline` non NULL |
| Elite 25K à **76 $** | — | `firm_promotions` : SCANNED à **0.20** |

76 = 95 × 0,80. À 30 % le prix serait **66,50 $**. Le chiffre affiché prouve
donc à lui seul que `RUN-futureselite-programs.sql` n'est pas passé.

**Cause 3 écartée** : `prop_firms` n'écrase pas `firm_programs`. Les deux sont
périmées de façon cohérente — le prix vient bien de `firm_promotions`, preuve
que l'adaptateur fonctionne, mais il lit une remise à 20 %.

**Cause 4 écartée** : la page anglaise lit les colonnes de base ; le bloc
`translations` ne s'applique qu'aux locales non anglaises. La requête 3 du
fichier SQL le vérifie — si `translations` ne contient pas de clé `en`, aucune
surcouche ne peut intervenir sur cette URL.

## Requêtes de preuve

`database/DIAGNOSTIC-futureselite-source.sql` — **lecture seule**, sept blocs
numérotés. Le bloc 7 répond en une ligne : quel fichier manque.

Exécute-les un par un : l'éditeur Supabase n'affiche que le dernier résultat.

---

## Deux choses que le SQL ne réglera pas

### `Leverage (forex) 1:100`

Tu as raison, c'est absurde pour une firme futures. Mais ce n'est pas une
donnée périmée : c'est `prop_firms.leverage_forex`, une colonne que
`RUN-futureselite.sql` **ne touche pas**. Elle vient du seed d'origine et
survivra à l'exécution des deux fichiers.

`PropFirmPageClient.tsx:846` la rend dès qu'elle est non nulle :

    if (firm.leverage_forex) specs.push({ label: 'Leverage (forex)', value: firm.leverage_forex })

Deux corrections possibles, aucune faite pour l'instant :

- **données** : `update prop_firms set leverage_forex = null where slug = 'futureselite'` ;
- **code** : conditionner la ligne à `!firm.is_futures`, ce qui protège toutes
  les firmes futures d'un coup.

Je recommande les deux — le code d'abord, parce que le problème existe
probablement sur d'autres fiches futures. Dis-moi et je le fais.

### Le bloc d'offre n'existe pas dans le HTML serveur

`Claim deal` renvoie **0** en production, et ce n'est pas dû au déploiement :
le bloc est bien dans `b9313bc`. Il ne se rend pas côté serveur.

La raison : `offreMiseEnAvant` calcule le pourcentage depuis la ligne
sélectionnée, et `selectionKey` vaut `null` au premier rendu — le configurateur
ne remonte la sélection qu'après hydratation, dans un `useEffect`. Le repli est
`promotion.percent`, qui vaut NULL puisque `prop_firms.discount_percent` l'est.
Donc `pourcent` est nul, et le bloc s'efface.

Conséquences : invisible pour un moteur de recherche, invisible dans un PDF
capturé avant hydratation, et un bref instant vide au chargement.

Le correctif est de calculer une valeur de repli côté serveur — le premier plan
de la première famille — plutôt que d'attendre la sélection. **Je ne l'ai pas
fait**, tu as demandé aucun changement de design avant ce diagnostic.

---

## Ordre que je propose

1. Passe `database/DIAGNOSTIC-futureselite-source.sql` et envoie-moi le
   résultat du bloc 7. Ça confirme le diagnostic sur ta base, pas seulement
   depuis l'extérieur.
2. Exécute `RUN-futureselite-programs.sql` puis `RUN-futureselite.sql`.
3. Dis-moi si je corrige le levier forex et le rendu serveur du bloc d'offre.
4. Recharge la fiche **deux fois** — le premier appel sert une copie périmée.

## Les captures

Elles restent bloquées pour la même raison qu'avant : il n'y a pas de
`.env.local` sur cette machine, donc aucune page ne se construit ici.

Une fois le SQL passé et la page à jour, je peux les prendre **sur l'URL de
production**, pas en local — c'est d'ailleurs ce que tu demandes. Dis-moi
quand c'est fait et je livre Elite, Prime et Instant séparément, à 320, 375,
768, 1024 et 1440 px, plus le PDF desktop.
