import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import PropFirmPageClient from './PropFirmPageClient'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface Props {
  params: { slug: string }
}

// Générer les metadata dynamiques pour chaque prop firm
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!firm) {
    return {
      title: 'Prop Firm Not Found',
    }
  }

  const title = `${firm.name} Review 2025 - Pricing, Profit Split & Discount Codes`
  const description = `${firm.name} review: ${firm.profit_split}% profit split, starting from $${firm.min_price}. Read our honest review, compare with alternatives, and get exclusive discount codes. Trusted by thousands of traders.`

  return {
    title,
    description,
    keywords: [
      `${firm.name} review`,
      `${firm.name} discount code`,
      `${firm.name} promo code`,
      `${firm.name} coupon`,
      `is ${firm.name} legit`,
      `${firm.name} profit split`,
      `${firm.name} rules`,
      `${firm.name} vs FTMO`,
      'prop firm review',
      'best prop firm',
    ],
    openGraph: {
      title: `${firm.name} Review 2025 | PropFirm Scanner`,
      description,
      url: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
      siteName: 'PropFirm Scanner',
      images: [
        {
          url: firm.logo_url || '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${firm.name} - Prop Trading Firm Review`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${firm.name} Review 2025`,
      description,
      images: [firm.logo_url || '/og-image.png'],
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
    },
  }
}

// Schema JSON-LD pour une prop firm
function generateSchemas(firm: any) {
  // Schema FinancialService
  const financialServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: firm.name,
    description: `${firm.name} is a prop trading firm offering funded trading accounts with up to ${firm.profit_split}% profit split.`,
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
    priceRange: `$${firm.min_price} - $${firm.max_price || '2000'}`,
  }

  // Schema Review
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'FinancialService',
      name: firm.name,
      image: firm.logo_url,
    },
    author: {
      '@type': 'Organization',
      name: 'PropFirm Scanner',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: firm.trustpilot_rating || 4,
      bestRating: 5,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PropFirm Scanner',
      url: 'https://www.propfirmscanner.org',
    },
  }

  // Schema FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${firm.name} legit?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${firm.name} is a legitimate prop trading firm${firm.trustpilot_rating ? ` with a Trustpilot rating of ${firm.trustpilot_rating}/5` : ''}. They are based in ${firm.headquarters || 'N/A'} and offer funded trading accounts to traders who pass their evaluation.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does ${firm.name} cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} challenges start from $${firm.min_price}. Account sizes available include ${firm.account_sizes?.map((s: number) => `$${s.toLocaleString()}`).join(', ') || 'various options'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is ${firm.name}'s profit split?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} offers up to ${firm.profit_split}% profit split to funded traders, which is ${firm.profit_split >= 80 ? 'above average' : 'competitive'} in the industry.`,
        },
      },
      {
        '@type': 'Question',
        name: `What platforms does ${firm.name} support?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} supports the following trading platforms: ${firm.platforms?.join(', ') || 'MT4, MT5'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${firm.name} have a discount code?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! Check our deals page for the latest ${firm.name} discount codes and save up to 80% on your challenge.`,
        },
      },
    ],
  }

  // Schema BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.propfirmscanner.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Compare',
        item: 'https://www.propfirmscanner.org/compare',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: firm.name,
        item: `https://www.propfirmscanner.org/prop-firm/${firm.slug}`,
      },
    ],
  }

  return { financialServiceSchema, reviewSchema, faqSchema, breadcrumbSchema }
}

export default async function PropFirmPage({ params }: Props) {
  const { data: firm } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!firm) {
    notFound()
  }

  const schemas = generateSchemas(firm)

  return (
    <>
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.financialServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      
      <PropFirmPageClient firm={firm} />
    </>
  )
}
