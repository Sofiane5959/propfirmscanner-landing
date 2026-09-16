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
              : 'bg-accent/10 border-accent/30 text-accent'
        }`}
      >
        <p className="text-base font-medium">{centralMessage}</p>
      </div>

      {/* COUNTS */}
      <div className="grid grid-cols-4 gap-3">
        {/* Accounts Tracked */}
        <div className="bg-bg-elevated rounded-xl p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-text-muted" />
            <span className="text-xs text-text-muted">Tracked</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalAccounts}</p>
        </div>

        {/* Safe */}
        <div className="bg-bg-elevated rounded-xl p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span className="text-xs text-text-muted">Safe</span>
          </div>
          <p className="text-2xl font-bold text-accent">{safeCount}</p>
        </div>

        {/* At Risk */}
        <div className="bg-bg-elevated rounded-xl p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-text-muted">At risk</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{riskCount}</p>
        </div>

        {/* Do Not Trade */}
        <div className="bg-bg-elevated rounded-xl p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-text-muted">Avoid</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{dangerCount}</p>
        </div>
      </div>
    </section>
  );
}
