'use client';

import Link from 'next/link';
import { 
  Twitter, Youtube, Instagram, MessageCircle, 
  Mail, ExternalLink, Heart, Globe
} from 'lucide-react';

// =============================================================================
// CONFIGURATION - Modifie tes liens ici
// =============================================================================

const socialLinks = {
  twitter: 'https://twitter.com/propfirmscanner',      // Remplace par ton lien
  youtube: 'https://youtube.com/@propfirmscanner',     // Remplace par ton lien
  instagram: 'https://instagram.com/propfirmscanner',  // Remplace par ton lien
  discord: 'https://discord.gg/propfirmscanner',       // Remplace par ton lien
  telegram: 'https://t.me/propfirmscanner',            // Remplace par ton lien
  tiktok: 'https://tiktok.com/@propfirmscanner',       // Remplace par ton lien
  email: 'contact@propfirmscanner.org',                // Remplace par ton email
};

const footerLinks = {
  products: [
    { name: 'Compare Firms', href: '/compare' },
    { name: 'Deals & Discounts', href: '/deals' },
    { name: 'MyPropFirm Pro', href: '/mypropfirm', badge: 'Soon' },
    { name: 'Rules Explained', href: '/rules-explained', badge: 'Soon' },
  ],
  learn: [
    { name: 'Blog', href: '/blog' },
    { name: 'Education', href: '/education', badge: 'Soon' },
    { name: 'Beginner Guide', href: '/blog/first-prop-firm-guide' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

// =============================================================================
// SOCIAL ICONS DATA
// =============================================================================

const socialIcons = [
  { 
    name: 'Twitter / X', 
    href: socialLinks.twitter, 
    icon: Twitter,
    color: 'hover:text-sky-400 hover:bg-sky-400/10',
  },
  { 
    name: 'YouTube', 
    href: socialLinks.youtube, 
    icon: Youtube,
    color: 'hover:text-red-500 hover:bg-red-500/10',
  },
  { 
    name: 'Instagram', 
    href: socialLinks.instagram, 
    icon: Instagram,
    color: 'hover:text-pink-500 hover:bg-pink-500/10',
  },
  { 
    name: 'Discord', 
    href: socialLinks.discord, 
    icon: MessageCircle,
    color: 'hover:text-indigo-400 hover:bg-indigo-400/10',
  },
  { 
    name: 'TikTok', 
    href: socialLinks.tiktok, 
    icon: Globe, // Lucide n'a pas d'icône TikTok, utilise Globe ou une custom
    color: 'hover:text-white hover:bg-white/10',
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

// Composant simple pour les réseaux sociaux (à utiliser n'importe où)
export function SocialIcons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialIcons.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg bg-gray-800 text-gray-400 transition-all duration-300 ${social.color}`}
            aria-label={social.name}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}

// =============================================================================
// MAIN FOOTER COMPONENT
// =============================================================================

export default function SocialFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-white font-bold text-lg">PropFirmScanner</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6">
              The ultimate platform to compare, analyze, and choose the best prop trading firms.
            </p>
            
            {/* Social Icons */}
            <SocialIcons />
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2"
                  >
                    {link.name}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-white font-semibold mb-4">Learn</h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-2"
                  >
                    {link.name}
                    {link.badge && (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-500 text-sm mb-4">
              Get the latest deals and prop firm news.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>© {currentYear} PropFirmScanner. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for traders.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a 
                href={`mailto:${socialLinks.email}`}
                className="text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
              <span className="text-gray-700">|</span>
              <span className="text-gray-500">
                Not financial advice
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// EXPORT POUR USAGE FACILE
// =============================================================================

// Exporte aussi les liens pour les utiliser ailleurs si besoin
export { socialLinks, footerLinks };
