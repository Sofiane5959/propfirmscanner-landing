'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/providers/AuthProvider';
import {
  Bell,
  BellOff,
  X,
  Check,
  Loader2,
  AlertTriangle,
  Tag,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PriceAlertProps {
  firmId: string;
  firmName: string;
  firmSlug: string;
  currentPrice: number;
  onClose?: () => void;
}

interface Alert {
  id: string;
  firm_id: string;
  firm_name: string;
  firm_slug: string;
  target_price: number;
  current_price_at_creation: number;
  is_active: boolean;
  created_at: string;
}

// =============================================================================
// PRICE ALERT BUTTON (for cards)
// =============================================================================

export function PriceAlertButton({ 
  firmId, 
  firmName,
  firmSlug,
  currentPrice,
}: Omit<PriceAlertProps, 'onClose'>) {
  const [showModal, setShowModal] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  // Check if user has an alert for this firm
  useEffect(() => {
    const checkAlert = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('price_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('firm_id', firmId)
        .eq('is_active', true)
        .single();
      
      setHasAlert(!!data);
    };

    checkAlert();
  }, [user, firmId, supabase]);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`p-2 rounded-lg transition-colors ${
          hasAlert
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-dark-700 text-text-secondary hover:text-yellow-400 hover:bg-yellow-500/10'
        }`}
        title={hasAlert ? 'Alert active' : 'Set price alert'}
      >
        {hasAlert ? (
          <Bell className="w-4 h-4 fill-current" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
      </button>

      {showModal && (
        <PriceAlertModal
          firmId={firmId}
          firmName={firmName}
          firmSlug={firmSlug}
          currentPrice={currentPrice}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// =============================================================================
// PRICE ALERT MODAL
// =============================================================================

function PriceAlertModal({ firmId, firmName, firmSlug, currentPrice, onClose }: PriceAlertProps) {
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9)); // Default 10% less
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const discount = currentPrice > 0 
    ? Math.round(((currentPrice - targetPrice) / currentPrice) * 100)
    : 0;

  const handleSubmit = async () => {
    if (!user) return;
    if (targetPrice >= currentPrice) {
      setError('Target price must be lower than current price');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if alert already exists
      const { data: existing } = await supabase
        .from('price_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('firm_id', firmId)
        .eq('is_active', true)
        .single();

      if (existing) {
        // Update existing alert
        const { error } = await supabase
          .from('price_alerts')
          .update({
            target_price: targetPrice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new alert
        const { error } = await supabase
          .from('price_alerts')
          .insert({
            user_id: user.id,
            firm_id: firmId,
            firm_name: firmName,
            firm_slug: firmSlug,
            target_price: targetPrice,
            current_price_at_creation: currentPrice,
            is_active: true,
          });

        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (err) {
      console.error('Error creating alert:', err);
      setError('Failed to create alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-bg-elevated rounded-2xl border border-border p-6 w-full max-w-md">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Alert Created!</h3>
            <p className="text-text-secondary">
              We'll notify you when {firmName} drops to ${targetPrice}
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Bell className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Set Price Alert</h3>
                <p className="text-sm text-text-secondary">{firmName}</p>
              </div>
            </div>

            {/* Current Price */}
            <div className="bg-dark-700/50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Current Price</span>
                <span className="text-white font-semibold">${currentPrice}</span>
              </div>
            </div>

            {/* Target Price Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Alert me when price drops to
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 bg-dark-700 border border-border rounded-xl text-white 
                            focus:outline-none focus:border-yellow-500 transition-colors"
                  min={1}
                  max={currentPrice - 1}
                />
              </div>
            </div>

            {/* Discount Preview */}
            {discount > 0 && (
              <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg mb-4">
                <TrendingDown className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm">
                  You'll be notified at {discount}% discount
                </span>
              </div>
            )}

            {/* Quick Select */}
            <div className="flex gap-2 mb-6">
              {[10, 20, 30, 50].map(pct => (
                <button
                  key={pct}
                  onClick={() => setTargetPrice(Math.floor(currentPrice * (1 - pct / 100)))}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    discount === pct
                      ? 'bg-yellow-500 text-white'
                      : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
                  }`}
                >
                  -{pct}%
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || targetPrice >= currentPrice}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-dark-600 
                        text-white font-semibold rounded-xl transition-colors 
                        flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Alert...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Create Alert
                </>
              )}
            </button>

            {/* Note */}
            <p className="text-xs text-text-muted text-center mt-4">
              You'll receive an email when the price drops to your target
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MY ALERTS LIST (for dashboard)
// =============================================================================

export function MyAlertsList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAlerts(data);
      }
      setLoading(false);
    };

    fetchAlerts();
  }, [user, supabase]);

  const deleteAlert = async (id: string) => {
    const { error } = await supabase
      .from('price_alerts')
      .update({ is_active: false })
      .eq('id', id);

    if (!error) {
      setAlerts(alerts.filter(a => a.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <BellOff className="w-6 h-6 text-text-muted" />
        </div>
        <p className="text-text-secondary">No active alerts</p>
        <p className="text-text-muted text-sm mt-1">
          Set alerts on prop firms to get notified of price drops
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl"
        >
          <div>
            <h4 className="font-medium text-white">{alert.firm_name}</h4>
            <p className="text-sm text-text-secondary">
              Alert at <span className="text-yellow-400">${alert.target_price}</span>
              {' '}(was ${alert.current_price_at_creation})
            </p>
          </div>
          <button
            onClick={() => deleteAlert(alert.id)}
            className="p-2 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
