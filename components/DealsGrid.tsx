'use client';

import Link from 'next/link';
import { ExternalLink, Tag, CheckCircle, Star } from 'lucide-react';
import { AFFILIATE_PROP_FIRMS, NON_AFFILIATE_PROP_FIRMS, type PropFirmAffiliate } from '@/lib/affiliate-links';

// =============================================================================
// DEAL CARD COMPONENT
// =============================================================================

interface DealCardProps {
  firm: PropFirmAffiliate;
  priority?: boolean;
}

function DealCard({ firm, priority = false }: DealCardProps) {
  return (
    <div className={`relative bg-gray-900 rounded-xl border overflow-hidden transition-all hover:border-emerald-500/50 ${
      priority ? 'border-emerald-500/30' : 'border-gray-800'
    }`}>
      {/* Featured Badge */}
      {firm.verified && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl flex items-center justify-center">
            <span className="text-xl font-bold text-emerald-400">
              {firm.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg truncate">{firm.name}</h3>
            {firm.promoCode && (
              <div className="flex items-center gap-1.5 mt-1">
                <Tag className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-sm text-yellow-400 font-medium">
                  Code: {firm.promoCode}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {firm.hasAffiliate && (
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg">
              Exclusive Link
            </span>
          )}
          {firm.promoCode && (
            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg">
              Discount Available
            </span>
          )}
        </div>

        {/* CTA Button */}
        {firm.affiliateLink ? (
          <a
            href={firm.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Visit {firm.name}
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <Link
            href={`/compare/${firm.slug}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN DEALS PAGE COMPONENT
// =============================================================================

export function DealsGrid() {
  return (
    <div className="space-y-12">
      {/* Featured Deals Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Exclusive Deals</h2>
            <p className="text-sm text-gray-400">
              Partner prop firms with exclusive discounts
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AFFILIATE_PROP_FIRMS.map((firm) => (
            <DealCard key={firm.slug} firm={firm} priority />
          ))}
        </div>
      </section>

      {/* All Other Firms */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">All Prop Firms</h2>
          <p className="text-sm text-gray-400">
            Browse all available prop trading firms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {NON_AFFILIATE_PROP_FIRMS.map((firm) => (
            <DealCard key={firm.slug} firm={firm} />
          ))}
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// PROMO CODES DISPLAY COMPONENT
// =============================================================================

export function PromoCodesBanner() {
  const firmsWithCodes = AFFILIATE_PROP_FIRMS.filter(f => f.promoCode);

  if (firmsWithCodes.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent border border-yellow-500/30 rounded-xl p-5 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <Tag className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white">Active Promo Codes</h3>
          <p className="text-sm text-gray-400">Use these codes at checkout for exclusive discounts</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {firmsWithCodes.map((firm) => (
          <div
            key={firm.slug}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 rounded-lg border border-gray-800"
          >
            <span className="text-sm text-gray-400">{firm.name}:</span>
            <code className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-sm font-mono rounded">
              {firm.promoCode}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// FEATURED FIRMS SIDEBAR COMPONENT
// =============================================================================

export function FeaturedFirmsSidebar() {
  const topFirms = AFFILIATE_PROP_FIRMS.slice(0, 5);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Star className="w-4 h-4 text-yellow-400" />
        Partner Firms
      </h3>

      <div className="space-y-3">
        {topFirms.map((firm) => (
          <a
            key={firm.slug}
            href={firm.affiliateLink || `/compare/${firm.slug}`}
            target={firm.affiliateLink ? '_blank' : undefined}
            rel={firm.affiliateLink ? 'noopener noreferrer' : undefined}
            className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <span className="text-white group-hover:text-emerald-400 transition-colors">
              {firm.name}
            </span>
            {firm.promoCode && (
              <code className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-mono rounded">
                {firm.promoCode}
              </code>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
