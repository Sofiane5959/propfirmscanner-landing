import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'
import FAQPageClient from './FAQPageClient'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale || 'en'

  // Canonical was a hard-coded absolute URL, identical for the seven
  // locales. generateDynamicAlternates makes it self-referential and
  // emits hreflang only for the locales that are actually translated.
  return {
  title: 'FAQ - Prop Trading Questions Answered | PropFirm Scanner',
  description: 'Get answers to common questions about prop trading firms, challenges, rules, payouts, and more. Everything you need to know before starting.',
  keywords: 'prop firm FAQ, prop trading questions, funded account FAQ, prop firm challenge questions',
  openGraph: {
    title: 'Prop Trading FAQ - Questions Answered',
    description: 'Get answers to common questions about prop trading firms, challenges, rules, and payouts.',
    url: 'https://www.propfirmscanner.org/faq',
  },
    ...generateDynamicAlternates(locale, '/faq'),
  }
}

export default function FAQPage() {
  return <FAQPageClient />
}
