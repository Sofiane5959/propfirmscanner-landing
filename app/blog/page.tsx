'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Clock, ArrowRight, Search, Star, BookOpen, 
  Shield, Brain, TrendingUp, Filter, User,
  Calendar, ChevronRight, Mail, Sparkles
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  readTime: string;
  category: 'Guides' | 'Rules Decoded' | 'Reviews' | 'Psychology';
  featured: boolean;
  tags: string[];
}

// =============================================================================
// CATEGORY STYLING
// =============================================================================

const CATEGORY_COLORS: Record<string, { bg: string; gradient: string }> = {
  'Guides': { 
    bg: 'bg-emerald-500/20', 
    gradient: 'from-emerald-600/30 via-emerald-500/20 to-teal-500/30' 
  },
  'Rules Decoded': { 
    bg: 'bg-blue-500/20', 
    gradient: 'from-blue-600/30 via-blue-500/20 to-indigo-500/30' 
  },
  'Reviews': { 
    bg: 'bg-purple-500/20', 
    gradient: 'from-purple-600/30 via-purple-500/20 to-pink-500/30' 
  },
  'Psychology': { 
    bg: 'bg-orange-500/20', 
    gradient: 'from-orange-600/30 via-orange-500/20 to-amber-500/30' 
  },
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Guides': BookOpen,
  'Rules Decoded': Shield,
  'Reviews': TrendingUp,
  'Psychology': Brain,
};

// =============================================================================
// BLOG DATA
// =============================================================================

const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-choose-right-prop-firm',
    title: 'How to Choose the Right Prop Firm for Your Trading Style',
    description: 'With 50+ prop firms available, how do you pick the right one? This guide breaks down key factors based on your trading style and budget.',
    date: 'December 25, 2024',
    updatedDate: 'January 2025',
    readTime: '10 min read',
    category: 'Guides',
    featured: true,
    tags: ['beginner', 'comparison', 'strategy'],
  },
  {
    slug: 'news-trading-rules-explained',
    title: 'News Trading Rules Explained: What Prop Firms Actually Allow',
    description: 'Confused about news trading rules? Learn which prop firms allow it, which restrict it, and how to trade news without breaking rules.',
    date: 'December 25, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['news trading', 'rules', 'restrictions'],
  },
  {
    slug: 'consistency-rules-explained',
    title: 'Consistency Rules Explained: The Hidden Rule That Fails Traders',
    description: 'Consistency rules are the most misunderstood requirement. Learn what they are, which firms have them, and how to pass.',
    date: 'December 25, 2024',
    readTime: '7 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['consistency', 'rules', 'challenge'],
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge: 10 Proven Strategies',
    description: 'Learn the exact strategies successful traders use to pass prop firm challenges. From risk management to psychology.',
    date: 'December 20, 2024',
    updatedDate: 'January 2025',
    readTime: '12 min read',
    category: 'Guides',
    featured: true,
    tags: ['strategy', 'challenge', 'tips'],
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms 2025: Complete Ranking & Comparison',
    description: 'Our comprehensive ranking of the best prop trading firms in 2025. Compare fees, profit splits, rules, and find the perfect firm.',
    date: 'December 18, 2024',
    updatedDate: 'January 2025',
    readTime: '15 min read',
    category: 'Reviews',
    featured: true,
    tags: ['ranking', '2025', 'comparison'],
  },
  {
    slug: 'trailing-drawdown-explained',
    title: "Trailing Drawdown Explained: Don't Let This Rule Catch You",
    description: 'Trailing drawdown has ended more challenges than any other rule. Learn how it works and strategies to manage it.',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['drawdown', 'risk management', 'rules'],
  },
  {
    slug: 'prop-firm-payout-guide',
    title: 'Prop Firm Payouts: How to Get Paid Fast',
    description: 'Everything about prop firm payouts. Learn about schedules, methods, and how to ensure you get paid quickly.',
    date: 'December 12, 2024',
    readTime: '6 min read',
    category: 'Guides',
    featured: false,
    tags: ['payout', 'withdrawal', 'money'],
  },
  {
    slug: 'why-traders-fail-challenges',
    title: 'Why 90% of Traders Fail Prop Firm Challenges',
    description: 'Understand the real reasons most traders fail and learn strategies to join the successful 10%.',
    date: 'December 10, 2024',
    readTime: '9 min read',
    category: 'Psychology',
    featured: false,
    tags: ['psychology', 'mindset', 'failure'],
  },
  {
    slug: 'scaling-plans-explained',
    title: 'Prop Firm Scaling Plans: How to Grow Your Account',
    description: 'Learn how scaling plans work and strategies to maximize your funded account growth from $10K to $1M+.',
    date: 'December 8, 2024',
    readTime: '7 min read',
    category: 'Guides',
    featured: false,
    tags: ['scaling', 'growth', 'funded'],
  },
];

// =============================================================================
// CATEGORY IMAGE COMPONENT (SVG Placeholder)
// =============================================================================

function CategoryImage({ category, className = '' }: { category: string; className?: string }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Guides'];
  const Icon = CATEGORY_ICONS[category] || BookOpen;
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${colors.gradient} ${className}`}>
      {/* Decorative pattern */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={`grid-${category}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${category})`} />
      </svg>
      
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <Icon className="w-8 h-8 text-white/80" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

// Featured Article Card (Large)
function FeaturedCard({ post }: { post: BlogPost }) {
  const Icon = CATEGORY_ICONS[post.category];
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative overflow-hidden bg-gray-900 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-300"
    >
      {/* Image placeholder */}
      <CategoryImage category={post.category} className="h-48" />
      
      {/* Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
          <Icon className="w-3 h-3" />
          {post.category}
        </span>
        <span className="px-2 py-1 bg-yellow-500/90 text-gray-900 text-xs font-bold rounded-full">
          Featured
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              PropFirmScanner
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Regular Article Card
function ArticleCard({ post }: { post: BlogPost }) {
  const Icon = CATEGORY_ICONS[post.category];
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-emerald-500/30 hover:bg-gray-900 transition-all duration-300"
    >
      {/* Image placeholder */}
      <CategoryImage category={post.category} className="h-40" />
      
      {/* Category Badge */}
      <div className="absolute top-3 left-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/80 text-gray-300 text-xs font-medium rounded-full backdrop-blur-sm">
          <Icon className="w-3 h-3" />
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 relative">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.updatedDate ? `Updated ${post.updatedDate}` : post.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Sidebar Popular Posts
function PopularPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
      <h3 className="flex items-center gap-2 font-semibold text-white mb-4">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        Popular Articles
      </h3>
      <div className="space-y-4">
        {posts.slice(0, 4).map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-3"
          >
            <span className="flex-shrink-0 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <span className="text-xs text-gray-500">{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Newsletter Signup
function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-white">Newsletter</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Get weekly prop firm tips and exclusive deals.
      </p>
      
      {status === 'success' ? (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/20 rounded-lg text-emerald-400 text-sm">
          <Sparkles className="w-4 h-4" />
          Thanks for subscribing!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}

// Tags Cloud
function TagsCloud({ posts }: { posts: BlogPost[] }) {
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));
  
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
      <h3 className="font-semibold text-white mb-4">Topics</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <span
            key={tag}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded-full cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPosts.length };
    blogPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Separate featured and regular posts
  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  const categories = ['All', 'Guides', 'Rules Decoded', 'Reviews', 'Psychology'];

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Prop Firm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Blog</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Expert guides, rule explanations, and strategies to help you get funded.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Categories with Counts */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat === 'All' ? Filter : CATEGORY_ICONS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {cat}
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && activeCategory === 'All' && !searchQuery && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Featured Articles</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <FeaturedCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* All/Filtered Posts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {searchQuery 
                    ? `Search Results (${filteredPosts.length})`
                    : activeCategory === 'All' 
                      ? 'Latest Articles' 
                      : `${activeCategory} (${filteredPosts.length})`
                  }
                </h2>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(searchQuery || activeCategory !== 'All' ? filteredPosts : regularPosts).map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-white font-medium mb-2">No articles found</h3>
                  <p className="text-gray-500 text-sm">Try a different search term or category</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <NewsletterSignup />
            <PopularPosts posts={blogPosts} />
            <TagsCloud posts={blogPosts} />
            
            {/* CTA Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">Ready to Get Funded?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Compare 70+ prop firms and find your perfect match.
              </p>
              <Link
                href="/compare"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Compare Prop Firms
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
