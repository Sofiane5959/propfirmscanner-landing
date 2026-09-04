# Inspection avant modification — FuturesElite

Rapport demandé par la section « Before editing » du brief.
Aucune modification n'a été faite. Rien n'a été déployé ni migré.

Date : 4 septembre 2026. Classeur : `PropFirmScanner_FuturesElite_Complete_2026-09-04.xlsx`.

---

## 1. Route et composants

Il n'existe **aucun composant FuturesElite**. Une seule page sert les ~350 firmes :

| Fichier | Rôle |
|---|---|
| `app/[locale]/prop-firm/[slug]/page.tsx` | route serveur, `generateMetadata`, `generateStaticParams` |
| `app/[locale]/prop-firm/[slug]/PropFirmPageClient.tsx` | rendu de la fiche |
| `app/[locale]/prop-firm/[slug]/ChallengeSelector.tsx` | configurateur |
| `app/[locale]/prop-firm/[slug]/page-seo.tsx` | **code mort**, importé nulle part |

`CLAUDE.md` l'interdit explicitement : « Une seule page sert 350 firmes — ne jamais
créer de composant spécifique à une firme. » Le brief demande une structure de page
à sept sections spécifiques. **Conflit à trancher** (voir § 7).

## 2. Sources de données

| Donnée | Où | Remarque |
|---|---|---|
| Firme | table `prop_firms` | une ligne par firme |
| Programmes | table `prop_firm_challenges` | une ligne **plate** par challenge |
| Prix | `prop_firm_challenges.price` / `.discounted_price` | pas de séparation régulier / promo |
| Promotion | colonnes `discount_*` sur `prop_firms` | **niveau firme uniquement** |
| Plateformes | `prop_firms.platforms`, colonne TEXT | pas de lien programme ↔ plateforme |
| Contenu éditorial | `prop_firms` (JSONB) + `translations` | généré par `scripts/build-firm-content.mjs` |

## 3. Évaluation et financé sont-ils stockés séparément ?

**Non.** `prop_firm_challenges` n'a pas de notion de phase. Une ligne mélange
l'objectif d'évaluation et le partage financé. Le brief exige des enregistrements
distincts : c'est le principal chantier de schéma.

## 4. Colonnes manquantes pour représenter le brief

Colonnes réellement écrites aujourd'hui :

    id, slug, name, firm_name, firm_slug, account_size, steps, max_drawdown,
    max_daily_loss, phase1_profit_target, phase2_profit_target, drawdown_type,
    max_loss_type, profit_split, price, discounted_price,
    payout_frequency_description, consistency_rule, allows_ea, allows_scalping,
    allows_news_trading, billing_period, risk_unit

Champs demandés par le brief et **absents** :

`phase`, `platform`, `regular_price`, `promotion`, `buffer`, `contract_scaling`,
`minimum_trading_days`, `payout_cap`, `minimum_payout`, `days_between_payouts`,
`reset_fee`, `activation_fee`, `source_url`, `verified_at`, `confidence`,
`editorial_note`.

Deux problèmes de type, pas seulement d'absence :

- **`allows_news_trading` et `allows_scalping` sont des booléens.** Ils ne peuvent
  pas porter « With restrictions » ni « Needs confirmation ». Le brief interdit
  précisément d'afficher une coche verte sur « News trading: With restrictions ».
  Un booléen ne laisse pas le choix. Il faut un statut à valeurs multiples.
- **`max_contracts` existe côté TypeScript mais n'est jamais écrit** : il ne figure
  pas dans la liste `COLS` du générateur. La colonne est lue et affichée comme
  vide depuis le début.

## 5. Modèle de promotion

Aujourd'hui : `discount_code`, `discount_percent`, `discount_status`,
`discount_starts_at`, `discount_expires_at`, `discount_note` — **au niveau de la
firme**.

Le brief exige `code`, `discount_type`, `discount_value`, `starts_at`, `expires_at`,
`verified_at`, `source_url`, `status`. Il manque donc `discount_type`,
`verified_at` et `source_url`.

Surtout : **SUMMER vaut 25 % à 35 % selon le produit et la taille.** Une remise
au niveau firme ne peut pas exprimer ça. Il faut porter la promotion au niveau du
programme, ou au moins un taux par ligne.

## 6. Doublons et valeurs en dur

Aucun prix FuturesElite n'est codé en dur dans un composant : tout vient de la base.
Le seul point en dur est dans `scripts/firm-content.mjs`, et c'est un problème :

    affiliate_url:
      'https://app.futureselite.com/dashboard/choose-plan?aff=AFF5465384&coupon=scanned'

Trois écarts avec le brief :

1. Le brief donne `https://app.futureselite.com?aff=AFF5465384` et précise :
   « Do not invent a deep link or append unsupported parameters in production. »
   Le lien en base **est** un deep link inventé.
2. Il préremplit `coupon=scanned`, soit **20 %**, alors que l'offre publique
   SUMMER donne **25 à 35 %**. En l'état, notre lien affilié fait payer le
   visiteur **plus cher** que s'il arrivait seul sur le site.
3. Le brief signale que le lien racine atterrit sur la page de connexion, pas sur
   le configurateur. L'attribution n'est pas confirmée.

Le point 2 est le plus grave : il est commercialement contraire à l'intérêt du
visiteur, et il contredit la règle du projet « ne pas promettre au visiteur ce que
le partenaire ne garantit pas ».

## 7. Tunnel d'affiliation — état

Conforme au brief sur l'essentiel :

- `lib/affiliate.ts` → `buildAffiliateUrl()` construit toutes les URL sortantes.
- `/api/go/[slug]` est la seule porte de sortie ; le `click_id` (16 caractères
  base36) y est généré côté serveur et journalisé.
- Le préchargement est filtré par Fetch Metadata avant génération du `click_id`.
- L'insert de tracking reste fire-and-forget et ne bloque pas la redirection.

Point non vérifiable de mon côté : le paramètre `aff` survit-il au checkout ?
Le brief dit de ne pas l'affirmer sans preuve. Rien ne l'affirme aujourd'hui.

## 8. Traductions et métadonnées

- `scripts/firm-content.mjs` (anglais + bloc `fr`) et
  `scripts/firm-translations/<locale>.mjs` (de, es, pt, ar, hi).
- `generateMetadata` dans `page.tsx`, désormais dans les sept langues.
- **Conséquence à prévoir** : passer FuturesElite de 4 à 27 lignes de programmes
  et ajouter les sections du brief obligera à réécrire son contenu éditorial dans
  **six langues**. Ce n'est pas un détail de calendrier.

---

## Ce qui bloque l'import : le classeur est désaligné

`Account Plans` **tasse les valeurs vers la gauche** quand un champ est vide. Les
positions de colonnes ne correspondent donc pas à l'en-tête, et la lecture naïve
produit des absurdités : « End of Day » atterrit dans la colonne *Daily Loss*, et
un frais de reset de 79 $ dans la colonne *Profit Split*.

Exemple, Elite Évaluation 25K, lu par index :

    6=1250  7=1000  8=End of Day  10=2  12=No  13=3  14=0.4  15=79  19=0

En-tête : 8=Daily Loss, 9=Drawdown, 10=Buffer, 11=Max Contracts, 15=Profit Split,
18=Reset Fee.

Lecture littérale : perte journalière = « End of Day », buffer = 2,
partage des profits = 79. Trois valeurs fausses sur une seule ligne.

### Reconstruction proposée

Elle n'est pas une déduction par analogie : chaque affectation est contrainte soit
par le brief lui-même, soit par des valeurs déjà vérifiées sur la fiche actuelle.

| Colonne lue | Valeur | Champ réel | Ce qui le prouve |
|---|---|---|---|
| 8 (Elite/Nitro/Instant) | End of Day / Trailing Equity | `drawdown_type` | Ce sont des types de drawdown, pas des montants |
| 8 (Prime) | 600 / 1200 / 1800 / 2700 | `daily_loss_limit` | Le brief : « Prime has a daily loss limit in both phases » |
| 10 (évaluation) | 2 / 4 / 8 / 12 | `max_contracts` | Identique aux lignes Funded, colonne 11 |
| 15 (évaluation) | 79 / 89 / 159 / 229 | `reset_fee` | Correspond exactement aux frais de reset déjà vérifiés en août |
| 14 (Elite/Nitro Funded) | 0.9 | `profit_split` | Le brief : « Elite funded has no consistency rule » |
| 3 (lignes Funded) | 1000 / 2000 / 3000 / 4500 | `maximum_loss_limit` | Une ligne financée n'a pas de prix |
| 6 (Instant) | 1800 / 3000 / 4500 | `maximum_loss_limit` | Le brief : « Instant has no evaluation target » |

**Je n'importe rien tant que ce tableau n'est pas confirmé.** Une seule erreur
d'affectation publierait une règle de risque fausse sur une page commerciale.

---

## Décisions attendues avant que je code

1. **La reconstruction ci-dessus est-elle validée ?** Sinon, un classeur réexporté
   avec une cellule vide plutôt qu'une cellule sautée règle le problème à la source.
2. **Composant spécifique ou générique ?** `CLAUDE.md` interdit un composant
   FuturesElite. Je propose d'implémenter les sections du brief de façon générique,
   pilotées par les données : toute firme ayant plusieurs programmes et une phase
   financée en bénéficie, et la règle du projet est respectée.
3. **Le lien affilié préremplissant `coupon=scanned` (20 %) doit-il être retiré
   maintenant ?** C'est indépendant du reste et immédiatement corrigeable.
4. **Ampleur du schéma.** Passer à `phase` + les 16 champs manquants est une
   migration réelle sur `prop_firm_challenges`, table partagée par les ~350 firmes.
   Je n'ai pas d'accès base : ce sera un fichier SQL à exécuter, et il touchera une
   table dont dépendent toutes les autres fiches.
5. **Traduction.** Le nouveau contenu FuturesElite devra être écrit en six langues.
   À faire dans la foulée, ou après validation du français et de l'anglais ?

## Faits à faire confirmer par FuturesElite

Repris de l'onglet `Sources and QA`, tous marqués « Open » ou « Needs confirmation » :

- Définition opérationnelle du scalping (aucun seuil ni durée publiés).
- Fenêtre exacte de restriction des actualités sur compte financé.
- Conflit Nitro : le bundle vend 5 comptes, la FAQ officielle en limite 3 en actif.
- Deep link configurateur supporté, et survie du paramètre `aff` au checkout.
- Alignement du code SCANNED sur l'offre publique, ou son retrait.
