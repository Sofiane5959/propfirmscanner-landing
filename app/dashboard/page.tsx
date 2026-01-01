import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Zap, Shield } from 'lucide-react';

import { WorkspaceTabs } from '@/components/workspace/WorkspaceTabs';
import { calcAccountHealth } from '@/lib/risk';
import { DEMO_ACCOUNTS, DEMO_GUIDANCE_MESSAGE, DEMO_GUIDANCE_TIPS } from '@/lib/demo-data';
import type { AccountState, RuleSet } from '@/lib/risk';

// =============================================================================
// TYPES
// =============================================================================

interface DbAccount {
  id: string;
  user_id: string;
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  start_balance: number;
  current_balance: number;
  current_equity: number | null;
  today_pnl: number;
  stage: string;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  trail_high_watermark: number | null;
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  min_trading_days: number;
  current_trading_days: number;
  profit_target_percent: number;
  current_profit_percent: number;
  created_at: string;
  updated_at: string;
}

export interface AccountWithHealth extends DbAccount {
  health: {
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
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function createRuleSet(params: {
  dailyLimitPct: number;
  maxLimitPct: number;
  basis: 'balance' | 'equity';
  isTrailing: boolean;
}): RuleSet {
  return {
    daily_limit: { kind: 'percent', value: params.dailyLimitPct },
    max_limit: { kind: 'percent', value: params.maxLimitPct },
    basis: params.basis,
    isTrailing: params.isTrailing,
  };
}

function calculateHealth(account: DbAccount): AccountWithHealth['health'] {
  const accountState: AccountState = {
    start_balance_usd: account.start_balance,
    current_balance_usd: account.current_balance,
    current_equity_usd: account.current_equity ?? undefined,
    today_pnl_usd: account.today_pnl,
    trail_high_watermark_usd: account.trail_high_watermark ?? undefined,
  };

  const ruleSet = createRuleSet({
    dailyLimitPct: account.daily_dd_percent,
    maxLimitPct: account.max_dd_percent,
    basis: 'balance',
    isTrailing: account.max_dd_type === 'trailing' || account.max_dd_type === 'eod_trailing',
  });

  return calcAccountHealth(accountState, ruleSet);
}

function sortByRisk(accounts: AccountWithHealth[]): AccountWithHealth[] {
  const priority = { danger: 0, warning: 1, safe: 2 };
  return [...accounts].sort((a, b) => priority[a.health.status] - priority[b.health.status]);
}

function getDailyGuidance(accounts: AccountWithHealth[]): string {
  const danger = accounts.filter(a => a.health.status === 'danger');
  const warning = accounts.filter(a => a.health.status === 'warning');
  const safe = accounts.filter(a => a.health.status === 'safe');
  
  if (danger.length > 0) {
    return `Avoid trading ${danger[0].prop_firm} today — daily drawdown almost reached.`;
  }
  
  if (warning.length > 0) {
    return `${warning[0].prop_firm} is risky today — reduce position size.`;
  }
  
  if (safe.length > 0) {
    return `All accounts are safe. Trade with discipline on ${safe[0].prop_firm}.`;
  }
  
  return 'Add your first account to start tracking.';
}

// =============================================================================
// LOGGED OUT VIEW
// =============================================================================

function LoggedOutView() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          My Prop Firms
        </h1>
        
        <p className="text-gray-400 mb-2 leading-relaxed">
          Your personal control center for all prop firm accounts.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Track drawdowns, simulate trades, and avoid breaking rules — all in one place.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Log in to your workspace
          </Link>
          
          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
          >
            <Zap className="w-4 h-4" />
            Create free account
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600 mb-4">WHAT YOU GET</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Multi-account tracking</p>
              <p className="text-xs text-gray-500 mt-1">All firms in one view</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Trade simulation</p>
              <p className="text-xs text-gray-500 mt-1">Test before you risk</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Rule monitoring</p>
              <p className="text-xs text-gray-500 mt-1">Never break a rule</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Daily guidance</p>
              <p className="text-xs text-gray-500 mt-1">Know what to avoid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN WORKSPACE
// =============================================================================

async function Workspace({ userId }: { userId: string }) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch real accounts
  const { data: accounts } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const realAccounts = accounts || [];
  const isDemo = realAccounts.length === 0;

  // Use demo data if no real accounts exist
  const sourceAccounts = isDemo ? DEMO_ACCOUNTS : realAccounts;

  // Calculate health for each account
  const accountsWithHealth: AccountWithHealth[] = sourceAccounts.map((account) => ({
    ...account,
    health: calculateHealth(account as DbAccount),
  }));

  const sortedAccounts = sortByRisk(accountsWithHealth);
  
  // Stats
  const totalAccounts = sortedAccounts.length;
  const safeCount = sortedAccounts.filter(a => a.health.status === 'safe').length;
  const riskCount = sortedAccounts.filter(a => a.health.status === 'warning').length;
  const dangerCount = sortedAccounts.filter(a => a.health.status === 'danger').length;
  
  // Daily guidance
  const dailyGuidance = isDemo 
    ? DEMO_GUIDANCE_MESSAGE 
    : getDailyGuidance(sortedAccounts);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-white">My Prop Firms</h1>
                <p className="text-sm text-gray-500">Your trading control center</p>
              </div>
              {isDemo && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg">
                  Demo Mode
                </span>
              )}
            </div>
            <Link
              href="/dashboard/accounts/new"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Add Account
            </Link>
          </div>
        </div>
      </header>

      {/* Workspace Content */}
      <WorkspaceTabs
        accounts={sortedAccounts}
        totalAccounts={totalAccounts}
        safeCount={safeCount}
        riskCount={riskCount}
        dangerCount={dangerCount}
        dailyGuidance={dailyGuidance}
        isDemo={isDemo}
        demoGuidanceTips={isDemo ? DEMO_GUIDANCE_TIPS : undefined}
      />
    </div>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LoggedOutView />;
  }

  return <Workspace userId={user.id} />;
}
