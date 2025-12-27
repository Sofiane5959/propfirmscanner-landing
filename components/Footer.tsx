import Link from 'next/link'
import { 
  Twitter, Linkedin, Mail, ExternalLink,
  Shield, Heart, FileText, HelpCircle
} from 'lucide-react'

const FOOTER_LINKS = {
  compare: {
    title: 'Compare',
    links: [
      { label: 'All Prop Firms', href: '/compare' },
      { label: 'Best for Forex', href: '/best-for/forex' },
      { label: 'Best for Futures', href: '/best-for/futures' },
      { label: 'Best for Crypto', href: '/best-for/crypto' },
      { label: 'Best for Beginners', href: '/best-for/beginners' },
      { label: 'Best for Scalping', href: '/best-for/scalping' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Free Guide', href: '/guide' },
      { label: 'Deals & Discounts', href: '/deals' },
      { label: 'Risk Calculator', href: '/tools/risk-calculator' },
      { label: 'Rule Tracker', href: '/tools/rule-tracker' },
    ],
  },
  popular: {
    title: 'Popular Comparisons',
    links: [
      { label: 'FTMO vs FundedNext', href: '/compare/ftmo-vs-fundednext' },
      { label: 'FTMO vs The5ers', href: '/compare/ftmo-vs-the5ers' },
      { label: 'Apex vs Topstep', href: '/compare/apex-trader-funding-vs-topstep' },
      { label: 'FTMO vs FXIFY', href: '/compare/ftmo-vs-fxify' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'How We Verify Data', href: '/how-we-verify' },
      { label: 'How We Make Money', href: '/how-we-make-money' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  },
}

const SOCIAL_LINKS = [
  { icon: Twitter, href: 'https://twitter.com/propfirmscanner', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/propfirmscanner', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@propfirmscanner.org', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-white mb-4 block">
              PropFirm Scanner
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Compare 90+ prop trading firms. Find the best match for your trading style.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-xs">
                <Shield className="w-3 h-3" />
                Verified Data
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-400 text-xs">
                Updated Weekly
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="border-t border-gray-800 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start gap-3 text-xs text-gray-500">
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-gray-400">Risk Disclaimer:</strong> Trading in financial markets involves 
              substantial risk of loss. The information on this website is for educational purposes only and 
              should not be considered financial advice. Past performance is not indicative of future results. 
              Always verify information directly with prop firms before purchasing.{' '}
              <Link href="/disclaimer" className="text-emerald-400 hover:underline">
                Read full disclaimer
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PropFirm Scanner. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <Link href="/how-we-verify" className="text-gray-400 hover:text-emerald-400 flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Verified Data
              </Link>
              <Link href="/how-we-make-money" className="text-gray-400 hover:text-emerald-400 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                Affiliate Disclosure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
