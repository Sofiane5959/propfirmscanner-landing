/**
 * =============================================================================
 * TRADE SIMULATION API ROUTE
 * =============================================================================
 * 
 * Next.js API route for simulating trade risk.
 * 
 * POST /api/simulate
 * Body: { account_id: string, risk_usd: number }
 * 
 * @module app/api/simulate/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  simulateTrade, 
  calculateMaxSafeRisk,
  calculateMaxRiskBeforeViolation,
  type SimulationResult 
} from '@/lib/simulate';
import { 
  type AccountState, 
  type RuleSet,
  percentLimit,
  usdLimit,
} from '@/lib/risk';

// =============================================================================
// TYPES
// =============================================================================

interface SimulateRequestBody {
  account_id: string;
  risk_usd: number;
}

interface SimulateResponse {
  success: boolean;
  data?: {
    simulation: SimulationResult;
    account: {
      id: string;
      prop_firm: string;
      program: string;
      current_balance_usd: number;
    };
    recommendations: {
      max_safe_risk: number;
      max_risk_before_violation: number;
    };
  };
  error?: string;
}

// =============================================================================
// DATABASE TYPES (matches Supabase schema)
// =============================================================================

interface DbUserAccount {
  id: string;
  user_id: string;
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  start_balance: number;
  current_balance: number;
  current_equity?: number;
  today_pnl: number;
  daily_dd_percent: number;
  daily_dd_usd?: number;
  max_dd_percent: number;
  max_dd_usd?: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  trail_high_watermark?: number;
  basis: 'balance' | 'equity';
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Converts database account to AccountState
 */
function dbToAccountState(db: DbUserAccount): AccountState {
  return {
    start_balance_usd: db.start_balance,
    current_balance_usd: db.current_balance,
    current_equity_usd: db.current_equity,
    today_pnl_usd: db.today_pnl,
    trail_high_watermark_usd: db.trail_high_watermark,
  };
}

/**
 * Converts database account to RuleSet
 */
function dbToRuleSet(db: DbUserAccount): RuleSet {
  // Determine daily limit
  const daily_limit = db.daily_dd_usd !== undefined && db.daily_dd_usd > 0
    ? usdLimit(db.daily_dd_usd)
    : percentLimit(db.daily_dd_percent || 5);

  // Determine max limit
  const max_limit = db.max_dd_usd !== undefined && db.max_dd_usd > 0
    ? usdLimit(db.max_dd_usd)
    : percentLimit(db.max_dd_percent || 10);

  return {
    daily_limit,
    max_limit,
    basis: db.basis || 'balance',
    isTrailing: db.max_dd_type === 'trailing' || db.max_dd_type === 'eod_trailing',
  };
}

// =============================================================================
// API ROUTE HANDLER
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<SimulateResponse>> {
  try {
    // -------------------------------------------------------------------------
    // 1. Parse request body
    // -------------------------------------------------------------------------
    
    const body: SimulateRequestBody = await request.json();
    const { account_id, risk_usd } = body;

    // Validate inputs
    if (!account_id || typeof account_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid account_id' },
        { status: 400 }
      );
    }

    if (typeof risk_usd !== 'number' || !Number.isFinite(risk_usd)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid risk_usd' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // 2. Initialize Supabase client with auth
    // -------------------------------------------------------------------------
    
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // -------------------------------------------------------------------------
    // 3. Fetch account from database
    // -------------------------------------------------------------------------
    
    const { data: dbAccount, error: fetchError } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', account_id)
      .eq('user_id', user.id) // Ensure user owns this account
      .single();

    if (fetchError || !dbAccount) {
      return NextResponse.json(
        { success: false, error: 'Account not found' },
        { status: 404 }
      );
    }

    // -------------------------------------------------------------------------
    // 4. Convert to domain types
    // -------------------------------------------------------------------------
    
    const accountState = dbToAccountState(dbAccount as DbUserAccount);
    const ruleSet = dbToRuleSet(dbAccount as DbUserAccount);

    // -------------------------------------------------------------------------
    // 5. Run simulation
    // -------------------------------------------------------------------------
    
    const simulation = simulateTrade(accountState, ruleSet, risk_usd);
    const maxSafeRisk = calculateMaxSafeRisk(accountState, ruleSet);
    const maxRiskBeforeViolation = calculateMaxRiskBeforeViolation(accountState, ruleSet);

    // -------------------------------------------------------------------------
    // 6. Optionally log simulation (for analytics)
    // -------------------------------------------------------------------------
    
    // Fire and forget - don't await
    supabase
      .from('simulation_logs')
      .insert({
        user_id: user.id,
        account_id: account_id,
        risk_usd: risk_usd,
        classification: simulation.classification,
        daily_buffer_usd: simulation.metrics.daily_buffer_usd,
        max_buffer_usd: simulation.metrics.max_buffer_usd,
      })
      .then(() => {})
      .catch(() => {}); // Ignore errors

    // -------------------------------------------------------------------------
    // 7. Return response
    // -------------------------------------------------------------------------
    
    return NextResponse.json({
      success: true,
      data: {
        simulation,
        account: {
          id: dbAccount.id,
          prop_firm: dbAccount.prop_firm,
          program: dbAccount.program,
          current_balance_usd: dbAccount.current_balance,
        },
        recommendations: {
          max_safe_risk: maxSafeRisk,
          max_risk_before_violation: maxRiskBeforeViolation,
        },
      },
    });

  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// ALTERNATIVE: SERVER ACTION VERSION
// =============================================================================

/**
 * Server Action for trade simulation
 * Use this if you prefer Server Actions over API routes
 * 
 * Usage in component:
 * const result = await simulateTradeAction(accountId, riskUsd);
 */
/*
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function simulateTradeAction(
  accountId: string,
  riskUsd: number
): Promise<SimulateResponse> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { data: dbAccount } = await supabase
    .from('user_accounts')
    .select('*')
    .eq('id', accountId)
    .eq('user_id', user.id)
    .single();

  if (!dbAccount) {
    return { success: false, error: 'Account not found' };
  }

  const accountState = dbToAccountState(dbAccount);
  const ruleSet = dbToRuleSet(dbAccount);
  const simulation = simulateTrade(accountState, ruleSet, riskUsd);

  return {
    success: true,
    data: {
      simulation,
      account: {
        id: dbAccount.id,
        prop_firm: dbAccount.prop_firm,
        program: dbAccount.program,
        current_balance_usd: dbAccount.current_balance,
      },
      recommendations: {
        max_safe_risk: calculateMaxSafeRisk(accountState, ruleSet),
        max_risk_before_violation: calculateMaxRiskBeforeViolation(accountState, ruleSet),
      },
    },
  };
}
*/
