'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  ArrowLeft, 
  Zap,
  Crown,
  Lock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// =============================================================================
// COMPONENT
// =============================================================================

export default function RiskCalculatorPage() {
  // Form state
  const [accountBalance, setAccountBalance] = useState('100000');
  const [riskPercent, setRiskPercent] = useState('1');
  const [stopLossPips, setStopLossPips] = useState('20');
  const [pipValue, setPipValue] = useState('10');
  const [dailyDDPercent, setDailyDDPercent] = useState('5');

  // Calculations
  const calculations = useMemo(() => {
    const balance = parseFloat(accountBalance) || 0;
    const riskPct = parseFloat(riskPercent) || 0;
    const slPips = parseFloat(stopLossPips) || 1;
    const pipVal = parseFloat(pipValue) || 10;
    const dailyDD = parseFloat(dailyDDPercent) || 5;

    // Risk amount in USD
    const riskUsd = (balance * riskPct) / 100;

    // Position size calculation
    const positionSize = riskUsd / (slPips * pipVal);

    // Lot size (standard lot = 100,000 units)
    const lotSize = positionSize;

    // Daily DD context
    const dailyLimitUsd = (balance * dailyDD) / 100;
    const riskOfDailyDD = (riskUsd / dailyLimitUsd) * 100;

    // Risk assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskPct > 2 || riskOfDailyDD > 50) riskLevel = 'high';
    else if (riskPct > 1 || riskOfDailyDD > 30) riskLevel = 'medium';

    // Max trades before hitting daily DD
    const maxTrades = Math.floor(dailyLimitUsd / riskUsd) || 0;

    return {
      riskUsd,
      positionSize,
      lotSize,
      dailyLimitUsd,
      riskOfDailyDD,
      riskLevel,
      maxTrades,
    };
  }, [accountBalance, riskPercent, stopLossPips, pipValue, dailyDDPercent]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskConfig = (level: string) => {
    const configs = {
      low: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Conservative' },
      medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Moderate' },
      high: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Aggressive' },
    };
    return configs[level as keyof typeof configs];
  };

  const riskConfig = getRiskConfig(calculations.riskLevel);

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
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Calculator className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Risk Calculator</h1>
              <p className="text-gray-400">Calculate optimal position size based on your risk</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Trade Parameters</h2>

            {/* Account Balance */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Account Balance (USD)</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000, 200000].map((size) => (
                  <button
                    key={size}
                    onClick={() => setAccountBalance(size.toString())}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Percent */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Risk Per Trade (%)</label>
              <input
                type="number"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                step="0.25"
                min="0.1"
                max="10"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2 mt-2">
                {[0.5, 1, 1.5, 2, 3].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setRiskPercent(pct.toString())}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Loss */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Stop Loss (Pips)</label>
              <input
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2 mt-2">
                {[10, 15, 20, 30, 50].map((pips) => (
                  <button
                    key={pips}
                    onClick={() => setStopLossPips(pips.toString())}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    {pips}
                  </button>
                ))}
              </div>
            </div>

            {/* Pip Value */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                Pip Value (USD per lot)
                <span title="Standard lot pip value varies by pair">
                  <Info className="w-4 h-4 text-gray-500" />
                </span>
              </label>
              <input
                type="number"
                value={pipValue}
                onChange={(e) => setPipValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                EUR/USD = $10 | USD/JPY ≈ $6.50 | GBP/USD = $10
              </p>
            </div>

            {/* Daily DD for context */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Daily DD Limit (%)</label>
              <input
                type="number"
                value={dailyDDPercent}
                onChange={(e) => setDailyDDPercent(e.target.value)}
                step="0.5"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Risk Level Badge */}
            <div className={`p-4 rounded-xl ${riskConfig.bg} flex items-center gap-3`}>
              {calculations.riskLevel === 'high' ? (
                <AlertTriangle className={`w-6 h-6 ${riskConfig.text}`} />
              ) : (
                <CheckCircle className={`w-6 h-6 ${riskConfig.text}`} />
              )}
              <div>
                <p className={`font-semibold ${riskConfig.text}`}>{riskConfig.label} Risk</p>
                <p className="text-sm text-gray-400">
                  {calculations.riskLevel === 'low' && 'Good risk management'}
                  {calculations.riskLevel === 'medium' && 'Acceptable for experienced traders'}
                  {calculations.riskLevel === 'high' && 'Consider reducing risk per trade'}
                </p>
              </div>
            </div>

            {/* Main Results Card */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-4">Position Size</h3>
              
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-white mb-1">
                  {calculations.lotSize.toFixed(2)}
                </p>
                <p className="text-gray-400">Standard Lots</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Risk Amount</p>
                  <p className="text-lg font-semibold text-blue-400">
                    {formatCurrency(calculations.riskUsd)}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Mini Lots</p>
                  <p className="text-lg font-semibold text-white">
                    {(calculations.lotSize * 10).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* DD Context Card */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-4">Daily DD Context</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily DD Limit</span>
                  <span className="text-white font-medium">{formatCurrency(calculations.dailyLimitUsd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">This trade uses</span>
                  <span className={`font-medium ${
                    calculations.riskOfDailyDD > 50 ? 'text-red-400' :
                    calculations.riskOfDailyDD > 30 ? 'text-yellow-400' :
                    'text-emerald-400'
                  }`}>
                    {calculations.riskOfDailyDD.toFixed(1)}% of daily limit
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max losing trades today</span>
                  <span className="text-white font-medium">{calculations.maxTrades}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      calculations.riskOfDailyDD > 50 ? 'bg-red-500' :
                      calculations.riskOfDailyDD > 30 ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, calculations.riskOfDailyDD)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Auto-Calculate Before Every Trade</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Pro Tracker checks your risk against all DD limits before you trade.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
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
                  Real-time position sizing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Multi-account risk limits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Trade simulation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
