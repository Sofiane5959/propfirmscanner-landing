'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createGuestAccount, hasGuestAccount, getGuestAccount } from '@/lib/guest-storage';
import {
  ArrowLeft,
  Shield,
  ChevronDown,
  Loader2,
  Info,
  CheckCircle,
  AlertCircle,
  Sparkles,
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
      { name: 'Stellar $200K', size: 200000, daily_dd: 5, max_dd: 10, min_days: 5 },
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
      { name: 'Challenge $200K', size: 200000, daily_dd: 5, max_dd: 8, min_days: 5 },
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
  { 
    slug: 'topstep', 
    name: 'Topstep',
    programs: [
      { name: 'Trading Combine $50K', size: 50000, daily_dd: 2, max_dd: 3, min_days: 5 },
      { name: 'Trading Combine $100K', size: 100000, daily_dd: 2, max_dd: 3, min_days: 5 },
      { name: 'Trading Combine $150K', size: 150000, daily_dd: 2, max_dd: 3, min_days: 5 },
    ],
    dd_type: 'eod_trailing' as const,
  },
  { 
    slug: 'apex-trader', 
    name: 'Apex Trader Funding',
    programs: [
      { name: 'Rithmic $25K', size: 25000, daily_dd: 2.5, max_dd: 6, min_days: 7 },
      { name: 'Rithmic $50K', size: 50000, daily_dd: 2.5, max_dd: 6, min_days: 7 },
      { name: 'Rithmic $100K', size: 100000, daily_dd: 2.5, max_dd: 6, min_days: 7 },
      { name: 'Rithmic $250K', size: 250000, daily_dd: 2.5, max_dd: 6, min_days: 7 },
    ],
    dd_type: 'eod_trailing' as const,
  },
];

// =============================================================================
// ADD ACCOUNT PAGE
// =============================================================================

export default function AddAccountPage() {
  const router = useRouter();
  
  // State
  const [selectedFirm, setSelectedFirm] = useState<string>('ftmo'); // Default to FTMO
  const [selectedProgram, setSelectedProgram] = useState<string>('Challenge $50K'); // Default program
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [existingAccount, setExistingAccount] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing account on mount
  useEffect(() => {
    const checkExisting = () => {
      try {
        const hasAccount = hasGuestAccount();
        setExistingAccount(hasAccount);
      } catch (e) {
        console.error('Error checking guest account:', e);
      }
      setIsLoading(false);
    };
    
    // Small delay to ensure localStorage is available
    setTimeout(checkExisting, 100);
  }, []);

  // Get selected firm data
  const firmData = PROP_FIRMS.find(f => f.slug === selectedFirm);
  const programData = firmData?.programs.find(p => p.name === selectedProgram);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firmData || !programData) {
      setError('Please select a prop firm and program');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create guest account in localStorage
      const newAccount = createGuestAccount({
        prop_firm: firmData.name,
        prop_firm_slug: firmData.slug,
        program: programData.name,
        account_size: programData.size,
        daily_dd_percent: programData.daily_dd,
        max_dd_percent: programData.max_dd,
        max_dd_type: firmData.dd_type,
        min_trading_days: programData.min_days,
      });
      
      console.log('Account created:', newAccount);
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Error creating account:', err);
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
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
            Back to Dashboard
          </Link>
          
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-emerald-400" />
            {existingAccount ? 'Update Your Account' : 'Add Prop Firm Account'}
          </h1>
          <p className="text-gray-500 mt-1">
            {existingAccount 
              ? 'Change your tracked prop firm and program'
              : 'Select your prop firm and program to start tracking'
            }
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white text-sm">No signup required</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Start tracking your prop firm instantly. Your data will be stored locally on this device.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Account Warning */}
        {existingAccount && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white text-sm">You already have an account</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Adding a new account will replace your current one. Create a free account to track multiple prop firms.
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
                  // Auto-select first program of new firm
                  const newFirm = PROP_FIRMS.find(f => f.slug === e.target.value);
                  if (newFirm && newFirm.programs.length > 0) {
                    setSelectedProgram(newFirm.programs[0].name);
                  } else {
                    setSelectedProgram('');
                  }
                }}
                className="w-full appearance-none bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
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
              Program
            </label>
            <div className="relative">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full appearance-none bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
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
              <p className="text-sm font-medium text-gray-400 mb-3">Program Rules</p>
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
                  <p className="text-xs text-gray-500">Min Trading Days</p>
                  <p className="text-white font-semibold">{programData.min_days} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">DD Type</p>
                  <p className="text-white font-semibold capitalize">
                    {firmData?.dd_type === 'eod_trailing' ? 'EOD Trailing' : firmData?.dd_type}
                  </p>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {existingAccount ? 'Update My Account' : 'Start Tracking This Account'}
              </>
            )}
          </button>
        </form>

        {/* Note */}
        <div className="mt-6 flex items-start gap-2 text-xs text-gray-600">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            After adding your account, you can update your balance and daily P&L from the dashboard to get personalized risk analysis.
          </p>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-8 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Want to track multiple accounts?</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Create a free account to track up to 3 prop firms and sync across devices.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
