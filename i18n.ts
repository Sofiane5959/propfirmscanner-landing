import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Liste des langues supportées
export const locales = ['en', 'fr', 'de', 'es', 'ar', 'hi'] as const;
export type Locale = (typeof locales)[number];

// Langue par défaut
export const defaultLocale: Locale = 'en';

// Noms des langues pour l'affichage
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ar: 'العربية',
  hi: 'हिन्दी',
};

// Drapeaux des langues
export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  ar: '🇸🇦',
  hi: '🇮🇳',
};

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
