# Ce qu'il reste à faire

Mis à jour le 5 septembre 2026, après la restauration du gabarit Earn2Trade.

## SQL à passer, dans cet ordre

Un fichier à la fois dans **supabase.com → SQL Editor** : l'éditeur enveloppe
tout dans une seule transaction, une erreur annule le fichier entier.

    1. database/RUN-futureselite.sql   ← régénéré, 34 colonnes
    2. database/RUN-ftmo.sql
    3. database/RUN-the5ers.sql

`RUN-futureselite.sql` porte maintenant quatre champs éditoriaux nouveaux :
`headline`, `verdict`, `description` et `category_badge`. Sans eux le H1 de la
fiche retombe sur le nom de la firme — c'est exactement le « FuturesElite sous
FuturesElite » que le brief demande de supprimer. Le composant était correct,
la donnée manquait.

`RUN-ftmo.sql` et `RUN-the5ers.sql` restent nécessaires pour les langues : les
deux fiches n'annoncent que `en` et `fr` au lieu de huit.

Puis recharge chaque fiche **deux fois** : le premier appel sert une copie
périmée.

## Ce que je n'ai pas pu vérifier

**`affiliate-prefetch-flag.sql`** ne laisse aucune trace sur une page. Clique un
lien de firme et regarde si une ligne apparaît dans `affiliate_clicks`. Si la
table ne bouge pas, la colonne `is_prefetch` manque encore et aucun clic n'est
compté.

**Les captures d'écran** demandées au point 4 du handoff. Elles supposent une
page qui s'affiche, donc une base qui répond. Il n'y a pas de `.env.local` sur
cette machine — seulement `.env.example` — donc `npm run build` s'arrête à
*Collecting page data* et `npm run dev` ne servirait pas la fiche non plus.

Les quatre variables qui bloquent :

    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    STRIPE_SECRET_KEY

Donne-les-moi, ou déploie et dis-le-moi : je prends les captures à 375, 768,
1024 et 1440 px plus le rendu impression, et je compare pixel à pixel avec
Earn2Trade.

**Le lint.** Le projet n'a aucune configuration ESLint : `npm run lint` propose
d'en créer une plutôt que de vérifier quoi que ce soit. Je n'en ai pas ajouté —
ce serait une décision de projet, pas une correction de fiche. Le type-check,
lui, passe.

## Une décision qui t'appartient

La note Trustpilot « 4,3 — 25 avis » de FuturesElite ne vient d'aucune source,
et Trustpilot répond par un contrôle anti-robot que je ne contourne pas.
`database/RUN-futureselite-trustpilot.sql` la retire. Si tu préfères la garder,
relève les vrais chiffres dans ton navigateur et envoie-les-moi.

## Conflits de données non résolus

Séparés des questions de code, comme demandé :

- **Elite 25K, jours minimum** : le configurateur dit 3, la FAQ paiements dit 6.
  Les deux peuvent être vrais — réussir l'évaluation, puis devenir éligible au
  retrait — mais aucune page officielle ne le dit. Publié comme
  `Needs confirmation` avec les deux liens.
- **Règle de régularité** : la page officielle affiche 40 % et 50 % côte à côte
  sans dire laquelle s'applique.
- **Scalping** : le configurateur affiche « No » sur tous les plans, sans
  définition ni seuil de durée.
- **News trading une fois financé** : « With restrictions », sans fenêtre
  d'événement précisée.
- **Coupon `scanned`** : le lien d'affiliation préremplit −20 % alors que
  l'offre publique SUMMER donne −25 %. Tu as choisi de garder le lien ; la
  promotion est stockée avec `is_public: false` pour que la page ne présente
  jamais `SCANNED` comme le meilleur prix.
