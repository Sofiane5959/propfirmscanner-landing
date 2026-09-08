# Livraison — étapes 1 à 9

8 septembre 2026. **Aucun SQL exécuté. Aucun déploiement. Production
inchangée.**

## Point de restauration

    commit 30bce5319df0c0adedc5f92b34da85c8c10e0593
    2026-09-08 22:59:44 +0200

Tout ce qui suit s'annule par `git reset --hard 30bce53` côté code, et par les
retours en arrière documentés côté base — qu'aucun n'a été exécuté.

---

## ⚠ Un ordre d'exécution impératif

**`RUN-03-page-model-status.sql` doit être passé AVANT de déployer le code.**

L'étape 6 remplace `PILOTE_MODELE` par une lecture de
`prop_firms.page_model_status`. Si le code part avant le SQL, la colonne
n'existe pas, `page_model_status` vaut `undefined`, et **FuturesElite revient
silencieusement à l'ancien rendu**.

Ce n'est pas une perte de données, mais c'est une régression visible. L'ordre
est : SQL d'abord, déploiement ensuite.

---

## Fichiers

### Créés

| Fichier | Rôle |
|---|---|
| `lib/validate-firm-page-model.ts` | Le validateur de publication |
| `lib/firm-summary-model.ts` | `FirmSummaryModel` + requête d'agrégation |
| `scripts/validator-regressions.mjs` | Les six régressions en fixtures |
| `scripts/column-dependency-audit.mjs` | Génère la matrice de dépendances |
| `scripts/shadow-report.mjs` | Mode ombre FuturesElite / FTMO / The5ers |
| `database/RUN-01-firm-payment-methods.sql` | Schéma des moyens de paiement |
| `database/RUN-02-futureselite-payments.sql` | Données FuturesElite |
| `database/RUN-03-page-model-status.sql` | `page_model_status` |
| `MATRICE-dependances.md` | 69 colonnes, lecteurs, écrivains |
| `RAPPORT-mode-ombre.md` | Sortie du mode ombre |

### Modifiés

| Fichier | Changement |
|---|---|
| `app/[locale]/prop-firm/[slug]/page.tsx` | `PILOTE_MODELE` → `servieParLeModele(firm)` |
| `scripts/test-program-selection.mjs` | Exclusion du validateur et de ses fixtures du test des phrases interdites |
| `package.json` | Trois scripts : `validator:regressions`, `audit:columns`, `shadow:report` |

**Aucun composant d'interface n'a été touché.**

---

## Migrations à exécuter, dans cet ordre

    1. database/RUN-01-firm-payment-methods.sql   additif, aucune donnée touchée
    2. database/RUN-02-futureselite-payments.sql  3 lignes, futureselite seule
    3. database/RUN-03-page-model-status.sql      additif + 1 UPDATE
    ── puis seulement ── déploiement du code

`RUN-01` est purement structurel : table, contraintes, index, trigger, RLS.
`RUN-02` n'insère **aucune ligne `purchase`** : les moyens d'achat ne sont
documentés nulle part publiquement, et une ligne inventée se retrouverait sur
la fiche. Seul le flux `payout` est renseigné, avec ses trois méthodes Rise.
`RUN-03` met FuturesElite en `active`, les 349 autres restent `legacy` par le
défaut de colonne.

---

## Résultats des tests

    npm run validator:regressions     14 assertions, toutes vertes
    npm run model:report              54 assertions, toutes vertes
    npm run test:programs            152 assertions, toutes vertes
    npx tsc --noEmit                 propre, hors les deux erreurs vitest documentées
    npm run build                    ✓ Compiled successfully, puis l'échec d'environnement connu

### Les six régressions, en fixtures réelles

Chacune injecte la phrase historique dans le modèle **correct** et exige un
blocage :

    ok  1. 90 % generalise alors qu Instant paie 80 %
    ok  2. absence de limite journaliere generalisee alors que Prime en a une
    ok  3. sept plateformes alors que six sont selectionnables
    ok  4. plafond Nitro chiffre alors que la valeur est disputee
    ok  5. jours minimum d Elite generalises a la firme
    ok  6. drawdown de fin de journee groupant des programmes qui different

Et les faux positifs, exigés par toi :

    ok  aucun chiffre capte : adresse (Corso G. Matteotti 61, Latina 04100)
    ok  aucun chiffre capte : annee de fondation
    ok  aucun chiffre capte : annee dans un recit
    ok  aucun chiffre capte : numero de version
    ok  aucun chiffre capte : classement
    ok  un texte sans regle de produit ne bloque pas
    ok  une valeur exacte et attribuee a son programme passe

### Deux faux positifs trouvés et corrigés en cours de route

Le validateur bloquait le contenu **actuel**, correct, sur deux points :

1. il exigeait un mot-clé d'incertitude dans le texte des règles
   `needs_confirmation`. Or « not currently purchasable » dit l'incertitude
   sans employer le vocabulaire attendu — et surtout, le marquage visible est
   un travail de rendu, que le composant fait déjà. Le contrôle porte
   désormais sur le vrai risque : une règle non confirmée **promue en règle
   critique**, où aucun badge n'existe ;
2. il exigeait qu'un texte nomme un programme. Or « 80% to 90% depending on
   the program » est exact et n'a aucun programme à nommer. Une réserve
   explicite est maintenant acceptée.

Une troisième correction est plus intéressante. Les régressions 2 et 6 ont
cessé de bloquer après la première correction, et la cause en dit long :
**Nitro possède bien « end of day » — en évaluation.** La présence par
programme ne capturait pas la différence de phase. Le validateur traite
désormais le drawdown par type : dès que deux types coexistent, aucune
affirmation globale ne passe.

---

## Validation FuturesElite

**0 erreur bloquante.** 10 avertissements, 3 notes.

Les avertissements sont tous des conflits de sources officielles encore
ouverts — scalping sans seuil, news trading financé, Instant 25K, durée
d'évaluation Prime, plafond Nitro — plus des valeurs éditoriales que le modèle
ne peut pas vérifier. Aucun ne bloque, tous sont visibles.

---

## Rapport de mode ombre

`RAPPORT-mode-ombre.md`. **Aucune fiche n'a changé de comportement.**

| Firme | Programmes | Marché | Erreurs bloquantes |
|---|---|---|---|
| futureselite | 4 | Futures prop firm | **0** |
| ftmo | 2 | CFD prop firm | **10** |
| the5ers | 3 | **—** | **13** |

The5ers n'a **aucun libellé de marché** : ses programmes mélangent `cfd` et
`futures`, et le modèle refuse alors de trancher. C'est le comportement voulu,
mais cela signifie que la notion de « type de firme » ne survit pas à une firme
multi-marchés.

### Les sept capacités génériques manquantes

| Capacité | Constaté sur |
|---|---|
| Devise non USD | FTMO (EUR) |
| Variantes commerciales | FTMO (standard, swing — 14 plans), The5ers (8-5, 10-5 — 4 plans) |
| Plusieurs variantes pour une même taille | FTMO 2-Step (10K, 25K, 50K, 100K ×2), The5ers Summer (100K, 200K ×2) |
| Marché non futures | FTMO (cfd) |
| **Marchés multiples dans une firme** | **The5ers (cfd + futures)** |
| Structures d'évaluation multiples | les trois firmes |
| Seconde phase d'évaluation | FTMO, The5ers |
| Aucune promotion résolue | FTMO, The5ers |

Les deux plus lourdes ne figuraient pas dans ta liste de l'étape 5 :

**Les marchés multiples dans une même firme.** The5ers vend du CFD et du
futures. `identity.firmType` et le fait de firme « Futures only » supposent
tous deux un marché unique. Il faudra soit un libellé par marché, soit
l'abandon du type au niveau firme.

**Les promotions non résolues** pour FTMO et The5ers. Leurs packs portent des
promotions, mais aucune ne remonte : leur portée est plus étroite que ce que
`promotionsFor` sait filtrer — FTMO limite la sienne à une variante et une
taille précises. À traiter à l'étape 5.

---

## Retour en arrière

| Niveau | Geste | Portée | Déploiement |
|---|---|---|---|
| 1 | `update prop_firms set page_model_status = 'legacy' where slug = 'futureselite'` | une fiche | non |
| 2 | `delete from firm_payment_methods where firm_slug = 'futureselite'` | moyens de paiement | non |
| 3 | `git reset --hard 30bce53` | tout le code | oui |
| 4 | Supprimer la colonne et la table (scripts commentés en fin de RUN-01 et RUN-03) | schéma | oui |

Le niveau 1 est celui qui compte : **revenir en arrière sans déployer**. C'est
le gain concret de `page_model_status`.

`prop_firms.payout_methods` n'a pas été touchée et reste écrite par le
générateur : supprimer les lignes de `firm_payment_methods` fait retomber la
fiche sur le repli, sans perte.

---

## Confirmation

**Le comportement de production n'a pas changé.** Aucun SQL n'a été exécuté,
aucun déploiement lancé. Le code du dépôt contient les changements, mais ils
n'atteindront la production que quand tu auras passé les trois migrations puis
déployé — dans cet ordre.

Rien n'a été supprimé, aucune écriture héritée n'a cessé, `/compare` n'a pas
bougé, FTMO et The5ers restent servies par l'ancien rendu.

## Ce que j'attends

Ton approbation, ou tes corrections, sur les sept capacités manquantes — en
particulier les deux que le mode ombre a révélées et que le plan n'avait pas
anticipées : les marchés multiples dans une firme, et les promotions à portée
étroite.
