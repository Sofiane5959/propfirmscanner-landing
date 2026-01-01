# 🎯 PropFirmScanner Dashboard

## "One dashboard to manage all your prop firm accounts."

---

## ⚡ PLAN D'EXÉCUTION ACCÉLÉRÉ (3-7 jours)

### 🟢 Jour 1 — Base & Logique ✅ FAIT

| Tâche | Status |
|-------|--------|
| Tables: programs, user_accounts, subscriptions, usage_limits | ✅ |
| Calcul daily/max buffer (USD + Today PnL) | ✅ |
| Dashboard avec cards affichant les limites | ✅ |
| Add Account form avec presets | ✅ |

**Fichiers créés:**
- `app/dashboard/page.tsx` — Dashboard principal
- `app/dashboard/accounts/new/page.tsx` — Formulaire ajout compte
- `database/schema.sql` — Schema Supabase

### 🟢 Jour 2 — Simulation ✅ FAIT

| Tâche | Status |
|-------|--------|
| Page simulation | ✅ |
| Input risk_usd | ✅ |
| Logique ✅⚠️❌ | ✅ |
| Messages humains clairs | ✅ |

**Fichiers créés:**
- `app/dashboard/simulate/page.tsx` — Trade Simulator

### 🟢 Jour 3 — Paywall ⏳ À FAIRE

```typescript
// Implémenter dans lib/check-limits.ts

export async function checkUserLimits(userId: string) {
  const { data } = await supabase.rpc('check_user_limits', { uid: userId })
  return data
}

// Free: 1 account, 5 simulations/day
// Pro: Unlimited
```

**À connecter:**
- Stripe Checkout pour upgrade Pro
- Vérification des limites avant add/simulate

### 🟡 Jour 4 — UX + Wording ⏳ À FAIRE

| Tâche | Status |
|-------|--------|
| Cards design polish | ⏳ |
| Badges lisibles | ⏳ |
| Textes clairs | ⏳ |
| Page produit/pricing | ✅ |

**Fichiers créés:**
- `app/product/page.tsx` — Landing page avec pricing

### 🟡 Jour 5-7 — Extras ⏳ OPTIONNEL

- [ ] Alertes email (Resend/SendGrid)
- [ ] Hidden rules enrichies
- [ ] Feedback users
- [ ] Analytics

---

## 📁 Structure Finale

```
propfirmscanner-v2/
├── app/
│   ├── product/
│   │   └── page.tsx           # Landing + Pricing
│   └── dashboard/
│       ├── page.tsx           # Dashboard "My Accounts"
│       ├── accounts/
│       │   └── new/
│       │       └── page.tsx   # Add Account form
│       ├── simulate/
│       │   └── page.tsx       # Trade Simulator
│       └── rules/
│           └── page.tsx       # Rules & Hidden Risks
└── database/
    └── schema.sql             # Supabase schema
```

---

## 🔧 Installation Rapide

### 1. Copier les fichiers

```bash
# Extraire le zip
unzip propfirmscanner-v2.zip

# Copier dans ton projet
cp -r propfirmscanner-v2/app/dashboard app/
cp -r propfirmscanner-v2/app/product app/
```

### 2. Setup Database

1. Va dans **Supabase → SQL Editor**
2. Copie `database/schema.sql`
3. Clique **Run**

### 3. Protéger les routes

Ajoute dans `app/dashboard/layout.tsx`:

```tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login?redirect=/dashboard')
  }
  
  return <>{children}</>
}
```

---

## 💰 Pricing Recommandé

| Plan | Prix | Limites |
|------|------|---------|
| **Free** | $0 | 1 compte, 5 simulations/jour |
| **Pro** | $9-15/mois | Illimité |

---

## 📝 Textes Marketing Prêts

### Headline
> One dashboard to manage all your prop firm accounts.
> Know your limits before you trade.

### Subheadline
> Track balances, drawdown limits, and rules across all your prop firms — and simulate trades before you enter them.

### Value Props
1. **Centralize** all your prop firm accounts in one place
2. **See your limits** at a glance (daily DD, max DD)
3. **Simulate trades** before entering
4. **Get warned** before you violate a rule
5. **Understand hidden rules** for each firm

### CTA
> Start protecting your prop firm accounts

---

## 🎯 Les 4 Écrans Exacts

### Écran 1: Dashboard "My Accounts"
- Liste des comptes en cards
- Daily DD remaining ($ + %)
- Max DD remaining ($ + %)
- Today PnL (editable)
- Badges: Trailing, News, Weekend
- Actions: Update, Simulate, Rules

### Écran 2: Add Account
- Select prop firm
- Select program
- Stage (Eval/Funded)
- Balances
- Today PnL
- Start date

### Écran 3: Trade Simulation
- Select account
- Risk in USD
- Output: ✅ SAFE / ⚠️ RISKY / ❌ VIOLATION
- Message humain: "This trade would use 82% of your daily drawdown on FundingPips."

### Écran 4: Rules & Hidden Risks
- Key rules (visible)
- Hidden rules / gotchas
- Common mistakes
- Best for / Avoid if

---

## ✅ Checklist Lancement

- [ ] Copier les fichiers
- [ ] Run le schema SQL
- [ ] Tester le dashboard
- [ ] Tester le simulator
- [ ] Ajouter Stripe
- [ ] Protéger les routes
- [ ] Déployer
- [ ] Annoncer aux users existants

---

**Tu ne vends pas des features. Tu vends la tranquillité mentale face aux règles des prop firms.**