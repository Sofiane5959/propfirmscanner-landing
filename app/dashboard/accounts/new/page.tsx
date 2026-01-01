'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { createGuestAccount, hasGuestAccount } from '@/lib/guest-storage';
import { PaywallModal } from '@/components/PaywallModal';
import { getUserPlan, canAddAccount } from '@/lib/subscription';
import {
  ArrowLeft,
  Shield,
  ChevronDown,
  Loader2,
  Info,
  CheckCircle,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// PROP FIRMS DATA
// =============================================================================

const PROP_FIRMS = [
  { 
    slug: 'ftmo', 
    name: 'FTMO',
    programs: [
      { name: 'Challenge $10K', size: 10000, daily_dd: 5, max_dd: 10, min_days: 4 },
      { name: 'Challenge $25K', size: 25000, daily_dd: 5, max_dd: 10, min_days: 4 },
      { name: 'Challenge $50K', size: 50000, daily_dd: 5, max_dd: 10, min_days: 4 },
      { name: 'Challenge $100K', size: 100000, daily_dd: 5, max_dd: 10, min_days: 4 },
      { name: 'Challenge $200K', size: 200000, daily_dd: 5, max_dd: 10, min_days: 4 },
    ],
    dd_type: 'static' as const,
  },
  { 
    slug: 'fundednext', 
    name: 'FundedNext',
    programs: [
      { name: 'Stellar $6K', size: 6000, daily_dd: 5, max_dd: 10, min_days: 5 },
      { name: 'Stellar $15K', size: 15000, daily_dd: 5, max_dd: 10, min_days: 5 },
      { name: 'Stellar $25K', size: 25000, daily_dd: 5, max_dd: 10, min_days: 5 },
      { name: 'Stellar $50K', size: 50000, daily_dd: 5, max_dd: 10, min_days: 5 },
      { name: 'Stellar $100K', size: 100000, daily_dd: 5, max_dd: 10, min_days: 5 },
    ],
    dd_type: 'trailing' as const,
  },
  { 
    slug: 'the5ers', 
    name: 'The5ers',
    programs: [
      { name: 'Bootcamp $5K', size: 5000, daily_dd: 3, max_dd: 6, min_days: 3 },
      { name: 'Bootcamp $20K', size: 20000, daily_dd: 3, max_dd: 6, min_days: 3 },
      { name: 'Bootcamp $60K', size: 60000, daily_dd: 3, max_dd: 6, min_days: 3 },
      { name: 'Bootcamp $100K', size: 100000, daily_dd: 3, max_dd: 6, min_days: 3 },
    ],
    dd_type: 'static' as const,
  },
  { 
    slug: 'myfundedfx', 
    name: 'MyFundedFX',
    programs: [
      { name: 'Challenge $5K', size: 5000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'Challenge $10K', size: 10000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'Challenge $25K', size: 25000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'Challenge $50K', size: 50000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'Challenge $100K', size: 100000, daily_dd: 5, max_dd: 8, min_days: 5 },
    ],
    dd_type: 'trailing' as const,
  },
  { 
    slug: 'e8-funding', 
    name: 'E8 Funding',
    programs: [
      { name: 'E8 Track $25K', size: 25000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'E8 Track $50K', size: 50000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'E8 Track $100K', size: 100000, daily_dd: 5, max_dd: 8, min_days: 5 },
      { name: 'E8 Track $250K', size: 250000, daily_dd: 5, max_dd: 8, min_days: 5 },
    ],
    dd_type: 'static' as const,
  },
];

// =============================================================================
// ADD ACCOUNT PAGE
// =============================================================================

export default function AddAccountPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [selectedFirm, setSelectedFirm] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const isGuest = !user;
  const guestHasAccount = isGuest && hasGuestAccount();
  
  // TODO: Get actual account count from Supabase for logged-in users
  const currentAccountCount = isGuest ? (guestHasAccount ? 1 : 0) : 0;
  
  // TODO: Get actual plan from user profile
  const userPlan = getUserPlan(isGuest ? 'free' : 'free');
  const canAdd = canAddAccount(currentAccountCount, userPlan);

  // Check account limit on mount
  useEffect(() => {
    if (!authLoading && !canAdd) {
      setPaywallOpen(true);
    }
  }, [authLoading, canAdd]);

  // Get selected firm data
  const firmData = PROP_FIRMS.find(f => f.slug === selectedFirm);
  const programData = firmData?.programs.find(p => p.name === selectedProgram);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firmData || !programData) {
      setError('Veuillez sélectionner une prop firm et un programme');
      return;
    }

    // Check if user has reached account limit
    if (!canAdd) {
      setPaywallOpen(true);
      return;
    }

    // Check if guest already has an account
    if (isGuest && guestHasAccount) {
      setPaywallOpen(true);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isGuest) {
        // Save to localStorage for guests
        createGuestAccount({
          prop_firm: firmData.name,
          prop_firm_slug: firmData.slug,
          program: programData.name,
          account_size: programData.size,
          daily_dd_percent: programData.daily_dd,
          max_dd_percent: programData.max_dd,
          max_dd_type: firmData.dd_type,
          min_trading_days: programData.min_days,
        });
        
        router.push('/dashboard');
      } else {
        // TODO: Save to Supabase for logged-in users
        // const { error } = await supabase.from('user_accounts').insert({...})
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-emerald-400" />
            Ajouter un compte
          </h1>
          <p className="text-gray-500 mt-1">
            Sélectionnez votre prop firm et votre programme
          </p>
        </div>

        {/* Guest info */}
        {isGuest && !guestHasAccount && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white text-sm">Essai gratuit</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Votre premier compte est gratuit et sans inscription. Vos données seront stockées sur cet appareil.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pro upgrade hint */}
        {guestHasAccount && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white text-sm">Vous avez déjà 1 compte</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Passez à Pro pour tracker plusieurs comptes prop firm et accéder aux fonctionnalités avancées.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prop Firm Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prop Firm
            </label>
            <div className="relative">
              <select
                value={selectedFirm}
                onChange={(e) => {
                  setSelectedFirm(e.target.value);
                  setSelectedProgram('');
                }}
                className="w-full appearance-none bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Sélectionnez une prop firm</option>
                {PROP_FIRMS.map((firm) => (
                  <option key={firm.slug} value={firm.slug}>
                    {firm.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Program Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Programme
            </label>
            <div className="relative">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={!selectedFirm}
                className="w-full appearance-none bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Sélectionnez un programme</option>
                {firmData?.programs.map((program) => (
                  <option key={program.name} value={program.name}>
                    {program.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Program Info */}
          {programData && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-400 mb-3">Règles du programme</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Daily Drawdown</p>
                  <p className="text-white font-semibold">{programData.daily_dd}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Max Drawdown</p>
                  <p className="text-white font-semibold">{programData.max_dd}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jours minimum</p>
                  <p className="text-white font-semibold">{programData.min_days} jours</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type de DD</p>
                  <p className="text-white font-semibold capitalize">{firmData?.dd_type}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedFirm || !selectedProgram || isSubmitting}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Ajouter ce compte'
            )}
          </button>
        </form>

        {/* Note */}
        <div className="mt-6 flex items-start gap-2 text-xs text-gray-600">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Vous pourrez modifier les détails et le solde actuel depuis le dashboard.
          </p>
        </div>
      </div>

      {/* Paywall Modal for account limit */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => {
          setPaywallOpen(false);
          // If they can't add, redirect back to dashboard
          if (!canAdd) {
            router.push('/dashboard');
          }
        }}
        currentAccountCount={currentAccountCount}
        trigger="account_limit"
      />
    </div>
  );
}
