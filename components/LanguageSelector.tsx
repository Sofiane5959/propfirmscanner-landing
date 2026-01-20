'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n';

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale from pathname if present
    let newPathname = pathname;
    
    // Check if pathname starts with a locale
    const segments = pathname.split('/');
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
      newPathname = segments.join('/');
    } else {
      // Add new locale to pathname
      newPathname = `/${newLocale}${pathname}`;
    }

    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeFlags[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                  locale === loc ? 'text-emerald-400 bg-gray-700/50' : 'text-gray-300'
                }`}
              >
                <span className="text-lg">{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
                {locale === loc && (
                  <span className="ml-auto text-emerald-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
