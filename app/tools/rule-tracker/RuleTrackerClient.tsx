'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, Trash2, Edit2, Save, X, AlertTriangle, CheckCircle, 
  TrendingUp, TrendingDown, DollarSign, Target, Shield,
  ChevronDown, BarChart3, Clock, AlertCircle
} from 'lucide-react'

// Prop firm presets
const propFirmPresets = [
  { name: 'FTMO', dailyDD: 5, maxDD: 10, profitTarget: 10 },
  { name: 'The5ers', dailyDD: 4, maxDD: 6, profitTarget: 6 },
  { name: 'Topstep', dailyDD: 4.5, maxDD: 9, profitTarget: 6 },
  { name: 'Funded Next', dailyDD: 5, maxDD: 10, profitTarget: 10 },
  { name: 'MyFundedFX', dailyDD: 5, maxDD: 8, profitTarget: 8 },
  { name: 'E8 Funding', dailyDD: 5, maxDD: 8, profitTarget: 8 },
  { name: 'Alpha Capital', dailyDD: 5, maxDD: 10, profitTarget: 8 },
  { name: 'Custom', dailyDD: 5, maxDD: 10, profitTarget: 10 },
]

const accountSizeOptions = [10000, 25000, 50000, 100000, 200000, 400000]

interface Account {
  id: string
  name: string
  propFirm: string
  accountSize: number
  dailyDD: number
  maxDD: number
  profitTarget: number
  currentBalance: number
  startingBalance: number
  status: 'evaluation' | 'funded'
  phase: number
  createdAt: string
  dailyPnL: number
  highestBalance: number
}

type StatusLevel = 'safe' | 'warning' | 'danger'

export default function RuleTrackerClient() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('propfirm-accounts')
    if (saved) {
      try {
        setAccounts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load accounts')
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('propfirm-accounts', JSON.stringify(accounts))
    }
  }, [accounts, isLoaded])

  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAccounts([...accounts, newAccount])
    setShowAddModal(false)
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, ...updates } : acc
    ))
    setEditingAccount(null)
  }

  const deleteAccount = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== id))
    }
  }

  const resetDailyPnL = (id: string) => {
    updateAccount(id, { dailyPnL: 0 })
  }

  const getStatus = (account: Account): { level: StatusLevel; message: string } => {
    const dailyDDAmount = account.accountSize * (account.dailyDD / 100)
    const maxDDAmount = account.accountSize * (account.maxDD / 100)
    const dailyUsed = Math.abs(Math.min(0, account.dailyPnL))
    const totalLoss = account.startingBalance - account.currentBalance
    
    const dailyRemaining = dailyDDAmount - dailyUsed
    const maxRemaining = maxDDAmount - Math.max(0, totalLoss)
    
    const dailyPercent = (dailyUsed / dailyDDAmount) * 100
    const maxPercent = (Math.max(0, totalLoss) / maxDDAmount) * 100

    if (dailyPercent >= 80 || maxPercent >= 80) {
      return { level: 'danger', message: 'STOP TRADING - Near drawdown limit!' }
    }
    if (dailyPercent >= 50 || maxPercent >= 50) {
      return { level: 'warning', message: 'Caution - Reduce risk' }
    }
    return { level: 'safe', message: 'All good - Trade safely' }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value)
  }

  const getStatusColor = (level: StatusLevel) => {
    switch (level) {
      case 'safe': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'danger': return 'text-red-400 bg-red-500/20 border-red-500/30'
    }
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-red-500'
    if (percent >= 50) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 pb-16 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Rule Tracker</h1>
            </div>
            <p className="text-gray-400">Monitor your prop firm accounts and never breach drawdown limits</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        </div>

        {/* Quick Stats */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Total Accounts</p>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Total Capital</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatCurrency(accounts.reduce((sum, acc) => sum + acc.currentBalance, 0))}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">In Evaluation</p>
              <p className="text-2xl font-bold text-blue-400">
                {accounts.filter(a => a.status === 'evaluation').length}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm">Funded</p>
              <p className="text-2xl font-bold text-green-400">
                {accounts.filter(a => a.status === 'funded').length}
              </p>
            </div>
          </div>
        )}

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No accounts yet</h2>
            <p className="text-gray-400 mb-6">Add your first prop firm account to start tracking</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Your First Account
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {accounts.map((account) => {
              const status = getStatus(account)
              const dailyDDAmount = account.accountSize * (account.dailyDD / 100)
              const maxDDAmount = account.accountSize * (account.maxDD / 100)
              const profitTargetAmount = account.accountSize * (account.profitTarget / 100)
              
              const dailyUsed = Math.abs(Math.min(0, account.dailyPnL))
              const dailyRemaining = dailyDDAmount - dailyUsed
              const dailyPercent = (dailyUsed / dailyDDAmount) * 100
              
              const totalLoss = Math.max(0, account.startingBalance - account.currentBalance)
              const maxRemaining = maxDDAmount - totalLoss
              const maxPercent = (totalLoss / maxDDAmount) * 100
              
              const profitMade = account.currentBalance - account.startingBalance
              const profitRemaining = profitTargetAmount - profitMade
              const profitPercent = Math.max(0, (profitMade / profitTargetAmount) * 100)

              return (
                <div 
                  key={account.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden"
                >
                  {/* Account Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {account.propFirm.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{account.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              account.status === 'funded' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {account.status === 'funded' ? 'Funded' : `Phase ${account.phase}`}
                            </span>
                          </div>
                          <p className="text-gray-400">{account.propFirm} • {formatCurrency(account.accountSize)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingAccount(account)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAccount(account.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(status.level)}`}>
                      {status.level === 'safe' && <CheckCircle className="w-4 h-4" />}
                      {status.level === 'warning' && <AlertTriangle className="w-4 h-4" />}
                      {status.level === 'danger' && <AlertCircle className="w-4 h-4" />}
                      <span className="font-medium">{status.message}</span>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      
                      {/* Current Balance */}
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Current Balance</span>
                          <DollarSign className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-2xl font-bold text-white">{formatCurrency(account.currentBalance)}</p>
                        <p className={`text-sm mt-1 ${profitMade >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {profitMade >= 0 ? '+' : ''}{formatCurrency(profitMade)} from start
                        </p>
                      </div>

                      {/* Today's P&L */}
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Today's P&L</span>
                          <button 
                            onClick={() => resetDailyPnL(account.id)}
                            className="text-xs text-gray-500 hover:text-white"
                          >
                            Reset
                          </button>
                        </div>
                        <p className={`text-2xl font-bold ${account.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {account.dailyPnL >= 0 ? '+' : ''}{formatCurrency(account.dailyPnL)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Updated manually
                        </p>
                      </div>

                      {/* Distance to Target */}
                      <div className="bg-gray-700/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">To Profit Target</span>
                          <Target className="w-4 h-4 text-gray-500" />
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {profitRemaining > 0 ? formatCurrency(profitRemaining) : '✅ Reached!'}
                        </p>
                        <p className="text-sm text-emerald-400 mt-1">
                          {profitPercent.toFixed(0)}% complete
                        </p>
                      </div>
                    </div>

                    {/* Drawdown Bars */}
                    <div className="mt-6 space-y-4">
                      
                      {/* Daily Drawdown */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Daily Drawdown Used</span>
                          <span className="text-white text-sm">
                            {formatCurrency(dailyUsed)} / {formatCurrency(dailyDDAmount)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(dailyPercent)} transition-all duration-500`}
                            style={{ width: `${Math.min(100, dailyPercent)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">{dailyPercent.toFixed(0)}% used</span>
                          <span className="text-xs text-emerald-400">{formatCurrency(dailyRemaining)} remaining</span>
                        </div>
                      </div>

                      {/* Max Drawdown */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Max Drawdown Used</span>
                          <span className="text-white text-sm">
                            {formatCurrency(totalLoss)} / {formatCurrency(maxDDAmount)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(maxPercent)} transition-all duration-500`}
                            style={{ width: `${Math.min(100, maxPercent)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">{maxPercent.toFixed(0)}% used</span>
                          <span className="text-xs text-emerald-400">{formatCurrency(maxRemaining)} remaining</span>
                        </div>
                      </div>

                      {/* Profit Target Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Profit Target Progress</span>
                          <span className="text-white text-sm">
                            {formatCurrency(Math.max(0, profitMade))} / {formatCurrency(profitTargetAmount)}
                          </span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, profitPercent)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">{profitPercent.toFixed(0)}% achieved</span>
                          <span className="text-xs text-emerald-400">{formatCurrency(Math.max(0, profitRemaining))} to go</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Update */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <QuickUpdateForm 
                        account={account} 
                        onUpdate={(updates) => updateAccount(account.id, updates)} 
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">How to Use the Rule Tracker</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-emerald-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Add Your Accounts</h3>
              <p className="text-gray-400 text-sm">
                Enter your prop firm, account size, and rules. We'll calculate everything automatically.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-emerald-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Update Daily</h3>
              <p className="text-gray-400 text-sm">
                Enter your daily P&L and current balance. The tracker will show your remaining buffer.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <span className="text-emerald-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-white mb-2">Stay Safe</h3>
              <p className="text-gray-400 text-sm">
                Watch the status indicators. Stop trading when you see Warning or Danger.
              </p>
            </div>
          </div>
        </div>

        {/* Tools Link */}
        <div className="mt-8 text-center">
          <Link
            href="/tools/risk-calculator"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Need to calculate risk per trade? Try our Risk Calculator →
          </Link>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <AccountModal
          onClose={() => setShowAddModal(false)}
          onSave={addAccount}
        />
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <AccountModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSave={(updates) => updateAccount(editingAccount.id, updates)}
        />
      )}
    </div>
  )
}

// Quick Update Form Component
function QuickUpdateForm({ account, onUpdate }: { account: Account; onUpdate: (updates: Partial<Account>) => void }) {
  const [balance, setBalance] = useState(account.currentBalance.toString())
  const [dailyPnL, setDailyPnL] = useState(account.dailyPnL.toString())

  const handleSave = () => {
    onUpdate({
      currentBalance: parseFloat(balance) || account.currentBalance,
      dailyPnL: parseFloat(dailyPnL) || 0,
      highestBalance: Math.max(account.highestBalance, parseFloat(balance) || 0)
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-gray-400 text-xs mb-1">Current Balance</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="block text-gray-400 text-xs mb-1">Today's P&L</label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="number"
            value={dailyPnL}
            onChange={(e) => setDailyPnL(e.target.value)}
            placeholder="-500 or +300"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="flex items-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Update
        </button>
      </div>
    </div>
  )
}

// Account Modal Component
function AccountModal({ 
  account, 
  onClose, 
  onSave 
}: { 
  account?: Account
  onClose: () => void
  onSave: (data: any) => void 
}) {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    propFirm: account?.propFirm || 'FTMO',
    accountSize: account?.accountSize || 100000,
    dailyDD: account?.dailyDD || 5,
    maxDD: account?.maxDD || 10,
    profitTarget: account?.profitTarget || 10,
    currentBalance: account?.currentBalance || 100000,
    startingBalance: account?.startingBalance || 100000,
    status: account?.status || 'evaluation' as const,
    phase: account?.phase || 1,
    dailyPnL: account?.dailyPnL || 0,
    highestBalance: account?.highestBalance || 100000,
  })

  const handlePresetChange = (firmName: string) => {
    const preset = propFirmPresets.find(p => p.name === firmName)
    if (preset) {
      setFormData(prev => ({
        ...prev,
        propFirm: firmName,
        dailyDD: preset.dailyDD,
        maxDD: preset.maxDD,
        profitTarget: preset.profitTarget,
      }))
    }
  }

  const handleAccountSizeChange = (size: number) => {
    setFormData(prev => ({
      ...prev,
      accountSize: size,
      currentBalance: size,
      startingBalance: size,
      highestBalance: size,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {account ? 'Edit Account' : 'Add New Account'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Account Name */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Account Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., FTMO Challenge #1"
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Prop Firm */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Prop Firm</label>
            <select
              value={formData.propFirm}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
            >
              {propFirmPresets.map(firm => (
                <option key={firm.name} value={firm.name}>{firm.name}</option>
              ))}
            </select>
          </div>

          {/* Account Size */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Account Size</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {accountSizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleAccountSizeChange(size)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.accountSize === size
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ${size >= 1000 ? `${size / 1000}K` : size}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'evaluation' }))}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.status === 'evaluation'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Evaluation
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'funded' }))}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.status === 'funded'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Funded
              </button>
            </div>
          </div>

          {/* Phase (if evaluation) */}
          {formData.status === 'evaluation' && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Phase</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(phase => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, phase }))}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.phase === phase
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Phase {phase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rules (if custom) */}
          {formData.propFirm === 'Custom' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Daily DD %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.dailyDD}
                    onChange={(e) => setFormData(prev => ({ ...prev, dailyDD: parseFloat(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Max DD %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.maxDD}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDD: parseFloat(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-1">Target %</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.profitTarget}
                    onChange={(e) => setFormData(prev => ({ ...prev, profitTarget: parseFloat(e.target.value) }))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Rules Preview */}
          <div className="bg-gray-700/50 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Account Rules</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-emerald-400 font-bold">{formData.dailyDD}%</p>
                <p className="text-gray-500 text-xs">Daily DD</p>
              </div>
              <div>
                <p className="text-red-400 font-bold">{formData.maxDD}%</p>
                <p className="text-gray-500 text-xs">Max DD</p>
              </div>
              <div>
                <p className="text-green-400 font-bold">{formData.profitTarget}%</p>
                <p className="text-gray-500 text-xs">Target</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
          >
            {account ? 'Save Changes' : 'Add Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
