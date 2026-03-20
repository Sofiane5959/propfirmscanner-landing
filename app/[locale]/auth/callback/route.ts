import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') || '/education/fundamentals'

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // ── Magic link flow (token_hash) ──────────────────────────────────────────
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'magiclink' | 'email',
    })

    if (!error) {
      // Connecté via magic link → redirect vers le cours
      return NextResponse.redirect(
        new URL('/education/fundamentals?welcome=true', requestUrl.origin)
      )
    }

    console.error('Magic link verification error:', error)
    return NextResponse.redirect(
      new URL('/auth/login?error=invalid_link', requestUrl.origin)
    )
  }

  // ── OAuth flow (Google) ───────────────────────────────────────────────────
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('OAuth error:', error)
    }

    // Redirect vers le dashboard ou la page demandée
    const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  }

  // Fallback
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
