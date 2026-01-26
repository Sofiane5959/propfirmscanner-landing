'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Loader2,
  Shield,
  ChevronLeft,
  Save,
  AlertTriangle,
} from 'lucide-react';

// =============================================================================
// LOCALE DETECTION & TRANSLATIONS
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    backToAccounts: 'Back to Accounts',
    backToDashboard: 'Back to Dashboard',
    editAccount: 'Edit Account',
    updateDetails: 'Update your challenge account details',
    comingSoon: 'Coming Soon',
    comingSoonDesc: 'Account editing is coming soon for Pro users.',
    accountNotFound: 'Account Not Found',
    accountNotFoundDesc: "This account doesn't exist or you don't have access to it.",
    // Sections
    accountInformation: 'Account Information',
    balance: 'Balance',
    challengeRules: 'Challenge Rules',
    dailyStatus: 'Daily Status',
    // Fields
    accountName: 'Account Name',
    accountNamePlaceholder: 'e.g., FTMO Challenge #1',
    firmName: 'Firm Name',
    firmNamePlaceholder: 'e.g., FTMO',
    initialBalance: 'Initial Balance ($)',
    currentBalance: 'Current Balance ($)',
    maxDrawdown: 'Max Drawdown (%)',
    dailyLossLimit: 'Daily Loss Limit (%)',
    profitTarget: 'Profit Target (%)',
    currentDailyLoss: 'Current Daily Loss ($)',
    challengeEndDate: 'Challenge End Date',
    // Actions
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    failedToUpdate: 'Failed to update account',
  },
  fr: {
    backToAccounts: 'Retour aux Comptes',
    backToDashboard: 'Retour au Tableau de Bord',
    editAccount: 'Modifier le Compte',
    updateDetails: 'Mettre à jour les détails de votre compte challenge',
    comingSoon: 'Bientôt Disponible',
    comingSoonDesc: 'La modification de compte arrive bientôt pour les utilisateurs Pro.',
    accountNotFound: 'Compte Non Trouvé',
    accountNotFoundDesc: "Ce compte n'existe pas ou vous n'y avez pas accès.",
    accountInformation: 'Informations du Compte',
    balance: 'Solde',
    challengeRules: 'Règles du Challenge',
    dailyStatus: 'Statut Journalier',
    accountName: 'Nom du Compte',
    accountNamePlaceholder: 'ex: FTMO Challenge #1',
    firmName: 'Nom de la Firm',
    firmNamePlaceholder: 'ex: FTMO',
    initialBalance: 'Solde Initial ($)',
    currentBalance: 'Solde Actuel ($)',
    maxDrawdown: 'Drawdown Max (%)',
    dailyLossLimit: 'Limite Perte Journalière (%)',
    profitTarget: 'Objectif de Profit (%)',
    currentDailyLoss: 'Perte Journalière Actuelle ($)',
    challengeEndDate: 'Date de Fin du Challenge',
    cancel: 'Annuler',
    saveChanges: 'Enregistrer',
    saving: 'Enregistrement...',
    failedToUpdate: 'Échec de la mise à jour du compte',
  },
  de: {
    backToAccounts: 'Zurück zu Konten',
    backToDashboard: 'Zurück zum Dashboard',
    editAccount: 'Konto Bearbeiten',
    updateDetails: 'Aktualisieren Sie Ihre Challenge-Kontodetails',
    comingSoon: 'Demnächst Verfügbar',
    comingSoonDesc: 'Kontobearbeitung kommt bald für Pro-Benutzer.',
    accountNotFound: 'Konto Nicht Gefunden',
    accountNotFoundDesc: 'Dieses Konto existiert nicht oder Sie haben keinen Zugriff.',
    accountInformation: 'Kontoinformationen',
    balance: 'Saldo',
    challengeRules: 'Challenge-Regeln',
    dailyStatus: 'Tagesstatus',
    accountName: 'Kontoname',
    accountNamePlaceholder: 'z.B., FTMO Challenge #1',
    firmName: 'Firmenname',
    firmNamePlaceholder: 'z.B., FTMO',
    initialBalance: 'Anfangssaldo ($)',
    currentBalance: 'Aktueller Saldo ($)',
    maxDrawdown: 'Max Drawdown (%)',
    dailyLossLimit: 'Tägliches Verlustlimit (%)',
    profitTarget: 'Gewinnziel (%)',
    currentDailyLoss: 'Aktueller Tagesverlust ($)',
    challengeEndDate: 'Challenge-Enddatum',
    cancel: 'Abbrechen',
    saveChanges: 'Speichern',
    saving: 'Wird gespeichert...',
    failedToUpdate: 'Konto konnte nicht aktualisiert werden',
  },
  es: {
    backToAccounts: 'Volver a Cuentas',
    backToDashboard: 'Volver al Panel',
    editAccount: 'Editar Cuenta',
    updateDetails: 'Actualiza los detalles de tu cuenta de desafío',
    comingSoon: 'Próximamente',
    comingSoonDesc: 'La edición de cuentas llegará pronto para usuarios Pro.',
    accountNotFound: 'Cuenta No Encontrada',
    accountNotFoundDesc: 'Esta cuenta no existe o no tienes acceso a ella.',
    accountInformation: 'Información de la Cuenta',
    balance: 'Saldo',
    challengeRules: 'Reglas del Desafío',
    dailyStatus: 'Estado Diario',
    accountName: 'Nombre de la Cuenta',
    accountNamePlaceholder: 'ej: FTMO Challenge #1',
    firmName: 'Nombre de la Firma',
    firmNamePlaceholder: 'ej: FTMO',
    initialBalance: 'Saldo Inicial ($)',
    currentBalance: 'Saldo Actual ($)',
    maxDrawdown: 'Drawdown Máximo (%)',
    dailyLossLimit: 'Límite Pérdida Diaria (%)',
    profitTarget: 'Objetivo de Ganancia (%)',
    currentDailyLoss: 'Pérdida Diaria Actual ($)',
    challengeEndDate: 'Fecha Fin del Desafío',
    cancel: 'Cancelar',
    saveChanges: 'Guardar',
    saving: 'Guardando...',
    failedToUpdate: 'Error al actualizar la cuenta',
  },
  pt: {
    backToAccounts: 'Voltar às Contas',
    backToDashboard: 'Voltar ao Painel',
    editAccount: 'Editar Conta',
    updateDetails: 'Atualize os detalhes da sua conta de desafio',
    comingSoon: 'Em Breve',
    comingSoonDesc: 'Edição de contas em breve para usuários Pro.',
    accountNotFound: 'Conta Não Encontrada',
    accountNotFoundDesc: 'Esta conta não existe ou você não tem acesso.',
    accountInformation: 'Informações da Conta',
    balance: 'Saldo',
    challengeRules: 'Regras do Desafio',
    dailyStatus: 'Status Diário',
    accountName: 'Nome da Conta',
    accountNamePlaceholder: 'ex: FTMO Challenge #1',
    firmName: 'Nome da Firma',
    firmNamePlaceholder: 'ex: FTMO',
    initialBalance: 'Saldo Inicial ($)',
    currentBalance: 'Saldo Atual ($)',
    maxDrawdown: 'Drawdown Máximo (%)',
    dailyLossLimit: 'Limite Perda Diária (%)',
    profitTarget: 'Meta de Lucro (%)',
    currentDailyLoss: 'Perda Diária Atual ($)',
    challengeEndDate: 'Data Fim do Desafio',
    cancel: 'Cancelar',
    saveChanges: 'Salvar',
    saving: 'Salvando...',
    failedToUpdate: 'Falha ao atualizar conta',
  },
  ar: {
    backToAccounts: 'العودة للحسابات',
    backToDashboard: 'العودة للوحة التحكم',
    editAccount: 'تعديل الحساب',
    updateDetails: 'تحديث تفاصيل حساب التحدي',
    comingSoon: 'قريباً',
    comingSoonDesc: 'تعديل الحسابات قادم قريباً لمستخدمي Pro.',
    accountNotFound: 'الحساب غير موجود',
    accountNotFoundDesc: 'هذا الحساب غير موجود أو ليس لديك صلاحية الوصول.',
    accountInformation: 'معلومات الحساب',
    balance: 'الرصيد',
    challengeRules: 'قواعد التحدي',
    dailyStatus: 'الحالة اليومية',
    accountName: 'اسم الحساب',
    accountNamePlaceholder: 'مثال: FTMO Challenge #1',
    firmName: 'اسم الشركة',
    firmNamePlaceholder: 'مثال: FTMO',
    initialBalance: 'الرصيد الأولي ($)',
    currentBalance: 'الرصيد الحالي ($)',
    maxDrawdown: 'السحب الأقصى (%)',
    dailyLossLimit: 'حد الخسارة اليومية (%)',
    profitTarget: 'هدف الربح (%)',
    currentDailyLoss: 'الخسارة اليومية الحالية ($)',
    challengeEndDate: 'تاريخ انتهاء التحدي',
    cancel: 'إلغاء',
    saveChanges: 'حفظ',
    saving: 'جاري الحفظ...',
    failedToUpdate: 'فشل تحديث الحساب',
  },
  hi: {
    backToAccounts: 'अकाउंट्स पर वापस',
    backToDashboard: 'डैशबोर्ड पर वापस',
    editAccount: 'अकाउंट संपादित करें',
    updateDetails: 'अपने चैलेंज अकाउंट की जानकारी अपडेट करें',
    comingSoon: 'जल्द आ रहा है',
    comingSoonDesc: 'Pro उपयोगकर्ताओं के लिए अकाउंट एडिटिंग जल्द आ रही है।',
    accountNotFound: 'अकाउंट नहीं मिला',
    accountNotFoundDesc: 'यह अकाउंट मौजूद नहीं है या आपके पास पहुंच नहीं है।',
    accountInformation: 'अकाउंट जानकारी',
    balance: 'बैलेंस',
    challengeRules: 'चैलेंज नियम',
    dailyStatus: 'दैनिक स्थिति',
    accountName: 'अकाउंट का नाम',
    accountNamePlaceholder: 'जैसे: FTMO Challenge #1',
    firmName: 'फर्म का नाम',
    firmNamePlaceholder: 'जैसे: FTMO',
    initialBalance: 'प्रारंभिक बैलेंस ($)',
    currentBalance: 'वर्तमान बैलेंस ($)',
    maxDrawdown: 'मैक्स ड्रॉडाउन (%)',
    dailyLossLimit: 'दैनिक नुकसान सीमा (%)',
    profitTarget: 'प्रॉफिट टारगेट (%)',
    currentDailyLoss: 'वर्तमान दैनिक नुकसान ($)',
    challengeEndDate: 'चैलेंज समाप्ति तिथि',
    cancel: 'रद्द करें',
    saveChanges: 'सहेजें',
    saving: 'सहेजा जा रहा है...',
    failedToUpdate: 'अकाउंट अपडेट करने में विफल',
  },
};

const ALLOWED_EMAILS = ['brik.sofiane1991@gmail.com'];

interface AccountForm {
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string;
}

export default function EditAccountPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  
  const accountId = params.id as string;
  
  const [form, setForm] = useState<AccountForm>({
    account_name: '',
    firm_name: '',
    initial_balance: 0,
    current_balance: 0,
    max_drawdown: 10,
    daily_loss_limit: 5,
    profit_target: 10,
    current_daily_loss: 0,
    challenge_end_date: '',
  });
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!user || !accountId) return;
      
      try {
        const { data, error } = await supabase
          .from('challenge_accounts')
          .select('*')
          .eq('id', accountId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setForm({
            account_name: data.account_name || '',
            firm_name: data.firm_name || '',
            initial_balance: data.initial_balance || 0,
            current_balance: data.current_balance || 0,
            max_drawdown: data.max_drawdown || 10,
            daily_loss_limit: data.daily_loss_limit || 5,
            profit_target: data.profit_target || 10,
            current_daily_loss: data.current_daily_loss || 0,
            challenge_end_date: data.challenge_end_date ? data.challenge_end_date.split('T')[0] : '',
          });
        }
      } catch (error) {
        console.error('Error fetching account:', error);
        setError('Account not found');
      } finally {
        setLoadingAccount(false);
      }
    };

    if (user && accountId) {
      fetchAccount();
    }
  }, [user, accountId, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { error } = await supabase
        .from('challenge_accounts')
        .update({
          account_name: form.account_name,
          firm_name: form.firm_name,
          initial_balance: form.initial_balance,
          current_balance: form.current_balance,
          max_drawdown: form.max_drawdown,
          daily_loss_limit: form.daily_loss_limit,
          profit_target: form.profit_target,
          current_daily_loss: form.current_daily_loss,
          challenge_end_date: form.challenge_end_date || null,
        })
        .eq('id', accountId)
        .eq('user_id', user?.id);

      if (error) throw error;

      router.push(`/${locale}/dashboard/accounts`);
    } catch (error: any) {
      console.error('Error updating account:', error);
      setError(error.message || t.failedToUpdate);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loadingAccount) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isAllowed = ALLOWED_EMAILS.includes(user.email || '');
  
  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.comingSoon}</h1>
          <p className="text-gray-400 mb-6">{t.comingSoonDesc}</p>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'Account not found') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.accountNotFound}</h1>
          <p className="text-gray-400 mb-6">{t.accountNotFoundDesc}</p>
          <Link
            href={`/${locale}/dashboard/accounts`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backToAccounts}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/${locale}/dashboard/accounts`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backToAccounts}
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            {t.editAccount}
          </h1>
          <p className="text-gray-400 mt-1">{t.updateDetails}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {error && error !== 'Account not found' && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Account Info */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t.accountInformation}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.accountName}</label>
                <input
                  type="text"
                  value={form.account_name}
                  onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder={t.accountNamePlaceholder}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.firmName}</label>
                <input
                  type="text"
                  value={form.firm_name}
                  onChange={(e) => setForm({ ...form, firm_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder={t.firmNamePlaceholder}
                  required
                />
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t.balance}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.initialBalance}</label>
                <input
                  type="number"
                  value={form.initial_balance}
                  onChange={(e) => setForm({ ...form, initial_balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="100000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.currentBalance}</label>
                <input
                  type="number"
                  value={form.current_balance}
                  onChange={(e) => setForm({ ...form, current_balance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="102500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t.challengeRules}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.maxDrawdown}</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.max_drawdown}
                  onChange={(e) => setForm({ ...form, max_drawdown: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.dailyLossLimit}</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.daily_loss_limit}
                  onChange={(e) => setForm({ ...form, daily_loss_limit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.profitTarget}</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.profit_target}
                  onChange={(e) => setForm({ ...form, profit_target: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Daily Status */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{t.dailyStatus}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.currentDailyLoss}</label>
                <input
                  type="number"
                  value={form.current_daily_loss}
                  onChange={(e) => setForm({ ...form, current_daily_loss: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.challengeEndDate}</label>
                <input
                  type="date"
                  value={form.challenge_end_date}
                  onChange={(e) => setForm({ ...form, challenge_end_date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href={`/${locale}/dashboard/accounts`}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-center"
            >
              {t.cancel}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.saving}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t.saveChanges}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
