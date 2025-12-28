-- ============================================================
-- PROPFIRMSCANNER DASHBOARD - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USER ACCOUNTS TABLE (prop firm accounts they're tracking)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_prop_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Prop firm info
  prop_firm TEXT NOT NULL,
  prop_firm_slug TEXT NOT NULL,
  program TEXT NOT NULL,
  
  -- Account details
  account_size DECIMAL(12,2) NOT NULL,
  starting_balance DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('evaluation_1', 'evaluation_2', 'verification', 'funded')),
  
  -- Daily tracking
  daily_pnl DECIMAL(12,2) DEFAULT 0,
  last_pnl_update DATE DEFAULT CURRENT_DATE,
  
  -- Rules
  daily_dd_limit DECIMAL(5,2) DEFAULT 5, -- percentage
  max_dd_limit DECIMAL(5,2) DEFAULT 10, -- percentage
  max_dd_type TEXT DEFAULT 'static' CHECK (max_dd_type IN ('static', 'trailing', 'eod_trailing')),
  profit_target DECIMAL(5,2) DEFAULT 10, -- percentage
  min_trading_days INTEGER DEFAULT 0,
  current_trading_days INTEGER DEFAULT 0,
  
  -- Allowed actions
  allows_news_trading BOOLEAN DEFAULT true,
  allows_weekend_holding BOOLEAN DEFAULT true,
  allows_ea BOOLEAN DEFAULT true,
  allows_scaling BOOLEAN DEFAULT false,
  
  -- Tracking
  highest_balance DECIMAL(12,2), -- for trailing DD
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_user_prop_accounts_user ON user_prop_accounts(user_id);

-- ============================================================
-- DAILY PNL HISTORY (for tracking over time)
-- ============================================================

CREATE TABLE IF NOT EXISTS pnl_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES user_prop_accounts(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  opening_balance DECIMAL(12,2) NOT NULL,
  closing_balance DECIMAL(12,2) NOT NULL,
  pnl DECIMAL(12,2) NOT NULL,
  trades_count INTEGER DEFAULT 0,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(account_id, date)
);

CREATE INDEX IF NOT EXISTS idx_pnl_history_account ON pnl_history(account_id);

-- ============================================================
-- ALERTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES user_prop_accounts(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('daily_dd', 'max_dd', 'news', 'weekend', 'profit_target', 'trading_days', 'custom')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_alerts_user ON user_alerts(user_id);

-- ============================================================
-- USER PREFERENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Alert settings
  email_alerts BOOLEAN DEFAULT true,
  daily_dd_threshold INTEGER DEFAULT 50, -- alert at X% of daily DD used
  max_dd_threshold INTEGER DEFAULT 50, -- alert at X% of max DD used
  
  -- Display preferences
  default_view TEXT DEFAULT 'grid',
  theme TEXT DEFAULT 'dark',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TRADE SIMULATIONS LOG (optional - for analytics)
-- ============================================================

CREATE TABLE IF NOT EXISTS simulation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES user_prop_accounts(id) ON DELETE CASCADE,
  
  risk_amount DECIMAL(12,2) NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('safe', 'warning', 'violation')),
  messages JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_prop_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pnl_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_logs ENABLE ROW LEVEL SECURITY;

-- User can only see their own accounts
CREATE POLICY "Users can view own accounts" ON user_prop_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON user_prop_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON user_prop_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON user_prop_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- PNL History policies
CREATE POLICY "Users can view own pnl_history" ON pnl_history
  FOR SELECT USING (
    account_id IN (SELECT id FROM user_prop_accounts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own pnl_history" ON pnl_history
  FOR INSERT WITH CHECK (
    account_id IN (SELECT id FROM user_prop_accounts WHERE user_id = auth.uid())
  );

-- Alerts policies
CREATE POLICY "Users can view own alerts" ON user_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON user_alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Simulation logs policies
CREATE POLICY "Users can view own simulations" ON simulation_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON simulation_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to reset daily PnL at midnight
CREATE OR REPLACE FUNCTION reset_daily_pnl()
RETURNS void AS $$
BEGIN
  UPDATE user_prop_accounts
  SET 
    daily_pnl = 0,
    last_pnl_update = CURRENT_DATE
  WHERE last_pnl_update < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate account health
CREATE OR REPLACE FUNCTION calculate_account_health(account_id UUID)
RETURNS TABLE (
  daily_dd_used DECIMAL,
  max_dd_used DECIMAL,
  risk_level TEXT
) AS $$
DECLARE
  account user_prop_accounts%ROWTYPE;
  daily_dd_pct DECIMAL;
  max_dd_pct DECIMAL;
BEGIN
  SELECT * INTO account FROM user_prop_accounts WHERE id = account_id;
  
  -- Calculate daily DD used
  IF account.daily_dd_limit > 0 THEN
    daily_dd_pct := ABS(LEAST(0, account.daily_pnl)) / (account.account_size * account.daily_dd_limit / 100) * 100;
  ELSE
    daily_dd_pct := 0;
  END IF;
  
  -- Calculate max DD used
  IF account.max_dd_type = 'static' THEN
    max_dd_pct := (account.starting_balance - account.current_balance) / (account.account_size * account.max_dd_limit / 100) * 100;
  ELSE
    max_dd_pct := (COALESCE(account.highest_balance, account.starting_balance) - account.current_balance) / (account.account_size * account.max_dd_limit / 100) * 100;
  END IF;
  
  max_dd_pct := GREATEST(0, max_dd_pct);
  
  -- Determine risk level
  IF daily_dd_pct > 80 OR max_dd_pct > 80 THEN
    risk_level := 'danger';
  ELSIF daily_dd_pct > 50 OR max_dd_pct > 50 THEN
    risk_level := 'warning';
  ELSE
    risk_level := 'safe';
  END IF;
  
  RETURN QUERY SELECT daily_dd_pct, max_dd_pct, risk_level;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================

-- Run this to verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_prop_accounts', 'pnl_history', 'user_alerts', 'user_preferences', 'simulation_logs');
