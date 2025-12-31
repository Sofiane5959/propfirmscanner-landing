'use client';

import { X, AlertTriangle, BookOpen } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  prop_firm: string;
  account_size: number;
  stage: string;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  min_trading_days: number;
  health: {
    max: {
      basisUsed: 'balance' | 'equity';
    };
  };
}

interface RulesPitfallsProps {
  account: Account;
  onClose: () => void;
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

function getCommonMistakes(account: Account): string[] {
  const mistakes: string[] = [];

  if (account.max_dd_type !== 'static') {
    mistakes.push('Scaling too fast on trailing drawdown accounts');
    mistakes.push('Not accounting for trailing floor after profits');
  }

  if (!account.allows_news) {
    mistakes.push('Trading during restricted news windows');
  }

  if (!account.allows_weekend) {
    mistakes.push('Forgetting to close positions before Friday');
  }

  if (account.min_trading_days > 0) {
    mistakes.push('Assuming profits count before minimum days');
    mistakes.push('Rushing trades to meet day requirements');
  }

  if (account.has_consistency) {
    mistakes.push('Making one big win that exceeds consistency limits');
  }

  if (account.health.max.basisUsed === 'equity') {
    mistakes.push('Ignoring floating losses when calculating drawdown');
  }

  // Always add these
  mistakes.push('Over-leveraging after a winning streak');
  mistakes.push('Revenge trading after a loss');

  return mistakes.slice(0, 6); // Max 6 mistakes
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RulesPitfalls({ account, onClose }: RulesPitfallsProps) {
  const dailyDDUsd = (account.account_size * account.daily_dd_percent) / 100;
  const maxDDUsd = (account.account_size * account.max_dd_percent) / 100;
  const mistakes = getCommonMistakes(account);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-t-xl sm:rounded-xl border border-gray-800 w-full sm:max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Rules & Pitfalls</h2>
            <p className="text-sm text-gray-500">{account.prop_firm} · {account.stage}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* KEY RULES */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <BookOpen className="w-4 h-4" />
              Key Rules
            </h3>
            
            <div className="space-y-3">
              {/* Daily DD */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">Daily Drawdown</span>
                  <span className="text-sm text-emerald-400">{account.daily_dd_percent}%</span>
                </div>
                <p className="text-xs text-gray-500">
                  Max {formatUSD(dailyDDUsd)} loss per day from starting balance
                </p>
              </div>

              {/* Max DD */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">Max Drawdown</span>
                  <span className={`text-sm ${account.max_dd_type === 'static' ? 'text-emerald-400' : 'text-purple-400'}`}>
                    {account.max_dd_percent}% {account.max_dd_type !== 'static' && '(trailing)'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {account.max_dd_type === 'static'
                    ? `Floor at ${formatUSD(account.account_size - maxDDUsd)} — does not change`
                    : `Floor moves up with profits — currently trails your high watermark`
                  }
                </p>
              </div>

              {/* Basis */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">DD Calculation Basis</span>
                  <span className="text-sm text-gray-300">
                    {account.health.max.basisUsed === 'balance' ? 'Balance' : 'Equity'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {account.health.max.basisUsed === 'balance'
                    ? 'Only closed P&L counts toward drawdown'
                    : 'Floating (unrealized) losses count toward drawdown'
                  }
                </p>
              </div>

              {/* Min Days */}
              {account.min_trading_days > 0 && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white">Minimum Trading Days</span>
                    <span className="text-sm text-gray-300">{account.min_trading_days} days</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    You must trade on at least {account.min_trading_days} separate days to pass
                  </p>
                </div>
              )}

              {/* News */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">News Trading</span>
                  <span className={`text-sm ${account.allows_news ? 'text-emerald-400' : 'text-red-400'}`}>
                    {account.allows_news ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
                {!account.allows_news && (
                  <p className="text-xs text-gray-500">
                    No trading 2-5 minutes before/after high-impact news
                  </p>
                )}
              </div>

              {/* Weekend */}
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">Weekend Holding</span>
                  <span className={`text-sm ${account.allows_weekend ? 'text-emerald-400' : 'text-red-400'}`}>
                    {account.allows_weekend ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
                {!account.allows_weekend && (
                  <p className="text-xs text-gray-500">
                    All positions must be closed before Friday market close
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* COMMON MISTAKES */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Common Mistakes
            </h3>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="space-y-2">
                {mistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-yellow-300">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    {mistake}
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
