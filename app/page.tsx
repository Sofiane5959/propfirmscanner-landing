import Link from 'next/link'
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { 
  Search, TrendingUp, Shield, DollarSign, Star, ArrowRight, 
  CheckCircle, Users, Award, Zap, Target, BarChart3,
  ChevronRight, ExternalLink, Gift, BookOpen, Calculator
} from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const metadata: Metadata = {
  title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms | Find Your Perfect Match',
  description: 'Compare prop trading firms side-by-side. Find the best profit split, lowest fees, and rules that match your trading style. Trusted by 10,000+ traders.',
  keywords: ['prop firm', 'prop trading', 'funded trader', 'FTMO', 'trading challenge', 'best prop firm'],
  openGraph: {
    title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms',
    description: 'Find your perfect prop firm match. Compare fees, profit splits, and rules.',
    url: 'https://www.propfirmscanner.org',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org',
  },
}

export const revalidate = 3600

export default async function HomePage() {
  // Fetch top firms for showcase
  const { data: topFirms } = await supabase
    .from('prop_firms')
    .select('*')
    .order('trustpilot_rating', { ascending: false })
    .limit(6)

  // Fetch total count
  const { count: totalFirms } = await supabase
    .from('prop_firms')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Prop Firms', value: `${totalFirms || 55}+`, icon: Building },
    { label: 'Traders Trust Us', value: '10K+', icon: Users },
    { label: 'Comparison Points', value: '25+', icon: BarChart3 },
    { label: 'Updated Daily', value: '24/7', icon: Zap },
  ]

  const features = [
    {
      icon: Search,
      title: 'Smart Filters',
      description: 'Filter by trading style, budget, profit split, and 20+ criteria',
    },
    {
      icon: Shield,
      title: 'Verified Data',
      description: 'All data verified directly from prop firm websites',
    },
    {
      icon: TrendingUp,
      title: 'Real Reviews',
      description: 'Trustpilot ratings and real trader experiences',
    },
    {
      icon: DollarSign,
      title: 'Exclusive Deals',
      description: 'Save up to 25% with our exclusive discount codes',
    },
  ]

  const popularCategories = [
    { name: 'Best for Scalping', href: '/best-for/scalping', icon: '⚡' },
    { name: 'Best for Beginners', href: '/best-for/beginners', icon: '🎯' },
    { name: 'Cheapest Options', href: '/best-for/cheapest', icon: '💰' },
    { name: 'Highest Profit Split', href: '/best-for/high-profit-split', icon: '📈' },
    { name: 'Instant Funding', href: '/best-for/instant-funding', icon: '🚀' },
    { name: 'EA/Bot Friendly', href: '/best-for/ea-trading', icon: '🤖' },
  ]

  const popularVS = [
    { name: 'FTMO vs Funded Next', href: '/compare/ftmo-vs-fundednext' },
    { name: 'FTMO vs The5ers', href: '/compare/ftmo-vs-the5ers' },
    { name: 'FTMO vs MyFundedFX', href: '/compare/ftmo-vs-myfundedfx' },
    { name: 'Funded Next vs The5ers', href: '/compare/fundednext-vs-the5ers' },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-gray-900 to-blue-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-3xl opacity-20" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Updated December 2025</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> Prop Firm </span>
              in Seconds
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Compare {totalFirms || 55}+ prop trading firms side-by-side. Filter by rules, fees, and profit split to find the one that matches YOUR trading style.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/compare"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-lg shadow-lg shadow-emerald-500/25"
              >
                Compare All Firms
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all text-lg border border-gray-700"
              >
                <Gift className="w-5 h-5 text-yellow-400" />
                View Deals & Discounts
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Updated Daily</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-gray-800/50 border-y border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Firms */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                🏆 Top Rated Prop Firms
              </h2>
              <p className="text-gray-400">Based on Trustpilot ratings and trader reviews</p>
            </div>
            <Link
              href="/compare"
              className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topFirms?.slice(0, 6).map((firm, index) => (
              <Link
                key={firm.id}
                href={`/prop-firm/${firm.slug}`}
                className="group bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {index < 3 && (
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        'bg-amber-600 text-white'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1">
                      {firm.logo_url ? (
                        <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xl font-bold text-emerald-600">{firm.name?.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  {firm.trustpilot_rating && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{firm.trustpilot_rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {firm.name}
                </h3>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">From</p>
                    <p className="text-lg font-bold text-white">${firm.min_price || '99'}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 mb-1">Profit Split</p>
                    <p className="text-lg font-bold text-emerald-400">{firm.profit_split || '80'}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {firm.allows_scalping && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Scalping</span>
                  )}
                  {firm.allows_news_trading && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">News</span>
                  )}
                  {firm.allows_ea && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">EA</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              View All {totalFirms}+ Firms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Find Firms by Trading Style
            </h2>
            <p className="text-gray-400">Quick access to firms that match your specific needs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-emerald-500/50 rounded-xl p-4 text-center transition-all"
              >
                <span className="text-3xl mb-2 block">{cat.icon}</span>
                <span className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              🆚 Popular Comparisons
            </h2>
            <p className="text-gray-400">See how top firms stack up against each other</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularVS.map((vs) => (
              <Link
                key={vs.href}
                href={vs.href}
                className="group bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700 hover:border-emerald-500/50 rounded-xl p-5 text-center transition-all"
              >
                <p className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                  {vs.name}
                </p>
                <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
                  Compare now <ArrowRight className="w-3 h-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Why Traders Choose Us
            </h2>
            <p className="text-gray-400">Everything you need to make the right decision</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              🛠️ Free Trading Tools
            </h2>
            <p className="text-gray-400">Help yourself pass your challenge</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/tools/risk-calculator"
              className="group bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-8 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Calculator className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    Risk Calculator
                  </h3>
                  <p className="text-gray-400">
                    Calculate your position size based on account balance, risk percentage, and stop loss distance.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/tools/rule-tracker"
              className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-8 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Target className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Rule Tracker
                  </h3>
                  <p className="text-gray-400">
                    Track your daily drawdown, max drawdown, and profit target in real-time.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                📚 Latest from the Blog
              </h2>
              <p className="text-gray-400">Tips and strategies to help you get funded</p>
            </div>
            <Link
              href="/blog"
              className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'How to Choose the Right Prop Firm',
                slug: 'how-to-choose-right-prop-firm',
                category: 'Guide',
              },
              {
                title: 'News Trading Rules Explained',
                slug: 'news-trading-rules-explained',
                category: 'Rules',
              },
              {
                title: 'How to Pass Your Prop Firm Challenge',
                slug: 'how-to-pass-prop-firm-challenge',
                category: 'Guide',
              },
            ].map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-800/50 border border-gray-700 hover:border-emerald-500/30 rounded-xl p-6 transition-all"
              >
                <span className="text-xs text-emerald-400 font-medium">{post.category}</span>
                <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mt-3 flex items-center gap-1">
                  Read more <ArrowRight className="w-3 h-3" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Funded?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Stop guessing. Compare all prop firms in one place and find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-lg"
            >
              Start Comparing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all text-lg border border-gray-700"
            >
              <BookOpen className="w-5 h-5" />
              Download Free Guide
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

// Building icon component
function Building(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  )
}
