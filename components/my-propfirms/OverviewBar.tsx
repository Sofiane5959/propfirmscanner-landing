'use client';

import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface OverviewBarProps {
  totalAccounts: number;
  accountsAtRisk: number;
  mainWarning: string | null;
}

export function OverviewBar({ totalAccounts, accountsAtRisk, mainWarning }: OverviewBarProps) {
  const allSafe = accountsAtRisk === 0;

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-semibold text-white">My Prop Firms</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-400">
              <span className="text-white font-medium">{totalAccounts}</span> accounts
            </div>
            {accountsAtRisk > 0 ? (
              <div className="flex items-center gap-1 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{accountsAtRisk} at risk</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>All safe</span>
              </div>
            )}
          </div>
        </div>

        {/* Warning Banner */}
        {mainWarning && (
          <div className={`p-3 rounded-lg text-sm ${
            accountsAtRisk > 0 
              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {mainWarning}
          </div>
        )}

        {/* All Safe Message */}
        {allSafe && !mainWarning && (
          <div className="p-3 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            All accounts are within safe limits. You&apos;re good to trade.
          </div>
        )}
      </div>
    </div>
  );
}
