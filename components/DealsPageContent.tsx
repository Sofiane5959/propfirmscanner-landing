'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DealsGrid, PromoCodesBanner } from '@/components/DealsGrid';

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
    description:
      'Save money on your next prop firm challenge with our exclusive partner deals. Every code is verified and updated in real time.',
    activeCodes: 'Active Codes',
    maxDiscount: 'Max Discount',
    partners: 'Partners',
  },
  fr: {
    badge: 'Vérifié & Fiable',
    title: 'Offres &',
    titleHighlight: 'Réductions',
    description:
      'Économisez sur votre prochain challenge avec nos offres partenaires exclusives. Chaque code est vérifié et mis à jour en temps réel.',
    activeCodes: 'Codes Actifs',
    maxDiscount: 'Réduction Max',
    partners: 'Partenaires',
  },
  de: {
    badge: 'Verifiziert & Vertrauenswürdig',
    title: 'Angebote &',
    titleHighlight: 'Rabatte',
    description:
      'Sparen Sie bei Ihrer nächsten Challenge mit unseren exklusiven Partner-Angeboten. Jeder Code ist verifiziert und in Echtzeit aktualisiert.',
    activeCodes: 'Aktive Codes',
    maxDiscount: 'Max Rabatt',
    partners: 'Partner',
  },
  es: {
    badge: 'Verificado y Confiable',
    title: 'Ofertas y',
    titleHighlight: 'Descuentos',
    description:
      'Ahorra en tu próximo challenge con nuestras ofertas exclusivas. Cada código está verificado y actualizado en tiempo real.',
    activeCodes: 'Códigos Activos',
    maxDiscount: 'Descuento Máx',
    partners: 'Socios',
  },
  pt: {
    badge: 'Verificado e Confiável',
    title: 'Ofertas e',
    titleHighlight: 'Descontos',
    description:
      'Economize no seu próximo challenge com nossas ofertas exclusivas. Cada código é verificado e atualizado em tempo real.',
    activeCodes: 'Códigos Ativos',
    maxDiscount: 'Desconto Máx',
    partners: 'Parceiros',
  },
  ar: {
    badge: 'موثق وموثوق',
    title: 'عروض و',
    titleHighlight: 'خصومات',
    description:
      'وفر المال على تحديك القادم مع عروض شركائنا الحصرية. كل رمز موثق ومحدث في الوقت الفعلي.',
    activeCodes: 'أكواد نشطة',
    maxDiscount: 'أقصى خصم',
    partners: 'شركاء',
  },
  hi: {
    badge: 'सत्यापित और विश्वसनीय',
    title: 'डील्स और',
    titleHighlight: 'छूट',
    description:
      'हमारे विशेष पार्टनर ऑफ़र के साथ अपने अगले challenge पर पैसे बचाएं। हर कोड सत्यापित है।',
    activeCodes: 'सक्रिय कोड',
    maxDiscount: 'अधिकतम छूट',
    partners: 'पार्टनर',
  },
};

// =============================================================================
// STATS — computed live from Supabase, not hardcoded
// =============================================================================

interface DealsStats {
  activeCodes: number;
  maxDiscount: number;
  partnersCount: number;
}

function useDealsStats(): { stats: DealsStats | null; loading: boolean } {
  const [stats, setStats] = useState<DealsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compute = async () => {
      const supabase = createClientComponentClient();

      // Pull only the columns we need to compute the three numbers shown in
      // the hero. Filter to listed firms only — unlisted firms shouldn't
      // count as active codes or partners.
      const { data, error } = await supabase
        .from('prop_firms')
        .select('discount_code, discount_percent, affiliate_url')
        .eq('listing_status', 'listed');

      if (error || !data) {
        setLoading(false);
        return;
      }

      // "Active codes" = listed firms with a non-empty discount code.
      // We deliberately don't count "via link" deals here because the
      // header label says "Active Codes" — those firms have no code.
      const activeCodes = data.filter(
        f => f.discount_code && f.discount_code.trim().length > 0
      ).length;

      // "Max discount" = highest discount % among any listed firm with a deal.
      const maxDiscount = data.reduce((max, f) => {
        const d = f.discount_percent ?? 0;
        return d > max ? d : max;
      }, 0);

      // "Partners" = listed firms with an affiliate URL set.
      const partnersCount = data.filter(
        f => f.affiliate_url && f.affiliate_url !== '#'
      ).length;

      setStats({ activeCodes, maxDiscount, partnersCount });
      setLoading(false);
    };

    compute();
  }, []);

  return { stats, loading };
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function DealsPageContent() {
  const pathname = usePathname();
  const t = translations[getLocaleFromPath(pathname)];
  const { stats, loading } = useDealsStats();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-14">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">{t.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
                {t.titleHighlight}
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mb-8">{t.description}</p>

            {/* Stats — computed live from the DB. We render stable placeholders
                while loading so layout doesn't jump, but never invent numbers. */}
            <div className="flex items-center gap-8">
              <Stat value={loading ? '—' : String(stats?.activeCodes ?? 0)} label={t.activeCodes} />
              <Divider />
              <Stat
                value={loading ? '—' : `${stats?.maxDiscount ?? 0}%`}
                label={t.maxDiscount}
                highlight
              />
              <Divider />
              <Stat value={loading ? '—' : String(stats?.partnersCount ?? 0)} label={t.partners} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <PromoCodesBanner />
        <DealsGrid />
      </main>
    </div>
  );
}

// =============================================================================
// SMALL UI HELPERS
// =============================================================================

function Stat({ value, label, highlight = false }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-3xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-12 bg-gray-800" />;
}
