'use client'

import { useState } from 'react'
import { BookOpen, Search, ChevronDown } from 'lucide-react'

interface GlossaryTerm {
  term: string
  definition: string
  category: string
  related?: string[]
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  // Basics
  {
    term: 'Prop Firm',
    definition: 'A proprietary trading firm that provides traders with capital to trade in exchange for a share of the profits. Traders typically pass an evaluation before receiving funded accounts.',
    category: 'Basics',
    related: ['Funded Account', 'Challenge'],
  },
  {
    term: 'Challenge',
    definition: 'An evaluation phase where traders must meet specific profit targets while staying within risk limits on a demo account. Passing the challenge grants access to a funded account.',
    category: 'Basics',
    related: ['Evaluation', 'Phase 1', 'Phase 2'],
  },
  {
    term: 'Funded Account',
    definition: 'A trading account with real capital provided by a prop firm after passing their evaluation. Profits are shared between the trader and the firm.',
    category: 'Basics',
  },
  {
    term: 'Profit Split',
    definition: 'The percentage of profits that the trader keeps. Common splits are 80/20 (trader keeps 80%) or 90/10. Some firms offer up to 100% profit split.',
    category: 'Basics',
    related: ['Scaling Plan'],
  },
  
  // Drawdown
  {
    term: 'Maximum Drawdown',
    definition: 'The maximum amount your account balance can decline before failing the challenge. Typically 8-12% of the initial balance.',
    category: 'Drawdown',
    related: ['Daily Drawdown', 'Static Drawdown', 'Trailing Drawdown'],
  },
  {
    term: 'Daily Drawdown',
    definition: 'The maximum loss allowed in a single trading day, usually 4-5% of the account balance. Resets each day at a specific time.',
    category: 'Drawdown',
  },
  {
    term: 'Static Drawdown',
    definition: 'A drawdown limit calculated from the initial account balance that never changes. Easier to manage than trailing drawdown.',
    category: 'Drawdown',
    related: ['Trailing Drawdown'],
  },
  {
    term: 'Trailing Drawdown',
    definition: 'A drawdown limit that moves up as your equity increases but never moves down. More challenging to manage as your "cushion" shrinks with profits.',
    category: 'Drawdown',
    related: ['Static Drawdown', 'High Water Mark'],
  },
  {
    term: 'High Water Mark',
    definition: 'The highest balance your account has reached. Used to calculate trailing drawdown limits.',
    category: 'Drawdown',
  },
  {
    term: 'EOD Trailing',
    definition: 'End-of-Day Trailing - a trailing drawdown that only updates at the end of each trading day rather than in real-time.',
    category: 'Drawdown',
  },
  
  // Rules
  {
    term: 'Profit Target',
    definition: 'The percentage gain required to pass a challenge phase. Typically 8-10% for Phase 1 and 5% for Phase 2.',
    category: 'Rules',
  },
  {
    term: 'Minimum Trading Days',
    definition: 'The minimum number of days you must trade before passing a challenge. Usually 4-10 days.',
    category: 'Rules',
  },
  {
    term: 'News Trading',
    definition: 'Trading during high-impact economic news releases. Some firms prohibit or restrict this due to high volatility.',
    category: 'Rules',
  },
  {
    term: 'Weekend Holding',
    definition: 'Keeping positions open over the weekend. Some firms prohibit this to avoid gap risk.',
    category: 'Rules',
  },
  {
    term: 'EA Trading',
    definition: 'Using Expert Advisors (automated trading bots). Most firms allow EAs but some have restrictions.',
    category: 'Rules',
    related: ['Copy Trading', 'HFT'],
  },
  {
    term: 'Consistency Rule',
    definition: 'A rule requiring that no single trading day accounts for more than a certain percentage of total profits (usually 30-40%).',
    category: 'Rules',
  },
  {
    term: 'Lot Size Consistency',
    definition: 'A rule requiring similar position sizes across trades to prevent gambling behavior.',
    category: 'Rules',
  },
  
  // Accounts
  {
    term: 'Scaling Plan',
    definition: 'A program where your account size increases after meeting certain profit targets, often 25% increase every 10% profit.',
    category: 'Accounts',
    related: ['Profit Split'],
  },
  {
    term: 'Instant Funding',
    definition: 'A type of account that skips the evaluation phase and provides immediate access to a funded account, usually with stricter rules.',
    category: 'Accounts',
  },
  {
    term: 'One-Step Challenge',
    definition: 'An evaluation with only one phase before funding, typically with higher profit targets.',
    category: 'Accounts',
    related: ['Two-Step Challenge'],
  },
  {
    term: 'Two-Step Challenge',
    definition: 'An evaluation with two phases (Phase 1 and Phase 2) before funding, with different profit targets for each.',
    category: 'Accounts',
    related: ['One-Step Challenge'],
  },
  
  // Payouts
  {
    term: 'Payout',
    definition: 'The process of withdrawing your share of profits from a funded account.',
    category: 'Payouts',
  },
  {
    term: 'Payout Cycle',
    definition: 'How often you can request withdrawals - weekly, bi-weekly, or monthly depending on the firm.',
    category: 'Payouts',
  },
  {
    term: 'First Payout',
    definition: 'The initial withdrawal from a funded account, often subject to specific rules like minimum profit or time requirements.',
    category: 'Payouts',
  },
  
  // Trading
  {
    term: 'Leverage',
    definition: 'The ratio of trading capital to margin required. Higher leverage (e.g., 1:100) allows larger positions but increases risk.',
    category: 'Trading',
  },
  {
    term: 'Pip',
    definition: 'The smallest price move in forex trading, typically the fourth decimal place (0.0001) for most pairs.',
    category: 'Trading',
  },
  {
    term: 'Lot Size',
    definition: 'The standardized unit of trading. A standard lot is 100,000 units of base currency. Mini lot = 10,000, Micro lot = 1,000.',
    category: 'Trading',
  },
  {
    term: 'Spread',
    definition: 'The difference between the bid and ask price of an instrument. Lower spreads mean lower trading costs.',
    category: 'Trading',
  },
  {
    term: 'Slippage',
    definition: 'The difference between expected trade price and actual execution price, often occurring during high volatility.',
    category: 'Trading',
  },
]

const CATEGORIES = ['All', 'Basics', 'Drawdown', 'Rules', 'Accounts', 'Payouts', 'Trading']

export default function GlossaryPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedTerms, setExpandedTerms] = useState<string[]>([])

  const toggleTerm = (term: string) => {
    setExpandedTerms(prev =>
      prev.includes(term)
        ? prev.filter(t => t !== term)
        : [...prev, term]
    )
  }

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const matchesSearch = 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || term.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Group by first letter for alphabetical navigation
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const letter = term.term[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {} as Record<string, GlossaryTerm[]>)

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Prop Trading Glossary</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn the terminology used in prop trading and funded accounts
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-400 mb-6">
          Showing {filteredTerms.length} terms
        </p>

        {/* Terms */}
        <div className="space-y-3">
          {Object.entries(groupedTerms)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, terms]) => (
              <div key={letter}>
                <div className="sticky top-20 bg-gray-900 py-2 z-10">
                  <span className="text-emerald-400 font-bold text-lg">{letter}</span>
                </div>
                <div className="space-y-2">
                  {terms.map((term) => (
                    <div
                      key={term.term}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleTerm(term.term)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-white font-semibold">{term.term}</span>
                          <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                            {term.category}
                          </span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedTerms.includes(term.term) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {expandedTerms.includes(term.term) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-300 leading-relaxed">{term.definition}</p>
                          {term.related && term.related.length > 0 && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-gray-500 text-sm">Related:</span>
                              {term.related.map((related) => (
                                <button
                                  key={related}
                                  onClick={() => {
                                    setSearchQuery(related)
                                    setActiveCategory('All')
                                  }}
                                  className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded hover:bg-emerald-500/20"
                                >
                                  {related}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* No Results */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No terms found</h3>
            <p className="text-gray-400">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
