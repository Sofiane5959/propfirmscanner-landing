'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import {
  User,
  Star,
  Settings,
  TrendingUp,
  Target,
  Calendar,
  Bell,
  ChevronRight,
  Shield,
  BarChart3,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

// =============================================================================
// DASHBOARD PAGE
// =============================================================================

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Quick stats (placeholder - à connecter avec vraies données)
  const stats = [
    { label: 'Active Accounts', value: '0', icon: Shield, color: 'emerald' },
    { label: 'Total Invested', value: '$0', icon: Wallet, color: 'blue' },
    { label: 'Win Rate', value: '--%', icon: TrendingUp, color: 'purple' },
    { label: 'Days Trading', value: '0', icon: Calendar, color: 'orange' },
  ];

  // Quick actions
  const quickActions = [
    { name: 'Compare Prop Firms', href: '/compare', icon: BarChart3, description: 'Find the best prop firm for you' },
    { name: 'View Deals', href: '/deals', icon: Star, description: 'Get exclusive discounts' },
    { name: 'Read Blog', href: '/blog', icon: Target, description: 'Learn trading strategies' },
    { name: 'Account Settings', href: '/dashboard/settings', icon: Settings, description: 'Manage your profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-emerald-400" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {displayName}! 👋
              </h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            };
            return (
              <div
                key={stat.label}
                className={`p-4 rounded-xl border ${colorClasses[stat.color as keyof typeof colorClasses]}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{action.name}</p>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* My Prop Firm Accounts - Placeholder */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  My Prop Firm Accounts
                </h2>
                <Link href="/dashboard/accounts" className="text-sm text-emerald-400 hover:text-emerald-300">
                  View All
                </Link>
              </div>

              {/* Empty State */}
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No accounts yet</h3>
                <p className="text-gray-400 mb-4">
                  Start tracking your prop firm accounts to see your progress here.
                </p>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Find a Prop Firm
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Account Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Member since</span>
                  <span className="text-white text-sm">
                    {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email verified</span>
                  {user.email_confirmed_at ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link
                  href="/mypropfirm"
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all font-medium"
                >
                  Upgrade to Pro
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Unlock analytics, alerts & more
                </p>
              </div>
            </div>

            {/* Recent Activity - Placeholder */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Activity
              </h2>
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No recent activity</p>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                Notifications
              </h2>
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">You're all caught up!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
