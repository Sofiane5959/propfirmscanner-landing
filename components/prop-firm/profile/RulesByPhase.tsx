'use client'

// 6. Rules by programme and phase — firme → programme → plan (taille +
//    variante) → phases → regles. La section a SA PROPRE selection (commentaire
//    du 19 septembre) : consulter les regles d'un autre programme ne change pas
//    le configurateur. Toutes les phases du plan sont cote a cote, une colonne
//    chacune ; une valeur verifiee s'affiche seule, une reserve porte son statut.

import { type FirmSheet, sizeLabel } from '@/lib/firm-sheet'
import { tableauRegles } from '@/lib/firm-profile'
import { COPY } from './copy'
import { useFirmSelection } from './useFirmSelection'
import { CARD, LABEL, Section, SectionHeading, StatusBadge, cx } from './ui'

const ONGLET = 'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
const ONGLET_ACTIF = 'border-accent bg-accent text-bg-base'
const ONGLET_REPOS = 'border-border bg-bg-base text-text-secondary hover:border-border-hover'

function Onglets<T extends string | number>({
  label,
  options,
  actif,
  choisir,
}: {
  label: string
  options: { cle: T; libelle: string }[]
  actif: T
  choisir: (cle: T) => void
}) {
  if (options.length < 2) return null
  return (
    <div>
      <p className={LABEL}>{label}</p>
      <div role="tablist" aria-label={label} className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={String(o.cle)}
            type="button"
            role="tab"
            aria-selected={o.cle === actif}
            onClick={() => choisir(o.cle)}
            className={cx(ONGLET, o.cle === actif ? ONGLET_ACTIF : ONGLET_REPOS)}
          >
            {o.libelle}
          </button>
        ))}
      </div>
    </div>
  )
}

export function RulesByPhase({ sheet }: { sheet: FirmSheet }) {
  // Une instance a part : meme logique que le configurateur, etat independant.
  const sel = useFirmSelection(sheet)
  const { programme, plan, phases } = sel
  if (!programme || !plan || phases.length === 0) return null
  const tableau = tableauRegles(plan, programme, phases)
  if (tableau.lignes.length === 0) return null

  return (
    <Section id="rules" labelledBy="rules-title">
      <SectionHeading id="rules-title" eyebrow={COPY.rules.eyebrow} title={COPY.rules.title} intro={COPY.rules.intro} />
      <div className={cx(CARD, 'p-4 sm:p-5')}>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:items-end">
          <Onglets
            label={COPY.rules.programme}
            options={sel.programmesVisibles.map((p) => ({ cle: p.slug, libelle: p.nom }))}
            actif={programme.slug}
            choisir={(slug) => {
              const p = sel.programmesVisibles.find((x) => x.slug === slug)
              if (p) sel.choisirProgramme(p)
            }}
          />
          <Onglets
            label={COPY.rules.variant}
            options={sel.variantes.map((v) => ({ cle: v, libelle: v || COPY.configurator.standard }))}
            actif={sel.variante}
            choisir={sel.setVariante}
          />
          <Onglets
            label={COPY.rules.size}
            options={sel.plansDeVariante.map((pl) => ({ cle: pl.taille, libelle: sizeLabel(pl.taille, pl.devise) }))}
            actif={plan.taille}
            choisir={(taille) => sel.setTaille(String(taille))}
          />
        </div>

        <p className="mb-2 text-sm text-text-muted">
          {programme.nom} · {sizeLabel(plan.taille, plan.devise)}
          {sel.variante ? ` · ${sel.variante}` : ''} — {tableau.colonnes.map((c) => c.libelle).join(' → ')}
        </p>

        <table className="w-full border-collapse text-sm">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-text-muted">
              <th className="py-2 pr-4 font-semibold">{COPY.rules.rule}</th>
              {tableau.colonnes.map((c) => (
                <th key={c.cle} className="py-2 pr-4 font-semibold text-accent">
                  {c.libelle}
                </th>
              ))}
              <th className="py-2 font-semibold">{COPY.rules.meaning}</th>
            </tr>
          </thead>
          <tbody>
            {tableau.lignes.map((l) => (
              <tr key={l.cle} className="block border-b border-border py-2.5 last:border-0 md:table-row md:py-0">
                <td className="block font-semibold md:table-cell md:py-2.5 md:pr-4">{l.libelle}</td>
                {l.cellules.map((cellule, i) => (
                  <td key={tableau.colonnes[i].cle} className="block tabular-nums md:table-cell md:whitespace-nowrap md:py-2.5 md:pr-4">
                    <span className="mr-1.5 text-xs text-text-muted md:hidden">{tableau.colonnes[i].libelle}:</span>
                    {cellule == null ? (
                      <span className="text-text-muted">—</span>
                    ) : cellule.statut !== 'confirmed' ? (
                      <StatusBadge statut={cellule.statut} />
                    ) : (
                      <span className="font-semibold text-text-primary">{cellule.valeur}</span>
                    )}
                  </td>
                ))}
                <td className="block pt-1 text-text-muted md:table-cell md:py-2.5">{l.sens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
