'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, Shield, ExternalLink, ChevronLeft, DollarSign, Globe, Award, 
  CheckCircle, XCircle, Info, ThumbsUp, ThumbsDown, Target, AlertTriangle, 
  ArrowRight, Users, Zap, Copy, CheckCircle2, Tag, Percent
} from 'lucide-react'
import { trackAffiliateClick } from '@/lib/affiliate-tracking'
import { generateFirmContent } from '@/lib/generate-firm-content'

interface Props { 
  firm: any
  alternatives?: any[] 
}

const countryToCode: Record<string, string> = {
  'USA': 'us', 'United States': 'us', 'UK': 'gb', 'United Kingdom': 'gb', 'Czech Republic': 'cz',
  'UAE': 'ae', 'Dubai': 'ae', 'Australia': 'au', 'Canada': 'ca', 'Germany': 'de', 'France': 'fr',
  'Spain': 'es', 'Netherlands': 'nl', 'Switzerland': 'ch', 'Singapore': 'sg', 'Hong Kong': 'hk',
  'Cyprus': 'cy', 'Malta': 'mt', 'Estonia': 'ee', 'Poland': 'pl', 'Hungary': 'hu', 'Israel': 'il',
}

const platformInfo: Record<string, { name: string; logo: string; color: string }> = {
  'MT4': { name: 'MetaTrader 4', logo: '/platforms/mt4.png', color: 'bg-blue-500' },
  'MT5': { name: 'MetaTrader 5', logo: '/platforms/mt5.png', color: 'bg-indigo-500' },
  'cTrader': { name: 'cTrader', logo: '/platforms/ctrader.png', color: 'bg-orange-500' },
  'DXtrade': { name: 'DXtrade', logo: '/platforms/dxtrade.png', color: 'bg-purple-500' },
  'TradeLocker': { name: 'TradeLocker', logo: '/platforms/tradelocker.png', color: 'bg-emerald-500' },
  'Match-Trader': { name: 'Match-Trader', logo: '/platforms/matchtrader.png', color: 'bg-red-500' },
  'MatchTrader': { name: 'Match-Trader', logo: '/platforms/matchtrader.png', color: 'bg-red-500' },
  'NinjaTrader': { name: 'NinjaTrader', logo: '/platforms/ninjatrader.png', color: 'bg-red-600' },
  'Tradovate': { name: 'Tradovate', logo: '/platforms/tradovate.png', color: 'bg-cyan-500' },
  'TradingView': { name: 'TradingView', logo: '/platforms/tradingview.png', color: 'bg-blue-600' },
  'Sierra Chart': { name: 'Sierra Chart', logo: '/platforms/sierra.png', color: 'bg-gray-600' },
  'Bookmap': { name: 'Bookmap', logo: '/platforms/bookmap.png', color: 'bg-teal-500' },
  'R Trader Pro': { name: 'R Trader Pro', logo: '/platforms/rtrader.png', color: 'bg-amber-500' },
  'Rithmic': { name: 'Rithmic', logo: '/platforms/rithmic.png', color: 'bg-gray-700' },
}

// Safe display helper
const safeDisplay = (value: any, suffix: string = '', fallback: string = 'N/A'): string => {
  if (value === null || value === undefined || value === '') return fallback
  return `${value}${suffix}`
}

// Format review count
const formatReviewCount = (count: number | null | undefined): string => {
  if (!count) return ''
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  }
  return count.toLocaleString()
}

// Promo Badge Component
const PromoBadge = ({ percent, code, size = 'default' }: { percent: number; code?: string; size?: 'default' | 'large' }) => {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  if (size === 'large') {
    return (
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Limited Time Offer</p>
            <p className="text-3xl font-bold">{percent}% OFF</p>
          </div>
          {code && (
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span className="font-semibold">{code}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="inline-flex items-center gap-2">
      <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-lg shadow-lg">
        {percent}% OFF
      </span>
      {code && (
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg flex items-center gap-1.5 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{code}</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

// Platform Badge Component with tooltip
const PlatformBadge = ({ platform }: { platform: string }) => {
  const info = platformInfo[platform]
  
  return (
    <div 
      className="group relative w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2 cursor-help"
      title={info?.name || platform}
    >
      {info?.logo ? (
        <img src={info.logo} alt={platform} className="w-full h-full object-contain" />
      ) : (
        <span className={`text-xs font-bold text-white px-2 py-1 rounded ${info?.color || 'bg-gray-600'}`}>
          {platform.substring(0, 3)}
        </span>
      )}
      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {info?.name || platform}
      </div>
    </div>
  )
}

export default function PropFirmPageClient({ firm, alternatives = [] }: Props) {
  const countryCode = countryToCode[firm.headquarters] || null
  const content = generateFirmContent(firm)
  const handleBuyClick = () => trackAffiliateClick(firm.name, firm.affiliate_url || firm.website_url || '', 'prop-firm-page')
  const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p)
  const formatSize = (s: number) => s >= 1000000 ? `$${(s/1000000).toFixed(1)}M` : s >= 1000 ? `$${(s/1000).toFixed(0)}K` : `$${s}`

  const hasDiscount = firm.discount_percent && firm.discount_percent > 0
  
  const riskColors: Record<string, string> = { 
    strict: 'bg-red-500/20 text-red-400 border-red-500/30', 
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
    flexible: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
  }
  const riskLabels: Record<string, string> = { 
    strict: 'Strict Rules', 
    medium: 'Balanced', 
    flexible: 'Flexible' 
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/compare" className="hover:text-white flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />Back to Compare
          </Link>
          <span>/</span>
          <span className="text-white">{firm.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-3 flex-shrink-0">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl font-bold text-emerald-500">{firm.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="flex-1">
              {/* Name + Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{firm.name}</h1>
                <span className={`px-3 py-1 text-sm rounded-full border ${riskColors[content.riskLevel]}`}>
                  {riskLabels[content.riskLevel]}
                </span>
                {firm.is_regulated && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Regulated
                  </span>
                )}
                {firm.trustpilot_rating >= 4.5 && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full flex items-center gap-1">
                    <Award className="w-4 h-4" /> Top Rated
                  </span>
                )}
              </div>
              
              {/* Rating & Location */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {firm.trustpilot_rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(firm.trustpilot_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">{firm.trustpilot_rating}</span>
                    {firm.trustpilot_reviews > 0 && (
                      <span className="text-gray-400 text-sm">
                        ({formatReviewCount(firm.trustpilot_reviews)} reviews)
                      </span>
                    )}
                  </div>
                )}
                {firm.headquarters && (
                  <div className="flex items-center gap-2 text-gray-400">
                    {countryCode && (
                      <img 
                        src={`https://flagcdn.com/24x18/${countryCode}.png`} 
                        alt={firm.headquarters} 
                        className="rounded-sm" 
                      />
                    )}
                    <span>{firm.headquarters}</span>
                  </div>
                )}
                {firm.year_founded && (
                  <span className="text-gray-400">Founded {firm.year_founded}</span>
                )}
              </div>

              {/* Promo Badge (if discount exists) */}
              {hasDiscount && (
                <div className="mb-4">
                  <PromoBadge percent={firm.discount_percent} code={firm.discount_code} />
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a 
                  href={firm.affiliate_url || firm.website_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={handleBuyClick} 
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <DollarSign className="w-5 h-5" />
                  Buy Challenge
                  {hasDiscount && <span className="px-2 py-0.5 bg-white/20 rounded text-xs ml-1">-{firm.discount_percent}%</span>}
                  <ExternalLink className="w-4 h-4" />
                </a>
                {firm.website_url && (
                  <a 
                    href={firm.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl flex items-center gap-2"
                  >
                    <Globe className="w-5 h-5" />Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Our Verdict */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Our Verdict</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">{content.verdict}</p>
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <ThumbsUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Pros</h3>
                </div>
                <ul className="space-y-3">
                  {content.pros.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <ThumbsDown className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Cons</h3>
                </div>
                <ul className="space-y-3">
                  {content.cons.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For / Avoid If */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Best For</h3>
                </div>
                <ul className="space-y-3">
                  {content.bestFor.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Avoid If</h3>
                </div>
                <ul className="space-y-3">
                  {content.avoidIf.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Stats - FIXED: handles 0 properly */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Key Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Starting From</p>
                  <p className="text-2xl font-bold text-white">
                    {firm.min_price ? formatPrice(firm.min_price) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Profit Split</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {safeDisplay(firm.profit_split, '%')}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Daily DD</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {firm.max_daily_drawdown !== null && firm.max_daily_drawdown !== undefined 
                      ? `${firm.max_daily_drawdown}%` 
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Max DD</p>
                  <p className="text-2xl font-bold text-red-400">
                    {firm.max_total_drawdown !== null && firm.max_total_drawdown !== undefined 
                      ? `${firm.max_total_drawdown}%` 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Sizes */}
            {firm.account_sizes?.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Account Sizes</h2>
                <div className="flex flex-wrap gap-3">
                  {[...firm.account_sizes].sort((a: number, b: number) => a - b).map((s: number) => (
                    <div key={s} className="px-4 py-2 bg-gray-700/50 text-white rounded-lg font-medium">
                      {formatSize(s)}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Challenge Types */}
            {firm.challenge_types?.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Challenge Types</h2>
                <div className="flex flex-wrap gap-3">
                  {firm.challenge_types.map((t: string) => (
                    <div key={t} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-medium">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trading Rules - FIXED colors */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Trading Rules</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <RuleItem label="Scalping" allowed={firm.allows_scalping} />
                <RuleItem label="News Trading" allowed={firm.allows_news_trading} />
                <RuleItem label="Weekend Holding" allowed={firm.allows_weekend_holding} />
                <RuleItem label="Hedging" allowed={firm.allows_hedging} />
                <RuleItem label="EA / Bots" allowed={firm.allows_ea} />
                <RuleItem label="Free Retry" allowed={firm.has_free_repeat} />
              </div>
            </div>

            {/* Markets */}
            {firm.instruments?.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Markets</h2>
                <div className="flex flex-wrap gap-2">
                  {firm.instruments.map((i: string) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sticky CTA Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Start with {firm.name}</h3>
              
              {/* Promo Banner in Sidebar */}
              {hasDiscount && (
                <div className="mb-4">
                  <PromoBadge percent={firm.discount_percent} code={firm.discount_code} size="large" />
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">From</span>
                  <span className="text-white font-semibold">
                    {firm.min_price ? formatPrice(firm.min_price) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Split</span>
                  <span className="text-emerald-400 font-semibold">
                    {safeDisplay(firm.profit_split, '%')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Max</span>
                  <span className="text-white font-semibold">
                    {firm.account_sizes?.length > 0 ? formatSize(Math.max(...firm.account_sizes)) : 'N/A'}
                  </span>
                </div>
              </div>
              
              <a 
                href={firm.affiliate_url || firm.website_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={handleBuyClick} 
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Buy Challenge
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-500/70 text-center mt-3 italic">Affiliate link</p>
            </div>

            {/* Platforms - IMPROVED with tooltips */}
            {firm.platforms?.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Platforms</h3>
                <div className="flex flex-wrap gap-3">
                  {firm.platforms.map((p: string) => (
                    <PlatformBadge key={p} platform={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Useful Links */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Useful Links</h3>
              <div className="space-y-2">
                <Link href="/tools/risk-calculator" className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors">
                  <span className="text-gray-300">Risk Calculator</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/tools/rule-tracker" className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors">
                  <span className="text-gray-300">Rule Tracker</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/deals" className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-colors">
                  <span className="text-gray-300">All Deals</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Firms */}
        {alternatives.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Firms</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {alternatives.map((alt: any) => (
                <Link 
                  key={alt.id} 
                  href={`/prop-firm/${alt.slug}`} 
                  className="bg-gray-800/50 border border-gray-700 hover:border-emerald-500/30 rounded-xl p-5 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                      {alt.logo_url ? (
                        <img src={alt.logo_url} alt={alt.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg font-bold text-emerald-600">{alt.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {alt.name}
                      </h3>
                      {alt.trustpilot_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-400">{alt.trustpilot_rating}</span>
                          {alt.trustpilot_reviews > 0 && (
                            <span className="text-xs text-gray-500">({formatReviewCount(alt.trustpilot_reviews)})</span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Discount badge on similar firms */}
                    {alt.discount_percent > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 text-xs font-bold rounded">
                        -{alt.discount_percent}%
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-gray-500 text-xs">From</p>
                      <p className="text-white font-semibold">${alt.min_price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Split</p>
                      <p className="text-emerald-400 font-semibold">{safeDisplay(alt.profit_split || alt.max_profit_split, '%')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Max DD</p>
                      <p className="text-white font-semibold">{safeDisplay(alt.max_total_drawdown, '%')}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">Join thousands of traders with {firm.name}.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href={firm.affiliate_url || firm.website_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={handleBuyClick} 
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Buy Challenge
              {hasDiscount && <span className="px-2 py-0.5 bg-white/20 rounded text-xs">-{firm.discount_percent}%</span>}
            </a>
            <Link href="/compare" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors">
              Compare All
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rule Item Component - FIXED: proper colors for all states
function RuleItem({ label, allowed }: { label: string; allowed?: boolean }) {
  if (allowed === undefined || allowed === null) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Info className="w-5 h-5" />
        <span>{label}</span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-2 ${allowed ? 'text-emerald-400' : 'text-red-400'}`}>
      {allowed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span>{label}</span>
    </div>
  )
}
