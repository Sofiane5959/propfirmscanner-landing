/**
 * =============================================================================
 * PAYWALL SERVER FUNCTIONS
 * =============================================================================
 * 
 * Server-side functions for managing user plans and usage limits.
 * 
 * @module lib/paywall
 */

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// =============================================================================
// TYPES
// =============================================================================

export type Plan = 'free' | 'pro';

export interface UserProfile {
  id: string;
  user_id: string;
  plan: Plan;
  pro_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyUsage {
  id: string;
  user_id: string;
  usage_date: string;
  simulations_count: number;
  accounts_created: number;
  created_at: string;
  updated_at: string;
}

export interface UserLimits {
  plan: Plan;
  is_pro: boolean;
  pro_expires_at: string | null;
  accounts_count: number;
  accounts_limit: number; // -1 = unlimited
  can_create_account: boolean;
  simulations_today: number;
  simulations_limit: number; // -1 = unlimited
  can_simulate: boolean;
}

export interface PaywallCheckResult {
  allowed: boolean;
  reason?: string;
  limits: UserLimits | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const FREE_LIMITS = {
  MAX_ACCOUNTS: 1,
  MAX_SIMULATIONS_PER_DAY: 3,
} as const;

// =============================================================================
// SERVER FUNCTIONS
// =============================================================================

/**
 * Get the current user's limits and plan status
 */
export async function getUserLimits(userId?: string): Promise<UserLimits | null> {
  const supabase = createServerComponentClient({ cookies });
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }
  
  // Call the database function
  const { data, error } = await supabase
    .rpc('get_user_limits', { p_user_id: userId });
  
  if (error) {
    console.error('Error getting user limits:', error);
    return null;
  }
  
  return data as UserLimits;
}

/**
 * Check if user can create a new account
 */
export async function canCreateAccount(userId?: string): Promise<PaywallCheckResult> {
  const supabase = createServerComponentClient({ cookies });
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { allowed: false, reason: 'Not authenticated', limits: null };
    }
    userId = user.id;
  }
  
  // Get limits
  const limits = await getUserLimits(userId);
  
  if (!limits) {
    return { allowed: false, reason: 'Could not fetch limits', limits: null };
  }
  
  if (!limits.can_create_account) {
    if (limits.is_pro) {
      return { allowed: false, reason: 'Error checking limits', limits };
    }
    return {
      allowed: false,
      reason: `Free plan limited to ${FREE_LIMITS.MAX_ACCOUNTS} account. Upgrade to Pro for unlimited accounts.`,
      limits,
    };
  }
  
  return { allowed: true, limits };
}

/**
 * Check if user can run a simulation
 */
export async function canSimulate(userId?: string): Promise<PaywallCheckResult> {
  const supabase = createServerComponentClient({ cookies });
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { allowed: false, reason: 'Not authenticated', limits: null };
    }
    userId = user.id;
  }
  
  // Get limits
  const limits = await getUserLimits(userId);
  
  if (!limits) {
    return { allowed: false, reason: 'Could not fetch limits', limits: null };
  }
  
  if (!limits.can_simulate) {
    return {
      allowed: false,
      reason: `Daily simulation limit reached (${FREE_LIMITS.MAX_SIMULATIONS_PER_DAY}/day). Upgrade to Pro for unlimited simulations.`,
      limits,
    };
  }
  
  return { allowed: true, limits };
}

/**
 * Increment simulation count for today
 */
export async function incrementSimulations(userId?: string): Promise<number> {
  const supabase = createServerComponentClient({ cookies });
  
  // Get user ID if not provided
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return -1;
    userId = user.id;
  }
  
  // Call the database function
  const { data, error } = await supabase
    .rpc('increment_simulations', { p_user_id: userId });
  
  if (error) {
    console.error('Error incrementing simulations:', error);
    return -1;
  }
  
  return data as number;
}

/**
 * Check if user is on Pro plan
 */
export async function isUserPro(userId?: string): Promise<boolean> {
  const limits = await getUserLimits(userId);
  return limits?.is_pro ?? false;
}

/**
 * Get user's current plan
 */
export async function getUserPlan(userId?: string): Promise<Plan> {
  const limits = await getUserLimits(userId);
  return limits?.plan ?? 'free';
}
