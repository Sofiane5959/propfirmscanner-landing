import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Badge — 4 variants. See DESIGN_SYSTEM.md §5.3.
 *
 * accent  : "Top 10", "Partner", "Featured"
 * neutral : "Verified", category labels
 * warning : "At risk" (drawdown approaching)
 * danger  : "Not recommended", "Closed"
 *
 * All badges: uppercase, tracking-wider. Stay restrained.
 */

type BadgeVariant = 'accent' | 'neutral' | 'warning' | 'danger'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  accent: 'bg-accent-subtle text-accent border-accent-border',
  neutral: 'bg-bg-elevated text-text-secondary border-border',
  warning: 'bg-warning-subtle text-warning border-warning/20',
  danger: 'bg-danger-subtle text-danger border-danger/20',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 text-tiny font-medium rounded-md border uppercase tracking-wider',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Badge.displayName = 'Badge'
