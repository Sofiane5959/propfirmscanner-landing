'use client';

import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface TodayOverviewProps {
  totalAccounts: number;
  safeCount: number;
  riskCount: number;
  dangerCount: number;
  centralMessage: string;
}

export function TodayOverview({
  totalAccounts,
  safeCount,
  riskCount,
  dangerCount,
  centralMessage,
}: TodayOverviewProps) {
  // Determine message severity
  const hasDanger = dangerCount > 0;
  const hasRisk = riskCount > 0;

  return (
    <section className="mt-6">
      {/* CENTRAL MESSAGE — HIGHEST PRIORITY */}
      <div
        className={`p-4 rounded-xl border mb-4 ${
          hasDanger
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : hasRisk
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}
      >
        <p className="text-base font-medium">{centralMessage}</p>
      </div>

      {/* COUNTS */}
      <div className="grid grid-cols-4 gap-3">
        {/* Accounts Tracked */}
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Tracked</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalAccounts}</p>
        </div>

        {/* Safe */}
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Safe</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{safeCount}</p>
        </div>

        {/* At Risk */}
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">At risk</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{riskCount}</p>
        </div>

        {/* Do Not Trade */}
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Avoid</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{dangerCount}</p>
        </div>
      </div>
    </section>
  );
}
