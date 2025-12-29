/**
 * =============================================================================
 * PRO CODE REDEMPTION - SERVER ACTIONS
 * =============================================================================
 * 
 * Server actions for upgrading to Pro plan using access codes.
 * 
 * @module lib/actions/redeem-code
 */

'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// =============================================================================
// TYPES
// =============================================================================

interface RedeemResult {
  success: boolean;
  message: string;
  plan?: 'free' | 'pro';
  expires_at?: string | null;
}

// =============================================================================
// ENVIRONMENT CODES
// =============================================================================

/**
 * Check if code matches environment variable
 * Add PRO_ACCESS_CODE to your .env.local and Vercel env vars
 */
function isValidEnvCode(code: string): { valid: boolean; duration: number | null } {
  const envCode = process.env.PRO_ACCESS_CODE;
  const lifetimeCode = process.env.PRO_LIFETIME_CODE;
  const yearlyCode = process.env.PRO_YEARLY_CODE;
  
  // Check lifetime code first
  if (lifetimeCode && code.toUpperCase() === lifetimeCode.toUpperCase()) {
    return { valid: true, duration: null }; // null = lifetime
  }
  
  // Check yearly code
  if (yearlyCode && code.toUpperCase() === yearlyCode.toUpperCase()) {
    return { valid: true, duration: 365 };
  }
  
  // Check monthly code (default)
  if (envCode && code.toUpperCase() === envCode.toUpperCase()) {
    return { valid: true, duration: 30 };
  }
  
  return { valid: false, duration: 0 };
}

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Redeem a pro access code
 */
export async function redeemProCode(code: string): Promise<RedeemResult> {
  const supabase = createServerActionClient({ cookies });
  
  // -------------------------------------------------------------------------
  // 1. Validate input
  // -------------------------------------------------------------------------
  
  if (!code || typeof code !== 'string') {
    return { success: false, message: 'Please enter a code.' };
  }
  
  const trimmedCode = code.trim().toUpperCase();
  
  if (trimmedCode.length < 4) {
    return { success: false, message: 'Invalid code format.' };
  }
  
  // -------------------------------------------------------------------------
  // 2. Get authenticated user
  // -------------------------------------------------------------------------
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, message: 'You must be logged in to redeem a code.' };
  }
  
  // -------------------------------------------------------------------------
  // 3. Check if already pro
  // -------------------------------------------------------------------------
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('plan, pro_expires_at')
    .eq('user_id', user.id)
    .single();
  
  if (profile?.plan === 'pro') {
    const expiresAt = profile.pro_expires_at;
    if (!expiresAt) {
      return { 
        success: false, 
        message: 'You already have lifetime Pro access!' 
      };
    }
    
    const expiryDate = new Date(expiresAt);
    if (expiryDate > new Date()) {
      return { 
        success: false, 
        message: `You're already Pro! Your plan expires on ${expiryDate.toLocaleDateString()}.` 
      };
    }
  }
  
  // -------------------------------------------------------------------------
  // 4. Check if code was already used by this user
  // -------------------------------------------------------------------------
  
  const { data: existingRedemption } = await supabase
    .from('code_redemptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('code', trimmedCode)
    .single();
  
  if (existingRedemption) {
    return { success: false, message: 'You have already used this code.' };
  }
  
  // -------------------------------------------------------------------------
  // 5. Validate code (check env vars first, then database)
  // -------------------------------------------------------------------------
  
  let duration: number | null = 30;
  let codeSource: 'env' | 'db' = 'env';
  
  // Check environment codes first
  const envCheck = isValidEnvCode(trimmedCode);
  
  if (envCheck.valid) {
    duration = envCheck.duration;
    codeSource = 'env';
  } else {
    // Check database codes
    const { data: dbCode } = await supabase
      .from('pro_codes')
      .select('*')
      .eq('code', trimmedCode)
      .eq('is_active', true)
      .single();
    
    if (!dbCode) {
      return { success: false, message: 'Invalid or expired code.' };
    }
    
    // Check if code has uses remaining
    if (dbCode.max_uses && dbCode.current_uses >= dbCode.max_uses) {
      return { success: false, message: 'This code has reached its usage limit.' };
    }
    
    // Check if code is expired
    if (dbCode.expires_at && new Date(dbCode.expires_at) < new Date()) {
      return { success: false, message: 'This code has expired.' };
    }
    
    duration = dbCode.duration_days;
    codeSource = 'db';
    
    // Increment code usage
    await supabase
      .from('pro_codes')
      .update({ current_uses: dbCode.current_uses + 1 })
      .eq('id', dbCode.id);
  }
  
  // -------------------------------------------------------------------------
  // 6. Upgrade user to Pro
  // -------------------------------------------------------------------------
  
  const { data: updatedProfile, error: upgradeError } = await supabase
    .rpc('upgrade_to_pro', { 
      p_user_id: user.id, 
      p_duration_days: duration 
    });
  
  if (upgradeError) {
    console.error('Upgrade error:', upgradeError);
    return { success: false, message: 'Failed to upgrade. Please try again.' };
  }
  
  // -------------------------------------------------------------------------
  // 7. Record redemption
  // -------------------------------------------------------------------------
  
  await supabase
    .from('code_redemptions')
    .insert({
      user_id: user.id,
      code: trimmedCode,
    });
  
  // -------------------------------------------------------------------------
  // 8. Revalidate pages
  // -------------------------------------------------------------------------
  
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/upgrade');
  
  // -------------------------------------------------------------------------
  // 9. Return success
  // -------------------------------------------------------------------------
  
  const expiresAt = updatedProfile?.pro_expires_at;
  let successMessage = '🎉 Welcome to Pro!';
  
  if (!expiresAt) {
    successMessage = '🎉 Welcome to Pro! You have lifetime access.';
  } else {
    const expiryDate = new Date(expiresAt);
    successMessage = `🎉 Welcome to Pro! Your plan is active until ${expiryDate.toLocaleDateString()}.`;
  }
  
  return {
    success: true,
    message: successMessage,
    plan: 'pro',
    expires_at: expiresAt,
  };
}

/**
 * Check current user's plan status
 */
export async function checkPlanStatus(): Promise<{
  plan: 'free' | 'pro';
  expires_at: string | null;
  is_active: boolean;
}> {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { plan: 'free', expires_at: null, is_active: false };
  }
  
  const { data: limits } = await supabase
    .rpc('get_user_limits', { p_user_id: user.id });
  
  if (!limits) {
    return { plan: 'free', expires_at: null, is_active: false };
  }
  
  return {
    plan: limits.plan,
    expires_at: limits.pro_expires_at,
    is_active: limits.is_pro,
  };
}
