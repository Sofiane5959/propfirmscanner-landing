const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.logo.dev',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'myncehmdjcvsltlqezid.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      // Fallback avatar service used when a firm has no logo_url.
      // Missing from remotePatterns, next/image threw at render time —
      // which passes the build and only fails in the browser.
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
    ],
  },
  // Optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Anciennes adresses d'articles affichees par la liste du blog sans article
  // derriere (404). Redirigees en 308 vers l'article le plus proche, ou vers
  // le blog (7/10/2026).
  async redirects() {
    const anciens = {
      'revenge-trading': 'revenge-trading-how-to-stop',
      'ea-bot-trading-rules': 'ea-trading-prop-firms',
      'best-prop-firms-for-beginners': 'first-prop-firm-guide',
      'overtrading-psychology': 'trading-psychology-tips',
      'funded-next-review': null,
      'instant-funding-vs-challenge': null,
    }
    const locales = 'fr|de|es|pt|ar|hi'
    return Object.entries(anciens).flatMap(([ancien, cible]) => [
      { source: `/blog/${ancien}`, destination: cible ? `/blog/${cible}` : '/blog', permanent: true },
      { source: `/:locale(${locales})/blog/${ancien}`, destination: cible ? `/:locale/blog/${cible}` : '/:locale/blog', permanent: true },
    ])
  },
}

module.exports = withNextIntl(nextConfig);
