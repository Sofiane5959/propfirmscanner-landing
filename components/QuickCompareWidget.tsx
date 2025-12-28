'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, ChevronDown, Check, X, Zap, Shield, TrendingUp, 
  DollarSign, Award, ArrowRight, Sparkles, Clock
} from 'lucide-react'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  trustpilot_rating: number
  min_price: number
  profit_split: number
  max_profit_split: number
  max_total_drawdown: number
  profit_target_phase1: number
  min_trading_days: number
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  has_instant_funding: boolean
  is_futures: boolean
  discount_percent: number
}

interface QuickCompareProps {
  firms: PropFirm[]
}

// Category definitions
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Award },
  { id: 'best-rated', label: 'Best Rated', icon: Star },
  { id: 'cheapest', label: 'Cheapest', icon: DollarSign },
  { id: 'high-split', label: 'High Split', icon: TrendingUp },
  { id: 'scalping', label: 'For Scalpers', icon: Zap },
  { id: 'futures', label: 'Futures', icon: Shield },
]

// Mini Prop Firm Card
const MiniCard = ({ firm, rank }: { firm: PropFirm, rank: number }) => (
  <Link href={`/prop-firm/${firm.slug}`}>
    <div className="group relative bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300">
      {/* Rank Badge */}
      <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
        rank === 1 ? 'bg-yellow-500 text-yellow-900' :
        rank === 2 ? 'bg-gray-400 text-gray-900' :
        rank === 3 ? 'bg-orange-500 text-orange-900' :
        'bg-gray-700 text-gray-300'
      }`}>
        {rank}
      </div>
      
      {/* Discount Badge */}
      {firm.discount_percent && firm.discount_percent >= 20 && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-lg">
          -{firm.discount_percent}%
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
          {firm.logo_url ? (
            <Image src={firm.logo_url} alt={firm.name} width={40} height={40} className="object-contain" />
          ) : (
            <span className="text-lg font-bold text-emerald-400">{firm.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
            {firm.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-400">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-gray-500 text-xs">From</p>
          <p className="text-white font-semibold">${firm.min_price}</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-gray-500 text-xs">Split</p>
          <p className="text-emerald-400 font-semibold">{firm.max_profit_split}%</p>
        </div>
      </div>
      
      {/* Features Tags */}
      <div className="flex flex-wrap gap-1 mt-3">
        {firm.allows_scalping && (
          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded">Scalping</span>
        )}
        {firm.has_instant_funding && (
          <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded">Instant</span>
        )}
        {firm.is_futures && (
          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded">Futures</span>
        )}
      </div>
    </div>
  </Link>
)

// Main Quick Compare Widget
export default function QuickCompareWidget({ firms }: QuickCompareProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Filter and sort firms based on category
  const displayedFirms = useMemo(() => {
    let filtered = [...firms].filter(f => f.trustpilot_rating)
    
    switch (selectedCategory) {
      case 'best-rated':
        filtered.sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
        break
      case 'cheapest':
        filtered.sort((a, b) => (a.min_price || 999) - (b.min_price || 999))
        break
      case 'high-split':
        filtered.sort((a, b) => (b.max_profit_split || 0) - (a.max_profit_split || 0))
        break
      case 'scalping':
        filtered = filtered.filter(f => f.allows_scalping)
        filtered.sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
        break
      case 'futures':
        filtered = filtered.filter(f => f.is_futures)
        filtered.sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
        break
      default:
        filtered.sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
    }
    
    return filtered.slice(0, 6)
  }, [firms, selectedCategory])

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Quick Compare
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Perfect Prop Firm
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Compare top prop firms at a glance. Filter by category to find the best match for your trading style.
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* Firms Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {displayedFirms.map((firm, i) => (
            <MiniCard key={firm.id} firm={firm} rank={i + 1} />
          ))}
        </div>
        
        {/* View All CTA */}
        <div className="text-center">
          <Link 
            href="/compare"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all"
          >
            Compare All {firms.length}+ Firms
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// Hero Stats Bar Component
export function HeroStats({ totalFirms, avgRating }: { totalFirms: number, avgRating: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-white">{totalFirms}+</p>
        <p className="text-sm text-gray-500">Prop Firms</p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-yellow-400">{avgRating}</p>
        <p className="text-sm text-gray-500">Avg. Rating</p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-emerald-400">2025</p>
        <p className="text-sm text-gray-500">Updated</p>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
        <p className="text-3xl font-bold text-purple-400">Free</p>
        <p className="text-sm text-gray-500">To Use</p>
      </div>
    </div>
  )
}

// Feature Comparison Table Component
export function FeatureComparisonTable({ firms }: { firms: PropFirm[] }) {
  const topFirms = firms.slice(0, 5)
  
  return (
    <section className="py-16 px-4 bg-gray-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Side-by-Side Comparison</h2>
          <p className="text-gray-400">Compare key features of top prop firms</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-gray-500 font-medium">Feature</th>
                {topFirms.map(firm => (
                  <th key={firm.id} className="py-4 px-4 text-center">
                    <Link href={`/prop-firm/${firm.slug}`} className="hover:text-emerald-400">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mx-auto mb-2">
                        {firm.logo_url ? (
                          <Image src={firm.logo_url} alt="" width={40} height={40} className="object-contain" />
                        ) : (
                          <span className="text-emerald-400 font-bold">{firm.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-white font-medium text-sm">{firm.name}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Rating</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      {firm.trustpilot_rating?.toFixed(1)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Starting Price</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center text-white font-medium">
                    ${firm.min_price}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Max Profit Split</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center text-emerald-400 font-medium">
                    {firm.max_profit_split}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Max Drawdown</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center text-white">
                    {firm.max_total_drawdown}%
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">Scalping</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center">
                    {firm.allows_scalping ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">News Trading</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center">
                    {firm.allows_news_trading ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-400">EAs Allowed</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center">
                    {firm.allows_ea ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-400">Instant Funding</td>
                {topFirms.map(firm => (
                  <td key={firm.id} className="py-3 px-4 text-center">
                    {firm.has_instant_funding ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// Trading Style Cards Component
export function TradingStyleCards() {
  const styles = [
    {
      icon: Zap,
      title: 'Scalpers',
      description: 'Fast-paced, quick trades with tight spreads',
      link: '/best-for/scalping',
      color: 'emerald',
      features: ['Low spreads', 'No restrictions', 'Quick execution']
    },
    {
      icon: Clock,
      title: 'Swing Traders',
      description: 'Hold positions for days or weeks',
      link: '/best-for/swing-trading',
      color: 'blue',
      features: ['Weekend holding', 'No time limits', 'Relaxed rules']
    },
    {
      icon: Shield,
      title: 'News Traders',
      description: 'Trade around economic events',
      link: '/best-for/news-trading',
      color: 'purple',
      features: ['News allowed', 'High leverage', 'No restrictions']
    },
    {
      icon: TrendingUp,
      title: 'EA Traders',
      description: 'Automated trading strategies',
      link: '/best-for/ea-trading',
      color: 'orange',
      features: ['EAs allowed', 'API access', 'Copy trading']
    },
  ]
  
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  }
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Find by Trading Style</h2>
          <p className="text-gray-400">Discover prop firms that match how you trade</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {styles.map((style, i) => (
            <Link key={i} href={style.link}>
              <div className={`h-full border rounded-2xl p-6 transition-all hover:scale-105 ${colorClasses[style.color as keyof typeof colorClasses]}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  style.color === 'emerald' ? 'bg-emerald-500/20' :
                  style.color === 'blue' ? 'bg-blue-500/20' :
                  style.color === 'purple' ? 'bg-purple-500/20' :
                  'bg-orange-500/20'
                }`}>
                  <style.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{style.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{style.description}</p>
                <ul className="space-y-1">
                  {style.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-current" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
