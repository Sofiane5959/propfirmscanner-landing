// middleware.ts (project root, next to package.json)
//
// Server-side protection for /admin/* routes.
//
// This runs BEFORE the page renders, so non-admin users never see the page
// markup at all — they're redirected (or blocked) at the edge.
// The previous client-side useEffect check rendered the page for ~1-2s
// before the redirect kicked in, leaking the layout.
//
// IMPORTANT: this checks the Supabase auth cookie that's set by
// @supabase/auth-helpers-nextjs when the user signs in.

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_USER_ID = '6d573ff4-b6ac-481e-b024-d54e7977f96f'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // The matcher below already restricts to /admin/* paths, but we double-check
  // here in case the matcher is loosened later.
  // /[locale]/admin/* — accept any locale
  const isAdminPath = /^\/[a-z]{2}\/admin(\/|$)/.test(pathname)
  if (!isAdminPath) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Not logged in → redirect to home (or login page if you have one)
  if (!session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/'
    loginUrl.searchParams.set('error', 'admin_login_required')
    return NextResponse.redirect(loginUrl)
  }

  // Logged in but not the admin → forbid
  if (session.user.id !== ADMIN_USER_ID) {
    const homeUrl = req.nextUrl.clone()
    homeUrl.pathname = '/'
    homeUrl.searchParams.set('error', 'admin_only')
    return NextResponse.redirect(homeUrl)
  }

  return res
}

// Only run middleware on admin paths — keeps it fast for everything else
export const config = {
  matcher: ['/:locale/admin/:path*'],
}
