// CE FICHIER VA DANS: app/api/alerts/test/route.ts

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendAlert } from '@/lib/email';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // Send a test email
    const result = await sendAlert('drawdown_warning', user.email!, {
      userName: profile?.full_name || user.user_metadata?.full_name || 'Trader',
      accountName: 'Test Account',
      firmName: 'FTMO (Test)',
      currentValue: 4000,
      limitValue: 5000,
      percentage: 80,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
