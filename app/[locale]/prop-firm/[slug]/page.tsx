import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import PropFirmPageClient from './PropFirmPageClient'
import { generateDynamicAlternates, localeHref } from '@/lib/seo'
import { resolvePromotion } from '@/lib/promotion'

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
    // The English hreflang used to carry an /en prefix, which 307s to the
    // unprefixed route: a redirect handed to a crawler on every firm page.
    // generateDynamicAlternates emits English unprefixed and lists only the
    // locales that are really translated.
    ...generateDynamicAlternates(locale, `/prop-firm/${firm.slug}`),
    openGraph: {
      title,
      description,
      url: localeHref(locale, `/prop-firm/${firm.slug}`),
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
  // Every column here is required for a card to be publishable. A row missing
  // any of them is dropped rather than rendered with a blank cell: an
  // alternative shown without a price or a rating is not an alternative.
  const SIMILAR_COLUMNS = 'id, name, slug, logo_url, trustpilot_rating, min_price, profit_split'
  const SIMILAR_LIMIT = 3
  const isComplete = (f: Record<string, unknown>) =>
    Boolean(f.name && f.slug && f.logo_url && f.trustpilot_rating && f.min_price && f.profit_split)
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
  let similarFirms = ((matched || []) as SimilarRow[]).filter(isComplete)

  if (similarFirms.length < SIMILAR_LIMIT) {
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
      .limit(SIMILAR_LIMIT - similarFirms.length)

    similarFirms = [...similarFirms, ...((filler || []) as SimilarRow[]).filter(isComplete)]
  }

  // Never more than three, and never a partial card. Padding the row with an
  // incomplete firm makes the whole section look unreliable.
  similarFirms = similarFirms.slice(0, SIMILAR_LIMIT)

  // Ordered by price so the configurator's first program is the cheapest entry
  // point rather than whatever Postgres returned first.
  const { data: challenges } = await supabase
    .from('prop_firm_challenges')
    .select('*')
    .eq('firm_slug', params.slug)
    .order('price', { ascending: true })

  // Structured data must quote the price actually on sale today. A promotion
  // that has expired no longer discounts anything, so the schema falls back to
  // the list price rather than advertising a figure the checkout will not honour.
  const promotion = resolvePromotion(firm as { discount_code?: string | null; discount_percent?: number | null; discount_expires_at?: string | null })
  const challengeRows = (challenges || []) as { price: number | null; discounted_price: number | null }[]
  const cheapest: number | null = challengeRows.reduce(
    (min: number | null, c) => {
      const p = promotion.isActive ? c.discounted_price ?? c.price : c.price
      return p !== null && (min === null || p < min) ? p : min
    },
    null as number | null
  )
  const offerPrice = cheapest ?? firm.min_price ?? 0

  const pageUrl = localeHref(locale, `/prop-firm/${firm.slug}`)

  // Two graphs, deliberately separate.
  //
  // The Product no longer carries aggregateRating. The only rating we hold is
  // Trustpilot's — collected by Trustpilot, from their reviewers, about the
  // firm. Emitting it here presents someone else's rating as ours, which is
  // both a misattribution and the kind of self-serving markup Google rejects.
  // The page still shows the score, credited to Trustpilot, in the HTML.
  //
  // No FAQPage: the questions are assembled inside the client component and we
  // cannot guarantee here that every answer is rendered in the server HTML.
  // Declaring FAQPage without that guarantee is a structured-data violation, so
  // it stays out until the generator moves server-side.
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: firm.name,
    description: firm.verdict || `${firm.name} prop trading firm`,
    brand: { '@type': 'Brand', name: firm.name },
    // Only quote an offer when there is a real price behind it.
    ...(offerPrice > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: offerPrice,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: pageUrl,
            ...(promotion.isActive && promotion.expiresAt
              ? { priceValidUntil: promotion.expiresAt.toISOString().slice(0, 10) }
              : {}),
          },
        }
      : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: localeHref(locale, '/') },
      { '@type': 'ListItem', position: 2, name: 'Prop firms', item: localeHref(locale, '/compare') },
      { '@type': 'ListItem', position: 3, name: firm.name, item: pageUrl },
    ],
  }

  // prop_firms.translations holds every locale at once. Passing the whole
  // object shipped the French copy inside the English page's payload, and vice
  // versa. Only the locale being rendered crosses to the client.
  const allTranslations = (firm as { translations?: Record<string, unknown> | null }).translations
  const firmForLocale = {
    ...firm,
    translations: allTranslations?.[locale] ? { [locale]: allTranslations[locale] } : null,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <PropFirmPageClient
        firm={firmForLocale}
        similarFirms={similarFirms}
        challenges={challenges || []}
        locale={locale}
      />
    </>
  )
}
