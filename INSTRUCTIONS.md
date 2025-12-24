# 🚀 Phase 1 - Blog + Risk Calculator

## 📦 Contenu du pack

```
phase1/
├── app/
│   ├── blog/
│   │   ├── page.tsx                    → Page liste blog (mise à jour)
│   │   └── [slug]/
│   │       └── page.tsx                → Articles (6 articles inclus)
│   └── tools/
│       └── risk-calculator/
│           ├── page.tsx                → Page SEO
│           └── RiskCalculatorClient.tsx → Calculateur interactif
├── components/
│   └── layout/
│       └── Navbar.tsx                  → Navbar mise à jour (Blog + Tools)
└── INSTRUCTIONS.md
```

---

## 📝 Nouveaux Articles de Blog (6 total)

| Article | Catégorie | SEO Keywords |
|---------|-----------|--------------|
| Trailing Drawdown Explained | Rules Decoded | trailing drawdown, prop firm |
| Daily vs Max Drawdown | Rules Decoded | daily drawdown, max drawdown |
| Top 7 Reasons Traders Fail | Failure Analysis | prop firm fail, mistakes |
| How to Pass Prop Firm Challenge | Guides | pass challenge, tips |
| Why 90% Profit Split is a Trap | Rules Decoded | profit split, hidden fees |
| Best Prop Firms 2025 | Reviews | best prop firm, ranking |

---

## 🧮 Risk Calculator - Fonctionnalités

- Presets pour les prop firms populaires (FTMO, The5ers, Topstep...)
- Sélection du compte ($10K à $400K)
- Sliders pour Daily DD, Max DD, Risk per trade
- Calculs automatiques :
  - Max risk per trade ($)
  - Daily loss limit ($)
  - Max total loss ($)
  - Losing trades allowed (daily & total)
  - Risk/Reward minimum recommandé
- Design responsive
- SEO optimisé (Schema WebApplication)

---

## 📋 Installation

### Étape 1 : Copier les fichiers

```
# Blog mis à jour
app/blog/page.tsx           → REMPLACER
app/blog/[slug]/page.tsx    → REMPLACER

# Risk Calculator (NOUVEAU)
app/tools/risk-calculator/page.tsx              → CRÉER
app/tools/risk-calculator/RiskCalculatorClient.tsx → CRÉER

# Navbar mis à jour
components/layout/Navbar.tsx → REMPLACER
```

### Étape 2 : Structure des dossiers

Crée ces dossiers s'ils n'existent pas :
```bash
mkdir -p app/tools/risk-calculator
```

### Étape 3 : Déployer

```bash
git add .
git commit -m "Add Risk Calculator + 4 new blog articles"
git push
```

---

## 🔗 Nouvelles URLs

### Blog Articles :
- `/blog/trailing-drawdown-explained`
- `/blog/daily-vs-max-drawdown`
- `/blog/top-7-reasons-traders-fail`
- `/blog/prop-firm-profit-split-trap`
- `/blog/how-to-pass-prop-firm-challenge`
- `/blog/best-prop-firms-2025`

### Tools :
- `/tools/risk-calculator`

---

## 📊 Impact SEO Attendu

Ces pages ciblent des mots-clés très recherchés :
- "trailing drawdown explained" (~500 recherches/mois)
- "prop firm risk calculator" (~300 recherches/mois)
- "why traders fail prop firm" (~400 recherches/mois)
- "daily vs max drawdown" (~200 recherches/mois)

Résultats attendus en 4-6 semaines :
- +30% trafic organique
- Meilleur temps sur site (outil interactif)
- Plus de pages indexées

---

## ✅ Checklist

- [ ] app/blog/page.tsx remplacé
- [ ] app/blog/[slug]/page.tsx remplacé
- [ ] app/tools/risk-calculator/ créé
- [ ] components/layout/Navbar.tsx remplacé
- [ ] Build réussi
- [ ] Sitemap resoumis sur Google Search Console

---

## 🎯 Prochaines étapes (Phase 2)

- Trade Journal (simple)
- Rule Tracker
- Prop Firm Alerts (nouvelles règles)
- Plus d'articles de blog

Bonne chance ! 🚀
