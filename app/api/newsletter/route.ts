/**
 * POST /api/newsletter
 *
 * Body: { email: string, name?: string, traderLevel?: 'beginner'|'intermediate'|'expert',
 *         sourcePage?: string, sourceLocale?: string }
 *
 * Flow:
 *   1. Validate input (Zod-style manual checks, no extra deps)
 *   2. Hash IP for spam tracking (uses IP_HASH_SALT already in your env)
 *   3. Insert/upsert into Supabase newsletter_subscribers (status='pending')
 *   4. Call Mailchimp API to add contact with status='pending'
 *      → Mailchimp automatically sends the confirmation email
 *   5. Update Supabase row with mailchimp_id once we get one back
 *
 * Privacy:
 *   - We never tell the user "you're already subscribed". Same response either way.
 *   - The route uses the SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
 *     (the table is locked down to service_role only — public can't read emails).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { subscribeToMailchimp } from '@/lib/mailchimp'

export const runtime = 'nodejs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ipHashSalt = process.env.IP_HASH_SALT || 'default-salt-change-me'

// --- Helpers ----------------------------------------------------------------

function isValidEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false
  if (email.length > 254) return false
  // Loose RFC 5322-ish check — Mailchimp will reject hard-invalid ones anyway
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidTraderLevel(value: unknown): value is 'beginner' | 'intermediate' | 'expert' {
  return value === 'beginner' || value === 'intermediate' || value === 'expert'
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function hashIp(ip: string): string {
  return createHash('sha256').update(`${ipHashSalt}:${ip}`).digest('hex').slice(0, 32)
}

// --- Handler ----------------------------------------------------------------

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 })
  }

  // 1. Validation
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : null
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const name =
    typeof body?.name === 'string' && body.name.trim().length > 0
      ? body.name.trim().slice(0, 100)
      : null

  const traderLevel = isValidTraderLevel(body?.traderLevel) ? body.traderLevel : null
  const sourcePage =
    typeof body?.sourcePage === 'string' ? body.sourcePage.slice(0, 200) : null
  const sourceLocale =
    typeof body?.sourceLocale === 'string' ? body.sourceLocale.slice(0, 10) : null

  // 2. Spam tracking metadata
  const ipHash = hashIp(getClientIp(req))
  const userAgent = (req.headers.get('user-agent') || '').slice(0, 500)

  // 3. Supabase upsert
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  })

  const { data: existing, error: selectErr } = await supabase
    .from('newsletter_subscribers')
    .select('id, status')
    .eq('email', email)
    .maybeSingle()

  if (selectErr) {
    console.error('[newsletter] Supabase select error:', selectErr)
    return NextResponse.json({ ok: false, error: 'database_error' }, { status: 500 })
  }

  let supabaseRowId: string

  if (existing) {
    // If they already confirmed, do nothing extra. If pending or unsubscribed,
    // re-trigger the Mailchimp opt-in so they get a fresh confirmation email.
    supabaseRowId = existing.id
    if (existing.status === 'confirmed') {
      // Privacy: don't tell them they're already subscribed.
      return NextResponse.json({ ok: true })
    }
    // Refresh the row's metadata
    await supabase
      .from('newsletter_subscribers')
      .update({
        name,
        trader_level: traderLevel,
        source_page: sourcePage,
        source_locale: sourceLocale,
        ip_hash: ipHash,
        user_agent: userAgent,
        status: 'pending',
      })
      .eq('id', existing.id)
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name,
        trader_level: traderLevel,
        source_page: sourcePage,
        source_locale: sourceLocale,
        ip_hash: ipHash,
        user_agent: userAgent,
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertErr || !inserted) {
      console.error('[newsletter] Supabase insert error:', insertErr)
      return NextResponse.json({ ok: false, error: 'database_error' }, { status: 500 })
    }
    supabaseRowId = inserted.id
  }

  // 4. Mailchimp subscribe (sends double opt-in email automatically)
  const mc = await subscribeToMailchimp({
    email,
    name: name || undefined,
    traderLevel: traderLevel || undefined,
    sourcePage: sourcePage || undefined,
    sourceLocale: sourceLocale || undefined,
  })

  if (!mc.ok) {
    // Log but don't fail — the subscriber is in Supabase, we can sync to MC later.
    // For now we still return ok:true to the user (they don't care about our infra).
    console.error('[newsletter] Mailchimp error:', mc.errorCode, mc.errorMessage)
  } else if (mc.contactId) {
    // 5. Save the Mailchimp ID for cross-reference
    await supabase
      .from('newsletter_subscribers')
      .update({
        mailchimp_id: mc.contactId,
        mailchimp_synced_at: new Date().toISOString(),
      })
      .eq('id', supabaseRowId)
  }

  return NextResponse.json({ ok: true })
}
