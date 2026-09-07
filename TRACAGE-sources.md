# Traçage des sources — fiche FuturesElite

7 septembre 2026. Lecture seule : aucun code ni SQL modifié.

## Deux découvertes avant le tableau

**1. Quatre des sept tables normalisées sont chargées et jamais affichées.**
`lib/firm-programs.ts` interroge `firm_programs`, `firm_program_plans`,
`firm_promotions`, `firm_program_bundles`, `firm_platforms`, `firm_rules` et
`firm_live_tiers`. Seules les trois premières atteignent le rendu.

Conséquence directe sur ce que tu constates : **les 33 règles de `firm_rules`
n'arrivent jamais à l'écran.** La page affiche `prop_firms.key_rules`, un JSONB
au niveau firme. De même, `firm_platforms` — la seule source qui distingue les
six plateformes sélectionnables des deux réservées à la page marketing — est
lue puis jetée ; c'est `prop_firms.platforms` qui s'affiche.

**2. `lib/firm-capabilities.ts` est orphelin.** `deriveCapabilities` est
exportée et appelée nulle part. Elle servait à `PlanSections`, supprimé.

---

## Tableau de traçage

Légende de la précédence : **A > B** signifie « A est utilisé quand il existe,
sinon B ». « aucune » signifie que les deux sources s'affichent en parallèle, à
deux endroits de la page, sans arbitrage.

| Section rendue | Champ affiché | Source primaire | Source de repli | Sources en double | Règle de précédence actuelle |
|---|---|---|---|---|---|
| 1. Hero | Titre H1 | `prop_firms.headline` | `prop_firms.name` | — | headline > name |
| 1. Hero | Présentation | `prop_firms.verdict` | aucun | — | — |
| 1. Hero | Badge marché | `prop_firms.category_badge` | `assets[0]` | — | badge > assets |
| 1. Hero | Note et avis | `prop_firms.trustpilot_rating` / `_reviews` | aucun | — | rendu si `> 0` |
| 1. Hero | Date de vérification | `prop_firms.data_verified_at` | aucun | — | — |
| 1. Hero | Prix « from » | `prop_firms.min_price` | aucun | `firm_program_plans.regular_price` | **aucune** — le hero montre le minimum firme, le configurateur le prix du plan choisi |
| 1. Hero | Bloc d'offre (% et prix) | `firm_promotions` via l'adaptateur | `prop_firms.discount_percent` | `prop_firms.discount_code` | promotions normalisées > colonne firme |
| 2. Bande de faits | 4 faits | `prop_firms.value_strip` | aucun | — | rendu si non vide |
| 3. Plateformes | Liste | `prop_firms.platforms` (TEXT) | aucun | **`firm_platforms`** | **aucune — `firm_platforms` n'est pas rendue** |
| 3. Plateformes | Actifs | `prop_firms.assets` | aucun | — | — |
| 3. Plateformes | Flux de données | `prop_firms.checkout_options.options[].name` | aucun | — | — |
| 4. Configurateur | Lignes de plans | `firm_programs` + `firm_program_plans` via `programsToChallenges` | `prop_firm_challenges` | les deux tables décrivent les mêmes plans | normalisé > legacy, si au moins un plan |
| 4. Configurateur | Cartes de programme | `firm_programs.summary` (guide synthétisé) | `prop_firms.program_guide` | — | normalisé > JSONB |
| 4. Configurateur | Devise | `firm_program_plans.currency` | `prop_firms.price_currency` | — | plan > firme |
| 4. Configurateur | Code promo | `firm_promotions.code` (`is_public = false`) | `prop_firms.discount_code` | — | normalisé > firme |
| 4. Configurateur | Note de remise | `firm_promotions` comparée par plan | `prop_firms.discount_note` | — | par plan > firme |
| 4. Configurateur | Options de checkout | `prop_firms.checkout_options` | aucun | — | — |
| 5. Parcours | Étapes | `prop_firms.journey` | aucun | `firm_program_plans` (phases réelles) | **aucune** — le parcours est figé au niveau firme |
| 5bis. Règles par phase | Toutes les valeurs | `firm_program_plans` filtré par sélection | aucun | `prop_firms.key_rules`, `specs` | **aucune** — trois blocs décrivent les mêmes règles |
| 6. Coûts | Étapes de coût | `prop_firms.cost_timeline` | aucun | `firm_program_plans.reset_fee` / `activation_fee` | **aucune** |
| 7. Formation | Bloc | `prop_firms.education` | aucun | — | rendu si non nul |
| 8. Règles clés | Cartes | `prop_firms.key_rules` | aucun | **`firm_rules` (33 lignes)** | **aucune — `firm_rules` n'est pas rendue** |
| 9. Palier de scaling | Tableau | `prop_firms.progression_tiers` | aucun | `firm_live_tiers` | **aucune — `firm_live_tiers` n'est pas rendue** |
| 10. À propos | Récit | `prop_firms.description` | aucun | — | — |
| 10. À propos | Faits | `founded_year` \| `year_founded` \| `founded`, `headquarters`, `is_futures`, `payout_methods`, `profit_split`, `max_profit_split`, `min_price`, `max_price`, `payout_frequency`, `drawdown_type`, `regulation_details` | chacun s'efface si vide | `firm_program_plans` porte split et prix par plan | **aucune** |
| 11. Forces et limites | Listes | `prop_firms.pros` / `cons` | aucun | — | — |
| 11. Référence complète | `specs[]` | `leverage_forex`, `payout_speed_days`, `min_payout`, `scaling_max`, `max_allocation`, `drawdown_type`, `consistency_rule`, `time_limit`, `payout_methods` | chacun conditionnel | `firm_program_plans` pour drawdown et régularité | **aucune** |
| 12. Verdict | Corps et points | `prop_firms.verdict_card` | aucun | — | — |
| 13. FAQ | Questions | `generateFAQs(firm, …)` — code, alimenté par `prop_firms` | aucun | — | — |
| 14. CTA final | Plan et prix | `configurateur.challenges` filtré par sélection | aucun | — | même état que le configurateur |
| 15. Firmes similaires | Cartes | `prop_firms` (requête séparée) | aucun | — | filtre à trois conditions |
| 16. Avertissement | Texte | code (`t.risk`) | aucun | — | — |

### Les doublons qui produisent les incohérences que tu as vues

| Concept | Endroit A | Endroit B | Effet |
|---|---|---|---|
| Type de drawdown | `specs` → `prop_firms.drawdown_type` (« End of day », valeur unique) | Règles par phase → `firm_program_plans.drawdown_type` (par programme et phase) | Nitro financé affiche « Trailing Equity » dans un bloc et « End of day » dans l'autre |
| Régularité | `specs` → `prop_firms.consistency_rule` | Règles par phase → `firm_program_plans.consistency_rule` | Idem pour Prime (40 % financé) et Instant (20 %) |
| Partage des profits | Hero et « À propos » → `prop_firms.profit_split` | Résumé et phases → `firm_program_plans.profit_split` | Instant affiche 80 % dans un bloc, la valeur firme dans l'autre |
| Prix | Hero « from » → `prop_firms.min_price` | Configurateur → `firm_program_plans.regular_price` | Deux prix pour la même firme sur un même écran |
| Règles | Règles clés → `prop_firms.key_rules` | `firm_rules`, chargée, jamais rendue | Les 33 règles vérifiées n'atteignent pas le lecteur |
| Plateformes | Bande du haut → `prop_firms.platforms` | `firm_platforms`, chargée, jamais rendue | La distinction sélectionnable / marketing est perdue |
| Levier | `specs` → `prop_firms.leverage_forex` | — | S'affiche sur une firme futures ; aucun SQL de mise à jour ne touche cette colonne |

---

## Proposition : un seul `FirmPageModel`

### Principe

La page générique reçoit **un objet** et n'interroge plus rien. Toute la
résolution des sources et des priorités se fait en un seul endroit, côté
serveur, avant le rendu.

    app/[locale]/prop-firm/[slug]/page.tsx
      └─ buildFirmPageModel(slug, locale)      ← lib/firm-page-model.ts
           ├─ lit prop_firms, prop_firm_challenges et les 7 tables normalisées
           ├─ applique les règles de précédence, une fois, explicitement
           └─ renvoie FirmPageModel
      └─ <PropFirmPageClient model={model} />  ← ne reçoit plus que cela

### Forme

```ts
interface FirmPageModel {
  identity: {
    slug: string; name: string; headline: string; intro: string
    marketBadge: string | null; logoUrl: string | null
    verifiedAt: string | null
  }

  // Faits vrais pour TOUS les programmes. Un fait qui dépend du programme
  // n'entre pas ici : il vit dans `plans`.
  firmFacts: { label: string; detail: string | null }[]

  catalogue: {
    platforms: { name: string; selectable: boolean; note: string | null }[]
    assets: string[]
    dataFeeds: string[]
  }

  // Le catalogue vendable, déjà résolu : normalisé si disponible, legacy sinon.
  plans: SelectablePlan[]      // { id, program, variant, size, phases[], price… }
  programs: ProgramSummary[]   // { slug, name, differentiator, kind }

  // Résolue par plan, pas au niveau firme.
  offer: {
    code: string | null
    percentByPlanId: Record<string, number>
    priceByPlanId: Record<string, { list: number; final: number }>
    betterPublicOfferByPlanId: Record<string, string>
    trackingUrl: string
    disclosure: string
  } | null

  rules: {
    byPhase: PhaseRuleRow[]                  // suit la sélection
    critical: { category: string; title: string; detail: string; severity: string }[]
    complete: { scope: string; title: string; detail: string; sourceUrl: string | null;
                confidence: string | null }[]
  }

  narrative: {
    about: string[]            // paragraphes
    strengths: string[]; limits: string[]
    verdict: { body: string; goodFit: string[]; poorFit: string[] } | null
    faq: { question: string; answer: string }[]
    journey: { title: string; detail: string }[]   // dérivé des phases réelles
  }

  similarFirms: SimilarFirm[]
  provenance: Record<string, { table: string; column: string; verifiedAt: string | null }>
}
```

### Ce que le modèle règle

| Problème actuel | Ce que le modèle impose |
|---|---|
| Sept tables chargées, trois rendues | Un seul constructeur : ce qui n'entre pas dans le modèle n'est pas requêté |
| Doublons sans arbitrage | Une seule clé par concept ; la précédence est écrite une fois dans le constructeur |
| Faits firme mélangés aux faits programme | Deux champs distincts, `firmFacts` et `plans` — un fait propre à un programme ne **peut pas** entrer dans `firmFacts` |
| `firm_rules` jamais rendue | `rules.complete` la lit ; si elle est vide, repli documenté sur `key_rules` |
| Levier forex sur une firme futures | `firmFacts` est construit à partir du marché : la ligne n'est pas produite |
| Origine d'une valeur introuvable | `provenance` porte table, colonne et date pour chaque champ affiché |

### Précédences à inscrire dans le constructeur

1. `firm_program_plans` prime sur `prop_firm_challenges` — dès qu'un plan existe.
2. `firm_rules` prime sur `prop_firms.key_rules`.
3. `firm_platforms` prime sur `prop_firms.platforms`, et porte `selectable`.
4. `firm_promotions` prime sur `prop_firms.discount_*`, **par plan**.
5. `firm_program_plans` prime sur `prop_firms.drawdown_type`, `consistency_rule`
   et `profit_split` — ces trois colonnes firme cessent d'être affichées quand
   des plans existent.
6. Le parcours se **dérive** des phases réelles au lieu d'être stocké.
7. Une valeur qui dépend du programme n'a pas de repli au niveau firme : elle
   s'efface plutôt que d'afficher une moyenne.

### Migration proposée, FuturesElite en pilote

1. Écrire `lib/firm-page-model.ts` et ses tests, sans y brancher la page.
2. Comparer, pour FuturesElite, chaque champ du modèle à ce que la page affiche
   aujourd'hui — un rapport d'écarts, pas un remplacement.
3. Ne brancher `PropFirmPageClient` sur le modèle qu'après validation de ce
   rapport. Une firme sans lignes normalisées passe par le même constructeur,
   qui retombe sur les colonnes firme : les ~349 autres fiches ne changent pas.
4. Supprimer alors `lib/firm-capabilities.ts` s'il reste inutilisé.

Anglais seulement, et rien de touché sur FTMO, The5ers ni les traductions.

**Aucune de ces étapes n'est engagée** : tu as demandé le traçage et la
proposition, pas la mise en œuvre.
