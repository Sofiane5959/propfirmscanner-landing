'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  ChevronRight, ChevronLeft, ExternalLink,
  Zap, TrendingUp, Shield, RefreshCw,
  GitCompare, RotateCcw, Star, BadgeCheck,
  Sprout, BarChart2, Flame,
  Timer, Newspaper, Bot, Moon,
  DollarSign, Banknote, PiggyBank,
} from 'lucide-react'

// =====================================================
// LOCALE
// =====================================================
const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const
type Locale = (typeof locales)[number]

function getLocaleFromPath(p: string): Locale {
  const s = p.split('/')[1]
  return locales.includes(s as Locale) ? (s as Locale) : 'en'
}

// =====================================================
// TYPES
// =====================================================
interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  min_price: number
  max_profit_split: number
  profit_split: number
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  fee_refund: boolean
  trust_status: string
  challenge_types: string[]
  platforms: string[]
  discount_percent: number
  discount_code: string
  affiliate_url_exists?: boolean
}

interface Answers {
  experience: string
  style: string
  budget: string
  priority: string
}

// =====================================================
// QUIZ QUESTIONS
// =====================================================
const QUESTIONS = [
  {
    id: 'experience',
    emoji: '🧠',
    title: "What's your trading experience?",
    subtitle: 'Be honest — it helps us match you better.',
    options: [
      { value: 'beginner', label: 'Beginner', sub: 'Less than 1 year', icon: Sprout, color: 'emerald' },
      { value: 'intermediate', label: 'Intermediate', sub: '1–3 years trading', icon: BarChart2, color: 'blue' },
      { value: 'advanced', label: 'Advanced', sub: '3+ years, profitable', icon: Flame, color: 'orange' },
    ],
  },
  {
    id: 'style',
    emoji: '⚡',
    title: 'How do you trade?',
    subtitle: 'Your style determines which rules matter most.',
    options: [
      { value: 'scalping', label: 'Scalping', sub: 'Fast in & out, tight spreads', icon: Timer, color: 'yellow' },
      { value: 'news', label: 'News Trading', sub: 'Events & macro moves', icon: Newspaper, color: 'purple' },
      { value: 'ea', label: 'EAs / Bots', sub: 'Automated systems', icon: Bot, color: 'blue' },
      { value: 'swing', label: 'Swing / Overnight', sub: 'Hold days or weeks', icon: Moon, color: 'indigo' },
    ],
  },
  {
    id: 'budget',
    emoji: '💵',
    title: "What's your challenge budget?",
    subtitle: 'The fee to enter the funded program.',
    options: [
      { value: 'low', label: 'Under $100', sub: 'Budget-friendly entry', icon: PiggyBank, color: 'emerald' },
      { value: 'mid', label: '$100 – $300', sub: 'Mid-range challenge', icon: Banknote, color: 'blue' },
      { value: 'high', label: '$300+', sub: 'Larger account size', icon: DollarSign, color: 'purple' },
    ],
  },
  {
    id: 'priority',
    emoji: '🏆',
    title: 'What matters most to you?',
    subtitle: 'We\'ll weight your results around this.',
    options: [
      { value: 'split', label: 'High Profit Split', sub: 'Keep as much as possible', icon: TrendingUp, color: 'emerald' },
      { value: 'instant', label: 'Instant Funding', sub: 'No challenge phase', icon: Zap, color: 'yellow' },
      { value: 'trust', label: 'Trusted & Established', sub: 'Top Trustpilot rating', icon: Shield, color: 'blue' },
      { value: 'refund', label: 'Fee Refund on Pass', sub: 'Get your entry fee back', icon: RefreshCw, color: 'orange' },
    ],
  },
]

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; icon: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/60', text: 'text-emerald-400', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/60',    text: 'text-blue-400',    icon: 'text-blue-400',    glow: 'shadow-blue-500/20' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/60',  text: 'text-orange-400',  icon: 'text-orange-400',  glow: 'shadow-orange-500/20' },
  yellow:  { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/60',  text: 'text-yellow-400',  icon: 'text-yellow-400',  glow: 'shadow-yellow-500/20' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/60',  text: 'text-purple-400',  icon: 'text-purple-400',  glow: 'shadow-purple-500/20' },
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/60',  text: 'text-indigo-400',  icon: 'text-indigo-400',  glow: 'shadow-indigo-500/20' },
}

// =====================================================
// SCORING ENGINE
// =====================================================
function scoreFirm(firm: PropFirm, answers: Answers): number {
  let score = 0

  // --- Experience ---
  if (answers.experience === 'beginner') {
    if (firm.min_price && firm.min_price <= 150) score += 20
    if (firm.trustpilot_rating >= 4.4) score += 15
    if (firm.fee_refund) score += 10
    if (firm.has_instant_funding) score += 5
  } else if (answers.experience === 'intermediate') {
    if (firm.trustpilot_rating >= 4.2) score += 15
    if (firm.max_profit_split >= 80) score += 15
  } else {
    // advanced
    if (firm.max_profit_split >= 90) score += 25
    if (firm.allows_scalping) score += 10
  }

  // --- Style ---
  if (answers.style === 'scalping' && firm.allows_scalping) score += 30
  if (answers.style === 'news' && firm.allows_news_trading) score += 30
  if (answers.style === 'ea' && firm.allows_ea) score += 30
  if (answers.style === 'swing' && firm.allows_weekend_holding) score += 30

  // --- Budget ---
  if (answers.budget === 'low') {
    if (firm.min_price && firm.min_price <= 80) score += 25
    else if (firm.min_price && firm.min_price <= 150) score += 12
  } else if (answers.budget === 'mid') {
    if (firm.min_price && firm.min_price >= 80 && firm.min_price <= 350) score += 20
  } else {
    // high budget = ok with any price, bonus for larger accounts
    score += 10
    if (firm.max_profit_split >= 85) score += 10
  }

  // --- Priority ---
  if (answers.priority === 'split') {
    if (firm.max_profit_split >= 95) score += 30
    else if (firm.max_profit_split >= 90) score += 20
    else if (firm.max_profit_split >= 80) score += 10
  }
  if (answers.priority === 'instant' && firm.has_instant_funding) score += 35
  if (answers.priority === 'trust') {
    if (firm.trustpilot_rating >= 4.6) score += 30
    else if (firm.trustpilot_rating >= 4.3) score += 18
    else if (firm.trustpilot_rating >= 4.0) score += 8
  }
  if (answers.priority === 'refund' && firm.fee_refund) score += 35

  // Bonus: discount makes a firm more attractive
  if (firm.discount_percent > 0) score += 5

  // Bonus: verified trust
  if (firm.trust_status === 'verified') score += 5

  return score
}

function getMatchPercent(score: number, maxScore: number): number {
  if (maxScore === 0) return 0
  return Math.min(99, Math.round((score / maxScore) * 100))
}

// =====================================================
// HELPERS
// =====================================================
const getFirmUrl = (firm: PropFirm) => {
  if (firm.affiliate_url && firm.affiliate_url !== '#') return firm.affiliate_url
  if (firm.website_url && firm.website_url !== '#') return firm.website_url
  return `https://www.google.com/search?q=${encodeURIComponent(firm.name + ' prop firm')}`
}

const formatSplit = (s: number | undefined, m: number | undefined) => {
  if (!s && !m) return 'N/A'
  if (!s) return `${m}%`
  if (!m) return `${s}%`
  const mn = Math.min(s, m), mx = Math.max(s, m)
  return mn === mx ? `${mn}%` : `${mn}→${mx}%`
}

// =====================================================
// COMPONENTS
// =====================================================
const ProgressBar = ({ step, total }: { step: number; total: number }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
        style={{ width: `${((step) / total) * 100}%` }}
      />
    </div>
    <span className="text-xs text-gray-500 font-medium tabular-nums">{step}/{total}</span>
  </div>
)

const MatchBar = ({ percent }: { percent: number }) => {
  const color = percent >= 85 ? 'from-emerald-500 to-emerald-400'
    : percent >= 70 ? 'from-blue-500 to-blue-400'
    : 'from-gray-500 to-gray-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${percent >= 85 ? 'text-emerald-400' : percent >= 70 ? 'text-blue-400' : 'text-gray-400'}`}>
        {percent}%
      </span>
    </div>
  )
}

// =====================================================
// MAIN QUIZ CLIENT
// =====================================================
export default function QuizClient() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = getLocaleFromPath(pathname)
  const supabase = createClientComponentClient()

  const [firms, setFirms] = useState<PropFirm[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(searchParams.get('start') === 'true' ? 1 : 0) // auto-start if ?start=true
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])

  const currentQuestion = QUESTIONS[step - 1]
  const isComplete = step > QUESTIONS.length

  // Fetch firms on mount
  useEffect(() => {
    const fetchFirms = async () => {
      const { data } = await supabase
        .from('prop_firms')
        .select(`
          id, name, slug, logo_url, website_url, affiliate_url,
          trustpilot_rating, trustpilot_reviews,
          min_price, max_profit_split, profit_split,
          allows_scalping, allows_news_trading, allows_ea, allows_weekend_holding,
          has_instant_funding, fee_refund, trust_status,
          challenge_types, platforms, discount_percent, discount_code
        `)
        .neq('trust_status', 'banned')
      if (data) setFirms(data as PropFirm[])
      setLoading(false)
    }
    fetchFirms()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Results
  const results = useMemo(() => {
    if (!isComplete || firms.length === 0) return []
    const fullAnswers = answers as Answers
    const scored = firms.map(f => ({ firm: f, score: scoreFirm(f, fullAnswers) }))
    scored.sort((a, b) => b.score - a.score)
    const top = scored.slice(0, 3)
    const maxScore = top[0]?.score || 1
    return top.map(({ firm, score }) => ({
      firm,
      score,
      matchPercent: getMatchPercent(score, maxScore),
    }))
  }, [isComplete, firms, answers])

  const handleSelect = (value: string) => {
    if (animating) return
    setSelected(value)
  }

  const handleNext = () => {
    if (!selected || animating) return
    setAnimating(true)
    const qId = currentQuestion.id as keyof Answers
    setAnswers(prev => ({ ...prev, [qId]: selected }))
    setTimeout(() => {
      setSelected(null)
      setStep(s => s + 1)
      setAnimating(false)
    }, 280)
  }

  const handleBack = () => {
    if (step === 0) return
    setAnimating(true)
    setTimeout(() => {
      setSelected(null)
      setStep(s => s - 1)
      setAnimating(false)
    }, 200)
  }

  const handleRestart = () => {
    setAnswers({})
    setSelected(null)
    setStep(0)
    setCompareList([])
  }

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(f => f !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const handleCompareNow = () => {
    if (compareList.length === 0) return
    const slugs = results
      .filter(r => compareList.includes(r.firm.id))
      .map(r => r.firm.slug)
      .join('-vs-')
    router.push(`/${locale}/compare?q=`)
  }

  // ---- INTRO ----
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium mb-8">
            <BadgeCheck className="w-3.5 h-3.5" />
            Personalized matching — free, no signup
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Find your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
              perfect
            </span>{' '}
            prop firm
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Answer 4 quick questions and we'll match you with the best prop firms for your style, budget, and goals.
          </p>

          {/* Stats strip */}
          <div className="flex items-center justify-center gap-8 mb-10">
            {[
              { value: '4', label: 'Questions' },
              { value: '~60s', label: 'Time needed' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
          >
            Start matching
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-gray-600 mt-4">No account required</p>
        </div>
      </div>
    )
  }

  // ---- RESULTS ----
  if (isComplete) {
    const badges = ['🥇 Best Match', '🥈 Runner Up', '🥉 Also Great']

    return (
      <div className="min-h-screen bg-gray-950 px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-emerald-400 text-sm font-medium mb-2">Your personalized results</p>
            <h2 className="text-3xl font-bold text-white mb-2">Here are your top matches</h2>
            <p className="text-gray-500 text-sm">Based on your experience, style, budget and priorities.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse h-36" />
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {results.map(({ firm, matchPercent }, i) => {
                const isInCompare = compareList.includes(firm.id)
                return (
                  <div
                    key={firm.id}
                    className={`bg-gray-900 border rounded-2xl p-5 transition-all ${
                      i === 0 ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10' : 'border-gray-800'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-gray-500">{badges[i]}</span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wide">
                          Top Pick
                        </span>
                      )}
                    </div>

                    {/* Firm info */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-1.5 flex-shrink-0">
                        {firm.logo_url
                          ? <Image src={firm.logo_url} alt={firm.name} width={56} height={56} className="object-contain" />
                          : <span className="text-xl font-bold text-emerald-600">{firm.name[0]}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-lg">{firm.name}</h3>
                          {firm.trust_status === 'verified' && (
                            <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            {firm.trustpilot_rating?.toFixed(1) || 'N/A'}
                          </span>
                          <span className="text-emerald-400 font-medium">
                            {formatSplit(firm.profit_split, firm.max_profit_split)}
                          </span>
                          <span>${firm.min_price || 'N/A'} entry</span>
                          {firm.discount_percent > 0 && (
                            <span className="text-orange-400 font-medium">{firm.discount_percent}% OFF</span>
                          )}
                        </div>
                        {/* Match bar */}
                        <MatchBar percent={matchPercent} />
                      </div>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {firm.allows_scalping && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-md font-medium">✓ Scalping</span>}
                      {firm.allows_news_trading && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-md font-medium">✓ News Trading</span>}
                      {firm.allows_ea && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-md font-medium">✓ EAs/Bots</span>}
                      {firm.has_instant_funding && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] rounded-md font-medium">⚡ Instant</span>}
                      {firm.fee_refund && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded-md font-medium">↩ Fee Refund</span>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <a
                        href={getFirmUrl(firm)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        Visit {firm.name} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => toggleCompare(firm.id)}
                        aria-pressed={isInCompare}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border ${
                          isInCompare
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-blue-500/40 hover:text-blue-400'
                        }`}
                      >
                        <GitCompare className="w-4 h-4" />
                        {isInCompare ? 'Added' : 'Compare'}
                      </button>
                      <Link
                        href={`/${locale}/compare`}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600 hover:text-white transition-all"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Compare CTA */}
          {compareList.length >= 2 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between mb-6">
              <div>
                <p className="text-white font-medium text-sm">{compareList.length} firms selected</p>
                <p className="text-blue-400 text-xs">Compare them side by side</p>
              </div>
              <Link
                href={`/${locale}/compare`}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors"
              >
                <GitCompare className="w-4 h-4" />
                Compare Now
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Retake quiz
            </button>
            <Link
              href={`/${locale}/compare`}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Browse all firms →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ---- QUESTION STEP ----
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <ProgressBar step={step} total={QUESTIONS.length} />

        <div
          className={`transition-all duration-280 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
        >
          {/* Question header */}
          <div className="mb-8">
            <span className="text-4xl mb-3 block">{currentQuestion.emoji}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
              {currentQuestion.title}
            </h2>
            <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map(opt => {
              const isSelected = selected === opt.value
              const colors = COLOR_MAP[opt.color]
              const Icon = opt.icon
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                    isSelected
                      ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
                      : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? colors.bg : 'bg-gray-800 group-hover:bg-gray-700'
                  }`}>
                    <Icon className={`w-5 h-5 transition-colors ${isSelected ? colors.icon : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm transition-colors ${isSelected ? colors.text : 'text-white'}`}>
                      {opt.label}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{opt.sub}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? `${colors.border} ${colors.bg}` : 'border-gray-700'
                  }`}>
                    {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
              aria-label="Previous question"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={!selected}
              className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:shadow-none"
            >
              {step === QUESTIONS.length ? 'See my matches' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
