'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-hover hover:brightness-110 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            Compare Firms
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    </div>
  )
}
