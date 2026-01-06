import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/providers/AuthProvider';
import { Navbar } from '@/components/Navbar';
import PromoTicker from '@/components/PromoTicker';
import { createClient } from '@/lib/supabase/server';

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

// Fetch promo deals for ticker (cached for 1 hour)
async function getPromoDeals() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('prop_firms')
      .select('id, name, slug, logo_url, discount_percent, discount_code, affiliate_url, website_url, trust_status')
      .gt('discount_percent', 0)
      .not('discount_code', 'is', null)
      .or('trust_status.eq.verified,trust_status.is.null')
      .order('discount_percent', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching promo deals:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch promo deals:', err);
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch deals server-side
  const deals = await getPromoDeals();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <PromoTicker deals={deals} />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
