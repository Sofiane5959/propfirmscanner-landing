'use client';

import { X, AlertTriangle, Newspaper, Moon, BarChart3, Clock } from 'lucide-react';

interface Account {
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
}

interface AccountRulesModalProps {
  account: Account;
  onClose: () => void;
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

function getPitfalls(account: Account): string[] {
  const pitfalls: string[] = [];
  if (account.max_dd_type !== 'static') {
    pitfalls.push('Trailing DD: Your floor rises with profits — a winning streak followed by a loss can still cause a breach');
  }
  if (!account.allows_news) {
    pitfalls.push('News restriction: Trades during high-impact news can void your account, even if profitable');
  }
  if (!account.allows_weekend) {
    pitfalls.push('Weekend holding: All positions must be closed before Friday close');
  }
  if (account.has_consistency) {
    pitfalls.push('Consistency rule: No single day can exceed 30-40% of total profit');
  }
  pitfalls.push('Over-leveraging after a winning streak');
  pitfalls.push('Revenge trading after a loss');
  return pitfalls.slice(0, 5);
}

export function AccountRulesModal({ account, onClose }: AccountRulesModalProps) {
  const dailyDDUsd = (account.account_size * account.daily_dd_percent) / 100;
  const maxDDUsd = (account.account_size * account.max_dd_percent) / 100;
  const pitfalls = getPitfalls(account);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-gray-900 rounded-t-xl sm:rounded-xl border border-gray-800 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Rules & Pitfalls</h2>
            <p className="text-sm text-gray-500">{account.prop_firm} · {account.stage}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Key Rules */}
          <section>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Key Rules</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">Daily Drawdown</span>
                  <span className="text-sm text-emerald-400">{account.daily_dd_percent}%</span>
                </div>
                <p className="text-xs text-gray-500">Max {formatUSD(dailyDDUsd)} loss per day</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">Max Drawdown</span>
                  <span className={`text-sm ${account.max_dd_type === 'static' ? 'text-emerald-400' : 'text-purple-400'}`}>
                    {account.max_dd_percent}% {account.max_dd_type !== 'static' && '(trailing)'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {account.max_dd_type === 'static' ? `Fixed floor at ${formatUSD(account.account_size - maxDDUsd)}` : 'Floor moves up with profits'}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white flex items-center gap-2"><Newspaper className="w-4 h-4" />News Trading</span>
                  <span className={`text-sm ${account.allows_news ? 'text-emerald-400' : 'text-red-400'}`}>
                    {account.allows_news ? 'Allowed' : 'Restricted'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white flex items-center gap-2"><Moon className="w-4 h-4" />Weekend Holding</span>
                  <span className={`text-sm ${account.allows_weekend ? 'text-emerald-400' : 'text-red-400'}`}>
                    {account.allows_weekend ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
              </div>

              {account.has_consistency && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white flex items-center gap-2"><BarChart3 className="w-4 h-4" />Consistency Rule</span>
                    <span className="text-sm text-cyan-400">Active</span>
                  </div>
                  <p className="text-xs text-gray-500">No single day &gt;30-40% of total profit</p>
                </div>
              )}

              {account.min_trading_days > 0 && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white flex items-center gap-2"><Clock className="w-4 h-4" />Min Trading Days</span>
                    <span className="text-sm text-gray-300">{account.min_trading_days} days</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Common Pitfalls */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Common Pitfalls
            </h3>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="space-y-2">
                {pitfalls.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-yellow-300">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
