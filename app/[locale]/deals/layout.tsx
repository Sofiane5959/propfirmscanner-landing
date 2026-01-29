// app/[locale]/deals/layout.tsx
import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'

const titles: Record<string, string> = {
  en: 'Prop Firm Deals & Discounts',
  fr: 'Offres et Réductions Prop Firms',
  de: 'Prop Firm Angebote & Rabatte',
  es: 'Ofertas y Descuentos Prop Firms',
  pt: 'Ofertas e Descontos Prop Firms',
  ar: 'عروض وخصومات شركات التداول',
  hi: 'प्रॉप फर्म ऑफर्स और छूट',
}

const descriptions: Record<string, string> = {
  en: 'Find the latest prop firm discount codes and exclusive deals. Save money on your trading challenge.',
  fr: 'Trouvez les derniers codes de réduction et offres exclusives pour les prop firms. Économisez sur vos challenges.',
  de: 'Finden Sie die neuesten Rabattcodes und exklusiven Angebote für Prop-Firmen. Sparen Sie bei Ihrer Challenge.',
  es: 'Encuentre los últimos códigos de descuento y ofertas exclusivas de prop firms. Ahorre en su desafío.',
  pt: 'Encontre os últimos códigos de desconto e ofertas exclusivas de prop firms. Economize no seu desafio.',
  ar: 'اعثر على أحدث أكواد الخصم والعروض الحصرية لشركات التداول. وفر في تحدي التداول.',
  hi: 'प्रॉप फर्म्स के लिए नवीनतम डिस्काउंट कोड और विशेष ऑफर खोजें। अपने चैलेंज पर बचत करें।',
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || 'en'
  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...generateDynamicAlternates(locale, '/deals'),
  }
}

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
