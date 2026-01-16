'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, AlertTriangle, Target, Clock, TrendingDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NotificationPreferences {
  email_enabled: boolean;
  drawdown_warning: boolean;
  drawdown_warning_threshold: number;
  drawdown_critical: boolean;
  drawdown_critical_threshold: number;
  daily_loss_warning: boolean;
  daily_loss_threshold: number;
  profit_target: boolean;
  challenge_expiring: boolean;
  challenge_expiring_days: number;
}

const defaultPreferences: NotificationPreferences = {
  email_enabled: true,
  drawdown_warning: true,
  drawdown_warning_threshold: 80,
  drawdown_critical: true,
  drawdown_critical_threshold: 95,
  daily_loss_warning: true,
  daily_loss_threshold: 80,
  profit_target: true,
  challenge_expiring: true,
  challenge_expiring_days: 7,
};

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Préférences sauvegardées!' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const response = await fetch('/api/alerts/test', {
        method: 'POST',
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Email de test envoyé!' });
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'envoi' });
    }
  };

  const Toggle = ({ 
    enabled, 
    onChange 
  }: { 
    enabled: boolean; 
    onChange: (val: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-emerald-500' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Bell className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Notifications</h2>
          <p className="text-gray-400 text-sm">Configurez vos alertes email</p>
        </div>
      </div>

      {/* Master Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-white font-medium">Notifications par email</p>
            <p className="text-gray-400 text-sm">Recevoir les alertes sur contact@propfirmscanner.org</p>
          </div>
        </div>
        <Toggle
          enabled={preferences.email_enabled}
          onChange={(val) => setPreferences({ ...preferences, email_enabled: val })}
        />
      </div>

      {preferences.email_enabled && (
        <div className="space-y-4">
          {/* Drawdown Warning */}
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-white font-medium">Alerte Drawdown</p>
                  <p className="text-gray-400 text-sm">Notification quand le drawdown approche</p>
                </div>
              </div>
              <Toggle
                enabled={preferences.drawdown_warning}
                onChange={(val) => setPreferences({ ...preferences, drawdown_warning: val })}
              />
            </div>
            {preferences.drawdown_warning && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Seuil:</span>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={preferences.drawdown_warning_threshold}
                  onChange={(e) => setPreferences({ 
                    ...preferences, 
                    drawdown_warning_threshold: parseInt(e.target.value) 
                  })}
                  className="flex-1 accent-yellow-500"
                />
                <span className="text-yellow-500 font-bold w-12">
                  {preferences.drawdown_warning_threshold}%
                </span>
              </div>
            )}
          </div>

          {/* Drawdown Critical */}
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-white font-medium">Alerte Critique</p>
                  <p className="text-gray-400 text-sm">Notification urgente proche de la limite</p>
                </div>
              </div>
              <Toggle
                enabled={preferences.drawdown_critical}
                onChange={(val) => setPreferences({ ...preferences, drawdown_critical: val })}
              />
            </div>
            {preferences.drawdown_critical && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Seuil:</span>
                <input
                  type="range"
                  min="85"
                  max="99"
                  value={preferences.drawdown_critical_threshold}
                  onChange={(e) => setPreferences({ 
                    ...preferences, 
                    drawdown_critical_threshold: parseInt(e.target.value) 
                  })}
                  className="flex-1 accent-red-500"
                />
                <span className="text-red-500 font-bold w-12">
                  {preferences.drawdown_critical_threshold}%
                </span>
              </div>
            )}
          </div>

          {/* Daily Loss Warning */}
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-white font-medium">Perte Journalière</p>
                  <p className="text-gray-400 text-sm">Alerte limite de perte du jour</p>
                </div>
              </div>
              <Toggle
                enabled={preferences.daily_loss_warning}
                onChange={(val) => setPreferences({ ...preferences, daily_loss_warning: val })}
              />
            </div>
            {preferences.daily_loss_warning && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Seuil:</span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={preferences.daily_loss_threshold}
                  onChange={(e) => setPreferences({ 
                    ...preferences, 
                    daily_loss_threshold: parseInt(e.target.value) 
                  })}
                  className="flex-1 accent-orange-500"
                />
                <span className="text-orange-500 font-bold w-12">
                  {preferences.daily_loss_threshold}%
                </span>
              </div>
            )}
          </div>

          {/* Profit Target */}
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-white font-medium">Objectif Atteint</p>
                  <p className="text-gray-400 text-sm">Notification quand l'objectif de profit est atteint</p>
                </div>
              </div>
              <Toggle
                enabled={preferences.profit_target}
                onChange={(val) => setPreferences({ ...preferences, profit_target: val })}
              />
            </div>
          </div>

          {/* Challenge Expiring */}
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-white font-medium">Expiration Challenge</p>
                  <p className="text-gray-400 text-sm">Rappel avant fin du challenge</p>
                </div>
              </div>
              <Toggle
                enabled={preferences.challenge_expiring}
                onChange={(val) => setPreferences({ ...preferences, challenge_expiring: val })}
              />
            </div>
            {preferences.challenge_expiring && (
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
                <span className="text-gray-400 text-sm">Rappel:</span>
                <select
                  value={preferences.challenge_expiring_days}
                  onChange={(e) => setPreferences({ 
                    ...preferences, 
                    challenge_expiring_days: parseInt(e.target.value) 
                  })}
                  className="bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600"
                >
                  <option value={3}>3 jours avant</option>
                  <option value={5}>5 jours avant</option>
                  <option value={7}>7 jours avant</option>
                  <option value={14}>14 jours avant</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={savePreferences}
          disabled={saving}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button
          onClick={sendTestEmail}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Tester
        </button>
      </div>
    </div>
  );
}
