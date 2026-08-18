'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, Check, Copy, TrendingUp, Shield, Target, DollarSign } from 'lucide-react'

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
// Convention: challenge name is "<Program> <Size>" (e.g. "2 Step Prime $10K").
function extractProgram(challengeName: string | null): string {
  if (!challengeName) return 'Other'
  // Split on last space + $ or last space + digit -> program is everything before
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

function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '—'
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
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

  // Group challenges by program, preserving first-seen order
  const programs = useMemo(() => {
    const map = new Map<string, Challenge[]>()
    for (const c of challenges) {
      const program = extractProgram(c.name)
      if (!map.has(program)) map.set(program, [])
      map.get(program)!.push(c)
    }
    // Sort challenges inside each program by account size
    for (const [prog, list] of map.entries()) {
      list.sort((a, b) => sizeToNumber(a.account_size) - sizeToNumber(b.account_size))
    }
    return Array.from(map.entries()) // [ [programName, Challenge[]], ... ]
  }, [challenges])

  // ----- State -----

  const [selectedProgram, setSelectedProgram] = useState<string>(programs[0]?.[0] ?? '')
  const [selectedSize, setSelectedSize] = useState<string>(programs[0]?.[1][0]?.account_size ?? '')
  const [codeCopied, setCodeCopied] = useState(false)

  // ----- Current selection -----

  const availableSizes = useMemo(() => {
    const prog = programs.find(([name]) => name === selectedProgram)
    return prog ? prog[1] : []
  }, [programs, selectedProgram])

  const currentChallenge = useMemo(() => {
    return availableSizes.find((c) => c.account_size === selectedSize) ?? availableSizes[0]
  }, [availableSizes, selectedSize])

  // Compute displayed price (with or without discount)
  const displayPrice = useMemo(() => {
    if (!currentChallenge) return { original: null as number | null, final: null as number | null, hasDiscount: false }
    const original = currentChallenge.price
    // Use stored discounted_price if present, else calc from discountPercent, else null
    let final = currentChallenge.discounted_price
    if (final === null && original !== null && discountPercent && discountPercent > 0) {
      final = Math.round(original * (1 - discountPercent / 100) * 100) / 100
    }
    return {
      original,
      final: final ?? original,
      hasDiscount: final !== null && original !== null && final < original,
    }
  }, [currentChallenge, discountPercent])

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

  // Build CTA link with deep-link params for the /api/go/ tracker
  const ctaLink = useMemo(() => {
    if (!currentChallenge) return `/api/go/${firmSlug}?source=challenge-selector`
    const params = new URLSearchParams({
      source: 'challenge-selector',
      program: extractProgram(currentChallenge.name).toLowerCase().replace(/\s+/g, '-'),
      size: currentChallenge.account_size ?? '',
    })
    return `/api/go/${firmSlug}?${params.toString()}`
  }, [currentChallenge, firmSlug])

  // ----- Empty state -----

  if (challenges.length === 0 || programs.length === 0) {
    return null // No challenges to show, hide the whole section
  }

  // ----- Render -----

  return (
    <section className="py-8 px-4 border-b border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Choose Your {firmName} Challenge
          </h2>
          <p className="text-gray-400">
            Pick your program, choose your account size, and unlock your exclusive deal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT / MAIN — Program + Size pickers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program picker */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Step 1 — Program</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {programs.map(([program, list]) => {
                  const isActive = program === selectedProgram
                  const cheapest = list.reduce(
                    (min, c) => (c.price !== null && (min === null || c.price < min) ? c.price : min),
                    null as number | null
                  )
                  return (
                    <button
                      key={program}
                      type="button"
                      onClick={() => handleSelectProgram(program)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                      }`}
                    >
                      <p className={`font-semibold text-sm mb-1 ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                        {program}
                      </p>
                      <p className="text-xs text-gray-500">
                        {list.length} {list.length > 1 ? 'sizes' : 'size'}
                        {cheapest !== null && <> · from {formatPrice(cheapest)}</>}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Size picker */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Step 2 — Account Size</p>
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
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                      }`}
                    >
                      <p className={`font-semibold text-sm ${isActive ? 'text-emerald-400' : 'text-white'}`}>
                        {c.account_size}
                      </p>
                      {c.price !== null && (
                        <p className="text-xs text-gray-500 mt-0.5">{formatPrice(c.price)}</p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Challenge specs — updates live with selection */}
            {currentChallenge && (
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Challenge Specs</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <SpecItem
                    icon={<Target className="w-4 h-4" />}
                    label="Steps"
                    value={currentChallenge.steps ?? '—'}
                  />
                  <SpecItem
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Profit Split"
                    value={currentChallenge.profit_split !== null ? `${currentChallenge.profit_split}%` : '—'}
                  />
                  <SpecItem
                    icon={<Shield className="w-4 h-4" />}
                    label="Max Drawdown"
                    value={currentChallenge.max_drawdown !== null ? `${currentChallenge.max_drawdown}%` : '—'}
                  />
                  <SpecItem
                    icon={<Shield className="w-4 h-4" />}
                    label="Daily Loss"
                    value={currentChallenge.max_daily_loss !== null ? `${currentChallenge.max_daily_loss}%` : '—'}
                  />
                  <SpecItem
                    icon={<Target className="w-4 h-4" />}
                    label="Phase 1 Target"
                    value={
                      currentChallenge.phase1_profit_target !== null
                        ? `${currentChallenge.phase1_profit_target}%`
                        : 'N/A'
                    }
                  />
                  <SpecItem
                    icon={<Target className="w-4 h-4" />}
                    label="Phase 2 Target"
                    value={
                      currentChallenge.phase2_profit_target !== null
                        ? `${currentChallenge.phase2_profit_target}%`
                        : 'N/A'
                    }
                  />
                </div>

                {/* Trading permissions row */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-800">
                  <PermBadge label="Scalping" value={currentChallenge.allows_scalping} />
                  <PermBadge label="News Trading" value={currentChallenge.allows_news_trading} />
                  <PermBadge label="EAs / Bots" value={currentChallenge.allows_ea} />
                </div>

                {/* Extra rules (drawdown type, consistency, payout freq) */}
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-2 text-sm">
                  {currentChallenge.drawdown_type && (
                    <div className="flex justify-between text-gray-400">
                      <span>Drawdown Type</span>
                      <span className="text-white">{currentChallenge.drawdown_type}</span>
                    </div>
                  )}
                  {currentChallenge.consistency_rule && (
                    <div className="flex justify-between text-gray-400">
                      <span>Consistency Rule</span>
                      <span className="text-white text-right max-w-[60%]">{currentChallenge.consistency_rule}</span>
                    </div>
                  )}
                  {currentChallenge.payout_frequency_description && (
                    <div className="flex justify-between text-gray-400">
                      <span>Payout Frequency</span>
                      <span className="text-white text-right max-w-[60%]">
                        {currentChallenge.payout_frequency_description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT / SIDEBAR — Deal Summary + CTA (sticky on desktop) */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-gradient-to-br from-emerald-500/10 to-gray-900 rounded-2xl border border-emerald-500/30 p-6">
              <p className="text-xs uppercase tracking-wider text-emerald-400 mb-4">Deal Summary</p>

              {currentChallenge && (
                <>
                  {/* Firm + Challenge */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-400">Firm</span>
                      <span className="text-white font-medium">{firmName}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-400">Challenge</span>
                      <span className="text-white font-medium text-right">{selectedProgram}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-400">Account Size</span>
                      <span className="text-white font-medium">{currentChallenge.account_size}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="py-4 border-y border-gray-800 mb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-400">Price</span>
                      <div className="text-right">
                        {displayPrice.hasDiscount && displayPrice.original !== null && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(displayPrice.original)}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-white">
                          {formatPrice(displayPrice.final)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Discount code block — only shown if a real code exists */}
                  {discountCode && discountCode !== 'PENDING' && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Your exclusive code
                        {discountPercent ? ` (${discountPercent}% OFF)` : ''}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyCode}
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

                  {/* CTA */}
                  <a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors"
                  >
                    Get This Challenge
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    You'll be redirected to {firmName} to complete your purchase.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  )
}

function PermBadge({ label, value }: { label: string; value: boolean | null }) {
  const isYes = value === true
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        isYes
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'bg-gray-700/50 text-gray-500'
      }`}
    >
      {isYes ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 flex items-center justify-center">–</span>}
      {label}
    </span>
  )
}
