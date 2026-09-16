'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface Account {
  id: string;
  prop_firm: string;
  today_pnl: number;
}

interface UpdatePnlModalProps {
  account: Account;
  onClose: () => void;
}

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

      if (!res.ok) throw new Error('Failed to update');
      window.location.reload();
    } catch {
      setError('Failed to update. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-bg-elevated rounded-xl border border-border w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Update Today&apos;s P&L</h2>
            <p className="text-sm text-text-muted">{account.prop_firm}</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white hover:bg-dark-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-2">Today&apos;s P&L (USD)</label>
          <input
            type="number"
            value={pnl}
            onChange={(e) => setPnl(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 bg-dark-700 border border-border rounded-lg text-white text-lg placeholder-text-muted focus:outline-none focus:border-accent"
            autoFocus
          />
        </div>

        <div className="flex gap-2 mb-6">
          {[-500, -100, 100, 500].map((amt) => (
            <button
              key={amt}
              onClick={() => setPnl((parseFloat(pnl) || 0 + amt).toString())}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                amt < 0 ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-accent/10 text-accent hover:bg-accent/30'
              }`}
            >
              {amt > 0 ? '+' : ''}${Math.abs(amt)}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent-hover hover:brightness-110 disabled:bg-dark-600 disabled:text-text-muted text-white font-medium rounded-lg transition-colors"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Saving...' : 'Save P&L'}
        </button>
      </div>
    </div>
  );
}
