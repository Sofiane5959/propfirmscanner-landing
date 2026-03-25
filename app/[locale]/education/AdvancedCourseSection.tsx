'use client';

import { useState } from 'react';
import { Zap, Lock, CheckCircle, ChevronRight, Trophy, Brain, TrendingUp, Shield, Clock, Star } from 'lucide-react';

// =============================================================================
// WAITLIST FORM — calls /api/waitlist/advanced
// =============================================================================

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/waitlist/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <p className="text-emerald-400 font-semibold text-lg">You're on the list!</p>
        <p className="text-gray-400 text-sm text-center">
          We'll email you first when Prop Firm Mastery launches — with an exclusive early bird discount.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading' || !email.trim()}
        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
      >
        {status === 'loading' ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Join Waitlist
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

// =============================================================================
// MAIN COMPONENT — drop this as a section inside /education/page.tsx
// =============================================================================

export default function AdvancedCourseSection() {
  const modules = [
    {
      icon: Trophy,
      title: 'Challenge Validation Strategies',
      description: 'Exact techniques used to pass FTMO, Apex, and Fundednext challenges consistently — entries, sizing, timing.',
    },
    {
      icon: Brain,
      title: 'Advanced Risk Management',
      description: 'Dynamic position sizing, correlation risk, drawdown recovery protocols. Never blow another account.',
    },
    {
      icon: TrendingUp,
      title: 'High-Probability Setups',
      description: 'Institutional order flow, liquidity sweeps, and session-based strategies with 70%+ win rate potential.',
    },
    {
      icon: Shield,
      title: 'Trading Psychology',
      description: 'FOMO, revenge trading, and discipline frameworks. The mental edge that separates funded traders from the rest.',
    },
    {
      icon: Clock,
      title: 'Scaling & Payouts',
      description: 'How to scale from $10k to $200k accounts, optimize payout cycles, and build recurring funded income.',
    },
    {
      icon: Star,
      title: 'Multi-Firm Strategy',
      description: 'Running multiple challenges simultaneously — risk allocation, timing, and maximizing your funded portfolio.',
    },
  ];

  return (
    <section className="relative mt-20 mb-20">
      {/* Separator */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          {/* Coming soon badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Coming Soon — Early Bird Access
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Prop Firm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Mastery
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
            The advanced course for traders who want to go from passing one challenge to building a fully funded trading business.
          </p>

          {/* Price */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="flex items-baseline gap-2 justify-center">
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-gray-500 line-through text-xl">$499.99</span>
              </div>
              <p className="text-yellow-400 text-sm font-semibold mt-1">Early bird — waitlist only</p>
            </div>
          </div>
        </div>

        {/* Modules grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={i}
                className="relative bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/30 transition-colors group"
              >
                {/* Lock overlay */}
                <div className="absolute top-4 right-4">
                  <Lock className="w-4 h-4 text-gray-600 group-hover:text-yellow-500/50 transition-colors" />
                </div>

                <div className="p-2 bg-yellow-500/10 rounded-lg w-fit mb-4">
                  <Icon className="w-5 h-5 text-yellow-400" />
                </div>

                <h3 className="text-white font-semibold mb-2">{mod.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{mod.description}</p>
              </div>
            );
          })}
        </div>

        {/* Waitlist CTA box */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-yellow-500/20 rounded-2xl p-8 md:p-10 text-center">
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">
              Get early bird access at <span className="text-yellow-400">$199</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Join the waitlist. When we launch, you'll be first to know — and lock in the early bird price before it goes to $499.99.
            </p>

            <WaitlistForm />

            <p className="text-gray-600 text-xs mt-4">
              No spam. Just one email when the course launches.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
