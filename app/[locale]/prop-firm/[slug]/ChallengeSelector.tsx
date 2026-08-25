'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ExternalLink, Check, Copy } from 'lucide-react'
import { buildAffiliateUrl, AFFILIATE_LINK_PROPS } from '@/lib/affiliate'

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
  billing_period: string | null // 'one-time' | 'monthly'
  risk_unit: string | null // 'percent'  | 'usd'
  affiliate_url: string | null
  max_contracts: number | null
}

export interface CheckoutOptions {
  label?: string
  param?: string
  help?: string
  options?: { value: string; name: string; sub?: string }[]
}

export interface ProgramGuide {
  title?: string
  intro?: string
  options?: { badge?: string; name?: string; summary?: string; points?: string[] }[]
}

interface Props {
  firmSlug: string
  firmName: string
  challenges: Challenge[]
  locale?: string
  checkoutOptions?: CheckoutOptions | null
  programGuide?: ProgramGuide | null
  discountCode?: string | null
  discountPercent?: number | null
  discountNote?: string | null
  includedItems?: string[] | null
}

// =============================================================================
// COPY
// =============================================================================

const COPY = {
  en: {
    eyebrow: 'Two-step configurator',
    title: 'Find the program that fits you',
    intro: 'Start with your goal. Price and rules update as you choose.',
    step1: 'How do you want to be funded?',
    step2: 'Pick your account size',
    step3: 'Platform and data feed',
    sizes: (n: number) => `${n} size${n > 1 ? 's' : ''}`,
    from: 'from',
    selection: 'Your selection',
    normally: 'normally',
    perMonth: '/month',
    target: 'Profit target',
    drawdown: 'Max drawdown',
    dailyLoss: 'Daily loss',
    contracts: 'Max contracts',
    split: 'Profit split',
    included: 'Included at no extra cost',
    codeAuto: 'Code applied automatically',
    cta: (firm: string) => `Continue to ${firm}`,
    ctaShort: 'Continue',
    disclosure: 'Payment page pre-filled. We may earn a commission.',
    compareTitle: 'Which one is right for you?',
    compareIntro: 'A comparison, not a second decision — the configurator above already has your choice.',
    pick: (p: string) => `Select ${p}`,
    picked: 'Selected',
  },
  fr: {
    eyebrow: 'Configurateur en 2 étapes',
    title: 'Trouvez le programme adapté à votre profil',
    intro: 'Commencez par votre objectif. Le prix et les règles s’actualisent automatiquement.',
    step1: 'Comment souhaitez-vous être financé ?',
    step2: 'Choisissez votre taille de compte',
    step3: 'Plateforme et flux de données',
    sizes: (n: number) => `${n} taille${n > 1 ? 's' : ''}`,
    from: 'à partir de',
    selection: 'Votre sélection',
    normally: 'prix normal',
    perMonth: '/mois',
    target: 'Objectif de profit',
    drawdown: 'Drawdown maximum',
    dailyLoss: 'Perte journalière',
    contracts: 'Contrats maximum',
    split: 'Partage des profits',
    included: 'Inclus sans supplément',
    codeAuto: 'Code appliqué automatiquement',
    cta: (firm: string) => `Continuer vers ${firm}`,
    ctaShort: 'Continuer',
    disclosure: 'Page de paiement préremplie. Nous percevons une commission.',
    compareTitle: 'Lequel vous convient ?',
    compareIntro:
      'Une comparaison, pas un second choix — le configurateur ci-dessus a déjà enregistré votre sélection.',
    pick: (p: string) => `Sélectionner ${p}`,
    picked: 'Sélectionné',
  },
}

// =============================================================================
// HELPERS
// =============================================================================

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
// firms. Rendering 2000 as "2000%" instead of "$2,000" is a different claim,
// so the unit travels with the challenge.
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
  locale = 'en',
  checkoutOptions,
  programGuide,
  discountCode,
  discountPercent,
  discountNote,
  includedItems,
}: Props) {
  const t = locale === 'fr' ? COPY.fr : COPY.en
  const configRef = useRef<HTMLDivElement | null>(null)

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
  const priceSuffix = isSubscription ? t.perMonth : ''

  const checkoutChoices = checkoutOptions?.options ?? []
  const hasCheckoutStep = checkoutChoices.length > 0

  const [selectedProgram, setSelectedProgram] = useState<string>(programs[0]?.[0] ?? '')
  const [selectedSize, setSelectedSize] = useState<string>(programs[0]?.[1][0]?.account_size ?? '')
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
    const timer = setTimeout(() => setCodeCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [codeCopied])

  const handleSelectProgram = (program: string, scrollBack = false) => {
    setSelectedProgram(program)
    const first = programs.find(([name]) => name === program)?.[1][0]
    if (first?.account_size) setSelectedSize(first.account_size)
    // The comparison lives below the configurator, so picking there has to
    // carry the visitor back up to the choice it just made for them.
    if (scrollBack) configRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCopyCode = () => {
    if (!discountCode) return
    navigator.clipboard.writeText(discountCode)
    setCodeCopied(true)
  }

  const displayPrice = useMemo(() => {
    const empty = {
      original: null as number | null,
      final: null as number | null,
      hasDiscount: false,
    }
    if (!currentChallenge) return empty

    const original = currentChallenge.price
    // A struck-through price is a promise. Only make it when the visitor has a
    // usable code, otherwise they pay full price against an advertised discount.
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

  const ctaLink = useMemo(
    () =>
      buildAffiliateUrl(firmSlug, {
        placement: 'challenge-selector',
        locale,
        challenge: currentChallenge?.slug,
        program: currentChallenge
          ? extractProgram(currentChallenge.name).toLowerCase().replace(/\s+/g, '-')
          : null,
        size: currentChallenge?.account_size,
        optKey: checkoutOptions?.param,
        optValue: selectedFeed,
      }),
    [currentChallenge, firmSlug, selectedFeed, checkoutOptions, locale]
  )

  if (challenges.length === 0) return null

  const riskUnit = currentChallenge?.risk_unit
  const keyNumbers = [
    { label: t.target, value: fmtRisk(currentChallenge?.phase1_profit_target, riskUnit) },
    { label: t.drawdown, value: fmtRisk(currentChallenge?.max_drawdown, riskUnit) },
    { label: t.dailyLoss, value: fmtRisk(currentChallenge?.max_daily_loss, riskUnit) },
    currentChallenge?.max_contracts
      ? { label: t.contracts, value: String(currentChallenge.max_contracts) }
      : { label: t.split, value: fmtRisk(currentChallenge?.profit_split) },
  ]

  return (
    <section
      id="challenges"
      ref={configRef}
      className="px-4 py-8 border-y border-gray-800 bg-gray-900/20 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-1">
            {t.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{t.title}</h2>
          <p className="text-gray-400 text-base mt-1">{t.intro}</p>
        </div>

        {/* Controls and summary share one screen — no scrolling to see a price */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
          <div className="space-y-3">
            {/* Step 1 */}
            <fieldset className="bg-gray-900/70 rounded-xl border border-gray-800 px-4 pb-4 pt-2">
              <legend className="flex items-center gap-2 px-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-gray-950 text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-base font-semibold text-white">{t.step1}</span>
              </legend>

              <div className="grid sm:grid-cols-2 gap-2 mt-2">
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
                      className={`text-left p-3 rounded-lg border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {guide?.badge && (
                        <span className="block text-[11px] font-medium text-gray-400 mb-0.5">
                          {guide.badge}
                        </span>
                      )}
                      <span
                        className={`block text-base font-semibold ${
                          isActive ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {program}
                      </span>
                      <span className="block text-gray-500 text-sm mt-0.5">
                        {t.sizes(list.length)}
                        {cheapest !== null && ` · ${t.from} ${formatPrice(cheapest, priceSuffix)}`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Step 2 */}
            <fieldset className="bg-gray-900/70 rounded-xl border border-gray-800 px-4 pb-4 pt-2">
              <legend className="flex items-center gap-2 px-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-gray-950 text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-base font-semibold text-white">{t.step2}</span>
              </legend>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {availableSizes.map((c) => {
                  const isActive = c.account_size === selectedSize
                  const p = c.discounted_price ?? c.price
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedSize(c.account_size ?? '')}
                      className={`px-2 py-2.5 rounded-lg border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span
                        className={`block text-base font-bold ${
                          isActive ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {c.account_size}
                      </span>
                      <span className="block text-gray-500 text-sm">
                        {formatPrice(p, priceSuffix)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Step 3 — always visible: it is a real cost, not an advanced option */}
            {hasCheckoutStep && (
              <fieldset className="bg-gray-900/70 rounded-xl border border-gray-800 px-4 pb-4 pt-2">
                <legend className="flex items-center gap-2 px-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-gray-950 text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span className="text-base font-semibold text-white">
                    {checkoutOptions?.label || t.step3}
                  </span>
                </legend>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {checkoutChoices.map((opt) => {
                    const isActive = opt.value === selectedFeed
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setSelectedFeed(opt.value)}
                        className={`p-2.5 rounded-lg border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500'
                            : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <span
                          className={`block text-base font-semibold ${
                            isActive ? 'text-emerald-400' : 'text-white'
                          }`}
                        >
                          {opt.name}
                        </span>
                        {opt.sub && (
                          <span className="block text-sm text-gray-500 leading-tight mt-0.5">
                            {opt.sub}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}
          </div>

          {/* Summary — tight, no filler, price dominant */}
          <aside className="lg:sticky lg:top-20 bg-gray-900/70 border border-emerald-500/25 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              {t.selection}
            </p>
            <p className="text-white text-base font-bold mb-3">
              {selectedProgram} {currentChallenge?.account_size}
            </p>

            <div className="mb-3">
              <p className="text-white leading-none">
                <span className="text-3xl font-bold">{formatPrice(displayPrice.final)}</span>
                {isSubscription && <span className="text-gray-500 text-base">{t.perMonth}</span>}
              </p>
              {displayPrice.hasDiscount && displayPrice.original !== null && (
                <p className="text-gray-500 text-sm mt-1">
                  {discountNote ? `${discountNote} ` : ''}
                  <span className="text-gray-400">
                    {formatPrice(displayPrice.original, priceSuffix)} {t.normally}
                  </span>
                </p>
              )}
            </div>

            <dl className="divide-y divide-gray-800/70 mb-3">
              {keyNumbers.map((k) => (
                <div key={k.label} className="flex items-baseline justify-between gap-3 py-1.5">
                  <dt className="text-gray-500 text-sm">{k.label}</dt>
                  <dd className="text-white text-base font-medium text-right">{k.value}</dd>
                </div>
              ))}
            </dl>

            {includedItems && includedItems.length > 0 && (
              <ul className="mb-3 space-y-1">
                {includedItems.slice(0, 3).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-400 text-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {discountCode && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 mb-2 bg-gray-800/60 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="text-gray-500 text-sm">{t.codeAuto}</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold text-sm">
                  {discountCode}
                  {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </span>
              </button>
            )}

            <a
              href={ctaLink}
              {...AFFILIATE_LINK_PROPS}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-base font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              {t.cta(firmName)}
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-gray-600 text-xs mt-2 text-center leading-snug">{t.disclosure}</p>
          </aside>
        </div>

        {/* Comparison — teaching, not a second decision. Buttons feed the
            configurator above and take the visitor back to it. */}
        {programGuide?.options && programGuide.options.length > 0 && (
          <div id="program-guide" className="mt-8 scroll-mt-20">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {programGuide.title || t.compareTitle}
            </h3>
            <p className="text-gray-400 text-base mt-1 mb-4">
              {programGuide.intro || t.compareIntro}
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {programGuide.options.map((opt, i) => {
                const isActive = opt.name === selectedProgram
                return (
                  <article
                    key={opt.name || i}
                    className={`rounded-xl border p-4 flex flex-col ${
                      isActive
                        ? 'bg-emerald-500/5 border-emerald-500/40'
                        : 'bg-gray-900/50 border-gray-800'
                    }`}
                  >
                    {opt.badge && (
                      <span className="text-sm font-medium text-emerald-400 mb-1">{opt.badge}</span>
                    )}
                    <h4 className="text-lg font-bold text-white mb-1.5">{opt.name}</h4>
                    {opt.summary && (
                      <p className="text-gray-300 text-base leading-snug mb-3">{opt.summary}</p>
                    )}
                    {opt.points && opt.points.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {opt.points.slice(0, 3).map((pt, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-gray-400 text-base">
                            <span className="text-emerald-500 leading-none mt-1">·</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={() => opt.name && handleSelectProgram(opt.name, true)}
                      disabled={isActive}
                      className={`mt-auto w-full px-4 py-2.5 rounded-lg text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                        isActive
                          ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 cursor-default'
                          : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white'
                      }`}
                    >
                      {isActive ? `✓ ${t.picked}` : t.pick(opt.name || '')}
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-800 px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-gray-500 text-xs truncate">
              {selectedProgram} · {currentChallenge?.account_size}
            </p>
            <p className="text-white text-base font-bold leading-tight">
              {formatPrice(displayPrice.final, priceSuffix)}
              {displayPrice.hasDiscount && displayPrice.original !== null && (
                <s className="text-gray-600 text-sm font-normal ml-1.5">
                  {formatPrice(displayPrice.original)}
                </s>
              )}
            </p>
          </div>
          <a
            href={ctaLink}
            {...AFFILIATE_LINK_PROPS}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 text-gray-950 text-base font-semibold rounded-lg flex-shrink-0"
          >
            {t.ctaShort}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
