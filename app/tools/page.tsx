'use client';

import Link from 'next/link';
import { 
  Calculator, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  BarChart3,
  ArrowRight,
  Zap,
  Crown
} from 'lucide-react';

const tools = [
  {
    slug: 'drawdown-simulator',
    name: 'Drawdown Simulator',
    description: 'Calculate how much buffer you have before hitting daily or max drawdown limits.',
    icon: TrendingDown,
    color: 'red',
    features: ['Daily DD calculation', 'Max DD calculation', 'Trailing DD support'],
  },
  {
    slug: 'risk-calculator',
    name: 'Risk Calculator',
    description: 'Determine optimal position size based on your risk tolerance and stop loss.',
    icon: Calculator,
    color: 'blue',
    features: ['Position sizing', 'Lot size calculation', 'Risk per trade'],
  },
  {
    slug: 'profit-calculator',
    name: 'Profit Calculator',
    description: 'Calculate potential profits and see how they affect your account balance.',
    icon: DollarSign,
    color: 'emerald',
    features: ['P&L projection', 'Payout estimation', 'Growth tracking'],
  },
  {
    slug: 'rule-tracker',
    name: 'Rule Checker',
    description: 'Check if your trading plan complies with prop firm rules before you trade.',
    icon: Shield,
    color: 'purple',
    features: ['News trading check', 'Weekend holding', 'Consistency rules'],
  },
];

const colorClasses = {
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    border: 'border-red-500/30',
    hover: 'hover:border-red-500/50',
  },
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    hover: 'hover:border-blue-500/50',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    hover: 'hover:border-emerald-500/50',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    hover: 'hover:border-purple-500/50',
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full mb-4">
            <Calculator className="w-4 h-4" />
            Free Tools
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Prop Firm Trading Tools
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Free calculators to help you stay compliant and manage risk. 
            No signup required.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colors = colorClasses[tool.color as keyof typeof colorClasses];
            
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className={`bg-gray-800 rounded-2xl p-6 border ${colors.border} ${colors.hover} transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-2">
                  {tool.name}
                </h2>
                <p className="text-gray-400 mb-4">
                  {tool.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-lg"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pro CTA */}
        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-8 border border-emerald-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Pro Tracker</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Track Everything Automatically
              </h2>
              <p className="text-gray-300">
                Stop calculating manually. The Pro Tracker monitors all your prop firm accounts 
                in real-time, alerts you before violations, and simulates trades instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                <Zap className="w-5 h-5" />
                Try Pro Tracker Free
              </Link>
              <p className="text-sm text-gray-400 text-center">
                Free tier available • No credit card
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
