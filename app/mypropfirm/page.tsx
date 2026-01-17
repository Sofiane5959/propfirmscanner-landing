'use client';

import Link from 'next/link';
import { 
  Home, ChevronRight, Crown, CheckCircle2, Lock, Sparkles,
  BarChart3, Bell, Shield, Zap, Users, TrendingUp,
  Calculator, FileText, Star, ArrowRight, Rocket,
  PieChart, Target, Clock, Award, Heart, MessageSquare
} from 'lucide-react';

// =============================================================================
// FEATURES DATA
// =============================================================================

const features = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics Dashboard',
    description: 'Track all your prop firm accounts in one place. P&L, drawdown, win rate, and more.',
    badge: 'Pro',
  },
  {
    icon: Bell,
    title: 'Rule Violation Alerts',
    description: 'Get instant notifications when you\'re approaching drawdown limits or rule violations.',
    badge: 'Pro',
  },
  {
    icon: Calculator,
    title: 'Position Size Calculator',
    description: 'Calculate optimal position sizes based on your account rules and risk tolerance.',
    badge: null,
  },
  {
    icon: PieChart,
    title: 'Performance Reports',
    description: 'Weekly and monthly reports analyzing your trading patterns and areas for improvement.',
    badge: 'Pro',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set profit targets and track your progress towards passing challenges or payouts.',
    badge: null,
  },
  {
    icon: FileText,
    title: 'Trade Journal',
    description: 'Built-in journal to log trades, emotions, and lessons learned.',
    badge: 'Pro',
  },
  {
    icon: Shield,
    title: 'Rule Compliance Checker',
    description: 'Automatically check if your trading complies with each prop firm\'s specific rules.',
    badge: 'Pro',
  },
  {
    icon: Clock,
    title: 'Trading Session Timer',
    description: 'Track your active trading hours and optimize your schedule.',
    badge: null,
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic tools for getting started',
    features: [
      'Compare up to 10 prop firms',
      'Basic position calculator',
      'Goal tracking (1 account)',
      'Community access',
    ],
    notIncluded: [
      'Advanced analytics',
      'Rule violation alerts',
      'Performance reports',
      'Multiple accounts',
    ],
    cta: 'Current Plan',
    ctaStyle: 'bg-gray-700 text-gray-400 cursor-not-allowed',
    popular: false,
  },
  {
    name: 'Pro',
    price: 29.99,
    period: 'month',
    description: 'Everything you need to get funded',
    features: [
      'Unlimited prop firm comparisons',
      'Advanced analytics dashboard',
      'Rule violation alerts',
      'Weekly performance reports',
      'Trade journal',
      'Rule compliance checker',
      'Unlimited account tracking',
      'Priority support',
      'Early access to new features',
    ],
    notIncluded: [],
    cta: 'Coming Soon',
    ctaStyle: 'bg-gray-700 text-gray-400 cursor-not-allowed',
    popular: true,
  },
];

// ✅ STATS CORRIGÉES - Uniquement des données vérifiables
const stats = [
  { value: '80+', label: 'Prop Firms Compared' },
  { value: '100%', label: 'Free to Start' },
  { value: 'Daily', label: 'Data Updates' },
  { value: '24/7', label: 'Access' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <Link href="/" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
        <Home className="w-4 h-4" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-white">MyPropFirm</span>
    </nav>
  );
}

function ComingSoonOverlay() {
  return (
    <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-white font-bold text-lg mb-3 animate-pulse">
          <Lock className="w-5 h-5" />
          Coming Soon
        </div>
        <p className="text-gray-400 text-sm">Join waitlist for early access!</p>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MyPropFirmPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-20">
          <Breadcrumb />
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              Premium Trading Tools
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              My<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">PropFirm</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              The ultimate toolkit for prop firm traders. Track accounts, avoid rule violations, and maximize your chances of getting funded.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button disabled className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed">
                <Lock className="w-5 h-5" />
                Coming Soon
              </button>
              <Link 
                href="/compare"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
              >
                Try Free Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Stats - CORRIGÉES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage your prop firm journey in one place.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  {feature.badge && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-gray-400">Start free, upgrade when you&apos;re ready</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-gray-900 rounded-2xl border ${
                  plan.popular ? 'border-emerald-500' : 'border-gray-800'
                } overflow-hidden`}
              >
                {/* Coming Soon overlay for Pro plan */}
                {plan.popular && <ComingSoonOverlay />}
                
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500">/{plan.period}</span>
                    )}
                  </div>
                  
                  <button 
                    disabled
                    className={`w-full py-3 rounded-xl font-semibold mb-8 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 opacity-50">
                        <CheckCircle2 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <span className="text-gray-500 text-sm line-through">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ SECTION REMPLACÉE - Plus de faux témoignages */}
      {/* Community / Beta Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-gray-400">Be part of the growing PropFirmScanner community</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 - Beta Testers */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Beta Testers Wanted</h3>
            <p className="text-gray-500 text-sm mb-4">
              Help us shape the future of prop firm tracking tools.
            </p>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-sm">
              <Lock className="w-4 h-4" />
              Coming Soon
            </span>
          </div>

          {/* Card 2 - Free Tools */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Free Tools Available</h3>
            <p className="text-gray-500 text-sm mb-4">
              Compare 80+ prop firms right now, completely free.
            </p>
            <Link 
              href="/compare"
              className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              Start Comparing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 - Feedback */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Share Your Feedback</h3>
            <p className="text-gray-500 text-sm mb-4">
              Tell us what features you&apos;d like to see in MyPropFirm Pro.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 text-purple-400 text-sm hover:text-purple-300 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl border border-emerald-500/30 p-8 md:p-12 text-center">
          <Rocket className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Be the First to Know</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            MyPropFirm Pro is launching soon. Join the waitlist to get early access and exclusive launch pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button disabled className="px-8 py-3 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Join Waitlist - Coming Soon
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
