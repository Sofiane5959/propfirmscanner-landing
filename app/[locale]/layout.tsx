// =============================================================================
// LOCALE LAYOUT - app/[locale]/layout.tsx
// Handles metadata and SEO for all localized pages
// =============================================================================

import type { Metadata } from 'next'
import { generateAlternates } from '@/lib/seo'

// =============================================================================
// METADATA CONFIGURATION
// =============================================================================

const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ar: 'العربية',
  hi: 'हिन्दी',
}

const localeDescriptions: Record<string, string> = {
  en: 'Compare prop trading firms, find the best deals, and use free trading tools. Your complete guide to proprietary trading.',
  fr: 'Comparez les prop trading firms, trouvez les meilleures offres et utilisez des outils de trading gratuits. Votre guide complet du trading propriétaire.',
  de: 'Vergleichen Sie Prop-Trading-Firmen, finden Sie die besten Angebote und nutzen Sie kostenlose Trading-Tools. Ihr kompletter Leitfaden für Eigenhandel.',
  es: 'Compare empresas de prop trading, encuentre las mejores ofertas y use herramientas de trading gratuitas. Su guía completa de trading propietario.',
  pt: 'Compare empresas de prop trading, encontre as melhores ofertas e use ferramentas de trading gratuitas. Seu guia completo de trading proprietário.',
  ar: 'قارن شركات التداول الممول، اعثر على أفضل العروض، واستخدم أدوات التداول المجانية. دليلك الكامل للتداول الممول.',
  hi: 'प्रॉप ट्रेडिंग फर्मों की तुलना करें, सर्वोत्तम सौदे खोजें, और मुफ्त ट्रेडिंग टूल्स का उपयोग करें। प्रोप्राइटरी ट्रेडिंग के लिए आपकी पूरी गाइड।',
}

// =============================================================================
// GENERATE METADATA
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale || 'en'
  const siteName = 'PropFirm Scanner'
  
  return {
    title: {
      default: `${siteName} | ${localeNames[locale] || 'English'}`,
      template: `%s | ${siteName}`,
    },
    description: localeDescriptions[locale] || localeDescriptions.en,
    keywords: [
      'prop trading',
      'prop firms',
      'funded trading',
      'FTMO',
      'prop firm comparison',
      'trading challenge',
    ],
    authors: [{ name: 'PropFirm Scanner' }],
    creator: 'PropFirm Scanner',
    publisher: 'PropFirm Scanner',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `https://www.propfirmscanner.org/${locale}`,
      siteName: siteName,
      title: `${siteName} - Compare Prop Trading Firms`,
      description: localeDescriptions[locale] || localeDescriptions.en,
      images: [
        {
          url: 'https://www.propfirmscanner.org/og-image.png',
          width: 1200,
          height: 630,
          alt: 'PropFirm Scanner',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} - Compare Prop Trading Firms`,
      description: localeDescriptions[locale] || localeDescriptions.en,
      images: ['https://www.propfirmscanner.org/og-image.png'],
    },
    ...generateAlternates('/'),
  }
}

// =============================================================================
// STATIC PARAMS - Generate all locale routes at build time
// =============================================================================

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'ar' },
    { locale: 'hi' },
  ]
}

// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params.locale || 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <div lang={locale} dir={dir}>
      {children}
    </div>
  )
}
