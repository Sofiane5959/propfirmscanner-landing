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
}

module.exports = withNextIntl(nextConfig);
