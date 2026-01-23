'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  BarChart3,
  Tag,
  Star,
  Settings,
  Shield,
  User,
  Calendar,
  TrendingUp,
  Loader2,
  ChevronRight,
  ExternalLink,
  Crown,
  Sparkles,
  Plus,
  Bell,
  AlertTriangle,
  Target,
  Wallet,
} from 'lucide-react';
import AccountOverview from '@/components/AccountOverview';

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
    dashboard: 'Dashboard',
    welcomeBack: 'Welcome back',
    addAccount: 'Add Account',
    // Stats
    totalProfit: 'Total Profit',
    activeAccounts: 'Active Accounts',
    favorites: 'Favorites',
    alertsToday: 'Alerts Today',
    // Accounts section
    myAccounts: 'My Accounts',
    viewAll: 'View All',
    noAccountsYet: 'No accounts yet',
    startTracking: 'Start tracking your prop firm challenges',
    addFirstAccount: 'Add Your First Account',
    viewMoreAccounts: 'View {count} more accounts',
    // Profile card
    memberSince: 'Member since',
    plan: 'Plan',
    free: 'Free',
    settings: 'Settings',
    // Quick actions
    quickActions: 'Quick Actions',
    compareFirms: 'Compare Firms',
    viewDeals: 'View Deals',
    myFavorites: 'My Favorites',
    alertSettings: 'Alert Settings',
    // Pro banner
    upgradeToPro: 'Upgrade to Pro',
    proDescription: 'Unlock advanced analytics, unlimited accounts, and priority alerts.',
    learnMore: 'Learn More',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    welcomeBack: 'Bon retour',
    addAccount: 'Ajouter un Compte',
    totalProfit: 'Profit Total',
    activeAccounts: 'Comptes Actifs',
    favorites: 'Favoris',
    alertsToday: 'Alertes Aujourd\'hui',
    myAccounts: 'Mes Comptes',
    viewAll: 'Voir Tout',
    noAccountsYet: 'Aucun compte encore',
    startTracking: 'Commencez à suivre vos challenges prop firm',
    addFirstAccount: 'Ajouter Votre Premier Compte',
    viewMoreAccounts: 'Voir {count} comptes de plus',
    memberSince: 'Membre depuis',
    plan: 'Plan',
    free: 'Gratuit',
    settings: 'Paramètres',
    quickActions: 'Actions Rapides',
    compareFirms: 'Comparer les Firms',
    viewDeals: 'Voir les Offres',
    myFavorites: 'Mes Favoris',
    alertSettings: 'Paramètres d\'Alertes',
    upgradeToPro: 'Passer à Pro',
    proDescription: 'Débloquez des analyses avancées, comptes illimités et alertes prioritaires.',
    learnMore: 'En Savoir Plus',
  },
  de: {
    dashboard: 'Dashboard',
    welcomeBack: 'Willkommen zurück',
    addAccount: 'Konto Hinzufügen',
    totalProfit: 'Gesamtgewinn',
    activeAccounts: 'Aktive Konten',
    favorites: 'Favoriten',
    alertsToday: 'Alarme Heute',
    myAccounts: 'Meine Konten',
    viewAll: 'Alle Anzeigen',
    noAccountsYet: 'Noch keine Konten',
    startTracking: 'Beginnen Sie Ihre Prop-Firm-Challenges zu verfolgen',
    addFirstAccount: 'Erstes Konto Hinzufügen',
    viewMoreAccounts: '{count} weitere Konten anzeigen',
    memberSince: 'Mitglied seit',
    plan: 'Plan',
    free: 'Kostenlos',
    settings: 'Einstellungen',
    quickActions: 'Schnellaktionen',
    compareFirms: 'Firms Vergleichen',
    viewDeals: 'Angebote Anzeigen',
    myFavorites: 'Meine Favoriten',
    alertSettings: 'Alarm-Einstellungen',
    upgradeToPro: 'Auf Pro Upgraden',
    proDescription: 'Erweiterte Analysen, unbegrenzte Konten und Prioritäts-Alarme freischalten.',
    learnMore: 'Mehr Erfahren',
  },
  es: {
    dashboard: 'Panel de Control',
    welcomeBack: 'Bienvenido de vuelta',
    addAccount: 'Agregar Cuenta',
    totalProfit: 'Ganancia Total',
    activeAccounts: 'Cuentas Activas',
    favorites: 'Favoritos',
    alertsToday: 'Alertas Hoy',
    myAccounts: 'Mis Cuentas',
    viewAll: 'Ver Todo',
    noAccountsYet: 'Aún no hay cuentas',
    startTracking: 'Comienza a rastrear tus desafíos de prop firm',
    addFirstAccount: 'Agregar Tu Primera Cuenta',
    viewMoreAccounts: 'Ver {count} cuentas más',
    memberSince: 'Miembro desde',
    plan: 'Plan',
    free: 'Gratis',
    settings: 'Configuración',
    quickActions: 'Acciones Rápidas',
    compareFirms: 'Comparar Firmas',
    viewDeals: 'Ver Ofertas',
    myFavorites: 'Mis Favoritos',
    alertSettings: 'Configuración de Alertas',
    upgradeToPro: 'Actualizar a Pro',
    proDescription: 'Desbloquea análisis avanzados, cuentas ilimitadas y alertas prioritarias.',
    learnMore: 'Saber Más',
  },
  pt: {
    dashboard: 'Painel de Controle',
    welcomeBack: 'Bem-vindo de volta',
    addAccount: 'Adicionar Conta',
    totalProfit: 'Lucro Total',
    activeAccounts: 'Contas Ativas',
    favorites: 'Favoritos',
    alertsToday: 'Alertas Hoje',
    myAccounts: 'Minhas Contas',
    viewAll: 'Ver Tudo',
    noAccountsYet: 'Nenhuma conta ainda',
    startTracking: 'Comece a acompanhar seus desafios de prop firm',
    addFirstAccount: 'Adicionar Sua Primeira Conta',
    viewMoreAccounts: 'Ver mais {count} contas',
    memberSince: 'Membro desde',
    plan: 'Plano',
    free: 'Gratuito',
    settings: 'Configurações',
    quickActions: 'Ações Rápidas',
    compareFirms: 'Comparar Firmas',
    viewDeals: 'Ver Ofertas',
    myFavorites: 'Meus Favoritos',
    alertSettings: 'Configurações de Alertas',
    upgradeToPro: 'Atualizar para Pro',
    proDescription: 'Desbloqueie análises avançadas, contas ilimitadas e alertas prioritários.',
    learnMore: 'Saiba Mais',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    welcomeBack: 'مرحباً بعودتك',
    addAccount: 'إضافة حساب',
    totalProfit: 'إجمالي الربح',
    activeAccounts: 'الحسابات النشطة',
    favorites: 'المفضلة',
    alertsToday: 'تنبيهات اليوم',
    myAccounts: 'حساباتي',
    viewAll: 'عرض الكل',
    noAccountsYet: 'لا توجد حسابات بعد',
    startTracking: 'ابدأ في تتبع تحديات شركات التداول الخاصة بك',
    addFirstAccount: 'أضف حسابك الأول',
    viewMoreAccounts: 'عرض {count} حسابات إضافية',
    memberSince: 'عضو منذ',
    plan: 'الخطة',
    free: 'مجاني',
    settings: 'الإعدادات',
    quickActions: 'إجراءات سريعة',
    compareFirms: 'مقارنة الشركات',
    viewDeals: 'عرض العروض',
    myFavorites: 'مفضلاتي',
    alertSettings: 'إعدادات التنبيهات',
    upgradeToPro: 'الترقية إلى Pro',
    proDescription: 'افتح التحليلات المتقدمة والحسابات غير المحدودة والتنبيهات ذات الأولوية.',
    learnMore: 'اعرف المزيد',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    welcomeBack: 'वापस स्वागत है',
    addAccount: 'अकाउंट जोड़ें',
    totalProfit: 'कुल लाभ',
    activeAccounts: 'सक्रिय अकाउंट्स',
    favorites: 'पसंदीदा',
    alertsToday: 'आज के अलर्ट्स',
    myAccounts: 'मेरे अकाउंट्स',
    viewAll: 'सभी देखें',
    noAccountsYet: 'अभी कोई अकाउंट नहीं',
    startTracking: 'अपने प्रॉप फर्म चैलेंज ट्रैक करना शुरू करें',
    addFirstAccount: 'अपना पहला अकाउंट जोड़ें',
    viewMoreAccounts: '{count} और अकाउंट्स देखें',
    memberSince: 'सदस्य',
    plan: 'प्लान',
    free: 'मुफ्त',
    settings: 'सेटिंग्स',
    quickActions: 'त्वरित कार्रवाई',
    compareFirms: 'फर्म्स की तुलना करें',
    viewDeals: 'डील्स देखें',
    myFavorites: 'मेरे पसंदीदा',
    alertSettings: 'अलर्ट सेटिंग्स',
    upgradeToPro: 'Pro में अपग्रेड करें',
    proDescription: 'उन्नत एनालिटिक्स, असीमित अकाउंट्स और प्राथमिकता अलर्ट्स अनलॉक करें।',
    learnMore: 'और जानें',
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface Account {
  id: string;
  account_name: string;
  firm_name: string;
  initial_balance: number;
  current_balance: number;
  max_drawdown: number;
  daily_loss_limit: number;
  profit_target: number;
  current_daily_loss: number;
  challenge_end_date: string | null;
  created_at: string;
}

interface DashboardStats {
  favorites: number;
  totalAccounts: number;
  totalProfit: number;
  activeAlerts: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function DashboardPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [stats, setStats] = useState<DashboardStats>({ 
    favorites: 0, 
    totalAccounts: 0,
    totalProfit: 0,
    activeAlerts: 0,
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('challenge_accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setAccounts(data || []);
        
        // Calculate total profit
        const totalProfit = (data || []).reduce((sum, acc) => {
          return sum + (acc.current_balance - acc.initial_balance);
        }, 0);
        
        setStats(prev => ({
          ...prev,
          totalAccounts: data?.length || 0,
          totalProfit,
        }));
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [user, supabase]);

  // Fetch other stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // Get favorites count
        const { count: favCount } = await supabase
          .from('user_favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        // Get today's alerts count
        const today = new Date().toISOString().split('T')[0];
        const { count: alertCount } = await supabase
          .from('alert_logs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('sent_at', today);
        
        setStats(prev => ({
          ...prev,
          favorites: favCount || 0,
          activeAlerts: alertCount || 0,
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user, supabase]);

  // Format member since date based on locale
  const getMemberSince = () => {
    if (!user?.created_at) return '';
    const date = new Date(user.created_at);
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

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const memberSince = getMemberSince();

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              {t.dashboard}
            </h1>
            <p className="text-gray-400 mt-1">{t.welcomeBack}, {displayName}!</p>
          </div>
          <Link
            href={`/${locale}/dashboard/accounts/new`}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.addAccount}
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-gray-400 text-sm">{t.totalProfit}</span>
            </div>
            <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {loadingStats ? '—' : `${stats.totalProfit >= 0 ? '+' : ''}$${stats.totalProfit.toLocaleString()}`}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-gray-400 text-sm">{t.activeAccounts}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {loadingStats ? '—' : stats.totalAccounts}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-gray-400 text-sm">{t.favorites}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {loadingStats ? '—' : stats.favorites}
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-gray-400 text-sm">{t.alertsToday}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {loadingStats ? '—' : stats.activeAlerts}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content - Accounts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Accounts Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">{t.myAccounts}</h2>
                <Link
                  href={`/${locale}/dashboard/accounts`}
                  className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                >
                  {t.viewAll}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {loadingAccounts ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{t.noAccountsYet}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {t.startTracking}
                  </p>
                  <Link
                    href={`/${locale}/dashboard/accounts/new`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addFirstAccount}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.slice(0, 2).map((account) => (
                    <AccountOverview key={account.id} account={account} />
                  ))}
                  {accounts.length > 2 && (
                    <Link
                      href={`/${locale}/dashboard/accounts`}
                      className="block text-center py-3 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors"
                    >
                      {t.viewMoreAccounts.replace('{count}', String(accounts.length - 2))}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-4 mb-6">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName} 
                    className="w-14 h-14 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-emerald-400" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-white">{displayName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t.memberSince}
                  </span>
                  <span className="text-gray-300">{memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    {t.plan}
                  </span>
                  <span className="text-emerald-400">{t.free}</span>
                </div>
              </div>

              <Link
                href={`/${locale}/dashboard/settings`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                {t.settings}
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">{t.quickActions}</h3>
              <div className="space-y-2">
                <Link
                  href={`/${locale}/compare`}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">{t.compareFirms}</span>
                </Link>
                <Link
                  href={`/${locale}/deals`}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Tag className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-300">{t.viewDeals}</span>
                </Link>
                <Link
                  href={`/${locale}/dashboard/favorites`}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{t.myFavorites}</span>
                </Link>
                <Link
                  href={`/${locale}/dashboard/settings`}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300">{t.alertSettings}</span>
                </Link>
              </div>
            </div>

            {/* Pro Banner */}
            <div className="bg-gradient-to-br from-purple-500/10 to-emerald-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h3 className="font-semibold text-white">{t.upgradeToPro}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {t.proDescription}
              </p>
              <Link
                href={`/${locale}/mypropfirm`}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {t.learnMore}
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
