'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  prop_firm: string;
  today_pnl: number;
}

interface UpdatePnlModalProps {
  account: Account;
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function UpdatePnlModal({ account, onClose }: UpdatePnlModalProps) {
  const [pnl, setPnl] = useState(account.today_pnl.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const pnlValue = parseFloat(pnl);
    if (isNaN(pnlValue)) {
      setError('Please enter a valid number');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/accounts/update-pnl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: account.id,
          today_pnl: pnlValue,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update');
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch {
      setError('Failed to update. Please try again.');
      setIsSaving(false);
    }
  };

  const handleQuickSet = (value: number) => {
    setPnl((parseFloat(pnl) || 0 + value).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-800 w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Update Today&apos;s P&L</h2>
            <p className="text-sm text-gray-500">{account.prop_firm}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Today&apos;s P&L (USD)
          </label>
          <input
            type="number"
            value={pnl}
            onChange={(e) => setPnl(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg placeholder-gray-600 focus:outline-none focus:border-emerald-500"
            autoFocus
          />
        </div>

        {/* Quick adjustments */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleQuickSet(-500)}
            className="flex-1 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            -$500
          </button>
          <button
            onClick={() => handleQuickSet(-100)}
            className="flex-1 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            -$100
          </button>
          <button
            onClick={() => handleQuickSet(100)}
            className="flex-1 py-2 text-sm bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors"
          >
            +$100
          </button>
          <button
            onClick={() => handleQuickSet(500)}
            className="flex-1 py-2 text-sm bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg transition-colors"
          >
            +$500
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save P&L
            </>
          )}
        </button>
      </div>
    </div>
  );
}
