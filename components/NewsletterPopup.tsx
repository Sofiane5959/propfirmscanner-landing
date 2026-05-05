'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { X, Mail, Check, Loader2 } from 'lucide-react'
import { useNewsletterPopup } from '@/hooks/useNewsletterPopup'

/**
 * NewsletterPopup — centered modal that captures email + name + trader level.
 *
 * Behavior:
 *   - Auto-shows after 30 seconds on the page (see useNewsletterPopup hook)
 *   - Hidden on excluded routes (dashboard, quiz, admin, legal pages)
 *   - On submit: POST /api/newsletter, show success state, close after 4s
 *   - User must check the email to confirm subscription (Mailchimp double opt-in)
 *
 * Design system v1.0 — see DESIGN_SYSTEM.md.
 *
 * Exports both `NewsletterPopup` (named) and `default` for maximum compat
 * with both `import { NewsletterPopup } from '...'` and
 *      `import NewsletterPopup from '...'` styles.
 */

// Routes where the popup should NOT appear.
// Match by prefix — /dashboard catches /dashboard, /dashboard/favorites, etc.
const EXCLUDED_PATH_PREFIXES = [
  '/dashboard',
  '/quiz',
  '/admin',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/how-we-make-money',
  '/api',
]

function isExcluded(pathname: string): boolean {
  // Strip the locale prefix (e.g. "/en/dashboard" → "/dashboard")
  const stripped = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '')
  return EXCLUDED_PATH_PREFIXES.some(
    prefix => stripped === prefix || stripped.startsWith(`${prefix}/`)
  )
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export function NewsletterPopup() {
  const pathname = usePathname() || '/'
  const enabled = !isExcluded(pathname)
  const { isOpen, close, markSubscribed } = useNewsletterPopup({ enabled })

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [traderLevel, setTraderLevel] = useState<'beginner' | 'intermediate' | 'expert' | ''>('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const emailInputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the email input when the popup opens — but defer so the entrance
  // animation has a chance to run smoothly.
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => emailInputRef.current?.focus(), 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // ESC closes the popup (accessibility)
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  if (!enabled) return null
  if (!isOpen && submitState !== 'success') return null

  const sourcePage = pathname
  const sourceLocale = pathname.match(/^\/([a-z]{2})(?=\/|$)/)?.[1] || 'en'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitState === 'submitting') return
    if (!email.trim() || !name.trim() || !traderLevel) {
      setErrorMessage('Please fill in all fields.')
      setSubmitState('error')
      return
    }

    setSubmitState('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          traderLevel,
          sourcePage,
          sourceLocale,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        setErrorMessage(
          data.error === 'invalid_email'
            ? 'That email looks invalid — try again.'
            : 'Something went wrong. Please try again in a moment.'
        )
        setSubmitState('error')
        return
      }

      setSubmitState('success')
      markSubscribed()
      // Auto-close after 4 seconds so the user sees the success message
      setTimeout(() => setSubmitState('idle'), 4000)
    } catch {
      setErrorMessage('Network error. Please try again.')
      setSubmitState('error')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <div className="relative w-full max-w-md bg-bg-elevated border border-border rounded-lg shadow-2xl">
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          className="absolute top-3 right-3 p-2 text-text-muted hover:text-text-primary hover:bg-bg-base rounded-md transition-colors"
          aria-label="Close newsletter popup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {submitState === 'success' ? (
            <SuccessState email={email} />
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-accent-subtle border border-accent-border mb-4">
                  <Mail className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <p className="eyebrow mb-2">Newsletter — free</p>
                <h2 id="newsletter-popup-title" className="text-h2 text-text-primary mb-2">
                  Top 3 picks every Monday
                </h2>
                <p className="text-small text-text-secondary">
                  Get our 3 best prop firms of the week + exclusive deals delivered to your inbox.
                  No spam, unsubscribe in one click.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="newsletter-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="newsletter-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoComplete="name"
                    maxLength={100}
                    className="w-full px-3 py-2.5 bg-bg-base border border-border rounded-md text-small text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    ref={emailInputRef}
                    id="newsletter-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    maxLength={254}
                    className="w-full px-3 py-2.5 bg-bg-base border border-border rounded-md text-small text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <p className="text-tiny text-text-secondary mb-2 uppercase tracking-wider font-medium">
                    Your trading level
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['beginner', 'intermediate', 'expert'] as const).map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setTraderLevel(level)}
                        className={`px-3 py-2 text-small font-medium rounded-md border transition-colors capitalize ${
                          traderLevel === level
                            ? 'bg-accent text-white border-accent'
                            : 'bg-bg-base text-text-secondary border-border hover:border-border-hover hover:text-text-primary'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {submitState === 'error' && errorMessage && (
                  <p className="text-tiny text-danger" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitState === 'submitting'}
                  className="w-full px-4 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-small rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {submitState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing…
                    </>
                  ) : (
                    'Get the newsletter'
                  )}
                </button>

                <p className="text-tiny text-text-muted text-center">
                  By subscribing you agree to receive our weekly newsletter. You can unsubscribe at any time.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SuccessState({ email }: { email: string }) {
  return (
    <div className="text-center py-4">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-accent-subtle border border-accent-border mb-4">
        <Check className="w-5 h-5 text-accent" strokeWidth={2} />
      </div>
      <h2 className="text-h2 text-text-primary mb-3">Almost there!</h2>
      <p className="text-small text-text-secondary mb-2">
        We sent a confirmation link to:
      </p>
      <p className="text-small text-text-primary font-medium mb-4 break-all">{email}</p>
      <p className="text-tiny text-text-muted">
        Click the link in your inbox to confirm your subscription. Check your spam folder if you don&apos;t see it within a minute.
      </p>
    </div>
  )
}

// Default export for compatibility with PopupsWrapper or any code that
// imports it as `import NewsletterPopup from './NewsletterPopup'`
export default NewsletterPopup
