import type { Metadata } from 'next'
import DrawdownSimulatorClient from './DrawdownSimulatorClient'

export const metadata: Metadata = {
  title: 'Drawdown Simulator - Static vs Trailing | PropFirm Scanner',
  description: 'Understand the difference between static and trailing drawdown. Simulate trades and see how each type affects your account.',
  keywords: 'drawdown simulator, trailing drawdown, static drawdown, prop firm drawdown, max drawdown calculator',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools/drawdown-simulator',
  },
}

export default function DrawdownSimulatorPage() {
  return <DrawdownSimulatorClient />
}
