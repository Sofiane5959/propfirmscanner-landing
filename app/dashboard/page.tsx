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
            className="flex items-center justify-center gap-3 w-full py-3.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Se connecter avec Google
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600 mb-4">CE QUE VOUS OBTENEZ</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Multi-comptes</p>
              <p className="text-xs text-gray-500 mt-1">Toutes vos firms</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Simulation</p>
              <p className="text-xs text-gray-500 mt-1">Testez avant de risquer</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Règles</p>
              <p className="text-xs text-gray-500 mt-1">Ne cassez plus de règle</p>
            </div>
            <div className="p-3 bg-gray-900 rounded-lg">
              <p className="text-sm text-white font-medium">Guidance</p>
              <p className="text-xs text-gray-500 mt-1">Sachez quoi éviter</p>
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

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
}

async function Workspace({ user }: { user: UserInfo }) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch real accounts
  const { data: accounts } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('user_id', user.id)
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

  // Get first name for greeting
  const firstName = user.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full border-2 border-emerald-500/30"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                  <span className="text-lg font-bold text-emerald-400">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-xl font-bold text-white">
                  Bienvenue, {firstName} 👋
                </h1>
                <p className="text-sm text-gray-500">
                  {isDemo ? 'Ajoutez votre premier compte pour commencer' : `${totalAccounts} compte${totalAccounts > 1 ? 's' : ''} actif${totalAccounts > 1 ? 's' : ''}`}
                </p>
              </div>
              
              {isDemo && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg">
                  Demo
                </span>
              )}
            </div>
            
            <Link
              href="/dashboard/accounts/new"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Ajouter un compte
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

  // Extract user info
  const userInfo: UserInfo = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader',
    avatar: user.user_metadata?.avatar_url || null,
  };

  return <Workspace user={userInfo} />;
}
