'use client'

// =============================================================================
// EXPLORATEUR DE PROGRAMMES — components/ProgramExplorer.tsx
// =============================================================================
// Rend la structure normalisée de `lib/firm-programs.ts` : un programme, une
// taille, puis l'évaluation et le compte financé côte à côte.
//
// Générique et piloté par les données : rien ici ne nomme FuturesElite. Toute
// firme ayant des lignes dans `firm_programs` obtient cette section, et
// `CLAUDE.md` reste tenu — une seule page sert les 350 fiches.
//
// Deux règles du brief sont câblées dans le rendu, pas laissées à la rédaction :
//   - jamais de coche verte sur « With restrictions » ni sur un statut à
//     confirmer : la sévérité décide de la couleur et du symbole ;
//   - jamais « meilleur prix » sur un code partenaire battu par l'offre
//     publique : `betterPublic` déclenche un avertissement neutre.
// =============================================================================

import { useMemo, useState } from 'react'
import {
  type FirmProgramData, type Phase, type ProgramPlan, type Severity,
  priceFor, planFor, regularPriceFor, sizesOf,
  marketsOf, variantsOf, rulesFor, evaluationPhases, currencyFor,
} from '@/lib/firm-programs'
import { buildAffiliateUrl } from '@/lib/affiliate'
import { buildSelectedPlan } from '@/lib/selected-plan'
import { deriveCapabilities } from '@/lib/firm-capabilities'
import {
  SelectedPlanSummary, CriticalRules, FundingTimeline, TrueCost,
  PayoutConditions, SuitabilityVerdict, EvidenceLog, CompleteSpecifications,
} from '@/components/prop-firm/PlanSections'

const COPY = {
  en: {
    eyebrow: 'Programs, rules and prices',
    market: 'Market',
    variant: 'Account type',
    pending: 'Verification in progress — no rule or price is published for this product yet.',
    markets: { cfd: 'CFD', futures: 'Futures', stocks: 'Stocks' } as Record<string, string>,
    intro: 'Pick a program and a size. Evaluation and funded rules stay separate.',
    step1: 'Choose your program',
    step2: 'Choose your account size',
    evaluation: 'Evaluation',
    funded: 'Funded account',
    noEvaluation: 'No evaluation — the account is funded from purchase.',
    priceToday: 'Price today',
    regular: 'Regular price',
    publicBetter: (code: string, pct: string) =>
      `A public offer (${code}) currently gives ${pct} — more than our partner code. We show it rather than hide it.`,
    noExpiry: 'No expiry date is published for this offer.',
    profitTarget: 'Profit target',
    maxLoss: 'Maximum loss',
    dailyLoss: 'Daily loss limit',
    drawdown: 'Drawdown',
    buffer: 'Buffer',
    noBuffer: 'None',
    bufferUnknown: 'Not stated',
    contracts: 'Max contracts',
    scaling: 'Contract scaling',
    minDays: 'Minimum trading days',
    consistency: 'Consistency rule',
    split: 'Profit split',
    payoutCap: 'Payout cap',
    minPayout: 'Minimum payout',
    betweenPayouts: 'Days between payouts',
    resetFee: 'Reset fee',
    activationFee: 'Activation fee',
    none: 'None',
    notApplicable: 'Not applicable',
    bundle: 'Bundle & Save',
    bundleIntro: 'How many accounts you may BUY. Not how many may be funded at once.',
    fundedLimit: (n: number) => `Official limit: ${n} active funded accounts`,
    account: 'Account',
    free: 'Free',
    rules: 'Rules that can breach or restrict the account',
    platforms: 'Platforms',
    noSurcharge:
      'No surcharge is displayed at checkout. Market data, commissions and platform licences may still be yours to pay.',
    severity: {
      hard_breach: 'Hard breach',
      temporary_pause: 'Temporary pause',
      payout_adjustment: 'Payout adjustment',
      eligibility_condition: 'Eligibility condition',
      informational: 'For information',
      restriction: 'Restriction',
      payout_condition: 'Payout condition',
      allowed: 'Allowed',
      needs_confirmation: 'Needs confirmation',
    } as Record<Severity, string>,
  },
  fr: {
    eyebrow: 'Programmes, règles et prix',
    market: 'Marché',
    variant: 'Type de compte',
    pending: 'Vérification en cours — aucune règle ni prix n’est publié pour ce produit.',
    markets: { cfd: 'CFD', futures: 'Futures', stocks: 'Actions' } as Record<string, string>,
    intro: 'Choisissez un programme et une taille. L’évaluation et le compte financé restent séparés.',
    step1: 'Choisissez votre programme',
    step2: 'Choisissez votre taille de compte',
    evaluation: 'Évaluation',
    funded: 'Compte financé',
    noEvaluation: 'Aucune évaluation — le compte est financé dès l’achat.',
    priceToday: 'Prix aujourd’hui',
    regular: 'Prix régulier',
    publicBetter: (code: string, pct: string) =>
      `Une offre publique (${code}) donne actuellement ${pct} — davantage que notre code partenaire. Nous l’affichons plutôt que de la taire.`,
    noExpiry: 'Aucune date d’expiration n’est publiée pour cette offre.',
    profitTarget: 'Objectif de profit',
    maxLoss: 'Perte maximale',
    dailyLoss: 'Perte journalière',
    drawdown: 'Drawdown',
    buffer: 'Buffer',
    noBuffer: 'Aucun',
    bufferUnknown: 'Non précisé',
    contracts: 'Contrats maximum',
    scaling: 'Progression des contrats',
    minDays: 'Jours de trading minimum',
    consistency: 'Règle de régularité',
    split: 'Partage des profits',
    payoutCap: 'Plafond de retrait',
    minPayout: 'Retrait minimum',
    betweenPayouts: 'Jours entre deux retraits',
    resetFee: 'Frais de reset',
    activationFee: 'Frais d’activation',
    none: 'Aucun',
    notApplicable: 'Sans objet',
    bundle: 'Bundle & Save',
    bundleIntro:
      'Le nombre de comptes que vous pouvez ACHETER. Pas le nombre qui peut être financé en même temps.',
    fundedLimit: (n: number) => `Limite officielle : ${n} comptes financés actifs`,
    account: 'Compte',
    free: 'Offert',
    rules: 'Règles pouvant clôturer ou restreindre le compte',
    platforms: 'Plateformes',
    noSurcharge:
      'Aucun supplément n’est affiché au paiement. Données de marché, commissions et licences logicielles peuvent rester à votre charge.',
    severity: {
      hard_breach: 'Clôture immédiate',
      temporary_pause: 'Pause temporaire',
      payout_adjustment: 'Ajustement du retrait',
      eligibility_condition: 'Condition d’éligibilité',
      informational: 'Pour information',
      restriction: 'Restriction',
      payout_condition: 'Condition de retrait',
      allowed: 'Autorisé',
      needs_confirmation: 'À confirmer',
    } as Record<Severity, string>,
  },
  de: {
    eyebrow: 'Programme, Regeln und Preise',
    market: 'Markt',
    variant: 'Kontotyp',
    pending: 'Prüfung läuft — für dieses Produkt sind noch keine Regeln oder Preise veröffentlicht.',
    markets: { cfd: 'CFD', futures: 'Futures', stocks: 'Aktien' } as Record<string, string>,
    intro: 'Wählen Sie ein Programm und eine Größe. Evaluierung und finanziertes Konto bleiben getrennt.',
    step1: 'Wählen Sie Ihr Programm',
    step2: 'Wählen Sie Ihre Kontogröße',
    evaluation: 'Evaluierung',
    funded: 'Finanziertes Konto',
    noEvaluation: 'Keine Evaluierung — das Konto ist ab dem Kauf finanziert.',
    priceToday: 'Preis heute',
    regular: 'Regulärer Preis',
    publicBetter: (code: string, p: string) =>
      `Ein öffentliches Angebot (${code}) gibt derzeit ${p} — mehr als unser Partnercode. Wir zeigen es, statt es zu verschweigen.`,
    noExpiry: 'Für dieses Angebot ist kein Ablaufdatum veröffentlicht.',
    profitTarget: 'Gewinnziel',
    maxLoss: 'Maximaler Verlust',
    dailyLoss: 'Tagesverlustlimit',
    drawdown: 'Drawdown',
    buffer: 'Buffer',
    noBuffer: 'Keiner',
    bufferUnknown: 'Nicht angegeben',
    contracts: 'Max. Kontrakte',
    scaling: 'Kontrakt-Skalierung',
    minDays: 'Mindesthandelstage',
    consistency: 'Konsistenzregel',
    split: 'Gewinnbeteiligung',
    payoutCap: 'Auszahlungsobergrenze',
    minPayout: 'Mindestauszahlung',
    betweenPayouts: 'Tage zwischen Auszahlungen',
    resetFee: 'Reset-Gebühr',
    activationFee: 'Aktivierungsgebühr',
    none: 'Keine',
    notApplicable: 'Nicht zutreffend',
    bundle: 'Bundle & Save',
    bundleIntro: 'Wie viele Konten Sie KAUFEN dürfen. Nicht, wie viele gleichzeitig finanziert sein dürfen.',
    fundedLimit: (n: number) => `Offizielles Limit: ${n} aktive finanzierte Konten`,
    account: 'Konto',
    free: 'Gratis',
    rules: 'Regeln, die das Konto sperren oder einschränken können',
    platforms: 'Plattformen',
    noSurcharge:
      'An der Kasse wird kein Aufpreis angezeigt. Marktdaten, Kommissionen und Plattformlizenzen können dennoch zu Ihren Lasten gehen.',
    severity: {
      hard_breach: 'Sofortige Sperrung',
      temporary_pause: 'Vorübergehende Pause',
      payout_adjustment: 'Auszahlungsanpassung',
      eligibility_condition: 'Zulassungsbedingung',
      informational: 'Zur Information',
      restriction: 'Einschränkung',
      payout_condition: 'Auszahlungsbedingung',
      allowed: 'Erlaubt',
      needs_confirmation: 'Zu bestätigen',
    } as Record<Severity, string>,
  },
  es: {
    eyebrow: 'Programas, reglas y precios',
    market: 'Mercado',
    variant: 'Tipo de cuenta',
    pending: 'Verificación en curso: aún no se publica ninguna regla ni precio para este producto.',
    markets: { cfd: 'CFD', futures: 'Futuros', stocks: 'Acciones' } as Record<string, string>,
    intro: 'Elige un programa y un tamaño. Las reglas de evaluación y de cuenta financiada no se mezclan.',
    step1: 'Elige tu programa',
    step2: 'Elige el tamaño de tu cuenta',
    evaluation: 'Evaluación',
    funded: 'Cuenta financiada',
    noEvaluation: 'Sin evaluación: la cuenta está financiada desde la compra.',
    priceToday: 'Precio hoy',
    regular: 'Precio normal',
    publicBetter: (code: string, p: string) =>
      `Una oferta pública (${code}) da actualmente ${p}, más que nuestro código de socio. La mostramos en lugar de ocultarla.`,
    noExpiry: 'No se publica fecha de caducidad para esta oferta.',
    profitTarget: 'Objetivo de beneficio',
    maxLoss: 'Pérdida máxima',
    dailyLoss: 'Pérdida diaria',
    drawdown: 'Drawdown',
    buffer: 'Colchón',
    noBuffer: 'Ninguno',
    bufferUnknown: 'No indicado',
    contracts: 'Contratos máximos',
    scaling: 'Escalado de contratos',
    minDays: 'Días mínimos de trading',
    consistency: 'Regla de consistencia',
    split: 'Reparto de beneficios',
    payoutCap: 'Tope de retiro',
    minPayout: 'Retiro mínimo',
    betweenPayouts: 'Días entre retiros',
    resetFee: 'Coste de reinicio',
    activationFee: 'Coste de activación',
    none: 'Ninguna',
    notApplicable: 'No aplicable',
    bundle: 'Bundle & Save',
    bundleIntro: 'Cuántas cuentas puedes COMPRAR. No cuántas pueden estar financiadas a la vez.',
    fundedLimit: (n: number) => `Límite oficial: ${n} cuentas financiadas activas`,
    account: 'Cuenta',
    free: 'Gratis',
    rules: 'Reglas que pueden cerrar o restringir la cuenta',
    platforms: 'Plataformas',
    noSurcharge:
      'No se muestra ningún recargo al pagar. Los datos de mercado, las comisiones y las licencias de plataforma pueden seguir corriendo por tu cuenta.',
    severity: {
      hard_breach: 'Cierre inmediato',
      temporary_pause: 'Pausa temporal',
      payout_adjustment: 'Ajuste del retiro',
      eligibility_condition: 'Condición de elegibilidad',
      informational: 'Informativo',
      restriction: 'Restricción',
      payout_condition: 'Condición de retiro',
      allowed: 'Permitido',
      needs_confirmation: 'Por confirmar',
    } as Record<Severity, string>,
  },
  pt: {
    eyebrow: 'Programas, regras e preços',
    market: 'Mercado',
    variant: 'Tipo de conta',
    pending: 'Verificação em curso — ainda não é publicada qualquer regra ou preço para este produto.',
    markets: { cfd: 'CFD', futures: 'Futuros', stocks: 'Ações' } as Record<string, string>,
    intro: 'Escolha um programa e um tamanho. As regras de avaliação e de conta financiada não se misturam.',
    step1: 'Escolha o seu programa',
    step2: 'Escolha o tamanho da sua conta',
    evaluation: 'Avaliação',
    funded: 'Conta financiada',
    noEvaluation: 'Sem avaliação: a conta está financiada desde a compra.',
    priceToday: 'Preço hoje',
    regular: 'Preço normal',
    publicBetter: (code: string, p: string) =>
      `Uma oferta pública (${code}) dá atualmente ${p}, mais do que o nosso código de parceiro. Mostramo-la em vez de a esconder.`,
    noExpiry: 'Não é publicada data de expiração para esta oferta.',
    profitTarget: 'Objetivo de lucro',
    maxLoss: 'Perda máxima',
    dailyLoss: 'Perda diária',
    drawdown: 'Drawdown',
    buffer: 'Almofada',
    noBuffer: 'Nenhuma',
    bufferUnknown: 'Não indicado',
    contracts: 'Contratos máximos',
    scaling: 'Escalonamento de contratos',
    minDays: 'Dias mínimos de negociação',
    consistency: 'Regra de consistência',
    split: 'Partilha de lucros',
    payoutCap: 'Teto de levantamento',
    minPayout: 'Levantamento mínimo',
    betweenPayouts: 'Dias entre levantamentos',
    resetFee: 'Custo de reinício',
    activationFee: 'Custo de ativação',
    none: 'Nenhuma',
    notApplicable: 'Não aplicável',
    bundle: 'Bundle & Save',
    bundleIntro: 'Quantas contas pode COMPRAR. Não quantas podem estar financiadas ao mesmo tempo.',
    fundedLimit: (n: number) => `Limite oficial: ${n} contas financiadas ativas`,
    account: 'Conta',
    free: 'Grátis',
    rules: 'Regras que podem encerrar ou restringir a conta',
    platforms: 'Plataformas',
    noSurcharge:
      'Não é mostrado qualquer acréscimo no pagamento. Dados de mercado, comissões e licenças de plataforma podem continuar a seu cargo.',
    severity: {
      hard_breach: 'Encerramento imediato',
      temporary_pause: 'Pausa temporária',
      payout_adjustment: 'Ajuste do levantamento',
      eligibility_condition: 'Condição de elegibilidade',
      informational: 'Informativo',
      restriction: 'Restrição',
      payout_condition: 'Condição de levantamento',
      allowed: 'Permitido',
      needs_confirmation: 'A confirmar',
    } as Record<Severity, string>,
  },
  ar: {
    eyebrow: 'البرامج والقواعد والأسعار',
    market: 'السوق',
    variant: 'نوع الحساب',
    pending: 'التحقق جارٍ — لم تُنشر بعد أي قاعدة أو سعر لهذا المنتج.',
    markets: { cfd: 'عقود الفروقات', futures: 'العقود الآجلة', stocks: 'الأسهم' } as Record<string, string>,
    intro: 'اختر برنامجًا وحجمًا. تبقى قواعد التقييم وقواعد الحساب المموَّل منفصلة.',
    step1: 'اختر برنامجك',
    step2: 'اختر حجم حسابك',
    evaluation: 'التقييم',
    funded: 'الحساب المموَّل',
    noEvaluation: 'لا يوجد تقييم — الحساب مموَّل منذ الشراء.',
    priceToday: 'السعر اليوم',
    regular: 'السعر العادي',
    publicBetter: (code: string, p: string) =>
      `يمنح عرض عام (${code}) حاليًا ${p}، أي أكثر من رمز الشراكة لدينا. نعرضه بدل إخفائه.`,
    noExpiry: 'لم يُنشر تاريخ انتهاء لهذا العرض.',
    profitTarget: 'هدف الربح',
    maxLoss: 'الخسارة القصوى',
    dailyLoss: 'حد الخسارة اليومية',
    drawdown: 'التراجع',
    buffer: 'الهامش الاحتياطي',
    noBuffer: 'لا يوجد',
    bufferUnknown: 'غير محدد',
    contracts: 'الحد الأقصى للعقود',
    scaling: 'زيادة العقود',
    minDays: 'الحد الأدنى لأيام التداول',
    consistency: 'قاعدة الانتظام',
    split: 'تقاسم الأرباح',
    payoutCap: 'سقف السحب',
    minPayout: 'الحد الأدنى للسحب',
    betweenPayouts: 'الأيام بين السحوبات',
    resetFee: 'رسوم إعادة التعيين',
    activationFee: 'رسوم التفعيل',
    none: 'لا شيء',
    notApplicable: 'لا ينطبق',
    bundle: 'الحزم والتوفير',
    bundleIntro: 'عدد الحسابات التي يمكنك شراؤها. لا عدد الحسابات التي يمكن تمويلها في آن واحد.',
    fundedLimit: (n: number) => `الحد الرسمي: ${n} حسابات مموَّلة نشطة`,
    account: 'حساب',
    free: 'مجاني',
    rules: 'قواعد قد تُغلق الحساب أو تقيّده',
    platforms: 'المنصات',
    noSurcharge:
      'لا يظهر أي رسم إضافي عند الدفع. ومع ذلك قد تبقى بيانات السوق والعمولات وتراخيص المنصات على عاتقك.',
    severity: {
      hard_breach: 'إغلاق فوري',
      temporary_pause: 'إيقاف مؤقت',
      payout_adjustment: 'تعديل السحب',
      eligibility_condition: 'شرط الأهلية',
      informational: 'للعلم',
      restriction: 'تقييد',
      payout_condition: 'شرط سحب',
      allowed: 'مسموح',
      needs_confirmation: 'بحاجة إلى تأكيد',
    } as Record<Severity, string>,
  },
  hi: {
    eyebrow: 'प्रोग्राम, नियम और कीमतें',
    market: 'बाज़ार',
    variant: 'खाता प्रकार',
    pending: 'सत्यापन जारी — इस उत्पाद के लिए अभी कोई नियम या कीमत प्रकाशित नहीं है।',
    markets: { cfd: 'CFD', futures: 'फ़्यूचर्स', stocks: 'स्टॉक' } as Record<string, string>,
    intro: 'एक प्रोग्राम और आकार चुनें। मूल्यांकन और फ़ंडेड खाते के नियम अलग रहते हैं।',
    step1: 'अपना प्रोग्राम चुनें',
    step2: 'अपने खाते का आकार चुनें',
    evaluation: 'मूल्यांकन',
    funded: 'फ़ंडेड खाता',
    noEvaluation: 'कोई मूल्यांकन नहीं — खाता ख़रीद से ही फ़ंडेड है।',
    priceToday: 'आज की कीमत',
    regular: 'सामान्य कीमत',
    publicBetter: (code: string, p: string) =>
      `एक सार्वजनिक ऑफ़र (${code}) इस समय ${p} देता है — हमारे पार्टनर कोड से अधिक। हम इसे छिपाने के बजाय दिखाते हैं।`,
    noExpiry: 'इस ऑफ़र के लिए कोई समाप्ति तिथि प्रकाशित नहीं है।',
    profitTarget: 'लाभ लक्ष्य',
    maxLoss: 'अधिकतम हानि',
    dailyLoss: 'दैनिक हानि सीमा',
    drawdown: 'ड्रॉडाउन',
    buffer: 'बफ़र',
    noBuffer: 'कोई नहीं',
    bufferUnknown: 'नहीं बताया गया',
    contracts: 'अधिकतम कॉन्ट्रैक्ट',
    scaling: 'कॉन्ट्रैक्ट स्केलिंग',
    minDays: 'न्यूनतम ट्रेडिंग दिवस',
    consistency: 'कंसिस्टेंसी नियम',
    split: 'लाभ का बँटवारा',
    payoutCap: 'पेआउट सीमा',
    minPayout: 'न्यूनतम पेआउट',
    betweenPayouts: 'दो पेआउट के बीच दिन',
    resetFee: 'रीसेट शुल्क',
    activationFee: 'सक्रियण शुल्क',
    none: 'कोई नहीं',
    notApplicable: 'लागू नहीं',
    bundle: 'बंडल और बचत',
    bundleIntro: 'आप कितने खाते ख़रीद सकते हैं। यह नहीं कि एक साथ कितने फ़ंडेड हो सकते हैं।',
    fundedLimit: (n: number) => `आधिकारिक सीमा: ${n} सक्रिय फ़ंडेड खाते`,
    account: 'खाता',
    free: 'मुफ़्त',
    rules: 'वे नियम जो खाता बंद या सीमित कर सकते हैं',
    platforms: 'प्लेटफ़ॉर्म',
    noSurcharge:
      'भुगतान पर कोई अतिरिक्त शुल्क नहीं दिखता। फिर भी बाज़ार डेटा, कमीशन और प्लेटफ़ॉर्म लाइसेंस आपके ज़िम्मे रह सकते हैं।',
    severity: {
      hard_breach: 'तत्काल बंद',
      temporary_pause: 'अस्थायी विराम',
      payout_adjustment: 'पेआउट समायोजन',
      eligibility_condition: 'पात्रता शर्त',
      informational: 'जानकारी के लिए',
      restriction: 'प्रतिबंध',
      payout_condition: 'पेआउट शर्त',
      allowed: 'अनुमत',
      needs_confirmation: 'पुष्टि आवश्यक',
    } as Record<Severity, string>,
  },
}

// Le brief interdit la coche verte sur « With restrictions » et sur un statut à
// confirmer. La couleur et le symbole découlent donc de la sévérité, jamais
// d'un booléen.
const SEVERITY_STYLE: Record<Severity, { badge: string; mark: string }> = {
  hard_breach: { badge: 'bg-red-500/10 text-red-300 border-red-500/30', mark: '×' },
  // Une pause n'est pas une cloture : l'ambre, pas le rouge.
  temporary_pause: { badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30', mark: '‖' },
  payout_adjustment: { badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30', mark: '±' },
  eligibility_condition: { badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30', mark: '§' },
  informational: { badge: 'bg-gray-500/10 text-gray-400 border-gray-600/30', mark: 'i' },
  restriction: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', mark: '!' },
  payout_condition: { badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30', mark: '§' },
  allowed: { badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', mark: '✓' },
  needs_confirmation: { badge: 'bg-gray-500/10 text-gray-300 border-gray-500/30', mark: '?' },
}

const SYMBOLE: Record<string, string> = { USD: '$', EUR: '\u20AC', GBP: '\u00A3' }

// La devise vient du plan. FTMO facture en euros : afficher « $540 » serait
// une erreur de fait, pas une approximation de mise en forme.
const money = (v: number | null | undefined, cur = 'USD') =>
  v === null || v === undefined
    ? null
    : (SYMBOLE[cur] ?? '$') + Number(v).toLocaleString('en-US')
const pct = (v: number | null | undefined) =>
  v === null || v === undefined ? null : Math.round(Number(v) * 100) + '%'

function Row({ label, value, note }: { label: string; value: string | null; note?: string | null }) {
  if (value === null) return null
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-800 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium text-right">
        {value}
        {note ? <span className="block text-gray-500 text-xs font-normal mt-0.5">{note}</span> : null}
      </span>
    </div>
  )
}

function PhaseCard({ title, plan, currency = 'USD', t }: { title: string; plan: ProgramPlan | null; currency?: string; t: typeof COPY.en }) {
  if (!plan) return null
  const buffer =
    plan.buffer_status === 'none' ? t.noBuffer
      : plan.buffer_status === 'amount' ? money(plan.buffer, currency)
      : t.bufferUnknown
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <h4 className="text-white font-semibold mb-3">{title}</h4>
      <Row label={t.profitTarget} value={money(plan.profit_target, currency)} />
      <Row label={t.maxLoss} value={money(plan.maximum_loss_limit, currency)} />
      <Row label={t.dailyLoss} value={money(plan.daily_loss_limit, currency)} />
      <Row label={t.drawdown} value={plan.drawdown_type} />
      <Row label={t.buffer} value={buffer} />
      <Row label={t.contracts} value={plan.max_contracts === null ? null : String(plan.max_contracts)} />
      <Row label={t.scaling} value={plan.contract_scaling === null ? null : plan.contract_scaling ? '✓' : '—'} />
      <Row label={t.minDays} value={plan.minimum_trading_days === null ? null : String(plan.minimum_trading_days)} />
      <Row label={t.consistency} value={plan.consistency_rule === null ? t.none : pct(plan.consistency_rule)} />
      <Row label={t.split} value={pct(plan.profit_split)} />
      <Row label={t.payoutCap} value={money(plan.payout_cap, currency)} />
      <Row label={t.minPayout} value={money(plan.minimum_payout, currency)} />
      <Row label={t.betweenPayouts} value={plan.days_between_payouts === null ? null : String(plan.days_between_payouts)} />
      <Row label={t.resetFee} value={plan.reset_fee === null ? t.notApplicable : money(plan.reset_fee, currency)} />
      <Row label={t.activationFee} value={plan.activation_fee === null ? null : money(plan.activation_fee, currency)} />
    </div>
  )
}

export default function ProgramExplorer({
  data,
  firmSlug,
  locale = 'en',
  ctaLabel,
}: {
  data: FirmProgramData
  firmSlug: string
  locale?: string
  ctaLabel: string
}) {
  // Les sept locales. La version precedente n en connaissait que deux, et la
  // page espagnole affichait « Choose your program » et « Price today ».
  const t = COPY[locale as keyof typeof COPY] ?? COPY.en

  // La sélection est la source unique de vérité : marché, puis programme,
  // puis variante, puis taille. Chaque niveau filtre le suivant, et un choix
  // devenu invalide retombe sur la première valeur disponible plutôt que
  // d'afficher un plan vide ou, pire, celui d'un autre programme.
  const markets = useMemo(() => marketsOf(data), [data])
  const [market, setMarket] = useState(markets[0] ?? 'cfd')
  const activeMarket = markets.includes(market) ? market : markets[0]

  const visibles = useMemo(
    () => data.programs.filter((p) => (p.market || 'cfd') === activeMarket),
    [data.programs, activeMarket]
  )

  const [programSlug, setProgramSlug] = useState('')
  const program = visibles.find((p) => p.slug === programSlug) ?? visibles[0]

  const variants = useMemo(() => (program ? variantsOf(program) : []), [program])
  const [variantKey, setVariantKey] = useState<string | null>(null)
  const activeVariant = variants.some((v) => v.key === variantKey)
    ? variantKey
    : variants[0]?.key ?? null

  const sizes = useMemo(
    () => (program ? sizesOf(program, activeVariant) : []),
    [program, activeVariant]
  )
  const [size, setSize] = useState<number | null>(null)
  const activeSize = size !== null && sizes.includes(size) ? size : sizes[0]

  if (!program) return null

  // Un programme sans plan est volontaire : recopier la grille d'un produit
  // voisin serait pire que de dire que la vérification est en cours.
  const enVerification = program.plans.length === 0

  const regular = enVerification ? null : regularPriceFor(program, activeSize, activeVariant)
  const currency = enVerification ? 'USD' : currencyFor(program, activeSize, activeVariant)
  const price = priceFor(data.promotions, program.slug, activeSize, regular, new Date(), activeVariant)
  const phases = enVerification ? [] : evaluationPhases(program, activeSize, activeVariant)
  const funded = enVerification ? null : planFor(program, 'sim_funded', activeSize, activeVariant)
  const bundle = data.bundles.filter((b) => b.program_slug === program.slug)
  // Les règles du programme choisi, plus celles de la firme. Jamais celles
  // d'un autre programme.
  const rules = rulesFor(data, program.slug)

  // L'objet unique que TOUTES les sections consomment. Tant qu'elles lisaient
  // chacune leur propre source, une seule suivait la sélection.
  const selected = buildSelectedPlan(data, program, activeVariant, activeSize)
  const caps = deriveCapabilities(data, null)

  // Le CTA du configurateur portait `source=logo&placement=logo` : il reutilisait
  // le lien de la tuile logo, si bien que chaque clic sur « configurer » etait
  // journalise comme un clic sur le logo, sans programme ni taille. Il est
  // desormais construit a partir de la selection courante.
  const ctaHref = buildAffiliateUrl(firmSlug, {
    placement: 'configurator',
    locale,
    program: program.slug,
    size: activeSize === undefined ? null : String(activeSize),
    optKey: activeVariant ? 'variant' : null,
    optValue: activeVariant,
  })

  return (
    <section id="programs" className="scroll-mt-28">
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">{t.eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{t.step1}</h2>
      <p className="text-gray-400 mb-5">{t.intro}</p>

      {/* Étape 0 — marché. Affiché seulement quand la firme en a plusieurs :
          FTMO sépare CFD et Futures, The5ers y ajoute les actions. Sans ce
          filtre, les règles Futures apparaissaient sous un produit CFD. */}
      {markets.length > 1 && (
        <div role="radiogroup" aria-label={t.market} className="flex flex-wrap gap-2 mb-5">
          {markets.map((m) => {
            const on = m === activeMarket
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => { setMarket(m); setProgramSlug(''); setVariantKey(null); setSize(null) }}
                className={`min-h-[44px] px-4 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  on ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-700'
                }`}
              >
                {t.markets[m] ?? m}
              </button>
            )
          })}
        </div>
      )}

      {/* Étape 1 — programme */}
      <div role="radiogroup" aria-label={t.step1} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {visibles.map((p) => {
          const on = p.slug === program.slug
          return (
            <button
              key={p.slug}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => { setProgramSlug(p.slug); setVariantKey(null); setSize(null) }}
              className={`min-h-[44px] text-left p-4 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                on ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              <span className="block text-white font-semibold">{p.name}</span>
              <span className="block text-gray-400 text-xs mt-1">
                {p.kind === 'instant' ? t.noEvaluation : `${sizesOf(p).length} sizes`}
              </span>
            </button>
          )
        })}
      </div>

      {/* Un programme sans plan : on le dit, on n'invente pas sa grille. */}
      {enVerification && (
        <p className="mb-6 text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          {t.pending}
        </p>
      )}

      {/* Étape 1 bis — variante. Standard et Swing, ou 8/5 et 10/5 : deux
          offres de même taille qui n'ont ni le même prix ni les mêmes règles. */}
      {variants.length > 1 && (
        <>
          <h3 className="text-white font-semibold mb-2">{t.variant}</h3>
          <div role="radiogroup" aria-label={t.variant} className="flex flex-wrap gap-2 mb-6">
            {variants.map((v) => {
              const on = v.key === activeVariant
              return (
                <button
                  key={v.key ?? 'base'}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => { setVariantKey(v.key); setSize(null) }}
                  className={`min-h-[44px] px-4 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    on ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {v.label || '—'}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Étape 2 — taille */}
      <h3 className="text-white font-semibold mb-2">{t.step2}</h3>
      <div role="radiogroup" aria-label={t.step2} className="flex flex-wrap gap-2 mb-6">
        {sizes.map((s) => {
          const on = s === activeSize
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSize(s)}
              className={`min-h-[44px] px-4 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                on ? 'border-emerald-500 bg-emerald-500/10 text-white' : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-gray-700'
              }`}
            >
              ${(s / 1000).toLocaleString('en-US')}K
            </button>
          )
        })}
      </div>

      {/* Prix */}
      {!enVerification && (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-gray-400 text-sm">{t.priceToday}</span>
          <span className="text-3xl font-bold text-white">{money(price.final, currency) ?? '—'}</span>
          {price.promotion && price.regular !== price.final && (
            <span className="text-gray-500 line-through">{money(price.regular, currency)}</span>
          )}
          {price.promotion?.code && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-xs border border-emerald-500/30">
              {price.promotion.code}
            </span>
          )}
        </div>
        {/* Jamais « meilleur prix » sur un code battu par l'offre publique. */}
        {price.betterPublic && (
          <p className="mt-3 text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            {t.publicBetter(price.betterPublic.code ?? '—', pct(price.betterPublic.discount_value) ?? '')}
          </p>
        )}
        {price.promotion && !price.promotion.expires_at && (
          <p className="mt-2 text-gray-500 text-xs">{t.noExpiry}</p>
        )}
        <a
          href={ctaHref}
          rel="sponsored nofollow noopener"
          target="_blank"
          className="mt-4 inline-flex items-center justify-center min-h-[44px] px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          {ctaLabel}
        </a>
      </div>
      )}

      {/* Résumé collant à droite sur ordinateur, sections pilotées par la
          sélection en dessous. Toutes lisent `selected`. */}
      {!enVerification && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 mb-10">
          <div className="min-w-0 order-2 lg:order-1">
            <CriticalRules sel={selected} />
          </div>
          <div className="order-1 lg:order-2">
            <SelectedPlanSummary sel={selected} ctaHref={ctaHref} ctaLabel={ctaLabel} />
          </div>
        </div>
      )}

      {/* Phases d'évaluation puis compte financé, jamais mélangés.
          Un 2-Step affiche ses deux phases séparément : le second objectif
          n'a plus à se cacher dans une note. */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {phases.length > 0 ? (
          phases.map((pl, i) => (
            <PhaseCard
              key={pl.phase}
              title={phases.length > 1 ? `${t.evaluation} ${i + 1}` : t.evaluation}
              plan={pl}
              currency={currency}
              t={t}
            />
          ))
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 text-gray-400 text-sm">
            {t.noEvaluation}
          </div>
        )}
        <PhaseCard title={t.funded} plan={funded} currency={currency} t={t} />
      </div>

      {/* Bundle : capacité d'achat, distincte du plafond financé */}
      {bundle.length > 0 && (
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-1">{t.bundle}</h3>
          <p className="text-gray-400 text-sm mb-3">{t.bundleIntro}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {bundle.map((b) => (
              <div
                key={b.account_number}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  b.status === 'free'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-gray-800 bg-gray-900/50 text-gray-300'
                }`}
              >
                <span className="block text-xs text-gray-500">{t.account} {b.account_number}</span>
                {b.status === 'free' ? t.free : '−' + pct(b.discount_percent)}
              </div>
            ))}
          </div>
          {program.max_funded_accounts !== null && (
            <p className="text-amber-300 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              {t.fundedLimit(program.max_funded_accounts)}
              {program.max_funded_note ? <span className="block text-amber-200/80 text-xs mt-1">{program.max_funded_note}</span> : null}
            </p>
          )}
        </div>
      )}

      {/* Règles, avec le niveau de gravité en toutes lettres */}
      {rules.length > 0 && (
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-3">{t.rules}</h3>
          <ul className="space-y-2">
            {rules.map((r) => {
              const sev = (r.severity ?? 'needs_confirmation') as Severity
              const style = SEVERITY_STYLE[sev]
              return (
                <li key={r.scope + r.title} className="flex gap-3 items-start bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                  <span className={`shrink-0 px-2 py-0.5 rounded-md border text-[11px] font-medium ${style.badge}`}>
                    <span aria-hidden="true" className="mr-1">{style.mark}</span>
                    {t.severity[sev]}
                  </span>
                  <span className="text-sm">
                    <span className="text-white font-medium">{r.title}</span>
                    {r.detail ? <span className="block text-gray-400 mt-0.5">{r.detail}</span> : null}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Plateformes */}
      {data.platforms.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-2">{t.platforms}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.platforms.map((p) => (
              <span key={p.name} className="px-3 py-1.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-300 text-sm">
                {p.name}
              </span>
            ))}
          </div>
          {/* Le brief interdit d'affirmer qu'elles sont toutes gratuites. */}
          <p className="text-gray-500 text-xs">{t.noSurcharge}</p>
        </div>
      )}

      {/* Décision d'abord, exhaustivité ensuite : l'ordre est celui du brief. */}
      <div className="mt-10">
        <FundingTimeline sel={selected} />
        <TrueCost sel={selected} caps={caps} />
        <PayoutConditions sel={selected} />
        <SuitabilityVerdict sel={selected} />
        <CompleteSpecifications sel={selected} />
        <EvidenceLog sel={selected} />
      </div>
    </section>
  )
}
