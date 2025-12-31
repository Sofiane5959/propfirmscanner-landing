'use client';

import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-white mb-1">My Prop Firms</h1>
          <p className="text-gray-400 text-sm">
            See all your prop firm accounts. Know your limits before you trade.
          </p>
        </div>
      </header>

      {/* Empty Content */}
      <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 150px)' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            No accounts yet
          </h2>
          
          <p className="text-gray-400 mb-8">
            Add your first prop firm account to start tracking your risk before each trade.
          </p>

          <Link
            href="/dashboard/accounts/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </Link>
        </div>
      </div>
    </div>
  );
}
