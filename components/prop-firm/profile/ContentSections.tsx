'use client'

// 7.  Modules optionnels — parcours, formation, comptes apres reussite.
// 8.  Trading and payout conditions — dont les frais.
// 9.  About.  10. Strengths and things to know.  11. Verdict.  12. FAQ.
// 13. Final CTA, et la barre mobile.
// Chaque section disparait quand la fiche n'a rien a y mettre.

import { Check, ExternalLink, Info, Minus } from 'lucide-react'

import { type FirmSheet, etapeLabel, faqItems, firmType, paragraphs, sizeLabel } from '@/lib/firm-sheet'
import { cellule } from '@/lib/firm-profile'
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { prixSelection } from './AccountConfigurator'
import { COPY } from './copy'
import type { FirmSelection } from './useFirmSelection'
import { BTN_PRIMARY, CARD, CHIP, EYEBROW, LABEL, Section, SectionHeading, Valeur, cx } from './ui'

const COLONNES_LG: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

// --- 7. Modules optionnels ---------------------------------------------------
export function OptionalModules({ sheet }: { sheet: FirmSheet }) {
  const { parcours, formation, comptesApresReussite: comptes } = sheet
  return (
    <>
      {parcours.length > 0 && (
        <Section labelledBy="journey-title">
          <SectionHeading id="journey-title" eyebrow={COPY.modules.journeyEyebrow} title={COPY.modules.journeyTitle} />
          {/* Trois etapes : trois colonnes des la tablette, sinon la troisieme
              resterait seule sur sa ligne. */}
          <ol
            className={cx(
              'grid gap-3',
              parcours.length === 3 ? 'md:grid-cols-3' : cx('sm:grid-cols-2', COLONNES_LG[Math.min(parcours.length, 4)])
            )}
          >
            {parcours.map((etape, i) => (
              <li key={etape.titre} className={cx(CARD, 'p-4')}>
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-bg-base">
                    {i + 1}
                  </span>
                  <span className={LABEL}>{etapeLabel(etape.etape)}</span>
                </div>
                <h3 className="mt-2 font-semibold">{etape.titre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{etape.texte}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {formation && formation.elements.length > 0 && (
        <Section labelledBy="training-title">
          <SectionHeading
            id="training-title"
            eyebrow={COPY.modules.trainingEyebrow}
            title={formation.titre ?? COPY.modules.trainingTitle}
            intro={formation.intro ?? undefined}
          />
          <ul className={cx(CARD, 'grid gap-2 p-4 sm:grid-cols-2')}>
            {formation.elements.map((el) => (
              <li key={el} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {el}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {comptes.length > 0 && (
        <Section labelledBy="accounts-after-title">
          <SectionHeading id="accounts-after-title" eyebrow={COPY.modules.accountsEyebrow} title={COPY.modules.accountsTitle} />
          <div className={cx('grid gap-3', COLONNES_LG[Math.min(comptes.length, 4)])}>
            {comptes.map((c) => (
              <article key={c.nom} className={cx(CARD, 'p-4')}>
                <h3 className="font-display text-lg font-bold">{c.nom}</h3>
                {c.description && <p className="mt-1 text-sm text-text-secondary">{c.description}</p>}
                {c.lignes.length > 0 && (
                  <dl className="mt-3 divide-y divide-border text-sm">
                    {c.lignes.map((l) => (
                      <div key={l.libelle} className="flex justify-between gap-3 py-2">
                        <dt className="text-text-secondary">{l.libelle}</dt>
                        <dd className="text-right font-semibold">{l.valeur}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

// --- 8. Trading and payout conditions -----------------------------------------
export function ConditionsSection({ sheet }: { sheet: FirmSheet }) {
  const { conditions, couts } = sheet
  const levier = cellule(sheet.levier, sheet.levierStatut)

  const cartes = [
    (conditions.trading || levier) && (
      <article key="trading" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.conditions.trading}</p>
        <h3 className="mt-1 font-semibold">{COPY.conditions.tradingSub}</h3>
        {levier && (
          <p className="mt-2 text-sm">
            <span className="text-text-secondary">{COPY.quick.leverage}: </span>
            <span className="font-semibold">
              <Valeur cellule={levier} />
            </span>
          </p>
        )}
        {conditions.trading && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{conditions.trading}</p>}
      </article>
    ),
    (couts.length > 0 || conditions.commission) && (
      <article key="fees" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.conditions.fees}</p>
        <h3 className="mt-1 font-semibold">{COPY.conditions.feesSub}</h3>
        {couts.length > 0 && (
          <dl className="mt-2 divide-y divide-border text-sm">
            {couts.map((c) => (
              <div key={c.libelle} className="py-2">
                <div className="flex justify-between gap-3">
                  <dt className="font-medium">{c.libelle}</dt>
                  <dd className="shrink-0 text-right font-semibold tabular-nums">
                    {c.montant ?? <Minus className="inline h-3 w-3" aria-label="—" />}
                  </dd>
                </div>
                {c.note && <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{c.note}</p>}
              </div>
            ))}
          </dl>
        )}
        {conditions.commission && !couts.length && (
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{conditions.commission}</p>
        )}
      </article>
    ),
    (conditions.retraits || sheet.methodesRetrait.length > 0 || sheet.prestataireRetrait) && (
      <article key="payouts" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.conditions.payouts}</p>
        <h3 className="mt-1 font-semibold">{COPY.conditions.payoutsSub}</h3>
        {conditions.retraits && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{conditions.retraits}</p>}
        {sheet.methodesRetrait.length > 0 && (
          <div className="mt-3">
            <p className={LABEL}>{COPY.conditions.payoutMethods}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {sheet.methodesRetrait.map((m) => (
                <span key={m} className={CHIP}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
        {sheet.prestataireRetrait && (
          <p className="mt-3 text-sm">
            <span className="text-text-secondary">{COPY.conditions.provider}: </span>
            <span className="font-semibold">{sheet.prestataireRetrait}</span>
          </p>
        )}
      </article>
    ),
  ].filter(Boolean)

  if (cartes.length === 0) return null
  return (
    <Section labelledBy="conditions-title">
      <SectionHeading id="conditions-title" eyebrow={COPY.conditions.eyebrow} title={COPY.conditions.title} />
      <div className={cx('grid items-start gap-3', COLONNES_LG[cartes.length])}>{cartes}</div>
    </Section>
  )
}

// --- 9. About ------------------------------------------------------------------
export function AboutSection({ sheet }: { sheet: FirmSheet }) {
  const textes = paragraphs(sheet.presentation)
  const faits = (
    [
      [COPY.about.founded, sheet.anneeCreation != null ? String(sheet.anneeCreation) : null],
      [COPY.about.country, sheet.pays],
      [COPY.about.ceo, sheet.ceoFondateur],
      [COPY.about.type, sheet.marches.length > 0 ? firmType(sheet.marches) : null],
    ] as [string, string | null][]
  ).filter((f): f is [string, string] => Boolean(f[1]))
  if (textes.length === 0 && faits.length === 0) return null

  return (
    <Section labelledBy="about-title">
      <SectionHeading id="about-title" title={COPY.about.title(sheet.nom)} />
      <div className={cx(CARD, 'grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_260px]')}>
        {textes.length > 0 && (
          <div className="space-y-3 text-sm leading-relaxed text-text-secondary sm:text-base">
            {textes.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        )}
        {faits.length > 0 && (
          <dl className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {faits.map(([label, valeur]) => (
              <div key={label}>
                <dt className={LABEL}>{label}</dt>
                <dd className="mt-0.5 font-semibold">{valeur}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Section>
  )
}

// --- 10. Strengths and things to know -----------------------------------------
export function StrengthsSection({ sheet }: { sheet: FirmSheet }) {
  const { pointsForts, limites } = sheet.verdict
  if (pointsForts.length === 0 && limites.length === 0) return null
  const deux = pointsForts.length > 0 && limites.length > 0

  return (
    <Section labelledBy="strengths-title">
      <SectionHeading
        id="strengths-title"
        eyebrow={COPY.strengths.eyebrow}
        title={COPY.strengths.title(sheet.nom)}
        intro={COPY.strengths.intro}
      />
      <div className={cx('grid items-start gap-3', deux && 'lg:grid-cols-2')}>
        {pointsForts.length > 0 && (
          <article className={cx(CARD, 'p-4')}>
            <h3 className="font-semibold">{COPY.strengths.pros}</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {pointsForts.map((p) => (
                <li key={p} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        )}
        {limites.length > 0 && (
          <article className={cx(CARD, 'border-warning/30 p-4')}>
            <h3 className="font-semibold">{COPY.strengths.cons}</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {limites.map((p) => (
                <li key={p} className="flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </Section>
  )
}

// --- 11. Verdict -------------------------------------------------------------------
export function VerdictSection({ sheet }: { sheet: FirmSheet }) {
  const { texte, pourQui, pasPour } = sheet.verdict
  const pour = Boolean(texte || pourQui.length > 0)
  if (!pour && pasPour.length === 0) return null

  return (
    <Section labelledBy="verdict-title">
      <SectionHeading id="verdict-title" eyebrow={COPY.verdict.eyebrow} title={COPY.verdict.title(sheet.nom)} />
      <div className={cx('grid items-start gap-3', pour && pasPour.length > 0 && 'lg:grid-cols-2')}>
        {pour && (
          <article className={cx(CARD, 'p-4')}>
            <h3 className="font-semibold">{COPY.verdict.ours}</h3>
            {texte && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{texte}</p>}
            {pourQui.length > 0 && (
              <ul className="mt-3 space-y-2 text-sm">
                {pourQui.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </article>
        )}
        {pasPour.length > 0 && (
          <article className={cx(CARD, 'p-4')}>
            <h3 className="font-semibold">{COPY.verdict.notFor}</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {pasPour.map((p) => (
                <li key={p} className="flex gap-2">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
    </Section>
  )
}

// --- 12. FAQ -----------------------------------------------------------------------
export function FaqSection({ sheet }: { sheet: FirmSheet }) {
  const faq = faqItems(sheet)
  if (faq.length === 0) return null
  return (
    <Section labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow={COPY.faq.eyebrow} title={COPY.faq.title} />
      <div className={cx(CARD, 'divide-y divide-border px-4')}>
        {faq.map((q, i) => (
          <details key={q.question} open={i === 0} className="group py-3">
            <summary className="cursor-pointer list-none font-semibold marker:hidden">
              <span className="mr-2 inline-block text-accent transition-transform group-open:rotate-90">›</span>
              {q.question}
            </summary>
            <p className="mt-2 pl-4 text-sm leading-relaxed text-text-secondary">{q.reponse}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

// --- 13. Final CTA et barre mobile ----------------------------------------------
export function FinalCta({ sheet, sel }: { sheet: FirmSheet; sel: FirmSelection }) {
  const { programme, plan } = sel
  if (!programme || !plan) return null
  const prix = prixSelection(sheet, sel)
  return (
    <Section className="pb-10">
      <div className={cx(CARD, 'flex flex-col gap-4 border-accent-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between')}>
        <div>
          <h2 className="font-display text-2xl font-bold">{COPY.final.title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{COPY.final.intro}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm font-semibold tabular-nums">
            {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
            {prix ? ` · ${prix}` : ''}
          </span>
          <a href="#accounts" className={BTN_PRIMARY}>
            {COPY.final.button}
          </a>
        </div>
      </div>
    </Section>
  )
}

export function MobileBar({ sheet, sel, ctaHref }: { sheet: FirmSheet; sel: FirmSelection; ctaHref: string }) {
  const { programme, plan } = sel
  if (!programme || !plan) return null
  const prix = prixSelection(sheet, sel)
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-bg-base/95 px-4 py-2.5 backdrop-blur lg:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-text-secondary">
          {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
        </p>
        {prix && <p className="font-display text-lg font-bold tabular-nums">{prix}</p>}
      </div>
      <a href={ctaHref} {...AFFILIATE_LINK_PROPS} className={BTN_PRIMARY}>
        {sheet.offre && sel.offreAppliquee ? COPY.mobile.claim : COPY.mobile.continue}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}
