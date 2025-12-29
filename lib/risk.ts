/**
 * =============================================================================
 * PROP FIRM RISK CALCULATION MODULE
 * =============================================================================
 * 
 * A robust calculation engine for tracking prop firm account compliance.
 * Handles daily drawdown, max drawdown, trailing drawdown, and health status.
 * 
 * @module lib/risk
 * @version 1.0.0
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Represents a drawdown limit - can be expressed as percentage or fixed USD amount
 */
export type DrawdownLimit = 
  | { kind: 'percent'; value: number }  // e.g., { kind: 'percent', value: 5 } = 5%
  | { kind: 'usd'; value: number };     // e.g., { kind: 'usd', value: 5000 } = $5,000

/**
 * The basis used for drawdown calculations
 * - 'balance': Uses current_balance_usd (most common)
 * - 'equity': Uses current_equity_usd (for firms that track floating P&L)
 */
export type DrawdownBasis = 'balance' | 'equity';

/**
 * Current state of a user's prop firm account
 */
export interface AccountState {
  /** Starting balance when the account was created/funded */
  start_balance_usd: number;
  
  /** Current closed balance (realized P&L) */
  current_balance_usd: number;
  
  /** Current equity including floating P&L (optional) */
  current_equity_usd?: number;
  
  /** Today's realized P&L (positive = profit, negative = loss) */
  today_pnl_usd: number;
  
  /** 
   * High water mark for trailing drawdown accounts (optional)
   * This is the highest balance/equity the account has reached
   */
  trail_high_watermark_usd?: number;
}

/**
 * Rules defining the drawdown limits for an account
 */
export interface RuleSet {
  /** Daily loss limit (resets each trading day) */
  daily_limit: DrawdownLimit;
  
  /** Maximum overall drawdown limit */
  max_limit: DrawdownLimit;
  
  /** What value to use for calculations: balance or equity */
  basis: DrawdownBasis;
  
  /** Whether the max drawdown trails upward with profits */
  isTrailing: boolean;
}

/**
 * Result of daily buffer calculation
 */
export interface DailyBufferResult {
  /** The daily limit converted to USD */
  daily_limit_usd: number;
  
  /** How much of the daily limit has been used (always >= 0) */
  daily_used_usd: number;
  
  /** Remaining buffer before hitting daily limit (always >= 0) */
  daily_buffer_usd: number;
  
  /** Buffer as percentage of limit (0-100, clamped) */
  daily_buffer_pct: number;
}

/**
 * Result of max drawdown buffer calculation
 */
export interface MaxBufferResult {
  /** The max limit converted to USD */
  max_limit_usd: number;
  
  /** The floor balance that would trigger a breach */
  max_floor_usd: number;
  
  /** Remaining buffer before hitting max limit (always >= 0) */
  max_buffer_usd: number;
  
  /** Buffer as percentage of limit (0-100, clamped) */
  max_buffer_pct: number;
  
  /** Which basis was actually used ('balance' or 'equity') */
  basisUsed: DrawdownBasis;
  
  /** 
   * True if trailing is enabled but HWM is missing
   * In this case, we show non-trailing buffer but flag it as approximate
   */
  isApproxTrailing: boolean;
}

/**
 * Overall account health status
 */
export type HealthStatus = 'safe' | 'warning' | 'danger';

/**
 * Complete health assessment result
 */
export interface AccountHealthResult {
  /** Overall status based on worst metric */
  status: HealthStatus;
  
  /** Daily buffer calculations */
  daily: DailyBufferResult;
  
  /** Max drawdown buffer calculations */
  max: MaxBufferResult;
  
  /** Human-readable messages about the account state */
  messages: string[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Threshold below which status is 'danger' */
const DANGER_THRESHOLD_PCT = 15;

/** Threshold below which status is 'warning' */
const WARNING_THRESHOLD_PCT = 30;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Safely clamps a number between min and max values
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Safely calculates percentage, handling division by zero
 */
function safePercentage(numerator: number, denominator: number): number {
  if (denominator === 0 || !Number.isFinite(denominator)) {
    return 0;
  }
  return (numerator / denominator) * 100;
}

/**
 * Validates that a number is finite and non-negative
 */
function validatePositiveNumber(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number, got: ${value}`);
  }
  if (value < 0) {
    throw new Error(`${name} must be non-negative, got: ${value}`);
  }
}

// =============================================================================
// CORE CALCULATION FUNCTIONS
// =============================================================================

/**
 * Converts a DrawdownLimit to USD amount based on start balance
 * 
 * @param limit - The drawdown limit (percent or USD)
 * @param startBalance - The starting balance for percent calculations
 * @returns The limit expressed in USD
 * 
 * @example
 * // Percent limit: 5% of $100,000 = $5,000
 * limitToUsd({ kind: 'percent', value: 5 }, 100000) // => 5000
 * 
 * @example
 * // USD limit: $3,000 regardless of balance
 * limitToUsd({ kind: 'usd', value: 3000 }, 100000) // => 3000
 */
export function limitToUsd(limit: DrawdownLimit, startBalance: number): number {
  validatePositiveNumber(startBalance, 'startBalance');
  validatePositiveNumber(limit.value, 'limit.value');
  
  if (limit.kind === 'percent') {
    return (limit.value / 100) * startBalance;
  }
  
  return limit.value;
}

/**
 * Calculates the daily drawdown buffer
 * 
 * Daily drawdown tracks losses within a single trading day.
 * - daily_used = how much loss occurred today (0 if profitable)
 * - daily_buffer = how much more can be lost before hitting the limit
 * 
 * @param account - Current account state
 * @param rules - Drawdown rules
 * @returns Daily buffer calculation results
 * 
 * @example
 * const account = { start_balance_usd: 100000, today_pnl_usd: -2000, ... };
 * const rules = { daily_limit: { kind: 'percent', value: 5 }, ... };
 * calcDailyBufferUsd(account, rules);
 * // => { daily_limit_usd: 5000, daily_used_usd: 2000, daily_buffer_usd: 3000, daily_buffer_pct: 60 }
 */
export function calcDailyBufferUsd(
  account: AccountState,
  rules: RuleSet
): DailyBufferResult {
  // Convert limit to USD
  const daily_limit_usd = limitToUsd(rules.daily_limit, account.start_balance_usd);
  
  // Daily used = absolute value of losses today (0 if positive P&L)
  // If today_pnl is positive (profit), used is 0
  // If today_pnl is negative (loss), used is the absolute value
  const daily_used_usd = Math.max(0, -account.today_pnl_usd);
  
  // Buffer = limit minus what's used (clamped to 0)
  const daily_buffer_usd = Math.max(0, daily_limit_usd - daily_used_usd);
  
  // Calculate percentage of buffer remaining
  const daily_buffer_pct = clamp(
    safePercentage(daily_buffer_usd, daily_limit_usd),
    0,
    100
  );
  
  return {
    daily_limit_usd,
    daily_used_usd,
    daily_buffer_usd,
    daily_buffer_pct,
  };
}

/**
 * Calculates the maximum drawdown buffer
 * 
 * Max drawdown tracks total losses from the starting balance (or high water mark).
 * - For static DD: floor = start_balance - max_limit
 * - For trailing DD with HWM: floor = high_water_mark - max_limit
 * 
 * @param account - Current account state
 * @param rules - Drawdown rules
 * @returns Max buffer calculation results
 * 
 * @example
 * // Static drawdown: 10% of $100,000 = $10,000 limit
 * // Floor = $100,000 - $10,000 = $90,000
 * // If current balance = $95,000, buffer = $5,000 (50%)
 */
export function calcMaxBufferUsd(
  account: AccountState,
  rules: RuleSet
): MaxBufferResult {
  // Convert limit to USD
  const max_limit_usd = limitToUsd(rules.max_limit, account.start_balance_usd);
  
  // Determine which basis to use
  // Use equity if specified AND available, otherwise fall back to balance
  let basisValue: number;
  let basisUsed: DrawdownBasis;
  
  if (rules.basis === 'equity' && account.current_equity_usd !== undefined) {
    basisValue = account.current_equity_usd;
    basisUsed = 'equity';
  } else {
    basisValue = account.current_balance_usd;
    basisUsed = 'balance';
  }
  
  // Calculate floor and buffer based on trailing status
  let max_floor_usd: number;
  let max_buffer_usd: number;
  let isApproxTrailing = false;
  
  if (rules.isTrailing) {
    if (account.trail_high_watermark_usd !== undefined) {
      // Trailing with known HWM: floor trails from high water mark
      max_floor_usd = account.trail_high_watermark_usd - max_limit_usd;
      max_buffer_usd = Math.max(0, basisValue - max_floor_usd);
      isApproxTrailing = false;
    } else {
      // Trailing but HWM unknown: use static calculation but flag as approximate
      // This is a fallback - in practice, user should provide HWM for trailing accounts
      max_floor_usd = account.start_balance_usd - max_limit_usd;
      max_buffer_usd = Math.max(0, basisValue - max_floor_usd);
      isApproxTrailing = true;
    }
  } else {
    // Static (non-trailing): floor is fixed from start balance
    max_floor_usd = account.start_balance_usd - max_limit_usd;
    max_buffer_usd = Math.max(0, basisValue - max_floor_usd);
  }
  
  // Calculate percentage of buffer remaining
  const max_buffer_pct = clamp(
    safePercentage(max_buffer_usd, max_limit_usd),
    0,
    100
  );
  
  return {
    max_limit_usd,
    max_floor_usd,
    max_buffer_usd,
    max_buffer_pct,
    basisUsed,
    isApproxTrailing,
  };
}

/**
 * Determines the health status based on a buffer percentage
 */
function getStatusFromPct(pct: number): HealthStatus {
  if (pct < DANGER_THRESHOLD_PCT) {
    return 'danger';
  }
  if (pct < WARNING_THRESHOLD_PCT) {
    return 'warning';
  }
  return 'safe';
}

/**
 * Combines two health statuses, returning the worse one
 */
function worstStatus(a: HealthStatus, b: HealthStatus): HealthStatus {
  const priority: Record<HealthStatus, number> = {
    danger: 0,
    warning: 1,
    safe: 2,
  };
  return priority[a] < priority[b] ? a : b;
}

/**
 * Calculates the overall account health
 * 
 * Combines daily and max drawdown buffers to determine:
 * - 'danger': Either buffer is below 15%
 * - 'warning': Either buffer is below 30%
 * - 'safe': Both buffers are above 30%
 * 
 * @param account - Current account state
 * @param rules - Drawdown rules
 * @returns Complete health assessment
 * 
 * @example
 * const health = calcAccountHealth(account, rules);
 * if (health.status === 'danger') {
 *   alert('Stop trading! Account at risk of breach.');
 * }
 */
export function calcAccountHealth(
  account: AccountState,
  rules: RuleSet
): AccountHealthResult {
  // Calculate both buffers
  const daily = calcDailyBufferUsd(account, rules);
  const max = calcMaxBufferUsd(account, rules);
  
  // Determine status from each metric
  const dailyStatus = getStatusFromPct(daily.daily_buffer_pct);
  const maxStatus = getStatusFromPct(max.max_buffer_pct);
  
  // Overall status is the worst of the two
  const status = worstStatus(dailyStatus, maxStatus);
  
  // Generate human-readable messages
  const messages: string[] = [];
  
  // Daily buffer messages
  if (daily.daily_buffer_pct < DANGER_THRESHOLD_PCT) {
    messages.push(
      `⛔ DANGER: Daily drawdown at ${(100 - daily.daily_buffer_pct).toFixed(1)}% used. ` +
      `Only $${daily.daily_buffer_usd.toFixed(0)} remaining.`
    );
  } else if (daily.daily_buffer_pct < WARNING_THRESHOLD_PCT) {
    messages.push(
      `⚠️ WARNING: Daily drawdown at ${(100 - daily.daily_buffer_pct).toFixed(1)}% used. ` +
      `$${daily.daily_buffer_usd.toFixed(0)} remaining.`
    );
  }
  
  // Max buffer messages
  if (max.max_buffer_pct < DANGER_THRESHOLD_PCT) {
    messages.push(
      `⛔ DANGER: Max drawdown at ${(100 - max.max_buffer_pct).toFixed(1)}% used. ` +
      `Only $${max.max_buffer_usd.toFixed(0)} above floor.`
    );
  } else if (max.max_buffer_pct < WARNING_THRESHOLD_PCT) {
    messages.push(
      `⚠️ WARNING: Max drawdown at ${(100 - max.max_buffer_pct).toFixed(1)}% used. ` +
      `$${max.max_buffer_usd.toFixed(0)} above floor.`
    );
  }
  
  // Trailing approximation warning
  if (max.isApproxTrailing) {
    messages.push(
      `ℹ️ NOTE: Trailing drawdown enabled but high water mark unknown. ` +
      `Buffer shown is approximate based on start balance.`
    );
  }
  
  // Basis fallback notice
  if (rules.basis === 'equity' && max.basisUsed === 'balance') {
    messages.push(
      `ℹ️ NOTE: Equity basis requested but not available. Using balance instead.`
    );
  }
  
  // Safe message
  if (status === 'safe') {
    messages.push(
      `✅ Account is healthy. Daily buffer: ${daily.daily_buffer_pct.toFixed(1)}%, ` +
      `Max buffer: ${max.max_buffer_pct.toFixed(1)}%`
    );
  }
  
  return {
    status,
    daily,
    max,
    messages,
  };
}

// =============================================================================
// TRADE SIMULATION
// =============================================================================

/**
 * Result of simulating a potential trade
 */
export interface TradeSimulationResult {
  /** Whether the trade would be safe, risky, or cause a violation */
  verdict: 'safe' | 'risky' | 'violation';
  
  /** Health result if the trade loses */
  afterLoss: AccountHealthResult;
  
  /** Human-readable explanation */
  message: string;
}

/**
 * Simulates the impact of a potential losing trade
 * 
 * @param account - Current account state
 * @param rules - Drawdown rules  
 * @param riskUsd - Amount at risk (potential loss) in USD
 * @returns Simulation result showing impact if trade loses
 */
export function simulateTrade(
  account: AccountState,
  rules: RuleSet,
  riskUsd: number
): TradeSimulationResult {
  validatePositiveNumber(riskUsd, 'riskUsd');
  
  // Create hypothetical account state after losing the trade
  const hypotheticalAccount: AccountState = {
    ...account,
    current_balance_usd: account.current_balance_usd - riskUsd,
    today_pnl_usd: account.today_pnl_usd - riskUsd,
  };
  
  // If equity is tracked, also reduce it
  if (account.current_equity_usd !== undefined) {
    hypotheticalAccount.current_equity_usd = account.current_equity_usd - riskUsd;
  }
  
  // Calculate health after the hypothetical loss
  const afterLoss = calcAccountHealth(hypotheticalAccount, rules);
  
  // Determine verdict
  let verdict: 'safe' | 'risky' | 'violation';
  let message: string;
  
  // Check for violations (buffer goes to 0 or negative)
  const wouldBreachDaily = afterLoss.daily.daily_buffer_usd <= 0;
  const wouldBreachMax = afterLoss.max.max_buffer_usd <= 0;
  
  if (wouldBreachDaily || wouldBreachMax) {
    verdict = 'violation';
    if (wouldBreachDaily && wouldBreachMax) {
      message = `This trade would BREACH both daily and max drawdown limits.`;
    } else if (wouldBreachDaily) {
      message = `This trade would BREACH your daily drawdown limit.`;
    } else {
      message = `This trade would BREACH your max drawdown limit.`;
    }
  } else if (afterLoss.status === 'danger') {
    verdict = 'risky';
    message = `This trade would put your account in DANGER zone (buffer < ${DANGER_THRESHOLD_PCT}%).`;
  } else if (afterLoss.status === 'warning') {
    verdict = 'risky';
    message = `This trade would put your account in WARNING zone (buffer < ${WARNING_THRESHOLD_PCT}%).`;
  } else {
    verdict = 'safe';
    message = `This trade is within safe limits.`;
  }
  
  return {
    verdict,
    afterLoss,
    message,
  };
}

// =============================================================================
// FACTORY FUNCTIONS (CONVENIENCE)
// =============================================================================

/**
 * Creates a percent-based DrawdownLimit
 */
export function percentLimit(value: number): DrawdownLimit {
  return { kind: 'percent', value };
}

/**
 * Creates a USD-based DrawdownLimit
 */
export function usdLimit(value: number): DrawdownLimit {
  return { kind: 'usd', value };
}

/**
 * Creates a standard RuleSet with common defaults
 */
export function createRuleSet(options: {
  dailyLimitPct?: number;
  dailyLimitUsd?: number;
  maxLimitPct?: number;
  maxLimitUsd?: number;
  basis?: DrawdownBasis;
  isTrailing?: boolean;
}): RuleSet {
  const daily_limit: DrawdownLimit = options.dailyLimitUsd !== undefined
    ? usdLimit(options.dailyLimitUsd)
    : percentLimit(options.dailyLimitPct ?? 5);
    
  const max_limit: DrawdownLimit = options.maxLimitUsd !== undefined
    ? usdLimit(options.maxLimitUsd)
    : percentLimit(options.maxLimitPct ?? 10);
  
  return {
    daily_limit,
    max_limit,
    basis: options.basis ?? 'balance',
    isTrailing: options.isTrailing ?? false,
  };
}
