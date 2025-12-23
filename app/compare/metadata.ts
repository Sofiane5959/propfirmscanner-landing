import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare 55+ Prop Trading Firms - Find Your Perfect Match',
  description: 'Compare all prop trading firms side by side. Filter by price, profit split, platforms (MT4, MT5, cTrader), and trading rules. Find the best prop firm for scalping, news trading, or swing trading.',
  keywords: [
    'compare prop firms',
    'prop firm comparison',
    'best prop firm 2025',
    'FTMO vs MyForexFunds',
    'prop firm profit split',
    'cheapest prop firm',
    'prop firm MT4',
    'prop firm MT5',
    'prop firm cTrader',
    'scalping prop firm',
    'news trading prop firm'
  ],
  openGraph: {
    title: 'Compare 55+ Prop Trading Firms - PropFirm Scanner',
    description: 'Compare all prop trading firms side by side. Filter by price, profit split, platforms, and trading rules.',
    url: 'https://www.propfirmscanner.org/compare',
    images: [
      {
        url: '/og-compare.png',
        width: 1200,
        height: 630,
        alt: 'Compare Prop Trading Firms',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/compare',
  },
}

// Schema JSON-LD pour la page de comparaison (ItemList)
export const comparePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Prop Trading Firms Comparison',
  description: 'Compare 55+ prop trading firms with detailed information on pricing, profit splits, and trading rules.',
  url: 'https://www.propfirmscanner.org/compare',
  numberOfItems: 55,
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
}

// À ajouter dans le composant:
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparePageSchema) }} />
