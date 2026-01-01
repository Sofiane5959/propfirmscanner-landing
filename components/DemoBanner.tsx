'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

interface DemoBannerProps {
  toolName: string;
}

export function DemoBanner({ toolName }: DemoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-white">
              Demo Tool
            </p>
            <p className="text-sm text-gray-400">
              This is a demo {toolName}. Full account tracking with your real data is available in My Prop Firms.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Open in My Prop Firms
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
