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
// NAVIGATION LINKS
// =============================================================================

const mainNavigation = [
  { name: 'Compare', href: '/compare', icon: BarChart3 },
  { name: 'Deals', href: '/deals', icon: Tag },
  { name: 'Blog', href: '/blog', icon: FileText },
];

const productLinks = [
  { 
    name: 'Education', 
    href: '/education', 
    icon: GraduationCap,
    badge: 'Soon',
    badgeColor: 'bg-purple-500',
  },
  { 
    name: 'Rules', 
    href: '/rules-explained', 
    icon: FileQuestion,
    badge: 'Soon',
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

// =============================================================================
// LANGUAGE CONFIG
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
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

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Détecter la langue actuelle depuis l'URL
  const getCurrentLocale = (): Locale => {
    const segments = pathname.split('/');
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      return segments[1] as Locale;
    }
    return 'en';
  };

  const currentLocale = getCurrentLocale();

  // Changer de langue
  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');
    
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    
    let newPath = segments.join('/');
    if (newLocale === 'en') {
      newPath = newPath.replace('/en', '') || '/';
    }
    
    window.location.href = newPath;
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
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
        className="flex items-center gap-1.5 px-2.5 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
              onClick={() => switchLocale(locale)}
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

function UserDropdown() {
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

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
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
              Dashboard
            </Link>
            <Link href="/dashboard/favorites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Star className="w-4 h-4" />
              Mes Favoris
            </Link>
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              Paramètres
            </Link>
          </div>

          <div className="border-t border-gray-800 pt-2">
            <button onClick={() => { setIsOpen(false); signOut(); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
              <LogOut className="w-4 h-4" />
              Se déconnecter
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              PropFirm<span className="text-emerald-400">Scanner</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Main Nav */}
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* Separator */}
            <div className="w-px h-6 bg-gray-700 mx-1" />

            {/* Product Links */}
            {productLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
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

            {/* Separator */}
            <div className="w-px h-6 bg-gray-700 mx-1" />

            {/* Free Guide */}
            <Link 
              href="/guide" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${pathname === '/guide' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
            >
              <BookOpen className="w-4 h-4" />
              Free Guide
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">FREE</span>
            </Link>
          </div>

          {/* Right Section: Language + Auth */}
          <div className="hidden lg:flex items-center space-x-2 relative z-10">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Auth */}
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            ) : user ? (
              <UserDropdown />
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
              >
                <GoogleIcon className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-gray-400 hover:text-white relative z-10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {/* Main Navigation */}
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
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

            {/* Products Section - Mobile */}
            <div className="pt-2 border-t border-gray-800">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</p>
              {productLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
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

            {/* Free Guide - Mobile */}
            <Link 
              href="/guide" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400"
            >
              <BookOpen className="w-5 h-5" />
              Free Guide
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded ml-auto">FREE</span>
            </Link>

            {/* Language Selector Mobile */}
            <div className="pt-2 border-t border-gray-800">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</p>
              <div className="grid grid-cols-2 gap-2 px-2">
                {locales.map((locale) => {
                  const segments = pathname.split('/');
                  const currentLocale = segments[1] && locales.includes(segments[1] as Locale) ? segments[1] : 'en';
                  const isActive = currentLocale === locale;
                  
                  const switchLocale = () => {
                    if (segments[1] && locales.includes(segments[1] as Locale)) {
                      segments[1] = locale;
                    } else {
                      segments.splice(1, 0, locale);
                    }
                    let newPath = segments.join('/');
                    if (locale === 'en') {
                      newPath = newPath.replace('/en', '') || '/';
                    }
                    window.location.href = newPath;
                    setMobileMenuOpen(false);
                  };

                  return (
                    <button
                      key={locale}
                      onClick={switchLocale}
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
                    Dashboard
                  </Link>
                  <Link href="/dashboard/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5">
                    <Star className="w-5 h-5" />
                    Mes Favoris
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5">
                    <Settings className="w-5 h-5" />
                    Paramètres
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut(); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); signInWithGoogle(); }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                >
                  <GoogleIcon className="w-4 h-4" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
