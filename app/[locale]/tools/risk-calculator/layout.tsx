// app/[locale]/tools/risk-calculator/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Risk Calculator',
  fr: 'Calculateur de Risque',
  de: 'Risiko-Rechner',
  es: 'Calculadora de Riesgo',
  pt: 'Calculadora de Risco',
  ar: 'حاسبة المخاطر',
  hi: 'रिस्क कैलकुलेटर',
}

const descriptions: Record<string, string> = {
  en: 'Free risk calculator for prop trading. Calculate your position risk and manage your trading account effectively.',
  fr: 'Calculateur de risque gratuit pour le prop trading. Calculez votre risque et gérez votre compte efficacement.',
  de: 'Kostenloser Risiko-Rechner für Prop-Trading. Berechnen Sie Ihr Positionsrisiko effektiv.',
  es: 'Calculadora de riesgo gratuita para prop trading. Calcule su riesgo y gestione su cuenta eficazmente.',
  pt: 'Calculadora de risco gratuita para prop trading. Calcule seu risco e gerencie sua conta efetivamente.',
  ar: 'حاسبة مخاطر مجانية للتداول الممول. احسب مخاطر مركزك وأدر حسابك بفعالية.',
  hi: 'प्रॉप ट्रेडिंग के लिए मुफ्त रिस्क कैलकुलेटर। अपने पोजीशन रिस्क की गणना करें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/tools/risk-calculator'),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
