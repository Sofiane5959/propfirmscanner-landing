// =============================================================================
// PROP FIRM AFFILIATE LINKS DATABASE
// Last updated: January 2026
// =============================================================================

export interface PropFirmAffiliate {
  name: string;
  slug: string;
  affiliateLink: string | null;
  promoCode: string | null;
  hasAffiliate: boolean;
  verified: boolean;
  featured: boolean; // Show first in listings
}

// =============================================================================
// FIRMS WITH AFFILIATE LINKS (Show first, sorted by priority)
// =============================================================================

export const AFFILIATE_PROP_FIRMS: PropFirmAffiliate[] = [
  // TIER 1 - Verified & Active
  {
    name: 'The 5%ers',
    slug: 'the5ers',
    affiliateLink: 'https://www.the5ers.com/?afmc=13z1',
    promoCode: null,
    hasAffiliate: true,
    verified: true,
    featured: true,
  },
  {
    name: 'Maven Trading',
    slug: 'maven-trading',
    affiliateLink: 'https://maventrading.com?ref=zme1m2j',
    promoCode: null,
    hasAffiliate: true,
    verified: true,
    featured: true,
  },
  {
    name: 'Blue Guardian',
    slug: 'blue-guardian',
    affiliateLink: 'https://blueguardian.com/?afmc=1tpr',
    promoCode: 'NEWYEAR',
    hasAffiliate: true,
    verified: true,
    featured: true,
  },
  {
    name: 'Funded Trading Plus',
    slug: 'funded-trading-plus',
    affiliateLink: 'https://www.fundedtradingplus.com?ref=propfirmscanner',
    promoCode: 'GIFT',
    hasAffiliate: true,
    verified: true,
    featured: true,
  },
  {
    name: 'Instant Funding',
    slug: 'instant-funding',
    affiliateLink: 'https://instantfunding.com/?partner=7543',
    promoCode: 'AFF7543',
    hasAffiliate: true,
    verified: true,
    featured: true,
  },
  {
    name: 'Alpha Capital Group',
    slug: 'alpha-capital-group',
    affiliateLink: 'https://app.alphacapitalgroup.uk/signup/XYINW',
    promoCode: 'XYINW',
    hasAffiliate: true,
    verified: true,
    featured: true,
  },
  {
    name: 'Funding Pips',
    slug: 'funding-pips',
    affiliateLink: 'https://app.fundingpips.com/register?ref=10BE678C',
    promoCode: null,
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'Prime Funding',
    slug: 'prime-funding',
    affiliateLink: 'https://prime-funding.com?ref=scanner-20',
    promoCode: 'scanner-20',
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'DNA Funded',
    slug: 'dna-funded',
    affiliateLink: 'https://partners.dnafunded.com/click?campaign_id=1&ref_id=675',
    promoCode: null,
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'Seacrest Markets',
    slug: 'seacrest-markets',
    affiliateLink: 'https://fundedtech.seacrestmarkets.io/purchasechallenge?sl=11739',
    promoCode: null,
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'Funded Trader Markets',
    slug: 'funded-trader-markets',
    affiliateLink: 'https://fundedtradermarkets.com/ref/Sofiane',
    promoCode: null,
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'QT Funded',
    slug: 'qt-funded',
    affiliateLink: 'https://qtfunded.quanttekel.com/ref/5508/',
    promoCode: 'UAVF1YJJNE',
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'FundingTicks',
    slug: 'fundingticks',
    affiliateLink: 'https://app.fundingticks.com/register?ref=C1182EEE',
    promoCode: 'C1182EEE',
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'Top One Futures',
    slug: 'top-one-futures',
    affiliateLink: 'https://toponefutures.com/?linkId=lp_707970&sourceId=scanner-30&tenantId=toponefutures',
    promoCode: 'pfs',
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'Funded Elite',
    slug: 'funded-elite',
    affiliateLink: 'https://app.fundedelite.com?aff=AFF4544253',
    promoCode: null,
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
  {
    name: 'Goat Funded Trader',
    slug: 'goat-funded-trader',
    affiliateLink: 'https://www.propfirmscanner.org/aff/Sofiane/',
    promoCode: null,
    hasAffiliate: true,
    verified: false,
    featured: true,
  },
];

// =============================================================================
// FIRMS WITHOUT AFFILIATE LINKS (Show after affiliates)
// =============================================================================

export const NON_AFFILIATE_PROP_FIRMS: PropFirmAffiliate[] = [
  { name: 'FTMO', slug: 'ftmo', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FundedNext', slug: 'fundednext', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Blueberry Funded', slug: 'blueberry-funded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Eightcap Challenges', slug: 'eightcap-challenges', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Funded Prime', slug: 'funded-prime', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Breakout Prop', slug: 'breakout-prop', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'My Crypto Funding', slug: 'my-crypto-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'ThinkCapital', slug: 'thinkcapital', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FXIFY', slug: 'fxify', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Traders Launch', slug: 'traders-launch', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FORFX', slug: 'forfx', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Lark Funding', slug: 'lark-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'My Funded Futures', slug: 'my-funded-futures', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Ment Funding', slug: 'ment-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Apex Trader Funding', slug: 'apex-trader-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'AtmosFunded', slug: 'atmosfunded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'ATFunded', slug: 'atfunded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'BrightFunded', slug: 'brightfunded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Wall Street Funded', slug: 'wall-street-funded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Top One Trader', slug: 'top-one-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'OANDA Prop Trader', slug: 'oanda-prop-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Tradeify', slug: 'tradeify', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Alpha Futures', slug: 'alpha-futures', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Funded Futures Family', slug: 'funded-futures-family', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Aqua Funded', slug: 'aqua-funded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Audacity Capital', slug: 'audacity-capital', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Axi Select', slug: 'axi-select', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Bulenox', slug: 'bulenox', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'BuoyTrade', slug: 'buoytrade', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'City Traders Imperium', slug: 'city-traders-imperium', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Darwinex Zero', slug: 'darwinex-zero', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'E8 Markets', slug: 'e8-markets', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Earn2Trade', slug: 'earn2trade', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Elite Trader Funding', slug: 'elite-trader-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Finotive Funding', slug: 'finotive-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Fintokei', slug: 'fintokei', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'For Traders', slug: 'for-traders', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FTUK', slug: 'ftuk', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Funded Academy', slug: 'funded-academy', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FundedFast', slug: 'fundedfast', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FundedNext Futures', slug: 'fundednext-futures', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FundedPrime', slug: 'fundedprime', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FundedTech', slug: 'fundedtech', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'FunderPro', slug: 'funderpro', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Hantec Trader', slug: 'hantec-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Hola Prime', slug: 'hola-prime', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'IC Funded', slug: 'ic-funded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Leeloo Trading', slug: 'leeloo-trading', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Lux Trading Firm', slug: 'lux-trading-firm', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'MyFundedFX', slug: 'myfundedfx', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Nordic Funder', slug: 'nordic-funder', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Nova Funding', slug: 'nova-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'OneFunded', slug: 'onefunded', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'OneUp Trader', slug: 'oneup-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Phidias Propfirm', slug: 'phidias-propfirm', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'PipFarm', slug: 'pipfarm', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Rebels Funding', slug: 'rebels-funding', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'SabioTrade', slug: 'sabiotrade', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Surge Trading', slug: 'surge-trading', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Take Profit Trader', slug: 'take-profit-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'The Funded Trader', slug: 'the-funded-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'The Trading Pit', slug: 'the-trading-pit', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'TickTick Trader', slug: 'ticktick-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Topstep', slug: 'topstep', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'TopTier Trader', slug: 'toptier-trader', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Tradable Capital', slug: 'tradable-capital', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'Trade The Pool', slug: 'trade-the-pool', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'True Trading Group', slug: 'true-trading-group', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
  { name: 'UProfit', slug: 'uprofit', affiliateLink: null, promoCode: null, hasAffiliate: false, verified: false, featured: false },
];

// =============================================================================
// COMBINED & SORTED LIST (Affiliates first, then non-affiliates)
// =============================================================================

export const ALL_PROP_FIRMS = [...AFFILIATE_PROP_FIRMS, ...NON_AFFILIATE_PROP_FIRMS];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get affiliate link for a prop firm by slug
 */
export function getAffiliateLink(slug: string): string | null {
  const firm = ALL_PROP_FIRMS.find(f => f.slug === slug);
  return firm?.affiliateLink ?? null;
}

/**
 * Get promo code for a prop firm by slug
 */
export function getPromoCode(slug: string): string | null {
  const firm = ALL_PROP_FIRMS.find(f => f.slug === slug);
  return firm?.promoCode ?? null;
}

/**
 * Check if a firm has an affiliate link
 */
export function hasAffiliateLink(slug: string): boolean {
  const firm = ALL_PROP_FIRMS.find(f => f.slug === slug);
  return firm?.hasAffiliate ?? false;
}

/**
 * Get all firms with affiliate links (for featured sections)
 */
export function getFeaturedFirms(): PropFirmAffiliate[] {
  return AFFILIATE_PROP_FIRMS.filter(f => f.featured);
}

/**
 * Get firms sorted for display (affiliates first)
 */
export function getSortedFirms(): PropFirmAffiliate[] {
  return ALL_PROP_FIRMS;
}
