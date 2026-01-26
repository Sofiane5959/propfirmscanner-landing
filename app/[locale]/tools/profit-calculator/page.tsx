'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DollarSign, 
  ArrowLeft, 
  Zap,
  Crown,
  Lock,
  CheckCircle,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

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
    allTools: 'All Tools',
    title: 'Profit Calculator',
    subtitle: 'Calculate profits and payouts for your funded account',
    accountDetails: 'Account Details',
    propFirm: 'Prop Firm',
    accountSize: 'Account Size (USD)',
    currentBalance: 'Current Balance (USD)',
    profitTarget: 'Profit Target (%)',
    profitSplit: 'Profit Split (%)',
    estMonthlyReturn: 'Est. Monthly Return (%)',
    progressToTarget: 'Progress to Target',
    currentProfit: 'Current Profit',
    remaining: 'Remaining',
    ifTargetReached: 'If Target Reached',
    yourPayout: 'Your payout',
    ofProfit: 'of profit',
    totalProfitTarget: 'Total profit target',
    firmKeeps: 'Firm keeps',
    monthlyProjections: 'Monthly Projections',
    monthlyProfit: 'Monthly profit',
    monthlyPayout: 'Monthly payout',
    yearlyPayout: 'Yearly payout',
    estDaysToTarget: 'Est. days to target',
    days: 'days',
    trackRealProgress: 'Track Real Progress',
    trackRealProgressDesc: 'Pro Tracker shows live P&L, payout projections, and alerts when you hit targets.',
    tryProFree: 'Try Pro Tracker Free',
    proFeatures: 'Pro Features',
    autoTrackDaily: 'Auto-track daily P&L',
    payoutHistory: 'Payout history',
    targetAlerts: 'Target alerts',
  },
  fr: {
    allTools: 'Tous les Outils',
    title: 'Calculateur de Profit',
    subtitle: 'Calculez les profits et paiements de votre compte financé',
    accountDetails: 'Détails du Compte',
    propFirm: 'Prop Firm',
    accountSize: 'Taille du Compte (USD)',
    currentBalance: 'Solde Actuel (USD)',
    profitTarget: 'Objectif de Profit (%)',
    profitSplit: 'Partage des Profits (%)',
    estMonthlyReturn: 'Rendement Mensuel Est. (%)',
    progressToTarget: 'Progression vers l\'Objectif',
    currentProfit: 'Profit Actuel',
    remaining: 'Restant',
    ifTargetReached: 'Si Objectif Atteint',
    yourPayout: 'Votre paiement',
    ofProfit: 'du profit',
    totalProfitTarget: 'Objectif de profit total',
    firmKeeps: 'La firm garde',
    monthlyProjections: 'Projections Mensuelles',
    monthlyProfit: 'Profit mensuel',
    monthlyPayout: 'Paiement mensuel',
    yearlyPayout: 'Paiement annuel',
    estDaysToTarget: 'Jours estimés jusqu\'à l\'objectif',
    days: 'jours',
    trackRealProgress: 'Suivez Votre Vraie Progression',
    trackRealProgressDesc: 'Pro Tracker affiche le P&L en direct et vous alerte quand vous atteignez vos objectifs.',
    tryProFree: 'Essayer Pro Tracker Gratuitement',
    proFeatures: 'Fonctionnalités Pro',
    autoTrackDaily: 'Suivi auto du P&L quotidien',
    payoutHistory: 'Historique des paiements',
    targetAlerts: 'Alertes d\'objectif',
  },
  de: {
    allTools: 'Alle Tools',
    title: 'Gewinnrechner',
    subtitle: 'Berechnen Sie Gewinne und Auszahlungen für Ihr finanziertes Konto',
    accountDetails: 'Kontodetails',
    propFirm: 'Prop Firm',
    accountSize: 'Kontogröße (USD)',
    currentBalance: 'Aktueller Saldo (USD)',
    profitTarget: 'Gewinnziel (%)',
    profitSplit: 'Gewinnaufteilung (%)',
    estMonthlyReturn: 'Gesch. Monatliche Rendite (%)',
    progressToTarget: 'Fortschritt zum Ziel',
    currentProfit: 'Aktueller Gewinn',
    remaining: 'Verbleibend',
    ifTargetReached: 'Wenn Ziel Erreicht',
    yourPayout: 'Ihre Auszahlung',
    ofProfit: 'vom Gewinn',
    totalProfitTarget: 'Gesamtes Gewinnziel',
    firmKeeps: 'Firma behält',
    monthlyProjections: 'Monatliche Prognosen',
    monthlyProfit: 'Monatlicher Gewinn',
    monthlyPayout: 'Monatliche Auszahlung',
    yearlyPayout: 'Jährliche Auszahlung',
    estDaysToTarget: 'Gesch. Tage bis Ziel',
    days: 'Tage',
    trackRealProgress: 'Echten Fortschritt Verfolgen',
    trackRealProgressDesc: 'Pro Tracker zeigt Live-P&L und warnt Sie, wenn Sie Ziele erreichen.',
    tryProFree: 'Pro Tracker Kostenlos Testen',
    proFeatures: 'Pro Funktionen',
    autoTrackDaily: 'Auto-Tracking täglicher P&L',
    payoutHistory: 'Auszahlungsverlauf',
    targetAlerts: 'Ziel-Warnungen',
  },
  es: {
    allTools: 'Todas las Herramientas',
    title: 'Calculadora de Ganancias',
    subtitle: 'Calcula ganancias y pagos de tu cuenta financiada',
    accountDetails: 'Detalles de Cuenta',
    propFirm: 'Prop Firm',
    accountSize: 'Tamaño de Cuenta (USD)',
    currentBalance: 'Saldo Actual (USD)',
    profitTarget: 'Objetivo de Ganancia (%)',
    profitSplit: 'División de Ganancias (%)',
    estMonthlyReturn: 'Rendimiento Mensual Est. (%)',
    progressToTarget: 'Progreso hacia el Objetivo',
    currentProfit: 'Ganancia Actual',
    remaining: 'Restante',
    ifTargetReached: 'Si se Alcanza el Objetivo',
    yourPayout: 'Tu pago',
    ofProfit: 'de la ganancia',
    totalProfitTarget: 'Objetivo total de ganancia',
    firmKeeps: 'La firma se queda',
    monthlyProjections: 'Proyecciones Mensuales',
    monthlyProfit: 'Ganancia mensual',
    monthlyPayout: 'Pago mensual',
    yearlyPayout: 'Pago anual',
    estDaysToTarget: 'Días est. hasta el objetivo',
    days: 'días',
    trackRealProgress: 'Rastrea Tu Progreso Real',
    trackRealProgressDesc: 'Pro Tracker muestra P&L en vivo y te alerta cuando alcanzas objetivos.',
    tryProFree: 'Probar Pro Tracker Gratis',
    proFeatures: 'Funciones Pro',
    autoTrackDaily: 'Auto-seguimiento diario P&L',
    payoutHistory: 'Historial de pagos',
    targetAlerts: 'Alertas de objetivo',
  },
  pt: {
    allTools: 'Todas as Ferramentas',
    title: 'Calculadora de Lucro',
    subtitle: 'Calcule lucros e pagamentos da sua conta financiada',
    accountDetails: 'Detalhes da Conta',
    propFirm: 'Prop Firm',
    accountSize: 'Tamanho da Conta (USD)',
    currentBalance: 'Saldo Atual (USD)',
    profitTarget: 'Meta de Lucro (%)',
    profitSplit: 'Divisão de Lucros (%)',
    estMonthlyReturn: 'Retorno Mensal Est. (%)',
    progressToTarget: 'Progresso para a Meta',
    currentProfit: 'Lucro Atual',
    remaining: 'Restante',
    ifTargetReached: 'Se a Meta for Atingida',
    yourPayout: 'Seu pagamento',
    ofProfit: 'do lucro',
    totalProfitTarget: 'Meta total de lucro',
    firmKeeps: 'Firma fica com',
    monthlyProjections: 'Projeções Mensais',
    monthlyProfit: 'Lucro mensal',
    monthlyPayout: 'Pagamento mensal',
    yearlyPayout: 'Pagamento anual',
    estDaysToTarget: 'Dias est. até a meta',
    days: 'dias',
    trackRealProgress: 'Rastreie Seu Progresso Real',
    trackRealProgressDesc: 'Pro Tracker mostra P&L ao vivo e alerta quando você atinge metas.',
    tryProFree: 'Experimentar Pro Tracker Grátis',
    proFeatures: 'Recursos Pro',
    autoTrackDaily: 'Auto-rastreamento diário P&L',
    payoutHistory: 'Histórico de pagamentos',
    targetAlerts: 'Alertas de meta',
  },
  ar: {
    allTools: 'جميع الأدوات',
    title: 'حاسبة الأرباح',
    subtitle: 'احسب الأرباح والمدفوعات لحسابك الممول',
    accountDetails: 'تفاصيل الحساب',
    propFirm: 'شركة التداول',
    accountSize: 'حجم الحساب (USD)',
    currentBalance: 'الرصيد الحالي (USD)',
    profitTarget: 'هدف الربح (%)',
    profitSplit: 'تقسيم الأرباح (%)',
    estMonthlyReturn: 'العائد الشهري المقدر (%)',
    progressToTarget: 'التقدم نحو الهدف',
    currentProfit: 'الربح الحالي',
    remaining: 'المتبقي',
    ifTargetReached: 'إذا تم تحقيق الهدف',
    yourPayout: 'مدفوعاتك',
    ofProfit: 'من الربح',
    totalProfitTarget: 'إجمالي هدف الربح',
    firmKeeps: 'الشركة تحتفظ بـ',
    monthlyProjections: 'التوقعات الشهرية',
    monthlyProfit: 'الربح الشهري',
    monthlyPayout: 'الدفع الشهري',
    yearlyPayout: 'الدفع السنوي',
    estDaysToTarget: 'الأيام المقدرة للهدف',
    days: 'أيام',
    trackRealProgress: 'تتبع تقدمك الحقيقي',
    trackRealProgressDesc: 'Pro Tracker يعرض P&L المباشر وينبهك عند تحقيق الأهداف.',
    tryProFree: 'جرب Pro Tracker مجاناً',
    proFeatures: 'ميزات Pro',
    autoTrackDaily: 'تتبع تلقائي للـ P&L اليومي',
    payoutHistory: 'سجل المدفوعات',
    targetAlerts: 'تنبيهات الهدف',
  },
  hi: {
    allTools: 'सभी टूल्स',
    title: 'प्रॉफिट कैलकुलेटर',
    subtitle: 'अपने फंडेड अकाउंट के प्रॉफिट और पेआउट की गणना करें',
    accountDetails: 'अकाउंट विवरण',
    propFirm: 'प्रॉप फर्म',
    accountSize: 'अकाउंट साइज (USD)',
    currentBalance: 'वर्तमान बैलेंस (USD)',
    profitTarget: 'प्रॉफिट टारगेट (%)',
    profitSplit: 'प्रॉफिट स्प्लिट (%)',
    estMonthlyReturn: 'अनु. मासिक रिटर्न (%)',
    progressToTarget: 'टारगेट की ओर प्रगति',
    currentProfit: 'वर्तमान प्रॉफिट',
    remaining: 'शेष',
    ifTargetReached: 'अगर टारगेट पूरा हुआ',
    yourPayout: 'आपका पेआउट',
    ofProfit: 'प्रॉफिट का',
    totalProfitTarget: 'कुल प्रॉफिट टारगेट',
    firmKeeps: 'फर्म रखती है',
    monthlyProjections: 'मासिक अनुमान',
    monthlyProfit: 'मासिक प्रॉफिट',
    monthlyPayout: 'मासिक पेआउट',
    yearlyPayout: 'वार्षिक पेआउट',
    estDaysToTarget: 'टारगेट तक अनु. दिन',
    days: 'दिन',
    trackRealProgress: 'असली प्रगति ट्रैक करें',
    trackRealProgressDesc: 'Pro Tracker लाइव P&L दिखाता है और टारगेट पूरा होने पर अलर्ट करता है।',
    tryProFree: 'Pro Tracker मुफ्त आज़माएं',
    proFeatures: 'Pro फीचर्स',
    autoTrackDaily: 'ऑटो-ट्रैक दैनिक P&L',
    payoutHistory: 'पेआउट इतिहास',
    targetAlerts: 'टारगेट अलर्ट',
  },
};

// =============================================================================
// PROP FIRM PRESETS
// =============================================================================

const propFirmPresets = [
  { name: 'FTMO', profitTarget: 10, profitSplit: 80, phases: 2 },
  { name: 'FundedNext', profitTarget: 10, profitSplit: 90, phases: 2 },
  { name: 'The5ers', profitTarget: 8, profitSplit: 80, phases: 1 },
  { name: 'MyFundedFX', profitTarget: 8, profitSplit: 80, phases: 2 },
  { name: 'E8 Funding', profitTarget: 8, profitSplit: 80, phases: 2 },
  { name: 'Custom', profitTarget: 10, profitSplit: 80, phases: 2 },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfitCalculatorPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [preset, setPreset] = useState('FTMO');
  const [accountSize, setAccountSize] = useState('100000');
  const [currentBalance, setCurrentBalance] = useState('100000');
  const [profitTarget, setProfitTarget] = useState('10');
  const [profitSplit, setProfitSplit] = useState('80');
  const [monthlyReturn, setMonthlyReturn] = useState('5');

  const handlePresetChange = (presetName: string) => {
    setPreset(presetName);
    const selected = propFirmPresets.find(p => p.name === presetName);
    if (selected) {
      setProfitTarget(selected.profitTarget.toString());
      setProfitSplit(selected.profitSplit.toString());
    }
  };

  const calculations = useMemo(() => {
    const startBal = parseFloat(accountSize) || 0;
    const currBal = parseFloat(currentBalance) || 0;
    const targetPct = parseFloat(profitTarget) || 0;
    const splitPct = parseFloat(profitSplit) || 0;
    const monthlyPct = parseFloat(monthlyReturn) || 0;

    const currentProfit = currBal - startBal;
    const currentProfitPct = startBal > 0 ? (currentProfit / startBal) * 100 : 0;

    const targetProfitAmount = (startBal * targetPct) / 100;
    const targetBalance = startBal + targetProfitAmount;
    const remainingToTarget = Math.max(0, targetProfitAmount - currentProfit);
    const progressPct = targetProfitAmount > 0 ? Math.min(100, (currentProfit / targetProfitAmount) * 100) : 0;

    const potentialPayout = (targetProfitAmount * splitPct) / 100;

    const monthlyProfit = (startBal * monthlyPct) / 100;
    const monthlyPayout = (monthlyProfit * splitPct) / 100;
    const yearlyPayout = monthlyPayout * 12;

    const dailyReturn = monthlyPct / 20;
    const daysToTarget = dailyReturn > 0 ? remainingToTarget / ((startBal * dailyReturn) / 100) : 0;

    return {
      currentProfit,
      currentProfitPct,
      targetProfit: targetProfitAmount,
      targetBalance,
      remainingToTarget,
      progressPct,
      potentialPayout,
      monthlyProfit,
      monthlyPayout,
      yearlyPayout,
      daysToTarget: Math.ceil(daysToTarget),
    };
  }, [accountSize, currentBalance, profitTarget, profitSplit, monthlyReturn]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href={`/${locale}/tools`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.allTools}
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{t.title}</h1>
              <p className="text-gray-400">{t.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">{t.accountDetails}</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.propFirm}</label>
              <select
                value={preset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                {propFirmPresets.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.accountSize}</label>
              <input
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000, 200000].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setAccountSize(size.toString());
                      setCurrentBalance(size.toString());
                    }}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.currentBalance}</label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.profitTarget}</label>
              <input
                type="number"
                value={profitTarget}
                onChange={(e) => {
                  setProfitTarget(e.target.value);
                  setPreset('Custom');
                }}
                step="0.5"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.profitSplit}</label>
              <input
                type="number"
                value={profitSplit}
                onChange={(e) => {
                  setProfitSplit(e.target.value);
                  setPreset('Custom');
                }}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[70, 80, 85, 90].map((split) => (
                  <button
                    key={split}
                    onClick={() => {
                      setProfitSplit(split.toString());
                      setPreset('Custom');
                    }}
                    className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    {split}%
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.estMonthlyReturn}</label>
              <input
                type="number"
                value={monthlyReturn}
                onChange={(e) => setMonthlyReturn(e.target.value)}
                step="0.5"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Progress to Target */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-400">{t.progressToTarget}</h3>
                <span className={`text-sm font-medium ${
                  calculations.progressPct >= 100 ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {calculations.progressPct.toFixed(1)}%
                </span>
              </div>

              <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all ${
                    calculations.progressPct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, calculations.progressPct)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">{t.currentProfit}</p>
                  <p className={`text-lg font-semibold ${
                    calculations.currentProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(calculations.currentProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t.remaining}</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(calculations.remainingToTarget)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payout Card */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm text-emerald-400">{t.ifTargetReached}</h3>
              </div>

              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-white mb-1">
                  {formatCurrency(calculations.potentialPayout)}
                </p>
                <p className="text-gray-400">{t.yourPayout} ({profitSplit}% {t.ofProfit})</p>
              </div>

              <div className="pt-4 border-t border-emerald-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t.totalProfitTarget}</span>
                  <span className="text-white">{formatCurrency(calculations.targetProfit)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">{t.firmKeeps}</span>
                  <span className="text-gray-400">{formatCurrency(calculations.targetProfit - calculations.potentialPayout)}</span>
                </div>
              </div>
            </div>

            {/* Monthly Projections */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm text-gray-400">{t.monthlyProjections}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.monthlyProfit}</span>
                  <span className="text-white font-medium">{formatCurrency(calculations.monthlyProfit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.monthlyPayout}</span>
                  <span className="text-emerald-400 font-medium">{formatCurrency(calculations.monthlyPayout)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">{t.yearlyPayout}</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(calculations.yearlyPayout)}</span>
                </div>
                {calculations.daysToTarget > 0 && calculations.remainingToTarget > 0 && (
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">{t.estDaysToTarget}</span>
                    <span className="text-blue-400 font-medium">{calculations.daysToTarget} {t.days}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{t.trackRealProgress}</h3>
                  <p className="text-sm text-gray-400 mb-3">{t.trackRealProgressDesc}</p>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    {t.tryProFree}
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Features */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 opacity-75">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">{t.proFeatures}</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.autoTrackDaily}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.payoutHistory}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.targetAlerts}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
