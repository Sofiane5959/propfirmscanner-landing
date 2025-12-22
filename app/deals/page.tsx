'use client'

import { useState } from 'react'
import { Search, Tag, Copy, Check, ExternalLink, Clock, Gift } from 'lucide-react'

// Deals data - Tu peux modifier ces valeurs ou les connecter à Supabase plus tard
const DEALS = [
  {
    id: '1',
    firmName: 'FTMO',
    code: 'SCANNER10',
    discount: '10% OFF',
    description: 'Get 10% off your first FTMO challenge. Valid for all account sizes.',
    url: 'https://ftmo.com',
    validUntil: '2025-01-31',
    category: 'Forex',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    firmName: 'Goat Funded Trader',
    code: 'PROPFIRM15',
    discount: '15% OFF',
    description: 'Exclusive 15% discount on all challenge accounts. Limited time offer!',
    url: 'https://goatfundedtrader.com',
    validUntil: '2025-01-15',
    category: 'Forex',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: '3',
    firmName: 'FundedNext',
    code: 'SCANNER20',
    discount: '20% OFF',
    description: 'Special 20% off for PropFirmScanner community members.',
    url: 'https://fundednext.com',
    validUntil: '2025-01-20',
    category: 'Forex',
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: '4',
    firmName: 'FXIFY',
    code: 'FXIFY10',
    discount: '10% OFF',
    description: '10% off all evaluation programs. Use at checkout.',
    url: 'https://fxify.com',
    validUntil: '2025-02-28',
    category: 'Forex',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: '5',
    firmName: 'E8 Funding',
    code: 'E8DEAL',
    discount: '8% OFF',
    description: 'Exclusive 8% discount code for new traders.',
    url: 'https://e8funding.com',
    validUntil: '2025-01-31',
    category: 'Forex',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: '6',
    firmName: 'Topstep',
    code: 'FUTURES50',
    discount: '50% OFF',
    description: '50% off your first Trading Combine. Best futures deal!',
    url: 'https://topstep.com',
    validUntil: '2025-01-31',
    category: 'Futures',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: '7',
    firmName: 'Apex Trader Funding',
    code: 'APEX80',
    discount: '80% OFF',
    description: 'Massive 80% discount on evaluation accounts!',
    url: 'https://apextraderfunding.com',
    validUntil: '2025-01-10',
    category: 'Futures',
    color: 'from-red-500 to-orange-600',
  },
  {
    id: '8',
    firmName: 'The5ers',
    code: 'FIVE10',
    discount: '10% OFF',
    description: '10% off instant funding and bootcamp programs.',
    url: 'https://the5ers.com',
    validUntil: '2025-02-15',
    category: 'Forex',
    color: 'from-indigo-500 to-purple-600',
  },
]

const CATEGORIES = ['All', 'Forex', 'Futures', 'Crypto']

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filter deals
  const filteredDeals = DEALS.filter(deal => {
    const matchesSearch = deal.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            Updated Daily
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Exclusive <span className="text-emerald-400">Deals & Promos</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Save money on prop firm challenges with our exclusive discount codes. 
            We negotiate special deals so you don&apos;t have to pay full price.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
            <div className="text-2xl font-bold text-emerald-400">{DEALS.length}</div>
            <div className="text-gray-400 text-sm">Active Deals</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
            <div className="text-2xl font-bold text-emerald-400">Up to 80%</div>
            <div className="text-gray-400 text-sm">Max Discount</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center">
            <div className="text-2xl font-bold text-amber-400">$50K+</div>
            <div className="text-gray-400 text-sm">Saved by Users</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl
                         text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-3 rounded-xl font-medium transition-all
                  ${selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No deals found matching your criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => {
              const daysLeft = getDaysRemaining(deal.validUntil)
              const isExpiringSoon = daysLeft <= 7 && daysLeft > 0

              return (
                <div
                  key={deal.id}
                  className="group relative bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden
                             hover:border-emerald-500/50 transition-all duration-300"
                >
                  {/* Expiring soon badge */}
                  {isExpiringSoon && (
                    <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-red-500/20 border border-red-500/30 
                                    rounded-md text-red-400 text-xs font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysLeft} days left
                    </div>
                  )}

                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${deal.color} p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                        {deal.firmName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{deal.firmName}</h3>
                        <div className="text-white/80 text-sm">{deal.category}</div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Discount badge */}
                    <div className="inline-flex px-3 py-1 bg-emerald-500/20 text-emerald-400 text-lg font-bold rounded-lg mb-3">
                      {deal.discount}
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4">{deal.description}</p>

                    {/* Promo Code */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 px-4 py-3 bg-gray-900 border border-dashed border-gray-600 rounded-xl">
                        <code className="text-emerald-400 font-mono font-bold tracking-wider text-lg">
                          {deal.code}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(deal.id, deal.code)}
                        className="p-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 rounded-xl 
                                   transition-colors"
                      >
                        {copiedId === deal.id ? (
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
                      className={`w-full py-3 bg-gradient-to-r ${deal.color}
                                 text-white font-semibold rounded-xl hover:opacity-90 
                                 transition-all flex items-center justify-center gap-2`}
                    >
                      Claim Deal
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Valid until */}
                    <p className="text-gray-500 text-xs text-center mt-3">
                      Valid until {new Date(deal.validUntil).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="p-8 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-gray-700 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              Want More Exclusive Deals?
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter and be the first to know about new discounts.
            </p>
            <a
              href="/#newsletter"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold 
                         rounded-xl transition-colors"
            >
              <Tag className="w-5 h-5" />
              Subscribe for Deals
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
