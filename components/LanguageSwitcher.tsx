'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe, ChevronDown, Check } from 'lucide-react'

// =============================================================================
// CONFIGURATION
// =============================================================================

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
] as const;

type LanguageCode = typeof languages[number]['code'];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getLocaleFromPath(pathname: string): LanguageCode {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  const validCodes = languages.map(l => l.code);
  
  if (firstSegment && validCodes.includes(firstSegment as LanguageCode)) {
    return firstSegment as LanguageCode;
  }
  return 'en';
}

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  const validCodes = languages.map(l => l.code);
  
  if (firstSegment && validCodes.includes(firstSegment as LanguageCode)) {
    return '/' + segments.slice(2).join('/') || '/';
  }
  return pathname;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLocale = getLocaleFromPath(pathname);
  const currentLanguage = languages.find(l => l.code === currentLocale) || languages[0];
  
  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Changer de langue
  const switchLanguage = (newLocale: LanguageCode) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Sauvegarder la préférence
    localStorage.setItem('preferred-locale', newLocale);
    
    router.push(newPath);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 transition-all duration-200 text-gray-300 hover:text-white"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.flag} {currentLanguage.code.toUpperCase()}</span>
        <span className="text-sm font-medium sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  currentLocale === language.code
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </span>
                {currentLocale === language.code && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// VARIANTE COMPACTE (pour mobile ou footer)
// =============================================================================

export function LanguageSwitcherCompact() {
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLocale = getLocaleFromPath(pathname);
  
  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    localStorage.setItem('preferred-locale', newLocale);
    router.push(newPath);
  };
  
  return (
    <select
      value={currentLocale}
      onChange={(e) => switchLanguage(e.target.value)}
      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500"
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.flag} {language.name}
        </option>
      ))}
    </select>
  );
}

// =============================================================================
// VARIANTE AVEC DRAPEAUX SEULEMENT (très compact)
// =============================================================================

export function LanguageSwitcherFlags() {
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLocale = getLocaleFromPath(pathname);
  
  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    localStorage.setItem('preferred-locale', newLocale);
    router.push(newPath);
  };
  
  return (
    <div className="flex items-center gap-1">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => switchLanguage(language.code)}
          className={`p-1.5 rounded-md transition-all ${
            currentLocale === language.code
              ? 'bg-emerald-500/20 ring-1 ring-emerald-500'
              : 'hover:bg-gray-700/50'
          }`}
          title={language.name}
        >
          <span className="text-lg">{language.flag}</span>
        </button>
      ))}
    </div>
  );
}
