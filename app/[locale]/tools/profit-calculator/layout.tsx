// app/[locale]/tools/profit-calculator/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Profit Calculator',
  fr: 'Calculateur de Profit',
  de: 'Gewinn-Rechner',
  es: 'Calculadora de Ganancias',
  pt: 'Calculadora de Lucro',
  ar: 'حاسبة الأرباح',
  hi: 'प्रॉफिट कैलकुलेटर',
}

const descriptions: Record<string, string> = {
  en: 'Calculate potential profits from your prop trading. Free profit calculator for funded traders.',
  fr: 'Calculez vos profits potentiels en prop trading. Calculateur de profit gratuit pour traders.',
  de: 'Berechnen Sie potenzielle Gewinne aus Ihrem Prop-Trading. Kostenloser Gewinnrechner.',
  es: 'Calcule ganancias potenciales de su prop trading. Calculadora de ganancias gratuita.',
  pt: 'Calcule lucros potenciais do seu prop trading. Calculadora de lucro gratuita.',
  ar: 'احسب الأرباح المحتملة من تداولك الممول. حاسبة أرباح مجانية.',
  hi: 'अपने प्रॉप ट्रेडिंग से संभावित प्रॉफिट की गणना करें। मुफ्त प्रॉफिट कैलकुलेटर।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/tools/profit-calculator'),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
