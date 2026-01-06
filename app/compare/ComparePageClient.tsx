'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Filter, ChevronDown, ChevronUp, Star, Check, X, 
  Zap, Grid3X3, List, ExternalLink, Sparkles,
  AlertTriangle, BarChart3, Info,
  Tag, Trophy, BadgeCheck, Copy, CheckCircle2,
  ChevronLeft, ChevronRight, SlidersHorizontal
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
  highRatingOnly?: boolean
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
// DATA HYGIENE
// =====================================================
const CANONICAL_FIRMS: Record<string, { canonical: string; aliases: string[] }> = {
  'fundednext': { canonical: 'FundedNext', aliases: ['funded next', 'fundednext futures', 'funded next futures'] },
  'the5ers': { canonical: 'The5ers', aliases: ['the 5ers', 'the5%ers'] },
  'ftmo': { canonical: 'FTMO', aliases: ['ftmo.com'] },
  'myfundedfx': { canonical: 'MyFundedFX', aliases: ['my funded fx'] },
  'topstep': { canonical: 'Topstep', aliases: ['topstep trader', 'topsteptrader'] },
}

const BLOCKLIST_FIRMS: string[] = ['fundedtech', 'fake prop firm', 'test firm']

const MARKET_TYPES = ['All', 'Forex', 'Futures', 'Crypto', 'Indices', 'Metals', 'Stocks'] as const
type MarketType = typeof MARKET_TYPES[number]

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

// =====================================================
// HELPERS
// =====================================================
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

const formatDailyDrawdown = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A'
  if (value === 0) return 'No limit'
  return `${value}%`
}

const formatMaxDrawdown = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return 'N/A'
  return `${value}%`
}

const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return 'N/A'
  return `$${value}`
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

// =====================================================
// COMPONENTS
// =====================================================
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>{children}</div>
      {show && <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg w-48 z-50 border border-gray-700 pointer-events-none">{content}</div>}
    </div>
  )
}

const TrustBadge = ({ status }: { status: string }) => {
  const config = {
    verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Verified', icon: BadgeCheck },
    banned: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Avoid', icon: X },
    under_review: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Review', icon: AlertTriangle },
    new: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'New', icon: Sparkles },
  }
  const { bg, text, label, icon: Icon } = config[status as keyof typeof config] || config.verified
  return <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${bg} ${text}`}><Icon className="w-3 h-3" />{label}</span>
}

const PromoBadge = ({ percent, code }: { percent: number; code?: string }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (code) { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) } }
  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
        {percent}% OFF
        {code && <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] font-normal opacity-90 hover:opacity-100">{copied ? <><CheckCircle2 className="w-2.5 h-2.5" />Copied</> : <><Copy className="w-2.5 h-2.5" />{code}</>}</button>}
      </div>
    </div>
  )
}

const RankingBadge = ({ rank }: { rank: number }) => {
  if (!rank || rank <= 0 || rank > 3) return null
  const colors = { 1: 'from-amber-400 to-amber-600', 2: 'from-gray-300 to-gray-500', 3: 'from-amber-600 to-amber-800' }
  return <div className={`absolute top-2 left-2 z-10 w-6 h-6 rounded bg-gradient-to-br ${colors[rank as keyof typeof colors]} flex items-center justify-center shadow`}><Trophy className="w-3 h-3 text-white" /></div>
}

const MarketChips = ({ markets }: { markets: MarketType[] }) => {
  const colors: Record<string, string> = { 'Forex': 'bg-blue-500/20 text-blue-400', 'Futures': 'bg-orange-500/20 text-orange-400', 'Crypto': 'bg-purple-500/20 text-purple-400', 'Indices': 'bg-cyan-500/20 text-cyan-400', 'Metals': 'bg-yellow-500/20 text-yellow-400', 'Stocks': 'bg-green-500/20 text-green-400' }
  return (
    <div className="flex flex-wrap gap-1">
      {markets.slice(0, 2).map(m => <span key={m} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[m] || 'bg-gray-500/20 text-gray-400'}`}>{m}</span>)}
      {markets.length > 2 && <span className="text-[10px] text-gray-500">+{markets.length - 2}</span>}
    </div>
  )
}

// =====================================================
// PROP FIRM CARD (Compact)
// =====================================================
const PropFirmCard = ({ firm, isCompact, rank, markets }: { firm: PropFirm; isCompact: boolean; rank: number; markets: MarketType[] }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasDiscount = firm.discount_percent != null && firm.discount_percent > 0
  const firmUrl = getFirmUrl(firm)
  
  if (isCompact) {
    return (
      <div className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 rounded-lg p-3 transition-all relative">
        {hasDiscount && <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded">{firm.discount_percent}%</span>}
        <div className="flex items-center gap-3">
          {rank > 0 && rank <= 3 && <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rank === 1 ? 'bg-amber-500 text-white' : rank === 2 ? 'bg-gray-400 text-white' : 'bg-amber-700 text-white'}`}>{rank}</span>}
          <div className="w-9 h-9 rounded bg-white flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={36} height={36} className="object-contain" /> : <span className="text-sm font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5"><h3 className="font-medium text-white text-sm truncate">{firm.name}</h3><TrustBadge status={firm.trust_status || 'verified'} /></div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{firm.trustpilot_rating?.toFixed(1) || '-'}</span>
              <span>{formatPrice(firm.min_price)}</span>
              <span className="text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Link href={`/prop-firm/${firm.slug}`} className="px-2.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded transition-colors">Details</Link>
            <a href={firmUrl} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-1">Visit<ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl overflow-hidden transition-all group relative flex flex-col h-full">
      {rank > 0 && rank <= 3 && <RankingBadge rank={rank} />}
      {hasDiscount && <PromoBadge percent={firm.discount_percent} code={firm.discount_code} />}
      
      <div className={`p-4 pb-3 ${(rank > 0 && rank <= 3) && hasDiscount ? 'pt-10' : (rank > 0 && rank <= 3) || hasDiscount ? 'pt-9' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-1.5 flex-shrink-0">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={44} height={44} className="object-contain" /> : <span className="text-lg font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5"><h3 className="text-base font-bold text-white truncate">{firm.name}</h3><TrustBadge status={firm.trust_status || 'verified'} /></div>
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
            <div className="flex justify-between"><span className="text-gray-500">Daily DD</span><span className="text-white">{formatDailyDrawdown(firm.max_daily_drawdown)}</span></div>
            <div className="flex flex-wrap gap-1">
              {firm.allows_scalping && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">Scalping</span>}
              {firm.allows_news_trading && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">News</span>}
              {firm.allows_ea && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">EAs</span>}
              {firm.has_instant_funding && <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 rounded text-[10px]">Instant</span>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between"><span className="text-gray-500">Target</span><span className="text-white">{firm.profit_target_phase1 ? `${firm.profit_target_phase1}%` : '-'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Min Days</span><span className="text-white">{firm.min_trading_days || 'None'}</span></div>
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
// COMPACT FILTER BAR (Inline)
// =====================================================
const CompactFilterBar = ({ 
  filters, setFilters, selectedMarket, setSelectedMarket, discountCount, highRatedCount 
}: { 
  filters: FilterState; setFilters: (f: FilterState) => void; 
  selectedMarket: string | null; setSelectedMarket: (m: string | null) => void;
  discountCount: number; highRatedCount: number;
}) => {
  const [showMore, setShowMore] = useState(false)
  
  return (
    <div className="space-y-2">
      {/* Primary Filters Row */}
      <div className="flex flex-wrap gap-2">
        {/* Market Pills */}
        {MARKET_TYPES.slice(0, 4).map(market => (
          <button
            key={market}
            onClick={() => setSelectedMarket(market === 'All' ? null : market)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              (market === 'All' && !selectedMarket) || selectedMarket === market
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {market}
          </button>
        ))}
        
        {/* Quick Toggles */}
        {discountCount > 0 && (
          <button
            onClick={() => setFilters({ ...filters, hasDiscount: !filters.hasDiscount })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              filters.hasDiscount ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Tag className="w-3 h-3" /> Deals ({discountCount})
          </button>
        )}
        
        <button
          onClick={() => setFilters({ ...filters, highRatingOnly: !filters.highRatingOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            filters.highRatingOnly ? 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Star className="w-3 h-3" /> 4.5+ ({highRatedCount})
        </button>
        
        <button
          onClick={() => setShowMore(!showMore)}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 flex items-center gap-1"
        >
          <SlidersHorizontal className="w-3 h-3" /> More
          <ChevronDown className={`w-3 h-3 transition-transform ${showMore ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Extended Filters */}
      {showMore && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
          {MARKET_TYPES.slice(4).map(market => (
            <button
              key={market}
              onClick={() => setSelectedMarket(market)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedMarket === market ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {market}
            </button>
          ))}
          
          {[
            { key: 'allowsScalping' as const, label: 'Scalping' },
            { key: 'allowsEA' as const, label: 'EAs' },
            { key: 'hasInstantFunding' as const, label: 'Instant' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilters({ ...filters, [key]: !filters[key] })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters[key] ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
          
          {(Object.values(filters).some(v => v) || selectedMarket) && (
            <button
              onClick={() => { setFilters({}); setSelectedMarket(null) }}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// =====================================================
// TABLE VIEW
// =====================================================
const QuickComparisonTable = ({ firms, currentPage, setCurrentPage, itemsPerPage }: { firms: PropFirm[]; currentPage: number; setCurrentPage: (p: number) => void; itemsPerPage: number }) => {
  const totalPages = Math.ceil(firms.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayFirms = firms.slice(startIndex, startIndex + itemsPerPage)
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-2 text-gray-400 font-medium">#</th>
              <th className="text-left py-2 px-2 text-gray-400 font-medium">Firm</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium">Rating</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium">Price</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium">Split</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium hidden sm:table-cell">Max DD</th>
              <th className="text-center py-2 px-2 text-gray-400 font-medium">Promo</th>
            </tr>
          </thead>
          <tbody>
            {displayFirms.map((firm, i) => {
              const idx = startIndex + i
              return (
                <tr key={firm.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-2 px-2"><span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-gray-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-gray-700 text-gray-400'}`}>{idx + 1}</span></td>
                  <td className="py-2 px-2">
                    <Link href={`/prop-firm/${firm.slug}`} className="flex items-center gap-2 group">
                      <div className="w-6 h-6 rounded bg-white flex items-center justify-center overflow-hidden p-0.5">
                        {firm.logo_url ? <Image src={firm.logo_url} alt="" width={24} height={24} className="object-contain" /> : <span className="text-emerald-600 font-bold text-[10px]">{firm.name.charAt(0)}</span>}
                      </div>
                      <span className="font-medium text-white group-hover:text-emerald-400 truncate max-w-[120px]">{firm.name}</span>
                    </Link>
                  </td>
                  <td className="text-center py-2 px-2"><span className="inline-flex items-center gap-0.5 text-yellow-400"><Star className="w-3 h-3 fill-yellow-400" />{firm.trustpilot_rating?.toFixed(1) || '-'}</span></td>
                  <td className="text-center py-2 px-2 text-white">{formatPrice(firm.min_price)}</td>
                  <td className="text-center py-2 px-2 text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</td>
                  <td className="text-center py-2 px-2 text-gray-300 hidden sm:table-cell">{formatMaxDrawdown(firm.max_total_drawdown)}</td>
                  <td className="text-center py-2 px-2">{firm.discount_percent != null && firm.discount_percent > 0 ? <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded">{firm.discount_percent}%</span> : <span className="text-gray-600">-</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, firms.length)} of {firms.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-1.5 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-50"><ChevronLeft className="w-3 h-3" /></button>
            <span className="px-2 text-xs text-gray-400">{currentPage}/{totalPages}</span>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded bg-gray-700 text-gray-400 hover:bg-gray-600 disabled:opacity-50"><ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      )}
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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [showOnlyVerified, setShowOnlyVerified] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(24)
  
  // Process firms
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
  
  // Stats
  const stats = useMemo(() => {
    const verified = processedFirms.filter(f => f.trust_status === 'verified' || !f.trust_status)
    const discounts = verified.filter(f => f.discount_percent != null && f.discount_percent > 0)
    const highRated = verified.filter(f => f.trustpilot_rating >= 4.5)
    return { total: verified.length, withDiscounts: discounts.length, highRated: highRated.length }
  }, [processedFirms])
  
  // Filter & Sort
  const filteredFirms = useMemo(() => {
    let result = [...processedFirms]
    if (showOnlyVerified) result = result.filter(f => f.trust_status === 'verified' || !f.trust_status)
    else result = result.filter(f => f.trust_status !== 'banned')
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(f => f.name?.toLowerCase().includes(q) || f.slug?.toLowerCase().includes(q)) }
    if (selectedMarket) result = result.filter(f => (firmMarkets.get(f.id) || []).includes(selectedMarket as MarketType))
    if (filters.hasDiscount) result = result.filter(f => f.discount_percent != null && f.discount_percent > 0)
    if (filters.highRatingOnly) result = result.filter(f => f.trustpilot_rating >= 4.5)
    if (filters.maxPrice && filters.maxPrice < 1000) result = result.filter(f => f.min_price <= filters.maxPrice!)
    if (filters.minProfitSplit) result = result.filter(f => f.max_profit_split >= filters.minProfitSplit!)
    if (filters.allowsScalping) result = result.filter(f => f.allows_scalping)
    if (filters.allowsNewsTrading) result = result.filter(f => f.allows_news_trading)
    if (filters.allowsEA) result = result.filter(f => f.allows_ea)
    if (filters.hasInstantFunding) result = result.filter(f => f.has_instant_funding)
    if (filters.platform) result = result.filter(f => f.platforms?.some(p => p === filters.platform))
    
    result.sort((a, b) => {
      const aPromo = (a.discount_percent ?? 0) > 0 ? 1 : 0, bPromo = (b.discount_percent ?? 0) > 0 ? 1 : 0
      if (bPromo !== aPromo) return bPromo - aPromo
      if (aPromo && bPromo) return (b.discount_percent ?? 0) - (a.discount_percent ?? 0)
      switch (sortBy) {
        case 'rating': return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
        case 'price': return (a.min_price || 9999) - (b.min_price || 9999)
        case 'split': return (b.max_profit_split || 0) - (a.max_profit_split || 0)
        case 'discount': return (b.discount_percent || 0) - (a.discount_percent || 0)
        default: return 0
      }
    })
    return result
  }, [processedFirms, firmMarkets, searchQuery, selectedMarket, filters, sortBy, showOnlyVerified])
  
  // Reset page on filter change
  useMemo(() => { setCurrentPage(1) }, [searchQuery, selectedMarket, filters, sortBy, showOnlyVerified])
  
  const paginatedFirms = useMemo(() => filteredFirms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredFirms, currentPage, itemsPerPage])
  const totalPages = Math.ceil(filteredFirms.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-900">
      {/* COMPACT HEADER - Above the fold optimized */}
      <section className="pt-20 pb-3 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Compare Prop Firms</h1>
              <p className="text-sm text-gray-500">{stats.total} verified • Updated Jan 2026</p>
            </div>
            
            {/* Search + View Toggle */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              
              <div className="flex border border-gray-700 rounded-lg overflow-hidden">
                {[{ m: 'grid' as const, i: Grid3X3 }, { m: 'list' as const, i: List }, { m: 'table' as const, i: BarChart3 }].map(({ m, i: Icon }) => (
                  <button key={m} onClick={() => setViewMode(m)} className={`p-2 ${viewMode === m ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><Icon className="w-4 h-4" /></button>
                ))}
              </div>
              
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="px-2 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none">
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="split">Split</option>
                <option value="discount">Deals</option>
              </select>
            </div>
          </div>
          
          {/* Compact Filter Bar */}
          <CompactFilterBar 
            filters={filters} 
            setFilters={setFilters} 
            selectedMarket={selectedMarket} 
            setSelectedMarket={setSelectedMarket}
            discountCount={stats.withDiscounts}
            highRatedCount={stats.highRated}
          />
        </div>
      </section>
      
      {/* MAIN CONTENT - Starts higher */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">
              {filteredFirms.length} results
              {selectedMarket && <span className="ml-1 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">{selectedMarket}</span>}
              {filters.hasDiscount && <span className="ml-1 px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded">Deals</span>}
              {filters.highRatingOnly && <span className="ml-1 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">4.5+</span>}
            </p>
          </div>
          
          {/* Content */}
          {viewMode === 'table' ? (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
              <QuickComparisonTable firms={filteredFirms} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} />
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
                {paginatedFirms.map((firm, i) => (
                  <PropFirmCard key={firm.id} firm={firm} isCompact={viewMode === 'list'} rank={(currentPage - 1) * itemsPerPage + i + 1} markets={firmMarkets.get(firm.id) || ['Forex']} />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                    return <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === p ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>{p}</button>
                  })}
                  <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </>
          )}
          
          {filteredFirms.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No firms found</h3>
              <p className="text-sm text-gray-500 mb-3">Try adjusting your filters</p>
              <button onClick={() => { setFilters({}); setSearchQuery(''); setSelectedMarket(null) }} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg">Reset</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
