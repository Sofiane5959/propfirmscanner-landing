import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, CheckCircle, XCircle, Trophy, ArrowRight, DollarSign, ExternalLink, ChevronLeft } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 15 Popular VS comparisons for static generation
const popularComparisons = [
  // FTMO comparisons (most searched)
  { firm1: 'ftmo', firm2: 'fundednext' },
  { firm1: 'ftmo', firm2: 'the5ers' },
  { firm1: 'ftmo', firm2: 'myfundedfx' },
  { firm1: 'ftmo', firm2: 'e8-funding' },
  { firm1: 'ftmo', firm2: 'alpha-capital-group' },
  { firm1: 'ftmo', firm2: 'funded-trading-plus' },
  { firm1: 'ftmo', firm2: 'fxify' },
  { firm1: 'ftmo', firm2: 'topstep' },
  { firm1: 'ftmo', firm2: 'goat-funded-trader' },
  // Funded Next comparisons
  { firm1: 'fundednext', firm2: 'the5ers' },
  { firm1: 'fundednext', firm2: 'myfundedfx' },
  { firm1: 'fundednext', firm2: 'e8-funding' },
  { firm1: 'fundednext', firm2: 'funded-trading-plus' },
  // The5ers comparisons
  { firm1: 'the5ers', firm2: 'myfundedfx' },
  { firm1: 'the5ers', firm2: 'e8-funding' },
]

interface Props {
  params: { slug: string }
}

function parseSlug(slug: string): { firm1Slug: string; firm2Slug: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)$/)
  if (!match) return null
  return { firm1Slug: match[1], firm2Slug: match[2] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseSlug(params.slug)
  if (!parsed) return { title: 'Comparison Not Found' }

  const { data: firms } = await supabase
    .from('prop_firms')
    .select('name, slug')
    .in('slug', [parsed.firm1Slug, parsed.firm2Slug])

  if (!firms || firms.length !== 2) return { title: 'Comparison Not Found' }

  const firm1 = firms.find(f => f.slug === parsed.firm1Slug)
  const firm2 = firms.find(f => f.slug === parsed.firm2Slug)

  const title = `${firm1?.name} vs ${firm2?.name} (2025) - Which is Better?`
  const description = `Compare ${firm1?.name} vs ${firm2?.name}: pricing, profit split, rules, and more. Find out which prop firm is best for your trading style.`

  return {
    title,
    description,
    keywords: [
      `${firm1?.name} vs ${firm2?.name}`,
      `${firm1?.name} or ${firm2?.name}`,
      `${firm1?.name} comparison`,
      `${firm2?.name} comparison`,
      'prop firm comparison',
      'best prop firm 2025',
    ],
    openGraph: {
      title,
      description,
      url: `https://www.propfirmscanner.org/compare/${params.slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/compare/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return popularComparisons.map(({ firm1, firm2 }) => ({
    slug: `${firm1}-vs-${firm2}`,
  }))
}

export default async function VSPage({ params }: Props) {
  const parsed = parseSlug(params.slug)
  if (!parsed) notFound()

  const { data: firms } = await supabase
    .from('prop_firms')
    .select('*')
    .in('slug', [parsed.firm1Slug, parsed.firm2Slug])

  if (!firms || firms.length !== 2) notFound()

  const firm1 = firms.find(f => f.slug === parsed.firm1Slug)!
  const firm2 = firms.find(f => f.slug === parsed.firm2Slug)!

  // Calculate winner for each category
  const comparisons = [
    {
      label: 'Trustpilot Rating',
      firm1Value: firm1.trustpilot_rating ? `${firm1.trustpilot_rating}/5` : 'N/A',
      firm2Value: firm2.trustpilot_rating ? `${firm2.trustpilot_rating}/5` : 'N/A',
      winner: (firm1.trustpilot_rating || 0) > (firm2.trustpilot_rating || 0) ? 1 : (firm1.trustpilot_rating || 0) < (firm2.trustpilot_rating || 0) ? 2 : 0,
    },
    {
      label: 'Starting Price',
      firm1Value: firm1.min_price ? `$${firm1.min_price}` : 'N/A',
      firm2Value: firm2.min_price ? `$${firm2.min_price}` : 'N/A',
      winner: (firm1.min_price || 999) < (firm2.min_price || 999) ? 1 : (firm1.min_price || 999) > (firm2.min_price || 999) ? 2 : 0,
    },
    {
      label: 'Profit Split',
      firm1Value: firm1.profit_split ? `${firm1.profit_split}%` : 'N/A',
      firm2Value: firm2.profit_split ? `${firm2.profit_split}%` : 'N/A',
      winner: (firm1.profit_split || 0) > (firm2.profit_split || 0) ? 1 : (firm1.profit_split || 0) < (firm2.profit_split || 0) ? 2 : 0,
    },
    {
      label: 'Max Account Size',
      firm1Value: firm1.account_sizes?.length ? `$${Math.max(...firm1.account_sizes).toLocaleString()}` : 'N/A',
      firm2Value: firm2.account_sizes?.length ? `$${Math.max(...firm2.account_sizes).toLocaleString()}` : 'N/A',
      winner: (Math.max(...(firm1.account_sizes || [0]))) > (Math.max(...(firm2.account_sizes || [0]))) ? 1 : (Math.max(...(firm1.account_sizes || [0]))) < (Math.max(...(firm2.account_sizes || [0]))) ? 2 : 0,
    },
    {
      label: 'Daily Drawdown',
      firm1Value: firm1.max_daily_drawdown ? `${firm1.max_daily_drawdown}%` : 'N/A',
      firm2Value: firm2.max_daily_drawdown ? `${firm2.max_daily_drawdown}%` : 'N/A',
      winner: (firm1.max_daily_drawdown || 0) > (firm2.max_daily_drawdown || 0) ? 1 : (firm1.max_daily_drawdown || 0) < (firm2.max_daily_drawdown || 0) ? 2 : 0,
    },
    {
      label: 'Max Drawdown',
      firm1Value: firm1.max_total_drawdown ? `${firm1.max_total_drawdown}%` : 'N/A',
      firm2Value: firm2.max_total_drawdown ? `${firm2.max_total_drawdown}%` : 'N/A',
      winner: (firm1.max_total_drawdown || 0) > (firm2.max_total_drawdown || 0) ? 1 : (firm1.max_total_drawdown || 0) < (firm2.max_total_drawdown || 0) ? 2 : 0,
    },
    {
      label: 'Profit Target (Phase 1)',
      firm1Value: firm1.profit_target_phase1 ? `${firm1.profit_target_phase1}%` : 'N/A',
      firm2Value: firm2.profit_target_phase1 ? `${firm2.profit_target_phase1}%` : 'N/A',
      winner: (firm1.profit_target_phase1 || 99) < (firm2.profit_target_phase1 || 99) ? 1 : (firm1.profit_target_phase1 || 99) > (firm2.profit_target_phase1 || 99) ? 2 : 0,
    },
  ]

  const rules = [
    { label: 'Scalping Allowed', firm1: firm1.allows_scalping, firm2: firm2.allows_scalping },
    { label: 'News Trading', firm1: firm1.allows_news_trading, firm2: firm2.allows_news_trading },
    { label: 'Weekend Holding', firm1: firm1.allows_weekend_holding, firm2: firm2.allows_weekend_holding },
    { label: 'EA / Bots', firm1: firm1.allows_ea, firm2: firm2.allows_ea },
    { label: 'Hedging', firm1: firm1.allows_hedging, firm2: firm2.allows_hedging },
    { label: 'Free Retry', firm1: firm1.has_free_repeat, firm2: firm2.has_free_repeat },
  ]

  // Calculate overall winner
  const firm1Wins = comparisons.filter(c => c.winner === 1).length
  const firm2Wins = comparisons.filter(c => c.winner === 2).length
  const overallWinner = firm1Wins > firm2Wins ? firm1 : firm2Wins > firm1Wins ? firm2 : null

  // Generate verdict
  const getVerdict = () => {
    if (!overallWinner) {
      return `Both ${firm1.name} and ${firm2.name} are excellent choices. Your decision should be based on your specific trading style and priorities.`
    }
    const loser = overallWinner.id === firm1.id ? firm2 : firm1
    
    if ((overallWinner.trustpilot_rating || 0) > (loser.trustpilot_rating || 0) && (overallWinner.profit_split || 0) >= (loser.profit_split || 0)) {
      return `${overallWinner.name} is the clear winner with better ratings and profit split. However, ${loser.name} might still be better if you prioritize ${(loser.min_price || 999) < (overallWinner.min_price || 999) ? 'lower entry cost' : 'specific features'}.`
    }
    return `${overallWinner.name} edges out ${loser.name} in most categories. Consider ${loser.name} if ${(loser.profit_split || 0) > (overallWinner.profit_split || 0) ? 'profit split' : (loser.min_price || 999) < (overallWinner.min_price || 999) ? 'budget' : 'specific rules'} is your priority.`
  }

  // Schema JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${firm1.name} vs ${firm2.name}: Which Prop Firm is Better in 2025?`,
    description: `Detailed comparison of ${firm1.name} and ${firm2.name} prop trading firms.`,
    author: { '@type': 'Organization', name: 'PropFirm Scanner' },
    publisher: { '@type': 'Organization', name: 'PropFirm Scanner' },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      
      <div className="min-h-screen bg-gray-900 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/compare" className="hover:text-white flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back to Compare
            </Link>
            <span>/</span>
            <span className="text-white">{firm1.name} vs {firm2.name}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {firm1.name} <span className="text-emerald-400">vs</span> {firm2.name}
            </h1>
            <p className="text-xl text-gray-400">
              Which prop firm is better for you in 2025?
            </p>
          </div>

          {/* Quick Winner Banner */}
          {overallWinner && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Overall Winner</span>
              </div>
              <p className="text-2xl font-bold text-white">{overallWinner.name}</p>
              <p className="text-gray-400 text-sm mt-1">Wins {Math.max(firm1Wins, firm2Wins)} out of {comparisons.length} categories</p>
            </div>
          )}

          {/* Head to Head Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <FirmCard firm={firm1} isWinner={overallWinner?.id === firm1.id} />
            <FirmCard firm={firm2} isWinner={overallWinner?.id === firm2.id} />
          </div>

          {/* Comparison Table */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">📊 Side-by-Side Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">Feature</th>
                    <th className="px-6 py-4 text-center text-white font-medium">{firm1.name}</th>
                    <th className="px-6 py-4 text-center text-white font-medium">{firm2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-gray-800/30' : ''}>
                      <td className="px-6 py-4 text-gray-300">{row.label}</td>
                      <td className={`px-6 py-4 text-center font-semibold ${row.winner === 1 ? 'text-emerald-400' : 'text-white'}`}>
                        {row.winner === 1 && <span className="mr-1">✓</span>}
                        {row.firm1Value}
                      </td>
                      <td className={`px-6 py-4 text-center font-semibold ${row.winner === 2 ? 'text-emerald-400' : 'text-white'}`}>
                        {row.winner === 2 && <span className="mr-1">✓</span>}
                        {row.firm2Value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trading Rules Comparison */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">📋 Trading Rules</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">Rule</th>
                    <th className="px-6 py-4 text-center text-white font-medium">{firm1.name}</th>
                    <th className="px-6 py-4 text-center text-white font-medium">{firm2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, i) => (
                    <tr key={rule.label} className={i % 2 === 0 ? 'bg-gray-800/30' : ''}>
                      <td className="px-6 py-4 text-gray-300">{rule.label}</td>
                      <td className="px-6 py-4 text-center">
                        {rule.firm1 ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {rule.firm2 ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Verdict</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              {getVerdict()}
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Choose {firm1.name} if:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  {(firm1.profit_split || 0) >= (firm2.profit_split || 0) && <li>• You want higher profit split</li>}
                  {(firm1.min_price || 999) <= (firm2.min_price || 999) && <li>• You're on a budget</li>}
                  {(firm1.trustpilot_rating || 0) >= (firm2.trustpilot_rating || 0) && <li>• Reputation matters most</li>}
                  {firm1.allows_scalping && !firm2.allows_scalping && <li>• You're a scalper</li>}
                  {firm1.allows_news_trading && !firm2.allows_news_trading && <li>• You trade news events</li>}
                  {firm1.allows_ea && !firm2.allows_ea && <li>• You use EAs/bots</li>}
                </ul>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4">
                <h3 className="font-semibold text-white mb-2">Choose {firm2.name} if:</h3>
                <ul className="text-gray-400 text-sm space-y-1">
                  {(firm2.profit_split || 0) >= (firm1.profit_split || 0) && <li>• You want higher profit split</li>}
                  {(firm2.min_price || 999) <= (firm1.min_price || 999) && <li>• You're on a budget</li>}
                  {(firm2.trustpilot_rating || 0) >= (firm1.trustpilot_rating || 0) && <li>• Reputation matters most</li>}
                  {firm2.allows_scalping && !firm1.allows_scalping && <li>• You're a scalper</li>}
                  {firm2.allows_news_trading && !firm1.allows_news_trading && <li>• You trade news events</li>}
                  {firm2.allows_ea && !firm1.allows_ea && <li>• You use EAs/bots</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <a
              href={firm1.affiliate_url || firm1.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-6 text-center transition-all group"
            >
              <p className="text-gray-400 mb-2">Get Started with</p>
              <p className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{firm1.name}</p>
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                <DollarSign className="w-5 h-5" />
                Buy Challenge
                <ExternalLink className="w-4 h-4" />
              </span>
            </a>
            <a
              href={firm2.affiliate_url || firm2.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-2xl p-6 text-center transition-all group"
            >
              <p className="text-gray-400 mb-2">Get Started with</p>
              <p className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{firm2.name}</p>
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
                <DollarSign className="w-5 h-5" />
                Buy Challenge
                <ExternalLink className="w-4 h-4" />
              </span>
            </a>
          </div>

          {/* Other Comparisons */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🔗 Other Popular Comparisons</h2>
            <div className="flex flex-wrap gap-3">
              {popularComparisons
                .filter(c => !(c.firm1 === parsed.firm1Slug && c.firm2 === parsed.firm2Slug))
                .slice(0, 8)
                .map(({ firm1, firm2 }) => (
                  <Link
                    key={`${firm1}-${firm2}`}
                    href={`/compare/${firm1}-vs-${firm2}`}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    {firm1.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} vs {firm2.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Link>
                ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

// Firm Card Component
function FirmCard({ firm, isWinner }: { firm: any; isWinner: boolean }) {
  return (
    <div className={`relative bg-gray-800/50 border rounded-2xl p-6 ${isWinner ? 'border-yellow-500/50' : 'border-gray-700'}`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
          <Trophy className="w-3 h-3" /> WINNER
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
          {firm.logo_url ? (
            <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-2xl font-bold text-emerald-600">{firm.name?.charAt(0)}</span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{firm.name}</h2>
          {firm.trustpilot_rating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold">{firm.trustpilot_rating}</span>
              <span className="text-gray-400 text-sm">/ 5</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">From</p>
          <p className="text-xl font-bold text-white">${firm.min_price || '99'}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
          <p className="text-gray-400 text-xs mb-1">Profit Split</p>
          <p className="text-xl font-bold text-emerald-400">{firm.profit_split || '80'}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {firm.allows_scalping && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Scalping</span>}
        {firm.allows_news_trading && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">News</span>}
        {firm.allows_ea && <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">EA</span>}
        {firm.allows_weekend_holding && <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Weekend</span>}
      </div>

      <div className="flex gap-2">
        <a
          href={firm.affiliate_url || firm.website_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors text-sm"
        >
          Buy Challenge
        </a>
        <Link
          href={`/prop-firm/${firm.slug}`}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm"
        >
          Details
        </Link>
      </div>
    </div>
  )
}
