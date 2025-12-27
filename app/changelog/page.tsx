import type { Metadata } from 'next'
import { 
  Clock, Plus, Zap, Bug, Shield, Star, 
  ArrowUpRight, Bell
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog & Updates | PropFirm Scanner',
  description: 'See what\'s new on PropFirm Scanner. Latest features, improvements, and bug fixes.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/changelog',
  },
}

interface ChangelogEntry {
  version: string
  date: string
  title: string
  type: 'feature' | 'improvement' | 'fix' | 'security'
  changes: {
    type: 'new' | 'improved' | 'fixed'
    description: string
  }[]
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.5.0',
    date: '2025-12-27',
    title: 'Quick Match & FAQ',
    type: 'feature',
    changes: [
      { type: 'new', description: 'Quick Match quiz - find your perfect prop firm in 3 questions' },
      { type: 'new', description: 'Comprehensive FAQ page with search functionality' },
      { type: 'new', description: 'Contact page with form' },
      { type: 'new', description: 'About Us page' },
      { type: 'improved', description: 'Better loading states with skeleton components' },
      { type: 'improved', description: 'Social sharing buttons on all articles' },
    ],
  },
  {
    version: '2.4.0',
    date: '2025-12-26',
    title: 'Transparency & Tools',
    type: 'feature',
    changes: [
      { type: 'new', description: '"How We Verify Data" transparency page' },
      { type: 'new', description: '"How We Make Money" affiliate disclosure page' },
      { type: 'new', description: 'Rule Tracker tool for challenge management' },
      { type: 'improved', description: 'Risk Calculator with presets and better UX' },
      { type: 'improved', description: 'Deals page with filters and search' },
      { type: 'fixed', description: 'Review count showing "0" instead of "Not tracked"' },
    ],
  },
  {
    version: '2.3.0',
    date: '2025-12-20',
    title: 'Legal & Compliance',
    type: 'security',
    changes: [
      { type: 'new', description: 'Privacy Policy page' },
      { type: 'new', description: 'Terms of Service page' },
      { type: 'new', description: 'Cookie consent banner (GDPR compliant)' },
      { type: 'improved', description: 'Footer with all legal links' },
    ],
  },
  {
    version: '2.2.0',
    date: '2025-12-15',
    title: 'Comparison Improvements',
    type: 'improvement',
    changes: [
      { type: 'new', description: '15 new prop firm vs prop firm comparison pages' },
      { type: 'improved', description: 'Visual badges for trading rules (News, Weekend, EA)' },
      { type: 'improved', description: 'Drawdown type indicators (Static vs Trailing)' },
      { type: 'improved', description: 'Platform badges with colors' },
    ],
  },
  {
    version: '2.1.0',
    date: '2025-12-10',
    title: 'Database Expansion',
    type: 'feature',
    changes: [
      { type: 'new', description: 'Added 35 new prop trading firms' },
      { type: 'new', description: 'Now tracking 90+ firms total' },
      { type: 'improved', description: 'Updated all pricing data' },
      { type: 'improved', description: 'Refreshed Trustpilot ratings' },
    ],
  },
  {
    version: '2.0.0',
    date: '2025-11-01',
    title: 'Major Redesign',
    type: 'feature',
    changes: [
      { type: 'new', description: 'Complete UI redesign with dark theme' },
      { type: 'new', description: 'Compare page with advanced filtering' },
      { type: 'new', description: 'Individual prop firm profile pages' },
      { type: 'new', description: 'Blog section with trading guides' },
      { type: 'improved', description: 'Mobile-first responsive design' },
      { type: 'improved', description: 'Faster page load times' },
    ],
  },
]

const TYPE_CONFIG = {
  feature: { icon: Plus, color: 'text-emerald-400 bg-emerald-500/10' },
  improvement: { icon: Zap, color: 'text-blue-400 bg-blue-500/10' },
  fix: { icon: Bug, color: 'text-yellow-400 bg-yellow-500/10' },
  security: { icon: Shield, color: 'text-purple-400 bg-purple-500/10' },
}

const CHANGE_TYPE_CONFIG = {
  new: { label: 'New', color: 'bg-emerald-500/10 text-emerald-400' },
  improved: { label: 'Improved', color: 'bg-blue-500/10 text-blue-400' },
  fixed: { label: 'Fixed', color: 'bg-yellow-500/10 text-yellow-400' },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Clock className="w-4 h-4" />
            Changelog
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">What&apos;s New</h1>
          <p className="text-xl text-gray-400">
            Latest updates, features, and improvements to PropFirm Scanner
          </p>
        </div>

        {/* Subscribe to Updates */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-semibold mb-1">Stay Updated</h2>
              <p className="text-gray-400 text-sm">
                Get notified when we add new features or prop firms.
              </p>
            </div>
            <Link
              href="/guide"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm"
            >
              Subscribe
            </Link>
          </div>
        </div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {CHANGELOG.map((entry, index) => {
            const typeConfig = TYPE_CONFIG[entry.type]
            const TypeIcon = typeConfig.icon

            return (
              <article
                key={entry.version}
                className="relative pl-8 pb-8 border-l-2 border-gray-700 last:border-l-0 last:pb-0"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center ${typeConfig.color}`}>
                  <TypeIcon className="w-3 h-3" />
                </div>

                {/* Version Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-gray-800 text-white font-mono text-sm rounded-lg">
                    v{entry.version}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">
                      Latest
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-4">{entry.title}</h2>

                {/* Changes */}
                <ul className="space-y-2">
                  {entry.changes.map((change, changeIndex) => {
                    const changeConfig = CHANGE_TYPE_CONFIG[change.type]
                    return (
                      <li key={changeIndex} className="flex items-start gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${changeConfig.color}`}>
                          {changeConfig.label}
                        </span>
                        <span className="text-gray-300 text-sm">{change.description}</span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Have a feature request or found a bug?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700"
          >
            Contact Us
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
