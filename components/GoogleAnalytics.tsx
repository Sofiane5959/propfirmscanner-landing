'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_MEASUREMENT_ID = 'G-D5MHEMD4QG'

// Track page views
function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      
      {/* Page view tracker */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  )
}

// =============================================================================
// CUSTOM EVENT TRACKING FUNCTIONS
// =============================================================================

// Track affiliate link clicks
export function trackAffiliateClick(firmName: string, firmSlug: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', {
      event_category: 'engagement',
      event_label: firmName,
      firm_slug: firmSlug,
    })
  }
}

// Track comparison views
export function trackCompareView(firms: string[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'compare_view', {
      event_category: 'engagement',
      event_label: firms.join(' vs '),
      firms_count: firms.length,
    })
  }
}

// Track price alert creation
export function trackPriceAlert(firmName: string, targetPrice: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'price_alert_created', {
      event_category: 'conversion',
      event_label: firmName,
      value: targetPrice,
    })
  }
}

// Track sign up
export function trackSignUp(method: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    })
  }
}

// Track discount code copy
export function trackDiscountCopy(firmName: string, code: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'discount_code_copy', {
      event_category: 'engagement',
      event_label: firmName,
      discount_code: code,
    })
  }
}

// Track search
export function trackSearch(searchTerm: string, resultsCount: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
    })
  }
}

// Track filter usage
export function trackFilterUse(filterType: string, filterValue: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'filter_use', {
      event_category: 'engagement',
      filter_type: filterType,
      filter_value: filterValue,
    })
  }
}

// =============================================================================
// TYPE DECLARATION FOR WINDOW.GTAG
// =============================================================================
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}
