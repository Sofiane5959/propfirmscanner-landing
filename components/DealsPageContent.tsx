'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DealsGrid } from '@/components/DealsGrid';
import { appliquerOffresDesFiches } from '@/lib/offres-fiches';

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
    title: 'Prop firm promo codes',
    subtitle: 'Every code is tested on the firm’s checkout page before we publish it.',
    verified: 'Verified',
    activeCodes: 'active codes',
    upTo: 'up to',
    howWeEarn: 'How we make money →',
  },
  fr: {
    title: 'Codes promo prop firms',
    subtitle: 'Chaque code est testé sur la page de paiement de la firme avant d’être publié.',
    verified: 'Vérifiés',
    activeCodes: 'codes actifs',
    upTo: 'jusqu’à',
    howWeEarn: 'Comment on gagne de l’argent →',
  },
  de: {
    title: 'Prop-Firm-Rabattcodes',
    verified: 'Geprüft',
    activeCodes: 'aktive Codes',
    upTo: 'bis zu',
  },
  es: {
    title: 'Códigos promocionales de prop firms',
    verified: 'Verificados',
    activeCodes: 'códigos activos',
    upTo: 'hasta',
  },
  pt: {
    title: 'Códigos promocionais de prop firms',
    verified: 'Verificados',
    activeCodes: 'códigos ativos',
    upTo: 'até',
  },
  ar: {
    activeCodes: 'أكواد نشطة',
  },
  hi: {
    activeCodes: 'सक्रिय कोड',
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
        .select('slug, discount_code, discount_percent, affiliate_url')
        .eq('listing_status', 'listed');

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Meme offre que les cartes et que les fiches : sinon « Max Discount »
      // annonce 50 % pendant qu'une campagne a 60 % tourne.
      const rows = appliquerOffresDesFiches(data);

      // "Active codes" = listed firms with a non-empty discount code.
      // We deliberately don't count "via link" deals here because the
      // header label says "Active Codes" — those firms have no code.
      const activeCodes = rows.filter(
        f => f.discount_code && f.discount_code.trim().length > 0
      ).length;

      // "Max discount" = highest discount % among any listed firm with a deal.
      const maxDiscount = rows.reduce((max: number, f) => {
        const d = f.discount_percent ?? 0;
        return d > max ? d : max;
      }, 0);

      // "Partners" = listed firms with an affiliate URL set.
      const partnersCount = rows.filter(
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
  const locale = getLocaleFromPath(pathname);
  const t = { ...translations.en, ...translations[locale] };
  const href = (p: string) => (locale === 'en' ? p : `/${locale}${p}`);
  const { stats, loading } = useDealsStats();
  // Le mois de verification, dans la langue de la page.
  const mois = new Date().toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const remiseMax = stats?.maxDiscount ?? 0;

  return (
    <div className="min-h-screen bg-bg-base">
      <section className="px-4 pt-5 pb-3">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-[28px] font-extrabold leading-9 tracking-tight text-text-primary sm:text-h2">
            {t.title}
          </h1>
          <p className="mt-1 text-small text-text-secondary">{t.subtitle}</p>
          {/* Ligne de confiance — chiffres calcules en direct, jamais inventes. */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span suppressHydrationWarning>{t.verified} · {mois}</span>
            </span>
            <span>
              <b className="font-mono font-semibold tabular-nums text-text-primary">
                {loading ? '—' : stats?.activeCodes ?? 0}
              </b>{' '}
              {t.activeCodes}
            </span>
            {!loading && remiseMax > 0 && (
              <span>
                {t.upTo}{' '}
                <b className="font-mono font-semibold tabular-nums text-text-primary">
                  {locale === 'fr' ? `−${remiseMax}\u202F%` : `−${remiseMax}%`}
                </b>
              </span>
            )}
            <Link href={href('/how-we-make-money')} className="underline-offset-2 hover:text-text-primary hover:underline">
              {t.howWeEarn}
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 pt-3 pb-12">
        <DealsGrid />
      </main>
    </div>
  );
}
