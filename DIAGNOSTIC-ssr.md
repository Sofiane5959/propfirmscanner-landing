# Diagnostic SSR — et ce qu'il faut corriger

8 septembre 2026. Mesures horodatées sur `www.propfirmscanner.org`, cache
contourné.

## Il n'y a pas de divergence SSR / hydratation

J'ai récupéré le HTML **serveur** en `curl` — donc avant tout JavaScript — et
compté les marqueurs propres à chaque composant.

    2026-09-07T22:57:04Z  GET /prop-firm/futureselite?p=…

| Marqueur | Occurrences | Appartient à |
|---|---|---|
| `Claim deal` | **2** | nouveau composant |
| `SCANNED` | **11** | nouveau composant |
| `% OFF` | **1** | nouveau composant |
| `Your selection` | **1** | nouveau composant |
| `Trading involves substantial risk` | **1** | nouveau composant |
| `Leverage (forex)` | **0** | ancien |
| `What you will pay` | **0** | ancien |
| `Find the program that fits you` | **0** | ancien |
| `Which one is right for you` | **0** | ancien |

**Le nouveau composant est seul dans le HTML serveur. L'ancien n'y est nulle
part.** Les six causes envisagées sont donc écartées : pas deux composants,
pas de divergence hydratation, pas de repli hérité, pas de requête différente
côté client — le composant ne requête rien.

### Ce que tu as vu, expliqué ligne par ligne

| Ce que tu as relevé | Réalité mesurée |
|---|---|
| `No daily loss limit` | Présent, mais **qualifié** : *« on Elite, Nitro and Instant — Prime has one in both phases »*. C'est la version corrigée, dans `pros`, pas l'ancienne affirmation de firme |
| `End-of-day drawdown` | Idem, qualifié : *« on Elite, Nitro and Instant »* |
| `What you will pay` | **0 occurrence** |
| `Leverage (forex) 1:100` | **0 occurrence** |
| Ancien About / strengths | Ce sont les nouveaux, rendus par `FirmPage` depuis `narrative.about` et `narrative.strengths` |
| Formulation plateformes | À vérifier après le correctif ci-dessous |

L'explication la plus probable de ton observation : `X-Vercel-Cache: STALE`.
La première requête sert une copie périmée et revalide en arrière-plan. Un
`view-source` ou un PDF pris à ce moment montre l'ancien HTML pendant que le
navigateur, lui, a déjà la nouvelle version. C'est le même piège que celui qui
avait rendu le brief de conformité caduc il y a deux jours.

## Le vrai défaut : `Italy · cfd prop firm`

Tu as raison, et la cause n'est ni le composant ni le modèle.

`RUN-futureselite-programs.sql` insérait les programmes **sans la colonne
`market`**. Elle a donc pris son défaut de schéma :

```sql
alter table firm_programs add column ... market text not null default 'cfd'
```

Deux conséquences :

1. le hero annonce « cfd prop firm », puisque `identity.firmType` dérive du
   marché des programmes ;
2. le fait de firme **« Futures only » disparaît** — sa construction exige que
   les programmes *et* `prop_firms.is_futures` s'accordent sur le marché, et ce
   n'était plus le cas. La bande n'affiche donc qu'un seul fait au lieu de deux.

Le second point est invisible à l'œil mais c'est le plus instructif : la
sécurité que j'ai posée sur `universalFact()` a fait exactement son travail —
elle a refusé un fait que les données ne soutenaient plus.

### Corrections apportées

**Générateur** — `market` et `status` sont maintenant écrits explicitement, et
`currency` sur les plans. Un défaut de colonne n'est pas une valeur vérifiée.

**Données** — `market: 'futures'` et `status: 'active'` deviennent des champs
explicites des quatre programmes, plus une valeur devinée par le générateur.

**Test** — le nouveau bloc `20. Aucune colonne dont la page depend n'est
laissee a son defaut` lit le SQL généré et vérifie la présence de `market`,
`status` et `currency` dans les listes de colonnes. Il a d'ailleurs trouvé le
second cas tout seul : `currency` était laissée à `'USD'`, juste ici par
hasard, fausse le jour où une firme facture en euros.

**Aucun composant n'a été modifié pour cela.**

## Ce que je n'ai pas eu à corriger

Mesuré, pas supposé :

- **`+N more` sur les plateformes** : aucune occurrence. Les six sélectionnables
  sont rendues en entier.
- **Bannière « Top deals »** : aucune occurrence sur cette fiche. Elle ne
  concurrence rien ici. Si tu l'as vue, c'était sur une autre page ou une copie
  en cache — dis-moi où et je regarde.
- **Levier forex** : déjà absent, la correction du composant est en ligne.
- **Section Costs** : absente.
- **`/api/go`** : les deux `Claim deal` utilisent `ctaHref`, construit par
  `buildAffiliateUrl` qui renvoie `/api/go/${firmSlug}?…`. Le composant ne
  fabrique aucune URL.
- **`SCANNED` et `Claim deal` dans le HTML serveur** : 11 et 2 occurrences,
  mesurées ci-dessus. C'est ta validation n° 9, satisfaite.

## Ce que tu dois exécuter

**Un seul fichier**, ciblé :

    database/RUN-futureselite-correctif-market.sql

Un `update` sur deux colonnes de quatre lignes. Je n'ai pas régénéré un rejeu
complet : recréer les programmes changerait leurs `id`, donc entraînerait la
suppression et la réinsertion des 27 plans. Pour corriger deux colonnes, c'est
disproportionné.

Attendu :

    elite   | Elite   | futures | active
    nitro   | Nitro   | futures | active
    prime   | Prime   | futures | active
    instant | Instant | futures | active

Le fichier contient aussi une **requête en lecture seule** qui signale les
programmes dont le marché contredit la fiche, toutes firmes confondues. Le même
oubli existe peut-être sur FTMO et The5ers, dont les packs sont générés par un
autre script. Je n'y touche pas : tu as demandé de les laisser.

Après exécution, recharge **deux fois**. Attendu : « Italy · Futures prop
firm », et deux faits de firme au lieu d'un.

## Validation : où j'en suis

| # | Demandé | État |
|---|---|---|
| 1 | HTML de production ne montrant que le nouveau modèle | **fourni** ci-dessus |
| 2 | Absence de divergence d'hydratation | **fourni** — un seul composant dans le HTML |
| 9 | `SCANNED` et `Claim deal` dans le HTML serveur | **fourni** — 11 et 2 |
| 7 | Absence du levier forex | **fourni** — 0 occurrence |
| 10 | TypeScript, tests, build | **fourni** — voir ci-dessous |
| 8 | « Futures prop firm » | **après** le correctif SQL |
| 3–6 | Captures 1440 px, 390 px, Elite / Nitro / Prime / Instant | **bloqué** |

### Tests

    npm run test:programs    152 assertions, toutes vertes
    npm run model:report      34 assertions, toutes vertes
    npx tsc --noEmit         propre, hors les deux erreurs `vitest` documentées
    npm run build            ✓ Compiled successfully, puis l'échec d'environnement connu

### Les captures

Toujours impossibles ici : pas de `.env.local`, donc aucune page ne se
construit sur cette machine. **Mais elles sont désormais possibles sur la
production**, puisque le pilote y est déployé.

Passe le correctif, puis dis-le-moi : je prends les quatre sélections — Elite,
Nitro, Prime, Instant — à 1440 et 390 px, sur l'URL de production, et je
vérifie que chaque sélection met bien à jour règles et tarifs.

`PILOTE_MODELE = new Set(['futureselite'])` reste inchangé.
