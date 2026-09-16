'use client'

import { CheckCircle, ExternalLink, Info } from 'lucide-react'
import { VERIFICATION_INFO, formatVerifiedDate } from '@/lib/constants'

interface LastVerifiedBadgeProps {
  date?: string
  source?: string
  sourceUrl?: string
  compact?: boolean
  className?: string
}

export function LastVerifiedBadge({ 
  date = VERIFICATION_INFO.LAST_VERIFIED_DATE,
  source = VERIFICATION_INFO.DATA_SOURCE,
  sourceUrl,
  compact = false,
  className = ''
}: LastVerifiedBadgeProps) {
  const formattedDate = formatVerifiedDate(date)
  
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-text-secondary ${className}`}>
        <CheckCircle className="w-3 h-3 text-accent" />
        <span>Verified {formattedDate}</span>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/20 rounded-lg ${className}`}>
      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
      <div className="text-sm">
        <span className="text-text-secondary">Last verified: </span>
        <span className="text-white font-medium">{formattedDate}</span>
        {source && (
          <>
            <span className="text-text-muted mx-1">•</span>
            {sourceUrl ? (
              <a 
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-1"
              >
                {source}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-text-secondary">{source}</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface TrustpilotBadgeProps {
  rating: number
  reviews: number
  firmName: string
  trustpilotUrl?: string
  snapshotDate?: string
  className?: string
}

export function TrustpilotBadge({
  rating,
  reviews,
  firmName,
  trustpilotUrl,
  snapshotDate = VERIFICATION_INFO.LAST_VERIFIED_DATE,
  className = ''
}: TrustpilotBadgeProps) {
  const formattedDate = formatVerifiedDate(snapshotDate)
  const defaultUrl = `https://www.trustpilot.com/review/${firmName.toLowerCase().replace(/\s+/g, '')}.com`
  const url = trustpilotUrl || defaultUrl
  
  return (
    <div className={`bg-dark-700/50 border border-border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-accent' : 'text-text-muted'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-white font-semibold">{rating.toFixed(1)}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline text-sm flex items-center gap-1"
        >
          Trustpilot
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          {reviews > 0 ? `${reviews.toLocaleString()} reviews` : 'Not enough data'}
        </span>
        <span className="text-text-muted text-xs">
          Snapshot: {formattedDate}
        </span>
      </div>
    </div>
  )
}

interface FirmStatusBadgeProps {
  status: 'active' | 'under-review' | 'rebranded' | 'closed' | 'new'
  className?: string
}

export function FirmStatusBadge({ status, className = '' }: FirmStatusBadgeProps) {
  const statusConfig = {
    'active': {
      label: 'Active',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent',
      borderColor: 'border-accent/20'
    },
    'under-review': {
      label: 'Under Review',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20'
    },
    'rebranded': {
      label: 'Rebranded',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    'closed': {
      label: 'Closed',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/20'
    },
    'new': {
      label: 'New',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20'
    }
  }
  
  const config = statusConfig[status]
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.textColor.replace('text-', 'bg-')}`}></span>
      {config.label}
    </span>
  )
}

interface DataSourceInfoProps {
  sources: Array<{
    name: string
    url?: string
    lastChecked?: string
  }>
  className?: string
}

export function DataSourceInfo({ sources, className = '' }: DataSourceInfoProps) {
  return (
    <div className={`text-xs text-text-muted ${className}`}>
      <div className="flex items-center gap-1 mb-1">
        <Info className="w-3 h-3" />
        <span>Data sources:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <span key={index}>
            {source.url ? (
              <a 
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent hover:underline"
              >
                {source.name}
              </a>
            ) : (
              <span className="text-text-secondary">{source.name}</span>
            )}
            {source.lastChecked && (
              <span className="text-text-muted ml-1">
                ({formatVerifiedDate(source.lastChecked)})
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
