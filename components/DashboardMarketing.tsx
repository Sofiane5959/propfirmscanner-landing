'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, Target, Bell, Brain, Check, ArrowRight, 
  ChevronRight, Zap, TrendingDown, AlertTriangle,
  DollarSign, Clock, Users, Star, Play
} from 'lucide-react'

// Hero Section for Dashboard
export function DashboardHero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
          <Zap className="w-4 h-4" />
          New: Control Center for Prop Traders
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Stop Failing Challenges<br />
          <span className="text-emerald-400">Because of Rules</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Track all your prop firm accounts in one dashboard. Simulate trades before entering. 
          Get alerts before you violate rules. <span className="text-white">Never breach an account again.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
          >
            Try Dashboard Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors border border-gray-700">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            Free to start
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            Works with all prop firms
          </span>
        </div>
      </div>
    </section>
  )
}

// Problem/Solution Section
export function ProblemSolutionSection() {
  const problems = [
    { icon: TrendingDown, text: 'Breached account because you miscalculated drawdown' },
    { icon: AlertTriangle, text: 'Traded during news without knowing it was restricted' },
    { icon: Clock, text: 'Forgot to close positions before weekend' },
    { icon: Brain, text: 'Too many accounts to track in your head' },
  ]
  
  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Sound Familiar?
            </h2>
            <div className="space-y-4">
              {problems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <item.icon className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <p className="text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Solution */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              There's a Better Way
            </h3>
            <p className="text-gray-400 mb-6">
              Our dashboard gives you complete clarity and control over all your prop firm accounts. 
              No more spreadsheets. No more mental math. Just peace of mind.
            </p>
            <ul className="space-y-3">
              {[
                'See all accounts in one place',
                'Know your limits in real-time',
                'Simulate trades before entering',
                'Get alerts before violations',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-emerald-400">
                  <Check className="w-5 h-5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Features Grid
export function FeaturesGrid() {
  const features = [
    {
      icon: Shield,
      title: 'Centralisation',
      description: 'See all your prop firm accounts in one dashboard. No more juggling between platforms.',
      color: 'emerald',
    },
    {
      icon: Target,
      title: 'Trade Simulator',
      description: 'Check if a trade is safe BEFORE you enter. Know exactly what happens if you lose.',
      color: 'blue',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified before you violate rules. Daily DD warnings, news restrictions, weekend reminders.',
      color: 'yellow',
    },
    {
      icon: Brain,
      title: 'Hidden Rules Database',
      description: 'Learn the unwritten rules that cause breaches. Avoid common mistakes for each prop firm.',
      color: 'purple',
    },
  ]
  
  const colorClasses = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'text-yellow-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400' },
  }
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to <span className="text-emerald-400">Protect Your Accounts</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Four powerful tools that work together to keep you funded.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses]
            return (
              <div 
                key={i}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Trade Simulator Preview
export function SimulatorPreview() {
  const [simResult, setSimResult] = useState<'safe' | 'warning' | 'danger' | null>(null)
  
  return (
    <section className="py-20 px-4 bg-gray-800/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Know Before You Trade
            </h2>
            <p className="text-xl text-gray-400 mb-6">
              Enter your risk amount and instantly see if your trade is safe. 
              No more guessing. No more surprise breaches.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="font-medium text-white">Select your account</h4>
                  <p className="text-sm text-gray-500">Choose which prop firm account to simulate</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="font-medium text-white">Enter your risk</h4>
                  <p className="text-sm text-gray-500">How much could you lose on this trade?</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="font-medium text-white">Get instant verdict</h4>
                  <p className="text-sm text-gray-500">Safe, Warning, or Violation - before you trade</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Demo */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="font-medium text-white mb-4">Try it yourself</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Account</label>
                <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white">
                  FTMO - Standard $100K (Balance: $102,450)
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">Risk Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setSimResult('safe')}
                className="flex-1 py-2 bg-gray-800 hover:bg-emerald-500/20 border border-gray-700 hover:border-emerald-500/50 text-white text-sm rounded-lg transition-colors"
              >
                $500 risk
              </button>
              <button 
                onClick={() => setSimResult('warning')}
                className="flex-1 py-2 bg-gray-800 hover:bg-yellow-500/20 border border-gray-700 hover:border-yellow-500/50 text-white text-sm rounded-lg transition-colors"
              >
                $2,000 risk
              </button>
              <button 
                onClick={() => setSimResult('danger')}
                className="flex-1 py-2 bg-gray-800 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 text-white text-sm rounded-lg transition-colors"
              >
                $5,000 risk
              </button>
            </div>
            
            {simResult && (
              <div className={`p-4 rounded-xl ${
                simResult === 'safe' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                simResult === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-3">
                  {simResult === 'safe' && <Check className="w-6 h-6 text-emerald-400" />}
                  {simResult === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-400" />}
                  {simResult === 'danger' && <AlertTriangle className="w-6 h-6 text-red-400" />}
                  <div>
                    <p className={`font-semibold ${
                      simResult === 'safe' ? 'text-emerald-400' :
                      simResult === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {simResult === 'safe' && 'Trade is SAFE'}
                      {simResult === 'warning' && 'Proceed with CAUTION'}
                      {simResult === 'danger' && 'DO NOT TRADE'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {simResult === 'safe' && 'This trade respects all your limits'}
                      {simResult === 'warning' && 'You would use 65% of daily drawdown'}
                      {simResult === 'danger' && 'This would breach your account'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Pricing Section
export function PricingSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-xl text-gray-400">
            No credit card required. Start protecting your accounts today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
            <p className="text-gray-400 mb-4">Perfect to get started</p>
            <p className="text-4xl font-bold text-white mb-6">$0</p>
            
            <ul className="space-y-3 mb-8">
              {[
                'Up to 3 accounts',
                '5 simulations per day',
                'Basic alerts',
                'Hidden rules access',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
            
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-gray-700 hover:bg-gray-600 text-white text-center font-medium rounded-xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>
          
          {/* Pro */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 border-2 border-emerald-500/50 rounded-2xl p-8 relative">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
              Most Popular
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-gray-400 mb-4">For serious traders</p>
            <p className="text-4xl font-bold text-white mb-6">
              $12<span className="text-lg text-gray-400">/month</span>
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited accounts',
                'Unlimited simulations',
                'Email alerts',
                'P&L history tracking',
                'Advanced analytics',
                'Priority support',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
            
            <Link
              href="/dashboard?upgrade=pro"
              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors"
            >
              Start Pro Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Final CTA
export function FinalCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-900/50 to-gray-900 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Stop Losing Accounts<br />to Rule Violations?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who use PropFirmScanner Dashboard to protect their funded accounts.
          </p>
          
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
          >
            Start Free Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
