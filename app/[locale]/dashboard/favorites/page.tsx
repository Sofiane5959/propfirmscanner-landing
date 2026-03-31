'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Star, ArrowLeft, Loader2, ExternalLink, Trash2, BarChart3,
  TrendingUp, Award, Globe,
} from 'lucide-react';

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) return firstSegment as Locale;
  return 'en';
}

// ── Types ─────────────────────────────────────────────────────
interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo_path: string | null;
  max_allocation: number | null;
  review_score: number | null;
  reviews_count: number | null;
  trustpilot_score: number | null;
  country: string | null;
  rank: number | null;
  program_types: string[] | null;
  platforms: string[] | null;
  affiliate_url: string | null;
}

interface FavoriteFromDB {
  id: string;
  prop_firm_id: string;
  created_at: string;
  prop_firms: PropFirm | PropFirm[];
}

interface FavoriteFirm {
  id: string;
  prop_firm_id: string;
  created_at: string;
  firm: PropFirm | null;
}

const COUNTRY_FLAGS: Record<string, string> = {
  GB: '🇬🇧', US: '🇺🇸', AE: '🇦🇪', CZ: '🇨🇿', AU: '🇦🇺',
  CA: '🇨🇦', SE: '🇸🇪', CH: '🇨🇭', IL: '🇮🇱', HK: '🇭🇰',
  CY: '🇨🇾', VU: '🇻🇺', LC: '🇱🇨', ZA: '🇿🇦', LI: '🇱🇮',
  IT: '🇮🇹', MU: '🇲🇺', VG: '🇻🇬', VC: '🇻🇨',
};

const IMG_BASE = 'https://imagedelivery.net/XknxnEJnSzLFsNzPLnfHOA';

function getFirmLogoUrl(logoPath: string | null): string | null {
  if (!logoPath) return null;
  if (logoPath.startsWith('http')) return logoPath;
  return `${IMG_BASE}/${logoPath}/public`;
}

// ── Main Component ────────────────────────────────────────────
export default function FavoritesPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [favorites, setFavorites] = useState<FavoriteFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select(`
            id,
            prop_firm_id,
            created_at,
            prop_firms (
              id,
              name,
              slug,
              logo_path,
              max_allocation,
              review_score,
              reviews_count,
              trustpilot_score,
              country,
              rank,
              program_types,
              platforms,
              affiliate_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformed: FavoriteFirm[] = (data as unknown as FavoriteFromDB[] || []).map((item) => {
          const firmData = item.prop_firms;
          const firm = Array.isArray(firmData)
            ? (firmData.length > 0 ? firmData[0] : null)
            : firmData || null;
          return { id: item.id, prop_firm_id: item.prop_firm_id, created_at: item.created_at, firm };
        });

        setFavorites(transformed);
      } catch (err: any) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, supabase]);

  const removeFavorite = async (favoriteId: string) => {
    setRemoving(favoriteId);
    try {
      const { error } = await supabase.from('user_favorites').delete().eq('id', favoriteId);
      if (error) throw error;
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    } finally {
      setRemoving(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" /> My Favorites
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              {favorites.length} saved prop firm{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href={`/${locale}/compare`}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm">
            <BarChart3 className="w-4 h-4 text-emerald-400" /> Browse firms
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>

        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-900/50 rounded-2xl border border-dashed border-gray-700 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Star className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
              Browse and compare prop firms, then save your favorites for easy access.
            </p>
            <Link href={`/${locale}/compare`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium">
              <BarChart3 className="w-5 h-5" /> Compare Prop Firms
            </Link>
          </div>

        ) : (
          /* Favorites Grid */
          <div className="space-y-3">
            {favorites.map((favorite) => {
              const firm = favorite.firm;
              if (!firm) return null;
              const logoUrl = getFirmLogoUrl(firm.logo_path);
              const score = firm.trustpilot_score || firm.review_score;

              return (
                <div key={favorite.id}
                  className="bg-gray-900/60 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors p-4">
                  <div className="flex items-center gap-4">

                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt={firm.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-lg font-bold text-gray-500">{firm.name?.charAt(0)}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{firm.name}</h3>
                        {firm.rank && (
                          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                            #{firm.rank}
                          </span>
                        )}
                        {firm.country && (
                          <span className="text-xs text-gray-500">
                            {COUNTRY_FLAGS[firm.country] || ''} {firm.country}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        {score && (
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <Star className="w-3 h-3 fill-yellow-400" /> {score.toFixed(1)}
                            {firm.reviews_count ? <span className="text-gray-500">({firm.reviews_count})</span> : null}
                          </span>
                        )}
                        {firm.max_allocation && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Up to ${(firm.max_allocation / 1000).toFixed(0)}K
                          </span>
                        )}
                        {firm.program_types && firm.program_types.length > 0 && (
                          <div className="flex gap-1">
                            {firm.program_types.slice(0, 3).map((t) => (
                              <span key={t} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                                {t.replace('_Steps', '-Step').replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {firm.affiliate_url && (
                        <a href={firm.affiliate_url} target="_blank" rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Visit firm">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link href={`/${locale}/prop-firms/${firm.slug}`}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View details">
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => removeFavorite(favorite.id)}
                        disabled={removing === favorite.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove from favorites">
                        {removing === favorite.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Compare CTA */}
            <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white text-sm">Want to compare your favorites?</p>
                  <p className="text-xs text-gray-400">See them side by side to make a decision</p>
                </div>
                <Link href={`/${locale}/compare`}
                  className="shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium">
                  Compare Now →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
