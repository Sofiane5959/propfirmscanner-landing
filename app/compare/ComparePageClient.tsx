'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, ChevronDown, ChevronUp, Star, Check, X, 
  Grid3X3, List, ExternalLink, Sparkles,
  AlertTriangle, BarChart3, Info,
  Tag, Trophy, BadgeCheck, Copy, CheckCircle2,
  ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw,
  ShieldCheck, Heart, GitCompare, Zap, TrendingUp,
  DollarSign, Users, Award, Flame
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
  search: string
  market: string | null
  tradingStyle: string[]
  priceRange: [number, number]
  minRating: number | null
  minProfitSplit: number | null
  challengeType: string | null
  platform: string | null
  hasDiscount: boolean
  verifiedOnly: boolean
  bestFor: string | null
}

// =====================================================
// CONSTANTS
// =====================================================
const MARKET_TYPES = ['All', 'Forex', 'Futures', 'Crypto', 'Indices', 'Metals', 'Stocks'] as const
type MarketType = typeof MARKET_TYPES[number]

const TRADING_STYLES = [
  { key: 'scalping', label: 'Scalping', field: 'allows_scalping' },
  { key: 'news', label: 'News Trading', field: 'allows_news_trading' },
  { key: 'ea', label: 'EAs/Bots', field: 'allows_ea' },
  { key: 'swing', label: 'Swing', field: 'allows_weekend_holding' },
  { key: 'instant', label: 'Instant Funding', field: 'has_instant_funding' },
] as const

const BEST_FOR_OPTIONS = [
  { key: 'beginners', label: 'Best for Beginners', icon: Users, color: 'blue' },
  { key: 'value', label: 'Best Value', icon: DollarSign, color: 'green' },
  { key: 'forex', label: 'Best for Forex', icon: TrendingUp, color: 'cyan' },
  { key: 'futures', label: 'Best for Futures', icon: BarChart3, color: 'orange' },
  { key: 'crypto', label: 'Best for Crypto', icon: Zap, color: 'purple' },
  { key: 'scalpers', label: 'Best for Scalpers', icon: Flame, color: 'red' },
] as const

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rating' },
  { value: 'price', label: 'Lowest Price' },
  { value: 'split', label: 'Highest Split' },
  { value: 'discount', label: 'Best Deals' },
  { value: 'reviews', label: 'Most Reviews' },
]

const BLOCKLIST_FIRMS = ['fundedtech', 'fake prop firm', 'test firm']

const CANONICAL_FIRMS: Record<string, { canonical: string; aliases: string[] }> = {
  'fundednext': { canonical: 'FundedNext', aliases: ['funded next', 'fundednext futures'] },
  'the5ers': { canonical: 'The5ers', aliases: ['the 5ers', 'the5%ers'] },
  'ftmo': { canonical: 'FTMO', aliases: ['ftmo.com'] },
  'myfundedfx': { canonical: 'MyFundedFX', aliases: ['my funded fx'] },
  'topstep': { canonical: 'Topstep', aliases: ['topstep trader'] },
}

// =====================================================
// HELPERS
// =====================================================
const normalizeMarket = (assets: string[] | undefined, isFutures: boolean): MarketType[] => {
  const markets: MarketType[] = []
  if (isFutures) markets.push('Futures')
  if (!assets || assets.length === 0) return isFutures ? ['Futures'] : ['Forex']
  
  assets.forEach(asset => {
    const lower = asset.toLowerCase()
    if (lower.includes('forex') || lower.includes('fx') || lower.includes('eur') || lower.includes('usd')) { if (!markets.includes('Forex')) markets.push('Forex') }
    if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('btc')) { if (!markets.includes('Crypto')) markets.push('Crypto') }
    if (lower.includes('indices') || lower.includes('index') || lower.includes('nas') || lower.includes('dow')) { if (!markets.includes('Indices')) markets.push('Indices') }
    if (lower.includes('metal') || lower.includes('gold') || lower.includes('xau')) { if (!markets.includes('Metals')) markets.push('Metals') }
    if (lower.includes('stock') || lower.includes('equity')) { if (!markets.includes('Stocks')) markets.push('Stocks') }
    if (lower.includes('futures') || lower.includes('future')) { if (!markets.includes('Futures')) markets.push('Futures') }
  })
  
  if (markets.length === 0) markets.push('Forex')
  return markets
}

const formatReviewCount = (count: number | null | undefined): string => {
  if (!count) return ''
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  return count.toString()
}

const formatProfitSplit = (start: number | null | undefined, max: number | null | undefined): string => {
  if (!start && !max) return 'N/A'
  if (!start) return `${max}%`
  if (!max) return `${start}%`
  const minVal = Math.min(start, max), maxVal = Math.max(start, max)
  if (minVal === maxVal) return `${minVal}%`
  return `${minVal}→${maxVal}%`
}

const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return 'N/A'
  return `$${value}`
}

const formatMaxDrawdown = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return 'N/A'
  return `${value}%`
}

const isBlocklisted = (name: string): boolean => BLOCKLIST_FIRMS.some(b => name.toLowerCase().includes(b))

const getCanonicalName = (name: string): string => {
  const lower = name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')
  for (const [key, value] of Object.entries(CANONICAL_FIRMS)) {
    if (lower.includes(key) || value.aliases.some(a => lower.includes(a.replace(/\s+/g, '')))) return value.canonical
  }
  return name
}

const getFirmUrl = (firm: PropFirm): string => {
  if (firm.affiliate_url && firm.affiliate_url !== '#') return firm.affiliate_url
  if (firm.website_url && firm.website_url !== '#') return firm.website_url
  return `https://www.google.com/search?q=${encodeURIComponent(firm.name + ' prop firm')}`
}

const getBestForScore = (firm: PropFirm, category: string, markets: MarketType[]): number => {
  switch (category) {
    case 'beginners':
      let score = 0
      if (firm.min_price && firm.min_price <= 100) score += 30
      if (firm.trustpilot_rating >= 4.3) score += 25
      if (firm.max_daily_drawdown === 0 || firm.max_daily_drawdown >= 5) score += 20
      if (firm.min_trading_days === 0) score += 15
      if (firm.fee_refund) score += 10
      return score
    case 'value':
      let vScore = 0
      if (firm.min_price && firm.min_price <= 50) vScore += 35
      if (firm.max_profit_split >= 90) vScore += 25
      if (firm.discount_percent > 0) vScore += 20
      if (firm.fee_refund) vScore += 20
      return vScore
    case 'forex':
      return markets.includes('Forex') ? 100 + (firm.trustpilot_rating || 0) * 10 : 0
    case 'futures':
      return markets.includes('Futures') || firm.is_futures ? 100 + (firm.trustpilot_rating || 0) * 10 : 0
    case 'crypto':
      return markets.includes('Crypto') ? 100 + (firm.trustpilot_rating || 0) * 10 : 0
    case 'scalpers':
      let sScore = 0
      if (firm.allows_scalping) sScore += 50
      if (firm.max_daily_drawdown === 0 || firm.max_daily_drawdown >= 5) sScore += 25
      if (firm.trustpilot_rating >= 4) sScore += 25
      return sScore
    default:
      return 0
  }
}

// =====================================================
// TOAST COMPONENT
// =====================================================
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = { success: 'bg-emerald-500', error: 'bg-red-500', info: 'bg-blue-500' }

  return (
    <div className={`fixed bottom-4 right-4 z-[60] px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg flex items-center gap-2 animate-slide-up ${colors[type]}`}>
      {type === 'success' && <CheckCircle2 className="w-4 h-4" />}
      {message}
    </div>
  )
}

// =====================================================
// TOOLTIP COMPONENT
// =====================================================
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>{children}</div>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg w-56 z-50 border border-gray-700 pointer-events-none">
          {content}
        </div>
      )}
    </div>
  )
}

// =====================================================
// TRUST BADGE
// =====================================================
const TrustBadge = ({ status }: { status: string }) => {
  const config = {
    verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Verified', icon: BadgeCheck, tooltip: 'Scanned & verified' },
    banned: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Avoid', icon: X, tooltip: 'Reported issues' },
    under_review: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Review', icon: AlertTriangle, tooltip: 'Under review' },
    new: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'New', icon: Sparkles, tooltip: 'Recently added' },
  }
  const { bg, text, label, icon: Icon, tooltip } = config[status as keyof typeof config] || config.verified
  
  return (
    <Tooltip content={tooltip}>
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${bg} ${text} cursor-help`}>
        <Icon className="w-3 h-3" />{label}
      </span>
    </Tooltip>
  )
}

// =====================================================
// PRICE SLIDER
// =====================================================
const PriceSlider = ({ value, onChange, min = 0, max = 1000 }: { value: [number, number]; onChange: (v: [number, number]) => void; min?: number; max?: number }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>${value[0]}</span>
        <span>{value[1] >= max ? 'Any' : `$${value[1]}`}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={25}
        value={value[1]}
        onChange={(e) => onChange([value[0], Number(e.target.value)])}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>$0</span>
        <span>$500</span>
        <span>Any</span>
      </div>
    </div>
  )
}

// =====================================================
// MARKET CHIPS
// =====================================================
const MarketChips = ({ markets }: { markets: MarketType[] }) => {
  const colors: Record<string, string> = { 
    'Forex': 'bg-blue-500/20 text-blue-400', 
    'Futures': 'bg-orange-500/20 text-orange-400', 
    'Crypto': 'bg-purple-500/20 text-purple-400', 
    'Indices': 'bg-cyan-500/20 text-cyan-400', 
    'Metals': 'bg-yellow-500/20 text-yellow-400', 
    'Stocks': 'bg-green-500/20 text-green-400' 
  }
  return (
    <div className="flex flex-wrap gap-1">
      {markets.slice(0, 2).map(m => <span key={m} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[m]}`}>{m}</span>)}
      {markets.length > 2 && <span className="text-[10px] text-gray-500">+{markets.length - 2}</span>}
    </div>
  )
}

// =====================================================
// FILTER CHIP
// =====================================================
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
    {label}
    <button onClick={onRemove} className="hover:bg-emerald-500/30 rounded-full p-0.5"><X className="w-3 h-3" /></button>
  </span>
)

// =====================================================
// VITRINE SECTION
// =====================================================
const VitrineSection = ({ title, icon: Icon, color, firms, firmMarkets, onFavorite, favorites, onCompare, compareList }: { 
  title: string; icon: any; color: string; firms: PropFirm[]; firmMarkets: Map<string, MarketType[]>
  onFavorite: (id: string) => void; favorites: string[]; onCompare: (id: string) => void; compareList: string[]
}) => {
  if (firms.length === 0) return null
  
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400',
    green: 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400',
    cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
    orange: 'from-orange-500/20 to-transparent border-orange-500/30 text-orange-400',
    purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
    red: 'from-red-500/20 to-transparent border-red-500/30 text-red-400',
  }
  
  return (
    <div className="mb-6">
      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-gradient-to-r ${colorMap[color]} border`}>
        <Icon className="w-4 h-4" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {firms.slice(0, 4).map((firm) => (
          <MiniCard key={firm.id} firm={firm} markets={firmMarkets.get(firm.id) || ['Forex']} isFavorite={favorites.includes(firm.id)} onFavorite={() => onFavorite(firm.id)} isComparing={compareList.includes(firm.id)} onCompare={() => onCompare(firm.id)} />
        ))}
      </div>
    </div>
  )
}

// =====================================================
// MINI CARD
// =====================================================
const MiniCard = ({ firm, markets, isFavorite, onFavorite, isComparing, onCompare }: { 
  firm: PropFirm; markets: MarketType[]; isFavorite: boolean; onFavorite: () => void; isComparing: boolean; onCompare: () => void
}) => {
  const hasDiscount = firm.discount_percent != null && firm.discount_percent > 0
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-lg p-3 transition-all relative group">
      {hasDiscount && (
        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded">
          {firm.discount_percent}% OFF
        </span>
      )}
      
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0">
          {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={32} height={32} className="object-contain" /> : <span className="text-xs font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">{firm.name}</h4>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white">{firm.trustpilot_rating?.toFixed(1) || '-'}</span>
            <TrustBadge status={firm.trust_status || 'verified'} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div><span className="text-gray-500">Price:</span> <span className="text-white font-medium">{formatPrice(firm.min_price)}</span></div>
        <div><span className="text-gray-500">Split:</span> <span className="text-emerald-400 font-medium">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</span></div>
      </div>
      
      <MarketChips markets={markets} />
      
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button onClick={(e) => { e.preventDefault(); onFavorite(); }} className={`p-1.5 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-red-400'}`}>
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <button onClick={(e) => { e.preventDefault(); onCompare(); }} className={`p-1.5 rounded-full ${isComparing ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-emerald-400'}`}>
          <GitCompare className="w-3.5 h-3.5" />
        </button>
        <Link href={`/prop-firm/${firm.slug}`} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors">View</Link>
      </div>
    </div>
  )
}

// =====================================================
// PROP FIRM CARD
// =====================================================
const PropFirmCard = ({ firm, isCompact, rank, markets, isFavorite, onFavorite, isComparing, onCompare, onCopyCode }: { 
  firm: PropFirm; isCompact: boolean; rank: number; markets: MarketType[]; isFavorite: boolean; onFavorite: () => void; isComparing: boolean; onCompare: () => void; onCopyCode: (code: string) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasDiscount = firm.discount_percent != null && firm.discount_percent > 0
  const firmUrl = getFirmUrl(firm)
  
  if (isCompact) {
    return (
      <div className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 rounded-lg p-3 transition-all relative">
        {hasDiscount && <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded">{firm.discount_percent}%</span>}
        
        <div className="flex items-center gap-3">
          <button onClick={onCompare} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isComparing ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 hover:border-emerald-500'}`}>
            {isComparing && <Check className="w-3 h-3 text-white" />}
          </button>
          
          {rank > 0 && rank <= 3 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rank === 1 ? 'bg-amber-500 text-white' : rank === 2 ? 'bg-gray-400 text-white' : 'bg-amber-700 text-white'}`}>{rank}</span>}
          
          <div className="w-9 h-9 rounded bg-white flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={36} height={36} className="object-contain" /> : <span className="text-sm font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-white text-sm truncate">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{firm.trustpilot_rating?.toFixed(1) || '-'}</span>
              <span>{formatPrice(firm.min_price)}</span>
              <span className="text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button onClick={onFavorite} className={`p-1.5 rounded ${isFavorite ? 'text-red-400' : 'text-gray-500 hover:text-red-400'}`}>
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <Link href={`/prop-firm/${firm.slug}`} className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors">Details</Link>
            <a href={firmUrl} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1">Visit<ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl overflow-hidden transition-all group relative flex flex-col h-full">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <button onClick={onCompare} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isComparing ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 bg-gray-800/80 hover:border-emerald-500'}`}>
          {isComparing && <Check className="w-3 h-3 text-white" />}
        </button>
        {rank > 0 && rank <= 3 && (
          <div className={`w-6 h-6 rounded bg-gradient-to-br ${rank === 1 ? 'from-amber-400 to-amber-600' : rank === 2 ? 'from-gray-300 to-gray-500' : 'from-amber-600 to-amber-800'} flex items-center justify-center shadow`}>
            <Trophy className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <button onClick={onFavorite} className={`p-1.5 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-800/80 text-gray-400 hover:text-red-400'}`}>
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {hasDiscount && (
          <button onClick={() => firm.discount_code && onCopyCode(firm.discount_code)} className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg hover:scale-105 transition-transform">
            {firm.discount_percent}% OFF
            {firm.discount_code && <span className="block text-[9px] font-normal opacity-80">{firm.discount_code}</span>}
          </button>
        )}
      </div>
      
      <div className="p-4 pb-3 pt-10">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-1.5 flex-shrink-0">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={44} height={44} className="object-contain" /> : <span className="text-lg font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-base font-bold text-white truncate">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-white text-sm">{firm.trustpilot_rating?.toFixed(1) || '-'}</span>
              {firm.trustpilot_reviews ? <span className="text-gray-500 text-xs">({formatReviewCount(firm.trustpilot_reviews)})</span> : null}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-900/50 border-y border-gray-700/50">
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[10px] text-gray-500 uppercase">Price</p><p className="text-sm font-bold text-white">{formatPrice(firm.min_price)}</p></div>
          <div><p className="text-[10px] text-gray-500 uppercase">Split</p><p className="text-sm font-bold text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</p></div>
          <div><p className="text-[10px] text-gray-500 uppercase">Max DD</p><p className="text-sm text-white">{formatMaxDrawdown(firm.max_total_drawdown)}</p></div>
          <div><p className="text-[10px] text-gray-500 uppercase">Markets</p><MarketChips markets={markets} /></div>
        </div>
      </div>
      
      <div className="p-4 pt-2 flex-1">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          {isExpanded ? 'Less' : 'More'}{isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-2 text-xs">
            <div className="flex flex-wrap gap-1">
              {firm.allows_scalping && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">Scalping</span>}
              {firm.allows_news_trading && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">News</span>}
              {firm.allows_ea && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">EAs</span>}
              {firm.has_instant_funding && <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-[10px]">Instant</span>}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 pt-0 flex gap-2 mt-auto">
        <Link href={`/prop-firm/${firm.slug}`} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-center text-sm font-medium rounded-lg transition-colors">Details</Link>
        <a href={firmUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-center text-sm font-medium rounded-lg flex items-center justify-center gap-1">Visit<ExternalLink className="w-3.5 h-3.5" /></a>
      </div>
    </div>
  )
}

// =====================================================
// COMPARISON BAR
// =====================================================
const ComparisonBar = ({ firms, onRemove, onClear }: { firms: PropFirm[]; onRemove: (id: string) => void; onClear: () => void }) => {
  if (firms.length === 0) return null
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 border-t border-gray-700 backdrop-blur-sm p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-white">Compare ({firms.length}/4)</span>
          <div className="flex items-center gap-2">
            {firms.map(firm => (
              <div key={firm.id} className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full">
                <span className="text-xs text-white">{firm.name}</span>
                <button onClick={() => onRemove(firm.id)} className="text-gray-400 hover:text-red-400"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">Clear</button>
          <Link href={`/compare/${firms.map(f => f.slug).join('-vs-')}`} className={`px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors ${firms.length < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function ComparePageClient({ firms }: ComparePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get('q') || '',
    market: searchParams.get('market'),
    tradingStyle: searchParams.get('style')?.split(',').filter(Boolean) || [],
    priceRange: [Number(searchParams.get('minPrice')) || 0, Number(searchParams.get('maxPrice')) || 1000],
    minRating: searchParams.get('rating') ? Number(searchParams.get('rating')) : null,
    minProfitSplit: searchParams.get('split') ? Number(searchParams.get('split')) : null,
    challengeType: searchParams.get('challenge'),
    platform: searchParams.get('platform'),
    hasDiscount: searchParams.get('deals') === 'true',
    verifiedOnly: searchParams.get('verified') !== 'false',
    bestFor: searchParams.get('bestFor'),
  }))
  
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(24)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  
  useEffect(() => {
    const saved = localStorage.getItem('propfirm-favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])
  
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('propfirm-favorites', JSON.stringify(next))
      setToast({ message: prev.includes(id) ? 'Removed from favorites' : 'Added to favorites', type: 'success' })
      return next
    })
  }, [])
  
  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(f => f !== id)
      if (prev.length >= 4) { setToast({ message: 'Maximum 4 firms to compare', type: 'error' }); return prev }
      return [...prev, id]
    })
  }, [])
  
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
    setToast({ message: `Code "${code}" copied!`, type: 'success' })
  }, [])
  
  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('q', filters.search)
    if (filters.market) params.set('market', filters.market)
    if (filters.tradingStyle.length) params.set('style', filters.tradingStyle.join(','))
    if (filters.priceRange[0] > 0) params.set('minPrice', String(filters.priceRange[0]))
    if (filters.priceRange[1] < 1000) params.set('maxPrice', String(filters.priceRange[1]))
    if (filters.minRating) params.set('rating', String(filters.minRating))
    if (filters.minProfitSplit) params.set('split', String(filters.minProfitSplit))
    if (filters.challengeType) params.set('challenge', filters.challengeType)
    if (filters.platform) params.set('platform', filters.platform)
    if (filters.hasDiscount) params.set('deals', 'true')
    if (!filters.verifiedOnly) params.set('verified', 'false')
    if (filters.bestFor) params.set('bestFor', filters.bestFor)
    if (sortBy !== 'rating') params.set('sort', sortBy)
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/compare'
    router.replace(newUrl, { scroll: false })
  }, [filters, sortBy, router])
  
  const processedFirms = useMemo(() => {
    const filtered = firms.filter(f => !isBlocklisted(f.name))
    const seen = new Map<string, PropFirm>()
    filtered.forEach(firm => {
      const canonical = getCanonicalName(firm.name).toLowerCase().replace(/\s+/g, '')
      const existing = seen.get(canonical)
      if (!existing) { seen.set(canonical, firm) }
      else {
        const score = (f: PropFirm) => (f.website_url && f.website_url !== '#' ? 10 : 0) + (f.affiliate_url ? 5 : 0) + (f.discount_code ? 3 : 0) + (f.trustpilot_rating ? 2 : 0) + (f.min_price ? 1 : 0)
        if (score(firm) > score(existing)) seen.set(canonical, firm)
      }
    })
    return Array.from(seen.values())
  }, [firms])
  
  const firmMarkets = useMemo(() => {
    const map = new Map<string, MarketType[]>()
    processedFirms.forEach(f => map.set(f.id, normalizeMarket(f.assets, f.is_futures)))
    return map
  }, [processedFirms])
  
  const platforms = useMemo(() => Array.from(new Set(processedFirms.flatMap(f => f.platforms || []))).filter(Boolean).sort(), [processedFirms])
  
  const stats = useMemo(() => {
    const verified = processedFirms.filter(f => f.trust_status === 'verified' || !f.trust_status)
    const discounts = verified.filter(f => f.discount_percent != null && f.discount_percent > 0)
    return { total: verified.length, withDiscounts: discounts.length }
  }, [processedFirms])
  
  const bestForVitrines = useMemo(() => {
    const vitrines: Record<string, PropFirm[]> = {}
    BEST_FOR_OPTIONS.forEach(opt => {
      const scored = processedFirms
        .filter(f => f.trust_status === 'verified' || !f.trust_status)
        .map(f => ({ firm: f, score: getBestForScore(f, opt.key, firmMarkets.get(f.id) || ['Forex']) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(x => x.firm)
      vitrines[opt.key] = scored
    })
    return vitrines
  }, [processedFirms, firmMarkets])
  
  const filteredFirms = useMemo(() => {
    let result = [...processedFirms]
    
    if (filters.verifiedOnly) result = result.filter(f => f.trust_status === 'verified' || !f.trust_status)
    else result = result.filter(f => f.trust_status !== 'banned')
    
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(f => f.name?.toLowerCase().includes(q) || f.slug?.toLowerCase().includes(q))
    }
    
    if (filters.market) result = result.filter(f => (firmMarkets.get(f.id) || []).includes(filters.market as MarketType))
    
    if (filters.tradingStyle.length > 0) {
      result = result.filter(f => {
        return filters.tradingStyle.every(style => {
          const styleConfig = TRADING_STYLES.find(s => s.key === style)
          if (!styleConfig) return true
          return f[styleConfig.field as keyof PropFirm]
        })
      })
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      result = result.filter(f => {
        if (!f.min_price) return filters.priceRange[0] === 0
        return f.min_price >= filters.priceRange[0] && (filters.priceRange[1] >= 1000 || f.min_price <= filters.priceRange[1])
      })
    }
    
    if (filters.minRating) result = result.filter(f => f.trustpilot_rating >= filters.minRating!)
    if (filters.minProfitSplit) result = result.filter(f => f.max_profit_split >= filters.minProfitSplit!)
    if (filters.challengeType) result = result.filter(f => f.challenge_types?.some(t => t.toLowerCase().includes(filters.challengeType!.toLowerCase())))
    if (filters.platform) result = result.filter(f => f.platforms?.includes(filters.platform!))
    if (filters.hasDiscount) result = result.filter(f => f.discount_percent != null && f.discount_percent > 0)
    
    if (filters.bestFor) {
      const scored = result.map(f => ({ firm: f, score: getBestForScore(f, filters.bestFor!, firmMarkets.get(f.id) || ['Forex']) })).filter(x => x.score > 0).sort((a, b) => b.score - a.score)
      result = scored.map(x => x.firm)
    }
    
    if (!filters.bestFor) {
      result.sort((a, b) => {
        const aPromo = (a.discount_percent ?? 0) > 0 ? 1 : 0
        const bPromo = (b.discount_percent ?? 0) > 0 ? 1 : 0
        if (bPromo !== aPromo) return bPromo - aPromo
        
        switch (sortBy) {
          case 'rating': return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
          case 'price': return (a.min_price || 9999) - (b.min_price || 9999)
          case 'split': return (b.max_profit_split || 0) - (a.max_profit_split || 0)
          case 'discount': return (b.discount_percent || 0) - (a.discount_percent || 0)
          case 'reviews': return (b.trustpilot_reviews || 0) - (a.trustpilot_reviews || 0)
          default: return 0
        }
      })
    }
    
    return result
  }, [processedFirms, firmMarkets, filters, sortBy])
  
  useEffect(() => { setCurrentPage(1) }, [filters, sortBy])
  
  const paginatedFirms = useMemo(() => filteredFirms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredFirms, currentPage, itemsPerPage])
  const totalPages = Math.ceil(filteredFirms.length / itemsPerPage)
  const compareFirms = useMemo(() => processedFirms.filter(f => compareList.includes(f.id)), [processedFirms, compareList])
  
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    if (filters.market) chips.push({ key: 'market', label: filters.market, onRemove: () => setFilters(f => ({ ...f, market: null })) })
    filters.tradingStyle.forEach(style => {
      const s = TRADING_STYLES.find(x => x.key === style)
      if (s) chips.push({ key: style, label: s.label, onRemove: () => setFilters(f => ({ ...f, tradingStyle: f.tradingStyle.filter(x => x !== style) })) })
    })
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      chips.push({ key: 'price', label: `$${filters.priceRange[0]}-${filters.priceRange[1] >= 1000 ? 'Any' : '$' + filters.priceRange[1]}`, onRemove: () => setFilters(f => ({ ...f, priceRange: [0, 1000] })) })
    }
    if (filters.minRating) chips.push({ key: 'rating', label: `${filters.minRating}+ Rating`, onRemove: () => setFilters(f => ({ ...f, minRating: null })) })
    if (filters.hasDiscount) chips.push({ key: 'deals', label: 'Deals Only', onRemove: () => setFilters(f => ({ ...f, hasDiscount: false })) })
    if (filters.bestFor) {
      const bf = BEST_FOR_OPTIONS.find(x => x.key === filters.bestFor)
      if (bf) chips.push({ key: 'bestFor', label: bf.label, onRemove: () => setFilters(f => ({ ...f, bestFor: null })) })
    }
    return chips
  }, [filters])
  
  const resetFilters = () => {
    setFilters({ search: '', market: null, tradingStyle: [], priceRange: [0, 1000], minRating: null, minProfitSplit: null, challengeType: null, platform: null, hasDiscount: false, verifiedOnly: true, bestFor: null })
  }

  const showVitrines = !filters.search && !filters.market && filters.tradingStyle.length === 0 && filters.priceRange[0] === 0 && filters.priceRange[1] === 1000 && !filters.minRating && !filters.hasDiscount && !filters.bestFor

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* HEADER */}
      <section className="pt-20 pb-4 px-4 border-b border-gray-800 sticky top-16 z-30 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-white">Compare Prop Firms</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">Scanned & Verified</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{stats.total} verified firms • Updated Jan 2026</p>
            </div>
            <div className="flex items-center gap-2">
              {favorites.length > 0 && (
                <Link href="/dashboard/favorites" className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                  <Heart className="w-3.5 h-3.5 fill-current" />{favorites.length} Favorites
                </Link>
              )}
              <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Grid3X3 className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          
          {/* FILTERS */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[180px] max-w-[280px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="Search firms..." className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500" />
              </div>
              
              <div className="flex items-center gap-1 flex-wrap">
                {MARKET_TYPES.map(market => (
                  <button key={market} onClick={() => setFilters(f => ({ ...f, market: market === 'All' ? null : market }))} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${(market === 'All' && !filters.market) || filters.market === market ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{market}</button>
                ))}
              </div>
              
              {stats.withDiscounts > 0 && (
                <button onClick={() => setFilters(f => ({ ...f, hasDiscount: !f.hasDiscount }))} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.hasDiscount ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  <Tag className="w-3 h-3" /> Deals ({stats.withDiscounts})
                </button>
              )}
              
              <button onClick={() => setShowFilters(!showFilters)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${showFilters ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                <SlidersHorizontal className="w-3 h-3" /> Filters
              </button>
              
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-xs focus:outline-none focus:border-emerald-500">
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            {showFilters && (
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Max Price</label>
                    <PriceSlider value={filters.priceRange} onChange={(v) => setFilters(f => ({ ...f, priceRange: v }))} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Trading Style</label>
                    <div className="flex flex-wrap gap-1">
                      {TRADING_STYLES.map(style => (
                        <button key={style.key} onClick={() => setFilters(f => ({ ...f, tradingStyle: f.tradingStyle.includes(style.key) ? f.tradingStyle.filter(s => s !== style.key) : [...f.tradingStyle, style.key] }))} className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${filters.tradingStyle.includes(style.key) ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>{style.label}</button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Min Rating</label>
                    <div className="flex gap-1">
                      {[null, 4.0, 4.3, 4.5, 4.7].map(r => (
                        <button key={r || 'any'} onClick={() => setFilters(f => ({ ...f, minRating: r }))} className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${filters.minRating === r ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>{r ? `${r}+` : 'Any'}</button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Platform</label>
                    <select value={filters.platform || ''} onChange={(e) => setFilters(f => ({ ...f, platform: e.target.value || null }))} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-emerald-500">
                      <option value="">All Platforms</option>
                      {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Best For</label>
                  <div className="flex flex-wrap gap-2">
                    {BEST_FOR_OPTIONS.map(opt => {
                      const Icon = opt.icon
                      return (
                        <button key={opt.key} onClick={() => setFilters(f => ({ ...f, bestFor: f.bestFor === opt.key ? null : opt.key }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${filters.bestFor === opt.key ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
                          <Icon className="w-3.5 h-3.5" />{opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilterChips.map(chip => <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />)}
                <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset All</button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* MAIN CONTENT */}
      <section className="px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          {showVitrines && (
            <div className="mb-8">
              {BEST_FOR_OPTIONS.slice(0, 3).map(opt => (
                <VitrineSection key={opt.key} title={opt.label} icon={opt.icon} color={opt.color} firms={bestForVitrines[opt.key] || []} firmMarkets={firmMarkets} onFavorite={toggleFavorite} favorites={favorites} onCompare={toggleCompare} compareList={compareList} />
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{filteredFirms.length} results</p>
          </div>
          
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
            {paginatedFirms.map((firm, i) => (
              <PropFirmCard key={firm.id} firm={firm} isCompact={viewMode === 'list'} rank={showVitrines ? 0 : (currentPage - 1) * itemsPerPage + i + 1} markets={firmMarkets.get(firm.id) || ['Forex']} isFavorite={favorites.includes(firm.id)} onFavorite={() => toggleFavorite(firm.id)} isComparing={compareList.includes(firm.id)} onCompare={() => toggleCompare(firm.id)} onCopyCode={handleCopyCode} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                return <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === p ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{p}</button>
              })}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
          
          {filteredFirms.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No firms found</h3>
              <p className="text-sm text-gray-500 mb-3">Try adjusting your filters</p>
              <button onClick={resetFilters} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg">Reset Filters</button>
            </div>
          )}
        </div>
      </section>
      
      <ComparisonBar firms={compareFirms} onRemove={(id) => setCompareList(prev => prev.filter(x => x !== id))} onClear={() => setCompareList([])} />
      
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  )
}
