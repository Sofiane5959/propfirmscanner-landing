// =============================================================================
// DEMO DATA FOR PROPFIRMSCANNER
// Shown to users before they add their first account
// =============================================================================

import { AccountHealth } from './types';

// Interface matching your existing Account type
export interface DemoAccount {
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

// =============================================================================
// DEMO ACCOUNTS
// 3 accounts with different statuses: SAFE, WARNING, DANGER
// =============================================================================

export const DEMO_ACCOUNTS: DemoAccount[] = [
  // DANGER - FTMO account with daily DD almost breached
  {
    id: 'demo-ftmo-1',
    prop_firm: 'FTMO',
    prop_firm_slug: 'ftmo',
    program: 'Challenge $100K',
    account_size: 100000,
    start_balance: 100000,
    current_balance: 103200,
    today_pnl: -4200,
    stage: 'Evaluation',
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
    allows_news: false,
    allows_weekend: false,
    has_consistency: false,
    health: {
      status: 'danger',
      daily: {
        daily_limit_usd: 5000,
        daily_used_usd: 4200,
        daily_buffer_usd: 800,
        daily_buffer_pct: 16,
      },
      max: {
        max_limit_usd: 10000,
        max_floor_usd: 90000,
        max_buffer_usd: 13200,
        max_buffer_pct: 132,
        basisUsed: 'balance',
        isApproxTrailing: false,
      },
      messages: [
        '⛔ Daily drawdown almost reached! Only $800 buffer left. Stop trading today.',
      ],
    },
  },
  
  // SAFE - The5ers account in good standing
  {
    id: 'demo-5ers-1',
    prop_firm: 'The5ers',
    prop_firm_slug: 'the5ers',
    program: 'Bootcamp $60K',
    account_size: 60000,
    start_balance: 60000,
    current_balance: 62450,
    today_pnl: 850,
    stage: 'Phase 1',
    daily_dd_percent: 3,
    max_dd_percent: 6,
    max_dd_type: 'static',
    allows_news: true,
    allows_weekend: true,
    has_consistency: false,
    health: {
      status: 'safe',
      daily: {
        daily_limit_usd: 1800,
        daily_used_usd: 0,
        daily_buffer_usd: 1800,
        daily_buffer_pct: 100,
      },
      max: {
        max_limit_usd: 3600,
        max_floor_usd: 56400,
        max_buffer_usd: 6050,
        max_buffer_pct: 168,
        basisUsed: 'balance',
        isApproxTrailing: false,
      },
      messages: [],
    },
  },
  
  // WARNING - FundedNext with trailing DD concern
  {
    id: 'demo-fn-1',
    prop_firm: 'FundedNext',
    prop_firm_slug: 'fundednext',
    program: 'Stellar $50K',
    account_size: 50000,
    start_balance: 50000,
    current_balance: 51800,
    today_pnl: 320,
    stage: 'Evaluation',
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'trailing',
    allows_news: true,
    allows_weekend: false,
    has_consistency: true,
    health: {
      status: 'warning',
      daily: {
        daily_limit_usd: 2500,
        daily_used_usd: 680,
        daily_buffer_usd: 1820,
        daily_buffer_pct: 73,
      },
      max: {
        max_limit_usd: 5000,
        max_floor_usd: 46800, // Trailing: locked at highest balance - 10%
        max_buffer_usd: 5000,
        max_buffer_pct: 100,
        basisUsed: 'equity',
        isApproxTrailing: true,
      },
      messages: [
        '⚠️ Trailing drawdown active. Your floor is now locked at $46,800.',
      ],
    },
  },
];

// =============================================================================
// DEMO WARNINGS FOR TODAYS ASSISTANT
// =============================================================================

export const DEMO_WARNINGS = [
  {
    accountId: 'demo-ftmo-1',
    propFirm: 'FTMO',
    message: '⛔ Daily drawdown almost reached! Only $800 buffer remaining.',
    status: 'danger' as const,
  },
  {
    accountId: 'demo-fn-1',
    propFirm: 'FundedNext',
    message: '⚠️ Trailing drawdown active. Be careful taking more profits.',
    status: 'warning' as const,
  },
];

// =============================================================================
// DEMO STATS FOR OVERVIEW TILES
// =============================================================================

export const DEMO_STATS = {
  totalBalance: 217450, // Sum of all demo account balances
  todayPnl: -3030, // Sum of all today's P&L
  accountsAtRisk: 2, // DANGER + WARNING
  totalAccounts: 3,
};

// =============================================================================
// DEMO GUIDANCE MESSAGES
// =============================================================================

export const DEMO_GUIDANCE = {
  primary: {
    title: 'Stop trading FTMO today',
    subtitle: 'Daily drawdown limit almost reached — only $800 buffer remaining',
    type: 'danger' as const,
  },
  secondary: [
    {
      id: 'guidance-1',
      icon: 'alert',
      title: 'Trailing DD Alert',
      message: 'FundedNext floor locked at $46,800. Avoid trading after profits.',
    },
    {
      id: 'guidance-2',
      icon: 'success',
      title: 'Safe to Trade',
      message: 'The5ers account is healthy. Focus your setups here today.',
    },
    {
      id: 'guidance-3',
      icon: 'info',
      title: 'News Event Today',
      message: 'FOMC at 2pm EST. FTMO restricts trading ±2min around news.',
    },
  ],
};
