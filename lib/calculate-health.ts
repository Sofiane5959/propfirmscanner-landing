// =============================================================================
// CALCULATE HEALTH - Transform GuestAccount into Account with health metrics
// =============================================================================

import type { GuestAccount } from './guest-storage';

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

export interface AccountWithHealth {
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

/**
 * Calculate the health metrics for a guest account
 * This transforms a GuestAccount into a full Account with health data
 */
export function calculateAccountHealth(guest: GuestAccount): AccountWithHealth {
  // ===================
  // DAILY DRAWDOWN
  // ===================
  const dailyLimit = guest.account_size * (guest.daily_dd_percent / 100);
  
  // Daily used = how much we've lost today (only count losses)
  const dailyUsed = guest.today_pnl < 0 ? Math.abs(guest.today_pnl) : 0;
  const dailyBuffer = Math.max(0, dailyLimit - dailyUsed);
  const dailyBufferPct = dailyLimit > 0 ? (dailyBuffer / dailyLimit) * 100 : 100;

  // ===================
  // MAX DRAWDOWN
  // ===================
  const maxLimit = guest.account_size * (guest.max_dd_percent / 100);
  
  // For static DD: floor is always initial balance - max DD
  // For trailing DD: floor moves up with profits (simplified calculation)
  let maxFloor: number;
  let isApproxTrailing = false;
  
  if (guest.max_dd_type === 'static') {
    maxFloor = guest.start_balance - maxLimit;
  } else {
    // Trailing: floor = highest balance - max DD %
    // We approximate highest balance as max(start_balance, current_balance)
    const highestBalance = Math.max(guest.start_balance, guest.current_balance);
    maxFloor = highestBalance - (highestBalance * (guest.max_dd_percent / 100));
    isApproxTrailing = true;
  }
  
  const maxBuffer = Math.max(0, guest.current_balance - maxFloor);
  const maxBufferPct = maxLimit > 0 ? (maxBuffer / maxLimit) * 100 : 100;

  // ===================
  // DETERMINE STATUS
  // ===================
  let status: 'safe' | 'warning' | 'danger' = 'safe';
  const messages: string[] = [];

  // Check daily DD
  if (dailyBufferPct < 15) {
    status = 'danger';
    messages.push(`⛔ Daily drawdown critical! Only $${dailyBuffer.toFixed(0)} buffer remaining. Stop trading today.`);
  } else if (dailyBufferPct < 30) {
    if (status !== 'danger') status = 'warning';
    messages.push(`⚠️ Daily drawdown warning: $${dailyBuffer.toFixed(0)} buffer remaining (${dailyBufferPct.toFixed(0)}%).`);
  }

  // Check max DD
  if (maxBufferPct < 15) {
    status = 'danger';
    messages.push(`⛔ Max drawdown critical! Only $${maxBuffer.toFixed(0)} until account breach.`);
  } else if (maxBufferPct < 30) {
    if (status !== 'danger') status = 'warning';
    messages.push(`⚠️ Max drawdown warning: $${maxBuffer.toFixed(0)} buffer remaining.`);
  }

  // Trailing DD warning
  if (guest.max_dd_type !== 'static' && guest.current_balance > guest.start_balance) {
    messages.push(`📊 Trailing drawdown active. Your floor is locked at $${maxFloor.toFixed(0)}.`);
  }

  // ===================
  // BUILD ACCOUNT
  // ===================
  return {
    id: guest.id,
    prop_firm: guest.prop_firm,
    prop_firm_slug: guest.prop_firm_slug,
    program: guest.program,
    account_size: guest.account_size,
    start_balance: guest.start_balance,
    current_balance: guest.current_balance,
    today_pnl: guest.today_pnl,
    stage: 'Evaluation', // Default stage for guest accounts
    daily_dd_percent: guest.daily_dd_percent,
    max_dd_percent: guest.max_dd_percent,
    max_dd_type: guest.max_dd_type,
    allows_news: true, // Default values - could be enhanced with firm data
    allows_weekend: true,
    has_consistency: false,
    health: {
      status,
      daily: {
        daily_limit_usd: dailyLimit,
        daily_used_usd: dailyUsed,
        daily_buffer_usd: dailyBuffer,
        daily_buffer_pct: dailyBufferPct,
      },
      max: {
        max_limit_usd: maxLimit,
        max_floor_usd: maxFloor,
        max_buffer_usd: maxBuffer,
        max_buffer_pct: maxBufferPct,
        basisUsed: 'balance',
        isApproxTrailing,
      },
      messages,
    },
  };
}

/**
 * Get the most critical warning message for an account
 */
export function getPrimaryWarning(account: AccountWithHealth): string | null {
  if (account.health.messages.length === 0) return null;
  
  // Return the first danger message, or first warning
  const dangerMsg = account.health.messages.find(m => m.startsWith('⛔'));
  if (dangerMsg) return dangerMsg;
  
  const warningMsg = account.health.messages.find(m => m.startsWith('⚠️'));
  if (warningMsg) return warningMsg;
  
  return account.health.messages[0];
}

/**
 * Calculate aggregate stats from multiple accounts
 */
export function calculateDashboardStats(accounts: AccountWithHealth[]) {
  return {
    totalAccounts: accounts.length,
    totalBalance: accounts.reduce((sum, a) => sum + a.current_balance, 0),
    todayPnl: accounts.reduce((sum, a) => sum + a.today_pnl, 0),
    safeCount: accounts.filter(a => a.health.status === 'safe').length,
    warningCount: accounts.filter(a => a.health.status === 'warning').length,
    dangerCount: accounts.filter(a => a.health.status === 'danger').length,
    accountsAtRisk: accounts.filter(a => a.health.status !== 'safe').length,
  };
}

/**
 * Get warnings formatted for TodaysAssistant component
 */
export function getWarningsForAssistant(accounts: AccountWithHealth[]) {
  return accounts
    .filter(a => a.health.status !== 'safe' && a.health.messages.length > 0)
    .map(a => ({
      accountId: a.id,
      propFirm: a.prop_firm,
      message: a.health.messages[0],
      status: a.health.status as 'warning' | 'danger',
    }));
}
