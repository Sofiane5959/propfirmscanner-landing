'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import {
  Shield,
  BarChart3,
  Tag,
  BookOpen,
  Menu,
  X,
  LogOut,
  User,
  Star,
  Settings,
  ChevronDown,
  Loader2,
  FileText,
  GraduationCap,
  Crown,
  FileQuestion,
  Globe,
} from 'lucide-react';

// =============================================================================
// TRANSLATIONS
// =============================================================================

const translations: Record<string, Record<string, string>> = {
  en: {
    compare: 'Compare',
    deals: 'Deals',
    blog: 'Blog',
    education: 'Education',
    rules: 'Rules',
    freeGuide: 'Free Guide',
    free: 'FREE',
    soon: 'Soon',
    products: 'Products',
    language: 'Language',
    signIn: 'Sign In',
    signInGoogle: 'Sign In with Google',
    signOut: 'Sign Out',
    dashboard: 'Dashboard',
    favorites: 'My Favorites',
    settings: 'Settings',
  },
  fr: {
    compare: 'Comparer',
    deals: 'Promos',
    blog: 'Blog',
    education: 'Education',
    rules: 'Regles',
    freeGuide: 'Guide Gratuit',
    free: 'GRATUIT',
    soon: 'Bientot',
    products: 'Produits',
    language: 'Langue',
    signIn: 'Connexion',
    signInGoogle: 'Se connecter avec Google',
    signOut: 'Deconnexion',
    dashboard: 'Tableau de bord',
    favorites: 'Mes Favoris',
    settings: 'Parametres',
  },
  de: {
    compare: 'Vergleichen',
    deals: 'Angebote',
    blog: 'Blog',
    education: 'Bildung',
    rules: 'Regeln',
    freeGuide: 'Gratis Guide',
    free: 'GRATIS',
    soon: 'Bald',
    products: 'Produkte',
    language: 'Sprache',
    signIn: 'Anmelden',
    signInGoogle: 'Mit Google anmelden',
    signOut: 'Abmelden',
    dashboard: 'Dashboard',
    favorites: 'Favoriten',
    settings: 'Einstellungen',
  },
  es: {
    compare: 'Comparar',
    deals: 'Ofertas',
    blog: 'Blog',
    education: 'Educacion',
    rules: 'Reglas',
    freeGuide: 'Guia Gratis',
    free: 'GRATIS',
    soon: 'Pronto',
    products: 'Productos',
    language: 'Idioma',
    signIn: 'Entrar',
    signInGoogle: 'Entrar con Google',
    signOut: 'Salir',
    dashboard: 'Panel',
    favorites: 'Favoritos',
    settings: 'Ajustes',
  },
  ar: {
    compare: 'مقارنة',
    deals: 'العروض',
    blog: 'المدونة',
    education: 'التعليم',
    rules: 'القواعد',
    freeGuide: 'دليل مجاني',
    free: 'مجاني',
    soon: 'قريبا',
    products: 'المنتجات',
    language: 'اللغة',
    signIn: 'دخول',
    signInGoogle: 'دخول بجوجل',
    signOut: 'خروج',
    dashboard: 'لوحة التحكم',
    favorites: 'المفضلة',
    settings: 'الاعدادات',
  },
  hi: {
    compare: 'तुलना',
    deals: 'डील्स',
    blog: 'ब्लॉग',
    education: 'शिक्षा',
    rules: 'नियम',
    freeGuide: 'मुफ्त गाइड',
    free: 'मुफ्त',
    soon: 'जल्द',
    products: 'उत्पाद',
    language: 'भाषा',
    signIn: 'लॉगिन',
    signInGoogle: 'Google लॉगिन',
    signOut: 'लॉगआउट',
    dashboard: 'डैशबोर्ड',
    favorites: 'पसंदीदा',
    settings: 'सेटिंग्स',
  },
};

// =============================================================================
// LANGUAGE CONFIG
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Francais',
  de: 'Deutsch',
  es: 'Espanol',
  ar: 'العربية',
  hi: 'हिन्दी',
};

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  ar: '🇸🇦',
  hi: '🇮🇳',
};

// Get current locale from pathname
function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

// Build URL for locale switch
function buildLocaleUrl(pathname: string, newLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstIsLocale = segments.length > 0 && locales.includes(segments[0] as Locale);
  
  if (firstIsLocale) {
    segments.shift();
  }
  
  if (newLocale === 'en') {
    return segments.length > 0 ? '/' + segments.join('/') : '/';
  } else {
    return '/' + newLocale + (segments.length > 0 ? '/' + segments.join('/') : '');
  }
}

// Switch locale - clears cookie and navigates
function switchLocale(pathname: string, newLocale: Locale) {
  // IMPORTANT: Clear the NEXT_LOCALE cookie so middleware doesn't redirect back
  document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'NEXT_LOCALE=' + newLocale + '; path=/; max-age=31536000';
  
  const url = buildLocaleUrl(pathname, newLocale);
  window.location.href = url;
}

// =============================================================================
// GOOGLE ICON
// =============================================================================

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// =============================================================================
// LANGUAGE SELECTOR
// =============================================================================

function LanguageSelector({ currentLocale, pathname }: { currentLocale: Locale; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSwitch = (locale: Locale) => {
    setIsOpen(false);
    switchLocale(pathname, locale);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[currentLocale]}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-[60] py-1">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleSwitch(locale)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-800 transition-colors ${
                currentLocale === locale ? 'text-emerald-400 bg-gray-800/50' : 'text-gray-300'
              }`}
            >
              <span>{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && <span className="ml-auto text-emerald-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// USER DROPDOWN
// =============================================================================

function UserDropdown({ t }: { t: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-emerald-400">{initials}</span>
          </div>
        )}
        <span className="text-sm text-gray-300 hidden sm:block max-w-[100px] truncate">{displayName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-[60] py-2">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Shield className="w-4 h-4" />
              {t.dashboard}
            </Link>
            <Link href="/dashboard/favorites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Star className="w-4 h-4" />
              {t.favorites}
            </Link>
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              {t.settings}
            </Link>
          </div>

          <div className="border-t border-gray-800 pt-2">
            <button onClick={() => { setIsOpen(false); signOut(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
              <LogOut className="w-4 h-4" />
              {t.signOut}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// NAVBAR COMPONENT
// =============================================================================

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();
  
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;

  const mainNavigation = [
    { name: t.compare, href: '/compare', icon: BarChart3 },
    { name: t.deals, href: '/deals', icon: Tag },
    { name: t.blog, href: '/blog', icon: FileText },
  ];

  const productLinks = [
    { 
      name: t.education, 
      href: '/education', 
      icon: GraduationCap,
      badge: t.soon,
      badgeColor: 'bg-purple-500',
    },
    { 
      name: t.rules, 
      href: '/rules-explained', 
      icon: FileQuestion,
      badge: t.soon,
      badgeColor: 'bg-blue-500',
    },
    { 
      name: 'MyPropFirm', 
      href: '/mypropfirm', 
      icon: Crown,
      badge: 'Pro',
      badgeColor: 'bg-emerald-500',
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              PropFirm<span className="text-emerald-400">Scanner</span>
            </span>
          </Link>

          {/* Desktop Navigation - Aligned Left */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            <div className="w-px h-6 bg-gray-700 mx-1" />

            {productLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 ${item.badgeColor} text-white text-[10px] font-bold rounded`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="w-px h-6 bg-gray-700 mx-1" />

            <Link 
              href="/guide" 
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all
                ${pathname === '/guide' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
            >
              <BookOpen className="w-4 h-4" />
              {t.freeGuide}
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">{t.free}</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <LanguageSelector currentLocale={currentLocale} pathname={pathname} />
            
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            ) : user ? (
              <UserDropdown t={t} />
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors whitespace-nowrap"
              >
                <GoogleIcon className="w-4 h-4" />
                {t.signIn}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-gray-800">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.products}</p>
              {productLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 ${item.badgeColor} text-white text-[10px] font-bold rounded ml-auto`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <Link 
              href="/guide" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400"
            >
              <BookOpen className="w-5 h-5" />
              {t.freeGuide}
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded ml-auto">{t.free}</span>
            </Link>

            {/* Language Selector Mobile */}
            <div className="pt-2 border-t border-gray-800">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.language}</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                {locales.map((locale) => {
                  const isActive = currentLocale === locale;
                  return (
                    <button
                      key={locale}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        switchLocale(pathname, locale);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{localeFlags[locale]}</span>
                      <span>{localeNames[locale]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User section for mobile */}
            <div className="pt-4 border-t border-gray-800 space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-3">
                  <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5">
                    <Shield className="w-5 h-5" />
                    {t.dashboard}
                  </Link>
                  <Link href="/dashboard/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5">
                    <Star className="w-5 h-5" />
                    {t.favorites}
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5">
                    <Settings className="w-5 h-5" />
                    {t.settings}
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    {t.signOut}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); signInWithGoogle(); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                >
                  <GoogleIcon className="w-4 h-4" />
                  {t.signInGoogle}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
