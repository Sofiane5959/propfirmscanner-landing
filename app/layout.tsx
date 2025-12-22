import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import PopupsWrapper from '@/components/PopupsWrapper'
import { homeMetadata, homeJsonLd, organizationJsonLd, faqJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  ...homeMetadata,
  metadataBase: new URL('https://www.propfirmscanner.org'),
  verification: {
    google: 'ZWGv_tiw5ar7KmjnbW76tylrvN6oTQ2_ORLx9uTkwuM',
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
        
        {/* JSON-LD Schema pour SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <PopupsWrapper />
      </body>
    </html>
  )
}
