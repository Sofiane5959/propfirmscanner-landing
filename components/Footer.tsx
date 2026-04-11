'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

// Social icons as SVG (lucide doesn't have these)
const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

// =============================================================================
// TRANSLATIONS
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

const translations: Record<Locale, Record<string, string>> = {
  en: {
    description: 'Compare 80+ prop trading firms and find your perfect match.',
    product: 'Product',
    compareFirms: 'Compare Firms',
    dealsPromos: 'Deals & Promos',
    freeGuide: 'Free Guide',
    blog: 'Blog',
    resources: 'Resources',
    howToChoose: 'How to Choose',
    bestFirms: 'Best Firms 2025',
    passChallenge: 'Pass Your Challenge',
    faq: 'FAQ',
    popularFirms: 'Popular Firms',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    disclaimer: 'Disclaimer',
    contact: 'Contact',
    copyright: 'PropFirmScanner. All rights reserved.',
    affiliate: 'Independent comparison platform. We may earn affiliate commissions. Trading involves risk.',
  },
  fr: {
    description: 'Comparez plus de 80 prop firms et trouvez celle qui vous correspond.',
    product: 'Produit',
    compareFirms: 'Comparer les Firms',
    dealsPromos: 'Promos & Offres',
    freeGuide: 'Guide Gratuit',
    blog: 'Blog',
    resources: 'Ressources',
    howToChoose: 'Comment Choisir',
    bestFirms: 'Meilleures Firms 2025',
    passChallenge: 'Reussir son Challenge',
    faq: 'FAQ',
    popularFirms: 'Firms Populaires',
    legal: 'Legal',
    privacyPolicy: 'Politique de Confidentialite',
    termsOfService: 'Conditions d\'Utilisation',
    disclaimer: 'Avertissement',
    contact: 'Contact',
    copyright: 'PropFirmScanner. Tous droits reserves.',
    affiliate: 'Plateforme de comparaison independante. Nous pouvons recevoir des commissions d\'affiliation. Le trading comporte des risques.',
  },
  de: {
    description: 'Vergleichen Sie uber 80 Prop-Trading-Firmen und finden Sie Ihre perfekte Wahl.',
    product: 'Produkt',
    compareFirms: 'Firms Vergleichen',
    dealsPromos: 'Angebote & Promos',
    freeGuide: 'Kostenloser Guide',
    blog: 'Blog',
    resources: 'Ressourcen',
    howToChoose: 'Wie man wahlt',
    bestFirms: 'Beste Firms 2025',
    passChallenge: 'Challenge bestehen',
    faq: 'FAQ',
    popularFirms: 'Beliebte Firms',
    legal: 'Rechtliches',
    privacyPolicy: 'Datenschutz',
    termsOfService: 'Nutzungsbedingungen',
    disclaimer: 'Haftungsausschluss',
    contact: 'Kontakt',
    copyright: 'PropFirmScanner. Alle Rechte vorbehalten.',
    affiliate: 'Unabhangige Vergleichsplattform. Wir erhalten moglicherweise Affiliate-Provisionen. Trading birgt Risiken.',
  },
  es: {
    description: 'Compara mas de 80 prop firms y encuentra tu opcion perfecta.',
    product: 'Producto',
    compareFirms: 'Comparar Firms',
    dealsPromos: 'Ofertas y Promos',
    freeGuide: 'Guia Gratis',
    blog: 'Blog',
    resources: 'Recursos',
    howToChoose: 'Como Elegir',
    bestFirms: 'Mejores Firms 2025',
    passChallenge: 'Superar el Challenge',
    faq: 'FAQ',
    popularFirms: 'Firms Populares',
    legal: 'Legal',
    privacyPolicy: 'Politica de Privacidad',
    termsOfService: 'Terminos de Servicio',
    disclaimer: 'Aviso Legal',
    contact: 'Contacto',
    copyright: 'PropFirmScanner. Todos los derechos reservados.',
    affiliate: 'Plataforma de comparacion independiente. Podemos recibir comisiones de afiliados. El trading conlleva riesgos.',
  },
  pt: {
    description: 'Compare mais de 80 prop firms e encontre sua opcao perfeita.',
    product: 'Produto',
    compareFirms: 'Comparar Firms',
    dealsPromos: 'Ofertas e Promos',
    freeGuide: 'Guia Gratis',
    blog: 'Blog',
    resources: 'Recursos',
    howToChoose: 'Como Escolher',
    bestFirms: 'Melhores Firms 2025',
    passChallenge: 'Passar no Challenge',
    faq: 'FAQ',
    popularFirms: 'Firms Populares',
    legal: 'Legal',
    privacyPolicy: 'Politica de Privacidade',
    termsOfService: 'Termos de Servico',
    disclaimer: 'Aviso Legal',
    contact: 'Contato',
    copyright: 'PropFirmScanner. Todos os direitos reservados.',
    affiliate: 'Plataforma de comparacao independente. Podemos receber comissoes de afiliados. O trading envolve riscos.',
  },
  ar: {
    description: 'قارن اكثر من 80 شركة prop واعثر على الخيار المثالي لك.',
    product: 'المنتج',
    compareFirms: 'مقارنة الشركات',
    dealsPromos: 'العروض والخصومات',
    freeGuide: 'دليل مجاني',
    blog: 'المدونة',
    resources: 'الموارد',
    howToChoose: 'كيف تختار',
    bestFirms: 'افضل الشركات 2025',
    passChallenge: 'اجتياز التحدي',
    faq: 'الاسئلة الشائعة',
    popularFirms: 'شركات شائعة',
    legal: 'قانوني',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    disclaimer: 'اخلاء المسؤولية',
    contact: 'اتصل بنا',
    copyright: 'PropFirmScanner. جميع الحقوق محفوظة.',
    affiliate: 'منصة مقارنة مستقلة. قد نحصل على عمولات تسويقية. التداول ينطوي على مخاطر.',
  },
  hi: {
    description: '80+ prop trading firms की तुलना करें और अपना परफेक्ट मैच खोजें।',
    product: 'उत्पाद',
    compareFirms: 'Firms की तुलना',
    dealsPromos: 'डील्स और प्रोमो',
    freeGuide: 'मुफ्त गाइड',
    blog: 'ब्लॉग',
    resources: 'संसाधन',
    howToChoose: 'कैसे चुनें',
    bestFirms: 'बेस्ट Firms 2025',
    passChallenge: 'Challenge पास करें',
    faq: 'FAQ',
    popularFirms: 'लोकप्रिय Firms',
    legal: 'कानूनी',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    disclaimer: 'अस्वीकरण',
    contact: 'संपर्क',
    copyright: 'PropFirmScanner. सर्वाधिकार सुरक्षित।',
    affiliate: 'स्वतंत्र तुलना प्लेटफॉर्म। हम एफिलिएट कमीशन प्राप्त कर सकते हैं। ट्रेडिंग में जोखिम शामिल है।',
  },
};

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

export default function Footer() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;
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
              {t.description}
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href="https://x.com/ScannerPropFirm" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-400 rounded-lg transition-colors" aria-label="X / Twitter">
                <XIcon />
              </a>
              <a href="https://www.youtube.com/@PropFirmScannerOfficial" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 rounded-lg transition-colors" aria-label="YouTube">
                <YouTubeIcon />
              </a>
              <a href="https://www.tiktok.com/@propfirmscanner" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-400 rounded-lg transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href="https://discord.gg/propfirmscanner" target="_blank" rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-indigo-600 hover:text-white text-gray-400 rounded-lg transition-colors" aria-label="Discord">
                <DiscordIcon />
              </a>
              <a href="mailto:contact@propfirmscanner.org"
                className="p-2 bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-400 rounded-lg transition-colors" aria-label="Email">
                <MailIcon />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.product}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/compare" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.compareFirms}
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.dealsPromos}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.freeGuide}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.resources}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog/how-to-choose-right-prop-firm" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.howToChoose}
                </Link>
              </li>
              <li>
                <Link href="/blog/best-prop-firms-2025" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.bestFirms}
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-pass-prop-firm-challenge" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.passChallenge}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Firms */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.popularFirms}</h3>
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
            <h3 className="text-white font-semibold mb-4">{t.legal}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.disclaimer}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                  {t.contact}
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
              © {currentYear} {t.copyright}
            </p>
            <p className="text-gray-600 text-xs text-center md:text-right max-w-xl">
              <Shield className="w-3 h-3 inline mr-1" />
              {t.affiliate}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
