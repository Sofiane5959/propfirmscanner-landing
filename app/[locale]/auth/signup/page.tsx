'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Target, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

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
    title: 'Create Your Account',
    subtitle: 'Start comparing prop firms for free',
    freeIncludes: 'Free account includes:',
    benefit1: 'Save favorite prop firms',
    benefit2: 'Set up price alerts',
    benefit3: 'Track your comparisons',
    benefit4: 'Exclusive deals access',
    continueGoogle: 'Continue with Google',
    orEmail: 'or continue with email',
    name: 'Name',
    namePlaceholder: 'John Doe',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    minChars: 'Minimum 8 characters',
    agreeTerms: 'I agree to the',
    termsLink: 'Terms of Service',
    and: 'and',
    privacyLink: 'Privacy Policy',
    createAccount: 'Create Account',
    alreadyAccount: 'Already have an account?',
    signIn: 'Sign in',
    loading: 'Loading...',
    // Messages
    errorGeneral: 'An unexpected error occurred. Please try again.',
    errorEmailExists: 'This email is already registered. Please sign in instead.',
    successCreated: 'Account created successfully!',
    successCheckEmail: 'Account created! Please check your email to confirm your account.',
  },
  fr: {
    title: 'Créez Votre Compte',
    subtitle: 'Commencez à comparer les prop firms gratuitement',
    freeIncludes: 'Le compte gratuit inclut :',
    benefit1: 'Sauvegarder vos prop firms préférées',
    benefit2: 'Configurer des alertes de prix',
    benefit3: 'Suivre vos comparaisons',
    benefit4: 'Accès aux offres exclusives',
    continueGoogle: 'Continuer avec Google',
    orEmail: 'ou continuer avec email',
    name: 'Nom',
    namePlaceholder: 'Jean Dupont',
    email: 'Email',
    emailPlaceholder: 'vous@exemple.com',
    password: 'Mot de passe',
    minChars: 'Minimum 8 caractères',
    agreeTerms: 'J\'accepte les',
    termsLink: 'Conditions d\'utilisation',
    and: 'et la',
    privacyLink: 'Politique de confidentialité',
    createAccount: 'Créer un Compte',
    alreadyAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    loading: 'Chargement...',
    errorGeneral: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
    errorEmailExists: 'Cet email est déjà enregistré. Veuillez vous connecter.',
    successCreated: 'Compte créé avec succès !',
    successCheckEmail: 'Compte créé ! Veuillez vérifier votre email pour confirmer.',
  },
  de: {
    title: 'Konto Erstellen',
    subtitle: 'Vergleichen Sie Prop Firms kostenlos',
    freeIncludes: 'Kostenloses Konto beinhaltet:',
    benefit1: 'Lieblings-Prop-Firms speichern',
    benefit2: 'Preisalarme einrichten',
    benefit3: 'Vergleiche verfolgen',
    benefit4: 'Zugang zu exklusiven Angeboten',
    continueGoogle: 'Mit Google fortfahren',
    orEmail: 'oder mit E-Mail fortfahren',
    name: 'Name',
    namePlaceholder: 'Max Mustermann',
    email: 'E-Mail',
    emailPlaceholder: 'sie@beispiel.de',
    password: 'Passwort',
    minChars: 'Mindestens 8 Zeichen',
    agreeTerms: 'Ich akzeptiere die',
    termsLink: 'Nutzungsbedingungen',
    and: 'und die',
    privacyLink: 'Datenschutzrichtlinie',
    createAccount: 'Konto Erstellen',
    alreadyAccount: 'Bereits ein Konto?',
    signIn: 'Anmelden',
    loading: 'Laden...',
    errorGeneral: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    errorEmailExists: 'Diese E-Mail ist bereits registriert. Bitte melden Sie sich an.',
    successCreated: 'Konto erfolgreich erstellt!',
    successCheckEmail: 'Konto erstellt! Bitte überprüfen Sie Ihre E-Mail zur Bestätigung.',
  },
  es: {
    title: 'Crea Tu Cuenta',
    subtitle: 'Empieza a comparar prop firms gratis',
    freeIncludes: 'La cuenta gratuita incluye:',
    benefit1: 'Guardar prop firms favoritas',
    benefit2: 'Configurar alertas de precios',
    benefit3: 'Seguir tus comparaciones',
    benefit4: 'Acceso a ofertas exclusivas',
    continueGoogle: 'Continuar con Google',
    orEmail: 'o continuar con email',
    name: 'Nombre',
    namePlaceholder: 'Juan García',
    email: 'Email',
    emailPlaceholder: 'tu@ejemplo.com',
    password: 'Contraseña',
    minChars: 'Mínimo 8 caracteres',
    agreeTerms: 'Acepto los',
    termsLink: 'Términos de Servicio',
    and: 'y la',
    privacyLink: 'Política de Privacidad',
    createAccount: 'Crear Cuenta',
    alreadyAccount: '¿Ya tienes cuenta?',
    signIn: 'Iniciar sesión',
    loading: 'Cargando...',
    errorGeneral: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
    errorEmailExists: 'Este email ya está registrado. Por favor inicia sesión.',
    successCreated: '¡Cuenta creada exitosamente!',
    successCheckEmail: '¡Cuenta creada! Por favor revisa tu email para confirmar.',
  },
  pt: {
    title: 'Crie Sua Conta',
    subtitle: 'Comece a comparar prop firms gratuitamente',
    freeIncludes: 'A conta gratuita inclui:',
    benefit1: 'Salvar prop firms favoritas',
    benefit2: 'Configurar alertas de preço',
    benefit3: 'Acompanhar suas comparações',
    benefit4: 'Acesso a ofertas exclusivas',
    continueGoogle: 'Continuar com Google',
    orEmail: 'ou continuar com email',
    name: 'Nome',
    namePlaceholder: 'João Silva',
    email: 'Email',
    emailPlaceholder: 'voce@exemplo.com',
    password: 'Senha',
    minChars: 'Mínimo 8 caracteres',
    agreeTerms: 'Eu concordo com os',
    termsLink: 'Termos de Serviço',
    and: 'e a',
    privacyLink: 'Política de Privacidade',
    createAccount: 'Criar Conta',
    alreadyAccount: 'Já tem uma conta?',
    signIn: 'Entrar',
    loading: 'Carregando...',
    errorGeneral: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    errorEmailExists: 'Este email já está registrado. Por favor, faça login.',
    successCreated: 'Conta criada com sucesso!',
    successCheckEmail: 'Conta criada! Por favor, verifique seu email para confirmar.',
  },
  ar: {
    title: 'أنشئ حسابك',
    subtitle: 'ابدأ مقارنة شركات التداول مجاناً',
    freeIncludes: 'الحساب المجاني يشمل:',
    benefit1: 'حفظ الشركات المفضلة',
    benefit2: 'إعداد تنبيهات الأسعار',
    benefit3: 'تتبع مقارناتك',
    benefit4: 'الوصول للعروض الحصرية',
    continueGoogle: 'المتابعة مع Google',
    orEmail: 'أو المتابعة بالبريد الإلكتروني',
    name: 'الاسم',
    namePlaceholder: 'أحمد محمد',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    password: 'كلمة المرور',
    minChars: '8 أحرف على الأقل',
    agreeTerms: 'أوافق على',
    termsLink: 'شروط الخدمة',
    and: 'و',
    privacyLink: 'سياسة الخصوصية',
    createAccount: 'إنشاء حساب',
    alreadyAccount: 'لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    loading: 'جاري التحميل...',
    errorGeneral: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    errorEmailExists: 'هذا البريد مسجل بالفعل. يرجى تسجيل الدخول.',
    successCreated: 'تم إنشاء الحساب بنجاح!',
    successCheckEmail: 'تم إنشاء الحساب! يرجى التحقق من بريدك للتأكيد.',
  },
  hi: {
    title: 'अपना अकाउंट बनाएं',
    subtitle: 'प्रॉप फर्म्स की तुलना मुफ्त में शुरू करें',
    freeIncludes: 'मुफ्त अकाउंट में शामिल:',
    benefit1: 'पसंदीदा प्रॉप फर्म्स सेव करें',
    benefit2: 'प्राइस अलर्ट सेट करें',
    benefit3: 'अपनी तुलनाएं ट्रैक करें',
    benefit4: 'एक्सक्लूसिव डील्स एक्सेस',
    continueGoogle: 'Google से जारी रखें',
    orEmail: 'या ईमेल से जारी रखें',
    name: 'नाम',
    namePlaceholder: 'राहुल शर्मा',
    email: 'ईमेल',
    emailPlaceholder: 'aap@example.com',
    password: 'पासवर्ड',
    minChars: 'कम से कम 8 अक्षर',
    agreeTerms: 'मैं सहमत हूं',
    termsLink: 'सेवा की शर्तें',
    and: 'और',
    privacyLink: 'गोपनीयता नीति',
    createAccount: 'अकाउंट बनाएं',
    alreadyAccount: 'पहले से अकाउंट है?',
    signIn: 'साइन इन करें',
    loading: 'लोड हो रहा है...',
    errorGeneral: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।',
    errorEmailExists: 'यह ईमेल पहले से पंजीकृत है। कृपया साइन इन करें।',
    successCreated: 'अकाउंट सफलतापूर्वक बनाया गया!',
    successCheckEmail: 'अकाउंट बनाया गया! कृपया पुष्टि के लिए अपना ईमेल जांचें।',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function SignupPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data?.user) {
        if (data.user.identities?.length === 0) {
          setError(t.errorEmailExists)
        } else if (data.session) {
          setSuccess(t.successCreated)
          router.push(`/${locale}/dashboard`)
          router.refresh()
        } else {
          setSuccess(t.successCheckEmail)
        }
      }
    } catch (err) {
      setError(t.errorGeneral)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError(t.errorGeneral)
      setLoading(false)
    }
  }

  const benefits = [t.benefit1, t.benefit2, t.benefit3, t.benefit4];

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="glass rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                PropFirm<span className="text-brand-400">Scanner</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-dark-400">{t.subtitle}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-400 text-sm">{success}</p>
            </div>
          )}

          {/* Benefits */}
          <div className="mb-6 p-4 bg-brand-500/10 rounded-xl border border-brand-500/20">
            <p className="text-sm font-medium text-brand-400 mb-2">{t.freeIncludes}</p>
            <ul className="space-y-1">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-dark-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? t.loading : t.continueGoogle}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-900 text-dark-500">{t.orEmail}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">{t.name}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <p className="text-xs text-dark-500 mt-1">{t.minChars}</p>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                required
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500" 
              />
              <span className="text-sm text-dark-400">
                {t.agreeTerms}{' '}
                <Link href={`/${locale}/terms`} className="text-brand-400 hover:underline">{t.termsLink}</Link>
                {' '}{t.and}{' '}
                <Link href={`/${locale}/privacy`} className="text-brand-400 hover:underline">{t.privacyLink}</Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />
              ) : (
                <>
                  {t.createAccount}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-dark-400 text-sm mt-6">
            {t.alreadyAccount}{' '}
            <Link href={`/${locale}/auth/login`} className="text-brand-400 hover:underline">
              {t.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
