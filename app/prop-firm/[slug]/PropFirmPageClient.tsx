'use client'

import Link from 'next/link'
import { 
  Star, Shield, ExternalLink, ChevronLeft, 
  DollarSign, Globe, Award, CheckCircle, XCircle, Info,
  ThumbsUp, ThumbsDown, Target, AlertTriangle, ArrowRight,
  Users, Zap
} from 'lucide-react'
import { trackAffiliateClick } from '@/lib/affiliate-tracking'
import { generateFirmContent } from '@/lib/generate-firm-content'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url?: string
  website_url?: string
  affiliate_url?: string
  description?: string
  headquarters?: string
  year_founded?: number
  trustpilot_rating?: number
  trustpilot_reviews?: number
  min_price?: number
  max_price?: number
  profit_split?: number
  max_daily_drawdown?: number
  max_total_drawdown?: number
  account_sizes?: number[]
  platforms?: string[]
  instruments?: string[]
  challenge_types?: string[]
  allows_scalping?: boolean
  allows_news_trading?: boolean
  allows_weekend_holding?: boolean
  allows_hedging?: boolean
  allows_ea?: boolean
  is_regulated?: boolean
  has_free_trial?: boolean
  has_free_repeat?: boolean
  payout_frequency?: string
  min_trading_days?: number
  max_trading_days?: number
  profit_target_phase1?: number
  profit_target_phase2?: number
}

interface Props {
  firm: PropFirm
  alternatives?: PropFirm[]
}

// Country to flag mapping
const countryToCode: Record<string, string> = {
  'USA': 'us', 'United States': 'us', 'UK': 'gb', 'United Kingdom': 'gb',
  'Czech Republic': 'cz', 'UAE': 'ae', 'Dubai': 'ae', 'Australia': 'au',
  'Canada': 'ca', 'Germany': 'de', 'France': 'fr', 'Spain': 'es',
  'Netherlands': 'nl', 'Switzerland': 'ch', 'Singapore': 'sg',
  'Hong Kong': 'hk', 'Cyprus': 'cy', 'Malta': 'mt', 'Estonia': 'ee',
  'Poland': 'pl', 'Hungary': 'hu', 'Israel': 'il',
}

const getCountryCode = (country: string | null | undefined): string | null => {
  if (!country) return null
  if (countryToCode[country]) return countryToCode[country]
  for (const [key, code] of Object.entries(countryToCode)) {
    if (country.toLowerCase().includes(key.toLowerCase())) return code
  }
  return null
}

// Platform logos
const platformLogos: Record<string, string> = {
  'MT4': '/platforms/mt4.png',
  'MT5': '/platforms/mt5.png',
  'cTrader': '/platforms/ctrader.png',
  'DXtrade': '/platforms/dxtrade.png',
  'TradeLocker': '/platforms/tradelocker.png',
  'Match-Trader': '/platforms/matchtrader.png',
  'MatchTrader': '/platforms/matchtrader.png',
}

export default function PropFirmPageClient({ firm, alternatives = [] }: Props) {
  const countryCode = getCountryCode(firm.headquarters)
  
  // Générer le contenu automatiquement
  const content = generateFirmContent(firm)

  const handleBuyClick = () => {
    trackAffiliateClick(firm.name, firm.affiliate_url || firm.website_url || '', 'prop-firm-page')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  }

  const formatAccountSize = (size: number) => {
    if (size >= 1000000) return `$${(size / 1000000).toFixed(1)}M`
    if (size >= 1000) return `$${(size / 1000).toFixed(0)}K`
    return `$${size}`
  }

  const riskLevelColors = {
    strict: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    flexible: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }

  const riskLevelLabels = {
    strict: 'Strict Rules',
    medium: 'Balanced',
    flexible: 'Flexible',
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/compare" className="hover:text-white flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back to Compare
          </Link>
          <span>/</span>
          <span className="text-white">{firm.name}</span>
        </div>

        {/* Header */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-3 flex-shrink-0">
              {firm.logo_url ? (
                <img src={firm.logo_url} alt={firm.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-4xl font-bold text-emerald-500">{firm.name.charAt(0)}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{firm.name}</h1>
                
                {/* Risk Level Badge */}
                <span className={`px-3 py-1 text-sm rounded-full border ${riskLevelColors[content.riskLevel]}`}>
                  {riskLevelLabels[content.riskLevel]}
                </span>
                
                {firm.is_regulated && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Regulated
                  </span>
                )}
                {firm.trustpilot_rating && firm.trustpilot_rating >= 4.5 && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full flex items-center gap-1">
                    <Award className="w-4 h-4" /> Top Rated
                  </span>
                )}
              </div>

              {/* Rating & Location */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {firm.trustpilot_rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(firm.trustpilot_rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">{firm.trustpilot_rating}</span>
                    {firm.trustpilot_reviews && (
                      <span className="text-gray-400 text-sm">({firm.trustpilot_reviews.toLocaleString()} reviews)</span>
                    )}
                  </div>
                )}
                {firm.headquarters && (
                  <div className="flex items-center gap-2 text-gray-400">
                    {countryCode && (
                      <img 
                        src={`https://flagcdn.com/24x18/${countryCode}.png`}
                        alt={firm.headquarters}
                        className="rounded-sm"
                      />
                    )}
                    <span>{firm.headquarters}</span>
                  </div>
                )}
                {firm.year_founded && (
                  <span className="text-gray-400">Founded {firm.year_founded}</span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={firm.affiliate_url || firm.website_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleBuyClick}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <DollarSign className="w-5 h-5" />
                  Buy Challenge
                  <ExternalLink className="w-4 h-4" />
                </a>
                {firm.website_url && (
                  <a
                    href={firm.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Verdict Section */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Our Verdict</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {content.verdict}
              </p>
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <ThumbsUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Pros</h3>
                </div>
                <ul className="space-y-3">
                  {content.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <ThumbsDown className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Cons</h3>
                </div>
                <ul className="space-y-3">
                  {content.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For / Avoid If */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Best For */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Best For</h3>
                </div>
                <ul className="space-y-3">
                  {content.bestFor.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid If */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Avoid If</h3>
                </div>
                <ul className="space-y-3">
                  {content.avoidIf.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Key Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Starting From</p>
                  <p className="text-2xl font-bold text-white">{firm.min_price ? formatPrice(firm.min_price) : 'N/A'}</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Profit Split</p>
                  <p className="text-2xl font-bold text-emerald-400">{firm.profit_split || 'N/A'}%</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Daily Drawdown</p>
                  <p className="text-2xl font-bold text-yellow-400">{firm.max_daily_drawdown || 'N/A'}%</p>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-400">{firm.max_total_drawdown || 'N/A'}%</p>
                </div>
              </div>
            </div>

            {/* Account Sizes */}
            {firm.account_sizes && firm.account_sizes.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Account Sizes</h2>
                <div className="flex flex-wrap gap-3">
                  {firm.account_sizes.sort((a, b) => a - b).map((size) => (
                    <div 
                      key={size} 
                      className="px-4 py-2 bg-gray-700/50 text-white rounded-lg font-medium"
                    >
                      {formatAccountSize(size)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenge Types */}
            {firm.challenge_types && firm.challenge_types.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Challenge Types</h2>
                <div className="flex flex-wrap gap-3">
                  {firm.challenge_types.map((type) => (
                    <div key={type} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-medium">
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trading Rules */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Trading Rules</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <RuleItem label="Scalping" allowed={firm.allows_scalping} />
                <RuleItem label="News Trading" allowed={firm.allows_news_trading} />
                <RuleItem label="Weekend Holding" allowed={firm.allows_weekend_holding} />
                <RuleItem label="Hedging" allowed={firm.allows_hedging} />
                <RuleItem label="EA / Bots" allowed={firm.allows_ea} />
                <RuleItem label="Free Retry" allowed={firm.has_free_repeat} />
              </div>
            </div>

            {/* Instruments */}
            {firm.instruments && firm.instruments.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Available Markets</h2>
                <div className="flex flex-wrap gap-2">
                  {firm.instruments.map((instrument) => (
                    <span 
                      key={instrument} 
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Buy Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Start Trading with {firm.name}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Starting from</span>
                  <span className="text-white font-semibold">{firm.min_price ? formatPrice(firm.min_price) : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Profit split</span>
                  <span className="text-emerald-400 font-semibold">{firm.profit_split || 'N/A'}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Max account</span>
                  <span className="text-white font-semibold">
                    {firm.account_sizes && firm.account_sizes.length > 0 
                      ? formatAccountSize(Math.max(...firm.account_sizes))
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payout</span>
                  <span className="text-white font-semibold">{firm.payout_frequency || 'N/A'}</span>
                </div>
              </div>

              <a
                href={firm.affiliate_url || firm.website_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBuyClick}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Buy Challenge
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-xs text-gray-500 text-center mt-3">
                * Affiliate link - we may earn a commission
              </p>
            </div>

            {/* Platforms */}
            {firm.platforms && firm.platforms.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Trading Platforms</h3>
                <div className="flex flex-wrap gap-3">
                  {firm.platforms.map((platform) => {
                    const logoPath = platformLogos[platform]
                    return (
                      <div 
                        key={platform}
                        className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2"
                        title={platform}
                      >
                        {logoPath ? (
                          <img src={logoPath} alt={platform} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-gray-800">{platform.substring(0, 2)}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Additional Info</h3>
              <div className="space-y-3">
                {firm.payout_frequency && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payout Frequency</span>
                    <span className="text-white">{firm.payout_frequency}</span>
                  </div>
                )}
                {firm.min_trading_days && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min Trading Days</span>
                    <span className="text-white">{firm.min_trading_days} days</span>
                  </div>
                )}
                {firm.profit_target_phase1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Phase 1 Target</span>
                    <span className="text-white">{firm.profit_target_phase1}%</span>
                  </div>
                )}
                {firm.profit_target_phase2 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Phase 2 Target</span>
                    <span className="text-white">{firm.profit_target_phase2}%</span>
                  </div>
                )}
                {firm.has_free_trial && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Free Trial</span>
                    <span className="text-emerald-400">Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Useful Links</h3>
              <div className="space-y-2">
                <Link
                  href="/tools/risk-calculator"
                  className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all"
                >
                  <span className="text-gray-300">Risk Calculator</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/tools/rule-tracker"
                  className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all"
                >
                  <span className="text-gray-300">Rule Tracker</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/deals"
                  className="flex items-center justify-between p-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all"
                >
                  <span className="text-gray-300">All Deals & Discounts</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Prop Firms to Consider</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {alternatives.map((alt) => (
                <Link
                  key={alt.id}
                  href={`/prop-firm/${alt.slug}`}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2">
                      {alt.logo_url ? (
                        <img src={alt.logo_url} alt={alt.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-lg font-bold text-emerald-600">{alt.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{alt.name}</h3>
                      {alt.trustpilot_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-400">{alt.trustpilot_rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-gray-500 text-xs">From</p>
                      <p className="text-white font-semibold">${alt.min_price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Split</p>
                      <p className="text-emerald-400 font-semibold">{alt.profit_split}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Max DD</p>
                      <p className="text-white font-semibold">{alt.max_total_drawdown}%</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Trading?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of traders who have started their funded trading journey with {firm.name}.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={firm.affiliate_url || firm.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleBuyClick}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Buy Challenge
            </a>
            <Link
              href="/compare"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
            >
              Compare All Firms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Rule Item Component
function RuleItem({ label, allowed }: { label: string; allowed?: boolean }) {
  if (allowed === undefined || allowed === null) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Info className="w-5 h-5" />
        <span>{label}</span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-2 ${allowed ? 'text-emerald-400' : 'text-red-400'}`}>
      {allowed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span>{label}</span>
    </div>
  )
}
