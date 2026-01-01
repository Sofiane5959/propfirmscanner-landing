'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DemoBanner } from '@/components/DemoBanner';

const propFirmRules: Record<string, {
  newsTrading: boolean;
  newsBuffer: number;
  weekendHolding: boolean;
  consistency: number | null;
  maxDDType: 'static' | 'trailing';
  minTradingDays: number;
}> = {
  'FTMO': { newsTrading: false, newsBuffer: 2, weekendHolding: true, consistency: null, maxDDType: 'static', minTradingDays: 4 },
  'FundedNext': { newsTrading: false, newsBuffer: 5, weekendHolding: true, consistency: 40, maxDDType: 'trailing', minTradingDays: 5 },
  'The5ers': { newsTrading: true, newsBuffer: 0, weekendHolding: false, consistency: null, maxDDType: 'static', minTradingDays: 3 },
  'MyFundedFX': { newsTrading: false, newsBuffer: 2, weekendHolding: true, consistency: 45, maxDDType: 'trailing', minTradingDays: 5 },
  'E8 Funding': { newsTrading: false, newsBuffer: 5, weekendHolding: true, consistency: null, maxDDType: 'static', minTradingDays: 5 },
};

const firms = Object.keys(propFirmRules);

export default function RuleTrackerPage() {
  const [selectedFirm, setSelectedFirm] = useState('FTMO');
  const [tradingNews, setTradingNews] = useState(false);
  const [holdingWeekend, setHoldingWeekend] = useState(false);
  const [largeProfitDay, setLargeProfitDay] = useState(false);
  const [usingHedging, setUsingHedging] = useState(false);

  const rules = propFirmRules[selectedFirm];

  // Check compliance
  const violations: string[] = [];
  const warnings: string[] = [];

  if (tradingNews && !rules.newsTrading) {
    violations.push(`${selectedFirm} does not allow trading ${rules.newsBuffer} minutes around high-impact news`);
  }

  if (holdingWeekend && !rules.weekendHolding) {
    violations.push(`${selectedFirm} does not allow holding positions over the weekend`);
  }

  if (largeProfitDay && rules.consistency) {
    warnings.push(`${selectedFirm} has a ${rules.consistency}% consistency rule — large profit days may count against you`);
  }

  if (usingHedging) {
    warnings.push('Hedging rules vary — check your specific prop firm terms');
  }

  const isCompliant = violations.length === 0;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          All Tools
        </Link>

        {/* Demo Banner */}
        <DemoBanner toolName="rule checker" />

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">Rule Checker</h1>
        <p className="text-gray-400 mb-8">Check if your trade plan complies with prop firm rules</p>

        {/* Quick Comparison Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Rules Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="pb-2 pr-4">Firm</th>
                <th className="pb-2 px-2 text-center">News</th>
                <th className="pb-2 px-2 text-center">Weekend</th>
                <th className="pb-2 px-2 text-center">Consistency</th>
                <th className="pb-2 pl-2 text-center">DD Type</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm) => {
                const r = propFirmRules[firm];
                return (
                  <tr key={firm} className="border-b border-gray-800/50">
                    <td className="py-2 pr-4 text-white font-medium">{firm}</td>
                    <td className="py-2 px-2 text-center">
                      {r.newsTrading ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {r.weekendHolding ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-2 px-2 text-center text-gray-400">
                      {r.consistency ? `${r.consistency}%` : 'None'}
                    </td>
                    <td className="py-2 pl-2 text-center">
                      <span className={r.maxDDType === 'static' ? 'text-emerald-400' : 'text-purple-400'}>
                        {r.maxDDType === 'static' ? 'Static' : 'Trailing'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Firm Selector */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Select Prop Firm</h2>
          <div className="flex flex-wrap gap-2">
            {firms.map((firm) => (
              <button
                key={firm}
                onClick={() => setSelectedFirm(firm)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFirm === firm
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {firm}
              </button>
            ))}
          </div>
        </div>

        {/* Trade Plan Checkboxes */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Trade Plan</h2>
          <p className="text-sm text-gray-500 mb-4">Check what applies to your planned trade:</p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={tradingNews}
                onChange={(e) => setTradingNews(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">Trading around news time</p>
                <p className="text-xs text-gray-500">High-impact economic events</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={holdingWeekend}
                onChange={(e) => setHoldingWeekend(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">Holding over weekend</p>
                <p className="text-xs text-gray-500">Positions open Friday → Monday</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={largeProfitDay}
                onChange={(e) => setLargeProfitDay(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">Large profit day planned</p>
                <p className="text-xs text-gray-500">Expecting &gt;30% of target in one day</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700/50">
              <input
                type="checkbox"
                checked={usingHedging}
                onChange={(e) => setUsingHedging(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <div>
                <p className="text-white font-medium">Using hedging</p>
                <p className="text-xs text-gray-500">Opposite positions on same pair</p>
              </div>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <div className={`p-4 rounded-lg border ${
            isCompliant && warnings.length === 0
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : violations.length > 0
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {isCompliant && warnings.length === 0 ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <p className="font-semibold text-emerald-400">All Clear</p>
                </>
              ) : violations.length > 0 ? (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <p className="font-semibold text-red-400">Rule Violations</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <p className="font-semibold text-yellow-400">Warnings</p>
                </>
              )}
            </div>

            {violations.length > 0 && (
              <ul className="space-y-1 mb-3">
                {violations.map((v, i) => (
                  <li key={i} className="text-sm text-red-300">• {v}</li>
                ))}
              </ul>
            )}

            {warnings.length > 0 && (
              <ul className="space-y-1">
                {warnings.map((w, i) => (
                  <li key={i} className="text-sm text-yellow-300">• {w}</li>
                ))}
              </ul>
            )}

            {isCompliant && warnings.length === 0 && (
              <p className="text-sm text-emerald-300">Your plan complies with all {selectedFirm} rules</p>
            )}
          </div>
        </div>

        {/* Selected Firm Rules */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">{selectedFirm} Rules</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">News Trading</p>
              <p className={`font-medium ${rules.newsTrading ? 'text-emerald-400' : 'text-red-400'}`}>
                {rules.newsTrading ? 'Allowed' : `${rules.newsBuffer}min buffer`}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">Weekend Holding</p>
              <p className={`font-medium ${rules.weekendHolding ? 'text-emerald-400' : 'text-red-400'}`}>
                {rules.weekendHolding ? 'Allowed' : 'Not Allowed'}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">Consistency Rule</p>
              <p className="font-medium text-gray-300">
                {rules.consistency ? `${rules.consistency}%` : 'None'}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">Max DD Type</p>
              <p className={`font-medium ${rules.maxDDType === 'static' ? 'text-emerald-400' : 'text-purple-400'}`}>
                {rules.maxDDType === 'static' ? 'Static' : 'Trailing'}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 col-span-2">
              <p className="text-xs text-gray-500">Min Trading Days</p>
              <p className="font-medium text-gray-300">{rules.minTradingDays} days</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-gray-900 rounded-xl border border-emerald-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Auto-Check Every Trade</h3>
          <p className="text-gray-400 mb-4">
            My Prop Firms automatically verifies your trades against all rules in real-time using your actual account data.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            <Shield className="w-5 h-5" />
            Try My Prop Firms Free
          </Link>
        </div>
      </div>
    </div>
  );
}
