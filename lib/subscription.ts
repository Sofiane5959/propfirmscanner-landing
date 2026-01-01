// =============================================================================
// SUBSCRIPTION SERVICE - Plan logic and helpers
// =============================================================================

export type PlanType = 'free' | 'pro';

export interface UserPlan {
  plan: PlanType;
  accountLimit: number;
  features: {
    unlimitedAccounts: boolean;
    advancedGuidance: boolean;
    violationWarnings: boolean;
    evaluationTracking: boolean;
    alerts: boolean;
  };
}

// Plan configurations
export const PLANS: Record<PlanType, UserPlan> = {
  free: {
    plan: 'free',
    accountLimit: 1,
    features: {
      unlimitedAccounts: false,
      advancedGuidance: false,
      violationWarnings: false,
      evaluationTracking: false,
      alerts: false,
    },
  },
  pro: {
    plan: 'pro',
    accountLimit: Infinity,
    features: {
      unlimitedAccounts: true,
      advancedGuidance: true,
      violationWarnings: true,
      evaluationTracking: true,
      alerts: true,
    },
  },
};

// Pricing
export const PRICING = {
  pro: {
    monthly: 19.99,
    currency: 'USD',
    interval: 'month' as const,
  },
};

// Get user plan (from profile or default to free)
export function getUserPlan(planType: PlanType | null | undefined): UserPlan {
  return PLANS[planType || 'free'];
}

// Check if user can add more accounts
export function canAddAccount(currentAccountCount: number, plan: UserPlan): boolean {
  return currentAccountCount < plan.accountLimit;
}

// Check if feature is available
export function hasFeature(plan: UserPlan, feature: keyof UserPlan['features']): boolean {
  return plan.features[feature];
}

// Get upgrade reason for a feature
export function getUpgradeReason(feature: keyof UserPlan['features']): string {
  const reasons: Record<keyof UserPlan['features'], string> = {
    unlimitedAccounts: 'Track all your prop firm accounts in one place',
    advancedGuidance: 'Get personalized trading guidance based on your account status',
    violationWarnings: 'Receive warnings before you break any prop firm rules',
    evaluationTracking: 'See your complete evaluation progress and history',
    alerts: 'Get notified when you approach your drawdown limits',
  };
  return reasons[feature];
}

// Format price for display
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
