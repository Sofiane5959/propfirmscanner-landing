// middleware.ts (project root, next to package.json)
//
// Combines two responsibilities in a deliberate order:
//
//   1. next-intl middleware — handles all locale routing.
//      This is the official solution that ships with the next-intl plugin
//      configured in next.config.js. It redirects "/" to "/en", picks up
//      the user's preferred language from the Accept-Language header,
//      and prefixes/strips locale segments as needed.
//
//   2. Admin guard — once next-intl has rewritten/redirected to a
//      locale-prefixed path, we check if it's an /admin/* path and
//      enforce the admin user ID before letting the page render.
//
// Why this matters: prior to this file, the site had no middleware,
// so paths like "/" and "/compare" relied on Next.js falling back to
// /[locale] — which 404'd because there's no /app/page.tsx, only
// /app/[locale]/page.tsx. next-intl's middleware fixes that for us.

import createIntlMiddleware from 'next-intl/middleware'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'

const ADMIN_USER_ID = '6d573ff4-b6ac-481e-b024-d54e7977f96f'

// Build the next-intl middleware once. This is the official locale router.
const intlMiddleware = createIntlMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: 'as-needed', // "/en" is implicit, "/fr" is explicit — common pattern
})

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip API routes — they're handled by their own route handlers.
  // (Matcher already excludes /api, but defensive belt-and-suspenders.)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // -----------------------------------------------------------------
  // 1. Run next-intl first — handles redirects + locale rewrites
  // -----------------------------------------------------------------
  const intlResponse = intlMiddleware(req)

  // If next-intl returned a redirect (e.g. "/" -> "/en", or wrong locale),
  // honor it immediately. Don't try to do admin checks against a path
  // that's about to change.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse
  }

  // -----------------------------------------------------------------
  // 2. Admin guard — only on /[locale]/admin/*
  // -----------------------------------------------------------------
  // After next-intl, the pathname is locale-prefixed.
  // Examples: /en/admin/firms, /fr/admin/analytics
  const segments = pathname.split('/').filter(Boolean) // ['en', 'admin', ...]
  const isAdminPath = segments.length >= 2 && segments[1] === 'admin'

  if (!isAdminPath) {
    return intlResponse
  }

  // Wrap the auth check in try/catch so that even if Supabase throws
  // (cold start, network blip, expired session refresh) the site itself
  // doesn't 500. Worst case, the user is redirected away from /admin.
  try {
    const supabase = createMiddlewareClient({ req, res: intlResponse })
    const { data: { session } } = await supabase.auth.getSession()
    const locale = segments[0] || defaultLocale

    if (!session) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = `/${locale}`
      loginUrl.searchParams.set('error', 'admin_login_required')
      return NextResponse.redirect(loginUrl)
    }

    if (session.user.id !== ADMIN_USER_ID) {
      const homeUrl = req.nextUrl.clone()
      homeUrl.pathname = `/${locale}`
      homeUrl.searchParams.set('error', 'admin_only')
      return NextResponse.redirect(homeUrl)
    }

    return intlResponse
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[middleware] admin guard error', err)
    const fallback = req.nextUrl.clone()
    fallback.pathname = `/${segments[0] || defaultLocale}`
    fallback.searchParams.set('error', 'admin_check_failed')
    return NextResponse.redirect(fallback)
  }
}

// Match every path EXCEPT:
//   - /api/*       (route handlers)
//   - /_next/*     (Next.js internals)
//   - /_vercel/*   (Vercel system)
//   - any path with a "." in it (static files: favicon, images, etc.)
//
// This is the matcher recommended by next-intl docs and is broad enough
// to catch root paths like "/" so the locale redirect can fire.
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
