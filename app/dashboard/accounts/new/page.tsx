'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, ChevronDown } from 'lucide-react'

// Prop firm data with programs
const propFirms = [
  {
    slug: 'ftmo',
    name: 'FTMO',
    programs: [
      { name: 'Standard $10K', size: 10000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: false, weekend: true },
      { name: 'Standard $25K', size: 25000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: false, weekend: true },
      { name: 'Standard $50K', size: 50000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: false, weekend: true },
      { name: 'Standard $100K', size: 100000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: false, weekend: true },
      { name: 'Standard $200K', size: 200000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: false, weekend: true },
    ],
  },
  {
    slug: 'fundednext',
    name: 'FundedNext',
    programs: [
      { name: 'Stellar 2-Step $6K', size: 6000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 2-Step $15K', size: 15000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 2-Step $25K', size: 25000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 2-Step $50K', size: 50000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 2-Step $100K', size: 100000, daily_dd: 5, max_dd: 10, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 1-Step $25K', size: 25000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 1-Step $50K', size: 50000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
      { name: 'Stellar 1-Step $100K', size: 100000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
    ],
  },
  {
    slug: 'the5ers',
    name: 'The5ers',
    programs: [
      { name: 'High Stakes $6K', size: 6000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
      { name: 'High Stakes $20K', size: 20000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
      { name: 'High Stakes $60K', size: 60000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
      { name: 'High Stakes $100K', size: 100000, daily_dd: 3, max_dd: 6, max_dd_type: 'static', news: true, weekend: true },
    ],
  },
  {
    slug: 'my-funded-futures',
    name: 'My Funded Futures',
    programs: [
      { name: 'Starter $50K', size: 50000, daily_dd: 0, max_dd: 4, max_dd_type: 'eod_trailing', news: true, weekend: false },
      { name: 'Starter $100K', size: 100000, daily_dd: 0, max_dd: 4.5, max_dd_type: 'eod_trailing', news: true, weekend: false },
      { name: 'Starter $150K', size: 150000, daily_dd: 0, max_dd: 4.5, max_dd_type: 'eod_trailing', news: true, weekend: false },
    ],
  },
  {
    slug: 'topstep',
    name: 'Topstep',
    programs: [
      { name: 'Trading Combine $50K', size: 50000, daily_dd: 0, max_dd: 3, max_dd_type: 'eod_trailing', news: true, weekend: false },
      { name: 'Trading Combine $100K', size: 100000, daily_dd: 0, max_dd: 4, max_dd_type: 'eod_trailing', news: true, weekend: false },
      { name: 'Trading Combine $150K', size: 150000, daily_dd: 0, max_dd: 4.5, max_dd_type: 'eod_trailing', news: true, weekend: false },
    ],
  },
  {
    slug: 'apex-trader-funding',
    name: 'Apex Trader Funding',
    programs: [
      { name: 'Evaluation $25K', size: 25000, daily_dd: 0, max_dd: 3, max_dd_type: 'trailing', news: true, weekend: false },
      { name: 'Evaluation $50K', size: 50000, daily_dd: 0, max_dd: 5, max_dd_type: 'trailing', news: true, weekend: false },
      { name: 'Evaluation $100K', size: 100000, daily_dd: 0, max_dd: 6, max_dd_type: 'trailing', news: true, weekend: false },
      { name: 'Evaluation $150K', size: 150000, daily_dd: 0, max_dd: 9, max_dd_type: 'trailing', news: true, weekend: false },
      { name: 'Evaluation $250K', size: 250000, daily_dd: 0, max_dd: 12.5, max_dd_type: 'trailing', news: true, weekend: false },
    ],
  },
  {
    slug: 'e8-markets',
    name: 'E8 Markets',
    programs: [
      { name: 'E8 Track $25K', size: 25000, daily_dd: 4, max_dd: 8, max_dd_type: 'static', news: false, weekend: true },
      { name: 'E8 Track $50K', size: 50000, daily_dd: 4, max_dd: 8, max_dd_type: 'static', news: false, weekend: true },
      { name: 'E8 Track $100K', size: 100000, daily_dd: 4, max_dd: 8, max_dd_type: 'static', news: false, weekend: true },
      { name: 'E8 Track $250K', size: 250000, daily_dd: 4, max_dd: 8, max_dd_type: 'static', news: false, weekend: true },
    ],
  },
]

export default function AddAccountPage() {
  const router = useRouter()
  
  // Form state
  const [firmSlug, setFirmSlug] = useState('')
  const [programName, setProgramName] = useState('')
  const [stage, setStage] = useState('eval_1')
  const [startBalance, setStartBalance] = useState('')
  const [currentBalance, setCurrentBalance] = useState('')
  const [todayPnl, setTodayPnl] = useState('0')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  
  const firm = propFirms.find(f => f.slug === firmSlug)
  const program = firm?.programs.find(p => p.name === programName)
  
  // Auto-fill start balance when program selected
  useEffect(() => {
    if (program) {
      setStartBalance(program.size.toString())
      setCurrentBalance(program.size.toString())
    }
  }, [program])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!firm || !program) return
    
    // In production, save to Supabase
    const account = {
      prop_firm: firm.name,
      prop_firm_slug: firm.slug,
      program: program.name,
      account_size: program.size,
      start_balance: parseFloat(startBalance),
      current_balance: parseFloat(currentBalance),
      stage,
      today_pnl: parseFloat(todayPnl) || 0,
      daily_dd_percent: program.daily_dd,
      max_dd_percent: program.max_dd,
      max_dd_type: program.max_dd_type,
      allows_news: program.news,
      allows_weekend: program.weekend,
      start_date: startDate,
    }
    
    console.log('Saving account:', account)
    
    // Redirect to dashboard
    router.push('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-lg font-bold text-white">Add Account</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Prop Firm */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Prop Firm
            </label>
            <div className="relative">
              <select
                value={firmSlug}
                onChange={(e) => { setFirmSlug(e.target.value); setProgramName('') }}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select prop firm...</option>
                {propFirms.map(f => (
                  <option key={f.slug} value={f.slug}>{f.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Program */}
          {firm && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Program
              </label>
              <div className="relative">
                <select
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select program...</option>
                  {firm.programs.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          )}
          
          {/* Program Rules Preview */}
          {program && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500">Account Size</span>
                  <p className="text-white font-medium">${program.size.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Daily DD</span>
                  <p className="text-white font-medium">{program.daily_dd > 0 ? `${program.daily_dd}%` : 'None'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Max DD</span>
                  <p className="text-white font-medium">{program.max_dd}% ({program.max_dd_type})</p>
                </div>
                <div>
                  <span className="text-gray-500">Rules</span>
                  <p className="text-white font-medium">
                    {program.news ? '✓' : '✗'} News • {program.weekend ? '✓' : '✗'} Weekend
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Stage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'eval_1', label: 'Phase 1' },
                { value: 'eval_2', label: 'Phase 2' },
                { value: 'verification', label: 'Verify' },
                { value: 'funded', label: 'Funded' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStage(opt.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    stage === opt.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Start Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Start Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={startBalance}
                onChange={(e) => setStartBalance(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          {/* Current Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          {/* Today PnL */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Today&apos;s P&amp;L
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={todayPnl}
                onChange={(e) => setTodayPnl(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Enter negative for losses (e.g., -500)</p>
          </div>
          
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          {/* Submit */}
          <button
            type="submit"
            disabled={!firm || !program}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        </form>
      </main>
    </div>
  )
}
