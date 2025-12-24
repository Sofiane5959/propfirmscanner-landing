'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calculator, AlertTriangle, CheckCircle, Info, 
  DollarSign, Percent, TrendingDown, Target,
  ChevronDown, ArrowRight, Shield
} from 'lucide-react'

// Popular prop firm presets
const propFirmPresets = [
  { name: 'Custom', dailyDrawdown: 5, maxDrawdown: 10, profitTarget: 10 },
  { name: 'FTMO', dailyDrawdown: 5, maxDrawdown: 10, profitTarget: 10 },
  { name: 'The5ers', dailyDrawdown: 4, maxDrawdown: 6, profitTarget: 6 },
  { name: 'Topstep', dailyDrawdown: 4.5, maxDrawdown: 9, profitTarget: 6 },
  { name: 'Funded Next', dailyDrawdown: 5, maxDrawdown: 10, profitTarget: 10 },
  { name: 'MyFundedFX', dailyDrawdown: 5, maxDrawdown: 8, profitTarget: 8 },
  { name: 'E8 Funding', dailyDrawdown: 5, maxDrawdown: 8, profitTarget: 8 },
]

const accountSizes = [10000, 25000, 50000, 100000, 200000, 400000]

export default function RiskCalculatorClient() {
  const [selectedPreset, setSelectedPreset] = useState('FTMO')
  const [accountSize, setAccountSize] = useState(100000)
  const [dailyDrawdown, setDailyDrawdown] = useState(5)
  const [maxDrawdown, setMaxDrawdown] = useState(10)
  const [riskPerTrade, setRiskPerTrade] = useState(1)
  const [profitTarget, setProfitTarget] = useState(10)
  
  // Results
  const [results, setResults] = useState({
    maxDailyLoss: 0,
    maxTotalLoss: 0,
    maxRiskPerTrade: 0,
    losingTradesAllowedDaily: 0,
    losingTradesAllowedTotal: 0,
    profitTargetAmount: 0,
    riskRewardNeeded: 0,
  })

  // Calculate on input change
  useEffect(() => {
    const maxDailyLoss = accountSize * (dailyDrawdown / 100)
    const maxTotalLoss = accountSize * (maxDrawdown / 100)
    const maxRiskPerTrade = accountSize * (riskPerTrade / 100)
    const losingTradesAllowedDaily = Math.floor(maxDailyLoss / maxRiskPerTrade)
    const losingTradesAllowedTotal = Math.floor(maxTotalLoss / maxRiskPerTrade)
    const profitTargetAmount = accountSize * (profitTarget / 100)
    const tradesNeededAt1R = Math.ceil(profitTargetAmount / maxRiskPerTrade)
    const riskRewardNeeded = tradesNeededAt1R > losingTradesAllowedTotal 
      ? (profitTargetAmount / (losingTradesAllowedTotal * maxRiskPerTrade)).toFixed(1)
      : '1.0'

    setResults({
      maxDailyLoss,
      maxTotalLoss,
      maxRiskPerTrade,
      losingTradesAllowedDaily,
      losingTradesAllowedTotal,
      profitTargetAmount,
      riskRewardNeeded: parseFloat(riskRewardNeeded),
    })
  }, [accountSize, dailyDrawdown, maxDrawdown, riskPerTrade, profitTarget])

  // Handle preset change
  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName)
    const preset = propFirmPresets.find(p => p.name === presetName)
    if (preset) {
      setDailyDrawdown(preset.dailyDrawdown)
      setMaxDrawdown(preset.maxDrawdown)
      setProfitTarget(preset.profitTarget)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Calculator className="w-4 h-4" />
            Free Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prop Firm <span className="text-emerald-400">Risk Calculator</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Calculate your maximum risk per trade and protect your prop firm account from blowing up.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Your Settings
            </h2>

            {/* Prop Firm Preset */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Prop Firm Preset</label>
              <div className="relative">
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
                >
                  {propFirmPresets.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Account Size */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Account Size</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {accountSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setAccountSize(size)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      accountSize === size
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ${size >= 1000 ? `${size / 1000}K` : size}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Daily Drawdown */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Daily Drawdown Limit
                <span className="text-emerald-400 ml-2">{dailyDrawdown}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={dailyDrawdown}
                onChange={(e) => {
                  setDailyDrawdown(Number(e.target.value))
                  setSelectedPreset('Custom')
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Max Drawdown */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Max Drawdown Limit
                <span className="text-red-400 ml-2">{maxDrawdown}%</span>
              </label>
              <input
                type="range"
                min="4"
                max="20"
                step="0.5"
                value={maxDrawdown}
                onChange={(e) => {
                  setMaxDrawdown(Number(e.target.value))
                  setSelectedPreset('Custom')
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Risk Per Trade */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Risk Per Trade
                <span className="text-blue-400 ml-2">{riskPerTrade}%</span>
              </label>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.25"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.25%</span>
                <span>3%</span>
              </div>
            </div>

            {/* Profit Target */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">
                Profit Target
                <span className="text-green-400 ml-2">{profitTarget}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={profitTarget}
                onChange={(e) => {
                  setProfitTarget(Number(e.target.value))
                  setSelectedPreset('Custom')
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            
            {/* Main Results */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Your Risk Limits
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Max Risk Per Trade</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(results.maxRiskPerTrade)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{riskPerTrade}% of account</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Daily Loss Limit</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(results.maxDailyLoss)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{dailyDrawdown}% of account</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Max Total Loss</p>
                  <p className="text-2xl font-bold text-red-400">
                    {formatCurrency(results.maxTotalLoss)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{maxDrawdown}% of account</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Profit Target</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(results.profitTargetAmount)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{profitTarget}% of account</p>
                </div>
              </div>
            </div>

            {/* Losing Trades Warning */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Before You Blow Your Account
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Losing trades allowed TODAY</p>
                    <p className="text-gray-400 text-sm">Before hitting daily drawdown</p>
                  </div>
                  <div className="text-3xl font-bold text-yellow-400">
                    {results.losingTradesAllowedDaily}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div>
                    <p className="text-white font-medium">Losing trades allowed TOTAL</p>
                    <p className="text-gray-400 text-sm">Before account termination</p>
                  </div>
                  <div className="text-3xl font-bold text-red-400">
                    {results.losingTradesAllowedTotal}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk/Reward Advice */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Recommended Strategy
              </h3>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="text-gray-300 mb-2">
                  To pass this challenge with {riskPerTrade}% risk per trade, aim for a minimum:
                </p>
                <p className="text-3xl font-bold text-emerald-400">
                  {results.riskRewardNeeded}:1 Risk/Reward
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  This gives you enough buffer to survive losing streaks.
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/compare"
              className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              Find the Best Prop Firm for You
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-16 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">How to Use This Calculator</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-emerald-400 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Select Your Prop Firm</h3>
              <p className="text-gray-400 text-sm">
                Choose a preset or enter custom drawdown limits. Each firm has different rules.
              </p>
            </div>
            
            <div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-emerald-400 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Set Your Risk Per Trade</h3>
              <p className="text-gray-400 text-sm">
                We recommend 0.5-1% for beginners. Never risk more than 2% per trade.
              </p>
            </div>
            
            <div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-emerald-400 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Follow the Numbers</h3>
              <p className="text-gray-400 text-sm">
                Know exactly how many trades you can lose. Stop trading when you're close to limits.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Learn More About Risk Management</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/blog/daily-vs-max-drawdown" className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Daily vs Max Drawdown</h3>
              <p className="text-gray-400 text-sm">Understand the difference and why it matters.</p>
            </Link>
            <Link href="/blog/trailing-drawdown-explained" className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Trailing Drawdown Explained</h3>
              <p className="text-gray-400 text-sm">The #1 reason traders fail prop firm challenges.</p>
            </Link>
            <Link href="/blog/top-7-reasons-traders-fail" className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Top 7 Reasons Traders Fail</h3>
              <p className="text-gray-400 text-sm">Avoid these common mistakes.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Settings(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
