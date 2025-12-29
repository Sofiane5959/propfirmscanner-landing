'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Lock, Zap } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface UserLimits {
  plan: 'free' | 'pro';
  is_pro: boolean;
  pro_expires_at: string | null;
  accounts_count: number;
  accounts_limit: number;
  can_create_account: boolean;
  simulations_today: number;
  simulations_limit: number;
  can_simulate: boolean;
}

interface PaywallGuardProps {
  /** What action are we guarding? */
  action: 'create_account' | 'simulate';
  /** Current limits (fetched from server) */
  limits: UserLimits | null;
  /** Children to render if allowed */
  children: React.ReactNode;
  /** Optional: Custom blocked message */
  blockedMessage?: string;
}

// =============================================================================
// PAYWALL GUARD COMPONENT
// =============================================================================

/**
 * Wraps content that requires checking user limits.
 * Shows upgrade prompt if limit reached.
 */
export function PaywallGuard({ 
  action, 
  limits, 
  children, 
  blockedMessage 
}: PaywallGuardProps) {
  // Check if action is allowed
  const isAllowed = action === 'create_account' 
    ? limits?.can_create_account 
    : limits?.can_simulate;

  // If allowed, render children
  if (isAllowed) {
    return <>{children}</>;
  }

  // If limits not loaded yet, show loading state
  if (!limits) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Generate blocked message
  const getMessage = () => {
    if (blockedMessage) return blockedMessage;
    
    if (action === 'create_account') {
      return `You've reached your account limit (${limits.accounts_count}/${limits.accounts_limit}). Upgrade to Pro for unlimited accounts.`;
    }
    
    return `You've used all your daily simulations (${limits.simulations_today}/${limits.simulations_limit}). Upgrade to Pro for unlimited simulations.`;
  };

  // Show upgrade prompt
  return (
    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Limit Reached
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {getMessage()}
      </p>
      
      <Link
        href="/dashboard/upgrade"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all"
      >
        <Crown className="w-5 h-5" />
        Upgrade to Pro
      </Link>
    </div>
  );
}

// =============================================================================
// USAGE INDICATOR COMPONENT
// =============================================================================

interface UsageIndicatorProps {
  limits: UserLimits | null;
  showUpgradeLink?: boolean;
}

/**
 * Shows current usage status (accounts and simulations)
 */
export function UsageIndicator({ limits, showUpgradeLink = true }: UsageIndicatorProps) {
  if (!limits) return null;

  // Pro users don't need to see limits
  if (limits.is_pro) {
    return (
      <div className="flex items-center gap-2 text-emerald-400">
        <Crown className="w-4 h-4" />
        <span className="text-sm font-medium">Pro Plan</span>
      </div>
    );
  }

  const accountsPercent = limits.accounts_limit > 0 
    ? (limits.accounts_count / limits.accounts_limit) * 100 
    : 0;
    
  const simulationsPercent = limits.simulations_limit > 0 
    ? (limits.simulations_today / limits.simulations_limit) * 100 
    : 0;

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">Free Plan Limits</span>
        {showUpgradeLink && (
          <Link 
            href="/dashboard/upgrade"
            className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Upgrade
          </Link>
        )}
      </div>
      
      {/* Accounts */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Accounts</span>
          <span className="text-gray-400">
            {limits.accounts_count}/{limits.accounts_limit}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              accountsPercent >= 100 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, accountsPercent)}%` }}
          />
        </div>
      </div>
      
      {/* Simulations */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">Simulations today</span>
          <span className="text-gray-400">
            {limits.simulations_today}/{limits.simulations_limit}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${
              simulationsPercent >= 100 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, simulationsPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// PRO BADGE COMPONENT
// =============================================================================

interface ProBadgeProps {
  isPro: boolean;
  expiresAt?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Shows Pro status badge
 */
export function ProBadge({ isPro, expiresAt, size = 'md' }: ProBadgeProps) {
  if (!isPro) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  // Check if expiring soon (within 7 days)
  const isExpiringSoon = expiresAt && 
    new Date(expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeClasses[size]} ${
      isExpiringSoon 
        ? 'bg-yellow-500/20 text-yellow-400' 
        : 'bg-emerald-500/20 text-emerald-400'
    }`}>
      <Crown className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'} />
      PRO
      {isExpiringSoon && <span className="opacity-75">(expiring)</span>}
    </span>
  );
}

// =============================================================================
// HOOK: USE USER LIMITS
// =============================================================================

/**
 * Hook to fetch user limits from API
 */
export function useUserLimits() {
  const [limits, setLimits] = useState<UserLimits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLimits() {
      try {
        const res = await fetch('/api/user/limits');
        if (!res.ok) throw new Error('Failed to fetch limits');
        const data = await res.json();
        setLimits(data.limits);
      } catch (err) {
        setError('Could not load user limits');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLimits();
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/limits');
      if (!res.ok) throw new Error('Failed to fetch limits');
      const data = await res.json();
      setLimits(data.limits);
    } catch (err) {
      setError('Could not load user limits');
    } finally {
      setIsLoading(false);
    }
  };

  return { limits, isLoading, error, refresh };
}
