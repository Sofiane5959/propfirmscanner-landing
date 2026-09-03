# PropFirmScanner

Comparateur de prop trading firms avec tunnel d'affiliation.
Next.js 14.2.3, TypeScript, Tailwind, Supabase, next-intl.
Déploiement Vercel via GitHub Desktop — pas de git en ligne de commande.

## Pièges connus

- `platforms` et `challenge_types` sont typées TEXT en Postgres mais déclarées
  `string[]` en TypeScript. Toujours importer `toArray` depuis
  `lib/to-array.ts`. TypeScript ne voit rien, l'erreur n'apparaît qu'au runtime
  sur `.map()` ou `.forEach()`. Ce mismatch a mis `/compare` hors service deux
  fois en août 2026, puis a fait échouer le build de production le 3 septembre
  2026 sur les 21 pages `/compare/ftmo-vs-*`.

  La cause de la troisième panne : `toArray` était recopiée à l'identique dans
  quatre fichiers et exportée d'aucun, donc les consommateurs qui en avaient
  besoin n'avaient rien à importer. Elle vit maintenant dans `lib/to-array.ts`
  et accepte les quatre formats présents en base : tableau, liste à virgules,
  JSON dans une colonne TEXT, littéral `{a,b}`.

  Consommateurs : PropFirmPageClient, ChallengeSelector, ComparePageClient,
  `components/compare/PropFirmCard.tsx` **et** `components/PropFirmCard.tsx`
  (deux fichiers distincts), `app/[locale]/compare/[slug]/page.tsx`,
  `app/[locale]/best-for/[category]/page.tsx`,
  `app/[locale]/dashboard/favorites/page.tsx`.

- `scripts/build-firm-content.mjs` écrit `platforms` en liste séparée par des
  virgules, jamais en JSON. Du JSON dans cette colonne TEXT affichait des
  puces « MetaTrader 4" » et « ["MetaTrader 4 » sur les fiches.

- `profit_split` n'est renseignée que sur une poignée de firmes ; la colonne
  alimentée pour tout le catalogue est `max_profit_split` (119 firmes ont la
  seconde sans la première). Tout filtre ou affichage doit lire
  `profit_split ?? max_profit_split`. Un filtre sur `profit_split` seule ne
  listait que 24 firmes sur `/best-for/high-profit-split` au lieu de 132.
  Ne jamais recopier l'une dans l'autre : « jusqu'à 90 % » ne dit pas où la
  firme commence.
- `prop_firm_challenges.id` n'a pas de valeur par défaut. Tout INSERT doit
  fournir `gen_random_uuid()`.
- Supabase renvoie `any`. Annoter explicitement les callbacks de `.map()` et
  `.reduce()`, sinon `noImplicitAny` échoue.
- Les UUID passés à `.not('id','in', ...)` de PostgREST doivent être entre
  guillemets doubles, sinon le filtre échoue silencieusement et renvoie zéro
  résultat sans erreur.
- `lib/risk.test.ts` et `lib/simulate.test.ts` échouent au type-check car
  `vitest` n'est pas installé. Erreurs préexistantes, sans rapport avec le
  reste du code.

## Règles

- Tout lien sortant vers une prop firm passe par `buildAffiliateUrl()` dans
  `lib/affiliate.ts`. Jamais d'URL partenaire en dur, jamais de contournement
  de `/api/go/[slug]`.
- Ne jamais afficher de prix barré si `discount_code` est NULL.
- Le tracking ne doit jamais bloquer une redirection. L'insert reste
  fire-and-forget.
- Le contenu des pages firmes vit en base, pas dans les composants. Une section
  disparaît quand sa colonne JSONB est NULL. Une seule page sert 350 firmes —
  ne jamais créer de composant spécifique à une firme.
- Vérifier toute donnée firme contre la source officielle avant publication.
  Ne jamais déduire un chiffre par analogie : les codes de plan Earn2Trade
  étaient `GAU50`, pas `GM50`, et la déduction a coûté plusieurs allers-retours.
- Ne pas promettre au visiteur ce que le partenaire ne garantit pas. Le coupon
  n'est certain que sur un deep link vers le checkout.

## Vérifications avant de conclure

Lancer `npm run build` et `npx tsc --noEmit`. Ne pas annoncer qu'une tâche est
terminée sans les avoir passés.

Prérequis : un `.env.local` renseigné. Sans lui, `npm run build` échoue pendant
*Collecting page data* — plusieurs routes API construisent leur client Supabase
ou Stripe au chargement du module, donc le build casse en cascade
(`supabaseUrl is required`, puis Stripe `Neither apiKey nor config.authenticator
provided`). L'échec vient des variables manquantes, pas du code : la phase
`Compiled successfully` et le type-check, eux, passent. Bloquent le build :
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`. Pour recenser la liste
complète des variables attendues :

    grep -rho "process\.env\.[A-Z0-9_]*" app lib components middleware.ts i18n.ts | sed 's/.*env\.//' | sort -u
