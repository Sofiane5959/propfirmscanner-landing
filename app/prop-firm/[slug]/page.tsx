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
  const { data: firm } = await supabase.from('prop_firms').select('*').eq('slug', params.slug).single()
  if (!firm) return { title: 'Prop Firm Not Found' }

  return {
    title: `${firm.name} Review 2025 - Pricing, Rules, Pros & Cons`,
    description: `${firm.name} review: ${firm.profit_split}% profit split, from $${firm.min_price}. Honest verdict and pros/cons.`,
    openGraph: {
      title: `${firm.name} Review 2025 | PropFirm Scanner`,
      url: `https://www.propfirmscanner.org/prop-firm/${params.slug}`,
      images: [{ url: firm.logo_url || '/og-image.png' }],
    },
    alternates: { canonical: `https://www.propfirmscanner.org/prop-firm/${params.slug}` },
  }
}

function generateSchemas(firm: any) {
  return {
    financialService: {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: firm.name,
      url: firm.website_url,
      aggregateRating: firm.trustpilot_rating ? {
        '@type': 'AggregateRating',
        ratingValue: firm.trustpilot_rating,
        bestRating: 5,
        ratingCount: firm.trustpilot_reviews || 100,
      } : undefined,
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.propfirmscanner.org' },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://www.propfirmscanner.org/compare' },
        { '@type': 'ListItem', position: 3, name: firm.name },
      ],
    },
  }
}

export default async function PropFirmPage({ params }: Props) {
  const { data: firm } = await supabase.from('prop_firms').select('*').eq('slug', params.slug).single()
  if (!firm) notFound()

  const { data: allFirms } = await supabase.from('prop_firms').select('*').neq('id', firm.id).order('trustpilot_rating', { ascending: false }).limit(20)
  const alternatives = allFirms ? findAlternatives(firm, allFirms) : []
  const schemas = generateSchemas(firm)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.financialService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
      <PropFirmPageClient firm={firm} alternatives={alternatives} />
    </>
  )
}
