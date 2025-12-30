-- =============================================================================
-- MY PROP FIRMS - SCHEMA UPDATE
-- =============================================================================
-- Adds trading days tracking to user_accounts
-- Run in Supabase SQL Editor
-- =============================================================================

-- Add trading days columns if they don't exist
ALTER TABLE user_accounts 
ADD COLUMN IF NOT EXISTS min_trading_days INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_trading_days INT DEFAULT 0;

-- Update existing accounts with typical values based on prop firm
UPDATE user_accounts
SET min_trading_days = CASE
  WHEN prop_firm ILIKE '%ftmo%' THEN 4
  WHEN prop_firm ILIKE '%fundednext%' THEN 5
  WHEN prop_firm ILIKE '%the5ers%' THEN 3
  WHEN prop_firm ILIKE '%myfundedfx%' THEN 5
  WHEN prop_firm ILIKE '%e8%' THEN 5
  ELSE 0
END
WHERE min_trading_days IS NULL OR min_trading_days = 0;

-- =============================================================================
-- HELPER FUNCTION: Update trading days count
-- =============================================================================

CREATE OR REPLACE FUNCTION increment_trading_days(p_account_id UUID)
RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE user_accounts
  SET current_trading_days = current_trading_days + 1,
      updated_at = NOW()
  WHERE id = p_account_id
  RETURNING current_trading_days INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- HELPER FUNCTION: Reset trading days (for new phase)
-- =============================================================================

CREATE OR REPLACE FUNCTION reset_trading_days(p_account_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE user_accounts
  SET current_trading_days = 0,
      updated_at = NOW()
  WHERE id = p_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
