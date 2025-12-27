'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Gift, Check, Loader2 } from 'lucide-react'

interface NewsletterPopupProps {
  delay?: number // Delay in ms before showing popup
  showOnExitIntent?: boolean
}

export default function NewsletterPopup({ 
  delay = 30000, // 30 seconds default
  showOnExitIntent = true 
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Check if user has already seen popup or subscribed
    const hasSeenPopup = localStorage.getItem('newsletter_popup_seen')
    const hasSubscribed = localStorage.getItem('newsletter_subscribed')
    
    if (hasSeenPopup || hasSubscribed) return

    // Timer-based popup
    const timer = setTimeout(() => {
      setIsOpen(true)
      localStorage.setItem('newsletter_popup_seen', 'true')
    }, delay)

    // Exit intent detection (desktop only)
    const handleExitIntent = (e: MouseEvent) => {
      if (showOnExitIntent && e.clientY <= 0 && !hasSeenPopup) {
        setIsOpen(true)
        localStorage.setItem('newsletter_popup_seen', 'true')
      }
    }

    document.addEventListener('mouseout', handleExitIntent)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseout', handleExitIntent)
    }
  }, [delay, showOnExitIntent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      })

      if (response.ok) {
        setStatus('success')
        localStorage.setItem('newsletter_subscribed', 'true')
        // Close popup after 3 seconds
        setTimeout(() => setIsOpen(false), 3000)
      } else {
        throw new Error('Subscription failed')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[1000]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[1001]">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mx-4 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {status === 'success' ? (
              // Success state
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You&apos;re In!</h3>
                <p className="text-gray-400">
                  Check your inbox for exclusive deals and tips.
                </p>
              </div>
            ) : (
              // Form state
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Get Exclusive Deals
                  </h3>
                  <p className="text-gray-400">
                    Join 5,000+ traders getting weekly discount codes and prop firm updates.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      'Get Free Deals'
                    )}
                  </button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Weekly deals
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Price alerts
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      New firm alerts
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Trading tips
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
