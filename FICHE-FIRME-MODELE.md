# Fiche firme : modèle à remplir

Un fichier par firme, dans cet ordre. Chaque section correspond à un onglet de
`MODELE-propfirm.xlsx` : Claude recopie la fiche dans le tableur sans rien
réinterpréter.

## Trois règles pour chaque valeur

1. **Une source par valeur**, entre crochets : `[officiel](url)`, `[Trustpilot](url)`,
   ou `[tiers : nom](url)`. Seul `officiel` est publié sans question ; une valeur
   `tiers` reste en attente jusqu'à confirmation.
2. **Un statut quand la valeur manque ou se contredit** :
   - `not_published` : la firme ne le publie pas ;
   - `not_applicable` : sans objet ;
   - `needs_confirmation` : à vérifier ;
   - `source_conflict` : deux sources officielles disent autre chose.
   Les deux derniers ne s'affichent jamais sur la page.
3. **Les prix viennent du checkout officiel**, relevés le jour même, sans remise.
   Préciser si le site sert une version régionale (US, non-US…).

---

## 1. Firme (onglet Firme)

| Champ | Valeur | Source |
|---|---|---|
| Nom | | |
| Site officiel | | |
| Logo (URL d'une image carrée du site officiel) | | |
| Année de création | | |
| Pays (siège de la société qui vend) | | |
| CEO / fondateur | | |
| Marché : futures ou cfd | | |
| Trustpilot : note, nombre d'avis, URL (page en direct) | | |
| Moyens de paiement à l'achat | | |
| Prestataire des retraits (s'il y en a un seul) | | |
| Méthodes de retrait | | |
| Levier (si le même partout ; sinon, dans les règles) | | |

## 2. Textes éditoriaux (rédigés par PropFirmScanner, en anglais)

- **Titre (H1)** :
- **Description** (2 à 3 lignes sous le titre) :
- **Meta description** (160 caractères au plus) :
- **Présentation** (« Read more », paragraphes séparés par une ligne vide) :
- **Connu pour** (4 faits au plus, vrais pour TOUTE la firme) : titre + précision
- **Chiffres de transparence** (valeur + ce qu'elle mesure + source)

## 3. Programmes (onglet Programmes)

Une ligne par programme vendu aujourd'hui. Les programmes arrêtés ne figurent pas ici.

| slug | Nom | Type (evaluation / instant) | Résumé en une phrase | Comptes financés max |
|---|---|---|---|---|

## 4. Plans et prix (onglet Plans)

Une ligne par taille achetable. S'il existe des variantes au même prix de base
(RAW / commission-free…), une ligne par variante, avec son propre prix.

| Programme | Taille | Variante | Prix | Paiement unique ou abonnement mensuel | Reset | Activation | Source |
|---|---|---|---|---|---|---|---|

## 5. Règles par phase (onglet Phases)

Une ligne par programme, taille et phase (evaluation, evaluation_2, funded).
En montant quand la firme donne un montant, en % quand elle donne un %.

| Programme | Taille | Phase | Objectif | Perte max + type (statique, EOD, trailing…) | Perte jour | Jours min | Consistance | Contrats / lots max | Partage (et palier éventuel) | Plafond par retrait | Retrait minimum |
|---|---|---|---|---|---|---|---|---|---|---|---|

## 6. Règles de conduite (onglet Règles)

Une ligne par règle, telle que la firme l'écrit.

| Carte (trading / payouts / live) | Règle | Texte | Programmes | Tailles | Phase | Fait perdre le compte ? | Source |
|---|---|---|---|---|---|---|---|

## 7. Frais (onglet Coûts)

Tout ce qui n'est ni le prix ni le reset : activation, add-ons, commissions, données…

| Frais | Montant | Quand et à quelle condition | Programmes | Source |
|---|---|---|---|---|

## 8. Plateformes et options d'achat

| Plateforme | Choisie à l'achat ? | Note |
|---|---|---|

Si le checkout accepte un paramètre d'URL (plan, plateforme…), le noter ici :
c'est ce qui permet d'ouvrir le paiement avec la sélection déjà faite.

## 9. Parcours, formation, comptes après réussite

- **Parcours** (3 étapes : évaluation, compte financé, paiement) :
- **Formation incluse** :
- **Comptes proposés après la réussite** (caractéristique + valeur) :

## 10. Notre offre (onglet Offre)

| Champ | Valeur |
|---|---|
| Code | |
| Remise (%) | |
| Programmes et tailles éligibles (vide : tous) | |
| Date de fin | |
| Confirmé par le partenaire ? (oui / non) | |
| Testé au checkout ? (oui / non) | |
| Lien qui applique le code | |

## 11. Verdict (rédigé par PropFirmScanner)

- **Conclusion** :
- **Best for** (3 à 5) :
- **Things to know** (3 à 9) :

## 12. À vérifier

Liste des points encore incertains, avec les sources qui se contredisent.
