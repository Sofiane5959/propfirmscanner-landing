// app/[locale]/tools/rule-tracker/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Rule Tracker',
  fr: 'Suivi des Règles',
  de: 'Regel-Tracker',
  es: 'Rastreador de Reglas',
  pt: 'Rastreador de Regras',
  ar: 'متتبع القواعد',
  hi: 'रूल ट्रैकर',
}

const descriptions: Record<string, string> = {
  en: 'Track prop firm rules and stay compliant. Never violate trading rules during your challenge again.',
  fr: 'Suivez les règles des prop firms et restez conforme. Ne violez plus jamais les règles de trading.',
  de: 'Verfolgen Sie Prop-Firm-Regeln und bleiben Sie konform. Verletzen Sie nie wieder Handelsregeln.',
  es: 'Rastree las reglas de prop firms y manténgase en cumplimiento. Nunca viole las reglas de trading.',
  pt: 'Acompanhe as regras de prop firms e mantenha-se em conformidade. Nunca viole as regras de trading.',
  ar: 'تتبع قواعد شركات التداول والتزم بها. لا تنتهك قواعد التداول أبدًا.',
  hi: 'प्रॉप फर्म नियमों को ट्रैक करें और अनुपालन में रहें। ट्रेडिंग नियमों का उल्लंघन फिर कभी न करें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/tools/rule-tracker'),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
