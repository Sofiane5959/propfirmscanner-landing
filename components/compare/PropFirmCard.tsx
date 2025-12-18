'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { PropFirm } from '@/types'

interface PropFirmCardProps {
  firm: PropFirm
  viewMode: 'grid' | 'list'
}

export function PropFirmCard({ firm, viewMode }: PropFirmCardProps) {
  // Generate star rating display
  const renderStars = (rating: number | null) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : i === fullStars && hasHalf ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-400 ml-1">
          {rating.toFixed(1)} ({firm.trustpilot_reviews?.toLocaleString() || 0})
        </span>
      </div>
    )
  }

  // Logo component with fallback
  const renderLogo = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClasses = size === 'lg' 
      ? 'w-14 h-14 text-xl' 
      : 'w-16 h-16 text-2xl'
    
    if (firm.logo_url) {
      return (
        <div className={`${sizeClasses} bg-white rounded-xl flex items-center justify-center overflow-hidden`}>
          <img 
            src={firm.logo_url} 
            alt={`${firm.name} logo`}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              // Fallback to letter if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement!.innerHTML = `<span class="font-bold text-emerald-400">${firm.name.charAt(0)}</span>`
            }}
          />
        </div>
      )
    }
    
    return (
      <div className={`${sizeClasses} bg-gray-700 rounded-xl flex items-center justify-center font-bold text-emerald-400`}>
        {firm.name.charAt(0)}
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-all">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-4 md:w-64">
            {renderLogo('sm')}
            <div>
              <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
              {renderStars(firm.trustpilot_rating)}
            </div>
          </div>

          {/* Key Stats */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-500 text-xs uppercase">From</p>
              <p className="text-white font-semibold">${firm.min_price || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase">Profit Split</p>
              <p className="text-emerald-400 font-semibold">{firm.profit_split || 'N/A'}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase">Max Drawdown</p>
              <p className="text-white font-semibold">{firm.max_total_drawdown || 'N/A'}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase">Founded</p>
              <p className="text-white font-semibold">{firm.founded_year || 'N/A'}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-2">
            <a
              href={firm.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Visit Site
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all group">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-4">
          {renderLogo('lg')}
          <div>
            <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
            {renderStars(firm.trustpilot_rating)}
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {firm.is_featured && (
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
              ⭐ Featured
            </span>
          )}
          {firm.challenge_types?.slice(0, 2).map((type) => (
            <span key={type} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs uppercase">Starting From</p>
            <p className="text-white font-semibold text-lg">${firm.min_price || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase">Profit Split</p>
            <p className="text-emerald-400 font-semibold text-lg">{firm.profit_split || 'N/A'}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase">Daily Drawdown</p>
            <p className="text-white font-semibold">{firm.max_daily_drawdown || 'N/A'}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase">Max Drawdown</p>
            <p className="text-white font-semibold">{firm.max_total_drawdown || 'N/A'}%</p>
          </div>
        </div>

        {/* Platforms */}
        <div>
          <p className="text-gray-500 text-xs uppercase mb-2">Platforms</p>
          <div className="flex flex-wrap gap-1">
            {firm.platforms?.slice(0, 3).map((platform) => (
              <span key={platform} className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded">
                {platform}
              </span>
            ))}
            {firm.platforms?.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{firm.platforms.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Trading Permissions */}
        <div className="flex flex-wrap gap-2">
          {firm.allows_scalping && (
            <span className="text-xs text-green-400">✓ Scalping</span>
          )}
          {firm.allows_news_trading && (
            <span className="text-xs text-green-400">✓ News</span>
          )}
          {firm.allows_ea && (
            <span className="text-xs text-green-400">✓ EA/Bots</span>
          )}
          {firm.allows_weekend_holding && (
            <span className="text-xs text-green-400">✓ Weekend</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <a
          href={firm.website_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg font-medium transition-colors"
        >
          Visit {firm.name} →
        </a>
      </div>
    </div>
  )
}
