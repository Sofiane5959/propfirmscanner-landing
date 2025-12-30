import Link from 'next/link';
import { 
  Shield, 
  ArrowLeft, 
  Zap,
  Crown,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Newspaper,
  Calendar,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { RuleCheckerClient } from './RuleCheckerClient';

// =============================================================================
// PROP FIRM RULES DATA (Static - SSR safe)
// =============================================================================

const propFirmRulesData = {
  FTMO: {
    newsTrading: { allowed: false, buffer: 2, note: 'No trades 2 min before/after high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: false, note: 'No consistency rule' },
    maxDDType: 'static' as const,
    minTradingDays: 4,
    hedging: true,
    ea: true,
  },
  FundedNext: {
    newsTrading: { allowed: false, buffer: 5, note: 'No trades 5 min before/after high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: true, maxDayPct: 40, note: 'Max 40% profit from single day' },
    maxDDType: 'trailing' as const,
    minTradingDays: 5,
    hedging: true,
    ea: true,
  },
  The5ers: {
    newsTrading: { allowed: true, note: 'News trading allowed' },
    weekendHolding: { allowed: false, note: 'Must close before weekend' },
    consistency: { required: false, note: 'No consistency rule' },
    maxDDType: 'static' as const,
    minTradingDays: 3,
    hedging: false,
    ea: true,
  },
  MyFundedFX: {
    newsTrading: { allowed: false, buffer: 2, note: 'No trades 2 min before/after high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: true, maxDayPct: 45, note: 'Max 45% profit from single day' },
    maxDDType: 'trailing' as const,
    minTradingDays: 5,
    hedging: true,
    ea: true,
  },
  'E8 Funding': {
    newsTrading: { allowed: false, buffer: 2, note: 'No trades during high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: false, note: 'No consistency rule' },
    maxDDType: 'static' as const,
    minTradingDays: 5,
    hedging: true,
    ea: true,
  },
};

// =============================================================================
// STATIC RULES SUMMARY (SSR)
// =============================================================================

function RulesSummarySSR() {
  const firms = Object.entries(propFirmRulesData);
  
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700">
        <h3 className="font-semibold text-white">Quick Rules Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-gray-400 font-medium">Firm</th>
              <th className="px-4 py-3 text-center text-gray-400 font-medium">News</th>
              <th className="px-4 py-3 text-center text-gray-400 font-medium">Weekend</th>
              <th className="px-4 py-3 text-center text-gray-400 font-medium">Consistency</th>
              <th className="px-4 py-3 text-center text-gray-400 font-medium">DD Type</th>
            </tr>
          </thead>
          <tbody>
            {firms.map(([name, rules]) => (
              <tr key={name} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="px-4 py-3 font-medium text-white">{name}</td>
                <td className="px-4 py-3 text-center">
                  {rules.newsTrading.allowed ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-red-400">✗</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {rules.weekendHolding.allowed ? (
                    <span className="text-emerald-400">✓</span>
                  ) : (
                    <span className="text-red-400">✗</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {rules.consistency.required ? (
                    <span className="text-yellow-400">
                      {'maxDayPct' in rules.consistency ? `${rules.consistency.maxDayPct}%` : 'Yes'}
                    </span>
                  ) : (
                    <span className="text-emerald-400">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={rules.maxDDType === 'static' ? 'text-emerald-400' : 'text-yellow-400'}>
                    {rules.maxDDType === 'static' ? 'Static' : 'Trailing'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT (Server Component - SSR Safe)
// =============================================================================

export default function RuleTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Tools
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Rule Checker</h1>
              <p className="text-gray-400">Check if your trade plan complies with prop firm rules</p>
            </div>
          </div>
        </div>

        {/* Static Rules Summary (Always visible, SSR) */}
        <div className="mb-8">
          <RulesSummarySSR />
        </div>

        {/* Interactive Checker (Client Component) */}
        <RuleCheckerClient />

        {/* Pro CTA */}
        <div className="mt-8 bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Pro Tracker</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Auto-Check Every Trade
              </h3>
              <p className="text-gray-300">
                Pro Tracker automatically verifies your trades against all rules in real-time and alerts you before violations.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              <Zap className="w-5 h-5" />
              Try Pro Tracker Free
            </Link>
          </div>
        </div>

        {/* Pro Features */}
        <div className="mt-6 bg-gray-800 rounded-xl p-5 border border-gray-700 opacity-75">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400">Pro Features</span>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              News calendar
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Consistency tracking
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Violation alerts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Multi-account
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
