'use client';

import { AlertTriangle, AlertCircle, CheckCircle, Lightbulb, Clock, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// TYPES
// =============================================================================

interface Warning {
  accountId: string;
  propFirm: string;
  message: string;
  status: 'warning' | 'danger';
}

interface TodaysAssistantProps {
  warnings: Warning[];
}

// =============================================================================
// TIPS DATA
// =============================================================================

const tradingTips = [
  {
    icon: Shield,
    title: 'Risk Management',
    tip: 'Never risk more than 1-2% of your account on a single trade.',
  },
  {
    icon: Clock,
    title: 'News Trading',
    tip: 'Most prop firms require 2-5 minutes buffer around high-impact news.',
  },
  {
    icon: TrendingUp,
    title: 'Trailing DD',
    tip: 'With trailing drawdown, your floor moves up with profits but never down.',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function TodaysAssistant({ warnings }: TodaysAssistantProps) {
  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Get a random tip
  const randomTip = tradingTips[Math.floor(Math.random() * tradingTips.length)];
  const TipIcon = randomTip.icon;

  return (
    <div className="space-y-4 sticky top-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-4 border border-emerald-500/20">
        <h2 className="text-lg font-semibold text-white mb-1">Today's Assistant</h2>
        <p className="text-sm text-emerald-300/80">{greeting}! Here's your trading brief.</p>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-medium text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Active Warnings
            </h3>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
              {warnings.length}
            </span>
          </div>

          <div className="divide-y divide-gray-700">
            {warnings.map((warning, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    warning.status === 'danger' 
                      ? 'bg-red-500/20' 
                      : 'bg-yellow-500/20'
                  }`}>
                    {warning.status === 'danger' ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {warning.propFirm}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      warning.status === 'danger' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {warning.message.replace(/[⛔⚠️✅ℹ️]/g, '').trim()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">All Clear!</h3>
              <p className="text-sm text-gray-400">No warnings at this time</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tip */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">{randomTip.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{randomTip.tip}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-700">
          <h3 className="font-medium text-white">Quick Actions</h3>
        </div>
        <div className="p-2">
          <Link
            href="/dashboard/rules"
            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-sm">View All Rules</span>
          </Link>
          <Link
            href="/dashboard/accounts/new"
            className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Add New Account</span>
          </Link>
        </div>
      </div>

      {/* Market Status (Simple) */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-medium text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Market Hours
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Forex</span>
            <span className="text-emerald-400">Open 24/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">US Stocks</span>
            <span className="text-gray-500">Check local time</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Futures</span>
            <span className="text-emerald-400">Open 23/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
