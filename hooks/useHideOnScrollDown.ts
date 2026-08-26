'use client'

import { useEffect, useState } from 'react'

interface Options {
  /** Stay visible until the visitor is this far down. */
  threshold?: number
  /** Ignore movements smaller than this, so momentum jitter cannot flicker it. */
  delta?: number
  /** Force it visible — a menu is open, for instance. */
  disabled?: boolean
}

/**
 * True while the visitor is scrolling down, false the moment they scroll up.
 *
 * The site stacks a fixed navbar and a sticky offers banner, and on a phone a
 * fixed CTA bar under those: 181px of permanent chrome on an 812px screen, more
 * than a quarter of a 667px one. Collapsing the top pair while someone is
 * reading gives that space back without taking the banner away — any upward
 * flick brings both straight back, which is also when a reader is looking for
 * navigation or an offer.
 *
 * Deliberately direction-based rather than distance-based: hiding a header for
 * good punishes people who scroll past something and want it again.
 */
export function useHideOnScrollDown({ threshold = 140, delta = 8, disabled = false }: Options = {}): boolean {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (disabled) {
      setHidden(false)
      return
    }

    let last = window.scrollY
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY

      // Near the top the header always shows, whatever the direction. This also
      // covers overscroll bounce, where y can go negative.
      if (y <= threshold) {
        setHidden(false)
        last = y
        return
      }

      const moved = y - last
      if (Math.abs(moved) < delta) return
      setHidden(moved > 0)
      last = y
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    // A keyboard user tabbing into the header must never be left addressing an
    // element that has slid off the screen.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('[data-collapsing-header]')) setHidden(false)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('focusin', onFocusIn)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('focusin', onFocusIn)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [threshold, delta, disabled])

  return hidden
}
