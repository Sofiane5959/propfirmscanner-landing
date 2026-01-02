import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ComparePageClient from './ComparePageClient'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const metadata: Metadata = {
  title: 'Compare 100+ Prop Trading Firms | PropFirm Scanner',
  description: 'Compare prop trading firms side-by-side. Filter by profit split, account size, trading rules, discounts and more. Find the best prop firm for your trading style in 2026.',
  keywords: [
    'prop firm comparison',
    'best prop firm 2026',
    'prop trading firms',
    'funded trader',
    'FTMO alternatives',
    'prop firm discounts',
    'cheapest prop firm',
    'prop firm profit split',
    'scalping prop firm',
    'news trading prop firm'
  ],
  openGraph: {
    title: 'Compare 100+ Prop Trading Firms | PropFirm Scanner',
    description: 'Find your perfect prop firm match. Compare fees, profit splits, rules, and current discounts.',
    url: 'https://www.propfirmscanner.org/compare',
    images: [
      {
        url: '/og-compare.png',
        width: 1200,
        height: 630,
        alt: 'Compare Prop Trading Firms',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/compare',
  },
}

export const revalidate = 3600 // Revalidate every hour

export default async function ComparePage() {
  const { data: firms, error } = await supabase
    .from('prop_firms')
    .select('*')
    .order('trustpilot_rating', { ascending: false })

  if (error) {
    console.error('Error fetching firms:', error)
  }

  // Schema JSON-LD for the compare page (defined inside component)
  const comparePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Best Prop Trading Firms Comparison 2026',
    description: 'Compare 100+ verified prop trading firms with detailed information on pricing, profit splits, discounts, and trading rules.',
    url: 'https://www.propfirmscanner.org/compare',
    numberOfItems: firms?.length || 100,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
  }

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparePageSchema) }}
      />
      <ComparePageClient firms={firms || []} />
    </>
  )
}
