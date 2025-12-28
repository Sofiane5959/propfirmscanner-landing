'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Shield, AlertTriangle, Search, ChevronDown, ChevronUp,
  Clock, Ban, Zap, Target, TrendingDown, Calendar, Users, Info,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react'

// Hidden rules database for each prop firm
const propFirmRules = [
  {
    slug: 'ftmo',
    name: 'FTMO',
    logo: '/logos/ftmo.png',
    criticalRules: [
      {
        title: 'No Trading 2 Minutes Before/After News',
        description: 'FTMO restricts trading 2 minutes before and after high-impact news events. Trades opened or closed during this window may be flagged.',
        severity: 'high',
        category: 'news',
      },
      {
        title: 'Maximum Position Size Rule',
        description: 'There\'s an unwritten rule about position sizing relative to account size. Consistently maxing out leverage can trigger a review.',
        severity: 'medium',
        category: 'risk',
      },
      {
        title: 'Consistency Rule on Verification',
        description: 'While not explicitly stated, FTMO prefers consistent trading. Making 80%+ of profits in 1-2 trades may delay verification.',
        severity: 'medium',
        category: 'trading',
      },
    ],
    commonMistakes: [
      'Forgetting to check the economic calendar before trading',
      'Not closing trades before swap time if you want to avoid swaps',
      'Trading during low liquidity hours and getting slipped',
      'Overleveraging after a winning streak',
    ],
    tips: [
      'Use the FTMO app to monitor your account in real-time',
      'Set up alerts for news events in your trading platform',
      'Keep a trading journal to show consistent strategy',
      'Don\'t trade more than 3 pairs simultaneously as a beginner',
    ],
  },
  {
    slug: 'fundednext',
    name: 'FundedNext',
    logo: '/logos/fundednext.png',
    criticalRules: [
      {
        title: 'Copy Trading Detection',
        description: 'FundedNext actively monitors for copy trading and account management. Using the same strategy as many other traders can get you flagged.',
        severity: 'high',
        category: 'trading',
      },
      {
        title: '15% Profit Share During Challenge',
        description: 'You can earn 15% of profits during the challenge phase, but only if you don\'t breach. Many traders get aggressive and lose this benefit.',
        severity: 'medium',
        category: 'profit',
      },
      {
        title: 'Stellar 1-Step Has Stricter Limits',
        description: 'The 1-Step challenge has 3% daily DD vs 5% on 2-Step. Many traders don\'t adjust their strategy accordingly.',
        severity: 'high',
        category: 'risk',
      },
    ],
    commonMistakes: [
      'Not adjusting position size for 1-Step vs 2-Step programs',
      'Holding through high-impact news without checking rules',
      'Withdrawing profits before completing minimum trading days',
      'Using public EAs that many other traders use',
    ],
    tips: [
      'Take advantage of the 15% profit share - trade safely during challenge',
      'FundedNext allows news trading - use it strategically',
      'Their customer support is responsive - ask before doing something risky',
      'The Stellar dashboard shows real-time rule compliance',
    ],
  },
  {
    slug: 'my-funded-futures',
    name: 'My Funded Futures',
    logo: '/logos/my-funded-futures.png',
    criticalRules: [
      {
        title: 'EOD Trailing Drawdown',
        description: 'Your drawdown limit trails at END OF DAY, not intraday. This means you can be in profit during the day but still breach if you give it back.',
        severity: 'high',
        category: 'risk',
      },
      {
        title: 'No Positions Over Weekend',
        description: 'All positions must be closed before market close on Friday. Holding through the weekend is an automatic breach.',
        severity: 'high',
        category: 'trading',
      },
      {
        title: 'Consistency Rule 40-50%',
        description: 'No single day can account for more than 40-50% of your total profits (varies by account). Plan your trading days accordingly.',
        severity: 'high',
        category: 'trading',
      },
      {
        title: 'No Trading First 5 Minutes After Open',
        description: 'Some programs restrict trading in the first 5 minutes after market open. Check your specific program rules.',
        severity: 'medium',
        category: 'trading',
      },
    ],
    commonMistakes: [
      'Confusing intraday vs EOD trailing drawdown',
      'Forgetting to close positions before Friday close',
      'Making too much profit in one day (consistency rule violation)',
      'Not understanding when drawdown starts trailing',
    ],
    tips: [
      '100% of first $10K profits are yours - focus on consistency',
      'Set alarms for Friday market close',
      'Spread your profits across multiple days',
      'The EOD trailing means you can take more intraday risk if you lock in profits',
    ],
  },
  {
    slug: 'topstep',
    name: 'Topstep',
    logo: '/logos/topstep.png',
    criticalRules: [
      {
        title: 'Weekly Loss Limit',
        description: 'Topstep has a weekly loss limit in addition to max drawdown. Exceeding this resets your Trading Combine.',
        severity: 'high',
        category: 'risk',
      },
      {
        title: 'Scaling Plan Required',
        description: 'You must follow the scaling plan for position sizes. Taking too large positions early can breach your account.',
        severity: 'high',
        category: 'risk',
      },
      {
        title: 'EOD Trailing After Funded',
        description: 'After getting funded, your drawdown trails at end of day. This is different from the evaluation.',
        severity: 'medium',
        category: 'risk',
      },
    ],
    commonMistakes: [
      'Ignoring the weekly loss limit and focusing only on max DD',
      'Not following the scaling plan for position sizes',
      'Trading during rollover periods',
      'Forgetting that funded accounts have different rules than evaluation',
    ],
    tips: [
      'Use Topstep\'s free monthly reset if you\'re struggling',
      'TopstepTV has free education - use it',
      'Start with minimum position sizes to build consistency',
      '100% of first $10K is yours - don\'t overtrade',
    ],
  },
  {
    slug: 'apex-trader-funding',
    name: 'Apex Trader Funding',
    logo: '/logos/apex.png',
    criticalRules: [
      {
        title: 'Real-Time Trailing Drawdown',
        description: 'Unlike MFF or Topstep, Apex uses REAL-TIME trailing drawdown. Your limit moves up tick by tick as you profit.',
        severity: 'high',
        category: 'risk',
      },
      {
        title: 'Consistency Rule 30%',
        description: 'No single day can be more than 30% of your total profits. This is strictly enforced.',
        severity: 'high',
        category: 'trading',
      },
      {
        title: 'Flattening Your Account',
        description: 'Apex may flatten your positions if you\'re approaching limits. This can happen at the worst time.',
        severity: 'medium',
        category: 'risk',
      },
    ],
    commonMistakes: [
      'Not understanding real-time vs EOD trailing',
      'Having one big winning day that violates consistency rule',
      'Running multiple accounts with correlated trades',
      'Not accounting for commissions in drawdown calculations',
    ],
    tips: [
      '100% of first $25K profits is yours - massive advantage',
      'You can run up to 20 accounts - diversify your risk',
      'Holiday promos often have 80-90% off - wait for them',
      'Their real-time trailing is unforgiving - set tight stops',
    ],
  },
  {
    slug: 'e8-markets',
    name: 'E8 Markets',
    logo: '/logos/e8.png',
    criticalRules: [
      {
        title: 'News Trading Restricted',
        description: 'E8 does not allow trading during high-impact news events. Check their specific news restriction policy.',
        severity: 'high',
        category: 'news',
      },
      {
        title: '35% Best Day Rule (Some Programs)',
        description: 'On certain programs, your best day cannot exceed 35% of total profits. Check your specific program.',
        severity: 'medium',
        category: 'trading',
      },
      {
        title: 'Add-On Features Change Rules',
        description: 'If you purchase add-ons (like no news restriction), make sure they\'re properly applied to your account.',
        severity: 'medium',
        category: 'trading',
      },
    ],
    commonMistakes: [
      'Trading during news without the add-on',
      'Not checking which rules apply to your specific program',
      'Assuming all E8 programs have the same rules',
      'Forgetting to activate purchased add-ons',
    ],
    tips: [
      'E8X dashboard gives real-time rule monitoring',
      'Their add-on system is flexible - customize your experience',
      'No minimum trading days on most programs',
      '100% profit split is achievable through scaling',
    ],
  },
]

// Category icons and colors
const categoryConfig = {
  news: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  risk: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
  trading: { icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  profit: { icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
}

const severityConfig = {
  high: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  medium: { label: 'Important', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low: { label: 'Note', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
}

export default function HiddenRulesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFirm, setExpandedFirm] = useState<string | null>(null)
  
  const filteredFirms = propFirmRules.filter(firm => 
    firm.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Hidden Rules & Traps
              </h1>
              <p className="text-sm text-gray-500">Avoid common mistakes for each prop firm</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-purple-900/50 to-gray-900 border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Why This Matters</h2>
              <p className="text-gray-400">
                Most traders fail prop firm challenges not because of bad trading, but because they violate rules they didn't know existed. 
                This guide reveals the hidden rules, common traps, and insider tips for each prop firm.
              </p>
            </div>
          </div>
        </div>
        
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
        
        {/* Prop Firm Rules */}
        <div className="space-y-4">
          {filteredFirms.map(firm => (
            <div 
              key={firm.slug}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedFirm(expandedFirm === firm.slug ? null : firm.slug)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-700">
                    <span className="text-lg font-bold text-purple-400">{firm.name.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white text-lg">{firm.name}</h3>
                    <p className="text-sm text-gray-500">
                      {firm.criticalRules.length} critical rules • {firm.commonMistakes.length} common mistakes
                    </p>
                  </div>
                </div>
                {expandedFirm === firm.slug ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {/* Content */}
              {expandedFirm === firm.slug && (
                <div className="px-5 pb-5 space-y-6">
                  {/* Critical Rules */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      Critical Rules to Know
                    </h4>
                    <div className="space-y-3">
                      {firm.criticalRules.map((rule, i) => {
                        const severity = severityConfig[rule.severity as keyof typeof severityConfig]
                        const category = categoryConfig[rule.category as keyof typeof categoryConfig]
                        
                        return (
                          <div 
                            key={i}
                            className={`p-4 rounded-xl border ${severity.border} ${severity.bg}`}
                          >
                            <div className="flex items-start gap-3">
                              <category.icon className={`w-5 h-5 ${category.color} flex-shrink-0 mt-0.5`} />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-white">{rule.title}</h5>
                                  <span className={`px-2 py-0.5 rounded text-xs ${severity.bg} ${severity.color}`}>
                                    {severity.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400">{rule.description}</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Common Mistakes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-yellow-400" />
                      Common Mistakes to Avoid
                    </h4>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <ul className="space-y-2">
                        {firm.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="text-red-400 mt-0.5">✗</span>
                            <span className="text-gray-300">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Pro Tips */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Pro Tips
                    </h4>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                      <ul className="space-y-2">
                        {firm.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="text-emerald-400 mt-0.5">✓</span>
                            <span className="text-gray-300">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Link to firm page */}
                  <Link
                    href={`/prop-firm/${firm.slug}`}
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    View full {firm.name} review →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            Want to track your accounts and get alerts before you violate rules?
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors"
          >
            <Shield className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
