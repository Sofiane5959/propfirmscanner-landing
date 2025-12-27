'use client'

import { 
  Check, X, AlertTriangle, Newspaper, Calendar, 
  Bot, TrendingDown, Clock, Percent, CreditCard,
  Globe, Zap, Moon
} from 'lucide-react'

// =====================================================
// RULE BADGE COMPONENT
// =====================================================

interface RuleBadgeProps {
  allowed: boolean | null | undefined
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function RuleBadge({ allowed, label, showLabel = true, size = 'md' }: RuleBadgeProps) {
  if (allowed === null || allowed === undefined) {
    return (
      <span className={`inline-flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <span className="w-4 h-4 rounded-full bg-gray-500/20 flex items-center justify-center">
          <AlertTriangle className="w-2.5 h-2.5 text-gray-400" />
        </span>
        {showLabel && <span className="text-gray-400">{label || 'N/A'}</span>}
      </span>
    )
  }

  if (allowed) {
    return (
      <span className={`inline-flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-emerald-400" />
        </span>
        {showLabel && <span className="text-emerald-400">{label || 'Yes'}</span>}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
      <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
        <X className="w-2.5 h-2.5 text-red-400" />
      </span>
      {showLabel && <span className="text-red-400">{label || 'No'}</span>}
    </span>
  )
}

// =====================================================
// SPECIFIC RULE BADGES
// =====================================================

interface SpecificRuleBadgeProps {
  allowed: boolean | null | undefined
  compact?: boolean
}

export function NewsTrading({ allowed, compact = false }: SpecificRuleBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'px-3 py-1.5 bg-gray-800/50 rounded-lg'}`}>
      <Newspaper className="w-4 h-4 text-gray-400" />
      {!compact && <span className="text-gray-300 text-sm">News</span>}
      <RuleBadge allowed={allowed} showLabel={false} size="sm" />
    </div>
  )
}

export function WeekendHolding({ allowed, compact = false }: SpecificRuleBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'px-3 py-1.5 bg-gray-800/50 rounded-lg'}`}>
      <Calendar className="w-4 h-4 text-gray-400" />
      {!compact && <span className="text-gray-300 text-sm">Weekend</span>}
      <RuleBadge allowed={allowed} showLabel={false} size="sm" />
    </div>
  )
}

export function EATrading({ allowed, compact = false }: SpecificRuleBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'px-3 py-1.5 bg-gray-800/50 rounded-lg'}`}>
      <Bot className="w-4 h-4 text-gray-400" />
      {!compact && <span className="text-gray-300 text-sm">EA/Bots</span>}
      <RuleBadge allowed={allowed} showLabel={false} size="sm" />
    </div>
  )
}

// =====================================================
// DRAWDOWN TYPE BADGE
// =====================================================

interface DrawdownBadgeProps {
  type: 'static' | 'trailing' | 'eod' | null | undefined
  compact?: boolean
}

export function DrawdownBadge({ type, compact = false }: DrawdownBadgeProps) {
  const config = {
    static: {
      label: 'Static',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      tooltip: 'Fixed from starting balance - easier to manage',
    },
    trailing: {
      label: 'Trailing',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      tooltip: 'Moves with your highest equity - be careful!',
    },
    eod: {
      label: 'EOD Trailing',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      tooltip: 'Trailing but calculated end-of-day only',
    },
  }

  if (!type) {
    return (
      <span className="text-gray-400 text-sm">N/A</span>
    )
  }

  const { label, color, tooltip } = config[type]

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : ''}`}>
      <TrendingDown className="w-4 h-4 text-gray-400" />
      <span 
        className={`px-2 py-0.5 rounded text-xs font-medium border ${color}`}
        title={tooltip}
      >
        {label}
      </span>
    </div>
  )
}

// =====================================================
// PLATFORM BADGES
// =====================================================

interface PlatformBadgesProps {
  platforms: string[]
  compact?: boolean
}

export function PlatformBadges({ platforms, compact = false }: PlatformBadgesProps) {
  if (!platforms || platforms.length === 0) {
    return <span className="text-gray-400 text-sm">N/A</span>
  }

  const platformColors: Record<string, string> = {
    'MT4': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'MT5': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'cTrader': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'DXTrade': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'TradeLocker': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'MatchTrader': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  }

  return (
    <div className={`flex flex-wrap gap-1 ${compact ? '' : ''}`}>
      {platforms.map((platform) => (
        <span
          key={platform}
          className={`px-2 py-0.5 rounded text-xs font-medium border ${platformColors[platform] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}
        >
          {platform}
        </span>
      ))}
    </div>
  )
}

// =====================================================
// MARKET BADGES
// =====================================================

interface MarketBadgesProps {
  markets: string[]
  compact?: boolean
}

export function MarketBadges({ markets, compact = false }: MarketBadgesProps) {
  if (!markets || markets.length === 0) {
    return <span className="text-gray-400 text-sm">N/A</span>
  }

  const marketConfig: Record<string, { icon: typeof Globe; color: string }> = {
    'Forex': { icon: Globe, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'Crypto': { icon: Zap, color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    'Futures': { icon: TrendingDown, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    'Indices': { icon: TrendingDown, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'Stocks': { icon: TrendingDown, color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  }

  return (
    <div className={`flex flex-wrap gap-1 ${compact ? '' : ''}`}>
      {markets.map((market) => {
        const config = marketConfig[market] || { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
        return (
          <span
            key={market}
            className={`px-2 py-0.5 rounded text-xs font-medium border ${config.color}`}
          >
            {market}
          </span>
        )
      })}
    </div>
  )
}

// =====================================================
// PAYOUT BADGE
// =====================================================

interface PayoutBadgeProps {
  frequency: string | null | undefined
  compact?: boolean
}

export function PayoutBadge({ frequency, compact = false }: PayoutBadgeProps) {
  if (!frequency) {
    return <span className="text-gray-400 text-sm">N/A</span>
  }

  const freqLower = frequency.toLowerCase()
  let color = 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  
  if (freqLower.includes('daily') || freqLower.includes('demand')) {
    color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  } else if (freqLower.includes('weekly') || freqLower.includes('7')) {
    color = 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  } else if (freqLower.includes('bi-weekly') || freqLower.includes('14')) {
    color = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  }

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : ''}`}>
      <CreditCard className="w-4 h-4 text-gray-400" />
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
        {frequency}
      </span>
    </div>
  )
}

// =====================================================
// QUICK RULES SUMMARY
// =====================================================

interface QuickRulesProps {
  newsTrading?: boolean | null
  weekendHolding?: boolean | null
  eaTrading?: boolean | null
  className?: string
}

export function QuickRules({ newsTrading, weekendHolding, eaTrading, className = '' }: QuickRulesProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <NewsTrading allowed={newsTrading} compact />
      <WeekendHolding allowed={weekendHolding} compact />
      <EATrading allowed={eaTrading} compact />
    </div>
  )
}

// =====================================================
// PROFIT SPLIT BADGE
// =====================================================

interface ProfitSplitBadgeProps {
  split: number | null | undefined
  maxSplit?: number | null
}

export function ProfitSplitBadge({ split, maxSplit }: ProfitSplitBadgeProps) {
  if (!split) {
    return <span className="text-gray-400">N/A</span>
  }

  let color = 'text-gray-400'
  if (split >= 90) color = 'text-emerald-400'
  else if (split >= 80) color = 'text-green-400'
  else if (split >= 70) color = 'text-yellow-400'
  else color = 'text-orange-400'

  return (
    <div className="flex items-center gap-1">
      <Percent className="w-4 h-4 text-gray-400" />
      <span className={`font-semibold ${color}`}>
        {split}%
        {maxSplit && maxSplit > split && (
          <span className="text-gray-500 font-normal"> - {maxSplit}%</span>
        )}
      </span>
    </div>
  )
}

// =====================================================
// TIME LIMIT BADGE
// =====================================================

interface TimeLimitBadgeProps {
  days: number | null | undefined | 'unlimited'
}

export function TimeLimitBadge({ days }: TimeLimitBadgeProps) {
  if (!days || days === 'unlimited') {
    return (
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-emerald-400 font-medium">Unlimited</span>
      </div>
    )
  }

  let color = 'text-gray-400'
  if (days >= 60) color = 'text-emerald-400'
  else if (days >= 30) color = 'text-green-400'
  else if (days >= 14) color = 'text-yellow-400'
  else color = 'text-orange-400'

  return (
    <div className="flex items-center gap-1">
      <Clock className="w-4 h-4 text-gray-400" />
      <span className={color}>{days} days</span>
    </div>
  )
}
