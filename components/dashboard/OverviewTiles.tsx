'use client';

import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Shield } from 'lucide-react';

interface OverviewTilesProps {
  totalBalance: number;
  todayPnl: number;
  accountsAtRisk: number;
  totalAccounts: number;
}

export function OverviewTiles({
  totalBalance,
  todayPnl,
  accountsAtRisk,
  totalAccounts,
}: OverviewTilesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPnl = (amount: number) => {
    const formatted = formatCurrency(Math.abs(amount));
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Balance */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Total Balance</span>
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <p className="text-2xl font-bold text-white">
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Across {totalAccounts} account{totalAccounts !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Today's P&L */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Today's P&L</span>
          <div className={`p-2 rounded-lg ${todayPnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {todayPnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
        <p className={`text-2xl font-bold ${todayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatPnl(todayPnl)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {todayPnl >= 0 ? 'Great day!' : 'Stay disciplined'}
        </p>
      </div>

      {/* Accounts at Risk */}
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400 text-sm">Risk Status</span>
          <div className={`p-2 rounded-lg ${
            accountsAtRisk === 0 ? 'bg-emerald-500/20' : 'bg-yellow-500/20'
          }`}>
            {accountsAtRisk === 0 ? (
              <Shield className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
        </div>
        <p className={`text-2xl font-bold ${
          accountsAtRisk === 0 ? 'text-emerald-400' : 'text-yellow-400'
        }`}>
          {accountsAtRisk === 0 ? 'All Safe' : `${accountsAtRisk} at Risk`}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {accountsAtRisk === 0 
            ? 'All accounts healthy' 
            : 'Review warnings below'}
        </p>
      </div>
    </div>
  );
}
