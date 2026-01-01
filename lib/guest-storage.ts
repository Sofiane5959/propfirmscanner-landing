// =============================================================================
// LOCAL STORAGE SERVICE - For guest users (1 free account)
// =============================================================================

const STORAGE_KEY = 'propfirmscanner_guest_account';

export interface GuestAccount {
  id: string;
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  start_balance: number;
  current_balance: number;
  today_pnl: number;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  min_trading_days: number;
  current_trading_days: number;
  created_at: string;
  updated_at: string;
}

// Get guest account from localStorage
export function getGuestAccount(): GuestAccount | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading guest account:', e);
    return null;
  }
}

// Save guest account to localStorage
export function saveGuestAccount(account: GuestAccount): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch (e) {
    console.error('Error saving guest account:', e);
  }
}

// Update guest account
export function updateGuestAccount(updates: Partial<GuestAccount>): GuestAccount | null {
  const current = getGuestAccount();
  if (!current) return null;
  
  const updated = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  saveGuestAccount(updated);
  return updated;
}

// Delete guest account
export function deleteGuestAccount(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Check if guest has an account
export function hasGuestAccount(): boolean {
  return getGuestAccount() !== null;
}

// Create a new guest account
export function createGuestAccount(data: {
  prop_firm: string;
  prop_firm_slug: string;
  program: string;
  account_size: number;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  min_trading_days: number;
}): GuestAccount {
  const account: GuestAccount = {
    id: 'guest-' + Date.now(),
    prop_firm: data.prop_firm,
    prop_firm_slug: data.prop_firm_slug,
    program: data.program,
    account_size: data.account_size,
    start_balance: data.account_size,
    current_balance: data.account_size,
    today_pnl: 0,
    daily_dd_percent: data.daily_dd_percent,
    max_dd_percent: data.max_dd_percent,
    max_dd_type: data.max_dd_type,
    min_trading_days: data.min_trading_days,
    current_trading_days: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  saveGuestAccount(account);
  return account;
}
