'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { 
  Target, LogOut, Search, Bell, Star, TrendingUp, 
  ArrowRight, Zap, Shield, Copy, BarChart3 
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader'

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-dark-400">
              Track your prop firm journey and find the best deals.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-dark-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/compare"
            className="p-6 bg-gradient-to-br from-brand-500/20 to-emerald-500/20 border border-brand-500/30 rounded-xl hover:border-brand-400 transition-colors group"
          >
            <Search className="w-8 h-8 text-brand-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Compare Firms</h3>
            <p className="text-dark-400 text-sm">Find the perfect prop firm for your style</p>
            <div className="flex items-center gap-1 text-brand-400 mt-3 group-hover:gap-2 transition-all">
              <span className="text-sm">Browse 50+ firms</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link 
            href="/deals"
            className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-brand-400 transition-colors group"
          >
            <Zap className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Deals & Promos</h3>
            <p className="text-dark-400 text-sm">Exclusive discounts and promo codes</p>
            <div className="flex items-center gap-1 text-brand-400 mt-3 group-hover:gap-2 transition-all">
              <span className="text-sm">View deals</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl opacity-75">
            <Star className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">Saved Firms</h3>
            <p className="text-dark-400 text-sm">Your favorite prop firms</p>
            <div className="flex items-center gap-1 text-dark-500 mt-3">
              <span className="text-sm">Coming soon</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-brand-400">50+</p>
            <p className="text-dark-400 text-sm">Prop Firms</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-emerald-400">$32</p>
            <p className="text-dark-400 text-sm">Lowest Price</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-purple-400">100%</p>
            <p className="text-dark-400 text-sm">Max Profit Split</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
            <p className="text-3xl font-bold text-yellow-400">15+</p>
            <p className="text-dark-400 text-sm">Active Deals</p>
          </div>
        </div>

        {/* Coming Soon - Trade Copier */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-brand-500/20 text-brand-400 text-xs font-semibold rounded-full">
              🚀 COMING Q1 2025
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Trade Copier & Multi-Account Manager
          </h2>
          <p className="text-dark-400 mb-6 max-w-2xl">
            Centralize all your prop firm accounts. Copy trades automatically. 
            Manage risk intelligently. <strong className="text-white">Without violating any rules.</strong>
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <Copy className="w-6 h-6 text-brand-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Trade Copier</h4>
                <p className="text-sm text-dark-400">Copy trades across all accounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Unified Dashboard</h4>
                <p className="text-sm text-dark-400">All stats in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-white">Smart Hedging</h4>
                <p className="text-sm text-dark-400">Legal hedging strategies</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-dark-400">Get notified when it launches:</span>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                defaultValue={user?.email || ''}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-brand-500"
              />
              <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-dark-500 text-sm">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-dark-500 text-sm">Member Since</p>
              <p className="text-white">
                {new Date(user?.created_at || '').toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric', 
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
