'use client'

import { useState } from 'react'
import type { FilterOptions } from '@/types'

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void
  filters: FilterOptions
}

export function FilterSidebar({ onFilterChange, filters }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handleChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setLocalFilters({})
    onFilterChange({})
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-emerald-500 hover:text-emerald-400"
        >
          Clear all
        </button>
      </div>

      {/* Budget Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          💰 Max Budget
        </label>
        <select
          value={localFilters.maxPrice || ''}
          onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Any budget</option>
          <option value="100">Under $100</option>
          <option value="200">Under $200</option>
          <option value="300">Under $300</option>
          <option value="500">Under $500</option>
          <option value="1000">Under $1,000</option>
        </select>
      </div>

      {/* Challenge Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          🎯 Challenge Type
        </label>
        <div className="space-y-2">
          {['1-step', '2-step', '3-step', 'instant'].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="challengeType"
                checked={localFilters.challengeType === type}
                onChange={() => handleChange('challengeType', type)}
                className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-500"
              />
              <span className="text-gray-300 group-hover:text-white capitalize">
                {type === 'instant' ? 'Instant Funding' : `${type.charAt(0).toUpperCase()}${type.slice(1)} Challenge`}
              </span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="challengeType"
              checked={!localFilters.challengeType}
              onChange={() => handleChange('challengeType', undefined)}
              className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-500"
            />
            <span className="text-gray-300 group-hover:text-white">Any type</span>
          </label>
        </div>
      </div>

      {/* Trading Style */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          📈 Trading Style
        </label>
        <div className="space-y-2">
          {[
            { value: 'scalping', label: 'Scalping' },
            { value: 'swing', label: 'Swing Trading' },
            { value: 'news', label: 'News Trading' },
            { value: 'ea', label: 'EA / Bots' },
          ].map((style) => (
            <label key={style.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="tradingStyle"
                checked={localFilters.tradingStyle === style.value}
                onChange={() => handleChange('tradingStyle', style.value)}
                className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-500"
              />
              <span className="text-gray-300 group-hover:text-white">{style.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="tradingStyle"
              checked={!localFilters.tradingStyle}
              onChange={() => handleChange('tradingStyle', undefined)}
              className="w-4 h-4 text-emerald-500 bg-gray-700 border-gray-600 focus:ring-emerald-500"
            />
            <span className="text-gray-300 group-hover:text-white">Any style</span>
          </label>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          💻 Platform
        </label>
        <select
          value={localFilters.platform || ''}
          onChange={(e) => handleChange('platform', e.target.value || undefined)}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Any platform</option>
          <option value="MT4">MetaTrader 4</option>
          <option value="MT5">MetaTrader 5</option>
          <option value="cTrader">cTrader</option>
          <option value="TradingView">TradingView</option>
          <option value="DXtrade">DXtrade</option>
        </select>
      </div>

      {/* Minimum Profit Split */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          💵 Min Profit Split
        </label>
        <select
          value={localFilters.minProfitSplit || ''}
          onChange={(e) => handleChange('minProfitSplit', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Any split</option>
          <option value="70">70% or higher</option>
          <option value="80">80% or higher</option>
          <option value="85">85% or higher</option>
          <option value="90">90% or higher</option>
        </select>
      </div>

      {/* Active Filters Summary */}
      {Object.values(localFilters).some(v => v) && (
        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {localFilters.maxPrice && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                Under ${localFilters.maxPrice}
              </span>
            )}
            {localFilters.challengeType && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                {localFilters.challengeType}
              </span>
            )}
            {localFilters.tradingStyle && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                {localFilters.tradingStyle}
              </span>
            )}
            {localFilters.platform && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                {localFilters.platform}
              </span>
            )}
            {localFilters.minProfitSplit && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                {localFilters.minProfitSplit}%+ split
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
