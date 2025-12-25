import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight, Tag, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prop Firm Blog - Guides, Reviews & Trading Tips | PropFirm Scanner',
  description: 'Expert guides on prop firm challenges, trading rules, and strategies. Learn how to pass your challenge and get funded.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/blog',
  },
}

const blogPosts = [
  {
    slug: 'how-to-choose-right-prop-firm',
    title: 'How to Choose the Right Prop Firm for Your Trading Style',
    description: 'With 50+ prop firms available, how do you pick the right one? This guide breaks down key factors based on your trading style and budget.',
    date: 'December 25, 2024',
    readTime: '10 min read',
    category: 'Guides',
    featured: true,
  },
  {
    slug: 'news-trading-rules-explained',
    title: 'News Trading Rules Explained: What Prop Firms Actually Allow',
    description: 'Confused about news trading rules? Learn which prop firms allow it, which restrict it, and how to trade news without breaking rules.',
    date: 'December 25, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
  },
  {
    slug: 'consistency-rules-explained',
    title: 'Consistency Rules Explained: The Hidden Rule That Fails Traders',
    description: 'Consistency rules are the most misunderstood requirement. Learn what they are, which firms have them, and how to pass.',
    date: 'December 25, 2024',
    readTime: '7 min read',
    category: 'Rules Decoded',
    featured: false,
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge: 10 Proven Strategies',
    description: 'Learn the exact strategies successful traders use to pass prop firm challenges. From risk management to psychology.',
    date: 'December 20, 2024',
    readTime: '12 min read',
    category: 'Guides',
    featured: true,
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms 2025: Complete Ranking & Comparison',
    description: 'Our comprehensive ranking of the best prop trading firms in 2025. Compare fees, profit splits, rules, and find the perfect firm.',
    date: 'December 18, 2024',
    readTime: '15 min read',
    category: 'Reviews',
    featured: true,
  },
  {
    slug: 'trailing-drawdown-explained',
    title: "Trailing Drawdown Explained: Don't Let This Rule Catch You",
    description: 'Trailing drawdown has ended more challenges than any other rule. Learn how it works and strategies to manage it.',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
  },
  {
    slug: 'prop-firm-payout-guide',
    title: 'Prop Firm Payouts: How to Get Paid Fast',
    description: 'Everything about prop firm payouts. Learn about schedules, methods, and how to ensure you get paid quickly.',
    date: 'December 12, 2024',
    readTime: '6 min read',
    category: 'Guides',
    featured: false,
  },
  {
    slug: 'why-traders-fail-challenges',
    title: 'Why 90% of Traders Fail Prop Firm Challenges',
    description: 'Understand the real reasons most traders fail and learn strategies to join the successful 10%.',
    date: 'December 10, 2024',
    readTime: '9 min read',
    category: 'Psychology',
    featured: false,
  },
  {
    slug: 'scaling-plans-explained',
    title: 'Prop Firm Scaling Plans: How to Grow Your Account',
    description: 'Learn how scaling plans work and strategies to maximize your funded account growth from $10K to $1M+.',
    date: 'December 8, 2024',
    readTime: '7 min read',
    category: 'Guides',
    featured: false,
  },
]

const categories = ['All', 'Guides', 'Rules Decoded', 'Reviews', 'Psychology']

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(p => p.featured)
  const recentPosts = blogPosts.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prop Firm <span className="text-emerald-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Expert guides, rule explanations, and strategies to help you get funded.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                ${cat === 'All' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                    Featured
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-emerald-400 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Funded?</h2>
          <p className="text-gray-400 mb-6">Put this knowledge into practice. Compare 55+ prop firms and find your perfect match.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/compare" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
              Compare Prop Firms
            </Link>
            <Link href="/tools/risk-calculator" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors">
              Risk Calculator
            </Link>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Get Trading Tips in Your Inbox</h3>
          <p className="text-gray-400 mb-4">Join 5,000+ traders getting weekly prop firm insights.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
