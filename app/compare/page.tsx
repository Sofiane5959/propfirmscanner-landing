import { Suspense } from 'react'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ComparePageClient from './ComparePageClient'

export const metadata: Metadata = {
  title: 'Compare Prop Firms - Find Your Perfect Match | PropFirmScanner',
  description: 'Compare 80+ verified prop trading firms side by side. Filter by price, profit split, markets, trading style and more. Find the best prop firm for your needs.',
  keywords: 'prop firm comparison, compare prop firms, best prop firm, FTMO alternative, funded trader, forex prop firm, futures prop firm',
  openGraph: {
    title: 'Compare Prop Firms - Find Your Perfect Match',
    description: 'Compare 80+ verified prop trading firms. Filter by price, profit split, markets and more.',
    type: 'website',
    url: 'https://propfirmscanner.org/compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Prop Firms',
    description: 'Compare 80+ verified prop trading firms side by side.',
  },
  alternates: {
    canonical: 'https://propfirmscanner.org/compare',
  },
}

// Generate JSON-LD Structured Data
function generateStructuredData(firms: any[]) {
  const topFirms = firms
    .filter(f => f.trust_status === 'verified' || !f.trust_status)
    .sort((a, b) => (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0))
    .slice(0, 10)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Prop Trading Firms 2026',
    description: 'Curated list of the best prop trading firms, verified and ranked by PropFirmScanner',
    numberOfItems: topFirms.length,
    itemListElement: topFirms.map((firm, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: firm.name,
        url: `https://propfirmscanner.org/prop-firm/${firm.slug}`,
        logo: firm.logo_url || undefined,
        description: `${firm.name} is a prop trading firm offering up to ${firm.max_profit_split || 80}% profit split.`,
        aggregateRating: firm.trustpilot_rating ? {
          '@type': 'AggregateRating',
          ratingValue: firm.trustpilot_rating,
          bestRating: 5,
          worstRating: 1,
          reviewCount: firm.trustpilot_reviews || 1,
        } : undefined,
        offers: firm.min_price ? {
          '@type': 'Offer',
          price: firm.min_price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        } : undefined,
      },
    })),
  }
}

// FAQ Schema
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a prop trading firm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A prop trading firm (proprietary trading firm) provides traders with capital to trade in exchange for a share of the profits. Traders typically need to pass an evaluation challenge before receiving funded accounts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I choose the best prop firm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Consider factors like: profit split percentage, evaluation fees, trading rules (scalping, news trading, EAs), drawdown limits, payout frequency, and Trustpilot reviews. Use our comparison tool to filter by your preferences.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are prop firms safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reputable prop firms with verified track records are generally safe. Look for firms with positive Trustpilot reviews, transparent rules, and a history of consistent payouts. PropFirmScanner verifies firms before listing them.',
      },
    },
  ],
}

export default async function ComparePage() {
  const supabase = createClient()
  
  // Fetch all prop firms
  const { data: firms, error } = await supabase
    .from('prop_firms')
    .select('*')
    .order('trustpilot_rating', { ascending: false })
  
  if (error) {
    console.error('Error fetching firms:', error)
  }
  
  const firmsList = firms || []
  const structuredData = generateStructuredData(firmsList)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      {/* Main Content */}
      <Suspense fallback={<CompareSkeleton />}>
        <ComparePageClient firms={firmsList} />
      </Suspense>
    </>
  )
}

// Loading skeleton
function CompareSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
        </div>
        
        {/* Filters skeleton */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
