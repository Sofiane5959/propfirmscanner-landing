'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ArrowLeft, 
  Zap,
  Crown,
  Lock,
  CheckCircle,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

// =============================================================================
// PROP FIRM PRESETS
// =============================================================================

const propFirmPresets = [
  { name: 'FTMO', profitTarget: 10, profitSplit: 80, phases: 2 },
  { name: 'FundedNext', profitTarget: 10, profitSplit: 90, phases: 2 },
  { name: 'The5ers', profitTarget: 8, profitSplit: 80, phases: 1 },
  { name: 'MyFundedFX', profitTarget: 8, profitSplit: 80, phases: 2 },
  { name: 'E8 Funding', profitTarget: 8, profitSplit: 80, phases: 2 },
  { name: 'Custom', profitTarget: 10, profitSplit: 80, phases: 2 },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfitCalculatorPage() {
  // Form state
  const [preset, setPreset] = useState('FTMO');
  const [accountSize, setAccountSize] = useState('100000');
  const [currentBalance, setCurrentBalance] = useState('100000');
  const [profitTarget, setProfitTarget] = useState('10');
  const [profitSplit, setProfitSplit] = useState('80');
  const [monthlyReturn, setMonthlyReturn] = useState('5');

  // Apply preset
  const handlePresetChange = (presetName: string) => {
    setPreset(presetName);
    const selected = propFirmPresets.find(p => p.name === presetName);
    if (selected) {
      setProfitTarget(selected.profitTarget.toString());
      setProfitSplit(selected.profitSplit.toString());
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const startBal = parseFloat(accountSize) || 0;
    const currBal = parseFloat(currentBalance) || 0;
    const targetPct = parseFloat(profitTarget) || 0;
    const splitPct = parseFloat(profitSplit) || 0;
    const monthlyPct = parseFloat(monthlyReturn) || 0;

    // Current profit
    const currentProfit = currBal - startBal;
    const currentProfitPct = startBal > 0 ? (currentProfit / startBal) * 100 : 0;

    // Target calculations
    const targetProfit = (startBal * targetPct) / 100;
    const targetBalance = startBal + targetProfit;
    const remainingToTarget = Math.max(0, targetProfit - currentProfit);
    const progressPct = targetProfit > 0 ? Math.min(100, (currentProfit / targetProfit) * 100) : 0;

    // Payout if target reached
    const potentialPayout = (targetProfit * splitPct) / 100;

    // Monthly projections
    const monthlyProfit = (startBal * monthlyPct) / 100;
    const monthlyPayout = (monthlyProfit * splitPct) / 100;
    const yearlyPayout = monthlyPayout * 12;

    // Days to target (assuming consistent returns)
    const dailyReturn = monthlyPct / 20; // ~20 trading days
    const daysToTarget = dailyReturn > 0 ? remainingToTarget / ((startBal * dailyReturn) / 100) : 0;

    return {
      currentProfit,
      currentProfitPct,
      targetProfit,
      targetBalance,
      remainingToTarget,
      progressPct,
      potentialPayout,
      monthlyProfit,
      monthlyPayout,
      yearlyPayout,
      daysToTarget: Math.ceil(daysToTarget),
    };
  }, [accountSize, currentBalance, profitTarget, profitSplit, monthlyReturn]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Profit Calculator</h1>
              <p className="text-gray-400">Calculate profits and payouts for your funded account</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>

            {/* Preset Selector */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Prop Firm</label>
              <select
                value={preset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                {propFirmPresets.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Account Size */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Account Size (USD)</label>
              <input
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000, 200000].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setAccountSize(size.toString());
                      setCurrentBalance(size.toString());
                    }}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Current Balance */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Current Balance (USD)</label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Profit Target */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Profit Target (%)</label>
              <input
                type="number"
                value={profitTarget}
                onChange={(e) => {
                  setProfitTarget(e.target.value);
                  setPreset('Custom');
                }}
                step="0.5"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Profit Split */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Profit Split (%)</label>
              <input
                type="number"
                value={profitSplit}
                onChange={(e) => {
                  setProfitSplit(e.target.value);
                  setPreset('Custom');
                }}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[70, 80, 85, 90].map((split) => (
                  <button
                    key={split}
                    onClick={() => {
                      setProfitSplit(split.toString());
                      setPreset('Custom');
                    }}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    {split}%
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Return Estimate */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Est. Monthly Return (%)</label>
              <input
                type="number"
                value={monthlyReturn}
                onChange={(e) => setMonthlyReturn(e.target.value)}
                step="0.5"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Progress to Target */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-400">Progress to Target</h3>
                <span className={`text-sm font-medium ${
                  calculations.progressPct >= 100 ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {calculations.progressPct.toFixed(1)}%
                </span>
              </div>

              <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all ${
                    calculations.progressPct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, calculations.progressPct)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Current Profit</p>
                  <p className={`text-lg font-semibold ${
                    calculations.currentProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(calculations.currentProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Remaining</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(calculations.remainingToTarget)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payout Card */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm text-emerald-400">If Target Reached</h3>
              </div>

              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-white mb-1">
                  {formatCurrency(calculations.potentialPayout)}
                </p>
                <p className="text-gray-400">Your payout ({profitSplit}% of profit)</p>
              </div>

              <div className="pt-4 border-t border-emerald-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total profit target</span>
                  <span className="text-white">{formatCurrency(calculations.targetProfit)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Firm keeps</span>
                  <span className="text-gray-400">{formatCurrency(calculations.targetProfit - calculations.potentialPayout)}</span>
                </div>
              </div>
            </div>

            {/* Monthly Projections */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm text-gray-400">Monthly Projections</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly profit</span>
                  <span className="text-white font-medium">{formatCurrency(calculations.monthlyProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly payout</span>
                  <span className="text-emerald-400 font-medium">{formatCurrency(calculations.monthlyPayout)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">Yearly payout</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(calculations.yearlyPayout)}</span>
                </div>
                {calculations.daysToTarget > 0 && calculations.remainingToTarget > 0 && (
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Est. days to target</span>
                    <span className="text-blue-400 font-medium">{calculations.daysToTarget} days</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Track Real Progress</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Pro Tracker shows live P&L, payout projections, and alerts when you hit targets.
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
                  Auto-track daily P&L
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Payout history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Target alerts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
