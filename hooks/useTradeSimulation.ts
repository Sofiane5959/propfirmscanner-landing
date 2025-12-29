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
 *   if (result?.classification === 'VIOLATION') {
 *     alert('This trade would breach your limits!');
 *   }
 * };
 */

'use client';

import { useState, useCallback } from 'react';
import type { SimulationResult } from '@/lib/simulate';

// =============================================================================
// TYPES
// =============================================================================

interface SimulationData {
  simulation: SimulationResult;
  account: {
    id: string;
    prop_firm: string;
    program: string;
    current_balance_usd: number;
  };
  recommendations: {
    max_safe_risk: number;
    max_risk_before_violation: number;
  };
}

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

// =============================================================================
// EXAMPLE COMPONENT USAGE
// =============================================================================

/**
 * Example component showing how to use the hook
 */
export function TradeSimulatorExample() {
  const { simulate, result, isLoading, error } = useTradeSimulation();
  const [accountId, setAccountId] = useState('');
  const [riskAmount, setRiskAmount] = useState('');

  const handleSimulate = async () => {
    const risk = parseFloat(riskAmount);
    if (!accountId || isNaN(risk)) return;
    
    await simulate(accountId, risk);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Account ID</label>
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter account ID"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Risk Amount ($)</label>
        <input
          type="number"
          value={riskAmount}
          onChange={(e) => setRiskAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="500"
        />
      </div>

      <button
        onClick={handleSimulate}
        disabled={isLoading}
        className="w-full py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Simulating...' : 'Simulate Trade'}
      </button>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className={`p-4 rounded ${
          result.simulation.classification === 'SAFE' ? 'bg-green-100' :
          result.simulation.classification === 'RISKY' ? 'bg-yellow-100' :
          'bg-red-100'
        }`}>
          <h3 className="font-bold text-lg mb-2">
            {result.simulation.classification}
          </h3>
          <p>{result.simulation.userMessage}</p>
          
          <div className="mt-3 text-sm">
            <p>Daily buffer: ${result.simulation.metrics.daily_buffer_usd.toLocaleString()}</p>
            <p>Max buffer: ${result.simulation.metrics.max_buffer_usd.toLocaleString()}</p>
            <p>Max safe risk: ${result.recommendations.max_safe_risk.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
