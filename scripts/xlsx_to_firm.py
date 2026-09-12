# -*- coding: utf-8 -*-
"""
Convertit le tableur rempli d'une firme en fiche JSON pour la page universelle.

    python scripts/xlsx_to_firm.py data/firms/<slug>.xlsx

Ecrit data/firms/<slug>.json et regenere data/firms/index.ts, qui liste toutes
les fiches presentes. Le tableur est la source ; le JSON n'en est qu'une copie
lisible par le site. On ne corrige jamais le JSON a la main.

Le script ne complete rien : une cellule vide devient null ou une liste vide,
et la page n'affiche pas l'emplacement correspondant.
"""
import datetime as dt
import glob
import json
import os
import re
import sys

from openpyxl import Workbook, load_workbook

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOSSIER = os.path.join(RACINE, "data", "firms")

avertissements = []


def txt(v):
    if v is None:
        return None
    if isinstance(v, str):
        v = v.strip()
        return v or None
    return v


def liste(v):
    v = txt(v)
    return [x.strip() for x in str(v).split(",") if x.strip()] if v is not None else []


def nombre(v):
    v = txt(v)
    if v is None:
        return None
    if isinstance(v, bool):
        return None
    if isinstance(v, (int, float)):
        return int(v) if float(v).is_integer() else float(v)
    brut = str(v).replace(" ", "").replace("$", "").replace("€", "").replace(",", ".")
    try:
        f = float(brut.rstrip("%"))
    except ValueError:
        return None
    if brut.endswith("%"):
        f = f / 100
    return int(f) if f.is_integer() else f


def fraction(v):
    """Un pourcentage : 0.9, « 90% » ou 90 donnent tous 0.9."""
    n = nombre(v)
    if n is None:
        return None
    return round(n / 100, 4) if n > 1 else n


def oui(v):
    return str(txt(v) or "").lower() in ("oui", "yes", "true", "1")


def mot_ou(v, mots, conversion):
    v = txt(v)
    if v is None:
        return None
    if isinstance(v, str):
        cle = v.lower().replace("é", "e").replace("è", "e")
        if cle in mots:
            return mots[cle]
    return conversion(v)


def formulaire(ws):
    return {str(ws.cell(r, 1).value).strip(): ws.cell(r, 2).value
            for r in range(2, ws.max_row + 1) if ws.cell(r, 1).value}


def lignes(ws, nb_colonnes):
    sortie = []
    for r in range(3, ws.max_row + 1):
        valeurs = [ws.cell(r, c).value for c in range(1, nb_colonnes + 1)]
        if txt(valeurs[0]) is not None:
            sortie.append(valeurs)
    return sortie


PHASES = {"evaluation": "evaluation", "evaluation_2": "evaluation_2", "funded": "funded", "sim_funded": "funded"}


def feuille(wb, nom):
    """L'onglet, ou un onglet vide s'il n'existe pas dans ce tableur."""
    return wb[nom] if nom in wb.sheetnames else Workbook().active


def convertir(chemin):
    wb = load_workbook(chemin, data_only=True)
    f = formulaire(wb["Firme"])

    slug, nom = txt(f.get("slug")), txt(f.get("nom"))
    if not slug or not nom:
        sys.exit("Onglet Firme : slug et nom sont obligatoires.")

    # --- Programmes, plans, phases ------------------------------------------
    programmes = []
    for s_, nom_p, marche, type_, statut, accroche, resume_p in lignes(wb["Programmes"], 7):
        if (txt(statut) or "active") not in ("active", "promotional"):
            continue
        programmes.append({"slug": txt(s_), "nom": txt(nom_p) or txt(s_), "accroche": txt(accroche), "resume": txt(resume_p),
                           "marche": txt(marche) or "",
                           "type": "instant" if txt(type_) == "instant" else "evaluation", "plans": []})
    par_slug = {p["slug"]: p for p in programmes}

    plans = {}
    for prog, taille, variante, devise, prix, promo in lignes(wb["Plans"], 6):
        cle = (txt(prog), nombre(taille), txt(variante))
        if cle[0] not in par_slug:
            avertissements.append(f"Plans : programme « {cle[0]} » absent de l'onglet Programmes, plan ignore.")
            continue
        plan = {"taille": cle[1], "variante": cle[2], "devise": txt(devise) or "USD",
                "prix": nombre(prix), "cartePromo": oui(promo), "phases": []}
        plans[cle] = plan
        par_slug[cle[0]]["plans"].append(plan)

    for (prog, taille, variante, phase, objectif, perte_max, type_perte, perte_jour,
         jours, regularite, contrats, partage) in lignes(wb["Phases"], 12):
        cle = (txt(prog), nombre(taille), txt(variante))
        if cle not in plans:
            avertissements.append(f"Phases : aucun plan {cle} dans l'onglet Plans, phase ignoree.")
            continue
        plans[cle]["phases"].append({
            "phase": PHASES.get(txt(phase) or "", "evaluation"),
            "objectifProfit": nombre(objectif),
            "perteMax": nombre(perte_max),
            "typePerteMax": txt(type_perte),
            "perteJour": mot_ou(perte_jour, {"aucune": "aucune", "none": "aucune"}, nombre),
            "joursMin": nombre(jours),
            "regularite": mot_ou(regularite, {"aucune": "aucune", "none": "aucune",
                                              "non confirmee": "non confirmee", "unconfirmed": "non confirmee"},
                                 fraction),
            "maxContrats": nombre(contrats),
            "partage": fraction(partage),
        })

    for cle, plan in plans.items():
        if not plan["phases"]:
            avertissements.append(f"Plans : le plan {cle} n'a aucune phase.")
    nb_promo = sum(1 for p in plans.values() if p["cartePromo"])
    if nb_promo > 1:
        avertissements.append(f"Plans : {nb_promo} plans en carte promo, un seul attendu (le premier est affiche).")

    # --- Offre ----------------------------------------------------------------
    o = formulaire(wb["Offre"])
    offre = None
    if txt(o.get("code")) and fraction(o.get("remise")) is not None:
        expire = o.get("expire_le")
        offre = {
            "code": txt(o.get("code")),
            "remise": fraction(o.get("remise")),
            "portee": txt(o.get("portee")) or "non_confirmee",
            "checkoutVerifie": oui(o.get("checkout_verifie")),
            "programmesEligibles": liste(o.get("programmes_eligibles")),
            "taillesEligibles": [n for n in (nombre(x) for x in liste(o.get("tailles_eligibles"))) if n is not None],
            "expireLe": expire.date().isoformat() if isinstance(expire, dt.datetime) else txt(expire),
        }

    c = formulaire(wb["Conditions"])

    verdict = {"texte": None, "pourQui": [], "pasPour": [], "pointsForts": [], "limites": []}
    listes_verdict = {"pour_qui": "pourQui", "pas_pour": "pasPour", "point_fort": "pointsForts", "limite": "limites"}
    for type_, ordre, texte in sorted(lignes(wb["Verdict"], 3), key=lambda l: (str(l[0]), nombre(l[1]) or 0)):
        if not txt(texte):
            continue
        if type_ == "verdict":
            verdict["texte"] = txt(texte)
        elif type_ in listes_verdict:
            verdict[listes_verdict[type_]].append(txt(texte))
        else:
            avertissements.append(f"Verdict : type « {type_} » inconnu, ligne ignoree.")

    # --- Parcours et couts ----------------------------------------------------
    # Onglets facultatifs : une firme dont ils sont vides n'affiche simplement
    # pas les sections correspondantes.
    etapes_connues = ("evaluation", "funded", "payout")
    parcours = []
    for ordre, etape, titre, texte in sorted(lignes(feuille(wb, "Parcours"), 4), key=lambda l: nombre(l[0]) or 0):
        if not (txt(titre) and txt(texte)):
            continue
        if txt(etape) not in etapes_connues:
            avertissements.append(f"Parcours : etape « {txt(etape)} » inconnue, ligne ignoree.")
            continue
        parcours.append({"etape": txt(etape), "titre": txt(titre), "texte": txt(texte)})

    couts = [{"libelle": txt(libelle), "montant": txt(montant), "note": txt(note)}
             for _, libelle, montant, note in sorted(lignes(feuille(wb, "Couts"), 4), key=lambda l: nombre(l[0]) or 0)
             if txt(libelle)]

    faq = [{"question": txt(q), "reponse": txt(r)}
           for _, q, r in sorted(lignes(wb["FAQ"], 3), key=lambda l: nombre(l[0]) or 0)
           if txt(q) and txt(r)]

    fiche = {
        "slug": slug,
        "nom": nom,
        "logoUrl": txt(f.get("logo_url")),
        "marches": liste(f.get("marches")),
        "resume": txt(f.get("resume")),
        "presentation": txt(f.get("presentation")),
        "anneeCreation": nombre(f.get("annee_creation")),
        "pays": txt(f.get("pays")),
        "ceoFondateur": txt(f.get("ceo_fondateur")),
        "actifs": liste(f.get("actifs")),
        "plateformes": liste(f.get("plateformes")),
        "moyensPaiement": liste(f.get("moyens_paiement")),
        "levier": txt(f.get("levier")),
        "stylesTrading": liste(f.get("styles_trading")),
        "programmes": programmes,
        "offre": offre,
        "conditions": {"trading": txt(c.get("trading")), "commission": txt(c.get("commission")),
                       "retraits": txt(c.get("retraits"))},
        "parcours": parcours,
        "couts": couts,
        "verdict": verdict,
        "faq": faq,
    }

    # Garde-fou : l'exemple FuturesElite laisse dans le tableur d'une autre firme.
    if slug != "futureselite" and ("SCANNED" in json.dumps(fiche) or "FuturesElite" in json.dumps(fiche)):
        avertissements.append("Des valeurs de l'exemple FuturesElite sont restees dans ce tableur.")

    return fiche


def regenerer_index():
    fiches = sorted(os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(DOSSIER, "*.json")))
    ident = lambda s: "fiche_" + re.sub(r"[^a-zA-Z0-9]", "_", s)
    contenu = [
        "// GENERE PAR scripts/xlsx_to_firm.py — ne pas modifier a la main.",
        "// Une entree par fiche data/firms/<slug>.json. Une firme presente ici est",
        "// rendue par la page universelle ; les autres gardent leur rendu actuel.",
        "",
        "import type { FirmSheet } from '@/lib/firm-sheet'",
        "",
    ]
    contenu += [f"import {ident(s)} from './{s}.json'" for s in fiches]
    contenu += ["", "export const FIRM_SHEETS: Record<string, FirmSheet> = {"]
    contenu += [f"  '{s}': {ident(s)} as unknown as FirmSheet," for s in fiches]
    contenu += ["}", ""]
    with open(os.path.join(DOSSIER, "index.ts"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(contenu))
    return fiches


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage : python scripts/xlsx_to_firm.py data/firms/<slug>.xlsx")
    fiche = convertir(sys.argv[1])
    os.makedirs(DOSSIER, exist_ok=True)
    sortie = os.path.join(DOSSIER, f"{fiche['slug']}.json")
    with open(sortie, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(fiche, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    fiches = regenerer_index()

    nb_plans = sum(len(p["plans"]) for p in fiche["programmes"])
    nb_phases = sum(len(pl["phases"]) for p in fiche["programmes"] for pl in p["plans"])
    print(f"{sortie}")
    print(f"  {len(fiche['programmes'])} programmes · {nb_plans} plans · {nb_phases} phases · "
          f"offre {'oui' if fiche['offre'] else 'non'} · {len(fiche['faq'])} FAQ")
    print(f"  index : {len(fiches)} fiche(s) — {', '.join(fiches)}")
    for a in avertissements:
        print(f"  ATTENTION : {a}")
