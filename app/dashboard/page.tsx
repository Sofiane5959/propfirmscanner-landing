'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Shield, LogOut, Trash2, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, profile, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const email = user?.email;
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '';

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Paramètres</h1>
              <p className="text-sm text-gray-500">Gérez votre compte</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Section */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Profil</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-5 mb-6">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName}
                  className="w-20 h-20 rounded-full border-2 border-emerald-500/30"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                  <User className="w-8 h-8 text-emerald-400" />
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-semibold text-white">{displayName}</h3>
                <p className="text-gray-500">Membre depuis {createdAt}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Méthode de connexion</p>
                  <p className="text-white">Google</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Actions du compte</h2>
          </div>
          
          <div className="p-6 space-y-3">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-3 w-full p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-colors text-left"
            >
              {isSigningOut ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-white">Se déconnecter</p>
                <p className="text-sm text-gray-500">Vous serez redirigé vers la page d&apos;accueil</p>
              </div>
            </button>

            <button
              className="flex items-center gap-3 w-full p-4 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors text-left border border-red-500/20"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-medium text-red-400">Supprimer le compte</p>
                <p className="text-sm text-gray-500">Cette action est irréversible</p>
              </div>
            </button>
          </div>
        </section>

        {/* Support */}
        <section className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center">
          <p className="text-gray-500 text-sm">
            Besoin d&apos;aide ?{' '}
            <a href="mailto:support@propfirmscanner.org" className="text-emerald-400 hover:underline">
              Contactez-nous
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
