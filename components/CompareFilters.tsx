'use client'

import { useState } from 'react'
import { 
  Filter, X, ChevronDown, ChevronUp, RotateCcw,
  DollarSign, Percent, TrendingDown, Clock, Globe,
  Bot, Newspaper, Calendar, Check
} from 'lucide-react'

// Types
export interface CompareFilters {
  markets: string[]
  priceRange: [number, number]
  profitSplit: number | null
  maxDrawdown: number | null
  drawdownType: string | null
  platforms: string[]
  newsTrading: boolean | null
  weekendHolding: boolean | null
  eaAllowed: boolean | null
  minTradingDays: number | null
  rating: number | null
}

export const DEFAULT_FILTERS: CompareFilters = {
  markets: [],
  priceRange: [0, 2000],
  profitSplit: null,
  maxDrawdown: null,
  drawdownType: null,
  platforms: [],
  newsTrading: null,
  weekendHolding: null,
  eaAllowed: null,
  minTradingDays: null,
  rating: null,
}

// Options
const MARKET_OPTIONS = ['Forex', 'Futures', 'Crypto', 'Indices', 'Stocks']
const PLATFORM_OPTIONS = ['MT4', 'MT5', 'cTrader', 'DXTrade', 'TradeLocker', 'MatchTrader']
const DRAWDOWN_TYPE_OPTIONS = ['Static', 'Trailing', 'EOD Trailing']
const PROFIT_SPLIT_OPTIONS = [70, 75, 80, 85, 90]
const RATING_OPTIONS = [3.5, 4.0, 4.5]
const MIN_DAYS_OPTIONS = [0, 3, 5, 10]

interface CompareFiltersProps {
  filters: CompareFilters
  onChange: (filters: CompareFilters) => void
  resultCount: number
}

export function CompareFiltersPanel({ filters, onChange, resultCount }: CompareFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['markets', 'price'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateFilter = <K extends keyof CompareFilters>(key: K, value: CompareFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: 'markets' | 'platforms', value: string) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    updateFilter(key, updated)
  }

  const resetFilters = () => {
    onChange(DEFAULT_FILTERS)
  }

  const activeFilterCount = 
    filters.markets.length +
    filters.platforms.length +
    (filters.profitSplit ? 1 : 0) +
    (filters.maxDrawdown ? 1 : 0) +
    (filters.drawdownType ? 1 : 0) +
    (filters.newsTrading !== null ? 1 : 0) +
    (filters.weekendHolding !== null ? 1 : 0) +
    (filters.eaAllowed !== null ? 1 : 0) +
    (filters.minTradingDays ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000 ? 1 : 0)

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Filters Panel */}
      <div className={`
        ${isOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:block'}
        w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto
        lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:rounded-xl lg:border
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-white">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-2 text-gray-400 hover:text-white"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Markets */}
          <FilterSection
            title="Markets"
            icon={Globe}
            isExpanded={expandedSections.includes('markets')}
            onToggle={() => toggleSection('markets')}
          >
            <div className="flex flex-wrap gap-2">
              {MARKET_OPTIONS.map(market => (
                <button
                  key={market}
                  onClick={() => toggleArrayFilter('markets', market)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.markets.includes(market)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            title="Price Range"
            icon={DollarSign}
            isExpanded={expandedSections.includes('price')}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                    placeholder="0"
                  />
                </div>
                <span className="text-gray-500 mt-5">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                    placeholder="2000"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="w-full accent-emerald-500"
              />
            </div>
          </FilterSection>

          {/* Profit Split */}
          <FilterSection
            title="Min Profit Split"
            icon={Percent}
            isExpanded={expandedSections.includes('split')}
            onToggle={() => toggleSection('split')}
          >
            <div className="flex flex-wrap gap-2">
              {PROFIT_SPLIT_OPTIONS.map(split => (
                <button
                  key={split}
                  onClick={() => updateFilter('profitSplit', filters.profitSplit === split ? null : split)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.profitSplit === split
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {split}%+
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Drawdown */}
          <FilterSection
            title="Max Drawdown"
            icon={TrendingDown}
            isExpanded={expandedSections.includes('drawdown')}
            onToggle={() => toggleSection('drawdown')}
          >
            <div className="space-y-3">
              <select
                value={filters.drawdownType || ''}
                onChange={(e) => updateFilter('drawdownType', e.target.value || null)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="">Any type</option>
                {DRAWDOWN_TYPE_OPTIONS.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </FilterSection>

          {/* Platforms */}
          <FilterSection
            title="Platforms"
            icon={Globe}
            isExpanded={expandedSections.includes('platforms')}
            onToggle={() => toggleSection('platforms')}
          >
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(platform => (
                <button
                  key={platform}
                  onClick={() => toggleArrayFilter('platforms', platform)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.platforms.includes(platform)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Rules */}
          <FilterSection
            title="Rules"
            icon={Check}
            isExpanded={expandedSections.includes('rules')}
            onToggle={() => toggleSection('rules')}
          >
            <div className="space-y-3">
              <TriStateToggle
                label="News Trading"
                icon={Newspaper}
                value={filters.newsTrading}
                onChange={(v) => updateFilter('newsTrading', v)}
              />
              <TriStateToggle
                label="Weekend Holding"
                icon={Calendar}
                value={filters.weekendHolding}
                onChange={(v) => updateFilter('weekendHolding', v)}
              />
              <TriStateToggle
                label="EA/Bots Allowed"
                icon={Bot}
                value={filters.eaAllowed}
                onChange={(v) => updateFilter('eaAllowed', v)}
              />
            </div>
          </FilterSection>

          {/* Min Trading Days */}
          <FilterSection
            title="Min Trading Days"
            icon={Clock}
            isExpanded={expandedSections.includes('days')}
            onToggle={() => toggleSection('days')}
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('minTradingDays', null)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.minTradingDays === null
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Any
              </button>
              {MIN_DAYS_OPTIONS.map(days => (
                <button
                  key={days}
                  onClick={() => updateFilter('minTradingDays', days)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.minTradingDays === days
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {days === 0 ? 'None' : `≤${days}`}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Rating */}
          <FilterSection
            title="Min Rating"
            icon={Check}
            isExpanded={expandedSections.includes('rating')}
            onToggle={() => toggleSection('rating')}
          >
            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFilter('rating', filters.rating === rating ? null : rating)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filters.rating === rating
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {rating}+ ★
                </button>
              ))}
            </div>
          </FilterSection>
        </div>

        {/* Results count (mobile) */}
        <div className="lg:hidden sticky bottom-0 p-4 bg-gray-800 border-t border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg"
          >
            Show {resultCount} Results
          </button>
        </div>
      </div>
    </>
  )
}

// Filter Section Component
interface FilterSectionProps {
  title: string
  icon: typeof Filter
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, icon: Icon, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-800/50 hover:bg-gray-700/50"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-white text-sm font-medium">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 bg-gray-900/30">
          {children}
        </div>
      )}
    </div>
  )
}

// Tri-State Toggle Component
interface TriStateToggleProps {
  label: string
  icon: typeof Newspaper
  value: boolean | null
  onChange: (value: boolean | null) => void
}

function TriStateToggle({ label, icon: Icon, value, onChange }: TriStateToggleProps) {
  const cycle = () => {
    if (value === null) onChange(true)
    else if (value === true) onChange(false)
    else onChange(null)
  }

  return (
    <button
      onClick={cycle}
      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        value === true
          ? 'bg-emerald-500/20 text-emerald-400'
          : value === false
            ? 'bg-red-500/20 text-red-400'
            : 'bg-gray-700 text-gray-400'
      }`}>
        {value === true ? 'Yes' : value === false ? 'No' : 'Any'}
      </span>
    </button>
  )
}
