'use client'

import { FilterState } from '@/types'
import { RotateCcw } from 'lucide-react'

interface FilterSidebarProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onReset: () => void
}

export function FilterSidebar({ filters, setFilters, onReset }: FilterSidebarProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'challengeTypes' | 'tradingStyles' | 'platforms', value: string) => {
    const current = filters[key]
    if (current.includes(value)) {
      updateFilter(key, current.filter((v) => v !== value))
    } else {
      updateFilter(key, [...current, value])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-dark-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">💰 Budget</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">${filters.priceRange[0]}</span>
            <span className="text-dark-400">${filters.priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1500"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-brand-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0] || ''}
              onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
              className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-brand-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1] || ''}
              onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1500])}
              className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Challenge Type */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">📊 Challenge Type</h4>
        <div className="space-y-2">
          {[
            { value: '1-step', label: '1-Step Challenge' },
            { value: '2-step', label: '2-Step Challenge' },
            { value: 'instant-funding', label: 'Instant Funding' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.challengeTypes.includes(option.value)}
                onChange={() => toggleArrayFilter('challengeTypes', option.value)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
              />
              <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Trading Style */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">🎯 Trading Style</h4>
        <div className="space-y-2">
          {[
            { value: 'scalping', label: 'Scalping Allowed' },
            { value: 'news', label: 'News Trading Allowed' },
            { value: 'swing', label: 'Weekend Holding' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.tradingStyles.includes(option.value)}
                onChange={() => toggleArrayFilter('tradingStyles', option.value)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500 focus:ring-offset-0"
              />
              <span className="text-sm text-dark-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">💻 Platforms</h4>
        <div className="flex flex-wrap gap-2">
          {['MT4', 'MT5', 'cTrader', 'TradingView', 'NinjaTrader'].map((platform) => (
            <button
              key={platform}
              onClick={() => toggleArrayFilter('platforms', platform)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filters.platforms.includes(platform)
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'bg-white/5 text-dark-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Profit Split */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">💵 Min Profit Split</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minProfitSplit}
            onChange={(e) => updateFilter('minProfitSplit', parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="text-center text-sm text-brand-400 font-medium">
            {filters.minProfitSplit}%+
          </div>
        </div>
      </div>

      {/* Max Drawdown */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-medium text-white mb-3">📉 Max Drawdown Limit</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="4"
            max="15"
            step="1"
            value={filters.maxDrawdown}
            onChange={(e) => updateFilter('maxDrawdown', parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="text-center text-sm text-brand-400 font-medium">
            Up to {filters.maxDrawdown}%
          </div>
        </div>
      </div>
    </div>
  )
}
