# SQL à exécuter — FuturesElite uniquement

Établi le 7 septembre 2026, après tes cinq corrections.

**Rien n'a été exécuté.** Je n'ai pas accès à ta base : ces deux fichiers
attendent que tu les colles dans **supabase.com → SQL Editor**.

---

## Un problème sérieux trouvé en préparant cet inventaire

`database/RUN-ftmo.sql` **contenait les règles de FuturesElite**.

Mon remplacement dans `scripts/firm-content.mjs` cherchait le bloc
`key_rules` par son titre. Quatre firmes partagent ce titre, et
`.index()` sans point de départ renvoie la **première** occurrence : celle de
FTMO. J'ai donc écrasé les règles de FTMO avec celles de FuturesElite, et
FuturesElite n'a jamais reçu les siennes.

C'est corrigé : les six règles d'origine de FTMO sont restaurées depuis
`1f73b6f`, et FuturesElite a maintenant ses trois catégories. Un test
(`17. Aucun contenu editorial ne fuit d une firme a l autre`) échoue désormais
si une empreinte d'une firme apparaît chez une autre.

**Conséquence pour toi :** ta version commitée de `RUN-ftmo.sql` est
contaminée. Ne la joue pas. La version corrigée est dans ton dépôt maintenant.
Tu m'avais dit de ne pas exécuter le SQL FTMO pour ce test — c'est heureux.

---

## Fichier 1 — `database/RUN-futureselite-programs.sql`

**Portée : `firm_slug = 'futureselite'` uniquement.** Sept `delete` suivis de
sept `insert`. Aucune autre firme n'est touchée, aucun `ALTER`, aucun
changement de schéma.

| Table | Lignes supprimées puis réinsérées |
|---|---|
| `firm_programs` | 4 |
| `firm_program_plans` | 27 |
| `firm_promotions` | 16 |
| `firm_program_bundles` | 25 |
| `firm_platforms` | 8 |
| `firm_rules` | 33 |
| `firm_live_tiers` | 5 |

**Ce qui change par rapport à ce qui est en base :**

- `firm_promotions` : la ligne `SCANNED` passe de **20 % à 30 %**, avec le
  libellé exact autorisé par ton relevé. Les 15 lignes `SUMMER` sont
  inchangées.
- `firm_platforms` : 6 → 8 lignes. Les six du configurateur en `selectable`,
  Volumetrica et DeepCharts en `marketing_only`.
- `firm_rules` : 28 → 33 lignes. Quatre conflits officiels ajoutés, plus la
  règle du jour profitable. **Aucune règle sur un prétendu conflit de jours
  minimum** — tu as raison, les 3 jours d'évaluation et les 6 jours profitables
  sont deux règles distinctes.
- `firm_programs` : `max_funded_accounts` de Nitro passe de `3` à `NULL`, et sa
  note ne mentionne plus le bundle.

**Le fichier se termine par une requête de contrôle** qui liste les 27 plans
avec leurs prix, objectifs et limites. C'est le dernier résultat affiché par
l'éditeur : lis-le avant de passer au fichier 2.

## Fichier 2 — `database/RUN-futureselite.sql`

**Portée : `slug = 'futureselite'` uniquement.**

- `update prop_firms` — **38 colonnes**, dont les quatre du hero
  (`headline`, `verdict`, `description`, `category_badge`) et les six blocs
  JSONB (`value_strip`, `key_rules`, `journey`, `cost_timeline`,
  `verdict_card`, `program_guide`).
- `delete from prop_firm_challenges` puis `insert` — **4 lignes**, la grille à
  plat historique.

**Ce qui change :**

- `platforms` : liste du configurateur, six entrées.
- `key_rules` : trois catégories au lieu d'une liste plate.
- `journey` : `Stacking accounts` retiré des étapes.
- `verdict_card` : le groupe `counterPoints` ajouté.
- `value_strip` : nouvelle, quatre faits.

---

## Réponses à tes cinq points

**1. Les jours minimum ne sont pas un conflit.** Corrigé. La règle
« Elite 25K minimum trading days » est supprimée, et la règle critique dit
maintenant : *« Two counts, not one figure: three trading days to complete the
Elite evaluation, then six profitable days before a payout can be requested.
They apply to different phases and both hold. »* Retiré aussi des questions à
poser à FuturesElite.

**2. Le bundle n'atteste rien sur les comptes financés.** Corrigé. Acheter cinq
évaluations ne dit rien du nombre de comptes qu'on peut détenir financés en
même temps. Le désaccord se limite à FAQ 3 contre configurateur MAX 4, et un
test vérifie que le mot « bundle » n'y figure plus.

**3. Formulation.** Ce que la comparaison a établi : **tous les champs
numériques recoupés ont été confirmés** — 27 prix, objectifs, pertes maximales
et journalières, jours minimum, plafonds, partages, quatre échelles de bundle.
Cela ne prouve pas que chaque règle soit complète : ton JSON et mes données ne
couvrent pas exactement les mêmes champs, et ce qui n'existe que d'un côté n'a
pas pu être recoupé.

**4. SCANNED est évalué par plan.** Confirmé, et c'était à corriger : ma note
était au niveau firme. `programsToChallenges` produit désormais
`publicOfferNoteByPlan`, indexé par `programSlug|variant|taille`. Le
configurateur affiche la note du plan **couramment sélectionné** via
`discountNoteFor(currentChallenge.id)`.

Concrètement : Elite 25K n'affiche aucun avertissement (SCANNED 30 % bat le
public 25 %), onze plans n'en affichent aucun (égalité), et seuls Prime 50K,
100K et 150K portent la note. Trois tests le verrouillent.

**Aucun badge « Best Deal » n'existe sur la fiche** — je l'ai vérifié par
recherche sur `app/[locale]/prop-firm` et `components`. Il en existe sur
`/deals` et la page d'accueil, hors périmètre de ce test ; dis-moi si tu veux
que je les audite aussi.

**5. Aucun SQL exécuté**, et FTMO comme The5ers sont hors de ce lot.

---

## Vérifications

`npm run test:programs` — **119 assertions, toutes vertes.**
`npx tsc --noEmit` — propre hors les deux erreurs `vitest` documentées.
`npm run build` — compile, puis l'échec d'environnement connu (pas de
`.env.local`).
