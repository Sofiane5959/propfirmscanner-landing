'use client';

import Link from 'next/link';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown,
  Calendar,
  Target,
  Shield,
  Sparkles,
  Plus
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  max_dd_type: string;
  min_trading_days: number;
  current_trading_days: number;
  has_consistency: boolean;
  health: {
    status: 'safe' | 'warning' | 'danger';
    daily: {
      daily_buffer_pct: number;
    };
    max: {
      max_buffer_pct: number;
    };
  };
}

interface GuidanceTabProps {
  accounts: Account[];
  isDemo?: boolean;
  demoTips?: string[];
}

// =============================================================================
// HELPERS
// =============================================================================

function generateGuidance(accounts: Account[]): { type: 'warning' | 'tip' | 'success'; message: string; icon: typeof AlertTriangle }[] {
  const guidance: { type: 'warning' | 'tip' | 'success'; message: string; icon: typeof AlertTriangle }[] = [];

  // Check for danger accounts
  const dangerAccounts = accounts.filter(a => a.health.status === 'danger');
  if (dangerAccounts.length > 0) {
    guidance.push({
      type: 'warning',
      message: `Do not trade ${dangerAccounts.map(a => a.prop_firm).join(', ')} today — daily limit almost reached.`,
      icon: AlertTriangle,
    });
  }

  // Check for trailing DD accounts with profits
  const trailingAccounts = accounts.filter(a => a.max_dd_type !== 'static');
  if (trailingAccounts.length > 0) {
    guidance.push({
      type: 'tip',
      message: 'Avoid trading trailing drawdown accounts after profits — your floor rises with gains.',
      icon: TrendingDown,
    });
  }

  // Check for unmet trading days
  const unmetDaysAccounts = accounts.filter(a => a.min_trading_days > 0 && a.current_trading_days < a.min_trading_days);
  if (unmetDaysAccounts.length > 0) {
    const total = unmetDaysAccounts.reduce((sum, a) => sum + (a.min_trading_days - a.current_trading_days), 0);
    guidance.push({
      type: 'tip',
      message: `${total} more trading day${total > 1 ? 's' : ''} needed across ${unmetDaysAccounts.length} account${unmetDaysAccounts.length > 1 ? 's' : ''}.`,
      icon: Calendar,
    });
  }

  // Check for safe accounts
  const safeAccounts = accounts.filter(a => a.health.status === 'safe');
  if (safeAccounts.length > 0 && dangerAccounts.length > 0) {
    guidance.push({
      type: 'success',
      message: `Focus on ${safeAccounts[0].prop_firm} today — it has the most buffer remaining.`,
      icon: Target,
    });
  }

  // Check for consistency rule
  const consistencyAccounts = accounts.filter(a => a.has_consistency);
  if (consistencyAccounts.length > 0) {
    guidance.push({
      type: 'tip',
      message: `${consistencyAccounts.map(a => a.prop_firm).join(', ')} ${consistencyAccounts.length > 1 ? 'have' : 'has'} consistency rules — avoid big profit days.`,
      icon: Shield,
    });
  }

  // General tips if not enough specific guidance
  if (guidance.length < 2) {
    guidance.push({
      type: 'tip',
      message: 'Trade with discipline — protect your accounts over chasing profits.',
      icon: Lightbulb,
    });
  }

  return guidance.slice(0, 5);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GuidanceTab({ accounts, isDemo = false, demoTips }: GuidanceTabProps) {
  // Use demo tips if provided, otherwise generate from accounts
  const guidance = isDemo && demoTips 
    ? demoTips.map(tip => ({
        type: 'tip' as const,
        message: tip,
        icon: Lightbulb,
      }))
    : generateGuidance(accounts);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Today&apos;s Guidance</h2>
            <p className="text-sm text-gray-500">Actionable advice for your trading day</p>
          </div>
        </div>
        {isDemo && (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-lg">
            <Sparkles className="w-3 h-3" />
            Demo
          </span>
        )}
      </div>

      {/* Guidance Cards */}
      <div className="space-y-3 mb-6">
        {guidance.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                item.type === 'warning'
                  ? 'bg-red-500/10 border-red-500/20'
                  : item.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  item.type === 'warning'
                    ? 'text-red-400'
                    : item.type === 'success'
                      ? 'text-emerald-400'
                      : 'text-yellow-400'
                }`} />
                <p className={`text-sm ${
                  item.type === 'warning'
                    ? 'text-red-300'
                    : item.type === 'success'
                      ? 'text-emerald-300'
                      : 'text-yellow-300'
                }`}>
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 mb-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Account Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {accounts.filter(a => a.health.status === 'safe').length}
            </p>
            <p className="text-xs text-gray-500">Safe to trade</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {accounts.filter(a => a.health.status === 'warning').length}
            </p>
            <p className="text-xs text-gray-500">Reduce size</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {accounts.filter(a => a.health.status === 'danger').length}
            </p>
            <p className="text-xs text-gray-500">Don&apos;t trade</p>
          </div>
        </div>
      </div>

      {/* General Tips */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Best Practices</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Check this dashboard before every trading session
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Update your P&L after each trading day
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Use the simulator before taking large positions
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            Prioritize green accounts over risky ones
          </li>
        </ul>
      </div>

      {/* CTA for Demo Mode */}
      {isDemo && (
        <div className="mt-6 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-5 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Get personalized guidance based on your real accounts.
          </p>
          <Link
            href="/dashboard/accounts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your Account
          </Link>
        </div>
      )}
    </div>
  );
}
