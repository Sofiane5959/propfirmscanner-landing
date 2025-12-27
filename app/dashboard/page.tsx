import type { Metadata } from 'next'
import DashboardClient from './DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | PropFirm Scanner',
  description: 'Your personal prop trading dashboard. Track watchlists, compare firms, and manage your trading journey.',
  alternates: {
    canonical: 'https://www.propfirmscanner.org/dashboard',
  },
}

export default function DashboardPage() {
  return <DashboardClient />
}
