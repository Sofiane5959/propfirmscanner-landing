import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Container — standard max-w-7xl wrapper with horizontal padding.
 * Use inside <Section> or as a direct page wrapper.
 *
 * If you ever need to expand to 8xl/full for unusual layouts, use the `size` prop.
 */

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

const sizeClasses = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          sizeClasses[size],
          'mx-auto px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = 'Container'
