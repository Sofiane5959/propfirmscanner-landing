'use client';

import Link from 'next/link';
import { Plus, Shield, BarChart3, AlertTriangle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-gray-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">
          No accounts yet
        </h1>
        
        <p className="text-gray-400 mb-8">
          Add your first prop firm account to start tracking your risk.
        </p>

        <Link
          href="/dashboard/accounts/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </Link>

        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-900 rounded-xl">
            <BarChart3 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Track DD buffers</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">See risks</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-xl">
            <Shield className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Simulate trades</p>
          </div>
        </div>
      </div>
    </div>
  );
}
