import Link from 'next/link';
import { Check, Zap, Shield, BarChart3, Bell, Users } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic account tracking',
    features: [
      'Track up to 2 accounts',
      'Basic drawdown monitoring',
      'Trade simulation',
      'Rule summaries',
    ],
    cta: 'Start Free',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For serious traders managing multiple accounts',
    features: [
      'Unlimited accounts',
      'Real-time risk alerts',
      'Advanced trade simulation',
      'Full rule tracking',
      'Trading day log',
      'Daily guidance',
      'Priority support',
    ],
    cta: 'Go Pro',
    href: '/auth/signup?plan=pro',
    highlight: true,
  },
];

const features = [
  {
    icon: Shield,
    title: 'Multi-Account Tracking',
    description: 'Monitor all your prop firm accounts in one unified dashboard. See which are safe, at risk, or need attention.',
  },
  {
    icon: BarChart3,
    title: 'Trade Simulation',
    description: 'Test any trade before you take it. Know instantly if it would be SAFE, RISKY, or cause a VIOLATION.',
  },
  {
    icon: Bell,
    title: 'Daily Guidance',
    description: 'Get personalized advice every day. Know exactly which accounts to focus on and which to avoid.',
  },
  {
    icon: Users,
    title: 'Rule Monitoring',
    description: 'Never miss a rule. Track news restrictions, weekend holding, consistency rules, and minimum trading days.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Start free with basic tracking, or go Pro for unlimited accounts and advanced features.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-emerald-500/20 to-gray-900 border-2 border-emerald-500/50'
                  : 'bg-gray-900 border border-gray-800'
              }`}
            >
              {plan.highlight && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full mb-4">
                  <Zap className="w-3 h-3" />
                  MOST POPULAR
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className={`w-5 h-5 ${plan.highlight ? 'text-emerald-400' : 'text-gray-500'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-3 text-center font-semibold rounded-xl transition-colors ${
                  plan.highlight
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Everything You Need to Pass Your Evaluations
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <feature.icon className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">Yes, you can cancel your Pro subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Is my data secure?</h3>
              <p className="text-gray-400">Absolutely. We use bank-level encryption and never store your trading credentials. Your data is only visible to you.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Do you connect to my trading account?</h3>
              <p className="text-gray-400">No. PropFirmScanner is a tracking and planning tool. You manually update your P&L to keep your records accurate.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">What prop firms are supported?</h3>
              <p className="text-gray-400">We support 100+ prop firms including FTMO, FundedNext, The5ers, MyFundedFX, E8 Funding, and many more.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Shield className="w-5 h-5" />
            Open My Prop Firms
          </Link>
        </div>
      </div>
    </div>
  );
}
