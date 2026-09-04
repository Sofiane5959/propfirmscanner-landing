import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import PropFirmPageClient from './PropFirmPageClient'
import { generateDynamicAlternates, localeHref } from '@/lib/seo'
import { resolvePromotion } from '@/lib/promotion'
import { loadFirmPrograms } from '@/lib/firm-programs'

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
    return {
      title: ({ en: 'Prop Firm Not Found', fr: 'Prop firm introuvable',
                de: 'Prop-Firma nicht gefunden', es: 'Prop firm no encontrada',
                pt: 'Prop firm não encontrada',
                ar: 'لم يتم العثور على الشركة',
                hi: 'प्रॉप फ़र्म नहीं मिली' } as Record<string, string>)[locale]
                ?? 'Prop Firm Not Found',
    }
  }

  // Hardcoding the year meant the title said "2025" well into 2026 — a stale
  // date is one of the first things a reader uses to judge whether a review is
  // maintained, and Google reads it too.
  const year = new Date().getFullYear()

  // Les sept langues. La version precedente n'avait que deux branches,
  // `locale === 'fr' ? ... : ...`, si bien que /de, /es, /pt, /ar et /hi
  // portaient un titre anglais dans l'onglet comme dans Google.
  const META: Record<string, {
    fallback: (f: string) => string
    title: (f: string, y: number) => string
    description: (s: string, y: number) => string
  }> = {
    en: {
      fallback: (f) => `Fees, trading rules, profit split and promo codes for ${f}.`,
      title: (f, y) => `${f} Review ${y} — Fees, Rules & Promo Codes`,
      description: (s, y) => `${s} Independent comparison, updated ${y}.`,
    },
    fr: {
      fallback: (f) => `Frais, règles de trading, partage des profits et code promo ${f}.`,
      title: (f, y) => `Avis ${f} ${y} — Frais, règles et code promo`,
      description: (s, y) => `${s} Comparatif indépendant mis à jour en ${y}.`,
    },
    de: {
      fallback: (f) => `Gebühren, Handelsregeln, Gewinnbeteiligung und Promo-Codes für ${f}.`,
      title: (f, y) => `${f} Test ${y} — Gebühren, Regeln & Promo-Codes`,
      description: (s, y) => `${s} Unabhängiger Vergleich, aktualisiert ${y}.`,
    },
    es: {
      fallback: (f) => `Comisiones, reglas de trading, reparto de beneficios y códigos promocionales de ${f}.`,
      title: (f, y) => `Reseña de ${f} ${y} — Comisiones, reglas y códigos`,
      description: (s, y) => `${s} Comparativa independiente, actualizada en ${y}.`,
    },
    pt: {
      fallback: (f) => `Custos, regras de negociação, partilha de lucros e códigos promocionais da ${f}.`,
      title: (f, y) => `Análise ${f} ${y} — Custos, regras e códigos`,
      description: (s, y) => `${s} Comparação independente, atualizada em ${y}.`,
    },
    ar: {
      fallback: (f) => `الرسوم وقواعد التداول وتقاسم الأرباح ورموز الخصم لدى ${f}.`,
      title: (f, y) => `مراجعة ${f} ${y} — الرسوم والقواعد ورموز الخصم`,
      description: (s, y) => `${s} مقارنة مستقلة، مُحدّثة في ${y}.`,
    },
    hi: {
      fallback: (f) => `${f} की फ़ीस, ट्रेडिंग नियम, लाभ का बँटवारा और प्रोमो कोड।`,
      title: (f, y) => `${f} समीक्षा ${y} — फ़ीस, नियम और प्रोमो कोड`,
      description: (s, y) => `${s} स्वतंत्र तुलना, ${y} में अपडेट।`,
    },
  }

  const m = META[locale] ?? META.en

  // Le verdict traduit vient du bundle de la locale, plus seulement de `fr`.
  const bundle = (firm.translations as Record<string, Record<string, string>> | null)?.[locale]
  const summary = bundle?.verdict || (locale === 'en' ? firm.verdict : '') || firm.verdict || m.fallback(firm.name)

  const title = m.title(firm.name, year)
  const description = m.description(summary, year)

  const path = `/${locale}/prop-firm/${firm.slug}`

  return {
    title,
    description,
    // The English hreflang used to carry an /en prefix, which 307s to the
    // unprefixed route: a redirect handed to a crawler on every firm page.
    // generateDynamicAlternates emits English unprefixed and lists only the
    // locales that are really translated.
    // Les locales realmente disponibles pour CETTE fiche : l'anglais, qui est
    // la langue des colonnes de base, plus chaque bundle present dans
    // `translations`. Declarer l'espagnol quand il n'existe pas serait aussi
    // faux que de l'omettre quand il existe.
    ...generateDynamicAlternates(
      locale,
      `/prop-firm/${firm.slug}`,
      Array.from(new Set(['en', ...Object.keys((firm.translations as Record<string, unknown> | null) || {})]))
    ),
    openGraph: {
      title,
      description,
      url: localeHref(locale, `/prop-firm/${firm.slug}`),
      type: 'article',
      locale: ({ en: 'en_GB', fr: 'fr_FR', de: 'de_DE', es: 'es_ES',
                 pt: 'pt_PT', ar: 'ar_AR', hi: 'hi_IN' } as Record<string, string>)[locale]
                 ?? 'en_GB',
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

  // A missing row and an unreachable database are not the same event. PostgREST
  // answers PGRST116 for "no rows"; anything else is infrastructure. Treating
  // both as notFound() served a 200 page titled "Prop Firm Not Found" during a
  // Supabase outage, which is exactly the soft 404 Google penalises — and with
  // revalidate it would be cached. Rethrowing turns an outage into a 500, which
  // is honest and is not cached.
  if (error && error.code !== 'PGRST116') {
    throw new Error(`prop_firms lookup failed for "${params.slug}": ${error.message}`)
  }

  if (!firm) {
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

  // Structure normalisee (programmes / phases / promotions). Renvoie null quand
  // la firme n'en a pas : la fiche garde alors exactement son affichage
  // historique, base sur prop_firm_challenges. Les sept tables avaient ete
  // remplies avant qu'aucun code ne les lise — d'ou une fiche inchangee malgre
  // 27 plans importes.
  const programData = await loadFirmPrograms(supabase, params.slug)

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

  // Fourchette de prix verifiee, tous programmes confondus. Elle agrege les
  // challenges historiques ET les plans de la structure normalisee, pour que
  // le balisage reste juste quelle que soit la source qui alimente la fiche.
  const allPrices: number[] = [
    ...challengeRows.map((c) => (promotion.isActive ? c.discounted_price ?? c.price : c.price)),
    ...(programData?.programs ?? []).flatMap((p) =>
      p.plans.map((pl) => (pl.regular_price === null ? null : Number(pl.regular_price)))
    ),
  ].filter((p): p is number => p !== null && p > 0)

  const priceRange = {
    low: allPrices.length ? Math.min(...allPrices) : offerPrice,
    high: allPrices.length ? Math.max(...allPrices) : offerPrice,
    count: allPrices.length,
    currency: (firm as { price_currency?: string | null }).price_currency || 'USD',
  }

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
    // AggregateOffer, pas Offer.
    //
    // Une fiche multi-programmes n'a pas UN prix : FuturesElite va de 95 $
    // (Elite 25K) a 569 $ (Instant 150K). La version precedente publiait le
    // prix le plus bas comme s'il valait pour toute la page, y compris quand
    // le visiteur avait selectionne un autre programme. Le balisage annoncait
    // donc a Google un prix que le checkout ne pratique pas.
    //
    // La fourchette est calculee cote serveur, sur les prix verifies : elle
    // reste valable pour la representation canonique du produit, ce qu'un
    // prix choisi cote client ne serait pas.
    ...(priceRange.low > 0
      ? {
          offers:
            priceRange.low === priceRange.high
              ? {
                  '@type': 'Offer',
                  price: priceRange.low,
                  priceCurrency: priceRange.currency,
                  availability: 'https://schema.org/InStock',
                  url: pageUrl,
                  ...(promotion.isActive && promotion.expiresAt
                    ? { priceValidUntil: promotion.expiresAt.toISOString().slice(0, 10) }
                    : {}),
                }
              : {
                  '@type': 'AggregateOffer',
                  lowPrice: priceRange.low,
                  highPrice: priceRange.high,
                  offerCount: priceRange.count,
                  priceCurrency: priceRange.currency,
                  availability: 'https://schema.org/InStock',
                  url: pageUrl,
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
        programData={programData}
        locale={locale}
      />
    </>
  )
}
