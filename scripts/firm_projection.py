# -*- coding: utf-8 -*-
"""
Projection d'une fiche (data/firms/<slug>.json) vers les colonnes de
`prop_firms` que lisent les pages de liste : /compare, /deals, le bandeau des
offres, /best-for, le quiz, les favoris et les cartes « Similar firms ».

Ces colonnes sont des COPIES. La fiche (donc le tableur) est la seule source ;
le SQL genere ici ne fait que les recopier. On ne le modifie jamais a la main :
`python scripts/firms_build.py --check` echoue s'il ne correspond plus a la
fiche.

Regles de projection (21 septembre 2026) :
  - une colonne n'est projetee que si la fiche la connait sans deduction ;
    ce que la fiche ne sait pas (challenge_types, date de creation…) n'est pas
    touche ;
  - une valeur absente de la fiche s'ecrit NULL, jamais 0 : plusieurs pages
    affichent un 0 tel quel ;
  - l'offre n'est recopiee que si son statut est `confirmed`. Sinon le code et
    la remise sont effaces, pour qu'aucune page de liste ne promette ce que la
    fiche n'affiche pas ;
  - les pourcentages sont en entiers dans prop_firms (90), en fractions dans la
    fiche (0.9).
"""
import hashlib
import json

# Colonne -> type SQL de la valeur ecrite, dans l'ordre du fichier genere.
COLONNES = (
    ("name", "texte"),
    ("logo_url", "texte"),
    ("country", "texte"),
    ("trustpilot_rating", "nombre"),
    ("trustpilot_reviews", "nombre"),
    ("is_futures", "booleen"),
    ("has_instant_funding", "booleen"),
    ("platforms", "texte"),
    ("price_currency", "texte"),
    ("min_price", "nombre"),
    ("max_price", "nombre"),
    ("profit_split", "nombre"),
    ("max_profit_split", "nombre"),
    ("discount_code", "texte"),
    ("discount_percent", "nombre"),
    ("discount_expires_at", "texte"),
)


def _entier_si_possible(n):
    return int(n) if isinstance(n, float) and n.is_integer() else n


def plateformes_selectionnables(fiche):
    """Les plateformes qu'on choisit a l'achat ; les autres ne sont que citees."""
    detail = fiche.get("plateformesDetail") or []
    if detail:
        return [p["nom"] for p in detail if p.get("selectionnable")]
    return list(fiche.get("plateformes") or [])


def projeter(fiche):
    """Retourne (valeurs, erreurs, avertissements). `valeurs` suit COLONNES."""
    erreurs, avertissements = [], []
    slug = fiche.get("slug")

    for champ in ("slug", "nom", "logoUrl"):
        if not fiche.get(champ):
            erreurs.append(f"Firme : « {champ} » est vide ; les pages de liste en ont besoin.")

    plans = [pl for p in fiche.get("programmes", []) for pl in p.get("plans", [])]
    prix = [pl["prix"] for pl in plans if pl.get("prix") is not None]
    if not prix:
        erreurs.append("Plans : aucun prix renseigne ; min_price et max_price seraient vides.")
    devises = sorted({pl.get("devise") for pl in plans if pl.get("prix") is not None})
    if len(devises) > 1:
        erreurs.append(f"Plans : plusieurs devises ({', '.join(devises)}) ; min_price melangerait des monnaies.")

    partages = [ph["partage"] for pl in plans for ph in pl.get("phases", []) if ph.get("partage") is not None]
    # Un partage par palier commence a son taux bas : profit_split dit ou la
    # firme commence (CLAUDE.md), max_profit_split jusqu'ou elle va.
    partages_bas = [ph["partageBas"] if ph.get("partageBas") is not None else ph["partage"]
                    for pl in plans for ph in pl.get("phases", []) if ph.get("partage") is not None]

    marches = set(fiche.get("marches") or [])
    is_futures = None
    if marches == {"futures"}:
        is_futures = True
    elif marches and "futures" not in marches:
        is_futures = False
    elif marches:
        avertissements.append("Firme : marches mixtes, is_futures n'est pas projete.")

    offre = fiche.get("offre")
    offre_active = bool(offre and offre.get("statut") == "confirmed")
    pourcentage = None
    if offre_active:
        pourcentage = round(offre["remise"] * 100, 2)
        if not float(pourcentage).is_integer():
            avertissements.append(f"Offre : remise de {pourcentage} %, arrondie a l'entier pour discount_percent.")
        pourcentage = int(round(pourcentage))

    valeurs = {
        "name": fiche.get("nom"),
        "logo_url": fiche.get("logoUrl"),
        "country": fiche.get("pays"),
        "trustpilot_rating": _entier_si_possible(fiche.get("trustpilotScore")),
        "trustpilot_reviews": fiche.get("trustpilotReviewCount"),
        "is_futures": is_futures,
        "has_instant_funding": any(p.get("type") == "instant" for p in fiche.get("programmes", [])),
        "platforms": ", ".join(plateformes_selectionnables(fiche)) or None,
        "price_currency": devises[0] if len(devises) == 1 else None,
        "min_price": _entier_si_possible(min(prix)) if prix else None,
        "max_price": _entier_si_possible(max(prix)) if prix else None,
        "profit_split": int(round(min(partages_bas) * 100)) if partages_bas else None,
        "max_profit_split": int(round(max(partages) * 100)) if partages else None,
        "discount_code": offre["code"] if offre_active else None,
        "discount_percent": pourcentage,
        "discount_expires_at": offre.get("expireLe") if offre_active else None,
    }
    # is_futures n'est projete que s'il est determine.
    if is_futures is None:
        valeurs.pop("is_futures")
    return valeurs, erreurs, avertissements


# --- SQL -------------------------------------------------------------------------

def _litteral(valeur):
    if valeur is None:
        return "null"
    if isinstance(valeur, bool):
        return "true" if valeur else "false"
    if isinstance(valeur, (int, float)):
        return repr(valeur)
    return "'" + str(valeur).replace("'", "''") + "'"


def _controle(colonne, genre, valeur):
    """Condition vraie quand la colonne ne porte PAS la valeur attendue."""
    if valeur is None:
        return f"r.{colonne} is not null"
    if genre == "nombre":
        # Tolerance : une colonne real ne rend pas 4.7 exactement.
        return f"(r.{colonne} is null or abs(r.{colonne}::numeric - {_litteral(valeur)}) > 0.001)"
    if genre == "texte" and colonne == "discount_expires_at":
        return f"r.{colonne}::date is distinct from {_litteral(valeur)}::date"
    return f"r.{colonne} is distinct from {_litteral(valeur)}"


def empreinte(texte_json):
    return "sha256:" + hashlib.sha256(texte_json.encode("utf-8")).hexdigest()


def generer_sql(fiche, valeurs, texte_json, chemin_tableur, publiee=True):
    slug = fiche["slug"]
    s = _litteral(slug)
    colonnes = [(c, g) for c, g in COLONNES if c in valeurs]
    noms = ", ".join(c for c, _ in colonnes)

    affectations = ",\n".join(f"  {c} = {_litteral(valeurs[c])}" for c, _ in colonnes)
    controles = "\n     or ".join(_controle(c, g, valeurs[c]) for c, g in colonnes)
    plateformes = valeurs.get("platforms")
    tableau = f"string_to_array({_litteral(plateformes)}, ', ')" if plateformes else "null"

    lignes = [
        f"-- GENERE PAR scripts/firms_build.py a partir de {chemin_tableur}.",
        "-- NE PAS MODIFIER A LA MAIN : corriger le tableur, puis relancer",
        "--   npm run firms:build",
        "-- `npm run firms:check` echoue si ce fichier ne correspond plus a la fiche.",
        f"-- Fiche : data/firms/{slug}.json ({empreinte(texte_json)})",
        "--",
        "-- Recopie dans prop_firms les colonnes lues par /compare, /deals, le bandeau",
        "-- des offres, /best-for, le quiz, les favoris et les cartes Similar firms.",
        "-- Aucune autre table n'est touchee. Une valeur absente de la fiche s'ecrit null.",
        "-- L'offre n'est recopiee que si la fiche la dit confirmee.",
        "--",
        "-- A executer dans l'editeur SQL de Supabase. Tout ou rien : si le controle",
        "-- final echoue, la transaction est annulee et rien n'est modifie.",
        "",
        "-- 1. Etat avant (lecture seule). L'editeur Supabase n'affiche que le resultat",
        "--    de la DERNIERE requete : executer d'abord ce select SEUL (le selectionner,",
        "--    puis Run) et exporter le resultat, qui sert au retour arriere. Ensuite",
        "--    seulement, executer le fichier entier.",
        f"select slug, {noms}",
        f"from prop_firms where slug = {s};",
        "",
        "begin;",
        "",
        *([] if publiee else [
            "-- VERROU : cette firme n'est pas encore publiee (ni dans data/firms/rollout.ts,",
            "-- ni dans data/firms/legacy). Ses copies prop_firms ne doivent pas changer avant",
            "-- la publication de sa page : ce bloc annule tout. Il disparait tout seul du",
            "-- fichier genere des que la firme est activee dans rollout.ts.",
            "do $garde$",
            "begin",
            f"  raise exception '{slug} n''est pas encore publiee : ce SQL ne doit pas etre execute.';",
            "end",
            "$garde$;",
            "",
        ]),
        "do $ctrl$",
        "begin",
        f"  if not exists (select 1 from prop_firms where slug = {s}) then",
        f"    raise exception 'prop_firms : aucune firme {slug}';",
        "  end if;",
        "end",
        "$ctrl$;",
        "",
        "-- 2. Projection de la fiche.",
        "update prop_firms set",
        affectations + ",",
        "  updated_at = now()",
        f"where slug = {s};",
        "",
        "-- platforms_list est prioritaire sur platforms dans /compare : il recoit la",
        "-- meme liste, au format de sa colonne (liste a virgules ou tableau).",
        "do $plat$",
        "declare t text;",
        "begin",
        "  select data_type into t from information_schema.columns",
        "   where table_schema = 'public' and table_name = 'prop_firms' and column_name = 'platforms_list';",
        "  if t is null then",
        "    return;",
        "  elsif t = 'ARRAY' then",
        f"    update prop_firms set platforms_list = {tableau} where slug = {s};",
        "  else",
        f"    update prop_firms set platforms_list = {_litteral(plateformes)} where slug = {s};",
        "  end if;",
        "end",
        "$plat$;",
        "",
        "-- 3. Controle : chaque colonne porte la valeur de la fiche, sinon tout est annule.",
        "do $verif$",
        "declare r prop_firms%rowtype;",
        "begin",
        f"  select * into r from prop_firms where slug = {s};",
        f"  if {controles} then",
        f"    raise exception 'Controle echoue : prop_firms {slug} ne correspond pas a la fiche';",
        "  end if;",
        "end",
        "$verif$;",
        "",
        "commit;",
        "",
        "-- 4. Etat apres (lecture seule).",
        f"select slug, {noms}",
        f"from prop_firms where slug = {s};",
        "",
    ]
    return "\n".join(lignes)
