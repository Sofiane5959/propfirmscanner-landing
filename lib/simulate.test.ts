/**
 * =============================================================================
 * TRADE SIMULATION MODULE - TESTS
 * =============================================================================
 * 
 * Comprehensive unit tests for trade simulation logic.
 * Run with: npx vitest run lib/simulate.test.ts
 * 
 * @module lib/simulate.test
 */

import { describe, it, expect } from 'vitest';
import {
  simulateTrade,
  isTradeRiskSafe,
  wouldTradeViolate,
  calculateMaxSafeRisk,
  calculateMaxRiskBeforeViolation,
  type SimulationResult,
} from './simulate';
import {
  type AccountState,
  type RuleSet,
  percentLimit,
  usdLimit,
} from './risk';

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Standard $100K account with no losses today
 * Daily limit: 5% = $5,000
 * Max limit: 10% = $10,000
 */
const freshAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 100_000,
  today_pnl_usd: 0,
};

/**
 * Account that already has some daily losses
 * Daily buffer remaining: $3,000 (60% of $5,000)
 */
const partialLossAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 98_000,
  today_pnl_usd: -2_000, // Lost $2K today
};

/**
 * Account near daily limit
 * Daily buffer remaining: $500 (10% of $5,000)
 */
const nearDailyLimitAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 95_500,
  today_pnl_usd: -4_500, // Lost $4.5K today
};

/**
 * Account near max limit
 * Max buffer remaining: $1,000 (10% of $10,000)
 */
const nearMaxLimitAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 91_000, // $1K above floor
  today_pnl_usd: 0,
};

/**
 * Account with zero daily buffer (already at limit)
 */
const zeroDailyBufferAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 95_000,
  today_pnl_usd: -5_000, // Exactly at daily limit
};

/**
 * Account with zero max buffer (at the floor)
 */
const zeroMaxBufferAccount: AccountState = {
  start_balance_usd: 100_000,
  current_balance_usd: 90_000, // At the floor
  today_pnl_usd: 0,
};

/**
 * Standard rules: 5% daily, 10% max
 */
const standardRules: RuleSet = {
  daily_limit: percentLimit(5),
  max_limit: percentLimit(10),
  basis: 'balance',
  isTrailing: false,
};

/**
 * Rules with USD limits
 */
const usdRules: RuleSet = {
  daily_limit: usdLimit(3_000),
  max_limit: usdLimit(8_000),
  basis: 'balance',
  isTrailing: false,
};

// =============================================================================
// simulateTrade() - SAFE CLASSIFICATION TESTS
// =============================================================================

describe('simulateTrade() - SAFE classification', () => {
  it('should classify small risk as SAFE on fresh account', () => {
    const result = simulateTrade(freshAccount, standardRules, 500);
    
    expect(result.classification).toBe('SAFE');
    expect(result.isValid).toBe(true);
    expect(result.userMessage).toContain('✅');
    expect(result.metrics.risk_usd).toBe(500);
  });

  it('should show correct usage percentages for SAFE trade', () => {
    // $1,000 risk on $5,000 daily limit = 20% of daily limit
    // $1,000 risk on $10,000 max limit = 10% of max limit
    const result = simulateTrade(freshAccount, standardRules, 1_000);
    
    expect(result.classification).toBe('SAFE');
    expect(result.metrics.daily_usage_pct).toBeCloseTo(20, 1);
    expect(result.metrics.max_usage_pct).toBeCloseTo(10, 1);
  });

  it('should remain SAFE up to 70% of smallest buffer', () => {
    // Fresh account: smallest buffer is $5,000 (daily)
    // 70% of $5,000 = $3,500
    const result = simulateTrade(freshAccount, standardRules, 3_499);
    
    expect(result.classification).toBe('SAFE');
  });

  it('should include helpful user message for SAFE trades', () => {
    const result = simulateTrade(freshAccount, standardRules, 500);
    
    expect(result.userMessage).toContain('daily limit');
    expect(result.userMessage).toContain('max limit');
    expect(result.userMessage).toContain('%');
  });
});

// =============================================================================
// simulateTrade() - RISKY CLASSIFICATION TESTS
// =============================================================================

describe('simulateTrade() - RISKY classification', () => {
  it('should classify as RISKY when exceeding 70% of smallest buffer', () => {
    // Fresh account: smallest buffer is $5,000 (daily)
    // 70% of $5,000 = $3,500
    // $3,600 exceeds this threshold
    const result = simulateTrade(freshAccount, standardRules, 3_600);
    
    expect(result.classification).toBe('RISKY');
    expect(result.userMessage).toContain('⚠️');
    expect(result.userMessage).toContain('Warning');
  });

  it('should flag daily buffer when it is the constraint', () => {
    // Daily buffer ($5K) < Max buffer ($10K)
    // Risk $4,000 = 80% of daily buffer
    const result = simulateTrade(freshAccount, standardRules, 4_000);
    
    expect(result.classification).toBe('RISKY');
    expect(result.userMessage).toContain('daily buffer');
    expect(result.metrics.daily_buffer_usage_pct).toBe(80);
  });

  it('should flag max buffer when it is the constraint', () => {
    // Account near max limit: max buffer = $1,000
    // Daily buffer still has room
    // Risk $800 = 80% of max buffer (which is smaller)
    const result = simulateTrade(nearMaxLimitAccount, standardRules, 800);
    
    expect(result.classification).toBe('RISKY');
    expect(result.userMessage).toContain('max buffer');
  });

  it('should show buffer usage percentage in RISKY message', () => {
    const result = simulateTrade(freshAccount, standardRules, 4_000);
    
    expect(result.userMessage).toMatch(/\d+\.?\d*%/); // Contains percentage
    expect(result.metrics.daily_buffer_usage_pct).toBe(80);
  });
});

// =============================================================================
// simulateTrade() - VIOLATION CLASSIFICATION TESTS
// =============================================================================

describe('simulateTrade() - VIOLATION classification', () => {
  it('should classify as VIOLATION when exceeding daily buffer', () => {
    // Daily buffer = $5,000, risk = $5,500
    const result = simulateTrade(freshAccount, standardRules, 5_500);
    
    expect(result.classification).toBe('VIOLATION');
    expect(result.userMessage).toContain('⛔');
    expect(result.userMessage).toContain('daily drawdown');
  });

  it('should classify as VIOLATION when exceeding max buffer', () => {
    // Max buffer = $1,000, risk = $1,500
    const result = simulateTrade(nearMaxLimitAccount, standardRules, 1_500);
    
    expect(result.classification).toBe('VIOLATION');
    expect(result.userMessage).toContain('max drawdown');
  });

  it('should mention BOTH limits when exceeding both', () => {
    // Very large risk that exceeds everything
    const result = simulateTrade(freshAccount, standardRules, 15_000);
    
    expect(result.classification).toBe('VIOLATION');
    expect(result.userMessage).toContain('BOTH');
    expect(result.reasons.some(r => r.includes('daily'))).toBe(true);
    expect(result.reasons.some(r => r.includes('max'))).toBe(true);
  });

  it('should provide clear reasons for VIOLATION', () => {
    const result = simulateTrade(freshAccount, standardRules, 6_000);
    
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.some(r => r.includes('exceeds'))).toBe(true);
  });
});

// =============================================================================
// simulateTrade() - EDGE CASES
// =============================================================================

describe('simulateTrade() - Edge cases', () => {
  describe('risk <= 0', () => {
    it('should return invalid result for risk = 0', () => {
      const result = simulateTrade(freshAccount, standardRules, 0);
      
      expect(result.isValid).toBe(false);
      expect(result.validationError).toBeDefined();
      expect(result.userMessage).toContain('greater than 0');
    });

    it('should return invalid result for negative risk', () => {
      const result = simulateTrade(freshAccount, standardRules, -500);
      
      expect(result.isValid).toBe(false);
      expect(result.validationError).toBeDefined();
    });

    it('should return invalid result for NaN', () => {
      const result = simulateTrade(freshAccount, standardRules, NaN);
      
      expect(result.isValid).toBe(false);
      expect(result.validationError).toContain('valid number');
    });

    it('should return invalid result for Infinity', () => {
      const result = simulateTrade(freshAccount, standardRules, Infinity);
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('zero buffers', () => {
    it('should classify any positive risk as VIOLATION when daily buffer = 0', () => {
      const result = simulateTrade(zeroDailyBufferAccount, standardRules, 100);
      
      expect(result.classification).toBe('VIOLATION');
      expect(result.metrics.daily_buffer_usd).toBe(0);
      expect(result.reasons.some(r => r.includes('depleted'))).toBe(true);
    });

    it('should classify any positive risk as VIOLATION when max buffer = 0', () => {
      const result = simulateTrade(zeroMaxBufferAccount, standardRules, 100);
      
      expect(result.classification).toBe('VIOLATION');
      expect(result.metrics.max_buffer_usd).toBe(0);
    });

    it('should handle both buffers being zero', () => {
      const bothZeroAccount: AccountState = {
        start_balance_usd: 100_000,
        current_balance_usd: 90_000,
        today_pnl_usd: -5_000,
      };
      
      const result = simulateTrade(bothZeroAccount, standardRules, 100);
      
      expect(result.classification).toBe('VIOLATION');
    });
  });

  describe('exact boundary values', () => {
    it('should be SAFE at exactly 70% of buffer', () => {
      // 70% of $5,000 = $3,500
      const result = simulateTrade(freshAccount, standardRules, 3_500);
      
      expect(result.classification).toBe('SAFE');
    });

    it('should be RISKY just above 70% of buffer', () => {
      // Just over 70% of $5,000
      const result = simulateTrade(freshAccount, standardRules, 3_501);
      
      expect(result.classification).toBe('RISKY');
    });

    it('should be RISKY at exactly buffer amount', () => {
      // Exactly $5,000 (daily buffer)
      const result = simulateTrade(freshAccount, standardRules, 5_000);
      
      // At exactly the buffer, it's still technically safe but flagged as risky
      expect(result.classification).toBe('RISKY');
    });

    it('should be VIOLATION just above buffer', () => {
      // Just over $5,000
      const result = simulateTrade(freshAccount, standardRules, 5_001);
      
      expect(result.classification).toBe('VIOLATION');
    });
  });

  describe('USD limits', () => {
    it('should work correctly with USD-based limits', () => {
      // Daily limit: $3,000, Max limit: $8,000
      const result = simulateTrade(freshAccount, usdRules, 1_000);
      
      expect(result.classification).toBe('SAFE');
      expect(result.metrics.daily_usage_pct).toBeCloseTo(33.33, 1);
      expect(result.metrics.max_usage_pct).toBeCloseTo(12.5, 1);
    });

    it('should detect VIOLATION with USD limits', () => {
      // Daily limit: $3,000, Risk: $3,500
      const result = simulateTrade(freshAccount, usdRules, 3_500);
      
      expect(result.classification).toBe('VIOLATION');
    });
  });
});

// =============================================================================
// simulateTrade() - METRICS TESTS
// =============================================================================

describe('simulateTrade() - Metrics calculation', () => {
  it('should calculate all metrics correctly', () => {
    const result = simulateTrade(freshAccount, standardRules, 1_000);
    
    expect(result.metrics).toEqual({
      risk_usd: 1_000,
      daily_buffer_usd: 5_000,
      max_buffer_usd: 10_000,
      daily_usage_pct: 20,        // 1000/5000 * 100
      max_usage_pct: 10,          // 1000/10000 * 100
      daily_buffer_usage_pct: 20, // 1000/5000 * 100
      max_buffer_usage_pct: 10,   // 1000/10000 * 100
    });
  });

  it('should calculate correct buffer usage after partial losses', () => {
    // Already lost $2K today, daily buffer = $3,000
    const result = simulateTrade(partialLossAccount, standardRules, 1_500);
    
    expect(result.metrics.daily_buffer_usd).toBe(3_000);
    expect(result.metrics.daily_buffer_usage_pct).toBe(50); // 1500/3000 * 100
  });

  it('should handle 100% buffer usage calculation when buffer near zero', () => {
    // Near daily limit: $500 buffer remaining
    const result = simulateTrade(nearDailyLimitAccount, standardRules, 500);
    
    expect(result.metrics.daily_buffer_usd).toBe(500);
    expect(result.metrics.daily_buffer_usage_pct).toBe(100);
  });
});

// =============================================================================
// HELPER FUNCTION TESTS
// =============================================================================

describe('isTradeRiskSafe()', () => {
  it('should return true for safe trades', () => {
    expect(isTradeRiskSafe(freshAccount, standardRules, 500)).toBe(true);
  });

  it('should return false for risky trades', () => {
    expect(isTradeRiskSafe(freshAccount, standardRules, 4_000)).toBe(false);
  });

  it('should return false for violations', () => {
    expect(isTradeRiskSafe(freshAccount, standardRules, 6_000)).toBe(false);
  });
});

describe('wouldTradeViolate()', () => {
  it('should return false for safe trades', () => {
    expect(wouldTradeViolate(freshAccount, standardRules, 500)).toBe(false);
  });

  it('should return false for risky trades (risky != violation)', () => {
    expect(wouldTradeViolate(freshAccount, standardRules, 4_000)).toBe(false);
  });

  it('should return true for violations', () => {
    expect(wouldTradeViolate(freshAccount, standardRules, 6_000)).toBe(true);
  });
});

describe('calculateMaxSafeRisk()', () => {
  it('should return 70% of smallest buffer', () => {
    // Smallest buffer is daily = $5,000
    // 70% of $5,000 = $3,500
    const maxSafe = calculateMaxSafeRisk(freshAccount, standardRules);
    
    expect(maxSafe).toBe(3_500);
  });

  it('should consider max buffer when it is smaller', () => {
    // Max buffer = $1,000 (smaller than daily)
    // 70% of $1,000 = $700
    const maxSafe = calculateMaxSafeRisk(nearMaxLimitAccount, standardRules);
    
    expect(maxSafe).toBe(700);
  });

  it('should return 0 when buffers are depleted', () => {
    const maxSafe = calculateMaxSafeRisk(zeroDailyBufferAccount, standardRules);
    
    expect(maxSafe).toBe(0);
  });
});

describe('calculateMaxRiskBeforeViolation()', () => {
  it('should return the smallest buffer', () => {
    // Smallest buffer is daily = $5,000
    const maxRisk = calculateMaxRiskBeforeViolation(freshAccount, standardRules);
    
    expect(maxRisk).toBe(5_000);
  });

  it('should return max buffer when it is smaller', () => {
    // Max buffer = $1,000
    const maxRisk = calculateMaxRiskBeforeViolation(nearMaxLimitAccount, standardRules);
    
    expect(maxRisk).toBe(1_000);
  });

  it('should return 0 when any buffer is depleted', () => {
    const maxRisk = calculateMaxRiskBeforeViolation(zeroDailyBufferAccount, standardRules);
    
    expect(maxRisk).toBe(0);
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Integration scenarios', () => {
  it('should handle FTMO $100K account correctly', () => {
    const ftmoAccount: AccountState = {
      start_balance_usd: 100_000,
      current_balance_usd: 101_500,
      today_pnl_usd: -1_200,
    };
    
    const ftmoRules: RuleSet = {
      daily_limit: percentLimit(5),
      max_limit: percentLimit(10),
      basis: 'balance',
      isTrailing: false,
    };
    
    // Risk $2,000 on account with $3,800 daily buffer remaining
    const result = simulateTrade(ftmoAccount, ftmoRules, 2_000);
    
    expect(result.isValid).toBe(true);
    expect(result.metrics.daily_buffer_usd).toBe(3_800);
    expect(result.metrics.daily_buffer_usage_pct).toBeCloseTo(52.6, 1);
  });

  it('should handle funded account with trailing DD', () => {
    const trailingAccount: AccountState = {
      start_balance_usd: 50_000,
      current_balance_usd: 52_000,
      today_pnl_usd: 500,
      trail_high_watermark_usd: 54_000,
    };
    
    const trailingRules: RuleSet = {
      daily_limit: usdLimit(50_000), // No daily limit
      max_limit: percentLimit(4),    // $2,000 from start
      basis: 'balance',
      isTrailing: true,
    };
    
    // Max floor = $54,000 - $2,000 = $52,000
    // Current = $52,000, buffer = $0!
    const result = simulateTrade(trailingAccount, trailingRules, 100);
    
    expect(result.classification).toBe('VIOLATION');
    expect(result.metrics.max_buffer_usd).toBe(0);
  });

  it('should provide consistent results across multiple calls', () => {
    const results = Array.from({ length: 5 }, () => 
      simulateTrade(freshAccount, standardRules, 1_000)
    );
    
    // All results should be identical
    results.forEach(result => {
      expect(result.classification).toBe('SAFE');
      expect(result.metrics.daily_usage_pct).toBe(20);
    });
  });
});
