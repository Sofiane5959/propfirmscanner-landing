import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, Check, X, ArrowRight, DollarSign, ExternalLink } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Props {
  params: { slug: string }
}

// Parse slug like "ftmo-vs-the5ers" to get both firm names
function parseSlug(slug: string): { firm1: string; firm2: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)$/)
  if (!match) return null
  return { firm1: match[1], firm2: match[2] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseSlug(params.slug)
  if (!parsed) return { title: 'Comparison Not Found' }

  const { data: firms } = await supabase
    .from('prop_firms')
    .select('name, slug')
    .in('slug', [parsed.firm1, parsed.firm2])

  if (!firms || firms.length !== 2) {
    return { title: 'Comparison Not Found' }
  }

  const firm1Name = firms.find(f => f.slug === parsed.firm1)?.name || parsed.firm1
  const firm2Name = firms.find(f => f.slug === parsed.firm2)?.name || parsed.firm2

  const title = `${firm1Name} vs ${firm2Name} - Which Prop Firm is Better in 2025?`
  const description = `Compare ${firm1Name} vs ${firm2Name}: pricing, profit splits, trading rules, platforms, and more. Find out which prop firm is right for you.`

  return {
    title,
    description,
    keywords: [
      `${firm1Name} vs ${firm2Name}`,
      `${firm2Name} vs ${firm1Name}`,
      `${firm1Name} comparison`,
      `${firm2Name} comparison`,
      'prop firm comparison',
      'best prop firm',
    ],
    openGraph: {
      title,
      description,
      url: `https://www.propfirmscanner.org/compare/${params.slug}`,
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/compare/${params.slug}`,
    },
  }
}

export default async function ComparisonPage({ params }: Props) {
  const parsed = parseSlug(params.slug)
  if (!parsed) notFound()

  const { data: firms } = await supabase
    .from('prop_firms')
    .select('*')
    .in('slug', [parsed.firm1, parsed.firm2])

  if (!firms || firms.length !== 2) notFound()

  const firm1 = firms.find(f => f.slug === parsed.firm1)!
  const firm2 = firms.find(f => f.slug === parsed.firm2)!

  const comparisonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${firm1.name} vs ${firm2.name} Comparison`,
    description: `Detailed comparison between ${firm1.name} and ${firm2.name} prop trading firms.`,
    author: { '@type': 'Organization', name: 'PropFirm Scanner' },
    publisher: { '@type': 'Organization', name: 'PropFirm Scanner' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      
      <div className="min-h-screen bg-gray-900 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/compare" className="hover:text-white">Compare</Link>
            <span>/</span>
            <span className="text-white">{firm1.name} vs {firm2.name}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {firm1.name} <span className="text-emerald-400">vs</span> {firm2.name}
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Complete comparison to help you choose the right prop firm for your trading style.
            </p>
          </div>

          {/* Quick Stats Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[firm1, firm2].map((firm) => (
              <div key={firm.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                    {firm.logo_url ? (
                      <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl font-bold text-emerald-500">{firm.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{firm.name}</h2>
                    {firm.trustpilot_rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">{firm.trustpilot_rating}</span>
                        <span className="text-gray-400 text-sm">Trustpilot</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Starting Price</span>
                    <span className="text-white font-semibold">${firm.min_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profit Split</span>
                    <span className="text-emerald-400 font-semibold">{firm.profit_split}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Drawdown</span>
                    <span className="text-red-400 font-semibold">{firm.max_total_drawdown}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platforms</span>
                    <span className="text-white">{firm.platforms?.join(', ') || 'N/A'}</span>
                  </div>
                </div>

                <a
                  href={firm.affiliate_url || firm.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  Visit {firm.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Detailed Comparison</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-400 font-medium">Feature</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">{firm1.name}</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">{firm2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <ComparisonRow label="Starting Price" value1={`$${firm1.min_price}`} value2={`$${firm2.min_price}`} />
                  <ComparisonRow label="Profit Split" value1={`${firm1.profit_split}%`} value2={`${firm2.profit_split}%`} highlight />
                  <ComparisonRow label="Max Drawdown" value1={`${firm1.max_total_drawdown}%`} value2={`${firm2.max_total_drawdown}%`} />
                  <ComparisonRow label="Daily Drawdown" value1={`${firm1.max_daily_drawdown}%`} value2={`${firm2.max_daily_drawdown}%`} />
                  <ComparisonRow label="Trustpilot Rating" value1={firm1.trustpilot_rating?.toString() || 'N/A'} value2={firm2.trustpilot_rating?.toString() || 'N/A'} />
                  <ComparisonRow label="Scalping Allowed" value1={firm1.allows_scalping} value2={firm2.allows_scalping} boolean />
                  <ComparisonRow label="News Trading" value1={firm1.allows_news_trading} value2={firm2.allows_news_trading} boolean />
                  <ComparisonRow label="EAs Allowed" value1={firm1.allows_ea} value2={firm2.allows_ea} boolean />
                  <ComparisonRow label="Weekend Holding" value1={firm1.allows_weekend_holding} value2={firm2.allows_weekend_holding} boolean />
                  <ComparisonRow label="Headquarters" value1={firm1.headquarters || 'N/A'} value2={firm2.headquarters || 'N/A'} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Our Verdict</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Both {firm1.name} and {firm2.name} are excellent prop firms. 
              {firm1.profit_split > firm2.profit_split 
                ? ` ${firm1.name} offers a higher profit split (${firm1.profit_split}% vs ${firm2.profit_split}%).`
                : firm2.profit_split > firm1.profit_split
                  ? ` ${firm2.name} offers a higher profit split (${firm2.profit_split}% vs ${firm1.profit_split}%).`
                  : ' They offer the same profit split.'
              }
              {' '}Choose based on your trading style and preferences.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              Compare All 55+ Firms
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function ComparisonRow({ 
  label, 
  value1, 
  value2, 
  boolean = false,
  highlight = false 
}: { 
  label: string
  value1: any
  value2: any
  boolean?: boolean
  highlight?: boolean
}) {
  const renderValue = (value: any) => {
    if (boolean) {
      return value ? (
        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-400 mx-auto" />
      )
    }
    return <span className={highlight ? 'text-emerald-400 font-semibold' : 'text-white'}>{value}</span>
  }

  return (
    <tr>
      <td className="px-6 py-4 text-gray-400">{label}</td>
      <td className="px-6 py-4 text-center">{renderValue(value1)}</td>
      <td className="px-6 py-4 text-center">{renderValue(value2)}</td>
    </tr>
  )
}
