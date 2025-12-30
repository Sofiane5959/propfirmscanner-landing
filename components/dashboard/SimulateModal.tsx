'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Crown,
  Zap
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  current_balance: number;
  start_balance: number;
  today_pnl: number;
  daily_dd_percent: number;
  max_dd_percent: number;
}

interface SimulateModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
}

interface SimulationMetrics {
  risk_usd: number;
  daily_buffer_usd: number;
  max_buffer_usd: number;
  daily_usage_pct: number;
  max_usage_pct: number;
  daily_buffer_usage_pct: number;
  max_buffer_usage_pct: number;
}

interface SimulationResult {
  classification: 'SAFE' | 'RISKY' | 'VIOLATION';
  reasons: string[];
  metrics: SimulationMetrics;
  userMessage: string;
  isValid: boolean;
  validationError?: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  paywall?: boolean;
  data?: {
    simulation: SimulationResult;
    recommendations: {
      max_safe_risk: number;
      max_risk_before_violation: number;
    };
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getResultConfig(classification: 'SAFE' | 'RISKY' | 'VIOLATION') {
  const configs = {
    SAFE: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle,
      label: 'SAFE',
    },
    RISKY: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: AlertTriangle,
      label: 'RISKY',
    },
    VIOLATION: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: AlertCircle,
      label: 'VIOLATION',
    },
  };
  return configs[classification];
}

// =============================================================================
// UPGRADE CTA COMPONENT
// =============================================================================

function UpgradeCTA({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        Daily Limit Reached
      </h3>
      <p className="text-gray-400 mb-6">
        You've used all 3 free simulations for today. Upgrade to Pro for unlimited simulations.
      </p>

      <div className="bg-gray-900 rounded-xl p-4 mb-6 text-left">
        <p className="text-sm text-gray-400 mb-3">Pro includes:</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-white">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Unlimited trade simulations
          </li>
          <li className="flex items-center gap-2 text-sm text-white">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Unlimited prop firm accounts
          </li>
          <li className="flex items-center gap-2 text-sm text-white">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Advanced risk analytics
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <Link
          href="/dashboard/upgrade"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
        >
          <Zap className="w-5 h-5" />
          Upgrade to Pro - $9/month
        </Link>
        
        <button
          onClick={onClose}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Your simulations reset daily at midnight UTC
      </p>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SimulateModal({ isOpen, onClose, account }: SimulateModalProps) {
  const [riskAmount, setRiskAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [recommendations, setRecommendations] = useState<{
    max_safe_risk: number;
    max_risk_before_violation: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRiskAmount('');
      setResult(null);
      setRecommendations(null);
      setError(null);
      setShowPaywall(false);
    }
  }, [isOpen]);

  const dailyLimitUsd = (account.start_balance * account.daily_dd_percent) / 100;

  const handleSimulate = async () => {
    const risk = parseFloat(riskAmount);
    
    if (isNaN(risk) || risk <= 0) {
      setError('Please enter a valid risk amount greater than $0');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowPaywall(false);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: account.id,
          risk_usd: risk,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        if (data.paywall) {
          setShowPaywall(true);
          return;
        }
        setError(data.error || 'Simulation failed. Please try again.');
        return;
      }

      if (data.data) {
        setResult(data.data.simulation);
        setRecommendations(data.data.recommendations);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && riskAmount) {
      handleSimulate();
    }
  };

  if (!isOpen) return null;

  const config = result ? getResultConfig(result.classification) : null;
  const ResultIcon = config?.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Simulate Trade</h2>
              <p className="text-sm text-gray-400">{account.prop_firm} • {account.program}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showPaywall ? (
          <UpgradeCTA onClose={onClose} />
        ) : (
          <div className="p-4 space-y-4">
            {/* Account Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-white font-semibold text-sm">
                  {formatCurrency(account.current_balance)}
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Daily Limit</p>
                <p className="text-white font-semibold text-sm">
                  {formatCurrency(dailyLimitUsd)}
                </p>
              </div>
              <div className="bg-gray-900 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Today P&L</p>
                <p className={`font-semibold text-sm ${
                  account.today_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {account.today_pnl >= 0 ? '+' : ''}{formatCurrency(account.today_pnl)}
                </p>
              </div>
            </div>

            {/* Risk Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Risk Amount (potential loss if stopped out)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  value={riskAmount}
                  onChange={(e) => {
                    setRiskAmount(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter amount..."
                  className="w-full pl-8 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-lg placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[100, 250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setRiskAmount(amount.toString())}
                  disabled={isLoading}
                  className="flex-1 py-2 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Recommended Risk */}
            {recommendations && (
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl">
                <span className="text-sm text-gray-400">Max safe risk:</span>
                <button
                  onClick={() => setRiskAmount(recommendations.max_safe_risk.toFixed(0))}
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {formatCurrency(recommendations.max_safe_risk)} →
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Result */}
            {result && config && ResultIcon && (
              <div className={`p-4 rounded-xl border ${config.bg} ${config.border}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <ResultIcon className={`w-6 h-6 ${config.text}`} />
                  </div>
                  <h3 className={`font-bold text-lg ${config.text}`}>
                    {config.label}
                  </h3>
                </div>

                <p className="text-gray-300 text-sm mb-4">
                  {result.userMessage}
                </p>

                {/* Usage Meters */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Daily DD Usage</span>
                      <span className={`font-medium ${
                        result.metrics.daily_usage_pct > 80 
                          ? 'text-red-400' 
                          : result.metrics.daily_usage_pct > 50 
                            ? 'text-yellow-400' 
                            : 'text-emerald-400'
                      }`}>
                        {result.metrics.daily_usage_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.metrics.daily_usage_pct > 80
                            ? 'bg-red-500'
                            : result.metrics.daily_usage_pct > 50
                              ? 'bg-yellow-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, result.metrics.daily_usage_pct)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Max DD Usage</span>
                      <span className={`font-medium ${
                        result.metrics.max_usage_pct > 80 
                          ? 'text-red-400' 
                          : result.metrics.max_usage_pct > 50 
                            ? 'text-yellow-400' 
                            : 'text-emerald-400'
                      }`}>
                        {result.metrics.max_usage_pct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.metrics.max_usage_pct > 80
                            ? 'bg-red-500'
                            : result.metrics.max_usage_pct > 50
                              ? 'bg-yellow-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, result.metrics.max_usage_pct)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-4 pt-3 border-t border-gray-700 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Risk:</span>
                    <span className="text-white font-medium">{formatCurrency(result.metrics.risk_usd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Daily buffer:</span>
                    <span className="text-white font-medium">{formatCurrency(result.metrics.daily_buffer_usd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buffer used:</span>
                    <span className="text-white font-medium">{result.metrics.daily_buffer_usage_pct.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max buffer:</span>
                    <span className="text-white font-medium">{formatCurrency(result.metrics.max_buffer_usd)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleSimulate}
              disabled={isLoading || !riskAmount}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : result ? (
                <>
                  <Play className="w-5 h-5" />
                  Simulate Again
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Simulate Trade
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Enter the maximum amount you could lose if your stop-loss is hit
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
