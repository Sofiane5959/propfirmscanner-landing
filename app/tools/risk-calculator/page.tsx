import type { Metadata } from 'next'
import RiskCalculatorClient from './RiskCalculatorClient'

export const metadata: Metadata = {
  title: 'Prop Firm Risk Calculator - Calculate Your Max Risk Per Trade',
  description: 'Free risk calculator for prop firm traders. Calculate your maximum risk per trade, daily loss limit, and how many trades you can lose before hitting drawdown limits.',
  keywords: [
    'prop firm risk calculator',
    'trading risk calculator',
    'drawdown calculator',
    'position size calculator',
    'prop firm tools',
    'risk management calculator',
  ],
  openGraph: {
    title: 'Prop Firm Risk Calculator | PropFirm Scanner',
    description: 'Calculate your maximum risk per trade and protect your prop firm account.',
    url: 'https://www.propfirmscanner.org/tools/risk-calculator',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools/risk-calculator',
  },
}

const calculatorSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Prop Firm Risk Calculator',
  description: 'Calculate your maximum risk per trade for prop firm challenges',
  url: 'https://www.propfirmscanner.org/tools/risk-calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function RiskCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <RiskCalculatorClient />
    </>
  )
}
