'use client';

import Link from 'next/link';
import { Twitter, Mail, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-bold text-lg">
                PropFirm<span className="text-emerald-400">Scanner</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Compare 80+ prop trading firms and find your perfect match.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/propfirmscanner"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="mailto:contact@propfirmscanner.org"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/compare" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Compare Firms
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Deals &amp; Promos
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Free Guide
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog/how-to-choose-right-prop-firm" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  How to Choose
                </Link>
              </li>
              <li>
                <Link href="/blog/best-prop-firms-2025" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Best Firms 2025
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-pass-prop-firm-challenge" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Pass Your Challenge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Firms */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Firms</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/prop-firm/ftmo" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  FTMO
                </Link>
              </li>
              <li>
                <Link href="/prop-firm/the5ers" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  The5ers
                </Link>
              </li>
              <li>
                <Link href="/prop-firm/fundednext" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  FundedNext
                </Link>
              </li>
              <li>
                <Link href="/prop-firm/myfundedfx" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  MyFundedFX
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} PropFirmScanner. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs text-center md:text-right max-w-xl">
              <Shield className="w-3 h-3 inline mr-1" />
              Independent comparison platform. We may earn affiliate commissions. Trading involves risk.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
