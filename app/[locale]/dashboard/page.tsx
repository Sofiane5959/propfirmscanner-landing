'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  BarChart3, Tag, Star, Settings, Shield, User, Calendar,
  Loader2, ChevronRight, Crown, Sparkles, Plus, Bell,
  Target, Wallet, GraduationCap, BookOpen, Lock, Zap,
  TrendingUp, AlertTriangle, CheckCircle2, Calculator,
  RefreshCw, X,
} from 'lucide-react';
import AccountOverview from '@/components/AccountOverview';

// =============================================================================
// LOCALE
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) return firstSegment as Locale;
  return 'en';
}

// =============================================================================
// TRADE SIMULATOR (Free — basic lot size calculator)
// =============================================================================

function TradeSimulator({ locale }: { locale: string }) {
  const [accountSize, setAccountSize] = useState('100000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [stopLossPips, setStopLossPips] = useState('20');
  const [pipValue, setPipValue] = useState('10');
  const [result, setResult] = useState<{ lots: number; riskAmount: number; safe: boolean } | null>(null);

  const calculate = () => {
    const acc = parseFloat(accountSize) || 0;
    const risk = parseFloat(riskPercent) / 100;
    const sl = parseFloat(stopLossPips) || 1;
    const pv = parseFloat(pipValue) || 10;
    const riskAmount = acc * risk;
    const lots = riskAmount / (sl * pv);
    setResult({ lots: Math.round(lots * 100) / 100, riskAmount: Math.round(riskAmount), safe: risk <= 0.02 });
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          Trade Simulator
        </h3>
        <span className="text-xs text-gray-500">Basic — Free</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Account size ($)</label>
          <input
            type="number"
            value={accountSize}
            onChange={e => setAccountSize(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Risk % per trade</label>
          <input
            type="number"
            value={riskPercent}
            onChange={e => setRiskPercent(e.target.value)}
            step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Stop loss (pips)</label>
          <input
            type="number"
            value={stopLossPips}
            onChange={e => setStopLossPips(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Pip value ($)</label>
          <input
            type="number"
            value={pipValue}
            onChange={e => setPipValue(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-3"
      >
        <Calculator className="w-4 h-4" />
        Calculate Lot Size
      </button>

      {result && (
        <div className={`rounded-lg p-3 border ${result.safe ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            {result.safe
              ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span className={`text-sm font-medium ${result.safe ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.safe ? 'Safe trade' : 'Risk too high!'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Lot size:</span>
            <span className="text-white font-bold">{result.lots} lots</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Risk amount:</span>
            <span className="text-white">${result.riskAmount}</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <Lock className="w-3 h-3 text-purple-400 shrink-0" />
        <p className="text-xs text-purple-300">
          Pro: drawdown alerts, rule violations checker, multi-account sim
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface Account {
  id: string;
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string | null;
  created_at: string;
}

interface DashboardStats {
  favorites: number;
  totalAccounts: number;
  totalProfit: number;
  activeAlerts: number;
}

export default function DashboardPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [stats, setStats] = useState<DashboardStats>({ favorites: 0, totalAccounts: 0, totalProfit: 0, activeAlerts: 0 });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) router.push('/');
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchCourseAccess = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('has_course_fundamentals').eq('id', user.id).single();
      setHasCourse(data?.has_course_fundamentals ?? false);
    };
    if (user) fetchCourseAccess();
  }, [user, supabase]);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;
      try {
        const { data } = await supabase.from('challenge_accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        setAccounts(data || []);
        const totalProfit = (data || []).reduce((sum, acc) => sum + (acc.current_balance - acc.initial_balance), 0);
        setStats(prev => ({ ...prev, totalAccounts: data?.length || 0, totalProfit }));
      } catch (e) { console.error(e); }
      finally { setLoadingAccounts(false); }
    };
    if (user) fetchAccounts();
  }, [user, supabase]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const { count: favCount } = await supabase.from('user_favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        const today = new Date().toISOString().split('T')[0];
        const { count: alertCount } = await supabase.from('alert_logs').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('sent_at', today);
        setFavoriteCount(favCount || 0);
        setStats(prev => ({ ...prev, favorites: favCount || 0, activeAlerts: alertCount || 0 }));
      } catch (e) { console.error(e); }
      finally { setLoadingStats(false); }
    };
    if (user) fetchStats();
  }, [user, supabase]);

  const getMemberSince = () => {
    if (!user?.created_at) return '';
    return new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm">Welcome back</p>
            <h1 className="text-2xl font-bold text-white">{displayName}!</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">Free plan</span>
            <Link
              href={`/${locale}/dashboard/upgrade`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade Pro</span>
              <span className="flex items-center gap-1">
                <span className="line-through text-purple-300 text-xs">$49.99</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded">$29.99 · First 100</span>
              </span>
            </Link>
          </div>
        </div>

        {/* ── My Course Hero Card ─────────────────────────────────────────── */}
        {hasCourse ? (
          <Link
            href={`/${locale}/education/fundamentals`}
            className="flex items-center justify-between bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 rounded-xl p-5 mb-6 hover:border-emerald-500/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">My Course</p>
                <p className="text-white font-semibold">Prop Firm Fundamentals</p>
                <p className="text-gray-400 text-sm">10 lessons · 17 audio files · 8 quizzes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500 group-hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
              Access course →
            </div>
          </Link>
        ) : (
          <Link
            href={`/${locale}/education`}
            className="flex items-center justify-between bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-5 mb-6 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Course</p>
                <p className="text-white font-semibold">Prop Firm Fundamentals</p>
                <p className="text-gray-400 text-sm">Get lifetime access — $69.99</p>
              </div>
            </div>
            <div className="border border-emerald-500 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium">
              Get Access →
            </div>
          </Link>
        )}

        {/* ── Add Account Button ──────────────────────────────────────────── */}
        <div className="flex justify-end mb-6">
          <Link
            href={`/${locale}/dashboard/accounts/new`}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Challenge Account
          </Link>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg"><Wallet className="w-5 h-5 text-emerald-500" /></div>
              <span className="text-gray-400 text-sm">Total Profit</span>
            </div>
            <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {loadingStats ? '—' : `${stats.totalProfit >= 0 ? '+' : ''}$${stats.totalProfit.toLocaleString()}`}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Target className="w-5 h-5 text-blue-500" /></div>
              <span className="text-gray-400 text-sm">Active Challenges</span>
            </div>
            <p className="text-2xl font-bold text-white">{loadingStats ? '—' : stats.totalAccounts}</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg"><Star className="w-5 h-5 text-yellow-500" /></div>
              <span className="text-gray-400 text-sm">Favorite Firms</span>
            </div>
            <p className="text-2xl font-bold text-white">{loadingStats ? '—' : stats.favorites}</p>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg"><Bell className="w-5 h-5 text-purple-500" /></div>
              <span className="text-gray-400 text-sm">Alerts Today</span>
            </div>
            <p className="text-2xl font-bold text-white">{loadingStats ? '—' : stats.activeAlerts}</p>
          </div>
        </div>

        {/* ── Main Layout ─────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left col — Challenge Tracker + Simulator */}
          <div className="lg:col-span-2 space-y-6">

            {/* Challenge Tracker */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Challenge Tracker
                </h2>
                <Link href={`/${locale}/dashboard/accounts`} className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingAccounts ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No challenges yet</h3>
                  <p className="text-gray-400 text-sm mb-2">Track your prop firm challenges — drawdown, daily loss, profit target</p>
                  <p className="text-gray-500 text-xs mb-4">Never accidentally violate a rule again</p>
                  <Link
                    href={`/${locale}/dashboard/accounts/new`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Challenge
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.slice(0, 2).map((account) => (
                    <AccountOverview key={account.id} account={account} />
                  ))}
                  {accounts.length > 2 && (
                    <Link
                      href={`/${locale}/dashboard/accounts`}
                      className="block text-center py-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
                    >
                      View {accounts.length - 2} more challenges
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Trade Simulator */}
            <TradeSimulator locale={locale} />

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-4 mb-4">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-14 h-14 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-emerald-400" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white">{displayName}</h2>
                  <p className="text-sm text-gray-500 truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Member since</span>
                  <span className="text-gray-300">{getMemberSince()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2"><Crown className="w-4 h-4" /> Plan</span>
                  <span className="text-emerald-400">Free</span>
                </div>
              </div>
              <Link
                href={`/${locale}/dashboard/settings`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>

            {/* Favorite Firms */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Favorite Firms
                </h3>
                <Link href={`/${locale}/dashboard/favorites`} className="text-emerald-400 hover:text-emerald-300 text-xs">
                  View all →
                </Link>
              </div>
              {favoriteCount === 0 ? (
                <div className="text-center py-2">
                  <p className="text-gray-500 text-sm mb-3">No favorites yet</p>
                  <Link
                    href={`/${locale}/compare`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-xs"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Browse 90+ firms →
                  </Link>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{favoriteCount} firms saved</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href={`/${locale}/compare`} className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300 text-sm">Compare Firms</span>
                </Link>
                <Link href={`/${locale}/deals`} className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <Tag className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300 text-sm">View Deals</span>
                </Link>
                <Link href={`/${locale}/dashboard/favorites`} className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 text-sm">My Favorites</span>
                </Link>
                <Link href={`/${locale}/dashboard/settings`} className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 text-sm">Alert Settings</span>
                </Link>
              </div>
            </div>

            {/* Pro Banner */}
            <div className="bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold text-white">Unlock Pro</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {[
                  'Unlimited challenge accounts',
                  'Drawdown alerts & rule checker',
                  'Economic calendar',
                  'Advanced trade simulator',
                  'Trading ideas (educational)',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/dashboard/upgrade`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Zap className="w-4 h-4" />
                <span>$29.99/mo</span>
                <span className="text-purple-200 line-through text-xs">$49.99</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded">First 100</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
