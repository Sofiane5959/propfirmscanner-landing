'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Search, Star, ChevronDown, ChevronUp, Filter, X, 
  DollarSign, ExternalLink, CheckCircle, XCircle, SlidersHorizontal
} from 'lucide-react'
import TopPicksCarousel from '@/components/TopPicksCarousel'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url?: string
  website_url?: string
  affiliate_url?: string
  trustpilot_rating?: number
  trustpilot_reviews?: number
  min_price?: number
  max_price?: number
  profit_split?: number
  max_daily_drawdown?: number
  max_total_drawdown?: number
  profit_target_phase1?: number
  profit_target_phase2?: number
  min_trading_days?: number
  max_trading_days?: number
  account_sizes?: number[]
  platforms?: string[]
  instruments?: string[]
  allows_scalping?: boolean
  allows_news_trading?: boolean
  allows_weekend_holding?: boolean
  allows_ea?: boolean
  allows_hedging?: boolean
  has_free_repeat?: boolean
  has_instant_funding?: boolean
  country?: string
  year_founded?: number
}

interface ComparePageClientProps {
  firms: PropFirm[]
}

type SortOption = 'rating' | 'price_low' | 'price_high' | 'profit_split' | 'name'

export default function ComparePageClient({ firms }: ComparePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 1000,
    minProfitSplit: 0,
    allowsScalping: false,
    allowsNewsTrading: false,
    allowsEA: false,
    allowsWeekendHolding: false,
    hasInstantFunding: false,
  })

  // Filter and sort firms
  const filteredFirms = useMemo(() => {
    let result = [...firms]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(firm => 
        firm.name?.toLowerCase().includes(query) ||
        firm.country?.toLowerCase().includes(query)
      )
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(firm => (firm.trustpilot_rating || 0) >= filters.minRating)
    }

    // Price filter
    if (filters.maxPrice < 1000) {
      result = result.filter(firm => (firm.min_price || 0) <= filters.maxPrice)
    }

    // Profit split filter
    if (filters.minProfitSplit > 0) {
      result = result.filter(firm => (firm.profit_split || 0) >= filters.minProfitSplit)
    }

    // Boolean filters
    if (filters.allowsScalping) {
      result = result.filter(firm => firm.allows_scalping)
    }
    if (filters.allowsNewsTrading) {
      result = result.filter(firm => firm.allows_news_trading)
    }
    if (filters.allowsEA) {
      result = result.filter(firm => firm.allows_ea)
    }
    if (filters.allowsWeekendHolding) {
      result = result.filter(firm => firm.allows_weekend_holding)
    }
    if (filters.hasInstantFunding) {
      result = result.filter(firm => firm.has_instant_funding)
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
        break
      case 'price_low':
        result.sort((a, b) => (a.min_price || 999) - (b.min_price || 999))
        break
      case 'price_high':
        result.sort((a, b) => (b.min_price || 0) - (a.min_price || 0))
        break
      case 'profit_split':
        result.sort((a, b) => (b.profit_split || 0) - (a.profit_split || 0))
        break
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
    }

    return result
  }, [firms, searchQuery, sortBy, filters])

  const activeFiltersCount = Object.values(filters).filter(v => v !== 0 && v !== false && v !== 1000).length

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      maxPrice: 1000,
      minProfitSplit: 0,
      allowsScalping: false,
      allowsNewsTrading: false,
      allowsEA: false,
      allowsWeekendHolding: false,
      hasInstantFunding: false,
    })
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Compare <span className="text-emerald-400">Prop Firms</span>
          </h1>
          <p className="text-gray-400">
            {firms.length} prop firms • Updated daily
          </p>
        </div>

        {/* Top Picks Carousel */}
        <TopPicksCarousel firms={firms} />

        {/* Search and Filters Bar */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prop firms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="rating">Sort by: Rating</option>
              <option value="price_low">Sort by: Price (Low)</option>
              <option value="price_high">Sort by: Price (High)</option>
              <option value="profit_split">Sort by: Profit Split</option>
              <option value="name">Sort by: Name</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-white text-emerald-500 rounded-full text-xs flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Min Rating */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Min Rating</label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters(f => ({ ...f, minRating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                  >
                    <option value={0}>Any</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Max Price</label>
                  <select
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                  >
                    <option value={1000}>Any</option>
                    <option value={50}>Under $50</option>
                    <option value={100}>Under $100</option>
                    <option value={200}>Under $200</option>
                    <option value={500}>Under $500</option>
                  </select>
                </div>

                {/* Min Profit Split */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Min Profit Split</label>
                  <select
                    value={filters.minProfitSplit}
                    onChange={(e) => setFilters(f => ({ ...f, minProfitSplit: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
                  >
                    <option value={0}>Any</option>
                    <option value={80}>80%+</option>
                    <option value={85}>85%+</option>
                    <option value={90}>90%+</option>
                  </select>
                </div>

                {/* Toggle Filters */}
                <div className="col-span-2 md:col-span-3 flex flex-wrap gap-2">
                  {[
                    { key: 'allowsScalping', label: 'Scalping' },
                    { key: 'allowsNewsTrading', label: 'News Trading' },
                    { key: 'allowsEA', label: 'EA/Bots' },
                    { key: 'allowsWeekendHolding', label: 'Weekend Hold' },
                    { key: 'hasInstantFunding', label: 'Instant Funding' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters[key as keyof typeof filters]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-4 text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Reset all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredFirms.length}</span> prop firms
          </p>
        </div>

        {/* Firms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFirms.map((firm) => (
            <FirmCard key={firm.id} firm={firm} />
          ))}
        </div>

        {/* No Results */}
        {filteredFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No prop firms match your filters</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Firm Card Component
function FirmCard({ firm }: { firm: PropFirm }) {
  const maxAccount = firm.account_sizes?.length 
    ? Math.max(...firm.account_sizes) 
    : 100000

  return (
    <div className="bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 rounded-xl p-5 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1">
            {firm.logo_url ? (
              <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl font-bold text-emerald-600">{firm.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">
              {firm.name}
            </h3>
            {firm.trustpilot_rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{firm.trustpilot_rating}</span>
                {firm.trustpilot_reviews && (
                  <span className="text-gray-500 text-sm">({firm.trustpilot_reviews.toLocaleString()})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500 uppercase">From</p>
          <p className="text-lg font-bold text-white">${firm.min_price || 99}</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500 uppercase">Split</p>
          <p className="text-lg font-bold text-emerald-400">{firm.profit_split || 80}%</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500 uppercase">Max</p>
          <p className="text-lg font-bold text-white">${(maxAccount / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {firm.allows_scalping && (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">✓ Scalping</span>
        )}
        {firm.allows_news_trading && (
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">✓ News</span>
        )}
        {firm.allows_ea && (
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">✓ EA</span>
        )}
        {firm.has_instant_funding && (
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">⚡ Instant</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <a
          href={firm.affiliate_url || firm.website_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
        >
          <DollarSign className="w-4 h-4" />
          Buy Challenge
        </a>
        <Link
          href={`/prop-firm/${firm.slug}`}
          className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  )
}
