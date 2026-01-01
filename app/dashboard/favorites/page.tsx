import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Star, ArrowLeft, Plus, ExternalLink } from 'lucide-react';

// =============================================================================
// PAGE
// =============================================================================

export default async function FavoritesPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch user's favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const hasFavorites = favorites && favorites.length > 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Mes Favoris
                </h1>
                <p className="text-sm text-gray-500">
                  {hasFavorites ? `${favorites.length} prop firm${favorites.length > 1 ? 's' : ''} sauvegardée${favorites.length > 1 ? 's' : ''}` : 'Aucun favori pour le moment'}
                </p>
              </div>
            </div>
            
            <Link
              href="/compare"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Parcourir les firms
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {hasFavorites ? (
          <div className="grid gap-4">
            {favorites.map((favorite) => (
              <FavoriteCard key={favorite.id} favorite={favorite} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function FavoriteCard({ favorite }: { favorite: { id: string; prop_firm_slug: string; created_at: string } }) {
  // Convert slug to display name
  const displayName = favorite.prop_firm_slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <span className="text-lg font-bold text-emerald-400">
            {displayName.charAt(0)}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-white">{displayName}</h3>
          <p className="text-sm text-gray-500">
            Ajouté le {new Date(favorite.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link
          href={`/compare/${favorite.prop_firm_slug}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Voir détails
          <ExternalLink className="w-4 h-4" />
        </Link>
        <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 group-hover:text-red-400 group-hover:fill-transparent" />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Star className="w-8 h-8 text-gray-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-white mb-2">
        Aucun favori
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        Explorez les prop firms et ajoutez-les à vos favoris pour un accès rapide.
      </p>
      
      <Link
        href="/compare"
        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
      >
        <Plus className="w-5 h-5" />
        Parcourir les prop firms
      </Link>
    </div>
  );
}
