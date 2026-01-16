import { createClient } from '@/lib/supabase/server';
import { sendAlert, AlertType, AlertData } from '@/lib/email';

interface Account {
  id: string;
  user_id: string;
  account_name: string;
  firm_name: string;
  current_balance: number;
  initial_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string | null;
}

interface UserWithPreferences {
  email: string;
  full_name: string;
  preferences: {
    email_enabled: boolean;
    drawdown_warning: boolean;
    drawdown_warning_threshold: number;
    drawdown_critical: boolean;
    drawdown_critical_threshold: number;
    daily_loss_warning: boolean;
    daily_loss_threshold: number;
    profit_target: boolean;
    challenge_expiring: boolean;
    challenge_expiring_days: number;
  };
}

export async function checkAccountAlerts(account: Account) {
  const supabase = await createClient();
  
  // Get user preferences
  const { data: user } = await supabase
    .from('users')
    .select('email, raw_user_meta_data->full_name')
    .eq('id', account.user_id)
    .single();

  const { data: preferences } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', account.user_id)
    .single();

  if (!user?.email || !preferences?.email_enabled) {
    return;
  }

  // Check if we already sent this alert today
  const today = new Date().toISOString().split('T')[0];
  const { data: recentAlerts } = await supabase
    .from('alert_logs')
    .select('alert_type')
    .eq('user_id', account.user_id)
    .eq('account_name', account.account_name)
    .gte('sent_at', today);

  const sentAlertTypes = recentAlerts?.map(a => a.alert_type) || [];

  const alerts: { type: AlertType; data: AlertData }[] = [];

  // Calculate drawdown percentage
  const currentDrawdown = account.initial_balance - account.current_balance;
  const maxDrawdownAmount = account.initial_balance * (account.max_drawdown / 100);
  const drawdownPercentage = (currentDrawdown / maxDrawdownAmount) * 100;

  // Calculate daily loss percentage
  const dailyLossPercentage = (account.current_daily_loss / account.daily_loss_limit) * 100;

  // Calculate profit percentage
  const profit = account.current_balance - account.initial_balance;
  const profitTarget = account.initial_balance * (account.profit_target / 100);
  const profitPercentage = (profit / profitTarget) * 100;

  // Check drawdown critical (highest priority)
  if (
    preferences.drawdown_critical &&
    drawdownPercentage >= preferences.drawdown_critical_threshold &&
    !sentAlertTypes.includes('drawdown_critical')
  ) {
    alerts.push({
      type: 'drawdown_critical',
      data: {
        userName: user.full_name || 'Trader',
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
    drawdownPercentage < preferences.drawdown_critical_threshold &&
    !sentAlertTypes.includes('drawdown_warning')
  ) {
    alerts.push({
      type: 'drawdown_warning',
      data: {
        userName: user.full_name || 'Trader',
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
    dailyLossPercentage >= preferences.daily_loss_threshold &&
    !sentAlertTypes.includes('daily_loss_warning')
  ) {
    alerts.push({
      type: 'daily_loss_warning',
      data: {
        userName: user.full_name || 'Trader',
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
        userName: user.full_name || 'Trader',
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

    if (daysRemaining <= preferences.challenge_expiring_days && daysRemaining > 0) {
      alerts.push({
        type: 'challenge_expiring',
        data: {
          userName: user.full_name || 'Trader',
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
  for (const alert of alerts) {
    await sendAlert(alert.type, user.email, alert.data);
  }

  return alerts.length;
}

// Function to check all accounts (called by cron job)
export async function checkAllAccountsForAlerts() {
  const supabase = await createClient();
  
  const { data: accounts, error } = await supabase
    .from('challenge_accounts')
    .select('*');

  if (error || !accounts) {
    console.error('Error fetching accounts:', error);
    return;
  }

  let totalAlerts = 0;
  for (const account of accounts) {
    const alertsSent = await checkAccountAlerts(account);
    totalAlerts += alertsSent || 0;
  }

  console.log(`Alert check complete. ${totalAlerts} alerts sent.`);
  return totalAlerts;
}
