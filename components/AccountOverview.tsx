'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from 'lucide-react';

interface Account {
  id: string;
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string | null;
  created_at: string;
}

interface AccountOverviewProps {
  account: Account;
  balanceHistory?: { date: string; balance: number }[];
}

export default function AccountOverview({ account, balanceHistory = [] }: AccountOverviewProps) {
  const [chartType, setChartType] = useState<'balance' | 'drawdown'>('balance');

  // Calculations
  const profit = account.current_balance - account.initial_balance;
  const profitPercent = (profit / account.initial_balance) * 100;
  const isProfit = profit >= 0;

  // Drawdown calculations
  const maxDrawdownAmount = account.initial_balance * (account.max_drawdown / 100);
  const currentDrawdown = Math.max(0, account.initial_balance - account.current_balance);
  const drawdownPercent = maxDrawdownAmount > 0 ? (currentDrawdown / maxDrawdownAmount) * 100 : 0;

  // Daily loss calculations
  const dailyLossPercent = account.daily_loss_limit > 0 
    ? (account.current_daily_loss / account.daily_loss_limit) * 100 
    : 0;

  // Profit target calculations
  const profitTargetAmount = account.initial_balance * (account.profit_target / 100);
  const profitTargetPercent = profitTargetAmount > 0 ? (Math.max(0, profit) / profitTargetAmount) * 100 : 0;

  // Days remaining
  const daysRemaining = account.challenge_end_date
    ? Math.ceil((new Date(account.challenge_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // Generate mock history if none provided
  const chartData = balanceHistory.length > 0 ? balanceHistory : generateMockHistory(account);

  // Status color
  const getStatusColor = (percent: number) => {
    if (percent >= 95) return 'text-red-500';
    if (percent >= 80) return 'text-yellow-500';
    return 'text-accent';
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 95) return 'bg-red-500';
    if (percent >= 80) return 'bg-yellow-500';
    return 'bg-accent-hover';
  };

  return (
    <div className="bg-bg-elevated rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{account.account_name}</h3>
          <p className="text-sm text-text-secondary">{account.firm_name}</p>
        </div>
        <div className={`flex items-center gap-2 ${isProfit ? 'text-accent' : 'text-red-500'}`}>
          {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span className="text-xl font-bold">
            {isProfit ? '+' : ''}{profitPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Balance & Profit */}
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-border">
        <div>
          <p className="text-text-secondary text-sm">Current Balance</p>
          <p className="text-2xl font-bold text-white">
            ${account.current_balance.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-sm">Profit/Loss</p>
          <p className={`text-2xl font-bold ${isProfit ? 'text-accent' : 'text-red-500'}`}>
            {isProfit ? '+' : ''}${profit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('balance')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                chartType === 'balance'
                  ? 'bg-accent/10 text-accent'
                  : 'bg-dark-700 text-text-secondary hover:text-white'
              }`}
            >
              Balance
            </button>
            <button
              onClick={() => setChartType('drawdown')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                chartType === 'drawdown'
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-dark-700 text-text-secondary hover:text-white'
              }`}
            >
              Drawdown
            </button>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'balance' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#273449',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#CBD5E1' }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#34D399"
                  fill="url(#balanceGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#273449',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="p-4 space-y-4">
        {/* Max Drawdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${getStatusColor(drawdownPercent)}`} />
              <span className="text-sm text-text-secondary">Max Drawdown</span>
            </div>
            <span className={`text-sm font-bold ${getStatusColor(drawdownPercent)}`}>
              {drawdownPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(drawdownPercent)} transition-all duration-500`}
              style={{ width: `${Math.min(100, drawdownPercent)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            ${currentDrawdown.toLocaleString()} / ${maxDrawdownAmount.toLocaleString()}
          </p>
        </div>

        {/* Daily Loss */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className={`w-4 h-4 ${getStatusColor(dailyLossPercent)}`} />
              <span className="text-sm text-text-secondary">Daily Loss</span>
            </div>
            <span className={`text-sm font-bold ${getStatusColor(dailyLossPercent)}`}>
              {dailyLossPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColor(dailyLossPercent)} transition-all duration-500`}
              style={{ width: `${Math.min(100, dailyLossPercent)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            ${account.current_daily_loss.toLocaleString()} / ${account.daily_loss_limit.toLocaleString()}
          </p>
        </div>

        {/* Profit Target */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-secondary">Profit Target</span>
            </div>
            <span className="text-sm font-bold text-accent">
              {Math.min(100, profitTargetPercent).toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-hover transition-all duration-500"
              style={{ width: `${Math.min(100, profitTargetPercent)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            ${Math.max(0, profit).toLocaleString()} / ${profitTargetAmount.toLocaleString()}
          </p>
        </div>

        {/* Days Remaining */}
        {daysRemaining !== null && (
          <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg mt-4">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${daysRemaining <= 7 ? 'text-yellow-500' : 'text-text-secondary'}`} />
              <span className="text-sm text-text-secondary">Days Remaining</span>
            </div>
            <span className={`text-lg font-bold ${daysRemaining <= 7 ? 'text-yellow-500' : 'text-white'}`}>
              {daysRemaining}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate mock history for demo purposes
function generateMockHistory(account: Account) {
  const data = [];
  const days = 14;
  let balance = account.initial_balance;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random fluctuation
    const change = (Math.random() - 0.45) * (account.initial_balance * 0.02);
    balance = Math.max(account.initial_balance * 0.9, balance + change);
    
    // On last day, use actual balance
    if (i === 0) balance = account.current_balance;
    
    const drawdown = Math.max(0, account.initial_balance - balance);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.round(balance),
      drawdown: Math.round(drawdown),
    });
  }
  
  return data;
}
