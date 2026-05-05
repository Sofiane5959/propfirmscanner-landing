'use client'

import { useEffect, useState } from 'react'

/**
 * useNewsletterPopup — controls when the newsletter popup shows.
 *
 * Rules (see DESIGN_SYSTEM.md / Sprint 2 Livraison 4):
 *   - Show after 30 seconds on the page (triggerDelay)
 *   - If the user has dismissed it before, wait 7 days (DISMISS_COOLDOWN_DAYS)
 *   - If the user has subscribed, never show again (SUBSCRIBED_KEY)
 *   - Excluded paths (passed in via `enabled=false`) skip everything
 *
 * Storage:
 *   - localStorage keys persist across sessions, which is what we want.
 *   - Keys are namespaced under "pfs_newsletter_*" to avoid collisions.
 */

const DISMISS_KEY = 'pfs_newsletter_dismissed_at'
const SUBSCRIBED_KEY = 'pfs_newsletter_subscribed'
const DISMISS_COOLDOWN_DAYS = 7
const TRIGGER_DELAY_MS = 30_000

interface UseNewsletterPopupOptions {
  enabled: boolean
}

interface UseNewsletterPopupReturn {
  isOpen: boolean
  open: () => void
  close: () => void          // user clicked X or backdrop — counts as dismissal
  markSubscribed: () => void // user successfully signed up
}

export function useNewsletterPopup({ enabled }: UseNewsletterPopupOptions): UseNewsletterPopupReturn {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    // Already subscribed → never show
    if (window.localStorage.getItem(SUBSCRIBED_KEY) === '1') return

    // Recently dismissed → respect cooldown
    const dismissedAt = window.localStorage.getItem(DISMISS_KEY)
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10)
      if (!Number.isNaN(dismissedTime)) {
        const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
        if (daysSinceDismiss < DISMISS_COOLDOWN_DAYS) return
      }
    }

    // All clear — schedule the trigger
    const timer = window.setTimeout(() => {
      setIsOpen(true)
    }, TRIGGER_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [enabled])

  const open = () => setIsOpen(true)

  const close = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
    }
  }

  const markSubscribed = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SUBSCRIBED_KEY, '1')
      // Also clear the dismiss key — they're inscrits now, no longer dismissed
      window.localStorage.removeItem(DISMISS_KEY)
    }
  }

  return { isOpen, open, close, markSubscribed }
}
