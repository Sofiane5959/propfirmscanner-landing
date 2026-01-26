'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { 
  TrendingDown, Play, RotateCcw, AlertTriangle,
  Info, CheckCircle, XCircle
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
    title: 'Drawdown Simulator',
    subtitle: 'Understand how static vs trailing drawdown works',
    accountSize: 'Account Size',
    maxDrawdown: 'Max Drawdown %',
    dailyDrawdown: 'Daily Drawdown %',
    simulate: 'Simulate',
    staticDrawdown: 'Static Drawdown',
    trailingDrawdown: 'Trailing Drawdown',
    ddUsed: 'DD Used',
    limit: 'Limit',
    remaining: 'Remaining',
    highWaterMark: 'High Water Mark',
    trailingLimit: 'Trailing Limit',
    staticTip: 'Static: Limit is fixed from starting balance. Easier to manage.',
    trailingTip: 'Trailing: Limit moves up with profits. Be careful!',
    addTrade: 'Add Trade (Manual Mode)',
    currentBalance: 'Current Balance',
    tradeHistory: 'Trade History',
    pnl: 'P&L',
    balance: 'Balance',
    hwm: 'HWM',
    staticDD: 'Static DD',
    trailingDD: 'Trailing DD',
  },
  fr: {
    title: 'Simulateur de Drawdown',
    subtitle: 'Comprenez comment fonctionne le drawdown statique vs trailing',
    accountSize: 'Taille du Compte',
    maxDrawdown: 'Drawdown Max %',
    dailyDrawdown: 'Drawdown Journalier %',
    simulate: 'Simuler',
    staticDrawdown: 'Drawdown Statique',
    trailingDrawdown: 'Drawdown Trailing',
    ddUsed: 'DD Utilisé',
    limit: 'Limite',
    remaining: 'Restant',
    highWaterMark: 'High Water Mark',
    trailingLimit: 'Limite Trailing',
    staticTip: 'Statique : La limite est fixée depuis le solde initial. Plus facile à gérer.',
    trailingTip: 'Trailing : La limite monte avec les profits. Attention !',
    addTrade: 'Ajouter un Trade (Mode Manuel)',
    currentBalance: 'Solde Actuel',
    tradeHistory: 'Historique des Trades',
    pnl: 'P&L',
    balance: 'Solde',
    hwm: 'HWM',
    staticDD: 'DD Statique',
    trailingDD: 'DD Trailing',
  },
  de: {
    title: 'Drawdown-Simulator',
    subtitle: 'Verstehen Sie, wie statisches vs. Trailing-Drawdown funktioniert',
    accountSize: 'Kontogröße',
    maxDrawdown: 'Max Drawdown %',
    dailyDrawdown: 'Täglicher Drawdown %',
    simulate: 'Simulieren',
    staticDrawdown: 'Statischer Drawdown',
    trailingDrawdown: 'Trailing Drawdown',
    ddUsed: 'DD Verwendet',
    limit: 'Limit',
    remaining: 'Verbleibend',
    highWaterMark: 'High Water Mark',
    trailingLimit: 'Trailing-Limit',
    staticTip: 'Statisch: Limit ist vom Startguthaben fixiert. Einfacher zu verwalten.',
    trailingTip: 'Trailing: Limit steigt mit Gewinnen. Vorsicht!',
    addTrade: 'Trade Hinzufügen (Manueller Modus)',
    currentBalance: 'Aktueller Saldo',
    tradeHistory: 'Trade-Verlauf',
    pnl: 'P&L',
    balance: 'Saldo',
    hwm: 'HWM',
    staticDD: 'Statischer DD',
    trailingDD: 'Trailing DD',
  },
  es: {
    title: 'Simulador de Drawdown',
    subtitle: 'Entiende cómo funciona el drawdown estático vs trailing',
    accountSize: 'Tamaño de Cuenta',
    maxDrawdown: 'Drawdown Máx %',
    dailyDrawdown: 'Drawdown Diario %',
    simulate: 'Simular',
    staticDrawdown: 'Drawdown Estático',
    trailingDrawdown: 'Drawdown Trailing',
    ddUsed: 'DD Usado',
    limit: 'Límite',
    remaining: 'Restante',
    highWaterMark: 'High Water Mark',
    trailingLimit: 'Límite Trailing',
    staticTip: 'Estático: El límite es fijo desde el saldo inicial. Más fácil de gestionar.',
    trailingTip: 'Trailing: El límite sube con las ganancias. ¡Cuidado!',
    addTrade: 'Agregar Trade (Modo Manual)',
    currentBalance: 'Saldo Actual',
    tradeHistory: 'Historial de Trades',
    pnl: 'P&L',
    balance: 'Saldo',
    hwm: 'HWM',
    staticDD: 'DD Estático',
    trailingDD: 'DD Trailing',
  },
  pt: {
    title: 'Simulador de Drawdown',
    subtitle: 'Entenda como funciona o drawdown estático vs trailing',
    accountSize: 'Tamanho da Conta',
    maxDrawdown: 'Drawdown Máx %',
    dailyDrawdown: 'Drawdown Diário %',
    simulate: 'Simular',
    staticDrawdown: 'Drawdown Estático',
    trailingDrawdown: 'Drawdown Trailing',
    ddUsed: 'DD Usado',
    limit: 'Limite',
    remaining: 'Restante',
    highWaterMark: 'High Water Mark',
    trailingLimit: 'Limite Trailing',
    staticTip: 'Estático: O limite é fixo desde o saldo inicial. Mais fácil de gerenciar.',
    trailingTip: 'Trailing: O limite sobe com os lucros. Cuidado!',
    addTrade: 'Adicionar Trade (Modo Manual)',
    currentBalance: 'Saldo Atual',
    tradeHistory: 'Histórico de Trades',
    pnl: 'P&L',
    balance: 'Saldo',
    hwm: 'HWM',
    staticDD: 'DD Estático',
    trailingDD: 'DD Trailing',
  },
  ar: {
    title: 'محاكي السحب',
    subtitle: 'افهم كيف يعمل السحب الثابت مقابل المتحرك',
    accountSize: 'حجم الحساب',
    maxDrawdown: 'السحب الأقصى %',
    dailyDrawdown: 'السحب اليومي %',
    simulate: 'محاكاة',
    staticDrawdown: 'السحب الثابت',
    trailingDrawdown: 'السحب المتحرك',
    ddUsed: 'DD المستخدم',
    limit: 'الحد',
    remaining: 'المتبقي',
    highWaterMark: 'أعلى علامة مائية',
    trailingLimit: 'الحد المتحرك',
    staticTip: 'ثابت: الحد ثابت من الرصيد الأولي. أسهل في الإدارة.',
    trailingTip: 'متحرك: الحد يرتفع مع الأرباح. كن حذراً!',
    addTrade: 'إضافة صفقة (الوضع اليدوي)',
    currentBalance: 'الرصيد الحالي',
    tradeHistory: 'سجل الصفقات',
    pnl: 'الربح/الخسارة',
    balance: 'الرصيد',
    hwm: 'HWM',
    staticDD: 'DD ثابت',
    trailingDD: 'DD متحرك',
  },
  hi: {
    title: 'ड्रॉडाउन सिम्युलेटर',
    subtitle: 'समझें कि स्टैटिक vs ट्रेलिंग ड्रॉडाउन कैसे काम करता है',
    accountSize: 'अकाउंट साइज',
    maxDrawdown: 'मैक्स ड्रॉडाउन %',
    dailyDrawdown: 'दैनिक ड्रॉडाउन %',
    simulate: 'सिमुलेट',
    staticDrawdown: 'स्टैटिक ड्रॉडाउन',
    trailingDrawdown: 'ट्रेलिंग ड्रॉडाउन',
    ddUsed: 'DD उपयोग',
    limit: 'सीमा',
    remaining: 'शेष',
    highWaterMark: 'हाई वॉटर मार्क',
    trailingLimit: 'ट्रेलिंग सीमा',
    staticTip: 'स्टैटिक: सीमा प्रारंभिक बैलेंस से निश्चित है। प्रबंधित करना आसान।',
    trailingTip: 'ट्रेलिंग: सीमा मुनाफे के साथ बढ़ती है। सावधान रहें!',
    addTrade: 'ट्रेड जोड़ें (मैनुअल मोड)',
    currentBalance: 'वर्तमान बैलेंस',
    tradeHistory: 'ट्रेड इतिहास',
    pnl: 'P&L',
    balance: 'बैलेंस',
    hwm: 'HWM',
    staticDD: 'स्टैटिक DD',
    trailingDD: 'ट्रेलिंग DD',
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface Trade {
  id: number
  pnl: number
  balance: number
  highWater: number
  staticDD: number
  trailingDD: number
  staticRemaining: number
  trailingRemaining: number
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DrawdownSimulatorClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [accountSize, setAccountSize] = useState(100000)
  const [maxDrawdown, setMaxDrawdown] = useState(10)
  const [dailyDrawdown, setDailyDrawdown] = useState(5)
  
  const [trades, setTrades] = useState<Trade[]>([])
  const [currentBalance, setCurrentBalance] = useState(accountSize)
  const [highWaterMark, setHighWaterMark] = useState(accountSize)
  const [isRunning, setIsRunning] = useState(false)
  const [failed, setFailed] = useState<'static' | 'trailing' | null>(null)

  const staticLimit = accountSize * (1 - maxDrawdown / 100)
  const trailingLimit = highWaterMark * (1 - maxDrawdown / 100)

  const reset = () => {
    setTrades([])
    setCurrentBalance(accountSize)
    setHighWaterMark(accountSize)
    setFailed(null)
    setIsRunning(false)
  }

  const addTrade = (pnl: number) => {
    if (failed) return

    const newBalance = currentBalance + pnl
    const newHighWater = Math.max(highWaterMark, newBalance)
    
    const staticDD = ((accountSize - newBalance) / accountSize) * 100
    const trailingDD = ((newHighWater - newBalance) / newHighWater) * 100
    
    const staticRemaining = maxDrawdown - staticDD
    const trailingRemaining = maxDrawdown - trailingDD

    const newTrade: Trade = {
      id: trades.length + 1,
      pnl,
      balance: newBalance,
      highWater: newHighWater,
      staticDD: Math.max(0, staticDD),
      trailingDD: Math.max(0, trailingDD),
      staticRemaining: Math.max(0, staticRemaining),
      trailingRemaining: Math.max(0, trailingRemaining),
    }

    setTrades([...trades, newTrade])
    setCurrentBalance(newBalance)
    setHighWaterMark(newHighWater)

    if (staticRemaining <= 0) {
      setFailed('static')
    } else if (trailingRemaining <= 0) {
      setFailed('trailing')
    }
  }

  const quickTrades = [
    { label: '+$2,000', value: 2000, color: 'bg-emerald-500 hover:bg-emerald-600' },
    { label: '+$1,000', value: 1000, color: 'bg-emerald-500/80 hover:bg-emerald-600' },
    { label: '+$500', value: 500, color: 'bg-emerald-500/60 hover:bg-emerald-600' },
    { label: '-$500', value: -500, color: 'bg-red-500/60 hover:bg-red-600' },
    { label: '-$1,000', value: -1000, color: 'bg-red-500/80 hover:bg-red-600' },
    { label: '-$2,000', value: -2000, color: 'bg-red-500 hover:bg-red-600' },
  ]

  const runSimulation = () => {
    setIsRunning(true)
    reset()
    
    let balance = accountSize
    let hwm = accountSize
    const simTrades: Trade[] = []
    
    for (let i = 0; i < 20; i++) {
      const pnlPercent = (Math.random() * 7) - 3
      const pnl = Math.round(balance * (pnlPercent / 100))
      
      balance += pnl
      hwm = Math.max(hwm, balance)
      
      const staticDD = ((accountSize - balance) / accountSize) * 100
      const trailingDD = ((hwm - balance) / hwm) * 100
      
      simTrades.push({
        id: i + 1,
        pnl,
        balance,
        highWater: hwm,
        staticDD: Math.max(0, staticDD),
        trailingDD: Math.max(0, trailingDD),
        staticRemaining: Math.max(0, maxDrawdown - staticDD),
        trailingRemaining: Math.max(0, maxDrawdown - trailingDD),
      })

      if (staticDD >= maxDrawdown || trailingDD >= maxDrawdown) {
        break
      }
    }

    simTrades.forEach((trade, index) => {
      setTimeout(() => {
        setTrades(simTrades.slice(0, index + 1))
        setCurrentBalance(trade.balance)
        setHighWaterMark(trade.highWater)
        
        if (trade.staticRemaining <= 0) {
          setFailed('static')
        } else if (trade.trailingRemaining <= 0) {
          setFailed('trailing')
        }
        
        if (index === simTrades.length - 1) {
          setIsRunning(false)
        }
      }, (index + 1) * 300)
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>

        {/* Settings */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">{t.accountSize}</label>
              <select
                value={accountSize}
                onChange={(e) => { setAccountSize(Number(e.target.value)); reset(); }}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option value={50000}>$50,000</option>
                <option value={100000}>$100,000</option>
                <option value={200000}>$200,000</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">{t.maxDrawdown}</label>
              <select
                value={maxDrawdown}
                onChange={(e) => { setMaxDrawdown(Number(e.target.value)); reset(); }}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option value={8}>8%</option>
                <option value={10}>10%</option>
                <option value={12}>12%</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">{t.dailyDrawdown}</label>
              <select
                value={dailyDrawdown}
                onChange={(e) => setDailyDrawdown(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
              >
                <option value={4}>4%</option>
                <option value={5}>5%</option>
                <option value={6}>6%</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                {t.simulate}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Static DD */}
          <div className={`bg-gray-800/50 border rounded-xl p-6 ${failed === 'static' ? 'border-red-500' : 'border-gray-700'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{t.staticDrawdown}</h2>
              {failed === 'static' ? (
                <XCircle className="w-6 h-6 text-red-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{t.ddUsed}</span>
                <span className="text-white">{trades.length > 0 ? trades[trades.length - 1].staticDD.toFixed(2) : 0}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, trades.length > 0 ? (trades[trades.length - 1].staticDD / maxDrawdown) * 100 : 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>{maxDrawdown}% ({t.limit})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">{t.limit}</div>
                <div className="text-white font-semibold">${staticLimit.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">{t.remaining}</div>
                <div className="text-emerald-400 font-semibold">
                  {trades.length > 0 ? trades[trades.length - 1].staticRemaining.toFixed(2) : maxDrawdown}%
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg">
              <p className="text-emerald-400 text-sm">
                ✓ <strong>Static:</strong> {t.staticTip}
              </p>
            </div>
          </div>

          {/* Trailing DD */}
          <div className={`bg-gray-800/50 border rounded-xl p-6 ${failed === 'trailing' ? 'border-red-500' : 'border-gray-700'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{t.trailingDrawdown}</h2>
              {failed === 'trailing' ? (
                <XCircle className="w-6 h-6 text-red-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{t.ddUsed}</span>
                <span className="text-white">{trades.length > 0 ? trades[trades.length - 1].trailingDD.toFixed(2) : 0}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, trades.length > 0 ? (trades[trades.length - 1].trailingDD / maxDrawdown) * 100 : 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>{maxDrawdown}% ({t.limit})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">{t.highWaterMark}</div>
                <div className="text-white font-semibold">${highWaterMark.toLocaleString()}</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <div className="text-gray-400 text-xs">{t.trailingLimit}</div>
                <div className="text-yellow-400 font-semibold">${Math.round(trailingLimit).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ <strong>Trailing:</strong> {t.trailingTip}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Trade Buttons */}
        <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">{t.addTrade}</h3>
          <div className="flex flex-wrap gap-2">
            {quickTrades.map((trade) => (
              <button
                key={trade.label}
                onClick={() => addTrade(trade.value)}
                disabled={!!failed || isRunning}
                className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 ${trade.color}`}
              >
                {trade.label}
              </button>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-3">
            {t.currentBalance}: <span className="text-white font-semibold">${currentBalance.toLocaleString()}</span>
          </p>
        </div>

        {/* Trade History */}
        {trades.length > 0 && (
          <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">{t.tradeHistory}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-400">#</th>
                    <th className="text-right py-2 px-3 text-gray-400">{t.pnl}</th>
                    <th className="text-right py-2 px-3 text-gray-400">{t.balance}</th>
                    <th className="text-right py-2 px-3 text-gray-400">{t.hwm}</th>
                    <th className="text-right py-2 px-3 text-gray-400">{t.staticDD}</th>
                    <th className="text-right py-2 px-3 text-gray-400">{t.trailingDD}</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-gray-700/50">
                      <td className="py-2 px-3 text-gray-300">{trade.id}</td>
                      <td className={`py-2 px-3 text-right font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-white">${trade.balance.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-gray-300">${trade.highWater.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right text-emerald-400">{trade.staticDD.toFixed(2)}%</td>
                      <td className="py-2 px-3 text-right text-yellow-400">{trade.trailingDD.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
