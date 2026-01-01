'use client';

import { 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Shield,
  Clock,
  Target
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface AccountHealth {
  status: 'safe' | 'warning' | 'danger';
  daily: {
    daily_buffer_usd: number;
    daily_buffer_pct: number;
  };
  max: {
    max_buffer_usd: number;
    max_buffer_pct: number;
  };
}

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  stage: string;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  min_trading_days: number;
  current_trading_days: number;
  has_consistency: boolean;
  health: AccountHealth;
}

interface GuidanceTabProps {
  accounts: Account[];
}

// =============================================================================
// HELPERS
// =============================================================================

function generateGuidance(accounts: Account[]): {
  doToday: string[];
  avoidToday: string[];
  generalTips: string[];
} {
  const doToday: string[] = [];
  const avoidToday: string[] = [];
  const generalTips: string[] = [];

  const safeAccounts = accounts.filter(a => a.health.status === 'safe');
  const riskAccounts = accounts.filter(a => a.health.status === 'warning');
  const dangerAccounts = accounts.filter(a => a.health.status === 'danger');
  const trailingAccounts = accounts.filter(a => a.max_dd_type !== 'static');
  const unmetDaysAccounts = accounts.filter(a => a.current_trading_days < a.min_trading_days);

  // DO TODAY
  if (safeAccounts.length > 0) {
    doToday.push(`Focus trading on ${safeAccounts[0].prop_firm} — it has the most buffer`);
  }
  
  if (unmetDaysAccounts.length > 0) {
    doToday.push(`Log a trading day on ${unmetDaysAccounts[0].prop_firm} to progress toward minimum days`);
  }

  doToday.push('Set a daily loss limit before your first trade');
  doToday.push('Review your trading plan for the session');

  // AVOID TODAY
  if (dangerAccounts.length > 0) {
    avoidToday.push(`Do not trade ${dangerAccounts.map(a => a.prop_firm).join(', ')} — too close to limits`);
  }

  if (riskAccounts.length > 0) {
    avoidToday.push(`Reduce position size on ${riskAccounts.map(a => a.prop_firm).join(', ')}`);
  }

  if (trailingAccounts.length > 0) {
    avoidToday.push('Avoid large trades on trailing DD accounts after profits');
  }

  avoidToday.push('No revenge trading after a loss');
  avoidToday.push('No trading during high-impact news (if restricted)');

  // GENERAL TIPS
  generalTips.push('Consistent small wins beat occasional big wins for passing evaluations');
  generalTips.push('Your first priority is protecting the account, not making profit');
  generalTips.push('If in doubt, skip the trade — there will always be another opportunity');
  
  if (accounts.some(a => a.has_consistency)) {
    generalTips.push('Watch for consistency rules — big winning days can hurt you');
  }

  generalTips.push('Update your P&L after each session to keep tracking accurate');

  return {
    doToday: doToday.slice(0, 4),
    avoidToday: avoidToday.slice(0, 4),
    generalTips: generalTips.slice(0, 4),
  };
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GuidanceTab({ accounts }: GuidanceTabProps) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-16">
        <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 mb-4">Add accounts to get personalized guidance</p>
        <a
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl"
        >
          + Add Account
        </a>
      </div>
    );
  }

  const { doToday, avoidToday, generalTips } = generateGuidance(accounts);

  const safeCount = accounts.filter(a => a.health.status === 'safe').length;
  const riskCount = accounts.filter(a => a.health.status === 'warning').length;
  const dangerCount = accounts.filter(a => a.health.status === 'danger').length;

  return (
    <div className="space-y-6">
      {/* Today's Status Summary */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Today&apos;s Status</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-400">{safeCount}</p>
            <p className="text-xs text-gray-400">Safe to trade</p>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{riskCount}</p>
            <p className="text-xs text-gray-400">Trade carefully</p>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-400">{dangerCount}</p>
            <p className="text-xs text-gray-400">Do not trade</p>
          </div>
        </div>
      </div>

      {/* Do Today */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Do Today
        </h3>
        
        <div className="space-y-3">
          {doToday.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Avoid Today */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Avoid Today
        </h3>
        
        <div className="space-y-3">
          {avoidToday.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* General Tips */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Tips to Pass Your Evaluation
        </h3>
        
        <div className="space-y-3">
          {generalTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
              <Target className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
