// app/[locale]/dashboard/layout.tsx
// IMPORTANT: Dashboard pages are private and should NOT be indexed by Google
import type { Metadata } from 'next'

const titles: Record<string, string> = {
  en: 'Dashboard',
  fr: 'Tableau de Bord',
  de: 'Dashboard',
  es: 'Panel de Control',
  pt: 'Painel',
  ar: 'لوحة التحكم',
  hi: 'डैशबोर्ड',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: 'Your PropFirm Scanner dashboard',
    robots: {
      index: false,  // Don't index dashboard
      follow: false, // Don't follow links
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
