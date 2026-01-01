'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Loader2, CheckCircle, AlertTriangle, XCircle, ChevronDown, Sparkles, Plus } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  health: {
    status: 'safe' | 'warning' | 'danger';
    daily: {
      daily_buffer_usd: number;
      daily_limit_usd: number;
    };
    max: {
      max_buffer_usd: number;
    };
  };
}

interface SimulationTabProps {
  accounts: Account[];
  isDemo?: boolean;
}

type SimResult = {
  classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  message: string;
  details: string;
};

// =============================================================================
// COMPONENT
// =============================================================================

export function SimulationTab({ accounts, isDemo = false }: SimulationTabProps) {
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
    const maxBuffer = selectedAccount.health.max.max_buffer_usd;
    const dailyUsagePct = (risk / dailyBuffer) * 100;

    await new Promise(resolve => setTimeout(resolve, 400));

    let classification: 'SAFE' | 'RISKY' | 'VIOLATION';
    let message: string;
    let details: string;

    if (risk >= dailyBuffer) {
      classification = 'VIOLATION';
      message = 'This trade could violate your daily drawdown limit.';
      details = `Your daily buffer is $${Math.round(dailyBuffer)}. This trade risks $${Math.round(risk)}, which would breach your limit. Do not take this trade.`;
    } else if (risk >= maxBuffer) {
      classification = 'VIOLATION';
      message = 'This trade could breach your maximum drawdown.';
      details = `Your total DD remaining is $${Math.round(maxBuffer)}. This trade risks $${Math.round(risk)}, which could end your account.`;
    } else if (dailyUsagePct > 70) {
      classification = 'RISKY';
      message = `Warning: this trade uses ${Math.round(dailyUsagePct)}% of your daily drawdown.`;
      details = `You have $${Math.round(dailyBuffer)} left today. After this trade, you'd only have $${Math.round(dailyBuffer - risk)} buffer remaining. Consider reducing position size.`;
    } else if (dailyUsagePct > 50) {
      classification = 'RISKY';
      message = `This trade uses ${Math.round(dailyUsagePct)}% of your daily limit.`;
      details = `Acceptable but aggressive. You'd have $${Math.round(dailyBuffer - risk)} remaining after this trade.`;
    } else {
      classification = 'SAFE';
      message = `This trade uses ${Math.round(dailyUsagePct)}% of your daily limit.`;
      details = `You are within safe limits. After this trade, you'd still have $${Math.round(dailyBuffer - risk)} daily buffer and $${Math.round(maxBuffer - risk)} total DD remaining.`;
    }

    setResult({ classification, message, details });
    setIsSimulating(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Demo indicator */}
      {isDemo && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <p className="text-sm text-yellow-400">
            Simulating on demo account. Add your own for real data.
          </p>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Trade Simulation</h2>
        <p className="text-sm text-gray-500 mb-6">
          Test if a trade is safe before you risk real money.
        </p>

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
                  {account.prop_firm} — {account.program} {isDemo ? '(Demo)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Account Status Preview */}
        {selectedAccount && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Daily buffer remaining</span>
              <span className="text-white font-medium">
                ${Math.round(selectedAccount.health.daily.daily_buffer_usd)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total DD remaining</span>
              <span className="text-white font-medium">
                ${Math.round(selectedAccount.health.max.max_buffer_usd)}
              </span>
            </div>
          </div>
        )}

        {/* Risk Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Risk if stopped out (USD)</label>
          <input
            type="number"
            value={riskAmount}
            onChange={(e) => {
              setRiskAmount(e.target.value);
              setResult(null);
            }}
            placeholder="e.g. 500"
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
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Simulate This Trade
            </>
          )}
        </button>

        {/* Result */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${
            result.classification === 'SAFE'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : result.classification === 'RISKY'
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {result.classification === 'SAFE' && <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />}
              {result.classification === 'RISKY' && <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />}
              {result.classification === 'VIOLATION' && <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />}
              <div>
                <p className={`font-semibold mb-1 ${
                  result.classification === 'SAFE' ? 'text-emerald-400' :
                  result.classification === 'RISKY' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {result.classification}
                </p>
                <p className="text-white text-sm mb-2">{result.message}</p>
                <p className="text-gray-400 text-sm">{result.details}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA for Demo Mode */}
      {isDemo && (
        <div className="mt-6 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Add your real account to simulate trades with your actual data.
          </p>
          <Link
            href="/dashboard/accounts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your Account
          </Link>
        </div>
      )}
    </div>
  );
}
