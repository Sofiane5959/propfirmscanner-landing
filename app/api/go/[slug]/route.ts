// app/api/go/[slug]/route.ts
//
// Affiliate click tracker + redirector.
//
// Flow:
//   1. User clicks an affiliate/website link on the site
//   2. Browser hits /api/go/{slug}?source=compare-card&locale=en
//   3. This route:
//      - Looks up the firm in Supabase
//      - If ?challenge={slug} is present, prefers that challenge's own
//        affiliate_url so the visitor lands on the exact plan they picked
//      - Otherwise picks the firm's affiliate_url, else website_url
//      - Mints a per-click id, logs it in affiliate_clicks (using service role
//        key, bypasses RLS) and hands it to the partner via the firm's
//        subid_param so a commission can be traced back to this exact click
//      - Redirects (302) to the real destination
//
// Why server-side (not client-side beacons):
//   - More reliable: client beacons can be blocked by ad blockers
//   - Slightly slower (~50-150ms) but invisible to the user
//   - Works for users with JS disabled (rare but real)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// ============================================================
// CONFIG
// ============================================================
// Service-role client bypasses RLS — we use it to write logs without
// requiring the visitor to be authenticated.
// IMPORTANT: SUPABASE_SERVICE_ROLE_KEY must be set in Vercel env vars
// (NOT prefixed with NEXT_PUBLIC, never exposed to the browser).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Salt for IP hashing — change this once and clicks across the change
// won't be linkable. Keep it stable in production.
const IP_HASH_SALT = process.env.IP_HASH_SALT || 'propfirmscanner-default-salt-change-me'

// Crude bot detection: bail on common crawlers/bots so we don't pollute analytics
const BOT_UA_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /facebookexternalhit/i, /slack/i,
  /twitterbot/i, /whatsapp/i, /telegrambot/i, /linkedinbot/i,
  /headless/i, /phantomjs/i, /lighthouse/i, /pagespeed/i,
]

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true // missing UA = suspicious
  return BOT_UA_PATTERNS.some(p => p.test(userAgent))
}

/**
 * Is this request a speculative fetch rather than a human clicking?
 *
 * Next-Router-Prefetch is the App Router's prefetch marker. RSC marks any
 * router-initiated request: on this route that can only ever be a prefetch or
 * a client navigation that is about to fail anyway, because the response is a
 * redirect to a partner domain and the router cannot follow that — it falls
 * back to a full browser navigation, which reaches us again without the
 * header and is logged then. Purpose / Sec-Purpose come from the browser
 * itself (Chrome sends "prefetch", sometimes "prefetch;prerender").
 */
function isPrefetch(request: NextRequest): boolean {
  const h = request.headers
  if (h.get('next-router-prefetch')) return true
  if (h.get('rsc')) return true
  const purpose = `${h.get('purpose') || ''} ${h.get('x-purpose') || ''} ${h.get('sec-purpose') || ''}`
  return purpose.toLowerCase().includes('prefetch')
}

function hashIp(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + IP_HASH_SALT)
    .digest('hex')
    .slice(0, 32) // 32 chars is plenty
}

// Length of the per-click id handed to partner networks.
const CLICK_ID_LENGTH = 16

/**
 * Mint the id that ties a row in affiliate_clicks to a commission in the
 * partner's panel.
 *
 * Base36 rather than a UUID: this travels in a query string that already
 * carries plan, discount, a_pid, a_bid and platform, and 36 hyphenated
 * characters is dead weight there.
 *
 * 11 random bytes is 88 bits, which covers the full 16-character base36 range
 * (36^16 is about 2^82.7). Taking the low 16 digits keeps the length fixed;
 * padStart only ever fires for an improbably small draw. At this traffic
 * volume collisions are a non-event, and the partial unique index on
 * affiliate_clicks.click_id would surface one anyway.
 *
 * Returns null instead of throwing: a click that cannot be identified must
 * still redirect.
 */
function generateClickId(): string | null {
  try {
    const value = BigInt('0x' + crypto.randomBytes(11).toString('hex'))
    return value.toString(36).slice(-CLICK_ID_LENGTH).padStart(CLICK_ID_LENGTH, '0')
  } catch {
    return null
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // ----------------------------------------------------------
  // 0. A prefetch is not a click
  // ----------------------------------------------------------
  // Browsers and the Next.js router fetch links before anyone clicks them.
  // Everything this route does — mint a click_id, write a row, redirect — is
  // a side effect, so an unfiltered prefetch invents a conversion. The banner
  // in the root layout used next/link, so every page view fired one of these
  // per visible deal; that is the bulk of the historical affiliate_clicks
  // rows and the "repeated" clicks in the partner panel.
  //
  // This runs before the firm lookup and before generateClickId(), so a
  // prefetch costs neither a database row nor an identifier.
  //
  // 204 rather than a redirect: a cached 3xx could be replayed as the real
  // navigation later and skip the tracker entirely. An empty, uncacheable
  // response makes the browser come back for the actual click.
  if (isPrefetch(request)) {
    return new NextResponse(null, {
      status: 204,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const { slug } = params
  const url = new URL(request.url)
  
  // Read source/locale from query string (set by the calling component)
  const source = url.searchParams.get('source') || 'unknown'
  const locale = url.searchParams.get('locale') || 'en'
  const utm_source = url.searchParams.get('utm_source')
  const utm_medium = url.searchParams.get('utm_medium')
  const utm_campaign = url.searchParams.get('utm_campaign')
  // Set by ChallengeSelector — the slug of the specific plan configured.
  const challengeSlug = url.searchParams.get('challenge')
  // Firm-specific checkout choice (e.g. Earn2Trade's market data feed).
  // Key and value both come from the DB-driven selector, but we still
  // sanitise them: they get appended to an outbound URL.
  const SAFE = /^[a-z0-9_-]{1,40}$/i
  const rawOptKey = url.searchParams.get('opt_key')
  const rawOptValue = url.searchParams.get('opt_value')
  const optKey = rawOptKey && SAFE.test(rawOptKey) ? rawOptKey : null
  const optValue = rawOptValue && SAFE.test(rawOptValue) ? rawOptValue : null
  
  // ----------------------------------------------------------
  // 1. Look up the firm
  // ----------------------------------------------------------
  if (!slug || slug.length > 200) {
    return NextResponse.redirect(new URL('/', request.url), 302)
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  
  const { data: firm, error: firmError } = await supabase
    .from('prop_firms')
    .select('slug, name, affiliate_url, website_url, subid_param')
    .eq('slug', slug)
    .maybeSingle()
  
  // If firm not found, redirect to compare page (graceful fallback)
  if (firmError || !firm) {
    return NextResponse.redirect(new URL('/compare', request.url), 302)
  }
  
  // ----------------------------------------------------------
  // 1b. Program-specific affiliate link
  // ----------------------------------------------------------
  // Some firms hand out one affiliate URL per program (Earn2Trade has a
  // separate link for Trader Career Path and Gauntlet Mini). Sending every
  // visitor to the firm-level link means someone who configured a Gauntlet
  // Mini 150K lands on the Trader Career Path page and has to navigate again.
  // The lookup is scoped to this firm so a crafted ?challenge= value can
  // never redirect to another firm's link.
  let challengeAffiliate: string | null = null
  if (challengeSlug && challengeSlug.length <= 200) {
    const { data: challenge } = await supabase
      .from('prop_firm_challenges')
      .select('affiliate_url')
      .eq('firm_slug', firm.slug)
      .eq('slug', challengeSlug)
      .maybeSingle()

    if (challenge?.affiliate_url && challenge.affiliate_url !== '#') {
      challengeAffiliate = challenge.affiliate_url
    }
  }

  // Pick the destination: challenge link, then firm affiliate, then website
  const firmAffiliate = firm.affiliate_url && firm.affiliate_url !== '#' ? firm.affiliate_url : null
  const website = firm.website_url && firm.website_url !== '#' ? firm.website_url : null
  const destination = challengeAffiliate || firmAffiliate || website
  
  if (!destination) {
    // Nothing to redirect to — back to the firm's page on our site
    return NextResponse.redirect(new URL(`/${locale}/prop-firm/${slug}`, request.url), 302)
  }
  
  const destinationType = challengeAffiliate
    ? 'affiliate_challenge'
    : firmAffiliate
    ? 'affiliate'
    : 'website'
  
  // ----------------------------------------------------------
  // 2. Gather request metadata for the click log
  // ----------------------------------------------------------
  // IP — Vercel forwards the real IP in x-forwarded-for / x-real-ip headers
  const xff = request.headers.get('x-forwarded-for') || ''
  const realIp = request.headers.get('x-real-ip') || ''
  const rawIp = (xff.split(',')[0] || realIp || '').trim() || 'unknown'
  const ip_hash = rawIp !== 'unknown' ? hashIp(rawIp) : null
  
  // Country / region — Vercel injects geo headers automatically
  const country = request.headers.get('x-vercel-ip-country') || null
  const region = request.headers.get('x-vercel-ip-country-region') || null
  
  const userAgent = request.headers.get('user-agent')
  const referrer = request.headers.get('referer') // sic — HTTP spec misspelled it
  const botDetected = isBot(userAgent)
  
  // ----------------------------------------------------------
  // 2b. Per-click id and the parameter that carries it
  // ----------------------------------------------------------
  // Minted before the insert so the id reaches the database whether or not
  // the outbound URL can be built. A row without a redirect is still worth
  // something; a redirect with no row is not.
  const clickId = generateClickId()

  // Which query parameter this partner reads the sub-id from. NULL means the
  // network has no such field — we add nothing rather than send a parameter it
  // would drop silently, which would look like attribution we don't have.
  // The value comes from the database but ends up in an outbound URL, so it
  // gets the same strict validation as opt_key.
  const rawSubidParam: unknown = (firm as { subid_param?: string | null }).subid_param
  const subidParam =
    typeof rawSubidParam === 'string' && SAFE.test(rawSubidParam) ? rawSubidParam : null

  // ----------------------------------------------------------
  // 3. Fire-and-forget the insert (don't block the redirect)
  // ----------------------------------------------------------
  // We intentionally don't `await` this — if the insert is slow or fails,
  // we still want the user to be redirected promptly. Errors are logged
  // server-side but don't affect the visitor experience.
  supabase
    .from('affiliate_clicks')
    .insert({
      click_id: clickId,
      // Real navigations only — prefetches never reach this line. Kept
      // explicit so the dashboard can filter on it and so the historical
      // rows, which predate the filter, stay distinguishable.
      is_prefetch: false,
      firm_slug: firm.slug,
      firm_name: firm.name,
      destination_type: destinationType,
      destination_url: destination,
      source,
      locale,
      ip_hash,
      country,
      region,
      user_agent: userAgent?.slice(0, 500) || null, // cap length
      referrer: referrer?.slice(0, 500) || null,
      utm_source,
      utm_medium,
      utm_campaign,
      is_bot: botDetected,
    })
    .then(({ error }) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[click-tracker] insert failed', error.message)
      }
    })
  
  // ----------------------------------------------------------
  // 4. Redirect
  // ----------------------------------------------------------
  // Append the checkout choice and the sub-id without disturbing the affiliate
  // params already on the destination (a_pid / a_bid must survive intact).
  // searchParams.set() rather than string concatenation: deep links already
  // carry plan, discount, a_pid, a_bid and platform, and hand-joining would
  // break the encoding.
  const wantsOpt = Boolean(optKey && optValue)
  const wantsSubid = Boolean(subidParam && clickId)
  let finalDestination = destination
  if (wantsOpt || wantsSubid) {
    try {
      const dest = new URL(destination)
      if (optKey && optValue) dest.searchParams.set(optKey, optValue)
      if (subidParam && clickId) dest.searchParams.set(subidParam, clickId)
      finalDestination = dest.toString()
    } catch {
      // Malformed destination in the DB — redirect to it unchanged rather than
      // failing the click. The click id is already on its way to the database,
      // so the click stays accounted for even without the sub-id.
    }
  }

  // Status 302 (Found) — temporary redirect, prevents browsers from caching
  // the redirect (which would skip our tracker on subsequent clicks).
  return NextResponse.redirect(finalDestination, 302)
}

// Disable static caching for this route — must run on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0
