'use client';

import { Sparkles } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DemoBadge({ className = '', size = 'sm' }: DemoBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size];

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20
        border border-violet-500/30 text-violet-400
        ${sizeClasses}
        ${className}
      `}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
      </span>
      Demo
    </span>
  );
}

interface DemoBannerProps {
  onAddAccount: () => void;
}

export function DemoBanner({ onAddAccount }: DemoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border border-violet-500/20 rounded-xl p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="font-medium text-white text-sm flex items-center gap-2">
              You&apos;re viewing demo data
              <DemoBadge />
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Add your own account to see your real risk metrics
            </p>
          </div>
        </div>
        
        <button
          onClick={onAddAccount}
          className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Add Your Account
        </button>
      </div>
    </div>
  );
}
