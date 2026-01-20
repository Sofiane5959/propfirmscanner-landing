'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  BarChart3,
  Tag,
  Star,
  Settings,
  Shield,
  User,
  Calendar,
  TrendingUp,
  Loader2,
  ChevronRight,
  ExternalLink,
  Crown,
  Sparkles,
  Plus,
  Bell,
  AlertTriangle,
  Target,
  Wallet,
} from 'lucide-react';
import AccountOverview from '@/components/AccountOverview';

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

interface DashboardStats {
  favorites: number;
  totalAccounts: number;
  totalProfit: number;
  activeAlerts: number;
}

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [stats, setStats] = useState<DashboardStats>({ 
    favorites: 0, 
    totalAccounts: 0,
    totalProfit: 0,
    activeAlerts: 0,
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

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
        
        // Calculate total profit
        const totalProfit = (data || []).reduce((sum, acc) => {
          return sum + (acc.current_balance - acc.initial_balance);
        }, 0);
        
        setStats(prev => ({
          ...prev,
          totalAccounts: data?.length || 0,
          totalProfit,
        }));
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

  // Fetch other stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // Get favorites count
        const { count: favCount } = await supabase
          .from('user_favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        // Get today's alerts count
        const today = new Date().toISOString().split('T')[0];
        const { count: alertCount } = await supabase
          .from('alert_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('sent_at', today);
        
        setStats(prev => ({
          ...prev,
          favorites: favCount || 0,
          activeAlerts: alertCount || 0,
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, supabase]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const memberSince = new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, {displayName}!</p>
          </div>
          <Link
            href="/dashboard/accounts/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-gray-400 text-sm">Total Profit</span>
            </div>
            <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {loadingStats ? '—' : `${stats.totalProfit >= 0 ? '+' : ''}$${stats.totalProfit.toLocaleString()}`}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-gray-400 text-sm">Active Accounts</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {loadingStats ? '—' : stats.totalAccounts}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-gray-400 text-sm">Favorites</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {loadingStats ? '—' : stats.favorites}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-gray-400 text-sm">Alerts Today</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {loadingStats ? '—' : stats.activeAlerts}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content - Accounts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Accounts Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">My Accounts</h2>
                <Link
                  href="/dashboard/accounts"
                  className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingAccounts ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No accounts yet</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Start tracking your prop firm challenges
                  </p>
                  <Link
                    href="/dashboard/accounts/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Account
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.slice(0, 2).map((account) => (
                    <AccountOverview key={account.id} account={account} />
                  ))}
                  {accounts.length > 2 && (
                    <Link
                      href="/dashboard/accounts"
                      className="block text-center py-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
                    >
                      View {accounts.length - 2} more accounts
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-4 mb-6">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-14 h-14 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-emerald-400" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white">{displayName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since
                  </span>
                  <span className="text-gray-300">{memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Plan
                  </span>
                  <span className="text-emerald-400">Free</span>
                </div>
              </div>

              <Link
                href="/dashboard/settings"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href="/compare"
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Compare Firms</span>
                </Link>
                <Link
                  href="/deals"
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Tag className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">View Deals</span>
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">My Favorites</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">Alert Settings</span>
                </Link>
              </div>
            </div>

            {/* Pro Banner */}
            <div className="bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold text-white">Upgrade to Pro</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Unlock advanced analytics, unlimited accounts, and priority alerts.
              </p>
              <Link
                href="/mypropfirm"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
