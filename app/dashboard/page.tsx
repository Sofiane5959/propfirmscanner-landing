'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { getGuestAccount, hasGuestAccount } from '@/lib/guest-storage';

// Components
import { OverviewTiles } from '@/components/dashboard/OverviewTiles';
import { AccountCard } from '@/components/dashboard/AccountCard';
import { TodaysAssistant } from '@/components/dashboard/TodaysAssistant';
import { DemoBanner, DemoBadge } from '@/components/dashboard/DemoBadge';
import { DemoAccountCard } from '@/components/dashboard/DemoAccountCard';
import { DemoSimulateModal } from '@/components/dashboard/DemoSimulateModal';

// Demo Data
import { DEMO_ACCOUNTS, DEMO_WARNINGS, DEMO_STATS, DEMO_GUIDANCE } from '@/lib/demo-data';

// Icons
import { 
  Plus, 
  LayoutDashboard, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// =============================================================================
// MAIN DASHBOARD PAGE
// =============================================================================

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  // Determine if we're showing demo data
  const isDemo = accounts.length === 0;

  // Load accounts (guest or authenticated)
  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      
      try {
        if (!user) {
          // Check for guest account
          if (hasGuestAccount()) {
            const guestAccount = getGuestAccount();
            if (guestAccount) {
              setAccounts([guestAccount]);
            }
          }
        } else {
          // Load from Supabase for authenticated users
          // TODO: Implement Supabase fetch
          const res = await fetch('/api/accounts');
          if (res.ok) {
            const data = await res.json();
            setAccounts(data.accounts || []);
          }
        }
      } catch (error) {
        console.error('Failed to load accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadAccounts();
    }
  }, [user, authLoading]);

  // Calculate stats from real accounts or use demo stats
  const stats = isDemo 
    ? DEMO_STATS 
    : {
        totalBalance: accounts.reduce((sum, a) => sum + (a.current_balance || 0), 0),
        todayPnl: accounts.reduce((sum, a) => sum + (a.today_pnl || 0), 0),
        accountsAtRisk: accounts.filter(a => a.health?.status !== 'safe').length,
        totalAccounts: accounts.length,
      };

  // Get warnings from real accounts or use demo warnings
  const warnings = isDemo 
    ? DEMO_WARNINGS 
    : accounts
        .filter(a => a.health?.messages?.length > 0)
        .map(a => ({
          accountId: a.id,
          propFirm: a.prop_firm,
          message: a.health.messages[0],
          status: a.health.status as 'warning' | 'danger',
        }));

  const handleAddAccount = () => {
    router.push('/dashboard/accounts/new');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">My Prop Firms</h1>
              {isDemo && <DemoBadge size="md" />}
            </div>
            
            <Link
              href="/dashboard/accounts/new"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Demo Banner */}
        {isDemo && (
          <DemoBanner onAddAccount={handleAddAccount} />
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Column */}
          <div className="flex-1 space-y-6">
            {/* Overview Tiles */}
            <OverviewTiles
              totalBalance={stats.totalBalance}
              todayPnl={stats.todayPnl}
              accountsAtRisk={stats.accountsAtRisk}
              totalAccounts={stats.totalAccounts}
            />

            {/* Central Guidance - Only in Demo Mode */}
            {isDemo && (
              <div className="bg-gradient-to-r from-red-900/30 via-red-800/20 to-transparent border border-red-500/30 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">
                        {DEMO_GUIDANCE.primary.title}
                      </h3>
                      <DemoBadge />
                    </div>
                    <p className="text-gray-300">
                      {DEMO_GUIDANCE.primary.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Cards */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                {isDemo ? 'Demo Accounts' : 'Your Accounts'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {isDemo ? (
                  // Show demo accounts
                  DEMO_ACCOUNTS.map((account) => (
                    <DemoAccountCard
                      key={account.id}
                      account={account}
                      onTrySimulate={() => setIsSimulateOpen(true)}
                    />
                  ))
                ) : (
                  // Show real accounts
                  accounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      canSimulate={true}
                    />
                  ))
                )}
              </div>

              {/* Add Account CTA - only in demo mode */}
              {isDemo && (
                <div className="mt-6 relative overflow-hidden rounded-xl border border-dashed border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 via-gray-900/50 to-emerald-900/20 p-8">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
                  </div>
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      Add your own account
                    </h3>
                    <p className="mb-6 max-w-md text-gray-400">
                      Replace demo data with your real prop firm accounts for personalized 
                      risk tracking and trade simulation.
                    </p>
                    
                    <button
                      onClick={handleAddAccount}
                      className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-xl"
                    >
                      <Sparkles className="h-5 w-5" />
                      Add My Prop Firm
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <TodaysAssistant warnings={warnings} />
          </div>
        </div>
      </div>

      {/* Demo Simulate Modal */}
      <DemoSimulateModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onAddRealAccount={handleAddAccount}
      />
    </div>
  );
}
