'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Filter, ChevronDown, ChevronUp, Star, Check, X, 
  Zap, Grid3X3, List, ExternalLink, Sparkles,
  AlertTriangle, Calendar, BarChart3,
  Tag, Trophy, BadgeCheck, Copy, CheckCircle2
} from 'lucide-react'

// Types
interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  propfirmmatch_rating: number
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
  is_futures: boolean
  discount_code: string
  discount_percent: number
  year_founded: number
  headquarters: string
}

interface ComparePageClientProps {
  firms: PropFirm[]
}

// Format reviews count (34000 -> "34K")
const formatReviewCount = (count: number | null | undefined): string => {
  if (!count) return ''
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  }
  return count.toString()
}

// Safe display value (handles null/undefined)
const safeDisplay = (value: number | string | null | undefined, suffix: string = '', fallback: string = 'N/A'): string => {
  if (value === null || value === undefined || value === '') return fallback
  return `${value}${suffix}`
}

// ✅ FIXED: Format daily drawdown (0% = "No limit")
const formatDailyDrawdown = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A'
  if (value === 0) return 'No limit'
  return `${value}%`
}

// ✅ Format profit split correctly (ensure start-max format)
const formatProfitSplit = (start: number | null | undefined, max: number | null | undefined): string => {
  if (!start && !max) return 'N/A'
  if (!start) return `${max}%`
  if (!max) return `${start}%`
  // Ensure smaller number comes first
  const minVal = Math.min(start, max)
  const maxVal = Math.max(start, max)
  if (minVal === maxVal) return `${minVal}%`
  return `${minVal}-${maxVal}%`
}

// Trust Badge Component - with tooltip
const TrustBadge = ({ status }: { status: string }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const config = {
    verified: { 
      bg: 'bg-emerald-500/20', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/30', 
      label: 'Verified', 
      icon: BadgeCheck,
      tooltip: 'We verified this firm pays traders and has a legitimate business presence'
    },
    banned: { 
      bg: 'bg-red-500/20', 
      text: 'text-red-400', 
      border: 'border-red-500/30', 
      label: 'Avoid', 
      icon: X,
      tooltip: 'This firm has reported issues with payouts or business practices'
    },
    under_review: { 
      bg: 'bg-yellow-500/20', 
      text: 'text-yellow-400', 
      border: 'border-yellow-500/30', 
      label: 'Under Review', 
      icon: AlertTriangle,
      tooltip: 'We are currently reviewing this firm'
    },
    new: { 
      bg: 'bg-blue-500/20', 
      text: 'text-blue-400', 
      border: 'border-blue-500/30', 
      label: 'New', 
      icon: Sparkles,
      tooltip: 'This firm was recently added to our database'
    },
  }
  const { bg, text, border, label, icon: Icon, tooltip } = config[status as keyof typeof config] || config.verified
  
  return (
    <div className="relative inline-block">
      <span 
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text} border ${border} cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Icon className="w-3 h-3" />
        {label}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-48 z-50 border border-gray-700">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

// Promo Badge Component
const PromoBadge = ({ percent, code }: { percent: number, code?: string }) => {
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
  
  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg">
        {percent}% OFF
        {code && (
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-normal opacity-90 hover:opacity-100 mt-0.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                {code}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Ranking Badge Component (for top 3) - Only show for actual ranks
const RankingBadge = ({ rank }: { rank: number }) => {
  if (!rank || rank <= 0 || rank > 3) return null
  
  const colors = {
    1: 'from-amber-400 to-amber-600',
    2: 'from-gray-300 to-gray-500',
    3: 'from-amber-600 to-amber-800',
  }
  
  return (
    <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-lg bg-gradient-to-br ${colors[rank as keyof typeof colors]} flex items-center justify-center shadow-lg`}>
      <Trophy className="w-4 h-4 text-white" />
    </div>
  )
}

// Platform Badge Component
const PlatformBadge = ({ platform }: { platform: string }) => {
  const colors: Record<string, string> = {
    'MT4': 'bg-blue-500/20 text-blue-400',
    'MT5': 'bg-indigo-500/20 text-indigo-400',
    'cTrader': 'bg-orange-500/20 text-orange-400',
    'DXTrade': 'bg-purple-500/20 text-purple-400',
    'DXtrade': 'bg-purple-500/20 text-purple-400',
    'TradeLocker': 'bg-emerald-500/20 text-emerald-400',
    'Match-Trader': 'bg-red-500/20 text-red-400',
    'MatchTrader': 'bg-red-500/20 text-red-400',
    'NinjaTrader': 'bg-red-500/20 text-red-400',
    'Tradovate': 'bg-cyan-500/20 text-cyan-400',
    'TradingView': 'bg-blue-500/20 text-blue-400',
    'Rithmic': 'bg-gray-500/20 text-gray-400',
  }
  
  const displayName = platform === 'DXtrade' ? 'DXTrade' : platform === 'MatchTrader' ? 'Match-Trader' : platform
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[platform] || 'bg-gray-500/20 text-gray-400'}`}>
      {displayName}
    </span>
  )
}

// Prop Firm Card Component
const PropFirmCard = ({ firm, isCompact, rank }: { firm: PropFirm, isCompact: boolean, rank: number }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Properly check for discount
  const hasDiscount = firm.discount_percent != null && firm.discount_percent > 0
  
  // Compact List View
  if (isCompact) {
    return (
      <div className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300 relative">
        {hasDiscount && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded">
            {firm.discount_percent}% OFF
          </span>
        )}
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {rank <= 3 && rank > 0 && (
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                rank === 1 ? 'bg-amber-500 text-white' :
                rank === 2 ? 'bg-gray-400 text-white' :
                'bg-amber-700 text-white'
              }`}>
                {rank}
              </span>
            )}
            <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
              {firm.logo_url ? (
                <Image src={firm.logo_url} alt={firm.name} width={48} height={48} className="object-contain" />
              ) : (
                <span className="text-lg font-bold text-emerald-600">{firm.name.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white truncate">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                {firm.trustpilot_rating?.toFixed(1) || 'N/A'}
                {firm.trustpilot_reviews && (
                  <span className="text-gray-500">({formatReviewCount(firm.trustpilot_reviews)})</span>
                )}
              </span>
              <span>From ${firm.min_price || 'N/A'}</span>
              <span className="text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)} split</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href={`/prop-firm/${firm.slug}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Details
            </Link>
            <a 
              href={firm.affiliate_url || firm.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
            >
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  // Grid View - Full Card
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-2xl overflow-hidden transition-all duration-300 group relative flex flex-col h-full">
      {rank > 0 && rank <= 3 && <RankingBadge rank={rank} />}
      {hasDiscount && <PromoBadge percent={firm.discount_percent} code={firm.discount_code} />}
      
      {/* Header */}
      <div className={`p-5 pb-4 ${(rank <= 3 && rank > 0) && hasDiscount ? 'pt-14' : (rank <= 3 && rank > 0) || hasDiscount ? 'pt-12' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-2 flex-shrink-0">
            {firm.logo_url ? (
              <Image src={firm.logo_url} alt={firm.name} width={64} height={64} className="object-contain" />
            ) : (
              <span className="text-2xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-bold text-white truncate">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-white">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
                {firm.trustpilot_reviews ? (
                  <span className="text-gray-500 text-sm">({formatReviewCount(firm.trustpilot_reviews)} reviews)</span>
                ) : (
                  <span className="text-gray-600 text-sm">(No reviews)</span>
                )}
              </div>
              {firm.year_founded && (
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Since {firm.year_founded}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Stats Grid */}
      <div className="px-5 py-4 bg-gray-900/50 border-y border-gray-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Starting Price</p>
            <p className="text-lg font-bold text-white">
              {firm.min_price ? `$${firm.min_price}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Profit Split</p>
            <p className="text-lg font-bold text-emerald-400">
              {formatProfitSplit(firm.profit_split, firm.max_profit_split)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Daily Drawdown</p>
            <p className="text-white font-semibold">{formatDailyDrawdown(firm.max_daily_drawdown)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Max Drawdown</p>
            <p className="text-white font-semibold">{safeDisplay(firm.max_total_drawdown, '%', 'N/A')}</p>
          </div>
        </div>
        
        {firm.profit_target_phase1 && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Profit Target:</span>
              <span className="text-white font-medium">{firm.profit_target_phase1}%</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Trading Rules */}
      <div className="p-5 flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {firm.allows_scalping && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20">
              <Check className="w-3 h-3" /> Scalping
            </span>
          )}
          {firm.allows_news_trading && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20">
              <Check className="w-3 h-3" /> News Trading
            </span>
          )}
          {firm.allows_ea && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20">
              <Check className="w-3 h-3" /> EAs Allowed
            </span>
          )}
          {firm.has_instant_funding && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg border border-yellow-500/20">
              <Zap className="w-3 h-3" /> Instant Funding
            </span>
          )}
          {firm.allows_news_trading === false && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg border border-red-500/20">
              <X className="w-3 h-3" /> No News Trading
            </span>
          )}
        </div>
        
        {firm.platforms && firm.platforms.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Platforms</p>
            <div className="flex flex-wrap gap-1.5">
              {firm.platforms.slice(0, 4).map((platform, i) => (
                <PlatformBadge key={i} platform={platform} />
              ))}
              {firm.platforms.length > 4 && (
                <span className="px-2 py-0.5 rounded text-xs text-gray-500">+{firm.platforms.length - 4}</span>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Profit Target:</span>
                <span className="text-white">{safeDisplay(firm.profit_target_phase1, '%', 'N/A')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Min Days:</span>
                <span className="text-white">{firm.min_trading_days || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time Limit:</span>
                <span className="text-white">{firm.time_limit || 'Unlimited'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payout:</span>
                <span className="text-white">{firm.payout_frequency || 'Bi-weekly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Drawdown Type:</span>
                <span className="text-white">{firm.drawdown_type || 'Static'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Refund:</span>
                <span className={firm.fee_refund ? 'text-emerald-400' : 'text-gray-500'}>
                  {firm.fee_refund ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            
            {firm.challenge_types && firm.challenge_types.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Challenge Types</h4>
                <div className="flex flex-wrap gap-1.5">
                  {firm.challenge_types.map((type, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="p-5 pt-0 flex gap-3 mt-auto">
        <Link 
          href={`/prop-firm/${firm.slug}`}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white text-center font-medium rounded-xl transition-colors"
        >
          View Details
        </Link>
        <a 
          href={firm.affiliate_url || firm.website_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-center font-medium rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Visit Site
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

// Filter Section Component
const FilterSection = ({ 
  filters, 
  setFilters,
  firms,
  isOpenDefault = true
}: { 
  filters: Record<string, unknown>, 
  setFilters: (f: Record<string, unknown>) => void,
  firms: PropFirm[],
  isOpenDefault?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault)
  
  const platforms = useMemo(() => {
    const all = firms.flatMap(f => f.platforms || [])
    const normalized = all.map(p => {
      if (p === 'DXtrade') return 'DXTrade'
      if (p === 'MatchTrader') return 'Match-Trader'
      return p
    })
    return Array.from(new Set(normalized)).sort()
  }, [firms])
  
  const discountCount = useMemo(() => 
    firms.filter(f => f.discount_percent != null && f.discount_percent > 0).length
  , [firms])
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors lg:cursor-default"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Filter className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Filters</h3>
            <p className="text-sm text-gray-500">Refine your search</p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform lg:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 pt-0 border-t border-gray-700/50 space-y-6">
          {/* Has Discount Filter */}
          <div>
            <button
              onClick={() => setFilters({ ...filters, hasDiscount: !filters.hasDiscount })}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                filters.hasDiscount
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-gray-700 text-gray-300 border border-transparent hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                With Discount Only
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${filters.hasDiscount ? 'bg-orange-500/30' : 'bg-gray-600'}`}>
                {discountCount}
              </span>
            </button>
          </div>
          
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Min Rating</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: null, label: 'All' },
                { value: 4.0, label: '4.0+' },
                { value: 4.3, label: '4.3+' },
                { value: 4.5, label: '4.5+' },
              ].map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setFilters({ ...filters, minRating: value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    filters.minRating === value || (!filters.minRating && value === null)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {value && <Star className="w-3 h-3 fill-current" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Asset Type */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Asset Type</label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Forex', 'Futures'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, assetType: type === 'All' ? null : type })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    (type === 'All' && !filters.assetType) || filters.assetType === type
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Max Price: ${filters.maxPrice || 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={(filters.maxPrice as number) || 1000}
              onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || null })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$500</span>
              <span>$1000+</span>
            </div>
          </div>
          
          {/* Profit Split */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Min Profit Split</label>
            <div className="flex flex-wrap gap-2">
              {[70, 80, 90, 100].map(split => (
                <button
                  key={split}
                  onClick={() => setFilters({ ...filters, minProfitSplit: split === 70 ? null : split })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    (split === 70 && !filters.minProfitSplit) || filters.minProfitSplit === split
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {split}%+
                </button>
              ))}
            </div>
          </div>
          
          {/* Trading Style Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Trading Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'allowsScalping', label: 'Scalping' },
                { key: 'allowsNewsTrading', label: 'News Trading' },
                { key: 'allowsEA', label: 'EAs Allowed' },
                { key: 'hasInstantFunding', label: 'Instant Funding' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilters({ ...filters, [key]: !filters[key] })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    filters[key]
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-700 text-gray-400 border border-transparent hover:bg-gray-600'
                  }`}
                >
                  {filters[key] ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Platform Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Platform</label>
            <select
              value={(filters.platform as string) || ''}
              onChange={(e) => setFilters({ ...filters, platform: e.target.value || null })}
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          {/* Reset Button */}
          <button
            onClick={() => setFilters({})}
            className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// Quick Comparison Table
const QuickComparisonTable = ({ firms }: { firms: PropFirm[] }) => {
  const displayFirms = firms.slice(0, 20)
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Prop Firm</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Rating</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Price</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Split</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Daily DD</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Max DD</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Target</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium hidden md:table-cell">Promo</th>
          </tr>
        </thead>
        <tbody>
          {displayFirms.map((firm, i) => (
            <tr 
              key={firm.id} 
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-amber-500 text-white' :
                  i === 1 ? 'bg-gray-400 text-white' :
                  i === 2 ? 'bg-amber-700 text-white' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {i + 1}
                </span>
              </td>
              <td className="py-3 px-4">
                <Link href={`/prop-firm/${firm.slug}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1">
                    {firm.logo_url ? (
                      <Image src={firm.logo_url} alt="" width={32} height={32} className="object-contain" />
                    ) : (
                      <span className="text-emerald-600 font-bold">{firm.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-white group-hover:text-emerald-400 transition-colors block">
                      {firm.name}
                    </span>
                    {firm.trustpilot_reviews ? (
                      <span className="text-xs text-gray-500">{formatReviewCount(firm.trustpilot_reviews)} reviews</span>
                    ) : (
                      <span className="text-xs text-gray-600">No reviews</span>
                    )}
                  </div>
                </Link>
              </td>
              <td className="text-center py-3 px-2">
                <span className="inline-flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {firm.trustpilot_rating?.toFixed(1) || '-'}
                </span>
              </td>
              <td className="text-center py-3 px-2 text-white font-medium">
                {firm.min_price ? `$${firm.min_price}` : 'N/A'}
              </td>
              <td className="text-center py-3 px-2 text-emerald-400 font-medium">
                {formatProfitSplit(firm.profit_split, firm.max_profit_split)}
              </td>
              <td className="text-center py-3 px-2 text-gray-300">{formatDailyDrawdown(firm.max_daily_drawdown)}</td>
              <td className="text-center py-3 px-2 text-gray-300">{safeDisplay(firm.max_total_drawdown, '%', '-')}</td>
              <td className="text-center py-3 px-2 text-gray-300">{safeDisplay(firm.profit_target_phase1, '%', '-')}</td>
              <td className="text-center py-3 px-2 hidden md:table-cell">
                {firm.discount_percent != null && firm.discount_percent > 0 ? (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 text-xs font-bold rounded">
                    {firm.discount_percent}% OFF
                  </span>
                ) : (
                  <span className="text-gray-600">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Main Component
export default function ComparePageClient({ firms }: ComparePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, unknown>>({})
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'split' | 'discount'>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [showOnlyVerified, setShowOnlyVerified] = useState(true)
  
  // Filter and sort firms
  const filteredFirms = useMemo(() => {
    let result = [...firms]
    
    // Trust status filter
    if (showOnlyVerified) {
      result = result.filter(f => f.trust_status === 'verified' || !f.trust_status)
    } else {
      result = result.filter(f => f.trust_status !== 'banned')
    }
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f => 
        f.name?.toLowerCase().includes(q) ||
        f.slug?.toLowerCase().includes(q)
      )
    }
    
    // Has Discount filter
    if (filters.hasDiscount) {
      result = result.filter(f => f.discount_percent != null && f.discount_percent > 0)
    }
    
    // Rating filter
    if (filters.minRating) {
      result = result.filter(f => f.trustpilot_rating >= (filters.minRating as number))
    }
    
    // Asset type filter
    if (filters.assetType === 'Futures') {
      result = result.filter(f => f.is_futures)
    } else if (filters.assetType === 'Forex') {
      result = result.filter(f => !f.is_futures)
    }
    
    // Price filter
    if (filters.maxPrice && (filters.maxPrice as number) < 1000) {
      result = result.filter(f => f.min_price <= (filters.maxPrice as number))
    }
    
    // Profit split filter
    if (filters.minProfitSplit) {
      result = result.filter(f => f.max_profit_split >= (filters.minProfitSplit as number))
    }
    
    // Trading style filters
    if (filters.allowsScalping) result = result.filter(f => f.allows_scalping)
    if (filters.allowsNewsTrading) result = result.filter(f => f.allows_news_trading)
    if (filters.allowsEA) result = result.filter(f => f.allows_ea)
    if (filters.hasInstantFunding) result = result.filter(f => f.has_instant_funding)
    
    // Platform filter
    if (filters.platform) {
      result = result.filter(f => f.platforms?.some(p => {
        const normalizedP = p === 'DXtrade' ? 'DXTrade' : p === 'MatchTrader' ? 'Match-Trader' : p
        return normalizedP === filters.platform
      }))
    }
    
    // Sorting: Promo code firms FIRST, then others
    result.sort((a, b) => {
      const aHasPromo = (a.discount_percent ?? 0) > 0 ? 1 : 0
      const bHasPromo = (b.discount_percent ?? 0) > 0 ? 1 : 0
      
      if (bHasPromo !== aHasPromo) {
        return bHasPromo - aHasPromo
      }
      
      if (aHasPromo && bHasPromo) {
        return (b.discount_percent ?? 0) - (a.discount_percent ?? 0)
      }
      
      switch (sortBy) {
        case 'rating':
          return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
        case 'price':
          return (a.min_price || 0) - (b.min_price || 0)
        case 'split':
          return (b.max_profit_split || 0) - (a.max_profit_split || 0)
        case 'discount':
          return (b.discount_percent || 0) - (a.discount_percent || 0)
        default:
          return 0
      }
    })
    
    return result
  }, [firms, searchQuery, filters, sortBy, showOnlyVerified])
  
  // Stats
  const stats = useMemo(() => {
    const verifiedFirms = firms.filter(f => f.trust_status === 'verified' || !f.trust_status)
    const withDiscounts = verifiedFirms.filter(f => f.discount_percent != null && f.discount_percent > 0)
    const avgRating = verifiedFirms.reduce((sum, f) => sum + (f.trustpilot_rating || 0), 0) / verifiedFirms.length
    const avgSplit = verifiedFirms.reduce((sum, f) => sum + (f.max_profit_split || 0), 0) / verifiedFirms.length
    
    return {
      total: verifiedFirms.length,
      avgRating: isNaN(avgRating) ? '0.0' : avgRating.toFixed(1),
      avgSplit: isNaN(avgSplit) ? 0 : Math.round(avgSplit),
      withDiscounts: withDiscounts.length
    }
  }, [firms])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Compare <span className="text-emerald-400">{stats.total}+</span> Prop Firms
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find the perfect prop firm for your trading style. Updated January 2026.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-500">Verified Firms</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-400">{stats.avgRating}</p>
              <p className="text-sm text-gray-500">Avg. Rating</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-400">{stats.avgSplit}%</p>
              <p className="text-sm text-gray-500">Avg. Max Split</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center group hover:border-orange-500/30 transition-colors cursor-pointer"
                 onClick={() => setFilters({ ...filters, hasDiscount: true })}>
              <p className="text-3xl font-bold text-orange-400">{stats.withDiscounts}</p>
              <p className="text-sm text-gray-500 group-hover:text-orange-400 transition-colors">
                With Discounts 🔥
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prop firms by name..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1 space-y-6">
              <FilterSection 
                filters={filters} 
                setFilters={setFilters} 
                firms={firms}
                isOpenDefault={true}
              />
              
              {/* View Options */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-3">View Options</h3>
                
                <div className="flex gap-2 mb-4">
                  {[
                    { mode: 'grid', icon: Grid3X3, label: 'Grid' },
                    { mode: 'list', icon: List, label: 'List' },
                    { mode: 'table', icon: BarChart3, label: 'Table' },
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as 'grid' | 'list' | 'table')}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-all ${
                        viewMode === mode
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                      title={label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'split' | 'discount')}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="price">Lowest Price</option>
                    <option value="split">Highest Split</option>
                    <option value="discount">Best Discount</option>
                  </select>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-400">Verified Only</span>
                  <button
                    onClick={() => setShowOnlyVerified(!showOnlyVerified)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      showOnlyVerified ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      showOnlyVerified ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content - Firms List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  Showing <span className="text-white font-medium">{filteredFirms.length}</span> prop firms
                  {filters.hasDiscount && (
                    <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      With Discounts
                    </span>
                  )}
                  {filters.minRating && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      {filters.minRating as number}+ ⭐
                    </span>
                  )}
                </p>
                {Object.keys(filters).some(k => filters[k]) && (
                  <button 
                    onClick={() => setFilters({})}
                    className="text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              {viewMode === 'table' && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden mb-8">
                  <QuickComparisonTable firms={filteredFirms} />
                </div>
              )}
              
              {viewMode !== 'table' && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }>
                  {filteredFirms.map((firm, index) => (
                    <PropFirmCard 
                      key={firm.id} 
                      firm={firm} 
                      isCompact={viewMode === 'list'}
                      rank={index + 1}
                    />
                  ))}
                </div>
              )}
              
              {filteredFirms.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No firms found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                  <button
                    onClick={() => { setFilters({}); setSearchQuery(''); }}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
