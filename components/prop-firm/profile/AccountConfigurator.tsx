'use client'

// 4. Account configurator — marche → programme → variante → taille → option
//    d'achat. Une etape a un seul choix n'est pas affichee. Le resume reste a
//    droite en desktop et passe sous les etapes en mobile.
// 5. Program comparison — une carte par programme, qui pilote le configurateur.

import { ExternalLink } from 'lucide-react'

import { type FirmSheet, marketsLabel, pct, programmeTagline, sizeLabel } from '@/lib/firm-sheet'
import { cellule, lignesSelection } from '@/lib/firm-profile'
import { AFFILIATE_LINK_PROPS } from '@/lib/affiliate'
import { COPY } from './copy'
import { prixPlan, prixRemise } from './format'
import type { FirmSelection } from './useFirmSelection'
import {
  BTN_PRIMARY,
  CARD,
  CHOICE,
  CHOICE_ACTIVE,
  CHOICE_IDLE,
  EYEBROW,
  LABEL,
  PromoCode,
  Section,
  SectionHeading,
  StatusBadge,
  Valeur,
  cx,
} from './ui'

interface Choix {
  key: string
  label: string
  accroche?: string
  detail?: string
}

interface Etape {
  titre: string
  compacte: boolean
  choix: Choix[]
  actif: string
  choisir: (key: string) => void
}

export function AccountConfigurator({
  sheet,
  sel,
  ctaHref,
}: {
  sheet: FirmSheet
  sel: FirmSelection
  ctaHref: string
}) {
  const { programme, plan, offreAppliquee, prixRemise: remise } = sel
  if (!programme || !plan) return null
  const offre = sheet.offre

  const etapes: Etape[] = [
    {
      titre: COPY.configurator.market,
      compacte: false,
      choix: sel.marches.map((m) => ({
        key: m,
        label: marketsLabel([m]),
        detail: COPY.configurator.programs(sel.programmes.filter((p) => p.marche === m).length),
      })),
      actif: sel.marche,
      choisir: sel.setMarche,
    },
    {
      titre: COPY.configurator.program,
      compacte: false,
      choix: sel.programmesVisibles.map((p) => {
        const moinsCher = p.plans
          .filter((pl) => pl.prix != null)
          .sort((a, b) => (a.prix ?? 0) - (b.prix ?? 0))[0]
        const tailles = new Set(p.plans.map((pl) => pl.taille)).size
        return {
          key: p.slug,
          label: p.nom,
          accroche: p.accroche ?? (p.type === 'instant' ? COPY.configurator.noEvaluation : COPY.configurator.evaluation),
          detail:
            COPY.configurator.sizes(tailles) +
            (moinsCher?.prix != null ? ` · ${COPY.configurator.fromPrice(prixPlan(moinsCher.prix, moinsCher))}` : ''),
        }
      }),
      actif: programme.slug,
      choisir: sel.setProgramme,
    },
    {
      titre: COPY.configurator.variant,
      compacte: false,
      choix: sel.variantes.map((v) => ({
        key: v,
        label: v || COPY.configurator.standard,
        detail: COPY.configurator.sizes(programme.plans.filter((pl) => (pl.variante ?? '') === v).length),
      })),
      actif: sel.variante,
      choisir: sel.setVariante,
    },
    {
      titre: COPY.configurator.size,
      compacte: true,
      choix: sel.plansDeVariante.map((pl) => ({
        key: String(pl.taille),
        label: sizeLabel(pl.taille, pl.devise),
        detail: pl.prix != null ? prixPlan(pl.prix, pl) : undefined,
      })),
      actif: String(plan.taille),
      choisir: sel.setTaille,
    },
    ...sel.groupesOptions.map((g) => ({
      titre: COPY.configurator[g.type],
      compacte: false,
      choix: g.options.map((o) => ({ key: o.nom, label: o.nom, detail: o.detail ?? undefined })),
      actif: g.actif.nom,
      choisir: g.choisir,
    })),
  ].filter((e) => e.choix.length > 1)

  const lignes = lignesSelection(plan)

  return (
    <Section id="accounts" labelledBy="accounts-title" className="border-t border-border">
      <SectionHeading
        id="accounts-title"
        eyebrow={COPY.configurator.eyebrow}
        title={COPY.configurator.title}
        intro={COPY.configurator.intro}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid min-w-0 gap-3">
          {etapes.map((etape, i) => (
            <fieldset key={etape.titre} className={cx(CARD, 'min-w-0 px-4 pb-4 pt-1')}>
              <legend className="flex items-center gap-2 px-1 text-base font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-bg-base">
                  {i + 1}
                </span>
                {etape.titre}
              </legend>
              <div
                className={cx(
                  'mt-2 grid gap-2',
                  etape.compacte ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-2 xl:grid-cols-3'
                )}
              >
                {etape.choix.map((c) => {
                  const actif = c.key === etape.actif
                  return (
                    <button
                      key={c.key}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => etape.choisir(c.key)}
                      className={cx(CHOICE, actif ? CHOICE_ACTIVE : CHOICE_IDLE, etape.compacte && 'items-center text-center')}
                    >
                      {c.accroche && <span className="text-xs text-text-secondary">{c.accroche}</span>}
                      <span className={cx('text-base font-semibold', actif && 'text-accent')}>
                        {c.label}
                      </span>
                      {c.detail && <span className="text-xs text-text-secondary tabular-nums">{c.detail}</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <aside data-check="selection" aria-live="polite" className={cx(CARD, 'p-5 lg:sticky lg:top-24')}>
          <p className={EYEBROW}>{COPY.configurator.selection}</p>
          <h3 className="mt-1 font-display text-xl font-bold">
            {programme.nom} {sizeLabel(plan.taille, plan.devise)}
            {sel.variante ? ` · ${sel.variante}` : ''}
          </h3>

          {plan.prix != null && (
            <div className="mt-3">
              {offre && remise != null ? (
                <>
                  <p className="font-display text-4xl font-bold tabular-nums">
                    {prixRemise(remise, plan, offre)}
                    <span className="ml-2 align-middle text-base font-normal text-text-secondary line-through">
                      {prixPlan(plan.prix, plan)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-accent">
                    {COPY.configurator.withCode(pct(offre.remise), offre.code)}
                  </p>
                </>
              ) : (
                <p className="font-display text-4xl font-bold tabular-nums">{prixPlan(plan.prix, plan)}</p>
              )}
            </div>
          )}

          {lignes.length > 0 && (
            <dl className="mt-4 divide-y divide-border text-sm">
              {lignes.map((l) => (
                <div key={l.libelle} className="flex items-center justify-between gap-3 py-2">
                  <dt className="text-text-secondary">{l.libelle}</dt>
                  <dd className="font-semibold tabular-nums">
                    <Valeur cellule={l.valeur} />
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-4 grid gap-3">
            {offre && offreAppliquee && <PromoCode code={offre.code} label={COPY.copy.short} />}
            <a href={ctaHref} {...AFFILIATE_LINK_PROPS} className={cx(BTN_PRIMARY, 'w-full')}>
              {offre && offreAppliquee ? COPY.commercial.claim : COPY.configurator.continueTo(sheet.nom)}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            {offre && !offreAppliquee && (
              <p className="text-center text-xs text-text-secondary">{COPY.configurator.notListed(offre.code)}</p>
            )}
          </div>
        </aside>
      </div>
    </Section>
  )
}

export function ProgramComparison({ sel }: { sel: FirmSelection }) {
  if (sel.programmesVisibles.length < 2 || !sel.programme) return null
  const actifSlug = sel.programme.slug
  return (
    <Section labelledBy="comparison-title" className="pt-0 sm:pt-0">
      <SectionHeading id="comparison-title" title={COPY.comparison.title} intro={COPY.comparison.intro} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sel.programmesVisibles.map((p) => {
          const actif = p.slug === actifSlug
          const comptes = cellule(p.maxComptes == null ? null : String(p.maxComptes), p.maxComptesStatut)
          return (
            <button
              key={p.slug}
              type="button"
              aria-pressed={actif}
              onClick={() => sel.choisirProgramme(p)}
              className={cx(CHOICE, 'gap-1.5 p-4', actif ? CHOICE_ACTIVE : cx(CHOICE_IDLE, 'bg-bg-elevated'))}
            >
              <span className={EYEBROW}>{programmeTagline(p)}</span>
              <span className="font-display text-lg font-bold">{p.nom}</span>
              {p.resume && <span className="text-sm leading-relaxed text-text-secondary">{p.resume}</span>}
              {comptes && (
                <span className="text-xs text-text-secondary">
                  <span className={LABEL}>{COPY.comparison.maxAccounts}</span>{' '}
                  <span className="font-semibold text-text-primary">
                    {comptes.statut ? <StatusBadge statut={comptes.statut} /> : comptes.texte}
                  </span>
                  {comptes.statut && p.maxComptesNote && (
                    <span className="mt-1 block leading-relaxed">{p.maxComptesNote}</span>
                  )}
                </span>
              )}
              <span className={cx('mt-auto pt-1 text-xs font-semibold', actif ? 'text-accent' : 'text-text-secondary')}>
                {actif ? `✓ ${COPY.comparison.selected}` : COPY.comparison.choose}
              </span>
            </button>
          )
        })}
      </div>
    </Section>
  )
}

/** Montant pour les resumes en une ligne (fin de page, barre mobile). */
export function prixSelection(sheet: FirmSheet, sel: FirmSelection): string | null {
  const { plan, prixRemise: remise } = sel
  if (!plan || plan.prix == null) return null
  return sheet.offre && remise != null ? prixRemise(remise, plan, sheet.offre) : prixPlan(plan.prix, plan)
}
