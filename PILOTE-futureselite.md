# Pilote FuturesElite — code prêt, bascule non activée en production

8 septembre 2026. **Aucun SQL exécuté.** Anglais seulement. FTMO, The5ers et
les traductions non touchés.

## 1. Périmètre du pilote

`app/[locale]/prop-firm/[slug]/page.tsx` :

```ts
const PILOTE_MODELE = new Set(['futureselite'])
```

Une liste explicite plutôt qu'un drapeau global : la bascule se décide firme
par firme, et une régression ne peut toucher que les slugs énumérés. Les ~349
autres fiches empruntent le chemin actuel, inchangé.

`components/prop-firm/FirmPage.tsx` est **générique** — aucun branchement sur
un slug, aucune valeur FuturesElite en dur. Élargir le pilote consiste à
ajouter un slug à la liste, pas à toucher au composant.

## 2. Différences avec l'ancienne page

### Attendues et validées

| Différence | Ancienne page | Modèle |
|---|---|---|
| Remise SCANNED | 20 % (76 $ sur l'Elite 25K) | **30 %** (66,50 $) |
| Levier Forex | `1:100` affiché | **absent** — conditionné à `!is_futures`, et valeur mise à `null` |
| Faits de firme | 4, dont trois faux | **2** : « No activation fee », « Futures only » |
| Règles détaillées | absentes de l'écran | **33**, depuis `firm_rules` |
| Plateformes | 7 depuis `prop_firms.platforms` | **6 sélectionnables + 2 marketing**, depuis `firm_platforms` |
| Bundles | jamais rendus | **25 paliers** |
| Paliers live | table jamais requêtée | **5 paliers** |
| Section Costs | affichée | **absente** — `cost_timeline` est `null` |
| Règles critiques | `prop_firms.key_rules` | **`firm_rules`**, 3 catégories × 3 règles |

Les trois faits de firme retirés méritent le détail, parce que ce n'est plus
une décision éditoriale mais un refus structurel :

| Fait | Motif du rejet, calculé |
|---|---|
| `90% profit split` | valeurs divergentes : 0.9 / 0.8 — Instant paie 80 % |
| `No daily loss limit` | valeurs divergentes — Prime en a une dans les deux phases |
| `End-of-day drawdown` | valeurs divergentes — Nitro financé est en trailing equity |

`universalFact()` interroge tous les plans de tous les programmes achetables et
exige une valeur **explicite** partout. Un `null`, un `needs_confirmation` ou
un programme muet sur la phase concernée suffit à écarter le fait. Sept tests
couvrent ces cas.

### Inattendues ou à surveiller

| Point | Ce que c'est |
|---|---|
| **FAQ dérivée, plus rédigée** | L'ancienne page générait ses questions dans `PropFirmPageClient`. Le modèle en dérive quatre depuis ses propres valeurs, pour qu'une réponse ne puisse pas dire « 90 % » pendant que le tableau affiche 80 %. **Moins de questions qu'avant.** Si tu veux les anciennes, il faut les faire entrer dans le modèle. |
| **« Similar firms » absente** | Ta liste des sept sections ne la mentionne pas ; je ne l'ai pas rendue. Elle existe toujours sur les autres fiches. Dis-moi si elle doit revenir. |
| **Avertissement de risque absent** | Même raison. C'est le point que je signale le plus volontiers : il a une valeur légale, et son absence sur une fiche de produit financier est une décision, pas un oubli. |
| **Progression / scaling ladder** | `prop_firms.progression_tiers` n'entre pas dans le modèle ; `firm_live_tiers` la remplace. Pour FuturesElite les deux disent la même chose, mais ce ne sera pas vrai partout. |
| **`prop_firm_challenges` non lue** | Le pilote lit exclusivement les tables normalisées. La grille à plat reste écrite par le SQL, pour les autres fiches. |

## 3. Hiérarchie vérifiée

    4 programmes → 15 variantes commerciales → 27 phases

Trois tests verrouillent le piège : les 27 phases restent **imbriquées** dans
les 15 plans, ne deviennent jamais 27 cartes, et aucun plan ne porte deux fois
le même type de phase.

## 4. Preuves demandées

### Le bloc SCANNED existe dans le rendu serveur

`model.defaultPlanId` vaut `elite||25000`. `FirmPage` initialise son état avec
cette valeur — `useState(model.defaultPlanId)` — donc le premier rendu, celui
du serveur, porte déjà un plan, un prix et le code.

C'est la correction du défaut diagnostiqué hier : l'ancienne page attendait un
`useEffect` pour connaître la sélection, et le bloc n'existait pas dans le HTML.

**C'est une garantie structurelle, pas une mesure.** Je ne peux pas la vérifier
sur une page rendue — voir plus bas.

### Le CTA conserve le suivi affilié

`lib/affiliate.ts` :

```ts
return `/api/go/${firmSlug}?${params.toString()}`
```

`FirmPage` reçoit `ctaHref` construit par `buildAffiliateUrl(firm.slug, {
placement: 'hero', locale })` et ne fabrique aucune URL. Un test vérifie
qu'aucune URL partenaire en dur n'existe dans la fiche.

### Tests et build

    npm run model:report      34 assertions, toutes vertes
    npm run test:programs    148 assertions, toutes vertes
    npx tsc --noEmit         propre, hors les deux erreurs `vitest` documentées
    npm run build            ✓ Compiled successfully, puis l'échec d'environnement connu

### Captures : toujours impossibles

Il n'y a pas de `.env.local` sur cette machine, donc aucune page ne se
construit ici. Les six captures que tu demandes — desktop, mobile, Elite,
Prime, Instant — supposent une page rendue.

**Je ne les ai pas, et sans elles la validation avant bascule n'est pas
complète.** C'est pourquoi je ne te propose pas d'activer le pilote tout de
suite : voir l'étape 4 ci-dessous.

## 5. Ce que tu dois exécuter

### SQL, dans cet ordre

    1. database/RUN-futureselite-programs.sql
    2. database/RUN-futureselite.sql

Portée : `futureselite` uniquement. Aucun `ALTER`, aucun changement de schéma.

Fichier 1 — sept `delete` puis sept `insert` : 4 programmes, 27 plans,
16 promotions, 25 paliers de bundle, 8 plateformes, 33 règles, 5 paliers live.
Fichier 2 — `update prop_firms` sur 36 colonnes, puis 4 lignes dans
`prop_firm_challenges`.

### Requêtes de vérification, après exécution

```sql
-- 1. SCANNED a 30 %
select code, discount_value, is_public from firm_promotions
where firm_slug = 'futureselite' and is_public = false;
-- attendu : SCANNED, 0.30, false

-- 2. Six sélectionnables, deux marketing
select configurator_status, count(*) from firm_platforms
where firm_slug = 'futureselite' group by 1;
-- attendu : selectable 6, marketing_only 2

-- 3. Instant : 80 %, fin de journée, 20 % de régularité
select pl.account_size, pl.profit_split, pl.drawdown_type, pl.consistency_rule
from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id
where pr.firm_slug = 'futureselite' and pr.slug = 'instant' and pl.phase = 'sim_funded';
-- attendu : 0.8, 'End of Day', 0.2

-- 4. Prime : limite journalière dans les deux phases, 40 % financé
select pl.phase, pl.daily_loss_limit, pl.consistency_rule
from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id
where pr.firm_slug = 'futureselite' and pr.slug = 'prime';
-- attendu : daily_loss_limit non nul partout, 0.4 en sim_funded

-- 5. Nitro financé en trailing equity, aucun plafond chiffré
select distinct pl.drawdown_type, pr.max_funded_accounts
from firm_program_plans pl join firm_programs pr on pr.id = pl.program_id
where pr.firm_slug = 'futureselite' and pr.slug = 'nitro' and pl.phase = 'sim_funded';
-- attendu : 'Trailing Equity', NULL

-- 6. Colonnes de firme
select profit_split, max_profit_split, leverage_forex,
       (cost_timeline is null) as couts_retires, data_verified_at, platforms
from prop_firms where slug = 'futureselite';
-- attendu : 80, 90, NULL, true, 2026-09-07, six plateformes

-- 7. Récapitulatif
select (select count(*) from firm_rules      where firm_slug='futureselite') as regles,
       (select count(*) from firm_platforms  where firm_slug='futureselite') as plateformes,
       (select count(*) from firm_live_tiers where firm_slug='futureselite') as paliers_live;
-- attendu : 33, 8, 5
```

### Quand activer le nouveau rendu

Le code du pilote est **déjà dans le dépôt**, donc la bascule se produira au
premier déploiement. Trois façons de procéder, par ordre de prudence :

1. **Recommandé.** Passe le SQL d'abord, sur la base actuelle et l'ancien
   rendu encore en ligne. Vérifie les sept requêtes. La fiche actuelle
   affichera alors les bonnes données — 30 %, six plateformes, pas de levier —
   parce que l'ancien rendu lit les mêmes colonnes. **Puis** déploie, et je
   prends les captures sur la production.

2. Si tu préfères voir le nouveau rendu d'abord : donne-moi un `.env.local` et
   je livre les six captures avant tout déploiement.

3. Si tu veux différer la bascule : dis-le-moi, je remplace
   `new Set(['futureselite'])` par `new Set([])`, le pilote reste dormant et
   le SQL peut passer sans changer le rendu.

Dans les trois cas, recharge la fiche **deux fois** : le premier appel sert une
copie périmée.
