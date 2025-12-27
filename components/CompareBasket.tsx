'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { 
  Plus, X, Scale, Trash2, ArrowRight,
  Check, AlertCircle
} from 'lucide-react'

// Types
interface BasketItem {
  slug: string
  name: string
}

interface CompareBasketContextType {
  items: BasketItem[]
  addItem: (item: BasketItem) => void
  removeItem: (slug: string) => void
  clearBasket: () => void
  isInBasket: (slug: string) => boolean
  maxItems: number
}

// Context
const CompareBasketContext = createContext<CompareBasketContextType | null>(null)

// Provider
export function CompareBasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([])
  const maxItems = 4

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compare_basket')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        // Invalid data
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('compare_basket', JSON.stringify(items))
  }, [items])

  const addItem = (item: BasketItem) => {
    if (items.length >= maxItems) return
    if (items.some(i => i.slug === item.slug)) return
    setItems([...items, item])
  }

  const removeItem = (slug: string) => {
    setItems(items.filter(i => i.slug !== slug))
  }

  const clearBasket = () => {
    setItems([])
  }

  const isInBasket = (slug: string) => {
    return items.some(i => i.slug === slug)
  }

  return (
    <CompareBasketContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearBasket, 
      isInBasket,
      maxItems 
    }}>
      {children}
    </CompareBasketContext.Provider>
  )
}

// Hook
export function useCompareBasket() {
  const context = useContext(CompareBasketContext)
  if (!context) {
    throw new Error('useCompareBasket must be used within CompareBasketProvider')
  }
  return context
}

// Add to Basket Button
interface AddToBasketButtonProps {
  firm: BasketItem
  compact?: boolean
}

export function AddToBasketButton({ firm, compact = false }: AddToBasketButtonProps) {
  const { addItem, removeItem, isInBasket, items, maxItems } = useCompareBasket()
  const inBasket = isInBasket(firm.slug)
  const isFull = items.length >= maxItems

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inBasket) {
      removeItem(firm.slug)
    } else if (!isFull) {
      addItem(firm)
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={isFull && !inBasket}
        className={`p-2 rounded-lg transition-colors ${
          inBasket
            ? 'bg-emerald-500 text-white'
            : isFull
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-700 text-gray-300 hover:bg-emerald-500 hover:text-white'
        }`}
        title={inBasket ? 'Remove from compare' : isFull ? 'Compare basket full' : 'Add to compare'}
      >
        {inBasket ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isFull && !inBasket}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        inBasket
          ? 'bg-emerald-500 text-white'
          : isFull
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-gray-300 hover:bg-emerald-500 hover:text-white'
      }`}
    >
      {inBasket ? (
        <>
          <Check className="w-4 h-4" />
          Added
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Compare
        </>
      )}
    </button>
  )
}

// Floating Basket
export function FloatingCompareBasket() {
  const { items, removeItem, clearBasket } = useCompareBasket()
  const [isExpanded, setIsExpanded] = useState(false)

  if (items.length === 0) return null

  const compareUrl = `/compare/custom?firms=${items.map(i => i.slug).join(',')}`

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {/* Expanded View */}
      {isExpanded && (
        <div className="mb-3 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-2xl w-80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold">Compare Basket</span>
            <button
              onClick={clearBasket}
              className="text-gray-400 hover:text-red-400 text-sm flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div 
                key={item.slug}
                className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2"
              >
                <span className="text-gray-300 text-sm">{item.name}</span>
                <button
                  onClick={() => removeItem(item.slug)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {items.length >= 2 ? (
            <Link
              href={compareUrl}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg"
            >
              Compare {items.length} Firms
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Add at least 2 firms to compare
            </div>
          )}
        </div>
      )}

      {/* Collapsed Badge */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full shadow-lg transition-all"
      >
        <Scale className="w-5 h-5" />
        <span>Compare ({items.length})</span>
        {items.length >= 2 && (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

// Inline Basket (for sidebar)
export function InlineCompareBasket() {
  const { items, removeItem, clearBasket } = useCompareBasket()

  if (items.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-semibold">Compare Basket</span>
        </div>
        <p className="text-gray-400 text-sm">
          Click the + button on any firm to add it to your comparison basket.
        </p>
      </div>
    )
  }

  const compareUrl = `/compare/custom?firms=${items.map(i => i.slug).join(',')}`

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-semibold">Compare ({items.length}/4)</span>
        </div>
        <button
          onClick={clearBasket}
          className="text-gray-400 hover:text-red-400 text-xs"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div 
            key={item.slug}
            className="flex items-center justify-between bg-gray-700/50 rounded-lg px-3 py-2"
          >
            <span className="text-gray-300 text-sm truncate">{item.name}</span>
            <button
              onClick={() => removeItem(item.slug)}
              className="text-gray-400 hover:text-red-400 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length >= 2 ? (
        <Link
          href={compareUrl}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-sm"
        >
          Compare Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <p className="text-yellow-400 text-xs text-center">
          Add {2 - items.length} more to compare
        </p>
      )}
    </div>
  )
}
