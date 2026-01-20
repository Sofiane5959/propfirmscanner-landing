import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't redirect to default locale
  localePrefix: 'as-needed',
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Internal Next.js paths
  matcher: [
    // Match all pathnames except for
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
