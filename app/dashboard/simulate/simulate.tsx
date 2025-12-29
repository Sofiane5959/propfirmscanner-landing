'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Target, Check, AlertTriangle, XCircle, ChevronDown } from 'lucide-react'

// Types
interface UserAccount {
  id: string
  prop_firm: string
  program: string
  account_size: number
  current_balance: number
  start_balance: number
  today_pnl: number
  daily_dd_percent: number
  max_dd_percent: number
  max_dd_type: 'static' | 'trailing' | 'eod_trailing'
}

interface SimResult {
  status: 'safe' | 'risky' | 'violation'
  message: string
  details: string[]
}

// Mock accounts
const mockAccounts: UserAccount[] = [
  {
    id: '1',
    prop_firm: 'FTMO',
    program: 'Standard $100K',
    account_size: 100000,
    current_balance: 102450,
    start_balance: 100000,
    today_pnl: -850,
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
  },
  {
    id: '2',
    prop_firm: 'FundedNext',
    program: 'Stellar 2-Step $50K',
    account_size: 50000,
    current_balance: 51200,
    start_balance: 50000,
    today_pnl: 320,
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
  },
  {
    id: '3',
    prop_firm: 'My Funded Futures',
    program: 'Starter $50K',
    account_size: 50000,
    current_balance: 48900,
    start_balance: 50000,
    today_pnl: -450,
    daily_dd_percent: 0,
    max_dd_percent: 4,
    max_dd_type: 'eod_trailing',
  },
]

function simulateTrade(account: UserAccount, risk: number): SimResult {
  const details: string[] = []
  let isViolation = false
  let isRisky = false
  let message = ''
  
  // Calculate daily DD impact
  if (account.daily_dd_percent > 0) {
    const dailyDDTotal = account.account_size * (account.daily_dd_percent / 100)
    const dailyDDUsed = Math.abs(Math.min(0, account.today_pnl))
    const dailyDDAfter = dailyDDUsed + risk
    const dailyDDPercentAfter = (dailyDDAfter / dailyDDTotal) * 100
    
    if (dailyDDAfter >= dailyDDTotal) {
      isViolation = true
      message = `This trade would BREACH your daily drawdown limit on ${account.prop_firm}.`
      details.push(`Daily DD: ${dailyDDPercentAfter.toFixed(0)}% used (limit is 100%)`)
    } else if (dailyDDPercentAfter > 80) {
      isRisky = true
      if (!message) message = `This trade would use ${dailyDDPercentAfter.toFixed(0)}% of your daily drawdown on ${account.prop_firm}.`
      details.push(`Only $${(dailyDDTotal - dailyDDAfter).toFixed(0)} daily buffer remaining`)
    } else if (dailyDDPercentAfter > 50) {
      isRisky = true
      details.push(`Daily DD: ${dailyDDPercentAfter.toFixed(0)}% would be used`)
    } else {
      details.push(`Daily DD: ${dailyDDPercentAfter.toFixed(0)}% - OK`)
    }
  }
  
  // Calculate max DD impact
  const maxDDTotal = account.account_size * (account.max_dd_percent / 100)
  let floor: number
  
  if (account.max_dd_type === 'static') {
    floor = account.start_balance - maxDDTotal
  } else {
    const highestBalance = Math.max(account.start_balance, account.current_balance)
    floor = highestBalance - maxDDTotal
  }
  
  const balanceAfterLoss = account.current_balance - risk
  const maxDDUsedAfter = ((account.start_balance - balanceAfterLoss) / maxDDTotal) * 100
  
  if (balanceAfterLoss <= floor) {
    isViolation = true
    message = `This trade would BREACH your max drawdown on ${account.prop_firm}.`
    details.push(`Balance after loss: $${balanceAfterLoss.toFixed(0)} (floor: $${floor.toFixed(0)})`)
  } else if (maxDDUsedAfter > 80) {
    if (!isViolation) isRisky = true
    if (!message) message = `This trade would bring you to ${maxDDUsedAfter.toFixed(0)}% of max drawdown on ${account.prop_firm}.`
    details.push(`Only $${(balanceAfterLoss - floor).toFixed(0)} max DD buffer remaining`)
  } else {
    details.push(`Max DD: ${Math.max(0, maxDDUsedAfter).toFixed(0)}% would be used`)
  }
  
  // Determine final status
  let status: 'safe' | 'risky' | 'violation' = 'safe'
  if (isViolation) {
    status = 'violation'
  } else if (isRisky) {
    status = 'risky'
  }
  
  // Default safe message
  if (status === 'safe' && !message) {
    message = `This trade is within your limits on ${account.prop_firm}.`
  }
  
  return { status, message, details }
}

export default function SimulatePage() {
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [riskUsd, setRiskUsd] = useState('')
  const [result, setResult] = useState<SimResult | null>(null)
  
  const account = mockAccounts.find(a => a.id === selectedAccountId)
  
  const handleSimulate = () => {
    if (!account || !riskUsd) return
    
    const risk = parseFloat(riskUsd)
    if (isNaN(risk) || risk <= 0) return
    
    const simResult = simulateTrade(account, risk)
    setResult(simResult)
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Trade Simulator
              </h1>
              <p className="text-sm text-gray-500">Check if a trade is safe before entering</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Select Account */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Account
            </label>
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => { setSelectedAccountId(e.target.value); setResult(null) }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-emerald-500"
              >
                <option value="">Choose an account...</option>
                {mockAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.prop_firm} — {acc.program} (${acc.current_balance.toLocaleString()})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Account Summary */}
          {account && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Current Balance</p>
                  <p className="text-white font-medium">${account.current_balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Today&apos;s P&amp;L</p>
                  <p className={account.today_pnl >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {account.today_pnl >= 0 ? '+' : ''}${account.today_pnl.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Daily DD Limit</p>
                  <p className="text-white font-medium">
                    {account.daily_dd_percent > 0 ? `${account.daily_dd_percent}%` : 'None'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Max DD Limit</p>
                  <p className="text-white font-medium">
                    {account.max_dd_percent}% ({account.max_dd_type})
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Risk Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Risk in USD (if you lose this trade)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={riskUsd}
                onChange={(e) => { setRiskUsd(e.target.value); setResult(null) }}
                placeholder="500"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          {/* Simulate Button */}
          <button
            onClick={handleSimulate}
            disabled={!selectedAccountId || !riskUsd}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            Simulate Trade
          </button>
          
          {/* Result */}
          {result && (
            <div className={`rounded-2xl overflow-hidden ${
              result.status === 'safe' ? 'bg-emerald-500/10 border-2 border-emerald-500/30' :
              result.status === 'risky' ? 'bg-yellow-500/10 border-2 border-yellow-500/30' :
              'bg-red-500/10 border-2 border-red-500/30'
            }`}>
              {/* Status Header */}
              <div className={`p-6 text-center ${
                result.status === 'safe' ? 'bg-emerald-500/20' :
                result.status === 'risky' ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                <div className="flex justify-center mb-3">
                  {result.status === 'safe' && <Check className="w-12 h-12 text-emerald-400" />}
                  {result.status === 'risky' && <AlertTriangle className="w-12 h-12 text-yellow-400" />}
                  {result.status === 'violation' && <XCircle className="w-12 h-12 text-red-400" />}
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  result.status === 'safe' ? 'text-emerald-400' :
                  result.status === 'risky' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {result.status === 'safe' && '✅ SAFE'}
                  {result.status === 'risky' && '⚠️ RISKY'}
                  {result.status === 'violation' && '❌ VIOLATION'}
                </h2>
                <p className="text-white text-lg">{result.message}</p>
              </div>
              
              {/* Details */}
              <div className="p-4 space-y-2">
                {result.details.map((detail, i) => (
                  <p key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {!result && (
            <div className="text-center py-8 text-gray-600">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select an account and enter your risk to simulate</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
