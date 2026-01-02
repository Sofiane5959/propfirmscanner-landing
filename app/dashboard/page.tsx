'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Lib
import { getGuestAccount, hasGuestAccount } from '@/lib/guest-storage';
import { 
  calculateAccountHealth, 
  calculateDashboardStats, 
  getWarningsForAssistant,
  getPrimaryWarning,
  AccountWithHealth 
} from '@/lib/calculate-health';
import { DEMO_ACCOUNTS, DEMO_WARNINGS, DEMO_STATS, DEMO_GUIDANCE } from '@/lib/demo-data';

// Components
import { OverviewTiles } from '@/components/dashboard/OverviewTiles';
import { AccountCard } from '@/components/dashboard/AccountCard';
import { TodaysAssistant } from '@/components/dashboard/TodaysAssistant';
import { SimulateModal } from '@/components/dashboard/SimulateModal';
import { DemoBanner, DemoBadge } from '@/components/dashboard/DemoBadge';
import { DemoAccountCard } from '@/components/dashboard/DemoAccountCard';
import { DemoSimulateModal } from '@/components/dashboard/DemoSimulateModal';

// Icons
import { 
  Plus, 
  LayoutDashboard, 
  AlertCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type DashboardMode = 'loading' | 'demo' | 'guest' | 'authenticated';

// =============================================================================
// MAIN DASHBOARD PAGE
// =============================================================================

export default function DashboardPage() {
  const router = useRouter();
  
  // State
  const [mode, setMode] = useState<DashboardMode>('loading');
  const [accounts, setAccounts] = useState<AccountWithHealth[]>([]);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isDemoSimulateOpen, setIsDemoSimulateOpen] = useState(false);
  const [selectedAccountForSimulate, setSelectedAccountForSimulate] = useState<AccountWithHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ===================
  // LOAD DATA ON MOUNT
  // ===================
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Check for guest account first (works for all users)
      if (hasGuestAccount()) {
        const guestAccount = getGuestAccount();
        if (guestAccount) {
          // Transform guest account to account with health
          const accountWithHealth = calculateAccountHealth(guestAccount);
          setAccounts([accountWithHealth]);
          setMode('guest');
          return;
        }
      }

      // No guest account = Demo mode
      setMode('demo');
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setMode('demo'); // Fallback to demo on error
    }
  };

  // ===================
  // HANDLERS
  // ===================
  const handleAddAccount = () => {
    router.push('/dashboard/accounts/new');
  };

  const handleSimulate = (account: AccountWithHealth) => {
    setSelectedAccountForSimulate(account);
    setIsSimulateOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // ===================
  // COMPUTED VALUES
  // ===================
  const stats = mode === 'demo' 
    ? DEMO_STATS 
    : calculateDashboardStats(accounts);

  const warnings = mode === 'demo'
    ? DEMO_WARNINGS
    : getWarningsForAssistant(accounts);

  const primaryGuidance = mode === 'demo'
    ? DEMO_GUIDANCE.primary
    : accounts.length > 0 && accounts.some(a => a.health.status === 'danger')
      ? {
          title: `Stop trading ${accounts.find(a => a.health.status === 'danger')?.prop_firm} today`,
          subtitle: getPrimaryWarning(accounts.find(a => a.health.status === 'danger')!) || 'Critical risk level reached',
          type: 'danger' as const,
        }
      : accounts.length > 0 && accounts.some(a => a.health.status === 'warning')
        ? {
            title: `Caution with ${accounts.find(a => a.health.status === 'warning')?.prop_firm}`,
            subtitle: getPrimaryWarning(accounts.find(a => a.health.status === 'warning')!) || 'Elevated risk level',
            type: 'warning' as const,
          }
        : {
            title: 'All accounts healthy',
            subtitle: 'Your risk levels are within safe parameters. Trade confidently.',
            type: 'success' as const,
          };

  // ===================
  // LOADING STATE
  // ===================
  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ===================
  // RENDER
  // ===================
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">My Prop Firms</h1>
              {mode === 'demo' && <DemoBadge size="md" />}
            </div>
            
            <div className="flex items-center gap-3">
              {mode !== 'demo' && (
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              )}
              
              <Link
                href="/dashboard/accounts/new"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Account</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Demo Banner - only in demo mode */}
        {mode === 'demo' && (
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

            {/* Central Guidance Alert */}
            <CentralGuidance 
              guidance={primaryGuidance} 
              isDemo={mode === 'demo'} 
            />

            {/* Account Cards Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                {mode === 'demo' ? 'Demo Accounts' : 'Your Accounts'}
                {mode !== 'demo' && (
                  <span className="text-sm font-normal text-gray-500">
                    ({accounts.length} account{accounts.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {mode === 'demo' ? (
                  // DEMO MODE: Show demo accounts
                  DEMO_ACCOUNTS.map((account) => (
                    <DemoAccountCard
                      key={account.id}
                      account={account}
                      onTrySimulate={() => setIsDemoSimulateOpen(true)}
                    />
                  ))
                ) : (
                  // GUEST/AUTH MODE: Show real accounts
                  accounts.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      canSimulate={true}
                    />
                  ))
                )}
              </div>

              {/* Add More Accounts CTA */}
              <AddAccountCTA 
                mode={mode} 
                accountCount={accounts.length}
                onAddAccount={handleAddAccount} 
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <TodaysAssistant warnings={warnings} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {mode === 'demo' && (
        <DemoSimulateModal
          isOpen={isDemoSimulateOpen}
          onClose={() => setIsDemoSimulateOpen(false)}
          onAddRealAccount={handleAddAccount}
        />
      )}

      {mode !== 'demo' && selectedAccountForSimulate && (
        <SimulateModal
          isOpen={isSimulateOpen}
          onClose={() => {
            setIsSimulateOpen(false);
            setSelectedAccountForSimulate(null);
          }}
          account={selectedAccountForSimulate}
        />
      )}
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

interface CentralGuidanceProps {
  guidance: {
    title: string;
    subtitle: string;
    type: 'danger' | 'warning' | 'success' | 'info';
  };
  isDemo: boolean;
}

function CentralGuidance({ guidance, isDemo }: CentralGuidanceProps) {
  const styles = {
    danger: {
      bg: 'from-red-900/30 via-red-800/20 to-transparent',
      border: 'border-red-500/30',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
    },
    warning: {
      bg: 'from-yellow-900/30 via-yellow-800/20 to-transparent',
      border: 'border-yellow-500/30',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
    },
    success: {
      bg: 'from-emerald-900/30 via-emerald-800/20 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    info: {
      bg: 'from-blue-900/30 via-blue-800/20 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
  }[guidance.type];

  return (
    <div className={`bg-gradient-to-r ${styles.bg} border ${styles.border} rounded-xl p-5`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 ${styles.iconBg} rounded-xl flex-shrink-0`}>
          <AlertCircle className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">
              {guidance.title}
            </h3>
            {isDemo && <DemoBadge />}
          </div>
          <p className="text-gray-300">
            {guidance.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AddAccountCTAProps {
  mode: DashboardMode;
  accountCount: number;
  onAddAccount: () => void;
}

function AddAccountCTA({ mode, accountCount, onAddAccount }: AddAccountCTAProps) {
  // Different messaging based on mode
  const content = {
    demo: {
      title: 'Add your own account',
      description: 'Replace demo data with your real prop firm accounts for personalized risk tracking and trade simulation.',
      buttonText: 'Add My Prop Firm',
      showCard: true,
    },
    guest: {
      title: 'Track more accounts',
      description: 'Create a free account to track up to 3 prop firm challenges and sync across devices.',
      buttonText: 'Add Another Account',
      showCard: accountCount < 3,
    },
    authenticated: {
      title: 'Add another challenge',
      description: 'Track all your active prop firm challenges in one place.',
      buttonText: 'Add Account',
      showCard: true,
    },
    loading: {
      title: '',
      description: '',
      buttonText: '',
      showCard: false,
    },
  }[mode];

  if (!content.showCard) return null;

  return (
    <div className="mt-6 relative overflow-hidden rounded-xl border border-dashed border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 via-gray-900/50 to-emerald-900/20 p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>
      
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
          <Plus className="h-7 w-7 text-white" />
        </div>
        
        <h3 className="mb-2 text-xl font-semibold text-white">
          {content.title}
        </h3>
        <p className="mb-6 max-w-md text-gray-400">
          {content.description}
        </p>
        
        <button
          onClick={onAddAccount}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-xl"
        >
          <Sparkles className="h-5 w-5" />
          {content.buttonText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Guest limit info */}
        {mode === 'guest' && (
          <p className="mt-4 text-xs text-gray-500">
            Free accounts can track up to 3 challenges. 
            <Link href="/dashboard/upgrade" className="text-emerald-400 hover:underline ml-1">
              Upgrade for unlimited
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
