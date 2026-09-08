# Plan d'implémentation — architecture de données des fiches

8 septembre 2026. **Rien modifié en production, aucun SQL exécuté, aucun
déploiement.** En attente d'approbation.

---

## Le chiffre qui change le plan

L'audit de dépendances est fait et automatisé : `scripts/column-dependency-audit.mjs`,
sortie dans `MATRICE-dependances.md`.

**Sur 69 colonnes auditées, 60 sont lues par au moins une surface de
production. 9 seulement sont libres.**

Les surfaces qui bloquent, par nombre de colonnes retenues :

    fiche firme          50
    /compare             28
    composant partage    22
    admin                13
    /best-for            11
    dashboard             7
    /deals                5
    route API             2

Ta réserve du point 5 était donc plus qu'une précaution. La dépréciation n'est
pas une étape de fin de migration : c'est un **chantier distinct**, qui commence
par `/compare` et les composants partagés, pas par la fiche.

Les 9 colonnes libres — `max_trading_days`, `highlights`,
`has_consistency_rule`, `has_scaling`, `current_promo_code`,
`current_promo_discount`, `discount_is_automatic`, `discount_status`,
`discount_starts_at` — sont les seules candidates immédiates, et encore : libre
signifie « aucun lecteur trouvé par cet audit », pas « aucun lecteur ».

---

## 1. Schéma des moyens de paiement

**Réponse à ta question préalable : non, aucune table n'existe.** Les seules
tables du projet sont `firm_programs`, `firm_program_plans`, `firm_promotions`,
`firm_program_bundles`, `firm_platforms`, `firm_rules`, `firm_live_tiers`.
Aucune ne représente un moyen d'achat ni un moyen de retrait. `checkout_options`
est un JSONB de `prop_firms` qui porte les flux de données, pas les paiements.

Ta correction est retenue : une seule table, deux flux.

```sql
create table if not exists firm_payment_methods (
  id           uuid primary key default gen_random_uuid(),
  firm_slug    text not null,
  -- La distinction que `payout_methods` ne pouvait pas porter : payer la
  -- firme et etre paye par elle n'empruntent pas les memes rails.
  flow         text not null check (flow in ('purchase', 'payout')),
  name         text not null,
  kind         text check (kind in ('card', 'bank', 'crypto', 'wallet', 'provider', 'other')),
  provider     text,
  note         text,
  lead_time    text,
  availability text,
  source_url   text,
  verified_at  timestamptz,
  confidence   text not null default 'verified',
  sort_order   integer not null default 0,
  unique (firm_slug, flow, name)
);
```

Trois points de conception :

`name` est **une ligne, jamais un tableau**. CLAUDE.md documente trois pannes
dues au mismatch TEXT / `string[]` sur `platforms`. Une ligne par méthode
supprime la question.

`unique (firm_slug, flow, name)` autorise Rise dans les deux flux si la firme
le propose pour l'achat et le retrait, sans le confondre.

`confidence` suit la convention des six autres tables : une méthode non
confirmée s'affiche marquée, elle ne disparaît pas.

`prop_firms.payout_methods` reste un repli, lu uniquement quand la table est
vide pour la firme.

---

## 2. Matrice de dépendances

`MATRICE-dependances.md` — 69 lignes, format demandé :

    table.column -> lecteurs (par surface) -> ecrivains -> remplacement canonique -> statut

Elle est **régénérable** : `node scripts/column-dependency-audit.mjs`. Elle ne
sera donc pas périmée silencieusement, contrairement à un audit rédigé une fois.

La classification lecteur / écrivain est délibérément **prudente** : dans le
doute, une occurrence compte comme lecteur, ce qui bloque la dépréciation
plutôt que de l'autoriser à tort.

Trois limites que je signale plutôt que de les laisser découvrir :

1. l'audit ne voit que le dépôt. Une requête SQL ad hoc, un tableau de bord
   externe ou un export ne s'y trouvent pas ;
2. les surfaces `script / seed` et `SQL` ne sont pas comptées comme production,
   mais un script de seed qui cesse d'écrire une colonne la périme quand même ;
3. `composant partage` (22 colonnes) mélange des composants servant plusieurs
   surfaces. Il faudra le raffiner avant toute dépréciation réelle.

---

## 3. `listing_status` contre `page_model_status`

**Audit fait.** `listing_status` vaut `listed` / `unlisted` et a deux
consommateurs :

- `app/sitemap.ts:87` — `.eq('listing_status', 'listed')`, donc un **filtre
  SEO** : une firme non listée sort du sitemap ;
- `app/[locale]/admin/firms/FirmsClient.tsx` — filtre, compteur et bascule
  rapide.

Sa sémantique est donc **la visibilité publique**, et rien d'autre. Ta réserve
est fondée : une seconde colonne à sémantique « publié / non publié » serait
indistinguable à la lecture, et le jour où les deux divergeraient, personne ne
saurait laquelle fait autorité.

Proposition retenue, ta formulation :

    page_model_status : legacy | draft | needs_review | validated | active

Les deux axes sont orthogonaux et le resteront :

| | `listed` | `unlisted` |
|---|---|---|
| `active` | fiche publique, nouveau rendu | fiche masquée, nouveau rendu prêt |
| `legacy` | fiche publique, ancien rendu | fiche masquée, ancien rendu |

`PILOTE_MODELE` disparaît alors du code : la bascule se décide en base, par
firme, sans déploiement. C'est un gain net sur la boucle de cette semaine.

Défaut à la création : `legacy`. Aucune firme ne change de rendu par accident.

---

## 4. Le validateur — phase 1 seulement

Conforme à ta décision : contradiction d'abord, jetons plus tard.

`lib/validate-firm-page-model.ts`

```ts
validateFirmPageModel(model: FirmPageModel): ValidationResult
```

### Ce que la phase 1 détecte

L'extracteur lit `description`, `pros`, `cons`, `verdict_card` et les réponses
de FAQ, et en tire toute affirmation chiffrée :

| Motif | Exemple capté |
|---|---|
| pourcentage | `90%`, `40 %` |
| montant | `$1,000`, `1 000 $` |
| jours | `3 trading days`, `6 profitable days` |
| nombre de comptes | `10 funded accounts`, `maximum 3 Nitro` |
| nombre de plateformes | `seven platforms`, `six platforms` |
| terminologie de règle | `end-of-day`, `trailing equity`, `daily loss limit`, `consistency` |

Chaque valeur extraite est confrontée au modèle :

| Situation | Résultat |
|---|---|
| présente dans l'éditorial **et** dans le modèle, identiques | rien |
| présente dans les deux, **différentes** | `EDITORIAL_CONTRADICTS_DATA` — **bloquant** |
| propre à un programme, énoncée sans nommer ce programme | `FACT_NOT_UNIVERSAL_IN_TEXT` — **bloquant** |
| absente du modèle, invérifiable | `EDITORIAL_UNVERIFIABLE` — avertissement |

### La preuve que le mécanisme est le bon

Les six régressions de cette semaine, passées au validateur :

| Phrase | Verdict |
|---|---|
| « All four settle at a 90% profit split » | bloquant — Instant vaut 0.8 |
| « No daily loss limit » en fait de firme | bloquant — Prime en a une |
| « seven platforms » | bloquant — `firm_platforms` en compte 6 sélectionnables |
| « maximum 3 Nitro » | bloquant — `max_funded_accounts` est `null` |
| « 3 minimum trading days in evaluation, 6 once funded » | bloquant — valeurs propres à Elite |
| « End-of-day drawdown on Elite, Nitro and Instant » | bloquant — Nitro financé est `Trailing Equity` |

**Six sur six.** Aucune n'aurait atteint la production.

### Les autres contrôles bloquants

`IDENTITY_INCOMPLETE`, `MARKET_MISMATCH`, `DUPLICATE_CANONICAL`,
`PRICE_INCONSISTENT`, `PROMO_MATH`, `FACT_NOT_UNIVERSAL`, `RULE_CONTRADICTION`,
`ORPHAN_PLAN`, `UNKNOWN_AS_CONFIRMED`, `UNTRACKED_CTA`.

Avertissements : `SOURCE_CONFLICT_OPEN`, `PAYMENT_DETAILS_MISSING`,
`PROMO_SCOPE_UNCONFIRMED`, `PROMO_EXPIRY_UNKNOWN`, `EDITORIAL_INCOMPLETE`,
`LEGACY_COLUMN_STILL_WRITTEN`.

### Phase 2, à réévaluer après FTMO et The5ers

Les jetons `{{fact:…}}` ne seront proposés que si le validateur seul se révèle
insuffisant, et pour un petit nombre de phrases factuelles réutilisables. Jamais
pour l'analyse ni la recommandation.

---

## 5. Deux modèles, une source

| | `FirmPageModel` | `FirmSummaryModel` |
|---|---|---|
| Sert | la fiche détaillée | cartes, `/compare`, `/best-for`, `/deals`, recherche, accueil |
| Contient | programmes, plans, phases, règles complètes, éditorial, bundles, paliers | ce qui tient sur une carte |
| Coût | 8 requêtes | 2, agrégées |

```ts
interface FirmSummaryModel {
  slug: string
  name: string
  logoUrl: string | null
  market: string | null            // firm_programs.market
  priceRange: { min: number; max: number; currency: string } | null
  profitSplit: { min: number; max: number } | null
  offer: { code: string; percent: number } | null
  platformCount: number
  rating: { value: number; count: number } | null
  ctaHref: string                  // /api/go/[slug]
  provenance: Record<string, Provenance>
}
```

**La règle qui compte** : les deux modèles résolvent depuis les **mêmes sources
canoniques**, et `FirmSummaryModel` n'est pas un extrait de `FirmPageModel` —
il l'agrège en SQL. Un `/compare` qui construirait 40 modèles complets ferait
320 requêtes.

Les champs partagés — fourchette de prix, split, promotion — passent par les
mêmes fonctions pures, pour qu'une carte et une fiche ne puissent pas afficher
deux prix différents. C'est exactement le défaut constaté sur la fiche : le hero
lisait `min_price` pendant que le configurateur lisait `regular_price`.

---

## 6. Étapes de migration

| # | Étape | Écrit | Critère de sortie |
|---|---|---|---|
| 1 | FuturesElite valide l'architecture | rien | 4 corrections en base, page conforme |
| 2 | `validateFirmPageModel` + tests génériques | code | zéro erreur sur FuturesElite, six régressions rejouées |
| 3 | `firm_payment_methods` + migration FuturesElite | SQL additif | `Payment provider : Rise` par la table, pas la colonne |
| 4 | FTMO et The5ers **en mode ombre** — modèle construit, **jamais rendu** | code | rapport d'écarts par firme |
| 5 | Capacités génériques manquantes | code | EUR, variantes Swing, variantes multiples par taille, CFD, structures d'évaluation |
| 6 | `page_model_status` + `FirmSummaryModel` | SQL additif + code | `/compare` sert le modèle résumé, colonnes héritées encore écrites |
| 7 | Bascule FTMO et The5ers | base seule | rapports approuvés par toi |
| 8 | Lots de 10 à 20 firmes | base seule | validateur vert avant chaque lot |
| 9 | Dépréciation, chantier distinct | code puis SQL | matrice à zéro lecteur de production pour la colonne visée |

L'étape 4 est celle qui décide de la généricité : FTMO impose l'EUR et les
variantes Swing, The5ers quatre variantes commerciales sur une même taille. Le
pilote n'a rencontré ni l'un ni l'autre.

L'étape 9 ne commence pas avant l'étape 8, et **colonne par colonne**, jamais
par lot.

L'ancien rendu reste disponible tout du long.

---

## 7. Tests exigés avant qu'une colonne cesse d'être écrite

Cinq conditions cumulatives, par colonne :

1. `MATRICE-dependances.md` régénérée la donne **LIBRE** ;
2. un test échoue si la colonne réapparaît dans une surface de production ;
3. la source canonique porte la valeur pour **toutes** les firmes publiées, pas
   seulement celles migrées ;
4. les neuf invariants génériques passent sur l'ensemble des firmes ;
5. un contrôle en production compare l'ancien et le nouveau rendu de trois
   firmes tirées au hasard.

Les neuf invariants, sur toutes les firmes publiées : une seule source
canonique par fait ; tout plan appartient à un programme ; les phases ne
deviennent jamais des cartes ; prix remisé = catalogue − promotion ; aucune
firme futures n'affiche de levier forex ; aucune valeur propre à un programme
en fait de firme ; toute valeur disputée est marquée ; SSR et hydratation
démarrent sur le même modèle ; tout CTA passe par `/api/go`.

L'invariant SSR se teste en appelant `buildFirmPageModel` deux fois sur la même
entrée : le résultat doit être identique, donc **aucune dépendance à
`Date.now()` non injectée**. Le paramètre `options.now` existe déjà.

---

## 8. Retour en arrière

Quatre niveaux, du moins coûteux au plus coûteux :

| Niveau | Geste | Portée | Déploiement |
|---|---|---|---|
| 1 | `page_model_status = 'legacy'` | une firme | non |
| 2 | Rollback de données par firme | une firme | non |
| 3 | Retirer le slug de `PILOTE_MODELE` (avant l'étape 6) | une firme | oui |
| 4 | Ignorer les tables normalisées | tout le site | oui |

Le niveau 1 est l'objectif : **revenir en arrière sans déployer**. C'est ce que
`page_model_status` apporte de plus concret.

Le niveau 4 reste possible parce que les sept tables sont **additives** et que
`prop_firm_challenges` n'a jamais cessé d'être écrite. Tant que les colonnes
héritées sont alimentées, l'ancien rendu fonctionne à l'identique.

Chaque étape écrivant en base est précédée d'une sauvegarde du type
`RUN-00-sauvegarde-avant-migration.sql`, avec restauration dynamique — celle
qui lit `information_schema` et ne peut plus rater une colonne ajoutée après
coup.

---

## Ce que j'attends de toi

1. le schéma `firm_payment_methods` tel qu'écrit au §1 ;
2. `page_model_status` en colonne distincte, `listing_status` inchangée ;
3. l'ordre des neuf étapes, en particulier la dépréciation reléguée en 9 ;
4. les cinq conditions du §7 avant tout arrêt d'écriture ;
5. le principe que `FirmSummaryModel` agrège en SQL plutôt que de dériver du
   modèle complet.

Un point mérite ton arbitrage explicite : **l'étape 6 déplace `/compare` sur un
nouveau modèle**. C'est la page la plus consultée après l'accueil, et elle lit
28 colonnes héritées. Je peux la traiter plus tôt, en parallèle de l'étape 4,
ou la garder en 6. Dis-moi.

Rien ne sera implémenté avant ta réponse.
