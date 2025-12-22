'use client'

// Client Component pour la page Compare
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
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [minProfitSplit, setMinProfitSplit] = useState<number | null>(null)
  const [tradingStyles, setTradingStyles] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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

  useEffect(() => {
    let result = [...firms]
    if (searchQuery) {
      result = result.filter(firm => firm.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (selectedPlatforms.length > 0) {
      result = result.filter(firm => firm.platforms?.some(p => selectedPlatforms.includes(p)))
    }
    if (selectedMarkets.length > 0) {
      result = result.filter(firm => firm.instruments?.some(i => selectedMarkets.includes(i)))
    }
    if (selectedChallengeTypes.length > 0) {
      result = result.filter(firm => firm.challenge_types?.some(c => selectedChallengeTypes.includes(c)))
    }
    if (maxPrice) {
      result = result.filter(firm => (firm.min_price || 0) <= maxPrice)
    }
    if (minProfitSplit) {
      result = result.filter(firm => (firm.profit_split || 0) >= minProfitSplit)
    }
    if (tradingStyles.includes('scalping')) result = result.filter(firm => firm.allows_scalping)
    if (tradingStyles.includes('news')) result = result.filter(firm => firm.allows_news_trading)
    if (tradingStyles.includes('ea')) result = result.filter(firm => firm.allows_ea)
    if (tradingStyles.includes('hedging')) result = result.filter(firm => firm.allows_hedging)
    setFilteredFirms(result)
  }, [firms, searchQuery, selectedPlatforms, selectedMarkets, selectedChallengeTypes, maxPrice, minProfitSplit, tradingStyles])

  const sortedFirms = [...filteredFirms].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
      case 'price-low': return (a.min_price || 0) - (b.min_price || 0)
      case 'price-high': return (b.min_price || 0) - (a.min_price || 0)
      case 'profit-split': return (b.profit_split || 0) - (a.profit_split || 0)
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
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
    selectedPlatforms.length + selectedMarkets.length + selectedChallengeTypes.length + 
    (maxPrice ? 1 : 0) + (minProfitSplit ? 1 : 0) + tradingStyles.length

  const scrollFilters = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' })
    }
  }

  // Dropdown component
  const FilterDropdown = ({
    id,
    label,
    count,
    children
  }: {
    id: string
    label: string
    count?: number
    children: React.ReactNode
  }) => (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 whitespace-nowrap transition-all
          ${count && count > 0 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700'}`}
      >
        {label}
        {count !== undefined && count > 0 && <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded">{count}</span>}
        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === id ? 'rotate-180' : ''}`} />
      </button>
      {openDropdown === id && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-2 z-[100] max-h-64 overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Overlay to close dropdowns */}
      {openDropdown && (
        <div className="fixed inset-0 z-[99]" onClick={() => setOpenDropdown(null)} />
      )}

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

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search prop firms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filters */}
          <div className="relative mb-6 bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
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
                <button onClick={clearAllFilters} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                  <X className="w-4 h-4" /> Clear all
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => scrollFilters('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800 rounded-full border border-gray-700 text-gray-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-10 py-2" style={{ scrollbarWidth: 'none' }}>
                
                {/* Challenge Type */}
                <FilterDropdown id="challenge" label="Challenge Type" count={selectedChallengeTypes.length}>
                  {challengeTypeOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, opt)}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between ${selectedChallengeTypes.includes(opt) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {opt === 'instant' ? 'Instant Funding' : opt}
                      {selectedChallengeTypes.includes(opt) && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </FilterDropdown>

                {/* Platform */}
                <FilterDropdown id="platform" label="Platform" count={selectedPlatforms.length}>
                  {platformOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleArrayFilter(selectedPlatforms, setSelectedPlatforms, opt)}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between ${selectedPlatforms.includes(opt) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {opt}
                      {selectedPlatforms.includes(opt) && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </FilterDropdown>

                {/* Markets */}
                <FilterDropdown id="market" label="Markets" count={selectedMarkets.length}>
                  {marketOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleArrayFilter(selectedMarkets, setSelectedMarkets, opt)}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between ${selectedMarkets.includes(opt) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {opt}
                      {selectedMarkets.includes(opt) && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </FilterDropdown>

                {/* Price */}
                <FilterDropdown id="price" label={maxPrice ? `Under $${maxPrice}` : 'Price'} count={maxPrice ? 1 : 0}>
                  {priceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setMaxPrice(maxPrice === opt.value ? null : opt.value); setOpenDropdown(null); }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between ${maxPrice === opt.value ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {opt.label}
                      {maxPrice === opt.value && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </FilterDropdown>

                {/* Profit Split */}
                <FilterDropdown id="profit" label={minProfitSplit ? `${minProfitSplit}%+` : 'Profit Split'} count={minProfitSplit ? 1 : 0}>
                  {profitSplitOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setMinProfitSplit(minProfitSplit === opt.value ? null : opt.value); setOpenDropdown(null); }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between ${minProfitSplit === opt.value ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {opt.label}
                      {minProfitSplit === opt.value && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </FilterDropdown>

                {/* Trading Style */}
                <FilterDropdown id="style" label="Trading Style" count={tradingStyles.length}>
                  {tradingStyleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleArrayFilter(tradingStyles, setTradingStyles, opt.id)}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center justify-between ${tradingStyles.includes(opt.id) ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      {opt.label}
                      {tradingStyles.includes(opt.id) && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                    </button>
                  ))}
                </FilterDropdown>

              </div>

              <button
                onClick={() => scrollFilters('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800 rounded-full border border-gray-700 text-gray-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
                {selectedChallengeTypes.map(c => (
                  <span key={c} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full flex items-center gap-1">
                    {c === 'instant' ? 'Instant' : c}
                    <button onClick={() => toggleArrayFilter(selectedChallengeTypes, setSelectedChallengeTypes, c)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {selectedPlatforms.map(p => (
                  <span key={p} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1">
                    {p}
                    <button onClick={() => toggleArrayFilter(selectedPlatforms, setSelectedPlatforms, p)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {selectedMarkets.map(m => (
                  <span key={m} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full flex items-center gap-1">
                    {m}
                    <button onClick={() => toggleArrayFilter(selectedMarkets, setSelectedMarkets, m)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                {maxPrice && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full flex items-center gap-1">
                    Under ${maxPrice}
                    <button onClick={() => setMaxPrice(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minProfitSplit && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full flex items-center gap-1">
                    {minProfitSplit}%+ split
                    <button onClick={() => setMinProfitSplit(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {tradingStyles.map(s => (
                  <span key={s} className="px-3 py-1 bg-pink-500/20 text-pink-400 text-sm rounded-full flex items-center gap-1">
                    {tradingStyleOptions.find(o => o.id === s)?.label}
                    <button onClick={() => toggleArrayFilter(tradingStyles, setTradingStyles, s)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sort & View */}
          <div className="flex justify-between items-center gap-4 mb-6">
            <p className="text-gray-400">{loading ? 'Loading...' : `${sortedFirms.length} prop firms found`}</p>
            <div className="flex items-center gap-4">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 text-sm">
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="profit-split">Profit Split</option>
                <option value="name">Name A-Z</option>
              </select>
              <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {!loading && sortedFirms.length === 0 && (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700">
              <p className="text-gray-400 text-lg mb-4">No prop firms match your filters.</p>
              <button onClick={clearAllFilters} className="px-6 py-2 bg-emerald-600 text-white rounded-lg">Clear all filters</button>
            </div>
          )}

          {!loading && sortedFirms.length > 0 && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
              {sortedFirms.map((firm) => <PropFirmCard key={firm.id} firm={firm} viewMode={viewMode} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
