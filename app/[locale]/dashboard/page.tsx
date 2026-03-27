'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  BarChart3, Tag, Star, Settings, User, Calendar,
  Loader2, ChevronRight, Crown, Sparkles, Plus, Bell,
  Target, Wallet, GraduationCap, Lock, Zap,
  AlertTriangle, CheckCircle2, Calculator, TrendingUp,
  Shield, Activity, BookOpen, ExternalLink, RefreshCw,
} from 'lucide-react';
import AccountOverview from '@/components/AccountOverview';

// =============================================================================
// LOCALE
// =============================================================================
const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];
function getLocaleFromPath(p: string): Locale {
  const s = p.split('/')[1];
  return locales.includes(s as Locale) ? (s as Locale) : 'en';
}

// =============================================================================
// CHALLENGE CARD — Visual Drawdown Tracker
// =============================================================================
function ChallengeCard({ account, locale }: { account: any; locale: string }) {
  const balance = account.current_balance || account.initial_balance;
  const pnl = balance - account.initial_balance;
  const pnlPct = ((pnl / account.initial_balance) * 100);

  // Drawdown calc
  const maxDD = account.max_drawdown || 10;
  const dailyLimit = account.daily_loss_limit || 5;
  const target = account.profit_target || 10;
  const dailyLoss = account.current_daily_loss || 0;

  const ddUsed = Math.abs(Math.min(pnlPct, 0));
  const ddPct = Math.min((ddUsed / maxDD) * 100, 100);
  const dailyPct = Math.min((Math.abs(dailyLoss) / (account.initial_balance * dailyLimit / 100)) * 100, 100);
  const targetPct = Math.min((Math.max(pnlPct, 0) / target) * 100, 100);

  const ddDanger = ddPct > 75;
  const dailyDanger = dailyPct > 75;
  const ddWarning = ddPct > 50;

  return (
    <div className={`bg-gray-900/60 rounded-xl border p-5 ${ddDanger || dailyDanger ? 'border-red-500/50' : ddWarning ? 'border-yellow-500/30' : 'border-gray-800'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold">{account.account_name || account.firm_name}</p>
            {(ddDanger || dailyDanger) && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded-full animate-pulse">
                <AlertTriangle className="w-3 h-3" /> At risk
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">{account.firm_name} · ${account.initial_balance?.toLocaleString()}</p>
        </div>
        <div className={`text-right`}>
          <p className={`text-lg font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {pnl >= 0 ? '+' : ''}${Math.round(pnl).toLocaleString()}
          </p>
          <p className={`text-xs ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        {/* Max Drawdown */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Max Drawdown</span>
            <span className={ddDanger ? 'text-red-400 font-medium' : ddWarning ? 'text-yellow-400' : 'text-gray-400'}>
              {ddUsed.toFixed(2)}% / {maxDD}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${ddDanger ? 'bg-red-500' : ddWarning ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${ddPct}%` }}
            />
          </div>
        </div>

        {/* Daily Loss */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Daily Loss</span>
            <span className={dailyDanger ? 'text-red-400 font-medium' : 'text-gray-400'}>
              ${Math.abs(Math.round(dailyLoss)).toLocaleString()} / ${Math.round(account.initial_balance * dailyLimit / 100).toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${dailyDanger ? 'bg-red-500' : dailyPct > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${dailyPct}%` }}
            />
          </div>
        </div>

        {/* Profit Target */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Profit Target</span>
            <span className={targetPct >= 100 ? 'text-emerald-400 font-medium' : 'text-gray-400'}>
              {pnlPct >= 0 ? pnlPct.toFixed(2) : '0.00'}% / {target}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${targetPct >= 100 ? 'bg-emerald-400' : 'bg-purple-500'}`}
              style={{ width: `${targetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        {account.challenge_end_date ? (
          <span className="text-xs text-gray-500">
            Ends: {new Date(account.challenge_end_date).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-xs text-gray-600">No end date</span>
        )}
        <Link
          href={`/${locale}/dashboard/accounts/${account.id}`}
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          Details <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// TRADE SIMULATOR
// =============================================================================
function TradeSimulator() {
  const [accountSize, setAccountSize] = useState('100000');
  const [riskPct, setRiskPct] = useState('1');
  const [slPips, setSlPips] = useState('20');
  const [pipValue, setPipValue] = useState('10');
  const [maxDDRemaining, setMaxDDRemaining] = useState('8');
  const [result, setResult] = useState<any>(null);

  const calc = () => {
    const acc = parseFloat(accountSize) || 0;
    const risk = parseFloat(riskPct) / 100;
    const sl = parseFloat(slPips) || 1;
    const pv = parseFloat(pipValue) || 10;
    const ddRem = parseFloat(maxDDRemaining) / 100;
    const riskAmount = acc * risk;
    const lots = riskAmount / (sl * pv);
    const violatesDD = riskAmount > acc * ddRem * 0.5;
    const tooRisky = risk > 0.02;
    setResult({
      lots: Math.round(lots * 100) / 100,
      riskAmount: Math.round(riskAmount),
      safe: !violatesDD && !tooRisky,
      warning: violatesDD ? `Risk exceeds 50% of remaining drawdown buffer!` : tooRisky ? 'Risk > 2% — dangerous for prop firm' : null,
    });
  };

  return (
    <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          Trade Simulator
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs text-gray-500">Rule Checker Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Account size ($)</label>
          <input type="number" value={accountSize} onChange={e => setAccountSize(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Risk % per trade</label>
          <input type="number" value={riskPct} onChange={e => setRiskPct(e.target.value)} step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Stop loss (pips)</label>
          <input type="number" value={slPips} onChange={e => setSlPips(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Pip value ($)</label>
          <input type="number" value={pipValue} onChange={e => setPipValue(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">Max DD remaining (%)</label>
          <input type="number" value={maxDDRemaining} onChange={e => setMaxDDRemaining(e.target.value)} step="0.1"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <button onClick={calc}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-3">
        <Calculator className="w-4 h-4" /> Check Trade → Safe?
      </button>

      {result && (
        <div className={`rounded-lg p-3 border ${result.safe ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.safe
              ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span className={`text-sm font-semibold ${result.safe ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.safe ? '✓ Safe to trade' : '✗ Rule violation risk!'}
            </span>
          </div>
          {result.warning && <p className="text-xs text-red-300 mb-2">{result.warning}</p>}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800/50 rounded p-2">
              <p className="text-gray-500 text-xs">Lot size</p>
              <p className="text-white font-bold">{result.lots}</p>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <p className="text-gray-500 text-xs">Risk amount</p>
              <p className="text-white font-bold">${result.riskAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// ECONOMIC CALENDAR — Real data from Forex Factory
// =============================================================================
const CURRENCY_FLAGS_DASH: Record<string, string> = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵',
  AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭', NZD: '🇳🇿',
};

interface CalendarEvent {
  title: string;
  country: string;
  date: string;
  time: string;
  impact: 'High' | 'Medium' | 'Low' | 'Holiday';
  forecast: string;
  previous: string;
  actual: string;
}

function isTodayDash(dateStr: string): boolean {
  return dateStr.startsWith(new Date().toISOString().split('T')[0]);
}

function formatTimeDash(timeStr: string): string {
  if (!timeStr || timeStr === 'All Day' || timeStr === 'Tentative') return timeStr || '';
  try {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  } catch { return timeStr; }
}

function EconomicCalendarLocked({ locale }: { locale: string }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then((data: CalendarEvent[]) => {
        const today = data
          .filter(e => isTodayDash(e.date) && (e.impact === 'High' || e.impact === 'Medium'))
          .slice(0, 5);
        setEvents(today);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const highCount = events.filter(e => e.impact === 'High').length;

  return (
    <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Economic Calendar
          {highCount > 0 && (
            <span className="px-2 py-0.5 bg-red-900/40 text-red-400 text-xs rounded-full border border-red-800/50">
              {highCount} high impact
            </span>
          )}
        </h3>
        <Link href={`/${locale}/dashboard/calendar`} className="text-xs text-blue-400 hover:text-blue-300 transition">
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No high-impact events today 🎉</p>
          <Link href={`/${locale}/dashboard/calendar`} className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-block">
            View this week →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              event.impact === 'High' ? 'bg-red-900/10 border border-red-900/30' : 'bg-gray-800/60'
            }`}>
              <span className="text-sm w-4 shrink-0">{event.impact === 'High' ? '🔴' : '🟡'}</span>
              <span className="text-xs text-gray-400 w-16 shrink-0 font-mono">{formatTimeDash(event.time)}</span>
              <span className="text-xs text-gray-300 shrink-0">{CURRENCY_FLAGS_DASH[event.country] || ''} {event.country}</span>
              <span className="text-xs text-white truncate flex-1">{event.title}</span>
              {event.actual ? (
                <span className="text-xs text-green-400 shrink-0">{event.actual}</span>
              ) : event.forecast ? (
                <span className="text-xs text-gray-500 shrink-0">F: {event.forecast}</span>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
        <p className="text-xs text-gray-600">Source: Forex Factory</p>
        <div className="flex gap-3 text-xs text-gray-600">
          <span>🔴 High</span>
          <span>🟡 Medium</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// TRADING IDEAS (Pro — educational mock)
// =============================================================================
function TradingIdeasLocked({ locale }: { locale: string }) {
  const ideas = [
    { pair: 'EUR/USD', direction: 'LONG', rr: '1:3', setup: 'Support retest at 1.0820', risk: 'LOW' },
    { pair: 'GBP/USD', direction: 'SHORT', rr: '1:2.5', setup: 'Resistance rejection 1.2750', risk: 'MED' },
    { pair: 'XAU/USD', direction: 'LONG', rr: '1:4', setup: 'HTF demand zone $2,310', risk: 'LOW' },
  ];
  return (
    <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Trading Ideas
        </h3>
        <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Crown className="w-3 h-3" /> Pro · Educational only
        </span>
      </div>
      <div className="space-y-2 blur-sm pointer-events-none select-none">
        {ideas.map((idea, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${idea.direction === 'LONG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {idea.direction}
              </span>
              <span className="text-sm text-white">{idea.pair}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{idea.setup}</p>
              <p className="text-xs text-purple-400">R:R {idea.rr}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 rounded-xl">
        <Link href={`/${locale}/dashboard/upgrade`}
          className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-sm text-white font-medium">Educational ideas only</p>
          <p className="text-xs text-gray-400">Not financial advice · Pro feature</p>
          <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full">Upgrade →</span>
        </Link>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DASHBOARD
// =============================================================================
interface Account {
  id: string; account_name: string; firm_name: string;
  initial_balance: number; current_balance: number;
  max_drawdown: number; daily_loss_limit: number; profit_target: number;
  current_daily_loss: number; challenge_end_date: string | null; created_at: string;
}

export default function DashboardPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => { if (!isLoading && !user) router.push('/'); }, [user, isLoading, router]);

  const fetchData = async () => {
    if (!user) return;
    setLoadingAccounts(true);
    try {
      const [{ data: accs }, { data: prof }, { count: favs }] = await Promise.all([
        supabase.from('challenge_accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('has_course_fundamentals').eq('id', user.id).single(),
        supabase.from('user_favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      setAccounts(accs || []);
      setHasCourse(prof?.has_course_fundamentals ?? false);
      setFavoriteCount(favs || 0);
      setTotalProfit((accs || []).reduce((s, a) => s + (a.current_balance - a.initial_balance), 0));
      setLastUpdated(new Date());
    } catch (e) { console.error(e); }
    finally { setLoadingAccounts(false); }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );
  if (!user) return null;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const atRiskCount = accounts.filter(a => {
    const pnlPct = ((a.current_balance - a.initial_balance) / a.initial_balance) * 100;
    const ddUsed = Math.abs(Math.min(pnlPct, 0));
    return ddUsed / (a.max_drawdown || 10) > 0.75;
  }).length;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
              : <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-emerald-400" /></div>
            }
            <div>
              <p className="text-gray-400 text-xs">Welcome back</p>
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
            </div>
            {atRiskCount > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded-full animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                {atRiskCount} account{atRiskCount > 1 ? 's' : ''} at risk
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 text-gray-500 hover:text-white transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-600">Updated {lastUpdated.toLocaleTimeString()}</span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">Free plan</span>
            <Link href={`/${locale}/dashboard/upgrade`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Pro</span>
              <span className="line-through text-purple-300 text-xs">$49.99</span>
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded">$29.99 · First 100</span>
            </Link>
          </div>
        </div>

        {/* ── MY COURSE HERO ─────────────────────────────────────────────── */}
        {hasCourse ? (
          <Link href={`/${locale}/education/fundamentals`}
            className="flex items-center justify-between bg-gradient-to-r from-emerald-900/60 to-teal-900/50 border border-emerald-500/30 rounded-xl p-5 mb-6 hover:border-emerald-400/60 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-0.5">My Course</p>
                <p className="text-white font-semibold">Prop Firm Fundamentals</p>
                <p className="text-gray-400 text-sm">10 lessons · 17 audio files · 8 interactive quizzes</p>
              </div>
            </div>
            <div className="bg-emerald-500 group-hover:bg-emerald-400 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium">
              Continue learning →
            </div>
          </Link>
        ) : (
          <Link href={`/${locale}/education`}
            className="flex items-center justify-between bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-5 mb-6 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Course</p>
                <p className="text-white font-semibold">Prop Firm Fundamentals</p>
                <p className="text-gray-400 text-sm">Learn how to pass any prop firm challenge · $69.99 lifetime</p>
              </div>
            </div>
            <div className="border border-emerald-500 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-emerald-500/10 transition-colors">
              Get Access →
            </div>
          </Link>
        )}

        {/* ── STATS ROW ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Wallet className="w-4 h-4 text-emerald-500" /></div>
              <span className="text-gray-400 text-xs">Total P&L</span>
            </div>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {totalProfit >= 0 ? '+' : ''}${Math.round(totalProfit).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-500/10 rounded-lg"><Activity className="w-4 h-4 text-blue-500" /></div>
              <span className="text-gray-400 text-xs">Active Challenges</span>
            </div>
            <p className="text-2xl font-bold text-white">{accounts.length}</p>
          </div>
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-red-500/10 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-500" /></div>
              <span className="text-gray-400 text-xs">Accounts at Risk</span>
            </div>
            <p className={`text-2xl font-bold ${atRiskCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{atRiskCount}</p>
          </div>
          <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-yellow-500/10 rounded-lg"><Star className="w-4 h-4 text-yellow-500" /></div>
              <span className="text-gray-400 text-xs">Favorite Firms</span>
            </div>
            <p className="text-2xl font-bold text-white">{favoriteCount}</p>
          </div>
        </div>

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COL — Challenge Tracker + Simulator */}
          <div className="lg:col-span-2 space-y-6">

            {/* Challenge Tracker */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Challenge Tracker
                  <span className="text-xs text-gray-500 font-normal">— Real-time drawdown monitoring</span>
                </h2>
                <div className="flex items-center gap-2">
                  <Link href={`/${locale}/dashboard/accounts/new`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs font-medium">
                    <Plus className="w-3.5 h-3.5" /> Add Challenge
                  </Link>
                  <Link href={`/${locale}/dashboard/accounts`}
                    className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1">
                    All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {loadingAccounts ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-gray-900/50 rounded-xl border border-dashed border-gray-700 p-10 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No challenges tracked yet</h3>
                  <p className="text-gray-400 text-sm mb-1">Add your prop firm challenge to monitor:</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-5 mt-2">
                    {['Max Drawdown', 'Daily Loss Limit', 'Profit Target', 'Rule Compliance'].map(f => (
                      <span key={f} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                  <Link href={`/${locale}/dashboard/accounts/new`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" /> Track My First Challenge
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.slice(0, 3).map(a => <ChallengeCard key={a.id} account={a} locale={locale} />)}
                  {accounts.length > 3 && (
                    <Link href={`/${locale}/dashboard/accounts`}
                      className="flex items-center justify-center gap-2 py-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors text-sm">
                      View {accounts.length - 3} more challenges <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Trade Simulator */}
            <TradeSimulator />

            {/* Economic Calendar */}
            <EconomicCalendarLocked locale={locale} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">

            {/* Profile + Settings */}
            <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                {avatarUrl
                  ? <img src={avatarUrl} alt={displayName} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                  : <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-emerald-400" /></div>
                }
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{displayName}</p>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="text-gray-500 flex items-center gap-1.5"><Crown className="w-3 h-3" /> Plan</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <Link href={`/${locale}/dashboard/settings`}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>

            {/* Favorite Firms */}
            <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" /> Favorite Firms
                </h3>
                <Link href={`/${locale}/dashboard/favorites`} className="text-emerald-400 text-xs">View all →</Link>
              </div>
              {favoriteCount === 0 ? (
                <div className="text-center py-3">
                  <p className="text-gray-500 text-sm mb-3">No favorites saved yet</p>
                  <Link href={`/${locale}/compare`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors">
                    <BarChart3 className="w-3.5 h-3.5" /> Browse 90+ firms
                  </Link>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">{favoriteCount} firms saved</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-5">
              <h3 className="font-medium text-white mb-3 text-sm">Quick Actions</h3>
              <div className="space-y-1.5">
                {[
                  { icon: BarChart3, label: 'Compare Firms', href: `/${locale}/compare`, color: 'text-emerald-400' },
                  { icon: Tag, label: 'View Deals', href: `/${locale}/deals`, color: 'text-yellow-400' },
                  { icon: Star, label: 'My Favorites', href: `/${locale}/dashboard/favorites`, color: 'text-gray-400' },
                  { icon: BookOpen, label: 'Rules Database', href: `/${locale}/dashboard/rules`, color: 'text-blue-400' },
                  { icon: Bell, label: 'Alert Settings', href: `/${locale}/dashboard/settings`, color: 'text-purple-400' },
                ].map((item, i) => (
                  <Link key={i} href={item.href}
                    className="flex items-center gap-3 p-2.5 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trading Ideas */}
            <TradingIdeasLocked locale={locale} />

            {/* Pro Banner */}
            <div className="bg-gradient-to-br from-purple-900/40 to-gray-900 border border-purple-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white text-sm">Unlock Pro</h3>
              </div>
              <ul className="space-y-1.5 mb-4">
                {[
                  'Unlimited challenge accounts',
                  'Drawdown breach alerts',
                  'Economic calendar (daily)',
                  'Educational trading ideas',
                  'Advanced trade simulator',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/dashboard/upgrade`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
                <Zap className="w-4 h-4" />
                <span className="line-through text-purple-300 text-xs">$49.99</span>
                <span>$29.99/mo</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded">First 100</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
