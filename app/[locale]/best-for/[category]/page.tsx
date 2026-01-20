import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowRight, DollarSign, ExternalLink, Check, Filter } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Props {
  params: { category: string }
}

// Category configurations
const categories: Record<string, {
  title: string
  description: string
  filter: (firm: any) => boolean
  keywords: string[]
}> = {
  'scalping': {
    title: 'Best Prop Firms for Scalping',
    description: 'Top prop trading firms that allow scalping strategies. Compare firms with no time restrictions on trades and scalper-friendly rules.',
    filter: (firm) => firm.allows_scalping === true,
    keywords: ['scalping prop firm', 'prop firm for scalpers', 'scalp trading funded account', 'best scalping prop firm'],
  },
  'news-trading': {
    title: 'Best Prop Firms for News Trading',
    description: 'Prop firms that allow trading during high-impact news events. Find firms with no news trading restrictions.',
    filter: (firm) => firm.allows_news_trading === true,
    keywords: ['news trading prop firm', 'prop firm news events', 'forex news trading funded'],
  },
  'beginners': {
    title: 'Best Prop Firms for Beginners',
    description: 'Beginner-friendly prop trading firms with relaxed rules, educational resources, and supportive communities.',
    filter: (firm) => firm.min_price && firm.min_price <= 100,
    keywords: ['prop firm for beginners', 'easy prop firm challenge', 'beginner funded trading'],
  },
  'swing-trading': {
    title: 'Best Prop Firms for Swing Trading',
    description: 'Prop firms ideal for swing traders. No time limits, weekend holding allowed, and flexible trading rules.',
    filter: (firm) => firm.allows_weekend_holding === true,
    keywords: ['swing trading prop firm', 'weekend holding prop firm', 'position trading funded'],
  },
  'ea-trading': {
    title: 'Best Prop Firms for EA & Algo Trading',
    description: 'Prop firms that allow Expert Advisors (EAs) and algorithmic trading strategies.',
    filter: (firm) => firm.allows_ea === true,
    keywords: ['EA prop firm', 'algo trading prop firm', 'automated trading funded account'],
  },
  'high-profit-split': {
    title: 'Prop Firms with Highest Profit Split',
    description: 'Prop trading firms offering the highest profit splits (80%+). Keep more of your trading profits.',
    filter: (firm) => firm.profit_split && firm.profit_split >= 80,
    keywords: ['highest profit split prop firm', '90% profit split', 'best payout prop firm'],
  },
  'cheapest': {
    title: 'Cheapest Prop Firms in 2025',
    description: 'Most affordable prop trading firms. Start your funded trading journey with minimal investment.',
    filter: (firm) => firm.min_price && firm.min_price <= 50,
    keywords: ['cheapest prop firm', 'affordable prop firm', 'low cost funded account', 'cheap trading challenge'],
  },
  'instant-funding': {
    title: 'Instant Funding Prop Firms',
    description: 'Skip the challenge! Prop firms offering instant funding or one-step evaluation programs.',
    filter: (firm) => firm.challenge_types?.some((t: string) => t.toLowerCase().includes('instant') || t.toLowerCase().includes('1-step')),
    keywords: ['instant funding prop firm', 'no challenge prop firm', 'direct funding'],
  },
  'forex': {
    title: 'Best Forex Prop Firms',
    description: 'Top prop trading firms specializing in forex trading. Compare spreads, pairs, and trading conditions.',
    filter: (firm) => firm.instruments?.includes('Forex'),
    keywords: ['forex prop firm', 'best forex funded account', 'fx prop trading'],
  },
  'futures': {
    title: 'Best Futures Prop Firms',
    description: 'Top prop firms for futures trading. Trade indices, commodities, and more with funded capital.',
    filter: (firm) => firm.instruments?.includes('Futures') || firm.instruments?.includes('Indices'),
    keywords: ['futures prop firm', 'funded futures trading', 'index trading prop firm'],
  },
  'crypto': {
    title: 'Best Crypto Prop Firms',
    description: 'Prop trading firms offering cryptocurrency trading. Trade Bitcoin, Ethereum, and other cryptos.',
    filter: (firm) => firm.instruments?.includes('Crypto'),
    keywords: ['crypto prop firm', 'bitcoin funded trading', 'cryptocurrency prop firm'],
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories[params.category]
  if (!category) return { title: 'Category Not Found' }

  return {
    title: category.title,
    description: category.description,
    keywords: category.keywords,
    openGraph: {
      title: `${category.title} | PropFirm Scanner`,
      description: category.description,
      url: `https://www.propfirmscanner.org/best-for/${params.category}`,
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/best-for/${params.category}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(categories).map((category) => ({
    category,
  }))
}

export default async function CategoryPage({ params }: Props) {
  const category = categories[params.category]
  if (!category) notFound()

  const { data: allFirms } = await supabase
    .from('prop_firms')
    .select('*')
    .order('trustpilot_rating', { ascending: false })

  const firms = allFirms?.filter(category.filter) || []

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.title,
    description: category.description,
    numberOfItems: firms.length,
    itemListElement: firms.slice(0, 10).map((firm, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialService',
        name: firm.name,
        url: `https://www.propfirmscanner.org/prop-firm/${firm.slug}`,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      
      <div className="min-h-screen bg-gray-900 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/compare" className="hover:text-white">Compare</Link>
            <span>/</span>
            <span className="text-white">{category.title}</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Filter className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{category.title}</h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl">
              {category.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400">
              <span className="font-semibold">{firms.length}</span> firms match this criteria
            </div>
          </div>

          {/* Firms Grid */}
          {firms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {firms.map((firm, index) => (
                <div 
                  key={firm.id} 
                  className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
                >
                  {index < 3 && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full mb-4">
                      #{index + 1} Top Pick
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                      {firm.logo_url ? (
                        <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xl font-bold text-emerald-500">{firm.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{firm.name}</h2>
                      {firm.trustpilot_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-sm">{firm.trustpilot_rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">From</span>
                      <span className="text-white font-medium">${firm.min_price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Profit Split</span>
                      <span className="text-emerald-400 font-medium">{firm.profit_split}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Platforms</span>
                      <span className="text-white text-xs">{firm.platforms?.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/prop-firm/${firm.slug}`}
                      className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg text-center transition-all"
                    >
                      Details
                    </Link>
                    <a
                      href={firm.affiliate_url || firm.website_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg text-center transition-all flex items-center justify-center gap-1"
                    >
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No firms found for this category.</p>
            </div>
          )}

          {/* Other Categories */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Browse Other Categories</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(categories)
                .filter(([key]) => key !== params.category)
                .map(([key, cat]) => (
                  <Link
                    key={key}
                    href={`/best-for/${key}`}
                    className="px-4 py-2 bg-gray-700 hover:bg-emerald-500/20 hover:text-emerald-400 text-white rounded-lg transition-all text-sm"
                  >
                    {cat.title.replace('Best Prop Firms for ', '').replace(' Prop Firms', '')}
                  </Link>
                ))
              }
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              Compare All 55+ Prop Firms
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
