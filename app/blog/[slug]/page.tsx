import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, Calendar, ArrowLeft, Tag, ArrowRight } from 'lucide-react'

// Blog posts data
const blogPosts = [
  {
    slug: 'how-to-choose-right-prop-firm',
    title: 'How to Choose the Right Prop Firm for Your Trading Style',
    description: 'With 50+ prop firms available, how do you pick the right one? This guide breaks down the key factors based on your trading style, budget, and goals.',
    date: 'December 25, 2024',
    readTime: '10 min read',
    category: 'Guides',
    featured: true,
    content: `
      <p class="lead">Choosing the wrong prop firm can cost you money, time, and motivation. With over 50 firms competing for your attention, making the right choice is more important than ever.</p>

      <h2>Why Your Choice Matters</h2>
      <p>Not all prop firms are created equal. The "best" firm depends entirely on:</p>
      <ul>
        <li>Your trading style (scalping, day trading, swing trading)</li>
        <li>Your budget</li>
        <li>Your experience level</li>
        <li>The markets you trade</li>
      </ul>

      <h2>Step 1: Define Your Trading Style</h2>
      
      <h3>🏃 Scalpers</h3>
      <p>If you take many quick trades per day, you need:</p>
      <ul>
        <li>✅ Scalping explicitly allowed</li>
        <li>✅ No minimum hold time</li>
        <li>✅ Higher daily drawdown (5%+)</li>
      </ul>
      <p><strong>Best for scalpers:</strong> FTMO, The5ers, MyFundedFX</p>

      <h3>📊 Day Traders</h3>
      <p>If you close all positions daily, look for:</p>
      <ul>
        <li>✅ Reasonable profit targets (8-10%)</li>
        <li>✅ News trading allowed</li>
        <li>✅ Multiple platform options</li>
      </ul>
      <p><strong>Best for day traders:</strong> FTMO, Funded Next, E8 Funding</p>

      <h3>🌙 Swing Traders</h3>
      <p>If you hold positions overnight or over weekends:</p>
      <ul>
        <li>✅ Weekend holding allowed</li>
        <li>✅ No time limits on challenges</li>
        <li>✅ Higher max drawdown (10%+)</li>
      </ul>
      <p><strong>Best for swing traders:</strong> The5ers, True Forex Funds</p>

      <h2>Step 2: Set Your Budget</h2>
      <p>Challenge fees range from $50 to $1,000+. Generally:</p>
      <ul>
        <li><strong>$50-100:</strong> $5K-$10K accounts</li>
        <li><strong>$100-200:</strong> $10K-$25K accounts</li>
        <li><strong>$200-400:</strong> $25K-$50K accounts</li>
        <li><strong>$400+:</strong> $100K+ accounts</li>
      </ul>

      <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">
        <h3 class="text-yellow-400 font-bold mb-2">⚠️ Don't Chase Cheap</h3>
        <p class="text-gray-300">A $30 challenge might seem attractive, but verify the firm is reputable. Sometimes paying more for a trusted firm saves money long-term.</p>
      </div>

      <h2>Step 3: Verify Reputation</h2>
      <p><strong>Green flags:</strong></p>
      <ul>
        <li>✓ Trustpilot 4.5+ with 1000+ reviews</li>
        <li>✓ Clear, transparent rules</li>
        <li>✓ Fast payout history</li>
        <li>✓ 2+ years in business</li>
      </ul>
      <p><strong>Red flags:</strong></p>
      <ul>
        <li>✗ No reviews or mostly negative</li>
        <li>✗ Vague or hidden rules</li>
        <li>✗ Payout complaints</li>
        <li>✗ Unrealistic promises</li>
      </ul>

      <h2>Decision Checklist</h2>
      <ol>
        <li>☐ Does the firm allow my trading style?</li>
        <li>☐ Can I afford the challenge fee?</li>
        <li>☐ Are the rules achievable?</li>
        <li>☐ Is the firm reputable (4.5+ rating)?</li>
        <li>☐ Is the profit split fair (80%+)?</li>
      </ol>

      <h2>Tools to Help</h2>
      <ul>
        <li><a href="/compare" class="text-emerald-400 hover:underline">Compare All Firms</a> - Side-by-side comparison</li>
        <li><a href="/tools/risk-calculator" class="text-emerald-400 hover:underline">Risk Calculator</a> - Calculate safe position sizes</li>
        <li><a href="/deals" class="text-emerald-400 hover:underline">Deals Page</a> - Get discounts</li>
      </ul>
    `
  },
  {
    slug: 'news-trading-rules-explained',
    title: 'News Trading Rules Explained: What Prop Firms Actually Allow',
    description: 'Confused about news trading rules? Learn which prop firms allow news trading, which restrict it, and how to trade news without breaking the rules.',
    date: 'December 25, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    content: `
      <p class="lead">News trading can be incredibly profitable - or incredibly dangerous for your prop firm account. Understanding each firm's rules is crucial.</p>

      <h2>What is News Trading?</h2>
      <p>News trading involves opening or holding positions during high-impact economic events like:</p>
      <ul>
        <li><strong>NFP</strong> - First Friday of each month</li>
        <li><strong>FOMC</strong> - Interest rate decisions</li>
        <li><strong>CPI</strong> - Monthly inflation data</li>
        <li><strong>GDP Reports</strong> - Quarterly growth</li>
      </ul>

      <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 my-8">
        <h3 class="text-yellow-400 font-bold mb-2">⚠️ Why Firms Restrict It</h3>
        <p class="text-gray-300">During news, spreads widen dramatically, slippage increases, and price can gap significantly. It's high risk for both traders and firms.</p>
      </div>

      <h2>Types of Restrictions</h2>
      <h3>1. Full News Trading Allowed ✅</h3>
      <p>FTMO, The5ers, Funded Next - no restrictions</p>

      <h3>2. Restricted Window</h3>
      <p>No NEW trades 2-15 minutes before/after major news. Holding existing positions is usually fine.</p>

      <h3>3. Complete Blackout 🚫</h3>
      <p>All positions must be closed before major events. Strictest approach.</p>

      <h2>Best Practices</h2>
      <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 my-8">
        <ol class="text-gray-300 space-y-2">
          <li><strong>1.</strong> Know your firm's rules before trading</li>
          <li><strong>2.</strong> Use an economic calendar (ForexFactory)</li>
          <li><strong>3.</strong> Set alarms 15 minutes before events</li>
          <li><strong>4.</strong> Reduce position size during volatility</li>
          <li><strong>5.</strong> Trade the reaction, not the event</li>
        </ol>
      </div>

      <h2>If You Break the Rules</h2>
      <ul>
        <li><strong>Warning</strong> - First offense</li>
        <li><strong>Profit removal</strong> - Profits voided</li>
        <li><strong>Account breach</strong> - Disqualification</li>
      </ul>

      <p>If news trading is core to your strategy, choose FTMO or The5ers where it's fully allowed.</p>
    `
  },
  {
    slug: 'consistency-rules-explained',
    title: 'Consistency Rules Explained: The Hidden Rule That Fails Traders',
    description: 'Consistency rules are the most misunderstood prop firm requirement. Learn what they are, which firms have them, and how to pass.',
    date: 'December 25, 2024',
    readTime: '7 min read',
    category: 'Rules Decoded',
    featured: false,
    content: `
      <p class="lead">You hit your profit target. Drawdown is fine. Every rule followed... and you still failed? Welcome to consistency rules.</p>

      <h2>What Are Consistency Rules?</h2>
      <p>They limit how much profit can come from a single day or trade. Example with 30% rule:</p>
      <ul>
        <li>❌ Day 1: +$800, Day 2: +$200 (80% from one day) - FAILS</li>
        <li>✅ Day 1: +$300, Day 2: +$250, Day 3: +$250, Day 4: +$200 - PASSES</li>
      </ul>

      <h2>Which Firms Have Them?</h2>
      <ul>
        <li><strong>No consistency rule:</strong> FTMO, The5ers</li>
        <li><strong>Has consistency rule:</strong> My Forex Funds (30%), Alpha Capital (40%)</li>
      </ul>

      <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 my-8">
        <h3 class="text-emerald-400 font-bold mb-2">💡 Simple Solution</h3>
        <p class="text-gray-300">If consistency rules frustrate you, choose a firm without them. FTMO and The5ers have no consistency requirements.</p>
      </div>

      <h2>How to Pass</h2>
      <ol>
        <li><strong>Plan daily targets:</strong> 10% target with 30% rule = max 3% per day</li>
        <li><strong>Stop when you hit the cap:</strong> Great day at 2.8%? STOP.</li>
        <li><strong>Use smaller positions:</strong> More consistent results</li>
        <li><strong>Track everything:</strong> Use our Rule Tracker</li>
      </ol>

      <h2>Quick Calculator</h2>
      <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-8">
        <p class="text-gray-300"><strong>Target:</strong> $1,000 | <strong>Rule:</strong> 30%</p>
        <p class="text-gray-300 mt-2"><strong>Max/day:</strong> $300 | <strong>Min days:</strong> 4</p>
        <p class="text-gray-300"><strong>Safe target:</strong> $200-250/day</p>
      </div>

      <p>Our recommendation: Start with firms WITHOUT consistency rules, build your track record, then try others if you want.</p>
    `
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge: 10 Proven Strategies',
    description: 'Learn the exact strategies successful traders use to pass prop firm challenges. From risk management to psychology, this guide covers everything.',
    date: 'December 20, 2024',
    readTime: '12 min read',
    category: 'Guides',
    featured: true,
    content: `
      <p class="lead">Passing a prop firm challenge isn't just about being a good trader - it's about being a smart one. Here are 10 proven strategies that will dramatically increase your chances of success.</p>

      <h2>1. Understand the Rules Completely</h2>
      <p>Before placing a single trade, read every rule twice. Pay special attention to:</p>
      <ul>
        <li>Daily drawdown limits (usually 5%)</li>
        <li>Maximum drawdown (usually 10%)</li>
        <li>Profit targets for each phase</li>
        <li>Minimum trading days</li>
        <li>Restricted trading times (news events)</li>
      </ul>

      <h2>2. Risk Only 1-2% Per Trade</h2>
      <p>This is non-negotiable. With a 5% daily drawdown limit:</p>
      <ul>
        <li>1% risk = 5 losing trades before breach</li>
        <li>2% risk = 2-3 losing trades before danger zone</li>
      </ul>
      <p>Conservative risk management is your best friend.</p>

      <h2>3. Focus on Quality Over Quantity</h2>
      <p>You don't need 10 trades per day. Many successful traders pass with just 2-3 high-quality setups daily.</p>

      <h2>4. Trade Your Best Setups Only</h2>
      <p>During the challenge is NOT the time to experiment. Stick to your A+ setups that you've backtested and traded successfully.</p>

      <h2>5. Use a Trading Journal</h2>
      <p>Track every trade with:</p>
      <ul>
        <li>Entry/exit reasons</li>
        <li>Risk/reward ratio</li>
        <li>Emotions during the trade</li>
        <li>What you'd do differently</li>
      </ul>

      <h2>6. Don't Chase the Profit Target</h2>
      <p>If you need 10% and you're at 8%, don't suddenly increase risk. Slow and steady wins the race.</p>

      <h2>7. Take Breaks</h2>
      <p>After a losing trade or a big win, step away. Emotional trading is account-killing trading.</p>

      <h2>8. Trade During Optimal Hours</h2>
      <p>Best times for forex:</p>
      <ul>
        <li>London Open: 3:00-4:00 AM EST</li>
        <li>London/NY Overlap: 8:00-11:00 AM EST</li>
      </ul>

      <h2>9. Have a Daily Loss Limit</h2>
      <p>Set a personal limit below the firm's. If they allow 5%, stop at 3% daily loss.</p>

      <h2>10. Treat Demo Like Real Money</h2>
      <p>The challenge account IS your real money - you paid for it. Trade accordingly.</p>

      <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 my-8">
        <h3 class="text-emerald-400 font-bold mb-2">Pro Tip: Use Our Tools</h3>
        <p class="text-gray-300">Our <a href="/tools/risk-calculator" class="text-emerald-400 hover:underline">Risk Calculator</a> helps you size positions correctly, and our <a href="/tools/rule-tracker" class="text-emerald-400 hover:underline">Rule Tracker</a> keeps you within limits.</p>
      </div>
    `
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms 2025: Complete Ranking & Comparison',
    description: 'Our comprehensive ranking of the best prop trading firms in 2025. Compare fees, profit splits, rules, and find the perfect firm for your trading style.',
    date: 'December 18, 2024',
    readTime: '15 min read',
    category: 'Reviews',
    featured: true,
    content: `
      <p class="lead">With dozens of prop firms competing for your attention, choosing the right one can be overwhelming. Here's our definitive ranking for 2025.</p>

      <h2>Our Top 5 Prop Firms for 2025</h2>

      <h3>1. FTMO - Best Overall</h3>
      <ul>
        <li>⭐ Trustpilot: 4.9/5</li>
        <li>💰 Profit Split: 90%</li>
        <li>📊 Account Sizes: $10K - $200K</li>
        <li>✅ Free retry if you fail by small margin</li>
      </ul>
      <p>FTMO remains the industry leader with the best reputation and most transparent rules.</p>

      <h3>2. The5ers - Best for Beginners</h3>
      <ul>
        <li>⭐ Trustpilot: 4.8/5</li>
        <li>💰 Profit Split: 80%</li>
        <li>📊 Account Sizes: $6K - $250K</li>
        <li>✅ Lower profit targets, scaling plan</li>
      </ul>

      <h3>3. Funded Next - Best Value</h3>
      <ul>
        <li>⭐ Trustpilot: 4.6/5</li>
        <li>💰 Profit Split: 90%</li>
        <li>📊 Account Sizes: $6K - $200K</li>
        <li>✅ Competitive pricing, multiple programs</li>
      </ul>

      <h3>4. E8 Funding - Best Rules</h3>
      <ul>
        <li>⭐ Trustpilot: 4.7/5</li>
        <li>💰 Profit Split: 80%</li>
        <li>📊 Account Sizes: $25K - $250K</li>
        <li>✅ Relaxed trading rules</li>
      </ul>

      <h3>5. MyFundedFX - Most Affordable</h3>
      <ul>
        <li>⭐ Trustpilot: 4.5/5</li>
        <li>💰 Profit Split: 80%</li>
        <li>📊 Account Sizes: $5K - $300K</li>
        <li>✅ Lowest entry prices</li>
      </ul>

      <h2>How We Ranked Them</h2>
      <p>Our ranking considers:</p>
      <ol>
        <li>Trustpilot rating and review volume</li>
        <li>Payout reliability and speed</li>
        <li>Rule fairness and transparency</li>
        <li>Value for money</li>
        <li>Customer support quality</li>
      </ol>

      <p>Use our <a href="/compare" class="text-emerald-400 hover:underline">comparison tool</a> to filter firms by your specific needs.</p>
    `
  },
  {
    slug: 'trailing-drawdown-explained',
    title: 'Trailing Drawdown Explained: Don\'t Let This Rule Catch You Off Guard',
    description: 'Trailing drawdown is one of the most misunderstood prop firm rules. Learn exactly how it works and strategies to manage it effectively.',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    content: `
      <p class="lead">Trailing drawdown has ended more prop firm challenges than any other rule. Here's how to understand and manage it.</p>

      <h2>What is Trailing Drawdown?</h2>
      <p>Unlike static drawdown that's fixed from your starting balance, trailing drawdown follows your highest achieved balance.</p>

      <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-8">
        <h3 class="font-bold text-white mb-3">Example: $100K Account with 5% Trailing DD</h3>
        <ul class="text-gray-300 space-y-2">
          <li>Start: Balance $100K → DD limit $95K</li>
          <li>Profit to $103K → DD limit trails to $97.85K</li>
          <li>Profit to $108K → DD limit trails to $102.6K</li>
        </ul>
        <p class="text-yellow-400 mt-4">⚠️ The drawdown limit ONLY goes up, never down!</p>
      </div>

      <h2>Trailing vs Static Drawdown</h2>
      <ul>
        <li><strong>Static:</strong> Fixed at starting balance - safer, more forgiving</li>
        <li><strong>Trailing:</strong> Follows your peak - requires careful profit management</li>
      </ul>

      <h2>The Danger Zone</h2>
      <p>The most dangerous moment is when you've made good profit. Your trailing DD is now close to your starting balance, meaning any significant loss could breach you.</p>

      <h2>Strategies to Manage Trailing DD</h2>
      <ol>
        <li><strong>Scale out winners:</strong> Take partial profits to lock in gains</li>
        <li><strong>Reduce size after big wins:</strong> Protect your new high water mark</li>
        <li><strong>Know when to stop:</strong> Sometimes the best trade is no trade</li>
        <li><strong>Use our Rule Tracker:</strong> Monitor your real-time buffer</li>
      </ol>

      <h2>Firms Without Trailing DD</h2>
      <p>If trailing drawdown frustrates you, consider firms with static drawdown: FTMO, The5ers, and E8 Funding offer static options.</p>
    `
  },
  {
    slug: 'prop-firm-payout-guide',
    title: 'Prop Firm Payouts: How to Get Paid Fast',
    description: 'Everything you need to know about prop firm payouts. Learn about payout schedules, methods, and how to ensure you get paid quickly.',
    date: 'December 12, 2024',
    readTime: '6 min read',
    category: 'Guides',
    featured: false,
    content: `
      <p class="lead">You passed the challenge, got funded, and made profits. Now how do you get paid?</p>

      <h2>Payout Schedules by Firm</h2>
      <ul>
        <li><strong>FTMO:</strong> Bi-weekly (every 14 days)</li>
        <li><strong>The5ers:</strong> On-demand after first month</li>
        <li><strong>Funded Next:</strong> Weekly or bi-weekly</li>
        <li><strong>E8 Funding:</strong> Bi-weekly</li>
      </ul>

      <h2>Payout Methods</h2>
      <p>Most firms offer:</p>
      <ul>
        <li>Bank Wire Transfer</li>
        <li>Cryptocurrency (Bitcoin, USDT)</li>
        <li>PayPal (limited)</li>
        <li>Payoneer</li>
      </ul>

      <h2>Tips for Fast Payouts</h2>
      <ol>
        <li><strong>Complete verification early</strong> - Don't wait until payout day</li>
        <li><strong>Use crypto</strong> - Often fastest (24-48 hours)</li>
        <li><strong>Check minimum withdrawal</strong> - Usually $50-100</li>
        <li><strong>Request on time</strong> - Most have specific request windows</li>
      </ol>

      <h2>Common Payout Issues</h2>
      <ul>
        <li>Incomplete KYC verification</li>
        <li>Open trades during payout request</li>
        <li>Account under review for rule violations</li>
        <li>Requesting below minimum amount</li>
      </ul>

      <p>Always check your firm's specific payout policy in their terms and conditions.</p>
    `
  },
  {
    slug: 'why-traders-fail-challenges',
    title: 'Why 90% of Traders Fail Prop Firm Challenges (And How to Be Different)',
    description: 'Understand the real reasons most traders fail prop firm challenges and learn concrete strategies to join the successful 10%.',
    date: 'December 10, 2024',
    readTime: '9 min read',
    category: 'Psychology',
    featured: false,
    content: `
      <p class="lead">The statistics are brutal: approximately 90% of traders fail prop firm challenges. But understanding WHY they fail is the first step to succeeding.</p>

      <h2>Top 5 Reasons Traders Fail</h2>

      <h3>1. Over-leveraging (35% of failures)</h3>
      <p>Risking 5-10% per trade to hit targets quickly. One bad trade = account gone.</p>
      <p><strong>Fix:</strong> Never risk more than 1-2% per trade.</p>

      <h3>2. Emotional Trading (25% of failures)</h3>
      <p>Revenge trading after losses, overtrading after wins.</p>
      <p><strong>Fix:</strong> Set a daily loss limit, walk away after hitting it.</p>

      <h3>3. Ignoring Rules (20% of failures)</h3>
      <p>Trading during news when prohibited, exceeding lot limits.</p>
      <p><strong>Fix:</strong> Read rules 3 times before starting. Use our Rule Tracker.</p>

      <h3>4. Impatience (15% of failures)</h3>
      <p>Trying to pass in 3 days when you have 30.</p>
      <p><strong>Fix:</strong> Set a realistic daily target (0.5-1%).</p>

      <h3>5. Wrong Firm Choice (5% of failures)</h3>
      <p>Scalper choosing a firm that bans scalping.</p>
      <p><strong>Fix:</strong> Use our comparison tool to match your style.</p>

      <h2>The 10% Mindset</h2>
      <p>Successful traders:</p>
      <ul>
        <li>Treat the challenge like a marathon, not a sprint</li>
        <li>Have a written trading plan before starting</li>
        <li>Accept that some days will be red</li>
        <li>Focus on the process, not the profit target</li>
      </ul>

      <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 my-8">
        <h3 class="text-emerald-400 font-bold mb-2">Key Insight</h3>
        <p class="text-gray-300">The challenge isn't testing if you can make 10% profit. It's testing if you can do it WITHOUT violating risk rules. That's a completely different skill.</p>
      </div>
    `
  },
  {
    slug: 'scaling-plans-explained',
    title: 'Prop Firm Scaling Plans: How to Grow Your Account',
    description: 'Learn how prop firm scaling plans work and strategies to maximize your funded account growth from $10K to $1M+.',
    date: 'December 8, 2024',
    readTime: '7 min read',
    category: 'Guides',
    featured: false,
    content: `
      <p class="lead">Starting with a $10K account doesn't mean you're stuck there. Most prop firms offer scaling plans to grow your capital.</p>

      <h2>How Scaling Works</h2>
      <p>After proving consistent profitability, firms increase your account size. Typical requirements:</p>
      <ul>
        <li>3-4 months of profitable trading</li>
        <li>No major rule violations</li>
        <li>Minimum profit percentage</li>
      </ul>

      <h2>Scaling Plans by Firm</h2>
      <ul>
        <li><strong>FTMO:</strong> 25% increase every 4 months (up to $2M)</li>
        <li><strong>The5ers:</strong> Double account on profit milestones</li>
        <li><strong>Funded Next:</strong> 40% increase every 3 months</li>
      </ul>

      <h2>Example Growth Path</h2>
      <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6 my-8">
        <p class="text-gray-300">Starting: $100K</p>
        <p class="text-gray-300">Month 4: $125K (25% scale)</p>
        <p class="text-gray-300">Month 8: $156K</p>
        <p class="text-gray-300">Month 12: $195K</p>
        <p class="text-gray-300">Year 2: $400K+</p>
      </div>

      <h2>Tips to Scale Faster</h2>
      <ol>
        <li><strong>Stay consistent:</strong> Steady 3-5% monthly beats volatile 15%</li>
        <li><strong>No violations:</strong> One rule breach can reset your progress</li>
        <li><strong>Compound wisely:</strong> Withdraw some, let some grow</li>
      </ol>

      <p>The path from $10K to $1M is real - it just requires patience and consistency.</p>
    `
  }
]

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  
  if (!post) {
    return { title: 'Article Not Found' }
  }

  return {
    title: `${post.title} | PropFirm Scanner Blog`,
    description: post.description,
    keywords: [post.category, 'prop firm', 'trading', 'forex', post.slug.split('-').join(', ')],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['PropFirm Scanner'],
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/blog/${params.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find(p => p.slug === params.slug)
  
  if (!post) {
    notFound()
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-medium rounded-full">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-400 mb-6">
            {post.description}
          </p>
          
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-emerald-500"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Get Funded?</h2>
          <p className="text-gray-400 mb-6">Compare 55+ prop firms and find the perfect match for your trading style.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/compare" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors">
              Compare Prop Firms
            </Link>
            <Link href="/deals" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors">
              View Deals
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/30 transition-all"
                >
                  <span className="text-xs text-emerald-400 font-medium">{related.category}</span>
                  <h3 className="text-lg font-semibold text-white mt-2 mb-2 line-clamp-2">{related.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
