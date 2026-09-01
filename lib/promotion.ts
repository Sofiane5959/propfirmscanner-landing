/**
 * Single source of truth for whether a firm's promotion is live.
 *
 * The page used to read discount_expires_at only to print "offer runs until X"
 * while the price itself was computed from discount_percent with no date test
 * at all. On 1 September 2026 the Earn2Trade page was still selling a 50% offer
 * that ended on 31 August: $75 advertised against a $150 list price, with the
 * code and the "first four billings" wording still on screen.
 *
 * Everything that shows a price, a code, a struck-through figure or an expiry
 * label must go through resolvePromotion, so the hero, the configurator, the
 * cost timeline, the CTAs, the metadata and the structured data can never
 * disagree about whether an offer exists.
 */

export interface PromotionSource {
  discount_code?: string | null
  discount_percent?: number | null
  discount_expires_at?: string | null
  discount_starts_at?: string | null
  discount_note?: string | null
}

export interface Promotion {
  /** True only when a usable code, a percentage and the current date all agree. */
  isActive: boolean
  code: string | null
  percent: number | null
  note: string | null
  /** End date, kept even when inactive so callers can explain what expired. */
  expiresAt: Date | null
  /** Why it is not active. Null when it is. */
  inactiveReason: 'no-code' | 'no-percent' | 'not-started' | 'expired' | null
}

const INACTIVE = (reason: Promotion['inactiveReason'], expiresAt: Date | null = null): Promotion => ({
  isActive: false,
  code: null,
  percent: null,
  note: null,
  expiresAt,
  inactiveReason: reason,
})

/** Parses a DB date. Returns null rather than an Invalid Date. */
function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  // A bare 'YYYY-MM-DD' is read as UTC midnight, so an offer dated the 31st is
  // live for the whole of the 31st wherever the reader is.
  const date = new Date(value.length === 10 ? `${value}T23:59:59.999Z` : value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function resolvePromotion(firm: PromotionSource | null | undefined, now: Date = new Date()): Promotion {
  if (!firm) return INACTIVE('no-code')

  const expiresAt = parseDate(firm.discount_expires_at)

  // 'PENDING' is the placeholder used while a code is being negotiated. It is
  // not something a visitor can type at a checkout.
  const code = firm.discount_code && firm.discount_code !== 'PENDING' ? firm.discount_code : null
  if (!code) return INACTIVE('no-code', expiresAt)

  const percent = typeof firm.discount_percent === 'number' && firm.discount_percent > 0
    ? firm.discount_percent
    : null
  if (!percent) return INACTIVE('no-percent', expiresAt)

  const startsAt = parseDate(firm.discount_starts_at)
  if (startsAt && now < startsAt) return INACTIVE('not-started', expiresAt)
  if (expiresAt && now > expiresAt) return INACTIVE('expired', expiresAt)

  return { isActive: true, code, percent, note: firm.discount_note ?? null, expiresAt, inactiveReason: null }
}

/**
 * Price a visitor actually pays today.
 *
 * `discounted` is the partner-supplied figure and wins when present; otherwise
 * the percentage is applied. With no live promotion the list price is returned
 * unchanged and `hasDiscount` is false, so no struck-through figure is drawn —
 * the project rule is never to show one without a usable code.
 */
export function priceWith(
  promotion: Promotion,
  listPrice: number | null | undefined,
  discounted?: number | null
): { original: number | null; final: number | null; hasDiscount: boolean } {
  const original = typeof listPrice === 'number' ? listPrice : null
  if (!promotion.isActive || original === null) {
    return { original, final: original, hasDiscount: false }
  }
  const final = typeof discounted === 'number'
    ? discounted
    : Math.round(original * (1 - (promotion.percent as number) / 100) * 100) / 100
  return { original, final, hasDiscount: final !== null && final < original }
}
