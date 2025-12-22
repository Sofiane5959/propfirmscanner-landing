'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, ChevronDown, X, Star, ExternalLink, Grid, List, MapPin, Shield } from 'lucide-react'
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

// Platform colors
const platformColors: Record<string, string> = {
  'MT4': 'bg-gradient-to-br from-blue-500 to-blue-700',
  'MT5': 'bg-gradient-to-br from-blue-600 to-indigo-700',
  'cTrader': 'bg-gradient-to-br from-amber-400 to-orange-500',
  'DXtrade': 'bg-gradient-to-br from-purple-500 to-violet-700',
  'TradeLocker': 'bg-gradient-to-br from-emerald-500 to-green-700',
  'Match-Trader': 'bg-gradient-to-br from-orange-500 to-red-600',
  'MatchTrader': 'bg-gradient-to-br from-orange-500 to-red-600',
  'NinjaTrader': 'bg-gradient-to-br from-red-500 to-red-700',
  'Tradovate': 'bg-gradient-to-br from-cyan-500 to-blue-600',
  'Rithmic': 'bg-gradient-to-br from-gray-600 to-gray-800',
}

// Market colors
const marketColors: Record<string, string> = {
  'Forex': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Indices': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Metals': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Crypto': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Stocks': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Futures': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Commodities': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Energy': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
}

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
    if (searchQuery && !firm.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedPlatforms.length > 0) {
      const firmPlatforms = firm.platforms || []
      if (!selectedPlatforms.some(p => firmPlatforms.includes(p))) {
        return false
      }
    }
    if (selectedMarkets.length > 0) {
      const firmMarkets = firm.instruments || []
      if (!selectedMarkets.some(m => firmMarkets.includes(m))) {
        return false
      }
    }
    if (selectedPriceRanges.length > 0) {
      const price = firm.min_price || 0
      const matchesPrice = selectedPriceRanges.some(range => {
        const priceRange = PRICE_RANGES.find(r => r.label === range)
        return priceRange && price >= priceRange.min && price <= priceRange.max
      })
      if (!matchesPrice) return false
    }
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

  const activeFiltersCount = 
    selectedChallengeTypes.length + 
    selectedPlatforms.length + 
    selectedMarkets.length + 
    selectedPriceRanges.length + 
    selectedProfitSplits.length + 
    selectedTradingStyles.length

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

  // Render stars
  const renderStars = (rating: number | null) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
        <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Render platforms
  const renderPlatforms = (platforms: string[] | null) => {
    if (!platforms || platforms.length === 0) return <span className="text-gray-500 text-xs">N/A</span>
    return (
      <div className="flex flex-wrap gap-1.5">
        {platforms.slice(0, 4).map((platform) => {
          const bgColor = platformColors[platform] || 'bg-gray-600'
          return (
            <div
              key={platform}
              className={`w-7 h-7 rounded-lg ${bgColor} flex items-center justify-center text-white text-[9px] font-bold`}
              title={platform}
            >
              {platform.substring(0, 2).toUpperCase()}
            </div>
          )
        })}
        {platforms.length > 4 && (
          <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center text-[10px] text-gray-400 font-medium">
            +{platforms.length - 4}
          </div>
        )}
      </div>
    )
  }

  // Render markets
  const renderMarkets = (instruments: string[] | null) => {
    if (!instruments || instruments.length === 0) return <span className="text-gray-500 text-xs">N/A</span>
    return (
      <div className="flex flex-wrap gap-1.5">
        {instruments.slice(0, 5).map((market) => {
          const colorClass = marketColors[market] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          return (
            <span key={market} className={`px-2 py-0.5 ${colorClass} text-xs rounded-md border`}>
              {market}
            </span>
          )
        })}
        {instruments.length > 5 && (
          <span className="px-2 py-0.5 text-gray-500 text-xs">+{instruments.length - 5}</span>
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
            <FilterDropdown name="challenge" label="Challenge Type" options={CHALLENGE_TYPES} selected={selectedChallengeTypes} setSelected={setSelectedChallengeTypes} />
            <FilterDropdown name="platform" label="Platform" options={PLATFORMS} selected={selectedPlatforms} setSelected={setSelectedPlatforms} />
            <FilterDropdown name="markets" label="Markets" options={MARKETS} selected={selectedMarkets} setSelected={setSelectedMarkets} />
            <FilterDropdown name="price" label="Price" options={PRICE_RANGES.map(r => r.label)} selected={selectedPriceRanges} setSelected={setSelectedPriceRanges} />
            <FilterDropdown name="profit" label="Profit Split" options={PROFIT_SPLITS} selected={selectedProfitSplits} setSelected={setSelectedProfitSplits} />
            <FilterDropdown name="style" label="Trading Style" options={TRADING_STYLES} selected={selectedTradingStyles} setSelected={setSelectedTradingStyles} />
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

        {/* Grid View - Detailed Cards */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFirms.map((firm) => (
              <div
                key={firm.id}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                        {firm.logo_url ? (
                          <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
                        {renderStars(firm.trustpilot_rating)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Location & Regulation */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    {firm.headquarters && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {firm.headquarters}
                      </span>
                    )}
                    {firm.is_regulated && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Shield className="w-3 h-3" />
                        Regulated
                      </span>
                    )}
                  </div>

                  {/* Challenge Types */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {firm.challenge_types?.slice(0, 3).map((type) => (
                      <span key={type} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-5 flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Starting From</p>
                      <p className="text-white font-semibold text-lg">${firm.min_price || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Profit Split</p>
                      <p className="text-emerald-400 font-semibold text-lg">{firm.profit_split || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Daily Drawdown</p>
                      <p className="text-white font-semibold">{firm.max_daily_drawdown || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Max Drawdown</p>
                      <p className="text-white font-semibold">{firm.max_total_drawdown || 'N/A'}%</p>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs uppercase mb-2">Trading Platforms</p>
                    {renderPlatforms(firm.platforms)}
                  </div>

                  {/* Markets */}
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs uppercase mb-2">Markets</p>
                    {renderMarkets(firm.instruments)}
                  </div>

                  {/* Trading Permissions */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {firm.allows_scalping && (
                      <span className="text-xs text-green-400 flex items-center gap-1">✓ Scalping</span>
                    )}
                    {firm.allows_news_trading && (
                      <span className="text-xs text-green-400 flex items-center gap-1">✓ News</span>
                    )}
                    {firm.allows_ea && (
                      <span className="text-xs text-green-400 flex items-center gap-1">✓ EA/Bots</span>
                    )}
                    {firm.allows_hedging && (
                      <span className="text-xs text-green-400 flex items-center gap-1">✓ Hedging</span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-900/50 border-t border-gray-700 mt-auto">
                  <div className="flex gap-2">
                    <Link
                      href={`/prop-firm/${firm.slug || firm.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-center"
                    >
                      Details
                    </Link>
                    <a
                      href={firm.affiliate_url || firm.website_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Visit
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && (
          <div className="space-y-4">
            {sortedFirms.map((firm) => (
              <div
                key={firm.id}
                className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Logo & Name */}
                  <div className="flex items-center gap-4 md:w-56">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                      {firm.logo_url ? (
                        <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg font-bold text-emerald-600">{firm.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
                      {renderStars(firm.trustpilot_rating)}
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase">From</p>
                      <p className="text-white font-semibold">${firm.min_price || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Profit Split</p>
                      <p className="text-emerald-400 font-semibold">{firm.profit_split || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Platforms</p>
                      {renderPlatforms(firm.platforms)}
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Location</p>
                      <p className="text-white font-semibold text-sm">{firm.headquarters || 'N/A'}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2 md:w-48">
                    <Link
                      href={`/prop-firm/${firm.slug || firm.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-center text-sm"
                    >
                      Details
                    </Link>
                    <a
                      href={firm.affiliate_url || firm.website_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      Visit
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
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
