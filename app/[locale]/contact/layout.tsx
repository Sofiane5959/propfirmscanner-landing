// app/[locale]/contact/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Contact Us',
  fr: 'Nous Contacter',
  de: 'Kontakt',
  es: 'Contáctenos',
  pt: 'Entre em Contato',
  ar: 'اتصل بنا',
  hi: 'हमसे संपर्क करें',
}

const descriptions: Record<string, string> = {
  en: 'Get in touch with PropFirm Scanner. We are here to help with your questions about prop trading.',
  fr: 'Contactez PropFirm Scanner. Nous sommes là pour répondre à vos questions sur le prop trading.',
  de: 'Kontaktieren Sie PropFirm Scanner. Wir helfen Ihnen gerne bei Fragen zum Prop-Trading.',
  es: 'Póngase en contacto con PropFirm Scanner. Estamos aquí para ayudarle con sus preguntas.',
  pt: 'Entre em contato com PropFirm Scanner. Estamos aqui para ajudar com suas perguntas.',
  ar: 'تواصل مع PropFirm Scanner. نحن هنا للمساعدة في أسئلتك حول التداول الممول.',
  hi: 'PropFirm Scanner से संपर्क करें। हम प्रॉप ट्रेडिंग के बारे में आपके सवालों में मदद के लिए यहां हैं।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/contact'),
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
