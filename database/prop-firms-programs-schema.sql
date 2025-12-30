-- =============================================================================
-- PROP FIRMS & PROGRAMS SCHEMA - PropFirmScanner
-- =============================================================================
-- Run this in Supabase SQL Editor
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROP FIRMS TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS prop_firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  website_url TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'warning', 'scam')),
  
  -- Affiliate
  affiliate_url TEXT,
  affiliate_code TEXT,
  has_discount BOOLEAN DEFAULT false,
  discount_percent INT,
  discount_code TEXT,
  
  -- Verification
  last_verified_at TIMESTAMPTZ,
  verified_by TEXT,
  
  -- Metadata
  founded_year INT,
  headquarters TEXT,
  payout_methods TEXT[], -- ['bank', 'crypto', 'paypal']
  min_payout INT,
  payout_frequency TEXT, -- 'bi-weekly', 'monthly', 'on-demand'
  
  -- Ratings
  trust_score INT CHECK (trust_score >= 0 AND trust_score <= 100),
  user_rating DECIMAL(2,1),
  review_count INT DEFAULT 0,
  
  -- SEO
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_prop_firms_slug ON prop_firms(slug);
CREATE INDEX IF NOT EXISTS idx_prop_firms_status ON prop_firms(status);

-- -----------------------------------------------------------------------------
-- 2. PROGRAMS TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prop_firm_id UUID NOT NULL REFERENCES prop_firms(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  model TEXT NOT NULL CHECK (model IN ('challenge', 'instant', 'evaluation', 'direct')),
  
  -- Account Sizes
  account_size_usd INT NOT NULL,
  price_usd DECIMAL(10,2),
  
  -- Drawdown Rules
  daily_dd_percent DECIMAL(4,2) NOT NULL,
  daily_dd_usd DECIMAL(12,2),
  max_dd_percent DECIMAL(4,2) NOT NULL,
  max_dd_usd DECIMAL(12,2),
  dd_basis TEXT NOT NULL DEFAULT 'balance' CHECK (dd_basis IN ('balance', 'equity')),
  is_trailing BOOLEAN NOT NULL DEFAULT false,
  trailing_type TEXT CHECK (trailing_type IN ('realtime', 'eod', NULL)),
  
  -- Profit Rules
  profit_target_phase1 DECIMAL(4,2),
  profit_target_phase2 DECIMAL(4,2),
  profit_split INT NOT NULL DEFAULT 80,
  
  -- Trading Rules
  min_trading_days INT DEFAULT 0,
  max_trading_days INT,
  news_trading_allowed BOOLEAN DEFAULT true,
  news_buffer_minutes INT,
  weekend_holding_allowed BOOLEAN DEFAULT true,
  hedging_allowed BOOLEAN DEFAULT true,
  ea_allowed BOOLEAN DEFAULT true,
  
  -- Consistency Rule
  has_consistency_rule BOOLEAN DEFAULT false,
  max_daily_profit_percent DECIMAL(4,2),
  
  -- Scaling
  has_scaling BOOLEAN DEFAULT false,
  scaling_requirements TEXT,
  
  -- Features
  features JSONB DEFAULT '[]',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(prop_firm_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_programs_prop_firm ON programs(prop_firm_id);
CREATE INDEX IF NOT EXISTS idx_programs_account_size ON programs(account_size_usd);
CREATE INDEX IF NOT EXISTS idx_programs_model ON programs(model);

-- -----------------------------------------------------------------------------
-- 3. DEALS TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prop_firm_id UUID NOT NULL REFERENCES prop_firms(id) ON DELETE CASCADE,
  
  -- Deal Info
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INT,
  discount_code TEXT,
  affiliate_url TEXT,
  
  -- Validity
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Verification
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_deals_prop_firm ON deals(prop_firm_id);
CREATE INDEX IF NOT EXISTS idx_deals_active ON deals(is_active);

-- -----------------------------------------------------------------------------
-- 4. SEED DATA - PROP FIRMS
-- -----------------------------------------------------------------------------

INSERT INTO prop_firms (name, slug, status, website_url, trust_score, daily_dd_percent, max_dd_percent, founded_year, headquarters, payout_methods, profit_split, description)
VALUES
  ('FTMO', 'ftmo', 'active', 'https://ftmo.com', 95, 5.0, 10.0, 2015, 'Czech Republic', ARRAY['bank', 'crypto'], 80, 'Leading prop firm with strict evaluation process'),
  ('FundedNext', 'fundednext', 'active', 'https://fundednext.com', 88, 5.0, 10.0, 2022, 'UAE', ARRAY['bank', 'crypto'], 90, 'Fast-growing prop firm with up to 90% profit split'),
  ('The5ers', 'the5ers', 'active', 'https://the5ers.com', 90, 4.0, 6.0, 2016, 'Israel', ARRAY['bank', 'paypal'], 80, 'Instant funding available with scaling program'),
  ('MyFundedFX', 'myfundedfx', 'active', 'https://myfundedfx.com', 85, 5.0, 8.0, 2022, 'USA', ARRAY['bank', 'crypto'], 80, 'Competitive pricing with multiple account options'),
  ('E8 Funding', 'e8-funding', 'active', 'https://e8funding.com', 87, 5.0, 8.0, 2021, 'USA', ARRAY['bank', 'crypto'], 80, 'Popular choice with straightforward rules')
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  trust_score = EXCLUDED.trust_score,
  updated_at = NOW();

-- -----------------------------------------------------------------------------
-- 5. SEED DATA - PROGRAMS
-- -----------------------------------------------------------------------------

-- Get prop firm IDs
DO $$
DECLARE
  ftmo_id UUID;
  fundednext_id UUID;
  the5ers_id UUID;
  myfundedfx_id UUID;
  e8_id UUID;
BEGIN
  SELECT id INTO ftmo_id FROM prop_firms WHERE slug = 'ftmo';
  SELECT id INTO fundednext_id FROM prop_firms WHERE slug = 'fundednext';
  SELECT id INTO the5ers_id FROM prop_firms WHERE slug = 'the5ers';
  SELECT id INTO myfundedfx_id FROM prop_firms WHERE slug = 'myfundedfx';
  SELECT id INTO e8_id FROM prop_firms WHERE slug = 'e8-funding';

  -- FTMO Programs
  INSERT INTO programs (prop_firm_id, name, slug, model, account_size_usd, price_usd, daily_dd_percent, max_dd_percent, dd_basis, is_trailing, profit_target_phase1, profit_target_phase2, profit_split, min_trading_days, news_trading_allowed, news_buffer_minutes, weekend_holding_allowed)
  VALUES
    (ftmo_id, '$10K Challenge', '10k-challenge', 'challenge', 10000, 89, 5.0, 10.0, 'balance', false, 10.0, 5.0, 80, 4, false, 2, true),
    (ftmo_id, '$25K Challenge', '25k-challenge', 'challenge', 25000, 250, 5.0, 10.0, 'balance', false, 10.0, 5.0, 80, 4, false, 2, true),
    (ftmo_id, '$50K Challenge', '50k-challenge', 'challenge', 50000, 345, 5.0, 10.0, 'balance', false, 10.0, 5.0, 80, 4, false, 2, true),
    (ftmo_id, '$100K Challenge', '100k-challenge', 'challenge', 100000, 540, 5.0, 10.0, 'balance', false, 10.0, 5.0, 80, 4, false, 2, true),
    (ftmo_id, '$200K Challenge', '200k-challenge', 'challenge', 200000, 1080, 5.0, 10.0, 'balance', false, 10.0, 5.0, 80, 4, false, 2, true)
  ON CONFLICT (prop_firm_id, slug) DO NOTHING;

  -- FundedNext Programs
  INSERT INTO programs (prop_firm_id, name, slug, model, account_size_usd, price_usd, daily_dd_percent, max_dd_percent, dd_basis, is_trailing, trailing_type, profit_target_phase1, profit_target_phase2, profit_split, min_trading_days, news_trading_allowed, news_buffer_minutes, weekend_holding_allowed, has_consistency_rule, max_daily_profit_percent)
  VALUES
    (fundednext_id, '$15K Stellar', '15k-stellar', 'challenge', 15000, 99, 5.0, 10.0, 'balance', true, 'realtime', 8.0, 5.0, 90, 5, false, 5, true, true, 40.0),
    (fundednext_id, '$25K Stellar', '25k-stellar', 'challenge', 25000, 199, 5.0, 10.0, 'balance', true, 'realtime', 8.0, 5.0, 90, 5, false, 5, true, true, 40.0),
    (fundednext_id, '$50K Stellar', '50k-stellar', 'challenge', 50000, 299, 5.0, 10.0, 'balance', true, 'realtime', 8.0, 5.0, 90, 5, false, 5, true, true, 40.0),
    (fundednext_id, '$100K Stellar', '100k-stellar', 'challenge', 100000, 549, 5.0, 10.0, 'balance', true, 'realtime', 8.0, 5.0, 90, 5, false, 5, true, true, 40.0)
  ON CONFLICT (prop_firm_id, slug) DO NOTHING;

  -- The5ers Programs
  INSERT INTO programs (prop_firm_id, name, slug, model, account_size_usd, price_usd, daily_dd_percent, max_dd_percent, dd_basis, is_trailing, profit_split, min_trading_days, news_trading_allowed, weekend_holding_allowed, hedging_allowed)
  VALUES
    (the5ers_id, '$6K Bootcamp', '6k-bootcamp', 'instant', 6000, 95, 4.0, 6.0, 'balance', false, 80, 3, true, false, false),
    (the5ers_id, '$20K High Stakes', '20k-high-stakes', 'challenge', 20000, 275, 4.0, 6.0, 'balance', false, 80, 3, true, false, false),
    (the5ers_id, '$100K High Stakes', '100k-high-stakes', 'challenge', 100000, 575, 4.0, 6.0, 'balance', false, 80, 3, true, false, false)
  ON CONFLICT (prop_firm_id, slug) DO NOTHING;

  -- MyFundedFX Programs
  INSERT INTO programs (prop_firm_id, name, slug, model, account_size_usd, price_usd, daily_dd_percent, max_dd_percent, dd_basis, is_trailing, trailing_type, profit_split, min_trading_days, news_trading_allowed, news_buffer_minutes, has_consistency_rule, max_daily_profit_percent)
  VALUES
    (myfundedfx_id, '$5K Challenge', '5k-challenge', 'challenge', 5000, 49, 5.0, 8.0, 'balance', true, 'realtime', 80, 5, false, 2, true, 45.0),
    (myfundedfx_id, '$10K Challenge', '10k-challenge', 'challenge', 10000, 99, 5.0, 8.0, 'balance', true, 'realtime', 80, 5, false, 2, true, 45.0),
    (myfundedfx_id, '$25K Challenge', '25k-challenge', 'challenge', 25000, 199, 5.0, 8.0, 'balance', true, 'realtime', 80, 5, false, 2, true, 45.0),
    (myfundedfx_id, '$50K Challenge', '50k-challenge', 'challenge', 50000, 299, 5.0, 8.0, 'balance', true, 'realtime', 80, 5, false, 2, true, 45.0),
    (myfundedfx_id, '$100K Challenge', '100k-challenge', 'challenge', 100000, 499, 5.0, 8.0, 'balance', true, 'realtime', 80, 5, false, 2, true, 45.0)
  ON CONFLICT (prop_firm_id, slug) DO NOTHING;

  -- E8 Funding Programs
  INSERT INTO programs (prop_firm_id, name, slug, model, account_size_usd, price_usd, daily_dd_percent, max_dd_percent, dd_basis, is_trailing, profit_split, min_trading_days, news_trading_allowed, news_buffer_minutes)
  VALUES
    (e8_id, '$25K E8 Track', '25k-e8-track', 'challenge', 25000, 228, 5.0, 8.0, 'balance', false, 80, 5, false, 2),
    (e8_id, '$50K E8 Track', '50k-e8-track', 'challenge', 50000, 338, 5.0, 8.0, 'balance', false, 80, 5, false, 2),
    (e8_id, '$100K E8 Track', '100k-e8-track', 'challenge', 100000, 588, 5.0, 8.0, 'balance', false, 80, 5, false, 2),
    (e8_id, '$250K E8 Track', '250k-e8-track', 'challenge', 250000, 988, 5.0, 8.0, 'balance', false, 80, 5, false, 2)
  ON CONFLICT (prop_firm_id, slug) DO NOTHING;

END $$;

-- -----------------------------------------------------------------------------
-- 6. SEED DATA - DEALS
-- -----------------------------------------------------------------------------

INSERT INTO deals (prop_firm_id, title, description, discount_percent, discount_code, is_active, is_featured, last_verified_at)
SELECT 
  id,
  name || ' Discount',
  'Get ' || CASE 
    WHEN slug = 'ftmo' THEN '10% off'
    WHEN slug = 'fundednext' THEN '15% off'
    WHEN slug = 'the5ers' THEN '5% off'
    WHEN slug = 'myfundedfx' THEN '10% off'
    WHEN slug = 'e8-funding' THEN '8% off'
    ELSE '10% off'
  END || ' all challenges',
  CASE 
    WHEN slug = 'ftmo' THEN 10
    WHEN slug = 'fundednext' THEN 15
    WHEN slug = 'the5ers' THEN 5
    WHEN slug = 'myfundedfx' THEN 10
    WHEN slug = 'e8-funding' THEN 8
    ELSE 10
  END,
  CASE 
    WHEN slug = 'ftmo' THEN 'PROPFIRMSCANNER'
    WHEN slug = 'fundednext' THEN 'SCANNER15'
    WHEN slug = 'the5ers' THEN NULL
    WHEN slug = 'myfundedfx' THEN 'PFS10'
    WHEN slug = 'e8-funding' THEN 'SCANNER8'
    ELSE NULL
  END,
  true,
  slug IN ('ftmo', 'fundednext'),
  NOW()
FROM prop_firms
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 7. UPDATE TRIGGERS
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_prop_firms_updated_at ON prop_firms;
CREATE TRIGGER update_prop_firms_updated_at
  BEFORE UPDATE ON prop_firms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

-- Public read access for prop_firms, programs, deals
ALTER TABLE prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON prop_firms FOR SELECT USING (true);
CREATE POLICY "Public read access" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON deals FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 9. HELPER FUNCTIONS
-- -----------------------------------------------------------------------------

-- Get prop firm with programs
CREATE OR REPLACE FUNCTION get_prop_firm_with_programs(firm_slug TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'firm', row_to_json(pf),
    'programs', (
      SELECT json_agg(row_to_json(p))
      FROM programs p
      WHERE p.prop_firm_id = pf.id AND p.is_active = true
      ORDER BY p.account_size_usd
    )
  ) INTO result
  FROM prop_firms pf
  WHERE pf.slug = firm_slug;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get active deals with firm info
CREATE OR REPLACE FUNCTION get_active_deals()
RETURNS TABLE (
  deal_id UUID,
  title TEXT,
  description TEXT,
  discount_percent INT,
  discount_code TEXT,
  is_featured BOOLEAN,
  last_verified_at TIMESTAMPTZ,
  firm_name TEXT,
  firm_slug TEXT,
  firm_logo_url TEXT,
  affiliate_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.description,
    d.discount_percent,
    d.discount_code,
    d.is_featured,
    d.last_verified_at,
    pf.name,
    pf.slug,
    pf.logo_url,
    COALESCE(d.affiliate_url, pf.affiliate_url)
  FROM deals d
  JOIN prop_firms pf ON pf.id = d.prop_firm_id
  WHERE d.is_active = true
    AND pf.status = 'active'
    AND (d.expires_at IS NULL OR d.expires_at > NOW())
  ORDER BY d.is_featured DESC, d.discount_percent DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;
