'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronDown, HelpCircle, Search, MessageCircle,
  DollarSign, Target, Shield, TrendingDown, Clock
} from 'lucide-react'

// Types
interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon: typeof HelpCircle
  faqs: FAQItem[]
}

// FAQ Data
const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    title: 'General Questions',
    icon: HelpCircle,
    faqs: [
      {
        question: 'What is a prop trading firm?',
        answer: 'A prop trading firm (proprietary trading firm) provides traders with capital to trade in exchange for a share of the profits. Traders typically need to pass an evaluation (challenge) to prove their skills before receiving a funded account.',
      },
      {
        question: 'How does PropFirm Scanner work?',
        answer: 'PropFirm Scanner compares 90+ prop trading firms across key metrics like pricing, rules, profit splits, and Trustpilot ratings. We verify our data weekly and provide tools to help you find the best firm for your trading style.',
      },
      {
        question: 'Is PropFirm Scanner free to use?',
        answer: 'Yes! All our comparison tools, calculators, and guides are completely free. We earn affiliate commissions when you sign up with a prop firm through our links, but this never affects our rankings or recommendations.',
      },
      {
        question: 'How do you make money?',
        answer: 'We earn affiliate commissions from prop firms when traders sign up through our links. This costs you nothing extra – and often, we have exclusive discount codes that save you money. Our reviews are independent and not influenced by affiliate relationships.',
      },
    ],
  },
  {
    id: 'challenges',
    title: 'Prop Firm Challenges',
    icon: Target,
    faqs: [
      {
        question: 'What is a prop firm challenge?',
        answer: 'A challenge is an evaluation phase where you trade on a demo account and must meet specific profit targets while staying within risk limits. Pass the challenge, and you get access to a funded account with real capital.',
      },
      {
        question: 'How long does a challenge take?',
        answer: 'Most challenges have a time limit of 30 days for Phase 1, but many firms now offer unlimited time. Some challenges require minimum trading days (usually 4-10 days) before you can pass.',
      },
      {
        question: 'What happens if I fail a challenge?',
        answer: 'If you violate any rules (like hitting max drawdown), you fail the challenge and lose your fee. Most firms offer discounted retries, and some have free reset options. Always check the specific firm\'s retry policy.',
      },
      {
        question: 'What\'s the difference between 1-step and 2-step challenges?',
        answer: '1-step challenges have only one evaluation phase before funding. 2-step challenges have two phases (often called Phase 1 and Phase 2) with different profit targets. 1-step is faster but often has stricter rules.',
      },
    ],
  },
  {
    id: 'rules',
    title: 'Trading Rules',
    icon: Shield,
    faqs: [
      {
        question: 'What is maximum drawdown?',
        answer: 'Maximum drawdown is the most your account balance can decline from its starting point (or highest point, for trailing). If you exceed this limit, you fail the challenge. Common limits are 8-12% for max drawdown.',
      },
      {
        question: 'What\'s the difference between static and trailing drawdown?',
        answer: 'Static drawdown is calculated from your initial balance and never changes. Trailing drawdown moves up as your equity increases (but never down). Trailing is harder to manage because your "cushion" shrinks as you profit.',
      },
      {
        question: 'Can I trade during news events?',
        answer: 'It depends on the firm. Some allow news trading freely, others restrict it around high-impact events (like NFP or FOMC), and some ban it entirely. Always check the specific rules before trading.',
      },
      {
        question: 'Can I hold trades over the weekend?',
        answer: 'Many firms allow weekend holding, but some don\'t. Weekend holding means keeping positions open from Friday close to Monday open. Check your firm\'s rules, as this is a common reason for challenge failures.',
      },
      {
        question: 'Are EAs and bots allowed?',
        answer: 'Most firms allow EAs (Expert Advisors) and trading bots, but some have restrictions. Copy trading and account management services are often prohibited. High-frequency trading (HFT) may also be restricted.',
      },
    ],
  },
  {
    id: 'payouts',
    title: 'Payouts & Profits',
    icon: DollarSign,
    faqs: [
      {
        question: 'What is profit split?',
        answer: 'Profit split is how profits are divided between you and the prop firm. A typical split is 80/20 (you keep 80%). Some firms offer up to 90% or even 100% profit split, especially as you scale up.',
      },
      {
        question: 'How often can I get paid?',
        answer: 'Payout frequency varies by firm: some offer weekly payouts, others bi-weekly or monthly. Some firms now offer on-demand payouts. Check if there\'s a minimum profit threshold before requesting payouts.',
      },
      {
        question: 'How do prop firms pay me?',
        answer: 'Most firms pay via bank transfer, crypto (usually USDT), PayPal, or Wise. Payment methods and processing times vary by firm. Some firms may have minimum withdrawal amounts.',
      },
      {
        question: 'Do I get my challenge fee back?',
        answer: 'Some firms refund your challenge fee with your first profit withdrawal (called a refundable fee). Others don\'t offer refunds. This can significantly affect the true cost of a challenge.',
      },
    ],
  },
  {
    id: 'choosing',
    title: 'Choosing a Prop Firm',
    icon: TrendingDown,
    faqs: [
      {
        question: 'Which prop firm is best for beginners?',
        answer: 'For beginners, we recommend firms with simpler rules, generous drawdown limits, and good educational resources. Firms like FundedNext, FTMO, or The5%ers are popular choices for new traders.',
      },
      {
        question: 'Which prop firm is best for scalpers?',
        answer: 'Scalpers should look for firms with no time restrictions on trades, tight spreads, and no rules against rapid trading. FTMO, FundedNext, and FXIFY are generally scalper-friendly.',
      },
      {
        question: 'Are there prop firms for futures trading?',
        answer: 'Yes! Apex Trader Funding, Topstep, and Earn2Trade specialize in futures trading. They offer different rules and platforms compared to forex-focused firms.',
      },
      {
        question: 'How do I know if a prop firm is legitimate?',
        answer: 'Check their Trustpilot reviews, see how long they\'ve been operating, look for transparent payout proof, and research their company registration. Our verified data helps identify trustworthy firms.',
      },
    ],
  },
]

export default function FAQPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  // Filter FAQs based on search
  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => 
    !searchQuery || category.faqs.length > 0
  )

  // Get displayed categories
  const displayedCategories = activeCategory
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about prop trading firms and challenges
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {FAQ_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.title}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {displayedCategories.map(category => (
            <div key={category.id}>
              {!activeCategory && (
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <category.icon className="w-5 h-5 text-emerald-400" />
                  {category.title}
                </h2>
              )}
              
              <div className="space-y-2">
                {category.faqs.map((faq, index) => {
                  const itemId = `${category.id}-${index}`
                  const isOpen = openItems.includes(itemId)
                  
                  return (
                    <div
                      key={itemId}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-white font-medium pr-4">{faq.question}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Still have questions?</h2>
          <p className="text-gray-400 mb-6">
            Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
          </p>
          <a
            href="mailto:support@propfirmscanner.org"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Contact Support
          </a>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link
            href="/quick-match"
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 text-center"
          >
            <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium">Quick Match</div>
            <div className="text-gray-400 text-sm">Find your ideal firm</div>
          </Link>
          <Link
            href="/compare"
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 text-center"
          >
            <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium">Compare Firms</div>
            <div className="text-gray-400 text-sm">Side-by-side comparison</div>
          </Link>
          <Link
            href="/guide"
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 text-center"
          >
            <HelpCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium">Free Guide</div>
            <div className="text-gray-400 text-sm">Download our guide</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
