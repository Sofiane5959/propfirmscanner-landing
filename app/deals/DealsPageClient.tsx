'use client'

import { useState } from 'react'
import { Search, Tag, Copy, Check, ExternalLink, Clock, Percent } from 'lucide-react'

const DEALS = [
  {
    id: 1,
    firm: 'FTMO',
    code: 'SCANNER10',
    discount: 10,
    description: 'Get 10% off your first challenge',
    url: 'https://ftmo.com',
    color: 'from-blue-500 to-blue-600',
    category: 'forex',
    expiresAt: '2026-03-31',
  },
  {
    id: 2,
    firm: 'Goat Funded Trader',
    code: 'PROPFIRM15',
    discount: 15,
    description: 'Exclusive 15% discount on all challenges',
    url: 'https://goatfundedtrader.com',
    color: 'from-amber-500 to-orange-600',
    category: 'forex',
    expiresAt: '2026-02-28',
  },
  {
    id: 3,
    firm: 'FundedNext',
    code: 'SCANNER20',
    discount: 20,
    description: 'Special 20% off for our community',
    url: 'https://fundednext.com',
    color: 'from-emerald-500 to-green-600',
    category: 'forex',
    expiresAt: '2026-04-15',
  },
  {
    id: 4,
    firm: 'FXIFY',
    code: 'FXIFY10',
    discount: 10,
    description: '10% off all evaluation programs',
    url: 'https://fxify.com',
    color: 'from-purple-500 to-violet-600',
    category: 'forex',
    expiresAt: '2026-03-15',
  },
  {
    id: 5,
    firm: 'E8 Funding',
    code: 'E8DEAL',
    discount: 8,
    description: 'Exclusive 8% discount code',
    url: 'https://e8funding.com',
    color: 'from-cyan-500 to-blue-600',
    category: 'forex',
    expiresAt: '2026-02-15',
  },
  {
    id: 6,
    firm: 'Topstep',
    code: 'TOPSTEP50',
    discount: 50,
    description: '50% off futures trading challenges',
    url: 'https://topstep.com',
    color: 'from-green-500 to-emerald-600',
    category: 'futures',
    expiresAt: '2026-03-01',
  },
  {
    id: 7,
    firm: 'Apex Trader',
    code: 'APEX80',
    discount: 80,
    description: 'Massive 80% off evaluation',
    url: 'https://apextraderfunding.com',
    color: 'from-red-500 to-rose-600',
    category: 'futures',
    expiresAt: '2026-02-20',
  },
  {
    id: 8,
    firm: 'The5ers',
    code: 'FIVE20',
    discount: 20,
    description: '20% off instant funding program',
    url: 'https://the5ers.com',
    color: 'from-indigo-500 to-purple-600',
    category: 'forex',
    expiresAt: '2026-04-01',
  },
]

export default function DealsPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredDeals = DEALS.filter(deal => {
    const matchesSearch = deal.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date()
    const expires = new Date(expiresAt)
    const diff = Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const maxDiscount = Math.max(...DEALS.map(d => d.discount))
  const totalDeals = DEALS.length

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prop Firm <span className="text-emerald-400">Deals & Discounts</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Exclusive discount codes for top prop firms. Save up to {maxDiscount}% on your trading challenge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{totalDeals}</div>
            <div className="text-gray-400 text-sm">Active Deals</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{maxDiscount}%</div>
            <div className="text-gray-400 text-sm">Max Discount</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">$500+</div>
            <div className="text-gray-400 text-sm">Potential Savings</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'forex', 'futures', 'crypto'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize
                  ${selectedCategory === cat
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDeals.map((deal) => {
            const daysRemaining = getDaysRemaining(deal.expiresAt)
            const isExpiringSoon = daysRemaining <= 7

            return (
              <div
                key={deal.id}
                className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 transition-all"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${deal.color} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="w-5 h-5 text-white" />
                      <span className="text-white font-bold text-xl">{deal.discount}% OFF</span>
                    </div>
                    {isExpiringSoon && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {daysRemaining}d left
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${deal.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {deal.firm.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{deal.firm}</h3>
                      <p className="text-gray-400 text-sm">{deal.description}</p>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 px-4 py-3 bg-gray-900 border border-dashed border-gray-600 rounded-lg">
                      <code className="text-emerald-400 font-mono font-semibold tracking-wider">
                        {deal.code}
                      </code>
                    </div>
                    <button
                      onClick={() => handleCopy(deal.code)}
                      className="p-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                    >
                      {copiedCode === deal.code ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* CTA */}
                  <a
                    href={deal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 bg-gradient-to-r ${deal.color} text-white font-semibold 
                               rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                  >
                    Claim Deal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* No results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No deals found matching your search.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Never Miss a Deal! 🔥</h2>
          <p className="text-gray-400 mb-6">Subscribe to get exclusive discount codes delivered to your inbox.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Subscribe for Free
          </a>
        </div>
      </div>
    </div>
  )
}
