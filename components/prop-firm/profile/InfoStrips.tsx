'use client'

// 2. What [Firm] is known for — une carte, quatre faits au plus, separes par
//    des filets ; le titre n'est lu que par les lecteurs d'ecran (contrat visuel).
// 3. Informations — plateformes selectionnables, marches, moyens d'achat ou
//    data feeds, profil de trading. Toutes les valeurs visibles.

import { Check } from 'lucide-react'

import type { FirmSheet } from '@/lib/firm-sheet'
import { type StatutManquant, estIncertain, plateformesAffichees } from '@/lib/firm-profile'
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
  const reserve = (s: FirmSheet['levierStatut']): StatutManquant | null =>
    s && s !== 'confirmed' && !estIncertain(s) ? s : null
  // Rien d'incertain a l'ecran : une liste en attente de confirmation ne s'affiche pas.
  const categories = estIncertain(sheet.categoriesActifsStatut) ? [] : sheet.categoriesActifs
  const levierSur = !estIncertain(sheet.levierStatut)
  // Les flux choisis a l'achat, sinon ceux que la fiche liste pour information.
  const dataFeeds = Array.from(
    new Set([...sheet.optionsAchat.filter((o) => o.type === 'data_feed').map((o) => o.nom), ...(sheet.fluxDonnees ?? [])])
  )
  const levierReserve = reserve(sheet.levierStatut)
  // Icones officielles des plateformes (onglet Plateformes, colonne logo_url).
  const logos = new Map([
    ...sheet.plateformesDetail.filter((p) => p.logoUrl).map((p) => [p.nom, p.logoUrl as string] as const),
    ...sheet.optionsAchat.filter((o) => o.logoUrl).map((o) => [o.nom, o.logoUrl as string] as const),
  ])

  const groupes: Groupe[] = [
    { label: COPY.info.platforms, valeurs: plateformesAffichees(sheet), statut: null },
    { label: COPY.info.markets, valeurs: categories, statut: reserve(sheet.categoriesActifsStatut) },
    dataFeeds.length > 0
      ? { label: COPY.info.dataFeeds, valeurs: dataFeeds, statut: null }
      : { label: COPY.info.purchase, valeurs: sheet.moyensPaiement, statut: null },
    {
      label: COPY.info.profile,
      valeurs: [
        ...(levierSur && !levierReserve && sheet.levier ? [`${COPY.info.leverage} ${sheet.levier}`] : []),
        ...sheet.stylesTrading,
      ],
      statut: null,
    },
  ]
  // Une carte sans aucune valeur confirmee n'apporte rien : elle disparait,
  // meme si un statut explique l'absence (« Needs confirmation », « Not applicable »).
  const visibles = groupes.filter((g) => g.valeurs.length > 0)
  if (visibles.length === 0) return null

  return (
    <section aria-label={COPY.info.title} className="pb-5">
      <Container>
        <div className={cx('grid gap-3', COLONNES[visibles.length])}>
          {visibles.map((g) => {
            // Plateformes et flux de donnees portent leur logo (commentaires du 22/09).
            const plateformes = g.label === COPY.info.platforms || g.label === COPY.info.dataFeeds
            return (
            <article key={g.label} className={cx(CARD, 'p-4')}>
              {/* Titre de carte plus present que le petit libelle gris (commentaire du 22/09). */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">{g.label}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {g.valeurs.map((v) => (
                  <span key={v} className={cx(CHIP, plateformes && 'inline-flex items-center gap-1.5 pl-1.5')}>
                    {/* Pastille a l'initiale : elle distingue les plateformes d'un
                        coup d'oeil sans reprendre un logo qui ne nous appartient pas. */}
                    {plateformes && (logos.get(v) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logos.get(v)!} alt="" className="h-5 w-5 shrink-0 rounded bg-white object-contain" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="grid h-5 w-5 shrink-0 place-items-center rounded bg-dark-700 text-[10px] font-bold text-text-primary"
                      >
                        {v.charAt(0)}
                      </span>
                    ))}
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
            )
          })}
        </div>
      </Container>
    </section>
  )
}
