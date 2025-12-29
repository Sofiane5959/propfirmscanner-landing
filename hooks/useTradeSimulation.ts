/**
 * =============================================================================
 * USE TRADE SIMULATION HOOK
 * =============================================================================
 * 
 * React hook for simulating trades from the frontend.
 * 
 * @module hooks/useTradeSimulation
 * 
 * @example
 * const { simulate, result, isLoading, error } = useTradeSimulation();
 * 
 * const handleSimulate = async () => {
 *   await simulate(accountId, 500);
 *   if (result?.simulation.classification === 'VIOLATION') {
 *     alert('This trade would breach your limits!');
 *   }
 * };
 */

'use client';

import { useState, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Metrics from the simulation
 */
interface SimulationMetrics {
  risk_usd: number;
  daily_buffer_usd: number;
  max_buffer_usd: number;
  daily_usage_pct: number;
  max_usage_pct: number;
  daily_buffer_usage_pct: number;
  max_buffer_usage_pct: number;
}

/**
 * Full simulation result from API
 */
interface SimulationResult {
  classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  reasons: string[];
  metrics: SimulationMetrics;
  userMessage: string;
  isValid: boolean;
  validationError?: string;
}

/**
 * Account info returned with simulation
 */
interface AccountInfo {
  id: string;
  prop_firm: string;
  program: string;
  current_balance_usd: number;
}

/**
 * Recommendations from the API
 */
interface Recommendations {
  max_safe_risk: number;
  max_risk_before_violation: number;
}

/**
 * Complete data returned from simulation API
 */
export interface SimulationData {
  simulation: SimulationResult;
  account: AccountInfo;
  recommendations: Recommendations;
}

/**
 * Return type for the hook
 */
interface UseTradeSimulationReturn {
  /** Run a simulation */
  simulate: (accountId: string, riskUsd: number) => Promise<SimulationData | null>;
  
  /** Last simulation result */
  result: SimulationData | null;
  
  /** Loading state */
  isLoading: boolean;
  
  /** Error message if any */
  error: string | null;
  
  /** Clear the current result */
  clear: () => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useTradeSimulation(): UseTradeSimulationReturn {
  const [result, setResult] = useState<SimulationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(async (
    accountId: string,
    riskUsd: number
  ): Promise<SimulationData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: accountId, risk_usd: riskUsd }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setError(json.error || 'Simulation failed');
        setResult(null);
        return null;
      }

      setResult(json.data);
      return json.data;

    } catch (err) {
      setError('Network error. Please try again.');
      setResult(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    simulate,
    result,
    isLoading,
    error,
    clear,
  };
}
