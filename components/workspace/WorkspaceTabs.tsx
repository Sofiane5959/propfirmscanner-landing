'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  Wallet, 
  Play, 
  BookOpen, 
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Plus,
  Sparkles
} from 'lucide-react';

import { AccountsTab } from './tabs/AccountsTab';
import { SimulationTab } from './tabs/SimulationTab';
import { ProgressRulesTab } from './tabs/ProgressRulesTab';
import { GuidanceTab } from './tabs/GuidanceTab';

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
  prop_firm_slug: string;
  program: string;
  account_size: number;
  start_balance: number;
  current_balance: number;
  today_pnl: number;
  stage: string;
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

interface WorkspaceTabsProps {
  accounts: Account[];
  totalAccounts: number;
  safeCount: number;
  riskCount: number;
  dangerCount: number;
  dailyGuidance: string;
  isDemo?: boolean;
  demoGuidanceTips?: string[];
}

// =============================================================================
// TABS CONFIG
// =============================================================================

const tabs = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid },
  { id: 'accounts', name: 'Accounts', icon: Wallet },
  { id: 'simulation', name: 'Simulation', icon: Play },
  { id: 'progress', name: 'Progress & Rules', icon: BookOpen },
  { id: 'guidance', name: 'Guidance', icon: Lightbulb },
];

// =============================================================================
// DEMO BANNER COMPONENT
// =============================================================================

function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-500/20 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="font-medium text-white">
              You&apos;re viewing demo data
            </p>
            <p className="text-sm text-gray-400">
              Add your own account to see your real risk metrics and guidance.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/accounts/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Your Account
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function WorkspaceTabs({
  accounts,
  totalAccounts,
  safeCount,
  riskCount,
  dangerCount,
  dailyGuidance,
  isDemo = false,
  demoGuidanceTips,
}: WorkspaceTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Demo Banner - Only show when in demo mode */}
      {isDemo && <DemoBanner />}

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-900 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          totalAccounts={totalAccounts}
          safeCount={safeCount}
          riskCount={riskCount}
          dangerCount={dangerCount}
          dailyGuidance={dailyGuidance}
          accounts={accounts}
          onNavigate={setActiveTab}
          isDemo={isDemo}
        />
      )}

      {activeTab === 'accounts' && (
        <AccountsTab accounts={accounts} isDemo={isDemo} />
      )}

      {activeTab === 'simulation' && (
        <SimulationTab accounts={accounts} isDemo={isDemo} />
      )}

      {activeTab === 'progress' && (
        <ProgressRulesTab accounts={accounts} isDemo={isDemo} />
      )}

      {activeTab === 'guidance' && (
        <GuidanceTab 
          accounts={accounts} 
          isDemo={isDemo}
          demoTips={demoGuidanceTips}
        />
      )}
    </div>
  );
}

// =============================================================================
// OVERVIEW TAB
// =============================================================================

interface OverviewTabProps {
  totalAccounts: number;
  safeCount: number;
  riskCount: number;
  dangerCount: number;
  dailyGuidance: string;
  accounts: Account[];
  onNavigate: (tab: string) => void;
  isDemo?: boolean;
}

function OverviewTab({
  totalAccounts,
  safeCount,
  riskCount,
  dangerCount,
  dailyGuidance,
  accounts,
  onNavigate,
  isDemo = false,
}: OverviewTabProps) {
  const hasDanger = dangerCount > 0;
  const hasRisk = riskCount > 0;

  return (
    <div className="space-y-6">
      {/* Daily Guidance - Most Important */}
      <div
        className={`p-5 rounded-xl border relative ${
          hasDanger
            ? 'bg-red-500/10 border-red-500/30'
            : hasRisk
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
        }`}
      >
        {isDemo && (
          <span className="absolute top-3 right-3 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            Demo data
          </span>
        )}
        <p className={`text-lg font-medium pr-20 ${
          hasDanger ? 'text-red-400' : hasRisk ? 'text-yellow-400' : 'text-emerald-400'
        }`}>
          {dailyGuidance}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 relative">
          {isDemo && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full" title="Demo data" />
          )}
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Total Accounts</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalAccounts}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Safe to Trade</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{safeCount}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">At Risk</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{riskCount}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Do Not Trade</span>
          </div>
          <p className="text-3xl font-bold text-red-400">{dangerCount}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('accounts')}
          className="p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-left transition-colors"
        >
          <Wallet className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="font-medium text-white">View Accounts</p>
          <p className="text-sm text-gray-500">
            {isDemo ? 'See demo accounts' : 'See all your prop firm accounts'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('simulation')}
          className="p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-left transition-colors"
        >
          <Play className="w-5 h-5 text-blue-400 mb-2" />
          <p className="font-medium text-white">Simulate Trade</p>
          <p className="text-sm text-gray-500">Test before you risk</p>
        </button>

        <button
          onClick={() => onNavigate('guidance')}
          className="p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-left transition-colors"
        >
          <Lightbulb className="w-5 h-5 text-yellow-400 mb-2" />
          <p className="font-medium text-white">Today&apos;s Guidance</p>
          <p className="text-sm text-gray-500">What to do and avoid</p>
        </button>
      </div>

      {/* Accounts at Risk Preview */}
      {(hasDanger || hasRisk) && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">Accounts Needing Attention</h3>
            {isDemo && (
              <span className="text-xs text-gray-500">Demo data</span>
            )}
          </div>
          <div className="space-y-2">
            {accounts
              .filter(a => a.health.status !== 'safe')
              .slice(0, 3)
              .map((account) => (
                <div
                  key={account.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    account.health.status === 'danger'
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-yellow-500/10 border border-yellow-500/20'
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">{account.prop_firm}</p>
                    <p className="text-xs text-gray-400">{account.program}</p>
                  </div>
                  <span className={`text-sm font-medium ${
                    account.health.status === 'danger' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    ${Math.round(account.health.daily.daily_buffer_usd)} left today
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CTA for Demo Mode */}
      {isDemo && (
        <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Ready to track your real accounts?
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Add your prop firm accounts to see personalized risk tracking and guidance.
          </p>
          <Link
            href="/dashboard/accounts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Account
          </Link>
        </div>
      )}
    </div>
  );
}
