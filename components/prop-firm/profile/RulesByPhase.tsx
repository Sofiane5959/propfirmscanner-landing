'use client'

// 6. Rules by phase — un onglet par phase du plan choisi, un tableau commun.
//    En mobile, chaque regle devient un bloc : la colonne « Meaning » reste lisible.

import { PHASE_LABEL } from '@/lib/firm-sheet'
import { reglesDePhase } from '@/lib/firm-profile'
import { COPY } from './copy'
import type { FirmSelection } from './useFirmSelection'
import { CARD, Section, SectionHeading, Valeur, cx } from './ui'

export function RulesByPhase({ sel }: { sel: FirmSelection }) {
  const { programme, plan, phase, phases } = sel
  if (!programme || !plan || !phase) return null
  const lignes = reglesDePhase(phase, plan.devise)
  if (lignes.length === 0) return null
  const libellePhase = PHASE_LABEL[phase.phase]

  return (
    <Section id="rules" labelledBy="rules-title">
      <SectionHeading
        id="rules-title"
        eyebrow={COPY.rules.eyebrow}
        title={COPY.rules.title(programme.nom, phases.length > 1, libellePhase)}
        intro={COPY.rules.intro}
      />
      <div className={cx(CARD, 'p-4 sm:p-5')}>
        {phases.length > 1 && (
          <div role="tablist" className="mb-3 flex flex-wrap gap-2">
            {phases.map((ph) => {
              const actif = ph.phase === phase.phase
              return (
                <button
                  key={ph.phase}
                  type="button"
                  role="tab"
                  aria-selected={actif}
                  onClick={() => sel.setPhase(ph.phase)}
                  className={cx(
                    'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    actif
                      ? 'border-accent bg-accent text-bg-base'
                      : 'border-border bg-bg-base text-text-secondary hover:border-border-hover'
                  )}
                >
                  {PHASE_LABEL[ph.phase]}
                </button>
              )
            })}
          </div>
        )}
        <table className="w-full border-collapse text-sm">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-text-secondary">
              <th className="py-2 pr-4 font-semibold">{COPY.rules.rule}</th>
              <th className="py-2 pr-4 font-semibold">{COPY.rules.value(libellePhase)}</th>
              <th className="py-2 font-semibold">{COPY.rules.meaning}</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.cle} className="block border-b border-border py-2.5 last:border-0 sm:table-row sm:py-0">
                <td className="block font-semibold sm:table-cell sm:py-2.5 sm:pr-4">{l.libelle}</td>
                <td className="block text-accent tabular-nums sm:table-cell sm:whitespace-nowrap sm:py-2.5 sm:pr-4 sm:text-text-primary">
                  <Valeur cellule={l.valeur} />
                </td>
                <td className="block text-text-secondary sm:table-cell sm:py-2.5">{l.sens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
