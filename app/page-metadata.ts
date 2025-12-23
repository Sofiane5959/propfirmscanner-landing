import type { Metadata } from 'next'

// Homepage metadata (override layout defaults if needed)
export const metadata: Metadata = {
  title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms | Best Prop Firms 2025',
  description: 'Find your perfect prop trading firm. Compare 55+ firms by price, profit split (up to 90%), platforms, and rules. Get exclusive discount codes saving up to 80%. Trusted by 50,000+ traders.',
  keywords: [
    'prop trading firms',
    'best prop firms 2025',
    'prop firm comparison',
    'funded trading accounts',
    'FTMO alternatives',
    'prop firm discount codes',
    'forex prop firms',
    'futures prop firms',
    'cheapest prop firm',
    'highest profit split prop firm'
  ],
  alternates: {
    canonical: 'https://www.propfirmscanner.org',
  },
}

// Schema JSON-LD pour la homepage
export const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'PropFirm Scanner - Compare Prop Trading Firms',
  description: 'The #1 platform to compare prop trading firms',
  url: 'https://www.propfirmscanner.org',
  mainEntity: {
    '@type': 'ItemList',
    name: 'Top Prop Trading Firms',
    numberOfItems: 55,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'FTMO',
        url: 'https://www.propfirmscanner.org/prop-firm/ftmo',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'The5ers',
        url: 'https://www.propfirmscanner.org/prop-firm/the5ers',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Topstep',
        url: 'https://www.propfirmscanner.org/prop-firm/topstep',
      },
    ],
  },
}

// Schema pour les avis/testimonials
export const reviewsSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'PropFirm Scanner',
  description: 'Prop trading firm comparison platform',
  brand: {
    '@type': 'Brand',
    name: 'PropFirm Scanner',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '50000',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Alex M.',
      },
      reviewBody: 'PropFirm Scanner saved me hours of research. Found the perfect firm with a 90% profit split in minutes!',
    },
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Sarah K.',
      },
      reviewBody: 'The discount codes alone saved me over $200. This site is a must for any serious trader.',
    },
  ],
}
