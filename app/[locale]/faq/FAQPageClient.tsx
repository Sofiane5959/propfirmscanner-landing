'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChevronDown, HelpCircle, Search, MessageCircle,
  DollarSign, Target, Shield, TrendingDown, Clock
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
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about prop trading firms and challenges',
    searchPlaceholder: 'Search questions...',
    all: 'All',
    noResults: 'No results found',
    tryDifferent: 'Try a different search term',
    stillQuestions: 'Still have questions?',
    cantFind: "Can't find what you're looking for? We're here to help.",
    contactSupport: 'Contact Support',
    quickMatch: 'Quick Match',
    findIdealFirm: 'Find your ideal firm',
    compareFirms: 'Compare Firms',
    sideBySide: 'Side-by-side comparison',
    freeGuide: 'Free Guide',
    downloadGuide: 'Download our guide',
    // Categories
    catGeneral: 'General Questions',
    catChallenges: 'Prop Firm Challenges',
    catRules: 'Trading Rules',
    catPayouts: 'Payouts & Profits',
    catChoosing: 'Choosing a Prop Firm',
  },
  fr: {
    title: 'Questions Fréquentes',
    subtitle: 'Tout ce que vous devez savoir sur les prop firms et les challenges',
    searchPlaceholder: 'Rechercher des questions...',
    all: 'Tout',
    noResults: 'Aucun résultat trouvé',
    tryDifferent: 'Essayez un autre terme de recherche',
    stillQuestions: 'Encore des questions ?',
    cantFind: 'Vous ne trouvez pas ce que vous cherchez ? Nous sommes là pour vous aider.',
    contactSupport: 'Contacter le Support',
    quickMatch: 'Quick Match',
    findIdealFirm: 'Trouvez votre firm idéale',
    compareFirms: 'Comparer les Firms',
    sideBySide: 'Comparaison côte à côte',
    freeGuide: 'Guide Gratuit',
    downloadGuide: 'Téléchargez notre guide',
    catGeneral: 'Questions Générales',
    catChallenges: 'Challenges Prop Firm',
    catRules: 'Règles de Trading',
    catPayouts: 'Paiements & Profits',
    catChoosing: 'Choisir une Prop Firm',
  },
  de: {
    title: 'Häufig Gestellte Fragen',
    subtitle: 'Alles, was Sie über Prop-Trading-Firmen und Challenges wissen müssen',
    searchPlaceholder: 'Fragen suchen...',
    all: 'Alle',
    noResults: 'Keine Ergebnisse gefunden',
    tryDifferent: 'Versuchen Sie einen anderen Suchbegriff',
    stillQuestions: 'Noch Fragen?',
    cantFind: 'Nicht gefunden, was Sie suchen? Wir helfen Ihnen gerne.',
    contactSupport: 'Support Kontaktieren',
    quickMatch: 'Quick Match',
    findIdealFirm: 'Finden Sie Ihre ideale Firma',
    compareFirms: 'Firmen Vergleichen',
    sideBySide: 'Direktvergleich',
    freeGuide: 'Kostenloser Guide',
    downloadGuide: 'Laden Sie unseren Guide herunter',
    catGeneral: 'Allgemeine Fragen',
    catChallenges: 'Prop Firm Challenges',
    catRules: 'Trading-Regeln',
    catPayouts: 'Auszahlungen & Gewinne',
    catChoosing: 'Prop Firm Wählen',
  },
  es: {
    title: 'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber sobre prop firms y challenges',
    searchPlaceholder: 'Buscar preguntas...',
    all: 'Todo',
    noResults: 'Sin resultados',
    tryDifferent: 'Intenta con otro término de búsqueda',
    stillQuestions: '¿Aún tienes preguntas?',
    cantFind: '¿No encuentras lo que buscas? Estamos aquí para ayudarte.',
    contactSupport: 'Contactar Soporte',
    quickMatch: 'Quick Match',
    findIdealFirm: 'Encuentra tu firma ideal',
    compareFirms: 'Comparar Firmas',
    sideBySide: 'Comparación lado a lado',
    freeGuide: 'Guía Gratis',
    downloadGuide: 'Descarga nuestra guía',
    catGeneral: 'Preguntas Generales',
    catChallenges: 'Challenges de Prop Firm',
    catRules: 'Reglas de Trading',
    catPayouts: 'Pagos y Ganancias',
    catChoosing: 'Elegir una Prop Firm',
  },
  pt: {
    title: 'Perguntas Frequentes',
    subtitle: 'Tudo o que você precisa saber sobre prop firms e desafios',
    searchPlaceholder: 'Buscar perguntas...',
    all: 'Todos',
    noResults: 'Nenhum resultado encontrado',
    tryDifferent: 'Tente um termo de busca diferente',
    stillQuestions: 'Ainda tem dúvidas?',
    cantFind: 'Não encontrou o que procura? Estamos aqui para ajudar.',
    contactSupport: 'Contatar Suporte',
    quickMatch: 'Quick Match',
    findIdealFirm: 'Encontre sua firma ideal',
    compareFirms: 'Comparar Firmas',
    sideBySide: 'Comparação lado a lado',
    freeGuide: 'Guia Grátis',
    downloadGuide: 'Baixe nosso guia',
    catGeneral: 'Perguntas Gerais',
    catChallenges: 'Desafios de Prop Firm',
    catRules: 'Regras de Trading',
    catPayouts: 'Pagamentos e Lucros',
    catChoosing: 'Escolher uma Prop Firm',
  },
  ar: {
    title: 'الأسئلة الشائعة',
    subtitle: 'كل ما تحتاج معرفته عن شركات التداول والتحديات',
    searchPlaceholder: 'البحث في الأسئلة...',
    all: 'الكل',
    noResults: 'لم يتم العثور على نتائج',
    tryDifferent: 'جرب مصطلح بحث مختلف',
    stillQuestions: 'لا تزال لديك أسئلة؟',
    cantFind: 'لم تجد ما تبحث عنه؟ نحن هنا للمساعدة.',
    contactSupport: 'اتصل بالدعم',
    quickMatch: 'المطابقة السريعة',
    findIdealFirm: 'اعثر على شركتك المثالية',
    compareFirms: 'مقارنة الشركات',
    sideBySide: 'مقارنة جنبًا إلى جنب',
    freeGuide: 'دليل مجاني',
    downloadGuide: 'حمّل دليلنا',
    catGeneral: 'أسئلة عامة',
    catChallenges: 'تحديات Prop Firm',
    catRules: 'قواعد التداول',
    catPayouts: 'المدفوعات والأرباح',
    catChoosing: 'اختيار Prop Firm',
  },
  hi: {
    title: 'अक्सर पूछे जाने वाले प्रश्न',
    subtitle: 'प्रॉप ट्रेडिंग फर्म्स और चैलेंज के बारे में सब कुछ',
    searchPlaceholder: 'प्रश्न खोजें...',
    all: 'सभी',
    noResults: 'कोई परिणाम नहीं मिला',
    tryDifferent: 'कोई अलग खोज शब्द आज़माएं',
    stillQuestions: 'अभी भी सवाल हैं?',
    cantFind: 'जो खोज रहे हैं वह नहीं मिला? हम मदद के लिए यहां हैं।',
    contactSupport: 'सपोर्ट से संपर्क करें',
    quickMatch: 'क्विक मैच',
    findIdealFirm: 'अपनी आदर्श फर्म खोजें',
    compareFirms: 'फर्म्स की तुलना करें',
    sideBySide: 'साथ-साथ तुलना',
    freeGuide: 'मुफ्त गाइड',
    downloadGuide: 'हमारी गाइड डाउनलोड करें',
    catGeneral: 'सामान्य प्रश्न',
    catChallenges: 'प्रॉप फर्म चैलेंज',
    catRules: 'ट्रेडिंग नियम',
    catPayouts: 'पेआउट और प्रॉफिट',
    catChoosing: 'प्रॉप फर्म चुनना',
  },
};

// =============================================================================
// FAQ DATA (Multilingual)
// =============================================================================

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  titleKey: string
  icon: typeof HelpCircle
  faqs: { questionKey: string; answerKey: string }[]
}

const faqContent: Record<Locale, Record<string, string>> = {
  en: {
    // General
    q_general_1: 'What is a prop trading firm?',
    a_general_1: 'A prop trading firm (proprietary trading firm) provides traders with capital to trade in exchange for a share of the profits. Traders typically need to pass an evaluation (challenge) to prove their skills before receiving a funded account.',
    q_general_2: 'How does PropFirm Scanner work?',
    a_general_2: 'PropFirm Scanner compares 90+ prop trading firms across key metrics like pricing, rules, profit splits, and Trustpilot ratings. We verify our data weekly and provide tools to help you find the best firm for your trading style.',
    q_general_3: 'Is PropFirm Scanner free to use?',
    a_general_3: 'Yes! All our comparison tools, calculators, and guides are completely free. We earn affiliate commissions when you sign up with a prop firm through our links, but this never affects our rankings or recommendations.',
    q_general_4: 'How do you make money?',
    a_general_4: 'We earn affiliate commissions from prop firms when traders sign up through our links. This costs you nothing extra — and often, we have exclusive discount codes that save you money. Our reviews are independent and not influenced by affiliate relationships.',
    // Challenges
    q_challenge_1: 'What is a prop firm challenge?',
    a_challenge_1: 'A challenge is an evaluation phase where you trade on a demo account and must meet specific profit targets while staying within risk limits. Pass the challenge, and you get access to a funded account with real capital.',
    q_challenge_2: 'How long does a challenge take?',
    a_challenge_2: 'Most challenges have a time limit of 30 days for Phase 1, but many firms now offer unlimited time. Some challenges require minimum trading days (usually 4-10 days) before you can pass.',
    q_challenge_3: 'What happens if I fail a challenge?',
    a_challenge_3: "If you violate any rules (like hitting max drawdown), you fail the challenge and lose your fee. Most firms offer discounted retries, and some have free reset options. Always check the specific firm's retry policy.",
    q_challenge_4: "What's the difference between 1-step and 2-step challenges?",
    a_challenge_4: '1-step challenges have only one evaluation phase before funding. 2-step challenges have two phases (often called Phase 1 and Phase 2) with different profit targets. 1-step is faster but often has stricter rules.',
    // Rules
    q_rules_1: 'What is maximum drawdown?',
    a_rules_1: 'Maximum drawdown is the most your account balance can decline from its starting point (or highest point, for trailing). If you exceed this limit, you fail the challenge. Common limits are 8-12% for max drawdown.',
    q_rules_2: "What's the difference between static and trailing drawdown?",
    a_rules_2: 'Static drawdown is calculated from your initial balance and never changes. Trailing drawdown moves up as your equity increases (but never down). Trailing is harder to manage because your "cushion" shrinks as you profit.',
    q_rules_3: 'Can I trade during news events?',
    a_rules_3: "It depends on the firm. Some allow news trading freely, others restrict it around high-impact events (like NFP or FOMC), and some ban it entirely. Always check the specific rules before trading.",
    q_rules_4: 'Can I hold trades over the weekend?',
    a_rules_4: "Many firms allow weekend holding, but some don't. Weekend holding means keeping positions open from Friday close to Monday open. Check your firm's rules, as this is a common reason for challenge failures.",
    q_rules_5: 'Are EAs and bots allowed?',
    a_rules_5: 'Most firms allow EAs (Expert Advisors) and trading bots, but some have restrictions. Copy trading and account management services are often prohibited. High-frequency trading (HFT) may also be restricted.',
    // Payouts
    q_payout_1: 'What is profit split?',
    a_payout_1: 'Profit split is how profits are divided between you and the prop firm. A typical split is 80/20 (you keep 80%). Some firms offer up to 90% or even 100% profit split, especially as you scale up.',
    q_payout_2: 'How often can I get paid?',
    a_payout_2: "Payout frequency varies by firm: some offer weekly payouts, others bi-weekly or monthly. Some firms now offer on-demand payouts. Check if there's a minimum profit threshold before requesting payouts.",
    q_payout_3: 'How do prop firms pay me?',
    a_payout_3: 'Most firms pay via bank transfer, crypto (usually USDT), PayPal, or Wise. Payment methods and processing times vary by firm. Some firms may have minimum withdrawal amounts.',
    q_payout_4: 'Do I get my challenge fee back?',
    a_payout_4: "Some firms refund your challenge fee with your first profit withdrawal (called a refundable fee). Others don't offer refunds. This can significantly affect the true cost of a challenge.",
    // Choosing
    q_choose_1: 'Which prop firm is best for beginners?',
    a_choose_1: 'For beginners, we recommend firms with simpler rules, generous drawdown limits, and good educational resources. Firms like FundedNext, FTMO, or The5%ers are popular choices for new traders.',
    q_choose_2: 'Which prop firm is best for scalpers?',
    a_choose_2: 'Scalpers should look for firms with no time restrictions on trades, tight spreads, and no rules against rapid trading. FTMO, FundedNext, and FXIFY are generally scalper-friendly.',
    q_choose_3: 'Are there prop firms for futures trading?',
    a_choose_3: 'Yes! Apex Trader Funding, Topstep, and Earn2Trade specialize in futures trading. They offer different rules and platforms compared to forex-focused firms.',
    q_choose_4: 'How do I know if a prop firm is legitimate?',
    a_choose_4: "Check their Trustpilot reviews, see how long they've been operating, look for transparent payout proof, and research their company registration. Our verified data helps identify trustworthy firms.",
  },
  fr: {
    q_general_1: "Qu'est-ce qu'une prop trading firm ?",
    a_general_1: "Une prop firm (société de trading propriétaire) fournit aux traders du capital pour trader en échange d'une part des profits. Les traders doivent généralement passer une évaluation (challenge) pour prouver leurs compétences avant de recevoir un compte financé.",
    q_general_2: 'Comment fonctionne PropFirm Scanner ?',
    a_general_2: "PropFirm Scanner compare plus de 90 prop firms sur des critères clés comme les prix, les règles, les partages de profits et les notes Trustpilot. Nous vérifions nos données chaque semaine et fournissons des outils pour vous aider à trouver la meilleure firm pour votre style de trading.",
    q_general_3: 'PropFirm Scanner est-il gratuit ?',
    a_general_3: "Oui ! Tous nos outils de comparaison, calculateurs et guides sont entièrement gratuits. Nous gagnons des commissions d'affiliation quand vous vous inscrivez via nos liens, mais cela n'affecte jamais nos classements.",
    q_general_4: 'Comment gagnez-vous de l\'argent ?',
    a_general_4: "Nous gagnons des commissions d'affiliation des prop firms quand les traders s'inscrivent via nos liens. Cela ne vous coûte rien de plus — et souvent, nous avons des codes promo exclusifs qui vous font économiser.",
    q_challenge_1: "Qu'est-ce qu'un challenge prop firm ?",
    a_challenge_1: "Un challenge est une phase d'évaluation où vous tradez sur un compte démo et devez atteindre des objectifs de profit tout en respectant les limites de risque. Réussissez le challenge et vous obtenez un compte financé avec du vrai capital.",
    q_challenge_2: 'Combien de temps dure un challenge ?',
    a_challenge_2: "La plupart des challenges ont une limite de 30 jours pour la Phase 1, mais beaucoup de firms offrent maintenant un temps illimité. Certains challenges requièrent un minimum de jours de trading (généralement 4-10 jours).",
    q_challenge_3: 'Que se passe-t-il si j\'échoue un challenge ?',
    a_challenge_3: "Si vous violez une règle (comme atteindre le drawdown max), vous échouez le challenge et perdez vos frais. La plupart des firms offrent des réessais à prix réduit, et certaines ont des options de reset gratuit.",
    q_challenge_4: 'Quelle est la différence entre les challenges 1-step et 2-step ?',
    a_challenge_4: "Les challenges 1-step n'ont qu'une seule phase d'évaluation. Les challenges 2-step ont deux phases avec des objectifs de profit différents. Le 1-step est plus rapide mais a souvent des règles plus strictes.",
    q_rules_1: "Qu'est-ce que le drawdown maximum ?",
    a_rules_1: "Le drawdown maximum est la baisse maximale que votre solde peut subir depuis son point de départ. Si vous dépassez cette limite, vous échouez le challenge. Les limites courantes sont de 8-12%.",
    q_rules_2: 'Quelle est la différence entre drawdown statique et trailing ?',
    a_rules_2: 'Le drawdown statique est calculé depuis votre solde initial et ne change jamais. Le drawdown trailing monte avec vos gains (mais ne descend jamais). Le trailing est plus difficile à gérer.',
    q_rules_3: 'Puis-je trader pendant les news ?',
    a_rules_3: "Cela dépend de la firm. Certaines autorisent librement le trading de news, d'autres le restreignent autour des événements à fort impact, et certaines l'interdisent totalement. Vérifiez toujours les règles spécifiques.",
    q_rules_4: 'Puis-je garder des trades le week-end ?',
    a_rules_4: "Beaucoup de firms autorisent le holding de week-end, mais pas toutes. Vérifiez les règles de votre firm, car c'est une raison courante d'échec aux challenges.",
    q_rules_5: 'Les EAs et bots sont-ils autorisés ?',
    a_rules_5: "La plupart des firms autorisent les EAs et bots de trading, mais certaines ont des restrictions. Le copy trading et la gestion de compte sont souvent interdits.",
    q_payout_1: "Qu'est-ce que le profit split ?",
    a_payout_1: "Le profit split est la façon dont les profits sont divisés entre vous et la prop firm. Un split typique est 80/20 (vous gardez 80%). Certaines firms offrent jusqu'à 90% ou même 100%.",
    q_payout_2: 'À quelle fréquence puis-je être payé ?',
    a_payout_2: "La fréquence de paiement varie : certaines offrent des paiements hebdomadaires, d'autres bimensuels ou mensuels. Certaines firms offrent maintenant des paiements à la demande.",
    q_payout_3: 'Comment les prop firms me paient-elles ?',
    a_payout_3: "La plupart des firms paient par virement bancaire, crypto (généralement USDT), PayPal ou Wise. Les méthodes de paiement varient selon la firm.",
    q_payout_4: 'Est-ce que je récupère mes frais de challenge ?',
    a_payout_4: "Certaines firms remboursent vos frais de challenge avec votre premier retrait de profit (frais remboursables). D'autres ne remboursent pas.",
    q_choose_1: 'Quelle prop firm est meilleure pour les débutants ?',
    a_choose_1: "Pour les débutants, nous recommandons des firms avec des règles simples, des limites de drawdown généreuses et de bonnes ressources éducatives. FundedNext, FTMO ou The5%ers sont des choix populaires.",
    q_choose_2: 'Quelle prop firm est meilleure pour les scalpers ?',
    a_choose_2: "Les scalpers devraient chercher des firms sans restrictions de temps sur les trades, avec des spreads serrés. FTMO, FundedNext et FXIFY sont généralement scalper-friendly.",
    q_choose_3: 'Y a-t-il des prop firms pour le trading de futures ?',
    a_choose_3: "Oui ! Apex Trader Funding, Topstep et Earn2Trade se spécialisent dans le trading de futures.",
    q_choose_4: 'Comment savoir si une prop firm est légitime ?',
    a_choose_4: "Vérifiez leurs avis Trustpilot, depuis combien de temps ils opèrent, cherchez des preuves de paiement transparentes et recherchez leur enregistrement.",
  },
  de: {
    q_general_1: 'Was ist eine Prop-Trading-Firma?',
    a_general_1: 'Eine Prop-Firma stellt Händlern Kapital zum Handeln zur Verfügung im Austausch für einen Anteil an den Gewinnen. Händler müssen in der Regel eine Bewertung (Challenge) bestehen, um ihre Fähigkeiten zu beweisen.',
    q_general_2: 'Wie funktioniert PropFirm Scanner?',
    a_general_2: 'PropFirm Scanner vergleicht über 90 Prop-Firmen anhand wichtiger Kennzahlen wie Preise, Regeln, Gewinnaufteilung und Trustpilot-Bewertungen.',
    q_general_3: 'Ist PropFirm Scanner kostenlos?',
    a_general_3: 'Ja! Alle unsere Vergleichstools, Rechner und Guides sind völlig kostenlos.',
    q_general_4: 'Wie verdienen Sie Geld?',
    a_general_4: 'Wir verdienen Affiliate-Provisionen von Prop-Firmen, wenn Händler sich über unsere Links anmelden.',
    q_challenge_1: 'Was ist eine Prop-Firm-Challenge?',
    a_challenge_1: 'Eine Challenge ist eine Bewertungsphase, in der Sie auf einem Demo-Konto handeln und bestimmte Gewinnziele erreichen müssen.',
    q_challenge_2: 'Wie lange dauert eine Challenge?',
    a_challenge_2: 'Die meisten Challenges haben ein Zeitlimit von 30 Tagen für Phase 1, aber viele Firmen bieten jetzt unbegrenzte Zeit an.',
    q_challenge_3: 'Was passiert, wenn ich eine Challenge nicht bestehe?',
    a_challenge_3: 'Wenn Sie Regeln verletzen, bestehen Sie die Challenge nicht und verlieren Ihre Gebühr. Die meisten Firmen bieten vergünstigte Wiederholungen an.',
    q_challenge_4: 'Was ist der Unterschied zwischen 1-Step und 2-Step Challenges?',
    a_challenge_4: '1-Step-Challenges haben nur eine Bewertungsphase. 2-Step-Challenges haben zwei Phasen mit unterschiedlichen Gewinnzielen.',
    q_rules_1: 'Was ist maximaler Drawdown?',
    a_rules_1: 'Der maximale Drawdown ist der höchste Rückgang, den Ihr Kontostand vom Startpunkt erleiden kann.',
    q_rules_2: 'Was ist der Unterschied zwischen statischem und Trailing-Drawdown?',
    a_rules_2: 'Statischer Drawdown wird von Ihrem Anfangsguthaben berechnet. Trailing-Drawdown steigt mit Ihren Gewinnen.',
    q_rules_3: 'Kann ich während News-Events handeln?',
    a_rules_3: 'Es hängt von der Firma ab. Einige erlauben News-Trading, andere beschränken es.',
    q_rules_4: 'Kann ich Trades über das Wochenende halten?',
    a_rules_4: 'Viele Firmen erlauben Wochenendhalten, aber nicht alle.',
    q_rules_5: 'Sind EAs und Bots erlaubt?',
    a_rules_5: 'Die meisten Firmen erlauben EAs und Trading-Bots, aber einige haben Einschränkungen.',
    q_payout_1: 'Was ist Gewinnaufteilung?',
    a_payout_1: 'Gewinnaufteilung ist, wie Gewinne zwischen Ihnen und der Prop-Firma geteilt werden. Typisch ist 80/20.',
    q_payout_2: 'Wie oft kann ich ausgezahlt werden?',
    a_payout_2: 'Die Auszahlungshäufigkeit variiert: wöchentlich, zweiwöchentlich oder monatlich.',
    q_payout_3: 'Wie zahlen mich Prop-Firmen aus?',
    a_payout_3: 'Die meisten Firmen zahlen per Banküberweisung, Krypto, PayPal oder Wise.',
    q_payout_4: 'Bekomme ich meine Challenge-Gebühr zurück?',
    a_payout_4: 'Einige Firmen erstatten die Challenge-Gebühr mit der ersten Auszahlung.',
    q_choose_1: 'Welche Prop-Firma ist am besten für Anfänger?',
    a_choose_1: 'Für Anfänger empfehlen wir Firmen mit einfacheren Regeln und großzügigen Drawdown-Limits.',
    q_choose_2: 'Welche Prop-Firma ist am besten für Scalper?',
    a_choose_2: 'Scalper sollten Firmen mit engen Spreads und ohne Zeitbeschränkungen suchen.',
    q_choose_3: 'Gibt es Prop-Firmen für Futures-Trading?',
    a_choose_3: 'Ja! Apex Trader Funding, Topstep und Earn2Trade spezialisieren sich auf Futures.',
    q_choose_4: 'Wie erkenne ich, ob eine Prop-Firma legitim ist?',
    a_choose_4: 'Prüfen Sie Trustpilot-Bewertungen und wie lange sie schon operieren.',
  },
  es: {
    q_general_1: '¿Qué es una prop trading firm?',
    a_general_1: 'Una prop firm proporciona a los traders capital para operar a cambio de una parte de las ganancias. Los traders deben pasar una evaluación (challenge) para demostrar sus habilidades.',
    q_general_2: '¿Cómo funciona PropFirm Scanner?',
    a_general_2: 'PropFirm Scanner compara más de 90 prop firms en métricas clave como precios, reglas, división de ganancias y calificaciones de Trustpilot.',
    q_general_3: '¿Es PropFirm Scanner gratis?',
    a_general_3: '¡Sí! Todas nuestras herramientas de comparación, calculadoras y guías son completamente gratuitas.',
    q_general_4: '¿Cómo ganan dinero?',
    a_general_4: 'Ganamos comisiones de afiliados de las prop firms cuando los traders se registran a través de nuestros enlaces.',
    q_challenge_1: '¿Qué es un challenge de prop firm?',
    a_challenge_1: 'Un challenge es una fase de evaluación donde operas en una cuenta demo y debes alcanzar objetivos de ganancias específicos.',
    q_challenge_2: '¿Cuánto dura un challenge?',
    a_challenge_2: 'La mayoría de los challenges tienen un límite de 30 días para la Fase 1, pero muchas firmas ahora ofrecen tiempo ilimitado.',
    q_challenge_3: '¿Qué pasa si fallo un challenge?',
    a_challenge_3: 'Si violas alguna regla, fallas el challenge y pierdes tu tarifa. La mayoría de las firmas ofrecen reintentos con descuento.',
    q_challenge_4: '¿Cuál es la diferencia entre challenges de 1-step y 2-step?',
    a_challenge_4: 'Los challenges de 1-step tienen solo una fase de evaluación. Los de 2-step tienen dos fases con diferentes objetivos.',
    q_rules_1: '¿Qué es el drawdown máximo?',
    a_rules_1: 'El drawdown máximo es lo máximo que puede disminuir el saldo de tu cuenta desde su punto inicial.',
    q_rules_2: '¿Cuál es la diferencia entre drawdown estático y trailing?',
    a_rules_2: 'El drawdown estático se calcula desde tu balance inicial. El trailing sube con tus ganancias.',
    q_rules_3: '¿Puedo operar durante eventos de noticias?',
    a_rules_3: 'Depende de la firma. Algunas permiten trading de noticias, otras lo restringen.',
    q_rules_4: '¿Puedo mantener trades durante el fin de semana?',
    a_rules_4: 'Muchas firmas permiten mantener posiciones el fin de semana, pero no todas.',
    q_rules_5: '¿Se permiten EAs y bots?',
    a_rules_5: 'La mayoría de las firmas permiten EAs y bots, pero algunas tienen restricciones.',
    q_payout_1: '¿Qué es la división de ganancias?',
    a_payout_1: 'La división de ganancias es cómo se dividen los beneficios entre tú y la prop firm. Típicamente es 80/20.',
    q_payout_2: '¿Con qué frecuencia puedo cobrar?',
    a_payout_2: 'La frecuencia de pago varía: semanal, quincenal o mensual.',
    q_payout_3: '¿Cómo me pagan las prop firms?',
    a_payout_3: 'La mayoría paga por transferencia bancaria, crypto, PayPal o Wise.',
    q_payout_4: '¿Me devuelven la tarifa del challenge?',
    a_payout_4: 'Algunas firmas reembolsan la tarifa con tu primer retiro de ganancias.',
    q_choose_1: '¿Cuál es la mejor prop firm para principiantes?',
    a_choose_1: 'Para principiantes, recomendamos firmas con reglas simples y límites de drawdown generosos.',
    q_choose_2: '¿Cuál es la mejor prop firm para scalpers?',
    a_choose_2: 'Los scalpers deben buscar firmas con spreads ajustados y sin restricciones de tiempo.',
    q_choose_3: '¿Hay prop firms para trading de futuros?',
    a_choose_3: '¡Sí! Apex Trader Funding, Topstep y Earn2Trade se especializan en futuros.',
    q_choose_4: '¿Cómo sé si una prop firm es legítima?',
    a_choose_4: 'Revisa las reseñas de Trustpilot y cuánto tiempo llevan operando.',
  },
  pt: {
    q_general_1: 'O que é uma prop trading firm?',
    a_general_1: 'Uma prop firm fornece capital aos traders para operar em troca de uma parte dos lucros. Os traders precisam passar uma avaliação (desafio) para provar suas habilidades.',
    q_general_2: 'Como funciona o PropFirm Scanner?',
    a_general_2: 'O PropFirm Scanner compara mais de 90 prop firms em métricas-chave como preços, regras, divisão de lucros e avaliações do Trustpilot.',
    q_general_3: 'O PropFirm Scanner é gratuito?',
    a_general_3: 'Sim! Todas as nossas ferramentas de comparação, calculadoras e guias são totalmente gratuitos.',
    q_general_4: 'Como vocês ganham dinheiro?',
    a_general_4: 'Ganhamos comissões de afiliados das prop firms quando traders se inscrevem através dos nossos links.',
    q_challenge_1: 'O que é um desafio de prop firm?',
    a_challenge_1: 'Um desafio é uma fase de avaliação onde você opera em uma conta demo e deve atingir metas de lucro específicas.',
    q_challenge_2: 'Quanto tempo dura um desafio?',
    a_challenge_2: 'A maioria dos desafios tem limite de 30 dias para a Fase 1, mas muitas firmas agora oferecem tempo ilimitado.',
    q_challenge_3: 'O que acontece se eu falhar um desafio?',
    a_challenge_3: 'Se você violar alguma regra, falha no desafio e perde sua taxa. A maioria das firmas oferece novas tentativas com desconto.',
    q_challenge_4: 'Qual a diferença entre desafios de 1-step e 2-step?',
    a_challenge_4: 'Desafios de 1-step têm apenas uma fase de avaliação. Os de 2-step têm duas fases com diferentes metas.',
    q_rules_1: 'O que é drawdown máximo?',
    a_rules_1: 'Drawdown máximo é o máximo que seu saldo pode cair do ponto inicial.',
    q_rules_2: 'Qual a diferença entre drawdown estático e trailing?',
    a_rules_2: 'Drawdown estático é calculado do seu saldo inicial. Trailing sobe com seus ganhos.',
    q_rules_3: 'Posso operar durante eventos de notícias?',
    a_rules_3: 'Depende da firma. Algumas permitem trading de notícias, outras restringem.',
    q_rules_4: 'Posso manter trades no fim de semana?',
    a_rules_4: 'Muitas firmas permitem manter posições no fim de semana, mas nem todas.',
    q_rules_5: 'EAs e bots são permitidos?',
    a_rules_5: 'A maioria das firmas permite EAs e bots, mas algumas têm restrições.',
    q_payout_1: 'O que é divisão de lucros?',
    a_payout_1: 'Divisão de lucros é como os lucros são divididos entre você e a prop firm. Tipicamente é 80/20.',
    q_payout_2: 'Com que frequência posso receber?',
    a_payout_2: 'A frequência de pagamento varia: semanal, quinzenal ou mensal.',
    q_payout_3: 'Como as prop firms me pagam?',
    a_payout_3: 'A maioria paga por transferência bancária, crypto, PayPal ou Wise.',
    q_payout_4: 'Recebo minha taxa de desafio de volta?',
    a_payout_4: 'Algumas firmas reembolsam a taxa com seu primeiro saque de lucros.',
    q_choose_1: 'Qual a melhor prop firm para iniciantes?',
    a_choose_1: 'Para iniciantes, recomendamos firmas com regras simples e limites de drawdown generosos.',
    q_choose_2: 'Qual a melhor prop firm para scalpers?',
    a_choose_2: 'Scalpers devem procurar firmas com spreads apertados e sem restrições de tempo.',
    q_choose_3: 'Existem prop firms para trading de futuros?',
    a_choose_3: 'Sim! Apex Trader Funding, Topstep e Earn2Trade se especializam em futuros.',
    q_choose_4: 'Como sei se uma prop firm é legítima?',
    a_choose_4: 'Verifique avaliações do Trustpilot e há quanto tempo eles operam.',
  },
  ar: {
    q_general_1: 'ما هي شركة التداول الخاصة؟',
    a_general_1: 'شركة prop firm توفر للمتداولين رأس مال للتداول مقابل حصة من الأرباح. يحتاج المتداولون عادة إلى اجتياز تقييم (تحدي) لإثبات مهاراتهم.',
    q_general_2: 'كيف يعمل PropFirm Scanner؟',
    a_general_2: 'يقارن PropFirm Scanner أكثر من 90 شركة prop firm عبر مقاييس رئيسية مثل الأسعار والقواعد وتقسيم الأرباح وتقييمات Trustpilot.',
    q_general_3: 'هل PropFirm Scanner مجاني؟',
    a_general_3: 'نعم! جميع أدوات المقارنة والحاسبات والأدلة مجانية تماماً.',
    q_general_4: 'كيف تكسبون المال؟',
    a_general_4: 'نكسب عمولات تابعة من شركات prop firm عندما يسجل المتداولون عبر روابطنا.',
    q_challenge_1: 'ما هو تحدي prop firm؟',
    a_challenge_1: 'التحدي هو مرحلة تقييم حيث تتداول على حساب تجريبي ويجب أن تحقق أهداف ربح محددة.',
    q_challenge_2: 'كم يستغرق التحدي؟',
    a_challenge_2: 'معظم التحديات لها حد زمني 30 يوماً للمرحلة 1، لكن العديد من الشركات تقدم الآن وقتاً غير محدود.',
    q_challenge_3: 'ماذا يحدث إذا فشلت في التحدي؟',
    a_challenge_3: 'إذا انتهكت أي قواعد، تفشل في التحدي وتخسر رسومك. معظم الشركات تقدم إعادة المحاولة بسعر مخفض.',
    q_challenge_4: 'ما الفرق بين تحديات 1-step و 2-step؟',
    a_challenge_4: 'تحديات 1-step لها مرحلة تقييم واحدة فقط. تحديات 2-step لها مرحلتان بأهداف مختلفة.',
    q_rules_1: 'ما هو السحب الأقصى؟',
    a_rules_1: 'السحب الأقصى هو أقصى انخفاض يمكن أن يشهده رصيد حسابك من نقطة البداية.',
    q_rules_2: 'ما الفرق بين السحب الثابت والمتحرك؟',
    a_rules_2: 'السحب الثابت يُحسب من رصيدك الأولي. السحب المتحرك يرتفع مع أرباحك.',
    q_rules_3: 'هل يمكنني التداول أثناء الأخبار؟',
    a_rules_3: 'يعتمد على الشركة. بعضها يسمح بتداول الأخبار، والبعض يقيده.',
    q_rules_4: 'هل يمكنني الاحتفاظ بالصفقات خلال عطلة نهاية الأسبوع؟',
    a_rules_4: 'العديد من الشركات تسمح بالاحتفاظ خلال عطلة نهاية الأسبوع، لكن ليس جميعها.',
    q_rules_5: 'هل EAs والبوتات مسموحة؟',
    a_rules_5: 'معظم الشركات تسمح بـ EAs وبوتات التداول، لكن بعضها لديه قيود.',
    q_payout_1: 'ما هو تقسيم الأرباح؟',
    a_payout_1: 'تقسيم الأرباح هو كيفية تقسيم الأرباح بينك وبين prop firm. النموذجي هو 80/20.',
    q_payout_2: 'كم مرة يمكنني الحصول على دفعات؟',
    a_payout_2: 'تردد الدفع يختلف: أسبوعي أو نصف شهري أو شهري.',
    q_payout_3: 'كيف تدفع لي شركات prop firm؟',
    a_payout_3: 'معظم الشركات تدفع عبر التحويل البنكي، crypto، PayPal أو Wise.',
    q_payout_4: 'هل أسترد رسوم التحدي؟',
    a_payout_4: 'بعض الشركات تسترد رسوم التحدي مع أول سحب للأرباح.',
    q_choose_1: 'ما أفضل prop firm للمبتدئين؟',
    a_choose_1: 'للمبتدئين، نوصي بشركات ذات قواعد بسيطة وحدود سحب سخية.',
    q_choose_2: 'ما أفضل prop firm للسكالبرز؟',
    a_choose_2: 'السكالبرز يجب أن يبحثوا عن شركات بفروقات ضيقة وبدون قيود زمنية.',
    q_choose_3: 'هل هناك prop firms لتداول العقود الآجلة؟',
    a_choose_3: 'نعم! Apex Trader Funding، Topstep و Earn2Trade متخصصون في العقود الآجلة.',
    q_choose_4: 'كيف أعرف أن prop firm شرعية؟',
    a_choose_4: 'تحقق من تقييمات Trustpilot ومدة عملهم.',
  },
  hi: {
    q_general_1: 'प्रॉप ट्रेडिंग फर्म क्या है?',
    a_general_1: 'एक प्रॉप फर्म ट्रेडर्स को मुनाफे के हिस्से के बदले में ट्रेड करने के लिए पूंजी प्रदान करती है। ट्रेडर्स को आमतौर पर अपने कौशल साबित करने के लिए एक मूल्यांकन (चैलेंज) पास करना होता है।',
    q_general_2: 'PropFirm Scanner कैसे काम करता है?',
    a_general_2: 'PropFirm Scanner 90+ प्रॉप फर्म्स की तुलना प्रमुख मेट्रिक्स जैसे मूल्य निर्धारण, नियम, प्रॉफिट स्प्लिट और Trustpilot रेटिंग पर करता है।',
    q_general_3: 'क्या PropFirm Scanner मुफ्त है?',
    a_general_3: 'हां! हमारे सभी तुलना टूल्स, कैलकुलेटर और गाइड पूरी तरह मुफ्त हैं।',
    q_general_4: 'आप पैसे कैसे कमाते हैं?',
    a_general_4: 'जब ट्रेडर्स हमारे लिंक के माध्यम से साइन अप करते हैं तो हम प्रॉप फर्म्स से एफिलिएट कमीशन कमाते हैं।',
    q_challenge_1: 'प्रॉप फर्म चैलेंज क्या है?',
    a_challenge_1: 'चैलेंज एक मूल्यांकन चरण है जहां आप डेमो अकाउंट पर ट्रेड करते हैं और विशिष्ट प्रॉफिट टारगेट प्राप्त करना होता है।',
    q_challenge_2: 'चैलेंज कितना समय लेता है?',
    a_challenge_2: 'अधिकांश चैलेंज में फेज 1 के लिए 30 दिनों की समय सीमा होती है, लेकिन कई फर्म्स अब असीमित समय प्रदान करती हैं।',
    q_challenge_3: 'अगर मैं चैलेंज में फेल हो जाऊं तो क्या होगा?',
    a_challenge_3: 'यदि आप किसी नियम का उल्लंघन करते हैं, तो आप चैलेंज में फेल हो जाते हैं और अपनी फीस खो देते हैं। अधिकांश फर्म्स छूट पर पुनः प्रयास की पेशकश करती हैं।',
    q_challenge_4: '1-step और 2-step चैलेंज में क्या अंतर है?',
    a_challenge_4: '1-step चैलेंज में फंडिंग से पहले केवल एक मूल्यांकन चरण होता है। 2-step में दो चरण होते हैं।',
    q_rules_1: 'मैक्सिमम ड्रॉडाउन क्या है?',
    a_rules_1: 'मैक्सिमम ड्रॉडाउन वह अधिकतम है जितना आपका अकाउंट बैलेंस अपने शुरुआती बिंदु से गिर सकता है।',
    q_rules_2: 'स्टैटिक और ट्रेलिंग ड्रॉडाउन में क्या अंतर है?',
    a_rules_2: 'स्टैटिक ड्रॉडाउन आपके प्रारंभिक बैलेंस से गणना किया जाता है। ट्रेलिंग आपके इक्विटी के साथ बढ़ता है।',
    q_rules_3: 'क्या मैं न्यूज इवेंट्स के दौरान ट्रेड कर सकता हूं?',
    a_rules_3: 'यह फर्म पर निर्भर करता है। कुछ न्यूज ट्रेडिंग की अनुमति देती हैं, अन्य इसे प्रतिबंधित करती हैं।',
    q_rules_4: 'क्या मैं वीकेंड में ट्रेड्स होल्ड कर सकता हूं?',
    a_rules_4: 'कई फर्म्स वीकेंड होल्डिंग की अनुमति देती हैं, लेकिन सभी नहीं।',
    q_rules_5: 'क्या EAs और बॉट्स की अनुमति है?',
    a_rules_5: 'अधिकांश फर्म्स EAs और ट्रेडिंग बॉट्स की अनुमति देती हैं, लेकिन कुछ में प्रतिबंध हैं।',
    q_payout_1: 'प्रॉफिट स्प्लिट क्या है?',
    a_payout_1: 'प्रॉफिट स्प्लिट यह है कि प्रॉफिट आपके और प्रॉप फर्म के बीच कैसे बांटा जाता है। आमतौर पर 80/20 होता है।',
    q_payout_2: 'मुझे कितनी बार भुगतान मिल सकता है?',
    a_payout_2: 'भुगतान आवृत्ति अलग-अलग होती है: साप्ताहिक, पाक्षिक या मासिक।',
    q_payout_3: 'प्रॉप फर्म्स मुझे कैसे भुगतान करती हैं?',
    a_payout_3: 'अधिकांश फर्म्स बैंक ट्रांसफर, क्रिप्टो, PayPal या Wise के माध्यम से भुगतान करती हैं।',
    q_payout_4: 'क्या मुझे चैलेंज फीस वापस मिलती है?',
    a_payout_4: 'कुछ फर्म्स आपके पहले प्रॉफिट विड्रॉल के साथ चैलेंज फीस रिफंड करती हैं।',
    q_choose_1: 'शुरुआती लोगों के लिए कौन सी प्रॉप फर्म सबसे अच्छी है?',
    a_choose_1: 'शुरुआती लोगों के लिए, हम सरल नियमों और उदार ड्रॉडाउन सीमाओं वाली फर्म्स की सिफारिश करते हैं।',
    q_choose_2: 'स्कैल्पर्स के लिए कौन सी प्रॉप फर्म सबसे अच्छी है?',
    a_choose_2: 'स्कैल्पर्स को टाइट स्प्रेड्स और कोई समय प्रतिबंध नहीं वाली फर्म्स देखनी चाहिए।',
    q_choose_3: 'क्या फ्यूचर्स ट्रेडिंग के लिए प्रॉप फर्म्स हैं?',
    a_choose_3: 'हां! Apex Trader Funding, Topstep और Earn2Trade फ्यूचर्स में विशेषज्ञ हैं।',
    q_choose_4: 'मैं कैसे जानूं कि प्रॉप फर्म वैध है?',
    a_choose_4: 'उनकी Trustpilot समीक्षाएं जांचें और वे कितने समय से काम कर रहे हैं।',
  },
};

const FAQ_CATEGORIES_KEYS: FAQCategory[] = [
  {
    id: 'general',
    titleKey: 'catGeneral',
    icon: HelpCircle,
    faqs: [
      { questionKey: 'q_general_1', answerKey: 'a_general_1' },
      { questionKey: 'q_general_2', answerKey: 'a_general_2' },
      { questionKey: 'q_general_3', answerKey: 'a_general_3' },
      { questionKey: 'q_general_4', answerKey: 'a_general_4' },
    ],
  },
  {
    id: 'challenges',
    titleKey: 'catChallenges',
    icon: Target,
    faqs: [
      { questionKey: 'q_challenge_1', answerKey: 'a_challenge_1' },
      { questionKey: 'q_challenge_2', answerKey: 'a_challenge_2' },
      { questionKey: 'q_challenge_3', answerKey: 'a_challenge_3' },
      { questionKey: 'q_challenge_4', answerKey: 'a_challenge_4' },
    ],
  },
  {
    id: 'rules',
    titleKey: 'catRules',
    icon: Shield,
    faqs: [
      { questionKey: 'q_rules_1', answerKey: 'a_rules_1' },
      { questionKey: 'q_rules_2', answerKey: 'a_rules_2' },
      { questionKey: 'q_rules_3', answerKey: 'a_rules_3' },
      { questionKey: 'q_rules_4', answerKey: 'a_rules_4' },
      { questionKey: 'q_rules_5', answerKey: 'a_rules_5' },
    ],
  },
  {
    id: 'payouts',
    titleKey: 'catPayouts',
    icon: DollarSign,
    faqs: [
      { questionKey: 'q_payout_1', answerKey: 'a_payout_1' },
      { questionKey: 'q_payout_2', answerKey: 'a_payout_2' },
      { questionKey: 'q_payout_3', answerKey: 'a_payout_3' },
      { questionKey: 'q_payout_4', answerKey: 'a_payout_4' },
    ],
  },
  {
    id: 'choosing',
    titleKey: 'catChoosing',
    icon: TrendingDown,
    faqs: [
      { questionKey: 'q_choose_1', answerKey: 'a_choose_1' },
      { questionKey: 'q_choose_2', answerKey: 'a_choose_2' },
      { questionKey: 'q_choose_3', answerKey: 'a_choose_3' },
      { questionKey: 'q_choose_4', answerKey: 'a_choose_4' },
    ],
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function FAQPageClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = translations[locale];
  const faq = faqContent[locale];

  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Build FAQ categories with translations
  const FAQ_CATEGORIES = FAQ_CATEGORIES_KEYS.map(cat => ({
    ...cat,
    title: t[cat.titleKey],
    faqs: cat.faqs.map(f => ({
      question: faq[f.questionKey],
      answer: faq[f.answerKey],
    })),
  }))

  // Filter FAQs based on search
  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    faqs: category.faqs.filter(f =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => !searchQuery || category.faqs.length > 0)

  const displayedCategories = activeCategory
    ? filteredCategories.filter(c => c.id === activeCategory)
    : filteredCategories

  return (
    <div className="min-h-screen bg-gray-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {t.all}
          </button>
          {FAQ_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeCategory === category.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.title}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {displayedCategories.map(category => (
            <div key={category.id}>
              {!activeCategory && (
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <category.icon className="w-5 h-5 text-emerald-400" />
                  {category.title}
                </h2>
              )}
              
              <div className="space-y-2">
                {category.faqs.map((faqItem, index) => {
                  const itemId = `${category.id}-${index}`
                  const isOpen = openItems.includes(itemId)
                  
                  return (
                    <div
                      key={itemId}
                      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-white font-medium pr-4">{faqItem.question}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-400 leading-relaxed">{faqItem.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">{t.noResults}</h3>
            <p className="text-gray-400">{t.tryDifferent}</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t.stillQuestions}</h2>
          <p className="text-gray-400 mb-6">{t.cantFind}</p>
          <a
            href="mailto:support@propfirmscanner.org"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            {t.contactSupport}
          </a>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link
            href={`/${locale}/quick-match`}
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 text-center"
          >
            <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium">{t.quickMatch}</div>
            <div className="text-gray-400 text-sm">{t.findIdealFirm}</div>
          </Link>
          <Link
            href={`/${locale}/compare`}
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 text-center"
          >
            <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium">{t.compareFirms}</div>
            <div className="text-gray-400 text-sm">{t.sideBySide}</div>
          </Link>
          <Link
            href={`/${locale}/guide`}
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/30 text-center"
          >
            <HelpCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium">{t.freeGuide}</div>
            <div className="text-gray-400 text-sm">{t.downloadGuide}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
