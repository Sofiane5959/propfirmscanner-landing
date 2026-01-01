'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Crown, 
  Shield, 
  AlertTriangle, 
  BarChart3, 
  Infinity,
  Check,
  Loader2,
  Zap,
} from 'lucide-react';
import { PRICING, formatPrice } from '@/lib/subscription';

// =============================================================================
// TYPES
// =============================================================================

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccountCount: number;
  trigger?: 'account_limit' | 'feature';
  featureName?: string;
}

// =============================================================================
// PAYWALL MODAL COMPONENT
// =============================================================================

export function PaywallModal({ 
  isOpen, 
  onClose, 
  currentAccountCount,
  trigger = 'account_limit',
  featureName,
}: PaywallModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    // Navigate to pricing page (Stripe checkout will be handled there)
    router.push('/pricing?upgrade=true');
  };

  const benefits = [
    {
      icon: Infinity,
      text: 'Track all your prop firm accounts in one place',
    },
    {
      icon: AlertTriangle,
      text: 'Get warnings before breaking rules',
    },
    {
      icon: BarChart3,
      text: 'See evaluation progress clearly',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pro Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Unlock Pro Tracker
        </h2>
        
        {/* Context */}
        <p className="text-gray-400 text-center mb-6">
          {trigger === 'account_limit' ? (
            <>
              You're tracking <span className="text-white font-semibold">{currentAccountCount} prop firm account</span>.
              <br />
              Pro unlocks unlimited accounts and advanced guidance to avoid rule violations.
            </>
          ) : (
            <>
              <span className="text-white font-semibold">{featureName}</span> is available on Pro.
              <br />
              Upgrade to unlock all premium features.
            </>
          )}
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-gray-300">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">
              {formatPrice(PRICING.pro.monthly)}
            </span>
            <span className="text-gray-500">/month</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            One avoided violation pays for months of Pro
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Upgrade to Pro — {formatPrice(PRICING.pro.monthly)}/month
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            {trigger === 'account_limit' 
              ? 'Continue with 1 account' 
              : 'Maybe later'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SOFT PAYWALL - For feature gates (tooltip style)
// =============================================================================

interface ProFeatureBadgeProps {
  feature: string;
  onClick?: () => void;
}

export function ProFeatureBadge({ feature, onClick }: ProFeatureBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-xs font-medium text-amber-400 hover:from-amber-500/30 hover:to-orange-500/30 transition-colors"
    >
      <Crown className="w-3 h-3" />
      Pro
    </button>
  );
}

// =============================================================================
// PRO FEATURE GATE - Wrapper component
// =============================================================================

interface ProFeatureGateProps {
  feature: string;
  isPro: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUpgradeClick?: () => void;
}

export function ProFeatureGate({ 
  feature, 
  isPro, 
  children, 
  fallback,
  onUpgradeClick,
}: ProFeatureGateProps) {
  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
        <div className="text-center p-4">
          <ProFeatureBadge feature={feature} onClick={onUpgradeClick} />
          <p className="text-sm text-gray-400 mt-2">
            {feature} is available on Pro
          </p>
          <button
            onClick={onUpgradeClick}
            className="mt-3 text-sm text-amber-400 hover:text-amber-300 font-medium"
          >
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
}
