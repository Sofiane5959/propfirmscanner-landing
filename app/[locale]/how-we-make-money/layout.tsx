// app/[locale]/how-we-make-money/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'How We Make Money',
  fr: 'Comment Nous Gagnons de l\'Argent',
  de: 'Wie Wir Geld Verdienen',
  es: 'Cómo Ganamos Dinero',
  pt: 'Como Ganhamos Dinheiro',
  ar: 'كيف نكسب المال',
  hi: 'हम पैसे कैसे कमाते हैं',
}

const descriptions: Record<string, string> = {
  en: 'Full transparency about how PropFirm Scanner makes money. Learn about our affiliate partnerships and business model.',
  fr: 'Transparence totale sur comment PropFirm Scanner gagne de l\'argent. Découvrez nos partenariats et notre modèle.',
  de: 'Volle Transparenz darüber, wie PropFirm Scanner Geld verdient. Erfahren Sie mehr über unser Geschäftsmodell.',
  es: 'Transparencia total sobre cómo PropFirm Scanner gana dinero. Conozca nuestro modelo de negocio.',
  pt: 'Transparência total sobre como PropFirm Scanner ganha dinheiro. Conheça nosso modelo de negócio.',
  ar: 'شفافية كاملة حول كيفية كسب PropFirm Scanner للمال. تعرف على نموذج عملنا.',
  hi: 'PropFirm Scanner कैसे पैसे कमाता है इसके बारे में पूरी पारदर्शिता। हमारे बिजनेस मॉडल के बारे में जानें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/how-we-make-money'),
  }
}

export default function HowWeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
