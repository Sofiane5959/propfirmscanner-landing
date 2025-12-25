'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Star, Check, ChevronDown, SlidersHorizontal } from 'lucide-react'
import TopPicksCarousel from '@/components/TopPicksCarousel'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  min_price: number
  profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  account_sizes: number[]
  platforms: string[]
}

interface ComparePageClientProps {
  firms: PropFirm[]
}

type SortOption = 'rating' | 'price-low' | 'price-high' | 'profit-split' | 'name'

export default function ComparePageClient({ firms }: ComparePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    minProfitSplit: 0,
    allowsScalping: false,
    allowsNewsTrading: false,
    allowsEA: false,
    allowsWeekendHolding: false,
  })

  // Filter and sort firms
  const filteredFirms = useMemo(() => {
    let result = [...firms]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(firm =>
        firm.name.toLowerCase().includes(query) ||
        firm.platforms?.some(p => p.toLowerCase().includes(query))
      )
    }

    // Price filter
    result = result.filter(firm =>
      firm.min_price >= filters.minPrice &&
      firm.min_price <= filters.maxPrice
    )

    // Profit split filter
    result = result.filter(firm => firm.profit_split >= filters.minProfitSplit)

    // Trading style filters
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

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
        break
      case 'price-low':
        result.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
        break
      case 'price-high':
        result.sort((a, b) => (b.min_price || 0) - (a.min_price || 0))
        break
      case 'profit-split':
        result.sort((a, b) => (b.profit_split || 0) - (a.profit_split || 0))
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [firms, searchQuery, sortBy, filters])

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 1000,
      minProfitSplit: 0,
      allowsScalping: false,
      allowsNewsTrading: false,
      allowsEA: false,
      allowsWeekendHolding: false,
    })
    setSearchQuery('')
    setSortBy('rating')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Compare <span className="text-blue-500">{firms.length}+</span> Prop Firms
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find the perfect prop firm for your trading style. Compare prices, profit splits, 
            rules, and more in one place.
          </p>
        </div>

        {/* Top 10 Carousel */}
        <TopPicksCarousel firms={firms} />

        {/* Search and Filters Bar */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prop firms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none w-full md:w-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="profit-split">Best Profit Split</option>
                <option value="name">Name A-Z</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                showFilters
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Max Price</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$0</span>
                    <span className="text-blue-400 font-medium">${filters.maxPrice}</span>
                  </div>
                </div>

                {/* Profit Split */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Min Profit Split</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.minProfitSplit}
                    onChange={(e) => setFilters({ ...filters, minProfitSplit: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="text-green-400 font-medium">{filters.minProfitSplit}%</span>
                  </div>
                </div>

                {/* Trading Style Filters */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-3">Trading Style</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'allowsScalping', label: 'Scalping' },
                      { key: 'allowsNewsTrading', label: 'News Trading' },
                      { key: 'allowsEA', label: 'EAs/Bots' },
                      { key: 'allowsWeekendHolding', label: 'Weekend Holding' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setFilters({ ...filters, [key]: !filters[key as keyof typeof filters] })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          filters[key as keyof typeof filters]
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredFirms.length}</span> prop firms
          </p>
        </div>

        {/* Firms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFirms.map((firm) => (
            <Link
              key={firm.id}
              href={`/prop-firm/${firm.slug}`}
              className="group"
            >
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden">
                    {firm.logo_url ? (
                      <Image
                        src={firm.logo_url}
                        alt={firm.name}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">
                        {firm.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-gray-700 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-semibold text-sm">
                      {(firm.trustpilot_rating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {firm.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {(firm.trustpilot_reviews || 0).toLocaleString()} reviews
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                    <p className="text-white font-bold">${firm.min_price || 0}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Profit Split</p>
                    <p className="text-green-400 font-bold">{firm.profit_split || 0}%</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {firm.allows_scalping && (
                    <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" /> Scalping
                    </span>
                  )}
                  {firm.allows_news_trading && (
                    <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" /> News
                    </span>
                  )}
                  {firm.allows_ea && (
                    <span className="flex items-center gap-1 text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" /> EAs
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredFirms.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No prop firms found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
