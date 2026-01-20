'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  X,
  Globe,
  Calendar,
  MapPin,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Target,
  AlertTriangle,
  ChevronRight,
  Heart,
  Share2,
} from 'lucide-react'

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
  max_profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  min_trading_days: number
  time_limit: string
  drawdown_type: string
  payout_frequency: string
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  has_free_repeat: boolean
  fee_refund: boolean
  scaling_max: string
  consistency_rule: string
  platforms: string[]
  assets: string[]
  challenge_types: string[]
  special_features: string[]
  trust_status: string
  discount_code: string
  discount_percent: number
  year_founded: number
  headquarters: string
}

interface SimilarFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  trustpilot_rating: number
  min_price: number
  profit_split: number
}

interface Props {
  firm: PropFirm
  similarFirms: SimilarFirm[]
}

function BooleanBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${value ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
      {value ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span className="text-sm">{label}</span>
    </div>
  )
}

export default function PropFirmPageClient({ firm, similarFirms }: Props) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleCopyCode = () => {
    if (firm.discount_code) {
      navigator.clipboard.writeText(firm.discount_code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${firm.name} - PropFirmScanner`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const logoUrl = firm.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(firm.name)}&background=10b981&color=fff&size=200`

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                {/* Logo */}
                <div className="relative w-24 h-24 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-700">
                  <Image
                    src={logoUrl}
                    alt={firm.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>

                {/* Name & Rating */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{firm.name}</h1>
                    {firm.trust_status === 'verified' && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {firm.trustpilot_rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(firm.trustpilot_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{firm.trustpilot_rating.toFixed(1)}</span>
                      <span className="text-gray-500">({firm.trustpilot_reviews?.toLocaleString()} reviews)</span>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {firm.year_founded && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Founded {firm.year_founded}
                      </span>
                    )}
                    {firm.headquarters && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {firm.headquarters}
                      </span>
                    )}
                    {firm.website_url && (
                      <a
                        href={firm.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                      >
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">Starting From</p>
                  <p className="text-2xl font-bold text-white">${firm.min_price || '—'}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">Profit Split</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {firm.profit_split || '—'}
                    {firm.max_profit_split && firm.max_profit_split > firm.profit_split && (
                      <span className="text-sm text-gray-500">-{firm.max_profit_split}%</span>
                    )}
                    {firm.profit_split && '%'}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">Daily Drawdown</p>
                  <p className="text-2xl font-bold text-white">{firm.max_daily_drawdown || '—'}%</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">Total Drawdown</p>
                  <p className="text-2xl font-bold text-white">{firm.max_total_drawdown || '—'}%</p>
                </div>
              </div>
            </div>

            {/* Right - CTA Card */}
            <div className="lg:w-80">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24">
                {/* Discount */}
                {firm.discount_code && firm.discount_percent && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 font-semibold">{firm.discount_percent}% OFF</span>
                      <span className="text-gray-500 text-xs">Exclusive Code</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                        copiedCode
                          ? 'bg-emerald-500 text-white'
                          : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      }`}
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> {firm.discount_code}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Main CTA */}
                <a
                  href={firm.affiliate_url || firm.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors mb-3"
                >
                  Visit {firm.name}
                  <ExternalLink className="w-4 h-4 inline ml-2" />
                </a>

                {/* Secondary Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                      isFavorite
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge Rules */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Challenge Rules
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Phase 1 Target</p>
                    <p className="text-xl font-semibold text-white">{firm.profit_target_phase1 || '—'}%</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Phase 2 Target</p>
                    <p className="text-xl font-semibold text-white">{firm.profit_target_phase2 || 'N/A'}%</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Min Trading Days</p>
                    <p className="text-xl font-semibold text-white">{firm.min_trading_days || 'None'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Time Limit</p>
                    <p className="text-xl font-semibold text-white">{firm.time_limit || 'Unlimited'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Drawdown Type</p>
                    <p className="text-xl font-semibold text-white capitalize">{firm.drawdown_type || '—'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Consistency Rule</p>
                    <p className="text-xl font-semibold text-white">{firm.consistency_rule || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Trading Permissions */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Trading Permissions
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <BooleanBadge value={firm.allows_scalping} label="Scalping Allowed" />
                  <BooleanBadge value={firm.allows_news_trading} label="News Trading" />
                  <BooleanBadge value={firm.allows_ea} label="EAs / Bots" />
                  <BooleanBadge value={firm.allows_weekend_holding} label="Weekend Holding" />
                  <BooleanBadge value={firm.has_instant_funding} label="Instant Funding" />
                  <BooleanBadge value={firm.fee_refund} label="Fee Refundable" />
                </div>
              </div>

              {/* Platforms & Assets */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">Platforms & Assets</h2>
                <div className="space-y-4">
                  {firm.platforms && firm.platforms.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Trading Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {firm.platforms.map((platform) => (
                          <span key={platform} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {firm.assets && firm.assets.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">Available Assets</p>
                      <div className="flex flex-wrap gap-2">
                        {firm.assets.map((asset) => (
                          <span key={asset} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payout Info */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  Payout Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Payout Frequency</p>
                    <p className="text-xl font-semibold text-white capitalize">{firm.payout_frequency || '—'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">Scaling Plan</p>
                    <p className="text-xl font-semibold text-white">{firm.scaling_max || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Similar Firms */}
              {similarFirms.length > 0 && (
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Similar Firms</h3>
                  <div className="space-y-3">
                    {similarFirms.map((similar) => (
                      <Link
                        key={similar.id}
                        href={`/prop-firm/${similar.slug}`}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                      >
                        <div className="relative w-10 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {similar.logo_url ? (
                            <Image src={similar.logo_url} alt={similar.name} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                              {similar.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{similar.name}</p>
                          <p className="text-sm text-gray-500">
                            {similar.trustpilot_rating?.toFixed(1)} ★ · ${similar.min_price}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm mb-1">Trading Risk Warning</p>
                    <p className="text-gray-400 text-xs">
                      Trading involves substantial risk. Only trade with capital you can afford to lose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
