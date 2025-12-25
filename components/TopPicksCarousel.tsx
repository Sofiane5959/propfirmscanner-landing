'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Star, ChevronLeft, ChevronRight, DollarSign, Trophy, Award, Gem, ExternalLink } from 'lucide-react'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url?: string
  trustpilot_rating?: number
  min_price?: number
  profit_split?: number
  max_account_size?: number
  account_sizes?: number[]
  allows_scalping?: boolean
  allows_news_trading?: boolean
  allows_ea?: boolean
  affiliate_url?: string
  website_url?: string
}

interface TopPicksCarouselProps {
  firms: PropFirm[]
}

const badges = [
  { label: "#1 Editor's Choice", color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Trophy },
  { label: '#2 Runner Up', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: Award },
  { label: '#3 Best Value', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Gem },
  { label: '#4 Top Rated', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Star },
  { label: '#5 Popular', color: 'text-pink-400', bg: 'bg-pink-500/20', icon: Star },
  { label: '#6 Recommended', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: Star },
  { label: '#7 Great Choice', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: Star },
  { label: '#8 Solid Pick', color: 'text-lime-400', bg: 'bg-lime-500/20', icon: Star },
  { label: '#9 Worth It', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Star },
  { label: '#10 Good Option', color: 'text-teal-400', bg: 'bg-teal-500/20', icon: Star },
]

export default function TopPicksCarousel({ firms }: TopPicksCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const topFirms = firms.slice(0, 10)

  return (
    <div className="relative bg-gradient-to-r from-yellow-500/5 via-emerald-500/5 to-blue-500/5 border border-yellow-500/20 rounded-2xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Editor's Top 10 Picks</h2>
            <p className="text-xs text-gray-400">Based on rating, rules & value</p>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg transition-all ${
              canScrollLeft 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg transition-all ${
              canScrollRight 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {topFirms.map((firm, index) => {
          const badge = badges[index]
          const BadgeIcon = badge.icon
          const maxAccount = firm.account_sizes?.length 
            ? Math.max(...firm.account_sizes) 
            : firm.max_account_size || 100000

          return (
            <div
              key={firm.id}
              className="flex-shrink-0 w-[280px] bg-gray-800/80 border border-gray-700 hover:border-emerald-500/50 rounded-xl p-4 transition-all group"
            >
              {/* Badge & Rank */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold ${badge.color} ${badge.bg} px-2 py-1 rounded-full flex items-center gap-1`}>
                  <BadgeIcon className="w-3 h-3" />
                  {badge.label}
                </span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {index + 1}
                </span>
              </div>

              {/* Logo & Name */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shrink-0">
                  {firm.logo_url ? (
                    <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-lg font-bold text-emerald-600">{firm.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                    {firm.name}
                  </h3>
                  {firm.trustpilot_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-white">{firm.trustpilot_rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="bg-gray-900/50 rounded-lg py-1.5 px-1">
                  <p className="text-[10px] text-gray-500 uppercase">From</p>
                  <p className="text-sm font-bold text-white">${firm.min_price || 99}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg py-1.5 px-1">
                  <p className="text-[10px] text-gray-500 uppercase">Split</p>
                  <p className="text-sm font-bold text-emerald-400">{firm.profit_split || 80}%</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg py-1.5 px-1">
                  <p className="text-[10px] text-gray-500 uppercase">Max</p>
                  <p className="text-sm font-bold text-white">${(maxAccount / 1000).toFixed(0)}K</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {firm.allows_scalping && (
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded">✓ Scalping</span>
                )}
                {firm.allows_news_trading && (
                  <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded">✓ News</span>
                )}
                {firm.allows_ea && (
                  <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] rounded">✓ EA</span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <a
                  href={firm.affiliate_url || firm.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <DollarSign className="w-3 h-3" />
                  Buy Challenge
                </a>
                <Link
                  href={`/prop-firm/${firm.slug}`}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Details
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Scroll indicator dots */}
      <div className="flex justify-center gap-1 mt-3">
        {[...Array(Math.ceil(topFirms.length / 3))].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === 0 ? 'bg-emerald-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
