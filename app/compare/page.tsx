import type { Metadata } from 'next'
import { compareMetadata, compareJsonLd } from '@/lib/seo'
import ComparePageClient from './ComparePageClient'

export const metadata: Metadata = compareMetadata

export default function ComparePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compareJsonLd) }}
      />
      <ComparePageClient />
    </>
  )
}
