'use client'

import { useState, useMemo, useEffect } from 'react'
import { ExternalLink, Check, Copy, TrendingUp, Shield, Target, Zap, Award, TrendingDown } from 'lucide-react'

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
  billing_period: string | null       // 'one-time' | 'monthly'
  risk_unit: string | null            // 'percent'  | 'usd'
  affiliate_url: string | null
}

interface Props {
  firmSlug: string
  firmName: string
  challenges: Challenge[]
  discountCode?: string | null
  discountPercent?: number | null
}

// =============================================================================
// HELPERS
// =============================================================================

// Extract program name from full challenge name.
// Convention: "<Program> <Size>" (e.g. "2 Step Prime $10K" -> "2 Step Prime")
function extractProgram(challengeName: string | null): string {
  if (!challengeName) return 'Other'
  const match = challengeName.match(/^(.+?)\s+\$?[\d,.KMk]+/i)
  return match ? match[1].trim() : challengeName
}

// Sort account sizes numerically ($2K < $5K < $10K < ...)
function sizeToNumber(size: string | null): number {
  if (!size) return 0
  const clean = size.replace(/[\$,\s]/g, '').toUpperCase()
  const num = parseFloat(clean)
  if (isNaN(num)) return 0
  if (clean.includes('K')) return num * 1000
  if (clean.includes('M')) return num * 1000000
  return num
}

function formatPrice(price: number | null, suffix = ''): string {
  if (price === null || price === undefined) return '—'
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}${suffix}`
}

// Risk figures are percentages on forex firms and dollar amounts on futures
// firms. Rendering 2000 as "2000%" instead of "$2,000" is not a rounding
// error, it is a different claim — so the unit travels with the challenge.
function fmtRisk(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined) return '—'
  if (unit === 'usd') return `$${Number(value).toLocaleString('en-US')}`
  return `${value}%`
}

// "1 Step" reads better than a bare "1"; 0 or null means instant funding.
function fmtSteps(steps: string | number | null | undefined): string {
  if (steps === null || steps === undefined || steps === '') return '—'
  const n = Number(steps)
  if (Number.isNaN(n)) return String(steps)
  if (n <= 0) return 'Instant Funding'
  return `${n} Step`
}

// Contextual recommendation for each program type
// (These labels are what makes the UX feel curated vs. generic.)
function programRecommendation(programName: string): { label: string; icon: React.ReactNode } | null {
  const p = programName.toLowerCase()
  if (p.includes('direct') || p.includes('instant')) {
    return { label: 'Skip the challenge — start trading immediately', icon: <Zap className="w-3.5 h-3.5" /> }
  }
  if (p.includes('boost')) {
    return { label: 'Highest leverage — for aggressive traders', icon: <TrendingUp className="w-3.5 h-3.5" /> }
  }
  if (p.includes('pro')) {
    return { label: 'Advanced traders — more flexibility', icon: <Award className="w-3.5 h-3.5" /> }
  }
  if (p.includes('1 step') || p.includes('1-step')) {
    return { label: 'Simpler evaluation — 1 phase only', icon: <Target className="w-3.5 h-3.5" /> }
  }
  if (p.includes('2 step') || p.includes('2-step')) {
    return { label: 'Most common format — great for beginners', icon: <Shield className="w-3.5 h-3.5" /> }
  }
  return null
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ChallengeSelector({
  firmSlug,
  firmName,
  challenges,
  discountCode,
  discountPercent,
}: Props) {
  // ----- Derived data -----

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

  // Determine which program is the cheapest overall (for the "Cheapest" badge)
  const isSubscription = useMemo(
    () => challenges.some((c) => c.billing_period === 'monthly'),
    [challenges]
  )
  const priceSuffix = isSubscription ? '/mo' : ''

  const cheapestProgram = useMemo(() => {
    let cheapest: { program: string; price: number } | null = null
    for (const [program, list] of programs) {
      for (const c of list) {
        if (c.price !== null && (cheapest === null || c.price < cheapest.price)) {
          cheapest = { program, price: c.price }
        }
      }
    }
    return cheapest?.program ?? null
  }, [programs])

  // "Most Popular" = the program that appears the most frequent format across the industry.
  // For a firm with a "2 Step Prime" program, that's usually it.
  // We heuristically pick a "2 Step" one, falling back to the first program.
  const popularProgram = useMemo(() => {
    const twoStep = programs.find(([name]) => /2 ?step (prime|standard)/i.test(name))
    return twoStep ? twoStep[0] : null
    // No fallback on purpose: labelling an arbitrary program "Most Popular"
    // is a claim we cannot support, and it misleads on firms with no 2-step.
  }, [programs])

  // ----- State -----

  const [selectedProgram, setSelectedProgram] = useState<string>(programs[0]?.[0] ?? '')
  const [selectedSize, setSelectedSize] = useState<string>(programs[0]?.[1][0]?.account_size ?? '')
  const [codeCopied, setCodeCopied] = useState(false)
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false)

  // ----- Current selection -----

  const availableSizes = useMemo(() => {
    const prog = programs.find(([name]) => name === selectedProgram)
    return prog ? prog[1] : []
  }, [programs, selectedProgram])

  const currentChallenge = useMemo(() => {
    return availableSizes.find((c) => c.account_size === selectedSize) ?? availableSizes[0]
  }, [availableSizes, selectedSize])

  const displayPrice = useMemo(() => {
    if (!currentChallenge) return { original: null as number | null, final: null as number | null, hasDiscount: false }
    const original = currentChallenge.price
    // A struck-through price is a promise. Only make it when the visitor
    // actually has a code to redeem, otherwise they pay full price and we
    // have advertised a discount that does not exist.
    const codeIsUsable = Boolean(discountCode) && discountCode !== 'PENDING'
    let final = currentChallenge.discounted_price
    if (final === null && codeIsUsable && original !== null && discountPercent && discountPercent > 0) {
      final = Math.round(original * (1 - discountPercent / 100) * 100) / 100
    }
    return {
      original,
      final: final ?? original,
      hasDiscount: codeIsUsable && final !== null && original !== null && final < original,
    }
  }, [currentChallenge, discountPercent, discountCode])

  // ----- Handlers -----

  const handleSelectProgram = (program: string) => {
    setSelectedProgram(program)
    const prog = programs.find(([name]) => name === program)
    if (prog && prog[1].length > 0) {
      setSelectedSize(prog[1][0].account_size ?? '')
    }
  }

  const handleCopyCode = () => {
    if (!discountCode || discountCode === 'PENDING') return
    navigator.clipboard.writeText(discountCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const ctaLink = useMemo(() => {
    if (!currentChallenge) return `/api/go/${firmSlug}?source=challenge-selector`
    const params = new URLSearchParams({
      source: 'challenge-selector',
      // The exact challenge slug lets /api/go resolve a program-specific
      // affiliate link, so the visitor lands on the plan they configured
      // rather than the firm's generic page.
      challenge: currentChallenge.slug ?? '',
      program: extractProgram(currentChallenge.name).toLowerCase().replace(/\s+/g, '-'),
      size: currentChallenge.account_size ?? '',
    })
    return `/api/go/${firmSlug}?${params.toString()}`
  }, [currentChallenge, firmSlug])

  // ----- Empty state -----

  if (challenges.length === 0 || programs.length === 0) {
    return null
  }

  // ----- Render -----

  return (
    <>
      <section className="py-10 px-4 border-b border-gray-800 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Instant Configurator</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Configure Your {firmName} Challenge
            </h2>
            <p className="text-gray-400 text-lg">
              Pick a program, choose your account size, get your exclusive deal — all in one place.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT / MAIN — Program + Size pickers + Specs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Program picker */}
              <div className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Choose Your Program</h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {programs.map(([program, list]) => {
                    const isActive = program === selectedProgram
                    const isCheapest = program === cheapestProgram
                    const isPopular = program === popularProgram
                    const cheapest = list.reduce(
                      (min, c) => (c.price !== null && (min === null || c.price < min) ? c.price : min),
                      null as number | null
                    )
                    const reco = programRecommendation(program)
                    return (
                      <button
                        key={program}
                        type="button"
                        onClick={() => handleSelectProgram(program)}
                        className={`relative text-left p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                            : 'bg-gray-800/40 border-gray-700 hover:border-gray-600 hover:bg-gray-800/60'
                        }`}
                      >
                        {/* Badges */}
                        {(isPopular || isCheapest) && (
                          <div className="absolute -top-2 right-3 flex gap-1">
                            {isPopular && (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-gray-900 rounded-full">
                                Most Popular
                              </span>
                            )}
                            {isCheapest && !isPopular && (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-gray-900 rounded-full">
                                Cheapest
                              </span>
                            )}
                          </div>
                        )}

                        <p className={`font-semibold text-base mb-1 ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                          {program}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          {list.length} {list.length > 1 ? 'sizes' : 'size'}
                          {cheapest !== null && <> · from {formatPrice(cheapest, priceSuffix)}</>}
                        </p>
                        {reco && (
                          <p className="text-xs text-gray-400 flex items-start gap-1.5 mt-2 pt-2 border-t border-gray-700/50">
                            <span className={isActive ? 'text-emerald-400 mt-0.5' : 'text-gray-500 mt-0.5'}>
                              {reco.icon}
                            </span>
                            <span>{reco.label}</span>
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Size picker */}
              <div className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Pick Your Account Size</h3>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSizes.map((c) => {
                    const isActive = c.account_size === selectedSize
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedSize(c.account_size ?? '')}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10'
                            : 'bg-gray-800/40 border-gray-700 hover:border-gray-600 hover:bg-gray-800/60'
                        }`}
                      >
                        <p className={`font-bold text-sm ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                          {c.account_size}
                        </p>
                        {c.price !== null && (
                          <p className="text-xs text-gray-500 mt-0.5">{formatPrice(c.price, priceSuffix)}</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Challenge specs */}
              {currentChallenge && (
                <div className="bg-gray-900/70 rounded-2xl border border-gray-800 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Your Deal Details</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <SpecItem
                      icon={<Target className="w-4 h-4" />}
                      label="Evaluation"
                      value={fmtSteps(currentChallenge.steps)}
                    />
                    <SpecItem
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="Profit Split"
                      value={currentChallenge.profit_split !== null ? `${currentChallenge.profit_split}%` : '—'}
                      highlight={currentChallenge.profit_split !== null && currentChallenge.profit_split >= 90}
                    />
                    <SpecItem
                      icon={<Shield className="w-4 h-4" />}
                      label="Max Drawdown"
                      value={fmtRisk(currentChallenge.max_drawdown, currentChallenge.risk_unit)}
                    />
                    <SpecItem
                      icon={<TrendingDown className="w-4 h-4" />}
                      label="Daily Loss"
                      value={fmtRisk(currentChallenge.max_daily_loss, currentChallenge.risk_unit)}
                    />
                    <SpecItem
                      icon={<Target className="w-4 h-4" />}
                      label="Phase 1 Target"
                      value={
                        currentChallenge.phase1_profit_target !== null
                          ? fmtRisk(currentChallenge.phase1_profit_target, currentChallenge.risk_unit)
                          : 'N/A'
                      }
                    />
                    <SpecItem
                      icon={<Target className="w-4 h-4" />}
                      label="Phase 2 Target"
                      value={
                        currentChallenge.phase2_profit_target !== null
                          ? fmtRisk(currentChallenge.phase2_profit_target, currentChallenge.risk_unit)
                          : 'N/A'
                      }
                    />
                  </div>

                  {/* Permissions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-800">
                    <PermBadge label="Scalping" value={currentChallenge.allows_scalping} />
                    <PermBadge label="News Trading" value={currentChallenge.allows_news_trading} />
                    <PermBadge label="EAs / Bots" value={currentChallenge.allows_ea} />
                  </div>

                  {/* Extra rules */}
                  <div className="mt-4 pt-4 border-t border-gray-800 space-y-2 text-sm">
                    {currentChallenge.drawdown_type && (
                      <div className="flex justify-between text-gray-400">
                        <span>Drawdown Type</span>
                        <span className="text-white">{currentChallenge.drawdown_type}</span>
                      </div>
                    )}
                    {currentChallenge.consistency_rule && (
                      <div className="flex justify-between text-gray-400 gap-3">
                        <span className="whitespace-nowrap">Consistency Rule</span>
                        <span className="text-white text-right">{currentChallenge.consistency_rule}</span>
                      </div>
                    )}
                    {currentChallenge.payout_frequency_description && (
                      <div className="flex justify-between text-gray-400 gap-3">
                        <span className="whitespace-nowrap">Payout Frequency</span>
                        <span className="text-white text-right">
                          {currentChallenge.payout_frequency_description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT / SIDEBAR — Deal Summary + CTA (sticky on desktop, hidden on mobile — replaced by fixed bottom bar) */}
            <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
              <DealSummaryCard
                firmName={firmName}
                selectedProgram={selectedProgram}
                currentChallenge={currentChallenge}
                displayPrice={displayPrice}
                isSubscription={isSubscription}
                discountCode={discountCode}
                discountPercent={discountPercent}
                codeCopied={codeCopied}
                onCopyCode={handleCopyCode}
                ctaLink={ctaLink}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE — Sticky bottom bar with expandable Deal Summary */}
      {currentChallenge && (
        <>
          {/* Backdrop when expanded */}
          {mobileSummaryOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileSummaryOpen(false)}
            />
          )}

          {/* Fixed bottom bar (always visible on mobile) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-emerald-500/30 shadow-2xl">
            {/* Expanded summary (slides up) */}
            {mobileSummaryOpen && (
              <div className="max-h-[70vh] overflow-y-auto p-4 border-b border-gray-800">
                <DealSummaryCard
                  firmName={firmName}
                  selectedProgram={selectedProgram}
                  currentChallenge={currentChallenge}
                  displayPrice={displayPrice}
                isSubscription={isSubscription}
                  discountCode={discountCode}
                  discountPercent={discountPercent}
                  codeCopied={codeCopied}
                  onCopyCode={handleCopyCode}
                  ctaLink={ctaLink}
                  compact
                />
              </div>
            )}

            {/* Compact bar (always visible) */}
            <div className="flex items-center gap-3 p-3">
              <button
                type="button"
                onClick={() => setMobileSummaryOpen((v) => !v)}
                className="flex-1 text-left"
              >
                <p className="text-xs text-gray-500 mb-0.5">
                  {selectedProgram} · {currentChallenge.account_size}
                </p>
                <div className="flex items-baseline gap-2">
                  {displayPrice.hasDiscount && displayPrice.original !== null && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(displayPrice.original)}
                    </span>
                  )}
                  <span className="text-xl font-bold text-white">{formatPrice(displayPrice.final, priceSuffix)}</span>
                </div>
              </button>
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
              >
                Get Deal
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Spacer so page content isn't hidden under the sticky bar on mobile */}
          <div className="lg:hidden h-20" />
        </>
      )}
    </>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface DealSummaryProps {
  firmName: string
  selectedProgram: string
  currentChallenge: Challenge | undefined
  displayPrice: { original: number | null; final: number | null; hasDiscount: boolean }
  isSubscription: boolean
  discountCode: string | null | undefined
  discountPercent: number | null | undefined
  codeCopied: boolean
  onCopyCode: () => void
  ctaLink: string
  compact?: boolean
}

function DealSummaryCard(props: DealSummaryProps) {
  const {
    firmName,
    selectedProgram,
    currentChallenge,
    displayPrice,
    isSubscription,
    discountCode,
    discountPercent,
    codeCopied,
    onCopyCode,
    ctaLink,
    compact = false,
  } = props

  if (!currentChallenge) return null

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-gray-900 rounded-2xl border border-emerald-500/30 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Your Deal</span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-400">Firm</span>
          <span className="text-white font-medium">{firmName}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-400">Program</span>
          <span className="text-white font-medium text-right">{selectedProgram}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-400">Account Size</span>
          <span className="text-white font-medium">{currentChallenge.account_size}</span>
        </div>
        {currentChallenge.profit_split !== null && (
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-400">Profit Split</span>
            <span className="text-emerald-400 font-medium">up to {currentChallenge.profit_split}%</span>
          </div>
        )}
      </div>

      <div className="py-4 border-y border-gray-800 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-gray-400">{isSubscription ? 'Billed monthly' : 'Total'}</span>
          <div className="text-right">
            {displayPrice.hasDiscount && displayPrice.original !== null && (
              <p className="text-sm text-gray-500 line-through">{formatPrice(displayPrice.original)}</p>
            )}
            <p className="text-3xl font-bold text-white">
              {formatPrice(displayPrice.final)}
              {isSubscription && <span className="text-base text-gray-500 font-normal"> /month</span>}
            </p>
            {displayPrice.hasDiscount && discountPercent && (
              <p className="text-xs text-emerald-400 mt-0.5">You save {discountPercent}%</p>
            )}
          </div>
        </div>
      </div>

      {discountCode && discountCode !== 'PENDING' && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">
            Exclusive code{discountPercent ? ` — ${discountPercent}% OFF` : ''}
          </p>
          <button
            type="button"
            onClick={onCopyCode}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
              codeCopied
                ? 'bg-emerald-500 text-white'
                : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            }`}
          >
            {codeCopied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> {discountCode}
              </>
            )}
          </button>
        </div>
      )}

      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
      >
        Claim This Deal
        <ExternalLink className="w-4 h-4" />
      </a>

      {!compact && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Secure redirect to {firmName}
        </p>
      )}
    </div>
  )
}

function SpecItem({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-lg p-3 border ${highlight ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-gray-800/50 border-gray-700/50'}`}>
      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`font-semibold text-sm ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function PermBadge({ label, value }: { label: string; value: boolean | null }) {
  const isYes = value === true
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        isYes ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700/50 text-gray-500'
      }`}
    >
      {isYes ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 flex items-center justify-center">–</span>}
      {label}
    </span>
  )
}
