import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

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
  const description = `${firm.name} review: ${firm.profit_split}% profit split, starting from $${firm.min_price}. Read our honest review, compare with alternatives, and get exclusive discount codes.`

  return {
    title,
    description,
    keywords: [
      `${firm.name} review`,
      `${firm.name} discount code`,
      `${firm.name} promo code`,
      `${firm.name} vs FTMO`,
      `${firm.name} profit split`,
      `${firm.name} rules`,
      `is ${firm.name} legit`,
      'prop firm review',
    ],
    openGraph: {
      title,
      description,
      url: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
      images: [
        {
          url: firm.logo_url || '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${firm.name} - Prop Trading Firm Review`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
    },
  }
}

// Schema JSON-LD pour une prop firm individuelle
function generatePropFirmSchema(firm: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: firm.name,
    description: firm.description || `${firm.name} is a prop trading firm offering funded trading accounts.`,
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
}

// Schema Review
function generateReviewSchema(firm: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'FinancialService',
      name: firm.name,
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
}

// Schema FAQ pour chaque prop firm
function generateFAQSchema(firm: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${firm.name} legit?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${firm.name} is a legitimate prop trading firm with a Trustpilot rating of ${firm.trustpilot_rating || 'N/A'}/5. They are based in ${firm.headquarters || 'N/A'} and have been operating since ${firm.year_founded || 'several years'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much does ${firm.name} cost?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} challenges start from $${firm.min_price}. Account sizes available include ${firm.account_sizes?.join(', ') || 'various options'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is ${firm.name}'s profit split?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${firm.name} offers up to ${firm.profit_split}% profit split to funded traders.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${firm.name} allow scalping?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: firm.allows_scalping 
            ? `Yes, ${firm.name} allows scalping strategies.`
            : `No, ${firm.name} does not allow scalping. Check their rules for more details.`,
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
    ],
  }
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

  const propFirmSchema = generatePropFirmSchema(firm)
  const reviewSchema = generateReviewSchema(firm)
  const faqSchema = generateFAQSchema(firm)

  return (
    <>
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propFirmSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Le reste de ton composant page existant... */}
      {/* Copie le contenu de ta page prop-firm/[slug]/page.tsx ici */}
    </>
  )
}
