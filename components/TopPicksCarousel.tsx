'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, Trophy, TrendingUp, Zap } from 'lucide-react'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  min_price: number
  profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
}

interface TopPicksCarouselProps {
  firms: PropFirm[]
}

export default function TopPicksCarousel({ firms }: TopPicksCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Get top 10 firms by Trustpilot rating
  const topFirms = [...firms]
    .sort((a, b) => b.trustpilot_rating - a.trustpilot_rating)
    .slice(0, 10)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    if (index === 1) return { icon: Trophy, color: 'text-gray-400', bg: 'bg-gray-400/10' }
    if (index === 2) return { icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-600/10' }
    return { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' }
  }

  return (
    <section className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Top 10 Prop Firms</h2>
            <p className="text-sm text-gray-400">Highest rated by traders worldwide</p>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg border transition-all ${
              canScrollLeft
                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-white'
                : 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg border transition-all ${
              canScrollRight
                ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-white'
                : 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topFirms.map((firm, index) => {
            const { icon: RankIcon, color, bg } = getRankBadge(index)
            
            return (
              <Link
                key={firm.id}
                href={`/prop-firm/${firm.slug}`}
                className="flex-shrink-0 w-[300px] group"
              >
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full">
                  {/* Rank Badge & Logo */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${bg}`}>
                      <RankIcon className={`w-4 h-4 ${color}`} />
                      <span className={`text-sm font-bold ${color}`}>#{index + 1}</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden">
                      {firm.logo_url ? (
                        <Image
                          src={firm.logo_url}
                          alt={firm.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {firm.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Firm Name */}
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {firm.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-semibold">{firm.trustpilot_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({firm.trustpilot_reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">From</p>
                      <p className="text-white font-bold">${firm.min_price}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Profit Split</p>
                      <p className="text-green-400 font-bold">{firm.profit_split}%</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Daily DD</p>
                      <p className="text-orange-400 font-bold">{firm.max_daily_drawdown}%</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Max DD</p>
                      <p className="text-red-400 font-bold">{firm.max_total_drawdown}%</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-blue-400 text-sm font-medium group-hover:text-blue-300">
                    <span>View Details</span>
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Gradient Edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>

      {/* View All Link */}
      <div className="text-center mt-4">
        <Link
          href="/compare"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          View all 100 prop firms →
        </Link>
      </div>
    </section>
  )
}
