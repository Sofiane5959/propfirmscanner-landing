'use client'

import Link from 'next/link'
import { 
  Star, ExternalLink, CheckCircle, 
  TrendingDown, Bot, Newspaper, Calendar,
  Clock, AlertTriangle, XCircle
} from 'lucide-react'

// =====================================================
// TRUST BADGE COMPONENT (intégré)
// =====================================================
type TrustStatus = 'verified' | 'new' | 'under_review' | 'banned'

const trustConfig = {
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/30',
  },
  new: {
    label: 'New',
    icon: Clock,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
  },
  under_review: {
    label: 'Under Review',
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/30',
  },
  banned: {
    label: 'Banned',
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/30',
  }
}

function TrustBadge({ status }: { status: TrustStatus }) {
  const config = trustConfig[status]
  const Icon = config.icon

  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-0.5 
      rounded-full text-xs font-medium border
      ${config.bgColor} ${config.textColor} ${config.borderColor}
    `}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

// =====================================================
// TYPES
// =====================================================
interface PropFirm {
  slug: string
  name: string
  logo?: string | null
  logo_url?: string | null
  rating?: number | null
  trustpilot_rating?: number | null
  reviews?: number | null
  trustpilot_reviews?: number | null
  priceFrom?: number | null
  min_price?: number | null
  profitSplit?: number | null
  profit_split?: number | null
  maxDrawdown?: number | null
  max_total_drawdown?: number | null
  drawdownType?: 'static' | 'trailing' | 'eod' | null
  drawdown_type?: string | null
  minTradingDays?: number | null
  platforms?: string[] | null
  markets?: string[] | null
  newsTrading?: boolean | null
  allows_news_trading?: boolean | null
  weekendHolding?: boolean | null
  allows_weekend_holding?: boolean | null
  eaAllowed?: boolean | null
  allows_ea?: boolean | null
  // New trust status field
  trust_status?: TrustStatus
  lastVerified?: string | null
  featured?: boolean
  closed_at?: string | null
  closure_reason?: string | null
}

interface PropFirmCardProps {
  firm: PropFirm
  compact?: boolean
}

// =====================================================
// MAIN COMPONENT
// =====================================================
export function PropFirmCard({ firm, compact = false }: PropFirmCardProps) {
  // Normalize data (support both naming conventions)
  const logo = firm.logo || firm.logo_url
  const rating = firm.rating || firm.trustpilot_rating
  const reviews = firm.reviews || firm.trustpilot_reviews
  const priceFrom = firm.priceFrom || firm.min_price
  const profitSplit = firm.profitSplit || firm.profit_split
  const maxDrawdown = firm.maxDrawdown || firm.max_total_drawdown
  const newsTrading = firm.newsTrading ?? firm.allows_news_trading
  const weekendHolding = firm.weekendHolding ?? firm.allows_weekend_holding
  const eaAllowed = firm.eaAllowed ?? firm.allows_ea
  const trustStatus = firm.trust_status || 'verified'

  // If banned, show warning card
  if (trustStatus === 'banned') {
    return (
      <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-6 opacity-75">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt={firm.name} className="w-14 h-14 rounded-xl object-contain bg-white/10 p-1 grayscale" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {firm.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white line-through opacity-75">{firm.name}</h3>
              <TrustBadge status="banned" />
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm font-medium mb-1">⚠️ This firm has been banned</p>
          {firm.closure_reason && (
            <p className="text-red-300/70 text-xs">{firm.closure_reason}</p>
          )}
          {firm.closed_at && (
            <p className="text-red-300/50 text-xs mt-1">
              Closed: {new Date(firm.closed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Compact version
  if (compact) {
    return (
      <Link
        href={`/prop-firm/${firm.slug}`}
        className="block bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logo && (
              <img src={logo} alt={firm.name} className="w-10 h-10 rounded-lg object-contain bg-white" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{firm.name}</span>
                <TrustBadge status={trustStatus} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                {rating && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {rating.toFixed(1)}
                  </span>
                )}
                {priceFrom && (
                  <span className="text-gray-400">From ${priceFrom}</span>
                )}
              </div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-500" />
        </div>
      </Link>
    )
  }

  // Full card version
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
            {logo ? (
              <img src={logo} alt={firm.name} className="w-14 h-14 rounded-xl object-contain bg-white p-1" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {firm.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">{firm.name}</h3>
              <TrustBadge status={trustStatus} />
            </div>
          </div>

          {/* Rating */}
          {rating && rating > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-lg">{rating.toFixed(1)}</span>
              </div>
              <div className="text-gray-500 text-xs">
                {reviews ? `${reviews.toLocaleString()} reviews` : 'Not tracked'}
              </div>
            </div>
          )}
        </div>

        {/* Warning for under_review */}
        {trustStatus === 'under_review' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
            <p className="text-yellow-400 text-xs">
              ⚠️ This firm is under review. Exercise caution.
            </p>
          </div>
        )}

        {/* New firm notice */}
        {trustStatus === 'new' && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
            <p className="text-blue-400 text-xs">
              🆕 New firm - Limited track record available
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">From</div>
            <div className="text-white font-semibold">
              {priceFrom ? `$${priceFrom}` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">Split</div>
            <div className="text-emerald-400 font-semibold">
              {profitSplit ? `${profitSplit}%` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">Max DD</div>
            <div className="text-white font-semibold">
              {maxDrawdown ? `${maxDrawdown}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Rules Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <RuleBadge 
            icon={Newspaper} 
            label="News" 
            allowed={newsTrading} 
          />
          <RuleBadge 
            icon={Calendar} 
            label="Weekend" 
            allowed={weekendHolding} 
          />
          <RuleBadge 
            icon={Bot} 
            label="EA" 
            allowed={eaAllowed} 
          />
          {(firm.drawdownType || firm.drawdown_type) && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
              (firm.drawdownType || firm.drawdown_type) === 'static' 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              <TrendingDown className="w-3 h-3" />
              {(firm.drawdownType || firm.drawdown_type) === 'static' ? 'Static DD' : 'Trailing DD'}
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

// =====================================================
// RULE BADGE COMPONENT
// =====================================================
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

// =====================================================
// PROP FIRM LIST COMPONENT
// =====================================================
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

export type { PropFirm, TrustStatus }
