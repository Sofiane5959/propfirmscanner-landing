/**
 * =============================================================================
 * UPDATE ACCOUNT PNL API ROUTE
 * =============================================================================
 * 
 * POST /api/accounts/update-pnl
 * Updates today's P&L for an account
 * 
 * @module app/api/accounts/update-pnl/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface UpdatePnlRequest {
  account_id: string;
  today_pnl: number;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: UpdatePnlRequest = await request.json();
    const { account_id, today_pnl } = body;

    // Validate inputs
    if (!account_id || typeof account_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid account_id' },
        { status: 400 }
      );
    }

    if (typeof today_pnl !== 'number' || !Number.isFinite(today_pnl)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid today_pnl' },
        { status: 400 }
      );
    }

    // Update the account (only if user owns it)
    const { data: account, error: updateError } = await supabase
      .from('user_accounts')
      .update({
        today_pnl: today_pnl,
        current_balance: supabase.rpc('get_new_balance', {
          p_account_id: account_id,
          p_pnl_change: today_pnl
        }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', account_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      // If RPC doesn't exist, just update today_pnl
      const { data: simpleUpdate, error: simpleError } = await supabase
        .from('user_accounts')
        .update({
          today_pnl: today_pnl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', account_id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (simpleError) {
        console.error('Update error:', simpleError);
        return NextResponse.json(
          { success: false, error: 'Failed to update account' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: simpleUpdate,
      });
    }

    return NextResponse.json({
      success: true,
      data: account,
    });

  } catch (error) {
    console.error('Update PnL error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
