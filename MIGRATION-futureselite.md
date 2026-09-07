# Migration FuturesElite — à exécuter par toi

8 septembre 2026. **Je n'ai exécuté aucun SQL.** Interface inchangée, sauf
l'avertissement de risque que tu as demandé.

## Un fichier de plus que prévu, et pourquoi

Tu demandes une procédure de retour en arrière. Elle n'existe pas sans copie
préalable : **les deux migrations commencent par des `delete`**, et l'éditeur
Supabase ne protège que d'un script *cassé*, pas d'un script *réussi qui écrit
de mauvaises valeurs*. Une fois les `delete` passés, l'ancien contenu n'est plus
nulle part.

J'ai donc ajouté `RUN-00-sauvegarde-avant-migration.sql`. Il est additif —
uniquement des tables `fe_sauv_20260908_*` — et c'est lui qui rend le rollback
possible. **Sans lui, il n'y a pas de retour en arrière.**

## Ordre d'exécution

| # | Fichier | Nature |
|---|---|---|
| 0 | `database/RUN-00-sauvegarde-avant-migration.sql` | additif, aucune ligne modifiée |
| 1 | `database/RUN-futureselite-programs.sql` | 7 `delete` + 7 `insert` |
| 2 | `database/RUN-futureselite.sql` | 1 `update` + 1 `delete`/`insert` |
| 3 | `database/VERIFICATION-futureselite.sql` | lecture seule, 8 blocs |

Un fichier à la fois. Note les compteurs que renvoie l'étape 0 : ce sont eux
qu'un retour en arrière doit restituer.

## Contenu des deux migrations

**Fichier 1** — portée `firm_slug = 'futureselite'` :

| Table | Lignes réinsérées |
|---|---|
| `firm_programs` | 4 |
| `firm_program_plans` | 27 |
| `firm_promotions` | 16 |
| `firm_program_bundles` | 25 |
| `firm_platforms` | 8 |
| `firm_rules` | 33 |
| `firm_live_tiers` | 5 |

**Fichier 2** — `update prop_firms` sur 36 colonnes, puis 4 lignes dans
`prop_firm_challenges`. Aucun `ALTER`, aucun changement de schéma.

## Résultats attendus, requête par requête

Ils sont écrits sous chaque bloc dans `VERIFICATION-futureselite.sql`. Résumé :

| # | Requête | Attendu |
|---|---|---|
| 1 | Remise partenaire | `SCANNED`, **0.30**, `is_public = false`, `active` |
| 2 | Plateformes | `selectable` **6**, `marketing_only` **2** |
| 3 | Instant financé | 3 lignes — 50K/100K/150K, **0.8**, **End of Day**, **0.2**, **10 jours**. Aucune taille 25000 |
| 4 | Prime | 8 lignes, `daily_loss_limit` **jamais nul** (600/1200/1800/2700), `consistency_rule` **0.4** en `sim_funded` |
| 5 | Nitro financé | **Trailing Equity**, `max_funded_accounts` **null** |
| 6 | Colonnes de firme | `profit_split` **80**, `max_profit_split` **90**, `leverage_forex` **null**, `cost_timeline` **null**, `value_strip` présente, vérifié le **2026-09-07**, six plateformes |
| 7 | Volumes | **4 · 27 · 16 · 25 · 8 · 33 · 5 · 4** |
| 8 | Débordement | **0** autre firme modifiée aujourd'hui |

Les signaux d'échec les plus parlants : `0.20` au bloc 1 (fichier 1 non passé),
un `0.9` ou un `Trailing Equity` sur Instant au bloc 3, un chiffre dans
`max_funded_accounts` au bloc 5.

## Retour en arrière

`database/ROLLBACK-futureselite.sql`, à ne passer que si une vérification
échoue.

Il commence par un garde-fou : sans les tables de sauvegarde il lève une
exception et **ne touche à rien**, plutôt que de vider les tables sans pouvoir
les remplir.

Un point de conception mérite d'être signalé : la ligne de `prop_firms` est
restaurée par `update` colonne par colonne, **pas** par `delete` + `insert`. Un
`delete` casserait les clés étrangères qui la référencent — favoris, clics
d'affiliation, comparaisons enregistrées. Le rollback ne doit pas coûter plus
cher que le problème qu'il répare.

Ne supprime les tables `fe_sauv_20260908_*` qu'une fois la cause comprise :
ce sont elles qui autorisent un second essai.

## Ce qui a changé côté interface

Une seule chose, celle que tu as demandée : un avertissement de risque court,
après la FAQ, dans `components/prop-firm/FirmPage.tsx`. Il ne dépend d'aucune
donnée, donc il ne peut pas disparaître avec une colonne vide.

« Similar firms » reste absente, comme convenu.
`PILOTE_MODELE = new Set(['futureselite'])` est inchangé.

## État des vérifications

    npm run test:programs    148 assertions, toutes vertes
    npm run model:report      34 assertions, toutes vertes
    npx tsc --noEmit         propre, hors les deux erreurs `vitest` documentées

## Après tes vérifications

Le code du pilote est déjà dans le dépôt : **la bascule se produira au premier
déploiement.** Comme tu passes le SQL d'abord, l'ancien rendu — encore en ligne
— affichera déjà les bonnes données, puisqu'il lit les mêmes colonnes : 30 %,
six plateformes, plus de levier forex. Ce sera une première confirmation
avant même de déployer.

Dis-moi quand les huit blocs sont passés et je reprends la mesure sur la
production.
