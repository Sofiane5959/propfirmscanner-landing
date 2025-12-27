// Extended list of VS comparison pages to add
// These should be added to your vsPages array in the sitemap and routing

export const EXTENDED_VS_PAGES = [
  // Existing (keep these)
  'ftmo-vs-fundednext',
  'ftmo-vs-the5ers',
  'ftmo-vs-myfundedfx',
  'ftmo-vs-fxify',
  'fundednext-vs-the5ers',
  'fundednext-vs-myfundedfx',
  'apex-trader-funding-vs-topstep',
  'the5ers-vs-fxify',
  'myfundedfx-vs-fxify',
  'ftmo-vs-apex-trader-funding',
  'fundednext-vs-fxify',
  'the5ers-vs-myfundedfx',
  'apex-trader-funding-vs-earn2trade',
  'ftmo-vs-blue-guardian',
  'fundednext-vs-blue-guardian',
  
  // NEW - Popular FTMO comparisons
  'ftmo-vs-e8-funding',
  'ftmo-vs-true-forex-funds',
  'ftmo-vs-my-forex-funds',
  'ftmo-vs-funded-trading-plus',
  'ftmo-vs-alpha-capital-group',
  
  // NEW - FundedNext comparisons
  'fundednext-vs-e8-funding',
  'fundednext-vs-alpha-capital-group',
  'fundednext-vs-funded-trading-plus',
  'fundednext-vs-instant-funding',
  
  // NEW - Futures focused
  'apex-trader-funding-vs-bulenox',
  'topstep-vs-earn2trade',
  'topstep-vs-bulenox',
  'apex-trader-funding-vs-take-profit-trader',
  'topstep-vs-take-profit-trader',
  
  // NEW - The5ers comparisons
  'the5ers-vs-e8-funding',
  'the5ers-vs-funded-trading-plus',
  'the5ers-vs-alpha-capital-group',
  
  // NEW - Budget options
  'myfundedfx-vs-e8-funding',
  'myfundedfx-vs-funded-trading-plus',
  'fxify-vs-e8-funding',
  'fxify-vs-alpha-capital-group',
  
  // NEW - Blue Guardian comparisons
  'blue-guardian-vs-fxify',
  'blue-guardian-vs-e8-funding',
  'blue-guardian-vs-the5ers',
  
  // NEW - Instant funding comparisons
  'instant-funding-vs-ftmo',
  'instant-funding-vs-the5ers',
  'instant-funding-vs-fxify',
]

// Helper to generate VS page data
export interface VSPageData {
  slug: string
  firm1: string
  firm2: string
  title: string
  description: string
}

export function generateVSPageData(slug: string): VSPageData {
  const [firm1Slug, firm2Slug] = slug.split('-vs-')
  
  const firmNames: Record<string, string> = {
    'ftmo': 'FTMO',
    'fundednext': 'FundedNext',
    'the5ers': 'The5ers',
    'myfundedfx': 'MyFundedFX',
    'fxify': 'FXIFY',
    'apex-trader-funding': 'Apex Trader Funding',
    'topstep': 'Topstep',
    'earn2trade': 'Earn2Trade',
    'blue-guardian': 'Blue Guardian',
    'e8-funding': 'E8 Funding',
    'true-forex-funds': 'True Forex Funds',
    'my-forex-funds': 'My Forex Funds',
    'funded-trading-plus': 'Funded Trading Plus',
    'alpha-capital-group': 'Alpha Capital Group',
    'bulenox': 'Bulenox',
    'take-profit-trader': 'Take Profit Trader',
    'instant-funding': 'Instant Funding',
  }
  
  const firm1 = firmNames[firm1Slug] || firm1Slug
  const firm2 = firmNames[firm2Slug] || firm2Slug
  
  return {
    slug,
    firm1,
    firm2,
    title: `${firm1} vs ${firm2} - Which is Better? (2026 Comparison)`,
    description: `Compare ${firm1} vs ${firm2} side by side. See pricing, rules, profit splits, and reviews to find the best prop firm for your trading style.`,
  }
}

// Generate all VS pages data
export const ALL_VS_PAGES_DATA = EXTENDED_VS_PAGES.map(generateVSPageData)

// Total count
export const VS_PAGES_COUNT = EXTENDED_VS_PAGES.length // 50+ pages
