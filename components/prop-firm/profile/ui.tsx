'use client'

// Briques visuelles de la page firme. Toutes les couleurs passent par les
// jetons du site (tailwind.config.js : bg, border, text, accent, warning) :
// aucune valeur hexadecimale ici ni dans les sections.

import { useState, type ReactNode } from 'react'
import { AlertTriangle, Minus } from 'lucide-react'

import type { Cellule, StatutManquant } from '@/lib/firm-profile'
import { COPY } from './copy'

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base'

export const BTN_PRIMARY = cx(
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-hover',
  FOCUS
)
export const BTN_SECONDARY = cx(
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-hover',
  FOCUS
)
export const CARD = 'rounded-xl border border-border bg-bg-elevated'
export const EYEBROW = 'text-xs font-semibold uppercase tracking-wider text-accent'
export const LABEL = 'text-xs font-semibold uppercase tracking-wider text-text-secondary'
export const CHIP = 'rounded-md border border-border bg-bg-base px-2 py-1 text-xs text-text-primary'
export const CHOICE = cx(
  'flex flex-col gap-0.5 rounded-lg border px-4 py-3 text-left transition-colors',
  FOCUS
)
export const CHOICE_IDLE = 'border-border bg-bg-base hover:border-border-hover'
export const CHOICE_ACTIVE = 'border-accent bg-accent-subtle'

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}>{children}</div>
}

export function Section({
  id,
  children,
  className,
  labelledBy,
}: {
  id?: string
  children: ReactNode
  className?: string
  labelledBy?: string
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx('py-7 sm:py-9', id && 'scroll-mt-36', className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string
  eyebrow?: string
  title: string
  intro?: string
}) {
  return (
    <div className="mb-5">
      {eyebrow && <p className={EYEBROW}>{eyebrow}</p>}
      <h2 id={id} className="mt-1 text-balance font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {title}
      </h2>
      {intro && <p className="mt-1.5 max-w-2xl text-sm text-text-secondary sm:text-base">{intro}</p>}
    </div>
  )
}

/** Un statut a la place d'une valeur. Les deux statuts qui appellent la prudence sont en ambre. */
export function StatusBadge({ statut }: { statut: StatutManquant }) {
  const alerte = statut === 'needs_confirmation' || statut === 'source_conflict'
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
        alerte ? 'bg-warning-subtle text-warning' : 'bg-bg-base text-text-secondary'
      )}
    >
      {alerte ? <AlertTriangle className="h-3 w-3" aria-hidden="true" /> : <Minus className="h-3 w-3" aria-hidden="true" />}
      {COPY.statut[statut]}
    </span>
  )
}

export function Valeur({ cellule }: { cellule: Cellule }) {
  return cellule.statut ? <StatusBadge statut={cellule.statut} /> : <>{cellule.texte}</>
}

export function CopyButton({ code, label }: { code: string; label: string }) {
  const [texte, setTexte] = useState(label)
  return (
    <button
      type="button"
      className={BTN_SECONDARY}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setTexte(COPY.copy.done)
          setTimeout(() => setTexte(label), 1300)
        } catch {
          setTexte(COPY.copy.failed)
        }
      }}
    >
      {texte}
    </button>
  )
}

export function PromoCode({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-stretch gap-2">
      <code
        data-check="promo-code"
        className="flex flex-1 items-center rounded-lg border border-dashed border-accent-border bg-bg-base px-3 py-2 font-mono text-lg font-bold tracking-widest text-text-primary"
      >
        {code}
      </code>
      <CopyButton code={code} label={label} />
    </div>
  )
}
