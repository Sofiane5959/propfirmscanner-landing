'use client'

// 6. Rules by programme and phase — firme → programme → plan (taille +
//    variante) → phase → regles. Les onglets de programme pilotent la meme
//    selection que le configurateur ; les onglets de phase viennent des phases
//    que le plan possede reellement.

import { sizeLabel } from '@/lib/firm-sheet'
import { libellePhase, reglesDePhase } from '@/lib/firm-profile'
import { COPY } from './copy'
import type { FirmSelection } from './useFirmSelection'
import { CARD, LABEL, Section, SectionHeading, StatusBadge, cx } from './ui'

const ONGLET = 'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
const ONGLET_ACTIF = 'border-accent bg-accent text-bg-base'
const ONGLET_REPOS = 'border-border bg-bg-base text-text-secondary hover:border-border-hover'

export function RulesByPhase({ sel }: { sel: FirmSelection }) {
  const { programme, plan, phase, phases } = sel
  if (!programme || !plan || !phase) return null
  const lignes = reglesDePhase(phase, plan.devise)
  if (lignes.length === 0) return null
  const nomPhase = libellePhase(phase, plan, programme)

  return (
    <Section id="rules" labelledBy="rules-title">
      <SectionHeading id="rules-title" eyebrow={COPY.rules.eyebrow} title={COPY.rules.title} intro={COPY.rules.intro} />
      <div className={cx(CARD, 'p-4 sm:p-5')}>
        <div className="mb-4 grid gap-3 rounded-lg border border-border bg-bg-base p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className={LABEL}>{COPY.rules.plan}</p>
            <p className="mt-0.5 font-semibold">
              {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
              {sel.variante ? ` · ${sel.variante}` : ''}
            </p>
          </div>
          <span className="inline-flex min-h-[34px] items-center justify-self-start rounded-lg border border-accent-border bg-accent/10 px-3 text-sm font-semibold text-accent">
            {programme.nom} · {nomPhase}
          </span>
        </div>

        {sel.programmesVisibles.length > 1 && (
          <>
            <p className={LABEL}>{COPY.rules.programme}</p>
            <div role="tablist" aria-label={COPY.rules.programme} className="mb-3 mt-2 flex flex-wrap gap-2">
              {sel.programmesVisibles.map((p) => {
                const actif = p.slug === programme.slug
                return (
                  <button
                    key={p.slug}
                    type="button"
                    role="tab"
                    aria-selected={actif}
                    onClick={() => sel.choisirProgramme(p)}
                    className={cx(ONGLET, actif ? ONGLET_ACTIF : ONGLET_REPOS)}
                  >
                    {p.nom}
                  </button>
                )
              })}
            </div>
          </>
        )}

        {phases.length > 1 && (
          <>
            <p className={LABEL}>{COPY.rules.phase}</p>
            <div role="tablist" aria-label={COPY.rules.phase} className="mb-3 mt-2 flex flex-wrap gap-2">
              {phases.map((ph) => {
                const actif = ph.phase === phase.phase
                return (
                  <button
                    key={ph.phase}
                    type="button"
                    role="tab"
                    aria-selected={actif}
                    onClick={() => sel.setPhase(ph.phase)}
                    className={cx(ONGLET, actif ? ONGLET_ACTIF : ONGLET_REPOS)}
                  >
                    {libellePhase(ph, plan, programme)}
                  </button>
                )
              })}
            </div>
          </>
        )}

        <table className="w-full border-collapse text-sm">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-text-muted">
              <th className="py-2 pr-4 font-semibold">{COPY.rules.rule}</th>
              <th className="py-2 pr-4 font-semibold">{nomPhase}</th>
              <th className="py-2 pr-4 font-semibold">{COPY.rules.status}</th>
              <th className="py-2 font-semibold">{COPY.rules.meaning}</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.cle} className="block border-b border-border py-2.5 last:border-0 md:table-row md:py-0">
                <td className="block font-semibold md:table-cell md:py-2.5 md:pr-4">{l.libelle}</td>
                <td className="block font-semibold text-accent tabular-nums md:table-cell md:whitespace-nowrap md:py-2.5 md:pr-4 md:text-text-primary">
                  {l.valeur ?? '—'}
                </td>
                <td className="block py-1 md:table-cell md:py-2.5 md:pr-4">
                  <StatusBadge statut={l.statut} />
                </td>
                <td className="block text-text-muted md:table-cell md:py-2.5">{l.sens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
