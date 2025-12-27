import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Us | PropFirm Scanner',
  description: 'Get in touch with PropFirm Scanner. Report incorrect data, suggest a prop firm, or ask any questions about prop trading.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/contact',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
