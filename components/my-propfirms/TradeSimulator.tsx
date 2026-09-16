'use client';

import { useState } from 'react';
import { X, Play, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  health: {
    daily: {
      daily_buffer_usd: number;
    };
    max: {
      max_buffer_usd: number;
    };
  };
}

interface TradeSimulatorProps {
  account: Account;
  onClose: () => void;
}

type SimulationResult = {
  classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  message: string;
};

// =============================================================================
// COMPONENT
// =============================================================================

export function TradeSimulator({ account, onClose }: TradeSimulatorProps) {
  const [riskAmount, setRiskAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    const risk = parseFloat(riskAmount);
    if (isNaN(risk) || risk <= 0) return;

    setIsSimulating(true);
    setResult(null);

    // Calculate locally first for instant feedback
    const dailyBuffer = account.health.daily.daily_buffer_usd;
    const dailyUsagePct = (risk / dailyBuffer) * 100;

    let classification: 'SAFE' | 'RISKY' | 'VIOLATION';
    let message: string;

    if (risk >= dailyBuffer) {
      classification = 'VIOLATION';
      message = 'This trade could violate your daily drawdown limit. Do not take this trade on this account.';
    } else if (dailyUsagePct > 70) {
      classification = 'RISKY';
      message = `Warning: this trade would use ${Math.round(dailyUsagePct)}% of your daily drawdown. Reduce position size.`;
    } else {
      classification = 'SAFE';
      message = `This trade would use ${Math.round(dailyUsagePct)}% of your daily limit. You are within safe limits.`;
    }

    // Simulate API delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Try API call (fallback to local calculation)
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: account.id, risk_usd: risk }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.simulation) {
          classification = data.data.simulation.classification;
          message = data.data.simulation.userMessage;
        }
      }
    } catch {
      // Use local calculation
    }

    setResult({ classification, message });
    setIsSimulating(false);
  };

  const getResultConfig = (classification: 'SAFE' | 'RISKY' | 'VIOLATION') => {
    const configs = {
      SAFE: {
        bg: 'bg-accent/10',
        border: 'border-accent/30',
        text: 'text-accent',
      },
      RISKY: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
      },
      VIOLATION: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
      },
    };
    return configs[classification];
  };

  const ResultIcon = ({ classification }: { classification: 'SAFE' | 'RISKY' | 'VIOLATION' }) => {
    const className = `w-6 h-6 flex-shrink-0 ${getResultConfig(classification).text}`;
    if (classification === 'SAFE') return <CheckCircle className={className} />;
    if (classification === 'RISKY') return <AlertTriangle className={className} />;
    return <XCircle className={className} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-elevated rounded-xl border border-border w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Can I take this trade?</h2>
            <p className="text-sm text-text-muted">{account.prop_firm}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white hover:bg-dark-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">
            Risk if stopped out (USD)
          </label>
          <input
            type="number"
            value={riskAmount}
            onChange={(e) => {
              setRiskAmount(e.target.value);
              setResult(null);
            }}
            placeholder="Enter risk amount"
            className="w-full px-4 py-3 bg-dark-700 border border-border rounded-lg text-white text-lg placeholder-text-muted focus:outline-none focus:border-accent"
            autoFocus
          />
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 mb-6">
          {[100, 250, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setRiskAmount(amt.toString());
                setResult(null);
              }}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                riskAmount === amt.toString()
                  ? 'bg-accent-hover text-white'
                  : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSimulate}
          disabled={isSimulating || !riskAmount}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent-hover hover:brightness-110 disabled:bg-dark-600 disabled:text-text-muted text-white font-medium rounded-lg transition-colors mb-4"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Check this trade
            </>
          )}
        </button>

        {/* Result — ONLY ONE OF THREE OUTPUTS */}
        {result && (
          <div className={`p-4 rounded-lg border ${getResultConfig(result.classification).bg} ${getResultConfig(result.classification).border}`}>
            <div className="flex items-start gap-3">
              <ResultIcon classification={result.classification} />
              <div>
                <p className={`font-semibold mb-1 ${getResultConfig(result.classification).text}`}>
                  {result.classification}
                </p>
                <p className="text-sm text-text-secondary">{result.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
