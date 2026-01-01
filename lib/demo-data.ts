// =============================================================================
// DEMO DATA - Realistic prop firm accounts for demo-first experience
// =============================================================================

export interface DemoAccount {
  id: string;
  user_id: string;
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  start_balance: number;
  current_balance: number;
  current_equity: number | null;
  today_pnl: number;
  stage: string;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  trail_high_watermark: number | null;
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  min_trading_days: number;
  current_trading_days: number;
  profit_target_percent: number;
  current_profit_percent: number;
  created_at: string;
  updated_at: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'demo-ftmo-1',
    user_id: 'demo',
    prop_firm: 'FTMO',
    prop_firm_slug: 'ftmo',
    program: '$100K Challenge',
    account_size: 100000,
    start_balance: 100000,
    current_balance: 98500,
    current_equity: 98200,
    today_pnl: -1200,
    stage: 'Phase 1',
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
    trail_high_watermark: null,
    allows_news: false,
    allows_weekend: true,
    has_consistency: false,
    min_trading_days: 4,
    current_trading_days: 3,
    profit_target_percent: 10,
    current_profit_percent: -1.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-the5ers-1',
    user_id: 'demo',
    prop_firm: 'The5ers',
    prop_firm_slug: 'the5ers',
    program: '$40K Bootcamp',
    account_size: 40000,
    start_balance: 40000,
    current_balance: 41200,
    current_equity: 41350,
    today_pnl: 450,
    stage: 'Funded',
    daily_dd_percent: 3,
    max_dd_percent: 6,
    max_dd_type: 'static',
    trail_high_watermark: null,
    allows_news: true,
    allows_weekend: false,
    has_consistency: false,
    min_trading_days: 3,
    current_trading_days: 8,
    profit_target_percent: 6,
    current_profit_percent: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-fundednext-1',
    user_id: 'demo',
    prop_firm: 'FundedNext',
    prop_firm_slug: 'fundednext',
    program: '$50K Stellar',
    account_size: 50000,
    start_balance: 50000,
    current_balance: 49100,
    current_equity: 48800,
    today_pnl: -650,
    stage: 'Phase 2',
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'trailing',
    trail_high_watermark: 51200,
    allows_news: false,
    allows_weekend: true,
    has_consistency: true,
    min_trading_days: 5,
    current_trading_days: 4,
    profit_target_percent: 5,
    current_profit_percent: -1.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_GUIDANCE_MESSAGE = "Avoid trading FTMO today — daily drawdown almost reached.";

export const DEMO_GUIDANCE_TIPS = [
  "Avoid trading trailing drawdown accounts after profits.",
  "Focus on green accounts to reduce failure risk.",
  "Minimum trading days not met yet on 2 accounts.",
];
