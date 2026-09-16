'use client';

import { useState } from 'react';
import { X, Play, Loader2, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface Account {
  id: string;
  prop_firm: string;
  health: {
    daily: { daily_buffer_usd: number };
    max: { max_buffer_usd: number };
  };
}

interface QuickSimulateModalProps {
  account: Account;
  onClose: () => void;
  isDemo?: boolean;
}

export function QuickSimulateModal({ account, onClose, isDemo = false }: QuickSimulateModalProps) {
  const [riskAmount, setRiskAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<{ classification: 'SAFE' | 'RISKY' | 'VIOLATION'; message: string } | null>(null);

  const handleSimulate = async () => {
    const risk = parseFloat(riskAmount);
    if (isNaN(risk) || risk <= 0) return;

    setIsSimulating(true);
    setResult(null);

    const dailyBuffer = account.health.daily.daily_buffer_usd;
    const dailyUsagePct = (risk / dailyBuffer) * 100;

    let classification: 'SAFE' | 'RISKY' | 'VIOLATION';
    let message: string;

    if (risk >= dailyBuffer) {
      classification = 'VIOLATION';
      message = 'This trade could violate your daily drawdown limit. Do not take this trade.';
    } else if (dailyUsagePct > 70) {
      classification = 'RISKY';
      message = `Warning: this trade would use ${Math.round(dailyUsagePct)}% of your daily drawdown.`;
    } else {
      classification = 'SAFE';
      message = `This trade would use ${Math.round(dailyUsagePct)}% of your daily limit. You are within safe limits.`;
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setResult({ classification, message });
    setIsSimulating(false);
  };

  const ResultIcon = result?.classification === 'SAFE' ? CheckCircle : result?.classification === 'RISKY' ? AlertTriangle : XCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-bg-elevated rounded-xl border border-border w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Simulate Trade</h2>
            <p className="text-sm text-text-muted">{account.prop_firm}</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white hover:bg-dark-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-dark-700 rounded-lg text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Daily buffer:</span>
            <span className="text-white">${Math.round(account.health.daily.daily_buffer_usd).toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Risk if stopped out (USD)</label>
          <input
            type="number"
            value={riskAmount}
            onChange={(e) => { setRiskAmount(e.target.value); setResult(null); }}
            placeholder="Enter risk amount"
            className="w-full px-4 py-3 bg-dark-700 border border-border rounded-lg text-white text-lg placeholder-text-muted focus:outline-none focus:border-accent"
            autoFocus
          />
        </div>

        <div className="flex gap-2 mb-6">
          {[100, 250, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => { setRiskAmount(amt.toString()); setResult(null); }}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                riskAmount === amt.toString() ? 'bg-accent-hover text-white' : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating || !riskAmount}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent-hover hover:brightness-110 disabled:bg-dark-600 disabled:text-text-muted text-white font-medium rounded-lg transition-colors mb-4"
        >
          {isSimulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {isSimulating ? 'Checking...' : 'Check Trade'}
        </button>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.classification === 'SAFE' 
              ? 'bg-accent/10 border-accent/30' 
              : result.classification === 'RISKY'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-start gap-3">
              <ResultIcon className={`w-6 h-6 flex-shrink-0 ${
                result.classification === 'SAFE' ? 'text-accent' :
                result.classification === 'RISKY' ? 'text-yellow-400' : 'text-red-400'
              }`} />
              <div>
                <p className={`font-semibold mb-1 ${
                  result.classification === 'SAFE' ? 'text-accent' :
                  result.classification === 'RISKY' ? 'text-yellow-400' : 'text-red-400'
                }`}>{result.classification}</p>
                <p className="text-sm text-text-secondary">{result.message}</p>
                {isDemo && (
                  <p className="text-xs text-text-muted mt-2">Demo simulation — add your account for real data</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
