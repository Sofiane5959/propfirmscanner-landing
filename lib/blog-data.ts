// Blog articles data with UPDATED dates for 2025/2026
// Replace your existing blog data with this

export interface BlogArticle {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  readTime: string
  category: string
  featured?: boolean
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'how-to-choose-right-prop-firm',
    title: 'How to Choose the Right Prop Firm in 2026: Complete Guide',
    description: 'A comprehensive guide to selecting the perfect prop trading firm based on your trading style, experience level, and goals.',
    publishedAt: '2025-11-15',
    updatedAt: '2025-12-27',
    readTime: '12 min read',
    category: 'Guides',
    featured: true,
  },
  {
    slug: 'news-trading-rules-explained',
    title: 'News Trading Rules Explained: What Every Prop Trader Must Know',
    description: 'Understand how prop firms handle news trading restrictions, what counts as high-impact news, and how to avoid rule violations.',
    publishedAt: '2025-10-20',
    updatedAt: '2025-12-27',
    readTime: '8 min read',
    category: 'Rules',
  },
  {
    slug: 'consistency-rules-explained',
    title: 'Consistency Rules Explained: Avoid This Common Challenge Failure',
    description: 'Learn what consistency rules are, how they work, and which prop firms enforce them. Avoid this hidden challenge killer.',
    publishedAt: '2025-10-05',
    updatedAt: '2025-12-27',
    readTime: '7 min read',
    category: 'Rules',
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass a Prop Firm Challenge: 15 Proven Strategies',
    description: 'Expert tips and strategies to successfully pass your prop firm evaluation. Learn from traders who have done it.',
    publishedAt: '2025-09-18',
    updatedAt: '2025-12-27',
    readTime: '15 min read',
    category: 'Strategies',
    featured: true,
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms 2026: Top 10 Ranked & Compared',
    description: 'Our updated ranking of the best prop trading firms for 2026. Compared by price, rules, payouts, and trader reviews.',
    publishedAt: '2025-12-01',
    updatedAt: '2025-12-27',
    readTime: '18 min read',
    category: 'Rankings',
    featured: true,
  },
  {
    slug: 'trailing-drawdown-explained',
    title: 'Trailing Drawdown Explained: The Rule That Fails Most Traders',
    description: 'Understand how trailing drawdown works, the difference between EOD and real-time trailing, and how to manage it.',
    publishedAt: '2025-08-25',
    updatedAt: '2025-12-27',
    readTime: '10 min read',
    category: 'Rules',
  },
  {
    slug: 'prop-firm-payout-guide',
    title: 'Prop Firm Payouts: Complete Guide to Getting Paid',
    description: 'Everything you need to know about prop firm payouts: timing, methods, fees, and how to ensure smooth withdrawals.',
    publishedAt: '2025-07-30',
    updatedAt: '2025-12-27',
    readTime: '9 min read',
    category: 'Guides',
  },
  {
    slug: 'why-traders-fail-challenges',
    title: '10 Reasons Why Traders Fail Prop Firm Challenges',
    description: 'Common mistakes that lead to challenge failure and how to avoid them. Learn from others\' mistakes before you start.',
    publishedAt: '2025-06-15',
    updatedAt: '2025-12-27',
    readTime: '11 min read',
    category: 'Education',
  },
  {
    slug: 'scaling-plans-explained',
    title: 'Scaling Plans Explained: How to Grow Your Funded Account',
    description: 'Learn how prop firm scaling plans work, requirements to scale up, and which firms offer the best growth opportunities.',
    publishedAt: '2025-05-20',
    updatedAt: '2025-12-27',
    readTime: '8 min read',
    category: 'Guides',
  },
]

// Helper function to format date for display
export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Get recent articles
export function getRecentArticles(count: number = 3): BlogArticle[] {
  return [...BLOG_ARTICLES]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count)
}

// Get featured articles
export function getFeaturedArticles(): BlogArticle[] {
  return BLOG_ARTICLES.filter(article => article.featured)
}

// Get articles by category
export function getArticlesByCategory(category: string): BlogArticle[] {
  return BLOG_ARTICLES.filter(article => article.category === category)
}
