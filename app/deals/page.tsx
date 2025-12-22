import type { Metadata } from 'next'
import { dealsMetadata, dealsJsonLd } from '@/lib/seo'
import DealsPageClient from './DealsPageClient'

export const metadata: Metadata = dealsMetadata

export default function DealsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dealsJsonLd) }}
      />
      <DealsPageClient />
    </>
  )
}
