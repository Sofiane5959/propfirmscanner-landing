'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Mail, Loader2, AlertCircle } from 'lucide-react';

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
    title: 'Sign In',
    subtitle: 'Access your personal space',
    continueGoogle: 'Continue with Google',
    continueEmail: 'Continue with Email (coming soon)',
    loading: 'Signing in...',
    or: 'or',
    terms: 'By signing in, you agree to our',
    termsLink: 'Terms of Service',
    and: 'and our',
    privacyLink: 'Privacy Policy',
    error: 'An error occurred. Please try again.',
    // Benefits
    multiAccount: 'Multi-accounts',
    multiAccountDesc: 'Manage all your prop firms',
    simulation: 'Simulation',
    simulationDesc: 'Test your trades',
    alerts: 'Alerts',
    alertsDesc: 'Never miss a rule',
    favorites: 'Favorites',
    favoritesDesc: 'Save your firms',
  },
  fr: {
    title: 'Connectez-vous',
    subtitle: 'Accédez à votre espace personnel',
    continueGoogle: 'Continuer avec Google',
    continueEmail: 'Continuer avec Email (bientôt)',
    loading: 'Connexion en cours...',
    or: 'ou',
    terms: 'En vous connectant, vous acceptez nos',
    termsLink: 'Conditions d\'utilisation',
    and: 'et notre',
    privacyLink: 'Politique de confidentialité',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    multiAccount: 'Multi-comptes',
    multiAccountDesc: 'Gérez toutes vos prop firms',
    simulation: 'Simulation',
    simulationDesc: 'Testez vos trades',
    alerts: 'Alertes',
    alertsDesc: 'Ne ratez aucune règle',
    favorites: 'Favoris',
    favoritesDesc: 'Sauvegardez vos firms',
  },
  de: {
    title: 'Anmelden',
    subtitle: 'Zugang zu Ihrem persönlichen Bereich',
    continueGoogle: 'Mit Google fortfahren',
    continueEmail: 'Mit E-Mail fortfahren (bald)',
    loading: 'Anmeldung läuft...',
    or: 'oder',
    terms: 'Mit der Anmeldung akzeptieren Sie unsere',
    termsLink: 'Nutzungsbedingungen',
    and: 'und unsere',
    privacyLink: 'Datenschutzrichtlinie',
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    multiAccount: 'Multi-Konten',
    multiAccountDesc: 'Verwalten Sie alle Ihre Prop Firms',
    simulation: 'Simulation',
    simulationDesc: 'Testen Sie Ihre Trades',
    alerts: 'Warnungen',
    alertsDesc: 'Verpassen Sie keine Regel',
    favorites: 'Favoriten',
    favoritesDesc: 'Speichern Sie Ihre Firms',
  },
  es: {
    title: 'Iniciar Sesión',
    subtitle: 'Accede a tu espacio personal',
    continueGoogle: 'Continuar con Google',
    continueEmail: 'Continuar con Email (próximamente)',
    loading: 'Iniciando sesión...',
    or: 'o',
    terms: 'Al iniciar sesión, aceptas nuestros',
    termsLink: 'Términos de Servicio',
    and: 'y nuestra',
    privacyLink: 'Política de Privacidad',
    error: 'Ocurrió un error. Por favor intenta de nuevo.',
    multiAccount: 'Multi-cuentas',
    multiAccountDesc: 'Gestiona todas tus prop firms',
    simulation: 'Simulación',
    simulationDesc: 'Prueba tus trades',
    alerts: 'Alertas',
    alertsDesc: 'No te pierdas ninguna regla',
    favorites: 'Favoritos',
    favoritesDesc: 'Guarda tus firms',
  },
  pt: {
    title: 'Entrar',
    subtitle: 'Acesse seu espaço pessoal',
    continueGoogle: 'Continuar com Google',
    continueEmail: 'Continuar com Email (em breve)',
    loading: 'Entrando...',
    or: 'ou',
    terms: 'Ao entrar, você concorda com nossos',
    termsLink: 'Termos de Serviço',
    and: 'e nossa',
    privacyLink: 'Política de Privacidade',
    error: 'Ocorreu um erro. Por favor, tente novamente.',
    multiAccount: 'Multi-contas',
    multiAccountDesc: 'Gerencie todas as suas prop firms',
    simulation: 'Simulação',
    simulationDesc: 'Teste seus trades',
    alerts: 'Alertas',
    alertsDesc: 'Não perca nenhuma regra',
    favorites: 'Favoritos',
    favoritesDesc: 'Salve suas firms',
  },
  ar: {
    title: 'تسجيل الدخول',
    subtitle: 'الوصول إلى مساحتك الشخصية',
    continueGoogle: 'المتابعة مع Google',
    continueEmail: 'المتابعة بالبريد الإلكتروني (قريباً)',
    loading: 'جاري تسجيل الدخول...',
    or: 'أو',
    terms: 'بتسجيل الدخول، أنت توافق على',
    termsLink: 'شروط الخدمة',
    and: 'و',
    privacyLink: 'سياسة الخصوصية',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    multiAccount: 'حسابات متعددة',
    multiAccountDesc: 'إدارة جميع شركاتك',
    simulation: 'محاكاة',
    simulationDesc: 'اختبر صفقاتك',
    alerts: 'تنبيهات',
    alertsDesc: 'لا تفوت أي قاعدة',
    favorites: 'المفضلة',
    favoritesDesc: 'احفظ شركاتك',
  },
  hi: {
    title: 'साइन इन करें',
    subtitle: 'अपने व्यक्तिगत स्थान तक पहुंचें',
    continueGoogle: 'Google से जारी रखें',
    continueEmail: 'ईमेल से जारी रखें (जल्द आ रहा है)',
    loading: 'साइन इन हो रहा है...',
    or: 'या',
    terms: 'साइन इन करके, आप हमारी',
    termsLink: 'सेवा की शर्तें',
    and: 'और हमारी',
    privacyLink: 'गोपनीयता नीति',
    error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    multiAccount: 'मल्टी-अकाउंट',
    multiAccountDesc: 'अपनी सभी प्रॉप फर्म्स प्रबंधित करें',
    simulation: 'सिमुलेशन',
    simulationDesc: 'अपने ट्रेड्स टेस्ट करें',
    alerts: 'अलर्ट',
    alertsDesc: 'कोई नियम न चूकें',
    favorites: 'पसंदीदा',
    favoritesDesc: 'अपनी फर्म्स सेव करें',
  },
};

// =============================================================================
// GOOGLE ICON COMPONENT
// =============================================================================

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// =============================================================================
// LOGIN PAGE
// =============================================================================

export default function LoginPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError(t.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white">PropFirmScanner</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {t.title}
          </h1>
          <p className="text-gray-400">
            {t.subtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-900 font-medium rounded-xl transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <GoogleIcon className="w-5 h-5" />
            )}
            {isLoading ? t.loading : t.continueGoogle}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-500">{t.or}</span>
            </div>
          </div>

          {/* Email Login (optional - for future) */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-gray-800 text-gray-500 font-medium rounded-xl cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            {t.continueEmail}
          </button>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-500">
            {t.terms}{' '}
            <Link href={`/${locale}/terms`} className="text-emerald-400 hover:underline">
              {t.termsLink}
            </Link>{' '}
            {t.and}{' '}
            <Link href={`/${locale}/privacy`} className="text-emerald-400 hover:underline">
              {t.privacyLink}
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-sm font-medium text-white">{t.multiAccount}</p>
            <p className="text-xs text-gray-500 mt-1">{t.multiAccountDesc}</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-sm font-medium text-white">{t.simulation}</p>
            <p className="text-xs text-gray-500 mt-1">{t.simulationDesc}</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-sm font-medium text-white">{t.alerts}</p>
            <p className="text-xs text-gray-500 mt-1">{t.alertsDesc}</p>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-sm font-medium text-white">{t.favorites}</p>
            <p className="text-xs text-gray-500 mt-1">{t.favoritesDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
