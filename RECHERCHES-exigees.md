# Les six recherches exigées — résultat

7 septembre 2026. Recherche sur `*.mjs`, `*.tsx`, `*.ts`, `*.sql`, `*.json`,
hors `node_modules` et `.next`, donc sources **et** SQL généré.

| Formulation | Occurrences |
|---|---|
| `all four settle at a 90%` | **0** |
| `Instant uses trailing equity` | **0** |
| `seven platforms` | **0** |
| `price lists are not public` | **0** |
| `Code applied automatically` | **0** |
| `3 minimum trading days in evaluation, 6 once funded` | **0** |

Et leurs équivalents français, que la consigne ne listait pas mais qui
atteignent le même visiteur : `sept plateformes` **0**, `ne sont pas publiques`
**0**, `appliqué automatiquement` **0**, `6 une fois financé` **0**.

Le test `19. Les six formulations refusees ne reviennent nulle part` les
rejoue à chaque exécution.

## Les 90 % restants

Tous légitimes et explicitement rattachés à un programme :

    '90% profit split on Elite, Nitro and Prime; 80% on Instant'
    'Profit split up to 90% — 80% on Instant'
    '90% on the 1-Step, unconditionally…'          (FTMO)
    '90% split on the 1-Step, the higher of the two products'  (FTMO)

---

## Pourquoi le PDF montrait encore l'ancien contenu

**Le bloc `translations.fr` n'avait jamais été corrigé.** J'avais nettoyé les
colonnes de base anglaises et laissé intacte la surcouche française, qui
recopie les mêmes affirmations : « 90 % de partage », « aucune limite de perte
journalière », « sept plateformes », « les grilles Nitro, Prime et Instant ne
sont pas publiques ». Un visiteur francophone lisait donc l'intégralité du
contenu refusé.

Trois textes anglais m'avaient échappé aussi, dont la présentation du hero que
j'avais rédigée moi-même : *« All four settle at a 90% profit split »*. Instant
en paie 80.

## Corrections appliquées

| Point | Ce qui a changé |
|---|---|
| Split d'Instant | Description EN et FR réécrites : « Elite, Nitro and Prime settle at 90%; Instant pays 80% » |
| Drawdown d'Instant / Nitro | Règle clé : fin de journée sur Elite, Nitro et Instant ; Nitro bascule en trailing equity une fois financé |
| Limite journalière de Prime | Nommée dans la règle clé et dans les atouts, EN et FR |
| Régularité Prime 40 % / Instant 20 % | Règle « Consistency rules differ by program » |
| Faits de firme | La bande ne porte plus que ce qui vaut pour les quatre programmes |
| Six plateformes | Partout, EN et FR, description et listes comprises |
| Grilles « pas publiques » | Supprimée, EN et FR, plus le badge « Public pricing » d'Elite qui l'insinuait |
| 3 / 6 jours | Remplacé par « les jours minimum diffèrent selon le programme ; Elite exige 6 jours **profitables** au-dessus d'un seuil lié à la taille » |
| « Code applied automatically » | Devient « Copy SCANNED and enter it at checkout », dans les sept langues |
| Date de vérification | 7 septembre 2026 — et rendue **propre à chaque firme** : la déplacer globalement aurait daté faussement FTMO et The5ers |
| « What you will pay » | `cost_timeline` à `null` pour cette firme |
| Espace avant « About » | Espacement inter-sections 4 rem → 3 rem ; les sections sans données ne rendent rien |

## Vérifications

`npm run test:programs` — **148 assertions, toutes vertes.**
`npx tsc --noEmit` — propre hors les deux erreurs `vitest` documentées.
`npm run build` — `✓ Compiled successfully`, puis l'échec d'environnement connu.

---

## Le PDF et les captures : toujours impossibles, et voici exactement pourquoi

Tu me les demandes pour la troisième fois. Je ne les ai pas, et je ne veux pas
laisser croire que je traîne.

`app/[locale]/prop-firm/[slug]/page.tsx` interroge Supabase **côté serveur**
avant de rendre quoi que ce soit. Sans identifiants, la page ne se construit
pas : `npm run build` s'arrête à *Collecting page data*, et `npm run dev`
renvoie la même erreur à la première requête. Il n'y a rien à photographier.

Il n'existe sur cette machine que `.env.example`. Il me faut ces quatre
variables dans un fichier `.env.local` à la racine :

    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    SUPABASE_SERVICE_ROLE_KEY=
    STRIPE_SECRET_KEY=

Dès que je les ai, je livre dans la foulée : le PDF desktop, et les captures
avec Elite, Prime puis Instant sélectionnés séparément, à 320, 375, 768, 1024
et 1440 px.

**Deuxième voie possible :** déploie le code seul, sans toucher à la base, et
dis-le-moi. Je mesure alors sur la production. Attention à ce que tu verras
dans ce cas — les corrections de **code** seront visibles, mais celles de
**données** (règles, atouts, description, plateformes, date) resteront
invisibles tant que le SQL n'est pas passé. Le PDF montrerait encore l'ancien
texte, et pour une raison différente cette fois.

Je ne déclare pas la tâche terminée.
