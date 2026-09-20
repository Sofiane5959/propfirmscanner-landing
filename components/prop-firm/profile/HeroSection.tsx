'use client'

// 1. Hero — contrat visuel du 19 septembre 2026. Deux cartes de meme hauteur :
//    a gauche l'identite (Trustpilot dans l'angle), le titre, le resume et les
//    reperes Founded / Country / CEO ; a droite « Most popular plan ».
//    Le logo n'est pas un lien : les sorties passent par Claim deal et Continue to.

import type { ReactNode } from 'react'
import { ChevronDown, Star } from 'lucide-react'

import {
  type FirmSheet,
  type SheetPlan,
  type SheetProgramme,
  discounted,
  firmType,
  offerApplies,
  paragraphs,
  pct,
  sizeLabel,
} from '@/lib/firm-sheet'
import { planLeMoinsCher } from '@/lib/firm-profile'
import { COPY } from './copy'
import { FirmActions } from './FirmActions'
import { prixPlan, prixRemise } from './format'
import { BTN_PRIMARY, BTN_SECONDARY, CARD, CARD_ACCENT, Container, EYEBROW, LABEL, PromoGroup, cx } from './ui'

const TRUSTPILOT_BADGE = 'mt-3 inline-block sm:absolute sm:right-6 sm:top-6 sm:mt-0 sm:text-right'

/** La note Trustpilot : un lien vers le profil quand la fiche en donne un. */
function TrustpilotBadge({ url, children }: { url: string | null; children: ReactNode }) {
  if (!url) {
    return (
      <div data-check="trustpilot" className={TRUSTPILOT_BADGE}>
        {children}
      </div>
    )
  }
  return (
    <a
      data-check="trustpilot"
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={cx(TRUSTPILOT_BADGE, 'transition-opacity hover:opacity-80')}
    >
      {children}
    </a>
  )
}

export function HeroSection({
  sheet,
  promo,
  claimHref,
  continueHref,
  firmId,
}: {
  sheet: FirmSheet
  promo: { programme: SheetProgramme; plan: SheetPlan } | null
  claimHref: string
  continueHref: string
  /** Identifiant prop_firms, pour le favori ; null : pas de bouton Save. */
  firmId: string | null
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
  const detail = paragraphs(sheet.presentation)

  return (
    <section className="pb-5 pt-6 sm:pt-8">
      <Container>
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.9fr)]">
          <article data-check="hero-left" className={cx(CARD, 'relative flex h-full flex-col p-5 sm:p-6')}>
            <div className={cx('flex items-center gap-3', trustpilot && 'sm:pr-44')}>
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
              // Sans URL de profil, la note reste un simple bloc : un lien sans
              // destination se focalise au clavier et ne mene nulle part.
              <TrustpilotBadge url={sheet.trustpilotUrl}>
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
              </TrustpilotBadge>
            )}

            <h1 className="mt-5 max-w-3xl text-balance font-display text-[32px] font-bold leading-[1.08] tracking-tight text-text-primary sm:text-[42px]">
              {titre}
            </h1>
            {sheet.description && (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-[17px]">{sheet.description}</p>
            )}
            {/* La presentation detaillee (onglet Firme > presentation), repliee sous le resume. */}
            {detail.length > 0 && (
              <details className="group mt-2 max-w-3xl">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-accent marker:hidden">
                  <span className="group-open:hidden">{COPY.hero.readMore}</span>
                  <span className="hidden group-open:inline">{COPY.hero.readLess}</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="mt-2 space-y-2 text-sm leading-relaxed text-text-secondary">
                  {detail.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
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

            <div className="mt-auto flex flex-col gap-2.5 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
              <a href="#accounts" className={BTN_PRIMARY}>
                {COPY.hero.choose}
              </a>
              <a href="#rules" className={BTN_SECONDARY}>
                {COPY.hero.rules}
              </a>
              <div className="sm:ml-auto">
                <FirmActions firmId={firmId} nom={sheet.nom} />
              </div>
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
