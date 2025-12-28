# 🎯 PropFirmScanner Dashboard

## The Control Center for Prop Firm Traders

> Track all your prop firm accounts in one place. Know your limits before you trade. Avoid failing challenges because of rules.

---

## 🚀 Features

### 1. **My Accounts** (Centralisation)
- Add and track multiple prop firm accounts
- See all balances, stages, and rules at a glance
- Real-time health indicators (safe/warning/danger)

### 2. **Trade Simulator** (Sécurité)
- Check if a trade is safe BEFORE entering
- Calculates daily DD and max DD impact
- Warns about news restrictions and weekend holding
- Shows exactly what happens if you lose

### 3. **Smart Alerts** (Anticipation)
- "You've used 50% of daily drawdown"
- "Close positions before weekend - no holding allowed"
- "News event in 30 minutes - trading restricted"

### 4. **Hidden Rules & Traps** (Clarté mentale)
- Common mistakes per prop firm
- Unwritten rules that cause breaches
- Pro tips from experienced traders

---

## 📁 Files Structure

```
propfirmscanner-dashboard/
├── app/
│   └── dashboard/
│       ├── page.tsx                    # Main dashboard
│       ├── simulate/
│       │   └── page.tsx               # Trade simulator
│       ├── accounts/
│       │   └── new/
│       │       └── page.tsx           # Add account form
│       └── rules/
│           └── page.tsx               # Hidden rules database
└── database/
    └── schema.sql                     # Supabase schema
```

---

## 🔧 Installation

### Step 1: Copy Dashboard Files

```bash
# Create dashboard directory
mkdir -p app/dashboard/simulate
mkdir -p app/dashboard/accounts/new
mkdir -p app/dashboard/rules

# Copy files
cp dashboard/app/dashboard/page.tsx app/dashboard/
cp dashboard/app/dashboard/simulate/page.tsx app/dashboard/simulate/
cp dashboard/app/dashboard/accounts/new/page.tsx app/dashboard/accounts/new/
cp dashboard/app/dashboard/rules/page.tsx app/dashboard/rules/
```

### Step 2: Setup Supabase Database

1. Go to **Supabase** → **SQL Editor**
2. Copy the contents of `database/schema.sql`
3. Click **Run**

This creates:
- `user_prop_accounts` - User's tracked accounts
- `pnl_history` - Daily P&L tracking
- `user_alerts` - Alert history
- `user_preferences` - User settings
- `simulation_logs` - Trade simulation history

### Step 3: Add Navigation Link

In your navbar or layout:

```tsx
<Link href="/dashboard">
  Dashboard
</Link>
```

### Step 4: Protect Dashboard Routes

Create `app/dashboard/layout.tsx`:

```tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login?redirect=/dashboard')
  }
  
  return <>{children}</>
}
```

---

## 💰 Monetization (Freemium Model)

### Free Tier
- ✅ 3 accounts max
- ✅ 5 simulations/day
- ✅ Basic alerts
- ✅ Hidden rules access

### Pro Tier ($9-15/month)
- ✅ Unlimited accounts
- ✅ Unlimited simulations
- ✅ Email alerts
- ✅ Advanced analytics
- ✅ P&L history tracking
- ✅ Priority support

### Implementation

Create a `subscriptions` table:

```sql
CREATE TABLE subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Check limits in components:

```tsx
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('plan')
  .eq('user_id', user.id)
  .single()

const isPro = subscription?.plan === 'pro'
const accountLimit = isPro ? Infinity : 3
const simulationLimit = isPro ? Infinity : 5
```

---

## 🔌 Future Integrations (V2)

### Optional API Connections
- **Rithmic** (futures) - Auto-sync P&L
- **cTrader** - Auto-sync positions
- **MetaAPI** (MT4/MT5) - Auto-sync trades

These are NOT required for V1. Manual entry works perfectly.

### Webhook Alerts
- Telegram notifications
- Discord alerts
- SMS for critical warnings

---

## 📊 Database Queries

### Get user's accounts with health status

```sql
SELECT 
  a.*,
  calculate_account_health(a.id) as health
FROM user_prop_accounts a
WHERE a.user_id = auth.uid()
ORDER BY a.created_at DESC;
```

### Get accounts at risk

```sql
SELECT * FROM user_prop_accounts
WHERE user_id = auth.uid()
AND (
  ABS(LEAST(0, daily_pnl)) / (account_size * daily_dd_limit / 100) > 0.5
  OR
  (starting_balance - current_balance) / (account_size * max_dd_limit / 100) > 0.5
);
```

### Get daily P&L history

```sql
SELECT * FROM pnl_history
WHERE account_id = 'xxx'
ORDER BY date DESC
LIMIT 30;
```

---

## 🎨 Customization

### Add New Prop Firm Presets

In `app/dashboard/accounts/new/page.tsx`, add to `propFirmPresets`:

```tsx
{
  slug: 'new-firm',
  name: 'New Firm',
  programs: [
    { 
      name: 'Program Name $100K', 
      account_size: 100000, 
      daily_dd: 5, 
      max_dd: 10, 
      profit_target: 10, 
      min_days: 5 
    },
  ],
  max_dd_type: 'static',
  allows_news_trading: true,
  allows_weekend_holding: true,
  allows_ea: true,
  allows_scaling: false,
}
```

### Add New Hidden Rules

In `app/dashboard/rules/page.tsx`, add to `propFirmRules`:

```tsx
{
  slug: 'firm-slug',
  name: 'Firm Name',
  criticalRules: [
    {
      title: 'Rule Title',
      description: 'Rule description',
      severity: 'high', // high, medium, low
      category: 'news', // news, risk, trading, profit
    },
  ],
  commonMistakes: ['Mistake 1', 'Mistake 2'],
  tips: ['Tip 1', 'Tip 2'],
}
```

---

## 📈 Marketing Copy

### Taglines
- "The control center for prop firm traders"
- "Know your limits before you trade"
- "Stop losing challenges to rules you didn't know"
- "Track. Simulate. Protect."

### Value Propositions
1. **Centralisation** - All accounts in one dashboard
2. **Sécurité** - Know your limits in real-time  
3. **Anticipation** - Simulate before you trade
4. **Clarté mentale** - No more mental calculations

---

## 🚀 Launch Checklist

- [ ] Deploy dashboard pages
- [ ] Run database schema
- [ ] Add navigation links
- [ ] Setup authentication protection
- [ ] Test with mock data
- [ ] Connect to real Supabase
- [ ] Add Stripe for Pro tier
- [ ] Announce to existing users

---

## 📞 Support

Questions? Issues? 
- Check the hidden rules database
- Use the trade simulator
- Contact support

---

**Built with ❤️ for prop firm traders**
