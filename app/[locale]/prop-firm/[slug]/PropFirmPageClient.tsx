'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ExternalLink,
  Check,
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
  ThumbsUp,
  ThumbsDown,
  Receipt,
  RotateCcw,
  Wallet,
  Layers,
  List,
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

// Payout speed: prefer an explicit label ("1 hour") when the DB has one,
// otherwise fall back to the numeric day count.
function formatPayoutSpeed(firm: PropFirm): string | null {
  if (firm.payout_speed_label) return firm.payout_speed_label
  const d = firm.payout_speed_days
  if (d === null || d === undefined) return null
  if (d === 0) return 'Same day'
  return `${d} day${d > 1 ? 's' : ''}`
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

  // --- Platform availability flags ---------------------------------------
  platforms_list?: string[] | string | null
  checkout_options?: {
    label?: string
    param?: string
    help?: string
    options?: { value: string; name: string; sub?: string }[]
  } | null
  progression_tiers?: {
    title?: string
    intro?: string
    columns?: string[]
    rows?: string[][]
    note?: string
  } | null
  has_mt4?: boolean | null
  has_mt5?: boolean | null
  has_ctrader?: boolean | null
  has_dxtrade?: boolean | null
  has_tradelocker?: boolean | null
  has_match_trader?: boolean | null
  has_tradingview?: boolean | null

  // --- Added: cost & policy detail columns -------------------------------
  commissions?: string | null
  reset_fee?: string | null
  swap_free?: string | null
  refund_policy?: string | null
  max_allocation?: string | null
  payout_methods?: string[] | string | null
  // Optional override so "1 hour" can beat "1 day". Add the column when ready.
  payout_speed_label?: string | null
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

  const logoUrl = firm.logo_url || null

  const foundedYear = firm.founded_year || firm.year_founded || null
  const foundedText = firm.founded || (foundedYear ? String(foundedYear) : null)

  const pros = Array.isArray(firm.pros) ? firm.pros : []
  const cons = Array.isArray(firm.cons) ? firm.cons : []

  // Platforms come from the boolean flags first — the `platforms` TEXT column
  // is typed as text but consumed as an array elsewhere in the app, so filling
  // it breaks /compare. The flags are safe and work for every firm.
  const platformFlags: [keyof PropFirm, string][] = [
    ['has_mt4', 'MT4'],
    ['has_mt5', 'MT5'],
    ['has_ctrader', 'cTrader'],
    ['has_dxtrade', 'DXTrade'],
    ['has_tradelocker', 'TradeLocker'],
    ['has_match_trader', 'Match-Trader'],
    ['has_tradingview', 'TradingView'],
  ]
  const fromFlags = platformFlags.filter(([k]) => firm[k] === true).map(([, label]) => label)
  // platforms_list is the properly-typed array column and wins when populated —
  // it covers futures platforms (NinjaTrader, Rithmic…) that have no boolean flag.
  const platforms =
    toArray(firm.platforms_list).length > 0
      ? toArray(firm.platforms_list)
      : fromFlags.length > 0
      ? fromFlags
      : toArray(firm.platforms)

  // Subscription firms (futures evaluations) bill monthly rather than once.
  const isSubscription = challenges.some(
    (c) => (c as { billing_period?: string }).billing_period === 'monthly'
  )
  const priceSuffix = isSubscription ? '/mo' : ''
  const assets = toArray(firm.assets)
  const payoutMethods = toArray(firm.payout_methods)

  // Only surface a discount when a real code exists. Without one, the visitor
  // would click through and pay full price with nothing tracked.
  const hasVerifiedDeal = Boolean(firm.discount_code && firm.discount_percent)
  const dealUrl = firm.affiliate_url || firm.website_url || '#'

  const payoutSpeed = formatPayoutSpeed(firm)

  // Dense label/value specs — only genuinely firm-wide facts belong here.
  // Anything that varies by program (permissions, drawdown, min trading days,
  // payout frequency) is shown per-challenge in ChallengeSelector instead.
  const specs: { label: string; value: string }[] = []
  if (firm.leverage_forex) specs.push({ label: 'Leverage (forex)', value: firm.leverage_forex })
  if (payoutSpeed) specs.push({ label: 'Payout speed', value: payoutSpeed })
  if (firm.min_payout) specs.push({ label: 'Minimum payout', value: `$${firm.min_payout}` })
  if (firm.scaling_max) specs.push({ label: 'Scaling plan', value: `Up to ${firm.scaling_max}` })
  if (firm.max_allocation) specs.push({ label: 'Max allocation', value: firm.max_allocation })
  if (firm.drawdown_type) specs.push({ label: 'Drawdown type', value: firm.drawdown_type })
  if (firm.consistency_rule) specs.push({ label: 'Consistency rule', value: firm.consistency_rule })
  if (firm.time_limit) specs.push({ label: 'Time limit', value: firm.time_limit })
  if (payoutMethods.length > 0) specs.push({ label: 'Payout methods', value: payoutMethods.join(', ') })

  // Split into two independent columns so each owns its own dividers. A single
  // grid with a border per cell goes ragged as soon as one value wraps.
  const specsLeft = specs.slice(0, Math.ceil(specs.length / 2))
  const specsRight = specs.slice(Math.ceil(specs.length / 2))

  // Long-form policy cards — only these get a full card.
  const policies: { icon: React.ReactNode; title: string; body: string }[] = []
  if (firm.commissions) {
    policies.push({ icon: <Receipt className="w-5 h-5" />, title: 'Commissions', body: firm.commissions })
  }
  if (firm.refund_policy) {
    policies.push({ icon: <Wallet className="w-5 h-5" />, title: 'Refund policy', body: firm.refund_policy })
  }
  if (firm.reset_fee) {
    policies.push({ icon: <RotateCcw className="w-5 h-5" />, title: 'Reset fee', body: firm.reset_fee })
  }
  if (firm.swap_free) {
    policies.push({ icon: <Layers className="w-5 h-5" />, title: 'Swap-free option', body: firm.swap_free })
  }

  const tiers = firm.progression_tiers || null
  const hasTiers = Boolean(tiers && tiers.rows && tiers.rows.length > 0)

  const hasRulesSection = specs.length > 0 || policies.length > 0 || platforms.length > 0 || assets.length > 0

  // Table of contents — only lists sections that actually render.
  const toc: { id: string; label: string }[] = []
  if (firm.description) toc.push({ id: 'about', label: `About ${firm.name}` })
  if (challenges.length > 0) toc.push({ id: 'challenges', label: 'Choose your plan' })
  if (pros.length > 0 || cons.length > 0) toc.push({ id: 'pros-cons', label: 'Strengths & limits' })
  if (hasRulesSection) toc.push({ id: 'rules', label: 'Rules & costs' })
  if (hasTiers) toc.push({ id: 'progression', label: 'Scaling plan' })
  toc.push({ id: 'faq', label: 'FAQ' })

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ================================================================ */}
      {/* 1. HERO — Logo, name, rating, trust bar, quick stats            */}
      {/* ================================================================ */}
      <section className="pt-6 pb-7 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Logo */}
            <div className="relative w-20 h-20 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-700 self-start">
              {logoUrl ? (
                <Image src={logoUrl} alt={firm.name} fill className="object-contain p-3" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-3xl font-bold">
                  {firm.name.charAt(0).toUpperCase()}
                </div>
              )}
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
                        <span className="text-gray-500 text-sm">
                          ({firm.trustpilot_reviews.toLocaleString()} reviews on Trustpilot)
                        </span>
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

              {/* Live offer — the discount is the reason most visitors are here */}
              {hasVerifiedDeal && (
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-semibold">
                    {firm.discount_percent}% off with code {firm.discount_code}
                  </span>
                </div>
              )}

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
                  value={firm.min_price ? `$${firm.min_price}${priceSuffix}` : '—'}
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
                  label="Payout Speed"
                  value={payoutSpeed || '—'}
                  icon={<Zap className="w-4 h-4" />}
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
      {/* 2. TWO-COLUMN BODY — starts immediately so the offer card and    */}
      {/*    the buy button are on screen from the first scroll position.  */}
      {/* ================================================================ */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ---------------------------------------------------------- */}
          {/* MAIN COLUMN                                                */}
          {/* ---------------------------------------------------------- */}
          <main className="min-w-0 space-y-14">
            {/* --- About ------------------------------------------------ */}
            {firm.description && (
              <section id="about" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-white mb-4">About {firm.name}</h2>
                <p className="text-gray-300 leading-relaxed">{firm.description}</p>
              </section>
            )}

            {/* --- Configurator — right after the description, so the visitor
                    knows what the firm is before being asked to choose. --- */}
            {challenges.length > 0 && (
              <div id="challenges" className="scroll-mt-24 -mx-4 sm:mx-0">
                <ChallengeSelector
                  firmSlug={firm.slug}
                  firmName={firm.name}
                  challenges={challenges}
                  checkoutOptions={firm.checkout_options}
                  discountCode={firm.discount_code}
                  discountPercent={firm.discount_percent}
                />
              </div>
            )}

            {/* --- Strengths & limitations ------------------------------ */}
            {(pros.length > 0 || cons.length > 0) && (
              <section id="pros-cons" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Why choose {firm.name}?</h2>
                <p className="text-gray-400 mb-6">
                  An honest breakdown from trader feedback and firm specifications.
                </p>

                <div className="grid md:grid-cols-2 gap-5">
                  {pros.length > 0 && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                          <ThumbsUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h3 className="font-semibold text-white">Strengths</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cons.length > 0 && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-red-500/10 rounded-lg">
                          <ThumbsDown className="w-4 h-4 text-red-400" />
                        </div>
                        <h3 className="font-semibold text-white">Limitations</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                            <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* --- Rules & costs ---------------------------------------- */}
            {hasRulesSection && (
              <section id="rules" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Rules & costs</h2>
                <p className="text-gray-400 mb-6">
                  These apply across the firm. Drawdown, leverage, permissions and payout terms
                  vary by program — pick one in the configurator above to see its exact rules.
                </p>

                {/* Dense spec grid — two independent columns, each with its own
                    dividers so a wrapping value never misaligns the other side. */}
                {specs.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-x-8 border border-gray-800 rounded-xl px-5 py-1 bg-gray-900/40 mb-6">
                    {[specsLeft, specsRight].map((column, ci) => (
                      <dl key={ci} className="divide-y divide-gray-800/70">
                        {column.map((s) => (
                          <div key={s.label} className="flex items-baseline justify-between gap-4 py-3">
                            <dt className="text-gray-500 text-sm flex-shrink-0">{s.label}</dt>
                            <dd className="text-white text-sm text-right">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ))}
                  </div>
                )}

                {/* Assets — pills read better than a spec row */}
                {assets.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      Tradable assets
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {assets.map((a) => (
                        <span key={a} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Long-form policies get real cards */}
                {policies.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {policies.map((p) => (
                      <DetailCard key={p.title} icon={p.icon} title={p.title}>
                        <p className="text-gray-300 text-sm leading-relaxed">{p.body}</p>
                      </DetailCard>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* --- Progression ladder ----------------------------------- */}
            {tiers && tiers.rows && tiers.rows.length > 0 && (
              <section id="progression" className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {tiers.title || 'Scaling plan'}
                </h2>
                {tiers.intro && <p className="text-gray-400 mb-6">{tiers.intro}</p>}

                <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/40">
                  <table className="w-full text-sm">
                    {tiers.columns && (
                      <thead>
                        <tr className="border-b border-gray-800">
                          {tiers.columns.map((col, i) => (
                            <th
                              key={col}
                              className={`px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap ${
                                i === 0 ? 'text-left' : 'text-right'
                              }`}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {tiers.rows.map((row, ri) => {
                        const isTop = ri === tiers.rows!.length - 1
                        return (
                          <tr
                            key={ri}
                            className={`border-b border-gray-800/60 last:border-0 ${
                              isTop ? 'bg-emerald-500/5' : ''
                            }`}
                          >
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`px-4 py-3 whitespace-nowrap ${
                                  ci === 0
                                    ? `text-left font-semibold ${isTop ? 'text-emerald-400' : 'text-white'}`
                                    : 'text-right text-gray-300'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {tiers.note && (
                  <p className="text-gray-500 text-xs leading-relaxed mt-3">{tiers.note}</p>
                )}
              </section>
            )}

            {/* --- FAQ -------------------------------------------------- */}
            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Frequently asked questions</h2>
              <p className="text-gray-400 mb-6">Everything traders ask about {firm.name}.</p>

              <div className="space-y-3">
                {generateFAQs(firm, isSubscription).map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>
          </main>

          {/* ---------------------------------------------------------- */}
          {/* STICKY SIDEBAR (desktop only)                              */}
          {/* ---------------------------------------------------------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Deal / CTA */}
              <div className="bg-gray-900/70 border border-emerald-500/25 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                  Get started
                </p>
                {firm.min_price > 0 && (
                  <p className="text-white mb-3">
                    <span className="text-gray-500 text-sm">From </span>
                    <span className="text-2xl font-bold">${firm.min_price}</span>
                    {isSubscription && <span className="text-gray-500 text-sm"> /month</span>}
                  </p>
                )}
                {hasVerifiedDeal && (
                  <div className="mb-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                    <p className="text-emerald-300 text-sm font-semibold">
                      {firm.discount_percent}% off with code {firm.discount_code}
                    </p>
                  </div>
                )}
                <a
                  href={dealUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
                >
                  Visit {firm.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-gray-600 text-[11px] mt-2 text-center">
                  We may earn a commission on this link.
                </p>
              </div>

              {/* Identity */}
              <SidebarCard title="Firm details">
                <dl className="space-y-2.5">
                  {firm.legal_name && <SidebarFact label="Legal name" value={firm.legal_name} />}
                  {foundedText && <SidebarFact label="Founded" value={foundedText} />}
                  {firm.country && <SidebarFact label="Country" value={firm.country} />}
                  {firm.headquarters && <SidebarFact label="HQ" value={firm.headquarters} />}
                </dl>
                {firm.is_regulated && firm.regulation_details && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium mb-1">
                      <Shield className="w-3.5 h-3.5" /> Regulated
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">{firm.regulation_details}</p>
                    {firm.license_url && (
                      <a
                        href={firm.license_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 mt-1.5"
                      >
                        Verify licence <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </SidebarCard>

              {/* Platforms */}
              {platforms.length > 0 && (
                <SidebarCard title="Platforms">
                  <div className="flex flex-wrap gap-1.5">
                    {platforms.map((p) => (
                      <span key={p} className="px-2.5 py-1 bg-gray-800 text-gray-200 text-xs rounded-md">
                        {p}
                      </span>
                    ))}
                  </div>
                </SidebarCard>
              )}

              {/* Table of contents */}
              {toc.length > 1 && (
                <SidebarCard title="On this page" icon={<List className="w-3.5 h-3.5" />}>
                  <nav className="space-y-1">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-gray-400 hover:text-emerald-400 transition-colors py-1"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </SidebarCard>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 4. SIMILAR FIRMS — full width                                   */}
      {/* ================================================================ */}
      {similarFirms.length > 0 && (
        <section className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Similar firms</h2>
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
      {/* 5. RISK WARNING                                                 */}
      {/* ================================================================ */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-semibold mb-1">Trading risk warning</p>
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

function SidebarCard({
  title,
  icon,
  children,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-3 text-gray-500">
        {icon}
        <p className="text-xs uppercase tracking-wider font-semibold">{title}</p>
      </div>
      {children}
    </div>
  )
}

function SidebarFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500 text-xs">{label}</dt>
      <dd className="text-gray-200 text-sm leading-snug">{value}</dd>
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

function generateFAQs(
  firm: PropFirm,
  isSubscription = false
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []

  // Q1: Legit / regulated
  if (firm.is_regulated) {
    faqs.push({
      question: `Is ${firm.name} legit?`,
      answer: `Yes. ${firm.name} is a legitimate prop trading firm${
        firm.regulation_details ? `. ${firm.regulation_details}` : ' with an established operating history.'
      }${firm.founded ? ` The company has been operating since ${firm.founded}.` : ''} As with any prop firm, we recommend reviewing their rules carefully before purchasing a challenge.`,
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
      answer: `${firm.name} ${isSubscription ? 'evaluations are billed monthly, starting at' : 'challenges start at'} $${firm.min_price}${
        isSubscription ? ' per month' : ''
      }${
        firm.max_price ? ` and going up to $${firm.max_price}${isSubscription ? ' per month' : ''} for the largest account sizes` : ''
      }.${
        isSubscription
          ? ' The subscription renews every 30 days and keeps running until you pass the evaluation or cancel, so budget for more than one cycle.'
          : ''
      } Use our challenge selector above to see the exact price for each combination of program and account size.${
        firm.commissions ? ` Trading costs apply on top of the evaluation fee: ${firm.commissions}` : ''
      }`,
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
      answer: `${firm.name} allows ${permissions.join(', ')} on some of their programs, but not all — instant-funding and high-leverage accounts are usually the most restricted. Check the exact program in the configurator above before purchasing, as trading during a restricted window can void profits.`,
    })
  }

  // Q5: Payouts
  if (firm.payout_frequency) {
    const speed = formatPayoutSpeed(firm)
    faqs.push({
      question: `How does ${firm.name} handle payouts?`,
      answer: `${firm.name} processes payouts ${firm.payout_frequency.toLowerCase()}${
        speed ? `, typically within ${speed.toLowerCase()} of request` : ''
      }.${firm.min_payout ? ` Minimum payout amount is $${firm.min_payout}.` : ''}${
        firm.refund_policy ? ` ${firm.refund_policy}` : ''
      }`,
    })
  }

  // Q6: Refund of the challenge fee
  if (firm.refund_policy) {
    faqs.push({
      question: `Does ${firm.name} refund the challenge fee?`,
      answer: firm.refund_policy,
    })
  }

  // Q7: Scaling
  if (firm.scaling_max) {
    faqs.push({
      question: `What is the maximum capital I can manage at ${firm.name}?`,
      answer: `${firm.name} offers a scaling plan that lets qualified traders manage up to ${firm.scaling_max}.${
        firm.max_allocation ? ` ${firm.max_allocation}` : ''
      } Scaling typically requires consistent profitability over several months.`,
    })
  }

  return faqs
}