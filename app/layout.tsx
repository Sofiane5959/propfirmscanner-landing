import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/providers/AuthProvider';
import { Navbar } from '@/components/Navbar';
import PromoTicker from '@/components/PromoTicker';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#10b981',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.propfirmscanner.org'),
  title: {
    default: 'PropFirmScanner - Compare & Track Prop Trading Firms',
    template: '%s | PropFirmScanner',
  },
  description: 'Compare 80+ prop trading firms, track your accounts, and never break a rule again. Your complete prop firm management dashboard.',
  keywords: [
    'prop firm',
    'prop trading',
    'FTMO',
    'funded trader',
    'trading challenge',
    'forex prop firm',
    'futures prop firm',
    'prop firm comparison',
    'best prop firm',
    'prop firm review',
  ],
  authors: [{ name: 'PropFirmScanner' }],
  creator: 'PropFirmScanner',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.propfirmscanner.org',
    siteName: 'PropFirmScanner',
    title: 'PropFirmScanner - Compare & Track Prop Trading Firms',
    description: 'Compare 80+ prop trading firms and track your accounts. Find the best prop firm for your trading style.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PropFirmScanner - Compare Prop Trading Firms',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirmScanner - Compare Prop Trading Firms',
    description: 'Compare 80+ prop trading firms and track your accounts.',
    images: ['/og-image.png'],
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PropFirmScanner" />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <PromoTicker />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        
        {/* Analytics - Replace with your actual IDs */}
        <Analytics 
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
          // Or use Plausible (privacy-friendly alternative):
          // plausibleDomain="propfirmscanner.org"
        />
        
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'PropFirmScanner',
              url: 'https://www.propfirmscanner.org',
              logo: 'https://www.propfirmscanner.org/icons/icon-512x512.png',
              description: 'Compare and track prop trading firms.',
              sameAs: [
                'https://twitter.com/propfirmscanner',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'contact@propfirmscanner.org',
                contactType: 'customer support',
              },
            }),
          }}
        />
        
        {/* JSON-LD WebSite Schema for Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'PropFirmScanner',
              url: 'https://www.propfirmscanner.org',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://www.propfirmscanner.org/compare?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
