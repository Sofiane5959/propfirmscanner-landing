'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, ChevronDown, X, Star, ExternalLink, Grid, List } from 'lucide-react'
import { getPropFirms } from '@/lib/supabase-queries'
import type { PropFirm } from '@/types'
import Link from 'next/link'

// Options pour les filtres
const CHALLENGE_TYPES = ['1-step', '2-step', '3-step', 'Instant', 'Direct']
const PLATFORMS = ['MT4', 'MT5', 'cTrader', 'DXtrade', 'TradeLocker', 'MatchTrader']
const MARKETS = ['Forex', 'Indices', 'Crypto', 'Commodities', 'Stocks']
const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: 999999 },
]
const PROFIT_SPLITS = ['70%+', '80%+', '90%+']
const TRADING_STYLES = ['Scalping', 'News Trading', 'Weekend Holding', 'Hedging', 'EA/Bots']

export default function ComparePage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  
  // État des filtres
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedProfitSplits, setSelectedProfitSplits] = useState<string[]>([])
  const [selectedTradingStyles, setSelectedTradingStyles] = useState<string[]>([])
  
  // État des dropdowns ouverts
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFirms() {
      const data = await getPropFirms()
      setFirms(data)
      setLoading(false)
    }
    fetchFirms()
  }, [])

  // Fermer dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.filter-dropdown-container')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Toggle dropdown
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  // Toggle filter selection
  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  // Filtrer les firms
  const filteredFirms = firms.filter(firm => {
    // Search
    if (searchQuery && !firm.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Platform filter
    if (selectedPlatforms.length > 0) {
      const firmPlatforms = firm.platforms || []
      if (!selectedPlatforms.some(p => firmPlatforms.includes(p))) {
        return false
      }
    }
    
    // Markets filter
    if (selectedMarkets.length > 0) {
      const firmMarkets = firm.instruments || []
      if (!selectedMarkets.some(m => firmMarkets.includes(m))) {
        return false
      }
    }
    
    // Price filter
    if (selectedPriceRanges.length > 0) {
      const price = firm.min_price || 0
      const matchesPrice = selectedPriceRanges.some(range => {
        const priceRange = PRICE_RANGES.find(r => r.label === range)
        return priceRange && price >= priceRange.min && price <= priceRange.max
      })
      if (!matchesPrice) return false
    }
    
    // Profit split filter
    if (selectedProfitSplits.length > 0) {
      const split = firm.profit_split || 0
      const matchesSplit = selectedProfitSplits.some(s => {
        if (s === '90%+') return split >= 90
        if (s === '80%+') return split >= 80
        if (s === '70%+') return split >= 70
        return false
      })
      if (!matchesSplit) return false
    }
    
    // Trading style filter
    if (selectedTradingStyles.length > 0) {
      const matchesStyle = selectedTradingStyles.some(style => {
        if (style === 'Scalping') return firm.allows_scalping
        if (style === 'News Trading') return firm.allows_news_trading
        if (style === 'Weekend Holding') return firm.allows_weekend_holding
        if (style === 'Hedging') return firm.allows_hedging
        if (style === 'EA/Bots') return firm.allows_ea
        return false
      })
      if (!matchesStyle) return false
    }
    
    return true
  })

  // Trier les firms
  const sortedFirms = [...filteredFirms].sort((a, b) => {
    if (sortBy === 'rating') return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
    if (sortBy === 'price-low') return (a.min_price || 0) - (b.min_price || 0)
    if (sortBy === 'price-high') return (b.min_price || 0) - (a.min_price || 0)
    if (sortBy === 'profit-split') return (b.profit_split || 0) - (a.profit_split || 0)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  // Compter les filtres actifs
  const activeFiltersCount = 
    selectedChallengeTypes.length + 
    selectedPlatforms.length + 
    selectedMarkets.length + 
    selectedPriceRanges.length + 
    selectedProfitSplits.length + 
    selectedTradingStyles.length

  // Clear tous les filtres
  const clearAllFilters = () => {
    setSelectedChallengeTypes([])
    setSelectedPlatforms([])
    setSelectedMarkets([])
    setSelectedPriceRanges([])
    setSelectedProfitSplits([])
    setSelectedTradingStyles([])
    setSearchQuery('')
  }

  // Composant FilterDropdown
  const FilterDropdown = ({ 
    name, 
    label, 
    options, 
    selected, 
    setSelected 
  }: { 
    name: string
    label: string
    options: string[]
    selected: string[]
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  }) => {
    const isOpen = openDropdown === name
    
    return (
      <div className="relative filter-dropdown-container">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleDropdown(name)
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap
            ${selected.length > 0 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
              {selected.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 py-2 max-h-64 overflow-y-auto">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleFilter(option, selected, setSelected)}
                  className="w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Compare <span className="text-emerald-400">Prop Firms</span>
          </h1>
          <p className="text-gray-400">Find the perfect prop firm for your trading style</p>
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
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="ml-auto text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              name="challenge"
              label="Challenge Type"
              options={CHALLENGE_TYPES}
              selected={selectedChallengeTypes}
              setSelected={setSelectedChallengeTypes}
            />
            <FilterDropdown
              name="platform"
              label="Platform"
              options={PLATFORMS}
              selected={selectedPlatforms}
              setSelected={setSelectedPlatforms}
            />
            <FilterDropdown
              name="markets"
              label="Markets"
              options={MARKETS}
              selected={selectedMarkets}
              setSelected={setSelectedMarkets}
            />
            <FilterDropdown
              name="price"
              label="Price"
              options={PRICE_RANGES.map(r => r.label)}
              selected={selectedPriceRanges}
              setSelected={setSelectedPriceRanges}
            />
            <FilterDropdown
              name="profit"
              label="Profit Split"
              options={PROFIT_SPLITS}
              selected={selectedProfitSplits}
              setSelected={setSelectedProfitSplits}
            />
            <FilterDropdown
              name="style"
              label="Trading Style"
              options={TRADING_STYLES}
              selected={selectedTradingStyles}
              setSelected={setSelectedTradingStyles}
            />
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            <span className="text-white font-semibold">{sortedFirms.length}</span> prop firms found
          </p>
          
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="profit-split">Best Profit Split</option>
              <option value="name">Name A-Z</option>
            </select>
            
            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading prop firms...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedFirms.map((firm) => (
              <Link
                key={firm.id}
                href={`/prop-firm/${firm.slug || firm.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                    {firm.logo_url ? (
                      <img src={firm.logo_url} alt={firm.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <span className="text-2xl font-bold text-emerald-500">{firm.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {firm.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {firm.trustpilot_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{firm.trustpilot_rating}</span>
                        </div>
                      )}
                      {firm.headquarters && (
                        <span className="text-gray-500 text-sm">• {firm.headquarters}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">From</div>
                    <div className="text-white font-semibold">${firm.min_price}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Profit Split</div>
                    <div className="text-emerald-400 font-semibold">{firm.profit_split}%</div>
                  </div>
                </div>
                
                {firm.platforms && firm.platforms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {firm.platforms.slice(0, 3).map(platform => (
                      <span key={platform} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                        {platform}
                      </span>
                    ))}
                    {firm.platforms.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
                        +{firm.platforms.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && sortedFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No prop firms found matching your criteria.</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
