import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Heading — semantic heading with optional eyebrow and display variant.
 *
 * Levels:
 *   1 = H1 (one per page max)
 *   2 = H2 (section titles)
 *   3 = H3 (card titles, sub-sections)
 *
 * `display` prop on level 1 upgrades to text-display (use ONCE per page, hero only).
 * `eyebrow` prop adds a small uppercase accent label above the heading.
 *
 * Example:
 *   <Heading level={1} eyebrow="Compare prop firms">Find your perfect match</Heading>
 *
 * The display font (Space Grotesk) is applied automatically via globals.css.
 */

type HeadingLevel = 1 | 2 | 3

interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> {
  level: HeadingLevel
  display?: boolean
  eyebrow?: string
  children: React.ReactNode
  /** Adds bottom margin for typical section header layout */
  withSubtitle?: boolean
}

const levelStyles: Record<HeadingLevel, string> = {
  1: 'text-h1',
  2: 'text-h2',
  3: 'text-h3',
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level,
      display = false,
      eyebrow,
      withSubtitle = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
    const sizeClass = display && level === 1 ? 'text-display' : levelStyles[level]

    return (
      <div className={cn(withSubtitle && 'mb-4')}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Tag
          ref={ref}
          className={cn('text-text-primary', sizeClass, className)}
          {...props}
        >
          {children}
        </Tag>
      </div>
    )
  }
)
Heading.displayName = 'Heading'
