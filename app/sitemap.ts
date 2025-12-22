import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.propfirmscanner.org'
  
  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Pages des prop firms (à générer dynamiquement depuis Supabase)
  const propFirmSlugs = [
    'ftmo',
    'fundednext',
    'goat-funded-trader',
    'the5ers',
    'fxify',
    'e8-funding',
    'apex-trader-funding',
    'topstep',
    'my-forex-funds',
    'true-forex-funds',
    'funded-trading-plus',
    'alpha-capital',
    'blue-guardian',
    'city-traders-imperium',
    'lux-trading-firm',
  ]

  const propFirmPages = propFirmSlugs.map((slug) => ({
    url: `${baseUrl}/prop-firm/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...propFirmPages]
}
