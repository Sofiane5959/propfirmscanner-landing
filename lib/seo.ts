// =============================================================================
// SEO HELPER LIBRARY - lib/seo.ts
// Generates hreflang tags for multilingual SEO
// =============================================================================

const BASE_URL = 'https://www.propfirmscanner.org';

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

/**
 * Locales that actually have their own copy.
 *
 * The other five routes work and stay reachable, but every string they render
 * comes from the English COPY object: the components hold `en` and `fr` only
 * and fall back with `locale === 'fr' ? COPY.fr : COPY.en`. Announcing seven
 * translations in hreflang when two exist tells search engines to index five
 * duplicates of the English page.
 *
 * Move a locale here the day its copy exists, and hreflang follows.
 */
const TRANSLATED_LOCALES = ['en', 'fr'] as const;

/**
 * Public URL of a path in a given locale.
 *
 * English is unprefixed: the middleware runs next-intl with
 * localePrefix 'as-needed', so /en/compare answers 307 to /compare. Any URL we
 * publish with an /en prefix — canonical, hreflang or sitemap — is a redirect
 * we asked a crawler to follow.
 */
export function localeHref(locale: string, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return locale === 'en' ? `${BASE_URL}${clean || '/'}` : `${BASE_URL}/${locale}${clean}`;
}

/** Canonical + reciprocal hreflang for one page, in one locale. */
function alternatesFor(locale: string, path: string) {
  const languages: Record<string, string> = {};
  TRANSLATED_LOCALES.forEach((loc) => {
    languages[loc] = localeHref(loc, path);
  });
  languages['x-default'] = localeHref('en', path);

  // Self-referential for a locale that has its own copy. The five untranslated
  // locales serve the English page verbatim, so pointing their canonical at
  // English states what is true rather than claiming six distinct pages.
  const isTranslated = (TRANSLATED_LOCALES as readonly string[]).includes(locale);

  return {
    alternates: {
      canonical: localeHref(isTranslated ? locale : 'en', path),
      languages,
    },
  };
}

// =============================================================================
// GENERATE ALTERNATES FOR STATIC PAGES
// Use in page.tsx metadata export
// =============================================================================

/**
 * Generates hreflang alternates for Next.js metadata
 * 
 * @param path - The page path without locale (e.g., '/compare', '/deals')
 * @returns Object with languages and canonical for metadata spread
 * 
 * @example
 * // In app/[locale]/compare/page.tsx
 * export const metadata: Metadata = {
 *   title: 'Compare Prop Firms',
 *   description: '...',
 *   ...generateAlternates('/compare'),
 * }
 */
export function generateAlternates(path: string, locale: string = 'en') {
  return alternatesFor(locale, path);
}


// =============================================================================
// GENERATE ALTERNATES FOR DYNAMIC PAGES
// Use when you need to specify the current locale
// =============================================================================

/**
 * Generates hreflang alternates with dynamic locale
 * 
 * @param locale - Current page locale
 * @param path - The page path without locale
 * @returns Object with languages and canonical for metadata spread
 * 
 * @example
 * // In app/[locale]/propfirm/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   return {
 *     title: '...',
 *     ...generateDynamicAlternates(params.locale, `/propfirm/${params.slug}`),
 *   }
 * }
 */
export function generateDynamicAlternates(locale: string, path: string) {
  return alternatesFor(locale, path);
}


// =============================================================================
// ALL SITE PAGES - For sitemap generation
// =============================================================================

export const allPages = [
  '/',
  '/compare',
  '/deals',
  '/guide',
  '/blog',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/how-we-make-money',
  '/tools/risk-calculator',
  '/tools/position-size-calculator',
  '/tools/profit-calculator',
  '/tools/drawdown-calculator',
  '/tools/compound-calculator',
  '/tools/currency-converter',
  '/tools/trading-journal',
  '/dashboard',
  '/dashboard/favorites',
  '/dashboard/alerts',
  '/dashboard/comparisons',
  '/dashboard/journal',
  '/dashboard/settings',
  '/dashboard/profile',
  '/dashboard/notifications',
  '/dashboard/analytics',
  '/dashboard/export',
] as const;

// =============================================================================
// GENERATE ALL URLS FOR SITEMAP
// =============================================================================

/**
 * Generates all URLs for sitemap.xml
 * 
 * @returns Array of URL objects with loc, lastmod, changefreq, priority
 * 
 * @example
 * // In app/sitemap.ts
 * import { generateAllUrls } from '@/lib/seo'
 * 
 * export default function sitemap() {
 *   return generateAllUrls()
 * }
 */
export function generateAllUrls() {
  const urls: {
    url: string;
    lastModified: Date;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
  }[] = [];

  const now = new Date();

  allPages.forEach((page) => {
    locales.forEach((locale) => {
      // Determine priority based on page type
      let priority = 0.5;
      let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly';

      if (page === '/') {
        priority = 1.0;
        changeFrequency = 'daily';
      } else if (page === '/compare' || page === '/deals') {
        priority = 0.9;
        changeFrequency = 'daily';
      } else if (page.startsWith('/tools')) {
        priority = 0.7;
        changeFrequency = 'monthly';
      } else if (page.startsWith('/dashboard')) {
        priority = 0.3;
        changeFrequency = 'monthly';
      } else if (page === '/privacy-policy' || page === '/terms-of-service') {
        priority = 0.2;
        changeFrequency = 'monthly';
      }

      urls.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency,
        priority,
      });
    });
  });

  return urls;
}

// =============================================================================
// HELPER: Get all locales
// =============================================================================

export { locales, TRANSLATED_LOCALES, type Locale, BASE_URL };
