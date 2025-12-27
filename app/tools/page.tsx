import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  Calculator, Target, TrendingDown, BookOpen,
  PieChart, AlertTriangle, Zap, ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free Prop Trading Tools | PropFirm Scanner',
  description: 'Free tools for prop traders: Risk Calculator, Profit Calculator, Drawdown Simulator, Rule Tracker, and more. Improve your trading performance.',
  keywords: 'prop trading tools, risk calculator, profit calculator, drawdown simulator, trading tools',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools',
  },
}

const TOOLS = [
  {
    slug: 'risk-calculator',
    name: 'Risk Calculator',
    description: 'Calculate your position size based on account size, risk percentage, and stop loss.',
    icon: Calculator,
    color: 'from-emerald-500 to-emerald-700',
    features: ['Position sizing', 'Pip value calculator', 'Risk analysis'],
    popular: true,
  },
  {
    slug: 'rule-tracker',
    name: 'Rule Tracker',
    description: 'Track your challenge progress, monitor drawdown, and stay within the rules.',
    icon: Target,
    color: 'from-blue-500 to-blue-700',
    features: ['Daily tracking', 'DD monitoring', 'Export data'],
    popular: true,
  },
  {
    slug: 'profit-calculator',
    name: 'Profit Calculator',
    description: 'Calculate your potential profits based on account size and profit split.',
    icon: PieChart,
    color: 'from-purple-500 to-purple-700',
    features: ['Profit projections', 'Split calculator', 'Scaling plans'],
    popular: false,
  },
  {
    slug: 'drawdown-simulator',
    name: 'Drawdown Simulator',
    description: 'Simulate different drawdown scenarios and understand trailing vs static DD.',
    icon: TrendingDown,
    color: 'from-orange-500 to-orange-700',
    features: ['Static vs Trailing', 'Scenario testing', 'Visual charts'],
    popular: false,
  },
]

const RESOURCES = [
  {
    name: 'Glossary',
    description: 'Learn prop trading terminology',
    href: '/glossary',
    icon: BookOpen,
  },
  {
    name: 'Quick Match',
    description: 'Find your perfect prop firm',
    href: '/quick-match',
    icon: Zap,
  },
  {
    name: 'FAQ',
    description: 'Common questions answered',
    href: '/faq',
    icon: AlertTriangle,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Calculator className="w-4 h-4" />
            Free Tools
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Prop Trading Tools</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Free calculators and tools to help you pass your prop firm challenge and manage risk effectively.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-gray-800/50 border border-gray-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                  <tool.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h2>
                    {tool.popular && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Resources Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">More Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {RESOURCES.map((resource) => (
              <Link
                key={resource.name}
                href={resource.href}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/30 transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <resource.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white font-medium">{resource.name}</div>
                  <div className="text-gray-400 text-sm">{resource.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Prop Firm?</h2>
          <p className="text-gray-400 mb-6">
            Use our comparison tool to find the perfect match for your trading style.
          </p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Compare 90+ Prop Firms
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
