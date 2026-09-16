'use client'

// 2. What [Firm] is known for — quatre faits au plus, sur une ligne en desktop.
// 3. Quick information — plateformes, actifs, data feeds ou moyens d'achat,
//    profil de trading. Toutes les valeurs visibles, jamais de « +N more ».

import { Check } from 'lucide-react'

import { type FirmSheet, assetsLabel } from '@/lib/firm-sheet'
import { type StatutManquant, plateformesAffichees } from '@/lib/firm-profile'
import { COPY } from './copy'
import { CHIP, Container, LABEL, StatusBadge } from './ui'

export function KnownForStrip({ sheet }: { sheet: FirmSheet }) {
  if (sheet.connuPour.length === 0) return null
  return (
    <section aria-labelledby="known-for" className="border-y border-border bg-bg-elevated/40">
      <Container className="py-5">
        <h2 id="known-for" className={LABEL}>
          {COPY.knownFor(sheet.nom)}
        </h2>
        <ul className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {sheet.connuPour.map((fait) => (
            <li key={fait.titre} className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-text-primary">{fait.titre}</p>
                {fait.detail && <p className="text-xs leading-relaxed text-text-secondary">{fait.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

interface Groupe {
  label: string
  valeurs: string[]
  statut: StatutManquant | null
}

export function QuickInfoStrip({ sheet }: { sheet: FirmSheet }) {
  const reserve = (s: FirmSheet['levierStatut']): StatutManquant | null => (s && s !== 'confirmed' ? s : null)
  const dataFeeds = Array.from(new Set(sheet.optionsAchat.filter((o) => o.type === 'data_feed').map((o) => o.nom)))

  const levier = reserve(sheet.levierStatut)
    ? []
    : sheet.levier
      ? [`${COPY.quick.leverage} ${sheet.levier}`]
      : []

  const groupes: Groupe[] = [
    { label: COPY.quick.platforms, valeurs: plateformesAffichees(sheet), statut: null },
    {
      label: assetsLabel(sheet.marches),
      valeurs: sheet.categoriesActifs,
      statut: reserve(sheet.categoriesActifsStatut),
    },
    dataFeeds.length > 0
      ? { label: COPY.quick.dataFeeds, valeurs: dataFeeds, statut: null }
      : { label: COPY.quick.purchase, valeurs: sheet.moyensPaiement, statut: null },
    {
      label: COPY.quick.profile,
      valeurs: [...levier, ...sheet.stylesTrading],
      statut: null,
    },
  ]
  const levierReserve = reserve(sheet.levierStatut)
  const visibles = groupes.filter(
    (g) => g.valeurs.length > 0 || g.statut || (g.label === COPY.quick.profile && levierReserve)
  )
  if (visibles.length === 0) return null

  return (
    <section aria-labelledby="quick-info" className="py-5">
      <Container>
        <h2 id="quick-info" className="sr-only">
          {COPY.quick.title}
        </h2>
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibles.map((g) => (
            <div key={g.label}>
              <dt className={LABEL}>{g.label}</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-1.5">
                {g.valeurs.map((v) => (
                  <span key={v} className={CHIP}>
                    {v}
                  </span>
                ))}
                {g.label === COPY.quick.profile && levierReserve && (
                  <span className={CHIP}>
                    {COPY.quick.leverage} <StatusBadge statut={levierReserve} />
                  </span>
                )}
                {g.statut && <StatusBadge statut={g.statut} />}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
