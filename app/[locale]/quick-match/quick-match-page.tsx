import type { Metadata } from 'next'
import QuickMatchClient from './QuickMatchClient'

export const metadata: Metadata = {
  title: 'Quick Match - Find Your Perfect Prop Firm | PropFirm Scanner',
  description: 'Answer 3 simple questions and get personalized prop firm recommendations. Find the best match for your trading style, budget, and goals.',
  keywords: 'prop firm quiz, prop firm finder, best prop firm for me, prop firm recommendations',
  openGraph: {
    title: 'Quick Match - Find Your Perfect Prop Firm',
    description: 'Answer 3 questions and get personalized prop firm recommendations.',
    url: 'https://www.propfirmscanner.org/quick-match',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/quick-match',
  },
}

export default function QuickMatchPage() {
  return <QuickMatchClient />
}
