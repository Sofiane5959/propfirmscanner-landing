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
      <div className="relative bg-bg-elevated rounded-xl border border-border w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Update Today&apos;s P&L</h2>
            <p className="text-sm text-text-muted">{account.prop_firm}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-white hover:bg-dark-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">
            Today&apos;s P&L (USD)
          </label>
          <input
            type="number"
            value={pnl}
            onChange={(e) => setPnl(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 bg-dark-700 border border-border rounded-lg text-white text-lg placeholder-text-muted focus:outline-none focus:border-accent"
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
            className="flex-1 py-2 text-sm bg-accent/10 text-accent hover:bg-accent/30 rounded-lg transition-colors"
          >
            +$100
          </button>
          <button
            onClick={() => handleQuickSet(500)}
            className="flex-1 py-2 text-sm bg-accent/10 text-accent hover:bg-accent/30 rounded-lg transition-colors"
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
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent-hover hover:brightness-110 disabled:bg-dark-600 disabled:text-text-muted text-white font-medium rounded-lg transition-colors"
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
