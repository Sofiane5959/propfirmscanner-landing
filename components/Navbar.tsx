'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BookOpen, BarChart3, Tag, FileText, Shield } from 'lucide-react'

const navigation = [
  { name: 'Compare', href: '/compare', icon: BarChart3 },
  { name: 'Deals', href: '/deals', icon: Tag },
  { name: 'Blog', href: '/blog', icon: FileText },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isMyPropFirmsActive = pathname.startsWith('/dashboard')

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

            {/* Free Guide */}
            <Link
              href="/guide"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            >
              <BookOpen className="w-4 h-4" />
              Free Guide
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded">FREE</span>
            </Link>

            {/* My Prop Firms - Main Product */}
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              Get Started
            </Link>
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

            {/* Free Guide */}
            <Link
              href="/guide"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400"
            >
              <BookOpen className="w-5 h-5" />
              Free Guide
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded ml-auto">FREE</span>
            </Link>

            {/* My Prop Firms */}
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
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
