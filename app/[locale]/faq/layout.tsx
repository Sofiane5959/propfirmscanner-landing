// app/[locale]/faq/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Frequently Asked Questions',
  fr: 'Questions Fréquentes',
  de: 'Häufig Gestellte Fragen',
  es: 'Preguntas Frecuentes',
  pt: 'Perguntas Frequentes',
  ar: 'الأسئلة الشائعة',
  hi: 'अक्सर पूछे जाने वाले प्रश्न',
}

const descriptions: Record<string, string> = {
  en: 'Find answers to common questions about prop trading, challenges, payouts, and funded accounts.',
  fr: 'Trouvez des réponses aux questions courantes sur le prop trading, les challenges, les paiements et les comptes financés.',
  de: 'Finden Sie Antworten auf häufige Fragen zu Prop-Trading, Challenges, Auszahlungen und finanzierten Konten.',
  es: 'Encuentre respuestas a preguntas comunes sobre prop trading, desafíos, pagos y cuentas financiadas.',
  pt: 'Encontre respostas para perguntas comuns sobre prop trading, desafios, pagamentos e contas financiadas.',
  ar: 'اعثر على إجابات للأسئلة الشائعة حول التداول الممول والتحديات والدفعات والحسابات الممولة.',
  hi: 'प्रॉप ट्रेडिंग, चैलेंज, पेआउट और फंडेड अकाउंट्स के बारे में सामान्य प्रश्नों के उत्तर खोजें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/faq'),
  }
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
