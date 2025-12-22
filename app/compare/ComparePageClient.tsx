'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, ChevronDown, X, Star, ExternalLink, Grid, List, Shield, DollarSign } from 'lucide-react'
import { getPropFirms } from '@/lib/supabase-queries'
import type { PropFirm } from '@/types'

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

// Country to ISO code mapping for flags
const countryToCode: Record<string, string> = {
  'USA': 'us',
  'United States': 'us',
  'UK': 'gb',
  'United Kingdom': 'gb',
  'England': 'gb',
  'Czech Republic': 'cz',
  'Czechia': 'cz',
  'UAE': 'ae',
  'United Arab Emirates': 'ae',
  'Dubai': 'ae',
  'Australia': 'au',
  'Canada': 'ca',
  'Germany': 'de',
  'France': 'fr',
  'Spain': 'es',
  'Italy': 'it',
  'Netherlands': 'nl',
  'Switzerland': 'ch',
  'Singapore': 'sg',
  'Hong Kong': 'hk',
  'Japan': 'jp',
  'South Africa': 'za',
  'Nigeria': 'ng',
  'India': 'in',
  'Pakistan': 'pk',
  'Malaysia': 'my',
  'Indonesia': 'id',
  'Thailand': 'th',
  'Vietnam': 'vn',
  'Philippines': 'ph',
  'Poland': 'pl',
  'Hungary': 'hu',
  'Romania': 'ro',
  'Bulgaria': 'bg',
  'Cyprus': 'cy',
  'Malta': 'mt',
  'Estonia': 'ee',
  'Latvia': 'lv',
  'Lithuania': 'lt',
  'Israel': 'il',
  'Turkey': 'tr',
  'Mexico': 'mx',
  'Brazil': 'br',
  'Argentina': 'ar',
  'Colombia': 'co',
  'Chile': 'cl',
  'Peru': 'pe',
  'St. Vincent': 'vc',
  'Saint Vincent': 'vc',
  'Seychelles': 'sc',
  'Bahamas': 'bs',
  'Belize': 'bz',
  'Panama': 'pa',
  'Costa Rica': 'cr',
  'New Zealand': 'nz',
  'Ireland': 'ie',
  'Belgium': 'be',
  'Austria': 'at',
  'Sweden': 'se',
  'Norway': 'no',
  'Denmark': 'dk',
  'Finland': 'fi',
  'Portugal': 'pt',
  'Greece': 'gr',
  'China': 'cn',
  'Korea': 'kr',
  'South Korea': 'kr',
  'Taiwan': 'tw',
}

// Platform logos URLs (using CDN/public URLs)
const platformLogos: Record<string, { url: string; bg: string }> = {
  'MT4': {
    url: 'https://www.metatrader4.com/i/logo-metatrader-4.png',
    bg: 'bg-[#2B5BA8]'
  },
  'MT5': {
    url: 'https://www.metatrader5.com/i/logo-metatrader-5.png',
    bg: 'bg-[#7B2D8E]'
  },
  'cTrader': {
    url: 'https://ctrader.com/images/ctrader-logo.svg',
    bg: 'bg-[#FF6B00]'
  },
  'DXtrade': {
    url: '',
    bg: 'bg-gradient-to-br from-[#7C3AED] to-[#4F46E5]'
  },
  'TradeLocker': {
    url: '',
    bg: 'bg-gradient-to-br from-[#10B981] to-[#059669]'
  },
  'Match-Trader': {
    url: '',
    bg: 'bg-gradient-to-br from-[#F97316] to-[#EA580C]'
  },
  'MatchTrader': {
    url: '',
    bg: 'bg-gradient-to-br from-[#F97316] to-[#EA580C]'
  },
}

// Get country code for flag
const getCountryCode = (country: string | null | undefined): string | null => {
  if (!country) return null
  if (countryToCode[country]) return countryToCode[country]
  for (const [key, code] of Object.entries(countryToCode)) {
    if (country.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(country.toLowerCase())) {
      return code
    }
  }
  return null
}

// Country Flag Component using flagcdn
const CountryFlag = ({ country }: { country: string | null | undefined }) => {
  const code = getCountryCode(country)
  if (!code) return null
  
  return (
    <img 
      src={`https://flagcdn.com/24x18/${code}.png`}
      srcSet={`https://flagcdn.com/48x36/${code}.png 2x`}
      width="24"
      height="18"
      alt={country || ''}
      className="rounded-sm"
      style={{ minWidth: '24px' }}
    />
  )
}

// Platform Logo Component
const PlatformLogo = ({ platform }: { platform: string }) => {
  const config = platformLogos[platform]
  
  // MT4 - Blue with M4 text
  if (platform === 'MT4') {
    return (
      <div className="w-9 h-9 rounded-lg bg-[#2B5BA8] flex items-center justify-center shadow-md" title="MetaTrader 4">
        <span className="text-white font-bold text-sm">M4</span>
      </div>
    )
  }
  
  // MT5 - Purple with M5 text  
  if (platform === 'MT5') {
    return (
      <div className="w-9 h-9 rounded-lg bg-[#7B2D8E] flex items-center justify-center shadow-md" title="MetaTrader 5">
        <span className="text-white font-bold text-sm">M5</span>
      </div>
    )
  }
  
  // cTrader - Orange with cT
  if (platform === 'cTrader') {
    return (
      <div className="w-9 h-9 rounded-lg bg-[#FF6B00] flex items-center justify-center shadow-md" title="cTrader">
        <span className="text-white font-bold text-sm">cT</span>
      </div>
    )
  }
  
  // DXtrade - Purple gradient
  if (platform === 'DXtrade') {
    return (
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center shadow-md" title="DXtrade">
        <span className="text-white font-bold text-xs">DX</span>
      </div>
    )
  }
  
  // TradeLocker - Green with lock icon
  if (platform === 'TradeLocker') {
    return (
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-md" title="TradeLocker">
        <span className="text-white font-bold text-xs">TL</span>
      </div>
    )
  }
  
  // Match-Trader / MatchTrader - Orange
  if (platform === 'Match-Trader' || platform === 'MatchTrader') {
    return (
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-md" title="Match-Trader">
        <span className="text-white font-bold text-xs">MT</span>
      </div>
    )
  }
  
  // NinjaTrader - Yellow/Gold
  if (platform === 'NinjaTrader') {
    return (
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-md" title="NinjaTrader">
        <span className="text-white font-bold text-xs">NT</span>
      </div>
    )
  }
  
  // Tradovate - Cyan/Blue
  if (platform === 'Tradovate') {
    return (
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-md" title="Tradovate">
        <span className="text-white font-bold text-xs">TV</span>
      </div>
    )
  }
  
  // Rithmic - Dark gray
  if (platform === 'Rithmic') {
    return (
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#475569] to-[#334155] flex items-center justify-center shadow-md" title="Rithmic">
        <span className="text-white font-bold text-xs">R</span>
      </div>
    )
  }
  
  // Default fallback
  return (
    <div className="w-9 h-9 rounded-lg bg-gray-600 flex items-center justify-center shadow-md" title={platform}>
      <span className="text-white font-bold text-[10px]">{platform.substring(0, 2).toUpperCase()}</span>
    </div>
  )
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

// Format max account size
const formatMaxAccount = (sizes: number[] | null | undefined): string => {
  if (!sizes || sizes.length === 0) return 'N/A'
  const max = Math.max(...sizes)
  if (max >= 1000000) return `$${(max / 1000000).toFixed(1)}M`
  if (max >= 1000) return `$${(max / 1000).toFixed(0)}K`
  return `$${max}`
}

export default function ComparePage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  
  const [selectedChallengeTypes, setSelectedChallengeTypes] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedProfitSplits, setSelectedProfitSplits] = useState<string[]>([])
  const [selectedTradingStyles, setSelectedTradingStyles] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFirms() {
      const data = await getPropFirms()
      setFirms(data)
      setLoading(false)
    }
    fetchFirms()
  }, [])

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

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const toggleFilter = (value: string, selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value))
    } else {
      setSelected([...selected, value])
    }
  }

  const filteredFirms = firms.filter(firm => {
    if (searchQuery && !firm.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedPlatforms.length > 0) {
      const firmPlatforms = firm.platforms || []
      if (!selectedPlatforms.some(p => firmPlatforms.includes(p))) return false
    }
    if (selectedMarkets.length > 0) {
      const firmMarkets = firm.instruments || []
      if (!selectedMarkets.some(m => firmMarkets.includes(m))) return false
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

  const sortedFirms = [...filteredFirms].sort((a, b) => {
    if (sortBy === 'rating') return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
    if (sortBy === 'price-low') return (a.min_price || 0) - (b.min_price || 0)
    if (sortBy === 'price-high') return (b.min_price || 0) - (a.min_price || 0)
    if (sortBy === 'profit-split') return (b.profit_split || 0) - (a.profit_split || 0)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const activeFiltersCount = selectedChallengeTypes.length + selectedPlatforms.length + selectedMarkets.length + 
    selectedPriceRanges.length + selectedProfitSplits.length + selectedTradingStyles.length

  const clearAllFilters = () => {
    setSelectedChallengeTypes([])
    setSelectedPlatforms([])
    setSelectedMarkets([])
    setSelectedPriceRanges([])
    setSelectedProfitSplits([])
    setSelectedTradingStyles([])
    setSearchQuery('')
  }

  const FilterDropdown = ({ name, label, options, selected, setSelected }: { 
    name: string; label: string; options: string[]; selected: string[]
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  }) => {
    const isOpen = openDropdown === name
    return (
      <div className="relative filter-dropdown-container">
        <button
          onClick={(e) => { e.stopPropagation(); toggleDropdown(name) }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap
            ${selected.length > 0 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'}`}
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
              <label key={option} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleFilter(option, selected, setSelected)}
                  className="w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
        ))}
        <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const renderPlatforms = (platforms: string[] | null) => {
    if (!platforms || platforms.length === 0) return <span className="text-gray-500 text-xs">N/A</span>
    return (
      <div className="flex flex-wrap gap-2">
        {platforms.slice(0, 4).map((platform) => (
          <PlatformLogo key={platform} platform={platform} />
        ))}
        {platforms.length > 4 && (
          <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-medium">
            +{platforms.length - 4}
          </div>
        )}
      </div>
    )
  }

  const renderMarkets = (instruments: string[] | null) => {
    if (!instruments || instruments.length === 0) return <span className="text-gray-500 text-xs">N/A</span>
    return (
      <div className="flex flex-wrap gap-1.5">
        {instruments.slice(0, 5).map((market) => {
          const colorClass = marketColors[market] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          return <span key={market} className={`px-2 py-0.5 ${colorClass} text-xs rounded-md border`}>{market}</span>
        })}
        {instruments.length > 5 && <span className="px-2 py-0.5 text-gray-500 text-xs">+{instruments.length - 5}</span>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Compare <span className="text-emerald-400">Prop Firms</span>
          </h1>
          <p className="text-gray-400">Find the perfect prop firm for your trading style</p>
        </div>

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

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <button onClick={clearAllFilters} className="ml-auto text-sm text-gray-400 hover:text-white flex items-center gap-1">
                <X className="w-4 h-4" /> Clear all
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
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                <Grid className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading prop firms...</p>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFirms.map((firm) => (
              <div key={firm.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all flex flex-col h-full">
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
                  
                  {/* Location with flag image */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    {firm.headquarters && (
                      <span className="flex items-center gap-2">
                        <CountryFlag country={firm.headquarters} />
                        <span>{firm.headquarters}</span>
                      </span>
                    )}
                    {firm.is_regulated && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Shield className="w-3 h-3" /> Regulated
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {firm.challenge_types?.slice(0, 3).map((type) => (
                      <span key={type} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">{type}</span>
                    ))}
                  </div>
                </div>

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
                      <p className="text-gray-500 text-xs uppercase">Max Drawdown</p>
                      <p className="text-white font-semibold">{firm.max_total_drawdown || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Max Allocation</p>
                      <p className="text-yellow-400 font-semibold">{formatMaxAccount(firm.account_sizes)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-xs uppercase mb-2">Trading Platforms</p>
                    {renderPlatforms(firm.platforms)}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-xs uppercase mb-2">Markets</p>
                    {renderMarkets(firm.instruments)}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {firm.allows_scalping && <span className="text-xs text-green-400">✓ Scalping</span>}
                    {firm.allows_news_trading && <span className="text-xs text-green-400">✓ News</span>}
                    {firm.allows_ea && <span className="text-xs text-green-400">✓ EA/Bots</span>}
                    {firm.allows_hedging && <span className="text-xs text-green-400">✓ Hedging</span>}
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 mt-auto">
                  <a
                    href={firm.affiliate_url || firm.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <DollarSign className="w-5 h-5" />
                    Buy Challenge
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && (
          <div className="space-y-4">
            {sortedFirms.map((firm) => (
              <div key={firm.id} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-emerald-500/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 md:w-64">
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

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs uppercase">From</p>
                      <p className="text-white font-semibold">${firm.min_price || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Profit Split</p>
                      <p className="text-emerald-400 font-semibold">{firm.profit_split || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Max Allocation</p>
                      <p className="text-yellow-400 font-semibold">{formatMaxAccount(firm.account_sizes)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Location</p>
                      <p className="text-white font-semibold text-sm flex items-center gap-2">
                        <CountryFlag country={firm.headquarters} />
                        {firm.headquarters || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Platforms</p>
                      {renderPlatforms(firm.platforms)}
                    </div>
                  </div>

                  <div className="md:w-40">
                    <a
                      href={firm.affiliate_url || firm.website_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all text-sm"
                    >
                      <DollarSign className="w-4 h-4" />
                      Buy Challenge
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && sortedFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No prop firms found matching your criteria.</p>
            <button onClick={clearAllFilters} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
