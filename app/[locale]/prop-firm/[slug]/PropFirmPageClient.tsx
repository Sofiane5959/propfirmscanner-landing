'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  X,
  Globe,
  Calendar,
  MapPin,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Target,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  Award,
  Zap,
  Users,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import ChallengeSelector, { type Challenge } from './ChallengeSelector'

// =============================================================================
// HELPERS
// =============================================================================

// Safely turn a value (string, array, null) into a clean string array.
// Handles DB columns stored as TEXT that the UI treats as arrays.
function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

// =============================================================================
// TYPES
// =============================================================================

interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  description: string
  trustpilot_rating: number
  trustpilot_reviews: number
  min_price: number
  max_price: number
  profit_split: number
  max_profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  min_trading_days: number
  max_trading_days: number
  time_limit: string
  drawdown_type: string
  payout_frequency: string
  payout_speed_days: number
  min_payout: number
  leverage_forex: string
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  has_free_repeat: boolean
  fee_refund: boolean
  scaling_max: string
  consistency_rule: string
  platforms: string[] | string
  assets: string[] | string
  challenge_types: string[] | string
  special_features: string[] | string
  pros: string[]
  cons: string[]
  trust_status: string
  discount_code: string
  discount_percent: number
  year_founded: number
  founded: string
  founded_year: number
  headquarters: string
  country: string
  is_regulated: boolean
  regulation_details: string
  license_url: string
  legal_name: string
  company_name: string
  is_featured: boolean
}

interface SimilarFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  trustpilot_rating: number
  min_price: number
  profit_split: number
}

interface Props {
  firm: PropFirm
  similarFirms: SimilarFirm[]
  challenges?: Challenge[]
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PropFirmPageClient({ firm, similarFirms, challenges = [] }: Props) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${firm.name} - PropFirmScanner`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const logoUrl =
    firm.logo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(firm.name)}&background=10b981&color=fff&size=200`

  const foundedYear = firm.founded_year || firm.year_founded || null
  const foundedText = firm.founded || (foundedYear ? String(foundedYear) : null)

  const pros = Array.isArray(firm.pros) ? firm.pros : []
  const cons = Array.isArray(firm.cons) ? firm.cons : []

  const platforms = toArray(firm.platforms)
  const assets = toArray(firm.assets)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ================================================================ */}
      {/* 1. HERO — Logo, name, rating, trust bar, quick stats           */}
      {/* ================================================================ */}
      <section className="pt-8 pb-10 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Logo */}
            <div className="relative w-24 h-24 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-700 self-start">
              <Image src={logoUrl} alt={firm.name} fill className="object-contain p-3" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{firm.name}</h1>
                    {firm.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-semibold">
                        <Award className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {firm.trustpilot_rating > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${
                              n <= Math.round(firm.trustpilot_rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm">{firm.trustpilot_rating.toFixed(1)}</span>
                      {firm.trustpilot_reviews > 0 && (
                        <span className="text-gray-500 text-sm">({firm.trustpilot_reviews} reviews)</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Save & Share */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFavorite((v) => !v)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isFavorite
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                    }`}
                    aria-label="Save"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                    aria-label="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trust bar — founded, HQ, regulation */}
              <div className="flex items-center gap-4 flex-wrap text-sm text-gray-400 mb-4">
                {foundedText && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Founded {foundedText}
                  </span>
                )}
                {firm.headquarters && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {firm.country || firm.headquarters.split(',')[0]}
                  </span>
                )}
                {firm.is_regulated && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <Shield className="w-4 h-4" />
                    Regulated
                  </span>
                )}
                {firm.website_url && (
                  <a
                    href={firm.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <QuickStat
                  label="Starting From"
                  value={firm.min_price ? `$${firm.min_price}` : '—'}
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <QuickStat
                  label="Profit Split"
                  value={
                    firm.max_profit_split
                      ? `up to ${firm.max_profit_split}%`
                      : firm.profit_split
                      ? `${firm.profit_split}%`
                      : '—'
                  }
                  icon={<TrendingUp className="w-4 h-4" />}
                  highlight
                />
                <QuickStat
                  label="Daily Drawdown"
                  value={firm.max_daily_drawdown ? `${firm.max_daily_drawdown}%` : '—'}
                  icon={<Shield className="w-4 h-4" />}
                />
                <QuickStat
                  label="Scaling"
                  value={firm.scaling_max || '—'}
                  icon={<Award className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. QUICK PITCH — Description + killer stats                    */}
      {/* ================================================================ */}
      {firm.description && (
        <section className="py-10 px-4 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-4">About {firm.name}</h2>
                <p className="text-gray-300 leading-relaxed text-lg">{firm.description}</p>
              </div>

              <div className="space-y-3">
                {firm.is_regulated && firm.regulation_details && (
                  <TrustSignal
                    icon={<Shield className="w-5 h-5" />}
                    title="Regulated"
                    description={firm.regulation_details}
                  />
                )}
                {foundedText && (
                  <TrustSignal
                    icon={<Calendar className="w-5 h-5" />}
                    title="Established"
                    description={`Operating since ${foundedText}`}
                  />
                )}
                {firm.headquarters && (
                  <TrustSignal
                    icon={<MapPin className="w-5 h-5" />}
                    title="Headquarters"
                    description={firm.headquarters}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 3. CHALLENGE SELECTOR — Interactive picker (hidden if no data) */}
      {/* ================================================================ */}
      <ChallengeSelector
        firmSlug={firm.slug}
        firmName={firm.name}
        challenges={challenges}
        discountCode={firm.discount_code}
        discountPercent={firm.discount_percent}
      />

      {/* ================================================================ */}
      {/* 4. WHY CHOOSE — Pros / Cons                                    */}
      {/* ================================================================ */}
      {(pros.length > 0 || cons.length > 0) && (
        <section className="py-12 px-4 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Why Choose {firm.name}?</h2>
            <p className="text-gray-400 mb-8">An honest breakdown from real trader feedback and firm specifications.</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pros */}
              {pros.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <ThumbsUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {cons.length > 0 && (
                <div className="bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <ThumbsDown className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Limitations</h3>
                  </div>
                  <ul className="space-y-3">
                    {cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <X className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 5. TRADING DETAILS — Platforms, Assets, Payouts (compact)      */}
      {/* ================================================================ */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Trading Details</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Platforms */}
            {platforms.length > 0 && (
              <DetailCard icon={<Target className="w-5 h-5" />} title="Trading Platforms">
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <span key={p} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                      {p}
                    </span>
                  ))}
                </div>
              </DetailCard>
            )}

            {/* Assets */}
            {assets.length > 0 && (
              <DetailCard icon={<TrendingUp className="w-5 h-5" />} title="Tradable Assets">
                <div className="flex flex-wrap gap-2">
                  {assets.map((a) => (
                    <span key={a} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                      {a}
                    </span>
                  ))}
                </div>
              </DetailCard>
            )}

            {/* Leverage */}
            {firm.leverage_forex && (
              <DetailCard icon={<TrendingUp className="w-5 h-5" />} title="Leverage (Forex)">
                <p className="text-2xl font-bold text-white">{firm.leverage_forex}</p>
              </DetailCard>
            )}

            {/* Payout Frequency */}
            {firm.payout_frequency && (
              <DetailCard icon={<Clock className="w-5 h-5" />} title="Payout Frequency">
                <p className="text-white">{firm.payout_frequency}</p>
              </DetailCard>
            )}

            {/* Payout Speed */}
            {firm.payout_speed_days !== null && firm.payout_speed_days !== undefined && (
              <DetailCard icon={<Zap className="w-5 h-5" />} title="Payout Speed">
                <p className="text-white">
                  {firm.payout_speed_days === 0
                    ? 'Same-day'
                    : `${firm.payout_speed_days} day${firm.payout_speed_days > 1 ? 's' : ''}`}
                </p>
              </DetailCard>
            )}

            {/* Scaling */}
            {firm.scaling_max && (
              <DetailCard icon={<Award className="w-5 h-5" />} title="Scaling Plan">
                <p className="text-2xl font-bold text-emerald-400">Up to {firm.scaling_max}</p>
              </DetailCard>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. FAQ — SEO long-tail                                         */}
      {/* ================================================================ */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-400 mb-8">Everything traders ask about {firm.name}.</p>

          <div className="space-y-3">
            {generateFAQs(firm).map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. SIMILAR FIRMS                                                */}
      {/* ================================================================ */}
      {similarFirms.length > 0 && (
        <section className="py-12 px-4 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Similar Firms</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarFirms.map((sf) => (
                <Link
                  key={sf.id}
                  href={`/prop-firm/${sf.slug}`}
                  className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-colors"
                >
                  <div className="relative w-10 h-10 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {sf.logo_url ? (
                      <Image src={sf.logo_url} alt={sf.name} fill className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-400 font-bold">
                        {sf.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{sf.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {sf.trustpilot_rating > 0 && (
                        <>
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span>{sf.trustpilot_rating.toFixed(1)}</span>
                        </>
                      )}
                      {sf.min_price && <span>· from ${sf.min_price}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 8. RISK WARNING                                                 */}
      {/* ================================================================ */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-semibold mb-1">Trading Risk Warning</p>
              <p className="text-gray-400 text-sm">
                Trading involves substantial risk. Only trade with capital you can afford to lose. Prop firm challenges
                are simulated trading environments — read all rules carefully before purchasing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function QuickStat({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-gray-900/50 border-gray-800'
      }`}
    >
      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`text-xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function TrustSignal({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-gray-400 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  )
}

function DetailCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3 text-gray-500">
        {icon}
        <p className="text-xs uppercase tracking-wider font-semibold">{title}</p>
      </div>
      {children}
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-800/30 transition-colors"
      >
        <span className="text-white font-medium">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">{answer}</div>
      )}
    </div>
  )
}

// =============================================================================
// FAQ GENERATOR (uses firm data to build contextual questions)
// =============================================================================

function generateFAQs(firm: PropFirm): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []

  // Q1: Legit / regulated
  if (firm.is_regulated) {
    faqs.push({
      question: `Is ${firm.name} legit?`,
      answer: `Yes. ${firm.name} is a legitimate prop trading firm ${
        firm.regulation_details ? firm.regulation_details.toLowerCase().replace(/^regulated by /, 'regulated by ') : 'with an established operating history'
      }.${firm.founded ? ` The company has been operating since ${firm.founded}.` : ''} As with any prop firm, we recommend reviewing their rules carefully before purchasing a challenge.`,
    })
  } else {
    faqs.push({
      question: `Is ${firm.name} legit?`,
      answer: `${firm.name} operates as a proprietary trading firm.${firm.founded ? ` Founded in ${firm.founded},` : ''} it offers simulated trading challenges to select and fund traders. As with any newer prop firm, we recommend reviewing their rules carefully and starting with a small account size.`,
    })
  }

  // Q2: Cost
  if (firm.min_price) {
    faqs.push({
      question: `How much does ${firm.name} cost?`,
      answer: `${firm.name} challenges start at $${firm.min_price}${
        firm.max_price ? ` and go up to $${firm.max_price} for the largest account sizes` : ''
      }. Use our challenge selector above to see the exact price for each combination of program and account size.`,
    })
  }

  // Q3: Profit split
  if (firm.max_profit_split || firm.profit_split) {
    const split = firm.max_profit_split || firm.profit_split
    faqs.push({
      question: `What profit split does ${firm.name} offer?`,
      answer: `${firm.name} offers profit splits up to ${split}%${
        firm.profit_split && firm.max_profit_split && firm.profit_split !== firm.max_profit_split
          ? `, starting at ${firm.profit_split}% and reaching ${firm.max_profit_split}% on their premium programs`
          : ''
      }. The exact split depends on the program you choose — see the details in the challenge selector above.`,
    })
  }

  // Q4: EAs and trading style
  const permissions: string[] = []
  if (firm.allows_scalping) permissions.push('scalping')
  if (firm.allows_news_trading) permissions.push('news trading')
  if (firm.allows_ea) permissions.push('EAs (Expert Advisors)')
  if (firm.allows_weekend_holding) permissions.push('weekend holding')
  if (permissions.length > 0) {
    faqs.push({
      question: `Does ${firm.name} allow EAs and scalping?`,
      answer: `${firm.name} allows ${permissions.join(', ')} on most of their programs. Specific rules may vary by challenge type — always check the exact program details before purchasing.`,
    })
  }

  // Q5: Payouts
  if (firm.payout_frequency) {
    faqs.push({
      question: `How does ${firm.name} handle payouts?`,
      answer: `${firm.name} processes payouts ${firm.payout_frequency.toLowerCase()}${
        firm.payout_speed_days !== null && firm.payout_speed_days !== undefined
          ? `, typically within ${
              firm.payout_speed_days === 0 ? 'the same day' : `${firm.payout_speed_days} business days`
            } of request`
          : ''
      }.${firm.min_payout ? ` Minimum payout amount is $${firm.min_payout}.` : ''}`,
    })
  }

  // Q6: Scaling
  if (firm.scaling_max) {
    faqs.push({
      question: `What is the maximum capital I can manage at ${firm.name}?`,
      answer: `${firm.name} offers a scaling plan that lets qualified traders manage up to ${firm.scaling_max}. Scaling typically requires consistent profitability over several months.`,
    })
  }

  return faqs
}
