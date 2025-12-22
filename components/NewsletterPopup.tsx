'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem('newsletter_popup_dismissed');
    const subscribed = localStorage.getItem('newsletter_subscribed');
    
    if (dismissed || subscribed) {
      return;
    }

    // Affiche après 10 secondes
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_popup_dismissed', Date.now().toString());
  };

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
      localStorage.setItem('newsletter_subscribed', 'true');
      
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Don&apos;t Miss Out! 🔥
        </h3>
        <p className="text-gray-400 text-center mb-6">
          Get exclusive discount codes, new prop firm alerts, and weekly market insights. Join 5,000+ traders!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl
                       text-white placeholder:text-gray-500 focus:outline-none 
                       focus:border-emerald-500 transition-all"
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-700 
                       text-white font-semibold rounded-xl hover:opacity-90 
                       transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 
             status === 'success' ? '✓ Subscribed!' : 
             'Get Free Updates'}
          </button>
        </form>

        {message && status === 'error' && (
          <p className="mt-3 text-sm text-red-400 text-center">{message}</p>
        )}

        <p className="mt-4 text-xs text-gray-500 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
