import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, ChevronRight, Crown } from 'lucide-react';
import { AccountCard } from '@/components/dashboard/AccountCard';
import { OverviewTiles } from '@/components/dashboard/OverviewTiles';
import { TodaysAssistant } from '@/components/dashboard/TodaysAssistant';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { 
  calcAccountHealth, 
  createRuleSet,
  type AccountState,
  type RuleSet 
} from '@/lib/risk';

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

interface UserLimits {
  plan: 'free' | 'pro';
  is_pro: boolean;
  accounts_count: number;
  accounts_limit: number;
  can_create_account: boolean;
  simulations_today: number;
  simulations_limit: number;
  can_simulate: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateHealth(account: DbAccount): AccountWithHealth['health'] {
  const accountState: AccountState = {
    start_balance_usd: account.start_balance,
    current_balance_usd: account.current_balance,
    current_equity_usd: account.current_equity ?? undefined,
    today_pnl_usd: account.today_pnl,
    trail_high_watermark_usd: account.trail_high_watermark ?? undefined,
  };

  const ruleSet: RuleSet = createRuleSet({
    dailyLimitPct: account.daily_dd_percent,
    maxLimitPct: account.max_dd_percent,
    basis: 'balance',
    isTrailing: account.max_dd_type === 'trailing' || account.max_dd_type === 'eod_trailing',
  });

  const health = calcAccountHealth(accountState, ruleSet);

  return {
    status: health.status,
    daily: health.daily,
    max: health.max,
    messages: health.messages,
  };
}

function sortByHealth(accounts: AccountWithHealth[]): AccountWithHealth[] {
  const priority = { danger: 0, warning: 1, safe: 2 };
  return [...accounts].sort((a, b) => priority[a.health.status] - priority[b.health.status]);
}

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login?redirect=/dashboard');
  }

  // Fetch user accounts
  const { data: accounts, error: accountsError } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch user limits
  const { data: limits } = await supabase
    .rpc('get_user_limits', { p_user_id: user.id });

  // Calculate health for each account
  const accountsWithHealth: AccountWithHealth[] = (accounts || []).map((account) => ({
    ...account,
    health: calculateHealth(account),
  }));

  // Sort by health (danger first)
  const sortedAccounts = sortByHealth(accountsWithHealth);

  // Calculate overview stats
  const totalBalance = sortedAccounts.reduce((sum, a) => sum + a.current_balance, 0);
  const todayPnl = sortedAccounts.reduce((sum, a) => sum + a.today_pnl, 0);
  const accountsAtRisk = sortedAccounts.filter(a => a.health.status !== 'safe').length;

  // Get warnings for Today's Assistant
  const warnings = sortedAccounts
    .filter((a): a is AccountWithHealth & { health: { status: 'warning' | 'danger' } } => 
      a.health.status !== 'safe'
    )
    .flatMap(a => a.health.messages.map(msg => ({
      accountId: a.id,
      propFirm: a.prop_firm,
      message: msg,
      status: a.health.status as 'warning' | 'danger',
    })))
    .slice(0, 5);

  const userLimits = limits as UserLimits | null;

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Control Center
              {userLimits?.is_pro && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                  <Crown className="w-3 h-3" />
                  PRO
                </span>
              )}
            </h1>
            <p className="text-gray-400 mt-1">
              Track all your prop firm accounts in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!userLimits?.is_pro && (
              <Link
                href="/dashboard/upgrade"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all"
              >
                <Zap className="w-4 h-4" />
                Upgrade
              </Link>
            )}
            
            {userLimits?.can_create_account ? (
              <Link
                href="/dashboard/accounts/new"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </Link>
            ) : (
              <Link
                href="/dashboard/upgrade"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
                title="Upgrade to Pro for more accounts"
              >
                <Plus className="w-4 h-4" />
                Add Account
                <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded">PRO</span>
              </Link>
            )}
          </div>
        </div>

        {sortedAccounts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Overview Tiles */}
              <OverviewTiles
                totalBalance={totalBalance}
                todayPnl={todayPnl}
                accountsAtRisk={accountsAtRisk}
                totalAccounts={sortedAccounts.length}
              />

              {/* Account Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Your Accounts</h2>
                  <span className="text-sm text-gray-400">
                    Sorted by risk level
                  </span>
                </div>

                <div className="grid gap-4">
                  {sortedAccounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      canSimulate={userLimits?.can_simulate ?? false}
                    />
                  ))}
                </div>
              </div>

              {/* Usage indicator for free users */}
              {!userLimits?.is_pro && userLimits && (
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Free Plan Usage</span>
                    <Link
                      href="/dashboard/upgrade"
                      className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Upgrade to Pro
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Accounts</span>
                        <span className="text-gray-400">
                          {userLimits.accounts_count}/{userLimits.accounts_limit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            userLimits.accounts_count >= userLimits.accounts_limit
                              ? 'bg-red-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (userLimits.accounts_count / userLimits.accounts_limit) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Simulations today</span>
                        <span className="text-gray-400">
                          {userLimits.simulations_today}/{userLimits.simulations_limit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            userLimits.simulations_today >= userLimits.simulations_limit
                              ? 'bg-red-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (userLimits.simulations_today / userLimits.simulations_limit) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Today's Assistant */}
            <div className="lg:col-span-1">
              <TodaysAssistant warnings={warnings} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
