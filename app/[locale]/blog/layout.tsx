// app/[locale]/blog/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Prop Trading Blog',
  fr: 'Blog Prop Trading',
  de: 'Prop Trading Blog',
  es: 'Blog de Prop Trading',
  pt: 'Blog de Prop Trading',
  ar: 'مدونة التداول الممول',
  hi: 'प्रॉप ट्रेडिंग ब्लॉग',
}

const descriptions: Record<string, string> = {
  en: 'Latest news, tips and strategies for prop trading. Stay updated with the prop firm industry.',
  fr: 'Dernières actualités, conseils et stratégies pour le prop trading. Restez informé de l\'industrie.',
  de: 'Neueste Nachrichten, Tipps und Strategien für Prop-Trading. Bleiben Sie auf dem Laufenden.',
  es: 'Últimas noticias, consejos y estrategias de prop trading. Manténgase actualizado con la industria.',
  pt: 'Últimas notícias, dicas e estratégias de prop trading. Fique atualizado com a indústria.',
  ar: 'آخر الأخبار والنصائح والاستراتيجيات للتداول الممول. ابق على اطلاع بأحدث المستجدات.',
  hi: 'प्रॉप ट्रेडिंग के लिए नवीनतम समाचार, टिप्स और रणनीतियां। इंडस्ट्री से अपडेट रहें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/blog'),
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
