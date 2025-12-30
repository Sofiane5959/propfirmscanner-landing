'use client';

import { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle,
  TrendingDown,
  Newspaper,
  Moon,
  BarChart3,
  Play,
  Loader2,
  Lightbulb,
  AlertCircle,
  DollarSign,
  Edit3,
  Save
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface AccountHealth {
  status: 'safe' | 'warning' | 'danger';
  daily: {
    daily_limit_usd: number;
    daily_used_usd: number;
    daily_buffer_usd: number;
    daily_buffer_pct: number;
  };
  max: {
    max_limit_usd: number;
    max_floor_usd: number;
    max_buffer_usd: number;
    max_buffer_pct: number;
    basisUsed: 'balance' | 'equity';
    isApproxTrailing: boolean;
  };
  messages: string[];
}

interface Account {
  id: string;
  prop_firm: string;
  program: string;
  stage: string;
  current_balance: number;
  start_balance: number;
  today_pnl: number;
  daily_dd_percent: number;
  max_dd_percent: number;
  max_dd_type: 'static' | 'trailing' | 'eod_trailing';
  allows_news: boolean;
  allows_weekend: boolean;
  has_consistency: boolean;
  min_trading_days: number;
  current_trading_days: number;
  health: AccountHealth;
}

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPitfalls(account: Account): string[] {
  const pitfalls: string[] = [];
  
  if (account.max_dd_type === 'trailing') {
    pitfalls.push('Trailing DD: Your floor rises with profits. A winning streak followed by a loss can still cause a breach.');
  }
  
  if (!account.allows_news) {
    pitfalls.push('News restriction: Trades during high-impact news can void your account, even if profitable.');
  }
  
  if (!account.allows_weekend) {
    pitfalls.push('Weekend holding: All positions must be closed before Friday close. Forgetting this can breach rules.');
  }
  
  if (account.has_consistency) {
    pitfalls.push('Consistency rule: No single day can exceed 30-40% of total profit. Big wins can actually hurt you.');
  }
  
  if (account.health.daily.daily_buffer_pct < 30) {
    pitfalls.push('Low daily buffer: You have little room for error today. One bad trade could breach daily limit.');
  }
  
  return pitfalls;
}

function getRecommendations(account: Account): string[] {
  const recs: string[] = [];
  
  if (account.health.status === 'danger') {
    recs.push('Consider not trading today. Protecting the account is more important than one day of profit.');
  } else if (account.health.status === 'warning') {
    recs.push('Reduce position sizes today. You have less buffer than usual.');
  }
  
  if (account.health.daily.daily_buffer_usd < 500) {
    recs.push(`Max risk per trade: ${formatUSD(account.health.daily.daily_buffer_usd * 0.5)} (50% of remaining daily buffer)`);
  }
  
  if (account.min_trading_days > account.current_trading_days) {
    const remaining = account.min_trading_days - account.current_trading_days;
    recs.push(`${remaining} more trading days needed. Don't rush — small consistent days count.`);
  }
  
  if (account.max_dd_type === 'trailing' && account.health.max.max_buffer_pct > 80) {
    recs.push('Your trailing DD floor is low. Consider banking some profit before it trails up further.');
  }
  
  return recs;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AccountDrawer({ isOpen, onClose, account }: AccountDrawerProps) {
  const [riskAmount, setRiskAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    classification: 'SAFE' | 'RISKY' | 'VIOLATION';
    message: string;
  } | null>(null);
  const [isEditingPnl, setIsEditingPnl] = useState(false);
  const [todayPnl, setTodayPnl] = useState(account.today_pnl.toString());
  const [isSavingPnl, setIsSavingPnl] = useState(false);

  const pitfalls = getPitfalls(account);
  const recommendations = getRecommendations(account);

  const handleSimulate = async () => {
    const risk = parseFloat(riskAmount);
    if (isNaN(risk) || risk <= 0) return;

    setIsSimulating(true);
    setSimResult(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: account.id, risk_usd: risk }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setSimResult({
          classification: data.data.simulation.classification,
          message: data.data.simulation.userMessage,
        });
      } else {
        setSimResult({
          classification: 'VIOLATION',
          message: data.error || 'Simulation failed',
        });
      }
    } catch {
      setSimResult({
        classification: 'VIOLATION',
        message: 'Network error. Please try again.',
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSavePnl = async () => {
    setIsSavingPnl(true);
    try {
      await fetch('/api/accounts/update-pnl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          account_id: account.id, 
          today_pnl: parseFloat(todayPnl) || 0 
        }),
      });
      setIsEditingPnl(false);
      // Refresh page to get updated data
      window.location.reload();
    } catch {
      // Handle error silently
    } finally {
      setIsSavingPnl(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-gray-800 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">{account.prop_firm}</h2>
            <p className="text-sm text-gray-500">{account.program} · {account.stage}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Status & Balance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Balance</p>
              <p className="text-xl font-bold text-white">{formatUSD(account.current_balance)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Today P&L</p>
              <div className="flex items-center gap-2">
                {isEditingPnl ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={todayPnl}
                      onChange={(e) => setTodayPnl(e.target.value)}
                      className="w-20 px-2 py-1 bg-gray-700 rounded text-white text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleSavePnl}
                      disabled={isSavingPnl}
                      className="p-1 text-emerald-400 hover:bg-gray-700 rounded"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className={`text-xl font-bold ${
                      account.today_pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {account.today_pnl >= 0 ? '+' : ''}{formatUSD(account.today_pnl)}
                    </p>
                    <button
                      onClick={() => setIsEditingPnl(true)}
                      className="p-1 text-gray-500 hover:text-white hover:bg-gray-700 rounded"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Risk Meters */}
          <div className="space-y-3">
            {/* Daily DD */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Daily drawdown</span>
                <span className={`font-medium ${
                  account.health.daily.daily_buffer_pct < 30 ? 'text-red-400' :
                  account.health.daily.daily_buffer_pct < 50 ? 'text-yellow-400' :
                  'text-emerald-400'
                }`}>
                  {formatUSD(account.health.daily.daily_buffer_usd)} left
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    account.health.daily.daily_buffer_pct < 30 ? 'bg-red-500' :
                    account.health.daily.daily_buffer_pct < 50 ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${account.health.daily.daily_buffer_pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Used {formatUSD(account.health.daily.daily_used_usd)} of {formatUSD(account.health.daily.daily_limit_usd)} today
              </p>
            </div>

            {/* Max DD */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 flex items-center gap-1">
                  Max drawdown
                  {account.max_dd_type !== 'static' && (
                    <span className="text-xs text-purple-400">(trailing)</span>
                  )}
                </span>
                <span className={`font-medium ${
                  account.health.max.max_buffer_pct < 30 ? 'text-red-400' :
                  account.health.max.max_buffer_pct < 50 ? 'text-yellow-400' :
                  'text-emerald-400'
                }`}>
                  {formatUSD(account.health.max.max_buffer_usd)} left
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    account.health.max.max_buffer_pct < 30 ? 'bg-red-500' :
                    account.health.max.max_buffer_pct < 50 ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${account.health.max.max_buffer_pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Floor at {formatUSD(account.health.max.max_floor_usd)}
              </p>
            </div>
          </div>

          {/* Account Rules */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Account rules</h3>
            <div className="flex flex-wrap gap-2">
              {account.max_dd_type !== 'static' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-lg">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Trailing DD
                </span>
              )}
              {!account.allows_news && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-lg">
                  <Newspaper className="w-3.5 h-3.5" />
                  No news trading
                </span>
              )}
              {!account.allows_weekend && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg">
                  <Moon className="w-3.5 h-3.5" />
                  No weekend hold
                </span>
              )}
              {account.has_consistency && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/20 text-cyan-400 text-sm rounded-lg">
                  <BarChart3 className="w-3.5 h-3.5" />
                  Consistency rule
                </span>
              )}
              {account.min_trading_days > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg">
                  Min {account.min_trading_days} days
                </span>
              )}
            </div>
          </div>

          {/* Hidden Pitfalls */}
          {pitfalls.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Hidden pitfalls
              </h3>
              <div className="space-y-2">
                {pitfalls.map((pitfall, i) => (
                  <div key={i} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-300">
                    {pitfall}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                Recommendations
              </h3>
              <div className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-300">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trade Simulator */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-1.5">
              <Play className="w-4 h-4" />
              Simulate a trade
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  How much could you lose? (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={riskAmount}
                    onChange={(e) => {
                      setRiskAmount(e.target.value);
                      setSimResult(null);
                    }}
                    placeholder="500"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setRiskAmount(amt.toString());
                      setSimResult(null);
                    }}
                    className="flex-1 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSimulate}
                disabled={isSimulating || !riskAmount}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Check this trade
                  </>
                )}
              </button>

              {/* Result */}
              {simResult && (
                <div className={`p-4 rounded-lg ${
                  simResult.classification === 'SAFE' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20' 
                    : simResult.classification === 'RISKY'
                      ? 'bg-yellow-500/10 border border-yellow-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {simResult.classification === 'SAFE' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : simResult.classification === 'RISKY' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-semibold ${
                      simResult.classification === 'SAFE' ? 'text-emerald-400' :
                      simResult.classification === 'RISKY' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {simResult.classification}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{simResult.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
