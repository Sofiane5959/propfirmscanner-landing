# Rapport mode ombre — aucune fiche modifiee

Genere le 2026-09-08 par `npm run shadow:report`.

## futureselite

| | |
|---|---|
| Programmes | 4 |
| **Selections commerciales** | **15** |
| Lignes de phase | 27 |
| Marches | futures |
| Type de firme | Futures prop firm |
| Devises | USD 95–569 |
| Faits de firme | 2 |
| Plateformes | 8 |
| Regles detaillees | 33 |
| Code promo | SCANNED |
| **Erreurs bloquantes** | **0** |
| Avertissements | 8 |

### Selections commerciales

| Marche | Programme | Variante | Taille | Phases | Devise | Prix | Promotion resolue | Confiance de portee |
|---|---|---|---|---|---|---|---|---|
| futures | Elite | — | 25,000 | evaluation → sim_funded | USD | 95 → 66.5 | SCANNED −30% | unconfirmed |
| futures | Elite | — | 50,000 | evaluation → sim_funded | USD | 153 → 107.1 | SCANNED −30% | unconfirmed |
| futures | Elite | — | 100,000 | evaluation → sim_funded | USD | 293 → 205.1 | SCANNED −30% | unconfirmed |
| futures | Elite | — | 150,000 | evaluation → sim_funded | USD | 353 → 247.1 | SCANNED −30% | unconfirmed |
| futures | Nitro | — | 25,000 | evaluation → sim_funded | USD | 129 → 90.3 | SCANNED −30% | unconfirmed |
| futures | Nitro | — | 50,000 | evaluation → sim_funded | USD | 138 → 96.6 | SCANNED −30% | unconfirmed |
| futures | Nitro | — | 100,000 | evaluation → sim_funded | USD | 218 → 152.6 | SCANNED −30% | unconfirmed |
| futures | Nitro | — | 150,000 | evaluation → sim_funded | USD | 298 → 208.6 | SCANNED −30% | unconfirmed |
| futures | Prime | — | 25,000 | evaluation → sim_funded | USD | 96 → 67.2 | SCANNED −30% | unconfirmed |
| futures | Prime | — | 50,000 | evaluation → sim_funded | USD | 179 → 125.3 | SCANNED −30% | unconfirmed |
| futures | Prime | — | 100,000 | evaluation → sim_funded | USD | 279 → 195.3 | SCANNED −30% | unconfirmed |
| futures | Prime | — | 150,000 | evaluation → sim_funded | USD | 369 → 258.3 | SCANNED −30% | unconfirmed |
| futures | Instant | — | 50,000 | sim_funded | USD | 349 → 244.3 | SCANNED −30% | unconfirmed |
| futures | Instant | — | 100,000 | sim_funded | USD | 469 → 328.3 | SCANNED −30% | unconfirmed |
| futures | Instant | — | 150,000 | sim_funded | USD | 569 → 398.3 | SCANNED −30% | unconfirmed |

Provenance de l offre :

- `offer` — firm_promotions.code,discount_value,is_public,status,starts_at,expires_at
- `priceRanges` — firm_program_plans.regular_price,currency
- code : `SCANNED`, portee : **unconfirmed**, expiration non publiee
- mention affichee : « Code SCANNED is reported to work; eligibility per program and size is not confirmed. Check the total at checkout. »
- **La portee n'est pas etablie.** Le code est presente comme rapporte,
  jamais comme applicable a l'ensemble du catalogue.

Avertissements :

- `PROMO_SCOPE_UNCONFIRMED` **offer.scopeConfidence** — Portee de la promotion non confirmee : ne pas revendiquer une applicabilite generale.
- `PROMO_EXPIRY_UNKNOWN` **offer.expiryUnknown** — Aucune date de fin publiee : ne jamais presenter l offre comme permanente.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Scalping** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.News trading, funded** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Prime 150K maximum loss** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Instant 25K availability** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Nitro funded accounts** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Prime evaluation length** — Conflit de sources officielles encore ouvert.

## ftmo

| | |
|---|---|
| Programmes | 2 |
| **Selections commerciales** | **14** |
| Lignes de phase | 37 |
| Marches | cfd |
| Type de firme | CFD prop firm |
| Devises | EUR 79–1080 |
| Faits de firme | 1 |
| Plateformes | 4 |
| Regles detaillees | 9 |
| Code promo | aucun |
| **Erreurs bloquantes** | **10** |
| Avertissements | 6 |

### Selections commerciales

| Marche | Programme | Variante | Taille | Phases | Devise | Prix | Promotion resolue | Confiance de portee |
|---|---|---|---|---|---|---|---|---|
| cfd | FTMO Challenge 1-Step | Standard | 10,000 | evaluation → sim_funded | EUR | 79 | aucune | — |
| cfd | FTMO Challenge 1-Step | Standard | 25,000 | evaluation → sim_funded | EUR | 199 | aucune | — |
| cfd | FTMO Challenge 1-Step | Standard | 50,000 | evaluation → sim_funded | EUR | 319 | aucune | — |
| cfd | FTMO Challenge 1-Step | Standard | 100,000 | evaluation → sim_funded | EUR | 499 | aucune | — |
| cfd | FTMO Challenge 1-Step | Standard | 200,000 | evaluation → sim_funded | EUR | 999 | aucune | — |
| cfd | FTMO Challenge 2-Step | Standard | 10,000 | evaluation → evaluation_2 → sim_funded | EUR | 89 | aucune | — |
| cfd | FTMO Challenge 2-Step | Swing | 10,000 | evaluation → evaluation_2 → sim_funded | EUR | 99 | aucune | — |
| cfd | FTMO Challenge 2-Step | Standard | 25,000 | evaluation → evaluation_2 → sim_funded | EUR | 250 | aucune | — |
| cfd | FTMO Challenge 2-Step | Swing | 25,000 | evaluation → evaluation_2 → sim_funded | EUR | 279 | aucune | — |
| cfd | FTMO Challenge 2-Step | Standard | 50,000 | evaluation → evaluation_2 → sim_funded | EUR | 345 | aucune | — |
| cfd | FTMO Challenge 2-Step | Swing | 50,000 | evaluation → evaluation_2 → sim_funded | EUR | 379 | aucune | — |
| cfd | FTMO Challenge 2-Step | Standard | 100,000 | evaluation → evaluation_2 → sim_funded | EUR | 540 | aucune | — |
| cfd | FTMO Challenge 2-Step | Swing | 100,000 | evaluation → evaluation_2 → sim_funded | EUR | 599 | aucune | — |
| cfd | FTMO Challenge 2-Step | Standard | 200,000 | evaluation → evaluation_2 → sim_funded | EUR | 1080 | aucune | — |

**Aucune offre resolue.** Aucun prix barre, aucun code, aucun pourcentage
ne sera affiche ; le CTA reste neutre et suivi.

Avertissements :

- `SOURCE_CONFLICT_OPEN` **rules.complete.A second price seen on the 100K** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Futures is a separate product** — Conflit de sources officielles encore ouvert.
- `EDITORIAL_UNVERIFIABLE` **narrative.strengths[6]** — « $400,000, » n'est pas verifiable contre le modele.
- `EDITORIAL_UNVERIFIABLE` **narrative.strengths[6]** — « $2,000,000 » n'est pas verifiable contre le modele.
- `EDITORIAL_UNVERIFIABLE` **narrative.verdict.goodFit[4]** — « $2,000,000 » n'est pas verifiable contre le modele.
- `EDITORIAL_INCOMPLETE` **narrative.about** — Aucune presentation.

Erreurs :

- `IDENTITY_INCOMPLETE` **identity.intro** — intro est vide.
- `IDENTITY_INCOMPLETE` **identity.logoUrl** — logoUrl est vide.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.strengths[1]** — « 90% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.limits[2]** — « 3% » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.limits[3]** — « 4 trading days » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.body** — « 90% » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.body** — « 80% » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.goodFit[0]** — « 90% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.verdict.goodFit[2]** — « 5% » ne correspond a aucune valeur canonique.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.verdict.goodFit[2]** — « 3% » ne correspond a aucune valeur canonique.

## the5ers

| | |
|---|---|
| Programmes | 3 |
| **Selections commerciales** | **9** |
| Lignes de phase | 22 |
| Marches | cfd, futures |
| Type de firme | CFD & Futures prop firm |
| Devises | USD 69–279 |
| Faits de firme | 0 |
| Plateformes | 1 |
| Regles detaillees | 6 |
| Code promo | aucun |
| **Erreurs bloquantes** | **12** |
| Avertissements | 11 |

### Selections commerciales

| Marche | Programme | Variante | Taille | Phases | Devise | Prix | Promotion resolue | Confiance de portee |
|---|---|---|---|---|---|---|---|---|
| cfd | Summer Plan CFD 1-Step | — | 100,000 | evaluation → sim_funded | USD | 249 | aucune | — |
| cfd | Summer Plan CFD 2-Step | 8/5 | 100,000 | evaluation → evaluation_2 → sim_funded | USD | 179 | aucune | — |
| cfd | Summer Plan CFD 2-Step | 10/5 | 100,000 | evaluation → evaluation_2 → sim_funded | USD | 149 | aucune | — |
| cfd | Summer Plan CFD 2-Step | 8/5 | 200,000 | evaluation → evaluation_2 → sim_funded | USD | 279 | aucune | — |
| cfd | Summer Plan CFD 2-Step | 10/5 | 200,000 | evaluation → evaluation_2 → sim_funded | USD | 249 | aucune | — |
| futures | Summer Plan Futures | — | 25,000 | evaluation → sim_funded | USD | 69 | aucune | — |
| futures | Summer Plan Futures | — | 50,000 | evaluation → sim_funded | USD | 120 | aucune | — |
| futures | Summer Plan Futures | — | 100,000 | evaluation → sim_funded | USD | 189 | aucune | — |
| futures | Summer Plan Futures | — | 150,000 | evaluation → sim_funded | USD | 219 | aucune | — |

**Aucune offre resolue.** Aucun prix barre, aucun code, aucun pourcentage
ne sera affiche ; le CTA reste neutre et suivi.

Avertissements :

- `SOURCE_CONFLICT_OPEN` **rules.complete.Summer Plan expiry** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Classic programmes** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Consistency per position, 40%** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Funded scaling target shown as 100%** — Conflit de sources officielles encore ouvert.
- `SOURCE_CONFLICT_OPEN` **rules.complete.Code GDSWCVRTE7** — Conflit de sources officielles encore ouvert.
- `EDITORIAL_UNVERIFIABLE` **narrative.strengths[1]** — « $22, » n'est pas verifiable contre le modele.
- `EDITORIAL_UNVERIFIABLE` **narrative.strengths[3]** — « $4,000,000 » n'est pas verifiable contre le modele.
- `EDITORIAL_UNVERIFIABLE` **narrative.limits[7]** — « $10,000 » n'est pas verifiable contre le modele.
- … et 3 autres

Erreurs :

- `IDENTITY_INCOMPLETE` **identity.intro** — intro est vide.
- `IDENTITY_INCOMPLETE` **identity.logoUrl** — logoUrl est vide.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.strengths[2]** — « 100% » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.strengths[5]** — « consistency rule » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.limits[0]** — « 50% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.limits[5]** — « 30 days » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.body** — « 50% » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.body** — « 80% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.verdict.body** — « 100% » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.goodFit[1]** — « 80% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.verdict.goodFit[3]** — « 100% » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.goodFit[4]** — « consistency rule » est propre a un programme et le texte n'en nomme aucun.

## Etat des capacites generiques

Ces capacites sont IMPLEMENTEES. Ce tableau dit ou elles sont verifiees,
pas ce qui reste a construire.

| Capacite | Implementee | Testee | FuturesElite | FTMO | The5ers | Reste a faire |
|---|---|---|---|---|---|---|
| Devise au niveau du plan | oui | oui | USD | EUR | USD | — |
| Variante comme dimension | oui | oui | s/o | Standard, Swing | 8/5, 10/5 | — |
| Identite commerciale a 4 cles | oui | oui | 15 selections | 14 selections | ok | — |
| Marches multiples | oui | oui | Futures | CFD | CFD & Futures | — |
| Phases dynamiques | oui | oui | 1 etape + instant | 1 et 2 etapes | 1 et 2 etapes | — |
| Portee des promotions | oui | oui | SCANNED resolu | aucune resolue | aucune resolue | promotions FTMO a portee etroite |
| Offre absente geree | oui | oui | s/o | offer = null | offer = null | — |
| Confiance de portee | oui | oui | unconfirmed | s/o | s/o | confirmer l eligibilite de SCANNED |

### Ce qui bloque encore FTMO et The5ers

Leurs erreurs ne viennent plus d une capacite manquante : le modele se
construit, les phases et variantes sont correctes. Elles viennent du
CONTENU EDITORIAL — des chiffres ecrits a la main que le validateur
confronte desormais aux donnees. C est le travail suivant, et il est
volontairement hors de ce lot.

Firmes concernees : ftmo, the5ers. Toutes deux restent `legacy`.

---

Aucune fiche n'a ete modifiee. FTMO et The5ers restent servies par
l'ancien rendu : `page_model_status` vaut `legacy` pour elles.
