// app/[locale]/tools/drawdown-simulator/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Drawdown Simulator',
  fr: 'Simulateur de Drawdown',
  de: 'Drawdown-Simulator',
  es: 'Simulador de Drawdown',
  pt: 'Simulador de Drawdown',
  ar: 'محاكي السحب',
  hi: 'ड्रॉडाउन सिम्युलेटर',
}

const descriptions: Record<string, string> = {
  en: 'Simulate and track your drawdown for prop firm challenges. Stay within limits and pass your challenge successfully.',
  fr: 'Simulez et suivez votre drawdown pour les challenges prop firm. Restez dans les limites et réussissez votre challenge.',
  de: 'Simulieren und verfolgen Sie Ihren Drawdown für Prop-Firm-Challenges. Bleiben Sie innerhalb der Grenzen.',
  es: 'Simule y rastree su drawdown para desafíos de prop firms. Manténgase dentro de los límites.',
  pt: 'Simule e acompanhe seu drawdown para desafios de prop firms. Fique dentro dos limites.',
  ar: 'قم بمحاكاة وتتبع السحب الخاص بك لتحديات شركات التداول. ابق ضمن الحدود.',
  hi: 'प्रॉप फर्म चैलेंज के लिए अपने ड्रॉडाउन को सिम्युलेट और ट्रैक करें। सीमा में रहें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/tools/drawdown-simulator'),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
