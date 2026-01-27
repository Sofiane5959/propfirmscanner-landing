'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

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
    title: 'Something went wrong',
    description: "We're sorry, an unexpected error occurred. Please try again or contact support if the problem persists.",
    tryAgain: 'Try Again',
    goHome: 'Go Home',
  },
  fr: {
    title: 'Une erreur s\'est produite',
    description: 'Nous sommes désolés, une erreur inattendue s\'est produite. Veuillez réessayer ou contacter le support si le problème persiste.',
    tryAgain: 'Réessayer',
    goHome: 'Retour à l\'accueil',
  },
  de: {
    title: 'Etwas ist schief gelaufen',
    description: 'Es tut uns leid, ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht.',
    tryAgain: 'Erneut versuchen',
    goHome: 'Zur Startseite',
  },
  es: {
    title: 'Algo salió mal',
    description: 'Lo sentimos, ocurrió un error inesperado. Por favor intenta de nuevo o contacta al soporte si el problema persiste.',
    tryAgain: 'Intentar de nuevo',
    goHome: 'Ir al inicio',
  },
  pt: {
    title: 'Algo deu errado',
    description: 'Desculpe, ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte se o problema persistir.',
    tryAgain: 'Tentar novamente',
    goHome: 'Ir para o início',
  },
  ar: {
    title: 'حدث خطأ ما',
    description: 'نعتذر، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بالدعم إذا استمرت المشكلة.',
    tryAgain: 'حاول مرة أخرى',
    goHome: 'العودة للرئيسية',
  },
  hi: {
    title: 'कुछ गलत हो गया',
    description: 'हमें खेद है, एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें या यदि समस्या बनी रहती है तो सहायता से संपर्क करें।',
    tryAgain: 'पुनः प्रयास करें',
    goHome: 'होम पर जाएं',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-white mb-3">
          {t.title}
        </h1>
        <p className="text-gray-400 mb-8">
          {t.description}
        </p>

        {/* Error Details (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <p className="text-red-400 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t.tryAgain}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.goHome}
          </Link>
        </div>
      </div>
    </div>
  )
}
