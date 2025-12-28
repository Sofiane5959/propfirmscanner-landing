'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, RefreshCw, Target, BookOpen, AlertTriangle, 
  Check, X, TrendingDown, DollarSign, ChevronRight,
  Edit3, Save, Clock
} from 'lucide-react'

// Types
interface UserAccount {
  id: string
  prop_firm: string
  prop_firm_slug: string
  program: string
  account_size: number
  start_balance: number
  current_balance: number
  stage: 'eval_1' | 'eval_2' | 'funded' | 'verification'
  today_pnl: number
  daily_dd_percent: number // e.g., 5 for 5%
  max_dd_percent: number // e.g., 10 for 10%
  max_dd_type: 'static' | 'trailing' | 'eod_trailing'
  allows_news: boolean
  allows_weekend: boolean
  start_date: string
}

// Mock data
const mockAccounts: UserAccount[] = [
  {
    id: '1',
    prop_firm: 'FTMO',
    prop_firm_slug: 'ftmo',
    program: 'Standard $100K',
    account_size: 100000,
    start_balance: 100000,
    current_balance: 102450,
    stage: 'eval_1',
    today_pnl: -850,
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
    allows_news: false,
    allows_weekend: true,
    start_date: '2024-01-15',
  },
  {
    id: '2',
    prop_firm: 'FundedNext',
    prop_firm_slug: 'fundednext',
    program: 'Stellar 2-Step $50K',
    account_size: 50000,
    start_balance: 50000,
    current_balance: 51200,
    stage: 'eval_2',
    today_pnl: 320,
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
    allows_news: true,
    allows_weekend: true,
    start_date: '2024-01-10',
  },
  {
    id: '3',
    prop_firm: 'My Funded Futures',
    prop_firm_slug: 'my-funded-futures',
    program: 'Starter $50K',
    account_size: 50000,
    start_balance: 50000,
    current_balance: 48900,
    stage: 'funded',
    today_pnl: -450,
    daily_dd_percent: 0, // No daily limit
    max_dd_percent: 4,
    max_dd_type: 'eod_trailing',
    allows_news: true,
    allows_weekend: false,
    start_date: '2024-01-05',
  },
]

// Calculate drawdown limits
function calculateLimits(account: UserAccount) {
  // Daily DD remaining
  const dailyDDTotal = account.account_size * (account.daily_dd_percent / 100)
  const dailyDDUsed = Math.abs(Math.min(0, account.today_pnl))
  const dailyDDRemaining = account.daily_dd_percent > 0 ? dailyDDTotal - dailyDDUsed : null
  const dailyDDPercent = account.daily_dd_percent > 0 ? (dailyDDUsed / dailyDDTotal) * 100 : 0
  
  // Max DD remaining (depends on type)
  let maxDDRemaining: number
  let maxDDPercent: number
  
  if (account.max_dd_type === 'static') {
    // Static: floor is start_balance - max_dd
    const floor = account.start_balance - (account.account_size * account.max_dd_percent / 100)
    maxDDRemaining = account.current_balance - floor
    maxDDPercent = ((account.start_balance - account.current_balance) / (account.account_size * account.max_dd_percent / 100)) * 100
  } else {
    // Trailing: floor trails from highest balance
    const highestBalance = Math.max(account.start_balance, account.current_balance + Math.abs(Math.min(0, account.today_pnl)))
    const floor = highestBalance - (account.account_size * account.max_dd_percent / 100)
    maxDDRemaining = account.current_balance - floor
    maxDDPercent = ((highestBalance - account.current_balance) / (account.account_size * account.max_dd_percent / 100)) * 100
  }
  
  maxDDPercent = Math.max(0, maxDDPercent)
  
  // Risk level
  let riskLevel: 'safe' | 'warning' | 'danger' = 'safe'
  if (dailyDDPercent > 80 || maxDDPercent > 80) riskLevel = 'danger'
  else if (dailyDDPercent > 50 || maxDDPercent > 50) riskLevel = 'warning'
  
  return {
    dailyDDRemaining,
    dailyDDPercent,
    maxDDRemaining,
    maxDDPercent,
    riskLevel,
  }
}

// Stage badge
function StageBadge({ stage }: { stage: string }) {
  const config = {
    eval_1: { label: 'Phase 1', color: 'bg-blue-500/20 text-blue-400' },
    eval_2: { label: 'Phase 2', color: 'bg-purple-500/20 text-purple-400' },
    verification: { label: 'Verification', color: 'bg-yellow-500/20 text-yellow-400' },
    funded: { label: 'Funded', color: 'bg-emerald-500/20 text-emerald-400' },
  }
  const { label, color } = config[stage as keyof typeof config] || { label: stage, color: 'bg-gray-500/20 text-gray-400' }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}

// Account Card
function AccountCard({ account, onUpdate }: { account: UserAccount; onUpdate: (id: string, pnl: number) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempPnl, setTempPnl] = useState(account.today_pnl.toString())
  
  const limits = calculateLimits(account)
  
  const borderColor = {
    safe: 'border-gray-700/50 hover:border-emerald-500/30',
    warning: 'border-yellow-500/50',
    danger: 'border-red-500/50',
  }
  
  const handleSavePnl = () => {
    onUpdate(account.id, parseFloat(tempPnl) || 0)
    setIsEditing(false)
  }
  
  return (
    <div className={`bg-gray-800/50 border-2 ${borderColor[limits.riskLevel]} rounded-2xl overflow-hidden transition-all`}>
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{account.prop_firm}</h3>
            <p className="text-sm text-gray-500">{account.program}</p>
          </div>
          <StageBadge stage={account.stage} />
        </div>
        
        {/* Balance & Today PnL */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-white">${account.current_balance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Today P&L</p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempPnl}
                  onChange={(e) => setTempPnl(e.target.value)}
                  className="w-24 px-2 py-1 bg-gray-900 border border-gray-600 rounded text-right text-white text-lg"
                  autoFocus
                />
                <button onClick={handleSavePnl} className="p-1 text-emerald-400 hover:text-emerald-300">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className={`text-xl font-bold flex items-center gap-1 ${account.today_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {account.today_pnl >= 0 ? '+' : ''}${account.today_pnl.toLocaleString()}
                <Edit3 className="w-3 h-3 opacity-50" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Drawdown Meters */}
      <div className="px-5 py-4 bg-gray-900/50 border-t border-gray-700/50 space-y-3">
        {/* Daily DD */}
        {account.daily_dd_percent > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Daily Drawdown ({account.daily_dd_percent}%)</span>
              <span className={limits.dailyDDPercent > 50 ? 'text-yellow-400 font-medium' : 'text-gray-400'}>
                ${limits.dailyDDRemaining?.toFixed(0)} remaining
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  limits.dailyDDPercent > 80 ? 'bg-red-500' : 
                  limits.dailyDDPercent > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, limits.dailyDDPercent)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Max DD */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">
              Max Drawdown ({account.max_dd_percent}%)
              {account.max_dd_type !== 'static' && (
                <span className="ml-1 text-yellow-400">⚠️ Trailing</span>
              )}
            </span>
            <span className={limits.maxDDPercent > 50 ? 'text-yellow-400 font-medium' : 'text-gray-400'}>
              ${limits.maxDDRemaining.toFixed(0)} remaining
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                limits.maxDDPercent > 80 ? 'bg-red-500' : 
                limits.maxDDPercent > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, limits.maxDDPercent)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-gray-700/50">
        {account.max_dd_type !== 'static' && (
          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {account.max_dd_type === 'trailing' ? 'Trailing DD' : 'EOD Trailing'}
          </span>
        )}
        {account.allows_news ? (
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg flex items-center gap-1">
            <Check className="w-3 h-3" /> News ✓
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-1">
            <X className="w-3 h-3" /> News ✗
          </span>
        )}
        {account.allows_weekend ? (
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg flex items-center gap-1">
            <Check className="w-3 h-3" /> Weekend ✓
          </span>
        ) : (
          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-1">
            <X className="w-3 h-3" /> Weekend ✗
          </span>
        )}
      </div>
      
      {/* Actions */}
      <div className="p-4 pt-0 grid grid-cols-3 gap-2">
        <button 
          onClick={() => setIsEditing(true)}
          className="py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Update
        </button>
        <Link
          href={`/dashboard/simulate?account=${account.id}`}
          className="py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Target className="w-4 h-4" />
          Simulate
        </Link>
        <Link
          href={`/dashboard/rules?firm=${account.prop_firm_slug}`}
          className="py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <BookOpen className="w-4 h-4" />
          Rules
        </Link>
      </div>
    </div>
  )
}

// Main Dashboard
export default function DashboardPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  
  const handleUpdatePnl = (id: string, pnl: number) => {
    setAccounts(accounts.map(a => 
      a.id === id ? { ...a, today_pnl: pnl } : a
    ))
  }
  
  // Summary stats
  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0)
  const todayPnl = accounts.reduce((sum, a) => sum + a.today_pnl, 0)
  const accountsAtRisk = accounts.filter(a => {
    const limits = calculateLimits(a)
    return limits.riskLevel === 'warning' || limits.riskLevel === 'danger'
  }).length
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">My Accounts</h1>
              <p className="text-sm text-gray-500">Track all your prop firm accounts</p>
            </div>
            <Link
              href="/dashboard/accounts/new"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Total Balance</p>
            <p className="text-2xl font-bold text-white">${totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Today's P&L</p>
            <p className={`text-2xl font-bold ${todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {todayPnl >= 0 ? '+' : ''}${todayPnl.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Accounts at Risk</p>
            <p className={`text-2xl font-bold ${accountsAtRisk > 0 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {accountsAtRisk} / {accounts.length}
            </p>
          </div>
        </div>
        
        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No accounts yet</h3>
            <p className="text-gray-500 mb-6">Add your first prop firm account to start tracking</p>
            <Link
              href="/dashboard/accounts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Account
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account} 
                onUpdate={handleUpdatePnl}
              />
            ))}
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link 
            href="/dashboard/simulate"
            className="flex items-center gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Trade Simulator</h3>
              <p className="text-sm text-gray-500">Check if a trade is safe before entering</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </Link>
          
          <Link 
            href="/dashboard/rules"
            className="flex items-center gap-4 p-5 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Rules & Hidden Risks</h3>
              <p className="text-sm text-gray-500">Avoid common mistakes for each prop firm</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
          </Link>
        </div>
      </main>
    </div>
  )
}
