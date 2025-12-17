'use client'

import { samplePropFirms, samplePromotions, getPromotionForFirm } from '@/lib/data'
import { Star, ExternalLink, Clock, Tag, Sparkles } from 'lucide-react'

export default function DealsPage() {
  const firmsWithPromos = samplePropFirms.filter(firm => getPromotionForFirm(firm.id))

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-brand-400 mb-4">
            <Sparkles className="w-4 h-4" />
            Updated Daily
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            🔥 Exclusive Prop Firm Deals
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto">
            Save hundreds on your prop firm challenges with these exclusive discount codes. 
            All codes are verified and updated regularly.
          </p>
        </div>

        {/* Featured Deal */}
        <div className="mb-12">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-emerald-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-white/20 text-white rounded-full mb-4">
                    🏆 BEST DEAL
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Funded Next - 25% OFF
                  </h2>
                  <p className="text-white/80 mb-4">
                    Get 25% off all challenges. Lowest prices in the industry with 90% profit split.
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Expires in 5 days
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      1,234 used today
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                  <div className="px-6 py-3 bg-white/20 rounded-xl">
                    <code className="text-2xl font-bold text-white">FUNDED25</code>
                  </div>
                  <a
                    href="#"
                    className="px-8 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2"
                  >
                    Get This Deal
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Deals Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">All Active Deals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firmsWithPromos.map((firm) => {
              const promo = getPromotionForFirm(firm.id)!
              return (
                <div key={firm.id} className="glass rounded-2xl overflow-hidden hover:border-brand-500/30 transition-all">
                  {/* Promo Header */}
                  <div className="bg-gradient-to-r from-brand-500/20 to-emerald-500/20 px-5 py-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-400">
                      {promo.discount_percent}% OFF
                    </span>
                    <span className="text-xs text-dark-400">
                      Valid until {new Date(promo.valid_until).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-5">
                    {/* Firm Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        {firm.logo_url ? (
                          <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-lg font-bold text-white">{firm.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{firm.name}</h3>
                        {firm.trustpilot_score && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-yellow-400">{firm.trustpilot_score}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Deal Details */}
                    <p className="text-dark-400 text-sm mb-4">{promo.description}</p>

                    {/* Price Comparison */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-dark-500 line-through">${firm.min_price}</span>
                      <span className="text-2xl font-bold text-white">
                        ${Math.round(firm.min_price * (1 - (promo.discount_percent || 0) / 100))}
                      </span>
                      <span className="text-sm text-dark-400">starting price</span>
                    </div>

                    {/* Code & CTA */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 px-4 py-2 bg-white/5 rounded-lg text-center">
                        <code className="text-brand-400 font-semibold">{promo.code}</code>
                      </div>
                      <a
                        href={firm.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-semibold text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                      >
                        Claim
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* No Promo Firms */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">More Prop Firms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {samplePropFirms
              .filter(firm => !getPromotionForFirm(firm.id))
              .map((firm) => (
                <div key={firm.id} className="glass rounded-xl p-4 hover:border-brand-500/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="font-bold text-white">{firm.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">{firm.name}</h3>
                      <p className="text-xs text-dark-400">From ${firm.min_price}</p>
                    </div>
                  </div>
                  <a
                    href={firm.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-3 py-2 text-xs font-medium text-center text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Visit Site
                  </a>
                </div>
              ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">
              Never Miss a Deal 🔔
            </h2>
            <p className="text-dark-400 mb-6">
              Get notified when new discounts drop. We'll only email you the best deals.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-6 py-3 font-semibold text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-xl hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
