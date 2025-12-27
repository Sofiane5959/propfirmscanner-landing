'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Settings, Check } from 'lucide-react'

type ConsentType = 'all' | 'essential' | 'custom' | null

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true, // Always required
  analytics: false,
  marketing: false,
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Delay showing banner for better UX
      setTimeout(() => setShowBanner(true), 1500)
    }
  }, [])

  const saveConsent = (type: ConsentType, prefs?: CookiePreferences) => {
    const consentData = {
      type,
      preferences: prefs || preferences,
      timestamp: new Date().toISOString(),
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(consentData))
    
    // Here you would typically:
    // 1. Enable/disable Google Analytics based on analytics consent
    // 2. Enable/disable marketing pixels based on marketing consent
    
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true }
    setPreferences(allAccepted)
    saveConsent('all', allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false }
    setPreferences(essentialOnly)
    saveConsent('essential', essentialOnly)
  }

  const saveCustom = () => {
    saveConsent('custom', preferences)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Overlay for settings modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl p-6 z-[999] shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Cookie Preferences
            </h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {/* Essential */}
            <div className="flex items-start justify-between p-4 bg-gray-900/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium">Essential Cookies</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">Required</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Required for the website to function. Cannot be disabled.
                </p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between p-4 bg-gray-900/50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-white font-medium">Analytics Cookies</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Help us understand how visitors use our website (Google Analytics).
                </p>
              </div>
              <button
                onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.analytics ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.analytics ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between p-4 bg-gray-900/50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-white font-medium">Marketing Cookies</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Used to track visitors and display relevant ads.
                </p>
              </div>
              <button
                onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  preferences.marketing ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  preferences.marketing ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={acceptEssential}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
            >
              Essential Only
            </button>
            <button
              onClick={saveCustom}
              className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-[997] shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">We use cookies</h3>
                <p className="text-gray-400 text-sm">
                  We use cookies to improve your experience and analyze site traffic. 
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                  <Link href="/privacy-policy" className="text-emerald-400 hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
              <button
                onClick={acceptEssential}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Essential Only
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
