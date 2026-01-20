'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-400 mb-8">
          Your payment was cancelled. No charges were made to your account.
          If you have any questions, feel free to reach out to our support.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/pricing"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Link>
          
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* FAQ / Support */}
        <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="flex items-start gap-3 text-left">
            <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300 font-medium mb-1">
                Having trouble?
              </p>
              <p className="text-sm text-gray-500">
                If you experienced any issues during checkout, please{' '}
                <Link href="/contact" className="text-emerald-400 hover:text-emerald-300">
                  contact us
                </Link>{' '}
                and we'll help you out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
