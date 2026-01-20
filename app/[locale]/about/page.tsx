import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  Users, Target, Shield, TrendingUp, Heart,
  CheckCircle, Globe, Award, Zap
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | PropFirm Scanner',
  description: 'Learn about PropFirm Scanner - the leading prop firm comparison platform helping traders find their perfect match since 2024.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/about',
  },
}

const STATS = [
  { value: '90+', label: 'Prop Firms Tracked' },
  { value: '5,000+', label: 'Traders Helped' },
  { value: 'Weekly', label: 'Data Updates' },
  { value: '50+', label: 'Comparisons' },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Accuracy',
    description: 'We verify our data weekly and cross-reference multiple sources to ensure you get reliable information.',
  },
  {
    icon: Heart,
    title: 'Transparency',
    description: 'We openly disclose our affiliate relationships and never let them influence our rankings or reviews.',
  },
  {
    icon: Target,
    title: 'Trader-First',
    description: 'Every feature we build is designed to help traders make better, more informed decisions.',
  },
  {
    icon: Zap,
    title: 'Independence',
    description: 'We maintain editorial independence and include both affiliate and non-affiliate firms in our comparisons.',
  },
]

const TIMELINE = [
  {
    year: '2024',
    title: 'Founded',
    description: 'PropFirm Scanner launched with a mission to bring transparency to the prop trading industry.',
  },
  {
    year: '2024',
    title: 'First 50 Firms',
    description: 'Reached our first milestone of tracking and comparing 50 prop trading firms.',
  },
  {
    year: '2025',
    title: '90+ Firms',
    description: 'Expanded our database to cover 90+ prop firms across Forex, Futures, and Crypto.',
  },
  {
    year: '2025',
    title: 'Tools Launch',
    description: 'Introduced Risk Calculator, Rule Tracker, and Quick Match to help traders succeed.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Users className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Helping Traders Make
            <span className="text-emerald-400"> Smarter Choices</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            PropFirm Scanner is the leading prop firm comparison platform, built by traders 
            for traders. We&apos;re on a mission to bring transparency and clarity to the 
            prop trading industry.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center"
            >
              <div className="text-3xl font-bold text-emerald-400 mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
                <p className="text-gray-300 text-lg">
                  To empower traders with accurate, unbiased information so they can find 
                  the right prop firm for their unique trading style and goals.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Provide accurate, verified data',
                'Compare firms objectively',
                'Save traders time and money',
                'Maintain editorial independence',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((value, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Journey</h2>
          <div className="space-y-6">
            {TIMELINE.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {item.year}
                  </div>
                  {index < TIMELINE.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-700 my-2" />
                  )}
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex-1">
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <Globe className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Track & Compare</h3>
              <p className="text-gray-400 text-sm">
                We monitor 90+ prop firms and keep our data updated weekly.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <Award className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Verify & Review</h3>
              <p className="text-gray-400 text-sm">
                We cross-reference data with official sources and Trustpilot reviews.
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
              <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Build Tools</h3>
              <p className="text-gray-400 text-sm">
                We create free tools to help traders succeed in their challenges.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Prop Firm?</h2>
            <p className="text-gray-400 mb-6">
              Use our tools to compare firms and find the perfect match for your trading style.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/compare"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Compare Prop Firms
              </Link>
              <Link
                href="/quick-match"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                Take the Quiz
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
