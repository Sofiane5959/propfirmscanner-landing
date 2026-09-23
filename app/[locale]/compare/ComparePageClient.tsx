'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useHideOnScrollDown } from '@/hooks/useHideOnScrollDown'
import { formatMonthYear } from '@/lib/format'
import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
    pageTitle: 'Compare Prop Firms',
    pageSubtitle: 'Find your perfect match with smart filters',
    searchPlaceholder: 'Search firms...',
    markets: 'Markets',
    platform: 'Platform',
    challenge: 'Challenge',
    style: 'Style',
    rating: 'Rating',
    bestFor: 'Best For',
    price: 'Price',
    deals: 'Deals',
    reset: 'Reset',
    showing: 'Showing',
    propFirms: 'prop firms',
    favorites: 'favorites',
    noFirmsFound: 'No firms found',
    tryAdjusting: 'Try adjusting your filters or search terms',
    resetFilters: 'Reset Filters',
    details: 'Details',
    visit: 'Visit',
    compare: 'Compare',
    compareNow: 'Compare Now',
    clear: 'Clear',
    verified: 'Verified',
    avoid: 'Avoid',
    underReview: 'Under Review',
    new: 'New',
    split: 'Split',
    scalping: 'Scalping',
    newsTrading: 'News Trading',
    easBots: 'EAs/Bots',
    swingWeekend: 'Swing/Weekend',
    beginners: 'Beginners',
    bestValue: 'Best Value',
    highSplit: 'High Split',
    scalpers: 'Scalpers',
    instantFunding: 'Instant Funding',
    highestRating: 'Highest Rating',
    lowestPrice: 'Lowest Price',
    highestSplit: 'Highest Split',
    bestDeals: 'Best Deals',
    mostReviews: 'Most Reviews',
    copied: 'Copied!',
    rateBtn: 'Rate',
    communityRating: 'Community',
    writeReview: 'Rate this firm',
    shareExperience: 'Share your experience',
    yourRating: 'Your rating',
    tradingStyleUsed: 'Your trading style',
    commentPlaceholder: 'How was your experience? Payouts, support, rules...',
    submitReview: 'Submit Review',
    submitting: 'Submitting...',
    reviewSubmitted: 'Review submitted! Thank you 🙏',
    alreadyReviewedNote: 'You already reviewed this firm — submitting will update your review.',
    signInToReview: 'Sign in to leave a review',
    thankYouReview: 'Thank you!',
    thankYouSub: 'Your review helps the community.',
    // Payout Proofs
    submitPayout: 'Submit Payout Proof',
    payoutAmount: 'Payout amount',
    payoutCurrency: 'Currency',
    payoutDate: 'Payout date',
    payoutScreenshot: 'Screenshot (optional)',
    payoutScreenshotHint: 'Upload a proof screenshot',
    submitPayoutBtn: 'Submit Proof',
    payoutSubmitted: '💰 Payout proof submitted!',
    signInToPayout: 'Sign in to submit a payout',
    thankYouPayout: 'Proof submitted!',
    thankYouPayoutSub: 'Thank you for helping the community.',
    payoutBadge: 'payouts',
    removeScreenshot: 'Remove',
    payoutAmountPlaceholder: 'e.g. 1500',
  },
  fr: {
    pageTitle: 'Comparer les Prop Firms',
    pageSubtitle: 'Trouvez votre match parfait avec des filtres intelligents',
    searchPlaceholder: 'Rechercher...',
    markets: 'Marches',
    platform: 'Plateforme',
    challenge: 'Challenge',
    style: 'Style',
    rating: 'Note',
    bestFor: 'Ideal pour',
    price: 'Prix',
    deals: 'Promos',
    reset: 'Reset',
    showing: 'Affichage de',
    propFirms: 'prop firms',
    favorites: 'favoris',
    noFirmsFound: 'Aucune firm trouvee',
    tryAdjusting: 'Essayez d\'ajuster vos filtres ou termes de recherche',
    resetFilters: 'Reinitialiser',
    details: 'Details',
    visit: 'Visiter',
    compare: 'Comparer',
    compareNow: 'Comparer',
    clear: 'Effacer',
    verified: 'Verifie',
    avoid: 'A eviter',
    underReview: 'En revision',
    new: 'Nouveau',
    split: 'Split',
    scalping: 'Scalping',
    newsTrading: 'Trading News',
    easBots: 'EAs/Bots',
    swingWeekend: 'Swing/Weekend',
    beginners: 'Debutants',
    bestValue: 'Meilleur Rapport',
    highSplit: 'Haut Split',
    scalpers: 'Scalpers',
    instantFunding: 'Financement Instant',
    highestRating: 'Meilleure Note',
    lowestPrice: 'Prix le Plus Bas',
    highestSplit: 'Meilleur Split',
    bestDeals: 'Meilleures Offres',
    mostReviews: 'Plus d\'Avis',
    copied: 'Copie !',
    rateBtn: 'Noter',
    communityRating: 'Communaute',
    writeReview: 'Noter cette firm',
    shareExperience: 'Partagez votre experience',
    yourRating: 'Votre note',
    tradingStyleUsed: 'Votre style de trading',
    commentPlaceholder: 'Comment s\'est passee votre experience ? Paiements, support, regles...',
    submitReview: 'Soumettre',
    submitting: 'Envoi...',
    reviewSubmitted: 'Avis soumis ! Merci 🙏',
    alreadyReviewedNote: 'Vous avez deja note cette firm — soumettre mettra a jour votre avis.',
    signInToReview: 'Connectez-vous pour noter',
    thankYouReview: 'Merci !',
    thankYouSub: 'Votre avis aide la communaute.',
    submitPayout: 'Soumettre une preuve de paiement',
    payoutAmount: 'Montant du paiement',
    payoutCurrency: 'Devise',
    payoutDate: 'Date du paiement',
    payoutScreenshot: 'Capture d\'ecran (optionnel)',
    payoutScreenshotHint: 'Deposez une preuve en image',
    submitPayoutBtn: 'Soumettre la preuve',
    payoutSubmitted: '💰 Preuve soumise !',
    signInToPayout: 'Connectez-vous pour soumettre',
    thankYouPayout: 'Preuve soumise !',
    thankYouPayoutSub: 'Merci pour votre contribution.',
    payoutBadge: 'paiements',
    removeScreenshot: 'Supprimer',
    payoutAmountPlaceholder: 'ex. 1500',
  },
  de: {
    pageTitle: 'Prop Firms Vergleichen',
    pageSubtitle: 'Finden Sie Ihr perfektes Match mit smarten Filtern',
    searchPlaceholder: 'Suchen...',
    markets: 'Markte',
    platform: 'Plattform',
    challenge: 'Challenge',
    style: 'Stil',
    rating: 'Bewertung',
    bestFor: 'Ideal fur',
    price: 'Preis',
    deals: 'Angebote',
    reset: 'Reset',
    showing: 'Zeige',
    propFirms: 'Prop Firms',
    favorites: 'Favoriten',
    noFirmsFound: 'Keine Firms gefunden',
    tryAdjusting: 'Versuchen Sie Ihre Filter anzupassen',
    resetFilters: 'Filter zurucksetzen',
    details: 'Details',
    visit: 'Besuchen',
    compare: 'Vergleichen',
    compareNow: 'Jetzt Vergleichen',
    clear: 'Loschen',
    verified: 'Verifiziert',
    avoid: 'Vermeiden',
    underReview: 'In Prufung',
    new: 'Neu',
    split: 'Split',
    scalping: 'Scalping',
    newsTrading: 'News Trading',
    easBots: 'EAs/Bots',
    swingWeekend: 'Swing/Weekend',
    beginners: 'Anfanger',
    bestValue: 'Bestes Preis-Leistung',
    highSplit: 'Hoher Split',
    scalpers: 'Scalper',
    instantFunding: 'Sofort-Finanzierung',
    highestRating: 'Beste Bewertung',
    lowestPrice: 'Niedrigster Preis',
    highestSplit: 'Hochster Split',
    bestDeals: 'Beste Angebote',
    mostReviews: 'Meiste Bewertungen',
    copied: 'Kopiert!',
    rateBtn: 'Bewerten',
    communityRating: 'Community',
    writeReview: 'Bewerten',
    shareExperience: 'Teile deine Erfahrung',
    yourRating: 'Deine Bewertung',
    tradingStyleUsed: 'Dein Trading-Stil',
    commentPlaceholder: 'Wie war deine Erfahrung? Auszahlungen, Support, Regeln...',
    submitReview: 'Bewertung senden',
    submitting: 'Senden...',
    reviewSubmitted: 'Bewertung eingereicht! Danke 🙏',
    alreadyReviewedNote: 'Du hast diese Firma bereits bewertet — deine Bewertung wird aktualisiert.',
    signInToReview: 'Anmelden um zu bewerten',
    thankYouReview: 'Danke!',
    thankYouSub: 'Deine Bewertung hilft der Community.',
    submitPayout: 'Auszahlungsnachweis einreichen',
    payoutAmount: 'Auszahlungsbetrag',
    payoutCurrency: 'Wahrung',
    payoutDate: 'Auszahlungsdatum',
    payoutScreenshot: 'Screenshot (optional)',
    payoutScreenshotHint: 'Screenshot hochladen',
    submitPayoutBtn: 'Nachweis einreichen',
    payoutSubmitted: '💰 Nachweis eingereicht!',
    signInToPayout: 'Anmelden um einzureichen',
    thankYouPayout: 'Nachweis eingereicht!',
    thankYouPayoutSub: 'Danke fur deinen Beitrag.',
    payoutBadge: 'Auszahlungen',
    removeScreenshot: 'Entfernen',
    payoutAmountPlaceholder: 'z.B. 1500',
  },
  es: {
    pageTitle: 'Comparar Prop Firms',
    pageSubtitle: 'Encuentra tu match perfecto con filtros inteligentes',
    searchPlaceholder: 'Buscar...',
    markets: 'Mercados',
    platform: 'Plataforma',
    challenge: 'Challenge',
    style: 'Estilo',
    rating: 'Valoracion',
    bestFor: 'Ideal para',
    price: 'Precio',
    deals: 'Ofertas',
    reset: 'Reset',
    showing: 'Mostrando',
    propFirms: 'prop firms',
    favorites: 'favoritos',
    noFirmsFound: 'No se encontraron firms',
    tryAdjusting: 'Intenta ajustar tus filtros o terminos de busqueda',
    resetFilters: 'Restablecer filtros',
    details: 'Detalles',
    visit: 'Visitar',
    compare: 'Comparar',
    compareNow: 'Comparar Ahora',
    clear: 'Limpiar',
    verified: 'Verificado',
    avoid: 'Evitar',
    underReview: 'En revision',
    new: 'Nuevo',
    split: 'Split',
    scalping: 'Scalping',
    newsTrading: 'Trading Noticias',
    easBots: 'EAs/Bots',
    swingWeekend: 'Swing/Weekend',
    beginners: 'Principiantes',
    bestValue: 'Mejor Valor',
    highSplit: 'Alto Split',
    scalpers: 'Scalpers',
    instantFunding: 'Financiacion Instantanea',
    highestRating: 'Mayor Valoracion',
    lowestPrice: 'Precio Mas Bajo',
    highestSplit: 'Mayor Split',
    bestDeals: 'Mejores Ofertas',
    mostReviews: 'Mas Resenas',
    copied: 'Copiado!',
    rateBtn: 'Valorar',
    communityRating: 'Comunidad',
    writeReview: 'Valorar firma',
    shareExperience: 'Comparte tu experiencia',
    yourRating: 'Tu valoracion',
    tradingStyleUsed: 'Tu estilo de trading',
    commentPlaceholder: 'Como fue tu experiencia? Pagos, soporte, reglas...',
    submitReview: 'Enviar valoracion',
    submitting: 'Enviando...',
    reviewSubmitted: 'Valoracion enviada! Gracias 🙏',
    alreadyReviewedNote: 'Ya valoraste esta firma — enviar actualizara tu valoracion.',
    signInToReview: 'Inicia sesion para valorar',
    thankYouReview: 'Gracias!',
    thankYouSub: 'Tu valoracion ayuda a la comunidad.',
    submitPayout: 'Enviar prueba de pago',
    payoutAmount: 'Monto del pago',
    payoutCurrency: 'Moneda',
    payoutDate: 'Fecha de pago',
    payoutScreenshot: 'Captura de pantalla (opcional)',
    payoutScreenshotHint: 'Sube una captura como prueba',
    submitPayoutBtn: 'Enviar prueba',
    payoutSubmitted: '💰 Prueba enviada!',
    signInToPayout: 'Inicia sesion para enviar',
    thankYouPayout: 'Prueba enviada!',
    thankYouPayoutSub: 'Gracias por ayudar a la comunidad.',
    payoutBadge: 'pagos',
    removeScreenshot: 'Eliminar',
    payoutAmountPlaceholder: 'ej. 1500',
  },
  pt: {
    pageTitle: 'Comparar Prop Firms',
    pageSubtitle: 'Encontre seu match perfeito com filtros inteligentes',
    searchPlaceholder: 'Pesquisar...',
    markets: 'Mercados',
    platform: 'Plataforma',
    challenge: 'Challenge',
    style: 'Estilo',
    rating: 'Avaliacao',
    bestFor: 'Ideal para',
    price: 'Preco',
    deals: 'Ofertas',
    reset: 'Reset',
    showing: 'Mostrando',
    propFirms: 'prop firms',
    favorites: 'favoritos',
    noFirmsFound: 'Nenhuma firm encontrada',
    tryAdjusting: 'Tente ajustar seus filtros ou termos de pesquisa',
    resetFilters: 'Redefinir filtros',
    details: 'Detalhes',
    visit: 'Visitar',
    compare: 'Comparar',
    compareNow: 'Comparar Agora',
    clear: 'Limpar',
    verified: 'Verificado',
    avoid: 'Evitar',
    underReview: 'Em revisao',
    new: 'Novo',
    split: 'Split',
    scalping: 'Scalping',
    newsTrading: 'Trading Noticias',
    easBots: 'EAs/Bots',
    swingWeekend: 'Swing/Weekend',
    beginners: 'Iniciantes',
    bestValue: 'Melhor Valor',
    highSplit: 'Alto Split',
    scalpers: 'Scalpers',
    instantFunding: 'Financiamento Instantaneo',
    highestRating: 'Maior Avaliacao',
    lowestPrice: 'Menor Preco',
    highestSplit: 'Maior Split',
    bestDeals: 'Melhores Ofertas',
    mostReviews: 'Mais Avaliacoes',
    copied: 'Copiado!',
    rateBtn: 'Avaliar',
    communityRating: 'Comunidade',
    writeReview: 'Avaliar firma',
    shareExperience: 'Compartilhe sua experiencia',
    yourRating: 'Sua avaliacao',
    tradingStyleUsed: 'Seu estilo de trading',
    commentPlaceholder: 'Como foi sua experiencia? Pagamentos, suporte, regras...',
    submitReview: 'Enviar avaliacao',
    submitting: 'Enviando...',
    reviewSubmitted: 'Avaliacao enviada! Obrigado 🙏',
    alreadyReviewedNote: 'Voce ja avaliou esta firma — enviar ira atualizar sua avaliacao.',
    signInToReview: 'Faca login para avaliar',
    thankYouReview: 'Obrigado!',
    thankYouSub: 'Sua avaliacao ajuda a comunidade.',
    submitPayout: 'Enviar prova de pagamento',
    payoutAmount: 'Valor do pagamento',
    payoutCurrency: 'Moeda',
    payoutDate: 'Data do pagamento',
    payoutScreenshot: 'Captura de tela (opcional)',
    payoutScreenshotHint: 'Envie uma prova em imagem',
    submitPayoutBtn: 'Enviar prova',
    payoutSubmitted: '💰 Prova enviada!',
    signInToPayout: 'Faca login para enviar',
    thankYouPayout: 'Prova enviada!',
    thankYouPayoutSub: 'Obrigado por ajudar a comunidade.',
    payoutBadge: 'pagamentos',
    removeScreenshot: 'Remover',
    payoutAmountPlaceholder: 'ex. 1500',
  },
  ar: {
    pageTitle: 'مقارنة شركات Prop',
    pageSubtitle: 'اعثر على تطابقك المثالي مع فلاتر ذكية',
    searchPlaceholder: 'بحث...',
    markets: 'الاسواق',
    platform: 'المنصة',
    challenge: 'التحدي',
    style: 'الاسلوب',
    rating: 'التقييم',
    bestFor: 'الافضل لـ',
    price: 'السعر',
    deals: 'العروض',
    reset: 'اعادة',
    showing: 'عرض',
    propFirms: 'شركات prop',
    favorites: 'المفضلة',
    noFirmsFound: 'لم يتم العثور على شركات',
    tryAdjusting: 'حاول تعديل الفلاتر او مصطلحات البحث',
    resetFilters: 'اعادة تعيين الفلاتر',
    details: 'التفاصيل',
    visit: 'زيارة',
    compare: 'مقارنة',
    compareNow: 'قارن الان',
    clear: 'مسح',
    verified: 'موثق',
    avoid: 'تجنب',
    underReview: 'قيد المراجعة',
    new: 'جديد',
    split: 'التقسيم',
    scalping: 'سكالبينج',
    newsTrading: 'تداول الاخبار',
    easBots: 'EAs/روبوتات',
    swingWeekend: 'سوينج/ويكند',
    beginners: 'مبتدئين',
    bestValue: 'افضل قيمة',
    highSplit: 'تقسيم عالي',
    scalpers: 'سكالبرز',
    instantFunding: 'تمويل فوري',
    highestRating: 'اعلى تقييم',
    lowestPrice: 'اقل سعر',
    highestSplit: 'اعلى تقسيم',
    bestDeals: 'افضل العروض',
    mostReviews: 'اكثر التقييمات',
    copied: 'تم النسخ!',
    rateBtn: 'تقييم',
    communityRating: 'المجتمع',
    writeReview: 'تقييم الشركة',
    shareExperience: 'شارك تجربتك',
    yourRating: 'تقييمك',
    tradingStyleUsed: 'اسلوب تداولك',
    commentPlaceholder: 'كيف كانت تجربتك؟ الدفعات، الدعم، القواعد...',
    submitReview: 'ارسال التقييم',
    submitting: 'جاري الارسال...',
    reviewSubmitted: 'تم ارسال التقييم! شكرا 🙏',
    alreadyReviewedNote: 'لقد قيّمت هذه الشركة بالفعل — الارسال سيحدث تقييمك.',
    signInToReview: 'سجل الدخول للتقييم',
    thankYouReview: 'شكرا!',
    thankYouSub: 'تقييمك يساعد المجتمع.',
    submitPayout: 'ارسال اثبات الدفع',
    payoutAmount: 'مبلغ الدفع',
    payoutCurrency: 'العملة',
    payoutDate: 'تاريخ الدفع',
    payoutScreenshot: 'لقطة شاشة (اختياري)',
    payoutScreenshotHint: 'ارفع صورة كاثبات',
    submitPayoutBtn: 'ارسال الاثبات',
    payoutSubmitted: '💰 تم ارسال الاثبات!',
    signInToPayout: 'سجل الدخول للارسال',
    thankYouPayout: 'تم الارسال!',
    thankYouPayoutSub: 'شكرا لمساعدة المجتمع.',
    payoutBadge: 'دفعات',
    removeScreenshot: 'حذف',
    payoutAmountPlaceholder: 'مثال 1500',
  },
  hi: {
    pageTitle: 'Prop Firms की तुलना करें',
    pageSubtitle: 'स्मार्ट फ़िल्टर के साथ अपना परफेक्ट मैच खोजें',
    searchPlaceholder: 'खोजें...',
    markets: 'बाज़ार',
    platform: 'प्लेटफ़ॉर्म',
    challenge: 'चैलेंज',
    style: 'स्टाइल',
    rating: 'रेटिंग',
    bestFor: 'के लिए बेस्ट',
    price: 'कीमत',
    deals: 'डील्स',
    reset: 'रीसेट',
    showing: 'दिखा रहे हैं',
    propFirms: 'prop firms',
    favorites: 'पसंदीदा',
    noFirmsFound: 'कोई firm नहीं मिली',
    tryAdjusting: 'अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें',
    resetFilters: 'फ़िल्टर रीसेट करें',
    details: 'विवरण',
    visit: 'विज़िट',
    compare: 'तुलना',
    compareNow: 'अभी तुलना करें',
    clear: 'साफ़ करें',
    verified: 'सत्यापित',
    avoid: 'बचें',
    underReview: 'समीक्षाधीन',
    new: 'नया',
    split: 'स्प्लिट',
    scalping: 'स्कैल्पिंग',
    newsTrading: 'न्यूज़ ट्रेडिंग',
    easBots: 'EAs/बॉट्स',
    swingWeekend: 'स्विंग/वीकेंड',
    beginners: 'शुरुआती',
    bestValue: 'बेस्ट वैल्यू',
    highSplit: 'हाई स्प्लिट',
    scalpers: 'स्कैल्पर्स',
    instantFunding: 'इंस्टेंट फंडिंग',
    highestRating: 'सबसे ऊंची रेटिंग',
    lowestPrice: 'सबसे कम कीमत',
    highestSplit: 'सबसे ऊंचा स्प्लिट',
    bestDeals: 'बेस्ट डील्स',
    mostReviews: 'सबसे ज़्यादा रिव्यू',
    copied: 'कॉपी हो गया!',
    rateBtn: 'रेट करें',
    communityRating: 'कम्युनिटी',
    writeReview: 'रेट करें',
    shareExperience: 'अपना अनुभव साझा करें',
    yourRating: 'आपकी रेटिंग',
    tradingStyleUsed: 'आपका ट्रेडिंग स्टाइल',
    commentPlaceholder: 'आपका अनुभव कैसा था? पेआउट, सपोर्ट, नियम...',
    submitReview: 'रिव्यू सबमिट करें',
    submitting: 'सबमिट हो रहा है...',
    reviewSubmitted: 'रिव्यू सबमिट हो गया! धन्यवाद 🙏',
    alreadyReviewedNote: 'आपने इस firm को पहले ही रेट किया है — सबमिट करने से आपका रिव्यू अपडेट होगा।',
    signInToReview: 'रेट करने के लिए साइन इन करें',
    thankYouReview: 'धन्यवाद!',
    thankYouSub: 'आपका रिव्यू कम्युनिटी की मदद करता है।',
    submitPayout: 'पेआउट प्रूफ सबमिट करें',
    payoutAmount: 'पेआउट राशि',
    payoutCurrency: 'मुद्रा',
    payoutDate: 'पेआउट तिथि',
    payoutScreenshot: 'स्क्रीनशॉट (वैकल्पिक)',
    payoutScreenshotHint: 'प्रूफ स्क्रीनशॉट अपलोड करें',
    submitPayoutBtn: 'प्रूफ सबमिट करें',
    payoutSubmitted: '💰 प्रूफ सबमिट हो गया!',
    signInToPayout: 'सबमिट करने के लिए साइन इन करें',
    thankYouPayout: 'प्रूफ सबमिट!',
    thankYouPayoutSub: 'कम्युनिटी की मदद के लिए धन्यवाद।',
    payoutBadge: 'पेआउट',
    removeScreenshot: 'हटाएं',
    payoutAmountPlaceholder: 'जैसे 1500',
  },
};

import { 
  Search, ChevronDown, Star, Check, X, 
  Grid3X3, List, ExternalLink,
  BarChart3, Tag, BadgeCheck, Copy, CheckCircle2,
  ChevronLeft, ChevronRight, RotateCcw,
  Heart, GitCompare, Zap, TrendingUp,
  DollarSign, Users, Flame, MessageSquare,
  Banknote, Upload, ImageIcon, Sparkles
} from 'lucide-react'
import { PriceAlertButton } from '@/components/PriceAlert'
import { toArray } from '@/lib/to-array'

// =====================================================
// TYPES
// =====================================================
interface PropFirm {
  id: string
  name: string
  slug: string
  logo_url: string
  website_url: string
  affiliate_url: string
  trustpilot_rating: number
  trustpilot_reviews: number
  propfirmmatch_rating: number
  min_price: number
  profit_split: number
  max_profit_split: number
  max_daily_drawdown: number
  max_total_drawdown: number
  profit_target_phase1: number
  profit_target_phase2: number
  min_trading_days: number
  time_limit: string
  drawdown_type: string
  payout_frequency: string
  allows_scalping: boolean
  allows_news_trading: boolean
  allows_ea: boolean
  allows_weekend_holding: boolean
  has_instant_funding: boolean
  has_free_repeat: boolean
  fee_refund: boolean
  scaling_max: string
  consistency_rule: string
  platforms: string[]
  assets: string[]
  challenge_types: string[]
  special_features: string[]
  trust_status: string
  is_futures: boolean
  discount_code: string
  discount_percent: number
  discount_expires_at?: string | null
  year_founded: number
  headquarters: string
  priority_tier: number | null
}

interface ReviewAggregate {
  avg: number
  count: number
}

interface PayoutAggregate {
  count: number
  totalAmount: number
}

// Shadow firms: unlisted firms visible only when user searches by name.
// Minimal shape — only fields needed for the shadow card display.
interface ShadowFirm {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website_url: string | null
  trust_status: string
  min_price: number | null
  max_profit_split: number | null
  trustpilot_rating: number | null
  trustpilot_reviews: number | null
}

interface ComparePageClientProps {
  firms: PropFirm[]
  shadowFirms?: ShadowFirm[]
}

interface FilterState {
  search: string
  markets: string[]
  platforms: string[]
  tradingStyles: string[]
  ratings: number[]
  challengeTypes: string[]
  bestFor: string[]
  priceRange: [number, number]
  hasDiscount: boolean
  verifiedOnly: boolean
}

// =====================================================
// CONSTANTS
// =====================================================
const MARKET_OPTIONS = ['Forex', 'Futures', 'Crypto', 'Indices', 'Metals', 'Stocks'] as const

const PLATFORM_OPTIONS = ['MT4', 'MT5', 'cTrader', 'DXtrade', 'TradeLocker', 'Match-Trader', 'NinjaTrader', 'Tradovate'] as const

const TRADING_STYLE_OPTIONS = [
  { key: 'scalping', label: 'Scalping', field: 'allows_scalping' },
  { key: 'news', label: 'News Trading', field: 'allows_news_trading' },
  { key: 'ea', label: 'EAs/Bots', field: 'allows_ea' },
  { key: 'swing', label: 'Swing/Weekend', field: 'allows_weekend_holding' },
] as const

const RATING_OPTIONS = [4.0, 4.3, 4.5, 4.7] as const

const CHALLENGE_TYPE_OPTIONS = ['Instant', '1-Step', '2-Step', '3-Step'] as const

const BEST_FOR_OPTIONS = [
  { key: 'beginners', label: 'Beginners', icon: Users },
  { key: 'value', label: 'Best Value', icon: DollarSign },
  { key: 'highsplit', label: 'High Split', icon: TrendingUp },
  { key: 'scalpers', label: 'Scalpers', icon: Flame },
  { key: 'instant', label: 'Instant Funding', icon: Zap },
] as const

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rating' },
  { value: 'price', label: 'Lowest Price' },
  { value: 'split', label: 'Highest Split' },
  { value: 'discount', label: 'Best Deals' },
  { value: 'reviews', label: 'Most Reviews' },
]

const BLOCKLIST_FIRMS = ['fundedtech', 'fake prop firm', 'test firm']

const CANONICAL_FIRMS: Record<string, { canonical: string; aliases: string[] }> = {
  'fundednext': { canonical: 'FundedNext', aliases: ['funded next', 'fundednext futures'] },
  'the5ers': { canonical: 'The5ers', aliases: ['the 5ers', 'the5%ers'] },
  'ftmo': { canonical: 'FTMO', aliases: ['ftmo.com'] },
  'myfundedfx': { canonical: 'MyFundedFX', aliases: ['my funded fx'] },
  'topstep': { canonical: 'Topstep', aliases: ['topstep trader'] },
}

const TRADING_STYLES_REVIEW = ['Scalping', 'Day Trading', 'Swing', 'News Trading', 'EAs/Bots']

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

const PAYOUT_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY'] as const

// =====================================================
// HOOKS
// =====================================================
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) setStoredValue(JSON.parse(item))
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])
  
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error)
        }
      }
      return valueToStore
    })
  }, [key])
  
  return [storedValue, setValue]
}

// =====================================================
// HELPERS
// =====================================================
// `platforms` and `challenge_types` are typed TEXT in the database but declared
// as string[] on the PropFirm interface. A string passes every `.length` guard
// and then throws on `.forEach` / `.map`, which takes the entire page down and
// is invisible at build time. Every firm is normalised once in processedFirms.

const normalizeFirmArrays = (firm: PropFirm): PropFirm => {
  const listCol = toArray((firm as { platforms_list?: unknown }).platforms_list)
  return {
    ...firm,
    platforms: listCol.length > 0 ? listCol : toArray(firm.platforms),
    assets: toArray(firm.assets),
    challenge_types: toArray(firm.challenge_types),
  }
}

const normalizeMarkets = (assets: string[] | undefined, isFutures: boolean): string[] => {
  const markets: string[] = []
  if (isFutures) markets.push('Futures')
  if (!assets || assets.length === 0) return isFutures ? ['Futures'] : ['Forex']
  assets.forEach(asset => {
    const lower = asset.toLowerCase()
    if (lower.includes('forex') || lower.includes('fx') || lower.includes('eur') || lower.includes('usd')) { if (!markets.includes('Forex')) markets.push('Forex') }
    if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('btc')) { if (!markets.includes('Crypto')) markets.push('Crypto') }
    if (lower.includes('indices') || lower.includes('index') || lower.includes('nas') || lower.includes('dow')) { if (!markets.includes('Indices')) markets.push('Indices') }
    if (lower.includes('metal') || lower.includes('gold') || lower.includes('xau')) { if (!markets.includes('Metals')) markets.push('Metals') }
    if (lower.includes('stock') || lower.includes('equity')) { if (!markets.includes('Stocks')) markets.push('Stocks') }
    if (lower.includes('futures') || lower.includes('future')) { if (!markets.includes('Futures')) markets.push('Futures') }
  })
  if (markets.length === 0) markets.push('Forex')
  return markets
}

const formatReviewCount = (count: number | null | undefined): string => {
  if (!count) return ''
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`
  return count.toString()
}

const formatProfitSplit = (start: number | null | undefined, max: number | null | undefined): string => {
  if (!start && !max) return 'N/A'
  if (!start) return `${max}%`
  if (!max) return `${start}%`
  const minVal = Math.min(start, max), maxVal = Math.max(start, max)
  if (minVal === maxVal) return `${minVal}%`
  return `${minVal}→${maxVal}%`
}

const isBlocklisted = (name: string): boolean => BLOCKLIST_FIRMS.some(b => name.toLowerCase().includes(b))

const getCanonicalName = (name: string): string => {
  const lower = name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '')
  for (const [key, value] of Object.entries(CANONICAL_FIRMS)) {
    if (lower.includes(key) || value.aliases.some(a => lower.includes(a.replace(/\s+/g, '')))) return value.canonical
  }
  return name
}

// CLICK TRACKING: outbound clicks go through /api/go/{slug} which logs
// the click server-side, then redirects to the firm's affiliate or
// website URL. The Google fallback stays direct (it's an external search,
// not a firm we want to track).
const getFirmUrl = (firm: PropFirm, source = 'compare-card'): string => {
  const hasOutbound = (firm.affiliate_url && firm.affiliate_url !== '#')
    || (firm.website_url && firm.website_url !== '#')
  if (hasOutbound) return `/api/go/${firm.slug}?source=${source}`
  return `https://www.google.com/search?q=${encodeURIComponent(firm.name + ' prop firm')}`
}

// ORDRE DE LA LISTE : un code promo en cours, puis un lien affilie sans code,
// puis le reste. Un code expire ne compte pas — il enverrait le visiteur vers
// une remise qui ne s'applique plus.
const codeEnCours = (firm: PropFirm): boolean => {
  if (!firm.discount_code || !firm.discount_code.trim()) return false
  if ((firm.discount_percent ?? 0) <= 0) return false
  if (!firm.discount_expires_at) return true
  const fin = new Date(firm.discount_expires_at).getTime()
  return Number.isNaN(fin) || fin > Date.now()
}

const rangCommercial = (firm: PropFirm): number => {
  if (codeEnCours(firm)) return 0
  return firm.affiliate_url && firm.affiliate_url !== '#' ? 1 : 2
}

const isOutboundFirmUrl = (firm: PropFirm): boolean => {
  return !!((firm.affiliate_url && firm.affiliate_url !== '#')
    || (firm.website_url && firm.website_url !== '#'))
}

const getBestForScore = (firm: PropFirm, category: string): number => {
  switch (category) {
    case 'beginners': {
      let score = 0
      if (firm.min_price && firm.min_price <= 100) score += 30
      if (firm.trustpilot_rating >= 4.3) score += 25
      if (firm.max_daily_drawdown === 0 || firm.max_daily_drawdown >= 5) score += 20
      if (firm.min_trading_days === 0) score += 15
      if (firm.fee_refund) score += 10
      return score
    }
    case 'value': {
      let vScore = 0
      if (firm.min_price && firm.min_price <= 50) vScore += 35
      if (firm.max_profit_split >= 90) vScore += 25
      if (firm.discount_percent > 0) vScore += 20
      if (firm.fee_refund) vScore += 20
      return vScore
    }
    case 'highsplit':
      return firm.max_profit_split >= 90 ? 100 : firm.max_profit_split >= 80 ? 50 : 0
    case 'scalpers': {
      let sScore = 0
      if (firm.allows_scalping) sScore += 50
      if (firm.max_daily_drawdown >= 5) sScore += 25
      if (firm.trustpilot_rating >= 4) sScore += 25
      return sScore
    }
    case 'instant':
      return firm.has_instant_funding ? 100 : 0
    default:
      return 0
  }
}

const normalizeChallengeType = (types: string[] | undefined): string[] => {
  if (!types || types.length === 0) return []
  const normalized: string[] = []
  types.forEach(t => {
    const lower = t.toLowerCase()
    if (lower.includes('instant') || lower.includes('direct') || lower.includes('express')) normalized.push('Instant')
    if (lower.includes('1') || lower.includes('one') || lower.includes('single')) normalized.push('1-Step')
    if (lower.includes('2') || lower.includes('two') || lower.includes('standard')) normalized.push('2-Step')
    if (lower.includes('3') || lower.includes('three')) normalized.push('3-Step')
  })
  return Array.from(new Set(normalized))
}

// =====================================================
// COMPONENTS
// =====================================================
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer) }, [onClose])
  return (
    <div role="alert" aria-live="polite" className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 ${type === 'success' ? 'bg-accent-hover' : 'bg-red-500'} text-white`}>
      {type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

const TrustBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    // PropFirmScanner statuses
    scanned:         { bg: 'bg-accent/10', text: 'text-accent', label: 'Scanned \u2713' },
    unverified:      { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  label: 'Unverified' },
    not_recommended: { bg: 'bg-red-500/20',     text: 'text-red-400',     label: 'Not Recommended' },
    // Legacy (backward compat)
    verified:        { bg: 'bg-accent/10', text: 'text-accent', label: 'Scanned \u2713' },
    trusted:         { bg: 'bg-accent/10', text: 'text-accent', label: 'Scanned \u2713' },
    banned:          { bg: 'bg-red-500/20',     text: 'text-red-400',     label: 'Not Recommended' },
    closed:          { bg: 'bg-red-500/20',     text: 'text-red-400',     label: 'Not Recommended' },
    under_review:    { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  label: 'Unverified' },
    unknown:         { bg: 'bg-yellow-500/20',  text: 'text-yellow-400',  label: 'Unverified' },
    new:             { bg: 'bg-blue-500/20',    text: 'text-blue-400',    label: 'New' },
  }
  const cfg = config[status] || config.unverified
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
      <BadgeCheck className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  )
}

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg-base px-3 py-1.5 text-sm text-text-primary">
    {label}
    <button onClick={onRemove} className="text-text-muted hover:text-text-primary" aria-label={`Remove ${label} filter`}><X className="h-3 w-3" /></button>
  </span>
)

const FilterDropdown = ({ 
  label, count, children, colorClass = 'emerald', isOpen, onToggle
}: { 
  label: string; count: number; children: React.ReactNode
  colorClass?: 'emerald' | 'purple' | 'yellow' | 'blue' | 'orange'
  isOpen: boolean; onToggle: () => void
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onToggle])
  
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onToggle()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onToggle])
  
  const hasSelection = count > 0
  const colorStyles = {
    emerald: { bg: 'bg-accent/10', text: 'text-accent', ring: 'ring-accent/50', badge: 'bg-accent-hover' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', ring: 'ring-purple-500/50', badge: 'bg-purple-500' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/50', badge: 'bg-yellow-500' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/50', badge: 'bg-blue-500' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', ring: 'ring-orange-500/50', badge: 'bg-orange-500' },
  }
  const colors = colorStyles[colorClass]
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label} filter${hasSelection ? `, ${count} selected` : ''}`}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
          hasSelection
            ? 'border-accent-border bg-accent-subtle text-accent'
            : 'border-border bg-bg-base text-text-secondary hover:border-border-hover'
        }`}
      >
        {label}
        {hasSelection && <span className="rounded-full bg-accent-hover px-1.5 py-0.5 font-mono text-[11px] text-white">{count}</span>}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div role="listbox" className="animate-in fade-in-0 zoom-in-95 absolute left-0 top-full z-50 mt-1 max-w-[280px] min-w-[200px] rounded-xl border border-border bg-bg-elevated p-3 shadow-xl duration-150">
          {children}
        </div>
      )}
    </div>
  )
}

const PriceSlider = ({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) => {
  const [localMax, setLocalMax] = useState(value[1])
  useEffect(() => { setLocalMax(value[1]) }, [value])
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-text-secondary">
        <span>$0</span>
        <span className="text-accent font-medium">{localMax >= 1000 ? 'Any' : `$${localMax}`}</span>
      </div>
      <input
        type="range" min={0} max={1000} step={25} value={localMax}
        onChange={(e) => setLocalMax(parseInt(e.target.value))}
        onMouseUp={() => onChange([0, localMax])}
        onTouchEnd={() => onChange([0, localMax])}
        aria-label="Maximum price filter"
        className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>$0</span><span>$250</span><span>$500</span><span>$750</span><span>$1000+</span>
      </div>
    </div>
  )
}

// =====================================================
// REVIEW MODAL
// =====================================================
const ReviewModal = ({
  firm,
  t,
  onClose,
  onSubmit,
  alreadyReviewed,
}: {
  firm: PropFirm
  t: Record<string, string>
  onClose: () => void
  onSubmit: (firmId: string, rating: number, comment: string, style: string) => Promise<void>
  alreadyReviewed: boolean
}) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [tradingStyle, setTradingStyle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleSubmit = async () => {
    if (rating === 0) return
    setIsSubmitting(true)
    await onSubmit(firm.id, rating, comment, tradingStyle)
    setSubmitted(true)
    setIsSubmitting(false)
    setTimeout(onClose, 2200)
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-text-primary font-bold text-xl mb-1">{t.thankYouReview}</h3>
            <p className="text-text-secondary text-sm">{t.thankYouSub}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 flex-shrink-0">
                  {firm.logo_url
                    ? <Image src={firm.logo_url} alt={firm.name} width={40} height={40} className="object-contain" />
                    : <span className="font-bold text-accent text-lg">{firm.name[0]}</span>
                  }
                </div>
                <div>
                  <h3 className="text-text-primary font-bold text-base">{firm.name}</h3>
                  <p className="text-text-secondary text-xs">{t.shareExperience}</p>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-sm text-text-secondary mb-2">{t.yourRating} *</p>
              <div className="flex gap-2 mb-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star className={`w-9 h-9 transition-colors ${(hoverRating || rating) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted'}`} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-yellow-400 font-medium">{RATING_LABELS[rating]}</p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">{t.tradingStyleUsed}</p>
              <div className="flex flex-wrap gap-2">
                {TRADING_STYLES_REVIEW.map(style => (
                  <button
                    key={style}
                    onClick={() => setTradingStyle(prev => prev === style ? '' : style)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      tradingStyle === style
                        ? 'bg-accent-hover text-white'
                        : 'bg-bg-base text-text-secondary hover:bg-bg-elevated'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm text-text-secondary mb-2">Your experience <span className="text-text-muted">(optional)</span></p>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={t.commentPlaceholder}
                className="w-full bg-bg-base border border-border rounded-xl p-3 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent transition-colors"
                rows={3}
                maxLength={500}
              />
              <p className="text-[10px] text-text-muted text-right mt-0.5">{comment.length}/500</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="w-full py-3 bg-accent-hover hover:brightness-110 disabled:bg-bg-elevated disabled:text-text-muted disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {isSubmitting ? t.submitting : t.submitReview}
            </button>

            {alreadyReviewed && (
              <p className="text-center text-xs text-yellow-400 mt-3">
                ⚠️ {t.alreadyReviewedNote}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// =====================================================
// PAYOUT PROOF MODAL
// =====================================================
const PayoutProofModal = ({
  firm,
  t,
  onClose,
  onSubmit,
}: {
  firm: PropFirm
  t: Record<string, string>
  onClose: () => void
  onSubmit: (firmId: string, amount: number, currency: string, date: string, file: File | null) => Promise<void>
}) => {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [date, setDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    if (!selected) return
    setFile(selected)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) return
    setIsSubmitting(true)
    await onSubmit(firm.id, parsedAmount, currency, date, file)
    setSubmitted(true)
    setIsSubmitting(false)
    setTimeout(onClose, 2400)
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-bg-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Banknote className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-text-primary font-bold text-xl mb-1">{t.thankYouPayout}</h3>
            <p className="text-text-secondary text-sm">{t.thankYouPayoutSub}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 flex-shrink-0">
                  {firm.logo_url
                    ? <Image src={firm.logo_url} alt={firm.name} width={40} height={40} className="object-contain" />
                    : <span className="font-bold text-accent text-lg">{firm.name[0]}</span>
                  }
                </div>
                <div>
                  <h3 className="text-text-primary font-bold text-base">{firm.name}</h3>
                  <p className="text-text-secondary text-xs">{t.submitPayout}</p>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Amount + Currency */}
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">{t.payoutAmount} *</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={t.payoutAmountPlaceholder}
                  className="flex-1 bg-bg-base border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
                />
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  aria-label={t.payoutCurrency}
                  className="w-24 bg-bg-base border border-border rounded-xl px-2 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  {PAYOUT_CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">{t.payoutDate} <span className="text-text-muted">(optional)</span></p>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-bg-base border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Screenshot upload */}
            <div className="mb-5">
              <p className="text-sm text-text-secondary mb-2">{t.payoutScreenshot}</p>
              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-bg-base">
                  <img src={preview} alt="Payout screenshot preview" className="w-full max-h-40 object-contain" />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1.5 bg-bg-elevated/80 hover:bg-red-500/80 rounded-lg text-white transition-colors"
                    aria-label="Remove screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-bg-elevated/80 rounded-lg px-2 py-0.5">
                    <p className="text-[10px] text-text-secondary truncate max-w-[200px]">{file?.name}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border hover:border-accent/50 rounded-xl p-4 flex flex-col items-center gap-2 text-text-muted hover:text-text-secondary transition-colors group"
                >
                  <ImageIcon className="w-7 h-7 group-hover:text-accent transition-colors" />
                  <span className="text-xs">{t.payoutScreenshotHint}</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload screenshot"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount) <= 0 || isNaN(parseFloat(amount)) || isSubmitting}
              className="w-full py-3 bg-accent-hover hover:brightness-110 disabled:bg-bg-elevated disabled:text-text-muted disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>{t.submitting}</span>
              ) : (
                <>
                  <Banknote className="w-4 h-4" />
                  <span>{t.submitPayoutBtn}</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// =====================================================
// PROP FIRM CARD
// =====================================================
const PropFirmCard = ({ 
  firm, isCompact, rank, markets,
  isFavorite, onFavorite,
  isComparing, onCompare,
  onCopyCode,
  communityRating,
  onRate,
  hasReviewed,
  payoutAggregate,
  onPayout,
  t,
}: { 
  firm: PropFirm
  isCompact: boolean
  rank: number
  markets: string[]
  isFavorite: boolean
  onFavorite: () => void
  isComparing: boolean
  onCompare: () => void
  onCopyCode: (code: string) => void
  communityRating: ReviewAggregate | null
  onRate: () => void
  hasReviewed: boolean
  payoutAggregate: PayoutAggregate | null
  onPayout: () => void
  t: Record<string, string>
}) => {
  const hasDiscount = firm.discount_percent && firm.discount_percent > 0
  const isTopPick = firm.priority_tier === 1
  
  if (isCompact) {
    return (
      <div className={`group bg-bg-elevated hover:bg-bg-base border rounded-lg p-3 transition-colors ${
        isTopPick
          ? 'border-accent/40 hover:border-accent/70'
          : 'border-border/50 hover:border-border-hover'
      }`}>
        <div className="flex items-center gap-3">
          {/* Logo links to the internal firm page (SEO + detail content).
              The Visit button to the right handles the outbound affiliate link. */}
          <Link href={`/prop-firm/${firm.slug}`} className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1 flex-shrink-0 hover:ring-2 hover:ring-accent/40 transition-all">
            {firm.logo_url ? <Image src={firm.logo_url} alt={firm.name} width={40} height={40} className="object-contain" /> : <span className="text-lg font-bold text-accent">{firm.name.charAt(0)}</span>}
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link href={`/prop-firm/${firm.slug}`} className="font-semibold text-text-primary hover:text-accent truncate text-sm flex-1 min-w-0 transition-colors">{firm.name}</Link>
              {isTopPick && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/30 text-[9px] font-semibold tracking-wider uppercase flex-shrink-0">
                  <Star className="w-2 h-2 fill-emerald-400" />
                  Top
                </span>
              )}
              <TrustBadge status={firm.trust_status || 'verified'} />
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary mt-0.5 flex-wrap">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
              {communityRating && communityRating.count > 0 && (
                <span className="flex items-center gap-1 text-text-secondary">
                  <MessageSquare className="w-3 h-3" />{communityRating.avg.toFixed(1)} ({communityRating.count})
                </span>
              )}
              {payoutAggregate && payoutAggregate.count > 0 && (
                <span className="flex items-center gap-1 text-accent">
                  <Banknote className="w-3 h-3" />{payoutAggregate.count} {t.payoutBadge}
                </span>
              )}
              <span>${firm.min_price || 'N/A'}</span>
              <span className="text-accent">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</span>
            </div>
          </div>
          {hasDiscount && (
            <span className="px-2 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[11px] font-semibold rounded-md uppercase tracking-wider">-{firm.discount_percent}%</span>
          )}
          <div className="flex items-center gap-1">
            <button onClick={onFavorite} aria-label={isFavorite ? `Remove ${firm.name} from favorites` : `Add ${firm.name} to favorites`} aria-pressed={isFavorite} className={`p-2 rounded-lg transition-all ${isFavorite ? 'text-red-400 bg-red-500/20' : 'text-text-muted hover:text-red-400 hover:bg-bg-elevated'}`}>
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button onClick={onRate} aria-label={`Rate ${firm.name}`} title={hasReviewed ? 'Update your review' : 'Rate this firm'} className={`p-2 rounded-lg transition-all ${hasReviewed ? 'text-yellow-400 bg-yellow-500/20' : 'text-text-muted hover:text-yellow-400 hover:bg-bg-elevated'}`}>
              <Star className={`w-4 h-4 ${hasReviewed ? 'fill-current' : ''}`} />
            </button>
            <button onClick={onPayout} aria-label={`Submit payout proof for ${firm.name}`} title="Submit payout proof" className="p-2 rounded-lg transition-all text-text-muted hover:text-accent hover:bg-bg-elevated">
              <Banknote className="w-4 h-4" />
            </button>
            <PriceAlertButton firmId={firm.id} firmName={firm.name} firmSlug={firm.slug} currentPrice={firm.min_price || 0} />
            {/* "Details" removed — clicking the logo / firm name reaches the
                same internal page. Only outbound CTA remains: the affiliate. */}
            <a href={getFirmUrl(firm, 'compare-list')} target="_blank" rel="noopener noreferrer" className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1 transition-colors ${
              hasDiscount
                ? 'bg-accent-hover hover:brightness-110 text-white'
                : firm.affiliate_url
                ? 'bg-accent/10 hover:bg-accent/25 text-accent border border-accent/30'
                : 'bg-bg-base hover:bg-bg-elevated text-text-secondary border border-border'
            }`}>
              {hasDiscount ? `Get -${firm.discount_percent}%` : t.visit} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Carte en mode grille, refaite le 23/09/2026 d'apres la maquette :
  // en-tete, preuves, chiffres, permissions, promo, actions, pied de carte.
  // Seules la presentation et les classes changent ; les donnees et les
  // rappels (favori, comparaison, note, preuve de paiement, alerte) sont ceux
  // d'avant.
  const pills = [
    firm.allows_scalping && t.scalping,
    firm.allows_news_trading && 'News',
    firm.allows_ea && 'EAs',
  ].filter(Boolean) as string[]

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border bg-bg-elevated p-4 transition-colors ${
      isTopPick ? 'border-accent-border hover:border-accent' : 'border-border hover:border-border-hover'
    }`}>
      {/* a) En-tete : logo, nom, badges, favori */}
      <div className="flex items-start gap-3">
        <Link href={`/prop-firm/${firm.slug}`} className="flex h-[42px] w-[42px] flex-none items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5">
          {firm.logo_url
            ? <Image src={firm.logo_url} alt={firm.name} width={42} height={42} className="object-contain" />
            : <span className="font-display text-lg font-bold text-accent">{firm.name.charAt(0)}</span>}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/prop-firm/${firm.slug}`} className="block truncate font-display text-base font-semibold text-text-primary hover:text-accent">
            {firm.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {isTopPick ? (
              <span className="rounded-md bg-accent-hover px-1.5 py-0.5 text-[11px] font-semibold text-white">Top Pick</span>
            ) : rank <= 3 ? (
              <span className="rounded-md border border-border bg-bg-base px-1.5 py-0.5 font-mono text-[11px] font-semibold text-text-secondary">#{rank}</span>
            ) : null}
            <TrustBadge status={firm.trust_status || 'verified'} />
          </div>
        </div>
        <button
          onClick={onFavorite}
          aria-label={isFavorite ? `Remove ${firm.name} from favorites` : `Add ${firm.name} to favorites`}
          aria-pressed={isFavorite}
          className={`grid h-[34px] w-[34px] flex-none place-items-center rounded-lg transition-colors ${
            isFavorite ? 'text-red-500 dark:text-red-400' : 'text-text-muted hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          <Heart className={`h-[18px] w-[18px] ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* b) Ligne de preuves */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-text-secondary">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-mono font-semibold tabular-nums text-text-primary">{firm.trustpilot_rating?.toFixed(1) || 'N/A'}</span>
          {firm.trustpilot_reviews ? <span className="text-text-muted">({formatReviewCount(firm.trustpilot_reviews)})</span> : null}
        </span>
        {communityRating && communityRating.count > 0 && (
          <span className="text-text-muted">{t.communityRating} {communityRating.avg.toFixed(1)} ({communityRating.count})</span>
        )}
        {payoutAggregate && payoutAggregate.count > 0 && (
          <span className="font-medium text-accent">{payoutAggregate.count} {t.payoutBadge}</span>
        )}
      </div>

      {/* c) Prix et split : deux cellules separees par un filet */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border">
        <div className="bg-bg-base px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wider text-text-muted">{t.price}</dt>
          <dd className="mt-0.5 font-mono text-[19px] font-semibold tabular-nums text-text-primary">${firm.min_price || 'N/A'}</dd>
        </div>
        <div className="bg-bg-base px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wider text-text-muted">{t.split}</dt>
          <dd className="mt-0.5 font-mono text-[19px] font-semibold tabular-nums text-accent">{formatProfitSplit(firm.profit_split, firm.max_profit_split)}</dd>
        </div>
      </dl>

      {/* d) Ce que la firme autorise. La hauteur est reservee meme sans
             pastille, pour que les cartes restent alignees. */}
      <div className="flex min-h-6 flex-wrap gap-1.5">
        {pills.map(p => (
          <span key={p} className="rounded-lg border border-accent-border bg-accent-subtle px-2 py-0.5 text-xs font-medium text-accent">✓ {p}</span>
        ))}
        {firm.has_instant_funding && (
          <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500 dark:text-amber-400">⚡ Instant</span>
        )}
      </div>

      {/* e) Promo */}
      {hasDiscount && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 px-3 py-2">
          <span className="text-sm font-bold text-amber-500 dark:text-amber-400">−{firm.discount_percent}%</span>
          {firm.discount_code && (
            <>
              <span className="font-mono text-[13px] font-semibold tracking-wide text-text-primary">{firm.discount_code}</span>
              <button onClick={() => onCopyCode(firm.discount_code)} aria-label={`Copy discount code ${firm.discount_code}`} className="flex items-center gap-1 text-xs font-medium text-amber-500 dark:text-amber-400">
                <Copy className="h-3 w-3" />Copy
              </button>
            </>
          )}
        </div>
      )}

      {/* f) Actions : sortie principale, puis ajout au comparateur */}
      <div className="mt-auto flex gap-2">
        <a
          href={getFirmUrl(firm, 'compare-grid')}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-colors ${
            hasDiscount
              ? 'bg-accent-hover text-white hover:brightness-110'
              : firm.affiliate_url
              ? 'border border-accent text-accent hover:bg-accent-subtle'
              : 'border border-border bg-bg-base text-text-secondary hover:border-border-hover'
          }`}
        >
          {hasDiscount ? `Get -${firm.discount_percent}%` : firm.affiliate_url ? `${t.visit} ${firm.name}` : 'Visit Site'}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={onCompare}
          aria-pressed={isComparing}
          aria-label={isComparing ? `Remove ${firm.name} from comparison` : `Add ${firm.name} to comparison`}
          className={`flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors ${
            isComparing ? 'border-accent bg-accent-subtle text-accent' : 'border-border bg-bg-base text-text-secondary hover:border-border-hover'
          }`}
        >
          <span className={`grid h-[15px] w-[15px] place-items-center rounded border ${
            isComparing ? 'border-accent-hover bg-accent-hover text-white' : 'border-border-hover'
          }`}>
            {isComparing && <Check className="h-2.5 w-2.5" />}
          </span>
          {t.compare}
        </button>
      </div>

      {/* g) Pied de carte : les actions secondaires, avec leur libelle */}
      <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs text-text-muted">
        <button onClick={onRate} className={`flex min-h-8 items-center gap-1 ${hasReviewed ? 'text-yellow-500 dark:text-yellow-400' : 'hover:text-text-secondary'}`}>
          <Star className={`h-3.5 w-3.5 ${hasReviewed ? 'fill-current' : ''}`} />{t.writeReview}
        </button>
        <button onClick={onPayout} className="flex min-h-8 items-center gap-1 hover:text-text-secondary">
          <Banknote className="h-3.5 w-3.5" />{t.submitPayout}
        </button>
        <PriceAlertButton firmId={firm.id} firmName={firm.name} firmSlug={firm.slug} currentPrice={firm.min_price || 0} />
      </div>
    </div>
  )
}

const CompareBar = ({ firms, onRemove, onClear }: { firms: PropFirm[]; onRemove: (id: string) => void; onClear: () => void }) => {
  if (firms.length === 0) return null
  const compareUrl = `/compare/${firms.map(f => f.slug).join('-vs-')}`
  // Deux firmes au moins pour comparer : en dessous, le bouton le dit plutot
  // que de mener a une page vide (23/09/2026).
  const pret = firms.length >= 2
  const indice = firms.length < 2
    ? 'Select at least 2 firms'
    : firms.length < 4
    ? `Up to ${4 - firms.length} more`
    : 'Maximum 4 firms'
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg-elevated px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="sm:hidden text-sm text-text-secondary">{firms.length} selected</span>
          {firms.map(f => (
            <span key={f.id} className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-bg-base py-1.5 pl-1.5 pr-2.5">
              <span className="flex h-[26px] w-[26px] items-center justify-center overflow-hidden rounded-lg bg-white p-0.5">
                {f.logo_url
                  ? <Image src={f.logo_url} alt={f.name} width={26} height={26} className="object-contain" />
                  : <span className="text-xs font-bold text-accent">{f.name.charAt(0)}</span>}
              </span>
              <span className="text-[13px] font-medium text-text-primary">{f.name}</span>
              <button onClick={() => onRemove(f.id)} aria-label={`Remove ${f.name} from comparison`} className="text-text-muted hover:text-text-primary"><X className="h-3 w-3" /></button>
            </span>
          ))}
          <span className="text-xs text-text-muted">{indice}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onClear} className="text-sm text-text-muted underline hover:text-text-primary">Clear</button>
          {pret ? (
            <Link href={compareUrl} className="rounded-xl bg-accent-hover px-4 py-2.5 text-sm font-medium text-white hover:brightness-110">Compare Now</Link>
          ) : (
            <span aria-disabled="true" className="cursor-not-allowed rounded-xl border border-border bg-bg-base px-4 py-2.5 text-sm font-medium text-text-muted">Compare Now</span>
          )}
        </div>
      </div>
    </div>
  )
}

const CardSkeleton = () => (
  <div className="bg-bg-elevated border border-border/50 rounded-xl overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-bg-elevated" />
        <div className="flex-1">
          <div className="h-5 bg-bg-elevated rounded w-2/3 mb-2" />
          <div className="h-4 bg-bg-elevated rounded w-1/3" />
        </div>
      </div>
    </div>
    <div className="px-4 py-3 bg-bg-elevated/50 border-y border-border/50 grid grid-cols-2 gap-3">
      <div className="h-10 bg-bg-elevated rounded" />
      <div className="h-10 bg-bg-elevated rounded" />
    </div>
    <div className="p-4 space-y-3">
      <div className="flex gap-1">
        <div className="h-5 w-12 bg-bg-elevated rounded" />
        <div className="h-5 w-12 bg-bg-elevated rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-bg-elevated rounded-lg" />
        <div className="h-8 flex-1 bg-bg-elevated rounded-lg" />
      </div>
    </div>
  </div>
)

// =====================================================
// SHADOW CARD — for unlisted firms shown via direct search
// Cards are dimmed, never link to affiliate URLs, and display
// a warning banner when the firm is not_recommended.
// =====================================================
const ShadowPropFirmCard = ({ firm }: { firm: ShadowFirm }) => {
  const isNotRecommended = firm.trust_status === 'not_recommended'
  // SAFETY: shadow cards never use affiliate links — only website_url, or nothing
  const visitUrl = firm.website_url && firm.website_url !== '#' ? firm.website_url : null

  return (
    <div
      className={`bg-bg-base/30 border rounded-xl overflow-hidden transition-all flex flex-col opacity-60 hover:opacity-90 ${
        isNotRecommended
          ? 'border-red-500/40 hover:border-red-500/60'
          : 'border-yellow-500/30 hover:border-yellow-500/50'
      }`}
    >
      {/* Warning banner for not_recommended firms */}
      {isNotRecommended && (
        <div className="bg-red-500/15 border-b border-red-500/30 px-3 py-1.5 flex items-center gap-1.5">
          <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-[10px] font-semibold uppercase tracking-wide">
            Not recommended by PropFirmScanner
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Logo + Name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-gray-200 p-1 flex-shrink-0">
            {firm.logo_url ? (
              <Image src={firm.logo_url} alt={firm.name} width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-lg font-bold text-text-muted">{firm.name.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-text-secondary text-sm leading-tight mb-0.5 truncate">{firm.name}</h3>
            <TrustBadge status={firm.trust_status || 'unverified'} />
          </div>
        </div>

        {/* Minimal data */}
        <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
          {firm.trustpilot_rating && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-text-muted" />
              {firm.trustpilot_rating.toFixed(1)}
              {firm.trustpilot_reviews ? (
                <span className="text-text-muted">({formatReviewCount(firm.trustpilot_reviews)})</span>
              ) : null}
            </span>
          )}
          {firm.min_price != null && <span>${firm.min_price}</span>}
          {firm.max_profit_split != null && <span>{firm.max_profit_split}% split</span>}
        </div>

        {/* Single Visit button — website_url only, no affiliate */}
        {visitUrl ? (
          <a
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            title={isNotRecommended ? 'Proceed with caution — this firm is not recommended' : 'Visit firm website'}
            className={`w-full py-2 text-center text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
              isNotRecommended
                ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30'
                : 'bg-bg-elevated/60 hover:bg-bg-elevated text-text-secondary'
            }`}
          >
            Visit site <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <div className="w-full py-2 text-center text-xs text-text-muted bg-bg-elevated/30 rounded-lg">
            No website available
          </div>
        )}
      </div>
    </div>
  )
}

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function ComparePageClient({ firms, shadowFirms = [] }: ComparePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const currentLocale = getLocaleFromPath(pathname)
  const t = translations[currentLocale] || translations.en
  
  const [filters, setFilters] = useState<FilterState>(() => ({
    search: searchParams.get('q') || '',
    markets: searchParams.get('markets')?.split(',').filter(Boolean) || [],
    platforms: searchParams.get('platforms')?.split(',').filter(Boolean) || [],
    tradingStyles: searchParams.get('styles')?.split(',').filter(Boolean) || [],
    ratings: searchParams.get('ratings')?.split(',').map(Number).filter(Boolean) || [],
    challengeTypes: searchParams.get('challenges')?.split(',').filter(Boolean) || [],
    bestFor: searchParams.get('bestFor')?.split(',').filter(Boolean) || [],
    priceRange: [0, parseInt(searchParams.get('maxPrice') || '1000') || 1000],
    hasDiscount: searchParams.get('deals') === 'true',
    verifiedOnly: searchParams.get('verified') !== 'false',
  }))
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  // Shared with the navbar and the offers banner: when those slide away the
  // filter bar takes their place instead of leaving a 4rem gap above itself.
  const headerHidden = useHideOnScrollDown()
  const [currentPage, setCurrentPage] = useState(1)
  const [compareList, setCompareList] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showQuizFloat, setShowQuizFloat] = useState(false)
  
  // Reviews state
  const [reviewAggregates, setReviewAggregates] = useState<Map<string, ReviewAggregate>>(new Map())
  const [userReviewedFirms, setUserReviewedFirms] = useState<Set<string>>(new Set())
  const [reviewModalFirmId, setReviewModalFirmId] = useState<string | null>(null)

  // Payout state
  const [payoutAggregates, setPayoutAggregates] = useState<Map<string, PayoutAggregate>>(new Map())
  const [payoutModalFirmId, setPayoutModalFirmId] = useState<string | null>(null)

  // Favorites — localStorage (optimistic UI) + Supabase sync
  const [favorites, setFavorites] = useLocalStorage<string[]>('pfs_favorites', [])
  const supabase = createClientComponentClient()

  // On mount: load favorites + reviews + payouts from Supabase
  useEffect(() => {
    const loadData = async () => {
      // Load favorites
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: favData } = await supabase
          .from('user_favorites')
          .select('prop_firm_id')
          .eq('user_id', user.id)
        if (favData && favData.length > 0) {
          const dbIds = favData.map((r: any) => r.prop_firm_id as string)
          setFavorites(prev => Array.from(new Set(prev.concat(dbIds))))
        }
        // Load user's own reviews
        const { data: userReviewData } = await supabase
          .from('firm_reviews')
          .select('firm_id')
          .eq('user_id', user.id)
        if (userReviewData) {
          setUserReviewedFirms(new Set(userReviewData.map((r: any) => r.firm_id as string)))
        }
      }
      // Load aggregated community ratings (public)
      const { data: reviewData } = await supabase
        .from('firm_reviews')
        .select('firm_id, rating')
      if (reviewData && reviewData.length > 0) {
        const agg = new Map<string, { sum: number; count: number }>()
        reviewData.forEach((r: any) => {
          const existing = agg.get(r.firm_id) || { sum: 0, count: 0 }
          agg.set(r.firm_id, { sum: existing.sum + r.rating, count: existing.count + 1 })
        })
        const result = new Map<string, ReviewAggregate>()
        agg.forEach((val, key) => result.set(key, { avg: val.sum / val.count, count: val.count }))
        setReviewAggregates(result)
      }
      // Load payout aggregates (public, approved only)
      const { data: payoutData } = await supabase
        .from('payout_proofs')
        .select('firm_id, amount')
        .eq('status', 'approved')
      if (payoutData && payoutData.length > 0) {
        const pagg = new Map<string, { count: number; totalAmount: number }>()
        payoutData.forEach((r: any) => {
          const existing = pagg.get(r.firm_id) || { count: 0, totalAmount: 0 }
          pagg.set(r.firm_id, { count: existing.count + 1, totalAmount: existing.totalAmount + Number(r.amount) })
        })
        setPayoutAggregates(pagg)
      }
    }
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const itemsPerPage = 24
  const debouncedSearch = useDebounce(filters.search, 300)
  const debouncedFilters = useDebounce(filters, 500)
  
  const toggleFavorite = useCallback(async (id: string) => {
    const isCurrentlyFavorite = favorites.includes(id)
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      setToast({ message: prev.includes(id) ? 'Removed from favorites' : 'Added to favorites', type: 'success' })
      return newFavs
    })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      if (isCurrentlyFavorite) {
        await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('prop_firm_id', id)
      } else {
        await supabase.from('user_favorites').upsert({ user_id: user.id, prop_firm_id: id }, { onConflict: 'user_id,prop_firm_id' })
      }
    } catch (err) {
      console.error('Failed to sync favorite to Supabase:', err)
    }
  }, [favorites, setFavorites, supabase])
  
  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(f => f !== id)
      if (prev.length >= 4) { setToast({ message: 'Maximum 4 firms to compare', type: 'error' }); return prev }
      return [...prev, id]
    })
  }, [])
  
  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
    setToast({ message: `Code "${code}" copied!`, type: 'success' })
  }, [])
  
  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown(prev => prev === name ? null : name)
  }, [])

  // Submit a review
  const handleSubmitReview = useCallback(async (firmId: string, rating: number, comment: string, style: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setToast({ message: t.signInToReview, type: 'error' })
      return
    }
    try {
      await supabase
        .from('firm_reviews')
        .upsert(
          {
            user_id: user.id,
            firm_id: firmId,
            rating,
            comment: comment || null,
            trading_style: style || null,
          },
          { onConflict: 'user_id,firm_id' }
        )
      // Optimistic update of community ratings
      setReviewAggregates(prev => {
        const newMap = new Map(prev)
        const existing = newMap.get(firmId)
        const alreadyReviewed = userReviewedFirms.has(firmId)
        if (existing) {
          if (alreadyReviewed) {
            newMap.set(firmId, { avg: (existing.avg * existing.count - existing.avg + rating) / existing.count, count: existing.count })
          } else {
            const newCount = existing.count + 1
            newMap.set(firmId, { avg: (existing.avg * existing.count + rating) / newCount, count: newCount })
          }
        } else {
          newMap.set(firmId, { avg: rating, count: 1 })
        }
        return newMap
      })
      setUserReviewedFirms(prev => new Set(Array.from(prev).concat(firmId)))
      setToast({ message: t.reviewSubmitted, type: 'success' })
    } catch (err) {
      console.error('Failed to submit review:', err)
      setToast({ message: 'Error submitting review', type: 'error' })
    }
  }, [supabase, t, userReviewedFirms])

  // Submit a payout proof
  const handleSubmitPayout = useCallback(async (
    firmId: string,
    amount: number,
    currency: string,
    date: string,
    file: File | null
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setToast({ message: t.signInToPayout, type: 'error' })
      return
    }
    try {
      let screenshotUrl: string | null = null
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${firmId}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('payout-proofs')
          .upload(fileName, file, { contentType: file.type })
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('payout-proofs')
            .getPublicUrl(fileName)
          screenshotUrl = urlData.publicUrl
        }
      }
      await supabase.from('payout_proofs').insert({
        user_id: user.id,
        firm_id: firmId,
        amount,
        currency,
        screenshot_url: screenshotUrl,
        payout_date: date || null,
        status: 'approved',
      })
      // Optimistic update
      setPayoutAggregates(prev => {
        const newMap = new Map(prev)
        const existing = newMap.get(firmId) || { count: 0, totalAmount: 0 }
        newMap.set(firmId, { count: existing.count + 1, totalAmount: existing.totalAmount + amount })
        return newMap
      })
      setToast({ message: t.payoutSubmitted, type: 'success' })
    } catch (err) {
      console.error('Failed to submit payout proof:', err)
      setToast({ message: 'Error submitting payout proof', type: 'error' })
    }
  }, [supabase, t])
  
  // Sync filters to URL (debounced)
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedFilters.search) params.set('q', debouncedFilters.search)
    if (debouncedFilters.markets.length) params.set('markets', debouncedFilters.markets.join(','))
    if (debouncedFilters.platforms.length) params.set('platforms', debouncedFilters.platforms.join(','))
    if (debouncedFilters.tradingStyles.length) params.set('styles', debouncedFilters.tradingStyles.join(','))
    if (debouncedFilters.ratings.length) params.set('ratings', debouncedFilters.ratings.join(','))
    if (debouncedFilters.challengeTypes.length) params.set('challenges', debouncedFilters.challengeTypes.join(','))
    if (debouncedFilters.bestFor.length) params.set('bestFor', debouncedFilters.bestFor.join(','))
    if (debouncedFilters.priceRange[1] < 1000) params.set('maxPrice', String(debouncedFilters.priceRange[1]))
    if (debouncedFilters.hasDiscount) params.set('deals', 'true')
    if (!debouncedFilters.verifiedOnly) params.set('verified', 'false')
    if (sortBy !== 'rating') params.set('sort', sortBy)
    // Sans filtre, on revient au chemin COURANT, pas au '/compare' anglais
    // ecrit en dur : sur /de/compare ou /fr/compare, ce dernier faisait sortir
    // le visiteur de sa langue. pathname porte deja le prefixe de locale.
    const newUrl = params.toString() ? `?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [debouncedFilters, sortBy, router, pathname])
  
  const processedFirms = useMemo(() => {
    const filtered = firms.filter(f => !isBlocklisted(f.name)).map(normalizeFirmArrays)
    const seen = new Map<string, PropFirm>()
    filtered.forEach(firm => {
      const canonical = getCanonicalName(firm.name).toLowerCase().replace(/\s+/g, '')
      const existing = seen.get(canonical)
      if (!existing) { seen.set(canonical, firm) }
      else {
        const score = (f: PropFirm) => (f.website_url && f.website_url !== '#' ? 10 : 0) + (f.affiliate_url ? 5 : 0) + (f.discount_code ? 3 : 0) + (f.trustpilot_rating ? 2 : 0) + (f.min_price ? 1 : 0)
        if (score(firm) > score(existing)) seen.set(canonical, firm)
      }
    })
    return Array.from(seen.values())
  }, [firms])
  
  const firmMarkets = useMemo(() => {
    const map = new Map<string, string[]>()
    processedFirms.forEach(f => map.set(f.id, normalizeMarkets(f.assets, f.is_futures)))
    return map
  }, [processedFirms])
  
  const firmChallengeTypes = useMemo(() => {
    const map = new Map<string, string[]>()
    processedFirms.forEach(f => map.set(f.id, normalizeChallengeType(f.challenge_types)))
    return map
  }, [processedFirms])
  
  const availablePlatforms = useMemo(() => 
    Array.from(new Set(processedFirms.flatMap(f => f.platforms || []))).filter(Boolean).sort()
  , [processedFirms])
  
  const stats = useMemo(() => {
    const verified = processedFirms.filter(f => f.trust_status === 'scanned' || f.trust_status === 'verified' || f.trust_status === 'trusted' || !f.trust_status)
    const discounts = verified.filter(f => f.discount_percent != null && f.discount_percent > 0)
    return { total: verified.length, withDiscounts: discounts.length }
  }, [processedFirms])
  
  const filteredFirms = useMemo(() => {
    let result = [...processedFirms]
    if (filters.verifiedOnly) result = result.filter(f => f.trust_status === 'scanned' || f.trust_status === 'verified' || f.trust_status === 'trusted' || !f.trust_status)
    else result = result.filter(f => f.trust_status !== 'banned')
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(f => f.name?.toLowerCase().includes(q) || f.slug?.toLowerCase().includes(q))
    }
    if (filters.markets.length > 0) {
      result = result.filter(f => { const fMarkets = firmMarkets.get(f.id) || []; return filters.markets.some(m => fMarkets.includes(m)) })
    }
    if (filters.platforms.length > 0) {
      result = result.filter(f => { const fPlatforms = f.platforms || []; return filters.platforms.some(p => fPlatforms.includes(p)) })
    }
    if (filters.tradingStyles.length > 0) {
      result = result.filter(f => filters.tradingStyles.every(style => {
        const styleConfig = TRADING_STYLE_OPTIONS.find(s => s.key === style)
        if (!styleConfig) return true
        return f[styleConfig.field as keyof PropFirm]
      }))
    }
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings)
      result = result.filter(f => f.trustpilot_rating >= minRating)
    }
    if (filters.challengeTypes.length > 0) {
      result = result.filter(f => { const fChallenges = firmChallengeTypes.get(f.id) || []; return filters.challengeTypes.some(c => fChallenges.includes(c)) })
    }
    if (filters.bestFor.length > 0) {
      result = result.filter(f => filters.bestFor.some(category => getBestForScore(f, category) > 0))
    }
    if (filters.priceRange[1] < 1000) {
      result = result.filter(f => f.min_price && f.min_price <= filters.priceRange[1])
    }
    if (filters.hasDiscount) {
      result = result.filter(f => f.discount_percent != null && f.discount_percent > 0)
    }
    result.sort((a, b) => {
      // 1. Three groups, in this order (23 September 2026):
      //      a live promo code, then an affiliate link without a code, then
      //      the rest. A firm we get paid on, and where the visitor saves
      //      money, is the one that serves both sides best.
      //    An expired code is no code: it would send the visitor to a deal
      //    that no longer applies.
      if (rangCommercial(a) !== rangCommercial(b)) return rangCommercial(a) - rangCommercial(b)

      // 2. Then priority tier (Top 10 editor's picks)
      //    Lower number = higher priority. NULL/undefined treated as Tier 3 (lowest).
      const aTier = a.priority_tier ?? 3
      const bTier = b.priority_tier ?? 3
      if (aTier !== bTier) return aTier - bTier

      // 3. Finally, apply the user-selected sort
      switch (sortBy) {
        case 'rating': return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
        case 'price': return (a.min_price || 9999) - (b.min_price || 9999)
        case 'split': return (b.max_profit_split || 0) - (a.max_profit_split || 0)
        case 'discount': return (b.discount_percent || 0) - (a.discount_percent || 0)
        case 'reviews': return (b.trustpilot_reviews || 0) - (a.trustpilot_reviews || 0)
        default: return 0
      }
    })
    return result
  }, [processedFirms, firmMarkets, firmChallengeTypes, filters.verifiedOnly, filters.markets, filters.platforms, filters.tradingStyles, filters.ratings, filters.challengeTypes, filters.bestFor, filters.priceRange, filters.hasDiscount, debouncedSearch, sortBy])

  // ============================================================
  // SHADOW SEARCH
  // Match unlisted firms (unverified + not_recommended) ONLY when
  // the user is actively searching (>= 2 chars). Other filters are
  // intentionally ignored — the intent is "did you list this firm I
  // already know by name?", not "filter my way to it".
  // ============================================================
  const SHADOW_SEARCH_MIN_CHARS = 2
  const shadowMatches = useMemo<ShadowFirm[]>(() => {
    const q = (debouncedSearch || '').trim().toLowerCase()
    if (q.length < SHADOW_SEARCH_MIN_CHARS) return []
    if (!shadowFirms || shadowFirms.length === 0) return []

    // Exclude any shadow firm whose name/slug collides with a canonical
    // listed firm — the canonical version is already in the main results.
    const listedCanonicals = new Set(
      processedFirms.map(f => getCanonicalName(f.name).toLowerCase().replace(/\s+/g, ''))
    )

    const matches = shadowFirms.filter(f => {
      if (!f.name) return false
      if (isBlocklisted(f.name)) return false
      const nameHit = f.name.toLowerCase().includes(q)
      const slugHit = (f.slug || '').toLowerCase().includes(q)
      if (!nameHit && !slugHit) return false
      // Skip firms that would duplicate a listed canonical firm
      const canonical = getCanonicalName(f.name).toLowerCase().replace(/\s+/g, '')
      if (listedCanonicals.has(canonical)) return false
      return true
    })

    // Sort: not_recommended first (most important to warn about), then by rating
    return matches.sort((a, b) => {
      const aNR = a.trust_status === 'not_recommended' ? 1 : 0
      const bNR = b.trust_status === 'not_recommended' ? 1 : 0
      if (aNR !== bNR) return bNR - aNR
      return (b.trustpilot_rating || 0) - (a.trustpilot_rating || 0)
    })
  }, [debouncedSearch, shadowFirms, processedFirms])
  
  useEffect(() => { setCurrentPage(1) }, [filters, sortBy])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [currentPage])

  // Show floating quiz button after scrolling 400px
  useEffect(() => {
    const handleScroll = () => setShowQuizFloat(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const paginatedFirms = useMemo(() => filteredFirms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredFirms, currentPage, itemsPerPage])
  const totalPages = Math.ceil(filteredFirms.length / itemsPerPage)
  const compareFirms = useMemo(() => processedFirms.filter(f => compareList.includes(f.id)), [processedFirms, compareList])

  const reviewModalFirm = useMemo(() => reviewModalFirmId ? processedFirms.find(f => f.id === reviewModalFirmId) || null : null, [reviewModalFirmId, processedFirms])
  const payoutModalFirm = useMemo(() => payoutModalFirmId ? processedFirms.find(f => f.id === payoutModalFirmId) || null : null, [payoutModalFirmId, processedFirms])
  
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = []
    filters.markets.forEach(m => chips.push({ key: `market-${m}`, label: m, onRemove: () => setFilters(f => ({ ...f, markets: f.markets.filter(x => x !== m) })) }))
    filters.platforms.forEach(p => chips.push({ key: `platform-${p}`, label: p, onRemove: () => setFilters(f => ({ ...f, platforms: f.platforms.filter(x => x !== p) })) }))
    filters.tradingStyles.forEach(s => {
      const style = TRADING_STYLE_OPTIONS.find(x => x.key === s)
      if (style) chips.push({ key: `style-${s}`, label: style.label, onRemove: () => setFilters(f => ({ ...f, tradingStyles: f.tradingStyles.filter(x => x !== s) })) })
    })
    filters.ratings.forEach(r => chips.push({ key: `rating-${r}`, label: `${r}+ Rating`, onRemove: () => setFilters(f => ({ ...f, ratings: f.ratings.filter(x => x !== r) })) }))
    filters.challengeTypes.forEach(c => chips.push({ key: `challenge-${c}`, label: c, onRemove: () => setFilters(f => ({ ...f, challengeTypes: f.challengeTypes.filter(x => x !== c) })) }))
    filters.bestFor.forEach(b => {
      const bf = BEST_FOR_OPTIONS.find(x => x.key === b)
      if (bf) chips.push({ key: `bestfor-${b}`, label: bf.label, onRemove: () => setFilters(f => ({ ...f, bestFor: f.bestFor.filter(x => x !== b) })) })
    })
    if (filters.priceRange[1] < 1000) chips.push({ key: 'price', label: `Max $${filters.priceRange[1]}`, onRemove: () => setFilters(f => ({ ...f, priceRange: [0, 1000] })) })
    if (filters.hasDiscount) chips.push({ key: 'deals', label: 'Deals Only', onRemove: () => setFilters(f => ({ ...f, hasDiscount: false })) })
    return chips
  }, [filters])
  
  const resetFilters = () => {
    setFilters({ search: '', markets: [], platforms: [], tradingStyles: [], ratings: [], challengeTypes: [], bestFor: [], priceRange: [0, 1000], hasDiscount: false, verifiedOnly: true })
    setOpenDropdown(null)
  }

  return (
    <div className="min-h-screen bg-bg-elevated pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* REVIEW MODAL */}
      {reviewModalFirm && (
        <ReviewModal
          firm={reviewModalFirm}
          t={t}
          onClose={() => setReviewModalFirmId(null)}
          onSubmit={handleSubmitReview}
          alreadyReviewed={userReviewedFirms.has(reviewModalFirm.id)}
        />
      )}

      {/* PAYOUT PROOF MODAL */}
      {payoutModalFirm && (
        <PayoutProofModal
          firm={payoutModalFirm}
          t={t}
          onClose={() => setPayoutModalFirmId(null)}
          onSubmit={handleSubmitPayout}
        />
      )}
      
      {/* HEADER */}
      {/* HEADER — identity. Read once, so it scrolls away like any other
          content. Pinning it cost 118px of a phone screen for a title nobody
          re-reads, and it sat behind the offers banner anyway: both were
          sticky at top-16, and this one is the lower z-index of the two. */}
      <section className="pt-6 pb-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-h2 text-text-primary sm:text-h1">{t.pageTitle}</h1>
              <p className="mt-2 text-body text-text-secondary">{t.pageSubtitle}</p>
              <p className="mt-1 text-xs text-text-muted">Last updated: {formatMonthYear(new Date())}</p>
            </div>
            {/* Controle segmente Grid / List, a la place des deux boutons carres. */}
            <div className="flex gap-1.5 self-start rounded-xl border border-border bg-bg-elevated p-1 sm:self-auto">
              {([['grid', t.gridView ?? 'Grid', Grid3X3], ['list', t.listView ?? 'List', List]] as const).map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  className={`flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                    viewMode === mode ? 'bg-accent-subtle text-accent' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS — the one part that earns its place on screen: you need them
          while you are scrolling the list they filter. Rides up by 4rem when
          the navbar and banner collapse, so it always sits flush against
          whatever is above it. */}
      <section
        className={`pt-3 pb-4 px-4 border-b border-border sticky top-16 z-30 bg-bg-elevated/95 backdrop-blur-sm transition-transform duration-300 motion-reduce:transition-none ${
          headerHidden ? '-translate-y-16' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search — pleine largeur sur mobile, 14rem au-dela */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input type="text" value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} placeholder={t.searchPlaceholder} aria-label="Search prop firms" className="w-full rounded-xl border border-border bg-bg-base py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none" />
              </div>
              
              {/* Markets */}
              <FilterDropdown label={t.markets} count={filters.markets.length} isOpen={openDropdown === 'markets'} onToggle={() => toggleDropdown('markets')}>
                <div className="flex flex-wrap gap-1.5">
                  {MARKET_OPTIONS.map(market => (
                    <button key={market} onClick={() => setFilters(f => ({ ...f, markets: f.markets.includes(market) ? f.markets.filter(m => m !== market) : [...f.markets, market] }))} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.markets.includes(market) ? 'bg-accent-hover text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated'}`}>
                      {market}{filters.markets.includes(market) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Platforms */}
              <FilterDropdown label={t.platform} count={filters.platforms.length} isOpen={openDropdown === 'platforms'} onToggle={() => toggleDropdown('platforms')}>
                <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                  {availablePlatforms.map(platform => (
                    <button key={platform} onClick={() => setFilters(f => ({ ...f, platforms: f.platforms.includes(platform) ? f.platforms.filter(p => p !== platform) : [...f.platforms, platform] }))} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.platforms.includes(platform) ? 'bg-accent-hover text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated'}`}>
                      {platform}{filters.platforms.includes(platform) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Challenge Type */}
              <FilterDropdown label={t.challenge} count={filters.challengeTypes.length} isOpen={openDropdown === 'challenge'} onToggle={() => toggleDropdown('challenge')}>
                <div className="flex flex-wrap gap-1.5">
                  {CHALLENGE_TYPE_OPTIONS.map(type => (
                    <button key={type} onClick={() => setFilters(f => ({ ...f, challengeTypes: f.challengeTypes.includes(type) ? f.challengeTypes.filter(t => t !== type) : [...f.challengeTypes, type] }))} className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${filters.challengeTypes.includes(type) ? 'bg-accent-hover text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated'}`}>
                      {type}{filters.challengeTypes.includes(type) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Trading Style */}
              <FilterDropdown label={t.style} count={filters.tradingStyles.length} isOpen={openDropdown === 'style'} onToggle={() => toggleDropdown('style')}>
                <div className="flex flex-wrap gap-1.5">
                  {TRADING_STYLE_OPTIONS.map(style => (
                    <button key={style.key} onClick={() => setFilters(f => ({ ...f, tradingStyles: f.tradingStyles.includes(style.key) ? f.tradingStyles.filter(s => s !== style.key) : [...f.tradingStyles, style.key] }))} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filters.tradingStyles.includes(style.key) ? 'bg-accent-hover text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated'}`}>
                      {style.label}{filters.tradingStyles.includes(style.key) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Rating */}
              <FilterDropdown label={t.rating} count={filters.ratings.length} isOpen={openDropdown === 'rating'} onToggle={() => toggleDropdown('rating')}>
                <div className="flex flex-wrap gap-1.5">
                  {RATING_OPTIONS.map(rating => (
                    <button key={rating} onClick={() => setFilters(f => ({ ...f, ratings: f.ratings.includes(rating) ? f.ratings.filter(r => r !== rating) : [...f.ratings, rating] }))} className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${filters.ratings.includes(rating) ? 'bg-accent-hover text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated'}`}>
                      <Star className="w-3 h-3" />{rating}+{filters.ratings.includes(rating) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </FilterDropdown>
              
              {/* Best For */}
              <FilterDropdown label={t.bestFor} count={filters.bestFor.length} isOpen={openDropdown === 'bestFor'} onToggle={() => toggleDropdown('bestFor')}>
                <div className="flex flex-wrap gap-1.5">
                  {BEST_FOR_OPTIONS.map(opt => {
                    const Icon = opt.icon
                    return (
                      <button key={opt.key} onClick={() => setFilters(f => ({ ...f, bestFor: f.bestFor.includes(opt.key) ? f.bestFor.filter(b => b !== opt.key) : [...f.bestFor, opt.key] }))} className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${filters.bestFor.includes(opt.key) ? 'bg-accent-hover text-white' : 'bg-bg-elevated text-text-secondary hover:bg-bg-elevated'}`}>
                        <Icon className="w-3 h-3" />{opt.label}{filters.bestFor.includes(opt.key) && <Check className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
              </FilterDropdown>
              
              {/* Price */}
              <FilterDropdown label={filters.priceRange[1] < 1000 ? `≤$${filters.priceRange[1]}` : 'Price'} count={filters.priceRange[1] < 1000 ? 1 : 0} isOpen={openDropdown === 'price'} onToggle={() => toggleDropdown('price')}>
                <div className="w-[220px]">
                  <PriceSlider value={filters.priceRange} onChange={(v) => setFilters(f => ({ ...f, priceRange: v }))} />
                </div>
              </FilterDropdown>
              
              {/* Deals */}
              {stats.withDiscounts > 0 && (
                <button onClick={() => setFilters(f => ({ ...f, hasDiscount: !f.hasDiscount }))} aria-pressed={filters.hasDiscount} aria-label={`Filter by deals only. ${stats.withDiscounts} firms with discounts`} className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${filters.hasDiscount ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400' : 'border-border bg-bg-base text-text-secondary hover:border-border-hover'}`}>
                  <Tag className="h-3.5 w-3.5" /> {t.deals} <span className="font-mono text-[11px]">({stats.withDiscounts})</span>
                </button>
              )}

              {/* Verified : un vrai interrupteur, sur l'etat qui existait deja
                  (verifiedOnly etait actif par defaut, sans commande visible). */}
              <button
                onClick={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
                role="switch"
                aria-checked={filters.verifiedOnly}
                aria-label={`${t.verified} firms only`}
                className="ml-auto flex items-center gap-2 rounded-xl px-1 py-2.5 text-sm font-medium text-text-secondary"
              >
                <span className={`relative h-5 w-[34px] rounded-full transition-colors ${filters.verifiedOnly ? 'bg-accent-hover' : 'bg-border-hover'}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${filters.verifiedOnly ? 'left-[16px]' : 'left-0.5'}`} />
                </span>
                {t.verified}
              </button>
            </div>

            {/* Ligne 2 : filtres actifs, remise a zero, compte et tri */}
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.map(chip => <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />)}
              {activeFilterChips.length > 0 && (
                <button onClick={resetFilters} aria-label="Reset all filters" className="flex items-center gap-1 text-sm text-text-muted underline hover:text-text-primary">
                  <RotateCcw className="h-3.5 w-3.5" /> {t.reset}
                </button>
              )}
              <span className="ml-auto text-sm text-text-muted">
                {t.showing} <span className="font-mono text-text-primary">{filteredFirms.length}</span> {t.propFirms}
              </span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort firms by" className="rounded-xl border border-border bg-bg-base px-3 py-2 text-sm text-text-secondary focus:border-accent focus:outline-none">
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{`${t.sort ?? 'Sort'}: ${opt.label}`}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* QUIZ BANNER */}
      <div className="px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-lg bg-bg-elevated border border-border hover:border-border-hover transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-text-primary font-medium text-sm">Not sure which firm to pick?</p>
                    <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] font-medium rounded border border-accent/30 uppercase tracking-wider">Free</span>
                  </div>
                  <p className="text-text-secondary text-xs">Discover the prop firm that fits your trading style in under 60 seconds</p>
                </div>
              </div>
              <Link
                href="/en/quiz?start=true"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-accent-hover hover:brightness-110 text-white font-medium text-sm rounded-md transition-colors whitespace-nowrap"
              >
                Find my perfect firm
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <section className="px-4 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-end mb-4">
            {/* Counter "Showing X prop firms" intentionally hidden per design — 
                displaying it implies a number we'd need to keep accurate, and the
                grid below already conveys the count visually. */}
            {favorites.length > 0 && (
              <span className="text-xs text-text-muted">{favorites.length} favorites</span>
            )}
          </div>
          
          {/* LISTED RESULTS */}
          {paginatedFirms.length > 0 && (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {paginatedFirms.map((firm, i) => (
                  <PropFirmCard
                    key={firm.id}
                    firm={firm}
                    isCompact={viewMode === 'list'}
                    rank={(currentPage - 1) * itemsPerPage + i + 1}
                    markets={firmMarkets.get(firm.id) || ['Forex']}
                    isFavorite={favorites.includes(firm.id)}
                    onFavorite={() => toggleFavorite(firm.id)}
                    isComparing={compareList.includes(firm.id)}
                    onCompare={() => toggleCompare(firm.id)}
                    onCopyCode={handleCopyCode}
                    communityRating={reviewAggregates.get(firm.id) || null}
                    onRate={() => setReviewModalFirmId(firm.id)}
                    hasReviewed={userReviewedFirms.has(firm.id)}
                    payoutAggregate={payoutAggregates.get(firm.id) || null}
                    onPayout={() => setPayoutModalFirmId(firm.id)}
                    t={t}
                  />
                ))}
              </div>
              
              {/* PAGINATION */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page" className="p-2 rounded-lg bg-bg-base text-text-secondary hover:bg-bg-elevated disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number
                      if (totalPages <= 5) page = i + 1
                      else if (currentPage <= 3) page = i + 1
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i
                      else page = currentPage - 2 + i
                      return (
                        <button key={page} onClick={() => setCurrentPage(page)} aria-label={`Page ${page}`} aria-current={currentPage === page ? 'page' : undefined} className={`w-8 h-8 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-accent-hover text-white' : 'bg-bg-base text-text-secondary hover:bg-bg-elevated'}`}>
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next page" className="p-2 rounded-lg bg-bg-base text-text-secondary hover:bg-bg-elevated disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          )}

          {/* SHADOW RESULTS — unlisted firms matching the search */}
          {shadowMatches.length > 0 && (
            <div className={paginatedFirms.length > 0 ? 'mt-10 pt-8 border-t border-border' : ''}>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 bg-yellow-500/60 rounded-full" />
                  <h2 className="text-sm font-semibold text-text-secondary">
                    Other results <span className="text-text-muted font-normal">— unverified or not recommended</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-bg-base text-text-secondary text-[10px] rounded">{shadowMatches.length}</span>
                  </h2>
                </div>
                <p className="text-xs text-text-muted ml-3">
                  These firms aren&apos;t currently listed on PropFirmScanner. We haven&apos;t verified their claims, or we don&apos;t recommend them. Proceed with caution.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {shadowMatches.map(sFirm => (
                  <ShadowPropFirmCard key={sFirm.id} firm={sFirm} />
                ))}
              </div>
            </div>
          )}

          {/* EMPTY STATE — only when BOTH listed and shadow are empty */}
          {paginatedFirms.length === 0 && shadowMatches.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-bg-base flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{t.noFirmsFound}</h3>
              <p className="text-text-muted mb-4">{t.tryAdjusting}</p>
              <button onClick={resetFilters} className="px-4 py-2 bg-accent-hover hover:brightness-110 text-white text-sm rounded-lg transition-colors">{t.resetFilters}</button>
            </div>
          )}
        </div>
      </section>
      
      {/* STILL UNDECIDED — sober redirect to quiz */}
      <section className="px-4 py-section-default">
        <div className="max-w-4xl mx-auto">
          <div className="border border-border rounded-lg p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-tiny text-accent uppercase tracking-wider font-medium mb-2">
                  Personalized matching
                </p>
                <h3 className="text-h2 text-text-primary mb-2">
                  Still undecided?
                </h3>
                <p className="text-small text-text-secondary">
                  Answer 4 quick questions and get your top 3 matches in under 60 seconds. No account required.
                </p>
              </div>
              <Link
                href="/en/quiz?start=true"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-hover hover:brightness-110 text-white font-medium text-sm rounded-md transition-colors whitespace-nowrap"
              >
                Take the quiz
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING QUIZ BUTTON */}
      {showQuizFloat && (
        <div className="fixed bottom-20 right-4 z-40 animate-fade-in">
          <Link
            href="/en/quiz?start=true"
            className="inline-flex items-center gap-2 px-4 py-3 bg-accent-hover hover:brightness-110 text-white font-medium text-sm rounded-md shadow-lg transition-colors"
          >
            Find my match
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* COMPARE BAR */}
      <CompareBar firms={compareFirms} onRemove={(id) => setCompareList(prev => prev.filter(f => f !== id))} onClear={() => setCompareList([])} />
    </div>
  )
}
