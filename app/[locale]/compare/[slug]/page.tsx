import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, CheckCircle, XCircle, Trophy, ArrowLeft, 
  DollarSign, ExternalLink, TrendingUp, Clock, 
  Target, Shield, Zap, Calendar, Percent,
  Award, ChevronRight
} from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Popular comparisons for static generation
const popularComparisons = [
  'ftmo-vs-fundednext',
  'ftmo-vs-the5ers',
  'ftmo-vs-myfundedfx',
  'ftmo-vs-e8-funding',
  'ftmo-vs-alpha-capital-group',
  'fundednext-vs-the5ers',
  'fundednext-vs-myfundedfx',
  'the5ers-vs-myfundedfx',
  'ftmo-vs-topstep',
  'fundednext-vs-e8-funding',
]

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  min_price: number
  profit_split: number
  max_profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  min_trading_days: number
  payout_frequency: string
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  has_free_repeat: boolean
  fee_refund: boolean
  platforms: string[]
  challenge_types: string[]
  drawdown_type: string
  scaling_max: string
}

interface Props {
  params: { slug: string }
}

// Parse slug to get firm slugs (supports 2-4 firms)
function parseSlugs(slug: string): string[] {
  return slug.split('-vs-').filter(Boolean)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugs = parseSlugs(params.slug)
  if (slugs.length < 2 || slugs.length > 4) return { title: 'Comparison Not Found' }

  const { data: firms } = await supabase
    .from('prop_firms')
    .select('name, slug')
    .in('slug', slugs)

  if (!firms || firms.length !== slugs.length) return { title: 'Comparison Not Found' }

  const firmNames = slugs.map(s => firms.find(f => f.slug === s)?.name).filter(Boolean)
  const title = `${firmNames.join(' vs ')} - Detailed Comparison 2026`
  const description = `Compare ${firmNames.join(' vs ')}: pricing, profit split, trading rules, and more. Find the best prop firm for your trading style.`

  return {
    title,
    description,
    keywords: [
      firmNames.join(' vs '),
      ...firmNames.map(n => `${n} review`),
      'prop firm comparison',
      'best prop firm 2026',
    ],
    openGraph: {
      title,
      description,
      url: `https://propfirmscanner.org/compare/${params.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://propfirmscanner.org/compare/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return popularComparisons.map(slug => ({ slug }))
}

export default async function ComparePage({ params }: Props) {
  const slugs = parseSlugs(params.slug)
  if (slugs.length < 2 || slugs.length > 4) notFound()

  const { data: firmsData } = await supabase
    .from('prop_firms')
    .select('*')
    .in('slug', slugs)

  if (!firmsData || firmsData.length !== slugs.length) notFound()

  // Maintain order from URL
  const firms: PropFirm[] = slugs.map(s => firmsData.find(f => f.slug === s)!).filter(Boolean)

  // Calculate scores for each firm
  const scores = firms.map(firm => {
    let score = 0
    // Rating (max 25 points)
    score += (firm.trustpilot_rating || 0) * 5
    // Price (lower is better, max 20 points)
    score += Math.max(0, 20 - (firm.min_price || 100) / 10)
    // Profit split (max 20 points)
    score += ((firm.max_profit_split || firm.profit_split || 80) / 5)
    // Features (5 points each)
    if (firm.allows_scalping) score += 5
    if (firm.allows_news_trading) score += 5
    if (firm.allows_ea) score += 5
    if (firm.allows_weekend_holding) score += 3
    if (firm.has_instant_funding) score += 5
    if (firm.fee_refund) score += 5
    return Math.round(score)
  })

  const maxScore = Math.max(...scores)
  const winnerIndex = scores.indexOf(maxScore)

  // Comparison rows
  const comparisonData = [
    {
      category: 'Pricing & Value',
      icon: DollarSign,
      rows: [
        {
          label: 'Starting Price',
          values: firms.map(f => f.min_price ? `$${f.min_price}` : 'N/A'),
          best: 'lowest',
          rawValues: firms.map(f => f.min_price || 9999),
        },
        {
          label: 'Profit Split',
          values: firms.map(f => {
            if (!f.profit_split && !f.max_profit_split) return 'N/A'
            if (f.profit_split === f.max_profit_split || !f.max_profit_split) return `${f.profit_split}%`
            return `${f.profit_split}→${f.max_profit_split}%`
          }),
          best: 'highest',
          rawValues: firms.map(f => f.max_profit_split || f.profit_split || 0),
        },
        {
          label: 'Fee Refund',
          values: firms.map(f => f.fee_refund),
          best: 'boolean',
          rawValues: firms.map(f => f.fee_refund ? 1 : 0),
        },
      ],
    },
    {
      category: 'Challenge Rules',
      icon: Target,
      rows: [
        {
          label: 'Profit Target P1',
          values: firms.map(f => f.profit_target_phase1 ? `${f.profit_target_phase1}%` : 'N/A'),
          best: 'lowest',
          rawValues: firms.map(f => f.profit_target_phase1 || 99),
        },
        {
          label: 'Profit Target P2',
          values: firms.map(f => f.profit_target_phase2 ? `${f.profit_target_phase2}%` : 'N/A'),
          best: 'lowest',
          rawValues: firms.map(f => f.profit_target_phase2 || 99),
        },
        {
          label: 'Min Trading Days',
          values: firms.map(f => f.min_trading_days === 0 ? 'None' : f.min_trading_days ? `${f.min_trading_days} days` : 'N/A'),
          best: 'lowest',
          rawValues: firms.map(f => f.min_trading_days ?? 99),
        },
      ],
    },
    {
      category: 'Risk Management',
      icon: Shield,
      rows: [
        {
          label: 'Daily Drawdown',
          values: firms.map(f => f.max_daily_drawdown ? `${f.max_daily_drawdown}%` : 'N/A'),
          best: 'highest',
          rawValues: firms.map(f => f.max_daily_drawdown || 0),
        },
        {
          label: 'Max Drawdown',
          values: firms.map(f => f.max_total_drawdown ? `${f.max_total_drawdown}%` : 'N/A'),
          best: 'highest',
          rawValues: firms.map(f => f.max_total_drawdown || 0),
        },
        {
          label: 'Drawdown Type',
          values: firms.map(f => f.drawdown_type || 'Balance-based'),
          best: 'none',
          rawValues: firms.map(() => 0),
        },
      ],
    },
    {
      category: 'Trading Freedom',
      icon: Zap,
      rows: [
        {
          label: 'Scalping',
          values: firms.map(f => f.allows_scalping),
          best: 'boolean',
          rawValues: firms.map(f => f.allows_scalping ? 1 : 0),
        },
        {
          label: 'News Trading',
          values: firms.map(f => f.allows_news_trading),
          best: 'boolean',
          rawValues: firms.map(f => f.allows_news_trading ? 1 : 0),
        },
        {
          label: 'EAs / Bots',
          values: firms.map(f => f.allows_ea),
          best: 'boolean',
          rawValues: firms.map(f => f.allows_ea ? 1 : 0),
        },
        {
          label: 'Weekend Holding',
          values: firms.map(f => f.allows_weekend_holding),
          best: 'boolean',
          rawValues: firms.map(f => f.allows_weekend_holding ? 1 : 0),
        },
      ],
    },
    {
      category: 'Payouts & Scaling',
      icon: TrendingUp,
      rows: [
        {
          label: 'Payout Frequency',
          values: firms.map(f => f.payout_frequency || 'Bi-weekly'),
          best: 'none',
          rawValues: firms.map(() => 0),
        },
        {
          label: 'Instant Funding',
          values: firms.map(f => f.has_instant_funding),
          best: 'boolean',
          rawValues: firms.map(f => f.has_instant_funding ? 1 : 0),
        },
        {
          label: 'Max Scaling',
          values: firms.map(f => f.scaling_max || 'N/A'),
          best: 'none',
          rawValues: firms.map(() => 0),
        },
      ],
    },
  ]

  // Find best value in each row
  const getBestIndices = (rawValues: number[], best: string): number[] => {
    if (best === 'none') return []
    if (best === 'boolean') {
      const max = Math.max(...rawValues)
      if (max === 0) return []
      return rawValues.map((v, i) => v === max ? i : -1).filter(i => i !== -1)
    }
    if (best === 'lowest') {
      const min = Math.min(...rawValues)
      if (min === 9999 || min === 99) return []
      return rawValues.map((v, i) => v === min ? i : -1).filter(i => i !== -1)
    }
    if (best === 'highest') {
      const max = Math.max(...rawValues)
      if (max === 0) return []
      return rawValues.map((v, i) => v === max ? i : -1).filter(i => i !== -1)
    }
    return []
  }

  // Grid columns based on number of firms
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[firms.length] || 'grid-cols-2'

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link 
            href="/compare" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all firms
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {firms.map(f => f.name).join(' vs ')}
          </h1>
          <p className="text-gray-400">
            Detailed comparison of {firms.length} prop trading firms
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Firm Cards */}
        <div className={`grid ${gridCols} gap-4 mb-8`}>
          {firms.map((firm, index) => (
            <FirmCard 
              key={firm.id} 
              firm={firm} 
              score={scores[index]}
              isWinner={index === winnerIndex && firms.length > 2}
              rank={index + 1}
            />
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Header */}
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium w-48 sticky left-0 bg-gray-800/90 backdrop-blur-sm">
                    Feature
                  </th>
                  {firms.map((firm, i) => (
                    <th key={firm.id} className="p-4 text-center min-w-[140px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
                          {firm.logo_url ? (
                            <Image src={firm.logo_url} alt={firm.name} width={32} height={32} className="object-contain" />
                          ) : (
                            <span className="text-sm font-bold text-emerald-600">{firm.name.charAt(0)}</span>
                          )}
                        </div>
                        <span className="text-white font-semibold text-sm">{firm.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparisonData.map((section, sectionIndex) => (
                  <>
                    {/* Section Header */}
                    <tr key={`section-${sectionIndex}`} className="bg-gray-900/50">
                      <td colSpan={firms.length + 1} className="p-3">
                        <div className="flex items-center gap-2">
                          <section.icon className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold text-sm">{section.category}</span>
                        </div>
                      </td>
                    </tr>

                    {/* Section Rows */}
                    {section.rows.map((row, rowIndex) => {
                      const bestIndices = getBestIndices(row.rawValues, row.best)
                      
                      return (
                        <tr 
                          key={`row-${sectionIndex}-${rowIndex}`} 
                          className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="p-4 text-gray-300 text-sm sticky left-0 bg-gray-900/80 backdrop-blur-sm">
                            {row.label}
                          </td>
                          {row.values.map((value, valueIndex) => {
                            const isBest = bestIndices.includes(valueIndex)
                            const isBoolean = typeof value === 'boolean'
                            
                            return (
                              <td 
                                key={valueIndex} 
                                className={`p-4 text-center ${isBest ? 'bg-emerald-500/10' : ''}`}
                              >
                                {isBoolean ? (
                                  value ? (
                                    <CheckCircle className={`w-5 h-5 mx-auto ${isBest ? 'text-emerald-400' : 'text-emerald-500/70'}`} />
                                  ) : (
                                    <XCircle className="w-5 h-5 mx-auto text-red-500/50" />
                                  )
                                ) : (
                                  <span className={`text-sm font-medium ${isBest ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    {value}
                                  </span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </>
                ))}

                {/* Platforms Row */}
                <tr className="bg-gray-900/50">
                  <td colSpan={firms.length + 1} className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold text-sm">Platforms</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-gray-300 text-sm sticky left-0 bg-gray-900/80">Trading Platforms</td>
                  {firms.map((firm, i) => (
                    <td key={i} className="p-4">
                      <div className="flex flex-wrap justify-center gap-1">
                        {(firm.platforms || []).slice(0, 4).map(p => (
                          <span key={p} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                            {p}
                          </span>
                        ))}
                        {(firm.platforms || []).length > 4 && (
                          <span className="text-xs text-gray-500">+{firm.platforms.length - 4}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr className="bg-gray-900/50">
                  <td colSpan={firms.length + 1} className="p-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold text-sm">Reputation</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300 text-sm sticky left-0 bg-gray-900/80">Trustpilot Rating</td>
                  {firms.map((firm, i) => {
                    const maxRating = Math.max(...firms.map(f => f.trustpilot_rating || 0))
                    const isBest = firm.trustpilot_rating === maxRating && maxRating > 0
                    return (
                      <td key={i} className={`p-4 text-center ${isBest ? 'bg-emerald-500/10' : ''}`}>
                        <div className="flex items-center justify-center gap-1">
                          <Star className={`w-4 h-4 ${isBest ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-500/70 fill-yellow-500/70'}`} />
                          <span className={`font-semibold ${isBest ? 'text-white' : 'text-gray-300'}`}>
                            {firm.trustpilot_rating?.toFixed(1) || 'N/A'}
                          </span>
                          {firm.trustpilot_reviews && (
                            <span className="text-gray-500 text-xs">({firm.trustpilot_reviews.toLocaleString()})</span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verdict Section */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Our Verdict</h2>
          </div>

          {firms.length === 2 ? (
            <TwoFirmVerdict firms={firms} scores={scores} winnerIndex={winnerIndex} />
          ) : (
            <MultiFirmVerdict firms={firms} scores={scores} winnerIndex={winnerIndex} />
          )}
        </div>

        {/* CTA Cards */}
        <div className={`grid ${gridCols} gap-4 mb-8`}>
          {firms.map((firm, index) => (
            <div 
              key={firm.id}
              className={`bg-gray-800/50 border rounded-xl p-5 text-center ${
                index === winnerIndex ? 'border-emerald-500/50' : 'border-gray-700'
              }`}
            >
              <p className="text-gray-400 text-sm mb-1">Get Started with</p>
              <p className="text-lg font-bold text-white mb-4">{firm.name}</p>
              <div className="flex flex-col gap-2">
                <a
                  href={firm.affiliate_url || firm.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <DollarSign className="w-4 h-4" />
                  Buy Challenge
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  href={`/prop-firm/${firm.slug}`}
                  className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Other Comparisons */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-emerald-400" />
            Other Popular Comparisons
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularComparisons
              .filter(c => c !== params.slug)
              .slice(0, 8)
              .map(comparison => (
                <Link
                  key={comparison}
                  href={`/compare/${comparison}`}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  {comparison.split('-vs-').map(s => 
                    s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  ).join(' vs ')}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Firm Card Component
function FirmCard({ firm, score, isWinner, rank }: { firm: PropFirm; score: number; isWinner: boolean; rank: number }) {
  return (
    <div className={`relative bg-gray-800/50 border rounded-2xl p-4 md:p-5 ${isWinner ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-gray-700'}`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
          <Trophy className="w-3 h-3" /> BEST CHOICE
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1.5">
          {firm.logo_url ? (
            <Image src={firm.logo_url} alt={firm.name} width={48} height={48} className="object-contain" />
          ) : (
            <span className="text-xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-white truncate">{firm.name}</h2>
          {firm.trustpilot_rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium text-sm">{firm.trustpilot_rating.toFixed(1)}</span>
              <span className="text-gray-500 text-xs">/ 5</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-2.5 text-center">
          <p className="text-gray-500 text-[10px] uppercase mb-0.5">From</p>
          <p className="text-lg font-bold text-white">${firm.min_price || '99'}</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2.5 text-center">
          <p className="text-gray-500 text-[10px] uppercase mb-0.5">Split</p>
          <p className="text-lg font-bold text-emerald-400">
            {firm.max_profit_split || firm.profit_split || 80}%
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {firm.allows_scalping && (
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full">Scalping</span>
        )}
        {firm.allows_news_trading && (
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded-full">News</span>
        )}
        {firm.allows_ea && (
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] rounded-full">EAs</span>
        )}
        {firm.has_instant_funding && (
          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded-full">Instant</span>
        )}
      </div>

      {/* Score Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Score</span>
          <span className="text-white font-medium">{score}/100</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${isWinner ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Two Firm Verdict
function TwoFirmVerdict({ firms, scores, winnerIndex }: { firms: PropFirm[]; scores: number[]; winnerIndex: number }) {
  const winner = firms[winnerIndex]
  const loser = firms[winnerIndex === 0 ? 1 : 0]

  return (
    <>
      <p className="text-gray-300 text-lg leading-relaxed mb-6">
        Based on our analysis, <span className="text-emerald-400 font-semibold">{winner.name}</span> edges out 
        with a score of {scores[winnerIndex]} vs {scores[winnerIndex === 0 ? 1 : 0]}. 
        However, both are solid choices depending on your priorities.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Choose {firms[0].name} if:
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            {(firms[0].max_profit_split || firms[0].profit_split || 0) >= (firms[1].max_profit_split || firms[1].profit_split || 0) && (
              <li>• You want higher profit split potential</li>
            )}
            {(firms[0].min_price || 999) <= (firms[1].min_price || 999) && (
              <li>• You're looking for lower entry cost</li>
            )}
            {(firms[0].trustpilot_rating || 0) > (firms[1].trustpilot_rating || 0) && (
              <li>• Reputation and reviews matter most</li>
            )}
            {firms[0].allows_scalping && !firms[1].allows_scalping && <li>• You're a scalper</li>}
            {firms[0].allows_news_trading && !firms[1].allows_news_trading && <li>• You trade news events</li>}
            {firms[0].allows_ea && !firms[1].allows_ea && <li>• You use automated trading</li>}
            {firms[0].has_instant_funding && !firms[1].has_instant_funding && <li>• You want instant funding option</li>}
          </ul>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Choose {firms[1].name} if:
          </h3>
          <ul className="text-gray-400 text-sm space-y-2">
            {(firms[1].max_profit_split || firms[1].profit_split || 0) >= (firms[0].max_profit_split || firms[0].profit_split || 0) && (
              <li>• You want higher profit split potential</li>
            )}
            {(firms[1].min_price || 999) <= (firms[0].min_price || 999) && (
              <li>• You're looking for lower entry cost</li>
            )}
            {(firms[1].trustpilot_rating || 0) > (firms[0].trustpilot_rating || 0) && (
              <li>• Reputation and reviews matter most</li>
            )}
            {firms[1].allows_scalping && !firms[0].allows_scalping && <li>• You're a scalper</li>}
            {firms[1].allows_news_trading && !firms[0].allows_news_trading && <li>• You trade news events</li>}
            {firms[1].allows_ea && !firms[0].allows_ea && <li>• You use automated trading</li>}
            {firms[1].has_instant_funding && !firms[0].has_instant_funding && <li>• You want instant funding option</li>}
          </ul>
        </div>
      </div>
    </>
  )
}

// Multi Firm Verdict (3-4 firms)
function MultiFirmVerdict({ firms, scores, winnerIndex }: { firms: PropFirm[]; scores: number[]; winnerIndex: number }) {
  const winner = firms[winnerIndex]
  const sortedByScore = [...firms].map((f, i) => ({ firm: f, score: scores[i] })).sort((a, b) => b.score - a.score)

  return (
    <>
      <p className="text-gray-300 text-lg leading-relaxed mb-6">
        After comparing all {firms.length} firms, <span className="text-emerald-400 font-semibold">{winner.name}</span> comes 
        out on top with a score of {scores[winnerIndex]}/100. Here's the full ranking:
      </p>

      <div className="grid gap-3">
        {sortedByScore.map(({ firm, score }, index) => (
          <div 
            key={firm.id}
            className={`flex items-center justify-between p-4 rounded-xl ${
              index === 0 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-gray-900/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-emerald-500 text-white' : 
                index === 1 ? 'bg-gray-600 text-white' : 
                'bg-gray-700 text-gray-400'
              }`}>
                {index + 1}
              </span>
              <span className={`font-semibold ${index === 0 ? 'text-emerald-400' : 'text-white'}`}>
                {firm.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm hidden sm:block">
                ${firm.min_price} • {firm.max_profit_split || firm.profit_split}% split
              </span>
              <span className={`font-bold ${index === 0 ? 'text-emerald-400' : 'text-white'}`}>
                {score}/100
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
