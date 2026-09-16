'use client'

// 1. Hero : a gauche l'identite et la proposition de valeur, a droite la carte
//    commerciale. Les deux cartes s'etirent a la meme hauteur.

import type { ReactNode } from 'react'
import { ExternalLink, Star } from 'lucide-react'

import {
  type FirmSheet,
  type SheetPlan,
  type SheetProgramme,
  discounted,
  firmType,
  offerApplies,
  pct,
  sizeLabel,
} from '@/lib/firm-sheet'
import { planLeMoinsCher } from '@/lib/firm-profile'
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { COPY } from './copy'
import { prixPlan, prixRemise } from './format'
import { BTN_PRIMARY, BTN_SECONDARY, CARD, Container, EYEBROW, LABEL, PromoCode, cx } from './ui'

export function HeroSection({
  sheet,
  rating,
  logoHref,
  carte,
}: {
  sheet: FirmSheet
  rating: number | null
  logoHref: string
  carte: ReactNode
}) {
  // Le nom n'est repete en titre que si la fiche n'a pas de proposition de valeur.
  const titre = sheet.titre ?? sheet.nom

  return (
    <section className="pb-5 pt-6 sm:pt-8">
      <Container>
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div data-check="hero-left" className={cx(CARD, 'flex h-full flex-col gap-5 p-5 sm:p-6')}>
            <div className="flex items-center gap-3">
              <a
                href={logoHref}
                {...AFFILIATE_LINK_PROPS}
                aria-label={COPY.hero.logoLabel(sheet.nom, sheet.offre?.code ?? null)}
                className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-text-primary font-display text-xl font-bold text-bg-base transition-shadow hover:ring-2 hover:ring-accent"
              >
                {sheet.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sheet.logoUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  sheet.nom.charAt(0)
                )}
              </a>
              <div className="min-w-0">
                {sheet.titre && <p className="font-display text-lg font-bold leading-tight">{sheet.nom}</p>}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  {sheet.marches.length > 0 && (
                    <span className="font-medium text-accent">{COPY.hero.badge(firmType(sheet.marches))}</span>
                  )}
                  {/* La note vient de Trustpilot, pas de nous : la mention le dit. */}
                  {rating != null && rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-text-secondary">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-hidden="true" />
                      <span className="font-semibold text-text-primary">{rating.toFixed(1)}</span>
                      {COPY.hero.trustpilot}
                      <span className="rounded border border-border px-1 text-[10px] uppercase tracking-wide">
                        {COPY.hero.external}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-balance font-display text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
                {titre}
              </h1>
              {sheet.description && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">{sheet.description}</p>
              )}
            </div>

            {sheet.preuves.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
                {sheet.preuves.map((p) => (
                  <li key={p.libelle}>
                    <span className="font-semibold text-text-primary">{p.valeur}</span> {p.libelle}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex flex-wrap gap-3">
              <a href="#accounts" className={BTN_PRIMARY}>
                {COPY.hero.choose}
              </a>
              <a href="#rules" className={BTN_SECONDARY}>
                {COPY.hero.rules}
              </a>
            </div>
          </div>

          {carte}
        </div>
      </Container>
    </section>
  )
}

/**
 * La carte commerciale, unique : avec une offre, la remise, le code et
 * « Claim deal » ; sans offre, la note, le prix de depart et « Configure my
 * account ».
 */
export function CommercialCard({
  sheet,
  promo,
  rating,
  ctaHref,
}: {
  sheet: FirmSheet
  promo: { programme: SheetProgramme; plan: SheetPlan } | null
  rating: number | null
  ctaHref: string
}) {
  const offre = sheet.offre
  const base = cx(CARD, 'flex h-full flex-col gap-4 p-5 sm:p-6')

  if (!offre) {
    const moinsCher = planLeMoinsCher(sheet.programmes)
    return (
      <aside data-check="hero-right" className={base}>
        {rating != null && rating > 0 && (
          <p className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
            <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
            <span className="font-semibold text-text-primary">{rating.toFixed(1)}</span> {COPY.hero.trustpilot}
          </p>
        )}
        {moinsCher?.prix != null && (
          <div>
            <p className={LABEL}>{COPY.commercial.from}</p>
            <p className="mt-1 font-display text-4xl font-bold tabular-nums">{prixPlan(moinsCher.prix, moinsCher)}</p>
          </div>
        )}
        <a href="#accounts" className={cx(BTN_PRIMARY, 'mt-auto w-full')}>
          {COPY.commercial.configure}
        </a>
      </aside>
    )
  }

  // Meme calcul que le configurateur : les deux prix affiches ne peuvent pas diverger.
  const remise =
    promo && promo.plan.prix != null && offerApplies(offre, promo.programme.slug, promo.plan.taille)
      ? discounted(promo.plan.prix, offre.remise)
      : null

  return (
    <aside data-check="hero-right" className={cx(base, 'border-accent-border')}>
      {promo && (
        <div>
          <p className={EYEBROW}>{COPY.commercial.popular}</p>
          <p className="mt-1 font-display text-lg font-bold">
            {promo.programme.nom} · {sizeLabel(promo.plan.taille, promo.plan.devise)}
          </p>
        </div>
      )}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-display text-4xl font-bold uppercase leading-none text-accent">
          {pct(offre.remise)} {COPY.commercial.off}
        </p>
        {promo && remise != null && promo.plan.prix != null && (
          <p className="text-sm text-text-secondary tabular-nums">
            <span className="text-lg font-bold text-text-primary">
              {prixRemise(remise, promo.plan, offre)}
            </span>{' '}
            <span className="line-through">{prixPlan(promo.plan.prix, promo.plan)}</span>
          </p>
        )}
      </div>
      <div>
        <p className={cx(LABEL, 'mb-1.5')}>{COPY.commercial.code}</p>
        <PromoCode code={offre.code} label={COPY.copy.idle} />
      </div>
      <a data-check="claim-deal" href={ctaHref} {...AFFILIATE_LINK_PROPS} className={cx(BTN_PRIMARY, 'mt-auto w-full')}>
        {COPY.commercial.claim}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </aside>
  )
}
