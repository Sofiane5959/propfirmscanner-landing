'use client'

// Tracking des clics affiliés pour Google Analytics 4
export const trackAffiliateClick = (firmName: string, url: string, source: string = 'compare') => {
  // Google Analytics 4 Event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      event_category: 'Affiliate',
      event_label: firmName,
      firm_name: firmName,
      destination_url: url,
      click_source: source, // 'compare', 'deals', 'prop-firm-page'
    })
  }

  // Console log pour debug (à retirer en production)
  console.log(`[Affiliate Click] ${firmName} from ${source}`)
}

// Hook pour tracker les clics
export function useAffiliateTracking() {
  const track = (firmName: string, url: string, source?: string) => {
    trackAffiliateClick(firmName, url, source || 'unknown')
  }

  return { track }
}
