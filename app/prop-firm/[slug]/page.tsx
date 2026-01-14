import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import PropFirmPageClient from './PropFirmPageClient'

interface Props {
  params: { slug: string }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('name, slug')
    .eq('slug', params.slug)
    .single()

  if (!firm) {
    return { title: 'Prop Firm Not Found' }
  }

  return {
    title: `${firm.name} Review 2025 - Fees, Rules & Promo Codes`,
    description: `Complete ${firm.name} review: challenge fees, profit split, trading rules, payout process, and exclusive discount codes. Updated for 2025.`,
    openGraph: {
      title: `${firm.name} Review - PropFirmScanner`,
      description: `Everything you need to know about ${firm.name}. Compare fees, rules, and find the best promo codes.`,
    },
  }
}

// Generate static paths for popular firms
export async function generateStaticParams() {
  const supabase = createServerSupabaseClient()
  
  const { data: firms } = await supabase
    .from('prop_firms')
    .select('slug')
    .order('trustpilot_reviews', { ascending: false })
    .limit(50)

  return firms?.map((firm) => ({ slug: firm.slug })) || []
}

export default async function PropFirmPage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  const { data: firm, error } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !firm) {
    notFound()
  }

  // Get similar firms for comparison
  const { data: similarFirms } = await supabase
    .from('prop_firms')
    .select('id, name, slug, logo_url, trustpilot_rating, min_price, profit_split')
    .neq('id', firm.id)
    .order('trustpilot_rating', { ascending: false })
    .limit(4)

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: firm.name,
            description: `${firm.name} prop trading firm`,
            brand: { '@type': 'Brand', name: firm.name },
            aggregateRating: firm.trustpilot_rating ? {
              '@type': 'AggregateRating',
              ratingValue: firm.trustpilot_rating,
              reviewCount: firm.trustpilot_reviews || 0,
              bestRating: 5,
              worstRating: 1,
            } : undefined,
            offers: {
              '@type': 'Offer',
              price: firm.min_price || 0,
              priceCurrency: 'USD',
            },
          }),
        }}
      />
      
      <PropFirmPageClient firm={firm} similarFirms={similarFirms || []} />
    </>
  )
}
