import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'
import ContactPageClient from './ContactPageClient'

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
  title: 'Contact Us | PropFirm Scanner',
  description: 'Get in touch with PropFirm Scanner. Report incorrect data, suggest a prop firm, or ask any questions about prop trading.',
    ...generateDynamicAlternates(locale, '/contact'),
  }
}

export default function ContactPage() {
  return <ContactPageClient />
}
