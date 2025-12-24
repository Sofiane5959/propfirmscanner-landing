import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.propfirmscanner.org'
  
  // Pages statiques - toujours disponibles
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/risk-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/rule-tracker`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Best-for pages
  const bestForCategories = [
    'scalping', 'news-trading', 'beginners', 'swing-trading',
    'ea-trading', 'high-profit-split', 'cheapest', 'instant-funding',
    'forex', 'futures', 'crypto'
  ]
  
  const bestForPages: MetadataRoute.Sitemap = bestForCategories.map(category => ({
    url: `${baseUrl}/best-for/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Blog articles
  const blogSlugs = [
    'how-to-pass-prop-firm-challenge',
    'best-prop-firms-2025',
    'trailing-drawdown-explained',
    'daily-vs-max-drawdown',
    'top-7-reasons-traders-fail',
    'prop-firm-profit-split-trap',
  ]
  
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Pages dynamiques - Prop Firms individuels
  let propFirmPages: MetadataRoute.Sitemap = []
  
  try {
    // Vérifier si les variables d'environnement existent
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      const { data: firms, error } = await supabase
        .from('prop_firms')
        .select('slug, updated_at')
        .order('name')
      
      if (!error && firms && firms.length > 0) {
        propFirmPages = firms.map((firm) => ({
          url: `${baseUrl}/prop-firm/${firm.slug}`,
          lastModified: firm.updated_at ? new Date(firm.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching prop firms for sitemap:', error)
    // Continue without prop firm pages - sitemap will still work
  }

  return [
    ...staticPages,
    ...bestForPages,
    ...blogPages,
    ...propFirmPages,
  ]
}
