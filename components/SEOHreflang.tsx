// =============================================================================
// components/SEOHreflang.tsx
// Ajoute les balises hreflang pour le SEO multilingue
// =============================================================================

import Head from 'next/head'

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
const baseUrl = 'https://www.propfirmscanner.org';

// Mapping des locales vers les codes hreflang
const hreflangMap: Record<string, string> = {
  en: 'en',
  fr: 'fr',
  de: 'de',
  es: 'es',
  pt: 'pt',
  ar: 'ar',
  hi: 'hi',
};

interface SEOHreflangProps {
  currentLocale: string;
  currentPath: string; // Le path sans la locale, ex: "/compare" ou "/dashboard/favorites"
}

export default function SEOHreflang({ currentLocale, currentPath }: SEOHreflangProps) {
  // Nettoyer le path (enlever le slash de début si présent pour éviter les doubles)
  const cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  
  return (
    <Head>
      {/* Balises hreflang pour chaque langue */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={hreflangMap[locale]}
          href={`${baseUrl}/${locale}${cleanPath}`}
        />
      ))}
      
      {/* x-default pour la version par défaut (anglais) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/en${cleanPath}`}
      />
      
      {/* Canonical URL */}
      <link
        rel="canonical"
        href={`${baseUrl}/${currentLocale}${cleanPath}`}
      />
    </Head>
  );
}

// =============================================================================
// ALTERNATIVE: Pour App Router (Next.js 13+), utiliser generateMetadata
// =============================================================================

// Si tu utilises l'App Router, ajoute ceci dans ton layout.tsx ou page.tsx :

export function generateHreflangMetadata(currentLocale: string, currentPath: string) {
  const cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  
  const languages: Record<string, string> = {};
  
  locales.forEach((locale) => {
    languages[hreflangMap[locale]] = `${baseUrl}/${locale}${cleanPath}`;
  });
  
  // Ajouter x-default
  languages['x-default'] = `${baseUrl}/en${cleanPath}`;
  
  return {
    alternates: {
      canonical: `${baseUrl}/${currentLocale}${cleanPath}`,
      languages,
    },
  };
}

// =============================================================================
// USAGE EXAMPLE dans un page.tsx (App Router)
// =============================================================================

/*
// Dans app/[locale]/compare/page.tsx par exemple:

import { generateHreflangMetadata } from '@/components/SEOHreflang';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const hreflang = generateHreflangMetadata(params.locale, '/compare');
  
  return {
    title: 'Compare Prop Firms | PropFirm Scanner',
    description: 'Compare the best prop trading firms...',
    ...hreflang,
  };
}
*/
