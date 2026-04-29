import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — 2 variants. See DESIGN_SYSTEM.md §5.2.
 *
 * default  : border + bg-elevated
 * elevated : default + accent ring (use for "featured" cards, e.g. partner firms)
 *
 * Rules:
 * - No shadow by default. Hover changes border color, not transform/scale.
 * - One CTA primary maximum per card.
 */

type CardVariant = 'default' | 'elevated'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean // adds hover state (border color shift)
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-bg-elevated border border-border rounded-lg p-6',
  elevated:
    'bg-bg-elevated border border-border rounded-lg p-6 ring-1 ring-accent-border',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', interactive = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          interactive && 'transition-colors hover:border-border-hover',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'
