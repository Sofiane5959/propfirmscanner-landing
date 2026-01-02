'use client';

import { 
  AlertTriangle, 
  Shield, 
  AlertCircle, 
  TrendingUp,
  Play,
  ChevronRight,
  Newspaper,
  Calendar,
  BarChart3
} from 'lucide-react';
import { DemoBadge } from './DemoBadge';
import type { DemoAccount } from '@/lib/demo-data';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPnl(amount: number): string {
  const formatted = formatCurrency(Math.abs(amount));
  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
}

function getStatusConfig(status: 'safe' | 'warning' | 'danger') {
  const configs = {
    safe: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: Shield,
      label: 'Healthy',
    },
    warning: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: AlertTriangle,
      label: 'Warning',
    },
    danger: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: AlertCircle,
      label: 'Danger',
    },
  };
  return configs[status];
}

// =============================================================================
// DEMO ACCOUNT CARD COMPONENT
// =============================================================================

interface DemoAccountCardProps {
  account: DemoAccount;
  onTrySimulate: () => void;
}

export function DemoAccountCard({ account, onTrySimulate }: DemoAccountCardProps) {
  const statusConfig = getStatusConfig(account.health.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`relative bg-gray-800 rounded-xl border ${statusConfig.border} overflow-hidden`}>
      {/* Demo indicator */}
      <div className="absolute top-3 right-3 z-10">
        <DemoBadge />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Prop Firm Logo Placeholder */}
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {account.prop_firm.charAt(0)}
              </span>
            </div>
            
            <div>
              <h3 className="font-semibold text-white">{account.prop_firm}</h3>
              <p className="text-sm text-gray-400">
                {account.program} • {account.stage}
              </p>
            </div>
          </div>

          {/* Status Badge - moved to make room for demo badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bg} mt-6`}>
            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.text}`} />
            <span className={`text-xs font-medium ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Balance & P&L Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Current Balance</p>
            <p className="text-xl font-bold text-white">
              {formatCurrency(account.current_balance)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Today&apos;s P&L</p>
            <p className={`text-xl font-bold ${
              account.today_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {formatPnl(account.today_pnl)}
            </p>
          </div>
        </div>

        {/* Buffer Indicators */}
        <div className="space-y-3 mb-4">
          {/* Daily Drawdown Buffer */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Daily DD Buffer</span>
              <span className={`font-medium ${
                account.health.daily.daily_buffer_pct < 30 
                  ? account.health.daily.daily_buffer_pct < 15 
                    ? 'text-red-400' 
                    : 'text-yellow-400'
                  : 'text-emerald-400'
              }`}>
                {formatCurrency(account.health.daily.daily_buffer_usd)} ({account.health.daily.daily_buffer_pct.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  account.health.daily.daily_buffer_pct < 30
                    ? account.health.daily.daily_buffer_pct < 15
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, account.health.daily.daily_buffer_pct)}%` }}
              />
            </div>
          </div>

          {/* Max Drawdown Buffer */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">
                Max DD Buffer
                {account.max_dd_type !== 'static' && (
                  <span className="text-purple-400 ml-1">(trailing)</span>
                )}
              </span>
              <span className={`font-medium ${
                account.health.max.max_buffer_pct < 30
                  ? account.health.max.max_buffer_pct < 15
                    ? 'text-red-400'
                    : 'text-yellow-400'
                  : 'text-emerald-400'
              }`}>
                {formatCurrency(account.health.max.max_buffer_usd)} ({account.health.max.max_buffer_pct.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  account.health.max.max_buffer_pct < 30
                    ? account.health.max.max_buffer_pct < 15
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, account.health.max.max_buffer_pct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Rule Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {!account.allows_news && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
              <Newspaper className="w-3 h-3" />
              No News
            </span>
          )}
          {!account.allows_weekend && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              <Calendar className="w-3 h-3" />
              No Weekend
            </span>
          )}
          {account.has_consistency && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              <BarChart3 className="w-3 h-3" />
              Consistency
            </span>
          )}
          {account.max_dd_type !== 'static' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full">
              <TrendingUp className="w-3 h-3" />
              {account.max_dd_type === 'eod_trailing' ? 'EOD Trailing' : 'Trailing'}
            </span>
          )}
        </div>

        {/* Warning Messages */}
        {account.health.status !== 'safe' && account.health.messages.length > 0 && (
          <div className={`p-3 rounded-lg mb-4 ${statusConfig.bg}`}>
            <p className={`text-sm ${statusConfig.text}`}>
              {account.health.messages[0]}
            </p>
          </div>
        )}

        {/* Actions - Demo mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTrySimulate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Play className="w-4 h-4" />
            Try Simulator
          </button>
          
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View Rules
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
