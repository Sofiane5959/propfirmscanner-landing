// components/TrustBadge.tsx
// Affiche le statut de confiance d'une prop firm
// Statuts: verified | new | under_review | banned

import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'

type TrustStatus = 'verified' | 'new' | 'under_review' | 'banned'

interface TrustBadgeProps {
  status: TrustStatus
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const statusConfig = {
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/30',
    description: 'This prop firm has been verified by PropFirm Scanner'
  },
  new: {
    label: 'New',
    icon: Clock,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    description: 'This prop firm is new and still being monitored'
  },
  under_review: {
    label: 'Under Review',
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/30',
    description: 'This prop firm is under review due to reported issues'
  },
  banned: {
    label: 'Banned',
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/30',
    description: 'This prop firm has been banned due to confirmed issues'
  }
}

const sizeConfig = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 'w-3 h-3',
    gap: 'gap-1'
  },
  md: {
    padding: 'px-3 py-1',
    text: 'text-sm',
    icon: 'w-4 h-4',
    gap: 'gap-1.5'
  },
  lg: {
    padding: 'px-4 py-1.5',
    text: 'text-base',
    icon: 'w-5 h-5',
    gap: 'gap-2'
  }
}

export default function TrustBadge({ 
  status, 
  size = 'md', 
  showLabel = true,
  className = ''
}: TrustBadgeProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon

  return (
    <div 
      className={`
        inline-flex items-center ${sizeStyles.gap} ${sizeStyles.padding}
        ${config.bgColor} ${config.textColor} 
        border ${config.borderColor}
        rounded-full font-medium ${sizeStyles.text}
        ${className}
      `}
      title={config.description}
    >
      <Icon className={sizeStyles.icon} />
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}

// =====================================================
// Composant pour afficher dans les cards
// =====================================================
interface TrustBadgeCardProps {
  status: TrustStatus
  closedAt?: string | null
  closureReason?: string | null
}

export function TrustBadgeCard({ status, closedAt, closureReason }: TrustBadgeCardProps) {
  const config = statusConfig[status]

  if (status === 'verified') {
    return <TrustBadge status={status} size="sm" />
  }

  return (
    <div className={`p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
      <TrustBadge status={status} size="sm" />
      {status === 'banned' && closedAt && (
        <p className={`mt-2 text-xs ${config.textColor}`}>
          Closed: {new Date(closedAt).toLocaleDateString()}
          {closureReason && ` - ${closureReason}`}
        </p>
      )}
      {status === 'under_review' && (
        <p className={`mt-2 text-xs ${config.textColor}`}>
          ⚠️ Exercise caution - issues reported
        </p>
      )}
      {status === 'new' && (
        <p className={`mt-2 text-xs ${config.textColor}`}>
          🆕 New firm - limited track record
        </p>
      )}
    </div>
  )
}

// =====================================================
// Hook pour utiliser le statut
// =====================================================
export function useTrustStatus(status: TrustStatus) {
  return statusConfig[status]
}

// =====================================================
// Composant Tooltip avec détails
// =====================================================
interface TrustBadgeWithTooltipProps extends TrustBadgeProps {
  firmName: string
}

export function TrustBadgeWithTooltip({ 
  status, 
  firmName,
  ...props 
}: TrustBadgeWithTooltipProps) {
  const config = statusConfig[status]

  return (
    <div className="group relative inline-block">
      <TrustBadge status={status} {...props} />
      <div className="
        invisible group-hover:visible opacity-0 group-hover:opacity-100
        absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
        px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg
        text-xs text-gray-300 whitespace-nowrap
        transition-all duration-200
      ">
        {config.description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Liste des statuts pour filtres
// =====================================================
export const TRUST_STATUSES = [
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'under_review', label: 'Under Review', color: 'yellow' },
  { value: 'banned', label: 'Banned', color: 'red' }
] as const

export type { TrustStatus }
