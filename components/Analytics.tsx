'use client'

import Script from 'next/script'

interface AnalyticsProps {
  googleAnalyticsId?: string
  plausibleDomain?: string
}

/**
 * Analytics Component
 * 
 * Usage in layout.tsx:
 * <Analytics googleAnalyticsId="G-XXXXXXXXXX" />
 * or
 * <Analytics plausibleDomain="propfirmscanner.org" />
 */
export default function Analytics({ googleAnalyticsId, plausibleDomain }: AnalyticsProps) {
  // No analytics if no IDs provided
  if (!googleAnalyticsId && !plausibleDomain) {
    return null
  }

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Plausible Analytics (privacy-friendly alternative) */}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  )
}

/**
 * Track custom events
 * 
 * Usage:
 * import { trackEvent } from '@/components/Analytics'
 * trackEvent('click_affiliate', { firm: 'FTMO' })
 */
export function trackEvent(eventName: string, properties?: Record<string, string | number | boolean>) {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }

  // Plausible
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props: properties })
  }
}

/**
 * Track affiliate link clicks
 */
export function trackAffiliateClick(firmName: string, firmSlug: string, hasPromoCode: boolean) {
  trackEvent('affiliate_click', {
    firm_name: firmName,
    firm_slug: firmSlug,
    has_promo: hasPromoCode,
  })
}

/**
 * Track promo code copy
 */
export function trackPromoCopy(firmName: string, promoCode: string) {
  trackEvent('promo_copy', {
    firm_name: firmName,
    promo_code: promoCode,
  })
}
