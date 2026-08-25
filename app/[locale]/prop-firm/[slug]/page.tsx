import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import PropFirmPageClient from './PropFirmPageClient'

interface Props {
  // This route lives at app/[locale]/prop-firm/[slug], so locale is part of
  // params. It was missing before, which meant the page could never render in
  // anything but English.
  params: { slug: string; locale: string }
}

// ============================================================================
// ISR — Incremental Static Regeneration
// ============================================================================
// - `revalidate = 60` → every 60 seconds, the next visitor triggers a refresh
// - `dynamicParams = true` → firms outside the top 50 are generated on first
//   visit and cached with the same TTL
//
// Without these, DB updates on non-top-50 firms never surface: the page is
// generated once on first visit and cached indefinitely.
// ============================================================================
export const revalidate = 60
export const dynamicParams = true

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function getStaticSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

const SITE_URL = 'https://www.propfirmscanner.org'

// ============================================================================
// SEO
// ============================================================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = getStaticSupabaseClient()
  const locale = params.locale || 'en'

  const { data: firm } = await supabase
    .from('prop_firms')
    .select('name, slug, verdict, headline, translations, min_price, discount_percent')
    .eq('slug', params.slug)
    .single()

  if (!firm) {
    return { title: locale === 'fr' ? 'Prop firm introuvable' : 'Prop Firm Not Found' }
  }

  // Hardcoding the year meant the title said "2025" well into 2026 — a stale
  // date is one of the first things a reader uses to judge whether a review is
  // maintained, and Google reads it too.
  const year = new Date().getFullYear()

  const fr = (firm.translations as Record<string, Record<string, string>> | null)?.fr
  const summary =
    (locale === 'fr' ? fr?.verdict : null) ||
    firm.verdict ||
    (locale === 'fr'
      ? `Frais, règles de trading, partage des profits et code promo ${firm.name}.`
      : `Fees, trading rules, profit split and promo codes for ${firm.name}.`)

  const title =
    locale === 'fr'
      ? `Avis ${firm.name} ${year} — Frais, règles et code promo`
      : `${firm.name} Review ${year} — Fees, Rules & Promo Codes`

  const description =
    locale === 'fr'
      ? `${summary} Comparatif indépendant mis à jour en ${year}.`
      : `${summary} Independent comparison, updated ${year}.`

  const path = `/${locale}/prop-firm/${firm.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        en: `${SITE_URL}/en/prop-firm/${firm.slug}`,
        fr: `${SITE_URL}/fr/prop-firm/${firm.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      type: 'article',
      locale: locale === 'fr' ? 'fr_FR' : 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export async function generateStaticParams() {
  const supabase = getStaticSupabaseClient()

  const { data: firms } = await supabase
    .from('prop_firms')
    .select('slug')
    .order('trustpilot_reviews', { ascending: false })
    .limit(50)

  return (firms as { slug: string }[] | null)?.map((firm) => ({ slug: firm.slug })) || []
}

// ============================================================================
// PAGE
// ============================================================================

export default async function PropFirmPage({ params }: Props) {
  const supabase = getStaticSupabaseClient()
  const locale = params.locale || 'en'

  const { data: firm, error } = await supabase
    .from('prop_firms')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !firm) {
    notFound()
  }

  // Similar firms used to be "the four highest-rated firms on the site",
  // regardless of what they trade — which is how futures firms ended up
  // recommended under a forex firm. Match the asset class first, and only fall
  // back to a generic list if that leaves us short.
  const SIMILAR_COLUMNS = 'id, name, slug, logo_url, trustpilot_rating, min_price, profit_split'
  const isFutures = firm.is_futures === true

  // Futures and forex firms are not alternatives to each other. Match the
  // asset class first; only widen the net if that leaves the section short.
  const { data: matched } = await supabase
    .from('prop_firms')
    .select(SIMILAR_COLUMNS)
    .neq('id', firm.id)
    .eq('is_futures', isFutures)
    .order('trustpilot_rating', { ascending: false })
    .limit(4)

  type SimilarRow = {
    id: string
    name: string
    slug: string
    logo_url: string
    trustpilot_rating: number
    min_price: number
    profit_split: number
  }
  let similarFirms = (matched || []) as SimilarRow[]

  if (similarFirms.length < 4) {
    // PostgREST needs each UUID quoted inside the in-list. Passing them bare
    // makes the whole filter fail, which is how this section ended up empty.
    const exclude = [firm.id, ...similarFirms.map((f) => f.id)]
      .map((id) => `"${id}"`)
      .join(',')

    const { data: filler } = await supabase
      .from('prop_firms')
      .select(SIMILAR_COLUMNS)
      .not('id', 'in', `(${exclude})`)
      .order('trustpilot_rating', { ascending: false })
      .limit(4 - similarFirms.length)

    similarFirms = [...similarFirms, ...((filler || []) as SimilarRow[])]
  }

  // Ordered by price so the configurator's first program is the cheapest entry
  // point rather than whatever Postgres returned first.
  const { data: challenges } = await supabase
    .from('prop_firm_challenges')
    .select('*')
    .eq('firm_slug', params.slug)
    .order('price', { ascending: true })

  // Advertise the price the visitor will actually pay when a real code exists.
  const challengeRows = (challenges || []) as { price: number | null; discounted_price: number | null }[]
  const cheapest: number | null = challengeRows.reduce(
    (min: number | null, c) => {
      const p = c.discounted_price ?? c.price
      return p !== null && (min === null || p < min) ? p : min
    },
    null as number | null
  )
  const offerPrice = cheapest ?? firm.min_price ?? 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: firm.name,
    description: firm.verdict || `${firm.name} prop trading firm`,
    brand: { '@type': 'Brand', name: firm.name },
    ...(firm.trustpilot_rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: firm.trustpilot_rating,
            reviewCount: firm.trustpilot_reviews || 1,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: offerPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/${locale}/prop-firm/${firm.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PropFirmPageClient
        firm={firm}
        similarFirms={similarFirms}
        challenges={challenges || []}
        locale={locale}
      />
    </>
  )
}
