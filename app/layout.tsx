import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.propfirmscanner.org'),
  title: {
    default: 'PropFirm Scanner - Compare 55+ Prop Trading Firms | Best Prop Firms 2025',
    template: '%s | PropFirm Scanner'
  },
  description: 'Compare 55+ prop trading firms instantly. Find the best prop firm for your trading style with detailed reviews, profit splits up to 90%, and exclusive discount codes saving you up to 80%.',
  keywords: [
    'prop trading firms',
    'prop firm comparison',
    'best prop firms',
    'funded trading',
    'FTMO alternative',
    'prop firm discount codes',
    'forex prop firms',
    'futures prop firms',
    'prop firm reviews',
    'trading challenge',
    'funded trader',
    'prop firm 2025'
  ],
  authors: [{ name: 'PropFirm Scanner' }],
  creator: 'PropFirm Scanner',
  publisher: 'PropFirm Scanner',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.propfirmscanner.org',
    siteName: 'PropFirm Scanner',
    title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms',
    description: 'Compare 55+ prop trading firms instantly. Find the best prop firm with exclusive discount codes saving you up to 80%.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PropFirm Scanner - Compare Prop Trading Firms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirm Scanner - Compare 55+ Prop Trading Firms',
    description: 'Compare 55+ prop trading firms instantly. Find the best prop firm with exclusive discount codes.',
    images: ['/og-image.png'],
    creator: '@propfirmscanner',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org',
  },
}

// Schema JSON-LD pour l'organisation
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PropFirm Scanner',
  url: 'https://www.propfirmscanner.org',
  logo: 'https://www.propfirmscanner.org/logo.png',
  description: 'The #1 platform to compare prop trading firms. Find the perfect match for your trading style.',
  sameAs: [
    'https://twitter.com/propfirmscanner',
    'https://www.facebook.com/propfirmscanner',
    'https://www.instagram.com/propfirmscanner',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English'],
  },
}

// Schema JSON-LD pour le site web
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PropFirm Scanner',
  url: 'https://www.propfirmscanner.org',
  description: 'Compare 55+ prop trading firms instantly',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.propfirmscanner.org/compare?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10B981" />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
