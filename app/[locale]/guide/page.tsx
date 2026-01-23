'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { 
  BookOpen, CheckCircle, Download, Mail, ArrowRight, 
  Target, Shield, TrendingUp, AlertTriangle, Star,
  DollarSign, Clock, Users, Award
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
    // Hero
    freeGuide: 'Free 40+ Page Guide',
    heroTitle1: 'How to Choose the',
    heroTitle2: 'Perfect Prop Firm',
    heroTitle3: 'in 2026',
    heroDescription: 'Stop wasting money on the wrong prop firms. Our comprehensive guide reveals exactly what to look for, red flags to avoid, and our top picks for every trading style.',
    // Benefits
    benefit1: 'Save $500+ by avoiding bad choices',
    benefit2: '30+ hours of research condensed',
    benefit3: 'Used by 5,000+ traders',
    benefit4: 'Updated for 2026',
    socialProof: 'Trusted by 5,000+ traders worldwide',
    // Form
    getYourFreeGuide: 'Get Your Free Guide',
    enterEmailToDownload: 'Enter your email to download instantly',
    emailPlaceholder: 'Enter your email address',
    downloadFreeGuide: 'Download Free Guide',
    processing: 'Processing...',
    byDownloading: 'By downloading, you agree to receive occasional emails. Unsubscribe anytime.',
    // Success
    guideReady: 'Your Guide is Ready! 🎉',
    clickToDownload: 'Click below to download your free guide',
    downloadPdfNow: 'Download PDF Now',
    problemsDownloading: 'Problems downloading?',
    openInNewTab: 'Open in new tab',
    // Validation
    validEmail: 'Please enter a valid email address',
    networkError: 'Network error. Please try again.',
    yourGuideReady: 'Your guide is ready!',
    // What's Inside
    whatsInside: "What's Inside the Guide",
    whatsInsideDesc: 'Everything you need to know to make an informed decision and find the perfect prop firm for your trading style.',
    chapter: 'Chapter',
    // Chapters
    chapter1Title: 'Understanding Prop Firms',
    chapter1Desc: 'What are prop firms and how do they work?',
    chapter2Title: 'Challenge Types Explained',
    chapter2Desc: '1-step, 2-step, 3-step, and instant funding',
    chapter3Title: 'Key Rules to Know',
    chapter3Desc: 'Drawdown, profit targets, and trading rules',
    chapter4Title: 'Choosing the Right Platform',
    chapter4Desc: 'MT4, MT5, cTrader, and more',
    chapter5Title: 'Red Flags to Avoid',
    chapter5Desc: 'How to spot scam prop firms',
    chapter6Title: 'Our Top Picks for 2026',
    chapter6Desc: 'Best prop firms by category',
    // Testimonials
    whatTradersSay: 'What Traders Say',
    testimonial1Quote: 'This guide saved me from choosing a scam prop firm. The red flags section is gold!',
    testimonial1Name: 'Michael T.',
    testimonial1Role: 'Forex Trader',
    testimonial2Quote: 'Finally understood the difference between challenge types. Passed my first evaluation!',
    testimonial2Name: 'Sarah K.',
    testimonial2Role: 'Day Trader',
    testimonial3Quote: 'Wish I had this before wasting $500 on the wrong firm. Essential reading.',
    testimonial3Name: 'James R.',
    testimonial3Role: 'Swing Trader',
    // Final CTA
    readyToFind: 'Ready to Find Your Perfect Prop Firm?',
    downloadNowStart: 'Download the free guide now and start your funded trading journey the right way.',
    getFreeGuideNow: 'Get Free Guide Now',
  },
  fr: {
    freeGuide: 'Guide Gratuit de 40+ Pages',
    heroTitle1: 'Comment Choisir la',
    heroTitle2: 'Prop Firm Parfaite',
    heroTitle3: 'en 2026',
    heroDescription: 'Arrêtez de gaspiller votre argent sur les mauvaises prop firms. Notre guide complet révèle exactement ce qu\'il faut rechercher, les signaux d\'alerte à éviter et nos meilleurs choix pour chaque style de trading.',
    benefit1: 'Économisez 500$+ en évitant les mauvais choix',
    benefit2: '30+ heures de recherche condensées',
    benefit3: 'Utilisé par 5 000+ traders',
    benefit4: 'Mis à jour pour 2026',
    socialProof: 'Approuvé par 5 000+ traders dans le monde',
    getYourFreeGuide: 'Obtenez Votre Guide Gratuit',
    enterEmailToDownload: 'Entrez votre email pour télécharger instantanément',
    emailPlaceholder: 'Entrez votre adresse email',
    downloadFreeGuide: 'Télécharger le Guide Gratuit',
    processing: 'Traitement...',
    byDownloading: 'En téléchargeant, vous acceptez de recevoir des emails occasionnels. Désabonnement possible à tout moment.',
    guideReady: 'Votre Guide est Prêt ! 🎉',
    clickToDownload: 'Cliquez ci-dessous pour télécharger votre guide gratuit',
    downloadPdfNow: 'Télécharger le PDF',
    problemsDownloading: 'Problèmes de téléchargement ?',
    openInNewTab: 'Ouvrir dans un nouvel onglet',
    validEmail: 'Veuillez entrer une adresse email valide',
    networkError: 'Erreur réseau. Veuillez réessayer.',
    yourGuideReady: 'Votre guide est prêt !',
    whatsInside: 'Ce que Contient le Guide',
    whatsInsideDesc: 'Tout ce que vous devez savoir pour prendre une décision éclairée et trouver la prop firm parfaite pour votre style de trading.',
    chapter: 'Chapitre',
    chapter1Title: 'Comprendre les Prop Firms',
    chapter1Desc: 'Que sont les prop firms et comment fonctionnent-elles ?',
    chapter2Title: 'Types de Challenges Expliqués',
    chapter2Desc: '1 étape, 2 étapes, 3 étapes et financement instantané',
    chapter3Title: 'Règles Clés à Connaître',
    chapter3Desc: 'Drawdown, objectifs de profit et règles de trading',
    chapter4Title: 'Choisir la Bonne Plateforme',
    chapter4Desc: 'MT4, MT5, cTrader et plus',
    chapter5Title: 'Signaux d\'Alerte à Éviter',
    chapter5Desc: 'Comment repérer les prop firms frauduleuses',
    chapter6Title: 'Nos Meilleurs Choix pour 2026',
    chapter6Desc: 'Meilleures prop firms par catégorie',
    whatTradersSay: 'Ce que Disent les Traders',
    testimonial1Quote: 'Ce guide m\'a évité de choisir une prop firm frauduleuse. La section signaux d\'alerte est en or !',
    testimonial1Name: 'Michel T.',
    testimonial1Role: 'Trader Forex',
    testimonial2Quote: 'J\'ai enfin compris la différence entre les types de challenges. J\'ai réussi ma première évaluation !',
    testimonial2Name: 'Sarah K.',
    testimonial2Role: 'Day Trader',
    testimonial3Quote: 'J\'aurais aimé avoir ça avant de gaspiller 500$ sur la mauvaise firm. Lecture essentielle.',
    testimonial3Name: 'Jacques R.',
    testimonial3Role: 'Swing Trader',
    readyToFind: 'Prêt à Trouver Votre Prop Firm Parfaite ?',
    downloadNowStart: 'Téléchargez le guide gratuit maintenant et commencez votre parcours de trading financé du bon pied.',
    getFreeGuideNow: 'Obtenir le Guide Gratuit',
  },
  de: {
    freeGuide: 'Kostenloser 40+ Seiten Guide',
    heroTitle1: 'Wie Sie die',
    heroTitle2: 'Perfekte Prop Firm',
    heroTitle3: 'in 2026 Wählen',
    heroDescription: 'Verschwenden Sie kein Geld mehr für die falschen Prop Firms. Unser umfassender Guide zeigt genau, worauf Sie achten müssen, welche Warnsignale Sie vermeiden sollten und unsere Top-Empfehlungen für jeden Trading-Stil.',
    benefit1: 'Sparen Sie 500$+ durch kluge Entscheidungen',
    benefit2: '30+ Stunden Recherche zusammengefasst',
    benefit3: 'Von 5.000+ Tradern genutzt',
    benefit4: 'Aktualisiert für 2026',
    socialProof: 'Vertraut von 5.000+ Tradern weltweit',
    getYourFreeGuide: 'Holen Sie Sich Ihren Kostenlosen Guide',
    enterEmailToDownload: 'E-Mail eingeben für sofortigen Download',
    emailPlaceholder: 'Ihre E-Mail-Adresse eingeben',
    downloadFreeGuide: 'Kostenlosen Guide Herunterladen',
    processing: 'Wird verarbeitet...',
    byDownloading: 'Mit dem Download stimmen Sie zu, gelegentlich E-Mails zu erhalten. Jederzeit abbestellbar.',
    guideReady: 'Ihr Guide ist Bereit! 🎉',
    clickToDownload: 'Klicken Sie unten, um Ihren kostenlosen Guide herunterzuladen',
    downloadPdfNow: 'PDF Jetzt Herunterladen',
    problemsDownloading: 'Probleme beim Download?',
    openInNewTab: 'In neuem Tab öffnen',
    validEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
    yourGuideReady: 'Ihr Guide ist bereit!',
    whatsInside: 'Was der Guide Enthält',
    whatsInsideDesc: 'Alles, was Sie wissen müssen, um eine fundierte Entscheidung zu treffen und die perfekte Prop Firm für Ihren Trading-Stil zu finden.',
    chapter: 'Kapitel',
    chapter1Title: 'Prop Firms Verstehen',
    chapter1Desc: 'Was sind Prop Firms und wie funktionieren sie?',
    chapter2Title: 'Challenge-Typen Erklärt',
    chapter2Desc: '1-Schritt, 2-Schritt, 3-Schritt und Sofort-Finanzierung',
    chapter3Title: 'Wichtige Regeln',
    chapter3Desc: 'Drawdown, Gewinnziele und Trading-Regeln',
    chapter4Title: 'Die Richtige Plattform Wählen',
    chapter4Desc: 'MT4, MT5, cTrader und mehr',
    chapter5Title: 'Warnsignale Vermeiden',
    chapter5Desc: 'Wie Sie betrügerische Prop Firms erkennen',
    chapter6Title: 'Unsere Top-Empfehlungen für 2026',
    chapter6Desc: 'Beste Prop Firms nach Kategorie',
    whatTradersSay: 'Was Trader Sagen',
    testimonial1Quote: 'Dieser Guide hat mich davor bewahrt, eine betrügerische Prop Firm zu wählen. Der Abschnitt über Warnsignale ist Gold wert!',
    testimonial1Name: 'Michael T.',
    testimonial1Role: 'Forex Trader',
    testimonial2Quote: 'Endlich verstehe ich den Unterschied zwischen den Challenge-Typen. Habe meine erste Bewertung bestanden!',
    testimonial2Name: 'Sarah K.',
    testimonial2Role: 'Day Trader',
    testimonial3Quote: 'Hätte ich das gehabt, bevor ich 500$ bei der falschen Firma verschwendet habe. Pflichtlektüre.',
    testimonial3Name: 'James R.',
    testimonial3Role: 'Swing Trader',
    readyToFind: 'Bereit, Ihre Perfekte Prop Firm zu Finden?',
    downloadNowStart: 'Laden Sie jetzt den kostenlosen Guide herunter und starten Sie Ihre Funded-Trading-Reise richtig.',
    getFreeGuideNow: 'Kostenlosen Guide Holen',
  },
  es: {
    freeGuide: 'Guía Gratuita de 40+ Páginas',
    heroTitle1: 'Cómo Elegir la',
    heroTitle2: 'Prop Firm Perfecta',
    heroTitle3: 'en 2026',
    heroDescription: 'Deja de desperdiciar dinero en las prop firms equivocadas. Nuestra guía completa revela exactamente qué buscar, las señales de alerta a evitar y nuestras mejores recomendaciones para cada estilo de trading.',
    benefit1: 'Ahorra $500+ evitando malas decisiones',
    benefit2: '30+ horas de investigación condensadas',
    benefit3: 'Usado por 5,000+ traders',
    benefit4: 'Actualizado para 2026',
    socialProof: 'Confiado por 5,000+ traders en todo el mundo',
    getYourFreeGuide: 'Obtén Tu Guía Gratuita',
    enterEmailToDownload: 'Ingresa tu email para descargar al instante',
    emailPlaceholder: 'Ingresa tu dirección de email',
    downloadFreeGuide: 'Descargar Guía Gratuita',
    processing: 'Procesando...',
    byDownloading: 'Al descargar, aceptas recibir emails ocasionales. Puedes cancelar en cualquier momento.',
    guideReady: '¡Tu Guía está Lista! 🎉',
    clickToDownload: 'Haz clic abajo para descargar tu guía gratuita',
    downloadPdfNow: 'Descargar PDF Ahora',
    problemsDownloading: '¿Problemas para descargar?',
    openInNewTab: 'Abrir en nueva pestaña',
    validEmail: 'Por favor ingresa un email válido',
    networkError: 'Error de red. Por favor intenta de nuevo.',
    yourGuideReady: '¡Tu guía está lista!',
    whatsInside: 'Qué Contiene la Guía',
    whatsInsideDesc: 'Todo lo que necesitas saber para tomar una decisión informada y encontrar la prop firm perfecta para tu estilo de trading.',
    chapter: 'Capítulo',
    chapter1Title: 'Entendiendo las Prop Firms',
    chapter1Desc: '¿Qué son las prop firms y cómo funcionan?',
    chapter2Title: 'Tipos de Challenges Explicados',
    chapter2Desc: '1 paso, 2 pasos, 3 pasos y financiamiento instantáneo',
    chapter3Title: 'Reglas Clave a Conocer',
    chapter3Desc: 'Drawdown, objetivos de ganancia y reglas de trading',
    chapter4Title: 'Eligiendo la Plataforma Correcta',
    chapter4Desc: 'MT4, MT5, cTrader y más',
    chapter5Title: 'Señales de Alerta a Evitar',
    chapter5Desc: 'Cómo detectar prop firms fraudulentas',
    chapter6Title: 'Nuestras Mejores Elecciones para 2026',
    chapter6Desc: 'Mejores prop firms por categoría',
    whatTradersSay: 'Lo que Dicen los Traders',
    testimonial1Quote: '¡Esta guía me salvó de elegir una prop firm fraudulenta. La sección de señales de alerta es oro!',
    testimonial1Name: 'Miguel T.',
    testimonial1Role: 'Trader de Forex',
    testimonial2Quote: '¡Por fin entendí la diferencia entre tipos de challenges. Pasé mi primera evaluación!',
    testimonial2Name: 'Sara K.',
    testimonial2Role: 'Day Trader',
    testimonial3Quote: 'Ojalá hubiera tenido esto antes de desperdiciar $500 en la firma equivocada. Lectura esencial.',
    testimonial3Name: 'Jaime R.',
    testimonial3Role: 'Swing Trader',
    readyToFind: '¿Listo para Encontrar Tu Prop Firm Perfecta?',
    downloadNowStart: 'Descarga la guía gratuita ahora y comienza tu viaje de trading financiado de la manera correcta.',
    getFreeGuideNow: 'Obtener Guía Gratuita Ahora',
  },
  pt: {
    freeGuide: 'Guia Gratuito de 40+ Páginas',
    heroTitle1: 'Como Escolher a',
    heroTitle2: 'Prop Firm Perfeita',
    heroTitle3: 'em 2026',
    heroDescription: 'Pare de desperdiçar dinheiro nas prop firms erradas. Nosso guia completo revela exatamente o que procurar, sinais de alerta a evitar e nossas melhores escolhas para cada estilo de trading.',
    benefit1: 'Economize $500+ evitando más escolhas',
    benefit2: '30+ horas de pesquisa condensadas',
    benefit3: 'Usado por 5.000+ traders',
    benefit4: 'Atualizado para 2026',
    socialProof: 'Confiado por 5.000+ traders em todo o mundo',
    getYourFreeGuide: 'Obtenha Seu Guia Gratuito',
    enterEmailToDownload: 'Digite seu email para baixar instantaneamente',
    emailPlaceholder: 'Digite seu endereço de email',
    downloadFreeGuide: 'Baixar Guia Gratuito',
    processing: 'Processando...',
    byDownloading: 'Ao baixar, você concorda em receber emails ocasionais. Cancele a qualquer momento.',
    guideReady: 'Seu Guia está Pronto! 🎉',
    clickToDownload: 'Clique abaixo para baixar seu guia gratuito',
    downloadPdfNow: 'Baixar PDF Agora',
    problemsDownloading: 'Problemas para baixar?',
    openInNewTab: 'Abrir em nova aba',
    validEmail: 'Por favor digite um email válido',
    networkError: 'Erro de rede. Por favor tente novamente.',
    yourGuideReady: 'Seu guia está pronto!',
    whatsInside: 'O que Contém o Guia',
    whatsInsideDesc: 'Tudo o que você precisa saber para tomar uma decisão informada e encontrar a prop firm perfeita para seu estilo de trading.',
    chapter: 'Capítulo',
    chapter1Title: 'Entendendo as Prop Firms',
    chapter1Desc: 'O que são prop firms e como funcionam?',
    chapter2Title: 'Tipos de Desafios Explicados',
    chapter2Desc: '1 etapa, 2 etapas, 3 etapas e financiamento instantâneo',
    chapter3Title: 'Regras Chave para Conhecer',
    chapter3Desc: 'Drawdown, metas de lucro e regras de trading',
    chapter4Title: 'Escolhendo a Plataforma Certa',
    chapter4Desc: 'MT4, MT5, cTrader e mais',
    chapter5Title: 'Sinais de Alerta a Evitar',
    chapter5Desc: 'Como identificar prop firms fraudulentas',
    chapter6Title: 'Nossas Melhores Escolhas para 2026',
    chapter6Desc: 'Melhores prop firms por categoria',
    whatTradersSay: 'O que os Traders Dizem',
    testimonial1Quote: 'Este guia me salvou de escolher uma prop firm fraudulenta. A seção de sinais de alerta é ouro!',
    testimonial1Name: 'Miguel T.',
    testimonial1Role: 'Trader de Forex',
    testimonial2Quote: 'Finalmente entendi a diferença entre tipos de desafios. Passei minha primeira avaliação!',
    testimonial2Name: 'Sara K.',
    testimonial2Role: 'Day Trader',
    testimonial3Quote: 'Queria ter tido isso antes de desperdiçar $500 na firma errada. Leitura essencial.',
    testimonial3Name: 'Tiago R.',
    testimonial3Role: 'Swing Trader',
    readyToFind: 'Pronto para Encontrar Sua Prop Firm Perfeita?',
    downloadNowStart: 'Baixe o guia gratuito agora e comece sua jornada de trading financiado da maneira certa.',
    getFreeGuideNow: 'Obter Guia Gratuito Agora',
  },
  ar: {
    freeGuide: 'دليل مجاني من 40+ صفحة',
    heroTitle1: 'كيف تختار',
    heroTitle2: 'شركة التداول المثالية',
    heroTitle3: 'في 2026',
    heroDescription: 'توقف عن إهدار المال على شركات التداول الخاطئة. دليلنا الشامل يكشف بالضبط ما يجب البحث عنه، علامات التحذير التي يجب تجنبها، وأفضل اختياراتنا لكل نمط تداول.',
    benefit1: 'وفر 500$+ بتجنب الخيارات السيئة',
    benefit2: '30+ ساعة من البحث مختصرة',
    benefit3: 'يستخدمه 5,000+ متداول',
    benefit4: 'محدث لعام 2026',
    socialProof: 'موثوق به من قبل 5,000+ متداول حول العالم',
    getYourFreeGuide: 'احصل على دليلك المجاني',
    enterEmailToDownload: 'أدخل بريدك الإلكتروني للتحميل فوراً',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    downloadFreeGuide: 'تحميل الدليل المجاني',
    processing: 'جاري المعالجة...',
    byDownloading: 'بالتحميل، توافق على استلام رسائل بريدية عرضية. يمكنك إلغاء الاشتراك في أي وقت.',
    guideReady: 'دليلك جاهز! 🎉',
    clickToDownload: 'انقر أدناه لتحميل دليلك المجاني',
    downloadPdfNow: 'تحميل PDF الآن',
    problemsDownloading: 'مشاكل في التحميل؟',
    openInNewTab: 'فتح في علامة تبويب جديدة',
    validEmail: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    networkError: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    yourGuideReady: 'دليلك جاهز!',
    whatsInside: 'ماذا يحتوي الدليل',
    whatsInsideDesc: 'كل ما تحتاج معرفته لاتخاذ قرار مدروس وإيجاد شركة التداول المثالية لأسلوب تداولك.',
    chapter: 'الفصل',
    chapter1Title: 'فهم شركات التداول',
    chapter1Desc: 'ما هي شركات التداول وكيف تعمل؟',
    chapter2Title: 'أنواع التحديات موضحة',
    chapter2Desc: 'خطوة واحدة، خطوتان، 3 خطوات والتمويل الفوري',
    chapter3Title: 'القواعد الأساسية للمعرفة',
    chapter3Desc: 'السحب، أهداف الربح وقواعد التداول',
    chapter4Title: 'اختيار المنصة الصحيحة',
    chapter4Desc: 'MT4، MT5، cTrader والمزيد',
    chapter5Title: 'علامات التحذير لتجنبها',
    chapter5Desc: 'كيف تكتشف شركات التداول الاحتيالية',
    chapter6Title: 'أفضل اختياراتنا لعام 2026',
    chapter6Desc: 'أفضل شركات التداول حسب الفئة',
    whatTradersSay: 'ماذا يقول المتداولون',
    testimonial1Quote: 'هذا الدليل أنقذني من اختيار شركة تداول احتيالية. قسم علامات التحذير ذهب!',
    testimonial1Name: 'محمد ت.',
    testimonial1Role: 'متداول فوركس',
    testimonial2Quote: 'أخيراً فهمت الفرق بين أنواع التحديات. نجحت في أول تقييم لي!',
    testimonial2Name: 'سارة ك.',
    testimonial2Role: 'متداول يومي',
    testimonial3Quote: 'ليتني حصلت على هذا قبل إهدار 500$ على الشركة الخاطئة. قراءة أساسية.',
    testimonial3Name: 'جيمس ر.',
    testimonial3Role: 'متداول سوينغ',
    readyToFind: 'هل أنت مستعد لإيجاد شركة التداول المثالية؟',
    downloadNowStart: 'حمّل الدليل المجاني الآن وابدأ رحلة التداول الممول بالطريقة الصحيحة.',
    getFreeGuideNow: 'احصل على الدليل المجاني الآن',
  },
  hi: {
    freeGuide: 'मुफ्त 40+ पेज गाइड',
    heroTitle1: 'कैसे चुनें',
    heroTitle2: 'परफेक्ट प्रॉप फर्म',
    heroTitle3: '2026 में',
    heroDescription: 'गलत प्रॉप फर्म्स पर पैसा बर्बाद करना बंद करें। हमारी व्यापक गाइड बताती है कि क्या देखना है, किन खतरे के संकेतों से बचना है, और हर ट्रेडिंग स्टाइल के लिए हमारी शीर्ष पसंद।',
    benefit1: 'खराब चॉइस से बचकर $500+ बचाएं',
    benefit2: '30+ घंटे की रिसर्च संक्षेप में',
    benefit3: '5,000+ ट्रेडर्स द्वारा उपयोग',
    benefit4: '2026 के लिए अपडेटेड',
    socialProof: 'दुनिया भर में 5,000+ ट्रेडर्स द्वारा विश्वसनीय',
    getYourFreeGuide: 'अपनी मुफ्त गाइड पाएं',
    enterEmailToDownload: 'तुरंत डाउनलोड के लिए ईमेल दर्ज करें',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    downloadFreeGuide: 'मुफ्त गाइड डाउनलोड करें',
    processing: 'प्रोसेसिंग...',
    byDownloading: 'डाउनलोड करके, आप कभी-कभी ईमेल प्राप्त करने के लिए सहमत हैं। कभी भी अनसब्सक्राइब करें।',
    guideReady: 'आपकी गाइड तैयार है! 🎉',
    clickToDownload: 'अपनी मुफ्त गाइड डाउनलोड करने के लिए नीचे क्लिक करें',
    downloadPdfNow: 'अभी PDF डाउनलोड करें',
    problemsDownloading: 'डाउनलोड में समस्या?',
    openInNewTab: 'नए टैब में खोलें',
    validEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    networkError: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
    yourGuideReady: 'आपकी गाइड तैयार है!',
    whatsInside: 'गाइड में क्या है',
    whatsInsideDesc: 'सूचित निर्णय लेने और अपनी ट्रेडिंग स्टाइल के लिए परफेक्ट प्रॉप फर्म खोजने के लिए आपको जो कुछ भी जानने की जरूरत है।',
    chapter: 'अध्याय',
    chapter1Title: 'प्रॉप फर्म्स को समझना',
    chapter1Desc: 'प्रॉप फर्म्स क्या हैं और कैसे काम करती हैं?',
    chapter2Title: 'चैलेंज टाइप्स समझाए गए',
    chapter2Desc: '1-स्टेप, 2-स्टेप, 3-स्टेप और इंस्टेंट फंडिंग',
    chapter3Title: 'जानने योग्य मुख्य नियम',
    chapter3Desc: 'ड्रॉडाउन, प्रॉफिट टारगेट और ट्रेडिंग नियम',
    chapter4Title: 'सही प्लेटफॉर्म चुनना',
    chapter4Desc: 'MT4, MT5, cTrader और अधिक',
    chapter5Title: 'बचने के लिए खतरे के संकेत',
    chapter5Desc: 'स्कैम प्रॉप फर्म्स कैसे पहचानें',
    chapter6Title: '2026 के लिए हमारी टॉप पिक्स',
    chapter6Desc: 'श्रेणी के अनुसार बेस्ट प्रॉप फर्म्स',
    whatTradersSay: 'ट्रेडर्स क्या कहते हैं',
    testimonial1Quote: 'इस गाइड ने मुझे स्कैम प्रॉप फर्म चुनने से बचाया। रेड फ्लैग्स सेक्शन गोल्ड है!',
    testimonial1Name: 'माइकल टी.',
    testimonial1Role: 'फॉरेक्स ट्रेडर',
    testimonial2Quote: 'आखिरकार चैलेंज टाइप्स के बीच अंतर समझ आया। पहली इवैल्यूएशन पास कर ली!',
    testimonial2Name: 'सारा के.',
    testimonial2Role: 'डे ट्रेडर',
    testimonial3Quote: 'काश गलत फर्म पर $500 बर्बाद करने से पहले यह होता। जरूरी पढ़ाई।',
    testimonial3Name: 'जेम्स आर.',
    testimonial3Role: 'स्विंग ट्रेडर',
    readyToFind: 'अपनी परफेक्ट प्रॉप फर्म खोजने के लिए तैयार?',
    downloadNowStart: 'अभी मुफ्त गाइड डाउनलोड करें और अपनी फंडेड ट्रेडिंग यात्रा सही तरीके से शुरू करें।',
    getFreeGuideNow: 'अभी मुफ्त गाइड पाएं',
  },
};

// Lien direct vers le PDF
const GUIDE_PDF_URL = '/guides/PropFirm-Guide-2026.pdf'

export default function GuidePageClient() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const t = translations[locale]
  
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Chapters with translations
  const GUIDE_CHAPTERS = [
    { number: 1, title: t.chapter1Title, description: t.chapter1Desc, icon: BookOpen },
    { number: 2, title: t.chapter2Title, description: t.chapter2Desc, icon: Target },
    { number: 3, title: t.chapter3Title, description: t.chapter3Desc, icon: Shield },
    { number: 4, title: t.chapter4Title, description: t.chapter4Desc, icon: TrendingUp },
    { number: 5, title: t.chapter5Title, description: t.chapter5Desc, icon: AlertTriangle },
    { number: 6, title: t.chapter6Title, description: t.chapter6Desc, icon: Star },
  ]

  // Benefits with translations
  const BENEFITS = [
    { icon: DollarSign, text: t.benefit1 },
    { icon: Clock, text: t.benefit2 },
    { icon: Users, text: t.benefit3 },
    { icon: Award, text: t.benefit4 },
  ]

  // Testimonials with translations
  const TESTIMONIALS = [
    { quote: t.testimonial1Quote, name: t.testimonial1Name, role: t.testimonial1Role },
    { quote: t.testimonial2Quote, name: t.testimonial2Name, role: t.testimonial2Role },
    { quote: t.testimonial3Quote, name: t.testimonial3Name, role: t.testimonial3Role },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage(t.validEmail)
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'guide' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
        return
      }

      setStatus('success')
      setMessage(t.yourGuideReady)
      localStorage.setItem('newsletter_subscribed', 'true')
    } catch {
      setStatus('error')
      setMessage(t.networkError)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                {t.freeGuide}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t.heroTitle1} <span className="text-emerald-400">{t.heroTitle2}</span> {t.heroTitle3}
              </h1>
              
              <p className="text-xl text-gray-400 mb-8">
                {t.heroDescription}
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 border-2 border-gray-900" />
                  ))}
                </div>
                <span>{t.socialProof}</span>
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t.getYourFreeGuide}</h2>
                <p className="text-gray-400">{t.enterEmailToDownload}</p>
              </div>

              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t.guideReady}</h3>
                  <p className="text-gray-400 mb-6">{t.clickToDownload}</p>
                  
                  {/* Bouton de téléchargement direct */}
                  <a
                    href={GUIDE_PDF_URL}
                    download="PropFirm-Guide-2026.pdf"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 
                              text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    {t.downloadPdfNow}
                  </a>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    {t.problemsDownloading}{' '}
                    <a 
                      href={GUIDE_PDF_URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      {t.openInNewTab}
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl
                                text-white placeholder:text-gray-500 focus:outline-none 
                                focus:border-emerald-500 transition-all"
                      disabled={status === 'loading'}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 
                              text-white font-semibold rounded-xl hover:opacity-90 
                              transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      t.processing
                    ) : (
                      <>
                        {t.downloadFreeGuide}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {message && status === 'error' && (
                    <p className="text-sm text-red-400 text-center">{message}</p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    {t.byDownloading}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t.whatsInside}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.whatsInsideDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDE_CHAPTERS.map((chapter) => (
              <div
                key={chapter.number}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <chapter.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-emerald-400 text-sm font-medium mb-1">{t.chapter} {chapter.number}</div>
                    <h3 className="text-white font-semibold mb-1">{chapter.title}</h3>
                    <p className="text-gray-400 text-sm">{chapter.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t.whatTradersSay}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t.readyToFind}</h2>
            <p className="text-gray-400 mb-6">
              {t.downloadNowStart}
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              {t.getFreeGuideNow}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
