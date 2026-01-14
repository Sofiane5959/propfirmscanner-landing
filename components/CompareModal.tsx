'use client'

import { useState, useEffect } from 'react'
import { X, Check, Star, ExternalLink, Bell, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  payout_frequency: string
  discount_code: string
  discount_percent: number
  trust_status: string
}

interface CompareModalProps {
  firms: PropFirm[]
  onClose: () => void
  onRemove: (id: string) => void
  onPriceAlert?: (firm: PropFirm) => void
}

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
        <Check className="w-4 h-4 text-emerald-400" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 bg-red-500/10 rounded-full flex items-center justify-center">
        <X className="w-4 h-4 text-red-400/60" />
      </div>
    </div>
  )
}

function getBestValue(firms: PropFirm[], key: keyof PropFirm, type: 'min' | 'max'): string {
  const values = firms.map(f => f[key] as number).filter(v => v != null && !isNaN(v))
  if (values.length === 0) return ''
  const best = type === 'min' ? Math.min(...values) : Math.max(...values)
  const bestFirm = firms.find(f => f[key] === best)
  return bestFirm?.id || ''
}

export default function CompareModal({ firms, onClose, onRemove, onPriceAlert }: CompareModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    document.body.style.overflow = 'hidden'
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEscape)
    
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  const bestRating = getBestValue(firms, 'trustpilot_rating', 'max')
  const bestPrice = getBestValue(firms, 'min_price', 'min')
  const bestSplit = getBestValue(firms, 'profit_split', 'max')
  const bestDailyDD = getBestValue(firms, 'max_daily_drawdown', 'max')
  const bestTotalDD = getBestValue(firms, 'max_total_drawdown', 'max')

  const comparisonSections = [
    {
      title: 'Key Metrics',
      rows: [
        { 
          label: 'Trustpilot Rating', 
          render: (f: PropFirm) => (
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className={f.id === bestRating ? 'text-emerald-400 font-bold' : ''}>
                {f.trustpilot_rating?.toFixed(1) || 'N/A'}
              </span>
            </div>
          )
        },
        { 
          label: 'Starting Price', 
          render: (f: PropFirm) => (
            <span className={f.id === bestPrice ? 'text-emerald-400 font-bold' : ''}>
              ${f.min_price || 'N/A'}
              {f.discount_percent > 0 && (
                <span className="ml-1 text-xs text-orange-400">(-{f.discount_percent}%)</span>
              )}
            </span>
          )
        },
        { 
          label: 'Profit Split', 
          render: (f: PropFirm) => (
            <span className={f.id === bestSplit ? 'text-emerald-400 font-bold' : ''}>
              {f.profit_split}
              {f.max_profit_split && f.max_profit_split > f.profit_split && `-${f.max_profit_split}`}%
            </span>
          )
        },
        { 
          label: 'Payout Frequency', 
          render: (f: PropFirm) => <span className="capitalize">{f.payout_frequency || 'N/A'}</span>
        },
      ]
    },
    {
      title: 'Risk Limits',
      rows: [
        { 
          label: 'Daily Drawdown', 
          render: (f: PropFirm) => (
            <span className={f.id === bestDailyDD ? 'text-emerald-400 font-bold' : ''}>
              {f.max_daily_drawdown}%
            </span>
          )
        },
        { 
          label: 'Total Drawdown', 
          render: (f: PropFirm) => (
            <span className={f.id === bestTotalDD ? 'text-emerald-400 font-bold' : ''}>
              {f.max_total_drawdown}%
            </span>
          )
        },
        { 
          label: 'Phase 1 Target', 
          render: (f: PropFirm) => <span>{f.profit_target_phase1 || 'N/A'}%</span>
        },
        { 
          label: 'Phase 2 Target', 
          render: (f: PropFirm) => <span>{f.profit_target_phase2 || 'N/A'}%</span>
        },
        { 
          label: 'Min Trading Days', 
          render: (f: PropFirm) => <span>{f.min_trading_days || 'None'}</span>
        },
      ]
    },
    {
      title: 'Trading Rules',
      rows: [
        { label: 'Scalping Allowed', render: (f: PropFirm) => <BooleanCell value={f.allows_scalping} /> },
        { label: 'News Trading', render: (f: PropFirm) => <BooleanCell value={f.allows_news_trading} /> },
        { label: 'EAs / Bots', render: (f: PropFirm) => <BooleanCell value={f.allows_ea} /> },
        { label: 'Weekend Holding', render: (f: PropFirm) => <BooleanCell value={f.allows_weekend_holding} /> },
        { label: 'Instant Funding', render: (f: PropFirm) => <BooleanCell value={f.has_instant_funding} /> },
      ]
    },
  ]

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <div 
        className={`relative bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden transition-transform duration-200 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Compare Prop Firms</h2>
            <p className="text-sm text-gray-400 mt-1">
              Comparing {firms.length} firm{firms.length > 1 ? 's' : ''} • 
              <span className="text-emerald-400"> Best values highlighted</span>
            </p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="overflow-auto max-h-[calc(90vh-88px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-900/95 backdrop-blur z-10">
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left text-gray-500 font-medium text-sm w-44"></th>
                {firms.map(firm => (
                  <th key={firm.id} className="p-4 text-center min-w-[180px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden p-2 border-2 border-gray-700 group-hover:border-gray-600 transition-colors">
                          {firm.logo_url ? (
                            <Image src={firm.logo_url} alt={firm.name} width={56} height={56} className="object-contain" />
                          ) : (
                            <span className="text-2xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemove(firm.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <span className="font-semibold text-white">{firm.name}</span>
                          {firm.trust_status === 'verified' && <Shield className="w-4 h-4 text-emerald-400" />}
                        </div>
                        {firm.discount_percent > 0 && (
                          <span className="inline-block px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                            {firm.discount_percent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {comparisonSections.map((section, sIdx) => (
                <>
                  <tr key={`section-${sIdx}`} className="bg-gray-800/30">
                    <td colSpan={firms.length + 1} className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </td>
                  </tr>
                  
                  {section.rows.map((row, rIdx) => (
                    <tr key={`${sIdx}-${rIdx}`} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4 text-sm text-gray-400">{row.label}</td>
                      {firms.map(firm => (
                        <td key={firm.id} className="p-4 text-center text-white">{row.render(firm)}</td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}

              <tr className="bg-gray-800/20">
                <td className="p-4"></td>
                {firms.map(firm => (
                  <td key={firm.id} className="p-4">
                    <div className="flex flex-col gap-2">
                      {onPriceAlert && (
                        <button
                          onClick={() => onPriceAlert(firm)}
                          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Bell className="w-4 h-4" />
                          Price Alert
                        </button>
                      )}
                      
                      <Link
                        href={`/prop-firm/${firm.slug}`}
                        className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors text-center"
                      >
                        View Details
                      </Link>
                      
                      <a
                        href={firm.affiliate_url || firm.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        Visit Site
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
