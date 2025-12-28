'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Plus, ChevronDown, Check, Info,
  DollarSign, Target, TrendingDown, Calendar, Shield
} from 'lucide-react'

// Prop firm presets with their rules
const propFirmPresets = [
  {
    slug: 'ftmo',
    name: 'FTMO',
    programs: [
      { name: 'Standard $10K', account_size: 10000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Standard $25K', account_size: 25000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Standard $50K', account_size: 50000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Standard $100K', account_size: 100000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Standard $200K', account_size: 200000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Swing $10K', account_size: 10000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Swing $25K', account_size: 25000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Swing $50K', account_size: 50000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Swing $100K', account_size: 100000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
      { name: 'Swing $200K', account_size: 200000, daily_dd: 5, max_dd: 10, profit_target: 10, min_days: 4 },
    ],
    max_dd_type: 'static' as const,
    allows_news_trading: false,
    allows_weekend_holding: true,
    allows_ea: true,
    allows_scaling: false,
  },
  {
    slug: 'fundednext',
    name: 'FundedNext',
    programs: [
      { name: 'Stellar 2-Step $6K', account_size: 6000, daily_dd: 5, max_dd: 10, profit_target: 8, min_days: 5 },
      { name: 'Stellar 2-Step $15K', account_size: 15000, daily_dd: 5, max_dd: 10, profit_target: 8, min_days: 5 },
      { name: 'Stellar 2-Step $25K', account_size: 25000, daily_dd: 5, max_dd: 10, profit_target: 8, min_days: 5 },
      { name: 'Stellar 2-Step $50K', account_size: 50000, daily_dd: 5, max_dd: 10, profit_target: 8, min_days: 5 },
      { name: 'Stellar 2-Step $100K', account_size: 100000, daily_dd: 5, max_dd: 10, profit_target: 8, min_days: 5 },
      { name: 'Stellar 2-Step $200K', account_size: 200000, daily_dd: 5, max_dd: 10, profit_target: 8, min_days: 5 },
      { name: 'Stellar 1-Step $6K', account_size: 6000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 2 },
      { name: 'Stellar 1-Step $15K', account_size: 15000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 2 },
      { name: 'Stellar 1-Step $25K', account_size: 25000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 2 },
      { name: 'Stellar 1-Step $50K', account_size: 50000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 2 },
      { name: 'Stellar 1-Step $100K', account_size: 100000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 2 },
    ],
    max_dd_type: 'static' as const,
    allows_news_trading: true,
    allows_weekend_holding: true,
    allows_ea: true,
    allows_scaling: true,
  },
  {
    slug: 'the5ers',
    name: 'The5ers',
    programs: [
      { name: 'High Stakes $6K', account_size: 6000, daily_dd: 3, max_dd: 6, profit_target: 8, min_days: 0 },
      { name: 'High Stakes $20K', account_size: 20000, daily_dd: 3, max_dd: 6, profit_target: 8, min_days: 0 },
      { name: 'High Stakes $60K', account_size: 60000, daily_dd: 3, max_dd: 6, profit_target: 8, min_days: 0 },
      { name: 'High Stakes $100K', account_size: 100000, daily_dd: 3, max_dd: 6, profit_target: 8, min_days: 0 },
      { name: 'Hyper Growth $10K', account_size: 10000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 0 },
      { name: 'Hyper Growth $20K', account_size: 20000, daily_dd: 3, max_dd: 6, profit_target: 10, min_days: 0 },
    ],
    max_dd_type: 'static' as const,
    allows_news_trading: true,
    allows_weekend_holding: true,
    allows_ea: true,
    allows_scaling: true,
  },
  {
    slug: 'my-funded-futures',
    name: 'My Funded Futures',
    programs: [
      { name: 'Starter $50K', account_size: 50000, daily_dd: 0, max_dd: 4, profit_target: 6, min_days: 2 },
      { name: 'Starter $100K', account_size: 100000, daily_dd: 0, max_dd: 4.5, profit_target: 6, min_days: 2 },
      { name: 'Starter $150K', account_size: 150000, daily_dd: 0, max_dd: 4.5, profit_target: 9, min_days: 2 },
    ],
    max_dd_type: 'eod_trailing' as const,
    allows_news_trading: true,
    allows_weekend_holding: false,
    allows_ea: true,
    allows_scaling: false,
  },
  {
    slug: 'topstep',
    name: 'Topstep',
    programs: [
      { name: 'Trading Combine $50K', account_size: 50000, daily_dd: 0, max_dd: 3, profit_target: 6, min_days: 5 },
      { name: 'Trading Combine $100K', account_size: 100000, daily_dd: 0, max_dd: 4, profit_target: 6, min_days: 5 },
      { name: 'Trading Combine $150K', account_size: 150000, daily_dd: 0, max_dd: 4.5, profit_target: 9, min_days: 5 },
    ],
    max_dd_type: 'eod_trailing' as const,
    allows_news_trading: true,
    allows_weekend_holding: false,
    allows_ea: true,
    allows_scaling: false,
  },
  {
    slug: 'apex-trader-funding',
    name: 'Apex Trader Funding',
    programs: [
      { name: 'Evaluation $25K', account_size: 25000, daily_dd: 0, max_dd: 3, profit_target: 4.5, min_days: 7 },
      { name: 'Evaluation $50K', account_size: 50000, daily_dd: 0, max_dd: 5, profit_target: 6, min_days: 7 },
      { name: 'Evaluation $100K', account_size: 100000, daily_dd: 0, max_dd: 6, profit_target: 6, min_days: 7 },
      { name: 'Evaluation $150K', account_size: 150000, daily_dd: 0, max_dd: 9, profit_target: 9, min_days: 7 },
      { name: 'Evaluation $250K', account_size: 250000, daily_dd: 0, max_dd: 12.5, profit_target: 15, min_days: 7 },
      { name: 'Evaluation $300K', account_size: 300000, daily_dd: 0, max_dd: 15.5, profit_target: 20, min_days: 7 },
    ],
    max_dd_type: 'trailing' as const,
    allows_news_trading: true,
    allows_weekend_holding: false,
    allows_ea: true,
    allows_scaling: true,
  },
  {
    slug: 'e8-markets',
    name: 'E8 Markets',
    programs: [
      { name: 'E8 Track $25K', account_size: 25000, daily_dd: 4, max_dd: 8, profit_target: 8, min_days: 0 },
      { name: 'E8 Track $50K', account_size: 50000, daily_dd: 4, max_dd: 8, profit_target: 8, min_days: 0 },
      { name: 'E8 Track $100K', account_size: 100000, daily_dd: 4, max_dd: 8, profit_target: 8, min_days: 0 },
      { name: 'E8 Track $250K', account_size: 250000, daily_dd: 4, max_dd: 8, profit_target: 8, min_days: 0 },
    ],
    max_dd_type: 'static' as const,
    allows_news_trading: false,
    allows_weekend_holding: true,
    allows_ea: true,
    allows_scaling: true,
  },
]

export default function AddAccountPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Form state
  const [selectedFirm, setSelectedFirm] = useState<string>('')
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [stage, setStage] = useState<string>('evaluation_1')
  const [currentBalance, setCurrentBalance] = useState<string>('')
  const [todayPnl, setTodayPnl] = useState<string>('0')
  const [tradingDays, setTradingDays] = useState<string>('0')
  
  const firm = propFirmPresets.find(f => f.slug === selectedFirm)
  const program = firm?.programs.find(p => p.name === selectedProgram)
  
  const handleSubmit = async () => {
    // In production, save to Supabase
    console.log({
      prop_firm: firm?.name,
      prop_firm_slug: firm?.slug,
      program: program?.name,
      account_size: program?.account_size,
      current_balance: parseFloat(currentBalance) || program?.account_size,
      starting_balance: program?.account_size,
      stage,
      daily_pnl: parseFloat(todayPnl) || 0,
      daily_dd_limit: program?.daily_dd,
      max_dd_limit: program?.max_dd,
      max_dd_type: firm?.max_dd_type,
      profit_target: program?.profit_target,
      min_trading_days: program?.min_days,
      current_trading_days: parseInt(tradingDays) || 0,
      allows_news_trading: firm?.allows_news_trading,
      allows_weekend_holding: firm?.allows_weekend_holding,
      allows_ea: firm?.allows_ea,
    })
    
    // Redirect to dashboard
    router.push('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Add Account
              </h1>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div 
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                s <= step ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        
        {/* Step 1: Select Prop Firm */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Select Prop Firm</h2>
              <p className="text-gray-500">Choose the prop firm and program you want to track</p>
            </div>
            
            {/* Prop Firm Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Prop Firm
              </label>
              <div className="grid grid-cols-2 gap-3">
                {propFirmPresets.map(f => (
                  <button
                    key={f.slug}
                    onClick={() => { setSelectedFirm(f.slug); setSelectedProgram(''); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedFirm === f.slug
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{f.name}</span>
                      {selectedFirm === f.slug && (
                        <Check className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{f.programs.length} programs</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Program Selection */}
            {firm && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Program
                </label>
                <div className="relative">
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select a program...</option>
                    {firm.programs.map(p => (
                      <option key={p.name} value={p.name}>
                        {p.name} - Target: {p.profit_target}%, Max DD: {p.max_dd}%
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>
            )}
            
            {/* Program Details */}
            {program && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-400" />
                  Program Rules
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Account Size</p>
                    <p className="text-white font-medium">${program.account_size.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Profit Target</p>
                    <p className="text-emerald-400 font-medium">{program.profit_target}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Daily Drawdown</p>
                    <p className="text-white font-medium">{program.daily_dd > 0 ? `${program.daily_dd}%` : 'None'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Max Drawdown ({firm.max_dd_type})</p>
                    <p className="text-white font-medium">{program.max_dd}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min Trading Days</p>
                    <p className="text-white font-medium">{program.min_days > 0 ? program.min_days : 'None'}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
                  {firm.allows_news_trading ? (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">✓ News Trading</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded">✗ No News Trading</span>
                  )}
                  {firm.allows_weekend_holding ? (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">✓ Weekend Holding</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded">✗ No Weekend</span>
                  )}
                  {firm.allows_ea && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">✓ EAs Allowed</span>
                  )}
                </div>
              </div>
            )}
            
            <button
              onClick={() => setStep(2)}
              disabled={!selectedFirm || !selectedProgram}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}
        
        {/* Step 2: Account Stage */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Account Stage</h2>
              <p className="text-gray-500">What stage is this account at?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'evaluation_1', label: 'Phase 1', desc: 'First evaluation phase', icon: Target },
                { value: 'evaluation_2', label: 'Phase 2', desc: 'Second evaluation phase', icon: Target },
                { value: 'verification', label: 'Verification', desc: 'Verification stage', icon: Shield },
                { value: 'funded', label: 'Funded', desc: 'Live funded account', icon: DollarSign },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStage(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    stage === opt.value
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <opt.icon className={`w-5 h-5 ${stage === opt.value ? 'text-emerald-400' : 'text-gray-500'}`} />
                    <span className="font-medium text-white">{opt.label}</span>
                  </div>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Current Status */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Status</h2>
              <p className="text-gray-500">Enter your account's current status</p>
            </div>
            
            {/* Current Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Balance
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  placeholder={program?.account_size.toString()}
                  className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">Starting balance: ${program?.account_size.toLocaleString()}</p>
            </div>
            
            {/* Today's P&L */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Today's P&L
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={todayPnl}
                  onChange={(e) => setTodayPnl(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">Enter negative for losses (e.g., -500)</p>
            </div>
            
            {/* Trading Days */}
            {program && program.min_days > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trading Days Completed
                </label>
                <input
                  type="number"
                  value={tradingDays}
                  onChange={(e) => setTradingDays(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-sm text-gray-600 mt-1">Minimum required: {program.min_days} days</p>
              </div>
            )}
            
            {/* Summary */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <h3 className="font-medium text-white mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Prop Firm</span>
                  <span className="text-white">{firm?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Program</span>
                  <span className="text-white">{program?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stage</span>
                  <span className="text-white capitalize">{stage.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Balance</span>
                  <span className="text-white">${parseFloat(currentBalance || program?.account_size.toString() || '0').toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
