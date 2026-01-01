'use client';

import { useState } from 'react';
import { Play, Loader2, CheckCircle, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface AccountHealth {
  status: 'safe' | 'warning' | 'danger';
  daily: {
    daily_buffer_usd: number;
  };
  max: {
    max_buffer_usd: number;
  };
}

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  stage: string;
  health: AccountHealth;
}

interface SimulationTabProps {
  accounts: Account[];
}

type SimResult = {
  classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  message: string;
  dailyUsagePct: number;
};

// =============================================================================
// COMPONENT
// =============================================================================

export function SimulationTab({ accounts }: SimulationTabProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [riskAmount, setRiskAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  const handleSimulate = async () => {
    if (!selectedAccount) return;
    const risk = parseFloat(riskAmount);
    if (isNaN(risk) || risk <= 0) return;

    setIsSimulating(true);
    setResult(null);

    // Calculate
    const dailyBuffer = selectedAccount.health.daily.daily_buffer_usd;
    const dailyUsagePct = (risk / dailyBuffer) * 100;

    let classification: 'SAFE' | 'RISKY' | 'VIOLATION';
    let message: string;

    if (risk >= dailyBuffer) {
      classification = 'VIOLATION';
      message = 'This trade could violate your daily drawdown limit. Do not take this trade on this account.';
    } else if (dailyUsagePct > 70) {
      classification = 'RISKY';
      message = `Warning: this trade would use ${Math.round(dailyUsagePct)}% of your daily drawdown. Consider reducing position size.`;
    } else {
      classification = 'SAFE';
      message = `This trade would use ${Math.round(dailyUsagePct)}% of your daily limit. You are within safe limits.`;
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setResult({ classification, message, dailyUsagePct });
    setIsSimulating(false);
  };

  const getResultConfig = (classification: 'SAFE' | 'RISKY' | 'VIOLATION') => ({
    SAFE: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', Icon: CheckCircle },
    RISKY: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', Icon: AlertTriangle },
    VIOLATION: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', Icon: XCircle },
  }[classification]);

  if (accounts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">Add an account to start simulating trades</p>
        <a
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl"
        >
          + Add Account
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Trade Simulation</h2>
        <p className="text-sm text-gray-500 mb-6">Test if a trade is safe before you take it</p>

        {/* Account Selector */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Select Account</label>
          <div className="relative">
            <select
              value={selectedAccountId}
              onChange={(e) => {
                setSelectedAccountId(e.target.value);
                setResult(null);
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:border-emerald-500"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.prop_firm} — {account.program} ({account.stage})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Account Context */}
        {selectedAccount && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Daily buffer remaining:</span>
              <span className="text-white font-medium">
                ${Math.round(selectedAccount.health.daily.daily_buffer_usd).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Total DD remaining:</span>
              <span className="text-white font-medium">
                ${Math.round(selectedAccount.health.max.max_buffer_usd).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Risk Input */}
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
          />
        </div>

        {/* Quick Amounts */}
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
          disabled={isSimulating || !riskAmount || !selectedAccount}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Check This Trade
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${getResultConfig(result.classification).bg} ${getResultConfig(result.classification).border}`}>
            <div className="flex items-start gap-3">
              {(() => {
                const config = getResultConfig(result.classification);
                return <config.Icon className={`w-6 h-6 flex-shrink-0 ${config.text}`} />;
              })()}
              <div>
                <p className={`font-semibold mb-1 ${getResultConfig(result.classification).text}`}>
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
