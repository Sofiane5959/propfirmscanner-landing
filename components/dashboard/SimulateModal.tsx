'use client';

import { useState, useEffect, Fragment } from 'react';
import { X, Play, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  current_balance: number;
  start_balance: number;
  daily_dd_percent: number;
  max_dd_percent: number;
}

interface SimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
}

interface SimulationResult {
  classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  reasons: string[];
  metrics: {
    risk_usd: number;
    daily_buffer_usd: number;
    max_buffer_usd: number;
    daily_usage_pct: number;
    max_usage_pct: number;
  };
  userMessage: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SimulateModal({ isOpen, onClose, account }: SimulateModalProps) {
  const [riskAmount, setRiskAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRiskAmount('');
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  const handleSimulate = async () => {
    const risk = parseFloat(riskAmount);
    
    if (isNaN(risk) || risk <= 0) {
      setError('Please enter a valid risk amount greater than 0');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: account.id,
          risk_usd: risk,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.paywall) {
          setError('Daily simulation limit reached. Upgrade to Pro for unlimited simulations.');
        } else {
          setError(data.error || 'Simulation failed');
        }
        return;
      }

      setResult(data.data.simulation);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getResultConfig = (classification: string) => {
    const configs = {
      SAFE: {
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        icon: CheckCircle,
      },
      RISKY: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: AlertTriangle,
      },
      VIOLATION: {
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: AlertCircle,
      },
    };
    return configs[classification as keyof typeof configs] || configs.SAFE;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-white">Simulate Trade</h2>
            <p className="text-sm text-gray-400">{account.prop_firm} - {account.program}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Account Info */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-900 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Current Balance</p>
              <p className="text-white font-semibold">
                ${account.current_balance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Daily DD Limit</p>
              <p className="text-white font-semibold">
                {account.daily_dd_percent}% (${((account.start_balance * account.daily_dd_percent) / 100).toLocaleString()})
              </p>
            </div>
          </div>

          {/* Risk Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Risk Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={riskAmount}
                onChange={(e) => setRiskAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the maximum amount you could lose if your stop-loss is hit
            </p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2">
            {[100, 250, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => setRiskAmount(amount.toString())}
                className="flex-1 py-2 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-xl border ${getResultConfig(result.classification).bg} ${getResultConfig(result.classification).border}`}>
              <div className="flex items-start gap-3">
                {(() => {
                  const config = getResultConfig(result.classification);
                  const Icon = config.icon;
                  return <Icon className={`w-6 h-6 ${config.text} flex-shrink-0 mt-0.5`} />;
                })()}
                <div className="flex-1">
                  <h3 className={`font-semibold ${getResultConfig(result.classification).text}`}>
                    {result.classification}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {result.userMessage}
                  </p>
                  
                  {/* Metrics */}
                  <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Daily usage:</span>
                      <span className="text-white ml-1">{result.metrics.daily_usage_pct.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max usage:</span>
                      <span className="text-white ml-1">{result.metrics.max_usage_pct.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Daily buffer:</span>
                      <span className="text-white ml-1">${result.metrics.daily_buffer_usd.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max buffer:</span>
                      <span className="text-white ml-1">${result.metrics.max_buffer_usd.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simulate Button */}
          <button
            onClick={handleSimulate}
            disabled={isLoading || !riskAmount}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Simulate Trade
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
