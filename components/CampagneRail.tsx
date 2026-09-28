'use client'

// =============================================================================
// BANDEAU DE CAMPAGNE                              components/CampagneRail.tsx
// =============================================================================
// Une campagne datee, mise en avant sur tout le site : rail vertical a droite
// sur grand ecran, barre en bas sur mobile.
//
// AUCUNE DONNEE DE FIRME ICI. Le bandeau recoit ce qu'il affiche, et la source
// est data/firms/<slug>.xlsx : le code, le pourcentage, la phrase d'accroche et
// la date de fin. Ajouter une campagne = remplir l'onglet Offre d'une fiche,
// jamais toucher ce fichier.
//
// Il disparait tout seul :
//   - quand la date de fin est passee, y compris pendant que l'onglet est
//     ouvert (le compte a rebours le verifie chaque seconde) ;
//   - quand le visiteur le ferme, pour 24 heures, memorise dans son navigateur.
// =============================================================================

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface Campagne {
  slug: string
  nom: string
  logoUrl: string | null
  code: string
  /** Fraction : 0.6 pour 60 %. */
  remise: number
  accroche: string | null
  /** Date ISO de fin. Le bandeau se retire de lui-meme apres. */
  finLe: string
  href: string
}

const CLE = 'pfs-campagne-fermee'
const JOUR = 24 * 60 * 60 * 1000

function restant(fin: number) {
  const ms = fin - Date.now()
  if (ms <= 0) return null
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`
}

export function CampagneRail({ campagne }: { campagne: Campagne | null }) {
  const fin = campagne ? new Date(campagne.finLe).getTime() : 0
  const [temps, setTemps] = useState<string | null>(null)
  const [ferme, setFerme] = useState(true)

  useEffect(() => {
    if (!campagne) return
    try {
      const jusqua = Number(localStorage.getItem(CLE) || 0)
      setFerme(Date.now() < jusqua)
    } catch {
      setFerme(false)
    }
  }, [campagne])

  useEffect(() => {
    if (!campagne) return
    const tic = () => setTemps(restant(fin))
    tic()
    const id = setInterval(tic, 1000)
    return () => clearInterval(id)
  }, [campagne, fin])

  if (!campagne || ferme || temps === null) return null

  const fermer = () => {
    setFerme(true)
    try {
      localStorage.setItem(CLE, String(Date.now() + JOUR))
    } catch {
      /* navigation privee : le bandeau reviendra au prochain chargement */
    }
  }

  const pourcent = `${Math.round(campagne.remise * 100)}%`

  return (
    <aside
      aria-label={`${campagne.nom} — ${pourcent} off`}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-accent-border bg-bg-elevated shadow-[0_-4px_16px_rgba(0,0,0,0.18)] lg:inset-x-auto lg:bottom-auto lg:right-4 lg:top-1/2 lg:w-60 lg:-translate-y-1/2 lg:rounded-2xl lg:border lg:shadow-xl"
    >
      <button
        onClick={fermer}
        aria-label="Close"
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg text-text-muted hover:text-text-primary"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:flex-col lg:items-stretch lg:gap-2.5 lg:px-4 lg:py-4">
        <div className="flex items-center gap-2.5 lg:flex-col lg:items-center lg:text-center">
          {campagne.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campagne.logoUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-lg border border-border bg-white object-contain p-1 lg:h-11 lg:w-11"
            />
          )}
          <p className="font-display text-sm font-bold text-text-primary lg:text-base">{campagne.nom}</p>
        </div>

        <p className="hidden font-display text-3xl font-bold leading-none text-accent lg:block lg:text-center">
          {pourcent} OFF
        </p>
        <p className="font-display text-xl font-bold leading-none text-accent lg:hidden">{pourcent} OFF</p>

        {campagne.accroche && (
          <p className="hidden text-xs leading-relaxed text-text-secondary lg:block lg:text-center">{campagne.accroche}</p>
        )}

        {/* Le compte a rebours porte l'urgence : pastille coloree, chiffres a
            largeur fixe pour qu'ils ne sautent pas a chaque seconde, et visible
            des le petit ecran — il ne restait qu'au bureau. */}
        <p className="hidden items-center justify-center gap-1.5 rounded-lg bg-deal-subtle px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-deal sm:inline-flex lg:flex">
          Ends in <span className="font-mono tabular-nums">{temps}</span>
        </p>

        <a
          href={campagne.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="ml-auto flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-accent-hover px-4 text-sm font-medium text-white hover:brightness-110 lg:ml-0"
        >
          Get {pourcent} off
        </a>

        <p className="hidden text-center text-[11px] text-text-muted lg:block">
          Code <span className="font-mono text-text-primary">{campagne.code}</span>
        </p>
      </div>
    </aside>
  )
}
