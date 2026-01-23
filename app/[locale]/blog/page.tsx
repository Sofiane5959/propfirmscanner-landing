'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Clock, ArrowRight, Search, Star, BookOpen, 
  Shield, Brain, TrendingUp, Filter, User,
  Calendar, ChevronRight, Mail, Sparkles, Home
} from 'lucide-react';

// =============================================================================
// LOCALE DETECTION & TRANSLATIONS
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

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Header
    blogTitle: 'Prop Firm',
    blogTitleHighlight: 'Blog',
    blogSubtitle: 'Expert guides, rule explanations, and strategies to help you get funded.',
    searchPlaceholder: 'Search articles...',
    // Breadcrumb
    home: 'Home',
    blog: 'Blog',
    // Categories
    all: 'All',
    guides: 'Guides',
    rulesDecoded: 'Rules Decoded',
    reviews: 'Reviews',
    psychology: 'Psychology',
    // Sections
    featuredArticles: 'Featured Articles',
    latestArticles: 'Latest Articles',
    searchResults: 'Search Results',
    // Empty state
    noArticlesFound: 'No articles found',
    tryDifferentSearch: 'Try a different search term or category',
    // Pagination
    previous: 'Previous',
    next: 'Next',
    // Sidebar
    newsletter: 'Newsletter',
    newsletterDesc: 'Get weekly prop firm tips, deals, and strategy insights.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    subscribed: 'Subscribed!',
    popularArticles: 'Popular Articles',
    popularTags: 'Popular Tags',
    // CTA
    readyToGetFunded: 'Ready to Get Funded?',
    compareDesc: 'Compare 70+ prop firms and find your perfect match.',
    comparePropFirms: 'Compare Prop Firms',
    // Card
    minRead: 'min read',
    readMore: 'Read More',
  },
  fr: {
    blogTitle: 'Blog',
    blogTitleHighlight: 'Prop Firm',
    blogSubtitle: 'Guides experts, explications des règles et stratégies pour vous aider à être financé.',
    searchPlaceholder: 'Rechercher des articles...',
    home: 'Accueil',
    blog: 'Blog',
    all: 'Tout',
    guides: 'Guides',
    rulesDecoded: 'Règles Décryptées',
    reviews: 'Avis',
    psychology: 'Psychologie',
    featuredArticles: 'Articles en Vedette',
    latestArticles: 'Derniers Articles',
    searchResults: 'Résultats de Recherche',
    noArticlesFound: 'Aucun article trouvé',
    tryDifferentSearch: 'Essayez un autre terme de recherche ou une autre catégorie',
    previous: 'Précédent',
    next: 'Suivant',
    newsletter: 'Newsletter',
    newsletterDesc: 'Recevez des conseils hebdomadaires sur les prop firms, offres et stratégies.',
    emailPlaceholder: 'Entrez votre email',
    subscribe: 'S\'abonner',
    subscribing: 'Inscription...',
    subscribed: 'Inscrit !',
    popularArticles: 'Articles Populaires',
    popularTags: 'Tags Populaires',
    readyToGetFunded: 'Prêt à Être Financé ?',
    compareDesc: 'Comparez 70+ prop firms et trouvez votre match parfait.',
    comparePropFirms: 'Comparer les Prop Firms',
    minRead: 'min de lecture',
    readMore: 'Lire Plus',
  },
  de: {
    blogTitle: 'Prop Firm',
    blogTitleHighlight: 'Blog',
    blogSubtitle: 'Experten-Guides, Regelerklärungen und Strategien, um finanziert zu werden.',
    searchPlaceholder: 'Artikel suchen...',
    home: 'Startseite',
    blog: 'Blog',
    all: 'Alle',
    guides: 'Guides',
    rulesDecoded: 'Regeln Erklärt',
    reviews: 'Bewertungen',
    psychology: 'Psychologie',
    featuredArticles: 'Empfohlene Artikel',
    latestArticles: 'Neueste Artikel',
    searchResults: 'Suchergebnisse',
    noArticlesFound: 'Keine Artikel gefunden',
    tryDifferentSearch: 'Versuchen Sie einen anderen Suchbegriff oder Kategorie',
    previous: 'Zurück',
    next: 'Weiter',
    newsletter: 'Newsletter',
    newsletterDesc: 'Erhalten Sie wöchentlich Prop-Firm-Tipps, Angebote und Strategien.',
    emailPlaceholder: 'E-Mail eingeben',
    subscribe: 'Abonnieren',
    subscribing: 'Wird abonniert...',
    subscribed: 'Abonniert!',
    popularArticles: 'Beliebte Artikel',
    popularTags: 'Beliebte Tags',
    readyToGetFunded: 'Bereit für Finanzierung?',
    compareDesc: 'Vergleichen Sie 70+ Prop Firms und finden Sie Ihren perfekten Match.',
    comparePropFirms: 'Prop Firms Vergleichen',
    minRead: 'Min. Lesezeit',
    readMore: 'Mehr Lesen',
  },
  es: {
    blogTitle: 'Blog',
    blogTitleHighlight: 'Prop Firm',
    blogSubtitle: 'Guías expertas, explicaciones de reglas y estrategias para ayudarte a ser financiado.',
    searchPlaceholder: 'Buscar artículos...',
    home: 'Inicio',
    blog: 'Blog',
    all: 'Todo',
    guides: 'Guías',
    rulesDecoded: 'Reglas Decodificadas',
    reviews: 'Reseñas',
    psychology: 'Psicología',
    featuredArticles: 'Artículos Destacados',
    latestArticles: 'Últimos Artículos',
    searchResults: 'Resultados de Búsqueda',
    noArticlesFound: 'No se encontraron artículos',
    tryDifferentSearch: 'Intenta con otro término de búsqueda o categoría',
    previous: 'Anterior',
    next: 'Siguiente',
    newsletter: 'Newsletter',
    newsletterDesc: 'Recibe consejos semanales sobre prop firms, ofertas y estrategias.',
    emailPlaceholder: 'Ingresa tu email',
    subscribe: 'Suscribirse',
    subscribing: 'Suscribiendo...',
    subscribed: '¡Suscrito!',
    popularArticles: 'Artículos Populares',
    popularTags: 'Tags Populares',
    readyToGetFunded: '¿Listo para ser Financiado?',
    compareDesc: 'Compara 70+ prop firms y encuentra tu match perfecto.',
    comparePropFirms: 'Comparar Prop Firms',
    minRead: 'min de lectura',
    readMore: 'Leer Más',
  },
  pt: {
    blogTitle: 'Blog',
    blogTitleHighlight: 'Prop Firm',
    blogSubtitle: 'Guias especializados, explicações de regras e estratégias para ajudá-lo a ser financiado.',
    searchPlaceholder: 'Pesquisar artigos...',
    home: 'Início',
    blog: 'Blog',
    all: 'Todos',
    guides: 'Guias',
    rulesDecoded: 'Regras Decodificadas',
    reviews: 'Avaliações',
    psychology: 'Psicologia',
    featuredArticles: 'Artigos em Destaque',
    latestArticles: 'Últimos Artigos',
    searchResults: 'Resultados da Pesquisa',
    noArticlesFound: 'Nenhum artigo encontrado',
    tryDifferentSearch: 'Tente um termo de pesquisa ou categoria diferente',
    previous: 'Anterior',
    next: 'Próximo',
    newsletter: 'Newsletter',
    newsletterDesc: 'Receba dicas semanais sobre prop firms, ofertas e estratégias.',
    emailPlaceholder: 'Digite seu email',
    subscribe: 'Inscrever-se',
    subscribing: 'Inscrevendo...',
    subscribed: 'Inscrito!',
    popularArticles: 'Artigos Populares',
    popularTags: 'Tags Populares',
    readyToGetFunded: 'Pronto para ser Financiado?',
    compareDesc: 'Compare 70+ prop firms e encontre seu match perfeito.',
    comparePropFirms: 'Comparar Prop Firms',
    minRead: 'min de leitura',
    readMore: 'Ler Mais',
  },
  ar: {
    blogTitle: 'مدونة',
    blogTitleHighlight: 'شركات التداول',
    blogSubtitle: 'أدلة خبراء وشرح القواعد واستراتيجيات لمساعدتك في الحصول على التمويل.',
    searchPlaceholder: 'البحث في المقالات...',
    home: 'الرئيسية',
    blog: 'المدونة',
    all: 'الكل',
    guides: 'الأدلة',
    rulesDecoded: 'القواعد مفسرة',
    reviews: 'المراجعات',
    psychology: 'علم النفس',
    featuredArticles: 'مقالات مميزة',
    latestArticles: 'أحدث المقالات',
    searchResults: 'نتائج البحث',
    noArticlesFound: 'لم يتم العثور على مقالات',
    tryDifferentSearch: 'جرب مصطلح بحث أو فئة مختلفة',
    previous: 'السابق',
    next: 'التالي',
    newsletter: 'النشرة الإخبارية',
    newsletterDesc: 'احصل على نصائح أسبوعية حول شركات التداول والعروض والاستراتيجيات.',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    subscribe: 'اشترك',
    subscribing: 'جاري الاشتراك...',
    subscribed: 'تم الاشتراك!',
    popularArticles: 'المقالات الشائعة',
    popularTags: 'العلامات الشائعة',
    readyToGetFunded: 'هل أنت مستعد للتمويل؟',
    compareDesc: 'قارن أكثر من 70 شركة تداول وابحث عن الأنسب لك.',
    comparePropFirms: 'مقارنة شركات التداول',
    minRead: 'دقيقة قراءة',
    readMore: 'اقرأ المزيد',
  },
  hi: {
    blogTitle: 'प्रॉप फर्म',
    blogTitleHighlight: 'ब्लॉग',
    blogSubtitle: 'विशेषज्ञ गाइड्स, नियम स्पष्टीकरण और फंडेड होने में मदद के लिए रणनीतियां।',
    searchPlaceholder: 'आर्टिकल्स खोजें...',
    home: 'होम',
    blog: 'ब्लॉग',
    all: 'सभी',
    guides: 'गाइड्स',
    rulesDecoded: 'नियम समझाए गए',
    reviews: 'रिव्यूज',
    psychology: 'मनोविज्ञान',
    featuredArticles: 'फीचर्ड आर्टिकल्स',
    latestArticles: 'नवीनतम आर्टिकल्स',
    searchResults: 'खोज परिणाम',
    noArticlesFound: 'कोई आर्टिकल नहीं मिला',
    tryDifferentSearch: 'कोई अलग सर्च टर्म या कैटेगरी आज़माएं',
    previous: 'पिछला',
    next: 'अगला',
    newsletter: 'न्यूज़लेटर',
    newsletterDesc: 'साप्ताहिक प्रॉप फर्म टिप्स, डील्स और स्ट्रैटेजी इनसाइट्स पाएं।',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    subscribe: 'सब्सक्राइब करें',
    subscribing: 'सब्सक्राइब हो रहा है...',
    subscribed: 'सब्सक्राइब्ड!',
    popularArticles: 'लोकप्रिय आर्टिकल्स',
    popularTags: 'लोकप्रिय टैग्स',
    readyToGetFunded: 'फंडेड होने के लिए तैयार?',
    compareDesc: '70+ प्रॉप फर्म्स की तुलना करें और अपना परफेक्ट मैच खोजें।',
    comparePropFirms: 'प्रॉप फर्म्स की तुलना करें',
    minRead: 'मिनट पढ़ें',
    readMore: 'और पढ़ें',
  },
};

// =============================================================================
// TYPES
// =============================================================================

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  readTime: string;
  category: 'Guides' | 'Rules Decoded' | 'Reviews' | 'Psychology';
  featured: boolean;
  tags: string[];
}

// =============================================================================
// CATEGORY STYLING
// =============================================================================

const CATEGORY_COLORS: Record<string, { bg: string; gradient: string; accent: string }> = {
  'Guides': { 
    bg: 'bg-emerald-500/20', 
    gradient: 'from-emerald-600/40 via-emerald-500/30 to-teal-500/40',
    accent: 'emerald'
  },
  'Rules Decoded': { 
    bg: 'bg-blue-500/20', 
    gradient: 'from-blue-600/40 via-blue-500/30 to-indigo-500/40',
    accent: 'blue'
  },
  'Reviews': { 
    bg: 'bg-purple-500/20', 
    gradient: 'from-purple-600/40 via-purple-500/30 to-pink-500/40',
    accent: 'purple'
  },
  'Psychology': { 
    bg: 'bg-orange-500/20', 
    gradient: 'from-orange-600/40 via-orange-500/30 to-amber-500/40',
    accent: 'orange'
  },
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  'Guides': BookOpen,
  'Rules Decoded': Shield,
  'Reviews': TrendingUp,
  'Psychology': Brain,
};

// =============================================================================
// BLOG DATA - Full 20 articles
// =============================================================================

const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-choose-right-prop-firm',
    title: 'How to Choose the Right Prop Firm for Your Trading Style',
    description: 'With 50+ prop firms available, how do you pick the right one? This guide breaks down key factors based on your trading style and budget.',
    date: 'January 5, 2025',
    updatedDate: 'January 2025',
    readTime: '10 min read',
    category: 'Guides',
    featured: true,
    tags: ['beginner', 'comparison', 'strategy'],
  },
  {
    slug: 'how-to-pass-prop-firm-challenge',
    title: 'How to Pass Your Prop Firm Challenge: 10 Proven Strategies',
    description: 'Learn the exact strategies successful traders use to pass prop firm challenges. From risk management to psychology.',
    date: 'January 3, 2025',
    updatedDate: 'January 2025',
    readTime: '12 min read',
    category: 'Guides',
    featured: true,
    tags: ['strategy', 'challenge', 'tips'],
  },
  {
    slug: 'best-prop-firms-2025',
    title: 'Best Prop Firms 2025: Complete Ranking & Comparison',
    description: 'Our comprehensive ranking of the best prop trading firms in 2025. Compare fees, profit splits, rules, and find the perfect firm.',
    date: 'January 1, 2025',
    updatedDate: 'January 2025',
    readTime: '15 min read',
    category: 'Reviews',
    featured: true,
    tags: ['ranking', '2025', 'comparison'],
  },
  {
    slug: 'news-trading-rules-explained',
    title: 'News Trading Rules Explained: What Prop Firms Actually Allow',
    description: 'Confused about news trading rules? Learn which prop firms allow it, which restrict it, and how to trade news without breaking rules.',
    date: 'December 28, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['news trading', 'rules', 'restrictions'],
  },
  {
    slug: 'consistency-rules-explained',
    title: 'Consistency Rules Explained: The Hidden Rule That Fails Traders',
    description: 'Consistency rules are the most misunderstood requirement. Learn what they are, which firms have them, and how to pass.',
    date: 'December 25, 2024',
    readTime: '7 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['consistency', 'rules', 'challenge'],
  },
  {
    slug: 'trailing-drawdown-explained',
    title: "Trailing Drawdown Explained: Don't Let This Rule Catch You",
    description: 'Trailing drawdown has ended more challenges than any other rule. Learn how it works and strategies to manage it.',
    date: 'December 22, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['drawdown', 'risk management', 'rules'],
  },
  {
    slug: 'prop-firm-payout-guide',
    title: 'Prop Firm Payouts: How to Get Paid Fast',
    description: 'Everything about prop firm payouts. Learn about schedules, methods, and how to ensure you get paid quickly.',
    date: 'December 20, 2024',
    readTime: '6 min read',
    category: 'Guides',
    featured: false,
    tags: ['payout', 'withdrawal', 'money'],
  },
  {
    slug: 'why-traders-fail-challenges',
    title: 'Why 90% of Traders Fail Prop Firm Challenges',
    description: 'Understand the real reasons most traders fail and learn strategies to join the successful 10%.',
    date: 'December 18, 2024',
    readTime: '9 min read',
    category: 'Psychology',
    featured: false,
    tags: ['psychology', 'mindset', 'failure'],
  },
  {
    slug: 'scaling-plans-explained',
    title: 'Prop Firm Scaling Plans: How to Grow Your Account',
    description: 'Learn how scaling plans work and strategies to maximize your funded account growth from $10K to $1M+.',
    date: 'December 15, 2024',
    readTime: '7 min read',
    category: 'Guides',
    featured: false,
    tags: ['scaling', 'growth', 'funded'],
  },
  {
    slug: 'ftmo-review-2025',
    title: 'FTMO Review 2025: Still the Best Prop Firm?',
    description: 'An in-depth review of FTMO covering their challenge, rules, payouts, and whether they deserve their reputation.',
    date: 'December 12, 2024',
    readTime: '11 min read',
    category: 'Reviews',
    featured: false,
    tags: ['FTMO', 'review', '2025'],
  },
  {
    slug: 'trading-psychology-tips',
    title: 'Trading Psychology: 7 Mental Habits of Funded Traders',
    description: 'Discover the psychological traits that separate funded traders from the rest. Practical tips to improve your mindset.',
    date: 'December 10, 2024',
    readTime: '10 min read',
    category: 'Psychology',
    featured: false,
    tags: ['psychology', 'mindset', 'habits'],
  },
  {
    slug: 'the5ers-review-2025',
    title: 'The5ers Review 2025: Best for Scaling?',
    description: 'Complete review of The5ers prop firm. Analyzing their unique scaling program, rules, and trader experience.',
    date: 'December 8, 2024',
    readTime: '10 min read',
    category: 'Reviews',
    featured: false,
    tags: ['The5ers', 'review', 'scaling'],
  },
  {
    slug: 'daily-drawdown-rules',
    title: 'Daily Drawdown Rules: The #1 Account Killer',
    description: 'Master daily drawdown rules before they end your challenge. Step-by-step guide to staying within limits.',
    date: 'December 5, 2024',
    readTime: '8 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['drawdown', 'daily limit', 'rules'],
  },
  {
    slug: 'best-prop-firms-for-beginners',
    title: 'Best Prop Firms for Beginners in 2025',
    description: 'Starting your prop firm journey? These firms offer the best conditions for new traders.',
    date: 'December 3, 2024',
    readTime: '9 min read',
    category: 'Guides',
    featured: false,
    tags: ['beginner', 'first challenge', 'tips'],
  },
  {
    slug: 'overtrading-psychology',
    title: 'Overtrading: The Silent Challenge Killer',
    description: 'Learn to recognize and overcome overtrading - the habit that fails more traders than bad strategy.',
    date: 'December 1, 2024',
    readTime: '7 min read',
    category: 'Psychology',
    featured: false,
    tags: ['overtrading', 'discipline', 'psychology'],
  },
  {
    slug: 'funded-next-review',
    title: 'FundedNext Review 2025: Worth the Hype?',
    description: 'Detailed analysis of FundedNext including their express model, profit splits, and real trader experiences.',
    date: 'November 28, 2024',
    readTime: '10 min read',
    category: 'Reviews',
    featured: false,
    tags: ['FundedNext', 'review', '2025'],
  },
  {
    slug: 'weekend-holding-rules',
    title: 'Weekend Holding Rules: Can You Hold Trades Over the Weekend?',
    description: 'Complete guide to weekend holding policies across major prop firms. Know the rules before you trade.',
    date: 'November 25, 2024',
    readTime: '6 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['weekend', 'holding', 'rules'],
  },
  {
    slug: 'revenge-trading',
    title: 'Revenge Trading: How to Stop Destroying Your Account',
    description: 'Revenge trading has blown more accounts than any strategy. Learn to recognize it and break the cycle.',
    date: 'November 22, 2024',
    readTime: '8 min read',
    category: 'Psychology',
    featured: false,
    tags: ['revenge trading', 'emotions', 'discipline'],
  },
  {
    slug: 'instant-funding-vs-challenge',
    title: 'Instant Funding vs Challenge: Which is Better?',
    description: 'Compare instant funding programs to traditional challenges. Pros, cons, and which suits your style.',
    date: 'November 20, 2024',
    readTime: '9 min read',
    category: 'Guides',
    featured: false,
    tags: ['instant funding', 'challenge', 'comparison'],
  },
  {
    slug: 'ea-bot-trading-rules',
    title: 'EA & Bot Trading Rules: Which Prop Firms Allow Automation?',
    description: 'Want to use EAs or trading bots? Here\'s which prop firms allow them and what restrictions apply.',
    date: 'November 18, 2024',
    readTime: '7 min read',
    category: 'Rules Decoded',
    featured: false,
    tags: ['EA', 'bots', 'automation', 'rules'],
  },
];

// =============================================================================
// HELPER: Get category translation key
// =============================================================================

function getCategoryKey(category: string): string {
  const map: Record<string, string> = {
    'All': 'all',
    'Guides': 'guides',
    'Rules Decoded': 'rulesDecoded',
    'Reviews': 'reviews',
    'Psychology': 'psychology',
  };
  return map[category] || category.toLowerCase();
}

// =============================================================================
// ANIMATION STYLES
// =============================================================================

const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
`;

// =============================================================================
// COMPONENTS
// =============================================================================

function Breadcrumb({ t, locale }: { t: Record<string, string>; locale: Locale }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link href={`/${locale}`} className="text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
        <Home className="w-4 h-4" />
        {t.home}
      </Link>
      <span className="text-gray-600">/</span>
      <span className="text-emerald-400">{t.blog}</span>
    </nav>
  );
}

function FeaturedCard({ post, locale, t }: { post: BlogPost; locale: Locale; t: Record<string, string> }) {
  const colors = CATEGORY_COLORS[post.category];
  const Icon = CATEGORY_ICONS[post.category];
  const categoryLabel = t[getCategoryKey(post.category)] || post.category;

  return (
    <Link 
      href={`/${locale}/blog/${post.slug}`}
      className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300"
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} rounded-full text-xs font-medium`}>
            <Icon className="w-3 h-3" />
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            Featured
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {post.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime.replace('min read', t.minRead)}
            </span>
          </div>
          <span className="text-emerald-400 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {t.readMore} <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ post, locale, t }: { post: BlogPost; locale: Locale; t: Record<string, string> }) {
  const colors = CATEGORY_COLORS[post.category];
  const Icon = CATEGORY_ICONS[post.category];
  const categoryLabel = t[getCategoryKey(post.category)] || post.category;

  return (
    <Link 
      href={`/${locale}/blog/${post.slug}`}
      className="group bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 hover:bg-gray-900 transition-all duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} rounded-full text-xs font-medium`}>
          <Icon className="w-3 h-3" />
          {categoryLabel}
        </span>
      </div>
      
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
        {post.title}
      </h3>
      
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
        {post.description}
      </p>
      
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {post.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readTime.replace('min read', t.minRead)}
        </span>
      </div>
    </Link>
  );
}

function NewsletterSignup({ t }: { t: Record<string, string> }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog' }),
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-emerald-400" />
        <h3 className="font-semibold text-white">{t.newsletter}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">{t.newsletterDesc}</p>
      
      {status === 'success' ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <Sparkles className="w-4 h-4" />
          {t.subscribed}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? t.subscribing : t.subscribe}
          </button>
        </form>
      )}
    </div>
  );
}

function PopularPosts({ posts, locale, t }: { posts: BlogPost[]; locale: Locale; t: Record<string, string> }) {
  const popular = posts.filter(p => p.featured).slice(0, 5);
  
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        {t.popularArticles}
      </h3>
      <div className="space-y-3">
        {popular.map((post, i) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="flex items-start gap-3 group"
          >
            <span className="text-emerald-400 font-bold text-sm mt-0.5">0{i + 1}</span>
            <span className="text-gray-400 text-sm group-hover:text-white transition-colors line-clamp-2">
              {post.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TagsCloud({ posts, t }: { posts: BlogPost[]; t: Record<string, string> }) {
  const allTags = posts.flatMap(p => p.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold text-white mb-4">{t.popularTags}</h3>
      <div className="flex flex-wrap gap-2">
        {topTags.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded-full transition-colors cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function BlogPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const categories = ['All', 'Guides', 'Rules Decoded', 'Reviews', 'Psychology'];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPosts.length };
    blogPosts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Featured posts (only on first page, no search, all category)
  const featuredPosts = useMemo(() => {
    return blogPosts.filter(p => p.featured);
  }, []);

  // Regular posts (non-featured for pagination)
  const regularPosts = useMemo(() => {
    return blogPosts.filter(p => !p.featured);
  }, []);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return regularPosts.slice(start, start + postsPerPage);
  }, [regularPosts, currentPage]);

  const totalPages = Math.ceil(regularPosts.length / postsPerPage);

  return (
    <>
      {/* Inject animation styles */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <div className="min-h-screen bg-gray-950">
        {/* Hero Header */}
        <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 pt-6 pb-12">
            {/* Breadcrumb */}
            <Breadcrumb t={t} locale={locale} />
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t.blogTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">{t.blogTitleHighlight}</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                {t.blogSubtitle}
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* Categories with Counts */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => {
              const Icon = cat === 'All' ? Filter : CATEGORY_ICONS[cat];
              const catLabel = t[getCategoryKey(cat)] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {catLabel}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && activeCategory === 'All' && !searchQuery && currentPage === 1 && (
                <section className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">{t.featuredArticles}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredPosts.map((post) => (
                      <FeaturedCard key={post.slug} post={post} locale={locale} t={t} />
                    ))}
                  </div>
                </section>
              )}

              {/* All/Filtered Posts */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {searchQuery 
                      ? `${t.searchResults} (${filteredPosts.length})`
                      : activeCategory === 'All' 
                        ? `${t.latestArticles} (${regularPosts.length})` 
                        : `${t[getCategoryKey(activeCategory)] || activeCategory} (${filteredPosts.length})`
                    }
                  </h2>
                </div>

                {filteredPosts.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(searchQuery || activeCategory !== 'All' ? filteredPosts : paginatedPosts).map((post) => (
                        <ArticleCard key={post.slug} post={post} locale={locale} t={t} />
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {!searchQuery && activeCategory === 'All' && totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {t.previous}
                        </button>
                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {t.next}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-white font-medium mb-2">{t.noArticlesFound}</h3>
                    <p className="text-gray-500 text-sm">{t.tryDifferentSearch}</p>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 flex-shrink-0 space-y-6">
              <NewsletterSignup t={t} />
              <PopularPosts posts={blogPosts} locale={locale} t={t} />
              <TagsCloud posts={blogPosts} t={t} />
              
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">{t.readyToGetFunded}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t.compareDesc}
                </p>
                <Link
                  href={`/${locale}/compare`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {t.comparePropFirms}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
