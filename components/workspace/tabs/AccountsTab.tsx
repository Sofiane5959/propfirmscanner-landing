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
  BookOpen
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

export function AccountsTab({ accounts }: AccountsTabProps) {
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

  if (accounts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">No accounts yet</p>
        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl"
        >
          <Plus className="w-5 h-5" />
          Add Your First Account
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add Account Button */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/accounts/new"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
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
              className={`bg-gray-900 rounded-xl border ${statusConfig.border} overflow-hidden`}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-start justify-between">
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
                  className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
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
      </div>

      {/* Modals */}
      {selectedAccount && modalType === 'pnl' && (
        <UpdatePnlModal account={selectedAccount} onClose={closeModal} />
      )}
      {selectedAccount && modalType === 'simulate' && (
        <QuickSimulateModal account={selectedAccount} onClose={closeModal} />
      )}
      {selectedAccount && modalType === 'rules' && (
        <AccountRulesModal account={selectedAccount} onClose={closeModal} />
      )}
    </>
  );
}
