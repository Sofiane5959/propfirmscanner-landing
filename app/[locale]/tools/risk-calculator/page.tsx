'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { DemoBanner } from '@/components/DemoBanner';

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
    title: 'Risk Calculator',
    subtitle: 'Calculate optimal position size based on your risk parameters',
    tradeParams: 'Trade Parameters',
    accountBalance: 'Account Balance (USD)',
    riskPerTrade: 'Risk Per Trade (%)',
    stopLoss: 'Stop Loss (Pips)',
    pipValue: 'Pip Value (USD per lot)',
    pipValueHint: 'EUR/USD = $10 | USD/JPY ≈ $6.50 | GBP/USD = $10',
    dailyDDLimit: 'Daily DD Limit (%)',
    positionSize: 'Position Size',
    standardLots: 'Standard Lots',
    riskAmount: 'Risk Amount',
    miniLots: 'Mini Lots',
    dailyDDContext: 'Daily DD Context',
    dailyDDLimitLabel: 'Daily DD Limit',
    thisTradeUses: 'This trade uses',
    ofDailyLimit: 'of daily limit',
    maxLosingTrades: 'Max losing trades today',
    safe: 'SAFE',
    risky: 'RISKY',
    violation: 'VIOLATION',
    safeMsg: 'Good risk management.',
    riskyMsg: 'in one trade is risky.',
    violationMsg: 'This trade exceeds your daily drawdown limit.',
    usingPercent: 'Using',
    ctaTitle: 'Auto-Calculate Before Every Trade',
    ctaDesc: 'My Prop Firms checks your risk against all DD limits before you trade, using your real account data.',
    tryFree: 'Try My Prop Firms Free',
  },
  fr: {
    allTools: 'Tous les Outils',
    title: 'Calculateur de Risque',
    subtitle: 'Calculez la taille de position optimale selon vos paramètres de risque',
    tradeParams: 'Paramètres de Trade',
    accountBalance: 'Solde du Compte (USD)',
    riskPerTrade: 'Risque par Trade (%)',
    stopLoss: 'Stop Loss (Pips)',
    pipValue: 'Valeur du Pip (USD par lot)',
    pipValueHint: 'EUR/USD = 10$ | USD/JPY ≈ 6,50$ | GBP/USD = 10$',
    dailyDDLimit: 'Limite DD Journalière (%)',
    positionSize: 'Taille de Position',
    standardLots: 'Lots Standard',
    riskAmount: 'Montant à Risque',
    miniLots: 'Mini Lots',
    dailyDDContext: 'Contexte DD Journalier',
    dailyDDLimitLabel: 'Limite DD Journalière',
    thisTradeUses: 'Ce trade utilise',
    ofDailyLimit: 'de la limite journalière',
    maxLosingTrades: 'Max trades perdants aujourd\'hui',
    safe: 'SÛR',
    risky: 'RISQUÉ',
    violation: 'VIOLATION',
    safeMsg: 'Bonne gestion du risque.',
    riskyMsg: 'sur un seul trade est risqué.',
    violationMsg: 'Ce trade dépasse votre limite de drawdown journalière.',
    usingPercent: 'Utilisation de',
    ctaTitle: 'Calcul Automatique Avant Chaque Trade',
    ctaDesc: 'My Prop Firms vérifie votre risque par rapport à toutes les limites DD avant de trader.',
    tryFree: 'Essayer My Prop Firms Gratuitement',
  },
  de: {
    allTools: 'Alle Tools',
    title: 'Risiko-Rechner',
    subtitle: 'Berechnen Sie die optimale Positionsgröße basierend auf Ihren Risikoparametern',
    tradeParams: 'Trade-Parameter',
    accountBalance: 'Kontostand (USD)',
    riskPerTrade: 'Risiko pro Trade (%)',
    stopLoss: 'Stop Loss (Pips)',
    pipValue: 'Pip-Wert (USD pro Lot)',
    pipValueHint: 'EUR/USD = $10 | USD/JPY ≈ $6,50 | GBP/USD = $10',
    dailyDDLimit: 'Tägliches DD-Limit (%)',
    positionSize: 'Positionsgröße',
    standardLots: 'Standard Lots',
    riskAmount: 'Risikobetrag',
    miniLots: 'Mini Lots',
    dailyDDContext: 'Täglicher DD-Kontext',
    dailyDDLimitLabel: 'Tägliches DD-Limit',
    thisTradeUses: 'Dieser Trade nutzt',
    ofDailyLimit: 'des Tageslimits',
    maxLosingTrades: 'Max Verlusttrades heute',
    safe: 'SICHER',
    risky: 'RISKANT',
    violation: 'VERSTOSS',
    safeMsg: 'Gutes Risikomanagement.',
    riskyMsg: 'in einem Trade ist riskant.',
    violationMsg: 'Dieser Trade überschreitet Ihr tägliches Drawdown-Limit.',
    usingPercent: 'Nutzung von',
    ctaTitle: 'Automatische Berechnung vor jedem Trade',
    ctaDesc: 'My Prop Firms prüft Ihr Risiko gegen alle DD-Limits vor dem Trading.',
    tryFree: 'My Prop Firms kostenlos testen',
  },
  es: {
    allTools: 'Todas las Herramientas',
    title: 'Calculadora de Riesgo',
    subtitle: 'Calcula el tamaño óptimo de posición según tus parámetros de riesgo',
    tradeParams: 'Parámetros del Trade',
    accountBalance: 'Saldo de Cuenta (USD)',
    riskPerTrade: 'Riesgo por Trade (%)',
    stopLoss: 'Stop Loss (Pips)',
    pipValue: 'Valor del Pip (USD por lote)',
    pipValueHint: 'EUR/USD = $10 | USD/JPY ≈ $6.50 | GBP/USD = $10',
    dailyDDLimit: 'Límite DD Diario (%)',
    positionSize: 'Tamaño de Posición',
    standardLots: 'Lotes Estándar',
    riskAmount: 'Monto en Riesgo',
    miniLots: 'Mini Lotes',
    dailyDDContext: 'Contexto DD Diario',
    dailyDDLimitLabel: 'Límite DD Diario',
    thisTradeUses: 'Este trade usa',
    ofDailyLimit: 'del límite diario',
    maxLosingTrades: 'Máx trades perdedores hoy',
    safe: 'SEGURO',
    risky: 'ARRIESGADO',
    violation: 'VIOLACIÓN',
    safeMsg: 'Buena gestión de riesgo.',
    riskyMsg: 'en un trade es arriesgado.',
    violationMsg: 'Este trade excede tu límite de drawdown diario.',
    usingPercent: 'Usando',
    ctaTitle: 'Cálculo Automático Antes de Cada Trade',
    ctaDesc: 'My Prop Firms verifica tu riesgo contra todos los límites DD antes de operar.',
    tryFree: 'Probar My Prop Firms Gratis',
  },
  pt: {
    allTools: 'Todas as Ferramentas',
    title: 'Calculadora de Risco',
    subtitle: 'Calcule o tamanho ideal de posição com base nos seus parâmetros de risco',
    tradeParams: 'Parâmetros do Trade',
    accountBalance: 'Saldo da Conta (USD)',
    riskPerTrade: 'Risco por Trade (%)',
    stopLoss: 'Stop Loss (Pips)',
    pipValue: 'Valor do Pip (USD por lote)',
    pipValueHint: 'EUR/USD = $10 | USD/JPY ≈ $6,50 | GBP/USD = $10',
    dailyDDLimit: 'Limite DD Diário (%)',
    positionSize: 'Tamanho da Posição',
    standardLots: 'Lotes Padrão',
    riskAmount: 'Valor em Risco',
    miniLots: 'Mini Lotes',
    dailyDDContext: 'Contexto DD Diário',
    dailyDDLimitLabel: 'Limite DD Diário',
    thisTradeUses: 'Este trade usa',
    ofDailyLimit: 'do limite diário',
    maxLosingTrades: 'Máx trades perdedores hoje',
    safe: 'SEGURO',
    risky: 'ARRISCADO',
    violation: 'VIOLAÇÃO',
    safeMsg: 'Boa gestão de risco.',
    riskyMsg: 'em um trade é arriscado.',
    violationMsg: 'Este trade excede seu limite de drawdown diário.',
    usingPercent: 'Usando',
    ctaTitle: 'Cálculo Automático Antes de Cada Trade',
    ctaDesc: 'My Prop Firms verifica seu risco contra todos os limites DD antes de operar.',
    tryFree: 'Experimentar My Prop Firms Grátis',
  },
  ar: {
    allTools: 'جميع الأدوات',
    title: 'حاسبة المخاطر',
    subtitle: 'احسب حجم المركز الأمثل بناءً على معايير المخاطر',
    tradeParams: 'معايير الصفقة',
    accountBalance: 'رصيد الحساب (USD)',
    riskPerTrade: 'المخاطرة لكل صفقة (%)',
    stopLoss: 'وقف الخسارة (نقاط)',
    pipValue: 'قيمة النقطة (USD لكل لوت)',
    pipValueHint: 'EUR/USD = $10 | USD/JPY ≈ $6.50 | GBP/USD = $10',
    dailyDDLimit: 'حد السحب اليومي (%)',
    positionSize: 'حجم المركز',
    standardLots: 'لوت قياسي',
    riskAmount: 'مبلغ المخاطرة',
    miniLots: 'ميني لوت',
    dailyDDContext: 'سياق السحب اليومي',
    dailyDDLimitLabel: 'حد السحب اليومي',
    thisTradeUses: 'هذه الصفقة تستخدم',
    ofDailyLimit: 'من الحد اليومي',
    maxLosingTrades: 'أقصى صفقات خاسرة اليوم',
    safe: 'آمن',
    risky: 'محفوف بالمخاطر',
    violation: 'انتهاك',
    safeMsg: 'إدارة مخاطر جيدة.',
    riskyMsg: 'في صفقة واحدة محفوف بالمخاطر.',
    violationMsg: 'هذه الصفقة تتجاوز حد السحب اليومي.',
    usingPercent: 'استخدام',
    ctaTitle: 'حساب تلقائي قبل كل صفقة',
    ctaDesc: 'My Prop Firms يتحقق من مخاطرك مقابل جميع حدود السحب قبل التداول.',
    tryFree: 'جرب My Prop Firms مجاناً',
  },
  hi: {
    allTools: 'सभी टूल्स',
    title: 'रिस्क कैलकुलेटर',
    subtitle: 'अपने रिस्क पैरामीटर के आधार पर इष्टतम पोजीशन साइज की गणना करें',
    tradeParams: 'ट्रेड पैरामीटर',
    accountBalance: 'अकाउंट बैलेंस (USD)',
    riskPerTrade: 'प्रति ट्रेड रिस्क (%)',
    stopLoss: 'स्टॉप लॉस (पिप्स)',
    pipValue: 'पिप वैल्यू (USD प्रति लॉट)',
    pipValueHint: 'EUR/USD = $10 | USD/JPY ≈ $6.50 | GBP/USD = $10',
    dailyDDLimit: 'दैनिक DD सीमा (%)',
    positionSize: 'पोजीशन साइज',
    standardLots: 'स्टैंडर्ड लॉट्स',
    riskAmount: 'रिस्क राशि',
    miniLots: 'मिनी लॉट्स',
    dailyDDContext: 'दैनिक DD संदर्भ',
    dailyDDLimitLabel: 'दैनिक DD सीमा',
    thisTradeUses: 'यह ट्रेड उपयोग करता है',
    ofDailyLimit: 'दैनिक सीमा का',
    maxLosingTrades: 'आज अधिकतम हारने वाले ट्रेड',
    safe: 'सुरक्षित',
    risky: 'जोखिम भरा',
    violation: 'उल्लंघन',
    safeMsg: 'अच्छा जोखिम प्रबंधन।',
    riskyMsg: 'एक ट्रेड में जोखिम भरा है।',
    violationMsg: 'यह ट्रेड आपकी दैनिक ड्रॉडाउन सीमा से अधिक है।',
    usingPercent: 'उपयोग',
    ctaTitle: 'हर ट्रेड से पहले ऑटो-कैलकुलेट',
    ctaDesc: 'My Prop Firms ट्रेडिंग से पहले सभी DD सीमाओं के विरुद्ध आपके जोखिम की जांच करता है।',
    tryFree: 'My Prop Firms मुफ्त आज़माएं',
  },
};

const presetBalances = [10000, 25000, 50000, 100000, 200000];
const presetRisks = [0.5, 1, 1.5, 2, 3];
const presetStopLosses = [10, 15, 20, 30, 50];

export default function RiskCalculatorPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [balance, setBalance] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(20);
  const [pipValue, setPipValue] = useState(10);
  const [dailyDDLimit, setDailyDDLimit] = useState(5);

  const riskAmount = (balance * riskPercent) / 100;
  const positionSize = stopLossPips > 0 ? riskAmount / (stopLossPips * pipValue) : 0;
  const dailyDDLimitUsd = (balance * dailyDDLimit) / 100;
  const tradeUsagePercent = (riskAmount / dailyDDLimitUsd) * 100;
  const maxLosingTrades = Math.floor(dailyDDLimitUsd / riskAmount);

  let classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  let message: string;

  if (tradeUsagePercent >= 100) {
    classification = 'VIOLATION';
    message = t.violationMsg;
  } else if (tradeUsagePercent > 50) {
    classification = 'RISKY';
    message = `${t.usingPercent} ${tradeUsagePercent.toFixed(0)}% ${t.riskyMsg}`;
  } else {
    classification = 'SAFE';
    message = `${t.usingPercent} ${tradeUsagePercent.toFixed(0)}% ${t.ofDailyLimit}. ${t.safeMsg}`;
  }

  const getResultStyles = () => {
    if (classification === 'SAFE') return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
    if (classification === 'RISKY') return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
  };

  const styles = getResultStyles();
  const ResultIcon = classification === 'SAFE' ? CheckCircle : classification === 'RISKY' ? AlertTriangle : XCircle;
  const statusText = classification === 'SAFE' ? t.safe : classification === 'RISKY' ? t.risky : t.violation;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href={`/${locale}/tools`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t.allTools}
        </Link>

        <DemoBanner toolName="risk calculator" />

        <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.subtitle}</p>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t.tradeParams}</h2>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">{t.accountBalance}</label>
            <div className="flex gap-2 flex-wrap">
              {presetBalances.map((b) => (
                <button
                  key={b}
                  onClick={() => setBalance(b)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    balance === b ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  ${(b / 1000)}K
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">{t.riskPerTrade}</label>
            <div className="flex gap-2 flex-wrap">
              {presetRisks.map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskPercent(r)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    riskPercent === r ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">{t.stopLoss}</label>
            <div className="flex gap-2 flex-wrap">
              {presetStopLosses.map((sl) => (
                <button
                  key={sl}
                  onClick={() => setStopLossPips(sl)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    stopLossPips === sl ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {sl}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">{t.pipValue}</label>
            <input
              type="number"
              value={pipValue}
              onChange={(e) => setPipValue(parseFloat(e.target.value) || 10)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">{t.pipValueHint}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">{t.dailyDDLimit}</label>
            <input
              type="number"
              value={dailyDDLimit}
              onChange={(e) => setDailyDDLimit(parseFloat(e.target.value) || 5)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t.positionSize}</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{t.positionSize}</p>
              <p className="text-3xl font-bold text-white">{positionSize.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{t.standardLots}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{t.riskAmount}</p>
              <p className="text-3xl font-bold text-white">${riskAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{t.miniLots}: {(positionSize * 10).toFixed(1)}</p>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-400 mb-3">{t.dailyDDContext}</h3>
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{t.dailyDDLimitLabel}</span>
              <span className="text-white">${dailyDDLimitUsd.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{t.thisTradeUses}</span>
              <span className={`font-medium ${styles.text}`}>{tradeUsagePercent.toFixed(1)}% {t.ofDailyLimit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t.maxLosingTrades}</span>
              <span className="text-white">{maxLosingTrades}</span>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
            <div className="flex items-center gap-3">
              <ResultIcon className={`w-6 h-6 ${styles.text}`} />
              <div>
                <p className={`font-semibold ${styles.text}`}>{statusText}</p>
                <p className="text-sm text-gray-300">{message}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/20 to-gray-900 rounded-xl border border-emerald-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">{t.ctaTitle}</h3>
          <p className="text-gray-400 mb-4">{t.ctaDesc}</p>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            {t.tryFree}
          </Link>
        </div>
      </div>
    </div>
  );
}
