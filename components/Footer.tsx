'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Twitter, Mail, Shield } from 'lucide-react';

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
