import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Prop Firm Guide - How to Pass Your Trading Challenge',
  description: 'Download our free PDF guide to passing your prop firm challenge. Learn risk management, trading strategies, and insider tips from funded traders who passed on their first try.',
  keywords: [
    'prop firm guide',
    'how to pass prop firm challenge',
    'trading challenge tips',
    'funded trader guide',
    'prop firm strategy',
    'risk management prop firm',
    'pass FTMO challenge',
    'prop firm rules',
    'trading psychology',
    'prop firm for beginners'
  ],
  openGraph: {
    title: 'Free Prop Firm Guide - Pass Your Challenge',
    description: 'Download our free PDF guide to passing your prop firm challenge. Learn from funded traders.',
    url: 'https://www.propfirmscanner.org/guide',
    images: [
      {
        url: '/og-guide.png',
        width: 1200,
        height: 630,
        alt: 'Free Prop Firm Trading Guide',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/guide',
  },
}

// Schema JSON-LD pour le guide (Article/HowTo)
export const guidePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Pass Your Prop Firm Challenge',
  description: 'Complete guide to passing your prop firm trading challenge and getting funded.',
  url: 'https://www.propfirmscanner.org/guide',
  totalTime: 'PT30M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose the Right Prop Firm',
      text: 'Compare prop firms based on your trading style, budget, and preferred platform.',
    },
    {
      '@type': 'HowToStep',
      name: 'Understand the Rules',
      text: 'Learn the drawdown limits, profit targets, and trading restrictions.',
    },
    {
      '@type': 'HowToStep',
      name: 'Develop Your Strategy',
      text: 'Create a trading plan that aligns with the prop firm rules.',
    },
    {
      '@type': 'HowToStep',
      name: 'Manage Your Risk',
      text: 'Never risk more than 1-2% per trade and always use stop losses.',
    },
    {
      '@type': 'HowToStep',
      name: 'Stay Disciplined',
      text: 'Follow your plan and avoid emotional trading decisions.',
    },
  ],
}
