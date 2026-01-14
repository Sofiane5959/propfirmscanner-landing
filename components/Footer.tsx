'use client';

import Link from 'next/link';
import { 
  Twitter, 
  Mail, 
  Shield,
  BarChart3,
  Tag,
  BookOpen,
  FileText,
} from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Compare Firms', href: '/compare', icon: BarChart3 },
    { name: 'Deals & Promos', href: '/deals', icon: Tag },
    { name: 'Free Guide', href: '/guide', icon: BookOpen },
    { name: 'Blog', href: '/blog', icon: FileText },
  ],
  resources: [
    { name: 'How to Choose a Prop Firm', href: '/blog/how-to-choose-right-prop-firm' },
    { name: 'Best Prop Firms 2025', href: '/blog/best-prop-firms-2025' },
    { name: 'Pass Your Challenge', href: '/blog/how-to-pass-prop-firm-challenge' },
    { name: 'Rules Explained', href: '/blog/consistency-rules-explained' },
  ],
  popular: [
    { name: 'FTMO', href: '/prop-firm/ftmo' },
    { name: 'The5ers', href: '/prop-firm/the5ers' },
    { name: 'FundedNext', href: '/prop-firm/fundednext' },
    { name: 'MyFundedFX', href: '/prop-firm/myfundedfx' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer */}
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
              {footerLinks.product.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm flex items-center gap-2 transition-colors"
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Firms */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Firms</h3>
            <ul className="space-y-3">
              {footerLinks.popular.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
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
              PropFirmScanner is an independent comparison platform. We may earn affiliate commissions. Trading involves risk.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
