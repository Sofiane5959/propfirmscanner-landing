import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/providers/AuthProvider';
import { Navbar } from '@/components/Navbar';
import PromoTicker from '@/components/PromoTicker';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://propfirmscanner.org'),
  title: 'PropFirmScanner - Compare & Track Prop Trading Firms',
  description: 'Compare prop trading firms, track your accounts, and never break a rule again. Your complete prop firm management dashboard.',
  keywords: 'prop firm, prop trading, FTMO, funded trader, trading challenge, forex prop firm',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
