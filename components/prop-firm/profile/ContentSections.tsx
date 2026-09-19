'use client'

// 7.  Modules optionnels — parcours ; puis « What else is included? ».
// 8.  Trading and payout conditions — trois cartes structurees, filtrees par
//     la selection (programme, taille, phase) : aucune prose repetee.
// 9.  PropFirmScanner verdict — un seul bloc : Our view, Best for, Things to know.
// 10. FAQ.  11. CTA final.  12. Similar firms.
// Chaque section disparait quand la fiche n'a rien a y mettre.

import { AlertTriangle, Check, Minus } from 'lucide-react'

import { type FirmSheet, type SimilarFirm, etapeLabel, faqItems, sizeLabel } from '@/lib/firm-sheet'
import { fraisDeSelection, libellePhase, reglesDeCarte, retraitsDeSelection } from '@/lib/firm-profile'
import { prixSelection } from './AccountConfigurator'
import { COPY } from './copy'
import type { FirmSelection } from './useFirmSelection'
import {
  BTN_SECONDARY,
  CARD,
  CARD_ACCENT,
  CHIP,
  EYEBROW,
  LABEL,
  PromoGroup,
  Section,
  SectionHeading,
  StatusBadge,
  Valeur,
  cx,
} from './ui'

const COLONNES: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

// --- 7. Modules optionnels ---------------------------------------------------
export function OptionalModules({ sheet }: { sheet: FirmSheet }) {
  const { parcours, formation, comptesApresReussite: comptes } = sheet
  const modules = [
    formation && formation.elements.length > 0 && (
      <article key="formation" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.modules.training}</p>
        <h3 className="mt-1 font-semibold">{formation.titre ?? COPY.modules.training}</h3>
        {formation.intro && <p className="mt-1 text-sm text-text-muted">{formation.intro}</p>}
        <ul className="mt-2 space-y-1.5 text-sm">
          {formation.elements.map((el) => (
            <li key={el} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              {el}
            </li>
          ))}
        </ul>
      </article>
    ),
    ...comptes.map((c) => (
      <article key={c.nom} className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.modules.accounts}</p>
        <h3 className="mt-1 font-semibold">{c.nom}</h3>
        {c.description && <p className="mt-1 text-sm text-text-muted">{c.description}</p>}
        {c.lignes.length > 0 && (
          <dl className="mt-2 divide-y divide-border text-sm">
            {c.lignes.map((l) => (
              <div key={l.libelle} className="flex justify-between gap-3 py-1.5">
                <dt className="text-text-muted">{l.libelle}</dt>
                <dd className="text-right font-semibold">{l.valeur}</dd>
              </div>
            ))}
          </dl>
        )}
      </article>
    )),
  ].filter(Boolean)

  return (
    <>
      {parcours.length > 0 && (
        <Section labelledBy="journey-title">
          <SectionHeading id="journey-title" eyebrow={COPY.modules.journeyEyebrow} title={COPY.modules.journeyTitle} />
          <ol className={cx('grid gap-2.5', COLONNES[Math.min(parcours.length, 4)])}>
            {parcours.map((etape, i) => (
              <li key={etape.titre} className="rounded-xl border border-border p-4">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-xs font-bold text-accent">{i + 1}</span>
                <p className={cx(LABEL, 'mt-2')}>{etapeLabel(etape.etape)}</p>
                <h3 className="mt-0.5 font-semibold">{etape.titre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{etape.texte}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}
      {modules.length > 0 && (
        <Section labelledBy="included-title">
          <SectionHeading id="included-title" eyebrow={COPY.modules.includedEyebrow} title={COPY.modules.includedTitle} />
          <div className={cx('grid items-start gap-3', COLONNES[Math.min(modules.length, 3)])}>{modules}</div>
        </Section>
      )}
    </>
  )
}

// --- 8. Trading and payout conditions -----------------------------------------
function LigneRegle({ regle, texte, statut, bloquante, phase }: { regle: string; texte: string; statut: FirmSheet['regles'][number]['statut']; bloquante: boolean; phase: string | null }) {
  return (
    <li className="py-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-semibold text-text-primary">{regle}</span>
        {phase && <span className={CHIP}>{phase}</span>}
        {bloquante && (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger-subtle px-2 py-0.5 text-[11px] font-medium text-danger">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {COPY.conditions.breach}
          </span>
        )}
        {statut !== 'confirmed' && <StatusBadge statut={statut} />}
      </div>
      <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{texte}</p>
    </li>
  )
}

/** Les premieres regles visibles, le reste replie : la carte garde une hauteur lisible. */
const REGLES_VISIBLES = 5

function ListeRegles({
  regles,
  nomPhase,
  classe,
}: {
  regles: FirmSheet['regles']
  nomPhase: (cle: string | null) => string | null
  classe?: string
}) {
  if (regles.length === 0) return null
  const rendu = (r: FirmSheet['regles'][number]) => (
    <LigneRegle key={`${r.regle}-${r.phase}`} regle={r.regle} texte={r.texte} statut={r.statut} bloquante={r.bloquante} phase={nomPhase(r.phase)} />
  )
  const reste = regles.slice(REGLES_VISIBLES)
  return (
    <div className={classe}>
      <ul className="divide-y divide-border">{regles.slice(0, REGLES_VISIBLES).map(rendu)}</ul>
      {reste.length > 0 && (
        <details className="group border-t border-border">
          <summary className="cursor-pointer list-none py-2 text-sm font-semibold text-accent marker:hidden">
            <span className="group-open:hidden">{COPY.conditions.showAll(regles.length)}</span>
            <span className="hidden group-open:inline">{COPY.conditions.showLess}</span>
          </summary>
          <ul className="divide-y divide-border">{reste.map(rendu)}</ul>
        </details>
      )}
    </div>
  )
}

export function ConditionsSection({ sheet, sel }: { sheet: FirmSheet; sel: FirmSelection }) {
  const { programme, plan } = sel
  if (!programme || !plan) return null
  const nomPhase = (cle: string | null) => {
    const ph = cle ? plan.phases.find((p) => p.phase === cle) : null
    return ph ? libellePhase(ph, plan, programme) : null
  }

  const trading = reglesDeCarte(sheet, 'trading', programme, plan)
  const frais = fraisDeSelection(sheet, programme, plan)
  const retraits = retraitsDeSelection(plan)
  const reglesRetrait = reglesDeCarte(sheet, 'payouts', programme, plan)

  const cartes = [
    trading.length > 0 && (
      <article key="trading" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.conditions.trading}</p>
        <h3 className="mt-1 font-semibold">{COPY.conditions.tradingTitle}</h3>
        <ListeRegles regles={trading} nomPhase={nomPhase} classe="mt-2" />
      </article>
    ),
    frais.length > 0 && (
      <article key="fees" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.conditions.fees}</p>
        <h3 className="mt-1 font-semibold">{COPY.conditions.feesTitle}</h3>
        <dl className="mt-2 divide-y divide-border text-sm">
          {frais.map((f) => (
            <div key={f.libelle} className="py-2">
              <div className="flex justify-between gap-3">
                <dt className="font-medium">{f.libelle}</dt>
                <dd className="shrink-0 text-right font-semibold tabular-nums">{f.valeur}</dd>
              </div>
              {f.note && <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{f.note}</p>}
            </div>
          ))}
        </dl>
      </article>
    ),
    (retraits.length > 0 || reglesRetrait.length > 0 || sheet.prestataireRetrait || sheet.methodesRetrait.length > 0) && (
      <article key="payouts" className={cx(CARD, 'p-4')}>
        <p className={EYEBROW}>{COPY.conditions.payouts}</p>
        <h3 className="mt-1 font-semibold">{COPY.conditions.payoutsTitle}</h3>
        <dl className="mt-2 divide-y divide-border text-sm">
          {retraits.map((l) => (
            <div key={l.libelle} className="flex justify-between gap-3 py-2">
              <dt className="font-medium">{l.libelle}</dt>
              <dd className="text-right font-semibold tabular-nums">
                <Valeur cellule={l.valeur} />
              </dd>
            </div>
          ))}
          {sheet.prestataireRetrait && (
            <div className="flex justify-between gap-3 py-2">
              <dt className="font-medium">{COPY.conditions.provider}</dt>
              <dd className="text-right font-semibold">{sheet.prestataireRetrait}</dd>
            </div>
          )}
          {sheet.methodesRetrait.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 py-2">
              <dt className="font-medium">{COPY.conditions.methods}</dt>
              <dd className="flex flex-wrap justify-end gap-1.5">
                {sheet.methodesRetrait.map((m) => (
                  <span key={m} className={CHIP}>
                    {m}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>
        <ListeRegles regles={reglesRetrait} nomPhase={nomPhase} classe="mt-1 border-t border-border" />
      </article>
    ),
  ].filter(Boolean)

  if (cartes.length === 0) return null
  return (
    <Section labelledBy="conditions-title">
      <SectionHeading id="conditions-title" eyebrow={COPY.conditions.eyebrow} title={COPY.conditions.title} intro={COPY.conditions.intro} />
      <div className={cx('grid items-start gap-3', cartes.length === 3 ? 'lg:grid-cols-3' : COLONNES[cartes.length])}>{cartes}</div>
    </Section>
  )
}

// --- 9. PropFirmScanner verdict -----------------------------------------------------
export function VerdictSection({ sheet }: { sheet: FirmSheet }) {
  const { texte, pourQui, limites } = sheet.verdict
  const gauche = Boolean(texte || pourQui.length > 0)
  if (!gauche && limites.length === 0) return null

  return (
    <Section id="verdict" labelledBy="verdict-title">
      {/* Un seul bloc : la conclusion, Best for, Things to know. */}
      <SectionHeading id="verdict-title" title={COPY.verdict.title} />
      <div className={cx('grid items-stretch gap-3', gauche && limites.length > 0 && 'lg:grid-cols-[1.15fr_0.85fr]')}>
        {gauche && (
          <article className={cx(CARD, 'p-4 sm:p-5')}>
            {texte && <p className="text-sm leading-relaxed text-text-secondary">{texte}</p>}
            {pourQui.length > 0 && (
              <>
                <h3 className={cx('font-semibold', texte && 'mt-4')}>{COPY.verdict.bestFor}</h3>
                <ul className="mt-1 divide-y divide-border text-sm">
                  {pourQui.map((p) => (
                    <li key={p} className="flex gap-2 py-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>
        )}
        {limites.length > 0 && (
          <article className={cx(CARD, 'p-4 sm:p-5')}>
            <h3 className="font-semibold">{COPY.verdict.thingsToKnow}</h3>
            <ul className="mt-1 divide-y divide-border text-sm">
              {limites.map((p) => (
                <li key={p} className="flex gap-2 py-2">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
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

// --- 10. FAQ -----------------------------------------------------------------------
export function FaqSection({ sheet }: { sheet: FirmSheet }) {
  const faq = faqItems(sheet)
  if (faq.length === 0) return null
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow={COPY.faq.eyebrow} title={COPY.faq.title} />
      <div className={cx(CARD, 'divide-y divide-border px-4 sm:px-5')}>
        {faq.map((q, i) => (
          <details key={q.question} open={i === 0} className="group py-3.5">
            <summary className="cursor-pointer list-none font-semibold marker:hidden">
              <span className="mr-2 inline-block text-accent transition-transform group-open:rotate-90">›</span>
              {q.question}
            </summary>
            <p className="mt-2 pl-4 text-sm leading-relaxed text-text-muted">{q.reponse}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}

// --- 11. CTA final -------------------------------------------------------------------
export function FinalCta({
  sheet,
  sel,
  claimHref,
  continueHref,
}: {
  sheet: FirmSheet
  sel: FirmSelection
  claimHref: string
  continueHref: string
}) {
  const { programme, plan } = sel
  if (!programme || !plan) return null
  const prix = prixSelection(sheet, sel)
  const offre = sheet.offre
  return (
    <Section>
      <div
        data-check="final-cta"
        className={cx(CARD_ACCENT, 'grid items-center gap-5 bg-gradient-to-r from-accent/10 to-bg-elevated p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]')}
      >
        <div>
          <p className={EYEBROW}>{COPY.final.eyebrow}</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{COPY.final.title(sheet.nom)}</h2>
          <p className="mt-1 text-sm text-text-muted tabular-nums">
            {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
            {prix ? ` · ${prix}` : ''}
          </p>
        </div>
        <div className="rounded-lg border border-accent-border bg-bg-base p-3">
          <PromoGroup
            code={offre && sel.offreAppliquee ? offre.code : null}
            claimHref={offre && sel.offreAppliquee ? claimHref : null}
            continueHref={continueHref}
            continueLabel={COPY.commercial.continueTo(sheet.nom)}
          />
        </div>
      </div>
    </Section>
  )
}

// --- 12. Similar firms ---------------------------------------------------------------
export function SimilarFirms({ firms }: { firms: SimilarFirm[] }) {
  if (firms.length === 0) return null
  return (
    <Section labelledBy="similar-title">
      <SectionHeading id="similar-title" eyebrow={COPY.similar.eyebrow} title={COPY.similar.title} />
      <div className={cx('grid gap-3', COLONNES[Math.min(firms.length, 3)])}>
        {firms.map((f) => (
          <article key={f.id} className={cx(CARD, 'flex flex-col p-4')}>
            <div className="flex items-center justify-between gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1 font-bold text-bg-base">
                {f.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.logoUrl} alt="" className="h-full w-full object-contain" />
                ) : (
                  f.name.charAt(0)
                )}
              </div>
              {f.remise != null && <span className={EYEBROW}>{COPY.similar.off(f.remise)}</span>}
            </div>
            <h3 className="mt-3 font-semibold">{f.name}</h3>
            {f.code && (
              <span className="mb-3 mt-2 inline-flex self-start rounded-md border border-accent-border px-2 py-1 font-mono text-sm font-bold tracking-wider text-accent">
                {f.code}
              </span>
            )}
            <a href={f.href} className={cx(BTN_SECONDARY, 'mt-auto w-full')}>
              {COPY.similar.view}
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}
