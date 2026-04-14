'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Users, 
  Star,
  Gift,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  ExternalLink,
  Play,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';

// Simple FirmLogo component
function FirmLogoSimple({ logoUrl, logoFallback, color }: { logoUrl: string | null; logoFallback: string; color: string }) {
  if (logoUrl) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
        <img src={logoUrl} alt="" className="w-8 h-8 object-contain" />
      </div>
    );
  }
  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
      <span className="text-white font-bold text-sm">{logoFallback}</span>
    </div>
  );
}

// =============================================================================
// LOCALE DETECTION
// =============================================================================

const locales = ['en', 'fr', 'de', 'es', 'pt', 'ar', 'hi'] as const;
type Locale = (typeof locales)[number];

function getLocaleFromPath(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  return 'en';
}

// =============================================================================
// TRANSLATIONS
// =============================================================================

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Hero
    badge: 'Updated January 2026',
    heroTitle1: 'Compare Prop Firms.',
    heroTitle2: 'Track Your Challenge.',
    heroDescription: 'Compare verified prop trading firms side-by-side. Filter by rules, fees, and profit split. Track your drawdown with our',
    smartDashboard: 'smart dashboard',
    ctaCompare: 'Compare All Firms',
    ctaTrack: 'Track My Challenge',
    // Top Firms
    topFirmsTitle: 'Top Rated Prop Firms',
    topFirmsSubtitle: 'Based on verified reviews, rules, and trader feedback',
    fromPrice: 'From',
    profitSplit: 'Split',
    viewDetails: 'View Details',
    useCode: 'Use code',
    viewAllFirms: 'View All 80+ Firms',
    // Trading Styles
    tradingStylesTitle: 'Find Firms by Trading Style',
    tradingStylesSubtitle: 'Quick access to firms that match your specific needs',
    scalping: 'Scalping',
    beginners: 'Beginners',
    cheapest: 'Cheapest',
    highSplit: 'High Split',
    instant: 'Instant',
    eaBots: 'EA/Bots',
    // Comparisons
    comparisonsTitle: 'Popular Comparisons',
    comparisonsSubtitle: 'See how top firms stack up against each other',
    // Dashboard Preview
    dashboardTitle: 'Never Blow Your Account Again',
    dashboardSubtitle: 'Track all your challenges in one place with real-time drawdown monitoring',
    dashboardFeature1: 'Real-time drawdown tracking',
    dashboardFeature2: 'Multi-account support',
    dashboardFeature3: 'Smart alerts before limits',
    dashboardCta: 'Start Tracking Free',
    dashboardMock: 'Challenge Dashboard',
    dailyDrawdown: 'Daily Drawdown',
    maxDrawdown: 'Max Drawdown',
    remaining: 'remaining',
    allClear: 'All Clear! Trade confidently.',
    // Why Us
    whyUsTitle: 'Why Traders Choose Us',
    whyUsSubtitle: 'Everything you need to make the right decision',
    smartFilters: 'Smart Filters',
    smartFiltersDesc: 'Filter by trading style, budget, profit split, and 20+ criteria',
    verifiedData: 'Verified Data',
    verifiedDataDesc: 'All data verified directly from prop firm websites',
    realReviews: 'Real Reviews',
    realReviewsDesc: 'Trustpilot ratings and real trader experiences',
    exclusiveDeals: 'Exclusive Deals',
    exclusiveDealsDesc: 'Save up to 55% with our exclusive discount codes',
    // Blog
    blogTitle: 'Latest from the Blog',
    blogSubtitle: 'Tips and strategies to help you get funded',
    viewAll: 'View All',
    readMore: 'Read more',
    guide: 'Guide',
    rules: 'Rules',
    howToChoose: 'How to Choose the Right Prop Firm',
    newsTradingRules: 'News Trading Rules Explained',
    howToPass: 'How to Pass Your Prop Firm Challenge',
    // Final CTA
    finalCtaTitle: 'Ready to Get Funded?',
    finalCtaSubtitle: 'Stop guessing. Compare all prop firms in one place and find your perfect match.',
    startComparing: 'Start Comparing',
    downloadGuide: 'Download Free Guide',
    quizTitle: 'Still Undecided? We Can Help.',
    quizSubtitle: 'Answer 4 quick questions — experience, style, budget, goals — and get your personalized top 3 prop firm matches.',
    quizCta: 'Find My Perfect Match',
  },
  fr: {
    badge: 'Mis a jour janvier 2026',
    heroTitle1: 'Comparez les Prop Firms.',
    heroTitle2: 'Suivez votre Challenge.',
    heroDescription: 'Comparez les prop firms verifiees cote a cote. Filtrez par regles, frais et partage des profits. Suivez votre drawdown avec notre',
    smartDashboard: 'tableau de bord intelligent',
    ctaCompare: 'Comparer les Firms',
    ctaTrack: 'Suivre mon Challenge',
    topFirmsTitle: 'Meilleures Prop Firms',
    topFirmsSubtitle: 'Base sur les avis verifies, regles et retours des traders',
    fromPrice: 'A partir de',
    profitSplit: 'Split',
    viewDetails: 'Voir Details',
    useCode: 'Code',
    viewAllFirms: 'Voir les 80+ Firms',
    tradingStylesTitle: 'Trouvez par Style de Trading',
    tradingStylesSubtitle: 'Acces rapide aux firms selon vos besoins',
    scalping: 'Scalping',
    beginners: 'Debutants',
    cheapest: 'Moins Cher',
    highSplit: 'Haut Split',
    instant: 'Instant',
    eaBots: 'EA/Bots',
    comparisonsTitle: 'Comparaisons Populaires',
    comparisonsSubtitle: 'Voyez comment les meilleures firms se comparent',
    dashboardTitle: 'Ne Cramez Plus Jamais Votre Compte',
    dashboardSubtitle: 'Suivez tous vos challenges en un seul endroit avec un monitoring en temps reel',
    dashboardFeature1: 'Suivi drawdown en temps reel',
    dashboardFeature2: 'Support multi-comptes',
    dashboardFeature3: 'Alertes avant les limites',
    dashboardCta: 'Commencer Gratuitement',
    dashboardMock: 'Tableau de Bord Challenge',
    dailyDrawdown: 'Drawdown Journalier',
    maxDrawdown: 'Drawdown Maximum',
    remaining: 'restant',
    allClear: 'Tout va bien ! Tradez en confiance.',
    whyUsTitle: 'Pourquoi les Traders nous Choisissent',
    whyUsSubtitle: 'Tout ce dont vous avez besoin pour prendre la bonne decision',
    smartFilters: 'Filtres Intelligents',
    smartFiltersDesc: 'Filtrez par style, budget, profit split et 20+ criteres',
    verifiedData: 'Donnees Verifiees',
    verifiedDataDesc: 'Toutes les donnees verifiees directement sur les sites',
    realReviews: 'Vrais Avis',
    realReviewsDesc: 'Notes Trustpilot et experiences reelles de traders',
    exclusiveDeals: 'Offres Exclusives',
    exclusiveDealsDesc: 'Economisez jusqu\'a 55% avec nos codes promo exclusifs',
    blogTitle: 'Derniers Articles du Blog',
    blogSubtitle: 'Conseils et strategies pour etre finance',
    viewAll: 'Voir Tout',
    readMore: 'Lire la suite',
    guide: 'Guide',
    rules: 'Regles',
    howToChoose: 'Comment Choisir la Bonne Prop Firm',
    newsTradingRules: 'Regles de Trading sur News Expliquees',
    howToPass: 'Comment Reussir son Challenge',
    finalCtaTitle: 'Pret a Etre Finance ?',
    finalCtaSubtitle: 'Arretez de deviner. Comparez toutes les prop firms en un seul endroit.',
    startComparing: 'Commencer a Comparer',
    downloadGuide: 'Telecharger le Guide Gratuit',
    quizTitle: 'Encore indecis ? On peut vous aider.',
    quizSubtitle: 'Repondez a 4 questions rapides et obtenez vos 3 meilleures prop firms personnalisees.',
    quizCta: 'Trouver ma Prop Firm',
  },
  de: {
    badge: 'Aktualisiert Januar 2026',
    heroTitle1: 'Prop Firms Vergleichen.',
    heroTitle2: 'Challenge Verfolgen.',
    heroDescription: 'Vergleichen Sie verifizierte Prop-Trading-Firms nebeneinander. Filtern nach Regeln, Gebuhren und Gewinnaufteilung. Verfolgen Sie Ihren Drawdown mit unserem',
    smartDashboard: 'intelligenten Dashboard',
    ctaCompare: 'Alle Firms Vergleichen',
    ctaTrack: 'Meine Challenge Verfolgen',
    topFirmsTitle: 'Top Bewertete Prop Firms',
    topFirmsSubtitle: 'Basierend auf verifizierten Bewertungen und Trader-Feedback',
    fromPrice: 'Ab',
    profitSplit: 'Split',
    viewDetails: 'Details Ansehen',
    useCode: 'Code',
    viewAllFirms: 'Alle 80+ Firms Ansehen',
    tradingStylesTitle: 'Firms nach Trading-Stil Finden',
    tradingStylesSubtitle: 'Schneller Zugang zu Firms die zu Ihren Bedurfnissen passen',
    scalping: 'Scalping',
    beginners: 'Anfanger',
    cheapest: 'Gunstigste',
    highSplit: 'Hoher Split',
    instant: 'Sofort',
    eaBots: 'EA/Bots',
    comparisonsTitle: 'Beliebte Vergleiche',
    comparisonsSubtitle: 'Sehen Sie wie Top-Firms sich vergleichen',
    dashboardTitle: 'Nie Wieder Ihr Konto Verlieren',
    dashboardSubtitle: 'Verfolgen Sie alle Challenges an einem Ort mit Echtzeit-Monitoring',
    dashboardFeature1: 'Echtzeit Drawdown-Tracking',
    dashboardFeature2: 'Multi-Konto Unterstutzung',
    dashboardFeature3: 'Intelligente Alarme vor Limits',
    dashboardCta: 'Kostenlos Starten',
    dashboardMock: 'Challenge Dashboard',
    dailyDrawdown: 'Taglicher Drawdown',
    maxDrawdown: 'Maximaler Drawdown',
    remaining: 'ubrig',
    allClear: 'Alles klar! Traden Sie mit Vertrauen.',
    whyUsTitle: 'Warum Trader Uns Wahlen',
    whyUsSubtitle: 'Alles was Sie fur die richtige Entscheidung brauchen',
    smartFilters: 'Intelligente Filter',
    smartFiltersDesc: 'Filtern nach Trading-Stil, Budget, Profit Split und 20+ Kriterien',
    verifiedData: 'Verifizierte Daten',
    verifiedDataDesc: 'Alle Daten direkt von Prop Firm Websites verifiziert',
    realReviews: 'Echte Bewertungen',
    realReviewsDesc: 'Trustpilot Bewertungen und echte Trader-Erfahrungen',
    exclusiveDeals: 'Exklusive Angebote',
    exclusiveDealsDesc: 'Sparen Sie bis zu 55% mit unseren exklusiven Rabattcodes',
    blogTitle: 'Neuestes aus dem Blog',
    blogSubtitle: 'Tipps und Strategien um finanziert zu werden',
    viewAll: 'Alle Ansehen',
    readMore: 'Weiterlesen',
    guide: 'Guide',
    rules: 'Regeln',
    howToChoose: 'Wie Man die Richtige Prop Firm Wahlt',
    newsTradingRules: 'News Trading Regeln Erklart',
    howToPass: 'Wie Man Seine Prop Firm Challenge Besteht',
    finalCtaTitle: 'Bereit Finanziert zu Werden?',
    finalCtaSubtitle: 'Horen Sie auf zu raten. Vergleichen Sie alle Prop Firms an einem Ort.',
    startComparing: 'Vergleich Starten',
    downloadGuide: 'Kostenlosen Guide Herunterladen',
    quizTitle: 'Noch unentschlossen? Wir helfen.',
    quizSubtitle: 'Beantworte 4 Fragen und erhalte deine personalisierten Top 3 Prop Firm Empfehlungen.',
    quizCta: 'Meine Firma finden',
  },
  es: {
    badge: 'Actualizado enero 2026',
    heroTitle1: 'Compara Prop Firms.',
    heroTitle2: 'Sigue tu Challenge.',
    heroDescription: 'Compara prop firms verificadas lado a lado. Filtra por reglas, tarifas y reparto de beneficios. Sigue tu drawdown con nuestro',
    smartDashboard: 'panel inteligente',
    ctaCompare: 'Comparar Todas las Firms',
    ctaTrack: 'Seguir Mi Challenge',
    topFirmsTitle: 'Prop Firms Mejor Valoradas',
    topFirmsSubtitle: 'Basado en resenas verificadas, reglas y feedback de traders',
    fromPrice: 'Desde',
    profitSplit: 'Split',
    viewDetails: 'Ver Detalles',
    useCode: 'Codigo',
    viewAllFirms: 'Ver las 80+ Firms',
    tradingStylesTitle: 'Encuentra Firms por Estilo de Trading',
    tradingStylesSubtitle: 'Acceso rapido a firms que se adaptan a tus necesidades',
    scalping: 'Scalping',
    beginners: 'Principiantes',
    cheapest: 'Mas Barato',
    highSplit: 'Alto Split',
    instant: 'Instantaneo',
    eaBots: 'EA/Bots',
    comparisonsTitle: 'Comparaciones Populares',
    comparisonsSubtitle: 'Mira como se comparan las mejores firms',
    dashboardTitle: 'Nunca Mas Pierdas Tu Cuenta',
    dashboardSubtitle: 'Sigue todos tus challenges en un solo lugar con monitoreo en tiempo real',
    dashboardFeature1: 'Seguimiento de drawdown en tiempo real',
    dashboardFeature2: 'Soporte multi-cuenta',
    dashboardFeature3: 'Alertas inteligentes antes de limites',
    dashboardCta: 'Empezar Gratis',
    dashboardMock: 'Panel de Challenge',
    dailyDrawdown: 'Drawdown Diario',
    maxDrawdown: 'Drawdown Maximo',
    remaining: 'restante',
    allClear: 'Todo bien! Opera con confianza.',
    whyUsTitle: 'Por Que los Traders Nos Eligen',
    whyUsSubtitle: 'Todo lo que necesitas para tomar la decision correcta',
    smartFilters: 'Filtros Inteligentes',
    smartFiltersDesc: 'Filtra por estilo de trading, presupuesto, profit split y 20+ criterios',
    verifiedData: 'Datos Verificados',
    verifiedDataDesc: 'Todos los datos verificados directamente de los sitios web',
    realReviews: 'Resenas Reales',
    realReviewsDesc: 'Valoraciones de Trustpilot y experiencias reales de traders',
    exclusiveDeals: 'Ofertas Exclusivas',
    exclusiveDealsDesc: 'Ahorra hasta 55% con nuestros codigos de descuento exclusivos',
    blogTitle: 'Ultimas del Blog',
    blogSubtitle: 'Consejos y estrategias para ser financiado',
    viewAll: 'Ver Todo',
    readMore: 'Leer mas',
    guide: 'Guia',
    rules: 'Reglas',
    howToChoose: 'Como Elegir la Prop Firm Correcta',
    newsTradingRules: 'Reglas de Trading en Noticias Explicadas',
    howToPass: 'Como Pasar tu Challenge de Prop Firm',
    finalCtaTitle: 'Listo para Ser Financiado?',
    finalCtaSubtitle: 'Deja de adivinar. Compara todas las prop firms en un solo lugar.',
    startComparing: 'Empezar a Comparar',
    downloadGuide: 'Descargar Guia Gratis',
    quizTitle: '¿Aun indeciso? Te ayudamos.',
    quizSubtitle: 'Responde 4 preguntas rapidas y obtén tus 3 mejores matches de prop firms.',
    quizCta: 'Encontrar mi Prop Firm',
  },
  pt: {
    badge: 'Atualizado janeiro 2026',
    heroTitle1: 'Compare Prop Firms.',
    heroTitle2: 'Acompanhe seu Challenge.',
    heroDescription: 'Compare prop firms verificadas lado a lado. Filtre por regras, taxas e divisao de lucros. Acompanhe seu drawdown com nosso',
    smartDashboard: 'painel inteligente',
    ctaCompare: 'Comparar Todas as Firms',
    ctaTrack: 'Acompanhar Meu Challenge',
    topFirmsTitle: 'Prop Firms Mais Bem Avaliadas',
    topFirmsSubtitle: 'Baseado em avaliacoes verificadas, regras e feedback de traders',
    fromPrice: 'A partir de',
    profitSplit: 'Split',
    viewDetails: 'Ver Detalhes',
    useCode: 'Codigo',
    viewAllFirms: 'Ver Todas as 80+ Firms',
    tradingStylesTitle: 'Encontre Firms por Estilo de Trading',
    tradingStylesSubtitle: 'Acesso rapido a firms que combinam com suas necessidades',
    scalping: 'Scalping',
    beginners: 'Iniciantes',
    cheapest: 'Mais Barato',
    highSplit: 'Alto Split',
    instant: 'Instantaneo',
    eaBots: 'EA/Bots',
    comparisonsTitle: 'Comparacoes Populares',
    comparisonsSubtitle: 'Veja como as melhores firms se comparam',
    dashboardTitle: 'Nunca Mais Perca Sua Conta',
    dashboardSubtitle: 'Acompanhe todos os seus challenges em um so lugar com monitoramento em tempo real',
    dashboardFeature1: 'Rastreamento de drawdown em tempo real',
    dashboardFeature2: 'Suporte multi-conta',
    dashboardFeature3: 'Alertas inteligentes antes dos limites',
    dashboardCta: 'Comecar Gratis',
    dashboardMock: 'Painel de Challenge',
    dailyDrawdown: 'Drawdown Diario',
    maxDrawdown: 'Drawdown Maximo',
    remaining: 'restante',
    allClear: 'Tudo certo! Opere com confianca.',
    whyUsTitle: 'Por Que Traders Nos Escolhem',
    whyUsSubtitle: 'Tudo que voce precisa para tomar a decisao certa',
    smartFilters: 'Filtros Inteligentes',
    smartFiltersDesc: 'Filtre por estilo de trading, orcamento, profit split e 20+ criterios',
    verifiedData: 'Dados Verificados',
    verifiedDataDesc: 'Todos os dados verificados diretamente dos sites',
    realReviews: 'Avaliacoes Reais',
    realReviewsDesc: 'Avaliacoes do Trustpilot e experiencias reais de traders',
    exclusiveDeals: 'Ofertas Exclusivas',
    exclusiveDealsDesc: 'Economize ate 55% com nossos codigos de desconto exclusivos',
    blogTitle: 'Ultimas do Blog',
    blogSubtitle: 'Dicas e estrategias para ser financiado',
    viewAll: 'Ver Tudo',
    readMore: 'Leia mais',
    guide: 'Guia',
    rules: 'Regras',
    howToChoose: 'Como Escolher a Prop Firm Certa',
    newsTradingRules: 'Regras de Trading em Noticias Explicadas',
    howToPass: 'Como Passar seu Challenge de Prop Firm',
    finalCtaTitle: 'Pronto para Ser Financiado?',
    finalCtaSubtitle: 'Pare de adivinhar. Compare todas as prop firms em um so lugar.',
    startComparing: 'Comecar a Comparar',
    downloadGuide: 'Baixar Guia Gratis',
    quizTitle: 'Ainda indeciso? Podemos ajudar.',
    quizSubtitle: 'Responda 4 perguntas rapidas e obtenha seus 3 melhores matches de prop firms.',
    quizCta: 'Encontrar minha Prop Firm',
  },
  ar: {
    badge: 'محدث يناير 2026',
    heroTitle1: 'قارن شركات Prop.',
    heroTitle2: 'تتبع تحديك.',
    heroDescription: 'قارن شركات Prop المعتمدة جنبا الى جنب. فلتر حسب القواعد والرسوم وتقسيم الارباح. تتبع السحب مع',
    smartDashboard: 'لوحة التحكم الذكية',
    ctaCompare: 'مقارنة جميع الشركات',
    ctaTrack: 'تتبع تحديي',
    topFirmsTitle: 'افضل شركات Prop تقييما',
    topFirmsSubtitle: 'بناء على التقييمات الموثقة والقواعد وتعليقات المتداولين',
    fromPrice: 'من',
    profitSplit: 'تقسيم',
    viewDetails: 'عرض التفاصيل',
    useCode: 'كود',
    viewAllFirms: 'عرض جميع الشركات 80+',
    tradingStylesTitle: 'ابحث عن شركات حسب اسلوب التداول',
    tradingStylesSubtitle: 'وصول سريع للشركات التي تناسب احتياجاتك',
    scalping: 'سكالبينج',
    beginners: 'مبتدئين',
    cheapest: 'ارخص',
    highSplit: 'تقسيم عالي',
    instant: 'فوري',
    eaBots: 'EA/روبوتات',
    comparisonsTitle: 'مقارنات شائعة',
    comparisonsSubtitle: 'شاهد كيف تتقارن افضل الشركات',
    dashboardTitle: 'لا تخسر حسابك مرة اخرى',
    dashboardSubtitle: 'تتبع جميع تحدياتك في مكان واحد مع مراقبة في الوقت الفعلي',
    dashboardFeature1: 'تتبع السحب في الوقت الفعلي',
    dashboardFeature2: 'دعم حسابات متعددة',
    dashboardFeature3: 'تنبيهات ذكية قبل الحدود',
    dashboardCta: 'ابدا مجانا',
    dashboardMock: 'لوحة تحكم التحدي',
    dailyDrawdown: 'السحب اليومي',
    maxDrawdown: 'الحد الاقصى للسحب',
    remaining: 'متبقي',
    allClear: 'كل شيء على ما يرام! تداول بثقة.',
    whyUsTitle: 'لماذا يختارنا المتداولون',
    whyUsSubtitle: 'كل ما تحتاجه لاتخاذ القرار الصحيح',
    smartFilters: 'فلاتر ذكية',
    smartFiltersDesc: 'فلتر حسب اسلوب التداول والميزانية وتقسيم الربح و20+ معيار',
    verifiedData: 'بيانات موثقة',
    verifiedDataDesc: 'جميع البيانات موثقة مباشرة من مواقع الشركات',
    realReviews: 'تقييمات حقيقية',
    realReviewsDesc: 'تقييمات Trustpilot وتجارب حقيقية للمتداولين',
    exclusiveDeals: 'عروض حصرية',
    exclusiveDealsDesc: 'وفر حتى 55% مع اكواد الخصم الحصرية',
    blogTitle: 'اخر المقالات',
    blogSubtitle: 'نصائح واستراتيجيات للحصول على التمويل',
    viewAll: 'عرض الكل',
    readMore: 'اقرا المزيد',
    guide: 'دليل',
    rules: 'قواعد',
    howToChoose: 'كيف تختار شركة Prop المناسبة',
    newsTradingRules: 'قواعد التداول على الاخبار',
    howToPass: 'كيف تجتاز تحدي Prop Firm',
    finalCtaTitle: 'مستعد للتمويل؟',
    finalCtaSubtitle: 'توقف عن التخمين. قارن جميع شركات Prop في مكان واحد.',
    startComparing: 'ابدا المقارنة',
    downloadGuide: 'تحميل الدليل المجاني',
    quizTitle: 'لا تزال غير متاكد؟ نستطيع المساعدة.',
    quizSubtitle: 'اجب على 4 اسئلة سريعة واحصل على افضل 3 شركات Prop تناسبك.',
    quizCta: 'ابحث عن شركتي المثالية',
  },
  hi: {
    badge: 'जनवरी 2026 अपडेट',
    heroTitle1: 'Prop Firms की तुलना करें।',
    heroTitle2: 'अपना Challenge ट्रैक करें।',
    heroDescription: 'सत्यापित prop trading firms की साथ-साथ तुलना करें। नियमों, शुल्क और profit split के अनुसार फ़िल्टर करें। हमारे साथ अपना drawdown ट्रैक करें',
    smartDashboard: 'स्मार्ट डैशबोर्ड',
    ctaCompare: 'सभी Firms की तुलना',
    ctaTrack: 'मेरा Challenge ट्रैक करें',
    topFirmsTitle: 'टॉप रेटेड Prop Firms',
    topFirmsSubtitle: 'सत्यापित समीक्षाओं, नियमों और ट्रेडर फीडबैक पर आधारित',
    fromPrice: 'से',
    profitSplit: 'स्प्लिट',
    viewDetails: 'विवरण देखें',
    useCode: 'कोड',
    viewAllFirms: 'सभी 80+ Firms देखें',
    tradingStylesTitle: 'Trading Style से Firms खोजें',
    tradingStylesSubtitle: 'आपकी जरूरतों के अनुसार firms तक त्वरित पहुंच',
    scalping: 'स्कैल्पिंग',
    beginners: 'शुरुआती',
    cheapest: 'सबसे सस्ता',
    highSplit: 'हाई स्प्लिट',
    instant: 'तुरंत',
    eaBots: 'EA/बॉट्स',
    comparisonsTitle: 'लोकप्रिय तुलनाएं',
    comparisonsSubtitle: 'देखें कि टॉप firms कैसे तुलना करती हैं',
    dashboardTitle: 'फिर कभी अपना अकाउंट न खोएं',
    dashboardSubtitle: 'रियल-टाइम drawdown मॉनिटरिंग के साथ एक जगह सभी challenges ट्रैक करें',
    dashboardFeature1: 'रियल-टाइम drawdown ट्रैकिंग',
    dashboardFeature2: 'मल्टी-अकाउंट सपोर्ट',
    dashboardFeature3: 'लिमिट से पहले स्मार्ट अलर्ट',
    dashboardCta: 'मुफ्त शुरू करें',
    dashboardMock: 'Challenge डैशबोर्ड',
    dailyDrawdown: 'दैनिक Drawdown',
    maxDrawdown: 'अधिकतम Drawdown',
    remaining: 'बाकी',
    allClear: 'सब ठीक है! विश्वास से ट्रेड करें।',
    whyUsTitle: 'Traders हमें क्यों चुनते हैं',
    whyUsSubtitle: 'सही निर्णय लेने के लिए आपको जो कुछ भी चाहिए',
    smartFilters: 'स्मार्ट फ़िल्टर',
    smartFiltersDesc: 'Trading style, बजट, profit split और 20+ मानदंडों से फ़िल्टर करें',
    verifiedData: 'सत्यापित डेटा',
    verifiedDataDesc: 'सभी डेटा सीधे prop firm वेबसाइटों से सत्यापित',
    realReviews: 'असली समीक्षाएं',
    realReviewsDesc: 'Trustpilot रेटिंग और वास्तविक ट्रेडर अनुभव',
    exclusiveDeals: 'विशेष ऑफ़र',
    exclusiveDealsDesc: 'हमारे विशेष छूट कोड के साथ 55% तक बचाएं',
    blogTitle: 'ब्लॉग से नवीनतम',
    blogSubtitle: 'फंडेड होने के लिए टिप्स और रणनीतियां',
    viewAll: 'सभी देखें',
    readMore: 'और पढ़ें',
    guide: 'गाइड',
    rules: 'नियम',
    howToChoose: 'सही Prop Firm कैसे चुनें',
    newsTradingRules: 'News Trading नियम समझाए गए',
    howToPass: 'अपना Prop Firm Challenge कैसे पास करें',
    finalCtaTitle: 'फंडेड होने के लिए तैयार?',
    finalCtaSubtitle: 'अनुमान लगाना बंद करें। सभी prop firms को एक जगह तुलना करें।',
    startComparing: 'तुलना शुरू करें',
    downloadGuide: 'मुफ्त गाइड डाउनलोड करें',
    quizTitle: 'अभी भी अनिश्चित? हम मदद कर सकते हैं।',
    quizSubtitle: '4 त्वरित प्रश्नों के उत्तर दें और अपनी व्यक्तिगत टॉप 3 prop firm matches पाएं।',
    quizCta: 'मेरी परफेक्ट Prop Firm खोजें',
  },
};

// =============================================================================
// DATA
// =============================================================================

const TOP_FIRMS = [
  {
    rank: 1,
    name: 'Top One Futures',
    slug: 'top-one-futures',
    rating: 4.8,
    reviews: '2.7K+',
    logoUrl: '/logos/top-one-futures.svg',
    logoFallback: 'T1F',
    color: 'from-amber-500 to-orange-600',
    startingPrice: '$34',
    profitSplit: '90%',
    promo: { code: 'pfs', discount: '55% OFF' },
    tags: ['Futures', 'Fast Payouts'],
    affiliate: 'https://toponefutures.com/?ref=propfirmscanner',
  },
  {
    rank: 2,
    name: 'Earn2Trade',
    slug: 'earn2trade',
    rating: 4.7,
    reviews: '4.3K+',
    logoUrl: null,
    logoFallback: 'E2T',
    color: 'from-blue-500 to-cyan-500',
    startingPrice: '$150',
    profitSplit: '80%',
    promo: { code: 'scanner-40', discount: '50% OFF' },
    tags: ['Futures', 'Education'],
    affiliate: 'https://earn2trade.com/?ref=propfirmscanner',
  },
  {
    rank: 3,
    name: 'The5ers',
    slug: 'the5ers',
    rating: 4.8,
    reviews: '19K+',
    logoUrl: null,
    logoFallback: '5ers',
    color: 'from-emerald-500 to-teal-500',
    startingPrice: '$95',
    profitSplit: '100%',
    promo: { code: null, discount: '5% OFF' },
    tags: ['Forex', 'Scaling'],
    affiliate: 'https://the5ers.com/?ref=propfirmscanner',
  },
  {
    rank: 4,
    name: 'ForFX',
    slug: 'forfx',
    rating: 4.2,
    reviews: '114',
    logoUrl: '/logos/forfx.svg',
    logoFallback: 'FFX',
    color: 'from-violet-500 to-purple-600',
    startingPrice: '$99',
    profitSplit: '80%',
    promo: { code: 'scanner', discount: '10% OFF' },
    tags: ['Forex', 'New'],
    affiliate: 'https://forfx.com/?ref=propfirmscanner',
  },
  {
    rank: 5,
    name: 'FTMO',
    slug: 'ftmo',
    rating: 4.8,
    reviews: '34K+',
    logoUrl: null,
    logoFallback: 'FTMO',
    color: 'from-indigo-500 to-blue-600',
    startingPrice: '$155',
    profitSplit: '90%',
    promo: null,
    tags: ['Forex', 'Industry Leader'],
    affiliate: null,
  },
  {
    rank: 6,
    name: 'FundedNext',
    slug: 'fundednext',
    rating: 4.5,
    reviews: '53K+',
    logoUrl: null,
    logoFallback: 'FN',
    color: 'from-sky-500 to-blue-500',
    startingPrice: '$32',
    profitSplit: '95%',
    promo: null,
    tags: ['Forex', 'Cheapest'],
    affiliate: null,
  },
];

const COMPARISONS = [
  { firms: 'FTMO vs FundedNext', slug: 'ftmo-vs-fundednext' },
  { firms: 'FTMO vs The5ers', slug: 'ftmo-vs-the5ers' },
  { firms: 'FTMO vs MyFundedFX', slug: 'ftmo-vs-myfundedfx' },
  { firms: 'FundedNext vs The5ers', slug: 'fundednext-vs-the5ers' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function HomeContent() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const t = translations[currentLocale] || translations.en;

  const TRADING_STYLES = [
    { name: t.scalping, icon: '⚡', href: '/best-for/scalping' },
    { name: t.beginners, icon: '🎯', href: '/best-for/beginners' },
    { name: t.cheapest, icon: '💰', href: '/best-for/cheapest' },
    { name: t.highSplit, icon: '📈', href: '/best-for/highest-profit-split' },
    { name: t.instant, icon: '🚀', href: '/best-for/instant-funding' },
    { name: t.eaBots, icon: '🤖', href: '/best-for/ea-friendly' },
  ];

  const BLOG_POSTS = [
    { title: t.howToChoose, category: t.guide, slug: 'how-to-choose-right-prop-firm' },
    { title: t.newsTradingRules, category: t.rules, slug: 'news-trading-rules-explained' },
    { title: t.howToPass, category: t.guide, slug: 'how-to-pass-your-prop-firm-challenge' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {t.badge}
            </span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white leading-tight mb-6">
            {t.heroTitle1}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {t.heroTitle2}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mx-auto mb-8">
            {t.heroDescription} <span className="text-white font-medium">{t.smartDashboard}</span>.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/compare"
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <BarChart3 className="w-5 h-5" />
              {t.ctaCompare}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all"
            >
              <Target className="w-5 h-5" />
              {t.ctaTrack}
            </Link>
          </div>
        </div>
      </section>

      {/* ========== QUIZ CTA — RIGHT AFTER HERO ========== */}
      <section className="px-4 pb-10 -mt-2">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-gray-900 to-emerald-950 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
            {/* Animated glow orbs */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-7">
              {/* Left */}
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold text-lg leading-tight">{t.quizTitle}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wide border border-emerald-500/30">Free</span>
                  </div>
                  <p className="text-gray-400 text-sm max-w-md">{t.quizSubtitle}</p>
                </div>
              </div>

              {/* Right — stats + CTA */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-5 text-center">
                  <div>
                    <p className="text-xl font-bold text-white">36</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">firms</p>
                  </div>
                  <div className="w-px h-8 bg-gray-700" />
                  <div>
                    <p className="text-xl font-bold text-white">4</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">questions</p>
                  </div>
                  <div className="w-px h-8 bg-gray-700" />
                  <div>
                    <p className="text-xl font-bold text-emerald-400">60s</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">to match</p>
                  </div>
                </div>
                <Link
                  href="/en/quiz"
                  className="relative inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 rounded-full animate-ping opacity-75" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full" />
                  {t.quizCta} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TOP FIRMS SECTION ========== */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">🏆</span>
              {t.topFirmsTitle}
            </h2>
            <p className="text-gray-500">{t.topFirmsSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_FIRMS.map((firm) => (
              <div
                key={firm.slug}
                className="relative group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all"
              >
                {/* Rank badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">#{firm.rank}</span>
                </div>
                
                {/* Promo badge */}
                {firm.promo && (
                  <div className="absolute -top-2 right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {firm.promo.discount}
                  </div>
                )}
                
                {/* Firm info */}
                <div className="flex items-center gap-4 mb-4 mt-2">
                  <FirmLogoSimple logoUrl={firm.logoUrl} logoFallback={firm.logoFallback} color={firm.color} />
                  <div>
                    <h3 className="text-white font-semibold">{firm.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-white">{firm.rating}</span>
                      </div>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500">{firm.reviews} reviews</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-2.5 text-center">
                    <div className="text-gray-500 text-xs mb-0.5">{t.fromPrice}</div>
                    <div className="text-white font-semibold">{firm.startingPrice}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2.5 text-center">
                    <div className="text-gray-500 text-xs mb-0.5">{t.profitSplit}</div>
                    <div className="text-emerald-400 font-semibold">{firm.profitSplit}</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/prop-firm/${firm.slug}`}
                    className="flex-1 py-2 text-center text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {t.viewDetails}
                  </Link>
                  {firm.affiliate && (
                    <a
                      href={firm.affiliate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      {firm.promo?.code && <span>{t.useCode} {firm.promo.code}</span>}
                      {!firm.promo?.code && <ExternalLink className="w-3.5 h-3.5" />}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* View all button */}
          <div className="text-center mt-8">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {t.viewAllFirms}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== DASHBOARD PREVIEW ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t.dashboardTitle}
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                {t.dashboardSubtitle}
              </p>
              
              <ul className="space-y-4 mb-8">
                {[t.dashboardFeature1, t.dashboardFeature2, t.dashboardFeature3].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
              >
                {t.dashboardCta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Right: Mock Dashboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">{t.dashboardMock}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <div className="text-emerald-400 font-bold">Safe</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{t.dailyDrawdown}</span>
                      <span className="text-emerald-400">$3,750 {t.remaining}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{t.maxDrawdown}</span>
                      <span className="text-emerald-400">$8,750 {t.remaining}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-cyan-500 rounded-full" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm font-medium">{t.allClear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FIND BY TRADING STYLE ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t.tradingStylesTitle}
            </h2>
            <p className="text-gray-500">{t.tradingStylesSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRADING_STYLES.map((style) => (
              <Link
                key={style.name}
                href={style.href}
                className="group flex flex-col items-center gap-3 p-5 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl transition-all"
              >
                <span className="text-3xl">{style.icon}</span>
                <span className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
                  {style.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POPULAR COMPARISONS ========== */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2">
              <span className="text-2xl">⚔️</span>
              {t.comparisonsTitle}
            </h2>
            <p className="text-gray-500">{t.comparisonsSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPARISONS.map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/30 rounded-xl transition-all"
              >
                <span className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                  {comparison.firms}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY TRADERS CHOOSE US ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t.whyUsTitle}
            </h2>
            <p className="text-gray-500">{t.whyUsSubtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, title: t.smartFilters, description: t.smartFiltersDesc },
              { icon: Shield, title: t.verifiedData, description: t.verifiedDataDesc },
              { icon: Star, title: t.realReviews, description: t.realReviewsDesc },
              { icon: Gift, title: t.exclusiveDeals, description: t.exclusiveDealsDesc },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LATEST FROM BLOG ========== */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">📚</span>
                {t.blogTitle}
              </h2>
              <p className="text-gray-500 mt-1">{t.blogSubtitle}</p>
            </div>
            <Link 
              href="/blog" 
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              {t.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all"
              >
                <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded mb-3">
                  {post.category}
                </span>
                <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors mb-2">
                  {post.title}
                </h3>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  {t.readMore} <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.finalCtaTitle}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {t.finalCtaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/compare"
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition-all"
            >
              {t.startComparing}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/guide"
              className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all"
            >
              <Award className="w-5 h-5" />
              {t.downloadGuide}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
