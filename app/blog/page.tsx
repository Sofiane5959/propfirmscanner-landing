import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prop Trading Blog - Tips, Guides & Rules Decoded',
  description: 'Learn prop trading strategies, understand prop firm rules, and avoid common mistakes. Free guides to help you pass your trading challenge.',
  keywords: [
    'prop trading blog',
    'prop firm tips',
    'how to pass prop firm challenge',
    'funded trader tips',
    'prop trading strategies',
    'drawdown explained',
    'prop firm rules',
  ],
  openGraph: {
    title: 'Prop Trading Blog | PropFirm Scanner',
    description: 'Learn prop trading strategies, tips to pass your challenge, and stay updated with the latest prop firm news.',
    url: 'https://www.propfirmscanner.org/blog',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/blog',
  },
}

// All blog posts
const blogPosts = [
  {
    slug: 'trailing-drawdown-explained',
    title: 'Trailing Drawdown Explained: Why Most Traders Fail',
    excerpt: 'Understanding trailing drawdown is crucial to passing your prop firm challenge. Learn how it works and how to avoid getting stopped out.',
    category: 'Rules Decoded',
    date: '2025-01-20',
    readTime: '10 min read',
    featured: true,
    icon: '📉',
  },
  {
    slug: 'daily-vs-max-drawdown',
    title: 'Daily Drawdown vs Max Drawdown: What Every Trader Must Know',
    excerpt: 'Learn the critical difference between daily and maximum drawdown limits, and how to avoid breaching either one.',
    category: 'Rules Decoded',
    date: '2025-01-18',
    readTime: '7 min read',
    featured: true,
    icon: '⚖️',
  },
  {
    slug: 'top-7-reasons-traders-fail',
    title: 'Top 7 Reasons Traders Fail Prop Firm Challenges',
    excerpt: 'Discover the most common mistakes that cause traders to fail their prop firm evaluations and learn how to avoid them.',
    category: 'Failure Analysis',
    date: '2025-01-16',
    readTime: '9 min read',
    featured: true,
    icon: '❌',
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge on the First Try',
    excerpt: 'Learn the proven strategies and risk management techniques that successful funded traders use to pass their prop firm evaluations.',
    category: 'Guides',
    date: '2025-01-15',
    readTime: '8 min read',
    icon: '✅',
  },
  {
    slug: 'prop-firm-profit-split-trap',
    title: 'Why "90% Profit Split" Is Often a Trap',
    excerpt: 'High profit splits sound amazing, but there are hidden factors that matter more. Learn what really affects your earnings.',
    category: 'Rules Decoded',
    date: '2025-01-14',
    readTime: '6 min read',
    icon: '🪤',
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms in 2025: Complete Ranking',
    excerpt: 'Our comprehensive ranking of the top prop trading firms based on profit splits, rules, pricing, and trader reviews.',
    category: 'Reviews',
    date: '2025-01-10',
    readTime: '12 min read',
    icon: '🏆',
  },
]

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Rules Decoded', count: blogPosts.filter(p => p.category === 'Rules Decoded').length },
  { name: 'Failure Analysis', count: blogPosts.filter(p => p.category === 'Failure Analysis').length },
  { name: 'Guides', count: blogPosts.filter(p => p.category === 'Guides').length },
  { name: 'Reviews', count: blogPosts.filter(p => p.category === 'Reviews').length },
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PropFirm Scanner Blog',
    description: 'Prop trading tips, guides, rules explained, and news',
    url: 'https://www.propfirmscanner.org/blog',
    publisher: {
      '@type': 'Organization',
      name: 'PropFirm Scanner',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      
      <div className="min-h-screen bg-gray-900 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Prop Trading <span className="text-emerald-400">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Rules decoded, strategies explained, and mistakes to avoid. Everything you need to pass your prop firm challenge.
            </p>
          </div>

          {/* Tool Banner */}
          <Link 
            href="/tools/risk-calculator"
            className="block mb-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Calculator className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Free Risk Calculator</h2>
                  <p className="text-gray-400">Calculate your max risk per trade and protect your account</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-emerald-400" />
            </div>
          </Link>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category.name === 'All'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">🔥 Must Read</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-5xl">{post.icon}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-xs">{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Articles</h2>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-5 bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/30 transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{post.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors flex-shrink-0 self-center" />
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Never Miss an Update</h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Get prop firm rule changes, new discount codes, and trading tips delivered to your inbox.
            </p>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              Get Free Guide + Updates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
