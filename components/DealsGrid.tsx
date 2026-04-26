'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ExternalLink, Tag, Star, Copy, Check,
  Sparkles, Gift, ShieldCheck,
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
// TRANSLATIONS (subset — full set kept short for maintainability)
// =============================================================================

const translations: Record<Locale, Record<string, string>> = {
  en: {
    quickCopy: 'Quick Copy Promo Codes',
    clickToCopy: 'Click any code to copy instantly',
    activeDeals: 'Active Deals',
    verifiedDiscounts: 'Verified discounts you can use right now',
    allFirms: 'All Prop Firms',
    allFirmsSubtitle: 'Every firm we track. Best deals first, then the rest.',
    visit: 'Visit',
    details: 'Details',
    viaLink: 'via link',
    noCode: 'No code needed — discount applied via our link',
    copied: 'Copied!',
    copy: 'Copy code',
    off: 'OFF',
    noDealsYet: 'New deals coming soon',
    noDealsBody: 'No active codes right now. Browse all firms below.',
    loading: 'Loading deals…',
    affiliateNotice:
      'We may earn a commission when you use our links — at no extra cost to you. This is what keeps the comparison free.',
    readMore: 'Read more',
  },
  fr: {
    quickCopy: 'Copie rapide des codes promo',
    clickToCopy: 'Cliquez sur un code pour le copier',
    activeDeals: 'Offres actives',
    verifiedDiscounts: 'Réductions vérifiées utilisables tout de suite',
    allFirms: 'Toutes les Prop Firms',
    allFirmsSubtitle: 'Toutes les firms que nous suivons. Les meilleures offres en haut.',
    visit: 'Visiter',
    details: 'Détails',
    viaLink: 'via lien',
    noCode: 'Pas de code — la réduction est appliquée via notre lien',
    copied: 'Copié !',
    copy: 'Copier',
    off: 'DE RÉDUC.',
    noDealsYet: 'Nouvelles offres bientôt',
    noDealsBody: 'Aucun code actif pour l’instant. Parcourez les firms ci-dessous.',
    loading: 'Chargement des offres…',
    affiliateNotice:
      'Nous pouvons toucher une commission via nos liens — sans coût supplémentaire pour vous.',
    readMore: 'En savoir plus',
  },
  de: {
    quickCopy: 'Promo-Codes schnell kopieren',
    clickToCopy: 'Klicke einen Code, um ihn zu kopieren',
    activeDeals: 'Aktive Angebote',
    verifiedDiscounts: 'Geprüfte Rabatte, sofort nutzbar',
    allFirms: 'Alle Prop Firms',
    allFirmsSubtitle: 'Alle Firmen. Beste Angebote zuerst.',
    visit: 'Besuchen',
    details: 'Details',
    viaLink: 'via Link',
    noCode: 'Kein Code nötig — Rabatt wird über unseren Link angewendet',
    copied: 'Kopiert!',
    copy: 'Kopieren',
    off: 'RABATT',
    noDealsYet: 'Bald neue Angebote',
    noDealsBody: 'Aktuell keine aktiven Codes. Durchsuche alle Firmen unten.',
    loading: 'Angebote werden geladen…',
    affiliateNotice:
      'Über unsere Links erhalten wir ggf. eine Provision — ohne Mehrkosten für dich.',
    readMore: 'Mehr lesen',
  },
  es: {
    quickCopy: 'Copia rápida de códigos',
    clickToCopy: 'Haz clic en un código para copiarlo',
    activeDeals: 'Ofertas activas',
    verifiedDiscounts: 'Descuentos verificados disponibles ahora',
    allFirms: 'Todas las Prop Firms',
    allFirmsSubtitle: 'Todas las firmas. Mejores ofertas primero.',
    visit: 'Visitar',
    details: 'Detalles',
    viaLink: 'vía enlace',
    noCode: 'Sin código — el descuento se aplica vía nuestro enlace',
    copied: '¡Copiado!',
    copy: 'Copiar',
    off: 'DESCUENTO',
    noDealsYet: 'Nuevas ofertas próximamente',
    noDealsBody: 'Sin códigos activos. Navega por todas las firmas abajo.',
    loading: 'Cargando ofertas…',
    affiliateNotice:
      'Podemos recibir una comisión por nuestros enlaces — sin coste adicional para ti.',
    readMore: 'Saber más',
  },
  pt: {
    quickCopy: 'Cópia rápida de códigos',
    clickToCopy: 'Clique em qualquer código para copiar',
    activeDeals: 'Ofertas ativas',
    verifiedDiscounts: 'Descontos verificados disponíveis agora',
    allFirms: 'Todas as Prop Firms',
    allFirmsSubtitle: 'Todas as firmas. Melhores ofertas primeiro.',
    visit: 'Visitar',
    details: 'Detalhes',
    viaLink: 'via link',
    noCode: 'Sem código — desconto aplicado via nosso link',
    copied: 'Copiado!',
    copy: 'Copiar',
    off: 'DESCONTO',
    noDealsYet: 'Novas ofertas em breve',
    noDealsBody: 'Sem códigos ativos. Explore todas as firmas abaixo.',
    loading: 'Carregando ofertas…',
    affiliateNotice:
      'Podemos receber uma comissão dos nossos links — sem custo extra para você.',
    readMore: 'Saiba mais',
  },
  ar: {
    quickCopy: 'نسخ سريع لرموز الخصم',
    clickToCopy: 'انقر على أي رمز للنسخ فوراً',
    activeDeals: 'العروض النشطة',
    verifiedDiscounts: 'خصومات موثقة متاحة الآن',
    allFirms: 'جميع شركات التداول',
    allFirmsSubtitle: 'جميع الشركات. أفضل العروض أولاً.',
    visit: 'زيارة',
    details: 'التفاصيل',
    viaLink: 'عبر الرابط',
    noCode: 'لا حاجة لرمز — الخصم يُطبَّق عبر رابطنا',
    copied: 'تم النسخ!',
    copy: 'نسخ',
    off: 'خصم',
    noDealsYet: 'عروض جديدة قريباً',
    noDealsBody: 'لا توجد رموز نشطة. تصفح الشركات أدناه.',
    loading: 'جاري تحميل العروض…',
    affiliateNotice:
      'قد نحصل على عمولة عبر روابطنا — دون تكلفة إضافية عليك.',
    readMore: 'المزيد',
  },
  hi: {
    quickCopy: 'त्वरित कॉपी प्रोमो कोड',
    clickToCopy: 'किसी भी कोड को तुरंत कॉपी करने के लिए क्लिक करें',
    activeDeals: 'सक्रिय डील्स',
    verifiedDiscounts: 'सत्यापित डिस्काउंट जो आप अभी उपयोग कर सकते हैं',
    allFirms: 'सभी प्रॉप फर्म्स',
    allFirmsSubtitle: 'हमारी ट्रैक की गई सभी फर्म्स। सबसे अच्छी डील्स पहले।',
    visit: 'विज़िट',
    details: 'विवरण',
    viaLink: 'लिंक के माध्यम से',
    noCode: 'कोड की आवश्यकता नहीं — डिस्काउंट हमारे लिंक के माध्यम से',
    copied: 'कॉपी हो गया!',
    copy: 'कॉपी',
    off: 'छूट',
    noDealsYet: 'जल्द ही नई डील्स',
    noDealsBody: 'अभी कोई सक्रिय कोड नहीं। नीचे सभी फर्म्स देखें।',
    loading: 'डील्स लोड हो रहे हैं…',
    affiliateNotice:
      'हमारे लिंक के माध्यम से हमें कमीशन मिल सकता है — आपके लिए अतिरिक्त लागत के बिना।',
    readMore: 'और पढ़ें',
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface PropFirm {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  trustpilot_rating: number | null;
  trustpilot_reviews: number | null;
  min_price: number | null;
  max_profit_split: number | null;
  discount_code: string | null;
  discount_percent: number | null;
  affiliate_url: string | null;
  website_url: string | null;
  priority_tier: number | null;
  trust_status: string | null;
  listing_status: string | null;
}

// =============================================================================
// SORT — best deals first, every firm visible
// =============================================================================

/**
 * Sort priority for the deals page:
 *   Tier 1: affiliate URL + discount   (real partners — FTMO, Funding Pips, …)
 *   Tier 2: discount only              (still useful info)
 *   Tier 3: no deal                    (still browseable below)
 *
 * Within each tier we sort by priority_tier (Top 10 first), then discount %,
 * then trustpilot rating. FTMO 19% naturally lands at the very top.
 */
function dealsSort(a: PropFirm, b: PropFirm): number {
  const score = (f: PropFirm) => {
    const hasAff = f.affiliate_url && f.affiliate_url !== '#' ? 1 : 0;
    const hasDiscount = (f.discount_percent ?? 0) > 0 ? 1 : 0;
    if (hasAff && hasDiscount) return 0;
    if (hasDiscount) return 1;
    return 2;
  };

  const sa = score(a);
  const sb = score(b);
  if (sa !== sb) return sa - sb;

  const ta = a.priority_tier ?? 99;
  const tb = b.priority_tier ?? 99;
  if (ta !== tb) return ta - tb;

  const da = a.discount_percent ?? 0;
  const db = b.discount_percent ?? 0;
  if (da !== db) return db - da;

  const ra = a.trustpilot_rating ?? 0;
  const rb = b.trustpilot_rating ?? 0;
  return rb - ra;
}

// =============================================================================
// COPY BUTTON
// =============================================================================

function CopyCodeButton({ code, label }: { code: string; label: { copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false);
  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — silent fail */
    }
  };
  return (
    <button
      onClick={handle}
      className={`p-2 rounded-lg transition-colors ${
        copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
      title={copied ? label.copied : label.copy}
      aria-label={copied ? label.copied : label.copy}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

// =============================================================================
// PROMO CODES BANNER — quick-copy strip (only firms with codes)
// =============================================================================

export function PromoCodesBanner() {
  const pathname = usePathname();
  const t = translations[getLocaleFromPath(pathname)];
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirms = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase
        .from('prop_firms')
        .select(
          'id, slug, name, logo_url, trustpilot_rating, trustpilot_reviews, min_price, max_profit_split, discount_code, discount_percent, affiliate_url, website_url, priority_tier, trust_status, listing_status'
        )
        .eq('listing_status', 'listed')
        .gt('discount_percent', 0)
        .not('discount_code', 'is', null)
        .order('discount_percent', { ascending: false })
        .limit(8);
      setFirms(data || []);
      setLoading(false);
    };
    fetchFirms();
  }, []);

  if (loading || firms.length === 0) return null;

  return (
    <section className="mb-8 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent border border-yellow-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Gift className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{t.quickCopy}</h2>
          <p className="text-gray-400 text-sm">{t.clickToCopy}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {firms.map(f => (
          <div
            key={f.id}
            className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl"
          >
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{f.name}</p>
              <p className="text-yellow-400 text-xs font-semibold">
                {f.discount_percent}% {t.off}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <code className="px-2 py-1 bg-gray-900 border border-dashed border-gray-600 rounded text-emerald-400 text-xs font-mono">
                {f.discount_code}
              </code>
              <CopyCodeButton code={f.discount_code as string} label={{ copy: t.copy, copied: t.copied }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// DEAL CARD
// =============================================================================

function DealCard({ firm, t }: { firm: PropFirm; t: Record<string, string> }) {
  const hasOutbound = !!(firm.affiliate_url || firm.website_url);
  const visitUrl = hasOutbound ? `/api/go/${firm.slug}?source=deals-grid` : null;
  const internalUrl = `/prop-firm/${firm.slug}`;
  const hasCode = !!(firm.discount_code && firm.discount_code.trim().length > 0);
  const hasDiscount = (firm.discount_percent ?? 0) > 0;
  const hasAff = !!firm.affiliate_url;

  return (
    <div
      className={`bg-gray-800/50 border rounded-2xl overflow-hidden flex flex-col ${
        hasAff && hasDiscount ? 'border-emerald-500/40' : 'border-gray-700/50'
      }`}
    >
      {hasDiscount && (
        <div className="relative">
          <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-md bg-gradient-to-r from-red-500 to-orange-500 text-white text-[11px] font-bold">
            {firm.discount_percent}% {t.off}
          </div>
        </div>
      )}

      <Link href={internalUrl} className="flex items-center gap-3 px-5 pt-5 group/title">
        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
          {firm.logo_url ? (
            <Image src={firm.logo_url} alt={firm.name} width={48} height={48} className="object-contain" />
          ) : (
            <span className="text-lg font-bold text-emerald-600">{firm.name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white text-base group-hover/title:text-emerald-400 transition-colors truncate">
            {firm.name}
          </h3>
          {firm.trustpilot_rating && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{firm.trustpilot_rating.toFixed(1)}</span>
              {firm.trustpilot_reviews != null && (
                <span>
                  (
                  {firm.trustpilot_reviews >= 1000
                    ? `${(firm.trustpilot_reviews / 1000).toFixed(1)}K`
                    : firm.trustpilot_reviews}
                  )
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Price</p>
          <p className="text-white font-bold">{firm.min_price ? `$${firm.min_price}` : '—'}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Split</p>
          <p className="text-emerald-400 font-bold">
            {firm.max_profit_split ? `${firm.max_profit_split}%` : '—'}
          </p>
        </div>
      </div>

      {hasDiscount && (
        <div className="px-5 mt-4">
          {hasCode ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-900 border border-dashed border-gray-600 rounded-lg text-emerald-400 font-mono text-sm text-center truncate">
                {firm.discount_code}
              </code>
              <CopyCodeButton code={firm.discount_code as string} label={{ copy: t.copy, copied: t.copied }} />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-900/60 border border-gray-700 rounded-lg">
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-300 text-xs">{t.noCode}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-5 mt-auto">
        {hasOutbound ? (
          <a
            href={visitUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors ${
              hasAff && hasDiscount
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {t.visit} <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <Link
            href={internalUrl}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            {t.details}
          </Link>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// DEALS GRID — every listed firm, deals first, no firm hidden
// =============================================================================

export function DealsGrid() {
  const pathname = usePathname();
  const t = translations[getLocaleFromPath(pathname)];

  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFirms = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClientComponentClient();
      const { data, error: err } = await supabase
        .from('prop_firms')
        .select(
          'id, slug, name, logo_url, trustpilot_rating, trustpilot_reviews, min_price, max_profit_split, discount_code, discount_percent, affiliate_url, website_url, priority_tier, trust_status, listing_status'
        )
        .eq('listing_status', 'listed');

      if (err) {
        setError(err.message);
        return;
      }
      setFirms((data || []).sort(dealsSort));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms]);

  const dealFirms = firms.filter(f => (f.discount_percent ?? 0) > 0);
  const remainingFirms = firms.filter(f => (f.discount_percent ?? 0) === 0 || f.discount_percent == null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse mr-2" />
        <span className="text-gray-400">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-gray-400">
        Couldn’t load deals right now. Refresh the page or come back in a minute.
      </div>
    );
  }

  return (
    <>
      {dealFirms.length > 0 ? (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.activeDeals}</h2>
              <p className="text-gray-400 text-sm">{t.verifiedDiscounts}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dealFirms.map(f => (
              <DealCard key={f.id} firm={f} t={t} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-12 bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8 text-center">
          <Gift className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">{t.noDealsYet}</h3>
          <p className="text-gray-400 text-sm">{t.noDealsBody}</p>
        </section>
      )}

      {remainingFirms.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-700/50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.allFirms}</h2>
              <p className="text-gray-400 text-sm">{t.allFirmsSubtitle}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {remainingFirms.map(f => (
              <DealCard key={f.id} firm={f} t={t} />
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-gray-500 text-xs max-w-2xl mx-auto mt-12">
        {t.affiliateNotice}{' '}
        <Link href="/how-we-make-money" className="text-emerald-400 hover:underline">
          {t.readMore}
        </Link>
        .
      </p>
    </>
  );
}

// Backwards-compatible export. The old hardcoded sidebar list is gone —
// keeping the symbol prevents broken imports anywhere else in the codebase.
export function FeaturedFirmsSidebar() {
  return null;
}
