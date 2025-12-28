'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, AlertTriangle, Check, X, Search, ChevronDown, ChevronUp } from 'lucide-react'

// Rules database
const rulesDatabase = [
  {
    slug: 'ftmo',
    name: 'FTMO',
    keyRules: [
      { rule: 'Daily Drawdown', value: '5%', type: 'limit' },
      { rule: 'Max Drawdown', value: '10% (Static)', type: 'limit' },
      { rule: 'Profit Target', value: '10% Phase 1, 5% Phase 2', type: 'target' },
      { rule: 'Min Trading Days', value: '4 days', type: 'requirement' },
      { rule: 'News Trading', value: 'Restricted (2 min buffer)', type: 'warning' },
      { rule: 'Weekend Holding', value: 'Allowed', type: 'allowed' },
    ],
    hiddenRules: [
      'No trading 2 minutes before/after high-impact news events',
      'Consistency rule applies on verification - don\'t make 80%+ profits in 1-2 trades',
      'Maximum position size relative to account is monitored',
      'Swap triple on Wednesdays - plan overnight holds accordingly',
    ],
    commonMistakes: [
      'Trading during NFP/FOMC without checking calendar',
      'Hitting daily DD due to overleveraging after a winning streak',
      'Not closing trades before swap time when avoiding swaps',
      'Making all profits in one big trade during verification',
    ],
    bestFor: ['Consistent traders', 'Those who avoid news', 'Swing traders'],
    avoidIf: ['You\'re a news trader', 'You rely on 1-2 big trades', 'You need instant funding'],
  },
  {
    slug: 'fundednext',
    name: 'FundedNext',
    keyRules: [
      { rule: 'Daily Drawdown', value: '5% (2-Step) / 3% (1-Step)', type: 'limit' },
      { rule: 'Max Drawdown', value: '10% (2-Step) / 6% (1-Step)', type: 'limit' },
      { rule: 'Profit Target', value: '8% Phase 1, 5% Phase 2', type: 'target' },
      { rule: 'Min Trading Days', value: '5 days (2-Step) / 2 days (1-Step)', type: 'requirement' },
      { rule: 'News Trading', value: 'Allowed', type: 'allowed' },
      { rule: 'Weekend Holding', value: 'Allowed', type: 'allowed' },
    ],
    hiddenRules: [
      'Copy trading is actively monitored - using same strategy as many traders can flag your account',
      '15% profit share during challenge - but only if you don\'t breach',
      '1-Step has stricter limits (3% daily vs 5%) - many traders don\'t adjust',
      'Account scaling available on funded accounts with consistent performance',
    ],
    commonMistakes: [
      'Not adjusting position size for 1-Step vs 2-Step programs',
      'Using public EAs that many other traders use',
      'Withdrawing before completing minimum trading days',
      'Ignoring the 15% profit share opportunity during challenge',
    ],
    bestFor: ['News traders', 'EA traders', 'Those who want earnings during challenge'],
    avoidIf: ['You use widely shared EAs', 'You can\'t adjust to different DD limits'],
  },
  {
    slug: 'my-funded-futures',
    name: 'My Funded Futures',
    keyRules: [
      { rule: 'Daily Drawdown', value: 'None', type: 'allowed' },
      { rule: 'Max Drawdown', value: '4-4.5% EOD Trailing', type: 'limit' },
      { rule: 'Profit Target', value: '6-9%', type: 'target' },
      { rule: 'Min Trading Days', value: '2 days', type: 'requirement' },
      { rule: 'News Trading', value: 'Allowed', type: 'allowed' },
      { rule: 'Weekend Holding', value: 'NOT Allowed', type: 'warning' },
    ],
    hiddenRules: [
      'EOD Trailing = drawdown trails at END OF DAY, not intraday',
      'No single day can account for 40-50% of total profits (consistency rule)',
      'No positions before Friday close - automatic breach',
      'First 5 minutes after open may have trading restrictions (check program)',
    ],
    commonMistakes: [
      'Confusing EOD trailing with intraday trailing',
      'Forgetting to close positions before Friday market close',
      'Making too much profit in one day (consistency violation)',
      'Not understanding when the trailing drawdown starts',
    ],
    bestFor: ['Intraday traders', 'Those who want no daily DD limit', 'Consistent traders'],
    avoidIf: ['You hold over weekends', 'You make big % on single days', 'You\'re confused by trailing DD'],
  },
  {
    slug: 'topstep',
    name: 'Topstep',
    keyRules: [
      { rule: 'Daily Drawdown', value: 'None (Weekly limit exists)', type: 'limit' },
      { rule: 'Max Drawdown', value: '3-4.5% EOD Trailing', type: 'limit' },
      { rule: 'Weekly Loss Limit', value: 'Varies by account', type: 'limit' },
      { rule: 'Min Trading Days', value: '5 days', type: 'requirement' },
      { rule: 'News Trading', value: 'Allowed', type: 'allowed' },
      { rule: 'Weekend Holding', value: 'NOT Allowed', type: 'warning' },
    ],
    hiddenRules: [
      'Weekly loss limit resets your Trading Combine if exceeded',
      'Scaling plan must be followed for position sizes',
      'After funded, drawdown becomes EOD trailing (different from eval)',
      'Free monthly reset available if struggling',
    ],
    commonMistakes: [
      'Ignoring the weekly loss limit',
      'Not following the scaling plan for position sizes',
      'Trading during rollover periods',
      'Assuming funded accounts have same rules as evaluation',
    ],
    bestFor: ['Disciplined traders', 'Those who follow scaling plans', 'Consistent performers'],
    avoidIf: ['You ignore position limits', 'You trade emotionally', 'You need weekend holding'],
  },
  {
    slug: 'apex-trader-funding',
    name: 'Apex Trader Funding',
    keyRules: [
      { rule: 'Daily Drawdown', value: 'None', type: 'allowed' },
      { rule: 'Max Drawdown', value: '3-12.5% REAL-TIME Trailing', type: 'limit' },
      { rule: 'Profit Target', value: '4.5-15%', type: 'target' },
      { rule: 'Min Trading Days', value: '7 days', type: 'requirement' },
      { rule: 'News Trading', value: 'Allowed', type: 'allowed' },
      { rule: 'Weekend Holding', value: 'NOT Allowed', type: 'warning' },
    ],
    hiddenRules: [
      'REAL-TIME trailing = drawdown moves tick by tick, not EOD',
      'Consistency rule: no single day > 30% of total profits',
      'Can run up to 20 accounts - diversification possible',
      'Account flattening may occur when approaching limits',
      '100% of first $25K profits is yours - massive advantage',
    ],
    commonMistakes: [
      'Not understanding real-time vs EOD trailing difference',
      'Having one big winning day that violates consistency',
      'Running multiple accounts with correlated trades',
      'Not accounting for commissions in DD calculations',
    ],
    bestFor: ['Those wanting 100% of first profits', 'Multi-account traders', 'Experienced traders'],
    avoidIf: ['You make inconsistent big days', 'Real-time trailing confuses you', 'You hold weekends'],
  },
  {
    slug: 'e8-markets',
    name: 'E8 Markets',
    keyRules: [
      { rule: 'Daily Drawdown', value: '4%', type: 'limit' },
      { rule: 'Max Drawdown', value: '8% Static', type: 'limit' },
      { rule: 'Profit Target', value: '8%', type: 'target' },
      { rule: 'Min Trading Days', value: 'None', type: 'allowed' },
      { rule: 'News Trading', value: 'Restricted (without add-on)', type: 'warning' },
      { rule: 'Weekend Holding', value: 'Allowed', type: 'allowed' },
    ],
    hiddenRules: [
      'News trading restricted unless you purchase the add-on',
      'Best day rule: 35% max on some programs',
      'Add-on features change rules - verify they\'re applied',
      '100% profit split achievable through scaling',
    ],
    commonMistakes: [
      'Trading during news without the add-on purchased',
      'Not checking which rules apply to your specific program',
      'Assuming all E8 programs have identical rules',
      'Forgetting to activate purchased add-ons',
    ],
    bestFor: ['Those who want no min days', 'Weekend holders', 'Traders willing to pay for flexibility'],
    avoidIf: ['You\'re a news trader (without add-on)', 'You need standardized rules'],
  },
]

export default function RulesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFirm, setExpandedFirm] = useState<string | null>(null)
  
  const filteredFirms = rulesDatabase.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Rules & Hidden Risks
              </h1>
              <p className="text-sm text-gray-500">Avoid common mistakes for each prop firm</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prop firms..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        {/* Firms List */}
        <div className="space-y-4">
          {filteredFirms.map(firm => (
            <div 
              key={firm.slug}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
            >
              {/* Firm Header */}
              <button
                onClick={() => setExpandedFirm(expandedFirm === firm.slug ? null : firm.slug)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <span className="font-bold text-purple-400">{firm.name.charAt(0)}</span>
                  </div>
                  <span className="font-semibold text-white">{firm.name}</span>
                </div>
                {expandedFirm === firm.slug ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {/* Expanded Content */}
              {expandedFirm === firm.slug && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Key Rules */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">Key Rules</h3>
                    <div className="bg-gray-900/50 rounded-lg divide-y divide-gray-800">
                      {firm.keyRules.map((item, i) => (
                        <div key={i} className="flex justify-between py-2 px-3 text-sm">
                          <span className="text-gray-400">{item.rule}</span>
                          <span className={
                            item.type === 'warning' ? 'text-yellow-400' :
                            item.type === 'allowed' ? 'text-emerald-400' :
                            'text-white'
                          }>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hidden Rules */}
                  <div>
                    <h3 className="text-sm font-medium text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Hidden Rules / Gotchas
                    </h3>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                      <ul className="space-y-2">
                        {firm.hiddenRules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-yellow-400 mt-0.5">⚠️</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Common Mistakes */}
                  <div>
                    <h3 className="text-sm font-medium text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Common Mistakes
                    </h3>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <ul className="space-y-2">
                        {firm.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-red-400 mt-0.5">✗</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Best For / Avoid If */}
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Best For
                      </h3>
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                        <ul className="space-y-1">
                          {firm.bestFor.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="text-emerald-400">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Avoid If
                      </h3>
                      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                        <ul className="space-y-1">
                          {firm.avoidIf.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="text-red-400">✗</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
