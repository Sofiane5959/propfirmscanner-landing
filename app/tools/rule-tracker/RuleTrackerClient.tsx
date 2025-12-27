'use client'

import { useState, useEffect } from 'react'
import { 
  ClipboardCheck, Plus, Trash2, AlertTriangle, CheckCircle, 
  XCircle, Calendar, TrendingDown, Target, Clock, Save,
  RotateCcw, Download
} from 'lucide-react'

interface TradingDay {
  date: string
  profit: number
  trades: number
  drawdownHit: boolean
  notes: string
}

interface RuleTrackerState {
  accountSize: number
  currentBalance: number
  profitTarget: number
  dailyDrawdown: number
  maxDrawdown: number
  minTradingDays: number
  tradingDays: TradingDay[]
}

const DEFAULT_STATE: RuleTrackerState = {
  accountSize: 100000,
  currentBalance: 100000,
  profitTarget: 10,
  dailyDrawdown: 5,
  maxDrawdown: 10,
  minTradingDays: 5,
  tradingDays: []
}

export default function RuleTrackerClient() {
  const [state, setState] = useState<RuleTrackerState>(DEFAULT_STATE)
  const [newDay, setNewDay] = useState<TradingDay>({
    date: new Date().toISOString().split('T')[0],
    profit: 0,
    trades: 0,
    drawdownHit: false,
    notes: ''
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ruleTrackerState')
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch {
        // Invalid data, use default
      }
    }
  }, [])

  // Save to localStorage
  const saveState = (newState: RuleTrackerState) => {
    setState(newState)
    localStorage.setItem('ruleTrackerState', JSON.stringify(newState))
  }

  // Calculations
  const totalProfit = state.tradingDays.reduce((sum, day) => sum + day.profit, 0)
  const currentEquity = state.accountSize + totalProfit
  const profitPercent = (totalProfit / state.accountSize) * 100
  const targetAmount = state.accountSize * (state.profitTarget / 100)
  const progressPercent = Math.min((totalProfit / targetAmount) * 100, 100)
  const maxDrawdownAmount = state.accountSize * (state.maxDrawdown / 100)
  const drawdownUsed = Math.max(0, state.accountSize - Math.min(currentEquity, state.accountSize))
  const drawdownPercent = (drawdownUsed / state.accountSize) * 100
  const tradingDaysCount = state.tradingDays.length
  const remainingDays = Math.max(0, state.minTradingDays - tradingDaysCount)

  // Status checks
  const isProfitTargetMet = profitPercent >= state.profitTarget
  const isMinDaysMet = tradingDaysCount >= state.minTradingDays
  const isDrawdownBreached = drawdownPercent >= state.maxDrawdown
  const hasDailyDrawdownBreach = state.tradingDays.some(d => d.drawdownHit)

  const addTradingDay = () => {
    if (!newDay.date) return
    
    const updatedDays = [...state.tradingDays, { ...newDay }]
    const newBalance = state.currentBalance + newDay.profit
    
    saveState({
      ...state,
      tradingDays: updatedDays,
      currentBalance: newBalance
    })
    
    setNewDay({
      date: new Date().toISOString().split('T')[0],
      profit: 0,
      trades: 0,
      drawdownHit: false,
      notes: ''
    })
  }

  const removeDay = (index: number) => {
    const updatedDays = state.tradingDays.filter((_, i) => i !== index)
    const newTotal = updatedDays.reduce((sum, day) => sum + day.profit, 0)
    
    saveState({
      ...state,
      tradingDays: updatedDays,
      currentBalance: state.accountSize + newTotal
    })
  }

  const resetTracker = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      saveState(DEFAULT_STATE)
    }
  }

  const exportData = () => {
    const data = JSON.stringify(state, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rule-tracker-export.json'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ClipboardCheck className="w-8 h-8 text-emerald-400" />
              Rule Tracker
            </h1>
            <p className="text-gray-400 mt-2">Track your prop firm challenge progress and stay within the rules</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={resetTracker}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Challenge Settings */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Challenge Settings</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Account Size</label>
              <input
                type="number"
                value={state.accountSize}
                onChange={(e) => saveState({ ...state, accountSize: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profit Target %</label>
              <input
                type="number"
                value={state.profitTarget}
                onChange={(e) => saveState({ ...state, profitTarget: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily DD %</label>
              <input
                type="number"
                value={state.dailyDrawdown}
                onChange={(e) => saveState({ ...state, dailyDrawdown: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max DD %</label>
              <input
                type="number"
                value={state.maxDrawdown}
                onChange={(e) => saveState({ ...state, maxDrawdown: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Min Trading Days</label>
              <input
                type="number"
                value={state.minTradingDays}
                onChange={(e) => saveState({ ...state, minTradingDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Current Balance</label>
              <div className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-emerald-400 font-mono">
                ${currentEquity.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Profit Target */}
          <div className={`p-4 rounded-xl border ${isProfitTargetMet ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Profit Target</span>
              {isProfitTargetMet ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Target className="w-5 h-5 text-gray-500" />}
            </div>
            <div className="text-2xl font-bold text-white">{profitPercent.toFixed(2)}%</div>
            <div className="text-sm text-gray-400">Target: {state.profitTarget}%</div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Max Drawdown */}
          <div className={`p-4 rounded-xl border ${isDrawdownBreached ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Max Drawdown</span>
              {isDrawdownBreached ? <XCircle className="w-5 h-5 text-red-400" /> : <TrendingDown className="w-5 h-5 text-gray-500" />}
            </div>
            <div className="text-2xl font-bold text-white">{drawdownPercent.toFixed(2)}%</div>
            <div className="text-sm text-gray-400">Limit: {state.maxDrawdown}%</div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${drawdownPercent > state.maxDrawdown * 0.7 ? 'bg-red-500' : 'bg-yellow-500'}`}
                style={{ width: `${Math.min((drawdownPercent / state.maxDrawdown) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Trading Days */}
          <div className={`p-4 rounded-xl border ${isMinDaysMet ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Trading Days</span>
              {isMinDaysMet ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Calendar className="w-5 h-5 text-gray-500" />}
            </div>
            <div className="text-2xl font-bold text-white">{tradingDaysCount}</div>
            <div className="text-sm text-gray-400">Min required: {state.minTradingDays}</div>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${Math.min((tradingDaysCount / state.minTradingDays) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Challenge Status */}
          <div className={`p-4 rounded-xl border ${
            isDrawdownBreached || hasDailyDrawdownBreach 
              ? 'bg-red-500/10 border-red-500/30' 
              : isProfitTargetMet && isMinDaysMet 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-gray-800/50 border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Challenge Status</span>
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-xl font-bold">
              {isDrawdownBreached || hasDailyDrawdownBreach ? (
                <span className="text-red-400">FAILED</span>
              ) : isProfitTargetMet && isMinDaysMet ? (
                <span className="text-emerald-400">PASSED ✓</span>
              ) : (
                <span className="text-yellow-400">IN PROGRESS</span>
              )}
            </div>
            <div className="text-sm text-gray-400">
              {remainingDays > 0 ? `${remainingDays} more days needed` : 'Min days met'}
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {(drawdownPercent > state.maxDrawdown * 0.7 || hasDailyDrawdownBreach) && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <div className="text-red-400 font-semibold">Warning!</div>
              <div className="text-gray-300 text-sm">
                {hasDailyDrawdownBreach 
                  ? 'You have hit the daily drawdown limit. This may result in challenge failure.'
                  : 'You are approaching the maximum drawdown limit. Trade carefully!'}
              </div>
            </div>
          </div>
        )}

        {/* Add Trading Day */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Add Trading Day
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={newDay.date}
                onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profit/Loss ($)</label>
              <input
                type="number"
                value={newDay.profit}
                onChange={(e) => setNewDay({ ...newDay, profit: Number(e.target.value) })}
                placeholder="e.g. 500 or -200"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Trades</label>
              <input
                type="number"
                value={newDay.trades}
                onChange={(e) => setNewDay({ ...newDay, trades: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Daily DD Hit?</label>
              <select
                value={newDay.drawdownHit ? 'yes' : 'no'}
                onChange={(e) => setNewDay({ ...newDay, drawdownHit: e.target.value === 'yes' })}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={addTradingDay}
                className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add Day
              </button>
            </div>
          </div>
        </div>

        {/* Trading History */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Trading History</h2>
          
          {state.tradingDays.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No trading days recorded yet.</p>
              <p className="text-sm">Add your first trading day above to start tracking.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">P&L</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Trades</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-medium">DD Hit</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Balance</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.tradingDays.map((day, index) => {
                    const runningBalance = state.accountSize + state.tradingDays.slice(0, index + 1).reduce((sum, d) => sum + d.profit, 0)
                    return (
                      <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 px-4 text-white">{day.date}</td>
                        <td className={`py-3 px-4 text-right font-mono ${day.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {day.profit >= 0 ? '+' : ''}{day.profit.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">{day.trades}</td>
                        <td className="py-3 px-4 text-center">
                          {day.drawdownHit ? (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">YES</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">NO</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300 font-mono">
                          ${runningBalance.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => removeDay(index)}
                            className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-700/30">
                    <td className="py-3 px-4 text-white font-semibold">Total</td>
                    <td className={`py-3 px-4 text-right font-mono font-semibold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {state.tradingDays.reduce((sum, d) => sum + d.trades, 0)}
                    </td>
                    <td></td>
                    <td className="py-3 px-4 text-right text-white font-mono font-semibold">
                      ${currentEquity.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
