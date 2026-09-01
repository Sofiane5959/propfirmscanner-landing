import type { Metadata } from 'next'
import { generateDynamicAlternates } from '@/lib/seo'
import GlossaryPageClient from './GlossaryPageClient'

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
  title: 'Prop Trading Glossary - Terms & Definitions | PropFirm Scanner',
  description: 'Learn prop trading terminology: drawdown, profit split, challenge, funded account, and more. Complete glossary for beginner and advanced traders.',
  keywords: 'prop trading glossary, prop firm terms, trading terminology, drawdown definition, profit split meaning',
    ...generateDynamicAlternates(locale, '/glossary'),
  }
}

export default function GlossaryPage() {
  return <GlossaryPageClient />
}
