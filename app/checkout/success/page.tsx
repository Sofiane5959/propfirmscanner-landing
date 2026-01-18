'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2, Crown } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (sessionId) {
      // Optionnel: Vérifier la session côté serveur
      // Pour l'instant, on affiche juste le succès
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-400 mb-8">
            We couldn&apos;t verify your payment. Please contact support if you were charged.
          </p>
          <Link
            href="/mypropfirm"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to <span className="text-emerald-400">Pro</span>! 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          Your payment was successful. You now have access to all premium features including advanced analytics, rule violation alerts, and more.
        </p>

        {/* What's Next */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">What&apos;s next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">Access your advanced dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">Set up drawdown alerts</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">Start tracking your accounts</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-gray-500 text-sm mt-8">
          Need help? <Link href="/contact" className="text-emerald-400 hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  );
}
