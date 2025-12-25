import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.propfirmscanner.org'
  
  // Fetch all prop firms from database
  const supabase = createClient()
  const { data: firms } = await supabase
    .from('prop_firms')
    .select('slug, updated_at')
    .order('name')
  
  // Static pages
  const staticPages = [
    { url: baseUrl, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/compare`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/deals`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/guide`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/tools/risk-calculator`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/tools/rule-tracker`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ]
  
  // Blog articles (9 articles)
  const blogArticles = [
    'how-to-choose-right-prop-firm',
    'news-trading-rules-explained',
    'consistency-rules-explained',
    'how-to-pass-prop-firm-challenge',
    'best-prop-firms-2025',
    'trailing-drawdown-explained',
    'prop-firm-payout-guide',
    'why-traders-fail-challenges',
    'scaling-plans-explained',
  ].map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  // Best-for category pages (11 categories)
  const categoryPages = [
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
  ].map(category => ({
    url: `${baseUrl}/best-for/${category}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // VS Comparison pages (35 total: 15 old + 20 new)
  const vsComparisons = [
    // === EXISTING 15 VS PAGES ===
    'ftmo-vs-fundednext',
    'ftmo-vs-the5ers',
    'ftmo-vs-myfundedfx',
    'ftmo-vs-e8-funding',
    'fundednext-vs-the5ers',
    'fundednext-vs-myfundedfx',
    'the5ers-vs-myfundedfx',
    'ftmo-vs-topstep',
    'ftmo-vs-apex-trader-funding',
    'fundednext-vs-fxify',
    'the5ers-vs-funded-trading-plus',
    'ftmo-vs-alpha-capital-group',
    'myfundedfx-vs-goat-funded-trader',
    'apex-trader-funding-vs-topstep',
    'ftmo-vs-instant-funding',
    
    // === NEW 20 VS PAGES ===
    // Comparisons with Seacrest Markets
    'ftmo-vs-seacrest-markets',
    'fundednext-vs-seacrest-markets',
    'the5ers-vs-seacrest-markets',
    
    // Crypto Prop Firm comparisons
    'my-crypto-funding-vs-breakout-prop',
    'ftmo-vs-my-crypto-funding',
    
    // Futures comparisons
    'apex-trader-funding-vs-traders-launch',
    'my-funded-futures-vs-alpha-futures',
    'topstep-vs-apex-trader-funding',
    
    // Broker-backed comparisons
    'ftmo-vs-oanda-prop-trader',
    'ftmo-vs-eightcap-challenges',
    'ftmo-vs-blueberry-funded',
    
    // Instant funding comparisons
    'instant-funding-vs-lark-funding',
    'fundednext-vs-funded-trading-plus',
    'goat-funded-trader-vs-wall-street-funded',
    
    // Popular missing comparisons
    'ftmo-vs-fxify',
    'the5ers-vs-fundingpips',
    'alpha-capital-group-vs-maven-trading',
    'fundednext-vs-thinkcapital',
    'ftmo-vs-funded-trading-plus',
    'the5ers-vs-alpha-capital-group',
  ].map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Individual prop firm pages
  const firmPages = firms?.map(firm => ({
    url: `${baseUrl}/prop-firm/${firm.slug}`,
    lastModified: firm.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []
  
  return [
    ...staticPages,
    ...blogArticles,
    ...categoryPages,
    ...vsComparisons,
    ...firmPages,
  ]
}
