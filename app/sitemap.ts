// =============================================================================
// SITEMAP GENERATOR - app/sitemap.ts
// Generates multilingual sitemap for Google Search Console
// =============================================================================

import { generateAllUrls } from '@/lib/seo';

export default function sitemap() {
  return generateAllUrls();
}
