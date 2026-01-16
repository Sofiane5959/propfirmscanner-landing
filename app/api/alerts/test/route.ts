import { NextResponse } from 'next/server';
import { sendAlert } from '@/lib/email';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Send a test email
    const result = await sendAlert('drawdown_warning', user.email!, {
      userName: user.user_metadata?.full_name || 'Trader',
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
