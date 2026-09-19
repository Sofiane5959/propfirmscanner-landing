'use client'

// 2. What [Firm] is known for — une carte, quatre faits au plus, separes par
//    des filets ; le titre n'est lu que par les lecteurs d'ecran (contrat visuel).
// 3. Informations — plateformes selectionnables, marches, moyens d'achat ou
//    data feeds, profil de trading. Toutes les valeurs visibles.

import { Check } from 'lucide-react'

import type { FirmSheet } from '@/lib/firm-sheet'
import { type StatutManquant, plateformesAffichees } from '@/lib/firm-profile'
import { COPY } from './copy'
import { CARD, CHIP, Container, LABEL, StatusBadge, cx } from './ui'

const COLONNES: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export function KnownForStrip({ sheet }: { sheet: FirmSheet }) {
  const faits = sheet.connuPour.slice(0, 4)
  if (faits.length === 0) return null
  return (
    <section aria-labelledby="known-for" className="pb-5">
      <Container>
        <h2 id="known-for" className="sr-only">
          {COPY.knownFor(sheet.nom)}
        </h2>
        <ul className={cx(CARD, 'grid overflow-hidden', COLONNES[faits.length])}>
          {faits.map((fait, i) => (
            <li
              key={fait.titre}
              className={cx(
                'flex gap-2.5 px-4 py-4',
                i > 0 && 'border-t border-border sm:border-t-0',
                i > 0 && 'sm:border-l',
                i === 2 && faits.length === 4 && 'sm:border-l-0 lg:border-l sm:border-t lg:border-t-0'
              )}
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-text-primary">{fait.titre}</p>
                {fait.detail && <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{fait.detail}</p>}
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

export function InfoCards({ sheet }: { sheet: FirmSheet }) {
  const reserve = (s: FirmSheet['levierStatut']): StatutManquant | null => (s && s !== 'confirmed' ? s : null)
  const dataFeeds = Array.from(new Set(sheet.optionsAchat.filter((o) => o.type === 'data_feed').map((o) => o.nom)))
  const levierReserve = reserve(sheet.levierStatut)

  const groupes: Groupe[] = [
    { label: COPY.info.platforms, valeurs: plateformesAffichees(sheet), statut: null },
    { label: COPY.info.markets, valeurs: sheet.categoriesActifs, statut: reserve(sheet.categoriesActifsStatut) },
    dataFeeds.length > 0
      ? { label: COPY.info.dataFeeds, valeurs: dataFeeds, statut: null }
      : { label: COPY.info.purchase, valeurs: sheet.moyensPaiement, statut: null },
    {
      label: COPY.info.profile,
      valeurs: [...(!levierReserve && sheet.levier ? [`${COPY.info.leverage} ${sheet.levier}`] : []), ...sheet.stylesTrading],
      statut: null,
    },
  ]
  const visibles = groupes.filter(
    (g) => g.valeurs.length > 0 || g.statut || (g.label === COPY.info.profile && levierReserve)
  )
  if (visibles.length === 0) return null

  return (
    <section aria-label={COPY.info.profile} className="pb-5">
      <Container>
        <div className={cx('grid gap-3', COLONNES[visibles.length])}>
          {visibles.map((g) => (
            <article key={g.label} className={cx(CARD, 'p-4')}>
              <p className={LABEL}>{g.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {g.valeurs.map((v) => (
                  <span key={v} className={CHIP}>
                    {v}
                  </span>
                ))}
                {g.label === COPY.info.profile && levierReserve && (
                  <span className={cx(CHIP, 'inline-flex items-center gap-1.5')}>
                    {COPY.info.leverage} <StatusBadge statut={levierReserve} />
                  </span>
                )}
                {g.statut && <StatusBadge statut={g.statut} />}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
