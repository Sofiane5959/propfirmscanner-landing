'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Star, ExternalLink, Copy, Check, Shield, TrendingUp,
  DollarSign, Percent, Award, AlertTriangle,
  CheckCircle, XCircle, ChevronRight, Globe
} from 'lucide-react'
import type { PropFirm } from '@/types'

type Props = {
  firm: PropFirm
}

export default function PropFirmPageClient({ firm }: Props) {
  const [copiedCode, setCopiedCode] = useState(false)
  
  // Promo code fictif (à remplacer par les vrais)
  const promoCode = `${firm.name.toUpperCase().replace(/\s/g, '').slice(0, 8)}10`

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(promoCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const getLogoUrl = () => {
    if (firm.logo_url) return firm.logo_url
    return `https://logo.clearbit.com/${firm.website_url?.replace('https://', '').replace('http://', '').split('/')[0]}`
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/compare" className="hover:text-white">Compare</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{firm.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
              <img 
                src={getLogoUrl()} 
                alt={`${firm.name} logo`}
                className="w-20 h-20 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${firm.name}&size=80&background=10b981&color=fff`
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{firm.name}</h1>
                {firm.trustpilot_rating && firm.trustpilot_rating >= 4.5 && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Top Rated
                  </span>
                )}
              </div>

              {/* Rating */}
              {firm.trustpilot_rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(firm.trustpilot_rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{firm.trustpilot_rating}</span>
                  <span className="text-gray-400">on Trustpilot</span>
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>From <span className="text-white font-semibold">${firm.min_price}</span></span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Percent className="w-4 h-4 text-emerald-400" />
                  <span><span className="text-white font-semibold">{firm.profit_split}%</span> Profit Split</span>
                </div>
                {firm.headquarters && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>{firm.headquarters}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="w-full md:w-auto">
              <a
                href={firm.affiliate_link || firm.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Visit {firm.name}
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Overview
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {firm.name} is a {firm.headquarters ? `${firm.headquarters}-based ` : ''}prop trading firm 
                offering traders the opportunity to trade with funded accounts up to ${Math.max(...(firm.account_sizes || [100000])).toLocaleString()}.
                With a {firm.profit_split}% profit split and challenges starting from just ${firm.min_price}, 
                {firm.name} is {firm.trustpilot_rating && firm.trustpilot_rating >= 4 ? 'one of the top-rated firms' : 'a popular choice'} in the industry.
              </p>
            </section>

            {/* Trading Rules */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-emerald-400" />
                Trading Rules
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Profit Target (Phase 1)</div>
                  <div className="text-white text-xl font-bold">{firm.profit_target_phase1 || 8}%</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Profit Target (Phase 2)</div>
                  <div className="text-white text-xl font-bold">{firm.profit_target_phase2 || 5}%</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Max Daily Drawdown</div>
                  <div className="text-white text-xl font-bold">{firm.max_daily_drawdown || 5}%</div>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-gray-400 text-sm mb-1">Max Total Drawdown</div>
                  <div className="text-white text-xl font-bold">{firm.max_total_drawdown || 10}%</div>
                </div>
              </div>
            </section>

            {/* Trading Permissions */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Trading Permissions
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Scalping', allowed: firm.allows_scalping },
                  { label: 'News Trading', allowed: firm.allows_news_trading },
                  { label: 'Weekend Holding', allowed: firm.allows_weekend_holding },
                  { label: 'Hedging', allowed: firm.allows_hedging },
                  { label: 'EA / Bots', allowed: firm.allows_ea },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    {item.allowed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Platforms & Markets */}
            <section className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Platforms & Markets</h2>
              
              <div className="space-y-4">
                {firm.platforms && firm.platforms.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Trading Platforms</div>
                    <div className="flex flex-wrap gap-2">
                      {firm.platforms.map((platform) => (
                        <span key={platform} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {firm.instruments && firm.instruments.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Available Markets</div>
                    <div className="flex flex-wrap gap-2">
                      {firm.instruments.map((instrument) => (
                        <span key={instrument} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm">
                          {instrument}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Promo Code Box */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6">
              <div className="text-center mb-4">
                <span className="text-emerald-400 text-sm font-medium">Exclusive Discount</span>
                <div className="text-3xl font-bold text-white">10% OFF</div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 px-4 py-3 bg-gray-900 border border-dashed border-gray-600 rounded-lg text-center">
                  <code className="text-emerald-400 font-mono font-semibold tracking-wider">
                    {promoCode}
                  </code>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors"
                >
                  {copiedCode ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              <a
                href={firm.affiliate_link || firm.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Claim Discount
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Facts */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Facts</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Price</span>
                  <span className="text-white font-semibold">${firm.min_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit Split</span>
                  <span className="text-white font-semibold">{firm.profit_split}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Challenge Types</span>
                  <span className="text-white font-semibold">{firm.challenge_types?.join(', ') || '2-step'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Account</span>
                  <span className="text-white font-semibold">${Math.max(...(firm.account_sizes || [100000])).toLocaleString()}</span>
                </div>
                {firm.min_trading_days !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Trading Days</span>
                    <span className="text-white font-semibold">{firm.min_trading_days} days</span>
                  </div>
                )}
              </div>
            </div>

            {/* Compare CTA */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Compare with Others</h3>
              <p className="text-gray-400 text-sm mb-4">See how {firm.name} stacks up against other prop firms.</p>
              <Link
                href="/compare"
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Compare Prop Firms
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
