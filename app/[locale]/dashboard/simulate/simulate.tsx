'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Check, AlertTriangle, XCircle, ChevronDown } from 'lucide-react'

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
    tradeSimulator: 'Trade Simulator',
    checkTradeSafe: 'Check if a trade is safe before entering',
    selectAccount: 'Select Account',
    chooseAccount: 'Choose an account...',
    currentBalance: 'Current Balance',
    todayPnL: "Today's P&L",
    dailyDDLimit: 'Daily DD Limit',
    maxDDLimit: 'Max DD Limit',
    none: 'None',
    riskInUsd: 'Risk in USD (if you lose this trade)',
    simulateTrade: 'Simulate Trade',
    selectAccountHint: 'Select an account and enter your risk to simulate',
    // Results
    safe: 'SAFE',
    risky: 'RISKY',
    violation: 'VIOLATION',
    wouldBreach: 'This trade would BREACH your',
    dailyDrawdown: 'daily drawdown',
    maxDrawdown: 'max drawdown',
    limitOn: 'limit on',
    wouldUse: 'This trade would use',
    ofYourDaily: 'of your daily drawdown on',
    withinLimits: 'This trade is within your limits on',
    dailyDDUsed: 'Daily DD',
    used: 'used',
    limitIs: 'limit is',
    only: 'Only',
    bufferRemaining: 'buffer remaining',
    ok: 'OK',
    wouldBring: 'This trade would bring you to',
    ofMaxDrawdown: 'of max drawdown on',
    maxDDUsed: 'Max DD',
    wouldBeUsed: 'would be used',
    balanceAfterLoss: 'Balance after loss',
    floor: 'floor',
  },
  fr: {
    tradeSimulator: 'Simulateur de Trade',
    checkTradeSafe: 'Vérifiez si un trade est sûr avant de le prendre',
    selectAccount: 'Sélectionner un Compte',
    chooseAccount: 'Choisir un compte...',
    currentBalance: 'Solde Actuel',
    todayPnL: "P&L Aujourd'hui",
    dailyDDLimit: 'Limite DD Journalier',
    maxDDLimit: 'Limite DD Max',
    none: 'Aucune',
    riskInUsd: 'Risque en USD (si vous perdez ce trade)',
    simulateTrade: 'Simuler le Trade',
    selectAccountHint: 'Sélectionnez un compte et entrez votre risque pour simuler',
    safe: 'SÛR',
    risky: 'RISQUÉ',
    violation: 'VIOLATION',
    wouldBreach: 'Ce trade VIOLERAIT votre',
    dailyDrawdown: 'drawdown journalier',
    maxDrawdown: 'drawdown maximum',
    limitOn: 'limite sur',
    wouldUse: 'Ce trade utiliserait',
    ofYourDaily: 'de votre drawdown journalier sur',
    withinLimits: 'Ce trade est dans vos limites sur',
    dailyDDUsed: 'DD Journalier',
    used: 'utilisé',
    limitIs: 'la limite est',
    only: 'Seulement',
    bufferRemaining: 'de marge restante',
    ok: 'OK',
    wouldBring: 'Ce trade vous amènerait à',
    ofMaxDrawdown: 'du drawdown max sur',
    maxDDUsed: 'DD Max',
    wouldBeUsed: 'serait utilisé',
    balanceAfterLoss: 'Solde après perte',
    floor: 'plancher',
  },
  de: {
    tradeSimulator: 'Trade-Simulator',
    checkTradeSafe: 'Prüfen Sie, ob ein Trade sicher ist, bevor Sie einsteigen',
    selectAccount: 'Konto Auswählen',
    chooseAccount: 'Konto wählen...',
    currentBalance: 'Aktueller Saldo',
    todayPnL: 'Heutiger G/V',
    dailyDDLimit: 'Tägliches DD-Limit',
    maxDDLimit: 'Max DD-Limit',
    none: 'Keines',
    riskInUsd: 'Risiko in USD (falls Sie diesen Trade verlieren)',
    simulateTrade: 'Trade Simulieren',
    selectAccountHint: 'Wählen Sie ein Konto und geben Sie Ihr Risiko ein',
    safe: 'SICHER',
    risky: 'RISKANT',
    violation: 'VERLETZUNG',
    wouldBreach: 'Dieser Trade würde Ihr',
    dailyDrawdown: 'tägliches Drawdown',
    maxDrawdown: 'maximales Drawdown',
    limitOn: 'Limit verletzen bei',
    wouldUse: 'Dieser Trade würde',
    ofYourDaily: 'Ihres täglichen Drawdowns nutzen bei',
    withinLimits: 'Dieser Trade ist innerhalb Ihrer Limits bei',
    dailyDDUsed: 'Tägliches DD',
    used: 'verwendet',
    limitIs: 'Limit ist',
    only: 'Nur',
    bufferRemaining: 'Puffer verbleibend',
    ok: 'OK',
    wouldBring: 'Dieser Trade würde Sie auf',
    ofMaxDrawdown: 'des max Drawdowns bringen bei',
    maxDDUsed: 'Max DD',
    wouldBeUsed: 'würde verwendet',
    balanceAfterLoss: 'Saldo nach Verlust',
    floor: 'Untergrenze',
  },
  es: {
    tradeSimulator: 'Simulador de Trade',
    checkTradeSafe: 'Verifica si un trade es seguro antes de entrar',
    selectAccount: 'Seleccionar Cuenta',
    chooseAccount: 'Elegir una cuenta...',
    currentBalance: 'Saldo Actual',
    todayPnL: 'G/P de Hoy',
    dailyDDLimit: 'Límite DD Diario',
    maxDDLimit: 'Límite DD Máximo',
    none: 'Ninguno',
    riskInUsd: 'Riesgo en USD (si pierdes este trade)',
    simulateTrade: 'Simular Trade',
    selectAccountHint: 'Selecciona una cuenta e ingresa tu riesgo para simular',
    safe: 'SEGURO',
    risky: 'ARRIESGADO',
    violation: 'VIOLACIÓN',
    wouldBreach: 'Este trade VIOLARÍA tu',
    dailyDrawdown: 'drawdown diario',
    maxDrawdown: 'drawdown máximo',
    limitOn: 'límite en',
    wouldUse: 'Este trade usaría',
    ofYourDaily: 'de tu drawdown diario en',
    withinLimits: 'Este trade está dentro de tus límites en',
    dailyDDUsed: 'DD Diario',
    used: 'usado',
    limitIs: 'el límite es',
    only: 'Solo',
    bufferRemaining: 'de margen restante',
    ok: 'OK',
    wouldBring: 'Este trade te llevaría a',
    ofMaxDrawdown: 'del drawdown máximo en',
    maxDDUsed: 'DD Máx',
    wouldBeUsed: 'se usaría',
    balanceAfterLoss: 'Saldo después de pérdida',
    floor: 'piso',
  },
  pt: {
    tradeSimulator: 'Simulador de Trade',
    checkTradeSafe: 'Verifique se um trade é seguro antes de entrar',
    selectAccount: 'Selecionar Conta',
    chooseAccount: 'Escolher uma conta...',
    currentBalance: 'Saldo Atual',
    todayPnL: 'L/P de Hoje',
    dailyDDLimit: 'Limite DD Diário',
    maxDDLimit: 'Limite DD Máximo',
    none: 'Nenhum',
    riskInUsd: 'Risco em USD (se você perder este trade)',
    simulateTrade: 'Simular Trade',
    selectAccountHint: 'Selecione uma conta e insira seu risco para simular',
    safe: 'SEGURO',
    risky: 'ARRISCADO',
    violation: 'VIOLAÇÃO',
    wouldBreach: 'Este trade VIOLARIA seu',
    dailyDrawdown: 'drawdown diário',
    maxDrawdown: 'drawdown máximo',
    limitOn: 'limite em',
    wouldUse: 'Este trade usaria',
    ofYourDaily: 'do seu drawdown diário em',
    withinLimits: 'Este trade está dentro dos seus limites em',
    dailyDDUsed: 'DD Diário',
    used: 'usado',
    limitIs: 'o limite é',
    only: 'Apenas',
    bufferRemaining: 'de margem restante',
    ok: 'OK',
    wouldBring: 'Este trade te levaria a',
    ofMaxDrawdown: 'do drawdown máximo em',
    maxDDUsed: 'DD Máx',
    wouldBeUsed: 'seria usado',
    balanceAfterLoss: 'Saldo após perda',
    floor: 'piso',
  },
  ar: {
    tradeSimulator: 'محاكي الصفقات',
    checkTradeSafe: 'تحقق مما إذا كانت الصفقة آمنة قبل الدخول',
    selectAccount: 'اختر حساباً',
    chooseAccount: 'اختر حساباً...',
    currentBalance: 'الرصيد الحالي',
    todayPnL: 'ربح/خسارة اليوم',
    dailyDDLimit: 'حد السحب اليومي',
    maxDDLimit: 'حد السحب الأقصى',
    none: 'لا يوجد',
    riskInUsd: 'المخاطرة بالدولار (إذا خسرت هذه الصفقة)',
    simulateTrade: 'محاكاة الصفقة',
    selectAccountHint: 'اختر حساباً وأدخل مخاطرتك للمحاكاة',
    safe: 'آمن',
    risky: 'محفوف بالمخاطر',
    violation: 'انتهاك',
    wouldBreach: 'هذه الصفقة ستخرق',
    dailyDrawdown: 'السحب اليومي',
    maxDrawdown: 'السحب الأقصى',
    limitOn: 'الحد في',
    wouldUse: 'هذه الصفقة ستستخدم',
    ofYourDaily: 'من سحبك اليومي في',
    withinLimits: 'هذه الصفقة ضمن حدودك في',
    dailyDDUsed: 'السحب اليومي',
    used: 'مستخدم',
    limitIs: 'الحد هو',
    only: 'فقط',
    bufferRemaining: 'هامش متبقي',
    ok: 'موافق',
    wouldBring: 'هذه الصفقة ستوصلك إلى',
    ofMaxDrawdown: 'من السحب الأقصى في',
    maxDDUsed: 'السحب الأقصى',
    wouldBeUsed: 'سيتم استخدامه',
    balanceAfterLoss: 'الرصيد بعد الخسارة',
    floor: 'الحد الأدنى',
  },
  hi: {
    tradeSimulator: 'ट्रेड सिम्युलेटर',
    checkTradeSafe: 'एंट्री से पहले जांचें कि ट्रेड सुरक्षित है या नहीं',
    selectAccount: 'अकाउंट चुनें',
    chooseAccount: 'एक अकाउंट चुनें...',
    currentBalance: 'वर्तमान बैलेंस',
    todayPnL: 'आज का P&L',
    dailyDDLimit: 'दैनिक DD लिमिट',
    maxDDLimit: 'मैक्स DD लिमिट',
    none: 'कोई नहीं',
    riskInUsd: 'USD में रिस्क (अगर आप यह ट्रेड हारते हैं)',
    simulateTrade: 'ट्रेड सिम्युलेट करें',
    selectAccountHint: 'सिम्युलेट करने के लिए एक अकाउंट चुनें और अपना रिस्क दर्ज करें',
    safe: 'सुरक्षित',
    risky: 'जोखिमपूर्ण',
    violation: 'उल्लंघन',
    wouldBreach: 'यह ट्रेड आपके',
    dailyDrawdown: 'दैनिक ड्रॉडाउन',
    maxDrawdown: 'अधिकतम ड्रॉडाउन',
    limitOn: 'लिमिट का उल्लंघन करेगा',
    wouldUse: 'यह ट्रेड',
    ofYourDaily: 'आपके दैनिक ड्रॉडाउन का उपयोग करेगा',
    withinLimits: 'यह ट्रेड आपकी सीमाओं के भीतर है',
    dailyDDUsed: 'दैनिक DD',
    used: 'उपयोग किया',
    limitIs: 'सीमा है',
    only: 'केवल',
    bufferRemaining: 'बफर शेष',
    ok: 'ठीक',
    wouldBring: 'यह ट्रेड आपको',
    ofMaxDrawdown: 'मैक्स ड्रॉडाउन पर ले जाएगा',
    maxDDUsed: 'मैक्स DD',
    wouldBeUsed: 'उपयोग होगा',
    balanceAfterLoss: 'नुकसान के बाद बैलेंस',
    floor: 'फ्लोर',
  },
};

// =============================================================================
// TYPES & DATA
// =============================================================================

interface UserAccount {
  id: string
  prop_firm: string
  program: string
  account_size: number
  current_balance: number
  start_balance: number
  today_pnl: number
  daily_dd_percent: number
  max_dd_percent: number
  max_dd_type: 'static' | 'trailing' | 'eod_trailing'
}

interface SimResult {
  status: 'safe' | 'risky' | 'violation'
  message: string
  details: string[]
}

const mockAccounts: UserAccount[] = [
  {
    id: '1',
    prop_firm: 'FTMO',
    program: 'Standard $100K',
    account_size: 100000,
    current_balance: 102450,
    start_balance: 100000,
    today_pnl: -850,
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
  },
  {
    id: '2',
    prop_firm: 'FundedNext',
    program: 'Stellar 2-Step $50K',
    account_size: 50000,
    current_balance: 51200,
    start_balance: 50000,
    today_pnl: 320,
    daily_dd_percent: 5,
    max_dd_percent: 10,
    max_dd_type: 'static',
  },
  {
    id: '3',
    prop_firm: 'My Funded Futures',
    program: 'Starter $50K',
    account_size: 50000,
    current_balance: 48900,
    start_balance: 50000,
    today_pnl: -450,
    daily_dd_percent: 0,
    max_dd_percent: 4,
    max_dd_type: 'eod_trailing',
  },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SimulatePage() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = translations[locale]
  
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [riskUsd, setRiskUsd] = useState('')
  const [result, setResult] = useState<SimResult | null>(null)
  
  const account = mockAccounts.find(a => a.id === selectedAccountId)
  
  const simulateTrade = (account: UserAccount, risk: number): SimResult => {
    const details: string[] = []
    let isViolation = false
    let isRisky = false
    let message = ''
    
    if (account.daily_dd_percent > 0) {
      const dailyDDTotal = account.account_size * (account.daily_dd_percent / 100)
      const dailyDDUsed = Math.abs(Math.min(0, account.today_pnl))
      const dailyDDAfter = dailyDDUsed + risk
      const dailyDDPercentAfter = (dailyDDAfter / dailyDDTotal) * 100
      
      if (dailyDDAfter >= dailyDDTotal) {
        isViolation = true
        message = `${t.wouldBreach} ${t.dailyDrawdown} ${t.limitOn} ${account.prop_firm}.`
        details.push(`${t.dailyDDUsed}: ${dailyDDPercentAfter.toFixed(0)}% ${t.used} (${t.limitIs} 100%)`)
      } else if (dailyDDPercentAfter > 80) {
        isRisky = true
        if (!message) message = `${t.wouldUse} ${dailyDDPercentAfter.toFixed(0)}% ${t.ofYourDaily} ${account.prop_firm}.`
        details.push(`${t.only} $${(dailyDDTotal - dailyDDAfter).toFixed(0)} ${t.bufferRemaining}`)
      } else if (dailyDDPercentAfter > 50) {
        isRisky = true
        details.push(`${t.dailyDDUsed}: ${dailyDDPercentAfter.toFixed(0)}% ${t.wouldBeUsed}`)
      } else {
        details.push(`${t.dailyDDUsed}: ${dailyDDPercentAfter.toFixed(0)}% - ${t.ok}`)
      }
    }
    
    const maxDDTotal = account.account_size * (account.max_dd_percent / 100)
    let floor: number
    
    if (account.max_dd_type === 'static') {
      floor = account.start_balance - maxDDTotal
    } else {
      const highestBalance = Math.max(account.start_balance, account.current_balance)
      floor = highestBalance - maxDDTotal
    }
    
    const balanceAfterLoss = account.current_balance - risk
    const maxDDUsedAfter = ((account.start_balance - balanceAfterLoss) / maxDDTotal) * 100
    
    if (balanceAfterLoss <= floor) {
      isViolation = true
      message = `${t.wouldBreach} ${t.maxDrawdown} ${t.limitOn} ${account.prop_firm}.`
      details.push(`${t.balanceAfterLoss}: $${balanceAfterLoss.toFixed(0)} (${t.floor}: $${floor.toFixed(0)})`)
    } else if (maxDDUsedAfter > 80) {
      if (!isViolation) isRisky = true
      if (!message) message = `${t.wouldBring} ${maxDDUsedAfter.toFixed(0)}% ${t.ofMaxDrawdown} ${account.prop_firm}.`
      details.push(`${t.only} $${(balanceAfterLoss - floor).toFixed(0)} ${t.bufferRemaining}`)
    } else {
      details.push(`${t.maxDDUsed}: ${Math.max(0, maxDDUsedAfter).toFixed(0)}% ${t.wouldBeUsed}`)
    }
    
    let status: 'safe' | 'risky' | 'violation' = 'safe'
    if (isViolation) {
      status = 'violation'
    } else if (isRisky) {
      status = 'risky'
    }
    
    if (status === 'safe' && !message) {
      message = `${t.withinLimits} ${account.prop_firm}.`
    }
    
    return { status, message, details }
  }
  
  const handleSimulate = () => {
    if (!account || !riskUsd) return
    
    const risk = parseFloat(riskUsd)
    if (isNaN(risk) || risk <= 0) return
    
    const simResult = simulateTrade(account, risk)
    setResult(simResult)
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                {t.tradeSimulator}
              </h1>
              <p className="text-sm text-gray-500">{t.checkTradeSafe}</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Select Account */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t.selectAccount}
            </label>
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => { setSelectedAccountId(e.target.value); setResult(null) }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-emerald-500"
              >
                <option value="">{t.chooseAccount}</option>
                {mockAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.prop_firm} — {acc.program} (${acc.current_balance.toLocaleString()})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Account Summary */}
          {account && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">{t.currentBalance}</p>
                  <p className="text-white font-medium">${account.current_balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.todayPnL}</p>
                  <p className={account.today_pnl >= 0 ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                    {account.today_pnl >= 0 ? '+' : ''}${account.today_pnl.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t.dailyDDLimit}</p>
                  <p className="text-white font-medium">
                    {account.daily_dd_percent > 0 ? `${account.daily_dd_percent}%` : t.none}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t.maxDDLimit}</p>
                  <p className="text-white font-medium">
                    {account.max_dd_percent}% ({account.max_dd_type})
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Risk Input */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t.riskInUsd}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={riskUsd}
                onChange={(e) => { setRiskUsd(e.target.value); setResult(null) }}
                placeholder="500"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          {/* Simulate Button */}
          <button
            onClick={handleSimulate}
            disabled={!selectedAccountId || !riskUsd}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            {t.simulateTrade}
          </button>
          
          {/* Result */}
          {result && (
            <div className={`rounded-2xl overflow-hidden ${
              result.status === 'safe' ? 'bg-emerald-500/10 border-2 border-emerald-500/30' :
              result.status === 'risky' ? 'bg-yellow-500/10 border-2 border-yellow-500/30' :
              'bg-red-500/10 border-2 border-red-500/30'
            }`}>
              {/* Status Header */}
              <div className={`p-6 text-center ${
                result.status === 'safe' ? 'bg-emerald-500/20' :
                result.status === 'risky' ? 'bg-yellow-500/20' :
                'bg-red-500/20'
              }`}>
                <div className="flex justify-center mb-3">
                  {result.status === 'safe' && <Check className="w-12 h-12 text-emerald-400" />}
                  {result.status === 'risky' && <AlertTriangle className="w-12 h-12 text-yellow-400" />}
                  {result.status === 'violation' && <XCircle className="w-12 h-12 text-red-400" />}
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${
                  result.status === 'safe' ? 'text-emerald-400' :
                  result.status === 'risky' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {result.status === 'safe' && `✅ ${t.safe}`}
                  {result.status === 'risky' && `⚠️ ${t.risky}`}
                  {result.status === 'violation' && `❌ ${t.violation}`}
                </h2>
                <p className="text-white text-lg">{result.message}</p>
              </div>
              
              {/* Details */}
              <div className="p-4 space-y-2">
                {result.details.map((detail, i) => (
                  <p key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-gray-600">•</span>
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {!result && (
            <div className="text-center py-8 text-gray-600">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t.selectAccountHint}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
