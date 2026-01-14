'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  Heart, 
  BarChart3,
  DollarSign,
  Target,
  Clock
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface DashboardStats {
  totalAlerts: number
  activeAlerts: number
  triggeredAlerts: number
  totalFavorites: number
  avgTargetDiscount: number
  potentialSavings: number
}

interface PriceAlert {
  id: string
  target_price: number
  current_price_at_creation: number
  is_active: boolean
  is_triggered: boolean
  created_at: string
  prop_firms: {
    name: string
    min_price: number
  }
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setIsLoading(false)
        return
      }

      // Fetch alerts
      const { data: alertsData } = await supabase
        .from('price_alerts')
        .select(`
          id,
          target_price,
          current_price_at_creation,
          is_active,
          is_triggered,
          created_at,
          prop_firms (
            name,
            min_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const alertsList = (alertsData || []) as unknown as PriceAlert[]
      setAlerts(alertsList)

      // Calculate stats
      const activeAlerts = alertsList.filter(a => a.is_active).length
      const triggeredAlerts = alertsList.filter(a => a.is_triggered).length
      
      const totalDiscount = alertsList.reduce((sum, alert) => {
        const discount = ((alert.current_price_at_creation - alert.target_price) / alert.current_price_at_creation) * 100
        return sum + discount
      }, 0)
      
      const avgTargetDiscount = alertsList.length > 0 ? totalDiscount / alertsList.length : 0

      const potentialSavings = alertsList
        .filter(a => a.is_active)
        .reduce((sum, alert) => {
          const currentPrice = alert.prop_firms?.min_price || alert.current_price_at_creation
          return sum + (alert.current_price_at_creation - Math.min(currentPrice, alert.target_price))
        }, 0)

      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('pfs_favorites') || '[]')

      setStats({
        totalAlerts: alertsList.length,
        activeAlerts,
        triggeredAlerts,
        totalFavorites: favorites.length,
        avgTargetDiscount: Math.round(avgTargetDiscount),
        potentialSavings: Math.round(potentialSavings),
      })

      setIsLoading(false)
    }

    fetchData()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-20 mb-3" />
            <div className="h-8 bg-gray-700 rounded w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 text-center">
        <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Data Yet</h3>
        <p className="text-gray-400">Create price alerts and add favorites to see your stats.</p>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Active Alerts',
      value: stats.activeAlerts,
      icon: Bell,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: 'Triggered',
      value: stats.triggeredAlerts,
      icon: Target,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Favorites',
      value: stats.totalFavorites,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Potential Savings',
      value: `$${stats.potentialSavings}`,
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div 
            key={i} 
            className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Recent Price Alerts
            </h3>
          </div>
          <div className="divide-y divide-gray-700/50">
            {alerts.slice(0, 5).map((alert) => {
              const currentPrice = alert.prop_firms?.min_price || alert.current_price_at_creation
              const isBelow = currentPrice <= alert.target_price
              const priceDiff = alert.target_price - currentPrice
              
              return (
                <div key={alert.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{alert.prop_firms?.name || 'Unknown Firm'}</p>
                    <p className="text-sm text-gray-400">
                      Target: ${alert.target_price} • Current: ${currentPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    {alert.is_triggered ? (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                        Triggered ✓
                      </span>
                    ) : alert.is_active ? (
                      <div className="flex items-center gap-1">
                        {isBelow ? (
                          <TrendingDown className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${isBelow ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {isBelow ? 'Ready!' : `$${Math.abs(priceDiff)} to go`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">Inactive</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {alerts.length > 5 && (
            <div className="px-6 py-3 bg-gray-900/50 text-center">
              <span className="text-sm text-gray-500">
                +{alerts.length - 5} more alerts
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tip */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-white mb-1">Pro Tip</p>
            <p className="text-sm text-gray-400">
              Set price alerts on your favorite firms to get notified when they offer discounts. 
              Average savings: 15-25% during promotional periods!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
