import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
