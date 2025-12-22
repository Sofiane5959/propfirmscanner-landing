import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PropFirmPageClient from './PropFirmPageClient'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!firm) {
    return {
      title: 'Prop Firm Not Found | PropFirm Scanner',
    }
  }

  return {
    title: `${firm.name} Review 2025 - Pricing, Rules & Discount Code | PropFirm Scanner`,
    description: `Complete ${firm.name} review. ${firm.profit_split}% profit split, challenges from $${firm.min_price}. Read our in-depth analysis, rules breakdown, and get exclusive discount codes.`,
    keywords: `${firm.name}, ${firm.name} review, ${firm.name} discount code, ${firm.name} promo code, ${firm.name} rules, prop firm review`,
    openGraph: {
      title: `${firm.name} Review 2025 - Complete Guide`,
      description: `Is ${firm.name} worth it? ${firm.profit_split}% profit split, challenges from $${firm.min_price}. Get our honest review.`,
      url: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
      images: [{ url: firm.logo_url || '/og-image.png', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
    },
  }
}

export default async function PropFirmPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!firm) {
    notFound()
  }

  // JSON-LD Schema pour le produit/service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: firm.name,
    description: `${firm.name} prop trading firm offering ${firm.profit_split}% profit split`,
    brand: {
      '@type': 'Brand',
      name: firm.name,
    },
    offers: {
      '@type': 'Offer',
      price: firm.min_price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: firm.trustpilot_rating ? {
      '@type': 'AggregateRating',
      ratingValue: firm.trustpilot_rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: firm.trustpilot_reviews || 100,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropFirmPageClient firm={firm} />
    </>
  )
}
