'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ExternalLink, Tag, CheckCircle, Star, Copy, Check,
  Percent, Sparkles, ArrowRight, Zap, Gift
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  // ✅ VRAIS CODES PROMO (4)
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
  // LIENS AFFILIÉS SANS CODE
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
// PROMO CODES BANNER - Le composant manquant!
// =============================================================================

export function PromoCodesBanner() {
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
          <h3 className="font-semibold text-white">Quick Copy Promo Codes</h3>
          <p className="text-sm text-gray-400">Click any code to copy instantly</p>
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
                {promo.discountPercent}% OFF
              </span>
            </div>
            <code className={`px-3 py-1.5 text-sm font-mono rounded-lg transition-all ${
              copiedCode === promo.promoCode
                ? 'bg-emerald-500 text-white'
                : 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30'
            }`}>
              {copiedCode === promo.promoCode ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied!
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
}

function DealCard({ firm, affiliate, onCopyCode, copiedCode, featured = false }: DealCardProps) {
  const hasPromoCode = affiliate.promoCode && affiliate.discountPercent;
  const logoUrl = firm.logo_url || `https://www.google.com/s2/favicons?domain=${firm.website_url?.replace(/https?:\/\//, '')}&sz=128`;

  return (
    <div className={`relative bg-gray-900 rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 ${
      featured 
        ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
        : 'border-gray-800 hover:border-gray-700'
    }`}>
      {/* Promo Badge */}
      {hasPromoCode && (
        <div className="absolute top-3 right-3 z-10">
          <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-lg shadow-lg flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" />
            {affiliate.discountPercent}% OFF
          </div>
        </div>
      )}

      {/* Verified Badge */}
      {firm.trustpilot_rating >= 4.0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full backdrop-blur-sm">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        </div>
      )}

      <div className="p-5 pt-12">
        {/* Header with Logo */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-14 h-14 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700">
            <Image
              src={logoUrl}
              alt={firm.name}
              fill
              className="object-contain p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(firm.name)}&background=10b981&color=fff&size=128`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">{firm.name}</h3>
            {firm.trustpilot_rating > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm font-medium">{firm.trustpilot_rating.toFixed(1)}</span>
                <span className="text-gray-500 text-xs">({firm.trustpilot_reviews} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">From</p>
            <p className="text-white font-semibold">${firm.min_price || '—'}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs mb-1">Profit Split</p>
            <p className="text-emerald-400 font-semibold">{firm.profit_split || '—'}%</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hasPromoCode && (
            <button
              onClick={() => onCopyCode(affiliate.promoCode!)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                copiedCode === affiliate.promoCode
                  ? 'bg-emerald-500 text-white'
                  : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
              }`}
            >
              {copiedCode === affiliate.promoCode ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {affiliate.promoCode}
                </>
              )}
            </button>
          )}
          
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
            Visit Site
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
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch firms from Supabase
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

  // Merge firms with affiliate data
  const firmsWithDeals = AFFILIATE_DATA.map(affiliate => {
    const firm = firms.find(f => f.slug === affiliate.slug);
    return { affiliate, firm };
  }).filter(({ firm }) => firm);

  // Separate firms with promo codes from those without
  const firmsWithCodes = firmsWithDeals.filter(({ affiliate }) => affiliate.promoCode && affiliate.discountPercent);
  const firmsWithoutCodes = firmsWithDeals.filter(({ affiliate }) => !affiliate.promoCode);

  // Sort by discount percent (highest first)
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
            <h2 className="text-xl font-bold text-white">Exclusive Promo Codes</h2>
            <p className="text-sm text-gray-400">
              {firmsWithCodes.length} verified discount{firmsWithCodes.length > 1 ? 's' : ''} available
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
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No promo codes available at the moment.
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
              <h2 className="text-xl font-bold text-white">Partner Links</h2>
              <p className="text-sm text-gray-400">
                Trusted prop firms with exclusive access
              </p>
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
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section className="text-center py-8">
        <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl">
          <p className="text-gray-400">Looking for more prop firms?</p>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
          >
            Browse All 70+ Prop Firms
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
        Active Promo Codes
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
              <span className="text-emerald-400 text-xs">{promo.discountPercent}% OFF</span>
            </div>
            <code className={`px-2 py-1 text-xs font-mono rounded ${
              copiedCode === promo.promoCode
                ? 'bg-emerald-500/30 text-emerald-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {copiedCode === promo.promoCode ? '✓ Copied' : promo.promoCode}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
}
