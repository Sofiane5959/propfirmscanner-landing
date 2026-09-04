# Audit avant implémentation — FTMO et The5ers

Demandé par la section 10 du brief. **Rien n'a été modifié.** Aucune migration,
aucun déploiement, aucune donnée de production touchée.

Mesuré en production le 4 septembre 2026 sur `/es/prop-firm/ftmo`,
`/es/prop-firm/the5ers` et `/es/prop-firm/futureselite` (référence).

---

## 1. Pourquoi le changement de programme ne met pas la page à jour

Deux causes distinctes, et il faut les traiter séparément.

**FTMO et The5ers n'ont aucune ligne dans `firm_programs`.** Mesuré : leurs
pages servent encore `ChallengeSelector`, l'ancien configurateur alimenté par
`prop_firm_challenges`. Cette table porte une ligne plate par challenge, sans
notion de phase ni de variante. Rien à mettre à jour, donc : il n'y a pas de
sélection qui pilote quoi que ce soit.

**Sur FuturesElite, où le nouveau configurateur existe, il ne pilote qu'une
section.** Le reste de la page — verdict, règles clés, parcours, coûts, points
forts, FAQ — vient de colonnes **JSONB au niveau de la firme** :
`verdict_card`, `key_rules`, `journey`, `cost_timeline`, `pros`, `cons`. Aucune
ne connaît le programme sélectionné. Passer d'Elite à Nitro met donc à jour le
bloc du configurateur et laisse tout le bas de page en version Elite.

C'est la cause structurelle. Tant que ces blocs restent au niveau firme, aucun
ajustement de composant ne les rendra dépendants de la sélection.

---

## 2. Hiérarchie actuelle des composants

    app/[locale]/prop-firm/[slug]/page.tsx        serveur : requêtes, metadata, JSON-LD
      └─ PropFirmPageClient.tsx                   rendu, fusion des traductions
           ├─ ChallengeSelector.tsx               FTMO, The5ers, ~348 firmes
           └─ ProgramExplorer.tsx                 FuturesElite uniquement

`page-seo.tsx` est du code mort : importé nulle part.

## 3. Sources de données

| Donnée | Où | Qui l'utilise |
|---|---|---|
| Identité, verdict, règles éditoriales | `prop_firms` (JSONB) | toutes les fiches |
| Traductions éditoriales | `prop_firms.translations` | fusion client par locale |
| Challenges historiques | `prop_firm_challenges` | ChallengeSelector |
| Programmes normalisés | `firm_programs` + `firm_program_plans` | ProgramExplorer |
| Promotions normalisées | `firm_promotions` | ProgramExplorer |
| Règles | `firm_rules` | ProgramExplorer |
| Promotion firme | colonnes `discount_*` de `prop_firms` | prix barré, bandeau |

**Deux systèmes de promotion coexistent** : les colonnes `discount_*` au niveau
firme, et la table `firm_promotions`. Une firme migrée a les deux, et rien ne
dit lequel fait foi.

## 4. État mesuré des trois pages espagnoles

| | FTMO | The5ers | FuturesElite |
|---|---|---|---|
| Configurateur | historique | historique | normalisé |
| Canonical | **anglais** | **anglais** | espagnol ✓ |
| hreflang | en, fr | en, fr | 7 langues ✓ |
| JSON-LD | AggregateOffer 79–1080 **EUR** ✓ | AggregateOffer 22–850 USD ✓ | AggregateOffer 95–569 USD ✓ |
| CTA configurateur | `placement=challenge-selector` + challenge | idem | `placement=configurator&program=&size=` ✓ |
| Fragments anglais visibles | « Evaluation » | « Funded account », « Evaluation » | « Evaluation » |

**Le canonical anglais de FTMO et The5ers n'est pas un bug de code.** Le code
déclare les locales présentes dans `translations` ; leurs lignes n'en portent
qu'une, `fr`. Les fichiers `RUN-ftmo.sql` et `RUN-the5ers.sql` régénérés
contiennent les six bundles mais **n'ont pas été rejoués**. Les repasser
corrige le canonical, les hreflang et le contenu espagnol sans toucher au code.

**Les fragments anglais restants viennent des nouvelles tables.**
`firm_rules.title`, `firm_programs.summary` et `firm_program_plans.editorial_note`
sont des colonnes **monolingues**. Le schéma normalisé n'a aucun mécanisme de
traduction, contrairement à `prop_firms.translations`.

---

## 5. Écarts entre le schéma actuel et le modèle demandé

Le modèle du template est `Firm → Market → Program family → Program → Variant →
Phase → Rule`. Le schéma actuel s'arrête à `Firm → Program → (Phase, Size)`.

| Manque | Conséquence concrète |
|---|---|
| `market` | FTMO Futures Beta et The5ers Futures ne peuvent pas être séparés des CFD |
| `program_family` | Summer Plan ne peut pas être distingué des programmes classiques |
| **couche `variant`** | Standard et Swing ne peuvent pas coexister à la même taille ; les variantes 8/5 et 10/5 du Summer 2-Step 100K non plus |
| `currency` par variante | FTMO facture en EUR, The5ers en USD : aujourd'hui la devise est au niveau firme |
| `platform` par variante | impossible de filtrer les plateformes par programme |
| `target_variant` | les quatre variantes Summer 2-Step ne sont pas exprimables |
| `post_pass_fee` | The5ers Bootcamp et le remboursement au 3ᵉ payout n'ont pas de champ |
| phase : `leverage`, `time_limit`, `minimum_profitable_days`, `news_rule`, `overnight_rule`, `weekend_rule`, `payout_eligible` | règles par phase non représentables |
| règle : `rule_type`, `calculation_basis`, `reset_time`, `applies_to_phase` | une règle ne peut pas être rattachée à une phase |
| conséquences | 5 valeurs aujourd'hui ; le template en demande 7 (`temporary_pause`, `payout_adjustment`, `eligibility_condition`, `informational` manquent) |
| promotion : `eligible_markets`, `eligible_variants`, `stacking_rule`, `checkout_verified`, `affiliate_exclusive` | la promo 20 % 1-Step 100K de FTMO ne peut pas être limitée à ses variantes éligibles |
| **traductions** | aucune des sept nouvelles tables n'a de mécanisme i18n |

`firm_program_plans` confond variante et phase : sa clé unique est
`(program_id, phase, account_size)`. Deux variantes de même taille — Standard et
Swing, ou 8/5 et 10/5 — entrent en collision.

---

## 6. Inventaire des produits et classification proposée

### FTMO

| Produit | Marché | Statut proposé | Base |
|---|---|---|---|
| CFD 1-Step | CFD | `active` | table de comparaison officielle |
| CFD 2-Step Standard | CFD | `active` | idem |
| CFD 2-Step Swing | CFD | `active` | idem |
| FTMO Futures Beta | Futures | `beta` | à modéliser séparément, données incomplètes |

### The5ers

| Produit | Marché | Statut proposé | Base |
|---|---|---|---|
| Summer Plan CFD 1-Step 100K | CFD | `promotional` | dossier du 4 sept. |
| Summer Plan CFD 2-Step 100K 8/5 | CFD | `promotional` | idem |
| Summer Plan CFD 2-Step 100K 10/5 | CFD | `promotional` | idem |
| Summer Plan CFD 2-Step 200K 8/5 | CFD | `promotional` | idem |
| Summer Plan CFD 2-Step 200K 10/5 | CFD | `promotional` | idem |
| Summer Plan Futures 25K / 50K / 100K / 150K | Futures | `promotional` | idem |
| High Stakes | CFD | `unverified` | présent sur la fiche, disponibilité checkout non revérifiée |
| Bootcamp | CFD | `unverified` | idem |
| Pro Growth | CFD | `unverified` | idem |
| Hyper Growth | CFD | `unverified` | idem |
| Stock Trading | Stocks | `unverified` | mentionné, aucune donnée |

Le brief interdit de supprimer les programmes classiques avant vérification du
checkout. Ils passent donc en `unverified`, pas en `discontinued`.

## 7. Matrices de prix

### FTMO 2-Step, EUR

| Taille | Prix |
|---|---:|
| 10K | 89 € |
| 25K | 250 € |
| 50K | 345 € |
| 100K | 540 € |
| 200K | 1 080 € |

La valeur **439 €** vue sur le 100K reste à qualifier : promotion, devise ou
variante différente. Non importée.

La matrice **1-Step par devise n'existe pas** dans le dossier : à relever.

### The5ers Summer Plan CFD

| Produit | Taille | Objectifs | Prix | Payout cap |
|---|---|---|---:|---:|
| 1-Step | 100K | 10 % | 249 $ | 2 000 $ |
| 2-Step | 100K | 8 / 5 | 179 $ | 2 000 $ |
| 2-Step | 100K | 10 / 5 | 149 $ | 2 000 $ |
| 2-Step | 200K | 8 / 5 | 279 $ | 3 000 $ |
| 2-Step | 200K | 10 / 5 | 249 $ | 3 000 $ |

### The5ers Summer Plan Futures

| Taille | Prix | Cible éval. | Cible funded | Max loss EOD | Contrats | Overnight |
|---|---:|---:|---:|---:|---|---|
| 25K | 69 $ | 6 % | 4 % | 4 % | 2 mini / 20 micro | 1 mini / 10 micro |
| 50K | 120 $ | 6 % | 4 % | 4 % | 4 mini / 40 micro | 1 mini / 10 micro |
| 100K | 189 $ | 6 % | 4 % | 4 % | 8 mini / 80 micro | 2 mini / 20 micro |
| 150K | 219 $ | 6 % | 4 % | 4 % | 12 mini / 120 micro | 3 mini / 30 micro |

## 8. Matrice de règles par phase — FTMO CFD

| Champ | 1-Step | 2-Step |
|---|---|---|
| Phases | 1 | 2 |
| Objectifs | 10 % | 10 % puis 5 % |
| Perte journalière | 3 % | 5 % |
| Perte maximale | 10 % | 10 % |
| Drawdown | suiveur fin de journée | statique |
| Jours minimum | aucun | 4 par phase |
| Durée | illimitée | illimitée |
| Best Day Rule | 50 % | **aucune** |
| Profit split | 90 % | 80 %, jusqu'à 90 % |
| Remboursement | **non** | 100 % sous conditions |
| Types de compte | Standard | Standard et Swing |
| Scaling | **non** | +25 % / 4 mois, jusqu'à 2 M$ |

Les deux lignes en gras sont celles que la fiche actuelle mélange le plus
facilement : le remboursement et le scaling sont propres au 2-Step, la Best Day
Rule est propre au 1-Step.

## 9. Inventaire des promotions

| Firme | Code / offre | Valeur | Périmètre | Expiration | Statut |
|---|---|---|---|---|---|
| FTMO | offre publique | 20 % | **1-Step 100K uniquement** | non publiée | à limiter aux variantes vérifiées |
| The5ers | Summer Plan | prix dédiés | programmes Summer | **non publiée** | à revérifier |
| The5ers | `GDSWCVRTE7` | inconnue | inconnu | inconnue | origine inconnue, à qualifier ou retirer |

## 10. Rapport de conflits de sources

| Champ | Valeur A | Valeur B | Décision |
|---|---|---|---|
| FTMO 2-Step 100K | 540 € | 439 € | ne pas trancher ; qualifier la seconde |
| The5ers Summer 200K, cible funded | valeurs normales | `100 %` affiché | **anomalie de rendu du site source**, ne pas importer |
| The5ers consistency Futures | « 40 % par position » | consistency classique | règle distincte, définition exacte à obtenir |
| The5ers programmes classiques | présents sur notre fiche | disponibilité checkout inconnue | `unverified`, ne pas supprimer |
| FTMO Elite 25K jours minimum (FuturesElite, rappel) | 3 jours | 6 jours | non tranché, à confirmer |

---

## Plan d'implémentation proposé

**Étape 0 — sans code, sans migration.** Repasser `RUN-ftmo.sql` et
`RUN-the5ers.sql`. Corrige le canonical espagnol, les sept hreflang et le
contenu espagnol des deux fiches. Gain immédiat, risque nul.

**Étape 1 — migration additive.** Ajouter `market`, `program_family`, et une
table `firm_program_variants` entre programme et plan, plus les champs de phase
et de règle manquants. Additif : `firm_program_plans` reste lisible, les quatre
firmes déjà migrées ne bougent pas.

**Étape 2 — rendre la page dépendante de la sélection.** Déplacer verdict,
règles, parcours, coûts et FAQ du niveau firme vers le niveau variante. C'est le
vrai chantier : sans lui, seule la carte du haut réagit.

**Étape 3 — i18n des nouvelles tables.** Une colonne `translations` jsonb sur
`firm_programs`, `firm_program_plans` et `firm_rules`, sur le modèle éprouvé de
`prop_firms.translations`.

**Étape 4 — données FTMO et The5ers**, une fois le schéma capable de les porter.

**Étape 5 — tests** : filtrage par marché, par programme, par variante ;
expiration de promotion ; paramètres de CTA ; complétude linguistique ;
canonical et hreflang ; devises ; absence de règle d'un programme sous un autre.

## Ce qui reste à vérifier à la source

- Matrice complète des prix FTMO 1-Step par devise.
- Périmètre exact du 439 € et de la promotion 20 %.
- Catalogue et règles FTMO Futures Beta.
- Expiration du Summer Plan.
- Disponibilité checkout des programmes classiques The5ers.
- Définition de la « consistency 40 % par position ».
- Nature, périmètre et validité de `GDSWCVRTE7`.
- Plateformes et data feeds Futures des deux firmes.
