'use client'

import { useState, useMemo, useEffect } from 'react'
import { ExternalLink, Check, Copy, ChevronDown } from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export interface Challenge {
  id: string
  slug: string
  name: string | null
  firm_name: string | null
  firm_slug: string
  account_size: string | null
  steps: string | null
  max_drawdown: number | null
  max_daily_loss: number | null
  phase1_profit_target: number | null
  phase2_profit_target: number | null
  phase3_profit_target: number | null
  drawdown_type: string | null
  max_loss_type: string | null
  profit_split: number | null
  price: number | null
  discounted_price: number | null
  payout_frequency_description: string | null
  consistency_rule: string | null
  profit_target_sum: number | null
  allows_ea: boolean | null
  allows_scalping: boolean | null
  allows_news_trading: boolean | null
  // Futures firms bill monthly and express risk in dollars, not percent.
  billing_period: string | null // 'one-time' | 'monthly'
  risk_unit: string | null // 'percent'  | 'usd'
  affiliate_url: string | null
}

// Some firms make you pick something at their own checkout before you can pay
// (Earn2Trade makes you choose a market data feed). It is pre-selected and
// folded away: a real decision with a real cost, but not one that should stand
// between the visitor and the price.
export interface CheckoutOptions {
  label?: string
  param?: string
  help?: string
  options?: { value: string; name: string; sub?: string }[]
}

// Lets the page frame programs by goal ("Climb step by step") rather than by
// product name ("Trader Career Path"), which means nothing to a newcomer.
export interface ProgramGuide {
  options?: { badge?: string; name?: string; summary?: string; points?: string[] }[]
}

interface Props {
  firmSlug: string
  firmName: string
  challenges: Challenge[]
  checkoutOptions?: CheckoutOptions | null
  programGuide?: ProgramGuide | null
  discountCode?: string | null
  discountPercent?: number | null
  /** Free-text note under the price, e.g. "for the first 4 billings". */
  discountNote?: string | null
}

// =============================================================================
// HELPERS
// =============================================================================

// "2 Step Prime $10K" -> "2 Step Prime". Also handles "Gauntlet Mini 50K".
function extractProgram(challengeName: string | null): string {
  if (!challengeName) return 'Program'
  const m = challengeName.match(/^(.+?)\s+\$?[\d,.KMk]+/i)
  return (m ? m[1] : challengeName).trim()
}

function sizeToNumber(size: string | null): number {
  if (!size) return 0
  const m = size.replace(/[$,\s]/g, '').match(/^([\d.]+)([KMk]?)/)
  if (!m) return 0
  const n = parseFloat(m[1])
  const unit = m[2].toUpperCase()
  return unit === 'M' ? n * 1_000_000 : unit === 'K' ? n * 1_000 : n
}

function formatPrice(price: number | null, suffix = ''): string {
  if (price === null || price === undefined) return '—'
  return `$${price.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}${suffix}`
}

// Risk figures are percentages on forex firms and dollar amounts on futures
// firms. Rendering 2000 as "2000%" instead of "$2,000" is not a rounding
// error, it is a different claim — so the unit travels with the challenge.
function fmtRisk(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined) return '—'
  if (unit === 'usd') return `$${Number(value).toLocaleString('en-US')}`
  return `${value}%`
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ChallengeSelector({
  firmSlug,
  firmName,
  challenges,
  checkoutOptions,
  programGuide,
  discountCode,
  discountPercent,
  discountNote,
}: Props) {
  // ---------------------------------------------------------------- derived

  const programs = useMemo(() => {
    const map = new Map<string, Challenge[]>()
    for (const c of challenges) {
      const program = extractProgram(c.name)
      if (!map.has(program)) map.set(program, [])
      map.get(program)!.push(c)
    }
    map.forEach((list) => {
      list.sort((a, b) => sizeToNumber(a.account_size) - sizeToNumber(b.account_size))
    })
    return Array.from(map.entries())
  }, [challenges])

  // Goal-framed labels, matched to the program guide by name when available.
  const guideFor = useMemo(() => {
    const map = new Map<string, { badge?: string; summary?: string }>()
    programGuide?.options?.forEach((o) => {
      if (o.name) map.set(o.name.toLowerCase(), { badge: o.badge, summary: o.summary })
    })
    return map
  }, [programGuide])

  const isSubscription = useMemo(
    () => challenges.some((c) => c.billing_period === 'monthly'),
    [challenges]
  )
  const priceSuffix = isSubscription ? '/mo' : ''

  const checkoutChoices = checkoutOptions?.options ?? []
  const hasCheckoutStep = checkoutChoices.length > 0

  // ------------------------------------------------------------------ state

  const [selectedProgram, setSelectedProgram] = useState<string>(programs[0]?.[0] ?? '')
  const [selectedSize, setSelectedSize] = useState<string>(programs[0]?.[1][0]?.account_size ?? '')
  // Pre-selected on purpose: the deep link needs a value, and a dead button the
  // visitor cannot explain is worse than a sensible default they can change.
  const [selectedFeed, setSelectedFeed] = useState<string>(checkoutChoices[0]?.value ?? '')
  const [codeCopied, setCodeCopied] = useState(false)

  const availableSizes = useMemo(
    () => programs.find(([name]) => name === selectedProgram)?.[1] ?? [],
    [programs, selectedProgram]
  )

  const currentChallenge = useMemo(
    () => availableSizes.find((c) => c.account_size === selectedSize) ?? availableSizes[0],
    [availableSizes, selectedSize]
  )

  useEffect(() => {
    if (!codeCopied) return
    const t = setTimeout(() => setCodeCopied(false), 2000)
    return () => clearTimeout(t)
  }, [codeCopied])

  const handleSelectProgram = (program: string) => {
    setSelectedProgram(program)
    const first = programs.find(([name]) => name === program)?.[1][0]
    if (first?.account_size) setSelectedSize(first.account_size)
  }

  const handleCopyCode = () => {
    if (!discountCode) return
    navigator.clipboard.writeText(discountCode)
    setCodeCopied(true)
  }

  // ------------------------------------------------------------------ price

  const displayPrice = useMemo(() => {
    const empty = {
      original: null as number | null,
      final: null as number | null,
      hasDiscount: false,
    }
    if (!currentChallenge) return empty

    const original = currentChallenge.price
    // A struck-through price is a promise. Only make it when the visitor
    // actually has a usable code, otherwise they pay full price and we have
    // advertised a discount that does not exist.
    const codeIsUsable = Boolean(discountCode) && discountCode !== 'PENDING'
    let final = currentChallenge.discounted_price
    if (
      final === null &&
      codeIsUsable &&
      original !== null &&
      discountPercent &&
      discountPercent > 0
    ) {
      final = Math.round(original * (1 - discountPercent / 100) * 100) / 100
    }
    return {
      original,
      final: final ?? original,
      hasDiscount: codeIsUsable && final !== null && original !== null && final < original,
    }
  }, [currentChallenge, discountPercent, discountCode])

  const ctaLink = useMemo(() => {
    if (!currentChallenge) return `/api/go/${firmSlug}?source=challenge-selector`
    const params = new URLSearchParams({
      source: 'challenge-selector',
      // The exact challenge slug lets /api/go resolve a program-specific
      // affiliate link, so the visitor lands on the plan they configured.
      challenge: currentChallenge.slug ?? '',
      program: extractProgram(currentChallenge.name).toLowerCase().replace(/\s+/g, '-'),
      size: currentChallenge.account_size ?? '',
    })
    if (selectedFeed && checkoutOptions?.param) {
      params.set('opt_key', checkoutOptions.param)
      params.set('opt_value', selectedFeed)
    }
    return `/api/go/${firmSlug}?${params.toString()}`
  }, [currentChallenge, firmSlug, selectedFeed, checkoutOptions])

  if (challenges.length === 0) return null

  const riskUnit = currentChallenge?.risk_unit
  const keyNumbers = [
    { label: 'Profit target', value: fmtRisk(currentChallenge?.phase1_profit_target, riskUnit) },
    { label: 'Max drawdown', value: fmtRisk(currentChallenge?.max_drawdown, riskUnit) },
    { label: 'Daily loss', value: fmtRisk(currentChallenge?.max_daily_loss, riskUnit) },
    { label: 'Profit split', value: fmtRisk(currentChallenge?.profit_split) },
  ]

  const selectedFeedName = checkoutChoices.find((o) => o.value === selectedFeed)?.name

  // --------------------------------------------------------------- rendering

  return (
    <section className="px-4 py-10 border-y border-gray-800 bg-gray-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-2">
            Two-step configurator
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Find the program that fits you
          </h2>
          <p className="text-gray-400 mt-2">
            Start with your goal. Price and rules update as you choose.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          {/* ---------------------------------------------------- controls */}
          <div className="space-y-4">
            {/* Step 1 — framed as a goal, not a product name */}
            <fieldset className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
              <legend className="flex items-center gap-2 px-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-gray-950 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-sm font-semibold text-white">
                  How do you want to be funded?
                </span>
              </legend>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                {programs.map(([program, list]) => {
                  const isActive = program === selectedProgram
                  const guide = guideFor.get(program.toLowerCase())
                  const cheapest = list.reduce<number | null>((min, c) => {
                    const p = c.discounted_price ?? c.price
                    return p !== null && (min === null || p < min) ? p : min
                  }, null)

                  return (
                    <button
                      key={program}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleSelectProgram(program)}
                      className={`text-left p-4 rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {guide?.badge && (
                        <span className="inline-block mb-2 px-2 py-0.5 bg-gray-900/70 border border-gray-700 rounded-full text-gray-300 text-[11px] font-medium">
                          {guide.badge}
                        </span>
                      )}
                      <p className={`font-semibold ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                        {program}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {list.length} size{list.length > 1 ? 's' : ''}
                        {cheapest !== null && <> · from {formatPrice(cheapest, priceSuffix)}</>}
                      </p>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Step 2 — size */}
            <fieldset className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
              <legend className="flex items-center gap-2 px-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-gray-950 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-sm font-semibold text-white">Pick your account size</span>
              </legend>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {availableSizes.map((c) => {
                  const isActive = c.account_size === selectedSize
                  const p = c.discounted_price ?? c.price
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedSize(c.account_size ?? '')}
                      className={`p-3 rounded-lg border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <p className={`font-bold ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                        {c.account_size}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{formatPrice(p, priceSuffix)}</p>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Advanced — folded, pre-selected, never blocking */}
            {hasCheckoutStep && (
              <details className="group bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-gray-800/30 transition-colors">
                  <span className="text-sm text-white font-medium">
                    {checkoutOptions?.label || 'Advanced options'}
                    {selectedFeedName && (
                      <span className="text-gray-500 font-normal"> · {selectedFeedName}</span>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 pt-1 border-t border-gray-800">
                  {checkoutOptions?.help && (
                    <p className="text-gray-400 text-xs leading-relaxed mb-3">
                      {checkoutOptions.help}
                    </p>
                  )}
                  <div className="grid sm:grid-cols-3 gap-2">
                    {checkoutChoices.map((opt) => {
                      const isActive = opt.value === selectedFeed
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setSelectedFeed(opt.value)}
                          className={`p-3 rounded-lg border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                            isActive
                              ? 'bg-emerald-500/10 border-emerald-500'
                              : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <p
                            className={`font-semibold text-sm ${
                              isActive ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {opt.name}
                          </p>
                          {opt.sub && <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </details>
            )}
          </div>

          {/* ---------------------------------------------------- summary */}
          <aside className="lg:sticky lg:top-6 bg-gray-900/70 border border-emerald-500/25 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">
              Your selection
            </p>
            <p className="text-white font-bold mb-4">
              {selectedProgram} {currentChallenge?.account_size}
            </p>

            <div className="mb-4">
              {displayPrice.hasDiscount && displayPrice.original !== null && (
                <p className="text-gray-500 text-sm">
                  <s>{formatPrice(displayPrice.original)}</s> normally
                </p>
              )}
              <p className="text-white">
                <span className="text-3xl font-bold">{formatPrice(displayPrice.final)}</span>
                {isSubscription && <span className="text-gray-500 text-base"> /month</span>}
              </p>
              {displayPrice.hasDiscount && discountNote && (
                <p className="text-gray-500 text-xs mt-1">{discountNote}</p>
              )}
            </div>

            <dl className="divide-y divide-gray-800/70 mb-4">
              {keyNumbers.map((k) => (
                <div key={k.label} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-gray-500 text-sm">{k.label}</dt>
                  <dd className="text-white text-sm font-medium text-right">{k.value}</dd>
                </div>
              ))}
            </dl>

            {discountCode && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 mb-3 bg-gray-800/60 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="text-gray-500 text-xs">Code applied automatically</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold text-sm">
                  {discountCode}
                  {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </span>
              </button>
            )}

            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Continue to {firmName}
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-gray-600 text-[11px] mt-2 text-center">
              Payment page pre-filled. We may earn a commission.
            </p>
          </aside>
        </div>
      </div>

      {/* ------------------------------------------------- mobile CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-gray-500 text-[11px] truncate">
              {selectedProgram} · {currentChallenge?.account_size}
            </p>
            <p className="text-white font-bold leading-tight">
              {displayPrice.hasDiscount && displayPrice.original !== null && (
                <s className="text-gray-600 text-xs font-normal mr-1.5">
                  {formatPrice(displayPrice.original)}
                </s>
              )}
              {formatPrice(displayPrice.final, priceSuffix)}
            </p>
          </div>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-1.5 px-5 py-3 bg-emerald-500 text-gray-950 font-semibold rounded-lg flex-shrink-0"
          >
            Continue
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
