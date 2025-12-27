import type { Metadata } from 'next'
import RiskCalculatorClient from './RiskCalculatorClient'

export const metadata: Metadata = {
  title: 'Risk Calculator - Position Size Calculator | PropFirm Scanner',
  description: 'Free position size calculator for prop traders. Calculate your lot size based on account size, risk percentage, and stop loss. Stay within drawdown limits.',
  keywords: 'risk calculator, position size calculator, lot size calculator, prop firm risk management, forex calculator',
  openGraph: {
    title: 'Risk Calculator - Position Size Calculator',
    description: 'Free position size calculator for prop traders. Calculate your lot size based on risk percentage.',
    url: 'https://www.propfirmscanner.org/tools/risk-calculator',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools/risk-calculator',
  },
}

export default function RiskCalculatorPage() {
  return <RiskCalculatorClient />
}
