'use client'

import { useState } from 'react'
import Image from 'next/image'

/**
 * Logo d'une firme, avec repli sur un monogramme.
 *
 * Pourquoi ce composant existe : 80 des firmes listees tirent leur logo de
 * `google.com/s2/favicons?domain=…`. Quand le domaine stocke est faux, ce
 * service ne renvoie pas d'erreur — il renvoie une image vide. La tuile
 * s'affichait donc blanche, sans rien dans la console ni dans les logs.
 * C'est exactement ce qui est arrive a Hantec Trader, dont `logo_url`
 * pointait sur « hantectrader.com », un domaine qui n'est pas le leur.
 *
 * `onError` ne se declenche pas sur une image vide mais valide ; il couvre
 * en revanche les 404, les domaines morts et les rejets CORS, qui sont les
 * autres facons dont un logo distant disparait. Dans ces cas la tuile
 * affiche l'initiale plutot qu'un carre vide.
 *
 * Le fond est blanc : la plupart des firmes livrent un logo a encre sombre
 * sur fond transparent, invisible sur une tuile foncee.
 */
export default function FirmLogo({
  src,
  name,
  size,
  className = '',
  padding = 'p-2',
}: {
  src: string | null | undefined
  name: string
  /** Cote de la tuile en pixels. Sert aussi a l'attribut `sizes`. */
  size: number
  className?: string
  padding?: string
}) {
  const [failed, setFailed] = useState(false)
  const initial = (name || '?').charAt(0).toUpperCase()

  if (!src || failed) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-emerald-500/10 text-emerald-500 font-bold ${className}`}
        aria-hidden="true"
      >
        {initial}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={name}
      fill
      // Sans `sizes`, `fill` retombe sur 100vw et le navigateur telecharge une
      // source pleine largeur pour dessiner une vignette de quelques dizaines
      // de pixels.
      sizes={`${size}px`}
      className={`object-contain ${padding} ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
