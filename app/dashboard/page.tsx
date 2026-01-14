'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  BarChart3,
  Tag,
  Star,
  Settings,
  Shield,
  User,
  Calendar,
  TrendingUp,
  Loader2,
  ChevronRight,
  ExternalLink,
  Crown,
  Sparkles,
} from 'lucide-react'

interface DashboardStats {
  favorites: number
  comparisons: number
}

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [stats, setStats] = useState<DashboardStats>({ favorites: 0, comparisons: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      
      try {
        // Get favorites count
        const { count: favCount } = await supabase
          .from('user_favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        
        setStats({
          favorites: favCount || 0,
          comparisons: 0, // Could track this in future
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user, supabase])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Welcome back, {displayName}!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile & Stats */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-4 mb-6">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-16 h-16 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-emerald-400" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white text-lg">{displayName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since
                  </span>
                  <span className="text-gray-300">{memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Plan
                  </span>
                  <span className="text-emerald-400">Free</span>
                </div>
              </div>

              <Link
                href="/dashboard/settings"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            {/* Stats Card */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Your Activity
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {loadingStats ? '—' : stats.favorites}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Favorites</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-gray-500 mt-1">Comparisons</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/compare"
                className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">Compare Firms</h3>
                <p className="text-sm text-gray-400">Find your perfect prop firm match</p>
              </Link>

              <Link
                href="/deals"
                className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 hover:border-yellow-500/40 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Tag className="w-6 h-6 text-yellow-400" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">Deals & Promos</h3>
                <p className="text-sm text-gray-400">Save with exclusive discount codes</p>
              </Link>

              <Link
                href="/dashboard/favorites"
                className="group bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-800 rounded-xl">
                    <Star className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">My Favorites</h3>
                <p className="text-sm text-gray-400">
                  {loadingStats ? 'Loading...' : `${stats.favorites} saved prop firms`}
                </p>
              </Link>

              <Link
                href="/dashboard/settings"
                className="group bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-800 rounded-xl">
                    <Settings className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">Settings</h3>
                <p className="text-sm text-gray-400">Manage your account</p>
              </Link>
            </div>

            {/* Pro Upgrade Banner */}
            <div className="bg-gradient-to-r from-purple-500/10 via-emerald-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Get advanced tracking, alerts, and portfolio management tools.
                  </p>
                  <Link
                    href="/mypropfirm"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <div className="space-y-3">
                <Link
                  href="/guide"
                  className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <span className="text-gray-300">Free Prop Firm Guide</span>
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">FREE</span>
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <span className="text-gray-300">Blog & Tutorials</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
