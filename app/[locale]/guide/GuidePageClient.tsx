'use client'

import { useState } from 'react'
import { 
  BookOpen, CheckCircle, Download, Mail, ArrowRight, 
  Target, Shield, TrendingUp, AlertTriangle, Star,
  DollarSign, Clock, Users, Award
} from 'lucide-react'

const GUIDE_CHAPTERS = [
  {
    number: 1,
    title: 'Understanding Prop Firms',
    description: 'What are prop firms and how do they work?',
    icon: BookOpen,
  },
  {
    number: 2,
    title: 'Challenge Types Explained',
    description: '1-step, 2-step, 3-step, and instant funding',
    icon: Target,
  },
  {
    number: 3,
    title: 'Key Rules to Know',
    description: 'Drawdown, profit targets, and trading rules',
    icon: Shield,
  },
  {
    number: 4,
    title: 'Choosing the Right Platform',
    description: 'MT4, MT5, cTrader, and more',
    icon: TrendingUp,
  },
  {
    number: 5,
    title: 'Red Flags to Avoid',
    description: 'How to spot scam prop firms',
    icon: AlertTriangle,
  },
  {
    number: 6,
    title: 'Our Top Picks for 2026',
    description: 'Best prop firms by category',
    icon: Star,
  },
]

const BENEFITS = [
  { icon: DollarSign, text: 'Save $500+ by avoiding bad choices' },
  { icon: Clock, text: '30+ hours of research condensed' },
  { icon: Users, text: 'Used by 5,000+ traders' },
  { icon: Award, text: 'Updated for 2026' },
]

// Lien direct vers le PDF
const GUIDE_PDF_URL = '/guides/PropFirm-Guide-2026.pdf'

export default function GuidePageClient() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'guide' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
        return
      }

      setStatus('success')
      setMessage('Your guide is ready!')
      localStorage.setItem('newsletter_subscribed', 'true')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                Free 40+ Page Guide
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                How to Choose the <span className="text-emerald-400">Perfect Prop Firm</span> in 2026
              </h1>
              
              <p className="text-xl text-gray-400 mb-8">
                Stop wasting money on the wrong prop firms. Our comprehensive guide reveals 
                exactly what to look for, red flags to avoid, and our top picks for every trading style.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-gray-900" />
                  ))}
                </div>
                <span>Trusted by 5,000+ traders worldwide</span>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Get Your Free Guide</h2>
                <p className="text-gray-400">Enter your email to download instantly</p>
              </div>

              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Guide is Ready! 🎉</h3>
                  <p className="text-gray-400 mb-6">Click below to download your free guide</p>
                  
                  {/* Bouton de téléchargement direct */}
                  <a
                    href={GUIDE_PDF_URL}
                    download="PropFirm-Guide-2026.pdf"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 
                              text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF Now
                  </a>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Problems downloading?{' '}
                    <a 
                      href={GUIDE_PDF_URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      Open in new tab
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl
                                text-white placeholder:text-gray-500 focus:outline-none 
                                focus:border-emerald-500 transition-all"
                      disabled={status === 'loading'}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 
                              text-white font-semibold rounded-xl hover:opacity-90 
                              transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      'Processing...'
                    ) : (
                      <>
                        Download Free Guide
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {message && status === 'error' && (
                    <p className="text-sm text-red-400 text-center">{message}</p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    By downloading, you agree to receive occasional emails. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What&apos;s Inside the Guide</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to know to make an informed decision and find the perfect prop firm for your trading style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDE_CHAPTERS.map((chapter) => (
              <div
                key={chapter.number}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <chapter.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-emerald-400 text-sm font-medium mb-1">Chapter {chapter.number}</div>
                    <h3 className="text-white font-semibold mb-1">{chapter.title}</h3>
                    <p className="text-gray-400 text-sm">{chapter.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What Traders Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "This guide saved me from choosing a scam prop firm. The red flags section is gold!",
                name: "Michael T.",
                role: "Forex Trader",
              },
              {
                quote: "Finally understood the difference between challenge types. Passed my first evaluation!",
                name: "Sarah K.",
                role: "Day Trader",
              },
              {
                quote: "Wish I had this before wasting $500 on the wrong firm. Essential reading.",
                name: "James R.",
                role: "Swing Trader",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Perfect Prop Firm?</h2>
            <p className="text-gray-400 mb-6">
              Download the free guide now and start your funded trading journey the right way.
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              Get Free Guide Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
