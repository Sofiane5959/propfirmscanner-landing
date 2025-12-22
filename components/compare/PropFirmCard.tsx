'use client'

import type { PropFirm } from '@/types'
import { ExternalLink, MapPin, Shield } from 'lucide-react'

interface PropFirmCardProps {
  firm: PropFirm
  viewMode: 'grid' | 'list'
}

// Platform logos as SVG components with better visuals
const PlatformLogo = ({ platform, size = 'sm' }: { platform: string; size?: 'sm' | 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[9px]' : 'w-8 h-8 text-[10px]'
  
  const platforms: Record<string, { bg: string; text: string; label: string }> = {
    'MT4': {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-700',
      text: 'text-white',
      label: 'MT4',
    },
    'MT5': {
      bg: 'bg-gradient-to-br from-blue-600 to-indigo-700',
      text: 'text-white',
      label: 'MT5',
    },
    'cTrader': {
      bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      text: 'text-white',
      label: 'cT',
    },
    'DXtrade': {
      bg: 'bg-gradient-to-br from-purple-500 to-violet-700',
      text: 'text-white',
      label: 'DX',
    },
    'TradeLocker': {
      bg: 'bg-gradient-to-br from-emerald-500 to-green-700',
      text: 'text-white',
      label: 'TL',
    },
    'Match-Trader': {
      bg: 'bg-gradient-to-br from-orange-500 to-red-600',
      text: 'text-white',
      label: 'MT',
    },
    'NinjaTrader': {
      bg: 'bg-gradient-to-br from-red-500 to-red-700',
      text: 'text-white',
      label: 'NT',
    },
    'Tradovate': {
      bg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      text: 'text-white',
      label: 'TV',
    },
    'Rithmic': {
      bg: 'bg-gradient-to-br from-gray-600 to-gray-800',
      text: 'text-white',
      label: 'R',
    },
  }

  const platformData = platforms[platform]
  
  if (!platformData) {
    return (
      <div 
        className={`${sizeClass} rounded-lg bg-gray-600 flex items-center justify-center font-bold text-white`}
        title={platform}
      >
        {platform.substring(0, 2)}
      </div>
    )
  }

  return (
    <div 
      className={`${sizeClass} rounded-lg ${platformData.bg} ${platformData.text} flex items-center justify-center font-bold shadow-lg`}
      title={platform}
    >
      {platformData.label}
    </div>
  )
}

// Market/Asset colors
const marketColors: Record<string, string> = {
  'Forex': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Indices': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Metals': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Crypto': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Stocks': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Futures': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Energy': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
}

export function PropFirmCard({ firm, viewMode }: PropFirmCardProps) {
  const visitUrl = firm.affiliate_url || firm.website_url || '#'

  // Render star rating
  const renderStars = (rating: number | null) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Render logo with fallback
  const renderLogo = (size: 'sm' | 'lg' = 'lg') => {
    const sizeClasses = size === 'lg' ? 'w-14 h-14 text-xl' : 'w-12 h-12 text-lg'
    
    if (firm.logo_url) {
      return (
        <div className={`${sizeClasses} bg-white rounded-xl flex items-center justify-center overflow-hidden p-2`}>
          <img 
            src={firm.logo_url} 
            alt={`${firm.name} logo`}
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement!.innerHTML = `<span class="font-bold text-emerald-600">${firm.name.charAt(0)}</span>`
            }}
          />
        </div>
      )
    }
    
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-bold text-white`}>
        {firm.name.charAt(0)}
      </div>
    )
  }

  // Render platform badges with icons
  const renderPlatforms = () => {
    if (!firm.platforms || firm.platforms.length === 0) {
      return <span className="text-gray-500 text-xs">N/A</span>
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {firm.platforms.slice(0, 4).map((platform) => (
          <PlatformLogo key={platform} platform={platform} size="sm" />
        ))}
        {firm.platforms.length > 4 && (
          <div className="w-7 h-7 rounded-lg bg-gray-700 flex items-center justify-center text-[10px] text-gray-400 font-medium">
            +{firm.platforms.length - 4}
          </div>
        )}
      </div>
    )
  }

  // Render markets (formerly instruments)
  const renderMarkets = () => {
    if (!firm.instruments || firm.instruments.length === 0) {
      return <span className="text-gray-500 text-xs">N/A</span>
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {firm.instruments.slice(0, 5).map((market) => {
          const colorClass = marketColors[market] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          return (
            <span 
              key={market} 
              className={`px-2 py-0.5 ${colorClass} text-xs rounded-md border`}
            >
              {market}
            </span>
          )
        })}
        {firm.instruments.length > 5 && (
          <span className="px-2 py-0.5 text-gray-500 text-xs">+{firm.instruments.length - 5}</span>
        )}
      </div>
    )
  }

  // List View
  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-emerald-500/50 transition-all">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Logo & Name */}
          <div className="flex items-center gap-4 md:w-56">
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
              <p className="text-gray-500 text-xs uppercase">Platforms</p>
              {renderPlatforms()}
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase">Location</p>
              <p className="text-white font-semibold text-sm">{firm.headquarters || 'N/A'}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="md:w-32">
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Visit Site
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Grid View
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all group flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {renderLogo('lg')}
            <div>
              <h3 className="text-lg font-semibold text-white">{firm.name}</h3>
              {renderStars(firm.trustpilot_rating)}
            </div>
          </div>
        </div>
        
        {/* Location & Regulation */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          {firm.headquarters && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {firm.headquarters}
            </span>
          )}
          {firm.is_regulated && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3 h-3" />
              Regulated
            </span>
          )}
        </div>

        {/* Challenge Types */}
        <div className="flex flex-wrap gap-2 mt-3">
          {firm.challenge_types?.slice(0, 3).map((type) => (
            <span key={type} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
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

        {/* Platforms with icons */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase mb-2">Trading Platforms</p>
          {renderPlatforms()}
        </div>

        {/* Markets (formerly Instruments) */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs uppercase mb-2">Markets</p>
          {renderMarkets()}
        </div>

        {/* Trading Permissions - REMOVED WEEKEND */}
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {firm.allows_scalping && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Scalping
            </span>
          )}
          {firm.allows_news_trading && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              News
            </span>
          )}
          {firm.allows_ea && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              EA/Bots
            </span>
          )}
          {firm.allows_hedging && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Hedging
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-700 mt-auto">
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
        >
          Visit {firm.name}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
