'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ExternalLink, Check, Copy } from 'lucide-react'
import { buildAffiliateUrl, AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { formatMoney, cleanMoneyLabel } from '@/lib/format'

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
  /** Currency the firm prices in. Defaults to USD when the column is null. */
  currency?: string | null
  discountCode?: string | null
  discountPercent?: number | null
  discountNote?: string | null
  includedItems?: string[] | null
}

/**
 * Is there enough in these challenges to put a configurator in front of a
 * buyer?
 *
 * Some firms are imported with placeholder rows: one programme literally named
 * "Program", account sizes from 1,000 to 2,000,000, and a dash in every cell
 * that matters. Rendering the configurator anyway puts a payment button under
 * a price of "—", which reads as a broken site and taints the pages that are
 * correct.
 *
 * The bar is deliberately low: one challenge a visitor could actually act on,
 * meaning it has a price and a profit target. Firms below it fall back to the
 * firm-level content and a link to the official site, which the page already
 * renders when a firm has no challenges at all.
 *
 * Only a gate on the whole section, never a per-row filter: hiding individual
 * rows would quietly drop legitimate plans whose target is stored elsewhere.
 */
export function hasUsableChallenges(challenges: Challenge[]): boolean {
  return challenges.some(
    (c) =>
      c.price !== null &&
      c.price !== undefined &&
      (c.phase1_profit_target ?? c.profit_target_sum) !== null &&
      (c.phase1_profit_target ?? c.profit_target_sum) !== undefined
  )
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
    disclosure: 'Payment page pre-filled with your selection.',
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
    disclosure: 'Page de paiement préremplie avec votre sélection.',
    compareTitle: 'Lequel vous convient ?',
    compareIntro:
      'Une comparaison, pas un second choix — le configurateur ci-dessus a déjà enregistré votre sélection.',
    pick: (p: string) => `Sélectionner ${p}`,
    picked: 'Sélectionné',
  },
  de: {
    eyebrow: 'Konfigurator in 2 Schritten',
    title: 'Finden Sie das passende Programm',
    intro: 'Beginnen Sie mit Ihrem Ziel. Preis und Regeln aktualisieren sich automatisch.',
    step1: 'Wie möchten Sie finanziert werden?',
    step2: 'Wählen Sie Ihre Kontogröße',
    step3: 'Plattform und Datenfeed',
    sizes: (n: number) => `${n} Größe${n > 1 ? 'n' : ''}`,
    from: 'ab',
    selection: 'Ihre Auswahl',
    normally: 'regulär',
    perMonth: '/Monat',
    target: 'Gewinnziel',
    drawdown: 'Max. Drawdown',
    dailyLoss: 'Tagesverlust',
    contracts: 'Max. Kontrakte',
    split: 'Gewinnbeteiligung',
    included: 'Ohne Aufpreis enthalten',
    codeAuto: 'Code wird automatisch angewendet',
    cta: (firm: string) => `Weiter zu ${firm}`,
    ctaShort: 'Weiter',
    disclosure: 'Zahlungsseite mit Ihrer Auswahl vorausgefüllt.',
    compareTitle: 'Welches passt zu Ihnen?',
    compareIntro:
      'Ein Vergleich, keine zweite Entscheidung — der Konfigurator oben hat Ihre Auswahl bereits gespeichert.',
    pick: (p: string) => `${p} auswählen`,
    picked: 'Ausgewählt',
  },
  es: {
    eyebrow: 'Configurador en 2 pasos',
    title: 'Encuentra el programa que te encaja',
    intro: 'Empieza por tu objetivo. El precio y las reglas se actualizan solos.',
    step1: '¿Cómo quieres recibir financiación?',
    step2: 'Elige el tamaño de tu cuenta',
    step3: 'Plataforma y feed de datos',
    sizes: (n: number) => `${n} tamaño${n > 1 ? 's' : ''}`,
    from: 'desde',
    selection: 'Tu selección',
    normally: 'precio normal',
    perMonth: '/mes',
    target: 'Objetivo de beneficio',
    drawdown: 'Drawdown máximo',
    dailyLoss: 'Pérdida diaria',
    contracts: 'Contratos máximos',
    split: 'Reparto de beneficios',
    included: 'Incluido sin coste adicional',
    codeAuto: 'Código aplicado automáticamente',
    cta: (firm: string) => `Continuar a ${firm}`,
    ctaShort: 'Continuar',
    disclosure: 'Página de pago precargada con tu selección.',
    compareTitle: '¿Cuál te conviene?',
    compareIntro:
      'Una comparación, no una segunda decisión: el configurador de arriba ya tiene tu elección.',
    pick: (p: string) => `Seleccionar ${p}`,
    picked: 'Seleccionado',
  },
  pt: {
    eyebrow: 'Configurador em 2 etapas',
    title: 'Encontre o programa certo para si',
    intro: 'Comece pelo seu objetivo. O preço e as regras atualizam-se automaticamente.',
    step1: 'Como quer ser financiado?',
    step2: 'Escolha o tamanho da sua conta',
    step3: 'Plataforma e feed de dados',
    sizes: (n: number) => `${n} tamanho${n > 1 ? 's' : ''}`,
    from: 'a partir de',
    selection: 'A sua seleção',
    normally: 'preço normal',
    perMonth: '/mês',
    target: 'Objetivo de lucro',
    drawdown: 'Drawdown máximo',
    dailyLoss: 'Perda diária',
    contracts: 'Contratos máximos',
    split: 'Partilha de lucros',
    included: 'Incluído sem custo adicional',
    codeAuto: 'Código aplicado automaticamente',
    cta: (firm: string) => `Continuar para ${firm}`,
    ctaShort: 'Continuar',
    disclosure: 'Página de pagamento pré-preenchida com a sua seleção.',
    compareTitle: 'Qual é o certo para si?',
    compareIntro:
      'Uma comparação, não uma segunda decisão — o configurador acima já tem a sua escolha.',
    pick: (p: string) => `Selecionar ${p}`,
    picked: 'Selecionado',
  },
  ar: {
    eyebrow: 'أداة إعداد من خطوتين',
    title: 'اعثر على البرنامج المناسب لك',
    intro: 'ابدأ بهدفك. يتحدّث السعر والقواعد تلقائيًا مع اختيارك.',
    step1: 'كيف تريد الحصول على التمويل؟',
    step2: 'اختر حجم حسابك',
    step3: 'المنصة وتدفّق البيانات',
    sizes: (n: number) => `${n} حجم`,
    from: 'ابتداءً من',
    selection: 'اختيارك',
    normally: 'السعر العادي',
    perMonth: '/شهريًا',
    target: 'هدف الربح',
    drawdown: 'أقصى تراجع',
    dailyLoss: 'الخسارة اليومية',
    contracts: 'الحد الأقصى للعقود',
    split: 'تقاسم الأرباح',
    included: 'مشمول دون تكلفة إضافية',
    codeAuto: 'يُطبَّق الرمز تلقائيًا',
    cta: (firm: string) => `المتابعة إلى ${firm}`,
    ctaShort: 'متابعة',
    disclosure: 'صفحة الدفع مُعبّأة مسبقًا باختيارك.',
    compareTitle: 'أيّها يناسبك؟',
    compareIntro: 'مقارنة، لا قرار ثانٍ — أداة الإعداد أعلاه سجّلت اختيارك بالفعل.',
    pick: (p: string) => `اختيار ${p}`,
    picked: 'تم الاختيار',
  },
  hi: {
    eyebrow: '2 चरणों वाला कॉन्फ़िगरेटर',
    title: 'अपने लिए सही प्रोग्राम खोजें',
    intro: 'अपने लक्ष्य से शुरू करें। कीमत और नियम अपने आप अपडेट होते हैं।',
    step1: 'आप फ़ंडिंग कैसे चाहते हैं?',
    step2: 'अपने खाते का आकार चुनें',
    step3: 'प्लेटफ़ॉर्म और डेटा फ़ीड',
    sizes: (n: number) => `${n} आकार`,
    from: 'से शुरू',
    selection: 'आपका चयन',
    normally: 'सामान्य कीमत',
    perMonth: '/माह',
    target: 'लाभ लक्ष्य',
    drawdown: 'अधिकतम ड्रॉडाउन',
    dailyLoss: 'दैनिक हानि',
    contracts: 'अधिकतम कॉन्ट्रैक्ट',
    split: 'लाभ का बँटवारा',
    included: 'बिना अतिरिक्त शुल्क के शामिल',
    codeAuto: 'कोड अपने आप लागू',
    cta: (firm: string) => `${firm} पर जारी रखें`,
    ctaShort: 'जारी रखें',
    disclosure: 'भुगतान पृष्ठ आपके चयन के साथ पहले से भरा हुआ।',
    compareTitle: 'आपके लिए कौन-सा सही है?',
    compareIntro:
      'यह तुलना है, दूसरा निर्णय नहीं — ऊपर के कॉन्फ़िगरेटर में आपका चयन पहले से दर्ज है।',
    pick: (p: string) => `${p} चुनें`,
    picked: 'चुना गया',
  },
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * The programme name is whatever precedes the account size in the challenge
 * name: "IF Micro $5,000" belongs to "IF Micro".
 *
 * The size token has to start with a digit, or with the currency sign. It is
 * tempting to write the class as [\d,.KMk]+ so that "50K" matches, but K and M
 * then also match the first letter of the next word — and the quantifier is
 * lazy, so "IF Micro $5,000" stopped at the M of Micro and grouped under "IF".
 * That silently merged IF Micro with IF Micro Clarity under one meaningless
 * heading, and did the same to One-Phase Micro and to Earn2Trade's Gauntlet
 * Mini. Anchoring on a digit keeps "50K" working without swallowing words.
 */
function extractProgram(challengeName: string | null): string {
  if (!challengeName) return 'Program'
  const m = challengeName.match(/^(.+?)\s+\$?\d[\d,.]*[KMkm]?/)
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

// French writes the currency after the amount, with a space: "75 $/mois".
// Putting the dollar sign in front reads as a translation nobody proofread.
function formatPrice(price: number | null, suffix = '', locale = 'en', currency = 'USD'): string {
  if (price === null || price === undefined) return '—'
  return formatMoney(price, locale, suffix, currency)
}

// Risk figures are percentages on forex firms and dollar amounts on futures
// firms. Rendering 2000 as "2000%" instead of "$2,000" is a different claim,
// so the unit travels with the challenge.
function fmtRisk(value: number | null | undefined, unit?: string | null, locale = 'en', currency = 'USD'): string {
  if (value === null || value === undefined) return '—'
  if (unit === 'usd') {
    // risk_unit says the figure is an amount, not a percentage. The account
    // itself is denominated in the firm's currency.
    return formatMoney(Number(value), locale, '', currency)
  }
  return locale === 'fr' ? `${value}\u00A0%` : `${value}%`
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ChallengeSelector({
  firmSlug,
  firmName,
  challenges,
  locale = 'en',
  currency: currencyProp,
  checkoutOptions,
  programGuide,
  discountCode,
  discountPercent,
  discountNote,
  includedItems,
}: Props) {
  // La colonne peut etre nulle : le dollar reste le defaut.
  const currency = currencyProp || 'USD'
  // Les sept locales : de/es/pt/ar/hi retombaient sur l anglais.
  const t = COPY[locale as keyof typeof COPY] ?? COPY.en
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

  if (!hasUsableChallenges(challenges)) return null

  const riskUnit = currentChallenge?.risk_unit
  const keyNumbers = [
    { label: t.target, value: fmtRisk(currentChallenge?.phase1_profit_target, riskUnit, locale, currency) },
    { label: t.drawdown, value: fmtRisk(currentChallenge?.max_drawdown, riskUnit, locale, currency) },
    { label: t.dailyLoss, value: fmtRisk(currentChallenge?.max_daily_loss, riskUnit, locale, currency) },
    currentChallenge?.max_contracts
      ? { label: t.contracts, value: String(currentChallenge.max_contracts) }
      : { label: t.split, value: fmtRisk(currentChallenge?.profit_split, null, locale, currency) },
  ]

  return (
    <section
      id="challenges"
      ref={configRef}
      className="px-4 py-8 border-y border-gray-800 bg-gray-900/20 scroll-mt-28 print:scroll-mt-0"
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
                        {cheapest !== null && ` · ${t.from} ${formatPrice(cheapest, priceSuffix, locale, currency)}`}
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
                        {cleanMoneyLabel(c.account_size)}
                      </span>
                      <span className="block text-gray-500 text-sm">
                        {formatPrice(p, priceSuffix, locale, currency)}
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
              {selectedProgram} {cleanMoneyLabel(currentChallenge?.account_size)}
            </p>

            <div className="mb-3">
              <p className="text-white leading-none">
                <span className="text-3xl font-bold">{formatPrice(displayPrice.final, '', locale, currency)}</span>
                {isSubscription && <span className="text-gray-500 text-base">{t.perMonth}</span>}
              </p>
              {displayPrice.hasDiscount && displayPrice.original !== null && (
                <p className="text-gray-500 text-sm mt-1">
                  {discountNote ? `${discountNote} ` : ''}
                  <span className="text-gray-400">
                    {formatPrice(displayPrice.original, priceSuffix, locale, currency)} {t.normally}
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
          <div id="program-guide" className="mt-8 scroll-mt-28 print:scroll-mt-0">
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
      <div className="lg:hidden print:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-950/95 backdrop-blur border-t border-gray-800 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-gray-500 text-xs truncate">
              {selectedProgram} · {cleanMoneyLabel(currentChallenge?.account_size)}
            </p>
            <p className="text-white text-base font-bold leading-tight">
              {formatPrice(displayPrice.final, priceSuffix, locale, currency)}
              {displayPrice.hasDiscount && displayPrice.original !== null && (
                <s className="text-gray-600 text-sm font-normal ml-1.5">
                  {formatPrice(displayPrice.original, '', locale, currency)}
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
