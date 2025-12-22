import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Guide: How to Choose the Best Prop Firm in 2026 | PropFirm Scanner',
  description: 'Download our free comprehensive guide to choosing the perfect prop trading firm. Learn about evaluation rules, profit splits, platforms, and avoid common mistakes.',
  keywords: 'prop firm guide, how to choose prop firm, prop trading guide, best prop firm guide, funded trader guide',
  openGraph: {
    title: 'Free Guide: How to Choose the Best Prop Firm in 2026',
    description: 'Download our free comprehensive guide to choosing the perfect prop trading firm.',
    url: 'https://www.propfirmscanner.org/guide',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/guide',
  },
}

import GuidePageClient from './GuidePageClient'

export default function GuidePage() {
  return <GuidePageClient />
}
