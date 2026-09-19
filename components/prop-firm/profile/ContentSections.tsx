'use client'

// 7.  Modules optionnels — parcours ; puis « What else is included? ».
// 8.  Trading and payout conditions — trois cartes structurees, filtrees par
//     la selection (programme, taille, phase) : aucune prose repetee.
// 9.  PropFirmScanner verdict — un seul bloc : conclusion, Best for, Things to know.
// 10. FAQ.  11. CTA final.  12. Similar firms.
// Chaque section disparait quand la fiche n'a rien a y mettre.

import { AlertTriangle, Check, ChevronDown, Info } from 'lucide-react'

import { type FirmSheet, type SimilarFirm, etapeLabel, sizeLabel } from '@/lib/firm-sheet'
import { faqProfil, fraisDeSelection, libellePhase, reglesDeCarte } from '@/lib/firm-profile'
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
// Trois cartes, sans repeter ce qui est deja ailleurs : le partage, le plafond
// et le minimum de retrait sont dans le configurateur et les regles ; le prix
// dans le configurateur. Chaque regle tient sur une ligne de titre et une
// phrase ; les bloquantes et les reserves passent en tete.
// Le tableur designe les regles essentielles (quatre par carte au plus) : elles
// s'affichent toutes. Sans selection dans le tableur, on s'arrete a quatre.
const REGLES_VISIBLES = 4

function LigneRegle({ r, phase }: { r: FirmSheet['regles'][number]; phase: string | null }) {
  return (
    <li className="py-2.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-text-primary">{r.regle}</span>
        {phase && <span className={CHIP}>{phase}</span>}
        {r.bloquante && (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger-subtle px-2 py-0.5 text-[11px] font-medium text-danger">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {COPY.conditions.breach}
          </span>
        )}
        {r.statut !== 'confirmed' && <StatusBadge statut={r.statut} />}
      </div>
      <p className="mt-0.5 text-[13px] leading-relaxed text-text-muted">{r.texte}</p>
    </li>
  )
}

function ListeRegles({
  regles,
  nomPhase,
  visibles = REGLES_VISIBLES,
}: {
  regles: FirmSheet['regles']
  nomPhase: (cle: string | null) => string | null
  visibles?: number
}) {
  if (regles.length === 0) return null
  const reste = regles.slice(visibles)
  return (
    <div>
      <ul className="divide-y divide-border">
        {regles.slice(0, visibles).map((r) => (
          <LigneRegle key={`${r.regle}-${r.phase}`} r={r} phase={nomPhase(r.phase)} />
        ))}
      </ul>
      {reste.length > 0 && (
        <details className="group border-t border-border">
          <summary className="cursor-pointer list-none py-2.5 text-sm font-semibold text-accent marker:hidden">
            <span className="group-open:hidden">{COPY.conditions.showMore(reste.length)}</span>
            <span className="hidden group-open:inline">{COPY.conditions.showLess}</span>
          </summary>
          <ul className="divide-y divide-border">
            {reste.map((r) => (
              <LigneRegle key={`${r.regle}-${r.phase}`} r={r} phase={nomPhase(r.phase)} />
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

function EnteteCarte({ eyebrow, titre }: { eyebrow: string; titre: string }) {
  return (
    <div className="mb-2 border-b border-border pb-3">
      <p className={EYEBROW}>{eyebrow}</p>
      <h3 className="mt-1 text-base font-semibold">{titre}</h3>
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
  const retraits = reglesDeCarte(sheet, 'payouts', programme, plan)
  const live = reglesDeCarte(sheet, 'live', programme, plan)
  const payoutsVide = retraits.length === 0 && live.length === 0 && !sheet.prestataireRetrait && sheet.methodesRetrait.length === 0

  const cartes = [
    trading.length > 0 && (
      <article key="trading" className={cx(CARD, 'p-4 sm:p-5')}>
        <EnteteCarte eyebrow={COPY.conditions.trading} titre={COPY.conditions.tradingTitle} />
        <ListeRegles regles={trading} nomPhase={nomPhase} visibles={sheet.regles.some((r) => r.essentielle) ? trading.length : REGLES_VISIBLES} />
      </article>
    ),
    frais.length > 0 && (
      <article key="fees" className={cx(CARD, 'p-4 sm:p-5')}>
        <EnteteCarte eyebrow={COPY.conditions.fees} titre={COPY.conditions.feesTitle} />
        <dl className="divide-y divide-border">
          {frais.map((f) => (
            <div key={f.libelle} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-sm font-medium text-text-secondary">{f.libelle}</dt>
                <dd className="shrink-0 text-right font-display text-xl font-bold tabular-nums text-text-primary">{f.valeur}</dd>
              </div>
              {f.note && <p className="mt-1 text-[13px] leading-relaxed text-text-muted">{f.note}</p>}
            </div>
          ))}
        </dl>
      </article>
    ),
    !payoutsVide && (
      <article key="payouts" className={cx(CARD, 'p-4 sm:p-5')}>
        <EnteteCarte eyebrow={COPY.conditions.payouts} titre={COPY.conditions.payoutsTitle} />
        {(sheet.prestataireRetrait || sheet.methodesRetrait.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 pb-2.5 pt-1">
            {sheet.prestataireRetrait && (
              <span className="text-sm">
                <span className="text-text-muted">{COPY.conditions.provider}: </span>
                <span className="font-semibold">{sheet.prestataireRetrait}</span>
              </span>
            )}
            {sheet.methodesRetrait.map((m) => (
              <span key={m} className={CHIP}>
                {m}
              </span>
            ))}
          </div>
        )}
        <div className="border-t border-border">
          <ListeRegles regles={[...retraits, ...live]} nomPhase={nomPhase} visibles={sheet.regles.some((r) => r.essentielle) ? retraits.length + live.length : REGLES_VISIBLES} />
        </div>
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
// Meme en-tete que les autres sections ; la conclusion en tete, puis deux
// colonnes jumelles : Best for (vert) et Things to know (ambre).
export function VerdictSection({ sheet }: { sheet: FirmSheet }) {
  const { texte, pourQui, limites } = sheet.verdict
  if (!texte && pourQui.length === 0 && limites.length === 0) return null

  const colonne = (titre: string, items: string[], ton: 'pour' | 'contre') => (
    <div className={cx('rounded-lg border p-4', ton === 'pour' ? 'border-accent-border bg-accent/5' : 'border-warning/30 bg-warning-subtle')}>
      <p className={cx('flex items-center gap-2 text-sm font-bold uppercase tracking-wider', ton === 'pour' ? 'text-accent' : 'text-warning')}>
        {ton === 'pour' ? <Check className="h-4 w-4" aria-hidden="true" /> : <Info className="h-4 w-4" aria-hidden="true" />}
        {titre}
      </p>
      <ul className="mt-2 divide-y divide-border text-sm">
        {items.map((p) => (
          <li key={p} className="py-2 text-text-secondary">
            {p}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <Section id="verdict" labelledBy="verdict-title">
      <SectionHeading id="verdict-title" eyebrow={COPY.verdict.eyebrow} title={COPY.verdict.title} />
      <article className={cx(CARD, 'p-4 sm:p-5')}>
        {texte && <p className="max-w-4xl text-base leading-relaxed text-text-primary">{texte}</p>}
        {(pourQui.length > 0 || limites.length > 0) && (
          <div className={cx('grid gap-3', texte && 'mt-4', pourQui.length > 0 && limites.length > 0 && 'md:grid-cols-2')}>
            {pourQui.length > 0 && colonne(COPY.verdict.bestFor, pourQui, 'pour')}
            {limites.length > 0 && colonne(COPY.verdict.thingsToKnow, limites, 'contre')}
          </div>
        )}
      </article>
    </Section>
  )
}

// --- 10. FAQ -----------------------------------------------------------------------
export function FaqSection({ sheet }: { sheet: FirmSheet }) {
  const faq = faqProfil(sheet)
  if (faq.length === 0) return null
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow={COPY.faq.eyebrow} title={COPY.faq.title} />
      <div className="grid gap-2">
        {faq.map((q, i) => (
          <details key={q.question} open={i === 0} className={cx(CARD, 'group px-4 sm:px-5')}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-base font-semibold marker:hidden">
              {q.question}
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform group-open:rotate-180">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="-mt-1 pb-4 text-sm leading-relaxed text-text-secondary">{q.reponse}</p>
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
export function SimilarFirms({ nom, firms }: { nom: string; firms: SimilarFirm[] }) {
  if (firms.length === 0) return null
  return (
    <Section labelledBy="similar-title">
      <SectionHeading id="similar-title" title={COPY.similar.title} />
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
