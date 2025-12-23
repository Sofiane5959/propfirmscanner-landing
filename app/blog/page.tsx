import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prop Trading Blog - Tips, Guides & News',
  description: 'Learn prop trading strategies, tips to pass your challenge, and stay updated with the latest prop firm news and reviews.',
  keywords: [
    'prop trading blog',
    'prop firm tips',
    'how to pass prop firm challenge',
    'funded trader tips',
    'prop trading strategies',
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

// Static blog posts (you can later move this to a CMS or database)
const blogPosts = [
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge on the First Try',
    excerpt: 'Learn the proven strategies and risk management techniques that successful funded traders use to pass their prop firm evaluations.',
    category: 'Guides',
    date: '2025-01-15',
    readTime: '8 min read',
    image: '/blog/pass-challenge.jpg',
    featured: true,
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms in 2025: Complete Ranking',
    excerpt: 'Our comprehensive ranking of the top prop trading firms based on profit splits, rules, pricing, and trader reviews.',
    category: 'Reviews',
    date: '2025-01-10',
    readTime: '12 min read',
    image: '/blog/best-prop-firms.jpg',
    featured: true,
  },
  {
    slug: 'prop-firm-vs-personal-account',
    title: 'Prop Firm vs Personal Account: Which is Better?',
    excerpt: 'Compare the pros and cons of trading with a prop firm versus using your own capital. Find out which option suits your situation.',
    category: 'Education',
    date: '2025-01-05',
    readTime: '6 min read',
    image: '/blog/prop-vs-personal.jpg',
  },
  {
    slug: 'risk-management-prop-trading',
    title: 'Risk Management for Prop Trading: The Ultimate Guide',
    excerpt: 'Master the risk management techniques that will help you stay funded and grow your trading account consistently.',
    category: 'Strategies',
    date: '2024-12-28',
    readTime: '10 min read',
    image: '/blog/risk-management.jpg',
  },
  {
    slug: 'common-mistakes-prop-traders',
    title: '10 Common Mistakes That Fail Prop Traders (And How to Avoid Them)',
    excerpt: 'Avoid these costly mistakes that cause most traders to fail their prop firm challenges and lose their funded accounts.',
    category: 'Tips',
    date: '2024-12-20',
    readTime: '7 min read',
    image: '/blog/common-mistakes.jpg',
  },
  {
    slug: 'scalping-strategies-prop-firms',
    title: 'Scalping Strategies That Work for Prop Firm Challenges',
    excerpt: 'Discover scalping strategies specifically designed to meet prop firm profit targets while respecting drawdown limits.',
    category: 'Strategies',
    date: '2024-12-15',
    readTime: '9 min read',
    image: '/blog/scalping.jpg',
  },
]

const categories = ['All', 'Guides', 'Reviews', 'Education', 'Strategies', 'Tips', 'News']

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.filter(post => !post.featured)

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PropFirm Scanner Blog',
    description: 'Prop trading tips, guides, and news',
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
              Tips, strategies, and guides to help you succeed in prop trading.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === 'All'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all"
                  >
                    <div className="h-48 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-6xl">📈</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read more <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Articles</h2>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-6 bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-xs">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Stay Updated</h2>
            <p className="text-gray-400 mb-6">
              Get the latest prop trading tips and exclusive deals delivered to your inbox.
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
