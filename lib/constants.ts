// Site-wide constants for consistency
// Update these values in ONE place to update everywhere

export const SITE_STATS = {
  // Number of prop firms in the database
  PROP_FIRMS_COUNT: 90,
  
  // Display text for prop firms count
  PROP_FIRMS_TEXT: '90+',
  
  // Traders who trust us (use real number or reasonable estimate)
  TRADERS_COUNT: 5000,
  TRADERS_TEXT: '5,000+',
  
  // Maximum discount available
  MAX_DISCOUNT: 25,
  MAX_DISCOUNT_TEXT: 'up to 25%',
  
  // For deals page (promotional/seasonal)
  MAX_PROMO_DISCOUNT: 80,
  MAX_PROMO_DISCOUNT_TEXT: 'up to 80%',
  
  // Comparison pages count
  VS_PAGES_COUNT: 35,
  
  // Blog articles count  
  BLOG_ARTICLES_COUNT: 9,
  
  // Categories count
  CATEGORIES_COUNT: 11,
}

export const VERIFICATION_INFO = {
  // When data was last verified
  LAST_VERIFIED_DATE: '2025-12-27',
  
  // Data source
  DATA_SOURCE: 'Trustpilot',
  
  // Update frequency
  UPDATE_FREQUENCY: 'Weekly',
}

// Helper function to format date
export function formatVerifiedDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Get last verified display text
export function getLastVerifiedText(): string {
  return `Last verified: ${formatVerifiedDate(VERIFICATION_INFO.LAST_VERIFIED_DATE)}`
}
