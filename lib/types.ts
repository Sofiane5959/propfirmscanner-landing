// =============================================================================
// DASHBOARD TYPES FOR PROPFIRMSCANNER
// =============================================================================

export interface AccountHealth {
  status: 'safe' | 'warning' | 'danger';
  daily: {
    daily_limit_usd: number;
    daily_used_usd: number;
    daily_buffer_usd: number;
    daily_buffer_pct: number;
  };
  max: {
    max_limit_usd: number;
    max_floor_usd: number;
    max_buffer_usd: number;
    max_buffer_pct: number;
    basisUsed: 'balance' | 'equity';
    isApproxTrailing: boolean;
  };
  messages: string[];
}

export interface Account {
  id: string;
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  start_balance: number;
  current_balance: number;
  today_pnl: number;
  stage: string;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  health: AccountHealth;
}

export interface Warning {
  accountId: string;
  propFirm: string;
  message: string;
  status: 'warning' | 'danger';
}
