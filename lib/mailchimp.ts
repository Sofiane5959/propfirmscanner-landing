/**
 * Mailchimp client helper.
 *
 * Mailchimp gère le double opt-in à notre place : si on POST un contact avec
 * status='pending', Mailchimp envoie automatiquement l'email de confirmation.
 * Une fois confirmé, le status passe à 'subscribed' chez eux. On peut écouter
 * ça via webhook ou simplement faire confiance (most flows don't need it).
 *
 * Required env vars:
 *   MAILCHIMP_API_KEY     — looks like "abc123def456-us21" (last segment = server prefix)
 *   MAILCHIMP_SERVER      — e.g. "us21" (extracted from API key suffix)
 *   MAILCHIMP_AUDIENCE_ID — found in Audience settings → "Audience name and defaults"
 *
 * Where to get them:
 *   1. Log into Mailchimp
 *   2. Avatar (top right) → Profile → Extras → API keys → Create A Key
 *   3. The "us21" suffix in the key = your server prefix
 *   4. Audience → Settings → "Audience name and defaults" → Audience ID (looks like "abc12def34")
 */

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

export interface MailchimpSubscribeInput {
  email: string
  name?: string
  traderLevel?: 'beginner' | 'intermediate' | 'expert'
  sourcePage?: string
  sourceLocale?: string
}

export interface MailchimpResult {
  ok: boolean
  contactId?: string
  errorCode?: 'missing_credentials' | 'already_subscribed' | 'invalid_email' | 'unknown'
  errorMessage?: string
}

/**
 * Add a contact to Mailchimp with status='pending' so Mailchimp will send
 * the confirmation email itself (double opt-in).
 *
 * Returns ok:true even if already subscribed — we don't want to leak that
 * information to the user (privacy + UX).
 */
export async function subscribeToMailchimp(
  input: MailchimpSubscribeInput
): Promise<MailchimpResult> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER || !MAILCHIMP_AUDIENCE_ID) {
    return {
      ok: false,
      errorCode: 'missing_credentials',
      errorMessage: 'Mailchimp env vars are not set',
    }
  }

  const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`

  // Mailchimp merge fields. FNAME is the first name; we use it to store the
  // full name the user entered. TRADERLVL is a custom merge field — you
  // need to create it in Mailchimp first:
  //   Audience → Settings → Audience fields and *|MERGE|* tags
  //   Add field: name="Trader level", tag="TRADERLVL", type=text
  // If you skip this, the merge field is just ignored (no error).
  const mergeFields: Record<string, string> = {}
  if (input.name) mergeFields.FNAME = input.name
  if (input.traderLevel) mergeFields.TRADERLVL = input.traderLevel

  const body = {
    email_address: input.email,
    status: 'pending',                 // triggers Mailchimp's double opt-in email
    merge_fields: mergeFields,
    tags: [
      'newsletter-popup',
      input.sourceLocale ? `locale:${input.sourceLocale}` : '',
      input.traderLevel ? `level:${input.traderLevel}` : '',
    ].filter(Boolean),
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (response.ok) {
      return { ok: true, contactId: data.id }
    }

    // Mailchimp error — treat "already a list member" as success for privacy
    if (data.title === 'Member Exists' || data.detail?.includes('already a list member')) {
      return { ok: true, contactId: undefined }
    }

    if (data.detail?.includes('looks fake or invalid')) {
      return {
        ok: false,
        errorCode: 'invalid_email',
        errorMessage: 'Email looks invalid',
      }
    }

    return {
      ok: false,
      errorCode: 'unknown',
      errorMessage: data.detail || data.title || 'Mailchimp error',
    }
  } catch (err) {
    return {
      ok: false,
      errorCode: 'unknown',
      errorMessage: err instanceof Error ? err.message : 'Network error',
    }
  }
}
