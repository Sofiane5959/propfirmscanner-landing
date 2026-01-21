'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Plus,
  Loader2,
  Shield,
  ChevronLeft,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MoreVertical,
  X,
} from 'lucide-react';

// 🔒 PROTECTION: Seuls ces emails peuvent voir cette page
const ALLOWED_EMAILS = ['brik.sofiane1991@gmail.com'];

interface Account {
  id: string;
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string | null;
  created_at: string;
}

export default function AccountsListPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('challenge_accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user, supabase]);

  // Delete account
  const handleDelete = async () => {
    if (!accountToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('challenge_accounts')
        .delete()
        .eq('id', accountToDelete.id);
      
      if (error) throw error;
      
      // Remove from local state
      setAccounts(accounts.filter(a => a.id !== accountToDelete.id));
      setDeleteModalOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
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
            Advanced account management is coming soon for Pro users.
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

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              My Accounts
            </h1>
            <p className="text-gray-400 mt-1">
              Manage all your prop firm challenge accounts
            </p>
          </div>
          <Link
            href="/dashboard/accounts/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Link>
        </div>

        {/* Accounts List */}
        {loadingAccounts ? (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-12 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No accounts yet</h2>
            <p className="text-gray-400 mb-6">
              Start tracking your prop firm challenges by adding your first account.
            </p>
            <Link
              href="/dashboard/accounts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Account
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-gray-400 font-medium">Account</th>
                  <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Firm</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Balance</th>
                  <th className="text-right p-4 text-gray-400 font-medium hidden sm:table-cell">P/L</th>
                  <th className="text-right p-4 text-gray-400 font-medium hidden lg:table-cell">Drawdown</th>
                  <th className="text-center p-4 text-gray-400 font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const profit = account.current_balance - account.initial_balance;
                  const profitPercent = (profit / account.initial_balance) * 100;
                  const isProfit = profit >= 0;
                  
                  const maxDrawdownAmount = account.initial_balance * (account.max_drawdown / 100);
                  const currentDrawdown = Math.max(0, account.initial_balance - account.current_balance);
                  const drawdownPercent = maxDrawdownAmount > 0 ? (currentDrawdown / maxDrawdownAmount) * 100 : 0;
                  
                  return (
                    <tr key={account.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{account.account_name}</p>
                          <p className="text-sm text-gray-500 md:hidden">{account.firm_name}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-gray-300">{account.firm_name}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-medium text-white">
                          ${account.current_balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right hidden sm:table-cell">
                        <div className={`flex items-center justify-end gap-1 ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="font-medium">
                            {isProfit ? '+' : ''}{profitPercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right hidden lg:table-cell">
                        <div className={`flex items-center justify-end gap-1 ${
                          drawdownPercent >= 80 ? 'text-red-500' : 
                          drawdownPercent >= 50 ? 'text-yellow-500' : 'text-gray-400'
                        }`}>
                          {drawdownPercent >= 80 && <AlertTriangle className="w-4 h-4" />}
                          <span>{drawdownPercent.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="relative flex justify-center">
                          <button
                            onClick={() => setMenuOpen(menuOpen === account.id ? null : account.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          
                          {menuOpen === account.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setMenuOpen(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                                <Link
                                  href={`/dashboard/accounts/${account.id}/edit`}
                                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                                  onClick={() => setMenuOpen(null)}
                                >
                                  <Pencil className="w-4 h-4" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => {
                                    setAccountToDelete(account);
                                    setDeleteModalOpen(true);
                                    setMenuOpen(null);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors w-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats Summary */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">Total Accounts</p>
              <p className="text-2xl font-bold text-white">{accounts.length}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                ${accounts.reduce((sum, a) => sum + a.current_balance, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">Total P/L</p>
              {(() => {
                const totalPL = accounts.reduce((sum, a) => sum + (a.current_balance - a.initial_balance), 0);
                return (
                  <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString()}
                  </p>
                );
              })()}
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <p className="text-gray-400 text-sm">Avg. P/L %</p>
              {(() => {
                const avgPL = accounts.reduce((sum, a) => {
                  return sum + ((a.current_balance - a.initial_balance) / a.initial_balance * 100);
                }, 0) / accounts.length;
                return (
                  <p className={`text-2xl font-bold ${avgPL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {avgPL >= 0 ? '+' : ''}{avgPL.toFixed(1)}%
                  </p>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Account</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete <strong className="text-white">{accountToDelete.account_name}</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
