'use client'

// 4. Account configurator — deux colonnes de meme hauteur (contrat visuel) :
//    a gauche les choix (une etape a un seul choix n'apparait pas), a droite
//    le resume : selection complete, phases, prix, remise, chiffres, code,
//    Copy code et Continue to [Firm].
// 5. Program comparison — une carte par programme ; la choisir pilote le
//    configurateur.

import { type FirmSheet, marketsLabel, pct, sizeLabel } from '@/lib/firm-sheet'
import { cellule, lignesSelection, parcoursPhases } from '@/lib/firm-profile'
import { COPY } from './copy'
import { prixPlan, prixRemise } from './format'
import type { FirmSelection } from './useFirmSelection'
import {
  CARD,
  CARD_ACCENT,
  CHOICE,
  CHOICE_ACTIVE,
  CHOICE_IDLE,
  EYEBROW,
  LABEL,
  PromoGroup,
  Section,
  SectionHeading,
  StatusBadge,
  Valeur,
  cx,
} from './ui'

interface Choix {
  key: string
  label: string
  detail?: string
}

interface Etape {
  titre: string
  choix: Choix[]
  actif: string
  choisir: (key: string) => void
}

export function AccountConfigurator({
  sheet,
  sel,
  continueHref,
}: {
  sheet: FirmSheet
  sel: FirmSelection
  continueHref: string
}) {
  const { programme, plan, offreAppliquee, prixRemise: remise, phases } = sel
  if (!programme || !plan) return null
  const offre = sheet.offre

  const etapes: Etape[] = [
    {
      titre: COPY.configurator.market,
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
      choix: sel.programmesVisibles.map((p) => {
        const moinsCher = p.plans.filter((pl) => pl.prix != null).sort((a, b) => (a.prix ?? 0) - (b.prix ?? 0))[0]
        return {
          key: p.slug,
          label: p.nom,
          detail:
            (p.accroche ?? (p.type === 'instant' ? COPY.configurator.noEvaluation : COPY.configurator.evaluation)) +
            (moinsCher?.prix != null ? ` · ${COPY.configurator.fromPrice(prixPlan(moinsCher.prix, moinsCher))}` : ''),
        }
      }),
      actif: programme.slug,
      choisir: sel.setProgramme,
    },
    {
      titre: COPY.configurator.variant,
      choix: sel.variantes.map((v) => ({ key: v, label: v || COPY.configurator.standard })),
      actif: sel.variante,
      choisir: sel.setVariante,
    },
    {
      titre: COPY.configurator.size,
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
      choix: g.options.map((o) => ({ key: o.nom, label: o.nom, detail: o.detail ?? undefined })),
      actif: g.actif.nom,
      choisir: g.choisir,
    })),
  ].filter((e) => e.choix.length > 1)

  const lignes = lignesSelection(plan)

  return (
    <Section id="accounts" labelledBy="accounts-title">
      <SectionHeading id="accounts-title" eyebrow={COPY.configurator.eyebrow} title={COPY.configurator.title} intro={COPY.configurator.intro} />

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        {/* Les etapes se partagent la hauteur du resume : pas de vide sous la derniere. */}
        <div className={cx(CARD, 'flex flex-col gap-2.5 p-4')}>
          {etapes.map((etape, i) => (
            <fieldset key={etape.titre} className="flex min-w-0 flex-1 flex-col rounded-lg border border-border p-3">
              <legend className="sr-only">{etape.titre}</legend>
              <p aria-hidden="true" className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-bg-base">{i + 1}</span>
                {etape.titre}
              </p>
              <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {etape.choix.map((c) => {
                  const actif = c.key === etape.actif
                  return (
                    <button
                      key={c.key}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => etape.choisir(c.key)}
                      className={cx(CHOICE, actif ? CHOICE_ACTIVE : CHOICE_IDLE)}
                    >
                      <span className={cx('text-sm font-semibold', actif && 'text-accent')}>{c.label}</span>
                      {c.detail && <span className="text-xs text-text-muted tabular-nums">{c.detail}</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <aside data-check="selection" aria-live="polite" className={cx(CARD_ACCENT, 'flex flex-col p-4 sm:p-5')}>
          <p className={EYEBROW}>{COPY.configurator.selection}</p>
          <h3 className="mt-1 font-display text-xl font-bold">
            {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
            {sel.variante ? ` · ${sel.variante}` : ''}
          </h3>
          {phases.length > 0 && (
            <p className="mt-0.5 text-xs text-text-muted">
              {COPY.configurator.phases}: {parcoursPhases(plan, programme, phases)}
            </p>
          )}

          {plan.prix != null && (
            <div className="mt-3">
              {offre && remise != null ? (
                <>
                  <p className="font-display text-[38px] font-bold leading-none tabular-nums">
                    {prixRemise(remise, plan, offre)}
                    <span className="ml-2 align-middle text-base font-normal text-text-muted line-through">{prixPlan(plan.prix, plan)}</span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-accent">{COPY.configurator.withCode(pct(offre.remise), offre.code)}</p>
                </>
              ) : (
                <p className="font-display text-[38px] font-bold leading-none tabular-nums">{prixPlan(plan.prix, plan)}</p>
              )}
            </div>
          )}

          {lignes.length > 0 && (
            <dl className="my-3 grid flex-1 auto-rows-[minmax(60px,1fr)] grid-cols-2 gap-2">
              {lignes.map((l) => (
                <div key={l.libelle} className="flex flex-col justify-center rounded-lg border border-border bg-bg-base px-3 py-2">
                  <dt className={LABEL}>{l.libelle}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">
                    <Valeur cellule={l.valeur} />
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <PromoGroup
            code={offre && offreAppliquee ? offre.code : null}
            claimHref={null}
            continueHref={continueHref}
            continueLabel={COPY.commercial.continueTo(sheet.nom)}
          />
          {offre && !offreAppliquee && (
            <p className="mt-2 text-center text-xs text-text-muted">{COPY.configurator.notListed(offre.code)}</p>
          )}
        </aside>
      </div>
    </Section>
  )
}

export function ProgramComparison({ sel }: { sel: FirmSelection }) {
  if (sel.programmesVisibles.length < 2 || !sel.programme) return null
  const actifSlug = sel.programme.slug
  const n = sel.programmesVisibles.length
  return (
    <Section labelledBy="comparison-title">
      <SectionHeading id="comparison-title" eyebrow={COPY.comparison.eyebrow} title={COPY.comparison.title} intro={COPY.comparison.intro} />
      <div className={cx('grid gap-3 sm:grid-cols-2', n === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
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
              <span className={EYEBROW}>{actif ? COPY.comparison.selected : COPY.comparison.program}</span>
              <span className="font-display text-lg font-bold">{p.nom}</span>
              {p.resume && <span className="text-sm leading-relaxed text-text-muted">{p.resume}</span>}
              {comptes && (
                <span className="mt-auto pt-1 text-xs text-text-muted">
                  {COPY.comparison.maxAccounts}{' '}
                  <span className="font-semibold text-text-primary">
                    {comptes.statut ? <StatusBadge statut={comptes.statut} /> : comptes.texte}
                  </span>
                  {comptes.statut && p.maxComptesNote && <span className="mt-1 block leading-relaxed">{p.maxComptesNote}</span>}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </Section>
  )
}

/** Montant pour les resumes en une ligne (CTA final). */
export function prixSelection(sheet: FirmSheet, sel: FirmSelection): string | null {
  const { plan, prixRemise: remise } = sel
  if (!plan || plan.prix == null) return null
  return sheet.offre && remise != null ? prixRemise(remise, plan, sheet.offre) : prixPlan(plan.prix, plan)
}
