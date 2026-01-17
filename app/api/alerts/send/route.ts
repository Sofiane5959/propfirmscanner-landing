// CE FICHIER VA DANS: app/api/alerts/send/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendAlert, AlertType, AlertData } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, alertData } = body as { type: AlertType; alertData: AlertData };

    if (!type || !alertData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user's notification preferences
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Check if this alert type is enabled
    if (preferences) {
      const alertEnabled: Record<AlertType, boolean> = {
        drawdown_warning: preferences.drawdown_warning,
        drawdown_critical: preferences.drawdown_critical,
        profit_target_reached: preferences.profit_target,
        challenge_expiring: preferences.challenge_expiring,
        daily_loss_warning: preferences.daily_loss_warning,
      };

      if (!alertEnabled[type]) {
        return NextResponse.json({ 
          success: false, 
          message: 'Alert type disabled by user' 
        });
      }
    }

    // Send the alert
    const result = await sendAlert(type, user.email!, alertData);

    // Log the alert
    await supabase.from('alert_logs').insert({
      user_id: user.id,
      alert_type: type,
      account_name: alertData.accountName,
      sent_at: new Date().toISOString(),
      success: result.success,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Alert API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
