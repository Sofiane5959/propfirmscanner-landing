'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Loader2,
  Shield,
  ChevronLeft,
  Save,
  AlertTriangle,
} from 'lucide-react';

// 🔒 PROTECTION: Seuls ces emails peuvent voir cette page
const ALLOWED_EMAILS = ['brik.sofiane1991@gmail.com'];

interface AccountForm {
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string;
}

export default function EditAccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  
  const accountId = params.id as string;
  
  const [form, setForm] = useState<AccountForm>({
    account_name: '',
    firm_name: '',
    initial_balance: 0,
    current_balance: 0,
    max_drawdown: 10,
    daily_loss_limit: 5,
    profit_target: 10,
    current_daily_loss: 0,
    challenge_end_date: '',
  });
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch account
  useEffect(() => {
    const fetchAccount = async () => {
      if (!user || !accountId) return;
      
      try {
        const { data, error } = await supabase
          .from('challenge_accounts')
          .select('*')
          .eq('id', accountId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setForm({
            account_name: data.account_name || '',
            firm_name: data.firm_name || '',
            initial_balance: data.initial_balance || 0,
            current_balance: data.current_balance || 0,
            max_drawdown: data.max_drawdown || 10,
            daily_loss_limit: data.daily_loss_limit || 5,
            profit_target: data.profit_target || 10,
            current_daily_loss: data.current_daily_loss || 0,
            challenge_end_date: data.challenge_end_date ? data.challenge_end_date.split('T')[0] : '',
          });
        }
      } catch (error) {
        console.error('Error fetching account:', error);
        setError('Account not found');
      } finally {
        setLoadingAccount(false);
      }
    };

    if (user && accountId) {
      fetchAccount();
    }
  }, [user, accountId, supabase]);

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { error } = await supabase
        .from('challenge_accounts')
        .update({
          account_name: form.account_name,
          firm_name: form.firm_name,
          initial_balance: form.initial_balance,
          current_balance: form.current_balance,
          max_drawdown: form.max_drawdown,
          daily_loss_limit: form.daily_loss_limit,
          profit_target: form.profit_target,
          current_daily_loss: form.current_daily_loss,
          challenge_end_date: form.challenge_end_date || null,
        })
        .eq('id', accountId)
        .eq('user_id', user?.id);

      if (error) throw error;

      router.push('/dashboard/accounts');
    } catch (error: any) {
      console.error('Error updating account:', error);
      setError(error.message || 'Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (isLoading || loadingAccount) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // 🔒 PROTECTION: Vérifier si l'utilisateur est autorisé
  const isAllowed = ALLOWED_EMAILS.includes(user.email || '');
  
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Coming Soon</h1>
          <p className="text-gray-400 mb-6">
            Account editing is coming soon for Pro users.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'Account not found') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Not Found</h1>
          <p className="text-gray-400 mb-6">
            This account doesn't exist or you don't have access to it.
          </p>
          <Link
            href="/dashboard/accounts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Accounts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/accounts"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Accounts
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Edit Account
          </h1>
          <p className="text-gray-400 mt-1">
            Update your challenge account details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {error && error !== 'Account not found' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Account Info */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Account Name</label>
                <input
                  type="text"
                  value={form.account_name}
                  onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., FTMO Challenge #1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Firm Name</label>
                <input
                  type="text"
                  value={form.firm_name}
                  onChange={(e) => setForm({ ...form, firm_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., FTMO"
                  required
                />
              </div>
            </div>
          </div>

          {/* Balance Info */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Balance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Initial Balance ($)</label>
                <input
                  type="number"
                  value={form.initial_balance}
                  onChange={(e) => setForm({ ...form, initial_balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="100000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Balance ($)</label>
                <input
                  type="number"
                  value={form.current_balance}
                  onChange={(e) => setForm({ ...form, current_balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="102500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Challenge Rules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Drawdown (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.max_drawdown}
                  onChange={(e) => setForm({ ...form, max_drawdown: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Daily Loss Limit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.daily_loss_limit}
                  onChange={(e) => setForm({ ...form, daily_loss_limit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Profit Target (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.profit_target}
                  onChange={(e) => setForm({ ...form, profit_target: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Daily Status */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Daily Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Daily Loss ($)</label>
                <input
                  type="number"
                  value={form.current_daily_loss}
                  onChange={(e) => setForm({ ...form, current_daily_loss: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Challenge End Date</label>
                <input
                  type="date"
                  value={form.challenge_end_date}
                  onChange={(e) => setForm({ ...form, challenge_end_date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/dashboard/accounts"
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
