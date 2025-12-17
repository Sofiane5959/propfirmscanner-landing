'use client'

import { useState, useMemo } from 'react'
import { PropFirmCard } from '@/components/compare/PropFirmCard'
import { FilterSidebar } from '@/components/compare/FilterSidebar'
import { samplePropFirms } from '@/lib/data'
import { FilterState, PropFirm } from '@/types'
import { SlidersHorizontal, X, LayoutGrid, List } from 'lucide-react'

const initialFilters: FilterState = {
  priceRange: [0, 1500],
  challengeTypes: [],
  tradingStyles: [],
  platforms: [],
  minProfitSplit: 0,
  maxDrawdown: 15,
  sortBy: 'popularity',
  sortOrder: 'desc',
}

export default function ComparePage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredFirms = useMemo(() => {
    let result = [...samplePropFirms]

    // Filter by price
    result = result.filter(
      (firm) => firm.min_price >= filters.priceRange[0] && firm.min_price <= filters.priceRange[1]
    )

    // Filter by challenge type
    if (filters.challengeTypes.length > 0) {
      result = result.filter((firm) =>
        filters.challengeTypes.some((type) => firm.challenge_types.includes(type as any))
      )
    }

    // Filter by trading styles
    if (filters.tradingStyles.includes('scalping')) {
      result = result.filter((firm) => firm.allows_scalping)
    }
    if (filters.tradingStyles.includes('news')) {
      result = result.filter((firm) => firm.allows_news_trading)
    }
    if (filters.tradingStyles.includes('swing')) {
      result = result.filter((firm) => firm.allows_weekend_holding)
    }

    // Filter by platforms
    if (filters.platforms.length > 0) {
      result = result.filter((firm) =>
        filters.platforms.some((platform) => firm.platforms.includes(platform))
      )
    }

    // Filter by profit split
    result = result.filter((firm) => firm.profit_split >= filters.minProfitSplit)

    // Filter by max drawdown
    result = result.filter((firm) => firm.max_total_drawdown <= filters.maxDrawdown)

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'price':
          comparison = a.min_price - b.min_price
          break
        case 'profit_split':
          comparison = b.profit_split - a.profit_split
          break
        case 'rating':
          comparison = (b.trustpilot_score || 0) - (a.trustpilot_score || 0)
          break
        case 'popularity':
        default:
          comparison = (b.trustpilot_reviews || 0) - (a.trustpilot_reviews || 0)
      }
      return filters.sortOrder === 'desc' ? comparison : -comparison
    })

    return result
  }, [filters])

  const resetFilters = () => setFilters(initialFilters)

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1500) count++
    if (filters.challengeTypes.length > 0) count++
    if (filters.tradingStyles.length > 0) count++
    if (filters.platforms.length > 0) count++
    if (filters.minProfitSplit > 0) count++
    if (filters.maxDrawdown < 15) count++
    return count
  }, [filters])

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Compare Prop Firms
          </h1>
          <p className="text-dark-400">
            Find the perfect prop firm for your trading style. Use filters to narrow down your options.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 glass rounded-xl p-4">
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-brand-500 text-xs flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <span className="text-dark-400 text-sm">
                  {filteredFirms.length} prop firm{filteredFirms.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']]
                    setFilters({ ...filters, sortBy, sortOrder })
                  }}
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="popularity-desc">Most Popular</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="profit_split-desc">Highest Profit Split</option>
                </select>

                {/* View mode toggle */}
                <div className="hidden sm:flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white/10 text-white' : 'text-dark-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            {filteredFirms.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredFirms.map((firm) => (
                  <PropFirmCard key={firm.id} firm={firm} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <p className="text-dark-400 text-lg mb-4">No prop firms match your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 text-sm font-medium text-brand-400 border border-brand-400/30 rounded-lg hover:bg-brand-400/10 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-dark-900 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                onReset={resetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
