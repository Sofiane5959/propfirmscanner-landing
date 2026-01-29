// app/[locale]/compare/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Compare Prop Firms',
  fr: 'Comparer les Prop Firms',
  de: 'Prop Firms Vergleichen',
  es: 'Comparar Prop Firms',
  pt: 'Comparar Prop Firms',
  ar: 'مقارنة شركات التداول',
  hi: 'प्रॉप फर्म्स की तुलना करें',
}

const descriptions: Record<string, string> = {
  en: 'Compare prop trading firms side by side. Find the best prop firm for your trading style with our comprehensive comparison tool.',
  fr: 'Comparez les prop trading firms côte à côte. Trouvez la meilleure prop firm pour votre style de trading.',
  de: 'Vergleichen Sie Prop-Trading-Firmen nebeneinander. Finden Sie die beste Prop-Firma für Ihren Trading-Stil.',
  es: 'Compare empresas de prop trading lado a lado. Encuentre la mejor prop firm para su estilo de trading.',
  pt: 'Compare empresas de prop trading lado a lado. Encontre a melhor prop firm para seu estilo de trading.',
  ar: 'قارن شركات التداول الممول جنبًا إلى جنب. اعثر على أفضل شركة لأسلوب تداولك.',
  hi: 'प्रॉप ट्रेडिंग फर्मों की साथ-साथ तुलना करें। अपनी ट्रेडिंग शैली के लिए सबसे अच्छी प्रॉप फर्म खोजें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/compare'),
  }
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
