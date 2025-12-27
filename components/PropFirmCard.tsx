'use client'

import Link from 'next/link'
import { 
  Star, ExternalLink, CheckCircle, AlertTriangle,
  TrendingDown, Clock, Percent, Globe, Bot, Newspaper, Calendar
} from 'lucide-react'

// Types
interface PropFirm {
  slug: string
  name: string
  logo?: string
  rating?: number
  reviews?: number
  priceFrom?: number
  profitSplit?: number
  maxDrawdown?: number
  drawdownType?: 'static' | 'trailing' | 'eod'
  minTradingDays?: number
  platforms?: string[]
  markets?: string[]
  newsTrading?: boolean
  weekendHolding?: boolean
  eaAllowed?: boolean
  status?: 'active' | 'under-review' | 'closed' | 'new'
  lastVerified?: string
  featured?: boolean
}

interface PropFirmCardProps {
  firm: PropFirm
  compact?: boolean
}

export function PropFirmCard({ firm, compact = false }: PropFirmCardProps) {
  const statusConfig = {
    'active': { label: 'Active', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'under-review': { label: 'Under Review', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'closed': { label: 'Closed', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    'new': { label: 'New', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  }

  const status = firm.status ? statusConfig[firm.status] : null

  if (compact) {
    return (
      <Link
        href={`/prop-firm/${firm.slug}`}
        className="block bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {firm.logo && (
              <img src={firm.logo} alt={firm.name} className="w-10 h-10 rounded-lg object-contain bg-white" />
            )}
            <div>
              <div className="text-white font-semibold">{firm.name}</div>
              <div className="flex items-center gap-2 text-sm">
                {firm.rating && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {firm.rating}
                  </span>
                )}
                {firm.priceFrom && (
                  <span className="text-gray-400">From ${firm.priceFrom}</span>
                )}
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </div>
      </Link>
    )
  }

  return (
    <div className={`bg-gray-800/50 border rounded-xl overflow-hidden ${
      firm.featured ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : 'border-gray-700'
    }`}>
      {/* Featured Badge */}
      {firm.featured && (
        <div className="bg-emerald-500 text-white text-xs font-bold py-1 px-3 text-center">
          ⭐ FEATURED
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {firm.logo ? (
              <img src={firm.logo} alt={firm.name} className="w-14 h-14 rounded-xl object-contain bg-white p-1" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {firm.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">{firm.name}</h3>
              {status && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                  {status.label}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          {firm.rating && firm.rating > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-lg">{firm.rating}</span>
              </div>
              <div className="text-gray-500 text-xs">
                {firm.reviews ? `${firm.reviews.toLocaleString()} reviews` : 'Not tracked'}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">From</div>
            <div className="text-white font-semibold">
              {firm.priceFrom ? `$${firm.priceFrom}` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">Split</div>
            <div className="text-emerald-400 font-semibold">
              {firm.profitSplit ? `${firm.profitSplit}%` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">Max DD</div>
            <div className="text-white font-semibold">
              {firm.maxDrawdown ? `${firm.maxDrawdown}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Rules Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <RuleBadge 
            icon={Newspaper} 
            label="News" 
            allowed={firm.newsTrading} 
          />
          <RuleBadge 
            icon={Calendar} 
            label="Weekend" 
            allowed={firm.weekendHolding} 
          />
          <RuleBadge 
            icon={Bot} 
            label="EA" 
            allowed={firm.eaAllowed} 
          />
          {firm.drawdownType && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
              firm.drawdownType === 'static' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              <TrendingDown className="w-3 h-3" />
              {firm.drawdownType === 'static' ? 'Static DD' : 'Trailing DD'}
            </span>
          )}
        </div>

        {/* Platforms & Markets */}
        {firm.platforms && firm.platforms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {firm.platforms.slice(0, 4).map(platform => (
              <span key={platform} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                {platform}
              </span>
            ))}
            {firm.platforms.length > 4 && (
              <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                +{firm.platforms.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Last Verified */}
        {firm.lastVerified && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Last verified: {new Date(firm.lastVerified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/prop-firm/${firm.slug}`}
          className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-center transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

// Rule Badge Component
function RuleBadge({ icon: Icon, label, allowed }: { icon: typeof Newspaper; label: string; allowed?: boolean | null }) {
  if (allowed === null || allowed === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
        <Icon className="w-3 h-3" />
        {label}: ?
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
      allowed 
        ? 'bg-emerald-500/10 text-emerald-400' 
        : 'bg-red-500/10 text-red-400'
    }`}>
      <Icon className="w-3 h-3" />
      {label}: {allowed ? '✓' : '✗'}
    </span>
  )
}

// Prop Firm List Component
interface PropFirmListProps {
  firms: PropFirm[]
  layout?: 'grid' | 'list'
}

export function PropFirmList({ firms, layout = 'grid' }: PropFirmListProps) {
  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {firms.map(firm => (
          <PropFirmCard key={firm.slug} firm={firm} compact />
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {firms.map(firm => (
        <PropFirmCard key={firm.slug} firm={firm} />
      ))}
    </div>
  )
}
