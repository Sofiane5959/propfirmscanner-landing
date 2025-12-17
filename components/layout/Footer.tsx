import Link from 'next/link'
import { Target, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                PropFirm<span className="text-brand-400">Scanner</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm max-w-md mb-4">
              The #1 platform to compare prop trading firms. Find the perfect match for your trading style with our comprehensive comparison tools.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/propfirmscanner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-dark-400" />
              </a>
              <a 
                href="mailto:contact@propfirmscanner.org"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4 text-dark-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/compare" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Compare Firms
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Deals & Promos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} PropFirm Scanner. All rights reserved.
          </p>
          <p className="text-dark-500 text-xs">
            Trading involves risk. This site contains affiliate links.
          </p>
        </div>
      </div>
    </footer>
  )
}
