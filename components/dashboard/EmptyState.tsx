'use client';

import Link from 'next/link';
import { FolderPlus, Shield, Zap, TrendingUp } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FolderPlus className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to Your Control Center
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Start tracking your prop firm accounts to monitor your risk and never accidentally break a rule.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          <FolderPlus className="w-5 h-5" />
          Add Your First Account
        </Link>
      </div>

      {/* Features */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Track Risk</h3>
          <p className="text-sm text-gray-400">
            Monitor your daily and max drawdown buffers in real-time.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Simulate Trades</h3>
          <p className="text-sm text-gray-400">
            Test trade ideas before risking real capital.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Stay Compliant</h3>
          <p className="text-sm text-gray-400">
            Get warnings before you accidentally break any rules.
          </p>
        </div>
      </div>
    </div>
  );
}
