-- ============================================================
-- PROPFIRMSCANNER DASHBOARD - SIMPLIFIED SCHEMA
-- Day 1: Base & Logic
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABLE 1: PROP FIRMS (reference data)
-- Already exists in your database, but here's the structure
-- ============================================================

-- You already have prop_firms table from comparison site
-- We'll reference it for rules data

-- ============================================================
-- TABLE 2: PROGRAMS (rules per program)
-- Pre-populated with common programs
-- ============================================================

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prop_firm_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  account_size INTEGER NOT NULL,
  daily_dd_percent DECIMAL(5,2) DEFAULT 5,
  max_dd_percent DECIMAL(5,2) DEFAULT 10,
  max_dd_type TEXT DEFAULT 'static' CHECK (max_dd_type IN ('static', 'trailing', 'eod_trailing')),
  profit_target_percent DECIMAL(5,2) DEFAULT 10,
  min_trading_days INTEGER DEFAULT 0,
  allows_news BOOLEAN DEFAULT true,
  allows_weekend BOOLEAN DEFAULT true,
  allows_ea BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_programs_firm ON programs(prop_firm_slug);

-- ============================================================
-- TABLE 3: USER_ACCOUNTS (core tracking)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- What they're tracking
  prop_firm TEXT NOT NULL,
  prop_firm_slug TEXT NOT NULL,
  program TEXT NOT NULL,
  
  -- Balances
  account_size INTEGER NOT NULL,
  start_balance DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  
  -- Stage
  stage TEXT NOT NULL DEFAULT 'eval_1' CHECK (stage IN ('eval_1', 'eval_2', 'verification', 'funded')),
  
  -- Today's tracking (reset daily)
  today_pnl DECIMAL(12,2) DEFAULT 0,
  pnl_last_updated DATE DEFAULT CURRENT_DATE,
  
  -- Rules (copied from program on creation)
  daily_dd_percent DECIMAL(5,2) DEFAULT 5,
  max_dd_percent DECIMAL(5,2) DEFAULT 10,
  max_dd_type TEXT DEFAULT 'static',
  allows_news BOOLEAN DEFAULT true,
  allows_weekend BOOLEAN DEFAULT true,
  
  -- Tracking
  start_date DATE DEFAULT CURRENT_DATE,
  highest_balance DECIMAL(12,2), -- for trailing DD
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_user_accounts_user ON user_accounts(user_id);

-- ============================================================
-- TABLE 4: SUBSCRIPTIONS (Day 3: Paywall)
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TABLE 5: USAGE_LIMITS (track free tier usage)
-- ============================================================

CREATE TABLE IF NOT EXISTS usage_limits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  simulations_today INTEGER DEFAULT 0,
  last_simulation_date DATE DEFAULT CURRENT_DATE,
  accounts_count INTEGER DEFAULT 0
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- User can only see their own data
CREATE POLICY "Users own accounts" ON user_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own usage" ON usage_limits
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTION: Reset daily PnL
-- ============================================================

CREATE OR REPLACE FUNCTION reset_daily_pnl()
RETURNS void AS $$
BEGIN
  UPDATE user_accounts
  SET 
    today_pnl = 0,
    pnl_last_updated = CURRENT_DATE
  WHERE pnl_last_updated < CURRENT_DATE;
  
  UPDATE usage_limits
  SET 
    simulations_today = 0,
    last_simulation_date = CURRENT_DATE
  WHERE last_simulation_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- HELPER FUNCTION: Check limits (for paywall)
-- ============================================================

CREATE OR REPLACE FUNCTION check_user_limits(uid UUID)
RETURNS TABLE (
  can_add_account BOOLEAN,
  can_simulate BOOLEAN,
  is_pro BOOLEAN,
  accounts_used INTEGER,
  simulations_used INTEGER
) AS $$
DECLARE
  user_plan TEXT;
  acc_count INTEGER;
  sim_count INTEGER;
BEGIN
  -- Get plan
  SELECT COALESCE(plan, 'free') INTO user_plan FROM subscriptions WHERE user_id = uid;
  IF user_plan IS NULL THEN user_plan := 'free'; END IF;
  
  -- Get usage
  SELECT COALESCE(accounts_count, 0), COALESCE(simulations_today, 0) 
  INTO acc_count, sim_count
  FROM usage_limits WHERE user_id = uid;
  
  IF acc_count IS NULL THEN acc_count := 0; END IF;
  IF sim_count IS NULL THEN sim_count := 0; END IF;
  
  -- Return limits
  RETURN QUERY SELECT
    CASE WHEN user_plan = 'pro' THEN true ELSE acc_count < 1 END,
    CASE WHEN user_plan = 'pro' THEN true ELSE sim_count < 5 END,
    user_plan = 'pro',
    acc_count,
    sim_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SEED DATA: Common Programs
-- ============================================================

INSERT INTO programs (prop_firm_slug, name, account_size, daily_dd_percent, max_dd_percent, max_dd_type, profit_target_percent, min_trading_days, allows_news, allows_weekend) VALUES
-- FTMO
('ftmo', 'Standard $10K', 10000, 5, 10, 'static', 10, 4, false, true),
('ftmo', 'Standard $25K', 25000, 5, 10, 'static', 10, 4, false, true),
('ftmo', 'Standard $50K', 50000, 5, 10, 'static', 10, 4, false, true),
('ftmo', 'Standard $100K', 100000, 5, 10, 'static', 10, 4, false, true),
('ftmo', 'Standard $200K', 200000, 5, 10, 'static', 10, 4, false, true),
-- FundedNext
('fundednext', 'Stellar 2-Step $6K', 6000, 5, 10, 'static', 8, 5, true, true),
('fundednext', 'Stellar 2-Step $15K', 15000, 5, 10, 'static', 8, 5, true, true),
('fundednext', 'Stellar 2-Step $25K', 25000, 5, 10, 'static', 8, 5, true, true),
('fundednext', 'Stellar 2-Step $50K', 50000, 5, 10, 'static', 8, 5, true, true),
('fundednext', 'Stellar 2-Step $100K', 100000, 5, 10, 'static', 8, 5, true, true),
('fundednext', 'Stellar 1-Step $25K', 25000, 3, 6, 'static', 10, 2, true, true),
('fundednext', 'Stellar 1-Step $50K', 50000, 3, 6, 'static', 10, 2, true, true),
('fundednext', 'Stellar 1-Step $100K', 100000, 3, 6, 'static', 10, 2, true, true),
-- The5ers
('the5ers', 'High Stakes $6K', 6000, 3, 6, 'static', 8, 0, true, true),
('the5ers', 'High Stakes $20K', 20000, 3, 6, 'static', 8, 0, true, true),
('the5ers', 'High Stakes $60K', 60000, 3, 6, 'static', 8, 0, true, true),
('the5ers', 'High Stakes $100K', 100000, 3, 6, 'static', 8, 0, true, true),
-- My Funded Futures
('my-funded-futures', 'Starter $50K', 50000, 0, 4, 'eod_trailing', 6, 2, true, false),
('my-funded-futures', 'Starter $100K', 100000, 0, 4.5, 'eod_trailing', 6, 2, true, false),
('my-funded-futures', 'Starter $150K', 150000, 0, 4.5, 'eod_trailing', 9, 2, true, false),
-- Topstep
('topstep', 'Trading Combine $50K', 50000, 0, 3, 'eod_trailing', 6, 5, true, false),
('topstep', 'Trading Combine $100K', 100000, 0, 4, 'eod_trailing', 6, 5, true, false),
('topstep', 'Trading Combine $150K', 150000, 0, 4.5, 'eod_trailing', 9, 5, true, false),
-- Apex Trader Funding
('apex-trader-funding', 'Evaluation $50K', 50000, 0, 5, 'trailing', 6, 7, true, false),
('apex-trader-funding', 'Evaluation $100K', 100000, 0, 6, 'trailing', 6, 7, true, false),
('apex-trader-funding', 'Evaluation $150K', 150000, 0, 9, 'trailing', 9, 7, true, false),
('apex-trader-funding', 'Evaluation $250K', 250000, 0, 12.5, 'trailing', 15, 7, true, false),
-- E8 Markets
('e8-markets', 'E8 Track $25K', 25000, 4, 8, 'static', 8, 0, false, true),
('e8-markets', 'E8 Track $50K', 50000, 4, 8, 'static', 8, 0, false, true),
('e8-markets', 'E8 Track $100K', 100000, 4, 8, 'static', 8, 0, false, true),
('e8-markets', 'E8 Track $250K', 250000, 4, 8, 'static', 8, 0, false, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFY
-- ============================================================

SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('programs', 'user_accounts', 'subscriptions', 'usage_limits');
