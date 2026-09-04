// =============================================================================
// SITEMAP — app/sitemap.ts
// =============================================================================
// Built from the database rather than a hand-kept list.
//
// The previous version emitted 189 URLs from a static array: 27 paths crossed
// with all seven locales, every entry stamped with the deployment time. It
// published nine /dashboard/* routes that robots.ts disallows, five /tools/*
// routes that do not exist, and one /en/* copy of everything — all of which
// 307 to the unprefixed route. It contained no firm page, no article and no
// best-for page: the pages that actually earn traffic were the ones missing.
// =============================================================================

import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { blogPosts } from '@/lib/blog-data'
import { localeHref, localesFor } from '@/lib/seo'

export const revalidate = 3600

// Public pages that exist and are worth indexing. Dashboard, admin, auth and
// checkout are deliberately absent: they are private, and robots.ts blocks them.
const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/compare', priority: 0.9, changeFrequency: 'daily' },
  { path: '/deals', priority: 0.9, changeFrequency: 'daily' },
  { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/guide', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/glossary', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/how-we-make-money', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/how-we-verify', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/changelog', priority: 0.3, changeFrequency: 'weekly' },
  // Only the four tools that are actually built. The old list advertised five
  // more that answer 404.
  { path: '/tools/risk-calculator', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/tools/profit-calculator', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/tools/drawdown-simulator', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/tools/rule-tracker', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/disclaimer', priority: 0.2, changeFrequency: 'yearly' },
]

const BEST_FOR = ['scalping', 'news-trading', 'beginners', 'swing-trading', 'ea-trading',
  'high-profit-split', 'cheapest', 'instant-funding', 'forex', 'futures', 'crypto']

/**
 * One entry per locale the page is genuinely written in. English is unprefixed,
 * so nothing redirects.
 *
 * `localesFor` returns all seven for the shared pages and en + fr for the firm
 * pages. A previous version used a single site-wide list of two, which left
 * five translated home pages, /compare, /best-for and /blog out of the sitemap.
 */
function forEachLocale(
  path: string,
  lastModified: Date,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
): MetadataRoute.Sitemap {
  return localesFor(path).map((locale) => ({
    url: localeHref(locale, path),
    lastModified,
    changeFrequency,
    priority: locale === 'en' ? priority : Math.max(0.1, priority - 0.1),
  }))
}

/**
 * Firms fit to be indexed.
 *
 * Returns null — not an empty list — when the database cannot be reached, so
 * the caller can keep the static pages instead of publishing a sitemap that
 * silently lost every firm page.
 */
async function publishableFirms() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const { data, error } = await createClient(url, key)
      .from('prop_firms')
      .select('slug, updated_at, listing_status, trust_status, closed_at')
      .eq('listing_status', 'listed')
      .is('closed_at', null)
      // A firm nobody has checked is not something to invite Google to index.
      .not('trust_status', 'in', '("unverified","not_recommended","banned")')
    return error ? null : data
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const page of STATIC_PAGES) {
    entries.push(...forEachLocale(page.path, now, page.priority, page.changeFrequency))
  }

  for (const category of BEST_FOR) {
    entries.push(...forEachLocale(`/best-for/${category}`, now, 0.6, 'weekly'))
  }

  for (const post of blogPosts) {
    // Article dates are editorial strings; an unparseable one falls back to now
    // rather than emitting an invalid lastmod.
    const parsed = new Date(post.updatedDate || post.date)
    const lastModified = Number.isNaN(parsed.getTime()) ? now : parsed
    entries.push(...forEachLocale(`/blog/${post.slug}`, lastModified, 0.6, 'monthly'))
  }

  const firms = await publishableFirms()
  if (firms) {
    for (const firm of firms) {
      const updated = firm.updated_at ? new Date(firm.updated_at) : now
      entries.push(...forEachLocale(
        `/prop-firm/${firm.slug}`,
        Number.isNaN(updated.getTime()) ? now : updated,
        0.8,
        'weekly'
      ))
    }
  }

  return entries
}
