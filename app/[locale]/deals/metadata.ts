import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prop Firm Discount Codes & Deals - Save Up to 80% in 2025',
  description: 'Get exclusive prop firm discount codes and save up to 80% on your trading challenge. Updated daily with the latest FTMO, MyForexFunds, The5ers promo codes and deals.',
  keywords: [
    'prop firm discount code',
    'prop firm promo code',
    'FTMO discount code',
    'MyForexFunds coupon',
    'The5ers promo code',
    'prop firm deals',
    'cheap prop firm',
    'prop firm sale',
    'funded trader discount',
    'trading challenge coupon'
  ],
  openGraph: {
    title: 'Prop Firm Discount Codes - Save Up to 80%',
    description: 'Get exclusive prop firm discount codes and save up to 80% on your trading challenge.',
    url: 'https://www.propfirmscanner.org/deals',
    images: [
      {
        url: '/og-deals.png',
        width: 1200,
        height: 630,
        alt: 'Prop Firm Discount Codes and Deals',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/deals',
  },
}

// Schema JSON-LD pour les offres
export const dealsPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Prop Firm Discount Codes',
  description: 'Exclusive discount codes for prop trading firms',
  url: 'https://www.propfirmscanner.org/deals',
}
