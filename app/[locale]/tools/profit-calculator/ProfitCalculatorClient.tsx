'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { 
  PieChart, DollarSign, Percent, TrendingUp,
  Calculator, Info, ArrowRight
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
    title: 'Profit Calculator',
    subtitle: 'Calculate your potential earnings from a funded account',
    settings: 'Settings',
    accountSize: 'Account Size',
    monthlyReturn: 'Monthly Return',
    conservative: 'Conservative',
    aggressive: 'Aggressive',
    profitSplit: 'Profit Split',
    timePeriod: 'Time Period',
    months: 'months',
    monthlyEarnings: 'Monthly Earnings',
    grossProfit: 'Gross Profit',
    firmShare: "Firm's Share",
    yourEarnings: 'Your Earnings',
    monthProjection: '-Month Projection',
    withoutScaling: 'Without Scaling',
    withScaling: 'With Scaling*',
    scalingNote: '*Assumes 25% account increase every 3 profitable months',
    infoNote: 'Note: These are projections based on consistent performance. Actual results may vary. Most traders don\'t achieve consistent monthly returns.',
    accountComparison: 'Account Size Comparison',
    monthly: 'Monthly',
    yourShare: 'Your Share',
    yearly: 'Yearly',
  },
  fr: {
    title: 'Calculateur de Profit',
    subtitle: 'Calculez vos gains potentiels avec un compte financé',
    settings: 'Paramètres',
    accountSize: 'Taille du Compte',
    monthlyReturn: 'Rendement Mensuel',
    conservative: 'Conservateur',
    aggressive: 'Agressif',
    profitSplit: 'Partage des Profits',
    timePeriod: 'Période',
    months: 'mois',
    monthlyEarnings: 'Gains Mensuels',
    grossProfit: 'Profit Brut',
    firmShare: 'Part de la Firm',
    yourEarnings: 'Vos Gains',
    monthProjection: ' Mois - Projection',
    withoutScaling: 'Sans Scaling',
    withScaling: 'Avec Scaling*',
    scalingNote: '*Suppose une augmentation de 25% du compte tous les 3 mois profitables',
    infoNote: 'Note : Ce sont des projections basées sur une performance constante. Les résultats réels peuvent varier. La plupart des traders n\'atteignent pas des rendements mensuels constants.',
    accountComparison: 'Comparaison par Taille de Compte',
    monthly: 'Mensuel',
    yourShare: 'Votre Part',
    yearly: 'Annuel',
  },
  de: {
    title: 'Gewinnrechner',
    subtitle: 'Berechnen Sie Ihre potenziellen Einnahmen aus einem finanzierten Konto',
    settings: 'Einstellungen',
    accountSize: 'Kontogröße',
    monthlyReturn: 'Monatliche Rendite',
    conservative: 'Konservativ',
    aggressive: 'Aggressiv',
    profitSplit: 'Gewinnaufteilung',
    timePeriod: 'Zeitraum',
    months: 'Monate',
    monthlyEarnings: 'Monatliche Einnahmen',
    grossProfit: 'Bruttogewinn',
    firmShare: 'Firmenanteil',
    yourEarnings: 'Ihre Einnahmen',
    monthProjection: '-Monats-Prognose',
    withoutScaling: 'Ohne Skalierung',
    withScaling: 'Mit Skalierung*',
    scalingNote: '*Annahme: 25% Kontoerhöhung alle 3 profitablen Monate',
    infoNote: 'Hinweis: Dies sind Prognosen basierend auf konstanter Leistung. Tatsächliche Ergebnisse können variieren. Die meisten Trader erreichen keine konstanten monatlichen Renditen.',
    accountComparison: 'Kontogrößenvergleich',
    monthly: 'Monatlich',
    yourShare: 'Ihr Anteil',
    yearly: 'Jährlich',
  },
  es: {
    title: 'Calculadora de Ganancias',
    subtitle: 'Calcula tus ganancias potenciales de una cuenta financiada',
    settings: 'Configuración',
    accountSize: 'Tamaño de Cuenta',
    monthlyReturn: 'Rendimiento Mensual',
    conservative: 'Conservador',
    aggressive: 'Agresivo',
    profitSplit: 'División de Ganancias',
    timePeriod: 'Período',
    months: 'meses',
    monthlyEarnings: 'Ganancias Mensuales',
    grossProfit: 'Ganancia Bruta',
    firmShare: 'Parte de la Firma',
    yourEarnings: 'Tus Ganancias',
    monthProjection: ' Meses - Proyección',
    withoutScaling: 'Sin Escalado',
    withScaling: 'Con Escalado*',
    scalingNote: '*Asume un aumento del 25% de la cuenta cada 3 meses rentables',
    infoNote: 'Nota: Estas son proyecciones basadas en un rendimiento constante. Los resultados reales pueden variar. La mayoría de los traders no logran rendimientos mensuales constantes.',
    accountComparison: 'Comparación por Tamaño de Cuenta',
    monthly: 'Mensual',
    yourShare: 'Tu Parte',
    yearly: 'Anual',
  },
  pt: {
    title: 'Calculadora de Lucro',
    subtitle: 'Calcule seus ganhos potenciais de uma conta financiada',
    settings: 'Configurações',
    accountSize: 'Tamanho da Conta',
    monthlyReturn: 'Retorno Mensal',
    conservative: 'Conservador',
    aggressive: 'Agressivo',
    profitSplit: 'Divisão de Lucros',
    timePeriod: 'Período',
    months: 'meses',
    monthlyEarnings: 'Ganhos Mensais',
    grossProfit: 'Lucro Bruto',
    firmShare: 'Parte da Firma',
    yourEarnings: 'Seus Ganhos',
    monthProjection: ' Meses - Projeção',
    withoutScaling: 'Sem Escalonamento',
    withScaling: 'Com Escalonamento*',
    scalingNote: '*Assume aumento de 25% da conta a cada 3 meses lucrativos',
    infoNote: 'Nota: Estas são projeções baseadas em desempenho consistente. Os resultados reais podem variar. A maioria dos traders não alcança retornos mensais consistentes.',
    accountComparison: 'Comparação por Tamanho de Conta',
    monthly: 'Mensal',
    yourShare: 'Sua Parte',
    yearly: 'Anual',
  },
  ar: {
    title: 'حاسبة الأرباح',
    subtitle: 'احسب أرباحك المحتملة من حساب ممول',
    settings: 'الإعدادات',
    accountSize: 'حجم الحساب',
    monthlyReturn: 'العائد الشهري',
    conservative: 'محافظ',
    aggressive: 'عدواني',
    profitSplit: 'تقسيم الأرباح',
    timePeriod: 'الفترة الزمنية',
    months: 'أشهر',
    monthlyEarnings: 'الأرباح الشهرية',
    grossProfit: 'الربح الإجمالي',
    firmShare: 'حصة الشركة',
    yourEarnings: 'أرباحك',
    monthProjection: ' شهر - التوقعات',
    withoutScaling: 'بدون تصعيد',
    withScaling: 'مع تصعيد*',
    scalingNote: '*يفترض زيادة 25% في الحساب كل 3 أشهر مربحة',
    infoNote: 'ملاحظة: هذه توقعات بناءً على أداء ثابت. قد تختلف النتائج الفعلية. معظم المتداولين لا يحققون عوائد شهرية ثابتة.',
    accountComparison: 'مقارنة حجم الحساب',
    monthly: 'شهري',
    yourShare: 'حصتك',
    yearly: 'سنوي',
  },
  hi: {
    title: 'प्रॉफिट कैलकुलेटर',
    subtitle: 'फंडेड अकाउंट से अपनी संभावित कमाई की गणना करें',
    settings: 'सेटिंग्स',
    accountSize: 'अकाउंट साइज',
    monthlyReturn: 'मासिक रिटर्न',
    conservative: 'रूढ़िवादी',
    aggressive: 'आक्रामक',
    profitSplit: 'प्रॉफिट स्प्लिट',
    timePeriod: 'समय अवधि',
    months: 'महीने',
    monthlyEarnings: 'मासिक कमाई',
    grossProfit: 'सकल लाभ',
    firmShare: 'फर्म का हिस्सा',
    yourEarnings: 'आपकी कमाई',
    monthProjection: ' महीने - प्रोजेक्शन',
    withoutScaling: 'स्केलिंग के बिना',
    withScaling: 'स्केलिंग के साथ*',
    scalingNote: '*हर 3 लाभदायक महीनों में 25% अकाउंट वृद्धि मान लिया गया',
    infoNote: 'नोट: ये लगातार प्रदर्शन पर आधारित अनुमान हैं। वास्तविक परिणाम भिन्न हो सकते हैं। अधिकांश ट्रेडर लगातार मासिक रिटर्न प्राप्त नहीं करते।',
    accountComparison: 'अकाउंट साइज तुलना',
    monthly: 'मासिक',
    yourShare: 'आपका हिस्सा',
    yearly: 'वार्षिक',
  },
};

// =============================================================================
// CONSTANTS
// =============================================================================

const ACCOUNT_SIZES = [10000, 25000, 50000, 100000, 200000, 400000]
const PROFIT_SPLITS = [70, 75, 80, 85, 90, 95, 100]

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfitCalculatorClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [accountSize, setAccountSize] = useState(100000)
  const [monthlyReturn, setMonthlyReturn] = useState(5)
  const [profitSplit, setProfitSplit] = useState(80)
  const [months, setMonths] = useState(12)

  // Calculations
  const grossProfit = accountSize * (monthlyReturn / 100)
  const firmShare = grossProfit * ((100 - profitSplit) / 100)
  const traderShare = grossProfit * (profitSplit / 100)
  const yearlyGross = grossProfit * months
  const yearlyTraderShare = traderShare * months

  // Scaling simulation
  const calculateScalingProjection = () => {
    let total = 0
    let currentAccount = accountSize
    for (let i = 0; i < months; i++) {
      if (i > 0 && i % 3 === 0) {
        currentAccount *= 1.25
      }
      total += currentAccount * (monthlyReturn / 100) * (profitSplit / 100)
    }
    return total
  }

  const scalingProjection = calculateScalingProjection()

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">{t.settings}</h2>

            {/* Account Size */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                {t.accountSize}
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCOUNT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setAccountSize(size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      accountSize === size
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Return */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                {t.monthlyReturn}: {monthlyReturn}%
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={monthlyReturn}
                onChange={(e) => setMonthlyReturn(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1% ({t.conservative})</span>
                <span>15% ({t.aggressive})</span>
              </div>
            </div>

            {/* Profit Split */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <Percent className="w-4 h-4 text-purple-400" />
                {t.profitSplit}
              </label>
              <div className="flex flex-wrap gap-2">
                {PROFIT_SPLITS.map(split => (
                  <button
                    key={split}
                    onClick={() => setProfitSplit(split)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      profitSplit === split
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {split}%
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-300 mb-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                {t.timePeriod}: {months} {t.months}
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Monthly Breakdown */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{t.monthlyEarnings}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t.grossProfit}</span>
                  <span className="text-white font-semibold">${grossProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t.firmShare} ({100 - profitSplit}%)</span>
                  <span className="text-red-400">-${firmShare.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{t.yourEarnings} ({profitSplit}%)</span>
                    <span className="text-2xl font-bold text-purple-400">${traderShare.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Yearly Projection */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{months}{t.monthProjection}</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">{t.withoutScaling}</div>
                  <div className="text-2xl font-bold text-white">${yearlyTraderShare.toLocaleString()}</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <div className="text-gray-400 text-sm mb-1">{t.withScaling}</div>
                  <div className="text-2xl font-bold text-emerald-400">${Math.round(scalingProjection).toLocaleString()}</div>
                </div>
              </div>
              
              <p className="text-gray-500 text-xs mt-4">
                {t.scalingNote}
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <strong className="text-blue-400">Note:</strong> {t.infoNote}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t.accountComparison}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">{t.accountSize}</th>
                  <th className="text-right py-3 px-4 text-gray-400">{t.monthly} ({monthlyReturn}%)</th>
                  <th className="text-right py-3 px-4 text-gray-400">{t.yourShare} ({profitSplit}%)</th>
                  <th className="text-right py-3 px-4 text-gray-400">{t.yearly}</th>
                </tr>
              </thead>
              <tbody>
                {ACCOUNT_SIZES.map(size => {
                  const monthly = size * (monthlyReturn / 100)
                  const share = monthly * (profitSplit / 100)
                  const yearly = share * 12
                  return (
                    <tr 
                      key={size} 
                      className={`border-b border-gray-700/50 ${size === accountSize ? 'bg-purple-500/10' : ''}`}
                    >
                      <td className="py-3 px-4 text-white font-medium">${(size / 1000)}K</td>
                      <td className="py-3 px-4 text-right text-gray-300">${monthly.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-purple-400 font-semibold">${share.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">${yearly.toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
