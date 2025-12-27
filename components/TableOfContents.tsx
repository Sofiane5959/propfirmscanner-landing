'use client'

import { useState, useEffect } from 'react'
import { List, ChevronDown, ChevronUp } from 'lucide-react'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TOCItem[]
  collapsible?: boolean
  maxHeight?: string
}

export default function TableOfContents({ 
  items, 
  collapsible = true,
  maxHeight = '400px'
}: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeId, setActiveId] = useState<string>('')

  // Track scroll position to highlight active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  if (items.length === 0) return null

  return (
    <nav className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 ${
          collapsible ? 'cursor-pointer hover:bg-gray-700/50' : ''
        }`}
        disabled={!collapsible}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-semibold">Table of Contents</span>
        </div>
        {collapsible && (
          isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div 
          className="px-4 pb-4 overflow-y-auto"
          style={{ maxHeight }}
        >
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
              >
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-1.5 px-3 rounded-lg text-sm transition-colors ${
                    activeId === item.id
                      ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

// Helper function to extract headings from HTML content
export function extractHeadings(content: string): TOCItem[] {
  const headings: TOCItem[] = []
  const regex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-4]>/gi
  let match

  while ((match = regex.exec(content)) !== null) {
    headings.push({
      id: match[2],
      title: match[3],
      level: parseInt(match[1]),
    })
  }

  return headings
}

// Auto TOC Component (extracts headings from page)
export function AutoTableOfContents() {
  const [items, setItems] = useState<TOCItem[]>([])

  useEffect(() => {
    const headings = document.querySelectorAll('h2[id], h3[id], h4[id]')
    const tocItems: TOCItem[] = []

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1))
      tocItems.push({
        id: heading.id,
        title: heading.textContent || '',
        level,
      })
    })

    setItems(tocItems)
  }, [])

  if (items.length < 3) return null

  return <TableOfContents items={items} />
}

// Sticky TOC for sidebar
export function StickyTableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <div className="sticky top-24">
      <TableOfContents items={items} collapsible={false} maxHeight="calc(100vh - 200px)" />
    </div>
  )
}
