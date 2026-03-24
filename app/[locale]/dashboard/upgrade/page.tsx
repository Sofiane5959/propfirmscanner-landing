'use client';

import { useState, useTransition, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, Check, Zap, Shield, TrendingUp, ArrowLeft, Loader2, Gift, Sparkles, X } from 'lucide-react';
import { redeemProCode } from '@/lib/actions/redeem-code';

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
    upgradeToPro: 'Upgrade to Pro',
    unlockUnlimited: 'Unlock unlimited accounts and simulations to protect all your prop firm challenges.',
    freePlan: 'Free',
    currentPlan: 'Current plan',
    proPlan: 'Pro',
    unlimitedPower: 'Unlimited power',
    recommended: 'RECOMMENDED',
    perMonth: '/month',
    trackOneAccount: 'Track 1 prop firm account',
    threeSimulations: '3 trade simulations per day',
    basicRisk: 'Basic risk calculations',
    rulesDatabase: 'Rules & hidden risks database',
    unlimitedAccounts: 'Unlimited prop firm accounts',
    unlimitedSimulations: 'Unlimited trade simulations',
    advancedAnalytics: 'Advanced risk analytics',
    emailAlerts: 'Email alerts (coming soon)',
    prioritySupport: 'Priority support',
    earlyAccess: 'Early access to new features',
    haveProCode: 'Have a Pro Code?',
    enterCodeActivate: 'Enter your access code to activate Pro',
    enterCodePlaceholder: 'Enter your code (e.g., PROPFIRM2025)',
    pleaseEnterCode: 'Please enter a code.',
    activatePro: 'Activate Pro',
    activating: 'Activating...',
    dontHaveCode: "Don't have a code? Contact us at",
    whyUpgrade: 'Why upgrade to Pro?',
    multipleAccounts: 'Multiple Accounts',
    multipleAccountsDesc: 'Track all your prop firm challenges in one place.',
    unlimitedSims: 'Unlimited Simulations',
    unlimitedSimsDesc: 'Test every trade idea before risking real capital.',
    stayCompliant: 'Stay Compliant',
    stayCompliantDesc: 'Never accidentally break a rule and lose your account.',
    upgradeNow: 'Upgrade to Pro — $29.99/mo',
    upgradeLoading: 'Redirecting to checkout...',
    first100: 'First 100 users',
    thenPrice: 'then $49.99/mo',
    successTitle: '🎉 Welcome to Pro!',
    successDesc: 'Your account has been upgraded. All features are now unlocked.',
  },
  fr: {
    backToDashboard: 'Retour au Tableau de Bord',
    upgradeToPro: 'Passer à Pro',
    unlockUnlimited: 'Débloquez des comptes et simulations illimités pour protéger tous vos challenges.',
    freePlan: 'Gratuit',
    currentPlan: 'Plan actuel',
    proPlan: 'Pro',
    unlimitedPower: 'Puissance illimitée',
    recommended: 'RECOMMANDÉ',
    perMonth: '/mois',
    trackOneAccount: 'Suivre 1 compte prop firm',
    threeSimulations: '3 simulations de trade par jour',
    basicRisk: 'Calculs de risque basiques',
    rulesDatabase: 'Base de données des règles et risques',
    unlimitedAccounts: 'Comptes prop firm illimités',
    unlimitedSimulations: 'Simulations de trade illimitées',
    advancedAnalytics: 'Analyses de risque avancées',
    emailAlerts: 'Alertes email (bientôt)',
    prioritySupport: 'Support prioritaire',
    earlyAccess: 'Accès anticipé aux nouvelles fonctionnalités',
    haveProCode: 'Vous avez un Code Pro ?',
    enterCodeActivate: "Entrez votre code d'accès pour activer Pro",
    enterCodePlaceholder: 'Entrez votre code (ex: PROPFIRM2025)',
    pleaseEnterCode: 'Veuillez entrer un code.',
    activatePro: 'Activer Pro',
    activating: 'Activation...',
    dontHaveCode: 'Pas de code ? Contactez-nous à',
    whyUpgrade: 'Pourquoi passer à Pro ?',
    multipleAccounts: 'Comptes Multiples',
    multipleAccountsDesc: 'Suivez tous vos challenges prop firm en un seul endroit.',
    unlimitedSims: 'Simulations Illimitées',
    unlimitedSimsDesc: 'Testez chaque idée de trade avant de risquer du capital réel.',
    stayCompliant: 'Restez Conforme',
    stayCompliantDesc: "Ne violez jamais accidentellement une règle et perdez votre compte.",
    upgradeNow: 'Passer à Pro — 29,99$/mois',
    upgradeLoading: 'Redirection vers le paiement...',
    first100: '100 premiers utilisateurs',
    thenPrice: 'puis 49,99$/mois',
    successTitle: '🎉 Bienvenue dans Pro !',
    successDesc: 'Votre compte a été mis à niveau. Toutes les fonctionnalités sont débloquées.',
  },
  de: {
    backToDashboard: 'Zurück zum Dashboard',
    upgradeToPro: 'Auf Pro Upgraden',
    unlockUnlimited: 'Schalten Sie unbegrenzte Konten und Simulationen frei, um alle Ihre Challenges zu schützen.',
    freePlan: 'Kostenlos',
    currentPlan: 'Aktueller Plan',
    proPlan: 'Pro',
    unlimitedPower: 'Unbegrenzte Leistung',
    recommended: 'EMPFOHLEN',
    perMonth: '/Monat',
    trackOneAccount: '1 Prop Firm Konto verfolgen',
    threeSimulations: '3 Trade-Simulationen pro Tag',
    basicRisk: 'Grundlegende Risikoberechnungen',
    rulesDatabase: 'Regeln & versteckte Risiken Datenbank',
    unlimitedAccounts: 'Unbegrenzte Prop Firm Konten',
    unlimitedSimulations: 'Unbegrenzte Trade-Simulationen',
    advancedAnalytics: 'Erweiterte Risikoanalysen',
    emailAlerts: 'E-Mail-Alarme (bald verfügbar)',
    prioritySupport: 'Prioritäts-Support',
    earlyAccess: 'Frühzeitiger Zugang zu neuen Funktionen',
    haveProCode: 'Haben Sie einen Pro-Code?',
    enterCodeActivate: 'Geben Sie Ihren Zugangscode ein, um Pro zu aktivieren',
    enterCodePlaceholder: 'Code eingeben (z.B. PROPFIRM2025)',
    pleaseEnterCode: 'Bitte geben Sie einen Code ein.',
    activatePro: 'Pro Aktivieren',
    activating: 'Aktivierung...',
    dontHaveCode: 'Keinen Code? Kontaktieren Sie uns unter',
    whyUpgrade: 'Warum auf Pro upgraden?',
    multipleAccounts: 'Mehrere Konten',
    multipleAccountsDesc: 'Verfolgen Sie alle Ihre Prop Firm Challenges an einem Ort.',
    unlimitedSims: 'Unbegrenzte Simulationen',
    unlimitedSimsDesc: 'Testen Sie jede Trade-Idee, bevor Sie echtes Kapital riskieren.',
    stayCompliant: 'Bleiben Sie Konform',
    stayCompliantDesc: 'Verletzen Sie nie versehentlich eine Regel und verlieren Ihr Konto.',
    upgradeNow: 'Auf Pro upgraden — 29,99$/Monat',
    upgradeLoading: 'Weiterleitung zur Zahlung...',
    first100: 'Erste 100 Nutzer',
    thenPrice: 'dann 49,99$/Monat',
    successTitle: '🎉 Willkommen bei Pro!',
    successDesc: 'Ihr Konto wurde aktualisiert. Alle Funktionen sind jetzt freigeschaltet.',
  },
  es: {
    backToDashboard: 'Volver al Panel',
    upgradeToPro: 'Actualizar a Pro',
    unlockUnlimited: 'Desbloquea cuentas y simulaciones ilimitadas para proteger todos tus desafíos.',
    freePlan: 'Gratis',
    currentPlan: 'Plan actual',
    proPlan: 'Pro',
    unlimitedPower: 'Poder ilimitado',
    recommended: 'RECOMENDADO',
    perMonth: '/mes',
    trackOneAccount: 'Rastrear 1 cuenta prop firm',
    threeSimulations: '3 simulaciones de trade por día',
    basicRisk: 'Cálculos de riesgo básicos',
    rulesDatabase: 'Base de datos de reglas y riesgos',
    unlimitedAccounts: 'Cuentas prop firm ilimitadas',
    unlimitedSimulations: 'Simulaciones de trade ilimitadas',
    advancedAnalytics: 'Análisis de riesgo avanzados',
    emailAlerts: 'Alertas por email (próximamente)',
    prioritySupport: 'Soporte prioritario',
    earlyAccess: 'Acceso anticipado a nuevas funciones',
    haveProCode: '¿Tienes un Código Pro?',
    enterCodeActivate: 'Ingresa tu código de acceso para activar Pro',
    enterCodePlaceholder: 'Ingresa tu código (ej: PROPFIRM2025)',
    pleaseEnterCode: 'Por favor ingresa un código.',
    activatePro: 'Activar Pro',
    activating: 'Activando...',
    dontHaveCode: '¿No tienes código? Contáctanos en',
    whyUpgrade: '¿Por qué actualizar a Pro?',
    multipleAccounts: 'Múltiples Cuentas',
    multipleAccountsDesc: 'Rastrea todos tus desafíos prop firm en un solo lugar.',
    unlimitedSims: 'Simulaciones Ilimitadas',
    unlimitedSimsDesc: 'Prueba cada idea de trade antes de arriesgar capital real.',
    stayCompliant: 'Mantente Conforme',
    stayCompliantDesc: 'Nunca rompas accidentalmente una regla y pierdas tu cuenta.',
    upgradeNow: 'Actualizar a Pro — $29.99/mes',
    upgradeLoading: 'Redirigiendo al pago...',
    first100: 'Primeros 100 usuarios',
    thenPrice: 'luego $49.99/mes',
    successTitle: '🎉 ¡Bienvenido a Pro!',
    successDesc: 'Tu cuenta ha sido actualizada. Todas las funciones están desbloqueadas.',
  },
  pt: {
    backToDashboard: 'Voltar ao Painel',
    upgradeToPro: 'Atualizar para Pro',
    unlockUnlimited: 'Desbloqueie contas e simulações ilimitadas para proteger todos os seus desafios.',
    freePlan: 'Gratuito',
    currentPlan: 'Plano atual',
    proPlan: 'Pro',
    unlimitedPower: 'Poder ilimitado',
    recommended: 'RECOMENDADO',
    perMonth: '/mês',
    trackOneAccount: 'Acompanhar 1 conta prop firm',
    threeSimulations: '3 simulações de trade por dia',
    basicRisk: 'Cálculos de risco básicos',
    rulesDatabase: 'Banco de dados de regras e riscos',
    unlimitedAccounts: 'Contas prop firm ilimitadas',
    unlimitedSimulations: 'Simulações de trade ilimitadas',
    advancedAnalytics: 'Análises de risco avançadas',
    emailAlerts: 'Alertas por email (em breve)',
    prioritySupport: 'Suporte prioritário',
    earlyAccess: 'Acesso antecipado a novos recursos',
    haveProCode: 'Tem um Código Pro?',
    enterCodeActivate: 'Digite seu código de acesso para ativar Pro',
    enterCodePlaceholder: 'Digite seu código (ex: PROPFIRM2025)',
    pleaseEnterCode: 'Por favor digite um código.',
    activatePro: 'Ativar Pro',
    activating: 'Ativando...',
    dontHaveCode: 'Não tem código? Contate-nos em',
    whyUpgrade: 'Por que atualizar para Pro?',
    multipleAccounts: 'Múltiplas Contas',
    multipleAccountsDesc: 'Acompanhe todos os seus desafios prop firm em um só lugar.',
    unlimitedSims: 'Simulações Ilimitadas',
    unlimitedSimsDesc: 'Teste cada ideia de trade antes de arriscar capital real.',
    stayCompliant: 'Fique Conforme',
    stayCompliantDesc: 'Nunca quebre acidentalmente uma regra e perca sua conta.',
    upgradeNow: 'Atualizar para Pro — $29.99/mês',
    upgradeLoading: 'Redirecionando para pagamento...',
    first100: 'Primeiros 100 usuários',
    thenPrice: 'depois $49.99/mês',
    successTitle: '🎉 Bem-vindo ao Pro!',
    successDesc: 'Sua conta foi atualizada. Todos os recursos estão desbloqueados.',
  },
  ar: {
    backToDashboard: 'العودة للوحة التحكم',
    upgradeToPro: 'الترقية إلى Pro',
    unlockUnlimited: 'افتح حسابات ومحاكاات غير محدودة لحماية جميع تحدياتك.',
    freePlan: 'مجاني',
    currentPlan: 'الخطة الحالية',
    proPlan: 'Pro',
    unlimitedPower: 'قوة غير محدودة',
    recommended: 'موصى به',
    perMonth: '/شهر',
    trackOneAccount: 'تتبع حساب واحد',
    threeSimulations: '3 محاكاات تداول يومياً',
    basicRisk: 'حسابات المخاطر الأساسية',
    rulesDatabase: 'قاعدة بيانات القواعد والمخاطر',
    unlimitedAccounts: 'حسابات غير محدودة',
    unlimitedSimulations: 'محاكاات تداول غير محدودة',
    advancedAnalytics: 'تحليلات مخاطر متقدمة',
    emailAlerts: 'تنبيهات البريد الإلكتروني (قريباً)',
    prioritySupport: 'دعم ذو أولوية',
    earlyAccess: 'وصول مبكر للميزات الجديدة',
    haveProCode: 'هل لديك كود Pro؟',
    enterCodeActivate: 'أدخل كود الوصول لتفعيل Pro',
    enterCodePlaceholder: 'أدخل الكود (مثل: PROPFIRM2025)',
    pleaseEnterCode: 'يرجى إدخال كود.',
    activatePro: 'تفعيل Pro',
    activating: 'جاري التفعيل...',
    dontHaveCode: 'ليس لديك كود؟ تواصل معنا على',
    whyUpgrade: 'لماذا الترقية إلى Pro؟',
    multipleAccounts: 'حسابات متعددة',
    multipleAccountsDesc: 'تتبع جميع تحدياتك في مكان واحد.',
    unlimitedSims: 'محاكاات غير محدودة',
    unlimitedSimsDesc: 'اختبر كل فكرة تداول قبل المخاطرة برأس مال حقيقي.',
    stayCompliant: 'ابق ملتزماً',
    stayCompliantDesc: 'لا تخرق قاعدة بالخطأ وتفقد حسابك.',
    upgradeNow: 'الترقية إلى Pro — 29.99$/شهر',
    upgradeLoading: 'جاري التوجيه للدفع...',
    first100: 'أول 100 مستخدم',
    thenPrice: 'ثم 49.99$/شهر',
    successTitle: '🎉 مرحباً بك في Pro!',
    successDesc: 'تمت ترقية حسابك. جميع الميزات مفتوحة الآن.',
  },
  hi: {
    backToDashboard: 'डैशबोर्ड पर वापस',
    upgradeToPro: 'Pro में अपग्रेड करें',
    unlockUnlimited: 'अपने सभी चैलेंज की सुरक्षा के लिए असीमित अकाउंट्स और सिमुलेशन अनलॉक करें।',
    freePlan: 'मुफ्त',
    currentPlan: 'वर्तमान प्लान',
    proPlan: 'Pro',
    unlimitedPower: 'असीमित शक्ति',
    recommended: 'अनुशंसित',
    perMonth: '/महीना',
    trackOneAccount: '1 प्रॉप फर्म अकाउंट ट्रैक करें',
    threeSimulations: 'प्रतिदिन 3 ट्रेड सिमुलेशन',
    basicRisk: 'बेसिक रिस्क कैलकुलेशन',
    rulesDatabase: 'नियम और जोखिम डेटाबेस',
    unlimitedAccounts: 'असीमित प्रॉप फर्म अकाउंट्स',
    unlimitedSimulations: 'असीमित ट्रेड सिमुलेशन',
    advancedAnalytics: 'उन्नत रिस्क एनालिटिक्स',
    emailAlerts: 'ईमेल अलर्ट्स (जल्द आ रहा है)',
    prioritySupport: 'प्राथमिकता सपोर्ट',
    earlyAccess: 'नई सुविधाओं तक जल्दी पहुंच',
    haveProCode: 'Pro कोड है?',
    enterCodeActivate: 'Pro एक्टिवेट करने के लिए अपना एक्सेस कोड दर्ज करें',
    enterCodePlaceholder: 'अपना कोड दर्ज करें (जैसे: PROPFIRM2025)',
    pleaseEnterCode: 'कृपया कोड दर्ज करें।',
    activatePro: 'Pro एक्टिवेट करें',
    activating: 'एक्टिवेट हो रहा है...',
    dontHaveCode: 'कोड नहीं है? हमसे संपर्क करें',
    whyUpgrade: 'Pro में क्यों अपग्रेड करें?',
    multipleAccounts: 'मल्टीपल अकाउंट्स',
    multipleAccountsDesc: 'अपने सभी प्रॉप फर्म चैलेंज एक जगह ट्रैक करें।',
    unlimitedSims: 'असीमित सिमुलेशन',
    unlimitedSimsDesc: 'असली पूंजी जोखिम में डालने से पहले हर ट्रेड आइडिया टेस्ट करें।',
    stayCompliant: 'अनुपालन बनाए रखें',
    stayCompliantDesc: 'गलती से कोई नियम न तोड़ें और अपना अकाउंट न खोएं।',
    upgradeNow: 'Pro में अपग्रेड करें — $29.99/महीना',
    upgradeLoading: 'पेमेंट पर जा रहे हैं...',
    first100: 'पहले 100 यूज़र',
    thenPrice: 'फिर $49.99/महीना',
    successTitle: '🎉 Pro में स्वागत है!',
    successDesc: 'आपका अकाउंट अपग्रेड हो गया। सभी फीचर्स अनलॉक हैं।',
  },
};

// =============================================================================
// SUCCESS TOAST COMPONENT
// =============================================================================

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="bg-emerald-900 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <p className="text-emerald-100 text-sm flex-1">{message}</p>
        <button onClick={onClose} className="text-emerald-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// INNER COMPONENT (uses useSearchParams — must be inside Suspense)
// =============================================================================

function UpgradePageInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // ── Show success toast if redirected back with ?upgraded=true ──
  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      setShowSuccessToast(true);
      // Clean up URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete('upgraded');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // ── Handle Stripe checkout for Pro subscription ────────────────
  const handleStripeCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setIsCheckoutLoading(false);
    }
  };

  // ── Handle Pro Code redemption ─────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setMessage({ type: 'error', text: t.pleaseEnterCode });
      return;
    }

    startTransition(async () => {
      const result = await redeemProCode(code);

      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message,
      });

      if (result.success) {
        setCode('');
      }
    });
  };

  const FREE_FEATURES = [
    t.trackOneAccount,
    t.threeSimulations,
    t.basicRisk,
    t.rulesDatabase,
  ];

  const PRO_FEATURES = [
    t.unlimitedAccounts,
    t.unlimitedSimulations,
    t.advancedAnalytics,
    t.emailAlerts,
    t.prioritySupport,
    t.earlyAccess,
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-12">
      {/* Success Toast */}
      {showSuccessToast && (
        <SuccessToast
          message={`${t.successTitle} ${t.successDesc}`}
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToDashboard}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t.upgradeToPro}
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            {t.unlockUnlimited}
          </p>
        </div>

        {/* Plans comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Free Plan */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t.freePlan}</h3>
                <p className="text-gray-400 text-sm">{t.currentPlan}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-gray-400">{t.perMonth}</span>
            </div>

            <ul className="space-y-3">
              {FREE_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
              {t.recommended}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{t.proPlan}</h3>
                <p className="text-emerald-400 text-sm">{t.unlimitedPower}</p>
              </div>
            </div>

            {/* ── PRIX CORRIGÉ ── */}
            <div className="mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">$29.99</span>
                <span className="text-gray-400">{t.perMonth}</span>
                <span className="text-gray-500 line-through text-sm">$49.99</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-400 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {t.first100}
                </span>
                <span className="text-gray-500 text-xs">{t.thenPrice}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 mt-4">
              {PRO_FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-white">
                  <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CTA BUTTON Stripe ── */}
        <button
          onClick={handleStripeCheckout}
          disabled={isCheckoutLoading}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
        >
          {isCheckoutLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.upgradeLoading}
            </>
          ) : (
            <>
              <Crown className="w-5 h-5" />
              {t.upgradeNow}
            </>
          )}
        </button>
        <p className="text-center text-gray-500 text-xs mb-12">
          Secure payment via Stripe · Cancel anytime
        </p>

        {/* Pro Code Form */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{t.haveProCode}</h3>
              <p className="text-gray-400 text-sm">{t.enterCodeActivate}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setMessage(null);
                }}
                placeholder={t.enterCodePlaceholder}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase tracking-wider"
                disabled={isPending}
                maxLength={30}
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !code.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.activating}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {t.activatePro}
                </>
              )}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-4">
            {t.dontHaveCode}{' '}
            <a href="mailto:pro@propfirmscanner.org" className="text-emerald-400 hover:underline">
              pro@propfirmscanner.org
            </a>
          </p>
        </div>

        {/* Why Pro */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-6">{t.whyUpgrade}</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.multipleAccounts}</h4>
              <p className="text-gray-400 text-sm">{t.multipleAccountsDesc}</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.unlimitedSims}</h4>
              <p className="text-gray-400 text-sm">{t.unlimitedSimsDesc}</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">{t.stayCompliant}</h4>
              <p className="text-gray-400 text-sm">{t.stayCompliantDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN EXPORT — wrapped in Suspense for useSearchParams
// =============================================================================

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <UpgradePageInner />
    </Suspense>
  );
}
