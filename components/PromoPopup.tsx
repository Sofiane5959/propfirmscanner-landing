'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Copy, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// =====================================================
// TYPES
// =====================================================
interface PromoDeal {
  id: string;
  slug: string;
  name: string;
  logo_url?: string | null;
  discount_percent: number;
  discount_code?: string | null;
  affiliate_url?: string | null;
  website_url?: string | null;
}

// Color palette rotation — assigned by index, not stored per firm,
// so the popup stays visually varied without coupling colors to the DB.
const PALETTE = [
  'from-blue-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-green-600',
  'from-purple-500 to-violet-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-purple-600',
  'from-yellow-500 to-amber-600',
];

const colorFor = (slug: string) => {
  // Stable color per firm: hash slug to a palette index
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

// =====================================================
// COMPONENT
// =====================================================
export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [promo, setPromo] = useState<PromoDeal | null>(null);
  const [copied, setCopied] = useState(false);

  // -----------------------------------------------------
  // Fetch promos from Supabase, then schedule the popup
  // -----------------------------------------------------
  useEffect(() => {
    // Respect the dismiss cooldown (24h)
    const lastDismissed = localStorage.getItem('promo_popup_dismissed_at');
    if (lastDismissed) {
      const hoursAgo = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursAgo < 24) return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const fetchAndSchedule = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
          .from('prop_firms')
          .select('id, slug, name, logo_url, discount_percent, discount_code, affiliate_url, website_url')
          .gt('discount_percent', 0)
          .eq('listing_status', 'listed')
          .order('priority_tier', { ascending: true, nullsFirst: false })
          .order('discount_percent', { ascending: false })
          .limit(20);

        if (error || !data || data.length === 0 || cancelled) return;

        // Show after 15 seconds — same UX as before, just sourced from DB now
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          const random = data[Math.floor(Math.random() * data.length)];
          setPromo(random);
          setIsVisible(true);
        }, 15000);
      } catch (err) {
        // Fail silent — popup is non-critical, don't break the page
        console.error('Failed to load promo popup deals:', err);
      }
    };

    fetchAndSchedule();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // -----------------------------------------------------
  // Handlers
  // -----------------------------------------------------
  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promo_popup_dismissed_at', Date.now().toString());
  };

  const handleCopy = async () => {
    if (!promo?.discount_code) return;
    try {
      await navigator.clipboard.writeText(promo.discount_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard might be blocked — silent fail */
    }
  };

  // -----------------------------------------------------
  // Render
  // -----------------------------------------------------
  if (!isVisible || !promo) return null;

  const color = colorFor(promo.slug);
  const hasCode = !!(promo.discount_code && promo.discount_code.trim().length > 0);
  // CLICK TRACKING: route through /api/go/{slug} for analytics
  const claimUrl = `/api/go/${promo.slug}?source=promo-popup`;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="relative w-80 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className={`bg-gradient-to-r ${color} p-4`}>
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">Limited Time Offer</p>
              <p className="text-white text-xl font-bold">{promo.discount_percent}% OFF</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-700 flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
              {promo.logo_url ? (
                <Image src={promo.logo_url} alt={promo.name} width={48} height={48} className="object-contain" />
              ) : (
                <span className="text-lg font-bold text-emerald-600">{promo.name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-white font-semibold truncate">{promo.name}</h4>
              <p className="text-gray-400 text-sm">
                {hasCode ? 'Use code at checkout' : 'Discount applied via our link'}
              </p>
            </div>
          </div>

          {hasCode && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 px-4 py-2.5 bg-gray-800 border border-dashed border-gray-600 rounded-lg overflow-hidden">
                <code className="text-emerald-400 font-mono font-semibold tracking-wider text-sm truncate block">
                  {promo.discount_code}
                </code>
              </div>
              <button
                onClick={handleCopy}
                className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                aria-label={copied ? 'Copied' : 'Copy code'}
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          )}

          <a
            href={claimUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className={`w-full py-3 bg-gradient-to-r ${color} text-white font-semibold 
                       rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
          >
            Claim Offer
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
