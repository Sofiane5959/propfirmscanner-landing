/**
 * =============================================================================
 * QUICK ADD ACCOUNT API ROUTE
 * =============================================================================
 * 
 * POST /api/accounts/quick-add
 * Quickly adds a prop firm account with default values
 * 
 * @module app/api/accounts/quick-add/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface QuickAddRequest {
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  daily_dd_percent: number;
  max_dd_percent: number;
  is_trailing?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: QuickAddRequest = await request.json();
    const {
      prop_firm,
      prop_firm_slug,
      program,
      account_size,
      daily_dd_percent,
      max_dd_percent,
      is_trailing = false,
    } = body;

    // Validate required fields
    if (!prop_firm || !program || !account_size) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user can create account (paywall)
    const { data: canCreate } = await supabase
      .rpc('can_create_account', { p_user_id: user.id });

    if (!canCreate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account limit reached. Upgrade to Pro for unlimited accounts.',
          paywall: true 
        },
        { status: 403 }
      );
    }

    // Create the account with default values
    const { data: account, error: insertError } = await supabase
      .from('user_accounts')
      .insert({
        user_id: user.id,
        prop_firm,
        prop_firm_slug: prop_firm_slug || prop_firm.toLowerCase().replace(/\s+/g, '-'),
        program,
        account_size,
        start_balance: account_size,
        current_balance: account_size,
        today_pnl: 0,
        stage: 'Phase 1',
        daily_dd_percent: daily_dd_percent || 5,
        max_dd_percent: max_dd_percent || 10,
        max_dd_type: is_trailing ? 'trailing' : 'static',
        allows_news: true,
        allows_weekend: true,
        has_consistency: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: account,
      message: `${prop_firm} account added successfully!`,
    });

  } catch (error) {
    console.error('Quick add error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
