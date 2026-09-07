# Ce qu'il reste à faire

Mis à jour le 7 septembre 2026, après alignement sur tes données officielles.

## Le résultat de la comparaison

J'ai comparé ton JSON officiel du 7 septembre à toutes les données en place,
programme par programme, taille par taille : prix, objectifs, pertes maximales,
pertes journalières, jours minimum, plafonds de retrait, partages de profits,
échelles de bundle.

**Un seul écart chiffré est ressorti.** Toute la reconstruction du classeur
d'août — celle dont les colonnes étaient décalées — est confirmée exacte, y
compris les 80 % de partage sur Instant, la limite journalière propre à Prime
et les quatre échelles de bundle.

L'écart : **SCANNED vaut 30 %, pas 20 %.**

Ce n'est pas un détail. À 20 %, notre code était moins bon que l'offre publique
**sur les quinze plans**, et la fiche le disait. À 30 % il est :

- **meilleur** sur l'Elite 25K (l'offre publique n'y donne que 25 %) ;
- **égal** sur onze plans ;
- **moins bon** sur Prime 50K, 100K et 150K seulement (offre publique à 35 %).

La note affichée sous le prix nomme désormais ces trois plans au lieu d'une
mise en garde générale qui aurait été fausse quatorze fois sur quinze.

Le libellé du code reprend mot pour mot celui que ton relevé autorise :
*« 30% with code SCANNED — eligibility and best-price status pending
confirmation »*. Un test vérifie qu'aucune des formulations interdites
(« best deal », « best verified price ») n'y figure, et qu'aucun code `MATCH`
n'entre dans nos données.

## Autres corrections issues du relevé

- **Plateformes** : ta page marketing et ton configurateur n'exposent pas la
  même liste. J'avais retiré WealthCharts en me fiant à la page marketing seule
  — c'était une erreur. La colonne affichée porte maintenant les **six du
  configurateur** (ce qu'on peut réellement choisir à l'achat) ; Volumetrica et
  DeepCharts sont conservées en base marquées `marketing_only`.
- **Plafond Nitro** : plus aucun chiffre publié. La FAQ dit 3, le configurateur
  a affiché MAX 4, le bundle en vend 5. Trois sources officielles, trois
  réponses — trancher serait un choix, pas un fait.
- **Quatre conflits** publiés comme non résolus, avec leurs sources : Prime 150K
  perte maximale (4 500 contre 4 000), Instant 25K documenté mais non
  achetable, plafond Nitro, durée d'évaluation Prime.
- **Jour profitable** : nouvelle règle. « 6 jours avant retrait » se lisait
  comme six jours de présence, alors qu'un jour ne compte qu'au-dessus de
  100 $ / 150 $ / 250 $ / 350 $ selon la taille. C'est un bloqueur de retrait.

## SQL à passer

Un fichier à la fois dans **supabase.com → SQL Editor**.

    1. database/RUN-futureselite-programs.sql   ← SCANNED 30 %, 8 plateformes, 34 règles
    2. database/RUN-futureselite.sql            ← bande de faits, parcours, règles, verdict
    3. database/RUN-ftmo.sql
    4. database/RUN-the5ers.sql

Sans le premier, le prix remisé reste faux de dix points. Sans le deuxième,
aucune correction éditoriale n'est visible.

Puis recharge chaque fiche **deux fois** : le premier appel sert une copie
périmée.

## Ce que je ne peux toujours pas vérifier

**Les captures, le PDF et « aucune erreur console ou d'hydratation ».** Il faut
une page qui s'affiche, donc une base qui répond. Il n'y a pas de `.env.local`
sur cette machine :

    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    STRIPE_SECRET_KEY

Donne-les-moi, ou passe le SQL et déploie — je mesure alors sur la production.

**`affiliate-prefetch-flag.sql`** ne laisse aucune trace sur une page. Clique un
lien de firme et regarde si une ligne apparaît dans `affiliate_clicks`.

## À demander à FuturesElite

Par ordre d'utilité :

1. **Éligibilité et expiration de SCANNED.** Le relevé dit que le code
   fonctionne mais que ni les programmes couverts ni la date de fin ne sont
   confirmés. Tant que ce n'est pas écrit, la fiche garde sa réserve.
2. **Prime 150K** : 4 500 $ ou 4 000 $ de perte maximale.
3. **Plafond Nitro** : 3, 4 ou 5 comptes financés.
4. **Instant 25K** : documenté dans la FAQ, absent du configurateur.
5. **Régularité Elite 25K** : 40 % ou 50 %.
6. **Elite 25K jours minimum** : 3 sur le configurateur, 6 dans la FAQ retraits.
7. **Expiration de SUMMER** : non publiée.
8. **Trustpilot** : « 4,3 — 25 avis » sans source ; retrait préparé.
