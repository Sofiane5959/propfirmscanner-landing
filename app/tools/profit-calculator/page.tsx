import type { Metadata } from 'next'
import ProfitCalculatorClient from './ProfitCalculatorClient'

export const metadata: Metadata = {
  title: 'Profit Calculator - Calculate Your Funded Account Earnings | PropFirm Scanner',
  description: 'Calculate your potential profits from a funded prop trading account. Factor in account size, monthly returns, and profit split percentages.',
  keywords: 'profit calculator, funded account earnings, prop firm profit, trading profit calculator',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools/profit-calculator',
  },
}

export default function ProfitCalculatorPage() {
  return <ProfitCalculatorClient />
}
