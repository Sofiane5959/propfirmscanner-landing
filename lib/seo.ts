// =============================================================================
// SEO HELPER LIBRARY - lib/seo.ts
// Generates hreflang tags for multilingual SEO
// =============================================================================

const BASE_URL = 'https://www.propfirmscanner.org';

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

/**
 * Locales in which a FIRM PAGE is genuinely rendered.
 *
 * `app/[locale]/prop-firm/[slug]` holds its copy in a COPY object that knows
 * `en` and `fr` only (`locale === 'fr' ? COPY.fr : COPY.en`), and the firm
 * content itself is stored in English with a French bundle in
 * `prop_firms.translations.fr`. Nothing exists for the other five.
 *
 * Measured on production, 3 September 2026, share of the visible text in the
 * requested language on /prop-firm/ftmo:
 *
 *     en 99%   fr 88%   de 2%   es 2%   pt 2%   ar 26%   hi 24%
 *
 * Declaring seven hreflang alternates for those pages would invite Google to
 * index five near-duplicates of the English page, across 350 firms.
 *
 * Add a locale here the day its bundle exists in `translations`, and both
 * hreflang and the sitemap follow.
 */
const FIRM_PAGE_LOCALES = ['en', 'fr'] as const;

/**
 * Everything else IS translated, in all seven locales.
 *
 * The shared interface comes from `messages/<locale>.json`, which carries the
 * same 115 keys in all seven. Same measurement, same day, on the home page and
 * on /compare:
 *
 *     de 100%   ar 100%   hi 96%   fr 71%   es 60%   pt 60%
 *
 * A previous version of this file restricted the whole site to en + fr on the
 * strength of the firm-page observation above. That was wrong: it hid five
 * genuinely translated home pages, /compare, /best-for and /blog from search
 * engines. The locale set belongs to the page, not to the site.
 */
const FIRM_PATH = /^\/prop-firm\//;

export function localesFor(path: string): readonly string[] {
  return FIRM_PATH.test(path) ? FIRM_PAGE_LOCALES : locales;
}

// Conserve pour compatibilite : la valeur historique, desormais reservee aux
// fiches firmes.
const TRANSLATED_LOCALES = FIRM_PAGE_LOCALES;

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
function alternatesFor(locale: string, path: string, available?: readonly string[]) {
  // `available` permet a une page de declarer les locales qu'elle possede
  // reellement. Une fiche firme sait, elle, quelles traductions existent dans
  // sa colonne `translations` : c'est plus juste qu'une regle globale.
  //
  // Sans cet argument, la page espagnole de FuturesElite portait un canonical
  // ANGLAIS et aucun hreflang espagnol, alors que son contenu espagnol existe.
  const declared = available && available.length > 0 ? available : localesFor(path);
  const languages: Record<string, string> = {};
  declared.forEach((loc) => {
    languages[loc] = localeHref(loc, path);
  });
  languages['x-default'] = localeHref('en', path);

  // Self-referential for a locale this page really is written in. A locale that
  // is not points its canonical at English: that states what is true rather
  // than claiming a distinct page that does not exist.
  const isTranslated = declared.includes(locale);

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
export function generateDynamicAlternates(
  locale: string,
  path: string,
  available?: readonly string[]
) {
  return alternatesFor(locale, path, available);
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
