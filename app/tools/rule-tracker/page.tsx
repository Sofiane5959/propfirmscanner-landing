import type { Metadata } from 'next'
import RuleTrackerClient from './RuleTrackerClient'

export const metadata: Metadata = {
  title: 'Rule Tracker - Track Your Prop Firm Challenge | PropFirm Scanner',
  description: 'Track your prop firm challenge progress. Monitor profit targets, drawdown limits, and trading days to stay within the rules and pass your evaluation.',
  keywords: 'prop firm rule tracker, challenge tracker, drawdown tracker, profit target tracker, prop trading tool',
  openGraph: {
    title: 'Rule Tracker - Track Your Prop Firm Challenge',
    description: 'Track your prop firm challenge progress. Monitor profit targets, drawdown limits, and trading days.',
    url: 'https://www.propfirmscanner.org/tools/rule-tracker',
  },
  alternates: {
    canonical: 'https://www.propfirmscanner.org/tools/rule-tracker',
  },
}

export default function RuleTrackerPage() {
  return <RuleTrackerClient />
}
