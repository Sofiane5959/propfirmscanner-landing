'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  ChevronDown,
  TrendingDown,
  Newspaper,
  Moon,
  BarChart3,
  Sparkles,
  Plus
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  stage: string;
  account_size: number;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  min_trading_days: number;
  current_trading_days: number;
  profit_target_percent: number;
  current_profit_percent: number;
  health: {
    status: 'safe' | 'warning' | 'danger';
    daily: {
      daily_buffer_pct: number;
    };
    max: {
      max_buffer_pct: number;
    };
  };
}

interface ProgressRulesTabProps {
  accounts: Account[];
  isDemo?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getCommonPitfalls(account: Account): string[] {
  const pitfalls: string[] = [];

  if (account.max_dd_type !== 'static') {
    pitfalls.push('Scaling too fast on trailing drawdown — your floor rises with profits');
    pitfalls.push('Not accounting for trailing floor after a winning streak');
  }

  if (!account.allows_news) {
    pitfalls.push('Trading during restricted news windows can void your account');
  }

  if (!account.allows_weekend) {
    pitfalls.push('Forgetting to close positions before Friday market close');
  }

  if (account.min_trading_days > 0) {
    pitfalls.push('Assuming profits count before minimum trading days are met');
    pitfalls.push('Rushing trades just to meet day requirements');
  }

  if (account.has_consistency) {
    pitfalls.push('Making one big win that exceeds consistency limits');
  }

  pitfalls.push('Over-leveraging after a winning streak');
  pitfalls.push('Revenge trading after a loss');

  return pitfalls.slice(0, 5);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProgressRulesTab({ accounts, isDemo = false }: ProgressRulesTabProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  if (!selectedAccount) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">No accounts to display</p>
      </div>
    );
  }

  const pitfalls = getCommonPitfalls(selectedAccount);
  const profitProgress = selectedAccount.profit_target_percent > 0
    ? Math.max(0, Math.min(100, (selectedAccount.current_profit_percent / selectedAccount.profit_target_percent) * 100))
    : 0;
  const daysProgress = selectedAccount.min_trading_days > 0
    ? Math.min(100, (selectedAccount.current_trading_days / selectedAccount.min_trading_days) * 100)
    : 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Account Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm text-gray-400">Select Account</label>
          {isDemo && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg">
              <Sparkles className="w-3 h-3" />
              Demo
            </span>
          )}
        </div>
        <div className="relative">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white appearance-none focus:outline-none focus:border-emerald-500"
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

      {/* Progress Section */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          Evaluation Progress
        </h2>

        {/* Profit Target */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Profit Target</span>
            <span className={`font-medium ${
              selectedAccount.current_profit_percent >= selectedAccount.profit_target_percent
                ? 'text-emerald-400'
                : 'text-white'
            }`}>
              {selectedAccount.current_profit_percent.toFixed(1)}% / {selectedAccount.profit_target_percent}%
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                profitProgress >= 100 ? 'bg-emerald-500' :
                profitProgress >= 50 ? 'bg-yellow-500' : 'bg-gray-600'
              }`}
              style={{ width: `${Math.max(0, profitProgress)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {selectedAccount.profit_target_percent > 0
              ? `${formatUSD(selectedAccount.account_size * selectedAccount.profit_target_percent / 100)} profit needed`
              : 'No profit target'
            }
          </p>
        </div>

        {/* Trading Days */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Trading Days
            </span>
            <span className={`font-medium ${
              selectedAccount.current_trading_days >= selectedAccount.min_trading_days
                ? 'text-emerald-400'
                : 'text-white'
            }`}>
              {selectedAccount.current_trading_days} / {selectedAccount.min_trading_days || '—'}
              {selectedAccount.current_trading_days >= selectedAccount.min_trading_days && ' ✓'}
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                daysProgress >= 100 ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
              style={{ width: `${daysProgress}%` }}
            />
          </div>
          {selectedAccount.min_trading_days > 0 && selectedAccount.current_trading_days < selectedAccount.min_trading_days && (
            <p className="text-xs text-yellow-400 mt-1">
              {selectedAccount.min_trading_days - selectedAccount.current_trading_days} more day{selectedAccount.min_trading_days - selectedAccount.current_trading_days > 1 ? 's' : ''} needed
            </p>
          )}
        </div>
      </div>

      {/* Key Rules */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Key Rules</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Daily DD */}
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Daily Drawdown</p>
            <p className="text-lg font-semibold text-white">{selectedAccount.daily_dd_percent}%</p>
            <p className="text-xs text-gray-500">{formatUSD(selectedAccount.account_size * selectedAccount.daily_dd_percent / 100)}</p>
          </div>

          {/* Max DD */}
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Max Drawdown</p>
            <p className={`text-lg font-semibold ${
              selectedAccount.max_dd_type === 'static' ? 'text-white' : 'text-purple-400'
            }`}>
              {selectedAccount.max_dd_percent}%
            </p>
            <p className="text-xs text-gray-500">
              {selectedAccount.max_dd_type === 'static' ? 'Static' : 'Trailing'}
            </p>
          </div>

          {/* News Trading */}
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Newspaper className="w-3 h-3" />
              News Trading
            </p>
            <p className={`text-lg font-semibold ${
              selectedAccount.allows_news ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {selectedAccount.allows_news ? 'Allowed' : 'Restricted'}
            </p>
          </div>

          {/* Weekend Holding */}
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Moon className="w-3 h-3" />
              Weekend Holding
            </p>
            <p className={`text-lg font-semibold ${
              selectedAccount.allows_weekend ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {selectedAccount.allows_weekend ? 'Allowed' : 'Not Allowed'}
            </p>
          </div>

          {/* Consistency Rule */}
          {selectedAccount.has_consistency && (
            <div className="bg-gray-800 rounded-lg p-3 col-span-2">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Consistency Rule
              </p>
              <p className="text-lg font-semibold text-cyan-400">Active</p>
              <p className="text-xs text-gray-500">No single day can exceed 30-40% of total profit</p>
            </div>
          )}

          {/* Trailing DD Info */}
          {selectedAccount.max_dd_type !== 'static' && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 col-span-2">
              <p className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Trailing Drawdown Active
              </p>
              <p className="text-sm text-purple-300">
                Your drawdown floor rises with your profits. Be careful after winning streaks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Common Pitfalls */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Common Pitfalls
        </h2>
        
        <div className="space-y-2">
          {pitfalls.map((pitfall, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
            >
              <span className="text-yellow-500 mt-0.5">•</span>
              <p className="text-sm text-yellow-300">{pitfall}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA for Demo Mode */}
      {isDemo && (
        <div className="mt-6 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Track your real evaluation progress with your own accounts.
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
