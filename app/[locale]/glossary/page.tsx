import type { Metadata } from 'next'
import GlossaryPageClient from './GlossaryPageClient'

export const metadata: Metadata = {
  title: 'Prop Trading Glossary - Terms & Definitions | PropFirm Scanner',
  description: 'Learn prop trading terminology: drawdown, profit split, challenge, funded account, and more. Complete glossary for beginner and advanced traders.',
  keywords: 'prop trading glossary, prop firm terms, trading terminology, drawdown definition, profit split meaning',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/glossary',
  },
}

export default function GlossaryPage() {
  return <GlossaryPageClient />
}
