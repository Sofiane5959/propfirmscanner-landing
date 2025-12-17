'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PropFirmCard } from '@/components/compare/PropFirmCard'
import { FilterSidebar } from '@/components/compare/FilterSidebar'
import { getPropFirms, filterPropFirms } from '@/lib/supabase-queries'
import type { PropFirm, FilterOptions } from '@/types'

export default function ComparePage() {
  const [firms, setFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({})

  // Fetch prop firms on load
  useEffect(() => {
    async function fetchFirms() {
      setLoading(true)
      const data = await getPropFirms()
      setFirms(data)
      setLoading(false)
    }
    fetchFirms()
  }, [])

  // Apply filters
  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setLoading(true)
    
    // If no filters, get all firms
    if (Object.keys(newFilters).every(key => !newFilters[key as keyof FilterOptions])) {
      const data = await getPropFirms()
      setFirms(data)
    } else {
      const data = await filterPropFirms(newFilters)
      setFirms(data)
    }
    setLoading(false)
  }

  // Sort firms
  const sortedFirms = [...firms].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
      case 'price-low':
        return (a.min_price || 0) - (b.min_price || 0)
      case 'price-high':
        return (b.min_price || 0) - (a.min_price || 0)
      case 'profit-split':
        return (b.profit_split || 0) - (a.profit_split || 0)
      case 'founded':
        return (a.founded_year || 2024) - (b.founded_year || 2024)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Compare Prop Firms
            </h1>
            <p className="text-gray-400 text-lg">
              Find the perfect prop firm for your trading style. Compare {firms.length} verified firms.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <FilterSidebar 
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full py-3 px-4 bg-gray-800 rounded-lg text-white flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              
              {showFilters && (
                <div className="mt-4">
                  <FilterSidebar 
                    onFilterChange={handleFilterChange}
                    filters={filters}
                  />
                </div>
              )}
            </div>

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
                    className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="profit-split">Profit Split</option>
                    <option value="founded">Most Established</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
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
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No prop firms match your filters.</p>
                  <button
                    onClick={() => handleFilterChange({})}
                    className="mt-4 text-emerald-500 hover:text-emerald-400"
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

      <Footer />
    </div>
  )
}
