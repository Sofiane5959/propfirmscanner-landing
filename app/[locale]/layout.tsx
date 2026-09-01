// =============================================================================
// LOCALE LAYOUT - app/[locale]/layout.tsx
// Handles metadata and SEO for all localized pages
// =============================================================================

import type { Metadata } from 'next'
import { fontSans, fontDisplay, fontMono } from '@/lib/fonts'
import { AuthProvider } from '@/providers/AuthProvider'
import { Navbar } from '@/components/Navbar'
import PromoTicker from '@/components/PromoTicker'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { NewsletterPopup } from '@/components/NewsletterPopup'
import '../globals.css'
import { generateAlternates, localeHref } from '@/lib/seo'

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
      url: localeHref(locale, '/'),
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
    // Locale-aware: this used to hand every locale the same English canonical,
    // which told search engines the six localised homepages were duplicates of
    // the English one.
    ...generateAlternates('/', locale),
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
    // lang and dir are set here, on the document itself, from the route
    // parameter. They used to sit on an inner <div> while <html> was hard-coded
    // to lang="en", so every Arabic page was served as English with no RTL.
    <html
      lang={locale}
      dir={dir}
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} dark`}
    >
      <head>
        <GoogleAnalytics />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans bg-bg-base text-text-primary antialiased">
        <AuthProvider>
          <Navbar />
          <PromoTicker deals={[]} />
          <main className="pt-16">{children}</main>
          <Footer />
          <NewsletterPopup />
        </AuthProvider>
      </body>
    </html>
  )
}
