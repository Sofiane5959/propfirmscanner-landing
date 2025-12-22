'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Search, ArrowRight, Star, Shield, Zap, TrendingUp, 
  CheckCircle, Users, Award, ChevronDown, ChevronUp,
  DollarSign, Target, BarChart3, Clock
} from 'lucide-react'
import { getPropFirms } from '@/lib/supabase-queries'
import type { PropFirm } from '@/types'

const FEATURES = [
  {
    icon: Search,
    title: 'Compare 55+ Firms',
    description: 'Filter by platform, price, profit split, and trading style to find your perfect match.',
  },
  {
    icon: Shield,
    title: 'Verified Reviews',
    description: 'Real Trustpilot ratings and honest analysis to help you avoid scams.',
  },
  {
    icon: Zap,
    title: 'Exclusive Deals',
    description: 'Get up to 80% off with our exclusive discount codes and promotions.',
  },
  {
    icon: TrendingUp,
    title: 'Updated Daily',
    description: 'We track price changes, new programs, and rule updates in real-time.',
  },
]

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Compare Firms',
    description: 'Use our filters to narrow down 55+ prop firms based on your needs.',
    icon: BarChart3,
  },
  {
    step: 2,
    title: 'Read Reviews',
    description: 'Check detailed reviews, rules, and Trustpilot ratings for each firm.',
    icon: Star,
  },
  {
    step: 3,
    title: 'Get Discount',
    description: 'Use our exclusive promo codes to save up to 80% on your challenge.',
    icon: DollarSign,
  },
  {
    step: 4,
    title: 'Start Trading',
    description: 'Pass your challenge and get funded with up to $400,000 in capital.',
    icon: Target,
  },
]

const TESTIMONIALS = [
  {
    name: 'Alex M.',
    role: 'Forex Trader',
    image: 'A',
    quote: 'PropFirm Scanner saved me hours of research. Found the perfect firm with a 90% profit split in minutes!',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    role: 'Day Trader',
    image: 'S',
    quote: 'The discount codes alone saved me over $200. This site is a must for any serious trader.',
    rating: 5,
  },
  {
    name: 'Michael T.',
    role: 'Swing Trader',
    image: 'M',
    quote: 'Finally passed my first challenge thanks to the detailed rule breakdowns. Highly recommend!',
    rating: 5,
  },
]

const FAQS = [
  {
    question: 'What is a prop trading firm?',
    answer: 'A proprietary (prop) trading firm provides traders with capital to trade in exchange for a share of the profits. You typically need to pass an evaluation challenge to prove your skills before receiving a funded account.',
  },
  {
    question: 'How do prop firm challenges work?',
    answer: 'Most prop firms require you to pass a 1-step, 2-step, or 3-step evaluation where you must reach a profit target (usually 8-10%) while respecting risk rules like maximum drawdown limits. Once you pass, you get a funded account.',
  },
  {
    question: 'How much can I earn with a prop firm?',
    answer: 'Earnings depend on your trading performance and the profit split. Most firms offer 70-90% profit splits on accounts ranging from $10,000 to $400,000. Top traders can earn $10,000+ per month.',
  },
  {
    question: 'Are the discount codes on this site real?',
    answer: 'Yes! We partner directly with prop firms to offer exclusive discount codes. These are regularly updated and verified to ensure they work.',
  },
  {
    question: 'Which prop firm is best for beginners?',
    answer: 'For beginners, we recommend firms with relaxed rules, no time limits, and lower profit targets. Check our comparison tool to filter by "beginner-friendly" criteria.',
  },
]

const STATS = [
  { value: '55+', label: 'Prop Firms' },
  { value: '$2M+', label: 'Saved by Users' },
  { value: '50K+', label: 'Monthly Visitors' },
  { value: '4.9', label: 'User Rating' },
]

export default function HomePage() {
  const [topFirms, setTopFirms] = useState<PropFirm[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function fetchTopFirms() {
      const firms = await getPropFirms()
      // Get top 6 firms by rating
      const sorted = firms
        .filter(f => f.trustpilot_rating)
        .sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
        .slice(0, 6)
      setTopFirms(sorted)
    }
    fetchTopFirms()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>Updated for 2026 - 55+ Prop Firms Compared</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Prop Trading Firm
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Compare pricing, profit splits, rules, and reviews for 55+ prop firms. 
            Get exclusive discount codes and start trading with funded capital.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/compare"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              Compare Prop Firms
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/guide"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-lg border border-white/20"
            >
              Free Guide
              <span className="px-2 py-0.5 bg-emerald-500 text-xs rounded">PDF</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Traders Love PropFirm Scanner
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to find, compare, and save on prop trading firms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-emerald-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get funded in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent -translate-x-8" />
                )}
                
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 relative">
                    <step.icon className="w-10 h-10 text-emerald-400" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Prop Firms */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Top Rated Prop Firms
              </h2>
              <p className="text-gray-400">Based on Trustpilot ratings and user reviews</p>
            </div>
            <Link
              href="/compare"
              className="px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-xl transition-all flex items-center gap-2 border border-emerald-500/20"
            >
              View All Firms
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topFirms.map((firm) => (
              <Link
                key={firm.id}
                href={`/prop-firm/${firm.slug || firm.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                      {firm.logo_url ? (
                        <img src={firm.logo_url} alt={firm.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-2xl font-bold text-emerald-500">{firm.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {firm.name}
                      </h3>
                      {firm.headquarters && (
                        <p className="text-gray-500 text-sm">{firm.headquarters}</p>
                      )}
                    </div>
                  </div>
                  {firm.trustpilot_rating && firm.trustpilot_rating >= 4.5 && (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Top
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {firm.trustpilot_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{firm.trustpilot_rating}</span>
                    </div>
                  )}
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">From ${firm.min_price}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-emerald-400">{firm.profit_split}% split</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {firm.platforms?.slice(0, 3).map((platform) => (
                    <span key={platform} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded">
                      {platform}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands of Traders
            </h2>
            <p className="text-gray-400 text-lg">See what our community has to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/50 border border-gray-700 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400">Everything you need to know about prop trading</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Funded?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who found their perfect prop firm through PropFirm Scanner. 
              Start comparing now and save with exclusive discount codes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/compare"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
              >
                Compare All Firms
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/deals"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-lg border border-white/20"
              >
                View Discount Codes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
