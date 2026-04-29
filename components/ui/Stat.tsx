import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Stat — TradingView-style data point display.
 *
 * Use on /compare, /prop-firm/[slug], /payouts, /admin/analytics — anywhere
 * a numeric value matters. Uses JetBrains Mono for tabular numerics.
 *
 * Example:
 *   <Stat label="Total Paid Out" value="$2.4M" change="+12%" />
 *   <Stat label="Min Price" value="$99" />
 *   <Stat label="Profit Split" value="90%" change="+10% Pro" size="lg" />
 *
 * `change` is colored:
 *   - emerald if starts with "+"
 *   - red if starts with "-"
 *   - text-muted otherwise
 *
 * Don't put more than 4 stats in a single row — readability tanks beyond that.
 */

interface StatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  label: string
  value: string | number
  change?: string
  size?: 'md' | 'lg'
  hint?: string
}

const valueSize = {
  md: 'text-h3',
  lg: 'text-h2',
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(
  ({ label, value, change, size = 'md', hint, className, ...props }, ref) => {
    const changeColor =
      typeof change === 'string'
        ? change.startsWith('+')
          ? 'text-accent'
          : change.startsWith('-')
          ? 'text-danger'
          : 'text-text-muted'
        : 'text-text-muted'

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        <span className="text-tiny text-text-secondary uppercase tracking-wider font-medium">
          {label}
        </span>
        <span
          className={cn(
            'font-mono text-text-primary tabular-nums',
            valueSize[size]
          )}
        >
          {value}
        </span>
        {change && (
          <span className={cn('text-small font-mono tabular-nums', changeColor)}>
            {change}
          </span>
        )}
        {hint && (
          <span className="text-tiny text-text-muted mt-0.5">{hint}</span>
        )}
      </div>
    )
  }
)
Stat.displayName = 'Stat'
