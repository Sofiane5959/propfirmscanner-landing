# FuturesElite — corrections après refus

7 septembre 2026. **Aucune base modifiée. Aucun SQL à exécuter pour l'instant**,
conformément à ta consigne.

---

## Une chose importante, d'abord

J'ai recomparé les six erreurs factuelles au relevé officiel, champ par champ,
phase par phase, taille par taille. **Les six valeurs étaient déjà correctes
dans les données normalisées** : Instant à 80 % et en fin de journée, Nitro
financé en trailing equity, Prime avec sa limite journalière dans les deux
phases et sa régularité de 40 % financée, Instant à 20 % au départ.

L'erreur était ailleurs : les colonnes et blocs **au niveau firme** répétaient
les règles d'Elite comme si elles valaient pour les quatre programmes. Le
configurateur affichait donc les bonnes valeurs pendant que le hero, la bande
de faits et les règles clés en annonçaient d'autres.

**Une de ces erreurs était de moi.** La bande de faits disait *« End-of-day
drawdown — Instant uses trailing equity »*. C'est l'inverse. Je l'avais écrite
sans la vérifier contre ton relevé.

## 1. Erreurs factuelles

| Correction | Où c'était faux |
|---|---|
| Split de base 90 % → **80 %** | `prop_firms.profit_split`. `max_profit_split` reste 90 : la fiche annonce « de 80 % à 90 % » au lieu de 90 partout |
| Drawdown d'Instant | Ma bande de faits, corrigée |
| Trailing equity de Nitro | Déjà correct en base, plus contredit au niveau firme |
| Limite journalière de Prime | Règle clé réécrite : *« only hard risk boundary on Elite, Nitro and Instant… Prime adds one in both phases »* |
| Régularité de Prime et d'Instant | Règle réécrite : *« Elite and Nitro drop it once funded. Prime keeps a 40% rule… Instant starts at 20% »* |
| « No daily loss limit » / « No funded consistency rule » comme atouts de firme | Retirés de `pros`, `special_features`, `value_strip`, verdict |
| Sept plateformes | Six partout — description, règles, `included_items` |
| « Les grilles Nitro, Prime et Instant ne sont pas publiques » | Supprimée |
| Les 3 et 6 jours d'Elite généralisés | L'étiquette de risque dit maintenant que ces valeurs diffèrent par programme |

La bande de faits ne porte plus que ce qui vaut pour les **quatre** programmes :
futures uniquement, aucun frais d'activation, aucune limite de temps, retraits
quotidiens sous condition. Tout le reste vit dans le résumé de sélection.

## 2. Offre affiliée

Nouveau bloc en tête de la colonne droite du hero, qui lit la **même sélection**
que le configurateur : `30% OFF`, code `SCANNED` avec bouton **Copy code**,
programme et taille choisis, prix barré et prix après remise, CTA **Claim deal**
passant par la route de suivi interne.

Aucun « Best Deal » nulle part. Sur Prime 50K, 100K et 150K — et **seulement**
sur ces trois-là — un avertissement discret signale que l'offre publique à 35 %
peut faire mieux.

**Seize promesses de préremplissage supprimées**, réparties sur quatre libellés
et sept langues. Le texte dit désormais *« Check the selected plan and enter
SCANNED at checkout. »* Six d'entre elles étaient en arabe et en hindi : mon
premier test ne cherchait qu'en alphabet latin et les avait laissées passer. Le
test couvre maintenant les sept écritures.

## 3. Règles pilotées par la sélection

Vérifié par onze tests : aucun programme ne reçoit les règles d'un autre, et
les jours minimum, drawdowns, régularités et limites journalières diffèrent
bien d'un programme à l'autre dans les données.

## 4. Répétitions et espace vide

- « What you will pay » : `cost_timeline` mis à `null` pour FuturesElite. La
  section disparaît pour cette firme seule ; les ~349 autres gardent la leur.
- « Which one is right for you? » : une seule rangée de quatre cartes
  compactes, sans les puces qui répétaient la table des règles par phase.
- Espacement inter-sections 4 rem → 3 rem, padding 3 rem → 2,5 rem.
- Carte de faits « About » : sept lignes au lieu de trois — siège, marché,
  fondation, prestataire de paiement, fourchette de partage, fourchette de
  prix, retraits, drawdown, statut réglementaire.

## 5. Ordre

Une fois les sections sans données effacées, la fiche suit ton ordre :
hero, bande de faits, plateformes, configurateur, comparaison, parcours, règles
par phase, règles détaillées, À propos, forces, verdict, FAQ, CTA final.

Une réserve : l'accordéon « Full specifications » reste replié entre les forces
et le verdict. Ta liste ne le mentionne pas ; le gabarit approuvé précédent
l'autorisait à cette place. Dis-moi si tu veux qu'il disparaisse.

## 6. Tests

**138 assertions, toutes vertes.** Les neuf que tu demandes sont dans le bloc
`18. Chaque programme montre SES regles, jamais celles d un autre`.

`npx tsc --noEmit` propre hors les deux erreurs `vitest` documentées.
`npm run build` : `✓ Compiled successfully`, puis l'échec d'environnement connu.

---

## Ce que je ne peux pas te livrer

**Les captures desktop et mobile.** Elles supposent une page rendue, donc une
base qui répond. Il n'y a pas de `.env.local` sur cette machine : ni le build ni
le serveur de développement ne servent la fiche.

Tu me demandes de ne pas produire de SQL tant que la page rendue ne passe pas
les contrôles. Je ne peux ni rendre la page, ni donc valider ces contrôles à
l'écran. **Je ne déclare pas la tâche terminée.**

Deux façons de débloquer :

1. Donne-moi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` et `STRIPE_SECRET_KEY`. Je lance le serveur, je
   prends les captures à 320, 375, 768, 1024 et 1440 px, je vérifie la console
   et l'hydratation.
2. Ou bien tu déploies le code seul — sans toucher à la base — et je mesure sur
   la production. Les corrections de **code** seront visibles ainsi ; celles de
   **données** attendront le SQL.

**Attention** : les fichiers `RUN-futureselite*.sql` du dépôt sont désormais en
avance sur ta base, puisqu'ils se régénèrent à chaque modification des données.
Ne les joue pas avant que la page soit validée.
