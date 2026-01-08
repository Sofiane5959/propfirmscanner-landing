'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Clock, ArrowRight, Search, Star, BookOpen, 
  Shield, Brain, TrendingUp, Filter, User,
  Calendar, ChevronRight, ChevronLeft, Mail, Sparkles,
  Home
} from 'lucide-react';
import { 
  blogPosts, 
  CATEGORY_COLORS, 
  getCategoryCounts, 
  getAllTags,
  type BlogPost 
} from '@/lib/blog-data';

// =============================================================================
// CONSTANTS
// =============================================================================

const POSTS_PER_PAGE = 9;

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Guides': BookOpen,
  'Rules Decoded': Shield,
  'Reviews': TrendingUp,
  'Psychology': Brain,
};

// =============================================================================
// CATEGORY IMAGE COMPONENT (SVG Gradient)
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
          <pattern id={`grid-${category.replace(/\s+/g, '-')}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${category.replace(/\s+/g, '-')})`} />
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
// BREADCRUMB COMPONENT
// =============================================================================

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link 
            href="/" 
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>
        <li className="text-gray-600">
          <ChevronRight className="w-4 h-4" />
        </li>
        <li>
          <span className="text-emerald-400 font-medium">Blog</span>
        </li>
      </ol>
    </nav>
  );
}

// =============================================================================
// FEATURED CARD COMPONENT
// =============================================================================

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

// =============================================================================
// ARTICLE CARD COMPONENT
// =============================================================================

function ArticleCard({ post }: { post: BlogPost }) {
  const Icon = CATEGORY_ICONS[post.category];
  const colors = CATEGORY_COLORS[post.category];
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-emerald-500/30 hover:bg-gray-900 transition-all duration-300"
    >
      {/* Image placeholder - parent has relative */}
      <CategoryImage category={post.category} className="h-40" />
      
      {/* Category Badge - positioned absolute within the relative parent Link */}
      <div className="absolute top-3 left-3">
        <span className={`flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full backdrop-blur-sm border border-white/10`}>
          <Icon className="w-3 h-3" />
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
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

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Always show first page
  pages.push(1);

  if (showEllipsisStart) {
    pages.push('...');
  }

  // Show pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (showEllipsisEnd) {
    pages.push('...');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

// =============================================================================
// SIDEBAR COMPONENTS
// =============================================================================

function PopularPosts({ posts }: { posts: BlogPost[] }) {
  // Get top 4 articles (featured first, then by date)
  const popularPosts = [...posts]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
      <h3 className="flex items-center gap-2 font-semibold text-white mb-4">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        Popular Articles
      </h3>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
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

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    // Simulate API call - replace with real newsletter integration
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

function TagsCloud({ posts }: { posts: BlogPost[] }) {
  const allTags = getAllTags();
  
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
      <h3 className="font-semibold text-white mb-4">Topics</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.slice(0, 15).map(tag => (
          <span
            key={tag}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded-full cursor-pointer transition-colors capitalize"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-white font-medium mb-2">No articles found</h3>
      <p className="text-gray-500 text-sm">Try a different search term or category</p>
    </div>
  );
}

// =============================================================================
// MAIN BLOG PAGE COMPONENT
// =============================================================================

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Category counts
  const categoryCounts = useMemo(() => getCategoryCounts(), []);

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
  const featuredPosts = useMemo(() => filteredPosts.filter(p => p.featured), [filteredPosts]);
  const regularPosts = useMemo(() => filteredPosts.filter(p => !p.featured), [filteredPosts]);

  // Determine which posts to show in the main grid
  const postsForGrid = useMemo(() => {
    if (searchQuery || activeCategory !== 'All') {
      return filteredPosts; // Show all filtered posts including featured
    }
    return regularPosts; // Show only non-featured posts
  }, [searchQuery, activeCategory, filteredPosts, regularPosts]);

  // Pagination
  const totalPages = Math.ceil(postsForGrid.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return postsForGrid.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [postsForGrid, currentPage]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const categories = ['All', 'Guides', 'Rules Decoded', 'Reviews', 'Psychology'];

  // Show featured section only on first page with no filters
  const showFeaturedSection = featuredPosts.length > 0 && activeCategory === 'All' && !searchQuery && currentPage === 1;

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <Breadcrumb />

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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
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
                onClick={() => handleCategoryChange(cat)}
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
            {showFeaturedSection && (
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
                      ? `Latest Articles (${postsForGrid.length})` 
                      : `${activeCategory} (${filteredPosts.length})`
                  }
                </h2>
              </div>

              {paginatedPosts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedPosts.map((post) => (
                      <ArticleCard key={post.slug} post={post} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <EmptyState />
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

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-b from-gray-950 to-gray-900 border-t border-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Funded?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Put this knowledge into practice. Compare 70+ prop firms and find your perfect match.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/compare" 
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Compare Prop Firms
            </Link>
            <Link 
              href="/deals" 
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
