# État du déploiement — mesuré le 8 septembre 2026 à 20:12:43Z

## Le point qui explique tout

**Quatre des cinq phrases que tu cites sont du CONTENU DE BASE, pas du code.**

| Phrase | Vit dans |
|---|---|
| `maximum 3 Nitro` | `firm_rules.detail` |
| `An evaluation with no daily loss limit` | `prop_firms.verdict_card` |
| `End-of-day drawdown on Elite, Nitro and Instant` | `prop_firms.pros` |
| `Payment provider` dans la bande | `prop_firms.payout_methods` |

Redéployer ne les changera pas. **Elles attendent l'exécution du SQL**, que je
ne peux pas lancer.

## Tes cinq questions

**1. Le commit.** `b4de2fdfe859184e07c6e176ba842eb3f2eae327`, 8 septembre à
22:05, message « lll », auteur Sofiane5959. Il contient les neuf fichiers des
six corrections, dont `lib/firm-page-model.ts`, `components/prop-firm/FirmPage.tsx`
et `components/PromoTicker.tsx`.

**2. Poussé ?** Oui. `git status -sb` renvoie `## main...origin/main`, sans
divergence, et l'arbre de travail est propre.

**3. Déployé ?** Oui, et c'est prouvable par des chaînes qui n'existent que
dans le code de ce commit :

| Chaîne, présente uniquement dans `b4de2fd` | En production |
|---|---|
| `Funded profit split` | **1** |
| `Maximum contracts` | **1** |
| `Trading model` | **1** |
| `VERIFIED DEALS` (bannière retirée) | **0** |

Les trois premières sont les libellés que j'ai ajoutés hier au résumé de
sélection et à la bande d'information. La quatrième prouve que le retrait de
la bannière est actif.

**4. Le SHA servi en production.** **Je ne peux pas le lire.** Vercel ne
l'expose pas : les en-têtes ne donnent que `x-vercel-id`
(`cdg1::iad1::tkqbh-1788898363778-14b14833f5e1`), qui identifie l'instance et
la région, pas le déploiement. L'App Router ne publie pas de `buildId` dans le
HTML. Je ne vais pas inventer un SHA.

Ce que je peux affirmer : le bundle servi **contient le code de `b4de2fd`**,
par les quatre marqueurs ci-dessus.

**5. L'URL sert-elle ce SHA ?** Même réponse : je ne peux pas le certifier par
un identifiant, seulement par le comportement. Les quatre marqueurs sont
présents, donc le code déployé inclut `b4de2fd`.

## Mesure complète — `2026-09-08T20:12:43Z`

    GET https://www.propfirmscanner.org/prop-firm/futureselite?z=…
    X-Vercel-Cache: STALE   Age: 86

### Ce que le déploiement a corrigé

| Item que tu signales | Occurrences | Verdict |
|---|---|---|
| `Italy · cfd prop firm` | **0** | **non reproductible** — la page dit `Futures prop firm` (2 occurrences) |
| Résumé limité à Profit target et Funded split | — | **non reproductible** — `Funded profit split` et `Maximum contracts` sont dans le HTML |

Ces deux-là sont réglés. Si tu les vois encore, c'est une copie en cache :
la réponse porte `X-Vercel-Cache: STALE`, donc la première requête sert
l'ancienne version et revalide derrière.

### Ce qui attend le SQL

| Phrase | Occurrences | Devrait devenir |
|---|---|---|
| `maximum 3 Nitro` | **2** | `Nitro funded-account limit: not confirmed` |
| `An evaluation with no daily loss limit` | **2** | `Elite or Nitro evaluations without a daily loss limit` |
| `End-of-day drawdown on Elite, Nitro and Instant` | **2** | `Drawdown type differs by program and phase` |
| `not confirmed` | **0** | présent |
| `Elite or Nitro evaluations` | **0** | présent |
| `Payment provider :` dans la bande | **0** | présent — `payout_methods` est vide en base |

## Ce que tu dois exécuter

    1. database/RUN-futureselite-programs.sql
    2. database/RUN-futureselite.sql

Régénérés hier avec les corrections 2, 3, 5 et 6. Mêmes fichiers, même ordre.
La sauvegarde `fe_sauv_20260908_*` couvre toujours le retour en arrière.

**Aucun redéploiement n'est nécessaire** : le code est déjà en ligne.

Passe-les, recharge deux fois, et dis-le-moi. Je refetch la production et je te
prouve que chacune des six phrases périmées a disparu — par le HTML, pas par
une capture.
