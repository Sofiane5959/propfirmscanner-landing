'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Tag, Percent, Clock, ExternalLink, Copy, Check,
  Filter, X, AlertCircle, Calendar, Search, Star
} from 'lucide-react'

// Types
interface Deal {
  id: string
  firmName: string
  firmSlug: string
  code: string
  discount: string
  discountPercent: number
  description: string
  expiresAt: string | null
  markets: string[]
  verified: boolean
  featured: boolean
}

// Sample data - replace with your actual data source
const SAMPLE_DEALS: Deal[] = [
  {
    id: '1',
    firmName: 'FTMO',
    firmSlug: 'ftmo',
    code: 'SCANNER10',
    discount: '10% off',
    discountPercent: 10,
    description: 'All challenge types',
    expiresAt: null,
    markets: ['Forex', 'Indices', 'Crypto'],
    verified: true,
    featured: true,
  },
  {
    id: '2',
    firmName: 'FundedNext',
    firmSlug: 'fundednext',
    code: 'PROPFIRM15',
    discount: '15% off',
    discountPercent: 15,
    description: 'All evaluations',
    expiresAt: '2026-01-31',
    markets: ['Forex', 'Indices'],
    verified: true,
    featured: true,
  },
  {
    id: '3',
    firmName: 'Apex Trader Funding',
    firmSlug: 'apex-trader-funding',
    code: 'APEX80',
    discount: '80% off',
    discountPercent: 80,
    description: 'Limited time offer',
    expiresAt: '2026-01-15',
    markets: ['Futures'],
    verified: true,
    featured: false,
  },
  // Add more deals...
]

// Filter options
const MARKET_FILTERS = ['All', 'Forex', 'Futures', 'Crypto', 'Indices']
const DISCOUNT_FILTERS = [
  { label: 'All', min: 0, max: 100 },
  { label: '10%+', min: 10, max: 100 },
  { label: '20%+', min: 20, max: 100 },
  { label: '50%+', min: 50, max: 100 },
]

export default function DealsPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [deals] = useState<Deal[]>(SAMPLE_DEALS)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get filters from URL
  const marketFilter = searchParams.get('market') || 'All'
  const discountFilter = searchParams.get('discount') || 'All'

  // Update URL when filters change
  const setFilter = (type: 'market' | 'discount', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'All') {
      params.delete(type)
    } else {
      params.set(type, value)
    }
    
    router.push(`/deals?${params.toString()}`, { scroll: false })
  }

  // Clear all filters
  const clearFilters = () => {
    router.push('/deals', { scroll: false })
    setSearchQuery('')
  }

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    // Market filter
    if (marketFilter !== 'All' && !deal.markets.includes(marketFilter)) {
      return false
    }
    
    // Discount filter
    const discountOption = DISCOUNT_FILTERS.find(f => f.label === discountFilter)
    if (discountOption && deal.discountPercent < discountOption.min) {
      return false
    }
    
    // Search filter
    if (searchQuery && !deal.firmName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

  // Sort: featured first, then by discount
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.discountPercent - a.discountPercent
  })

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const hasActiveFilters = marketFilter !== 'All' || discountFilter !== 'All' || searchQuery

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            <Tag className="w-4 h-4" />
            Exclusive Codes
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Prop Firm Deals & Discounts</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Save up to 80% with our verified discount codes. Updated weekly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search prop firms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="mb-8">
          {/* Market Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
            <span className="text-gray-400 text-sm mr-2">Market:</span>
            {MARKET_FILTERS.map(market => (
              <button
                key={market}
                onClick={() => setFilter('market', market)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  marketFilter === market
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {market}
              </button>
            ))}
          </div>

          {/* Discount Filters */}
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-gray-400 text-sm mr-2">Discount:</span>
            {DISCOUNT_FILTERS.map(option => (
              <button
                key={option.label}
                onClick={() => setFilter('discount', option.label)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  discountFilter === option.label
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white text-sm"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-medium">{sortedDeals.length}</span> deals
          </p>
          <p className="text-gray-500 text-sm">
            Last updated: Dec 27, 2025
          </p>
        </div>

        {/* Deals Grid */}
        {sortedDeals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDeals.map(deal => (
              <div
                key={deal.id}
                className={`bg-gray-800/50 border rounded-xl p-6 relative ${
                  deal.featured ? 'border-emerald-500/30' : 'border-gray-700'
                }`}
              >
                {/* Featured Badge */}
                {deal.featured && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}

                {/* Firm Info */}
                <div className="flex items-center justify-between mb-4">
                  <Link 
                    href={`/prop-firm/${deal.firmSlug}`}
                    className="text-lg font-semibold text-white hover:text-emerald-400"
                  >
                    {deal.firmName}
                  </Link>
                  {deal.verified && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Discount */}
                <div className="flex items-center gap-2 mb-4">
                  <Percent className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-400">{deal.discount}</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{deal.description}</p>

                {/* Markets */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {deal.markets.map(market => (
                    <span
                      key={market}
                      className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      {market}
                    </span>
                  ))}
                </div>

                {/* Expiry */}
                {deal.expiresAt && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    Expires: {new Date(deal.expiresAt).toLocaleDateString()}
                  </div>
                )}

                {/* Code + Copy Button */}
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-900 rounded-lg text-emerald-400 font-mono text-center">
                    {deal.code}
                  </code>
                  <button
                    onClick={() => copyCode(deal.code)}
                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1"
                  >
                    {copiedCode === deal.code ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Visit Site Link */}
                <Link
                  href={`/prop-firm/${deal.firmSlug}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:border-emerald-500 hover:text-emerald-400 text-sm"
                >
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No deals found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Report Expired Code */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
          <h3 className="text-white font-semibold mb-2">Found an expired code?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Help us keep our deals up-to-date by reporting expired or invalid codes.
          </p>
          <a
            href="mailto:deals@propfirmscanner.org?subject=Expired%20Code%20Report"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:border-emerald-500 hover:text-emerald-400"
          >
            <AlertCircle className="w-4 h-4" />
            Report Expired Code
          </a>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Some links are affiliate links. See our{' '}
            <Link href="/how-we-make-money" className="text-emerald-400 hover:underline">
              affiliate disclosure
            </Link>
            . Terms apply to all deals.
          </p>
        </div>
      </div>
    </div>
  )
}
