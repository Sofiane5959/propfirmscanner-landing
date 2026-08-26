import { createClient } from '@supabase/supabase-js'
import { cache } from 'react'

/**
 * How many firms the site actually lists.
 *
 * The number was hardcoded in about twenty places and had drifted apart:
 * 50+, 55+, 70+, 80+, 90+ and 92 were all on the site at the same time,
 * sometimes two of them one click apart. A visitor who notices cannot tell
 * which one is true, and neither can we.
 *
 * One query, one answer. Server-side only: it needs the anon key and a
 * round-trip, and `cache()` keeps it to a single call per render pass.
 */
export const getListedFirmCount = cache(async (): Promise<number | null> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  try {
    const supabase = createClient(url, key)
    const { count, error } = await supabase
      .from('prop_firms')
      .select('*', { count: 'exact', head: true })
      .eq('listing_status', 'listed')

    return error ? null : count ?? null
  } catch {
    // Build-time network failure, missing table, anything: the caller falls
    // back to wording with no number in it. Never a guess.
    return null
  }
})

/**
 * Renders the count for marketing copy, rounded DOWN to the nearest ten and
 * suffixed: 92 becomes "90+". Rounding down keeps the claim true between
 * deploys, when a firm is delisted and the page is still cached.
 *
 * Returns null when the count is unavailable, so callers drop the number
 * rather than print a stale one.
 */
export function formatFirmCount(count: number | null): string | null {
  if (count === null || count < 10) return null
  return `${Math.floor(count / 10) * 10}+`
}
