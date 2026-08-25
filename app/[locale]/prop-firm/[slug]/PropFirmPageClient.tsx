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
  Shield,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Receipt,
  RotateCcw,
  Wallet,
  Layers,
  GraduationCap,
} from 'lucide-react'
import ChallengeSelector, { type Challenge } from './ChallengeSelector'

// =============================================================================
// HELPERS
// =============================================================================

// Several DB columns are typed TEXT but consumed as arrays. A string survives
// every `.length` guard and then throws on `.map`, taking the page down.
function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
  }
  return []
}

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
  min_trading_days: number
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
  scaling_max: string
  consistency_rule: string
  platforms: string[] | string
  assets: string[] | string
  pros: string[]
  cons: string[]
  discount_code: string
  discount_percent: number
  year_founded: number
  founded: string
  founded_year: number
  headquarters: string
  country: string
  is_regulated: boolean
  regulation_details: string
  legal_name: string
  is_featured: boolean

  commissions?: string | null
  reset_fee?: string | null
  swap_free?: string | null
  refund_policy?: string | null
  max_allocation?: string | null
  payout_methods?: string[] | string | null
  payout_speed_label?: string | null
  platforms_list?: string[] | string | null

  has_mt4?: boolean | null
  has_mt5?: boolean | null
  has_ctrader?: boolean | null
  has_dxtrade?: boolean | null
  has_tradelocker?: boolean | null
  has_match_trader?: boolean | null
  has_tradingview?: boolean | null

  // --- Page structure, all optional: a section vanishes when its column is null
  headline?: string | null
  verdict?: string | null
  discount_expires_at?: string | null
  proof_stats?: { value?: string; label?: string }[] | null
  value_strip?: { title?: string; sub?: string }[] | null
  journey?: {
    title?: string
    intro?: string
    steps?: { title?: string; detail?: string }[]
    options?: { name?: string; summary?: string; specs?: { label?: string; value?: string }[] }[]
  } | null
  key_rules?: {
    title?: string
    intro?: string
    rules?: { title?: string; detail?: string }[]
    more?: string[]
  } | null
  education?: { title?: string; intro?: string; items?: string[] } | null
  verdict_card?: { title?: string; body?: string; points?: string[] } | null
  program_guide?: {
    title?: string
    intro?: string
    options?: { badge?: string; name?: string; summary?: string; points?: string[] }[]
  } | null
  cost_timeline?: {
    title?: string
    intro?: string
    steps?: { label?: string; title?: string; detail?: string }[]
  } | null
  progression_tiers?: {
    title?: string
    intro?: string
    columns?: string[]
    rows?: string[][]
    note?: string
  } | null
  checkout_options?: {
    label?: string
    param?: string
    help?: string
    options?: { value: string; name: string; sub?: string }[]
  } | null
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
      navigator.share({ title: `${firm.name} - PropFirmScanner`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const logoUrl = firm.logo_url || null
  const foundedYear = firm.founded_year || firm.year_founded || null
  const foundedText = firm.founded || (foundedYear ? String(foundedYear) : null)

  const pros = Array.isArray(firm.pros) ? firm.pros : []
  const cons = Array.isArray(firm.cons) ? firm.cons : []

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
  const platforms =
    toArray(firm.platforms_list).length > 0
      ? toArray(firm.platforms_list)
      : fromFlags.length > 0
      ? fromFlags
      : toArray(firm.platforms)

  const isSubscription = challenges.some(
    (c) => (c as { billing_period?: string }).billing_period === 'monthly'
  )
  const assets = toArray(firm.assets)
  const payoutMethods = toArray(firm.payout_methods)
  const payoutSpeed = formatPayoutSpeed(firm)

  const hasVerifiedDeal = Boolean(firm.discount_code && firm.discount_percent)
  const dealUrl = firm.affiliate_url || firm.website_url || '#'

  // Reference specs live in a collapsed block: complete, but not in the way.
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

  const policies: { icon: React.ReactNode; title: string; body: string }[] = []
  if (firm.commissions) policies.push({ icon: <Receipt className="w-4 h-4" />, title: 'Commissions', body: firm.commissions })
  if (firm.refund_policy) policies.push({ icon: <Wallet className="w-4 h-4" />, title: 'Refund policy', body: firm.refund_policy })
  if (firm.reset_fee) policies.push({ icon: <RotateCcw className="w-4 h-4" />, title: 'Reset fee', body: firm.reset_fee })
  if (firm.swap_free) policies.push({ icon: <Layers className="w-4 h-4" />, title: 'Swap-free option', body: firm.swap_free })

  const proofStats = firm.proof_stats?.filter((s) => s.value) ?? []
  const valueStrip = firm.value_strip?.filter((v) => v.title) ?? []
  const journey = firm.journey || null
  const keyRules = firm.key_rules || null
  const education = firm.education || null
  const verdictCard = firm.verdict_card || null
  const programGuide = firm.program_guide || null
  const costTimeline = firm.cost_timeline || null
  const tiers = firm.progression_tiers || null

  const hasReference = specs.length > 0 || policies.length > 0 || platforms.length > 0 || assets.length > 0

  const expiryText = firm.discount_expires_at
    ? new Date(firm.discount_expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    : null

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ================================================================ */}
      {/* 1. HERO — a benefit headline, proof, and the offer side by side  */}
      {/* ================================================================ */}
      <section className="pt-8 pb-10 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          {/* --- Copy --- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700">
                {logoUrl ? (
                  <Image src={logoUrl} alt={firm.name} fill className="object-contain p-2" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-400 text-xl font-bold">
                    {firm.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{firm.name}</p>
                {assets.length > 0 && (
                  <p className="text-emerald-400 text-xs font-medium">{assets[0]}</p>
                )}
              </div>
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

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {firm.headline || firm.name}
            </h1>

            {firm.verdict && (
              <p className="text-gray-300 text-lg leading-relaxed mb-5 max-w-2xl">{firm.verdict}</p>
            )}

            {/* Proof — the numbers a sceptical reader looks for */}
            {proofStats.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                {proofStats.map((s, i) => (
                  <span key={i} className="text-sm text-gray-400">
                    <strong className="text-white font-semibold">{s.value}</strong>
                    {s.label ? ` ${s.label}` : ''}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              {challenges.length > 0 && (
                <a
                  href="#challenges"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
                >
                  Choose your program
                </a>
              )}
              <a
                href="#rules"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                See the key rules
              </a>
            </div>

            <p className="text-gray-600 text-xs">
              Independent analysis · Partner offer · Terms checked{' '}
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* --- Offer card --- */}
          <aside className="bg-gray-900/70 border border-emerald-500/30 rounded-2xl p-5">
            {firm.trustpilot_rating > 0 && (
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
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
                  <span className="text-gray-500 text-xs">
                    ({firm.trustpilot_reviews.toLocaleString()} on Trustpilot)
                  </span>
                )}
              </div>
            )}

            {firm.min_price > 0 && (
              <div className="mb-3">
                <p className="text-gray-500 text-sm">
                  From{' '}
                  {hasVerifiedDeal && <s className="text-gray-600">${firm.min_price}</s>}
                </p>
                <p className="text-white">
                  <span className="text-3xl font-bold">
                    ${hasVerifiedDeal
                      ? Math.round(firm.min_price * (1 - firm.discount_percent / 100) * 100) / 100
                      : firm.min_price}
                  </span>
                  {isSubscription && <span className="text-gray-500 text-base"> /month</span>}
                </p>
              </div>
            )}

            {hasVerifiedDeal && (
              <div className="mb-4 px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                <p className="text-emerald-300 text-sm font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Code {firm.discount_code} — applied automatically
                </p>
                {expiryText && (
                  <p className="text-gray-500 text-xs mt-1">Offer runs until {expiryText}</p>
                )}
              </div>
            )}

            <a
              href={challenges.length > 0 ? '#challenges' : dealUrl}
              {...(challenges.length === 0
                ? { target: '_blank', rel: 'noopener noreferrer sponsored' }
                : {})}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
            >
              {challenges.length > 0 ? 'Configure my account' : `Visit ${firm.name}`}
              {challenges.length === 0 && <ExternalLink className="w-4 h-4" />}
            </a>

            <p className="text-gray-600 text-[11px] mt-3 text-center leading-relaxed">
              {isSubscription
                ? 'Billed monthly during evaluation only. We may earn a commission.'
                : 'We may earn a commission on this link.'}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-800 space-y-1.5 text-xs">
              {foundedText && (
                <p className="text-gray-500">
                  Founded <span className="text-gray-300">{foundedText}</span>
                </p>
              )}
              {firm.country && (
                <p className="text-gray-500">
                  Country <span className="text-gray-300">{firm.country}</span>
                </p>
              )}
              {firm.is_regulated && (
                <p className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Shield className="w-3.5 h-3.5" /> Regulated
                </p>
              )}
              {firm.website_url && (
                <a
                  href={firm.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" /> Official website
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. VALUE STRIP — four reasons, scannable in two seconds         */}
      {/* ================================================================ */}
      {valueStrip.length > 0 && (
        <section className="px-4 py-6 border-b border-gray-800 bg-gray-900/30">
          <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
            {valueStrip.map((v, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{v.title}</p>
                  {v.sub && <p className="text-gray-500 text-xs mt-0.5">{v.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* 3. CONFIGURATOR — full width, owns its own two-column layout    */}
      {/* ================================================================ */}
      {challenges.length > 0 && (
        <div id="challenges" className="scroll-mt-24">
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

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* ============================================================== */}
        {/* 4. WHICH PROGRAM — the question that blocks the decision      */}
        {/* ============================================================== */}
        {programGuide?.options?.length ? (
          <section id="program-guide" className="scroll-mt-24">
            <SectionHeading
              eyebrow="Choosing a program"
              title={programGuide.title || 'Which program fits you?'}
              intro={programGuide.intro}
            />
            <div className="grid md:grid-cols-2 gap-4">
              {programGuide.options.map((opt, i) => (
                <article
                  key={opt.name || i}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 flex flex-col"
                >
                  {opt.badge && (
                    <span className="self-start px-2.5 py-1 mb-3 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-emerald-400 text-xs font-semibold">
                      {opt.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white mb-2">{opt.name}</h3>
                  {opt.summary && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{opt.summary}</p>
                  )}
                  {opt.points && opt.points.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {opt.points.map((pt, pi) => (
                        <li key={pi} className="flex items-start gap-2 text-gray-400 text-sm">
                          <span className="text-emerald-500 mt-0.5">·</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href="#challenges"
                    className="mt-auto w-full inline-flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Configure {opt.name}
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 5. JOURNEY — what happens after you pay                       */}
        {/* ============================================================== */}
        {journey?.steps?.length ? (
          <section id="journey" className="scroll-mt-24">
            <SectionHeading
              eyebrow="After you pass"
              title={journey.title || 'From evaluation to your first payout'}
              intro={journey.intro}
            />

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {journey.steps.map((step, i) => (
                <li key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-gray-950 text-xs font-bold mb-2.5">
                    {i + 1}
                  </span>
                  <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.detail}</p>
                </li>
              ))}
            </ol>

            {journey.options && journey.options.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {journey.options.map((opt, i) => (
                  <article key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-1">{opt.name}</h3>
                    {opt.summary && <p className="text-gray-400 text-sm mb-4">{opt.summary}</p>}
                    {opt.specs && (
                      <dl className="divide-y divide-gray-800/70">
                        {opt.specs.map((sp, si) => (
                          <div key={si} className="flex items-baseline justify-between gap-4 py-2">
                            <dt className="text-gray-500 text-sm">{sp.label}</dt>
                            <dd className="text-white text-sm text-right">{sp.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 6. COSTS                                                       */}
        {/* ============================================================== */}
        {costTimeline?.steps?.length ? (
          <section id="costs" className="scroll-mt-24">
            <SectionHeading
              eyebrow="No hidden fees"
              title={costTimeline.title || 'What it actually costs'}
              intro={costTimeline.intro}
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {costTimeline.steps.map((step, i) => (
                <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-emerald-400 text-xs font-bold mb-2.5">
                    {i + 1}
                  </span>
                  {step.label && (
                    <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-1">
                      {step.label}
                    </p>
                  )}
                  {step.title && <p className="text-white font-semibold text-sm mb-1">{step.title}</p>}
                  {step.detail && (
                    <p className="text-gray-400 text-xs leading-relaxed">{step.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 7. EDUCATION                                                   */}
        {/* ============================================================== */}
        {education?.title ? (
          <section className="grid md:grid-cols-[minmax(0,1fr)_280px] gap-6 items-start">
            <div>
              <SectionHeading eyebrow="Included value" title={education.title} intro={education.intro} />
              {education.items && education.items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {education.items.map((it, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/25 rounded-xl p-5 text-center">
              <GraduationCap className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Free with every subscription</p>
              <p className="text-gray-400 text-sm">No separate purchase, no upsell.</p>
            </div>
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 8. KEY RULES — four that matter, the rest folded away          */}
        {/* ============================================================== */}
        {keyRules?.rules?.length ? (
          <section id="rules" className="scroll-mt-24">
            <SectionHeading
              eyebrow="Before you buy"
              title={keyRules.title || 'The rules that actually matter'}
              intro={keyRules.intro}
            />
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {keyRules.rules.map((r, i) => (
                <article key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-1.5">{r.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{r.detail}</p>
                </article>
              ))}
            </div>

            {keyRules.more && keyRules.more.length > 0 && (
              <Disclosure summary="See all permissions and restrictions">
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  {keyRules.more.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-emerald-500 mt-0.5">·</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </Disclosure>
            )}
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 9. SCALING LADDER                                              */}
        {/* ============================================================== */}
        {tiers?.rows?.length ? (
          <section id="progression" className="scroll-mt-24">
            <SectionHeading eyebrow="Scaling" title={tiers.title || 'Scaling plan'} intro={tiers.intro} />
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
                        className={`border-b border-gray-800/60 last:border-0 ${isTop ? 'bg-emerald-500/5' : ''}`}
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
            {tiers.note && <p className="text-gray-500 text-xs leading-relaxed mt-3">{tiers.note}</p>}
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 10. STRENGTHS & LIMITS                                         */}
        {/* ============================================================== */}
        {(pros.length > 0 || cons.length > 0) && (
          <section id="pros-cons" className="scroll-mt-24">
            <SectionHeading
              eyebrow="Honest view"
              title={`Why choose ${firm.name}?`}
              intro="From trader feedback and the firm's own specifications."
            />
            <div className="grid md:grid-cols-2 gap-5">
              {pros.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
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
                    <ThumbsDown className="w-4 h-4 text-red-400" />
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

        {/* ============================================================== */}
        {/* 11. FULL REFERENCE — complete, but folded away                 */}
        {/* ============================================================== */}
        {hasReference && (
          <section id="reference" className="scroll-mt-24">
            <Disclosure summary="Full specifications, costs and platforms">
              <div className="space-y-6">
                {specs.length > 0 && (
                  <dl className="grid sm:grid-cols-2 gap-x-8">
                    {[specs.slice(0, Math.ceil(specs.length / 2)), specs.slice(Math.ceil(specs.length / 2))].map(
                      (column, ci) => (
                        <div key={ci} className="divide-y divide-gray-800/70">
                          {column.map((s) => (
                            <div key={s.label} className="flex items-baseline justify-between gap-4 py-3">
                              <dt className="text-gray-500 text-sm flex-shrink-0">{s.label}</dt>
                              <dd className="text-white text-sm text-right">{s.value}</dd>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </dl>
                )}

                {platforms.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      Platforms
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((p) => (
                        <span key={p} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {assets.length > 0 && (
                  <div>
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

                {policies.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {policies.map((p) => (
                      <div key={p.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                          {p.icon}
                          <p className="text-xs uppercase tracking-wider font-semibold">{p.title}</p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{p.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {firm.description && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      About {firm.name}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">{firm.description}</p>
                  </div>
                )}

                {firm.is_regulated && firm.regulation_details && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      Regulation
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">{firm.regulation_details}</p>
                  </div>
                )}
              </div>
            </Disclosure>
          </section>
        )}

        {/* ============================================================== */}
        {/* 12. VERDICT                                                    */}
        {/* ============================================================== */}
        {verdictCard?.body ? (
          <section className="grid md:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
            <div>
              <SectionHeading
                eyebrow="PropFirmScanner verdict"
                title={verdictCard.title || `Who we recommend ${firm.name} to`}
              />
              <p className="text-gray-300 leading-relaxed">{verdictCard.body}</p>
            </div>
            {verdictCard.points && verdictCard.points.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <p className="text-white font-semibold text-sm mb-3">A good fit if you want</p>
                <ul className="space-y-2">
                  {verdictCard.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 13. FAQ                                                        */}
        {/* ============================================================== */}
        <section id="faq" className="scroll-mt-24">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            intro={`Everything traders ask about ${firm.name}.`}
          />
          <div className="space-y-3">
            {generateFAQs(firm, isSubscription).map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 14. FINAL CTA                                                  */}
        {/* ============================================================== */}
        {challenges.length > 0 && (
          <section className="bg-gray-900/70 border border-emerald-500/25 rounded-2xl p-8 text-center">
            {expiryText && (
              <p className="text-emerald-400 text-xs uppercase tracking-wider font-semibold mb-2">
                Offer runs until {expiryText}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to pick your program?
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Configure your account and check the rules one last time before payment.
            </p>
            <a
              href="#challenges"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
            >
              Configure my {firm.name} account
            </a>
            {hasVerifiedDeal && (
              <p className="text-gray-600 text-xs mt-3">
                Partner link · code {firm.discount_code} applied automatically
              </p>
            )}
          </section>
        )}
      </div>

      {/* ================================================================ */}
      {/* 15. SIMILAR FIRMS                                                */}
      {/* ================================================================ */}
      {similarFirms.length > 0 && (
        <section className="py-12 px-4 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Similar firms</h2>
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
      {/* 16. RISK WARNING                                                 */}
      {/* ================================================================ */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-semibold mb-1">Trading risk warning</p>
              <p className="text-gray-400 text-sm">
                Trading involves substantial risk. Only trade with capital you can afford to lose. Prop firm
                evaluations are simulated trading environments — read all rules carefully before purchasing.
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

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string
  title: string
  intro?: string
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">{eyebrow}</p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      {intro && <p className="text-gray-400 mt-2 max-w-2xl">{intro}</p>}
    </div>
  )
}

// Progressive disclosure is what keeps the page short without losing detail.
function Disclosure({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="group bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-gray-800/30 transition-colors">
        <span className="text-white font-medium text-sm">{summary}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 pt-1 border-t border-gray-800">{children}</div>
    </details>
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
        <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
          {answer}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// FAQ GENERATOR
// =============================================================================

function generateFAQs(
  firm: PropFirm,
  isSubscription = false
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []

  faqs.push({
    question: `Is ${firm.name} legit?`,
    answer: firm.is_regulated
      ? `Yes. ${firm.name} is a legitimate prop trading firm${
          firm.regulation_details ? `. ${firm.regulation_details}` : '.'
        }${firm.founded ? ` It has been operating since ${firm.founded}.` : ''} As with any prop firm, review the rules carefully before purchasing.`
      : `${firm.name} operates as a proprietary trading firm.${
          firm.founded ? ` Founded in ${firm.founded},` : ''
        } it offers simulated trading evaluations and funds traders who pass. Review the rules carefully and consider starting with a smaller account.`,
  })

  if (firm.min_price) {
    faqs.push({
      question: `How much does ${firm.name} cost?`,
      answer: `${firm.name} ${
        isSubscription ? 'evaluations are billed monthly, starting at' : 'evaluations start at'
      } $${firm.min_price}${isSubscription ? ' per month' : ''}${
        firm.max_price
          ? ` and going up to $${firm.max_price}${isSubscription ? ' per month' : ''} for the largest account sizes`
          : ''
      }.${
        isSubscription
          ? ' The subscription renews every 30 days and keeps running until you pass or cancel, so budget for more than one cycle.'
          : ''
      } Use the configurator above for the exact price of each program and size.`,
    })
  }

  if (firm.max_profit_split || firm.profit_split) {
    const split = firm.max_profit_split || firm.profit_split
    faqs.push({
      question: `What profit split does ${firm.name} offer?`,
      answer: `${firm.name} offers profit splits up to ${split}%. The exact split depends on the program and, on some firms, on the size of each withdrawal — the configurator shows the figure for your selection.`,
    })
  }

  const permissions: string[] = []
  if (firm.allows_scalping) permissions.push('scalping')
  if (firm.allows_news_trading) permissions.push('news trading')
  if (firm.allows_ea) permissions.push('automated strategies')
  if (permissions.length > 0) {
    faqs.push({
      question: `Does ${firm.name} allow scalping and news trading?`,
      answer: `${firm.name} allows ${permissions.join(', ')} on some of their programs, but not all — instant-funding and high-leverage accounts are usually the most restricted. Check the exact program in the configurator before purchasing.`,
    })
  }

  if (firm.payout_frequency) {
    const speed = formatPayoutSpeed(firm)
    faqs.push({
      question: `How does ${firm.name} handle payouts?`,
      answer: `${firm.name} processes payouts ${firm.payout_frequency.toLowerCase()}${
        speed ? `, typically within ${speed.toLowerCase()} of request` : ''
      }.${firm.min_payout ? ` The minimum payout is $${firm.min_payout}.` : ''}`,
    })
  }

  if (firm.refund_policy) {
    faqs.push({
      question: `Does ${firm.name} refund the evaluation fee?`,
      answer: firm.refund_policy,
    })
  }

  if (firm.scaling_max) {
    faqs.push({
      question: `What is the maximum capital I can manage at ${firm.name}?`,
      answer: `${firm.name} lets qualified traders manage up to ${firm.scaling_max}.${
        firm.max_allocation ? ` ${firm.max_allocation}` : ''
      }`,
    })
  }

  return faqs
}
