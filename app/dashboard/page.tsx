import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  Plus, 
  Shield, 
  Zap, 
  Crown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Play,
  BarChart3,
  Lock
} from 'lucide-react';

// Import components for logged-in users
import { AccountCard } from '@/components/dashboard/AccountCard';
import { OverviewTiles } from '@/components/dashboard/OverviewTiles';
import { TodaysAssistant } from '@/components/dashboard/TodaysAssistant';
import { EmptyState } from '@/components/dashboard/EmptyState';
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
  created_at: string;
  updated_at: string;
}

interface AccountWithHealth extends DbAccount {
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

function sortByHealth(accounts: AccountWithHealth[]): AccountWithHealth[] {
  const priority = { danger: 0, warning: 1, safe: 2 };
  return [...accounts].sort((a, b) => priority[a.health.status] - priority[b.health.status]);
}

// =============================================================================
// DEMO DATA FOR SSR (shown to logged-out users)
// =============================================================================

const demoAccounts = [
  {
    id: 'demo-1',
    propFirm: 'FTMO',
    program: '$100K Challenge',
    balance: 98500,
    todayPnl: -1200,
    dailyBuffer: 76,
    maxBuffer: 85,
    status: 'warning' as const,
  },
  {
    id: 'demo-2',
    propFirm: 'FundedNext',
    program: '$50K Stellar',
    balance: 52300,
    todayPnl: 850,
    dailyBuffer: 92,
    maxBuffer: 78,
    status: 'safe' as const,
  },
  {
    id: 'demo-3',
    propFirm: 'MyFundedFX',
    program: '$200K',
    balance: 194200,
    todayPnl: -2800,
    dailyBuffer: 44,
    maxBuffer: 62,
    status: 'warning' as const,
  },
];

// =============================================================================
// MARKETING VIEW (SSR for logged-out users)
// =============================================================================

function MarketingView() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full mb-4">
            <Shield className="w-4 h-4" />
            Pro Tracker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Never Break a Prop Firm Rule Again
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Track all your accounts in one place. Get real-time warnings before you hit drawdown limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Zap className="w-5 h-5" />
              Start Free
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Demo Dashboard Preview */}
        <div className="relative">
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 pointer-events-none" />
          
          {/* Demo Overview Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 opacity-90">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Total Balance</span>
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">$345,000</p>
              <p className="text-sm text-gray-500 mt-1">Across 3 accounts</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Today&apos;s P&amp;L</span>
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-red-400">-$3,150</p>
              <p className="text-sm text-gray-500 mt-1">Stay disciplined</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Risk Status</span>
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-400">2 at Risk</p>
              <p className="text-sm text-gray-500 mt-1">Review warnings</p>
            </div>
          </div>

          {/* Demo Account Cards */}
          <div className="space-y-4 opacity-80">
            {demoAccounts.map((account) => (
              <div 
                key={account.id}
                className={`bg-gray-800 rounded-xl border ${
                  account.status === 'warning' 
                    ? 'border-yellow-500/30' 
                    : 'border-emerald-500/30'
                } p-4`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{account.propFirm[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{account.propFirm}</h3>
                      <p className="text-sm text-gray-400">{account.program}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    account.status === 'warning'
                      ? 'bg-yellow-500/20'
                      : 'bg-emerald-500/20'
                  }`}>
                    {account.status === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span className={`text-xs font-medium ${
                      account.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                    }`}>
                      {account.status === 'warning' ? 'Warning' : 'Healthy'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                    <p className="text-lg font-bold text-white">${account.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Today&apos;s P&amp;L</p>
                    <p className={`text-lg font-bold ${account.todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {account.todayPnl >= 0 ? '+' : ''}${account.todayPnl.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Daily DD Buffer</span>
                      <span className={account.dailyBuffer < 50 ? 'text-yellow-400' : 'text-emerald-400'}>
                        {account.dailyBuffer}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${account.dailyBuffer < 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                        style={{ width: `${account.dailyBuffer}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Max DD Buffer</span>
                      <span className={account.maxBuffer < 50 ? 'text-yellow-400' : 'text-emerald-400'}>
                        {account.maxBuffer}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${account.maxBuffer < 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                        style={{ width: `${account.maxBuffer}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Track Your Accounts
              </h2>
              <p className="text-gray-400 mb-6">
                Create a free account to start tracking your prop firm challenges.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  <Zap className="w-5 h-5" />
                  Start Free
                </Link>
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-Time Tracking</h3>
            <p className="text-gray-400">
              See your daily and max drawdown buffers update instantly as you log P&amp;L.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Trade Simulation</h3>
            <p className="text-gray-400">
              Test if your next trade is safe before risking real capital.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart Warnings</h3>
            <p className="text-gray-400">
              Get alerts before you accidentally break any prop firm rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// AUTHENTICATED DASHBOARD VIEW
// =============================================================================

async function AuthenticatedDashboard({ userId }: { userId: string }) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch user accounts
  const { data: accounts } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Fetch user limits
  const { data: limits } = await supabase
    .rpc('get_user_limits', { p_user_id: userId });

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
              Pro Tracker
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-400 text-sm font-medium rounded-lg"
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
                      Upgrade to Pro →
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

// =============================================================================
// MAIN PAGE COMPONENT (SSR-SAFE)
// =============================================================================

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, show marketing view (SSR-safe)
  if (!user) {
    return <MarketingView />;
  }

  // If logged in, show authenticated dashboard
  return <AuthenticatedDashboard userId={user.id} />;
}
