'use client';

import { useState } from 'react';
import { 
  TrendingDown, 
  Newspaper, 
  Moon, 
  BarChart3,
  DollarSign
} from 'lucide-react';
import { TradeSimulator } from './TradeSimulator';
import { UpdatePnlModal } from './UpdatePnlModal';
import { RulesPitfalls } from './RulesPitfalls';

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
  account_size: number;
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatAccountSize(size: number): string {
  if (size >= 1000000) return `$${(size / 1000000).toFixed(0)}M`;
  if (size >= 1000) return `$${(size / 1000).toFixed(0)}K`;
  return `$${size}`;
}

function getStatusConfig(status: 'safe' | 'warning' | 'danger') {
  return {
    safe: { bg: 'bg-emerald-500', text: 'text-emerald-500', label: 'SAFE' },
    warning: { bg: 'bg-yellow-500', text: 'text-yellow-500', label: 'RISK' },
    danger: { bg: 'bg-red-500', text: 'text-red-500', label: 'DANGER' },
  }[status];
}

function getRiskReasons(account: Account): string[] {
  const reasons: string[] = [];
  
  if (account.health.daily.daily_buffer_pct < 20) {
    reasons.push('Daily drawdown remaining below 20%');
  } else if (account.health.daily.daily_buffer_pct < 50) {
    reasons.push('Daily drawdown buffer is low');
  }
  
  if (account.max_dd_type !== 'static' && account.health.max.max_buffer_pct < 50) {
    reasons.push('Trailing drawdown active after profits');
  }
  
  if (account.min_trading_days > 0 && account.current_trading_days < account.min_trading_days) {
    reasons.push('Minimum trading days not met yet');
  }
  
  if (account.health.max.max_buffer_pct < 30) {
    reasons.push('Total drawdown buffer critically low');
  }
  
  return reasons;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AccountCard({ account }: AccountCardProps) {
  const [showSimulator, setShowSimulator] = useState(false);
  const [showPnlModal, setShowPnlModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  
  const statusConfig = getStatusConfig(account.health.status);
  const isAtRisk = account.health.status !== 'safe';
  const riskReasons = isAtRisk ? getRiskReasons(account) : [];
  
  const isTrailing = account.max_dd_type !== 'static';
  const isEquityBased = account.health.max.basisUsed === 'equity';

  return (
    <>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {/* HEADER */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white text-lg">{account.prop_firm}</h3>
              <p className="text-sm text-gray-500">
                {formatAccountSize(account.account_size)} · {account.stage}
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusConfig.bg} text-white`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* CORE METRICS — ONLY 3 */}
        <div className="p-4 grid grid-cols-3 gap-4">
          {/* Safe loss remaining today */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Safe to lose today</p>
            <p className={`text-xl font-bold ${
              account.health.daily.daily_buffer_usd < 300 ? 'text-red-400' :
              account.health.daily.daily_buffer_usd < 800 ? 'text-yellow-400' :
              'text-white'
            }`}>
              {formatUSD(account.health.daily.daily_buffer_usd)}
            </p>
          </div>

          {/* Total drawdown remaining */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Total DD left</p>
            <p className={`text-xl font-bold ${
              account.health.max.max_buffer_usd < 1000 ? 'text-red-400' :
              account.health.max.max_buffer_usd < 2500 ? 'text-yellow-400' :
              'text-white'
            }`}>
              {formatUSD(account.health.max.max_buffer_usd)}
            </p>
          </div>

          {/* Min trading days progress */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Trading days</p>
            <p className={`text-xl font-bold ${
              account.current_trading_days >= account.min_trading_days 
                ? 'text-emerald-400' 
                : 'text-white'
            }`}>
              {account.min_trading_days > 0 
                ? `${account.current_trading_days} / ${account.min_trading_days}`
                : '—'
              }
            </p>
          </div>
        </div>

        {/* ACTIVE RULE BADGES */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {isTrailing && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">
              <TrendingDown className="w-3 h-3" />
              Trailing DD
            </span>
          )}
          {isEquityBased && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-lg">
              <DollarSign className="w-3 h-3" />
              Equity-based
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${
            account.allows_news 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <Newspaper className="w-3 h-3" />
            {account.allows_news ? 'News OK' : 'No news'}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${
            account.allows_weekend 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            <Moon className="w-3 h-3" />
            {account.allows_weekend ? 'Weekend OK' : 'No weekend'}
          </span>
          {account.has_consistency && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-lg">
              <BarChart3 className="w-3 h-3" />
              Consistency
            </span>
          )}
        </div>

        {/* RISK EXPLANATION — ONLY IF RISK OR DANGER */}
        {isAtRisk && riskReasons.length > 0 && (
          <div className="px-4 pb-4">
            <div className={`p-3 rounded-lg ${
              account.health.status === 'danger' 
                ? 'bg-red-500/10 border border-red-500/20' 
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}>
              <ul className="space-y-1">
                {riskReasons.map((reason, i) => (
                  <li key={i} className={`text-sm ${
                    account.health.status === 'danger' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    • {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="p-4 pt-0 grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowSimulator(true)}
            className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Can I take this trade?
          </button>
          <button
            onClick={() => setShowPnlModal(true)}
            className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Update today PnL
          </button>
          <button
            onClick={() => setShowRules(true)}
            className="py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Rules & pitfalls
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showSimulator && (
        <TradeSimulator
          account={account}
          onClose={() => setShowSimulator(false)}
        />
      )}
      
      {showPnlModal && (
        <UpdatePnlModal
          account={account}
          onClose={() => setShowPnlModal(false)}
        />
      )}
      
      {showRules && (
        <RulesPitfalls
          account={account}
          onClose={() => setShowRules(false)}
        />
      )}
    </>
  );
}
