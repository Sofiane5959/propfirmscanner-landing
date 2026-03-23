'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  ChevronLeft, Edit, Loader2, Target, AlertTriangle,
  CheckCircle2, TrendingUp, TrendingDown, Calendar,
  Wallet, Activity, Shield, RefreshCw, Trash2,
} from 'lucide-react';

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];
function getLocaleFromPath(p: string): Locale {
  const s = p.split('/')[1];
  return locales.includes(s as Locale) ? (s as Locale) : 'en';
}

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

function ProgressBar({ label, used, max, unit = '%', color }: {
  label: string; used: number; max: number; unit?: string; color: 'red' | 'yellow' | 'blue' | 'green' | 'purple';
}) {
  const pct = Math.min((Math.abs(used) / Math.abs(max)) * 100, 100);
  const colors = {
    red: pct > 75 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-emerald-500',
    yellow: pct > 75 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-blue-500',
    blue: 'bg-blue-500',
    green: pct >= 100 ? 'bg-emerald-400' : 'bg-purple-500',
    purple: 'bg-purple-500',
  };
  const textColor = pct > 75 ? 'text-red-400' : pct > 50 ? 'text-yellow-400' : 'text-gray-400';

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>
          {Math.abs(used).toFixed(2)}{unit} / {Math.abs(max)}{unit}
        </span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-600">0</span>
        <span className={`text-xs font-medium ${pct > 75 ? 'text-red-400' : 'text-gray-500'}`}>
          {pct.toFixed(1)}% used
        </span>
        <span className="text-xs text-gray-600">{Math.abs(max)}{unit}</span>
      </div>
    </div>
  );
}

export default function AccountDetailPage() {
  const pathname = usePathname();
  const params = useParams();
  const locale = getLocaleFromPath(pathname);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/');
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetch = async () => {
      if (!user || !params.id) return;
      const { data } = await supabase
        .from('challenge_accounts')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();
      if (!data) { router.push(`/${locale}/dashboard/accounts`); return; }
      setAccount(data);
      setLoading(false);
    };
    if (user) fetch();
  }, [user, params.id]);

  const handleDelete = async () => {
    if (!account) return;
    setDeleting(true);
    await supabase.from('challenge_accounts').delete().eq('id', account.id);
    router.push(`/${locale}/dashboard`);
  };

  if (isLoading || loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
    </div>
  );
  if (!account) return null;

  const pnl = account.current_balance - account.initial_balance;
  const pnlPct = (pnl / account.initial_balance) * 100;
  const ddUsed = Math.abs(Math.min(pnlPct, 0));
  const ddPct = Math.min((ddUsed / account.max_drawdown) * 100, 100);
  const targetPct = Math.min((Math.max(pnlPct, 0) / account.profit_target) * 100, 100);
  const dailyUsed = Math.abs(account.current_daily_loss || 0);
  const dailyLimit = account.initial_balance * account.daily_loss_limit / 100;

  const isAtRisk = ddPct > 75;
  const daysLeft = account.challenge_end_date
    ? Math.max(0, Math.ceil((new Date(account.challenge_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/dashboard/accounts/${account.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
              <Edit className="w-4 h-4" /> Edit
            </Link>
            <button onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {isAtRisk && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-6 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 font-semibold text-sm">⚠️ Account at risk — Drawdown {ddUsed.toFixed(2)}% / {account.max_drawdown}%</p>
              <p className="text-red-300/70 text-xs mt-0.5">Reduce position size or stop trading for today to protect your account</p>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{account.account_name}</h1>
              <p className="text-gray-400">{account.firm_name} · ${account.initial_balance.toLocaleString()} account</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {pnl >= 0 ? '+' : ''}${Math.round(pnl).toLocaleString()}
              </p>
              <p className={`text-sm ${pnlPct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Balance</p>
              <p className="text-white font-semibold">${account.current_balance.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Target</p>
              <p className="text-purple-400 font-semibold">{targetPct.toFixed(0)}% done</p>
            </div>
            <div className={`rounded-lg p-3 ${isAtRisk ? 'bg-red-500/10' : 'bg-gray-800/50'}`}>
              <p className="text-xs text-gray-500 mb-1">Drawdown</p>
              <p className={`font-semibold ${isAtRisk ? 'text-red-400' : 'text-white'}`}>{ddUsed.toFixed(2)}%</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Days left</p>
              <p className={`font-semibold ${daysLeft !== null && daysLeft < 5 ? 'text-yellow-400' : 'text-white'}`}>
                {daysLeft !== null ? `${daysLeft}d` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Challenge Progress
          </h2>

          <ProgressBar
            label="Max Drawdown"
            used={ddUsed}
            max={account.max_drawdown}
            unit="%"
            color="red"
          />
          <ProgressBar
            label="Daily Loss"
            used={dailyUsed}
            max={dailyLimit}
            unit="$"
            color="yellow"
          />
          <ProgressBar
            label="Profit Target"
            used={Math.max(pnlPct, 0)}
            max={account.profit_target}
            unit="%"
            color="green"
          />
        </div>

        {/* Rules Summary */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Challenge Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Initial Balance', value: `$${account.initial_balance.toLocaleString()}`, icon: Wallet },
              { label: 'Profit Target', value: `${account.profit_target}% ($${Math.round(account.initial_balance * account.profit_target / 100).toLocaleString()})`, icon: TrendingUp },
              { label: 'Max Drawdown', value: `${account.max_drawdown}% ($${Math.round(account.initial_balance * account.max_drawdown / 100).toLocaleString()})`, icon: TrendingDown },
              { label: 'Daily Loss Limit', value: `${account.daily_loss_limit}% ($${Math.round(dailyLimit).toLocaleString()})`, icon: AlertTriangle },
              { label: 'End Date', value: account.challenge_end_date ? new Date(account.challenge_end_date).toLocaleDateString() : 'No limit', icon: Calendar },
              { label: 'Status', value: targetPct >= 100 ? '🎉 Target reached!' : isAtRisk ? '⚠️ At risk' : '✅ On track', icon: Target },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800/40 rounded-lg p-3">
                <item.icon className="w-4 h-4 text-gray-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm text-white font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-gray-900/60 rounded-xl border border-gray-800 p-6">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Risk Analysis
          </h2>
          <div className="space-y-3">
            {[
              {
                label: 'Max position risk (1%)',
                value: `$${Math.round(account.current_balance * 0.01).toLocaleString()}`,
                ok: true,
              },
              {
                label: 'Max position risk (2%)',
                value: `$${Math.round(account.current_balance * 0.02).toLocaleString()}`,
                ok: account.current_daily_loss === 0,
              },
              {
                label: 'Daily loss remaining',
                value: `$${Math.max(0, Math.round(dailyLimit - dailyUsed)).toLocaleString()}`,
                ok: dailyUsed < dailyLimit * 0.75,
              },
              {
                label: 'Max drawdown remaining',
                value: `$${Math.max(0, Math.round(account.initial_balance * account.max_drawdown / 100 - (account.initial_balance - account.current_balance))).toLocaleString()}`,
                ok: ddPct < 75,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-800/40 rounded-lg">
                <div className="flex items-center gap-2">
                  {item.ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    : <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  }
                  <span className="text-sm text-gray-300">{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.ok ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-bold text-lg mb-2">Delete Challenge?</h3>
            <p className="text-gray-400 text-sm mb-6">
              This will permanently delete <strong className="text-white">{account.account_name}</strong>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
