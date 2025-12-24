import type { Metadata } from 'next'
import RuleTrackerClient from './RuleTrackerClient'

export const metadata: Metadata = {
  title: 'Prop Firm Rule Tracker - Monitor Your Accounts & Drawdown',
  description: 'Free tool to track multiple prop firm accounts. Monitor daily drawdown, max drawdown, and profit targets. Never blow your account again.',
  keywords: [
    'prop firm tracker',
    'drawdown tracker',
    'prop firm account manager',
    'trading account tracker',
    'prop firm dashboard',
    'drawdown monitor',
  ],
  openGraph: {
    title: 'Prop Firm Rule Tracker | PropFirm Scanner',
    description: 'Track multiple prop firm accounts and never breach drawdown limits again.',
    url: 'https://www.propfirmscanner.org/tools/rule-tracker',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools/rule-tracker',
  },
}

const trackerSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Prop Firm Rule Tracker',
  description: 'Track multiple prop firm accounts and monitor drawdown limits',
  url: 'https://www.propfirmscanner.org/tools/rule-tracker',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function RuleTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(trackerSchema) }}
      />
      <RuleTrackerClient />
    </>
  )
}
