# -*- coding: utf-8 -*-
"""
Convertit le tableur rempli d'une firme en fiche JSON pour la page universelle.

    python scripts/xlsx_to_firm.py data/firms/<slug>.xlsx

Ecrit data/firms/<slug>.json et regenere data/firms/index.ts, qui liste toutes
les fiches presentes. Le tableur est la source ; le JSON n'en est qu'une copie
lisible par le site. On ne corrige jamais le JSON a la main.

Le script ne complete rien : une cellule vide devient null ou une liste vide,
et la page n'affiche pas l'emplacement correspondant. Une valeur inconnue porte
un statut (not_published, not_applicable, needs_confirmation, source_conflict).

    python scripts/xlsx_to_firm.py --check

verifie que chaque JSON est exactement la conversion de son tableur.
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

# Une valeur inconnue s'ecrit avec un statut, jamais en laissant croire a une
# valeur. Une cellule vide, elle, masque la ligne.
STATUTS = ("confirmed", "not_published", "not_applicable", "needs_confirmation", "source_conflict")

# Ce que /api/go/[slug] accepte comme opt_key / opt_value.
PARAMETRE_SUR = re.compile(r"^[A-Za-z0-9_-]{1,40}$")

GENERE = ("Fichier genere par scripts/xlsx_to_firm.py depuis data/firms/{slug}.xlsx. "
          "Ne pas modifier : corriger le tableur, puis relancer le script.")


def statut(v):
    """Le statut ecrit dans une cellule a la place d'une valeur, sinon None."""
    t = str(txt(v) or "").lower()
    return t if t in STATUTS else None


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
    for (s_, nom_p, marche, type_, etat, accroche, resume_p,
         max_comptes, max_statut, max_note) in lignes(wb["Programmes"], 10):
        if (txt(etat) or "active") not in ("active", "promotional"):
            continue
        max_n = None if statut(max_comptes) else nombre(max_comptes)
        programmes.append({"slug": txt(s_), "nom": txt(nom_p) or txt(s_), "accroche": txt(accroche), "resume": txt(resume_p),
                           "marche": txt(marche) or "",
                           "type": "instant" if txt(type_) == "instant" else "evaluation",
                           "maxComptes": max_n,
                           "maxComptesStatut": statut(max_statut) or statut(max_comptes)
                           or ("confirmed" if max_n is not None else None),
                           "maxComptesNote": txt(max_note),
                           "plans": []})
    par_slug = {p["slug"]: p for p in programmes}

    plans = {}
    for (prog, taille, variante, devise, prix, promo, facturation, intervalle,
         frais_reset, frais_activation) in lignes(wb["Plans"], 10):
        cle = (txt(prog), nombre(taille), txt(variante))
        if cle[0] not in par_slug:
            avertissements.append(f"Plans : programme « {cle[0]} » absent de l'onglet Programmes, plan ignore.")
            continue
        modele = txt(facturation) or "one_time"
        if modele not in ("one_time", "subscription"):
            avertissements.append(f"Plans : facturation « {modele} » inconnue sur {cle}, one_time retenu.")
            modele = "one_time"
        if modele == "subscription" and not txt(intervalle):
            avertissements.append(f"Plans : abonnement sans intervalle sur {cle}.")
        plan = {"taille": cle[1], "variante": cle[2], "devise": txt(devise) or "USD",
                "prix": nombre(prix), "cartePromo": oui(promo),
                "facturation": modele, "intervalle": txt(intervalle) if modele == "subscription" else None,
                "fraisReset": nombre(frais_reset), "fraisActivation": nombre(frais_activation),
                "phases": []}
        plans[cle] = plan
        par_slug[cle[0]]["plans"].append(plan)

    for (prog, taille, variante, phase, objectif, perte_max, type_perte, perte_jour,
         jours, regularite, contrats, partage, plafond, minimum) in lignes(wb["Phases"], 14):
        cle = (txt(prog), nombre(taille), txt(variante))
        if cle not in plans:
            avertissements.append(f"Phases : aucun plan {cle} dans l'onglet Plans, phase ignoree.")
            continue
        # Une cellule peut porter un statut a la place de sa valeur : la valeur
        # est alors null, et le statut dit pourquoi.
        cellules = {"objectifProfit": objectif, "perteMax": perte_max, "typePerteMax": type_perte,
                    "perteJour": perte_jour, "joursMin": jours, "regularite": regularite,
                    "maxContrats": contrats, "partage": partage,
                    "plafondRetrait": plafond, "retraitMinimum": minimum}
        statuts = {k: statut(v) for k, v in cellules.items() if statut(v)}
        if str(txt(regularite) or "").lower().replace("é", "e") in ("non confirmee", "unconfirmed"):
            statuts.setdefault("regularite", "needs_confirmation")
        plans[cle]["phases"].append({
            "phase": PHASES.get(txt(phase) or "", "evaluation"),
            "objectifProfit": nombre(objectif),
            "perteMax": nombre(perte_max),
            "typePerteMax": None if statut(type_perte) else txt(type_perte),
            "plafondRetrait": nombre(plafond),
            "retraitMinimum": nombre(minimum),
            "statuts": statuts,
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

    couts = [{"libelle": txt(libelle), "montant": txt(montant), "note": txt(note), "programmes": liste(progs_c)}
             for _, libelle, montant, note, progs_c in sorted(lignes(feuille(wb, "Couts"), 5), key=lambda l: nombre(l[0]) or 0)
             if txt(libelle)]

    # --- Regles : cartes Trading et Payouts, filtrees par la selection ------------
    regles = []
    for (carte, regle, texte_r, statut_r, progs_r, tailles_r, phase_r, bloquante, essentielle,
         source) in lignes(feuille(wb, "Regles"), 10):
        if txt(carte) not in ("trading", "payouts", "live"):
            avertissements.append(f"Regles : carte « {txt(carte)} » inconnue pour « {txt(regle)} », ligne ignoree.")
            continue
        if not (txt(regle) and txt(texte_r)):
            continue
        if txt(phase_r) and txt(phase_r) not in PHASES:
            avertissements.append(f"Regles : phase « {txt(phase_r)} » inconnue pour « {txt(regle)} », ligne ignoree.")
            continue
        regles.append({
            "carte": txt(carte), "regle": txt(regle), "texte": txt(texte_r),
            "statut": statut(statut_r) or "confirmed",
            "programmes": liste(progs_r),
            "tailles": [n for n in (nombre(x) for x in liste(tailles_r)) if n is not None],
            "phase": PHASES.get(txt(phase_r)) if txt(phase_r) else None,
            "bloquante": oui(bloquante), "essentielle": oui(essentielle), "source": txt(source),
        })

    faq = [{"question": txt(q), "reponse": txt(r)}
           for _, q, r in sorted(lignes(wb["FAQ"], 3), key=lambda l: nombre(l[0]) or 0)
           if txt(q) and txt(r)]

    # --- Nouvelle page : en-tete, known for, plateformes, options, modules ---------
    connu_pour = [{"titre": txt(t), "detail": txt(d)}
                  for _, t, d in sorted(lignes(feuille(wb, "ConnuPour"), 3), key=lambda l: nombre(l[0]) or 0)
                  if txt(t)]
    if len(connu_pour) > 4:
        avertissements.append(f"ConnuPour : {len(connu_pour)} faits, seuls les 4 premiers sont gardes.")
        connu_pour = connu_pour[:4]

    preuves = [{"libelle": txt(l), "valeur": str(txt(v)), "source": txt(src)}
               for _, l, v, src in sorted(lignes(feuille(wb, "Preuves"), 4), key=lambda l: nombre(l[0]) or 0)
               if txt(l) and txt(v) is not None]

    plateformes_detail = []
    vus = set()
    for nom_pf, selectionnable, note_pf in lignes(feuille(wb, "Plateformes"), 3):
        cle_pf = str(txt(nom_pf)).lower()
        if cle_pf in vus:
            avertissements.append(f"Plateformes : « {txt(nom_pf)} » en double, seconde ligne ignoree.")
            continue
        vus.add(cle_pf)
        plateformes_detail.append({"nom": txt(nom_pf), "selectionnable": oui(selectionnable), "note": txt(note_pf)})

    options_achat = []
    for type_o, nom_o, detail_o, param_o, valeur_o, progs_o in lignes(feuille(wb, "OptionsAchat"), 6):
        if txt(type_o) not in ("plateforme", "data_feed"):
            avertissements.append(f"OptionsAchat : type « {txt(type_o)} » inconnu, ligne ignoree.")
            continue
        if not (txt(nom_o) and PARAMETRE_SUR.match(str(txt(param_o) or ""))
                and PARAMETRE_SUR.match(str(txt(valeur_o) or ""))):
            avertissements.append(f"OptionsAchat : « {txt(nom_o)} » sans nom, parametre ou valeur valide, ignoree.")
            continue
        options_achat.append({"type": txt(type_o), "nom": txt(nom_o), "detail": txt(detail_o),
                              "parametre": str(txt(param_o)), "valeur": str(txt(valeur_o)),
                              "programmes": liste(progs_o)})

    formation = None
    lignes_formation = sorted(lignes(feuille(wb, "Formation"), 3), key=lambda l: nombre(l[1]) or 0)
    if lignes_formation:
        formation = {"titre": None, "intro": None, "elements": []}
        for type_f, _, texte_f in lignes_formation:
            if not txt(texte_f):
                continue
            if txt(type_f) == "element":
                formation["elements"].append(txt(texte_f))
            elif txt(type_f) in ("titre", "intro"):
                formation[txt(type_f)] = txt(texte_f)

    comptes = {}
    for compte, description_c, ordre_c, libelle_c, valeur_c in sorted(
            lignes(feuille(wb, "ComptesApresReussite"), 5), key=lambda l: nombre(l[2]) or 0):
        c_ = comptes.setdefault(txt(compte), {"nom": txt(compte), "description": None, "lignes": []})
        c_["description"] = c_["description"] or txt(description_c)
        if txt(libelle_c) and txt(valeur_c) is not None:
            c_["lignes"].append({"libelle": txt(libelle_c), "valeur": str(txt(valeur_c))})

    categories = liste(f.get("categories_actifs"))

    fiche = {
        "_genere": GENERE.format(slug=slug),
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
        # Nouvelle page (FirmProfilePage). L'ancienne n'en lit rien.
        "trustpilotScore": nombre(f.get("trustpilot_score")),
        "trustpilotReviewCount": nombre(f.get("trustpilot_review_count")),
        "trustpilotUrl": txt(f.get("trustpilot_url")),
        "regles": regles,
        "titre": txt(f.get("titre")),
        "description": txt(f.get("description")),
        "connuPour": connu_pour,
        "preuves": preuves,
        "plateformesDetail": plateformes_detail,
        "categoriesActifs": categories,
        "categoriesActifsStatut": statut(f.get("categories_actifs_statut")) or ("confirmed" if categories else None),
        "methodesRetrait": liste(f.get("methodes_retrait")),
        "prestataireRetrait": txt(f.get("prestataire_retrait")),
        "levierStatut": statut(f.get("levier_statut")) or ("confirmed" if txt(f.get("levier")) else None),
        "optionsAchat": options_achat,
        "formation": formation,
        "comptesApresReussite": list(comptes.values()),
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


def verifier():
    """Le JSON n'est qu'une sortie : il doit etre exactement la conversion du tableur."""
    ecarts = []
    tableurs = sorted(t for t in glob.glob(os.path.join(DOSSIER, "*.xlsx"))
                      if not os.path.basename(t).startswith("~$"))
    for tableur in tableurs:
        fiche = convertir(tableur)
        chemin = os.path.join(DOSSIER, f"{fiche['slug']}.json")
        actuel = None
        if os.path.exists(chemin):
            with open(chemin, encoding="utf-8") as fh:
                actuel = json.load(fh)
        if actuel != fiche:
            ecarts.append(os.path.relpath(chemin, RACINE))
    orphelins = sorted(
        os.path.relpath(j, RACINE) for j in glob.glob(os.path.join(DOSSIER, "*.json"))
        if not os.path.exists(os.path.splitext(j)[0] + ".xlsx"))
    for e in ecarts:
        print(f"ECART : {e} ne correspond pas a son tableur. Relancer la conversion, ne pas l'editer.")
    for o in orphelins:
        print(f"ORPHELIN : {o} n'a pas de tableur.")
    print(f"{len(tableurs)} tableur(s) verifie(s), {len(ecarts)} ecart(s), {len(orphelins)} orphelin(s).")
    sys.exit(1 if ecarts or orphelins else 0)


if __name__ == "__main__":
    if sys.argv[1:] == ["--check"]:
        verifier()
    if len(sys.argv) != 2:
        sys.exit("Usage : python scripts/xlsx_to_firm.py data/firms/<slug>.xlsx  |  --check")
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
