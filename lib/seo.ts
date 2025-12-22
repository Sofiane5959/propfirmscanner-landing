import type { Metadata } from 'next'

const siteUrl = 'https://www.propfirmscanner.org'

// SEO Metadata pour chaque page
export const homeMetadata: Metadata = {
  title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms Instantly | Best Prop Firms 2026',
  description: 'Find your perfect prop trading firm in seconds. Compare pricing, profit splits, rules, and reviews for 55+ prop firms. FTMO, FundedNext, Goat Funded & more. Updated daily.',
  keywords: 'prop firm, prop trading, funded trader, FTMO, FundedNext, Goat Funded Trader, trading challenge, forex prop firm, best prop firm 2026, prop firm comparison, funded account, trading capital',
  openGraph: {
    title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms',
    description: 'Find your perfect prop trading firm. Compare pricing, profit splits, rules & reviews. Updated daily.',
    url: siteUrl,
    siteName: 'PropFirm Scanner',
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630, alt: 'PropFirm Scanner - Compare Prop Firms' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirm Scanner - Compare 55+ Prop Firms',
    description: 'Find your perfect prop trading firm in seconds.',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const compareMetadata: Metadata = {
  title: 'Compare Prop Firms 2026 - Side by Side Comparison | PropFirm Scanner',
  description: 'Compare 55+ prop trading firms side by side. Filter by platform (MT4, MT5, cTrader), price, profit split, and trading style. Find the best prop firm for you.',
  keywords: 'compare prop firms, prop firm comparison, best prop firm, MT4 prop firm, MT5 prop firm, cTrader prop firm, cheap prop firm, high profit split',
  openGraph: {
    title: 'Compare Prop Firms 2026 - Side by Side Comparison',
    description: 'Compare 55+ prop trading firms. Filter by platform, price, profit split & more.',
    url: `${siteUrl}/compare`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/compare`,
  },
}

export const dealsMetadata: Metadata = {
  title: 'Prop Firm Discount Codes & Deals 2026 - Up to 80% OFF | PropFirm Scanner',
  description: 'Exclusive prop firm discount codes and deals. Save up to 80% on FTMO, FundedNext, Goat Funded, Apex & more. Updated daily with the latest promo codes.',
  keywords: 'prop firm discount code, FTMO discount, FundedNext promo code, prop firm coupon, trading challenge discount, cheap prop firm',
  openGraph: {
    title: 'Prop Firm Discount Codes & Deals 2026 - Up to 80% OFF',
    description: 'Exclusive discount codes for top prop firms. Save up to 80% on your challenge.',
    url: `${siteUrl}/deals`,
    images: [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
  },
  alternates: {
    canonical: `${siteUrl}/deals`,
  },
}

// JSON-LD Schema pour la page d'accueil
export const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PropFirm Scanner',
  description: 'Compare 55+ prop trading firms instantly. Find the best prop firm for your trading style.',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/compare?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// JSON-LD Schema pour Organization
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PropFirm Scanner',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://twitter.com/propfirmscanner',
    'https://www.youtube.com/@propfirmscanner',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'French'],
  },
}

// JSON-LD Schema pour la page Compare (ItemList)
export const compareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best Prop Trading Firms 2026',
  description: 'Compare the top prop trading firms side by side',
  numberOfItems: 55,
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
}

// JSON-LD Schema pour les deals (OfferCatalog)
export const dealsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Prop Firm Discount Codes',
  description: 'Exclusive discount codes and deals for prop trading firms',
}

// FAQ Schema pour SEO
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a prop trading firm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A proprietary (prop) trading firm provides traders with capital to trade in exchange for a share of the profits. Traders must typically pass an evaluation or challenge to prove their skills before receiving funded accounts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do prop firm challenges work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prop firm challenges are evaluation programs where traders must meet profit targets while following risk management rules (like maximum drawdown limits). Most firms offer 1-step, 2-step, or instant funding options.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best prop firm in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best prop firm depends on your trading style and needs. Top-rated firms include FTMO, FundedNext, Goat Funded Trader, and The5ers. Use PropFirm Scanner to compare features and find the best fit for you.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a prop firm challenge cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prop firm challenges typically cost between $50 and $1000+ depending on the account size. Many firms offer discounts of 10-50% off, especially during promotions.',
      },
    },
  ],
}
