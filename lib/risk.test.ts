/**
 * =============================================================================
 * PROP FIRM RISK CALCULATION MODULE - TESTS
 * =============================================================================
 * 
 * Comprehensive unit tests for the risk calculation engine.
 * Run with: npx vitest run lib/risk.test.ts
 * Or watch: npx vitest lib/risk.test.ts
 * 
 * @module lib/risk.test
 */

import { describe, it, expect } from 'vitest';
import {
  // Types
  type AccountState,
  type RuleSet,
  type DrawdownLimit,
  
  // Functions
  limitToUsd,
  calcDailyBufferUsd,
  calcMaxBufferUsd,
  calcAccountHealth,
  simulateTrade,
  
  // Factory functions
  percentLimit,
  usdLimit,
  createRuleSet,
} from './risk';

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Standard $100K account for testing
 */
const baseAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 100_000,
  today_pnl_usd: 0,
};

/**
 * Standard rules: 5% daily, 10% max, balance-based, non-trailing
 */
const standardRules: RuleSet = {
  daily_limit: percentLimit(5),
  max_limit: percentLimit(10),
  basis: 'balance',
  isTrailing: false,
};

// =============================================================================
// limitToUsd() TESTS
// =============================================================================

describe('limitToUsd()', () => {
  describe('percent limits', () => {
    it('should convert 5% of $100,000 to $5,000', () => {
      const limit: DrawdownLimit = { kind: 'percent', value: 5 };
      expect(limitToUsd(limit, 100_000)).toBe(5_000);
    });

    it('should convert 10% of $50,000 to $5,000', () => {
      const limit: DrawdownLimit = { kind: 'percent', value: 10 };
      expect(limitToUsd(limit, 50_000)).toBe(5_000);
    });

    it('should handle decimal percentages', () => {
      const limit: DrawdownLimit = { kind: 'percent', value: 4.5 };
      expect(limitToUsd(limit, 100_000)).toBe(4_500);
    });

    it('should return 0 for 0%', () => {
      const limit: DrawdownLimit = { kind: 'percent', value: 0 };
      expect(limitToUsd(limit, 100_000)).toBe(0);
    });
  });

  describe('USD limits', () => {
    it('should return the USD value directly', () => {
      const limit: DrawdownLimit = { kind: 'usd', value: 3_000 };
      expect(limitToUsd(limit, 100_000)).toBe(3_000);
    });

    it('should ignore start balance for USD limits', () => {
      const limit: DrawdownLimit = { kind: 'usd', value: 5_000 };
      expect(limitToUsd(limit, 50_000)).toBe(5_000);
      expect(limitToUsd(limit, 200_000)).toBe(5_000);
    });
  });

  describe('edge cases', () => {
    it('should throw for negative limit values', () => {
      const limit: DrawdownLimit = { kind: 'percent', value: -5 };
      expect(() => limitToUsd(limit, 100_000)).toThrow();
    });

    it('should throw for negative start balance', () => {
      const limit: DrawdownLimit = { kind: 'percent', value: 5 };
      expect(() => limitToUsd(limit, -100_000)).toThrow();
    });
  });
});

// =============================================================================
// calcDailyBufferUsd() TESTS
// =============================================================================

describe('calcDailyBufferUsd()', () => {
  describe('with percent limits', () => {
    it('should calculate full buffer when no losses today', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: 0,
      };
      
      const result = calcDailyBufferUsd(account, standardRules);
      
      expect(result.daily_limit_usd).toBe(5_000);
      expect(result.daily_used_usd).toBe(0);
      expect(result.daily_buffer_usd).toBe(5_000);
      expect(result.daily_buffer_pct).toBe(100);
    });

    it('should calculate partial buffer after losses', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -2_000, // Lost $2,000 today
      };
      
      const result = calcDailyBufferUsd(account, standardRules);
      
      expect(result.daily_limit_usd).toBe(5_000);
      expect(result.daily_used_usd).toBe(2_000);
      expect(result.daily_buffer_usd).toBe(3_000);
      expect(result.daily_buffer_pct).toBe(60);
    });

    it('should return zero buffer when limit exceeded', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -6_000, // Lost more than 5% limit
      };
      
      const result = calcDailyBufferUsd(account, standardRules);
      
      expect(result.daily_limit_usd).toBe(5_000);
      expect(result.daily_used_usd).toBe(6_000);
      expect(result.daily_buffer_usd).toBe(0); // Clamped to 0
      expect(result.daily_buffer_pct).toBe(0);
    });
  });

  describe('with USD limits', () => {
    it('should use fixed USD amount regardless of balance', () => {
      const rules: RuleSet = {
        ...standardRules,
        daily_limit: usdLimit(3_000),
      };
      
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -1_000,
      };
      
      const result = calcDailyBufferUsd(account, rules);
      
      expect(result.daily_limit_usd).toBe(3_000);
      expect(result.daily_used_usd).toBe(1_000);
      expect(result.daily_buffer_usd).toBe(2_000);
      expect(result.daily_buffer_pct).toBeCloseTo(66.67, 1);
    });
  });

  describe('with positive P&L (profits)', () => {
    it('should show full buffer when profitable', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: 2_500, // Made $2,500 profit
      };
      
      const result = calcDailyBufferUsd(account, standardRules);
      
      expect(result.daily_used_usd).toBe(0); // No daily limit used
      expect(result.daily_buffer_usd).toBe(5_000);
      expect(result.daily_buffer_pct).toBe(100);
    });
  });
});

// =============================================================================
// calcMaxBufferUsd() TESTS
// =============================================================================

describe('calcMaxBufferUsd()', () => {
  describe('static drawdown (non-trailing)', () => {
    it('should calculate buffer from start balance', () => {
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 95_000, // Down $5,000 from start
      };
      
      const result = calcMaxBufferUsd(account, standardRules);
      
      expect(result.max_limit_usd).toBe(10_000);
      expect(result.max_floor_usd).toBe(90_000);
      expect(result.max_buffer_usd).toBe(5_000);
      expect(result.max_buffer_pct).toBe(50);
      expect(result.isApproxTrailing).toBe(false);
    });

    it('should show full buffer at start balance', () => {
      const result = calcMaxBufferUsd(baseAccount, standardRules);
      
      expect(result.max_buffer_usd).toBe(10_000);
      expect(result.max_buffer_pct).toBe(100);
    });

    it('should show zero buffer at floor', () => {
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 90_000, // At the floor
      };
      
      const result = calcMaxBufferUsd(account, standardRules);
      
      expect(result.max_buffer_usd).toBe(0);
      expect(result.max_buffer_pct).toBe(0);
    });
  });

  describe('trailing drawdown with HWM', () => {
    it('should calculate buffer from high water mark', () => {
      const rules: RuleSet = {
        ...standardRules,
        isTrailing: true,
      };
      
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 105_000,
        trail_high_watermark_usd: 110_000, // Previously reached $110K
      };
      
      const result = calcMaxBufferUsd(account, rules);
      
      // Floor = HWM - limit = $110,000 - $10,000 = $100,000
      expect(result.max_floor_usd).toBe(100_000);
      // Buffer = current - floor = $105,000 - $100,000 = $5,000
      expect(result.max_buffer_usd).toBe(5_000);
      expect(result.max_buffer_pct).toBe(50);
      expect(result.isApproxTrailing).toBe(false);
    });
  });

  describe('trailing drawdown without HWM (approximate)', () => {
    it('should fall back to start balance and flag as approximate', () => {
      const rules: RuleSet = {
        ...standardRules,
        isTrailing: true,
      };
      
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 95_000,
        // No trail_high_watermark_usd provided
      };
      
      const result = calcMaxBufferUsd(account, rules);
      
      // Falls back to static calculation
      expect(result.max_floor_usd).toBe(90_000);
      expect(result.max_buffer_usd).toBe(5_000);
      expect(result.isApproxTrailing).toBe(true); // Flagged as approximate
    });
  });

  describe('equity basis', () => {
    it('should use equity when available and requested', () => {
      const rules: RuleSet = {
        ...standardRules,
        basis: 'equity',
      };
      
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 95_000,
        current_equity_usd: 93_000, // Equity lower due to floating loss
      };
      
      const result = calcMaxBufferUsd(account, rules);
      
      // Buffer based on equity, not balance
      // Floor = $90,000, Equity = $93,000, Buffer = $3,000
      expect(result.max_buffer_usd).toBe(3_000);
      expect(result.basisUsed).toBe('equity');
    });

    it('should fall back to balance when equity not available', () => {
      const rules: RuleSet = {
        ...standardRules,
        basis: 'equity',
      };
      
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 95_000,
        // No current_equity_usd provided
      };
      
      const result = calcMaxBufferUsd(account, rules);
      
      // Falls back to balance
      expect(result.max_buffer_usd).toBe(5_000);
      expect(result.basisUsed).toBe('balance');
    });
  });

  describe('with USD limits', () => {
    it('should use fixed USD limit', () => {
      const rules: RuleSet = {
        ...standardRules,
        max_limit: usdLimit(8_000),
      };
      
      const account: AccountState = {
        ...baseAccount,
        current_balance_usd: 96_000,
      };
      
      const result = calcMaxBufferUsd(account, rules);
      
      expect(result.max_limit_usd).toBe(8_000);
      expect(result.max_floor_usd).toBe(92_000);
      expect(result.max_buffer_usd).toBe(4_000);
      expect(result.max_buffer_pct).toBe(50);
    });
  });
});

// =============================================================================
// calcAccountHealth() TESTS
// =============================================================================

describe('calcAccountHealth()', () => {
  describe('status determination', () => {
    it('should return "safe" when both buffers above 30%', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -1_000, // 20% daily used
        current_balance_usd: 95_000, // 50% max used
      };
      
      const result = calcAccountHealth(account, standardRules);
      
      expect(result.status).toBe('safe');
      expect(result.daily.daily_buffer_pct).toBe(80);
      expect(result.max.max_buffer_pct).toBe(50);
    });

    it('should return "warning" when any buffer below 30%', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -3_750, // 75% daily used = 25% buffer
        current_balance_usd: 100_000,
      };
      
      const result = calcAccountHealth(account, standardRules);
      
      expect(result.status).toBe('warning');
      expect(result.daily.daily_buffer_pct).toBe(25);
    });

    it('should return "danger" when any buffer below 15%', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -4_500, // 90% daily used = 10% buffer
        current_balance_usd: 100_000,
      };
      
      const result = calcAccountHealth(account, standardRules);
      
      expect(result.status).toBe('danger');
      expect(result.daily.daily_buffer_pct).toBe(10);
    });

    it('should use worst status between daily and max', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: 0, // Daily is fine (100%)
        current_balance_usd: 91_000, // Max at 10% buffer (danger)
      };
      
      const result = calcAccountHealth(account, standardRules);
      
      expect(result.status).toBe('danger');
      expect(result.daily.daily_buffer_pct).toBe(100);
      expect(result.max.max_buffer_pct).toBe(10);
    });
  });

  describe('messages', () => {
    it('should include danger message when in danger', () => {
      const account: AccountState = {
        ...baseAccount,
        today_pnl_usd: -4_800,
      };
      
      const result = calcAccountHealth(account, standardRules);
      
      expect(result.messages.some(m => m.includes('DANGER'))).toBe(true);
    });

    it('should include approximate trailing warning when HWM missing', () => {
      const rules: RuleSet = {
        ...standardRules,
        isTrailing: true,
      };
      
      const result = calcAccountHealth(baseAccount, rules);
      
      expect(result.messages.some(m => m.includes('approximate'))).toBe(true);
    });

    it('should note equity fallback when requested but unavailable', () => {
      const rules: RuleSet = {
        ...standardRules,
        basis: 'equity',
      };
      
      const result = calcAccountHealth(baseAccount, rules);
      
      expect(result.messages.some(m => m.includes('Using balance instead'))).toBe(true);
    });
  });
});

// =============================================================================
// simulateTrade() TESTS
// =============================================================================

describe('simulateTrade()', () => {
  it('should return "safe" for small risk', () => {
    const result = simulateTrade(baseAccount, standardRules, 500);
    
    expect(result.verdict).toBe('safe');
    expect(result.afterLoss.daily.daily_buffer_pct).toBe(90);
  });

  it('should return "risky" when trade would cause warning', () => {
    const result = simulateTrade(baseAccount, standardRules, 4_000);
    
    expect(result.verdict).toBe('risky');
    expect(result.afterLoss.status).toBe('warning');
  });

  it('should return "violation" when trade would breach daily', () => {
    const result = simulateTrade(baseAccount, standardRules, 5_500);
    
    expect(result.verdict).toBe('violation');
    expect(result.message).toContain('daily drawdown limit');
  });

  it('should return "violation" when trade would breach max', () => {
    const account: AccountState = {
      ...baseAccount,
      current_balance_usd: 91_000, // Already close to max floor
    };
    
    const result = simulateTrade(account, standardRules, 2_000);
    
    expect(result.verdict).toBe('violation');
    expect(result.message).toContain('max drawdown limit');
  });

  it('should handle trade on already-losing day', () => {
    const account: AccountState = {
      ...baseAccount,
      today_pnl_usd: -2_000, // Already lost $2,000 today
    };
    
    // Risk another $2,000 = total $4,000 daily loss (80% used)
    const result = simulateTrade(account, standardRules, 2_000);
    
    expect(result.afterLoss.daily.daily_used_usd).toBe(4_000);
    expect(result.afterLoss.daily.daily_buffer_pct).toBe(20);
    expect(result.verdict).toBe('risky');
  });
});

// =============================================================================
// FACTORY FUNCTION TESTS
// =============================================================================

describe('factory functions', () => {
  describe('createRuleSet()', () => {
    it('should create rules with percent limits', () => {
      const rules = createRuleSet({
        dailyLimitPct: 3,
        maxLimitPct: 6,
      });
      
      expect(rules.daily_limit).toEqual({ kind: 'percent', value: 3 });
      expect(rules.max_limit).toEqual({ kind: 'percent', value: 6 });
    });

    it('should create rules with USD limits', () => {
      const rules = createRuleSet({
        dailyLimitUsd: 2_500,
        maxLimitUsd: 5_000,
      });
      
      expect(rules.daily_limit).toEqual({ kind: 'usd', value: 2_500 });
      expect(rules.max_limit).toEqual({ kind: 'usd', value: 5_000 });
    });

    it('should use defaults when not specified', () => {
      const rules = createRuleSet({});
      
      expect(rules.daily_limit).toEqual({ kind: 'percent', value: 5 });
      expect(rules.max_limit).toEqual({ kind: 'percent', value: 10 });
      expect(rules.basis).toBe('balance');
      expect(rules.isTrailing).toBe(false);
    });

    it('should allow equity basis and trailing', () => {
      const rules = createRuleSet({
        basis: 'equity',
        isTrailing: true,
      });
      
      expect(rules.basis).toBe('equity');
      expect(rules.isTrailing).toBe(true);
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('integration scenarios', () => {
  it('should handle FTMO-style account ($100K, 5% daily, 10% max)', () => {
    const account: AccountState = {
      start_balance_usd: 100_000,
      current_balance_usd: 98_500,
      today_pnl_usd: -1_500,
    };
    
    const rules = createRuleSet({
      dailyLimitPct: 5,
      maxLimitPct: 10,
    });
    
    const health = calcAccountHealth(account, rules);
    
    expect(health.daily.daily_buffer_usd).toBe(3_500);
    expect(health.max.max_buffer_usd).toBe(8_500);
    expect(health.status).toBe('safe');
  });

  it('should handle futures account with trailing DD (MFF style)', () => {
    const account: AccountState = {
      start_balance_usd: 50_000,
      current_balance_usd: 52_000,
      today_pnl_usd: 500,
      trail_high_watermark_usd: 54_000,
    };
    
    const rules = createRuleSet({
      dailyLimitPct: 0, // No daily limit (would need special handling)
      maxLimitPct: 4,
      isTrailing: true,
    });
    
    // Override daily limit to simulate "no daily limit"
    rules.daily_limit = usdLimit(50_000); // Very high = effectively no limit
    
    const health = calcAccountHealth(account, rules);
    
    // Max floor = $54,000 - $2,000 = $52,000
    // Buffer = $52,000 - $52,000 = $0 (at the floor!)
    expect(health.max.max_floor_usd).toBe(52_000);
    expect(health.max.max_buffer_usd).toBe(0);
    expect(health.status).toBe('danger');
  });

  it('should handle equity-based account with floating P&L', () => {
    const account: AccountState = {
      start_balance_usd: 100_000,
      current_balance_usd: 101_000,
      current_equity_usd: 99_000, // Floating loss of $2,000
      today_pnl_usd: 1_000,
    };
    
    const rules = createRuleSet({
      dailyLimitPct: 5,
      maxLimitPct: 10,
      basis: 'equity',
    });
    
    const health = calcAccountHealth(account, rules);
    
    // Max should use equity ($99K), not balance ($101K)
    expect(health.max.basisUsed).toBe('equity');
    expect(health.max.max_buffer_usd).toBe(9_000);
  });
});
