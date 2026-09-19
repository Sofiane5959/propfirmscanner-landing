'use client'

// Briques visuelles de la page firme. Toutes les couleurs passent par les
// jetons du site (tailwind.config.js : bg, border, text, accent, warning) :
// aucune valeur hexadecimale ici ni dans les sections.

import { useState, type ReactNode } from 'react'
import { AlertTriangle, ExternalLink, Minus } from 'lucide-react'

import type { Cellule, StatutManquant } from '@/lib/firm-profile'
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { COPY } from './copy'

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base'

export const BTN = cx(
  'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition',
  FOCUS
)
// Palette 2c : fond accent-hover et texte blanc (l'accent clair sert au texte).
export const BTN_PRIMARY = cx(BTN, 'bg-accent-hover text-white hover:brightness-110')
export const BTN_SECONDARY = cx(BTN, 'border border-border bg-dark-700 text-text-primary hover:border-border-hover')
export const CARD = 'rounded-xl border border-border bg-bg-elevated'
export const CARD_ACCENT = 'rounded-xl border border-accent-border bg-bg-elevated'
export const EYEBROW = 'text-xs font-semibold uppercase tracking-wider text-accent'
// Sur-titre de section : plus present que l'eyebrow des cartes (commentaire du 19/09).
const EYEBROW_SECTION = 'inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-accent'
export const LABEL = 'text-[11px] font-semibold uppercase tracking-wider text-text-muted'
export const CHIP = 'rounded-md border border-border bg-bg-base px-2 py-1 text-xs text-text-secondary'
export const CHOICE = cx('flex flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors', FOCUS)
export const CHOICE_IDLE = 'border-border bg-bg-base hover:border-border-hover'
export const CHOICE_ACTIVE = 'border-accent bg-accent/10'

// Meme largeur que les autres fiches (PropFirmPageClient) : contenu de
// max-w-6xl (1152 px), marge laterale a l'exterieur de cette largeur.
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="px-4">
      <div className={cx('mx-auto w-full max-w-6xl', className)}>{children}</div>
    </div>
  )
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
    <section id={id} aria-labelledby={labelledBy} className={cx('py-5 sm:py-6', id && 'scroll-mt-36', className)}>
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
      {eyebrow && (
        <p className={EYEBROW_SECTION}>
          <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-accent" />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="mt-1.5 text-balance font-display text-[26px] font-bold leading-tight tracking-tight text-text-primary sm:text-[34px]">
        {title}
      </h2>
      {intro && <p className="mt-1 max-w-2xl text-sm text-text-muted sm:text-base">{intro}</p>}
    </div>
  )
}

/** Un statut a la place d'une valeur. Les deux statuts qui appellent la prudence sont en ambre. */
export function StatusBadge({ statut }: { statut: StatutManquant | 'confirmed' }) {
  const alerte = statut === 'needs_confirmation' || statut === 'source_conflict'
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium',
        alerte ? 'bg-warning-subtle text-warning' : 'bg-bg-base text-text-muted'
      )}
    >
      {alerte && <AlertTriangle className="h-3 w-3" aria-hidden="true" />}
      {statut === 'not_published' || statut === 'not_applicable' ? <Minus className="h-3 w-3" aria-hidden="true" /> : null}
      {COPY.statut[statut]}
    </span>
  )
}

export function Valeur({ cellule }: { cellule: Cellule }) {
  return cellule.statut ? <StatusBadge statut={cellule.statut} /> : <>{cellule.texte}</>
}

/**
 * Le code et son bouton copient tous les deux : on clique d'abord sur le code
 * lui-meme. Le retour (« Copied ») s'affiche sur le bouton.
 */
function CodeCopiable({ code }: { code: string }) {
  const [texte, setTexte] = useState<string>(COPY.copy.idle)
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setTexte(COPY.copy.done)
      setTimeout(() => setTexte(COPY.copy.idle), 1300)
    } catch {
      setTexte(COPY.copy.failed)
    }
  }
  return (
    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-[minmax(0,1fr)_auto]">
      <button
        type="button"
        data-check="promo-code"
        onClick={copier}
        aria-label={`${COPY.copy.idle}: ${code}`}
        title={COPY.copy.idle}
        className={cx(
          'flex cursor-copy items-center justify-center rounded-lg border border-accent bg-accent/10 px-3 py-2.5 font-mono text-lg font-bold tracking-[0.12em] text-accent transition-colors hover:bg-accent/20',
          FOCUS
        )}
      >
        {code}
      </button>
      <button
        type="button"
        onClick={copier}
        aria-live="polite"
        className={cx(BTN, 'min-w-[112px] border border-accent-border bg-accent/10 text-accent hover:bg-accent/20')}
      >
        {texte}
      </button>
    </div>
  )
}

/**
 * Le groupe commercial, identique partout (hero, configurateur, CTA final) :
 * code bien visible + Copy code, puis les sorties. Aucun vide entre eux.
 */
export function PromoGroup({
  code,
  claimHref,
  continueHref,
  continueLabel,
}: {
  code: string | null
  claimHref: string | null
  continueHref: string
  continueLabel: string
}) {
  return (
    <div className="grid gap-2.5">
      {code && (
        <div>
          <p className={cx(LABEL, 'mb-1.5')}>{COPY.commercial.code}</p>
          <CodeCopiable code={code} />
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        {claimHref && (
          <a data-check="claim-deal" href={claimHref} {...AFFILIATE_LINK_PROPS} className={cx(BTN_PRIMARY, 'flex-1')}>
            {COPY.commercial.claim}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
        <a
          data-check="continue-to"
          href={continueHref}
          {...AFFILIATE_LINK_PROPS}
          className={cx(claimHref ? BTN_SECONDARY : BTN_PRIMARY, 'flex-1')}
        >
          {continueLabel}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
