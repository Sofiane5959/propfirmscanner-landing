/**
 * Deterministic number and date formatting for server-rendered pages.
 *
 * Why not toLocaleString / toLocaleDateString?
 *
 * Both read their data from the runtime's ICU build, and the server's build is
 * not the browser's. Two ways that breaks hydration, both observed as React
 * #425 (text content mismatch) cascading into #422 (hydration failed, root
 * re-rendered on the client):
 *
 *   1. Group separator. Recent ICU emits U+202F (narrow no-break space) for
 *      fr-FR, older builds emit U+00A0. Same code, two different strings.
 *      A Node built with small-icu goes further and silently formats fr-FR
 *      like en-US, so the server writes "1,500" where the browser writes
 *      "1 500".
 *   2. Month names and time zone. toLocaleDateString with no timeZone renders
 *      in the runtime's zone — UTC on the server, the visitor's zone in the
 *      browser — so a timestamp at midnight UTC lands on the previous day for
 *      anyone west of Greenwich. On small-icu, "août" also comes back as
 *      "August".
 *
 * Everything here produces the same string on both sides, from the same input,
 * on any runtime. Only the two locales the pages actually ship (en, fr) are
 * supported, which matches the hardcoded COPY objects in the components.
 */

/**
 * Groups the integer part in threes.
 *
 * `groupSep` separates thousands, `decimalSep` precedes the decimals: French
 * swaps both against English ("1 234,5" against "1,234.5"), so they travel
 * together.
 */
function group(value: number, groupSep: string, decimalSep: string): string {
  const negative = value < 0
  // Two decimals maximum, trailing zeros dropped — what the old
  // toLocaleString({ minimumFractionDigits: 0, maximumFractionDigits: 2 })
  // produced, so no displayed price changes with this switch.
  const rounded = Math.round(Math.abs(value) * 100) / 100
  const [int, decimals] = rounded.toString().split('.')
  let out = ''
  for (let i = 0; i < int.length; i++) {
    if (i > 0 && (int.length - i) % 3 === 0) out += groupSep
    out += int[i]
  }
  if (decimals) out += `${decimalSep}${decimals}`
  return negative ? `-${out}` : out
}

/** A bare number: "1,234.5" in English, "1 234,5" (no-break space) in French. */
export function formatNumber(value: number, locale?: string | null): string {
  return locale === 'fr' ? group(value, '\u00A0', ',') : group(value, ',', '.')
}

/**
 * An amount with its currency where the locale puts it: "$1,500" against
 * "1 500 $". `suffix` carries things like "/month" inside the returned string
 * so callers do not have to know which side the sign sits on.
 */
export function formatMoney(value: number, locale?: string | null, suffix = ''): string {
  return locale === 'fr'
    ? `${formatNumber(value, 'fr')}\u00A0$${suffix}`
    : `$${formatNumber(value, 'en')}${suffix}`
}

// Written out rather than derived, so the strings never depend on the
// runtime's locale data.
const MONTHS: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June',
       'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
       'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
}

/**
 * Day and month of a timestamp, read in UTC: "31 August" / "31 août".
 *
 * UTC is the right frame here, not a convenience: these are calendar
 * deadlines stored as timestamptz, and an offer that ends on the 31st ends on
 * the 31st for every reader. Returns null on an unparseable value so callers
 * can drop the line rather than print "Invalid Date".
 */
export function formatDayMonth(iso: string | null | undefined, locale?: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const months = locale === 'fr' ? MONTHS.fr : MONTHS.en
  const day = date.getUTCDate()
  const month = months[date.getUTCMonth()]
  return locale === 'fr' ? `${day} ${month}` : `${day} ${month}`
}
