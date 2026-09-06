# Gabarit générique de fiche prop firm — livraison

5 septembre 2026. Anglais uniquement, comme demandé.

## 1. Audit et sources de vérité dupliquées

**Route et arbre de composants.** Une seule route sert les 350 fiches :
`app/[locale]/prop-firm/[slug]/page.tsx` → `PropFirmPageClient.tsx` →
`ChallengeSelector.tsx`. **Earn2Trade n'a aucun composant propre** : elle rend
déjà par ce gabarit. C'était le point décisif de l'audit — il n'y avait pas
deux implémentations à réconcilier, mais une implémentation et une greffe.

**Sources de données.** `prop_firms` (identité, éditorial, promotions, colonnes
JSONB `journey` / `cost_timeline` / `key_rules` / `verdict_card` /
`program_guide` / `checkout_options`), `prop_firm_challenges` (grille à plat
historique), et les 7 tables normalisées `firm_programs`, `firm_program_plans`,
`firm_promotions`, `firm_program_bundles`, `firm_platforms`, `firm_rules`,
`firm_live_tiers`.

**Duplications trouvées, toutes résolues :**

| Duplication | Résolution |
|---|---|
| Deux configurateurs (`ChallengeSelector` et `ProgramExplorer`) rendant la même grille à 20 px près | `ProgramExplorer` supprimé, 849 lignes |
| Deux jeux de sections décision (`journey`/`cost_timeline`/`key_rules` contre `PlanSections`) | `PlanSections` supprimé, 500 lignes |
| Deux listes de plateformes FuturesElite (`futureselite-programs.mjs` et `firm-content.mjs`) | Alignées, et le second alimente bien la colonne affichée |
| `profit_split` et `max_profit_split` | Lecture `profit_split ?? max_profit_split`, déjà en place |

## 2. Arbre de composants final

    page.tsx  (serveur : requêtes, métadonnées, hreflang, firmes similaires)
      └─ PropFirmPageClient.tsx        état de sélection unique
           ├─ ChallengeSelector.tsx    configurateur + résumé collant
           ├─ EvaluationVsFunded.tsx   règles par phase          ← seul ajout
           └─ FirmLogo, Disclosure, FAQItem, SectionHeading

Aucun composant nommé d'après une firme. Aucun `if (slug === '…')` dans un
composant de présentation — vérifié par le test 11.

## 3. Contrat de données

Pas de migration nouvelle : les 7 tables normalisées suffisaient. Le geste
architectural est un **adaptateur**, `lib/program-to-challenges.ts`, qui traduit
`firm_programs` → `Challenge[]`, la forme que le configurateur lit déjà.

C'est ce qui évite le second système de design : une firme à programmes
normalisés entre par la porte existante. Une firme sans ces lignes continue de
servir `prop_firm_challenges`, sans un pixel de changement.

Une clé stable `programSlug|variantKey|size` fait le pont : le configurateur la
remonte, la page la résout, les sections dépendantes la lisent. **Un seul état
de sélection**, jamais une copie du prix ou du drawdown dans un composant.

## 4. Composants réutilisés

`ChallengeSelector` (grille `[minmax(0,1fr)_340px]`, aside `lg:sticky lg:top-20`,
copie du code promo), `SectionHeading`, `Disclosure`, `FAQItem`, `FirmLogo`, et
les 16 sections du gabarit. Aucun token de style nouveau.

## 5. Mapping FuturesElite

4 programmes, 27 plans, 29 règles, 25 paliers de bundle, 7 plateformes.
Quatre champs éditoriaux ajoutés — `headline`, `verdict`, `description`,
`category_badge` — sans lesquels le H1 retombait sur le nom de la firme.

## 6. Non-régression Earn2Trade

Aucune ligne dans `firm_programs`, donc chemin historique inchangé. Son
sélecteur de flux de données (`checkout_options`) reste passé dans les deux
cas : le câblage précédent était exclusif et le lui aurait fait perdre le jour
où elle aurait reçu des programmes normalisés.

## 7. Tests

`npm run test:programs` — **91 assertions, toutes vertes.**

Notables : test 13 (un seul système de fiche, fichiers morts absents, aucune
porte n'éteint les sections), test 14 (basculement de programme, Instant sans
phase d'évaluation, unités de risque cohérentes), test 15 (un seul H1,
plateformes avant le configurateur, région live, FAQ deux colonnes, phrase
interdite absente, alternatives filtrées, aucune URL partenaire en dur).

`npx tsc --noEmit` : propre hors les deux erreurs `vitest` documentées.
`npm run build` : `✓ Compiled successfully` puis l'échec d'environnement connu.

## 8. Faits restant à confirmer auprès des firmes

- **FuturesElite, Elite 25K** : 3 jours minimum sur le configurateur, 6 dans la
  FAQ paiements. Publié `Needs confirmation` avec les deux liens.
- **FuturesElite, régularité** : 40 % et 50 % affichés côte à côte sans dire
  laquelle s'applique.
- **FuturesElite, scalping** : « No » sur tous les plans, sans définition ni
  seuil de durée.
- **FuturesElite, news trading financé** : « With restrictions », fenêtre
  d'événement non précisée.
- **FuturesElite, Trustpilot** : « 4,3 — 25 avis » sans source ; Trustpilot
  répond par un contrôle anti-robot. Retrait préparé.
- **The5ers 200K** : objectif financé lu à 100 % dans le classeur, non importé,
  lignes marquées `needs_confirmation`.

---

## Ce que je n'ai pas pu faire

**Captures d'écran responsive** (livrable 7) et vérifications à 320 / 375 / 768
/ 1024 px. Elles supposent une page qui s'affiche, donc une base qui répond.
Il n'y a pas de `.env.local` sur cette machine : ni `npm run build` ni
`npm run dev` ne servent la fiche.

Il me faut `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` et `STRIPE_SECRET_KEY` — ou bien déploie et
dis-le-moi, je prends les captures sur la production.

Sans ça, je ne peux pas non plus vérifier « pas d'erreur console, pas d'erreur
d'hydratation » ni la navigation clavier réelle. Le code est écrit pour
(boutons natifs, `aria-expanded`, `aria-selected`, `role="status"` poli,
cibles 44 px), mais écrit n'est pas mesuré, et je ne l'annoncerai pas comme
vérifié.

**Le lint.** Le projet n'a aucune configuration ESLint : `npm run lint` propose
d'en créer une. Je n'en ai pas ajouté — c'est une décision de projet, pas une
correction de fiche.
