# Rapport mode ombre — aucune fiche modifiee

Genere le 2026-09-08 par `npm run shadow:report`.

## futureselite

| | |
|---|---|
| Programmes | 4 |
| Plans | 15 |
| Phases | 27 |
| Marche | Futures prop firm |
| Faits de firme | 2 |
| Plateformes | 8 |
| Regles detaillees | 33 |
| Code promo | SCANNED |
| **Erreurs bloquantes** | **0** |
| Avertissements | 6 |

## ftmo

| | |
|---|---|
| Programmes | 2 |
| Plans | 14 |
| Phases | 37 |
| Marche | CFD prop firm |
| Faits de firme | 1 |
| Plateformes | 4 |
| Regles detaillees | 9 |
| Code promo | — |
| **Erreurs bloquantes** | **10** |
| Avertissements | 6 |

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
| Plans | 9 |
| Phases | 22 |
| Marche | — |
| Faits de firme | 0 |
| Plateformes | 1 |
| Regles detaillees | 6 |
| Code promo | — |
| **Erreurs bloquantes** | **13** |
| Avertissements | 11 |

Erreurs :

- `IDENTITY_INCOMPLETE` **identity.intro** — intro est vide.
- `IDENTITY_INCOMPLETE` **identity.logoUrl** — logoUrl est vide.
- `MARKET_MISMATCH` **programs[].market** — Les programmes ne partagent pas le meme marche.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.strengths[2]** — « 100% » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.strengths[5]** — « consistency rule » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.limits[0]** — « 50% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.limits[5]** — « 30 days » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.body** — « 50% » est propre a un programme et le texte n'en nomme aucun.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.body** — « 80% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.verdict.body** — « 100% » ne correspond a aucune valeur canonique.
- `FACT_NOT_UNIVERSAL_IN_TEXT` **narrative.verdict.goodFit[1]** — « 80% » est propre a un programme et le texte n'en nomme aucun.
- `EDITORIAL_CONTRADICTS_DATA` **narrative.verdict.goodFit[3]** — « 100% » ne correspond a aucune valeur canonique.
- … et 1 autres

## Capacites generiques a couvrir

**Structures d evaluation multiples**

- futureselite : evaluation/1, instant/?
- ftmo : evaluation/1, evaluation/2
- the5ers : evaluation/1, evaluation/2

**Devise non USD**

- ftmo : EUR

**Variantes commerciales**

- ftmo : 14 plans portent une variante (standard, swing)
- the5ers : 4 plans portent une variante (8-5, 10-5)

**Plusieurs variantes pour une meme taille**

- ftmo : ftmo-cfd-2-step : 10000 x2, 25000 x2, 50000 x2, 100000 x2
- the5ers : t5-summer-cfd-2-step : 100000 x2, 200000 x2

**Marche non futures**

- ftmo : cfd

**Seconde phase d evaluation**

- ftmo : evaluation_2 presente
- the5ers : evaluation_2 presente

**Aucune promotion resolue**

- ftmo : offer = null
- the5ers : offer = null

**Marches multiples dans une firme**

- the5ers : cfd, futures

---

Aucune fiche n'a ete modifiee. FTMO et The5ers restent servies par
l'ancien rendu : `page_model_status` vaut `legacy` pour elles.
