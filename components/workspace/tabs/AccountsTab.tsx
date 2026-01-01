'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus,
  TrendingDown, 
  Newspaper, 
  Moon, 
  BarChart3,
  Edit3,
  Play,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { UpdatePnlModal } from './UpdatePnlModal';
import { QuickSimulateModal } from './QuickSimulateModal';
import { AccountRulesModal } from './AccountRulesModal';

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
  };
}

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  account_size: number;
  stage: string;
  current_balance: number;
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

interface AccountsTabProps {
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

function getStatusConfig(status: 'safe' | 'warning' | 'danger') {
  return {
    safe: { bg: 'bg-emerald-500', border: 'border-emerald-500/30', label: 'SAFE' },
    warning: { bg: 'bg-yellow-500', border: 'border-yellow-500/30', label: 'RISK' },
    danger: { bg: 'bg-red-500', border: 'border-red-500/30', label: 'DANGER' },
  }[status];
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AccountsTab({ accounts, isDemo = false }: AccountsTabProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalType, setModalType] = useState<'pnl' | 'simulate' | 'rules' | null>(null);

  const openModal = (account: Account, type: 'pnl' | 'simulate' | 'rules') => {
    setSelectedAccount(account);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedAccount(null);
    setModalType(null);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Your Accounts</h2>
            {isDemo && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg">
                <Sparkles className="w-3 h-3" />
                Demo
              </span>
            )}
          </div>
          <Link
            href="/dashboard/accounts/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Link>
        </div>

        {/* Account Cards */}
        {accounts.map((account) => {
          const statusConfig = getStatusConfig(account.health.status);
          const isTrailing = account.max_dd_type !== 'static';

          return (
            <div
              key={account.id}
              className={`bg-gray-900 rounded-xl border ${statusConfig.border} overflow-hidden relative`}
            >
              {/* Demo indicator */}
              {isDemo && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                    Demo
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-start justify-between pr-16">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{account.prop_firm}</h3>
                    <p className="text-sm text-gray-500">
                      {account.program} · {account.stage}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusConfig.bg} text-white`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="p-4 grid grid-cols-3 gap-4">
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
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total DD remaining</p>
                  <p className={`text-xl font-bold ${
                    account.health.max.max_buffer_usd < 1000 ? 'text-red-400' :
                    account.health.max.max_buffer_usd < 2500 ? 'text-yellow-400' :
                    'text-white'
                  }`}>
                    {formatUSD(account.health.max.max_buffer_usd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Trading days</p>
                  <p className={`text-xl font-bold ${
                    account.min_trading_days > 0 && account.current_trading_days >= account.min_trading_days
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

              {/* Badges */}
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {isTrailing && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">
                    <TrendingDown className="w-3 h-3" />
                    Trailing
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${
                  account.allows_news ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  <Newspaper className="w-3 h-3" />
                  {account.allows_news ? 'News OK' : 'No news'}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${
                  account.allows_weekend ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
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

              {/* Actions */}
              <div className="p-4 pt-0 grid grid-cols-3 gap-2">
                <button
                  onClick={() => openModal(account, 'simulate')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Simulate
                </button>
                <button
                  onClick={() => openModal(account, 'pnl')}
                  disabled={isDemo}
                  className={`flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isDemo 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                  title={isDemo ? 'Add your own account to update PnL' : 'Update PnL'}
                >
                  <Edit3 className="w-4 h-4" />
                  Update PnL
                </button>
                <button
                  onClick={() => openModal(account, 'rules')}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Rules
                </button>
              </div>
            </div>
          );
        })}

        {/* CTA for Demo Mode */}
        {isDemo && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Add your own account to replace demo data
                </h3>
                <p className="text-sm text-gray-400">
                  Your real accounts will show personalized risk tracking.
                </p>
              </div>
              <Link
                href="/dashboard/accounts/new"
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedAccount && modalType === 'pnl' && !isDemo && (
        <UpdatePnlModal account={selectedAccount} onClose={closeModal} />
      )}
      {selectedAccount && modalType === 'simulate' && (
        <QuickSimulateModal account={selectedAccount} onClose={closeModal} isDemo={isDemo} />
      )}
      {selectedAccount && modalType === 'rules' && (
        <AccountRulesModal account={selectedAccount} onClose={closeModal} />
      )}
    </>
  );
}
