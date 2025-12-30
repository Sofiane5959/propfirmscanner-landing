'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingDown, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Crown,
  Lock,
  Info
} from 'lucide-react';

// =============================================================================
// PROP FIRM PRESETS
// =============================================================================

const propFirmPresets = [
  { name: 'Custom', dailyDD: 5, maxDD: 10, trailing: false },
  { name: 'FTMO', dailyDD: 5, maxDD: 10, trailing: false },
  { name: 'FundedNext', dailyDD: 5, maxDD: 10, trailing: true },
  { name: 'The5ers', dailyDD: 4, maxDD: 6, trailing: false },
  { name: 'MyFundedFX', dailyDD: 5, maxDD: 8, trailing: true },
  { name: 'E8 Funding', dailyDD: 5, maxDD: 8, trailing: false },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function DrawdownSimulatorPage() {
  // Form state
  const [preset, setPreset] = useState('FTMO');
  const [accountSize, setAccountSize] = useState('100000');
  const [currentBalance, setCurrentBalance] = useState('100000');
  const [todayPnl, setTodayPnl] = useState('0');
  const [dailyDDPercent, setDailyDDPercent] = useState('5');
  const [maxDDPercent, setMaxDDPercent] = useState('10');
  const [isTrailing, setIsTrailing] = useState(false);
  const [highWatermark, setHighWatermark] = useState('100000');

  // Apply preset
  const handlePresetChange = (presetName: string) => {
    setPreset(presetName);
    const selected = propFirmPresets.find(p => p.name === presetName);
    if (selected && presetName !== 'Custom') {
      setDailyDDPercent(selected.dailyDD.toString());
      setMaxDDPercent(selected.maxDD.toString());
      setIsTrailing(selected.trailing);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const startBal = parseFloat(accountSize) || 0;
    const currBal = parseFloat(currentBalance) || 0;
    const pnl = parseFloat(todayPnl) || 0;
    const dailyPct = parseFloat(dailyDDPercent) || 0;
    const maxPct = parseFloat(maxDDPercent) || 0;
    const hwm = parseFloat(highWatermark) || startBal;

    // Daily DD calculation
    const dailyLimitUsd = (startBal * dailyPct) / 100;
    const dailyUsedUsd = Math.max(0, -pnl);
    const dailyBufferUsd = Math.max(0, dailyLimitUsd - dailyUsedUsd);
    const dailyBufferPct = dailyLimitUsd > 0 ? (dailyBufferUsd / dailyLimitUsd) * 100 : 0;

    // Max DD calculation
    const maxLimitUsd = (startBal * maxPct) / 100;
    let maxFloorUsd = startBal - maxLimitUsd;
    
    // Trailing DD adjusts floor based on HWM
    if (isTrailing && hwm > startBal) {
      maxFloorUsd = hwm - maxLimitUsd;
    }
    
    const maxBufferUsd = Math.max(0, currBal - maxFloorUsd);
    const maxBufferPct = maxLimitUsd > 0 ? (maxBufferUsd / maxLimitUsd) * 100 : 0;

    // Status
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (dailyBufferPct < 15 || maxBufferPct < 15) status = 'danger';
    else if (dailyBufferPct < 30 || maxBufferPct < 30) status = 'warning';

    return {
      dailyLimitUsd,
      dailyUsedUsd,
      dailyBufferUsd,
      dailyBufferPct,
      maxLimitUsd,
      maxFloorUsd,
      maxBufferUsd,
      maxBufferPct,
      status,
    };
  }, [accountSize, currentBalance, todayPnl, dailyDDPercent, maxDDPercent, isTrailing, highWatermark]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      safe: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle, label: 'Healthy' },
      warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle, label: 'Warning' },
      danger: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle, label: 'Danger' },
    };
    return configs[status as keyof typeof configs];
  };

  const statusConfig = getStatusConfig(calculations.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Tools
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Drawdown Simulator</h1>
              <p className="text-gray-400">Calculate your buffer before hitting DD limits</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Account Settings</h2>

            {/* Preset Selector */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Prop Firm Preset</label>
              <select
                value={preset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              >
                {propFirmPresets.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Account Size */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Account Size (USD)</label>
              <input
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000, 200000].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setAccountSize(size.toString());
                      setCurrentBalance(size.toString());
                      setHighWatermark(size.toString());
                    }}
                    className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    ${(size / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Current Balance */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Current Balance (USD)</label>
              <input
                type="number"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Today's P&L */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Today's P&L (USD)</label>
              <input
                type="number"
                value={todayPnl}
                onChange={(e) => setTodayPnl(e.target.value)}
                placeholder="e.g., -500 or 1200"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* DD Percentages */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Daily DD %</label>
                <input
                  type="number"
                  value={dailyDDPercent}
                  onChange={(e) => {
                    setDailyDDPercent(e.target.value);
                    setPreset('Custom');
                  }}
                  step="0.5"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max DD %</label>
                <input
                  type="number"
                  value={maxDDPercent}
                  onChange={(e) => {
                    setMaxDDPercent(e.target.value);
                    setPreset('Custom');
                  }}
                  step="0.5"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Trailing Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrailing}
                  onChange={(e) => {
                    setIsTrailing(e.target.checked);
                    setPreset('Custom');
                  }}
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-white">Trailing Drawdown</span>
              </label>
            </div>

            {/* High Watermark (only if trailing) */}
            {isTrailing && (
              <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <label className="block text-sm text-purple-400 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  High Watermark (USD)
                </label>
                <input
                  type="number"
                  value={highWatermark}
                  onChange={(e) => setHighWatermark(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Highest balance reached. DD floor trails up with profits.
                </p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Status Badge */}
            <div className={`p-4 rounded-xl ${statusConfig.bg} flex items-center gap-3`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.text}`} />
              <div>
                <p className={`font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
                <p className="text-sm text-gray-400">
                  {calculations.status === 'safe' && 'Your account is within safe limits'}
                  {calculations.status === 'warning' && 'Buffer getting low, trade carefully'}
                  {calculations.status === 'danger' && 'Very close to hitting DD limits!'}
                </p>
              </div>
            </div>

            {/* Daily DD Card */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-3">Daily Drawdown</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Limit</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(calculations.dailyLimitUsd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Used Today</p>
                  <p className="text-lg font-semibold text-red-400">
                    {formatCurrency(calculations.dailyUsedUsd)}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Buffer Remaining</span>
                  <span className={`font-medium ${
                    calculations.dailyBufferPct < 30 
                      ? calculations.dailyBufferPct < 15 
                        ? 'text-red-400' 
                        : 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}>
                    {formatCurrency(calculations.dailyBufferUsd)} ({calculations.dailyBufferPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      calculations.dailyBufferPct < 30
                        ? calculations.dailyBufferPct < 15
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, calculations.dailyBufferPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Max DD Card */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                Max Drawdown
                {isTrailing && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    Trailing
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Limit</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(calculations.maxLimitUsd)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Floor (breach at)</p>
                  <p className="text-lg font-semibold text-orange-400">
                    {formatCurrency(calculations.maxFloorUsd)}
                  </p>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Buffer Remaining</span>
                  <span className={`font-medium ${
                    calculations.maxBufferPct < 30 
                      ? calculations.maxBufferPct < 15 
                        ? 'text-red-400' 
                        : 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}>
                    {formatCurrency(calculations.maxBufferUsd)} ({calculations.maxBufferPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      calculations.maxBufferPct < 30
                        ? calculations.maxBufferPct < 15
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, calculations.maxBufferPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Pro CTA */}
            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-5 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Track This Automatically</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Pro Tracker monitors your DD in real-time, alerts you before violations, and simulates trades.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                    Try Pro Tracker Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Feature Teaser */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 opacity-75">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Pro Features</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Multi-account monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Real-time alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Trade simulation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Historical tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
