// CE FICHIER VA DANS: app/api/cron/check-alerts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { checkAllAccountsForAlerts } from '@/lib/alertChecker';

// This endpoint should be called by a cron job
// Vercel Cron: configured in vercel.json
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const alertsSent = await checkAllAccountsForAlerts();
    
    return NextResponse.json({ 
      success: true, 
      alertsSent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
