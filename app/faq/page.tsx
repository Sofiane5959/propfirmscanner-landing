import type { Metadata } from 'next'
import FAQPageClient from './FAQPageClient'
import { FAQSchema } from '@/components/JsonLd'

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

// FAQ data for schema
const FAQ_SCHEMA_DATA = [
  {
    question: 'What is a prop trading firm?',
    answer: 'A prop trading firm (proprietary trading firm) provides traders with capital to trade in exchange for a share of the profits. Traders typically need to pass an evaluation (challenge) to prove their skills before receiving a funded account.',
  },
  {
    question: 'What is a prop firm challenge?',
    answer: 'A challenge is an evaluation phase where you trade on a demo account and must meet specific profit targets while staying within risk limits. Pass the challenge, and you get access to a funded account with real capital.',
  },
  {
    question: 'What is maximum drawdown?',
    answer: 'Maximum drawdown is the most your account balance can decline from its starting point (or highest point, for trailing). If you exceed this limit, you fail the challenge. Common limits are 8-12% for max drawdown.',
  },
  {
    question: 'What is profit split?',
    answer: 'Profit split is how profits are divided between you and the prop firm. A typical split is 80/20 (you keep 80%). Some firms offer up to 90% or even 100% profit split, especially as you scale up.',
  },
  {
    question: 'Which prop firm is best for beginners?',
    answer: 'For beginners, we recommend firms with simpler rules, generous drawdown limits, and good educational resources. Firms like FundedNext, FTMO, or The5%ers are popular choices for new traders.',
  },
]

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={FAQ_SCHEMA_DATA} />
      <FAQPageClient />
    </>
  )
}
