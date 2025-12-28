'use client'

import { useState, useEffect } from 'react'
import { 
  Target, AlertTriangle, CheckCircle, XCircle, ArrowLeft,
  DollarSign, Percent, TrendingDown, Info, Zap, Shield,
  AlertCircle, ChevronDown
} from 'lucide-react'
import Link from 'next/link'

// Types
interface PropFirmAccount {
  id: string
  prop_firm: string
  program: string
  account_size: number
  current_balance: number
  starting_balance: number
  stage: string
  daily_pnl: number
  daily_dd_limit: number
  max_dd_limit: number
  max_dd_type: 'static' | 'trailing' | 'eod_trailing'
  allows_news_trading: boolean
  allows_weekend_holding: boolean
  allows_scaling: boolean
}

interface SimulationResult {
  status: 'safe' | 'warning' | 'violation'
  messages: Array<{
    type: 'success' | 'warning' | 'danger' | 'info'
    title: string
    description: string
  }>
  afterTrade: {
    balance: number
    dailyPnl: number
    dailyDDUsed: number
    maxDDUsed: number
  }
}

// Mock accounts (same as dashboard)
const mockAccounts: PropFirmAccount[] = [
  {
    id: '1',
    prop_firm: 'FTMO',
    program: 'Standard $100K',
    account_size: 100000,
    current_balance: 102450,
    starting_balance: 100000,
    stage: 'evaluation_1',
    daily_pnl: -850,
    daily_dd_limit: 5,
    max_dd_limit: 10,
    max_dd_type: 'static',
    allows_news_trading: false,
    allows_weekend_holding: true,
    allows_scaling: false,
  },
  {
    id: '2',
    prop_firm: 'FundedNext',
    program: 'Stellar 2-Step $50K',
    account_size: 50000,
    current_balance: 51200,
    starting_balance: 50000,
    stage: 'evaluation_2',
    daily_pnl: 320,
    daily_dd_limit: 5,
    max_dd_limit: 10,
    max_dd_type: 'static',
    allows_news_trading: true,
    allows_weekend_holding: true,
    allows_scaling: true,
  },
  {
    id: '3',
    prop_firm: 'My Funded Futures',
    program: 'Starter $50K',
    account_size: 50000,
    current_balance: 48900,
    starting_balance: 50000,
    stage: 'funded',
    daily_pnl: -450,
    daily_dd_limit: 0,
    max_dd_limit: 4,
    max_dd_type: 'eod_trailing',
    allows_news_trading: true,
    allows_weekend_holding: false,
    allows_scaling: false,
  },
]

// High impact news times (simplified)
const upcomingNews = [
  { time: '08:30 EST', event: 'US NFP', impact: 'high' },
  { time: '10:00 EST', event: 'ISM Manufacturing', impact: 'high' },
  { time: '14:00 EST', event: 'FOMC Minutes', impact: 'high' },
]

export default function TradeSimulatorPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [riskAmount, setRiskAmount] = useState<string>('')
  const [riskType, setRiskType] = useState<'dollars' | 'percent'>('dollars')
  const [isNewsTime, setIsNewsTime] = useState(false)
  const [isWeekend, setIsWeekend] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  
  const account = mockAccounts.find(a => a.id === selectedAccount)
  
  // Check current conditions
  useEffect(() => {
    const now = new Date()
    const day = now.getDay()
    setIsWeekend(day === 0 || day === 6 || (day === 5 && now.getHours() >= 17))
    
    // Simplified news check - in production, use a real calendar API
    const hour = now.getHours()
    setIsNewsTime(hour >= 8 && hour <= 10) // Simplified
  }, [])
  
  // Calculate risk in dollars
  const getRiskInDollars = (): number => {
    if (!account || !riskAmount) return 0
    const value = parseFloat(riskAmount)
    if (isNaN(value)) return 0
    
    if (riskType === 'percent') {
      return (value / 100) * account.current_balance
    }
    return value
  }
  
  // Simulate trade
  const simulateTrade = () => {
    if (!account) return
    
    const risk = getRiskInDollars()
    const messages: SimulationResult['messages'] = []
    let status: SimulationResult['status'] = 'safe'
    
    // Calculate new values after potential loss
    const newBalance = account.current_balance - risk
    const newDailyPnl = account.daily_pnl - risk
    
    // Daily DD check
    if (account.daily_dd_limit > 0) {
      const dailyDDLimit = account.account_size * account.daily_dd_limit / 100
      const dailyDDUsed = Math.abs(Math.min(0, newDailyPnl))
      const dailyDDPercent = (dailyDDUsed / dailyDDLimit) * 100
      
      if (dailyDDUsed >= dailyDDLimit) {
        status = 'violation'
        messages.push({
          type: 'danger',
          title: '❌ DAILY DRAWDOWN VIOLATION',
          description: `If you lose this trade, you will exceed your daily ${account.daily_dd_limit}% limit. Your account will be breached.`,
        })
      } else if (dailyDDPercent > 80) {
        if (status !== 'violation') status = 'warning'
        messages.push({
          type: 'warning',
          title: '⚠️ Daily DD at risk',
          description: `This trade would use ${dailyDDPercent.toFixed(1)}% of your daily limit. Only $${(dailyDDLimit - dailyDDUsed).toFixed(0)} buffer remaining.`,
        })
      } else {
        messages.push({
          type: 'success',
          title: '✅ Daily DD OK',
          description: `After this trade, you'll have used ${dailyDDPercent.toFixed(1)}% of your daily limit.`,
        })
      }
    }
    
    // Max DD check
    const maxDDLimit = account.account_size * account.max_dd_limit / 100
    let maxDDUsed: number
    
    if (account.max_dd_type === 'static') {
      const floorBalance = account.starting_balance - maxDDLimit
      maxDDUsed = ((account.starting_balance - newBalance) / maxDDLimit) * 100
      
      if (newBalance <= floorBalance) {
        status = 'violation'
        messages.push({
          type: 'danger',
          title: '❌ MAX DRAWDOWN VIOLATION',
          description: `If you lose this trade, your balance ($${newBalance.toFixed(0)}) will fall below the floor ($${floorBalance.toFixed(0)}). Account breached.`,
        })
      } else if (maxDDUsed > 80) {
        if (status !== 'violation') status = 'warning'
        messages.push({
          type: 'warning',
          title: '⚠️ Max DD at risk',
          description: `This trade would use ${maxDDUsed.toFixed(1)}% of your max drawdown. Only $${(newBalance - floorBalance).toFixed(0)} buffer to floor.`,
        })
      } else {
        messages.push({
          type: 'success',
          title: '✅ Max DD OK',
          description: `After this trade, you'll have used ${maxDDUsed.toFixed(1)}% of max drawdown.`,
        })
      }
    } else {
      // Trailing DD
      const highestBalance = Math.max(account.starting_balance, account.current_balance)
      const trailingFloor = highestBalance - maxDDLimit
      maxDDUsed = ((highestBalance - newBalance) / maxDDLimit) * 100
      
      if (newBalance <= trailingFloor) {
        status = 'violation'
        messages.push({
          type: 'danger',
          title: '❌ TRAILING DD VIOLATION',
          description: `If you lose this trade, your balance ($${newBalance.toFixed(0)}) will fall below the trailing floor ($${trailingFloor.toFixed(0)}). Account breached.`,
        })
      } else if (maxDDUsed > 80) {
        if (status !== 'violation') status = 'warning'
        messages.push({
          type: 'warning',
          title: '⚠️ Trailing DD at risk',
          description: `This trade would use ${maxDDUsed.toFixed(1)}% of trailing drawdown. Only $${(newBalance - trailingFloor).toFixed(0)} to trailing floor.`,
        })
      }
    }
    
    // News trading check
    if (!account.allows_news_trading && isNewsTime) {
      if (status !== 'violation') status = 'warning'
      messages.push({
        type: 'warning',
        title: '⚠️ News restriction active',
        description: `${account.prop_firm} does not allow trading during high-impact news. Check the economic calendar.`,
      })
    }
    
    // Weekend check
    if (!account.allows_weekend_holding && isWeekend) {
      messages.push({
        type: 'warning',
        title: '⚠️ Weekend holding not allowed',
        description: `Remember to close this position before market close. ${account.prop_firm} does not allow weekend holding.`,
      })
    }
    
    // Risk/Reward suggestion
    if (status === 'safe') {
      const riskPercent = (risk / account.current_balance) * 100
      if (riskPercent > 2) {
        messages.push({
          type: 'info',
          title: '💡 Risk management tip',
          description: `You're risking ${riskPercent.toFixed(1)}% on this trade. Consider keeping risk under 2% per trade for longevity.`,
        })
      }
    }
    
    setResult({
      status,
      messages,
      afterTrade: {
        balance: newBalance,
        dailyPnl: newDailyPnl,
        dailyDDUsed: account.daily_dd_limit > 0 
          ? (Math.abs(Math.min(0, newDailyPnl)) / (account.account_size * account.daily_dd_limit / 100)) * 100
          : 0,
        maxDDUsed,
      },
    })
  }
  
  const statusColors = {
    safe: 'from-emerald-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-500',
    violation: 'from-red-500 to-red-600',
  }
  
  const statusIcons = {
    safe: <CheckCircle className="w-8 h-8" />,
    warning: <AlertTriangle className="w-8 h-8" />,
    violation: <XCircle className="w-8 h-8" />,
  }
  
  const statusMessages = {
    safe: 'Trade is SAFE',
    warning: 'Proceed with CAUTION',
    violation: 'DO NOT TRADE',
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Trade Simulator
              </h1>
              <p className="text-sm text-gray-500">Check if your trade is safe before entering</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Account
              </label>
              <div className="relative">
                <select
                  value={selectedAccount}
                  onChange={(e) => { setSelectedAccount(e.target.value); setResult(null); }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">Choose an account...</option>
                  {mockAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.prop_firm} - {acc.program}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            
            {/* Account Info */}
            {account && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <h3 className="font-medium text-white mb-3">Account Status</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Current Balance</p>
                    <p className="text-white font-medium">${account.current_balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Today's P&L</p>
                    <p className={account.daily_pnl >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                      {account.daily_pnl >= 0 ? '+' : ''}${account.daily_pnl.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Daily DD Limit</p>
                    <p className="text-white font-medium">
                      {account.daily_dd_limit > 0 ? `${account.daily_dd_limit}%` : 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Max DD ({account.max_dd_type})</p>
                    <p className="text-white font-medium">{account.max_dd_limit}%</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Risk Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Risk Amount (if you lose)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {riskType === 'dollars' ? '$' : ''}
                  </span>
                  <input
                    type="number"
                    value={riskAmount}
                    onChange={(e) => { setRiskAmount(e.target.value); setResult(null); }}
                    placeholder="500"
                    className={`w-full py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 transition-colors ${riskType === 'dollars' ? 'pl-8 pr-4' : 'px-4'}`}
                  />
                  {riskType === 'percent' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  )}
                </div>
                <div className="flex bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setRiskType('dollars')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      riskType === 'dollars' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRiskType('percent')}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      riskType === 'percent' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {account && riskAmount && (
                <p className="text-sm text-gray-500 mt-2">
                  Risk: ${getRiskInDollars().toLocaleString()} ({((getRiskInDollars() / account.current_balance) * 100).toFixed(2)}% of balance)
                </p>
              )}
            </div>
            
            {/* Current Conditions */}
            <div className="flex flex-wrap gap-2">
              {isNewsTime && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 text-sm rounded-lg">
                  <Zap className="w-4 h-4" />
                  High-impact news period
                </span>
              )}
              {isWeekend && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 text-sm rounded-lg">
                  <Shield className="w-4 h-4" />
                  Weekend/After hours
                </span>
              )}
            </div>
            
            {/* Simulate Button */}
            <button
              onClick={simulateTrade}
              disabled={!selectedAccount || !riskAmount}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Simulate Trade
            </button>
          </div>
          
          {/* Results */}
          <div>
            {!result ? (
              <div className="bg-gray-800/30 border border-gray-700/30 border-dashed rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">No simulation yet</h3>
                <p className="text-sm text-gray-600">Select an account and enter your risk to check</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className={`bg-gradient-to-r ${statusColors[result.status]} rounded-2xl p-6 text-center text-white`}>
                  <div className="flex justify-center mb-3">
                    {statusIcons[result.status]}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{statusMessages[result.status]}</h2>
                  <p className="text-white/80 text-sm">
                    {result.status === 'safe' && 'This trade respects all your account limits'}
                    {result.status === 'warning' && 'This trade is risky - consider reducing size'}
                    {result.status === 'violation' && 'This trade would breach your account rules'}
                  </p>
                </div>
                
                {/* After Trade Stats */}
                {account && (
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-400 mb-3 text-sm">After this trade (if loss)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">New Balance</p>
                        <p className="text-lg font-bold text-white">${result.afterTrade.balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Daily P&L</p>
                        <p className={`text-lg font-bold ${result.afterTrade.dailyPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ${result.afterTrade.dailyPnl.toLocaleString()}
                        </p>
                      </div>
                      {account.daily_dd_limit > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Daily DD Used</p>
                          <p className={`text-lg font-bold ${result.afterTrade.dailyDDUsed > 80 ? 'text-red-400' : 'text-white'}`}>
                            {result.afterTrade.dailyDDUsed.toFixed(1)}%
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Max DD Used</p>
                        <p className={`text-lg font-bold ${result.afterTrade.maxDDUsed > 80 ? 'text-red-400' : 'text-white'}`}>
                          {result.afterTrade.maxDDUsed.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Messages */}
                <div className="space-y-3">
                  {result.messages.map((msg, i) => {
                    const colors = {
                      success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
                      warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
                      danger: 'bg-red-500/10 border-red-500/30 text-red-400',
                      info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
                    }
                    
                    return (
                      <div key={i} className={`p-4 rounded-xl border ${colors[msg.type]}`}>
                        <h4 className="font-medium mb-1">{msg.title}</h4>
                        <p className="text-sm opacity-80">{msg.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Upcoming News */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Upcoming High-Impact News
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingNews.map((news, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{news.time}</span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full uppercase">
                    {news.impact}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{news.event}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
