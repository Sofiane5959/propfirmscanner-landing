import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/providers/AuthProvider';
import { Navbar } from '@/components/Navbar';
import PromoTicker from '@/components/PromoTicker';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://propfirmscanner.org'),
  title: 'PropFirmScanner - Compare & Track Prop Trading Firms',
  description: 'Compare prop trading firms, track your accounts, and never break a rule again. Your complete prop firm management dashboard.',
  keywords: 'prop firm, prop trading, FTMO, funded trader, trading challenge, forex prop firm',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PropFirmScanner',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://propfirmscanner.org',
    siteName: 'PropFirmScanner',
    title: 'PropFirmScanner - Compare & Track Prop Trading Firms',
    description: 'Compare prop trading firms, track your accounts, and never break a rule again.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFirmScanner',
    description: 'Compare prop trading firms and track your accounts.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
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
        <GoogleAnalytics />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <PromoTicker deals={[]} />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
