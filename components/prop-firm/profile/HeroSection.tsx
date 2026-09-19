'use client'

// 1. Hero — contrat visuel du 19 septembre 2026. Deux cartes de meme hauteur :
//    a gauche l'identite (Trustpilot dans l'angle), le titre, le resume et les
//    reperes Founded / Country / CEO ; a droite « Most popular plan ».
//    Le logo n'est pas un lien : les sorties passent par Claim deal et Continue to.

import { Star } from 'lucide-react'

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
import { COPY } from './copy'
import { prixPlan, prixRemise } from './format'
import { BTN_PRIMARY, BTN_SECONDARY, CARD, CARD_ACCENT, Container, EYEBROW, LABEL, PromoGroup, cx } from './ui'

export function HeroSection({
  sheet,
  promo,
  claimHref,
  continueHref,
}: {
  sheet: FirmSheet
  promo: { programme: SheetProgramme; plan: SheetPlan } | null
  claimHref: string
  continueHref: string
}) {
  // Le nom n'est repete en titre que si la fiche n'a pas de proposition de valeur.
  const titre = sheet.titre ?? sheet.nom
  const reperes = (
    [
      [COPY.hero.founded, sheet.anneeCreation != null ? String(sheet.anneeCreation) : null],
      [COPY.hero.country, sheet.pays],
      [COPY.hero.founder, sheet.ceoFondateur],
    ] as [string, string | null][]
  ).filter((r): r is [string, string] => Boolean(r[1]))
  const trustpilot = sheet.trustpilotScore != null && sheet.trustpilotScore > 0

  return (
    <section className="pb-5 pt-6 sm:pt-8">
      <Container>
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.9fr)]">
          <article data-check="hero-left" className={cx(CARD, 'relative flex h-full flex-col p-5 sm:p-6')}>
            <div className={cx('flex items-center gap-3', trustpilot && 'sm:pr-48')}>
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white p-1 font-display text-xl font-bold text-bg-base">
                {sheet.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sheet.logoUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  sheet.nom.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-tight">{sheet.nom}</p>
                {sheet.marches.length > 0 && (
                  <p className="text-sm text-accent">{COPY.hero.badge(firmType(sheet.marches))}</p>
                )}
              </div>
            </div>

            {trustpilot && (
              <a
                data-check="trustpilot"
                href={sheet.trustpilotUrl ?? undefined}
                target={sheet.trustpilotUrl ? '_blank' : undefined}
                rel={sheet.trustpilotUrl ? 'nofollow noopener noreferrer' : undefined}
                className="mt-4 block rounded-lg border border-accent-border bg-accent/10 px-3 py-2.5 transition-colors hover:border-accent sm:absolute sm:right-5 sm:top-5 sm:mt-0 sm:min-w-[158px] sm:text-right"
              >
                <p className={LABEL}>{COPY.hero.trustpilot}</p>
                <p className="text-lg font-bold tabular-nums">
                  {sheet.trustpilotScore!.toFixed(1)} <span className="text-sm font-medium text-text-muted">{COPY.hero.outOf}</span>
                </p>
                <p className="inline-flex items-center gap-1 text-xs text-warning">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={cx('h-3 w-3', i < Math.round(sheet.trustpilotScore!) ? 'fill-warning' : 'opacity-40')}
                    />
                  ))}
                  {sheet.trustpilotReviewCount != null && (
                    <span className="ml-1 text-text-muted">
                      {COPY.hero.reviews(new Intl.NumberFormat('en-US').format(sheet.trustpilotReviewCount))}
                    </span>
                  )}
                </p>
              </a>
            )}

            <h1 className="mt-5 max-w-3xl text-balance font-display text-[32px] font-bold leading-[1.08] tracking-tight text-text-primary sm:text-[42px]">
              {titre}
            </h1>
            {sheet.description && (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-[17px]">{sheet.description}</p>
            )}

            {(reperes.length > 0 || sheet.preuves.length > 0) && (
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
                {reperes.map(([label, valeur]) => (
                  <li key={label}>
                    {label} <span className="font-semibold text-text-primary">{valeur}</span>
                  </li>
                ))}
                {sheet.preuves.map((p) => (
                  <li key={p.libelle}>
                    <span className="font-semibold text-text-primary">{p.valeur}</span> {p.libelle}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex flex-col gap-2.5 pt-5 sm:flex-row">
              <a href="#accounts" className={BTN_PRIMARY}>
                {COPY.hero.choose}
              </a>
              <a href="#rules" className={BTN_SECONDARY}>
                {COPY.hero.rules}
              </a>
            </div>
          </article>

          <CommercialCard sheet={sheet} promo={promo} claimHref={claimHref} continueHref={continueHref} />
        </div>
      </Container>
    </section>
  )
}

/**
 * « Most popular plan » : le plan designe dans le tableur, son prix, la remise,
 * le code et les deux sorties. Sans offre : le prix de depart et Continue to.
 */
function CommercialCard({
  sheet,
  promo,
  claimHref,
  continueHref,
}: {
  sheet: FirmSheet
  promo: { programme: SheetProgramme; plan: SheetPlan } | null
  claimHref: string
  continueHref: string
}) {
  const offre = sheet.offre
  const plan = promo?.plan ?? planLeMoinsCher(sheet.programmes)
  const applique = Boolean(offre && promo && offerApplies(offre, promo.programme.slug, promo.plan.taille))
  const remise = offre && applique && plan?.prix != null ? discounted(plan.prix, offre.remise) : null

  return (
    <aside data-check="hero-right" className={cx(CARD_ACCENT, 'flex h-full flex-col justify-center gap-3 p-5 text-center sm:p-6')}>
      <div>
        <p className={EYEBROW}>{promo ? COPY.commercial.popular : COPY.commercial.from}</p>
        {promo && (
          <h2 className="mt-1.5 font-display text-xl font-bold">
            {promo.programme.nom} · {sizeLabel(promo.plan.taille, promo.plan.devise)}
          </h2>
        )}
      </div>

      {offre && applique && (
        <p className="font-display text-[40px] font-bold uppercase leading-none text-accent">
          {pct(offre.remise)} {COPY.commercial.off}
        </p>
      )}

      {plan?.prix != null && (
        <p className="tabular-nums text-text-muted">
          {offre && remise != null ? (
            <>
              <span className="text-2xl font-bold text-text-primary">{prixRemise(remise, plan, offre)}</span>{' '}
              <span className="line-through">{prixPlan(plan.prix, plan)}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-text-primary">{prixPlan(plan.prix, plan)}</span>
          )}
        </p>
      )}

      <div className="text-left">
        <PromoGroup
          code={offre ? offre.code : null}
          claimHref={offre ? claimHref : null}
          continueHref={continueHref}
          continueLabel={COPY.commercial.continueTo(sheet.nom)}
        />
      </div>
    </aside>
  )
}
