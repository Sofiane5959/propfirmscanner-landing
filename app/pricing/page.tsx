'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { AuthGuardModal } from '@/components/AuthGuardModal';
import { PRICING, formatPrice, type PlanType } from '@/lib/subscription';
import {
  Check,
  X,
  Crown,
  Shield,
  Zap,
  ArrowRight,
  Loader2,
  HelpCircle,
  ChevronDown,
  BarChart3,
  AlertTriangle,
  Bell,
  Infinity,
  Calculator,
} from 'lucide-react';

// =============================================================================
// PLAN DATA
// =============================================================================

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PlanConfig {
  name: string;
  price: number;
  description: string;
  badge?: string;
  features: PlanFeature[];
  cta: string;
  ctaVariant: 'primary' | 'secondary';
}

const PLAN_FEATURES: Record<'free' | 'pro', PlanConfig> = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Get started with prop firm tracking',
    features: [
      { text: 'Demo dashboard access', included: true },
      { text: '1 real prop firm account', included: true },
      { text: 'Basic trade simulation', included: true },
      { text: 'Manual P&L updates', included: true },
      { text: 'Unlimited accounts', included: false },
      { text: 'Advanced guidance', included: false },
      { text: 'Violation warnings', included: false },
      { text: 'Evaluation tracking', included: false },
    ],
    cta: 'Start Free',
    ctaVariant: 'secondary',
  },
  pro: {
    name: 'Pro',
    price: PRICING.pro.monthly,
    description: 'For serious prop firm traders',
    badge: 'Most Popular',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Unlimited prop firm accounts', included: true, highlight: true },
      { text: 'Advanced guidance messages', included: true, highlight: true },
      { text: 'Violation warnings', included: true, highlight: true },
      { text: 'Full evaluation tracking', included: true, highlight: true },
      { text: 'Priority access to new features', included: true },
      { text: 'Email alerts (coming soon)', included: true },
      { text: 'Push notifications (coming soon)', included: true },
    ],
    cta: 'Upgrade to Pro',
    ctaVariant: 'primary',
  },
};

// =============================================================================
// FAQ DATA
// =============================================================================

const FAQ_ITEMS = [
  {
    question: 'Is this a trading bot?',
    answer: 'No. PropFirmScanner is a tracking and management tool. It helps you monitor your prop firm accounts, track drawdown limits, and avoid rule violations. It does not execute any trades.',
  },
  {
    question: 'Does it connect to my broker or prop firm?',
    answer: 'No. You manually enter your account details and update your P&L. This keeps your credentials secure and works with any prop firm, regardless of their platform.',
  },
  {
    question: 'Who is this for?',
    answer: 'PropFirmScanner is built for traders who manage one or more prop firm accounts (FTMO, FundedNext, The5ers, etc.) and want to avoid costly rule violations.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. You can cancel your Pro subscription at any time. You\'ll retain access until the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards through Stripe. Your payment information is never stored on our servers.',
  },
];

// =============================================================================
// FAQ COMPONENT
// =============================================================================

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="font-medium text-white">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <p className="pb-5 text-gray-400 text-sm leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// PLAN CARD COMPONENT
// =============================================================================

function PlanCard({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading,
}: {
  plan: PlanConfig;
  isCurrentPlan: boolean;
  onSelect: () => void;
  isLoading: boolean;
}) {
  const isPro = plan.name === 'Pro';

  return (
    <div 
      className={`relative bg-gray-900 rounded-2xl border ${
        isPro ? 'border-amber-500/50' : 'border-gray-800'
      } p-8 flex flex-col`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {isPro && <Crown className="w-5 h-5 text-amber-400" />}
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        </div>
        <p className="text-sm text-gray-500">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            {plan.price === 0 ? 'Free' : formatPrice(plan.price)}
          </span>
          {plan.price > 0 && (
            <span className="text-gray-500">/month</span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            {feature.included ? (
              <Check className={`w-5 h-5 flex-shrink-0 ${feature.highlight ? 'text-amber-400' : 'text-emerald-400'}`} />
            ) : (
              <X className="w-5 h-5 text-gray-700 flex-shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? (feature.highlight ? 'text-white font-medium' : 'text-gray-300') : 'text-gray-600'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onSelect}
        disabled={isLoading || isCurrentPlan}
        className={`w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          isPro
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        } ${(isLoading || isCurrentPlan) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : (
          <>
            {plan.cta}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

// =============================================================================
// MAIN PRICING PAGE
// =============================================================================

export default function PricingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const showUpgradeHighlight = searchParams.get('upgrade') === 'true';
  
  // TODO: Get actual user plan from profile
  const currentPlan: PlanType = 'free';

  const handleSelectFree = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      // User is already on free, go to dashboard
      window.location.href = '/dashboard';
    }
  };

  const handleSelectPro = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsLoading(true);
    
    // TODO: Implement Stripe checkout
    // For now, redirect to a placeholder
    try {
      // const response = await fetch('/api/checkout', { method: 'POST' });
      // const { url } = await response.json();
      // window.location.href = url;
      
      // Placeholder - show alert
      alert('Stripe checkout will be implemented here. For now, this is a placeholder.');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trade with clarity.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Avoid breaking prop firm rules.
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            One avoided rule violation pays for months of Pro.
          </p>
        </div>

        {/* Upgrade highlight banner */}
        {showUpgradeHighlight && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <p className="text-amber-200">
                You've reached your account limit. Upgrade to Pro to track unlimited accounts.
              </p>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <PlanCard
            plan={PLAN_FEATURES.free}
            isCurrentPlan={currentPlan === 'free' && !!user}
            onSelect={handleSelectFree}
            isLoading={false}
          />
          <PlanCard
            plan={PLAN_FEATURES.pro}
            isCurrentPlan={currentPlan === 'pro'}
            onSelect={handleSelectPro}
            isLoading={isLoading}
          />
        </div>

        {/* Value Props */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Why traders trust PropFirmScanner
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Avoid Costly Violations</h3>
              <p className="text-sm text-gray-500">
                Know exactly how much you can risk before breaking any rule
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Simulate Before Trading</h3>
              <p className="text-sm text-gray-500">
                Test your trade size before risking real capital
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Track All Accounts</h3>
              <p className="text-sm text-gray-500">
                FTMO, FundedNext, The5ers — all in one dashboard
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl px-6">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">
            Ready to trade with confidence?
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthGuardModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        action="accéder à cette fonctionnalité"
      />
    </div>
  );
}
