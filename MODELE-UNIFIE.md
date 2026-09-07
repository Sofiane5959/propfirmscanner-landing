# Modèle unifié — livraison, pilote FuturesElite

7 septembre 2026. **Aucun SQL exécuté.** Anglais seulement. FTMO, The5ers et
les traductions non touchés.

## Corrections immédiates

| # | Correction | Où |
|---|---|---|
| 1 | `leverage_forex` n'est plus rendu quand `is_futures === true` | `PropFirmPageClient.tsx` — corrige **toutes** les fiches futures, pas seulement FuturesElite |
| 2 | Valeur `1:100` effacée | `scripts/firm-content.mjs` → `leverage_forex: null` dans la migration |
| 3 | L'offre SCANNED est rendue **côté serveur** | Le plan par défaut est le premier programme, plus petite taille — le même défaut que le configurateur. Avant, `selectionKey` valait `null` au rendu serveur et le bloc n'existait pas dans le HTML |
| 4 | Aucune promesse de coupon ou de plan prérempli | `disclosure` du modèle : *« Check the selected plan and enter SCANNED at checkout. »* Un test le vérifie |

## `buildFirmPageModel(firm, programData)`

`lib/firm-page-model.ts`. Signature volontairement pure : elle reçoit les
données, ne requête rien, et rend un `FirmPageModel` complet. `page.tsx`
l'appellera une fois et passera l'objet unique.

### La précédence, écrite une seule fois

    1. donnée du plan et de la phase sélectionnés
    2. à défaut, donnée du programme
    3. à défaut, donnée de firme — seulement si universelle
    4. à défaut, null

Une valeur de firme ne remplace jamais une valeur de programme ou de phase.
C'est l'inverse qui se produisait : « 90 % » au niveau firme écrasait les 80 %
d'Instant.

### La séparation qui rend l'erreur impossible

`firmFacts` n'est pas rédigé à la main : il est **calculé**. La fonction
`universalFact()` interroge tous les plans de tous les programmes et n'accepte
un fait que si la valeur est unique. Un fait propre à un programme n'a aucun
chemin vers `firmFacts` ; il vit sous `programs[].plans[].phases[]`.

Résultat mesuré sur FuturesElite : l'ancienne bande portait quatre faits, le
modèle n'en retient que **deux**.

| Ancien fait de firme | Verdict du modèle |
|---|---|
| No activation fee | **retenu** — vrai sur les quatre programmes |
| Futures only | **retenu** — même marché partout |
| No daily loss limit | **rejeté** — Prime en a une |
| End-of-day drawdown | **rejeté** — Nitro financé est en trailing equity |
| 90% profit split | **rejeté** — Instant paie 80 % |

Ce n'est pas une correction éditoriale : c'est la structure qui refuse.

### Les quatre tables ressuscitées

`firm_rules`, `firm_platforms`, `firm_program_bundles` et `firm_live_tiers`
étaient chargées puis jetées — `firm_live_tiers` n'était même jamais requêtée.
Elles entrent maintenant dans le modèle. Concrètement : les **33 règles**
vérifiées atteignent enfin le lecteur, et les six plateformes sélectionnables
se distinguent des deux réservées à la page marketing.

## Rapport de provenance

`RAPPORT-provenance.txt`, et régénérable par `npm run model:report`.

Il n'est pas rédigé à la main : le script compile `lib/firm-page-model.ts`,
l'exécute sur les données réelles de FuturesElite et imprime le champ
`provenance` que le modèle produit lui-même. Il devient donc faux le jour où le
modèle change sans qu'on le régénère.

Contenu construit : 4 programmes, 15 plans, 8 plateformes dont 6
sélectionnables, 9 règles critiques, 33 règles détaillées, 25 paliers de
bundle, 5 paliers live, code SCANNED, 3 plans portant l'avertissement de prix.

> Le rapport a d'ailleurs trouvé un défaut au premier passage : mon harnais
> oubliait le bloc `json` des fixtures, et le modèle sortait sans règles ni
> verdict. Corrigé, et c'est la preuve que le rapport travaille vraiment.

## Tests

`npm run model:report` — **18 assertions sur le modèle construit**, pas sur les
fixtures. La distinction compte : « la base contient 80 % » et « la page
affichera 80 % » sont deux affirmations différentes.

Les neuf que tu demandes, plus la garantie structurelle :

    ok  Instant est toujours a 80 %
    ok  Instant est en fin de journee
    ok  Instant demarre a 20 % de regularite
    ok  Nitro finance est en Trailing Equity
    ok  Prime porte une limite journaliere dans les deux phases
    ok  Prime garde 40 % de regularite une fois finance
    ok  six plateformes selectionnables
    ok  les plateformes marketing ne sont pas selectionnables
    ok  SCANNED vaut 30 %
    ok  fait de firme legitime : « No activation fee »
    ok  fait de firme legitime : « futures only »
    ok  firm_rules / firm_platforms / firm_program_bundles / firm_live_tiers
        atteignent le modele

`npm run test:programs` — **148 assertions**, toutes vertes.
`npx tsc --noEmit` — propre hors les deux erreurs `vitest` documentées.

---

## Ce qui n'est pas fait, et pourquoi

**La page n'est pas encore branchée sur le modèle.** Ta séquence dit
« avant de brancher la page rendue, génère un rapport » — le rapport est là,
les tests passent. Le branchement de `page.tsx` et de `PropFirmPageClient` est
l'étape suivante, et c'est la plus risquée : elle touche le composant partagé
par 350 fiches.

Je propose de la faire en deux temps : d'abord un mode comparaison qui
construit le modèle **et** rend la page actuelle, en journalisant les écarts
champ par champ ; puis la bascule, une fois les écarts à zéro. Dis-moi si tu
veux que j'enchaîne.

**La suppression du bloc coûts** est faite côté données (`cost_timeline: null`)
mais la section existe encore dans le composant pour les ~349 autres fiches.
Elle disparaîtra du composant au moment du branchement.

---

## SQL corrigé — ordre de migration

**Rien n'a été exécuté.**

    1. database/RUN-futureselite-programs.sql
    2. database/RUN-futureselite.sql

Ordre imposé : le second met à jour `prop_firms`, le premier reconstruit les
sept tables normalisées. Les deux portent uniquement `futureselite`. Aucun
`ALTER`, aucun changement de schéma.

### Fichier 1 — `RUN-futureselite-programs.sql`

Sept `delete` puis sept `insert`, tous filtrés sur `firm_slug = 'futureselite'`.

| Table | Lignes |
|---|---|
| `firm_programs` | 4 |
| `firm_program_plans` | 27 |
| `firm_promotions` | 16 |
| `firm_program_bundles` | 25 |
| `firm_platforms` | 8 |
| `firm_rules` | 33 |
| `firm_live_tiers` | 5 |

Changements par rapport à la base : SCANNED **20 % → 30 %**, plateformes 6 → 8
avec le statut `marketing_only`, règles 28 → 33, `max_funded_accounts` de Nitro
à `NULL`.

### Fichier 2 — `RUN-futureselite.sql`

`update prop_firms` — **36 colonnes**, puis `delete` + `insert` de 4 lignes dans
`prop_firm_challenges`.

Changements : `leverage_forex → NULL`, `cost_timeline → NULL`,
`data_verified_at → 2026-09-07`, `profit_split → 80`, plateformes du
configurateur, règles en trois catégories, `counterPoints` du verdict,
`value_strip` recalculée.

### Requêtes de vérification, après exécution

```sql
-- 1. La remise partenaire est bien a 30 %
select code, discount_value, is_public, label
from   firm_promotions
where  firm_slug = 'futureselite' and is_public = false;
-- attendu : SCANNED, 0.30, false

-- 2. Six plateformes selectionnables, deux marketing
select configurator_status, count(*)
from   firm_platforms
where  firm_slug = 'futureselite'
group  by 1;
-- attendu : selectable 6, marketing_only 2

-- 3. Instant : 80 % et fin de journee sur les trois tailles
select pl.account_size, pl.profit_split, pl.drawdown_type, pl.consistency_rule
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite' and pr.slug = 'instant'
  and  pl.phase = 'sim_funded'
order  by pl.account_size;
-- attendu : 0.8, 'End of Day', 0.2 sur 50000/100000/150000

-- 4. Prime : limite journaliere dans les deux phases, 40 % finance
select pl.phase, pl.account_size, pl.daily_loss_limit, pl.consistency_rule
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite' and pr.slug = 'prime'
order  by pl.phase desc, pl.account_size;
-- attendu : daily_loss_limit non nul partout ; consistency_rule 0.4 en sim_funded

-- 5. Nitro finance en trailing equity, aucun plafond chiffre
select distinct pl.drawdown_type, pr.max_funded_accounts
from   firm_program_plans pl
join   firm_programs pr on pr.id = pl.program_id
where  pr.firm_slug = 'futureselite' and pr.slug = 'nitro' and pl.phase = 'sim_funded';
-- attendu : 'Trailing Equity', NULL

-- 6. Les colonnes de firme corrigees
select profit_split, max_profit_split, leverage_forex,
       (cost_timeline is null) as couts_retires,
       data_verified_at,
       platforms
from   prop_firms
where  slug = 'futureselite';
-- attendu : 80, 90, NULL, true, 2026-09-07, six plateformes

-- 7. Recapitulatif
select
  (select count(*) from firm_rules      where firm_slug = 'futureselite') as regles,
  (select count(*) from firm_platforms  where firm_slug = 'futureselite') as plateformes,
  (select count(*) from firm_live_tiers where firm_slug = 'futureselite') as paliers_live;
-- attendu : 33, 8, 5
```

Puis recharge la fiche **deux fois** : le premier appel sert une copie périmée.
