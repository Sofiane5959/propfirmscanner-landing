import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = {
  title: 'PropFirmScanner | Compare Verified Prop Firms & Track Your Challenge',
  description: 'Compare verified prop trading firms side-by-side. Track your challenge with our free dashboard. Never blow your account again. Updated daily.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org',
  },
}

export default function HomePage() {
  return <HomeContent />
}
