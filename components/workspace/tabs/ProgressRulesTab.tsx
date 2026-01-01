'use client';

import { useState } from 'react';
import { 
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingDown,
  Newspaper,
  Moon,
  BarChart3,
  Target
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface AccountHealth {
  status: 'safe' | 'warning' | 'danger';
  daily: {
    daily_buffer_usd: number;
    daily_buffer_pct: number;
  };
  max: {
    max_buffer_usd: number;
    max_buffer_pct: number;
  };
}

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
  health: AccountHealth;
}

interface ProgressRulesTabProps {
  accounts: Account[];
}

// =============================================================================
// HELPERS
// =============================================================================

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getCommonPitfalls(account: Account): string[] {
  const pitfalls: string[] = [];

  if (account.max_dd_type !== 'static') {
    pitfalls.push('Scaling too fast on trailing drawdown accounts');
    pitfalls.push('Not accounting for trailing floor after profits');
  }

  if (!account.allows_news) {
    pitfalls.push('Trading during restricted news windows');
  }

  if (!account.allows_weekend) {
    pitfalls.push('Forgetting to close positions before Friday');
  }

  if (account.min_trading_days > 0) {
    pitfalls.push('Assuming profits count before minimum days');
  }

  if (account.has_consistency) {
    pitfalls.push('Making one big win that exceeds consistency limits');
  }

  pitfalls.push('Over-leveraging after a winning streak');
  pitfalls.push('Revenge trading after a loss');

  return pitfalls.slice(0, 6);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProgressRulesTab({ accounts }: ProgressRulesTabProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  
  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  if (accounts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">Add an account to track progress and rules</p>
        <a
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl"
        >
          + Add Account
        </a>
      </div>
    );
  }

  const pitfalls = selectedAccount ? getCommonPitfalls(selectedAccount) : [];

  return (
    <div className="space-y-6">
      {/* Account Selector */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <label className="block text-sm text-gray-400 mb-2">Select Account</label>
        <div className="relative">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
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

      {selectedAccount && (
        <>
          {/* Evaluation Progress */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Evaluation Progress</h3>
            
            <div className="space-y-4">
              {/* Profit Target */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Profit Target
                  </span>
                  <span className="text-white">
                    {selectedAccount.current_profit_percent || 0}% / {selectedAccount.profit_target_percent || 10}%
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((selectedAccount.current_profit_percent || 0) / (selectedAccount.profit_target_percent || 10)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Trading Days */}
              {selectedAccount.min_trading_days > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Minimum Trading Days
                    </span>
                    <span className={`${
                      selectedAccount.current_trading_days >= selectedAccount.min_trading_days
                        ? 'text-emerald-400'
                        : 'text-white'
                    }`}>
                      {selectedAccount.current_trading_days} / {selectedAccount.min_trading_days}
                      {selectedAccount.current_trading_days >= selectedAccount.min_trading_days && ' ✓'}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedAccount.current_trading_days >= selectedAccount.min_trading_days
                          ? 'bg-emerald-500'
                          : 'bg-gray-600'
                      }`}
                      style={{
                        width: `${Math.min(100, (selectedAccount.current_trading_days / selectedAccount.min_trading_days) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Daily DD */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Daily DD Buffer</span>
                  <span className={`${
                    selectedAccount.health.daily.daily_buffer_pct < 30 ? 'text-red-400' :
                    selectedAccount.health.daily.daily_buffer_pct < 50 ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {Math.round(selectedAccount.health.daily.daily_buffer_pct)}% remaining
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedAccount.health.daily.daily_buffer_pct < 30 ? 'bg-red-500' :
                      selectedAccount.health.daily.daily_buffer_pct < 50 ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedAccount.health.daily.daily_buffer_pct}%` }}
                  />
                </div>
              </div>

              {/* Max DD */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    Max DD Buffer {selectedAccount.max_dd_type !== 'static' && '(trailing)'}
                  </span>
                  <span className={`${
                    selectedAccount.health.max.max_buffer_pct < 30 ? 'text-red-400' :
                    selectedAccount.health.max.max_buffer_pct < 50 ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {Math.round(selectedAccount.health.max.max_buffer_pct)}% remaining
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedAccount.health.max.max_buffer_pct < 30 ? 'bg-red-500' :
                      selectedAccount.health.max.max_buffer_pct < 50 ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedAccount.health.max.max_buffer_pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Rules */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Key Rules</h3>
            
            <div className="grid md:grid-cols-2 gap-3">
              {/* Daily DD */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">Daily Drawdown</span>
                  <span className="text-sm text-emerald-400">{selectedAccount.daily_dd_percent}%</span>
                </div>
                <p className="text-xs text-gray-500">
                  Max {formatUSD(selectedAccount.account_size * selectedAccount.daily_dd_percent / 100)} loss per day
                </p>
              </div>

              {/* Max DD */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">Max Drawdown</span>
                  <span className={`text-sm ${selectedAccount.max_dd_type === 'static' ? 'text-emerald-400' : 'text-purple-400'}`}>
                    {selectedAccount.max_dd_percent}% {selectedAccount.max_dd_type !== 'static' && '(trailing)'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedAccount.max_dd_type === 'static'
                    ? 'Fixed floor from starting balance'
                    : 'Floor moves up with profits'}
                </p>
              </div>

              {/* News Trading */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white flex items-center gap-2">
                    <Newspaper className="w-4 h-4" />
                    News Trading
                  </span>
                  <span className={`text-sm ${selectedAccount.allows_news ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedAccount.allows_news ? 'Allowed' : 'Restricted'}
                  </span>
                </div>
                {!selectedAccount.allows_news && (
                  <p className="text-xs text-gray-500">2-5 min buffer around high-impact news</p>
                )}
              </div>

              {/* Weekend Holding */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Weekend Holding
                  </span>
                  <span className={`text-sm ${selectedAccount.allows_weekend ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedAccount.allows_weekend ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
                {!selectedAccount.allows_weekend && (
                  <p className="text-xs text-gray-500">Close all positions before Friday</p>
                )}
              </div>

              {/* Consistency */}
              {selectedAccount.has_consistency && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Consistency Rule
                    </span>
                    <span className="text-sm text-cyan-400">Active</span>
                  </div>
                  <p className="text-xs text-gray-500">No single day &gt;30-40% of total profit</p>
                </div>
              )}

              {/* Min Days */}
              {selectedAccount.min_trading_days > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Minimum Days
                    </span>
                    <span className="text-sm text-gray-300">{selectedAccount.min_trading_days} days</span>
                  </div>
                  <p className="text-xs text-gray-500">Must trade on separate days to pass</p>
                </div>
              )}
            </div>
          </div>

          {/* Common Pitfalls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Common Pitfalls
            </h3>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="space-y-2">
                {pitfalls.map((pitfall, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-yellow-300">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {pitfall}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
