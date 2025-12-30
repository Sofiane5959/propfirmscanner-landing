import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Zap, Shield } from 'lucide-react';

import { OverviewBar } from '@/components/my-propfirms/OverviewBar';
import { AccountCard } from '@/components/my-propfirms/AccountCard';
import { EmptyState } from '@/components/my-propfirms/EmptyState';
import { calcAccountHealth } from '@/lib/risk';
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

function getMainWarning(accounts: AccountWithHealth[]): string | null {
  const danger = accounts.filter(a => a.health.status === 'danger');
  const warning = accounts.filter(a => a.health.status === 'warning');
  
  if (danger.length > 0) {
    return danger.length === 1
      ? `${danger[0].prop_firm} is close to violation. Trade carefully.`
      : `${danger.length} accounts are close to violation.`;
  }
  
  if (warning.length > 0) {
    return warning.length === 1
      ? `${warning[0].prop_firm} buffer is low today.`
      : `${warning.length} accounts have low buffers.`;
  }
  
  return null;
}

// =============================================================================
// MARKETING (logged out)
// =============================================================================

function MarketingView() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">
          My Prop Firms
        </h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          Track all your accounts in one place.<br />
          Know what&apos;s safe before you trade.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/signup"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Zap className="w-5 h-5" />
            Start Tracking — Free
          </Link>
          
          <Link
            href="/auth/login"
            className="block w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Already tracking? Log in
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600 mb-4">WHAT YOU GET</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Daily risk check</p>
              <p className="text-xs text-gray-500 mt-1">See safe loss remaining</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Trade simulator</p>
              <p className="text-xs text-gray-500 mt-1">Test before you risk</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Hidden pitfalls</p>
              <p className="text-xs text-gray-500 mt-1">Rules you might miss</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">100+ firms</p>
              <p className="text-xs text-gray-500 mt-1">All rules pre-loaded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DASHBOARD
// =============================================================================

async function Dashboard({ userId }: { userId: string }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: accounts } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const accountsWithHealth: AccountWithHealth[] = (accounts || []).map((account) => ({
    ...account,
    health: calculateHealth(account),
  }));

  const sortedAccounts = sortByRisk(accountsWithHealth);
  const totalAccounts = sortedAccounts.length;
  const accountsAtRisk = sortedAccounts.filter(a => a.health.status !== 'safe').length;
  const mainWarning = getMainWarning(sortedAccounts);

  if (totalAccounts === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <OverviewBar
        totalAccounts={totalAccounts}
        accountsAtRisk={accountsAtRisk}
        mainWarning={mainWarning}
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-400">My Accounts</h2>
          <Link
            href="/dashboard/accounts/new"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            + Add
          </Link>
        </div>

        <div className="space-y-3">
          {sortedAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default async function MyPropFirmsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MarketingView />;
  }

  return <Dashboard userId={user.id} />;
}
