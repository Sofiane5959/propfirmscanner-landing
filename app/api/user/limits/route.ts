/**
 * =============================================================================
 * USER LIMITS API ROUTE
 * =============================================================================
 * 
 * GET /api/user/limits
 * Returns current user's plan and usage limits
 * 
 * @module app/api/user/limits/route.ts
 */

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user limits from database function
    const { data: limits, error: limitsError } = await supabase
      .rpc('get_user_limits', { p_user_id: user.id });
    
    if (limitsError) {
      console.error('Error fetching limits:', limitsError);
      return NextResponse.json(
        { error: 'Failed to fetch limits' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      limits,
    });
    
  } catch (error) {
    console.error('Limits API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
