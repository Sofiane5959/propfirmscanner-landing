'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing, X, Check, AlertCircle } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface PriceAlertModalProps {
  firmId: string
  firmName: string
  firmLogo?: string
  currentPrice: number
  onClose: () => void
}

export default function PriceAlertModal({ 
  firmId, 
  firmName, 
  firmLogo,
  currentPrice, 
  onClose 
}: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.85))
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    setIsVisible(true)
    document.body.style.overflow = 'hidden'
    
    // Pre-fill email if user is logged in
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setEmail(user.email)
    }
    getUser()
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [supabase.auth])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  const discountPercent = Math.round((1 - targetPrice / currentPrice) * 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error: insertError } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user?.id || null,
          email: email.toLowerCase().trim(),
          prop_firm_id: firmId,
          target_price: targetPrice,
          current_price_at_creation: currentPrice,
          is_active: true,
        })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(handleClose, 2000)
    } catch (err: any) {
      console.error('Alert creation error:', err)
      setError(err.message || 'Failed to create alert. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={handleClose} 
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-bg-elevated rounded-2xl border border-border w-full max-w-md overflow-hidden transition-all duration-200 ${
          isVisible ? 'scale-100' : 'scale-95'
        }`}
      >
        {success ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Alert Created!</h3>
            <p className="text-text-secondary">
              We'll email you when <span className="text-white">{firmName}</span> drops to <span className="text-accent">${targetPrice}</span>
            </p>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent rounded-xl flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Price Alert</h3>
                  <p className="text-sm text-text-secondary">{firmName}</p>
                </div>
              </div>
              <button 
                onClick={handleClose} 
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Current Price Display */}
              <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl">
                <span className="text-text-secondary">Current price</span>
                <span className="text-xl font-bold text-white">${currentPrice}</span>
              </div>

              {/* Target Price Input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Alert me when price drops to
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg">$</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-border rounded-xl text-white text-lg font-medium focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    min={1}
                    max={currentPrice - 1}
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-text-muted">
                    {discountPercent > 0 ? `${discountPercent}% discount` : 'Set a lower price'}
                  </p>
                  {/* Quick select buttons */}
                  <div className="flex gap-1">
                    {[10, 15, 20, 25].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTargetPrice(Math.floor(currentPrice * (1 - pct / 100)))}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          discountPercent === pct
                            ? 'bg-accent-hover text-white'
                            : 'bg-dark-600 text-text-secondary hover:bg-dark-500'
                        }`}
                      >
                        -{pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email for notification
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-dark-700 border border-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || targetPrice >= currentPrice}
                className="w-full py-3.5 bg-accent-hover hover:brightness-110 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Alert...
                  </>
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    Create Price Alert
                  </>
                )}
              </button>

              {/* Info */}
              <p className="text-xs text-text-muted text-center">
                We'll only email you when the price drops. No spam, ever.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
