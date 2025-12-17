'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  Bell, 
  Settings, 
  TrendingUp, 
  Target,
  ArrowRight,
  Star,
  ExternalLink,
  Plus
} from 'lucide-react'

// Temporary mock data - will be replaced with Supabase
const mockFavorites = [
  { id: '1', name: 'FTMO', logo: 'F', profit_split: 80, price: 155 },
  { id: '2', name: 'Funded Next', logo: 'FN', profit_split: 90, price: 32 },
]

const mockAlerts = [
  { id: '1', firm: 'FTMO', type: 'promo', message: 'New 20% discount available', date: '2024-01-15' },
  { id: '2', firm: 'E8 Funding', type: 'price', message: 'Price dropped by $20', date: '2024-01-14' },
]

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Will use Supabase auth

  if (!isLoggedIn) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Your Dashboard</h1>
            <p className="text-dark-400 mb-6">
              Sign in to save your favorite prop firms, set up alerts, and track your journey.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full px-6 py-3 text-center font-semibold text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-xl hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full px-6 py-3 text-center font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                Create Account
              </Link>
            </div>
            
            {/* Demo button for testing */}
            <button
              onClick={() => setIsLoggedIn(true)}
              className="mt-6 text-sm text-dark-500 hover:text-dark-300 transition-colors"
            >
              View Demo Dashboard →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-dark-400">Welcome back! Here's your prop firm tracker.</p>
          </div>
          <Link
            href="/compare"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-400 border border-brand-400/30 rounded-lg hover:bg-brand-400/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Prop Firm
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Favorites', value: mockFavorites.length, icon: Heart, color: 'text-red-400' },
            { label: 'Active Alerts', value: mockAlerts.length, icon: Bell, color: 'text-yellow-400' },
            { label: 'Comparisons', value: 12, icon: TrendingUp, color: 'text-brand-400' },
            { label: 'Saved', value: '$340', icon: Target, color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Favorites Section */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  My Favorites
                </h2>
                <Link href="/dashboard/favorites" className="text-sm text-brand-400 hover:underline">
                  View All
                </Link>
              </div>

              {mockFavorites.length > 0 ? (
                <div className="space-y-4">
                  {mockFavorites.map((firm) => (
                    <div key={firm.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <span className="font-bold text-white">{firm.logo}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{firm.name}</h3>
                          <p className="text-sm text-dark-400">From ${firm.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-dark-400">Profit Split</p>
                          <p className="font-semibold text-brand-400">{firm.profit_split}%</p>
                        </div>
                        <a
                          href="#"
                          className="p-2 text-dark-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-400 mb-4">No favorites yet</p>
                  <Link
                    href="/compare"
                    className="inline-flex items-center gap-2 text-sm text-brand-400 hover:underline"
                  >
                    Browse Prop Firms
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Alerts Section */}
          <div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Recent Alerts
                </h2>
                <Link href="/dashboard/alerts" className="text-sm text-brand-400 hover:underline">
                  Manage
                </Link>
              </div>

              {mockAlerts.length > 0 ? (
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{alert.firm}</p>
                          <p className="text-xs text-dark-400 mt-1">{alert.message}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          alert.type === 'promo' ? 'bg-brand-500/20 text-brand-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-xs text-dark-500 mt-2">{alert.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-400 text-sm">No alerts yet</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 mt-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/compare"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm text-dark-300">Compare Firms</span>
                  <ArrowRight className="w-4 h-4 text-dark-500" />
                </Link>
                <Link
                  href="/deals"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm text-dark-300">View Deals</span>
                  <ArrowRight className="w-4 h-4 text-dark-500" />
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm text-dark-300">Settings</span>
                  <Settings className="w-4 h-4 text-dark-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
