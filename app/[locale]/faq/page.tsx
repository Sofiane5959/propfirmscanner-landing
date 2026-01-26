import type { Metadata } from 'next'
import FAQPageClient from './FAQPageClient'

export const metadata: Metadata = {
  title: 'FAQ - Prop Trading Questions Answered | PropFirm Scanner',
  description: 'Get answers to common questions about prop trading firms, challenges, rules, payouts, and more. Everything you need to know before starting.',
  keywords: 'prop firm FAQ, prop trading questions, funded account FAQ, prop firm challenge questions',
  openGraph: {
    title: 'Prop Trading FAQ - Questions Answered',
    description: 'Get answers to common questions about prop trading firms, challenges, rules, and payouts.',
    url: 'https://www.propfirmscanner.org/faq',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/faq',
  },
}

export default function FAQPage() {
  return <FAQPageClient />
}
