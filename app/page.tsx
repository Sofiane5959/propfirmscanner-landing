import Newsletter from '@/components/Newsletter';
import Link from 'next/link'
import { 
  Target, 
  Zap, 
  Shield, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2,
  Star,
  Users,
  BarChart3,
  Bell
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Compare Instantly',
    description: 'See pricing, profit splits, rules, and legitimacy scores for 50+ prop firms side-by-side.',
  },
  {
    icon: Shield,
    title: 'Verify Legitimacy',
    description: 'Check regulation, licenses, and real trader reviews before risking your money.',
  },
  {
    icon: Target,
    title: 'Match Your Style',
    description: 'Filter by scalping, day trading, swing trading - find firms that allow YOUR strategy.',
  },
  {
    icon: Bell,
    title: 'Get Alerts',
    description: 'Never miss a deal. Get notified when your favorite firms drop prices or launch promos.',
  },
]

const stats = [
  { value: '50+', label: 'Prop Firms' },
  { value: '10K+', label: 'Traders' },
  { value: '$2M+', label: 'Saved' },
  { value: '4.9/5', label: 'Rating' },
]

const propFirmLogos = [
  'FTMO', 'Funded Next', 'E8 Funding', 'The Funded Trader', 'Topstep', 'True Forex Funds'
]

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-brand-400 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Now comparing 50+ prop firms
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
              Find Your Perfect{' '}
              <span className="gradient-text">Prop Firm</span>
              {' '}in Seconds
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-dark-300 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Stop wasting hours comparing prop firms manually. Our scanner analyzes pricing, rules, profit splits, and legitimacy so you can focus on trading.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/compare"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-xl hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2 glow-green"
              >
                Start Comparing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/deals"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white glass glass-hover rounded-xl flex items-center justify-center gap-2"
              >
                🔥 View Deals
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-dark-400 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-emerald-500 border-2 border-dark-900" />
                  ))}
                </div>
                <span>10,000+ traders</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-dark-500 mb-6">Comparing top prop firms including</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {propFirmLogos.map((name) => (
              <div key={name} className="text-dark-400 font-semibold text-lg opacity-60 hover:opacity-100 transition-opacity">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Choose Wisely
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              We've analyzed every aspect of prop trading firms so you don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-2xl glass glass-hover group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Find your perfect prop firm in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Set Your Filters',
                description: 'Choose your budget, trading style, preferred platforms, and more.',
              },
              {
                step: '02',
                title: 'Compare Results',
                description: 'See all matching prop firms with detailed comparisons side-by-side.',
              },
              {
                step: '03',
                title: 'Choose & Trade',
                description: 'Pick the best firm for you and start your funded trading journey.',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-white/5 absolute -top-4 left-0">{item.step}</div>
                <div className="pt-8">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-dark-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-dark-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-emerald-600" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            
            {/* Content */}
            <div className="relative p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Perfect Prop Firm?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Join 10,000+ traders who've used PropFirm Scanner to find the best prop trading firms for their needs.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/compare"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-brand-600 bg-white rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  Start Comparing Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>50+ prop firms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Updated daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Composant Mailchimp */}
      <section className="py-16 md:py-20 border-t border-white/10">
        <Newsletter className="max-w-4xl mx-auto px-4" />
      </section>
    </div>
  )
}
