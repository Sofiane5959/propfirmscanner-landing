import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/providers/AuthProvider';
import { Navbar } from '@/components/Navbar';
import PromoTicker from '@/components/PromoTicker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropFirmScanner - Compare & Track Prop Trading Firms',
  description: 'Compare prop trading firms, track your accounts, and never break a rule again. Your complete prop firm management dashboard.',
  keywords: 'prop firm, prop trading, FTMO, funded trader, trading challenge, forex prop firm',
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
          <PromoTicker />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
