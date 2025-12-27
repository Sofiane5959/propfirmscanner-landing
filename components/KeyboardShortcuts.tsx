'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Keyboard, X, Search, Home, BarChart2, 
  Tag, Calculator, HelpCircle, ArrowRight
} from 'lucide-react'

interface Shortcut {
  key: string
  description: string
  action: () => void
  icon?: typeof Home
}

// Hook to use keyboard shortcuts
export function useKeyboardShortcuts() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const shortcuts: Shortcut[] = [
    {
      key: '/',
      description: 'Open search',
      action: () => setShowSearch(true),
      icon: Search,
    },
    {
      key: 'g h',
      description: 'Go to Home',
      action: () => router.push('/'),
      icon: Home,
    },
    {
      key: 'g c',
      description: 'Go to Compare',
      action: () => router.push('/compare'),
      icon: BarChart2,
    },
    {
      key: 'g d',
      description: 'Go to Deals',
      action: () => router.push('/deals'),
      icon: Tag,
    },
    {
      key: 'g t',
      description: 'Go to Tools',
      action: () => router.push('/tools'),
      icon: Calculator,
    },
    {
      key: '?',
      description: 'Show shortcuts',
      action: () => setShowHelp(prev => !prev),
      icon: HelpCircle,
    },
    {
      key: 'Escape',
      description: 'Close modal',
      action: () => {
        setShowHelp(false)
        setShowSearch(false)
      },
    },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      // Allow Escape to close modals even in inputs
      if (e.key === 'Escape') {
        setShowHelp(false)
        setShowSearch(false)
      }
      return
    }

    // Handle single key shortcuts
    if (e.key === '/') {
      e.preventDefault()
      setShowSearch(true)
      return
    }

    if (e.key === '?') {
      e.preventDefault()
      setShowHelp(prev => !prev)
      return
    }

    if (e.key === 'Escape') {
      setShowHelp(false)
      setShowSearch(false)
      return
    }

    // Handle "g" prefix shortcuts
    if (e.key === 'g') {
      const handleSecondKey = (e2: KeyboardEvent) => {
        const combo = `g ${e2.key}`
        const shortcut = shortcuts.find(s => s.key === combo)
        if (shortcut) {
          e2.preventDefault()
          shortcut.action()
        }
        document.removeEventListener('keydown', handleSecondKey)
      }

      setTimeout(() => {
        document.addEventListener('keydown', handleSecondKey, { once: true })
        // Remove listener after 1 second if no second key pressed
        setTimeout(() => {
          document.removeEventListener('keydown', handleSecondKey)
        }, 1000)
      }, 0)
    }
  }, [router, shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { showHelp, setShowHelp, showSearch, setShowSearch, shortcuts }
}

// Keyboard Shortcuts Modal
export function KeyboardShortcutsModal() {
  const { showHelp, setShowHelp, shortcuts } = useKeyboardShortcuts()

  if (!showHelp) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[200]"
        onClick={() => setShowHelp(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-[201]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-1 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {shortcuts.filter(s => s.description !== 'Close modal').map((shortcut) => (
            <div 
              key={shortcut.key}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                {shortcut.icon && (
                  <shortcut.icon className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-300">{shortcut.description}</span>
              </div>
              <kbd className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-300 text-sm font-mono">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </>
  )
}

// Quick Search Modal (activated by /)
export function QuickSearchModal() {
  const router = useRouter()
  const { showSearch, setShowSearch } = useKeyboardShortcuts()
  const [query, setQuery] = useState('')

  const quickLinks = [
    { label: 'Compare Prop Firms', href: '/compare', icon: BarChart2 },
    { label: 'Deals & Discounts', href: '/deals', icon: Tag },
    { label: 'Risk Calculator', href: '/tools/risk-calculator', icon: Calculator },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
  ]

  const filteredLinks = query
    ? quickLinks.filter(link => 
        link.label.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks

  const handleSelect = (href: string) => {
    router.push(href)
    setShowSearch(false)
    setQuery('')
  }

  if (!showSearch) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[200]"
        onClick={() => setShowSearch(false)}
      />

      {/* Modal */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-lg bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-[201]">
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search or jump to..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="p-2 max-h-64 overflow-y-auto">
          {filteredLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleSelect(link.href)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-4 h-4 text-gray-400" />
                <span>{link.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </button>
          ))}
          
          {filteredLinks.length === 0 && (
            <p className="text-center text-gray-500 py-4">No results found</p>
          )}
        </div>

        <div className="p-3 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">↵</kbd> to select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded">esc</kbd> to close
          </span>
        </div>
      </div>
    </>
  )
}

// Combined Provider Component
export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <KeyboardShortcutsModal />
      <QuickSearchModal />
    </>
  )
}
