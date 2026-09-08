# Confirmation avant migration — vérifié fichier par fichier

8 septembre 2026. Rien exécuté, interface non modifiée.

## Un écart trouvé en vérifiant, et corrigé

Tu me demandes de confirmer que la sauvegarde et le rollback couvrent **toutes**
les colonnes modifiées. J'ai comparé les deux listes plutôt que de l'affirmer :

- colonnes écrites par la migration : **40**
- colonnes restaurées par le rollback : **38**

**`payout_methods` manquait.** C'est précisément la colonne que la correction 4
ajoute : le rollback, écrit avant elle, ne pouvait pas la connaître.

J'ai corrigé la cause plutôt que la ligne. Le bloc de restauration de
`prop_firms` est maintenant **dynamique** : il lit les colonnes réellement
communes aux deux tables dans `information_schema` et les restaure toutes. Une
liste écrite à la main dérive fatalement de la migration qu'elle annule ; celle-ci
ne peut plus rater une colonne ajoutée plus tard.

Le comportement voulu est conservé : restauration par `update` colonne par
colonne, jamais par `delete` + `insert`, pour ne pas casser les clés étrangères
qui référencent la firme.

## Les quatre corrections, vérifiées dans les fichiers

| # | Correction | Vérification |
|---|---|---|
| 1 | Plafond Nitro | `maximum 3 Nitro` : **0 occurrence** dans les deux fichiers. `Nitro funded-account limit: not confirmed` présent. Le conflit reste, avec ses deux sources — `caps Nitro at 3 funded accounts` et `MAX 4 FUNDED` |
| 2 | Verdict | `An evaluation with no daily loss limit` : **0 occurrence**. `Elite or Nitro evaluations without a daily loss limit` présent |
| 3 | Drawdown | `End-of-day drawdown on Elite` : **0 occurrence**. Remplacé par `Drawdown type differs by program and phase`. Les valeurs par programme restent dans `firm_program_plans` |
| 4 | Prestataire | `payout_methods = '{"Rise"}'::text[]` présent |

Sur le point 4, une vérification de plus : `payout_methods` figure dans la
liste blanche `TEXT_ARRAY` du générateur, et FTMO, The5ers et Hantec Trader
l'écrivent déjà de la même façon. La colonne existe donc bien en `text[]`, et
le cast est le bon. CLAUDE.md documente que `platforms` est TEXT malgré son
apparence de tableau — je ne voulais pas supposer que `payout_methods` lui
ressemblait.

## Les cinq propriétés que tu demandes

**Portée.** Vérifié statement par statement : les 14 commandes de
`RUN-futureselite-programs.sql` et les 3 de `RUN-futureselite.sql` sont toutes
filtrées sur `futureselite`. Aucune n'est sans filtre.

**Idempotence.** Oui, les deux.
`RUN-futureselite-programs.sql` : 7 `delete` puis 7 `insert`, tous filtrés — le
rejouer redonne exactement le même état.
`RUN-futureselite.sql` : un `update`, puis `delete` + `insert` sur les
challenges, avec `gen_random_uuid()` comme l'exige `prop_firm_challenges.id`.
Ses 10 `alter table` sont tous en `add column if not exists`.
Aucun `create table` ni `drop` dans l'un ou l'autre.

**Sauvegarde et rollback.** La sauvegarde fait `create table as select *` sur
les neuf tables : elle capture donc toutes les colonnes, y compris celles
ajoutées plus tard. Le rollback est désormais dynamique, donc aligné par
construction. L'écart signalé plus haut est le seul qui existait, et il est
fermé.

**Ordre.** Inchangé :

    0. RUN-00-sauvegarde-avant-migration.sql   ← indispensable au rollback
    1. RUN-futureselite-programs.sql
    2. RUN-futureselite.sql

**Déploiement.** Aucun n'est nécessaire. Le code est en ligne depuis `b4de2fd`,
prouvé hier par quatre marqueurs présents dans le HTML de production. Les
quatre corrections restantes sont du contenu de base.

## Requêtes de vérification

`database/VERIFICATION-quatre-corrections.sql` — lecture seule, cinq blocs à
passer un par un. Résultats attendus écrits sous chacun.

En résumé :

| Bloc | Attendu |
|---|---|
| 1. Nitro | 2 règles. La première finit par « Nitro funded-account limit: not confirmed » et ne contient plus « maximum 3 Nitro ». La seconde, en `needs_confirmation`, cite les deux sources |
| 2. Verdict | La liste des points contient « Elite or Nitro evaluations without a daily loss limit ». Le contrôle booléen `encore_perime` doit renvoyer **false** |
| 3a. Atouts | Contient « Drawdown type differs by program and phase », plus « End-of-day drawdown on Elite, Nitro and Instant » |
| 3b. Par programme | 8 lignes. `instant / sim_funded / End of Day / 3`, `nitro / evaluation / End of Day / 4`, `nitro / sim_funded / Trailing Equity / 4` |
| 4. Prestataire | `payout_methods = {Rise}`, `nb = 1`, `payout_frequency = 'on demand, daily once funded'` |
| 5. Portée | **0** autre firme modifiée aujourd'hui |

Le bloc 3b mérite un mot : Nitro y prouve la règle à lui seul — `End of Day` en
évaluation, `Trailing Equity` une fois financé. C'est exactement ce qu'une
phrase groupant plusieurs programmes ne peut pas exprimer.

## État des suites

    npm run model:report      54 assertions, toutes vertes
    npm run test:programs    152 assertions, toutes vertes
    npx tsc --noEmit         propre, hors les deux erreurs `vitest` documentées

Passe les fichiers, recharge deux fois, et dis-le-moi : je récupère le HTML de
production et je te prouve la disparition de chaque phrase périmée.
