import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const baseUrl = 'https://www.propfirmscanner.org'
  const now = new Date().toISOString()

  // Fetch all prop firms from database
  const { data: firms } = await supabase
    .from('prop_firms')
    .select('slug, updated_at')
    .order('name')

  // Static pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/compare`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/deals`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/guide`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/tools/risk-calculator`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/tools/rule-tracker`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ].map(page => ({ ...page, lastModified: now }))

  // Category pages (best-for)
  const categories = [
    'scalping',
    'news-trading', 
    'beginners',
    'swing-trading',
    'ea-trading',
    'high-profit-split',
    'cheapest',
    'instant-funding',
    'forex',
    'futures',
    'crypto',
  ]

  const categoryPages = categories.map(cat => ({
    url: `${baseUrl}/best-for/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog posts - ALL 9 articles
  const blogPosts = [
    'how-to-choose-right-prop-firm',
    'news-trading-rules-explained',
    'consistency-rules-explained',
    'how-to-pass-prop-firm-challenge',
    'best-prop-firms-2025',
    'trailing-drawdown-explained',
    'prop-firm-payout-guide',
    'why-traders-fail-challenges',
    'scaling-plans-explained',
  ]

  const blogPages = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // VS Comparison pages
  const vsComparisons = [
    'ftmo-vs-fundednext',
    'ftmo-vs-the5ers',
    'ftmo-vs-myfundedfx',
    'ftmo-vs-e8-funding',
    'ftmo-vs-alpha-capital-group',
    'fundednext-vs-the5ers',
    'fundednext-vs-myfundedfx',
    'the5ers-vs-myfundedfx',
    'ftmo-vs-funded-trading-plus',
    'ftmo-vs-fxify',
    'fundednext-vs-e8-funding',
    'the5ers-vs-e8-funding',
    'ftmo-vs-topstep',
    'ftmo-vs-goat-funded-trader',
    'fundednext-vs-funded-trading-plus',
  ]

  const vsPages = vsComparisons.map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Prop firm pages from database
  const firmPages = firms?.map(firm => ({
    url: `${baseUrl}/prop-firm/${firm.slug}`,
    lastModified: firm.updated_at || now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []

  return [
    ...staticPages,
    ...categoryPages,
    ...blogPages,
    ...vsPages,
    ...firmPages,
  ]
}
