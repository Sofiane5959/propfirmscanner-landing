'use client'

import { useState, useEffect } from 'react'
import { 
  Calculator, Copy, RotateCcw, Check, TrendingDown,
  DollarSign, Percent, Target, AlertTriangle, Info,
  ChevronDown, Save
} from 'lucide-react'

// Preset configurations for common scenarios
const PRESETS = [
  {
    name: 'Conservative (1%)',
    accountSize: 100000,
    riskPercent: 1,
    stopLoss: 50,
  },
  {
    name: 'Moderate (2%)',
    accountSize: 100000,
    riskPercent: 2,
    stopLoss: 30,
  },
  {
    name: 'FTMO $100K',
    accountSize: 100000,
    riskPercent: 1,
    stopLoss: 25,
  },
  {
    name: 'FundedNext $50K',
    accountSize: 50000,
    riskPercent: 1.5,
    stopLoss: 40,
  },
]

// Common pairs and their pip values
const PAIRS = [
  { name: 'EUR/USD', pipValue: 10, category: 'Major' },
  { name: 'GBP/USD', pipValue: 10, category: 'Major' },
  { name: 'USD/JPY', pipValue: 6.67, category: 'Major' },
  { name: 'USD/CHF', pipValue: 10.75, category: 'Major' },
  { name: 'AUD/USD', pipValue: 10, category: 'Major' },
  { name: 'NZD/USD', pipValue: 10, category: 'Major' },
  { name: 'USD/CAD', pipValue: 7.24, category: 'Major' },
  { name: 'EUR/GBP', pipValue: 12.65, category: 'Cross' },
  { name: 'EUR/JPY', pipValue: 6.67, category: 'Cross' },
  { name: 'GBP/JPY', pipValue: 6.67, category: 'Cross' },
  { name: 'XAU/USD (Gold)', pipValue: 10, category: 'Metal' },
  { name: 'Custom', pipValue: 10, category: 'Custom' },
]

interface CalculatorState {
  accountSize: number
  riskPercent: number
  stopLoss: number
  selectedPair: string
  pipValue: number
}

const DEFAULT_STATE: CalculatorState = {
  accountSize: 100000,
  riskPercent: 1,
  stopLoss: 30,
  selectedPair: 'EUR/USD',
  pipValue: 10,
}

export default function RiskCalculatorClient() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE)
  const [copied, setCopied] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [savedConfigs, setSavedConfigs] = useState<CalculatorState[]>([])

  // Load saved configs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('riskCalculatorConfigs')
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved))
      } catch {
        // Invalid data
      }
    }
  }, [])

  // Calculations
  const riskAmount = (state.accountSize * state.riskPercent) / 100
  const lotSize = riskAmount / (state.stopLoss * state.pipValue)
  const roundedLotSize = Math.floor(lotSize * 100) / 100 // Round down to 2 decimals

  // Max recommended stop loss based on daily drawdown (assuming 5%)
  const dailyDrawdownPercent = 5
  const maxDailyLoss = (state.accountSize * dailyDrawdownPercent) / 100
  const tradesBeforeDD = Math.floor(maxDailyLoss / riskAmount)

  const handlePairChange = (pairName: string) => {
    const pair = PAIRS.find(p => p.name === pairName)
    if (pair) {
      setState(prev => ({
        ...prev,
        selectedPair: pairName,
        pipValue: pair.pipValue,
      }))
    }
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setState(prev => ({
      ...prev,
      accountSize: preset.accountSize,
      riskPercent: preset.riskPercent,
      stopLoss: preset.stopLoss,
    }))
    setShowPresets(false)
  }

  const resetCalculator = () => {
    setState(DEFAULT_STATE)
  }

  const copyResult = () => {
    const text = `Account: $${state.accountSize.toLocaleString()} | Risk: ${state.riskPercent}% ($${riskAmount.toFixed(2)}) | SL: ${state.stopLoss} pips | Lot Size: ${roundedLotSize.toFixed(2)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveConfig = () => {
    const newConfigs = [...savedConfigs, state].slice(-5) // Keep last 5
    setSavedConfigs(newConfigs)
    localStorage.setItem('riskCalculatorConfigs', JSON.stringify(newConfigs))
  }

  return (
    <div className="min-h-screen bg-bg-elevated py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Risk Calculator</h1>
          <p className="text-text-secondary">Calculate your position size to manage risk properly</p>
        </div>

        {/* Presets & Actions */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="px-4 py-2 bg-dark-700 border border-border rounded-lg text-white hover:bg-dark-600 flex items-center gap-2"
            >
              Quick Presets
              <ChevronDown className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
            </button>
            
            {showPresets && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-dark-700 border border-border rounded-lg shadow-xl z-10">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(preset)}
                    className="w-full px-4 py-2 text-left text-text-secondary hover:bg-dark-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={resetCalculator}
            className="px-4 py-2 bg-dark-700 border border-border rounded-lg text-white hover:bg-dark-600 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          
          <button
            onClick={saveConfig}
            className="px-4 py-2 bg-dark-700 border border-border rounded-lg text-white hover:bg-dark-600 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={copyResult}
            className="px-4 py-2 bg-accent-hover hover:brightness-110 rounded-lg text-white flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-dark-700/50 border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            
            {/* Account Size */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-text-secondary mb-2">
                <DollarSign className="w-4 h-4 text-accent" />
                Account Size
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  value={state.accountSize}
                  onChange={(e) => setState(prev => ({ ...prev, accountSize: Number(e.target.value) }))}
                  className="w-full pl-8 pr-4 py-3 bg-bg-elevated border border-border rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000, 200000].map(size => (
                  <button
                    key={size}
                    onClick={() => setState(prev => ({ ...prev, accountSize: size }))}
                    className={`px-2 py-1 text-xs rounded ${state.accountSize === size ? 'bg-accent-hover text-white' : 'bg-dark-600 text-text-secondary hover:bg-dark-500'}`}
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Percent */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-text-secondary mb-2">
                <Percent className="w-4 h-4 text-accent" />
                Risk Per Trade (%)
              </label>
              <input
                type="number"
                value={state.riskPercent}
                onChange={(e) => setState(prev => ({ ...prev, riskPercent: Number(e.target.value) }))}
                step="0.5"
                min="0.1"
                max="10"
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-white focus:outline-none focus:border-accent"
              />
              <input
                type="range"
                value={state.riskPercent}
                onChange={(e) => setState(prev => ({ ...prev, riskPercent: Number(e.target.value) }))}
                min="0.5"
                max="5"
                step="0.5"
                className="w-full mt-2 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>0.5% (Safe)</span>
                <span>2% (Standard)</span>
                <span>5% (Aggressive)</span>
              </div>
            </div>

            {/* Stop Loss */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-text-secondary mb-2">
                <TrendingDown className="w-4 h-4 text-accent" />
                Stop Loss (pips)
              </label>
              <input
                type="number"
                value={state.stopLoss}
                onChange={(e) => setState(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-white focus:outline-none focus:border-accent"
              />
              <div className="flex gap-2 mt-2">
                {[15, 25, 30, 50, 100].map(sl => (
                  <button
                    key={sl}
                    onClick={() => setState(prev => ({ ...prev, stopLoss: sl }))}
                    className={`px-3 py-1 text-xs rounded ${state.stopLoss === sl ? 'bg-accent-hover text-white' : 'bg-dark-600 text-text-secondary hover:bg-dark-500'}`}
                  >
                    {sl}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Pair */}
            <div className="mb-5">
              <label className="flex items-center gap-2 text-text-secondary mb-2">
                <Target className="w-4 h-4 text-accent" />
                Currency Pair
              </label>
              <select
                value={state.selectedPair}
                onChange={(e) => handlePairChange(e.target.value)}
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-white focus:outline-none focus:border-accent"
              >
                {PAIRS.map(pair => (
                  <option key={pair.name} value={pair.name}>
                    {pair.name} (${pair.pipValue}/pip)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Pip Value */}
            {state.selectedPair === 'Custom' && (
              <div className="mb-5">
                <label className="text-text-secondary mb-2 block">Custom Pip Value ($)</label>
                <input
                  type="number"
                  value={state.pipValue}
                  onChange={(e) => setState(prev => ({ ...prev, pipValue: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-white focus:outline-none focus:border-accent"
                />
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-accent/10 to-blue-500/10 border border-accent/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Position Size</h2>
              
              <div className="text-center py-6">
                <div className="text-5xl font-bold text-accent mb-2">
                  {roundedLotSize.toFixed(2)}
                </div>
                <div className="text-text-secondary">Standard Lots</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-bg-elevated/50 rounded-lg p-4 text-center">
                  <div className="text-text-secondary text-sm mb-1">Risk Amount</div>
                  <div className="text-xl font-semibold text-white">${riskAmount.toFixed(2)}</div>
                </div>
                <div className="bg-bg-elevated/50 rounded-lg p-4 text-center">
                  <div className="text-text-secondary text-sm mb-1">Mini Lots</div>
                  <div className="text-xl font-semibold text-white">{(roundedLotSize * 10).toFixed(1)}</div>
                </div>
              </div>
            </div>

            {/* Risk Warning */}
            {state.riskPercent > 2 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-yellow-400 font-medium">High Risk Warning</div>
                  <div className="text-text-secondary text-sm">
                    Risking more than 2% per trade is aggressive. Consider reducing your risk.
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-dark-700/50 border border-border rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                Risk Analysis
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Max daily loss (5% DD):</span>
                  <span className="text-white">${maxDailyLoss.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Trades before daily DD:</span>
                  <span className="text-white">{tradesBeforeDD} losing trades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Risk:Reward needed for BE:</span>
                  <span className="text-white">1:1</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-text-muted">
                  💡 Tip: With {state.riskPercent}% risk, you need a {Math.ceil(100 / (state.riskPercent * 2))}% win rate with 1:1 RR to break even.
                </div>
              </div>
            </div>

            {/* Saved Configs */}
            {savedConfigs.length > 0 && (
              <div className="bg-dark-700/50 border border-border rounded-xl p-4">
                <h3 className="text-white font-medium mb-3">Saved Configurations</h3>
                <div className="space-y-2">
                  {savedConfigs.map((config, i) => (
                    <button
                      key={i}
                      onClick={() => setState(config)}
                      className="w-full text-left px-3 py-2 bg-bg-elevated/50 rounded-lg text-sm text-text-secondary hover:bg-dark-600"
                    >
                      ${config.accountSize.toLocaleString()} | {config.riskPercent}% | {config.stopLoss} pips
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="mt-8 bg-dark-700/50 border border-border rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">📐 Formula Used</h3>
          <div className="bg-bg-elevated rounded-lg p-4 font-mono text-sm text-text-secondary">
            Lot Size = (Account Size × Risk %) ÷ (Stop Loss × Pip Value)
          </div>
          <div className="mt-4 text-text-secondary text-sm">
            <strong>Your calculation:</strong> (${state.accountSize.toLocaleString()} × {state.riskPercent}%) ÷ ({state.stopLoss} pips × ${state.pipValue}) = <span className="text-accent font-semibold">{roundedLotSize.toFixed(2)} lots</span>
          </div>
        </div>
      </div>
    </div>
  )
}
