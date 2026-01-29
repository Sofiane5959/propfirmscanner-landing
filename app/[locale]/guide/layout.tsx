// app/[locale]/guide/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Prop Trading Guide',
  fr: 'Guide du Prop Trading',
  de: 'Prop Trading Leitfaden',
  es: 'Guía de Prop Trading',
  pt: 'Guia de Prop Trading',
  ar: 'دليل التداول الممول',
  hi: 'प्रॉप ट्रेडिंग गाइड',
}

const descriptions: Record<string, string> = {
  en: 'Complete guide to prop trading. Learn everything about funded trading accounts and how to pass challenges successfully.',
  fr: 'Guide complet du prop trading. Apprenez tout sur les comptes financés et comment réussir les challenges.',
  de: 'Kompletter Leitfaden zum Prop-Trading. Lernen Sie alles über finanzierte Handelskonten und wie Sie Challenges bestehen.',
  es: 'Guía completa de prop trading. Aprenda todo sobre cuentas financiadas y cómo pasar desafíos con éxito.',
  pt: 'Guia completo de prop trading. Aprenda tudo sobre contas financiadas e como passar desafios com sucesso.',
  ar: 'دليل شامل للتداول الممول. تعلم كل شيء عن الحسابات الممولة وكيفية اجتياز التحديات بنجاح.',
  hi: 'प्रॉप ट्रेडिंग की पूरी गाइड। फंडेड ट्रेडिंग अकाउंट्स और चैलेंज पास करने के बारे में सब कुछ जानें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/guide'),
  }
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
