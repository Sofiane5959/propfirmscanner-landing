# Ce que tu dois faire

Établi le 5 septembre 2026. Le code est commité et poussé (`02948f9`), donc il
est déjà en production. Tout ce qui suit est de ton côté : je n'ai pas accès à
la base ni à Vercel.

Chaque fichier se colle dans **supabase.com → SQL Editor → New query → Run**.

⚠️ L'éditeur Supabase enveloppe tout le script dans **une seule transaction** :
une erreur annule tout le fichier. Et il n'affiche que le **dernier** résultat.
Donc : un fichier à la fois, et lis le message avant de passer au suivant.

---

## 1. URGENT — les clics d'affiliation ne sont plus enregistrés

**Fichier : `database/affiliate-prefetch-flag.sql`**

`app/api/go/[slug]/route.ts` écrit désormais une colonne `is_prefetch` qui
n'existe pas encore en base. L'insert est *fire-and-forget* : les visiteurs
sont bien redirigés vers les partenaires, **mais aucun clic n'est comptabilisé
depuis le déploiement**. Tu perds la mesure, pas le trafic.

C'est additif et idempotent : aucune ligne existante n'est modifiée.

À vérifier après : un clic sur n'importe quel lien de firme doit créer une
ligne dans `affiliate_clicks`.

---

## 2. La couche variantes, sans laquelle FTMO et The5ers restent faux

Dans cet ordre strict — chacun dépend du précédent.

| # | Fichier | Ce que ça fait |
|---|---|---|
| 2a | `RUN-program-schema.sql` | Crée les 7 tables. **Passe-le même si tu crois l'avoir déjà fait** : tout est en `if not exists`, le rejouer ne casse rien. C'est celui qui avait échoué sur l'erreur `42601` de politique RLS, corrigée depuis. |
| 2b | `RUN-program-schema-v2.sql` | Ajoute `variant_key`, `market`, `program_family`, et descend la devise au niveau du plan. Sans lui, FTMO Standard et Swing s'écrasent l'un l'autre à taille égale, et le Summer 100K de The5ers ne peut pas exister en 8/5 **et** 10/5. |
| 2c | `RUN-ftmo-programs-v2.sql` | Les programmes FTMO. |
| 2d | `RUN-the5ers-programs-v2.sql` | Les programmes The5ers. |

Contrôle à la fin de 2b : la requête finale doit renvoyer
`firm_rules_severity_check`. Si elle ne renvoie rien, le fichier n'est pas
passé en entier.

---

## 3. FuturesElite

| # | Fichier | Ce que ça fait |
|---|---|---|
| 3a | `RUN-futureselite-programs.sql` | **Régénéré aujourd'hui.** 4 programmes, 27 plans, 29 règles (une de plus : le conflit 3 j / 6 j sur l'Elite 25K), plateformes corrigées. Idempotent : il efface puis réinsère les lignes de cette seule firme. |
| 3b | `RUN-futureselite-trustpilot.sql` | Retire la note « 4,3 — 25 avis ». Voir l'explication plus bas. |

---

## 4. Les fiches qui n'ont jamais été rejouées

`RUN-ftmo.sql` et `RUN-the5ers.sql` n'ont pas été repassés depuis l'ajout des
six paquets de langue. C'est **exactement** ce qui fait que leurs pages
sortent en anglais avec un `canonical` faux et seulement deux `hreflang`.
Tant qu'ils ne sont pas rejoués, le problème de langue que tu as signalé
persiste, quoi que fasse le code.

---

## 5. Les trois autres firmes, si tu veux les publier

`RUN-e8-markets-programs.sql`, `RUN-city-traders-imperium-programs.sql`,
`RUN-brightfunded-programs.sql`. Elles ne dépendent que de l'étape 2a, pas de
la v2. À passer quand tu veux, dans n'importe quel ordre.

---

## 6. Un `.env.local` sur ta machine

Il n'y en a pas — seulement `.env.example`. Conséquence : `npm run build`
compile et passe le type-check, puis **échoue systématiquement** à
*Collecting page data* sur `supabaseUrl is required`. Ce n'est pas une
régression, c'est décrit dans `CLAUDE.md`, mais ça veut dire que je ne peux
jamais te confirmer qu'un build de production passe en entier.

Les quatre variables qui bloquent :

    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    STRIPE_SECRET_KEY

Ça débloquerait aussi les tests de mise en page à 320 / 375 / 768 / 1024 /
1440 px et à 200 % de zoom : ils demandent une page qui s'affiche, donc une
base qui répond.

---

## 7. Une décision qui t'appartient : la note Trustpilot

La fiche FuturesElite affichait **4,3 — 25 avis**. Ce couple vient du seed
initial et n'est rattaché à aucune source, alors que les compteurs du site
officiel de FuturesElite sont tous à zéro.

J'ai essayé de le vérifier : Trustpilot répond par un contrôle anti-robot, que
je ne contourne pas. Ne pouvant pas vérifier, j'ai préparé le retrait
(étape 3b) plutôt que de laisser en ligne une note qui pèse sur une décision
d'achat sans source.

**Si tu veux la garder** : ouvre
`https://www.trustpilot.com/review/futureselite.com` dans ton navigateur,
relève la note et le nombre d'avis, envoie-les-moi — je rejoue l'UPDATE avec
les vraies valeurs et la date du relevé. Ne passe pas 3b entre-temps.

En revanche `Country: Italy` est bien sourcé (Quantum SRL, Corso G. Matteotti
61, Latina, n° 03095010595) : je l'ai gardé.

---

## 8. Ce qu'il me manque de toi

Deux points du brief que je n'ai pas pu appliquer, faute d'avoir encore le
texte sous les yeux :

- **l'ordre des 19 sections** de la page ;
- **le hero compact** (les consignes exactes de hauteur et de contenu).

Renvoie-moi ces deux passages du brief et je les applique dans la foulée.

---

## Ordre le plus court

    1.  affiliate-prefetch-flag.sql        ← urgent, tu perds des données maintenant
    2a. RUN-program-schema.sql
    2b. RUN-program-schema-v2.sql
    2c. RUN-ftmo-programs-v2.sql
    2d. RUN-the5ers-programs-v2.sql
    3a. RUN-futureselite-programs.sql
    3b. RUN-futureselite-trustpilot.sql    ← sauf si tu relèves la vraie note
    4.  RUN-ftmo.sql puis RUN-the5ers.sql  ← corrige les langues
    5.  les trois autres firmes, quand tu veux

Après le lot, recharge une fiche **deux fois** : l'ISR sert une copie périmée
au premier appel. Juger sur le premier chargement fait chercher un bug qui
n'existe pas.
