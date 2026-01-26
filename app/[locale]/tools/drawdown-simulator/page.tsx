'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  TrendingDown, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Crown,
  Lock,
  Info
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
    title: 'Drawdown Simulator',
    subtitle: 'Calculate your buffer before hitting DD limits',
    accountSettings: 'Account Settings',
    propFirmPreset: 'Prop Firm Preset',
    accountSize: 'Account Size (USD)',
    currentBalance: 'Current Balance (USD)',
    todayPnl: "Today's P&L (USD)",
    dailyDDPercent: 'Daily Drawdown (%)',
    maxDDPercent: 'Max Drawdown (%)',
    trailingDrawdown: 'Trailing Drawdown',
    highWatermark: 'High Watermark (USD)',
    hwmNote: 'Highest balance reached. DD floor trails up with profits.',
    healthy: 'Healthy',
    warning: 'Warning',
    danger: 'Danger',
    safeMsg: 'Your account is within safe limits',
    warningMsg: 'Buffer getting low, trade carefully',
    dangerMsg: 'Very close to hitting DD limits!',
    dailyDrawdown: 'Daily Drawdown',
    maxDrawdown: 'Max Drawdown',
    limit: 'Limit',
    usedToday: 'Used Today',
    bufferRemaining: 'Buffer Remaining',
    floor: 'Floor (breach at)',
    trailing: 'Trailing',
    trackAuto: 'Track This Automatically',
    trackAutoDesc: 'Pro Tracker monitors your DD in real-time, alerts you before violations, and simulates trades.',
    tryProFree: 'Try Pro Tracker Free',
    proFeatures: 'Pro Features',
    multiAccount: 'Multi-account monitoring',
    realTimeAlerts: 'Real-time alerts',
    tradeSim: 'Trade simulation',
    historicalTracking: 'Historical tracking',
  },
  fr: {
    allTools: 'Tous les Outils',
    title: 'Simulateur de Drawdown',
    subtitle: 'Calculez votre marge avant d\'atteindre les limites DD',
    accountSettings: 'Paramètres du Compte',
    propFirmPreset: 'Preset Prop Firm',
    accountSize: 'Taille du Compte (USD)',
    currentBalance: 'Solde Actuel (USD)',
    todayPnl: 'P&L du Jour (USD)',
    dailyDDPercent: 'Drawdown Journalier (%)',
    maxDDPercent: 'Drawdown Max (%)',
    trailingDrawdown: 'Drawdown Trailing',
    highWatermark: 'High Watermark (USD)',
    hwmNote: 'Solde le plus élevé atteint. Le plancher DD suit les profits.',
    healthy: 'Sain',
    warning: 'Attention',
    danger: 'Danger',
    safeMsg: 'Votre compte est dans les limites sûres',
    warningMsg: 'Marge faible, tradez prudemment',
    dangerMsg: 'Très proche des limites DD !',
    dailyDrawdown: 'Drawdown Journalier',
    maxDrawdown: 'Drawdown Max',
    limit: 'Limite',
    usedToday: 'Utilisé Aujourd\'hui',
    bufferRemaining: 'Marge Restante',
    floor: 'Plancher (violation à)',
    trailing: 'Trailing',
    trackAuto: 'Suivi Automatique',
    trackAutoDesc: 'Pro Tracker surveille votre DD en temps réel, vous alerte avant les violations.',
    tryProFree: 'Essayer Pro Tracker Gratuitement',
    proFeatures: 'Fonctionnalités Pro',
    multiAccount: 'Surveillance multi-comptes',
    realTimeAlerts: 'Alertes en temps réel',
    tradeSim: 'Simulation de trades',
    historicalTracking: 'Suivi historique',
  },
  de: {
    allTools: 'Alle Tools',
    title: 'Drawdown-Simulator',
    subtitle: 'Berechnen Sie Ihren Puffer vor DD-Limits',
    accountSettings: 'Kontoeinstellungen',
    propFirmPreset: 'Prop Firm Voreinstellung',
    accountSize: 'Kontogröße (USD)',
    currentBalance: 'Aktueller Saldo (USD)',
    todayPnl: 'Heutiger P&L (USD)',
    dailyDDPercent: 'Täglicher Drawdown (%)',
    maxDDPercent: 'Max Drawdown (%)',
    trailingDrawdown: 'Trailing Drawdown',
    highWatermark: 'High Watermark (USD)',
    hwmNote: 'Höchster erreichter Saldo. DD-Boden steigt mit Gewinnen.',
    healthy: 'Gesund',
    warning: 'Warnung',
    danger: 'Gefahr',
    safeMsg: 'Ihr Konto ist innerhalb sicherer Grenzen',
    warningMsg: 'Puffer wird knapp, vorsichtig handeln',
    dangerMsg: 'Sehr nah an DD-Limits!',
    dailyDrawdown: 'Täglicher Drawdown',
    maxDrawdown: 'Max Drawdown',
    limit: 'Limit',
    usedToday: 'Heute Verwendet',
    bufferRemaining: 'Puffer Verbleibend',
    floor: 'Boden (Verletzung bei)',
    trailing: 'Trailing',
    trackAuto: 'Automatisch Verfolgen',
    trackAutoDesc: 'Pro Tracker überwacht Ihren DD in Echtzeit und warnt vor Verstößen.',
    tryProFree: 'Pro Tracker Kostenlos Testen',
    proFeatures: 'Pro Funktionen',
    multiAccount: 'Multi-Konto-Überwachung',
    realTimeAlerts: 'Echtzeit-Warnungen',
    tradeSim: 'Trade-Simulation',
    historicalTracking: 'Historisches Tracking',
  },
  es: {
    allTools: 'Todas las Herramientas',
    title: 'Simulador de Drawdown',
    subtitle: 'Calcula tu margen antes de alcanzar los límites DD',
    accountSettings: 'Configuración de Cuenta',
    propFirmPreset: 'Preset Prop Firm',
    accountSize: 'Tamaño de Cuenta (USD)',
    currentBalance: 'Saldo Actual (USD)',
    todayPnl: 'P&L de Hoy (USD)',
    dailyDDPercent: 'Drawdown Diario (%)',
    maxDDPercent: 'Drawdown Máx (%)',
    trailingDrawdown: 'Drawdown Trailing',
    highWatermark: 'High Watermark (USD)',
    hwmNote: 'Saldo más alto alcanzado. El piso DD sube con las ganancias.',
    healthy: 'Saludable',
    warning: 'Advertencia',
    danger: 'Peligro',
    safeMsg: 'Tu cuenta está dentro de límites seguros',
    warningMsg: 'Margen bajo, opera con cuidado',
    dangerMsg: '¡Muy cerca de los límites DD!',
    dailyDrawdown: 'Drawdown Diario',
    maxDrawdown: 'Drawdown Máx',
    limit: 'Límite',
    usedToday: 'Usado Hoy',
    bufferRemaining: 'Margen Restante',
    floor: 'Piso (violación en)',
    trailing: 'Trailing',
    trackAuto: 'Seguimiento Automático',
    trackAutoDesc: 'Pro Tracker monitorea tu DD en tiempo real y te alerta antes de violaciones.',
    tryProFree: 'Probar Pro Tracker Gratis',
    proFeatures: 'Funciones Pro',
    multiAccount: 'Monitoreo multi-cuenta',
    realTimeAlerts: 'Alertas en tiempo real',
    tradeSim: 'Simulación de trades',
    historicalTracking: 'Seguimiento histórico',
  },
  pt: {
    allTools: 'Todas as Ferramentas',
    title: 'Simulador de Drawdown',
    subtitle: 'Calcule sua margem antes de atingir os limites DD',
    accountSettings: 'Configurações da Conta',
    propFirmPreset: 'Preset Prop Firm',
    accountSize: 'Tamanho da Conta (USD)',
    currentBalance: 'Saldo Atual (USD)',
    todayPnl: 'P&L de Hoje (USD)',
    dailyDDPercent: 'Drawdown Diário (%)',
    maxDDPercent: 'Drawdown Máx (%)',
    trailingDrawdown: 'Drawdown Trailing',
    highWatermark: 'High Watermark (USD)',
    hwmNote: 'Saldo mais alto atingido. O piso DD sobe com os lucros.',
    healthy: 'Saudável',
    warning: 'Atenção',
    danger: 'Perigo',
    safeMsg: 'Sua conta está dentro dos limites seguros',
    warningMsg: 'Margem baixa, opere com cuidado',
    dangerMsg: 'Muito perto dos limites DD!',
    dailyDrawdown: 'Drawdown Diário',
    maxDrawdown: 'Drawdown Máx',
    limit: 'Limite',
    usedToday: 'Usado Hoje',
    bufferRemaining: 'Margem Restante',
    floor: 'Piso (violação em)',
    trailing: 'Trailing',
    trackAuto: 'Rastreamento Automático',
    trackAutoDesc: 'Pro Tracker monitora seu DD em tempo real e alerta antes de violações.',
    tryProFree: 'Experimentar Pro Tracker Grátis',
    proFeatures: 'Recursos Pro',
    multiAccount: 'Monitoramento multi-conta',
    realTimeAlerts: 'Alertas em tempo real',
    tradeSim: 'Simulação de trades',
    historicalTracking: 'Rastreamento histórico',
  },
  ar: {
    allTools: 'جميع الأدوات',
    title: 'محاكي السحب',
    subtitle: 'احسب هامشك قبل الوصول لحدود السحب',
    accountSettings: 'إعدادات الحساب',
    propFirmPreset: 'إعداد مسبق للشركة',
    accountSize: 'حجم الحساب (USD)',
    currentBalance: 'الرصيد الحالي (USD)',
    todayPnl: 'ربح/خسارة اليوم (USD)',
    dailyDDPercent: 'السحب اليومي (%)',
    maxDDPercent: 'السحب الأقصى (%)',
    trailingDrawdown: 'السحب المتحرك',
    highWatermark: 'أعلى علامة مائية (USD)',
    hwmNote: 'أعلى رصيد تم الوصول إليه. أرضية DD ترتفع مع الأرباح.',
    healthy: 'صحي',
    warning: 'تحذير',
    danger: 'خطر',
    safeMsg: 'حسابك ضمن الحدود الآمنة',
    warningMsg: 'الهامش منخفض، تداول بحذر',
    dangerMsg: 'قريب جداً من حدود السحب!',
    dailyDrawdown: 'السحب اليومي',
    maxDrawdown: 'السحب الأقصى',
    limit: 'الحد',
    usedToday: 'المستخدم اليوم',
    bufferRemaining: 'الهامش المتبقي',
    floor: 'الأرضية (انتهاك عند)',
    trailing: 'متحرك',
    trackAuto: 'تتبع تلقائي',
    trackAutoDesc: 'Pro Tracker يراقب السحب في الوقت الفعلي وينبهك قبل الانتهاكات.',
    tryProFree: 'جرب Pro Tracker مجاناً',
    proFeatures: 'ميزات Pro',
    multiAccount: 'مراقبة متعددة الحسابات',
    realTimeAlerts: 'تنبيهات فورية',
    tradeSim: 'محاكاة الصفقات',
    historicalTracking: 'التتبع التاريخي',
  },
  hi: {
    allTools: 'सभी टूल्स',
    title: 'ड्रॉडाउन सिम्युलेटर',
    subtitle: 'DD सीमा तक पहुंचने से पहले अपना बफर कैलकुलेट करें',
    accountSettings: 'अकाउंट सेटिंग्स',
    propFirmPreset: 'प्रॉप फर्म प्रीसेट',
    accountSize: 'अकाउंट साइज (USD)',
    currentBalance: 'वर्तमान बैलेंस (USD)',
    todayPnl: 'आज का P&L (USD)',
    dailyDDPercent: 'दैनिक ड्रॉडाउन (%)',
    maxDDPercent: 'मैक्स ड्रॉडाउन (%)',
    trailingDrawdown: 'ट्रेलिंग ड्रॉडाउन',
    highWatermark: 'हाई वॉटरमार्क (USD)',
    hwmNote: 'सबसे अधिक बैलेंस। DD फ्लोर प्रॉफिट के साथ बढ़ता है।',
    healthy: 'स्वस्थ',
    warning: 'चेतावनी',
    danger: 'खतरा',
    safeMsg: 'आपका अकाउंट सुरक्षित सीमा में है',
    warningMsg: 'बफर कम हो रहा है, सावधानी से ट्रेड करें',
    dangerMsg: 'DD सीमाओं के बहुत करीब!',
    dailyDrawdown: 'दैनिक ड्रॉडाउन',
    maxDrawdown: 'मैक्स ड्रॉडाउन',
    limit: 'सीमा',
    usedToday: 'आज उपयोग',
    bufferRemaining: 'शेष बफर',
    floor: 'फ्लोर (उल्लंघन पर)',
    trailing: 'ट्रेलिंग',
    trackAuto: 'ऑटो ट्रैक करें',
    trackAutoDesc: 'Pro Tracker आपके DD को रियल-टाइम में मॉनिटर करता है।',
    tryProFree: 'Pro Tracker मुफ्त आज़माएं',
    proFeatures: 'Pro फीचर्स',
    multiAccount: 'मल्टी-अकाउंट मॉनिटरिंग',
    realTimeAlerts: 'रियल-टाइम अलर्ट',
    tradeSim: 'ट्रेड सिमुलेशन',
    historicalTracking: 'हिस्टोरिकल ट्रैकिंग',
  },
};

// =============================================================================
// PROP FIRM PRESETS
// =============================================================================

const propFirmPresets = [
  { name: 'Custom', dailyDD: 5, maxDD: 10, trailing: false },
  { name: 'FTMO', dailyDD: 5, maxDD: 10, trailing: false },
  { name: 'FundedNext', dailyDD: 5, maxDD: 10, trailing: true },
  { name: 'The5ers', dailyDD: 4, maxDD: 6, trailing: false },
  { name: 'MyFundedFX', dailyDD: 5, maxDD: 8, trailing: true },
  { name: 'E8 Funding', dailyDD: 5, maxDD: 8, trailing: false },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function DrawdownSimulatorPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [preset, setPreset] = useState('FTMO');
  const [accountSize, setAccountSize] = useState('100000');
  const [currentBalance, setCurrentBalance] = useState('100000');
  const [todayPnl, setTodayPnl] = useState('0');
  const [dailyDDPercent, setDailyDDPercent] = useState('5');
  const [maxDDPercent, setMaxDDPercent] = useState('10');
  const [isTrailing, setIsTrailing] = useState(false);
  const [highWatermark, setHighWatermark] = useState('100000');

  const handlePresetChange = (presetName: string) => {
    setPreset(presetName);
    const selected = propFirmPresets.find(p => p.name === presetName);
    if (selected && presetName !== 'Custom') {
      setDailyDDPercent(selected.dailyDD.toString());
      setMaxDDPercent(selected.maxDD.toString());
      setIsTrailing(selected.trailing);
    }
  };

  const calculations = useMemo(() => {
    const startBal = parseFloat(accountSize) || 0;
    const currBal = parseFloat(currentBalance) || 0;
    const pnl = parseFloat(todayPnl) || 0;
    const dailyPct = parseFloat(dailyDDPercent) || 0;
    const maxPct = parseFloat(maxDDPercent) || 0;
    const hwm = parseFloat(highWatermark) || startBal;

    const dailyLimitUsd = (startBal * dailyPct) / 100;
    const dailyUsedUsd = Math.max(0, -pnl);
    const dailyBufferUsd = Math.max(0, dailyLimitUsd - dailyUsedUsd);
    const dailyBufferPct = dailyLimitUsd > 0 ? (dailyBufferUsd / dailyLimitUsd) * 100 : 0;

    const maxLimitUsd = (startBal * maxPct) / 100;
    let maxFloorUsd = startBal - maxLimitUsd;
    
    if (isTrailing && hwm > startBal) {
      maxFloorUsd = hwm - maxLimitUsd;
    }
    
    const maxBufferUsd = Math.max(0, currBal - maxFloorUsd);
    const maxBufferPct = maxLimitUsd > 0 ? (maxBufferUsd / maxLimitUsd) * 100 : 0;

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (dailyBufferPct < 15 || maxBufferPct < 15) status = 'danger';
    else if (dailyBufferPct < 30 || maxBufferPct < 30) status = 'warning';

    return {
      dailyLimitUsd,
      dailyUsedUsd,
      dailyBufferUsd,
      dailyBufferPct,
      maxLimitUsd,
      maxFloorUsd,
      maxBufferUsd,
      maxBufferPct,
      status,
    };
  }, [accountSize, currentBalance, todayPnl, dailyDDPercent, maxDDPercent, isTrailing, highWatermark]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      safe: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle, label: t.healthy },
      warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle, label: t.warning },
      danger: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle, label: t.danger },
    };
    return configs[status as keyof typeof configs];
  };

  const statusConfig = getStatusConfig(calculations.status);
  const StatusIcon = statusConfig.icon;

  const getStatusMessage = (status: string) => {
    if (status === 'safe') return t.safeMsg;
    if (status === 'warning') return t.warningMsg;
    return t.dangerMsg;
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
            <div className="p-3 bg-red-500/20 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-400" />
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
            <h2 className="text-lg font-semibold text-white mb-4">{t.accountSettings}</h2>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">{t.propFirmPreset}</label>
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
                      setHighWatermark(size.toString());
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
              <label className="block text-sm text-gray-400 mb-2">{t.todayPnl}</label>
              <input
                type="number"
                value={todayPnl}
                onChange={(e) => setTodayPnl(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.dailyDDPercent}</label>
                <input
                  type="number"
                  value={dailyDDPercent}
                  onChange={(e) => {
                    setDailyDDPercent(e.target.value);
                    setPreset('Custom');
                  }}
                  step="0.5"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.maxDDPercent}</label>
                <input
                  type="number"
                  value={maxDDPercent}
                  onChange={(e) => {
                    setMaxDDPercent(e.target.value);
                    setPreset('Custom');
                  }}
                  step="0.5"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrailing}
                  onChange={(e) => {
                    setIsTrailing(e.target.checked);
                    setPreset('Custom');
                  }}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-white">{t.trailingDrawdown}</span>
              </label>
            </div>

            {isTrailing && (
              <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <label className="block text-sm text-purple-400 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {t.highWatermark}
                </label>
                <input
                  type="number"
                  value={highWatermark}
                  onChange={(e) => setHighWatermark(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-2">{t.hwmNote}</p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${statusConfig.bg} flex items-center gap-3`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.text}`} />
              <div>
                <p className={`font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
                <p className="text-sm text-gray-400">{getStatusMessage(calculations.status)}</p>
              </div>
            </div>

            {/* Daily DD Card */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-3">{t.dailyDrawdown}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">{t.limit}</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(calculations.dailyLimitUsd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t.usedToday}</p>
                  <p className="text-lg font-semibold text-red-400">
                    {formatCurrency(calculations.dailyUsedUsd)}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{t.bufferRemaining}</span>
                  <span className={`font-medium ${
                    calculations.dailyBufferPct < 30 
                      ? calculations.dailyBufferPct < 15 
                        ? 'text-red-400' 
                        : 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}>
                    {formatCurrency(calculations.dailyBufferUsd)} ({calculations.dailyBufferPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      calculations.dailyBufferPct < 30
                        ? calculations.dailyBufferPct < 15
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, calculations.dailyBufferPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Max DD Card */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                {t.maxDrawdown}
                {isTrailing && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    {t.trailing}
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">{t.limit}</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(calculations.maxLimitUsd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t.floor}</p>
                  <p className="text-lg font-semibold text-orange-400">
                    {formatCurrency(calculations.maxFloorUsd)}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{t.bufferRemaining}</span>
                  <span className={`font-medium ${
                    calculations.maxBufferPct < 30 
                      ? calculations.maxBufferPct < 15 
                        ? 'text-red-400' 
                        : 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}>
                    {formatCurrency(calculations.maxBufferUsd)} ({calculations.maxBufferPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      calculations.maxBufferPct < 30
                        ? calculations.maxBufferPct < 15
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, calculations.maxBufferPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{t.trackAuto}</h3>
                  <p className="text-sm text-gray-400 mb-3">{t.trackAutoDesc}</p>
                  <Link
                    href={`/${locale}/dashboard`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
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
                  {t.multiAccount}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.realTimeAlerts}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.tradeSim}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.historicalTracking}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
