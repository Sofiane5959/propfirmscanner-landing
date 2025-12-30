'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Loader2, LogIn } from 'lucide-react';

interface AddToAccountsButtonProps {
  propFirm: string;
  propFirmSlug: string;
  program: string;
  accountSize: number;
  dailyDDPercent: number;
  maxDDPercent: number;
  isTrailing?: boolean;
  isLoggedIn: boolean;
  className?: string;
}

export function AddToAccountsButton({
  propFirm,
  propFirmSlug,
  program,
  accountSize,
  dailyDDPercent,
  maxDDPercent,
  isTrailing = false,
  isLoggedIn,
  className = '',
}: AddToAccountsButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!isLoggedIn) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=/dashboard&action=add-account&firm=${propFirmSlug}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/accounts/quick-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prop_firm: propFirm,
          prop_firm_slug: propFirmSlug,
          program,
          account_size: accountSize,
          daily_dd_percent: dailyDDPercent,
          max_dd_percent: maxDDPercent,
          is_trailing: isTrailing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.paywall) {
          router.push('/dashboard/upgrade');
          return;
        }
        setError(data.error || 'Failed to add account');
        return;
      }

      setIsAdded(true);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdded) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg ${className}`}
      >
        <Check className="w-4 h-4" />
        Added!
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleAdd}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding...
          </>
        ) : !isLoggedIn ? (
          <>
            <LogIn className="w-4 h-4" />
            Add to My Accounts
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add to My Accounts
          </>
        )}
      </button>
      
      {error && (
        <p className="absolute top-full mt-1 text-xs text-red-400 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
}
