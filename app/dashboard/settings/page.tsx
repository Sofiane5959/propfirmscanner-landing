'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  User,
  Settings,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Calendar,
  Shield,
  Trash2,
} from 'lucide-react';
import NotificationSettings from '@/components/NotificationSettings';

export default function SettingsPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  // Save profile
  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
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

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Settings className="w-6 h-6 text-emerald-400" />
            Account Settings
          </h1>
          <p className="text-gray-400 mt-1">Manage your profile and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            Profile Information
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-400" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">Profile picture synced from Google</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 cursor-not-allowed"
                />
                {user.email_confirmed_at ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Unverified
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Email is managed by Google and cannot be changed here.</p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors font-medium"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Account Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-white">Member Since</p>
                  <p className="text-sm text-gray-500">
                    {new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-white">Account Plan</p>
                  <p className="text-sm text-gray-500">Free Plan</p>
                </div>
              </div>
              <Link
                href="/mypropfirm"
                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>

        {/* Notification Settings Component */}
        <div className="mb-6">
          <NotificationSettings />
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-sm">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
