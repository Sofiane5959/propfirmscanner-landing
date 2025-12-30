import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { 
  Tag, 
  ExternalLink, 
  CheckCircle, 
  Clock,
  Star,
  Gift,
  Copy,
  Zap,
  Crown
} from 'lucide-react';
import { CopyCodeButton } from './CopyCodeButton';

// =============================================================================
// TYPES
// =============================================================================

interface Deal {
  deal_id: string;
  title: string;
  description: string | null;
  discount_percent: number | null;
  discount_code: string | null;
  is_featured: boolean;
  last_verified_at: string;
  firm_name: string;
  firm_slug: string;
  firm_logo_url: string | null;
  affiliate_url: string | null;
}

// =============================================================================
// FALLBACK DATA (SSR when DB not available)
// =============================================================================

const fallbackDeals: Deal[] = [
  {
    deal_id: '1',
    title: 'FTMO Discount',
    description: 'Get 10% off all challenges',
    discount_percent: 10,
    discount_code: 'PROPFIRMSCANNER',
    is_featured: true,
    last_verified_at: new Date().toISOString(),
    firm_name: 'FTMO',
    firm_slug: 'ftmo',
    firm_logo_url: null,
    affiliate_url: 'https://ftmo.com',
  },
  {
    deal_id: '2',
    title: 'FundedNext Discount',
    description: 'Get 15% off all challenges',
    discount_percent: 15,
    discount_code: 'SCANNER15',
    is_featured: true,
    last_verified_at: new Date().toISOString(),
    firm_name: 'FundedNext',
    firm_slug: 'fundednext',
    firm_logo_url: null,
    affiliate_url: 'https://fundednext.com',
  },
  {
    deal_id: '3',
    title: 'MyFundedFX Discount',
    description: 'Get 10% off all challenges',
    discount_percent: 10,
    discount_code: 'PFS10',
    is_featured: false,
    last_verified_at: new Date().toISOString(),
    firm_name: 'MyFundedFX',
    firm_slug: 'myfundedfx',
    firm_logo_url: null,
    affiliate_url: 'https://myfundedfx.com',
  },
  {
    deal_id: '4',
    title: 'E8 Funding Discount',
    description: 'Get 8% off all challenges',
    discount_percent: 8,
    discount_code: 'SCANNER8',
    is_featured: false,
    last_verified_at: new Date().toISOString(),
    firm_name: 'E8 Funding',
    firm_slug: 'e8-funding',
    firm_logo_url: null,
    affiliate_url: 'https://e8funding.com',
  },
  {
    deal_id: '5',
    title: 'The5ers Referral',
    description: 'Get 5% off via our referral link',
    discount_percent: 5,
    discount_code: null,
    is_featured: false,
    last_verified_at: new Date().toISOString(),
    firm_name: 'The5ers',
    firm_slug: 'the5ers',
    firm_logo_url: null,
    affiliate_url: 'https://the5ers.com',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysAgo(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// =============================================================================
// DEAL CARD COMPONENT
// =============================================================================

function DealCard({ deal }: { deal: Deal }) {
  const daysAgo = getDaysAgo(deal.last_verified_at);
  const isRecent = daysAgo <= 7;

  return (
    <div className={`bg-gray-800 rounded-xl border ${
      deal.is_featured ? 'border-yellow-500/30' : 'border-gray-700'
    } overflow-hidden`}>
      {/* Featured Badge */}
      {deal.is_featured && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-400">Featured Deal</span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {deal.firm_name[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">{deal.firm_name}</h3>
              <p className="text-sm text-gray-400">{deal.title}</p>
            </div>
          </div>
          
          {deal.discount_percent && (
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg">
              {deal.discount_percent}% OFF
            </div>
          )}
        </div>

        {/* Description */}
        {deal.description && (
          <p className="text-gray-300 mb-4">{deal.description}</p>
        )}

        {/* Discount Code */}
        {deal.discount_code && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Discount Code</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-4 py-2 bg-gray-900 rounded-lg text-emerald-400 font-mono text-lg tracking-wider">
                {deal.discount_code}
              </code>
              <CopyCodeButton code={deal.discount_code} />
            </div>
          </div>
        )}

        {/* Verification */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <CheckCircle className={`w-4 h-4 ${isRecent ? 'text-emerald-400' : 'text-gray-500'}`} />
          <span className={isRecent ? 'text-emerald-400' : 'text-gray-500'}>
            Last verified {formatDate(deal.last_verified_at)}
            {isRecent && ' (recent)'}
          </span>
        </div>

        {/* Affiliate Notice */}
        <p className="text-xs text-gray-500 mb-4">
          <Gift className="w-3 h-3 inline mr-1" />
          Referral link — supports the site at no extra cost to you
        </p>

        {/* CTA Button */}
        {deal.affiliate_url && (
          <a
            href={deal.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Get This Deal
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE COMPONENT (Server Component - SSR Safe)
// =============================================================================

export default async function DealsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Try to fetch deals from database
  let deals: Deal[] = fallbackDeals;
  
  try {
    const { data, error } = await supabase.rpc('get_active_deals');
    
    if (!error && data && data.length > 0) {
      deals = data;
    }
  } catch (e) {
    // Use fallback data if DB fails
    console.log('Using fallback deals data');
  }

  // Separate featured and regular deals
  const featuredDeals = deals.filter(d => d.is_featured);
  const regularDeals = deals.filter(d => !d.is_featured);

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full mb-4">
            <Tag className="w-4 h-4" />
            Exclusive Deals
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Prop Firm Discounts
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Save money on your prop firm challenges with our verified discount codes and referral links.
          </p>
        </div>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Featured Deals
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredDeals.map((deal) => (
                <DealCard key={deal.deal_id} deal={deal} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Deals */}
        {regularDeals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4">
              All Deals
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {regularDeals.map((deal) => (
                <DealCard key={deal.deal_id} deal={deal} />
              ))}
            </div>
          </div>
        )}

        {/* Pro Tracker CTA */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-8 border border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Pro Tracker</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Track Your Challenges
              </h2>
              <p className="text-gray-300">
                After you purchase, add your account to Pro Tracker to monitor drawdown limits and never break a rule.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              <Zap className="w-5 h-5" />
              Try Pro Tracker Free
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <p className="text-sm text-gray-500 text-center">
            <strong className="text-gray-400">Affiliate Disclosure:</strong> Some links on this page are affiliate links. 
            We may earn a commission if you purchase through our links, at no extra cost to you. 
            This helps us maintain the site and provide free tools.
          </p>
        </div>
      </div>
    </div>
  );
}
