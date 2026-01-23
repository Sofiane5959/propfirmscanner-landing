'use client';

import { usePathname } from 'next/navigation';
import { DealsGrid, PromoCodesBanner } from '@/components/DealsGrid';
import { Tag, Percent, Shield } from 'lucide-react';

// =============================================================================
// LOCALE DETECTION
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

// =============================================================================
// TRANSLATIONS
// =============================================================================

const translations: Record<Locale, Record<string, string>> = {
  en: {
    badge: 'Verified & Trusted',
    title: 'Deals &',
    titleHighlight: 'Discounts',
    description: 'Save money on your next prop firm challenge with our exclusive partner deals. All codes are verified and regularly updated.',
    activeCodes: 'Active Codes',
    maxDiscount: 'Max Discount',
    partners: 'Partners',
  },
  fr: {
    badge: 'Verifie & Fiable',
    title: 'Offres &',
    titleHighlight: 'Reductions',
    description: 'Economisez sur votre prochain challenge avec nos offres partenaires exclusives. Tous les codes sont verifies et mis a jour regulierement.',
    activeCodes: 'Codes Actifs',
    maxDiscount: 'Reduction Max',
    partners: 'Partenaires',
  },
  de: {
    badge: 'Verifiziert & Vertrauenswurdig',
    title: 'Angebote &',
    titleHighlight: 'Rabatte',
    description: 'Sparen Sie bei Ihrer nachsten Challenge mit unseren exklusiven Partner-Angeboten. Alle Codes sind verifiziert und regelmassig aktualisiert.',
    activeCodes: 'Aktive Codes',
    maxDiscount: 'Max Rabatt',
    partners: 'Partner',
  },
  es: {
    badge: 'Verificado y Confiable',
    title: 'Ofertas y',
    titleHighlight: 'Descuentos',
    description: 'Ahorra en tu proximo challenge con nuestras ofertas exclusivas de socios. Todos los codigos estan verificados y actualizados regularmente.',
    activeCodes: 'Codigos Activos',
    maxDiscount: 'Descuento Max',
    partners: 'Socios',
  },
  pt: {
    badge: 'Verificado e Confiavel',
    title: 'Ofertas e',
    titleHighlight: 'Descontos',
    description: 'Economize no seu proximo challenge com nossas ofertas exclusivas de parceiros. Todos os codigos sao verificados e atualizados regularmente.',
    activeCodes: 'Codigos Ativos',
    maxDiscount: 'Desconto Max',
    partners: 'Parceiros',
  },
  ar: {
    badge: 'موثق وموثوق',
    title: 'عروض و',
    titleHighlight: 'خصومات',
    description: 'وفر المال على تحديك القادم مع عروض شركائنا الحصرية. جميع الاكواد موثقة ومحدثة بانتظام.',
    activeCodes: 'اكواد نشطة',
    maxDiscount: 'اقصى خصم',
    partners: 'شركاء',
  },
  hi: {
    badge: 'सत्यापित और विश्वसनीय',
    title: 'डील्स और',
    titleHighlight: 'छूट',
    description: 'हमारे विशेष पार्टनर ऑफ़र के साथ अपने अगले challenge पर पैसे बचाएं। सभी कोड सत्यापित और नियमित रूप से अपडेट किए जाते हैं।',
    activeCodes: 'सक्रिय कोड',
    maxDiscount: 'अधिकतम छूट',
    partners: 'पार्टनर',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function DealsPageContent() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">{t.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">{t.titleHighlight}</span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg max-w-2xl mb-8">
              {t.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">4</span>
                <span className="text-gray-500 text-sm">{t.activeCodes}</span>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-emerald-400">50%</span>
                <span className="text-gray-500 text-sm">{t.maxDiscount}</span>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">15+</span>
                <span className="text-gray-500 text-sm">{t.partners}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Promo Codes Banner */}
        <PromoCodesBanner />

        {/* Deals Grid */}
        <DealsGrid />
      </main>
    </div>
  );
}
