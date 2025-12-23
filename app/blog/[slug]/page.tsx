import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Twitter, Facebook, Linkedin } from 'lucide-react'

// Blog posts data (you can move this to a CMS or database later)
const blogPosts: Record<string, {
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  author: string
}> = {
  'how-to-pass-prop-firm-challenge': {
    title: 'How to Pass Your Prop Firm Challenge on the First Try',
    excerpt: 'Learn the proven strategies and risk management techniques that successful funded traders use to pass their prop firm evaluations.',
    category: 'Guides',
    date: '2025-01-15',
    readTime: '8 min read',
    author: 'PropFirm Scanner Team',
    content: `
## Introduction

Passing a prop firm challenge can seem daunting, but with the right approach, you can significantly increase your chances of success. In this comprehensive guide, we'll share the exact strategies that successful funded traders use.

## 1. Understand the Rules Inside Out

Before you place a single trade, make sure you fully understand:

- **Profit target**: Usually 8-10% for Phase 1
- **Daily drawdown limit**: Typically 4-5%
- **Maximum drawdown**: Usually 8-12%
- **Minimum trading days**: Often 4-10 days
- **Restricted trading times**: News events, weekends, etc.

## 2. Risk Management is Everything

The #1 reason traders fail is poor risk management. Follow these rules:

- **Never risk more than 1-2% per trade**
- **Use stop losses on every trade**
- **Don't chase losses**
- **Take profits when you have them**

### The 1% Rule

If you have a $100,000 account with a 10% profit target, you need to make $10,000. Risking 1% per trade ($1,000) means you need 10 winning trades at 1:1 risk/reward, or just 5 trades at 2:1.

## 3. Trade Your Strategy, Not Your Emotions

Stick to your trading plan no matter what. Don't:

- Increase position size after losses
- Trade out of boredom
- Revenge trade
- Overtrade to hit targets faster

## 4. Start Slow

You have time. Most challenges give you 30+ days. There's no prize for finishing early.

- Week 1: Trade small, get comfortable
- Week 2-3: Gradually increase size
- Week 4: Push for target if needed

## 5. Choose the Right Prop Firm

Not all prop firms are created equal. Consider:

- **Rules that match your style**: Scalper? Make sure scalping is allowed.
- **Reasonable drawdown limits**: 5% daily is better than 4%
- **Fair profit targets**: 8% is easier than 10%
- **Good reviews**: Check Trustpilot ratings

[Compare all prop firms here](/compare)

## Conclusion

Passing a prop firm challenge is absolutely achievable with the right mindset and approach. Focus on risk management, follow your plan, and be patient. Good luck!

---

*Need help choosing the right prop firm? [Compare 55+ firms](/compare) on PropFirm Scanner.*
    `,
  },
  'best-prop-firms-2025': {
    title: 'Best Prop Firms in 2025: Complete Ranking',
    excerpt: 'Our comprehensive ranking of the top prop trading firms based on profit splits, rules, pricing, and trader reviews.',
    category: 'Reviews',
    date: '2025-01-10',
    readTime: '12 min read',
    author: 'PropFirm Scanner Team',
    content: `
## Best Prop Firms in 2025

After analyzing 55+ prop trading firms, here are our top picks for 2025.

## Our Ranking Criteria

We evaluate prop firms based on:

1. **Profit Split** (25%): Higher is better
2. **Trustpilot Rating** (25%): Real trader reviews
3. **Trading Rules** (20%): Flexibility matters
4. **Pricing** (15%): Value for money
5. **Payout Speed** (15%): How fast you get paid

## Top 5 Prop Firms for 2025

### 1. FTMO
- Profit Split: 90%
- Trustpilot: 4.9/5
- Min Price: $155
- Best for: All-around excellence

### 2. The5ers
- Profit Split: 100%
- Trustpilot: 4.8/5
- Min Price: $95
- Best for: Highest profit split

### 3. Topstep
- Profit Split: 90%
- Trustpilot: 4.6/5
- Min Price: $165
- Best for: Futures trading

### 4. Funded Next
- Profit Split: 95%
- Trustpilot: 4.7/5
- Min Price: $99
- Best for: Aggressive traders

### 5. MyFundedFX
- Profit Split: 85%
- Trustpilot: 4.5/5
- Min Price: $49
- Best for: Budget-friendly option

## Conclusion

The best prop firm for you depends on your trading style, budget, and goals. Use our [comparison tool](/compare) to find your perfect match.
    `,
  },
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug]
  if (!post) return { title: 'Article Not Found' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: `https://www.propfirmscanner.org/blog/${params.slug}`,
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/blog/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts[params.slug]
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-emerald-400 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PropFirm Scanner',
      url: 'https://www.propfirmscanner.org',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <div className="min-h-screen bg-gray-900 pt-20 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-400 mb-6">{post.excerpt}</p>
            
            <div className="flex items-center justify-between border-t border-b border-gray-700 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="text-white font-medium">{post.author}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm mr-2">Share:</span>
                <a href="#" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-invert prose-emerald max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-300
              prose-strong:text-white
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-emerald-500 prose-blockquote:bg-gray-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
              prose-hr:border-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>').replace(/## /g, '</p><h2>').replace(/### /g, '</p><h3>').replace(/<br><br>/g, '</p><p>') }}
          />

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Funded?</h2>
            <p className="text-gray-400 mb-6">
              Compare 55+ prop firms and find the perfect one for your trading style.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              Compare Prop Firms
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}
