'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, Check, X, ExternalLink, Copy, ChevronRight, Shield, 
  Clock, DollarSign, TrendingUp, Percent, Calendar, Users,
  AlertTriangle, Zap, Award, Globe, CreditCard, ArrowRight,
  CheckCircle, XCircle, Info, Sparkles, BarChart2, Target
} from 'lucide-react'

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  propfirmmatch_rating: number
  min_price: number
  profit_split: number
  max_profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  min_trading_days: number
  time_limit: string
  drawdown_type: string
  payout_frequency: string
  payout_methods: string[]
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  has_free_repeat: boolean
  fee_refund: boolean
  scaling_max: string
  consistency_rule: string
  platforms: string[]
  assets: string[]
  challenge_types: string[]
  special_features: string[]
  trust_status: string
  is_futures: boolean
  discount_code: string
  discount_percent: number
  year_founded: number
  headquarters: string
  leverage_forex: string
  broker_partner: string
}

interface PropFirmPageClientProps {
  firm: PropFirm
  similarFirms?: PropFirm[]
}

// Info Card Component
const InfoCard = ({ 
  icon: Icon, 
  label, 
  value, 
  highlight = false,
  subValue
}: { 
  icon: any
  label: string
  value: string | number
  highlight?: boolean
  subValue?: string
}) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800/50 border-gray-700/50'}`}>
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-emerald-500/20' : 'bg-gray-700'}`}>
        <Icon className={`w-5 h-5 ${highlight ? 'text-emerald-400' : 'text-gray-400'}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-lg font-semibold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
        {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
      </div>
    </div>
  </div>
)

// Rule Item Component
const RuleItem = ({ allowed, label, description }: { allowed: boolean, label: string, description?: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${allowed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
      {allowed ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <X className="w-4 h-4 text-red-400" />
      )}
    </div>
    <div>
      <p className={`font-medium ${allowed ? 'text-white' : 'text-gray-400'}`}>{label}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  </div>
)

// Pros/Cons Component
const ProsCons = ({ pros, cons }: { pros: string[], cons: string[] }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
      <h3 className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
        <CheckCircle className="w-5 h-5" />
        Pros
      </h3>
      <ul className="space-y-3">
        {pros.map((pro, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300">
            <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
            {pro}
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
      <h3 className="flex items-center gap-2 text-red-400 font-semibold mb-4">
        <XCircle className="w-5 h-5" />
        Cons
      </h3>
      <ul className="space-y-3">
        {cons.map((con, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-300">
            <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
            {con}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

// Generate dynamic pros/cons based on firm data
function generateProsCons(firm: PropFirm) {
  const pros: string[] = []
  const cons: string[] = []
  
  // Pros
  if (firm.trustpilot_rating >= 4.5) pros.push(`Excellent rating (${firm.trustpilot_rating}/5 on Trustpilot)`)
  if (firm.max_profit_split >= 90) pros.push(`High profit split up to ${firm.max_profit_split}%`)
  if (firm.min_price <= 50) pros.push(`Very affordable starting at $${firm.min_price}`)
  if (firm.min_trading_days === 0) pros.push('No minimum trading days required')
  if (firm.time_limit === 'Unlimited') pros.push('Unlimited time to pass evaluation')
  if (firm.allows_scalping) pros.push('Scalping allowed')
  if (firm.allows_news_trading) pros.push('News trading allowed')
  if (firm.allows_ea) pros.push('Expert Advisors (EAs) allowed')
  if (firm.has_instant_funding) pros.push('Instant funding option available')
  if (firm.fee_refund) pros.push('Challenge fee refundable')
  if (firm.has_free_repeat) pros.push('Free evaluation reset')
  if (firm.scaling_max && firm.scaling_max.includes('M')) pros.push(`Scale up to ${firm.scaling_max}`)
  if (firm.discount_percent && firm.discount_percent >= 30) pros.push(`${firm.discount_percent}% discount available`)
  if (firm.payout_frequency?.toLowerCase().includes('daily')) pros.push('Daily payout options')
  if (firm.special_features?.some(f => f.toLowerCase().includes('100%'))) pros.push('100% profit split possible')
  
  // Cons
  if (!firm.allows_news_trading) cons.push('News trading restricted')
  if (!firm.allows_weekend_holding) cons.push('Cannot hold trades over weekend')
  if (firm.min_trading_days > 5) cons.push(`Requires minimum ${firm.min_trading_days} trading days`)
  if (firm.consistency_rule && firm.consistency_rule !== 'No') cons.push(`Consistency rule: ${firm.consistency_rule}`)
  if (firm.max_total_drawdown < 8) cons.push(`Tight drawdown limit (${firm.max_total_drawdown}%)`)
  if (firm.profit_target_phase1 >= 10) cons.push(`High profit target (${firm.profit_target_phase1}%)`)
  if (!firm.fee_refund) cons.push('Challenge fee not refundable')
  if (firm.min_price > 300) cons.push(`Higher entry cost ($${firm.min_price}+)`)
  if (firm.drawdown_type === 'Trailing') cons.push('Trailing drawdown (more restrictive)')
  if (!firm.allows_ea) cons.push('Expert Advisors not allowed')
  
  // Ensure we have at least 3 of each
  while (pros.length < 3) pros.push('Multiple challenge options available')
  while (cons.length < 3) cons.push('Market conditions may affect results')
  
  return { pros: pros.slice(0, 5), cons: cons.slice(0, 5) }
}

// Challenge Type Card
const ChallengeCard = ({ type, isMain }: { type: string, isMain: boolean }) => (
  <div className={`p-4 rounded-xl border ${isMain ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800/50 border-gray-700/50'}`}>
    <div className="flex items-center gap-2">
      {isMain && <Sparkles className="w-4 h-4 text-emerald-400" />}
      <span className={isMain ? 'text-emerald-400 font-medium' : 'text-gray-300'}>{type}</span>
    </div>
  </div>
)

export default function PropFirmPageClient({ firm, similarFirms = [] }: PropFirmPageClientProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'pricing'>('overview')
  
  const { pros, cons } = generateProsCons(firm)
  
  const copyDiscountCode = () => {
    if (firm.discount_code) {
      navigator.clipboard.writeText(firm.discount_code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }
  
  // Calculate verdict score
  const verdictScore = Math.round(
    ((firm.trustpilot_rating || 4) / 5 * 30) +
    ((firm.max_profit_split || 80) / 100 * 25) +
    ((100 - (firm.min_price || 100)) / 100 * 15) +
    (firm.allows_scalping ? 10 : 0) +
    (firm.allows_news_trading ? 10 : 0) +
    (firm.has_instant_funding ? 5 : 0) +
    (firm.fee_refund ? 5 : 0)
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-20">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{firm.name}</span>
        </nav>
      </div>
      
      {/* Hero Section */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                {/* Logo */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {firm.logo_url ? (
                    <Image src={firm.logo_url} alt={firm.name} width={96} height={96} className="object-contain" />
                  ) : (
                    <span className="text-3xl font-bold text-emerald-400">{firm.name.charAt(0)}</span>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{firm.name}</h1>
                    {firm.trust_status === 'verified' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
                        <Shield className="w-4 h-4" />
                        Verified
                      </span>
                    )}
                    {firm.is_futures && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full">
                        Futures
                      </span>
                    )}
                  </div>
                  
                  {/* Ratings */}
                  <div className="flex items-center gap-6 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i <= Math.round(firm.trustpilot_rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-white">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-gray-500 text-sm">({firm.trustpilot_reviews || 0} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                    {firm.year_founded && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Founded {firm.year_founded}
                      </span>
                    )}
                    {firm.headquarters && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {firm.headquarters}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Verdict Score */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Our Verdict</h2>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Overall Score</p>
                      <p className="text-2xl font-bold text-emerald-400">{verdictScore}/100</p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      verdictScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                      verdictScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      <Award className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                {/* Score Bars */}
                <div className="space-y-3">
                  {[
                    { label: 'Trust & Reputation', value: Math.round((firm.trustpilot_rating || 4) / 5 * 100) },
                    { label: 'Value for Money', value: Math.min(100, Math.round((500 - (firm.min_price || 100)) / 5)) },
                    { label: 'Trading Flexibility', value: (firm.allows_scalping ? 33 : 0) + (firm.allows_news_trading ? 33 : 0) + (firm.allows_ea ? 34 : 0) },
                    { label: 'Profit Potential', value: firm.max_profit_split || 80 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.value >= 80 ? 'bg-emerald-500' :
                            item.value >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pros & Cons */}
              <ProsCons pros={pros} cons={cons} />
            </div>
            
            {/* Sidebar - CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price Card */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm mb-1">Starting from</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold text-white">${firm.min_price}</span>
                      {firm.discount_percent && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm font-bold rounded">
                          -{firm.discount_percent}%
                        </span>
                      )}
                    </div>
                    <p className="text-emerald-400 mt-2">Up to {firm.max_profit_split}% profit split</p>
                  </div>
                  
                  {/* Discount Code */}
                  {firm.discount_code && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2 text-center">Use discount code:</p>
                      <button
                        onClick={copyDiscountCode}
                        className="w-full py-3 px-4 bg-gray-700 border border-dashed border-gray-500 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                      >
                        <span className="font-mono font-bold text-emerald-400">{firm.discount_code}</span>
                        {copiedCode ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* CTA Buttons */}
                  <a
                    href={firm.affiliate_url || firm.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mb-3"
                  >
                    Visit {firm.name}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  
                  <a
                    href={`https://trustpilot.com/review/${firm.website_url?.replace('https://', '').replace('http://', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Read Reviews
                    <Star className="w-4 h-4" />
                  </a>
                </div>
                
                {/* Key Stats */}
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="font-semibold text-white mb-4">Key Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Drawdown</span>
                      <span className="text-white font-medium">{firm.max_total_drawdown}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Profit Target</span>
                      <span className="text-white font-medium">{firm.profit_target_phase1}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Trading Days</span>
                      <span className="text-white font-medium">{firm.min_trading_days || 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payout</span>
                      <span className="text-white font-medium">{firm.payout_frequency || 'Bi-weekly'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fee Refund</span>
                      <span className={firm.fee_refund ? 'text-emerald-400' : 'text-gray-500'}>
                        {firm.fee_refund ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs Navigation */}
      <section className="px-4 border-b border-gray-800 sticky top-16 bg-gray-900/95 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'rules', label: 'Trading Rules', icon: Shield },
              { id: 'pricing', label: 'Pricing & Payouts', icon: CreditCard },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tab Content */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics Grid */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Key Metrics</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard icon={DollarSign} label="Starting Price" value={`$${firm.min_price}`} />
                  <InfoCard icon={Percent} label="Max Profit Split" value={`${firm.max_profit_split}%`} highlight />
                  <InfoCard icon={Shield} label="Max Drawdown" value={`${firm.max_total_drawdown}%`} subValue={firm.drawdown_type || 'Static'} />
                  <InfoCard icon={Target} label="Profit Target" value={`${firm.profit_target_phase1}%`} subValue="Phase 1" />
                  <InfoCard icon={Clock} label="Min Trading Days" value={firm.min_trading_days || 'None'} />
                  <InfoCard icon={Calendar} label="Time Limit" value={firm.time_limit || 'Unlimited'} />
                  <InfoCard icon={TrendingUp} label="Max Scaling" value={firm.scaling_max || 'N/A'} highlight={firm.scaling_max?.includes('M')} />
                  <InfoCard icon={Zap} label="Leverage" value={firm.leverage_forex || '1:100'} />
                </div>
              </div>
              
              {/* Challenge Types */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Challenge Types</h2>
                <div className="flex flex-wrap gap-3">
                  {firm.challenge_types?.map((type, i) => (
                    <ChallengeCard key={i} type={type} isMain={i === 0} />
                  ))}
                </div>
              </div>
              
              {/* Platforms & Assets */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Platforms</h2>
                  <div className="flex flex-wrap gap-2">
                    {firm.platforms?.map((platform, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg font-medium">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Tradeable Assets</h2>
                  <div className="flex flex-wrap gap-2">
                    {firm.assets?.map((asset, i) => (
                      <span key={i} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg font-medium">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Special Features */}
              {firm.special_features && firm.special_features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Special Features</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {firm.special_features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Trading Rules</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <RuleItem allowed={firm.allows_scalping} label="Scalping" description="Quick in-and-out trades allowed" />
                  <RuleItem allowed={firm.allows_news_trading} label="News Trading" description="Trading during news events" />
                  <RuleItem allowed={firm.allows_ea} label="Expert Advisors" description="Automated trading systems" />
                  <RuleItem allowed={firm.allows_weekend_holding} label="Weekend Holding" description="Keep positions over weekends" />
                  <RuleItem allowed={firm.has_instant_funding} label="Instant Funding" description="Skip evaluation option" />
                  <RuleItem allowed={firm.has_free_repeat} label="Free Reset" description="Free evaluation retry" />
                  <RuleItem allowed={firm.fee_refund} label="Fee Refundable" description="Get challenge fee back" />
                  <RuleItem allowed={!firm.consistency_rule || firm.consistency_rule === 'No'} label="No Consistency Rule" description={firm.consistency_rule && firm.consistency_rule !== 'No' ? `Rule: ${firm.consistency_rule}` : 'No profit cap per day'} />
                </div>
              </div>
              
              {/* Drawdown Details */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Drawdown Rules</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Daily Drawdown</p>
                    <p className="text-2xl font-bold text-white">{firm.max_daily_drawdown || 'N/A'}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Drawdown</p>
                    <p className="text-2xl font-bold text-white">{firm.max_total_drawdown}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Drawdown Type</p>
                    <p className="text-2xl font-bold text-emerald-400">{firm.drawdown_type || 'Static'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Payout Information</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Profit Split</p>
                    <p className="text-2xl font-bold text-emerald-400">{firm.profit_split}-{firm.max_profit_split}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payout Frequency</p>
                    <p className="text-2xl font-bold text-white">{firm.payout_frequency || 'Bi-weekly'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fee Refund</p>
                    <p className="text-2xl font-bold text-white">{firm.fee_refund ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Max Scaling</p>
                    <p className="text-2xl font-bold text-white">{firm.scaling_max || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              {firm.payout_methods && firm.payout_methods.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
                  <div className="flex flex-wrap gap-3">
                    {firm.payout_methods.map((method, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Similar Firms */}
      {similarFirms.length > 0 && (
        <section className="px-4 py-12 bg-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Similar Prop Firms</h2>
              <Link href="/compare" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {similarFirms.slice(0, 3).map(similar => (
                <Link key={similar.id} href={`/prop-firm/${similar.slug}`}>
                  <div className="bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-5 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center">
                        {similar.logo_url ? (
                          <Image src={similar.logo_url} alt="" width={48} height={48} className="object-contain" />
                        ) : (
                          <span className="text-emerald-400 font-bold">{similar.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{similar.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-gray-400">{similar.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">From ${similar.min_price}</span>
                      <span className="text-emerald-400">{similar.max_profit_split}% split</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
