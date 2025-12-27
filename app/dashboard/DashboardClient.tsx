'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, Star, Bell, Bookmark, TrendingUp,
  ArrowRight, Lock, CheckCircle, Zap, BarChart3,
  Clock, Target, Shield
} from 'lucide-react'

const UPCOMING_FEATURES = [
  {
    icon: Bookmark,
    title: 'Watchlist',
    description: 'Save and track your favorite prop firms',
    status: 'coming-soon',
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Get notified when challenge prices drop',
    status: 'coming-soon',
  },
  {
    icon: BarChart3,
    title: 'Compare History',
    description: 'View your recent comparisons',
    status: 'coming-soon',
  },
  {
    icon: Target,
    title: 'Challenge Tracker',
    description: 'Track multiple active challenges',
    status: 'coming-soon',
  },
  {
    icon: TrendingUp,
    title: 'Performance Stats',
    description: 'Analyze your trading progress',
    status: 'coming-soon',
  },
  {
    icon: Shield,
    title: 'Personalized Recommendations',
    description: 'Get firm suggestions based on your style',
    status: 'coming-soon',
  },
]

const QUICK_ACTIONS = [
  {
    icon: Star,
    title: 'Compare Prop Firms',
    description: 'Find your perfect match from 90+ firms',
    href: '/compare',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'View Deals',
    description: 'Save up to 25% with exclusive codes',
    href: '/deals',
    color: 'yellow',
  },
  {
    icon: Target,
    title: 'Rule Tracker',
    description: 'Track your challenge progress',
    href: '/tools/rule-tracker',
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Risk Calculator',
    description: 'Calculate position sizes safely',
    href: '/tools/risk-calculator',
    color: 'purple',
  },
]

export default function DashboardPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Here you would typically send to your API
    // For now, just show success
    setSubscribed(true)
    localStorage.setItem('dashboard_notify', email)
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Your Dashboard</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We&apos;re building powerful tools to help you track and manage your prop trading journey.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Dashboard Coming Soon!</h2>
                <p className="text-gray-400">Get notified when we launch new features</p>
              </div>
            </div>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span>You&apos;ll be notified!</span>
              </div>
            ) : (
              <form onSubmit={handleNotifyMe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_ACTIONS.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-${action.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className={`w-6 h-6 text-${action.color}-400`} />
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center gap-1 text-emerald-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Go to tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPCOMING_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 opacity-75"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-gray-300 font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What You Can Do Now */}
        <section>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What You Can Do Right Now
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-400">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Compare Firms</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Browse 90+ prop firms and find the best match for your trading style.
                </p>
                <Link
                  href="/compare"
                  className="text-emerald-400 hover:underline text-sm inline-flex items-center gap-1"
                >
                  Start Comparing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-400">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Track Your Challenge</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Use our Rule Tracker to monitor your progress and stay within limits.
                </p>
                <Link
                  href="/tools/rule-tracker"
                  className="text-emerald-400 hover:underline text-sm inline-flex items-center gap-1"
                >
                  Open Rule Tracker
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-400">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Get Discounts</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Save money with exclusive discount codes on your next challenge.
                </p>
                <Link
                  href="/deals"
                  className="text-emerald-400 hover:underline text-sm inline-flex items-center gap-1"
                >
                  View Deals
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
