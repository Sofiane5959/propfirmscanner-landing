# Architecture de données des fiches firmes — rapport avant implémentation

8 septembre 2026. **Rien modifié, aucun SQL exécuté, aucun déploiement.**
En attente de ton approbation.

---

## Le chiffre qui cadre tout le reste

| | Colonnes |
|---|---|
| `prop_firms` en base | **113** |
| lues par l'ancien rendu (349 fiches) | **58** |
| lues par `buildFirmPageModel` | **27** |

Le modèle a déjà réduit la surface de moitié. Ce qui reste à faire n'est pas de
tout réécrire, mais de **classer les 113 colonnes** et de fermer les trois
zones de recouvrement qui subsistent.

---

## 1. Carte des sources — ce que `FirmPage` affiche

Chaque valeur rendue, sa propriété de modèle, sa table et sa colonne.

### Identité et métadonnées

| Affiché | Propriété | Table | Colonne | Repli | Doublon ailleurs |
|---|---|---|---|---|---|
| Nom | `identity.name` | `prop_firms` | `name` | — | non |
| Titre H1 | `identity.headline` | `prop_firms` | `headline` | `name` | non |
| Présentation | `identity.intro` | `prop_firms` | `verdict` | — | `description` (texte long) |
| Badge marché | `identity.marketBadge` | `prop_firms` | `category_badge` | — | **oui** — `is_futures`, `firm_programs.market` |
| Logo | `identity.logoUrl` | `prop_firms` | `logo_url` | — | non |
| Pays | `identity.country` | `prop_firms` | `country` | — | `headquarters` |
| Fondation | `identity.foundedYear` | `prop_firms` | `founded` | `founded_year`, `year_founded` | **trois colonnes pour un fait** |
| Type de firme | `identity.firmType` | `firm_programs` | `market` (dérivé) | — | `is_futures`, `category_badge` |
| Modèle de compte | `identity.accountModel` | `firm_program_plans` | `phase` (dérivé) | — | non |
| Fréquence de retrait | `identity.payoutFrequency` | `prop_firms` | `payout_frequency` | — | `firm_program_plans.days_between_payouts` |
| Date de vérification | `identity.verifiedAt` | `prop_firms` | `data_verified_at` | — | non |

### Catalogue

| Affiché | Propriété | Table | Colonne | Repli | Doublon |
|---|---|---|---|---|---|
| Plateformes | `catalogue.platforms` | `firm_platforms` | `name`, `configurator_status`, `note` | `prop_firms.platforms` | **oui** — `platforms`, `platforms_list`, `has_mt4`…`has_tradelocker` (7 booléens) |
| Actifs | `catalogue.assets` | `prop_firms` | `assets` | — | `instruments`, `challenge_types` |
| Flux de données | `catalogue.dataFeeds` | `prop_firms` | `checkout_options` | — | non |
| Moyens de paiement | `catalogue.paymentMethods` | `prop_firms` | `payout_methods` | — | **non normalisée** — voir §2 |

### Programmes, plans, phases

| Affiché | Propriété | Table | Colonne | Doublon |
|---|---|---|---|---|
| Programmes | `programs[]` | `firm_programs` | `slug`, `name`, `kind`, `market`, `evaluation_steps`, `summary`, `status` | `has_instant_funding` |
| Plans | `programs[].plans[]` | `firm_program_plans` | `account_size`, `regular_price`, `currency`, `variant_key` | `account_sizes`, `min_price`, `max_price` |
| Phases | `…plans[].phases[]` | `firm_program_plans` | 18 colonnes de règles | `profit_split`, `max_profit_split`, `drawdown_type`, `consistency_rule`, `min_trading_days`, `max_trading_days`, `profit_target_phase1/2`, `max_daily_drawdown`, `max_total_drawdown`, `reset_fee` |

### Offre

| Affiché | Propriété | Table | Colonne | Doublon |
|---|---|---|---|---|
| Code, remise, prix | `offer.*` | `firm_promotions` | `code`, `discount_value`, `is_public`, `status`, `starts_at`, `expires_at` | `discount_code`, `discount_percent`, `discount_note`, `discount_expires_at`, `discount_is_automatic`, `discount_status`, `discount_starts_at`, `current_promo_code`, `current_promo_discount` — **neuf colonnes** |
| CTA | `ctaHref` | code | `buildAffiliateUrl` → `/api/go/[slug]` | `affiliate_url` (jamais rendue directement) |

### Règles, éditorial, annexes

| Affiché | Propriété | Table | Colonne | Repli |
|---|---|---|---|---|
| Règles critiques | `rules.critical` | `firm_rules` | `severity`, `scope`, `sort_order` (dérivé) | `prop_firms.key_rules` |
| Règles détaillées | `rules.complete` | `firm_rules` | `*` | — |
| Bundles | `bundles[]` | `firm_program_bundles` | `*` | — |
| Paliers live | `liveTiers[]` | `firm_live_tiers` | `*` | `progression_tiers`, `scaling_max` |
| À propos | `narrative.about` | `prop_firms` | `description` | — |
| Forces / limites | `narrative.strengths/limits` | `prop_firms` | `pros`, `cons` | `special_features`, `highlights` |
| Verdict | `narrative.verdict` | `prop_firms` | `verdict_card` | — |
| FAQ | `narrative.faq` | dérivée du modèle | — | — |

---

## 2. Source canonique par domaine

| Domaine | Canonique | État |
|---|---|---|
| Identité, métadonnées stables | `prop_firms` | en place |
| Programmes | `firm_programs` | en place |
| Plans, tailles, prix | `firm_program_plans` | en place |
| Règles par phase | `firm_program_plans` | en place |
| Règles générales | `firm_rules` | en place |
| Plateformes | `firm_platforms` | en place, repli encore actif |
| Promotions | `firm_promotions` | en place |
| Bundles | `firm_program_bundles` | en place |
| Progression live | `firm_live_tiers` | en place |
| **Moyens de paiement** | **à créer : `firm_payout_methods`** | **manquant** |

### Le seul domaine sans source normalisée

`payout_methods` est un `text[]` sur `prop_firms`. Il ne peut porter ni le
statut du prestataire, ni ses délais, ni sa zone de disponibilité, ni la source
qui l'atteste. C'est la dernière exception au modèle.

    create table firm_payout_methods (
      id           uuid primary key default gen_random_uuid(),
      firm_slug    text not null,
      name         text not null,        -- 'Rise'
      kind         text,                 -- provider | bank | crypto
      note         text,                 -- « KYC obligatoire au premier retrait »
      lead_time    text,                 -- « 1 à 3 jours après approbation »
      source_url   text,
      verified_at  timestamptz,
      confidence   text default 'verified',
      sort_order   integer not null default 0,
      unique (firm_slug, name)
    );

Additive, comme les sept autres. `prop_firms.payout_methods` devient un repli.

---

## 3. Classement des 113 colonnes

Résumé par catégorie ; le détail colonne par colonne est mécanique à partir des
tableaux du §1.

### Canoniques — 27 colonnes

`slug`, `name`, `headline`, `verdict`, `description`, `category_badge`,
`logo_url`, `website_url`, `affiliate_url`, `country`, `headquarters`,
`is_regulated`, `regulation_details`, `company_name`, `legal_name`, `is_futures`,
`assets`, `pros`, `cons`, `verdict_card`, `checkout_options`, `trustpilot_rating`,
`trustpilot_reviews`, `rating_checked_at`, `data_verified_at`, `data_verified_by`,
`source_url`.

### Replis temporaires — 8

Lues par le modèle uniquement quand la table normalisée est vide.

`platforms`, `payout_methods`, `payout_frequency`, `key_rules`, `journey`,
`founded`, `founded_year`, `year_founded`.

Les trois dernières décrivent le même fait. À réduire à une seule.

### Dépréciées — 41

Encore lues par l'ancien rendu, jamais par le modèle. Elles **doivent cesser
d'être écrites** dès qu'une firme passe au modèle, sinon elles se périment en
silence — c'est exactement ce qui a produit « 90 % de partage » sur Instant.

`profit_split`, `max_profit_split`, `min_price`, `max_price`, `account_sizes`,
`drawdown_type`, `consistency_rule`, `min_trading_days`, `max_trading_days`,
`profit_target_phase1`, `profit_target_phase2`, `max_daily_drawdown`,
`max_total_drawdown`, `reset_fee`, `scaling_max`, `progression_tiers`,
`max_allocation`, `min_payout`, `payout_speed_days`, `payout_speed_label`,
`time_limit`, `commissions`, `refund_policy`, `fee_refund`, `swap_free`,
`leverage_forex`, `instruments`, `challenge_types`, `platforms_list`,
`special_features`, `highlights`, `education`, `cost_timeline`, `program_guide`,
`proof_stats`, `value_strip`, `included_items`, `discount_code`,
`discount_percent`, `discount_note`, `discount_expires_at`.

### Supprimables à terme — 20

Aucun lecteur, ni ancien ni nouveau.

Les 7 booléens `has_mt4`…`has_tradelocker` (remplacés par `firm_platforms`),
`has_instant_funding`, `has_consistency_rule`, `has_scaling`,
`allows_scalping`, `allows_news_trading`, `allows_weekend_holding`,
`allows_hedging`, `allows_ea` (remplacés par `firm_rules`),
`current_promo_code`, `current_promo_discount`, `discount_is_automatic`,
`discount_status`, `discount_starts_at` (remplacés par `firm_promotions`).

### Hors périmètre — 17

Exploitation du site, pas contenu de fiche : `is_active`, `is_featured`,
`listing_status`, `priority_tier`, `trust_status`, `closed_at`,
`closure_reason`, `broker_partner`, `license_url`, `affiliate_commission`,
`propfirmmatch_rating`, `is_accepting_us`, `restricted_countries`,
`subid_param`, `price_currency`, `translations`, `updated_at`.

**Rien n'est supprimé.** Le classement sert à décider quoi cesser d'écrire.

---

## 4. Frontière du modèle

`page.tsx` appelle **une** fonction et passe **un** objet. C'est déjà le cas
pour le pilote. Ce qui manque est la garantie que ça le reste.

Trois règles à faire respecter par les tests, pas par la discipline :

1. aucun `createClient` ni `.from(` sous `components/prop-firm/` ;
2. aucun composant ne reçoit une prop nommée `firm`, `challenges` ou
   `programData` ;
3. `FirmPage` n'accepte que `model`, `ctaHref`, `locale`.

La sélection interactive ne dérive que de `model.programs[].plans[]`, déjà
présents. L'état initial vient de `model.defaultPlanId`, donc **le serveur et
le client démarrent sur le même plan** — c'est ce qui a corrigé l'absence du
bloc SCANNED dans le HTML serveur.

---

## 5. Séparer les faits du rédactionnel

C'est la cause de **six** des allers-retours de cette semaine. « 90 % de
partage », « aucune limite journalière », « sept plateformes », « maximum
3 Nitro », « 3 jours puis 6 », « End-of-day drawdown on Instant » : à chaque
fois un chiffre recopié à la main dans un champ éditorial, qui s'est périmé
pendant que la donnée structurée, elle, était juste.

### Le mécanisme proposé : la référence de fait

Un champ éditorial ne contient plus de chiffre, mais un jeton résolu au rendu :

    'Profit split up to {{fact:max_profit_split}} — {{fact:min_profit_split}} on {{fact:lowest_split_program}}'

Le résolveur lit le modèle. Un jeton qui ne résout pas devient une **erreur de
publication**, pas un texte vide.

### Le validateur de contradiction

Plus simple et immédiatement applicable : un contrôle qui lit les champs
éditoriaux, en extrait tout nombre suivi d'une unité (`%`, `$`, `days`,
`accounts`), et le confronte au modèle.

- nombre présent dans l'éditorial **et** absent du modèle → avertissement ;
- nombre présent dans les deux mais **différent** → erreur bloquante ;
- nombre propre à un programme énoncé sans le nommer → erreur bloquante.

Ce validateur aurait attrapé les six cas, sans exception.

---

## 6. `validateFirmPageModel(model)`

    interface ValidationResult {
      errors: Issue[]      // bloquent la publication
      warnings: Issue[]    // publient, mais signalent
      notices: Issue[]     // informatif
    }
    interface Issue { code: string; field: string; message: string; evidence?: unknown }

### Erreurs bloquantes

| Code | Contrôle |
|---|---|
| `IDENTITY_INCOMPLETE` | `name`, `headline`, `intro`, `logoUrl` présents |
| `MARKET_MISMATCH` | `firm_programs.market` uniforme **et** d'accord avec `is_futures` |
| `DUPLICATE_CANONICAL` | une colonne dépréciée porte une valeur contredisant sa table canonique |
| `PRICE_INCONSISTENT` | `min_price`/`max_price` hors de l'intervalle des `regular_price` |
| `PROMO_MATH` | `final ≠ round(list × (1 − discount), 2)` |
| `FACT_NOT_UNIVERSAL` | un `firmFact` dont la valeur diffère entre programmes |
| `RULE_CONTRADICTION` | deux règles de même portée s'opposant |
| `ORPHAN_PLAN` | un plan sans programme, ou un programme sans plan publié |
| `UNKNOWN_AS_CONFIRMED` | `confidence = needs_confirmation` rendu sans marque visible |
| `UNTRACKED_CTA` | un CTA sortant ne passant pas par `/api/go/` |
| `EDITORIAL_CONTRADICTS_DATA` | §5 |

### Avertissements

`SOURCE_CONFLICT_OPEN`, `PAYOUT_DETAILS_MISSING`, `PROMO_SCOPE_UNCONFIRMED`,
`PROMO_EXPIRY_UNKNOWN`, `EDITORIAL_INCOMPLETE`, `LEGACY_COLUMN_STILL_WRITTEN`.

---

## 7. Tests sémantiques génériques

Une suite qui itère sur **toutes** les firmes publiées, pas seulement le
pilote. Neuf invariants :

1. une seule source canonique par fait affiché ;
2. tout plan actif appartient à un programme ;
3. les phases ne deviennent jamais des cartes de plan séparées ;
4. prix remisé = prix catalogue − promotion active ;
5. une firme futures n'affiche jamais de levier forex ;
6. une valeur propre à un programme n'apparaît jamais en fait de firme ;
7. une valeur disputée est visiblement marquée non confirmée ;
8. SSR et hydratation démarrent sur le même modèle ;
9. tout CTA commercial passe par `/api/go`.

Les invariants 3, 5, 6 et 9 sont déjà couverts pour FuturesElite ; il s'agit de
les généraliser à l'itération sur toutes les firmes.

L'invariant 8 se teste en comparant `buildFirmPageModel` appelé deux fois avec
la même entrée : le modèle doit être identique, donc **aucune dépendance à
`Date.now()` non injectée**. Le paramètre `options.now` existe déjà pour ça.

---

## 8. Cycle de publication

    draft → needs_review → validated → published

`validated` exige zéro erreur. `published` exige `validated` plus un aperçu
desktop et mobile constaté.

Rapport de publication : données manquantes, données en conflit, provenance de
chaque champ (le champ `provenance` existe déjà), résultat de validation, état
des aperçus, date de dernière vérification.

Une colonne `publication_status` sur `prop_firms`, et le rendu du modèle
réservé aux firmes `published` — les autres gardent l'ancien rendu.

---

## 9. Séquence de migration

| Étape | Contenu | Critère de sortie |
|---|---|---|
| 1 | FuturesElite pilote | déjà en place |
| 2 | Validateur + tests génériques, sans bascule | zéro erreur sur FuturesElite |
| 3 | FTMO et The5ers construits en modèle, **sans être rendus** | rapport d'écarts modèle / rendu actuel |
| 4 | Capacités génériques manquantes | variantes de plan (`variant_key`), devise non-USD, programmes multi-marchés |
| 5 | Bascule des trois firmes | contrôle en production |
| 6 | Migration progressive, par lots de 10 à 20 | validateur vert avant chaque lot |

L'étape 4 est celle qui compte : FTMO impose l'EUR et les variantes Swing,
The5ers quatre variantes commerciales sur une même taille. Le pilote n'a
rencontré ni l'un ni l'autre.

**L'ancien rendu reste disponible** pendant toute la migration : c'est déjà le
comportement de `PILOTE_MODELE`.

---

## 10. Retour en arrière et risques

### Retour en arrière

Trois niveaux, du moins coûteux au plus coûteux :

1. **Par firme, sans SQL** — retirer le slug de `PILOTE_MODELE`. Effet immédiat
   au déploiement suivant, aucune donnée touchée.
2. **Par firme, avec données** — les sauvegardes `fe_sauv_*` et le rollback
   dynamique, déjà éprouvés.
3. **Global** — les tables normalisées sont additives : les supprimer rendrait
   toutes les fiches à `prop_firm_challenges`, intact depuis le début.

### Risques pour les 349 autres fiches

| Risque | Gravité | Ce qui le contient |
|---|---|---|
| Cesser d'écrire une colonne dépréciée encore lue par l'ancien rendu | **élevé** | Ne rien cesser d'écrire avant qu'une firme soit `published`. Les 41 colonnes restent alimentées |
| `/compare`, `/best-for`, le tableau de bord lisent `prop_firms` directement | **élevé** | Hors périmètre du modèle. Toute dépréciation devra les traiter — ils ne sont pas dans cet audit |
| Une firme migrée perd une section faute de donnée normalisée | moyen | Le validateur bloque avant publication |
| `toArray` et le mismatch TEXT / `string[]` | moyen | Documenté dans CLAUDE.md, trois pannes à son actif. La nouvelle table de paiements doit être `text` par ligne, pas un tableau |
| Charge de requêtes : 8 tables au lieu de 2 | faible | Un seul aller-retour parallélisé, déjà en place |
| Divergence SSR / client | faible | `defaultPlanId` et `options.now` |

### Le risque que je souligne le plus

**`/compare` et `/best-for` ne sont pas dans cet audit.** Ils lisent
`prop_firms` sans passer par le modèle. Le jour où une colonne dépréciée cesse
d'être écrite, ils se videront en silence — c'est déjà arrivé avec
`profit_split`, qui ne listait que 24 firmes sur 132 dans `/best-for`.

Avant toute dépréciation réelle, il faudra un audit équivalent de ces deux
routes. Je ne l'ai pas fait : tu as demandé la carte des sources de `FirmPage`.

---

## Ce que j'attends de toi

Approbation, ou corrections, sur :

1. la création de `firm_payout_methods` — dernière exception au modèle ;
2. le classement des 113 colonnes, en particulier les 41 dépréciées ;
3. le mécanisme de séparation faits / éditorial : jeton résolu, validateur de
   contradiction, ou les deux ;
4. la séquence de migration, et notamment l'étape 3 en mode comparaison sans
   bascule ;
5. l'ajout d'un audit `/compare` et `/best-for` avant toute dépréciation.

Rien ne sera implémenté avant ta réponse.
