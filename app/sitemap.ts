import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.propfirmscanner.org'
  
  // =====================================================
  // STATIC PAGES
  // =====================================================
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
  
  // =====================================================
  // BLOG ARTICLES (9 articles)
  // =====================================================
  const blogSlugs = [
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
  
  const blogPages = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  
  // =====================================================
  // BEST-FOR CATEGORY PAGES (11 categories)
  // =====================================================
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
  
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/best-for/${category}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // =====================================================
  // VS COMPARISON PAGES (35 total)
  // =====================================================
  const vsComparisons = [
    // Original 15 VS pages
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
    // New 20 VS pages
    'ftmo-vs-seacrest-markets',
    'fundednext-vs-seacrest-markets',
    'the5ers-vs-seacrest-markets',
    'my-crypto-funding-vs-breakout-prop',
    'ftmo-vs-my-crypto-funding',
    'apex-trader-funding-vs-traders-launch',
    'my-funded-futures-vs-alpha-futures',
    'topstep-vs-apex-trader-funding',
    'ftmo-vs-oanda-prop-trader',
    'ftmo-vs-eightcap-challenges',
    'ftmo-vs-blueberry-funded',
    'instant-funding-vs-lark-funding',
    'fundednext-vs-funded-trading-plus',
    'goat-funded-trader-vs-wall-street-funded',
    'ftmo-vs-fxify',
    'the5ers-vs-fundingpips',
    'alpha-capital-group-vs-maven-trading',
    'fundednext-vs-thinkcapital',
    'ftmo-vs-funded-trading-plus',
    'the5ers-vs-alpha-capital-group',
  ]
  
  const vsPages = vsComparisons.map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // =====================================================
  // PROP FIRM PAGES (100 firms)
  // =====================================================
  const firmSlugs = [
    // Original 57 firms
    'alpha-capital-group',
    'apex-trader-funding',
    'aqua-funded',
    'audacity-capital',
    'blue-guardian',
    'brightfunded',
    'bulenox',
    'city-traders-imperium',
    'crypto-fund-trader',
    'dna-funded',
    'e8-funding',
    'earn2trade',
    'elite-trader-funding',
    'fidelcrest',
    'for-traders',
    'ftmo',
    'funded-academy',
    'funded-engineer',
    'funded-trading-plus',
    'fundedfast',
    'fundednext',
    'fundednext-futures',
    'fundedprime',
    'fundedtech',
    'funderpro',
    'fundingpips',
    'fundingticks',
    'fxify',
    'goat-funded-trader',
    'hola-prime',
    'instant-funding',
    'leeloo-trading',
    'lux-trading-firm',
    'maven-trading',
    'ment-funding',
    'my-funded-futures',
    'myfundedfx',
    'nova-funding',
    'onefunded',
    'oneup-trader',
    'phidias-propfirm',
    'pipfarm',
    'rebels-funding',
    'sabiotrade',
    'smart-prop-trader',
    'surge-trading',
    'take-profit-trader',
    'the-funded-trader',
    'the-trading-pit',
    'the5ers',
    'ticktick-trader',
    'topstep',
    'toptier-trader',
    'trade-the-pool',
    'tradeify',
    'true-forex-funds',
    'uprofit',
    // 19 new firms (batch 1)
    'seacrest-markets',
    'blueberry-funded',
    'eightcap-challenges',
    'breakout-prop',
    'my-crypto-funding',
    'thinkcapital',
    'traders-launch',
    'forfx',
    'lark-funding',
    'atmosfunded',
    'atfunded',
    'funded-trader-markets',
    'qt-funded',
    'wall-street-funded',
    'top-one-trader',
    'top-one-futures',
    'oanda-prop-trader',
    'alpha-futures',
    'funded-futures-family',
    // 24 new firms (batch 2)
    'fintokei',
    'hantec-trader',
    'funded-squad',
    'funding-traders',
    'finotive-funding',
    'toptier-trader',
    'ftuk',
    'glow-node',
    'e8-markets',
    'buoytrade',
    'the-forex-funder',
    'equity-edge',
    'fast-track-trading',
    'ic-funded',
    'ascendx-capital',
    'skilled-funded-traders',
    'funded-trader',
    'true-trading-group',
    'prop-trading-fund',
    'fundyourfx',
    'leveled-up-society',
    'fundedconnect',
    'tradable-capital',
    'phoenix-trader-funding',
  ]
  
  const firmPages = firmSlugs.map(slug => ({
    url: `${baseUrl}/prop-firm/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // =====================================================
  // COMBINE ALL PAGES (~165 total)
  // =====================================================
  return [
    ...staticPages,
    ...blogPages,
    ...categoryPages,
    ...vsPages,
    ...firmPages,
  ]
}
