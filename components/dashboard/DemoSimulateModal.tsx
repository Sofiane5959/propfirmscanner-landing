'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calculator,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DemoBadge } from './DemoBadge';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/demo-data';

interface DemoSimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRealAccount: () => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type SimulationResult = {
  status: 'safe' | 'warning' | 'danger';
  canTrade: boolean;
  message: string;
  dailyRemaining: number;
  maxRemaining: number;
};

function simulateTrade(account: DemoAccount, riskAmount: number): SimulationResult {
  const dailyRemaining = account.health.daily.daily_buffer_usd - riskAmount;
  const maxRemaining = account.health.max.max_buffer_usd - riskAmount;
  
  if (riskAmount > account.health.daily.daily_buffer_usd) {
    return {
      status: 'danger',
      canTrade: false,
      message: `⛔ VIOLATION: This trade risks ${formatCurrency(riskAmount)}, but your daily buffer is only ${formatCurrency(account.health.daily.daily_buffer_usd)}. Taking this trade would breach your daily drawdown limit.`,
      dailyRemaining: Math.max(0, dailyRemaining),
      maxRemaining: Math.max(0, maxRemaining),
    };
  }
  
  if (riskAmount > account.health.max.max_buffer_usd) {
    return {
      status: 'danger',
      canTrade: false,
      message: `⛔ VIOLATION: This trade risks ${formatCurrency(riskAmount)}, but your max drawdown buffer is only ${formatCurrency(account.health.max.max_buffer_usd)}. Taking this trade would breach your maximum drawdown.`,
      dailyRemaining: Math.max(0, dailyRemaining),
      maxRemaining: Math.max(0, maxRemaining),
    };
  }
  
  if (dailyRemaining < account.health.daily.daily_limit_usd * 0.2) {
    return {
      status: 'warning',
      canTrade: true,
      message: `⚠️ RISKY: You can take this trade, but it leaves only ${formatCurrency(dailyRemaining)} daily buffer. Consider reducing position size or waiting for a better setup.`,
      dailyRemaining,
      maxRemaining,
    };
  }
  
  let message = `✅ SAFE: This trade is within your risk limits. After a full loss, you would still have ${formatCurrency(dailyRemaining)} daily buffer remaining.`;
  
  if (account.max_dd_type !== 'static') {
    message += ` Note: This account has trailing drawdown.`;
  }
  
  return {
    status: 'safe',
    canTrade: true,
    message,
    dailyRemaining,
    maxRemaining,
  };
}

export function DemoSimulateModal({ isOpen, onClose, onAddRealAccount }: DemoSimulateModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(DEMO_ACCOUNTS[0].id);
  const [riskAmount, setRiskAmount] = useState('500');
  const [result, setResult] = useState<SimulationResult | null>(null);

  const selectedAccount = DEMO_ACCOUNTS.find(a => a.id === selectedAccountId)!;

  useEffect(() => {
    const amount = parseFloat(riskAmount) || 0;
    if (amount > 0 && selectedAccount) {
      setResult(simulateTrade(selectedAccount, amount));
    } else {
      setResult(null);
    }
  }, [selectedAccount, riskAmount]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const presetAmounts = [100, 250, 500, 1000, 2000];

  const ResultIcon = result ? {
    safe: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle,
  }[result.status] : null;

  const resultStyles = result ? {
    safe: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', iconColor: 'text-yellow-400' },
    danger: { bg: 'bg-red-500/10', border: 'border-red-500/30', iconColor: 'text-red-400' },
  }[result.status] : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-700 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Calculator className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                Trade Simulator
                <DemoBadge />
              </h2>
              <p className="text-sm text-gray-400">Test if a trade is safe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Account Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Demo Account
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedAccountId === account.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <p className="font-medium text-white text-sm truncate">
                    {account.prop_firm}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {formatCurrency(account.account_size)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Risk Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Risk Amount (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="number"
                value={riskAmount}
                onChange={(e) => setRiskAmount(e.target.value)}
                placeholder="Enter risk amount"
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setRiskAmount(amount.toString())}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    riskAmount === amount.toString()
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && resultStyles && ResultIcon && (
            <div className={`p-4 rounded-xl border ${resultStyles.bg} ${resultStyles.border}`}>
              <div className="flex items-start gap-3">
                <ResultIcon className={`w-5 h-5 ${resultStyles.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-200 leading-relaxed">
                    {result.message}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-700/50">
                    <div>
                      <p className="text-xs text-gray-500">Daily buffer after</p>
                      <p className={`font-semibold ${
                        result.dailyRemaining <= 0 ? 'text-red-400' : 
                        result.dailyRemaining < 500 ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {formatCurrency(result.dailyRemaining)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Max DD buffer after</p>
                      <p className={`font-semibold ${
                        result.maxRemaining <= 0 ? 'text-red-400' : 
                        result.maxRemaining < 1000 ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {formatCurrency(result.maxRemaining)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA to add real account */}
          <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-lg flex-shrink-0">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  Want to simulate on your real accounts?
                </p>
                <p className="text-xs text-gray-400">
                  Add your prop firm and get personalized risk analysis
                </p>
              </div>
              <button
                onClick={onAddRealAccount}
                className="flex items-center gap-1 px-3 py-1.5 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Add Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
