// CE FICHIER VA DANS: app/api/cron/check-alerts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendAlert, AlertType, AlertData } from '@/lib/email';

// Create admin client lazily (not at build time)
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

async function checkAllAccountsForAlerts() {
  const supabaseAdmin = getSupabaseAdmin();
  
  // Get all accounts with user preferences
  const { data: accounts, error } = await supabaseAdmin
    .from('challenge_accounts')
    .select('*');

  if (error || !accounts) {
    console.error('Error fetching accounts:', error);
    return 0;
  }

  let totalAlerts = 0;

  for (const account of accounts) {
    const alertsSent = await checkAccountAlerts(account);
    totalAlerts += alertsSent;
  }

  console.log(`Alert check complete. ${totalAlerts} alerts sent.`);
  return totalAlerts;
}

async function checkAccountAlerts(account: any) {
  const supabaseAdmin = getSupabaseAdmin();
  
  // Get user info
  const { data: userData } = await supabaseAdmin
    .from('profiles')
    .select('email, full_name')
    .eq('id', account.user_id)
    .single();

  // Get user preferences
  const { data: preferences } = await supabaseAdmin
    .from('notification_preferences')
    .select('*')
    .eq('user_id', account.user_id)
    .single();

  if (!userData?.email || !preferences?.email_enabled) {
    return 0;
  }

  // Check if we already sent this alert today
  const today = new Date().toISOString().split('T')[0];
  const { data: recentAlerts } = await supabaseAdmin
    .from('alert_logs')
    .select('alert_type')
    .eq('user_id', account.user_id)
    .eq('account_name', account.account_name)
    .gte('sent_at', today);

  const sentAlertTypes = recentAlerts?.map((a: any) => a.alert_type) || [];

  const alerts: { type: AlertType; data: AlertData }[] = [];

  // Calculate drawdown percentage
  const currentDrawdown = account.initial_balance - account.current_balance;
  const maxDrawdownAmount = account.initial_balance * (account.max_drawdown / 100);
  const drawdownPercentage = maxDrawdownAmount > 0 ? (currentDrawdown / maxDrawdownAmount) * 100 : 0;

  // Calculate daily loss percentage
  const dailyLossPercentage = account.daily_loss_limit > 0 
    ? (account.current_daily_loss / account.daily_loss_limit) * 100 
    : 0;

  // Calculate profit percentage
  const profit = account.current_balance - account.initial_balance;
  const profitTarget = account.initial_balance * (account.profit_target / 100);
  const profitPercentage = profitTarget > 0 ? (profit / profitTarget) * 100 : 0;

  // Check drawdown critical (highest priority)
  if (
    preferences.drawdown_critical &&
    drawdownPercentage >= preferences.drawdown_critical_threshold &&
    !sentAlertTypes.includes('drawdown_critical')
  ) {
    alerts.push({
      type: 'drawdown_critical',
      data: {
        userName: userData.full_name || 'Trader',
        accountName: account.account_name,
        firmName: account.firm_name,
        currentValue: currentDrawdown,
        limitValue: maxDrawdownAmount,
        percentage: drawdownPercentage,
      },
    });
  }
  // Check drawdown warning
  else if (
    preferences.drawdown_warning &&
    drawdownPercentage >= preferences.drawdown_warning_threshold &&
    drawdownPercentage < (preferences.drawdown_critical_threshold || 95) &&
    !sentAlertTypes.includes('drawdown_warning')
  ) {
    alerts.push({
      type: 'drawdown_warning',
      data: {
        userName: userData.full_name || 'Trader',
        accountName: account.account_name,
        firmName: account.firm_name,
        currentValue: currentDrawdown,
        limitValue: maxDrawdownAmount,
        percentage: drawdownPercentage,
      },
    });
  }

  // Check daily loss warning
  if (
    preferences.daily_loss_warning &&
    dailyLossPercentage >= (preferences.daily_loss_threshold || 80) &&
    !sentAlertTypes.includes('daily_loss_warning')
  ) {
    alerts.push({
      type: 'daily_loss_warning',
      data: {
        userName: userData.full_name || 'Trader',
        accountName: account.account_name,
        firmName: account.firm_name,
        currentValue: account.current_daily_loss,
        limitValue: account.daily_loss_limit,
        percentage: dailyLossPercentage,
      },
    });
  }

  // Check profit target
  if (
    preferences.profit_target &&
    profitPercentage >= 100 &&
    !sentAlertTypes.includes('profit_target_reached')
  ) {
    alerts.push({
      type: 'profit_target_reached',
      data: {
        userName: userData.full_name || 'Trader',
        accountName: account.account_name,
        firmName: account.firm_name,
        currentValue: profit,
        limitValue: profitTarget,
        percentage: profitPercentage,
      },
    });
  }

  // Check challenge expiring
  if (
    preferences.challenge_expiring &&
    account.challenge_end_date &&
    !sentAlertTypes.includes('challenge_expiring')
  ) {
    const endDate = new Date(account.challenge_end_date);
    const now = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= (preferences.challenge_expiring_days || 7) && daysRemaining > 0) {
      alerts.push({
        type: 'challenge_expiring',
        data: {
          userName: userData.full_name || 'Trader',
          accountName: account.account_name,
          firmName: account.firm_name,
          currentValue: profit,
          limitValue: profitTarget,
          percentage: profitPercentage,
          daysRemaining,
        },
      });
    }
  }

  // Send all alerts
  let sentCount = 0;
  for (const alert of alerts) {
    const result = await sendAlert(alert.type, userData.email, alert.data);
    
    // Log the alert
    await supabaseAdmin.from('alert_logs').insert({
      user_id: account.user_id,
      alert_type: alert.type,
      account_name: account.account_name,
      sent_at: new Date().toISOString(),
      success: result.success,
    });

    if (result.success) sentCount++;
  }

  return sentCount;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
