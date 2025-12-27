'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-[150px] font-bold text-gray-800 leading-none select-none">
            404
          </div>
          <div className="text-emerald-400 text-xl font-semibold -mt-4">
            Page Not Found
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Oops! This page doesn&apos;t exist
        </h1>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for might have been moved, deleted, 
          or maybe it never existed. Let&apos;s get you back on track.
        </p>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/compare"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Compare Firms
          </Link>
        </div>

        {/* Popular Links */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Popular Pages
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/compare" className="text-gray-400 hover:text-emerald-400 py-1">
              Compare Prop Firms
            </Link>
            <Link href="/deals" className="text-gray-400 hover:text-emerald-400 py-1">
              Deals & Discounts
            </Link>
            <Link href="/quick-match" className="text-gray-400 hover:text-emerald-400 py-1">
              Quick Match Quiz
            </Link>
            <Link href="/blog" className="text-gray-400 hover:text-emerald-400 py-1">
              Blog
            </Link>
            <Link href="/tools/risk-calculator" className="text-gray-400 hover:text-emerald-400 py-1">
              Risk Calculator
            </Link>
            <Link href="/tools/rule-tracker" className="text-gray-400 hover:text-emerald-400 py-1">
              Rule Tracker
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  )
}
