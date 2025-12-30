'use client';

import { useState } from 'react';
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
  TrendingUp,
  Moon,
  Info
} from 'lucide-react';

// =============================================================================
// PROP FIRM RULES DATA
// =============================================================================

const propFirmRules = {
  FTMO: {
    newsTrading: { allowed: false, buffer: 2, note: 'No trades 2 min before/after high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: false, note: 'No consistency rule' },
    maxDDType: 'static',
    minTradingDays: 4,
    maxDailyProfit: null,
    hedging: true,
    ea: true,
  },
  FundedNext: {
    newsTrading: { allowed: false, buffer: 5, note: 'No trades 5 min before/after high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: true, maxDayPct: 40, note: 'Max 40% profit from single day' },
    maxDDType: 'trailing',
    minTradingDays: 5,
    maxDailyProfit: null,
    hedging: true,
    ea: true,
  },
  The5ers: {
    newsTrading: { allowed: true, note: 'News trading allowed' },
    weekendHolding: { allowed: false, note: 'Must close before weekend' },
    consistency: { required: false, note: 'No consistency rule' },
    maxDDType: 'static',
    minTradingDays: 3,
    maxDailyProfit: null,
    hedging: false,
    ea: true,
  },
  MyFundedFX: {
    newsTrading: { allowed: false, buffer: 2, note: 'No trades 2 min before/after high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: true, maxDayPct: 45, note: 'Max 45% profit from single day' },
    maxDDType: 'trailing',
    minTradingDays: 5,
    maxDailyProfit: null,
    hedging: true,
    ea: true,
  },
  'E8 Funding': {
    newsTrading: { allowed: false, buffer: 2, note: 'No trades during high-impact news' },
    weekendHolding: { allowed: true, note: 'Weekend holding allowed' },
    consistency: { required: false, note: 'No consistency rule' },
    maxDDType: 'static',
    minTradingDays: 5,
    maxDailyProfit: null,
    hedging: true,
    ea: true,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function RuleTrackerPage() {
  const [selectedFirm, setSelectedFirm] = useState<keyof typeof propFirmRules>('FTMO');
  const [tradePlan, setTradePlan] = useState({
    isNewsTime: false,
    isWeekend: false,
    bigProfitDay: false,
    usingEA: false,
    hedging: false,
  });

  const rules = propFirmRules[selectedFirm];

  // Check compliance
  const checkCompliance = () => {
    const issues: { type: 'error' | 'warning'; message: string }[] = [];
    
    // News trading check
    if (tradePlan.isNewsTime && !rules.newsTrading.allowed) {
      issues.push({
        type: 'error',
        message: `${selectedFirm} prohibits trading ${rules.newsTrading.buffer} minutes around high-impact news`,
      });
    }

    // Weekend holding check
    if (tradePlan.isWeekend && !rules.weekendHolding.allowed) {
      issues.push({
        type: 'error',
        message: `${selectedFirm} requires all positions closed before the weekend`,
      });
    }

    // Consistency check
    if (tradePlan.bigProfitDay && rules.consistency.required) {
      issues.push({
        type: 'warning',
        message: `${selectedFirm} has a consistency rule: max ${rules.consistency.maxDayPct}% profit from a single day`,
      });
    }

    // Hedging check
    if (tradePlan.hedging && !rules.hedging) {
      issues.push({
        type: 'error',
        message: `${selectedFirm} does not allow hedging`,
      });
    }

    return issues;
  };

  const issues = checkCompliance();
  const hasErrors = issues.some(i => i.type === 'error');
  const hasWarnings = issues.some(i => i.type === 'warning');

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            {/* Prop Firm Selector */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Select Prop Firm</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(propFirmRules).map((firm) => (
                  <button
                    key={firm}
                    onClick={() => setSelectedFirm(firm as keyof typeof propFirmRules)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedFirm === firm
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {firm}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Plan Checklist */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Your Trade Plan</h2>
              <p className="text-sm text-gray-400 mb-4">Check what applies to your planned trade:</p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={tradePlan.isNewsTime}
                    onChange={(e) => setTradePlan({ ...tradePlan, isNewsTime: e.target.checked })}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <Newspaper className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-white">Trading around news time</p>
                    <p className="text-xs text-gray-500">High-impact economic events</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={tradePlan.isWeekend}
                    onChange={(e) => setTradePlan({ ...tradePlan, isWeekend: e.target.checked })}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white">Holding over weekend</p>
                    <p className="text-xs text-gray-500">Positions open Friday → Monday</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={tradePlan.bigProfitDay}
                    onChange={(e) => setTradePlan({ ...tradePlan, bigProfitDay: e.target.checked })}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-white">Large profit day planned</p>
                    <p className="text-xs text-gray-500">Expecting &gt;30% of target in one day</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={tradePlan.hedging}
                    onChange={(e) => setTradePlan({ ...tradePlan, hedging: e.target.checked })}
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-white">Using hedging</p>
                    <p className="text-xs text-gray-500">Opposite positions on same pair</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Compliance Status */}
            <div className={`p-5 rounded-xl ${
              hasErrors 
                ? 'bg-red-500/20 border border-red-500/30' 
                : hasWarnings 
                  ? 'bg-yellow-500/20 border border-yellow-500/30'
                  : 'bg-emerald-500/20 border border-emerald-500/30'
            }`}>
              <div className="flex items-center gap-3">
                {hasErrors ? (
                  <XCircle className="w-8 h-8 text-red-400" />
                ) : hasWarnings ? (
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                )}
                <div>
                  <p className={`font-bold text-lg ${
                    hasErrors ? 'text-red-400' : hasWarnings ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>
                    {hasErrors ? 'Rule Violation' : hasWarnings ? 'Warning' : 'All Clear'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {hasErrors 
                      ? 'This trade plan violates firm rules' 
                      : hasWarnings 
                        ? 'Review warnings before trading'
                        : 'Your plan complies with all rules'}
                  </p>
                </div>
              </div>
            </div>

            {/* Issues List */}
            {issues.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-3">Issues Found</h3>
                <div className="space-y-3">
                  {issues.map((issue, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                      issue.type === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                    }`}>
                      {issue.type === 'error' ? (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={`text-sm ${
                        issue.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {issue.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Firm Rules Summary */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-4">{selectedFirm} Rules Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-300">
                    <Newspaper className="w-4 h-4 text-orange-400" />
                    News Trading
                  </span>
                  <span className={rules.newsTrading.allowed ? 'text-emerald-400' : 'text-red-400'}>
                    {rules.newsTrading.allowed ? 'Allowed' : `${rules.newsTrading.buffer}min buffer`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Weekend Holding
                  </span>
                  <span className={rules.weekendHolding.allowed ? 'text-emerald-400' : 'text-red-400'}>
                    {rules.weekendHolding.allowed ? 'Allowed' : 'Not Allowed'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-300">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    Consistency Rule
                  </span>
                  <span className={!rules.consistency.required ? 'text-emerald-400' : 'text-yellow-400'}>
                    {rules.consistency.required ? `Max ${rules.consistency.maxDayPct}%/day` : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4 text-pink-400" />
                    Max DD Type
                  </span>
                  <span className={rules.maxDDType === 'static' ? 'text-emerald-400' : 'text-yellow-400'}>
                    {rules.maxDDType === 'static' ? 'Static' : 'Trailing'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Min Trading Days
                  </span>
                  <span className="text-white">{rules.minTradingDays} days</span>
                </div>
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Auto-Check Every Trade</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Pro Tracker automatically verifies your trades against all rules in real-time.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Try Pro Tracker Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Features */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 opacity-75">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Pro Features</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  News calendar integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Consistency tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Rule violation alerts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
