'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Crown, Check, Zap, Shield, TrendingUp, ArrowLeft, Loader2, Gift } from 'lucide-react';
import { redeemProCode } from '@/lib/actions/redeem-code';

// =============================================================================
// PLAN FEATURES
// =============================================================================

const FREE_FEATURES = [
  'Track 1 prop firm account',
  '3 trade simulations per day',
  'Basic risk calculations',
  'Rules & hidden risks database',
];

const PRO_FEATURES = [
  'Unlimited prop firm accounts',
  'Unlimited trade simulations',
  'Advanced risk analytics',
  'Email alerts (coming soon)',
  'Priority support',
  'Early access to new features',
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function UpgradePage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a code.' });
      return;
    }
    
    startTransition(async () => {
      const result = await redeemProCode(code);
      
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message,
      });
      
      if (result.success) {
        setCode('');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Upgrade to Pro
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Unlock unlimited accounts and simulations to protect all your prop firm challenges.
          </p>
        </div>

        {/* Plans comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Plan */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Free</h3>
                <p className="text-gray-400 text-sm">Current plan</p>
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-gray-400">/month</span>
            </div>
            
            <ul className="space-y-3">
              {FREE_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
              RECOMMENDED
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Pro</h3>
                <p className="text-emerald-400 text-sm">Unlimited power</p>
              </div>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$9</span>
              <span className="text-gray-400">/month</span>
            </div>
            
            <ul className="space-y-3">
              {PRO_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pro Code Form */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Have a Pro Code?</h3>
              <p className="text-gray-400 text-sm">Enter your access code to activate Pro</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setMessage(null);
                }}
                placeholder="Enter your code (e.g., PROPFIRM2025)"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase tracking-wider"
                disabled={isPending}
                maxLength={30}
              />
            </div>
            
            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl ${
                message.type === 'success' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.text}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isPending || !code.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Activate Pro
                </>
              )}
            </button>
          </form>
          
          <p className="text-gray-500 text-sm text-center mt-4">
            Don't have a code? Contact us at{' '}
            <a href="mailto:pro@propfirmscanner.org" className="text-emerald-400 hover:underline">
              pro@propfirmscanner.org
            </a>
          </p>
        </div>

        {/* Why Pro */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Why upgrade to Pro?</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Multiple Accounts</h4>
              <p className="text-gray-400 text-sm">
                Track all your prop firm challenges in one place.
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Unlimited Simulations</h4>
              <p className="text-gray-400 text-sm">
                Test every trade idea before risking real capital.
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Stay Compliant</h4>
              <p className="text-gray-400 text-sm">
                Never accidentally break a rule and lose your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
