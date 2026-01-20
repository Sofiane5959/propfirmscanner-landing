import type { Metadata } from 'next'
import Link from 'next/link'
import { 
  AlertTriangle, CheckCircle, XCircle, Clock,
  ExternalLink, Bell, Shield, RefreshCw
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Prop Firm Status Tracker - Closures & Issues | PropFirm Scanner',
  description: 'Track prop firm status, closures, and reported issues. Stay informed about which firms are active, under review, or closed.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/status',
  },
}

interface FirmStatus {
  name: string
  slug: string
  status: 'active' | 'under-review' | 'closed' | 'warning'
  lastUpdated: string
  note?: string
  source?: string
}

const FIRM_STATUSES: FirmStatus[] = [
  // Active firms
  { name: 'FTMO', slug: 'ftmo', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'FundedNext', slug: 'fundednext', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'The5ers', slug: 'the5ers', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'Apex Trader Funding', slug: 'apex-trader-funding', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'Topstep', slug: 'topstep', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'MyFundedFX', slug: 'myfundedfx', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'FXIFY', slug: 'fxify', status: 'active', lastUpdated: '2025-12-27' },
  { name: 'E8 Funding', slug: 'e8-funding', status: 'active', lastUpdated: '2025-12-27' },
  
  // Under review / Warning
  { 
    name: 'Example Firm A', 
    slug: 'example-a', 
    status: 'under-review', 
    lastUpdated: '2025-12-20',
    note: 'Reports of delayed payouts. Under investigation.',
  },
  { 
    name: 'Example Firm B', 
    slug: 'example-b', 
    status: 'warning', 
    lastUpdated: '2025-12-15',
    note: 'Multiple complaints about rule changes. Exercise caution.',
  },
  
  // Closed
  { 
    name: 'My Forex Funds', 
    slug: 'my-forex-funds', 
    status: 'closed', 
    lastUpdated: '2023-09-01',
    note: 'Shut down by CFTC in September 2023.',
    source: 'https://www.cftc.gov',
  },
  { 
    name: 'True Forex Funds', 
    slug: 'true-forex-funds', 
    status: 'closed', 
    lastUpdated: '2023-11-01',
    note: 'Ceased operations in November 2023.',
  },
]

const STATUS_CONFIG = {
  'active': {
    icon: CheckCircle,
    label: 'Active',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Operating normally',
  },
  'under-review': {
    icon: Clock,
    label: 'Under Review',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    description: 'Being monitored for issues',
  },
  'warning': {
    icon: AlertTriangle,
    label: 'Warning',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    description: 'Exercise caution',
  },
  'closed': {
    icon: XCircle,
    label: 'Closed',
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
    description: 'No longer operating',
  },
}

export default function StatusPage() {
  const activeCount = FIRM_STATUSES.filter(f => f.status === 'active').length
  const reviewCount = FIRM_STATUSES.filter(f => f.status === 'under-review' || f.status === 'warning').length
  const closedCount = FIRM_STATUSES.filter(f => f.status === 'closed').length

  const groupedStatuses = {
    problems: FIRM_STATUSES.filter(f => f.status === 'under-review' || f.status === 'warning' || f.status === 'closed'),
    active: FIRM_STATUSES.filter(f => f.status === 'active'),
  }

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Prop Firm Status Tracker</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay informed about prop firm closures, issues, and warnings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">{activeCount}</div>
            <div className="text-emerald-400/70 text-sm">Active</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">{reviewCount}</div>
            <div className="text-yellow-400/70 text-sm">Under Review</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-400">{closedCount}</div>
            <div className="text-red-400/70 text-sm">Closed</div>
          </div>
        </div>

        {/* Alert Banner */}
        {reviewCount > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-yellow-400 font-semibold">Active Alerts</div>
              <p className="text-gray-300 text-sm">
                {reviewCount} firm(s) currently under review or with warnings. Check details below.
              </p>
            </div>
          </div>
        )}

        {/* Problems Section */}
        {groupedStatuses.problems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Issues & Closures
            </h2>
            <div className="space-y-3">
              {groupedStatuses.problems.map((firm) => {
                const config = STATUS_CONFIG[firm.status]
                const Icon = config.icon
                return (
                  <div
                    key={firm.slug}
                    className={`bg-gray-800/50 border rounded-xl p-4 ${config.color.split(' ')[2]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.color.split(' ')[1]}`}>
                          <Icon className={`w-5 h-5 ${config.color.split(' ')[0]}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{firm.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          {firm.note && (
                            <p className="text-gray-400 text-sm mt-1">{firm.note}</p>
                          )}
                          <div className="text-gray-500 text-xs mt-2">
                            Last updated: {new Date(firm.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {firm.source && (
                        <a
                          href={firm.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Active Firms */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Active & Verified ({activeCount})
          </h2>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-700">
              {groupedStatuses.active.map((firm) => (
                <Link
                  key={firm.slug}
                  href={`/prop-firm/${firm.slug}`}
                  className="bg-gray-800 p-4 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-sm font-medium">{firm.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Subscribe */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
          <Bell className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Get Status Alerts</h2>
          <p className="text-gray-400 mb-4">
            Subscribe to receive notifications when a prop firm&apos;s status changes.
          </p>
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Subscribe to Updates
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Status information updated weekly. Last check: December 27, 2025
          </p>
        </div>
      </div>
    </div>
  )
}
