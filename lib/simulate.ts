/**
 * =============================================================================
 * TRADE SIMULATION MODULE
 * =============================================================================
 * 
 * Simulates the impact of a potential trade on prop firm compliance.
 * Uses the risk module for underlying calculations.
 * 
 * @module lib/simulate
 * @version 1.0.0
 */

import {
  type AccountState,
  type RuleSet,
  calcDailyBufferUsd,
  calcMaxBufferUsd,
  limitToUsd,
} from './risk';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Classification of trade risk level
 */
export type TradeClassification = 'SAFE' | 'RISKY' | 'VIOLATION';

/**
 * Metrics calculated for the simulation
 */
export interface SimulationMetrics {
  /** The risk amount being simulated */
  risk_usd: number;
  
  /** Current daily buffer before the trade */
  daily_buffer_usd: number;
  
  /** Current max buffer before the trade */
  max_buffer_usd: number;
  
  /** What percentage of daily LIMIT this trade would use */
  daily_usage_pct: number;
  
  /** What percentage of max LIMIT this trade would use */
  max_usage_pct: number;
  
  /** What percentage of daily BUFFER this trade would consume */
  daily_buffer_usage_pct: number;
  
  /** What percentage of max BUFFER this trade would consume */
  max_buffer_usage_pct: number;
}

/**
 * Complete simulation result
 */
export interface SimulationResult {
  /** Overall classification */
  classification: TradeClassification;
  
  /** Array of reasons explaining the classification */
  reasons: string[];
  
  /** Calculated metrics */
  metrics: SimulationMetrics;
  
  /** Human-friendly message for UI display */
  userMessage: string;
  
  /** Whether the input was valid */
  isValid: boolean;
  
  /** Validation error message if any */
  validationError?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Threshold for RISKY classification (70% of smallest buffer) */
const RISKY_THRESHOLD = 0.7;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Safely calculates percentage, handling zero denominators
 */
function safePercent(numerator: number, denominator: number): number {
  if (denominator <= 0 || !Number.isFinite(denominator)) {
    return numerator > 0 ? 100 : 0;
  }
  return (numerator / denominator) * 100;
}

/**
 * Formats a number as USD for display
 */
function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })}`;
}

/**
 * Formats a percentage for display
 */
function formatPct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

// =============================================================================
// MAIN SIMULATION FUNCTION
// =============================================================================

/**
 * Simulates the impact of a potential trade on account compliance
 * 
 * @param account - Current account state
 * @param rules - Drawdown rules for the account
 * @param risk_usd - Potential loss if stop-loss hits
 * @returns Complete simulation result with classification and metrics
 * 
 * @example
 * const result = simulateTrade(account, rules, 500);
 * if (result.classification === 'VIOLATION') {
 *   alert(result.userMessage);
 * }
 */
export function simulateTrade(
  account: AccountState,
  rules: RuleSet,
  risk_usd: number
): SimulationResult {
  // -------------------------------------------------------------------------
  // Input validation
  // -------------------------------------------------------------------------
  
  if (!Number.isFinite(risk_usd)) {
    return createInvalidResult('Risk amount must be a valid number.');
  }
  
  if (risk_usd <= 0) {
    return createInvalidResult('Risk amount must be greater than 0.');
  }
  
  // -------------------------------------------------------------------------
  // Calculate current buffers
  // -------------------------------------------------------------------------
  
  const dailyResult = calcDailyBufferUsd(account, rules);
  const maxResult = calcMaxBufferUsd(account, rules);
  
  const daily_buffer_usd = dailyResult.daily_buffer_usd;
  const max_buffer_usd = maxResult.max_buffer_usd;
  
  // Get limits in USD for percentage calculations
  const daily_limit_usd = limitToUsd(rules.daily_limit, account.start_balance_usd);
  const max_limit_usd = limitToUsd(rules.max_limit, account.start_balance_usd);
  
  // -------------------------------------------------------------------------
  // Calculate metrics
  // -------------------------------------------------------------------------
  
  const metrics: SimulationMetrics = {
    risk_usd,
    daily_buffer_usd,
    max_buffer_usd,
    // Percentage of total LIMIT this trade represents
    daily_usage_pct: safePercent(risk_usd, daily_limit_usd),
    max_usage_pct: safePercent(risk_usd, max_limit_usd),
    // Percentage of remaining BUFFER this trade would consume
    daily_buffer_usage_pct: safePercent(risk_usd, daily_buffer_usd),
    max_buffer_usage_pct: safePercent(risk_usd, max_buffer_usd),
  };
  
  // -------------------------------------------------------------------------
  // Determine classification
  // -------------------------------------------------------------------------
  
  const reasons: string[] = [];
  let classification: TradeClassification;
  let userMessage: string;
  
  // Check for VIOLATION first
  const wouldViolateDaily = risk_usd > daily_buffer_usd;
  const wouldViolateMax = risk_usd > max_buffer_usd;
  
  if (wouldViolateDaily || wouldViolateMax) {
    classification = 'VIOLATION';
    
    if (wouldViolateDaily && wouldViolateMax) {
      reasons.push('Trade exceeds both daily and max drawdown buffers.');
      reasons.push(`Risk (${formatUsd(risk_usd)}) > Daily buffer (${formatUsd(daily_buffer_usd)})`);
      reasons.push(`Risk (${formatUsd(risk_usd)}) > Max buffer (${formatUsd(max_buffer_usd)})`);
      userMessage = `⛔ This trade could violate BOTH your daily and max drawdown limits on this account.`;
    } else if (wouldViolateDaily) {
      reasons.push('Trade exceeds daily drawdown buffer.');
      reasons.push(`Risk (${formatUsd(risk_usd)}) > Daily buffer (${formatUsd(daily_buffer_usd)})`);
      userMessage = `⛔ This trade could violate your daily drawdown limit. ` +
        `You only have ${formatUsd(daily_buffer_usd)} daily buffer remaining.`;
    } else {
      reasons.push('Trade exceeds max drawdown buffer.');
      reasons.push(`Risk (${formatUsd(risk_usd)}) > Max buffer (${formatUsd(max_buffer_usd)})`);
      userMessage = `⛔ This trade could violate your max drawdown limit. ` +
        `You only have ${formatUsd(max_buffer_usd)} max buffer remaining.`;
    }
  }
  // Check for RISKY
  else {
    const smallestBuffer = Math.min(daily_buffer_usd, max_buffer_usd);
    const riskyThreshold = RISKY_THRESHOLD * smallestBuffer;
    
    if (risk_usd > riskyThreshold) {
      classification = 'RISKY';
      
      // Determine which buffer is more concerning
      if (daily_buffer_usd <= max_buffer_usd) {
        reasons.push(`Trade uses ${formatPct(metrics.daily_buffer_usage_pct)} of remaining daily buffer.`);
        userMessage = `⚠️ Warning: This trade would use ${formatPct(metrics.daily_buffer_usage_pct)} ` +
          `of your remaining daily buffer (${formatUsd(daily_buffer_usd)}).`;
      } else {
        reasons.push(`Trade uses ${formatPct(metrics.max_buffer_usage_pct)} of remaining max buffer.`);
        userMessage = `⚠️ Warning: This trade would use ${formatPct(metrics.max_buffer_usage_pct)} ` +
          `of your remaining max buffer (${formatUsd(max_buffer_usd)}).`;
      }
      
      reasons.push(`Risk (${formatUsd(risk_usd)}) > 70% of smallest buffer (${formatUsd(smallestBuffer)})`);
    }
    // Otherwise SAFE
    else {
      classification = 'SAFE';
      
      reasons.push(`Trade is within safe limits.`);
      reasons.push(`Uses ${formatPct(metrics.daily_usage_pct)} of daily limit.`);
      reasons.push(`Uses ${formatPct(metrics.max_usage_pct)} of max limit.`);
      
      userMessage = `✅ If stopped out, this trade would use ${formatPct(metrics.daily_usage_pct)} ` +
        `of your daily limit and ${formatPct(metrics.max_usage_pct)} of your max limit.`;
    }
  }
  
  // -------------------------------------------------------------------------
  // Add buffer warnings for edge cases
  // -------------------------------------------------------------------------
  
  // Warn if buffers are already low
  if (daily_buffer_usd === 0) {
    reasons.push('⚠️ Daily buffer is already depleted!');
  }
  if (max_buffer_usd === 0) {
    reasons.push('⚠️ Max buffer is already depleted!');
  }
  
  // Warn about trailing DD approximation
  if (maxResult.isApproxTrailing) {
    reasons.push('ℹ️ Max buffer is approximate (trailing DD without high water mark).');
  }
  
  return {
    classification,
    reasons,
    metrics,
    userMessage,
    isValid: true,
  };
}

/**
 * Creates an invalid result for validation errors
 */
function createInvalidResult(errorMessage: string): SimulationResult {
  return {
    classification: 'SAFE',
    reasons: [errorMessage],
    metrics: {
      risk_usd: 0,
      daily_buffer_usd: 0,
      max_buffer_usd: 0,
      daily_usage_pct: 0,
      max_usage_pct: 0,
      daily_buffer_usage_pct: 0,
      max_buffer_usage_pct: 0,
    },
    userMessage: errorMessage,
    isValid: false,
    validationError: errorMessage,
  };
}

// =============================================================================
// QUICK SIMULATION (CONVENIENCE)
// =============================================================================

/**
 * Quick check if a trade would be safe
 */
export function isTradeRiskSafe(
  account: AccountState,
  rules: RuleSet,
  risk_usd: number
): boolean {
  const result = simulateTrade(account, rules, risk_usd);
  return result.classification === 'SAFE';
}

/**
 * Quick check if a trade would cause a violation
 */
export function wouldTradeViolate(
  account: AccountState,
  rules: RuleSet,
  risk_usd: number
): boolean {
  const result = simulateTrade(account, rules, risk_usd);
  return result.classification === 'VIOLATION';
}

/**
 * Calculate the maximum safe risk amount
 * Returns the largest risk that would still be classified as SAFE
 */
export function calculateMaxSafeRisk(
  account: AccountState,
  rules: RuleSet
): number {
  const dailyResult = calcDailyBufferUsd(account, rules);
  const maxResult = calcMaxBufferUsd(account, rules);
  
  const smallestBuffer = Math.min(
    dailyResult.daily_buffer_usd,
    maxResult.max_buffer_usd
  );
  
  // Max safe risk is 70% of smallest buffer (below RISKY threshold)
  return Math.max(0, smallestBuffer * RISKY_THRESHOLD);
}

/**
 * Calculate the absolute maximum risk (before violation)
 * Returns the largest risk that would NOT cause a violation
 */
export function calculateMaxRiskBeforeViolation(
  account: AccountState,
  rules: RuleSet
): number {
  const dailyResult = calcDailyBufferUsd(account, rules);
  const maxResult = calcMaxBufferUsd(account, rules);
  
  // Cannot risk more than the smaller of the two buffers
  return Math.max(0, Math.min(
    dailyResult.daily_buffer_usd,
    maxResult.max_buffer_usd
  ));
}
