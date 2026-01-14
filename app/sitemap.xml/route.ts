import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const baseUrl = 'https://www.propfirmscanner.org'
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/compare', priority: '0.9', changefreq: 'daily' },
    { url: '/deals', priority: '0.9', changefreq: 'daily' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/guide', priority: '0.8', changefreq: 'monthly' },
  ]

  // Fetch dynamic pages (prop firms)
  let firmPages: { url: string; priority: string; changefreq: string }[] = []
  
  try {
    const supabase = createServerSupabaseClient()
    const { data: firms } = await supabase
      .from('prop_firms')
      .select('slug, updated_at')
      .order('trustpilot_rating', { ascending: false })
    
    if (firms) {
      firmPages = firms.map(firm => ({
        url: `/prop-firm/${firm.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
      }))
    }
  } catch (error) {
    console.error('Error fetching firms for sitemap:', error)
  }

  // Blog posts (static for now - could be dynamic)
  const blogPosts = [
    'how-to-choose-right-prop-firm',
    'how-to-pass-prop-firm-challenge',
    'best-prop-firms-2025',
    'news-trading-rules-explained',
    'consistency-rules-explained',
    'trailing-drawdown-explained',
    'prop-firm-payout-guide',
    'why-traders-fail-challenges',
    'ftmo-review-2025',
    'the5ers-review-2025',
  ].map(slug => ({
    url: `/blog/${slug}`,
    priority: '0.6',
    changefreq: 'monthly',
  }))

  const allPages = [...staticPages, ...firmPages, ...blogPosts]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
