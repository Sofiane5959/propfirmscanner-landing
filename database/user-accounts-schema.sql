-- =============================================================================
-- USER ACCOUNTS TABLE - PropFirmScanner
-- =============================================================================
-- Run this in Supabase SQL Editor AFTER paywall-schema.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USER ACCOUNTS TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Prop Firm Info
  prop_firm TEXT NOT NULL,                    -- e.g., "FTMO"
  prop_firm_slug TEXT NOT NULL,               -- e.g., "ftmo"
  program TEXT NOT NULL,                      -- e.g., "$100K Challenge"
  
  -- Account Info
  account_size INT NOT NULL,                  -- e.g., 100000
  start_balance DECIMAL(12,2) NOT NULL,       -- Starting balance
  current_balance DECIMAL(12,2) NOT NULL,     -- Current balance
  current_equity DECIMAL(12,2),               -- Current equity (optional, for floating P&L)
  today_pnl DECIMAL(10,2) NOT NULL DEFAULT 0, -- Today's P&L
  
  -- Stage
  stage TEXT NOT NULL DEFAULT 'Phase 1',      -- Phase 1, Phase 2, Verification, Funded
  
  -- Drawdown Rules
  daily_dd_percent DECIMAL(4,2) NOT NULL,     -- e.g., 5.00 for 5%
  max_dd_percent DECIMAL(4,2) NOT NULL,       -- e.g., 10.00 for 10%
  max_dd_type TEXT NOT NULL DEFAULT 'static', -- static, trailing, eod_trailing
  trail_high_watermark DECIMAL(12,2),         -- For trailing DD accounts
  
  -- Other Rules
  allows_news BOOLEAN NOT NULL DEFAULT true,
  allows_weekend BOOLEAN NOT NULL DEFAULT true,
  has_consistency BOOLEAN NOT NULL DEFAULT false,
  
  -- Dates
  start_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_accounts_user_id ON user_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_accounts_prop_firm ON user_accounts(prop_firm_slug);

-- -----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own accounts
CREATE POLICY "Users can view own accounts" ON user_accounts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own accounts
CREATE POLICY "Users can create own accounts" ON user_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own accounts
CREATE POLICY "Users can update own accounts" ON user_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own accounts
CREATE POLICY "Users can delete own accounts" ON user_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. HELPER FUNCTION: Count User Accounts
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION count_user_accounts(p_user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM user_accounts WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 4. TRIGGER: Update updated_at on changes
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_accounts_updated_at ON user_accounts;

CREATE TRIGGER update_user_accounts_updated_at
  BEFORE UPDATE ON user_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- 5. TRIGGER: Update trail_high_watermark on balance increase
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_high_watermark()
RETURNS TRIGGER AS $$
BEGIN
  -- Only for trailing DD accounts
  IF NEW.max_dd_type IN ('trailing', 'eod_trailing') THEN
    -- Update HWM if current balance is higher
    IF NEW.current_balance > COALESCE(NEW.trail_high_watermark, NEW.start_balance) THEN
      NEW.trail_high_watermark = NEW.current_balance;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_account_high_watermark ON user_accounts;

CREATE TRIGGER update_account_high_watermark
  BEFORE UPDATE ON user_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_high_watermark();

-- -----------------------------------------------------------------------------
-- 6. CRON JOB FUNCTION: Reset daily P&L at midnight
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION reset_daily_pnl()
RETURNS void AS $$
BEGIN
  UPDATE user_accounts
  SET 
    today_pnl = 0,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: To run this daily, set up a Supabase Edge Function or use pg_cron
-- Example with pg_cron (if enabled):
-- SELECT cron.schedule('reset-daily-pnl', '0 0 * * *', 'SELECT reset_daily_pnl()');
