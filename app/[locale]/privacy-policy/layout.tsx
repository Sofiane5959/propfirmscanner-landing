// app/[locale]/privacy-policy/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Privacy Policy',
  fr: 'Politique de Confidentialité',
  de: 'Datenschutzrichtlinie',
  es: 'Política de Privacidad',
  pt: 'Política de Privacidade',
  ar: 'سياسة الخصوصية',
  hi: 'गोपनीयता नीति',
}

const descriptions: Record<string, string> = {
  en: 'Privacy Policy for PropFirm Scanner. Learn how we collect, use, and protect your personal data.',
  fr: 'Politique de confidentialité de PropFirm Scanner. Découvrez comment nous collectons et protégeons vos données.',
  de: 'Datenschutzrichtlinie von PropFirm Scanner. Erfahren Sie, wie wir Ihre Daten sammeln und schützen.',
  es: 'Política de Privacidad de PropFirm Scanner. Conozca cómo recopilamos y protegemos sus datos.',
  pt: 'Política de Privacidade do PropFirm Scanner. Saiba como coletamos e protegemos seus dados.',
  ar: 'سياسة الخصوصية لـ PropFirm Scanner. تعرف على كيفية جمع بياناتك وحمايتها.',
  hi: 'PropFirm Scanner की गोपनीयता नीति। जानें कि हम आपके डेटा को कैसे एकत्र और सुरक्षित करते हैं।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/privacy-policy'),
  }
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
