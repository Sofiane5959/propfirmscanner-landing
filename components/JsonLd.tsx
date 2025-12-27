// JSON-LD Structured Data Components for SEO
// Add these to your pages for better search engine visibility

// =====================================================
// ORGANIZATION SCHEMA (for layout.tsx)
// =====================================================
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PropFirm Scanner',
    url: 'https://www.propfirmscanner.org',
    logo: 'https://www.propfirmscanner.org/logo.png',
    description: 'Compare 90+ prop trading firms. Find the best match for your trading style.',
    sameAs: [
      'https://twitter.com/propfirmscanner',
      'https://linkedin.com/company/propfirmscanner',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@propfirmscanner.org',
      contactType: 'customer service',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// WEBSITE SCHEMA (for layout.tsx)
// =====================================================
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PropFirm Scanner',
    url: 'https://www.propfirmscanner.org',
    description: 'Compare 90+ prop trading firms',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.propfirmscanner.org/compare?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// PROP FIRM SCHEMA (for /prop-firm/[slug] pages)
// =====================================================
interface PropFirmSchemaProps {
  name: string
  description: string
  url: string
  logo?: string
  rating?: number
  reviewCount?: number
  priceFrom?: number
  priceCurrency?: string
}

export function PropFirmSchema({
  name,
  description,
  url,
  logo,
  rating,
  reviewCount,
  priceFrom,
  priceCurrency = 'USD',
}: PropFirmSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name,
    description,
    url,
    ...(logo && { logo }),
    ...(rating && reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(priceFrom && {
      offers: {
        '@type': 'Offer',
        price: priceFrom,
        priceCurrency,
        availability: 'https://schema.org/InStock',
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// COMPARISON SCHEMA (for /compare pages)
// =====================================================
interface ComparisonItem {
  name: string
  description: string
  rating?: number
  price?: number
}

interface ComparisonSchemaProps {
  title: string
  description: string
  items: ComparisonItem[]
}

export function ComparisonSchema({ title, description, items }: ComparisonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'FinancialService',
        name: item.name,
        description: item.description,
        ...(item.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: item.rating,
            bestRating: 5,
          },
        }),
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// BLOG POST SCHEMA (for /blog/[slug] pages)
// =====================================================
interface BlogPostSchemaProps {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  author?: string
  image?: string
}

export function BlogPostSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author = 'PropFirm Scanner',
  image,
}: BlogPostSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PropFirm Scanner',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.propfirmscanner.org/logo.png',
      },
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// FAQ SCHEMA (for FAQ pages or sections)
// =====================================================
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// BREADCRUMB SCHEMA
// =====================================================
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// =====================================================
// SOFTWARE APPLICATION SCHEMA (for tools)
// =====================================================
interface ToolSchemaProps {
  name: string
  description: string
  url: string
}

export function ToolSchema({ name, description, url }: ToolSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
