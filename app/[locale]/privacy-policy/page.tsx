'use client'

import { usePathname } from 'next/navigation'

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
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 1, 2026',
    s1Title: '1. Introduction',
    s1p1: 'Welcome to PropFirm Scanner ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.propfirmscanner.org.',
    s1p2: 'Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.',
    s2Title: '2. Information We Collect',
    s2h1: 'Personal Information',
    s2p1: 'We may collect personal information that you voluntarily provide to us when you:',
    s2l1: 'Subscribe to our newsletter',
    s2l2: 'Download our free guide',
    s2l3: 'Create an account',
    s2l4: 'Contact us through our website',
    s2p2: 'This information may include: email address, name, and any other information you choose to provide.',
    s2h2: 'Automatically Collected Information',
    s2p3: 'When you visit our website, we automatically collect certain information about your device, including:',
    s2l5: 'IP address',
    s2l6: 'Browser type and version',
    s2l7: 'Operating system',
    s2l8: 'Pages visited and time spent',
    s2l9: 'Referring website',
    s3Title: '3. How We Use Your Information',
    s3p1: 'We use the information we collect to:',
    s3l1: 'Provide, operate, and maintain our website',
    s3l2: 'Send you our newsletter and promotional materials (with your consent)',
    s3l3: 'Respond to your comments and questions',
    s3l4: 'Analyze usage patterns to improve our website',
    s3l5: 'Protect against fraudulent or illegal activity',
    s4Title: '4. Cookies and Tracking Technologies',
    s4p1: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information.',
    s4p2: 'We use the following types of cookies:',
    s4l1: 'Essential cookies: Required for the website to function properly',
    s4l2: 'Analytics cookies: Help us understand how visitors interact with our website',
    s4l3: 'Marketing cookies: Used to track visitors across websites for advertising purposes',
    s5Title: '5. Third-Party Services',
    s5p1: 'We may use third-party services that collect information, including:',
    s5l1: 'Google Analytics: For website analytics',
    s5l2: 'Mailchimp: For email newsletter management',
    s5l3: 'Vercel: For website hosting',
    s5l4: 'Supabase: For database services',
    s5p2: 'These third parties have their own privacy policies.',
    s6Title: '6. Affiliate Disclosure',
    s6p1: 'PropFirm Scanner participates in affiliate programs. We may earn a commission when you click on links and make a purchase at no additional cost to you.',
    s6p2: 'Our reviews and comparisons are based on objective criteria and are not influenced by affiliate relationships.',
    s7Title: '7. Data Retention',
    s7p1: 'We retain your personal information only for as long as necessary. When you unsubscribe from our newsletter, we will remove your email within 30 days.',
    s8Title: '8. Your Rights',
    s8p1: 'You have the right to:',
    s8l1: 'Access the personal information we hold about you',
    s8l2: 'Request correction of inaccurate information',
    s8l3: 'Request deletion of your personal information',
    s8l4: 'Opt-out of marketing communications',
    s8l5: 'Withdraw consent at any time',
    s8p2: 'To exercise any of these rights, please contact us at privacy@propfirmscanner.org.',
    s9Title: "9. Children's Privacy",
    s9p1: 'Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children.',
    s10Title: '10. Changes to This Policy',
    s10p1: 'We may update this privacy policy from time to time. We will notify you by posting the new policy on this page.',
    s11Title: '11. Contact Us',
    s11p1: 'If you have any questions about this Privacy Policy, please contact us at:',
    email: 'Email',
    website: 'Website',
  },
  fr: {
    title: 'Politique de Confidentialité',
    lastUpdated: 'Dernière mise à jour : 1er janvier 2026',
    s1Title: '1. Introduction',
    s1p1: 'Bienvenue sur PropFirm Scanner ("nous", "notre"). Nous nous engageons à protéger votre vie privée et vos informations personnelles. Cette Politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez www.propfirmscanner.org.',
    s1p2: 'Veuillez lire attentivement cette politique. Si vous n\'acceptez pas les termes, veuillez ne pas accéder au site.',
    s2Title: '2. Informations que Nous Collectons',
    s2h1: 'Informations Personnelles',
    s2p1: 'Nous pouvons collecter des informations que vous fournissez volontairement :',
    s2l1: 'Abonnement à notre newsletter',
    s2l2: 'Téléchargement de notre guide gratuit',
    s2l3: 'Création d\'un compte',
    s2l4: 'Contact via notre site',
    s2p2: 'Ces informations peuvent inclure : adresse email, nom et toute autre information fournie.',
    s2h2: 'Informations Collectées Automatiquement',
    s2p3: 'Lors de votre visite, nous collectons automatiquement :',
    s2l5: 'Adresse IP',
    s2l6: 'Type et version du navigateur',
    s2l7: 'Système d\'exploitation',
    s2l8: 'Pages visitées et temps passé',
    s2l9: 'Site de référence',
    s3Title: '3. Comment Nous Utilisons Vos Informations',
    s3p1: 'Nous utilisons les informations pour :',
    s3l1: 'Fournir et maintenir notre site',
    s3l2: 'Envoyer newsletter et matériel promotionnel (avec consentement)',
    s3l3: 'Répondre à vos commentaires et questions',
    s3l4: 'Analyser les modèles d\'utilisation',
    s3l5: 'Protéger contre les activités frauduleuses',
    s4Title: '4. Cookies et Technologies de Suivi',
    s4p1: 'Nous utilisons des cookies et technologies similaires pour suivre l\'activité sur notre site.',
    s4p2: 'Types de cookies utilisés :',
    s4l1: 'Cookies essentiels : Nécessaires au fonctionnement du site',
    s4l2: 'Cookies analytiques : Pour comprendre l\'interaction des visiteurs',
    s4l3: 'Cookies marketing : Pour le suivi publicitaire',
    s5Title: '5. Services Tiers',
    s5p1: 'Nous pouvons utiliser des services tiers :',
    s5l1: 'Google Analytics : Pour l\'analyse',
    s5l2: 'Mailchimp : Pour la gestion de newsletter',
    s5l3: 'Vercel : Pour l\'hébergement',
    s5l4: 'Supabase : Pour la base de données',
    s5p2: 'Ces tiers ont leurs propres politiques de confidentialité.',
    s6Title: '6. Divulgation d\'Affiliation',
    s6p1: 'PropFirm Scanner participe à des programmes d\'affiliation. Nous pouvons gagner une commission sans frais supplémentaires pour vous.',
    s6p2: 'Nos avis sont basés sur des critères objectifs et non influencés par les relations d\'affiliation.',
    s7Title: '7. Conservation des Données',
    s7p1: 'Nous conservons vos informations uniquement le temps nécessaire. Lors de désabonnement, nous supprimons votre email sous 30 jours.',
    s8Title: '8. Vos Droits',
    s8p1: 'Vous avez le droit de :',
    s8l1: 'Accéder à vos informations personnelles',
    s8l2: 'Demander la correction des informations inexactes',
    s8l3: 'Demander la suppression de vos informations',
    s8l4: 'Vous désabonner des communications marketing',
    s8l5: 'Retirer votre consentement à tout moment',
    s8p2: 'Contactez-nous à privacy@propfirmscanner.org.',
    s9Title: '9. Confidentialité des Enfants',
    s9p1: 'Notre site n\'est pas destiné aux enfants de moins de 18 ans. Nous ne collectons pas sciemment d\'informations auprès d\'enfants.',
    s10Title: '10. Modifications de Cette Politique',
    s10p1: 'Nous pouvons mettre à jour cette politique. Nous vous informerons en publiant la nouvelle politique sur cette page.',
    s11Title: '11. Nous Contacter',
    s11p1: 'Pour toute question concernant cette Politique, contactez-nous :',
    email: 'Email',
    website: 'Site web',
  },
  de: {
    title: 'Datenschutzrichtlinie',
    lastUpdated: 'Zuletzt aktualisiert: 1. Januar 2026',
    s1Title: '1. Einleitung',
    s1p1: 'Willkommen bei PropFirm Scanner. Wir sind dem Schutz Ihrer Privatsphäre verpflichtet. Diese Richtlinie erklärt, wie wir Ihre Informationen erfassen und schützen.',
    s1p2: 'Bitte lesen Sie diese Richtlinie sorgfältig. Wenn Sie nicht einverstanden sind, greifen Sie bitte nicht auf die Website zu.',
    s2Title: '2. Informationen, die Wir Erfassen',
    s2h1: 'Persönliche Informationen',
    s2p1: 'Wir können Informationen erfassen, die Sie freiwillig bereitstellen:',
    s2l1: 'Newsletter-Abonnement',
    s2l2: 'Download unseres kostenlosen Guides',
    s2l3: 'Kontoerstellung',
    s2l4: 'Kontaktaufnahme über unsere Website',
    s2p2: 'Diese Informationen können umfassen: E-Mail-Adresse, Name und andere Informationen.',
    s2h2: 'Automatisch Erfasste Informationen',
    s2p3: 'Beim Besuch erfassen wir automatisch:',
    s2l5: 'IP-Adresse',
    s2l6: 'Browsertyp und -version',
    s2l7: 'Betriebssystem',
    s2l8: 'Besuchte Seiten und verbrachte Zeit',
    s2l9: 'Verweisende Website',
    s3Title: '3. Wie Wir Ihre Informationen Verwenden',
    s3p1: 'Wir verwenden die Informationen, um:',
    s3l1: 'Unsere Website bereitzustellen und zu warten',
    s3l2: 'Newsletter und Werbematerialien zu senden (mit Zustimmung)',
    s3l3: 'Auf Kommentare und Fragen zu antworten',
    s3l4: 'Nutzungsmuster zu analysieren',
    s3l5: 'Gegen betrügerische Aktivitäten zu schützen',
    s4Title: '4. Cookies und Tracking-Technologien',
    s4p1: 'Wir verwenden Cookies und ähnliche Technologien, um die Aktivität zu verfolgen.',
    s4p2: 'Verwendete Cookie-Arten:',
    s4l1: 'Wesentliche Cookies: Erforderlich für die Funktion der Website',
    s4l2: 'Analyse-Cookies: Zum Verständnis der Besucherinteraktion',
    s4l3: 'Marketing-Cookies: Für Werbezwecke',
    s5Title: '5. Drittanbieter-Dienste',
    s5p1: 'Wir können Drittanbieter-Dienste nutzen:',
    s5l1: 'Google Analytics: Für Analysen',
    s5l2: 'Mailchimp: Für Newsletter-Management',
    s5l3: 'Vercel: Für Hosting',
    s5l4: 'Supabase: Für Datenbankdienste',
    s5p2: 'Diese Drittanbieter haben eigene Datenschutzrichtlinien.',
    s6Title: '6. Affiliate-Offenlegung',
    s6p1: 'PropFirm Scanner nimmt an Affiliate-Programmen teil. Wir können eine Provision erhalten, ohne zusätzliche Kosten für Sie.',
    s6p2: 'Unsere Bewertungen basieren auf objektiven Kriterien.',
    s7Title: '7. Datenspeicherung',
    s7p1: 'Wir speichern Ihre Informationen nur so lange wie nötig. Bei Abmeldung entfernen wir Ihre E-Mail innerhalb von 30 Tagen.',
    s8Title: '8. Ihre Rechte',
    s8p1: 'Sie haben das Recht:',
    s8l1: 'Auf Ihre persönlichen Informationen zuzugreifen',
    s8l2: 'Korrektur ungenauer Informationen zu verlangen',
    s8l3: 'Löschung Ihrer Informationen zu verlangen',
    s8l4: 'Marketing-Kommunikation abzulehnen',
    s8l5: 'Ihre Einwilligung jederzeit zu widerrufen',
    s8p2: 'Kontaktieren Sie uns unter privacy@propfirmscanner.org.',
    s9Title: '9. Datenschutz für Kinder',
    s9p1: 'Unsere Website ist nicht für Kinder unter 18 Jahren bestimmt. Wir erfassen wissentlich keine Informationen von Kindern.',
    s10Title: '10. Änderungen dieser Richtlinie',
    s10p1: 'Wir können diese Richtlinie aktualisieren. Wir informieren Sie durch Veröffentlichung auf dieser Seite.',
    s11Title: '11. Kontaktieren Sie Uns',
    s11p1: 'Bei Fragen zu dieser Datenschutzrichtlinie kontaktieren Sie uns:',
    email: 'E-Mail',
    website: 'Website',
  },
  es: {
    title: 'Política de Privacidad',
    lastUpdated: 'Última actualización: 1 de enero de 2026',
    s1Title: '1. Introducción',
    s1p1: 'Bienvenido a PropFirm Scanner. Estamos comprometidos a proteger su privacidad. Esta Política explica cómo recopilamos y protegemos su información.',
    s1p2: 'Por favor lea esta política cuidadosamente. Si no está de acuerdo, por favor no acceda al sitio.',
    s2Title: '2. Información que Recopilamos',
    s2h1: 'Información Personal',
    s2p1: 'Podemos recopilar información que nos proporciona voluntariamente:',
    s2l1: 'Suscripción a nuestro boletín',
    s2l2: 'Descarga de nuestra guía gratuita',
    s2l3: 'Creación de cuenta',
    s2l4: 'Contacto a través del sitio',
    s2p2: 'Esta información puede incluir: correo electrónico, nombre y otra información.',
    s2h2: 'Información Recopilada Automáticamente',
    s2p3: 'Al visitar, recopilamos automáticamente:',
    s2l5: 'Dirección IP',
    s2l6: 'Tipo y versión del navegador',
    s2l7: 'Sistema operativo',
    s2l8: 'Páginas visitadas y tiempo',
    s2l9: 'Sitio de referencia',
    s3Title: '3. Cómo Usamos Su Información',
    s3p1: 'Usamos la información para:',
    s3l1: 'Proporcionar y mantener nuestro sitio',
    s3l2: 'Enviar boletín y materiales promocionales (con consentimiento)',
    s3l3: 'Responder a comentarios y preguntas',
    s3l4: 'Analizar patrones de uso',
    s3l5: 'Proteger contra actividad fraudulenta',
    s4Title: '4. Cookies y Tecnologías de Seguimiento',
    s4p1: 'Usamos cookies y tecnologías similares para rastrear actividad.',
    s4p2: 'Tipos de cookies utilizadas:',
    s4l1: 'Cookies esenciales: Necesarias para el funcionamiento',
    s4l2: 'Cookies de análisis: Para entender la interacción',
    s4l3: 'Cookies de marketing: Para fines publicitarios',
    s5Title: '5. Servicios de Terceros',
    s5p1: 'Podemos usar servicios de terceros:',
    s5l1: 'Google Analytics: Para análisis',
    s5l2: 'Mailchimp: Para gestión de boletín',
    s5l3: 'Vercel: Para alojamiento',
    s5l4: 'Supabase: Para base de datos',
    s5p2: 'Estos terceros tienen sus propias políticas de privacidad.',
    s6Title: '6. Divulgación de Afiliados',
    s6p1: 'PropFirm Scanner participa en programas de afiliados. Podemos ganar comisión sin costo extra para usted.',
    s6p2: 'Nuestras reseñas se basan en criterios objetivos.',
    s7Title: '7. Retención de Datos',
    s7p1: 'Conservamos su información solo el tiempo necesario. Al cancelar suscripción, eliminaremos su email en 30 días.',
    s8Title: '8. Sus Derechos',
    s8p1: 'Tiene derecho a:',
    s8l1: 'Acceder a su información personal',
    s8l2: 'Solicitar corrección de información inexacta',
    s8l3: 'Solicitar eliminación de información',
    s8l4: 'Cancelar comunicaciones de marketing',
    s8l5: 'Retirar consentimiento en cualquier momento',
    s8p2: 'Contáctenos en privacy@propfirmscanner.org.',
    s9Title: '9. Privacidad de Niños',
    s9p1: 'Nuestro sitio no está dirigido a menores de 18 años. No recopilamos intencionalmente información de niños.',
    s10Title: '10. Cambios a Esta Política',
    s10p1: 'Podemos actualizar esta política. Le notificaremos publicando la nueva política en esta página.',
    s11Title: '11. Contáctenos',
    s11p1: 'Si tiene preguntas sobre esta Política de Privacidad, contáctenos:',
    email: 'Correo',
    website: 'Sitio web',
  },
  pt: {
    title: 'Política de Privacidade',
    lastUpdated: 'Última atualização: 1 de janeiro de 2026',
    s1Title: '1. Introdução',
    s1p1: 'Bem-vindo ao PropFirm Scanner. Estamos comprometidos em proteger sua privacidade. Esta Política explica como coletamos e protegemos suas informações.',
    s1p2: 'Por favor, leia esta política com atenção. Se você não concordar, por favor não acesse o site.',
    s2Title: '2. Informações que Coletamos',
    s2h1: 'Informações Pessoais',
    s2p1: 'Podemos coletar informações que você fornece voluntariamente:',
    s2l1: 'Inscrição em nossa newsletter',
    s2l2: 'Download do nosso guia gratuito',
    s2l3: 'Criação de conta',
    s2l4: 'Contato através do site',
    s2p2: 'Essas informações podem incluir: email, nome e outras informações.',
    s2h2: 'Informações Coletadas Automaticamente',
    s2p3: 'Ao visitar, coletamos automaticamente:',
    s2l5: 'Endereço IP',
    s2l6: 'Tipo e versão do navegador',
    s2l7: 'Sistema operacional',
    s2l8: 'Páginas visitadas e tempo',
    s2l9: 'Site de referência',
    s3Title: '3. Como Usamos Suas Informações',
    s3p1: 'Usamos as informações para:',
    s3l1: 'Fornecer e manter nosso site',
    s3l2: 'Enviar newsletter e materiais promocionais (com consentimento)',
    s3l3: 'Responder comentários e perguntas',
    s3l4: 'Analisar padrões de uso',
    s3l5: 'Proteger contra atividade fraudulenta',
    s4Title: '4. Cookies e Tecnologias de Rastreamento',
    s4p1: 'Usamos cookies e tecnologias similares para rastrear atividade.',
    s4p2: 'Tipos de cookies utilizados:',
    s4l1: 'Cookies essenciais: Necessários para funcionamento',
    s4l2: 'Cookies de análise: Para entender interação',
    s4l3: 'Cookies de marketing: Para fins publicitários',
    s5Title: '5. Serviços de Terceiros',
    s5p1: 'Podemos usar serviços de terceiros:',
    s5l1: 'Google Analytics: Para análise',
    s5l2: 'Mailchimp: Para gestão de newsletter',
    s5l3: 'Vercel: Para hospedagem',
    s5l4: 'Supabase: Para banco de dados',
    s5p2: 'Esses terceiros têm suas próprias políticas de privacidade.',
    s6Title: '6. Divulgação de Afiliados',
    s6p1: 'PropFirm Scanner participa de programas de afiliados. Podemos ganhar comissão sem custo extra para você.',
    s6p2: 'Nossas avaliações são baseadas em critérios objetivos.',
    s7Title: '7. Retenção de Dados',
    s7p1: 'Retemos suas informações apenas pelo tempo necessário. Ao cancelar inscrição, removeremos seu email em 30 dias.',
    s8Title: '8. Seus Direitos',
    s8p1: 'Você tem direito a:',
    s8l1: 'Acessar suas informações pessoais',
    s8l2: 'Solicitar correção de informações imprecisas',
    s8l3: 'Solicitar exclusão de informações',
    s8l4: 'Cancelar comunicações de marketing',
    s8l5: 'Retirar consentimento a qualquer momento',
    s8p2: 'Entre em contato em privacy@propfirmscanner.org.',
    s9Title: '9. Privacidade de Crianças',
    s9p1: 'Nosso site não é destinado a menores de 18 anos. Não coletamos intencionalmente informações de crianças.',
    s10Title: '10. Alterações a Esta Política',
    s10p1: 'Podemos atualizar esta política. Notificaremos você publicando a nova política nesta página.',
    s11Title: '11. Entre em Contato',
    s11p1: 'Se você tiver perguntas sobre esta Política de Privacidade, entre em contato:',
    email: 'Email',
    website: 'Site',
  },
  ar: {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: 1 يناير 2026',
    s1Title: '1. المقدمة',
    s1p1: 'مرحباً بكم في PropFirm Scanner. نحن ملتزمون بحماية خصوصيتك. توضح هذه السياسة كيف نجمع ونحمي معلوماتك.',
    s1p2: 'يرجى قراءة هذه السياسة بعناية. إذا كنت لا توافق، يرجى عدم الوصول إلى الموقع.',
    s2Title: '2. المعلومات التي نجمعها',
    s2h1: 'المعلومات الشخصية',
    s2p1: 'قد نجمع معلومات تقدمها طواعية:',
    s2l1: 'الاشتراك في النشرة الإخبارية',
    s2l2: 'تنزيل دليلنا المجاني',
    s2l3: 'إنشاء حساب',
    s2l4: 'الاتصال عبر الموقع',
    s2p2: 'قد تشمل: البريد الإلكتروني والاسم ومعلومات أخرى.',
    s2h2: 'المعلومات المجمعة تلقائياً',
    s2p3: 'عند الزيارة، نجمع تلقائياً:',
    s2l5: 'عنوان IP',
    s2l6: 'نوع وإصدار المتصفح',
    s2l7: 'نظام التشغيل',
    s2l8: 'الصفحات والوقت',
    s2l9: 'الموقع المُحيل',
    s3Title: '3. كيف نستخدم معلوماتك',
    s3p1: 'نستخدم المعلومات من أجل:',
    s3l1: 'توفير وصيانة موقعنا',
    s3l2: 'إرسال النشرة والمواد الترويجية (بموافقتك)',
    s3l3: 'الرد على تعليقاتك وأسئلتك',
    s3l4: 'تحليل أنماط الاستخدام',
    s3l5: 'الحماية من النشاط الاحتيالي',
    s4Title: '4. ملفات تعريف الارتباط',
    s4p1: 'نستخدم ملفات تعريف الارتباط وتقنيات مماثلة لتتبع النشاط.',
    s4p2: 'الأنواع المستخدمة:',
    s4l1: 'ملفات أساسية: مطلوبة للعمل',
    s4l2: 'ملفات تحليلية: لفهم التفاعل',
    s4l3: 'ملفات تسويقية: لأغراض إعلانية',
    s5Title: '5. خدمات الطرف الثالث',
    s5p1: 'قد نستخدم خدمات طرف ثالث:',
    s5l1: 'Google Analytics: للتحليلات',
    s5l2: 'Mailchimp: لإدارة النشرة',
    s5l3: 'Vercel: للاستضافة',
    s5l4: 'Supabase: لقاعدة البيانات',
    s5p2: 'لدى هذه الأطراف سياسات خصوصية خاصة.',
    s6Title: '6. الإفصاح عن الشركاء',
    s6p1: 'يشارك PropFirm Scanner في برامج الشراكة. قد نكسب عمولة بدون تكلفة إضافية عليك.',
    s6p2: 'تستند مراجعاتنا إلى معايير موضوعية.',
    s7Title: '7. الاحتفاظ بالبيانات',
    s7p1: 'نحتفظ بمعلوماتك فقط للمدة اللازمة. عند إلغاء الاشتراك، سنحذف بريدك في 30 يوماً.',
    s8Title: '8. حقوقك',
    s8p1: 'لديك الحق في:',
    s8l1: 'الوصول إلى معلوماتك الشخصية',
    s8l2: 'طلب تصحيح المعلومات غير الدقيقة',
    s8l3: 'طلب حذف معلوماتك',
    s8l4: 'إلغاء الاتصالات التسويقية',
    s8l5: 'سحب موافقتك في أي وقت',
    s8p2: 'اتصل بنا على privacy@propfirmscanner.org.',
    s9Title: '9. خصوصية الأطفال',
    s9p1: 'موقعنا غير مخصص للأطفال دون 18 عاماً. نحن لا نجمع عن قصد معلومات من الأطفال.',
    s10Title: '10. التغييرات على هذه السياسة',
    s10p1: 'قد نحدث هذه السياسة. سنخطرك بنشر السياسة الجديدة.',
    s11Title: '11. اتصل بنا',
    s11p1: 'إذا كانت لديك أسئلة، اتصل بنا:',
    email: 'البريد الإلكتروني',
    website: 'الموقع',
  },
  hi: {
    title: 'गोपनीयता नीति',
    lastUpdated: 'अंतिम अपडेट: 1 जनवरी 2026',
    s1Title: '1. परिचय',
    s1p1: 'PropFirm Scanner में आपका स्वागत है। हम आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध हैं। यह नीति बताती है कि हम आपकी जानकारी कैसे एकत्र और सुरक्षित करते हैं।',
    s1p2: 'कृपया इस नीति को ध्यान से पढ़ें। यदि आप सहमत नहीं हैं, तो कृपया साइट पर न जाएं।',
    s2Title: '2. हम जो जानकारी एकत्र करते हैं',
    s2h1: 'व्यक्तिगत जानकारी',
    s2p1: 'हम वह जानकारी एकत्र कर सकते हैं जो आप स्वेच्छा से प्रदान करते हैं:',
    s2l1: 'न्यूज़लेटर सदस्यता',
    s2l2: 'मुफ्त गाइड डाउनलोड',
    s2l3: 'अकाउंट बनाना',
    s2l4: 'साइट के माध्यम से संपर्क',
    s2p2: 'इसमें शामिल हो सकते हैं: ईमेल, नाम और अन्य जानकारी।',
    s2h2: 'स्वचालित रूप से एकत्रित जानकारी',
    s2p3: 'विज़िट पर, हम स्वचालित रूप से एकत्र करते हैं:',
    s2l5: 'IP पता',
    s2l6: 'ब्राउज़र प्रकार और संस्करण',
    s2l7: 'ऑपरेटिंग सिस्टम',
    s2l8: 'देखे गए पेज और समय',
    s2l9: 'रेफ़रिंग वेबसाइट',
    s3Title: '3. हम आपकी जानकारी का उपयोग कैसे करते हैं',
    s3p1: 'हम जानकारी का उपयोग करते हैं:',
    s3l1: 'हमारी साइट प्रदान और बनाए रखने के लिए',
    s3l2: 'न्यूज़लेटर और प्रचार सामग्री भेजने के लिए (सहमति से)',
    s3l3: 'टिप्पणियों और प्रश्नों का जवाब देने के लिए',
    s3l4: 'उपयोग पैटर्न का विश्लेषण करने के लिए',
    s3l5: 'धोखाधड़ी से बचाने के लिए',
    s4Title: '4. कुकीज़ और ट्रैकिंग तकनीकें',
    s4p1: 'हम गतिविधि को ट्रैक करने के लिए कुकीज़ और समान तकनीकों का उपयोग करते हैं।',
    s4p2: 'उपयोग किए जाने वाले प्रकार:',
    s4l1: 'आवश्यक कुकीज़: काम करने के लिए आवश्यक',
    s4l2: 'एनालिटिक्स कुकीज़: इंटरैक्शन समझने के लिए',
    s4l3: 'मार्केटिंग कुकीज़: विज्ञापन उद्देश्यों के लिए',
    s5Title: '5. तृतीय-पक्ष सेवाएं',
    s5p1: 'हम तृतीय-पक्ष सेवाओं का उपयोग कर सकते हैं:',
    s5l1: 'Google Analytics: एनालिटिक्स के लिए',
    s5l2: 'Mailchimp: न्यूज़लेटर प्रबंधन के लिए',
    s5l3: 'Vercel: होस्टिंग के लिए',
    s5l4: 'Supabase: डेटाबेस के लिए',
    s5p2: 'इन तृतीय पक्षों की अपनी गोपनीयता नीतियां हैं।',
    s6Title: '6. एफिलिएट प्रकटीकरण',
    s6p1: 'PropFirm Scanner एफिलिएट प्रोग्राम में भाग लेता है। हम बिना अतिरिक्त लागत के कमीशन कमा सकते हैं।',
    s6p2: 'हमारी समीक्षाएं वस्तुनिष्ठ मानदंडों पर आधारित हैं।',
    s7Title: '7. डेटा प्रतिधारण',
    s7p1: 'हम आपकी जानकारी केवल आवश्यक समय तक रखते हैं। सदस्यता रद्द करने पर, हम 30 दिनों में आपका ईमेल हटा देंगे।',
    s8Title: '8. आपके अधिकार',
    s8p1: 'आपके पास अधिकार है:',
    s8l1: 'अपनी व्यक्तिगत जानकारी तक पहुंचने का',
    s8l2: 'गलत जानकारी के सुधार का अनुरोध करने का',
    s8l3: 'जानकारी हटाने का अनुरोध करने का',
    s8l4: 'मार्केटिंग संचार से ऑप्ट-आउट करने का',
    s8l5: 'किसी भी समय सहमति वापस लेने का',
    s8p2: 'privacy@propfirmscanner.org पर संपर्क करें।',
    s9Title: '9. बच्चों की गोपनीयता',
    s9p1: 'हमारी साइट 18 वर्ष से कम उम्र के बच्चों के लिए नहीं है। हम जानबूझकर बच्चों से जानकारी एकत्र नहीं करते।',
    s10Title: '10. इस नीति में परिवर्तन',
    s10p1: 'हम इस नीति को अपडेट कर सकते हैं। हम इस पेज पर नई नीति पोस्ट करके आपको सूचित करेंगे।',
    s11Title: '11. हमसे संपर्क करें',
    s11p1: 'यदि आपके पास प्रश्न हैं, संपर्क करें:',
    email: 'ईमेल',
    website: 'वेबसाइट',
  },
};

export default function PrivacyPolicyPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.lastUpdated}</p>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s1Title}</h2>
            <p className="text-gray-300 mb-4">{t.s1p1}</p>
            <p className="text-gray-300">{t.s1p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s2Title}</h2>
            <h3 className="text-xl font-medium text-white mb-3">{t.s2h1}</h3>
            <p className="text-gray-300 mb-4">{t.s2p1}</p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li>{t.s2l1}</li>
              <li>{t.s2l2}</li>
              <li>{t.s2l3}</li>
              <li>{t.s2l4}</li>
            </ul>
            <p className="text-gray-300 mb-4">{t.s2p2}</p>
            <h3 className="text-xl font-medium text-white mb-3">{t.s2h2}</h3>
            <p className="text-gray-300 mb-4">{t.s2p3}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t.s2l5}</li>
              <li>{t.s2l6}</li>
              <li>{t.s2l7}</li>
              <li>{t.s2l8}</li>
              <li>{t.s2l9}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s3Title}</h2>
            <p className="text-gray-300 mb-4">{t.s3p1}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t.s3l1}</li>
              <li>{t.s3l2}</li>
              <li>{t.s3l3}</li>
              <li>{t.s3l4}</li>
              <li>{t.s3l5}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s4Title}</h2>
            <p className="text-gray-300 mb-4">{t.s4p1}</p>
            <p className="text-gray-300 mb-4">{t.s4p2}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>{t.s4l1.split(':')[0]}:</strong>{t.s4l1.split(':')[1]}</li>
              <li><strong>{t.s4l2.split(':')[0]}:</strong>{t.s4l2.split(':')[1]}</li>
              <li><strong>{t.s4l3.split(':')[0]}:</strong>{t.s4l3.split(':')[1]}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s5Title}</h2>
            <p className="text-gray-300 mb-4">{t.s5p1}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>{t.s5l1.split(':')[0]}:</strong>{t.s5l1.split(':')[1]}</li>
              <li><strong>{t.s5l2.split(':')[0]}:</strong>{t.s5l2.split(':')[1]}</li>
              <li><strong>{t.s5l3.split(':')[0]}:</strong>{t.s5l3.split(':')[1]}</li>
              <li><strong>{t.s5l4.split(':')[0]}:</strong>{t.s5l4.split(':')[1]}</li>
            </ul>
            <p className="text-gray-300 mt-4">{t.s5p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s6Title}</h2>
            <p className="text-gray-300 mb-4">{t.s6p1}</p>
            <p className="text-gray-300">{t.s6p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s7Title}</h2>
            <p className="text-gray-300">{t.s7p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s8Title}</h2>
            <p className="text-gray-300 mb-4">{t.s8p1}</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>{t.s8l1}</li>
              <li>{t.s8l2}</li>
              <li>{t.s8l3}</li>
              <li>{t.s8l4}</li>
              <li>{t.s8l5}</li>
            </ul>
            <p className="text-gray-300 mt-4">{t.s8p2}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s9Title}</h2>
            <p className="text-gray-300">{t.s9p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s10Title}</h2>
            <p className="text-gray-300">{t.s10p1}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">{t.s11Title}</h2>
            <p className="text-gray-300">{t.s11p1}</p>
            <p className="text-gray-300 mt-4">
              <strong>{t.email}:</strong> privacy@propfirmscanner.org<br />
              <strong>{t.website}:</strong> www.propfirmscanner.org
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
