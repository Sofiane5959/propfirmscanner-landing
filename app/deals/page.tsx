'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getPromotions } from '@/lib/supabase-queries'
import type { Promotion } from '@/types'

export default function DealsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPromotions() {
      setLoading(true)
      const data = await getPromotions()
      setPromotions(data)
      setLoading(false)
    }
    fetchPromotions()
  }, [])

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  // Get the best deal (highest discount)
  const bestDeal = promotions[0]

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔥 Hot Deals & Promo Codes
            </h1>
            <p className="text-gray-400 text-lg">
              Save money on prop firm challenges with our exclusive discount codes.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          )}

          {/* Featured Deal */}
          {!loading && bestDeal && (
            <div className="mb-12 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-2xl p-8 border border-emerald-500/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full mb-4">
                    🏆 BEST DEAL
                  </span>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {bestDeal.discount_percent}% OFF at {bestDeal.prop_firms?.name}
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {bestDeal.description}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-gray-900 rounded-xl px-8 py-4 border-2 border-dashed border-emerald-500">
                    <p className="text-emerald-400 font-mono text-2xl font-bold">
                      {bestDeal.code}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bestDeal.code)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    {copiedCode === bestDeal.code ? '✓ Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* All Promotions */}
          {!loading && promotions.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-white mb-6">
                All Active Promotions ({promotions.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-lg font-bold text-emerald-400">
                            {promo.prop_firms?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {promo.prop_firms?.name || 'Unknown'}
                            </h3>
                            {promo.prop_firms?.trustpilot_rating && (
                              <p className="text-sm text-gray-400">
                                ⭐ {promo.prop_firms.trustpilot_rating.toFixed(1)} rating
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-emerald-400">
                            {promo.discount_percent}%
                          </span>
                          <p className="text-gray-400 text-sm">OFF</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300">
                        {promo.description}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Promo Code */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 bg-gray-900 rounded-lg px-4 py-3 border border-gray-700">
                          <p className="text-emerald-400 font-mono font-semibold text-center">
                            {promo.code}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(promo.code)}
                          className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          {copiedCode === promo.code ? (
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Price Info */}
                      {promo.prop_firms?.min_price && (
                        <div className="flex items-center justify-between text-sm mb-4">
                          <span className="text-gray-400">Starting price:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 line-through">
                              ${promo.prop_firms.min_price}
                            </span>
                            <span className="text-emerald-400 font-semibold">
                              ${Math.round(promo.prop_firms.min_price * (1 - (promo.discount_percent || 0) / 100))}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Expiry */}
                      {promo.valid_until && (
                        <p className="text-sm text-gray-500 text-center">
                          Expires: {new Date(promo.valid_until).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                      <a
                        href={promo.prop_firms?.website_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors"
                      >
                        Get This Deal →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* No Promotions */}
          {!loading && promotions.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No active promotions at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon for new deals!</p>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-16 bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">💡 Tips for Using Promo Codes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Copy the code</h3>
                  <p className="text-gray-400 text-sm">Click the copy button to save the promo code to your clipboard.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Visit the firm</h3>
                  <p className="text-gray-400 text-sm">Click "Get This Deal" to go to the prop firm's website.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Apply at checkout</h3>
                  <p className="text-gray-400 text-sm">Paste the code during checkout to get your discount.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
