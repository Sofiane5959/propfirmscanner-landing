'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, ChevronDown, Star, Check, X, 
  Grid3X3, List, ExternalLink,
  BarChart3, Tag, Trophy, BadgeCheck, Copy, CheckCircle2,
  ChevronLeft, ChevronRight, RotateCcw,
  Heart, GitCompare, Zap, TrendingUp,
  DollarSign, Users, Flame
} from 'lucide-react'
import { PriceAlertButton } from '@/components/PriceAlert'

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
  markets: string[]
  platforms: string[]
  tradingStyles: string[]
  ratings: number[]
  challengeTypes: string[]
  bestFor: string[]
  priceRange: [number, number]
  hasDiscount: boolean
  verifiedOnly: boolean
}

// =====================================================
// CONSTANTS
// =====================================================
const MARKET_OPTIONS = ['Forex', 'Futures', 'Crypto', 'Indices', 'Metals', 'Stocks'] as const

const PLATFORM_OPTIONS = ['MT4', 'MT5', 'cTrader', 'DXtrade', 'TradeLocker', 'Match-Trader', 'NinjaTrader', 'Tradovate'] as const

const TRADING_STYLE_OPTIONS = [
  { key: 'scalping', label: 'Scalping', field: 'allows_scalping' },
  { key: 'news', label: 'News Trading', field: 'allows_news_trading' },
  { key: 'ea', label: 'EAs/Bots', field: 'allows_ea' },
  { key: 'swing', label: 'Swing/Weekend', field: 'allows_weekend_holding' },
] as const

const RATING_OPTIONS = [4.0, 4.3, 4.5, 4.7] as const

const CHALLENGE_TYPE_OPTIONS = ['Instant', '1-Step', '2-Step', '3-Step'] as const

const BEST_FOR_OPTIONS = [
  { key: 'beginners', label: 'Beginners', icon: Users },
  { key: 'value', label: 'Best Value', icon: DollarSign },
  { key: 'highsplit', label: 'High Split', icon: TrendingUp },
  { key: 'scalpers', label: 'Scalpers', icon: Flame },
  { key: 'instant', label: 'Instant Funding', icon: Zap },
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
// HOOKS
// =====================================================
// Debounce hook for search and URL sync
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// SSR-safe localStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)
  
  useEffect(() => {
    setIsHydrated(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) setStoredValue(JSON.parse(item))
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])
  
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error)
        }
      }
      return valueToStore
    })
  }, [key])
  
  return [storedValue, setValue]
}

// =====================================================
// HELPERS
// =====================================================
const normalizeMarkets = (assets: string[] | undefined, isFutures: boolean): string[] => {
  const markets: string[] = []
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

const getBestForScore = (firm: PropFirm, category: string): number => {
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
    case 'highsplit':
      return firm.max_profit_split >= 90 ? 100 : firm.max_profit_split >= 80 ? 50 : 0
    case 'scalpers':
      let sScore = 0
      if (firm.allows_scalping) sScore += 50
      if (firm.max_daily_drawdown >= 5) sScore += 25
      if (firm.trustpilot_rating >= 4) sScore += 25
      return sScore
    case 'instant':
      return firm.has_instant_funding ? 100 : 0
    default:
      return 0
  }
}

const normalizeChallengeType = (types: string[] | undefined): string[] => {
  if (!types || types.length === 0) return []
  const normalized: string[] = []
  types.forEach(t => {
    const lower = t.toLowerCase()
    if (lower.includes('instant') || lower.includes('direct') || lower.includes('express')) normalized.push('Instant')
    if (lower.includes('1') || lower.includes('one') || lower.includes('single')) normalized.push('1-Step')
    if (lower.includes('2') || lower.includes('two') || lower.includes('standard')) normalized.push('2-Step')
    if (lower.includes('3') || lower.includes('three')) normalized.push('3-Step')
  })
  return Array.from(new Set(normalized))
}

// =====================================================
// COMPONENTS
// =====================================================
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer) }, [onClose])
  return (
    <div 
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}
    >
      {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

const TrustBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Verified' },
    banned: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Avoid' },
    under_review: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Under Review' },
    new: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'New' },
  }
  const { bg, text, label } = config[status] || config.verified
  return <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${bg} ${text}`}><BadgeCheck className="w-2.5 h-2.5" />{label}</span>
}

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
    {label}
    <button onClick={onRemove} className="hover:text-white" aria-label={`Remove ${label} filter`}><X className="w-3 h-3" /></button>
  </span>
)

// Filter Dropdown Component with global state management
const FilterDropdown = ({ 
  label, 
  count, 
  children,
  colorClass = 'emerald',
  isOpen,
  onToggle
}: { 
  label: string
  count: number
  children: React.ReactNode
  colorClass?: 'emerald' | 'purple' | 'yellow' | 'blue' | 'orange'
  isOpen: boolean
  onToggle: () => void
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onToggle])
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onToggle()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onToggle])
  
  const hasSelection = count > 0
  
  const colorStyles = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/50', badge: 'bg-emerald-500' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500/50', badge: 'bg-purple-500' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/50', badge: 'bg-yellow-500' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/50', badge: 'bg-blue-500' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', ring: 'ring-orange-500/50', badge: 'bg-orange-500' },
  }
  
  const colors = colorStyles[colorClass]
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label} filter${hasSelection ? `, ${count} selected` : ''}`}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
          hasSelection 
            ? `${colors.bg} ${colors.text} ring-1 ${colors.ring}`
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        {label}
        {hasSelection && (
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${colors.badge} text-white`}>
            {count}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          role="listbox"
          className="absolute top-full left-0 mt-1 p-3 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 min-w-[200px] max-w-[280px] animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {children}
        </div>
      )}
    </div>
  )
}

const PriceSlider = ({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) => {
  const [localMax, setLocalMax] = useState(value[1])
  
  useEffect(() => { setLocalMax(value[1]) }, [value])
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>$0</span>
        <span className="text-emerald-400 font-medium">{localMax >= 1000 ? 'Any' : `$${localMax}`}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1000}
        step={25}
        value={localMax}
        onChange={(e) => setLocalMax(parseInt(e.target.value))}
        onMouseUp={() => onChange([0, localMax])}
        onTouchEnd={() => onChange([0, localMax])}
        aria-label="Maximum price filter"
        aria-valuemin={0}
        aria-valuemax={1000}
        aria-valuenow={localMax}
        aria-valuetext={localMax >= 1000 ? 'Any price' : `Maximum $${localMax}`}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>$0</span>
        <span>$250</span>
        <span>$500</span>
        <span>$750</span>
        <span>$1000+</span>
      </div>
    </div>
  )
}

const PropFirmCard = ({ 
  firm, 
  isCompact, 
  rank,
  markets,
  isFavorite,
  onFavorite,
  isComparing,
  onCompare,
  onCopyCode
}: { 
  firm: PropFirm
  isCompact: boolean
  rank: number
  markets: string[]
  isFavorite: boolean
  onFavorite: () => void
  isComparing: boolean
  onCompare: () => void
  onCopyCode: (code: string) => void
}) => {
  const hasDiscount = firm.discount_percent && firm.discount_percent > 0
  
  if (isCompact) {
    return (
      <div className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-3 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={40} height={40} className="object-contain" /> : <span className="text-lg font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white truncate text-sm">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
              <span>${firm.min_price || 'N/A'}</span>
              <span className="text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</span>
            </div>
          </div>
          
          {hasDiscount && (
            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-lg">{firm.discount_percent}% OFF</span>
          )}
          
          <div className="flex items-center gap-1">
            <button 
              onClick={onFavorite} 
              aria-label={isFavorite ? `Remove ${firm.name} from favorites` : `Add ${firm.name} to favorites`}
              aria-pressed={isFavorite}
              className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-red-400 bg-red-500/20' : 'text-gray-500 hover:text-red-400 hover:bg-gray-700'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <PriceAlertButton 
              firmId={firm.id}
              firmName={firm.name}
              firmSlug={firm.slug}
              currentPrice={firm.min_price || 0}
            />
            <Link href={`/prop-firm/${firm.slug}`} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg">Details</Link>
            <a href={getFirmUrl(firm)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg flex items-center gap-1">Visit <ExternalLink className="w-3 h-3" /></a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl overflow-hidden transition-all group relative">
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
            {firm.discount_percent}% OFF
            {firm.discount_code && (
              <button 
                onClick={() => onCopyCode(firm.discount_code)} 
                aria-label={`Copy discount code ${firm.discount_code}`}
                className="flex items-center gap-1 text-[10px] font-normal opacity-90 hover:opacity-100 mt-0.5"
              >
                <Copy className="w-2.5 h-2.5" />{firm.discount_code}
              </button>
            )}
          </div>
        </div>
      )}
      
      {rank <= 3 && (
        <div className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg ${rank === 1 ? 'bg-amber-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}>
          <Trophy className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      
      <div className={`p-4 ${hasDiscount || rank <= 3 ? 'pt-12' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-1.5 flex-shrink-0">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={56} height={56} className="object-contain" /> : <span className="text-xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white truncate">{firm.name}</h3>
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /><span className="text-white font-medium">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>{firm.trustpilot_reviews && <span className="text-gray-500 text-xs">({formatReviewCount(firm.trustpilot_reviews)})</span>}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            <button 
              onClick={onFavorite} 
              aria-label={isFavorite ? `Remove ${firm.name} from favorites` : `Add ${firm.name} to favorites`}
              aria-pressed={isFavorite}
              className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-red-400 bg-red-500/20' : 'text-gray-500 hover:text-red-400 hover:bg-gray-700'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={onCompare} 
              aria-label={isComparing ? `Remove ${firm.name} from comparison` : `Add ${firm.name} to comparison`}
              aria-pressed={isComparing}
              className={`p-2 rounded-lg transition-all ${isComparing ? 'text-blue-400 bg-blue-500/20' : 'text-gray-500 hover:text-blue-400 hover:bg-gray-700'}`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
            <PriceAlertButton 
              firmId={firm.id}
              firmName={firm.name}
              firmSlug={firm.slug}
              currentPrice={firm.min_price || 0}
            />
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-900/50 border-y border-gray-700/50 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Price</p>
          <p className="text-base font-bold text-white">${firm.min_price || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Split</p>
          <p className="text-base font-bold text-emerald-400">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1">
          {markets.map(m => (
            <span key={m} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded">{m}</span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {firm.allows_scalping && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded flex items-center gap-0.5"><Check className="w-2.5 h-2.5" />Scalping</span>}
          {firm.allows_news_trading && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded flex items-center gap-0.5"><Check className="w-2.5 h-2.5" />News</span>}
          {firm.allows_ea && <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded flex items-center gap-0.5"><Check className="w-2.5 h-2.5" />EAs</span>}
          {firm.has_instant_funding && <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] rounded flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" />Instant</span>}
        </div>
        
        {firm.platforms && firm.platforms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {firm.platforms.slice(0, 3).map(p => (
              <span key={p} className="px-1.5 py-0.5 bg-gray-700 text-gray-300 text-[10px] rounded">{p}</span>
            ))}
            {firm.platforms.length > 3 && <span className="text-[10px] text-gray-500">+{firm.platforms.length - 3}</span>}
          </div>
        )}
      </div>
      
      <div className="p-4 pt-0 flex gap-2">
        <Link href={`/prop-firm/${firm.slug}`} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-center text-sm font-medium rounded-lg">Details</Link>
        <a href={getFirmUrl(firm)} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-center text-sm font-medium rounded-lg flex items-center justify-center gap-1">Visit <ExternalLink className="w-3.5 h-3.5" /></a>
      </div>
    </div>
  )
}

const CompareBar = ({ firms, onRemove, onClear }: { firms: PropFirm[]; onRemove: (id: string) => void; onClear: () => void }) => {
  if (firms.length === 0) return null
  
  const compareUrl = `/compare/${firms.map(f => f.slug).join('-vs-')}`
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Compare ({firms.length}/4):</span>
          <div className="flex gap-2">
            {firms.map(f => (
              <div key={f.id} className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg">
                <span className="text-xs text-white">{f.name}</span>
                <button onClick={() => onRemove(f.id)} aria-label={`Remove ${f.name} from comparison`} className="text-gray-400 hover:text-red-400"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClear} className="px-3 py-1.5 text-gray-400 hover:text-white text-sm">Clear</button>
          <Link href={compareUrl} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg">Compare Now</Link>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for better UX
const CardSkeleton = () => (
  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-gray-700" />
        <div className="flex-1">
          <div className="h-5 bg-gray-700 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-700 rounded w-1/3" />
        </div>
      </div>
    </div>
    <div className="px-4 py-3 bg-gray-900/50 border-y border-gray-700/50 grid grid-cols-2 gap-3">
      <div className="h-10 bg-gray-700 rounded" />
      <div className="h-10 bg-gray-700 rounded" />
    </div>
    <div className="p-4 space-y-3">
      <div className="flex gap-1">
        <div className="h-5 w-12 bg-gray-700 rounded" />
        <div className="h-5 w-12 bg-gray-700 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-gray-700 rounded-lg" />
        <div className="h-8 flex-1 bg-gray-700 rounded-lg" />
      </div>
    </div>
  </div>
)

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function ComparePageClient({ firms }: ComparePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize filters from URL
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get('q') || '',
    markets: searchParams.get('markets')?.split(',').filter(Boolean) || [],
    platforms: searchParams.get('platforms')?.split(',').filter(Boolean) || [],
    tradingStyles: searchParams.get('styles')?.split(',').filter(Boolean) || [],
    ratings: searchParams.get('ratings')?.split(',').map(Number).filter(Boolean) || [],
    challengeTypes: searchParams.get('challenges')?.split(',').filter(Boolean) || [],
    bestFor: searchParams.get('bestFor')?.split(',').filter(Boolean) || [],
    priceRange: [0, parseInt(searchParams.get('maxPrice') || '1000') || 1000],
    hasDiscount: searchParams.get('deals') === 'true',
    verifiedOnly: searchParams.get('verified') !== 'false',
  }))
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [compareList, setCompareList] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // SSR-safe favorites with localStorage
  const [favorites, setFavorites] = useLocalStorage<string[]>('pfs_favorites', [])
  
  const itemsPerPage = 24
  
  // Debounced search for performance
  const debouncedSearch = useDebounce(filters.search, 300)
  
  // Debounced filters for URL sync
  const debouncedFilters = useDebounce(filters, 500)
  
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      setToast({ message: prev.includes(id) ? 'Removed from favorites' : 'Added to favorites', type: 'success' })
      return newFavs
    })
  }, [setFavorites])
  
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
  
  // Toggle dropdown (only one open at a time)
  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown(prev => prev === name ? null : name)
  }, [])
  
  // Sync filters to URL (debounced)
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedFilters.search) params.set('q', debouncedFilters.search)
    if (debouncedFilters.markets.length) params.set('markets', debouncedFilters.markets.join(','))
    if (debouncedFilters.platforms.length) params.set('platforms', debouncedFilters.platforms.join(','))
    if (debouncedFilters.tradingStyles.length) params.set('styles', debouncedFilters.tradingStyles.join(','))
    if (debouncedFilters.ratings.length) params.set('ratings', debouncedFilters.ratings.join(','))
    if (debouncedFilters.challengeTypes.length) params.set('challenges', debouncedFilters.challengeTypes.join(','))
    if (debouncedFilters.bestFor.length) params.set('bestFor', debouncedFilters.bestFor.join(','))
    if (debouncedFilters.priceRange[1] < 1000) params.set('maxPrice', String(debouncedFilters.priceRange[1]))
    if (debouncedFilters.hasDiscount) params.set('deals', 'true')
    if (!debouncedFilters.verifiedOnly) params.set('verified', 'false')
    if (sortBy !== 'rating') params.set('sort', sortBy)
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/compare'
    router.replace(newUrl, { scroll: false })
  }, [debouncedFilters, sortBy, router])
  
  // Process and deduplicate firms
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
  
  // Map firm IDs to their markets
  const firmMarkets = useMemo(() => {
    const map = new Map<string, string[]>()
    processedFirms.forEach(f => map.set(f.id, normalizeMarkets(f.assets, f.is_futures)))
    return map
  }, [processedFirms])
  
  // Map firm IDs to their challenge types
  const firmChallengeTypes = useMemo(() => {
    const map = new Map<string, string[]>()
    processedFirms.forEach(f => map.set(f.id, normalizeChallengeType(f.challenge_types)))
    return map
  }, [processedFirms])
  
  // Get available platforms from data
  const availablePlatforms = useMemo(() => 
    Array.from(new Set(processedFirms.flatMap(f => f.platforms || []))).filter(Boolean).sort()
  , [processedFirms])
  
  // Stats
  const stats = useMemo(() => {
    const verified = processedFirms.filter(f => f.trust_status === 'verified' || !f.trust_status)
    const discounts = verified.filter(f => f.discount_percent != null && f.discount_percent > 0)
    return { total: verified.length, withDiscounts: discounts.length }
  }, [processedFirms])
  
  // Apply filters (use debounced search)
  const filteredFirms = useMemo(() => {
    let result = [...processedFirms]
    
    // Verified filter
    if (filters.verifiedOnly) result = result.filter(f => f.trust_status === 'verified' || !f.trust_status)
    else result = result.filter(f => f.trust_status !== 'banned')
    
    // Search (use debounced value)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(f => f.name?.toLowerCase().includes(q) || f.slug?.toLowerCase().includes(q))
    }
    
    // Markets (multi-select - OR logic)
    if (filters.markets.length > 0) {
      result = result.filter(f => {
        const fMarkets = firmMarkets.get(f.id) || []
        return filters.markets.some(m => fMarkets.includes(m))
      })
    }
    
    // Platforms (multi-select - OR logic)
    if (filters.platforms.length > 0) {
      result = result.filter(f => {
        const fPlatforms = f.platforms || []
        return filters.platforms.some(p => fPlatforms.includes(p))
      })
    }
    
    // Trading styles (multi-select - AND logic)
    if (filters.tradingStyles.length > 0) {
      result = result.filter(f => {
        return filters.tradingStyles.every(style => {
          const styleConfig = TRADING_STYLE_OPTIONS.find(s => s.key === style)
          if (!styleConfig) return true
          return f[styleConfig.field as keyof PropFirm]
        })
      })
    }
    
    // Ratings (multi-select - OR logic, takes minimum of selected)
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings)
      result = result.filter(f => f.trustpilot_rating >= minRating)
    }
    
    // Challenge types (multi-select - OR logic)
    if (filters.challengeTypes.length > 0) {
      result = result.filter(f => {
        const fChallenges = firmChallengeTypes.get(f.id) || []
        return filters.challengeTypes.some(c => fChallenges.includes(c))
      })
    }
    
    // Best for (multi-select - OR logic with scoring)
    if (filters.bestFor.length > 0) {
      result = result.filter(f => {
        return filters.bestFor.some(category => getBestForScore(f, category) > 0)
      })
    }
    
    // Price range
    if (filters.priceRange[1] < 1000) {
      result = result.filter(f => f.min_price && f.min_price <= filters.priceRange[1])
    }
    
    // Deals only
    if (filters.hasDiscount) {
      result = result.filter(f => f.discount_percent != null && f.discount_percent > 0)
    }
    
    // Sort
    result.sort((a, b) => {
      // Promos first
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
    
    return result
  }, [processedFirms, firmMarkets, firmChallengeTypes, filters.verifiedOnly, filters.markets, filters.platforms, filters.tradingStyles, filters.ratings, filters.challengeTypes, filters.bestFor, filters.priceRange, filters.hasDiscount, debouncedSearch, sortBy])
  
  // Reset page when filters change + scroll to top
  useEffect(() => { 
    setCurrentPage(1)
  }, [filters, sortBy])
  
  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])
  
  // Pagination
  const paginatedFirms = useMemo(() => filteredFirms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredFirms, currentPage, itemsPerPage])
  const totalPages = Math.ceil(filteredFirms.length / itemsPerPage)
  const compareFirms = useMemo(() => processedFirms.filter(f => compareList.includes(f.id)), [processedFirms, compareList])
  
  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    
    filters.markets.forEach(m => chips.push({ key: `market-${m}`, label: m, onRemove: () => setFilters(f => ({ ...f, markets: f.markets.filter(x => x !== m) })) }))
    filters.platforms.forEach(p => chips.push({ key: `platform-${p}`, label: p, onRemove: () => setFilters(f => ({ ...f, platforms: f.platforms.filter(x => x !== p) })) }))
    filters.tradingStyles.forEach(s => {
      const style = TRADING_STYLE_OPTIONS.find(x => x.key === s)
      if (style) chips.push({ key: `style-${s}`, label: style.label, onRemove: () => setFilters(f => ({ ...f, tradingStyles: f.tradingStyles.filter(x => x !== s) })) })
    })
    filters.ratings.forEach(r => chips.push({ key: `rating-${r}`, label: `${r}+ Rating`, onRemove: () => setFilters(f => ({ ...f, ratings: f.ratings.filter(x => x !== r) })) }))
    filters.challengeTypes.forEach(c => chips.push({ key: `challenge-${c}`, label: c, onRemove: () => setFilters(f => ({ ...f, challengeTypes: f.challengeTypes.filter(x => x !== c) })) }))
    filters.bestFor.forEach(b => {
      const bf = BEST_FOR_OPTIONS.find(x => x.key === b)
      if (bf) chips.push({ key: `bestfor-${b}`, label: bf.label, onRemove: () => setFilters(f => ({ ...f, bestFor: f.bestFor.filter(x => x !== b) })) })
    })
    if (filters.priceRange[1] < 1000) chips.push({ key: 'price', label: `Max $${filters.priceRange[1]}`, onRemove: () => setFilters(f => ({ ...f, priceRange: [0, 1000] })) })
    if (filters.hasDiscount) chips.push({ key: 'deals', label: 'Deals Only', onRemove: () => setFilters(f => ({ ...f, hasDiscount: false })) })
    
    return chips
  }, [filters])
  
  const resetFilters = () => {
    setFilters({
      search: '',
      markets: [],
      platforms: [],
      tradingStyles: [],
      ratings: [],
      challengeTypes: [],
      bestFor: [],
      priceRange: [0, 1000],
      hasDiscount: false,
      verifiedOnly: true,
    })
    setOpenDropdown(null)
  }

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
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Scanned & Verified</span>
              </div>
              <p className="text-sm text-gray-500">{stats.total} verified firms • Updated Jan 2026</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')} 
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* SEARCH & ALL FILTERS IN BAR */}
          <div className="space-y-3">
            {/* Main Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative min-w-[160px] max-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  value={filters.search} 
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} 
                  placeholder="Search..." 
                  aria-label="Search prop firms"
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              
              {/* Markets Dropdown */}
              <FilterDropdown 
                label="Markets" 
                count={filters.markets.length}
                isOpen={openDropdown === 'markets'}
                onToggle={() => toggleDropdown('markets')}
              >
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_OPTIONS.map(market => (
                    <button 
                      key={market} 
                      onClick={() => setFilters(f => ({ 
                        ...f, 
                        markets: f.markets.includes(market) ? f.markets.filter(m => m !== market) : [...f.markets, market] 
                      }))} 
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.markets.includes(market) ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      {market}
                      {filters.markets.includes(market) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Platforms Dropdown */}
              <FilterDropdown 
                label="Platform" 
                count={filters.platforms.length}
                isOpen={openDropdown === 'platforms'}
                onToggle={() => toggleDropdown('platforms')}
              >
                <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                  {availablePlatforms.map(platform => (
                    <button 
                      key={platform} 
                      onClick={() => setFilters(f => ({ 
                        ...f, 
                        platforms: f.platforms.includes(platform) ? f.platforms.filter(p => p !== platform) : [...f.platforms, platform] 
                      }))} 
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.platforms.includes(platform) ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      {platform}
                      {filters.platforms.includes(platform) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Challenge Type Dropdown */}
              <FilterDropdown 
                label="Challenge" 
                count={filters.challengeTypes.length} 
                colorClass="purple"
                isOpen={openDropdown === 'challenge'}
                onToggle={() => toggleDropdown('challenge')}
              >
                <div className="flex flex-wrap gap-1.5">
                  {CHALLENGE_TYPE_OPTIONS.map(type => (
                    <button 
                      key={type} 
                      onClick={() => setFilters(f => ({ 
                        ...f, 
                        challengeTypes: f.challengeTypes.includes(type) ? f.challengeTypes.filter(t => t !== type) : [...f.challengeTypes, type] 
                      }))} 
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.challengeTypes.includes(type) ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      {type}
                      {filters.challengeTypes.includes(type) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Trading Style Dropdown */}
              <FilterDropdown 
                label="Style" 
                count={filters.tradingStyles.length}
                isOpen={openDropdown === 'style'}
                onToggle={() => toggleDropdown('style')}
              >
                <div className="flex flex-wrap gap-1.5">
                  {TRADING_STYLE_OPTIONS.map(style => (
                    <button 
                      key={style.key} 
                      onClick={() => setFilters(f => ({ 
                        ...f, 
                        tradingStyles: f.tradingStyles.includes(style.key) ? f.tradingStyles.filter(s => s !== style.key) : [...f.tradingStyles, style.key] 
                      }))} 
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.tradingStyles.includes(style.key) ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      {style.label}
                      {filters.tradingStyles.includes(style.key) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Rating Dropdown */}
              <FilterDropdown 
                label="Rating" 
                count={filters.ratings.length} 
                colorClass="yellow"
                isOpen={openDropdown === 'rating'}
                onToggle={() => toggleDropdown('rating')}
              >
                <div className="flex flex-wrap gap-1.5">
                  {RATING_OPTIONS.map(rating => (
                    <button 
                      key={rating} 
                      onClick={() => setFilters(f => ({ 
                        ...f, 
                        ratings: f.ratings.includes(rating) ? f.ratings.filter(r => r !== rating) : [...f.ratings, rating] 
                      }))} 
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.ratings.includes(rating) ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    >
                      <Star className="w-3 h-3" />{rating}+
                      {filters.ratings.includes(rating) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Best For Dropdown */}
              <FilterDropdown 
                label="Best For" 
                count={filters.bestFor.length} 
                colorClass="blue"
                isOpen={openDropdown === 'bestFor'}
                onToggle={() => toggleDropdown('bestFor')}
              >
                <div className="flex flex-wrap gap-1.5">
                  {BEST_FOR_OPTIONS.map(opt => {
                    const Icon = opt.icon
                    return (
                      <button 
                        key={opt.key} 
                        onClick={() => setFilters(f => ({ 
                          ...f, 
                          bestFor: f.bestFor.includes(opt.key) ? f.bestFor.filter(b => b !== opt.key) : [...f.bestFor, opt.key] 
                        }))} 
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.bestFor.includes(opt.key) ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                      >
                        <Icon className="w-3 h-3" />{opt.label}
                        {filters.bestFor.includes(opt.key) && <Check className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
              </FilterDropdown>
              
              {/* Price Dropdown */}
              <FilterDropdown 
                label={filters.priceRange[1] < 1000 ? `≤$${filters.priceRange[1]}` : 'Price'} 
                count={filters.priceRange[1] < 1000 ? 1 : 0}
                isOpen={openDropdown === 'price'}
                onToggle={() => toggleDropdown('price')}
              >
                <div className="w-[220px]">
                  <PriceSlider value={filters.priceRange} onChange={(v) => setFilters(f => ({ ...f, priceRange: v }))} />
                </div>
              </FilterDropdown>
              
              {/* Deals Toggle */}
              {stats.withDiscounts > 0 && (
                <button 
                  onClick={() => setFilters(f => ({ ...f, hasDiscount: !f.hasDiscount }))} 
                  aria-pressed={filters.hasDiscount}
                  aria-label={`Filter by deals only. ${stats.withDiscounts} firms with discounts`}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.hasDiscount ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                >
                  <Tag className="w-3 h-3" /> Deals ({stats.withDiscounts})
                </button>
              )}
              
              {/* Sort */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                aria-label="Sort firms by"
                className="px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 text-xs focus:outline-none focus:border-emerald-500"
              >
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              
              {/* Reset */}
              {activeFilterChips.length > 0 && (
                <button 
                  onClick={resetFilters} 
                  aria-label="Reset all filters"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-gray-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
            
            {/* Active Filter Chips (compact) */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {activeFilterChips.map(chip => <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />)}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* MAIN CONTENT */}
      <section className="px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white font-medium">{filteredFirms.length}</span> prop firms
            </p>
            {favorites.length > 0 && (
              <span className="text-xs text-gray-500">{favorites.length} favorites</span>
            )}
          </div>
          
          {/* FIRMS GRID/LIST */}
          {paginatedFirms.length > 0 ? (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {paginatedFirms.map((firm, i) => (
                  <PropFirmCard 
                    key={firm.id} 
                    firm={firm} 
                    isCompact={viewMode === 'list'} 
                    rank={(currentPage - 1) * itemsPerPage + i + 1} 
                    markets={firmMarkets.get(firm.id) || ['Forex']} 
                    isFavorite={favorites.includes(firm.id)} 
                    onFavorite={() => toggleFavorite(firm.id)} 
                    isComparing={compareList.includes(firm.id)} 
                    onCompare={() => toggleCompare(firm.id)} 
                    onCopyCode={handleCopyCode} 
                  />
                ))}
              </div>
              
              {/* PAGINATION */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number
                      if (totalPages <= 5) page = i + 1
                      else if (currentPage <= 3) page = i + 1
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i
                      else page = currentPage - 2 + i
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                          className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No firms found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <button onClick={resetFilters} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-lg transition-colors">Reset Filters</button>
            </div>
          )}
        </div>
      </section>
      
      {/* COMPARE BAR */}
      <CompareBar firms={compareFirms} onRemove={(id) => setCompareList(prev => prev.filter(f => f !== id))} onClear={() => setCompareList([])} />
    </div>
  )
}
