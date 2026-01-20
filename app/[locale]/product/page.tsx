'use client'

import Link from 'next/link'
import { 
  Shield, Target, AlertTriangle, Check, ArrowRight, 
  Eye, Calculator, Bell, BookOpen, X, Zap,
  ChevronRight
} from 'lucide-react'

export default function DashboardProductPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8">
            <Shield className="w-4 h-4" />
            Prop Firm Control Center
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            One dashboard to manage<br />
            <span className="text-emerald-400">all your prop firm accounts.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white mb-4">
            Know your limits before you trade.
          </p>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Track balances, drawdown limits, and rules across all your prop firms — 
            and simulate trades before you enter them.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Start Protecting Your Accounts
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors border border-gray-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
      
      {/* The Problem */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The Problem
          </h2>
          
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
            <p className="text-xl text-gray-300 mb-6 text-center">
              Prop firm traders often fail challenges <span className="text-red-400 font-semibold">not because of bad trading</span> — but because of <span className="text-red-400 font-semibold">rules</span>.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Multiple accounts with different drawdowns',
                'Hidden restrictions you didn\'t know about',
                'Daily limits that reset at different times',
                'Trailing rules that confuse everyone',
                'News trading restrictions',
                'Weekend holding policies',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-400">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-500 mt-6">
              Keeping everything in your head (or in spreadsheets) leads to mistakes.
            </p>
          </div>
        </div>
      </section>
      
      {/* The Solution */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            The Solution
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            PropFirmScanner is your <span className="text-emerald-400">control center</span> for prop firm trading.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Eye,
                title: 'Centralize all your accounts',
                description: 'See all your prop firm accounts in one place',
              },
              {
                icon: Calculator,
                title: 'See your limits at a glance',
                description: 'Remaining daily and max drawdown, calculated automatically',
              },
              {
                icon: Bell,
                title: 'Get warned before violations',
                description: 'Alerts when you\'re close to breaking a rule',
              },
              {
                icon: Target,
                title: 'Simulate trades',
                description: 'Check if a trade is allowed before you enter',
              },
              {
                icon: BookOpen,
                title: 'Understand hidden rules',
                description: 'Learn common mistakes for each prop firm',
              },
              {
                icon: Shield,
                title: 'Stay compliant',
                description: 'Never breach an account due to rule confusion again',
              },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-start gap-4 p-5 bg-gray-800/50 border border-gray-700/50 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            How It Works
          </h2>
          
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Add your prop firm accounts',
                description: 'Manually add your accounts (FTMO, FundingPips, The5ers, etc.) in seconds.',
              },
              {
                step: '2',
                title: 'Track your limits',
                description: 'We calculate your remaining daily and max drawdown automatically.',
              },
              {
                step: '3',
                title: 'Simulate trades',
                description: 'Enter your risk in USD and instantly see if the trade is safe, risky, or a rule violation.',
              },
              {
                step: '4',
                title: 'Stay in control',
                description: 'Receive alerts and warnings when you\'re close to breaking a rule.',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* What We DON'T Do */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What We <span className="text-red-400">DON'T</span> Do
          </h2>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                'We don\'t give trading signals.',
                'We don\'t promise profits.',
                'We don\'t trade for you.',
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-6 border-t border-gray-700">
              <p className="text-lg text-emerald-400">
                We help you <span className="font-semibold">avoid mistakes</span> and <span className="font-semibold">stay compliant</span> with prop firm rules.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Simple Pricing
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Start free, upgrade when you need more.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-gray-500 mb-4">Get started</p>
              <p className="text-4xl font-bold text-white mb-6">$0</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 1 prop firm account',
                  'Basic rule visibility',
                  'Limited simulations (5/day)',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link
                href="/auth/signup"
                className="block w-full py-3 bg-gray-700 hover:bg-gray-600 text-white text-center font-medium rounded-xl transition-colors"
              >
                Start Free
              </Link>
            </div>
            
            {/* Pro */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 border-2 border-emerald-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-white text-sm font-medium rounded-full">
                Recommended
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-500 mb-4">For serious traders</p>
              <p className="text-4xl font-bold text-white mb-1">
                $9<span className="text-lg text-gray-400">/month</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">or $15/month billed monthly</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited prop firm accounts',
                  'Unlimited trade simulations',
                  'Alerts & warnings',
                  'Hidden rules & common mistakes',
                  'Priority updates',
                  'Email support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link
                href="/auth/signup?plan=pro"
                className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start protecting your<br />prop firm accounts
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join traders who use PropFirmScanner to avoid costly mistakes.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
