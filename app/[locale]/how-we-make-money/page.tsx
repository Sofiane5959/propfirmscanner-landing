'use client'

import { usePathname } from 'next/navigation'
import { 
  DollarSign, Heart, Shield, CheckCircle, 
  XCircle, ExternalLink, HelpCircle, Scale
} from 'lucide-react'

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
    badge: 'Full Transparency',
    title: 'How We Make Money',
    subtitle: "We believe in complete transparency about how PropFirm Scanner generates revenue. Here's exactly how we keep the lights on.",
    affiliateTitle: 'Affiliate Commissions',
    affiliateDesc: 'When you click on a link to a prop firm from our website and make a purchase, we may earn a commission from that prop firm. This is our primary source of revenue.',
    important: 'Important:',
    affiliateNote: "This commission comes from the prop firm, not from you. You pay the same price whether you use our link or not — and often you'll pay",
    less: 'less',
    thanksToCodes: 'thanks to our exclusive discount codes.',
    whatMeansTitle: 'What This Means for You',
    whatWeDo: 'What We Do',
    whatWeDont: "What We Don't Do",
    do1: 'Clearly mark affiliate links on our site',
    do2: 'Provide honest reviews regardless of affiliate status',
    do3: 'Include non-affiliate firms in our comparisons',
    do4: 'Offer exclusive discount codes that save you money',
    do5: 'Update our data regularly for accuracy',
    do6: 'Disclose our business model transparently',
    dont1: 'Accept payment to improve rankings',
    dont2: 'Hide negative information about affiliates',
    dont3: "Recommend firms we don't believe in",
    dont4: "Exclude firms because they're not affiliates",
    dont5: 'Charge you extra through our links',
    dont6: 'Let commissions influence our reviews',
    editorialTitle: 'Editorial Independence',
    editorialDesc: 'Our reviews, rankings, and comparisons are based on objective criteria including:',
    editorialNote: "A prop firm's affiliate status does not affect its position in our rankings. We've recommended non-affiliate firms and criticized affiliate partners when warranted.",
    trustpilot: 'Trustpilot Rating',
    trustpilotDesc: 'Independent review platform',
    pricing: 'Pricing & Value',
    pricingDesc: 'Challenge fees vs features',
    rules: 'Rules & Flexibility',
    rulesDesc: 'Trading conditions offered',
    payout: 'Payout History',
    payoutDesc: 'Track record of payments',
    platform: 'Platform Quality',
    platformDesc: 'Trading platforms supported',
    reputation: 'Company Reputation',
    reputationDesc: 'History and transparency',
    affiliateRelTitle: 'Our Affiliate Relationships',
    affiliateRelDesc: 'We have affiliate partnerships with many of the prop firms featured on our site. When you see a "Visit Website" or "Buy Challenge" button, it typically contains an affiliate link.',
    identifyTitle: 'How to Identify Affiliate Links',
    identify1: 'Links marked with "Affiliate Link" or similar disclosure',
    identify2: '"Visit Website" and "Buy Challenge" buttons on firm pages',
    identify3: 'Discount code links on our Deals page',
    identify4: 'URLs containing tracking parameters (ref=, aff=, etc.)',
    whyModelTitle: 'Why This Model?',
    benefitsYou: 'Benefits for You',
    benefitYou1: 'Free access to all comparisons and tools',
    benefitYou2: 'No subscription or membership fees',
    benefitYou3: 'Exclusive discount codes that save you money',
    benefitYou4: 'Unbiased information to make better decisions',
    benefitsUs: 'Benefits for Us',
    benefitUs1: 'Sustainable revenue to keep the site running',
    benefitUs2: 'Ability to invest in better tools and content',
    benefitUs3: 'Independence from any single prop firm',
    benefitUs4: 'Motivation to grow and serve more traders',
    choiceTitle: 'Your Choice Matters',
    choiceDesc: "You're never obligated to use our affiliate links. If you prefer, you can:",
    choice1: "Go directly to the prop firm's website",
    choice2: 'Search for the prop firm on Google',
    choice3: 'Use our information for research, then buy elsewhere',
    choiceNote: "However, if you find our site helpful and want to support our work at no extra cost to you, using our links is a great way to do that. Plus, you'll often get a discount code that saves you money!",
    questionsTitle: 'Questions?',
    questionsDesc: "We're committed to transparency. If you have any questions about our business model or affiliate relationships, please reach out.",
    contactUs: 'Contact Us',
  },
  fr: {
    badge: 'Transparence Totale',
    title: 'Comment Nous Gagnons de l\'Argent',
    subtitle: 'Nous croyons en la transparence totale sur la façon dont PropFirm Scanner génère des revenus. Voici exactement comment nous fonctionnons.',
    affiliateTitle: 'Commissions d\'Affiliation',
    affiliateDesc: 'Lorsque vous cliquez sur un lien vers une prop firm depuis notre site et effectuez un achat, nous pouvons recevoir une commission. C\'est notre principale source de revenus.',
    important: 'Important :',
    affiliateNote: 'Cette commission provient de la prop firm, pas de vous. Vous payez le même prix que vous utilisiez notre lien ou non — et souvent vous paierez',
    less: 'moins',
    thanksToCodes: 'grâce à nos codes promo exclusifs.',
    whatMeansTitle: 'Ce Que Cela Signifie Pour Vous',
    whatWeDo: 'Ce Que Nous Faisons',
    whatWeDont: 'Ce Que Nous Ne Faisons Pas',
    do1: 'Marquer clairement les liens affiliés sur notre site',
    do2: 'Fournir des avis honnêtes quel que soit le statut d\'affilié',
    do3: 'Inclure des firms non-affiliées dans nos comparaisons',
    do4: 'Offrir des codes promo exclusifs qui vous font économiser',
    do5: 'Mettre à jour nos données régulièrement',
    do6: 'Divulguer notre modèle commercial de manière transparente',
    dont1: 'Accepter des paiements pour améliorer les classements',
    dont2: 'Cacher des informations négatives sur les affiliés',
    dont3: 'Recommander des firms auxquelles nous ne croyons pas',
    dont4: 'Exclure des firms parce qu\'elles ne sont pas affiliées',
    dont5: 'Vous facturer plus via nos liens',
    dont6: 'Laisser les commissions influencer nos avis',
    editorialTitle: 'Indépendance Éditoriale',
    editorialDesc: 'Nos avis, classements et comparaisons sont basés sur des critères objectifs :',
    editorialNote: 'Le statut d\'affilié d\'une prop firm n\'affecte pas sa position dans nos classements.',
    trustpilot: 'Note Trustpilot',
    trustpilotDesc: 'Plateforme d\'avis indépendante',
    pricing: 'Prix & Valeur',
    pricingDesc: 'Frais de challenge vs fonctionnalités',
    rules: 'Règles & Flexibilité',
    rulesDesc: 'Conditions de trading offertes',
    payout: 'Historique de Paiement',
    payoutDesc: 'Track record des paiements',
    platform: 'Qualité de Plateforme',
    platformDesc: 'Plateformes de trading supportées',
    reputation: 'Réputation',
    reputationDesc: 'Histoire et transparence',
    affiliateRelTitle: 'Nos Relations d\'Affiliation',
    affiliateRelDesc: 'Nous avons des partenariats avec de nombreuses prop firms. Les boutons "Visiter le Site" ou "Acheter Challenge" contiennent généralement un lien affilié.',
    identifyTitle: 'Comment Identifier les Liens Affiliés',
    identify1: 'Liens marqués "Lien Affilié" ou mention similaire',
    identify2: 'Boutons "Visiter le Site" et "Acheter Challenge"',
    identify3: 'Liens de codes promo sur notre page Deals',
    identify4: 'URLs contenant des paramètres de tracking (ref=, aff=, etc.)',
    whyModelTitle: 'Pourquoi Ce Modèle ?',
    benefitsYou: 'Avantages Pour Vous',
    benefitYou1: 'Accès gratuit à toutes les comparaisons et outils',
    benefitYou2: 'Pas d\'abonnement ni de frais d\'adhésion',
    benefitYou3: 'Codes promo exclusifs qui vous font économiser',
    benefitYou4: 'Informations impartiales pour mieux décider',
    benefitsUs: 'Avantages Pour Nous',
    benefitUs1: 'Revenus durables pour maintenir le site',
    benefitUs2: 'Capacité d\'investir dans de meilleurs outils',
    benefitUs3: 'Indépendance vis-à-vis de toute prop firm',
    benefitUs4: 'Motivation pour grandir et servir plus de traders',
    choiceTitle: 'Votre Choix Compte',
    choiceDesc: 'Vous n\'êtes jamais obligé d\'utiliser nos liens affiliés. Vous pouvez :',
    choice1: 'Aller directement sur le site de la prop firm',
    choice2: 'Rechercher la prop firm sur Google',
    choice3: 'Utiliser nos informations pour la recherche, puis acheter ailleurs',
    choiceNote: 'Cependant, si vous trouvez notre site utile et voulez soutenir notre travail sans frais supplémentaires, utiliser nos liens est un excellent moyen de le faire !',
    questionsTitle: 'Questions ?',
    questionsDesc: 'Nous sommes engagés pour la transparence. Si vous avez des questions, contactez-nous.',
    contactUs: 'Nous Contacter',
  },
  de: {
    badge: 'Volle Transparenz',
    title: 'Wie Wir Geld Verdienen',
    subtitle: 'Wir glauben an vollständige Transparenz darüber, wie PropFirm Scanner Einnahmen generiert.',
    affiliateTitle: 'Affiliate-Provisionen',
    affiliateDesc: 'Wenn Sie auf einen Link zu einer Prop-Firma klicken und einen Kauf tätigen, erhalten wir möglicherweise eine Provision.',
    important: 'Wichtig:',
    affiliateNote: 'Diese Provision kommt von der Prop-Firma, nicht von Ihnen. Sie zahlen den gleichen Preis — und oft zahlen Sie',
    less: 'weniger',
    thanksToCodes: 'dank unserer exklusiven Rabattcodes.',
    whatMeansTitle: 'Was Dies Für Sie Bedeutet',
    whatWeDo: 'Was Wir Tun',
    whatWeDont: 'Was Wir Nicht Tun',
    do1: 'Affiliate-Links auf unserer Seite klar kennzeichnen',
    do2: 'Ehrliche Bewertungen unabhängig vom Affiliate-Status',
    do3: 'Nicht-Affiliate-Firmen in Vergleiche einbeziehen',
    do4: 'Exklusive Rabattcodes anbieten',
    do5: 'Daten regelmäßig aktualisieren',
    do6: 'Unser Geschäftsmodell transparent offenlegen',
    dont1: 'Zahlung für bessere Rankings akzeptieren',
    dont2: 'Negative Informationen über Affiliates verbergen',
    dont3: 'Firmen empfehlen, an die wir nicht glauben',
    dont4: 'Firmen ausschließen, weil sie keine Affiliates sind',
    dont5: 'Ihnen über unsere Links mehr berechnen',
    dont6: 'Provisionen unsere Bewertungen beeinflussen lassen',
    editorialTitle: 'Redaktionelle Unabhängigkeit',
    editorialDesc: 'Unsere Bewertungen und Vergleiche basieren auf objektiven Kriterien:',
    editorialNote: 'Der Affiliate-Status einer Prop-Firma beeinflusst nicht ihre Position in unseren Rankings.',
    trustpilot: 'Trustpilot-Bewertung',
    trustpilotDesc: 'Unabhängige Bewertungsplattform',
    pricing: 'Preis & Wert',
    pricingDesc: 'Challenge-Gebühren vs Funktionen',
    rules: 'Regeln & Flexibilität',
    rulesDesc: 'Angebotene Handelsbedingungen',
    payout: 'Auszahlungshistorie',
    payoutDesc: 'Zahlungsbilanz',
    platform: 'Plattformqualität',
    platformDesc: 'Unterstützte Handelsplattformen',
    reputation: 'Firmenreputation',
    reputationDesc: 'Geschichte und Transparenz',
    affiliateRelTitle: 'Unsere Affiliate-Beziehungen',
    affiliateRelDesc: 'Wir haben Partnerschaften mit vielen Prop-Firmen. "Website Besuchen" oder "Challenge Kaufen" Buttons enthalten typischerweise Affiliate-Links.',
    identifyTitle: 'Wie Man Affiliate-Links Erkennt',
    identify1: 'Links mit "Affiliate-Link" gekennzeichnet',
    identify2: '"Website Besuchen" und "Challenge Kaufen" Buttons',
    identify3: 'Rabattcode-Links auf unserer Deals-Seite',
    identify4: 'URLs mit Tracking-Parametern (ref=, aff=, etc.)',
    whyModelTitle: 'Warum Dieses Modell?',
    benefitsYou: 'Vorteile Für Sie',
    benefitYou1: 'Kostenloser Zugang zu allen Vergleichen und Tools',
    benefitYou2: 'Keine Abonnement- oder Mitgliedsgebühren',
    benefitYou3: 'Exklusive Rabattcodes, die Ihnen Geld sparen',
    benefitYou4: 'Unvoreingenommene Informationen für bessere Entscheidungen',
    benefitsUs: 'Vorteile Für Uns',
    benefitUs1: 'Nachhaltige Einnahmen für den Seitenbetrieb',
    benefitUs2: 'Fähigkeit, in bessere Tools zu investieren',
    benefitUs3: 'Unabhängigkeit von jeder einzelnen Prop-Firma',
    benefitUs4: 'Motivation zu wachsen und mehr Tradern zu dienen',
    choiceTitle: 'Ihre Wahl Zählt',
    choiceDesc: 'Sie sind nie verpflichtet, unsere Affiliate-Links zu nutzen. Sie können:',
    choice1: 'Direkt zur Website der Prop-Firma gehen',
    choice2: 'Die Prop-Firma bei Google suchen',
    choice3: 'Unsere Informationen für Recherche nutzen, dann woanders kaufen',
    choiceNote: 'Wenn Sie unsere Seite hilfreich finden und unsere Arbeit ohne zusätzliche Kosten unterstützen möchten, ist die Nutzung unserer Links eine großartige Möglichkeit.',
    questionsTitle: 'Fragen?',
    questionsDesc: 'Wir sind der Transparenz verpflichtet. Bei Fragen kontaktieren Sie uns.',
    contactUs: 'Kontaktieren Sie Uns',
  },
  es: {
    badge: 'Transparencia Total',
    title: 'Cómo Ganamos Dinero',
    subtitle: 'Creemos en la transparencia total sobre cómo PropFirm Scanner genera ingresos.',
    affiliateTitle: 'Comisiones de Afiliados',
    affiliateDesc: 'Cuando haces clic en un enlace a una prop firm y realizas una compra, podemos recibir una comisión.',
    important: 'Importante:',
    affiliateNote: 'Esta comisión viene de la prop firm, no de ti. Pagas el mismo precio uses o no nuestro enlace — y a menudo pagarás',
    less: 'menos',
    thanksToCodes: 'gracias a nuestros códigos de descuento exclusivos.',
    whatMeansTitle: 'Qué Significa Esto Para Ti',
    whatWeDo: 'Lo Que Hacemos',
    whatWeDont: 'Lo Que No Hacemos',
    do1: 'Marcar claramente los enlaces de afiliados',
    do2: 'Proporcionar reseñas honestas sin importar el estatus',
    do3: 'Incluir firmas no afiliadas en comparaciones',
    do4: 'Ofrecer códigos de descuento exclusivos',
    do5: 'Actualizar datos regularmente',
    do6: 'Divulgar nuestro modelo de negocio transparentemente',
    dont1: 'Aceptar pago para mejorar rankings',
    dont2: 'Ocultar información negativa sobre afiliados',
    dont3: 'Recomendar firmas en las que no creemos',
    dont4: 'Excluir firmas porque no son afiliadas',
    dont5: 'Cobrarte extra a través de nuestros enlaces',
    dont6: 'Dejar que las comisiones influyan en reseñas',
    editorialTitle: 'Independencia Editorial',
    editorialDesc: 'Nuestras reseñas y comparaciones se basan en criterios objetivos:',
    editorialNote: 'El estatus de afiliado de una prop firm no afecta su posición en nuestros rankings.',
    trustpilot: 'Calificación Trustpilot',
    trustpilotDesc: 'Plataforma de reseñas independiente',
    pricing: 'Precio y Valor',
    pricingDesc: 'Tarifas vs características',
    rules: 'Reglas y Flexibilidad',
    rulesDesc: 'Condiciones de trading ofrecidas',
    payout: 'Historial de Pagos',
    payoutDesc: 'Registro de pagos',
    platform: 'Calidad de Plataforma',
    platformDesc: 'Plataformas soportadas',
    reputation: 'Reputación',
    reputationDesc: 'Historia y transparencia',
    affiliateRelTitle: 'Nuestras Relaciones de Afiliados',
    affiliateRelDesc: 'Tenemos asociaciones con muchas prop firms. Los botones "Visitar Sitio" o "Comprar Challenge" típicamente contienen enlaces de afiliados.',
    identifyTitle: 'Cómo Identificar Enlaces de Afiliados',
    identify1: 'Enlaces marcados como "Enlace de Afiliado"',
    identify2: 'Botones "Visitar Sitio" y "Comprar Challenge"',
    identify3: 'Enlaces de códigos de descuento en nuestra página de Ofertas',
    identify4: 'URLs con parámetros de tracking (ref=, aff=, etc.)',
    whyModelTitle: '¿Por Qué Este Modelo?',
    benefitsYou: 'Beneficios Para Ti',
    benefitYou1: 'Acceso gratuito a todas las comparaciones y herramientas',
    benefitYou2: 'Sin suscripción ni cuotas de membresía',
    benefitYou3: 'Códigos de descuento exclusivos que te ahorran dinero',
    benefitYou4: 'Información imparcial para mejores decisiones',
    benefitsUs: 'Beneficios Para Nosotros',
    benefitUs1: 'Ingresos sostenibles para mantener el sitio',
    benefitUs2: 'Capacidad de invertir en mejores herramientas',
    benefitUs3: 'Independencia de cualquier prop firm individual',
    benefitUs4: 'Motivación para crecer y servir a más traders',
    choiceTitle: 'Tu Elección Importa',
    choiceDesc: 'Nunca estás obligado a usar nuestros enlaces de afiliados. Puedes:',
    choice1: 'Ir directamente al sitio web de la prop firm',
    choice2: 'Buscar la prop firm en Google',
    choice3: 'Usar nuestra información para investigar, luego comprar en otro lugar',
    choiceNote: 'Sin embargo, si encuentras nuestro sitio útil y quieres apoyar nuestro trabajo sin costo extra, usar nuestros enlaces es una gran manera de hacerlo.',
    questionsTitle: '¿Preguntas?',
    questionsDesc: 'Estamos comprometidos con la transparencia. Si tienes preguntas, contáctanos.',
    contactUs: 'Contáctanos',
  },
  pt: {
    badge: 'Transparência Total',
    title: 'Como Ganhamos Dinheiro',
    subtitle: 'Acreditamos na transparência total sobre como o PropFirm Scanner gera receita.',
    affiliateTitle: 'Comissões de Afiliados',
    affiliateDesc: 'Quando você clica em um link para uma prop firm e faz uma compra, podemos receber uma comissão.',
    important: 'Importante:',
    affiliateNote: 'Esta comissão vem da prop firm, não de você. Você paga o mesmo preço usando ou não nosso link — e frequentemente pagará',
    less: 'menos',
    thanksToCodes: 'graças aos nossos códigos de desconto exclusivos.',
    whatMeansTitle: 'O Que Isso Significa Para Você',
    whatWeDo: 'O Que Fazemos',
    whatWeDont: 'O Que Não Fazemos',
    do1: 'Marcar claramente links de afiliados em nosso site',
    do2: 'Fornecer avaliações honestas independentemente do status',
    do3: 'Incluir firmas não afiliadas em comparações',
    do4: 'Oferecer códigos de desconto exclusivos',
    do5: 'Atualizar dados regularmente',
    do6: 'Divulgar nosso modelo de negócio transparentemente',
    dont1: 'Aceitar pagamento para melhorar rankings',
    dont2: 'Esconder informações negativas sobre afiliados',
    dont3: 'Recomendar firmas em que não acreditamos',
    dont4: 'Excluir firmas porque não são afiliadas',
    dont5: 'Cobrar extra através de nossos links',
    dont6: 'Deixar comissões influenciarem avaliações',
    editorialTitle: 'Independência Editorial',
    editorialDesc: 'Nossas avaliações e comparações são baseadas em critérios objetivos:',
    editorialNote: 'O status de afiliado de uma prop firm não afeta sua posição em nossos rankings.',
    trustpilot: 'Avaliação Trustpilot',
    trustpilotDesc: 'Plataforma de avaliações independente',
    pricing: 'Preço e Valor',
    pricingDesc: 'Taxas vs recursos',
    rules: 'Regras e Flexibilidade',
    rulesDesc: 'Condições de trading oferecidas',
    payout: 'Histórico de Pagamentos',
    payoutDesc: 'Registro de pagamentos',
    platform: 'Qualidade da Plataforma',
    platformDesc: 'Plataformas suportadas',
    reputation: 'Reputação',
    reputationDesc: 'História e transparência',
    affiliateRelTitle: 'Nossas Relações de Afiliados',
    affiliateRelDesc: 'Temos parcerias com muitas prop firms. Botões "Visitar Site" ou "Comprar Desafio" tipicamente contêm links de afiliados.',
    identifyTitle: 'Como Identificar Links de Afiliados',
    identify1: 'Links marcados como "Link de Afiliado"',
    identify2: 'Botões "Visitar Site" e "Comprar Desafio"',
    identify3: 'Links de códigos de desconto em nossa página de Ofertas',
    identify4: 'URLs com parâmetros de tracking (ref=, aff=, etc.)',
    whyModelTitle: 'Por Que Este Modelo?',
    benefitsYou: 'Benefícios Para Você',
    benefitYou1: 'Acesso gratuito a todas as comparações e ferramentas',
    benefitYou2: 'Sem assinatura ou taxas de adesão',
    benefitYou3: 'Códigos de desconto exclusivos que economizam dinheiro',
    benefitYou4: 'Informações imparciais para melhores decisões',
    benefitsUs: 'Benefícios Para Nós',
    benefitUs1: 'Receita sustentável para manter o site',
    benefitUs2: 'Capacidade de investir em melhores ferramentas',
    benefitUs3: 'Independência de qualquer prop firm individual',
    benefitUs4: 'Motivação para crescer e servir mais traders',
    choiceTitle: 'Sua Escolha Importa',
    choiceDesc: 'Você nunca é obrigado a usar nossos links de afiliados. Você pode:',
    choice1: 'Ir diretamente ao site da prop firm',
    choice2: 'Pesquisar a prop firm no Google',
    choice3: 'Usar nossas informações para pesquisa, depois comprar em outro lugar',
    choiceNote: 'No entanto, se você acha nosso site útil e quer apoiar nosso trabalho sem custo extra, usar nossos links é uma ótima maneira de fazer isso.',
    questionsTitle: 'Perguntas?',
    questionsDesc: 'Estamos comprometidos com a transparência. Se tiver perguntas, entre em contato.',
    contactUs: 'Entre em Contato',
  },
  ar: {
    badge: 'شفافية كاملة',
    title: 'كيف نكسب المال',
    subtitle: 'نؤمن بالشفافية الكاملة حول كيفية تحقيق PropFirm Scanner للإيرادات.',
    affiliateTitle: 'عمولات الإحالة',
    affiliateDesc: 'عندما تنقر على رابط لشركة prop firm وتقوم بالشراء، قد نتلقى عمولة.',
    important: 'هام:',
    affiliateNote: 'هذه العمولة تأتي من الشركة، وليس منك. تدفع نفس السعر سواء استخدمت رابطنا أم لا — وغالباً ستدفع',
    less: 'أقل',
    thanksToCodes: 'بفضل رموز الخصم الحصرية لدينا.',
    whatMeansTitle: 'ماذا يعني هذا لك',
    whatWeDo: 'ما نفعله',
    whatWeDont: 'ما لا نفعله',
    do1: 'تحديد روابط الإحالة بوضوح على موقعنا',
    do2: 'تقديم مراجعات صادقة بغض النظر عن الحالة',
    do3: 'تضمين شركات غير تابعة في المقارنات',
    do4: 'تقديم رموز خصم حصرية',
    do5: 'تحديث البيانات بانتظام',
    do6: 'الإفصاح عن نموذج عملنا بشفافية',
    dont1: 'قبول الدفع لتحسين التصنيفات',
    dont2: 'إخفاء معلومات سلبية عن الشركاء',
    dont3: 'التوصية بشركات لا نؤمن بها',
    dont4: 'استبعاد شركات لأنها ليست شركاء',
    dont5: 'تحميلك رسوماً إضافية عبر روابطنا',
    dont6: 'السماح للعمولات بالتأثير على المراجعات',
    editorialTitle: 'الاستقلال التحريري',
    editorialDesc: 'تستند مراجعاتنا ومقارناتنا إلى معايير موضوعية:',
    editorialNote: 'حالة الإحالة لشركة prop firm لا تؤثر على موقعها في تصنيفاتنا.',
    trustpilot: 'تقييم Trustpilot',
    trustpilotDesc: 'منصة مراجعات مستقلة',
    pricing: 'السعر والقيمة',
    pricingDesc: 'الرسوم مقابل الميزات',
    rules: 'القواعد والمرونة',
    rulesDesc: 'شروط التداول المقدمة',
    payout: 'سجل المدفوعات',
    payoutDesc: 'سجل المدفوعات',
    platform: 'جودة المنصة',
    platformDesc: 'المنصات المدعومة',
    reputation: 'السمعة',
    reputationDesc: 'التاريخ والشفافية',
    affiliateRelTitle: 'علاقات الإحالة لدينا',
    affiliateRelDesc: 'لدينا شراكات مع العديد من شركات prop firm. أزرار "زيارة الموقع" أو "شراء التحدي" عادة تحتوي على روابط إحالة.',
    identifyTitle: 'كيفية تحديد روابط الإحالة',
    identify1: 'روابط مميزة بـ "رابط إحالة"',
    identify2: 'أزرار "زيارة الموقع" و"شراء التحدي"',
    identify3: 'روابط رموز الخصم في صفحة العروض',
    identify4: 'عناوين URL تحتوي على معلمات تتبع',
    whyModelTitle: 'لماذا هذا النموذج؟',
    benefitsYou: 'الفوائد لك',
    benefitYou1: 'وصول مجاني لجميع المقارنات والأدوات',
    benefitYou2: 'لا اشتراك أو رسوم عضوية',
    benefitYou3: 'رموز خصم حصرية توفر لك المال',
    benefitYou4: 'معلومات محايدة لقرارات أفضل',
    benefitsUs: 'الفوائد لنا',
    benefitUs1: 'إيرادات مستدامة لتشغيل الموقع',
    benefitUs2: 'القدرة على الاستثمار في أدوات أفضل',
    benefitUs3: 'الاستقلال عن أي شركة واحدة',
    benefitUs4: 'الدافع للنمو وخدمة المزيد من المتداولين',
    choiceTitle: 'اختيارك مهم',
    choiceDesc: 'أنت غير ملزم باستخدام روابط الإحالة. يمكنك:',
    choice1: 'الذهاب مباشرة إلى موقع الشركة',
    choice2: 'البحث عن الشركة في Google',
    choice3: 'استخدام معلوماتنا للبحث، ثم الشراء من مكان آخر',
    choiceNote: 'ومع ذلك، إذا وجدت موقعنا مفيداً وتريد دعم عملنا بدون تكلفة إضافية، فإن استخدام روابطنا طريقة رائعة.',
    questionsTitle: 'أسئلة؟',
    questionsDesc: 'نحن ملتزمون بالشفافية. إذا كانت لديك أسئلة، تواصل معنا.',
    contactUs: 'اتصل بنا',
  },
  hi: {
    badge: 'पूर्ण पारदर्शिता',
    title: 'हम पैसे कैसे कमाते हैं',
    subtitle: 'हम इस बारे में पूर्ण पारदर्शिता में विश्वास करते हैं कि PropFirm Scanner कैसे राजस्व उत्पन्न करता है।',
    affiliateTitle: 'एफिलिएट कमीशन',
    affiliateDesc: 'जब आप हमारी वेबसाइट से किसी प्रॉप फर्म के लिंक पर क्लिक करते हैं और खरीदारी करते हैं, तो हमें कमीशन मिल सकता है।',
    important: 'महत्वपूर्ण:',
    affiliateNote: 'यह कमीशन प्रॉप फर्म से आता है, आपसे नहीं। आप वही कीमत चुकाते हैं — और अक्सर आप',
    less: 'कम',
    thanksToCodes: 'हमारे एक्सक्लूसिव डिस्काउंट कोड की बदौलत देंगे।',
    whatMeansTitle: 'आपके लिए इसका क्या मतलब है',
    whatWeDo: 'हम क्या करते हैं',
    whatWeDont: 'हम क्या नहीं करते',
    do1: 'हमारी साइट पर एफिलिएट लिंक स्पष्ट रूप से चिह्नित करें',
    do2: 'स्थिति की परवाह किए बिना ईमानदार समीक्षाएं प्रदान करें',
    do3: 'गैर-एफिलिएट फर्म्स को तुलना में शामिल करें',
    do4: 'एक्सक्लूसिव डिस्काउंट कोड प्रदान करें',
    do5: 'नियमित रूप से डेटा अपडेट करें',
    do6: 'हमारे बिजनेस मॉडल को पारदर्शी रूप से प्रकट करें',
    dont1: 'रैंकिंग सुधारने के लिए भुगतान स्वीकार करें',
    dont2: 'एफिलिएट्स के बारे में नकारात्मक जानकारी छुपाएं',
    dont3: 'उन फर्म्स की सिफारिश करें जिन पर हम विश्वास नहीं करते',
    dont4: 'फर्म्स को बाहर करें क्योंकि वे एफिलिएट नहीं हैं',
    dont5: 'हमारे लिंक के माध्यम से आपसे अतिरिक्त शुल्क लें',
    dont6: 'कमीशन को समीक्षाओं को प्रभावित करने दें',
    editorialTitle: 'संपादकीय स्वतंत्रता',
    editorialDesc: 'हमारी समीक्षाएं और तुलनाएं वस्तुनिष्ठ मानदंडों पर आधारित हैं:',
    editorialNote: 'किसी प्रॉप फर्म की एफिलिएट स्थिति हमारी रैंकिंग में उसकी स्थिति को प्रभावित नहीं करती।',
    trustpilot: 'Trustpilot रेटिंग',
    trustpilotDesc: 'स्वतंत्र समीक्षा प्लेटफॉर्म',
    pricing: 'मूल्य और मूल्य',
    pricingDesc: 'शुल्क बनाम सुविधाएं',
    rules: 'नियम और लचीलापन',
    rulesDesc: 'प्रदान की गई ट्रेडिंग शर्तें',
    payout: 'भुगतान इतिहास',
    payoutDesc: 'भुगतान का ट्रैक रिकॉर्ड',
    platform: 'प्लेटफॉर्म गुणवत्ता',
    platformDesc: 'समर्थित प्लेटफॉर्म',
    reputation: 'प्रतिष्ठा',
    reputationDesc: 'इतिहास और पारदर्शिता',
    affiliateRelTitle: 'हमारे एफिलिएट संबंध',
    affiliateRelDesc: 'हमारी कई प्रॉप फर्म्स के साथ साझेदारी है। "वेबसाइट देखें" या "चैलेंज खरीदें" बटन में आमतौर पर एफिलिएट लिंक होते हैं।',
    identifyTitle: 'एफिलिएट लिंक कैसे पहचानें',
    identify1: '"एफिलिएट लिंक" के रूप में चिह्नित लिंक',
    identify2: '"वेबसाइट देखें" और "चैलेंज खरीदें" बटन',
    identify3: 'हमारे डील्स पेज पर डिस्काउंट कोड लिंक',
    identify4: 'ट्रैकिंग पैरामीटर वाले URLs',
    whyModelTitle: 'यह मॉडल क्यों?',
    benefitsYou: 'आपके लिए लाभ',
    benefitYou1: 'सभी तुलनाओं और टूल्स तक मुफ्त पहुंच',
    benefitYou2: 'कोई सब्सक्रिप्शन या सदस्यता शुल्क नहीं',
    benefitYou3: 'एक्सक्लूसिव डिस्काउंट कोड जो आपके पैसे बचाते हैं',
    benefitYou4: 'बेहतर निर्णयों के लिए निष्पक्ष जानकारी',
    benefitsUs: 'हमारे लिए लाभ',
    benefitUs1: 'साइट चलाने के लिए स्थायी राजस्व',
    benefitUs2: 'बेहतर टूल्स में निवेश करने की क्षमता',
    benefitUs3: 'किसी भी एक प्रॉप फर्म से स्वतंत्रता',
    benefitUs4: 'बढ़ने और अधिक ट्रेडर्स की सेवा करने की प्रेरणा',
    choiceTitle: 'आपकी पसंद मायने रखती है',
    choiceDesc: 'आप हमारे एफिलिएट लिंक का उपयोग करने के लिए कभी बाध्य नहीं हैं। आप:',
    choice1: 'सीधे प्रॉप फर्म की वेबसाइट पर जाएं',
    choice2: 'Google पर प्रॉप फर्म खोजें',
    choice3: 'हमारी जानकारी रिसर्च के लिए उपयोग करें, फिर कहीं और खरीदें',
    choiceNote: 'हालांकि, यदि आपको हमारी साइट उपयोगी लगती है और बिना अतिरिक्त लागत के हमारे काम का समर्थन करना चाहते हैं, तो हमारे लिंक का उपयोग करना इसका एक शानदार तरीका है।',
    questionsTitle: 'सवाल?',
    questionsDesc: 'हम पारदर्शिता के लिए प्रतिबद्ध हैं। यदि आपके कोई प्रश्न हैं, तो संपर्क करें।',
    contactUs: 'संपर्क करें',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function HowWeMakeMoneyPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  const whatWeDo = [t.do1, t.do2, t.do3, t.do4, t.do5, t.do6];
  const whatWeDont = [t.dont1, t.dont2, t.dont3, t.dont4, t.dont5, t.dont6];
  
  const criteria = [
    { label: t.trustpilot, desc: t.trustpilotDesc },
    { label: t.pricing, desc: t.pricingDesc },
    { label: t.rules, desc: t.rulesDesc },
    { label: t.payout, desc: t.payoutDesc },
    { label: t.platform, desc: t.platformDesc },
    { label: t.reputation, desc: t.reputationDesc },
  ];

  const identifyItems = [t.identify1, t.identify2, t.identify3, t.identify4];
  const benefitsYou = [t.benefitYou1, t.benefitYou2, t.benefitYou3, t.benefitYou4];
  const benefitsUs = [t.benefitUs1, t.benefitUs2, t.benefitUs3, t.benefitUs4];
  const choices = [t.choice1, t.choice2, t.choice3];

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
            <Heart className="w-4 h-4" />
            {t.badge}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Main Revenue Source */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">{t.affiliateTitle}</h2>
                <p className="text-gray-300 mb-4">{t.affiliateDesc}</p>
                <p className="text-gray-400">
                  <strong className="text-white">{t.important}</strong> {t.affiliateNote}{' '}
                  <span className="text-emerald-400">{t.less}</span> {t.thanksToCodes}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What This Means */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            {t.whatMeansTitle}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                {t.whatWeDo}
              </h3>
              <ul className="space-y-3">
                {whatWeDo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                {t.whatWeDont}
              </h3>
              <ul className="space-y-3">
                {whatWeDont.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <XCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Editorial Independence */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-400" />
            {t.editorialTitle}
          </h2>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <p className="text-gray-300">{t.editorialDesc}</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {criteria.map((item, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-gray-500 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm">{t.editorialNote}</p>
          </div>
        </section>

        {/* Affiliate Partners */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t.affiliateRelTitle}</h2>
          
          <p className="text-gray-400 mb-6">{t.affiliateRelDesc}</p>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">{t.identifyTitle}</h3>
            <ul className="space-y-3 text-gray-300">
              {identifyItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why This Model */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">{t.whyModelTitle}</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-emerald-400 font-semibold mb-3">{t.benefitsYou}</h3>
              <ul className="space-y-2 text-gray-300">
                {benefitsYou.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-blue-400 font-semibold mb-3">{t.benefitsUs}</h3>
              <ul className="space-y-2 text-gray-300">
                {benefitsUs.map((item, i) => (
                  <li key={i}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Your Choice */}
        <section className="mb-12">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" />
              {t.choiceTitle}
            </h2>
            <p className="text-gray-300 mb-4">{t.choiceDesc}</p>
            <ul className="space-y-2 text-gray-400">
              {choices.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
            <p className="text-gray-300 mt-4">{t.choiceNote}</p>
          </div>
        </section>

        {/* Questions */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">{t.questionsTitle}</h2>
            <p className="text-gray-400 mb-6">{t.questionsDesc}</p>
            <a
              href="mailto:hello@propfirmscanner.org?subject=Question%20About%20Affiliates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              {t.contactUs}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
