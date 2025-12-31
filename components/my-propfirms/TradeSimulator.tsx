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

  const getResultStyle = () => {
    if (!result) return {};
    return {
      SAFE: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        icon: CheckCircle,
      },
      RISKY: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
        icon: AlertTriangle,
      },
      VIOLATION: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        icon: XCircle,
      },
    }[result.classification];
  };

  const resultStyle = getResultStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Can I take this trade?</h2>
            <p className="text-sm text-gray-500">{account.prop_firm}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
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
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg placeholder-gray-600 focus:outline-none focus:border-emerald-500"
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
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors mb-4"
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
        {result && resultStyle && (
          <div className={`p-4 rounded-lg border ${resultStyle.bg} ${resultStyle.border}`}>
            <div className="flex items-start gap-3">
              <resultStyle.icon className={`w-6 h-6 flex-shrink-0 ${resultStyle.text}`} />
              <div>
                <p className={`font-semibold mb-1 ${resultStyle.text}`}>
                  {result.classification}
                </p>
                <p className="text-sm text-gray-300">{result.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
