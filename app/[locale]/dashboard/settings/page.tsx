'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  User,
  Settings,
  ArrowLeft,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Calendar,
  Shield,
  Trash2,
} from 'lucide-react';
import NotificationSettings from '@/components/NotificationSettings';

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
    accountSettings: 'Account Settings',
    manageProfile: 'Manage your profile and preferences',
    // Profile section
    profileInformation: 'Profile Information',
    profilePictureSynced: 'Profile picture synced from Google',
    fullName: 'Full Name',
    enterYourName: 'Enter your name',
    emailAddress: 'Email Address',
    verified: 'Verified',
    unverified: 'Unverified',
    emailManagedByGoogle: 'Email is managed by Google and cannot be changed here.',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated successfully!',
    profileUpdateFailed: 'Failed to update profile. Please try again.',
    // Account info
    accountInformation: 'Account Information',
    email: 'Email',
    memberSince: 'Member Since',
    accountPlan: 'Account Plan',
    freePlan: 'Free Plan',
    upgrade: 'Upgrade',
    // Danger zone
    dangerZone: 'Danger Zone',
    deleteAccountWarning: 'Once you delete your account, there is no going back. Please be certain.',
    deleteAccount: 'Delete Account',
  },
  fr: {
    backToDashboard: 'Retour au Tableau de Bord',
    accountSettings: 'Paramètres du Compte',
    manageProfile: 'Gérez votre profil et vos préférences',
    profileInformation: 'Informations du Profil',
    profilePictureSynced: 'Photo de profil synchronisée depuis Google',
    fullName: 'Nom Complet',
    enterYourName: 'Entrez votre nom',
    emailAddress: 'Adresse Email',
    verified: 'Vérifié',
    unverified: 'Non vérifié',
    emailManagedByGoogle: "L'email est géré par Google et ne peut pas être modifié ici.",
    saveChanges: 'Enregistrer les Modifications',
    saving: 'Enregistrement...',
    profileUpdated: 'Profil mis à jour avec succès !',
    profileUpdateFailed: 'Échec de la mise à jour du profil. Veuillez réessayer.',
    accountInformation: 'Informations du Compte',
    email: 'Email',
    memberSince: 'Membre Depuis',
    accountPlan: 'Plan du Compte',
    freePlan: 'Plan Gratuit',
    upgrade: 'Mettre à Niveau',
    dangerZone: 'Zone de Danger',
    deleteAccountWarning: 'Une fois que vous supprimez votre compte, il n\'y a pas de retour. Soyez certain.',
    deleteAccount: 'Supprimer le Compte',
  },
  de: {
    backToDashboard: 'Zurück zum Dashboard',
    accountSettings: 'Kontoeinstellungen',
    manageProfile: 'Verwalten Sie Ihr Profil und Ihre Präferenzen',
    profileInformation: 'Profilinformationen',
    profilePictureSynced: 'Profilbild von Google synchronisiert',
    fullName: 'Vollständiger Name',
    enterYourName: 'Geben Sie Ihren Namen ein',
    emailAddress: 'E-Mail-Adresse',
    verified: 'Verifiziert',
    unverified: 'Nicht verifiziert',
    emailManagedByGoogle: 'E-Mail wird von Google verwaltet und kann hier nicht geändert werden.',
    saveChanges: 'Änderungen Speichern',
    saving: 'Wird gespeichert...',
    profileUpdated: 'Profil erfolgreich aktualisiert!',
    profileUpdateFailed: 'Profil konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.',
    accountInformation: 'Kontoinformationen',
    email: 'E-Mail',
    memberSince: 'Mitglied Seit',
    accountPlan: 'Kontoplan',
    freePlan: 'Kostenloser Plan',
    upgrade: 'Upgrade',
    dangerZone: 'Gefahrenzone',
    deleteAccountWarning: 'Sobald Sie Ihr Konto löschen, gibt es kein Zurück. Seien Sie sicher.',
    deleteAccount: 'Konto Löschen',
  },
  es: {
    backToDashboard: 'Volver al Panel',
    accountSettings: 'Configuración de Cuenta',
    manageProfile: 'Administra tu perfil y preferencias',
    profileInformation: 'Información del Perfil',
    profilePictureSynced: 'Foto de perfil sincronizada desde Google',
    fullName: 'Nombre Completo',
    enterYourName: 'Ingresa tu nombre',
    emailAddress: 'Dirección de Email',
    verified: 'Verificado',
    unverified: 'No verificado',
    emailManagedByGoogle: 'El email es gestionado por Google y no puede cambiarse aquí.',
    saveChanges: 'Guardar Cambios',
    saving: 'Guardando...',
    profileUpdated: '¡Perfil actualizado exitosamente!',
    profileUpdateFailed: 'Error al actualizar perfil. Por favor intenta de nuevo.',
    accountInformation: 'Información de Cuenta',
    email: 'Email',
    memberSince: 'Miembro Desde',
    accountPlan: 'Plan de Cuenta',
    freePlan: 'Plan Gratuito',
    upgrade: 'Mejorar',
    dangerZone: 'Zona de Peligro',
    deleteAccountWarning: 'Una vez que elimines tu cuenta, no hay vuelta atrás. Asegúrate.',
    deleteAccount: 'Eliminar Cuenta',
  },
  pt: {
    backToDashboard: 'Voltar ao Painel',
    accountSettings: 'Configurações da Conta',
    manageProfile: 'Gerencie seu perfil e preferências',
    profileInformation: 'Informações do Perfil',
    profilePictureSynced: 'Foto de perfil sincronizada do Google',
    fullName: 'Nome Completo',
    enterYourName: 'Digite seu nome',
    emailAddress: 'Endereço de Email',
    verified: 'Verificado',
    unverified: 'Não verificado',
    emailManagedByGoogle: 'O email é gerenciado pelo Google e não pode ser alterado aqui.',
    saveChanges: 'Salvar Alterações',
    saving: 'Salvando...',
    profileUpdated: 'Perfil atualizado com sucesso!',
    profileUpdateFailed: 'Falha ao atualizar perfil. Por favor tente novamente.',
    accountInformation: 'Informações da Conta',
    email: 'Email',
    memberSince: 'Membro Desde',
    accountPlan: 'Plano da Conta',
    freePlan: 'Plano Gratuito',
    upgrade: 'Atualizar',
    dangerZone: 'Zona de Perigo',
    deleteAccountWarning: 'Uma vez que você excluir sua conta, não há volta. Tenha certeza.',
    deleteAccount: 'Excluir Conta',
  },
  ar: {
    backToDashboard: 'العودة للوحة التحكم',
    accountSettings: 'إعدادات الحساب',
    manageProfile: 'إدارة ملفك الشخصي وتفضيلاتك',
    profileInformation: 'معلومات الملف الشخصي',
    profilePictureSynced: 'صورة الملف الشخصي متزامنة من Google',
    fullName: 'الاسم الكامل',
    enterYourName: 'أدخل اسمك',
    emailAddress: 'عنوان البريد الإلكتروني',
    verified: 'موثق',
    unverified: 'غير موثق',
    emailManagedByGoogle: 'البريد الإلكتروني يُدار بواسطة Google ولا يمكن تغييره هنا.',
    saveChanges: 'حفظ التغييرات',
    saving: 'جاري الحفظ...',
    profileUpdated: 'تم تحديث الملف الشخصي بنجاح!',
    profileUpdateFailed: 'فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
    accountInformation: 'معلومات الحساب',
    email: 'البريد الإلكتروني',
    memberSince: 'عضو منذ',
    accountPlan: 'خطة الحساب',
    freePlan: 'الخطة المجانية',
    upgrade: 'ترقية',
    dangerZone: 'منطقة الخطر',
    deleteAccountWarning: 'بمجرد حذف حسابك، لا يوجد عودة. كن متأكداً.',
    deleteAccount: 'حذف الحساب',
  },
  hi: {
    backToDashboard: 'डैशबोर्ड पर वापस',
    accountSettings: 'अकाउंट सेटिंग्स',
    manageProfile: 'अपनी प्रोफ़ाइल और प्राथमिकताएं प्रबंधित करें',
    profileInformation: 'प्रोफ़ाइल जानकारी',
    profilePictureSynced: 'प्रोफ़ाइल फ़ोटो Google से सिंक्रोनाइज़',
    fullName: 'पूरा नाम',
    enterYourName: 'अपना नाम दर्ज करें',
    emailAddress: 'ईमेल पता',
    verified: 'सत्यापित',
    unverified: 'असत्यापित',
    emailManagedByGoogle: 'ईमेल Google द्वारा प्रबंधित है और यहां बदला नहीं जा सकता।',
    saveChanges: 'परिवर्तन सहेजें',
    saving: 'सहेजा जा रहा है...',
    profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हुई!',
    profileUpdateFailed: 'प्रोफ़ाइल अपडेट विफल। कृपया पुनः प्रयास करें।',
    accountInformation: 'अकाउंट जानकारी',
    email: 'ईमेल',
    memberSince: 'सदस्य',
    accountPlan: 'अकाउंट प्लान',
    freePlan: 'मुफ्त प्लान',
    upgrade: 'अपग्रेड',
    dangerZone: 'खतरा क्षेत्र',
    deleteAccountWarning: 'एक बार अकाउंट हटाने के बाद वापसी नहीं। सुनिश्चित रहें।',
    deleteAccount: 'अकाउंट हटाएं',
  },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function SettingsPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  // Save profile
  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage({ type: 'success', text: t.profileUpdated });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: t.profileUpdateFailed });
    } finally {
      setSaving(false);
    }
  };

  // Date formatting
  const getLocaleDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    const localeMap: Record<Locale, string> = {
      en: 'en-US',
      fr: 'fr-FR',
      de: 'de-DE',
      es: 'es-ES',
      pt: 'pt-BR',
      ar: 'ar-SA',
      hi: 'hi-IN',
    };
    return date.toLocaleDateString(localeMap[locale], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToDashboard}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-400" />
            {t.accountSettings}
          </h1>
          <p className="text-gray-400 mt-1">{t.manageProfile}</p>
        </div>

        {/* Profile Section */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            {t.profileInformation}
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-400" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">{t.profilePictureSynced}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                placeholder={t.enterYourName}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.emailAddress}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 cursor-not-allowed"
                />
                {user.email_confirmed_at ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.verified}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {t.unverified}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.emailManagedByGoogle}</p>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg transition-colors font-medium"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? t.saving : t.saveChanges}
              </button>

              {/* Message */}
              {message && (
                <div
                  className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            {t.accountInformation}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-white">{t.email}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-white">{t.memberSince}</p>
                  <p className="text-sm text-gray-500">
                    {getLocaleDateString(user.created_at || new Date().toISOString())}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-white">{t.accountPlan}</p>
                  <p className="text-sm text-gray-500">{t.freePlan}</p>
                </div>
              </div>
              <Link
                href={`/${locale}/mypropfirm`}
                className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                {t.upgrade}
              </Link>
            </div>
          </div>
        </div>

        {/* Notification Settings Component */}
        <div className="mb-6">
          <NotificationSettings />
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            {t.dangerZone}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {t.deleteAccountWarning}
          </p>
          <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-sm">
            {t.deleteAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
