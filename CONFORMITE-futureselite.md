# FuturesElite — rapport de conformité

5 septembre 2026. Anglais uniquement.

## D'abord : pourquoi la version précédente a échoué

**Le brief a été écrit sur une copie en cache.** La page en ligne servait un
`X-Vercel-Cache: HIT` d'avant mon dernier déploiement. En forçant une copie
fraîche (`?cb=<timestamp>`), `TWO-STEP CONFIGURATOR` n'apparaissait plus,
`id="platforms"` et `id="about"` existaient déjà. Plusieurs reproches du brief
portaient donc sur du code supprimé.

Cela dit, **l'essentiel des reproches était fondé**. Les causes réelles :

1. **Composants absents.** La bande « at-a-glance » ne s'affichait pas parce que
   `PropFirmPageClient` lit `firm.value_strip`, une colonne que FuturesElite ne
   remplissait pas. Le composant existait, la donnée manquait.

2. **Composants dans le mauvais ordre.** `About` était rendu à l'intérieur du
   pli `id="reference"` (« Full specifications »), donc après les forces et
   invisible pour qui ne dépliait pas.

3. **Information dupliquée.** `programGuide` dans `ChallengeSelector.tsx`
   affichait un second jeu de boutons `Select Nitro` / `Select Prime` juste
   sous le configurateur : deux mécanismes pour une seule décision.

4. **Champs promotionnels en base non rendus.** C'est le défaut le plus coûteux.
   `lib/firm-programs.ts` chargeait les **16 lignes de `firm_promotions`** pour
   FuturesElite, et **aucun composant ne les lisait**. La fiche n'affichait que
   `prop_firms.discount_code` / `discount_percent`, délibérément NULL pour cette
   firme. Résultat : prix standard partout, alors que des remises vérifiées de
   20 à 35 % existaient en base.

5. **Client et serveur.** Oui, même source : `page.tsx` charge tout côté serveur
   et passe `programData` au client. Aucune requête client.

6. **Hero et CTA final ne lisaient pas la sélection.** Le CTA final n'affichait
   que `t.readyCta(firm.name)`. `selectionKey` existait mais n'alimentait que la
   section des règles par phase.

7. **Firmes similaires.** Le composant existe et n'a jamais été omis. La section
   est masquée parce que le filtre ne trouve aucune firme éligible — voir §10.

## Table de conformité

| # | Correction | État |
|---|---|---|
| 1 | Deal et code promo restaurés | **PASS (code)** — voir réserve ci-dessous |
| 2 | `TWO-STEP CONFIGURATOR` → `ACCOUNT CONFIGURATOR` | **PASS** |
| 3 | Second sélecteur de programme supprimé | **PASS** |
| 4 | Bande « at-a-glance » | **PASS** |
| 5 | `Stacking accounts` sort du parcours | **PASS** |
| 6 | Règles critiques en 3 catégories | **PASS** |
| 7 | About avant Strengths | **PASS** |
| 8 | Verdict avec les deux groupes | **PASS** |
| 9 | CTA final avec sélection et deal | **PASS** |
| 10 | Firmes similaires conditionnelles | **PASS (filtre)** — voir §10 |
| 11 | Duplication et hauteur | **PARTIEL** |
| 12 | Impression sans pages blanches | **NON DÉMONTRÉ** |

`PASS (code)` signifie : implémenté, type-check et tests passés, **mais non
observé sur une page rendue** — voir la réserve finale.

### §2 — la vraie source

`Two-step configurator` ne venait pas du composant supprimé mais de
`ChallengeSelector.tsx`, dans les sept dictionnaires. Ma première recherche en
majuscules l'avait manqué : la source est en minuscules, c'est le CSS qui
capitalise. Corrigé en `Account configurator`. L'étiquette est partagée par les
350 fiches, elle était donc fausse pour toute firme ne vendant pas deux phases.

### §1 — le deal, et la réserve qui te revient

`lib/program-to-challenges.ts` calcule maintenant le prix remisé **par ligne**,
depuis `firm_promotions`. La remise varie par programme et par taille : une
valeur unique au niveau firme afficherait le mauvais prix partout sauf sur un
palier.

Deux familles de promotions cohabitent et les confondre coûte de l'argent au
visiteur :

- `SCANNED`, notre code partenaire, **−20 %**, `is_public: false`, préremplit le
  lien d'affiliation ;
- `SUMMER`, l'offre publique de la firme, **25 à 35 %** selon le plan,
  `is_public: true`, s'active seule.

Le prix affiché est celui que le visiteur paiera **en passant par nous**, donc
celui de `SCANNED`. Et parce que l'offre publique fait mieux, la note sous le
prix le dit : *« The firm currently advertises a public offer of up to 35 % on
some plans, which is larger than this code. Check the checkout total before
paying. »*

C'est ce que demande le brief — « represent both truthfully », « never call
SCANNED the best deal ». Mais la conséquence est réelle : **notre lien fait
payer plus cher que l'offre publique**. La demande de réalignement est notée
dans `editorial_note`. Tant qu'elle n'aboutit pas, la fiche dira au visiteur de
vérifier son total. C'est ta décision de garder ce lien ; je l'applique
honnêtement.

### §10 — pourquoi la section est masquée

Requête dans `app/[locale]/prop-firm/[slug]/page.tsx` :

    .from('prop_firms')
    .select('… affiliate_url, discount_code, discount_percent, discount_expires_at')
    .neq('id', firm.id)
    .eq('is_futures', true)
    .order('trustpilot_rating', { ascending: false })
    .limit(30)

puis filtre `isComplete` : logo, note, prix, split **et** `affiliate_url` **et**
`discount_code` **et** `discount_percent`, plus `discount_expires_at` nul ou
futur.

La section est masquée pour FuturesElite parce que **zéro firme futures ne
satisfait les trois conditions**. Je ne peux pas te dire lesquelles échouent sur
quel critère : je n'ai pas accès à la base. La requête est la bonne, le composant
n'a pas été omis.

### §11 — ce que j'ai fait, et ce que je n'ai pas fait

Fait : second sélecteur supprimé, `Stacking accounts` déplacé du parcours vers
les règles, hauteurs d'écran neutralisées à l'impression.

Pas fait : l'audit complet de redondance entre les huit sections listées. Le
recoupement `True cost` / `Full specifications` / `Strengths` demande de lire le
rendu réel pour juger ce qui se répète — je ne peux pas le rendre.

### §12 — non démontré

Le CSS d'impression neutralise `min-h-*` et `h-screen`, réserve
`break-inside: avoid` aux blocs courts plutôt qu'aux sections entières, ouvre
les accordéons et pose `orphans`/`widows`. **Je n'ai pas pu produire de PDF** :
il faut une page rendue.

## Fichiers modifiés

    app/[locale]/prop-firm/[slug]/ChallengeSelector.tsx
    app/[locale]/prop-firm/[slug]/PropFirmPageClient.tsx
    app/globals.css
    lib/program-to-challenges.ts
    scripts/firm-content.mjs
    scripts/test-program-selection.mjs
    database/RUN-futureselite.sql   (régénéré, 35 colonnes, 6 blocs éditoriaux)
    database/RUN-ftmo.sql           (régénéré)

## Champs canoniques

| Usage | Champ |
|---|---|
| Prix standard | `firm_program_plans.regular_price` |
| Prix remisé | calculé : `regular_price × (1 − promotion.discount_value)` |
| Code promo | `firm_promotions.code` où `is_public = false` |
| Offre publique | `firm_promotions` où `is_public = true` |
| Validité | `starts_at` / `expires_at`, évalués au rendu |
| Suivi affilié | `buildAffiliateUrl()` → `/api/go/[slug]` |

## Tests

`npm run test:programs` — **97 assertions, toutes vertes.**
`npx tsc --noEmit` — propre hors les deux erreurs `vitest` documentées.
`npm run build` — `✓ Compiled successfully`, puis l'échec d'environnement connu.

## Ce que je ne peux pas démontrer, et pourquoi

Le brief demande de ne pas déclarer la tâche terminée si un critère échoue. **Je
ne la déclare pas terminée.**

Trois catégories de critères restent non vérifiées : les captures desktop et
mobile, le PDF, et « aucune erreur console, d'hydratation ou d'accessibilité ».
Toutes exigent une page qui s'affiche.

Il n'y a pas de `.env.local` sur cette machine — seulement `.env.example`. Le
build s'arrête à *Collecting page data*, et `npm run dev` ne servirait pas
davantage la fiche. Il me faut :

    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    STRIPE_SECRET_KEY

Ou bien passe le SQL, déploie, et dis-le-moi : je mesure sur la production.

## SQL à passer

    database/RUN-futureselite.sql   ← bande de faits, parcours, règles, verdict
    database/RUN-ftmo.sql
    database/RUN-the5ers.sql

Sans le premier, aucune correction de données n'est visible : ni la bande
« at-a-glance », ni les trois catégories de règles, ni le second groupe du
verdict, ni le retrait de `Stacking accounts`.

## Faits restant à confirmer auprès de FuturesElite

- **Réalignement de `SCANNED`** sur l'offre publique. C'est la demande la plus
  utile : tant que notre code donne moins, notre lien dessert le visiteur.
- **Elite 25K** : 3 jours minimum sur le configurateur, 6 dans la FAQ paiements.
- **Régularité** : 40 % et 50 % affichés côte à côte sans dire laquelle
  s'applique.
- **Scalping** : « No » sur tous les plans, sans définition ni seuil.
- **News trading financé** : « With restrictions », fenêtre non précisée.
- **Expiration de SUMMER** : non publiée.
- **Trustpilot** : « 4,3 — 25 avis » sans source, retrait préparé.
