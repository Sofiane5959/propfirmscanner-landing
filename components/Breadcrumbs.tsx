'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbSchema } from './JsonLd'

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  // Add home as first item
  const allItems = [
    { label: 'Home', href: '/' },
    ...items,
  ]

  // Prepare schema items
  const schemaItems = allItems.map(item => ({
    name: item.label,
    url: `https://www.propfirmscanner.org${item.href}`,
  }))

  return (
    <>
      {/* JSON-LD Schema */}
      <BreadcrumbSchema items={schemaItems} />
      
      {/* Visual Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center gap-1 text-sm ${className}`}
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            
            return (
              <li key={item.href} className="flex items-center gap-1">
                {index === 0 ? (
                  // Home icon for first item
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    {isLast ? (
                      // Current page (not a link)
                      <span className="text-gray-300" aria-current="page">
                        {item.label}
                      </span>
                    ) : (
                      // Link to parent page
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-emerald-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

// =====================================================
// USAGE EXAMPLES
// =====================================================

/*
// On a prop firm page (/prop-firm/ftmo)
<Breadcrumbs 
  items={[
    { label: 'Compare', href: '/compare' },
    { label: 'FTMO', href: '/prop-firm/ftmo' },
  ]}
/>

// On a blog post (/blog/how-to-choose-right-prop-firm)
<Breadcrumbs 
  items={[
    { label: 'Blog', href: '/blog' },
    { label: 'How to Choose the Right Prop Firm', href: '/blog/how-to-choose-right-prop-firm' },
  ]}
/>

// On a comparison page (/compare/ftmo-vs-fundednext)
<Breadcrumbs 
  items={[
    { label: 'Compare', href: '/compare' },
    { label: 'FTMO vs FundedNext', href: '/compare/ftmo-vs-fundednext' },
  ]}
/>

// On a tool page (/tools/risk-calculator)
<Breadcrumbs 
  items={[
    { label: 'Tools', href: '/tools' },
    { label: 'Risk Calculator', href: '/tools/risk-calculator' },
  ]}
/>

// On a category page (/best-for/beginners)
<Breadcrumbs 
  items={[
    { label: 'Best For', href: '/compare' },
    { label: 'Beginners', href: '/best-for/beginners' },
  ]}
/>
*/
