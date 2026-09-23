'use client'

// 6. Rules by programme and phase — firme → programme → plan (taille +
//    variante) → phases → regles. La section a SA PROPRE selection (commentaire
//    du 19 septembre) : consulter les regles d'un autre programme ne change pas
//    le configurateur. Toutes les phases du plan sont cote a cote, une colonne
//    chacune ; une valeur verifiee s'affiche seule, une reserve porte son statut.

import { useState } from 'react'

import { type FirmSheet, sizeLabel } from '@/lib/firm-sheet'
import { tableauRegles } from '@/lib/firm-profile'
import { COPY } from './copy'
import { prixPlan } from './format'
import { useFirmSelection } from './useFirmSelection'
import { CARD, LABEL, Section, SectionHeading, StatusBadge, TexteEtage, cx } from './ui'


function Onglets<T extends string | number>({
  label,
  options,
  actif,
  choisir,
}: {
  label: string
  options: { cle: T; libelle: string; detail?: string }[]
  actif: T
  choisir: (cle: T) => void
}) {
  if (options.length < 2) return null
  return (
    <div className="min-w-0">
      <p className={LABEL}>{label}</p>
      {/* Controle segmente : un bloc, des cibles larges, l'etat choisi evident. */}
      <div role="tablist" aria-label={label} className="mt-2 flex flex-wrap gap-1 rounded-xl border border-border bg-bg-base p-1">
        {options.map((o) => {
          const actifIci = o.cle === actif
          return (
            <button
              key={String(o.cle)}
              type="button"
              role="tab"
              aria-selected={actifIci}
              onClick={() => choisir(o.cle)}
              className={cx(
                'flex min-h-[44px] min-w-[72px] flex-1 flex-col items-center justify-center rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                actifIci ? 'bg-accent text-bg-base shadow-sm' : 'text-text-secondary hover:bg-dark-700 hover:text-text-primary'
              )}
            >
              {o.libelle}
              {o.detail && (
                <span className={cx('text-[11px] font-medium tabular-nums', actifIci ? 'text-bg-base/80' : 'text-text-muted')}>
                  {o.detail}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function RulesByPhase({ sheet }: { sheet: FirmSheet }) {
  // Une instance a part : meme logique que le configurateur, etat independant.
  const sel = useFirmSelection(sheet)
  // Sur mobile, une phase a la fois : afficher les deux colonnes obligeait a
  // repeter « Evaluation : » et « Funded : » sur chaque ligne (commentaire du 20/09).
  const [phaseMobile, setPhaseMobile] = useState(0)
  const { programme, plan, phases } = sel
  if (!programme || !plan || phases.length === 0) return null
  const tableau = tableauRegles(plan, programme, phases)
  if (tableau.lignes.length === 0) return null
  const iPhase = Math.min(phaseMobile, tableau.colonnes.length - 1)

  return (
    <Section id="rules" labelledBy="rules-title">
      <SectionHeading id="rules-title" eyebrow={COPY.rules.eyebrow} title={COPY.rules.title} intro={COPY.rules.intro} />
      <div className={cx(CARD, 'p-4 sm:p-5')}>
        {/* Une seule barre de reglages : on choisit, on lit le rappel, on lit le tableau. */}
        <div className="mb-4 rounded-xl border border-border p-3">
        <div className={cx('grid gap-3 md:grid-cols-2', sel.variantes.length > 1 && 'lg:grid-cols-3')}>
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
            options={sel.plansDeVariante.map((pl) => ({
              cle: pl.taille,
              libelle: sizeLabel(pl.taille, pl.deviseCompte),
              detail: pl.prix != null ? prixPlan(pl.prix, pl) : undefined,
            }))}
            actif={plan.taille}
            choisir={(taille) => sel.setTaille(String(taille))}
          />
        </div>

        {/* Mobile : le selecteur de phase remplace les etiquettes repetees. */}
        <div className="mt-3 md:hidden">
          <Onglets
            label={COPY.rules.phase}
            options={tableau.colonnes.map((c, i) => ({ cle: i, libelle: c.libelle }))}
            actif={iPhase}
            choisir={setPhaseMobile}
          />
        </div>

        <p className="mt-3 border-t border-border pt-2 text-xs text-text-muted">
          {programme.nom} · {sizeLabel(plan.taille, plan.deviseCompte)}
          {sel.variante ? ` · ${sel.variante}` : ''}
          <span className="hidden md:inline"> — {tableau.colonnes.map((c) => c.libelle).join(' → ')}</span>
        </p>
        </div>

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
                <td className="block align-top font-semibold md:table-cell md:py-2.5 md:pr-4">{l.libelle}</td>
                {l.cellules.map((cellule, i) => (
                  <td
                    key={tableau.colonnes[i].cle}
                    className={cx(
                      'tabular-nums align-top md:table-cell md:py-2.5 md:pr-4',
                      i === iPhase ? 'block' : 'hidden'
                    )}
                  >
                    {cellule == null ? (
                      <span className="text-text-muted">—</span>
                    ) : cellule.statut !== 'confirmed' ? (
                      <StatusBadge statut={cellule.statut} />
                    ) : (
                      <TexteEtage texte={cellule.valeur ?? '—'} className="font-semibold text-text-primary" />
                    )}
                  </td>
                ))}
                <td className="block pt-1 align-top text-text-muted md:table-cell md:py-2.5">{l.sens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
