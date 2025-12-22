import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import NewsletterPopup from '@/components/NewsletterPopup'
import PromoPopup from '@/components/PromoPopup'

export const metadata: Metadata = {
  title: 'PropFirm Scanner - Compare 50+ Prop Trading Firms Instantly',
  description: 'Find your perfect prop trading firm in seconds. Compare pricing, profit splits, rules, and legitimacy scores for 50+ prop firms side-by-side.',
  keywords: 'prop firm, prop trading, funded trader, FTMO, trading challenge, forex prop firm, best prop firm 2024',
  verification: {
    google: 'ZWGv_tiw5ar7KmjnbW76tylrvN6oTQ2_ORLx9uTkwuM',
  },
  openGraph: {
    title: 'PropFirm Scanner - Find Your Perfect Prop Trading Firm',
    description: 'Compare 50+ prop firms instantly. Find the best pricing, profit splits, and rules for your trading style.',
    url: 'https://www.propfirmscanner.org',
    siteName: 'PropFirm Scanner',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirm Scanner - Compare 50+ Prop Firms',
    description: 'Find your perfect prop trading firm in seconds.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="canonical" href="https://www.propfirmscanner.org" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <NewsletterPopup />
        <PromoPopup />
      </body>
    </html>
  )
}
