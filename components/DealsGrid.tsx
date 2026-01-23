'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ExternalLink, Tag, CheckCircle, Star, Copy, Check,
  Percent, Sparkles, ArrowRight, Zap, Gift
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
// TRANSLATIONS
// =============================================================================

const translations: Record<Locale, Record<string, string>> = {
  en: {
    quickCopy: 'Quick Copy Promo Codes',
    clickToCopy: 'Click any code to copy instantly',
    exclusiveCodes: 'Exclusive Promo Codes',
    verifiedDiscounts: 'verified discounts available',
    verifiedDiscount: 'verified discount available',
    partnerLinks: 'Partner Links',
    trustedFirms: 'Trusted prop firms with exclusive access',
    noPromos: 'No promo codes available at the moment.',
    lookingMore: 'Looking for more prop firms?',
    browseAll: 'Browse All 70+ Prop Firms',
    activeCodes: 'Active Promo Codes',
    visitSite: 'Visit Site',
    copyCode: 'Copy Code',
    copied: 'Copied!',
    off: 'OFF',
    from: 'From',
    split: 'Split',
    reviews: 'reviews',
  },
  fr: {
    quickCopy: 'Codes Promo a Copier',
    clickToCopy: 'Cliquez sur un code pour le copier',
    exclusiveCodes: 'Codes Promo Exclusifs',
    verifiedDiscounts: 'reductions verifiees disponibles',
    verifiedDiscount: 'reduction verifiee disponible',
    partnerLinks: 'Liens Partenaires',
    trustedFirms: 'Prop firms de confiance avec acces exclusif',
    noPromos: 'Aucun code promo disponible pour le moment.',
    lookingMore: 'Vous cherchez plus de prop firms ?',
    browseAll: 'Voir les 70+ Prop Firms',
    activeCodes: 'Codes Promo Actifs',
    visitSite: 'Visiter',
    copyCode: 'Copier',
    copied: 'Copie !',
    off: 'DE REDUC',
    from: 'A partir de',
    split: 'Split',
    reviews: 'avis',
  },
  de: {
    quickCopy: 'Promo-Codes Kopieren',
    clickToCopy: 'Klicken Sie auf einen Code zum Kopieren',
    exclusiveCodes: 'Exklusive Promo-Codes',
    verifiedDiscounts: 'verifizierte Rabatte verfugbar',
    verifiedDiscount: 'verifizierter Rabatt verfugbar',
    partnerLinks: 'Partner-Links',
    trustedFirms: 'Vertrauenswurdige Prop Firms mit exklusivem Zugang',
    noPromos: 'Keine Promo-Codes verfugbar.',
    lookingMore: 'Suchen Sie mehr Prop Firms?',
    browseAll: 'Alle 70+ Prop Firms ansehen',
    activeCodes: 'Aktive Promo-Codes',
    visitSite: 'Besuchen',
    copyCode: 'Kopieren',
    copied: 'Kopiert!',
    off: 'RABATT',
    from: 'Ab',
    split: 'Split',
    reviews: 'Bewertungen',
  },
  es: {
    quickCopy: 'Copiar Codigos Promo',
    clickToCopy: 'Haz clic en cualquier codigo para copiar',
    exclusiveCodes: 'Codigos Promo Exclusivos',
    verifiedDiscounts: 'descuentos verificados disponibles',
    verifiedDiscount: 'descuento verificado disponible',
    partnerLinks: 'Enlaces de Socios',
    trustedFirms: 'Prop firms de confianza con acceso exclusivo',
    noPromos: 'No hay codigos promo disponibles.',
    lookingMore: 'Buscas mas prop firms?',
    browseAll: 'Ver las 70+ Prop Firms',
    activeCodes: 'Codigos Promo Activos',
    visitSite: 'Visitar',
    copyCode: 'Copiar',
    copied: 'Copiado!',
    off: 'DESC.',
    from: 'Desde',
    split: 'Split',
    reviews: 'resenas',
  },
  pt: {
    quickCopy: 'Copiar Codigos Promo',
    clickToCopy: 'Clique em qualquer codigo para copiar',
    exclusiveCodes: 'Codigos Promo Exclusivos',
    verifiedDiscounts: 'descontos verificados disponiveis',
    verifiedDiscount: 'desconto verificado disponivel',
    partnerLinks: 'Links de Parceiros',
    trustedFirms: 'Prop firms confiaveis com acesso exclusivo',
    noPromos: 'Nenhum codigo promo disponivel no momento.',
    lookingMore: 'Procurando mais prop firms?',
    browseAll: 'Ver todas as 70+ Prop Firms',
    activeCodes: 'Codigos Promo Ativos',
    visitSite: 'Visitar',
    copyCode: 'Copiar',
    copied: 'Copiado!',
    off: 'DESC.',
    from: 'A partir de',
    split: 'Split',
    reviews: 'avaliacoes',
  },
  ar: {
    quickCopy: 'نسخ اكواد الخصم',
    clickToCopy: 'انقر على اي كود للنسخ',
    exclusiveCodes: 'اكواد خصم حصرية',
    verifiedDiscounts: 'خصومات موثقة متاحة',
    verifiedDiscount: 'خصم موثق متاح',
    partnerLinks: 'روابط الشركاء',
    trustedFirms: 'شركات prop موثوقة مع وصول حصري',
    noPromos: 'لا توجد اكواد خصم متاحة حاليا.',
    lookingMore: 'تبحث عن المزيد من شركات prop؟',
    browseAll: 'تصفح جميع الشركات 70+',
    activeCodes: 'اكواد الخصم النشطة',
    visitSite: 'زيارة',
    copyCode: 'نسخ',
    copied: 'تم النسخ!',
    off: 'خصم',
    from: 'من',
    split: 'تقسيم',
    reviews: 'تقييمات',
  },
  hi: {
    quickCopy: 'प्रोमो कोड कॉपी करें',
    clickToCopy: 'कॉपी करने के लिए किसी भी कोड पर क्लिक करें',
    exclusiveCodes: 'विशेष प्रोमो कोड',
    verifiedDiscounts: 'सत्यापित छूट उपलब्ध',
    verifiedDiscount: 'सत्यापित छूट उपलब्ध',
    partnerLinks: 'पार्टनर लिंक',
    trustedFirms: 'विशेष पहुंच के साथ विश्वसनीय prop firms',
    noPromos: 'अभी कोई प्रोमो कोड उपलब्ध नहीं है।',
    lookingMore: 'और prop firms खोज रहे हैं?',
    browseAll: 'सभी 70+ Prop Firms देखें',
    activeCodes: 'सक्रिय प्रोमो कोड',
    visitSite: 'विज़िट करें',
    copyCode: 'कॉपी करें',
    copied: 'कॉपी हो गया!',
    off: 'छूट',
    from: 'से',
    split: 'स्प्लिट',
    reviews: 'समीक्षाएं',
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  website_url: string;
  trustpilot_rating: number;
  trustpilot_reviews: number;
  min_price: number;
  profit_split: number;
  discount_code: string;
  discount_percent: number;
}

interface AffiliateData {
  slug: string;
  affiliateLink: string;
  promoCode: string | null;
  discountPercent: number | null;
}

// =============================================================================
// REAL PROMO CODES & AFFILIATE LINKS
// =============================================================================

const AFFILIATE_DATA: AffiliateData[] = [
  {
    slug: 'earn2trade',
    affiliateLink: 'https://www.earn2trade.com/trader-career-path?a_pid=scanner-40&a_bid=8d7b4b9e',
    promoCode: 'SCANNER-40',
    discountPercent: 50,
  },
  {
    slug: 'top-one-futures',
    affiliateLink: 'https://toponefutures.com/?linkId=lp_707970&sourceId=scanner-30&tenantId=toponefutures',
    promoCode: 'pfs',
    discountPercent: 40,
  },
  {
    slug: 'forfx',
    affiliateLink: 'https://forfx.com/?campaign=propfirmscanner&ref=286341',
    promoCode: 'SCANNER10',
    discountPercent: 10,
  },
  {
    slug: 'funderpro',
    affiliateLink: 'https://funderpro.cxclick.com/visit/?bta=47056&brand=funderpro',
    promoCode: 'pfs40',
    discountPercent: 10,
  },
  {
    slug: 'the5ers',
    affiliateLink: 'https://www.the5ers.com/?afmc=13z1',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'maven-trading',
    affiliateLink: 'https://maventrading.com?ref=zme1m2j',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'blue-guardian',
    affiliateLink: 'https://blueguardian.com/?afmc=1tpr',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'funded-trading-plus',
    affiliateLink: 'https://www.fundedtradingplus.com?ref=propfirmscanner',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'instant-funding',
    affiliateLink: 'https://instantfunding.com/?partner=7543',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'alpha-capital-group',
    affiliateLink: 'https://app.alphacapitalgroup.uk/signup/XYINW',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'funding-pips',
    affiliateLink: 'https://app.fundingpips.com/register?ref=10BE678C',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'prime-funding',
    affiliateLink: 'https://prime-funding.com?ref=scanner-20',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'dna-funded',
    affiliateLink: 'https://partners.dnafunded.com/click?campaign_id=1&ref_id=675',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'seacrest-markets',
    affiliateLink: 'https://fundedtech.seacrestmarkets.io/purchasechallenge?sl=11739',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'funded-trader-markets',
    affiliateLink: 'https://fundedtradermarkets.com/ref/Sofiane',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'qt-funded',
    affiliateLink: 'https://qtfunded.quanttekel.com/ref/5508/',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'fundingticks',
    affiliateLink: 'https://app.fundingticks.com/register?ref=C1182EEE',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'funded-elite',
    affiliateLink: 'https://app.fundedelite.com?aff=AFF4544253',
    promoCode: null,
    discountPercent: null,
  },
  {
    slug: 'goat-funded-trader',
    affiliateLink: 'https://www.propfirmscanner.org/aff/Sofiane/',
    promoCode: null,
    discountPercent: null,
  },
];

// =============================================================================
// PROMO CODES BANNER
// =============================================================================

export function PromoCodesBanner() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;
  
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const promoCodes = AFFILIATE_DATA.filter(a => a.promoCode && a.discountPercent);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  if (promoCodes.length === 0) return null;

  return (
    <div className="mb-10 p-6 bg-gradient-to-r from-emerald-500/10 via-yellow-500/5 to-orange-500/10 border border-emerald-500/20 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <Gift className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{t.quickCopy}</h3>
          <p className="text-sm text-gray-400">{t.clickToCopy}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {promoCodes.map((promo) => (
          <button
            key={promo.slug}
            onClick={() => handleCopy(promo.promoCode!)}
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              copiedCode === promo.promoCode
                ? 'bg-emerald-500/20 border border-emerald-500/50'
                : 'bg-gray-800/80 border border-gray-700 hover:border-gray-600 hover:bg-gray-800'
            }`}
          >
            <div className="text-left">
              <span className="block text-white text-sm font-medium">
                {promo.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="block text-emerald-400 text-xs font-semibold">
                {promo.discountPercent}% {t.off}
              </span>
            </div>
            <code className={`px-3 py-1.5 text-sm font-mono rounded-lg transition-all ${
              copiedCode === promo.promoCode
                ? 'bg-emerald-500 text-white'
                : 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30'
            }`}>
              {copiedCode === promo.promoCode ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {t.copied}
                </span>
              ) : (
                promo.promoCode
              )}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// DEAL CARD COMPONENT
// =============================================================================

interface DealCardProps {
  firm: PropFirm;
  affiliate: AffiliateData;
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
  featured?: boolean;
  t: Record<string, string>;
}

function DealCard({ firm, affiliate, onCopyCode, copiedCode, featured, t }: DealCardProps) {
  const hasPromoCode = affiliate.promoCode && affiliate.discountPercent;
  
  return (
    <div className={`relative bg-gray-900 rounded-2xl border overflow-hidden transition-all hover:border-emerald-500/50 ${
      featured ? 'border-emerald-500/30' : 'border-gray-800'
    }`}>
      {/* Discount Badge */}
      {hasPromoCode && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1.5 rounded-bl-xl font-bold text-sm">
            {affiliate.discountPercent}% {t.off}
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Logo & Name */}
        <div className="flex items-start gap-4 mb-4 pt-4">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2 flex-shrink-0">
            {firm.logo_url ? (
              <Image src={firm.logo_url} alt={firm.name} width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-2xl font-bold text-emerald-600">{firm.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">{firm.name}</h3>
            {firm.trustpilot_rating && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">{firm.trustpilot_rating.toFixed(1)}</span>
                </div>
                {firm.trustpilot_reviews && (
                  <span className="text-gray-500 text-sm">({firm.trustpilot_reviews.toLocaleString()} {t.reviews})</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <span className="text-gray-400 text-xs block mb-1">{t.from}</span>
            <span className="text-white font-semibold">${firm.min_price || 'N/A'}</span>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <span className="text-gray-400 text-xs block mb-1">{t.split}</span>
            <span className="text-emerald-400 font-semibold">{firm.profit_split || 80}%</span>
          </div>
        </div>

        {/* Promo Code */}
        {hasPromoCode && (
          <button
            onClick={() => onCopyCode(affiliate.promoCode!)}
            className={`w-full mb-4 p-3 rounded-xl border-2 border-dashed transition-all ${
              copiedCode === affiliate.promoCode
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <code className="text-yellow-400 font-mono font-bold">{affiliate.promoCode}</code>
              {copiedCode === affiliate.promoCode ? (
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4" /> {t.copied}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  <Copy className="w-4 h-4" /> {t.copyCode}
                </span>
              )}
            </div>
          </button>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/prop-firm/${firm.slug}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
          >
            Details
          </Link>
          <Link
            href={affiliate.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              hasPromoCode 
                ? 'flex-1 bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'flex-1 bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {t.visitSite}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

function DealCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4 pt-8">
        <div className="w-14 h-14 bg-gray-800 rounded-xl" />
        <div className="flex-1">
          <div className="h-5 bg-gray-800 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-16 bg-gray-800 rounded-lg" />
        <div className="h-16 bg-gray-800 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-800 rounded-xl" />
        <div className="flex-1 h-12 bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DEALS GRID COMPONENT
// =============================================================================

export function DealsGrid() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;
  
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFirms() {
      try {
        const supabase = createClientComponentClient();
        const slugs = AFFILIATE_DATA.map(a => a.slug);
        
        const { data, error } = await supabase
          .from('prop_firms')
          .select('id, name, slug, logo_url, website_url, trustpilot_rating, trustpilot_reviews, min_price, profit_split, discount_code, discount_percent')
          .in('slug', slugs);

        if (error) throw error;
        setFirms(data || []);
      } catch (error) {
        console.error('Error fetching firms:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFirms();
  }, []);

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const firmsWithDeals = AFFILIATE_DATA.map(affiliate => {
    const firm = firms.find(f => f.slug === affiliate.slug);
    return { affiliate, firm };
  }).filter(({ firm }) => firm);

  const firmsWithCodes = firmsWithDeals.filter(({ affiliate }) => affiliate.promoCode && affiliate.discountPercent);
  const firmsWithoutCodes = firmsWithDeals.filter(({ affiliate }) => !affiliate.promoCode);

  firmsWithCodes.sort((a, b) => (b.affiliate.discountPercent || 0) - (a.affiliate.discountPercent || 0));

  return (
    <div className="space-y-12">
      {/* Featured Deals Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.exclusiveCodes}</h2>
            <p className="text-sm text-gray-400">
              {firmsWithCodes.length} {firmsWithCodes.length > 1 ? t.verifiedDiscounts : t.verifiedDiscount}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <DealCardSkeleton key={i} />)}
          </div>
        ) : firmsWithCodes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {firmsWithCodes.map(({ firm, affiliate }) => (
              <DealCard
                key={firm!.slug}
                firm={firm!}
                affiliate={affiliate}
                onCopyCode={handleCopyCode}
                copiedCode={copiedCode}
                featured
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {t.noPromos}
          </div>
        )}
      </section>

      {/* Partner Links Section */}
      {firmsWithoutCodes.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gray-800 rounded-xl">
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.partnerLinks}</h2>
              <p className="text-sm text-gray-400">{t.trustedFirms}</p>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <DealCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {firmsWithoutCodes.map(({ firm, affiliate }) => (
                <DealCard
                  key={firm!.slug}
                  firm={firm!}
                  affiliate={affiliate}
                  onCopyCode={handleCopyCode}
                  copiedCode={copiedCode}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className="text-center py-8">
        <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl">
          <p className="text-gray-400">{t.lookingMore}</p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
          >
            {t.browseAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// FEATURED FIRMS SIDEBAR
// =============================================================================

export function FeaturedFirmsSidebar() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;
  
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const promoCodes = AFFILIATE_DATA.filter(a => a.promoCode && a.discountPercent).slice(0, 4);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Tag className="w-4 h-4 text-yellow-400" />
        {t.activeCodes}
      </h3>

      <div className="space-y-3">
        {promoCodes.map((promo) => (
          <button
            key={promo.slug}
            onClick={() => handleCopy(promo.promoCode!)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              copiedCode === promo.promoCode
                ? 'bg-emerald-500/20'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="text-white text-sm">
                {promo.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="text-emerald-400 text-xs">{promo.discountPercent}% {t.off}</span>
            </div>
            <code className={`px-2 py-1 text-xs font-mono rounded ${
              copiedCode === promo.promoCode
                ? 'bg-emerald-500/30 text-emerald-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {copiedCode === promo.promoCode ? `✓ ${t.copied}` : promo.promoCode}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
}
