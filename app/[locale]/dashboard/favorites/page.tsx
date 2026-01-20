'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Star,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Trash2,
  BarChart3,
} from 'lucide-react';

interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  min_account_size: number | null;
  max_account_size: number | null;
  profit_split: number | null;
}

interface FavoriteFromDB {
  id: string;
  prop_firm_id: string;
  created_at: string;
  prop_firms: PropFirm[];
}

interface FavoriteFirm {
  id: string;
  prop_firm_id: string;
  created_at: string;
  firm: PropFirm | null;
}

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [favorites, setFavorites] = useState<FavoriteFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

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
              logo_url,
              min_account_size,
              max_account_size,
              profit_split
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform the data to handle Supabase's array response
        const transformedData: FavoriteFirm[] = (data as unknown as FavoriteFromDB[] || []).map((item) => ({
          id: item.id,
          prop_firm_id: item.prop_firm_id,
          created_at: item.created_at,
          firm: item.prop_firms && item.prop_firms.length > 0 ? item.prop_firms[0] : null,
        }));
        
        setFavorites(transformedData);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user, supabase]);

  // Remove from favorites
  const removeFavorite = async (favoriteId: string) => {
    setRemoving(favoriteId);
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      setFavorites(favorites.filter((f) => f.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  // Loading state
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
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            My Favorites
          </h1>
          <p className="text-gray-400 mt-1">
            {favorites.length} saved prop firm{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Star className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start comparing prop firms and save your favorites to easily access them later.
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
            >
              <BarChart3 className="w-5 h-5" />
              Compare Prop Firms
            </Link>
          </div>
        ) : (
          /* Favorites List */
          <div className="space-y-4">
            {favorites.map((favorite) => {
              const firm = favorite.firm;
              if (!firm) return null;
              
              return (
                <div
                  key={favorite.id}
                  className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {firm.logo_url ? (
                        <img
                          src={firm.logo_url}
                          alt={firm.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-600">
                          {firm.name?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {firm.name || 'Unknown Firm'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {firm.profit_split && (
                          <span>{firm.profit_split}% profit split</span>
                        )}
                        {firm.max_account_size && (
                          <span>Up to ${firm.max_account_size.toLocaleString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/compare?firm=${firm.slug}`}
                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => removeFavorite(favorite.id)}
                        disabled={removing === favorite.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove from Favorites"
                      >
                        {removing === favorite.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Want to compare your favorites?</p>
                <p className="text-sm text-gray-400">See them side by side to make a decision</p>
              </div>
              <Link
                href="/compare"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Compare Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
