'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, Filter, ChevronDown, ChevronUp, Star, Check, X, 
  Clock, DollarSign, TrendingUp, Shield, Zap, Award,
  ArrowUpDown, Grid3X3, List, ExternalLink, Sparkles,
  AlertTriangle, Calendar, Percent, Users, BarChart3
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
  initialFirms: PropFirm[]
}

// Quick Stats Component
const QuickStat = ({ icon: Icon, label, value, color }: { 
  icon: any, label: string, value: string | number, color: string 
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
)

// Trust Badge Component
const TrustBadge = ({ status }: { status: string }) => {
  const config = {
    verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Verified', icon: Check },
    banned: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Avoid', icon: X },
    under_review: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Under Review', icon: AlertTriangle },
    new: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'New', icon: Sparkles },
  }
  const { bg, text, label, icon: Icon } = config[status as keyof typeof config] || config.new
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

// Improved Prop Firm Card Component
const PropFirmCard = ({ firm, isCompact }: { firm: PropFirm, isCompact: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (isCompact) {
    return (
      <Link href={`/prop-firm/${firm.slug}`}>
        <div className="group bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
              {firm.logo_url ? (
                <Image src={firm.logo_url} alt={firm.name} width={48} height={48} className="object-contain" />
              ) : (
                <span className="text-lg font-bold text-emerald-400">{firm.name.charAt(0)}</span>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">{firm.name}</h3>
                <TrustBadge status={firm.trust_status} />
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  {firm.trustpilot_rating?.toFixed(1) || 'N/A'}
                </span>
                <span>From ${firm.min_price}</span>
                <span className="text-emerald-400">{firm.profit_split}-{firm.max_profit_split}% split</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {firm.discount_percent && (
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                  -{firm.discount_percent}%
                </span>
              )}
              <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    )
  }
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-2xl overflow-hidden transition-all duration-300 group">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-700">
              {firm.logo_url ? (
                <Image src={firm.logo_url} alt={firm.name} width={64} height={64} className="object-contain" />
              ) : (
                <span className="text-2xl font-bold text-emerald-400">{firm.name.charAt(0)}</span>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white">{firm.name}</h3>
                <TrustBadge status={firm.trust_status} />
              </div>
              
              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-white">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-500 text-sm">({firm.trustpilot_reviews || 0})</span>
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
          
          {/* Discount Badge */}
          {firm.discount_percent && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
              {firm.discount_percent}% OFF
              {firm.discount_code && (
                <span className="block text-xs font-normal opacity-80">Code: {firm.discount_code}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Key Stats Grid */}
      <div className="px-5 py-4 bg-gray-900/50 border-y border-gray-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStat 
            icon={DollarSign} 
            label="Starting Price" 
            value={`$${firm.min_price}`} 
            color="bg-blue-500" 
          />
          <QuickStat 
            icon={Percent} 
            label="Profit Split" 
            value={`${firm.profit_split}-${firm.max_profit_split}%`} 
            color="bg-emerald-500" 
          />
          <QuickStat 
            icon={Shield} 
            label="Max Drawdown" 
            value={`${firm.max_total_drawdown}%`} 
            color="bg-purple-500" 
          />
          <QuickStat 
            icon={TrendingUp} 
            label="Profit Target" 
            value={`${firm.profit_target_phase1}%`} 
            color="bg-orange-500" 
          />
        </div>
      </div>
      
      {/* Trading Rules Quick View */}
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {firm.allows_scalping && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg">
              <Check className="w-3 h-3" /> Scalping
            </span>
          )}
          {firm.allows_news_trading && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg">
              <Check className="w-3 h-3" /> News Trading
            </span>
          )}
          {firm.allows_ea && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg">
              <Check className="w-3 h-3" /> EAs Allowed
            </span>
          )}
          {firm.has_instant_funding && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg">
              <Zap className="w-3 h-3" /> Instant Funding
            </span>
          )}
          {!firm.allows_news_trading && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 text-red-400 text-xs rounded-lg">
              <X className="w-3 h-3" /> No News Trading
            </span>
          )}
        </div>
        
        {/* Expandable Details */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Challenge Types */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Challenge Types</h4>
              <div className="flex flex-wrap gap-1.5">
                {firm.challenge_types?.map((type, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Platforms */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Platforms</h4>
              <div className="flex flex-wrap gap-1.5">
                {firm.platforms?.map((platform, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Key Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Min Days:</span>
                <span className="text-white">{firm.min_trading_days || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time Limit:</span>
                <span className="text-white">{firm.time_limit || 'Unlimited'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Drawdown Type:</span>
                <span className="text-white">{firm.drawdown_type || 'Static'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payout:</span>
                <span className="text-white">{firm.payout_frequency || 'Bi-weekly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Max Scaling:</span>
                <span className="text-emerald-400">{firm.scaling_max || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Refund:</span>
                <span className={firm.fee_refund ? 'text-emerald-400' : 'text-gray-500'}>
                  {firm.fee_refund ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            
            {/* Special Features */}
            {firm.special_features && firm.special_features.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Special Features</h4>
                <ul className="space-y-1">
                  {firm.special_features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="p-5 pt-0 flex gap-3">
        <Link 
          href={`/prop-firm/${firm.slug}`}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white text-center font-medium rounded-xl transition-colors"
        >
          View Details
        </Link>
        <a 
          href={firm.affiliate_url || firm.website_url}
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
  firms 
}: { 
  filters: any, 
  setFilters: (f: any) => void,
  firms: PropFirm[]
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Calculate available options from data
  const platforms = useMemo(() => {
    const all = firms.flatMap(f => f.platforms || [])
    return Array.from(new Set(all)).sort()
  }, [firms])
  
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
      {/* Filter Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
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
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Filter Content */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-700/50 space-y-6 animate-in slide-in-from-top-2 duration-200">
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
              value={filters.maxPrice || 1000}
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
                { key: 'allowsScalping', label: 'Scalping Allowed' },
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
              value={filters.platform || ''}
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
      )}
    </div>
  )
}

// Quick Comparison Table
const QuickComparisonTable = ({ firms }: { firms: PropFirm[] }) => {
  const topFirms = firms.slice(0, 10)
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Prop Firm</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Rating</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Price</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Split</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Drawdown</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium">Target</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium hidden md:table-cell">Min Days</th>
            <th className="text-center py-3 px-2 text-gray-400 font-medium hidden lg:table-cell">Payout</th>
          </tr>
        </thead>
        <tbody>
          {topFirms.map((firm, i) => (
            <tr 
              key={firm.id} 
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-4">
                <Link href={`/prop-firm/${firm.slug}`} className="flex items-center gap-3 group">
                  <span className="text-gray-500 text-xs w-5">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
                    {firm.logo_url ? (
                      <Image src={firm.logo_url} alt="" width={32} height={32} className="object-contain" />
                    ) : (
                      <span className="text-emerald-400 font-bold">{firm.name.charAt(0)}</span>
                    )}
                  </div>
                  <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {firm.name}
                  </span>
                  {firm.discount_percent && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                      -{firm.discount_percent}%
                    </span>
                  )}
                </Link>
              </td>
              <td className="text-center py-3 px-2">
                <span className="inline-flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {firm.trustpilot_rating?.toFixed(1) || '-'}
                </span>
              </td>
              <td className="text-center py-3 px-2 text-white font-medium">${firm.min_price}</td>
              <td className="text-center py-3 px-2 text-emerald-400 font-medium">{firm.max_profit_split}%</td>
              <td className="text-center py-3 px-2 text-gray-300">{firm.max_total_drawdown}%</td>
              <td className="text-center py-3 px-2 text-gray-300">{firm.profit_target_phase1}%</td>
              <td className="text-center py-3 px-2 text-gray-300 hidden md:table-cell">{firm.min_trading_days || '-'}</td>
              <td className="text-center py-3 px-2 text-gray-300 hidden lg:table-cell">{firm.payout_frequency || 'Bi-weekly'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Main Component
export default function ComparePageClient({ initialFirms }: ComparePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<any>({})
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'split'>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [showOnlyVerified, setShowOnlyVerified] = useState(true)
  
  // Filter and sort firms
  const filteredFirms = useMemo(() => {
    let result = [...initialFirms]
    
    // Trust status filter
    if (showOnlyVerified) {
      result = result.filter(f => f.trust_status === 'verified')
    } else {
      result = result.filter(f => f.trust_status !== 'banned')
    }
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q)
      )
    }
    
    // Asset type filter
    if (filters.assetType === 'Futures') {
      result = result.filter(f => f.is_futures)
    } else if (filters.assetType === 'Forex') {
      result = result.filter(f => !f.is_futures)
    }
    
    // Price filter
    if (filters.maxPrice && filters.maxPrice < 1000) {
      result = result.filter(f => f.min_price <= filters.maxPrice)
    }
    
    // Profit split filter
    if (filters.minProfitSplit) {
      result = result.filter(f => f.max_profit_split >= filters.minProfitSplit)
    }
    
    // Trading style filters
    if (filters.allowsScalping) result = result.filter(f => f.allows_scalping)
    if (filters.allowsNewsTrading) result = result.filter(f => f.allows_news_trading)
    if (filters.allowsEA) result = result.filter(f => f.allows_ea)
    if (filters.hasInstantFunding) result = result.filter(f => f.has_instant_funding)
    
    // Platform filter
    if (filters.platform) {
      result = result.filter(f => f.platforms?.includes(filters.platform))
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
        case 'price':
          return (a.min_price || 0) - (b.min_price || 0)
        case 'split':
          return (b.max_profit_split || 0) - (a.max_profit_split || 0)
        default:
          return 0
      }
    })
    
    return result
  }, [initialFirms, searchQuery, filters, sortBy, showOnlyVerified])
  
  // Stats
  const stats = useMemo(() => ({
    total: filteredFirms.length,
    avgRating: (filteredFirms.reduce((sum, f) => sum + (f.trustpilot_rating || 0), 0) / filteredFirms.length).toFixed(1),
    avgSplit: Math.round(filteredFirms.reduce((sum, f) => sum + (f.max_profit_split || 0), 0) / filteredFirms.length),
    withDiscounts: filteredFirms.filter(f => f.discount_percent).length
  }), [filteredFirms])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Compare <span className="text-emerald-400">{filteredFirms.length}+</span> Prop Firms
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find the perfect prop firm for your trading style. Updated December 2025.
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
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-400">{stats.withDiscounts}</p>
              <p className="text-sm text-gray-500">With Discounts</p>
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
              <FilterSection filters={filters} setFilters={setFilters} firms={initialFirms} />
              
              {/* View Options */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-3">View Options</h3>
                
                {/* View Mode */}
                <div className="flex gap-2 mb-4">
                  {[
                    { mode: 'grid', icon: Grid3X3 },
                    { mode: 'list', icon: List },
                    { mode: 'table', icon: BarChart3 },
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as any)}
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-all ${
                        viewMode === mode
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
                
                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="price">Lowest Price</option>
                    <option value="split">Highest Split</option>
                  </select>
                </div>
                
                {/* Verified Toggle */}
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
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  Showing <span className="text-white font-medium">{filteredFirms.length}</span> prop firms
                </p>
              </div>
              
              {/* Table View */}
              {viewMode === 'table' && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden mb-8">
                  <QuickComparisonTable firms={filteredFirms} />
                </div>
              )}
              
              {/* Grid/List View */}
              {viewMode !== 'table' && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }>
                  {filteredFirms.map(firm => (
                    <PropFirmCard 
                      key={firm.id} 
                      firm={firm} 
                      isCompact={viewMode === 'list'} 
                    />
                  ))}
                </div>
              )}
              
              {/* Empty State */}
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
