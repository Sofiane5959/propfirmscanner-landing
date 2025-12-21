'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { PropFirmCard } from '@/components/compare/PropFirmCard'
import { getPropFirms } from '@/lib/supabase-queries'
import type { PropFirm } from '@/types'
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

export default function ComparePage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [filteredFirms, setFilteredFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Filter states - multi-select
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [minProfitSplit, setMinProfitSplit] = useState<number | null>(null)
  const [tradingStyles, setTradingStyles] = useState<string[]>([])
  
  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState({
    platforms: true,
    markets: true,
    challengeTypes: true,
    price: true,
    profitSplit: true,
    tradingStyle: true,
  })

  // Available filter options
  const platformOptions = ['MT4', 'MT5', 'cTrader', 'DXtrade', 'TradeLocker', 'Match-Trader', 'NinjaTrader']
  const marketOptions = ['Forex', 'Indices', 'Metals', 'Crypto', 'Stocks', 'Futures', 'Energy']
  const challengeTypeOptions = ['1-step', '2-step', '3-step', 'instant']
  const priceOptions = [
    { label: 'Under $50', value: 50 },
    { label: 'Under $100', value: 100 },
    { label: 'Under $200', value: 200 },
    { label: 'Under $500', value: 500 },
    { label: 'Under $1,000', value: 1000 },
  ]
  const profitSplitOptions = [
    { label: '70%+', value: 70 },
    { label: '80%+', value: 80 },
    { label: '85%+', value: 85 },
    { label: '90%+', value: 90 },
  ]
  const tradingStyleOptions = [
    { id: 'scalping', label: 'Scalping', field: 'allows_scalping' },
    { id: 'news', label: 'News Trading', field: 'allows_news_trading' },
    { id: 'ea', label: 'EA / Bots', field: 'allows_ea' },
    { id: 'weekend', label: 'Weekend Holding', field: 'allows_weekend_holding' },
    { id: 'hedging', label: 'Hedging', field: 'allows_hedging' },
  ]

  // Fetch prop firms on load
  useEffect(() => {
    async function fetchFirms() {
      setLoading(true)
      const data = await getPropFirms()
      setFirms(data)
      setFilteredFirms(data)
      setLoading(false)
    }
    fetchFirms()
  }, [])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...firms]

    // Search filter
    if (searchQuery) {
      result = result.filter(firm => 
        firm.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Platform filter (multi-select)
    if (selectedPlatforms.length > 0) {
      result = result.filter(firm => 
        firm.platforms?.some(p => selectedPlatforms.includes(p))
      )
    }

    // Market filter (multi-select) - uses instruments field in database
    if (selectedMarkets.length > 0) {
      result = result.filter(firm => 
        firm.instruments?.some(i => selectedMarkets.includes(i))
      )
    }

    // Challenge type filter (multi-select)
    if (selectedChallengeTypes.length > 0) {
      result = result.filter(firm => 
        firm.challenge_types?.some(c => selectedChallengeTypes.includes(c))
      )
    }

    // Max price filter
    if (maxPrice) {
      result = result.filter(firm => (firm.min_price || 0) <= maxPrice)
    }

    // Min profit split filter
    if (minProfitSplit) {
      result = result.filter(firm => (firm.profit_split || 0) >= minProfitSplit)
    }

    // Trading style filters
    if (tradingStyles.includes('scalping')) {
      result = result.filter(firm => firm.allows_scalping)
    }
    if (tradingStyles.includes('news')) {
      result = result.filter(firm => firm.allows_news_trading)
    }
    if (tradingStyles.includes('ea')) {
      result = result.filter(firm => firm.allows_ea)
    }
    if (tradingStyles.includes('weekend')) {
      result = result.filter(firm => firm.allows_weekend_holding)
    }
    if (tradingStyles.includes('hedging')) {
      result = result.filter(firm => firm.allows_hedging)
    }

    setFilteredFirms(result)
  }, [firms, searchQuery, selectedPlatforms, selectedMarkets, selectedChallengeTypes, maxPrice, minProfitSplit, tradingStyles])

  // Sort firms
  const sortedFirms = [...filteredFirms].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
      case 'price-low':
        return (a.min_price || 0) - (b.min_price || 0)
      case 'price-high':
        return (b.min_price || 0) - (a.min_price || 0)
      case 'profit-split':
        return (b.profit_split || 0) - (a.profit_split || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Toggle multi-select
  const toggleArrayFilter = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value))
    } else {
      setArray([...array, value])
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedPlatforms([])
    setSelectedMarkets([])
    setSelectedChallengeTypes([])
    setMaxPrice(null)
    setMinProfitSplit(null)
    setTradingStyles([])
  }

  // Count active filters
  const activeFilterCount = 
    selectedPlatforms.length + 
    selectedMarkets.length + 
    selectedChallengeTypes.length + 
    (maxPrice ? 1 : 0) + 
    (minProfitSplit ? 1 : 0) + 
    tradingStyles.length

  // Toggle section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Filter Section Component
  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string
    sectionKey: keyof typeof expandedSections
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-700 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  )

  // Checkbox Component
  const Checkbox = ({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean
    onChange: () => void
    label: string 
  }) => (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
      />
      <span className="text-sm text-gray-300 group-hover:text-white">{label}</span>
    </label>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Compare Prop Firms
                </h1>
                <p className="text-gray-400">
                  Find the perfect prop firm for your trading style. Compare {firms.length} verified firms.
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prop firms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-emerald-500 hover:text-emerald-400"
                    >
                      Clear ({activeFilterCount})
                    </button>
                  )}
                </div>

                {/* Platforms */}
                <FilterSection title="💻 Platforms" sectionKey="platforms">
                  {platformOptions.map(platform => (
                    <Checkbox
                      key={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => toggleArrayFilter(selectedPlatforms, setSelectedPlatforms, platform)}
                      label={platform}
                    />
                  ))}
                </FilterSection>

                {/* Markets (formerly Instruments) */}
                <FilterSection title="📈 Markets" sectionKey="markets">
                  {marketOptions.map(market => (
                    <Checkbox
                      key={market}
                      checked={selectedMarkets.includes(market)}
                      onChange={() => toggleArrayFilter(selectedMarkets, setSelectedMarkets, market)}
                      label={market}
                    />
                  ))}
                </FilterSection>

                {/* Challenge Type */}
                <FilterSection title="🎯 Challenge Type" sectionKey="challengeTypes">
                  {challengeTypeOptions.map(type => (
                    <Checkbox
                      key={type}
                      checked={selectedChallengeTypes.includes(type)}
                      onChange={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, type)}
                      label={type === 'instant' ? 'Instant Funding' : `${type.charAt(0).toUpperCase()}${type.slice(1)} Challenge`}
                    />
                  ))}
                </FilterSection>

                {/* Max Price */}
                <FilterSection title="💰 Max Budget" sectionKey="price">
                  {priceOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="maxPrice"
                        checked={maxPrice === option.value}
                        onChange={() => setMaxPrice(option.value)}
                        className="w-4 h-4 border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white">{option.label}</span>
                    </label>
                  ))}
                  {maxPrice && (
                    <button
                      onClick={() => setMaxPrice(null)}
                      className="text-xs text-gray-500 hover:text-gray-300 mt-2"
                    >
                      Clear price filter
                    </button>
                  )}
                </FilterSection>

                {/* Profit Split */}
                <FilterSection title="💵 Min Profit Split" sectionKey="profitSplit">
                  {profitSplitOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="profitSplit"
                        checked={minProfitSplit === option.value}
                        onChange={() => setMinProfitSplit(option.value)}
                        className="w-4 h-4 border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white">{option.label}</span>
                    </label>
                  ))}
                  {minProfitSplit && (
                    <button
                      onClick={() => setMinProfitSplit(null)}
                      className="text-xs text-gray-500 hover:text-gray-300 mt-2"
                    >
                      Clear split filter
                    </button>
                  )}
                </FilterSection>

                {/* Trading Style */}
                <FilterSection title="🔧 Trading Style" sectionKey="tradingStyle">
                  {tradingStyleOptions.map(style => (
                    <Checkbox
                      key={style.id}
                      checked={tradingStyles.includes(style.id)}
                      onChange={() => toggleArrayFilter(tradingStyles, setTradingStyles, style.id)}
                      label={style.label}
                    />
                  ))}
                </FilterSection>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full py-3 px-4 bg-gray-800 rounded-xl text-white flex items-center justify-center gap-2 border border-gray-700"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-500 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 p-5 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)}>
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                  
                  {/* Mobile Platforms */}
                  <FilterSection title="💻 Platforms" sectionKey="platforms">
                    {platformOptions.map(platform => (
                      <Checkbox
                        key={platform}
                        checked={selectedPlatforms.includes(platform)}
                        onChange={() => toggleArrayFilter(selectedPlatforms, setSelectedPlatforms, platform)}
                        label={platform}
                      />
                    ))}
                  </FilterSection>

                  {/* Mobile Markets */}
                  <FilterSection title="📈 Markets" sectionKey="markets">
                    {marketOptions.map(market => (
                      <Checkbox
                        key={market}
                        checked={selectedMarkets.includes(market)}
                        onChange={() => toggleArrayFilter(selectedMarkets, setSelectedMarkets, market)}
                        label={market}
                      />
                    ))}
                  </FilterSection>

                  {/* Mobile Challenge Types */}
                  <FilterSection title="🎯 Challenge Type" sectionKey="challengeTypes">
                    {challengeTypeOptions.map(type => (
                      <Checkbox
                        key={type}
                        checked={selectedChallengeTypes.includes(type)}
                        onChange={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, type)}
                        label={type === 'instant' ? 'Instant Funding' : `${type} Challenge`}
                      />
                    ))}
                  </FilterSection>

                  {/* Mobile Trading Style */}
                  <FilterSection title="🔧 Trading Style" sectionKey="tradingStyle">
                    {tradingStyleOptions.map(style => (
                      <Checkbox
                        key={style.id}
                        checked={tradingStyles.includes(style.id)}
                        onChange={() => toggleArrayFilter(tradingStyles, setTradingStyles, style.id)}
                        label={style.label}
                      />
                    ))}
                  </FilterSection>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-xl font-medium"
                  >
                    Show {sortedFirms.length} Results
                  </button>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort & View Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <p className="text-gray-400">
                  {loading ? 'Loading...' : `${sortedFirms.length} prop firms found`}
                </p>
                
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-emerald-500 focus:outline-none text-sm"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="profit-split">Profit Split</option>
                    <option value="name">Name A-Z</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters Tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPlatforms.map(p => (
                    <span key={p} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1">
                      {p}
                      <button onClick={() => toggleArrayFilter(selectedPlatforms, setSelectedPlatforms, p)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedMarkets.map(m => (
                    <span key={m} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full flex items-center gap-1">
                      {m}
                      <button onClick={() => toggleArrayFilter(selectedMarkets, setSelectedMarkets, m)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedChallengeTypes.map(c => (
                    <span key={c} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full flex items-center gap-1">
                      {c}
                      <button onClick={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, c)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {maxPrice && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full flex items-center gap-1">
                      Under ${maxPrice}
                      <button onClick={() => setMaxPrice(null)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {minProfitSplit && (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full flex items-center gap-1">
                      {minProfitSplit}%+ split
                      <button onClick={() => setMinProfitSplit(null)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {tradingStyles.map(s => (
                    <span key={s} className="px-3 py-1 bg-pink-500/20 text-pink-400 text-sm rounded-full flex items-center gap-1">
                      {tradingStyleOptions.find(o => o.id === s)?.label}
                      <button onClick={() => toggleArrayFilter(tradingStyles, setTradingStyles, s)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              )}

              {/* No Results */}
              {!loading && sortedFirms.length === 0 && (
                <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
                  <p className="text-gray-400 text-lg mb-4">No prop firms match your filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Prop Firms Grid/List */}
              {!loading && sortedFirms.length > 0 && (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }>
                  {sortedFirms.map((firm) => (
                    <PropFirmCard 
                      key={firm.id} 
                      firm={firm} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
