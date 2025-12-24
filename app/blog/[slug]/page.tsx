import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, ArrowRight, Twitter, Facebook, Linkedin } from 'lucide-react'

// Blog posts data - ADD YOUR NEW POSTS HERE
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

## Conclusion

Passing a prop firm challenge is absolutely achievable with the right mindset and approach. Focus on risk management, follow your plan, and be patient.
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

The best prop firm for you depends on your trading style, budget, and goals.
    `,
  },

  'trailing-drawdown-explained': {
    title: 'Trailing Drawdown Explained: Why Most Traders Fail',
    excerpt: 'Understanding trailing drawdown is crucial to passing your prop firm challenge. Learn how it works and how to avoid getting stopped out.',
    category: 'Rules Decoded',
    date: '2025-01-20',
    readTime: '10 min read',
    author: 'PropFirm Scanner Team',
    content: `
## What is Trailing Drawdown?

Trailing drawdown is the #1 reason traders fail prop firm challenges. It's a moving drawdown limit that follows your highest equity point.

## How Trailing Drawdown Works

Let's say you have a $100,000 account with a 5% trailing drawdown ($5,000):

**Starting Point:**
- Balance: $100,000
- Drawdown limit: $95,000

**After Making $2,000:**
- Balance: $102,000
- NEW Drawdown limit: $97,000 (trails up with your profit!)

**The Trap:**
If you then lose $5,500, you're OUT - even though you were in profit!

## Trailing vs Static Drawdown

| Type | How it works | Risk level |
|------|-------------|------------|
| **Static** | Stays at initial balance | Lower risk |
| **Trailing** | Moves with highest equity | Higher risk |
| **Trailing until target** | Stops trailing at certain profit | Medium risk |

## Real Example: How Traders Get Caught

**Day 1:** Start with $100K, make $3,000 → Balance: $103K, Limit: $98K
**Day 2:** Lose $2,000 → Balance: $101K, Limit: $98K (still safe)
**Day 3:** Make $4,000 → Balance: $105K, Limit: $100K
**Day 4:** Big loss of $5,500 → ACCOUNT BLOWN at $99.5K

You were up $5,000 total but still failed because the trailing drawdown caught you!

## How to Protect Yourself

### 1. Know Your Firm's Rules
Some firms use trailing drawdown, some don't. Check before you start:
- **FTMO**: NO trailing drawdown ✅
- **Topstep**: Trailing until profit target reached
- **Some others**: Full trailing (most dangerous)

### 2. Scale Back After Profits
When you're up significantly, reduce your position size. Your drawdown limit is now closer.

### 3. Use Our Risk Calculator
Calculate exactly how much room you have left before hitting your trailing limit.

### 4. Take Profits Early
Don't let winning trades turn into losers. When you're up, that trailing limit moves up too.

## Which Prop Firms Have Trailing Drawdown?

### No Trailing (Safer):
- FTMO
- The5ers
- MyFundedFX

### Trailing Until Target:
- Topstep
- Apex Trader Funding

### Full Trailing (Hardest):
- Some newer firms

## Conclusion

Trailing drawdown is not inherently bad - it just requires a different strategy. Understand the rules, protect your profits, and you'll succeed.
    `,
  },

  'daily-vs-max-drawdown': {
    title: 'Daily Drawdown vs Max Drawdown: What Every Trader Must Know',
    excerpt: 'Learn the critical difference between daily and maximum drawdown limits, and how to avoid breaching either one.',
    category: 'Rules Decoded',
    date: '2025-01-18',
    readTime: '7 min read',
    author: 'PropFirm Scanner Team',
    content: `
## The Two Drawdown Limits

Every prop firm has TWO drawdown limits you must respect:

1. **Daily Drawdown** - Maximum you can lose in ONE day
2. **Max Drawdown** - Maximum you can lose TOTAL

Break either one = instant account termination.

## Daily Drawdown Explained

Daily drawdown resets every day (usually at 5PM EST).

**Example:**
- Account: $100,000
- Daily Drawdown: 5% ($5,000)

You can lose up to $5,000 today. Tomorrow? Fresh $5,000 limit.

### The Trap: Floating P&L Counts!

If you have a trade that's -$4,500 in floating loss, you only have $500 left for the day. Close the trade at -$5,000 or let it float to -$5,001? Either way, you're done.

## Max Drawdown Explained

Max drawdown is your TOTAL loss limit from your starting balance (or highest equity for trailing).

**Example:**
- Account: $100,000
- Max Drawdown: 10% ($10,000)

Lose $10,000 total = account terminated, regardless of how many days it took.

## Key Differences

| | Daily Drawdown | Max Drawdown |
|---|---------------|--------------|
| **Resets** | Every day | Never |
| **Typical limit** | 4-5% | 8-12% |
| **Harder to breach** | Yes (short term) | Yes (long term) |
| **Recovery possible** | Yes, next day | Only by making profit |

## Common Mistakes

### Mistake 1: Ignoring Open Positions
Your floating P&L counts toward drawdown! A trade showing -$4,000 means you've used $4,000 of your daily limit.

### Mistake 2: Trading Near Reset Time
Don't open trades 30 minutes before daily reset. If it goes against you, you might breach daily drawdown.

### Mistake 3: Calculating From Wrong Point
- Daily: Usually from end-of-day balance (not starting balance!)
- Max: Check if it's static or trailing

## How to Stay Safe

### For Daily Drawdown:
- Never risk more than 1% per trade
- Stop trading at 3% daily loss (leave buffer)
- Check your limit BEFORE every trade

### For Max Drawdown:
- Use our Risk Calculator
- Know how many losing trades you can afford
- Scale back when you're down 50% of max

## Prop Firm Comparison

| Firm | Daily DD | Max DD |
|------|----------|--------|
| FTMO | 5% | 10% |
| The5ers | 4% | 6% |
| Topstep | 4.5% | 9% (trailing) |
| Funded Next | 5% | 10% |

## Conclusion

Understanding both drawdown limits is essential for passing your challenge. Use our Risk Calculator to know exactly where you stand at all times.
    `,
  },

  'top-7-reasons-traders-fail': {
    title: 'Top 7 Reasons Traders Fail Prop Firm Challenges (And How to Avoid Them)',
    excerpt: 'Discover the most common mistakes that cause traders to fail their prop firm evaluations and learn how to avoid them.',
    category: 'Failure Analysis',
    date: '2025-01-16',
    readTime: '9 min read',
    author: 'PropFirm Scanner Team',
    content: `
## Why Do So Many Traders Fail?

Studies show that 80-90% of traders fail their prop firm challenges. Here are the top 7 reasons why - and how YOU can be different.

## 1. Overleveraging (The Account Killer)

**The Problem:**
Traders risk too much per trade, hoping to hit the profit target quickly.

**Real Example:**
Risking 5% per trade means just 2 losing trades = 10% loss = challenge failed.

**The Fix:**
- Risk 0.5-1% per trade maximum
- It takes longer but you'll actually pass

## 2. Revenge Trading

**The Problem:**
After a loss, you immediately take another trade to "make it back."

**Real Example:**
Lose $500 → Take bigger position → Lose $1,000 → Take even bigger → Account blown.

**The Fix:**
- Walk away after 2 consecutive losses
- Set a daily loss limit (stop at 2-3%)
- Journal every trade

## 3. Ignoring Daily Drawdown

**The Problem:**
Traders focus on max drawdown and forget about the daily limit.

**Real Example:**
Account at $100K with 5% daily limit. You're down $4,500 with open positions. Market moves against you by 0.5% = account terminated.

**The Fix:**
- Track daily P&L in real-time
- Include floating P&L in calculations
- Stop trading at 3% daily loss

## 4. Trading During News Events

**The Problem:**
Many prop firms restrict trading during high-impact news. Traders ignore this.

**Real Example:**
You hold a trade through NFP, it moves 100 pips against you in seconds. Even if you profit, some firms will terminate you for rule violation.

**The Fix:**
- Check the economic calendar daily
- Close positions before major news
- Know your firm's specific rules

## 5. Rushing to Hit Targets

**The Problem:**
Traders try to pass in 5 days instead of using the full 30 days.

**Real Example:**
You're up 7% in week 1, need 3% more. You take bigger trades to finish fast. Lose 8% in one day.

**The Fix:**
- Use all available time
- Slow down when you're close to the target
- There's no bonus for finishing early

## 6. Not Understanding the Rules

**The Problem:**
Each prop firm has different rules. Traders assume they're all the same.

**Common Confusion:**
- Trailing vs static drawdown
- When daily drawdown resets
- Weekend holding restrictions
- Lot size limits

**The Fix:**
- Read ALL rules before starting
- Take notes
- Ask support if unclear
- Use our comparison tool to understand differences

## 7. Wrong Prop Firm Choice

**The Problem:**
Scalpers join firms that restrict scalping. Swing traders join firms with no weekend holding.

**Real Example:**
You're a news trader who joins a firm that bans news trading. You either break rules or can't use your strategy.

**The Fix:**
- Know your trading style first
- Use our "Best For" filters
- Check rules BEFORE buying

## The Success Formula

Traders who pass their challenges typically:

✅ Risk 0.5-1% per trade
✅ Use all available time
✅ Stop trading after 2% daily loss
✅ Understand ALL rules
✅ Choose the right firm for their style
✅ Keep a trading journal
✅ Stay emotionally detached

## Conclusion

Passing a prop firm challenge isn't about being a great trader - it's about being a disciplined one. Avoid these 7 mistakes and you're already ahead of 80% of participants.
    `,
  },

  'prop-firm-profit-split-trap': {
    title: 'Why "90% Profit Split" Is Often a Trap',
    excerpt: 'High profit splits sound amazing, but there are hidden factors that matter more. Learn what really affects your earnings.',
    category: 'Rules Decoded',
    date: '2025-01-14',
    readTime: '6 min read',
    author: 'PropFirm Scanner Team',
    content: `
## The Profit Split Marketing Trick

"Get 90% profit split!" 
"We offer up to 100% profits!"

Sounds amazing, right? But here's what they're NOT telling you...

## What Actually Matters More Than Profit Split

### 1. Can You Actually PASS the Challenge?

A 90% profit split means nothing if:
- The challenge is nearly impossible to pass
- Drawdown limits are too tight
- Rules are too restrictive

**Math Reality:**
- Firm A: 90% split, 10% of traders pass = 9% of traders earn
- Firm B: 80% split, 30% of traders pass = 24% of traders earn

### 2. Payout Conditions

Some firms with high splits have:
- Minimum profit before payout ($500+)
- Profit consistency rules
- Scaling requirements
- Long payout waiting times

### 3. Hidden Fees

Watch for:
- Monthly fees after passing
- Payout processing fees
- Reset fees
- Data fees

## Real Comparison Example

**Firm A: "90% Profit Split"**
- Challenge fee: $500
- Pass rate: ~10%
- Payout minimum: $500
- Monthly fee: $99
- Payout time: 14 days

**Firm B: "75% Profit Split"**
- Challenge fee: $200
- Pass rate: ~25%
- Payout minimum: $50
- Monthly fee: $0
- Payout time: 3 days

Which is actually better? Firm B might put more money in your pocket.

## What to Look For Instead

### 1. Realistic Drawdown Limits
- 5% daily / 10% max = reasonable
- 3% daily / 6% max = very tight

### 2. Fair Profit Targets
- 8% Phase 1 = achievable
- 12% Phase 1 = difficult

### 3. Payout Speed & Conditions
- Bi-weekly payouts = good
- Monthly with minimums = less good

### 4. Trustpilot Reviews
Real traders share real experiences.

## The Bottom Line

Don't chase the highest profit split. Look at:
1. Can you realistically pass?
2. What are ALL the fees?
3. How fast/easy are payouts?
4. What do real traders say?

A lower profit split with better conditions often means more money in your pocket.
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
    keywords: [
      post.category.toLowerCase(),
      'prop firm',
      'trading',
      'funded trader',
      ...post.title.toLowerCase().split(' ').filter(w => w.length > 4)
    ],
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

  // Convert markdown-like content to HTML
  const formatContent = (content: string) => {
    return content
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-semibold text-white mt-6 mb-3">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n- (.*)/g, '<li class="text-gray-300 ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4">')
      .replace(/\|(.*)\|/g, '<tr><td class="border border-gray-700 px-4 py-2">$1</td></tr>')
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
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.propfirmscanner.org/blog/${params.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.propfirmscanner.org/blog/${params.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://www.propfirmscanner.org/blog/${params.slug}`)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-invert prose-emerald max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Funded?</h2>
            <p className="text-gray-400 mb-6">
              Compare 55+ prop firms and find the perfect one for your trading style.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
              >
                Compare Prop Firms
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/tools/risk-calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
              >
                Try Risk Calculator
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid gap-4">
              {Object.entries(blogPosts)
                .filter(([slug]) => slug !== params.slug)
                .slice(0, 3)
                .map(([slug, relatedPost]) => (
                  <Link
                    key={slug}
                    href={`/blog/${slug}`}
                    className="flex gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex-1">
                      <span className="text-emerald-400 text-xs font-medium">{relatedPost.category}</span>
                      <h4 className="text-white font-semibold mt-1">{relatedPost.title}</h4>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))
              }
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
