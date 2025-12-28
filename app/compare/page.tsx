import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ComparePageClient from './ComparePageClient'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const metadata: Metadata = {
  title: 'Compare 100+ Prop Trading Firms | PropFirm Scanner',
  description: 'Compare prop trading firms side-by-side. Filter by profit split, account size, trading rules, and more. Find the best prop firm for your trading style.',
  keywords: ['prop firm comparison', 'best prop firm', 'prop trading firms', 'funded trader', 'FTMO alternatives'],
  openGraph: {
    title: 'Compare 100+ Prop Trading Firms',
    description: 'Find your perfect prop firm match. Compare fees, profit splits, and rules.',
    url: 'https://www.propfirmscanner.org/compare',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/compare',
  },
}

export const revalidate = 3600

export default async function ComparePage() {
  const { data: firms, error } = await supabase
    .from('prop_firms')
    .select('*')
    .order('trustpilot_rating', { ascending: false })

  if (error) {
    console.error('Error fetching firms:', error)
  }

  return <ComparePageClient firms={firms || []} />
}

