-- =============================================================================
-- PAYWALL SCHEMA - PropFirmScanner
-- =============================================================================
-- Run this in Supabase SQL Editor
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USER PROFILES TABLE
-- -----------------------------------------------------------------------------
-- Stores user plan information and pro expiration

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Plan: 'free' or 'pro'
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  
  -- Pro expiration (NULL = never expires for lifetime codes)
  pro_expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- -----------------------------------------------------------------------------
-- 2. DAILY USAGE TABLE
-- -----------------------------------------------------------------------------
-- Tracks daily simulation usage per user

CREATE TABLE IF NOT EXISTS daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Date in YYYY-MM-DD format (text for easier comparison)
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Counters
  simulations_count INT NOT NULL DEFAULT 0,
  accounts_created INT NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One row per user per day
  UNIQUE(user_id, usage_date)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, usage_date);

-- -----------------------------------------------------------------------------
-- 3. PRO CODES TABLE (Optional - for tracking used codes)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS pro_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  
  -- Code type: 'monthly', 'yearly', 'lifetime'
  code_type TEXT NOT NULL DEFAULT 'monthly' CHECK (code_type IN ('monthly', 'yearly', 'lifetime')),
  
  -- Duration in days (NULL for lifetime)
  duration_days INT,
  
  -- Usage limits
  max_uses INT DEFAULT 1,
  current_uses INT NOT NULL DEFAULT 0,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- 4. CODE REDEMPTIONS TABLE (Track who used what code)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent same user from using same code twice
  UNIQUE(user_id, code)
);

-- -----------------------------------------------------------------------------
-- 5. HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Function to get or create user profile
CREATE OR REPLACE FUNCTION get_or_create_profile(p_user_id UUID)
RETURNS user_profiles AS $$
DECLARE
  profile user_profiles;
BEGIN
  -- Try to get existing profile
  SELECT * INTO profile FROM user_profiles WHERE user_id = p_user_id;
  
  -- Create if not exists
  IF profile IS NULL THEN
    INSERT INTO user_profiles (user_id, plan)
    VALUES (p_user_id, 'free')
    RETURNING * INTO profile;
  END IF;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create daily usage
CREATE OR REPLACE FUNCTION get_or_create_daily_usage(p_user_id UUID)
RETURNS daily_usage AS $$
DECLARE
  usage daily_usage;
BEGIN
  -- Try to get today's usage
  SELECT * INTO usage 
  FROM daily_usage 
  WHERE user_id = p_user_id AND usage_date = CURRENT_DATE;
  
  -- Create if not exists
  IF usage IS NULL THEN
    INSERT INTO daily_usage (user_id, usage_date, simulations_count, accounts_created)
    VALUES (p_user_id, CURRENT_DATE, 0, 0)
    RETURNING * INTO usage;
  END IF;
  
  RETURN usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is pro (considering expiration)
CREATE OR REPLACE FUNCTION is_user_pro(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile user_profiles;
BEGIN
  SELECT * INTO profile FROM user_profiles WHERE user_id = p_user_id;
  
  -- No profile = free
  IF profile IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if pro and not expired
  IF profile.plan = 'pro' THEN
    -- NULL expiration = lifetime pro
    IF profile.pro_expires_at IS NULL THEN
      RETURN true;
    END IF;
    
    -- Check if not expired
    RETURN profile.pro_expires_at > NOW();
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count user accounts
CREATE OR REPLACE FUNCTION count_user_accounts(p_user_id UUID)
RETURNS INT AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM user_accounts WHERE user_id = p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create account
CREATE OR REPLACE FUNCTION can_create_account(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_pro BOOLEAN;
  account_count INT;
BEGIN
  is_pro := is_user_pro(p_user_id);
  
  -- Pro users can create unlimited accounts
  IF is_pro THEN
    RETURN true;
  END IF;
  
  -- Free users limited to 1 account
  account_count := count_user_accounts(p_user_id);
  RETURN account_count < 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can simulate
CREATE OR REPLACE FUNCTION can_simulate(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_pro BOOLEAN;
  usage daily_usage;
  max_free_simulations INT := 3;
BEGIN
  is_pro := is_user_pro(p_user_id);
  
  -- Pro users can simulate unlimited
  IF is_pro THEN
    RETURN true;
  END IF;
  
  -- Get today's usage
  usage := get_or_create_daily_usage(p_user_id);
  
  -- Check against limit
  RETURN usage.simulations_count < max_free_simulations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment simulations
CREATE OR REPLACE FUNCTION increment_simulations(p_user_id UUID)
RETURNS INT AS $$
DECLARE
  usage daily_usage;
BEGIN
  -- Get or create today's usage
  usage := get_or_create_daily_usage(p_user_id);
  
  -- Increment count
  UPDATE daily_usage 
  SET 
    simulations_count = simulations_count + 1,
    updated_at = NOW()
  WHERE id = usage.id
  RETURNING simulations_count INTO usage.simulations_count;
  
  RETURN usage.simulations_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user to pro
CREATE OR REPLACE FUNCTION upgrade_to_pro(p_user_id UUID, p_duration_days INT DEFAULT 30)
RETURNS user_profiles AS $$
DECLARE
  profile user_profiles;
  new_expiry TIMESTAMPTZ;
BEGIN
  -- Calculate new expiry
  IF p_duration_days IS NULL THEN
    new_expiry := NULL; -- Lifetime
  ELSE
    new_expiry := NOW() + (p_duration_days || ' days')::INTERVAL;
  END IF;
  
  -- Get or create profile
  profile := get_or_create_profile(p_user_id);
  
  -- Update to pro
  UPDATE user_profiles
  SET 
    plan = 'pro',
    pro_expires_at = new_expiry,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING * INTO profile;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user limits status
CREATE OR REPLACE FUNCTION get_user_limits(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile user_profiles;
  usage daily_usage;
  account_count INT;
  is_pro BOOLEAN;
BEGIN
  profile := get_or_create_profile(p_user_id);
  usage := get_or_create_daily_usage(p_user_id);
  account_count := count_user_accounts(p_user_id);
  is_pro := is_user_pro(p_user_id);
  
  RETURN json_build_object(
    'plan', profile.plan,
    'is_pro', is_pro,
    'pro_expires_at', profile.pro_expires_at,
    'accounts_count', account_count,
    'accounts_limit', CASE WHEN is_pro THEN -1 ELSE 1 END,
    'can_create_account', can_create_account(p_user_id),
    'simulations_today', usage.simulations_count,
    'simulations_limit', CASE WHEN is_pro THEN -1 ELSE 3 END,
    'can_simulate', can_simulate(p_user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own usage
CREATE POLICY "Users can view own usage" ON daily_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own redemptions
CREATE POLICY "Users can view own redemptions" ON code_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 7. AUTO-CREATE PROFILE ON USER SIGNUP (TRIGGER)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, plan)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- -----------------------------------------------------------------------------
-- 8. INSERT SOME PRO CODES (Optional)
-- -----------------------------------------------------------------------------

-- Example codes (change these in production!)
INSERT INTO pro_codes (code, code_type, duration_days, max_uses) VALUES
  ('PROPFIRM2025', 'monthly', 30, 100),
  ('EARLYBIRD', 'yearly', 365, 50),
  ('LIFETIME', 'lifetime', NULL, 10)
ON CONFLICT (code) DO NOTHING;
