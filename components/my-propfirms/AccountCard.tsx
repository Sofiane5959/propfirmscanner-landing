'use client';

import { useState } from 'react';
import { 
  ChevronRight, 
  TrendingDown, 
  Calendar,
  Newspaper,
  Moon,
  BarChart3
} from 'lucide-react';
import { AccountDrawer } from './AccountDrawer';

// =============================================================================
// TYPES
// =============================================================================

interface AccountHealth {
  status: 'safe' | 'warning' | 'danger';
  daily: {
    daily_limit_usd: number;
    daily_used_usd: number;
    daily_buffer_usd: number;
    daily_buffer_pct: number;
  };
  max: {
    max_limit_usd: number;
    max_floor_usd: number;
    max_buffer_usd: number;
    max_buffer_pct: number;
    basisUsed: 'balance' | 'equity';
    isApproxTrailing: boolean;
  };
  messages: string[];
}

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  stage: string;
  current_balance: number;
  start_balance: number;
  today_pnl: number;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  min_trading_days: number;
  current_trading_days: number;
  health: AccountHealth;
}

interface AccountCardProps {
  account: Account;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatUSD(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${Math.round(amount)}`;
}

function getStatusConfig(status: 'safe' | 'warning' | 'danger') {
  const configs = {
    safe: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      label: 'SAFE',
      dot: 'bg-emerald-400',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      label: 'RISK',
      dot: 'bg-yellow-400',
    },
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      label: 'DANGER',
      dot: 'bg-red-400',
    },
  };
  return configs[status];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AccountCard({ account }: AccountCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const statusConfig = getStatusConfig(account.health.status);
  
  const safeToLoseToday = account.health.daily.daily_buffer_usd;
  const totalDDRemaining = account.health.max.max_buffer_usd;
  const isTrailing = account.max_dd_type !== 'static';
  const tradingDaysProgress = account.min_trading_days > 0 
    ? Math.min(100, (account.current_trading_days / account.min_trading_days) * 100)
    : 100;
  const tradingDaysMet = account.current_trading_days >= account.min_trading_days;

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`w-full text-left p-4 rounded-xl border ${statusConfig.border} ${statusConfig.bg} hover:bg-opacity-20 transition-all group`}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate">{account.prop_firm}</h3>
              <span className={`flex items-center gap-1 text-xs font-medium ${statusConfig.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                {statusConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {account.program} · {account.stage}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Safe to Lose Today */}
          <div className="bg-gray-900/50 rounded-lg p-2.5">
            <p className="text-xs text-gray-500 mb-1">Safe to lose today</p>
            <p className={`text-lg font-bold ${
              safeToLoseToday < 500 ? 'text-red-400' : 
              safeToLoseToday < 1000 ? 'text-yellow-400' : 
              'text-white'
            }`}>
              {formatUSD(safeToLoseToday)}
            </p>
          </div>

          {/* Total DD Remaining */}
          <div className="bg-gray-900/50 rounded-lg p-2.5">
            <p className="text-xs text-gray-500 mb-1">Total DD left</p>
            <p className={`text-lg font-bold ${
              totalDDRemaining < 1000 ? 'text-red-400' : 
              totalDDRemaining < 2000 ? 'text-yellow-400' : 
              'text-white'
            }`}>
              {formatUSD(totalDDRemaining)}
            </p>
          </div>
        </div>

        {/* Trading Days Progress */}
        {account.min_trading_days > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Trading days</span>
              <span className={tradingDaysMet ? 'text-emerald-400' : 'text-gray-400'}>
                {account.current_trading_days}/{account.min_trading_days}
                {tradingDaysMet && ' ✓'}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  tradingDaysMet ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
                style={{ width: `${tradingDaysProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {isTrailing && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              <TrendingDown className="w-3 h-3" />
              Trailing
            </span>
          )}
          {!account.allows_news && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
              <Newspaper className="w-3 h-3" />
              No news
            </span>
          )}
          {!account.allows_weekend && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              <Moon className="w-3 h-3" />
              No weekend
            </span>
          )}
          {account.has_consistency && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
              <BarChart3 className="w-3 h-3" />
              Consistency
            </span>
          )}
        </div>
      </button>

      {/* Drawer */}
      <AccountDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        account={account}
      />
    </>
  );
}
