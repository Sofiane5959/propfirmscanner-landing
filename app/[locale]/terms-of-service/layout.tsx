// app/[locale]/terms-of-service/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Terms of Service',
  fr: 'Conditions d\'Utilisation',
  de: 'Nutzungsbedingungen',
  es: 'Términos de Servicio',
  pt: 'Termos de Serviço',
  ar: 'شروط الخدمة',
  hi: 'सेवा की शर्तें',
}

const descriptions: Record<string, string> = {
  en: 'Terms of Service for PropFirm Scanner. Read our terms and conditions for using our platform.',
  fr: 'Conditions d\'utilisation de PropFirm Scanner. Lisez nos termes et conditions d\'utilisation.',
  de: 'Nutzungsbedingungen von PropFirm Scanner. Lesen Sie unsere Nutzungsbedingungen.',
  es: 'Términos de Servicio de PropFirm Scanner. Lea nuestros términos y condiciones de uso.',
  pt: 'Termos de Serviço do PropFirm Scanner. Leia nossos termos e condições de uso.',
  ar: 'شروط خدمة PropFirm Scanner. اقرأ الشروط والأحكام الخاصة باستخدام منصتنا.',
  hi: 'PropFirm Scanner की सेवा शर्तें। हमारे प्लेटफॉर्म के उपयोग की शर्तें पढ़ें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/terms-of-service'),
  }
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
