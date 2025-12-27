'use client'

import { useState } from 'react'
import { 
  PieChart, DollarSign, Percent, TrendingUp,
  Calculator, Info, ArrowRight
} from 'lucide-react'

interface ProfitResult {
  grossProfit: number
  firmShare: number
  traderShare: number
  monthlyTarget: number
  yearlyProjection: number
}

const ACCOUNT_SIZES = [10000, 25000, 50000, 100000, 200000, 400000]
const PROFIT_SPLITS = [70, 75, 80, 85, 90, 95, 100]

export default function ProfitCalculatorClient() {
  const [accountSize, setAccountSize] = useState(100000)
  const [monthlyReturn, setMonthlyReturn] = useState(5)
  const [profitSplit, setProfitSplit] = useState(80)
  const [months, setMonths] = useState(12)

  // Calculations
  const grossProfit = accountSize * (monthlyReturn / 100)
  const firmShare = grossProfit * ((100 - profitSplit) / 100)
  const traderShare = grossProfit * (profitSplit / 100)
  const yearlyGross = grossProfit * months
  const yearlyTraderShare = traderShare * months

  // Scaling simulation (assuming 25% increase every 3 months)
  const calculateScalingProjection = () => {
    let total = 0
    let currentAccount = accountSize
    for (let i = 0; i < months; i++) {
      if (i > 0 && i % 3 === 0) {
        currentAccount *= 1.25 // 25% scaling
      }
      total += currentAccount * (monthlyReturn / 100) * (profitSplit / 100)
    }
    return total
  }

  const scalingProjection = calculateScalingProjection()

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Profit Calculator</h1>
          <p className="text-gray-400">Calculate your potential earnings from a funded account</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>

            {/* Account Size */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                Account Size
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCOUNT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setAccountSize(size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      accountSize === size
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Return */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Monthly Return: {monthlyReturn}%
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={monthlyReturn}
                onChange={(e) => setMonthlyReturn(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1% (Conservative)</span>
                <span>15% (Aggressive)</span>
              </div>
            </div>

            {/* Profit Split */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <Percent className="w-4 h-4 text-purple-400" />
                Profit Split
              </label>
              <div className="flex flex-wrap gap-2">
                {PROFIT_SPLITS.map(split => (
                  <button
                    key={split}
                    onClick={() => setProfitSplit(split)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profitSplit === split
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {split}%
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                Time Period: {months} months
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly Breakdown */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Monthly Earnings</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gross Profit</span>
                  <span className="text-white font-semibold">${grossProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Firm&apos;s Share ({100 - profitSplit}%)</span>
                  <span className="text-red-400">-${firmShare.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Your Earnings ({profitSplit}%)</span>
                    <span className="text-2xl font-bold text-purple-400">${traderShare.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Projection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{months}-Month Projection</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">Without Scaling</div>
                  <div className="text-2xl font-bold text-white">${yearlyTraderShare.toLocaleString()}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">With Scaling*</div>
                  <div className="text-2xl font-bold text-emerald-400">${Math.round(scalingProjection).toLocaleString()}</div>
                </div>
              </div>
              
              <p className="text-gray-500 text-xs mt-4">
                *Assumes 25% account increase every 3 profitable months
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <strong className="text-blue-400">Note:</strong> These are projections based on consistent performance. 
                Actual results may vary. Most traders don&apos;t achieve consistent monthly returns.
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Size Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Account</th>
                  <th className="text-right py-3 px-4 text-gray-400">Monthly ({monthlyReturn}%)</th>
                  <th className="text-right py-3 px-4 text-gray-400">Your Share ({profitSplit}%)</th>
                  <th className="text-right py-3 px-4 text-gray-400">Yearly</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNT_SIZES.map(size => {
                  const monthly = size * (monthlyReturn / 100)
                  const share = monthly * (profitSplit / 100)
                  const yearly = share * 12
                  return (
                    <tr 
                      key={size} 
                      className={`border-b border-gray-700/50 ${size === accountSize ? 'bg-purple-500/10' : ''}`}
                    >
                      <td className="py-3 px-4 text-white font-medium">${(size / 1000)}K</td>
                      <td className="py-3 px-4 text-right text-gray-300">${monthly.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-purple-400 font-semibold">${share.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">${yearly.toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
