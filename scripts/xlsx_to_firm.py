# -*- coding: utf-8 -*-
"""
Convertit le tableur rempli d'une firme en fiche JSON pour la page universelle.

La commande a lancer est `npm run firms:build` (scripts/firms_build.py) : elle
convertit tous les tableurs avec ce module, puis ecrit les JSON, l'index et le
SQL de synchronisation. Ce fichier n'en est que la partie « lecture du tableur ».
Le tableur est la source ; le JSON n'en est qu'une copie lisible par le site.
On ne corrige jamais le JSON a la main.

Le script ne complete rien : une cellule vide devient null ou une liste vide,
et la page n'affiche pas l'emplacement correspondant. Une valeur inconnue porte
un statut (not_published, not_applicable, needs_confirmation, source_conflict).
"""
import datetime as dt
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

GENERE = ("Fichier genere par `npm run firms:build` depuis data/firms/{slug}.xlsx. "
          "Ne pas modifier : corriger le tableur, puis relancer la commande.")


def statut(v):
    """Le statut ecrit dans une cellule a la place d'une valeur, sinon None."""
    t = str(txt(v) or "").lower()
    return t if t in STATUTS else None


def feuille(wb, nom):
    """L'onglet, ou un onglet vide s'il n'existe pas dans ce tableur."""
    return wb[nom] if nom in wb.sheetnames else Workbook().active


MODELE = os.path.join(RACINE, "MODELE-propfirm.xlsx")


def exemples_du_modele():
    """Le slug et le nom de l'exemple rempli dans le modele vierge. Pas le code :
    le meme code partenaire peut servir chez plusieurs firmes."""
    if not os.path.exists(MODELE):
        return {}
    wb = load_workbook(MODELE, read_only=True)
    sortie = {}
    for onglet, champs in (("Firme", ("slug", "nom")),):
        for ligne in wb[onglet].iter_rows(min_row=2, max_col=3, values_only=True):
            if ligne[0] in champs and isinstance(ligne[2], str) and len(ligne[2].strip()) >= 4:
                sortie[ligne[0]] = ligne[2].strip()
    wb.close()
    return sortie


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

    # Colonnes 16-17 (apres « controle ») : le partage par palier, ajoute le
    # 21/09/2026 sans decaler les colonnes ni les formules existantes.
    for (prog, taille, variante, phase, objectif, perte_max, type_perte, perte_jour,
         jours, regularite, contrats, partage, plafond, minimum, _controle,
         partage_bas, seuil_partage) in lignes(wb["Phases"], 17):
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
            "partageBas": fraction(partage_bas),
            "seuilPartage": nombre(seuil_partage),
        })
        ph = plans[cle]["phases"][-1]
        if (ph["partageBas"] is None) != (ph["seuilPartage"] is None):
            avertissements.append(f"Phases : {cle} {ph['phase']} — partage_bas et seuil_partage vont ensemble.")
        elif ph["partageBas"] is not None and (ph["partage"] is None or ph["partageBas"] >= ph["partage"]):
            avertissements.append(f"Phases : {cle} {ph['phase']} — partage_bas doit etre inferieur a partage.")

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
            # Sans confirmation explicite du partenaire, l'offre ne s'affiche pas.
            "statut": statut(o.get("statut")) or "needs_confirmation",
        }
        if statut(o.get("statut")) is None:
            avertissements.append("Offre : statut vide, l'offre est traitee comme needs_confirmation et reste masquee.")

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
        "metaDescription": txt(f.get("meta_description")),
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

    # Garde-fou : les valeurs d'exemple du modele laissees dans le tableur d'une
    # autre firme (colonne « Exemple » de MODELE-propfirm.xlsx).
    exemples = exemples_du_modele()
    if exemples and slug != exemples.get("slug"):
        texte = json.dumps(fiche, ensure_ascii=False)
        restes = sorted(v for v in exemples.values() if v in texte)
        if restes:
            avertissements.append(f"Valeurs de l'exemple du modele restees dans ce tableur : {', '.join(restes)}.")

    return fiche


if __name__ == "__main__":
    sys.exit("Ce script ne s'appelle plus directement : lancer `npm run firms:build` "
             "(ou `npm run firms:check`), qui convertit tous les tableurs et genere JSON, index et SQL.")
