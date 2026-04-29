import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Section — page section wrapper with standardized vertical padding.
 *
 * 3 sizes only. See DESIGN_SYSTEM.md §4.
 *   compact   = 48px  py — dense lists, comparatives
 *   default   = 80px  py — standard sections
 *   spacious  = 128px py — hero, key sections
 *
 * `bg` controls background:
 *   base     = #0A0A0B (page bg, default)
 *   elevated = #131316 (slight contrast section, use sparingly)
 *
 * Pair with <Container> inside for the actual content layout.
 */

type SectionSize = 'compact' | 'default' | 'spacious'
type SectionBg = 'base' | 'elevated'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: SectionSize
  bg?: SectionBg
  as?: 'section' | 'div' | 'header' | 'footer'
}

const sizeClasses: Record<SectionSize, string> = {
  compact: 'py-section-compact',
  default: 'py-section-default',
  spacious: 'py-section-spacious',
}

const bgClasses: Record<SectionBg, string> = {
  base: 'bg-bg-base',
  elevated: 'bg-bg-elevated',
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    { size = 'default', bg = 'base', as: Component = 'section', className, ...props },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(sizeClasses[size], bgClasses[bg], className)}
        {...props}
      />
    )
  }
)
Section.displayName = 'Section'
