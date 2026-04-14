import { Metadata } from 'next'
import QuizClient from './QuizClient'

export const metadata: Metadata = {
  title: 'Find Your Perfect Prop Firm | PropFirmScanner',
  description: 'Answer 4 quick questions and get a personalized prop firm recommendation based on your trading style, budget, and goals.',
}

export default function QuizPage() {
  return <QuizClient />
}
