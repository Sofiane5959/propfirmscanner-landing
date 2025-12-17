# 🎯 PropFirm Scanner

> The #1 platform to compare prop trading firms. Find the perfect match for your trading style.

![PropFirm Scanner](https://via.placeholder.com/1200x630/0f172a/22c55e?text=PropFirm+Scanner)

## ✨ Features

- 🔍 **Compare 50+ Prop Firms** - Side-by-side comparison with filters
- 💰 **Track Prices & Deals** - Get notified when prices drop
- ❤️ **Save Favorites** - Keep track of firms you're interested in
- 🔔 **Custom Alerts** - Never miss a promotion
- 📊 **Detailed Analytics** - Profit splits, drawdown rules, platforms, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/propfirmscanner.git
cd propfirmscanner

# Install dependencies
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database

Go to your Supabase dashboard > SQL Editor, and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create prop_firms table
CREATE TABLE prop_firms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  min_price DECIMAL,
  max_price DECIMAL,
  challenge_types TEXT[],
  account_sizes INTEGER[],
  profit_split INTEGER,
  profit_target_phase1 DECIMAL,
  profit_target_phase2 DECIMAL,
  max_daily_drawdown DECIMAL,
  max_total_drawdown DECIMAL,
  allows_scalping BOOLEAN DEFAULT true,
  allows_news_trading BOOLEAN DEFAULT true,
  allows_weekend_holding BOOLEAN DEFAULT true,
  allows_hedging BOOLEAN DEFAULT true,
  min_trading_days INTEGER DEFAULT 0,
  platforms TEXT[],
  trustpilot_score DECIMAL,
  trustpilot_reviews INTEGER,
  year_founded INTEGER,
  is_regulated BOOLEAN DEFAULT false,
  regulation_info TEXT,
  payout_methods TEXT[],
  min_payout DECIMAL,
  payout_frequency TEXT,
  affiliate_link TEXT,
  affiliate_commission DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotions table
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prop_firm_id UUID REFERENCES prop_firms(id) ON DELETE CASCADE,
  code TEXT,
  discount_percent INTEGER,
  discount_amount DECIMAL,
  description TEXT,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prop_firm_id UUID REFERENCES prop_firms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, prop_firm_id)
);

-- Create user_alerts table
CREATE TABLE user_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prop_firm_id UUID REFERENCES prop_firms(id) ON DELETE CASCADE,
  alert_type TEXT CHECK (alert_type IN ('promo', 'price_drop', 'new_program')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for prop_firms and promotions
CREATE POLICY "Public read access" ON prop_firms FOR SELECT USING (true);
CREATE POLICY "Public read access" ON promotions FOR SELECT USING (true);

-- User-specific access for favorites and alerts
CREATE POLICY "Users can view own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own alerts" ON user_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON user_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON user_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON user_alerts FOR DELETE USING (auth.uid() = user_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
propfirmscanner/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── compare/           # Comparison tool
│   ├── dashboard/         # User dashboard
│   └── auth/              # Login/Signup pages
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── compare/           # PropFirmCard, Filters
│   └── ui/                # Reusable UI components
├── lib/
│   ├── supabase-client.ts # Client-side Supabase
│   ├── supabase-server.ts # Server-side Supabase
│   └── data.ts            # Sample data
└── types/                 # TypeScript types
```

## 🔧 Configuration

### Authentication

1. In Supabase Dashboard > Authentication > Providers
2. Enable **Email** provider
3. (Optional) Enable **Google** OAuth:
   - Create OAuth credentials in Google Cloud Console
   - Add credentials to Supabase

### Adding Prop Firms

Insert data via Supabase dashboard or SQL:

```sql
INSERT INTO prop_firms (name, slug, min_price, profit_split, ...) 
VALUES ('FTMO', 'ftmo', 155, 80, ...);
```

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## 📈 Next Steps

- [ ] Add more prop firms to database
- [ ] Implement real authentication
- [ ] Connect favorites to Supabase
- [ ] Set up email notifications (Resend)
- [ ] Add affiliate tracking
- [ ] Implement trade copier integration

## 🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

## 📄 License

MIT © PropFirm Scanner

---

Built with ❤️ by PropFirm Scanner Team
