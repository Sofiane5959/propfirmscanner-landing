'use client'

import { PropFirm } from '@/types'
import { getPromotionForFirm } from '@/lib/data'
import { Star, ExternalLink, Heart, Check, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface PropFirmCardProps {
  firm: PropFirm
  viewMode?: 'grid' | 'list'
}

export function PropFirmCard({ firm, viewMode = 'grid' }: PropFirmCardProps) {
  const promotion = getPromotionForFirm(firm.id)

  if (viewMode === 'list') {
    return <PropFirmListCard firm={firm} promotion={promotion} />
  }

  return (
    <div className="glass rounded-2xl overflow-hidden group hover:border-brand-500/30 transition-all duration-300">
      {/* Promo Banner */}
      {promotion && (
        <div className="bg-gradient-to-r from-brand-500/20 to-emerald-500/20 px-4 py-2 text-center">
          <span className="text-sm font-medium text-brand-400">
            🔥 {promotion.discount_percent}% OFF with code{' '}
            <code className="px-2 py-0.5 bg-brand-500/20 rounded text-brand-300">{promotion.code}</code>
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-lg font-bold text-white">{firm.name[0]}</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{firm.name}</h3>
              <div className="flex items-center gap-1 text-sm">
                {firm.trustpilot_score && (
                  <>
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{firm.trustpilot_score}</span>
                    <span className="text-dark-500">({firm.trustpilot_reviews?.toLocaleString()})</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 text-dark-400 hover:text-red-400 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-dark-400 mb-1">Starting From</div>
            <div className="text-lg font-bold text-white">${firm.min_price}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-dark-400 mb-1">Profit Split</div>
            <div className="text-lg font-bold text-brand-400">{firm.profit_split}%</div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Max Drawdown</span>
            <span className="text-white font-medium">{firm.max_total_drawdown}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Challenge</span>
            <span className="text-white font-medium">
              {firm.challenge_types.map(t => t === '1-step' ? '1-Step' : t === '2-step' ? '2-Step' : 'Instant').join(', ')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-400">Platforms</span>
            <span className="text-white font-medium text-right">{firm.platforms.slice(0, 3).join(', ')}</span>
          </div>
        </div>

        {/* Trading Rules Quick View */}
        <div className="flex flex-wrap gap-2 mb-4">
          <RuleBadge allowed={firm.allows_scalping} label="Scalping" />
          <RuleBadge allowed={firm.allows_news_trading} label="News" />
          <RuleBadge allowed={firm.allows_weekend_holding} label="Weekend" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/compare/${firm.slug}`}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            View Details
          </Link>
          <a
            href={firm.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
          >
            Visit Site
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

function PropFirmListCard({ firm, promotion }: { firm: PropFirm; promotion: any }) {
  return (
    <div className="glass rounded-xl p-4 hover:border-brand-500/30 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Logo & Name */}
        <div className="flex items-center gap-3 md:w-48">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {firm.logo_url ? (
              <img src={firm.logo_url} alt={firm.name} className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-lg font-bold text-white">{firm.name[0]}</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{firm.name}</h3>
            {firm.trustpilot_score && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400 text-xs">{firm.trustpilot_score}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-dark-400">Starting From</div>
            <div className="font-semibold text-white">${firm.min_price}</div>
          </div>
          <div>
            <div className="text-xs text-dark-400">Profit Split</div>
            <div className="font-semibold text-brand-400">{firm.profit_split}%</div>
          </div>
          <div>
            <div className="text-xs text-dark-400">Max Drawdown</div>
            <div className="font-semibold text-white">{firm.max_total_drawdown}%</div>
          </div>
          <div>
            <div className="text-xs text-dark-400">Platforms</div>
            <div className="font-semibold text-white text-sm">{firm.platforms.slice(0, 2).join(', ')}</div>
          </div>
        </div>

        {/* Promo */}
        {promotion && (
          <div className="md:w-32 text-center">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-brand-500/20 text-brand-400 rounded">
              {promotion.discount_percent}% OFF
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 md:w-auto">
          <Link
            href={`/compare/${firm.slug}`}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Details
          </Link>
          <a
            href={firm.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-sm font-medium text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Visit
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

function RuleBadge({ allowed, label }: { allowed: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
        allowed
          ? 'bg-green-500/10 text-green-400'
          : 'bg-red-500/10 text-red-400'
      }`}
    >
      {allowed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </span>
  )
}
