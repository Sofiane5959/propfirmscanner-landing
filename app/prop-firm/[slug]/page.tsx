import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import PropFirmPageClient from './PropFirmPageClient'
import { findAlternatives } from '@/lib/generate-firm-content'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()
    
  if (!firm) return { title: 'Prop Firm Not Found' }

  const title = `${firm.name} Review 2026 - Pricing, Rules, Pros & Cons`
  const description = `${firm.name} review: ${firm.profit_split || firm.max_profit_split}% profit split, from $${firm.min_price}. Honest verdict, pros/cons, and ${firm.discount_percent ? `${firm.discount_percent}% discount code` : 'exclusive deals'}.`

  return {
    title,
    description,
    keywords: [
      `${firm.name} review`,
      `${firm.name} review 2026`,
      `${firm.name} discount code`,
      `${firm.name} promo code`,
      `${firm.name} vs FTMO`,
      `${firm.name} profit split`,
      `${firm.name} rules`,
      `is ${firm.name} legit`,
      'prop firm review',
      'best prop firm 2026',
    ],
    openGraph: {
      title: `${firm.name} Review 2026 | PropFirm Scanner`,
      description,
      url: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
      images: [{ 
        url: firm.logo_url || '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${firm.name} - Prop Trading Firm Review`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: { 
      canonical: `https://www.propfirmscanner.org/prop-firm/${params.slug}` 
    },
  }
}

function generateSchemas(firm: any) {
  // Financial Service Schema
  const financialService = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: firm.name,
    description: `${firm.name} is a prop trading firm offering funded trading accounts with up to ${firm.profit_split || firm.max_profit_split}% profit split.`,
    url: firm.website_url,
    logo: firm.logo_url,
    address: firm.headquarters ? {
      '@type': 'PostalAddress',
      addressCountry: firm.headquarters,
    } : undefined,
    aggregateRating: firm.trustpilot_rating ? {
      '@type': 'AggregateRating',
      ratingValue: firm.trustpilot_rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: firm.trustpilot_reviews || 100,
    } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: firm.min_price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
    },
  }
  
  // Breadcrumb Schema
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propfirmscanner.org' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://www.propfirmscanner.org/compare' },
      { '@type': 'ListItem', position: 3, name: firm.name },
    ],
  }
  
  // FAQ Schema
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${firm.name} legit?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${firm.name} is a legitimate prop trading firm with a Trustpilot rating of ${firm.trustpilot_rating || 'N/A'}/5${firm.trustpilot_reviews ? ` based on ${firm.trustpilot_reviews.toLocaleString()} reviews` : ''}. They are based in ${firm.headquarters || 'N/A'} and have been operating since ${firm.year_founded || 'several years'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does ${firm.name} cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} challenges start from $${firm.min_price}. Account sizes available include ${firm.account_sizes?.map((s: number) => s >= 1000 ? `$${s/1000}K` : `$${s}`).join(', ') || 'various options'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is ${firm.name}'s profit split?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} offers up to ${firm.profit_split || firm.max_profit_split}% profit split to funded traders.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${firm.name} have a discount code?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: firm.discount_percent 
            ? `Yes! Use code "${firm.discount_code}" for ${firm.discount_percent}% off your ${firm.name} challenge.`
            : `Check our deals page for the latest ${firm.name} discount codes and promotions.`,
        },
      },
    ],
  }
  
  return { financialService, breadcrumb, faq }
}

export default async function PropFirmPage({ params }: Props) {
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()
    
  if (!firm) notFound()

  const { data: allFirms } = await supabase
    .from('prop_firms')
    .select('*')
    .neq('id', firm.id)
    .order('trustpilot_rating', { ascending: false })
    .limit(20)
    
  const alternatives = allFirms ? findAlternatives(firm, allFirms) : []
  const schemas = generateSchemas(firm)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.financialService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <PropFirmPageClient firm={firm} alternatives={alternatives} />
    </>
  )
}
