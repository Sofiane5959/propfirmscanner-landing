'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Clock, ArrowRight, Search, Star, BookOpen, 
  Shield, Brain, TrendingUp, Filter, User,
  Calendar, ChevronRight, Mail, Sparkles, Home
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

const CATEGORY_COLORS: Record<string, { bg: string; gradient: string; accent: string }> = {
  'Guides': { 
    bg: 'bg-emerald-500/20', 
    gradient: 'from-emerald-600/40 via-emerald-500/30 to-teal-500/40',
    accent: 'emerald'
  },
  'Rules Decoded': { 
    bg: 'bg-blue-500/20', 
    gradient: 'from-blue-600/40 via-blue-500/30 to-indigo-500/40',
    accent: 'blue'
  },
  'Reviews': { 
    bg: 'bg-purple-500/20', 
    gradient: 'from-purple-600/40 via-purple-500/30 to-pink-500/40',
    accent: 'purple'
  },
  'Psychology': { 
    bg: 'bg-orange-500/20', 
    gradient: 'from-orange-600/40 via-orange-500/30 to-amber-500/40',
    accent: 'orange'
  },
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Guides': BookOpen,
  'Rules Decoded': Shield,
  'Reviews': TrendingUp,
  'Psychology': Brain,
};

// =============================================================================
// BLOG DATA - Full 20 articles
// =============================================================================

const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-choose-right-prop-firm',
    title: 'How to Choose the Right Prop Firm for Your Trading Style',
    description: 'With 50+ prop firms available, how do you pick the right one? This guide breaks down key factors based on your trading style and budget.',
    date: 'January 5, 2025',
    updatedDate: 'January 2025',
    readTime: '10 min read',
    category: 'Guides',
    featured: true,
    tags: ['beginner', 'comparison', 'strategy'],
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge: 10 Proven Strategies',
    description: 'Learn the exact strategies successful traders use to pass prop firm challenges. From risk management to psychology.',
    date: 'January 3, 2025',
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
    date: 'January 1, 2025',
    updatedDate: 'January 2025',
    readTime: '15 min read',
    category: 'Reviews',
    featured: true,
    tags: ['ranking', '2025', 'comparison'],
  },
  {
    slug: 'news-trading-rules-explained',
    title: 'News Trading Rules Explained: What Prop Firms Actually Allow',
    description: 'Confused about news trading rules? Learn which prop firms allow it, which restrict it, and how to trade news without breaking rules.',
    date: 'December 28, 2024',
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
    slug: 'trailing-drawdown-explained',
    title: "Trailing Drawdown Explained: Don't Let This Rule Catch You",
    description: 'Trailing drawdown has ended more challenges than any other rule. Learn how it works and strategies to manage it.',
    date: 'December 22, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['drawdown', 'risk management', 'rules'],
  },
  {
    slug: 'prop-firm-payout-guide',
    title: 'Prop Firm Payouts: How to Get Paid Fast',
    description: 'Everything about prop firm payouts. Learn about schedules, methods, and how to ensure you get paid quickly.',
    date: 'December 20, 2024',
    readTime: '6 min read',
    category: 'Guides',
    featured: false,
    tags: ['payout', 'withdrawal', 'money'],
  },
  {
    slug: 'why-traders-fail-challenges',
    title: 'Why 90% of Traders Fail Prop Firm Challenges',
    description: 'Understand the real reasons most traders fail and learn strategies to join the successful 10%.',
    date: 'December 18, 2024',
    readTime: '9 min read',
    category: 'Psychology',
    featured: false,
    tags: ['psychology', 'mindset', 'failure'],
  },
  {
    slug: 'scaling-plans-explained',
    title: 'Prop Firm Scaling Plans: How to Grow Your Account',
    description: 'Learn how scaling plans work and strategies to maximize your funded account growth from $10K to $1M+.',
    date: 'December 15, 2024',
    readTime: '7 min read',
    category: 'Guides',
    featured: false,
    tags: ['scaling', 'growth', 'funded'],
  },
  {
    slug: 'ftmo-review-2025',
    title: 'FTMO Review 2025: Still the Best Prop Firm?',
    description: 'An in-depth review of FTMO covering their challenge, rules, payouts, and whether they deserve their reputation.',
    date: 'December 12, 2024',
    readTime: '11 min read',
    category: 'Reviews',
    featured: false,
    tags: ['FTMO', 'review', '2025'],
  },
  {
    slug: 'trading-psychology-tips',
    title: 'Trading Psychology: 7 Mental Habits of Funded Traders',
    description: 'Discover the psychological traits that separate funded traders from the rest. Practical tips to improve your mindset.',
    date: 'December 10, 2024',
    readTime: '10 min read',
    category: 'Psychology',
    featured: false,
    tags: ['psychology', 'mindset', 'habits'],
  },
  {
    slug: 'the5ers-review-2025',
    title: 'The5ers Review 2025: Best for Scaling?',
    description: 'Complete review of The5ers prop firm. Analyzing their unique scaling program, rules, and trader experience.',
    date: 'December 8, 2024',
    readTime: '10 min read',
    category: 'Reviews',
    featured: false,
    tags: ['The5ers', 'review', 'scaling'],
  },
  {
    slug: 'daily-drawdown-rules',
    title: 'Daily Drawdown Rules: The #1 Account Killer',
    description: 'Daily drawdown limits fail more traders than any other rule. Learn exactly how they work and how to stay safe.',
    date: 'December 5, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['drawdown', 'daily limit', 'rules'],
  },
  {
    slug: 'forex-vs-futures-prop-firms',
    title: 'Forex vs Futures Prop Firms: Complete Comparison',
    description: 'Should you trade forex or futures with a prop firm? Compare rules, fees, and opportunities for each market.',
    date: 'December 2, 2024',
    readTime: '9 min read',
    category: 'Guides',
    featured: false,
    tags: ['forex', 'futures', 'comparison'],
  },
  {
    slug: 'prop-firm-fees-explained',
    title: 'Prop Firm Fees Explained: What You Actually Pay',
    description: 'Break down all the fees: challenge fees, monthly fees, reset fees. Learn how to calculate true costs.',
    date: 'November 28, 2024',
    readTime: '7 min read',
    category: 'Guides',
    featured: false,
    tags: ['fees', 'cost', 'pricing'],
  },
  {
    slug: 'trading-with-multiple-prop-firms',
    title: 'Trading Multiple Prop Firm Accounts: Strategy Guide',
    description: 'Is trading multiple accounts worth it? Learn the pros, cons, and strategies for managing several funded accounts.',
    date: 'November 25, 2024',
    readTime: '8 min read',
    category: 'Guides',
    featured: false,
    tags: ['multiple accounts', 'strategy', 'scaling'],
  },
  {
    slug: 'weekend-holding-rules',
    title: 'Weekend Holding Rules: What You Need to Know',
    description: 'Can you hold trades over the weekend? Understand different prop firm policies and gap risk management.',
    date: 'November 20, 2024',
    readTime: '6 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['weekend', 'holding', 'rules'],
  },
  {
    slug: 'revenge-trading-how-to-stop',
    title: 'Revenge Trading: How to Stop Destroying Your Account',
    description: 'Revenge trading kills more challenges than bad strategy. Learn to recognize and overcome this destructive pattern.',
    date: 'November 15, 2024',
    readTime: '8 min read',
    category: 'Psychology',
    featured: false,
    tags: ['revenge trading', 'psychology', 'discipline'],
  },
  {
    slug: 'ea-trading-prop-firms',
    title: 'EA & Bot Trading with Prop Firms: Complete Guide',
    description: 'Which prop firms allow EAs and trading bots? Rules, restrictions, and best practices for automated trading.',
    date: 'November 10, 2024',
    readTime: '7 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['EA', 'bots', 'automated trading'],
  },
  {
    slug: 'first-prop-firm-guide',
    title: 'Your First Prop Firm Challenge: Complete Beginner Guide',
    description: 'Everything you need to know before starting your first challenge. From choosing a firm to passing Phase 1.',
    date: 'October 25, 2024',
    readTime: '12 min read',
    category: 'Guides',
    featured: false,
    tags: ['beginner', 'first challenge', 'guide'],
  },
];

// =============================================================================
// CSS ANIMATIONS (inline styles for Tailwind)
// =============================================================================

const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(3deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float 6s ease-in-out infinite 2s; }
  .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .animate-gradient { 
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite; 
  }
  .animate-shimmer { animation: shimmer 2s infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
`;

// =============================================================================
// CATEGORY IMAGE COMPONENT (Enhanced with Animations)
// =============================================================================

function CategoryImage({ category, className = '', featured = false }: { category: string; className?: string; featured?: boolean }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Guides'];
  const Icon = CATEGORY_ICONS[category] || BookOpen;
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${colors.gradient} animate-gradient ${className}`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-50" />
      
      {/* Animated grid pattern */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-20"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={`grid-${category}-${featured ? 'f' : 'r'}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/30" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#grid-${category}-${featured ? 'f' : 'r'})`} />
      </svg>
      
      {/* Animated decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full animate-pulse-glow" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full animate-float-delayed" />
      
      {/* Spinning decorative ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-white/30 rounded-full animate-float" />
      <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-delayed" />
      <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white/50 rounded-full animate-bounce-subtle" />
      
      {/* Center icon with animations */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          {/* Glow behind icon */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl scale-150 animate-pulse-glow" />
          
          {/* Icon container */}
          <div className="relative p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-300 animate-float">
            <Icon className="w-8 h-8 text-white/90 group-hover:text-white transition-colors group-hover:scale-110 transform duration-300" />
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/50 to-transparent" />
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

// Breadcrumb Component
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
      <Link href="/" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
        <Home className="w-4 h-4" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-white">Blog</span>
    </nav>
  );
}

// Featured Article Card (Large)
function FeaturedCard({ post }: { post: BlogPost }) {
  const Icon = CATEGORY_ICONS[post.category];
  
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative overflow-hidden bg-gray-900 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
    >
      {/* Image with animations */}
      <CategoryImage category={post.category} className="h-48" featured={true} />
      
      {/* Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm shadow-lg">
          <Icon className="w-3 h-3" />
          {post.category}
        </span>
        <span className="px-2 py-1 bg-yellow-500/90 text-gray-900 text-xs font-bold rounded-full animate-pulse">
          Featured
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
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
          <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all duration-300">
            Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      className="group relative flex flex-col bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-emerald-500/30 hover:bg-gray-900 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1"
    >
      {/* Image with animations */}
      <CategoryImage category={post.category} className="h-40" />
      
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/80 text-gray-300 text-xs font-medium rounded-full backdrop-blur-sm border border-gray-700/50 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all duration-300">
          <Icon className="w-3 h-3" />
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

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
  
  // Pagination
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);
  const paginatedPosts = regularPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const categories = ['All', 'Guides', 'Rules Decoded', 'Reviews', 'Psychology'];

  return (
    <>
      {/* Inject animation styles */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <div className="min-h-screen bg-gray-950">
        {/* Hero Header - Reduced padding to eliminate empty space */}
        <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-12">
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search articles..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* Categories with Counts */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => {
              const Icon = cat === 'All' ? Filter : CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
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
              {featuredPosts.length > 0 && activeCategory === 'All' && !searchQuery && currentPage === 1 && (
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
                        ? `Latest Articles (${regularPosts.length})` 
                        : `${activeCategory} (${filteredPosts.length})`
                    }
                  </h2>
                </div>

                {filteredPosts.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(searchQuery || activeCategory !== 'All' ? filteredPosts : paginatedPosts).map((post) => (
                        <ArticleCard key={post.slug} post={post} />
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {!searchQuery && activeCategory === 'All' && totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
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
    </>
  );
}
