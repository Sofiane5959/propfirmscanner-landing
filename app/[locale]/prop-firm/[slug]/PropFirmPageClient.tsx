'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
  Heart,
  Share2,
} from 'lucide-react'

// =============================================================================
// LOCALE DETECTION & TRANSLATIONS
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Hero
    verified: 'Verified',
    reviews: 'reviews',
    founded: 'Founded',
    website: 'Website',
    // Quick Stats
    startingFrom: 'Starting From',
    profitSplit: 'Profit Split',
    dailyDrawdown: 'Daily Drawdown',
    totalDrawdown: 'Total Drawdown',
    // CTA Card
    off: 'OFF',
    exclusiveCode: 'Exclusive Code',
    copied: 'Copied!',
    visit: 'Visit',
    saved: 'Saved',
    save: 'Save',
    share: 'Share',
    // Challenge Rules
    challengeRules: 'Challenge Rules',
    phase1Target: 'Phase 1 Target',
    phase2Target: 'Phase 2 Target',
    minTradingDays: 'Min Trading Days',
    timeLimit: 'Time Limit',
    drawdownType: 'Drawdown Type',
    consistencyRule: 'Consistency Rule',
    unlimited: 'Unlimited',
    none: 'None',
    na: 'N/A',
    // Trading Permissions
    tradingPermissions: 'Trading Permissions',
    scalpingAllowed: 'Scalping Allowed',
    newsTrading: 'News Trading',
    easBots: 'EAs / Bots',
    weekendHolding: 'Weekend Holding',
    instantFunding: 'Instant Funding',
    feeRefundable: 'Fee Refundable',
    // Platforms & Assets
    platformsAssets: 'Platforms & Assets',
    tradingPlatforms: 'Trading Platforms',
    availableAssets: 'Available Assets',
    // Payout
    payoutInformation: 'Payout Information',
    payoutFrequency: 'Payout Frequency',
    scalingPlan: 'Scaling Plan',
    // Sidebar
    similarFirms: 'Similar Firms',
    tradingRiskWarning: 'Trading Risk Warning',
    riskDisclaimer: 'Trading involves substantial risk. Only trade with capital you can afford to lose.',
  },
  fr: {
    verified: 'Vérifié',
    reviews: 'avis',
    founded: 'Fondé en',
    website: 'Site Web',
    startingFrom: 'À partir de',
    profitSplit: 'Partage des Profits',
    dailyDrawdown: 'Drawdown Journalier',
    totalDrawdown: 'Drawdown Total',
    off: 'DE RÉDUCTION',
    exclusiveCode: 'Code Exclusif',
    copied: 'Copié !',
    visit: 'Visiter',
    saved: 'Sauvegardé',
    save: 'Sauvegarder',
    share: 'Partager',
    challengeRules: 'Règles du Challenge',
    phase1Target: 'Objectif Phase 1',
    phase2Target: 'Objectif Phase 2',
    minTradingDays: 'Jours de Trading Min',
    timeLimit: 'Limite de Temps',
    drawdownType: 'Type de Drawdown',
    consistencyRule: 'Règle de Consistance',
    unlimited: 'Illimité',
    none: 'Aucun',
    na: 'N/A',
    tradingPermissions: 'Autorisations de Trading',
    scalpingAllowed: 'Scalping Autorisé',
    newsTrading: 'Trading sur Actualités',
    easBots: 'EAs / Robots',
    weekendHolding: 'Positions Week-end',
    instantFunding: 'Financement Instantané',
    feeRefundable: 'Frais Remboursables',
    platformsAssets: 'Plateformes & Actifs',
    tradingPlatforms: 'Plateformes de Trading',
    availableAssets: 'Actifs Disponibles',
    payoutInformation: 'Informations de Paiement',
    payoutFrequency: 'Fréquence des Paiements',
    scalingPlan: 'Plan de Scaling',
    similarFirms: 'Firms Similaires',
    tradingRiskWarning: 'Avertissement sur les Risques',
    riskDisclaimer: 'Le trading comporte des risques substantiels. Ne tradez qu\'avec un capital que vous pouvez vous permettre de perdre.',
  },
  de: {
    verified: 'Verifiziert',
    reviews: 'Bewertungen',
    founded: 'Gegründet',
    website: 'Webseite',
    startingFrom: 'Ab',
    profitSplit: 'Gewinnaufteilung',
    dailyDrawdown: 'Täglicher Drawdown',
    totalDrawdown: 'Gesamt Drawdown',
    off: 'RABATT',
    exclusiveCode: 'Exklusiver Code',
    copied: 'Kopiert!',
    visit: 'Besuchen',
    saved: 'Gespeichert',
    save: 'Speichern',
    share: 'Teilen',
    challengeRules: 'Challenge-Regeln',
    phase1Target: 'Phase 1 Ziel',
    phase2Target: 'Phase 2 Ziel',
    minTradingDays: 'Min. Handelstage',
    timeLimit: 'Zeitlimit',
    drawdownType: 'Drawdown-Typ',
    consistencyRule: 'Konsistenzregel',
    unlimited: 'Unbegrenzt',
    none: 'Keine',
    na: 'N/A',
    tradingPermissions: 'Handelsberechtigungen',
    scalpingAllowed: 'Scalping Erlaubt',
    newsTrading: 'News Trading',
    easBots: 'EAs / Bots',
    weekendHolding: 'Wochenend-Halten',
    instantFunding: 'Sofort-Finanzierung',
    feeRefundable: 'Gebühr Erstattbar',
    platformsAssets: 'Plattformen & Assets',
    tradingPlatforms: 'Handelsplattformen',
    availableAssets: 'Verfügbare Assets',
    payoutInformation: 'Auszahlungsinformationen',
    payoutFrequency: 'Auszahlungsfrequenz',
    scalingPlan: 'Scaling-Plan',
    similarFirms: 'Ähnliche Firmen',
    tradingRiskWarning: 'Handelsrisiko-Warnung',
    riskDisclaimer: 'Trading birgt erhebliche Risiken. Handeln Sie nur mit Kapital, dessen Verlust Sie sich leisten können.',
  },
  es: {
    verified: 'Verificado',
    reviews: 'reseñas',
    founded: 'Fundado en',
    website: 'Sitio Web',
    startingFrom: 'Desde',
    profitSplit: 'División de Ganancias',
    dailyDrawdown: 'Drawdown Diario',
    totalDrawdown: 'Drawdown Total',
    off: 'DE DESCUENTO',
    exclusiveCode: 'Código Exclusivo',
    copied: '¡Copiado!',
    visit: 'Visitar',
    saved: 'Guardado',
    save: 'Guardar',
    share: 'Compartir',
    challengeRules: 'Reglas del Desafío',
    phase1Target: 'Objetivo Fase 1',
    phase2Target: 'Objetivo Fase 2',
    minTradingDays: 'Días Mín. de Trading',
    timeLimit: 'Límite de Tiempo',
    drawdownType: 'Tipo de Drawdown',
    consistencyRule: 'Regla de Consistencia',
    unlimited: 'Ilimitado',
    none: 'Ninguno',
    na: 'N/A',
    tradingPermissions: 'Permisos de Trading',
    scalpingAllowed: 'Scalping Permitido',
    newsTrading: 'Trading de Noticias',
    easBots: 'EAs / Bots',
    weekendHolding: 'Mantener Fin de Semana',
    instantFunding: 'Financiamiento Instantáneo',
    feeRefundable: 'Tarifa Reembolsable',
    platformsAssets: 'Plataformas y Activos',
    tradingPlatforms: 'Plataformas de Trading',
    availableAssets: 'Activos Disponibles',
    payoutInformation: 'Información de Pago',
    payoutFrequency: 'Frecuencia de Pago',
    scalingPlan: 'Plan de Escalado',
    similarFirms: 'Firmas Similares',
    tradingRiskWarning: 'Advertencia de Riesgo',
    riskDisclaimer: 'El trading conlleva un riesgo sustancial. Solo opere con capital que pueda permitirse perder.',
  },
  pt: {
    verified: 'Verificado',
    reviews: 'avaliações',
    founded: 'Fundado em',
    website: 'Website',
    startingFrom: 'A partir de',
    profitSplit: 'Divisão de Lucros',
    dailyDrawdown: 'Drawdown Diário',
    totalDrawdown: 'Drawdown Total',
    off: 'DE DESCONTO',
    exclusiveCode: 'Código Exclusivo',
    copied: 'Copiado!',
    visit: 'Visitar',
    saved: 'Salvo',
    save: 'Salvar',
    share: 'Compartilhar',
    challengeRules: 'Regras do Desafio',
    phase1Target: 'Meta Fase 1',
    phase2Target: 'Meta Fase 2',
    minTradingDays: 'Dias Mín. de Trading',
    timeLimit: 'Limite de Tempo',
    drawdownType: 'Tipo de Drawdown',
    consistencyRule: 'Regra de Consistência',
    unlimited: 'Ilimitado',
    none: 'Nenhum',
    na: 'N/A',
    tradingPermissions: 'Permissões de Trading',
    scalpingAllowed: 'Scalping Permitido',
    newsTrading: 'Trading de Notícias',
    easBots: 'EAs / Robôs',
    weekendHolding: 'Manter no Fim de Semana',
    instantFunding: 'Financiamento Instantâneo',
    feeRefundable: 'Taxa Reembolsável',
    platformsAssets: 'Plataformas e Ativos',
    tradingPlatforms: 'Plataformas de Trading',
    availableAssets: 'Ativos Disponíveis',
    payoutInformation: 'Informações de Pagamento',
    payoutFrequency: 'Frequência de Pagamento',
    scalingPlan: 'Plano de Escalonamento',
    similarFirms: 'Firmas Similares',
    tradingRiskWarning: 'Aviso de Risco',
    riskDisclaimer: 'Trading envolve risco substancial. Opere apenas com capital que você pode perder.',
  },
  ar: {
    verified: 'موثق',
    reviews: 'تقييمات',
    founded: 'تأسست في',
    website: 'الموقع',
    startingFrom: 'يبدأ من',
    profitSplit: 'تقسيم الأرباح',
    dailyDrawdown: 'السحب اليومي',
    totalDrawdown: 'السحب الإجمالي',
    off: 'خصم',
    exclusiveCode: 'كود حصري',
    copied: 'تم النسخ!',
    visit: 'زيارة',
    saved: 'محفوظ',
    save: 'حفظ',
    share: 'مشاركة',
    challengeRules: 'قواعد التحدي',
    phase1Target: 'هدف المرحلة 1',
    phase2Target: 'هدف المرحلة 2',
    minTradingDays: 'الحد الأدنى لأيام التداول',
    timeLimit: 'الحد الزمني',
    drawdownType: 'نوع السحب',
    consistencyRule: 'قاعدة الاتساق',
    unlimited: 'غير محدود',
    none: 'لا يوجد',
    na: 'غير متاح',
    tradingPermissions: 'أذونات التداول',
    scalpingAllowed: 'السكالبينج مسموح',
    newsTrading: 'تداول الأخبار',
    easBots: 'الروبوتات / EAs',
    weekendHolding: 'الاحتفاظ لعطلة نهاية الأسبوع',
    instantFunding: 'تمويل فوري',
    feeRefundable: 'الرسوم قابلة للاسترداد',
    platformsAssets: 'المنصات والأصول',
    tradingPlatforms: 'منصات التداول',
    availableAssets: 'الأصول المتاحة',
    payoutInformation: 'معلومات الدفع',
    payoutFrequency: 'تكرار الدفع',
    scalingPlan: 'خطة التوسع',
    similarFirms: 'شركات مشابهة',
    tradingRiskWarning: 'تحذير مخاطر التداول',
    riskDisclaimer: 'التداول ينطوي على مخاطر كبيرة. تداول فقط برأس مال يمكنك تحمل خسارته.',
  },
  hi: {
    verified: 'सत्यापित',
    reviews: 'रिव्यूज',
    founded: 'स्थापित',
    website: 'वेबसाइट',
    startingFrom: 'शुरू',
    profitSplit: 'प्रॉफिट स्प्लिट',
    dailyDrawdown: 'दैनिक ड्रॉडाउन',
    totalDrawdown: 'कुल ड्रॉडाउन',
    off: 'छूट',
    exclusiveCode: 'एक्सक्लूसिव कोड',
    copied: 'कॉपी हो गया!',
    visit: 'विजिट करें',
    saved: 'सेव किया',
    save: 'सेव करें',
    share: 'शेयर करें',
    challengeRules: 'चैलेंज नियम',
    phase1Target: 'फेज 1 टारगेट',
    phase2Target: 'फेज 2 टारगेट',
    minTradingDays: 'न्यूनतम ट्रेडिंग दिन',
    timeLimit: 'समय सीमा',
    drawdownType: 'ड्रॉडाउन टाइप',
    consistencyRule: 'कंसिस्टेंसी नियम',
    unlimited: 'असीमित',
    none: 'कोई नहीं',
    na: 'N/A',
    tradingPermissions: 'ट्रेडिंग अनुमतियां',
    scalpingAllowed: 'स्कैल्पिंग अनुमत',
    newsTrading: 'न्यूज ट्रेडिंग',
    easBots: 'EAs / बॉट्स',
    weekendHolding: 'वीकेंड होल्डिंग',
    instantFunding: 'इंस्टेंट फंडिंग',
    feeRefundable: 'फीस रिफंडेबल',
    platformsAssets: 'प्लेटफॉर्म और एसेट्स',
    tradingPlatforms: 'ट्रेडिंग प्लेटफॉर्म',
    availableAssets: 'उपलब्ध एसेट्स',
    payoutInformation: 'पेआउट जानकारी',
    payoutFrequency: 'पेआउट फ्रीक्वेंसी',
    scalingPlan: 'स्केलिंग प्लान',
    similarFirms: 'समान फर्म्स',
    tradingRiskWarning: 'ट्रेडिंग रिस्क चेतावनी',
    riskDisclaimer: 'ट्रेडिंग में महत्वपूर्ण जोखिम शामिल है। केवल उस पूंजी से ट्रेड करें जिसे आप खोने का जोखिम उठा सकते हैं।',
  },
};

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
  trustpilot_rating: number
  trustpilot_reviews: number
  min_price: number
  profit_split: number
  max_profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  min_trading_days: number
  time_limit: string
  drawdown_type: string
  payout_frequency: string
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  has_free_repeat: boolean
  fee_refund: boolean
  scaling_max: string
  consistency_rule: string
  platforms: string[]
  assets: string[]
  challenge_types: string[]
  special_features: string[]
  trust_status: string
  discount_code: string
  discount_percent: number
  year_founded: number
  headquarters: string
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
}

// =============================================================================
// COMPONENTS
// =============================================================================

function BooleanBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${value ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
      {value ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span className="text-sm">{label}</span>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PropFirmPageClient({ firm, similarFirms }: Props) {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = translations[locale]
  
  const [copiedCode, setCopiedCode] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleCopyCode = () => {
    if (firm.discount_code) {
      navigator.clipboard.writeText(firm.discount_code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

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

  const logoUrl = firm.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(firm.name)}&background=10b981&color=fff&size=200`

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Info */}
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                {/* Logo */}
                <div className="relative w-24 h-24 bg-gray-800 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-700">
                  <Image
                    src={logoUrl}
                    alt={firm.name}
                    fill
                    className="object-contain p-3"
                  />
                </div>

                {/* Name & Rating */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{firm.name}</h1>
                    {firm.trust_status === 'verified' && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {t.verified}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {firm.trustpilot_rating > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(firm.trustpilot_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{firm.trustpilot_rating.toFixed(1)}</span>
                      <span className="text-gray-500">({firm.trustpilot_reviews?.toLocaleString()} {t.reviews})</span>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {firm.year_founded && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {t.founded} {firm.year_founded}
                      </span>
                    )}
                    {firm.headquarters && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {firm.headquarters}
                      </span>
                    )}
                    {firm.website_url && (
                      <a
                        href={firm.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                      >
                        <Globe className="w-4 h-4" /> {t.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">{t.startingFrom}</p>
                  <p className="text-2xl font-bold text-white">${firm.min_price || '—'}</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">{t.profitSplit}</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {firm.profit_split || '—'}
                    {firm.max_profit_split && firm.max_profit_split > firm.profit_split && (
                      <span className="text-sm text-gray-500">-{firm.max_profit_split}%</span>
                    )}
                    {firm.profit_split && '%'}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">{t.dailyDrawdown}</p>
                  <p className="text-2xl font-bold text-white">{firm.max_daily_drawdown || '—'}%</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-500 text-xs mb-1">{t.totalDrawdown}</p>
                  <p className="text-2xl font-bold text-white">{firm.max_total_drawdown || '—'}%</p>
                </div>
              </div>
            </div>

            {/* Right - CTA Card */}
            <div className="lg:w-80">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24">
                {/* Discount */}
                {firm.discount_code && firm.discount_percent && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 font-semibold">{firm.discount_percent}% {t.off}</span>
                      <span className="text-gray-500 text-xs">{t.exclusiveCode}</span>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                        copiedCode
                          ? 'bg-emerald-500 text-white'
                          : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                      }`}
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4" /> {t.copied}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> {firm.discount_code}
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Main CTA */}
                <a
                  href={firm.affiliate_url || firm.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors mb-3"
                >
                  {t.visit} {firm.name}
                  <ExternalLink className="w-4 h-4 inline ml-2" />
                </a>

                {/* Secondary Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                      isFavorite
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? t.saved : t.save}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    {t.share}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge Rules */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  {t.challengeRules}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.phase1Target}</p>
                    <p className="text-xl font-semibold text-white">{firm.profit_target_phase1 || '—'}%</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.phase2Target}</p>
                    <p className="text-xl font-semibold text-white">{firm.profit_target_phase2 || t.na}%</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.minTradingDays}</p>
                    <p className="text-xl font-semibold text-white">{firm.min_trading_days || t.none}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.timeLimit}</p>
                    <p className="text-xl font-semibold text-white">{firm.time_limit || t.unlimited}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.drawdownType}</p>
                    <p className="text-xl font-semibold text-white capitalize">{firm.drawdown_type || '—'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.consistencyRule}</p>
                    <p className="text-xl font-semibold text-white">{firm.consistency_rule || t.none}</p>
                  </div>
                </div>
              </div>

              {/* Trading Permissions */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  {t.tradingPermissions}
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <BooleanBadge value={firm.allows_scalping} label={t.scalpingAllowed} />
                  <BooleanBadge value={firm.allows_news_trading} label={t.newsTrading} />
                  <BooleanBadge value={firm.allows_ea} label={t.easBots} />
                  <BooleanBadge value={firm.allows_weekend_holding} label={t.weekendHolding} />
                  <BooleanBadge value={firm.has_instant_funding} label={t.instantFunding} />
                  <BooleanBadge value={firm.fee_refund} label={t.feeRefundable} />
                </div>
              </div>

              {/* Platforms & Assets */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t.platformsAssets}</h2>
                <div className="space-y-4">
                  {firm.platforms && firm.platforms.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">{t.tradingPlatforms}</p>
                      <div className="flex flex-wrap gap-2">
                        {firm.platforms.map((platform) => (
                          <span key={platform} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {firm.assets && firm.assets.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm mb-2">{t.availableAssets}</p>
                      <div className="flex flex-wrap gap-2">
                        {firm.assets.map((asset) => (
                          <span key={asset} className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payout Info */}
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  {t.payoutInformation}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.payoutFrequency}</p>
                    <p className="text-xl font-semibold text-white capitalize">{firm.payout_frequency || '—'}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-500 text-sm mb-1">{t.scalingPlan}</p>
                    <p className="text-xl font-semibold text-white">{firm.scaling_max || t.na}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Similar Firms */}
              {similarFirms.length > 0 && (
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">{t.similarFirms}</h3>
                  <div className="space-y-3">
                    {similarFirms.map((similar) => (
                      <Link
                        key={similar.id}
                        href={`/${locale}/prop-firm/${similar.slug}`}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors group"
                      >
                        <div className="relative w-10 h-10 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {similar.logo_url ? (
                            <Image src={similar.logo_url} alt={similar.name} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                              {similar.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{similar.name}</p>
                          <p className="text-sm text-gray-500">
                            {similar.trustpilot_rating?.toFixed(1)} ★ · ${similar.min_price}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm mb-1">{t.tradingRiskWarning}</p>
                    <p className="text-gray-400 text-xs">
                      {t.riskDisclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
