# -*- coding: utf-8 -*-
"""
Source unique des fiches firmes : une commande regenere tout.

    npm run firms:build      (python scripts/firms_build.py)
    npm run firms:check      (python scripts/firms_build.py --check)

Chaine, pour chaque data/firms/<slug>.xlsx :

    tableur  ->  validation  ->  data/firms/<slug>.json
                             ->  database/generated/sync-prop-firms-<slug>.sql
    puis data/firms/index.ts (toutes les fiches)

Le tableur est la seule source editable. JSON, index et SQL sont des sorties :
on ne les modifie jamais a la main. `--check` regenere tout en memoire et
echoue si un fichier present differe, s'il manque, ou s'il n'a plus de tableur.

Tout ou rien : si une fiche a une erreur de validation, aucun fichier n'est
ecrit. Le SQL genere n'est jamais execute par ce script.
"""
import glob
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import xlsx_to_firm as conversion  # noqa: E402
from firm_projection import generer_sql, projeter  # noqa: E402

RACINE = conversion.RACINE
FICHES = conversion.DOSSIER
SQL = os.path.join(RACINE, "database", "generated")


def rel(chemin):
    return os.path.relpath(chemin, RACINE).replace(os.sep, "/")


def chemin_sql(slug):
    return os.path.join(SQL, f"sync-prop-firms-{slug}.sql")


def contenu_index(slugs):
    ident = lambda s: "fiche_" + re.sub(r"[^a-zA-Z0-9]", "_", s)
    lignes = [
        "// GENERE PAR scripts/firms_build.py — ne pas modifier a la main.",
        "// Une entree par fiche data/firms/<slug>.json. Une firme presente ici est",
        "// rendue par la page universelle ; les autres gardent leur rendu actuel.",
        "",
        "import type { FirmSheet } from '@/lib/firm-sheet'",
        "",
    ]
    lignes += [f"import {ident(s)} from './{s}.json'" for s in slugs]
    lignes += ["", "export const FIRM_SHEETS: Record<string, FirmSheet> = {"]
    lignes += [f"  '{s}': {ident(s)} as unknown as FirmSheet," for s in slugs]
    lignes += ["}", ""]
    return "\n".join(lignes)


def tableurs():
    return sorted(t for t in glob.glob(os.path.join(FICHES, "*.xlsx"))
                  if not os.path.basename(t).startswith("~$"))


def generer():
    """Retourne (sorties {chemin: texte}, erreurs, avertissements par fiche)."""
    sorties, erreurs, avertissements = {}, [], {}
    slugs = []
    for tableur in tableurs():
        conversion.avertissements.clear()
        fiche = conversion.convertir(tableur)
        slug = fiche.get("slug") or os.path.splitext(os.path.basename(tableur))[0]
        attendu = os.path.splitext(os.path.basename(tableur))[0]
        if slug != attendu:
            erreurs.append(f"{rel(tableur)} : le slug de la fiche ({slug}) differe du nom du fichier ({attendu}).")
        texte_json = json.dumps(fiche, ensure_ascii=False, indent=2) + "\n"
        valeurs, erreurs_fiche, avertissements_fiche = projeter(fiche)
        erreurs += [f"{rel(tableur)} : {e}" for e in erreurs_fiche]
        avertissements[slug] = list(conversion.avertissements) + avertissements_fiche
        if erreurs_fiche:
            continue
        sorties[os.path.join(FICHES, f"{slug}.json")] = texte_json
        sorties[chemin_sql(slug)] = generer_sql(fiche, valeurs, texte_json, rel(tableur))
        slugs.append(slug)
    sorties[os.path.join(FICHES, "index.ts")] = contenu_index(sorted(slugs))
    return sorties, erreurs, avertissements


def orphelins(sorties):
    """Fichiers generes presents sur le disque sans tableur correspondant."""
    presents = glob.glob(os.path.join(FICHES, "*.json")) + glob.glob(os.path.join(SQL, "sync-prop-firms-*.sql"))
    return sorted(rel(p) for p in presents if os.path.normcase(os.path.abspath(p)) not in
                  {os.path.normcase(os.path.abspath(c)) for c in sorties})


def lire(chemin):
    if not os.path.exists(chemin):
        return None
    with open(chemin, encoding="utf-8") as fh:  # fin de ligne normalisee
        return fh.read()


def afficher_avertissements(avertissements):
    for slug, liste in avertissements.items():
        for a in liste:
            print(f"  ATTENTION {slug} : {a}")


def construire():
    sorties, erreurs, avertissements = generer()
    afficher_avertissements(avertissements)
    if erreurs:
        for e in erreurs:
            print(f"ERREUR : {e}")
        print("Aucun fichier ecrit : corriger le tableur, puis relancer.")
        return 1
    os.makedirs(SQL, exist_ok=True)
    for chemin, texte in sorted(sorties.items()):
        with open(chemin, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(texte)
        print(f"ecrit {rel(chemin)}")
    for o in orphelins(sorties):
        print(f"ORPHELIN : {o} n'a plus de tableur (a supprimer si la firme est retiree).")
    print(f"{len(tableurs())} tableur(s), {len(sorties)} fichier(s) genere(s).")
    return 0


def verifier():
    sorties, erreurs, avertissements = generer()
    afficher_avertissements(avertissements)
    ecarts = []
    for chemin, texte in sorted(sorties.items()):
        actuel = lire(chemin)
        if actuel is None:
            ecarts.append(f"MANQUANT : {rel(chemin)}")
        elif actuel != texte:
            ecarts.append(f"ECART : {rel(chemin)} ne correspond pas a son tableur (modifie a la main ?).")
    for e in erreurs:
        print(f"ERREUR : {e}")
    for e in ecarts:
        print(e)
    orph = orphelins(sorties)
    for o in orph:
        print(f"ORPHELIN : {o} n'a pas de tableur.")
    print(f"{len(tableurs())} tableur(s) verifie(s), {len(erreurs)} erreur(s), "
          f"{len(ecarts)} ecart(s), {len(orph)} orphelin(s).")
    if ecarts:
        print("Relancer `npm run firms:build` ; ne jamais corriger un fichier genere a la main.")
    return 1 if erreurs or ecarts or orph else 0


if __name__ == "__main__":
    arguments = sys.argv[1:]
    if arguments == ["--check"]:
        sys.exit(verifier())
    if arguments:
        sys.exit("Usage : python scripts/firms_build.py [--check]")
    sys.exit(construire())
