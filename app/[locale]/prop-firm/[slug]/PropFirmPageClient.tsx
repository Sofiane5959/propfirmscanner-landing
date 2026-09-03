'use client'

import { useState } from 'react'
import FirmLogo from '@/components/FirmLogo'
import Link from 'next/link'
import {
  Star,
  ExternalLink,
  Check,
  Globe,
  Shield,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Heart,
  Share2,
  Zap,
  ThumbsUp,
  Info,
  Receipt,
  RotateCcw,
  Wallet,
  Layers,
  GraduationCap,
} from 'lucide-react'
import ChallengeSelector, { hasUsableChallenges, type Challenge } from './ChallengeSelector'
import { buildAffiliateUrl, AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { formatMoney, formatNumber, formatDayMonth, cleanMoneyLabel } from '@/lib/format'
import { resolvePromotion } from '@/lib/promotion'
import { toArray } from '@/lib/to-array'

// UI copy. Firm content is translated in the DB via prop_firms.translations;
// these are the labels the component owns.
const COPY = {
  en: {
    chooseProgram: 'Choose your program',
    seeRules: 'See the key rules',
    onTrustpilot: 'on Trustpilot',
    ratingChecked: (d: string) => `· Trustpilot rating, read ${d}`,
    // Le nom de la firme est un parametre. Il etait code en dur, si bien que
    // chaque fiche du site annonçait avoir ete verifiee « contre les documents
    // d'Earn2Trade » — y compris les fiches de ses concurrents.
    verifiedOn: (d: string, f: string) =>
      `Information verified on ${d} against ${f}'s own documents and help centre.`,
    from: 'From',
    perMonth: '/month',
    // Never "applied automatically": the coupon is only certain at the moment
    // of the redirect. What the partner does with it afterwards is theirs.
    codeAuto: (c: string) => `Code ${c} — prefilled when you are redirected`,
    runsUntil: (d: string) => `Offer runs until ${d}`,
    configure: 'Configure my account',
    visit: (f: string) => `Visit ${f}`,
    billedMonthly: 'Billed monthly during evaluation only.',
    commission: '',
    founded: 'Founded',
    country: 'Country',
    regulated: 'Regulated',
    officialSite: 'Official website',
    officialOffer: 'Official offer — code prefilled',
    choosingProgram: 'Choosing a program',
    afterPass: 'After you pass',
    noHidden: 'All the costs to expect',
    includedValue: 'Included value',
    beforeBuy: 'Before you buy',
    scaling: 'Scaling',
    honest: 'Honest view',
    whyChoose: (f: string) => `${f}: strengths and things to know`,
    honestIntro: 'Our independent analysis, based on verified official rules and documents.',
    strengths: 'Strengths',
    // "Limitations" reads as a warning label. These are trade-offs a buyer
    // should weigh, not defects — the wording and the colour should say so.
    limitations: 'Things to know',
    restrictedCountries: (n: number) => `See the ${n} countries and territories not accepted`,
    seeAll: 'See all permissions and restrictions',
    fullSpecs: 'Full specifications, costs and platforms',
    platforms: 'Platforms',
    assets: 'Tradable assets',
    about: (f: string) => `About ${f}`,
    regulation: 'Regulation',
    verdict: 'PropFirmScanner verdict',
    goodFit: 'A good fit if you want',
    faq: 'Frequently asked questions',
    faqIntro: (f: string) => `Everything traders ask about ${f}.`,
    readyTitle: 'Ready to pick your program?',
    readyIntro: 'Configure your account and check the rules one last time before payment.',
    readyCta: (f: string) => `Configure my ${f} account`,
    partnerLink: (c: string) => `Partner link · code ${c} prefilled at checkout`,
    similar: 'Similar firms',
    riskTitle: 'Trading risk warning',
    risk:
      'Trading involves substantial risk. Only trade with capital you can afford to lose. Prop firm evaluations are simulated trading environments — read all rules carefully before purchasing.',
    freeWith: 'Free with every subscription',
    freeWithSub: 'No separate purchase, no upsell.',
  },
  fr: {
    chooseProgram: 'Choisir mon programme',
    seeRules: 'Voir les règles essentielles',
    onTrustpilot: 'sur Trustpilot',
    ratingChecked: (d: string) => `· note Trustpilot, relevée le ${d}`,
    verifiedOn: (d: string, f: string) =>
      `Informations vérifiées le ${d} à partir des documents et du centre d'aide officiels de ${f}.`,
    from: 'À partir de',
    perMonth: '/mois',
    codeAuto: (c: string) => `Code ${c} — prérempli au moment de la redirection`,
    runsUntil: (d: string) => `Offre valable jusqu’au ${d}`,
    configure: 'Configurer mon compte',
    visit: (f: string) => `Visiter ${f}`,
    billedMonthly: 'Abonnement mensuel durant l’évaluation seulement.',
    commission: '',
    founded: 'Création',
    country: 'Pays',
    regulated: 'Régulé',
    officialSite: 'Site officiel',
    officialOffer: 'Offre officielle — code prérempli',
    choosingProgram: 'Choix du programme',
    afterPass: 'Après la réussite',
    noHidden: 'Tous les coûts à prévoir',
    includedValue: 'Valeur incluse',
    beforeBuy: 'À connaître avant d’acheter',
    scaling: 'Progression',
    honest: 'Avis honnête',
    whyChoose: (f: string) => `${f} : points forts et points à connaître`,
    honestIntro:
      'Notre analyse indépendante à partir des règles et documents officiels vérifiés.',
    strengths: 'Points forts',
    limitations: 'Points à connaître',
    restrictedCountries: (n: number) => `Voir les ${n} pays et territoires non acceptés`,
    seeAll: 'Voir toutes les autorisations et restrictions',
    fullSpecs: 'Spécifications complètes, coûts et plateformes',
    platforms: 'Plateformes',
    assets: 'Actifs négociables',
    about: (f: string) => `À propos de ${f}`,
    regulation: 'Régulation',
    verdict: 'Verdict PropFirmScanner',
    goodFit: 'Bon choix si vous recherchez',
    faq: 'Questions fréquentes',
    faqIntro: (f: string) => `Tout ce que les traders demandent sur ${f}.`,
    readyTitle: 'Prêt à choisir votre programme ?',
    readyIntro:
      'Configurez votre compte et vérifiez une dernière fois les règles avant le paiement.',
    readyCta: (f: string) => `Configurer mon compte ${f}`,
    partnerLink: (c: string) => `Lien partenaire · code ${c} prérempli au checkout`,
    similar: 'Firmes similaires',
    riskTitle: 'Avertissement sur les risques',
    risk:
      'Le trading comporte un risque de perte substantiel. N’engagez que des fonds que vous pouvez vous permettre de perdre. Les évaluations de prop firms sont des environnements simulés — lisez attentivement toutes les règles avant d’acheter.',
    freeWith: 'Inclus avec chaque abonnement',
    freeWithSub: 'Aucun achat séparé, aucune option payante.',
  },
}

// =============================================================================
// HELPERS
// =============================================================================

// Several DB columns are typed TEXT but consumed as arrays. A string survives
// every `.length` guard and then throws on `.map`, taking the page down.

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
  discount_note?: string | null
  category_badge?: string | null
  included_items?: string[] | string | null
  /** Per-locale overrides: { fr: { headline: "...", verdict: "...", ... } } */
  translations?: Record<string, Record<string, unknown>> | null
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
  locale?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PropFirmPageClient({
  firm: rawFirm,
  similarFirms,
  challenges = [],
  locale = 'en',
}: Props) {
  const [isFavorite, setIsFavorite] = useState(false)
  const t = locale === 'fr' ? COPY.fr : COPY.en

  // Firm content is translated in the DB. Overlaying the locale bundle once
  // here means every field below reads normally and nothing can silently fall
  // back to English halfway down the page.
  const firm: PropFirm = (() => {
    const overrides = rawFirm.translations?.[locale]
    if (!overrides) return rawFirm
    const merged: Record<string, unknown> = { ...rawFirm }
    for (const [key, value] of Object.entries(overrides)) {
      if (value !== null && value !== undefined && value !== '') merged[key] = value
    }
    return merged as unknown as PropFirm
  })()

  // French writes the currency after the amount: "150 $", not "$150".
  // Formatting is deterministic rather than locale-data driven — see
  // lib/format.ts for why toLocaleString broke hydration on this page.
  // FTMO prices in euros. Rendering that as dollars is a factual error, and
  // converting would invent a figure that drifts with the exchange rate.
  const currency = (firm as { price_currency?: string | null }).price_currency || 'USD'
  const money = (v: number) => formatMoney(v, locale, '', currency)

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

  // Whether this firm has challenge data worth configuring. Drives every
  // buying affordance on the page: with placeholder rows the configurator is
  // hidden and the CTAs point at the official site instead of a payment flow.
  const canConfigure = hasUsableChallenges(challenges)

  // One promotion record for the whole page. Previously each block tested
  // discount_code and discount_percent on its own and none of them looked at
  // the date, so an offer that ended yesterday was still setting today's price.
  const promotion = resolvePromotion(firm)
  const hasVerifiedDeal = promotion.isActive
  // Never the partner's public URL: that drops the affiliate params, skips the
  // automatic coupon and loses the click. Placement distinguishes each button.
  // The firm-level affiliate_url carries the coupon as a parameter, but it
  // lands on the partner's marketing page — and Earn2Trade, for one, drops the
  // coupon field as soon as the visitor navigates from there to checkout,
  // overwriting it with whatever site-wide campaign is live. A visitor who
  // clicked the logo or "official website" therefore paid full price against a
  // discount we had just shown them.
  //
  // The only destination where the coupon is certain is a deep link that lands
  // straight on the partner's checkout with the code in the query string —
  // which is what each challenge's own affiliate_url is. Challenges arrive
  // ordered by price, so the first one with a link is the entry plan.
  //
  // Scoped deliberately: only firms that have BOTH a verified coupon to
  // protect AND a challenge deep link to protect it with. Everywhere else
  // these links keep pointing at the firm's site exactly as before.
  const couponDeepLink = promotion.isActive
    ? challenges.find((c) => c.affiliate_url && c.affiliate_url !== '#') ?? null
    : null

  const heroCtaUrl = buildAffiliateUrl(firm.slug, { placement: 'hero_offer_card', locale })
  const officialSiteUrl = buildAffiliateUrl(firm.slug, {
    placement: 'official_website',
    locale,
    challenge: couponDeepLink?.slug,
  })
  const logoUrl_ = buildAffiliateUrl(firm.slug, {
    placement: 'logo',
    locale,
    challenge: couponDeepLink?.slug,
  })


  // Reference specs live in a collapsed block: complete, but not in the way.
  const specs: { label: string; value: string }[] = []
  if (firm.leverage_forex) specs.push({ label: 'Leverage (forex)', value: firm.leverage_forex })
  if (payoutSpeed) specs.push({ label: 'Payout speed', value: payoutSpeed })
  if (firm.min_payout) specs.push({ label: 'Minimum payout', value: `$${firm.min_payout}` })
  if (firm.scaling_max) specs.push({ label: 'Scaling plan', value: `Up to ${cleanMoneyLabel(firm.scaling_max)}` })
  if (firm.max_allocation) specs.push({ label: 'Max allocation', value: cleanMoneyLabel(firm.max_allocation) ?? firm.max_allocation })
  if (firm.drawdown_type) specs.push({ label: 'Drawdown type', value: firm.drawdown_type })
  if (firm.consistency_rule) specs.push({ label: 'Consistency rule', value: firm.consistency_rule })
  if (firm.time_limit) specs.push({ label: 'Time limit', value: firm.time_limit })
  if (payoutMethods.length > 0) specs.push({ label: 'Payout methods', value: payoutMethods.join(', ') })

  const policies: { icon: React.ReactNode; title: string; body: string }[] = []
  if (firm.commissions) policies.push({ icon: <Receipt className="w-4 h-4" />, title: 'Commissions', body: firm.commissions })
  if (firm.refund_policy) policies.push({ icon: <Wallet className="w-4 h-4" />, title: 'Refund policy', body: firm.refund_policy })
  if (firm.reset_fee) policies.push({ icon: <RotateCcw className="w-4 h-4" />, title: 'Reset fee', body: firm.reset_fee })
  if (firm.swap_free) policies.push({ icon: <Layers className="w-4 h-4" />, title: 'Swap-free option', body: firm.swap_free })

  const restrictedCountries = toArray(
    (firm as { restricted_countries?: string[] | string | null }).restricted_countries
  )

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

  // Only announce an end date while the offer is still running. Printing
  // "runs until 31 August" on 1 September is worse than printing nothing.
  const verifiedText = formatDayMonth(
    (firm as { data_verified_at?: string | null }).data_verified_at, locale)
  const ratingCheckedText = formatDayMonth(
    (firm as { rating_checked_at?: string | null }).rating_checked_at, locale)

  const expiryText = promotion.isActive ? formatDayMonth(firm.discount_expires_at, locale) : null

  return (
    // Bottom padding on mobile clears the fixed CTA bar; it is removed at lg
    // where the bar is hidden, and for print.
    <div className="min-h-screen bg-gray-950 pb-24 lg:pb-0 print:pb-0">
      {/* ================================================================ */}
      {/* 1. HERO — a benefit headline, proof, and the offer side by side  */}
      {/* ================================================================ */}
      <section className="pt-8 pb-10 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          {/* --- Copy --- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <a
                href={logoUrl_}
                {...AFFILIATE_LINK_PROPS}
                aria-label={couponDeepLink ? t.officialOffer : t.visit(firm.name)}
                className="relative w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 hover:border-emerald-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                {/* bg-white, not bg-gray-800. Most firms ship a dark-ink logo on
                    a transparent background: on a dark tile they render as an
                    empty square. Every other logo tile on the site (compare,
                    best-for, dashboard, admin, PromoTicker) is already white —
                    this one was the outlier. FirmLogo also falls back to a
                    monogram when the remote logo fails to load. */}
                <FirmLogo src={logoUrl} name={firm.name} size={56} className="text-xl" />
              </a>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{firm.name}</p>
                {(firm.category_badge || assets[0]) && (
                  <p className="text-emerald-400 text-xs font-medium">
                    {firm.category_badge || assets[0]}
                  </p>
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
                    <strong className="text-white font-semibold">{cleanMoneyLabel(s.value) ?? s.value}</strong>
                    {s.label ? ` ${s.label}` : ''}
                  </span>
                ))}
              </div>
            )}

            {verifiedText && (
              <p className="text-gray-500 text-xs mb-3">{t.verifiedOn(verifiedText, firm.name)}</p>
            )}

            <div className="flex flex-wrap gap-3 mb-4">
              {canConfigure && (
                <a
                  href="#challenges"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
                >
                  {t.chooseProgram}
                </a>
              )}
              <a
                href="#rules"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                {t.seeRules}
              </a>
            </div>

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
                    ({formatNumber(firm.trustpilot_reviews, locale)} {t.onTrustpilot})
                  </span>
                )}
                {/* Explicitly someone else's rating. It is collected by
                    Trustpilot from their reviewers; PropFirmScanner does not
                    gather ratings. The date says when we last read it. */}
                {ratingCheckedText && (
                  <span className="text-gray-600 text-[11px]">{t.ratingChecked(ratingCheckedText)}</span>
                )}
              </div>
            )}

            {firm.min_price > 0 && (
              <div className="mb-3">
                <p className="text-gray-500 text-sm">
                  {t.from}{' '}
                  {hasVerifiedDeal && <s className="text-gray-600">{money(firm.min_price)}</s>}
                </p>
                <p className="text-white">
                  <span className="text-3xl font-bold">
                    {money(
                      hasVerifiedDeal
                        ? Math.round(firm.min_price * (1 - (promotion.percent as number) / 100) * 100) / 100
                        : firm.min_price
                    )}
                  </span>
                  {isSubscription && <span className="text-gray-500 text-base">{t.perMonth}</span>}
                </p>
              </div>
            )}

            {hasVerifiedDeal && (
              <div className="mb-4 px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                <p className="text-emerald-300 text-sm font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  {t.codeAuto(promotion.code as string)}
                </p>
                {expiryText && (
                  <p className="text-gray-500 text-xs mt-1">{t.runsUntil(expiryText)}</p>
                )}
              </div>
            )}

            <a
              href={canConfigure ? '#challenges' : heroCtaUrl}
              {...(!canConfigure ? AFFILIATE_LINK_PROPS : {})}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
            >
              {canConfigure ? t.configure : t.visit(firm.name)}
              {!canConfigure && <ExternalLink className="w-4 h-4" />}
            </a>

            {(isSubscription ? t.billedMonthly : t.commission) && (
              <p className="text-gray-600 text-[11px] mt-3 text-center leading-relaxed">
                {isSubscription ? t.billedMonthly : t.commission}
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-800 space-y-1.5 text-xs">
              {foundedText && (
                <p className="text-gray-500">
                  {t.founded} <span className="text-gray-300">{foundedText}</span>
                </p>
              )}
              {firm.country && (
                <p className="text-gray-500">
                  {t.country} <span className="text-gray-300">{firm.country}</span>
                </p>
              )}
              {firm.is_regulated && (
                <p className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Shield className="w-3.5 h-3.5" /> {t.regulated}
                </p>
              )}
              {firm.website_url && (
                <a
                  href={officialSiteUrl}
                  {...AFFILIATE_LINK_PROPS}
                  className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors"
                >
                  {/* The label follows the destination: calling a checkout
                      page "official website" would be its own small lie. */}
                  <Globe className="w-3.5 h-3.5" />{' '}
                  {couponDeepLink ? t.officialOffer : t.officialSite}
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
      {canConfigure && (
        <div id="challenges" className="scroll-mt-28 print:scroll-mt-0">
          <ChallengeSelector
            firmSlug={firm.slug}
            firmName={firm.name}
            challenges={challenges}
            locale={locale}
            checkoutOptions={firm.checkout_options}
            programGuide={firm.program_guide}
            currency={currency}
            discountCode={promotion.code}
            discountPercent={promotion.percent}
            discountNote={firm.discount_note}
            includedItems={toArray(firm.included_items)}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* ============================================================== */}
        {/* 5. JOURNEY — what happens after you pay                       */}
        {/* ============================================================== */}
        {journey?.steps?.length ? (
          <section id="journey" className="scroll-mt-28 print:scroll-mt-0">
            <SectionHeading
              eyebrow={t.afterPass}
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
                            <dd className="text-white text-sm text-right">{cleanMoneyLabel(sp.value) ?? sp.value}</dd>
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
          <section id="costs" className="scroll-mt-28 print:scroll-mt-0">
            <SectionHeading
              eyebrow={t.noHidden}
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
              <SectionHeading eyebrow={t.includedValue} title={education.title} intro={education.intro} />
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
              <p className="text-white font-semibold mb-1">{t.freeWith}</p>
              <p className="text-gray-400 text-sm">{t.freeWithSub}</p>
            </div>
          </section>
        ) : null}

        {/* ============================================================== */}
        {/* 8. KEY RULES — four that matter, the rest folded away          */}
        {/* ============================================================== */}
        {keyRules?.rules?.length ? (
          <section id="rules" className="scroll-mt-28 print:scroll-mt-0">
            <SectionHeading
              eyebrow={t.beforeBuy}
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
              <Disclosure summary={t.seeAll}>
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
          <section id="progression" className="scroll-mt-28 print:scroll-mt-0">
            <SectionHeading eyebrow={t.scaling} title={tiers.title || 'Scaling plan'} intro={tiers.intro} />
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
          <section id="pros-cons" className="scroll-mt-28 print:scroll-mt-0">
            <SectionHeading
              eyebrow={t.honest}
              title={t.whyChoose(firm.name)}
              intro={t.honestIntro}
            />
            {/* items-start, not stretch: forcing equal heights would pad the
                shorter card with empty space now that it holds four items. */}
            <div className="grid md:grid-cols-2 gap-4 items-start">
              {pros.length > 0 && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    <h3 className="font-semibold text-white text-base">{t.strengths}</h3>
                  </div>
                  <ul className="space-y-2">
                    {pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-300 text-base leading-snug">
                        <Check
                          className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {cons.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/25 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <h3 className="font-semibold text-white text-base">{t.limitations}</h3>
                  </div>
                  <ul className="space-y-2">
                    {cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-300 text-base leading-snug">
                        <Info
                          className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>

                  {/* La liste complète des pays exclus est longue et n'intéresse
                      qu'une minorité de lecteurs — mais elle est décisive pour
                      eux. Repliée sous les points à connaître plutôt qu'absente
                      ou étalée. */}
                  {restrictedCountries.length > 0 && (
                    <div className="mt-4">
                      <Disclosure summary={t.restrictedCountries(restrictedCountries.length)}>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2">
                          {restrictedCountries.map((country) => (
                            <li
                              key={country}
                              className="text-gray-400 text-sm before:content-['·'] before:mr-3 before:text-gray-600 first:before:content-none first:before:mr-0"
                            >
                              {country}
                            </li>
                          ))}
                        </ul>
                      </Disclosure>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* 11. FULL REFERENCE — complete, but folded away                 */}
        {/* ============================================================== */}
        {hasReference && (
          <section id="reference" className="scroll-mt-28 print:scroll-mt-0">
            <Disclosure summary={t.fullSpecs}>
              <div className="space-y-6">
                {specs.length > 0 && (
                  <dl className="grid sm:grid-cols-2 gap-x-8">
                    {[specs.slice(0, Math.ceil(specs.length / 2)), specs.slice(Math.ceil(specs.length / 2))].map(
                      (column, ci) => (
                        <div key={ci} className="divide-y divide-gray-800/70">
                          {column.map((s) => (
                            <div key={s.label} className="flex items-baseline justify-between gap-4 py-3">
                              <dt className="text-gray-500 text-sm flex-shrink-0">{s.label}</dt>
                              <dd className="text-white text-sm text-right">{cleanMoneyLabel(s.value) ?? s.value}</dd>
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
                      {t.platforms}
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
                      {t.assets}
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
                      {t.about(firm.name)}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">{firm.description}</p>
                  </div>
                )}

                {firm.is_regulated && firm.regulation_details && (
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2.5">
                      {t.regulation}
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
                eyebrow={t.verdict}
                title={verdictCard.title || `Who we recommend ${firm.name} to`}
              />
              <p className="text-gray-300 leading-relaxed">{verdictCard.body}</p>
            </div>
            {verdictCard.points && verdictCard.points.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <p className="text-white font-semibold text-sm mb-3">{t.goodFit}</p>
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
        <section id="faq" className="scroll-mt-28 print:scroll-mt-0">
          <SectionHeading
            eyebrow="FAQ"
            title={t.faq}
            intro={t.faqIntro(firm.name)}
          />
          <div className="space-y-3">
            {generateFAQs(firm, isSubscription, locale).map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 14. FINAL CTA                                                  */}
        {/* ============================================================== */}
        {canConfigure && (
          <section className="bg-gray-900/70 border border-emerald-500/25 rounded-2xl p-8 text-center">
            {expiryText && (
              <p className="text-emerald-400 text-xs uppercase tracking-wider font-semibold mb-2">
                {t.runsUntil(expiryText)}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t.readyTitle}
            </h2>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              {t.readyIntro}
            </p>
            <a
              href="#challenges"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold rounded-lg transition-colors"
            >
              {t.readyCta(firm.name)}
            </a>
            {hasVerifiedDeal && (
              <p className="text-gray-600 text-xs mt-3">
                {t.partnerLink(promotion.code as string)}
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
            <h2 className="text-2xl font-bold text-white mb-6">{t.similar}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarFirms.map((sf) => (
                <Link
                  key={sf.id}
                  href={`/prop-firm/${sf.slug}`}
                  className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-emerald-500/30 transition-colors"
                >
                  <div className="relative w-10 h-10 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <FirmLogo src={sf.logo_url} name={sf.name} size={40} padding="p-1" />
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
              <p className="text-yellow-500 font-semibold mb-1">{t.riskTitle}</p>
              <p className="text-gray-400 text-sm">
                {t.risk}
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
  isSubscription = false,
  locale = 'en'
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const fr = locale === 'fr'
  const n = firm.name
  // French convention puts the currency after the amount, with a space.
  const money = (v: number) => formatMoney(v, fr ? 'fr' : 'en')

  // --- Legitimacy ------------------------------------------------------
  faqs.push({
    question: fr ? `${n} est-il fiable ?` : `Is ${n} legit?`,
    answer: firm.is_regulated
      ? fr
        ? `Oui. ${n} est une prop firm établie${
            firm.regulation_details ? `. ${firm.regulation_details}` : '.'
          }${firm.founded ? ` L’entreprise opère depuis ${firm.founded}.` : ''} Comme pour toute prop firm, lisez attentivement les règles avant d’acheter.`
        : `Yes. ${n} is an established prop trading firm${
            firm.regulation_details ? `. ${firm.regulation_details}` : '.'
          }${firm.founded ? ` It has been operating since ${firm.founded}.` : ''} As with any prop firm, review the rules carefully before purchasing.`
      : fr
      ? `${n} opère comme société de trading pour compte propre.${
          firm.founded ? ` Fondée en ${firm.founded},` : ''
        } elle propose des évaluations simulées et finance les traders qui les réussissent. Lisez les règles attentivement et envisagez de commencer sur une petite taille de compte.`
      : `${n} operates as a proprietary trading firm.${
          firm.founded ? ` Founded in ${firm.founded},` : ''
        } it offers simulated evaluations and funds traders who pass. Review the rules carefully and consider starting with a smaller account.`,
  })

  // --- Cost -------------------------------------------------------------
  if (firm.min_price) {
    const min = money(firm.min_price)
    const max = firm.max_price ? money(firm.max_price) : null
    faqs.push({
      question: fr ? `Combien coûte ${n} ?` : `How much does ${n} cost?`,
      answer: fr
        ? `${
            isSubscription
              ? `Les évaluations ${n} sont facturées mensuellement, à partir de ${min} par mois`
              : `Les évaluations ${n} démarrent à ${min}`
          }${max ? ` et montent jusqu’à ${max}${isSubscription ? ' par mois' : ''} pour les plus grandes tailles de compte` : ''}.${
            isSubscription
              ? ' L’abonnement se renouvelle tous les 30 jours et continue jusqu’à la réussite ou la résiliation : prévoyez plus d’un cycle.'
              : ''
          } Le configurateur ci-dessus affiche le prix exact de chaque programme et de chaque taille.`
        : `${
            isSubscription
              ? `${n} evaluations are billed monthly, starting at ${min} per month`
              : `${n} evaluations start at ${min}`
          }${max ? ` and going up to ${max}${isSubscription ? ' per month' : ''} for the largest account sizes` : ''}.${
            isSubscription
              ? ' The subscription renews every 30 days and keeps running until you pass or cancel, so budget for more than one cycle.'
              : ''
          } Use the configurator above for the exact price of each program and size.`,
    })
  }

  // --- Profit split ------------------------------------------------------
  // « jusqu'a X % » presentait le taux standard comme un plafond. Hantec Trader
  // nous l'a signale : 80 % est leur base, 95 % le maximum avec un add-on
  // payant. Annoncer « jusqu'a 80 % » sous-vendait la firme et decrivait mal
  // l'offre. Quand les deux valeurs different, on les distingue.
  if (firm.profit_split || firm.max_profit_split) {
    const base = firm.profit_split
    const max = firm.max_profit_split
    const tiered = base && max && max > base
    faqs.push({
      question: fr
        ? `Quel partage des profits propose ${n} ?`
        : `What profit split does ${n} offer?`,
      answer: tiered
        ? fr
          ? `${n} applique un partage de ${base} % en standard, qui peut monter jusqu’à ${max} %. Les conditions du taux supérieur — programme, palier ou option payante — sont détaillées dans les règles de cette page.`
          : `${n} pays a ${base}% profit split as standard, rising to ${max}%. What unlocks the higher rate — the programme, a scaling tier or a paid add-on — is set out in the rules on this page.`
        : fr
          ? `${n} applique un partage des profits de ${base || max} %. Le configurateur affiche le taux correspondant à votre sélection.`
          : `${n} pays a ${base || max}% profit split. The configurator shows the rate for your selection.`,
    })
  }

  // --- Permissions -------------------------------------------------------
  const permissions: string[] = []
  if (firm.allows_scalping) permissions.push(fr ? 'le scalping' : 'scalping')
  if (firm.allows_news_trading) permissions.push(fr ? 'le trading des actualités' : 'news trading')
  if (firm.allows_ea) permissions.push(fr ? 'les stratégies automatisées' : 'automated strategies')
  if (permissions.length > 0) {
    faqs.push({
      question: fr
        ? `${n} autorise-t-il le scalping et le trading des actualités ?`
        : `Does ${n} allow scalping and news trading?`,
      // La version precedente affirmait que « les comptes a financement
      // immediat et a fort levier sont generalement les plus restreints ».
      // Cette phrase ne venait d'aucune donnee : c'etait une generalisation
      // codee en dur, servie a l'identique pour les 350 firmes. Retiree.
      answer: fr
        ? `${n} autorise ${permissions.join(', ')}. Les conditions varient selon le programme et selon le stade — évaluation ou compte financé. Le détail applicable figure dans les règles de cette page et dans le configurateur.`
        : `${n} allows ${permissions.join(', ')}. The conditions vary by programme and by stage — evaluation or funded account. What applies where is set out in the rules on this page and in the configurator.`,
    })
  }

  // --- Payouts -----------------------------------------------------------
  if (firm.payout_frequency) {
    const speed = formatPayoutSpeed(firm)
    faqs.push({
      question: fr ? `Comment ${n} gère-t-il les retraits ?` : `How does ${n} handle payouts?`,
      answer: fr
        ? `${n} traite les retraits ${firm.payout_frequency.toLowerCase()}${
            speed ? `, généralement sous ${speed.toLowerCase()} après la demande` : ''
          }.${firm.min_payout ? ` Le retrait minimum est de ${money(firm.min_payout)}.` : ''}`
        : `${n} processes payouts ${firm.payout_frequency.toLowerCase()}${
            speed ? `, typically within ${speed.toLowerCase()} of request` : ''
          }.${firm.min_payout ? ` The minimum payout is ${money(firm.min_payout)}.` : ''}`,
    })
  }

  // --- Fees deducted at the first withdrawal ------------------------------
  if (firm.refund_policy) {
    faqs.push({
      question: fr
        ? `Quels frais sont déduits du premier retrait ?`
        : `What fees are deducted from the first withdrawal?`,
      answer: firm.refund_policy,
    })
  }

  // --- Scaling ------------------------------------------------------------
  if (firm.scaling_max) {
    faqs.push({
      question: fr
        ? `Quel capital maximum puis-je gérer chez ${n} ?`
        : `What is the maximum capital I can manage at ${n}?`,
      answer: fr
        ? `${n} permet aux traders qualifiés de gérer jusqu’à ${firm.scaling_max}.${
            firm.max_allocation ? ` ${firm.max_allocation}` : ''
          }`
        : `${n} lets qualified traders manage up to ${firm.scaling_max}.${
            firm.max_allocation ? ` ${firm.max_allocation}` : ''
          }`,
    })
  }

  return faqs
}
