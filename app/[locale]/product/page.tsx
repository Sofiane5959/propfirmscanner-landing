'use client'

import Link from 'next/link'
import { 
  Shield, Target, AlertTriangle, Check, ArrowRight, 
  Eye, Calculator, Bell, BookOpen, X, Zap,
  ChevronRight
} from 'lucide-react'

export default function DashboardProductPage() {
  return (
    <div className="min-h-screen bg-bg-elevated">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm mb-8">
            <Shield className="w-4 h-4" />
            Prop Firm Control Center
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            One dashboard to manage<br />
            <span className="text-accent">all your prop firm accounts.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white mb-4">
            Know your limits before you trade.
          </p>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10">
            Track balances, drawdown limits, and rules across all your prop firms — 
            and simulate trades before you enter them.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-hover hover:brightness-110 text-white font-semibold rounded-xl transition-colors"
            >
              Start Protecting Your Accounts
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition-colors border border-border"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
      
      {/* The Problem */}
      <section className="py-16 px-4 bg-dark-700/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The Problem
          </h2>
          
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
            <p className="text-xl text-text-secondary mb-6 text-center">
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
                <div key={i} className="flex items-center gap-3 text-text-secondary">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            
            <p className="text-center text-text-muted mt-6">
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
          <p className="text-xl text-text-secondary text-center mb-12">
            PropFirmScanner is your <span className="text-accent">control center</span> for prop firm trading.
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
                className="flex items-start gap-4 p-5 bg-dark-700/50 border border-border/50 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4 bg-dark-700/30">
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
                <div className="w-12 h-12 rounded-full bg-accent-hover flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
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
          
          <div className="bg-dark-700/50 border border-border/50 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                'We don\'t give trading signals.',
                'We don\'t promise profits.',
                'We don\'t trade for you.',
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-text-secondary">{item}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-6 border-t border-border">
              <p className="text-lg text-accent">
                We help you <span className="font-semibold">avoid mistakes</span> and <span className="font-semibold">stay compliant</span> with prop firm rules.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section id="pricing" className="py-16 px-4 bg-dark-700/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            Simple Pricing
          </h2>
          <p className="text-text-secondary text-center mb-12">
            Start free, upgrade when you need more.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-dark-700/50 border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-text-muted mb-4">Get started</p>
              <p className="text-4xl font-bold text-white mb-6">$0</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 1 prop firm account',
                  'Basic rule visibility',
                  'Limited simulations (5/day)',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link
                href="/auth/signup"
                className="block w-full py-3 bg-dark-600 hover:bg-dark-500 text-white text-center font-medium rounded-xl transition-colors"
              >
                Start Free
              </Link>
            </div>
            
            {/* Pro */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-bg-elevated border-2 border-accent/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 right-6 px-3 py-1 bg-accent-hover text-white text-sm font-medium rounded-full">
                Recommended
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-text-muted mb-4">For serious traders</p>
              <p className="text-4xl font-bold text-white mb-1">
                $9<span className="text-lg text-text-secondary">/month</span>
              </p>
              <p className="text-sm text-text-muted mb-6">or $15/month billed monthly</p>
              
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited prop firm accounts',
                  'Unlimited trade simulations',
                  'Alerts & warnings',
                  'Hidden rules & common mistakes',
                  'Priority updates',
                  'Email support',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link
                href="/auth/signup?plan=pro"
                className="block w-full py-3 bg-accent-hover hover:brightness-110 text-white text-center font-semibold rounded-xl transition-colors"
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
          <p className="text-xl text-text-secondary mb-8">
            Join traders who use PropFirmScanner to avoid costly mistakes.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-hover hover:brightness-110 text-white font-semibold rounded-xl transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
