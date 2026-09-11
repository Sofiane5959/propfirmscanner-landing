# Modèle vierge — une prop firm, une seule source

Un fichier par firme. Tu le remplis, je le charge, la page se construit.
**Un champ vide fait disparaître sa ligne ou sa section.** Rien n'est inventé
pour combler un trou.

---

## La règle qui manquait

Aujourd'hui la même information vit à plusieurs endroits : fixtures dans
`scripts/`, huit tables normalisées, une centaine de colonnes héritées,
traductions, blocs JSON. C'est pour ça que chaque séance a fait remonter une
valeur qui en contredisait une autre.

**Désormais : une firme = un fichier.** S'il n'est pas dans le fichier, il ne
s'affiche pas.

---

## Le gabarit

Huit sections, dans cet ordre. Elles existent déjà dans le composant.

### 1 · En-tête

| Champ | Ce qu'on voit | Si vide |
|---|---|---|
| `nom` | le nom de la firme | obligatoire |
| `logo` | l'image, en haut à gauche | initiale du nom |
| `titre` | le H1 — une proposition de valeur, pas le nom répété | obligatoire |
| `site` | lien « official website » | lien masqué |
| `pays` · `annee_creation` · `type` | trois faits d'état civil, sur une ligne | chacun disparaît seul |
| `note` `{valeur, nombre_avis}` | l'étoile | pas d'étoile |
| `verifie_le` | « Firm information reviewed on … » | ligne masquée |

### 2 · Bande de faits

Quatre faits produit, puis les faits de firme.

| Champ | Règle |
|---|---|
| `marches` | `futures`, `cfd`, `stocks`… |
| `plateformes` | celles **sélectionnables à l'achat**, pas celles citées |
| `moyens_paiement` | pour les retraits |
| `faits` | liste libre — **chacun doit être vrai de TOUS les programmes** |

Un fait qui n'est vrai que d'un programme n'a rien à faire ici : il va dans le
programme concerné. C'est ce qui produisait « les quatre paient 90 % » alors
qu'Instant paie 80.

### 3 · Programmes et tailles

Le cœur. Le visiteur choisit : marché → programme → variante → taille.
Chaque sélecteur disparaît quand il n'y a qu'un choix.

```
programmes:
  - slug:            elite
    nom:             Elite
    marche:          futures
    type:            evaluation | instant
    nb_etapes:       1
    resume:          une phrase
    max_comptes:     5              # null si non confirmé
    plans:
      - taille:      25000
        variante:    null           # ex. "swing", "8/5" — null si une seule
        devise:      USD
        prix:        95
        phases:
          - phase:            evaluation | evaluation_2 | sim_funded
            objectif_profit:  1500
            perte_max:        1250
            perte_jour:       null   # vide = non publiée · écrire "aucune" si la firme dit qu'il n'y en a pas
            type_drawdown:    End of Day | Trailing Equity | Static
            jours_min:        3
            regle_regularite: 0.20
            partage:          0.90
            plafond_retrait:  1000
            delai_retrait:    1
            frais_reset:      79
            frais_activation: 0
```

Une **sélection commerciale** = programme + variante + taille. Les phases en
sont les enfants, jamais des cartes séparées.

### 4 · Règles

```
regles:
  - portee:      compte | conduite | session | live
    titre:       Automated trading
    detail:      Fully automated AI or bots are not permitted.
    gravite:     bloquante | importante | information
    confiance:   confirmee | conflit_ouvert
    source:      https://…
```

`confiance: conflit_ouvert` affiche la règle **avec sa réserve** au lieu de
trancher à ta place.

### 5 · Offre

```
offre:
  code:        SCANNED
  remise:      0.30
  portee:      universelle_verifiee | restreinte | non_confirmee
  expire_le:   null
  checkout_verifie: false
```

- `portee: non_confirmee` ou `checkout_verifie: false` → les prix remisés
  s'affichent en **« ≈ 66,50 $ — estimation, à vérifier au paiement »**, jamais
  en prix barré.
- Le lien sortant passe **toujours** par `/api/go/[slug]`.

### 6 · À propos · 7 · Points forts et limites · 8 · Verdict et FAQ

```
a_propos:     [ paragraphe, paragraphe ]
points_forts: [ ... ]
limites:      [ ... ]
verdict:
  texte:       …
  pour_qui:    [ ... ]
  pas_pour:    [ ... ]
faq:          [ { question, reponse } ]
```

Chaque bloc vide fait disparaître sa section.

---

## Ce que je te demande

1. **Valide ou corrige ce gabarit** — enlève ce qui ne te sert pas, ajoute ce
   qui manque.
2. **Dis-moi par quelle firme commencer.** Tu me donnes ses données dans cette
   forme, je remplis, tu regardes la page.
3. Quand une firme sort du gabarit, on traite **cette firme-là** à la main, sans
   toucher aux autres.

Je ne touche à rien tant que tu n'as pas validé le gabarit.
