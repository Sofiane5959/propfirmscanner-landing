'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { PropFirmCard } from '@/components/compare/PropFirmCard'
import { getPropFirms } from '@/lib/supabase-queries'
import type { PropFirm } from '@/types'
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ComparePage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [filteredFirms, setFilteredFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Filter states - multi-select
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [minProfitSplit, setMinProfitSplit] = useState<number | null>(null)
  const [tradingStyles, setTradingStyles] = useState<string[]>([])
  
  // Dropdown states for horizontal filters
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Available filter options
  const platformOptions = ['MT4', 'MT5', 'cTrader', 'DXtrade', 'TradeLocker', 'Match-Trader', 'NinjaTrader', 'Tradovate']
  const marketOptions = ['Forex', 'Indices', 'Metals', 'Crypto', 'Stocks', 'Futures', 'Energy']
  const challengeTypeOptions = ['1-step', '2-step', '3-step', 'instant']
  const priceOptions = [
    { label: 'Under $50', value: 50 },
    { label: 'Under $100', value: 100 },
    { label: 'Under $200', value: 200 },
    { label: 'Under $500', value: 500 },
  ]
  const profitSplitOptions = [
    { label: '80%+', value: 80 },
    { label: '85%+', value: 85 },
    { label: '90%+', value: 90 },
    { label: '100%', value: 100 },
  ]
  const tradingStyleOptions = [
    { id: 'scalping', label: 'Scalping' },
    { id: 'news', label: 'News Trading' },
    { id: 'ea', label: 'EA / Bots' },
    { id: 'hedging', label: 'Hedging' },
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.filter-dropdown')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...firms]

    if (searchQuery) {
      result = result.filter(firm => 
        firm.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedPlatforms.length > 0) {
      result = result.filter(firm => 
        firm.platforms?.some(p => selectedPlatforms.includes(p))
      )
    }

    if (selectedMarkets.length > 0) {
      result = result.filter(firm => 
        firm.instruments?.some(i => selectedMarkets.includes(i))
      )
    }

    if (selectedChallengeTypes.length > 0) {
      result = result.filter(firm => 
        firm.challenge_types?.some(c => selectedChallengeTypes.includes(c))
      )
    }

    if (maxPrice) {
      result = result.filter(firm => (firm.min_price || 0) <= maxPrice)
    }

    if (minProfitSplit) {
      result = result.filter(firm => (firm.profit_split || 0) >= minProfitSplit)
    }

    if (tradingStyles.includes('scalping')) {
      result = result.filter(firm => firm.allows_scalping)
    }
    if (tradingStyles.includes('news')) {
      result = result.filter(firm => firm.allows_news_trading)
    }
    if (tradingStyles.includes('ea')) {
      result = result.filter(firm => firm.allows_ea)
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

  const toggleArrayFilter = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value))
    } else {
      setArray([...array, value])
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedPlatforms([])
    setSelectedMarkets([])
    setSelectedChallengeTypes([])
    setMaxPrice(null)
    setMinProfitSplit(null)
    setTradingStyles([])
  }

  const activeFilterCount = 
    selectedPlatforms.length + 
    selectedMarkets.length + 
    selectedChallengeTypes.length + 
    (maxPrice ? 1 : 0) + 
    (minProfitSplit ? 1 : 0) + 
    tradingStyles.length

  const scrollFilters = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleDropdownToggle = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Compare <span className="text-emerald-400">Prop Firms</span>
            </h1>
            <p className="text-gray-400">
              Find the perfect prop firm for your trading style. Compare {firms.length} verified firms.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search prop firms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Filters */}
          <div className="relative mb-6 bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            {/* Scrollable Filters */}
            <div className="relative">
              {/* Left scroll button */}
              <button
                onClick={() => scrollFilters('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/90 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-all hover:bg-gray-800 shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Filters container */}
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto px-10 py-2 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Challenge Type Filter */}
                <div className="relative flex-shrink-0 filter-dropdown">
                  <button
                    onClick={() => handleDropdownToggle('challenge')}
                    className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                      ${selectedChallengeTypes.length > 0
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>Challenge Type</span>
                    {selectedChallengeTypes.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-md">
                        {selectedChallengeTypes.length}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'challenge' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'challenge' && (
                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                      {challengeTypeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, option)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between
                            ${selectedChallengeTypes.includes(option)
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span>{option === 'instant' ? 'Instant Funding' : option}</span>
                          {selectedChallengeTypes.includes(option) && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Filter */}
                <div className="relative flex-shrink-0 filter-dropdown">
                  <button
                    onClick={() => handleDropdownToggle('platform')}
                    className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                      ${selectedPlatforms.length > 0
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>Platform</span>
                    {selectedPlatforms.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-md">
                        {selectedPlatforms.length}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'platform' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'platform' && (
                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                      {platformOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleArrayFilter(selectedPlatforms, setSelectedPlatforms, option)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between
                            ${selectedPlatforms.includes(option)
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span>{option}</span>
                          {selectedPlatforms.includes(option) && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Markets Filter */}
                <div className="relative flex-shrink-0 filter-dropdown">
                  <button
                    onClick={() => handleDropdownToggle('market')}
                    className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                      ${selectedMarkets.length > 0
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>Markets</span>
                    {selectedMarkets.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-md">
                        {selectedMarkets.length}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'market' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'market' && (
                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                      {marketOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleArrayFilter(selectedMarkets, setSelectedMarkets, option)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between
                            ${selectedMarkets.includes(option)
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span>{option}</span>
                          {selectedMarkets.includes(option) && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Filter */}
                <div className="relative flex-shrink-0 filter-dropdown">
                  <button
                    onClick={() => handleDropdownToggle('price')}
                    className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                      ${maxPrice
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>{maxPrice ? `Under $${maxPrice}` : 'Price'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'price' && (
                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[150px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                      {priceOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setMaxPrice(maxPrice === option.value ? null : option.value)
                            setOpenDropdown(null)
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between
                            ${maxPrice === option.value
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span>{option.label}</span>
                          {maxPrice === option.value && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profit Split Filter */}
                <div className="relative flex-shrink-0 filter-dropdown">
                  <button
                    onClick={() => handleDropdownToggle('profit')}
                    className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                      ${minProfitSplit
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>{minProfitSplit ? `${minProfitSplit}%+` : 'Profit Split'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'profit' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'profit' && (
                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[150px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                      {profitSplitOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setMinProfitSplit(minProfitSplit === option.value ? null : option.value)
                            setOpenDropdown(null)
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between
                            ${minProfitSplit === option.value
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span>{option.label}</span>
                          {minProfitSplit === option.value && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trading Style Filter */}
                <div className="relative flex-shrink-0 filter-dropdown">
                  <button
                    onClick={() => handleDropdownToggle('style')}
                    className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap
                      ${tradingStyles.length > 0
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>Trading Style</span>
                    {tradingStyles.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-md">
                        {tradingStyles.length}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'style' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'style' && (
                    <div className="absolute top-full left-0 mt-2 z-50 min-w-[180px] bg-gray-800 border border-gray-700 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto">
                      {tradingStyleOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => toggleArrayFilter(tradingStyles, setTradingStyles, option.id)}
                          className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center justify-between
                            ${tradingStyles.includes(option.id)
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <span>{option.label}</span>
                          {tradingStyles.includes(option.id) && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right scroll button */}
              <button
                onClick={() => scrollFilters('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-900/90 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-all hover:bg-gray-800 shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Active Filters Tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
                {selectedChallengeTypes.map(c => (
                  <span key={c} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full flex items-center gap-1">
                    {c === 'instant' ? 'Instant' : c}
                    <button onClick={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, c)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
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
          </div>

          {/* Sort & View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-gray-400">
              {loading ? 'Loading...' : `${sortedFirms.length} prop firms found`}
            </p>
            
            <div className="flex items-center gap-4">
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
      </main>
    </div>
  )
}
