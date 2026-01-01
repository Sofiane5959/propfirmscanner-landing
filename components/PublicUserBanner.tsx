'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  User, 
  Shield, 
  Cloud, 
  Smartphone,
  ArrowRight,
  Info,
} from 'lucide-react';

// =============================================================================
// PUBLIC USER BANNER - Shows limitations for anonymous users
// =============================================================================

interface PublicUserBannerProps {
  onSignupClick: () => void;
  variant?: 'compact' | 'full';
}

export function PublicUserBanner({ onSignupClick, variant = 'compact' }: PublicUserBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed && variant === 'compact') return null;

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-white">
                You're tracking <span className="font-semibold">1 prop firm</span> as a guest.
              </p>
              <p className="text-xs text-gray-400">
                Create a free account to track more and save your data.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSignupClick}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant - for empty state or prominent placement
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          You're using PropFirmScanner as a guest
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Your data is stored locally on this device. Create a free account to unlock more features.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <Cloud className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-white">Sync Across Devices</p>
          <p className="text-xs text-gray-500 mt-1">Access your data anywhere</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-white">Save Your Progress</p>
          <p className="text-xs text-gray-500 mt-1">Never lose your tracking data</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <Smartphone className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-white">Track More Accounts</p>
          <p className="text-xs text-gray-500 mt-1">Upgrade to Pro for unlimited</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onSignupClick}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          Create Free Account
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-600 mt-4">
        Free forever • No credit card required
      </p>
    </div>
  );
}

// =============================================================================
// SESSION INFO - Small indicator showing session status
// =============================================================================

interface SessionIndicatorProps {
  isLoggedIn: boolean;
  onLoginClick?: () => void;
}

export function SessionIndicator({ isLoggedIn, onLoginClick }: SessionIndicatorProps) {
  if (isLoggedIn) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2">
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      <span>Guest session — data stored locally</span>
      {onLoginClick && (
        <button 
          onClick={onLoginClick}
          className="text-emerald-400 hover:text-emerald-300 font-medium ml-2"
        >
          Sign in
        </button>
      )}
    </div>
  );
}

// =============================================================================
// SIGNUP PROMPT MODAL - When user tries to add 2nd account
// =============================================================================

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
  reason: 'second_account' | 'save_data' | 'general';
}

export function SignupPromptModal({ isOpen, onClose, onSignup, reason }: SignupPromptModalProps) {
  if (!isOpen) return null;

  const content = {
    second_account: {
      title: 'Track Multiple Prop Firms',
      description: 'Create a free account to add more prop firm accounts and keep your data synced.',
      highlight: 'Your existing account data will be preserved.',
    },
    save_data: {
      title: 'Save Your Progress',
      description: 'Your tracking data is currently stored only on this device. Create an account to save it permanently.',
      highlight: 'Access your data from any device.',
    },
    general: {
      title: 'Get the Full Experience',
      description: 'Create a free account to unlock all features and save your tracking data.',
      highlight: 'Free forever, no credit card required.',
    },
  };

  const { title, description, highlight } = content[reason];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-400 text-center">{highlight}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSignup}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            Continue as guest
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Already have an account?{' '}
          <button onClick={onSignup} className="text-emerald-400 hover:text-emerald-300">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
