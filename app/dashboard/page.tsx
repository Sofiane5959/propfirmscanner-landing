'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, AlertTriangle, CheckCircle, Plus, TrendingDown, 
  DollarSign, Calendar, Clock, ChevronRight, Zap, Target,
  AlertCircle, ArrowUpRight, ArrowDownRight, Settings, Bell
} from 'lucide-react'
import Link from 'next/link'

// Types
interface PropFirmAccount {
  id: string
  prop_firm: string
  prop_firm_slug: string
  program: string
  account_size: number
  current_balance: number
  starting_balance: number
  stage: 'evaluation_1' | 'evaluation_2' | 'funded' | 'verification'
  daily_pnl: number
  daily_dd_limit: number
  max_dd_limit: number
  max_dd_type: 'static' | 'trailing' | 'eod_trailing'
  profit_target: number
  min_trading_days: number
  current_trading_days: number
  allows_news_trading: boolean
  allows_weekend_holding: boolean
  allows_scaling: boolean
  created_at: string
  last_updated: string
}

interface DashboardStats {
  totalAccounts: number
  totalBalance: number
  todayPnl: number
  accountsAtRisk: number
  accountsSafe: number
}

// Mock data - will be replaced with Supabase
const mockAccounts: PropFirmAccount[] = [
  {
    id: '1',
    prop_firm: 'FTMO',
    prop_firm_slug: 'ftmo',
    program: 'Standard $100K',
    account_size: 100000,
    current_balance: 102450,
    starting_balance: 100000,
    stage: 'evaluation_1',
    daily_pnl: -850,
    daily_dd_limit: 5,
    max_dd_limit: 10,
    max_dd_type: 'static',
    profit_target: 10,
    min_trading_days: 4,
    current_trading_days: 6,
    allows_news_trading: false,
    allows_weekend_holding: true,
    allows_scaling: false,
    created_at: '2024-01-15',
    last_updated: new Date().toISOString(),
  },
  {
    id: '2',
    prop_firm: 'FundedNext',
    prop_firm_slug: 'fundednext',
    program: 'Stellar 2-Step $50K',
    account_size: 50000,
    current_balance: 51200,
    starting_balance: 50000,
    stage: 'evaluation_2',
    daily_pnl: 320,
    daily_dd_limit: 5,
    max_dd_limit: 10,
    max_dd_type: 'static',
    profit_target: 5,
    min_trading_days: 5,
    current_trading_days: 3,
    allows_news_trading: true,
    allows_weekend_holding: true,
    allows_scaling: true,
    created_at: '2024-01-10',
    last_updated: new Date().toISOString(),
  },
  {
    id: '3',
    prop_firm: 'My Funded Futures',
    prop_firm_slug: 'my-funded-futures',
    program: 'Starter $50K',
    account_size: 50000,
    current_balance: 48900,
    starting_balance: 50000,
    stage: 'funded',
    daily_pnl: -450,
    daily_dd_limit: 0, // No daily limit
    max_dd_limit: 4,
    max_dd_type: 'eod_trailing',
    profit_target: 0,
    min_trading_days: 0,
    current_trading_days: 12,
    allows_news_trading: true,
    allows_weekend_holding: false,
    allows_scaling: false,
    created_at: '2024-01-05',
    last_updated: new Date().toISOString(),
  },
]

// Calculate account health
function calculateAccountHealth(account: PropFirmAccount) {
  const dailyDDUsed = account.daily_dd_limit > 0 
    ? Math.abs(Math.min(0, account.daily_pnl)) / (account.account_size * account.daily_dd_limit / 100) * 100
    : 0
  
  const maxDDUsed = (() => {
    if (account.max_dd_type === 'static') {
      const maxLoss = account.account_size * account.max_dd_limit / 100
      const currentLoss = account.starting_balance - account.current_balance
      return Math.max(0, currentLoss / maxLoss * 100)
    } else {
      // Trailing - from highest balance
      const maxLoss = account.account_size * account.max_dd_limit / 100
      const highestBalance = Math.max(account.starting_balance, account.current_balance + Math.abs(account.daily_pnl))
      const currentLoss = highestBalance - account.current_balance
      return Math.max(0, currentLoss / maxLoss * 100)
    }
  })()
  
  const profitProgress = account.profit_target > 0
    ? ((account.current_balance - account.starting_balance) / (account.starting_balance * account.profit_target / 100)) * 100
    : 100
  
  const tradingDaysProgress = account.min_trading_days > 0
    ? (account.current_trading_days / account.min_trading_days) * 100
    : 100
  
  // Risk level
  let riskLevel: 'safe' | 'warning' | 'danger' = 'safe'
  if (dailyDDUsed > 80 || maxDDUsed > 80) riskLevel = 'danger'
  else if (dailyDDUsed > 50 || maxDDUsed > 50) riskLevel = 'warning'
  
  return {
    dailyDDUsed,
    maxDDUsed,
    profitProgress,
    tradingDaysProgress,
    riskLevel,
    dailyDDRemaining: account.daily_dd_limit > 0 
      ? (account.account_size * account.daily_dd_limit / 100) + Math.min(0, account.daily_pnl)
      : null,
    maxDDRemaining: (() => {
      if (account.max_dd_type === 'static') {
        return account.current_balance - (account.starting_balance - account.account_size * account.max_dd_limit / 100)
      } else {
        const highestBalance = Math.max(account.starting_balance, account.current_balance)
        return account.current_balance - (highestBalance - account.account_size * account.max_dd_limit / 100)
      }
    })(),
  }
}

// Account Card Component
function AccountCard({ account }: { account: PropFirmAccount }) {
  const health = calculateAccountHealth(account)
  
  const stageLabels = {
    evaluation_1: 'Phase 1',
    evaluation_2: 'Phase 2',
    funded: 'Funded',
    verification: 'Verification',
  }
  
  const stageColors = {
    evaluation_1: 'bg-blue-500/20 text-blue-400',
    evaluation_2: 'bg-purple-500/20 text-purple-400',
    funded: 'bg-emerald-500/20 text-emerald-400',
    verification: 'bg-yellow-500/20 text-yellow-400',
  }
  
  const riskColors = {
    safe: 'border-emerald-500/30',
    warning: 'border-yellow-500/50',
    danger: 'border-red-500/50 animate-pulse',
  }
  
  const riskIcons = {
    safe: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    danger: <AlertCircle className="w-5 h-5 text-red-400" />,
  }
  
  return (
    <div className={`bg-gray-800/50 border-2 ${riskColors[health.riskLevel]} rounded-2xl p-5 transition-all hover:bg-gray-800/70`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-lg">{account.prop_firm}</h3>
            {riskIcons[health.riskLevel]}
          </div>
          <p className="text-sm text-gray-400">{account.program}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[account.stage]}`}>
          {stageLabels[account.stage]}
        </span>
      </div>
      
      {/* Balance */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">
            ${account.current_balance.toLocaleString()}
          </span>
          <span className={`flex items-center gap-1 text-sm ${account.daily_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {account.daily_pnl >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            ${Math.abs(account.daily_pnl).toLocaleString()} today
          </span>
        </div>
      </div>
      
      {/* Risk Meters */}
      <div className="space-y-3 mb-4">
        {/* Daily DD */}
        {account.daily_dd_limit > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Daily Drawdown</span>
              <span className={health.dailyDDUsed > 50 ? 'text-yellow-400' : 'text-gray-300'}>
                ${health.dailyDDRemaining?.toLocaleString()} left
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  health.dailyDDUsed > 80 ? 'bg-red-500' : 
                  health.dailyDDUsed > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, health.dailyDDUsed)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Max DD */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">
              Max Drawdown 
              <span className="text-gray-600 ml-1">
                ({account.max_dd_type === 'static' ? 'Static' : 'Trailing'})
              </span>
            </span>
            <span className={health.maxDDUsed > 50 ? 'text-yellow-400' : 'text-gray-300'}>
              ${health.maxDDRemaining.toLocaleString()} left
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                health.maxDDUsed > 80 ? 'bg-red-500' : 
                health.maxDDUsed > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, health.maxDDUsed)}%` }}
            />
          </div>
        </div>
        
        {/* Profit Target (for evaluation) */}
        {account.profit_target > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Profit Target ({account.profit_target}%)</span>
              <span className="text-emerald-400">
                {health.profitProgress.toFixed(1)}% done
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, health.profitProgress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Rules */}
      <div className="flex flex-wrap gap-2 mb-4">
        {!account.allows_news_trading && (
          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> No News Trading
          </span>
        )}
        {!account.allows_weekend_holding && (
          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3" /> Close Before Weekend
          </span>
        )}
        {account.min_trading_days > 0 && account.current_trading_days < account.min_trading_days && (
          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {account.current_trading_days}/{account.min_trading_days} days
          </span>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Link 
          href={`/dashboard/accounts/${account.id}`}
          className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center text-sm font-medium rounded-lg transition-colors"
        >
          Details
        </Link>
        <Link
          href={`/dashboard/simulate?account=${account.id}`}
          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-center text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Target className="w-4 h-4" />
          Simulate
        </Link>
      </div>
    </div>
  )
}

// Alert Component
function AlertBanner({ account, type, message }: { account: string; type: 'danger' | 'warning' | 'info'; message: string }) {
  const colors = {
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }
  
  const icons = {
    danger: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    info: <Bell className="w-5 h-5 flex-shrink-0" />,
  }
  
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${colors[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <span className="font-medium">{account}</span>
        <span className="mx-2">—</span>
        <span>{message}</span>
      </div>
      <ChevronRight className="w-5 h-5 opacity-50" />
    </div>
  )
}

// Main Dashboard Component
export default function DashboardPage() {
  const [accounts, setAccounts] = useState<PropFirmAccount[]>(mockAccounts)
  const [stats, setStats] = useState<DashboardStats>({
    totalAccounts: 0,
    totalBalance: 0,
    todayPnl: 0,
    accountsAtRisk: 0,
    accountsSafe: 0,
  })
  
  // Calculate stats
  useEffect(() => {
    const accountsAtRisk = accounts.filter(a => {
      const health = calculateAccountHealth(a)
      return health.riskLevel === 'danger' || health.riskLevel === 'warning'
    }).length
    
    setStats({
      totalAccounts: accounts.length,
      totalBalance: accounts.reduce((sum, a) => sum + a.current_balance, 0),
      todayPnl: accounts.reduce((sum, a) => sum + a.daily_pnl, 0),
      accountsAtRisk,
      accountsSafe: accounts.length - accountsAtRisk,
    })
  }, [accounts])
  
  // Generate alerts
  const alerts = accounts.flatMap(account => {
    const health = calculateAccountHealth(account)
    const alerts = []
    
    if (health.dailyDDUsed > 80) {
      alerts.push({ account: account.prop_firm, type: 'danger' as const, message: 'Daily drawdown limit almost reached! Stop trading today.' })
    } else if (health.dailyDDUsed > 50) {
      alerts.push({ account: account.prop_firm, type: 'warning' as const, message: 'Over 50% of daily drawdown used. Trade carefully.' })
    }
    
    if (health.maxDDUsed > 80) {
      alerts.push({ account: account.prop_firm, type: 'danger' as const, message: 'Max drawdown critical! Consider reducing position sizes.' })
    }
    
    // Weekend warning (if Friday)
    const today = new Date().getDay()
    if ((today === 5 || today === 6) && !account.allows_weekend_holding) {
      alerts.push({ account: account.prop_firm, type: 'warning' as const, message: 'Close all positions before market close - no weekend holding allowed.' })
    }
    
    return alerts
  })
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Control Center</h1>
              <p className="text-sm text-gray-500">Manage all your prop firm accounts</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/simulate"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <Target className="w-4 h-4" />
                Trade Simulator
              </Link>
              <Link
                href="/dashboard/accounts/new"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm text-gray-400">Total Balance</span>
            </div>
            <p className="text-2xl font-bold text-white">${stats.totalBalance.toLocaleString()}</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.todayPnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                <TrendingDown className={`w-5 h-5 ${stats.todayPnl >= 0 ? 'text-emerald-400 rotate-180' : 'text-red-400'}`} />
              </div>
              <span className="text-sm text-gray-400">Today's P&L</span>
            </div>
            <p className={`text-2xl font-bold ${stats.todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.todayPnl >= 0 ? '+' : ''}{stats.todayPnl.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm text-gray-400">Accounts Safe</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.accountsSafe}</p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stats.accountsAtRisk > 0 ? 'bg-red-500/20' : 'bg-gray-700'}`}>
                <AlertTriangle className={`w-5 h-5 ${stats.accountsAtRisk > 0 ? 'text-red-400' : 'text-gray-500'}`} />
              </div>
              <span className="text-sm text-gray-400">At Risk</span>
            </div>
            <p className={`text-2xl font-bold ${stats.accountsAtRisk > 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {stats.accountsAtRisk}
            </p>
          </div>
        </div>
        
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              Active Alerts ({alerts.length})
            </h2>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <AlertBanner key={i} {...alert} />
              ))}
            </div>
          </div>
        )}
        
        {/* Accounts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">My Accounts ({accounts.length})</h2>
            <Link href="/dashboard/accounts" className="text-sm text-emerald-400 hover:text-emerald-300">
              View All →
            </Link>
          </div>
          
          {accounts.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700/50 border-dashed rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No accounts yet</h3>
              <p className="text-gray-500 mb-4">Add your first prop firm account to start tracking</p>
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
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link 
            href="/dashboard/simulate"
            className="group bg-gradient-to-br from-emerald-900/50 to-gray-900 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Trade Simulator</h3>
            <p className="text-sm text-gray-500">Check if a trade is safe before entering</p>
          </Link>
          
          <Link 
            href="/dashboard/rules"
            className="group bg-gradient-to-br from-purple-900/50 to-gray-900 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Hidden Rules & Traps</h3>
            <p className="text-sm text-gray-500">Avoid common mistakes per prop firm</p>
          </Link>
          
          <Link 
            href="/dashboard/settings"
            className="group bg-gradient-to-br from-blue-900/50 to-gray-900 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Alert Settings</h3>
            <p className="text-sm text-gray-500">Configure notifications & thresholds</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
