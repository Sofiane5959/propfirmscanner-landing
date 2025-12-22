'use client';

import { useState } from 'react';

interface NewsletterProps {
  variant?: 'inline' | 'card' | 'footer';
  className?: string;
}

export default function Newsletter({ variant = 'card', className = '' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      setMessage('Welcome aboard! 🚀');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                     text-white placeholder:text-white/40 focus:outline-none 
                     focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                     transition-all duration-200"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold
                     rounded-lg transition-all duration-200 disabled:opacity-50 
                     disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
          Newsletter
        </h4>
        <p className="text-white/40 text-sm mb-4">
          Weekly prop firm updates & exclusive deals
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                       text-white placeholder:text-white/30 focus:outline-none 
                       focus:border-emerald-500/50 transition-all duration-200 text-sm"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 
                       hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-lg 
                       transition-all duration-200 disabled:opacity-50 text-sm"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`mt-2 text-xs transition-opacity duration-300 ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default: card variant (for homepage)
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 rounded-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative px-8 py-12 md:px-12 md:py-16 border border-white/10 rounded-2xl backdrop-blur-sm">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Ahead of the Market
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Get weekly updates on prop firm promotions, new challenges, 
            and exclusive discount codes. Join 2,000+ traders.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl
                           text-white placeholder:text-white/30 focus:outline-none 
                           focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10
                           transition-all duration-300"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold
                         rounded-xl transition-all duration-200 disabled:opacity-50 
                         disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20
                         hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </span>
              ) : status === 'success' ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Subscribed!
                </span>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </form>

          {message && status !== 'success' && (
            <p className={`mt-4 text-sm transition-opacity duration-300 ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
              {message}
            </p>
          )}

          <p className="mt-6 text-xs text-white/30">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
