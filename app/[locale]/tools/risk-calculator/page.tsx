'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { DemoBanner } from '@/components/DemoBanner';

const presetBalances = [10000, 25000, 50000, 100000, 200000];
const presetRisks = [0.5, 1, 1.5, 2, 3];
const presetStopLosses = [10, 15, 20, 30, 50];

export default function RiskCalculatorPage() {
  const [balance, setBalance] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(20);
  const [pipValue, setPipValue] = useState(10);
  const [dailyDDLimit, setDailyDDLimit] = useState(5);

  // Calculations
  const riskAmount = (balance * riskPercent) / 100;
  const positionSize = stopLossPips > 0 ? riskAmount / (stopLossPips * pipValue) : 0;
  const dailyDDLimitUsd = (balance * dailyDDLimit) / 100;
  const tradeUsagePercent = (riskAmount / dailyDDLimitUsd) * 100;
  const maxLosingTrades = Math.floor(dailyDDLimitUsd / riskAmount);

  // Classification
  let classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  let message: string;

  if (tradeUsagePercent >= 100) {
    classification = 'VIOLATION';
    message = 'This trade exceeds your daily drawdown limit.';
  } else if (tradeUsagePercent > 50) {
    classification = 'RISKY';
    message = `Using ${tradeUsagePercent.toFixed(0)}% of daily limit in one trade is risky.`;
  } else {
    classification = 'SAFE';
    message = `Using ${tradeUsagePercent.toFixed(0)}% of daily limit. Good risk management.`;
  }

  const getResultStyles = () => {
    if (classification === 'SAFE') return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
    if (classification === 'RISKY') return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
  };

  const styles = getResultStyles();
  const ResultIcon = classification === 'SAFE' ? CheckCircle : classification === 'RISKY' ? AlertTriangle : XCircle;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          All Tools
        </Link>

        {/* Demo Banner */}
        <DemoBanner toolName="risk calculator" />

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">Risk Calculator</h1>
        <p className="text-gray-400 mb-8">Calculate optimal position size based on your risk parameters</p>

        {/* Calculator */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Trade Parameters</h2>

          {/* Account Balance */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Account Balance (USD)</label>
            <div className="flex gap-2 flex-wrap">
              {presetBalances.map((b) => (
                <button
                  key={b}
                  onClick={() => setBalance(b)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    balance === b ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  ${(b / 1000)}K
                </button>
              ))}
            </div>
          </div>

          {/* Risk Per Trade */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Risk Per Trade (%)</label>
            <div className="flex gap-2 flex-wrap">
              {presetRisks.map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskPercent(r)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    riskPercent === r ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Stop Loss */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Stop Loss (Pips)</label>
            <div className="flex gap-2 flex-wrap">
              {presetStopLosses.map((sl) => (
                <button
                  key={sl}
                  onClick={() => setStopLossPips(sl)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    stopLossPips === sl ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {sl}
                </button>
              ))}
            </div>
          </div>

          {/* Pip Value */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Pip Value (USD per lot)</label>
            <input
              type="number"
              value={pipValue}
              onChange={(e) => setPipValue(parseFloat(e.target.value) || 10)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">EUR/USD = $10 | USD/JPY ≈ $6.50 | GBP/USD = $10</p>
          </div>

          {/* Daily DD Limit */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Daily DD Limit (%)</label>
            <input
              type="number"
              value={dailyDDLimit}
              onChange={(e) => setDailyDDLimit(parseFloat(e.target.value) || 5)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Position Size</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Position Size</p>
              <p className="text-3xl font-bold text-white">{positionSize.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Standard Lots</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Risk Amount</p>
              <p className="text-3xl font-bold text-white">${riskAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Mini Lots: {(positionSize * 10).toFixed(1)}</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-400 mb-3">Daily DD Context</h3>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Daily DD Limit</span>
              <span className="text-white">${dailyDDLimitUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">This trade uses</span>
              <span className={`font-medium ${styles.text}`}>{tradeUsagePercent.toFixed(1)}% of daily limit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Max losing trades today</span>
              <span className="text-white">{maxLosingTrades}</span>
            </div>
          </div>

          {/* Classification */}
          <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
            <div className="flex items-center gap-3">
              <ResultIcon className={`w-6 h-6 ${styles.text}`} />
              <div>
                <p className={`font-semibold ${styles.text}`}>{classification}</p>
                <p className="text-sm text-gray-300">{message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-gray-900 rounded-xl border border-emerald-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Auto-Calculate Before Every Trade</h3>
          <p className="text-gray-400 mb-4">
            My Prop Firms checks your risk against all DD limits before you trade, using your real account data.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            Try My Prop Firms Free
          </Link>
        </div>
      </div>
    </div>
  );
}
