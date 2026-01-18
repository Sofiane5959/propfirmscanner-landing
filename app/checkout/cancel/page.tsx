'use client';

import Link from 'next/link';
import { XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-10 h-10 text-orange-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">
          No worries! Your payment was cancelled and you haven&apos;t been charged. 
          You can try again whenever you&apos;re ready.
        </p>

        {/* Benefits Reminder */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">What you&apos;re missing with Pro:</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Advanced analytics dashboard</li>
            <li>• Rule violation alerts</li>
            <li>• Performance reports</li>
            <li>• Trade journal</li>
            <li>• Unlimited account tracking</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/mypropfirm"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Use Free Tools
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-gray-500 text-sm mt-8">
          Have questions? <Link href="/contact" className="text-emerald-400 hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
