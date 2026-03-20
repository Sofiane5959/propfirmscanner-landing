'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BookOpen, BarChart3, Tag, FileText, Shield, GraduationCap, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const navigation = [
  { name: 'Compare', href: '/compare', icon: BarChart3 },
  { name: 'Deals', href: '/deals', icon: Tag },
  { name: 'Blog', href: '/blog', icon: FileText },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, isLoading } = useAuth()
  const supabase = createClientComponentClient()

  const isMyPropFirmsActive = pathname.startsWith('/dashboard')
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              PropFirm<span className="text-emerald-400">Scanner</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}

            {/* Education */}
            <Link
              href="/education"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${pathname.startsWith('/education')
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <GraduationCap className="w-4 h-4" />
              Education
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded">Soon</span>
            </Link>

            {/* Free Guide */}
            <Link
              href="/guide"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <BookOpen className="w-4 h-4" />
              Free Guide
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded">FREE</span>
            </Link>

            {/* My Prop Firms */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isMyPropFirmsActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <Shield className="w-4 h-4" />
              My Prop Firms
            </Link>
          </div>

          {/* Auth — Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : user ? (
              // ── Connecté ──────────────────────────────────────────────────
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <span className="text-sm text-gray-300 max-w-[120px] truncate">{displayName}</span>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/education/fundamentals"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      My Courses
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ── Non connecté ──────────────────────────────────────────────
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}

            <Link
              href="/education"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
            >
              <GraduationCap className="w-5 h-5" />
              Education
            </Link>

            <Link
              href="/guide"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400"
            >
              <BookOpen className="w-5 h-5" />
              Free Guide
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded ml-auto">FREE</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isMyPropFirmsActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <Shield className="w-5 h-5" />
              My Prop Firms
            </Link>

            <div className="pt-4 border-t border-gray-800 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white font-medium">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/education/fundamentals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                  >
                    <GraduationCap className="w-4 h-4" />
                    My Courses
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 rounded-lg hover:bg-red-500/5"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
