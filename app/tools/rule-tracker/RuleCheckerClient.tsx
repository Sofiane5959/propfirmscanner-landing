'use client';

import { useState } from 'react';
import { 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Newspaper,
  Calendar,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';

// =============================================================================
// PROP FIRM RULES DATA
// =============================================================================

const propFirmRules = {
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

type FirmName = keyof typeof propFirmRules;

// =============================================================================
// COMPONENT
// =============================================================================

export function RuleCheckerClient() {
  const [selectedFirm, setSelectedFirm] = useState<FirmName>('FTMO');
  const [tradePlan, setTradePlan] = useState({
    isNewsTime: false,
    isWeekend: false,
    bigProfitDay: false,
    hedging: false,
  });

  const rules = propFirmRules[selectedFirm];

  // Check compliance
  const checkCompliance = () => {
    const issues: { type: 'error' | 'warning'; message: string }[] = [];
    
    if (tradePlan.isNewsTime && !rules.newsTrading.allowed) {
      const buffer = 'buffer' in rules.newsTrading ? rules.newsTrading.buffer : 2;
      issues.push({
        type: 'error',
        message: `${selectedFirm} prohibits trading ${buffer} minutes around high-impact news`,
      });
    }

    if (tradePlan.isWeekend && !rules.weekendHolding.allowed) {
      issues.push({
        type: 'error',
        message: `${selectedFirm} requires all positions closed before the weekend`,
      });
    }

    if (tradePlan.bigProfitDay && rules.consistency.required) {
      const maxPct = 'maxDayPct' in rules.consistency ? rules.consistency.maxDayPct : 40;
      issues.push({
        type: 'warning',
        message: `${selectedFirm} has a consistency rule: max ${maxPct}% profit from a single day`,
      });
    }

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
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="space-y-4">
        {/* Prop Firm Selector */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Select Prop Firm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(propFirmRules) as FirmName[]).map((firm) => (
              <button
                key={firm}
                onClick={() => setSelectedFirm(firm)}
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
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
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

        {/* Selected Firm Rules Summary */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-sm text-gray-400 mb-4">{selectedFirm} Rules</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-300">
                <Newspaper className="w-4 h-4 text-orange-400" />
                News Trading
              </span>
              <span className={rules.newsTrading.allowed ? 'text-emerald-400' : 'text-red-400'}>
                {rules.newsTrading.allowed ? 'Allowed' : `${'buffer' in rules.newsTrading ? rules.newsTrading.buffer : 2}min buffer`}
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
                {rules.consistency.required ? `Max ${'maxDayPct' in rules.consistency ? rules.consistency.maxDayPct : 40}%/day` : 'None'}
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
      </div>
    </div>
  );
}
