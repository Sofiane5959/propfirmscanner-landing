'use client';

import { useEffect, useState } from 'react';
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
  ChevronRight,
  Shield,
  BarChart3,
  Wallet,
  Loader2,
  LogOut,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (avoid hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not logged in (only after mounted and not loading)
  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router, mounted]);

  // Show loading while checking auth
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - will redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Quick stats (placeholder)
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

  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`p-4 rounded-xl border ${colorClasses[stat.color]}`}
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

        {/* Quick Actions */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-8">
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

        {/* Account Status */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Account Status
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Plan</p>
              <p className="font-semibold text-white">Free</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="font-semibold text-white">
                {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Upgrade</p>
              <Link href="/mypropfirm" className="font-semibold text-emerald-400 hover:text-emerald-300">
                Go Pro →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
