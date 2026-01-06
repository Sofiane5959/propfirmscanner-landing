'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Filter, ChevronDown, ChevronUp, Star, Check, X, 
  Zap, Grid3X3, List, ExternalLink, Sparkles,
  AlertTriangle, Calendar, BarChart3, Info,
  Tag, Trophy, BadgeCheck, Copy, CheckCircle2,
  TrendingUp, Award, Users, DollarSign
} from 'lucide-react'

// =====================================================
// TYPES
// =====================================================
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

interface FilterState {
  hasDiscount?: boolean
  minRating?: number | null
  highRatingOnly?: boolean
  assetType?: string | null
  market?: string | null
  maxPrice?: number | null
  minProfitSplit?: number | null
  allowsScalping?: boolean
  allowsNewsTrading?: boolean
  allowsEA?: boolean
  hasInstantFunding?: boolean
  platform?: string | null
}

// =====================================================
// DATA HYGIENE: CANONICAL FIRMS (Deduplication)
// =====================================================
const CANONICAL_FIRMS: Record<string, { canonical: string; aliases: string[] }> = {
  'fundednext': {
    canonical: 'FundedNext',
    aliases: ['funded next', 'fundednext futures', 'funded next futures']
  },
  'the5ers': {
    canonical: 'The5ers',
    aliases: ['the 5ers', 'the5%ers', 'five percenters']
  },
  'ftmo': {
    canonical: 'FTMO',
    aliases: ['ftmo.com']
  },
  'myfundedfx': {
    canonical: 'MyFundedFX',
    aliases: ['my funded fx', 'myfunded fx']
  },
  'topstep': {
    canonical: 'Topstep',
    aliases: ['topstep trader', 'topsteptrader']
  }
}

// =====================================================
// DATA HYGIENE: BLOCKLIST (Non-existent firms)
// =====================================================
const BLOCKLIST_FIRMS: string[] = [
  'fundedtech',
  'fake prop firm',
  'test firm'
]

// =====================================================
// MARKETS NORMALIZATION (UI-only mapping)
// =====================================================
const MARKET_TYPES = ['All', 'Forex', 'Futures', 'Crypto', 'Indices', 'Metals', 'Stocks'] as const
type MarketType = typeof MARKET_TYPES[number]

const normalizeMarket = (assets: string[] | undefined, isFutures: boolean): MarketType[] => {
  const markets: MarketType[] = []
  
  if (isFutures) {
    markets.push('Futures')
  }
  
  if (!assets || assets.length === 0) {
    return isFutures ? ['Futures'] : ['Forex']
  }
  
  assets.forEach(asset => {
    const lower = asset.toLowerCase()
    if (lower.includes('forex') || lower.includes('fx') || lower.includes('currency')) {
      if (!markets.includes('Forex')) markets.push('Forex')
    }
    if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('btc')) {
      if (!markets.includes('Crypto')) markets.push('Crypto')
    }
    if (lower.includes('indices') || lower.includes('index') || lower.includes('cfd')) {
      if (!markets.includes('Indices')) markets.push('Indices')
    }
    if (lower.includes('metal') || lower.includes('gold') || lower.includes('silver') || lower.includes('xau')) {
      if (!markets.includes('Metals')) markets.push('Metals')
    }
    if (lower.includes('stock') || lower.includes('equity') || lower.includes('share')) {
      if (!markets.includes('Stocks')) markets.push('Stocks')
    }
    if (lower.includes('futures') || lower.includes('future')) {
      if (!markets.includes('Futures')) markets.push('Futures')
    }
  })
  
  // Default to Forex if nothing matched
  if (markets.length === 0) {
    markets.push('Forex')
  }
  
  return markets
}

// =====================================================
// VITRINES: STATIC RECOMMENDATIONS (Manual picks)
// =====================================================
const BEGINNER_PICKS = ['ftmo', 'the5ers', 'fundednext', 'topstep', 'my-funded-futures']
const BEST_VALUE_PICKS = ['fundednext', 'the5ers', 'funded-elite', 'goat-funded-trader']
const BEST_BY_MARKET: Record<string, string[]> = {
  'Forex': ['ftmo', 'the5ers', 'fundednext'],
  'Futures': ['topstep', 'my-funded-futures', 'apex-trader-funding', 'bulenox'],
  'Crypto': ['my-crypto-funding'],
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================
const formatReviewCount = (count: number | null | undefined): string => {
  if (!count) return ''
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  }
  return count.toString()
}

// Format profit split: "80% → 95%" (min → max)
const formatProfitSplit = (start: number | null | undefined, max: number | null | undefined): string => {
  if (!start && !max) return 'Not disclosed'
  if (!start) return `${max}%`
  if (!max) return `${start}%`
  const minVal = Math.min(start, max)
  const maxVal = Math.max(start, max)
  if (minVal === maxVal) return `${minVal}%`
  return `${minVal}% → ${maxVal}%`
}

// Format daily drawdown: 0% = "No daily limit"
const formatDailyDrawdown = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'Not disclosed'
  if (value === 0) return 'No daily limit'
  return `${value}%`
}

// Format max drawdown
const formatMaxDrawdown = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return 'Not disclosed'
  return `${value}%`
}

// Format price
const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return 'Not disclosed'
  return `$${value}`
}

// Check if firm is blocklisted
const isBlocklisted = (name: string): boolean => {
  return BLOCKLIST_FIRMS.some(blocked => 
    name.toLowerCase().includes(blocked.toLowerCase())
  )
}

// Get canonical name
const getCanonicalName = (name: string): string => {
  const lower = name.toLowerCase().replace(/\s+/g, '')
  for (const [key, value] of Object.entries(CANONICAL_FIRMS)) {
    if (lower.includes(key) || value.aliases.some(a => lower.includes(a.replace(/\s+/g, '')))) {
      return value.canonical
    }
  }
  return name
}

// =====================================================
// TOOLTIP COMPONENT
// =====================================================
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false)
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-56 z-50 border border-gray-700">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// TRUST BADGE WITH TOOLTIP
// =====================================================
const TrustBadge = ({ status }: { status: string }) => {
  const config = {
    verified: { 
      bg: 'bg-emerald-500/20', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/30', 
      label: 'Verified', 
      icon: BadgeCheck,
      tooltip: 'Verified means we confirmed this firm is active, pays traders, and has a real business presence.'
    },
    banned: { 
      bg: 'bg-red-500/20', 
      text: 'text-red-400', 
      border: 'border-red-500/30', 
      label: 'Avoid', 
      icon: X,
      tooltip: 'This firm has reported issues with payouts or business practices.'
    },
    under_review: { 
      bg: 'bg-yellow-500/20', 
      text: 'text-yellow-400', 
      border: 'border-yellow-500/30', 
      label: 'Under Review', 
      icon: AlertTriangle,
      tooltip: 'We are currently reviewing this firm.'
    },
    new: { 
      bg: 'bg-blue-500/20', 
      text: 'text-blue-400', 
      border: 'border-blue-500/30', 
      label: 'New', 
      icon: Sparkles,
      tooltip: 'This firm was recently added to our database.'
    },
  }
  const { bg, text, border, label, icon: Icon, tooltip } = config[status as keyof typeof config] || config.verified
  
  return (
    <Tooltip content={tooltip}>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text} border ${border} cursor-help`}>
        <Icon className="w-3 h-3" />
        {label}
        <Info className="w-3 h-3 opacity-60" />
      </span>
    </Tooltip>
  )
}

// =====================================================
// MARKET PILLS COMPONENT
// =====================================================
const MarketPills = ({ 
  selected, 
  onSelect 
}: { 
  selected: string | null; 
  onSelect: (market: string | null) => void 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {MARKET_TYPES.map(market => (
        <button
          key={market}
          onClick={() => onSelect(market === 'All' ? null : market)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            (market === 'All' && !selected) || selected === market
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {market}
        </button>
      ))}
    </div>
  )
}

// =====================================================
// PROMO BADGE COMPONENT
// =====================================================
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
            {copied ? <><CheckCircle2 className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> {code}</>}
          </button>
        )}
      </div>
    </div>
  )
}

// =====================================================
// RANKING BADGE COMPONENT
// =====================================================
const RankingBadge = ({ rank }: { rank: number }) => {
  if (!rank || rank <= 0 || rank > 3) return null
  const colors = { 1: 'from-amber-400 to-amber-600', 2: 'from-gray-300 to-gray-500', 3: 'from-amber-600 to-amber-800' }
  return (
    <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-lg bg-gradient-to-br ${colors[rank as keyof typeof colors]} flex items-center justify-center shadow-lg`}>
      <Trophy className="w-4 h-4 text-white" />
    </div>
  )
}

// =====================================================
// MARKET CHIPS COMPONENT
// =====================================================
const MarketChips = ({ markets }: { markets: MarketType[] }) => {
  const colors: Record<string, string> = {
    'Forex': 'bg-blue-500/20 text-blue-400',
    'Futures': 'bg-orange-500/20 text-orange-400',
    'Crypto': 'bg-purple-500/20 text-purple-400',
    'Indices': 'bg-cyan-500/20 text-cyan-400',
    'Metals': 'bg-yellow-500/20 text-yellow-400',
    'Stocks': 'bg-green-500/20 text-green-400',
  }
  
  return (
    <div className="flex flex-wrap gap-1">
      {markets.slice(0, 3).map(market => (
        <span key={market} className={`px-2 py-0.5 rounded text-xs font-medium ${colors[market] || 'bg-gray-500/20 text-gray-400'}`}>
          {market}
        </span>
      ))}
      {markets.length > 3 && (
        <span className="px-2 py-0.5 rounded text-xs text-gray-500">+{markets.length - 3}</span>
      )}
    </div>
  )
}

// =====================================================
// PROP FIRM CARD COMPONENT (Reduced density)
// =====================================================
const PropFirmCard = ({ firm, isCompact, rank, markets }: { 
  firm: PropFirm; 
  isCompact: boolean; 
  rank: number;
  markets: MarketType[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
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
                rank === 1 ? 'bg-amber-500 text-white' : rank === 2 ? 'bg-gray-400 text-white' : 'bg-amber-700 text-white'
              }`}>{rank}</span>
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
              </span>
              <span>{formatPrice(firm.min_price)}</span>
              <span className="text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/prop-firm/${firm.slug}`} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors">Details</Link>
            <a href={firm.affiliate_url || firm.website_url || '#'} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
              Visit <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  // Grid View - Reduced Density Card
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-2xl overflow-hidden transition-all duration-300 group relative flex flex-col h-full">
      {rank > 0 && rank <= 3 && <RankingBadge rank={rank} />}
      {hasDiscount && <PromoBadge percent={firm.discount_percent} code={firm.discount_code} />}
      
      {/* Header */}
      <div className={`p-5 pb-4 ${(rank <= 3 && rank > 0) && hasDiscount ? 'pt-14' : (rank <= 3 && rank > 0) || hasDiscount ? 'pt-12' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-2 flex-shrink-0">
            {firm.logo_url ? (
              <Image src={firm.logo_url} alt={firm.name} width={56} height={56} className="object-contain" />
            ) : (
              <span className="text-xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-bold text-white truncate">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-white">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
              {firm.trustpilot_reviews ? (
                <span className="text-gray-500 text-sm">({formatReviewCount(firm.trustpilot_reviews)})</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Stats - REDUCED: Only Price, Split, Max DD, Markets */}
      <div className="px-5 py-4 bg-gray-900/50 border-y border-gray-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
            <p className="text-lg font-bold text-white">{formatPrice(firm.min_price)}</p>
          </div>
          <div>
            <Tooltip content="Starting profit split → maximum after scaling (where applicable)">
              <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1 cursor-help">
                Profit Split <Info className="w-3 h-3" />
              </p>
            </Tooltip>
            <p className="text-lg font-bold text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Max Drawdown</p>
            <p className="text-white font-semibold">{formatMaxDrawdown(firm.max_total_drawdown)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Markets</p>
            <MarketChips markets={markets} />
          </div>
        </div>
      </div>
      
      {/* Show More Details */}
      <div className="p-5 flex-1">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4">
            {/* Daily Drawdown */}
            <div className="flex justify-between text-sm">
              <Tooltip content="This firm does not enforce a daily drawdown rule">
                <span className="text-gray-500 flex items-center gap-1 cursor-help">Daily Drawdown <Info className="w-3 h-3" /></span>
              </Tooltip>
              <span className="text-white">{formatDailyDrawdown(firm.max_daily_drawdown)}</span>
            </div>
            
            {/* Trading Rules */}
            <div className="flex flex-wrap gap-2">
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
            
            {/* More Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Profit Target:</span>
                <span className="text-white">{firm.profit_target_phase1 ? `${firm.profit_target_phase1}%` : 'Not disclosed'}</span>
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
                <span className="text-white">{firm.payout_frequency || 'Not disclosed'}</span>
              </div>
            </div>
            
            {/* Platforms */}
            {firm.platforms && firm.platforms.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Platforms</p>
                <div className="flex flex-wrap gap-1.5">
                  {firm.platforms.slice(0, 4).map((platform, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">{platform}</span>
                  ))}
                  {firm.platforms.length > 4 && (
                    <span className="px-2 py-0.5 rounded text-xs text-gray-500">+{firm.platforms.length - 4}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="p-5 pt-0 flex gap-3 mt-auto">
        <Link href={`/prop-firm/${firm.slug}`} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white text-center font-medium rounded-xl transition-colors">
          View Details
        </Link>
        <a href={firm.affiliate_url || firm.website_url || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-center font-medium rounded-xl transition-all flex items-center justify-center gap-2">
          Visit Site <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

// =====================================================
// VITRINE SECTION COMPONENT
// =====================================================
const VitrineSection = ({ 
  title, 
  subtitle,
  icon: Icon,
  firms, 
  slugs 
}: { 
  title: string;
  subtitle: string;
  icon: React.ElementType;
  firms: PropFirm[];
  slugs: string[];
}) => {
  const pickedFirms = firms.filter(f => slugs.includes(f.slug)).slice(0, 4)
  if (pickedFirms.length === 0) return null
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pickedFirms.map(firm => (
          <Link 
            key={firm.id} 
            href={`/prop-firm/${firm.slug}`}
            className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1">
                {firm.logo_url ? (
                  <Image src={firm.logo_url} alt={firm.name} width={40} height={40} className="object-contain" />
                ) : (
                  <span className="font-bold text-emerald-600">{firm.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{firm.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-400">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">From {formatPrice(firm.min_price)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

// =====================================================
// FILTER SECTION COMPONENT
// =====================================================
const FilterSection = ({ 
  filters, 
  setFilters,
  firms,
  isOpenDefault = true
}: { 
  filters: FilterState; 
  setFilters: (f: FilterState) => void;
  firms: PropFirm[];
  isOpenDefault?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault)
  
  const platforms = useMemo(() => {
    const all = firms.flatMap(f => f.platforms || [])
    const normalized = all.map(p => p === 'DXtrade' ? 'DXTrade' : p === 'MatchTrader' ? 'Match-Trader' : p)
    return Array.from(new Set(normalized)).sort()
  }, [firms])
  
  const discountCount = useMemo(() => firms.filter(f => f.discount_percent != null && f.discount_percent > 0).length, [firms])
  const highRatedCount = useMemo(() => firms.filter(f => f.trustpilot_rating >= 4.5).length, [firms])
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors lg:cursor-default">
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
          <button
            onClick={() => setFilters({ ...filters, hasDiscount: !filters.hasDiscount })}
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
              filters.hasDiscount
                ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-gray-700 text-gray-300 border border-transparent hover:bg-gray-600'
            }`}
          >
            <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> With Discount Only</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${filters.hasDiscount ? 'bg-orange-500/30' : 'bg-gray-600'}`}>{discountCount}</span>
          </button>
          
          {/* 4.5+ Rating Toggle */}
          <button
            onClick={() => setFilters({ ...filters, highRatingOnly: !filters.highRatingOnly })}
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
              filters.highRatingOnly
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-gray-700 text-gray-300 border border-transparent hover:bg-gray-600'
            }`}
          >
            <span className="flex items-center gap-2"><Star className="w-4 h-4" /> 4.5+ Rated Only</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${filters.highRatingOnly ? 'bg-yellow-500/30' : 'bg-gray-600'}`}>{highRatedCount}</span>
          </button>
          
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Max Price: ${filters.maxPrice ?? 'Any'}</label>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.maxPrice ?? 1000}
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
                      ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >{split}%+</button>
              ))}
            </div>
          </div>
          
          {/* Trading Style Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Trading Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'allowsScalping' as const, label: 'Scalping' },
                { key: 'allowsNewsTrading' as const, label: 'News Trading' },
                { key: 'allowsEA' as const, label: 'EAs Allowed' },
                { key: 'hasInstantFunding' as const, label: 'Instant Funding' },
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
              value={filters.platform ?? ''}
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

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function ComparePageClient({ firms }: ComparePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({})
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'split' | 'discount'>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnlyVerified, setShowOnlyVerified] = useState(true)
  
  // Process firms: blocklist, deduplication, market normalization
  const processedFirms = useMemo(() => {
    // 1. Filter out blocklisted firms
    let result = firms.filter(f => !isBlocklisted(f.name))
    
    // 2. Deduplicate using canonical names
    const seen = new Map<string, PropFirm>()
    result.forEach(firm => {
      const canonical = getCanonicalName(firm.name).toLowerCase()
      const existing = seen.get(canonical)
      if (!existing) {
        seen.set(canonical, firm)
      } else {
        // Merge: prefer the one with better data
        const score = (f: PropFirm) => 
          (f.website_url && f.website_url !== '#' ? 10 : 0) +
          (f.affiliate_url ? 5 : 0) +
          (f.discount_code ? 3 : 0) +
          (f.trustpilot_rating ? 2 : 0) +
          (f.min_price ? 1 : 0)
        
        if (score(firm) > score(existing)) {
          seen.set(canonical, firm)
        }
      }
    })
    
    return Array.from(seen.values())
  }, [firms])
  
  // Compute markets for each firm
  const firmMarkets = useMemo(() => {
    const map = new Map<string, MarketType[]>()
    processedFirms.forEach(f => {
      map.set(f.id, normalizeMarket(f.assets, f.is_futures))
    })
    return map
  }, [processedFirms])
  
  // Filter and sort firms
  const filteredFirms = useMemo(() => {
    let result = [...processedFirms]
    
    // Trust status
    if (showOnlyVerified) {
      result = result.filter(f => f.trust_status === 'verified' || !f.trust_status)
    } else {
      result = result.filter(f => f.trust_status !== 'banned')
    }
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f => f.name?.toLowerCase().includes(q) || f.slug?.toLowerCase().includes(q))
    }
    
    // Market filter
    if (selectedMarket) {
      result = result.filter(f => {
        const markets = firmMarkets.get(f.id) || []
        return markets.includes(selectedMarket as MarketType)
      })
    }
    
    // Discount filter
    if (filters.hasDiscount) {
      result = result.filter(f => f.discount_percent != null && f.discount_percent > 0)
    }
    
    // 4.5+ rating filter
    if (filters.highRatingOnly) {
      result = result.filter(f => f.trustpilot_rating >= 4.5)
    }
    
    // Price filter
    if (filters.maxPrice && filters.maxPrice < 1000) {
      result = result.filter(f => f.min_price <= filters.maxPrice!)
    }
    
    // Profit split filter
    if (filters.minProfitSplit) {
      result = result.filter(f => f.max_profit_split >= filters.minProfitSplit!)
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
    
    // Sorting: Promo first, then by selected sort
    result.sort((a, b) => {
      const aHasPromo = (a.discount_percent ?? 0) > 0 ? 1 : 0
      const bHasPromo = (b.discount_percent ?? 0) > 0 ? 1 : 0
      if (bHasPromo !== aHasPromo) return bHasPromo - aHasPromo
      if (aHasPromo && bHasPromo) return (b.discount_percent ?? 0) - (a.discount_percent ?? 0)
      
      switch (sortBy) {
        case 'rating': return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
        case 'price': return (a.min_price || 0) - (b.min_price || 0)
        case 'split': return (b.max_profit_split || 0) - (a.max_profit_split || 0)
        case 'discount': return (b.discount_percent || 0) - (a.discount_percent || 0)
        default: return 0
      }
    })
    
    return result
  }, [processedFirms, firmMarkets, searchQuery, selectedMarket, filters, sortBy, showOnlyVerified])
  
  // Stats
  const stats = useMemo(() => {
    const verifiedFirms = processedFirms.filter(f => f.trust_status === 'verified' || !f.trust_status)
    const withDiscounts = verifiedFirms.filter(f => f.discount_percent != null && f.discount_percent > 0)
    const avgRating = verifiedFirms.reduce((sum, f) => sum + (f.trustpilot_rating || 0), 0) / verifiedFirms.length
    const avgSplit = verifiedFirms.reduce((sum, f) => sum + (f.max_profit_split || 0), 0) / verifiedFirms.length
    
    return {
      total: verifiedFirms.length,
      avgRating: isNaN(avgRating) ? '0.0' : avgRating.toFixed(1),
      avgSplit: isNaN(avgSplit) ? 0 : Math.round(avgSplit),
      withDiscounts: withDiscounts.length
    }
  }, [processedFirms])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4">
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
            <div 
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center group hover:border-orange-500/30 transition-colors cursor-pointer"
              onClick={() => setFilters({ ...filters, hasDiscount: true })}
            >
              <p className="text-3xl font-bold text-orange-400">{stats.withDiscounts}</p>
              <p className="text-sm text-gray-500 group-hover:text-orange-400 transition-colors">With Discounts 🔥</p>
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
      
      {/* Vitrines / Decision Helpers */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <VitrineSection 
            title="Best for Beginners" 
            subtitle="Easy to pass, great support, beginner-friendly rules"
            icon={Users}
            firms={processedFirms}
            slugs={BEGINNER_PICKS}
          />
          <VitrineSection 
            title="Best Value Picks" 
            subtitle="Great features at competitive prices"
            icon={DollarSign}
            firms={processedFirms}
            slugs={BEST_VALUE_PICKS}
          />
        </div>
      </section>
      
      {/* Market Pills */}
      <section className="px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Filter by Markets Traded</h3>
          <MarketPills selected={selectedMarket} onSelect={setSelectedMarket} />
        </div>
      </section>
      
      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1 space-y-6">
              <FilterSection filters={filters} setFilters={setFilters} firms={processedFirms} isOpenDefault={true} />
              
              {/* View Options */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-3">View Options</h3>
                <div className="flex gap-2 mb-4">
                  {[
                    { mode: 'grid' as const, icon: Grid3X3 },
                    { mode: 'list' as const, icon: List },
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center text-sm transition-all ${
                        viewMode === mode ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
                    className={`w-12 h-6 rounded-full transition-colors relative ${showOnlyVerified ? 'bg-emerald-500' : 'bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${showOnlyVerified ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content - Firms List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  Showing <span className="text-white font-medium">{filteredFirms.length}</span> prop firms
                  {selectedMarket && <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">{selectedMarket}</span>}
                  {filters.hasDiscount && <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">With Discounts</span>}
                  {filters.highRatingOnly && <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">4.5+ ⭐</span>}
                </p>
                {(Object.values(filters).some(v => v) || selectedMarket) && (
                  <button onClick={() => { setFilters({}); setSelectedMarket(null); }} className="text-sm text-emerald-400 hover:text-emerald-300">
                    Clear Filters
                  </button>
                )}
              </div>
              
              {/* Grid/List View */}
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredFirms.map((firm, index) => (
                  <PropFirmCard 
                    key={firm.id} 
                    firm={firm} 
                    isCompact={viewMode === 'list'}
                    rank={index + 1}
                    markets={firmMarkets.get(firm.id) || ['Forex']}
                  />
                ))}
              </div>
              
              {/* Empty State */}
              {filteredFirms.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No firms found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                  <button
                    onClick={() => { setFilters({}); setSearchQuery(''); setSelectedMarket(null); }}
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
