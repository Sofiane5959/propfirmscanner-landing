/**
 * Single source of truth for every outbound link to a partner firm.
 *
 * Nothing on a firm page should ever point at the partner's public URL: that
 * would drop the affiliate parameters, skip the automatic coupon, and leave the
 * click untracked. Routing everything through /api/go/[slug] means the tunnel
 * decides the destination, and adding a new button can no longer silently
 * bypass it.
 *
 * The route reads `source` for logging, `challenge` to resolve a plan-specific
 * affiliate link, and `opt_key`/`opt_value` to carry a checkout choice through.
 */

export interface AffiliateLinkOptions {
  /** Where on the page the click came from. Logged in affiliate_clicks.source. */
  placement: string
  /** Challenge slug — lets the tunnel deep-link to that exact plan. */
  challenge?: string | null
  /** Human-readable program name, for analytics only. */
  program?: string | null
  /** Account size label, for analytics only. */
  size?: string | null
  /** Firm-specific checkout choice, e.g. platform=blackarrow. */
  optKey?: string | null
  optValue?: string | null
  locale?: string | null
}

export function buildAffiliateUrl(firmSlug: string, options: AffiliateLinkOptions): string {
  const params = new URLSearchParams()

  // `source` is the column the tunnel actually logs; `placement` is kept as an
  // explicit alias so the intent stays readable in the query string itself.
  params.set('source', options.placement)
  params.set('placement', options.placement)

  if (options.locale) params.set('locale', options.locale)
  if (options.challenge) params.set('challenge', options.challenge)
  if (options.program) params.set('program', options.program)
  if (options.size) params.set('size', options.size)
  if (options.optKey && options.optValue) {
    params.set('opt_key', options.optKey)
    params.set('opt_value', options.optValue)
  }

  return `/api/go/${firmSlug}?${params.toString()}`
}

/** Attributes every outbound partner link must carry. */
export const AFFILIATE_LINK_PROPS = {
  target: '_blank',
  rel: 'sponsored noopener noreferrer',
} as const

/**
 * What this function can and cannot guarantee.
 *
 * CAN: every outbound click leaves our site through /api/go, carrying the
 * affiliate id, the tracking parameters and — where the destination supports it
 * — the coupon as a URL parameter. The click is logged with its placement.
 *
 * CANNOT: keep the coupon applied once the visitor is browsing the partner's
 * site. That depends on the partner's own cookie lifetime and on how they
 * prioritise their campaign codes against affiliate coupons. Earn2Trade, for
 * one, overwrites the coupon field with an active site-wide campaign.
 *
 * The only path where the coupon is certain is a deep link that lands straight
 * on the partner's checkout with the code in the query string — which is what
 * the configurator does via each challenge's own affiliate_url. Links that drop
 * the visitor on a landing page to browse are best-effort by nature.
 */
export const AFFILIATE_COUPON_GUARANTEE = 'deep-link-only' as const
