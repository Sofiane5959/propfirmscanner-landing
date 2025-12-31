import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Zap, Shield } from 'lucide-react';

import { TodayOverview } from '@/components/my-propfirms/TodayOverview';
import { AccountCard } from '@/components/my-propfirms/AccountCard';
import { TradingAssistant } from '@/components/my-propfirms/TradingAssistant';
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

function getCentralMessage(accounts: AccountWithHealth[]): string {
  const danger = accounts.filter(a => a.health.status === 'danger');
  const warning = accounts.filter(a => a.health.status === 'warning');
  const safe = accounts.filter(a => a.health.status === 'safe');
  
  if (danger.length > 0) {
    return `Avoid trading ${danger[0].prop_firm} today — daily drawdown almost reached.`;
  }
  
  if (warning.length > 0) {
    return `${warning[0].prop_firm} is risky today — reduce trade size.`;
  }
  
  if (safe.length > 0) {
    return `${safe[0].prop_firm} is safe to trade with controlled risk.`;
  }
  
  return 'Add an account to start tracking.';
}

function getTradingAssistantMessages(accounts: AccountWithHealth[]): string[] {
  const messages: string[] = [];
  
  const hasTrailing = accounts.some(a => a.max_dd_type !== 'static');
  const hasDanger = accounts.some(a => a.health.status === 'danger');
  const hasUnmetDays = accounts.some(a => a.current_trading_days < a.min_trading_days);
  const hasSafe = accounts.some(a => a.health.status === 'safe');
  
  if (hasTrailing) {
    messages.push('Avoid trading trailing drawdown accounts after profits.');
  }
  
  if (hasDanger && hasSafe) {
    messages.push('Focus on green accounts to reduce failure risk.');
  }
  
  if (hasUnmetDays) {
    messages.push("Profits today won't count on accounts with unmet minimum days.");
  }
  
  if (messages.length === 0) {
    messages.push('All accounts are within safe limits. Trade with discipline.');
  }
  
  return messages.slice(0, 3);
}

// =============================================================================
// MARKETING VIEW (logged out)
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
          See all your prop firm accounts.<br />
          Know your limits before you trade.
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
          <p className="text-xs text-gray-600 mb-4">ANSWER IN 5 SECONDS</p>
          <p className="text-lg text-white font-medium">
            &ldquo;Can I trade today, on which account, and with what risk?&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD
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
  
  // Counts
  const totalAccounts = sortedAccounts.length;
  const safeCount = sortedAccounts.filter(a => a.health.status === 'safe').length;
  const riskCount = sortedAccounts.filter(a => a.health.status === 'warning').length;
  const dangerCount = sortedAccounts.filter(a => a.health.status === 'danger').length;
  
  // Central message
  const centralMessage = getCentralMessage(sortedAccounts);
  
  // Trading assistant messages
  const assistantMessages = getTradingAssistantMessages(sortedAccounts);

  if (totalAccounts === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-12">
      {/* SECTION 0 — HEADER */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white mb-1">My Prop Firms</h1>
          <p className="text-gray-400 text-sm">
            See all your prop firm accounts. Know your limits before you trade.
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4">
        {/* SECTION 1 — TODAY OVERVIEW */}
        <TodayOverview
          totalAccounts={totalAccounts}
          safeCount={safeCount}
          riskCount={riskCount}
          dangerCount={dangerCount}
          centralMessage={centralMessage}
        />

        {/* SECTION 2 — MY ACCOUNTS */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">My Accounts</h2>
            <Link
              href="/dashboard/accounts/new"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              + Add account
            </Link>
          </div>

          <div className="space-y-4">
            {sortedAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </section>

        {/* SECTION 4 — TRADING ASSISTANT */}
        <TradingAssistant messages={assistantMessages} />
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
