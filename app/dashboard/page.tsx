'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p className="text-gray-300">Email: {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/compare" className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center">
            <span className="text-lg">Compare Firms</span>
          </Link>
          <Link href="/deals" className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center">
            <span className="text-lg">Deals</span>
          </Link>
          <Link href="/dashboard/settings" className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center">
            <span className="text-lg">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
