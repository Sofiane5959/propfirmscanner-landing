import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Button — 3 variants, 2 sizes. See DESIGN_SYSTEM.md §5.1.
 *
 * For NEXT.JS LINK or anchor tags, use `buttonVariants()` to get the className:
 *
 *   <Link href="..." className={buttonVariants({ variant: 'primary' })}>...</Link>
 *   <a href="..." className={buttonVariants({ variant: 'secondary', size: 'lg' })}>...</a>
 *
 * Rule: maximum 1 PRIMARY button per card / per section. See DESIGN_SYSTEM.md §10.
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:pointer-events-none'

const variantClasses: Record<ButtonVariant, string> = {
  // Action = ambre (--accent-btn #F59E0B) + texte sombre --on-accent : 8,5:1
  // dans les deux themes. Jamais de texte blanc sur l'ambre (moins de 2:1).
  primary: 'bg-accent-hover text-on-accent hover:bg-accent-hover/90',
  secondary:
    'bg-bg-elevated text-text-primary border border-border-hover hover:border-text-primary',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-[44px] px-4 py-2 text-small font-semibold',
  lg: 'min-h-[50px] px-6 py-3 text-body font-bold',
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
}: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size])
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
