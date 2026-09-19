'use client'

// Enregistrer et partager la firme, en tete du hero. Le favori suit la meme
// convention que /compare et le tableau de bord : la liste locale
// `pfs_favorites` (visiteur anonyme) et la table `user_favorites` quand un
// membre est connecte. L'ecriture en base ne bloque jamais le bouton.

import { useEffect, useState } from 'react'
import { Check, Heart, Share2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { COPY } from './copy'
import { cx } from './ui'

const CLE = 'pfs_favorites'

function lireFavoris(): string[] {
  try {
    const brut = window.localStorage.getItem(CLE)
    const liste: unknown = brut ? JSON.parse(brut) : []
    return Array.isArray(liste) ? liste.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function ecrireFavoris(liste: string[]) {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(liste))
  } catch {
    // Stockage indisponible (navigation privee) : l'etat reste celui de la page.
  }
}

async function synchroniser(firmId: string, ajouter: boolean) {
  try {
    const supabase = createClientComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    if (ajouter) {
      await supabase.from('user_favorites').upsert({ user_id: user.id, prop_firm_id: firmId }, { onConflict: 'user_id,prop_firm_id' })
    } else {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('prop_firm_id', firmId)
    }
  } catch {
    // Le favori local suffit ; la synchronisation reessaiera au prochain clic.
  }
}

const BOUTON =
  'inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

export function FirmActions({ firmId, nom }: { firmId: string | null; nom: string }) {
  const [enregistre, setEnregistre] = useState(false)
  const [copie, setCopie] = useState(false)

  useEffect(() => {
    if (firmId) setEnregistre(lireFavoris().includes(firmId))
  }, [firmId])

  const basculer = () => {
    if (!firmId) return
    const ajouter = !enregistre
    const liste = lireFavoris().filter((id) => id !== firmId)
    ecrireFavoris(ajouter ? [...liste, firmId] : liste)
    setEnregistre(ajouter)
    void synchroniser(firmId, ajouter)
  }

  const partager = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${nom} - PropFirmScanner`, url })
        return
      } catch {
        // Partage annule : on n'insiste pas.
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopie(true)
      setTimeout(() => setCopie(false), 1500)
    } catch {
      // Presse-papiers refuse : rien a signaler de plus.
    }
  }

  return (
    <div className="flex shrink-0 gap-2">
      {firmId && (
        <button
          type="button"
          data-check="save-firm"
          aria-pressed={enregistre}
          onClick={basculer}
          className={cx(
            BOUTON,
            enregistre
              ? 'border-danger/40 bg-danger/10 text-danger'
              : 'border-border bg-bg-base text-text-secondary hover:border-border-hover hover:text-text-primary'
          )}
        >
          <Heart className={cx('h-4 w-4', enregistre && 'fill-current')} aria-hidden="true" />
          {enregistre ? COPY.hero.saved : COPY.hero.save}
        </button>
      )}
      <button
        type="button"
        data-check="share-firm"
        onClick={partager}
        aria-live="polite"
        className={cx(BOUTON, 'border-border bg-bg-base text-text-secondary hover:border-border-hover hover:text-text-primary')}
      >
        {copie ? <Check className="h-4 w-4 text-accent" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
        {copie ? COPY.hero.linkCopied : COPY.hero.share}
      </button>
    </div>
  )
}
