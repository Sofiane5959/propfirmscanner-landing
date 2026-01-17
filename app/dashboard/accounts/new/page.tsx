'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/providers/AuthProvider';
import {
  ArrowLeft,
  Loader2,
  Target,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  CheckCircle,
} from 'lucide-react';

const POPULAR_FIRMS = [
  'FTMO',
  'Funded Next',
  'The Funded Trader',
  'True Forex Funds',
  'MyForexFunds',
  'E8 Funding',
  'Fidelcrest',
  'TopStep',
  'Apex Trader Funding',
  'Other',
];

export default function NewAccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    account_name: '',
    firm_name: '',
    custom_firm: '',
    initial_balance: '',
    current_balance: '',
    max_drawdown: '10',
    daily_loss_limit: '',
    profit_target: '10',
    challenge_end_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-fill current balance when initial is entered
    if (name === 'initial_balance' && !formData.current_balance) {
      setFormData(prev => ({ ...prev, current_balance: value }));
    }

    // Auto-calculate daily loss limit (usually 5% of initial)
    if (name === 'initial_balance' && value) {
      const dailyLimit = parseFloat(value) * 0.05;
      setFormData(prev => ({ ...prev, daily_loss_limit: dailyLimit.toString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const firmName = formData.firm_name === 'Other' ? formData.custom_firm : formData.firm_name;

      if (!firmName) {
        throw new Error('Please select or enter a firm name');
      }

      const { error: insertError } = await supabase.from('challenge_accounts').insert({
        user_id: user.id,
        account_name: formData.account_name,
        firm_name: firmName,
        initial_balance: parseFloat(formData.initial_balance),
        current_balance: parseFloat(formData.current_balance),
        max_drawdown: parseFloat(formData.max_drawdown),
        daily_loss_limit: parseFloat(formData.daily_loss_limit) || 0,
        profit_target: parseFloat(formData.profit_target),
        current_daily_loss: 0,
        challenge_end_date: formData.challenge_end_date || null,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error adding account:', err);
      setError(err.message || 'Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Added!</h1>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Add New Challenge Account
          </h1>
          <p className="text-gray-400 mt-1">Track your prop firm challenge progress</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Name */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Account Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  placeholder="e.g., FTMO 100k Phase 1"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prop Firm *
                </label>
                <select
                  name="firm_name"
                  value={formData.firm_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">Select a firm...</option>
                  {POPULAR_FIRMS.map(firm => (
                    <option key={firm} value={firm}>{firm}</option>
                  ))}
                </select>
              </div>

              {formData.firm_name === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Firm Name *
                  </label>
                  <input
                    type="text"
                    name="custom_firm"
                    value={formData.custom_firm}
                    onChange={handleChange}
                    placeholder="Enter firm name"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Balance & Targets */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Balance & Targets
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initial Balance ($) *
                </label>
                <input
                  type="number"
                  name="initial_balance"
                  value={formData.initial_balance}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Balance ($) *
                </label>
                <input
                  type="number"
                  name="current_balance"
                  value={formData.current_balance}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              Challenge Rules
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Drawdown (%)
                </label>
                <input
                  type="number"
                  name="max_drawdown"
                  value={formData.max_drawdown}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Daily Loss Limit ($)
                </label>
                <input
                  type="number"
                  name="daily_loss_limit"
                  value={formData.daily_loss_limit}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profit Target (%)
                </label>
                <input
                  type="number"
                  name="profit_target"
                  value={formData.profit_target}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Challenge Duration
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Challenge End Date (optional)
              </label>
              <input
                type="date"
                name="challenge_end_date"
                value={formData.challenge_end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                Leave empty if there's no time limit
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  Add Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
