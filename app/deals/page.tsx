import type { Metadata } from 'next'
import { Suspense } from 'react'
import DealsPageClient from './DealsPageClient'

export const metadata: Metadata = {
  title: 'Prop Firm Deals & Discount Codes 2026 | PropFirm Scanner',
  description: 'Save up to 80% with exclusive prop firm discount codes. Verified deals for FTMO, FundedNext, Apex, and 90+ more firms. Updated weekly.',
  keywords: 'prop firm discount, prop firm coupon, FTMO discount, FundedNext code, prop trading deals',
  openGraph: {
    title: 'Prop Firm Deals & Discount Codes 2026',
    description: 'Save up to 80% with exclusive prop firm discount codes. Verified and updated weekly.',
    url: 'https://www.propfirmscanner.org/deals',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/deals',
  },
}

export default function DealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <DealsPageClient />
    </Suspense>
  )
}
