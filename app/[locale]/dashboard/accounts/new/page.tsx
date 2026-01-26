'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/providers/AuthProvider';
import {
  ArrowLeft,
  Loader2,
  Target,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  CheckCircle,
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
    backToDashboard: 'Back to Dashboard',
    addNewChallenge: 'Add New Challenge Account',
    trackProgress: 'Track your prop firm challenge progress',
    accountAdded: 'Account Added!',
    redirecting: 'Redirecting to dashboard...',
    // Sections
    accountDetails: 'Account Details',
    balanceTargets: 'Balance & Targets',
    challengeRules: 'Challenge Rules',
    challengeDuration: 'Challenge Duration',
    // Fields
    accountName: 'Account Name',
    accountNamePlaceholder: 'e.g., FTMO 100k Phase 1',
    propFirm: 'Prop Firm',
    selectFirm: 'Select a firm...',
    firmName: 'Firm Name',
    enterFirmName: 'Enter firm name',
    initialBalance: 'Initial Balance ($)',
    currentBalance: 'Current Balance ($)',
    maxDrawdown: 'Max Drawdown (%)',
    dailyLossLimit: 'Daily Loss Limit ($)',
    profitTarget: 'Profit Target (%)',
    challengeEndDate: 'Challenge End Date (optional)',
    leaveEmpty: "Leave empty if there's no time limit",
    // Actions
    cancel: 'Cancel',
    addAccount: 'Add Account',
    adding: 'Adding...',
    // Errors
    selectOrEnterFirm: 'Please select or enter a firm name',
    failedToAdd: 'Failed to add account',
  },
  fr: {
    backToDashboard: 'Retour au Tableau de Bord',
    addNewChallenge: 'Ajouter un Nouveau Compte Challenge',
    trackProgress: 'Suivez la progression de votre challenge prop firm',
    accountAdded: 'Compte Ajouté !',
    redirecting: 'Redirection vers le tableau de bord...',
    accountDetails: 'Détails du Compte',
    balanceTargets: 'Solde & Objectifs',
    challengeRules: 'Règles du Challenge',
    challengeDuration: 'Durée du Challenge',
    accountName: 'Nom du Compte',
    accountNamePlaceholder: 'ex: FTMO 100k Phase 1',
    propFirm: 'Prop Firm',
    selectFirm: 'Sélectionner une firm...',
    firmName: 'Nom de la Firm',
    enterFirmName: 'Entrer le nom de la firm',
    initialBalance: 'Solde Initial ($)',
    currentBalance: 'Solde Actuel ($)',
    maxDrawdown: 'Drawdown Max (%)',
    dailyLossLimit: 'Limite de Perte Journalière ($)',
    profitTarget: 'Objectif de Profit (%)',
    challengeEndDate: 'Date de Fin du Challenge (optionnel)',
    leaveEmpty: "Laisser vide s'il n'y a pas de limite de temps",
    cancel: 'Annuler',
    addAccount: 'Ajouter le Compte',
    adding: 'Ajout...',
    selectOrEnterFirm: 'Veuillez sélectionner ou entrer un nom de firm',
    failedToAdd: "Échec de l'ajout du compte",
  },
  de: {
    backToDashboard: 'Zurück zum Dashboard',
    addNewChallenge: 'Neues Challenge-Konto Hinzufügen',
    trackProgress: 'Verfolgen Sie Ihren Prop Firm Challenge Fortschritt',
    accountAdded: 'Konto Hinzugefügt!',
    redirecting: 'Weiterleitung zum Dashboard...',
    accountDetails: 'Kontodetails',
    balanceTargets: 'Saldo & Ziele',
    challengeRules: 'Challenge-Regeln',
    challengeDuration: 'Challenge-Dauer',
    accountName: 'Kontoname',
    accountNamePlaceholder: 'z.B., FTMO 100k Phase 1',
    propFirm: 'Prop Firm',
    selectFirm: 'Firma auswählen...',
    firmName: 'Firmenname',
    enterFirmName: 'Firmennamen eingeben',
    initialBalance: 'Anfangssaldo ($)',
    currentBalance: 'Aktueller Saldo ($)',
    maxDrawdown: 'Max Drawdown (%)',
    dailyLossLimit: 'Tägliches Verlustlimit ($)',
    profitTarget: 'Gewinnziel (%)',
    challengeEndDate: 'Challenge-Enddatum (optional)',
    leaveEmpty: 'Leer lassen, wenn kein Zeitlimit besteht',
    cancel: 'Abbrechen',
    addAccount: 'Konto Hinzufügen',
    adding: 'Wird hinzugefügt...',
    selectOrEnterFirm: 'Bitte wählen oder geben Sie einen Firmennamen ein',
    failedToAdd: 'Konto konnte nicht hinzugefügt werden',
  },
  es: {
    backToDashboard: 'Volver al Panel',
    addNewChallenge: 'Agregar Nueva Cuenta de Desafío',
    trackProgress: 'Rastrea el progreso de tu desafío prop firm',
    accountAdded: '¡Cuenta Agregada!',
    redirecting: 'Redirigiendo al panel...',
    accountDetails: 'Detalles de la Cuenta',
    balanceTargets: 'Saldo y Objetivos',
    challengeRules: 'Reglas del Desafío',
    challengeDuration: 'Duración del Desafío',
    accountName: 'Nombre de la Cuenta',
    accountNamePlaceholder: 'ej: FTMO 100k Fase 1',
    propFirm: 'Prop Firm',
    selectFirm: 'Seleccionar una firma...',
    firmName: 'Nombre de la Firma',
    enterFirmName: 'Ingresar nombre de la firma',
    initialBalance: 'Saldo Inicial ($)',
    currentBalance: 'Saldo Actual ($)',
    maxDrawdown: 'Drawdown Máximo (%)',
    dailyLossLimit: 'Límite de Pérdida Diaria ($)',
    profitTarget: 'Objetivo de Ganancia (%)',
    challengeEndDate: 'Fecha de Fin del Desafío (opcional)',
    leaveEmpty: 'Dejar vacío si no hay límite de tiempo',
    cancel: 'Cancelar',
    addAccount: 'Agregar Cuenta',
    adding: 'Agregando...',
    selectOrEnterFirm: 'Por favor selecciona o ingresa un nombre de firma',
    failedToAdd: 'Error al agregar la cuenta',
  },
  pt: {
    backToDashboard: 'Voltar ao Painel',
    addNewChallenge: 'Adicionar Nova Conta de Desafio',
    trackProgress: 'Acompanhe o progresso do seu desafio prop firm',
    accountAdded: 'Conta Adicionada!',
    redirecting: 'Redirecionando para o painel...',
    accountDetails: 'Detalhes da Conta',
    balanceTargets: 'Saldo e Metas',
    challengeRules: 'Regras do Desafio',
    challengeDuration: 'Duração do Desafio',
    accountName: 'Nome da Conta',
    accountNamePlaceholder: 'ex: FTMO 100k Fase 1',
    propFirm: 'Prop Firm',
    selectFirm: 'Selecionar uma firma...',
    firmName: 'Nome da Firma',
    enterFirmName: 'Digite o nome da firma',
    initialBalance: 'Saldo Inicial ($)',
    currentBalance: 'Saldo Atual ($)',
    maxDrawdown: 'Drawdown Máximo (%)',
    dailyLossLimit: 'Limite de Perda Diária ($)',
    profitTarget: 'Meta de Lucro (%)',
    challengeEndDate: 'Data de Término do Desafio (opcional)',
    leaveEmpty: 'Deixe vazio se não houver limite de tempo',
    cancel: 'Cancelar',
    addAccount: 'Adicionar Conta',
    adding: 'Adicionando...',
    selectOrEnterFirm: 'Por favor selecione ou digite um nome de firma',
    failedToAdd: 'Falha ao adicionar conta',
  },
  ar: {
    backToDashboard: 'العودة للوحة التحكم',
    addNewChallenge: 'إضافة حساب تحدي جديد',
    trackProgress: 'تتبع تقدم تحدي شركة التداول',
    accountAdded: 'تمت إضافة الحساب!',
    redirecting: 'جاري التوجيه للوحة التحكم...',
    accountDetails: 'تفاصيل الحساب',
    balanceTargets: 'الرصيد والأهداف',
    challengeRules: 'قواعد التحدي',
    challengeDuration: 'مدة التحدي',
    accountName: 'اسم الحساب',
    accountNamePlaceholder: 'مثال: FTMO 100k المرحلة 1',
    propFirm: 'شركة التداول',
    selectFirm: 'اختر شركة...',
    firmName: 'اسم الشركة',
    enterFirmName: 'أدخل اسم الشركة',
    initialBalance: 'الرصيد الأولي ($)',
    currentBalance: 'الرصيد الحالي ($)',
    maxDrawdown: 'السحب الأقصى (%)',
    dailyLossLimit: 'حد الخسارة اليومية ($)',
    profitTarget: 'هدف الربح (%)',
    challengeEndDate: 'تاريخ انتهاء التحدي (اختياري)',
    leaveEmpty: 'اتركه فارغاً إذا لم يكن هناك حد زمني',
    cancel: 'إلغاء',
    addAccount: 'إضافة الحساب',
    adding: 'جاري الإضافة...',
    selectOrEnterFirm: 'يرجى اختيار أو إدخال اسم الشركة',
    failedToAdd: 'فشل إضافة الحساب',
  },
  hi: {
    backToDashboard: 'डैशबोर्ड पर वापस',
    addNewChallenge: 'नया चैलेंज अकाउंट जोड़ें',
    trackProgress: 'अपने प्रॉप फर्म चैलेंज की प्रगति ट्रैक करें',
    accountAdded: 'अकाउंट जोड़ा गया!',
    redirecting: 'डैशबोर्ड पर रीडायरेक्ट हो रहा है...',
    accountDetails: 'अकाउंट विवरण',
    balanceTargets: 'बैलेंस और लक्ष्य',
    challengeRules: 'चैलेंज नियम',
    challengeDuration: 'चैलेंज अवधि',
    accountName: 'अकाउंट का नाम',
    accountNamePlaceholder: 'जैसे: FTMO 100k फेज 1',
    propFirm: 'प्रॉप फर्म',
    selectFirm: 'फर्म चुनें...',
    firmName: 'फर्म का नाम',
    enterFirmName: 'फर्म का नाम दर्ज करें',
    initialBalance: 'प्रारंभिक बैलेंस ($)',
    currentBalance: 'वर्तमान बैलेंस ($)',
    maxDrawdown: 'मैक्स ड्रॉडाउन (%)',
    dailyLossLimit: 'दैनिक नुकसान सीमा ($)',
    profitTarget: 'प्रॉफिट टारगेट (%)',
    challengeEndDate: 'चैलेंज समाप्ति तिथि (वैकल्पिक)',
    leaveEmpty: 'अगर कोई समय सीमा नहीं है तो खाली छोड़ें',
    cancel: 'रद्द करें',
    addAccount: 'अकाउंट जोड़ें',
    adding: 'जोड़ा जा रहा है...',
    selectOrEnterFirm: 'कृपया फर्म का नाम चुनें या दर्ज करें',
    failedToAdd: 'अकाउंट जोड़ने में विफल',
  },
};

const POPULAR_FIRMS = [
  'FTMO',
  'Funded Next',
  'The Funded Trader',
  'True Forex Funds',
  'MyForexFunds',
  'E8 Funding',
  'Fidelcrest',
  'TopStep',
  'Apex Trader Funding',
  'Other',
];

export default function NewAccountPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    account_name: '',
    firm_name: '',
    custom_firm: '',
    initial_balance: '',
    current_balance: '',
    max_drawdown: '10',
    daily_loss_limit: '',
    profit_target: '10',
    challenge_end_date: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'initial_balance' && !formData.current_balance) {
      setFormData(prev => ({ ...prev, current_balance: value }));
    }

    if (name === 'initial_balance' && value) {
      const dailyLimit = parseFloat(value) * 0.05;
      setFormData(prev => ({ ...prev, daily_loss_limit: dailyLimit.toString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const firmName = formData.firm_name === 'Other' ? formData.custom_firm : formData.firm_name;

      if (!firmName) {
        throw new Error(t.selectOrEnterFirm);
      }

      const { error: insertError } = await supabase.from('challenge_accounts').insert({
        user_id: user.id,
        account_name: formData.account_name,
        firm_name: firmName,
        initial_balance: parseFloat(formData.initial_balance),
        current_balance: parseFloat(formData.current_balance),
        max_drawdown: parseFloat(formData.max_drawdown),
        daily_loss_limit: parseFloat(formData.daily_loss_limit) || 0,
        profit_target: parseFloat(formData.profit_target),
        current_daily_loss: 0,
        challenge_end_date: formData.challenge_end_date || null,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 2000);
    } catch (err: any) {
      console.error('Error adding account:', err);
      setError(err.message || t.failedToAdd);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t.accountAdded}</h1>
          <p className="text-gray-400">{t.redirecting}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToDashboard}
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            {t.addNewChallenge}
          </h1>
          <p className="text-gray-400 mt-1">{t.trackProgress}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Details */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              {t.accountDetails}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.accountName} *
                </label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  placeholder={t.accountNamePlaceholder}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.propFirm} *
                </label>
                <select
                  name="firm_name"
                  value={formData.firm_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="">{t.selectFirm}</option>
                  {POPULAR_FIRMS.map(firm => (
                    <option key={firm} value={firm}>{firm}</option>
                  ))}
                </select>
              </div>

              {formData.firm_name === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.firmName} *
                  </label>
                  <input
                    type="text"
                    name="custom_firm"
                    value={formData.custom_firm}
                    onChange={handleChange}
                    placeholder={t.enterFirmName}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Balance & Targets */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              {t.balanceTargets}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.initialBalance} *
                </label>
                <input
                  type="number"
                  name="initial_balance"
                  value={formData.initial_balance}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.currentBalance} *
                </label>
                <input
                  type="number"
                  name="current_balance"
                  value={formData.current_balance}
                  onChange={handleChange}
                  placeholder="100000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-400" />
              {t.challengeRules}
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.maxDrawdown}
                </label>
                <input
                  type="number"
                  name="max_drawdown"
                  value={formData.max_drawdown}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.dailyLossLimit}
                </label>
                <input
                  type="number"
                  name="daily_loss_limit"
                  value={formData.daily_loss_limit}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.profitTarget}
                </label>
                <input
                  type="number"
                  name="profit_target"
                  value={formData.profit_target}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              {t.challengeDuration}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.challengeEndDate}
              </label>
              <input
                type="date"
                name="challenge_end_date"
                value={formData.challenge_end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">{t.leaveEmpty}</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href={`/${locale}/dashboard`}
              className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-lg transition-colors"
            >
              {t.cancel}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.adding}
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  {t.addAccount}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
