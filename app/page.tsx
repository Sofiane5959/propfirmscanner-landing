import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Users, 
  Star,
  Gift,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Play,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'PropFirmScanner | Compare Verified Prop Firms & Track Your Challenge',
  description: 'Compare verified prop trading firms side-by-side. Track your challenge with our free dashboard. Never blow your account again. Updated daily.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org',
  },
}

// =============================================================================
// TOP RATED PROP FIRMS - Classement officiel avec codes promo
// =============================================================================

const TOP_FIRMS = [
  {
    rank: 1,
    name: 'Top One Futures',
    slug: 'top-one-futures',
    rating: 4.8,
    reviews: '2.7K+',
    logo: 'T',
    color: 'from-amber-500 to-orange-600',
    startingPrice: '$34',
    profitSplit: '90%',
    promo: { code: 'pfs', discount: '55% OFF' },
    tags: ['Futures', 'Fast Payouts'],
    affiliate: 'https://toponefutures.com/?ref=propfirmscanner',
  },
  {
    rank: 2,
    name: 'Earn2Trade',
    slug: 'earn2trade',
    rating: 4.7,
    reviews: '4.3K+',
    logo: 'E',
    color: 'from-blue-500 to-cyan-500',
    startingPrice: '$150',
    profitSplit: '80%',
    promo: { code: 'scanner-40', discount: '50% OFF' },
    tags: ['Futures', 'Education'],
    affiliate: 'https://earn2trade.com/?ref=propfirmscanner',
  },
  {
    rank: 3,
    name: 'The5ers',
    slug: 'the5ers',
    rating: 4.8,
    reviews: '19K+',
    logo: '5',
    color: 'from-emerald-500 to-teal-500',
    startingPrice: '$95',
    profitSplit: '100%',
    promo: { code: null, discount: '5% OFF' },
    tags: ['Forex', 'Scaling'],
    affiliate: 'https://the5ers.com/?ref=propfirmscanner',
  },
  {
    rank: 4,
    name: 'ForFX',
    slug: 'forfx',
    rating: 4.2,
    reviews: '114',
    logo: 'F',
    color: 'from-violet-500 to-purple-600',
    startingPrice: '$99',
    profitSplit: '80%',
    promo: { code: 'scanner', discount: '10% OFF' },
    tags: ['Forex', 'New'],
    affiliate: 'https://forfx.com/?ref=propfirmscanner',
  },
  {
    rank: 5,
    name: 'FTMO',
    slug: 'ftmo',
    rating: 4.8,
    reviews: '34K+',
    logo: 'F',
    color: 'from-indigo-500 to-blue-600',
    startingPrice: '$155',
    profitSplit: '90%',
    promo: null,
    tags: ['Forex', 'Industry Leader'],
    affiliate: null,
  },
  {
    rank: 6,
    name: 'FundedNext',
    slug: 'fundednext',
    rating: 4.5,
    reviews: '53K+',
    logo: 'FN',
    color: 'from-sky-500 to-blue-500',
    startingPrice: '$32',
    profitSplit: '95%',
    promo: null,
    tags: ['Forex', 'Cheapest'],
    affiliate: null,
  },
]

// =============================================================================
// TRADING STYLES
// =============================================================================

const TRADING_STYLES = [
  { name: 'Scalping', icon: '⚡', href: '/best-for/scalping' },
  { name: 'Beginners', icon: '🎯', href: '/best-for/beginners' },
  { name: 'Cheapest', icon: '💰', href: '/best-for/cheapest' },
  { name: 'High Split', icon: '📈', href: '/best-for/highest-profit-split' },
  { name: 'Instant', icon: '🚀', href: '/best-for/instant-funding' },
  { name: 'EA/Bots', icon: '🤖', href: '/best-for/ea-friendly' },
]

// =============================================================================
// POPULAR COMPARISONS
// =============================================================================

const COMPARISONS = [
  { firms: 'FTMO vs FundedNext', slug: 'ftmo-vs-fundednext' },
  { firms: 'FTMO vs The5ers', slug: 'ftmo-vs-the5ers' },
  { firms: 'FTMO vs MyFundedFX', slug: 'ftmo-vs-myfundedfx' },
  { firms: 'FundedNext vs The5ers', slug: 'fundednext-vs-the5ers' },
]

// =============================================================================
// BLOG POSTS
// =============================================================================

const BLOG_POSTS = [
  {
    title: 'How to Choose the Right Prop Firm',
    category: 'Guide',
    slug: 'how-to-choose-right-prop-firm',
  },
  {
    title: 'News Trading Rules Explained',
    category: 'Rules',
    slug: 'news-trading-rules-explained',
  },
  {
    title: 'How to Pass Your Prop Firm Challenge',
    category: 'Guide',
    slug: 'how-to-pass-your-prop-firm-challenge',
  },
]

// =============================================================================
// HOMEPAGE COMPONENT
// =============================================================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Updated January 2026
            </span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white leading-tight mb-6">
            Compare Prop Firms.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Track Your Challenge.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mb-8">
            Compare verified prop trading firms side-by-side. Filter by rules, fees, and profit split. 
            Track your drawdown with our <span className="text-white font-medium">free dashboard</span>.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/compare"
              className="group flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
            >
              Compare All Firms
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all"
            >
              <Play className="w-4 h-4" />
              Track My Challenge FREE
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              100% Free
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              No Registration Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Updated Daily
            </span>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100%', label: 'Verified Firms' },
              { value: '10K+', label: 'Traders Trust Us' },
              { value: '4.5+', label: 'Avg. Trustpilot' },
              { value: 'Daily', label: 'Data Updates' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TOP RATED PROP FIRMS ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                Top Rated Prop Firms
              </h2>
              <p className="text-gray-500 mt-1">Verified firms based on Trustpilot ratings</p>
            </div>
            <Link 
              href="/compare" 
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Banner */}
          <div className="flex items-center gap-4 mb-8 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
            <Shield className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-gray-400">
              <span className="text-emerald-400 font-medium">All firms verified</span> — We only list legitimate prop firms with proven payout history and positive trader reviews.
            </p>
          </div>

          {/* Firms Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_FIRMS.map((firm) => (
              <div
                key={firm.slug}
                className="group relative bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-black/20 flex flex-col"
              >
                {/* Promo Badge - Top Right */}
                {firm.promo && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <Gift className="w-3 h-3" />
                      {firm.promo.discount}
                    </span>
                  </div>
                )}

                {/* Rank Badge - Top Left */}
                <div className="absolute -top-2 -left-2 z-10">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shadow-lg ${
                    firm.rank === 1 ? 'bg-amber-500 text-white' :
                    firm.rank === 2 ? 'bg-gray-400 text-white' :
                    firm.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    #{firm.rank}
                  </span>
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-4 mt-2">
                  {/* Logo */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${firm.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {firm.logo}
                  </div>
                  
                  {/* Name & Rating */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors text-lg">
                      {firm.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 font-semibold text-sm">{firm.rating}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{firm.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="flex items-center gap-1.5 mb-4">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">Verified & Legit</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-500">From</div>
                    <div className="text-white font-semibold">{firm.startingPrice}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-gray-500">Profit Split</div>
                    <div className="text-emerald-400 font-semibold">{firm.profitSplit}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {firm.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Promo Code - if exists */}
                {firm.promo && firm.promo.code && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                    <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-amber-400 text-sm">
                      Code: <code className="font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">{firm.promo.code}</code>
                    </span>
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div className="flex-1" />

                {/* CTA - Always at bottom */}
                <Link
                  href={`/prop-firm/${firm.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl transition-colors mt-auto"
                >
                  View Details
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-6 md:hidden">
            <Link 
              href="/compare" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 text-white font-medium rounded-xl"
            >
              View All Verified Firms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TRACK YOUR CHALLENGE (Dashboard CTA) ========== */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <div className="relative grid lg:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
                  <Sparkles className="w-4 h-4" />
                  Free Dashboard
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Never Blow Your Account Again
                </h2>
                
                <p className="text-gray-400 text-lg mb-6">
                  Track your daily and max drawdown in real-time. Get warnings BEFORE you breach your prop firm rules. Simulate trades to check risk.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    'Real-time Daily & Max Drawdown tracking',
                    'Smart warnings before you breach rules',
                    'Trade simulator to check risk',
                    'Works with ANY prop firm',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-colors"
                  >
                    <Target className="w-5 h-5" />
                    Start Tracking FREE
                  </Link>
                  <span className="text-gray-500 text-sm self-center">
                    No signup required
                  </span>
                </div>
              </div>
              
              {/* Right: Dashboard Preview */}
              <div className="relative">
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-4 shadow-2xl">
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-500 text-xs ml-2">My Prop Firms Dashboard</span>
                  </div>
                  
                  {/* Mock Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="text-white font-bold">$100,000</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Today&apos;s P&L</div>
                      <div className="text-emerald-400 font-bold">+$1,250</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Risk Status</div>
                      <div className="text-emerald-400 font-bold">Safe</div>
                    </div>
                  </div>
                  
                  {/* Mock Drawdown Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Daily Drawdown</span>
                        <span className="text-emerald-400">$3,750 remaining</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Max Drawdown</span>
                        <span className="text-emerald-400">$8,750 remaining</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-cyan-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Alert */}
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-medium">All Clear! Trade confidently.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FIND BY TRADING STYLE ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Find Firms by Trading Style
            </h2>
            <p className="text-gray-500">Quick access to firms that match your specific needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRADING_STYLES.map((style) => (
              <Link
                key={style.name}
                href={style.href}
                className="group flex flex-col items-center gap-3 p-5 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl transition-all"
              >
                <span className="text-3xl">{style.icon}</span>
                <span className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
                  {style.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POPULAR COMPARISONS ========== */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">⚔️</span>
              Popular Comparisons
            </h2>
            <p className="text-gray-500">See how top firms stack up against each other</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPARISONS.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/30 rounded-xl transition-all"
              >
                <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                  {comparison.firms}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY TRADERS CHOOSE US ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Why Traders Choose Us
            </h2>
            <p className="text-gray-500">Everything you need to make the right decision</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Smart Filters',
                description: 'Filter by trading style, budget, profit split, and 20+ criteria',
              },
              {
                icon: Shield,
                title: 'Verified Data',
                description: 'All data verified directly from prop firm websites',
              },
              {
                icon: Star,
                title: 'Real Reviews',
                description: 'Trustpilot ratings and real trader experiences',
              },
              {
                icon: Gift,
                title: 'Exclusive Deals',
                description: 'Save up to 55% with our exclusive discount codes',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LATEST FROM BLOG ========== */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">📚</span>
                Latest from the Blog
              </h2>
              <p className="text-gray-500 mt-1">Tips and strategies to help you get funded</p>
            </div>
            <Link 
              href="/blog" 
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all"
              >
                <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded mb-3">
                  {post.category}
                </span>
                <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors mb-2">
                  {post.title}
                </h3>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Funded?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Stop guessing. Compare all prop firms in one place and find your perfect match.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/compare"
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
            >
              Start Comparing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all"
            >
              <Award className="w-5 h-5" />
              Download Free Guide
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
