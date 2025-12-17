'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Target, BarChart3, User, Bell } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              PropFirm<span className="text-brand-400">Scanner</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/compare" 
              className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Compare
            </Link>
            <Link 
              href="/deals" 
              className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              🔥 Deals
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 text-sm font-semibold text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-dark-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/compare"
              className="block px-4 py-3 text-base font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Compare Prop Firms
            </Link>
            <Link
              href="/deals"
              className="block px-4 py-3 text-base font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              🔥 Deals & Promos
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-3 text-base font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <hr className="border-white/10 my-3" />
            <Link
              href="/auth/login"
              className="block px-4 py-3 text-base font-medium text-dark-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="block px-4 py-3 text-base font-semibold text-center text-dark-900 bg-gradient-to-r from-brand-400 to-emerald-400 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
