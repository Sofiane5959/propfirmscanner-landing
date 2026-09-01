import type { Metadata, Viewport } from 'next';
import './globals.css';


export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  // Every relative canonical on the site resolves against this. It was set
  // without www while the site answers on www.propfirmscanner.org, so each one
  // pointed at a host that 307s — a redirect handed to crawlers on every page.
  metadataBase: new URL('https://www.propfirmscanner.org'),
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
    url: 'https://www.propfirmscanner.org',
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

// The document shell lives in app/[locale]/layout.tsx.
//
// <html lang> and dir have to reflect the page's language, and only the locale
// layout knows it: this file sits above the [locale] segment and receives no
// params. Reading the locale from headers() here would opt the whole app out
// of static rendering. So the shell moved down one level, where the locale is
// a route parameter and the pages stay statically generated.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
